import { AnyDict, ApiResultKioskQuery } from "./lib/apitypes";
import { BarChart, ColumnChart, PieChart } from "@toast-ui/chart";
import { types } from "sass";
import String = types.String;
// @ts-ignore
// import { BoxSeriesDataType, BoxSeriesType } from "@toast-ui/chart/dist/types/options";

export const RESULT_VIEW_TYPE_PIECHART = 2;
export const RESULT_VIEW_TYPE_BARCHART = 3;

// export const renderChartSelector = ()

export function chartType2String (chartType: typeof RESULT_VIEW_TYPE_BARCHART | typeof RESULT_VIEW_TYPE_PIECHART): string {
    switch(chartType) {
        case RESULT_VIEW_TYPE_BARCHART:
            return "bar";
        case RESULT_VIEW_TYPE_PIECHART:
            return "pie";
    }
}

export const getChartsByType = (chartType: typeof RESULT_VIEW_TYPE_BARCHART | typeof RESULT_VIEW_TYPE_PIECHART,
                                charts: AnyDict):Array<string> => {
    let filterType = ""
    filterType = chartType2String(chartType)
    return [...Object.keys(charts).filter(chartId => charts[chartId].type === filterType)]
}

function reduceDataByCategory(dataByCategory: Map<string, number>, sum: number, chartDef: AnyDict) {
    function addToOther(v: number) {
        let others:number = dataByCategory.get("others")
        if (typeof others === "undefined") others = 0
        dataByCategory.set("others", others + v)
    }
    let threshold = chartDef.hasOwnProperty("category_threshold")?chartDef.category_threshold:0
    let maxCategories = chartDef.hasOwnProperty("max_categories")?chartDef.max_categories:0

    if (threshold + maxCategories == 0) return

    if (threshold > 0) {
        let categories = [...dataByCategory.keys()]
        for (let category of categories) {
            const v = dataByCategory.get(category)
            if (v * 100 / sum < threshold) {
                addToOther(v)
                dataByCategory.delete(category)
            }
        }
    }
    if (maxCategories > 0 && dataByCategory.size > maxCategories) {
        let sortedCategories = [...dataByCategory.keys()]
        sortedCategories.sort((a, b) => dataByCategory.get(b) - dataByCategory.get(a))
        for (let i=maxCategories;i < sortedCategories.length;i++) {
            const v = dataByCategory.get(sortedCategories[i])
            addToOther(v)
            dataByCategory.delete(sortedCategories[i])
        }
    }
}

export const refreshPieChart = (graphDiv: HTMLElement, queryResult: ApiResultKioskQuery,
                                width: string, height: string, chartDef: AnyDict) => {

    console.log("ChartDef", chartDef)
    let categoryField = chartDef.categories
    let dataField = chartDef.values
    let operation = chartDef.hasOwnProperty("operation")?chartDef.operation:"sum"
    let sortBy = chartDef.hasOwnProperty("sort_by")?chartDef.sort_by:"category"
    let sortOrder = chartDef.hasOwnProperty("sort_order")?chartDef.sort_order:"asc"
    let sum = 0
    const dataByCategory: Map<string, number> = new Map()

    queryResult.records.forEach(record => {
        const category = record[categoryField]?record[categoryField]:""
        if (!dataByCategory.has(category)) {
            dataByCategory.set(category, 0)
        }
        if (record[dataField]) {
            let v = operation === "count"?1:record[dataField]
            sum += v
            dataByCategory.set(category, v + dataByCategory.get(category))
        }
    })
    console.log(dataByCategory)

    reduceDataByCategory(dataByCategory, sum, chartDef)

    const series: Array<{name: string, data: number}> = []
    let sortedCategories = [...dataByCategory.keys()]
    if (sortBy === "category") {
        sortedCategories.sort()
    } else {
        sortedCategories.sort((a,b) => dataByCategory.get(a) - dataByCategory.get(b))
    }
    if (sortOrder === "desc") sortedCategories = sortedCategories.reverse()

    for (const k of sortedCategories) {
        if (dataByCategory.get(k) > 0) {
            series.push({name: k, data: dataByCategory.get(k) * 100 / (sum?sum:1)})
        }
    }
    //
    // queryResult.records.reduce((total: number, r: AnyDict) => {
    //     return total - parseFloat(r.quantity?.toString());
    // })

    const data = {
        categories: [categoryField],
        series: series,
    };
    const theme = {
        series: {
            dataLabels: {
                fontFamily: "Noto Sans",
                fontSize: 14,
                useSeriesColor: false,
                lineWidth: 2,
                textStrokeColor: "black",
                shadowColor: "black",
                color: "white",
                shadowBlur: 0,
                callout: {
                    lineWidth: 3,
                    lineColor: "black",
                    useSeriesColor: true,
                },
                pieSeriesName: {
                    useSeriesColor: false,
                    color: "black",
                    fontFamily: "Noto Sans",
                    fontSize: 13,
                    textBubble: {
                        visible: true,
                        paddingX: 1,
                        paddingY: 1,
                        backgroundColor: "white",
                        shadowOffsetX: 0,
                        shadowOffsetY: 0,
                        shadowBlur: 0,
                        shadowColor: "rgba(0, 0, 0, 0)",
                    },
                },
            },
        },
    };

    const options = {
        chart: { width: parseInt(width), height: parseInt(height)},
        series: {
            dataLabels: {
                visible: true,
                pieSeriesName: { visible: true, anchor: "outer" },
            },
        },
        theme,
    };

    // @ts-ignore
    const chart = new PieChart({ el: graphDiv, data: data, options: options });
    //chart.hideTooltip();

}

