import {createContext} from '@lit/context';
import { Constant } from "./lib/apitypes";
export const constantsContext = createContext<Constant[]>('constants')