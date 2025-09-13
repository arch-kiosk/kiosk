function xu(s, e, r = 0) {
  let i = /* @__PURE__ */ new Date();
  i.setTime(i.getTime() + r * 24 * 60 * 60 * 1e3);
  let a = "expires=" + i.toUTCString();
  document.cookie = s + "=" + e + ";" + a + ";path=/";
}
function xt(s) {
  let e = s + "=", i = decodeURIComponent(document.cookie).split(";");
  for (let a = 0; a < i.length; a++) {
    let c = i[a];
    for (; c.charAt(0) === " "; )
      c = c.substring(1);
    if (c.indexOf(e) === 0)
      return c.substring(e.length, c.length);
  }
  return "";
}
const sf = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  getCookie: xt,
  setCookie: xu
}, Symbol.toStringTag, { value: "Module" }));
class At extends Error {
}
class Ou extends At {
  constructor(e) {
    super(`Invalid DateTime: ${e.toMessage()}`);
  }
}
class Eu extends At {
  constructor(e) {
    super(`Invalid Interval: ${e.toMessage()}`);
  }
}
class Iu extends At {
  constructor(e) {
    super(`Invalid Duration: ${e.toMessage()}`);
  }
}
class Bt extends At {
}
class Do extends At {
  constructor(e) {
    super(`Invalid unit ${e}`);
  }
}
class be extends At {
}
class tt extends At {
  constructor() {
    super("Zone is an abstract class");
  }
}
const U = "numeric", Fe = "short", Oe = "long", xr = {
  year: U,
  month: U,
  day: U
}, Mo = {
  year: U,
  month: Fe,
  day: U
}, Au = {
  year: U,
  month: Fe,
  day: U,
  weekday: Fe
}, No = {
  year: U,
  month: Oe,
  day: U
}, Po = {
  year: U,
  month: Oe,
  day: U,
  weekday: Oe
}, Fo = {
  hour: U,
  minute: U
}, Ro = {
  hour: U,
  minute: U,
  second: U
}, Vo = {
  hour: U,
  minute: U,
  second: U,
  timeZoneName: Fe
}, Uo = {
  hour: U,
  minute: U,
  second: U,
  timeZoneName: Oe
}, qo = {
  hour: U,
  minute: U,
  hourCycle: "h23"
}, Lo = {
  hour: U,
  minute: U,
  second: U,
  hourCycle: "h23"
}, jo = {
  hour: U,
  minute: U,
  second: U,
  hourCycle: "h23",
  timeZoneName: Fe
}, Wo = {
  hour: U,
  minute: U,
  second: U,
  hourCycle: "h23",
  timeZoneName: Oe
}, Ko = {
  year: U,
  month: U,
  day: U,
  hour: U,
  minute: U
}, zo = {
  year: U,
  month: U,
  day: U,
  hour: U,
  minute: U,
  second: U
}, Bo = {
  year: U,
  month: Fe,
  day: U,
  hour: U,
  minute: U
}, Zo = {
  year: U,
  month: Fe,
  day: U,
  hour: U,
  minute: U,
  second: U
}, $u = {
  year: U,
  month: Fe,
  day: U,
  weekday: Fe,
  hour: U,
  minute: U
}, Ho = {
  year: U,
  month: Oe,
  day: U,
  hour: U,
  minute: U,
  timeZoneName: Fe
}, Yo = {
  year: U,
  month: Oe,
  day: U,
  hour: U,
  minute: U,
  second: U,
  timeZoneName: Fe
}, Go = {
  year: U,
  month: Oe,
  day: U,
  weekday: Oe,
  hour: U,
  minute: U,
  timeZoneName: Oe
}, Jo = {
  year: U,
  month: Oe,
  day: U,
  weekday: Oe,
  hour: U,
  minute: U,
  second: U,
  timeZoneName: Oe
};
class en {
  /**
   * The type of zone
   * @abstract
   * @type {string}
   */
  get type() {
    throw new tt();
  }
  /**
   * The name of this zone.
   * @abstract
   * @type {string}
   */
  get name() {
    throw new tt();
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
    throw new tt();
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
  offsetName(e, r) {
    throw new tt();
  }
  /**
   * Returns the offset's value as a string
   * @abstract
   * @param {number} ts - Epoch milliseconds for which to get the offset
   * @param {string} format - What style of offset to return.
   *                          Accepts 'narrow', 'short', or 'techie'. Returning '+6', '+06:00', or '+0600' respectively
   * @return {string}
   */
  formatOffset(e, r) {
    throw new tt();
  }
  /**
   * Return the offset in minutes for this zone at the specified timestamp.
   * @abstract
   * @param {number} ts - Epoch milliseconds for which to compute the offset
   * @return {number}
   */
  offset(e) {
    throw new tt();
  }
  /**
   * Return whether this Zone is equal to another zone
   * @abstract
   * @param {Zone} otherZone - the zone to compare
   * @return {boolean}
   */
  equals(e) {
    throw new tt();
  }
  /**
   * Return whether this Zone is valid.
   * @abstract
   * @type {boolean}
   */
  get isValid() {
    throw new tt();
  }
}
let Si = null;
class Pn extends en {
  /**
   * Get a singleton instance of the local zone
   * @return {SystemZone}
   */
  static get instance() {
    return Si === null && (Si = new Pn()), Si;
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
    return !1;
  }
  /** @override **/
  offsetName(e, { format: r, locale: i }) {
    return la(e, r, i);
  }
  /** @override **/
  formatOffset(e, r) {
    return An(this.offset(e), r);
  }
  /** @override **/
  offset(e) {
    return -new Date(e).getTimezoneOffset();
  }
  /** @override **/
  equals(e) {
    return e.type === "system";
  }
  /** @override **/
  get isValid() {
    return !0;
  }
}
const Ni = /* @__PURE__ */ new Map();
function Cu(s) {
  let e = Ni.get(s);
  return e === void 0 && (e = new Intl.DateTimeFormat("en-US", {
    hour12: !1,
    timeZone: s,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    era: "short"
  }), Ni.set(s, e)), e;
}
const Du = {
  year: 0,
  month: 1,
  day: 2,
  era: 3,
  hour: 4,
  minute: 5,
  second: 6
};
function Mu(s, e) {
  const r = s.format(e).replace(/\u200E/g, ""), i = /(\d+)\/(\d+)\/(\d+) (AD|BC),? (\d+):(\d+):(\d+)/.exec(r), [, a, c, h, m, y, E, N] = i;
  return [h, a, c, m, y, E, N];
}
function Nu(s, e) {
  const r = s.formatToParts(e), i = [];
  for (let a = 0; a < r.length; a++) {
    const { type: c, value: h } = r[a], m = Du[c];
    c === "era" ? i[m] = h : Z(m) || (i[m] = parseInt(h, 10));
  }
  return i;
}
const Ti = /* @__PURE__ */ new Map();
class Le extends en {
  /**
   * @param {string} name - Zone name
   * @return {IANAZone}
   */
  static create(e) {
    let r = Ti.get(e);
    return r === void 0 && Ti.set(e, r = new Le(e)), r;
  }
  /**
   * Reset local caches. Should only be necessary in testing scenarios.
   * @return {void}
   */
  static resetCache() {
    Ti.clear(), Ni.clear();
  }
  /**
   * Returns whether the provided string is a valid specifier. This only checks the string's format, not that the specifier identifies a known zone; see isValidZone for that.
   * @param {string} s - The string to check validity on
   * @example IANAZone.isValidSpecifier("America/New_York") //=> true
   * @example IANAZone.isValidSpecifier("Sport~~blorp") //=> false
   * @deprecated For backward compatibility, this forwards to isValidZone, better use `isValidZone()` directly instead.
   * @return {boolean}
   */
  static isValidSpecifier(e) {
    return this.isValidZone(e);
  }
  /**
   * Returns whether the provided string identifies a real zone
   * @param {string} zone - The string to check
   * @example IANAZone.isValidZone("America/New_York") //=> true
   * @example IANAZone.isValidZone("Fantasia/Castle") //=> false
   * @example IANAZone.isValidZone("Sport~~blorp") //=> false
   * @return {boolean}
   */
  static isValidZone(e) {
    if (!e)
      return !1;
    try {
      return new Intl.DateTimeFormat("en-US", { timeZone: e }).format(), !0;
    } catch {
      return !1;
    }
  }
  constructor(e) {
    super(), this.zoneName = e, this.valid = Le.isValidZone(e);
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
    return !1;
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
  offsetName(e, { format: r, locale: i }) {
    return la(e, r, i, this.name);
  }
  /**
   * Returns the offset's value as a string
   * @override
   * @param {number} ts - Epoch milliseconds for which to get the offset
   * @param {string} format - What style of offset to return.
   *                          Accepts 'narrow', 'short', or 'techie'. Returning '+6', '+06:00', or '+0600' respectively
   * @return {string}
   */
  formatOffset(e, r) {
    return An(this.offset(e), r);
  }
  /**
   * Return the offset in minutes for this zone at the specified timestamp.
   * @override
   * @param {number} ts - Epoch milliseconds for which to compute the offset
   * @return {number}
   */
  offset(e) {
    if (!this.valid) return NaN;
    const r = new Date(e);
    if (isNaN(r)) return NaN;
    const i = Cu(this.name);
    let [a, c, h, m, y, E, N] = i.formatToParts ? Nu(i, r) : Mu(i, r);
    m === "BC" && (a = -Math.abs(a) + 1);
    const W = Mr({
      year: a,
      month: c,
      day: h,
      hour: y === 24 ? 0 : y,
      minute: E,
      second: N,
      millisecond: 0
    });
    let j = +r;
    const X = j % 1e3;
    return j -= X >= 0 ? X : 1e3 + X, (W - j) / (60 * 1e3);
  }
  /**
   * Return whether this Zone is equal to another zone
   * @override
   * @param {Zone} otherZone - the zone to compare
   * @return {boolean}
   */
  equals(e) {
    return e.type === "iana" && e.name === this.name;
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
let Ws = {};
function Pu(s, e = {}) {
  const r = JSON.stringify([s, e]);
  let i = Ws[r];
  return i || (i = new Intl.ListFormat(s, e), Ws[r] = i), i;
}
const Pi = /* @__PURE__ */ new Map();
function Fi(s, e = {}) {
  const r = JSON.stringify([s, e]);
  let i = Pi.get(r);
  return i === void 0 && (i = new Intl.DateTimeFormat(s, e), Pi.set(r, i)), i;
}
const Ri = /* @__PURE__ */ new Map();
function Fu(s, e = {}) {
  const r = JSON.stringify([s, e]);
  let i = Ri.get(r);
  return i === void 0 && (i = new Intl.NumberFormat(s, e), Ri.set(r, i)), i;
}
const Vi = /* @__PURE__ */ new Map();
function Ru(s, e = {}) {
  const { base: r, ...i } = e, a = JSON.stringify([s, i]);
  let c = Vi.get(a);
  return c === void 0 && (c = new Intl.RelativeTimeFormat(s, e), Vi.set(a, c)), c;
}
let xn = null;
function Vu() {
  return xn || (xn = new Intl.DateTimeFormat().resolvedOptions().locale, xn);
}
const Ui = /* @__PURE__ */ new Map();
function Xo(s) {
  let e = Ui.get(s);
  return e === void 0 && (e = new Intl.DateTimeFormat(s).resolvedOptions(), Ui.set(s, e)), e;
}
const qi = /* @__PURE__ */ new Map();
function Uu(s) {
  let e = qi.get(s);
  if (!e) {
    const r = new Intl.Locale(s);
    e = "getWeekInfo" in r ? r.getWeekInfo() : r.weekInfo, "minimalDays" in e || (e = { ...Qo, ...e }), qi.set(s, e);
  }
  return e;
}
function qu(s) {
  const e = s.indexOf("-x-");
  e !== -1 && (s = s.substring(0, e));
  const r = s.indexOf("-u-");
  if (r === -1)
    return [s];
  {
    let i, a;
    try {
      i = Fi(s).resolvedOptions(), a = s;
    } catch {
      const y = s.substring(0, r);
      i = Fi(y).resolvedOptions(), a = y;
    }
    const { numberingSystem: c, calendar: h } = i;
    return [a, c, h];
  }
}
function Lu(s, e, r) {
  return (r || e) && (s.includes("-u-") || (s += "-u"), r && (s += `-ca-${r}`), e && (s += `-nu-${e}`)), s;
}
function ju(s) {
  const e = [];
  for (let r = 1; r <= 12; r++) {
    const i = B.utc(2009, r, 1);
    e.push(s(i));
  }
  return e;
}
function Wu(s) {
  const e = [];
  for (let r = 1; r <= 7; r++) {
    const i = B.utc(2016, 11, 13 + r);
    e.push(s(i));
  }
  return e;
}
function pr(s, e, r, i) {
  const a = s.listingMode();
  return a === "error" ? null : a === "en" ? r(e) : i(e);
}
function Ku(s) {
  return s.numberingSystem && s.numberingSystem !== "latn" ? !1 : s.numberingSystem === "latn" || !s.locale || s.locale.startsWith("en") || Xo(s.locale).numberingSystem === "latn";
}
class zu {
  constructor(e, r, i) {
    this.padTo = i.padTo || 0, this.floor = i.floor || !1;
    const { padTo: a, floor: c, ...h } = i;
    if (!r || Object.keys(h).length > 0) {
      const m = { useGrouping: !1, ...i };
      i.padTo > 0 && (m.minimumIntegerDigits = i.padTo), this.inf = Fu(e, m);
    }
  }
  format(e) {
    if (this.inf) {
      const r = this.floor ? Math.floor(e) : e;
      return this.inf.format(r);
    } else {
      const r = this.floor ? Math.floor(e) : Ji(e, 3);
      return de(r, this.padTo);
    }
  }
}
class Bu {
  constructor(e, r, i) {
    this.opts = i, this.originalZone = void 0;
    let a;
    if (this.opts.timeZone)
      this.dt = e;
    else if (e.zone.type === "fixed") {
      const h = -1 * (e.offset / 60), m = h >= 0 ? `Etc/GMT+${h}` : `Etc/GMT${h}`;
      e.offset !== 0 && Le.create(m).valid ? (a = m, this.dt = e) : (a = "UTC", this.dt = e.offset === 0 ? e : e.setZone("UTC").plus({ minutes: e.offset }), this.originalZone = e.zone);
    } else e.zone.type === "system" ? this.dt = e : e.zone.type === "iana" ? (this.dt = e, a = e.zone.name) : (a = "UTC", this.dt = e.setZone("UTC").plus({ minutes: e.offset }), this.originalZone = e.zone);
    const c = { ...this.opts };
    c.timeZone = c.timeZone || a, this.dtf = Fi(r, c);
  }
  format() {
    return this.originalZone ? this.formatToParts().map(({ value: e }) => e).join("") : this.dtf.format(this.dt.toJSDate());
  }
  formatToParts() {
    const e = this.dtf.formatToParts(this.dt.toJSDate());
    return this.originalZone ? e.map((r) => {
      if (r.type === "timeZoneName") {
        const i = this.originalZone.offsetName(this.dt.ts, {
          locale: this.dt.locale,
          format: this.opts.timeZoneName
        });
        return {
          ...r,
          value: i
        };
      } else
        return r;
    }) : e;
  }
  resolvedOptions() {
    return this.dtf.resolvedOptions();
  }
}
class Zu {
  constructor(e, r, i) {
    this.opts = { style: "long", ...i }, !r && aa() && (this.rtf = Ru(e, i));
  }
  format(e, r) {
    return this.rtf ? this.rtf.format(e, r) : ml(r, e, this.opts.numeric, this.opts.style !== "long");
  }
  formatToParts(e, r) {
    return this.rtf ? this.rtf.formatToParts(e, r) : [];
  }
}
const Qo = {
  firstDay: 1,
  minimalDays: 4,
  weekend: [6, 7]
};
class re {
  static fromOpts(e) {
    return re.create(
      e.locale,
      e.numberingSystem,
      e.outputCalendar,
      e.weekSettings,
      e.defaultToEN
    );
  }
  static create(e, r, i, a, c = !1) {
    const h = e || ue.defaultLocale, m = h || (c ? "en-US" : Vu()), y = r || ue.defaultNumberingSystem, E = i || ue.defaultOutputCalendar, N = ji(a) || ue.defaultWeekSettings;
    return new re(m, y, E, N, h);
  }
  static resetCache() {
    xn = null, Pi.clear(), Ri.clear(), Vi.clear(), Ui.clear(), qi.clear();
  }
  static fromObject({ locale: e, numberingSystem: r, outputCalendar: i, weekSettings: a } = {}) {
    return re.create(e, r, i, a);
  }
  constructor(e, r, i, a, c) {
    const [h, m, y] = qu(e);
    this.locale = h, this.numberingSystem = r || m || null, this.outputCalendar = i || y || null, this.weekSettings = a, this.intl = Lu(this.locale, this.numberingSystem, this.outputCalendar), this.weekdaysCache = { format: {}, standalone: {} }, this.monthsCache = { format: {}, standalone: {} }, this.meridiemCache = null, this.eraCache = {}, this.specifiedLocale = c, this.fastNumbersCached = null;
  }
  get fastNumbers() {
    return this.fastNumbersCached == null && (this.fastNumbersCached = Ku(this)), this.fastNumbersCached;
  }
  listingMode() {
    const e = this.isEnglish(), r = (this.numberingSystem === null || this.numberingSystem === "latn") && (this.outputCalendar === null || this.outputCalendar === "gregory");
    return e && r ? "en" : "intl";
  }
  clone(e) {
    return !e || Object.getOwnPropertyNames(e).length === 0 ? this : re.create(
      e.locale || this.specifiedLocale,
      e.numberingSystem || this.numberingSystem,
      e.outputCalendar || this.outputCalendar,
      ji(e.weekSettings) || this.weekSettings,
      e.defaultToEN || !1
    );
  }
  redefaultToEN(e = {}) {
    return this.clone({ ...e, defaultToEN: !0 });
  }
  redefaultToSystem(e = {}) {
    return this.clone({ ...e, defaultToEN: !1 });
  }
  months(e, r = !1) {
    return pr(this, e, ha, () => {
      const i = this.intl === "ja" || this.intl.startsWith("ja-");
      r &= !i;
      const a = r ? { month: e, day: "numeric" } : { month: e }, c = r ? "format" : "standalone";
      if (!this.monthsCache[c][e]) {
        const h = i ? (m) => this.dtFormatter(m, a).format() : (m) => this.extract(m, a, "month");
        this.monthsCache[c][e] = ju(h);
      }
      return this.monthsCache[c][e];
    });
  }
  weekdays(e, r = !1) {
    return pr(this, e, pa, () => {
      const i = r ? { weekday: e, year: "numeric", month: "long", day: "numeric" } : { weekday: e }, a = r ? "format" : "standalone";
      return this.weekdaysCache[a][e] || (this.weekdaysCache[a][e] = Wu(
        (c) => this.extract(c, i, "weekday")
      )), this.weekdaysCache[a][e];
    });
  }
  meridiems() {
    return pr(
      this,
      void 0,
      () => ya,
      () => {
        if (!this.meridiemCache) {
          const e = { hour: "numeric", hourCycle: "h12" };
          this.meridiemCache = [B.utc(2016, 11, 13, 9), B.utc(2016, 11, 13, 19)].map(
            (r) => this.extract(r, e, "dayperiod")
          );
        }
        return this.meridiemCache;
      }
    );
  }
  eras(e) {
    return pr(this, e, ga, () => {
      const r = { era: e };
      return this.eraCache[e] || (this.eraCache[e] = [B.utc(-40, 1, 1), B.utc(2017, 1, 1)].map(
        (i) => this.extract(i, r, "era")
      )), this.eraCache[e];
    });
  }
  extract(e, r, i) {
    const a = this.dtFormatter(e, r), c = a.formatToParts(), h = c.find((m) => m.type.toLowerCase() === i);
    return h ? h.value : null;
  }
  numberFormatter(e = {}) {
    return new zu(this.intl, e.forceSimple || this.fastNumbers, e);
  }
  dtFormatter(e, r = {}) {
    return new Bu(e, this.intl, r);
  }
  relFormatter(e = {}) {
    return new Zu(this.intl, this.isEnglish(), e);
  }
  listFormatter(e = {}) {
    return Pu(this.intl, e);
  }
  isEnglish() {
    return this.locale === "en" || this.locale.toLowerCase() === "en-us" || Xo(this.intl).locale.startsWith("en-us");
  }
  getWeekSettings() {
    return this.weekSettings ? this.weekSettings : ua() ? Uu(this.locale) : Qo;
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
  equals(e) {
    return this.locale === e.locale && this.numberingSystem === e.numberingSystem && this.outputCalendar === e.outputCalendar;
  }
  toString() {
    return `Locale(${this.locale}, ${this.numberingSystem}, ${this.outputCalendar})`;
  }
}
let xi = null;
class _e extends en {
  /**
   * Get a singleton instance of UTC
   * @return {FixedOffsetZone}
   */
  static get utcInstance() {
    return xi === null && (xi = new _e(0)), xi;
  }
  /**
   * Get an instance with a specified offset
   * @param {number} offset - The offset in minutes
   * @return {FixedOffsetZone}
   */
  static instance(e) {
    return e === 0 ? _e.utcInstance : new _e(e);
  }
  /**
   * Get an instance of FixedOffsetZone from a UTC offset string, like "UTC+6"
   * @param {string} s - The offset string to parse
   * @example FixedOffsetZone.parseSpecifier("UTC+6")
   * @example FixedOffsetZone.parseSpecifier("UTC+06")
   * @example FixedOffsetZone.parseSpecifier("UTC-6:00")
   * @return {FixedOffsetZone}
   */
  static parseSpecifier(e) {
    if (e) {
      const r = e.match(/^utc(?:([+-]\d{1,2})(?::(\d{2}))?)?$/i);
      if (r)
        return new _e(Nr(r[1], r[2]));
    }
    return null;
  }
  constructor(e) {
    super(), this.fixed = e;
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
    return this.fixed === 0 ? "UTC" : `UTC${An(this.fixed, "narrow")}`;
  }
  /**
   * The IANA name of this zone, i.e. `Etc/UTC` or `Etc/GMT+/-nn`
   *
   * @override
   * @type {string}
   */
  get ianaName() {
    return this.fixed === 0 ? "Etc/UTC" : `Etc/GMT${An(-this.fixed, "narrow")}`;
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
  formatOffset(e, r) {
    return An(this.fixed, r);
  }
  /**
   * Returns whether the offset is known to be fixed for the whole year:
   * Always returns true for all fixed offset zones.
   * @override
   * @type {boolean}
   */
  get isUniversal() {
    return !0;
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
  equals(e) {
    return e.type === "fixed" && e.fixed === this.fixed;
  }
  /**
   * Return whether this Zone is valid:
   * All fixed offset zones are valid.
   * @override
   * @type {boolean}
   */
  get isValid() {
    return !0;
  }
}
class ea extends en {
  constructor(e) {
    super(), this.zoneName = e;
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
    return !1;
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
    return !1;
  }
  /** @override **/
  get isValid() {
    return !1;
  }
}
function rt(s, e) {
  if (Z(s) || s === null)
    return e;
  if (s instanceof en)
    return s;
  if (Qu(s)) {
    const r = s.toLowerCase();
    return r === "default" ? e : r === "local" || r === "system" ? Pn.instance : r === "utc" || r === "gmt" ? _e.utcInstance : _e.parseSpecifier(r) || Le.create(s);
  } else return ot(s) ? _e.instance(s) : typeof s == "object" && "offset" in s && typeof s.offset == "function" ? s : new ea(s);
}
const Zi = {
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
}, Ks = {
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
}, Hu = Zi.hanidec.replace(/[\[|\]]/g, "").split("");
function Yu(s) {
  let e = parseInt(s, 10);
  if (isNaN(e)) {
    e = "";
    for (let r = 0; r < s.length; r++) {
      const i = s.charCodeAt(r);
      if (s[r].search(Zi.hanidec) !== -1)
        e += Hu.indexOf(s[r]);
      else
        for (const a in Ks) {
          const [c, h] = Ks[a];
          i >= c && i <= h && (e += i - c);
        }
    }
    return parseInt(e, 10);
  } else
    return e;
}
const Li = /* @__PURE__ */ new Map();
function Gu() {
  Li.clear();
}
function Me({ numberingSystem: s }, e = "") {
  const r = s || "latn";
  let i = Li.get(r);
  i === void 0 && (i = /* @__PURE__ */ new Map(), Li.set(r, i));
  let a = i.get(e);
  return a === void 0 && (a = new RegExp(`${Zi[r]}${e}`), i.set(e, a)), a;
}
let zs = () => Date.now(), Bs = "system", Zs = null, Hs = null, Ys = null, Gs = 60, Js, Xs = null;
class ue {
  /**
   * Get the callback for returning the current timestamp.
   * @type {function}
   */
  static get now() {
    return zs;
  }
  /**
   * Set the callback for returning the current timestamp.
   * The function should return a number, which will be interpreted as an Epoch millisecond count
   * @type {function}
   * @example Settings.now = () => Date.now() + 3000 // pretend it is 3 seconds in the future
   * @example Settings.now = () => 0 // always pretend it's Jan 1, 1970 at midnight in UTC time
   */
  static set now(e) {
    zs = e;
  }
  /**
   * Set the default time zone to create DateTimes in. Does not affect existing instances.
   * Use the value "system" to reset this value to the system's time zone.
   * @type {string}
   */
  static set defaultZone(e) {
    Bs = e;
  }
  /**
   * Get the default time zone object currently used to create DateTimes. Does not affect existing instances.
   * The default value is the system's time zone (the one set on the machine that runs this code).
   * @type {Zone}
   */
  static get defaultZone() {
    return rt(Bs, Pn.instance);
  }
  /**
   * Get the default locale to create DateTimes with. Does not affect existing instances.
   * @type {string}
   */
  static get defaultLocale() {
    return Zs;
  }
  /**
   * Set the default locale to create DateTimes with. Does not affect existing instances.
   * @type {string}
   */
  static set defaultLocale(e) {
    Zs = e;
  }
  /**
   * Get the default numbering system to create DateTimes with. Does not affect existing instances.
   * @type {string}
   */
  static get defaultNumberingSystem() {
    return Hs;
  }
  /**
   * Set the default numbering system to create DateTimes with. Does not affect existing instances.
   * @type {string}
   */
  static set defaultNumberingSystem(e) {
    Hs = e;
  }
  /**
   * Get the default output calendar to create DateTimes with. Does not affect existing instances.
   * @type {string}
   */
  static get defaultOutputCalendar() {
    return Ys;
  }
  /**
   * Set the default output calendar to create DateTimes with. Does not affect existing instances.
   * @type {string}
   */
  static set defaultOutputCalendar(e) {
    Ys = e;
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
    return Xs;
  }
  /**
   * Allows overriding the default locale week settings, i.e. the start of the week, the weekend and
   * how many days are required in the first week of a year.
   * Does not affect existing instances.
   *
   * @param {WeekSettings|null} weekSettings
   */
  static set defaultWeekSettings(e) {
    Xs = ji(e);
  }
  /**
   * Get the cutoff year for whether a 2-digit year string is interpreted in the current or previous century. Numbers higher than the cutoff will be considered to mean 19xx and numbers lower or equal to the cutoff will be considered 20xx.
   * @type {number}
   */
  static get twoDigitCutoffYear() {
    return Gs;
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
  static set twoDigitCutoffYear(e) {
    Gs = e % 100;
  }
  /**
   * Get whether Luxon will throw when it encounters invalid DateTimes, Durations, or Intervals
   * @type {boolean}
   */
  static get throwOnInvalid() {
    return Js;
  }
  /**
   * Set whether Luxon will throw when it encounters invalid DateTimes, Durations, or Intervals
   * @type {boolean}
   */
  static set throwOnInvalid(e) {
    Js = e;
  }
  /**
   * Reset Luxon's global caches. Should only be necessary in testing scenarios.
   * @return {void}
   */
  static resetCaches() {
    re.resetCache(), Le.resetCache(), B.resetCache(), Gu();
  }
}
class Pe {
  constructor(e, r) {
    this.reason = e, this.explanation = r;
  }
  toMessage() {
    return this.explanation ? `${this.reason}: ${this.explanation}` : this.reason;
  }
}
const ta = [0, 31, 59, 90, 120, 151, 181, 212, 243, 273, 304, 334], na = [0, 31, 60, 91, 121, 152, 182, 213, 244, 274, 305, 335];
function $e(s, e) {
  return new Pe(
    "unit out of range",
    `you specified ${e} (of type ${typeof e}) as a ${s}, which is invalid`
  );
}
function Hi(s, e, r) {
  const i = new Date(Date.UTC(s, e - 1, r));
  s < 100 && s >= 0 && i.setUTCFullYear(i.getUTCFullYear() - 1900);
  const a = i.getUTCDay();
  return a === 0 ? 7 : a;
}
function ra(s, e, r) {
  return r + (Fn(s) ? na : ta)[e - 1];
}
function ia(s, e) {
  const r = Fn(s) ? na : ta, i = r.findIndex((c) => c < e), a = e - r[i];
  return { month: i + 1, day: a };
}
function Yi(s, e) {
  return (s - e + 7) % 7 + 1;
}
function Or(s, e = 4, r = 1) {
  const { year: i, month: a, day: c } = s, h = ra(i, a, c), m = Yi(Hi(i, a, c), r);
  let y = Math.floor((h - m + 14 - e) / 7), E;
  return y < 1 ? (E = i - 1, y = Cn(E, e, r)) : y > Cn(i, e, r) ? (E = i + 1, y = 1) : E = i, { weekYear: E, weekNumber: y, weekday: m, ...Pr(s) };
}
function Qs(s, e = 4, r = 1) {
  const { weekYear: i, weekNumber: a, weekday: c } = s, h = Yi(Hi(i, 1, e), r), m = Ht(i);
  let y = a * 7 + c - h - 7 + e, E;
  y < 1 ? (E = i - 1, y += Ht(E)) : y > m ? (E = i + 1, y -= Ht(i)) : E = i;
  const { month: N, day: C } = ia(E, y);
  return { year: E, month: N, day: C, ...Pr(s) };
}
function Oi(s) {
  const { year: e, month: r, day: i } = s, a = ra(e, r, i);
  return { year: e, ordinal: a, ...Pr(s) };
}
function eo(s) {
  const { year: e, ordinal: r } = s, { month: i, day: a } = ia(e, r);
  return { year: e, month: i, day: a, ...Pr(s) };
}
function to(s, e) {
  if (!Z(s.localWeekday) || !Z(s.localWeekNumber) || !Z(s.localWeekYear)) {
    if (!Z(s.weekday) || !Z(s.weekNumber) || !Z(s.weekYear))
      throw new Bt(
        "Cannot mix locale-based week fields with ISO-based week fields"
      );
    return Z(s.localWeekday) || (s.weekday = s.localWeekday), Z(s.localWeekNumber) || (s.weekNumber = s.localWeekNumber), Z(s.localWeekYear) || (s.weekYear = s.localWeekYear), delete s.localWeekday, delete s.localWeekNumber, delete s.localWeekYear, {
      minDaysInFirstWeek: e.getMinDaysInFirstWeek(),
      startOfWeek: e.getStartOfWeek()
    };
  } else
    return { minDaysInFirstWeek: 4, startOfWeek: 1 };
}
function Ju(s, e = 4, r = 1) {
  const i = Dr(s.weekYear), a = Ce(
    s.weekNumber,
    1,
    Cn(s.weekYear, e, r)
  ), c = Ce(s.weekday, 1, 7);
  return i ? a ? c ? !1 : $e("weekday", s.weekday) : $e("week", s.weekNumber) : $e("weekYear", s.weekYear);
}
function Xu(s) {
  const e = Dr(s.year), r = Ce(s.ordinal, 1, Ht(s.year));
  return e ? r ? !1 : $e("ordinal", s.ordinal) : $e("year", s.year);
}
function sa(s) {
  const e = Dr(s.year), r = Ce(s.month, 1, 12), i = Ce(s.day, 1, Er(s.year, s.month));
  return e ? r ? i ? !1 : $e("day", s.day) : $e("month", s.month) : $e("year", s.year);
}
function oa(s) {
  const { hour: e, minute: r, second: i, millisecond: a } = s, c = Ce(e, 0, 23) || e === 24 && r === 0 && i === 0 && a === 0, h = Ce(r, 0, 59), m = Ce(i, 0, 59), y = Ce(a, 0, 999);
  return c ? h ? m ? y ? !1 : $e("millisecond", a) : $e("second", i) : $e("minute", r) : $e("hour", e);
}
function Z(s) {
  return typeof s > "u";
}
function ot(s) {
  return typeof s == "number";
}
function Dr(s) {
  return typeof s == "number" && s % 1 === 0;
}
function Qu(s) {
  return typeof s == "string";
}
function el(s) {
  return Object.prototype.toString.call(s) === "[object Date]";
}
function aa() {
  try {
    return typeof Intl < "u" && !!Intl.RelativeTimeFormat;
  } catch {
    return !1;
  }
}
function ua() {
  try {
    return typeof Intl < "u" && !!Intl.Locale && ("weekInfo" in Intl.Locale.prototype || "getWeekInfo" in Intl.Locale.prototype);
  } catch {
    return !1;
  }
}
function tl(s) {
  return Array.isArray(s) ? s : [s];
}
function no(s, e, r) {
  if (s.length !== 0)
    return s.reduce((i, a) => {
      const c = [e(a), a];
      return i && r(i[0], c[0]) === i[0] ? i : c;
    }, null)[1];
}
function nl(s, e) {
  return e.reduce((r, i) => (r[i] = s[i], r), {});
}
function Jt(s, e) {
  return Object.prototype.hasOwnProperty.call(s, e);
}
function ji(s) {
  if (s == null)
    return null;
  if (typeof s != "object")
    throw new be("Week settings must be an object");
  if (!Ce(s.firstDay, 1, 7) || !Ce(s.minimalDays, 1, 7) || !Array.isArray(s.weekend) || s.weekend.some((e) => !Ce(e, 1, 7)))
    throw new be("Invalid week settings");
  return {
    firstDay: s.firstDay,
    minimalDays: s.minimalDays,
    weekend: Array.from(s.weekend)
  };
}
function Ce(s, e, r) {
  return Dr(s) && s >= e && s <= r;
}
function rl(s, e) {
  return s - e * Math.floor(s / e);
}
function de(s, e = 2) {
  const r = s < 0;
  let i;
  return r ? i = "-" + ("" + -s).padStart(e, "0") : i = ("" + s).padStart(e, "0"), i;
}
function nt(s) {
  if (!(Z(s) || s === null || s === ""))
    return parseInt(s, 10);
}
function _t(s) {
  if (!(Z(s) || s === null || s === ""))
    return parseFloat(s);
}
function Gi(s) {
  if (!(Z(s) || s === null || s === "")) {
    const e = parseFloat("0." + s) * 1e3;
    return Math.floor(e);
  }
}
function Ji(s, e, r = "round") {
  const i = 10 ** e;
  switch (r) {
    case "expand":
      return s > 0 ? Math.ceil(s * i) / i : Math.floor(s * i) / i;
    case "trunc":
      return Math.trunc(s * i) / i;
    case "round":
      return Math.round(s * i) / i;
    case "floor":
      return Math.floor(s * i) / i;
    case "ceil":
      return Math.ceil(s * i) / i;
    default:
      throw new RangeError(`Value rounding ${r} is out of range`);
  }
}
function Fn(s) {
  return s % 4 === 0 && (s % 100 !== 0 || s % 400 === 0);
}
function Ht(s) {
  return Fn(s) ? 366 : 365;
}
function Er(s, e) {
  const r = rl(e - 1, 12) + 1, i = s + (e - r) / 12;
  return r === 2 ? Fn(i) ? 29 : 28 : [31, null, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31][r - 1];
}
function Mr(s) {
  let e = Date.UTC(
    s.year,
    s.month - 1,
    s.day,
    s.hour,
    s.minute,
    s.second,
    s.millisecond
  );
  return s.year < 100 && s.year >= 0 && (e = new Date(e), e.setUTCFullYear(s.year, s.month - 1, s.day)), +e;
}
function ro(s, e, r) {
  return -Yi(Hi(s, 1, e), r) + e - 1;
}
function Cn(s, e = 4, r = 1) {
  const i = ro(s, e, r), a = ro(s + 1, e, r);
  return (Ht(s) - i + a) / 7;
}
function Wi(s) {
  return s > 99 ? s : s > ue.twoDigitCutoffYear ? 1900 + s : 2e3 + s;
}
function la(s, e, r, i = null) {
  const a = new Date(s), c = {
    hourCycle: "h23",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit"
  };
  i && (c.timeZone = i);
  const h = { timeZoneName: e, ...c }, m = new Intl.DateTimeFormat(r, h).formatToParts(a).find((y) => y.type.toLowerCase() === "timezonename");
  return m ? m.value : null;
}
function Nr(s, e) {
  let r = parseInt(s, 10);
  Number.isNaN(r) && (r = 0);
  const i = parseInt(e, 10) || 0, a = r < 0 || Object.is(r, -0) ? -i : i;
  return r * 60 + a;
}
function ca(s) {
  const e = Number(s);
  if (typeof s == "boolean" || s === "" || !Number.isFinite(e))
    throw new be(`Invalid unit value ${s}`);
  return e;
}
function Ir(s, e) {
  const r = {};
  for (const i in s)
    if (Jt(s, i)) {
      const a = s[i];
      if (a == null) continue;
      r[e(i)] = ca(a);
    }
  return r;
}
function An(s, e) {
  const r = Math.trunc(Math.abs(s / 60)), i = Math.trunc(Math.abs(s % 60)), a = s >= 0 ? "+" : "-";
  switch (e) {
    case "short":
      return `${a}${de(r, 2)}:${de(i, 2)}`;
    case "narrow":
      return `${a}${r}${i > 0 ? `:${i}` : ""}`;
    case "techie":
      return `${a}${de(r, 2)}${de(i, 2)}`;
    default:
      throw new RangeError(`Value format ${e} is out of range for property format`);
  }
}
function Pr(s) {
  return nl(s, ["hour", "minute", "second", "millisecond"]);
}
const il = [
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
], fa = [
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
], sl = ["J", "F", "M", "A", "M", "J", "J", "A", "S", "O", "N", "D"];
function ha(s) {
  switch (s) {
    case "narrow":
      return [...sl];
    case "short":
      return [...fa];
    case "long":
      return [...il];
    case "numeric":
      return ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12"];
    case "2-digit":
      return ["01", "02", "03", "04", "05", "06", "07", "08", "09", "10", "11", "12"];
    default:
      return null;
  }
}
const da = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday"
], ma = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"], ol = ["M", "T", "W", "T", "F", "S", "S"];
function pa(s) {
  switch (s) {
    case "narrow":
      return [...ol];
    case "short":
      return [...ma];
    case "long":
      return [...da];
    case "numeric":
      return ["1", "2", "3", "4", "5", "6", "7"];
    default:
      return null;
  }
}
const ya = ["AM", "PM"], al = ["Before Christ", "Anno Domini"], ul = ["BC", "AD"], ll = ["B", "A"];
function ga(s) {
  switch (s) {
    case "narrow":
      return [...ll];
    case "short":
      return [...ul];
    case "long":
      return [...al];
    default:
      return null;
  }
}
function cl(s) {
  return ya[s.hour < 12 ? 0 : 1];
}
function fl(s, e) {
  return pa(e)[s.weekday - 1];
}
function hl(s, e) {
  return ha(e)[s.month - 1];
}
function dl(s, e) {
  return ga(e)[s.year < 0 ? 0 : 1];
}
function ml(s, e, r = "always", i = !1) {
  const a = {
    years: ["year", "yr."],
    quarters: ["quarter", "qtr."],
    months: ["month", "mo."],
    weeks: ["week", "wk."],
    days: ["day", "day", "days"],
    hours: ["hour", "hr."],
    minutes: ["minute", "min."],
    seconds: ["second", "sec."]
  }, c = ["hours", "minutes", "seconds"].indexOf(s) === -1;
  if (r === "auto" && c) {
    const C = s === "days";
    switch (e) {
      case 1:
        return C ? "tomorrow" : `next ${a[s][0]}`;
      case -1:
        return C ? "yesterday" : `last ${a[s][0]}`;
      case 0:
        return C ? "today" : `this ${a[s][0]}`;
    }
  }
  const h = Object.is(e, -0) || e < 0, m = Math.abs(e), y = m === 1, E = a[s], N = i ? y ? E[1] : E[2] || E[1] : y ? a[s][0] : s;
  return h ? `${m} ${N} ago` : `in ${m} ${N}`;
}
function io(s, e) {
  let r = "";
  for (const i of s)
    i.literal ? r += i.val : r += e(i.val);
  return r;
}
const pl = {
  D: xr,
  DD: Mo,
  DDD: No,
  DDDD: Po,
  t: Fo,
  tt: Ro,
  ttt: Vo,
  tttt: Uo,
  T: qo,
  TT: Lo,
  TTT: jo,
  TTTT: Wo,
  f: Ko,
  ff: Bo,
  fff: Ho,
  ffff: Go,
  F: zo,
  FF: Zo,
  FFF: Yo,
  FFFF: Jo
};
class ke {
  static create(e, r = {}) {
    return new ke(e, r);
  }
  static parseFormat(e) {
    let r = null, i = "", a = !1;
    const c = [];
    for (let h = 0; h < e.length; h++) {
      const m = e.charAt(h);
      m === "'" ? ((i.length > 0 || a) && c.push({
        literal: a || /^\s+$/.test(i),
        val: i === "" ? "'" : i
      }), r = null, i = "", a = !a) : a || m === r ? i += m : (i.length > 0 && c.push({ literal: /^\s+$/.test(i), val: i }), i = m, r = m);
    }
    return i.length > 0 && c.push({ literal: a || /^\s+$/.test(i), val: i }), c;
  }
  static macroTokenToFormatOpts(e) {
    return pl[e];
  }
  constructor(e, r) {
    this.opts = r, this.loc = e, this.systemLoc = null;
  }
  formatWithSystemDefault(e, r) {
    return this.systemLoc === null && (this.systemLoc = this.loc.redefaultToSystem()), this.systemLoc.dtFormatter(e, { ...this.opts, ...r }).format();
  }
  dtFormatter(e, r = {}) {
    return this.loc.dtFormatter(e, { ...this.opts, ...r });
  }
  formatDateTime(e, r) {
    return this.dtFormatter(e, r).format();
  }
  formatDateTimeParts(e, r) {
    return this.dtFormatter(e, r).formatToParts();
  }
  formatInterval(e, r) {
    return this.dtFormatter(e.start, r).dtf.formatRange(e.start.toJSDate(), e.end.toJSDate());
  }
  resolvedOptions(e, r) {
    return this.dtFormatter(e, r).resolvedOptions();
  }
  num(e, r = 0, i = void 0) {
    if (this.opts.forceSimple)
      return de(e, r);
    const a = { ...this.opts };
    return r > 0 && (a.padTo = r), i && (a.signDisplay = i), this.loc.numberFormatter(a).format(e);
  }
  formatDateTimeFromString(e, r) {
    const i = this.loc.listingMode() === "en", a = this.loc.outputCalendar && this.loc.outputCalendar !== "gregory", c = (j, X) => this.loc.extract(e, j, X), h = (j) => e.isOffsetFixed && e.offset === 0 && j.allowZ ? "Z" : e.isValid ? e.zone.formatOffset(e.ts, j.format) : "", m = () => i ? cl(e) : c({ hour: "numeric", hourCycle: "h12" }, "dayperiod"), y = (j, X) => i ? hl(e, j) : c(X ? { month: j } : { month: j, day: "numeric" }, "month"), E = (j, X) => i ? fl(e, j) : c(
      X ? { weekday: j } : { weekday: j, month: "long", day: "numeric" },
      "weekday"
    ), N = (j) => {
      const X = ke.macroTokenToFormatOpts(j);
      return X ? this.formatWithSystemDefault(e, X) : j;
    }, C = (j) => i ? dl(e, j) : c({ era: j }, "era"), W = (j) => {
      switch (j) {
        // ms
        case "S":
          return this.num(e.millisecond);
        case "u":
        // falls through
        case "SSS":
          return this.num(e.millisecond, 3);
        // seconds
        case "s":
          return this.num(e.second);
        case "ss":
          return this.num(e.second, 2);
        // fractional seconds
        case "uu":
          return this.num(Math.floor(e.millisecond / 10), 2);
        case "uuu":
          return this.num(Math.floor(e.millisecond / 100));
        // minutes
        case "m":
          return this.num(e.minute);
        case "mm":
          return this.num(e.minute, 2);
        // hours
        case "h":
          return this.num(e.hour % 12 === 0 ? 12 : e.hour % 12);
        case "hh":
          return this.num(e.hour % 12 === 0 ? 12 : e.hour % 12, 2);
        case "H":
          return this.num(e.hour);
        case "HH":
          return this.num(e.hour, 2);
        // offset
        case "Z":
          return h({ format: "narrow", allowZ: this.opts.allowZ });
        case "ZZ":
          return h({ format: "short", allowZ: this.opts.allowZ });
        case "ZZZ":
          return h({ format: "techie", allowZ: this.opts.allowZ });
        case "ZZZZ":
          return e.zone.offsetName(e.ts, { format: "short", locale: this.loc.locale });
        case "ZZZZZ":
          return e.zone.offsetName(e.ts, { format: "long", locale: this.loc.locale });
        // zone
        case "z":
          return e.zoneName;
        // meridiems
        case "a":
          return m();
        // dates
        case "d":
          return a ? c({ day: "numeric" }, "day") : this.num(e.day);
        case "dd":
          return a ? c({ day: "2-digit" }, "day") : this.num(e.day, 2);
        // weekdays - standalone
        case "c":
          return this.num(e.weekday);
        case "ccc":
          return E("short", !0);
        case "cccc":
          return E("long", !0);
        case "ccccc":
          return E("narrow", !0);
        // weekdays - format
        case "E":
          return this.num(e.weekday);
        case "EEE":
          return E("short", !1);
        case "EEEE":
          return E("long", !1);
        case "EEEEE":
          return E("narrow", !1);
        // months - standalone
        case "L":
          return a ? c({ month: "numeric", day: "numeric" }, "month") : this.num(e.month);
        case "LL":
          return a ? c({ month: "2-digit", day: "numeric" }, "month") : this.num(e.month, 2);
        case "LLL":
          return y("short", !0);
        case "LLLL":
          return y("long", !0);
        case "LLLLL":
          return y("narrow", !0);
        // months - format
        case "M":
          return a ? c({ month: "numeric" }, "month") : this.num(e.month);
        case "MM":
          return a ? c({ month: "2-digit" }, "month") : this.num(e.month, 2);
        case "MMM":
          return y("short", !1);
        case "MMMM":
          return y("long", !1);
        case "MMMMM":
          return y("narrow", !1);
        // years
        case "y":
          return a ? c({ year: "numeric" }, "year") : this.num(e.year);
        case "yy":
          return a ? c({ year: "2-digit" }, "year") : this.num(e.year.toString().slice(-2), 2);
        case "yyyy":
          return a ? c({ year: "numeric" }, "year") : this.num(e.year, 4);
        case "yyyyyy":
          return a ? c({ year: "numeric" }, "year") : this.num(e.year, 6);
        // eras
        case "G":
          return C("short");
        case "GG":
          return C("long");
        case "GGGGG":
          return C("narrow");
        case "kk":
          return this.num(e.weekYear.toString().slice(-2), 2);
        case "kkkk":
          return this.num(e.weekYear, 4);
        case "W":
          return this.num(e.weekNumber);
        case "WW":
          return this.num(e.weekNumber, 2);
        case "n":
          return this.num(e.localWeekNumber);
        case "nn":
          return this.num(e.localWeekNumber, 2);
        case "ii":
          return this.num(e.localWeekYear.toString().slice(-2), 2);
        case "iiii":
          return this.num(e.localWeekYear, 4);
        case "o":
          return this.num(e.ordinal);
        case "ooo":
          return this.num(e.ordinal, 3);
        case "q":
          return this.num(e.quarter);
        case "qq":
          return this.num(e.quarter, 2);
        case "X":
          return this.num(Math.floor(e.ts / 1e3));
        case "x":
          return this.num(e.ts);
        default:
          return N(j);
      }
    };
    return io(ke.parseFormat(r), W);
  }
  formatDurationFromString(e, r) {
    const i = this.opts.signMode === "negativeLargestOnly" ? -1 : 1, a = (N) => {
      switch (N[0]) {
        case "S":
          return "milliseconds";
        case "s":
          return "seconds";
        case "m":
          return "minutes";
        case "h":
          return "hours";
        case "d":
          return "days";
        case "w":
          return "weeks";
        case "M":
          return "months";
        case "y":
          return "years";
        default:
          return null;
      }
    }, c = (N, C) => (W) => {
      const j = a(W);
      if (j) {
        const X = C.isNegativeDuration && j !== C.largestUnit ? i : 1;
        let me;
        return this.opts.signMode === "negativeLargestOnly" && j !== C.largestUnit ? me = "never" : this.opts.signMode === "all" ? me = "always" : me = "auto", this.num(N.get(j) * X, W.length, me);
      } else
        return W;
    }, h = ke.parseFormat(r), m = h.reduce(
      (N, { literal: C, val: W }) => C ? N : N.concat(W),
      []
    ), y = e.shiftTo(...m.map(a).filter((N) => N)), E = {
      isNegativeDuration: y < 0,
      // this relies on "collapsed" being based on "shiftTo", which builds up the object
      // in order
      largestUnit: Object.keys(y.values)[0]
    };
    return io(h, c(y, E));
  }
}
const va = /[A-Za-z_+-]{1,256}(?::?\/[A-Za-z0-9_+-]{1,256}(?:\/[A-Za-z0-9_+-]{1,256})?)?/;
function tn(...s) {
  const e = s.reduce((r, i) => r + i.source, "");
  return RegExp(`^${e}$`);
}
function nn(...s) {
  return (e) => s.reduce(
    ([r, i, a], c) => {
      const [h, m, y] = c(e, a);
      return [{ ...r, ...h }, m || i, y];
    },
    [{}, null, 1]
  ).slice(0, 2);
}
function rn(s, ...e) {
  if (s == null)
    return [null, null];
  for (const [r, i] of e) {
    const a = r.exec(s);
    if (a)
      return i(a);
  }
  return [null, null];
}
function wa(...s) {
  return (e, r) => {
    const i = {};
    let a;
    for (a = 0; a < s.length; a++)
      i[s[a]] = nt(e[r + a]);
    return [i, null, r + a];
  };
}
const ba = /(?:([Zz])|([+-]\d\d)(?::?(\d\d))?)/, yl = `(?:${ba.source}?(?:\\[(${va.source})\\])?)?`, Xi = /(\d\d)(?::?(\d\d)(?::?(\d\d)(?:[.,](\d{1,30}))?)?)?/, ka = RegExp(`${Xi.source}${yl}`), Qi = RegExp(`(?:[Tt]${ka.source})?`), gl = /([+-]\d{6}|\d{4})(?:-?(\d\d)(?:-?(\d\d))?)?/, vl = /(\d{4})-?W(\d\d)(?:-?(\d))?/, wl = /(\d{4})-?(\d{3})/, bl = wa("weekYear", "weekNumber", "weekDay"), kl = wa("year", "ordinal"), _l = /(\d{4})-(\d\d)-(\d\d)/, _a = RegExp(
  `${Xi.source} ?(?:${ba.source}|(${va.source}))?`
), Sl = RegExp(`(?: ${_a.source})?`);
function Yt(s, e, r) {
  const i = s[e];
  return Z(i) ? r : nt(i);
}
function Tl(s, e) {
  return [{
    year: Yt(s, e),
    month: Yt(s, e + 1, 1),
    day: Yt(s, e + 2, 1)
  }, null, e + 3];
}
function sn(s, e) {
  return [{
    hours: Yt(s, e, 0),
    minutes: Yt(s, e + 1, 0),
    seconds: Yt(s, e + 2, 0),
    milliseconds: Gi(s[e + 3])
  }, null, e + 4];
}
function Rn(s, e) {
  const r = !s[e] && !s[e + 1], i = Nr(s[e + 1], s[e + 2]), a = r ? null : _e.instance(i);
  return [{}, a, e + 3];
}
function Vn(s, e) {
  const r = s[e] ? Le.create(s[e]) : null;
  return [{}, r, e + 1];
}
const xl = RegExp(`^T?${Xi.source}$`), Ol = /^-?P(?:(?:(-?\d{1,20}(?:\.\d{1,20})?)Y)?(?:(-?\d{1,20}(?:\.\d{1,20})?)M)?(?:(-?\d{1,20}(?:\.\d{1,20})?)W)?(?:(-?\d{1,20}(?:\.\d{1,20})?)D)?(?:T(?:(-?\d{1,20}(?:\.\d{1,20})?)H)?(?:(-?\d{1,20}(?:\.\d{1,20})?)M)?(?:(-?\d{1,20})(?:[.,](-?\d{1,20}))?S)?)?)$/;
function El(s) {
  const [e, r, i, a, c, h, m, y, E] = s, N = e[0] === "-", C = y && y[0] === "-", W = (j, X = !1) => j !== void 0 && (X || j && N) ? -j : j;
  return [
    {
      years: W(_t(r)),
      months: W(_t(i)),
      weeks: W(_t(a)),
      days: W(_t(c)),
      hours: W(_t(h)),
      minutes: W(_t(m)),
      seconds: W(_t(y), y === "-0"),
      milliseconds: W(Gi(E), C)
    }
  ];
}
const Il = {
  GMT: 0,
  EDT: -240,
  EST: -300,
  CDT: -300,
  CST: -360,
  MDT: -360,
  MST: -420,
  PDT: -420,
  PST: -480
};
function es(s, e, r, i, a, c, h) {
  const m = {
    year: e.length === 2 ? Wi(nt(e)) : nt(e),
    month: fa.indexOf(r) + 1,
    day: nt(i),
    hour: nt(a),
    minute: nt(c)
  };
  return h && (m.second = nt(h)), s && (m.weekday = s.length > 3 ? da.indexOf(s) + 1 : ma.indexOf(s) + 1), m;
}
const Al = /^(?:(Mon|Tue|Wed|Thu|Fri|Sat|Sun),\s)?(\d{1,2})\s(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)\s(\d{2,4})\s(\d\d):(\d\d)(?::(\d\d))?\s(?:(UT|GMT|[ECMP][SD]T)|([Zz])|(?:([+-]\d\d)(\d\d)))$/;
function $l(s) {
  const [
    ,
    e,
    r,
    i,
    a,
    c,
    h,
    m,
    y,
    E,
    N,
    C
  ] = s, W = es(e, a, i, r, c, h, m);
  let j;
  return y ? j = Il[y] : E ? j = 0 : j = Nr(N, C), [W, new _e(j)];
}
function Cl(s) {
  return s.replace(/\([^()]*\)|[\n\t]/g, " ").replace(/(\s\s+)/g, " ").trim();
}
const Dl = /^(Mon|Tue|Wed|Thu|Fri|Sat|Sun), (\d\d) (Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec) (\d{4}) (\d\d):(\d\d):(\d\d) GMT$/, Ml = /^(Monday|Tuesday|Wednesday|Thursday|Friday|Saturday|Sunday), (\d\d)-(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)-(\d\d) (\d\d):(\d\d):(\d\d) GMT$/, Nl = /^(Mon|Tue|Wed|Thu|Fri|Sat|Sun) (Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec) ( \d|\d\d) (\d\d):(\d\d):(\d\d) (\d{4})$/;
function so(s) {
  const [, e, r, i, a, c, h, m] = s;
  return [es(e, a, i, r, c, h, m), _e.utcInstance];
}
function Pl(s) {
  const [, e, r, i, a, c, h, m] = s;
  return [es(e, m, r, i, a, c, h), _e.utcInstance];
}
const Fl = tn(gl, Qi), Rl = tn(vl, Qi), Vl = tn(wl, Qi), Ul = tn(ka), Sa = nn(
  Tl,
  sn,
  Rn,
  Vn
), ql = nn(
  bl,
  sn,
  Rn,
  Vn
), Ll = nn(
  kl,
  sn,
  Rn,
  Vn
), jl = nn(
  sn,
  Rn,
  Vn
);
function Wl(s) {
  return rn(
    s,
    [Fl, Sa],
    [Rl, ql],
    [Vl, Ll],
    [Ul, jl]
  );
}
function Kl(s) {
  return rn(Cl(s), [Al, $l]);
}
function zl(s) {
  return rn(
    s,
    [Dl, so],
    [Ml, so],
    [Nl, Pl]
  );
}
function Bl(s) {
  return rn(s, [Ol, El]);
}
const Zl = nn(sn);
function Hl(s) {
  return rn(s, [xl, Zl]);
}
const Yl = tn(_l, Sl), Gl = tn(_a), Jl = nn(
  sn,
  Rn,
  Vn
);
function Xl(s) {
  return rn(
    s,
    [Yl, Sa],
    [Gl, Jl]
  );
}
const oo = "Invalid Duration", Ta = {
  weeks: {
    days: 7,
    hours: 168,
    minutes: 10080,
    seconds: 10080 * 60,
    milliseconds: 10080 * 60 * 1e3
  },
  days: {
    hours: 24,
    minutes: 1440,
    seconds: 1440 * 60,
    milliseconds: 1440 * 60 * 1e3
  },
  hours: { minutes: 60, seconds: 3600, milliseconds: 3600 * 1e3 },
  minutes: { seconds: 60, milliseconds: 60 * 1e3 },
  seconds: { milliseconds: 1e3 }
}, Ql = {
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
    hours: 2184,
    minutes: 2184 * 60,
    seconds: 2184 * 60 * 60,
    milliseconds: 2184 * 60 * 60 * 1e3
  },
  months: {
    weeks: 4,
    days: 30,
    hours: 720,
    minutes: 720 * 60,
    seconds: 720 * 60 * 60,
    milliseconds: 720 * 60 * 60 * 1e3
  },
  ...Ta
}, Ae = 146097 / 400, Lt = 146097 / 4800, ec = {
  years: {
    quarters: 4,
    months: 12,
    weeks: Ae / 7,
    days: Ae,
    hours: Ae * 24,
    minutes: Ae * 24 * 60,
    seconds: Ae * 24 * 60 * 60,
    milliseconds: Ae * 24 * 60 * 60 * 1e3
  },
  quarters: {
    months: 3,
    weeks: Ae / 28,
    days: Ae / 4,
    hours: Ae * 24 / 4,
    minutes: Ae * 24 * 60 / 4,
    seconds: Ae * 24 * 60 * 60 / 4,
    milliseconds: Ae * 24 * 60 * 60 * 1e3 / 4
  },
  months: {
    weeks: Lt / 7,
    days: Lt,
    hours: Lt * 24,
    minutes: Lt * 24 * 60,
    seconds: Lt * 24 * 60 * 60,
    milliseconds: Lt * 24 * 60 * 60 * 1e3
  },
  ...Ta
}, Ot = [
  "years",
  "quarters",
  "months",
  "weeks",
  "days",
  "hours",
  "minutes",
  "seconds",
  "milliseconds"
], tc = Ot.slice(0).reverse();
function ze(s, e, r = !1) {
  const i = {
    values: r ? e.values : { ...s.values, ...e.values || {} },
    loc: s.loc.clone(e.loc),
    conversionAccuracy: e.conversionAccuracy || s.conversionAccuracy,
    matrix: e.matrix || s.matrix
  };
  return new ee(i);
}
function xa(s, e) {
  let r = e.milliseconds ?? 0;
  for (const i of tc.slice(1))
    e[i] && (r += e[i] * s[i].milliseconds);
  return r;
}
function ao(s, e) {
  const r = xa(s, e) < 0 ? -1 : 1;
  Ot.reduceRight((i, a) => {
    if (Z(e[a]))
      return i;
    if (i) {
      const c = e[i] * r, h = s[a][i], m = Math.floor(c / h);
      e[a] += m * r, e[i] -= m * h * r;
    }
    return a;
  }, null), Ot.reduce((i, a) => {
    if (Z(e[a]))
      return i;
    if (i) {
      const c = e[i] % 1;
      e[i] -= c, e[a] += c * s[i][a];
    }
    return a;
  }, null);
}
function uo(s) {
  const e = {};
  for (const [r, i] of Object.entries(s))
    i !== 0 && (e[r] = i);
  return e;
}
class ee {
  /**
   * @private
   */
  constructor(e) {
    const r = e.conversionAccuracy === "longterm" || !1;
    let i = r ? ec : Ql;
    e.matrix && (i = e.matrix), this.values = e.values, this.loc = e.loc || re.create(), this.conversionAccuracy = r ? "longterm" : "casual", this.invalid = e.invalid || null, this.matrix = i, this.isLuxonDuration = !0;
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
  static fromMillis(e, r) {
    return ee.fromObject({ milliseconds: e }, r);
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
  static fromObject(e, r = {}) {
    if (e == null || typeof e != "object")
      throw new be(
        `Duration.fromObject: argument expected to be an object, got ${e === null ? "null" : typeof e}`
      );
    return new ee({
      values: Ir(e, ee.normalizeUnit),
      loc: re.fromObject(r),
      conversionAccuracy: r.conversionAccuracy,
      matrix: r.matrix
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
  static fromDurationLike(e) {
    if (ot(e))
      return ee.fromMillis(e);
    if (ee.isDuration(e))
      return e;
    if (typeof e == "object")
      return ee.fromObject(e);
    throw new be(
      `Unknown duration argument ${e} of type ${typeof e}`
    );
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
  static fromISO(e, r) {
    const [i] = Bl(e);
    return i ? ee.fromObject(i, r) : ee.invalid("unparsable", `the input "${e}" can't be parsed as ISO 8601`);
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
  static fromISOTime(e, r) {
    const [i] = Hl(e);
    return i ? ee.fromObject(i, r) : ee.invalid("unparsable", `the input "${e}" can't be parsed as ISO 8601`);
  }
  /**
   * Create an invalid Duration.
   * @param {string} reason - simple string of why this datetime is invalid. Should not contain parameters or anything else data-dependent
   * @param {string} [explanation=null] - longer explanation, may include parameters and other useful debugging information
   * @return {Duration}
   */
  static invalid(e, r = null) {
    if (!e)
      throw new be("need to specify a reason the Duration is invalid");
    const i = e instanceof Pe ? e : new Pe(e, r);
    if (ue.throwOnInvalid)
      throw new Iu(i);
    return new ee({ invalid: i });
  }
  /**
   * @private
   */
  static normalizeUnit(e) {
    const r = {
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
    }[e && e.toLowerCase()];
    if (!r) throw new Do(e);
    return r;
  }
  /**
   * Check if an object is a Duration. Works across context boundaries
   * @param {object} o
   * @return {boolean}
   */
  static isDuration(e) {
    return e && e.isLuxonDuration || !1;
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
   * @param {'negative'|'all'|'negativeLargestOnly'} [opts.signMode=negative] - How to handle signs
   * @example Duration.fromObject({ years: 1, days: 6, seconds: 2 }).toFormat("y d s") //=> "1 6 2"
   * @example Duration.fromObject({ years: 1, days: 6, seconds: 2 }).toFormat("yy dd sss") //=> "01 06 002"
   * @example Duration.fromObject({ years: 1, days: 6, seconds: 2 }).toFormat("M S") //=> "12 518402000"
   * @example Duration.fromObject({ days: 6, seconds: 2 }).toFormat("d s", { signMode: "all" }) //=> "+6 +2"
   * @example Duration.fromObject({ days: -6, seconds: -2 }).toFormat("d s", { signMode: "all" }) //=> "-6 -2"
   * @example Duration.fromObject({ days: -6, seconds: -2 }).toFormat("d s", { signMode: "negativeLargestOnly" }) //=> "-6 2"
   * @return {string}
   */
  toFormat(e, r = {}) {
    const i = {
      ...r,
      floor: r.round !== !1 && r.floor !== !1
    };
    return this.isValid ? ke.create(this.loc, i).formatDurationFromString(this, e) : oo;
  }
  /**
   * Returns a string representation of a Duration with all units included.
   * To modify its behavior, use `listStyle` and any Intl.NumberFormat option, though `unitDisplay` is especially relevant.
   * @see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/NumberFormat/NumberFormat#options
   * @param {Object} opts - Formatting options. Accepts the same keys as the options parameter of the native `Intl.NumberFormat` constructor, as well as `listStyle`.
   * @param {string} [opts.listStyle='narrow'] - How to format the merged list. Corresponds to the `style` property of the options parameter of the native `Intl.ListFormat` constructor.
   * @param {boolean} [opts.showZeros=true] - Show all units previously used by the duration even if they are zero
   * @example
   * ```js
   * var dur = Duration.fromObject({ months: 1, weeks: 0, hours: 5, minutes: 6 })
   * dur.toHuman() //=> '1 month, 0 weeks, 5 hours, 6 minutes'
   * dur.toHuman({ listStyle: "long" }) //=> '1 month, 0 weeks, 5 hours, and 6 minutes'
   * dur.toHuman({ unitDisplay: "short" }) //=> '1 mth, 0 wks, 5 hr, 6 min'
   * dur.toHuman({ showZeros: false }) //=> '1 month, 5 hours, 6 minutes'
   * ```
   */
  toHuman(e = {}) {
    if (!this.isValid) return oo;
    const r = e.showZeros !== !1, i = Ot.map((a) => {
      const c = this.values[a];
      return Z(c) || c === 0 && !r ? null : this.loc.numberFormatter({ style: "unit", unitDisplay: "long", ...e, unit: a.slice(0, -1) }).format(c);
    }).filter((a) => a);
    return this.loc.listFormatter({ type: "conjunction", style: e.listStyle || "narrow", ...e }).format(i);
  }
  /**
   * Returns a JavaScript object with this Duration's values.
   * @example Duration.fromObject({ years: 1, days: 6, seconds: 2 }).toObject() //=> { years: 1, days: 6, seconds: 2 }
   * @return {Object}
   */
  toObject() {
    return this.isValid ? { ...this.values } : {};
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
    let e = "P";
    return this.years !== 0 && (e += this.years + "Y"), (this.months !== 0 || this.quarters !== 0) && (e += this.months + this.quarters * 3 + "M"), this.weeks !== 0 && (e += this.weeks + "W"), this.days !== 0 && (e += this.days + "D"), (this.hours !== 0 || this.minutes !== 0 || this.seconds !== 0 || this.milliseconds !== 0) && (e += "T"), this.hours !== 0 && (e += this.hours + "H"), this.minutes !== 0 && (e += this.minutes + "M"), (this.seconds !== 0 || this.milliseconds !== 0) && (e += Ji(this.seconds + this.milliseconds / 1e3, 3) + "S"), e === "P" && (e += "T0S"), e;
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
  toISOTime(e = {}) {
    if (!this.isValid) return null;
    const r = this.toMillis();
    return r < 0 || r >= 864e5 ? null : (e = {
      suppressMilliseconds: !1,
      suppressSeconds: !1,
      includePrefix: !1,
      format: "extended",
      ...e,
      includeOffset: !1
    }, B.fromMillis(r, { zone: "UTC" }).toISOTime(e));
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
    return this.isValid ? `Duration { values: ${JSON.stringify(this.values)} }` : `Duration { Invalid, reason: ${this.invalidReason} }`;
  }
  /**
   * Returns an milliseconds value of this Duration.
   * @return {number}
   */
  toMillis() {
    return this.isValid ? xa(this.matrix, this.values) : NaN;
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
  plus(e) {
    if (!this.isValid) return this;
    const r = ee.fromDurationLike(e), i = {};
    for (const a of Ot)
      (Jt(r.values, a) || Jt(this.values, a)) && (i[a] = r.get(a) + this.get(a));
    return ze(this, { values: i }, !0);
  }
  /**
   * Make this Duration shorter by the specified amount. Return a newly-constructed Duration.
   * @param {Duration|Object|number} duration - The amount to subtract. Either a Luxon Duration, a number of milliseconds, the object argument to Duration.fromObject()
   * @return {Duration}
   */
  minus(e) {
    if (!this.isValid) return this;
    const r = ee.fromDurationLike(e);
    return this.plus(r.negate());
  }
  /**
   * Scale this Duration by the specified amount. Return a newly-constructed Duration.
   * @param {function} fn - The function to apply to each unit. Arity is 1 or 2: the value of the unit and, optionally, the unit name. Must return a number.
   * @example Duration.fromObject({ hours: 1, minutes: 30 }).mapUnits(x => x * 2) //=> { hours: 2, minutes: 60 }
   * @example Duration.fromObject({ hours: 1, minutes: 30 }).mapUnits((x, u) => u === "hours" ? x * 2 : x) //=> { hours: 2, minutes: 30 }
   * @return {Duration}
   */
  mapUnits(e) {
    if (!this.isValid) return this;
    const r = {};
    for (const i of Object.keys(this.values))
      r[i] = ca(e(this.values[i], i));
    return ze(this, { values: r }, !0);
  }
  /**
   * Get the value of unit.
   * @param {string} unit - a unit such as 'minute' or 'day'
   * @example Duration.fromObject({years: 2, days: 3}).get('years') //=> 2
   * @example Duration.fromObject({years: 2, days: 3}).get('months') //=> 0
   * @example Duration.fromObject({years: 2, days: 3}).get('days') //=> 3
   * @return {number}
   */
  get(e) {
    return this[ee.normalizeUnit(e)];
  }
  /**
   * "Set" the values of specified units. Return a newly-constructed Duration.
   * @param {Object} values - a mapping of units to numbers
   * @example dur.set({ years: 2017 })
   * @example dur.set({ hours: 8, minutes: 30 })
   * @return {Duration}
   */
  set(e) {
    if (!this.isValid) return this;
    const r = { ...this.values, ...Ir(e, ee.normalizeUnit) };
    return ze(this, { values: r });
  }
  /**
   * "Set" the locale and/or numberingSystem.  Returns a newly-constructed Duration.
   * @example dur.reconfigure({ locale: 'en-GB' })
   * @return {Duration}
   */
  reconfigure({ locale: e, numberingSystem: r, conversionAccuracy: i, matrix: a } = {}) {
    const h = { loc: this.loc.clone({ locale: e, numberingSystem: r }), matrix: a, conversionAccuracy: i };
    return ze(this, h);
  }
  /**
   * Return the length of the duration in the specified unit.
   * @param {string} unit - a unit such as 'minutes' or 'days'
   * @example Duration.fromObject({years: 1}).as('days') //=> 365
   * @example Duration.fromObject({years: 1}).as('months') //=> 12
   * @example Duration.fromObject({hours: 60}).as('days') //=> 2.5
   * @return {number}
   */
  as(e) {
    return this.isValid ? this.shiftTo(e).get(e) : NaN;
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
    const e = this.toObject();
    return ao(this.matrix, e), ze(this, { values: e }, !0);
  }
  /**
   * Rescale units to its largest representation
   * @example Duration.fromObject({ milliseconds: 90000 }).rescale().toObject() //=> { minutes: 1, seconds: 30 }
   * @return {Duration}
   */
  rescale() {
    if (!this.isValid) return this;
    const e = uo(this.normalize().shiftToAll().toObject());
    return ze(this, { values: e }, !0);
  }
  /**
   * Convert this Duration into its representation in a different set of units.
   * @example Duration.fromObject({ hours: 1, seconds: 30 }).shiftTo('minutes', 'milliseconds').toObject() //=> { minutes: 60, milliseconds: 30000 }
   * @return {Duration}
   */
  shiftTo(...e) {
    if (!this.isValid) return this;
    if (e.length === 0)
      return this;
    e = e.map((h) => ee.normalizeUnit(h));
    const r = {}, i = {}, a = this.toObject();
    let c;
    for (const h of Ot)
      if (e.indexOf(h) >= 0) {
        c = h;
        let m = 0;
        for (const E in i)
          m += this.matrix[E][h] * i[E], i[E] = 0;
        ot(a[h]) && (m += a[h]);
        const y = Math.trunc(m);
        r[h] = y, i[h] = (m * 1e3 - y * 1e3) / 1e3;
      } else ot(a[h]) && (i[h] = a[h]);
    for (const h in i)
      i[h] !== 0 && (r[c] += h === c ? i[h] : i[h] / this.matrix[c][h]);
    return ao(this.matrix, r), ze(this, { values: r }, !0);
  }
  /**
   * Shift this Duration to all available units.
   * Same as shiftTo("years", "months", "weeks", "days", "hours", "minutes", "seconds", "milliseconds")
   * @return {Duration}
   */
  shiftToAll() {
    return this.isValid ? this.shiftTo(
      "years",
      "months",
      "weeks",
      "days",
      "hours",
      "minutes",
      "seconds",
      "milliseconds"
    ) : this;
  }
  /**
   * Return the negative of this Duration.
   * @example Duration.fromObject({ hours: 1, seconds: 30 }).negate().toObject() //=> { hours: -1, seconds: -30 }
   * @return {Duration}
   */
  negate() {
    if (!this.isValid) return this;
    const e = {};
    for (const r of Object.keys(this.values))
      e[r] = this.values[r] === 0 ? 0 : -this.values[r];
    return ze(this, { values: e }, !0);
  }
  /**
   * Removes all units with values equal to 0 from this Duration.
   * @example Duration.fromObject({ years: 2, days: 0, hours: 0, minutes: 0 }).removeZeros().toObject() //=> { years: 2 }
   * @return {Duration}
   */
  removeZeros() {
    if (!this.isValid) return this;
    const e = uo(this.values);
    return ze(this, { values: e }, !0);
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
  equals(e) {
    if (!this.isValid || !e.isValid || !this.loc.equals(e.loc))
      return !1;
    function r(i, a) {
      return i === void 0 || i === 0 ? a === void 0 || a === 0 : i === a;
    }
    for (const i of Ot)
      if (!r(this.values[i], e.values[i]))
        return !1;
    return !0;
  }
}
const jt = "Invalid Interval";
function nc(s, e) {
  return !s || !s.isValid ? ae.invalid("missing or invalid start") : !e || !e.isValid ? ae.invalid("missing or invalid end") : e < s ? ae.invalid(
    "end before start",
    `The end of an interval must be after its start, but you had start=${s.toISO()} and end=${e.toISO()}`
  ) : null;
}
class ae {
  /**
   * @private
   */
  constructor(e) {
    this.s = e.start, this.e = e.end, this.invalid = e.invalid || null, this.isLuxonInterval = !0;
  }
  /**
   * Create an invalid Interval.
   * @param {string} reason - simple string of why this Interval is invalid. Should not contain parameters or anything else data-dependent
   * @param {string} [explanation=null] - longer explanation, may include parameters and other useful debugging information
   * @return {Interval}
   */
  static invalid(e, r = null) {
    if (!e)
      throw new be("need to specify a reason the Interval is invalid");
    const i = e instanceof Pe ? e : new Pe(e, r);
    if (ue.throwOnInvalid)
      throw new Eu(i);
    return new ae({ invalid: i });
  }
  /**
   * Create an Interval from a start DateTime and an end DateTime. Inclusive of the start but not the end.
   * @param {DateTime|Date|Object} start
   * @param {DateTime|Date|Object} end
   * @return {Interval}
   */
  static fromDateTimes(e, r) {
    const i = Sn(e), a = Sn(r), c = nc(i, a);
    return c ?? new ae({
      start: i,
      end: a
    });
  }
  /**
   * Create an Interval from a start DateTime and a Duration to extend to.
   * @param {DateTime|Date|Object} start
   * @param {Duration|Object|number} duration - the length of the Interval.
   * @return {Interval}
   */
  static after(e, r) {
    const i = ee.fromDurationLike(r), a = Sn(e);
    return ae.fromDateTimes(a, a.plus(i));
  }
  /**
   * Create an Interval from an end DateTime and a Duration to extend backwards to.
   * @param {DateTime|Date|Object} end
   * @param {Duration|Object|number} duration - the length of the Interval.
   * @return {Interval}
   */
  static before(e, r) {
    const i = ee.fromDurationLike(r), a = Sn(e);
    return ae.fromDateTimes(a.minus(i), a);
  }
  /**
   * Create an Interval from an ISO 8601 string.
   * Accepts `<start>/<end>`, `<start>/<duration>`, and `<duration>/<end>` formats.
   * @param {string} text - the ISO string to parse
   * @param {Object} [opts] - options to pass {@link DateTime#fromISO} and optionally {@link Duration#fromISO}
   * @see https://en.wikipedia.org/wiki/ISO_8601#Time_intervals
   * @return {Interval}
   */
  static fromISO(e, r) {
    const [i, a] = (e || "").split("/", 2);
    if (i && a) {
      let c, h;
      try {
        c = B.fromISO(i, r), h = c.isValid;
      } catch {
        h = !1;
      }
      let m, y;
      try {
        m = B.fromISO(a, r), y = m.isValid;
      } catch {
        y = !1;
      }
      if (h && y)
        return ae.fromDateTimes(c, m);
      if (h) {
        const E = ee.fromISO(a, r);
        if (E.isValid)
          return ae.after(c, E);
      } else if (y) {
        const E = ee.fromISO(i, r);
        if (E.isValid)
          return ae.before(m, E);
      }
    }
    return ae.invalid("unparsable", `the input "${e}" can't be parsed as ISO 8601`);
  }
  /**
   * Check if an object is an Interval. Works across context boundaries
   * @param {object} o
   * @return {boolean}
   */
  static isInterval(e) {
    return e && e.isLuxonInterval || !1;
  }
  /**
   * Returns the start of the Interval
   * @type {DateTime}
   */
  get start() {
    return this.isValid ? this.s : null;
  }
  /**
   * Returns the end of the Interval. This is the first instant which is not part of the interval
   * (Interval is half-open).
   * @type {DateTime}
   */
  get end() {
    return this.isValid ? this.e : null;
  }
  /**
   * Returns the last DateTime included in the interval (since end is not part of the interval)
   * @type {DateTime}
   */
  get lastDateTime() {
    return this.isValid && this.e ? this.e.minus(1) : null;
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
  length(e = "milliseconds") {
    return this.isValid ? this.toDuration(e).get(e) : NaN;
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
  count(e = "milliseconds", r) {
    if (!this.isValid) return NaN;
    const i = this.start.startOf(e, r);
    let a;
    return r?.useLocaleWeeks ? a = this.end.reconfigure({ locale: i.locale }) : a = this.end, a = a.startOf(e, r), Math.floor(a.diff(i, e).get(e)) + (a.valueOf() !== this.end.valueOf());
  }
  /**
   * Returns whether this Interval's start and end are both in the same unit of time
   * @param {string} unit - the unit of time to check sameness on
   * @return {boolean}
   */
  hasSame(e) {
    return this.isValid ? this.isEmpty() || this.e.minus(1).hasSame(this.s, e) : !1;
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
  isAfter(e) {
    return this.isValid ? this.s > e : !1;
  }
  /**
   * Return whether this Interval's end is before the specified DateTime.
   * @param {DateTime} dateTime
   * @return {boolean}
   */
  isBefore(e) {
    return this.isValid ? this.e <= e : !1;
  }
  /**
   * Return whether this Interval contains the specified DateTime.
   * @param {DateTime} dateTime
   * @return {boolean}
   */
  contains(e) {
    return this.isValid ? this.s <= e && this.e > e : !1;
  }
  /**
   * "Sets" the start and/or end dates. Returns a newly-constructed Interval.
   * @param {Object} values - the values to set
   * @param {DateTime} values.start - the starting DateTime
   * @param {DateTime} values.end - the ending DateTime
   * @return {Interval}
   */
  set({ start: e, end: r } = {}) {
    return this.isValid ? ae.fromDateTimes(e || this.s, r || this.e) : this;
  }
  /**
   * Split this Interval at each of the specified DateTimes
   * @param {...DateTime} dateTimes - the unit of time to count.
   * @return {Array}
   */
  splitAt(...e) {
    if (!this.isValid) return [];
    const r = e.map(Sn).filter((h) => this.contains(h)).sort((h, m) => h.toMillis() - m.toMillis()), i = [];
    let { s: a } = this, c = 0;
    for (; a < this.e; ) {
      const h = r[c] || this.e, m = +h > +this.e ? this.e : h;
      i.push(ae.fromDateTimes(a, m)), a = m, c += 1;
    }
    return i;
  }
  /**
   * Split this Interval into smaller Intervals, each of the specified length.
   * Left over time is grouped into a smaller interval
   * @param {Duration|Object|number} duration - The length of each resulting interval.
   * @return {Array}
   */
  splitBy(e) {
    const r = ee.fromDurationLike(e);
    if (!this.isValid || !r.isValid || r.as("milliseconds") === 0)
      return [];
    let { s: i } = this, a = 1, c;
    const h = [];
    for (; i < this.e; ) {
      const m = this.start.plus(r.mapUnits((y) => y * a));
      c = +m > +this.e ? this.e : m, h.push(ae.fromDateTimes(i, c)), i = c, a += 1;
    }
    return h;
  }
  /**
   * Split this Interval into the specified number of smaller intervals.
   * @param {number} numberOfParts - The number of Intervals to divide the Interval into.
   * @return {Array}
   */
  divideEqually(e) {
    return this.isValid ? this.splitBy(this.length() / e).slice(0, e) : [];
  }
  /**
   * Return whether this Interval overlaps with the specified Interval
   * @param {Interval} other
   * @return {boolean}
   */
  overlaps(e) {
    return this.e > e.s && this.s < e.e;
  }
  /**
   * Return whether this Interval's end is adjacent to the specified Interval's start.
   * @param {Interval} other
   * @return {boolean}
   */
  abutsStart(e) {
    return this.isValid ? +this.e == +e.s : !1;
  }
  /**
   * Return whether this Interval's start is adjacent to the specified Interval's end.
   * @param {Interval} other
   * @return {boolean}
   */
  abutsEnd(e) {
    return this.isValid ? +e.e == +this.s : !1;
  }
  /**
   * Returns true if this Interval fully contains the specified Interval, specifically if the intersect (of this Interval and the other Interval) is equal to the other Interval; false otherwise.
   * @param {Interval} other
   * @return {boolean}
   */
  engulfs(e) {
    return this.isValid ? this.s <= e.s && this.e >= e.e : !1;
  }
  /**
   * Return whether this Interval has the same start and end as the specified Interval.
   * @param {Interval} other
   * @return {boolean}
   */
  equals(e) {
    return !this.isValid || !e.isValid ? !1 : this.s.equals(e.s) && this.e.equals(e.e);
  }
  /**
   * Return an Interval representing the intersection of this Interval and the specified Interval.
   * Specifically, the resulting Interval has the maximum start time and the minimum end time of the two Intervals.
   * Returns null if the intersection is empty, meaning, the intervals don't intersect.
   * @param {Interval} other
   * @return {Interval}
   */
  intersection(e) {
    if (!this.isValid) return this;
    const r = this.s > e.s ? this.s : e.s, i = this.e < e.e ? this.e : e.e;
    return r >= i ? null : ae.fromDateTimes(r, i);
  }
  /**
   * Return an Interval representing the union of this Interval and the specified Interval.
   * Specifically, the resulting Interval has the minimum start time and the maximum end time of the two Intervals.
   * @param {Interval} other
   * @return {Interval}
   */
  union(e) {
    if (!this.isValid) return this;
    const r = this.s < e.s ? this.s : e.s, i = this.e > e.e ? this.e : e.e;
    return ae.fromDateTimes(r, i);
  }
  /**
   * Merge an array of Intervals into an equivalent minimal set of Intervals.
   * Combines overlapping and adjacent Intervals.
   * The resulting array will contain the Intervals in ascending order, that is, starting with the earliest Interval
   * and ending with the latest.
   *
   * @param {Array} intervals
   * @return {Array}
   */
  static merge(e) {
    const [r, i] = e.sort((a, c) => a.s - c.s).reduce(
      ([a, c], h) => c ? c.overlaps(h) || c.abutsStart(h) ? [a, c.union(h)] : [a.concat([c]), h] : [a, h],
      [[], null]
    );
    return i && r.push(i), r;
  }
  /**
   * Return an array of Intervals representing the spans of time that only appear in one of the specified Intervals.
   * @param {Array} intervals
   * @return {Array}
   */
  static xor(e) {
    let r = null, i = 0;
    const a = [], c = e.map((y) => [
      { time: y.s, type: "s" },
      { time: y.e, type: "e" }
    ]), h = Array.prototype.concat(...c), m = h.sort((y, E) => y.time - E.time);
    for (const y of m)
      i += y.type === "s" ? 1 : -1, i === 1 ? r = y.time : (r && +r != +y.time && a.push(ae.fromDateTimes(r, y.time)), r = null);
    return ae.merge(a);
  }
  /**
   * Return an Interval representing the span of time in this Interval that doesn't overlap with any of the specified Intervals.
   * @param {...Interval} intervals
   * @return {Array}
   */
  difference(...e) {
    return ae.xor([this].concat(e)).map((r) => this.intersection(r)).filter((r) => r && !r.isEmpty());
  }
  /**
   * Returns a string representation of this Interval appropriate for debugging.
   * @return {string}
   */
  toString() {
    return this.isValid ? `[${this.s.toISO()} – ${this.e.toISO()})` : jt;
  }
  /**
   * Returns a string representation of this Interval appropriate for the REPL.
   * @return {string}
   */
  [Symbol.for("nodejs.util.inspect.custom")]() {
    return this.isValid ? `Interval { start: ${this.s.toISO()}, end: ${this.e.toISO()} }` : `Interval { Invalid, reason: ${this.invalidReason} }`;
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
  toLocaleString(e = xr, r = {}) {
    return this.isValid ? ke.create(this.s.loc.clone(r), e).formatInterval(this) : jt;
  }
  /**
   * Returns an ISO 8601-compliant string representation of this Interval.
   * @see https://en.wikipedia.org/wiki/ISO_8601#Time_intervals
   * @param {Object} opts - The same options as {@link DateTime#toISO}
   * @return {string}
   */
  toISO(e) {
    return this.isValid ? `${this.s.toISO(e)}/${this.e.toISO(e)}` : jt;
  }
  /**
   * Returns an ISO 8601-compliant string representation of date of this Interval.
   * The time components are ignored.
   * @see https://en.wikipedia.org/wiki/ISO_8601#Time_intervals
   * @return {string}
   */
  toISODate() {
    return this.isValid ? `${this.s.toISODate()}/${this.e.toISODate()}` : jt;
  }
  /**
   * Returns an ISO 8601-compliant string representation of time of this Interval.
   * The date components are ignored.
   * @see https://en.wikipedia.org/wiki/ISO_8601#Time_intervals
   * @param {Object} opts - The same options as {@link DateTime#toISO}
   * @return {string}
   */
  toISOTime(e) {
    return this.isValid ? `${this.s.toISOTime(e)}/${this.e.toISOTime(e)}` : jt;
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
  toFormat(e, { separator: r = " – " } = {}) {
    return this.isValid ? `${this.s.toFormat(e)}${r}${this.e.toFormat(e)}` : jt;
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
  toDuration(e, r) {
    return this.isValid ? this.e.diff(this.s, e, r) : ee.invalid(this.invalidReason);
  }
  /**
   * Run mapFn on the interval start and end, returning a new Interval from the resulting DateTimes
   * @param {function} mapFn
   * @return {Interval}
   * @example Interval.fromDateTimes(dt1, dt2).mapEndpoints(endpoint => endpoint.toUTC())
   * @example Interval.fromDateTimes(dt1, dt2).mapEndpoints(endpoint => endpoint.plus({ hours: 2 }))
   */
  mapEndpoints(e) {
    return ae.fromDateTimes(e(this.s), e(this.e));
  }
}
class On {
  /**
   * Return whether the specified zone contains a DST.
   * @param {string|Zone} [zone='local'] - Zone to check. Defaults to the environment's local zone.
   * @return {boolean}
   */
  static hasDST(e = ue.defaultZone) {
    const r = B.now().setZone(e).set({ month: 12 });
    return !e.isUniversal && r.offset !== r.set({ month: 6 }).offset;
  }
  /**
   * Return whether the specified zone is a valid IANA specifier.
   * @param {string} zone - Zone to check
   * @return {boolean}
   */
  static isValidIANAZone(e) {
    return Le.isValidZone(e);
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
  static normalizeZone(e) {
    return rt(e, ue.defaultZone);
  }
  /**
   * Get the weekday on which the week starts according to the given locale.
   * @param {Object} opts - options
   * @param {string} [opts.locale] - the locale code
   * @param {string} [opts.locObj=null] - an existing locale object to use
   * @returns {number} the start of the week, 1 for Monday through 7 for Sunday
   */
  static getStartOfWeek({ locale: e = null, locObj: r = null } = {}) {
    return (r || re.create(e)).getStartOfWeek();
  }
  /**
   * Get the minimum number of days necessary in a week before it is considered part of the next year according
   * to the given locale.
   * @param {Object} opts - options
   * @param {string} [opts.locale] - the locale code
   * @param {string} [opts.locObj=null] - an existing locale object to use
   * @returns {number}
   */
  static getMinimumDaysInFirstWeek({ locale: e = null, locObj: r = null } = {}) {
    return (r || re.create(e)).getMinDaysInFirstWeek();
  }
  /**
   * Get the weekdays, which are considered the weekend according to the given locale
   * @param {Object} opts - options
   * @param {string} [opts.locale] - the locale code
   * @param {string} [opts.locObj=null] - an existing locale object to use
   * @returns {number[]} an array of weekdays, 1 for Monday through 7 for Sunday
   */
  static getWeekendWeekdays({ locale: e = null, locObj: r = null } = {}) {
    return (r || re.create(e)).getWeekendDays().slice();
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
  static months(e = "long", { locale: r = null, numberingSystem: i = null, locObj: a = null, outputCalendar: c = "gregory" } = {}) {
    return (a || re.create(r, i, c)).months(e);
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
  static monthsFormat(e = "long", { locale: r = null, numberingSystem: i = null, locObj: a = null, outputCalendar: c = "gregory" } = {}) {
    return (a || re.create(r, i, c)).months(e, !0);
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
  static weekdays(e = "long", { locale: r = null, numberingSystem: i = null, locObj: a = null } = {}) {
    return (a || re.create(r, i, null)).weekdays(e);
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
  static weekdaysFormat(e = "long", { locale: r = null, numberingSystem: i = null, locObj: a = null } = {}) {
    return (a || re.create(r, i, null)).weekdays(e, !0);
  }
  /**
   * Return an array of meridiems.
   * @param {Object} opts - options
   * @param {string} [opts.locale] - the locale code
   * @example Info.meridiems() //=> [ 'AM', 'PM' ]
   * @example Info.meridiems({ locale: 'my' }) //=> [ 'နံနက်', 'ညနေ' ]
   * @return {Array}
   */
  static meridiems({ locale: e = null } = {}) {
    return re.create(e).meridiems();
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
  static eras(e = "short", { locale: r = null } = {}) {
    return re.create(r, null, "gregory").eras(e);
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
    return { relative: aa(), localeWeek: ua() };
  }
}
function lo(s, e) {
  const r = (a) => a.toUTC(0, { keepLocalTime: !0 }).startOf("day").valueOf(), i = r(e) - r(s);
  return Math.floor(ee.fromMillis(i).as("days"));
}
function rc(s, e, r) {
  const i = [
    ["years", (y, E) => E.year - y.year],
    ["quarters", (y, E) => E.quarter - y.quarter + (E.year - y.year) * 4],
    ["months", (y, E) => E.month - y.month + (E.year - y.year) * 12],
    [
      "weeks",
      (y, E) => {
        const N = lo(y, E);
        return (N - N % 7) / 7;
      }
    ],
    ["days", lo]
  ], a = {}, c = s;
  let h, m;
  for (const [y, E] of i)
    r.indexOf(y) >= 0 && (h = y, a[y] = E(s, e), m = c.plus(a), m > e ? (a[y]--, s = c.plus(a), s > e && (m = s, a[y]--, s = c.plus(a))) : s = m);
  return [s, a, m, h];
}
function ic(s, e, r, i) {
  let [a, c, h, m] = rc(s, e, r);
  const y = e - a, E = r.filter(
    (C) => ["hours", "minutes", "seconds", "milliseconds"].indexOf(C) >= 0
  );
  E.length === 0 && (h < e && (h = a.plus({ [m]: 1 })), h !== a && (c[m] = (c[m] || 0) + y / (h - a)));
  const N = ee.fromObject(c, i);
  return E.length > 0 ? ee.fromMillis(y, i).shiftTo(...E).plus(N) : N;
}
const sc = "missing Intl.DateTimeFormat.formatToParts support";
function ne(s, e = (r) => r) {
  return { regex: s, deser: ([r]) => e(Yu(r)) };
}
const oc = " ", Oa = `[ ${oc}]`, Ea = new RegExp(Oa, "g");
function ac(s) {
  return s.replace(/\./g, "\\.?").replace(Ea, Oa);
}
function co(s) {
  return s.replace(/\./g, "").replace(Ea, " ").toLowerCase();
}
function Ne(s, e) {
  return s === null ? null : {
    regex: RegExp(s.map(ac).join("|")),
    deser: ([r]) => s.findIndex((i) => co(r) === co(i)) + e
  };
}
function fo(s, e) {
  return { regex: s, deser: ([, r, i]) => Nr(r, i), groups: e };
}
function yr(s) {
  return { regex: s, deser: ([e]) => e };
}
function uc(s) {
  return s.replace(/[\-\[\]{}()*+?.,\\\^$|#\s]/g, "\\$&");
}
function lc(s, e) {
  const r = Me(e), i = Me(e, "{2}"), a = Me(e, "{3}"), c = Me(e, "{4}"), h = Me(e, "{6}"), m = Me(e, "{1,2}"), y = Me(e, "{1,3}"), E = Me(e, "{1,6}"), N = Me(e, "{1,9}"), C = Me(e, "{2,4}"), W = Me(e, "{4,6}"), j = (Ee) => ({ regex: RegExp(uc(Ee.val)), deser: ([Be]) => Be, literal: !0 }), me = ((Ee) => {
    if (s.literal)
      return j(Ee);
    switch (Ee.val) {
      // era
      case "G":
        return Ne(e.eras("short"), 0);
      case "GG":
        return Ne(e.eras("long"), 0);
      // years
      case "y":
        return ne(E);
      case "yy":
        return ne(C, Wi);
      case "yyyy":
        return ne(c);
      case "yyyyy":
        return ne(W);
      case "yyyyyy":
        return ne(h);
      // months
      case "M":
        return ne(m);
      case "MM":
        return ne(i);
      case "MMM":
        return Ne(e.months("short", !0), 1);
      case "MMMM":
        return Ne(e.months("long", !0), 1);
      case "L":
        return ne(m);
      case "LL":
        return ne(i);
      case "LLL":
        return Ne(e.months("short", !1), 1);
      case "LLLL":
        return Ne(e.months("long", !1), 1);
      // dates
      case "d":
        return ne(m);
      case "dd":
        return ne(i);
      // ordinals
      case "o":
        return ne(y);
      case "ooo":
        return ne(a);
      // time
      case "HH":
        return ne(i);
      case "H":
        return ne(m);
      case "hh":
        return ne(i);
      case "h":
        return ne(m);
      case "mm":
        return ne(i);
      case "m":
        return ne(m);
      case "q":
        return ne(m);
      case "qq":
        return ne(i);
      case "s":
        return ne(m);
      case "ss":
        return ne(i);
      case "S":
        return ne(y);
      case "SSS":
        return ne(a);
      case "u":
        return yr(N);
      case "uu":
        return yr(m);
      case "uuu":
        return ne(r);
      // meridiem
      case "a":
        return Ne(e.meridiems(), 0);
      // weekYear (k)
      case "kkkk":
        return ne(c);
      case "kk":
        return ne(C, Wi);
      // weekNumber (W)
      case "W":
        return ne(m);
      case "WW":
        return ne(i);
      // weekdays
      case "E":
      case "c":
        return ne(r);
      case "EEE":
        return Ne(e.weekdays("short", !1), 1);
      case "EEEE":
        return Ne(e.weekdays("long", !1), 1);
      case "ccc":
        return Ne(e.weekdays("short", !0), 1);
      case "cccc":
        return Ne(e.weekdays("long", !0), 1);
      // offset/zone
      case "Z":
      case "ZZ":
        return fo(new RegExp(`([+-]${m.source})(?::(${i.source}))?`), 2);
      case "ZZZ":
        return fo(new RegExp(`([+-]${m.source})(${i.source})?`), 2);
      // we don't support ZZZZ (PST) or ZZZZZ (Pacific Standard Time) in parsing
      // because we don't have any way to figure out what they are
      case "z":
        return yr(/[a-z_+-/]{1,256}?/i);
      // this special-case "token" represents a place where a macro-token expanded into a white-space literal
      // in this case we accept any non-newline white-space
      case " ":
        return yr(/[^\S\n\r]/);
      default:
        return j(Ee);
    }
  })(s) || {
    invalidReason: sc
  };
  return me.token = s, me;
}
const cc = {
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
function fc(s, e, r) {
  const { type: i, value: a } = s;
  if (i === "literal") {
    const y = /^\s+$/.test(a);
    return {
      literal: !y,
      val: y ? " " : a
    };
  }
  const c = e[i];
  let h = i;
  i === "hour" && (e.hour12 != null ? h = e.hour12 ? "hour12" : "hour24" : e.hourCycle != null ? e.hourCycle === "h11" || e.hourCycle === "h12" ? h = "hour12" : h = "hour24" : h = r.hour12 ? "hour12" : "hour24");
  let m = cc[h];
  if (typeof m == "object" && (m = m[c]), m)
    return {
      literal: !1,
      val: m
    };
}
function hc(s) {
  return [`^${s.map((r) => r.regex).reduce((r, i) => `${r}(${i.source})`, "")}$`, s];
}
function dc(s, e, r) {
  const i = s.match(e);
  if (i) {
    const a = {};
    let c = 1;
    for (const h in r)
      if (Jt(r, h)) {
        const m = r[h], y = m.groups ? m.groups + 1 : 1;
        !m.literal && m.token && (a[m.token.val[0]] = m.deser(i.slice(c, c + y))), c += y;
      }
    return [i, a];
  } else
    return [i, {}];
}
function mc(s) {
  const e = (c) => {
    switch (c) {
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
  let r = null, i;
  return Z(s.z) || (r = Le.create(s.z)), Z(s.Z) || (r || (r = new _e(s.Z)), i = s.Z), Z(s.q) || (s.M = (s.q - 1) * 3 + 1), Z(s.h) || (s.h < 12 && s.a === 1 ? s.h += 12 : s.h === 12 && s.a === 0 && (s.h = 0)), s.G === 0 && s.y && (s.y = -s.y), Z(s.u) || (s.S = Gi(s.u)), [Object.keys(s).reduce((c, h) => {
    const m = e(h);
    return m && (c[m] = s[h]), c;
  }, {}), r, i];
}
let Ei = null;
function pc() {
  return Ei || (Ei = B.fromMillis(1555555555555)), Ei;
}
function yc(s, e) {
  if (s.literal)
    return s;
  const r = ke.macroTokenToFormatOpts(s.val), i = Ca(r, e);
  return i == null || i.includes(void 0) ? s : i;
}
function Ia(s, e) {
  return Array.prototype.concat(...s.map((r) => yc(r, e)));
}
class Aa {
  constructor(e, r) {
    if (this.locale = e, this.format = r, this.tokens = Ia(ke.parseFormat(r), e), this.units = this.tokens.map((i) => lc(i, e)), this.disqualifyingUnit = this.units.find((i) => i.invalidReason), !this.disqualifyingUnit) {
      const [i, a] = hc(this.units);
      this.regex = RegExp(i, "i"), this.handlers = a;
    }
  }
  explainFromTokens(e) {
    if (this.isValid) {
      const [r, i] = dc(e, this.regex, this.handlers), [a, c, h] = i ? mc(i) : [null, null, void 0];
      if (Jt(i, "a") && Jt(i, "H"))
        throw new Bt(
          "Can't include meridiem when specifying 24-hour format"
        );
      return {
        input: e,
        tokens: this.tokens,
        regex: this.regex,
        rawMatches: r,
        matches: i,
        result: a,
        zone: c,
        specificOffset: h
      };
    } else
      return { input: e, tokens: this.tokens, invalidReason: this.invalidReason };
  }
  get isValid() {
    return !this.disqualifyingUnit;
  }
  get invalidReason() {
    return this.disqualifyingUnit ? this.disqualifyingUnit.invalidReason : null;
  }
}
function $a(s, e, r) {
  return new Aa(s, r).explainFromTokens(e);
}
function gc(s, e, r) {
  const { result: i, zone: a, specificOffset: c, invalidReason: h } = $a(s, e, r);
  return [i, a, c, h];
}
function Ca(s, e) {
  if (!s)
    return null;
  const i = ke.create(e, s).dtFormatter(pc()), a = i.formatToParts(), c = i.resolvedOptions();
  return a.map((h) => fc(h, s, c));
}
const Ii = "Invalid DateTime", ho = 864e13;
function En(s) {
  return new Pe("unsupported zone", `the zone "${s.name}" is not supported`);
}
function Ai(s) {
  return s.weekData === null && (s.weekData = Or(s.c)), s.weekData;
}
function $i(s) {
  return s.localWeekData === null && (s.localWeekData = Or(
    s.c,
    s.loc.getMinDaysInFirstWeek(),
    s.loc.getStartOfWeek()
  )), s.localWeekData;
}
function St(s, e) {
  const r = {
    ts: s.ts,
    zone: s.zone,
    c: s.c,
    o: s.o,
    loc: s.loc,
    invalid: s.invalid
  };
  return new B({ ...r, ...e, old: r });
}
function Da(s, e, r) {
  let i = s - e * 60 * 1e3;
  const a = r.offset(i);
  if (e === a)
    return [i, e];
  i -= (a - e) * 60 * 1e3;
  const c = r.offset(i);
  return a === c ? [i, a] : [s - Math.min(a, c) * 60 * 1e3, Math.max(a, c)];
}
function gr(s, e) {
  s += e * 60 * 1e3;
  const r = new Date(s);
  return {
    year: r.getUTCFullYear(),
    month: r.getUTCMonth() + 1,
    day: r.getUTCDate(),
    hour: r.getUTCHours(),
    minute: r.getUTCMinutes(),
    second: r.getUTCSeconds(),
    millisecond: r.getUTCMilliseconds()
  };
}
function wr(s, e, r) {
  return Da(Mr(s), e, r);
}
function mo(s, e) {
  const r = s.o, i = s.c.year + Math.trunc(e.years), a = s.c.month + Math.trunc(e.months) + Math.trunc(e.quarters) * 3, c = {
    ...s.c,
    year: i,
    month: a,
    day: Math.min(s.c.day, Er(i, a)) + Math.trunc(e.days) + Math.trunc(e.weeks) * 7
  }, h = ee.fromObject({
    years: e.years - Math.trunc(e.years),
    quarters: e.quarters - Math.trunc(e.quarters),
    months: e.months - Math.trunc(e.months),
    weeks: e.weeks - Math.trunc(e.weeks),
    days: e.days - Math.trunc(e.days),
    hours: e.hours,
    minutes: e.minutes,
    seconds: e.seconds,
    milliseconds: e.milliseconds
  }).as("milliseconds"), m = Mr(c);
  let [y, E] = Da(m, r, s.zone);
  return h !== 0 && (y += h, E = s.zone.offset(y)), { ts: y, o: E };
}
function Wt(s, e, r, i, a, c) {
  const { setZone: h, zone: m } = r;
  if (s && Object.keys(s).length !== 0 || e) {
    const y = e || m, E = B.fromObject(s, {
      ...r,
      zone: y,
      specificOffset: c
    });
    return h ? E : E.setZone(m);
  } else
    return B.invalid(
      new Pe("unparsable", `the input "${a}" can't be parsed as ${i}`)
    );
}
function vr(s, e, r = !0) {
  return s.isValid ? ke.create(re.create("en-US"), {
    allowZ: r,
    forceSimple: !0
  }).formatDateTimeFromString(s, e) : null;
}
function Ci(s, e, r) {
  const i = s.c.year > 9999 || s.c.year < 0;
  let a = "";
  if (i && s.c.year >= 0 && (a += "+"), a += de(s.c.year, i ? 6 : 4), r === "year") return a;
  if (e) {
    if (a += "-", a += de(s.c.month), r === "month") return a;
    a += "-";
  } else if (a += de(s.c.month), r === "month") return a;
  return a += de(s.c.day), a;
}
function po(s, e, r, i, a, c, h) {
  let m = !r || s.c.millisecond !== 0 || s.c.second !== 0, y = "";
  switch (h) {
    case "day":
    case "month":
    case "year":
      break;
    default:
      if (y += de(s.c.hour), h === "hour") break;
      if (e) {
        if (y += ":", y += de(s.c.minute), h === "minute") break;
        m && (y += ":", y += de(s.c.second));
      } else {
        if (y += de(s.c.minute), h === "minute") break;
        m && (y += de(s.c.second));
      }
      if (h === "second") break;
      m && (!i || s.c.millisecond !== 0) && (y += ".", y += de(s.c.millisecond, 3));
  }
  return a && (s.isOffsetFixed && s.offset === 0 && !c ? y += "Z" : s.o < 0 ? (y += "-", y += de(Math.trunc(-s.o / 60)), y += ":", y += de(Math.trunc(-s.o % 60))) : (y += "+", y += de(Math.trunc(s.o / 60)), y += ":", y += de(Math.trunc(s.o % 60)))), c && (y += "[" + s.zone.ianaName + "]"), y;
}
const Ma = {
  month: 1,
  day: 1,
  hour: 0,
  minute: 0,
  second: 0,
  millisecond: 0
}, vc = {
  weekNumber: 1,
  weekday: 1,
  hour: 0,
  minute: 0,
  second: 0,
  millisecond: 0
}, wc = {
  ordinal: 1,
  hour: 0,
  minute: 0,
  second: 0,
  millisecond: 0
}, br = ["year", "month", "day", "hour", "minute", "second", "millisecond"], bc = [
  "weekYear",
  "weekNumber",
  "weekday",
  "hour",
  "minute",
  "second",
  "millisecond"
], kc = ["year", "ordinal", "hour", "minute", "second", "millisecond"];
function kr(s) {
  const e = {
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
  }[s.toLowerCase()];
  if (!e) throw new Do(s);
  return e;
}
function yo(s) {
  switch (s.toLowerCase()) {
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
      return kr(s);
  }
}
function _c(s) {
  if (In === void 0 && (In = ue.now()), s.type !== "iana")
    return s.offset(In);
  const e = s.name;
  let r = Ki.get(e);
  return r === void 0 && (r = s.offset(In), Ki.set(e, r)), r;
}
function go(s, e) {
  const r = rt(e.zone, ue.defaultZone);
  if (!r.isValid)
    return B.invalid(En(r));
  const i = re.fromObject(e);
  let a, c;
  if (Z(s.year))
    a = ue.now();
  else {
    for (const y of br)
      Z(s[y]) && (s[y] = Ma[y]);
    const h = sa(s) || oa(s);
    if (h)
      return B.invalid(h);
    const m = _c(r);
    [a, c] = wr(s, m, r);
  }
  return new B({ ts: a, zone: r, loc: i, o: c });
}
function vo(s, e, r) {
  const i = Z(r.round) ? !0 : r.round, a = Z(r.rounding) ? "trunc" : r.rounding, c = (m, y) => (m = Ji(m, i || r.calendary ? 0 : 2, r.calendary ? "round" : a), e.loc.clone(r).relFormatter(r).format(m, y)), h = (m) => r.calendary ? e.hasSame(s, m) ? 0 : e.startOf(m).diff(s.startOf(m), m).get(m) : e.diff(s, m).get(m);
  if (r.unit)
    return c(h(r.unit), r.unit);
  for (const m of r.units) {
    const y = h(m);
    if (Math.abs(y) >= 1)
      return c(y, m);
  }
  return c(s > e ? -0 : 0, r.units[r.units.length - 1]);
}
function wo(s) {
  let e = {}, r;
  return s.length > 0 && typeof s[s.length - 1] == "object" ? (e = s[s.length - 1], r = Array.from(s).slice(0, s.length - 1)) : r = Array.from(s), [e, r];
}
let In;
const Ki = /* @__PURE__ */ new Map();
class B {
  /**
   * @access private
   */
  constructor(e) {
    const r = e.zone || ue.defaultZone;
    let i = e.invalid || (Number.isNaN(e.ts) ? new Pe("invalid input") : null) || (r.isValid ? null : En(r));
    this.ts = Z(e.ts) ? ue.now() : e.ts;
    let a = null, c = null;
    if (!i)
      if (e.old && e.old.ts === this.ts && e.old.zone.equals(r))
        [a, c] = [e.old.c, e.old.o];
      else {
        const m = ot(e.o) && !e.old ? e.o : r.offset(this.ts);
        a = gr(this.ts, m), i = Number.isNaN(a.year) ? new Pe("invalid input") : null, a = i ? null : a, c = i ? null : m;
      }
    this._zone = r, this.loc = e.loc || re.create(), this.invalid = i, this.weekData = null, this.localWeekData = null, this.c = a, this.o = c, this.isLuxonDateTime = !0;
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
    return new B({});
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
    const [e, r] = wo(arguments), [i, a, c, h, m, y, E] = r;
    return go({ year: i, month: a, day: c, hour: h, minute: m, second: y, millisecond: E }, e);
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
    const [e, r] = wo(arguments), [i, a, c, h, m, y, E] = r;
    return e.zone = _e.utcInstance, go({ year: i, month: a, day: c, hour: h, minute: m, second: y, millisecond: E }, e);
  }
  /**
   * Create a DateTime from a JavaScript Date object. Uses the default zone.
   * @param {Date} date - a JavaScript Date object
   * @param {Object} options - configuration options for the DateTime
   * @param {string|Zone} [options.zone='local'] - the zone to place the DateTime into
   * @return {DateTime}
   */
  static fromJSDate(e, r = {}) {
    const i = el(e) ? e.valueOf() : NaN;
    if (Number.isNaN(i))
      return B.invalid("invalid input");
    const a = rt(r.zone, ue.defaultZone);
    return a.isValid ? new B({
      ts: i,
      zone: a,
      loc: re.fromObject(r)
    }) : B.invalid(En(a));
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
  static fromMillis(e, r = {}) {
    if (ot(e))
      return e < -ho || e > ho ? B.invalid("Timestamp out of range") : new B({
        ts: e,
        zone: rt(r.zone, ue.defaultZone),
        loc: re.fromObject(r)
      });
    throw new be(
      `fromMillis requires a numerical input, but received a ${typeof e} with value ${e}`
    );
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
  static fromSeconds(e, r = {}) {
    if (ot(e))
      return new B({
        ts: e * 1e3,
        zone: rt(r.zone, ue.defaultZone),
        loc: re.fromObject(r)
      });
    throw new be("fromSeconds requires a numerical input");
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
  static fromObject(e, r = {}) {
    e = e || {};
    const i = rt(r.zone, ue.defaultZone);
    if (!i.isValid)
      return B.invalid(En(i));
    const a = re.fromObject(r), c = Ir(e, yo), { minDaysInFirstWeek: h, startOfWeek: m } = to(c, a), y = ue.now(), E = Z(r.specificOffset) ? i.offset(y) : r.specificOffset, N = !Z(c.ordinal), C = !Z(c.year), W = !Z(c.month) || !Z(c.day), j = C || W, X = c.weekYear || c.weekNumber;
    if ((j || N) && X)
      throw new Bt(
        "Can't mix weekYear/weekNumber units with year/month/day or ordinals"
      );
    if (W && N)
      throw new Bt("Can't mix ordinal dates with month/day");
    const me = X || c.weekday && !j;
    let Ee, Be, Re = gr(y, E);
    me ? (Ee = bc, Be = vc, Re = Or(Re, h, m)) : N ? (Ee = kc, Be = wc, Re = Oi(Re)) : (Ee = br, Be = Ma);
    let on = !1;
    for (const Ze of Ee) {
      const qn = c[Ze];
      Z(qn) ? on ? c[Ze] = Be[Ze] : c[Ze] = Re[Ze] : on = !0;
    }
    const at = me ? Ju(c, h, m) : N ? Xu(c) : sa(c), an = at || oa(c);
    if (an)
      return B.invalid(an);
    const De = me ? Qs(c, h, m) : N ? eo(c) : c, [Se, Un] = wr(De, E, i), ut = new B({
      ts: Se,
      zone: i,
      o: Un,
      loc: a
    });
    return c.weekday && j && e.weekday !== ut.weekday ? B.invalid(
      "mismatched weekday",
      `you can't specify both a weekday of ${c.weekday} and a date of ${ut.toISO()}`
    ) : ut.isValid ? ut : B.invalid(ut.invalid);
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
  static fromISO(e, r = {}) {
    const [i, a] = Wl(e);
    return Wt(i, a, r, "ISO 8601", e);
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
  static fromRFC2822(e, r = {}) {
    const [i, a] = Kl(e);
    return Wt(i, a, r, "RFC 2822", e);
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
  static fromHTTP(e, r = {}) {
    const [i, a] = zl(e);
    return Wt(i, a, r, "HTTP", r);
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
  static fromFormat(e, r, i = {}) {
    if (Z(e) || Z(r))
      throw new be("fromFormat requires an input string and a format");
    const { locale: a = null, numberingSystem: c = null } = i, h = re.fromOpts({
      locale: a,
      numberingSystem: c,
      defaultToEN: !0
    }), [m, y, E, N] = gc(h, e, r);
    return N ? B.invalid(N) : Wt(m, y, i, `format ${r}`, e, E);
  }
  /**
   * @deprecated use fromFormat instead
   */
  static fromString(e, r, i = {}) {
    return B.fromFormat(e, r, i);
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
  static fromSQL(e, r = {}) {
    const [i, a] = Xl(e);
    return Wt(i, a, r, "SQL", e);
  }
  /**
   * Create an invalid DateTime.
   * @param {string} reason - simple string of why this DateTime is invalid. Should not contain parameters or anything else data-dependent.
   * @param {string} [explanation=null] - longer explanation, may include parameters and other useful debugging information
   * @return {DateTime}
   */
  static invalid(e, r = null) {
    if (!e)
      throw new be("need to specify a reason the DateTime is invalid");
    const i = e instanceof Pe ? e : new Pe(e, r);
    if (ue.throwOnInvalid)
      throw new Ou(i);
    return new B({ invalid: i });
  }
  /**
   * Check if an object is an instance of DateTime. Works across context boundaries
   * @param {object} o
   * @return {boolean}
   */
  static isDateTime(e) {
    return e && e.isLuxonDateTime || !1;
  }
  /**
   * Produce the format string for a set of options
   * @param formatOpts
   * @param localeOpts
   * @returns {string}
   */
  static parseFormatForOpts(e, r = {}) {
    const i = Ca(e, re.fromObject(r));
    return i ? i.map((a) => a ? a.val : null).join("") : null;
  }
  /**
   * Produce the the fully expanded format token for the locale
   * Does NOT quote characters, so quoted tokens will not round trip correctly
   * @param fmt
   * @param localeOpts
   * @returns {string}
   */
  static expandFormat(e, r = {}) {
    return Ia(ke.parseFormat(e), re.fromObject(r)).map((a) => a.val).join("");
  }
  static resetCache() {
    In = void 0, Ki.clear();
  }
  // INFO
  /**
   * Get the value of unit.
   * @param {string} unit - a unit such as 'minute' or 'day'
   * @example DateTime.local(2017, 7, 4).get('month'); //=> 7
   * @example DateTime.local(2017, 7, 4).get('day'); //=> 4
   * @return {number}
   */
  get(e) {
    return this[e];
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
    return this.isValid ? Ai(this).weekYear : NaN;
  }
  /**
   * Get the week number of the week year (1-52ish).
   * @see https://en.wikipedia.org/wiki/ISO_week_date
   * @example DateTime.local(2017, 5, 25).weekNumber //=> 21
   * @type {number}
   */
  get weekNumber() {
    return this.isValid ? Ai(this).weekNumber : NaN;
  }
  /**
   * Get the day of the week.
   * 1 is Monday and 7 is Sunday
   * @see https://en.wikipedia.org/wiki/ISO_week_date
   * @example DateTime.local(2014, 11, 31).weekday //=> 4
   * @type {number}
   */
  get weekday() {
    return this.isValid ? Ai(this).weekday : NaN;
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
    return this.isValid ? $i(this).weekday : NaN;
  }
  /**
   * Get the week number of the week year according to the locale. Different locales assign week numbers differently,
   * because the week can start on different days of the week (see localWeekday) and because a different number of days
   * is required for a week to count as the first week of a year.
   * @returns {number}
   */
  get localWeekNumber() {
    return this.isValid ? $i(this).weekNumber : NaN;
  }
  /**
   * Get the week year according to the locale. Different locales assign week numbers (and therefor week years)
   * differently, see localWeekNumber.
   * @returns {number}
   */
  get localWeekYear() {
    return this.isValid ? $i(this).weekYear : NaN;
  }
  /**
   * Get the ordinal (meaning the day of the year)
   * @example DateTime.local(2017, 5, 25).ordinal //=> 145
   * @type {number|DateTime}
   */
  get ordinal() {
    return this.isValid ? Oi(this.c).ordinal : NaN;
  }
  /**
   * Get the human readable short month name, such as 'Oct'.
   * Defaults to the system's locale if no locale has been specified
   * @example DateTime.local(2017, 10, 30).monthShort //=> Oct
   * @type {string}
   */
  get monthShort() {
    return this.isValid ? On.months("short", { locObj: this.loc })[this.month - 1] : null;
  }
  /**
   * Get the human readable long month name, such as 'October'.
   * Defaults to the system's locale if no locale has been specified
   * @example DateTime.local(2017, 10, 30).monthLong //=> October
   * @type {string}
   */
  get monthLong() {
    return this.isValid ? On.months("long", { locObj: this.loc })[this.month - 1] : null;
  }
  /**
   * Get the human readable short weekday, such as 'Mon'.
   * Defaults to the system's locale if no locale has been specified
   * @example DateTime.local(2017, 10, 30).weekdayShort //=> Mon
   * @type {string}
   */
  get weekdayShort() {
    return this.isValid ? On.weekdays("short", { locObj: this.loc })[this.weekday - 1] : null;
  }
  /**
   * Get the human readable long weekday, such as 'Monday'.
   * Defaults to the system's locale if no locale has been specified
   * @example DateTime.local(2017, 10, 30).weekdayLong //=> Monday
   * @type {string}
   */
  get weekdayLong() {
    return this.isValid ? On.weekdays("long", { locObj: this.loc })[this.weekday - 1] : null;
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
    return this.isValid ? this.zone.offsetName(this.ts, {
      format: "short",
      locale: this.locale
    }) : null;
  }
  /**
   * Get the long human name for the zone's current offset, for example "Eastern Standard Time" or "Eastern Daylight Time".
   * Defaults to the system's locale if no locale has been specified
   * @type {string}
   */
  get offsetNameLong() {
    return this.isValid ? this.zone.offsetName(this.ts, {
      format: "long",
      locale: this.locale
    }) : null;
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
    return this.isOffsetFixed ? !1 : this.offset > this.set({ month: 1, day: 1 }).offset || this.offset > this.set({ month: 5 }).offset;
  }
  /**
   * Get those DateTimes which have the same local time as this DateTime, but a different offset from UTC
   * in this DateTime's zone. During DST changes local time can be ambiguous, for example
   * `2023-10-29T02:30:00` in `Europe/Berlin` can have offset `+01:00` or `+02:00`.
   * This method will return both possible DateTimes if this DateTime's local time is ambiguous.
   * @returns {DateTime[]}
   */
  getPossibleOffsets() {
    if (!this.isValid || this.isOffsetFixed)
      return [this];
    const e = 864e5, r = 6e4, i = Mr(this.c), a = this.zone.offset(i - e), c = this.zone.offset(i + e), h = this.zone.offset(i - a * r), m = this.zone.offset(i - c * r);
    if (h === m)
      return [this];
    const y = i - h * r, E = i - m * r, N = gr(y, h), C = gr(E, m);
    return N.hour === C.hour && N.minute === C.minute && N.second === C.second && N.millisecond === C.millisecond ? [St(this, { ts: y }), St(this, { ts: E })] : [this];
  }
  /**
   * Returns true if this DateTime is in a leap year, false otherwise
   * @example DateTime.local(2016).isInLeapYear //=> true
   * @example DateTime.local(2013).isInLeapYear //=> false
   * @type {boolean}
   */
  get isInLeapYear() {
    return Fn(this.year);
  }
  /**
   * Returns the number of days in this DateTime's month
   * @example DateTime.local(2016, 2).daysInMonth //=> 29
   * @example DateTime.local(2016, 3).daysInMonth //=> 31
   * @type {number}
   */
  get daysInMonth() {
    return Er(this.year, this.month);
  }
  /**
   * Returns the number of days in this DateTime's year
   * @example DateTime.local(2016).daysInYear //=> 366
   * @example DateTime.local(2013).daysInYear //=> 365
   * @type {number}
   */
  get daysInYear() {
    return this.isValid ? Ht(this.year) : NaN;
  }
  /**
   * Returns the number of weeks in this DateTime's year
   * @see https://en.wikipedia.org/wiki/ISO_week_date
   * @example DateTime.local(2004).weeksInWeekYear //=> 53
   * @example DateTime.local(2013).weeksInWeekYear //=> 52
   * @type {number}
   */
  get weeksInWeekYear() {
    return this.isValid ? Cn(this.weekYear) : NaN;
  }
  /**
   * Returns the number of weeks in this DateTime's local week year
   * @example DateTime.local(2020, 6, {locale: 'en-US'}).weeksInLocalWeekYear //=> 52
   * @example DateTime.local(2020, 6, {locale: 'de-DE'}).weeksInLocalWeekYear //=> 53
   * @type {number}
   */
  get weeksInLocalWeekYear() {
    return this.isValid ? Cn(
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
  resolvedLocaleOptions(e = {}) {
    const { locale: r, numberingSystem: i, calendar: a } = ke.create(
      this.loc.clone(e),
      e
    ).resolvedOptions(this);
    return { locale: r, numberingSystem: i, outputCalendar: a };
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
  toUTC(e = 0, r = {}) {
    return this.setZone(_e.instance(e), r);
  }
  /**
   * "Set" the DateTime's zone to the host's local zone. Returns a newly-constructed DateTime.
   *
   * Equivalent to `setZone('local')`
   * @return {DateTime}
   */
  toLocal() {
    return this.setZone(ue.defaultZone);
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
  setZone(e, { keepLocalTime: r = !1, keepCalendarTime: i = !1 } = {}) {
    if (e = rt(e, ue.defaultZone), e.equals(this.zone))
      return this;
    if (e.isValid) {
      let a = this.ts;
      if (r || i) {
        const c = e.offset(this.ts), h = this.toObject();
        [a] = wr(h, c, e);
      }
      return St(this, { ts: a, zone: e });
    } else
      return B.invalid(En(e));
  }
  /**
   * "Set" the locale, numberingSystem, or outputCalendar. Returns a newly-constructed DateTime.
   * @param {Object} properties - the properties to set
   * @example DateTime.local(2017, 5, 25).reconfigure({ locale: 'en-GB' })
   * @return {DateTime}
   */
  reconfigure({ locale: e, numberingSystem: r, outputCalendar: i } = {}) {
    const a = this.loc.clone({ locale: e, numberingSystem: r, outputCalendar: i });
    return St(this, { loc: a });
  }
  /**
   * "Set" the locale. Returns a newly-constructed DateTime.
   * Just a convenient alias for reconfigure({ locale })
   * @example DateTime.local(2017, 5, 25).setLocale('en-GB')
   * @return {DateTime}
   */
  setLocale(e) {
    return this.reconfigure({ locale: e });
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
  set(e) {
    if (!this.isValid) return this;
    const r = Ir(e, yo), { minDaysInFirstWeek: i, startOfWeek: a } = to(r, this.loc), c = !Z(r.weekYear) || !Z(r.weekNumber) || !Z(r.weekday), h = !Z(r.ordinal), m = !Z(r.year), y = !Z(r.month) || !Z(r.day), E = m || y, N = r.weekYear || r.weekNumber;
    if ((E || h) && N)
      throw new Bt(
        "Can't mix weekYear/weekNumber units with year/month/day or ordinals"
      );
    if (y && h)
      throw new Bt("Can't mix ordinal dates with month/day");
    let C;
    c ? C = Qs(
      { ...Or(this.c, i, a), ...r },
      i,
      a
    ) : Z(r.ordinal) ? (C = { ...this.toObject(), ...r }, Z(r.day) && (C.day = Math.min(Er(C.year, C.month), C.day))) : C = eo({ ...Oi(this.c), ...r });
    const [W, j] = wr(C, this.o, this.zone);
    return St(this, { ts: W, o: j });
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
  plus(e) {
    if (!this.isValid) return this;
    const r = ee.fromDurationLike(e);
    return St(this, mo(this, r));
  }
  /**
   * Subtract a period of time to this DateTime and return the resulting DateTime
   * See {@link DateTime#plus}
   * @param {Duration|Object|number} duration - The amount to subtract. Either a Luxon Duration, a number of milliseconds, the object argument to Duration.fromObject()
   @return {DateTime}
   */
  minus(e) {
    if (!this.isValid) return this;
    const r = ee.fromDurationLike(e).negate();
    return St(this, mo(this, r));
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
  startOf(e, { useLocaleWeeks: r = !1 } = {}) {
    if (!this.isValid) return this;
    const i = {}, a = ee.normalizeUnit(e);
    switch (a) {
      case "years":
        i.month = 1;
      // falls through
      case "quarters":
      case "months":
        i.day = 1;
      // falls through
      case "weeks":
      case "days":
        i.hour = 0;
      // falls through
      case "hours":
        i.minute = 0;
      // falls through
      case "minutes":
        i.second = 0;
      // falls through
      case "seconds":
        i.millisecond = 0;
        break;
    }
    if (a === "weeks")
      if (r) {
        const c = this.loc.getStartOfWeek(), { weekday: h } = this;
        h < c && (i.weekNumber = this.weekNumber - 1), i.weekday = c;
      } else
        i.weekday = 1;
    if (a === "quarters") {
      const c = Math.ceil(this.month / 3);
      i.month = (c - 1) * 3 + 1;
    }
    return this.set(i);
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
  endOf(e, r) {
    return this.isValid ? this.plus({ [e]: 1 }).startOf(e, r).minus(1) : this;
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
  toFormat(e, r = {}) {
    return this.isValid ? ke.create(this.loc.redefaultToEN(r)).formatDateTimeFromString(this, e) : Ii;
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
  toLocaleString(e = xr, r = {}) {
    return this.isValid ? ke.create(this.loc.clone(r), e).formatDateTime(this) : Ii;
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
  toLocaleParts(e = {}) {
    return this.isValid ? ke.create(this.loc.clone(e), e).formatDateTimeParts(this) : [];
  }
  /**
   * Returns an ISO 8601-compliant string representation of this DateTime
   * @param {Object} opts - options
   * @param {boolean} [opts.suppressMilliseconds=false] - exclude milliseconds from the format if they're 0
   * @param {boolean} [opts.suppressSeconds=false] - exclude seconds from the format if they're 0
   * @param {boolean} [opts.includeOffset=true] - include the offset, such as 'Z' or '-04:00'
   * @param {boolean} [opts.extendedZone=false] - add the time zone format extension
   * @param {string} [opts.format='extended'] - choose between the basic and extended format
   * @param {string} [opts.precision='milliseconds'] - truncate output to desired presicion: 'years', 'months', 'days', 'hours', 'minutes', 'seconds' or 'milliseconds'. When precision and suppressSeconds or suppressMilliseconds are used together, precision sets the maximum unit shown in the output, however seconds or milliseconds will still be suppressed if they are 0.
   * @example DateTime.utc(1983, 5, 25).toISO() //=> '1982-05-25T00:00:00.000Z'
   * @example DateTime.now().toISO() //=> '2017-04-22T20:47:05.335-04:00'
   * @example DateTime.now().toISO({ includeOffset: false }) //=> '2017-04-22T20:47:05.335'
   * @example DateTime.now().toISO({ format: 'basic' }) //=> '20170422T204705.335-0400'
   * @example DateTime.now().toISO({ precision: 'day' }) //=> '2017-04-22Z'
   * @example DateTime.now().toISO({ precision: 'minute' }) //=> '2017-04-22T20:47Z'
   * @return {string|null}
   */
  toISO({
    format: e = "extended",
    suppressSeconds: r = !1,
    suppressMilliseconds: i = !1,
    includeOffset: a = !0,
    extendedZone: c = !1,
    precision: h = "milliseconds"
  } = {}) {
    if (!this.isValid)
      return null;
    h = kr(h);
    const m = e === "extended";
    let y = Ci(this, m, h);
    return br.indexOf(h) >= 3 && (y += "T"), y += po(
      this,
      m,
      r,
      i,
      a,
      c,
      h
    ), y;
  }
  /**
   * Returns an ISO 8601-compliant string representation of this DateTime's date component
   * @param {Object} opts - options
   * @param {string} [opts.format='extended'] - choose between the basic and extended format
   * @param {string} [opts.precision='day'] - truncate output to desired precision: 'years', 'months', or 'days'.
   * @example DateTime.utc(1982, 5, 25).toISODate() //=> '1982-05-25'
   * @example DateTime.utc(1982, 5, 25).toISODate({ format: 'basic' }) //=> '19820525'
   * @example DateTime.utc(1982, 5, 25).toISODate({ precision: 'month' }) //=> '1982-05'
   * @return {string|null}
   */
  toISODate({ format: e = "extended", precision: r = "day" } = {}) {
    return this.isValid ? Ci(this, e === "extended", kr(r)) : null;
  }
  /**
   * Returns an ISO 8601-compliant string representation of this DateTime's week date
   * @example DateTime.utc(1982, 5, 25).toISOWeekDate() //=> '1982-W21-2'
   * @return {string}
   */
  toISOWeekDate() {
    return vr(this, "kkkk-'W'WW-c");
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
   * @param {string} [opts.precision='milliseconds'] - truncate output to desired presicion: 'hours', 'minutes', 'seconds' or 'milliseconds'. When precision and suppressSeconds or suppressMilliseconds are used together, precision sets the maximum unit shown in the output, however seconds or milliseconds will still be suppressed if they are 0.
   * @example DateTime.utc().set({ hour: 7, minute: 34 }).toISOTime() //=> '07:34:19.361Z'
   * @example DateTime.utc().set({ hour: 7, minute: 34, seconds: 0, milliseconds: 0 }).toISOTime({ suppressSeconds: true }) //=> '07:34Z'
   * @example DateTime.utc().set({ hour: 7, minute: 34 }).toISOTime({ format: 'basic' }) //=> '073419.361Z'
   * @example DateTime.utc().set({ hour: 7, minute: 34 }).toISOTime({ includePrefix: true }) //=> 'T07:34:19.361Z'
   * @example DateTime.utc().set({ hour: 7, minute: 34, second: 56 }).toISOTime({ precision: 'minute' }) //=> '07:34Z'
   * @return {string}
   */
  toISOTime({
    suppressMilliseconds: e = !1,
    suppressSeconds: r = !1,
    includeOffset: i = !0,
    includePrefix: a = !1,
    extendedZone: c = !1,
    format: h = "extended",
    precision: m = "milliseconds"
  } = {}) {
    return this.isValid ? (m = kr(m), (a && br.indexOf(m) >= 3 ? "T" : "") + po(
      this,
      h === "extended",
      r,
      e,
      i,
      c,
      m
    )) : null;
  }
  /**
   * Returns an RFC 2822-compatible string representation of this DateTime
   * @example DateTime.utc(2014, 7, 13).toRFC2822() //=> 'Sun, 13 Jul 2014 00:00:00 +0000'
   * @example DateTime.local(2014, 7, 13).toRFC2822() //=> 'Sun, 13 Jul 2014 00:00:00 -0400'
   * @return {string}
   */
  toRFC2822() {
    return vr(this, "EEE, dd LLL yyyy HH:mm:ss ZZZ", !1);
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
    return vr(this.toUTC(), "EEE, dd LLL yyyy HH:mm:ss 'GMT'");
  }
  /**
   * Returns a string representation of this DateTime appropriate for use in SQL Date
   * @example DateTime.utc(2014, 7, 13).toSQLDate() //=> '2014-07-13'
   * @return {string|null}
   */
  toSQLDate() {
    return this.isValid ? Ci(this, !0) : null;
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
  toSQLTime({ includeOffset: e = !0, includeZone: r = !1, includeOffsetSpace: i = !0 } = {}) {
    let a = "HH:mm:ss.SSS";
    return (r || e) && (i && (a += " "), r ? a += "z" : e && (a += "ZZ")), vr(this, a, !0);
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
  toSQL(e = {}) {
    return this.isValid ? `${this.toSQLDate()} ${this.toSQLTime(e)}` : null;
  }
  /**
   * Returns a string representation of this DateTime appropriate for debugging
   * @return {string}
   */
  toString() {
    return this.isValid ? this.toISO() : Ii;
  }
  /**
   * Returns a string representation of this DateTime appropriate for the REPL.
   * @return {string}
   */
  [Symbol.for("nodejs.util.inspect.custom")]() {
    return this.isValid ? `DateTime { ts: ${this.toISO()}, zone: ${this.zone.name}, locale: ${this.locale} }` : `DateTime { Invalid, reason: ${this.invalidReason} }`;
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
   * Returns the epoch seconds (including milliseconds in the fractional part) of this DateTime.
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
  toObject(e = {}) {
    if (!this.isValid) return {};
    const r = { ...this.c };
    return e.includeConfig && (r.outputCalendar = this.outputCalendar, r.numberingSystem = this.loc.numberingSystem, r.locale = this.loc.locale), r;
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
  diff(e, r = "milliseconds", i = {}) {
    if (!this.isValid || !e.isValid)
      return ee.invalid("created by diffing an invalid DateTime");
    const a = { locale: this.locale, numberingSystem: this.numberingSystem, ...i }, c = tl(r).map(ee.normalizeUnit), h = e.valueOf() > this.valueOf(), m = h ? this : e, y = h ? e : this, E = ic(m, y, c, a);
    return h ? E.negate() : E;
  }
  /**
   * Return the difference between this DateTime and right now.
   * See {@link DateTime#diff}
   * @param {string|string[]} [unit=['milliseconds']] - the unit or units units (such as 'hours' or 'days') to include in the duration
   * @param {Object} opts - options that affect the creation of the Duration
   * @param {string} [opts.conversionAccuracy='casual'] - the conversion system to use
   * @return {Duration}
   */
  diffNow(e = "milliseconds", r = {}) {
    return this.diff(B.now(), e, r);
  }
  /**
   * Return an Interval spanning between this DateTime and another DateTime
   * @param {DateTime} otherDateTime - the other end point of the Interval
   * @return {Interval|DateTime}
   */
  until(e) {
    return this.isValid ? ae.fromDateTimes(this, e) : this;
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
  hasSame(e, r, i) {
    if (!this.isValid) return !1;
    const a = e.valueOf(), c = this.setZone(e.zone, { keepLocalTime: !0 });
    return c.startOf(r, i) <= a && a <= c.endOf(r, i);
  }
  /**
   * Equality check
   * Two DateTimes are equal if and only if they represent the same millisecond, have the same zone and location, and are both valid.
   * To compare just the millisecond values, use `+dt1 === +dt2`.
   * @param {DateTime} other - the other DateTime
   * @return {boolean}
   */
  equals(e) {
    return this.isValid && e.isValid && this.valueOf() === e.valueOf() && this.zone.equals(e.zone) && this.loc.equals(e.loc);
  }
  /**
   * Returns a string representation of a this time relative to now, such as "in two days". Can only internationalize if your
   * platform supports Intl.RelativeTimeFormat. Rounds towards zero by default.
   * @param {Object} options - options that affect the output
   * @param {DateTime} [options.base=DateTime.now()] - the DateTime to use as the basis to which this time is compared. Defaults to now.
   * @param {string} [options.style="long"] - the style of units, must be "long", "short", or "narrow"
   * @param {string|string[]} options.unit - use a specific unit or array of units; if omitted, or an array, the method will pick the best unit. Use an array or one of "years", "quarters", "months", "weeks", "days", "hours", "minutes", or "seconds"
   * @param {boolean} [options.round=true] - whether to round the numbers in the output.
   * @param {string} [options.rounding="trunc"] - rounding method to use when rounding the numbers in the output. Can be "trunc" (toward zero), "expand" (away from zero), "round", "floor", or "ceil".
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
  toRelative(e = {}) {
    if (!this.isValid) return null;
    const r = e.base || B.fromObject({}, { zone: this.zone }), i = e.padding ? this < r ? -e.padding : e.padding : 0;
    let a = ["years", "months", "days", "hours", "minutes", "seconds"], c = e.unit;
    return Array.isArray(e.unit) && (a = e.unit, c = void 0), vo(r, this.plus(i), {
      ...e,
      numeric: "always",
      units: a,
      unit: c
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
  toRelativeCalendar(e = {}) {
    return this.isValid ? vo(e.base || B.fromObject({}, { zone: this.zone }), this, {
      ...e,
      numeric: "auto",
      units: ["years", "months", "days"],
      calendary: !0
    }) : null;
  }
  /**
   * Return the min of several date times
   * @param {...DateTime} dateTimes - the DateTimes from which to choose the minimum
   * @return {DateTime} the min DateTime, or undefined if called with no argument
   */
  static min(...e) {
    if (!e.every(B.isDateTime))
      throw new be("min requires all arguments be DateTimes");
    return no(e, (r) => r.valueOf(), Math.min);
  }
  /**
   * Return the max of several date times
   * @param {...DateTime} dateTimes - the DateTimes from which to choose the maximum
   * @return {DateTime} the max DateTime, or undefined if called with no argument
   */
  static max(...e) {
    if (!e.every(B.isDateTime))
      throw new be("max requires all arguments be DateTimes");
    return no(e, (r) => r.valueOf(), Math.max);
  }
  // MISC
  /**
   * Explain how a string would be parsed by fromFormat()
   * @param {string} text - the string to parse
   * @param {string} fmt - the format the string is expected to be in (see description)
   * @param {Object} options - options taken by fromFormat()
   * @return {Object}
   */
  static fromFormatExplain(e, r, i = {}) {
    const { locale: a = null, numberingSystem: c = null } = i, h = re.fromOpts({
      locale: a,
      numberingSystem: c,
      defaultToEN: !0
    });
    return $a(h, e, r);
  }
  /**
   * @deprecated use fromFormatExplain instead
   */
  static fromStringExplain(e, r, i = {}) {
    return B.fromFormatExplain(e, r, i);
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
  static buildFormatParser(e, r = {}) {
    const { locale: i = null, numberingSystem: a = null } = r, c = re.fromOpts({
      locale: i,
      numberingSystem: a,
      defaultToEN: !0
    });
    return new Aa(c, e);
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
  static fromFormatParser(e, r, i = {}) {
    if (Z(e) || Z(r))
      throw new be(
        "fromFormatParser requires an input string and a format parser"
      );
    const { locale: a = null, numberingSystem: c = null } = i, h = re.fromOpts({
      locale: a,
      numberingSystem: c,
      defaultToEN: !0
    });
    if (!h.equals(r.locale))
      throw new be(
        `fromFormatParser called with a locale of ${h}, but the format parser was created for ${r.locale}`
      );
    const { result: m, zone: y, specificOffset: E, invalidReason: N } = r.explainFromTokens(e);
    return N ? B.invalid(N) : Wt(
      m,
      y,
      i,
      `format ${r.format}`,
      e,
      E
    );
  }
  // FORMAT PRESETS
  /**
   * {@link DateTime#toLocaleString} format like 10/14/1983
   * @type {Object}
   */
  static get DATE_SHORT() {
    return xr;
  }
  /**
   * {@link DateTime#toLocaleString} format like 'Oct 14, 1983'
   * @type {Object}
   */
  static get DATE_MED() {
    return Mo;
  }
  /**
   * {@link DateTime#toLocaleString} format like 'Fri, Oct 14, 1983'
   * @type {Object}
   */
  static get DATE_MED_WITH_WEEKDAY() {
    return Au;
  }
  /**
   * {@link DateTime#toLocaleString} format like 'October 14, 1983'
   * @type {Object}
   */
  static get DATE_FULL() {
    return No;
  }
  /**
   * {@link DateTime#toLocaleString} format like 'Tuesday, October 14, 1983'
   * @type {Object}
   */
  static get DATE_HUGE() {
    return Po;
  }
  /**
   * {@link DateTime#toLocaleString} format like '09:30 AM'. Only 12-hour if the locale is.
   * @type {Object}
   */
  static get TIME_SIMPLE() {
    return Fo;
  }
  /**
   * {@link DateTime#toLocaleString} format like '09:30:23 AM'. Only 12-hour if the locale is.
   * @type {Object}
   */
  static get TIME_WITH_SECONDS() {
    return Ro;
  }
  /**
   * {@link DateTime#toLocaleString} format like '09:30:23 AM EDT'. Only 12-hour if the locale is.
   * @type {Object}
   */
  static get TIME_WITH_SHORT_OFFSET() {
    return Vo;
  }
  /**
   * {@link DateTime#toLocaleString} format like '09:30:23 AM Eastern Daylight Time'. Only 12-hour if the locale is.
   * @type {Object}
   */
  static get TIME_WITH_LONG_OFFSET() {
    return Uo;
  }
  /**
   * {@link DateTime#toLocaleString} format like '09:30', always 24-hour.
   * @type {Object}
   */
  static get TIME_24_SIMPLE() {
    return qo;
  }
  /**
   * {@link DateTime#toLocaleString} format like '09:30:23', always 24-hour.
   * @type {Object}
   */
  static get TIME_24_WITH_SECONDS() {
    return Lo;
  }
  /**
   * {@link DateTime#toLocaleString} format like '09:30:23 EDT', always 24-hour.
   * @type {Object}
   */
  static get TIME_24_WITH_SHORT_OFFSET() {
    return jo;
  }
  /**
   * {@link DateTime#toLocaleString} format like '09:30:23 Eastern Daylight Time', always 24-hour.
   * @type {Object}
   */
  static get TIME_24_WITH_LONG_OFFSET() {
    return Wo;
  }
  /**
   * {@link DateTime#toLocaleString} format like '10/14/1983, 9:30 AM'. Only 12-hour if the locale is.
   * @type {Object}
   */
  static get DATETIME_SHORT() {
    return Ko;
  }
  /**
   * {@link DateTime#toLocaleString} format like '10/14/1983, 9:30:33 AM'. Only 12-hour if the locale is.
   * @type {Object}
   */
  static get DATETIME_SHORT_WITH_SECONDS() {
    return zo;
  }
  /**
   * {@link DateTime#toLocaleString} format like 'Oct 14, 1983, 9:30 AM'. Only 12-hour if the locale is.
   * @type {Object}
   */
  static get DATETIME_MED() {
    return Bo;
  }
  /**
   * {@link DateTime#toLocaleString} format like 'Oct 14, 1983, 9:30:33 AM'. Only 12-hour if the locale is.
   * @type {Object}
   */
  static get DATETIME_MED_WITH_SECONDS() {
    return Zo;
  }
  /**
   * {@link DateTime#toLocaleString} format like 'Fri, 14 Oct 1983, 9:30 AM'. Only 12-hour if the locale is.
   * @type {Object}
   */
  static get DATETIME_MED_WITH_WEEKDAY() {
    return $u;
  }
  /**
   * {@link DateTime#toLocaleString} format like 'October 14, 1983, 9:30 AM EDT'. Only 12-hour if the locale is.
   * @type {Object}
   */
  static get DATETIME_FULL() {
    return Ho;
  }
  /**
   * {@link DateTime#toLocaleString} format like 'October 14, 1983, 9:30:33 AM EDT'. Only 12-hour if the locale is.
   * @type {Object}
   */
  static get DATETIME_FULL_WITH_SECONDS() {
    return Yo;
  }
  /**
   * {@link DateTime#toLocaleString} format like 'Friday, October 14, 1983, 9:30 AM Eastern Daylight Time'. Only 12-hour if the locale is.
   * @type {Object}
   */
  static get DATETIME_HUGE() {
    return Go;
  }
  /**
   * {@link DateTime#toLocaleString} format like 'Friday, October 14, 1983, 9:30:33 AM Eastern Daylight Time'. Only 12-hour if the locale is.
   * @type {Object}
   */
  static get DATETIME_HUGE_WITH_SECONDS() {
    return Jo;
  }
}
function Sn(s) {
  if (B.isDateTime(s))
    return s;
  if (s && s.valueOf && ot(s.valueOf()))
    return B.fromJSDate(s);
  if (s && typeof s == "object")
    return B.fromObject(s);
  throw new be(
    `Unknown datetime argument: ${s}, of type ${typeof s}`
  );
}
const Sc = "3.7.1", of = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  DateTime: B,
  Duration: ee,
  FixedOffsetZone: _e,
  IANAZone: Le,
  Info: On,
  Interval: ae,
  InvalidZone: ea,
  Settings: ue,
  SystemZone: Pn,
  VERSION: Sc,
  Zone: en
}, Symbol.toStringTag, { value: "Module" }));
class _r extends Error {
  constructor(e) {
    super(e), this.name = "KioskDateTimeError";
  }
}
class Zt {
  constructor(e) {
    this.latinMonths = {
      I: "01",
      II: "02",
      III: "03",
      IV: "04",
      V: "05",
      VI: "06",
      VII: "07",
      VIII: "08",
      IX: "09",
      X: "10",
      XI: "11",
      XII: "12"
    }, this.arabicMonthToLatin = ["I", "II", "III", "IV", "V", "VI", "VII", "VIII", "IX", "X", "XI", "XII"], this.timeZones = void 0, this.timeZones = e;
  }
  /**
   * Returns a formatted Latin date string based on the provided Luxon DateTime object.
   *
   * @param dt a Luxon DateTime object to extract the date from
   * @param withTime Optional. A boolean flag to include time in the output. Default is true.
   * @returns The formatted Latin date string, with or without time based on the 'withTime' flag
   */
  getLatinDate(e, r = !0) {
    const i = ["I", "II", "III", "IV", "V", "VI", "VII", "VIII", "IX", "X", "XI", "XII"], a = `${e.day} ${i[e.month - 1]} ${e.year}`;
    return r ? a + " " + e.toLocaleString(B.TIME_WITH_SECONDS) : a;
  }
  /**
   * returns a TimeZoneInfo object with id, ianaName and fullName of the
   * active user time zone (derived from the cookies kiosk_tz...)
   */
  static getActiveUserTimeZone() {
    return {
      id: parseInt(xt("kiosk_tz_index")),
      ianaName: xt("kiosk_iana_time_zone"),
      fullName: xt("kiosk_tz_name")
    };
  }
  /**
   * returns a TimeZoneInfo object with id, ianaName and fullName of the
   * active recording time zone.
   * The active recording time zone is derived from the kiosk_recording_tz_... cookies.
   */
  static getActiveRecordingTimeZone() {
    return {
      id: parseInt(xt("kiosk_recording_tz_index")),
      ianaName: xt("kiosk_recording_iana_time_zone"),
      fullName: xt("kiosk_recording_tz_name")
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
  initKioskDateTimeTzField(e, r = !0) {
    let i = document.getElementById(e);
    if (i) {
      let a = i.dataset.utcDate;
      if (a) {
        let c = B.fromISO(a, { zone: "UTC" }), h = document.getElementById(e + "-tz").value, m = "-";
        r ? m = h : h != "-" && (m = Zt.getActiveUserTimeZone().ianaName), m !== "-" && m !== "UTC" && (c = c.setZone(m)), i.value = this.getLatinDate(c);
      }
    }
  }
  /**
   * Initializes a single <span class="kiosk-tz-span"> element.
   * @param span a HTMLSpanElement
   * @param displayTimeZone set to false if you don't want the time zone name added
   * @param latinFormat set to False if you want the timestamp in local date and time format instead of latin
   */
  async initKioskDateTimeSpan(e, r = !0, i = !0) {
    let a = e.textContent?.trim();
    if (a) {
      let c = B.fromISO(a, { zone: "UTC" }), h, m;
      if (e.dataset.tzIndex != null && this.timeZones) {
        let C = await this.timeZones.getTimeZoneByIndex(Number(e.dataset.tzIndex));
        C && C.tz_IANA && (h = C.tz_IANA), m = C && C.tz_long ? C.tz_long : h;
      }
      h || (h = e.dataset.recordingIanaTz), h && h !== "UTC" && h !== "-" && (c = c.setZone(h));
      const y = i ? this.getLatinDate(c) : c.toLocaleString(), E = m ? ` (${m})` : " (legacy)", N = r ? E : "";
      e.innerText = y + N;
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
  async initKioskDateTimeSpans(e, r = !0, i = !0) {
    const a = e.querySelectorAll("span.kiosk-tz-span");
    for (const c of a)
      await this.initKioskDateTimeSpan(c, r, i);
  }
  /**
   * validates a HTMLInputField that is supposed to contain a date time in its value
   * @param elementId The id of the element
   * @param errorClass default is "kiosk-error-border". class name that signals an error for the field
   * @param focusOnError default is true: in case of an error the element gets the focus
   * @param useRecordingTz default is true: uses the active recording time zone. False uses the active user time zone.
   * @returns the result of guessDateTime: A ISO8601 string of the date/time in UTC time zone
   */
  validateDateTimeField(e, r = "kiosk-error-border", i = !0, a = !0) {
    const c = document.getElementById(e);
    let h = "";
    if (c) {
      r && c.classList.contains(r) && c.classList.remove(r);
      let m = c.value;
      if (m && m.trim()) {
        const y = a ? Zt.getActiveRecordingTimeZone().ianaName : Zt.getActiveUserTimeZone().ianaName, E = new Zt();
        try {
          if (h = E.guessDateTime(m, !1, y)?.toISO({
            includeOffset: !1,
            suppressMilliseconds: !0
          }), !h)
            throw Error("date/time value not understood.");
        } catch (N) {
          throw r && c.classList.add(r), N instanceof _r && i && c.focus(), N;
        }
      } else
        h = "";
    } else
      throw Error(`ui element ${e} does not exist.`);
    return h;
  }
  /**
   * Splits a given string containing date and time (optional) into separate date and time parts.
   *
   * @param dateTimeInput The string containing both date and time to be split.
   * @returns An array with the date part as the first element and the time part as the second element.
   *          If the input does not contain a time, the time part is undefined.
   */
  splitDateAndTime(e) {
    let r = e.split(" "), i = "", a = "";
    if (r.length < 2 || r.length == 3)
      return [e.trim(), void 0];
    let c = e.lastIndexOf(" ");
    return i = e.slice(0, c), a = e.slice(c + 1), a.length > 1 && (a = a.trim()), i.length > 1 && (i = i.trim()), [i, a === "" ? void 0 : a];
  }
  interpolateYear(e, r = 3) {
    if (e > 100)
      return e;
    const i = (/* @__PURE__ */ new Date()).getFullYear() - Math.floor((/* @__PURE__ */ new Date()).getFullYear() / 1e3) * 1e3;
    return e > i + r ? e + 1900 : e + 2e3;
  }
  /**
   * formats year, month and day to a ISO8601 string. Does not check if the result is a valid date.
   * @param year int or string
   * @param month int or string
   * @param day int or string
   */
  formatISO8601DateStr(e, r, i) {
    return i = String(i).padStart(2, "0"), r = String(r).padStart(2, "0"), e = this.interpolateYear(parseInt(String(e) || ""), 3), `${e}-${r}-${i}`;
  }
  guessLatinDate(e) {
    const r = [
      /^(?<day>\d{1,2})\.(?<latinMonth>[IVX]{1,4})\.(?<year>\d{2,4})$/,
      /^(?<day>\d{1,2}) (?<latinMonth>[IVX]{1,4}) (?<year>\d{2,4})$/,
      /^(?<day>\d{1,2})(?<latinMonth>[IVX]{1,4})(?<year>\d{2,4})$/
    ];
    let i = "", a = null;
    for (const c of r)
      if (a = new RegExp(c).exec(e), a)
        break;
    if (a)
      try {
        const c = a.groups?.latinMonth;
        a.groups && c && this.latinMonths.hasOwnProperty(c) && (i = this.formatISO8601DateStr(a.groups.year, this.latinMonths[c], a.groups.day));
      } catch {
      }
    return i;
  }
  /**
   * guesses the date and time from a string.
   *
   * throws KioskDateTimeError in case of errors
   * can also throw other Errors
   * returns a Luxon DateTime object with UTC time zone
   */
  guessDateTime(e, r = !1, i = "utc") {
    const a = B.fromISO(e, { zone: "utc" });
    if (a.isValid) return a;
    let [c, h] = this.splitDateAndTime(e);
    if (!h && !r)
      throw new _r(`${e} has no time.`);
    let m = this.guessLatinDate(c);
    m && (c = m);
    let E = /^(?<day>\d{1,2})\.(?<month>\d{1,2})\.(?<year>\d{2,4})$/.exec(c);
    if (E && E.groups)
      try {
        c = this.formatISO8601DateStr(E.groups.year, E.groups.month, E.groups.day);
      } catch {
      }
    if (E = /^(?<month>\d{1,2})\/(?<day>\d{1,2})\/(?<year>\d{2,4})$/.exec(c), E && E.groups)
      try {
        c = this.formatISO8601DateStr(E.groups.year, E.groups.month, E.groups.day);
      } catch {
      }
    let C;
    if (c && (h ? C = B.fromISO(c + "T" + h, { zone: i, setZone: !0 }).toUTC() : C = B.fromISO(c, { zone: i, setZone: !0 }).toUTC(), !C.isValid))
      throw new _r(`${e} is not a valid date`);
    return C;
  }
}
const af = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  KioskDateTime: Zt,
  KioskDateTimeError: _r
}, Symbol.toStringTag, { value: "Module" }));
/**
 * @license
 * Copyright 2019 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const Sr = globalThis, ts = Sr.ShadowRoot && (Sr.ShadyCSS === void 0 || Sr.ShadyCSS.nativeShadow) && "adoptedStyleSheets" in Document.prototype && "replace" in CSSStyleSheet.prototype, Na = Symbol(), bo = /* @__PURE__ */ new WeakMap();
let Tc = class {
  constructor(e, r, i) {
    if (this._$cssResult$ = !0, i !== Na) throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");
    this.cssText = e, this.t = r;
  }
  get styleSheet() {
    let e = this.o;
    const r = this.t;
    if (ts && e === void 0) {
      const i = r !== void 0 && r.length === 1;
      i && (e = bo.get(r)), e === void 0 && ((this.o = e = new CSSStyleSheet()).replaceSync(this.cssText), i && bo.set(r, e));
    }
    return e;
  }
  toString() {
    return this.cssText;
  }
};
const xc = (s) => new Tc(typeof s == "string" ? s : s + "", void 0, Na), Oc = (s, e) => {
  if (ts) s.adoptedStyleSheets = e.map(((r) => r instanceof CSSStyleSheet ? r : r.styleSheet));
  else for (const r of e) {
    const i = document.createElement("style"), a = Sr.litNonce;
    a !== void 0 && i.setAttribute("nonce", a), i.textContent = r.cssText, s.appendChild(i);
  }
}, ko = ts ? (s) => s : (s) => s instanceof CSSStyleSheet ? ((e) => {
  let r = "";
  for (const i of e.cssRules) r += i.cssText;
  return xc(r);
})(s) : s;
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const { is: Ec, defineProperty: Ic, getOwnPropertyDescriptor: Ac, getOwnPropertyNames: $c, getOwnPropertySymbols: Cc, getPrototypeOf: Dc } = Object, Fr = globalThis, _o = Fr.trustedTypes, Mc = _o ? _o.emptyScript : "", Nc = Fr.reactiveElementPolyfillSupport, $n = (s, e) => s, Ar = { toAttribute(s, e) {
  switch (e) {
    case Boolean:
      s = s ? Mc : null;
      break;
    case Object:
    case Array:
      s = s == null ? s : JSON.stringify(s);
  }
  return s;
}, fromAttribute(s, e) {
  let r = s;
  switch (e) {
    case Boolean:
      r = s !== null;
      break;
    case Number:
      r = s === null ? null : Number(s);
      break;
    case Object:
    case Array:
      try {
        r = JSON.parse(s);
      } catch {
        r = null;
      }
  }
  return r;
} }, ns = (s, e) => !Ec(s, e), So = { attribute: !0, type: String, converter: Ar, reflect: !1, useDefault: !1, hasChanged: ns };
Symbol.metadata ??= Symbol("metadata"), Fr.litPropertyMetadata ??= /* @__PURE__ */ new WeakMap();
let zt = class extends HTMLElement {
  static addInitializer(e) {
    this._$Ei(), (this.l ??= []).push(e);
  }
  static get observedAttributes() {
    return this.finalize(), this._$Eh && [...this._$Eh.keys()];
  }
  static createProperty(e, r = So) {
    if (r.state && (r.attribute = !1), this._$Ei(), this.prototype.hasOwnProperty(e) && ((r = Object.create(r)).wrapped = !0), this.elementProperties.set(e, r), !r.noAccessor) {
      const i = Symbol(), a = this.getPropertyDescriptor(e, i, r);
      a !== void 0 && Ic(this.prototype, e, a);
    }
  }
  static getPropertyDescriptor(e, r, i) {
    const { get: a, set: c } = Ac(this.prototype, e) ?? { get() {
      return this[r];
    }, set(h) {
      this[r] = h;
    } };
    return { get: a, set(h) {
      const m = a?.call(this);
      c?.call(this, h), this.requestUpdate(e, m, i);
    }, configurable: !0, enumerable: !0 };
  }
  static getPropertyOptions(e) {
    return this.elementProperties.get(e) ?? So;
  }
  static _$Ei() {
    if (this.hasOwnProperty($n("elementProperties"))) return;
    const e = Dc(this);
    e.finalize(), e.l !== void 0 && (this.l = [...e.l]), this.elementProperties = new Map(e.elementProperties);
  }
  static finalize() {
    if (this.hasOwnProperty($n("finalized"))) return;
    if (this.finalized = !0, this._$Ei(), this.hasOwnProperty($n("properties"))) {
      const r = this.properties, i = [...$c(r), ...Cc(r)];
      for (const a of i) this.createProperty(a, r[a]);
    }
    const e = this[Symbol.metadata];
    if (e !== null) {
      const r = litPropertyMetadata.get(e);
      if (r !== void 0) for (const [i, a] of r) this.elementProperties.set(i, a);
    }
    this._$Eh = /* @__PURE__ */ new Map();
    for (const [r, i] of this.elementProperties) {
      const a = this._$Eu(r, i);
      a !== void 0 && this._$Eh.set(a, r);
    }
    this.elementStyles = this.finalizeStyles(this.styles);
  }
  static finalizeStyles(e) {
    const r = [];
    if (Array.isArray(e)) {
      const i = new Set(e.flat(1 / 0).reverse());
      for (const a of i) r.unshift(ko(a));
    } else e !== void 0 && r.push(ko(e));
    return r;
  }
  static _$Eu(e, r) {
    const i = r.attribute;
    return i === !1 ? void 0 : typeof i == "string" ? i : typeof e == "string" ? e.toLowerCase() : void 0;
  }
  constructor() {
    super(), this._$Ep = void 0, this.isUpdatePending = !1, this.hasUpdated = !1, this._$Em = null, this._$Ev();
  }
  _$Ev() {
    this._$ES = new Promise(((e) => this.enableUpdating = e)), this._$AL = /* @__PURE__ */ new Map(), this._$E_(), this.requestUpdate(), this.constructor.l?.forEach(((e) => e(this)));
  }
  addController(e) {
    (this._$EO ??= /* @__PURE__ */ new Set()).add(e), this.renderRoot !== void 0 && this.isConnected && e.hostConnected?.();
  }
  removeController(e) {
    this._$EO?.delete(e);
  }
  _$E_() {
    const e = /* @__PURE__ */ new Map(), r = this.constructor.elementProperties;
    for (const i of r.keys()) this.hasOwnProperty(i) && (e.set(i, this[i]), delete this[i]);
    e.size > 0 && (this._$Ep = e);
  }
  createRenderRoot() {
    const e = this.shadowRoot ?? this.attachShadow(this.constructor.shadowRootOptions);
    return Oc(e, this.constructor.elementStyles), e;
  }
  connectedCallback() {
    this.renderRoot ??= this.createRenderRoot(), this.enableUpdating(!0), this._$EO?.forEach(((e) => e.hostConnected?.()));
  }
  enableUpdating(e) {
  }
  disconnectedCallback() {
    this._$EO?.forEach(((e) => e.hostDisconnected?.()));
  }
  attributeChangedCallback(e, r, i) {
    this._$AK(e, i);
  }
  _$ET(e, r) {
    const i = this.constructor.elementProperties.get(e), a = this.constructor._$Eu(e, i);
    if (a !== void 0 && i.reflect === !0) {
      const c = (i.converter?.toAttribute !== void 0 ? i.converter : Ar).toAttribute(r, i.type);
      this._$Em = e, c == null ? this.removeAttribute(a) : this.setAttribute(a, c), this._$Em = null;
    }
  }
  _$AK(e, r) {
    const i = this.constructor, a = i._$Eh.get(e);
    if (a !== void 0 && this._$Em !== a) {
      const c = i.getPropertyOptions(a), h = typeof c.converter == "function" ? { fromAttribute: c.converter } : c.converter?.fromAttribute !== void 0 ? c.converter : Ar;
      this._$Em = a;
      const m = h.fromAttribute(r, c.type);
      this[a] = m ?? this._$Ej?.get(a) ?? m, this._$Em = null;
    }
  }
  requestUpdate(e, r, i) {
    if (e !== void 0) {
      const a = this.constructor, c = this[e];
      if (i ??= a.getPropertyOptions(e), !((i.hasChanged ?? ns)(c, r) || i.useDefault && i.reflect && c === this._$Ej?.get(e) && !this.hasAttribute(a._$Eu(e, i)))) return;
      this.C(e, r, i);
    }
    this.isUpdatePending === !1 && (this._$ES = this._$EP());
  }
  C(e, r, { useDefault: i, reflect: a, wrapped: c }, h) {
    i && !(this._$Ej ??= /* @__PURE__ */ new Map()).has(e) && (this._$Ej.set(e, h ?? r ?? this[e]), c !== !0 || h !== void 0) || (this._$AL.has(e) || (this.hasUpdated || i || (r = void 0), this._$AL.set(e, r)), a === !0 && this._$Em !== e && (this._$Eq ??= /* @__PURE__ */ new Set()).add(e));
  }
  async _$EP() {
    this.isUpdatePending = !0;
    try {
      await this._$ES;
    } catch (r) {
      Promise.reject(r);
    }
    const e = this.scheduleUpdate();
    return e != null && await e, !this.isUpdatePending;
  }
  scheduleUpdate() {
    return this.performUpdate();
  }
  performUpdate() {
    if (!this.isUpdatePending) return;
    if (!this.hasUpdated) {
      if (this.renderRoot ??= this.createRenderRoot(), this._$Ep) {
        for (const [a, c] of this._$Ep) this[a] = c;
        this._$Ep = void 0;
      }
      const i = this.constructor.elementProperties;
      if (i.size > 0) for (const [a, c] of i) {
        const { wrapped: h } = c, m = this[a];
        h !== !0 || this._$AL.has(a) || m === void 0 || this.C(a, void 0, c, m);
      }
    }
    let e = !1;
    const r = this._$AL;
    try {
      e = this.shouldUpdate(r), e ? (this.willUpdate(r), this._$EO?.forEach(((i) => i.hostUpdate?.())), this.update(r)) : this._$EM();
    } catch (i) {
      throw e = !1, this._$EM(), i;
    }
    e && this._$AE(r);
  }
  willUpdate(e) {
  }
  _$AE(e) {
    this._$EO?.forEach(((r) => r.hostUpdated?.())), this.hasUpdated || (this.hasUpdated = !0, this.firstUpdated(e)), this.updated(e);
  }
  _$EM() {
    this._$AL = /* @__PURE__ */ new Map(), this.isUpdatePending = !1;
  }
  get updateComplete() {
    return this.getUpdateComplete();
  }
  getUpdateComplete() {
    return this._$ES;
  }
  shouldUpdate(e) {
    return !0;
  }
  update(e) {
    this._$Eq &&= this._$Eq.forEach(((r) => this._$ET(r, this[r]))), this._$EM();
  }
  updated(e) {
  }
  firstUpdated(e) {
  }
};
zt.elementStyles = [], zt.shadowRootOptions = { mode: "open" }, zt[$n("elementProperties")] = /* @__PURE__ */ new Map(), zt[$n("finalized")] = /* @__PURE__ */ new Map(), Nc?.({ ReactiveElement: zt }), (Fr.reactiveElementVersions ??= []).push("2.1.1");
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const rs = globalThis, $r = rs.trustedTypes, To = $r ? $r.createPolicy("lit-html", { createHTML: (s) => s }) : void 0, Pa = "$lit$", it = `lit$${Math.random().toFixed(9).slice(2)}$`, Fa = "?" + it, Pc = `<${Fa}>`, It = document, Dn = () => It.createComment(""), Mn = (s) => s === null || typeof s != "object" && typeof s != "function", is = Array.isArray, Fc = (s) => is(s) || typeof s?.[Symbol.iterator] == "function", Di = `[ 	
\f\r]`, Tn = /<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g, xo = /-->/g, Oo = />/g, Tt = RegExp(`>|${Di}(?:([^\\s"'>=/]+)(${Di}*=${Di}*(?:[^ 	
\f\r"'\`<>=]|("|')|))|$)`, "g"), Eo = /'/g, Io = /"/g, Ra = /^(?:script|style|textarea|title)$/i, Rc = (s) => (e, ...r) => ({ _$litType$: s, strings: e, values: r }), st = Rc(1), Xt = Symbol.for("lit-noChange"), he = Symbol.for("lit-nothing"), Ao = /* @__PURE__ */ new WeakMap(), Et = It.createTreeWalker(It, 129);
function Va(s, e) {
  if (!is(s) || !s.hasOwnProperty("raw")) throw Error("invalid template strings array");
  return To !== void 0 ? To.createHTML(e) : e;
}
const Vc = (s, e) => {
  const r = s.length - 1, i = [];
  let a, c = e === 2 ? "<svg>" : e === 3 ? "<math>" : "", h = Tn;
  for (let m = 0; m < r; m++) {
    const y = s[m];
    let E, N, C = -1, W = 0;
    for (; W < y.length && (h.lastIndex = W, N = h.exec(y), N !== null); ) W = h.lastIndex, h === Tn ? N[1] === "!--" ? h = xo : N[1] !== void 0 ? h = Oo : N[2] !== void 0 ? (Ra.test(N[2]) && (a = RegExp("</" + N[2], "g")), h = Tt) : N[3] !== void 0 && (h = Tt) : h === Tt ? N[0] === ">" ? (h = a ?? Tn, C = -1) : N[1] === void 0 ? C = -2 : (C = h.lastIndex - N[2].length, E = N[1], h = N[3] === void 0 ? Tt : N[3] === '"' ? Io : Eo) : h === Io || h === Eo ? h = Tt : h === xo || h === Oo ? h = Tn : (h = Tt, a = void 0);
    const j = h === Tt && s[m + 1].startsWith("/>") ? " " : "";
    c += h === Tn ? y + Pc : C >= 0 ? (i.push(E), y.slice(0, C) + Pa + y.slice(C) + it + j) : y + it + (C === -2 ? m : j);
  }
  return [Va(s, c + (s[r] || "<?>") + (e === 2 ? "</svg>" : e === 3 ? "</math>" : "")), i];
};
class Nn {
  constructor({ strings: e, _$litType$: r }, i) {
    let a;
    this.parts = [];
    let c = 0, h = 0;
    const m = e.length - 1, y = this.parts, [E, N] = Vc(e, r);
    if (this.el = Nn.createElement(E, i), Et.currentNode = this.el.content, r === 2 || r === 3) {
      const C = this.el.content.firstChild;
      C.replaceWith(...C.childNodes);
    }
    for (; (a = Et.nextNode()) !== null && y.length < m; ) {
      if (a.nodeType === 1) {
        if (a.hasAttributes()) for (const C of a.getAttributeNames()) if (C.endsWith(Pa)) {
          const W = N[h++], j = a.getAttribute(C).split(it), X = /([.?@])?(.*)/.exec(W);
          y.push({ type: 1, index: c, name: X[2], strings: j, ctor: X[1] === "." ? qc : X[1] === "?" ? Lc : X[1] === "@" ? jc : Rr }), a.removeAttribute(C);
        } else C.startsWith(it) && (y.push({ type: 6, index: c }), a.removeAttribute(C));
        if (Ra.test(a.tagName)) {
          const C = a.textContent.split(it), W = C.length - 1;
          if (W > 0) {
            a.textContent = $r ? $r.emptyScript : "";
            for (let j = 0; j < W; j++) a.append(C[j], Dn()), Et.nextNode(), y.push({ type: 2, index: ++c });
            a.append(C[W], Dn());
          }
        }
      } else if (a.nodeType === 8) if (a.data === Fa) y.push({ type: 2, index: c });
      else {
        let C = -1;
        for (; (C = a.data.indexOf(it, C + 1)) !== -1; ) y.push({ type: 7, index: c }), C += it.length - 1;
      }
      c++;
    }
  }
  static createElement(e, r) {
    const i = It.createElement("template");
    return i.innerHTML = e, i;
  }
}
function Qt(s, e, r = s, i) {
  if (e === Xt) return e;
  let a = i !== void 0 ? r._$Co?.[i] : r._$Cl;
  const c = Mn(e) ? void 0 : e._$litDirective$;
  return a?.constructor !== c && (a?._$AO?.(!1), c === void 0 ? a = void 0 : (a = new c(s), a._$AT(s, r, i)), i !== void 0 ? (r._$Co ??= [])[i] = a : r._$Cl = a), a !== void 0 && (e = Qt(s, a._$AS(s, e.values), a, i)), e;
}
class Uc {
  constructor(e, r) {
    this._$AV = [], this._$AN = void 0, this._$AD = e, this._$AM = r;
  }
  get parentNode() {
    return this._$AM.parentNode;
  }
  get _$AU() {
    return this._$AM._$AU;
  }
  u(e) {
    const { el: { content: r }, parts: i } = this._$AD, a = (e?.creationScope ?? It).importNode(r, !0);
    Et.currentNode = a;
    let c = Et.nextNode(), h = 0, m = 0, y = i[0];
    for (; y !== void 0; ) {
      if (h === y.index) {
        let E;
        y.type === 2 ? E = new ss(c, c.nextSibling, this, e) : y.type === 1 ? E = new y.ctor(c, y.name, y.strings, this, e) : y.type === 6 && (E = new Wc(c, this, e)), this._$AV.push(E), y = i[++m];
      }
      h !== y?.index && (c = Et.nextNode(), h++);
    }
    return Et.currentNode = It, a;
  }
  p(e) {
    let r = 0;
    for (const i of this._$AV) i !== void 0 && (i.strings !== void 0 ? (i._$AI(e, i, r), r += i.strings.length - 2) : i._$AI(e[r])), r++;
  }
}
let ss = class Ua {
  get _$AU() {
    return this._$AM?._$AU ?? this._$Cv;
  }
  constructor(e, r, i, a) {
    this.type = 2, this._$AH = he, this._$AN = void 0, this._$AA = e, this._$AB = r, this._$AM = i, this.options = a, this._$Cv = a?.isConnected ?? !0;
  }
  get parentNode() {
    let e = this._$AA.parentNode;
    const r = this._$AM;
    return r !== void 0 && e?.nodeType === 11 && (e = r.parentNode), e;
  }
  get startNode() {
    return this._$AA;
  }
  get endNode() {
    return this._$AB;
  }
  _$AI(e, r = this) {
    e = Qt(this, e, r), Mn(e) ? e === he || e == null || e === "" ? (this._$AH !== he && this._$AR(), this._$AH = he) : e !== this._$AH && e !== Xt && this._(e) : e._$litType$ !== void 0 ? this.$(e) : e.nodeType !== void 0 ? this.T(e) : Fc(e) ? this.k(e) : this._(e);
  }
  O(e) {
    return this._$AA.parentNode.insertBefore(e, this._$AB);
  }
  T(e) {
    this._$AH !== e && (this._$AR(), this._$AH = this.O(e));
  }
  _(e) {
    this._$AH !== he && Mn(this._$AH) ? this._$AA.nextSibling.data = e : this.T(It.createTextNode(e)), this._$AH = e;
  }
  $(e) {
    const { values: r, _$litType$: i } = e, a = typeof i == "number" ? this._$AC(e) : (i.el === void 0 && (i.el = Nn.createElement(Va(i.h, i.h[0]), this.options)), i);
    if (this._$AH?._$AD === a) this._$AH.p(r);
    else {
      const c = new Uc(a, this), h = c.u(this.options);
      c.p(r), this.T(h), this._$AH = c;
    }
  }
  _$AC(e) {
    let r = Ao.get(e.strings);
    return r === void 0 && Ao.set(e.strings, r = new Nn(e)), r;
  }
  k(e) {
    is(this._$AH) || (this._$AH = [], this._$AR());
    const r = this._$AH;
    let i, a = 0;
    for (const c of e) a === r.length ? r.push(i = new Ua(this.O(Dn()), this.O(Dn()), this, this.options)) : i = r[a], i._$AI(c), a++;
    a < r.length && (this._$AR(i && i._$AB.nextSibling, a), r.length = a);
  }
  _$AR(e = this._$AA.nextSibling, r) {
    for (this._$AP?.(!1, !0, r); e !== this._$AB; ) {
      const i = e.nextSibling;
      e.remove(), e = i;
    }
  }
  setConnected(e) {
    this._$AM === void 0 && (this._$Cv = e, this._$AP?.(e));
  }
}, Rr = class {
  get tagName() {
    return this.element.tagName;
  }
  get _$AU() {
    return this._$AM._$AU;
  }
  constructor(e, r, i, a, c) {
    this.type = 1, this._$AH = he, this._$AN = void 0, this.element = e, this.name = r, this._$AM = a, this.options = c, i.length > 2 || i[0] !== "" || i[1] !== "" ? (this._$AH = Array(i.length - 1).fill(new String()), this.strings = i) : this._$AH = he;
  }
  _$AI(e, r = this, i, a) {
    const c = this.strings;
    let h = !1;
    if (c === void 0) e = Qt(this, e, r, 0), h = !Mn(e) || e !== this._$AH && e !== Xt, h && (this._$AH = e);
    else {
      const m = e;
      let y, E;
      for (e = c[0], y = 0; y < c.length - 1; y++) E = Qt(this, m[i + y], r, y), E === Xt && (E = this._$AH[y]), h ||= !Mn(E) || E !== this._$AH[y], E === he ? e = he : e !== he && (e += (E ?? "") + c[y + 1]), this._$AH[y] = E;
    }
    h && !a && this.j(e);
  }
  j(e) {
    e === he ? this.element.removeAttribute(this.name) : this.element.setAttribute(this.name, e ?? "");
  }
};
class qc extends Rr {
  constructor() {
    super(...arguments), this.type = 3;
  }
  j(e) {
    this.element[this.name] = e === he ? void 0 : e;
  }
}
let Lc = class extends Rr {
  constructor() {
    super(...arguments), this.type = 4;
  }
  j(e) {
    this.element.toggleAttribute(this.name, !!e && e !== he);
  }
}, jc = class extends Rr {
  constructor(e, r, i, a, c) {
    super(e, r, i, a, c), this.type = 5;
  }
  _$AI(e, r = this) {
    if ((e = Qt(this, e, r, 0) ?? he) === Xt) return;
    const i = this._$AH, a = e === he && i !== he || e.capture !== i.capture || e.once !== i.once || e.passive !== i.passive, c = e !== he && (i === he || a);
    a && this.element.removeEventListener(this.name, this, i), c && this.element.addEventListener(this.name, this, e), this._$AH = e;
  }
  handleEvent(e) {
    typeof this._$AH == "function" ? this._$AH.call(this.options?.host ?? this.element, e) : this._$AH.handleEvent(e);
  }
};
class Wc {
  constructor(e, r, i) {
    this.element = e, this.type = 6, this._$AN = void 0, this._$AM = r, this.options = i;
  }
  get _$AU() {
    return this._$AM._$AU;
  }
  _$AI(e) {
    Qt(this, e);
  }
}
const Kc = rs.litHtmlPolyfillSupport;
Kc?.(Nn, ss), (rs.litHtmlVersions ??= []).push("3.3.1");
const zc = (s, e, r) => {
  const i = r?.renderBefore ?? e;
  let a = i._$litPart$;
  if (a === void 0) {
    const c = r?.renderBefore ?? null;
    i._$litPart$ = a = new ss(e.insertBefore(Dn(), c), c, void 0, r ?? {});
  }
  return a._$AI(s), a;
};
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const os = globalThis;
class Gt extends zt {
  constructor() {
    super(...arguments), this.renderOptions = { host: this }, this._$Do = void 0;
  }
  createRenderRoot() {
    const e = super.createRenderRoot();
    return this.renderOptions.renderBefore ??= e.firstChild, e;
  }
  update(e) {
    const r = this.render();
    this.hasUpdated || (this.renderOptions.isConnected = this.isConnected), super.update(e), this._$Do = zc(r, this.renderRoot, this.renderOptions);
  }
  connectedCallback() {
    super.connectedCallback(), this._$Do?.setConnected(!0);
  }
  disconnectedCallback() {
    super.disconnectedCallback(), this._$Do?.setConnected(!1);
  }
  render() {
    return Xt;
  }
}
Gt._$litElement$ = !0, Gt.finalized = !0, os.litElementHydrateSupport?.({ LitElement: Gt });
const Bc = os.litElementPolyfillSupport;
Bc?.({ LitElement: Gt });
(os.litElementVersions ??= []).push("4.2.1");
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const Zc = { attribute: !0, type: String, converter: Ar, reflect: !1, hasChanged: ns }, Hc = (s = Zc, e, r) => {
  const { kind: i, metadata: a } = r;
  let c = globalThis.litPropertyMetadata.get(a);
  if (c === void 0 && globalThis.litPropertyMetadata.set(a, c = /* @__PURE__ */ new Map()), i === "setter" && ((s = Object.create(s)).wrapped = !0), c.set(r.name, s), i === "accessor") {
    const { name: h } = r;
    return { set(m) {
      const y = e.get.call(this);
      e.set.call(this, m), this.requestUpdate(h, y, s);
    }, init(m) {
      return m !== void 0 && this.C(h, void 0, s, m), m;
    } };
  }
  if (i === "setter") {
    const { name: h } = r;
    return function(m) {
      const y = this[h];
      e.call(this, m), this.requestUpdate(h, y, s);
    };
  }
  throw Error("Unsupported decorator location: " + i);
};
function qa(s) {
  return (e, r) => typeof r == "object" ? Hc(s, e, r) : ((i, a, c) => {
    const h = a.hasOwnProperty(c);
    return a.constructor.createProperty(c, i), h ? Object.getOwnPropertyDescriptor(a, c) : void 0;
  })(s, e, r);
}
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
function Yc(s) {
  return qa({ ...s, state: !0, attribute: !1 });
}
var Gc = typeof globalThis < "u" ? globalThis : typeof window < "u" ? window : typeof global < "u" ? global : typeof self < "u" ? self : {};
function Jc(s) {
  return s && s.__esModule && Object.prototype.hasOwnProperty.call(s, "default") ? s.default : s;
}
var Tr = { exports: {} }, Xc = Tr.exports, $o;
function Qc() {
  return $o || ($o = 1, (function(s, e) {
    (function(r, i) {
      s.exports = i();
    })(Xc, function() {
      var r = function(t, n) {
        return (r = Object.setPrototypeOf || { __proto__: [] } instanceof Array && function(o, u) {
          o.__proto__ = u;
        } || function(o, u) {
          for (var l in u) Object.prototype.hasOwnProperty.call(u, l) && (o[l] = u[l]);
        })(t, n);
      }, i = function() {
        return (i = Object.assign || function(t) {
          for (var n, o = 1, u = arguments.length; o < u; o++) for (var l in n = arguments[o]) Object.prototype.hasOwnProperty.call(n, l) && (t[l] = n[l]);
          return t;
        }).apply(this, arguments);
      };
      function a(t, n, o) {
        for (var u, l = 0, f = n.length; l < f; l++) !u && l in n || ((u = u || Array.prototype.slice.call(n, 0, l))[l] = n[l]);
        return t.concat(u || Array.prototype.slice.call(n));
      }
      var c = typeof globalThis < "u" ? globalThis : typeof self < "u" ? self : typeof window < "u" ? window : Gc, h = Object.keys, m = Array.isArray;
      function y(t, n) {
        return typeof n != "object" || h(n).forEach(function(o) {
          t[o] = n[o];
        }), t;
      }
      typeof Promise > "u" || c.Promise || (c.Promise = Promise);
      var E = Object.getPrototypeOf, N = {}.hasOwnProperty;
      function C(t, n) {
        return N.call(t, n);
      }
      function W(t, n) {
        typeof n == "function" && (n = n(E(t))), (typeof Reflect > "u" ? h : Reflect.ownKeys)(n).forEach(function(o) {
          X(t, o, n[o]);
        });
      }
      var j = Object.defineProperty;
      function X(t, n, o, u) {
        j(t, n, y(o && C(o, "get") && typeof o.get == "function" ? { get: o.get, set: o.set, configurable: !0 } : { value: o, configurable: !0, writable: !0 }, u));
      }
      function me(t) {
        return { from: function(n) {
          return t.prototype = Object.create(n.prototype), X(t.prototype, "constructor", t), { extend: W.bind(null, t.prototype) };
        } };
      }
      var Ee = Object.getOwnPropertyDescriptor, Be = [].slice;
      function Re(t, n, o) {
        return Be.call(t, n, o);
      }
      function on(t, n) {
        return n(t);
      }
      function at(t) {
        if (!t) throw new Error("Assertion Failed");
      }
      function an(t) {
        c.setImmediate ? setImmediate(t) : setTimeout(t, 0);
      }
      function De(t, n) {
        if (typeof n == "string" && C(t, n)) return t[n];
        if (!n) return t;
        if (typeof n != "string") {
          for (var o = [], u = 0, l = n.length; u < l; ++u) {
            var f = De(t, n[u]);
            o.push(f);
          }
          return o;
        }
        var d = n.indexOf(".");
        if (d !== -1) {
          var p = t[n.substr(0, d)];
          return p == null ? void 0 : De(p, n.substr(d + 1));
        }
      }
      function Se(t, n, o) {
        if (t && n !== void 0 && !("isFrozen" in Object && Object.isFrozen(t))) if (typeof n != "string" && "length" in n) {
          at(typeof o != "string" && "length" in o);
          for (var u = 0, l = n.length; u < l; ++u) Se(t, n[u], o[u]);
        } else {
          var f, d, p = n.indexOf(".");
          p !== -1 ? (f = n.substr(0, p), (d = n.substr(p + 1)) === "" ? o === void 0 ? m(t) && !isNaN(parseInt(f)) ? t.splice(f, 1) : delete t[f] : t[f] = o : Se(p = !(p = t[f]) || !C(t, f) ? t[f] = {} : p, d, o)) : o === void 0 ? m(t) && !isNaN(parseInt(n)) ? t.splice(n, 1) : delete t[n] : t[n] = o;
        }
      }
      function Un(t) {
        var n, o = {};
        for (n in t) C(t, n) && (o[n] = t[n]);
        return o;
      }
      var ut = [].concat;
      function Ze(t) {
        return ut.apply([], t);
      }
      var ht = "BigUint64Array,BigInt64Array,Array,Boolean,String,Date,RegExp,Blob,File,FileList,FileSystemFileHandle,FileSystemDirectoryHandle,ArrayBuffer,DataView,Uint8ClampedArray,ImageBitmap,ImageData,Map,Set,CryptoKey".split(",").concat(Ze([8, 16, 32, 64].map(function(t) {
        return ["Int", "Uint", "Float"].map(function(n) {
          return n + t + "Array";
        });
      }))).filter(function(t) {
        return c[t];
      }), qn = new Set(ht.map(function(t) {
        return c[t];
      })), un = null;
      function lt(t) {
        return un = /* @__PURE__ */ new WeakMap(), t = (function n(o) {
          if (!o || typeof o != "object") return o;
          var u = un.get(o);
          if (u) return u;
          if (m(o)) {
            u = [], un.set(o, u);
            for (var l = 0, f = o.length; l < f; ++l) u.push(n(o[l]));
          } else if (qn.has(o.constructor)) u = o;
          else {
            var d, p = E(o);
            for (d in u = p === Object.prototype ? {} : Object.create(p), un.set(o, u), o) C(o, d) && (u[d] = n(o[d]));
          }
          return u;
        })(t), un = null, t;
      }
      var za = {}.toString;
      function Vr(t) {
        return za.call(t).slice(8, -1);
      }
      var Ur = typeof Symbol < "u" ? Symbol.iterator : "@@iterator", Ba = typeof Ur == "symbol" ? function(t) {
        var n;
        return t != null && (n = t[Ur]) && n.apply(t);
      } : function() {
        return null;
      };
      function ct(t, n) {
        return n = t.indexOf(n), 0 <= n && t.splice(n, 1), 0 <= n;
      }
      var $t = {};
      function je(t) {
        var n, o, u, l;
        if (arguments.length === 1) {
          if (m(t)) return t.slice();
          if (this === $t && typeof t == "string") return [t];
          if (l = Ba(t)) {
            for (o = []; !(u = l.next()).done; ) o.push(u.value);
            return o;
          }
          if (t == null) return [t];
          if (typeof (n = t.length) != "number") return [t];
          for (o = new Array(n); n--; ) o[n] = t[n];
          return o;
        }
        for (n = arguments.length, o = new Array(n); n--; ) o[n] = arguments[n];
        return o;
      }
      var qr = typeof Symbol < "u" ? function(t) {
        return t[Symbol.toStringTag] === "AsyncFunction";
      } : function() {
        return !1;
      }, fn = ["Unknown", "Constraint", "Data", "TransactionInactive", "ReadOnly", "Version", "NotFound", "InvalidState", "InvalidAccess", "Abort", "Timeout", "QuotaExceeded", "Syntax", "DataClone"], Ie = ["Modify", "Bulk", "OpenFailed", "VersionChange", "Schema", "Upgrade", "InvalidTable", "MissingAPI", "NoSuchDatabase", "InvalidArgument", "SubTransaction", "Unsupported", "Internal", "DatabaseClosed", "PrematureCommit", "ForeignAwait"].concat(fn), Za = { VersionChanged: "Database version changed by other database connection", DatabaseClosed: "Database has been closed", Abort: "Transaction aborted", TransactionInactive: "Transaction has already completed or failed", MissingAPI: "IndexedDB API missing. Please visit https://tinyurl.com/y2uuvskb" };
      function Ct(t, n) {
        this.name = t, this.message = n;
      }
      function as(t, n) {
        return t + ". Errors: " + Object.keys(n).map(function(o) {
          return n[o].toString();
        }).filter(function(o, u, l) {
          return l.indexOf(o) === u;
        }).join(`
`);
      }
      function Ln(t, n, o, u) {
        this.failures = n, this.failedKeys = u, this.successCount = o, this.message = as(t, n);
      }
      function Dt(t, n) {
        this.name = "BulkError", this.failures = Object.keys(n).map(function(o) {
          return n[o];
        }), this.failuresByPos = n, this.message = as(t, this.failures);
      }
      me(Ct).from(Error).extend({ toString: function() {
        return this.name + ": " + this.message;
      } }), me(Ln).from(Ct), me(Dt).from(Ct);
      var Lr = Ie.reduce(function(t, n) {
        return t[n] = n + "Error", t;
      }, {}), Ha = Ct, z = Ie.reduce(function(t, n) {
        var o = n + "Error";
        function u(l, f) {
          this.name = o, l ? typeof l == "string" ? (this.message = "".concat(l).concat(f ? `
 ` + f : ""), this.inner = f || null) : typeof l == "object" && (this.message = "".concat(l.name, " ").concat(l.message), this.inner = l) : (this.message = Za[n] || o, this.inner = null);
        }
        return me(u).from(Ha), t[n] = u, t;
      }, {});
      z.Syntax = SyntaxError, z.Type = TypeError, z.Range = RangeError;
      var us = fn.reduce(function(t, n) {
        return t[n + "Error"] = z[n], t;
      }, {}), jn = Ie.reduce(function(t, n) {
        return ["Syntax", "Type", "Range"].indexOf(n) === -1 && (t[n + "Error"] = z[n]), t;
      }, {});
      function ie() {
      }
      function ln(t) {
        return t;
      }
      function Ya(t, n) {
        return t == null || t === ln ? n : function(o) {
          return n(t(o));
        };
      }
      function ft(t, n) {
        return function() {
          t.apply(this, arguments), n.apply(this, arguments);
        };
      }
      function Ga(t, n) {
        return t === ie ? n : function() {
          var o = t.apply(this, arguments);
          o !== void 0 && (arguments[0] = o);
          var u = this.onsuccess, l = this.onerror;
          this.onsuccess = null, this.onerror = null;
          var f = n.apply(this, arguments);
          return u && (this.onsuccess = this.onsuccess ? ft(u, this.onsuccess) : u), l && (this.onerror = this.onerror ? ft(l, this.onerror) : l), f !== void 0 ? f : o;
        };
      }
      function Ja(t, n) {
        return t === ie ? n : function() {
          t.apply(this, arguments);
          var o = this.onsuccess, u = this.onerror;
          this.onsuccess = this.onerror = null, n.apply(this, arguments), o && (this.onsuccess = this.onsuccess ? ft(o, this.onsuccess) : o), u && (this.onerror = this.onerror ? ft(u, this.onerror) : u);
        };
      }
      function Xa(t, n) {
        return t === ie ? n : function(o) {
          var u = t.apply(this, arguments);
          y(o, u);
          var l = this.onsuccess, f = this.onerror;
          return this.onsuccess = null, this.onerror = null, o = n.apply(this, arguments), l && (this.onsuccess = this.onsuccess ? ft(l, this.onsuccess) : l), f && (this.onerror = this.onerror ? ft(f, this.onerror) : f), u === void 0 ? o === void 0 ? void 0 : o : y(u, o);
        };
      }
      function Qa(t, n) {
        return t === ie ? n : function() {
          return n.apply(this, arguments) !== !1 && t.apply(this, arguments);
        };
      }
      function jr(t, n) {
        return t === ie ? n : function() {
          var o = t.apply(this, arguments);
          if (o && typeof o.then == "function") {
            for (var u = this, l = arguments.length, f = new Array(l); l--; ) f[l] = arguments[l];
            return o.then(function() {
              return n.apply(u, f);
            });
          }
          return n.apply(this, arguments);
        };
      }
      jn.ModifyError = Ln, jn.DexieError = Ct, jn.BulkError = Dt;
      var Ve = typeof location < "u" && /^(http|https):\/\/(localhost|127\.0\.0\.1)/.test(location.href);
      function ls(t) {
        Ve = t;
      }
      var cn = {}, cs = 100, ht = typeof Promise > "u" ? [] : (function() {
        var t = Promise.resolve();
        if (typeof crypto > "u" || !crypto.subtle) return [t, E(t), t];
        var n = crypto.subtle.digest("SHA-512", new Uint8Array([0]));
        return [n, E(n), t];
      })(), fn = ht[0], Ie = ht[1], ht = ht[2], Ie = Ie && Ie.then, dt = fn && fn.constructor, Wr = !!ht, hn = function(t, n) {
        dn.push([t, n]), Wn && (queueMicrotask(tu), Wn = !1);
      }, Kr = !0, Wn = !0, mt = [], Kn = [], zr = ln, He = { id: "global", global: !0, ref: 0, unhandleds: [], onunhandled: ie, pgp: !1, env: {}, finalize: ie }, K = He, dn = [], pt = 0, zn = [];
      function q(t) {
        if (typeof this != "object") throw new TypeError("Promises must be constructed via new");
        this._listeners = [], this._lib = !1;
        var n = this._PSD = K;
        if (typeof t != "function") {
          if (t !== cn) throw new TypeError("Not a function");
          return this._state = arguments[1], this._value = arguments[2], void (this._state === !1 && Zr(this, this._value));
        }
        this._state = null, this._value = null, ++n.ref, (function o(u, l) {
          try {
            l(function(f) {
              if (u._state === null) {
                if (f === u) throw new TypeError("A promise cannot be resolved with itself.");
                var d = u._lib && Mt();
                f && typeof f.then == "function" ? o(u, function(p, v) {
                  f instanceof q ? f._then(p, v) : f.then(p, v);
                }) : (u._state = !0, u._value = f, hs(u)), d && Nt();
              }
            }, Zr.bind(null, u));
          } catch (f) {
            Zr(u, f);
          }
        })(this, t);
      }
      var Br = { get: function() {
        var t = K, n = Yn;
        function o(u, l) {
          var f = this, d = !t.global && (t !== K || n !== Yn), p = d && !Ge(), v = new q(function(b, _) {
            Hr(f, new fs(ms(u, t, d, p), ms(l, t, d, p), b, _, t));
          });
          return this._consoleTask && (v._consoleTask = this._consoleTask), v;
        }
        return o.prototype = cn, o;
      }, set: function(t) {
        X(this, "then", t && t.prototype === cn ? Br : { get: function() {
          return t;
        }, set: Br.set });
      } };
      function fs(t, n, o, u, l) {
        this.onFulfilled = typeof t == "function" ? t : null, this.onRejected = typeof n == "function" ? n : null, this.resolve = o, this.reject = u, this.psd = l;
      }
      function Zr(t, n) {
        var o, u;
        Kn.push(n), t._state === null && (o = t._lib && Mt(), n = zr(n), t._state = !1, t._value = n, u = t, mt.some(function(l) {
          return l._value === u._value;
        }) || mt.push(u), hs(t), o && Nt());
      }
      function hs(t) {
        var n = t._listeners;
        t._listeners = [];
        for (var o = 0, u = n.length; o < u; ++o) Hr(t, n[o]);
        var l = t._PSD;
        --l.ref || l.finalize(), pt === 0 && (++pt, hn(function() {
          --pt == 0 && Yr();
        }, []));
      }
      function Hr(t, n) {
        if (t._state !== null) {
          var o = t._state ? n.onFulfilled : n.onRejected;
          if (o === null) return (t._state ? n.resolve : n.reject)(t._value);
          ++n.psd.ref, ++pt, hn(eu, [o, t, n]);
        } else t._listeners.push(n);
      }
      function eu(t, n, o) {
        try {
          var u, l = n._value;
          !n._state && Kn.length && (Kn = []), u = Ve && n._consoleTask ? n._consoleTask.run(function() {
            return t(l);
          }) : t(l), n._state || Kn.indexOf(l) !== -1 || (function(f) {
            for (var d = mt.length; d; ) if (mt[--d]._value === f._value) return mt.splice(d, 1);
          })(n), o.resolve(u);
        } catch (f) {
          o.reject(f);
        } finally {
          --pt == 0 && Yr(), --o.psd.ref || o.psd.finalize();
        }
      }
      function tu() {
        yt(He, function() {
          Mt() && Nt();
        });
      }
      function Mt() {
        var t = Kr;
        return Wn = Kr = !1, t;
      }
      function Nt() {
        var t, n, o;
        do
          for (; 0 < dn.length; ) for (t = dn, dn = [], o = t.length, n = 0; n < o; ++n) {
            var u = t[n];
            u[0].apply(null, u[1]);
          }
        while (0 < dn.length);
        Wn = Kr = !0;
      }
      function Yr() {
        var t = mt;
        mt = [], t.forEach(function(u) {
          u._PSD.onunhandled.call(null, u._value, u);
        });
        for (var n = zn.slice(0), o = n.length; o; ) n[--o]();
      }
      function Bn(t) {
        return new q(cn, !1, t);
      }
      function oe(t, n) {
        var o = K;
        return function() {
          var u = Mt(), l = K;
          try {
            return Je(o, !0), t.apply(this, arguments);
          } catch (f) {
            n && n(f);
          } finally {
            Je(l, !1), u && Nt();
          }
        };
      }
      W(q.prototype, { then: Br, _then: function(t, n) {
        Hr(this, new fs(null, null, t, n, K));
      }, catch: function(t) {
        if (arguments.length === 1) return this.then(null, t);
        var n = t, o = arguments[1];
        return typeof n == "function" ? this.then(null, function(u) {
          return (u instanceof n ? o : Bn)(u);
        }) : this.then(null, function(u) {
          return (u && u.name === n ? o : Bn)(u);
        });
      }, finally: function(t) {
        return this.then(function(n) {
          return q.resolve(t()).then(function() {
            return n;
          });
        }, function(n) {
          return q.resolve(t()).then(function() {
            return Bn(n);
          });
        });
      }, timeout: function(t, n) {
        var o = this;
        return t < 1 / 0 ? new q(function(u, l) {
          var f = setTimeout(function() {
            return l(new z.Timeout(n));
          }, t);
          o.then(u, l).finally(clearTimeout.bind(null, f));
        }) : this;
      } }), typeof Symbol < "u" && Symbol.toStringTag && X(q.prototype, Symbol.toStringTag, "Dexie.Promise"), He.env = ds(), W(q, { all: function() {
        var t = je.apply(null, arguments).map(Gn);
        return new q(function(n, o) {
          t.length === 0 && n([]);
          var u = t.length;
          t.forEach(function(l, f) {
            return q.resolve(l).then(function(d) {
              t[f] = d, --u || n(t);
            }, o);
          });
        });
      }, resolve: function(t) {
        return t instanceof q ? t : t && typeof t.then == "function" ? new q(function(n, o) {
          t.then(n, o);
        }) : new q(cn, !0, t);
      }, reject: Bn, race: function() {
        var t = je.apply(null, arguments).map(Gn);
        return new q(function(n, o) {
          t.map(function(u) {
            return q.resolve(u).then(n, o);
          });
        });
      }, PSD: { get: function() {
        return K;
      }, set: function(t) {
        return K = t;
      } }, totalEchoes: { get: function() {
        return Yn;
      } }, newPSD: Ye, usePSD: yt, scheduler: { get: function() {
        return hn;
      }, set: function(t) {
        hn = t;
      } }, rejectionMapper: { get: function() {
        return zr;
      }, set: function(t) {
        zr = t;
      } }, follow: function(t, n) {
        return new q(function(o, u) {
          return Ye(function(l, f) {
            var d = K;
            d.unhandleds = [], d.onunhandled = f, d.finalize = ft(function() {
              var p, v = this;
              p = function() {
                v.unhandleds.length === 0 ? l() : f(v.unhandleds[0]);
              }, zn.push(function b() {
                p(), zn.splice(zn.indexOf(b), 1);
              }), ++pt, hn(function() {
                --pt == 0 && Yr();
              }, []);
            }, d.finalize), t();
          }, n, o, u);
        });
      } }), dt && (dt.allSettled && X(q, "allSettled", function() {
        var t = je.apply(null, arguments).map(Gn);
        return new q(function(n) {
          t.length === 0 && n([]);
          var o = t.length, u = new Array(o);
          t.forEach(function(l, f) {
            return q.resolve(l).then(function(d) {
              return u[f] = { status: "fulfilled", value: d };
            }, function(d) {
              return u[f] = { status: "rejected", reason: d };
            }).then(function() {
              return --o || n(u);
            });
          });
        });
      }), dt.any && typeof AggregateError < "u" && X(q, "any", function() {
        var t = je.apply(null, arguments).map(Gn);
        return new q(function(n, o) {
          t.length === 0 && o(new AggregateError([]));
          var u = t.length, l = new Array(u);
          t.forEach(function(f, d) {
            return q.resolve(f).then(function(p) {
              return n(p);
            }, function(p) {
              l[d] = p, --u || o(new AggregateError(l));
            });
          });
        });
      }), dt.withResolvers && (q.withResolvers = dt.withResolvers));
      var pe = { awaits: 0, echoes: 0, id: 0 }, nu = 0, Zn = [], Hn = 0, Yn = 0, ru = 0;
      function Ye(t, n, o, u) {
        var l = K, f = Object.create(l);
        return f.parent = l, f.ref = 0, f.global = !1, f.id = ++ru, He.env, f.env = Wr ? { Promise: q, PromiseProp: { value: q, configurable: !0, writable: !0 }, all: q.all, race: q.race, allSettled: q.allSettled, any: q.any, resolve: q.resolve, reject: q.reject } : {}, n && y(f, n), ++l.ref, f.finalize = function() {
          --this.parent.ref || this.parent.finalize();
        }, u = yt(f, t, o, u), f.ref === 0 && f.finalize(), u;
      }
      function Pt() {
        return pe.id || (pe.id = ++nu), ++pe.awaits, pe.echoes += cs, pe.id;
      }
      function Ge() {
        return !!pe.awaits && (--pe.awaits == 0 && (pe.id = 0), pe.echoes = pe.awaits * cs, !0);
      }
      function Gn(t) {
        return pe.echoes && t && t.constructor === dt ? (Pt(), t.then(function(n) {
          return Ge(), n;
        }, function(n) {
          return Ge(), ce(n);
        })) : t;
      }
      function iu() {
        var t = Zn[Zn.length - 1];
        Zn.pop(), Je(t, !1);
      }
      function Je(t, n) {
        var o, u = K;
        (n ? !pe.echoes || Hn++ && t === K : !Hn || --Hn && t === K) || queueMicrotask(n ? (function(l) {
          ++Yn, pe.echoes && --pe.echoes != 0 || (pe.echoes = pe.awaits = pe.id = 0), Zn.push(K), Je(l, !0);
        }).bind(null, t) : iu), t !== K && (K = t, u === He && (He.env = ds()), Wr && (o = He.env.Promise, n = t.env, (u.global || t.global) && (Object.defineProperty(c, "Promise", n.PromiseProp), o.all = n.all, o.race = n.race, o.resolve = n.resolve, o.reject = n.reject, n.allSettled && (o.allSettled = n.allSettled), n.any && (o.any = n.any))));
      }
      function ds() {
        var t = c.Promise;
        return Wr ? { Promise: t, PromiseProp: Object.getOwnPropertyDescriptor(c, "Promise"), all: t.all, race: t.race, allSettled: t.allSettled, any: t.any, resolve: t.resolve, reject: t.reject } : {};
      }
      function yt(t, n, o, u, l) {
        var f = K;
        try {
          return Je(t, !0), n(o, u, l);
        } finally {
          Je(f, !1);
        }
      }
      function ms(t, n, o, u) {
        return typeof t != "function" ? t : function() {
          var l = K;
          o && Pt(), Je(n, !0);
          try {
            return t.apply(this, arguments);
          } finally {
            Je(l, !1), u && queueMicrotask(Ge);
          }
        };
      }
      function Gr(t) {
        Promise === dt && pe.echoes === 0 ? Hn === 0 ? t() : enqueueNativeMicroTask(t) : setTimeout(t, 0);
      }
      ("" + Ie).indexOf("[native code]") === -1 && (Pt = Ge = ie);
      var ce = q.reject, gt = "￿", We = "Invalid key provided. Keys must be of type string, number, Date or Array<string | number | Date>.", ps = "String expected.", Ft = [], Jn = "__dbnames", Jr = "readonly", Xr = "readwrite";
      function vt(t, n) {
        return t ? n ? function() {
          return t.apply(this, arguments) && n.apply(this, arguments);
        } : t : n;
      }
      var ys = { type: 3, lower: -1 / 0, lowerOpen: !1, upper: [[]], upperOpen: !1 };
      function Xn(t) {
        return typeof t != "string" || /\./.test(t) ? function(n) {
          return n;
        } : function(n) {
          return n[t] === void 0 && t in n && delete (n = lt(n))[t], n;
        };
      }
      function gs() {
        throw z.Type("Entity instances must never be new:ed. Instances are generated by the framework bypassing the constructor.");
      }
      function J(t, n) {
        try {
          var o = vs(t), u = vs(n);
          if (o !== u) return o === "Array" ? 1 : u === "Array" ? -1 : o === "binary" ? 1 : u === "binary" ? -1 : o === "string" ? 1 : u === "string" ? -1 : o === "Date" ? 1 : u !== "Date" ? NaN : -1;
          switch (o) {
            case "number":
            case "Date":
            case "string":
              return n < t ? 1 : t < n ? -1 : 0;
            case "binary":
              return (function(l, f) {
                for (var d = l.length, p = f.length, v = d < p ? d : p, b = 0; b < v; ++b) if (l[b] !== f[b]) return l[b] < f[b] ? -1 : 1;
                return d === p ? 0 : d < p ? -1 : 1;
              })(ws(t), ws(n));
            case "Array":
              return (function(l, f) {
                for (var d = l.length, p = f.length, v = d < p ? d : p, b = 0; b < v; ++b) {
                  var _ = J(l[b], f[b]);
                  if (_ !== 0) return _;
                }
                return d === p ? 0 : d < p ? -1 : 1;
              })(t, n);
          }
        } catch {
        }
        return NaN;
      }
      function vs(t) {
        var n = typeof t;
        return n != "object" ? n : ArrayBuffer.isView(t) ? "binary" : (t = Vr(t), t === "ArrayBuffer" ? "binary" : t);
      }
      function ws(t) {
        return t instanceof Uint8Array ? t : ArrayBuffer.isView(t) ? new Uint8Array(t.buffer, t.byteOffset, t.byteLength) : new Uint8Array(t);
      }
      function Qn(t, n, o) {
        var u = t.schema.yProps;
        return u ? (n && 0 < o.numFailures && (n = n.filter(function(l, f) {
          return !o.failures[f];
        })), Promise.all(u.map(function(l) {
          return l = l.updatesTable, n ? t.db.table(l).where("k").anyOf(n).delete() : t.db.table(l).clear();
        })).then(function() {
          return o;
        })) : o;
      }
      var bs = (se.prototype._trans = function(t, n, o) {
        var u = this._tx || K.trans, l = this.name, f = Ve && typeof console < "u" && console.createTask && console.createTask("Dexie: ".concat(t === "readonly" ? "read" : "write", " ").concat(this.name));
        function d(b, _, g) {
          if (!g.schema[l]) throw new z.NotFound("Table " + l + " not part of transaction");
          return n(g.idbtrans, g);
        }
        var p = Mt();
        try {
          var v = u && u.db._novip === this.db._novip ? u === K.trans ? u._promise(t, d, o) : Ye(function() {
            return u._promise(t, d, o);
          }, { trans: u, transless: K.transless || K }) : (function b(_, g, x, w) {
            if (_.idbdb && (_._state.openComplete || K.letThrough || _._vip)) {
              var k = _._createTransaction(g, x, _._dbSchema);
              try {
                k.create(), _._state.PR1398_maxLoop = 3;
              } catch (T) {
                return T.name === Lr.InvalidState && _.isOpen() && 0 < --_._state.PR1398_maxLoop ? (console.warn("Dexie: Need to reopen db"), _.close({ disableAutoOpen: !1 }), _.open().then(function() {
                  return b(_, g, x, w);
                })) : ce(T);
              }
              return k._promise(g, function(T, S) {
                return Ye(function() {
                  return K.trans = k, w(T, S, k);
                });
              }).then(function(T) {
                if (g === "readwrite") try {
                  k.idbtrans.commit();
                } catch {
                }
                return g === "readonly" ? T : k._completion.then(function() {
                  return T;
                });
              });
            }
            if (_._state.openComplete) return ce(new z.DatabaseClosed(_._state.dbOpenError));
            if (!_._state.isBeingOpened) {
              if (!_._state.autoOpen) return ce(new z.DatabaseClosed());
              _.open().catch(ie);
            }
            return _._state.dbReadyPromise.then(function() {
              return b(_, g, x, w);
            });
          })(this.db, t, [this.name], d);
          return f && (v._consoleTask = f, v = v.catch(function(b) {
            return console.trace(b), ce(b);
          })), v;
        } finally {
          p && Nt();
        }
      }, se.prototype.get = function(t, n) {
        var o = this;
        return t && t.constructor === Object ? this.where(t).first(n) : t == null ? ce(new z.Type("Invalid argument to Table.get()")) : this._trans("readonly", function(u) {
          return o.core.get({ trans: u, key: t }).then(function(l) {
            return o.hook.reading.fire(l);
          });
        }).then(n);
      }, se.prototype.where = function(t) {
        if (typeof t == "string") return new this.db.WhereClause(this, t);
        if (m(t)) return new this.db.WhereClause(this, "[".concat(t.join("+"), "]"));
        var n = h(t);
        if (n.length === 1) return this.where(n[0]).equals(t[n[0]]);
        var o = this.schema.indexes.concat(this.schema.primKey).filter(function(p) {
          if (p.compound && n.every(function(b) {
            return 0 <= p.keyPath.indexOf(b);
          })) {
            for (var v = 0; v < n.length; ++v) if (n.indexOf(p.keyPath[v]) === -1) return !1;
            return !0;
          }
          return !1;
        }).sort(function(p, v) {
          return p.keyPath.length - v.keyPath.length;
        })[0];
        if (o && this.db._maxKey !== gt) {
          var f = o.keyPath.slice(0, n.length);
          return this.where(f).equals(f.map(function(v) {
            return t[v];
          }));
        }
        !o && Ve && console.warn("The query ".concat(JSON.stringify(t), " on ").concat(this.name, " would benefit from a ") + "compound index [".concat(n.join("+"), "]"));
        var u = this.schema.idxByName;
        function l(p, v) {
          return J(p, v) === 0;
        }
        var d = n.reduce(function(g, v) {
          var b = g[0], _ = g[1], g = u[v], x = t[v];
          return [b || g, b || !g ? vt(_, g && g.multi ? function(w) {
            return w = De(w, v), m(w) && w.some(function(k) {
              return l(x, k);
            });
          } : function(w) {
            return l(x, De(w, v));
          }) : _];
        }, [null, null]), f = d[0], d = d[1];
        return f ? this.where(f.name).equals(t[f.keyPath]).filter(d) : o ? this.filter(d) : this.where(n).equals("");
      }, se.prototype.filter = function(t) {
        return this.toCollection().and(t);
      }, se.prototype.count = function(t) {
        return this.toCollection().count(t);
      }, se.prototype.offset = function(t) {
        return this.toCollection().offset(t);
      }, se.prototype.limit = function(t) {
        return this.toCollection().limit(t);
      }, se.prototype.each = function(t) {
        return this.toCollection().each(t);
      }, se.prototype.toArray = function(t) {
        return this.toCollection().toArray(t);
      }, se.prototype.toCollection = function() {
        return new this.db.Collection(new this.db.WhereClause(this));
      }, se.prototype.orderBy = function(t) {
        return new this.db.Collection(new this.db.WhereClause(this, m(t) ? "[".concat(t.join("+"), "]") : t));
      }, se.prototype.reverse = function() {
        return this.toCollection().reverse();
      }, se.prototype.mapToClass = function(t) {
        var n, o = this.db, u = this.name;
        function l() {
          return n !== null && n.apply(this, arguments) || this;
        }
        (this.schema.mappedClass = t).prototype instanceof gs && ((function(v, b) {
          if (typeof b != "function" && b !== null) throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
          function _() {
            this.constructor = v;
          }
          r(v, b), v.prototype = b === null ? Object.create(b) : (_.prototype = b.prototype, new _());
        })(l, n = t), Object.defineProperty(l.prototype, "db", { get: function() {
          return o;
        }, enumerable: !1, configurable: !0 }), l.prototype.table = function() {
          return u;
        }, t = l);
        for (var f = /* @__PURE__ */ new Set(), d = t.prototype; d; d = E(d)) Object.getOwnPropertyNames(d).forEach(function(v) {
          return f.add(v);
        });
        function p(v) {
          if (!v) return v;
          var b, _ = Object.create(t.prototype);
          for (b in v) if (!f.has(b)) try {
            _[b] = v[b];
          } catch {
          }
          return _;
        }
        return this.schema.readHook && this.hook.reading.unsubscribe(this.schema.readHook), this.schema.readHook = p, this.hook("reading", p), t;
      }, se.prototype.defineClass = function() {
        return this.mapToClass(function(t) {
          y(this, t);
        });
      }, se.prototype.add = function(t, n) {
        var o = this, u = this.schema.primKey, l = u.auto, f = u.keyPath, d = t;
        return f && l && (d = Xn(f)(t)), this._trans("readwrite", function(p) {
          return o.core.mutate({ trans: p, type: "add", keys: n != null ? [n] : null, values: [d] });
        }).then(function(p) {
          return p.numFailures ? q.reject(p.failures[0]) : p.lastResult;
        }).then(function(p) {
          if (f) try {
            Se(t, f, p);
          } catch {
          }
          return p;
        });
      }, se.prototype.update = function(t, n) {
        return typeof t != "object" || m(t) ? this.where(":id").equals(t).modify(n) : (t = De(t, this.schema.primKey.keyPath), t === void 0 ? ce(new z.InvalidArgument("Given object does not contain its primary key")) : this.where(":id").equals(t).modify(n));
      }, se.prototype.put = function(t, n) {
        var o = this, u = this.schema.primKey, l = u.auto, f = u.keyPath, d = t;
        return f && l && (d = Xn(f)(t)), this._trans("readwrite", function(p) {
          return o.core.mutate({ trans: p, type: "put", values: [d], keys: n != null ? [n] : null });
        }).then(function(p) {
          return p.numFailures ? q.reject(p.failures[0]) : p.lastResult;
        }).then(function(p) {
          if (f) try {
            Se(t, f, p);
          } catch {
          }
          return p;
        });
      }, se.prototype.delete = function(t) {
        var n = this;
        return this._trans("readwrite", function(o) {
          return n.core.mutate({ trans: o, type: "delete", keys: [t] }).then(function(u) {
            return Qn(n, [t], u);
          }).then(function(u) {
            return u.numFailures ? q.reject(u.failures[0]) : void 0;
          });
        });
      }, se.prototype.clear = function() {
        var t = this;
        return this._trans("readwrite", function(n) {
          return t.core.mutate({ trans: n, type: "deleteRange", range: ys }).then(function(o) {
            return Qn(t, null, o);
          });
        }).then(function(n) {
          return n.numFailures ? q.reject(n.failures[0]) : void 0;
        });
      }, se.prototype.bulkGet = function(t) {
        var n = this;
        return this._trans("readonly", function(o) {
          return n.core.getMany({ keys: t, trans: o }).then(function(u) {
            return u.map(function(l) {
              return n.hook.reading.fire(l);
            });
          });
        });
      }, se.prototype.bulkAdd = function(t, n, o) {
        var u = this, l = Array.isArray(n) ? n : void 0, f = (o = o || (l ? void 0 : n)) ? o.allKeys : void 0;
        return this._trans("readwrite", function(d) {
          var b = u.schema.primKey, p = b.auto, b = b.keyPath;
          if (b && l) throw new z.InvalidArgument("bulkAdd(): keys argument invalid on tables with inbound keys");
          if (l && l.length !== t.length) throw new z.InvalidArgument("Arguments objects and keys must have the same length");
          var v = t.length, b = b && p ? t.map(Xn(b)) : t;
          return u.core.mutate({ trans: d, type: "add", keys: l, values: b, wantResults: f }).then(function(k) {
            var g = k.numFailures, x = k.results, w = k.lastResult, k = k.failures;
            if (g === 0) return f ? x : w;
            throw new Dt("".concat(u.name, ".bulkAdd(): ").concat(g, " of ").concat(v, " operations failed"), k);
          });
        });
      }, se.prototype.bulkPut = function(t, n, o) {
        var u = this, l = Array.isArray(n) ? n : void 0, f = (o = o || (l ? void 0 : n)) ? o.allKeys : void 0;
        return this._trans("readwrite", function(d) {
          var b = u.schema.primKey, p = b.auto, b = b.keyPath;
          if (b && l) throw new z.InvalidArgument("bulkPut(): keys argument invalid on tables with inbound keys");
          if (l && l.length !== t.length) throw new z.InvalidArgument("Arguments objects and keys must have the same length");
          var v = t.length, b = b && p ? t.map(Xn(b)) : t;
          return u.core.mutate({ trans: d, type: "put", keys: l, values: b, wantResults: f }).then(function(k) {
            var g = k.numFailures, x = k.results, w = k.lastResult, k = k.failures;
            if (g === 0) return f ? x : w;
            throw new Dt("".concat(u.name, ".bulkPut(): ").concat(g, " of ").concat(v, " operations failed"), k);
          });
        });
      }, se.prototype.bulkUpdate = function(t) {
        var n = this, o = this.core, u = t.map(function(d) {
          return d.key;
        }), l = t.map(function(d) {
          return d.changes;
        }), f = [];
        return this._trans("readwrite", function(d) {
          return o.getMany({ trans: d, keys: u, cache: "clone" }).then(function(p) {
            var v = [], b = [];
            t.forEach(function(g, x) {
              var w = g.key, k = g.changes, T = p[x];
              if (T) {
                for (var S = 0, O = Object.keys(k); S < O.length; S++) {
                  var I = O[S], A = k[I];
                  if (I === n.schema.primKey.keyPath) {
                    if (J(A, w) !== 0) throw new z.Constraint("Cannot update primary key in bulkUpdate()");
                  } else Se(T, I, A);
                }
                f.push(x), v.push(w), b.push(T);
              }
            });
            var _ = v.length;
            return o.mutate({ trans: d, type: "put", keys: v, values: b, updates: { keys: u, changeSpecs: l } }).then(function(g) {
              var x = g.numFailures, w = g.failures;
              if (x === 0) return _;
              for (var k = 0, T = Object.keys(w); k < T.length; k++) {
                var S, O = T[k], I = f[Number(O)];
                I != null && (S = w[O], delete w[O], w[I] = S);
              }
              throw new Dt("".concat(n.name, ".bulkUpdate(): ").concat(x, " of ").concat(_, " operations failed"), w);
            });
          });
        });
      }, se.prototype.bulkDelete = function(t) {
        var n = this, o = t.length;
        return this._trans("readwrite", function(u) {
          return n.core.mutate({ trans: u, type: "delete", keys: t }).then(function(l) {
            return Qn(n, t, l);
          });
        }).then(function(d) {
          var l = d.numFailures, f = d.lastResult, d = d.failures;
          if (l === 0) return f;
          throw new Dt("".concat(n.name, ".bulkDelete(): ").concat(l, " of ").concat(o, " operations failed"), d);
        });
      }, se);
      function se() {
      }
      function mn(t) {
        function n(d, p) {
          if (p) {
            for (var v = arguments.length, b = new Array(v - 1); --v; ) b[v - 1] = arguments[v];
            return o[d].subscribe.apply(null, b), t;
          }
          if (typeof d == "string") return o[d];
        }
        var o = {};
        n.addEventType = f;
        for (var u = 1, l = arguments.length; u < l; ++u) f(arguments[u]);
        return n;
        function f(d, p, v) {
          if (typeof d != "object") {
            var b;
            p = p || Qa;
            var _ = { subscribers: [], fire: v = v || ie, subscribe: function(g) {
              _.subscribers.indexOf(g) === -1 && (_.subscribers.push(g), _.fire = p(_.fire, g));
            }, unsubscribe: function(g) {
              _.subscribers = _.subscribers.filter(function(x) {
                return x !== g;
              }), _.fire = _.subscribers.reduce(p, v);
            } };
            return o[d] = n[d] = _;
          }
          h(b = d).forEach(function(g) {
            var x = b[g];
            if (m(x)) f(g, b[g][0], b[g][1]);
            else {
              if (x !== "asap") throw new z.InvalidArgument("Invalid event config");
              var w = f(g, ln, function() {
                for (var k = arguments.length, T = new Array(k); k--; ) T[k] = arguments[k];
                w.subscribers.forEach(function(S) {
                  an(function() {
                    S.apply(null, T);
                  });
                });
              });
            }
          });
        }
      }
      function pn(t, n) {
        return me(n).from({ prototype: t }), n;
      }
      function Rt(t, n) {
        return !(t.filter || t.algorithm || t.or) && (n ? t.justLimit : !t.replayFilter);
      }
      function Qr(t, n) {
        t.filter = vt(t.filter, n);
      }
      function ei(t, n, o) {
        var u = t.replayFilter;
        t.replayFilter = u ? function() {
          return vt(u(), n());
        } : n, t.justLimit = o && !u;
      }
      function er(t, n) {
        if (t.isPrimKey) return n.primaryKey;
        var o = n.getIndexByKeyPath(t.index);
        if (!o) throw new z.Schema("KeyPath " + t.index + " on object store " + n.name + " is not indexed");
        return o;
      }
      function ks(t, n, o) {
        var u = er(t, n.schema);
        return n.openCursor({ trans: o, values: !t.keysOnly, reverse: t.dir === "prev", unique: !!t.unique, query: { index: u, range: t.range } });
      }
      function tr(t, n, o, u) {
        var l = t.replayFilter ? vt(t.filter, t.replayFilter()) : t.filter;
        if (t.or) {
          var f = {}, d = function(p, v, b) {
            var _, g;
            l && !l(v, b, function(x) {
              return v.stop(x);
            }, function(x) {
              return v.fail(x);
            }) || ((g = "" + (_ = v.primaryKey)) == "[object ArrayBuffer]" && (g = "" + new Uint8Array(_)), C(f, g) || (f[g] = !0, n(p, v, b)));
          };
          return Promise.all([t.or._iterate(d, o), _s(ks(t, u, o), t.algorithm, d, !t.keysOnly && t.valueMapper)]);
        }
        return _s(ks(t, u, o), vt(t.algorithm, l), n, !t.keysOnly && t.valueMapper);
      }
      function _s(t, n, o, u) {
        var l = oe(u ? function(f, d, p) {
          return o(u(f), d, p);
        } : o);
        return t.then(function(f) {
          if (f) return f.start(function() {
            var d = function() {
              return f.continue();
            };
            n && !n(f, function(p) {
              return d = p;
            }, function(p) {
              f.stop(p), d = ie;
            }, function(p) {
              f.fail(p), d = ie;
            }) || l(f.value, f, function(p) {
              return d = p;
            }), d();
          });
        });
      }
      var yn = (Ss.prototype.execute = function(t) {
        var n = this["@@propmod"];
        if (n.add !== void 0) {
          var o = n.add;
          if (m(o)) return a(a([], m(t) ? t : [], !0), o).sort();
          if (typeof o == "number") return (Number(t) || 0) + o;
          if (typeof o == "bigint") try {
            return BigInt(t) + o;
          } catch {
            return BigInt(0) + o;
          }
          throw new TypeError("Invalid term ".concat(o));
        }
        if (n.remove !== void 0) {
          var u = n.remove;
          if (m(u)) return m(t) ? t.filter(function(l) {
            return !u.includes(l);
          }).sort() : [];
          if (typeof u == "number") return Number(t) - u;
          if (typeof u == "bigint") try {
            return BigInt(t) - u;
          } catch {
            return BigInt(0) - u;
          }
          throw new TypeError("Invalid subtrahend ".concat(u));
        }
        return o = (o = n.replacePrefix) === null || o === void 0 ? void 0 : o[0], o && typeof t == "string" && t.startsWith(o) ? n.replacePrefix[1] + t.substring(o.length) : t;
      }, Ss);
      function Ss(t) {
        this["@@propmod"] = t;
      }
      var su = (te.prototype._read = function(t, n) {
        var o = this._ctx;
        return o.error ? o.table._trans(null, ce.bind(null, o.error)) : o.table._trans("readonly", t).then(n);
      }, te.prototype._write = function(t) {
        var n = this._ctx;
        return n.error ? n.table._trans(null, ce.bind(null, n.error)) : n.table._trans("readwrite", t, "locked");
      }, te.prototype._addAlgorithm = function(t) {
        var n = this._ctx;
        n.algorithm = vt(n.algorithm, t);
      }, te.prototype._iterate = function(t, n) {
        return tr(this._ctx, t, n, this._ctx.table.core);
      }, te.prototype.clone = function(t) {
        var n = Object.create(this.constructor.prototype), o = Object.create(this._ctx);
        return t && y(o, t), n._ctx = o, n;
      }, te.prototype.raw = function() {
        return this._ctx.valueMapper = null, this;
      }, te.prototype.each = function(t) {
        var n = this._ctx;
        return this._read(function(o) {
          return tr(n, t, o, n.table.core);
        });
      }, te.prototype.count = function(t) {
        var n = this;
        return this._read(function(o) {
          var u = n._ctx, l = u.table.core;
          if (Rt(u, !0)) return l.count({ trans: o, query: { index: er(u, l.schema), range: u.range } }).then(function(d) {
            return Math.min(d, u.limit);
          });
          var f = 0;
          return tr(u, function() {
            return ++f, !1;
          }, o, l).then(function() {
            return f;
          });
        }).then(t);
      }, te.prototype.sortBy = function(t, n) {
        var o = t.split(".").reverse(), u = o[0], l = o.length - 1;
        function f(v, b) {
          return b ? f(v[o[b]], b - 1) : v[u];
        }
        var d = this._ctx.dir === "next" ? 1 : -1;
        function p(v, b) {
          return J(f(v, l), f(b, l)) * d;
        }
        return this.toArray(function(v) {
          return v.sort(p);
        }).then(n);
      }, te.prototype.toArray = function(t) {
        var n = this;
        return this._read(function(o) {
          var u = n._ctx;
          if (u.dir === "next" && Rt(u, !0) && 0 < u.limit) {
            var l = u.valueMapper, f = er(u, u.table.core.schema);
            return u.table.core.query({ trans: o, limit: u.limit, values: !0, query: { index: f, range: u.range } }).then(function(p) {
              return p = p.result, l ? p.map(l) : p;
            });
          }
          var d = [];
          return tr(u, function(p) {
            return d.push(p);
          }, o, u.table.core).then(function() {
            return d;
          });
        }, t);
      }, te.prototype.offset = function(t) {
        var n = this._ctx;
        return t <= 0 || (n.offset += t, Rt(n) ? ei(n, function() {
          var o = t;
          return function(u, l) {
            return o === 0 || (o === 1 ? --o : l(function() {
              u.advance(o), o = 0;
            }), !1);
          };
        }) : ei(n, function() {
          var o = t;
          return function() {
            return --o < 0;
          };
        })), this;
      }, te.prototype.limit = function(t) {
        return this._ctx.limit = Math.min(this._ctx.limit, t), ei(this._ctx, function() {
          var n = t;
          return function(o, u, l) {
            return --n <= 0 && u(l), 0 <= n;
          };
        }, !0), this;
      }, te.prototype.until = function(t, n) {
        return Qr(this._ctx, function(o, u, l) {
          return !t(o.value) || (u(l), n);
        }), this;
      }, te.prototype.first = function(t) {
        return this.limit(1).toArray(function(n) {
          return n[0];
        }).then(t);
      }, te.prototype.last = function(t) {
        return this.reverse().first(t);
      }, te.prototype.filter = function(t) {
        var n;
        return Qr(this._ctx, function(o) {
          return t(o.value);
        }), (n = this._ctx).isMatch = vt(n.isMatch, t), this;
      }, te.prototype.and = function(t) {
        return this.filter(t);
      }, te.prototype.or = function(t) {
        return new this.db.WhereClause(this._ctx.table, t, this);
      }, te.prototype.reverse = function() {
        return this._ctx.dir = this._ctx.dir === "prev" ? "next" : "prev", this._ondirectionchange && this._ondirectionchange(this._ctx.dir), this;
      }, te.prototype.desc = function() {
        return this.reverse();
      }, te.prototype.eachKey = function(t) {
        var n = this._ctx;
        return n.keysOnly = !n.isMatch, this.each(function(o, u) {
          t(u.key, u);
        });
      }, te.prototype.eachUniqueKey = function(t) {
        return this._ctx.unique = "unique", this.eachKey(t);
      }, te.prototype.eachPrimaryKey = function(t) {
        var n = this._ctx;
        return n.keysOnly = !n.isMatch, this.each(function(o, u) {
          t(u.primaryKey, u);
        });
      }, te.prototype.keys = function(t) {
        var n = this._ctx;
        n.keysOnly = !n.isMatch;
        var o = [];
        return this.each(function(u, l) {
          o.push(l.key);
        }).then(function() {
          return o;
        }).then(t);
      }, te.prototype.primaryKeys = function(t) {
        var n = this._ctx;
        if (n.dir === "next" && Rt(n, !0) && 0 < n.limit) return this._read(function(u) {
          var l = er(n, n.table.core.schema);
          return n.table.core.query({ trans: u, values: !1, limit: n.limit, query: { index: l, range: n.range } });
        }).then(function(u) {
          return u.result;
        }).then(t);
        n.keysOnly = !n.isMatch;
        var o = [];
        return this.each(function(u, l) {
          o.push(l.primaryKey);
        }).then(function() {
          return o;
        }).then(t);
      }, te.prototype.uniqueKeys = function(t) {
        return this._ctx.unique = "unique", this.keys(t);
      }, te.prototype.firstKey = function(t) {
        return this.limit(1).keys(function(n) {
          return n[0];
        }).then(t);
      }, te.prototype.lastKey = function(t) {
        return this.reverse().firstKey(t);
      }, te.prototype.distinct = function() {
        var t = this._ctx, t = t.index && t.table.schema.idxByName[t.index];
        if (!t || !t.multi) return this;
        var n = {};
        return Qr(this._ctx, function(l) {
          var u = l.primaryKey.toString(), l = C(n, u);
          return n[u] = !0, !l;
        }), this;
      }, te.prototype.modify = function(t) {
        var n = this, o = this._ctx;
        return this._write(function(u) {
          var l, f, d;
          d = typeof t == "function" ? t : (l = h(t), f = l.length, function(O) {
            for (var I = !1, A = 0; A < f; ++A) {
              var $ = l[A], D = t[$], F = De(O, $);
              D instanceof yn ? (Se(O, $, D.execute(F)), I = !0) : F !== D && (Se(O, $, D), I = !0);
            }
            return I;
          });
          var p = o.table.core, g = p.schema.primaryKey, v = g.outbound, b = g.extractKey, _ = 200, g = n.db._options.modifyChunkSize;
          g && (_ = typeof g == "object" ? g[p.name] || g["*"] || 200 : g);
          function x(O, $) {
            var A = $.failures, $ = $.numFailures;
            k += O - $;
            for (var D = 0, F = h(A); D < F.length; D++) {
              var M = F[D];
              w.push(A[M]);
            }
          }
          var w = [], k = 0, T = [], S = t === Ts;
          return n.clone().primaryKeys().then(function(O) {
            function I($) {
              var D = Math.min(_, O.length - $), F = O.slice($, $ + D);
              return (S ? Promise.resolve([]) : p.getMany({ trans: u, keys: F, cache: "immutable" })).then(function(M) {
                var P = [], V = [], R = v ? [] : null, L = S ? F : [];
                if (!S) for (var G = 0; G < D; ++G) {
                  var Q = M[G], Y = { value: lt(Q), primKey: O[$ + G] };
                  d.call(Y, Y.value, Y) !== !1 && (Y.value == null ? L.push(O[$ + G]) : v || J(b(Q), b(Y.value)) === 0 ? (V.push(Y.value), v && R.push(O[$ + G])) : (L.push(O[$ + G]), P.push(Y.value)));
                }
                return Promise.resolve(0 < P.length && p.mutate({ trans: u, type: "add", values: P }).then(function(le) {
                  for (var H in le.failures) L.splice(parseInt(H), 1);
                  x(P.length, le);
                })).then(function() {
                  return (0 < V.length || A && typeof t == "object") && p.mutate({ trans: u, type: "put", keys: R, values: V, criteria: A, changeSpec: typeof t != "function" && t, isAdditionalChunk: 0 < $ }).then(function(le) {
                    return x(V.length, le);
                  });
                }).then(function() {
                  return (0 < L.length || A && S) && p.mutate({ trans: u, type: "delete", keys: L, criteria: A, isAdditionalChunk: 0 < $ }).then(function(le) {
                    return Qn(o.table, L, le);
                  }).then(function(le) {
                    return x(L.length, le);
                  });
                }).then(function() {
                  return O.length > $ + D && I($ + _);
                });
              });
            }
            var A = Rt(o) && o.limit === 1 / 0 && (typeof t != "function" || S) && { index: o.index, range: o.range };
            return I(0).then(function() {
              if (0 < w.length) throw new Ln("Error modifying one or more objects", w, k, T);
              return O.length;
            });
          });
        });
      }, te.prototype.delete = function() {
        var t = this._ctx, n = t.range;
        return !Rt(t) || t.table.schema.yProps || !t.isPrimKey && n.type !== 3 ? this.modify(Ts) : this._write(function(o) {
          var u = t.table.core.schema.primaryKey, l = n;
          return t.table.core.count({ trans: o, query: { index: u, range: l } }).then(function(f) {
            return t.table.core.mutate({ trans: o, type: "deleteRange", range: l }).then(function(v) {
              var p = v.failures, v = v.numFailures;
              if (v) throw new Ln("Could not delete some values", Object.keys(p).map(function(b) {
                return p[b];
              }), f - v);
              return f - v;
            });
          });
        });
      }, te);
      function te() {
      }
      var Ts = function(t, n) {
        return n.value = null;
      };
      function ou(t, n) {
        return t < n ? -1 : t === n ? 0 : 1;
      }
      function au(t, n) {
        return n < t ? -1 : t === n ? 0 : 1;
      }
      function xe(t, n, o) {
        return t = t instanceof Os ? new t.Collection(t) : t, t._ctx.error = new (o || TypeError)(n), t;
      }
      function Vt(t) {
        return new t.Collection(t, function() {
          return xs("");
        }).limit(0);
      }
      function nr(t, n, o, u) {
        var l, f, d, p, v, b, _, g = o.length;
        if (!o.every(function(k) {
          return typeof k == "string";
        })) return xe(t, ps);
        function x(k) {
          l = k === "next" ? function(S) {
            return S.toUpperCase();
          } : function(S) {
            return S.toLowerCase();
          }, f = k === "next" ? function(S) {
            return S.toLowerCase();
          } : function(S) {
            return S.toUpperCase();
          }, d = k === "next" ? ou : au;
          var T = o.map(function(S) {
            return { lower: f(S), upper: l(S) };
          }).sort(function(S, O) {
            return d(S.lower, O.lower);
          });
          p = T.map(function(S) {
            return S.upper;
          }), v = T.map(function(S) {
            return S.lower;
          }), _ = (b = k) === "next" ? "" : u;
        }
        x("next"), t = new t.Collection(t, function() {
          return Xe(p[0], v[g - 1] + u);
        }), t._ondirectionchange = function(k) {
          x(k);
        };
        var w = 0;
        return t._addAlgorithm(function(k, T, S) {
          var O = k.key;
          if (typeof O != "string") return !1;
          var I = f(O);
          if (n(I, v, w)) return !0;
          for (var A = null, $ = w; $ < g; ++$) {
            var D = (function(F, M, P, V, R, L) {
              for (var G = Math.min(F.length, V.length), Q = -1, Y = 0; Y < G; ++Y) {
                var le = M[Y];
                if (le !== V[Y]) return R(F[Y], P[Y]) < 0 ? F.substr(0, Y) + P[Y] + P.substr(Y + 1) : R(F[Y], V[Y]) < 0 ? F.substr(0, Y) + V[Y] + P.substr(Y + 1) : 0 <= Q ? F.substr(0, Q) + M[Q] + P.substr(Q + 1) : null;
                R(F[Y], le) < 0 && (Q = Y);
              }
              return G < V.length && L === "next" ? F + P.substr(F.length) : G < F.length && L === "prev" ? F.substr(0, P.length) : Q < 0 ? null : F.substr(0, Q) + V[Q] + P.substr(Q + 1);
            })(O, I, p[$], v[$], d, b);
            D === null && A === null ? w = $ + 1 : (A === null || 0 < d(A, D)) && (A = D);
          }
          return T(A !== null ? function() {
            k.continue(A + _);
          } : S), !1;
        }), t;
      }
      function Xe(t, n, o, u) {
        return { type: 2, lower: t, upper: n, lowerOpen: o, upperOpen: u };
      }
      function xs(t) {
        return { type: 1, lower: t, upper: t };
      }
      var Os = (Object.defineProperty(ye.prototype, "Collection", { get: function() {
        return this._ctx.table.db.Collection;
      }, enumerable: !1, configurable: !0 }), ye.prototype.between = function(t, n, o, u) {
        o = o !== !1, u = u === !0;
        try {
          return 0 < this._cmp(t, n) || this._cmp(t, n) === 0 && (o || u) && (!o || !u) ? Vt(this) : new this.Collection(this, function() {
            return Xe(t, n, !o, !u);
          });
        } catch {
          return xe(this, We);
        }
      }, ye.prototype.equals = function(t) {
        return t == null ? xe(this, We) : new this.Collection(this, function() {
          return xs(t);
        });
      }, ye.prototype.above = function(t) {
        return t == null ? xe(this, We) : new this.Collection(this, function() {
          return Xe(t, void 0, !0);
        });
      }, ye.prototype.aboveOrEqual = function(t) {
        return t == null ? xe(this, We) : new this.Collection(this, function() {
          return Xe(t, void 0, !1);
        });
      }, ye.prototype.below = function(t) {
        return t == null ? xe(this, We) : new this.Collection(this, function() {
          return Xe(void 0, t, !1, !0);
        });
      }, ye.prototype.belowOrEqual = function(t) {
        return t == null ? xe(this, We) : new this.Collection(this, function() {
          return Xe(void 0, t);
        });
      }, ye.prototype.startsWith = function(t) {
        return typeof t != "string" ? xe(this, ps) : this.between(t, t + gt, !0, !0);
      }, ye.prototype.startsWithIgnoreCase = function(t) {
        return t === "" ? this.startsWith(t) : nr(this, function(n, o) {
          return n.indexOf(o[0]) === 0;
        }, [t], gt);
      }, ye.prototype.equalsIgnoreCase = function(t) {
        return nr(this, function(n, o) {
          return n === o[0];
        }, [t], "");
      }, ye.prototype.anyOfIgnoreCase = function() {
        var t = je.apply($t, arguments);
        return t.length === 0 ? Vt(this) : nr(this, function(n, o) {
          return o.indexOf(n) !== -1;
        }, t, "");
      }, ye.prototype.startsWithAnyOfIgnoreCase = function() {
        var t = je.apply($t, arguments);
        return t.length === 0 ? Vt(this) : nr(this, function(n, o) {
          return o.some(function(u) {
            return n.indexOf(u) === 0;
          });
        }, t, gt);
      }, ye.prototype.anyOf = function() {
        var t = this, n = je.apply($t, arguments), o = this._cmp;
        try {
          n.sort(o);
        } catch {
          return xe(this, We);
        }
        if (n.length === 0) return Vt(this);
        var u = new this.Collection(this, function() {
          return Xe(n[0], n[n.length - 1]);
        });
        u._ondirectionchange = function(f) {
          o = f === "next" ? t._ascending : t._descending, n.sort(o);
        };
        var l = 0;
        return u._addAlgorithm(function(f, d, p) {
          for (var v = f.key; 0 < o(v, n[l]); ) if (++l === n.length) return d(p), !1;
          return o(v, n[l]) === 0 || (d(function() {
            f.continue(n[l]);
          }), !1);
        }), u;
      }, ye.prototype.notEqual = function(t) {
        return this.inAnyRange([[-1 / 0, t], [t, this.db._maxKey]], { includeLowers: !1, includeUppers: !1 });
      }, ye.prototype.noneOf = function() {
        var t = je.apply($t, arguments);
        if (t.length === 0) return new this.Collection(this);
        try {
          t.sort(this._ascending);
        } catch {
          return xe(this, We);
        }
        var n = t.reduce(function(o, u) {
          return o ? o.concat([[o[o.length - 1][1], u]]) : [[-1 / 0, u]];
        }, null);
        return n.push([t[t.length - 1], this.db._maxKey]), this.inAnyRange(n, { includeLowers: !1, includeUppers: !1 });
      }, ye.prototype.inAnyRange = function(O, n) {
        var o = this, u = this._cmp, l = this._ascending, f = this._descending, d = this._min, p = this._max;
        if (O.length === 0) return Vt(this);
        if (!O.every(function(I) {
          return I[0] !== void 0 && I[1] !== void 0 && l(I[0], I[1]) <= 0;
        })) return xe(this, "First argument to inAnyRange() must be an Array of two-value Arrays [lower,upper] where upper must not be lower than lower", z.InvalidArgument);
        var v = !n || n.includeLowers !== !1, b = n && n.includeUppers === !0, _, g = l;
        function x(I, A) {
          return g(I[0], A[0]);
        }
        try {
          (_ = O.reduce(function(I, A) {
            for (var $ = 0, D = I.length; $ < D; ++$) {
              var F = I[$];
              if (u(A[0], F[1]) < 0 && 0 < u(A[1], F[0])) {
                F[0] = d(F[0], A[0]), F[1] = p(F[1], A[1]);
                break;
              }
            }
            return $ === D && I.push(A), I;
          }, [])).sort(x);
        } catch {
          return xe(this, We);
        }
        var w = 0, k = b ? function(I) {
          return 0 < l(I, _[w][1]);
        } : function(I) {
          return 0 <= l(I, _[w][1]);
        }, T = v ? function(I) {
          return 0 < f(I, _[w][0]);
        } : function(I) {
          return 0 <= f(I, _[w][0]);
        }, S = k, O = new this.Collection(this, function() {
          return Xe(_[0][0], _[_.length - 1][1], !v, !b);
        });
        return O._ondirectionchange = function(I) {
          g = I === "next" ? (S = k, l) : (S = T, f), _.sort(x);
        }, O._addAlgorithm(function(I, A, $) {
          for (var D, F = I.key; S(F); ) if (++w === _.length) return A($), !1;
          return !k(D = F) && !T(D) || (o._cmp(F, _[w][1]) === 0 || o._cmp(F, _[w][0]) === 0 || A(function() {
            g === l ? I.continue(_[w][0]) : I.continue(_[w][1]);
          }), !1);
        }), O;
      }, ye.prototype.startsWithAnyOf = function() {
        var t = je.apply($t, arguments);
        return t.every(function(n) {
          return typeof n == "string";
        }) ? t.length === 0 ? Vt(this) : this.inAnyRange(t.map(function(n) {
          return [n, n + gt];
        })) : xe(this, "startsWithAnyOf() only works with strings");
      }, ye);
      function ye() {
      }
      function Ue(t) {
        return oe(function(n) {
          return gn(n), t(n.target.error), !1;
        });
      }
      function gn(t) {
        t.stopPropagation && t.stopPropagation(), t.preventDefault && t.preventDefault();
      }
      var vn = "storagemutated", ti = "x-storagemutated-1", Qe = mn(null, vn), uu = (qe.prototype._lock = function() {
        return at(!K.global), ++this._reculock, this._reculock !== 1 || K.global || (K.lockOwnerFor = this), this;
      }, qe.prototype._unlock = function() {
        if (at(!K.global), --this._reculock == 0) for (K.global || (K.lockOwnerFor = null); 0 < this._blockedFuncs.length && !this._locked(); ) {
          var t = this._blockedFuncs.shift();
          try {
            yt(t[1], t[0]);
          } catch {
          }
        }
        return this;
      }, qe.prototype._locked = function() {
        return this._reculock && K.lockOwnerFor !== this;
      }, qe.prototype.create = function(t) {
        var n = this;
        if (!this.mode) return this;
        var o = this.db.idbdb, u = this.db._state.dbOpenError;
        if (at(!this.idbtrans), !t && !o) switch (u && u.name) {
          case "DatabaseClosedError":
            throw new z.DatabaseClosed(u);
          case "MissingAPIError":
            throw new z.MissingAPI(u.message, u);
          default:
            throw new z.OpenFailed(u);
        }
        if (!this.active) throw new z.TransactionInactive();
        return at(this._completion._state === null), (t = this.idbtrans = t || (this.db.core || o).transaction(this.storeNames, this.mode, { durability: this.chromeTransactionDurability })).onerror = oe(function(l) {
          gn(l), n._reject(t.error);
        }), t.onabort = oe(function(l) {
          gn(l), n.active && n._reject(new z.Abort(t.error)), n.active = !1, n.on("abort").fire(l);
        }), t.oncomplete = oe(function() {
          n.active = !1, n._resolve(), "mutatedParts" in t && Qe.storagemutated.fire(t.mutatedParts);
        }), this;
      }, qe.prototype._promise = function(t, n, o) {
        var u = this;
        if (t === "readwrite" && this.mode !== "readwrite") return ce(new z.ReadOnly("Transaction is readonly"));
        if (!this.active) return ce(new z.TransactionInactive());
        if (this._locked()) return new q(function(f, d) {
          u._blockedFuncs.push([function() {
            u._promise(t, n, o).then(f, d);
          }, K]);
        });
        if (o) return Ye(function() {
          var f = new q(function(d, p) {
            u._lock();
            var v = n(d, p, u);
            v && v.then && v.then(d, p);
          });
          return f.finally(function() {
            return u._unlock();
          }), f._lib = !0, f;
        });
        var l = new q(function(f, d) {
          var p = n(f, d, u);
          p && p.then && p.then(f, d);
        });
        return l._lib = !0, l;
      }, qe.prototype._root = function() {
        return this.parent ? this.parent._root() : this;
      }, qe.prototype.waitFor = function(t) {
        var n, o = this._root(), u = q.resolve(t);
        o._waitingFor ? o._waitingFor = o._waitingFor.then(function() {
          return u;
        }) : (o._waitingFor = u, o._waitingQueue = [], n = o.idbtrans.objectStore(o.storeNames[0]), (function f() {
          for (++o._spinCount; o._waitingQueue.length; ) o._waitingQueue.shift()();
          o._waitingFor && (n.get(-1 / 0).onsuccess = f);
        })());
        var l = o._waitingFor;
        return new q(function(f, d) {
          u.then(function(p) {
            return o._waitingQueue.push(oe(f.bind(null, p)));
          }, function(p) {
            return o._waitingQueue.push(oe(d.bind(null, p)));
          }).finally(function() {
            o._waitingFor === l && (o._waitingFor = null);
          });
        });
      }, qe.prototype.abort = function() {
        this.active && (this.active = !1, this.idbtrans && this.idbtrans.abort(), this._reject(new z.Abort()));
      }, qe.prototype.table = function(t) {
        var n = this._memoizedTables || (this._memoizedTables = {});
        if (C(n, t)) return n[t];
        var o = this.schema[t];
        if (!o) throw new z.NotFound("Table " + t + " not part of transaction");
        return o = new this.db.Table(t, o, this), o.core = this.db.core.table(t), n[t] = o;
      }, qe);
      function qe() {
      }
      function ni(t, n, o, u, l, f, d, p) {
        return { name: t, keyPath: n, unique: o, multi: u, auto: l, compound: f, src: (o && !d ? "&" : "") + (u ? "*" : "") + (l ? "++" : "") + Es(n), type: p };
      }
      function Es(t) {
        return typeof t == "string" ? t : t ? "[" + [].join.call(t, "+") + "]" : "";
      }
      function ri(t, n, o) {
        return { name: t, primKey: n, indexes: o, mappedClass: null, idxByName: (u = function(l) {
          return [l.name, l];
        }, o.reduce(function(l, f, d) {
          return d = u(f, d), d && (l[d[0]] = d[1]), l;
        }, {})) };
        var u;
      }
      var wn = function(t) {
        try {
          return t.only([[]]), wn = function() {
            return [[]];
          }, [[]];
        } catch {
          return wn = function() {
            return gt;
          }, gt;
        }
      };
      function ii(t) {
        return t == null ? function() {
        } : typeof t == "string" ? (n = t).split(".").length === 1 ? function(o) {
          return o[n];
        } : function(o) {
          return De(o, n);
        } : function(o) {
          return De(o, t);
        };
        var n;
      }
      function Is(t) {
        return [].slice.call(t);
      }
      var lu = 0;
      function bn(t) {
        return t == null ? ":id" : typeof t == "string" ? t : "[".concat(t.join("+"), "]");
      }
      function cu(t, n, v) {
        function u(S) {
          if (S.type === 3) return null;
          if (S.type === 4) throw new Error("Cannot convert never type to IDBKeyRange");
          var w = S.lower, k = S.upper, T = S.lowerOpen, S = S.upperOpen;
          return w === void 0 ? k === void 0 ? null : n.upperBound(k, !!S) : k === void 0 ? n.lowerBound(w, !!T) : n.bound(w, k, !!T, !!S);
        }
        function l(x) {
          var w, k = x.name;
          return { name: k, schema: x, mutate: function(T) {
            var S = T.trans, O = T.type, I = T.keys, A = T.values, $ = T.range;
            return new Promise(function(D, F) {
              D = oe(D);
              var M = S.objectStore(k), P = M.keyPath == null, V = O === "put" || O === "add";
              if (!V && O !== "delete" && O !== "deleteRange") throw new Error("Invalid operation type: " + O);
              var R, L = (I || A || { length: 1 }).length;
              if (I && A && I.length !== A.length) throw new Error("Given keys array must have same length as given values array.");
              if (L === 0) return D({ numFailures: 0, failures: {}, results: [], lastResult: void 0 });
              function G(Te) {
                ++le, gn(Te);
              }
              var Q = [], Y = [], le = 0;
              if (O === "deleteRange") {
                if ($.type === 4) return D({ numFailures: le, failures: Y, results: [], lastResult: void 0 });
                $.type === 3 ? Q.push(R = M.clear()) : Q.push(R = M.delete(u($)));
              } else {
                var P = V ? P ? [A, I] : [A, null] : [I, null], H = P[0], ve = P[1];
                if (V) for (var we = 0; we < L; ++we) Q.push(R = ve && ve[we] !== void 0 ? M[O](H[we], ve[we]) : M[O](H[we])), R.onerror = G;
                else for (we = 0; we < L; ++we) Q.push(R = M[O](H[we])), R.onerror = G;
              }
              function mr(Te) {
                Te = Te.target.result, Q.forEach(function(kt, _i) {
                  return kt.error != null && (Y[_i] = kt.error);
                }), D({ numFailures: le, failures: Y, results: O === "delete" ? I : Q.map(function(kt) {
                  return kt.result;
                }), lastResult: Te });
              }
              R.onerror = function(Te) {
                G(Te), mr(Te);
              }, R.onsuccess = mr;
            });
          }, getMany: function(T) {
            var S = T.trans, O = T.keys;
            return new Promise(function(I, A) {
              I = oe(I);
              for (var $, D = S.objectStore(k), F = O.length, M = new Array(F), P = 0, V = 0, R = function(Q) {
                Q = Q.target, M[Q._pos] = Q.result, ++V === P && I(M);
              }, L = Ue(A), G = 0; G < F; ++G) O[G] != null && (($ = D.get(O[G]))._pos = G, $.onsuccess = R, $.onerror = L, ++P);
              P === 0 && I(M);
            });
          }, get: function(T) {
            var S = T.trans, O = T.key;
            return new Promise(function(I, A) {
              I = oe(I);
              var $ = S.objectStore(k).get(O);
              $.onsuccess = function(D) {
                return I(D.target.result);
              }, $.onerror = Ue(A);
            });
          }, query: (w = b, function(T) {
            return new Promise(function(S, O) {
              S = oe(S);
              var I, A, $, P = T.trans, D = T.values, F = T.limit, R = T.query, M = F === 1 / 0 ? void 0 : F, V = R.index, R = R.range, P = P.objectStore(k), V = V.isPrimaryKey ? P : P.index(V.name), R = u(R);
              if (F === 0) return S({ result: [] });
              w ? ((M = D ? V.getAll(R, M) : V.getAllKeys(R, M)).onsuccess = function(L) {
                return S({ result: L.target.result });
              }, M.onerror = Ue(O)) : (I = 0, A = !D && "openKeyCursor" in V ? V.openKeyCursor(R) : V.openCursor(R), $ = [], A.onsuccess = function(L) {
                var G = A.result;
                return G ? ($.push(D ? G.value : G.primaryKey), ++I === F ? S({ result: $ }) : void G.continue()) : S({ result: $ });
              }, A.onerror = Ue(O));
            });
          }), openCursor: function(T) {
            var S = T.trans, O = T.values, I = T.query, A = T.reverse, $ = T.unique;
            return new Promise(function(D, F) {
              D = oe(D);
              var V = I.index, M = I.range, P = S.objectStore(k), P = V.isPrimaryKey ? P : P.index(V.name), V = A ? $ ? "prevunique" : "prev" : $ ? "nextunique" : "next", R = !O && "openKeyCursor" in P ? P.openKeyCursor(u(M), V) : P.openCursor(u(M), V);
              R.onerror = Ue(F), R.onsuccess = oe(function(L) {
                var G, Q, Y, le, H = R.result;
                H ? (H.___id = ++lu, H.done = !1, G = H.continue.bind(H), Q = (Q = H.continuePrimaryKey) && Q.bind(H), Y = H.advance.bind(H), le = function() {
                  throw new Error("Cursor not stopped");
                }, H.trans = S, H.stop = H.continue = H.continuePrimaryKey = H.advance = function() {
                  throw new Error("Cursor not started");
                }, H.fail = oe(F), H.next = function() {
                  var ve = this, we = 1;
                  return this.start(function() {
                    return we-- ? ve.continue() : ve.stop();
                  }).then(function() {
                    return ve;
                  });
                }, H.start = function(ve) {
                  function we() {
                    if (R.result) try {
                      ve();
                    } catch (Te) {
                      H.fail(Te);
                    }
                    else H.done = !0, H.start = function() {
                      throw new Error("Cursor behind last entry");
                    }, H.stop();
                  }
                  var mr = new Promise(function(Te, kt) {
                    Te = oe(Te), R.onerror = Ue(kt), H.fail = kt, H.stop = function(_i) {
                      H.stop = H.continue = H.continuePrimaryKey = H.advance = le, Te(_i);
                    };
                  });
                  return R.onsuccess = oe(function(Te) {
                    R.onsuccess = we, we();
                  }), H.continue = G, H.continuePrimaryKey = Q, H.advance = Y, we(), mr;
                }, D(H)) : D(null);
              }, F);
            });
          }, count: function(T) {
            var S = T.query, O = T.trans, I = S.index, A = S.range;
            return new Promise(function($, D) {
              var F = O.objectStore(k), M = I.isPrimaryKey ? F : F.index(I.name), F = u(A), M = F ? M.count(F) : M.count();
              M.onsuccess = oe(function(P) {
                return $(P.target.result);
              }), M.onerror = Ue(D);
            });
          } };
        }
        var f, d, p, _ = (d = v, p = Is((f = t).objectStoreNames), { schema: { name: f.name, tables: p.map(function(x) {
          return d.objectStore(x);
        }).map(function(x) {
          var w = x.keyPath, S = x.autoIncrement, k = m(w), T = {}, S = { name: x.name, primaryKey: { name: null, isPrimaryKey: !0, outbound: w == null, compound: k, keyPath: w, autoIncrement: S, unique: !0, extractKey: ii(w) }, indexes: Is(x.indexNames).map(function(O) {
            return x.index(O);
          }).map(function($) {
            var I = $.name, A = $.unique, D = $.multiEntry, $ = $.keyPath, D = { name: I, compound: m($), keyPath: $, unique: A, multiEntry: D, extractKey: ii($) };
            return T[bn($)] = D;
          }), getIndexByKeyPath: function(O) {
            return T[bn(O)];
          } };
          return T[":id"] = S.primaryKey, w != null && (T[bn(w)] = S.primaryKey), S;
        }) }, hasGetAll: 0 < p.length && "getAll" in d.objectStore(p[0]) && !(typeof navigator < "u" && /Safari/.test(navigator.userAgent) && !/(Chrome\/|Edge\/)/.test(navigator.userAgent) && [].concat(navigator.userAgent.match(/Safari\/(\d*)/))[1] < 604) }), v = _.schema, b = _.hasGetAll, _ = v.tables.map(l), g = {};
        return _.forEach(function(x) {
          return g[x.name] = x;
        }), { stack: "dbcore", transaction: t.transaction.bind(t), table: function(x) {
          if (!g[x]) throw new Error("Table '".concat(x, "' not found"));
          return g[x];
        }, MIN_KEY: -1 / 0, MAX_KEY: wn(n), schema: v };
      }
      function fu(t, n, o, u) {
        var l = o.IDBKeyRange;
        return o.indexedDB, { dbcore: (u = cu(n, l, u), t.dbcore.reduce(function(f, d) {
          return d = d.create, i(i({}, f), d(f));
        }, u)) };
      }
      function rr(t, u) {
        var o = u.db, u = fu(t._middlewares, o, t._deps, u);
        t.core = u.dbcore, t.tables.forEach(function(l) {
          var f = l.name;
          t.core.schema.tables.some(function(d) {
            return d.name === f;
          }) && (l.core = t.core.table(f), t[f] instanceof t.Table && (t[f].core = l.core));
        });
      }
      function ir(t, n, o, u) {
        o.forEach(function(l) {
          var f = u[l];
          n.forEach(function(d) {
            var p = (function v(b, _) {
              return Ee(b, _) || (b = E(b)) && v(b, _);
            })(d, l);
            (!p || "value" in p && p.value === void 0) && (d === t.Transaction.prototype || d instanceof t.Transaction ? X(d, l, { get: function() {
              return this.table(l);
            }, set: function(v) {
              j(this, l, { value: v, writable: !0, configurable: !0, enumerable: !0 });
            } }) : d[l] = new t.Table(l, f));
          });
        });
      }
      function si(t, n) {
        n.forEach(function(o) {
          for (var u in o) o[u] instanceof t.Table && delete o[u];
        });
      }
      function hu(t, n) {
        return t._cfg.version - n._cfg.version;
      }
      function du(t, n, o, u) {
        var l = t._dbSchema;
        o.objectStoreNames.contains("$meta") && !l.$meta && (l.$meta = ri("$meta", $s("")[0], []), t._storeNames.push("$meta"));
        var f = t._createTransaction("readwrite", t._storeNames, l);
        f.create(o), f._completion.catch(u);
        var d = f._reject.bind(f), p = K.transless || K;
        Ye(function() {
          return K.trans = f, K.transless = p, n !== 0 ? (rr(t, o), b = n, ((v = f).storeNames.includes("$meta") ? v.table("$meta").get("version").then(function(_) {
            return _ ?? b;
          }) : q.resolve(b)).then(function(_) {
            return x = _, w = f, k = o, T = [], _ = (g = t)._versions, S = g._dbSchema = or(0, g.idbdb, k), (_ = _.filter(function(O) {
              return O._cfg.version >= x;
            })).length !== 0 ? (_.forEach(function(O) {
              T.push(function() {
                var I = S, A = O._cfg.dbschema;
                ar(g, I, k), ar(g, A, k), S = g._dbSchema = A;
                var $ = oi(I, A);
                $.add.forEach(function(V) {
                  ai(k, V[0], V[1].primKey, V[1].indexes);
                }), $.change.forEach(function(V) {
                  if (V.recreate) throw new z.Upgrade("Not yet support for changing primary key");
                  var R = k.objectStore(V.name);
                  V.add.forEach(function(L) {
                    return sr(R, L);
                  }), V.change.forEach(function(L) {
                    R.deleteIndex(L.name), sr(R, L);
                  }), V.del.forEach(function(L) {
                    return R.deleteIndex(L);
                  });
                });
                var D = O._cfg.contentUpgrade;
                if (D && O._cfg.version > x) {
                  rr(g, k), w._memoizedTables = {};
                  var F = Un(A);
                  $.del.forEach(function(V) {
                    F[V] = I[V];
                  }), si(g, [g.Transaction.prototype]), ir(g, [g.Transaction.prototype], h(F), F), w.schema = F;
                  var M, P = qr(D);
                  return P && Pt(), $ = q.follow(function() {
                    var V;
                    (M = D(w)) && P && (V = Ge.bind(null, null), M.then(V, V));
                  }), M && typeof M.then == "function" ? q.resolve(M) : $.then(function() {
                    return M;
                  });
                }
              }), T.push(function(I) {
                var A, $, D = O._cfg.dbschema;
                A = D, $ = I, [].slice.call($.db.objectStoreNames).forEach(function(F) {
                  return A[F] == null && $.db.deleteObjectStore(F);
                }), si(g, [g.Transaction.prototype]), ir(g, [g.Transaction.prototype], g._storeNames, g._dbSchema), w.schema = g._dbSchema;
              }), T.push(function(I) {
                g.idbdb.objectStoreNames.contains("$meta") && (Math.ceil(g.idbdb.version / 10) === O._cfg.version ? (g.idbdb.deleteObjectStore("$meta"), delete g._dbSchema.$meta, g._storeNames = g._storeNames.filter(function(A) {
                  return A !== "$meta";
                })) : I.objectStore("$meta").put(O._cfg.version, "version"));
              });
            }), (function O() {
              return T.length ? q.resolve(T.shift()(w.idbtrans)).then(O) : q.resolve();
            })().then(function() {
              As(S, k);
            })) : q.resolve();
            var g, x, w, k, T, S;
          }).catch(d)) : (h(l).forEach(function(_) {
            ai(o, _, l[_].primKey, l[_].indexes);
          }), rr(t, o), void q.follow(function() {
            return t.on.populate.fire(f);
          }).catch(d));
          var v, b;
        });
      }
      function mu(t, n) {
        As(t._dbSchema, n), n.db.version % 10 != 0 || n.objectStoreNames.contains("$meta") || n.db.createObjectStore("$meta").add(Math.ceil(n.db.version / 10 - 1), "version");
        var o = or(0, t.idbdb, n);
        ar(t, t._dbSchema, n);
        for (var u = 0, l = oi(o, t._dbSchema).change; u < l.length; u++) {
          var f = (function(d) {
            if (d.change.length || d.recreate) return console.warn("Unable to patch indexes of table ".concat(d.name, " because it has changes on the type of index or primary key.")), { value: void 0 };
            var p = n.objectStore(d.name);
            d.add.forEach(function(v) {
              Ve && console.debug("Dexie upgrade patch: Creating missing index ".concat(d.name, ".").concat(v.src)), sr(p, v);
            });
          })(l[u]);
          if (typeof f == "object") return f.value;
        }
      }
      function oi(t, n) {
        var o, u = { del: [], add: [], change: [] };
        for (o in t) n[o] || u.del.push(o);
        for (o in n) {
          var l = t[o], f = n[o];
          if (l) {
            var d = { name: o, def: f, recreate: !1, del: [], add: [], change: [] };
            if ("" + (l.primKey.keyPath || "") != "" + (f.primKey.keyPath || "") || l.primKey.auto !== f.primKey.auto) d.recreate = !0, u.change.push(d);
            else {
              var p = l.idxByName, v = f.idxByName, b = void 0;
              for (b in p) v[b] || d.del.push(b);
              for (b in v) {
                var _ = p[b], g = v[b];
                _ ? _.src !== g.src && d.change.push(g) : d.add.push(g);
              }
              (0 < d.del.length || 0 < d.add.length || 0 < d.change.length) && u.change.push(d);
            }
          } else u.add.push([o, f]);
        }
        return u;
      }
      function ai(t, n, o, u) {
        var l = t.db.createObjectStore(n, o.keyPath ? { keyPath: o.keyPath, autoIncrement: o.auto } : { autoIncrement: o.auto });
        return u.forEach(function(f) {
          return sr(l, f);
        }), l;
      }
      function As(t, n) {
        h(t).forEach(function(o) {
          n.db.objectStoreNames.contains(o) || (Ve && console.debug("Dexie: Creating missing table", o), ai(n, o, t[o].primKey, t[o].indexes));
        });
      }
      function sr(t, n) {
        t.createIndex(n.name, n.keyPath, { unique: n.unique, multiEntry: n.multi });
      }
      function or(t, n, o) {
        var u = {};
        return Re(n.objectStoreNames, 0).forEach(function(l) {
          for (var f = o.objectStore(l), d = ni(Es(b = f.keyPath), b || "", !0, !1, !!f.autoIncrement, b && typeof b != "string", !0), p = [], v = 0; v < f.indexNames.length; ++v) {
            var _ = f.index(f.indexNames[v]), b = _.keyPath, _ = ni(_.name, b, !!_.unique, !!_.multiEntry, !1, b && typeof b != "string", !1);
            p.push(_);
          }
          u[l] = ri(l, d, p);
        }), u;
      }
      function ar(t, n, o) {
        for (var u = o.db.objectStoreNames, l = 0; l < u.length; ++l) {
          var f = u[l], d = o.objectStore(f);
          t._hasGetAll = "getAll" in d;
          for (var p = 0; p < d.indexNames.length; ++p) {
            var v = d.indexNames[p], b = d.index(v).keyPath, _ = typeof b == "string" ? b : "[" + Re(b).join("+") + "]";
            !n[f] || (b = n[f].idxByName[_]) && (b.name = v, delete n[f].idxByName[_], n[f].idxByName[v] = b);
          }
        }
        typeof navigator < "u" && /Safari/.test(navigator.userAgent) && !/(Chrome\/|Edge\/)/.test(navigator.userAgent) && c.WorkerGlobalScope && c instanceof c.WorkerGlobalScope && [].concat(navigator.userAgent.match(/Safari\/(\d*)/))[1] < 604 && (t._hasGetAll = !1);
      }
      function $s(t) {
        return t.split(",").map(function(n, o) {
          var f = n.split(":"), u = (l = f[1]) === null || l === void 0 ? void 0 : l.trim(), l = (n = f[0].trim()).replace(/([&*]|\+\+)/g, ""), f = /^\[/.test(l) ? l.match(/^\[(.*)\]$/)[1].split("+") : l;
          return ni(l, f || null, /\&/.test(n), /\*/.test(n), /\+\+/.test(n), m(f), o === 0, u);
        });
      }
      var pu = (Ut.prototype._createTableSchema = ri, Ut.prototype._parseIndexSyntax = $s, Ut.prototype._parseStoresSpec = function(t, n) {
        var o = this;
        h(t).forEach(function(u) {
          if (t[u] !== null) {
            var l = o._parseIndexSyntax(t[u]), f = l.shift();
            if (!f) throw new z.Schema("Invalid schema for table " + u + ": " + t[u]);
            if (f.unique = !0, f.multi) throw new z.Schema("Primary key cannot be multiEntry*");
            l.forEach(function(d) {
              if (d.auto) throw new z.Schema("Only primary key can be marked as autoIncrement (++)");
              if (!d.keyPath) throw new z.Schema("Index must have a name and cannot be an empty string");
            }), l = o._createTableSchema(u, f, l), n[u] = l;
          }
        });
      }, Ut.prototype.stores = function(o) {
        var n = this.db;
        this._cfg.storesSource = this._cfg.storesSource ? y(this._cfg.storesSource, o) : o;
        var o = n._versions, u = {}, l = {};
        return o.forEach(function(f) {
          y(u, f._cfg.storesSource), l = f._cfg.dbschema = {}, f._parseStoresSpec(u, l);
        }), n._dbSchema = l, si(n, [n._allTables, n, n.Transaction.prototype]), ir(n, [n._allTables, n, n.Transaction.prototype, this._cfg.tables], h(l), l), n._storeNames = h(l), this;
      }, Ut.prototype.upgrade = function(t) {
        return this._cfg.contentUpgrade = jr(this._cfg.contentUpgrade || ie, t), this;
      }, Ut);
      function Ut() {
      }
      function ui(t, n) {
        var o = t._dbNamesDB;
        return o || (o = t._dbNamesDB = new Ke(Jn, { addons: [], indexedDB: t, IDBKeyRange: n })).version(1).stores({ dbnames: "name" }), o.table("dbnames");
      }
      function li(t) {
        return t && typeof t.databases == "function";
      }
      function ci(t) {
        return Ye(function() {
          return K.letThrough = !0, t();
        });
      }
      function fi(t) {
        return !("from" in t);
      }
      var ge = function(t, n) {
        if (!this) {
          var o = new ge();
          return t && "d" in t && y(o, t), o;
        }
        y(this, arguments.length ? { d: 1, from: t, to: 1 < arguments.length ? n : t } : { d: 0 });
      };
      function kn(t, n, o) {
        var u = J(n, o);
        if (!isNaN(u)) {
          if (0 < u) throw RangeError();
          if (fi(t)) return y(t, { from: n, to: o, d: 1 });
          var l = t.l, u = t.r;
          if (J(o, t.from) < 0) return l ? kn(l, n, o) : t.l = { from: n, to: o, d: 1, l: null, r: null }, Ds(t);
          if (0 < J(n, t.to)) return u ? kn(u, n, o) : t.r = { from: n, to: o, d: 1, l: null, r: null }, Ds(t);
          J(n, t.from) < 0 && (t.from = n, t.l = null, t.d = u ? u.d + 1 : 1), 0 < J(o, t.to) && (t.to = o, t.r = null, t.d = t.l ? t.l.d + 1 : 1), o = !t.r, l && !t.l && _n(t, l), u && o && _n(t, u);
        }
      }
      function _n(t, n) {
        fi(n) || (function o(u, v) {
          var f = v.from, d = v.to, p = v.l, v = v.r;
          kn(u, f, d), p && o(u, p), v && o(u, v);
        })(t, n);
      }
      function Cs(t, n) {
        var o = ur(n), u = o.next();
        if (u.done) return !1;
        for (var l = u.value, f = ur(t), d = f.next(l.from), p = d.value; !u.done && !d.done; ) {
          if (J(p.from, l.to) <= 0 && 0 <= J(p.to, l.from)) return !0;
          J(l.from, p.from) < 0 ? l = (u = o.next(p.from)).value : p = (d = f.next(l.from)).value;
        }
        return !1;
      }
      function ur(t) {
        var n = fi(t) ? null : { s: 0, n: t };
        return { next: function(o) {
          for (var u = 0 < arguments.length; n; ) switch (n.s) {
            case 0:
              if (n.s = 1, u) for (; n.n.l && J(o, n.n.from) < 0; ) n = { up: n, n: n.n.l, s: 1 };
              else for (; n.n.l; ) n = { up: n, n: n.n.l, s: 1 };
            case 1:
              if (n.s = 2, !u || J(o, n.n.to) <= 0) return { value: n.n, done: !1 };
            case 2:
              if (n.n.r) {
                n.s = 3, n = { up: n, n: n.n.r, s: 0 };
                continue;
              }
            case 3:
              n = n.up;
          }
          return { done: !0 };
        } };
      }
      function Ds(t) {
        var n, o, u = (((n = t.r) === null || n === void 0 ? void 0 : n.d) || 0) - (((o = t.l) === null || o === void 0 ? void 0 : o.d) || 0), l = 1 < u ? "r" : u < -1 ? "l" : "";
        l && (n = l == "r" ? "l" : "r", o = i({}, t), u = t[l], t.from = u.from, t.to = u.to, t[l] = u[l], o[l] = u[n], (t[n] = o).d = Ms(o)), t.d = Ms(t);
      }
      function Ms(o) {
        var n = o.r, o = o.l;
        return (n ? o ? Math.max(n.d, o.d) : n.d : o ? o.d : 0) + 1;
      }
      function lr(t, n) {
        return h(n).forEach(function(o) {
          t[o] ? _n(t[o], n[o]) : t[o] = (function u(l) {
            var f, d, p = {};
            for (f in l) C(l, f) && (d = l[f], p[f] = !d || typeof d != "object" || qn.has(d.constructor) ? d : u(d));
            return p;
          })(n[o]);
        }), t;
      }
      function hi(t, n) {
        return t.all || n.all || Object.keys(t).some(function(o) {
          return n[o] && Cs(n[o], t[o]);
        });
      }
      W(ge.prototype, ((Ie = { add: function(t) {
        return _n(this, t), this;
      }, addKey: function(t) {
        return kn(this, t, t), this;
      }, addKeys: function(t) {
        var n = this;
        return t.forEach(function(o) {
          return kn(n, o, o);
        }), this;
      }, hasKey: function(t) {
        var n = ur(this).next(t).value;
        return n && J(n.from, t) <= 0 && 0 <= J(n.to, t);
      } })[Ur] = function() {
        return ur(this);
      }, Ie));
      var wt = {}, di = {}, mi = !1;
      function cr(t) {
        lr(di, t), mi || (mi = !0, setTimeout(function() {
          mi = !1, pi(di, !(di = {}));
        }, 0));
      }
      function pi(t, n) {
        n === void 0 && (n = !1);
        var o = /* @__PURE__ */ new Set();
        if (t.all) for (var u = 0, l = Object.values(wt); u < l.length; u++) Ns(d = l[u], t, o, n);
        else for (var f in t) {
          var d, p = /^idb\:\/\/(.*)\/(.*)\//.exec(f);
          p && (f = p[1], p = p[2], (d = wt["idb://".concat(f, "/").concat(p)]) && Ns(d, t, o, n));
        }
        o.forEach(function(v) {
          return v();
        });
      }
      function Ns(t, n, o, u) {
        for (var l = [], f = 0, d = Object.entries(t.queries.query); f < d.length; f++) {
          for (var p = d[f], v = p[0], b = [], _ = 0, g = p[1]; _ < g.length; _++) {
            var x = g[_];
            hi(n, x.obsSet) ? x.subscribers.forEach(function(S) {
              return o.add(S);
            }) : u && b.push(x);
          }
          u && l.push([v, b]);
        }
        if (u) for (var w = 0, k = l; w < k.length; w++) {
          var T = k[w], v = T[0], b = T[1];
          t.queries.query[v] = b;
        }
      }
      function yu(t) {
        var n = t._state, o = t._deps.indexedDB;
        if (n.isBeingOpened || t.idbdb) return n.dbReadyPromise.then(function() {
          return n.dbOpenError ? ce(n.dbOpenError) : t;
        });
        n.isBeingOpened = !0, n.dbOpenError = null, n.openComplete = !1;
        var u = n.openCanceller, l = Math.round(10 * t.verno), f = !1;
        function d() {
          if (n.openCanceller !== u) throw new z.DatabaseClosed("db.open() was cancelled");
        }
        function p() {
          return new q(function(x, w) {
            if (d(), !o) throw new z.MissingAPI();
            var k = t.name, T = n.autoSchema || !l ? o.open(k) : o.open(k, l);
            if (!T) throw new z.MissingAPI();
            T.onerror = Ue(w), T.onblocked = oe(t._fireOnBlocked), T.onupgradeneeded = oe(function(S) {
              var O;
              _ = T.transaction, n.autoSchema && !t._options.allowEmptyDB ? (T.onerror = gn, _.abort(), T.result.close(), (O = o.deleteDatabase(k)).onsuccess = O.onerror = oe(function() {
                w(new z.NoSuchDatabase("Database ".concat(k, " doesnt exist")));
              })) : (_.onerror = Ue(w), S = S.oldVersion > Math.pow(2, 62) ? 0 : S.oldVersion, g = S < 1, t.idbdb = T.result, f && mu(t, _), du(t, S / 10, _, w));
            }, w), T.onsuccess = oe(function() {
              _ = null;
              var S, O, I, A, $, D = t.idbdb = T.result, F = Re(D.objectStoreNames);
              if (0 < F.length) try {
                var M = D.transaction((A = F).length === 1 ? A[0] : A, "readonly");
                if (n.autoSchema) O = D, I = M, (S = t).verno = O.version / 10, I = S._dbSchema = or(0, O, I), S._storeNames = Re(O.objectStoreNames, 0), ir(S, [S._allTables], h(I), I);
                else if (ar(t, t._dbSchema, M), (($ = oi(or(0, ($ = t).idbdb, M), $._dbSchema)).add.length || $.change.some(function(P) {
                  return P.add.length || P.change.length;
                })) && !f) return console.warn("Dexie SchemaDiff: Schema was extended without increasing the number passed to db.version(). Dexie will add missing parts and increment native version number to workaround this."), D.close(), l = D.version + 1, f = !0, x(p());
                rr(t, M);
              } catch {
              }
              Ft.push(t), D.onversionchange = oe(function(P) {
                n.vcFired = !0, t.on("versionchange").fire(P);
              }), D.onclose = oe(function(P) {
                t.on("close").fire(P);
              }), g && ($ = t._deps, M = k, D = $.indexedDB, $ = $.IDBKeyRange, li(D) || M === Jn || ui(D, $).put({ name: M }).catch(ie)), x();
            }, w);
          }).catch(function(x) {
            switch (x?.name) {
              case "UnknownError":
                if (0 < n.PR1398_maxLoop) return n.PR1398_maxLoop--, console.warn("Dexie: Workaround for Chrome UnknownError on open()"), p();
                break;
              case "VersionError":
                if (0 < l) return l = 0, p();
            }
            return q.reject(x);
          });
        }
        var v, b = n.dbReadyResolve, _ = null, g = !1;
        return q.race([u, (typeof navigator > "u" ? q.resolve() : !navigator.userAgentData && /Safari\//.test(navigator.userAgent) && !/Chrom(e|ium)\//.test(navigator.userAgent) && indexedDB.databases ? new Promise(function(x) {
          function w() {
            return indexedDB.databases().finally(x);
          }
          v = setInterval(w, 100), w();
        }).finally(function() {
          return clearInterval(v);
        }) : Promise.resolve()).then(p)]).then(function() {
          return d(), n.onReadyBeingFired = [], q.resolve(ci(function() {
            return t.on.ready.fire(t.vip);
          })).then(function x() {
            if (0 < n.onReadyBeingFired.length) {
              var w = n.onReadyBeingFired.reduce(jr, ie);
              return n.onReadyBeingFired = [], q.resolve(ci(function() {
                return w(t.vip);
              })).then(x);
            }
          });
        }).finally(function() {
          n.openCanceller === u && (n.onReadyBeingFired = null, n.isBeingOpened = !1);
        }).catch(function(x) {
          n.dbOpenError = x;
          try {
            _ && _.abort();
          } catch {
          }
          return u === n.openCanceller && t._close(), ce(x);
        }).finally(function() {
          n.openComplete = !0, b();
        }).then(function() {
          var x;
          return g && (x = {}, t.tables.forEach(function(w) {
            w.schema.indexes.forEach(function(k) {
              k.name && (x["idb://".concat(t.name, "/").concat(w.name, "/").concat(k.name)] = new ge(-1 / 0, [[[]]]));
            }), x["idb://".concat(t.name, "/").concat(w.name, "/")] = x["idb://".concat(t.name, "/").concat(w.name, "/:dels")] = new ge(-1 / 0, [[[]]]);
          }), Qe(vn).fire(x), pi(x, !0)), t;
        });
      }
      function yi(t) {
        function n(f) {
          return t.next(f);
        }
        var o = l(n), u = l(function(f) {
          return t.throw(f);
        });
        function l(f) {
          return function(v) {
            var p = f(v), v = p.value;
            return p.done ? v : v && typeof v.then == "function" ? v.then(o, u) : m(v) ? Promise.all(v).then(o, u) : o(v);
          };
        }
        return l(n)();
      }
      function fr(t, n, o) {
        for (var u = m(t) ? t.slice() : [t], l = 0; l < o; ++l) u.push(n);
        return u;
      }
      var gu = { stack: "dbcore", name: "VirtualIndexMiddleware", level: 1, create: function(t) {
        return i(i({}, t), { table: function(n) {
          var o = t.table(n), u = o.schema, l = {}, f = [];
          function d(g, x, w) {
            var k = bn(g), T = l[k] = l[k] || [], S = g == null ? 0 : typeof g == "string" ? 1 : g.length, O = 0 < x, O = i(i({}, w), { name: O ? "".concat(k, "(virtual-from:").concat(w.name, ")") : w.name, lowLevelIndex: w, isVirtual: O, keyTail: x, keyLength: S, extractKey: ii(g), unique: !O && w.unique });
            return T.push(O), O.isPrimaryKey || f.push(O), 1 < S && d(S === 2 ? g[0] : g.slice(0, S - 1), x + 1, w), T.sort(function(I, A) {
              return I.keyTail - A.keyTail;
            }), O;
          }
          n = d(u.primaryKey.keyPath, 0, u.primaryKey), l[":id"] = [n];
          for (var p = 0, v = u.indexes; p < v.length; p++) {
            var b = v[p];
            d(b.keyPath, 0, b);
          }
          function _(g) {
            var x, w = g.query.index;
            return w.isVirtual ? i(i({}, g), { query: { index: w.lowLevelIndex, range: (x = g.query.range, w = w.keyTail, { type: x.type === 1 ? 2 : x.type, lower: fr(x.lower, x.lowerOpen ? t.MAX_KEY : t.MIN_KEY, w), lowerOpen: !0, upper: fr(x.upper, x.upperOpen ? t.MIN_KEY : t.MAX_KEY, w), upperOpen: !0 }) } }) : g;
          }
          return i(i({}, o), { schema: i(i({}, u), { primaryKey: n, indexes: f, getIndexByKeyPath: function(g) {
            return (g = l[bn(g)]) && g[0];
          } }), count: function(g) {
            return o.count(_(g));
          }, query: function(g) {
            return o.query(_(g));
          }, openCursor: function(g) {
            var x = g.query.index, w = x.keyTail, k = x.isVirtual, T = x.keyLength;
            return k ? o.openCursor(_(g)).then(function(O) {
              return O && S(O);
            }) : o.openCursor(g);
            function S(O) {
              return Object.create(O, { continue: { value: function(I) {
                I != null ? O.continue(fr(I, g.reverse ? t.MAX_KEY : t.MIN_KEY, w)) : g.unique ? O.continue(O.key.slice(0, T).concat(g.reverse ? t.MIN_KEY : t.MAX_KEY, w)) : O.continue();
              } }, continuePrimaryKey: { value: function(I, A) {
                O.continuePrimaryKey(fr(I, t.MAX_KEY, w), A);
              } }, primaryKey: { get: function() {
                return O.primaryKey;
              } }, key: { get: function() {
                var I = O.key;
                return T === 1 ? I[0] : I.slice(0, T);
              } }, value: { get: function() {
                return O.value;
              } } });
            }
          } });
        } });
      } };
      function gi(t, n, o, u) {
        return o = o || {}, u = u || "", h(t).forEach(function(l) {
          var f, d, p;
          C(n, l) ? (f = t[l], d = n[l], typeof f == "object" && typeof d == "object" && f && d ? (p = Vr(f)) !== Vr(d) ? o[u + l] = n[l] : p === "Object" ? gi(f, d, o, u + l + ".") : f !== d && (o[u + l] = n[l]) : f !== d && (o[u + l] = n[l])) : o[u + l] = void 0;
        }), h(n).forEach(function(l) {
          C(t, l) || (o[u + l] = n[l]);
        }), o;
      }
      function vi(t, n) {
        return n.type === "delete" ? n.keys : n.keys || n.values.map(t.extractKey);
      }
      var vu = { stack: "dbcore", name: "HooksMiddleware", level: 2, create: function(t) {
        return i(i({}, t), { table: function(n) {
          var o = t.table(n), u = o.schema.primaryKey;
          return i(i({}, o), { mutate: function(l) {
            var f = K.trans, d = f.table(n).hook, p = d.deleting, v = d.creating, b = d.updating;
            switch (l.type) {
              case "add":
                if (v.fire === ie) break;
                return f._promise("readwrite", function() {
                  return _(l);
                }, !0);
              case "put":
                if (v.fire === ie && b.fire === ie) break;
                return f._promise("readwrite", function() {
                  return _(l);
                }, !0);
              case "delete":
                if (p.fire === ie) break;
                return f._promise("readwrite", function() {
                  return _(l);
                }, !0);
              case "deleteRange":
                if (p.fire === ie) break;
                return f._promise("readwrite", function() {
                  return (function g(x, w, k) {
                    return o.query({ trans: x, values: !1, query: { index: u, range: w }, limit: k }).then(function(T) {
                      var S = T.result;
                      return _({ type: "delete", keys: S, trans: x }).then(function(O) {
                        return 0 < O.numFailures ? Promise.reject(O.failures[0]) : S.length < k ? { failures: [], numFailures: 0, lastResult: void 0 } : g(x, i(i({}, w), { lower: S[S.length - 1], lowerOpen: !0 }), k);
                      });
                    });
                  })(l.trans, l.range, 1e4);
                }, !0);
            }
            return o.mutate(l);
            function _(g) {
              var x, w, k, T = K.trans, S = g.keys || vi(u, g);
              if (!S) throw new Error("Keys missing");
              return (g = g.type === "add" || g.type === "put" ? i(i({}, g), { keys: S }) : i({}, g)).type !== "delete" && (g.values = a([], g.values)), g.keys && (g.keys = a([], g.keys)), x = o, k = S, ((w = g).type === "add" ? Promise.resolve([]) : x.getMany({ trans: w.trans, keys: k, cache: "immutable" })).then(function(O) {
                var I = S.map(function(A, $) {
                  var D, F, M, P = O[$], V = { onerror: null, onsuccess: null };
                  return g.type === "delete" ? p.fire.call(V, A, P, T) : g.type === "add" || P === void 0 ? (D = v.fire.call(V, A, g.values[$], T), A == null && D != null && (g.keys[$] = A = D, u.outbound || Se(g.values[$], u.keyPath, A))) : (D = gi(P, g.values[$]), (F = b.fire.call(V, D, A, P, T)) && (M = g.values[$], Object.keys(F).forEach(function(R) {
                    C(M, R) ? M[R] = F[R] : Se(M, R, F[R]);
                  }))), V;
                });
                return o.mutate(g).then(function(A) {
                  for (var $ = A.failures, D = A.results, F = A.numFailures, A = A.lastResult, M = 0; M < S.length; ++M) {
                    var P = (D || S)[M], V = I[M];
                    P == null ? V.onerror && V.onerror($[M]) : V.onsuccess && V.onsuccess(g.type === "put" && O[M] ? g.values[M] : P);
                  }
                  return { failures: $, results: D, numFailures: F, lastResult: A };
                }).catch(function(A) {
                  return I.forEach(function($) {
                    return $.onerror && $.onerror(A);
                  }), Promise.reject(A);
                });
              });
            }
          } });
        } });
      } };
      function Ps(t, n, o) {
        try {
          if (!n || n.keys.length < t.length) return null;
          for (var u = [], l = 0, f = 0; l < n.keys.length && f < t.length; ++l) J(n.keys[l], t[f]) === 0 && (u.push(o ? lt(n.values[l]) : n.values[l]), ++f);
          return u.length === t.length ? u : null;
        } catch {
          return null;
        }
      }
      var wu = { stack: "dbcore", level: -1, create: function(t) {
        return { table: function(n) {
          var o = t.table(n);
          return i(i({}, o), { getMany: function(u) {
            if (!u.cache) return o.getMany(u);
            var l = Ps(u.keys, u.trans._cache, u.cache === "clone");
            return l ? q.resolve(l) : o.getMany(u).then(function(f) {
              return u.trans._cache = { keys: u.keys, values: u.cache === "clone" ? lt(f) : f }, f;
            });
          }, mutate: function(u) {
            return u.type !== "add" && (u.trans._cache = null), o.mutate(u);
          } });
        } };
      } };
      function Fs(t, n) {
        return t.trans.mode === "readonly" && !!t.subscr && !t.trans.explicit && t.trans.db._options.cache !== "disabled" && !n.schema.primaryKey.outbound;
      }
      function Rs(t, n) {
        switch (t) {
          case "query":
            return n.values && !n.unique;
          case "get":
          case "getMany":
          case "count":
          case "openCursor":
            return !1;
        }
      }
      var bu = { stack: "dbcore", level: 0, name: "Observability", create: function(t) {
        var n = t.schema.name, o = new ge(t.MIN_KEY, t.MAX_KEY);
        return i(i({}, t), { transaction: function(u, l, f) {
          if (K.subscr && l !== "readonly") throw new z.ReadOnly("Readwrite transaction in liveQuery context. Querier source: ".concat(K.querier));
          return t.transaction(u, l, f);
        }, table: function(u) {
          var l = t.table(u), f = l.schema, d = f.primaryKey, g = f.indexes, p = d.extractKey, v = d.outbound, b = d.autoIncrement && g.filter(function(w) {
            return w.compound && w.keyPath.includes(d.keyPath);
          }), _ = i(i({}, l), { mutate: function(w) {
            function k(R) {
              return R = "idb://".concat(n, "/").concat(u, "/").concat(R), A[R] || (A[R] = new ge());
            }
            var T, S, O, I = w.trans, A = w.mutatedParts || (w.mutatedParts = {}), $ = k(""), D = k(":dels"), F = w.type, V = w.type === "deleteRange" ? [w.range] : w.type === "delete" ? [w.keys] : w.values.length < 50 ? [vi(d, w).filter(function(R) {
              return R;
            }), w.values] : [], M = V[0], P = V[1], V = w.trans._cache;
            return m(M) ? ($.addKeys(M), (V = F === "delete" || M.length === P.length ? Ps(M, V) : null) || D.addKeys(M), (V || P) && (T = k, S = V, O = P, f.indexes.forEach(function(R) {
              var L = T(R.name || "");
              function G(Y) {
                return Y != null ? R.extractKey(Y) : null;
              }
              function Q(Y) {
                return R.multiEntry && m(Y) ? Y.forEach(function(le) {
                  return L.addKey(le);
                }) : L.addKey(Y);
              }
              (S || O).forEach(function(Y, ve) {
                var H = S && G(S[ve]), ve = O && G(O[ve]);
                J(H, ve) !== 0 && (H != null && Q(H), ve != null && Q(ve));
              });
            }))) : M ? (P = { from: (P = M.lower) !== null && P !== void 0 ? P : t.MIN_KEY, to: (P = M.upper) !== null && P !== void 0 ? P : t.MAX_KEY }, D.add(P), $.add(P)) : ($.add(o), D.add(o), f.indexes.forEach(function(R) {
              return k(R.name).add(o);
            })), l.mutate(w).then(function(R) {
              return !M || w.type !== "add" && w.type !== "put" || ($.addKeys(R.results), b && b.forEach(function(L) {
                for (var G = w.values.map(function(H) {
                  return L.extractKey(H);
                }), Q = L.keyPath.findIndex(function(H) {
                  return H === d.keyPath;
                }), Y = 0, le = R.results.length; Y < le; ++Y) G[Y][Q] = R.results[Y];
                k(L.name).addKeys(G);
              })), I.mutatedParts = lr(I.mutatedParts || {}, A), R;
            });
          } }), g = function(k) {
            var T = k.query, k = T.index, T = T.range;
            return [k, new ge((k = T.lower) !== null && k !== void 0 ? k : t.MIN_KEY, (T = T.upper) !== null && T !== void 0 ? T : t.MAX_KEY)];
          }, x = { get: function(w) {
            return [d, new ge(w.key)];
          }, getMany: function(w) {
            return [d, new ge().addKeys(w.keys)];
          }, count: g, query: g, openCursor: g };
          return h(x).forEach(function(w) {
            _[w] = function(k) {
              var T = K.subscr, S = !!T, O = Fs(K, l) && Rs(w, k) ? k.obsSet = {} : T;
              if (S) {
                var I = function(P) {
                  return P = "idb://".concat(n, "/").concat(u, "/").concat(P), O[P] || (O[P] = new ge());
                }, A = I(""), $ = I(":dels"), T = x[w](k), S = T[0], T = T[1];
                if ((w === "query" && S.isPrimaryKey && !k.values ? $ : I(S.name || "")).add(T), !S.isPrimaryKey) {
                  if (w !== "count") {
                    var D = w === "query" && v && k.values && l.query(i(i({}, k), { values: !1 }));
                    return l[w].apply(this, arguments).then(function(P) {
                      if (w === "query") {
                        if (v && k.values) return D.then(function(G) {
                          return G = G.result, A.addKeys(G), P;
                        });
                        var V = k.values ? P.result.map(p) : P.result;
                        (k.values ? A : $).addKeys(V);
                      } else if (w === "openCursor") {
                        var R = P, L = k.values;
                        return R && Object.create(R, { key: { get: function() {
                          return $.addKey(R.primaryKey), R.key;
                        } }, primaryKey: { get: function() {
                          var G = R.primaryKey;
                          return $.addKey(G), G;
                        } }, value: { get: function() {
                          return L && A.addKey(R.primaryKey), R.value;
                        } } });
                      }
                      return P;
                    });
                  }
                  $.add(o);
                }
              }
              return l[w].apply(this, arguments);
            };
          }), _;
        } });
      } };
      function Vs(t, n, o) {
        if (o.numFailures === 0) return n;
        if (n.type === "deleteRange") return null;
        var u = n.keys ? n.keys.length : "values" in n && n.values ? n.values.length : 1;
        return o.numFailures === u ? null : (n = i({}, n), m(n.keys) && (n.keys = n.keys.filter(function(l, f) {
          return !(f in o.failures);
        })), "values" in n && m(n.values) && (n.values = n.values.filter(function(l, f) {
          return !(f in o.failures);
        })), n);
      }
      function wi(t, n) {
        return o = t, ((u = n).lower === void 0 || (u.lowerOpen ? 0 < J(o, u.lower) : 0 <= J(o, u.lower))) && (t = t, (n = n).upper === void 0 || (n.upperOpen ? J(t, n.upper) < 0 : J(t, n.upper) <= 0));
        var o, u;
      }
      function Us(t, n, x, u, l, f) {
        if (!x || x.length === 0) return t;
        var d = n.query.index, p = d.multiEntry, v = n.query.range, b = u.schema.primaryKey.extractKey, _ = d.extractKey, g = (d.lowLevelIndex || d).extractKey, x = x.reduce(function(w, k) {
          var T = w, S = [];
          if (k.type === "add" || k.type === "put") for (var O = new ge(), I = k.values.length - 1; 0 <= I; --I) {
            var A, $ = k.values[I], D = b($);
            O.hasKey(D) || (A = _($), (p && m(A) ? A.some(function(R) {
              return wi(R, v);
            }) : wi(A, v)) && (O.addKey(D), S.push($)));
          }
          switch (k.type) {
            case "add":
              var F = new ge().addKeys(n.values ? w.map(function(L) {
                return b(L);
              }) : w), T = w.concat(n.values ? S.filter(function(L) {
                return L = b(L), !F.hasKey(L) && (F.addKey(L), !0);
              }) : S.map(function(L) {
                return b(L);
              }).filter(function(L) {
                return !F.hasKey(L) && (F.addKey(L), !0);
              }));
              break;
            case "put":
              var M = new ge().addKeys(k.values.map(function(L) {
                return b(L);
              }));
              T = w.filter(function(L) {
                return !M.hasKey(n.values ? b(L) : L);
              }).concat(n.values ? S : S.map(function(L) {
                return b(L);
              }));
              break;
            case "delete":
              var P = new ge().addKeys(k.keys);
              T = w.filter(function(L) {
                return !P.hasKey(n.values ? b(L) : L);
              });
              break;
            case "deleteRange":
              var V = k.range;
              T = w.filter(function(L) {
                return !wi(b(L), V);
              });
          }
          return T;
        }, t);
        return x === t ? t : (x.sort(function(w, k) {
          return J(g(w), g(k)) || J(b(w), b(k));
        }), n.limit && n.limit < 1 / 0 && (x.length > n.limit ? x.length = n.limit : t.length === n.limit && x.length < n.limit && (l.dirty = !0)), f ? Object.freeze(x) : x);
      }
      function qs(t, n) {
        return J(t.lower, n.lower) === 0 && J(t.upper, n.upper) === 0 && !!t.lowerOpen == !!n.lowerOpen && !!t.upperOpen == !!n.upperOpen;
      }
      function ku(t, n) {
        return (function(o, u, l, f) {
          if (o === void 0) return u !== void 0 ? -1 : 0;
          if (u === void 0) return 1;
          if ((u = J(o, u)) === 0) {
            if (l && f) return 0;
            if (l) return 1;
            if (f) return -1;
          }
          return u;
        })(t.lower, n.lower, t.lowerOpen, n.lowerOpen) <= 0 && 0 <= (function(o, u, l, f) {
          if (o === void 0) return u !== void 0 ? 1 : 0;
          if (u === void 0) return -1;
          if ((u = J(o, u)) === 0) {
            if (l && f) return 0;
            if (l) return -1;
            if (f) return 1;
          }
          return u;
        })(t.upper, n.upper, t.upperOpen, n.upperOpen);
      }
      function _u(t, n, o, u) {
        t.subscribers.add(o), u.addEventListener("abort", function() {
          var l, f;
          t.subscribers.delete(o), t.subscribers.size === 0 && (l = t, f = n, setTimeout(function() {
            l.subscribers.size === 0 && ct(f, l);
          }, 3e3));
        });
      }
      var Su = { stack: "dbcore", level: 0, name: "Cache", create: function(t) {
        var n = t.schema.name;
        return i(i({}, t), { transaction: function(o, u, l) {
          var f, d, p = t.transaction(o, u, l);
          return u === "readwrite" && (d = (f = new AbortController()).signal, l = function(v) {
            return function() {
              if (f.abort(), u === "readwrite") {
                for (var b = /* @__PURE__ */ new Set(), _ = 0, g = o; _ < g.length; _++) {
                  var x = g[_], w = wt["idb://".concat(n, "/").concat(x)];
                  if (w) {
                    var k = t.table(x), T = w.optimisticOps.filter(function(L) {
                      return L.trans === p;
                    });
                    if (p._explicit && v && p.mutatedParts) for (var S = 0, O = Object.values(w.queries.query); S < O.length; S++) for (var I = 0, A = (F = O[S]).slice(); I < A.length; I++) hi((M = A[I]).obsSet, p.mutatedParts) && (ct(F, M), M.subscribers.forEach(function(L) {
                      return b.add(L);
                    }));
                    else if (0 < T.length) {
                      w.optimisticOps = w.optimisticOps.filter(function(L) {
                        return L.trans !== p;
                      });
                      for (var $ = 0, D = Object.values(w.queries.query); $ < D.length; $++) for (var F, M, P, V = 0, R = (F = D[$]).slice(); V < R.length; V++) (M = R[V]).res != null && p.mutatedParts && (v && !M.dirty ? (P = Object.isFrozen(M.res), P = Us(M.res, M.req, T, k, M, P), M.dirty ? (ct(F, M), M.subscribers.forEach(function(L) {
                        return b.add(L);
                      })) : P !== M.res && (M.res = P, M.promise = q.resolve({ result: P }))) : (M.dirty && ct(F, M), M.subscribers.forEach(function(L) {
                        return b.add(L);
                      })));
                    }
                  }
                }
                b.forEach(function(L) {
                  return L();
                });
              }
            };
          }, p.addEventListener("abort", l(!1), { signal: d }), p.addEventListener("error", l(!1), { signal: d }), p.addEventListener("complete", l(!0), { signal: d })), p;
        }, table: function(o) {
          var u = t.table(o), l = u.schema.primaryKey;
          return i(i({}, u), { mutate: function(f) {
            var d = K.trans;
            if (l.outbound || d.db._options.cache === "disabled" || d.explicit || d.idbtrans.mode !== "readwrite") return u.mutate(f);
            var p = wt["idb://".concat(n, "/").concat(o)];
            return p ? (d = u.mutate(f), f.type !== "add" && f.type !== "put" || !(50 <= f.values.length || vi(l, f).some(function(v) {
              return v == null;
            })) ? (p.optimisticOps.push(f), f.mutatedParts && cr(f.mutatedParts), d.then(function(v) {
              0 < v.numFailures && (ct(p.optimisticOps, f), (v = Vs(0, f, v)) && p.optimisticOps.push(v), f.mutatedParts && cr(f.mutatedParts));
            }), d.catch(function() {
              ct(p.optimisticOps, f), f.mutatedParts && cr(f.mutatedParts);
            })) : d.then(function(v) {
              var b = Vs(0, i(i({}, f), { values: f.values.map(function(_, g) {
                var x;
                return v.failures[g] ? _ : (_ = (x = l.keyPath) !== null && x !== void 0 && x.includes(".") ? lt(_) : i({}, _), Se(_, l.keyPath, v.results[g]), _);
              }) }), v);
              p.optimisticOps.push(b), queueMicrotask(function() {
                return f.mutatedParts && cr(f.mutatedParts);
              });
            }), d) : u.mutate(f);
          }, query: function(f) {
            if (!Fs(K, u) || !Rs("query", f)) return u.query(f);
            var d = ((b = K.trans) === null || b === void 0 ? void 0 : b.db._options.cache) === "immutable", g = K, p = g.requery, v = g.signal, b = (function(k, T, S, O) {
              var I = wt["idb://".concat(k, "/").concat(T)];
              if (!I) return [];
              if (!(T = I.queries[S])) return [null, !1, I, null];
              var A = T[(O.query ? O.query.index.name : null) || ""];
              if (!A) return [null, !1, I, null];
              switch (S) {
                case "query":
                  var $ = A.find(function(D) {
                    return D.req.limit === O.limit && D.req.values === O.values && qs(D.req.query.range, O.query.range);
                  });
                  return $ ? [$, !0, I, A] : [A.find(function(D) {
                    return ("limit" in D.req ? D.req.limit : 1 / 0) >= O.limit && (!O.values || D.req.values) && ku(D.req.query.range, O.query.range);
                  }), !1, I, A];
                case "count":
                  return $ = A.find(function(D) {
                    return qs(D.req.query.range, O.query.range);
                  }), [$, !!$, I, A];
              }
            })(n, o, "query", f), _ = b[0], g = b[1], x = b[2], w = b[3];
            return _ && g ? _.obsSet = f.obsSet : (g = u.query(f).then(function(k) {
              var T = k.result;
              if (_ && (_.res = T), d) {
                for (var S = 0, O = T.length; S < O; ++S) Object.freeze(T[S]);
                Object.freeze(T);
              } else k.result = lt(T);
              return k;
            }).catch(function(k) {
              return w && _ && ct(w, _), Promise.reject(k);
            }), _ = { obsSet: f.obsSet, promise: g, subscribers: /* @__PURE__ */ new Set(), type: "query", req: f, dirty: !1 }, w ? w.push(_) : (w = [_], (x = x || (wt["idb://".concat(n, "/").concat(o)] = { queries: { query: {}, count: {} }, objs: /* @__PURE__ */ new Map(), optimisticOps: [], unsignaledParts: {} })).queries.query[f.query.index.name || ""] = w)), _u(_, w, p, v), _.promise.then(function(k) {
              return { result: Us(k.result, f, x?.optimisticOps, u, _, d) };
            });
          } });
        } });
      } };
      function hr(t, n) {
        return new Proxy(t, { get: function(o, u, l) {
          return u === "db" ? n : Reflect.get(o, u, l);
        } });
      }
      var Ke = (fe.prototype.version = function(t) {
        if (isNaN(t) || t < 0.1) throw new z.Type("Given version is not a positive number");
        if (t = Math.round(10 * t) / 10, this.idbdb || this._state.isBeingOpened) throw new z.Schema("Cannot add version when database is open");
        this.verno = Math.max(this.verno, t);
        var n = this._versions, o = n.filter(function(u) {
          return u._cfg.version === t;
        })[0];
        return o || (o = new this.Version(t), n.push(o), n.sort(hu), o.stores({}), this._state.autoSchema = !1, o);
      }, fe.prototype._whenReady = function(t) {
        var n = this;
        return this.idbdb && (this._state.openComplete || K.letThrough || this._vip) ? t() : new q(function(o, u) {
          if (n._state.openComplete) return u(new z.DatabaseClosed(n._state.dbOpenError));
          if (!n._state.isBeingOpened) {
            if (!n._state.autoOpen) return void u(new z.DatabaseClosed());
            n.open().catch(ie);
          }
          n._state.dbReadyPromise.then(o, u);
        }).then(t);
      }, fe.prototype.use = function(t) {
        var n = t.stack, o = t.create, u = t.level, l = t.name;
        return l && this.unuse({ stack: n, name: l }), t = this._middlewares[n] || (this._middlewares[n] = []), t.push({ stack: n, create: o, level: u ?? 10, name: l }), t.sort(function(f, d) {
          return f.level - d.level;
        }), this;
      }, fe.prototype.unuse = function(t) {
        var n = t.stack, o = t.name, u = t.create;
        return n && this._middlewares[n] && (this._middlewares[n] = this._middlewares[n].filter(function(l) {
          return u ? l.create !== u : !!o && l.name !== o;
        })), this;
      }, fe.prototype.open = function() {
        var t = this;
        return yt(He, function() {
          return yu(t);
        });
      }, fe.prototype._close = function() {
        this.on.close.fire(new CustomEvent("close"));
        var t = this._state, n = Ft.indexOf(this);
        if (0 <= n && Ft.splice(n, 1), this.idbdb) {
          try {
            this.idbdb.close();
          } catch {
          }
          this.idbdb = null;
        }
        t.isBeingOpened || (t.dbReadyPromise = new q(function(o) {
          t.dbReadyResolve = o;
        }), t.openCanceller = new q(function(o, u) {
          t.cancelOpen = u;
        }));
      }, fe.prototype.close = function(o) {
        var n = (o === void 0 ? { disableAutoOpen: !0 } : o).disableAutoOpen, o = this._state;
        n ? (o.isBeingOpened && o.cancelOpen(new z.DatabaseClosed()), this._close(), o.autoOpen = !1, o.dbOpenError = new z.DatabaseClosed()) : (this._close(), o.autoOpen = this._options.autoOpen || o.isBeingOpened, o.openComplete = !1, o.dbOpenError = null);
      }, fe.prototype.delete = function(t) {
        var n = this;
        t === void 0 && (t = { disableAutoOpen: !0 });
        var o = 0 < arguments.length && typeof arguments[0] != "object", u = this._state;
        return new q(function(l, f) {
          function d() {
            n.close(t);
            var p = n._deps.indexedDB.deleteDatabase(n.name);
            p.onsuccess = oe(function() {
              var v, b, _;
              v = n._deps, b = n.name, _ = v.indexedDB, v = v.IDBKeyRange, li(_) || b === Jn || ui(_, v).delete(b).catch(ie), l();
            }), p.onerror = Ue(f), p.onblocked = n._fireOnBlocked;
          }
          if (o) throw new z.InvalidArgument("Invalid closeOptions argument to db.delete()");
          u.isBeingOpened ? u.dbReadyPromise.then(d) : d();
        });
      }, fe.prototype.backendDB = function() {
        return this.idbdb;
      }, fe.prototype.isOpen = function() {
        return this.idbdb !== null;
      }, fe.prototype.hasBeenClosed = function() {
        var t = this._state.dbOpenError;
        return t && t.name === "DatabaseClosed";
      }, fe.prototype.hasFailed = function() {
        return this._state.dbOpenError !== null;
      }, fe.prototype.dynamicallyOpened = function() {
        return this._state.autoSchema;
      }, Object.defineProperty(fe.prototype, "tables", { get: function() {
        var t = this;
        return h(this._allTables).map(function(n) {
          return t._allTables[n];
        });
      }, enumerable: !1, configurable: !0 }), fe.prototype.transaction = function() {
        var t = (function(n, o, u) {
          var l = arguments.length;
          if (l < 2) throw new z.InvalidArgument("Too few arguments");
          for (var f = new Array(l - 1); --l; ) f[l - 1] = arguments[l];
          return u = f.pop(), [n, Ze(f), u];
        }).apply(this, arguments);
        return this._transaction.apply(this, t);
      }, fe.prototype._transaction = function(t, n, o) {
        var u = this, l = K.trans;
        l && l.db === this && t.indexOf("!") === -1 || (l = null);
        var f, d, p = t.indexOf("?") !== -1;
        t = t.replace("!", "").replace("?", "");
        try {
          if (d = n.map(function(b) {
            if (b = b instanceof u.Table ? b.name : b, typeof b != "string") throw new TypeError("Invalid table argument to Dexie.transaction(). Only Table or String are allowed");
            return b;
          }), t == "r" || t === Jr) f = Jr;
          else {
            if (t != "rw" && t != Xr) throw new z.InvalidArgument("Invalid transaction mode: " + t);
            f = Xr;
          }
          if (l) {
            if (l.mode === Jr && f === Xr) {
              if (!p) throw new z.SubTransaction("Cannot enter a sub-transaction with READWRITE mode when parent transaction is READONLY");
              l = null;
            }
            l && d.forEach(function(b) {
              if (l && l.storeNames.indexOf(b) === -1) {
                if (!p) throw new z.SubTransaction("Table " + b + " not included in parent transaction.");
                l = null;
              }
            }), p && l && !l.active && (l = null);
          }
        } catch (b) {
          return l ? l._promise(null, function(_, g) {
            g(b);
          }) : ce(b);
        }
        var v = (function b(_, g, x, w, k) {
          return q.resolve().then(function() {
            var T = K.transless || K, S = _._createTransaction(g, x, _._dbSchema, w);
            if (S.explicit = !0, T = { trans: S, transless: T }, w) S.idbtrans = w.idbtrans;
            else try {
              S.create(), S.idbtrans._explicit = !0, _._state.PR1398_maxLoop = 3;
            } catch (A) {
              return A.name === Lr.InvalidState && _.isOpen() && 0 < --_._state.PR1398_maxLoop ? (console.warn("Dexie: Need to reopen db"), _.close({ disableAutoOpen: !1 }), _.open().then(function() {
                return b(_, g, x, null, k);
              })) : ce(A);
            }
            var O, I = qr(k);
            return I && Pt(), T = q.follow(function() {
              var A;
              (O = k.call(S, S)) && (I ? (A = Ge.bind(null, null), O.then(A, A)) : typeof O.next == "function" && typeof O.throw == "function" && (O = yi(O)));
            }, T), (O && typeof O.then == "function" ? q.resolve(O).then(function(A) {
              return S.active ? A : ce(new z.PrematureCommit("Transaction committed too early. See http://bit.ly/2kdckMn"));
            }) : T.then(function() {
              return O;
            })).then(function(A) {
              return w && S._resolve(), S._completion.then(function() {
                return A;
              });
            }).catch(function(A) {
              return S._reject(A), ce(A);
            });
          });
        }).bind(null, this, f, d, l, o);
        return l ? l._promise(f, v, "lock") : K.trans ? yt(K.transless, function() {
          return u._whenReady(v);
        }) : this._whenReady(v);
      }, fe.prototype.table = function(t) {
        if (!C(this._allTables, t)) throw new z.InvalidTable("Table ".concat(t, " does not exist"));
        return this._allTables[t];
      }, fe);
      function fe(t, n) {
        var o = this;
        this._middlewares = {}, this.verno = 0;
        var u = fe.dependencies;
        this._options = n = i({ addons: fe.addons, autoOpen: !0, indexedDB: u.indexedDB, IDBKeyRange: u.IDBKeyRange, cache: "cloned" }, n), this._deps = { indexedDB: n.indexedDB, IDBKeyRange: n.IDBKeyRange }, u = n.addons, this._dbSchema = {}, this._versions = [], this._storeNames = [], this._allTables = {}, this.idbdb = null, this._novip = this;
        var l, f, d, p, v, b = { dbOpenError: null, isBeingOpened: !1, onReadyBeingFired: null, openComplete: !1, dbReadyResolve: ie, dbReadyPromise: null, cancelOpen: ie, openCanceller: null, autoSchema: !0, PR1398_maxLoop: 3, autoOpen: n.autoOpen };
        b.dbReadyPromise = new q(function(g) {
          b.dbReadyResolve = g;
        }), b.openCanceller = new q(function(g, x) {
          b.cancelOpen = x;
        }), this._state = b, this.name = t, this.on = mn(this, "populate", "blocked", "versionchange", "close", { ready: [jr, ie] }), this.once = function(g, x) {
          var w = function() {
            for (var k = [], T = 0; T < arguments.length; T++) k[T] = arguments[T];
            o.on(g).unsubscribe(w), x.apply(o, k);
          };
          return o.on(g, w);
        }, this.on.ready.subscribe = on(this.on.ready.subscribe, function(g) {
          return function(x, w) {
            fe.vip(function() {
              var k, T = o._state;
              T.openComplete ? (T.dbOpenError || q.resolve().then(x), w && g(x)) : T.onReadyBeingFired ? (T.onReadyBeingFired.push(x), w && g(x)) : (g(x), k = o, w || g(function S() {
                k.on.ready.unsubscribe(x), k.on.ready.unsubscribe(S);
              }));
            });
          };
        }), this.Collection = (l = this, pn(su.prototype, function(O, S) {
          this.db = l;
          var w = ys, k = null;
          if (S) try {
            w = S();
          } catch (I) {
            k = I;
          }
          var T = O._ctx, S = T.table, O = S.hook.reading.fire;
          this._ctx = { table: S, index: T.index, isPrimKey: !T.index || S.schema.primKey.keyPath && T.index === S.schema.primKey.name, range: w, keysOnly: !1, dir: "next", unique: "", algorithm: null, filter: null, replayFilter: null, justLimit: !0, isMatch: null, offset: 0, limit: 1 / 0, error: k, or: T.or, valueMapper: O !== ln ? O : null };
        })), this.Table = (f = this, pn(bs.prototype, function(g, x, w) {
          this.db = f, this._tx = w, this.name = g, this.schema = x, this.hook = f._allTables[g] ? f._allTables[g].hook : mn(null, { creating: [Ga, ie], reading: [Ya, ln], updating: [Xa, ie], deleting: [Ja, ie] });
        })), this.Transaction = (d = this, pn(uu.prototype, function(g, x, w, k, T) {
          var S = this;
          g !== "readonly" && x.forEach(function(O) {
            O = (O = w[O]) === null || O === void 0 ? void 0 : O.yProps, O && (x = x.concat(O.map(function(I) {
              return I.updatesTable;
            })));
          }), this.db = d, this.mode = g, this.storeNames = x, this.schema = w, this.chromeTransactionDurability = k, this.idbtrans = null, this.on = mn(this, "complete", "error", "abort"), this.parent = T || null, this.active = !0, this._reculock = 0, this._blockedFuncs = [], this._resolve = null, this._reject = null, this._waitingFor = null, this._waitingQueue = null, this._spinCount = 0, this._completion = new q(function(O, I) {
            S._resolve = O, S._reject = I;
          }), this._completion.then(function() {
            S.active = !1, S.on.complete.fire();
          }, function(O) {
            var I = S.active;
            return S.active = !1, S.on.error.fire(O), S.parent ? S.parent._reject(O) : I && S.idbtrans && S.idbtrans.abort(), ce(O);
          });
        })), this.Version = (p = this, pn(pu.prototype, function(g) {
          this.db = p, this._cfg = { version: g, storesSource: null, dbschema: {}, tables: {}, contentUpgrade: null };
        })), this.WhereClause = (v = this, pn(Os.prototype, function(g, x, w) {
          if (this.db = v, this._ctx = { table: g, index: x === ":id" ? null : x, or: w }, this._cmp = this._ascending = J, this._descending = function(k, T) {
            return J(T, k);
          }, this._max = function(k, T) {
            return 0 < J(k, T) ? k : T;
          }, this._min = function(k, T) {
            return J(k, T) < 0 ? k : T;
          }, this._IDBKeyRange = v._deps.IDBKeyRange, !this._IDBKeyRange) throw new z.MissingAPI();
        })), this.on("versionchange", function(g) {
          0 < g.newVersion ? console.warn("Another connection wants to upgrade database '".concat(o.name, "'. Closing db now to resume the upgrade.")) : console.warn("Another connection wants to delete database '".concat(o.name, "'. Closing db now to resume the delete request.")), o.close({ disableAutoOpen: !1 });
        }), this.on("blocked", function(g) {
          !g.newVersion || g.newVersion < g.oldVersion ? console.warn("Dexie.delete('".concat(o.name, "') was blocked")) : console.warn("Upgrade '".concat(o.name, "' blocked by other connection holding version ").concat(g.oldVersion / 10));
        }), this._maxKey = wn(n.IDBKeyRange), this._createTransaction = function(g, x, w, k) {
          return new o.Transaction(g, x, w, o._options.chromeTransactionDurability, k);
        }, this._fireOnBlocked = function(g) {
          o.on("blocked").fire(g), Ft.filter(function(x) {
            return x.name === o.name && x !== o && !x._state.vcFired;
          }).map(function(x) {
            return x.on("versionchange").fire(g);
          });
        }, this.use(wu), this.use(Su), this.use(bu), this.use(gu), this.use(vu);
        var _ = new Proxy(this, { get: function(g, x, w) {
          if (x === "_vip") return !0;
          if (x === "table") return function(T) {
            return hr(o.table(T), _);
          };
          var k = Reflect.get(g, x, w);
          return k instanceof bs ? hr(k, _) : x === "tables" ? k.map(function(T) {
            return hr(T, _);
          }) : x === "_createTransaction" ? function() {
            return hr(k.apply(this, arguments), _);
          } : k;
        } });
        this.vip = _, u.forEach(function(g) {
          return g(o);
        });
      }
      var dr, Ie = typeof Symbol < "u" && "observable" in Symbol ? Symbol.observable : "@@observable", Tu = (bi.prototype.subscribe = function(t, n, o) {
        return this._subscribe(t && typeof t != "function" ? t : { next: t, error: n, complete: o });
      }, bi.prototype[Ie] = function() {
        return this;
      }, bi);
      function bi(t) {
        this._subscribe = t;
      }
      try {
        dr = { indexedDB: c.indexedDB || c.mozIndexedDB || c.webkitIndexedDB || c.msIndexedDB, IDBKeyRange: c.IDBKeyRange || c.webkitIDBKeyRange };
      } catch {
        dr = { indexedDB: null, IDBKeyRange: null };
      }
      function Ls(t) {
        var n, o = !1, u = new Tu(function(l) {
          var f = qr(t), d, p = !1, v = {}, b = {}, _ = { get closed() {
            return p;
          }, unsubscribe: function() {
            p || (p = !0, d && d.abort(), g && Qe.storagemutated.unsubscribe(w));
          } };
          l.start && l.start(_);
          var g = !1, x = function() {
            return Gr(k);
          }, w = function(T) {
            lr(v, T), hi(b, v) && x();
          }, k = function() {
            var T, S, O;
            !p && dr.indexedDB && (v = {}, T = {}, d && d.abort(), d = new AbortController(), O = (function(I) {
              var A = Mt();
              try {
                f && Pt();
                var $ = Ye(t, I);
                return $ = f ? $.finally(Ge) : $;
              } finally {
                A && Nt();
              }
            })(S = { subscr: T, signal: d.signal, requery: x, querier: t, trans: null }), Promise.resolve(O).then(function(I) {
              o = !0, n = I, p || S.signal.aborted || (v = {}, (function(A) {
                for (var $ in A) if (C(A, $)) return;
                return 1;
              })(b = T) || g || (Qe(vn, w), g = !0), Gr(function() {
                return !p && l.next && l.next(I);
              }));
            }, function(I) {
              o = !1, ["DatabaseClosedError", "AbortError"].includes(I?.name) || p || Gr(function() {
                p || l.error && l.error(I);
              });
            }));
          };
          return setTimeout(x, 0), _;
        });
        return u.hasValue = function() {
          return o;
        }, u.getValue = function() {
          return n;
        }, u;
      }
      var bt = Ke;
      function ki(t) {
        var n = et;
        try {
          et = !0, Qe.storagemutated.fire(t), pi(t, !0);
        } finally {
          et = n;
        }
      }
      W(bt, i(i({}, jn), { delete: function(t) {
        return new bt(t, { addons: [] }).delete();
      }, exists: function(t) {
        return new bt(t, { addons: [] }).open().then(function(n) {
          return n.close(), !0;
        }).catch("NoSuchDatabaseError", function() {
          return !1;
        });
      }, getDatabaseNames: function(t) {
        try {
          return n = bt.dependencies, o = n.indexedDB, n = n.IDBKeyRange, (li(o) ? Promise.resolve(o.databases()).then(function(u) {
            return u.map(function(l) {
              return l.name;
            }).filter(function(l) {
              return l !== Jn;
            });
          }) : ui(o, n).toCollection().primaryKeys()).then(t);
        } catch {
          return ce(new z.MissingAPI());
        }
        var n, o;
      }, defineClass: function() {
        return function(t) {
          y(this, t);
        };
      }, ignoreTransaction: function(t) {
        return K.trans ? yt(K.transless, t) : t();
      }, vip: ci, async: function(t) {
        return function() {
          try {
            var n = yi(t.apply(this, arguments));
            return n && typeof n.then == "function" ? n : q.resolve(n);
          } catch (o) {
            return ce(o);
          }
        };
      }, spawn: function(t, n, o) {
        try {
          var u = yi(t.apply(o, n || []));
          return u && typeof u.then == "function" ? u : q.resolve(u);
        } catch (l) {
          return ce(l);
        }
      }, currentTransaction: { get: function() {
        return K.trans || null;
      } }, waitFor: function(t, n) {
        return n = q.resolve(typeof t == "function" ? bt.ignoreTransaction(t) : t).timeout(n || 6e4), K.trans ? K.trans.waitFor(n) : n;
      }, Promise: q, debug: { get: function() {
        return Ve;
      }, set: function(t) {
        ls(t);
      } }, derive: me, extend: y, props: W, override: on, Events: mn, on: Qe, liveQuery: Ls, extendObservabilitySet: lr, getByKeyPath: De, setByKeyPath: Se, delByKeyPath: function(t, n) {
        typeof n == "string" ? Se(t, n, void 0) : "length" in n && [].map.call(n, function(o) {
          Se(t, o, void 0);
        });
      }, shallowClone: Un, deepClone: lt, getObjectDiff: gi, cmp: J, asap: an, minKey: -1 / 0, addons: [], connections: Ft, errnames: Lr, dependencies: dr, cache: wt, semVer: "4.2.0", version: "4.2.0".split(".").map(function(t) {
        return parseInt(t);
      }).reduce(function(t, n, o) {
        return t + n / Math.pow(10, 2 * o);
      }) })), bt.maxKey = wn(bt.dependencies.IDBKeyRange), typeof dispatchEvent < "u" && typeof addEventListener < "u" && (Qe(vn, function(t) {
        et || (t = new CustomEvent(ti, { detail: t }), et = !0, dispatchEvent(t), et = !1);
      }), addEventListener(ti, function(t) {
        t = t.detail, et || ki(t);
      }));
      var qt, et = !1, js = function() {
      };
      return typeof BroadcastChannel < "u" && ((js = function() {
        (qt = new BroadcastChannel(ti)).onmessage = function(t) {
          return t.data && ki(t.data);
        };
      })(), typeof qt.unref == "function" && qt.unref(), Qe(vn, function(t) {
        et || qt.postMessage(t);
      })), typeof addEventListener < "u" && (addEventListener("pagehide", function(t) {
        if (!Ke.disableBfCache && t.persisted) {
          Ve && console.debug("Dexie: handling persisted pagehide"), qt?.close();
          for (var n = 0, o = Ft; n < o.length; n++) o[n].close({ disableAutoOpen: !1 });
        }
      }), addEventListener("pageshow", function(t) {
        !Ke.disableBfCache && t.persisted && (Ve && console.debug("Dexie: handling persisted pageshow"), js(), ki({ all: new ge(-1 / 0, [[]]) }));
      })), q.rejectionMapper = function(t, n) {
        return !t || t instanceof Ct || t instanceof TypeError || t instanceof SyntaxError || !t.name || !us[t.name] ? t : (n = new us[t.name](n || t.message, t), "stack" in t && X(n, "stack", { get: function() {
          return this.inner.stack;
        } }), n);
      }, ls(Ve), i(Ke, Object.freeze({ __proto__: null, Dexie: Ke, liveQuery: Ls, Entity: gs, cmp: J, PropModification: yn, replacePrefix: function(t, n) {
        return new yn({ replacePrefix: [t, n] });
      }, add: function(t) {
        return new yn({ add: t });
      }, remove: function(t) {
        return new yn({ remove: t });
      }, default: Ke, RangeSet: ge, mergeRanges: _n, rangesOverlap: Cs }), { default: Ke }), Ke;
    });
  })(Tr)), Tr.exports;
}
var ef = Qc();
const zi = /* @__PURE__ */ Jc(ef), Co = Symbol.for("Dexie"), Cr = globalThis[Co] || (globalThis[Co] = zi);
if (zi.semVer !== Cr.semVer)
  throw new Error(`Two different versions of Dexie loaded in the same app: ${zi.semVer} and ${Cr.semVer}`);
const {
  liveQuery: df,
  mergeRanges: mf,
  rangesOverlap: pf,
  RangeSet: yf,
  cmp: gf,
  Entity: vf,
  PropModification: wf,
  replacePrefix: bf,
  add: kf,
  remove: _f,
  DexieYProvider: Sf
} = Cr, tf = 0, Tf = 1, La = 2, Bi = 3;
class Mi extends Error {
  constructor(e) {
    super(e), this.name = "KioskApiError";
  }
}
class Kt extends Error {
  constructor(e, r = null) {
    super(), this.msg = e, this.response = r;
  }
}
class xf {
  constructor(e = "/", r, i, a) {
    this.token = "", this.apiRoot = "/", this.lastErrorMessage = "", this.status = tf, e.startsWith("/") || (e = "/" + e), e.endsWith("/") || (e = e + "/"), this.apiRoot = e, console.log("The kioskApi apiRoot is " + this.apiRoot), this.apiURL = r, this.apiUser = i, this.apiPwd = a;
  }
  //abstract method
  getKioskRoute(e) {
    throw `KioskApi.getKioskRoute (${e})is not implemented`;
  }
  getApiUrl(e = "") {
    throw `KioskApi.getApiUrl (${e})is abstract and must not be called`;
  }
  getHeaders(e) {
    let r = new Headers();
    return r.append("Content-Type", e), r.append("Accept", e), r.append("Authorization", `Bearer ${this.token}`), r;
  }
  async initApi() {
    throw "KioskApi.initApi is abstract and must not be called";
  }
  /**
   * fetches JSON from the API
   * @param apiRoot
   * @param apiMethod
   * @param fetchParams
   * @param apiVersion
   * @param urlSearchParams
   * @param mimetype
   */
  async fetchFromApi(e, r, i, a = "v1", c = null, h = "application/json") {
    if (!this.token)
      throw new Mi("No api-token when calling fetchFromApi");
    let m = this.getHeaders(h), y = this.getApiUrl();
    console.log("apiURL is" + y), y.endsWith("/") || (y += "/");
    let E = `${y}${e ? e + "/" : ""}${a}/${r}`;
    "caller" in i ? console.log(`${i.caller} fetching from ${E}`) : console.log("fetching from " + E);
    let N = { ...i };
    N.headers = m, c && (E += "?" + new URLSearchParams(c));
    let C;
    try {
      console.log("fetching " + E), C = await fetch(E, N);
    } catch (W) {
      throw console.log(`caught ${W} in fetchFromApi after fetch`), new Kt(W);
    }
    if (C.ok)
      return await C.json();
    {
      const W = await C.json();
      throw console.log(`caught ${C.status} in fetchFromApi`), W && "result_msg" in W ? new Kt(W.result_msg, C) : new Kt(C.statusText, C);
    }
  }
  /**
   * returns the fetch address and the fetch parameters to be used with fetch.
   * the result is an object consisting of an attribute url - the address - and init - the
   * init parameter for fetch. init["headers"] has the headers for the fetch.
   * @param apiRoot
   * @param apiMethod
   * @param fetchParams
   * @param apiVersion
   * @param urlSearchParams
   * @param mimetype
   */
  getFetchURL(e, r, i, a = "v1", c = null, h = "application/json") {
    if (!this.token)
      throw new Mi("No api-token when calling getFetchURL ");
    let m = this.getHeaders(h), y = this.getApiUrl();
    y.endsWith("/") || (y += "/");
    let E = `${y}${e ? e + "/" : ""}${a}/${r}`;
    c && (E += "?" + new URLSearchParams(c));
    let N = { ...i };
    return N.headers = m, {
      url: E,
      init: N
    };
  }
  /**
   * fetches a Blob from the API
   * @param apiRoot
   * @param apiMethod
   * @param fetchParams
   * @param apiVersion
   * @param urlSearchParams
   * @param mimetype
   * @param attributes an optional dict that will be filled with width and height
   */
  async fetchBlobFromApi(e, r, i, a = "v1", c = null, h = "application/json", m = {}) {
    if (!this.token)
      throw new Mi("No api-token when calling fetchBlobFromApi");
    let y = this.getHeaders(h), E = this.getApiUrl();
    console.log("apiURL is" + E), E.endsWith("/") || (E += "/");
    let N = `${E}${e ? e + "/" : ""}${a}/${r}`;
    "caller" in i ? console.log(`${i.caller} fetching from ${N}`) : console.log("fetching from " + N);
    let C = { ...i };
    C.headers = y, c && (N += "?" + new URLSearchParams(c));
    let W;
    try {
      console.log("fetching " + N), W = await fetch(N, C);
    } catch (j) {
      throw console.log(`caught ${j} in fetchBlobFromApi after fetch`), new Kt(j);
    }
    if (W.ok)
      return W.headers.has("X-Image-Height") && (m.height = W.headers.get("X-Image-Height")), W.headers.has("X-Image-Width") && (m.width = W.headers.get("X-Image-Width")), await W.blob();
    {
      const j = await W.json();
      throw console.log(`caught ${W.status} in fetchBlobFromApi`), j && "result_msg" in j ? new Kt(j.result_msg, W) : new Kt(W.statusText, W);
    }
  }
}
const nf = class extends Gt {
  constructor() {
    super(), this.kioskBaseUrl = "", this.autoRenderProgress = !0, this.autoRenderErrors = !0, this.appErrors = [], this.apiContext = void 0, this.showProgress = !1;
  }
  onAppMessage(e) {
    console.log("Unhandled AppMessage received", e.detail), this.addAppError(e.detail.headline + "<br>" + e.detail.body);
  }
  firstUpdated(e) {
    super.firstUpdated(e), this.addEventListener("send-message", this.onAppMessage);
  }
  updated(e) {
    e.has("apiContext") && (this.showProgress = !1, this.apiContext && this.apiContext.status === Bi && this.addAppError("Cannot connect to Kiosk API."), !e.apiContext && this.apiContext && this.apiConnected());
  }
  apiConnected() {
  }
  render() {
    let e;
    return this.apiContext && this.apiContext.status === La ? e = this.apiRender() : this.apiContext && this.apiContext.status === Bi ? e = this.renderApiError() : e = this.renderNoContextYet(), st`
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
            <link rel="stylesheet" href="${this.kioskBaseUrl}static/styles.css" />
            ${this.autoRenderProgress ? this.renderProgress() : he} ${this.autoRenderErrors ? this.renderErrors() : he} ${e}
        `;
  }
  renderNoContextYet() {
    return st` <link rel="stylesheet" href="${this.kioskBaseUrl}static/styles.css" /> `;
  }
  renderApiError() {
  }
  renderErrors() {
    return this.appErrors.length > 0 ? st` ${this.appErrors.map((e) => st`<div class="system-message" @click="${this.errorClicked}"><span>${e}</span><i>x</i></div>`)} ` : he;
  }
  errorClicked(e) {
    let r = e.currentTarget.children[0].textContent;
    r && this.deleteError(r);
  }
  renderProgress(e = !1) {
    if (e || this.showProgress)
      return st` <div class="loading">
                <div class="loading-progress"></div>
            </div>`;
  }
  addAppError(e) {
    this.appErrors.push(e), this.requestUpdate();
  }
  clearAppErrors() {
    this.appErrors = [], this.requestUpdate();
  }
  deleteError(e) {
    let r = -1;
    this.appErrors.find((i, a) => i === e ? (r = a, !0) : !1), r > -1 && (this.appErrors.splice(r, 1), this.appErrors = [...this.appErrors]);
  }
};
nf.properties = {
  apiContext: { type: Object },
  appErrors: { type: Array },
  showProgress: { type: Boolean },
  kioskBaseUrl: { type: String }
};
var rf = Object.defineProperty, ja = (s, e, r, i) => {
  for (var a = void 0, c = s.length - 1, h; c >= 0; c--)
    (h = s[c]) && (a = h(e, r, a) || a);
  return a && rf(e, r, a), a;
};
const Wa = class extends Gt {
  constructor() {
    super(), this.showProgress = !1, this.kioskBaseUrl = "", this.apiContext = void 0;
  }
  updated(e) {
    e.has("apiContext") && (this.showProgress = !1);
  }
  /**
   * dispatches a BeforeEvent and coordinates calling cancelCallback and finishCallback either synchronously or asynchronously, if the
   * consumer of the event used .defer on the event object.
   *
   * The dispatched BeforeEvent has a method "defer" which returns a deferrance object that itself has methods finish and cancel.
   * One of those must be called to complete the event asynchronously.
   *
   * example for an emitter:
   *   tryClose() {
   *       if (!this.emitBeforeEvent("beforeClose", {},
   *           () => {
   *               this.closeDeferred = false
   *           },
   *           () => {
   *               this.open = false
   *           })
   *       ) this.closeDeferred = true
   * }
   *
   * example for an async consumer:
   *   beforeCloseLightbox(e: BeforeEvent) {
   *       const defObj = e.detail.defer(e)
   *       setTimeout(()=>defObj.finish(),1000)
   *   }
   *
   * example for a sync consumer that let's the event succeed:
   *   beforeCloseLightbox(e: BeforeEvent) {
   *       e.stopPropagation()
   *   }
   *
   *  example for a sync consumer that cancels the event:
   *   beforeCloseLightbox(e: BeforeEvent) {
   *       e.stopPropagation()
   *       e.preventDefault()
   *   }
   *
   * @param eventName Name a consumer can listen to
   * @param detail additional data to send to the consumer
   * @param cancelCallback the code to run in case the event gets cancelled (either synchronously or asynchronously)
   * @param finishCallback the code to run in case the event's default behaviour may proceed (either synchronously or asynchronously)
   * @returns false if the consumer of the event asked to defer the result of the event,
   *              otherwise true (in which case the default behaviour will run synchronously)
   */
  emitBeforeEvent(e, r, i, a) {
    let c = {
      // some this math is going on in here: here this points to the beforeEventDetail object. That's why the component's this needed saving
      component: this,
      _defer: !1,
      defer: function(m = void 0) {
        return this._defer = !0, m && (m.stopPropagation(), m.preventDefault()), {
          cancel: () => {
            this.component.updateComplete.then(() => {
              i();
            });
          },
          finish: () => {
            this.component.updateComplete.then(() => {
              a();
            });
          }
        };
      }
    };
    Object.assign(c, r);
    const h = new CustomEvent(e, {
      bubbles: !0,
      composed: !0,
      cancelable: !0,
      detail: c
    });
    if (this.dispatchEvent(h))
      a();
    else {
      if (c._defer)
        return !1;
      i();
    }
    return !0;
  }
  render() {
    let e;
    return this.apiContext && this.apiContext.status === La ? e = this.apiRender() : this.apiContext && this.apiContext.status === Bi ? e = this.renderApiError() : e = this.renderNoContextYet(), st`
            <link rel="stylesheet" href="${this.kioskBaseUrl}static/styles.css" />
            ${e}
        `;
  }
  renderNoContextYet() {
    return st` <link rel="stylesheet" href="${this.kioskBaseUrl}static/styles.css" /> `;
  }
  renderApiError() {
  }
  renderProgress(e = !1) {
    if (e || this.showProgress)
      return st` <div class="loading">
                <div class="loading-progress"></div>
            </div>`;
  }
};
Wa.properties = {
  /**
   * The Api Context
   */
  apiContext: { type: Object }
};
let Ka = Wa;
ja([
  Yc()
], Ka.prototype, "showProgress");
ja([
  qa()
], Ka.prototype, "kioskBaseUrl");
class If {
  constructor(e) {
    this.apiContext = void 0, this.db = void 0, this.hasRefreshedFavourites = !1, this.hasRefreshedAll = !1, this.localCache = /* @__PURE__ */ new Map(), this.apiContext = e, this.db = this.initDb();
  }
  initDb() {
    const e = new Cr("KioskTimeZones");
    return e.version(1).stores({
      kioskTimeZones: "&id, tz_long, tz_IANA, deprecated, version, favourite"
    }), e;
  }
  getLocalCache() {
    return this.localCache;
  }
  async getFavouriteTimeZones(e = !1, r = !1) {
    if (this.db) {
      const i = await this.db.kioskTimeZones.count();
      let a;
      return i == 0 && await this.refreshFavourites(), e ? a = await this.db.kioskTimeZones.where({ favourite: 1 }).toArray() : a = await this.db.kioskTimeZones.where({ deprecated: 0, favourite: 1 }).toArray(), r && this.refreshFavourites().finally(() => {
        console.log("refreshed favourites");
      }), a;
    } else return [];
  }
  async refreshFavourites() {
    if (!this.db) return [];
    if (!this.hasRefreshedFavourites) {
      const e = await this.fetchFavouriteTimeZones();
      if (e && e.length > 0) {
        let r = await this.db?.kioskTimeZones.where("favourite").equals(1).delete();
        console.log(`Deleted ${r} favourite time zones`);
        const i = e.map((c) => ({
          id: c.id,
          tz_IANA: c.tz_IANA,
          tz_long: c.tz_long,
          deprecated: c.deprecated ? 1 : 0,
          version: c.version,
          favourite: 1
        }));
        let a = await this.db?.kioskTimeZones.bulkAdd(i);
        return console.log(`Added ${a} new favourite time zones`), this.hasRefreshedFavourites = !0, i;
      }
    }
    return [];
  }
  async fetchFavouriteTimeZones() {
    return await this.apiContext?.fetchFromApi(
      "",
      "favouritetimezones",
      {
        method: "GET",
        caller: "app.fetchFavouriteTimeZones"
      }
    ).then((e) => (console.log("favourite time zone information fetched"), e)).catch((e) => (console.log(`fetching time zone information failed: ${e}`), []));
  }
  async fetchAllTimeZones(e = 0) {
    const r = new URLSearchParams();
    return r.append("include_deprecated", "true"), e > 0 && r.append("newer_than", `${e}`), await this.apiContext?.fetchFromApi(
      "",
      "timezones",
      {
        method: "GET",
        caller: "app.fetchFavouriteTimeZones"
      },
      "v1",
      r
    ).then((i) => (console.log("time zone information fetched"), i)).catch((i) => (console.log(`time zone information failed: ${i}`), []));
  }
  async getAllTimeZones(e = !1, r = !1) {
    return await this.refreshAllTimeZones(r), (await this.db?.kioskTimeZones.toArray())?.filter((i) => i.deprecated == 0 || e);
  }
  async getTimeZoneByIndex(e, r = !1) {
    if (!this.db) return;
    await this.refreshAllTimeZones(r);
    let i = await this.db.kioskTimeZones.where("id").equals(e).toArray();
    return i.length > 0 ? i[0] : void 0;
  }
  /**
   * Asynchronously caches the time zone information locally based on the provided timezone index.
   * Locally cached time zone information can be retrieved synchronously using getTimeZoneInfoFromLocalCache
   * @param tzIndex a Kiosk Time Zone Index
   * @param tryRefresh Flag indicating whether to refresh the timezone information if not found in the cache.
   * @returns A Promise that resolves to the cached TimeZone object if found, otherwise undefined.
   */
  async cacheLocally(e, r = !1) {
    if (!this.db || typeof e != "number") return;
    let i = this.localCache.get(e);
    if (i) return i;
    if (i = await this.getTimeZoneByIndex(e), !i) {
      if (!r) return;
      await this.refreshAllTimeZones(!1), i = await this.getTimeZoneByIndex(e);
    }
    return i && (console.log("Cached TimeZone", i), this.localCache.set(e, i)), this.localCache.get(e);
  }
  /**
   * Retrieves timezone information from the local cache based on the provided timezone index.
   * Unlike other methods this is synchronous.
   * @param tzIndex - The index of the timezone to retrieve information for.
   * @returns a TimeZone instance if found in the local cache, otherwise undefined.
   */
  getTimeZoneInfoFromLocalCache(e) {
    if (typeof e == "string" && (e = parseInt(e)), !!e)
      return this.localCache.get(e);
  }
  async refreshAllTimeZones(e) {
    let r = [];
    if (this.db && (e || !this.hasRefreshedAll)) {
      let i = 0;
      const a = (await this.getFavouriteTimeZones()).filter((h) => h.favourite == 1).map((h) => h.id);
      if (!e)
        try {
          i = (await this.db.kioskTimeZones.where("favourite").equals(0).reverse().sortBy("version"))[0].version, console.log(`max version was ${i}`);
        } catch {
        }
      const c = await this.fetchAllTimeZones(i);
      if (c && c.length > 0) {
        let h = await this.db.kioskTimeZones.where("version").above(i).delete();
        console.log(`delete ${h} time zones above version ${i}`), r = c.map((m) => ({
          id: m.id,
          tz_IANA: m.tz_IANA,
          tz_long: m.tz_long,
          deprecated: m.deprecated ? 1 : 0,
          version: m.version,
          favourite: a.includes(m.id) ? 1 : 0
        })), h = await this.db.kioskTimeZones.bulkAdd(r), console.log(`added ${h} new time zones `);
      }
      this.hasRefreshedAll = !0;
    }
  }
}
export {
  Bi as API_STATE_ERROR,
  Tf as API_STATE_INITIALIZING,
  La as API_STATE_READY,
  tf as API_STATE_UNINITIALZED,
  Kt as FetchException,
  xf as KioskApi,
  If as KioskTimeZones,
  af as kioskdatetime,
  sf as kioskstandardlib,
  of as luxon
};
