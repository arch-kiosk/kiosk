import {createContext} from '@lit-labs/context';
import { ApiResultContextsFullIdentifierInformation } from "./lib/apitypes";
export const identifierInfoContext = createContext<ApiResultContextsFullIdentifierInformation[]>('identifierInfoContext')