export const refreshBarChart = (graphDiv: HTMLElement, queryResult: ApiResultKioskQuery,
                                width: string, height: string, chartDef: AnyDict) => {

    console.log("ChartDef", chartDef)
    let categoryField = chartDef.categories
    let dataField = chartDef.values
    let sum = 0
    const dataByCategory: Map<string, number> = new Map()

    queryResult.records.forEach(record => {
        const category = record[categoryField]?record[categoryField]:""
        if (!dataByCategory.has(category)) {
            dataByCategory.set(category, 0)
        }
        if (record[dataField]) {
            sum += record[dataField]
            dataByCategory.set(category, record[dataField] + dataByCategory.get(category))
        }
    })
    console.log(dataByCategory)

    reduceDataByCategory(dataByCategory, sum, chartDef)

    // const series: Array<{name: string, data: Array<number>}> = []
    const dataPoints: Array<number> = []
    const categories: Array<string> = []
    for (const k of dataByCategory.keys()) {
        if (dataByCategory.get(k) > 0) {
            // series.push({name: k, data: [dataByCategory.get(k)]})
            categories.push(k)
            dataPoints.push(dataByCategory.get(k))
        }
    }
    const series = [{name: chartDef.categories, data: dataPoints, colorByCategories: "true"}]
    //
    // queryResult.records.reduce((total: number, r: AnyDict) => {
    //     return total - parseFloat(r.quantity?.toString());
    // })

    const data = {
        categories: categories,
        series: series,
    };
    const theme = {
        xAxis: {
            label: {
                color: "black",
                fontFamily: "Noto Sans",
                fontSize: 12
            }
        },
        series: {
            dataLabels: {
                fontFamily: "Noto Sans",
                fontSize: 14,
                useSeriesColor: false,
                // lineWidth: 2,
                // textStrokeColor: "black",
                // shadowColor: "black",
                color: "black",
                shadowBlur: 0,
                callout: {
                    lineWidth: 3,
                    lineColor: "black",
                    useSeriesColor: true,
                },
            },
        },
    };

    const options = {
        chart: { width: parseInt(width), height: parseInt(height)},
        xAxis: {title:chartDef.categories},
        yAxis: {title:chartDef.values},
        series: {
            dataLabels: {
                visible: true,
                pieSeriesName: { visible: true, anchor: "outer" },
            },
        },
        theme,
        legend: {
            visible: false
        }
    };
    const chart = new ColumnChart({ el: graphDiv, data: data, options: options });
    //chart.hideTooltip();

}

export const refreshBarChart2 = (graphDiv: HTMLElement, queryResult: ApiResultKioskQuery,
                                width: string, height: string, chartDef: AnyDict) => {

    let categoryField = chartDef.categories
    let dataField = chartDef.values
    let operation = chartDef.hasOwnProperty("operation")?chartDef.operation:"sum"
    let sortBy = chartDef.hasOwnProperty("sort_by")?chartDef.sort_by:"category"
    let sortOrder = chartDef.hasOwnProperty("sort_order")?chartDef.sort_order:"asc"
    let sum = 0
    const dataByCategory: Map<string, number> = new Map()

    queryResult.records.forEach(record => {
        const category = record[categoryField]?record[categoryField]:""
        if (!dataByCategory.has(category)) {
            dataByCategory.set(category, 0)
        }
        if (record[dataField]) {
            let v = operation === "count"?1:record[dataField]
            sum += v
            dataByCategory.set(category, v + dataByCategory.get(category))
        }
    })

    reduceDataByCategory(dataByCategory, sum, chartDef)

    const series = []  // Array<BoxSeriesType<BoxSeriesDataType>> = []
    let sortedCategories = [...dataByCategory.keys()]
    if (sortBy === "category") {
        sortedCategories.sort()
    } else {
        sortedCategories.sort((a,b) => dataByCategory.get(a) - dataByCategory.get(b))
    }
    if (sortOrder === "desc") sortedCategories = sortedCategories.reverse()
    for (const k of sortedCategories) {
        if (dataByCategory.get(k) > 0) {
            // series.push({name: k, data: [dataByCategory.get(k)]})
            series.push({name: k, data:[dataByCategory.get(k)]})
        }
    }

    const data = {
        categories: [""],
        series: series,
    };
    const theme = {
        xAxis: {
            label: {
                color: "black",
                fontFamily: "Noto Sans",
                fontSize: 12
            }
        },
        series: {
            dataLabels: {
                fontFamily: "Noto Sans",
                fontSize: 14,
                useSeriesColor: false,
                selectable: true,
                // lineWidth: 2,
                // textStrokeColor: "black",
                // shadowColor: "black",
                color: "black",
                shadowBlur: 0,
                callout: {
                    lineWidth: 3,
                    lineColor: "black",
                    useSeriesColor: true,
                },
            },
        },
    };

    const options = {
        chart: { width: parseInt(width), height: parseInt(height)},
        xAxis: {title:chartDef.categories},
        yAxis: {title:chartDef.values},
        series: {
            dataLabels: {
                visible: true,
                pieSeriesName: { visible: true, anchor: "outer" },
            },
        },
        theme,
        legend: {
            visible: true
        }
    };
    const chart = new ColumnChart({ el: graphDiv, options: options, data: data});
    //chart.hideTooltip();

}

