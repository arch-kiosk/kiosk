import {Store} from "redux";
//@ts-ignore
import {getSqlDate, Constant} from "../lib/applib.ts";

export const INIT_APP = 'INIT_APP';
export const SET_SELECTOR = 'SET_SELECTOR'
export const SET_DATAVIEW_CLASSVALUE = 'SET_DATAVIEW_CLASSVALUE'
export const SET_CONSTANTS = 'SET_CONSTANTS';
export const SET_INIT_STATE = 'SET_INIT_STATE';


export interface Action {
    type: string,
}

export interface SelectorAction extends Action {
    selectorName: string,
    value: object
}

export interface ConstantsAction extends Action {
    constants: [Constant]
}

export interface SetInitStateAction extends Action {
    value: number
}

export interface SetDataViewClassValueAction extends Action {
    dataView: string
    key: string
    value: any
}

export class StoreDateSelector {
    selectedDate: Date;
}

export class StoreContextSelector {
    selectedContext: string;
    selectedContextType: string;
    selectedUid: string;
}

export class StoreTeamSelector {
    selectedMember: string;
}

export const initApp = (): Action => {
    return {
        type: INIT_APP,
    }
}

export const setSelector = (selectorName: string, value: object): SelectorAction => {
    return {
        type : SET_SELECTOR,
        selectorName: selectorName,
        value: value
    }
}

export const setConstants = (constants: [Constant]): ConstantsAction => {
    return {
        type : SET_CONSTANTS,
        constants: constants
    }
}

export const setInitState = (value: number): SetInitStateAction => {
    return {
        type : SET_CONSTANTS,
        value: value
    }
}

export const setDataViewClassValue = (dataViewName: string, key: string, value: any): SetDataViewClassValueAction => {
    return {
        type: SET_DATAVIEW_CLASSVALUE,
        dataView: dataViewName,
        key : key,
        value: value
    }
}
