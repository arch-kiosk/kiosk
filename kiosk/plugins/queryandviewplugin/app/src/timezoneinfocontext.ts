import {createContext} from '@lit/context';
import { KioskTimeZones } from "@arch-kiosk/kiosktsapplib";
export const timeZoneInfoContext = createContext<KioskTimeZones>('timeZoneInfo')