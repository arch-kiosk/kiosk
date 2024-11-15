import {createContext} from '@lit/context';
import { KioskTimeZones } from "kiosktsapplib";
export const timeZoneInfoContext = createContext<KioskTimeZones>('timeZoneInfo')