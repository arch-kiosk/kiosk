import {
    Action,
    INIT_APP,
    SET_CONSTANTS,
    SET_INIT_STATE,
    SET_SELECTOR, SelectorAction,
    SET_DATAVIEW_CLASSVALUE,
    SetDataViewClassValueAction, ConstantsAction, SetInitStateAction
// @ts-ignore
} from './actions.ts'
import {Constant} from "../lib/applib";

export class State {
    selectors: {[key: string]: object} = {}
    dataviews: {[key: string]: object} = {}
    constants: Array<Constant> = []
    initState: number = 0
}

const INITIAL_STATE = new State();

export const reducer = (state: State = INITIAL_STATE, action: Action): State => {
    switch (action.type) {
        case INIT_APP: {
            console.log('Reducer: initializing App ');
            return state;
        }
        case SET_INIT_STATE: {
            console.log('Reducer: set init state ');
            let newState: State = {...state};
            newState.initState = (<SetInitStateAction>action).value
            return newState;
        }
        case SET_SELECTOR: {
            console.log('Reducer: set selector ');
            let newState: State = {...state};
            const selector: string = (<SelectorAction>action).selectorName
            newState.selectors[selector] = (<SelectorAction>action).value
            return newState;
        }
        case SET_DATAVIEW_CLASSVALUE: {
            console.log('Reducer: setting dataview class value ');
            let classValueAction = <SetDataViewClassValueAction>action
            let newState: State = {...state};
            const dataViewName = classValueAction.dataView
            if (!(dataViewName in newState.dataviews)) {
                newState.dataviews[dataViewName] = {}
            }
            let dataView = <{[key: string]: object}>newState.dataviews[dataViewName]
            dataView[classValueAction.key] = classValueAction.value
            return newState;
        }
        case SET_CONSTANTS: {
            console.log('Reducer: set constants ');
            let newState: State = {...state};
            newState.constants = (<ConstantsAction>action).constants
            if (newState.initState == 0)
                newState.initState = 1
            return newState;
        }
        case '@@INIT':
            return state;
        default:
            console.log(`Unknown action received in reducer`);
            console.log(action)
            return state;
    }
}


