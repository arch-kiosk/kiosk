var _a;
function setCookie(cname, cvalue, exdays = 0) {
  let d2 = /* @__PURE__ */ new Date();
  d2.setTime(d2.getTime() + exdays * 24 * 60 * 60 * 1e3);
  let expires = "expires=" + d2.toUTCString();
  document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
}
function getCookie(cname) {
  let name = cname + "=";
  let decodedCookie = decodeURIComponent(document.cookie);
  let ca = decodedCookie.split(";");
  for (let i2 = 0; i2 < ca.length; i2++) {
    let c2 = ca[i2];
    while (c2.charAt(0) === " ") {
      c2 = c2.substring(1);
    }
    if (c2.indexOf(name) === 0) {
      return c2.substring(name.length, c2.length);
    }
  }
  return "";
}
const kioskstandardlib = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  getCookie,
  setCookie
}, Symbol.toStringTag, { value: "Module" }));
class LuxonError extends Error {
}
class InvalidDateTimeError extends LuxonError {
  constructor(reason) {
    super(`Invalid DateTime: ${reason.toMessage()}`);
  }
}
class InvalidIntervalError extends LuxonError {
  constructor(reason) {
    super(`Invalid Interval: ${reason.toMessage()}`);
  }
}
class InvalidDurationError extends LuxonError {
  constructor(reason) {
    super(`Invalid Duration: ${reason.toMessage()}`);
  }
}
class ConflictingSpecificationError extends LuxonError {
}
class InvalidUnitError extends LuxonError {
  constructor(unit) {
    super(`Invalid unit ${unit}`);
  }
}
class InvalidArgumentError extends LuxonError {
}
class ZoneIsAbstractError extends LuxonError {
  constructor() {
    super("Zone is an abstract class");
  }
}
const n$4 = "numeric", s$3 = "short", l$2 = "long";
const DATE_SHORT = {
  year: n$4,
  month: n$4,
  day: n$4
};
const DATE_MED = {
  year: n$4,
  month: s$3,
  day: n$4
};
const DATE_MED_WITH_WEEKDAY = {
  year: n$4,
  month: s$3,
  day: n$4,
  weekday: s$3
};
const DATE_FULL = {
  year: n$4,
  month: l$2,
  day: n$4
};
const DATE_HUGE = {
  year: n$4,
  month: l$2,
  day: n$4,
  weekday: l$2
};
const TIME_SIMPLE = {
  hour: n$4,
  minute: n$4
};
const TIME_WITH_SECONDS = {
  hour: n$4,
  minute: n$4,
  second: n$4
};
const TIME_WITH_SHORT_OFFSET = {
  hour: n$4,
  minute: n$4,
  second: n$4,
  timeZoneName: s$3
};
const TIME_WITH_LONG_OFFSET = {
  hour: n$4,
  minute: n$4,
  second: n$4,
  timeZoneName: l$2
};
const TIME_24_SIMPLE = {
  hour: n$4,
  minute: n$4,
  hourCycle: "h23"
};
const TIME_24_WITH_SECONDS = {
  hour: n$4,
  minute: n$4,
  second: n$4,
  hourCycle: "h23"
};
const TIME_24_WITH_SHORT_OFFSET = {
  hour: n$4,
  minute: n$4,
  second: n$4,
  hourCycle: "h23",
  timeZoneName: s$3
};
const TIME_24_WITH_LONG_OFFSET = {
  hour: n$4,
  minute: n$4,
  second: n$4,
  hourCycle: "h23",
  timeZoneName: l$2
};
const DATETIME_SHORT = {
  year: n$4,
  month: n$4,
  day: n$4,
  hour: n$4,
  minute: n$4
};
const DATETIME_SHORT_WITH_SECONDS = {
  year: n$4,
  month: n$4,
  day: n$4,
  hour: n$4,
  minute: n$4,
  second: n$4
};
const DATETIME_MED = {
  year: n$4,
  month: s$3,
  day: n$4,
  hour: n$4,
  minute: n$4
};
const DATETIME_MED_WITH_SECONDS = {
  year: n$4,
  month: s$3,
  day: n$4,
  hour: n$4,
  minute: n$4,
  second: n$4
};
const DATETIME_MED_WITH_WEEKDAY = {
  year: n$4,
  month: s$3,
  day: n$4,
  weekday: s$3,
  hour: n$4,
  minute: n$4
};
const DATETIME_FULL = {
  year: n$4,
  month: l$2,
  day: n$4,
  hour: n$4,
  minute: n$4,
  timeZoneName: s$3
};
const DATETIME_FULL_WITH_SECONDS = {
  year: n$4,
  month: l$2,
  day: n$4,
  hour: n$4,
  minute: n$4,
  second: n$4,
  timeZoneName: s$3
};
const DATETIME_HUGE = {
  year: n$4,
  month: l$2,
  day: n$4,
  weekday: l$2,
  hour: n$4,
  minute: n$4,
  timeZoneName: l$2
};
const DATETIME_HUGE_WITH_SECONDS = {
  year: n$4,
  month: l$2,
  day: n$4,
  weekday: l$2,
  hour: n$4,
  minute: n$4,
  second: n$4,
  timeZoneName: l$2
};
class Zone {
  /**
   * The type of zone
   * @abstract
   * @type {string}
   */
  get type() {
    throw new ZoneIsAbstractError();
  }
  /**
   * The name of this zone.
   * @abstract
   * @type {string}
   */
  get name() {
    throw new ZoneIsAbstractError();
  }
  /**
   * The IANA name of this zone.
   * Defaults to `name` if not overwritten by a subclass.
   * @abstract
   * @type {string}
   */
  get ianaName() {
    return this.name;
  }
  /**
   * Returns whether the offset is known to be fixed for the whole year.
   * @abstract
   * @type {boolean}
   */
  get isUniversal() {
    throw new ZoneIsAbstractError();
  }
  /**
   * Returns the offset's common name (such as EST) at the specified timestamp
   * @abstract
   * @param {number} ts - Epoch milliseconds for which to get the name
   * @param {Object} opts - Options to affect the format
   * @param {string} opts.format - What style of offset to return. Accepts 'long' or 'short'.
   * @param {string} opts.locale - What locale to return the offset name in.
   * @return {string}
   */
  offsetName(ts, opts) {
    throw new ZoneIsAbstractError();
  }
  /**
   * Returns the offset's value as a string
   * @abstract
   * @param {number} ts - Epoch milliseconds for which to get the offset
   * @param {string} format - What style of offset to return.
   *                          Accepts 'narrow', 'short', or 'techie'. Returning '+6', '+06:00', or '+0600' respectively
   * @return {string}
   */
  formatOffset(ts, format) {
    throw new ZoneIsAbstractError();
  }
  /**
   * Return the offset in minutes for this zone at the specified timestamp.
   * @abstract
   * @param {number} ts - Epoch milliseconds for which to compute the offset
   * @return {number}
   */
  offset(ts) {
    throw new ZoneIsAbstractError();
  }
  /**
   * Return whether this Zone is equal to another zone
   * @abstract
   * @param {Zone} otherZone - the zone to compare
   * @return {boolean}
   */
  equals(otherZone) {
    throw new ZoneIsAbstractError();
  }
  /**
   * Return whether this Zone is valid.
   * @abstract
   * @type {boolean}
   */
  get isValid() {
    throw new ZoneIsAbstractError();
  }
}
let singleton$1 = null;
class SystemZone extends Zone {
  /**
   * Get a singleton instance of the local zone
   * @return {SystemZone}
   */
  static get instance() {
    if (singleton$1 === null) {
      singleton$1 = new SystemZone();
    }
    return singleton$1;
  }
  /** @override **/
  get type() {
    return "system";
  }
  /** @override **/
  get name() {
    return new Intl.DateTimeFormat().resolvedOptions().timeZone;
  }
  /** @override **/
  get isUniversal() {
    return false;
  }
  /** @override **/
  offsetName(ts, { format, locale }) {
    return parseZoneInfo(ts, format, locale);
  }
  /** @override **/
  formatOffset(ts, format) {
    return formatOffset(this.offset(ts), format);
  }
  /** @override **/
  offset(ts) {
    return -new Date(ts).getTimezoneOffset();
  }
  /** @override **/
  equals(otherZone) {
    return otherZone.type === "system";
  }
  /** @override **/
  get isValid() {
    return true;
  }
}
let dtfCache = {};
function makeDTF(zone) {
  if (!dtfCache[zone]) {
    dtfCache[zone] = new Intl.DateTimeFormat("en-US", {
      hour12: false,
      timeZone: zone,
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      era: "short"
    });
  }
  return dtfCache[zone];
}
const typeToPos = {
  year: 0,
  month: 1,
  day: 2,
  era: 3,
  hour: 4,
  minute: 5,
  second: 6
};
function hackyOffset(dtf, date) {
  const formatted = dtf.format(date).replace(/\u200E/g, ""), parsed = /(\d+)\/(\d+)\/(\d+) (AD|BC),? (\d+):(\d+):(\d+)/.exec(formatted), [, fMonth, fDay, fYear, fadOrBc, fHour, fMinute, fSecond] = parsed;
  return [fYear, fMonth, fDay, fadOrBc, fHour, fMinute, fSecond];
}
function partsOffset(dtf, date) {
  const formatted = dtf.formatToParts(date);
  const filled = [];
  for (let i2 = 0; i2 < formatted.length; i2++) {
    const { type, value } = formatted[i2];
    const pos = typeToPos[type];
    if (type === "era") {
      filled[pos] = value;
    } else if (!isUndefined(pos)) {
      filled[pos] = parseInt(value, 10);
    }
  }
  return filled;
}
let ianaZoneCache = {};
class IANAZone extends Zone {
  /**
   * @param {string} name - Zone name
   * @return {IANAZone}
   */
  static create(name) {
    if (!ianaZoneCache[name]) {
      ianaZoneCache[name] = new IANAZone(name);
    }
    return ianaZoneCache[name];
  }
  /**
   * Reset local caches. Should only be necessary in testing scenarios.
   * @return {void}
   */
  static resetCache() {
    ianaZoneCache = {};
    dtfCache = {};
  }
  /**
   * Returns whether the provided string is a valid specifier. This only checks the string's format, not that the specifier identifies a known zone; see isValidZone for that.
   * @param {string} s - The string to check validity on
   * @example IANAZone.isValidSpecifier("America/New_York") //=> true
   * @example IANAZone.isValidSpecifier("Sport~~blorp") //=> false
   * @deprecated For backward compatibility, this forwards to isValidZone, better use `isValidZone()` directly instead.
   * @return {boolean}
   */
  static isValidSpecifier(s2) {
    return this.isValidZone(s2);
  }
  /**
   * Returns whether the provided string identifies a real zone
   * @param {string} zone - The string to check
   * @example IANAZone.isValidZone("America/New_York") //=> true
   * @example IANAZone.isValidZone("Fantasia/Castle") //=> false
   * @example IANAZone.isValidZone("Sport~~blorp") //=> false
   * @return {boolean}
   */
  static isValidZone(zone) {
    if (!zone) {
      return false;
    }
    try {
      new Intl.DateTimeFormat("en-US", { timeZone: zone }).format();
      return true;
    } catch (e2) {
      return false;
    }
  }
  constructor(name) {
    super();
    this.zoneName = name;
    this.valid = IANAZone.isValidZone(name);
  }
  /**
   * The type of zone. `iana` for all instances of `IANAZone`.
   * @override
   * @type {string}
   */
  get type() {
    return "iana";
  }
  /**
   * The name of this zone (i.e. the IANA zone name).
   * @override
   * @type {string}
   */
  get name() {
    return this.zoneName;
  }
  /**
   * Returns whether the offset is known to be fixed for the whole year:
   * Always returns false for all IANA zones.
   * @override
   * @type {boolean}
   */
  get isUniversal() {
    return false;
  }
  /**
   * Returns the offset's common name (such as EST) at the specified timestamp
   * @override
   * @param {number} ts - Epoch milliseconds for which to get the name
   * @param {Object} opts - Options to affect the format
   * @param {string} opts.format - What style of offset to return. Accepts 'long' or 'short'.
   * @param {string} opts.locale - What locale to return the offset name in.
   * @return {string}
   */
  offsetName(ts, { format, locale }) {
    return parseZoneInfo(ts, format, locale, this.name);
  }
  /**
   * Returns the offset's value as a string
   * @override
   * @param {number} ts - Epoch milliseconds for which to get the offset
   * @param {string} format - What style of offset to return.
   *                          Accepts 'narrow', 'short', or 'techie'. Returning '+6', '+06:00', or '+0600' respectively
   * @return {string}
   */
  formatOffset(ts, format) {
    return formatOffset(this.offset(ts), format);
  }
  /**
   * Return the offset in minutes for this zone at the specified timestamp.
   * @override
   * @param {number} ts - Epoch milliseconds for which to compute the offset
   * @return {number}
   */
  offset(ts) {
    const date = new Date(ts);
    if (isNaN(date)) return NaN;
    const dtf = makeDTF(this.name);
    let [year, month, day, adOrBc, hour, minute, second] = dtf.formatToParts ? partsOffset(dtf, date) : hackyOffset(dtf, date);
    if (adOrBc === "BC") {
      year = -Math.abs(year) + 1;
    }
    const adjustedHour = hour === 24 ? 0 : hour;
    const asUTC = objToLocalTS({
      year,
      month,
      day,
      hour: adjustedHour,
      minute,
      second,
      millisecond: 0
    });
    let asTS = +date;
    const over = asTS % 1e3;
    asTS -= over >= 0 ? over : 1e3 + over;
    return (asUTC - asTS) / (60 * 1e3);
  }
  /**
   * Return whether this Zone is equal to another zone
   * @override
   * @param {Zone} otherZone - the zone to compare
   * @return {boolean}
   */
  equals(otherZone) {
    return otherZone.type === "iana" && otherZone.name === this.name;
  }
  /**
   * Return whether this Zone is valid.
   * @override
   * @type {boolean}
   */
  get isValid() {
    return this.valid;
  }
}
let intlLFCache = {};
function getCachedLF(locString, opts = {}) {
  const key = JSON.stringify([locString, opts]);
  let dtf = intlLFCache[key];
  if (!dtf) {
    dtf = new Intl.ListFormat(locString, opts);
    intlLFCache[key] = dtf;
  }
  return dtf;
}
let intlDTCache = {};
function getCachedDTF(locString, opts = {}) {
  const key = JSON.stringify([locString, opts]);
  let dtf = intlDTCache[key];
  if (!dtf) {
    dtf = new Intl.DateTimeFormat(locString, opts);
    intlDTCache[key] = dtf;
  }
  return dtf;
}
let intlNumCache = {};
function getCachedINF(locString, opts = {}) {
  const key = JSON.stringify([locString, opts]);
  let inf = intlNumCache[key];
  if (!inf) {
    inf = new Intl.NumberFormat(locString, opts);
    intlNumCache[key] = inf;
  }
  return inf;
}
let intlRelCache = {};
function getCachedRTF(locString, opts = {}) {
  const { base, ...cacheKeyOpts } = opts;
  const key = JSON.stringify([locString, cacheKeyOpts]);
  let inf = intlRelCache[key];
  if (!inf) {
    inf = new Intl.RelativeTimeFormat(locString, opts);
    intlRelCache[key] = inf;
  }
  return inf;
}
let sysLocaleCache = null;
function systemLocale() {
  if (sysLocaleCache) {
    return sysLocaleCache;
  } else {
    sysLocaleCache = new Intl.DateTimeFormat().resolvedOptions().locale;
    return sysLocaleCache;
  }
}
let weekInfoCache = {};
function getCachedWeekInfo(locString) {
  let data = weekInfoCache[locString];
  if (!data) {
    const locale = new Intl.Locale(locString);
    data = "getWeekInfo" in locale ? locale.getWeekInfo() : locale.weekInfo;
    weekInfoCache[locString] = data;
  }
  return data;
}
function parseLocaleString(localeStr) {
  const xIndex = localeStr.indexOf("-x-");
  if (xIndex !== -1) {
    localeStr = localeStr.substring(0, xIndex);
  }
  const uIndex = localeStr.indexOf("-u-");
  if (uIndex === -1) {
    return [localeStr];
  } else {
    let options;
    let selectedStr;
    try {
      options = getCachedDTF(localeStr).resolvedOptions();
      selectedStr = localeStr;
    } catch (e2) {
      const smaller = localeStr.substring(0, uIndex);
      options = getCachedDTF(smaller).resolvedOptions();
      selectedStr = smaller;
    }
    const { numberingSystem, calendar } = options;
    return [selectedStr, numberingSystem, calendar];
  }
}
function intlConfigString(localeStr, numberingSystem, outputCalendar) {
  if (outputCalendar || numberingSystem) {
    if (!localeStr.includes("-u-")) {
      localeStr += "-u";
    }
    if (outputCalendar) {
      localeStr += `-ca-${outputCalendar}`;
    }
    if (numberingSystem) {
      localeStr += `-nu-${numberingSystem}`;
    }
    return localeStr;
  } else {
    return localeStr;
  }
}
function mapMonths(f2) {
  const ms = [];
  for (let i2 = 1; i2 <= 12; i2++) {
    const dt = DateTime.utc(2009, i2, 1);
    ms.push(f2(dt));
  }
  return ms;
}
function mapWeekdays(f2) {
  const ms = [];
  for (let i2 = 1; i2 <= 7; i2++) {
    const dt = DateTime.utc(2016, 11, 13 + i2);
    ms.push(f2(dt));
  }
  return ms;
}
function listStuff(loc, length, englishFn, intlFn) {
  const mode = loc.listingMode();
  if (mode === "error") {
    return null;
  } else if (mode === "en") {
    return englishFn(length);
  } else {
    return intlFn(length);
  }
}
function supportsFastNumbers(loc) {
  if (loc.numberingSystem && loc.numberingSystem !== "latn") {
    return false;
  } else {
    return loc.numberingSystem === "latn" || !loc.locale || loc.locale.startsWith("en") || new Intl.DateTimeFormat(loc.intl).resolvedOptions().numberingSystem === "latn";
  }
}
class PolyNumberFormatter {
  constructor(intl, forceSimple, opts) {
    this.padTo = opts.padTo || 0;
    this.floor = opts.floor || false;
    const { padTo, floor, ...otherOpts } = opts;
    if (!forceSimple || Object.keys(otherOpts).length > 0) {
      const intlOpts = { useGrouping: false, ...opts };
      if (opts.padTo > 0) intlOpts.minimumIntegerDigits = opts.padTo;
      this.inf = getCachedINF(intl, intlOpts);
    }
  }
  format(i2) {
    if (this.inf) {
      const fixed = this.floor ? Math.floor(i2) : i2;
      return this.inf.format(fixed);
    } else {
      const fixed = this.floor ? Math.floor(i2) : roundTo(i2, 3);
      return padStart(fixed, this.padTo);
    }
  }
}
class PolyDateFormatter {
  constructor(dt, intl, opts) {
    this.opts = opts;
    this.originalZone = void 0;
    let z = void 0;
    if (this.opts.timeZone) {
      this.dt = dt;
    } else if (dt.zone.type === "fixed") {
      const gmtOffset = -1 * (dt.offset / 60);
      const offsetZ = gmtOffset >= 0 ? `Etc/GMT+${gmtOffset}` : `Etc/GMT${gmtOffset}`;
      if (dt.offset !== 0 && IANAZone.create(offsetZ).valid) {
        z = offsetZ;
        this.dt = dt;
      } else {
        z = "UTC";
        this.dt = dt.offset === 0 ? dt : dt.setZone("UTC").plus({ minutes: dt.offset });
        this.originalZone = dt.zone;
      }
    } else if (dt.zone.type === "system") {
      this.dt = dt;
    } else if (dt.zone.type === "iana") {
      this.dt = dt;
      z = dt.zone.name;
    } else {
      z = "UTC";
      this.dt = dt.setZone("UTC").plus({ minutes: dt.offset });
      this.originalZone = dt.zone;
    }
    const intlOpts = { ...this.opts };
    intlOpts.timeZone = intlOpts.timeZone || z;
    this.dtf = getCachedDTF(intl, intlOpts);
  }
  format() {
    if (this.originalZone) {
      return this.formatToParts().map(({ value }) => value).join("");
    }
    return this.dtf.format(this.dt.toJSDate());
  }
  formatToParts() {
    const parts = this.dtf.formatToParts(this.dt.toJSDate());
    if (this.originalZone) {
      return parts.map((part) => {
        if (part.type === "timeZoneName") {
          const offsetName = this.originalZone.offsetName(this.dt.ts, {
            locale: this.dt.locale,
            format: this.opts.timeZoneName
          });
          return {
            ...part,
            value: offsetName
          };
        } else {
          return part;
        }
      });
    }
    return parts;
  }
  resolvedOptions() {
    return this.dtf.resolvedOptions();
  }
}
class PolyRelFormatter {
  constructor(intl, isEnglish, opts) {
    this.opts = { style: "long", ...opts };
    if (!isEnglish && hasRelative()) {
      this.rtf = getCachedRTF(intl, opts);
    }
  }
  format(count, unit) {
    if (this.rtf) {
      return this.rtf.format(count, unit);
    } else {
      return formatRelativeTime(unit, count, this.opts.numeric, this.opts.style !== "long");
    }
  }
  formatToParts(count, unit) {
    if (this.rtf) {
      return this.rtf.formatToParts(count, unit);
    } else {
      return [];
    }
  }
}
const fallbackWeekSettings = {
  firstDay: 1,
  minimalDays: 4,
  weekend: [6, 7]
};
class Locale {
  static fromOpts(opts) {
    return Locale.create(
      opts.locale,
      opts.numberingSystem,
      opts.outputCalendar,
      opts.weekSettings,
      opts.defaultToEN
    );
  }
  static create(locale, numberingSystem, outputCalendar, weekSettings, defaultToEN = false) {
    const specifiedLocale = locale || Settings.defaultLocale;
    const localeR = specifiedLocale || (defaultToEN ? "en-US" : systemLocale());
    const numberingSystemR = numberingSystem || Settings.defaultNumberingSystem;
    const outputCalendarR = outputCalendar || Settings.defaultOutputCalendar;
    const weekSettingsR = validateWeekSettings(weekSettings) || Settings.defaultWeekSettings;
    return new Locale(localeR, numberingSystemR, outputCalendarR, weekSettingsR, specifiedLocale);
  }
  static resetCache() {
    sysLocaleCache = null;
    intlDTCache = {};
    intlNumCache = {};
    intlRelCache = {};
  }
  static fromObject({ locale, numberingSystem, outputCalendar, weekSettings } = {}) {
    return Locale.create(locale, numberingSystem, outputCalendar, weekSettings);
  }
  constructor(locale, numbering, outputCalendar, weekSettings, specifiedLocale) {
    const [parsedLocale, parsedNumberingSystem, parsedOutputCalendar] = parseLocaleString(locale);
    this.locale = parsedLocale;
    this.numberingSystem = numbering || parsedNumberingSystem || null;
    this.outputCalendar = outputCalendar || parsedOutputCalendar || null;
    this.weekSettings = weekSettings;
    this.intl = intlConfigString(this.locale, this.numberingSystem, this.outputCalendar);
    this.weekdaysCache = { format: {}, standalone: {} };
    this.monthsCache = { format: {}, standalone: {} };
    this.meridiemCache = null;
    this.eraCache = {};
    this.specifiedLocale = specifiedLocale;
    this.fastNumbersCached = null;
  }
  get fastNumbers() {
    if (this.fastNumbersCached == null) {
      this.fastNumbersCached = supportsFastNumbers(this);
    }
    return this.fastNumbersCached;
  }
  listingMode() {
    const isActuallyEn = this.isEnglish();
    const hasNoWeirdness = (this.numberingSystem === null || this.numberingSystem === "latn") && (this.outputCalendar === null || this.outputCalendar === "gregory");
    return isActuallyEn && hasNoWeirdness ? "en" : "intl";
  }
  clone(alts) {
    if (!alts || Object.getOwnPropertyNames(alts).length === 0) {
      return this;
    } else {
      return Locale.create(
        alts.locale || this.specifiedLocale,
        alts.numberingSystem || this.numberingSystem,
        alts.outputCalendar || this.outputCalendar,
        validateWeekSettings(alts.weekSettings) || this.weekSettings,
        alts.defaultToEN || false
      );
    }
  }
  redefaultToEN(alts = {}) {
    return this.clone({ ...alts, defaultToEN: true });
  }
  redefaultToSystem(alts = {}) {
    return this.clone({ ...alts, defaultToEN: false });
  }
  months(length, format = false) {
    return listStuff(this, length, months, () => {
      const intl = format ? { month: length, day: "numeric" } : { month: length }, formatStr = format ? "format" : "standalone";
      if (!this.monthsCache[formatStr][length]) {
        this.monthsCache[formatStr][length] = mapMonths((dt) => this.extract(dt, intl, "month"));
      }
      return this.monthsCache[formatStr][length];
    });
  }
  weekdays(length, format = false) {
    return listStuff(this, length, weekdays, () => {
      const intl = format ? { weekday: length, year: "numeric", month: "long", day: "numeric" } : { weekday: length }, formatStr = format ? "format" : "standalone";
      if (!this.weekdaysCache[formatStr][length]) {
        this.weekdaysCache[formatStr][length] = mapWeekdays(
          (dt) => this.extract(dt, intl, "weekday")
        );
      }
      return this.weekdaysCache[formatStr][length];
    });
  }
  meridiems() {
    return listStuff(
      this,
      void 0,
      () => meridiems,
      () => {
        if (!this.meridiemCache) {
          const intl = { hour: "numeric", hourCycle: "h12" };
          this.meridiemCache = [DateTime.utc(2016, 11, 13, 9), DateTime.utc(2016, 11, 13, 19)].map(
            (dt) => this.extract(dt, intl, "dayperiod")
          );
        }
        return this.meridiemCache;
      }
    );
  }
  eras(length) {
    return listStuff(this, length, eras, () => {
      const intl = { era: length };
      if (!this.eraCache[length]) {
        this.eraCache[length] = [DateTime.utc(-40, 1, 1), DateTime.utc(2017, 1, 1)].map(
          (dt) => this.extract(dt, intl, "era")
        );
      }
      return this.eraCache[length];
    });
  }
  extract(dt, intlOpts, field) {
    const df = this.dtFormatter(dt, intlOpts), results = df.formatToParts(), matching = results.find((m2) => m2.type.toLowerCase() === field);
    return matching ? matching.value : null;
  }
  numberFormatter(opts = {}) {
    return new PolyNumberFormatter(this.intl, opts.forceSimple || this.fastNumbers, opts);
  }
  dtFormatter(dt, intlOpts = {}) {
    return new PolyDateFormatter(dt, this.intl, intlOpts);
  }
  relFormatter(opts = {}) {
    return new PolyRelFormatter(this.intl, this.isEnglish(), opts);
  }
  listFormatter(opts = {}) {
    return getCachedLF(this.intl, opts);
  }
  isEnglish() {
    return this.locale === "en" || this.locale.toLowerCase() === "en-us" || new Intl.DateTimeFormat(this.intl).resolvedOptions().locale.startsWith("en-us");
  }
  getWeekSettings() {
    if (this.weekSettings) {
      return this.weekSettings;
    } else if (!hasLocaleWeekInfo()) {
      return fallbackWeekSettings;
    } else {
      return getCachedWeekInfo(this.locale);
    }
  }
  getStartOfWeek() {
    return this.getWeekSettings().firstDay;
  }
  getMinDaysInFirstWeek() {
    return this.getWeekSettings().minimalDays;
  }
  getWeekendDays() {
    return this.getWeekSettings().weekend;
  }
  equals(other) {
    return this.locale === other.locale && this.numberingSystem === other.numberingSystem && this.outputCalendar === other.outputCalendar;
  }
  toString() {
    return `Locale(${this.locale}, ${this.numberingSystem}, ${this.outputCalendar})`;
  }
}
let singleton = null;
class FixedOffsetZone extends Zone {
  /**
   * Get a singleton instance of UTC
   * @return {FixedOffsetZone}
   */
  static get utcInstance() {
    if (singleton === null) {
      singleton = new FixedOffsetZone(0);
    }
    return singleton;
  }
  /**
   * Get an instance with a specified offset
   * @param {number} offset - The offset in minutes
   * @return {FixedOffsetZone}
   */
  static instance(offset2) {
    return offset2 === 0 ? FixedOffsetZone.utcInstance : new FixedOffsetZone(offset2);
  }
  /**
   * Get an instance of FixedOffsetZone from a UTC offset string, like "UTC+6"
   * @param {string} s - The offset string to parse
   * @example FixedOffsetZone.parseSpecifier("UTC+6")
   * @example FixedOffsetZone.parseSpecifier("UTC+06")
   * @example FixedOffsetZone.parseSpecifier("UTC-6:00")
   * @return {FixedOffsetZone}
   */
  static parseSpecifier(s2) {
    if (s2) {
      const r2 = s2.match(/^utc(?:([+-]\d{1,2})(?::(\d{2}))?)?$/i);
      if (r2) {
        return new FixedOffsetZone(signedOffset(r2[1], r2[2]));
      }
    }
    return null;
  }
  constructor(offset2) {
    super();
    this.fixed = offset2;
  }
  /**
   * The type of zone. `fixed` for all instances of `FixedOffsetZone`.
   * @override
   * @type {string}
   */
  get type() {
    return "fixed";
  }
  /**
   * The name of this zone.
   * All fixed zones' names always start with "UTC" (plus optional offset)
   * @override
   * @type {string}
   */
  get name() {
    return this.fixed === 0 ? "UTC" : `UTC${formatOffset(this.fixed, "narrow")}`;
  }
  /**
   * The IANA name of this zone, i.e. `Etc/UTC` or `Etc/GMT+/-nn`
   *
   * @override
   * @type {string}
   */
  get ianaName() {
    if (this.fixed === 0) {
      return "Etc/UTC";
    } else {
      return `Etc/GMT${formatOffset(-this.fixed, "narrow")}`;
    }
  }
  /**
   * Returns the offset's common name at the specified timestamp.
   *
   * For fixed offset zones this equals to the zone name.
   * @override
   */
  offsetName() {
    return this.name;
  }
  /**
   * Returns the offset's value as a string
   * @override
   * @param {number} ts - Epoch milliseconds for which to get the offset
   * @param {string} format - What style of offset to return.
   *                          Accepts 'narrow', 'short', or 'techie'. Returning '+6', '+06:00', or '+0600' respectively
   * @return {string}
   */
  formatOffset(ts, format) {
    return formatOffset(this.fixed, format);
  }
  /**
   * Returns whether the offset is known to be fixed for the whole year:
   * Always returns true for all fixed offset zones.
   * @override
   * @type {boolean}
   */
  get isUniversal() {
    return true;
  }
  /**
   * Return the offset in minutes for this zone at the specified timestamp.
   *
   * For fixed offset zones, this is constant and does not depend on a timestamp.
   * @override
   * @return {number}
   */
  offset() {
    return this.fixed;
  }
  /**
   * Return whether this Zone is equal to another zone (i.e. also fixed and same offset)
   * @override
   * @param {Zone} otherZone - the zone to compare
   * @return {boolean}
   */
  equals(otherZone) {
    return otherZone.type === "fixed" && otherZone.fixed === this.fixed;
  }
  /**
   * Return whether this Zone is valid:
   * All fixed offset zones are valid.
   * @override
   * @type {boolean}
   */
  get isValid() {
    return true;
  }
}
class InvalidZone extends Zone {
  constructor(zoneName) {
    super();
    this.zoneName = zoneName;
  }
  /** @override **/
  get type() {
    return "invalid";
  }
  /** @override **/
  get name() {
    return this.zoneName;
  }
  /** @override **/
  get isUniversal() {
    return false;
  }
  /** @override **/
  offsetName() {
    return null;
  }
  /** @override **/
  formatOffset() {
    return "";
  }
  /** @override **/
  offset() {
    return NaN;
  }
  /** @override **/
  equals() {
    return false;
  }
  /** @override **/
  get isValid() {
    return false;
  }
}
function normalizeZone(input, defaultZone2) {
  if (isUndefined(input) || input === null) {
    return defaultZone2;
  } else if (input instanceof Zone) {
    return input;
  } else if (isString(input)) {
    const lowered = input.toLowerCase();
    if (lowered === "default") return defaultZone2;
    else if (lowered === "local" || lowered === "system") return SystemZone.instance;
    else if (lowered === "utc" || lowered === "gmt") return FixedOffsetZone.utcInstance;
    else return FixedOffsetZone.parseSpecifier(lowered) || IANAZone.create(input);
  } else if (isNumber(input)) {
    return FixedOffsetZone.instance(input);
  } else if (typeof input === "object" && "offset" in input && typeof input.offset === "function") {
    return input;
  } else {
    return new InvalidZone(input);
  }
}
const numberingSystems = {
  arab: "[٠-٩]",
  arabext: "[۰-۹]",
  bali: "[᭐-᭙]",
  beng: "[০-৯]",
  deva: "[०-९]",
  fullwide: "[０-９]",
  gujr: "[૦-૯]",
  hanidec: "[〇|一|二|三|四|五|六|七|八|九]",
  khmr: "[០-៩]",
  knda: "[೦-೯]",
  laoo: "[໐-໙]",
  limb: "[᥆-᥏]",
  mlym: "[൦-൯]",
  mong: "[᠐-᠙]",
  mymr: "[၀-၉]",
  orya: "[୦-୯]",
  tamldec: "[௦-௯]",
  telu: "[౦-౯]",
  thai: "[๐-๙]",
  tibt: "[༠-༩]",
  latn: "\\d"
};
const numberingSystemsUTF16 = {
  arab: [1632, 1641],
  arabext: [1776, 1785],
  bali: [6992, 7001],
  beng: [2534, 2543],
  deva: [2406, 2415],
  fullwide: [65296, 65303],
  gujr: [2790, 2799],
  khmr: [6112, 6121],
  knda: [3302, 3311],
  laoo: [3792, 3801],
  limb: [6470, 6479],
  mlym: [3430, 3439],
  mong: [6160, 6169],
  mymr: [4160, 4169],
  orya: [2918, 2927],
  tamldec: [3046, 3055],
  telu: [3174, 3183],
  thai: [3664, 3673],
  tibt: [3872, 3881]
};
const hanidecChars = numberingSystems.hanidec.replace(/[\[|\]]/g, "").split("");
function parseDigits(str) {
  let value = parseInt(str, 10);
  if (isNaN(value)) {
    value = "";
    for (let i2 = 0; i2 < str.length; i2++) {
      const code = str.charCodeAt(i2);
      if (str[i2].search(numberingSystems.hanidec) !== -1) {
        value += hanidecChars.indexOf(str[i2]);
      } else {
        for (const key in numberingSystemsUTF16) {
          const [min, max] = numberingSystemsUTF16[key];
          if (code >= min && code <= max) {
            value += code - min;
          }
        }
      }
    }
    return parseInt(value, 10);
  } else {
    return value;
  }
}
let digitRegexCache = {};
function resetDigitRegexCache() {
  digitRegexCache = {};
}
function digitRegex({ numberingSystem }, append = "") {
  const ns = numberingSystem || "latn";
  if (!digitRegexCache[ns]) {
    digitRegexCache[ns] = {};
  }
  if (!digitRegexCache[ns][append]) {
    digitRegexCache[ns][append] = new RegExp(`${numberingSystems[ns]}${append}`);
  }
  return digitRegexCache[ns][append];
}
let now = () => Date.now(), defaultZone = "system", defaultLocale = null, defaultNumberingSystem = null, defaultOutputCalendar = null, twoDigitCutoffYear = 60, throwOnInvalid, defaultWeekSettings = null;
class Settings {
  /**
   * Get the callback for returning the current timestamp.
   * @type {function}
   */
  static get now() {
    return now;
  }
  /**
   * Set the callback for returning the current timestamp.
   * The function should return a number, which will be interpreted as an Epoch millisecond count
   * @type {function}
   * @example Settings.now = () => Date.now() + 3000 // pretend it is 3 seconds in the future
   * @example Settings.now = () => 0 // always pretend it's Jan 1, 1970 at midnight in UTC time
   */
  static set now(n3) {
    now = n3;
  }
  /**
   * Set the default time zone to create DateTimes in. Does not affect existing instances.
   * Use the value "system" to reset this value to the system's time zone.
   * @type {string}
   */
  static set defaultZone(zone) {
    defaultZone = zone;
  }
  /**
   * Get the default time zone object currently used to create DateTimes. Does not affect existing instances.
   * The default value is the system's time zone (the one set on the machine that runs this code).
   * @type {Zone}
   */
  static get defaultZone() {
    return normalizeZone(defaultZone, SystemZone.instance);
  }
  /**
   * Get the default locale to create DateTimes with. Does not affect existing instances.
   * @type {string}
   */
  static get defaultLocale() {
    return defaultLocale;
  }
  /**
   * Set the default locale to create DateTimes with. Does not affect existing instances.
   * @type {string}
   */
  static set defaultLocale(locale) {
    defaultLocale = locale;
  }
  /**
   * Get the default numbering system to create DateTimes with. Does not affect existing instances.
   * @type {string}
   */
  static get defaultNumberingSystem() {
    return defaultNumberingSystem;
  }
  /**
   * Set the default numbering system to create DateTimes with. Does not affect existing instances.
   * @type {string}
   */
  static set defaultNumberingSystem(numberingSystem) {
    defaultNumberingSystem = numberingSystem;
  }
  /**
   * Get the default output calendar to create DateTimes with. Does not affect existing instances.
   * @type {string}
   */
  static get defaultOutputCalendar() {
    return defaultOutputCalendar;
  }
  /**
   * Set the default output calendar to create DateTimes with. Does not affect existing instances.
   * @type {string}
   */
  static set defaultOutputCalendar(outputCalendar) {
    defaultOutputCalendar = outputCalendar;
  }
  /**
   * @typedef {Object} WeekSettings
   * @property {number} firstDay
   * @property {number} minimalDays
   * @property {number[]} weekend
   */
  /**
   * @return {WeekSettings|null}
   */
  static get defaultWeekSettings() {
    return defaultWeekSettings;
  }
  /**
   * Allows overriding the default locale week settings, i.e. the start of the week, the weekend and
   * how many days are required in the first week of a year.
   * Does not affect existing instances.
   *
   * @param {WeekSettings|null} weekSettings
   */
  static set defaultWeekSettings(weekSettings) {
    defaultWeekSettings = validateWeekSettings(weekSettings);
  }
  /**
   * Get the cutoff year for whether a 2-digit year string is interpreted in the current or previous century. Numbers higher than the cutoff will be considered to mean 19xx and numbers lower or equal to the cutoff will be considered 20xx.
   * @type {number}
   */
  static get twoDigitCutoffYear() {
    return twoDigitCutoffYear;
  }
  /**
   * Set the cutoff year for whether a 2-digit year string is interpreted in the current or previous century. Numbers higher than the cutoff will be considered to mean 19xx and numbers lower or equal to the cutoff will be considered 20xx.
   * @type {number}
   * @example Settings.twoDigitCutoffYear = 0 // all 'yy' are interpreted as 20th century
   * @example Settings.twoDigitCutoffYear = 99 // all 'yy' are interpreted as 21st century
   * @example Settings.twoDigitCutoffYear = 50 // '49' -> 2049; '50' -> 1950
   * @example Settings.twoDigitCutoffYear = 1950 // interpreted as 50
   * @example Settings.twoDigitCutoffYear = 2050 // ALSO interpreted as 50
   */
  static set twoDigitCutoffYear(cutoffYear) {
    twoDigitCutoffYear = cutoffYear % 100;
  }
  /**
   * Get whether Luxon will throw when it encounters invalid DateTimes, Durations, or Intervals
   * @type {boolean}
   */
  static get throwOnInvalid() {
    return throwOnInvalid;
  }
  /**
   * Set whether Luxon will throw when it encounters invalid DateTimes, Durations, or Intervals
   * @type {boolean}
   */
  static set throwOnInvalid(t2) {
    throwOnInvalid = t2;
  }
  /**
   * Reset Luxon's global caches. Should only be necessary in testing scenarios.
   * @return {void}
   */
  static resetCaches() {
    Locale.resetCache();
    IANAZone.resetCache();
    DateTime.resetCache();
    resetDigitRegexCache();
  }
}
class Invalid {
  constructor(reason, explanation) {
    this.reason = reason;
    this.explanation = explanation;
  }
  toMessage() {
    if (this.explanation) {
      return `${this.reason}: ${this.explanation}`;
    } else {
      return this.reason;
    }
  }
}
const nonLeapLadder = [0, 31, 59, 90, 120, 151, 181, 212, 243, 273, 304, 334], leapLadder = [0, 31, 60, 91, 121, 152, 182, 213, 244, 274, 305, 335];
function unitOutOfRange(unit, value) {
  return new Invalid(
    "unit out of range",
    `you specified ${value} (of type ${typeof value}) as a ${unit}, which is invalid`
  );
}
function dayOfWeek(year, month, day) {
  const d2 = new Date(Date.UTC(year, month - 1, day));
  if (year < 100 && year >= 0) {
    d2.setUTCFullYear(d2.getUTCFullYear() - 1900);
  }
  const js = d2.getUTCDay();
  return js === 0 ? 7 : js;
}
function computeOrdinal(year, month, day) {
  return day + (isLeapYear(year) ? leapLadder : nonLeapLadder)[month - 1];
}
function uncomputeOrdinal(year, ordinal) {
  const table = isLeapYear(year) ? leapLadder : nonLeapLadder, month0 = table.findIndex((i2) => i2 < ordinal), day = ordinal - table[month0];
  return { month: month0 + 1, day };
}
function isoWeekdayToLocal(isoWeekday, startOfWeek) {
  return (isoWeekday - startOfWeek + 7) % 7 + 1;
}
function gregorianToWeek(gregObj, minDaysInFirstWeek = 4, startOfWeek = 1) {
  const { year, month, day } = gregObj, ordinal = computeOrdinal(year, month, day), weekday = isoWeekdayToLocal(dayOfWeek(year, month, day), startOfWeek);
  let weekNumber = Math.floor((ordinal - weekday + 14 - minDaysInFirstWeek) / 7), weekYear;
  if (weekNumber < 1) {
    weekYear = year - 1;
    weekNumber = weeksInWeekYear(weekYear, minDaysInFirstWeek, startOfWeek);
  } else if (weekNumber > weeksInWeekYear(year, minDaysInFirstWeek, startOfWeek)) {
    weekYear = year + 1;
    weekNumber = 1;
  } else {
    weekYear = year;
  }
  return { weekYear, weekNumber, weekday, ...timeObject(gregObj) };
}
function weekToGregorian(weekData, minDaysInFirstWeek = 4, startOfWeek = 1) {
  const { weekYear, weekNumber, weekday } = weekData, weekdayOfJan4 = isoWeekdayToLocal(dayOfWeek(weekYear, 1, minDaysInFirstWeek), startOfWeek), yearInDays = daysInYear(weekYear);
  let ordinal = weekNumber * 7 + weekday - weekdayOfJan4 - 7 + minDaysInFirstWeek, year;
  if (ordinal < 1) {
    year = weekYear - 1;
    ordinal += daysInYear(year);
  } else if (ordinal > yearInDays) {
    year = weekYear + 1;
    ordinal -= daysInYear(weekYear);
  } else {
    year = weekYear;
  }
  const { month, day } = uncomputeOrdinal(year, ordinal);
  return { year, month, day, ...timeObject(weekData) };
}
function gregorianToOrdinal(gregData) {
  const { year, month, day } = gregData;
  const ordinal = computeOrdinal(year, month, day);
  return { year, ordinal, ...timeObject(gregData) };
}
function ordinalToGregorian(ordinalData) {
  const { year, ordinal } = ordinalData;
  const { month, day } = uncomputeOrdinal(year, ordinal);
  return { year, month, day, ...timeObject(ordinalData) };
}
function usesLocalWeekValues(obj, loc) {
  const hasLocaleWeekData = !isUndefined(obj.localWeekday) || !isUndefined(obj.localWeekNumber) || !isUndefined(obj.localWeekYear);
  if (hasLocaleWeekData) {
    const hasIsoWeekData = !isUndefined(obj.weekday) || !isUndefined(obj.weekNumber) || !isUndefined(obj.weekYear);
    if (hasIsoWeekData) {
      throw new ConflictingSpecificationError(
        "Cannot mix locale-based week fields with ISO-based week fields"
      );
    }
    if (!isUndefined(obj.localWeekday)) obj.weekday = obj.localWeekday;
    if (!isUndefined(obj.localWeekNumber)) obj.weekNumber = obj.localWeekNumber;
    if (!isUndefined(obj.localWeekYear)) obj.weekYear = obj.localWeekYear;
    delete obj.localWeekday;
    delete obj.localWeekNumber;
    delete obj.localWeekYear;
    return {
      minDaysInFirstWeek: loc.getMinDaysInFirstWeek(),
      startOfWeek: loc.getStartOfWeek()
    };
  } else {
    return { minDaysInFirstWeek: 4, startOfWeek: 1 };
  }
}
function hasInvalidWeekData(obj, minDaysInFirstWeek = 4, startOfWeek = 1) {
  const validYear = isInteger(obj.weekYear), validWeek = integerBetween(
    obj.weekNumber,
    1,
    weeksInWeekYear(obj.weekYear, minDaysInFirstWeek, startOfWeek)
  ), validWeekday = integerBetween(obj.weekday, 1, 7);
  if (!validYear) {
    return unitOutOfRange("weekYear", obj.weekYear);
  } else if (!validWeek) {
    return unitOutOfRange("week", obj.weekNumber);
  } else if (!validWeekday) {
    return unitOutOfRange("weekday", obj.weekday);
  } else return false;
}
function hasInvalidOrdinalData(obj) {
  const validYear = isInteger(obj.year), validOrdinal = integerBetween(obj.ordinal, 1, daysInYear(obj.year));
  if (!validYear) {
    return unitOutOfRange("year", obj.year);
  } else if (!validOrdinal) {
    return unitOutOfRange("ordinal", obj.ordinal);
  } else return false;
}
function hasInvalidGregorianData(obj) {
  const validYear = isInteger(obj.year), validMonth = integerBetween(obj.month, 1, 12), validDay = integerBetween(obj.day, 1, daysInMonth(obj.year, obj.month));
  if (!validYear) {
    return unitOutOfRange("year", obj.year);
  } else if (!validMonth) {
    return unitOutOfRange("month", obj.month);
  } else if (!validDay) {
    return unitOutOfRange("day", obj.day);
  } else return false;
}
function hasInvalidTimeData(obj) {
  const { hour, minute, second, millisecond } = obj;
  const validHour = integerBetween(hour, 0, 23) || hour === 24 && minute === 0 && second === 0 && millisecond === 0, validMinute = integerBetween(minute, 0, 59), validSecond = integerBetween(second, 0, 59), validMillisecond = integerBetween(millisecond, 0, 999);
  if (!validHour) {
    return unitOutOfRange("hour", hour);
  } else if (!validMinute) {
    return unitOutOfRange("minute", minute);
  } else if (!validSecond) {
    return unitOutOfRange("second", second);
  } else if (!validMillisecond) {
    return unitOutOfRange("millisecond", millisecond);
  } else return false;
}
function isUndefined(o2) {
  return typeof o2 === "undefined";
}
function isNumber(o2) {
  return typeof o2 === "number";
}
function isInteger(o2) {
  return typeof o2 === "number" && o2 % 1 === 0;
}
function isString(o2) {
  return typeof o2 === "string";
}
function isDate(o2) {
  return Object.prototype.toString.call(o2) === "[object Date]";
}
function hasRelative() {
  try {
    return typeof Intl !== "undefined" && !!Intl.RelativeTimeFormat;
  } catch (e2) {
    return false;
  }
}
function hasLocaleWeekInfo() {
  try {
    return typeof Intl !== "undefined" && !!Intl.Locale && ("weekInfo" in Intl.Locale.prototype || "getWeekInfo" in Intl.Locale.prototype);
  } catch (e2) {
    return false;
  }
}
function maybeArray(thing) {
  return Array.isArray(thing) ? thing : [thing];
}
function bestBy(arr, by, compare) {
  if (arr.length === 0) {
    return void 0;
  }
  return arr.reduce((best, next) => {
    const pair = [by(next), next];
    if (!best) {
      return pair;
    } else if (compare(best[0], pair[0]) === best[0]) {
      return best;
    } else {
      return pair;
    }
  }, null)[1];
}
function pick(obj, keys) {
  return keys.reduce((a2, k2) => {
    a2[k2] = obj[k2];
    return a2;
  }, {});
}
function hasOwnProperty(obj, prop) {
  return Object.prototype.hasOwnProperty.call(obj, prop);
}
function validateWeekSettings(settings) {
  if (settings == null) {
    return null;
  } else if (typeof settings !== "object") {
    throw new InvalidArgumentError("Week settings must be an object");
  } else {
    if (!integerBetween(settings.firstDay, 1, 7) || !integerBetween(settings.minimalDays, 1, 7) || !Array.isArray(settings.weekend) || settings.weekend.some((v2) => !integerBetween(v2, 1, 7))) {
      throw new InvalidArgumentError("Invalid week settings");
    }
    return {
      firstDay: settings.firstDay,
      minimalDays: settings.minimalDays,
      weekend: Array.from(settings.weekend)
    };
  }
}
function integerBetween(thing, bottom, top) {
  return isInteger(thing) && thing >= bottom && thing <= top;
}
function floorMod(x2, n3) {
  return x2 - n3 * Math.floor(x2 / n3);
}
function padStart(input, n3 = 2) {
  const isNeg = input < 0;
  let padded;
  if (isNeg) {
    padded = "-" + ("" + -input).padStart(n3, "0");
  } else {
    padded = ("" + input).padStart(n3, "0");
  }
  return padded;
}
function parseInteger(string) {
  if (isUndefined(string) || string === null || string === "") {
    return void 0;
  } else {
    return parseInt(string, 10);
  }
}
function parseFloating(string) {
  if (isUndefined(string) || string === null || string === "") {
    return void 0;
  } else {
    return parseFloat(string);
  }
}
function parseMillis(fraction) {
  if (isUndefined(fraction) || fraction === null || fraction === "") {
    return void 0;
  } else {
    const f2 = parseFloat("0." + fraction) * 1e3;
    return Math.floor(f2);
  }
}
function roundTo(number, digits, towardZero = false) {
  const factor = 10 ** digits, rounder = towardZero ? Math.trunc : Math.round;
  return rounder(number * factor) / factor;
}
function isLeapYear(year) {
  return year % 4 === 0 && (year % 100 !== 0 || year % 400 === 0);
}
function daysInYear(year) {
  return isLeapYear(year) ? 366 : 365;
}
function daysInMonth(year, month) {
  const modMonth = floorMod(month - 1, 12) + 1, modYear = year + (month - modMonth) / 12;
  if (modMonth === 2) {
    return isLeapYear(modYear) ? 29 : 28;
  } else {
    return [31, null, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31][modMonth - 1];
  }
}
function objToLocalTS(obj) {
  let d2 = Date.UTC(
    obj.year,
    obj.month - 1,
    obj.day,
    obj.hour,
    obj.minute,
    obj.second,
    obj.millisecond
  );
  if (obj.year < 100 && obj.year >= 0) {
    d2 = new Date(d2);
    d2.setUTCFullYear(obj.year, obj.month - 1, obj.day);
  }
  return +d2;
}
function firstWeekOffset(year, minDaysInFirstWeek, startOfWeek) {
  const fwdlw = isoWeekdayToLocal(dayOfWeek(year, 1, minDaysInFirstWeek), startOfWeek);
  return -fwdlw + minDaysInFirstWeek - 1;
}
function weeksInWeekYear(weekYear, minDaysInFirstWeek = 4, startOfWeek = 1) {
  const weekOffset = firstWeekOffset(weekYear, minDaysInFirstWeek, startOfWeek);
  const weekOffsetNext = firstWeekOffset(weekYear + 1, minDaysInFirstWeek, startOfWeek);
  return (daysInYear(weekYear) - weekOffset + weekOffsetNext) / 7;
}
function untruncateYear(year) {
  if (year > 99) {
    return year;
  } else return year > Settings.twoDigitCutoffYear ? 1900 + year : 2e3 + year;
}
function parseZoneInfo(ts, offsetFormat, locale, timeZone = null) {
  const date = new Date(ts), intlOpts = {
    hourCycle: "h23",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit"
  };
  if (timeZone) {
    intlOpts.timeZone = timeZone;
  }
  const modified = { timeZoneName: offsetFormat, ...intlOpts };
  const parsed = new Intl.DateTimeFormat(locale, modified).formatToParts(date).find((m2) => m2.type.toLowerCase() === "timezonename");
  return parsed ? parsed.value : null;
}
function signedOffset(offHourStr, offMinuteStr) {
  let offHour = parseInt(offHourStr, 10);
  if (Number.isNaN(offHour)) {
    offHour = 0;
  }
  const offMin = parseInt(offMinuteStr, 10) || 0, offMinSigned = offHour < 0 || Object.is(offHour, -0) ? -offMin : offMin;
  return offHour * 60 + offMinSigned;
}
function asNumber(value) {
  const numericValue = Number(value);
  if (typeof value === "boolean" || value === "" || Number.isNaN(numericValue))
    throw new InvalidArgumentError(`Invalid unit value ${value}`);
  return numericValue;
}
function normalizeObject(obj, normalizer) {
  const normalized = {};
  for (const u2 in obj) {
    if (hasOwnProperty(obj, u2)) {
      const v2 = obj[u2];
      if (v2 === void 0 || v2 === null) continue;
      normalized[normalizer(u2)] = asNumber(v2);
    }
  }
  return normalized;
}
function formatOffset(offset2, format) {
  const hours = Math.trunc(Math.abs(offset2 / 60)), minutes = Math.trunc(Math.abs(offset2 % 60)), sign = offset2 >= 0 ? "+" : "-";
  switch (format) {
    case "short":
      return `${sign}${padStart(hours, 2)}:${padStart(minutes, 2)}`;
    case "narrow":
      return `${sign}${hours}${minutes > 0 ? `:${minutes}` : ""}`;
    case "techie":
      return `${sign}${padStart(hours, 2)}${padStart(minutes, 2)}`;
    default:
      throw new RangeError(`Value format ${format} is out of range for property format`);
  }
}
function timeObject(obj) {
  return pick(obj, ["hour", "minute", "second", "millisecond"]);
}
const monthsLong = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December"
];
const monthsShort = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec"
];
const monthsNarrow = ["J", "F", "M", "A", "M", "J", "J", "A", "S", "O", "N", "D"];
function months(length) {
  switch (length) {
    case "narrow":
      return [...monthsNarrow];
    case "short":
      return [...monthsShort];
    case "long":
      return [...monthsLong];
    case "numeric":
      return ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12"];
    case "2-digit":
      return ["01", "02", "03", "04", "05", "06", "07", "08", "09", "10", "11", "12"];
    default:
      return null;
  }
}
const weekdaysLong = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday"
];
const weekdaysShort = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
const weekdaysNarrow = ["M", "T", "W", "T", "F", "S", "S"];
function weekdays(length) {
  switch (length) {
    case "narrow":
      return [...weekdaysNarrow];
    case "short":
      return [...weekdaysShort];
    case "long":
      return [...weekdaysLong];
    case "numeric":
      return ["1", "2", "3", "4", "5", "6", "7"];
    default:
      return null;
  }
}
const meridiems = ["AM", "PM"];
const erasLong = ["Before Christ", "Anno Domini"];
const erasShort = ["BC", "AD"];
const erasNarrow = ["B", "A"];
function eras(length) {
  switch (length) {
    case "narrow":
      return [...erasNarrow];
    case "short":
      return [...erasShort];
    case "long":
      return [...erasLong];
    default:
      return null;
  }
}
function meridiemForDateTime(dt) {
  return meridiems[dt.hour < 12 ? 0 : 1];
}
function weekdayForDateTime(dt, length) {
  return weekdays(length)[dt.weekday - 1];
}
function monthForDateTime(dt, length) {
  return months(length)[dt.month - 1];
}
function eraForDateTime(dt, length) {
  return eras(length)[dt.year < 0 ? 0 : 1];
}
function formatRelativeTime(unit, count, numeric = "always", narrow = false) {
  const units = {
    years: ["year", "yr."],
    quarters: ["quarter", "qtr."],
    months: ["month", "mo."],
    weeks: ["week", "wk."],
    days: ["day", "day", "days"],
    hours: ["hour", "hr."],
    minutes: ["minute", "min."],
    seconds: ["second", "sec."]
  };
  const lastable = ["hours", "minutes", "seconds"].indexOf(unit) === -1;
  if (numeric === "auto" && lastable) {
    const isDay = unit === "days";
    switch (count) {
      case 1:
        return isDay ? "tomorrow" : `next ${units[unit][0]}`;
      case -1:
        return isDay ? "yesterday" : `last ${units[unit][0]}`;
      case 0:
        return isDay ? "today" : `this ${units[unit][0]}`;
    }
  }
  const isInPast = Object.is(count, -0) || count < 0, fmtValue = Math.abs(count), singular = fmtValue === 1, lilUnits = units[unit], fmtUnit = narrow ? singular ? lilUnits[1] : lilUnits[2] || lilUnits[1] : singular ? units[unit][0] : unit;
  return isInPast ? `${fmtValue} ${fmtUnit} ago` : `in ${fmtValue} ${fmtUnit}`;
}
function stringifyTokens(splits, tokenToString) {
  let s2 = "";
  for (const token of splits) {
    if (token.literal) {
      s2 += token.val;
    } else {
      s2 += tokenToString(token.val);
    }
  }
  return s2;
}
const macroTokenToFormatOpts = {
  D: DATE_SHORT,
  DD: DATE_MED,
  DDD: DATE_FULL,
  DDDD: DATE_HUGE,
  t: TIME_SIMPLE,
  tt: TIME_WITH_SECONDS,
  ttt: TIME_WITH_SHORT_OFFSET,
  tttt: TIME_WITH_LONG_OFFSET,
  T: TIME_24_SIMPLE,
  TT: TIME_24_WITH_SECONDS,
  TTT: TIME_24_WITH_SHORT_OFFSET,
  TTTT: TIME_24_WITH_LONG_OFFSET,
  f: DATETIME_SHORT,
  ff: DATETIME_MED,
  fff: DATETIME_FULL,
  ffff: DATETIME_HUGE,
  F: DATETIME_SHORT_WITH_SECONDS,
  FF: DATETIME_MED_WITH_SECONDS,
  FFF: DATETIME_FULL_WITH_SECONDS,
  FFFF: DATETIME_HUGE_WITH_SECONDS
};
class Formatter {
  static create(locale, opts = {}) {
    return new Formatter(locale, opts);
  }
  static parseFormat(fmt) {
    let current = null, currentFull = "", bracketed = false;
    const splits = [];
    for (let i2 = 0; i2 < fmt.length; i2++) {
      const c2 = fmt.charAt(i2);
      if (c2 === "'") {
        if (currentFull.length > 0) {
          splits.push({ literal: bracketed || /^\s+$/.test(currentFull), val: currentFull });
        }
        current = null;
        currentFull = "";
        bracketed = !bracketed;
      } else if (bracketed) {
        currentFull += c2;
      } else if (c2 === current) {
        currentFull += c2;
      } else {
        if (currentFull.length > 0) {
          splits.push({ literal: /^\s+$/.test(currentFull), val: currentFull });
        }
        currentFull = c2;
        current = c2;
      }
    }
    if (currentFull.length > 0) {
      splits.push({ literal: bracketed || /^\s+$/.test(currentFull), val: currentFull });
    }
    return splits;
  }
  static macroTokenToFormatOpts(token) {
    return macroTokenToFormatOpts[token];
  }
  constructor(locale, formatOpts) {
    this.opts = formatOpts;
    this.loc = locale;
    this.systemLoc = null;
  }
  formatWithSystemDefault(dt, opts) {
    if (this.systemLoc === null) {
      this.systemLoc = this.loc.redefaultToSystem();
    }
    const df = this.systemLoc.dtFormatter(dt, { ...this.opts, ...opts });
    return df.format();
  }
  dtFormatter(dt, opts = {}) {
    return this.loc.dtFormatter(dt, { ...this.opts, ...opts });
  }
  formatDateTime(dt, opts) {
    return this.dtFormatter(dt, opts).format();
  }
  formatDateTimeParts(dt, opts) {
    return this.dtFormatter(dt, opts).formatToParts();
  }
  formatInterval(interval, opts) {
    const df = this.dtFormatter(interval.start, opts);
    return df.dtf.formatRange(interval.start.toJSDate(), interval.end.toJSDate());
  }
  resolvedOptions(dt, opts) {
    return this.dtFormatter(dt, opts).resolvedOptions();
  }
  num(n3, p2 = 0) {
    if (this.opts.forceSimple) {
      return padStart(n3, p2);
    }
    const opts = { ...this.opts };
    if (p2 > 0) {
      opts.padTo = p2;
    }
    return this.loc.numberFormatter(opts).format(n3);
  }
  formatDateTimeFromString(dt, fmt) {
    const knownEnglish = this.loc.listingMode() === "en", useDateTimeFormatter = this.loc.outputCalendar && this.loc.outputCalendar !== "gregory", string = (opts, extract) => this.loc.extract(dt, opts, extract), formatOffset2 = (opts) => {
      if (dt.isOffsetFixed && dt.offset === 0 && opts.allowZ) {
        return "Z";
      }
      return dt.isValid ? dt.zone.formatOffset(dt.ts, opts.format) : "";
    }, meridiem = () => knownEnglish ? meridiemForDateTime(dt) : string({ hour: "numeric", hourCycle: "h12" }, "dayperiod"), month = (length, standalone) => knownEnglish ? monthForDateTime(dt, length) : string(standalone ? { month: length } : { month: length, day: "numeric" }, "month"), weekday = (length, standalone) => knownEnglish ? weekdayForDateTime(dt, length) : string(
      standalone ? { weekday: length } : { weekday: length, month: "long", day: "numeric" },
      "weekday"
    ), maybeMacro = (token) => {
      const formatOpts = Formatter.macroTokenToFormatOpts(token);
      if (formatOpts) {
        return this.formatWithSystemDefault(dt, formatOpts);
      } else {
        return token;
      }
    }, era = (length) => knownEnglish ? eraForDateTime(dt, length) : string({ era: length }, "era"), tokenToString = (token) => {
      switch (token) {
        case "S":
          return this.num(dt.millisecond);
        case "u":
        case "SSS":
          return this.num(dt.millisecond, 3);
        case "s":
          return this.num(dt.second);
        case "ss":
          return this.num(dt.second, 2);
        case "uu":
          return this.num(Math.floor(dt.millisecond / 10), 2);
        case "uuu":
          return this.num(Math.floor(dt.millisecond / 100));
        case "m":
          return this.num(dt.minute);
        case "mm":
          return this.num(dt.minute, 2);
        case "h":
          return this.num(dt.hour % 12 === 0 ? 12 : dt.hour % 12);
        case "hh":
          return this.num(dt.hour % 12 === 0 ? 12 : dt.hour % 12, 2);
        case "H":
          return this.num(dt.hour);
        case "HH":
          return this.num(dt.hour, 2);
        case "Z":
          return formatOffset2({ format: "narrow", allowZ: this.opts.allowZ });
        case "ZZ":
          return formatOffset2({ format: "short", allowZ: this.opts.allowZ });
        case "ZZZ":
          return formatOffset2({ format: "techie", allowZ: this.opts.allowZ });
        case "ZZZZ":
          return dt.zone.offsetName(dt.ts, { format: "short", locale: this.loc.locale });
        case "ZZZZZ":
          return dt.zone.offsetName(dt.ts, { format: "long", locale: this.loc.locale });
        case "z":
          return dt.zoneName;
        case "a":
          return meridiem();
        case "d":
          return useDateTimeFormatter ? string({ day: "numeric" }, "day") : this.num(dt.day);
        case "dd":
          return useDateTimeFormatter ? string({ day: "2-digit" }, "day") : this.num(dt.day, 2);
        case "c":
          return this.num(dt.weekday);
        case "ccc":
          return weekday("short", true);
        case "cccc":
          return weekday("long", true);
        case "ccccc":
          return weekday("narrow", true);
        case "E":
          return this.num(dt.weekday);
        case "EEE":
          return weekday("short", false);
        case "EEEE":
          return weekday("long", false);
        case "EEEEE":
          return weekday("narrow", false);
        case "L":
          return useDateTimeFormatter ? string({ month: "numeric", day: "numeric" }, "month") : this.num(dt.month);
        case "LL":
          return useDateTimeFormatter ? string({ month: "2-digit", day: "numeric" }, "month") : this.num(dt.month, 2);
        case "LLL":
          return month("short", true);
        case "LLLL":
          return month("long", true);
        case "LLLLL":
          return month("narrow", true);
        case "M":
          return useDateTimeFormatter ? string({ month: "numeric" }, "month") : this.num(dt.month);
        case "MM":
          return useDateTimeFormatter ? string({ month: "2-digit" }, "month") : this.num(dt.month, 2);
        case "MMM":
          return month("short", false);
        case "MMMM":
          return month("long", false);
        case "MMMMM":
          return month("narrow", false);
        case "y":
          return useDateTimeFormatter ? string({ year: "numeric" }, "year") : this.num(dt.year);
        case "yy":
          return useDateTimeFormatter ? string({ year: "2-digit" }, "year") : this.num(dt.year.toString().slice(-2), 2);
        case "yyyy":
          return useDateTimeFormatter ? string({ year: "numeric" }, "year") : this.num(dt.year, 4);
        case "yyyyyy":
          return useDateTimeFormatter ? string({ year: "numeric" }, "year") : this.num(dt.year, 6);
        case "G":
          return era("short");
        case "GG":
          return era("long");
        case "GGGGG":
          return era("narrow");
        case "kk":
          return this.num(dt.weekYear.toString().slice(-2), 2);
        case "kkkk":
          return this.num(dt.weekYear, 4);
        case "W":
          return this.num(dt.weekNumber);
        case "WW":
          return this.num(dt.weekNumber, 2);
        case "n":
          return this.num(dt.localWeekNumber);
        case "nn":
          return this.num(dt.localWeekNumber, 2);
        case "ii":
          return this.num(dt.localWeekYear.toString().slice(-2), 2);
        case "iiii":
          return this.num(dt.localWeekYear, 4);
        case "o":
          return this.num(dt.ordinal);
        case "ooo":
          return this.num(dt.ordinal, 3);
        case "q":
          return this.num(dt.quarter);
        case "qq":
          return this.num(dt.quarter, 2);
        case "X":
          return this.num(Math.floor(dt.ts / 1e3));
        case "x":
          return this.num(dt.ts);
        default:
          return maybeMacro(token);
      }
    };
    return stringifyTokens(Formatter.parseFormat(fmt), tokenToString);
  }
  formatDurationFromString(dur, fmt) {
    const tokenToField = (token) => {
      switch (token[0]) {
        case "S":
          return "millisecond";
        case "s":
          return "second";
        case "m":
          return "minute";
        case "h":
          return "hour";
        case "d":
          return "day";
        case "w":
          return "week";
        case "M":
          return "month";
        case "y":
          return "year";
        default:
          return null;
      }
    }, tokenToString = (lildur) => (token) => {
      const mapped = tokenToField(token);
      if (mapped) {
        return this.num(lildur.get(mapped), token.length);
      } else {
        return token;
      }
    }, tokens = Formatter.parseFormat(fmt), realTokens = tokens.reduce(
      (found, { literal, val }) => literal ? found : found.concat(val),
      []
    ), collapsed = dur.shiftTo(...realTokens.map(tokenToField).filter((t2) => t2));
    return stringifyTokens(tokens, tokenToString(collapsed));
  }
}
const ianaRegex = /[A-Za-z_+-]{1,256}(?::?\/[A-Za-z0-9_+-]{1,256}(?:\/[A-Za-z0-9_+-]{1,256})?)?/;
function combineRegexes(...regexes) {
  const full = regexes.reduce((f2, r2) => f2 + r2.source, "");
  return RegExp(`^${full}$`);
}
function combineExtractors(...extractors) {
  return (m2) => extractors.reduce(
    ([mergedVals, mergedZone, cursor], ex) => {
      const [val, zone, next] = ex(m2, cursor);
      return [{ ...mergedVals, ...val }, zone || mergedZone, next];
    },
    [{}, null, 1]
  ).slice(0, 2);
}
function parse(s2, ...patterns) {
  if (s2 == null) {
    return [null, null];
  }
  for (const [regex, extractor] of patterns) {
    const m2 = regex.exec(s2);
    if (m2) {
      return extractor(m2);
    }
  }
  return [null, null];
}
function simpleParse(...keys) {
  return (match2, cursor) => {
    const ret = {};
    let i2;
    for (i2 = 0; i2 < keys.length; i2++) {
      ret[keys[i2]] = parseInteger(match2[cursor + i2]);
    }
    return [ret, null, cursor + i2];
  };
}
const offsetRegex = /(?:(Z)|([+-]\d\d)(?::?(\d\d))?)/;
const isoExtendedZone = `(?:${offsetRegex.source}?(?:\\[(${ianaRegex.source})\\])?)?`;
const isoTimeBaseRegex = /(\d\d)(?::?(\d\d)(?::?(\d\d)(?:[.,](\d{1,30}))?)?)?/;
const isoTimeRegex = RegExp(`${isoTimeBaseRegex.source}${isoExtendedZone}`);
const isoTimeExtensionRegex = RegExp(`(?:T${isoTimeRegex.source})?`);
const isoYmdRegex = /([+-]\d{6}|\d{4})(?:-?(\d\d)(?:-?(\d\d))?)?/;
const isoWeekRegex = /(\d{4})-?W(\d\d)(?:-?(\d))?/;
const isoOrdinalRegex = /(\d{4})-?(\d{3})/;
const extractISOWeekData = simpleParse("weekYear", "weekNumber", "weekDay");
const extractISOOrdinalData = simpleParse("year", "ordinal");
const sqlYmdRegex = /(\d{4})-(\d\d)-(\d\d)/;
const sqlTimeRegex = RegExp(
  `${isoTimeBaseRegex.source} ?(?:${offsetRegex.source}|(${ianaRegex.source}))?`
);
const sqlTimeExtensionRegex = RegExp(`(?: ${sqlTimeRegex.source})?`);
function int(match2, pos, fallback) {
  const m2 = match2[pos];
  return isUndefined(m2) ? fallback : parseInteger(m2);
}
function extractISOYmd(match2, cursor) {
  const item = {
    year: int(match2, cursor),
    month: int(match2, cursor + 1, 1),
    day: int(match2, cursor + 2, 1)
  };
  return [item, null, cursor + 3];
}
function extractISOTime(match2, cursor) {
  const item = {
    hours: int(match2, cursor, 0),
    minutes: int(match2, cursor + 1, 0),
    seconds: int(match2, cursor + 2, 0),
    milliseconds: parseMillis(match2[cursor + 3])
  };
  return [item, null, cursor + 4];
}
function extractISOOffset(match2, cursor) {
  const local = !match2[cursor] && !match2[cursor + 1], fullOffset = signedOffset(match2[cursor + 1], match2[cursor + 2]), zone = local ? null : FixedOffsetZone.instance(fullOffset);
  return [{}, zone, cursor + 3];
}
function extractIANAZone(match2, cursor) {
  const zone = match2[cursor] ? IANAZone.create(match2[cursor]) : null;
  return [{}, zone, cursor + 1];
}
const isoTimeOnly = RegExp(`^T?${isoTimeBaseRegex.source}$`);
const isoDuration = /^-?P(?:(?:(-?\d{1,20}(?:\.\d{1,20})?)Y)?(?:(-?\d{1,20}(?:\.\d{1,20})?)M)?(?:(-?\d{1,20}(?:\.\d{1,20})?)W)?(?:(-?\d{1,20}(?:\.\d{1,20})?)D)?(?:T(?:(-?\d{1,20}(?:\.\d{1,20})?)H)?(?:(-?\d{1,20}(?:\.\d{1,20})?)M)?(?:(-?\d{1,20})(?:[.,](-?\d{1,20}))?S)?)?)$/;
function extractISODuration(match2) {
  const [s2, yearStr, monthStr, weekStr, dayStr, hourStr, minuteStr, secondStr, millisecondsStr] = match2;
  const hasNegativePrefix = s2[0] === "-";
  const negativeSeconds = secondStr && secondStr[0] === "-";
  const maybeNegate = (num, force = false) => num !== void 0 && (force || num && hasNegativePrefix) ? -num : num;
  return [
    {
      years: maybeNegate(parseFloating(yearStr)),
      months: maybeNegate(parseFloating(monthStr)),
      weeks: maybeNegate(parseFloating(weekStr)),
      days: maybeNegate(parseFloating(dayStr)),
      hours: maybeNegate(parseFloating(hourStr)),
      minutes: maybeNegate(parseFloating(minuteStr)),
      seconds: maybeNegate(parseFloating(secondStr), secondStr === "-0"),
      milliseconds: maybeNegate(parseMillis(millisecondsStr), negativeSeconds)
    }
  ];
}
const obsOffsets = {
  GMT: 0,
  EDT: -4 * 60,
  EST: -5 * 60,
  CDT: -5 * 60,
  CST: -6 * 60,
  MDT: -6 * 60,
  MST: -7 * 60,
  PDT: -7 * 60,
  PST: -8 * 60
};
function fromStrings(weekdayStr, yearStr, monthStr, dayStr, hourStr, minuteStr, secondStr) {
  const result = {
    year: yearStr.length === 2 ? untruncateYear(parseInteger(yearStr)) : parseInteger(yearStr),
    month: monthsShort.indexOf(monthStr) + 1,
    day: parseInteger(dayStr),
    hour: parseInteger(hourStr),
    minute: parseInteger(minuteStr)
  };
  if (secondStr) result.second = parseInteger(secondStr);
  if (weekdayStr) {
    result.weekday = weekdayStr.length > 3 ? weekdaysLong.indexOf(weekdayStr) + 1 : weekdaysShort.indexOf(weekdayStr) + 1;
  }
  return result;
}
const rfc2822 = /^(?:(Mon|Tue|Wed|Thu|Fri|Sat|Sun),\s)?(\d{1,2})\s(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)\s(\d{2,4})\s(\d\d):(\d\d)(?::(\d\d))?\s(?:(UT|GMT|[ECMP][SD]T)|([Zz])|(?:([+-]\d\d)(\d\d)))$/;
function extractRFC2822(match2) {
  const [
    ,
    weekdayStr,
    dayStr,
    monthStr,
    yearStr,
    hourStr,
    minuteStr,
    secondStr,
    obsOffset,
    milOffset,
    offHourStr,
    offMinuteStr
  ] = match2, result = fromStrings(weekdayStr, yearStr, monthStr, dayStr, hourStr, minuteStr, secondStr);
  let offset2;
  if (obsOffset) {
    offset2 = obsOffsets[obsOffset];
  } else if (milOffset) {
    offset2 = 0;
  } else {
    offset2 = signedOffset(offHourStr, offMinuteStr);
  }
  return [result, new FixedOffsetZone(offset2)];
}
function preprocessRFC2822(s2) {
  return s2.replace(/\([^()]*\)|[\n\t]/g, " ").replace(/(\s\s+)/g, " ").trim();
}
const rfc1123 = /^(Mon|Tue|Wed|Thu|Fri|Sat|Sun), (\d\d) (Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec) (\d{4}) (\d\d):(\d\d):(\d\d) GMT$/, rfc850 = /^(Monday|Tuesday|Wednesday|Thursday|Friday|Saturday|Sunday), (\d\d)-(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)-(\d\d) (\d\d):(\d\d):(\d\d) GMT$/, ascii = /^(Mon|Tue|Wed|Thu|Fri|Sat|Sun) (Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec) ( \d|\d\d) (\d\d):(\d\d):(\d\d) (\d{4})$/;
function extractRFC1123Or850(match2) {
  const [, weekdayStr, dayStr, monthStr, yearStr, hourStr, minuteStr, secondStr] = match2, result = fromStrings(weekdayStr, yearStr, monthStr, dayStr, hourStr, minuteStr, secondStr);
  return [result, FixedOffsetZone.utcInstance];
}
function extractASCII(match2) {
  const [, weekdayStr, monthStr, dayStr, hourStr, minuteStr, secondStr, yearStr] = match2, result = fromStrings(weekdayStr, yearStr, monthStr, dayStr, hourStr, minuteStr, secondStr);
  return [result, FixedOffsetZone.utcInstance];
}
const isoYmdWithTimeExtensionRegex = combineRegexes(isoYmdRegex, isoTimeExtensionRegex);
const isoWeekWithTimeExtensionRegex = combineRegexes(isoWeekRegex, isoTimeExtensionRegex);
const isoOrdinalWithTimeExtensionRegex = combineRegexes(isoOrdinalRegex, isoTimeExtensionRegex);
const isoTimeCombinedRegex = combineRegexes(isoTimeRegex);
const extractISOYmdTimeAndOffset = combineExtractors(
  extractISOYmd,
  extractISOTime,
  extractISOOffset,
  extractIANAZone
);
const extractISOWeekTimeAndOffset = combineExtractors(
  extractISOWeekData,
  extractISOTime,
  extractISOOffset,
  extractIANAZone
);
const extractISOOrdinalDateAndTime = combineExtractors(
  extractISOOrdinalData,
  extractISOTime,
  extractISOOffset,
  extractIANAZone
);
const extractISOTimeAndOffset = combineExtractors(
  extractISOTime,
  extractISOOffset,
  extractIANAZone
);
function parseISODate(s2) {
  return parse(
    s2,
    [isoYmdWithTimeExtensionRegex, extractISOYmdTimeAndOffset],
    [isoWeekWithTimeExtensionRegex, extractISOWeekTimeAndOffset],
    [isoOrdinalWithTimeExtensionRegex, extractISOOrdinalDateAndTime],
    [isoTimeCombinedRegex, extractISOTimeAndOffset]
  );
}
function parseRFC2822Date(s2) {
  return parse(preprocessRFC2822(s2), [rfc2822, extractRFC2822]);
}
function parseHTTPDate(s2) {
  return parse(
    s2,
    [rfc1123, extractRFC1123Or850],
    [rfc850, extractRFC1123Or850],
    [ascii, extractASCII]
  );
}
function parseISODuration(s2) {
  return parse(s2, [isoDuration, extractISODuration]);
}
const extractISOTimeOnly = combineExtractors(extractISOTime);
function parseISOTimeOnly(s2) {
  return parse(s2, [isoTimeOnly, extractISOTimeOnly]);
}
const sqlYmdWithTimeExtensionRegex = combineRegexes(sqlYmdRegex, sqlTimeExtensionRegex);
const sqlTimeCombinedRegex = combineRegexes(sqlTimeRegex);
const extractISOTimeOffsetAndIANAZone = combineExtractors(
  extractISOTime,
  extractISOOffset,
  extractIANAZone
);
function parseSQL(s2) {
  return parse(
    s2,
    [sqlYmdWithTimeExtensionRegex, extractISOYmdTimeAndOffset],
    [sqlTimeCombinedRegex, extractISOTimeOffsetAndIANAZone]
  );
}
const INVALID$2 = "Invalid Duration";
const lowOrderMatrix = {
  weeks: {
    days: 7,
    hours: 7 * 24,
    minutes: 7 * 24 * 60,
    seconds: 7 * 24 * 60 * 60,
    milliseconds: 7 * 24 * 60 * 60 * 1e3
  },
  days: {
    hours: 24,
    minutes: 24 * 60,
    seconds: 24 * 60 * 60,
    milliseconds: 24 * 60 * 60 * 1e3
  },
  hours: { minutes: 60, seconds: 60 * 60, milliseconds: 60 * 60 * 1e3 },
  minutes: { seconds: 60, milliseconds: 60 * 1e3 },
  seconds: { milliseconds: 1e3 }
}, casualMatrix = {
  years: {
    quarters: 4,
    months: 12,
    weeks: 52,
    days: 365,
    hours: 365 * 24,
    minutes: 365 * 24 * 60,
    seconds: 365 * 24 * 60 * 60,
    milliseconds: 365 * 24 * 60 * 60 * 1e3
  },
  quarters: {
    months: 3,
    weeks: 13,
    days: 91,
    hours: 91 * 24,
    minutes: 91 * 24 * 60,
    seconds: 91 * 24 * 60 * 60,
    milliseconds: 91 * 24 * 60 * 60 * 1e3
  },
  months: {
    weeks: 4,
    days: 30,
    hours: 30 * 24,
    minutes: 30 * 24 * 60,
    seconds: 30 * 24 * 60 * 60,
    milliseconds: 30 * 24 * 60 * 60 * 1e3
  },
  ...lowOrderMatrix
}, daysInYearAccurate = 146097 / 400, daysInMonthAccurate = 146097 / 4800, accurateMatrix = {
  years: {
    quarters: 4,
    months: 12,
    weeks: daysInYearAccurate / 7,
    days: daysInYearAccurate,
    hours: daysInYearAccurate * 24,
    minutes: daysInYearAccurate * 24 * 60,
    seconds: daysInYearAccurate * 24 * 60 * 60,
    milliseconds: daysInYearAccurate * 24 * 60 * 60 * 1e3
  },
  quarters: {
    months: 3,
    weeks: daysInYearAccurate / 28,
    days: daysInYearAccurate / 4,
    hours: daysInYearAccurate * 24 / 4,
    minutes: daysInYearAccurate * 24 * 60 / 4,
    seconds: daysInYearAccurate * 24 * 60 * 60 / 4,
    milliseconds: daysInYearAccurate * 24 * 60 * 60 * 1e3 / 4
  },
  months: {
    weeks: daysInMonthAccurate / 7,
    days: daysInMonthAccurate,
    hours: daysInMonthAccurate * 24,
    minutes: daysInMonthAccurate * 24 * 60,
    seconds: daysInMonthAccurate * 24 * 60 * 60,
    milliseconds: daysInMonthAccurate * 24 * 60 * 60 * 1e3
  },
  ...lowOrderMatrix
};
const orderedUnits$1 = [
  "years",
  "quarters",
  "months",
  "weeks",
  "days",
  "hours",
  "minutes",
  "seconds",
  "milliseconds"
];
const reverseUnits = orderedUnits$1.slice(0).reverse();
function clone$1(dur, alts, clear = false) {
  const conf = {
    values: clear ? alts.values : { ...dur.values, ...alts.values || {} },
    loc: dur.loc.clone(alts.loc),
    conversionAccuracy: alts.conversionAccuracy || dur.conversionAccuracy,
    matrix: alts.matrix || dur.matrix
  };
  return new Duration(conf);
}
function durationToMillis(matrix, vals) {
  let sum = vals.milliseconds ?? 0;
  for (const unit of reverseUnits.slice(1)) {
    if (vals[unit]) {
      sum += vals[unit] * matrix[unit]["milliseconds"];
    }
  }
  return sum;
}
function normalizeValues(matrix, vals) {
  const factor = durationToMillis(matrix, vals) < 0 ? -1 : 1;
  orderedUnits$1.reduceRight((previous, current) => {
    if (!isUndefined(vals[current])) {
      if (previous) {
        const previousVal = vals[previous] * factor;
        const conv = matrix[current][previous];
        const rollUp = Math.floor(previousVal / conv);
        vals[current] += rollUp * factor;
        vals[previous] -= rollUp * conv * factor;
      }
      return current;
    } else {
      return previous;
    }
  }, null);
  orderedUnits$1.reduce((previous, current) => {
    if (!isUndefined(vals[current])) {
      if (previous) {
        const fraction = vals[previous] % 1;
        vals[previous] -= fraction;
        vals[current] += fraction * matrix[previous][current];
      }
      return current;
    } else {
      return previous;
    }
  }, null);
}
function removeZeroes(vals) {
  const newVals = {};
  for (const [key, value] of Object.entries(vals)) {
    if (value !== 0) {
      newVals[key] = value;
    }
  }
  return newVals;
}
class Duration {
  /**
   * @private
   */
  constructor(config) {
    const accurate = config.conversionAccuracy === "longterm" || false;
    let matrix = accurate ? accurateMatrix : casualMatrix;
    if (config.matrix) {
      matrix = config.matrix;
    }
    this.values = config.values;
    this.loc = config.loc || Locale.create();
    this.conversionAccuracy = accurate ? "longterm" : "casual";
    this.invalid = config.invalid || null;
    this.matrix = matrix;
    this.isLuxonDuration = true;
  }
  /**
   * Create Duration from a number of milliseconds.
   * @param {number} count of milliseconds
   * @param {Object} opts - options for parsing
   * @param {string} [opts.locale='en-US'] - the locale to use
   * @param {string} opts.numberingSystem - the numbering system to use
   * @param {string} [opts.conversionAccuracy='casual'] - the conversion system to use
   * @return {Duration}
   */
  static fromMillis(count, opts) {
    return Duration.fromObject({ milliseconds: count }, opts);
  }
  /**
   * Create a Duration from a JavaScript object with keys like 'years' and 'hours'.
   * If this object is empty then a zero milliseconds duration is returned.
   * @param {Object} obj - the object to create the DateTime from
   * @param {number} obj.years
   * @param {number} obj.quarters
   * @param {number} obj.months
   * @param {number} obj.weeks
   * @param {number} obj.days
   * @param {number} obj.hours
   * @param {number} obj.minutes
   * @param {number} obj.seconds
   * @param {number} obj.milliseconds
   * @param {Object} [opts=[]] - options for creating this Duration
   * @param {string} [opts.locale='en-US'] - the locale to use
   * @param {string} opts.numberingSystem - the numbering system to use
   * @param {string} [opts.conversionAccuracy='casual'] - the preset conversion system to use
   * @param {string} [opts.matrix=Object] - the custom conversion system to use
   * @return {Duration}
   */
  static fromObject(obj, opts = {}) {
    if (obj == null || typeof obj !== "object") {
      throw new InvalidArgumentError(
        `Duration.fromObject: argument expected to be an object, got ${obj === null ? "null" : typeof obj}`
      );
    }
    return new Duration({
      values: normalizeObject(obj, Duration.normalizeUnit),
      loc: Locale.fromObject(opts),
      conversionAccuracy: opts.conversionAccuracy,
      matrix: opts.matrix
    });
  }
  /**
   * Create a Duration from DurationLike.
   *
   * @param {Object | number | Duration} durationLike
   * One of:
   * - object with keys like 'years' and 'hours'.
   * - number representing milliseconds
   * - Duration instance
   * @return {Duration}
   */
  static fromDurationLike(durationLike) {
    if (isNumber(durationLike)) {
      return Duration.fromMillis(durationLike);
    } else if (Duration.isDuration(durationLike)) {
      return durationLike;
    } else if (typeof durationLike === "object") {
      return Duration.fromObject(durationLike);
    } else {
      throw new InvalidArgumentError(
        `Unknown duration argument ${durationLike} of type ${typeof durationLike}`
      );
    }
  }
  /**
   * Create a Duration from an ISO 8601 duration string.
   * @param {string} text - text to parse
   * @param {Object} opts - options for parsing
   * @param {string} [opts.locale='en-US'] - the locale to use
   * @param {string} opts.numberingSystem - the numbering system to use
   * @param {string} [opts.conversionAccuracy='casual'] - the preset conversion system to use
   * @param {string} [opts.matrix=Object] - the preset conversion system to use
   * @see https://en.wikipedia.org/wiki/ISO_8601#Durations
   * @example Duration.fromISO('P3Y6M1W4DT12H30M5S').toObject() //=> { years: 3, months: 6, weeks: 1, days: 4, hours: 12, minutes: 30, seconds: 5 }
   * @example Duration.fromISO('PT23H').toObject() //=> { hours: 23 }
   * @example Duration.fromISO('P5Y3M').toObject() //=> { years: 5, months: 3 }
   * @return {Duration}
   */
  static fromISO(text, opts) {
    const [parsed] = parseISODuration(text);
    if (parsed) {
      return Duration.fromObject(parsed, opts);
    } else {
      return Duration.invalid("unparsable", `the input "${text}" can't be parsed as ISO 8601`);
    }
  }
  /**
   * Create a Duration from an ISO 8601 time string.
   * @param {string} text - text to parse
   * @param {Object} opts - options for parsing
   * @param {string} [opts.locale='en-US'] - the locale to use
   * @param {string} opts.numberingSystem - the numbering system to use
   * @param {string} [opts.conversionAccuracy='casual'] - the preset conversion system to use
   * @param {string} [opts.matrix=Object] - the conversion system to use
   * @see https://en.wikipedia.org/wiki/ISO_8601#Times
   * @example Duration.fromISOTime('11:22:33.444').toObject() //=> { hours: 11, minutes: 22, seconds: 33, milliseconds: 444 }
   * @example Duration.fromISOTime('11:00').toObject() //=> { hours: 11, minutes: 0, seconds: 0 }
   * @example Duration.fromISOTime('T11:00').toObject() //=> { hours: 11, minutes: 0, seconds: 0 }
   * @example Duration.fromISOTime('1100').toObject() //=> { hours: 11, minutes: 0, seconds: 0 }
   * @example Duration.fromISOTime('T1100').toObject() //=> { hours: 11, minutes: 0, seconds: 0 }
   * @return {Duration}
   */
  static fromISOTime(text, opts) {
    const [parsed] = parseISOTimeOnly(text);
    if (parsed) {
      return Duration.fromObject(parsed, opts);
    } else {
      return Duration.invalid("unparsable", `the input "${text}" can't be parsed as ISO 8601`);
    }
  }
  /**
   * Create an invalid Duration.
   * @param {string} reason - simple string of why this datetime is invalid. Should not contain parameters or anything else data-dependent
   * @param {string} [explanation=null] - longer explanation, may include parameters and other useful debugging information
   * @return {Duration}
   */
  static invalid(reason, explanation = null) {
    if (!reason) {
      throw new InvalidArgumentError("need to specify a reason the Duration is invalid");
    }
    const invalid = reason instanceof Invalid ? reason : new Invalid(reason, explanation);
    if (Settings.throwOnInvalid) {
      throw new InvalidDurationError(invalid);
    } else {
      return new Duration({ invalid });
    }
  }
  /**
   * @private
   */
  static normalizeUnit(unit) {
    const normalized = {
      year: "years",
      years: "years",
      quarter: "quarters",
      quarters: "quarters",
      month: "months",
      months: "months",
      week: "weeks",
      weeks: "weeks",
      day: "days",
      days: "days",
      hour: "hours",
      hours: "hours",
      minute: "minutes",
      minutes: "minutes",
      second: "seconds",
      seconds: "seconds",
      millisecond: "milliseconds",
      milliseconds: "milliseconds"
    }[unit ? unit.toLowerCase() : unit];
    if (!normalized) throw new InvalidUnitError(unit);
    return normalized;
  }
  /**
   * Check if an object is a Duration. Works across context boundaries
   * @param {object} o
   * @return {boolean}
   */
  static isDuration(o2) {
    return o2 && o2.isLuxonDuration || false;
  }
  /**
   * Get  the locale of a Duration, such 'en-GB'
   * @type {string}
   */
  get locale() {
    return this.isValid ? this.loc.locale : null;
  }
  /**
   * Get the numbering system of a Duration, such 'beng'. The numbering system is used when formatting the Duration
   *
   * @type {string}
   */
  get numberingSystem() {
    return this.isValid ? this.loc.numberingSystem : null;
  }
  /**
   * Returns a string representation of this Duration formatted according to the specified format string. You may use these tokens:
   * * `S` for milliseconds
   * * `s` for seconds
   * * `m` for minutes
   * * `h` for hours
   * * `d` for days
   * * `w` for weeks
   * * `M` for months
   * * `y` for years
   * Notes:
   * * Add padding by repeating the token, e.g. "yy" pads the years to two digits, "hhhh" pads the hours out to four digits
   * * Tokens can be escaped by wrapping with single quotes.
   * * The duration will be converted to the set of units in the format string using {@link Duration#shiftTo} and the Durations's conversion accuracy setting.
   * @param {string} fmt - the format string
   * @param {Object} opts - options
   * @param {boolean} [opts.floor=true] - floor numerical values
   * @example Duration.fromObject({ years: 1, days: 6, seconds: 2 }).toFormat("y d s") //=> "1 6 2"
   * @example Duration.fromObject({ years: 1, days: 6, seconds: 2 }).toFormat("yy dd sss") //=> "01 06 002"
   * @example Duration.fromObject({ years: 1, days: 6, seconds: 2 }).toFormat("M S") //=> "12 518402000"
   * @return {string}
   */
  toFormat(fmt, opts = {}) {
    const fmtOpts = {
      ...opts,
      floor: opts.round !== false && opts.floor !== false
    };
    return this.isValid ? Formatter.create(this.loc, fmtOpts).formatDurationFromString(this, fmt) : INVALID$2;
  }
  /**
   * Returns a string representation of a Duration with all units included.
   * To modify its behavior, use `listStyle` and any Intl.NumberFormat option, though `unitDisplay` is especially relevant.
   * @see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/NumberFormat/NumberFormat#options
   * @param {Object} opts - Formatting options. Accepts the same keys as the options parameter of the native `Intl.NumberFormat` constructor, as well as `listStyle`.
   * @param {string} [opts.listStyle='narrow'] - How to format the merged list. Corresponds to the `style` property of the options parameter of the native `Intl.ListFormat` constructor.
   * @example
   * ```js
   * var dur = Duration.fromObject({ days: 1, hours: 5, minutes: 6 })
   * dur.toHuman() //=> '1 day, 5 hours, 6 minutes'
   * dur.toHuman({ listStyle: "long" }) //=> '1 day, 5 hours, and 6 minutes'
   * dur.toHuman({ unitDisplay: "short" }) //=> '1 day, 5 hr, 6 min'
   * ```
   */
  toHuman(opts = {}) {
    if (!this.isValid) return INVALID$2;
    const l2 = orderedUnits$1.map((unit) => {
      const val = this.values[unit];
      if (isUndefined(val)) {
        return null;
      }
      return this.loc.numberFormatter({ style: "unit", unitDisplay: "long", ...opts, unit: unit.slice(0, -1) }).format(val);
    }).filter((n3) => n3);
    return this.loc.listFormatter({ type: "conjunction", style: opts.listStyle || "narrow", ...opts }).format(l2);
  }
  /**
   * Returns a JavaScript object with this Duration's values.
   * @example Duration.fromObject({ years: 1, days: 6, seconds: 2 }).toObject() //=> { years: 1, days: 6, seconds: 2 }
   * @return {Object}
   */
  toObject() {
    if (!this.isValid) return {};
    return { ...this.values };
  }
  /**
   * Returns an ISO 8601-compliant string representation of this Duration.
   * @see https://en.wikipedia.org/wiki/ISO_8601#Durations
   * @example Duration.fromObject({ years: 3, seconds: 45 }).toISO() //=> 'P3YT45S'
   * @example Duration.fromObject({ months: 4, seconds: 45 }).toISO() //=> 'P4MT45S'
   * @example Duration.fromObject({ months: 5 }).toISO() //=> 'P5M'
   * @example Duration.fromObject({ minutes: 5 }).toISO() //=> 'PT5M'
   * @example Duration.fromObject({ milliseconds: 6 }).toISO() //=> 'PT0.006S'
   * @return {string}
   */
  toISO() {
    if (!this.isValid) return null;
    let s2 = "P";
    if (this.years !== 0) s2 += this.years + "Y";
    if (this.months !== 0 || this.quarters !== 0) s2 += this.months + this.quarters * 3 + "M";
    if (this.weeks !== 0) s2 += this.weeks + "W";
    if (this.days !== 0) s2 += this.days + "D";
    if (this.hours !== 0 || this.minutes !== 0 || this.seconds !== 0 || this.milliseconds !== 0)
      s2 += "T";
    if (this.hours !== 0) s2 += this.hours + "H";
    if (this.minutes !== 0) s2 += this.minutes + "M";
    if (this.seconds !== 0 || this.milliseconds !== 0)
      s2 += roundTo(this.seconds + this.milliseconds / 1e3, 3) + "S";
    if (s2 === "P") s2 += "T0S";
    return s2;
  }
  /**
   * Returns an ISO 8601-compliant string representation of this Duration, formatted as a time of day.
   * Note that this will return null if the duration is invalid, negative, or equal to or greater than 24 hours.
   * @see https://en.wikipedia.org/wiki/ISO_8601#Times
   * @param {Object} opts - options
   * @param {boolean} [opts.suppressMilliseconds=false] - exclude milliseconds from the format if they're 0
   * @param {boolean} [opts.suppressSeconds=false] - exclude seconds from the format if they're 0
   * @param {boolean} [opts.includePrefix=false] - include the `T` prefix
   * @param {string} [opts.format='extended'] - choose between the basic and extended format
   * @example Duration.fromObject({ hours: 11 }).toISOTime() //=> '11:00:00.000'
   * @example Duration.fromObject({ hours: 11 }).toISOTime({ suppressMilliseconds: true }) //=> '11:00:00'
   * @example Duration.fromObject({ hours: 11 }).toISOTime({ suppressSeconds: true }) //=> '11:00'
   * @example Duration.fromObject({ hours: 11 }).toISOTime({ includePrefix: true }) //=> 'T11:00:00.000'
   * @example Duration.fromObject({ hours: 11 }).toISOTime({ format: 'basic' }) //=> '110000.000'
   * @return {string}
   */
  toISOTime(opts = {}) {
    if (!this.isValid) return null;
    const millis = this.toMillis();
    if (millis < 0 || millis >= 864e5) return null;
    opts = {
      suppressMilliseconds: false,
      suppressSeconds: false,
      includePrefix: false,
      format: "extended",
      ...opts,
      includeOffset: false
    };
    const dateTime = DateTime.fromMillis(millis, { zone: "UTC" });
    return dateTime.toISOTime(opts);
  }
  /**
   * Returns an ISO 8601 representation of this Duration appropriate for use in JSON.
   * @return {string}
   */
  toJSON() {
    return this.toISO();
  }
  /**
   * Returns an ISO 8601 representation of this Duration appropriate for use in debugging.
   * @return {string}
   */
  toString() {
    return this.toISO();
  }
  /**
   * Returns a string representation of this Duration appropriate for the REPL.
   * @return {string}
   */
  [Symbol.for("nodejs.util.inspect.custom")]() {
    if (this.isValid) {
      return `Duration { values: ${JSON.stringify(this.values)} }`;
    } else {
      return `Duration { Invalid, reason: ${this.invalidReason} }`;
    }
  }
  /**
   * Returns an milliseconds value of this Duration.
   * @return {number}
   */
  toMillis() {
    if (!this.isValid) return NaN;
    return durationToMillis(this.matrix, this.values);
  }
  /**
   * Returns an milliseconds value of this Duration. Alias of {@link toMillis}
   * @return {number}
   */
  valueOf() {
    return this.toMillis();
  }
  /**
   * Make this Duration longer by the specified amount. Return a newly-constructed Duration.
   * @param {Duration|Object|number} duration - The amount to add. Either a Luxon Duration, a number of milliseconds, the object argument to Duration.fromObject()
   * @return {Duration}
   */
  plus(duration) {
    if (!this.isValid) return this;
    const dur = Duration.fromDurationLike(duration), result = {};
    for (const k2 of orderedUnits$1) {
      if (hasOwnProperty(dur.values, k2) || hasOwnProperty(this.values, k2)) {
        result[k2] = dur.get(k2) + this.get(k2);
      }
    }
    return clone$1(this, { values: result }, true);
  }
  /**
   * Make this Duration shorter by the specified amount. Return a newly-constructed Duration.
   * @param {Duration|Object|number} duration - The amount to subtract. Either a Luxon Duration, a number of milliseconds, the object argument to Duration.fromObject()
   * @return {Duration}
   */
  minus(duration) {
    if (!this.isValid) return this;
    const dur = Duration.fromDurationLike(duration);
    return this.plus(dur.negate());
  }
  /**
   * Scale this Duration by the specified amount. Return a newly-constructed Duration.
   * @param {function} fn - The function to apply to each unit. Arity is 1 or 2: the value of the unit and, optionally, the unit name. Must return a number.
   * @example Duration.fromObject({ hours: 1, minutes: 30 }).mapUnits(x => x * 2) //=> { hours: 2, minutes: 60 }
   * @example Duration.fromObject({ hours: 1, minutes: 30 }).mapUnits((x, u) => u === "hours" ? x * 2 : x) //=> { hours: 2, minutes: 30 }
   * @return {Duration}
   */
  mapUnits(fn) {
    if (!this.isValid) return this;
    const result = {};
    for (const k2 of Object.keys(this.values)) {
      result[k2] = asNumber(fn(this.values[k2], k2));
    }
    return clone$1(this, { values: result }, true);
  }
  /**
   * Get the value of unit.
   * @param {string} unit - a unit such as 'minute' or 'day'
   * @example Duration.fromObject({years: 2, days: 3}).get('years') //=> 2
   * @example Duration.fromObject({years: 2, days: 3}).get('months') //=> 0
   * @example Duration.fromObject({years: 2, days: 3}).get('days') //=> 3
   * @return {number}
   */
  get(unit) {
    return this[Duration.normalizeUnit(unit)];
  }
  /**
   * "Set" the values of specified units. Return a newly-constructed Duration.
   * @param {Object} values - a mapping of units to numbers
   * @example dur.set({ years: 2017 })
   * @example dur.set({ hours: 8, minutes: 30 })
   * @return {Duration}
   */
  set(values) {
    if (!this.isValid) return this;
    const mixed = { ...this.values, ...normalizeObject(values, Duration.normalizeUnit) };
    return clone$1(this, { values: mixed });
  }
  /**
   * "Set" the locale and/or numberingSystem.  Returns a newly-constructed Duration.
   * @example dur.reconfigure({ locale: 'en-GB' })
   * @return {Duration}
   */
  reconfigure({ locale, numberingSystem, conversionAccuracy, matrix } = {}) {
    const loc = this.loc.clone({ locale, numberingSystem });
    const opts = { loc, matrix, conversionAccuracy };
    return clone$1(this, opts);
  }
  /**
   * Return the length of the duration in the specified unit.
   * @param {string} unit - a unit such as 'minutes' or 'days'
   * @example Duration.fromObject({years: 1}).as('days') //=> 365
   * @example Duration.fromObject({years: 1}).as('months') //=> 12
   * @example Duration.fromObject({hours: 60}).as('days') //=> 2.5
   * @return {number}
   */
  as(unit) {
    return this.isValid ? this.shiftTo(unit).get(unit) : NaN;
  }
  /**
   * Reduce this Duration to its canonical representation in its current units.
   * Assuming the overall value of the Duration is positive, this means:
   * - excessive values for lower-order units are converted to higher-order units (if possible, see first and second example)
   * - negative lower-order units are converted to higher order units (there must be such a higher order unit, otherwise
   *   the overall value would be negative, see third example)
   * - fractional values for higher-order units are converted to lower-order units (if possible, see fourth example)
   *
   * If the overall value is negative, the result of this method is equivalent to `this.negate().normalize().negate()`.
   * @example Duration.fromObject({ years: 2, days: 5000 }).normalize().toObject() //=> { years: 15, days: 255 }
   * @example Duration.fromObject({ days: 5000 }).normalize().toObject() //=> { days: 5000 }
   * @example Duration.fromObject({ hours: 12, minutes: -45 }).normalize().toObject() //=> { hours: 11, minutes: 15 }
   * @example Duration.fromObject({ years: 2.5, days: 0, hours: 0 }).normalize().toObject() //=> { years: 2, days: 182, hours: 12 }
   * @return {Duration}
   */
  normalize() {
    if (!this.isValid) return this;
    const vals = this.toObject();
    normalizeValues(this.matrix, vals);
    return clone$1(this, { values: vals }, true);
  }
  /**
   * Rescale units to its largest representation
   * @example Duration.fromObject({ milliseconds: 90000 }).rescale().toObject() //=> { minutes: 1, seconds: 30 }
   * @return {Duration}
   */
  rescale() {
    if (!this.isValid) return this;
    const vals = removeZeroes(this.normalize().shiftToAll().toObject());
    return clone$1(this, { values: vals }, true);
  }
  /**
   * Convert this Duration into its representation in a different set of units.
   * @example Duration.fromObject({ hours: 1, seconds: 30 }).shiftTo('minutes', 'milliseconds').toObject() //=> { minutes: 60, milliseconds: 30000 }
   * @return {Duration}
   */
  shiftTo(...units) {
    if (!this.isValid) return this;
    if (units.length === 0) {
      return this;
    }
    units = units.map((u2) => Duration.normalizeUnit(u2));
    const built = {}, accumulated = {}, vals = this.toObject();
    let lastUnit;
    for (const k2 of orderedUnits$1) {
      if (units.indexOf(k2) >= 0) {
        lastUnit = k2;
        let own = 0;
        for (const ak in accumulated) {
          own += this.matrix[ak][k2] * accumulated[ak];
          accumulated[ak] = 0;
        }
        if (isNumber(vals[k2])) {
          own += vals[k2];
        }
        const i2 = Math.trunc(own);
        built[k2] = i2;
        accumulated[k2] = (own * 1e3 - i2 * 1e3) / 1e3;
      } else if (isNumber(vals[k2])) {
        accumulated[k2] = vals[k2];
      }
    }
    for (const key in accumulated) {
      if (accumulated[key] !== 0) {
        built[lastUnit] += key === lastUnit ? accumulated[key] : accumulated[key] / this.matrix[lastUnit][key];
      }
    }
    normalizeValues(this.matrix, built);
    return clone$1(this, { values: built }, true);
  }
  /**
   * Shift this Duration to all available units.
   * Same as shiftTo("years", "months", "weeks", "days", "hours", "minutes", "seconds", "milliseconds")
   * @return {Duration}
   */
  shiftToAll() {
    if (!this.isValid) return this;
    return this.shiftTo(
      "years",
      "months",
      "weeks",
      "days",
      "hours",
      "minutes",
      "seconds",
      "milliseconds"
    );
  }
  /**
   * Return the negative of this Duration.
   * @example Duration.fromObject({ hours: 1, seconds: 30 }).negate().toObject() //=> { hours: -1, seconds: -30 }
   * @return {Duration}
   */
  negate() {
    if (!this.isValid) return this;
    const negated = {};
    for (const k2 of Object.keys(this.values)) {
      negated[k2] = this.values[k2] === 0 ? 0 : -this.values[k2];
    }
    return clone$1(this, { values: negated }, true);
  }
  /**
   * Get the years.
   * @type {number}
   */
  get years() {
    return this.isValid ? this.values.years || 0 : NaN;
  }
  /**
   * Get the quarters.
   * @type {number}
   */
  get quarters() {
    return this.isValid ? this.values.quarters || 0 : NaN;
  }
  /**
   * Get the months.
   * @type {number}
   */
  get months() {
    return this.isValid ? this.values.months || 0 : NaN;
  }
  /**
   * Get the weeks
   * @type {number}
   */
  get weeks() {
    return this.isValid ? this.values.weeks || 0 : NaN;
  }
  /**
   * Get the days.
   * @type {number}
   */
  get days() {
    return this.isValid ? this.values.days || 0 : NaN;
  }
  /**
   * Get the hours.
   * @type {number}
   */
  get hours() {
    return this.isValid ? this.values.hours || 0 : NaN;
  }
  /**
   * Get the minutes.
   * @type {number}
   */
  get minutes() {
    return this.isValid ? this.values.minutes || 0 : NaN;
  }
  /**
   * Get the seconds.
   * @return {number}
   */
  get seconds() {
    return this.isValid ? this.values.seconds || 0 : NaN;
  }
  /**
   * Get the milliseconds.
   * @return {number}
   */
  get milliseconds() {
    return this.isValid ? this.values.milliseconds || 0 : NaN;
  }
  /**
   * Returns whether the Duration is invalid. Invalid durations are returned by diff operations
   * on invalid DateTimes or Intervals.
   * @return {boolean}
   */
  get isValid() {
    return this.invalid === null;
  }
  /**
   * Returns an error code if this Duration became invalid, or null if the Duration is valid
   * @return {string}
   */
  get invalidReason() {
    return this.invalid ? this.invalid.reason : null;
  }
  /**
   * Returns an explanation of why this Duration became invalid, or null if the Duration is valid
   * @type {string}
   */
  get invalidExplanation() {
    return this.invalid ? this.invalid.explanation : null;
  }
  /**
   * Equality check
   * Two Durations are equal iff they have the same units and the same values for each unit.
   * @param {Duration} other
   * @return {boolean}
   */
  equals(other) {
    if (!this.isValid || !other.isValid) {
      return false;
    }
    if (!this.loc.equals(other.loc)) {
      return false;
    }
    function eq(v1, v2) {
      if (v1 === void 0 || v1 === 0) return v2 === void 0 || v2 === 0;
      return v1 === v2;
    }
    for (const u2 of orderedUnits$1) {
      if (!eq(this.values[u2], other.values[u2])) {
        return false;
      }
    }
    return true;
  }
}
const INVALID$1 = "Invalid Interval";
function validateStartEnd(start, end) {
  if (!start || !start.isValid) {
    return Interval.invalid("missing or invalid start");
  } else if (!end || !end.isValid) {
    return Interval.invalid("missing or invalid end");
  } else if (end < start) {
    return Interval.invalid(
      "end before start",
      `The end of an interval must be after its start, but you had start=${start.toISO()} and end=${end.toISO()}`
    );
  } else {
    return null;
  }
}
class Interval {
  /**
   * @private
   */
  constructor(config) {
    this.s = config.start;
    this.e = config.end;
    this.invalid = config.invalid || null;
    this.isLuxonInterval = true;
  }
  /**
   * Create an invalid Interval.
   * @param {string} reason - simple string of why this Interval is invalid. Should not contain parameters or anything else data-dependent
   * @param {string} [explanation=null] - longer explanation, may include parameters and other useful debugging information
   * @return {Interval}
   */
  static invalid(reason, explanation = null) {
    if (!reason) {
      throw new InvalidArgumentError("need to specify a reason the Interval is invalid");
    }
    const invalid = reason instanceof Invalid ? reason : new Invalid(reason, explanation);
    if (Settings.throwOnInvalid) {
      throw new InvalidIntervalError(invalid);
    } else {
      return new Interval({ invalid });
    }
  }
  /**
   * Create an Interval from a start DateTime and an end DateTime. Inclusive of the start but not the end.
   * @param {DateTime|Date|Object} start
   * @param {DateTime|Date|Object} end
   * @return {Interval}
   */
  static fromDateTimes(start, end) {
    const builtStart = friendlyDateTime(start), builtEnd = friendlyDateTime(end);
    const validateError = validateStartEnd(builtStart, builtEnd);
    if (validateError == null) {
      return new Interval({
        start: builtStart,
        end: builtEnd
      });
    } else {
      return validateError;
    }
  }
  /**
   * Create an Interval from a start DateTime and a Duration to extend to.
   * @param {DateTime|Date|Object} start
   * @param {Duration|Object|number} duration - the length of the Interval.
   * @return {Interval}
   */
  static after(start, duration) {
    const dur = Duration.fromDurationLike(duration), dt = friendlyDateTime(start);
    return Interval.fromDateTimes(dt, dt.plus(dur));
  }
  /**
   * Create an Interval from an end DateTime and a Duration to extend backwards to.
   * @param {DateTime|Date|Object} end
   * @param {Duration|Object|number} duration - the length of the Interval.
   * @return {Interval}
   */
  static before(end, duration) {
    const dur = Duration.fromDurationLike(duration), dt = friendlyDateTime(end);
    return Interval.fromDateTimes(dt.minus(dur), dt);
  }
  /**
   * Create an Interval from an ISO 8601 string.
   * Accepts `<start>/<end>`, `<start>/<duration>`, and `<duration>/<end>` formats.
   * @param {string} text - the ISO string to parse
   * @param {Object} [opts] - options to pass {@link DateTime#fromISO} and optionally {@link Duration#fromISO}
   * @see https://en.wikipedia.org/wiki/ISO_8601#Time_intervals
   * @return {Interval}
   */
  static fromISO(text, opts) {
    const [s2, e2] = (text || "").split("/", 2);
    if (s2 && e2) {
      let start, startIsValid;
      try {
        start = DateTime.fromISO(s2, opts);
        startIsValid = start.isValid;
      } catch (e3) {
        startIsValid = false;
      }
      let end, endIsValid;
      try {
        end = DateTime.fromISO(e2, opts);
        endIsValid = end.isValid;
      } catch (e3) {
        endIsValid = false;
      }
      if (startIsValid && endIsValid) {
        return Interval.fromDateTimes(start, end);
      }
      if (startIsValid) {
        const dur = Duration.fromISO(e2, opts);
        if (dur.isValid) {
          return Interval.after(start, dur);
        }
      } else if (endIsValid) {
        const dur = Duration.fromISO(s2, opts);
        if (dur.isValid) {
          return Interval.before(end, dur);
        }
      }
    }
    return Interval.invalid("unparsable", `the input "${text}" can't be parsed as ISO 8601`);
  }
  /**
   * Check if an object is an Interval. Works across context boundaries
   * @param {object} o
   * @return {boolean}
   */
  static isInterval(o2) {
    return o2 && o2.isLuxonInterval || false;
  }
  /**
   * Returns the start of the Interval
   * @type {DateTime}
   */
  get start() {
    return this.isValid ? this.s : null;
  }
  /**
   * Returns the end of the Interval
   * @type {DateTime}
   */
  get end() {
    return this.isValid ? this.e : null;
  }
  /**
   * Returns whether this Interval's end is at least its start, meaning that the Interval isn't 'backwards'.
   * @type {boolean}
   */
  get isValid() {
    return this.invalidReason === null;
  }
  /**
   * Returns an error code if this Interval is invalid, or null if the Interval is valid
   * @type {string}
   */
  get invalidReason() {
    return this.invalid ? this.invalid.reason : null;
  }
  /**
   * Returns an explanation of why this Interval became invalid, or null if the Interval is valid
   * @type {string}
   */
  get invalidExplanation() {
    return this.invalid ? this.invalid.explanation : null;
  }
  /**
   * Returns the length of the Interval in the specified unit.
   * @param {string} unit - the unit (such as 'hours' or 'days') to return the length in.
   * @return {number}
   */
  length(unit = "milliseconds") {
    return this.isValid ? this.toDuration(...[unit]).get(unit) : NaN;
  }
  /**
   * Returns the count of minutes, hours, days, months, or years included in the Interval, even in part.
   * Unlike {@link Interval#length} this counts sections of the calendar, not periods of time, e.g. specifying 'day'
   * asks 'what dates are included in this interval?', not 'how many days long is this interval?'
   * @param {string} [unit='milliseconds'] - the unit of time to count.
   * @param {Object} opts - options
   * @param {boolean} [opts.useLocaleWeeks=false] - If true, use weeks based on the locale, i.e. use the locale-dependent start of the week; this operation will always use the locale of the start DateTime
   * @return {number}
   */
  count(unit = "milliseconds", opts) {
    if (!this.isValid) return NaN;
    const start = this.start.startOf(unit, opts);
    let end;
    if (opts == null ? void 0 : opts.useLocaleWeeks) {
      end = this.end.reconfigure({ locale: start.locale });
    } else {
      end = this.end;
    }
    end = end.startOf(unit, opts);
    return Math.floor(end.diff(start, unit).get(unit)) + (end.valueOf() !== this.end.valueOf());
  }
  /**
   * Returns whether this Interval's start and end are both in the same unit of time
   * @param {string} unit - the unit of time to check sameness on
   * @return {boolean}
   */
  hasSame(unit) {
    return this.isValid ? this.isEmpty() || this.e.minus(1).hasSame(this.s, unit) : false;
  }
  /**
   * Return whether this Interval has the same start and end DateTimes.
   * @return {boolean}
   */
  isEmpty() {
    return this.s.valueOf() === this.e.valueOf();
  }
  /**
   * Return whether this Interval's start is after the specified DateTime.
   * @param {DateTime} dateTime
   * @return {boolean}
   */
  isAfter(dateTime) {
    if (!this.isValid) return false;
    return this.s > dateTime;
  }
  /**
   * Return whether this Interval's end is before the specified DateTime.
   * @param {DateTime} dateTime
   * @return {boolean}
   */
  isBefore(dateTime) {
    if (!this.isValid) return false;
    return this.e <= dateTime;
  }
  /**
   * Return whether this Interval contains the specified DateTime.
   * @param {DateTime} dateTime
   * @return {boolean}
   */
  contains(dateTime) {
    if (!this.isValid) return false;
    return this.s <= dateTime && this.e > dateTime;
  }
  /**
   * "Sets" the start and/or end dates. Returns a newly-constructed Interval.
   * @param {Object} values - the values to set
   * @param {DateTime} values.start - the starting DateTime
   * @param {DateTime} values.end - the ending DateTime
   * @return {Interval}
   */
  set({ start, end } = {}) {
    if (!this.isValid) return this;
    return Interval.fromDateTimes(start || this.s, end || this.e);
  }
  /**
   * Split this Interval at each of the specified DateTimes
   * @param {...DateTime} dateTimes - the unit of time to count.
   * @return {Array}
   */
  splitAt(...dateTimes) {
    if (!this.isValid) return [];
    const sorted = dateTimes.map(friendlyDateTime).filter((d2) => this.contains(d2)).sort((a2, b2) => a2.toMillis() - b2.toMillis()), results = [];
    let { s: s2 } = this, i2 = 0;
    while (s2 < this.e) {
      const added = sorted[i2] || this.e, next = +added > +this.e ? this.e : added;
      results.push(Interval.fromDateTimes(s2, next));
      s2 = next;
      i2 += 1;
    }
    return results;
  }
  /**
   * Split this Interval into smaller Intervals, each of the specified length.
   * Left over time is grouped into a smaller interval
   * @param {Duration|Object|number} duration - The length of each resulting interval.
   * @return {Array}
   */
  splitBy(duration) {
    const dur = Duration.fromDurationLike(duration);
    if (!this.isValid || !dur.isValid || dur.as("milliseconds") === 0) {
      return [];
    }
    let { s: s2 } = this, idx = 1, next;
    const results = [];
    while (s2 < this.e) {
      const added = this.start.plus(dur.mapUnits((x2) => x2 * idx));
      next = +added > +this.e ? this.e : added;
      results.push(Interval.fromDateTimes(s2, next));
      s2 = next;
      idx += 1;
    }
    return results;
  }
  /**
   * Split this Interval into the specified number of smaller intervals.
   * @param {number} numberOfParts - The number of Intervals to divide the Interval into.
   * @return {Array}
   */
  divideEqually(numberOfParts) {
    if (!this.isValid) return [];
    return this.splitBy(this.length() / numberOfParts).slice(0, numberOfParts);
  }
  /**
   * Return whether this Interval overlaps with the specified Interval
   * @param {Interval} other
   * @return {boolean}
   */
  overlaps(other) {
    return this.e > other.s && this.s < other.e;
  }
  /**
   * Return whether this Interval's end is adjacent to the specified Interval's start.
   * @param {Interval} other
   * @return {boolean}
   */
  abutsStart(other) {
    if (!this.isValid) return false;
    return +this.e === +other.s;
  }
  /**
   * Return whether this Interval's start is adjacent to the specified Interval's end.
   * @param {Interval} other
   * @return {boolean}
   */
  abutsEnd(other) {
    if (!this.isValid) return false;
    return +other.e === +this.s;
  }
  /**
   * Returns true if this Interval fully contains the specified Interval, specifically if the intersect (of this Interval and the other Interval) is equal to the other Interval; false otherwise.
   * @param {Interval} other
   * @return {boolean}
   */
  engulfs(other) {
    if (!this.isValid) return false;
    return this.s <= other.s && this.e >= other.e;
  }
  /**
   * Return whether this Interval has the same start and end as the specified Interval.
   * @param {Interval} other
   * @return {boolean}
   */
  equals(other) {
    if (!this.isValid || !other.isValid) {
      return false;
    }
    return this.s.equals(other.s) && this.e.equals(other.e);
  }
  /**
   * Return an Interval representing the intersection of this Interval and the specified Interval.
   * Specifically, the resulting Interval has the maximum start time and the minimum end time of the two Intervals.
   * Returns null if the intersection is empty, meaning, the intervals don't intersect.
   * @param {Interval} other
   * @return {Interval}
   */
  intersection(other) {
    if (!this.isValid) return this;
    const s2 = this.s > other.s ? this.s : other.s, e2 = this.e < other.e ? this.e : other.e;
    if (s2 >= e2) {
      return null;
    } else {
      return Interval.fromDateTimes(s2, e2);
    }
  }
  /**
   * Return an Interval representing the union of this Interval and the specified Interval.
   * Specifically, the resulting Interval has the minimum start time and the maximum end time of the two Intervals.
   * @param {Interval} other
   * @return {Interval}
   */
  union(other) {
    if (!this.isValid) return this;
    const s2 = this.s < other.s ? this.s : other.s, e2 = this.e > other.e ? this.e : other.e;
    return Interval.fromDateTimes(s2, e2);
  }
  /**
   * Merge an array of Intervals into a equivalent minimal set of Intervals.
   * Combines overlapping and adjacent Intervals.
   * @param {Array} intervals
   * @return {Array}
   */
  static merge(intervals) {
    const [found, final] = intervals.sort((a2, b2) => a2.s - b2.s).reduce(
      ([sofar, current], item) => {
        if (!current) {
          return [sofar, item];
        } else if (current.overlaps(item) || current.abutsStart(item)) {
          return [sofar, current.union(item)];
        } else {
          return [sofar.concat([current]), item];
        }
      },
      [[], null]
    );
    if (final) {
      found.push(final);
    }
    return found;
  }
  /**
   * Return an array of Intervals representing the spans of time that only appear in one of the specified Intervals.
   * @param {Array} intervals
   * @return {Array}
   */
  static xor(intervals) {
    let start = null, currentCount = 0;
    const results = [], ends = intervals.map((i2) => [
      { time: i2.s, type: "s" },
      { time: i2.e, type: "e" }
    ]), flattened = Array.prototype.concat(...ends), arr = flattened.sort((a2, b2) => a2.time - b2.time);
    for (const i2 of arr) {
      currentCount += i2.type === "s" ? 1 : -1;
      if (currentCount === 1) {
        start = i2.time;
      } else {
        if (start && +start !== +i2.time) {
          results.push(Interval.fromDateTimes(start, i2.time));
        }
        start = null;
      }
    }
    return Interval.merge(results);
  }
  /**
   * Return an Interval representing the span of time in this Interval that doesn't overlap with any of the specified Intervals.
   * @param {...Interval} intervals
   * @return {Array}
   */
  difference(...intervals) {
    return Interval.xor([this].concat(intervals)).map((i2) => this.intersection(i2)).filter((i2) => i2 && !i2.isEmpty());
  }
  /**
   * Returns a string representation of this Interval appropriate for debugging.
   * @return {string}
   */
  toString() {
    if (!this.isValid) return INVALID$1;
    return `[${this.s.toISO()} – ${this.e.toISO()})`;
  }
  /**
   * Returns a string representation of this Interval appropriate for the REPL.
   * @return {string}
   */
  [Symbol.for("nodejs.util.inspect.custom")]() {
    if (this.isValid) {
      return `Interval { start: ${this.s.toISO()}, end: ${this.e.toISO()} }`;
    } else {
      return `Interval { Invalid, reason: ${this.invalidReason} }`;
    }
  }
  /**
   * Returns a localized string representing this Interval. Accepts the same options as the
   * Intl.DateTimeFormat constructor and any presets defined by Luxon, such as
   * {@link DateTime.DATE_FULL} or {@link DateTime.TIME_SIMPLE}. The exact behavior of this method
   * is browser-specific, but in general it will return an appropriate representation of the
   * Interval in the assigned locale. Defaults to the system's locale if no locale has been
   * specified.
   * @see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DateTimeFormat
   * @param {Object} [formatOpts=DateTime.DATE_SHORT] - Either a DateTime preset or
   * Intl.DateTimeFormat constructor options.
   * @param {Object} opts - Options to override the configuration of the start DateTime.
   * @example Interval.fromISO('2022-11-07T09:00Z/2022-11-08T09:00Z').toLocaleString(); //=> 11/7/2022 – 11/8/2022
   * @example Interval.fromISO('2022-11-07T09:00Z/2022-11-08T09:00Z').toLocaleString(DateTime.DATE_FULL); //=> November 7 – 8, 2022
   * @example Interval.fromISO('2022-11-07T09:00Z/2022-11-08T09:00Z').toLocaleString(DateTime.DATE_FULL, { locale: 'fr-FR' }); //=> 7–8 novembre 2022
   * @example Interval.fromISO('2022-11-07T17:00Z/2022-11-07T19:00Z').toLocaleString(DateTime.TIME_SIMPLE); //=> 6:00 – 8:00 PM
   * @example Interval.fromISO('2022-11-07T17:00Z/2022-11-07T19:00Z').toLocaleString({ weekday: 'short', month: 'short', day: '2-digit', hour: '2-digit', minute: '2-digit' }); //=> Mon, Nov 07, 6:00 – 8:00 p
   * @return {string}
   */
  toLocaleString(formatOpts = DATE_SHORT, opts = {}) {
    return this.isValid ? Formatter.create(this.s.loc.clone(opts), formatOpts).formatInterval(this) : INVALID$1;
  }
  /**
   * Returns an ISO 8601-compliant string representation of this Interval.
   * @see https://en.wikipedia.org/wiki/ISO_8601#Time_intervals
   * @param {Object} opts - The same options as {@link DateTime#toISO}
   * @return {string}
   */
  toISO(opts) {
    if (!this.isValid) return INVALID$1;
    return `${this.s.toISO(opts)}/${this.e.toISO(opts)}`;
  }
  /**
   * Returns an ISO 8601-compliant string representation of date of this Interval.
   * The time components are ignored.
   * @see https://en.wikipedia.org/wiki/ISO_8601#Time_intervals
   * @return {string}
   */
  toISODate() {
    if (!this.isValid) return INVALID$1;
    return `${this.s.toISODate()}/${this.e.toISODate()}`;
  }
  /**
   * Returns an ISO 8601-compliant string representation of time of this Interval.
   * The date components are ignored.
   * @see https://en.wikipedia.org/wiki/ISO_8601#Time_intervals
   * @param {Object} opts - The same options as {@link DateTime#toISO}
   * @return {string}
   */
  toISOTime(opts) {
    if (!this.isValid) return INVALID$1;
    return `${this.s.toISOTime(opts)}/${this.e.toISOTime(opts)}`;
  }
  /**
   * Returns a string representation of this Interval formatted according to the specified format
   * string. **You may not want this.** See {@link Interval#toLocaleString} for a more flexible
   * formatting tool.
   * @param {string} dateFormat - The format string. This string formats the start and end time.
   * See {@link DateTime#toFormat} for details.
   * @param {Object} opts - Options.
   * @param {string} [opts.separator =  ' – '] - A separator to place between the start and end
   * representations.
   * @return {string}
   */
  toFormat(dateFormat, { separator = " – " } = {}) {
    if (!this.isValid) return INVALID$1;
    return `${this.s.toFormat(dateFormat)}${separator}${this.e.toFormat(dateFormat)}`;
  }
  /**
   * Return a Duration representing the time spanned by this interval.
   * @param {string|string[]} [unit=['milliseconds']] - the unit or units (such as 'hours' or 'days') to include in the duration.
   * @param {Object} opts - options that affect the creation of the Duration
   * @param {string} [opts.conversionAccuracy='casual'] - the conversion system to use
   * @example Interval.fromDateTimes(dt1, dt2).toDuration().toObject() //=> { milliseconds: 88489257 }
   * @example Interval.fromDateTimes(dt1, dt2).toDuration('days').toObject() //=> { days: 1.0241812152777778 }
   * @example Interval.fromDateTimes(dt1, dt2).toDuration(['hours', 'minutes']).toObject() //=> { hours: 24, minutes: 34.82095 }
   * @example Interval.fromDateTimes(dt1, dt2).toDuration(['hours', 'minutes', 'seconds']).toObject() //=> { hours: 24, minutes: 34, seconds: 49.257 }
   * @example Interval.fromDateTimes(dt1, dt2).toDuration('seconds').toObject() //=> { seconds: 88489.257 }
   * @return {Duration}
   */
  toDuration(unit, opts) {
    if (!this.isValid) {
      return Duration.invalid(this.invalidReason);
    }
    return this.e.diff(this.s, unit, opts);
  }
  /**
   * Run mapFn on the interval start and end, returning a new Interval from the resulting DateTimes
   * @param {function} mapFn
   * @return {Interval}
   * @example Interval.fromDateTimes(dt1, dt2).mapEndpoints(endpoint => endpoint.toUTC())
   * @example Interval.fromDateTimes(dt1, dt2).mapEndpoints(endpoint => endpoint.plus({ hours: 2 }))
   */
  mapEndpoints(mapFn) {
    return Interval.fromDateTimes(mapFn(this.s), mapFn(this.e));
  }
}
class Info {
  /**
   * Return whether the specified zone contains a DST.
   * @param {string|Zone} [zone='local'] - Zone to check. Defaults to the environment's local zone.
   * @return {boolean}
   */
  static hasDST(zone = Settings.defaultZone) {
    const proto = DateTime.now().setZone(zone).set({ month: 12 });
    return !zone.isUniversal && proto.offset !== proto.set({ month: 6 }).offset;
  }
  /**
   * Return whether the specified zone is a valid IANA specifier.
   * @param {string} zone - Zone to check
   * @return {boolean}
   */
  static isValidIANAZone(zone) {
    return IANAZone.isValidZone(zone);
  }
  /**
   * Converts the input into a {@link Zone} instance.
   *
   * * If `input` is already a Zone instance, it is returned unchanged.
   * * If `input` is a string containing a valid time zone name, a Zone instance
   *   with that name is returned.
   * * If `input` is a string that doesn't refer to a known time zone, a Zone
   *   instance with {@link Zone#isValid} == false is returned.
   * * If `input is a number, a Zone instance with the specified fixed offset
   *   in minutes is returned.
   * * If `input` is `null` or `undefined`, the default zone is returned.
   * @param {string|Zone|number} [input] - the value to be converted
   * @return {Zone}
   */
  static normalizeZone(input) {
    return normalizeZone(input, Settings.defaultZone);
  }
  /**
   * Get the weekday on which the week starts according to the given locale.
   * @param {Object} opts - options
   * @param {string} [opts.locale] - the locale code
   * @param {string} [opts.locObj=null] - an existing locale object to use
   * @returns {number} the start of the week, 1 for Monday through 7 for Sunday
   */
  static getStartOfWeek({ locale = null, locObj = null } = {}) {
    return (locObj || Locale.create(locale)).getStartOfWeek();
  }
  /**
   * Get the minimum number of days necessary in a week before it is considered part of the next year according
   * to the given locale.
   * @param {Object} opts - options
   * @param {string} [opts.locale] - the locale code
   * @param {string} [opts.locObj=null] - an existing locale object to use
   * @returns {number}
   */
  static getMinimumDaysInFirstWeek({ locale = null, locObj = null } = {}) {
    return (locObj || Locale.create(locale)).getMinDaysInFirstWeek();
  }
  /**
   * Get the weekdays, which are considered the weekend according to the given locale
   * @param {Object} opts - options
   * @param {string} [opts.locale] - the locale code
   * @param {string} [opts.locObj=null] - an existing locale object to use
   * @returns {number[]} an array of weekdays, 1 for Monday through 7 for Sunday
   */
  static getWeekendWeekdays({ locale = null, locObj = null } = {}) {
    return (locObj || Locale.create(locale)).getWeekendDays().slice();
  }
  /**
   * Return an array of standalone month names.
   * @see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DateTimeFormat
   * @param {string} [length='long'] - the length of the month representation, such as "numeric", "2-digit", "narrow", "short", "long"
   * @param {Object} opts - options
   * @param {string} [opts.locale] - the locale code
   * @param {string} [opts.numberingSystem=null] - the numbering system
   * @param {string} [opts.locObj=null] - an existing locale object to use
   * @param {string} [opts.outputCalendar='gregory'] - the calendar
   * @example Info.months()[0] //=> 'January'
   * @example Info.months('short')[0] //=> 'Jan'
   * @example Info.months('numeric')[0] //=> '1'
   * @example Info.months('short', { locale: 'fr-CA' } )[0] //=> 'janv.'
   * @example Info.months('numeric', { locale: 'ar' })[0] //=> '١'
   * @example Info.months('long', { outputCalendar: 'islamic' })[0] //=> 'Rabiʻ I'
   * @return {Array}
   */
  static months(length = "long", { locale = null, numberingSystem = null, locObj = null, outputCalendar = "gregory" } = {}) {
    return (locObj || Locale.create(locale, numberingSystem, outputCalendar)).months(length);
  }
  /**
   * Return an array of format month names.
   * Format months differ from standalone months in that they're meant to appear next to the day of the month. In some languages, that
   * changes the string.
   * See {@link Info#months}
   * @param {string} [length='long'] - the length of the month representation, such as "numeric", "2-digit", "narrow", "short", "long"
   * @param {Object} opts - options
   * @param {string} [opts.locale] - the locale code
   * @param {string} [opts.numberingSystem=null] - the numbering system
   * @param {string} [opts.locObj=null] - an existing locale object to use
   * @param {string} [opts.outputCalendar='gregory'] - the calendar
   * @return {Array}
   */
  static monthsFormat(length = "long", { locale = null, numberingSystem = null, locObj = null, outputCalendar = "gregory" } = {}) {
    return (locObj || Locale.create(locale, numberingSystem, outputCalendar)).months(length, true);
  }
  /**
   * Return an array of standalone week names.
   * @see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DateTimeFormat
   * @param {string} [length='long'] - the length of the weekday representation, such as "narrow", "short", "long".
   * @param {Object} opts - options
   * @param {string} [opts.locale] - the locale code
   * @param {string} [opts.numberingSystem=null] - the numbering system
   * @param {string} [opts.locObj=null] - an existing locale object to use
   * @example Info.weekdays()[0] //=> 'Monday'
   * @example Info.weekdays('short')[0] //=> 'Mon'
   * @example Info.weekdays('short', { locale: 'fr-CA' })[0] //=> 'lun.'
   * @example Info.weekdays('short', { locale: 'ar' })[0] //=> 'الاثنين'
   * @return {Array}
   */
  static weekdays(length = "long", { locale = null, numberingSystem = null, locObj = null } = {}) {
    return (locObj || Locale.create(locale, numberingSystem, null)).weekdays(length);
  }
  /**
   * Return an array of format week names.
   * Format weekdays differ from standalone weekdays in that they're meant to appear next to more date information. In some languages, that
   * changes the string.
   * See {@link Info#weekdays}
   * @param {string} [length='long'] - the length of the month representation, such as "narrow", "short", "long".
   * @param {Object} opts - options
   * @param {string} [opts.locale=null] - the locale code
   * @param {string} [opts.numberingSystem=null] - the numbering system
   * @param {string} [opts.locObj=null] - an existing locale object to use
   * @return {Array}
   */
  static weekdaysFormat(length = "long", { locale = null, numberingSystem = null, locObj = null } = {}) {
    return (locObj || Locale.create(locale, numberingSystem, null)).weekdays(length, true);
  }
  /**
   * Return an array of meridiems.
   * @param {Object} opts - options
   * @param {string} [opts.locale] - the locale code
   * @example Info.meridiems() //=> [ 'AM', 'PM' ]
   * @example Info.meridiems({ locale: 'my' }) //=> [ 'နံနက်', 'ညနေ' ]
   * @return {Array}
   */
  static meridiems({ locale = null } = {}) {
    return Locale.create(locale).meridiems();
  }
  /**
   * Return an array of eras, such as ['BC', 'AD']. The locale can be specified, but the calendar system is always Gregorian.
   * @param {string} [length='short'] - the length of the era representation, such as "short" or "long".
   * @param {Object} opts - options
   * @param {string} [opts.locale] - the locale code
   * @example Info.eras() //=> [ 'BC', 'AD' ]
   * @example Info.eras('long') //=> [ 'Before Christ', 'Anno Domini' ]
   * @example Info.eras('long', { locale: 'fr' }) //=> [ 'avant Jésus-Christ', 'après Jésus-Christ' ]
   * @return {Array}
   */
  static eras(length = "short", { locale = null } = {}) {
    return Locale.create(locale, null, "gregory").eras(length);
  }
  /**
   * Return the set of available features in this environment.
   * Some features of Luxon are not available in all environments. For example, on older browsers, relative time formatting support is not available. Use this function to figure out if that's the case.
   * Keys:
   * * `relative`: whether this environment supports relative time formatting
   * * `localeWeek`: whether this environment supports different weekdays for the start of the week based on the locale
   * @example Info.features() //=> { relative: false, localeWeek: true }
   * @return {Object}
   */
  static features() {
    return { relative: hasRelative(), localeWeek: hasLocaleWeekInfo() };
  }
}
function dayDiff(earlier, later) {
  const utcDayStart = (dt) => dt.toUTC(0, { keepLocalTime: true }).startOf("day").valueOf(), ms = utcDayStart(later) - utcDayStart(earlier);
  return Math.floor(Duration.fromMillis(ms).as("days"));
}
function highOrderDiffs(cursor, later, units) {
  const differs = [
    ["years", (a2, b2) => b2.year - a2.year],
    ["quarters", (a2, b2) => b2.quarter - a2.quarter + (b2.year - a2.year) * 4],
    ["months", (a2, b2) => b2.month - a2.month + (b2.year - a2.year) * 12],
    [
      "weeks",
      (a2, b2) => {
        const days = dayDiff(a2, b2);
        return (days - days % 7) / 7;
      }
    ],
    ["days", dayDiff]
  ];
  const results = {};
  const earlier = cursor;
  let lowestOrder, highWater;
  for (const [unit, differ] of differs) {
    if (units.indexOf(unit) >= 0) {
      lowestOrder = unit;
      results[unit] = differ(cursor, later);
      highWater = earlier.plus(results);
      if (highWater > later) {
        results[unit]--;
        cursor = earlier.plus(results);
        if (cursor > later) {
          highWater = cursor;
          results[unit]--;
          cursor = earlier.plus(results);
        }
      } else {
        cursor = highWater;
      }
    }
  }
  return [cursor, results, highWater, lowestOrder];
}
function diff(earlier, later, units, opts) {
  let [cursor, results, highWater, lowestOrder] = highOrderDiffs(earlier, later, units);
  const remainingMillis = later - cursor;
  const lowerOrderUnits = units.filter(
    (u2) => ["hours", "minutes", "seconds", "milliseconds"].indexOf(u2) >= 0
  );
  if (lowerOrderUnits.length === 0) {
    if (highWater < later) {
      highWater = cursor.plus({ [lowestOrder]: 1 });
    }
    if (highWater !== cursor) {
      results[lowestOrder] = (results[lowestOrder] || 0) + remainingMillis / (highWater - cursor);
    }
  }
  const duration = Duration.fromObject(results, opts);
  if (lowerOrderUnits.length > 0) {
    return Duration.fromMillis(remainingMillis, opts).shiftTo(...lowerOrderUnits).plus(duration);
  } else {
    return duration;
  }
}
const MISSING_FTP = "missing Intl.DateTimeFormat.formatToParts support";
function intUnit(regex, post = (i2) => i2) {
  return { regex, deser: ([s2]) => post(parseDigits(s2)) };
}
const NBSP = String.fromCharCode(160);
const spaceOrNBSP = `[ ${NBSP}]`;
const spaceOrNBSPRegExp = new RegExp(spaceOrNBSP, "g");
function fixListRegex(s2) {
  return s2.replace(/\./g, "\\.?").replace(spaceOrNBSPRegExp, spaceOrNBSP);
}
function stripInsensitivities(s2) {
  return s2.replace(/\./g, "").replace(spaceOrNBSPRegExp, " ").toLowerCase();
}
function oneOf(strings, startIndex) {
  if (strings === null) {
    return null;
  } else {
    return {
      regex: RegExp(strings.map(fixListRegex).join("|")),
      deser: ([s2]) => strings.findIndex((i2) => stripInsensitivities(s2) === stripInsensitivities(i2)) + startIndex
    };
  }
}
function offset(regex, groups) {
  return { regex, deser: ([, h2, m2]) => signedOffset(h2, m2), groups };
}
function simple(regex) {
  return { regex, deser: ([s2]) => s2 };
}
function escapeToken(value) {
  return value.replace(/[\-\[\]{}()*+?.,\\\^$|#\s]/g, "\\$&");
}
function unitForToken(token, loc) {
  const one = digitRegex(loc), two = digitRegex(loc, "{2}"), three = digitRegex(loc, "{3}"), four = digitRegex(loc, "{4}"), six = digitRegex(loc, "{6}"), oneOrTwo = digitRegex(loc, "{1,2}"), oneToThree = digitRegex(loc, "{1,3}"), oneToSix = digitRegex(loc, "{1,6}"), oneToNine = digitRegex(loc, "{1,9}"), twoToFour = digitRegex(loc, "{2,4}"), fourToSix = digitRegex(loc, "{4,6}"), literal = (t2) => ({ regex: RegExp(escapeToken(t2.val)), deser: ([s2]) => s2, literal: true }), unitate = (t2) => {
    if (token.literal) {
      return literal(t2);
    }
    switch (t2.val) {
      case "G":
        return oneOf(loc.eras("short"), 0);
      case "GG":
        return oneOf(loc.eras("long"), 0);
      case "y":
        return intUnit(oneToSix);
      case "yy":
        return intUnit(twoToFour, untruncateYear);
      case "yyyy":
        return intUnit(four);
      case "yyyyy":
        return intUnit(fourToSix);
      case "yyyyyy":
        return intUnit(six);
      case "M":
        return intUnit(oneOrTwo);
      case "MM":
        return intUnit(two);
      case "MMM":
        return oneOf(loc.months("short", true), 1);
      case "MMMM":
        return oneOf(loc.months("long", true), 1);
      case "L":
        return intUnit(oneOrTwo);
      case "LL":
        return intUnit(two);
      case "LLL":
        return oneOf(loc.months("short", false), 1);
      case "LLLL":
        return oneOf(loc.months("long", false), 1);
      case "d":
        return intUnit(oneOrTwo);
      case "dd":
        return intUnit(two);
      case "o":
        return intUnit(oneToThree);
      case "ooo":
        return intUnit(three);
      case "HH":
        return intUnit(two);
      case "H":
        return intUnit(oneOrTwo);
      case "hh":
        return intUnit(two);
      case "h":
        return intUnit(oneOrTwo);
      case "mm":
        return intUnit(two);
      case "m":
        return intUnit(oneOrTwo);
      case "q":
        return intUnit(oneOrTwo);
      case "qq":
        return intUnit(two);
      case "s":
        return intUnit(oneOrTwo);
      case "ss":
        return intUnit(two);
      case "S":
        return intUnit(oneToThree);
      case "SSS":
        return intUnit(three);
      case "u":
        return simple(oneToNine);
      case "uu":
        return simple(oneOrTwo);
      case "uuu":
        return intUnit(one);
      case "a":
        return oneOf(loc.meridiems(), 0);
      case "kkkk":
        return intUnit(four);
      case "kk":
        return intUnit(twoToFour, untruncateYear);
      case "W":
        return intUnit(oneOrTwo);
      case "WW":
        return intUnit(two);
      case "E":
      case "c":
        return intUnit(one);
      case "EEE":
        return oneOf(loc.weekdays("short", false), 1);
      case "EEEE":
        return oneOf(loc.weekdays("long", false), 1);
      case "ccc":
        return oneOf(loc.weekdays("short", true), 1);
      case "cccc":
        return oneOf(loc.weekdays("long", true), 1);
      case "Z":
      case "ZZ":
        return offset(new RegExp(`([+-]${oneOrTwo.source})(?::(${two.source}))?`), 2);
      case "ZZZ":
        return offset(new RegExp(`([+-]${oneOrTwo.source})(${two.source})?`), 2);
      case "z":
        return simple(/[a-z_+-/]{1,256}?/i);
      case " ":
        return simple(/[^\S\n\r]/);
      default:
        return literal(t2);
    }
  };
  const unit = unitate(token) || {
    invalidReason: MISSING_FTP
  };
  unit.token = token;
  return unit;
}
const partTypeStyleToTokenVal = {
  year: {
    "2-digit": "yy",
    numeric: "yyyyy"
  },
  month: {
    numeric: "M",
    "2-digit": "MM",
    short: "MMM",
    long: "MMMM"
  },
  day: {
    numeric: "d",
    "2-digit": "dd"
  },
  weekday: {
    short: "EEE",
    long: "EEEE"
  },
  dayperiod: "a",
  dayPeriod: "a",
  hour12: {
    numeric: "h",
    "2-digit": "hh"
  },
  hour24: {
    numeric: "H",
    "2-digit": "HH"
  },
  minute: {
    numeric: "m",
    "2-digit": "mm"
  },
  second: {
    numeric: "s",
    "2-digit": "ss"
  },
  timeZoneName: {
    long: "ZZZZZ",
    short: "ZZZ"
  }
};
function tokenForPart(part, formatOpts, resolvedOpts) {
  const { type, value } = part;
  if (type === "literal") {
    const isSpace = /^\s+$/.test(value);
    return {
      literal: !isSpace,
      val: isSpace ? " " : value
    };
  }
  const style = formatOpts[type];
  let actualType = type;
  if (type === "hour") {
    if (formatOpts.hour12 != null) {
      actualType = formatOpts.hour12 ? "hour12" : "hour24";
    } else if (formatOpts.hourCycle != null) {
      if (formatOpts.hourCycle === "h11" || formatOpts.hourCycle === "h12") {
        actualType = "hour12";
      } else {
        actualType = "hour24";
      }
    } else {
      actualType = resolvedOpts.hour12 ? "hour12" : "hour24";
    }
  }
  let val = partTypeStyleToTokenVal[actualType];
  if (typeof val === "object") {
    val = val[style];
  }
  if (val) {
    return {
      literal: false,
      val
    };
  }
  return void 0;
}
function buildRegex(units) {
  const re = units.map((u2) => u2.regex).reduce((f2, r2) => `${f2}(${r2.source})`, "");
  return [`^${re}$`, units];
}
function match(input, regex, handlers) {
  const matches = input.match(regex);
  if (matches) {
    const all = {};
    let matchIndex = 1;
    for (const i2 in handlers) {
      if (hasOwnProperty(handlers, i2)) {
        const h2 = handlers[i2], groups = h2.groups ? h2.groups + 1 : 1;
        if (!h2.literal && h2.token) {
          all[h2.token.val[0]] = h2.deser(matches.slice(matchIndex, matchIndex + groups));
        }
        matchIndex += groups;
      }
    }
    return [matches, all];
  } else {
    return [matches, {}];
  }
}
function dateTimeFromMatches(matches) {
  const toField = (token) => {
    switch (token) {
      case "S":
        return "millisecond";
      case "s":
        return "second";
      case "m":
        return "minute";
      case "h":
      case "H":
        return "hour";
      case "d":
        return "day";
      case "o":
        return "ordinal";
      case "L":
      case "M":
        return "month";
      case "y":
        return "year";
      case "E":
      case "c":
        return "weekday";
      case "W":
        return "weekNumber";
      case "k":
        return "weekYear";
      case "q":
        return "quarter";
      default:
        return null;
    }
  };
  let zone = null;
  let specificOffset;
  if (!isUndefined(matches.z)) {
    zone = IANAZone.create(matches.z);
  }
  if (!isUndefined(matches.Z)) {
    if (!zone) {
      zone = new FixedOffsetZone(matches.Z);
    }
    specificOffset = matches.Z;
  }
  if (!isUndefined(matches.q)) {
    matches.M = (matches.q - 1) * 3 + 1;
  }
  if (!isUndefined(matches.h)) {
    if (matches.h < 12 && matches.a === 1) {
      matches.h += 12;
    } else if (matches.h === 12 && matches.a === 0) {
      matches.h = 0;
    }
  }
  if (matches.G === 0 && matches.y) {
    matches.y = -matches.y;
  }
  if (!isUndefined(matches.u)) {
    matches.S = parseMillis(matches.u);
  }
  const vals = Object.keys(matches).reduce((r2, k2) => {
    const f2 = toField(k2);
    if (f2) {
      r2[f2] = matches[k2];
    }
    return r2;
  }, {});
  return [vals, zone, specificOffset];
}
let dummyDateTimeCache = null;
function getDummyDateTime() {
  if (!dummyDateTimeCache) {
    dummyDateTimeCache = DateTime.fromMillis(1555555555555);
  }
  return dummyDateTimeCache;
}
function maybeExpandMacroToken(token, locale) {
  if (token.literal) {
    return token;
  }
  const formatOpts = Formatter.macroTokenToFormatOpts(token.val);
  const tokens = formatOptsToTokens(formatOpts, locale);
  if (tokens == null || tokens.includes(void 0)) {
    return token;
  }
  return tokens;
}
function expandMacroTokens(tokens, locale) {
  return Array.prototype.concat(...tokens.map((t2) => maybeExpandMacroToken(t2, locale)));
}
class TokenParser {
  constructor(locale, format) {
    this.locale = locale;
    this.format = format;
    this.tokens = expandMacroTokens(Formatter.parseFormat(format), locale);
    this.units = this.tokens.map((t2) => unitForToken(t2, locale));
    this.disqualifyingUnit = this.units.find((t2) => t2.invalidReason);
    if (!this.disqualifyingUnit) {
      const [regexString, handlers] = buildRegex(this.units);
      this.regex = RegExp(regexString, "i");
      this.handlers = handlers;
    }
  }
  explainFromTokens(input) {
    if (!this.isValid) {
      return { input, tokens: this.tokens, invalidReason: this.invalidReason };
    } else {
      const [rawMatches, matches] = match(input, this.regex, this.handlers), [result, zone, specificOffset] = matches ? dateTimeFromMatches(matches) : [null, null, void 0];
      if (hasOwnProperty(matches, "a") && hasOwnProperty(matches, "H")) {
        throw new ConflictingSpecificationError(
          "Can't include meridiem when specifying 24-hour format"
        );
      }
      return {
        input,
        tokens: this.tokens,
        regex: this.regex,
        rawMatches,
        matches,
        result,
        zone,
        specificOffset
      };
    }
  }
  get isValid() {
    return !this.disqualifyingUnit;
  }
  get invalidReason() {
    return this.disqualifyingUnit ? this.disqualifyingUnit.invalidReason : null;
  }
}
function explainFromTokens(locale, input, format) {
  const parser = new TokenParser(locale, format);
  return parser.explainFromTokens(input);
}
function parseFromTokens(locale, input, format) {
  const { result, zone, specificOffset, invalidReason } = explainFromTokens(locale, input, format);
  return [result, zone, specificOffset, invalidReason];
}
function formatOptsToTokens(formatOpts, locale) {
  if (!formatOpts) {
    return null;
  }
  const formatter = Formatter.create(locale, formatOpts);
  const df = formatter.dtFormatter(getDummyDateTime());
  const parts = df.formatToParts();
  const resolvedOpts = df.resolvedOptions();
  return parts.map((p2) => tokenForPart(p2, formatOpts, resolvedOpts));
}
const INVALID = "Invalid DateTime";
const MAX_DATE = 864e13;
function unsupportedZone(zone) {
  return new Invalid("unsupported zone", `the zone "${zone.name}" is not supported`);
}
function possiblyCachedWeekData(dt) {
  if (dt.weekData === null) {
    dt.weekData = gregorianToWeek(dt.c);
  }
  return dt.weekData;
}
function possiblyCachedLocalWeekData(dt) {
  if (dt.localWeekData === null) {
    dt.localWeekData = gregorianToWeek(
      dt.c,
      dt.loc.getMinDaysInFirstWeek(),
      dt.loc.getStartOfWeek()
    );
  }
  return dt.localWeekData;
}
function clone(inst, alts) {
  const current = {
    ts: inst.ts,
    zone: inst.zone,
    c: inst.c,
    o: inst.o,
    loc: inst.loc,
    invalid: inst.invalid
  };
  return new DateTime({ ...current, ...alts, old: current });
}
function fixOffset(localTS, o2, tz) {
  let utcGuess = localTS - o2 * 60 * 1e3;
  const o22 = tz.offset(utcGuess);
  if (o2 === o22) {
    return [utcGuess, o2];
  }
  utcGuess -= (o22 - o2) * 60 * 1e3;
  const o3 = tz.offset(utcGuess);
  if (o22 === o3) {
    return [utcGuess, o22];
  }
  return [localTS - Math.min(o22, o3) * 60 * 1e3, Math.max(o22, o3)];
}
function tsToObj(ts, offset2) {
  ts += offset2 * 60 * 1e3;
  const d2 = new Date(ts);
  return {
    year: d2.getUTCFullYear(),
    month: d2.getUTCMonth() + 1,
    day: d2.getUTCDate(),
    hour: d2.getUTCHours(),
    minute: d2.getUTCMinutes(),
    second: d2.getUTCSeconds(),
    millisecond: d2.getUTCMilliseconds()
  };
}
function objToTS(obj, offset2, zone) {
  return fixOffset(objToLocalTS(obj), offset2, zone);
}
function adjustTime(inst, dur) {
  const oPre = inst.o, year = inst.c.year + Math.trunc(dur.years), month = inst.c.month + Math.trunc(dur.months) + Math.trunc(dur.quarters) * 3, c2 = {
    ...inst.c,
    year,
    month,
    day: Math.min(inst.c.day, daysInMonth(year, month)) + Math.trunc(dur.days) + Math.trunc(dur.weeks) * 7
  }, millisToAdd = Duration.fromObject({
    years: dur.years - Math.trunc(dur.years),
    quarters: dur.quarters - Math.trunc(dur.quarters),
    months: dur.months - Math.trunc(dur.months),
    weeks: dur.weeks - Math.trunc(dur.weeks),
    days: dur.days - Math.trunc(dur.days),
    hours: dur.hours,
    minutes: dur.minutes,
    seconds: dur.seconds,
    milliseconds: dur.milliseconds
  }).as("milliseconds"), localTS = objToLocalTS(c2);
  let [ts, o2] = fixOffset(localTS, oPre, inst.zone);
  if (millisToAdd !== 0) {
    ts += millisToAdd;
    o2 = inst.zone.offset(ts);
  }
  return { ts, o: o2 };
}
function parseDataToDateTime(parsed, parsedZone, opts, format, text, specificOffset) {
  const { setZone, zone } = opts;
  if (parsed && Object.keys(parsed).length !== 0 || parsedZone) {
    const interpretationZone = parsedZone || zone, inst = DateTime.fromObject(parsed, {
      ...opts,
      zone: interpretationZone,
      specificOffset
    });
    return setZone ? inst : inst.setZone(zone);
  } else {
    return DateTime.invalid(
      new Invalid("unparsable", `the input "${text}" can't be parsed as ${format}`)
    );
  }
}
function toTechFormat(dt, format, allowZ = true) {
  return dt.isValid ? Formatter.create(Locale.create("en-US"), {
    allowZ,
    forceSimple: true
  }).formatDateTimeFromString(dt, format) : null;
}
function toISODate(o2, extended) {
  const longFormat = o2.c.year > 9999 || o2.c.year < 0;
  let c2 = "";
  if (longFormat && o2.c.year >= 0) c2 += "+";
  c2 += padStart(o2.c.year, longFormat ? 6 : 4);
  if (extended) {
    c2 += "-";
    c2 += padStart(o2.c.month);
    c2 += "-";
    c2 += padStart(o2.c.day);
  } else {
    c2 += padStart(o2.c.month);
    c2 += padStart(o2.c.day);
  }
  return c2;
}
function toISOTime(o2, extended, suppressSeconds, suppressMilliseconds, includeOffset, extendedZone) {
  let c2 = padStart(o2.c.hour);
  if (extended) {
    c2 += ":";
    c2 += padStart(o2.c.minute);
    if (o2.c.millisecond !== 0 || o2.c.second !== 0 || !suppressSeconds) {
      c2 += ":";
    }
  } else {
    c2 += padStart(o2.c.minute);
  }
  if (o2.c.millisecond !== 0 || o2.c.second !== 0 || !suppressSeconds) {
    c2 += padStart(o2.c.second);
    if (o2.c.millisecond !== 0 || !suppressMilliseconds) {
      c2 += ".";
      c2 += padStart(o2.c.millisecond, 3);
    }
  }
  if (includeOffset) {
    if (o2.isOffsetFixed && o2.offset === 0 && !extendedZone) {
      c2 += "Z";
    } else if (o2.o < 0) {
      c2 += "-";
      c2 += padStart(Math.trunc(-o2.o / 60));
      c2 += ":";
      c2 += padStart(Math.trunc(-o2.o % 60));
    } else {
      c2 += "+";
      c2 += padStart(Math.trunc(o2.o / 60));
      c2 += ":";
      c2 += padStart(Math.trunc(o2.o % 60));
    }
  }
  if (extendedZone) {
    c2 += "[" + o2.zone.ianaName + "]";
  }
  return c2;
}
const defaultUnitValues = {
  month: 1,
  day: 1,
  hour: 0,
  minute: 0,
  second: 0,
  millisecond: 0
}, defaultWeekUnitValues = {
  weekNumber: 1,
  weekday: 1,
  hour: 0,
  minute: 0,
  second: 0,
  millisecond: 0
}, defaultOrdinalUnitValues = {
  ordinal: 1,
  hour: 0,
  minute: 0,
  second: 0,
  millisecond: 0
};
const orderedUnits = ["year", "month", "day", "hour", "minute", "second", "millisecond"], orderedWeekUnits = [
  "weekYear",
  "weekNumber",
  "weekday",
  "hour",
  "minute",
  "second",
  "millisecond"
], orderedOrdinalUnits = ["year", "ordinal", "hour", "minute", "second", "millisecond"];
function normalizeUnit(unit) {
  const normalized = {
    year: "year",
    years: "year",
    month: "month",
    months: "month",
    day: "day",
    days: "day",
    hour: "hour",
    hours: "hour",
    minute: "minute",
    minutes: "minute",
    quarter: "quarter",
    quarters: "quarter",
    second: "second",
    seconds: "second",
    millisecond: "millisecond",
    milliseconds: "millisecond",
    weekday: "weekday",
    weekdays: "weekday",
    weeknumber: "weekNumber",
    weeksnumber: "weekNumber",
    weeknumbers: "weekNumber",
    weekyear: "weekYear",
    weekyears: "weekYear",
    ordinal: "ordinal"
  }[unit.toLowerCase()];
  if (!normalized) throw new InvalidUnitError(unit);
  return normalized;
}
function normalizeUnitWithLocalWeeks(unit) {
  switch (unit.toLowerCase()) {
    case "localweekday":
    case "localweekdays":
      return "localWeekday";
    case "localweeknumber":
    case "localweeknumbers":
      return "localWeekNumber";
    case "localweekyear":
    case "localweekyears":
      return "localWeekYear";
    default:
      return normalizeUnit(unit);
  }
}
function guessOffsetForZone(zone) {
  if (!zoneOffsetGuessCache[zone]) {
    if (zoneOffsetTs === void 0) {
      zoneOffsetTs = Settings.now();
    }
    zoneOffsetGuessCache[zone] = zone.offset(zoneOffsetTs);
  }
  return zoneOffsetGuessCache[zone];
}
function quickDT(obj, opts) {
  const zone = normalizeZone(opts.zone, Settings.defaultZone);
  if (!zone.isValid) {
    return DateTime.invalid(unsupportedZone(zone));
  }
  const loc = Locale.fromObject(opts);
  let ts, o2;
  if (!isUndefined(obj.year)) {
    for (const u2 of orderedUnits) {
      if (isUndefined(obj[u2])) {
        obj[u2] = defaultUnitValues[u2];
      }
    }
    const invalid = hasInvalidGregorianData(obj) || hasInvalidTimeData(obj);
    if (invalid) {
      return DateTime.invalid(invalid);
    }
    const offsetProvis = guessOffsetForZone(zone);
    [ts, o2] = objToTS(obj, offsetProvis, zone);
  } else {
    ts = Settings.now();
  }
  return new DateTime({ ts, zone, loc, o: o2 });
}
function diffRelative(start, end, opts) {
  const round = isUndefined(opts.round) ? true : opts.round, format = (c2, unit) => {
    c2 = roundTo(c2, round || opts.calendary ? 0 : 2, true);
    const formatter = end.loc.clone(opts).relFormatter(opts);
    return formatter.format(c2, unit);
  }, differ = (unit) => {
    if (opts.calendary) {
      if (!end.hasSame(start, unit)) {
        return end.startOf(unit).diff(start.startOf(unit), unit).get(unit);
      } else return 0;
    } else {
      return end.diff(start, unit).get(unit);
    }
  };
  if (opts.unit) {
    return format(differ(opts.unit), opts.unit);
  }
  for (const unit of opts.units) {
    const count = differ(unit);
    if (Math.abs(count) >= 1) {
      return format(count, unit);
    }
  }
  return format(start > end ? -0 : 0, opts.units[opts.units.length - 1]);
}
function lastOpts(argList) {
  let opts = {}, args;
  if (argList.length > 0 && typeof argList[argList.length - 1] === "object") {
    opts = argList[argList.length - 1];
    args = Array.from(argList).slice(0, argList.length - 1);
  } else {
    args = Array.from(argList);
  }
  return [opts, args];
}
let zoneOffsetTs;
let zoneOffsetGuessCache = {};
class DateTime {
  /**
   * @access private
   */
  constructor(config) {
    const zone = config.zone || Settings.defaultZone;
    let invalid = config.invalid || (Number.isNaN(config.ts) ? new Invalid("invalid input") : null) || (!zone.isValid ? unsupportedZone(zone) : null);
    this.ts = isUndefined(config.ts) ? Settings.now() : config.ts;
    let c2 = null, o2 = null;
    if (!invalid) {
      const unchanged = config.old && config.old.ts === this.ts && config.old.zone.equals(zone);
      if (unchanged) {
        [c2, o2] = [config.old.c, config.old.o];
      } else {
        const ot = isNumber(config.o) && !config.old ? config.o : zone.offset(this.ts);
        c2 = tsToObj(this.ts, ot);
        invalid = Number.isNaN(c2.year) ? new Invalid("invalid input") : null;
        c2 = invalid ? null : c2;
        o2 = invalid ? null : ot;
      }
    }
    this._zone = zone;
    this.loc = config.loc || Locale.create();
    this.invalid = invalid;
    this.weekData = null;
    this.localWeekData = null;
    this.c = c2;
    this.o = o2;
    this.isLuxonDateTime = true;
  }
  // CONSTRUCT
  /**
   * Create a DateTime for the current instant, in the system's time zone.
   *
   * Use Settings to override these default values if needed.
   * @example DateTime.now().toISO() //~> now in the ISO format
   * @return {DateTime}
   */
  static now() {
    return new DateTime({});
  }
  /**
   * Create a local DateTime
   * @param {number} [year] - The calendar year. If omitted (as in, call `local()` with no arguments), the current time will be used
   * @param {number} [month=1] - The month, 1-indexed
   * @param {number} [day=1] - The day of the month, 1-indexed
   * @param {number} [hour=0] - The hour of the day, in 24-hour time
   * @param {number} [minute=0] - The minute of the hour, meaning a number between 0 and 59
   * @param {number} [second=0] - The second of the minute, meaning a number between 0 and 59
   * @param {number} [millisecond=0] - The millisecond of the second, meaning a number between 0 and 999
   * @example DateTime.local()                                  //~> now
   * @example DateTime.local({ zone: "America/New_York" })      //~> now, in US east coast time
   * @example DateTime.local(2017)                              //~> 2017-01-01T00:00:00
   * @example DateTime.local(2017, 3)                           //~> 2017-03-01T00:00:00
   * @example DateTime.local(2017, 3, 12, { locale: "fr" })     //~> 2017-03-12T00:00:00, with a French locale
   * @example DateTime.local(2017, 3, 12, 5)                    //~> 2017-03-12T05:00:00
   * @example DateTime.local(2017, 3, 12, 5, { zone: "utc" })   //~> 2017-03-12T05:00:00, in UTC
   * @example DateTime.local(2017, 3, 12, 5, 45)                //~> 2017-03-12T05:45:00
   * @example DateTime.local(2017, 3, 12, 5, 45, 10)            //~> 2017-03-12T05:45:10
   * @example DateTime.local(2017, 3, 12, 5, 45, 10, 765)       //~> 2017-03-12T05:45:10.765
   * @return {DateTime}
   */
  static local() {
    const [opts, args] = lastOpts(arguments), [year, month, day, hour, minute, second, millisecond] = args;
    return quickDT({ year, month, day, hour, minute, second, millisecond }, opts);
  }
  /**
   * Create a DateTime in UTC
   * @param {number} [year] - The calendar year. If omitted (as in, call `utc()` with no arguments), the current time will be used
   * @param {number} [month=1] - The month, 1-indexed
   * @param {number} [day=1] - The day of the month
   * @param {number} [hour=0] - The hour of the day, in 24-hour time
   * @param {number} [minute=0] - The minute of the hour, meaning a number between 0 and 59
   * @param {number} [second=0] - The second of the minute, meaning a number between 0 and 59
   * @param {number} [millisecond=0] - The millisecond of the second, meaning a number between 0 and 999
   * @param {Object} options - configuration options for the DateTime
   * @param {string} [options.locale] - a locale to set on the resulting DateTime instance
   * @param {string} [options.outputCalendar] - the output calendar to set on the resulting DateTime instance
   * @param {string} [options.numberingSystem] - the numbering system to set on the resulting DateTime instance
   * @param {string} [options.weekSettings] - the week settings to set on the resulting DateTime instance
   * @example DateTime.utc()                                              //~> now
   * @example DateTime.utc(2017)                                          //~> 2017-01-01T00:00:00Z
   * @example DateTime.utc(2017, 3)                                       //~> 2017-03-01T00:00:00Z
   * @example DateTime.utc(2017, 3, 12)                                   //~> 2017-03-12T00:00:00Z
   * @example DateTime.utc(2017, 3, 12, 5)                                //~> 2017-03-12T05:00:00Z
   * @example DateTime.utc(2017, 3, 12, 5, 45)                            //~> 2017-03-12T05:45:00Z
   * @example DateTime.utc(2017, 3, 12, 5, 45, { locale: "fr" })          //~> 2017-03-12T05:45:00Z with a French locale
   * @example DateTime.utc(2017, 3, 12, 5, 45, 10)                        //~> 2017-03-12T05:45:10Z
   * @example DateTime.utc(2017, 3, 12, 5, 45, 10, 765, { locale: "fr" }) //~> 2017-03-12T05:45:10.765Z with a French locale
   * @return {DateTime}
   */
  static utc() {
    const [opts, args] = lastOpts(arguments), [year, month, day, hour, minute, second, millisecond] = args;
    opts.zone = FixedOffsetZone.utcInstance;
    return quickDT({ year, month, day, hour, minute, second, millisecond }, opts);
  }
  /**
   * Create a DateTime from a JavaScript Date object. Uses the default zone.
   * @param {Date} date - a JavaScript Date object
   * @param {Object} options - configuration options for the DateTime
   * @param {string|Zone} [options.zone='local'] - the zone to place the DateTime into
   * @return {DateTime}
   */
  static fromJSDate(date, options = {}) {
    const ts = isDate(date) ? date.valueOf() : NaN;
    if (Number.isNaN(ts)) {
      return DateTime.invalid("invalid input");
    }
    const zoneToUse = normalizeZone(options.zone, Settings.defaultZone);
    if (!zoneToUse.isValid) {
      return DateTime.invalid(unsupportedZone(zoneToUse));
    }
    return new DateTime({
      ts,
      zone: zoneToUse,
      loc: Locale.fromObject(options)
    });
  }
  /**
   * Create a DateTime from a number of milliseconds since the epoch (meaning since 1 January 1970 00:00:00 UTC). Uses the default zone.
   * @param {number} milliseconds - a number of milliseconds since 1970 UTC
   * @param {Object} options - configuration options for the DateTime
   * @param {string|Zone} [options.zone='local'] - the zone to place the DateTime into
   * @param {string} [options.locale] - a locale to set on the resulting DateTime instance
   * @param {string} options.outputCalendar - the output calendar to set on the resulting DateTime instance
   * @param {string} options.numberingSystem - the numbering system to set on the resulting DateTime instance
   * @param {string} options.weekSettings - the week settings to set on the resulting DateTime instance
   * @return {DateTime}
   */
  static fromMillis(milliseconds, options = {}) {
    if (!isNumber(milliseconds)) {
      throw new InvalidArgumentError(
        `fromMillis requires a numerical input, but received a ${typeof milliseconds} with value ${milliseconds}`
      );
    } else if (milliseconds < -MAX_DATE || milliseconds > MAX_DATE) {
      return DateTime.invalid("Timestamp out of range");
    } else {
      return new DateTime({
        ts: milliseconds,
        zone: normalizeZone(options.zone, Settings.defaultZone),
        loc: Locale.fromObject(options)
      });
    }
  }
  /**
   * Create a DateTime from a number of seconds since the epoch (meaning since 1 January 1970 00:00:00 UTC). Uses the default zone.
   * @param {number} seconds - a number of seconds since 1970 UTC
   * @param {Object} options - configuration options for the DateTime
   * @param {string|Zone} [options.zone='local'] - the zone to place the DateTime into
   * @param {string} [options.locale] - a locale to set on the resulting DateTime instance
   * @param {string} options.outputCalendar - the output calendar to set on the resulting DateTime instance
   * @param {string} options.numberingSystem - the numbering system to set on the resulting DateTime instance
   * @param {string} options.weekSettings - the week settings to set on the resulting DateTime instance
   * @return {DateTime}
   */
  static fromSeconds(seconds, options = {}) {
    if (!isNumber(seconds)) {
      throw new InvalidArgumentError("fromSeconds requires a numerical input");
    } else {
      return new DateTime({
        ts: seconds * 1e3,
        zone: normalizeZone(options.zone, Settings.defaultZone),
        loc: Locale.fromObject(options)
      });
    }
  }
  /**
   * Create a DateTime from a JavaScript object with keys like 'year' and 'hour' with reasonable defaults.
   * @param {Object} obj - the object to create the DateTime from
   * @param {number} obj.year - a year, such as 1987
   * @param {number} obj.month - a month, 1-12
   * @param {number} obj.day - a day of the month, 1-31, depending on the month
   * @param {number} obj.ordinal - day of the year, 1-365 or 366
   * @param {number} obj.weekYear - an ISO week year
   * @param {number} obj.weekNumber - an ISO week number, between 1 and 52 or 53, depending on the year
   * @param {number} obj.weekday - an ISO weekday, 1-7, where 1 is Monday and 7 is Sunday
   * @param {number} obj.localWeekYear - a week year, according to the locale
   * @param {number} obj.localWeekNumber - a week number, between 1 and 52 or 53, depending on the year, according to the locale
   * @param {number} obj.localWeekday - a weekday, 1-7, where 1 is the first and 7 is the last day of the week, according to the locale
   * @param {number} obj.hour - hour of the day, 0-23
   * @param {number} obj.minute - minute of the hour, 0-59
   * @param {number} obj.second - second of the minute, 0-59
   * @param {number} obj.millisecond - millisecond of the second, 0-999
   * @param {Object} opts - options for creating this DateTime
   * @param {string|Zone} [opts.zone='local'] - interpret the numbers in the context of a particular zone. Can take any value taken as the first argument to setZone()
   * @param {string} [opts.locale='system\'s locale'] - a locale to set on the resulting DateTime instance
   * @param {string} opts.outputCalendar - the output calendar to set on the resulting DateTime instance
   * @param {string} opts.numberingSystem - the numbering system to set on the resulting DateTime instance
   * @param {string} opts.weekSettings - the week settings to set on the resulting DateTime instance
   * @example DateTime.fromObject({ year: 1982, month: 5, day: 25}).toISODate() //=> '1982-05-25'
   * @example DateTime.fromObject({ year: 1982 }).toISODate() //=> '1982-01-01'
   * @example DateTime.fromObject({ hour: 10, minute: 26, second: 6 }) //~> today at 10:26:06
   * @example DateTime.fromObject({ hour: 10, minute: 26, second: 6 }, { zone: 'utc' }),
   * @example DateTime.fromObject({ hour: 10, minute: 26, second: 6 }, { zone: 'local' })
   * @example DateTime.fromObject({ hour: 10, minute: 26, second: 6 }, { zone: 'America/New_York' })
   * @example DateTime.fromObject({ weekYear: 2016, weekNumber: 2, weekday: 3 }).toISODate() //=> '2016-01-13'
   * @example DateTime.fromObject({ localWeekYear: 2022, localWeekNumber: 1, localWeekday: 1 }, { locale: "en-US" }).toISODate() //=> '2021-12-26'
   * @return {DateTime}
   */
  static fromObject(obj, opts = {}) {
    obj = obj || {};
    const zoneToUse = normalizeZone(opts.zone, Settings.defaultZone);
    if (!zoneToUse.isValid) {
      return DateTime.invalid(unsupportedZone(zoneToUse));
    }
    const loc = Locale.fromObject(opts);
    const normalized = normalizeObject(obj, normalizeUnitWithLocalWeeks);
    const { minDaysInFirstWeek, startOfWeek } = usesLocalWeekValues(normalized, loc);
    const tsNow = Settings.now(), offsetProvis = !isUndefined(opts.specificOffset) ? opts.specificOffset : zoneToUse.offset(tsNow), containsOrdinal = !isUndefined(normalized.ordinal), containsGregorYear = !isUndefined(normalized.year), containsGregorMD = !isUndefined(normalized.month) || !isUndefined(normalized.day), containsGregor = containsGregorYear || containsGregorMD, definiteWeekDef = normalized.weekYear || normalized.weekNumber;
    if ((containsGregor || containsOrdinal) && definiteWeekDef) {
      throw new ConflictingSpecificationError(
        "Can't mix weekYear/weekNumber units with year/month/day or ordinals"
      );
    }
    if (containsGregorMD && containsOrdinal) {
      throw new ConflictingSpecificationError("Can't mix ordinal dates with month/day");
    }
    const useWeekData = definiteWeekDef || normalized.weekday && !containsGregor;
    let units, defaultValues, objNow = tsToObj(tsNow, offsetProvis);
    if (useWeekData) {
      units = orderedWeekUnits;
      defaultValues = defaultWeekUnitValues;
      objNow = gregorianToWeek(objNow, minDaysInFirstWeek, startOfWeek);
    } else if (containsOrdinal) {
      units = orderedOrdinalUnits;
      defaultValues = defaultOrdinalUnitValues;
      objNow = gregorianToOrdinal(objNow);
    } else {
      units = orderedUnits;
      defaultValues = defaultUnitValues;
    }
    let foundFirst = false;
    for (const u2 of units) {
      const v2 = normalized[u2];
      if (!isUndefined(v2)) {
        foundFirst = true;
      } else if (foundFirst) {
        normalized[u2] = defaultValues[u2];
      } else {
        normalized[u2] = objNow[u2];
      }
    }
    const higherOrderInvalid = useWeekData ? hasInvalidWeekData(normalized, minDaysInFirstWeek, startOfWeek) : containsOrdinal ? hasInvalidOrdinalData(normalized) : hasInvalidGregorianData(normalized), invalid = higherOrderInvalid || hasInvalidTimeData(normalized);
    if (invalid) {
      return DateTime.invalid(invalid);
    }
    const gregorian = useWeekData ? weekToGregorian(normalized, minDaysInFirstWeek, startOfWeek) : containsOrdinal ? ordinalToGregorian(normalized) : normalized, [tsFinal, offsetFinal] = objToTS(gregorian, offsetProvis, zoneToUse), inst = new DateTime({
      ts: tsFinal,
      zone: zoneToUse,
      o: offsetFinal,
      loc
    });
    if (normalized.weekday && containsGregor && obj.weekday !== inst.weekday) {
      return DateTime.invalid(
        "mismatched weekday",
        `you can't specify both a weekday of ${normalized.weekday} and a date of ${inst.toISO()}`
      );
    }
    if (!inst.isValid) {
      return DateTime.invalid(inst.invalid);
    }
    return inst;
  }
  /**
   * Create a DateTime from an ISO 8601 string
   * @param {string} text - the ISO string
   * @param {Object} opts - options to affect the creation
   * @param {string|Zone} [opts.zone='local'] - use this zone if no offset is specified in the input string itself. Will also convert the time to this zone
   * @param {boolean} [opts.setZone=false] - override the zone with a fixed-offset zone specified in the string itself, if it specifies one
   * @param {string} [opts.locale='system's locale'] - a locale to set on the resulting DateTime instance
   * @param {string} [opts.outputCalendar] - the output calendar to set on the resulting DateTime instance
   * @param {string} [opts.numberingSystem] - the numbering system to set on the resulting DateTime instance
   * @param {string} [opts.weekSettings] - the week settings to set on the resulting DateTime instance
   * @example DateTime.fromISO('2016-05-25T09:08:34.123')
   * @example DateTime.fromISO('2016-05-25T09:08:34.123+06:00')
   * @example DateTime.fromISO('2016-05-25T09:08:34.123+06:00', {setZone: true})
   * @example DateTime.fromISO('2016-05-25T09:08:34.123', {zone: 'utc'})
   * @example DateTime.fromISO('2016-W05-4')
   * @return {DateTime}
   */
  static fromISO(text, opts = {}) {
    const [vals, parsedZone] = parseISODate(text);
    return parseDataToDateTime(vals, parsedZone, opts, "ISO 8601", text);
  }
  /**
   * Create a DateTime from an RFC 2822 string
   * @param {string} text - the RFC 2822 string
   * @param {Object} opts - options to affect the creation
   * @param {string|Zone} [opts.zone='local'] - convert the time to this zone. Since the offset is always specified in the string itself, this has no effect on the interpretation of string, merely the zone the resulting DateTime is expressed in.
   * @param {boolean} [opts.setZone=false] - override the zone with a fixed-offset zone specified in the string itself, if it specifies one
   * @param {string} [opts.locale='system's locale'] - a locale to set on the resulting DateTime instance
   * @param {string} opts.outputCalendar - the output calendar to set on the resulting DateTime instance
   * @param {string} opts.numberingSystem - the numbering system to set on the resulting DateTime instance
   * @param {string} opts.weekSettings - the week settings to set on the resulting DateTime instance
   * @example DateTime.fromRFC2822('25 Nov 2016 13:23:12 GMT')
   * @example DateTime.fromRFC2822('Fri, 25 Nov 2016 13:23:12 +0600')
   * @example DateTime.fromRFC2822('25 Nov 2016 13:23 Z')
   * @return {DateTime}
   */
  static fromRFC2822(text, opts = {}) {
    const [vals, parsedZone] = parseRFC2822Date(text);
    return parseDataToDateTime(vals, parsedZone, opts, "RFC 2822", text);
  }
  /**
   * Create a DateTime from an HTTP header date
   * @see https://www.w3.org/Protocols/rfc2616/rfc2616-sec3.html#sec3.3.1
   * @param {string} text - the HTTP header date
   * @param {Object} opts - options to affect the creation
   * @param {string|Zone} [opts.zone='local'] - convert the time to this zone. Since HTTP dates are always in UTC, this has no effect on the interpretation of string, merely the zone the resulting DateTime is expressed in.
   * @param {boolean} [opts.setZone=false] - override the zone with the fixed-offset zone specified in the string. For HTTP dates, this is always UTC, so this option is equivalent to setting the `zone` option to 'utc', but this option is included for consistency with similar methods.
   * @param {string} [opts.locale='system's locale'] - a locale to set on the resulting DateTime instance
   * @param {string} opts.outputCalendar - the output calendar to set on the resulting DateTime instance
   * @param {string} opts.numberingSystem - the numbering system to set on the resulting DateTime instance
   * @param {string} opts.weekSettings - the week settings to set on the resulting DateTime instance
   * @example DateTime.fromHTTP('Sun, 06 Nov 1994 08:49:37 GMT')
   * @example DateTime.fromHTTP('Sunday, 06-Nov-94 08:49:37 GMT')
   * @example DateTime.fromHTTP('Sun Nov  6 08:49:37 1994')
   * @return {DateTime}
   */
  static fromHTTP(text, opts = {}) {
    const [vals, parsedZone] = parseHTTPDate(text);
    return parseDataToDateTime(vals, parsedZone, opts, "HTTP", opts);
  }
  /**
   * Create a DateTime from an input string and format string.
   * Defaults to en-US if no locale has been specified, regardless of the system's locale. For a table of tokens and their interpretations, see [here](https://moment.github.io/luxon/#/parsing?id=table-of-tokens).
   * @param {string} text - the string to parse
   * @param {string} fmt - the format the string is expected to be in (see the link below for the formats)
   * @param {Object} opts - options to affect the creation
   * @param {string|Zone} [opts.zone='local'] - use this zone if no offset is specified in the input string itself. Will also convert the DateTime to this zone
   * @param {boolean} [opts.setZone=false] - override the zone with a zone specified in the string itself, if it specifies one
   * @param {string} [opts.locale='en-US'] - a locale string to use when parsing. Will also set the DateTime to this locale
   * @param {string} opts.numberingSystem - the numbering system to use when parsing. Will also set the resulting DateTime to this numbering system
   * @param {string} opts.weekSettings - the week settings to set on the resulting DateTime instance
   * @param {string} opts.outputCalendar - the output calendar to set on the resulting DateTime instance
   * @return {DateTime}
   */
  static fromFormat(text, fmt, opts = {}) {
    if (isUndefined(text) || isUndefined(fmt)) {
      throw new InvalidArgumentError("fromFormat requires an input string and a format");
    }
    const { locale = null, numberingSystem = null } = opts, localeToUse = Locale.fromOpts({
      locale,
      numberingSystem,
      defaultToEN: true
    }), [vals, parsedZone, specificOffset, invalid] = parseFromTokens(localeToUse, text, fmt);
    if (invalid) {
      return DateTime.invalid(invalid);
    } else {
      return parseDataToDateTime(vals, parsedZone, opts, `format ${fmt}`, text, specificOffset);
    }
  }
  /**
   * @deprecated use fromFormat instead
   */
  static fromString(text, fmt, opts = {}) {
    return DateTime.fromFormat(text, fmt, opts);
  }
  /**
   * Create a DateTime from a SQL date, time, or datetime
   * Defaults to en-US if no locale has been specified, regardless of the system's locale
   * @param {string} text - the string to parse
   * @param {Object} opts - options to affect the creation
   * @param {string|Zone} [opts.zone='local'] - use this zone if no offset is specified in the input string itself. Will also convert the DateTime to this zone
   * @param {boolean} [opts.setZone=false] - override the zone with a zone specified in the string itself, if it specifies one
   * @param {string} [opts.locale='en-US'] - a locale string to use when parsing. Will also set the DateTime to this locale
   * @param {string} opts.numberingSystem - the numbering system to use when parsing. Will also set the resulting DateTime to this numbering system
   * @param {string} opts.weekSettings - the week settings to set on the resulting DateTime instance
   * @param {string} opts.outputCalendar - the output calendar to set on the resulting DateTime instance
   * @example DateTime.fromSQL('2017-05-15')
   * @example DateTime.fromSQL('2017-05-15 09:12:34')
   * @example DateTime.fromSQL('2017-05-15 09:12:34.342')
   * @example DateTime.fromSQL('2017-05-15 09:12:34.342+06:00')
   * @example DateTime.fromSQL('2017-05-15 09:12:34.342 America/Los_Angeles')
   * @example DateTime.fromSQL('2017-05-15 09:12:34.342 America/Los_Angeles', { setZone: true })
   * @example DateTime.fromSQL('2017-05-15 09:12:34.342', { zone: 'America/Los_Angeles' })
   * @example DateTime.fromSQL('09:12:34.342')
   * @return {DateTime}
   */
  static fromSQL(text, opts = {}) {
    const [vals, parsedZone] = parseSQL(text);
    return parseDataToDateTime(vals, parsedZone, opts, "SQL", text);
  }
  /**
   * Create an invalid DateTime.
   * @param {string} reason - simple string of why this DateTime is invalid. Should not contain parameters or anything else data-dependent.
   * @param {string} [explanation=null] - longer explanation, may include parameters and other useful debugging information
   * @return {DateTime}
   */
  static invalid(reason, explanation = null) {
    if (!reason) {
      throw new InvalidArgumentError("need to specify a reason the DateTime is invalid");
    }
    const invalid = reason instanceof Invalid ? reason : new Invalid(reason, explanation);
    if (Settings.throwOnInvalid) {
      throw new InvalidDateTimeError(invalid);
    } else {
      return new DateTime({ invalid });
    }
  }
  /**
   * Check if an object is an instance of DateTime. Works across context boundaries
   * @param {object} o
   * @return {boolean}
   */
  static isDateTime(o2) {
    return o2 && o2.isLuxonDateTime || false;
  }
  /**
   * Produce the format string for a set of options
   * @param formatOpts
   * @param localeOpts
   * @returns {string}
   */
  static parseFormatForOpts(formatOpts, localeOpts = {}) {
    const tokenList = formatOptsToTokens(formatOpts, Locale.fromObject(localeOpts));
    return !tokenList ? null : tokenList.map((t2) => t2 ? t2.val : null).join("");
  }
  /**
   * Produce the the fully expanded format token for the locale
   * Does NOT quote characters, so quoted tokens will not round trip correctly
   * @param fmt
   * @param localeOpts
   * @returns {string}
   */
  static expandFormat(fmt, localeOpts = {}) {
    const expanded = expandMacroTokens(Formatter.parseFormat(fmt), Locale.fromObject(localeOpts));
    return expanded.map((t2) => t2.val).join("");
  }
  static resetCache() {
    zoneOffsetTs = void 0;
    zoneOffsetGuessCache = {};
  }
  // INFO
  /**
   * Get the value of unit.
   * @param {string} unit - a unit such as 'minute' or 'day'
   * @example DateTime.local(2017, 7, 4).get('month'); //=> 7
   * @example DateTime.local(2017, 7, 4).get('day'); //=> 4
   * @return {number}
   */
  get(unit) {
    return this[unit];
  }
  /**
   * Returns whether the DateTime is valid. Invalid DateTimes occur when:
   * * The DateTime was created from invalid calendar information, such as the 13th month or February 30
   * * The DateTime was created by an operation on another invalid date
   * @type {boolean}
   */
  get isValid() {
    return this.invalid === null;
  }
  /**
   * Returns an error code if this DateTime is invalid, or null if the DateTime is valid
   * @type {string}
   */
  get invalidReason() {
    return this.invalid ? this.invalid.reason : null;
  }
  /**
   * Returns an explanation of why this DateTime became invalid, or null if the DateTime is valid
   * @type {string}
   */
  get invalidExplanation() {
    return this.invalid ? this.invalid.explanation : null;
  }
  /**
   * Get the locale of a DateTime, such 'en-GB'. The locale is used when formatting the DateTime
   *
   * @type {string}
   */
  get locale() {
    return this.isValid ? this.loc.locale : null;
  }
  /**
   * Get the numbering system of a DateTime, such 'beng'. The numbering system is used when formatting the DateTime
   *
   * @type {string}
   */
  get numberingSystem() {
    return this.isValid ? this.loc.numberingSystem : null;
  }
  /**
   * Get the output calendar of a DateTime, such 'islamic'. The output calendar is used when formatting the DateTime
   *
   * @type {string}
   */
  get outputCalendar() {
    return this.isValid ? this.loc.outputCalendar : null;
  }
  /**
   * Get the time zone associated with this DateTime.
   * @type {Zone}
   */
  get zone() {
    return this._zone;
  }
  /**
   * Get the name of the time zone.
   * @type {string}
   */
  get zoneName() {
    return this.isValid ? this.zone.name : null;
  }
  /**
   * Get the year
   * @example DateTime.local(2017, 5, 25).year //=> 2017
   * @type {number}
   */
  get year() {
    return this.isValid ? this.c.year : NaN;
  }
  /**
   * Get the quarter
   * @example DateTime.local(2017, 5, 25).quarter //=> 2
   * @type {number}
   */
  get quarter() {
    return this.isValid ? Math.ceil(this.c.month / 3) : NaN;
  }
  /**
   * Get the month (1-12).
   * @example DateTime.local(2017, 5, 25).month //=> 5
   * @type {number}
   */
  get month() {
    return this.isValid ? this.c.month : NaN;
  }
  /**
   * Get the day of the month (1-30ish).
   * @example DateTime.local(2017, 5, 25).day //=> 25
   * @type {number}
   */
  get day() {
    return this.isValid ? this.c.day : NaN;
  }
  /**
   * Get the hour of the day (0-23).
   * @example DateTime.local(2017, 5, 25, 9).hour //=> 9
   * @type {number}
   */
  get hour() {
    return this.isValid ? this.c.hour : NaN;
  }
  /**
   * Get the minute of the hour (0-59).
   * @example DateTime.local(2017, 5, 25, 9, 30).minute //=> 30
   * @type {number}
   */
  get minute() {
    return this.isValid ? this.c.minute : NaN;
  }
  /**
   * Get the second of the minute (0-59).
   * @example DateTime.local(2017, 5, 25, 9, 30, 52).second //=> 52
   * @type {number}
   */
  get second() {
    return this.isValid ? this.c.second : NaN;
  }
  /**
   * Get the millisecond of the second (0-999).
   * @example DateTime.local(2017, 5, 25, 9, 30, 52, 654).millisecond //=> 654
   * @type {number}
   */
  get millisecond() {
    return this.isValid ? this.c.millisecond : NaN;
  }
  /**
   * Get the week year
   * @see https://en.wikipedia.org/wiki/ISO_week_date
   * @example DateTime.local(2014, 12, 31).weekYear //=> 2015
   * @type {number}
   */
  get weekYear() {
    return this.isValid ? possiblyCachedWeekData(this).weekYear : NaN;
  }
  /**
   * Get the week number of the week year (1-52ish).
   * @see https://en.wikipedia.org/wiki/ISO_week_date
   * @example DateTime.local(2017, 5, 25).weekNumber //=> 21
   * @type {number}
   */
  get weekNumber() {
    return this.isValid ? possiblyCachedWeekData(this).weekNumber : NaN;
  }
  /**
   * Get the day of the week.
   * 1 is Monday and 7 is Sunday
   * @see https://en.wikipedia.org/wiki/ISO_week_date
   * @example DateTime.local(2014, 11, 31).weekday //=> 4
   * @type {number}
   */
  get weekday() {
    return this.isValid ? possiblyCachedWeekData(this).weekday : NaN;
  }
  /**
   * Returns true if this date is on a weekend according to the locale, false otherwise
   * @returns {boolean}
   */
  get isWeekend() {
    return this.isValid && this.loc.getWeekendDays().includes(this.weekday);
  }
  /**
   * Get the day of the week according to the locale.
   * 1 is the first day of the week and 7 is the last day of the week.
   * If the locale assigns Sunday as the first day of the week, then a date which is a Sunday will return 1,
   * @returns {number}
   */
  get localWeekday() {
    return this.isValid ? possiblyCachedLocalWeekData(this).weekday : NaN;
  }
  /**
   * Get the week number of the week year according to the locale. Different locales assign week numbers differently,
   * because the week can start on different days of the week (see localWeekday) and because a different number of days
   * is required for a week to count as the first week of a year.
   * @returns {number}
   */
  get localWeekNumber() {
    return this.isValid ? possiblyCachedLocalWeekData(this).weekNumber : NaN;
  }
  /**
   * Get the week year according to the locale. Different locales assign week numbers (and therefor week years)
   * differently, see localWeekNumber.
   * @returns {number}
   */
  get localWeekYear() {
    return this.isValid ? possiblyCachedLocalWeekData(this).weekYear : NaN;
  }
  /**
   * Get the ordinal (meaning the day of the year)
   * @example DateTime.local(2017, 5, 25).ordinal //=> 145
   * @type {number|DateTime}
   */
  get ordinal() {
    return this.isValid ? gregorianToOrdinal(this.c).ordinal : NaN;
  }
  /**
   * Get the human readable short month name, such as 'Oct'.
   * Defaults to the system's locale if no locale has been specified
   * @example DateTime.local(2017, 10, 30).monthShort //=> Oct
   * @type {string}
   */
  get monthShort() {
    return this.isValid ? Info.months("short", { locObj: this.loc })[this.month - 1] : null;
  }
  /**
   * Get the human readable long month name, such as 'October'.
   * Defaults to the system's locale if no locale has been specified
   * @example DateTime.local(2017, 10, 30).monthLong //=> October
   * @type {string}
   */
  get monthLong() {
    return this.isValid ? Info.months("long", { locObj: this.loc })[this.month - 1] : null;
  }
  /**
   * Get the human readable short weekday, such as 'Mon'.
   * Defaults to the system's locale if no locale has been specified
   * @example DateTime.local(2017, 10, 30).weekdayShort //=> Mon
   * @type {string}
   */
  get weekdayShort() {
    return this.isValid ? Info.weekdays("short", { locObj: this.loc })[this.weekday - 1] : null;
  }
  /**
   * Get the human readable long weekday, such as 'Monday'.
   * Defaults to the system's locale if no locale has been specified
   * @example DateTime.local(2017, 10, 30).weekdayLong //=> Monday
   * @type {string}
   */
  get weekdayLong() {
    return this.isValid ? Info.weekdays("long", { locObj: this.loc })[this.weekday - 1] : null;
  }
  /**
   * Get the UTC offset of this DateTime in minutes
   * @example DateTime.now().offset //=> -240
   * @example DateTime.utc().offset //=> 0
   * @type {number}
   */
  get offset() {
    return this.isValid ? +this.o : NaN;
  }
  /**
   * Get the short human name for the zone's current offset, for example "EST" or "EDT".
   * Defaults to the system's locale if no locale has been specified
   * @type {string}
   */
  get offsetNameShort() {
    if (this.isValid) {
      return this.zone.offsetName(this.ts, {
        format: "short",
        locale: this.locale
      });
    } else {
      return null;
    }
  }
  /**
   * Get the long human name for the zone's current offset, for example "Eastern Standard Time" or "Eastern Daylight Time".
   * Defaults to the system's locale if no locale has been specified
   * @type {string}
   */
  get offsetNameLong() {
    if (this.isValid) {
      return this.zone.offsetName(this.ts, {
        format: "long",
        locale: this.locale
      });
    } else {
      return null;
    }
  }
  /**
   * Get whether this zone's offset ever changes, as in a DST.
   * @type {boolean}
   */
  get isOffsetFixed() {
    return this.isValid ? this.zone.isUniversal : null;
  }
  /**
   * Get whether the DateTime is in a DST.
   * @type {boolean}
   */
  get isInDST() {
    if (this.isOffsetFixed) {
      return false;
    } else {
      return this.offset > this.set({ month: 1, day: 1 }).offset || this.offset > this.set({ month: 5 }).offset;
    }
  }
  /**
   * Get those DateTimes which have the same local time as this DateTime, but a different offset from UTC
   * in this DateTime's zone. During DST changes local time can be ambiguous, for example
   * `2023-10-29T02:30:00` in `Europe/Berlin` can have offset `+01:00` or `+02:00`.
   * This method will return both possible DateTimes if this DateTime's local time is ambiguous.
   * @returns {DateTime[]}
   */
  getPossibleOffsets() {
    if (!this.isValid || this.isOffsetFixed) {
      return [this];
    }
    const dayMs = 864e5;
    const minuteMs = 6e4;
    const localTS = objToLocalTS(this.c);
    const oEarlier = this.zone.offset(localTS - dayMs);
    const oLater = this.zone.offset(localTS + dayMs);
    const o1 = this.zone.offset(localTS - oEarlier * minuteMs);
    const o2 = this.zone.offset(localTS - oLater * minuteMs);
    if (o1 === o2) {
      return [this];
    }
    const ts1 = localTS - o1 * minuteMs;
    const ts2 = localTS - o2 * minuteMs;
    const c1 = tsToObj(ts1, o1);
    const c2 = tsToObj(ts2, o2);
    if (c1.hour === c2.hour && c1.minute === c2.minute && c1.second === c2.second && c1.millisecond === c2.millisecond) {
      return [clone(this, { ts: ts1 }), clone(this, { ts: ts2 })];
    }
    return [this];
  }
  /**
   * Returns true if this DateTime is in a leap year, false otherwise
   * @example DateTime.local(2016).isInLeapYear //=> true
   * @example DateTime.local(2013).isInLeapYear //=> false
   * @type {boolean}
   */
  get isInLeapYear() {
    return isLeapYear(this.year);
  }
  /**
   * Returns the number of days in this DateTime's month
   * @example DateTime.local(2016, 2).daysInMonth //=> 29
   * @example DateTime.local(2016, 3).daysInMonth //=> 31
   * @type {number}
   */
  get daysInMonth() {
    return daysInMonth(this.year, this.month);
  }
  /**
   * Returns the number of days in this DateTime's year
   * @example DateTime.local(2016).daysInYear //=> 366
   * @example DateTime.local(2013).daysInYear //=> 365
   * @type {number}
   */
  get daysInYear() {
    return this.isValid ? daysInYear(this.year) : NaN;
  }
  /**
   * Returns the number of weeks in this DateTime's year
   * @see https://en.wikipedia.org/wiki/ISO_week_date
   * @example DateTime.local(2004).weeksInWeekYear //=> 53
   * @example DateTime.local(2013).weeksInWeekYear //=> 52
   * @type {number}
   */
  get weeksInWeekYear() {
    return this.isValid ? weeksInWeekYear(this.weekYear) : NaN;
  }
  /**
   * Returns the number of weeks in this DateTime's local week year
   * @example DateTime.local(2020, 6, {locale: 'en-US'}).weeksInLocalWeekYear //=> 52
   * @example DateTime.local(2020, 6, {locale: 'de-DE'}).weeksInLocalWeekYear //=> 53
   * @type {number}
   */
  get weeksInLocalWeekYear() {
    return this.isValid ? weeksInWeekYear(
      this.localWeekYear,
      this.loc.getMinDaysInFirstWeek(),
      this.loc.getStartOfWeek()
    ) : NaN;
  }
  /**
   * Returns the resolved Intl options for this DateTime.
   * This is useful in understanding the behavior of formatting methods
   * @param {Object} opts - the same options as toLocaleString
   * @return {Object}
   */
  resolvedLocaleOptions(opts = {}) {
    const { locale, numberingSystem, calendar } = Formatter.create(
      this.loc.clone(opts),
      opts
    ).resolvedOptions(this);
    return { locale, numberingSystem, outputCalendar: calendar };
  }
  // TRANSFORM
  /**
   * "Set" the DateTime's zone to UTC. Returns a newly-constructed DateTime.
   *
   * Equivalent to {@link DateTime#setZone}('utc')
   * @param {number} [offset=0] - optionally, an offset from UTC in minutes
   * @param {Object} [opts={}] - options to pass to `setZone()`
   * @return {DateTime}
   */
  toUTC(offset2 = 0, opts = {}) {
    return this.setZone(FixedOffsetZone.instance(offset2), opts);
  }
  /**
   * "Set" the DateTime's zone to the host's local zone. Returns a newly-constructed DateTime.
   *
   * Equivalent to `setZone('local')`
   * @return {DateTime}
   */
  toLocal() {
    return this.setZone(Settings.defaultZone);
  }
  /**
   * "Set" the DateTime's zone to specified zone. Returns a newly-constructed DateTime.
   *
   * By default, the setter keeps the underlying time the same (as in, the same timestamp), but the new instance will report different local times and consider DSTs when making computations, as with {@link DateTime#plus}. You may wish to use {@link DateTime#toLocal} and {@link DateTime#toUTC} which provide simple convenience wrappers for commonly used zones.
   * @param {string|Zone} [zone='local'] - a zone identifier. As a string, that can be any IANA zone supported by the host environment, or a fixed-offset name of the form 'UTC+3', or the strings 'local' or 'utc'. You may also supply an instance of a {@link DateTime#Zone} class.
   * @param {Object} opts - options
   * @param {boolean} [opts.keepLocalTime=false] - If true, adjust the underlying time so that the local time stays the same, but in the target zone. You should rarely need this.
   * @return {DateTime}
   */
  setZone(zone, { keepLocalTime = false, keepCalendarTime = false } = {}) {
    zone = normalizeZone(zone, Settings.defaultZone);
    if (zone.equals(this.zone)) {
      return this;
    } else if (!zone.isValid) {
      return DateTime.invalid(unsupportedZone(zone));
    } else {
      let newTS = this.ts;
      if (keepLocalTime || keepCalendarTime) {
        const offsetGuess = zone.offset(this.ts);
        const asObj = this.toObject();
        [newTS] = objToTS(asObj, offsetGuess, zone);
      }
      return clone(this, { ts: newTS, zone });
    }
  }
  /**
   * "Set" the locale, numberingSystem, or outputCalendar. Returns a newly-constructed DateTime.
   * @param {Object} properties - the properties to set
   * @example DateTime.local(2017, 5, 25).reconfigure({ locale: 'en-GB' })
   * @return {DateTime}
   */
  reconfigure({ locale, numberingSystem, outputCalendar } = {}) {
    const loc = this.loc.clone({ locale, numberingSystem, outputCalendar });
    return clone(this, { loc });
  }
  /**
   * "Set" the locale. Returns a newly-constructed DateTime.
   * Just a convenient alias for reconfigure({ locale })
   * @example DateTime.local(2017, 5, 25).setLocale('en-GB')
   * @return {DateTime}
   */
  setLocale(locale) {
    return this.reconfigure({ locale });
  }
  /**
   * "Set" the values of specified units. Returns a newly-constructed DateTime.
   * You can only set units with this method; for "setting" metadata, see {@link DateTime#reconfigure} and {@link DateTime#setZone}.
   *
   * This method also supports setting locale-based week units, i.e. `localWeekday`, `localWeekNumber` and `localWeekYear`.
   * They cannot be mixed with ISO-week units like `weekday`.
   * @param {Object} values - a mapping of units to numbers
   * @example dt.set({ year: 2017 })
   * @example dt.set({ hour: 8, minute: 30 })
   * @example dt.set({ weekday: 5 })
   * @example dt.set({ year: 2005, ordinal: 234 })
   * @return {DateTime}
   */
  set(values) {
    if (!this.isValid) return this;
    const normalized = normalizeObject(values, normalizeUnitWithLocalWeeks);
    const { minDaysInFirstWeek, startOfWeek } = usesLocalWeekValues(normalized, this.loc);
    const settingWeekStuff = !isUndefined(normalized.weekYear) || !isUndefined(normalized.weekNumber) || !isUndefined(normalized.weekday), containsOrdinal = !isUndefined(normalized.ordinal), containsGregorYear = !isUndefined(normalized.year), containsGregorMD = !isUndefined(normalized.month) || !isUndefined(normalized.day), containsGregor = containsGregorYear || containsGregorMD, definiteWeekDef = normalized.weekYear || normalized.weekNumber;
    if ((containsGregor || containsOrdinal) && definiteWeekDef) {
      throw new ConflictingSpecificationError(
        "Can't mix weekYear/weekNumber units with year/month/day or ordinals"
      );
    }
    if (containsGregorMD && containsOrdinal) {
      throw new ConflictingSpecificationError("Can't mix ordinal dates with month/day");
    }
    let mixed;
    if (settingWeekStuff) {
      mixed = weekToGregorian(
        { ...gregorianToWeek(this.c, minDaysInFirstWeek, startOfWeek), ...normalized },
        minDaysInFirstWeek,
        startOfWeek
      );
    } else if (!isUndefined(normalized.ordinal)) {
      mixed = ordinalToGregorian({ ...gregorianToOrdinal(this.c), ...normalized });
    } else {
      mixed = { ...this.toObject(), ...normalized };
      if (isUndefined(normalized.day)) {
        mixed.day = Math.min(daysInMonth(mixed.year, mixed.month), mixed.day);
      }
    }
    const [ts, o2] = objToTS(mixed, this.o, this.zone);
    return clone(this, { ts, o: o2 });
  }
  /**
   * Add a period of time to this DateTime and return the resulting DateTime
   *
   * Adding hours, minutes, seconds, or milliseconds increases the timestamp by the right number of milliseconds. Adding days, months, or years shifts the calendar, accounting for DSTs and leap years along the way. Thus, `dt.plus({ hours: 24 })` may result in a different time than `dt.plus({ days: 1 })` if there's a DST shift in between.
   * @param {Duration|Object|number} duration - The amount to add. Either a Luxon Duration, a number of milliseconds, the object argument to Duration.fromObject()
   * @example DateTime.now().plus(123) //~> in 123 milliseconds
   * @example DateTime.now().plus({ minutes: 15 }) //~> in 15 minutes
   * @example DateTime.now().plus({ days: 1 }) //~> this time tomorrow
   * @example DateTime.now().plus({ days: -1 }) //~> this time yesterday
   * @example DateTime.now().plus({ hours: 3, minutes: 13 }) //~> in 3 hr, 13 min
   * @example DateTime.now().plus(Duration.fromObject({ hours: 3, minutes: 13 })) //~> in 3 hr, 13 min
   * @return {DateTime}
   */
  plus(duration) {
    if (!this.isValid) return this;
    const dur = Duration.fromDurationLike(duration);
    return clone(this, adjustTime(this, dur));
  }
  /**
   * Subtract a period of time to this DateTime and return the resulting DateTime
   * See {@link DateTime#plus}
   * @param {Duration|Object|number} duration - The amount to subtract. Either a Luxon Duration, a number of milliseconds, the object argument to Duration.fromObject()
   @return {DateTime}
   */
  minus(duration) {
    if (!this.isValid) return this;
    const dur = Duration.fromDurationLike(duration).negate();
    return clone(this, adjustTime(this, dur));
  }
  /**
   * "Set" this DateTime to the beginning of a unit of time.
   * @param {string} unit - The unit to go to the beginning of. Can be 'year', 'quarter', 'month', 'week', 'day', 'hour', 'minute', 'second', or 'millisecond'.
   * @param {Object} opts - options
   * @param {boolean} [opts.useLocaleWeeks=false] - If true, use weeks based on the locale, i.e. use the locale-dependent start of the week
   * @example DateTime.local(2014, 3, 3).startOf('month').toISODate(); //=> '2014-03-01'
   * @example DateTime.local(2014, 3, 3).startOf('year').toISODate(); //=> '2014-01-01'
   * @example DateTime.local(2014, 3, 3).startOf('week').toISODate(); //=> '2014-03-03', weeks always start on Mondays
   * @example DateTime.local(2014, 3, 3, 5, 30).startOf('day').toISOTime(); //=> '00:00.000-05:00'
   * @example DateTime.local(2014, 3, 3, 5, 30).startOf('hour').toISOTime(); //=> '05:00:00.000-05:00'
   * @return {DateTime}
   */
  startOf(unit, { useLocaleWeeks = false } = {}) {
    if (!this.isValid) return this;
    const o2 = {}, normalizedUnit = Duration.normalizeUnit(unit);
    switch (normalizedUnit) {
      case "years":
        o2.month = 1;
      case "quarters":
      case "months":
        o2.day = 1;
      case "weeks":
      case "days":
        o2.hour = 0;
      case "hours":
        o2.minute = 0;
      case "minutes":
        o2.second = 0;
      case "seconds":
        o2.millisecond = 0;
        break;
    }
    if (normalizedUnit === "weeks") {
      if (useLocaleWeeks) {
        const startOfWeek = this.loc.getStartOfWeek();
        const { weekday } = this;
        if (weekday < startOfWeek) {
          o2.weekNumber = this.weekNumber - 1;
        }
        o2.weekday = startOfWeek;
      } else {
        o2.weekday = 1;
      }
    }
    if (normalizedUnit === "quarters") {
      const q = Math.ceil(this.month / 3);
      o2.month = (q - 1) * 3 + 1;
    }
    return this.set(o2);
  }
  /**
   * "Set" this DateTime to the end (meaning the last millisecond) of a unit of time
   * @param {string} unit - The unit to go to the end of. Can be 'year', 'quarter', 'month', 'week', 'day', 'hour', 'minute', 'second', or 'millisecond'.
   * @param {Object} opts - options
   * @param {boolean} [opts.useLocaleWeeks=false] - If true, use weeks based on the locale, i.e. use the locale-dependent start of the week
   * @example DateTime.local(2014, 3, 3).endOf('month').toISO(); //=> '2014-03-31T23:59:59.999-05:00'
   * @example DateTime.local(2014, 3, 3).endOf('year').toISO(); //=> '2014-12-31T23:59:59.999-05:00'
   * @example DateTime.local(2014, 3, 3).endOf('week').toISO(); // => '2014-03-09T23:59:59.999-05:00', weeks start on Mondays
   * @example DateTime.local(2014, 3, 3, 5, 30).endOf('day').toISO(); //=> '2014-03-03T23:59:59.999-05:00'
   * @example DateTime.local(2014, 3, 3, 5, 30).endOf('hour').toISO(); //=> '2014-03-03T05:59:59.999-05:00'
   * @return {DateTime}
   */
  endOf(unit, opts) {
    return this.isValid ? this.plus({ [unit]: 1 }).startOf(unit, opts).minus(1) : this;
  }
  // OUTPUT
  /**
   * Returns a string representation of this DateTime formatted according to the specified format string.
   * **You may not want this.** See {@link DateTime#toLocaleString} for a more flexible formatting tool. For a table of tokens and their interpretations, see [here](https://moment.github.io/luxon/#/formatting?id=table-of-tokens).
   * Defaults to en-US if no locale has been specified, regardless of the system's locale.
   * @param {string} fmt - the format string
   * @param {Object} opts - opts to override the configuration options on this DateTime
   * @example DateTime.now().toFormat('yyyy LLL dd') //=> '2017 Apr 22'
   * @example DateTime.now().setLocale('fr').toFormat('yyyy LLL dd') //=> '2017 avr. 22'
   * @example DateTime.now().toFormat('yyyy LLL dd', { locale: "fr" }) //=> '2017 avr. 22'
   * @example DateTime.now().toFormat("HH 'hours and' mm 'minutes'") //=> '20 hours and 55 minutes'
   * @return {string}
   */
  toFormat(fmt, opts = {}) {
    return this.isValid ? Formatter.create(this.loc.redefaultToEN(opts)).formatDateTimeFromString(this, fmt) : INVALID;
  }
  /**
   * Returns a localized string representing this date. Accepts the same options as the Intl.DateTimeFormat constructor and any presets defined by Luxon, such as `DateTime.DATE_FULL` or `DateTime.TIME_SIMPLE`.
   * The exact behavior of this method is browser-specific, but in general it will return an appropriate representation
   * of the DateTime in the assigned locale.
   * Defaults to the system's locale if no locale has been specified
   * @see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DateTimeFormat
   * @param formatOpts {Object} - Intl.DateTimeFormat constructor options and configuration options
   * @param {Object} opts - opts to override the configuration options on this DateTime
   * @example DateTime.now().toLocaleString(); //=> 4/20/2017
   * @example DateTime.now().setLocale('en-gb').toLocaleString(); //=> '20/04/2017'
   * @example DateTime.now().toLocaleString(DateTime.DATE_FULL); //=> 'April 20, 2017'
   * @example DateTime.now().toLocaleString(DateTime.DATE_FULL, { locale: 'fr' }); //=> '28 août 2022'
   * @example DateTime.now().toLocaleString(DateTime.TIME_SIMPLE); //=> '11:32 AM'
   * @example DateTime.now().toLocaleString(DateTime.DATETIME_SHORT); //=> '4/20/2017, 11:32 AM'
   * @example DateTime.now().toLocaleString({ weekday: 'long', month: 'long', day: '2-digit' }); //=> 'Thursday, April 20'
   * @example DateTime.now().toLocaleString({ weekday: 'short', month: 'short', day: '2-digit', hour: '2-digit', minute: '2-digit' }); //=> 'Thu, Apr 20, 11:27 AM'
   * @example DateTime.now().toLocaleString({ hour: '2-digit', minute: '2-digit', hourCycle: 'h23' }); //=> '11:32'
   * @return {string}
   */
  toLocaleString(formatOpts = DATE_SHORT, opts = {}) {
    return this.isValid ? Formatter.create(this.loc.clone(opts), formatOpts).formatDateTime(this) : INVALID;
  }
  /**
   * Returns an array of format "parts", meaning individual tokens along with metadata. This is allows callers to post-process individual sections of the formatted output.
   * Defaults to the system's locale if no locale has been specified
   * @see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DateTimeFormat/formatToParts
   * @param opts {Object} - Intl.DateTimeFormat constructor options, same as `toLocaleString`.
   * @example DateTime.now().toLocaleParts(); //=> [
   *                                   //=>   { type: 'day', value: '25' },
   *                                   //=>   { type: 'literal', value: '/' },
   *                                   //=>   { type: 'month', value: '05' },
   *                                   //=>   { type: 'literal', value: '/' },
   *                                   //=>   { type: 'year', value: '1982' }
   *                                   //=> ]
   */
  toLocaleParts(opts = {}) {
    return this.isValid ? Formatter.create(this.loc.clone(opts), opts).formatDateTimeParts(this) : [];
  }
  /**
   * Returns an ISO 8601-compliant string representation of this DateTime
   * @param {Object} opts - options
   * @param {boolean} [opts.suppressMilliseconds=false] - exclude milliseconds from the format if they're 0
   * @param {boolean} [opts.suppressSeconds=false] - exclude seconds from the format if they're 0
   * @param {boolean} [opts.includeOffset=true] - include the offset, such as 'Z' or '-04:00'
   * @param {boolean} [opts.extendedZone=false] - add the time zone format extension
   * @param {string} [opts.format='extended'] - choose between the basic and extended format
   * @example DateTime.utc(1983, 5, 25).toISO() //=> '1982-05-25T00:00:00.000Z'
   * @example DateTime.now().toISO() //=> '2017-04-22T20:47:05.335-04:00'
   * @example DateTime.now().toISO({ includeOffset: false }) //=> '2017-04-22T20:47:05.335'
   * @example DateTime.now().toISO({ format: 'basic' }) //=> '20170422T204705.335-0400'
   * @return {string}
   */
  toISO({
    format = "extended",
    suppressSeconds = false,
    suppressMilliseconds = false,
    includeOffset = true,
    extendedZone = false
  } = {}) {
    if (!this.isValid) {
      return null;
    }
    const ext = format === "extended";
    let c2 = toISODate(this, ext);
    c2 += "T";
    c2 += toISOTime(this, ext, suppressSeconds, suppressMilliseconds, includeOffset, extendedZone);
    return c2;
  }
  /**
   * Returns an ISO 8601-compliant string representation of this DateTime's date component
   * @param {Object} opts - options
   * @param {string} [opts.format='extended'] - choose between the basic and extended format
   * @example DateTime.utc(1982, 5, 25).toISODate() //=> '1982-05-25'
   * @example DateTime.utc(1982, 5, 25).toISODate({ format: 'basic' }) //=> '19820525'
   * @return {string}
   */
  toISODate({ format = "extended" } = {}) {
    if (!this.isValid) {
      return null;
    }
    return toISODate(this, format === "extended");
  }
  /**
   * Returns an ISO 8601-compliant string representation of this DateTime's week date
   * @example DateTime.utc(1982, 5, 25).toISOWeekDate() //=> '1982-W21-2'
   * @return {string}
   */
  toISOWeekDate() {
    return toTechFormat(this, "kkkk-'W'WW-c");
  }
  /**
   * Returns an ISO 8601-compliant string representation of this DateTime's time component
   * @param {Object} opts - options
   * @param {boolean} [opts.suppressMilliseconds=false] - exclude milliseconds from the format if they're 0
   * @param {boolean} [opts.suppressSeconds=false] - exclude seconds from the format if they're 0
   * @param {boolean} [opts.includeOffset=true] - include the offset, such as 'Z' or '-04:00'
   * @param {boolean} [opts.extendedZone=true] - add the time zone format extension
   * @param {boolean} [opts.includePrefix=false] - include the `T` prefix
   * @param {string} [opts.format='extended'] - choose between the basic and extended format
   * @example DateTime.utc().set({ hour: 7, minute: 34 }).toISOTime() //=> '07:34:19.361Z'
   * @example DateTime.utc().set({ hour: 7, minute: 34, seconds: 0, milliseconds: 0 }).toISOTime({ suppressSeconds: true }) //=> '07:34Z'
   * @example DateTime.utc().set({ hour: 7, minute: 34 }).toISOTime({ format: 'basic' }) //=> '073419.361Z'
   * @example DateTime.utc().set({ hour: 7, minute: 34 }).toISOTime({ includePrefix: true }) //=> 'T07:34:19.361Z'
   * @return {string}
   */
  toISOTime({
    suppressMilliseconds = false,
    suppressSeconds = false,
    includeOffset = true,
    includePrefix = false,
    extendedZone = false,
    format = "extended"
  } = {}) {
    if (!this.isValid) {
      return null;
    }
    let c2 = includePrefix ? "T" : "";
    return c2 + toISOTime(
      this,
      format === "extended",
      suppressSeconds,
      suppressMilliseconds,
      includeOffset,
      extendedZone
    );
  }
  /**
   * Returns an RFC 2822-compatible string representation of this DateTime
   * @example DateTime.utc(2014, 7, 13).toRFC2822() //=> 'Sun, 13 Jul 2014 00:00:00 +0000'
   * @example DateTime.local(2014, 7, 13).toRFC2822() //=> 'Sun, 13 Jul 2014 00:00:00 -0400'
   * @return {string}
   */
  toRFC2822() {
    return toTechFormat(this, "EEE, dd LLL yyyy HH:mm:ss ZZZ", false);
  }
  /**
   * Returns a string representation of this DateTime appropriate for use in HTTP headers. The output is always expressed in GMT.
   * Specifically, the string conforms to RFC 1123.
   * @see https://www.w3.org/Protocols/rfc2616/rfc2616-sec3.html#sec3.3.1
   * @example DateTime.utc(2014, 7, 13).toHTTP() //=> 'Sun, 13 Jul 2014 00:00:00 GMT'
   * @example DateTime.utc(2014, 7, 13, 19).toHTTP() //=> 'Sun, 13 Jul 2014 19:00:00 GMT'
   * @return {string}
   */
  toHTTP() {
    return toTechFormat(this.toUTC(), "EEE, dd LLL yyyy HH:mm:ss 'GMT'");
  }
  /**
   * Returns a string representation of this DateTime appropriate for use in SQL Date
   * @example DateTime.utc(2014, 7, 13).toSQLDate() //=> '2014-07-13'
   * @return {string}
   */
  toSQLDate() {
    if (!this.isValid) {
      return null;
    }
    return toISODate(this, true);
  }
  /**
   * Returns a string representation of this DateTime appropriate for use in SQL Time
   * @param {Object} opts - options
   * @param {boolean} [opts.includeZone=false] - include the zone, such as 'America/New_York'. Overrides includeOffset.
   * @param {boolean} [opts.includeOffset=true] - include the offset, such as 'Z' or '-04:00'
   * @param {boolean} [opts.includeOffsetSpace=true] - include the space between the time and the offset, such as '05:15:16.345 -04:00'
   * @example DateTime.utc().toSQL() //=> '05:15:16.345'
   * @example DateTime.now().toSQL() //=> '05:15:16.345 -04:00'
   * @example DateTime.now().toSQL({ includeOffset: false }) //=> '05:15:16.345'
   * @example DateTime.now().toSQL({ includeZone: false }) //=> '05:15:16.345 America/New_York'
   * @return {string}
   */
  toSQLTime({ includeOffset = true, includeZone = false, includeOffsetSpace = true } = {}) {
    let fmt = "HH:mm:ss.SSS";
    if (includeZone || includeOffset) {
      if (includeOffsetSpace) {
        fmt += " ";
      }
      if (includeZone) {
        fmt += "z";
      } else if (includeOffset) {
        fmt += "ZZ";
      }
    }
    return toTechFormat(this, fmt, true);
  }
  /**
   * Returns a string representation of this DateTime appropriate for use in SQL DateTime
   * @param {Object} opts - options
   * @param {boolean} [opts.includeZone=false] - include the zone, such as 'America/New_York'. Overrides includeOffset.
   * @param {boolean} [opts.includeOffset=true] - include the offset, such as 'Z' or '-04:00'
   * @param {boolean} [opts.includeOffsetSpace=true] - include the space between the time and the offset, such as '05:15:16.345 -04:00'
   * @example DateTime.utc(2014, 7, 13).toSQL() //=> '2014-07-13 00:00:00.000 Z'
   * @example DateTime.local(2014, 7, 13).toSQL() //=> '2014-07-13 00:00:00.000 -04:00'
   * @example DateTime.local(2014, 7, 13).toSQL({ includeOffset: false }) //=> '2014-07-13 00:00:00.000'
   * @example DateTime.local(2014, 7, 13).toSQL({ includeZone: true }) //=> '2014-07-13 00:00:00.000 America/New_York'
   * @return {string}
   */
  toSQL(opts = {}) {
    if (!this.isValid) {
      return null;
    }
    return `${this.toSQLDate()} ${this.toSQLTime(opts)}`;
  }
  /**
   * Returns a string representation of this DateTime appropriate for debugging
   * @return {string}
   */
  toString() {
    return this.isValid ? this.toISO() : INVALID;
  }
  /**
   * Returns a string representation of this DateTime appropriate for the REPL.
   * @return {string}
   */
  [Symbol.for("nodejs.util.inspect.custom")]() {
    if (this.isValid) {
      return `DateTime { ts: ${this.toISO()}, zone: ${this.zone.name}, locale: ${this.locale} }`;
    } else {
      return `DateTime { Invalid, reason: ${this.invalidReason} }`;
    }
  }
  /**
   * Returns the epoch milliseconds of this DateTime. Alias of {@link DateTime#toMillis}
   * @return {number}
   */
  valueOf() {
    return this.toMillis();
  }
  /**
   * Returns the epoch milliseconds of this DateTime.
   * @return {number}
   */
  toMillis() {
    return this.isValid ? this.ts : NaN;
  }
  /**
   * Returns the epoch seconds of this DateTime.
   * @return {number}
   */
  toSeconds() {
    return this.isValid ? this.ts / 1e3 : NaN;
  }
  /**
   * Returns the epoch seconds (as a whole number) of this DateTime.
   * @return {number}
   */
  toUnixInteger() {
    return this.isValid ? Math.floor(this.ts / 1e3) : NaN;
  }
  /**
   * Returns an ISO 8601 representation of this DateTime appropriate for use in JSON.
   * @return {string}
   */
  toJSON() {
    return this.toISO();
  }
  /**
   * Returns a BSON serializable equivalent to this DateTime.
   * @return {Date}
   */
  toBSON() {
    return this.toJSDate();
  }
  /**
   * Returns a JavaScript object with this DateTime's year, month, day, and so on.
   * @param opts - options for generating the object
   * @param {boolean} [opts.includeConfig=false] - include configuration attributes in the output
   * @example DateTime.now().toObject() //=> { year: 2017, month: 4, day: 22, hour: 20, minute: 49, second: 42, millisecond: 268 }
   * @return {Object}
   */
  toObject(opts = {}) {
    if (!this.isValid) return {};
    const base = { ...this.c };
    if (opts.includeConfig) {
      base.outputCalendar = this.outputCalendar;
      base.numberingSystem = this.loc.numberingSystem;
      base.locale = this.loc.locale;
    }
    return base;
  }
  /**
   * Returns a JavaScript Date equivalent to this DateTime.
   * @return {Date}
   */
  toJSDate() {
    return new Date(this.isValid ? this.ts : NaN);
  }
  // COMPARE
  /**
   * Return the difference between two DateTimes as a Duration.
   * @param {DateTime} otherDateTime - the DateTime to compare this one to
   * @param {string|string[]} [unit=['milliseconds']] - the unit or array of units (such as 'hours' or 'days') to include in the duration.
   * @param {Object} opts - options that affect the creation of the Duration
   * @param {string} [opts.conversionAccuracy='casual'] - the conversion system to use
   * @example
   * var i1 = DateTime.fromISO('1982-05-25T09:45'),
   *     i2 = DateTime.fromISO('1983-10-14T10:30');
   * i2.diff(i1).toObject() //=> { milliseconds: 43807500000 }
   * i2.diff(i1, 'hours').toObject() //=> { hours: 12168.75 }
   * i2.diff(i1, ['months', 'days']).toObject() //=> { months: 16, days: 19.03125 }
   * i2.diff(i1, ['months', 'days', 'hours']).toObject() //=> { months: 16, days: 19, hours: 0.75 }
   * @return {Duration}
   */
  diff(otherDateTime, unit = "milliseconds", opts = {}) {
    if (!this.isValid || !otherDateTime.isValid) {
      return Duration.invalid("created by diffing an invalid DateTime");
    }
    const durOpts = { locale: this.locale, numberingSystem: this.numberingSystem, ...opts };
    const units = maybeArray(unit).map(Duration.normalizeUnit), otherIsLater = otherDateTime.valueOf() > this.valueOf(), earlier = otherIsLater ? this : otherDateTime, later = otherIsLater ? otherDateTime : this, diffed = diff(earlier, later, units, durOpts);
    return otherIsLater ? diffed.negate() : diffed;
  }
  /**
   * Return the difference between this DateTime and right now.
   * See {@link DateTime#diff}
   * @param {string|string[]} [unit=['milliseconds']] - the unit or units units (such as 'hours' or 'days') to include in the duration
   * @param {Object} opts - options that affect the creation of the Duration
   * @param {string} [opts.conversionAccuracy='casual'] - the conversion system to use
   * @return {Duration}
   */
  diffNow(unit = "milliseconds", opts = {}) {
    return this.diff(DateTime.now(), unit, opts);
  }
  /**
   * Return an Interval spanning between this DateTime and another DateTime
   * @param {DateTime} otherDateTime - the other end point of the Interval
   * @return {Interval}
   */
  until(otherDateTime) {
    return this.isValid ? Interval.fromDateTimes(this, otherDateTime) : this;
  }
  /**
   * Return whether this DateTime is in the same unit of time as another DateTime.
   * Higher-order units must also be identical for this function to return `true`.
   * Note that time zones are **ignored** in this comparison, which compares the **local** calendar time. Use {@link DateTime#setZone} to convert one of the dates if needed.
   * @param {DateTime} otherDateTime - the other DateTime
   * @param {string} unit - the unit of time to check sameness on
   * @param {Object} opts - options
   * @param {boolean} [opts.useLocaleWeeks=false] - If true, use weeks based on the locale, i.e. use the locale-dependent start of the week; only the locale of this DateTime is used
   * @example DateTime.now().hasSame(otherDT, 'day'); //~> true if otherDT is in the same current calendar day
   * @return {boolean}
   */
  hasSame(otherDateTime, unit, opts) {
    if (!this.isValid) return false;
    const inputMs = otherDateTime.valueOf();
    const adjustedToZone = this.setZone(otherDateTime.zone, { keepLocalTime: true });
    return adjustedToZone.startOf(unit, opts) <= inputMs && inputMs <= adjustedToZone.endOf(unit, opts);
  }
  /**
   * Equality check
   * Two DateTimes are equal if and only if they represent the same millisecond, have the same zone and location, and are both valid.
   * To compare just the millisecond values, use `+dt1 === +dt2`.
   * @param {DateTime} other - the other DateTime
   * @return {boolean}
   */
  equals(other) {
    return this.isValid && other.isValid && this.valueOf() === other.valueOf() && this.zone.equals(other.zone) && this.loc.equals(other.loc);
  }
  /**
   * Returns a string representation of a this time relative to now, such as "in two days". Can only internationalize if your
   * platform supports Intl.RelativeTimeFormat. Rounds down by default.
   * @param {Object} options - options that affect the output
   * @param {DateTime} [options.base=DateTime.now()] - the DateTime to use as the basis to which this time is compared. Defaults to now.
   * @param {string} [options.style="long"] - the style of units, must be "long", "short", or "narrow"
   * @param {string|string[]} options.unit - use a specific unit or array of units; if omitted, or an array, the method will pick the best unit. Use an array or one of "years", "quarters", "months", "weeks", "days", "hours", "minutes", or "seconds"
   * @param {boolean} [options.round=true] - whether to round the numbers in the output.
   * @param {number} [options.padding=0] - padding in milliseconds. This allows you to round up the result if it fits inside the threshold. Don't use in combination with {round: false} because the decimal output will include the padding.
   * @param {string} options.locale - override the locale of this DateTime
   * @param {string} options.numberingSystem - override the numberingSystem of this DateTime. The Intl system may choose not to honor this
   * @example DateTime.now().plus({ days: 1 }).toRelative() //=> "in 1 day"
   * @example DateTime.now().setLocale("es").toRelative({ days: 1 }) //=> "dentro de 1 día"
   * @example DateTime.now().plus({ days: 1 }).toRelative({ locale: "fr" }) //=> "dans 23 heures"
   * @example DateTime.now().minus({ days: 2 }).toRelative() //=> "2 days ago"
   * @example DateTime.now().minus({ days: 2 }).toRelative({ unit: "hours" }) //=> "48 hours ago"
   * @example DateTime.now().minus({ hours: 36 }).toRelative({ round: false }) //=> "1.5 days ago"
   */
  toRelative(options = {}) {
    if (!this.isValid) return null;
    const base = options.base || DateTime.fromObject({}, { zone: this.zone }), padding = options.padding ? this < base ? -options.padding : options.padding : 0;
    let units = ["years", "months", "days", "hours", "minutes", "seconds"];
    let unit = options.unit;
    if (Array.isArray(options.unit)) {
      units = options.unit;
      unit = void 0;
    }
    return diffRelative(base, this.plus(padding), {
      ...options,
      numeric: "always",
      units,
      unit
    });
  }
  /**
   * Returns a string representation of this date relative to today, such as "yesterday" or "next month".
   * Only internationalizes on platforms that supports Intl.RelativeTimeFormat.
   * @param {Object} options - options that affect the output
   * @param {DateTime} [options.base=DateTime.now()] - the DateTime to use as the basis to which this time is compared. Defaults to now.
   * @param {string} options.locale - override the locale of this DateTime
   * @param {string} options.unit - use a specific unit; if omitted, the method will pick the unit. Use one of "years", "quarters", "months", "weeks", or "days"
   * @param {string} options.numberingSystem - override the numberingSystem of this DateTime. The Intl system may choose not to honor this
   * @example DateTime.now().plus({ days: 1 }).toRelativeCalendar() //=> "tomorrow"
   * @example DateTime.now().setLocale("es").plus({ days: 1 }).toRelative() //=> ""mañana"
   * @example DateTime.now().plus({ days: 1 }).toRelativeCalendar({ locale: "fr" }) //=> "demain"
   * @example DateTime.now().minus({ days: 2 }).toRelativeCalendar() //=> "2 days ago"
   */
  toRelativeCalendar(options = {}) {
    if (!this.isValid) return null;
    return diffRelative(options.base || DateTime.fromObject({}, { zone: this.zone }), this, {
      ...options,
      numeric: "auto",
      units: ["years", "months", "days"],
      calendary: true
    });
  }
  /**
   * Return the min of several date times
   * @param {...DateTime} dateTimes - the DateTimes from which to choose the minimum
   * @return {DateTime} the min DateTime, or undefined if called with no argument
   */
  static min(...dateTimes) {
    if (!dateTimes.every(DateTime.isDateTime)) {
      throw new InvalidArgumentError("min requires all arguments be DateTimes");
    }
    return bestBy(dateTimes, (i2) => i2.valueOf(), Math.min);
  }
  /**
   * Return the max of several date times
   * @param {...DateTime} dateTimes - the DateTimes from which to choose the maximum
   * @return {DateTime} the max DateTime, or undefined if called with no argument
   */
  static max(...dateTimes) {
    if (!dateTimes.every(DateTime.isDateTime)) {
      throw new InvalidArgumentError("max requires all arguments be DateTimes");
    }
    return bestBy(dateTimes, (i2) => i2.valueOf(), Math.max);
  }
  // MISC
  /**
   * Explain how a string would be parsed by fromFormat()
   * @param {string} text - the string to parse
   * @param {string} fmt - the format the string is expected to be in (see description)
   * @param {Object} options - options taken by fromFormat()
   * @return {Object}
   */
  static fromFormatExplain(text, fmt, options = {}) {
    const { locale = null, numberingSystem = null } = options, localeToUse = Locale.fromOpts({
      locale,
      numberingSystem,
      defaultToEN: true
    });
    return explainFromTokens(localeToUse, text, fmt);
  }
  /**
   * @deprecated use fromFormatExplain instead
   */
  static fromStringExplain(text, fmt, options = {}) {
    return DateTime.fromFormatExplain(text, fmt, options);
  }
  /**
   * Build a parser for `fmt` using the given locale. This parser can be passed
   * to {@link DateTime.fromFormatParser} to a parse a date in this format. This
   * can be used to optimize cases where many dates need to be parsed in a
   * specific format.
   *
   * @param {String} fmt - the format the string is expected to be in (see
   * description)
   * @param {Object} options - options used to set locale and numberingSystem
   * for parser
   * @returns {TokenParser} - opaque object to be used
   */
  static buildFormatParser(fmt, options = {}) {
    const { locale = null, numberingSystem = null } = options, localeToUse = Locale.fromOpts({
      locale,
      numberingSystem,
      defaultToEN: true
    });
    return new TokenParser(localeToUse, fmt);
  }
  /**
   * Create a DateTime from an input string and format parser.
   *
   * The format parser must have been created with the same locale as this call.
   *
   * @param {String} text - the string to parse
   * @param {TokenParser} formatParser - parser from {@link DateTime.buildFormatParser}
   * @param {Object} opts - options taken by fromFormat()
   * @returns {DateTime}
   */
  static fromFormatParser(text, formatParser, opts = {}) {
    if (isUndefined(text) || isUndefined(formatParser)) {
      throw new InvalidArgumentError(
        "fromFormatParser requires an input string and a format parser"
      );
    }
    const { locale = null, numberingSystem = null } = opts, localeToUse = Locale.fromOpts({
      locale,
      numberingSystem,
      defaultToEN: true
    });
    if (!localeToUse.equals(formatParser.locale)) {
      throw new InvalidArgumentError(
        `fromFormatParser called with a locale of ${localeToUse}, but the format parser was created for ${formatParser.locale}`
      );
    }
    const { result, zone, specificOffset, invalidReason } = formatParser.explainFromTokens(text);
    if (invalidReason) {
      return DateTime.invalid(invalidReason);
    } else {
      return parseDataToDateTime(
        result,
        zone,
        opts,
        `format ${formatParser.format}`,
        text,
        specificOffset
      );
    }
  }
  // FORMAT PRESETS
  /**
   * {@link DateTime#toLocaleString} format like 10/14/1983
   * @type {Object}
   */
  static get DATE_SHORT() {
    return DATE_SHORT;
  }
  /**
   * {@link DateTime#toLocaleString} format like 'Oct 14, 1983'
   * @type {Object}
   */
  static get DATE_MED() {
    return DATE_MED;
  }
  /**
   * {@link DateTime#toLocaleString} format like 'Fri, Oct 14, 1983'
   * @type {Object}
   */
  static get DATE_MED_WITH_WEEKDAY() {
    return DATE_MED_WITH_WEEKDAY;
  }
  /**
   * {@link DateTime#toLocaleString} format like 'October 14, 1983'
   * @type {Object}
   */
  static get DATE_FULL() {
    return DATE_FULL;
  }
  /**
   * {@link DateTime#toLocaleString} format like 'Tuesday, October 14, 1983'
   * @type {Object}
   */
  static get DATE_HUGE() {
    return DATE_HUGE;
  }
  /**
   * {@link DateTime#toLocaleString} format like '09:30 AM'. Only 12-hour if the locale is.
   * @type {Object}
   */
  static get TIME_SIMPLE() {
    return TIME_SIMPLE;
  }
  /**
   * {@link DateTime#toLocaleString} format like '09:30:23 AM'. Only 12-hour if the locale is.
   * @type {Object}
   */
  static get TIME_WITH_SECONDS() {
    return TIME_WITH_SECONDS;
  }
  /**
   * {@link DateTime#toLocaleString} format like '09:30:23 AM EDT'. Only 12-hour if the locale is.
   * @type {Object}
   */
  static get TIME_WITH_SHORT_OFFSET() {
    return TIME_WITH_SHORT_OFFSET;
  }
  /**
   * {@link DateTime#toLocaleString} format like '09:30:23 AM Eastern Daylight Time'. Only 12-hour if the locale is.
   * @type {Object}
   */
  static get TIME_WITH_LONG_OFFSET() {
    return TIME_WITH_LONG_OFFSET;
  }
  /**
   * {@link DateTime#toLocaleString} format like '09:30', always 24-hour.
   * @type {Object}
   */
  static get TIME_24_SIMPLE() {
    return TIME_24_SIMPLE;
  }
  /**
   * {@link DateTime#toLocaleString} format like '09:30:23', always 24-hour.
   * @type {Object}
   */
  static get TIME_24_WITH_SECONDS() {
    return TIME_24_WITH_SECONDS;
  }
  /**
   * {@link DateTime#toLocaleString} format like '09:30:23 EDT', always 24-hour.
   * @type {Object}
   */
  static get TIME_24_WITH_SHORT_OFFSET() {
    return TIME_24_WITH_SHORT_OFFSET;
  }
  /**
   * {@link DateTime#toLocaleString} format like '09:30:23 Eastern Daylight Time', always 24-hour.
   * @type {Object}
   */
  static get TIME_24_WITH_LONG_OFFSET() {
    return TIME_24_WITH_LONG_OFFSET;
  }
  /**
   * {@link DateTime#toLocaleString} format like '10/14/1983, 9:30 AM'. Only 12-hour if the locale is.
   * @type {Object}
   */
  static get DATETIME_SHORT() {
    return DATETIME_SHORT;
  }
  /**
   * {@link DateTime#toLocaleString} format like '10/14/1983, 9:30:33 AM'. Only 12-hour if the locale is.
   * @type {Object}
   */
  static get DATETIME_SHORT_WITH_SECONDS() {
    return DATETIME_SHORT_WITH_SECONDS;
  }
  /**
   * {@link DateTime#toLocaleString} format like 'Oct 14, 1983, 9:30 AM'. Only 12-hour if the locale is.
   * @type {Object}
   */
  static get DATETIME_MED() {
    return DATETIME_MED;
  }
  /**
   * {@link DateTime#toLocaleString} format like 'Oct 14, 1983, 9:30:33 AM'. Only 12-hour if the locale is.
   * @type {Object}
   */
  static get DATETIME_MED_WITH_SECONDS() {
    return DATETIME_MED_WITH_SECONDS;
  }
  /**
   * {@link DateTime#toLocaleString} format like 'Fri, 14 Oct 1983, 9:30 AM'. Only 12-hour if the locale is.
   * @type {Object}
   */
  static get DATETIME_MED_WITH_WEEKDAY() {
    return DATETIME_MED_WITH_WEEKDAY;
  }
  /**
   * {@link DateTime#toLocaleString} format like 'October 14, 1983, 9:30 AM EDT'. Only 12-hour if the locale is.
   * @type {Object}
   */
  static get DATETIME_FULL() {
    return DATETIME_FULL;
  }
  /**
   * {@link DateTime#toLocaleString} format like 'October 14, 1983, 9:30:33 AM EDT'. Only 12-hour if the locale is.
   * @type {Object}
   */
  static get DATETIME_FULL_WITH_SECONDS() {
    return DATETIME_FULL_WITH_SECONDS;
  }
  /**
   * {@link DateTime#toLocaleString} format like 'Friday, October 14, 1983, 9:30 AM Eastern Daylight Time'. Only 12-hour if the locale is.
   * @type {Object}
   */
  static get DATETIME_HUGE() {
    return DATETIME_HUGE;
  }
  /**
   * {@link DateTime#toLocaleString} format like 'Friday, October 14, 1983, 9:30:33 AM Eastern Daylight Time'. Only 12-hour if the locale is.
   * @type {Object}
   */
  static get DATETIME_HUGE_WITH_SECONDS() {
    return DATETIME_HUGE_WITH_SECONDS;
  }
}
function friendlyDateTime(dateTimeish) {
  if (DateTime.isDateTime(dateTimeish)) {
    return dateTimeish;
  } else if (dateTimeish && dateTimeish.valueOf && isNumber(dateTimeish.valueOf())) {
    return DateTime.fromJSDate(dateTimeish);
  } else if (dateTimeish && typeof dateTimeish === "object") {
    return DateTime.fromObject(dateTimeish);
  } else {
    throw new InvalidArgumentError(
      `Unknown datetime argument: ${dateTimeish}, of type ${typeof dateTimeish}`
    );
  }
}
const VERSION = "3.5.0";
const luxon = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  DateTime,
  Duration,
  FixedOffsetZone,
  IANAZone,
  Info,
  Interval,
  InvalidZone,
  Settings,
  SystemZone,
  VERSION,
  Zone
}, Symbol.toStringTag, { value: "Module" }));
class KioskDateTimeError extends Error {
  constructor(message) {
    super(message);
    this.name = "KioskDateTimeError";
  }
}
class KioskDateTime {
  constructor(timeZones) {
    this.latinMonths = {
      "I": "01",
      "II": "02",
      "III": "03",
      "IV": "04",
      "V": "05",
      "VI": "06",
      "VII": "07",
      "VIII": "08",
      "IX": "09",
      "X": "10",
      "XI": "11",
      "XII": "12"
    };
    this.arabicMonthToLatin = ["I", "II", "III", "IV", "V", "VI", "VII", "VIII", "IX", "X", "XI", "XII"];
    this.timeZones = void 0;
    this.timeZones = timeZones;
  }
  /**
   * Returns a formatted Latin date string based on the provided Luxon DateTime object.
   *
   * @param dt a Luxon DateTime object to extract the date from
   * @param withTime Optional. A boolean flag to include time in the output. Default is true.
   * @returns The formatted Latin date string, with or without time based on the 'withTime' flag
   */
  getLatinDate(dt, withTime = true) {
    const latinMonths = ["I", "II", "III", "IV", "V", "VI", "VII", "VIII", "IX", "X", "XI", "XII"];
    const dtStr = `${dt.day} ${latinMonths[dt.month - 1]} ${dt.year}`;
    return withTime ? dtStr + " " + dt.toLocaleString(DateTime.TIME_WITH_SECONDS) : dtStr;
  }
  /**
   * returns a TimeZoneInfo object with id, ianaName and fullName of the
   * active user time zone (derived from the cookies kiosk_tz...)
   */
  static getActiveUserTimeZone() {
    return {
      id: parseInt(getCookie("kiosk_tz_index")),
      ianaName: getCookie("kiosk_iana_time_zone"),
      fullName: getCookie("kiosk_tz_name")
    };
  }
  /**
   * returns a TimeZoneInfo object with id, ianaName and fullName of the
   * active recording time zone.
   * The active recording time zone is derived from the kiosk_recording_tz_... cookies.
   */
  static getActiveRecordingTimeZone() {
    return {
      id: parseInt(getCookie("kiosk_recording_tz_index")),
      ianaName: getCookie("kiosk_recording_iana_time_zone"),
      fullName: getCookie("kiosk_recording_tz_name")
    };
  }
  /**
   * Initializes a kiosk date-time field (a HTMLInput Element) based on the provided ID.
   * Retrieves the UTC date from the specified field, converts it to a Luxon DateTime object in UTC zone,
   * adjusts the time zone if necessary, and updates the field value with the formatted Latin date string.
   *
   * @param id The ID of the HTML input element representing the kiosk date-time field
   * @param asRecordingTime Optional. If true this takes the IANA timezone from a hidden "-tz" Input Element,
   *                        otherwise the active user time zone will be used.
   */
  initKioskDateTimeTzField(id, asRecordingTime = true) {
    let field = document.getElementById(id);
    if (field) {
      let isoUTCDate = field.dataset.utcDate;
      if (isoUTCDate) {
        let dt = DateTime.fromISO(isoUTCDate, { zone: "UTC" });
        let ianaTz = document.getElementById(id + "-tz").value;
        let tz = "-";
        if (asRecordingTime) {
          tz = ianaTz;
        } else {
          if (ianaTz != "-") {
            tz = KioskDateTime.getActiveUserTimeZone().ianaName;
          }
        }
        if (tz !== "-" && tz !== "UTC") dt = dt.setZone(tz);
        field.value = this.getLatinDate(dt);
      }
    }
  }
  /**
   * Initializes a single <span class="kiosk-tz-span"> element.
   * @param span a HTMLSpanElement
   * @param displayTimeZone set to false if you don't want the time zone name added
   * @param latinFormat set to False if you want the timestamp in local date and time format instead of latin
   */
  async initKioskDateTimeSpan(span, displayTimeZone = true, latinFormat = true) {
    var _a2;
    let ISOUTCDate = (_a2 = span.textContent) == null ? void 0 : _a2.trim();
    if (ISOUTCDate) {
      let dt = DateTime.fromISO(ISOUTCDate, { zone: "UTC" });
      let tzIANA;
      let tzLong;
      if (span.dataset.tzIndex != void 0 && this.timeZones) {
        let tzInfo = await this.timeZones.getTimeZoneByIndex(Number(span.dataset.tzIndex));
        if (tzInfo && tzInfo.tz_IANA) tzIANA = tzInfo.tz_IANA;
        tzLong = tzInfo && tzInfo.tz_long ? tzInfo.tz_long : tzIANA;
      }
      if (!tzIANA) {
        tzIANA = span.dataset.recordingIanaTz;
      }
      if (tzIANA && tzIANA !== "UTC" && tzIANA !== "-") dt = dt.setZone(tzIANA);
      const dateStr = latinFormat ? this.getLatinDate(dt) : dt.toLocaleString();
      const tzStr = tzLong ? ` (${tzLong})` : " (legacy)";
      const timeStr = displayTimeZone ? tzStr : "";
      span.innerText = dateStr + timeStr;
    }
  }
  /**
   * Initializes <span class="kiosk-tz-span"> elements by expecting a ISO date as the span's text and
   * transforming it into a local time according to either the user's time zone or the recording time zone
   *
   * @param dialog
   * @param displayTimeZone if True (the default) the time zone name is shown
   * @param latinFormat default is true: expresses the date in Kiosk's latin date format
   */
  async initKioskDateTimeSpans(dialog, displayTimeZone = true, latinFormat = true) {
    const spans = dialog.querySelectorAll("span.kiosk-tz-span");
    for (const span of spans) {
      await this.initKioskDateTimeSpan(span, displayTimeZone, latinFormat);
    }
  }
  /**
   * validates a HTMLInputField that is supposed to contain a date time in its value
   * @param elementId The id of the element
   * @param errorClass default is "kiosk-error-border". class name that signals an error for the field
   * @param focusOnError default is true: in case of an error the element gets the focus
   * @param useRecordingTz default is true: uses the active recording time zone. False uses the active user time zone.
   * @returns the result of guessDateTime: A ISO8601 string of the date/time in UTC time zone
   */
  validateDateTimeField(elementId, errorClass = "kiosk-error-border", focusOnError = true, useRecordingTz = true) {
    var _a2;
    const dtElement = document.getElementById(elementId);
    let result = "";
    if (dtElement) {
      if (errorClass && dtElement.classList.contains(errorClass)) {
        dtElement.classList.remove(errorClass);
      }
      let dt = dtElement.value;
      if (dt && dt.trim()) {
        const tz = useRecordingTz ? KioskDateTime.getActiveRecordingTimeZone().ianaName : KioskDateTime.getActiveUserTimeZone().ianaName;
        const kdt = new KioskDateTime();
        try {
          result = (_a2 = kdt.guessDateTime(dt, false, tz)) == null ? void 0 : _a2.toISO({
            includeOffset: false,
            suppressMilliseconds: true
          });
          if (!result) {
            throw Error("date/time value not understood.");
          }
        } catch (e2) {
          if (errorClass) {
            dtElement.classList.add(errorClass);
          }
          if (e2 instanceof KioskDateTimeError) {
            if (focusOnError) {
              dtElement.focus();
            }
          }
          throw e2;
        }
      } else {
        result = "";
      }
    } else {
      throw Error(`ui element ${elementId} does not exist.`);
    }
    return result;
  }
  /**
   * Splits a given string containing date and time (optional) into separate date and time parts.
   *
   * @param dateTimeInput The string containing both date and time to be split.
   * @returns An array with the date part as the first element and the time part as the second element.
   *          If the input does not contain a time, the time part is undefined.
   */
  splitDateAndTime(dateTimeInput) {
    let dtParts = dateTimeInput.split(" ");
    let datePart = "";
    let timePart = "";
    if (dtParts.length < 2 || dtParts.length == 3) {
      return [dateTimeInput.trim(), void 0];
    }
    let lastSpace = dateTimeInput.lastIndexOf(" ");
    datePart = dateTimeInput.slice(0, lastSpace);
    timePart = dateTimeInput.slice(lastSpace + 1);
    if (timePart.length > 1) {
      timePart = timePart.trim();
    }
    if (datePart.length > 1) {
      datePart = datePart.trim();
    }
    return [datePart, timePart === "" ? void 0 : timePart];
  }
  interpolateYear(year, margin_1900 = 3) {
    if (year > 100) {
      return year;
    }
    const year2digits = (/* @__PURE__ */ new Date()).getFullYear() - Math.floor((/* @__PURE__ */ new Date()).getFullYear() / 1e3) * 1e3;
    if (year > year2digits + margin_1900) {
      return year + 1900;
    } else {
      return year + 2e3;
    }
  }
  /**
   * formats year, month and day to a ISO8601 string. Does not check if the result is a valid date.
   * @param year int or string
   * @param month int or string
   * @param day int or string
   */
  formatISO8601DateStr(year, month, day) {
    day = String(day).padStart(2, "0");
    month = String(month).padStart(2, "0");
    year = this.interpolateYear(parseInt(String(year) || ""), 3);
    return `${year}-${month}-${day}`;
  }
  guessLatinDate(latinDate) {
    var _a2;
    const latinDatesRegexes = [
      /^(?<day>\d{1,2})\.(?<latinMonth>[IVX]{1,4})\.(?<year>\d{2,4})$/,
      /^(?<day>\d{1,2}) (?<latinMonth>[IVX]{1,4}) (?<year>\d{2,4})$/,
      /^(?<day>\d{1,2})(?<latinMonth>[IVX]{1,4})(?<year>\d{2,4})$/
    ];
    let result = "";
    let p2 = null;
    for (const latinDateRegex of latinDatesRegexes) {
      const rxLatinDate = new RegExp(latinDateRegex);
      p2 = rxLatinDate.exec(latinDate);
      if (p2) {
        break;
      }
    }
    if (p2) {
      try {
        const latinMonth = (_a2 = p2.groups) == null ? void 0 : _a2.latinMonth;
        if (p2.groups && latinMonth && this.latinMonths.hasOwnProperty(latinMonth)) {
          result = this.formatISO8601DateStr(p2.groups.year, this.latinMonths[latinMonth], p2.groups.day);
        }
      } catch (e2) {
      }
    }
    return result;
  }
  /**
   * guesses the date and time from a string.
   *
   * throws KioskDateTimeError in case of errors
   * can also throw other Errors
   * returns a Luxon DateTime object with UTC time zone
   */
  guessDateTime(dateTimeInput, allowDateOnly = false, timeZone = "utc") {
    const isDT = DateTime.fromISO(dateTimeInput, { zone: "utc" });
    if (isDT.isValid) return isDT;
    let [datePart, timePart] = this.splitDateAndTime(dateTimeInput);
    if (!timePart && !allowDateOnly) {
      throw new KioskDateTimeError(`${dateTimeInput} has no time.`);
    }
    let p2 = this.guessLatinDate(datePart);
    if (p2) {
      datePart = p2;
    }
    const rx_german_date = /^(?<day>\d{1,2})\.(?<month>\d{1,2})\.(?<year>\d{2,4})$/;
    let rxResult = rx_german_date.exec(datePart);
    if (rxResult && rxResult.groups) {
      try {
        datePart = this.formatISO8601DateStr(rxResult.groups.year, rxResult.groups.month, rxResult.groups.day);
      } catch (e2) {
      }
    }
    const rx_us_date = /^(?<month>\d{1,2})\/(?<day>\d{1,2})\/(?<year>\d{2,4})$/;
    rxResult = rx_us_date.exec(datePart);
    if (rxResult && rxResult.groups) {
      try {
        datePart = this.formatISO8601DateStr(rxResult.groups.year, rxResult.groups.month, rxResult.groups.day);
      } catch (e2) {
      }
    }
    let ts;
    if (datePart) {
      if (timePart) {
        ts = DateTime.fromISO(datePart + "T" + timePart, { zone: timeZone, setZone: true }).toUTC();
      } else {
        ts = DateTime.fromISO(datePart, { zone: timeZone, setZone: true }).toUTC();
      }
      if (!ts.isValid) throw new KioskDateTimeError(`${dateTimeInput} is not a valid date`);
    }
    return ts;
  }
}
const kioskdatetime = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  KioskDateTime,
  KioskDateTimeError
}, Symbol.toStringTag, { value: "Module" }));
const API_STATE_READY = 2;
const API_STATE_ERROR = 3;
/**
 * @license
 * Copyright 2019 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const t$1 = globalThis, e$2 = t$1.ShadowRoot && (void 0 === t$1.ShadyCSS || t$1.ShadyCSS.nativeShadow) && "adoptedStyleSheets" in Document.prototype && "replace" in CSSStyleSheet.prototype, s$2 = Symbol(), o$3 = /* @__PURE__ */ new WeakMap();
let n$3 = class n {
  constructor(t2, e2, o2) {
    if (this._$cssResult$ = true, o2 !== s$2) throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");
    this.cssText = t2, this.t = e2;
  }
  get styleSheet() {
    let t2 = this.o;
    const s2 = this.t;
    if (e$2 && void 0 === t2) {
      const e2 = void 0 !== s2 && 1 === s2.length;
      e2 && (t2 = o$3.get(s2)), void 0 === t2 && ((this.o = t2 = new CSSStyleSheet()).replaceSync(this.cssText), e2 && o$3.set(s2, t2));
    }
    return t2;
  }
  toString() {
    return this.cssText;
  }
};
const r$5 = (t2) => new n$3("string" == typeof t2 ? t2 : t2 + "", void 0, s$2), S$1 = (s2, o2) => {
  if (e$2) s2.adoptedStyleSheets = o2.map((t2) => t2 instanceof CSSStyleSheet ? t2 : t2.styleSheet);
  else for (const e2 of o2) {
    const o3 = document.createElement("style"), n3 = t$1.litNonce;
    void 0 !== n3 && o3.setAttribute("nonce", n3), o3.textContent = e2.cssText, s2.appendChild(o3);
  }
}, c$2 = e$2 ? (t2) => t2 : (t2) => t2 instanceof CSSStyleSheet ? ((t3) => {
  let e2 = "";
  for (const s2 of t3.cssRules) e2 += s2.cssText;
  return r$5(e2);
})(t2) : t2;
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const { is: i$1, defineProperty: e$1, getOwnPropertyDescriptor: r$4, getOwnPropertyNames: h$1, getOwnPropertySymbols: o$2, getPrototypeOf: n$2 } = Object, a$1 = globalThis, c$1 = a$1.trustedTypes, l$1 = c$1 ? c$1.emptyScript : "", p$1 = a$1.reactiveElementPolyfillSupport, d$1 = (t2, s2) => t2, u$1 = { toAttribute(t2, s2) {
  switch (s2) {
    case Boolean:
      t2 = t2 ? l$1 : null;
      break;
    case Object:
    case Array:
      t2 = null == t2 ? t2 : JSON.stringify(t2);
  }
  return t2;
}, fromAttribute(t2, s2) {
  let i2 = t2;
  switch (s2) {
    case Boolean:
      i2 = null !== t2;
      break;
    case Number:
      i2 = null === t2 ? null : Number(t2);
      break;
    case Object:
    case Array:
      try {
        i2 = JSON.parse(t2);
      } catch (t3) {
        i2 = null;
      }
  }
  return i2;
} }, f$1 = (t2, s2) => !i$1(t2, s2), y$1 = { attribute: true, type: String, converter: u$1, reflect: false, hasChanged: f$1 };
Symbol.metadata ?? (Symbol.metadata = Symbol("metadata")), a$1.litPropertyMetadata ?? (a$1.litPropertyMetadata = /* @__PURE__ */ new WeakMap());
class b extends HTMLElement {
  static addInitializer(t2) {
    this._$Ei(), (this.l ?? (this.l = [])).push(t2);
  }
  static get observedAttributes() {
    return this.finalize(), this._$Eh && [...this._$Eh.keys()];
  }
  static createProperty(t2, s2 = y$1) {
    if (s2.state && (s2.attribute = false), this._$Ei(), this.elementProperties.set(t2, s2), !s2.noAccessor) {
      const i2 = Symbol(), r2 = this.getPropertyDescriptor(t2, i2, s2);
      void 0 !== r2 && e$1(this.prototype, t2, r2);
    }
  }
  static getPropertyDescriptor(t2, s2, i2) {
    const { get: e2, set: h2 } = r$4(this.prototype, t2) ?? { get() {
      return this[s2];
    }, set(t3) {
      this[s2] = t3;
    } };
    return { get() {
      return e2 == null ? void 0 : e2.call(this);
    }, set(s3) {
      const r2 = e2 == null ? void 0 : e2.call(this);
      h2.call(this, s3), this.requestUpdate(t2, r2, i2);
    }, configurable: true, enumerable: true };
  }
  static getPropertyOptions(t2) {
    return this.elementProperties.get(t2) ?? y$1;
  }
  static _$Ei() {
    if (this.hasOwnProperty(d$1("elementProperties"))) return;
    const t2 = n$2(this);
    t2.finalize(), void 0 !== t2.l && (this.l = [...t2.l]), this.elementProperties = new Map(t2.elementProperties);
  }
  static finalize() {
    if (this.hasOwnProperty(d$1("finalized"))) return;
    if (this.finalized = true, this._$Ei(), this.hasOwnProperty(d$1("properties"))) {
      const t3 = this.properties, s2 = [...h$1(t3), ...o$2(t3)];
      for (const i2 of s2) this.createProperty(i2, t3[i2]);
    }
    const t2 = this[Symbol.metadata];
    if (null !== t2) {
      const s2 = litPropertyMetadata.get(t2);
      if (void 0 !== s2) for (const [t3, i2] of s2) this.elementProperties.set(t3, i2);
    }
    this._$Eh = /* @__PURE__ */ new Map();
    for (const [t3, s2] of this.elementProperties) {
      const i2 = this._$Eu(t3, s2);
      void 0 !== i2 && this._$Eh.set(i2, t3);
    }
    this.elementStyles = this.finalizeStyles(this.styles);
  }
  static finalizeStyles(s2) {
    const i2 = [];
    if (Array.isArray(s2)) {
      const e2 = new Set(s2.flat(1 / 0).reverse());
      for (const s3 of e2) i2.unshift(c$2(s3));
    } else void 0 !== s2 && i2.push(c$2(s2));
    return i2;
  }
  static _$Eu(t2, s2) {
    const i2 = s2.attribute;
    return false === i2 ? void 0 : "string" == typeof i2 ? i2 : "string" == typeof t2 ? t2.toLowerCase() : void 0;
  }
  constructor() {
    super(), this._$Ep = void 0, this.isUpdatePending = false, this.hasUpdated = false, this._$Em = null, this._$Ev();
  }
  _$Ev() {
    var _a2;
    this._$ES = new Promise((t2) => this.enableUpdating = t2), this._$AL = /* @__PURE__ */ new Map(), this._$E_(), this.requestUpdate(), (_a2 = this.constructor.l) == null ? void 0 : _a2.forEach((t2) => t2(this));
  }
  addController(t2) {
    var _a2;
    (this._$EO ?? (this._$EO = /* @__PURE__ */ new Set())).add(t2), void 0 !== this.renderRoot && this.isConnected && ((_a2 = t2.hostConnected) == null ? void 0 : _a2.call(t2));
  }
  removeController(t2) {
    var _a2;
    (_a2 = this._$EO) == null ? void 0 : _a2.delete(t2);
  }
  _$E_() {
    const t2 = /* @__PURE__ */ new Map(), s2 = this.constructor.elementProperties;
    for (const i2 of s2.keys()) this.hasOwnProperty(i2) && (t2.set(i2, this[i2]), delete this[i2]);
    t2.size > 0 && (this._$Ep = t2);
  }
  createRenderRoot() {
    const t2 = this.shadowRoot ?? this.attachShadow(this.constructor.shadowRootOptions);
    return S$1(t2, this.constructor.elementStyles), t2;
  }
  connectedCallback() {
    var _a2;
    this.renderRoot ?? (this.renderRoot = this.createRenderRoot()), this.enableUpdating(true), (_a2 = this._$EO) == null ? void 0 : _a2.forEach((t2) => {
      var _a3;
      return (_a3 = t2.hostConnected) == null ? void 0 : _a3.call(t2);
    });
  }
  enableUpdating(t2) {
  }
  disconnectedCallback() {
    var _a2;
    (_a2 = this._$EO) == null ? void 0 : _a2.forEach((t2) => {
      var _a3;
      return (_a3 = t2.hostDisconnected) == null ? void 0 : _a3.call(t2);
    });
  }
  attributeChangedCallback(t2, s2, i2) {
    this._$AK(t2, i2);
  }
  _$EC(t2, s2) {
    var _a2;
    const i2 = this.constructor.elementProperties.get(t2), e2 = this.constructor._$Eu(t2, i2);
    if (void 0 !== e2 && true === i2.reflect) {
      const r2 = (void 0 !== ((_a2 = i2.converter) == null ? void 0 : _a2.toAttribute) ? i2.converter : u$1).toAttribute(s2, i2.type);
      this._$Em = t2, null == r2 ? this.removeAttribute(e2) : this.setAttribute(e2, r2), this._$Em = null;
    }
  }
  _$AK(t2, s2) {
    var _a2;
    const i2 = this.constructor, e2 = i2._$Eh.get(t2);
    if (void 0 !== e2 && this._$Em !== e2) {
      const t3 = i2.getPropertyOptions(e2), r2 = "function" == typeof t3.converter ? { fromAttribute: t3.converter } : void 0 !== ((_a2 = t3.converter) == null ? void 0 : _a2.fromAttribute) ? t3.converter : u$1;
      this._$Em = e2, this[e2] = r2.fromAttribute(s2, t3.type), this._$Em = null;
    }
  }
  requestUpdate(t2, s2, i2) {
    if (void 0 !== t2) {
      if (i2 ?? (i2 = this.constructor.getPropertyOptions(t2)), !(i2.hasChanged ?? f$1)(this[t2], s2)) return;
      this.P(t2, s2, i2);
    }
    false === this.isUpdatePending && (this._$ES = this._$ET());
  }
  P(t2, s2, i2) {
    this._$AL.has(t2) || this._$AL.set(t2, s2), true === i2.reflect && this._$Em !== t2 && (this._$Ej ?? (this._$Ej = /* @__PURE__ */ new Set())).add(t2);
  }
  async _$ET() {
    this.isUpdatePending = true;
    try {
      await this._$ES;
    } catch (t3) {
      Promise.reject(t3);
    }
    const t2 = this.scheduleUpdate();
    return null != t2 && await t2, !this.isUpdatePending;
  }
  scheduleUpdate() {
    return this.performUpdate();
  }
  performUpdate() {
    var _a2;
    if (!this.isUpdatePending) return;
    if (!this.hasUpdated) {
      if (this.renderRoot ?? (this.renderRoot = this.createRenderRoot()), this._$Ep) {
        for (const [t4, s3] of this._$Ep) this[t4] = s3;
        this._$Ep = void 0;
      }
      const t3 = this.constructor.elementProperties;
      if (t3.size > 0) for (const [s3, i2] of t3) true !== i2.wrapped || this._$AL.has(s3) || void 0 === this[s3] || this.P(s3, this[s3], i2);
    }
    let t2 = false;
    const s2 = this._$AL;
    try {
      t2 = this.shouldUpdate(s2), t2 ? (this.willUpdate(s2), (_a2 = this._$EO) == null ? void 0 : _a2.forEach((t3) => {
        var _a3;
        return (_a3 = t3.hostUpdate) == null ? void 0 : _a3.call(t3);
      }), this.update(s2)) : this._$EU();
    } catch (s3) {
      throw t2 = false, this._$EU(), s3;
    }
    t2 && this._$AE(s2);
  }
  willUpdate(t2) {
  }
  _$AE(t2) {
    var _a2;
    (_a2 = this._$EO) == null ? void 0 : _a2.forEach((t3) => {
      var _a3;
      return (_a3 = t3.hostUpdated) == null ? void 0 : _a3.call(t3);
    }), this.hasUpdated || (this.hasUpdated = true, this.firstUpdated(t2)), this.updated(t2);
  }
  _$EU() {
    this._$AL = /* @__PURE__ */ new Map(), this.isUpdatePending = false;
  }
  get updateComplete() {
    return this.getUpdateComplete();
  }
  getUpdateComplete() {
    return this._$ES;
  }
  shouldUpdate(t2) {
    return true;
  }
  update(t2) {
    this._$Ej && (this._$Ej = this._$Ej.forEach((t3) => this._$EC(t3, this[t3]))), this._$EU();
  }
  updated(t2) {
  }
  firstUpdated(t2) {
  }
}
b.elementStyles = [], b.shadowRootOptions = { mode: "open" }, b[d$1("elementProperties")] = /* @__PURE__ */ new Map(), b[d$1("finalized")] = /* @__PURE__ */ new Map(), p$1 == null ? void 0 : p$1({ ReactiveElement: b }), (a$1.reactiveElementVersions ?? (a$1.reactiveElementVersions = [])).push("2.0.4");
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const t = globalThis, i = t.trustedTypes, s$1 = i ? i.createPolicy("lit-html", { createHTML: (t2) => t2 }) : void 0, e = "$lit$", h = `lit$${(Math.random() + "").slice(9)}$`, o$1 = "?" + h, n$1 = `<${o$1}>`, r$3 = document, l = () => r$3.createComment(""), c = (t2) => null === t2 || "object" != typeof t2 && "function" != typeof t2, a = Array.isArray, u = (t2) => a(t2) || "function" == typeof (t2 == null ? void 0 : t2[Symbol.iterator]), d = "[ 	\n\f\r]", f = /<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g, v = /-->/g, _ = />/g, m = RegExp(`>|${d}(?:([^\\s"'>=/]+)(${d}*=${d}*(?:[^ 	
\f\r"'\`<>=]|("|')|))|$)`, "g"), p = /'/g, g = /"/g, $ = /^(?:script|style|textarea|title)$/i, y = (t2) => (i2, ...s2) => ({ _$litType$: t2, strings: i2, values: s2 }), x = y(1), w = Symbol.for("lit-noChange"), T = Symbol.for("lit-nothing"), A = /* @__PURE__ */ new WeakMap(), E = r$3.createTreeWalker(r$3, 129);
function C(t2, i2) {
  if (!Array.isArray(t2) || !t2.hasOwnProperty("raw")) throw Error("invalid template strings array");
  return void 0 !== s$1 ? s$1.createHTML(i2) : i2;
}
const P = (t2, i2) => {
  const s2 = t2.length - 1, o2 = [];
  let r2, l2 = 2 === i2 ? "<svg>" : "", c2 = f;
  for (let i3 = 0; i3 < s2; i3++) {
    const s3 = t2[i3];
    let a2, u2, d2 = -1, y2 = 0;
    for (; y2 < s3.length && (c2.lastIndex = y2, u2 = c2.exec(s3), null !== u2); ) y2 = c2.lastIndex, c2 === f ? "!--" === u2[1] ? c2 = v : void 0 !== u2[1] ? c2 = _ : void 0 !== u2[2] ? ($.test(u2[2]) && (r2 = RegExp("</" + u2[2], "g")), c2 = m) : void 0 !== u2[3] && (c2 = m) : c2 === m ? ">" === u2[0] ? (c2 = r2 ?? f, d2 = -1) : void 0 === u2[1] ? d2 = -2 : (d2 = c2.lastIndex - u2[2].length, a2 = u2[1], c2 = void 0 === u2[3] ? m : '"' === u2[3] ? g : p) : c2 === g || c2 === p ? c2 = m : c2 === v || c2 === _ ? c2 = f : (c2 = m, r2 = void 0);
    const x2 = c2 === m && t2[i3 + 1].startsWith("/>") ? " " : "";
    l2 += c2 === f ? s3 + n$1 : d2 >= 0 ? (o2.push(a2), s3.slice(0, d2) + e + s3.slice(d2) + h + x2) : s3 + h + (-2 === d2 ? i3 : x2);
  }
  return [C(t2, l2 + (t2[s2] || "<?>") + (2 === i2 ? "</svg>" : "")), o2];
};
class V {
  constructor({ strings: t2, _$litType$: s2 }, n3) {
    let r2;
    this.parts = [];
    let c2 = 0, a2 = 0;
    const u2 = t2.length - 1, d2 = this.parts, [f2, v2] = P(t2, s2);
    if (this.el = V.createElement(f2, n3), E.currentNode = this.el.content, 2 === s2) {
      const t3 = this.el.content.firstChild;
      t3.replaceWith(...t3.childNodes);
    }
    for (; null !== (r2 = E.nextNode()) && d2.length < u2; ) {
      if (1 === r2.nodeType) {
        if (r2.hasAttributes()) for (const t3 of r2.getAttributeNames()) if (t3.endsWith(e)) {
          const i2 = v2[a2++], s3 = r2.getAttribute(t3).split(h), e2 = /([.?@])?(.*)/.exec(i2);
          d2.push({ type: 1, index: c2, name: e2[2], strings: s3, ctor: "." === e2[1] ? k : "?" === e2[1] ? H : "@" === e2[1] ? I : R }), r2.removeAttribute(t3);
        } else t3.startsWith(h) && (d2.push({ type: 6, index: c2 }), r2.removeAttribute(t3));
        if ($.test(r2.tagName)) {
          const t3 = r2.textContent.split(h), s3 = t3.length - 1;
          if (s3 > 0) {
            r2.textContent = i ? i.emptyScript : "";
            for (let i2 = 0; i2 < s3; i2++) r2.append(t3[i2], l()), E.nextNode(), d2.push({ type: 2, index: ++c2 });
            r2.append(t3[s3], l());
          }
        }
      } else if (8 === r2.nodeType) if (r2.data === o$1) d2.push({ type: 2, index: c2 });
      else {
        let t3 = -1;
        for (; -1 !== (t3 = r2.data.indexOf(h, t3 + 1)); ) d2.push({ type: 7, index: c2 }), t3 += h.length - 1;
      }
      c2++;
    }
  }
  static createElement(t2, i2) {
    const s2 = r$3.createElement("template");
    return s2.innerHTML = t2, s2;
  }
}
function N(t2, i2, s2 = t2, e2) {
  var _a2, _b;
  if (i2 === w) return i2;
  let h2 = void 0 !== e2 ? (_a2 = s2._$Co) == null ? void 0 : _a2[e2] : s2._$Cl;
  const o2 = c(i2) ? void 0 : i2._$litDirective$;
  return (h2 == null ? void 0 : h2.constructor) !== o2 && ((_b = h2 == null ? void 0 : h2._$AO) == null ? void 0 : _b.call(h2, false), void 0 === o2 ? h2 = void 0 : (h2 = new o2(t2), h2._$AT(t2, s2, e2)), void 0 !== e2 ? (s2._$Co ?? (s2._$Co = []))[e2] = h2 : s2._$Cl = h2), void 0 !== h2 && (i2 = N(t2, h2._$AS(t2, i2.values), h2, e2)), i2;
}
class S {
  constructor(t2, i2) {
    this._$AV = [], this._$AN = void 0, this._$AD = t2, this._$AM = i2;
  }
  get parentNode() {
    return this._$AM.parentNode;
  }
  get _$AU() {
    return this._$AM._$AU;
  }
  u(t2) {
    const { el: { content: i2 }, parts: s2 } = this._$AD, e2 = ((t2 == null ? void 0 : t2.creationScope) ?? r$3).importNode(i2, true);
    E.currentNode = e2;
    let h2 = E.nextNode(), o2 = 0, n3 = 0, l2 = s2[0];
    for (; void 0 !== l2; ) {
      if (o2 === l2.index) {
        let i3;
        2 === l2.type ? i3 = new M(h2, h2.nextSibling, this, t2) : 1 === l2.type ? i3 = new l2.ctor(h2, l2.name, l2.strings, this, t2) : 6 === l2.type && (i3 = new L(h2, this, t2)), this._$AV.push(i3), l2 = s2[++n3];
      }
      o2 !== (l2 == null ? void 0 : l2.index) && (h2 = E.nextNode(), o2++);
    }
    return E.currentNode = r$3, e2;
  }
  p(t2) {
    let i2 = 0;
    for (const s2 of this._$AV) void 0 !== s2 && (void 0 !== s2.strings ? (s2._$AI(t2, s2, i2), i2 += s2.strings.length - 2) : s2._$AI(t2[i2])), i2++;
  }
}
class M {
  get _$AU() {
    var _a2;
    return ((_a2 = this._$AM) == null ? void 0 : _a2._$AU) ?? this._$Cv;
  }
  constructor(t2, i2, s2, e2) {
    this.type = 2, this._$AH = T, this._$AN = void 0, this._$AA = t2, this._$AB = i2, this._$AM = s2, this.options = e2, this._$Cv = (e2 == null ? void 0 : e2.isConnected) ?? true;
  }
  get parentNode() {
    let t2 = this._$AA.parentNode;
    const i2 = this._$AM;
    return void 0 !== i2 && 11 === (t2 == null ? void 0 : t2.nodeType) && (t2 = i2.parentNode), t2;
  }
  get startNode() {
    return this._$AA;
  }
  get endNode() {
    return this._$AB;
  }
  _$AI(t2, i2 = this) {
    t2 = N(this, t2, i2), c(t2) ? t2 === T || null == t2 || "" === t2 ? (this._$AH !== T && this._$AR(), this._$AH = T) : t2 !== this._$AH && t2 !== w && this._(t2) : void 0 !== t2._$litType$ ? this.$(t2) : void 0 !== t2.nodeType ? this.T(t2) : u(t2) ? this.k(t2) : this._(t2);
  }
  S(t2) {
    return this._$AA.parentNode.insertBefore(t2, this._$AB);
  }
  T(t2) {
    this._$AH !== t2 && (this._$AR(), this._$AH = this.S(t2));
  }
  _(t2) {
    this._$AH !== T && c(this._$AH) ? this._$AA.nextSibling.data = t2 : this.T(r$3.createTextNode(t2)), this._$AH = t2;
  }
  $(t2) {
    var _a2;
    const { values: i2, _$litType$: s2 } = t2, e2 = "number" == typeof s2 ? this._$AC(t2) : (void 0 === s2.el && (s2.el = V.createElement(C(s2.h, s2.h[0]), this.options)), s2);
    if (((_a2 = this._$AH) == null ? void 0 : _a2._$AD) === e2) this._$AH.p(i2);
    else {
      const t3 = new S(e2, this), s3 = t3.u(this.options);
      t3.p(i2), this.T(s3), this._$AH = t3;
    }
  }
  _$AC(t2) {
    let i2 = A.get(t2.strings);
    return void 0 === i2 && A.set(t2.strings, i2 = new V(t2)), i2;
  }
  k(t2) {
    a(this._$AH) || (this._$AH = [], this._$AR());
    const i2 = this._$AH;
    let s2, e2 = 0;
    for (const h2 of t2) e2 === i2.length ? i2.push(s2 = new M(this.S(l()), this.S(l()), this, this.options)) : s2 = i2[e2], s2._$AI(h2), e2++;
    e2 < i2.length && (this._$AR(s2 && s2._$AB.nextSibling, e2), i2.length = e2);
  }
  _$AR(t2 = this._$AA.nextSibling, i2) {
    var _a2;
    for ((_a2 = this._$AP) == null ? void 0 : _a2.call(this, false, true, i2); t2 && t2 !== this._$AB; ) {
      const i3 = t2.nextSibling;
      t2.remove(), t2 = i3;
    }
  }
  setConnected(t2) {
    var _a2;
    void 0 === this._$AM && (this._$Cv = t2, (_a2 = this._$AP) == null ? void 0 : _a2.call(this, t2));
  }
}
class R {
  get tagName() {
    return this.element.tagName;
  }
  get _$AU() {
    return this._$AM._$AU;
  }
  constructor(t2, i2, s2, e2, h2) {
    this.type = 1, this._$AH = T, this._$AN = void 0, this.element = t2, this.name = i2, this._$AM = e2, this.options = h2, s2.length > 2 || "" !== s2[0] || "" !== s2[1] ? (this._$AH = Array(s2.length - 1).fill(new String()), this.strings = s2) : this._$AH = T;
  }
  _$AI(t2, i2 = this, s2, e2) {
    const h2 = this.strings;
    let o2 = false;
    if (void 0 === h2) t2 = N(this, t2, i2, 0), o2 = !c(t2) || t2 !== this._$AH && t2 !== w, o2 && (this._$AH = t2);
    else {
      const e3 = t2;
      let n3, r2;
      for (t2 = h2[0], n3 = 0; n3 < h2.length - 1; n3++) r2 = N(this, e3[s2 + n3], i2, n3), r2 === w && (r2 = this._$AH[n3]), o2 || (o2 = !c(r2) || r2 !== this._$AH[n3]), r2 === T ? t2 = T : t2 !== T && (t2 += (r2 ?? "") + h2[n3 + 1]), this._$AH[n3] = r2;
    }
    o2 && !e2 && this.j(t2);
  }
  j(t2) {
    t2 === T ? this.element.removeAttribute(this.name) : this.element.setAttribute(this.name, t2 ?? "");
  }
}
class k extends R {
  constructor() {
    super(...arguments), this.type = 3;
  }
  j(t2) {
    this.element[this.name] = t2 === T ? void 0 : t2;
  }
}
class H extends R {
  constructor() {
    super(...arguments), this.type = 4;
  }
  j(t2) {
    this.element.toggleAttribute(this.name, !!t2 && t2 !== T);
  }
}
class I extends R {
  constructor(t2, i2, s2, e2, h2) {
    super(t2, i2, s2, e2, h2), this.type = 5;
  }
  _$AI(t2, i2 = this) {
    if ((t2 = N(this, t2, i2, 0) ?? T) === w) return;
    const s2 = this._$AH, e2 = t2 === T && s2 !== T || t2.capture !== s2.capture || t2.once !== s2.once || t2.passive !== s2.passive, h2 = t2 !== T && (s2 === T || e2);
    e2 && this.element.removeEventListener(this.name, this, s2), h2 && this.element.addEventListener(this.name, this, t2), this._$AH = t2;
  }
  handleEvent(t2) {
    var _a2;
    "function" == typeof this._$AH ? this._$AH.call(((_a2 = this.options) == null ? void 0 : _a2.host) ?? this.element, t2) : this._$AH.handleEvent(t2);
  }
}
class L {
  constructor(t2, i2, s2) {
    this.element = t2, this.type = 6, this._$AN = void 0, this._$AM = i2, this.options = s2;
  }
  get _$AU() {
    return this._$AM._$AU;
  }
  _$AI(t2) {
    N(this, t2);
  }
}
const Z = t.litHtmlPolyfillSupport;
Z == null ? void 0 : Z(V, M), (t.litHtmlVersions ?? (t.litHtmlVersions = [])).push("3.1.2");
const j = (t2, i2, s2) => {
  const e2 = (s2 == null ? void 0 : s2.renderBefore) ?? i2;
  let h2 = e2._$litPart$;
  if (void 0 === h2) {
    const t3 = (s2 == null ? void 0 : s2.renderBefore) ?? null;
    e2._$litPart$ = h2 = new M(i2.insertBefore(l(), t3), t3, void 0, s2 ?? {});
  }
  return h2._$AI(t2), h2;
};
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
class s extends b {
  constructor() {
    super(...arguments), this.renderOptions = { host: this }, this._$Do = void 0;
  }
  createRenderRoot() {
    var _a2;
    const t2 = super.createRenderRoot();
    return (_a2 = this.renderOptions).renderBefore ?? (_a2.renderBefore = t2.firstChild), t2;
  }
  update(t2) {
    const i2 = this.render();
    this.hasUpdated || (this.renderOptions.isConnected = this.isConnected), super.update(t2), this._$Do = j(i2, this.renderRoot, this.renderOptions);
  }
  connectedCallback() {
    var _a2;
    super.connectedCallback(), (_a2 = this._$Do) == null ? void 0 : _a2.setConnected(true);
  }
  disconnectedCallback() {
    var _a2;
    super.disconnectedCallback(), (_a2 = this._$Do) == null ? void 0 : _a2.setConnected(false);
  }
  render() {
    return w;
  }
}
s._$litElement$ = true, s["finalized"] = true, (_a = globalThis.litElementHydrateSupport) == null ? void 0 : _a.call(globalThis, { LitElement: s });
const r$2 = globalThis.litElementPolyfillSupport;
r$2 == null ? void 0 : r$2({ LitElement: s });
(globalThis.litElementVersions ?? (globalThis.litElementVersions = [])).push("4.0.4");
const _KioskApp = class _KioskApp extends s {
  constructor() {
    super();
    this.kiosk_base_url = "/";
    this.appErrors = [];
    this.apiContext = void 0;
    this.showProgress = false;
  }
  onAppMessage(e2) {
    console.log(`Unhandled AppMessage received`, e2.detail);
    this.addAppError(e2.detail.headline + "<br>" + e2.detail.body);
  }
  firstUpdated(_changedProperties) {
    super.firstUpdated(_changedProperties);
    this.addEventListener("send-message", this.onAppMessage);
  }
  updated(_changedProperties) {
    if (_changedProperties.has("apiContext")) {
      this.showProgress = false;
      if (this.apiContext && this.apiContext.status === API_STATE_ERROR) {
        this.addAppError("Cannot connect to Kiosk API.");
      }
      if (!_changedProperties["apiContext"] && this.apiContext) {
        this.apiConnected();
      }
    }
  }
  apiConnected() {
  }
  render() {
    let renderedHtml;
    if (this.apiContext && this.apiContext.status === API_STATE_READY) {
      renderedHtml = this.apiRender();
    } else {
      if (this.apiContext && this.apiContext.status === API_STATE_ERROR) renderedHtml = this.renderApiError();
      else renderedHtml = this.renderNoContextYet();
    }
    return x`
            <style>
                .system-message {
                    display: flex;
                    flex-direction: row;
                    justify-content: space-between;
                    border-style: solid;
                    border-width: 2px;
                    padding: 2px 1em;
                    position: relative;
                    margin-bottom: 10px;
                    background: linear-gradient(135deg, #882501, #bb3302);
                    color: #fabc02;
                }
                .system-message i {
                    
                }
                .loading {
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    height: 5px;
                    width: 100vw;
                    background-color: black;
                }
                .loading-progress {
                    height: 5px;
                    width: 100%;
                    border-radius: 3px;
                    background: linear-gradient(
                        90deg,
                        red 0%,
                        yellow 15%,
                        lime 30%,
                        cyan 50%,
                        blue 65%,
                        magenta 80%,
                        red 100%
                    );
                    background-size: 200%;
                    animation: move-gradient 2s ease-in infinite;
                }
                @keyframes move-gradient {
                    0% {
                        background-position: 0% 0%;
                    }
                    100% {
                        background-position: -200% 0%;
                    }
                }
            </style>
            <link rel="stylesheet" href="${this.kiosk_base_url}static/styles.css" />
            ${this.renderProgress()} ${this.renderErrors()} ${renderedHtml}
        `;
  }
  renderNoContextYet() {
    return x` <link rel="stylesheet" href="${this.kiosk_base_url}static/styles.css" /> `;
  }
  renderApiError() {
    return void 0;
  }
  renderErrors() {
    return this.appErrors.length > 0 ? x` ${this.appErrors.map((error) => x`<div class="system-message" @click="${this.errorClicked}"><span>${error}</span><i>x</i></div>`)} ` : T;
  }
  errorClicked(e2) {
    let text = e2.currentTarget.children[0].textContent;
    if (text) this.deleteError(text);
  }
  renderProgress(force = false) {
    if (force || this.showProgress)
      return x` <div class="loading">
                <div class="loading-progress"></div>
            </div>`;
    else return void 0;
  }
  addAppError(error) {
    this.appErrors.push(error);
    this.requestUpdate();
  }
  clearAppErrors() {
    this.appErrors = [];
    this.requestUpdate();
  }
  deleteError(error) {
    let foundIndex = -1;
    this.appErrors.find((apiErr, index) => {
      if (apiErr === error) {
        foundIndex = index;
        return true;
      } else return false;
    });
    if (foundIndex > -1) {
      this.appErrors.splice(foundIndex, 1);
      this.appErrors = [...this.appErrors];
    }
  }
};
_KioskApp.properties = {
  /**
   * The Api Context
   */
  apiContext: { type: Object },
  appErrors: { type: Array },
  showProgress: { type: Boolean }
};
let KioskApp = _KioskApp;
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const o = { attribute: true, type: String, converter: u$1, reflect: false, hasChanged: f$1 }, r$1 = (t2 = o, e2, r2) => {
  const { kind: n3, metadata: i2 } = r2;
  let s2 = globalThis.litPropertyMetadata.get(i2);
  if (void 0 === s2 && globalThis.litPropertyMetadata.set(i2, s2 = /* @__PURE__ */ new Map()), s2.set(r2.name, t2), "accessor" === n3) {
    const { name: o2 } = r2;
    return { set(r3) {
      const n4 = e2.get.call(this);
      e2.set.call(this, r3), this.requestUpdate(o2, n4, t2);
    }, init(e3) {
      return void 0 !== e3 && this.P(o2, void 0, t2), e3;
    } };
  }
  if ("setter" === n3) {
    const { name: o2 } = r2;
    return function(r3) {
      const n4 = this[o2];
      e2.call(this, r3), this.requestUpdate(o2, n4, t2);
    };
  }
  throw Error("Unsupported decorator location: " + n3);
};
function n2(t2) {
  return (e2, o2) => "object" == typeof o2 ? r$1(t2, e2, o2) : ((t3, e3, o3) => {
    const r2 = e3.hasOwnProperty(o3);
    return e3.constructor.createProperty(o3, r2 ? { ...t3, wrapped: true } : t3), r2 ? Object.getOwnPropertyDescriptor(e3, o3) : void 0;
  })(t2, e2, o2);
}
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
function r(r2) {
  return n2({ ...r2, state: true, attribute: false });
}
var __defProp = Object.defineProperty;
var __decorateClass = (decorators, target, key, kind) => {
  var result = void 0;
  for (var i2 = decorators.length - 1, decorator; i2 >= 0; i2--)
    if (decorator = decorators[i2])
      result = decorator(target, key, result) || result;
  if (result) __defProp(target, key, result);
  return result;
};
const _KioskAppComponent = class _KioskAppComponent extends s {
  constructor() {
    super();
    this.kiosk_base_url = "/";
    this.showProgress = false;
    this.apiContext = void 0;
  }
  updated(_changedProperties) {
    if (_changedProperties.has("apiContext")) {
      this.showProgress = false;
    }
  }
  render() {
    let renderedHtml;
    if (this.apiContext && this.apiContext.status === API_STATE_READY) {
      renderedHtml = this.apiRender();
    } else {
      if (this.apiContext && this.apiContext.status === API_STATE_ERROR) renderedHtml = this.renderApiError();
      else renderedHtml = this.renderNoContextYet();
    }
    return x`
            <link rel="stylesheet" href="${this.kiosk_base_url}static/styles.css" />
            ${renderedHtml}
        `;
  }
  renderNoContextYet() {
    return x` <link rel="stylesheet" href="${this.kiosk_base_url}static/styles.css" /> `;
  }
  renderApiError() {
    return void 0;
  }
  renderProgress(force = false) {
    if (force || this.showProgress)
      return x` <div class="loading">
                <div class="loading-progress"></div>
            </div>`;
    else return void 0;
  }
};
_KioskAppComponent.properties = {
  /**
   * The Api Context
   */
  apiContext: { type: Object }
};
let KioskAppComponent = _KioskAppComponent;
__decorateClass([
  r()
], KioskAppComponent.prototype, "showProgress");
var commonjsGlobal = typeof globalThis !== "undefined" ? globalThis : typeof window !== "undefined" ? window : typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : {};
function getDefaultExportFromCjs(x2) {
  return x2 && x2.__esModule && Object.prototype.hasOwnProperty.call(x2, "default") ? x2["default"] : x2;
}
var dexie_min = { exports: {} };
(function(module, exports) {
  (function(e2, t2) {
    module.exports = t2();
  })(commonjsGlobal, function() {
    var s2 = function(e3, t3) {
      return (s2 = Object.setPrototypeOf || { __proto__: [] } instanceof Array && function(e4, t4) {
        e4.__proto__ = t4;
      } || function(e4, t4) {
        for (var n4 in t4) Object.prototype.hasOwnProperty.call(t4, n4) && (e4[n4] = t4[n4]);
      })(e3, t3);
    };
    var w2 = function() {
      return (w2 = Object.assign || function(e3) {
        for (var t3, n4 = 1, r3 = arguments.length; n4 < r3; n4++) for (var i3 in t3 = arguments[n4]) Object.prototype.hasOwnProperty.call(t3, i3) && (e3[i3] = t3[i3]);
        return e3;
      }).apply(this, arguments);
    };
    function i2(e3, t3, n4) {
      for (var r3, i3 = 0, o3 = t3.length; i3 < o3; i3++) !r3 && i3 in t3 || ((r3 = r3 || Array.prototype.slice.call(t3, 0, i3))[i3] = t3[i3]);
      return e3.concat(r3 || Array.prototype.slice.call(t3));
    }
    var f2 = "undefined" != typeof globalThis ? globalThis : "undefined" != typeof self ? self : "undefined" != typeof window ? window : commonjsGlobal, _2 = Object.keys, x2 = Array.isArray;
    function a2(t3, n4) {
      return "object" != typeof n4 || _2(n4).forEach(function(e3) {
        t3[e3] = n4[e3];
      }), t3;
    }
    "undefined" == typeof Promise || f2.Promise || (f2.Promise = Promise);
    var c2 = Object.getPrototypeOf, n3 = {}.hasOwnProperty;
    function m2(e3, t3) {
      return n3.call(e3, t3);
    }
    function r2(t3, n4) {
      "function" == typeof n4 && (n4 = n4(c2(t3))), ("undefined" == typeof Reflect ? _2 : Reflect.ownKeys)(n4).forEach(function(e3) {
        l2(t3, e3, n4[e3]);
      });
    }
    var u2 = Object.defineProperty;
    function l2(e3, t3, n4, r3) {
      u2(e3, t3, a2(n4 && m2(n4, "get") && "function" == typeof n4.get ? { get: n4.get, set: n4.set, configurable: true } : { value: n4, configurable: true, writable: true }, r3));
    }
    function o2(t3) {
      return { from: function(e3) {
        return t3.prototype = Object.create(e3.prototype), l2(t3.prototype, "constructor", t3), { extend: r2.bind(null, t3.prototype) };
      } };
    }
    var h2 = Object.getOwnPropertyDescriptor;
    var d2 = [].slice;
    function b2(e3, t3, n4) {
      return d2.call(e3, t3, n4);
    }
    function p2(e3, t3) {
      return t3(e3);
    }
    function y2(e3) {
      if (!e3) throw new Error("Assertion Failed");
    }
    function v2(e3) {
      f2.setImmediate ? setImmediate(e3) : setTimeout(e3, 0);
    }
    function k2(e3, t3) {
      if ("string" == typeof t3 && m2(e3, t3)) return e3[t3];
      if (!t3) return e3;
      if ("string" != typeof t3) {
        for (var n4 = [], r3 = 0, i3 = t3.length; r3 < i3; ++r3) {
          var o3 = k2(e3, t3[r3]);
          n4.push(o3);
        }
        return n4;
      }
      var a3 = t3.indexOf(".");
      if (-1 !== a3) {
        var u3 = e3[t3.substr(0, a3)];
        return null == u3 ? void 0 : k2(u3, t3.substr(a3 + 1));
      }
    }
    function P2(e3, t3, n4) {
      if (e3 && void 0 !== t3 && !("isFrozen" in Object && Object.isFrozen(e3))) if ("string" != typeof t3 && "length" in t3) {
        y2("string" != typeof n4 && "length" in n4);
        for (var r3 = 0, i3 = t3.length; r3 < i3; ++r3) P2(e3, t3[r3], n4[r3]);
      } else {
        var o3, a3, u3 = t3.indexOf(".");
        -1 !== u3 ? (o3 = t3.substr(0, u3), "" === (a3 = t3.substr(u3 + 1)) ? void 0 === n4 ? x2(e3) && !isNaN(parseInt(o3)) ? e3.splice(o3, 1) : delete e3[o3] : e3[o3] = n4 : P2(u3 = !(u3 = e3[o3]) || !m2(e3, o3) ? e3[o3] = {} : u3, a3, n4)) : void 0 === n4 ? x2(e3) && !isNaN(parseInt(t3)) ? e3.splice(t3, 1) : delete e3[t3] : e3[t3] = n4;
      }
    }
    function g2(e3) {
      var t3, n4 = {};
      for (t3 in e3) m2(e3, t3) && (n4[t3] = e3[t3]);
      return n4;
    }
    var t2 = [].concat;
    function O(e3) {
      return t2.apply([], e3);
    }
    var e2 = "BigUint64Array,BigInt64Array,Array,Boolean,String,Date,RegExp,Blob,File,FileList,FileSystemFileHandle,FileSystemDirectoryHandle,ArrayBuffer,DataView,Uint8ClampedArray,ImageBitmap,ImageData,Map,Set,CryptoKey".split(",").concat(O([8, 16, 32, 64].map(function(t3) {
      return ["Int", "Uint", "Float"].map(function(e3) {
        return e3 + t3 + "Array";
      });
    }))).filter(function(e3) {
      return f2[e3];
    }), E2 = new Set(e2.map(function(e3) {
      return f2[e3];
    }));
    var K = null;
    function S2(e3) {
      K = /* @__PURE__ */ new WeakMap();
      e3 = function e4(t3) {
        if (!t3 || "object" != typeof t3) return t3;
        var n4 = K.get(t3);
        if (n4) return n4;
        if (x2(t3)) {
          n4 = [], K.set(t3, n4);
          for (var r3 = 0, i3 = t3.length; r3 < i3; ++r3) n4.push(e4(t3[r3]));
        } else if (E2.has(t3.constructor)) n4 = t3;
        else {
          var o3, a3 = c2(t3);
          for (o3 in n4 = a3 === Object.prototype ? {} : Object.create(a3), K.set(t3, n4), t3) m2(t3, o3) && (n4[o3] = e4(t3[o3]));
        }
        return n4;
      }(e3);
      return K = null, e3;
    }
    var j2 = {}.toString;
    function A2(e3) {
      return j2.call(e3).slice(8, -1);
    }
    var C2 = "undefined" != typeof Symbol ? Symbol.iterator : "@@iterator", D = "symbol" == typeof C2 ? function(e3) {
      var t3;
      return null != e3 && (t3 = e3[C2]) && t3.apply(e3);
    } : function() {
      return null;
    };
    function T2(e3, t3) {
      t3 = e3.indexOf(t3);
      return 0 <= t3 && e3.splice(t3, 1), 0 <= t3;
    }
    var q = {};
    function I2(e3) {
      var t3, n4, r3, i3;
      if (1 === arguments.length) {
        if (x2(e3)) return e3.slice();
        if (this === q && "string" == typeof e3) return [e3];
        if (i3 = D(e3)) {
          for (n4 = []; !(r3 = i3.next()).done; ) n4.push(r3.value);
          return n4;
        }
        if (null == e3) return [e3];
        if ("number" != typeof (t3 = e3.length)) return [e3];
        for (n4 = new Array(t3); t3--; ) n4[t3] = e3[t3];
        return n4;
      }
      for (t3 = arguments.length, n4 = new Array(t3); t3--; ) n4[t3] = arguments[t3];
      return n4;
    }
    var B = "undefined" != typeof Symbol ? function(e3) {
      return "AsyncFunction" === e3[Symbol.toStringTag];
    } : function() {
      return false;
    }, R2 = ["Unknown", "Constraint", "Data", "TransactionInactive", "ReadOnly", "Version", "NotFound", "InvalidState", "InvalidAccess", "Abort", "Timeout", "QuotaExceeded", "Syntax", "DataClone"], F = ["Modify", "Bulk", "OpenFailed", "VersionChange", "Schema", "Upgrade", "InvalidTable", "MissingAPI", "NoSuchDatabase", "InvalidArgument", "SubTransaction", "Unsupported", "Internal", "DatabaseClosed", "PrematureCommit", "ForeignAwait"].concat(R2), M2 = { VersionChanged: "Database version changed by other database connection", DatabaseClosed: "Database has been closed", Abort: "Transaction aborted", TransactionInactive: "Transaction has already completed or failed", MissingAPI: "IndexedDB API missing. Please visit https://tinyurl.com/y2uuvskb" };
    function N2(e3, t3) {
      this.name = e3, this.message = t3;
    }
    function L2(e3, t3) {
      return e3 + ". Errors: " + Object.keys(t3).map(function(e4) {
        return t3[e4].toString();
      }).filter(function(e4, t4, n4) {
        return n4.indexOf(e4) === t4;
      }).join("\n");
    }
    function U(e3, t3, n4, r3) {
      this.failures = t3, this.failedKeys = r3, this.successCount = n4, this.message = L2(e3, t3);
    }
    function V2(e3, t3) {
      this.name = "BulkError", this.failures = Object.keys(t3).map(function(e4) {
        return t3[e4];
      }), this.failuresByPos = t3, this.message = L2(e3, this.failures);
    }
    o2(N2).from(Error).extend({ toString: function() {
      return this.name + ": " + this.message;
    } }), o2(U).from(N2), o2(V2).from(N2);
    var z = F.reduce(function(e3, t3) {
      return e3[t3] = t3 + "Error", e3;
    }, {}), W = N2, Y = F.reduce(function(e3, n4) {
      var r3 = n4 + "Error";
      function t3(e4, t4) {
        this.name = r3, e4 ? "string" == typeof e4 ? (this.message = "".concat(e4).concat(t4 ? "\n " + t4 : ""), this.inner = t4 || null) : "object" == typeof e4 && (this.message = "".concat(e4.name, " ").concat(e4.message), this.inner = e4) : (this.message = M2[n4] || r3, this.inner = null);
      }
      return o2(t3).from(W), e3[n4] = t3, e3;
    }, {});
    Y.Syntax = SyntaxError, Y.Type = TypeError, Y.Range = RangeError;
    var $2 = R2.reduce(function(e3, t3) {
      return e3[t3 + "Error"] = Y[t3], e3;
    }, {});
    var Q = F.reduce(function(e3, t3) {
      return -1 === ["Syntax", "Type", "Range"].indexOf(t3) && (e3[t3 + "Error"] = Y[t3]), e3;
    }, {});
    function G() {
    }
    function X(e3) {
      return e3;
    }
    function H2(t3, n4) {
      return null == t3 || t3 === X ? n4 : function(e3) {
        return n4(t3(e3));
      };
    }
    function J(e3, t3) {
      return function() {
        e3.apply(this, arguments), t3.apply(this, arguments);
      };
    }
    function Z2(i3, o3) {
      return i3 === G ? o3 : function() {
        var e3 = i3.apply(this, arguments);
        void 0 !== e3 && (arguments[0] = e3);
        var t3 = this.onsuccess, n4 = this.onerror;
        this.onsuccess = null, this.onerror = null;
        var r3 = o3.apply(this, arguments);
        return t3 && (this.onsuccess = this.onsuccess ? J(t3, this.onsuccess) : t3), n4 && (this.onerror = this.onerror ? J(n4, this.onerror) : n4), void 0 !== r3 ? r3 : e3;
      };
    }
    function ee(n4, r3) {
      return n4 === G ? r3 : function() {
        n4.apply(this, arguments);
        var e3 = this.onsuccess, t3 = this.onerror;
        this.onsuccess = this.onerror = null, r3.apply(this, arguments), e3 && (this.onsuccess = this.onsuccess ? J(e3, this.onsuccess) : e3), t3 && (this.onerror = this.onerror ? J(t3, this.onerror) : t3);
      };
    }
    function te(i3, o3) {
      return i3 === G ? o3 : function(e3) {
        var t3 = i3.apply(this, arguments);
        a2(e3, t3);
        var n4 = this.onsuccess, r3 = this.onerror;
        this.onsuccess = null, this.onerror = null;
        e3 = o3.apply(this, arguments);
        return n4 && (this.onsuccess = this.onsuccess ? J(n4, this.onsuccess) : n4), r3 && (this.onerror = this.onerror ? J(r3, this.onerror) : r3), void 0 === t3 ? void 0 === e3 ? void 0 : e3 : a2(t3, e3);
      };
    }
    function ne(e3, t3) {
      return e3 === G ? t3 : function() {
        return false !== t3.apply(this, arguments) && e3.apply(this, arguments);
      };
    }
    function re(i3, o3) {
      return i3 === G ? o3 : function() {
        var e3 = i3.apply(this, arguments);
        if (e3 && "function" == typeof e3.then) {
          for (var t3 = this, n4 = arguments.length, r3 = new Array(n4); n4--; ) r3[n4] = arguments[n4];
          return e3.then(function() {
            return o3.apply(t3, r3);
          });
        }
        return o3.apply(this, arguments);
      };
    }
    Q.ModifyError = U, Q.DexieError = N2, Q.BulkError = V2;
    var ie = "undefined" != typeof location && /^(http|https):\/\/(localhost|127\.0\.0\.1)/.test(location.href);
    function oe(e3) {
      ie = e3;
    }
    var ae = {}, ue = 100, e2 = "undefined" == typeof Promise ? [] : function() {
      var e3 = Promise.resolve();
      if ("undefined" == typeof crypto || !crypto.subtle) return [e3, c2(e3), e3];
      var t3 = crypto.subtle.digest("SHA-512", new Uint8Array([0]));
      return [t3, c2(t3), e3];
    }(), R2 = e2[0], F = e2[1], e2 = e2[2], F = F && F.then, se = R2 && R2.constructor, ce = !!e2;
    var le = function(e3, t3) {
      be.push([e3, t3]), he && (queueMicrotask(Se), he = false);
    }, fe = true, he = true, de = [], pe = [], ye = X, ve = { id: "global", global: true, ref: 0, unhandleds: [], onunhandled: G, pgp: false, env: {}, finalize: G }, me = ve, be = [], ge = 0, we = [];
    function _e(e3) {
      if ("object" != typeof this) throw new TypeError("Promises must be constructed via new");
      this._listeners = [], this._lib = false;
      var t3 = this._PSD = me;
      if ("function" != typeof e3) {
        if (e3 !== ae) throw new TypeError("Not a function");
        return this._state = arguments[1], this._value = arguments[2], void (false === this._state && Oe(this, this._value));
      }
      this._state = null, this._value = null, ++t3.ref, function t4(r3, e4) {
        try {
          e4(function(n4) {
            if (null === r3._state) {
              if (n4 === r3) throw new TypeError("A promise cannot be resolved with itself.");
              var e5 = r3._lib && je();
              n4 && "function" == typeof n4.then ? t4(r3, function(e6, t5) {
                n4 instanceof _e ? n4._then(e6, t5) : n4.then(e6, t5);
              }) : (r3._state = true, r3._value = n4, Pe(r3)), e5 && Ae();
            }
          }, Oe.bind(null, r3));
        } catch (e5) {
          Oe(r3, e5);
        }
      }(this, e3);
    }
    var xe = { get: function() {
      var u3 = me, t3 = Fe;
      function e3(n4, r3) {
        var i3 = this, o3 = !u3.global && (u3 !== me || t3 !== Fe), a3 = o3 && !Ue(), e4 = new _e(function(e5, t4) {
          Ee(i3, new ke(Qe(n4, u3, o3, a3), Qe(r3, u3, o3, a3), e5, t4, u3));
        });
        return this._consoleTask && (e4._consoleTask = this._consoleTask), e4;
      }
      return e3.prototype = ae, e3;
    }, set: function(e3) {
      l2(this, "then", e3 && e3.prototype === ae ? xe : { get: function() {
        return e3;
      }, set: xe.set });
    } };
    function ke(e3, t3, n4, r3, i3) {
      this.onFulfilled = "function" == typeof e3 ? e3 : null, this.onRejected = "function" == typeof t3 ? t3 : null, this.resolve = n4, this.reject = r3, this.psd = i3;
    }
    function Oe(e3, t3) {
      var n4, r3;
      pe.push(t3), null === e3._state && (n4 = e3._lib && je(), t3 = ye(t3), e3._state = false, e3._value = t3, r3 = e3, de.some(function(e4) {
        return e4._value === r3._value;
      }) || de.push(r3), Pe(e3), n4 && Ae());
    }
    function Pe(e3) {
      var t3 = e3._listeners;
      e3._listeners = [];
      for (var n4 = 0, r3 = t3.length; n4 < r3; ++n4) Ee(e3, t3[n4]);
      var i3 = e3._PSD;
      --i3.ref || i3.finalize(), 0 === ge && (++ge, le(function() {
        0 == --ge && Ce();
      }, []));
    }
    function Ee(e3, t3) {
      if (null !== e3._state) {
        var n4 = e3._state ? t3.onFulfilled : t3.onRejected;
        if (null === n4) return (e3._state ? t3.resolve : t3.reject)(e3._value);
        ++t3.psd.ref, ++ge, le(Ke, [n4, e3, t3]);
      } else e3._listeners.push(t3);
    }
    function Ke(e3, t3, n4) {
      try {
        var r3, i3 = t3._value;
        !t3._state && pe.length && (pe = []), r3 = ie && t3._consoleTask ? t3._consoleTask.run(function() {
          return e3(i3);
        }) : e3(i3), t3._state || -1 !== pe.indexOf(i3) || function(e4) {
          var t4 = de.length;
          for (; t4; ) if (de[--t4]._value === e4._value) return de.splice(t4, 1);
        }(t3), n4.resolve(r3);
      } catch (e4) {
        n4.reject(e4);
      } finally {
        0 == --ge && Ce(), --n4.psd.ref || n4.psd.finalize();
      }
    }
    function Se() {
      $e(ve, function() {
        je() && Ae();
      });
    }
    function je() {
      var e3 = fe;
      return he = fe = false, e3;
    }
    function Ae() {
      var e3, t3, n4;
      do {
        for (; 0 < be.length; ) for (e3 = be, be = [], n4 = e3.length, t3 = 0; t3 < n4; ++t3) {
          var r3 = e3[t3];
          r3[0].apply(null, r3[1]);
        }
      } while (0 < be.length);
      he = fe = true;
    }
    function Ce() {
      var e3 = de;
      de = [], e3.forEach(function(e4) {
        e4._PSD.onunhandled.call(null, e4._value, e4);
      });
      for (var t3 = we.slice(0), n4 = t3.length; n4; ) t3[--n4]();
    }
    function De(e3) {
      return new _e(ae, false, e3);
    }
    function Te(n4, r3) {
      var i3 = me;
      return function() {
        var e3 = je(), t3 = me;
        try {
          return We(i3, true), n4.apply(this, arguments);
        } catch (e4) {
          r3 && r3(e4);
        } finally {
          We(t3, false), e3 && Ae();
        }
      };
    }
    r2(_e.prototype, { then: xe, _then: function(e3, t3) {
      Ee(this, new ke(null, null, e3, t3, me));
    }, catch: function(e3) {
      if (1 === arguments.length) return this.then(null, e3);
      var t3 = e3, n4 = arguments[1];
      return "function" == typeof t3 ? this.then(null, function(e4) {
        return (e4 instanceof t3 ? n4 : De)(e4);
      }) : this.then(null, function(e4) {
        return (e4 && e4.name === t3 ? n4 : De)(e4);
      });
    }, finally: function(t3) {
      return this.then(function(e3) {
        return _e.resolve(t3()).then(function() {
          return e3;
        });
      }, function(e3) {
        return _e.resolve(t3()).then(function() {
          return De(e3);
        });
      });
    }, timeout: function(r3, i3) {
      var o3 = this;
      return r3 < 1 / 0 ? new _e(function(e3, t3) {
        var n4 = setTimeout(function() {
          return t3(new Y.Timeout(i3));
        }, r3);
        o3.then(e3, t3).finally(clearTimeout.bind(null, n4));
      }) : this;
    } }), "undefined" != typeof Symbol && Symbol.toStringTag && l2(_e.prototype, Symbol.toStringTag, "Dexie.Promise"), ve.env = Ye(), r2(_e, { all: function() {
      var o3 = I2.apply(null, arguments).map(Ve);
      return new _e(function(n4, r3) {
        0 === o3.length && n4([]);
        var i3 = o3.length;
        o3.forEach(function(e3, t3) {
          return _e.resolve(e3).then(function(e4) {
            o3[t3] = e4, --i3 || n4(o3);
          }, r3);
        });
      });
    }, resolve: function(n4) {
      return n4 instanceof _e ? n4 : n4 && "function" == typeof n4.then ? new _e(function(e3, t3) {
        n4.then(e3, t3);
      }) : new _e(ae, true, n4);
    }, reject: De, race: function() {
      var e3 = I2.apply(null, arguments).map(Ve);
      return new _e(function(t3, n4) {
        e3.map(function(e4) {
          return _e.resolve(e4).then(t3, n4);
        });
      });
    }, PSD: { get: function() {
      return me;
    }, set: function(e3) {
      return me = e3;
    } }, totalEchoes: { get: function() {
      return Fe;
    } }, newPSD: Ne, usePSD: $e, scheduler: { get: function() {
      return le;
    }, set: function(e3) {
      le = e3;
    } }, rejectionMapper: { get: function() {
      return ye;
    }, set: function(e3) {
      ye = e3;
    } }, follow: function(i3, n4) {
      return new _e(function(e3, t3) {
        return Ne(function(n5, r3) {
          var e4 = me;
          e4.unhandleds = [], e4.onunhandled = r3, e4.finalize = J(function() {
            var t4, e5 = this;
            t4 = function() {
              0 === e5.unhandleds.length ? n5() : r3(e5.unhandleds[0]);
            }, we.push(function e6() {
              t4(), we.splice(we.indexOf(e6), 1);
            }), ++ge, le(function() {
              0 == --ge && Ce();
            }, []);
          }, e4.finalize), i3();
        }, n4, e3, t3);
      });
    } }), se && (se.allSettled && l2(_e, "allSettled", function() {
      var e3 = I2.apply(null, arguments).map(Ve);
      return new _e(function(n4) {
        0 === e3.length && n4([]);
        var r3 = e3.length, i3 = new Array(r3);
        e3.forEach(function(e4, t3) {
          return _e.resolve(e4).then(function(e5) {
            return i3[t3] = { status: "fulfilled", value: e5 };
          }, function(e5) {
            return i3[t3] = { status: "rejected", reason: e5 };
          }).then(function() {
            return --r3 || n4(i3);
          });
        });
      });
    }), se.any && "undefined" != typeof AggregateError && l2(_e, "any", function() {
      var e3 = I2.apply(null, arguments).map(Ve);
      return new _e(function(n4, r3) {
        0 === e3.length && r3(new AggregateError([]));
        var i3 = e3.length, o3 = new Array(i3);
        e3.forEach(function(e4, t3) {
          return _e.resolve(e4).then(function(e5) {
            return n4(e5);
          }, function(e5) {
            o3[t3] = e5, --i3 || r3(new AggregateError(o3));
          });
        });
      });
    }));
    var qe = { awaits: 0, echoes: 0, id: 0 }, Ie = 0, Be = [], Re = 0, Fe = 0, Me = 0;
    function Ne(e3, t3, n4, r3) {
      var i3 = me, o3 = Object.create(i3);
      o3.parent = i3, o3.ref = 0, o3.global = false, o3.id = ++Me, ve.env, o3.env = ce ? { Promise: _e, PromiseProp: { value: _e, configurable: true, writable: true }, all: _e.all, race: _e.race, allSettled: _e.allSettled, any: _e.any, resolve: _e.resolve, reject: _e.reject } : {}, t3 && a2(o3, t3), ++i3.ref, o3.finalize = function() {
        --this.parent.ref || this.parent.finalize();
      };
      r3 = $e(o3, e3, n4, r3);
      return 0 === o3.ref && o3.finalize(), r3;
    }
    function Le() {
      return qe.id || (qe.id = ++Ie), ++qe.awaits, qe.echoes += ue, qe.id;
    }
    function Ue() {
      return !!qe.awaits && (0 == --qe.awaits && (qe.id = 0), qe.echoes = qe.awaits * ue, true);
    }
    function Ve(e3) {
      return qe.echoes && e3 && e3.constructor === se ? (Le(), e3.then(function(e4) {
        return Ue(), e4;
      }, function(e4) {
        return Ue(), Xe(e4);
      })) : e3;
    }
    function ze() {
      var e3 = Be[Be.length - 1];
      Be.pop(), We(e3, false);
    }
    function We(e3, t3) {
      var n4, r3 = me;
      (t3 ? !qe.echoes || Re++ && e3 === me : !Re || --Re && e3 === me) || queueMicrotask(t3 ? (function(e4) {
        ++Fe, qe.echoes && 0 != --qe.echoes || (qe.echoes = qe.awaits = qe.id = 0), Be.push(me), We(e4, true);
      }).bind(null, e3) : ze), e3 !== me && (me = e3, r3 === ve && (ve.env = Ye()), ce && (n4 = ve.env.Promise, t3 = e3.env, (r3.global || e3.global) && (Object.defineProperty(f2, "Promise", t3.PromiseProp), n4.all = t3.all, n4.race = t3.race, n4.resolve = t3.resolve, n4.reject = t3.reject, t3.allSettled && (n4.allSettled = t3.allSettled), t3.any && (n4.any = t3.any))));
    }
    function Ye() {
      var e3 = f2.Promise;
      return ce ? { Promise: e3, PromiseProp: Object.getOwnPropertyDescriptor(f2, "Promise"), all: e3.all, race: e3.race, allSettled: e3.allSettled, any: e3.any, resolve: e3.resolve, reject: e3.reject } : {};
    }
    function $e(e3, t3, n4, r3, i3) {
      var o3 = me;
      try {
        return We(e3, true), t3(n4, r3, i3);
      } finally {
        We(o3, false);
      }
    }
    function Qe(t3, n4, r3, i3) {
      return "function" != typeof t3 ? t3 : function() {
        var e3 = me;
        r3 && Le(), We(n4, true);
        try {
          return t3.apply(this, arguments);
        } finally {
          We(e3, false), i3 && queueMicrotask(Ue);
        }
      };
    }
    function Ge(e3) {
      Promise === se && 0 === qe.echoes ? 0 === Re ? e3() : enqueueNativeMicroTask(e3) : setTimeout(e3, 0);
    }
    -1 === ("" + F).indexOf("[native code]") && (Le = Ue = G);
    var Xe = _e.reject;
    var He = String.fromCharCode(65535), Je = "Invalid key provided. Keys must be of type string, number, Date or Array<string | number | Date>.", Ze = "String expected.", et = [], tt = "__dbnames", nt = "readonly", rt = "readwrite";
    function it(e3, t3) {
      return e3 ? t3 ? function() {
        return e3.apply(this, arguments) && t3.apply(this, arguments);
      } : e3 : t3;
    }
    var ot = { type: 3, lower: -1 / 0, lowerOpen: false, upper: [[]], upperOpen: false };
    function at(t3) {
      return "string" != typeof t3 || /\./.test(t3) ? function(e3) {
        return e3;
      } : function(e3) {
        return void 0 === e3[t3] && t3 in e3 && delete (e3 = S2(e3))[t3], e3;
      };
    }
    function ut() {
      throw Y.Type();
    }
    function st(e3, t3) {
      try {
        var n4 = ct(e3), r3 = ct(t3);
        if (n4 !== r3) return "Array" === n4 ? 1 : "Array" === r3 ? -1 : "binary" === n4 ? 1 : "binary" === r3 ? -1 : "string" === n4 ? 1 : "string" === r3 ? -1 : "Date" === n4 ? 1 : "Date" !== r3 ? NaN : -1;
        switch (n4) {
          case "number":
          case "Date":
          case "string":
            return t3 < e3 ? 1 : e3 < t3 ? -1 : 0;
          case "binary":
            return function(e4, t4) {
              for (var n5 = e4.length, r4 = t4.length, i3 = n5 < r4 ? n5 : r4, o3 = 0; o3 < i3; ++o3) if (e4[o3] !== t4[o3]) return e4[o3] < t4[o3] ? -1 : 1;
              return n5 === r4 ? 0 : n5 < r4 ? -1 : 1;
            }(lt(e3), lt(t3));
          case "Array":
            return function(e4, t4) {
              for (var n5 = e4.length, r4 = t4.length, i3 = n5 < r4 ? n5 : r4, o3 = 0; o3 < i3; ++o3) {
                var a3 = st(e4[o3], t4[o3]);
                if (0 !== a3) return a3;
              }
              return n5 === r4 ? 0 : n5 < r4 ? -1 : 1;
            }(e3, t3);
        }
      } catch (e4) {
      }
      return NaN;
    }
    function ct(e3) {
      var t3 = typeof e3;
      if ("object" != t3) return t3;
      if (ArrayBuffer.isView(e3)) return "binary";
      e3 = A2(e3);
      return "ArrayBuffer" === e3 ? "binary" : e3;
    }
    function lt(e3) {
      return e3 instanceof Uint8Array ? e3 : ArrayBuffer.isView(e3) ? new Uint8Array(e3.buffer, e3.byteOffset, e3.byteLength) : new Uint8Array(e3);
    }
    var ft = (ht.prototype._trans = function(e3, r3, t3) {
      var n4 = this._tx || me.trans, i3 = this.name, o3 = ie && "undefined" != typeof console && console.createTask && console.createTask("Dexie: ".concat("readonly" === e3 ? "read" : "write", " ").concat(this.name));
      function a3(e4, t4, n5) {
        if (!n5.schema[i3]) throw new Y.NotFound("Table " + i3 + " not part of transaction");
        return r3(n5.idbtrans, n5);
      }
      var u3 = je();
      try {
        var s3 = n4 && n4.db._novip === this.db._novip ? n4 === me.trans ? n4._promise(e3, a3, t3) : Ne(function() {
          return n4._promise(e3, a3, t3);
        }, { trans: n4, transless: me.transless || me }) : function t4(n5, r4, i4, o4) {
          if (n5.idbdb && (n5._state.openComplete || me.letThrough || n5._vip)) {
            var a4 = n5._createTransaction(r4, i4, n5._dbSchema);
            try {
              a4.create(), n5._state.PR1398_maxLoop = 3;
            } catch (e4) {
              return e4.name === z.InvalidState && n5.isOpen() && 0 < --n5._state.PR1398_maxLoop ? (console.warn("Dexie: Need to reopen db"), n5.close({ disableAutoOpen: false }), n5.open().then(function() {
                return t4(n5, r4, i4, o4);
              })) : Xe(e4);
            }
            return a4._promise(r4, function(e4, t5) {
              return Ne(function() {
                return me.trans = a4, o4(e4, t5, a4);
              });
            }).then(function(e4) {
              if ("readwrite" === r4) try {
                a4.idbtrans.commit();
              } catch (e5) {
              }
              return "readonly" === r4 ? e4 : a4._completion.then(function() {
                return e4;
              });
            });
          }
          if (n5._state.openComplete) return Xe(new Y.DatabaseClosed(n5._state.dbOpenError));
          if (!n5._state.isBeingOpened) {
            if (!n5._state.autoOpen) return Xe(new Y.DatabaseClosed());
            n5.open().catch(G);
          }
          return n5._state.dbReadyPromise.then(function() {
            return t4(n5, r4, i4, o4);
          });
        }(this.db, e3, [this.name], a3);
        return o3 && (s3._consoleTask = o3, s3 = s3.catch(function(e4) {
          return console.trace(e4), Xe(e4);
        })), s3;
      } finally {
        u3 && Ae();
      }
    }, ht.prototype.get = function(t3, e3) {
      var n4 = this;
      return t3 && t3.constructor === Object ? this.where(t3).first(e3) : null == t3 ? Xe(new Y.Type("Invalid argument to Table.get()")) : this._trans("readonly", function(e4) {
        return n4.core.get({ trans: e4, key: t3 }).then(function(e5) {
          return n4.hook.reading.fire(e5);
        });
      }).then(e3);
    }, ht.prototype.where = function(o3) {
      if ("string" == typeof o3) return new this.db.WhereClause(this, o3);
      if (x2(o3)) return new this.db.WhereClause(this, "[".concat(o3.join("+"), "]"));
      var n4 = _2(o3);
      if (1 === n4.length) return this.where(n4[0]).equals(o3[n4[0]]);
      var e3 = this.schema.indexes.concat(this.schema.primKey).filter(function(t4) {
        if (t4.compound && n4.every(function(e5) {
          return 0 <= t4.keyPath.indexOf(e5);
        })) {
          for (var e4 = 0; e4 < n4.length; ++e4) if (-1 === n4.indexOf(t4.keyPath[e4])) return false;
          return true;
        }
        return false;
      }).sort(function(e4, t4) {
        return e4.keyPath.length - t4.keyPath.length;
      })[0];
      if (e3 && this.db._maxKey !== He) {
        var t3 = e3.keyPath.slice(0, n4.length);
        return this.where(t3).equals(t3.map(function(e4) {
          return o3[e4];
        }));
      }
      !e3 && ie && console.warn("The query ".concat(JSON.stringify(o3), " on ").concat(this.name, " would benefit from a ") + "compound index [".concat(n4.join("+"), "]"));
      var a3 = this.schema.idxByName, r3 = this.db._deps.indexedDB;
      function u3(e4, t4) {
        return 0 === r3.cmp(e4, t4);
      }
      var i3 = n4.reduce(function(e4, t4) {
        var n5 = e4[0], r4 = e4[1], e4 = a3[t4], i4 = o3[t4];
        return [n5 || e4, n5 || !e4 ? it(r4, e4 && e4.multi ? function(e5) {
          e5 = k2(e5, t4);
          return x2(e5) && e5.some(function(e6) {
            return u3(i4, e6);
          });
        } : function(e5) {
          return u3(i4, k2(e5, t4));
        }) : r4];
      }, [null, null]), t3 = i3[0], i3 = i3[1];
      return t3 ? this.where(t3.name).equals(o3[t3.keyPath]).filter(i3) : e3 ? this.filter(i3) : this.where(n4).equals("");
    }, ht.prototype.filter = function(e3) {
      return this.toCollection().and(e3);
    }, ht.prototype.count = function(e3) {
      return this.toCollection().count(e3);
    }, ht.prototype.offset = function(e3) {
      return this.toCollection().offset(e3);
    }, ht.prototype.limit = function(e3) {
      return this.toCollection().limit(e3);
    }, ht.prototype.each = function(e3) {
      return this.toCollection().each(e3);
    }, ht.prototype.toArray = function(e3) {
      return this.toCollection().toArray(e3);
    }, ht.prototype.toCollection = function() {
      return new this.db.Collection(new this.db.WhereClause(this));
    }, ht.prototype.orderBy = function(e3) {
      return new this.db.Collection(new this.db.WhereClause(this, x2(e3) ? "[".concat(e3.join("+"), "]") : e3));
    }, ht.prototype.reverse = function() {
      return this.toCollection().reverse();
    }, ht.prototype.mapToClass = function(r3) {
      var e3, t3 = this.db, n4 = this.name;
      function i3() {
        return null !== e3 && e3.apply(this, arguments) || this;
      }
      (this.schema.mappedClass = r3).prototype instanceof ut && (function(e4, t4) {
        if ("function" != typeof t4 && null !== t4) throw new TypeError("Class extends value " + String(t4) + " is not a constructor or null");
        function n5() {
          this.constructor = e4;
        }
        s2(e4, t4), e4.prototype = null === t4 ? Object.create(t4) : (n5.prototype = t4.prototype, new n5());
      }(i3, e3 = r3), Object.defineProperty(i3.prototype, "db", { get: function() {
        return t3;
      }, enumerable: false, configurable: true }), i3.prototype.table = function() {
        return n4;
      }, r3 = i3);
      for (var o3 = /* @__PURE__ */ new Set(), a3 = r3.prototype; a3; a3 = c2(a3)) Object.getOwnPropertyNames(a3).forEach(function(e4) {
        return o3.add(e4);
      });
      function u3(e4) {
        if (!e4) return e4;
        var t4, n5 = Object.create(r3.prototype);
        for (t4 in e4) if (!o3.has(t4)) try {
          n5[t4] = e4[t4];
        } catch (e5) {
        }
        return n5;
      }
      return this.schema.readHook && this.hook.reading.unsubscribe(this.schema.readHook), this.schema.readHook = u3, this.hook("reading", u3), r3;
    }, ht.prototype.defineClass = function() {
      return this.mapToClass(function(e3) {
        a2(this, e3);
      });
    }, ht.prototype.add = function(t3, n4) {
      var r3 = this, e3 = this.schema.primKey, i3 = e3.auto, o3 = e3.keyPath, a3 = t3;
      return o3 && i3 && (a3 = at(o3)(t3)), this._trans("readwrite", function(e4) {
        return r3.core.mutate({ trans: e4, type: "add", keys: null != n4 ? [n4] : null, values: [a3] });
      }).then(function(e4) {
        return e4.numFailures ? _e.reject(e4.failures[0]) : e4.lastResult;
      }).then(function(e4) {
        if (o3) try {
          P2(t3, o3, e4);
        } catch (e5) {
        }
        return e4;
      });
    }, ht.prototype.update = function(e3, t3) {
      if ("object" != typeof e3 || x2(e3)) return this.where(":id").equals(e3).modify(t3);
      e3 = k2(e3, this.schema.primKey.keyPath);
      return void 0 === e3 ? Xe(new Y.InvalidArgument("Given object does not contain its primary key")) : this.where(":id").equals(e3).modify(t3);
    }, ht.prototype.put = function(t3, n4) {
      var r3 = this, e3 = this.schema.primKey, i3 = e3.auto, o3 = e3.keyPath, a3 = t3;
      return o3 && i3 && (a3 = at(o3)(t3)), this._trans("readwrite", function(e4) {
        return r3.core.mutate({ trans: e4, type: "put", values: [a3], keys: null != n4 ? [n4] : null });
      }).then(function(e4) {
        return e4.numFailures ? _e.reject(e4.failures[0]) : e4.lastResult;
      }).then(function(e4) {
        if (o3) try {
          P2(t3, o3, e4);
        } catch (e5) {
        }
        return e4;
      });
    }, ht.prototype.delete = function(t3) {
      var n4 = this;
      return this._trans("readwrite", function(e3) {
        return n4.core.mutate({ trans: e3, type: "delete", keys: [t3] });
      }).then(function(e3) {
        return e3.numFailures ? _e.reject(e3.failures[0]) : void 0;
      });
    }, ht.prototype.clear = function() {
      var t3 = this;
      return this._trans("readwrite", function(e3) {
        return t3.core.mutate({ trans: e3, type: "deleteRange", range: ot });
      }).then(function(e3) {
        return e3.numFailures ? _e.reject(e3.failures[0]) : void 0;
      });
    }, ht.prototype.bulkGet = function(t3) {
      var n4 = this;
      return this._trans("readonly", function(e3) {
        return n4.core.getMany({ keys: t3, trans: e3 }).then(function(e4) {
          return e4.map(function(e5) {
            return n4.hook.reading.fire(e5);
          });
        });
      });
    }, ht.prototype.bulkAdd = function(r3, e3, t3) {
      var o3 = this, a3 = Array.isArray(e3) ? e3 : void 0, u3 = (t3 = t3 || (a3 ? void 0 : e3)) ? t3.allKeys : void 0;
      return this._trans("readwrite", function(e4) {
        var t4 = o3.schema.primKey, n4 = t4.auto, t4 = t4.keyPath;
        if (t4 && a3) throw new Y.InvalidArgument("bulkAdd(): keys argument invalid on tables with inbound keys");
        if (a3 && a3.length !== r3.length) throw new Y.InvalidArgument("Arguments objects and keys must have the same length");
        var i3 = r3.length, t4 = t4 && n4 ? r3.map(at(t4)) : r3;
        return o3.core.mutate({ trans: e4, type: "add", keys: a3, values: t4, wantResults: u3 }).then(function(e5) {
          var t5 = e5.numFailures, n5 = e5.results, r4 = e5.lastResult, e5 = e5.failures;
          if (0 === t5) return u3 ? n5 : r4;
          throw new V2("".concat(o3.name, ".bulkAdd(): ").concat(t5, " of ").concat(i3, " operations failed"), e5);
        });
      });
    }, ht.prototype.bulkPut = function(r3, e3, t3) {
      var o3 = this, a3 = Array.isArray(e3) ? e3 : void 0, u3 = (t3 = t3 || (a3 ? void 0 : e3)) ? t3.allKeys : void 0;
      return this._trans("readwrite", function(e4) {
        var t4 = o3.schema.primKey, n4 = t4.auto, t4 = t4.keyPath;
        if (t4 && a3) throw new Y.InvalidArgument("bulkPut(): keys argument invalid on tables with inbound keys");
        if (a3 && a3.length !== r3.length) throw new Y.InvalidArgument("Arguments objects and keys must have the same length");
        var i3 = r3.length, t4 = t4 && n4 ? r3.map(at(t4)) : r3;
        return o3.core.mutate({ trans: e4, type: "put", keys: a3, values: t4, wantResults: u3 }).then(function(e5) {
          var t5 = e5.numFailures, n5 = e5.results, r4 = e5.lastResult, e5 = e5.failures;
          if (0 === t5) return u3 ? n5 : r4;
          throw new V2("".concat(o3.name, ".bulkPut(): ").concat(t5, " of ").concat(i3, " operations failed"), e5);
        });
      });
    }, ht.prototype.bulkUpdate = function(t3) {
      var h3 = this, n4 = this.core, r3 = t3.map(function(e3) {
        return e3.key;
      }), i3 = t3.map(function(e3) {
        return e3.changes;
      }), d3 = [];
      return this._trans("readwrite", function(e3) {
        return n4.getMany({ trans: e3, keys: r3, cache: "clone" }).then(function(c3) {
          var l3 = [], f3 = [];
          t3.forEach(function(e4, t4) {
            var n5 = e4.key, r4 = e4.changes, i4 = c3[t4];
            if (i4) {
              for (var o3 = 0, a3 = Object.keys(r4); o3 < a3.length; o3++) {
                var u3 = a3[o3], s4 = r4[u3];
                if (u3 === h3.schema.primKey.keyPath) {
                  if (0 !== st(s4, n5)) throw new Y.Constraint("Cannot update primary key in bulkUpdate()");
                } else P2(i4, u3, s4);
              }
              d3.push(t4), l3.push(n5), f3.push(i4);
            }
          });
          var s3 = l3.length;
          return n4.mutate({ trans: e3, type: "put", keys: l3, values: f3, updates: { keys: r3, changeSpecs: i3 } }).then(function(e4) {
            var t4 = e4.numFailures, n5 = e4.failures;
            if (0 === t4) return s3;
            for (var r4 = 0, i4 = Object.keys(n5); r4 < i4.length; r4++) {
              var o3, a3 = i4[r4], u3 = d3[Number(a3)];
              null != u3 && (o3 = n5[a3], delete n5[a3], n5[u3] = o3);
            }
            throw new V2("".concat(h3.name, ".bulkUpdate(): ").concat(t4, " of ").concat(s3, " operations failed"), n5);
          });
        });
      });
    }, ht.prototype.bulkDelete = function(t3) {
      var r3 = this, i3 = t3.length;
      return this._trans("readwrite", function(e3) {
        return r3.core.mutate({ trans: e3, type: "delete", keys: t3 });
      }).then(function(e3) {
        var t4 = e3.numFailures, n4 = e3.lastResult, e3 = e3.failures;
        if (0 === t4) return n4;
        throw new V2("".concat(r3.name, ".bulkDelete(): ").concat(t4, " of ").concat(i3, " operations failed"), e3);
      });
    }, ht);
    function ht() {
    }
    function dt(i3) {
      function t3(e4, t4) {
        if (t4) {
          for (var n5 = arguments.length, r3 = new Array(n5 - 1); --n5; ) r3[n5 - 1] = arguments[n5];
          return a3[e4].subscribe.apply(null, r3), i3;
        }
        if ("string" == typeof e4) return a3[e4];
      }
      var a3 = {};
      t3.addEventType = u3;
      for (var e3 = 1, n4 = arguments.length; e3 < n4; ++e3) u3(arguments[e3]);
      return t3;
      function u3(e4, n5, r3) {
        if ("object" != typeof e4) {
          var i4;
          n5 = n5 || ne;
          var o3 = { subscribers: [], fire: r3 = r3 || G, subscribe: function(e5) {
            -1 === o3.subscribers.indexOf(e5) && (o3.subscribers.push(e5), o3.fire = n5(o3.fire, e5));
          }, unsubscribe: function(t4) {
            o3.subscribers = o3.subscribers.filter(function(e5) {
              return e5 !== t4;
            }), o3.fire = o3.subscribers.reduce(n5, r3);
          } };
          return a3[e4] = t3[e4] = o3;
        }
        _2(i4 = e4).forEach(function(e5) {
          var t4 = i4[e5];
          if (x2(t4)) u3(e5, i4[e5][0], i4[e5][1]);
          else {
            if ("asap" !== t4) throw new Y.InvalidArgument("Invalid event config");
            var n6 = u3(e5, X, function() {
              for (var e6 = arguments.length, t5 = new Array(e6); e6--; ) t5[e6] = arguments[e6];
              n6.subscribers.forEach(function(e7) {
                v2(function() {
                  e7.apply(null, t5);
                });
              });
            });
          }
        });
      }
    }
    function pt(e3, t3) {
      return o2(t3).from({ prototype: e3 }), t3;
    }
    function yt(e3, t3) {
      return !(e3.filter || e3.algorithm || e3.or) && (t3 ? e3.justLimit : !e3.replayFilter);
    }
    function vt(e3, t3) {
      e3.filter = it(e3.filter, t3);
    }
    function mt(e3, t3, n4) {
      var r3 = e3.replayFilter;
      e3.replayFilter = r3 ? function() {
        return it(r3(), t3());
      } : t3, e3.justLimit = n4 && !r3;
    }
    function bt(e3, t3) {
      if (e3.isPrimKey) return t3.primaryKey;
      var n4 = t3.getIndexByKeyPath(e3.index);
      if (!n4) throw new Y.Schema("KeyPath " + e3.index + " on object store " + t3.name + " is not indexed");
      return n4;
    }
    function gt(e3, t3, n4) {
      var r3 = bt(e3, t3.schema);
      return t3.openCursor({ trans: n4, values: !e3.keysOnly, reverse: "prev" === e3.dir, unique: !!e3.unique, query: { index: r3, range: e3.range } });
    }
    function wt(e3, o3, t3, n4) {
      var a3 = e3.replayFilter ? it(e3.filter, e3.replayFilter()) : e3.filter;
      if (e3.or) {
        var u3 = {}, r3 = function(e4, t4, n5) {
          var r4, i3;
          a3 && !a3(t4, n5, function(e5) {
            return t4.stop(e5);
          }, function(e5) {
            return t4.fail(e5);
          }) || ("[object ArrayBuffer]" === (i3 = "" + (r4 = t4.primaryKey)) && (i3 = "" + new Uint8Array(r4)), m2(u3, i3) || (u3[i3] = true, o3(e4, t4, n5)));
        };
        return Promise.all([e3.or._iterate(r3, t3), _t(gt(e3, n4, t3), e3.algorithm, r3, !e3.keysOnly && e3.valueMapper)]);
      }
      return _t(gt(e3, n4, t3), it(e3.algorithm, a3), o3, !e3.keysOnly && e3.valueMapper);
    }
    function _t(e3, r3, i3, o3) {
      var a3 = Te(o3 ? function(e4, t3, n4) {
        return i3(o3(e4), t3, n4);
      } : i3);
      return e3.then(function(n4) {
        if (n4) return n4.start(function() {
          var t3 = function() {
            return n4.continue();
          };
          r3 && !r3(n4, function(e4) {
            return t3 = e4;
          }, function(e4) {
            n4.stop(e4), t3 = G;
          }, function(e4) {
            n4.fail(e4), t3 = G;
          }) || a3(n4.value, n4, function(e4) {
            return t3 = e4;
          }), t3();
        });
      });
    }
    var e2 = Symbol(), xt = (kt.prototype.execute = function(e3) {
      if (void 0 !== this.add) {
        var t3 = this.add;
        if (x2(t3)) return i2(i2([], x2(e3) ? e3 : [], true), t3).sort();
        if ("number" == typeof t3) return (Number(e3) || 0) + t3;
        if ("bigint" == typeof t3) try {
          return BigInt(e3) + t3;
        } catch (e4) {
          return BigInt(0) + t3;
        }
        throw new TypeError("Invalid term ".concat(t3));
      }
      if (void 0 !== this.remove) {
        var n4 = this.remove;
        if (x2(n4)) return x2(e3) ? e3.filter(function(e4) {
          return !n4.includes(e4);
        }).sort() : [];
        if ("number" == typeof n4) return Number(e3) - n4;
        if ("bigint" == typeof n4) try {
          return BigInt(e3) - n4;
        } catch (e4) {
          return BigInt(0) - n4;
        }
        throw new TypeError("Invalid subtrahend ".concat(n4));
      }
      t3 = null === (t3 = this.replacePrefix) || void 0 === t3 ? void 0 : t3[0];
      return t3 && "string" == typeof e3 && e3.startsWith(t3) ? this.replacePrefix[1] + e3.substring(t3.length) : e3;
    }, kt);
    function kt(e3) {
      Object.assign(this, e3);
    }
    var Ot = (Pt.prototype._read = function(e3, t3) {
      var n4 = this._ctx;
      return n4.error ? n4.table._trans(null, Xe.bind(null, n4.error)) : n4.table._trans("readonly", e3).then(t3);
    }, Pt.prototype._write = function(e3) {
      var t3 = this._ctx;
      return t3.error ? t3.table._trans(null, Xe.bind(null, t3.error)) : t3.table._trans("readwrite", e3, "locked");
    }, Pt.prototype._addAlgorithm = function(e3) {
      var t3 = this._ctx;
      t3.algorithm = it(t3.algorithm, e3);
    }, Pt.prototype._iterate = function(e3, t3) {
      return wt(this._ctx, e3, t3, this._ctx.table.core);
    }, Pt.prototype.clone = function(e3) {
      var t3 = Object.create(this.constructor.prototype), n4 = Object.create(this._ctx);
      return e3 && a2(n4, e3), t3._ctx = n4, t3;
    }, Pt.prototype.raw = function() {
      return this._ctx.valueMapper = null, this;
    }, Pt.prototype.each = function(t3) {
      var n4 = this._ctx;
      return this._read(function(e3) {
        return wt(n4, t3, e3, n4.table.core);
      });
    }, Pt.prototype.count = function(e3) {
      var i3 = this;
      return this._read(function(e4) {
        var t3 = i3._ctx, n4 = t3.table.core;
        if (yt(t3, true)) return n4.count({ trans: e4, query: { index: bt(t3, n4.schema), range: t3.range } }).then(function(e5) {
          return Math.min(e5, t3.limit);
        });
        var r3 = 0;
        return wt(t3, function() {
          return ++r3, false;
        }, e4, n4).then(function() {
          return r3;
        });
      }).then(e3);
    }, Pt.prototype.sortBy = function(e3, t3) {
      var n4 = e3.split(".").reverse(), r3 = n4[0], i3 = n4.length - 1;
      function o3(e4, t4) {
        return t4 ? o3(e4[n4[t4]], t4 - 1) : e4[r3];
      }
      var a3 = "next" === this._ctx.dir ? 1 : -1;
      function u3(e4, t4) {
        e4 = o3(e4, i3), t4 = o3(t4, i3);
        return e4 < t4 ? -a3 : t4 < e4 ? a3 : 0;
      }
      return this.toArray(function(e4) {
        return e4.sort(u3);
      }).then(t3);
    }, Pt.prototype.toArray = function(e3) {
      var o3 = this;
      return this._read(function(e4) {
        var t3 = o3._ctx;
        if ("next" === t3.dir && yt(t3, true) && 0 < t3.limit) {
          var n4 = t3.valueMapper, r3 = bt(t3, t3.table.core.schema);
          return t3.table.core.query({ trans: e4, limit: t3.limit, values: true, query: { index: r3, range: t3.range } }).then(function(e5) {
            e5 = e5.result;
            return n4 ? e5.map(n4) : e5;
          });
        }
        var i3 = [];
        return wt(t3, function(e5) {
          return i3.push(e5);
        }, e4, t3.table.core).then(function() {
          return i3;
        });
      }, e3);
    }, Pt.prototype.offset = function(t3) {
      var e3 = this._ctx;
      return t3 <= 0 || (e3.offset += t3, yt(e3) ? mt(e3, function() {
        var n4 = t3;
        return function(e4, t4) {
          return 0 === n4 || (1 === n4 ? --n4 : t4(function() {
            e4.advance(n4), n4 = 0;
          }), false);
        };
      }) : mt(e3, function() {
        var e4 = t3;
        return function() {
          return --e4 < 0;
        };
      })), this;
    }, Pt.prototype.limit = function(e3) {
      return this._ctx.limit = Math.min(this._ctx.limit, e3), mt(this._ctx, function() {
        var r3 = e3;
        return function(e4, t3, n4) {
          return --r3 <= 0 && t3(n4), 0 <= r3;
        };
      }, true), this;
    }, Pt.prototype.until = function(r3, i3) {
      return vt(this._ctx, function(e3, t3, n4) {
        return !r3(e3.value) || (t3(n4), i3);
      }), this;
    }, Pt.prototype.first = function(e3) {
      return this.limit(1).toArray(function(e4) {
        return e4[0];
      }).then(e3);
    }, Pt.prototype.last = function(e3) {
      return this.reverse().first(e3);
    }, Pt.prototype.filter = function(t3) {
      var e3;
      return vt(this._ctx, function(e4) {
        return t3(e4.value);
      }), (e3 = this._ctx).isMatch = it(e3.isMatch, t3), this;
    }, Pt.prototype.and = function(e3) {
      return this.filter(e3);
    }, Pt.prototype.or = function(e3) {
      return new this.db.WhereClause(this._ctx.table, e3, this);
    }, Pt.prototype.reverse = function() {
      return this._ctx.dir = "prev" === this._ctx.dir ? "next" : "prev", this._ondirectionchange && this._ondirectionchange(this._ctx.dir), this;
    }, Pt.prototype.desc = function() {
      return this.reverse();
    }, Pt.prototype.eachKey = function(n4) {
      var e3 = this._ctx;
      return e3.keysOnly = !e3.isMatch, this.each(function(e4, t3) {
        n4(t3.key, t3);
      });
    }, Pt.prototype.eachUniqueKey = function(e3) {
      return this._ctx.unique = "unique", this.eachKey(e3);
    }, Pt.prototype.eachPrimaryKey = function(n4) {
      var e3 = this._ctx;
      return e3.keysOnly = !e3.isMatch, this.each(function(e4, t3) {
        n4(t3.primaryKey, t3);
      });
    }, Pt.prototype.keys = function(e3) {
      var t3 = this._ctx;
      t3.keysOnly = !t3.isMatch;
      var n4 = [];
      return this.each(function(e4, t4) {
        n4.push(t4.key);
      }).then(function() {
        return n4;
      }).then(e3);
    }, Pt.prototype.primaryKeys = function(e3) {
      var n4 = this._ctx;
      if ("next" === n4.dir && yt(n4, true) && 0 < n4.limit) return this._read(function(e4) {
        var t3 = bt(n4, n4.table.core.schema);
        return n4.table.core.query({ trans: e4, values: false, limit: n4.limit, query: { index: t3, range: n4.range } });
      }).then(function(e4) {
        return e4.result;
      }).then(e3);
      n4.keysOnly = !n4.isMatch;
      var r3 = [];
      return this.each(function(e4, t3) {
        r3.push(t3.primaryKey);
      }).then(function() {
        return r3;
      }).then(e3);
    }, Pt.prototype.uniqueKeys = function(e3) {
      return this._ctx.unique = "unique", this.keys(e3);
    }, Pt.prototype.firstKey = function(e3) {
      return this.limit(1).keys(function(e4) {
        return e4[0];
      }).then(e3);
    }, Pt.prototype.lastKey = function(e3) {
      return this.reverse().firstKey(e3);
    }, Pt.prototype.distinct = function() {
      var e3 = this._ctx, e3 = e3.index && e3.table.schema.idxByName[e3.index];
      if (!e3 || !e3.multi) return this;
      var n4 = {};
      return vt(this._ctx, function(e4) {
        var t3 = e4.primaryKey.toString(), e4 = m2(n4, t3);
        return n4[t3] = true, !e4;
      }), this;
    }, Pt.prototype.modify = function(w3) {
      var n4 = this, r3 = this._ctx;
      return this._write(function(d3) {
        var a3, u3, p3;
        p3 = "function" == typeof w3 ? w3 : (a3 = _2(w3), u3 = a3.length, function(e4) {
          for (var t4 = false, n5 = 0; n5 < u3; ++n5) {
            var r4 = a3[n5], i3 = w3[r4], o3 = k2(e4, r4);
            i3 instanceof xt ? (P2(e4, r4, i3.execute(o3)), t4 = true) : o3 !== i3 && (P2(e4, r4, i3), t4 = true);
          }
          return t4;
        });
        function y3(e4, t4) {
          var n5 = t4.failures, t4 = t4.numFailures;
          c3 += e4 - t4;
          for (var r4 = 0, i3 = _2(n5); r4 < i3.length; r4++) {
            var o3 = i3[r4];
            s3.push(n5[o3]);
          }
        }
        var v3 = r3.table.core, e3 = v3.schema.primaryKey, m3 = e3.outbound, b3 = e3.extractKey, g3 = n4.db._options.modifyChunkSize || 200, s3 = [], c3 = 0, t3 = [];
        return n4.clone().primaryKeys().then(function(l3) {
          function f3(s4) {
            var c4 = Math.min(g3, l3.length - s4);
            return v3.getMany({ trans: d3, keys: l3.slice(s4, s4 + c4), cache: "immutable" }).then(function(e4) {
              for (var n5 = [], t4 = [], r4 = m3 ? [] : null, i3 = [], o3 = 0; o3 < c4; ++o3) {
                var a4 = e4[o3], u4 = { value: S2(a4), primKey: l3[s4 + o3] };
                false !== p3.call(u4, u4.value, u4) && (null == u4.value ? i3.push(l3[s4 + o3]) : m3 || 0 === st(b3(a4), b3(u4.value)) ? (t4.push(u4.value), m3 && r4.push(l3[s4 + o3])) : (i3.push(l3[s4 + o3]), n5.push(u4.value)));
              }
              return Promise.resolve(0 < n5.length && v3.mutate({ trans: d3, type: "add", values: n5 }).then(function(e5) {
                for (var t5 in e5.failures) i3.splice(parseInt(t5), 1);
                y3(n5.length, e5);
              })).then(function() {
                return (0 < t4.length || h3 && "object" == typeof w3) && v3.mutate({ trans: d3, type: "put", keys: r4, values: t4, criteria: h3, changeSpec: "function" != typeof w3 && w3, isAdditionalChunk: 0 < s4 }).then(function(e5) {
                  return y3(t4.length, e5);
                });
              }).then(function() {
                return (0 < i3.length || h3 && w3 === Et) && v3.mutate({ trans: d3, type: "delete", keys: i3, criteria: h3, isAdditionalChunk: 0 < s4 }).then(function(e5) {
                  return y3(i3.length, e5);
                });
              }).then(function() {
                return l3.length > s4 + c4 && f3(s4 + g3);
              });
            });
          }
          var h3 = yt(r3) && r3.limit === 1 / 0 && ("function" != typeof w3 || w3 === Et) && { index: r3.index, range: r3.range };
          return f3(0).then(function() {
            if (0 < s3.length) throw new U("Error modifying one or more objects", s3, c3, t3);
            return l3.length;
          });
        });
      });
    }, Pt.prototype.delete = function() {
      var i3 = this._ctx, n4 = i3.range;
      return yt(i3) && (i3.isPrimKey || 3 === n4.type) ? this._write(function(e3) {
        var t3 = i3.table.core.schema.primaryKey, r3 = n4;
        return i3.table.core.count({ trans: e3, query: { index: t3, range: r3 } }).then(function(n5) {
          return i3.table.core.mutate({ trans: e3, type: "deleteRange", range: r3 }).then(function(e4) {
            var t4 = e4.failures;
            e4.lastResult, e4.results;
            e4 = e4.numFailures;
            if (e4) throw new U("Could not delete some values", Object.keys(t4).map(function(e5) {
              return t4[e5];
            }), n5 - e4);
            return n5 - e4;
          });
        });
      }) : this.modify(Et);
    }, Pt);
    function Pt() {
    }
    var Et = function(e3, t3) {
      return t3.value = null;
    };
    function Kt(e3, t3) {
      return e3 < t3 ? -1 : e3 === t3 ? 0 : 1;
    }
    function St(e3, t3) {
      return t3 < e3 ? -1 : e3 === t3 ? 0 : 1;
    }
    function jt(e3, t3, n4) {
      e3 = e3 instanceof qt ? new e3.Collection(e3) : e3;
      return e3._ctx.error = new (n4 || TypeError)(t3), e3;
    }
    function At(e3) {
      return new e3.Collection(e3, function() {
        return Tt("");
      }).limit(0);
    }
    function Ct(e3, s3, n4, r3) {
      var i3, c3, l3, f3, h3, d3, p3, y3 = n4.length;
      if (!n4.every(function(e4) {
        return "string" == typeof e4;
      })) return jt(e3, Ze);
      function t3(e4) {
        i3 = "next" === e4 ? function(e5) {
          return e5.toUpperCase();
        } : function(e5) {
          return e5.toLowerCase();
        }, c3 = "next" === e4 ? function(e5) {
          return e5.toLowerCase();
        } : function(e5) {
          return e5.toUpperCase();
        }, l3 = "next" === e4 ? Kt : St;
        var t4 = n4.map(function(e5) {
          return { lower: c3(e5), upper: i3(e5) };
        }).sort(function(e5, t5) {
          return l3(e5.lower, t5.lower);
        });
        f3 = t4.map(function(e5) {
          return e5.upper;
        }), h3 = t4.map(function(e5) {
          return e5.lower;
        }), p3 = "next" === (d3 = e4) ? "" : r3;
      }
      t3("next");
      e3 = new e3.Collection(e3, function() {
        return Dt(f3[0], h3[y3 - 1] + r3);
      });
      e3._ondirectionchange = function(e4) {
        t3(e4);
      };
      var v3 = 0;
      return e3._addAlgorithm(function(e4, t4, n5) {
        var r4 = e4.key;
        if ("string" != typeof r4) return false;
        var i4 = c3(r4);
        if (s3(i4, h3, v3)) return true;
        for (var o3 = null, a3 = v3; a3 < y3; ++a3) {
          var u3 = function(e5, t5, n6, r5, i5, o4) {
            for (var a4 = Math.min(e5.length, r5.length), u4 = -1, s4 = 0; s4 < a4; ++s4) {
              var c4 = t5[s4];
              if (c4 !== r5[s4]) return i5(e5[s4], n6[s4]) < 0 ? e5.substr(0, s4) + n6[s4] + n6.substr(s4 + 1) : i5(e5[s4], r5[s4]) < 0 ? e5.substr(0, s4) + r5[s4] + n6.substr(s4 + 1) : 0 <= u4 ? e5.substr(0, u4) + t5[u4] + n6.substr(u4 + 1) : null;
              i5(e5[s4], c4) < 0 && (u4 = s4);
            }
            return a4 < r5.length && "next" === o4 ? e5 + n6.substr(e5.length) : a4 < e5.length && "prev" === o4 ? e5.substr(0, n6.length) : u4 < 0 ? null : e5.substr(0, u4) + r5[u4] + n6.substr(u4 + 1);
          }(r4, i4, f3[a3], h3[a3], l3, d3);
          null === u3 && null === o3 ? v3 = a3 + 1 : (null === o3 || 0 < l3(o3, u3)) && (o3 = u3);
        }
        return t4(null !== o3 ? function() {
          e4.continue(o3 + p3);
        } : n5), false;
      }), e3;
    }
    function Dt(e3, t3, n4, r3) {
      return { type: 2, lower: e3, upper: t3, lowerOpen: n4, upperOpen: r3 };
    }
    function Tt(e3) {
      return { type: 1, lower: e3, upper: e3 };
    }
    var qt = (Object.defineProperty(It.prototype, "Collection", { get: function() {
      return this._ctx.table.db.Collection;
    }, enumerable: false, configurable: true }), It.prototype.between = function(e3, t3, n4, r3) {
      n4 = false !== n4, r3 = true === r3;
      try {
        return 0 < this._cmp(e3, t3) || 0 === this._cmp(e3, t3) && (n4 || r3) && (!n4 || !r3) ? At(this) : new this.Collection(this, function() {
          return Dt(e3, t3, !n4, !r3);
        });
      } catch (e4) {
        return jt(this, Je);
      }
    }, It.prototype.equals = function(e3) {
      return null == e3 ? jt(this, Je) : new this.Collection(this, function() {
        return Tt(e3);
      });
    }, It.prototype.above = function(e3) {
      return null == e3 ? jt(this, Je) : new this.Collection(this, function() {
        return Dt(e3, void 0, true);
      });
    }, It.prototype.aboveOrEqual = function(e3) {
      return null == e3 ? jt(this, Je) : new this.Collection(this, function() {
        return Dt(e3, void 0, false);
      });
    }, It.prototype.below = function(e3) {
      return null == e3 ? jt(this, Je) : new this.Collection(this, function() {
        return Dt(void 0, e3, false, true);
      });
    }, It.prototype.belowOrEqual = function(e3) {
      return null == e3 ? jt(this, Je) : new this.Collection(this, function() {
        return Dt(void 0, e3);
      });
    }, It.prototype.startsWith = function(e3) {
      return "string" != typeof e3 ? jt(this, Ze) : this.between(e3, e3 + He, true, true);
    }, It.prototype.startsWithIgnoreCase = function(e3) {
      return "" === e3 ? this.startsWith(e3) : Ct(this, function(e4, t3) {
        return 0 === e4.indexOf(t3[0]);
      }, [e3], He);
    }, It.prototype.equalsIgnoreCase = function(e3) {
      return Ct(this, function(e4, t3) {
        return e4 === t3[0];
      }, [e3], "");
    }, It.prototype.anyOfIgnoreCase = function() {
      var e3 = I2.apply(q, arguments);
      return 0 === e3.length ? At(this) : Ct(this, function(e4, t3) {
        return -1 !== t3.indexOf(e4);
      }, e3, "");
    }, It.prototype.startsWithAnyOfIgnoreCase = function() {
      var e3 = I2.apply(q, arguments);
      return 0 === e3.length ? At(this) : Ct(this, function(t3, e4) {
        return e4.some(function(e5) {
          return 0 === t3.indexOf(e5);
        });
      }, e3, He);
    }, It.prototype.anyOf = function() {
      var t3 = this, i3 = I2.apply(q, arguments), o3 = this._cmp;
      try {
        i3.sort(o3);
      } catch (e4) {
        return jt(this, Je);
      }
      if (0 === i3.length) return At(this);
      var e3 = new this.Collection(this, function() {
        return Dt(i3[0], i3[i3.length - 1]);
      });
      e3._ondirectionchange = function(e4) {
        o3 = "next" === e4 ? t3._ascending : t3._descending, i3.sort(o3);
      };
      var a3 = 0;
      return e3._addAlgorithm(function(e4, t4, n4) {
        for (var r3 = e4.key; 0 < o3(r3, i3[a3]); ) if (++a3 === i3.length) return t4(n4), false;
        return 0 === o3(r3, i3[a3]) || (t4(function() {
          e4.continue(i3[a3]);
        }), false);
      }), e3;
    }, It.prototype.notEqual = function(e3) {
      return this.inAnyRange([[-1 / 0, e3], [e3, this.db._maxKey]], { includeLowers: false, includeUppers: false });
    }, It.prototype.noneOf = function() {
      var e3 = I2.apply(q, arguments);
      if (0 === e3.length) return new this.Collection(this);
      try {
        e3.sort(this._ascending);
      } catch (e4) {
        return jt(this, Je);
      }
      var t3 = e3.reduce(function(e4, t4) {
        return e4 ? e4.concat([[e4[e4.length - 1][1], t4]]) : [[-1 / 0, t4]];
      }, null);
      return t3.push([e3[e3.length - 1], this.db._maxKey]), this.inAnyRange(t3, { includeLowers: false, includeUppers: false });
    }, It.prototype.inAnyRange = function(e3, t3) {
      var o3 = this, a3 = this._cmp, u3 = this._ascending, n4 = this._descending, s3 = this._min, c3 = this._max;
      if (0 === e3.length) return At(this);
      if (!e3.every(function(e4) {
        return void 0 !== e4[0] && void 0 !== e4[1] && u3(e4[0], e4[1]) <= 0;
      })) return jt(this, "First argument to inAnyRange() must be an Array of two-value Arrays [lower,upper] where upper must not be lower than lower", Y.InvalidArgument);
      var r3 = !t3 || false !== t3.includeLowers, i3 = t3 && true === t3.includeUppers;
      var l3, f3 = u3;
      function h3(e4, t4) {
        return f3(e4[0], t4[0]);
      }
      try {
        (l3 = e3.reduce(function(e4, t4) {
          for (var n5 = 0, r4 = e4.length; n5 < r4; ++n5) {
            var i4 = e4[n5];
            if (a3(t4[0], i4[1]) < 0 && 0 < a3(t4[1], i4[0])) {
              i4[0] = s3(i4[0], t4[0]), i4[1] = c3(i4[1], t4[1]);
              break;
            }
          }
          return n5 === r4 && e4.push(t4), e4;
        }, [])).sort(h3);
      } catch (e4) {
        return jt(this, Je);
      }
      var d3 = 0, p3 = i3 ? function(e4) {
        return 0 < u3(e4, l3[d3][1]);
      } : function(e4) {
        return 0 <= u3(e4, l3[d3][1]);
      }, y3 = r3 ? function(e4) {
        return 0 < n4(e4, l3[d3][0]);
      } : function(e4) {
        return 0 <= n4(e4, l3[d3][0]);
      };
      var v3 = p3, e3 = new this.Collection(this, function() {
        return Dt(l3[0][0], l3[l3.length - 1][1], !r3, !i3);
      });
      return e3._ondirectionchange = function(e4) {
        f3 = "next" === e4 ? (v3 = p3, u3) : (v3 = y3, n4), l3.sort(h3);
      }, e3._addAlgorithm(function(e4, t4, n5) {
        for (var r4, i4 = e4.key; v3(i4); ) if (++d3 === l3.length) return t4(n5), false;
        return !p3(r4 = i4) && !y3(r4) || (0 === o3._cmp(i4, l3[d3][1]) || 0 === o3._cmp(i4, l3[d3][0]) || t4(function() {
          f3 === u3 ? e4.continue(l3[d3][0]) : e4.continue(l3[d3][1]);
        }), false);
      }), e3;
    }, It.prototype.startsWithAnyOf = function() {
      var e3 = I2.apply(q, arguments);
      return e3.every(function(e4) {
        return "string" == typeof e4;
      }) ? 0 === e3.length ? At(this) : this.inAnyRange(e3.map(function(e4) {
        return [e4, e4 + He];
      })) : jt(this, "startsWithAnyOf() only works with strings");
    }, It);
    function It() {
    }
    function Bt(t3) {
      return Te(function(e3) {
        return Rt(e3), t3(e3.target.error), false;
      });
    }
    function Rt(e3) {
      e3.stopPropagation && e3.stopPropagation(), e3.preventDefault && e3.preventDefault();
    }
    var Ft = "storagemutated", Mt = "x-storagemutated-1", Nt = dt(null, Ft), Lt = (Ut.prototype._lock = function() {
      return y2(!me.global), ++this._reculock, 1 !== this._reculock || me.global || (me.lockOwnerFor = this), this;
    }, Ut.prototype._unlock = function() {
      if (y2(!me.global), 0 == --this._reculock) for (me.global || (me.lockOwnerFor = null); 0 < this._blockedFuncs.length && !this._locked(); ) {
        var e3 = this._blockedFuncs.shift();
        try {
          $e(e3[1], e3[0]);
        } catch (e4) {
        }
      }
      return this;
    }, Ut.prototype._locked = function() {
      return this._reculock && me.lockOwnerFor !== this;
    }, Ut.prototype.create = function(t3) {
      var n4 = this;
      if (!this.mode) return this;
      var e3 = this.db.idbdb, r3 = this.db._state.dbOpenError;
      if (y2(!this.idbtrans), !t3 && !e3) switch (r3 && r3.name) {
        case "DatabaseClosedError":
          throw new Y.DatabaseClosed(r3);
        case "MissingAPIError":
          throw new Y.MissingAPI(r3.message, r3);
        default:
          throw new Y.OpenFailed(r3);
      }
      if (!this.active) throw new Y.TransactionInactive();
      return y2(null === this._completion._state), (t3 = this.idbtrans = t3 || (this.db.core || e3).transaction(this.storeNames, this.mode, { durability: this.chromeTransactionDurability })).onerror = Te(function(e4) {
        Rt(e4), n4._reject(t3.error);
      }), t3.onabort = Te(function(e4) {
        Rt(e4), n4.active && n4._reject(new Y.Abort(t3.error)), n4.active = false, n4.on("abort").fire(e4);
      }), t3.oncomplete = Te(function() {
        n4.active = false, n4._resolve(), "mutatedParts" in t3 && Nt.storagemutated.fire(t3.mutatedParts);
      }), this;
    }, Ut.prototype._promise = function(n4, r3, i3) {
      var o3 = this;
      if ("readwrite" === n4 && "readwrite" !== this.mode) return Xe(new Y.ReadOnly("Transaction is readonly"));
      if (!this.active) return Xe(new Y.TransactionInactive());
      if (this._locked()) return new _e(function(e4, t3) {
        o3._blockedFuncs.push([function() {
          o3._promise(n4, r3, i3).then(e4, t3);
        }, me]);
      });
      if (i3) return Ne(function() {
        var e4 = new _e(function(e5, t3) {
          o3._lock();
          var n5 = r3(e5, t3, o3);
          n5 && n5.then && n5.then(e5, t3);
        });
        return e4.finally(function() {
          return o3._unlock();
        }), e4._lib = true, e4;
      });
      var e3 = new _e(function(e4, t3) {
        var n5 = r3(e4, t3, o3);
        n5 && n5.then && n5.then(e4, t3);
      });
      return e3._lib = true, e3;
    }, Ut.prototype._root = function() {
      return this.parent ? this.parent._root() : this;
    }, Ut.prototype.waitFor = function(e3) {
      var t3, r3 = this._root(), i3 = _e.resolve(e3);
      r3._waitingFor ? r3._waitingFor = r3._waitingFor.then(function() {
        return i3;
      }) : (r3._waitingFor = i3, r3._waitingQueue = [], t3 = r3.idbtrans.objectStore(r3.storeNames[0]), function e4() {
        for (++r3._spinCount; r3._waitingQueue.length; ) r3._waitingQueue.shift()();
        r3._waitingFor && (t3.get(-1 / 0).onsuccess = e4);
      }());
      var o3 = r3._waitingFor;
      return new _e(function(t4, n4) {
        i3.then(function(e4) {
          return r3._waitingQueue.push(Te(t4.bind(null, e4)));
        }, function(e4) {
          return r3._waitingQueue.push(Te(n4.bind(null, e4)));
        }).finally(function() {
          r3._waitingFor === o3 && (r3._waitingFor = null);
        });
      });
    }, Ut.prototype.abort = function() {
      this.active && (this.active = false, this.idbtrans && this.idbtrans.abort(), this._reject(new Y.Abort()));
    }, Ut.prototype.table = function(e3) {
      var t3 = this._memoizedTables || (this._memoizedTables = {});
      if (m2(t3, e3)) return t3[e3];
      var n4 = this.schema[e3];
      if (!n4) throw new Y.NotFound("Table " + e3 + " not part of transaction");
      n4 = new this.db.Table(e3, n4, this);
      return n4.core = this.db.core.table(e3), t3[e3] = n4;
    }, Ut);
    function Ut() {
    }
    function Vt(e3, t3, n4, r3, i3, o3, a3) {
      return { name: e3, keyPath: t3, unique: n4, multi: r3, auto: i3, compound: o3, src: (n4 && !a3 ? "&" : "") + (r3 ? "*" : "") + (i3 ? "++" : "") + zt(t3) };
    }
    function zt(e3) {
      return "string" == typeof e3 ? e3 : e3 ? "[" + [].join.call(e3, "+") + "]" : "";
    }
    function Wt(e3, t3, n4) {
      return { name: e3, primKey: t3, indexes: n4, mappedClass: null, idxByName: (r3 = function(e4) {
        return [e4.name, e4];
      }, n4.reduce(function(e4, t4, n5) {
        n5 = r3(t4, n5);
        return n5 && (e4[n5[0]] = n5[1]), e4;
      }, {})) };
      var r3;
    }
    var Yt = function(e3) {
      try {
        return e3.only([[]]), Yt = function() {
          return [[]];
        }, [[]];
      } catch (e4) {
        return Yt = function() {
          return He;
        }, He;
      }
    };
    function $t(t3) {
      return null == t3 ? function() {
      } : "string" == typeof t3 ? 1 === (n4 = t3).split(".").length ? function(e3) {
        return e3[n4];
      } : function(e3) {
        return k2(e3, n4);
      } : function(e3) {
        return k2(e3, t3);
      };
      var n4;
    }
    function Qt(e3) {
      return [].slice.call(e3);
    }
    var Gt = 0;
    function Xt(e3) {
      return null == e3 ? ":id" : "string" == typeof e3 ? e3 : "[".concat(e3.join("+"), "]");
    }
    function Ht(e3, i3, t3) {
      function _3(e4) {
        if (3 === e4.type) return null;
        if (4 === e4.type) throw new Error("Cannot convert never type to IDBKeyRange");
        var t4 = e4.lower, n5 = e4.upper, r4 = e4.lowerOpen, e4 = e4.upperOpen;
        return void 0 === t4 ? void 0 === n5 ? null : i3.upperBound(n5, !!e4) : void 0 === n5 ? i3.lowerBound(t4, !!r4) : i3.bound(t4, n5, !!r4, !!e4);
      }
      function n4(e4) {
        var h3, w3 = e4.name;
        return { name: w3, schema: e4, mutate: function(e5) {
          var y3 = e5.trans, v3 = e5.type, m3 = e5.keys, b3 = e5.values, g3 = e5.range;
          return new Promise(function(t4, e6) {
            t4 = Te(t4);
            var n5 = y3.objectStore(w3), r4 = null == n5.keyPath, i4 = "put" === v3 || "add" === v3;
            if (!i4 && "delete" !== v3 && "deleteRange" !== v3) throw new Error("Invalid operation type: " + v3);
            var o4, a4 = (m3 || b3 || { length: 1 }).length;
            if (m3 && b3 && m3.length !== b3.length) throw new Error("Given keys array must have same length as given values array.");
            if (0 === a4) return t4({ numFailures: 0, failures: {}, results: [], lastResult: void 0 });
            function u4(e7) {
              ++l3, Rt(e7);
            }
            var s4 = [], c4 = [], l3 = 0;
            if ("deleteRange" === v3) {
              if (4 === g3.type) return t4({ numFailures: l3, failures: c4, results: [], lastResult: void 0 });
              3 === g3.type ? s4.push(o4 = n5.clear()) : s4.push(o4 = n5.delete(_3(g3)));
            } else {
              var r4 = i4 ? r4 ? [b3, m3] : [b3, null] : [m3, null], f3 = r4[0], h4 = r4[1];
              if (i4) for (var d3 = 0; d3 < a4; ++d3) s4.push(o4 = h4 && void 0 !== h4[d3] ? n5[v3](f3[d3], h4[d3]) : n5[v3](f3[d3])), o4.onerror = u4;
              else for (d3 = 0; d3 < a4; ++d3) s4.push(o4 = n5[v3](f3[d3])), o4.onerror = u4;
            }
            function p3(e7) {
              e7 = e7.target.result, s4.forEach(function(e8, t5) {
                return null != e8.error && (c4[t5] = e8.error);
              }), t4({ numFailures: l3, failures: c4, results: "delete" === v3 ? m3 : s4.map(function(e8) {
                return e8.result;
              }), lastResult: e7 });
            }
            o4.onerror = function(e7) {
              u4(e7), p3(e7);
            }, o4.onsuccess = p3;
          });
        }, getMany: function(e5) {
          var f3 = e5.trans, h4 = e5.keys;
          return new Promise(function(t4, e6) {
            t4 = Te(t4);
            for (var n5, r4 = f3.objectStore(w3), i4 = h4.length, o4 = new Array(i4), a4 = 0, u4 = 0, s4 = function(e7) {
              e7 = e7.target;
              o4[e7._pos] = e7.result, ++u4 === a4 && t4(o4);
            }, c4 = Bt(e6), l3 = 0; l3 < i4; ++l3) null != h4[l3] && ((n5 = r4.get(h4[l3]))._pos = l3, n5.onsuccess = s4, n5.onerror = c4, ++a4);
            0 === a4 && t4(o4);
          });
        }, get: function(e5) {
          var r4 = e5.trans, i4 = e5.key;
          return new Promise(function(t4, e6) {
            t4 = Te(t4);
            var n5 = r4.objectStore(w3).get(i4);
            n5.onsuccess = function(e7) {
              return t4(e7.target.result);
            }, n5.onerror = Bt(e6);
          });
        }, query: (h3 = s3, function(f3) {
          return new Promise(function(n5, e5) {
            n5 = Te(n5);
            var r4, i4, o4, t4 = f3.trans, a4 = f3.values, u4 = f3.limit, s4 = f3.query, c4 = u4 === 1 / 0 ? void 0 : u4, l3 = s4.index, s4 = s4.range, t4 = t4.objectStore(w3), l3 = l3.isPrimaryKey ? t4 : t4.index(l3.name), s4 = _3(s4);
            if (0 === u4) return n5({ result: [] });
            h3 ? ((c4 = a4 ? l3.getAll(s4, c4) : l3.getAllKeys(s4, c4)).onsuccess = function(e6) {
              return n5({ result: e6.target.result });
            }, c4.onerror = Bt(e5)) : (r4 = 0, i4 = !a4 && "openKeyCursor" in l3 ? l3.openKeyCursor(s4) : l3.openCursor(s4), o4 = [], i4.onsuccess = function(e6) {
              var t5 = i4.result;
              return t5 ? (o4.push(a4 ? t5.value : t5.primaryKey), ++r4 === u4 ? n5({ result: o4 }) : void t5.continue()) : n5({ result: o4 });
            }, i4.onerror = Bt(e5));
          });
        }), openCursor: function(e5) {
          var c4 = e5.trans, o4 = e5.values, a4 = e5.query, u4 = e5.reverse, l3 = e5.unique;
          return new Promise(function(t4, n5) {
            t4 = Te(t4);
            var e6 = a4.index, r4 = a4.range, i4 = c4.objectStore(w3), i4 = e6.isPrimaryKey ? i4 : i4.index(e6.name), e6 = u4 ? l3 ? "prevunique" : "prev" : l3 ? "nextunique" : "next", s4 = !o4 && "openKeyCursor" in i4 ? i4.openKeyCursor(_3(r4), e6) : i4.openCursor(_3(r4), e6);
            s4.onerror = Bt(n5), s4.onsuccess = Te(function(e7) {
              var r5, i5, o5, a5, u5 = s4.result;
              u5 ? (u5.___id = ++Gt, u5.done = false, r5 = u5.continue.bind(u5), i5 = (i5 = u5.continuePrimaryKey) && i5.bind(u5), o5 = u5.advance.bind(u5), a5 = function() {
                throw new Error("Cursor not stopped");
              }, u5.trans = c4, u5.stop = u5.continue = u5.continuePrimaryKey = u5.advance = function() {
                throw new Error("Cursor not started");
              }, u5.fail = Te(n5), u5.next = function() {
                var e8 = this, t5 = 1;
                return this.start(function() {
                  return t5-- ? e8.continue() : e8.stop();
                }).then(function() {
                  return e8;
                });
              }, u5.start = function(e8) {
                function t5() {
                  if (s4.result) try {
                    e8();
                  } catch (e9) {
                    u5.fail(e9);
                  }
                  else u5.done = true, u5.start = function() {
                    throw new Error("Cursor behind last entry");
                  }, u5.stop();
                }
                var n6 = new Promise(function(t6, e9) {
                  t6 = Te(t6), s4.onerror = Bt(e9), u5.fail = e9, u5.stop = function(e10) {
                    u5.stop = u5.continue = u5.continuePrimaryKey = u5.advance = a5, t6(e10);
                  };
                });
                return s4.onsuccess = Te(function(e9) {
                  s4.onsuccess = t5, t5();
                }), u5.continue = r5, u5.continuePrimaryKey = i5, u5.advance = o5, t5(), n6;
              }, t4(u5)) : t4(null);
            }, n5);
          });
        }, count: function(e5) {
          var t4 = e5.query, i4 = e5.trans, o4 = t4.index, a4 = t4.range;
          return new Promise(function(t5, e6) {
            var n5 = i4.objectStore(w3), r4 = o4.isPrimaryKey ? n5 : n5.index(o4.name), n5 = _3(a4), r4 = n5 ? r4.count(n5) : r4.count();
            r4.onsuccess = Te(function(e7) {
              return t5(e7.target.result);
            }), r4.onerror = Bt(e6);
          });
        } };
      }
      var r3, o3, a3, u3 = (o3 = t3, a3 = Qt((r3 = e3).objectStoreNames), { schema: { name: r3.name, tables: a3.map(function(e4) {
        return o3.objectStore(e4);
      }).map(function(t4) {
        var e4 = t4.keyPath, n5 = t4.autoIncrement, r4 = x2(e4), i4 = {}, n5 = { name: t4.name, primaryKey: { name: null, isPrimaryKey: true, outbound: null == e4, compound: r4, keyPath: e4, autoIncrement: n5, unique: true, extractKey: $t(e4) }, indexes: Qt(t4.indexNames).map(function(e5) {
          return t4.index(e5);
        }).map(function(e5) {
          var t5 = e5.name, n6 = e5.unique, r5 = e5.multiEntry, e5 = e5.keyPath, r5 = { name: t5, compound: x2(e5), keyPath: e5, unique: n6, multiEntry: r5, extractKey: $t(e5) };
          return i4[Xt(e5)] = r5;
        }), getIndexByKeyPath: function(e5) {
          return i4[Xt(e5)];
        } };
        return i4[":id"] = n5.primaryKey, null != e4 && (i4[Xt(e4)] = n5.primaryKey), n5;
      }) }, hasGetAll: 0 < a3.length && "getAll" in o3.objectStore(a3[0]) && !("undefined" != typeof navigator && /Safari/.test(navigator.userAgent) && !/(Chrome\/|Edge\/)/.test(navigator.userAgent) && [].concat(navigator.userAgent.match(/Safari\/(\d*)/))[1] < 604) }), t3 = u3.schema, s3 = u3.hasGetAll, u3 = t3.tables.map(n4), c3 = {};
      return u3.forEach(function(e4) {
        return c3[e4.name] = e4;
      }), { stack: "dbcore", transaction: e3.transaction.bind(e3), table: function(e4) {
        if (!c3[e4]) throw new Error("Table '".concat(e4, "' not found"));
        return c3[e4];
      }, MIN_KEY: -1 / 0, MAX_KEY: Yt(i3), schema: t3 };
    }
    function Jt(e3, t3, n4, r3) {
      var i3 = n4.IDBKeyRange;
      return n4.indexedDB, { dbcore: (r3 = Ht(t3, i3, r3), e3.dbcore.reduce(function(e4, t4) {
        t4 = t4.create;
        return w2(w2({}, e4), t4(e4));
      }, r3)) };
    }
    function Zt(n4, e3) {
      var t3 = e3.db, e3 = Jt(n4._middlewares, t3, n4._deps, e3);
      n4.core = e3.dbcore, n4.tables.forEach(function(e4) {
        var t4 = e4.name;
        n4.core.schema.tables.some(function(e5) {
          return e5.name === t4;
        }) && (e4.core = n4.core.table(t4), n4[t4] instanceof n4.Table && (n4[t4].core = e4.core));
      });
    }
    function en(i3, e3, t3, o3) {
      t3.forEach(function(n4) {
        var r3 = o3[n4];
        e3.forEach(function(e4) {
          var t4 = function e5(t5, n5) {
            return h2(t5, n5) || (t5 = c2(t5)) && e5(t5, n5);
          }(e4, n4);
          (!t4 || "value" in t4 && void 0 === t4.value) && (e4 === i3.Transaction.prototype || e4 instanceof i3.Transaction ? l2(e4, n4, { get: function() {
            return this.table(n4);
          }, set: function(e5) {
            u2(this, n4, { value: e5, writable: true, configurable: true, enumerable: true });
          } }) : e4[n4] = new i3.Table(n4, r3));
        });
      });
    }
    function tn(n4, e3) {
      e3.forEach(function(e4) {
        for (var t3 in e4) e4[t3] instanceof n4.Table && delete e4[t3];
      });
    }
    function nn(e3, t3) {
      return e3._cfg.version - t3._cfg.version;
    }
    function rn(n4, r3, i3, e3) {
      var o3 = n4._dbSchema;
      i3.objectStoreNames.contains("$meta") && !o3.$meta && (o3.$meta = Wt("$meta", hn("")[0], []), n4._storeNames.push("$meta"));
      var a3 = n4._createTransaction("readwrite", n4._storeNames, o3);
      a3.create(i3), a3._completion.catch(e3);
      var u3 = a3._reject.bind(a3), s3 = me.transless || me;
      Ne(function() {
        return me.trans = a3, me.transless = s3, 0 !== r3 ? (Zt(n4, i3), t3 = r3, ((e4 = a3).storeNames.includes("$meta") ? e4.table("$meta").get("version").then(function(e5) {
          return null != e5 ? e5 : t3;
        }) : _e.resolve(t3)).then(function(e5) {
          return c3 = e5, l3 = a3, f3 = i3, t4 = [], e5 = (s4 = n4)._versions, h3 = s4._dbSchema = ln(0, s4.idbdb, f3), 0 !== (e5 = e5.filter(function(e6) {
            return e6._cfg.version >= c3;
          })).length ? (e5.forEach(function(u4) {
            t4.push(function() {
              var t5 = h3, e6 = u4._cfg.dbschema;
              fn(s4, t5, f3), fn(s4, e6, f3), h3 = s4._dbSchema = e6;
              var n5 = an(t5, e6);
              n5.add.forEach(function(e7) {
                un(f3, e7[0], e7[1].primKey, e7[1].indexes);
              }), n5.change.forEach(function(e7) {
                if (e7.recreate) throw new Y.Upgrade("Not yet support for changing primary key");
                var t6 = f3.objectStore(e7.name);
                e7.add.forEach(function(e8) {
                  return cn(t6, e8);
                }), e7.change.forEach(function(e8) {
                  t6.deleteIndex(e8.name), cn(t6, e8);
                }), e7.del.forEach(function(e8) {
                  return t6.deleteIndex(e8);
                });
              });
              var r4 = u4._cfg.contentUpgrade;
              if (r4 && u4._cfg.version > c3) {
                Zt(s4, f3), l3._memoizedTables = {};
                var i4 = g2(e6);
                n5.del.forEach(function(e7) {
                  i4[e7] = t5[e7];
                }), tn(s4, [s4.Transaction.prototype]), en(s4, [s4.Transaction.prototype], _2(i4), i4), l3.schema = i4;
                var o4, a4 = B(r4);
                a4 && Le();
                n5 = _e.follow(function() {
                  var e7;
                  (o4 = r4(l3)) && a4 && (e7 = Ue.bind(null, null), o4.then(e7, e7));
                });
                return o4 && "function" == typeof o4.then ? _e.resolve(o4) : n5.then(function() {
                  return o4;
                });
              }
            }), t4.push(function(e6) {
              var t5, n5, r4 = u4._cfg.dbschema;
              t5 = r4, n5 = e6, [].slice.call(n5.db.objectStoreNames).forEach(function(e7) {
                return null == t5[e7] && n5.db.deleteObjectStore(e7);
              }), tn(s4, [s4.Transaction.prototype]), en(s4, [s4.Transaction.prototype], s4._storeNames, s4._dbSchema), l3.schema = s4._dbSchema;
            }), t4.push(function(e6) {
              s4.idbdb.objectStoreNames.contains("$meta") && (Math.ceil(s4.idbdb.version / 10) === u4._cfg.version ? (s4.idbdb.deleteObjectStore("$meta"), delete s4._dbSchema.$meta, s4._storeNames = s4._storeNames.filter(function(e7) {
                return "$meta" !== e7;
              })) : e6.objectStore("$meta").put(u4._cfg.version, "version"));
            });
          }), function e6() {
            return t4.length ? _e.resolve(t4.shift()(l3.idbtrans)).then(e6) : _e.resolve();
          }().then(function() {
            sn(h3, f3);
          })) : _e.resolve();
          var s4, c3, l3, f3, t4, h3;
        }).catch(u3)) : (_2(o3).forEach(function(e5) {
          un(i3, e5, o3[e5].primKey, o3[e5].indexes);
        }), Zt(n4, i3), void _e.follow(function() {
          return n4.on.populate.fire(a3);
        }).catch(u3));
        var e4, t3;
      });
    }
    function on(e3, r3) {
      sn(e3._dbSchema, r3), r3.db.version % 10 != 0 || r3.objectStoreNames.contains("$meta") || r3.db.createObjectStore("$meta").add(Math.ceil(r3.db.version / 10 - 1), "version");
      var t3 = ln(0, e3.idbdb, r3);
      fn(e3, e3._dbSchema, r3);
      for (var n4 = 0, i3 = an(t3, e3._dbSchema).change; n4 < i3.length; n4++) {
        var o3 = function(t4) {
          if (t4.change.length || t4.recreate) return console.warn("Unable to patch indexes of table ".concat(t4.name, " because it has changes on the type of index or primary key.")), { value: void 0 };
          var n5 = r3.objectStore(t4.name);
          t4.add.forEach(function(e4) {
            ie && console.debug("Dexie upgrade patch: Creating missing index ".concat(t4.name, ".").concat(e4.src)), cn(n5, e4);
          });
        }(i3[n4]);
        if ("object" == typeof o3) return o3.value;
      }
    }
    function an(e3, t3) {
      var n4, r3 = { del: [], add: [], change: [] };
      for (n4 in e3) t3[n4] || r3.del.push(n4);
      for (n4 in t3) {
        var i3 = e3[n4], o3 = t3[n4];
        if (i3) {
          var a3 = { name: n4, def: o3, recreate: false, del: [], add: [], change: [] };
          if ("" + (i3.primKey.keyPath || "") != "" + (o3.primKey.keyPath || "") || i3.primKey.auto !== o3.primKey.auto) a3.recreate = true, r3.change.push(a3);
          else {
            var u3 = i3.idxByName, s3 = o3.idxByName, c3 = void 0;
            for (c3 in u3) s3[c3] || a3.del.push(c3);
            for (c3 in s3) {
              var l3 = u3[c3], f3 = s3[c3];
              l3 ? l3.src !== f3.src && a3.change.push(f3) : a3.add.push(f3);
            }
            (0 < a3.del.length || 0 < a3.add.length || 0 < a3.change.length) && r3.change.push(a3);
          }
        } else r3.add.push([n4, o3]);
      }
      return r3;
    }
    function un(e3, t3, n4, r3) {
      var i3 = e3.db.createObjectStore(t3, n4.keyPath ? { keyPath: n4.keyPath, autoIncrement: n4.auto } : { autoIncrement: n4.auto });
      return r3.forEach(function(e4) {
        return cn(i3, e4);
      }), i3;
    }
    function sn(t3, n4) {
      _2(t3).forEach(function(e3) {
        n4.db.objectStoreNames.contains(e3) || (ie && console.debug("Dexie: Creating missing table", e3), un(n4, e3, t3[e3].primKey, t3[e3].indexes));
      });
    }
    function cn(e3, t3) {
      e3.createIndex(t3.name, t3.keyPath, { unique: t3.unique, multiEntry: t3.multi });
    }
    function ln(e3, t3, u3) {
      var s3 = {};
      return b2(t3.objectStoreNames, 0).forEach(function(e4) {
        for (var t4 = u3.objectStore(e4), n4 = Vt(zt(a3 = t4.keyPath), a3 || "", true, false, !!t4.autoIncrement, a3 && "string" != typeof a3, true), r3 = [], i3 = 0; i3 < t4.indexNames.length; ++i3) {
          var o3 = t4.index(t4.indexNames[i3]), a3 = o3.keyPath, o3 = Vt(o3.name, a3, !!o3.unique, !!o3.multiEntry, false, a3 && "string" != typeof a3, false);
          r3.push(o3);
        }
        s3[e4] = Wt(e4, n4, r3);
      }), s3;
    }
    function fn(e3, t3, n4) {
      for (var r3 = n4.db.objectStoreNames, i3 = 0; i3 < r3.length; ++i3) {
        var o3 = r3[i3], a3 = n4.objectStore(o3);
        e3._hasGetAll = "getAll" in a3;
        for (var u3 = 0; u3 < a3.indexNames.length; ++u3) {
          var s3 = a3.indexNames[u3], c3 = a3.index(s3).keyPath, l3 = "string" == typeof c3 ? c3 : "[" + b2(c3).join("+") + "]";
          !t3[o3] || (c3 = t3[o3].idxByName[l3]) && (c3.name = s3, delete t3[o3].idxByName[l3], t3[o3].idxByName[s3] = c3);
        }
      }
      "undefined" != typeof navigator && /Safari/.test(navigator.userAgent) && !/(Chrome\/|Edge\/)/.test(navigator.userAgent) && f2.WorkerGlobalScope && f2 instanceof f2.WorkerGlobalScope && [].concat(navigator.userAgent.match(/Safari\/(\d*)/))[1] < 604 && (e3._hasGetAll = false);
    }
    function hn(e3) {
      return e3.split(",").map(function(e4, t3) {
        var n4 = (e4 = e4.trim()).replace(/([&*]|\+\+)/g, ""), r3 = /^\[/.test(n4) ? n4.match(/^\[(.*)\]$/)[1].split("+") : n4;
        return Vt(n4, r3 || null, /\&/.test(e4), /\*/.test(e4), /\+\+/.test(e4), x2(r3), 0 === t3);
      });
    }
    var dn = (pn.prototype._parseStoresSpec = function(r3, i3) {
      _2(r3).forEach(function(e3) {
        if (null !== r3[e3]) {
          var t3 = hn(r3[e3]), n4 = t3.shift();
          if (n4.unique = true, n4.multi) throw new Y.Schema("Primary key cannot be multi-valued");
          t3.forEach(function(e4) {
            if (e4.auto) throw new Y.Schema("Only primary key can be marked as autoIncrement (++)");
            if (!e4.keyPath) throw new Y.Schema("Index must have a name and cannot be an empty string");
          }), i3[e3] = Wt(e3, n4, t3);
        }
      });
    }, pn.prototype.stores = function(e3) {
      var t3 = this.db;
      this._cfg.storesSource = this._cfg.storesSource ? a2(this._cfg.storesSource, e3) : e3;
      var e3 = t3._versions, n4 = {}, r3 = {};
      return e3.forEach(function(e4) {
        a2(n4, e4._cfg.storesSource), r3 = e4._cfg.dbschema = {}, e4._parseStoresSpec(n4, r3);
      }), t3._dbSchema = r3, tn(t3, [t3._allTables, t3, t3.Transaction.prototype]), en(t3, [t3._allTables, t3, t3.Transaction.prototype, this._cfg.tables], _2(r3), r3), t3._storeNames = _2(r3), this;
    }, pn.prototype.upgrade = function(e3) {
      return this._cfg.contentUpgrade = re(this._cfg.contentUpgrade || G, e3), this;
    }, pn);
    function pn() {
    }
    function yn(e3, t3) {
      var n4 = e3._dbNamesDB;
      return n4 || (n4 = e3._dbNamesDB = new er(tt, { addons: [], indexedDB: e3, IDBKeyRange: t3 })).version(1).stores({ dbnames: "name" }), n4.table("dbnames");
    }
    function vn(e3) {
      return e3 && "function" == typeof e3.databases;
    }
    function mn(e3) {
      return Ne(function() {
        return me.letThrough = true, e3();
      });
    }
    function bn(e3) {
      return !("from" in e3);
    }
    var gn = function(e3, t3) {
      if (!this) {
        var n4 = new gn();
        return e3 && "d" in e3 && a2(n4, e3), n4;
      }
      a2(this, arguments.length ? { d: 1, from: e3, to: 1 < arguments.length ? t3 : e3 } : { d: 0 });
    };
    function wn(e3, t3, n4) {
      var r3 = st(t3, n4);
      if (!isNaN(r3)) {
        if (0 < r3) throw RangeError();
        if (bn(e3)) return a2(e3, { from: t3, to: n4, d: 1 });
        var i3 = e3.l, r3 = e3.r;
        if (st(n4, e3.from) < 0) return i3 ? wn(i3, t3, n4) : e3.l = { from: t3, to: n4, d: 1, l: null, r: null }, On(e3);
        if (0 < st(t3, e3.to)) return r3 ? wn(r3, t3, n4) : e3.r = { from: t3, to: n4, d: 1, l: null, r: null }, On(e3);
        st(t3, e3.from) < 0 && (e3.from = t3, e3.l = null, e3.d = r3 ? r3.d + 1 : 1), 0 < st(n4, e3.to) && (e3.to = n4, e3.r = null, e3.d = e3.l ? e3.l.d + 1 : 1);
        n4 = !e3.r;
        i3 && !e3.l && _n(e3, i3), r3 && n4 && _n(e3, r3);
      }
    }
    function _n(e3, t3) {
      bn(t3) || function e4(t4, n4) {
        var r3 = n4.from, i3 = n4.to, o3 = n4.l, n4 = n4.r;
        wn(t4, r3, i3), o3 && e4(t4, o3), n4 && e4(t4, n4);
      }(e3, t3);
    }
    function xn(e3, t3) {
      var n4 = kn(t3), r3 = n4.next();
      if (r3.done) return false;
      for (var i3 = r3.value, o3 = kn(e3), a3 = o3.next(i3.from), u3 = a3.value; !r3.done && !a3.done; ) {
        if (st(u3.from, i3.to) <= 0 && 0 <= st(u3.to, i3.from)) return true;
        st(i3.from, u3.from) < 0 ? i3 = (r3 = n4.next(u3.from)).value : u3 = (a3 = o3.next(i3.from)).value;
      }
      return false;
    }
    function kn(e3) {
      var n4 = bn(e3) ? null : { s: 0, n: e3 };
      return { next: function(e4) {
        for (var t3 = 0 < arguments.length; n4; ) switch (n4.s) {
          case 0:
            if (n4.s = 1, t3) for (; n4.n.l && st(e4, n4.n.from) < 0; ) n4 = { up: n4, n: n4.n.l, s: 1 };
            else for (; n4.n.l; ) n4 = { up: n4, n: n4.n.l, s: 1 };
          case 1:
            if (n4.s = 2, !t3 || st(e4, n4.n.to) <= 0) return { value: n4.n, done: false };
          case 2:
            if (n4.n.r) {
              n4.s = 3, n4 = { up: n4, n: n4.n.r, s: 0 };
              continue;
            }
          case 3:
            n4 = n4.up;
        }
        return { done: true };
      } };
    }
    function On(e3) {
      var t3, n4, r3 = ((null === (t3 = e3.r) || void 0 === t3 ? void 0 : t3.d) || 0) - ((null === (n4 = e3.l) || void 0 === n4 ? void 0 : n4.d) || 0), i3 = 1 < r3 ? "r" : r3 < -1 ? "l" : "";
      i3 && (t3 = "r" == i3 ? "l" : "r", n4 = w2({}, e3), r3 = e3[i3], e3.from = r3.from, e3.to = r3.to, e3[i3] = r3[i3], n4[i3] = r3[t3], (e3[t3] = n4).d = Pn(n4)), e3.d = Pn(e3);
    }
    function Pn(e3) {
      var t3 = e3.r, e3 = e3.l;
      return (t3 ? e3 ? Math.max(t3.d, e3.d) : t3.d : e3 ? e3.d : 0) + 1;
    }
    function En(t3, n4) {
      return _2(n4).forEach(function(e3) {
        t3[e3] ? _n(t3[e3], n4[e3]) : t3[e3] = function e4(t4) {
          var n5, r3, i3 = {};
          for (n5 in t4) m2(t4, n5) && (r3 = t4[n5], i3[n5] = !r3 || "object" != typeof r3 || E2.has(r3.constructor) ? r3 : e4(r3));
          return i3;
        }(n4[e3]);
      }), t3;
    }
    function Kn(t3, n4) {
      return t3.all || n4.all || Object.keys(t3).some(function(e3) {
        return n4[e3] && xn(n4[e3], t3[e3]);
      });
    }
    r2(gn.prototype, ((F = { add: function(e3) {
      return _n(this, e3), this;
    }, addKey: function(e3) {
      return wn(this, e3, e3), this;
    }, addKeys: function(e3) {
      var t3 = this;
      return e3.forEach(function(e4) {
        return wn(t3, e4, e4);
      }), this;
    }, hasKey: function(e3) {
      var t3 = kn(this).next(e3).value;
      return t3 && st(t3.from, e3) <= 0 && 0 <= st(t3.to, e3);
    } })[C2] = function() {
      return kn(this);
    }, F));
    var Sn = {}, jn = {}, An = false;
    function Cn(e3) {
      En(jn, e3), An || (An = true, setTimeout(function() {
        An = false, Dn(jn, !(jn = {}));
      }, 0));
    }
    function Dn(e3, t3) {
      void 0 === t3 && (t3 = false);
      var n4 = /* @__PURE__ */ new Set();
      if (e3.all) for (var r3 = 0, i3 = Object.values(Sn); r3 < i3.length; r3++) Tn(a3 = i3[r3], e3, n4, t3);
      else for (var o3 in e3) {
        var a3, u3 = /^idb\:\/\/(.*)\/(.*)\//.exec(o3);
        u3 && (o3 = u3[1], u3 = u3[2], (a3 = Sn["idb://".concat(o3, "/").concat(u3)]) && Tn(a3, e3, n4, t3));
      }
      n4.forEach(function(e4) {
        return e4();
      });
    }
    function Tn(e3, t3, n4, r3) {
      for (var i3 = [], o3 = 0, a3 = Object.entries(e3.queries.query); o3 < a3.length; o3++) {
        for (var u3 = a3[o3], s3 = u3[0], c3 = [], l3 = 0, f3 = u3[1]; l3 < f3.length; l3++) {
          var h3 = f3[l3];
          Kn(t3, h3.obsSet) ? h3.subscribers.forEach(function(e4) {
            return n4.add(e4);
          }) : r3 && c3.push(h3);
        }
        r3 && i3.push([s3, c3]);
      }
      if (r3) for (var d3 = 0, p3 = i3; d3 < p3.length; d3++) {
        var y3 = p3[d3], s3 = y3[0], c3 = y3[1];
        e3.queries.query[s3] = c3;
      }
    }
    function qn(f3) {
      var h3 = f3._state, r3 = f3._deps.indexedDB;
      if (h3.isBeingOpened || f3.idbdb) return h3.dbReadyPromise.then(function() {
        return h3.dbOpenError ? Xe(h3.dbOpenError) : f3;
      });
      h3.isBeingOpened = true, h3.dbOpenError = null, h3.openComplete = false;
      var t3 = h3.openCanceller, d3 = Math.round(10 * f3.verno), p3 = false;
      function e3() {
        if (h3.openCanceller !== t3) throw new Y.DatabaseClosed("db.open() was cancelled");
      }
      function y3() {
        return new _e(function(s3, n5) {
          if (e3(), !r3) throw new Y.MissingAPI();
          var c3 = f3.name, l3 = h3.autoSchema || !d3 ? r3.open(c3) : r3.open(c3, d3);
          if (!l3) throw new Y.MissingAPI();
          l3.onerror = Bt(n5), l3.onblocked = Te(f3._fireOnBlocked), l3.onupgradeneeded = Te(function(e4) {
            var t4;
            v3 = l3.transaction, h3.autoSchema && !f3._options.allowEmptyDB ? (l3.onerror = Rt, v3.abort(), l3.result.close(), (t4 = r3.deleteDatabase(c3)).onsuccess = t4.onerror = Te(function() {
              n5(new Y.NoSuchDatabase("Database ".concat(c3, " doesnt exist")));
            })) : (v3.onerror = Bt(n5), e4 = e4.oldVersion > Math.pow(2, 62) ? 0 : e4.oldVersion, m3 = e4 < 1, f3.idbdb = l3.result, p3 && on(f3, v3), rn(f3, e4 / 10, v3, n5));
          }, n5), l3.onsuccess = Te(function() {
            v3 = null;
            var e4, t4, n6, r4, i4, o3 = f3.idbdb = l3.result, a3 = b2(o3.objectStoreNames);
            if (0 < a3.length) try {
              var u3 = o3.transaction(1 === (r4 = a3).length ? r4[0] : r4, "readonly");
              if (h3.autoSchema) t4 = o3, n6 = u3, (e4 = f3).verno = t4.version / 10, n6 = e4._dbSchema = ln(0, t4, n6), e4._storeNames = b2(t4.objectStoreNames, 0), en(e4, [e4._allTables], _2(n6), n6);
              else if (fn(f3, f3._dbSchema, u3), ((i4 = an(ln(0, (i4 = f3).idbdb, u3), i4._dbSchema)).add.length || i4.change.some(function(e5) {
                return e5.add.length || e5.change.length;
              })) && !p3) return console.warn("Dexie SchemaDiff: Schema was extended without increasing the number passed to db.version(). Dexie will add missing parts and increment native version number to workaround this."), o3.close(), d3 = o3.version + 1, p3 = true, s3(y3());
              Zt(f3, u3);
            } catch (e5) {
            }
            et.push(f3), o3.onversionchange = Te(function(e5) {
              h3.vcFired = true, f3.on("versionchange").fire(e5);
            }), o3.onclose = Te(function(e5) {
              f3.on("close").fire(e5);
            }), m3 && (i4 = f3._deps, u3 = c3, o3 = i4.indexedDB, i4 = i4.IDBKeyRange, vn(o3) || u3 === tt || yn(o3, i4).put({ name: u3 }).catch(G)), s3();
          }, n5);
        }).catch(function(e4) {
          switch (null == e4 ? void 0 : e4.name) {
            case "UnknownError":
              if (0 < h3.PR1398_maxLoop) return h3.PR1398_maxLoop--, console.warn("Dexie: Workaround for Chrome UnknownError on open()"), y3();
              break;
            case "VersionError":
              if (0 < d3) return d3 = 0, y3();
          }
          return _e.reject(e4);
        });
      }
      var n4, i3 = h3.dbReadyResolve, v3 = null, m3 = false;
      return _e.race([t3, ("undefined" == typeof navigator ? _e.resolve() : !navigator.userAgentData && /Safari\//.test(navigator.userAgent) && !/Chrom(e|ium)\//.test(navigator.userAgent) && indexedDB.databases ? new Promise(function(e4) {
        function t4() {
          return indexedDB.databases().finally(e4);
        }
        n4 = setInterval(t4, 100), t4();
      }).finally(function() {
        return clearInterval(n4);
      }) : Promise.resolve()).then(y3)]).then(function() {
        return e3(), h3.onReadyBeingFired = [], _e.resolve(mn(function() {
          return f3.on.ready.fire(f3.vip);
        })).then(function e4() {
          if (0 < h3.onReadyBeingFired.length) {
            var t4 = h3.onReadyBeingFired.reduce(re, G);
            return h3.onReadyBeingFired = [], _e.resolve(mn(function() {
              return t4(f3.vip);
            })).then(e4);
          }
        });
      }).finally(function() {
        h3.openCanceller === t3 && (h3.onReadyBeingFired = null, h3.isBeingOpened = false);
      }).catch(function(e4) {
        h3.dbOpenError = e4;
        try {
          v3 && v3.abort();
        } catch (e5) {
        }
        return t3 === h3.openCanceller && f3._close(), Xe(e4);
      }).finally(function() {
        h3.openComplete = true, i3();
      }).then(function() {
        var n5;
        return m3 && (n5 = {}, f3.tables.forEach(function(t4) {
          t4.schema.indexes.forEach(function(e4) {
            e4.name && (n5["idb://".concat(f3.name, "/").concat(t4.name, "/").concat(e4.name)] = new gn(-1 / 0, [[[]]]));
          }), n5["idb://".concat(f3.name, "/").concat(t4.name, "/")] = n5["idb://".concat(f3.name, "/").concat(t4.name, "/:dels")] = new gn(-1 / 0, [[[]]]);
        }), Nt(Ft).fire(n5), Dn(n5, true)), f3;
      });
    }
    function In(t3) {
      function e3(e4) {
        return t3.next(e4);
      }
      var r3 = n4(e3), i3 = n4(function(e4) {
        return t3.throw(e4);
      });
      function n4(n5) {
        return function(e4) {
          var t4 = n5(e4), e4 = t4.value;
          return t4.done ? e4 : e4 && "function" == typeof e4.then ? e4.then(r3, i3) : x2(e4) ? Promise.all(e4).then(r3, i3) : r3(e4);
        };
      }
      return n4(e3)();
    }
    function Bn(e3, t3, n4) {
      for (var r3 = x2(e3) ? e3.slice() : [e3], i3 = 0; i3 < n4; ++i3) r3.push(t3);
      return r3;
    }
    var Rn = { stack: "dbcore", name: "VirtualIndexMiddleware", level: 1, create: function(f3) {
      return w2(w2({}, f3), { table: function(e3) {
        var a3 = f3.table(e3), t3 = a3.schema, u3 = {}, s3 = [];
        function c3(e4, t4, n5) {
          var r4 = Xt(e4), i4 = u3[r4] = u3[r4] || [], o3 = null == e4 ? 0 : "string" == typeof e4 ? 1 : e4.length, a4 = 0 < t4, a4 = w2(w2({}, n5), { name: a4 ? "".concat(r4, "(virtual-from:").concat(n5.name, ")") : n5.name, lowLevelIndex: n5, isVirtual: a4, keyTail: t4, keyLength: o3, extractKey: $t(e4), unique: !a4 && n5.unique });
          return i4.push(a4), a4.isPrimaryKey || s3.push(a4), 1 < o3 && c3(2 === o3 ? e4[0] : e4.slice(0, o3 - 1), t4 + 1, n5), i4.sort(function(e5, t5) {
            return e5.keyTail - t5.keyTail;
          }), a4;
        }
        e3 = c3(t3.primaryKey.keyPath, 0, t3.primaryKey);
        u3[":id"] = [e3];
        for (var n4 = 0, r3 = t3.indexes; n4 < r3.length; n4++) {
          var i3 = r3[n4];
          c3(i3.keyPath, 0, i3);
        }
        function l3(e4) {
          var t4, n5 = e4.query.index;
          return n5.isVirtual ? w2(w2({}, e4), { query: { index: n5.lowLevelIndex, range: (t4 = e4.query.range, n5 = n5.keyTail, { type: 1 === t4.type ? 2 : t4.type, lower: Bn(t4.lower, t4.lowerOpen ? f3.MAX_KEY : f3.MIN_KEY, n5), lowerOpen: true, upper: Bn(t4.upper, t4.upperOpen ? f3.MIN_KEY : f3.MAX_KEY, n5), upperOpen: true }) } }) : e4;
        }
        return w2(w2({}, a3), { schema: w2(w2({}, t3), { primaryKey: e3, indexes: s3, getIndexByKeyPath: function(e4) {
          return (e4 = u3[Xt(e4)]) && e4[0];
        } }), count: function(e4) {
          return a3.count(l3(e4));
        }, query: function(e4) {
          return a3.query(l3(e4));
        }, openCursor: function(t4) {
          var e4 = t4.query.index, r4 = e4.keyTail, n5 = e4.isVirtual, i4 = e4.keyLength;
          return n5 ? a3.openCursor(l3(t4)).then(function(e5) {
            return e5 && o3(e5);
          }) : a3.openCursor(t4);
          function o3(n6) {
            return Object.create(n6, { continue: { value: function(e5) {
              null != e5 ? n6.continue(Bn(e5, t4.reverse ? f3.MAX_KEY : f3.MIN_KEY, r4)) : t4.unique ? n6.continue(n6.key.slice(0, i4).concat(t4.reverse ? f3.MIN_KEY : f3.MAX_KEY, r4)) : n6.continue();
            } }, continuePrimaryKey: { value: function(e5, t5) {
              n6.continuePrimaryKey(Bn(e5, f3.MAX_KEY, r4), t5);
            } }, primaryKey: { get: function() {
              return n6.primaryKey;
            } }, key: { get: function() {
              var e5 = n6.key;
              return 1 === i4 ? e5[0] : e5.slice(0, i4);
            } }, value: { get: function() {
              return n6.value;
            } } });
          }
        } });
      } });
    } };
    function Fn(i3, o3, a3, u3) {
      return a3 = a3 || {}, u3 = u3 || "", _2(i3).forEach(function(e3) {
        var t3, n4, r3;
        m2(o3, e3) ? (t3 = i3[e3], n4 = o3[e3], "object" == typeof t3 && "object" == typeof n4 && t3 && n4 ? (r3 = A2(t3)) !== A2(n4) ? a3[u3 + e3] = o3[e3] : "Object" === r3 ? Fn(t3, n4, a3, u3 + e3 + ".") : t3 !== n4 && (a3[u3 + e3] = o3[e3]) : t3 !== n4 && (a3[u3 + e3] = o3[e3])) : a3[u3 + e3] = void 0;
      }), _2(o3).forEach(function(e3) {
        m2(i3, e3) || (a3[u3 + e3] = o3[e3]);
      }), a3;
    }
    function Mn(e3, t3) {
      return "delete" === t3.type ? t3.keys : t3.keys || t3.values.map(e3.extractKey);
    }
    var Nn = { stack: "dbcore", name: "HooksMiddleware", level: 2, create: function(e3) {
      return w2(w2({}, e3), { table: function(r3) {
        var y3 = e3.table(r3), v3 = y3.schema.primaryKey;
        return w2(w2({}, y3), { mutate: function(e4) {
          var t3 = me.trans, n4 = t3.table(r3).hook, h3 = n4.deleting, d3 = n4.creating, p3 = n4.updating;
          switch (e4.type) {
            case "add":
              if (d3.fire === G) break;
              return t3._promise("readwrite", function() {
                return a3(e4);
              }, true);
            case "put":
              if (d3.fire === G && p3.fire === G) break;
              return t3._promise("readwrite", function() {
                return a3(e4);
              }, true);
            case "delete":
              if (h3.fire === G) break;
              return t3._promise("readwrite", function() {
                return a3(e4);
              }, true);
            case "deleteRange":
              if (h3.fire === G) break;
              return t3._promise("readwrite", function() {
                return function n5(r4, i3, o3) {
                  return y3.query({ trans: r4, values: false, query: { index: v3, range: i3 }, limit: o3 }).then(function(e5) {
                    var t4 = e5.result;
                    return a3({ type: "delete", keys: t4, trans: r4 }).then(function(e6) {
                      return 0 < e6.numFailures ? Promise.reject(e6.failures[0]) : t4.length < o3 ? { failures: [], numFailures: 0, lastResult: void 0 } : n5(r4, w2(w2({}, i3), { lower: t4[t4.length - 1], lowerOpen: true }), o3);
                    });
                  });
                }(e4.trans, e4.range, 1e4);
              }, true);
          }
          return y3.mutate(e4);
          function a3(c3) {
            var e5, t4, n5, l3 = me.trans, f3 = c3.keys || Mn(v3, c3);
            if (!f3) throw new Error("Keys missing");
            return "delete" !== (c3 = "add" === c3.type || "put" === c3.type ? w2(w2({}, c3), { keys: f3 }) : w2({}, c3)).type && (c3.values = i2([], c3.values)), c3.keys && (c3.keys = i2([], c3.keys)), e5 = y3, n5 = f3, ("add" === (t4 = c3).type ? Promise.resolve([]) : e5.getMany({ trans: t4.trans, keys: n5, cache: "immutable" })).then(function(u3) {
              var s3 = f3.map(function(e6, t5) {
                var n6, r4, i3, o3 = u3[t5], a4 = { onerror: null, onsuccess: null };
                return "delete" === c3.type ? h3.fire.call(a4, e6, o3, l3) : "add" === c3.type || void 0 === o3 ? (n6 = d3.fire.call(a4, e6, c3.values[t5], l3), null == e6 && null != n6 && (c3.keys[t5] = e6 = n6, v3.outbound || P2(c3.values[t5], v3.keyPath, e6))) : (n6 = Fn(o3, c3.values[t5]), (r4 = p3.fire.call(a4, n6, e6, o3, l3)) && (i3 = c3.values[t5], Object.keys(r4).forEach(function(e7) {
                  m2(i3, e7) ? i3[e7] = r4[e7] : P2(i3, e7, r4[e7]);
                }))), a4;
              });
              return y3.mutate(c3).then(function(e6) {
                for (var t5 = e6.failures, n6 = e6.results, r4 = e6.numFailures, e6 = e6.lastResult, i3 = 0; i3 < f3.length; ++i3) {
                  var o3 = (n6 || f3)[i3], a4 = s3[i3];
                  null == o3 ? a4.onerror && a4.onerror(t5[i3]) : a4.onsuccess && a4.onsuccess("put" === c3.type && u3[i3] ? c3.values[i3] : o3);
                }
                return { failures: t5, results: n6, numFailures: r4, lastResult: e6 };
              }).catch(function(t5) {
                return s3.forEach(function(e6) {
                  return e6.onerror && e6.onerror(t5);
                }), Promise.reject(t5);
              });
            });
          }
        } });
      } });
    } };
    function Ln(e3, t3, n4) {
      try {
        if (!t3) return null;
        if (t3.keys.length < e3.length) return null;
        for (var r3 = [], i3 = 0, o3 = 0; i3 < t3.keys.length && o3 < e3.length; ++i3) 0 === st(t3.keys[i3], e3[o3]) && (r3.push(n4 ? S2(t3.values[i3]) : t3.values[i3]), ++o3);
        return r3.length === e3.length ? r3 : null;
      } catch (e4) {
        return null;
      }
    }
    var Un = { stack: "dbcore", level: -1, create: function(t3) {
      return { table: function(e3) {
        var n4 = t3.table(e3);
        return w2(w2({}, n4), { getMany: function(t4) {
          if (!t4.cache) return n4.getMany(t4);
          var e4 = Ln(t4.keys, t4.trans._cache, "clone" === t4.cache);
          return e4 ? _e.resolve(e4) : n4.getMany(t4).then(function(e5) {
            return t4.trans._cache = { keys: t4.keys, values: "clone" === t4.cache ? S2(e5) : e5 }, e5;
          });
        }, mutate: function(e4) {
          return "add" !== e4.type && (e4.trans._cache = null), n4.mutate(e4);
        } });
      } };
    } };
    function Vn(e3, t3) {
      return "readonly" === e3.trans.mode && !!e3.subscr && !e3.trans.explicit && "disabled" !== e3.trans.db._options.cache && !t3.schema.primaryKey.outbound;
    }
    function zn(e3, t3) {
      switch (e3) {
        case "query":
          return t3.values && !t3.unique;
        case "get":
        case "getMany":
        case "count":
        case "openCursor":
          return false;
      }
    }
    var Wn = { stack: "dbcore", level: 0, name: "Observability", create: function(r3) {
      var b3 = r3.schema.name, g3 = new gn(r3.MIN_KEY, r3.MAX_KEY);
      return w2(w2({}, r3), { transaction: function(e3, t3, n4) {
        if (me.subscr && "readonly" !== t3) throw new Y.ReadOnly("Readwrite transaction in liveQuery context. Querier source: ".concat(me.querier));
        return r3.transaction(e3, t3, n4);
      }, table: function(d3) {
        var p3 = r3.table(d3), y3 = p3.schema, v3 = y3.primaryKey, e3 = y3.indexes, c3 = v3.extractKey, l3 = v3.outbound, m3 = v3.autoIncrement && e3.filter(function(e4) {
          return e4.compound && e4.keyPath.includes(v3.keyPath);
        }), t3 = w2(w2({}, p3), { mutate: function(i3) {
          function o3(e5) {
            return e5 = "idb://".concat(b3, "/").concat(d3, "/").concat(e5), n4[e5] || (n4[e5] = new gn());
          }
          var e4, a3, u3, t4 = i3.trans, n4 = i3.mutatedParts || (i3.mutatedParts = {}), r4 = o3(""), s3 = o3(":dels"), c4 = i3.type, l4 = "deleteRange" === i3.type ? [i3.range] : "delete" === i3.type ? [i3.keys] : i3.values.length < 50 ? [Mn(v3, i3).filter(function(e5) {
            return e5;
          }), i3.values] : [], f4 = l4[0], h3 = l4[1], l4 = i3.trans._cache;
          return x2(f4) ? (r4.addKeys(f4), (l4 = "delete" === c4 || f4.length === h3.length ? Ln(f4, l4) : null) || s3.addKeys(f4), (l4 || h3) && (e4 = o3, a3 = l4, u3 = h3, y3.indexes.forEach(function(t5) {
            var n5 = e4(t5.name || "");
            function r5(e5) {
              return null != e5 ? t5.extractKey(e5) : null;
            }
            function i4(e5) {
              return t5.multiEntry && x2(e5) ? e5.forEach(function(e6) {
                return n5.addKey(e6);
              }) : n5.addKey(e5);
            }
            (a3 || u3).forEach(function(e5, t6) {
              var n6 = a3 && r5(a3[t6]), t6 = u3 && r5(u3[t6]);
              0 !== st(n6, t6) && (null != n6 && i4(n6), null != t6 && i4(t6));
            });
          }))) : f4 ? (h3 = { from: f4.lower, to: f4.upper }, s3.add(h3), r4.add(h3)) : (r4.add(g3), s3.add(g3), y3.indexes.forEach(function(e5) {
            return o3(e5.name).add(g3);
          })), p3.mutate(i3).then(function(e5) {
            return !f4 || "add" !== i3.type && "put" !== i3.type || (r4.addKeys(e5.results), m3 && m3.forEach(function(t5) {
              var n5 = i3.values.map(function(e6) {
                return t5.extractKey(e6);
              }), r5 = t5.keyPath.findIndex(function(e6) {
                return e6 === v3.keyPath;
              });
              e5.results.forEach(function(e6) {
                return n5[r5] = e6;
              }), o3(t5.name).addKeys(n5);
            })), t4.mutatedParts = En(t4.mutatedParts || {}, n4), e5;
          });
        } }), e3 = function(e4) {
          var t4 = e4.query, e4 = t4.index, t4 = t4.range;
          return [e4, new gn(null !== (e4 = t4.lower) && void 0 !== e4 ? e4 : r3.MIN_KEY, null !== (t4 = t4.upper) && void 0 !== t4 ? t4 : r3.MAX_KEY)];
        }, f3 = { get: function(e4) {
          return [v3, new gn(e4.key)];
        }, getMany: function(e4) {
          return [v3, new gn().addKeys(e4.keys)];
        }, count: e3, query: e3, openCursor: e3 };
        return _2(f3).forEach(function(s3) {
          t3[s3] = function(i3) {
            var e4 = me.subscr, t4 = !!e4, n4 = Vn(me, p3) && zn(s3, i3) ? i3.obsSet = {} : e4;
            if (t4) {
              var r4 = function(e5) {
                e5 = "idb://".concat(b3, "/").concat(d3, "/").concat(e5);
                return n4[e5] || (n4[e5] = new gn());
              }, o3 = r4(""), a3 = r4(":dels"), e4 = f3[s3](i3), t4 = e4[0], e4 = e4[1];
              if (("query" === s3 && t4.isPrimaryKey && !i3.values ? a3 : r4(t4.name || "")).add(e4), !t4.isPrimaryKey) {
                if ("count" !== s3) {
                  var u3 = "query" === s3 && l3 && i3.values && p3.query(w2(w2({}, i3), { values: false }));
                  return p3[s3].apply(this, arguments).then(function(t5) {
                    if ("query" === s3) {
                      if (l3 && i3.values) return u3.then(function(e6) {
                        e6 = e6.result;
                        return o3.addKeys(e6), t5;
                      });
                      var e5 = i3.values ? t5.result.map(c3) : t5.result;
                      (i3.values ? o3 : a3).addKeys(e5);
                    } else if ("openCursor" === s3) {
                      var n5 = t5, r5 = i3.values;
                      return n5 && Object.create(n5, { key: { get: function() {
                        return a3.addKey(n5.primaryKey), n5.key;
                      } }, primaryKey: { get: function() {
                        var e6 = n5.primaryKey;
                        return a3.addKey(e6), e6;
                      } }, value: { get: function() {
                        return r5 && o3.addKey(n5.primaryKey), n5.value;
                      } } });
                    }
                    return t5;
                  });
                }
                a3.add(g3);
              }
            }
            return p3[s3].apply(this, arguments);
          };
        }), t3;
      } });
    } };
    function Yn(e3, t3, n4) {
      if (0 === n4.numFailures) return t3;
      if ("deleteRange" === t3.type) return null;
      var r3 = t3.keys ? t3.keys.length : "values" in t3 && t3.values ? t3.values.length : 1;
      if (n4.numFailures === r3) return null;
      t3 = w2({}, t3);
      return x2(t3.keys) && (t3.keys = t3.keys.filter(function(e4, t4) {
        return !(t4 in n4.failures);
      })), "values" in t3 && x2(t3.values) && (t3.values = t3.values.filter(function(e4, t4) {
        return !(t4 in n4.failures);
      })), t3;
    }
    function $n(e3, t3) {
      return n4 = e3, (void 0 === (r3 = t3).lower || (r3.lowerOpen ? 0 < st(n4, r3.lower) : 0 <= st(n4, r3.lower))) && (e3 = e3, void 0 === (t3 = t3).upper || (t3.upperOpen ? st(e3, t3.upper) < 0 : st(e3, t3.upper) <= 0));
      var n4, r3;
    }
    function Qn(e3, h3, t3, n4, r3, i3) {
      if (!t3 || 0 === t3.length) return e3;
      var o3 = h3.query.index, d3 = o3.multiEntry, p3 = h3.query.range, y3 = n4.schema.primaryKey.extractKey, v3 = o3.extractKey, a3 = (o3.lowLevelIndex || o3).extractKey, t3 = t3.reduce(function(e4, t4) {
        var n5 = e4, r4 = [];
        if ("add" === t4.type || "put" === t4.type) for (var i4 = new gn(), o4 = t4.values.length - 1; 0 <= o4; --o4) {
          var a4, u3 = t4.values[o4], s3 = y3(u3);
          i4.hasKey(s3) || (a4 = v3(u3), (d3 && x2(a4) ? a4.some(function(e5) {
            return $n(e5, p3);
          }) : $n(a4, p3)) && (i4.addKey(s3), r4.push(u3)));
        }
        switch (t4.type) {
          case "add":
            n5 = e4.concat(h3.values ? r4 : r4.map(function(e5) {
              return y3(e5);
            }));
            break;
          case "put":
            var c3 = new gn().addKeys(t4.values.map(function(e5) {
              return y3(e5);
            })), n5 = e4.filter(function(e5) {
              return !c3.hasKey(h3.values ? y3(e5) : e5);
            }).concat(h3.values ? r4 : r4.map(function(e5) {
              return y3(e5);
            }));
            break;
          case "delete":
            var l3 = new gn().addKeys(t4.keys);
            n5 = e4.filter(function(e5) {
              return !l3.hasKey(h3.values ? y3(e5) : e5);
            });
            break;
          case "deleteRange":
            var f3 = t4.range;
            n5 = e4.filter(function(e5) {
              return !$n(y3(e5), f3);
            });
        }
        return n5;
      }, e3);
      return t3 === e3 ? e3 : (t3.sort(function(e4, t4) {
        return st(a3(e4), a3(t4)) || st(y3(e4), y3(t4));
      }), h3.limit && h3.limit < 1 / 0 && (t3.length > h3.limit ? t3.length = h3.limit : e3.length === h3.limit && t3.length < h3.limit && (r3.dirty = true)), i3 ? Object.freeze(t3) : t3);
    }
    function Gn(e3, t3) {
      return 0 === st(e3.lower, t3.lower) && 0 === st(e3.upper, t3.upper) && !!e3.lowerOpen == !!t3.lowerOpen && !!e3.upperOpen == !!t3.upperOpen;
    }
    function Xn(e3, t3) {
      return function(e4, t4, n4, r3) {
        if (void 0 === e4) return void 0 !== t4 ? -1 : 0;
        if (void 0 === t4) return 1;
        if (0 === (t4 = st(e4, t4))) {
          if (n4 && r3) return 0;
          if (n4) return 1;
          if (r3) return -1;
        }
        return t4;
      }(e3.lower, t3.lower, e3.lowerOpen, t3.lowerOpen) <= 0 && 0 <= function(e4, t4, n4, r3) {
        if (void 0 === e4) return void 0 !== t4 ? 1 : 0;
        if (void 0 === t4) return -1;
        if (0 === (t4 = st(e4, t4))) {
          if (n4 && r3) return 0;
          if (n4) return -1;
          if (r3) return 1;
        }
        return t4;
      }(e3.upper, t3.upper, e3.upperOpen, t3.upperOpen);
    }
    function Hn(n4, r3, i3, e3) {
      n4.subscribers.add(i3), e3.addEventListener("abort", function() {
        var e4, t3;
        n4.subscribers.delete(i3), 0 === n4.subscribers.size && (e4 = n4, t3 = r3, setTimeout(function() {
          0 === e4.subscribers.size && T2(t3, e4);
        }, 3e3));
      });
    }
    var Jn = { stack: "dbcore", level: 0, name: "Cache", create: function(k3) {
      var O2 = k3.schema.name;
      return w2(w2({}, k3), { transaction: function(g3, w3, e3) {
        var _3, t3, x3 = k3.transaction(g3, w3, e3);
        return "readwrite" === w3 && (t3 = (_3 = new AbortController()).signal, e3 = function(b3) {
          return function() {
            if (_3.abort(), "readwrite" === w3) {
              for (var t4 = /* @__PURE__ */ new Set(), e4 = 0, n4 = g3; e4 < n4.length; e4++) {
                var r3 = n4[e4], i3 = Sn["idb://".concat(O2, "/").concat(r3)];
                if (i3) {
                  var o3 = k3.table(r3), a3 = i3.optimisticOps.filter(function(e5) {
                    return e5.trans === x3;
                  });
                  if (x3._explicit && b3 && x3.mutatedParts) for (var u3 = 0, s3 = Object.values(i3.queries.query); u3 < s3.length; u3++) for (var c3 = 0, l3 = (d3 = s3[u3]).slice(); c3 < l3.length; c3++) Kn((p3 = l3[c3]).obsSet, x3.mutatedParts) && (T2(d3, p3), p3.subscribers.forEach(function(e5) {
                    return t4.add(e5);
                  }));
                  else if (0 < a3.length) {
                    i3.optimisticOps = i3.optimisticOps.filter(function(e5) {
                      return e5.trans !== x3;
                    });
                    for (var f3 = 0, h3 = Object.values(i3.queries.query); f3 < h3.length; f3++) for (var d3, p3, y3, v3 = 0, m3 = (d3 = h3[f3]).slice(); v3 < m3.length; v3++) null != (p3 = m3[v3]).res && x3.mutatedParts && (b3 && !p3.dirty ? (y3 = Object.isFrozen(p3.res), y3 = Qn(p3.res, p3.req, a3, o3, p3, y3), p3.dirty ? (T2(d3, p3), p3.subscribers.forEach(function(e5) {
                      return t4.add(e5);
                    })) : y3 !== p3.res && (p3.res = y3, p3.promise = _e.resolve({ result: y3 }))) : (p3.dirty && T2(d3, p3), p3.subscribers.forEach(function(e5) {
                      return t4.add(e5);
                    })));
                  }
                }
              }
              t4.forEach(function(e5) {
                return e5();
              });
            }
          };
        }, x3.addEventListener("abort", e3(false), { signal: t3 }), x3.addEventListener("error", e3(false), { signal: t3 }), x3.addEventListener("complete", e3(true), { signal: t3 })), x3;
      }, table: function(c3) {
        var l3 = k3.table(c3), i3 = l3.schema.primaryKey;
        return w2(w2({}, l3), { mutate: function(t3) {
          var e3 = me.trans;
          if (i3.outbound || "disabled" === e3.db._options.cache || e3.explicit) return l3.mutate(t3);
          var n4 = Sn["idb://".concat(O2, "/").concat(c3)];
          if (!n4) return l3.mutate(t3);
          e3 = l3.mutate(t3);
          return "add" !== t3.type && "put" !== t3.type || !(50 <= t3.values.length || Mn(i3, t3).some(function(e4) {
            return null == e4;
          })) ? (n4.optimisticOps.push(t3), t3.mutatedParts && Cn(t3.mutatedParts), e3.then(function(e4) {
            0 < e4.numFailures && (T2(n4.optimisticOps, t3), (e4 = Yn(0, t3, e4)) && n4.optimisticOps.push(e4), t3.mutatedParts && Cn(t3.mutatedParts));
          }), e3.catch(function() {
            T2(n4.optimisticOps, t3), t3.mutatedParts && Cn(t3.mutatedParts);
          })) : e3.then(function(r3) {
            var e4 = Yn(0, w2(w2({}, t3), { values: t3.values.map(function(e5, t4) {
              var n5, e5 = null !== (n5 = i3.keyPath) && void 0 !== n5 && n5.includes(".") ? S2(e5) : w2({}, e5);
              return P2(e5, i3.keyPath, r3.results[t4]), e5;
            }) }), r3);
            n4.optimisticOps.push(e4), queueMicrotask(function() {
              return t3.mutatedParts && Cn(t3.mutatedParts);
            });
          }), e3;
        }, query: function(t3) {
          if (!Vn(me, l3) || !zn("query", t3)) return l3.query(t3);
          var i4 = "immutable" === (null === (o3 = me.trans) || void 0 === o3 ? void 0 : o3.db._options.cache), e3 = me, n4 = e3.requery, r3 = e3.signal, o3 = function(e4, t4, n5, r4) {
            var i5 = Sn["idb://".concat(e4, "/").concat(t4)];
            if (!i5) return [];
            if (!(t4 = i5.queries[n5])) return [null, false, i5, null];
            var o4 = t4[(r4.query ? r4.query.index.name : null) || ""];
            if (!o4) return [null, false, i5, null];
            switch (n5) {
              case "query":
                var a4 = o4.find(function(e5) {
                  return e5.req.limit === r4.limit && e5.req.values === r4.values && Gn(e5.req.query.range, r4.query.range);
                });
                return a4 ? [a4, true, i5, o4] : [o4.find(function(e5) {
                  return ("limit" in e5.req ? e5.req.limit : 1 / 0) >= r4.limit && (!r4.values || e5.req.values) && Xn(e5.req.query.range, r4.query.range);
                }), false, i5, o4];
              case "count":
                a4 = o4.find(function(e5) {
                  return Gn(e5.req.query.range, r4.query.range);
                });
                return [a4, !!a4, i5, o4];
            }
          }(O2, c3, "query", t3), a3 = o3[0], e3 = o3[1], u3 = o3[2], s3 = o3[3];
          return a3 && e3 ? a3.obsSet = t3.obsSet : (e3 = l3.query(t3).then(function(e4) {
            var t4 = e4.result;
            if (a3 && (a3.res = t4), i4) {
              for (var n5 = 0, r4 = t4.length; n5 < r4; ++n5) Object.freeze(t4[n5]);
              Object.freeze(t4);
            } else e4.result = S2(t4);
            return e4;
          }).catch(function(e4) {
            return s3 && a3 && T2(s3, a3), Promise.reject(e4);
          }), a3 = { obsSet: t3.obsSet, promise: e3, subscribers: /* @__PURE__ */ new Set(), type: "query", req: t3, dirty: false }, s3 ? s3.push(a3) : (s3 = [a3], (u3 = u3 || (Sn["idb://".concat(O2, "/").concat(c3)] = { queries: { query: {}, count: {} }, objs: /* @__PURE__ */ new Map(), optimisticOps: [], unsignaledParts: {} })).queries.query[t3.query.index.name || ""] = s3)), Hn(a3, s3, n4, r3), a3.promise.then(function(e4) {
            return { result: Qn(e4.result, t3, null == u3 ? void 0 : u3.optimisticOps, l3, a3, i4) };
          });
        } });
      } });
    } };
    function Zn(e3, r3) {
      return new Proxy(e3, { get: function(e4, t3, n4) {
        return "db" === t3 ? r3 : Reflect.get(e4, t3, n4);
      } });
    }
    var er = (tr.prototype.version = function(t3) {
      if (isNaN(t3) || t3 < 0.1) throw new Y.Type("Given version is not a positive number");
      if (t3 = Math.round(10 * t3) / 10, this.idbdb || this._state.isBeingOpened) throw new Y.Schema("Cannot add version when database is open");
      this.verno = Math.max(this.verno, t3);
      var e3 = this._versions, n4 = e3.filter(function(e4) {
        return e4._cfg.version === t3;
      })[0];
      return n4 || (n4 = new this.Version(t3), e3.push(n4), e3.sort(nn), n4.stores({}), this._state.autoSchema = false, n4);
    }, tr.prototype._whenReady = function(e3) {
      var n4 = this;
      return this.idbdb && (this._state.openComplete || me.letThrough || this._vip) ? e3() : new _e(function(e4, t3) {
        if (n4._state.openComplete) return t3(new Y.DatabaseClosed(n4._state.dbOpenError));
        if (!n4._state.isBeingOpened) {
          if (!n4._state.autoOpen) return void t3(new Y.DatabaseClosed());
          n4.open().catch(G);
        }
        n4._state.dbReadyPromise.then(e4, t3);
      }).then(e3);
    }, tr.prototype.use = function(e3) {
      var t3 = e3.stack, n4 = e3.create, r3 = e3.level, i3 = e3.name;
      i3 && this.unuse({ stack: t3, name: i3 });
      e3 = this._middlewares[t3] || (this._middlewares[t3] = []);
      return e3.push({ stack: t3, create: n4, level: null == r3 ? 10 : r3, name: i3 }), e3.sort(function(e4, t4) {
        return e4.level - t4.level;
      }), this;
    }, tr.prototype.unuse = function(e3) {
      var t3 = e3.stack, n4 = e3.name, r3 = e3.create;
      return t3 && this._middlewares[t3] && (this._middlewares[t3] = this._middlewares[t3].filter(function(e4) {
        return r3 ? e4.create !== r3 : !!n4 && e4.name !== n4;
      })), this;
    }, tr.prototype.open = function() {
      var e3 = this;
      return $e(ve, function() {
        return qn(e3);
      });
    }, tr.prototype._close = function() {
      var n4 = this._state, e3 = et.indexOf(this);
      if (0 <= e3 && et.splice(e3, 1), this.idbdb) {
        try {
          this.idbdb.close();
        } catch (e4) {
        }
        this.idbdb = null;
      }
      n4.isBeingOpened || (n4.dbReadyPromise = new _e(function(e4) {
        n4.dbReadyResolve = e4;
      }), n4.openCanceller = new _e(function(e4, t3) {
        n4.cancelOpen = t3;
      }));
    }, tr.prototype.close = function(e3) {
      var t3 = (void 0 === e3 ? { disableAutoOpen: true } : e3).disableAutoOpen, e3 = this._state;
      t3 ? (e3.isBeingOpened && e3.cancelOpen(new Y.DatabaseClosed()), this._close(), e3.autoOpen = false, e3.dbOpenError = new Y.DatabaseClosed()) : (this._close(), e3.autoOpen = this._options.autoOpen || e3.isBeingOpened, e3.openComplete = false, e3.dbOpenError = null);
    }, tr.prototype.delete = function(n4) {
      var i3 = this;
      void 0 === n4 && (n4 = { disableAutoOpen: true });
      var o3 = 0 < arguments.length && "object" != typeof arguments[0], a3 = this._state;
      return new _e(function(r3, t3) {
        function e3() {
          i3.close(n4);
          var e4 = i3._deps.indexedDB.deleteDatabase(i3.name);
          e4.onsuccess = Te(function() {
            var e5, t4, n5;
            e5 = i3._deps, t4 = i3.name, n5 = e5.indexedDB, e5 = e5.IDBKeyRange, vn(n5) || t4 === tt || yn(n5, e5).delete(t4).catch(G), r3();
          }), e4.onerror = Bt(t3), e4.onblocked = i3._fireOnBlocked;
        }
        if (o3) throw new Y.InvalidArgument("Invalid closeOptions argument to db.delete()");
        a3.isBeingOpened ? a3.dbReadyPromise.then(e3) : e3();
      });
    }, tr.prototype.backendDB = function() {
      return this.idbdb;
    }, tr.prototype.isOpen = function() {
      return null !== this.idbdb;
    }, tr.prototype.hasBeenClosed = function() {
      var e3 = this._state.dbOpenError;
      return e3 && "DatabaseClosed" === e3.name;
    }, tr.prototype.hasFailed = function() {
      return null !== this._state.dbOpenError;
    }, tr.prototype.dynamicallyOpened = function() {
      return this._state.autoSchema;
    }, Object.defineProperty(tr.prototype, "tables", { get: function() {
      var t3 = this;
      return _2(this._allTables).map(function(e3) {
        return t3._allTables[e3];
      });
    }, enumerable: false, configurable: true }), tr.prototype.transaction = function() {
      var e3 = (function(e4, t3, n4) {
        var r3 = arguments.length;
        if (r3 < 2) throw new Y.InvalidArgument("Too few arguments");
        for (var i3 = new Array(r3 - 1); --r3; ) i3[r3 - 1] = arguments[r3];
        return n4 = i3.pop(), [e4, O(i3), n4];
      }).apply(this, arguments);
      return this._transaction.apply(this, e3);
    }, tr.prototype._transaction = function(e3, t3, n4) {
      var r3 = this, i3 = me.trans;
      i3 && i3.db === this && -1 === e3.indexOf("!") || (i3 = null);
      var o3, a3, u3 = -1 !== e3.indexOf("?");
      e3 = e3.replace("!", "").replace("?", "");
      try {
        if (a3 = t3.map(function(e4) {
          e4 = e4 instanceof r3.Table ? e4.name : e4;
          if ("string" != typeof e4) throw new TypeError("Invalid table argument to Dexie.transaction(). Only Table or String are allowed");
          return e4;
        }), "r" == e3 || e3 === nt) o3 = nt;
        else {
          if ("rw" != e3 && e3 != rt) throw new Y.InvalidArgument("Invalid transaction mode: " + e3);
          o3 = rt;
        }
        if (i3) {
          if (i3.mode === nt && o3 === rt) {
            if (!u3) throw new Y.SubTransaction("Cannot enter a sub-transaction with READWRITE mode when parent transaction is READONLY");
            i3 = null;
          }
          i3 && a3.forEach(function(e4) {
            if (i3 && -1 === i3.storeNames.indexOf(e4)) {
              if (!u3) throw new Y.SubTransaction("Table " + e4 + " not included in parent transaction.");
              i3 = null;
            }
          }), u3 && i3 && !i3.active && (i3 = null);
        }
      } catch (n5) {
        return i3 ? i3._promise(null, function(e4, t4) {
          t4(n5);
        }) : Xe(n5);
      }
      var s3 = (function i4(o4, a4, u4, s4, c3) {
        return _e.resolve().then(function() {
          var e4 = me.transless || me, t4 = o4._createTransaction(a4, u4, o4._dbSchema, s4);
          if (t4.explicit = true, e4 = { trans: t4, transless: e4 }, s4) t4.idbtrans = s4.idbtrans;
          else try {
            t4.create(), t4.idbtrans._explicit = true, o4._state.PR1398_maxLoop = 3;
          } catch (e5) {
            return e5.name === z.InvalidState && o4.isOpen() && 0 < --o4._state.PR1398_maxLoop ? (console.warn("Dexie: Need to reopen db"), o4.close({ disableAutoOpen: false }), o4.open().then(function() {
              return i4(o4, a4, u4, null, c3);
            })) : Xe(e5);
          }
          var n5, r4 = B(c3);
          return r4 && Le(), e4 = _e.follow(function() {
            var e5;
            (n5 = c3.call(t4, t4)) && (r4 ? (e5 = Ue.bind(null, null), n5.then(e5, e5)) : "function" == typeof n5.next && "function" == typeof n5.throw && (n5 = In(n5)));
          }, e4), (n5 && "function" == typeof n5.then ? _e.resolve(n5).then(function(e5) {
            return t4.active ? e5 : Xe(new Y.PrematureCommit("Transaction committed too early. See http://bit.ly/2kdckMn"));
          }) : e4.then(function() {
            return n5;
          })).then(function(e5) {
            return s4 && t4._resolve(), t4._completion.then(function() {
              return e5;
            });
          }).catch(function(e5) {
            return t4._reject(e5), Xe(e5);
          });
        });
      }).bind(null, this, o3, a3, i3, n4);
      return i3 ? i3._promise(o3, s3, "lock") : me.trans ? $e(me.transless, function() {
        return r3._whenReady(s3);
      }) : this._whenReady(s3);
    }, tr.prototype.table = function(e3) {
      if (!m2(this._allTables, e3)) throw new Y.InvalidTable("Table ".concat(e3, " does not exist"));
      return this._allTables[e3];
    }, tr);
    function tr(e3, t3) {
      var o3 = this;
      this._middlewares = {}, this.verno = 0;
      var n4 = tr.dependencies;
      this._options = t3 = w2({ addons: tr.addons, autoOpen: true, indexedDB: n4.indexedDB, IDBKeyRange: n4.IDBKeyRange, cache: "cloned" }, t3), this._deps = { indexedDB: t3.indexedDB, IDBKeyRange: t3.IDBKeyRange };
      n4 = t3.addons;
      this._dbSchema = {}, this._versions = [], this._storeNames = [], this._allTables = {}, this.idbdb = null, this._novip = this;
      var a3, r3, u3, i3, s3, c3 = { dbOpenError: null, isBeingOpened: false, onReadyBeingFired: null, openComplete: false, dbReadyResolve: G, dbReadyPromise: null, cancelOpen: G, openCanceller: null, autoSchema: true, PR1398_maxLoop: 3, autoOpen: t3.autoOpen };
      c3.dbReadyPromise = new _e(function(e4) {
        c3.dbReadyResolve = e4;
      }), c3.openCanceller = new _e(function(e4, t4) {
        c3.cancelOpen = t4;
      }), this._state = c3, this.name = e3, this.on = dt(this, "populate", "blocked", "versionchange", "close", { ready: [re, G] }), this.on.ready.subscribe = p2(this.on.ready.subscribe, function(i4) {
        return function(n5, r4) {
          tr.vip(function() {
            var t4, e4 = o3._state;
            e4.openComplete ? (e4.dbOpenError || _e.resolve().then(n5), r4 && i4(n5)) : e4.onReadyBeingFired ? (e4.onReadyBeingFired.push(n5), r4 && i4(n5)) : (i4(n5), t4 = o3, r4 || i4(function e5() {
              t4.on.ready.unsubscribe(n5), t4.on.ready.unsubscribe(e5);
            }));
          });
        };
      }), this.Collection = (a3 = this, pt(Ot.prototype, function(e4, t4) {
        this.db = a3;
        var n5 = ot, r4 = null;
        if (t4) try {
          n5 = t4();
        } catch (e5) {
          r4 = e5;
        }
        var i4 = e4._ctx, t4 = i4.table, e4 = t4.hook.reading.fire;
        this._ctx = { table: t4, index: i4.index, isPrimKey: !i4.index || t4.schema.primKey.keyPath && i4.index === t4.schema.primKey.name, range: n5, keysOnly: false, dir: "next", unique: "", algorithm: null, filter: null, replayFilter: null, justLimit: true, isMatch: null, offset: 0, limit: 1 / 0, error: r4, or: i4.or, valueMapper: e4 !== X ? e4 : null };
      })), this.Table = (r3 = this, pt(ft.prototype, function(e4, t4, n5) {
        this.db = r3, this._tx = n5, this.name = e4, this.schema = t4, this.hook = r3._allTables[e4] ? r3._allTables[e4].hook : dt(null, { creating: [Z2, G], reading: [H2, X], updating: [te, G], deleting: [ee, G] });
      })), this.Transaction = (u3 = this, pt(Lt.prototype, function(e4, t4, n5, r4, i4) {
        var o4 = this;
        this.db = u3, this.mode = e4, this.storeNames = t4, this.schema = n5, this.chromeTransactionDurability = r4, this.idbtrans = null, this.on = dt(this, "complete", "error", "abort"), this.parent = i4 || null, this.active = true, this._reculock = 0, this._blockedFuncs = [], this._resolve = null, this._reject = null, this._waitingFor = null, this._waitingQueue = null, this._spinCount = 0, this._completion = new _e(function(e5, t5) {
          o4._resolve = e5, o4._reject = t5;
        }), this._completion.then(function() {
          o4.active = false, o4.on.complete.fire();
        }, function(e5) {
          var t5 = o4.active;
          return o4.active = false, o4.on.error.fire(e5), o4.parent ? o4.parent._reject(e5) : t5 && o4.idbtrans && o4.idbtrans.abort(), Xe(e5);
        });
      })), this.Version = (i3 = this, pt(dn.prototype, function(e4) {
        this.db = i3, this._cfg = { version: e4, storesSource: null, dbschema: {}, tables: {}, contentUpgrade: null };
      })), this.WhereClause = (s3 = this, pt(qt.prototype, function(e4, t4, n5) {
        if (this.db = s3, this._ctx = { table: e4, index: ":id" === t4 ? null : t4, or: n5 }, this._cmp = this._ascending = st, this._descending = function(e5, t5) {
          return st(t5, e5);
        }, this._max = function(e5, t5) {
          return 0 < st(e5, t5) ? e5 : t5;
        }, this._min = function(e5, t5) {
          return st(e5, t5) < 0 ? e5 : t5;
        }, this._IDBKeyRange = s3._deps.IDBKeyRange, !this._IDBKeyRange) throw new Y.MissingAPI();
      })), this.on("versionchange", function(e4) {
        0 < e4.newVersion ? console.warn("Another connection wants to upgrade database '".concat(o3.name, "'. Closing db now to resume the upgrade.")) : console.warn("Another connection wants to delete database '".concat(o3.name, "'. Closing db now to resume the delete request.")), o3.close({ disableAutoOpen: false });
      }), this.on("blocked", function(e4) {
        !e4.newVersion || e4.newVersion < e4.oldVersion ? console.warn("Dexie.delete('".concat(o3.name, "') was blocked")) : console.warn("Upgrade '".concat(o3.name, "' blocked by other connection holding version ").concat(e4.oldVersion / 10));
      }), this._maxKey = Yt(t3.IDBKeyRange), this._createTransaction = function(e4, t4, n5, r4) {
        return new o3.Transaction(e4, t4, n5, o3._options.chromeTransactionDurability, r4);
      }, this._fireOnBlocked = function(t4) {
        o3.on("blocked").fire(t4), et.filter(function(e4) {
          return e4.name === o3.name && e4 !== o3 && !e4._state.vcFired;
        }).map(function(e4) {
          return e4.on("versionchange").fire(t4);
        });
      }, this.use(Un), this.use(Jn), this.use(Wn), this.use(Rn), this.use(Nn);
      var l3 = new Proxy(this, { get: function(e4, t4, n5) {
        if ("_vip" === t4) return true;
        if ("table" === t4) return function(e5) {
          return Zn(o3.table(e5), l3);
        };
        var r4 = Reflect.get(e4, t4, n5);
        return r4 instanceof ft ? Zn(r4, l3) : "tables" === t4 ? r4.map(function(e5) {
          return Zn(e5, l3);
        }) : "_createTransaction" === t4 ? function() {
          return Zn(r4.apply(this, arguments), l3);
        } : r4;
      } });
      this.vip = l3, n4.forEach(function(e4) {
        return e4(o3);
      });
    }
    var nr, F = "undefined" != typeof Symbol && "observable" in Symbol ? Symbol.observable : "@@observable", rr = (ir.prototype.subscribe = function(e3, t3, n4) {
      return this._subscribe(e3 && "function" != typeof e3 ? e3 : { next: e3, error: t3, complete: n4 });
    }, ir.prototype[F] = function() {
      return this;
    }, ir);
    function ir(e3) {
      this._subscribe = e3;
    }
    try {
      nr = { indexedDB: f2.indexedDB || f2.mozIndexedDB || f2.webkitIndexedDB || f2.msIndexedDB, IDBKeyRange: f2.IDBKeyRange || f2.webkitIDBKeyRange };
    } catch (e3) {
      nr = { indexedDB: null, IDBKeyRange: null };
    }
    function or(h3) {
      var d3, p3 = false, e3 = new rr(function(r3) {
        var i3 = B(h3);
        var o3, a3 = false, u3 = {}, s3 = {}, e4 = { get closed() {
          return a3;
        }, unsubscribe: function() {
          a3 || (a3 = true, o3 && o3.abort(), c3 && Nt.storagemutated.unsubscribe(f3));
        } };
        r3.start && r3.start(e4);
        var c3 = false, l3 = function() {
          return Ge(t3);
        };
        var f3 = function(e5) {
          En(u3, e5), Kn(s3, u3) && l3();
        }, t3 = function() {
          var t4, n4, e5;
          !a3 && nr.indexedDB && (u3 = {}, t4 = {}, o3 && o3.abort(), o3 = new AbortController(), e5 = function(e6) {
            var t5 = je();
            try {
              i3 && Le();
              var n5 = Ne(h3, e6);
              return n5 = i3 ? n5.finally(Ue) : n5;
            } finally {
              t5 && Ae();
            }
          }(n4 = { subscr: t4, signal: o3.signal, requery: l3, querier: h3, trans: null }), Promise.resolve(e5).then(function(e6) {
            p3 = true, d3 = e6, a3 || n4.signal.aborted || (u3 = {}, function(e7) {
              for (var t5 in e7) if (m2(e7, t5)) return;
              return 1;
            }(s3 = t4) || c3 || (Nt(Ft, f3), c3 = true), Ge(function() {
              return !a3 && r3.next && r3.next(e6);
            }));
          }, function(e6) {
            p3 = false, ["DatabaseClosedError", "AbortError"].includes(null == e6 ? void 0 : e6.name) || a3 || Ge(function() {
              a3 || r3.error && r3.error(e6);
            });
          }));
        };
        return setTimeout(l3, 0), e4;
      });
      return e3.hasValue = function() {
        return p3;
      }, e3.getValue = function() {
        return d3;
      }, e3;
    }
    var ar = er;
    function ur(e3) {
      var t3 = cr;
      try {
        cr = true, Nt.storagemutated.fire(e3), Dn(e3, true);
      } finally {
        cr = t3;
      }
    }
    r2(ar, w2(w2({}, Q), { delete: function(e3) {
      return new ar(e3, { addons: [] }).delete();
    }, exists: function(e3) {
      return new ar(e3, { addons: [] }).open().then(function(e4) {
        return e4.close(), true;
      }).catch("NoSuchDatabaseError", function() {
        return false;
      });
    }, getDatabaseNames: function(e3) {
      try {
        return t3 = ar.dependencies, n4 = t3.indexedDB, t3 = t3.IDBKeyRange, (vn(n4) ? Promise.resolve(n4.databases()).then(function(e4) {
          return e4.map(function(e5) {
            return e5.name;
          }).filter(function(e5) {
            return e5 !== tt;
          });
        }) : yn(n4, t3).toCollection().primaryKeys()).then(e3);
      } catch (e4) {
        return Xe(new Y.MissingAPI());
      }
      var t3, n4;
    }, defineClass: function() {
      return function(e3) {
        a2(this, e3);
      };
    }, ignoreTransaction: function(e3) {
      return me.trans ? $e(me.transless, e3) : e3();
    }, vip: mn, async: function(t3) {
      return function() {
        try {
          var e3 = In(t3.apply(this, arguments));
          return e3 && "function" == typeof e3.then ? e3 : _e.resolve(e3);
        } catch (e4) {
          return Xe(e4);
        }
      };
    }, spawn: function(e3, t3, n4) {
      try {
        var r3 = In(e3.apply(n4, t3 || []));
        return r3 && "function" == typeof r3.then ? r3 : _e.resolve(r3);
      } catch (e4) {
        return Xe(e4);
      }
    }, currentTransaction: { get: function() {
      return me.trans || null;
    } }, waitFor: function(e3, t3) {
      t3 = _e.resolve("function" == typeof e3 ? ar.ignoreTransaction(e3) : e3).timeout(t3 || 6e4);
      return me.trans ? me.trans.waitFor(t3) : t3;
    }, Promise: _e, debug: { get: function() {
      return ie;
    }, set: function(e3) {
      oe(e3);
    } }, derive: o2, extend: a2, props: r2, override: p2, Events: dt, on: Nt, liveQuery: or, extendObservabilitySet: En, getByKeyPath: k2, setByKeyPath: P2, delByKeyPath: function(t3, e3) {
      "string" == typeof e3 ? P2(t3, e3, void 0) : "length" in e3 && [].map.call(e3, function(e4) {
        P2(t3, e4, void 0);
      });
    }, shallowClone: g2, deepClone: S2, getObjectDiff: Fn, cmp: st, asap: v2, minKey: -1 / 0, addons: [], connections: et, errnames: z, dependencies: nr, cache: Sn, semVer: "4.0.8", version: "4.0.8".split(".").map(function(e3) {
      return parseInt(e3);
    }).reduce(function(e3, t3, n4) {
      return e3 + t3 / Math.pow(10, 2 * n4);
    }) })), ar.maxKey = Yt(ar.dependencies.IDBKeyRange), "undefined" != typeof dispatchEvent && "undefined" != typeof addEventListener && (Nt(Ft, function(e3) {
      cr || (e3 = new CustomEvent(Mt, { detail: e3 }), cr = true, dispatchEvent(e3), cr = false);
    }), addEventListener(Mt, function(e3) {
      e3 = e3.detail;
      cr || ur(e3);
    }));
    var sr, cr = false, lr = function() {
    };
    return "undefined" != typeof BroadcastChannel && ((lr = function() {
      (sr = new BroadcastChannel(Mt)).onmessage = function(e3) {
        return e3.data && ur(e3.data);
      };
    })(), "function" == typeof sr.unref && sr.unref(), Nt(Ft, function(e3) {
      cr || sr.postMessage(e3);
    })), "undefined" != typeof addEventListener && (addEventListener("pagehide", function(e3) {
      if (!er.disableBfCache && e3.persisted) {
        ie && console.debug("Dexie: handling persisted pagehide"), null != sr && sr.close();
        for (var t3 = 0, n4 = et; t3 < n4.length; t3++) n4[t3].close({ disableAutoOpen: false });
      }
    }), addEventListener("pageshow", function(e3) {
      !er.disableBfCache && e3.persisted && (ie && console.debug("Dexie: handling persisted pageshow"), lr(), ur({ all: new gn(-1 / 0, [[]]) }));
    })), _e.rejectionMapper = function(e3, t3) {
      return !e3 || e3 instanceof N2 || e3 instanceof TypeError || e3 instanceof SyntaxError || !e3.name || !$2[e3.name] ? e3 : (t3 = new $2[e3.name](t3 || e3.message, e3), "stack" in e3 && l2(t3, "stack", { get: function() {
        return this.inner.stack;
      } }), t3);
    }, oe(ie), w2(er, Object.freeze({ __proto__: null, Dexie: er, liveQuery: or, Entity: ut, cmp: st, PropModSymbol: e2, PropModification: xt, replacePrefix: function(e3, t3) {
      return new xt({ replacePrefix: [e3, t3] });
    }, add: function(e3) {
      return new xt({ add: e3 });
    }, remove: function(e3) {
      return new xt({ remove: e3 });
    }, default: er, RangeSet: gn, mergeRanges: _n, rangesOverlap: xn }), { default: er }), er;
  });
})(dexie_min);
var dexie_minExports = dexie_min.exports;
const _Dexie = /* @__PURE__ */ getDefaultExportFromCjs(dexie_minExports);
const DexieSymbol = Symbol.for("Dexie");
const Dexie = globalThis[DexieSymbol] || (globalThis[DexieSymbol] = _Dexie);
if (_Dexie.semVer !== Dexie.semVer) {
  throw new Error(`Two different versions of Dexie loaded in the same app: ${_Dexie.semVer} and ${Dexie.semVer}`);
}
class KioskTimeZones {
  constructor(kioskApi) {
    this.apiContext = void 0;
    this.db = void 0;
    this.hasRefreshedFavourites = false;
    this.hasRefreshedAll = false;
    this.localCache = /* @__PURE__ */ new Map();
    this.apiContext = kioskApi;
    this.db = this.initDb();
  }
  initDb() {
    const db = new Dexie("KioskTimeZones");
    db.version(1).stores({
      kioskTimeZones: "&id, tz_long, tz_IANA, deprecated, version, favourite"
    });
    return db;
  }
  getLocalCache() {
    return this.localCache;
  }
  async getFavouriteTimeZones(includeDeprecated = false, refreshAfterwards = false) {
    if (this.db) {
      const c2 = await this.db.kioskTimeZones.count();
      let favourites;
      if (c2 == 0) {
        await this.refreshFavourites();
      }
      if (!includeDeprecated) {
        favourites = await this.db.kioskTimeZones.where({ "deprecated": 0, "favourite": 1 }).toArray();
      } else {
        favourites = await this.db.kioskTimeZones.where({ "favourite": 1 }).toArray();
      }
      if (refreshAfterwards) {
        this.refreshFavourites().finally(() => {
          console.log("refreshed favourites");
        });
      }
      return favourites;
    } else return [];
  }
  async refreshFavourites() {
    var _a2, _b;
    if (!this.db) return [];
    if (!this.hasRefreshedFavourites) {
      const json = await this.fetchFavouriteTimeZones();
      if (json && json.length > 0) {
        let cDeleted = await ((_a2 = this.db) == null ? void 0 : _a2.kioskTimeZones.where("favourite").equals(1).delete());
        console.log(`Deleted ${cDeleted} favourite time zones`);
        const timeZones = json.map((tz) => {
          return {
            id: tz.id,
            tz_IANA: tz.tz_IANA,
            tz_long: tz.tz_long,
            deprecated: tz.deprecated ? 1 : 0,
            version: tz.version,
            favourite: 1
          };
        });
        let c2 = await ((_b = this.db) == null ? void 0 : _b.kioskTimeZones.bulkAdd(timeZones));
        console.log(`Added ${c2} new favourite time zones`);
        this.hasRefreshedFavourites = true;
        return timeZones;
      }
    }
    return [];
  }
  async fetchFavouriteTimeZones() {
    var _a2;
    return await ((_a2 = this.apiContext) == null ? void 0 : _a2.fetchFromApi(
      "",
      "favouritetimezones",
      {
        method: "GET",
        caller: "app.fetchFavouriteTimeZones"
      }
    ).then((json) => {
      console.log("favourite time zone information fetched");
      return json;
    }).catch((e2) => {
      console.log(`fetching time zone information failed: ${e2}`);
      return [];
    }));
  }
  async fetchAllTimeZones(newerThan = 0) {
    var _a2;
    const urlSearchParams = new URLSearchParams();
    urlSearchParams.append("include_deprecated", "true");
    if (newerThan > 0) urlSearchParams.append("newer_than", `${newerThan}`);
    return await ((_a2 = this.apiContext) == null ? void 0 : _a2.fetchFromApi(
      "",
      "timezones",
      {
        method: "GET",
        caller: "app.fetchFavouriteTimeZones"
      },
      "v1",
      urlSearchParams
    ).then((json) => {
      console.log("time zone information fetched");
      return json;
    }).catch((e2) => {
      console.log(`time zone information failed: ${e2}`);
      return [];
    }));
  }
  async getAllTimeZones(deprecated = false, forceReload = false) {
    var _a2;
    await this.refreshAllTimeZones(forceReload);
    let allTimeZones = await ((_a2 = this.db) == null ? void 0 : _a2.kioskTimeZones.toArray());
    return allTimeZones == null ? void 0 : allTimeZones.filter((tz) => tz.deprecated == 0 || deprecated);
  }
  async getTimeZoneByIndex(tzIndex, forceReload = false) {
    if (!this.db) return;
    await this.refreshAllTimeZones(forceReload);
    let results = await this.db.kioskTimeZones.where("id").equals(tzIndex).toArray();
    return results.length > 0 ? results[0] : void 0;
  }
  /**
   * Asynchronously caches the time zone information locally based on the provided timezone index.
   * Locally cached time zone information can be retrieved synchronously using getTimeZoneInfoFromLocalCache
   * @param tzIndex a Kiosk Time Zone Index
   * @param tryRefresh Flag indicating whether to refresh the timezone information if not found in the cache.
   * @returns A Promise that resolves to the cached TimeZone object if found, otherwise undefined.
   */
  async cacheLocally(tzIndex, tryRefresh = false) {
    if (!this.db) return void 0;
    if (typeof tzIndex !== "number") return void 0;
    let tzInfo = this.localCache.get(tzIndex);
    if (tzInfo) return tzInfo;
    tzInfo = await this.getTimeZoneByIndex(tzIndex);
    if (!tzInfo) {
      if (!tryRefresh) return void 0;
      await this.refreshAllTimeZones(false);
      tzInfo = await this.getTimeZoneByIndex(tzIndex);
    }
    if (tzInfo) {
      console.log("Cached TimeZone", tzInfo);
      this.localCache.set(tzIndex, tzInfo);
    }
    return this.localCache.get(tzIndex);
  }
  /**
   * Retrieves timezone information from the local cache based on the provided timezone index.
   * Unlike other methods this is synchronous.
   * @param tzIndex - The index of the timezone to retrieve information for.
   * @returns a TimeZone instance if found in the local cache, otherwise undefined.
   */
  getTimeZoneInfoFromLocalCache(tzIndex) {
    if (typeof tzIndex === "string") tzIndex = parseInt(tzIndex);
    if (!tzIndex) return;
    return this.localCache.get(tzIndex);
  }
  async refreshAllTimeZones(forceReload) {
    let allTimeZones = [];
    if (!this.db) return;
    if (forceReload || !this.hasRefreshedAll) {
      let maxVersion = 0;
      const favourites = (await this.getFavouriteTimeZones()).filter((t2) => t2.favourite == 1).map((t2) => t2.id);
      if (!forceReload) {
        try {
          maxVersion = (await this.db.kioskTimeZones.where("favourite").equals(0).reverse().sortBy("version"))[0].version;
          console.log(`max version was ${maxVersion}`);
        } catch {
        }
      }
      const json = await this.fetchAllTimeZones(maxVersion);
      if (json && json.length > 0) {
        let c2 = await this.db.kioskTimeZones.where("version").above(maxVersion).delete();
        console.log(`delete ${c2} time zones above version ${maxVersion}`);
        allTimeZones = json.map((tz) => {
          return {
            id: tz.id,
            tz_IANA: tz.tz_IANA,
            tz_long: tz.tz_long,
            deprecated: tz.deprecated ? 1 : 0,
            version: tz.version,
            favourite: favourites.includes(tz.id) ? 1 : 0
          };
        });
        c2 = await this.db.kioskTimeZones.bulkAdd(allTimeZones);
        console.log(`added ${c2} new time zones `);
      }
      this.hasRefreshedAll = true;
    }
  }
}
export {
  KioskTimeZones,
  kioskdatetime,
  kioskstandardlib,
  luxon
};
