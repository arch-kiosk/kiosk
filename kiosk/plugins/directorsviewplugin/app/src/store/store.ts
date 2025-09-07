import {createStore} from 'redux';
// @ts-ignore
import {reducer} from './reducer.ts';

export const store = createStore(reducer,
// @ts-ignore
    window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__());
