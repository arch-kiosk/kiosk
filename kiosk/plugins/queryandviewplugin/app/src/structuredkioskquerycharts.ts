import { AnyDict, ApiResultKioskQuery } from "./lib/apitypes";
import { BarChart, ColumnChart, PieChart } from "@toast-ui/chart";
import { types } from "sass";
import String = types.String;


export const refreshPieChart = (graphDiv: HTMLElement, queryResult: ApiResultKioskQuery,
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

    const series: Array<{name: string, data: number}> = []
    for (const k of dataByCategory.keys()) {
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
        chart: { title:chartDef?.title, width: parseInt(width), height: parseInt(height)},
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
        chart: { title:chartDef?.title, width: parseInt(width), height: parseInt(height)},
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

