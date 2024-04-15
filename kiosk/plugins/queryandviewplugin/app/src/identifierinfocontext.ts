import {createContext} from '@lit/context';
import { ApiResultContextsFullIdentifierInformation } from "./lib/apitypes";
export const identifierInfoContext = createContext<ApiResultContextsFullIdentifierInformation[]>('identifierInfoContext')