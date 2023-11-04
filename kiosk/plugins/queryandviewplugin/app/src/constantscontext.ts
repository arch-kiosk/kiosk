import {createContext} from '@lit-labs/context';
import { Constant } from "./lib/apitypes";
export const constantsContext = createContext<Constant[]>('constants')