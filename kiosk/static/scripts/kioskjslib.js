function bu(s, e, r = 0) {
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
const Yc = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  getCookie: xt,
  setCookie: bu
}, Symbol.toStringTag, { value: "Module" }));
class Ct extends Error {
}
class wu extends Ct {
  constructor(e) {
    super(`Invalid DateTime: ${e.toMessage()}`);
  }
}
class ku extends Ct {
  constructor(e) {
    super(`Invalid Interval: ${e.toMessage()}`);
  }
}
class _u extends Ct {
  constructor(e) {
    super(`Invalid Duration: ${e.toMessage()}`);
  }
}
class Zt extends Ct {
}
class Do extends Ct {
  constructor(e) {
    super(`Invalid unit ${e}`);
  }
}
class ve extends Ct {
}
class tt extends Ct {
  constructor() {
    super("Zone is an abstract class");
  }
}
const V = "numeric", Fe = "short", xe = "long", Er = {
  year: V,
  month: V,
  day: V
}, $o = {
  year: V,
  month: Fe,
  day: V
}, Su = {
  year: V,
  month: Fe,
  day: V,
  weekday: Fe
}, No = {
  year: V,
  month: xe,
  day: V
}, Mo = {
  year: V,
  month: xe,
  day: V,
  weekday: xe
}, Po = {
  hour: V,
  minute: V
}, Fo = {
  hour: V,
  minute: V,
  second: V
}, Ro = {
  hour: V,
  minute: V,
  second: V,
  timeZoneName: Fe
}, Vo = {
  hour: V,
  minute: V,
  second: V,
  timeZoneName: xe
}, qo = {
  hour: V,
  minute: V,
  hourCycle: "h23"
}, Lo = {
  hour: V,
  minute: V,
  second: V,
  hourCycle: "h23"
}, Uo = {
  hour: V,
  minute: V,
  second: V,
  hourCycle: "h23",
  timeZoneName: Fe
}, jo = {
  hour: V,
  minute: V,
  second: V,
  hourCycle: "h23",
  timeZoneName: xe
}, Wo = {
  year: V,
  month: V,
  day: V,
  hour: V,
  minute: V
}, Ko = {
  year: V,
  month: V,
  day: V,
  hour: V,
  minute: V,
  second: V
}, zo = {
  year: V,
  month: Fe,
  day: V,
  hour: V,
  minute: V
}, Zo = {
  year: V,
  month: Fe,
  day: V,
  hour: V,
  minute: V,
  second: V
}, Tu = {
  year: V,
  month: Fe,
  day: V,
  weekday: Fe,
  hour: V,
  minute: V
}, Bo = {
  year: V,
  month: xe,
  day: V,
  hour: V,
  minute: V,
  timeZoneName: Fe
}, Ho = {
  year: V,
  month: xe,
  day: V,
  hour: V,
  minute: V,
  second: V,
  timeZoneName: Fe
}, Yo = {
  year: V,
  month: xe,
  day: V,
  weekday: xe,
  hour: V,
  minute: V,
  timeZoneName: xe
}, Go = {
  year: V,
  month: xe,
  day: V,
  weekday: xe,
  hour: V,
  minute: V,
  second: V,
  timeZoneName: xe
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
let Ti = null;
class Pn extends en {
  /**
   * Get a singleton instance of the local zone
   * @return {SystemZone}
   */
  static get instance() {
    return Ti === null && (Ti = new Pn()), Ti;
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
    return oa(e, r, i);
  }
  /** @override **/
  formatOffset(e, r) {
    return In(this.offset(e), r);
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
let kr = {};
function Ou(s) {
  return kr[s] || (kr[s] = new Intl.DateTimeFormat("en-US", {
    hour12: !1,
    timeZone: s,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    era: "short"
  })), kr[s];
}
const xu = {
  year: 0,
  month: 1,
  day: 2,
  era: 3,
  hour: 4,
  minute: 5,
  second: 6
};
function Eu(s, e) {
  const r = s.format(e).replace(/\u200E/g, ""), i = /(\d+)\/(\d+)\/(\d+) (AD|BC),? (\d+):(\d+):(\d+)/.exec(r), [, a, c, h, m, g, A, L] = i;
  return [h, a, c, m, g, A, L];
}
function Iu(s, e) {
  const r = s.formatToParts(e), i = [];
  for (let a = 0; a < r.length; a++) {
    const { type: c, value: h } = r[a], m = xu[c];
    c === "era" ? i[m] = h : B(m) || (i[m] = parseInt(h, 10));
  }
  return i;
}
let yr = {};
class Ue extends en {
  /**
   * @param {string} name - Zone name
   * @return {IANAZone}
   */
  static create(e) {
    return yr[e] || (yr[e] = new Ue(e)), yr[e];
  }
  /**
   * Reset local caches. Should only be necessary in testing scenarios.
   * @return {void}
   */
  static resetCache() {
    yr = {}, kr = {};
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
    super(), this.zoneName = e, this.valid = Ue.isValidZone(e);
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
    return oa(e, r, i, this.name);
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
    return In(this.offset(e), r);
  }
  /**
   * Return the offset in minutes for this zone at the specified timestamp.
   * @override
   * @param {number} ts - Epoch milliseconds for which to compute the offset
   * @return {number}
   */
  offset(e) {
    const r = new Date(e);
    if (isNaN(r)) return NaN;
    const i = Ou(this.name);
    let [a, c, h, m, g, A, L] = i.formatToParts ? Iu(i, r) : Eu(i, r);
    m === "BC" && (a = -Math.abs(a) + 1);
    const Z = Mr({
      year: a,
      month: c,
      day: h,
      hour: g === 24 ? 0 : g,
      minute: A,
      second: L,
      millisecond: 0
    });
    let W = +r;
    const ee = W % 1e3;
    return W -= ee >= 0 ? ee : 1e3 + ee, (Z - W) / (60 * 1e3);
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
let Ls = {};
function Au(s, e = {}) {
  const r = JSON.stringify([s, e]);
  let i = Ls[r];
  return i || (i = new Intl.ListFormat(s, e), Ls[r] = i), i;
}
let Fi = {};
function Ri(s, e = {}) {
  const r = JSON.stringify([s, e]);
  let i = Fi[r];
  return i || (i = new Intl.DateTimeFormat(s, e), Fi[r] = i), i;
}
let Vi = {};
function Cu(s, e = {}) {
  const r = JSON.stringify([s, e]);
  let i = Vi[r];
  return i || (i = new Intl.NumberFormat(s, e), Vi[r] = i), i;
}
let qi = {};
function Du(s, e = {}) {
  const { base: r, ...i } = e, a = JSON.stringify([s, i]);
  let c = qi[a];
  return c || (c = new Intl.RelativeTimeFormat(s, e), qi[a] = c), c;
}
let On = null;
function $u() {
  return On || (On = new Intl.DateTimeFormat().resolvedOptions().locale, On);
}
let Us = {};
function Nu(s) {
  let e = Us[s];
  if (!e) {
    const r = new Intl.Locale(s);
    e = "getWeekInfo" in r ? r.getWeekInfo() : r.weekInfo, Us[s] = e;
  }
  return e;
}
function Mu(s) {
  const e = s.indexOf("-x-");
  e !== -1 && (s = s.substring(0, e));
  const r = s.indexOf("-u-");
  if (r === -1)
    return [s];
  {
    let i, a;
    try {
      i = Ri(s).resolvedOptions(), a = s;
    } catch {
      const g = s.substring(0, r);
      i = Ri(g).resolvedOptions(), a = g;
    }
    const { numberingSystem: c, calendar: h } = i;
    return [a, c, h];
  }
}
function Pu(s, e, r) {
  return (r || e) && (s.includes("-u-") || (s += "-u"), r && (s += `-ca-${r}`), e && (s += `-nu-${e}`)), s;
}
function Fu(s) {
  const e = [];
  for (let r = 1; r <= 12; r++) {
    const i = z.utc(2009, r, 1);
    e.push(s(i));
  }
  return e;
}
function Ru(s) {
  const e = [];
  for (let r = 1; r <= 7; r++) {
    const i = z.utc(2016, 11, 13 + r);
    e.push(s(i));
  }
  return e;
}
function gr(s, e, r, i) {
  const a = s.listingMode();
  return a === "error" ? null : a === "en" ? r(e) : i(e);
}
function Vu(s) {
  return s.numberingSystem && s.numberingSystem !== "latn" ? !1 : s.numberingSystem === "latn" || !s.locale || s.locale.startsWith("en") || new Intl.DateTimeFormat(s.intl).resolvedOptions().numberingSystem === "latn";
}
class qu {
  constructor(e, r, i) {
    this.padTo = i.padTo || 0, this.floor = i.floor || !1;
    const { padTo: a, floor: c, ...h } = i;
    if (!r || Object.keys(h).length > 0) {
      const m = { useGrouping: !1, ...i };
      i.padTo > 0 && (m.minimumIntegerDigits = i.padTo), this.inf = Cu(e, m);
    }
  }
  format(e) {
    if (this.inf) {
      const r = this.floor ? Math.floor(e) : e;
      return this.inf.format(r);
    } else {
      const r = this.floor ? Math.floor(e) : Gi(e, 3);
      return fe(r, this.padTo);
    }
  }
}
class Lu {
  constructor(e, r, i) {
    this.opts = i, this.originalZone = void 0;
    let a;
    if (this.opts.timeZone)
      this.dt = e;
    else if (e.zone.type === "fixed") {
      const h = -1 * (e.offset / 60), m = h >= 0 ? `Etc/GMT+${h}` : `Etc/GMT${h}`;
      e.offset !== 0 && Ue.create(m).valid ? (a = m, this.dt = e) : (a = "UTC", this.dt = e.offset === 0 ? e : e.setZone("UTC").plus({ minutes: e.offset }), this.originalZone = e.zone);
    } else e.zone.type === "system" ? this.dt = e : e.zone.type === "iana" ? (this.dt = e, a = e.zone.name) : (a = "UTC", this.dt = e.setZone("UTC").plus({ minutes: e.offset }), this.originalZone = e.zone);
    const c = { ...this.opts };
    c.timeZone = c.timeZone || a, this.dtf = Ri(r, c);
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
class Uu {
  constructor(e, r, i) {
    this.opts = { style: "long", ...i }, !r && ia() && (this.rtf = Du(e, i));
  }
  format(e, r) {
    return this.rtf ? this.rtf.format(e, r) : ll(r, e, this.opts.numeric, this.opts.style !== "long");
  }
  formatToParts(e, r) {
    return this.rtf ? this.rtf.formatToParts(e, r) : [];
  }
}
const ju = {
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
    const h = e || ue.defaultLocale, m = h || (c ? "en-US" : $u()), g = r || ue.defaultNumberingSystem, A = i || ue.defaultOutputCalendar, L = Li(a) || ue.defaultWeekSettings;
    return new re(m, g, A, L, h);
  }
  static resetCache() {
    On = null, Fi = {}, Vi = {}, qi = {};
  }
  static fromObject({ locale: e, numberingSystem: r, outputCalendar: i, weekSettings: a } = {}) {
    return re.create(e, r, i, a);
  }
  constructor(e, r, i, a, c) {
    const [h, m, g] = Mu(e);
    this.locale = h, this.numberingSystem = r || m || null, this.outputCalendar = i || g || null, this.weekSettings = a, this.intl = Pu(this.locale, this.numberingSystem, this.outputCalendar), this.weekdaysCache = { format: {}, standalone: {} }, this.monthsCache = { format: {}, standalone: {} }, this.meridiemCache = null, this.eraCache = {}, this.specifiedLocale = c, this.fastNumbersCached = null;
  }
  get fastNumbers() {
    return this.fastNumbersCached == null && (this.fastNumbersCached = Vu(this)), this.fastNumbersCached;
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
      Li(e.weekSettings) || this.weekSettings,
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
    return gr(this, e, la, () => {
      const i = r ? { month: e, day: "numeric" } : { month: e }, a = r ? "format" : "standalone";
      return this.monthsCache[a][e] || (this.monthsCache[a][e] = Fu((c) => this.extract(c, i, "month"))), this.monthsCache[a][e];
    });
  }
  weekdays(e, r = !1) {
    return gr(this, e, ha, () => {
      const i = r ? { weekday: e, year: "numeric", month: "long", day: "numeric" } : { weekday: e }, a = r ? "format" : "standalone";
      return this.weekdaysCache[a][e] || (this.weekdaysCache[a][e] = Ru(
        (c) => this.extract(c, i, "weekday")
      )), this.weekdaysCache[a][e];
    });
  }
  meridiems() {
    return gr(
      this,
      void 0,
      () => da,
      () => {
        if (!this.meridiemCache) {
          const e = { hour: "numeric", hourCycle: "h12" };
          this.meridiemCache = [z.utc(2016, 11, 13, 9), z.utc(2016, 11, 13, 19)].map(
            (r) => this.extract(r, e, "dayperiod")
          );
        }
        return this.meridiemCache;
      }
    );
  }
  eras(e) {
    return gr(this, e, ma, () => {
      const r = { era: e };
      return this.eraCache[e] || (this.eraCache[e] = [z.utc(-40, 1, 1), z.utc(2017, 1, 1)].map(
        (i) => this.extract(i, r, "era")
      )), this.eraCache[e];
    });
  }
  extract(e, r, i) {
    const a = this.dtFormatter(e, r), c = a.formatToParts(), h = c.find((m) => m.type.toLowerCase() === i);
    return h ? h.value : null;
  }
  numberFormatter(e = {}) {
    return new qu(this.intl, e.forceSimple || this.fastNumbers, e);
  }
  dtFormatter(e, r = {}) {
    return new Lu(e, this.intl, r);
  }
  relFormatter(e = {}) {
    return new Uu(this.intl, this.isEnglish(), e);
  }
  listFormatter(e = {}) {
    return Au(this.intl, e);
  }
  isEnglish() {
    return this.locale === "en" || this.locale.toLowerCase() === "en-us" || new Intl.DateTimeFormat(this.intl).resolvedOptions().locale.startsWith("en-us");
  }
  getWeekSettings() {
    return this.weekSettings ? this.weekSettings : sa() ? Nu(this.locale) : ju;
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
let Oi = null;
class we extends en {
  /**
   * Get a singleton instance of UTC
   * @return {FixedOffsetZone}
   */
  static get utcInstance() {
    return Oi === null && (Oi = new we(0)), Oi;
  }
  /**
   * Get an instance with a specified offset
   * @param {number} offset - The offset in minutes
   * @return {FixedOffsetZone}
   */
  static instance(e) {
    return e === 0 ? we.utcInstance : new we(e);
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
        return new we(Pr(r[1], r[2]));
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
    return this.fixed === 0 ? "UTC" : `UTC${In(this.fixed, "narrow")}`;
  }
  /**
   * The IANA name of this zone, i.e. `Etc/UTC` or `Etc/GMT+/-nn`
   *
   * @override
   * @type {string}
   */
  get ianaName() {
    return this.fixed === 0 ? "Etc/UTC" : `Etc/GMT${In(-this.fixed, "narrow")}`;
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
    return In(this.fixed, r);
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
class Jo extends en {
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
function it(s, e) {
  if (B(s) || s === null)
    return e;
  if (s instanceof en)
    return s;
  if (Hu(s)) {
    const r = s.toLowerCase();
    return r === "default" ? e : r === "local" || r === "system" ? Pn.instance : r === "utc" || r === "gmt" ? we.utcInstance : we.parseSpecifier(r) || Ue.create(s);
  } else return at(s) ? we.instance(s) : typeof s == "object" && "offset" in s && typeof s.offset == "function" ? s : new Jo(s);
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
}, js = {
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
}, Wu = Zi.hanidec.replace(/[\[|\]]/g, "").split("");
function Ku(s) {
  let e = parseInt(s, 10);
  if (isNaN(e)) {
    e = "";
    for (let r = 0; r < s.length; r++) {
      const i = s.charCodeAt(r);
      if (s[r].search(Zi.hanidec) !== -1)
        e += Wu.indexOf(s[r]);
      else
        for (const a in js) {
          const [c, h] = js[a];
          i >= c && i <= h && (e += i - c);
        }
    }
    return parseInt(e, 10);
  } else
    return e;
}
let Kt = {};
function zu() {
  Kt = {};
}
function Ne({ numberingSystem: s }, e = "") {
  const r = s || "latn";
  return Kt[r] || (Kt[r] = {}), Kt[r][e] || (Kt[r][e] = new RegExp(`${Zi[r]}${e}`)), Kt[r][e];
}
let Ws = () => Date.now(), Ks = "system", zs = null, Zs = null, Bs = null, Hs = 60, Ys, Gs = null;
class ue {
  /**
   * Get the callback for returning the current timestamp.
   * @type {function}
   */
  static get now() {
    return Ws;
  }
  /**
   * Set the callback for returning the current timestamp.
   * The function should return a number, which will be interpreted as an Epoch millisecond count
   * @type {function}
   * @example Settings.now = () => Date.now() + 3000 // pretend it is 3 seconds in the future
   * @example Settings.now = () => 0 // always pretend it's Jan 1, 1970 at midnight in UTC time
   */
  static set now(e) {
    Ws = e;
  }
  /**
   * Set the default time zone to create DateTimes in. Does not affect existing instances.
   * Use the value "system" to reset this value to the system's time zone.
   * @type {string}
   */
  static set defaultZone(e) {
    Ks = e;
  }
  /**
   * Get the default time zone object currently used to create DateTimes. Does not affect existing instances.
   * The default value is the system's time zone (the one set on the machine that runs this code).
   * @type {Zone}
   */
  static get defaultZone() {
    return it(Ks, Pn.instance);
  }
  /**
   * Get the default locale to create DateTimes with. Does not affect existing instances.
   * @type {string}
   */
  static get defaultLocale() {
    return zs;
  }
  /**
   * Set the default locale to create DateTimes with. Does not affect existing instances.
   * @type {string}
   */
  static set defaultLocale(e) {
    zs = e;
  }
  /**
   * Get the default numbering system to create DateTimes with. Does not affect existing instances.
   * @type {string}
   */
  static get defaultNumberingSystem() {
    return Zs;
  }
  /**
   * Set the default numbering system to create DateTimes with. Does not affect existing instances.
   * @type {string}
   */
  static set defaultNumberingSystem(e) {
    Zs = e;
  }
  /**
   * Get the default output calendar to create DateTimes with. Does not affect existing instances.
   * @type {string}
   */
  static get defaultOutputCalendar() {
    return Bs;
  }
  /**
   * Set the default output calendar to create DateTimes with. Does not affect existing instances.
   * @type {string}
   */
  static set defaultOutputCalendar(e) {
    Bs = e;
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
    return Gs;
  }
  /**
   * Allows overriding the default locale week settings, i.e. the start of the week, the weekend and
   * how many days are required in the first week of a year.
   * Does not affect existing instances.
   *
   * @param {WeekSettings|null} weekSettings
   */
  static set defaultWeekSettings(e) {
    Gs = Li(e);
  }
  /**
   * Get the cutoff year for whether a 2-digit year string is interpreted in the current or previous century. Numbers higher than the cutoff will be considered to mean 19xx and numbers lower or equal to the cutoff will be considered 20xx.
   * @type {number}
   */
  static get twoDigitCutoffYear() {
    return Hs;
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
    Hs = e % 100;
  }
  /**
   * Get whether Luxon will throw when it encounters invalid DateTimes, Durations, or Intervals
   * @type {boolean}
   */
  static get throwOnInvalid() {
    return Ys;
  }
  /**
   * Set whether Luxon will throw when it encounters invalid DateTimes, Durations, or Intervals
   * @type {boolean}
   */
  static set throwOnInvalid(e) {
    Ys = e;
  }
  /**
   * Reset Luxon's global caches. Should only be necessary in testing scenarios.
   * @return {void}
   */
  static resetCaches() {
    re.resetCache(), Ue.resetCache(), z.resetCache(), zu();
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
const Xo = [0, 31, 59, 90, 120, 151, 181, 212, 243, 273, 304, 334], Qo = [0, 31, 60, 91, 121, 152, 182, 213, 244, 274, 305, 335];
function Ce(s, e) {
  return new Pe(
    "unit out of range",
    `you specified ${e} (of type ${typeof e}) as a ${s}, which is invalid`
  );
}
function Bi(s, e, r) {
  const i = new Date(Date.UTC(s, e - 1, r));
  s < 100 && s >= 0 && i.setUTCFullYear(i.getUTCFullYear() - 1900);
  const a = i.getUTCDay();
  return a === 0 ? 7 : a;
}
function ea(s, e, r) {
  return r + (Fn(s) ? Qo : Xo)[e - 1];
}
function ta(s, e) {
  const r = Fn(s) ? Qo : Xo, i = r.findIndex((c) => c < e), a = e - r[i];
  return { month: i + 1, day: a };
}
function Hi(s, e) {
  return (s - e + 7) % 7 + 1;
}
function Ir(s, e = 4, r = 1) {
  const { year: i, month: a, day: c } = s, h = ea(i, a, c), m = Hi(Bi(i, a, c), r);
  let g = Math.floor((h - m + 14 - e) / 7), A;
  return g < 1 ? (A = i - 1, g = Dn(A, e, r)) : g > Dn(i, e, r) ? (A = i + 1, g = 1) : A = i, { weekYear: A, weekNumber: g, weekday: m, ...Fr(s) };
}
function Js(s, e = 4, r = 1) {
  const { weekYear: i, weekNumber: a, weekday: c } = s, h = Hi(Bi(i, 1, e), r), m = Ht(i);
  let g = a * 7 + c - h - 7 + e, A;
  g < 1 ? (A = i - 1, g += Ht(A)) : g > m ? (A = i + 1, g -= Ht(i)) : A = i;
  const { month: L, day: M } = ta(A, g);
  return { year: A, month: L, day: M, ...Fr(s) };
}
function xi(s) {
  const { year: e, month: r, day: i } = s, a = ea(e, r, i);
  return { year: e, ordinal: a, ...Fr(s) };
}
function Xs(s) {
  const { year: e, ordinal: r } = s, { month: i, day: a } = ta(e, r);
  return { year: e, month: i, day: a, ...Fr(s) };
}
function Qs(s, e) {
  if (!B(s.localWeekday) || !B(s.localWeekNumber) || !B(s.localWeekYear)) {
    if (!B(s.weekday) || !B(s.weekNumber) || !B(s.weekYear))
      throw new Zt(
        "Cannot mix locale-based week fields with ISO-based week fields"
      );
    return B(s.localWeekday) || (s.weekday = s.localWeekday), B(s.localWeekNumber) || (s.weekNumber = s.localWeekNumber), B(s.localWeekYear) || (s.weekYear = s.localWeekYear), delete s.localWeekday, delete s.localWeekNumber, delete s.localWeekYear, {
      minDaysInFirstWeek: e.getMinDaysInFirstWeek(),
      startOfWeek: e.getStartOfWeek()
    };
  } else
    return { minDaysInFirstWeek: 4, startOfWeek: 1 };
}
function Zu(s, e = 4, r = 1) {
  const i = Nr(s.weekYear), a = De(
    s.weekNumber,
    1,
    Dn(s.weekYear, e, r)
  ), c = De(s.weekday, 1, 7);
  return i ? a ? c ? !1 : Ce("weekday", s.weekday) : Ce("week", s.weekNumber) : Ce("weekYear", s.weekYear);
}
function Bu(s) {
  const e = Nr(s.year), r = De(s.ordinal, 1, Ht(s.year));
  return e ? r ? !1 : Ce("ordinal", s.ordinal) : Ce("year", s.year);
}
function na(s) {
  const e = Nr(s.year), r = De(s.month, 1, 12), i = De(s.day, 1, Ar(s.year, s.month));
  return e ? r ? i ? !1 : Ce("day", s.day) : Ce("month", s.month) : Ce("year", s.year);
}
function ra(s) {
  const { hour: e, minute: r, second: i, millisecond: a } = s, c = De(e, 0, 23) || e === 24 && r === 0 && i === 0 && a === 0, h = De(r, 0, 59), m = De(i, 0, 59), g = De(a, 0, 999);
  return c ? h ? m ? g ? !1 : Ce("millisecond", a) : Ce("second", i) : Ce("minute", r) : Ce("hour", e);
}
function B(s) {
  return typeof s > "u";
}
function at(s) {
  return typeof s == "number";
}
function Nr(s) {
  return typeof s == "number" && s % 1 === 0;
}
function Hu(s) {
  return typeof s == "string";
}
function Yu(s) {
  return Object.prototype.toString.call(s) === "[object Date]";
}
function ia() {
  try {
    return typeof Intl < "u" && !!Intl.RelativeTimeFormat;
  } catch {
    return !1;
  }
}
function sa() {
  try {
    return typeof Intl < "u" && !!Intl.Locale && ("weekInfo" in Intl.Locale.prototype || "getWeekInfo" in Intl.Locale.prototype);
  } catch {
    return !1;
  }
}
function Gu(s) {
  return Array.isArray(s) ? s : [s];
}
function eo(s, e, r) {
  if (s.length !== 0)
    return s.reduce((i, a) => {
      const c = [e(a), a];
      return i && r(i[0], c[0]) === i[0] ? i : c;
    }, null)[1];
}
function Ju(s, e) {
  return e.reduce((r, i) => (r[i] = s[i], r), {});
}
function Jt(s, e) {
  return Object.prototype.hasOwnProperty.call(s, e);
}
function Li(s) {
  if (s == null)
    return null;
  if (typeof s != "object")
    throw new ve("Week settings must be an object");
  if (!De(s.firstDay, 1, 7) || !De(s.minimalDays, 1, 7) || !Array.isArray(s.weekend) || s.weekend.some((e) => !De(e, 1, 7)))
    throw new ve("Invalid week settings");
  return {
    firstDay: s.firstDay,
    minimalDays: s.minimalDays,
    weekend: Array.from(s.weekend)
  };
}
function De(s, e, r) {
  return Nr(s) && s >= e && s <= r;
}
function Xu(s, e) {
  return s - e * Math.floor(s / e);
}
function fe(s, e = 2) {
  const r = s < 0;
  let i;
  return r ? i = "-" + ("" + -s).padStart(e, "0") : i = ("" + s).padStart(e, "0"), i;
}
function rt(s) {
  if (!(B(s) || s === null || s === ""))
    return parseInt(s, 10);
}
function St(s) {
  if (!(B(s) || s === null || s === ""))
    return parseFloat(s);
}
function Yi(s) {
  if (!(B(s) || s === null || s === "")) {
    const e = parseFloat("0." + s) * 1e3;
    return Math.floor(e);
  }
}
function Gi(s, e, r = !1) {
  const i = 10 ** e;
  return (r ? Math.trunc : Math.round)(s * i) / i;
}
function Fn(s) {
  return s % 4 === 0 && (s % 100 !== 0 || s % 400 === 0);
}
function Ht(s) {
  return Fn(s) ? 366 : 365;
}
function Ar(s, e) {
  const r = Xu(e - 1, 12) + 1, i = s + (e - r) / 12;
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
function to(s, e, r) {
  return -Hi(Bi(s, 1, e), r) + e - 1;
}
function Dn(s, e = 4, r = 1) {
  const i = to(s, e, r), a = to(s + 1, e, r);
  return (Ht(s) - i + a) / 7;
}
function Ui(s) {
  return s > 99 ? s : s > ue.twoDigitCutoffYear ? 1900 + s : 2e3 + s;
}
function oa(s, e, r, i = null) {
  const a = new Date(s), c = {
    hourCycle: "h23",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit"
  };
  i && (c.timeZone = i);
  const h = { timeZoneName: e, ...c }, m = new Intl.DateTimeFormat(r, h).formatToParts(a).find((g) => g.type.toLowerCase() === "timezonename");
  return m ? m.value : null;
}
function Pr(s, e) {
  let r = parseInt(s, 10);
  Number.isNaN(r) && (r = 0);
  const i = parseInt(e, 10) || 0, a = r < 0 || Object.is(r, -0) ? -i : i;
  return r * 60 + a;
}
function aa(s) {
  const e = Number(s);
  if (typeof s == "boolean" || s === "" || Number.isNaN(e))
    throw new ve(`Invalid unit value ${s}`);
  return e;
}
function Cr(s, e) {
  const r = {};
  for (const i in s)
    if (Jt(s, i)) {
      const a = s[i];
      if (a == null) continue;
      r[e(i)] = aa(a);
    }
  return r;
}
function In(s, e) {
  const r = Math.trunc(Math.abs(s / 60)), i = Math.trunc(Math.abs(s % 60)), a = s >= 0 ? "+" : "-";
  switch (e) {
    case "short":
      return `${a}${fe(r, 2)}:${fe(i, 2)}`;
    case "narrow":
      return `${a}${r}${i > 0 ? `:${i}` : ""}`;
    case "techie":
      return `${a}${fe(r, 2)}${fe(i, 2)}`;
    default:
      throw new RangeError(`Value format ${e} is out of range for property format`);
  }
}
function Fr(s) {
  return Ju(s, ["hour", "minute", "second", "millisecond"]);
}
const Qu = [
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
], ua = [
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
], el = ["J", "F", "M", "A", "M", "J", "J", "A", "S", "O", "N", "D"];
function la(s) {
  switch (s) {
    case "narrow":
      return [...el];
    case "short":
      return [...ua];
    case "long":
      return [...Qu];
    case "numeric":
      return ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12"];
    case "2-digit":
      return ["01", "02", "03", "04", "05", "06", "07", "08", "09", "10", "11", "12"];
    default:
      return null;
  }
}
const ca = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday"
], fa = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"], tl = ["M", "T", "W", "T", "F", "S", "S"];
function ha(s) {
  switch (s) {
    case "narrow":
      return [...tl];
    case "short":
      return [...fa];
    case "long":
      return [...ca];
    case "numeric":
      return ["1", "2", "3", "4", "5", "6", "7"];
    default:
      return null;
  }
}
const da = ["AM", "PM"], nl = ["Before Christ", "Anno Domini"], rl = ["BC", "AD"], il = ["B", "A"];
function ma(s) {
  switch (s) {
    case "narrow":
      return [...il];
    case "short":
      return [...rl];
    case "long":
      return [...nl];
    default:
      return null;
  }
}
function sl(s) {
  return da[s.hour < 12 ? 0 : 1];
}
function ol(s, e) {
  return ha(e)[s.weekday - 1];
}
function al(s, e) {
  return la(e)[s.month - 1];
}
function ul(s, e) {
  return ma(e)[s.year < 0 ? 0 : 1];
}
function ll(s, e, r = "always", i = !1) {
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
    const M = s === "days";
    switch (e) {
      case 1:
        return M ? "tomorrow" : `next ${a[s][0]}`;
      case -1:
        return M ? "yesterday" : `last ${a[s][0]}`;
      case 0:
        return M ? "today" : `this ${a[s][0]}`;
    }
  }
  const h = Object.is(e, -0) || e < 0, m = Math.abs(e), g = m === 1, A = a[s], L = i ? g ? A[1] : A[2] || A[1] : g ? a[s][0] : s;
  return h ? `${m} ${L} ago` : `in ${m} ${L}`;
}
function no(s, e) {
  let r = "";
  for (const i of s)
    i.literal ? r += i.val : r += e(i.val);
  return r;
}
const cl = {
  D: Er,
  DD: $o,
  DDD: No,
  DDDD: Mo,
  t: Po,
  tt: Fo,
  ttt: Ro,
  tttt: Vo,
  T: qo,
  TT: Lo,
  TTT: Uo,
  TTTT: jo,
  f: Wo,
  ff: zo,
  fff: Bo,
  ffff: Yo,
  F: Ko,
  FF: Zo,
  FFF: Ho,
  FFFF: Go
};
class be {
  static create(e, r = {}) {
    return new be(e, r);
  }
  static parseFormat(e) {
    let r = null, i = "", a = !1;
    const c = [];
    for (let h = 0; h < e.length; h++) {
      const m = e.charAt(h);
      m === "'" ? (i.length > 0 && c.push({ literal: a || /^\s+$/.test(i), val: i }), r = null, i = "", a = !a) : a || m === r ? i += m : (i.length > 0 && c.push({ literal: /^\s+$/.test(i), val: i }), i = m, r = m);
    }
    return i.length > 0 && c.push({ literal: a || /^\s+$/.test(i), val: i }), c;
  }
  static macroTokenToFormatOpts(e) {
    return cl[e];
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
  num(e, r = 0) {
    if (this.opts.forceSimple)
      return fe(e, r);
    const i = { ...this.opts };
    return r > 0 && (i.padTo = r), this.loc.numberFormatter(i).format(e);
  }
  formatDateTimeFromString(e, r) {
    const i = this.loc.listingMode() === "en", a = this.loc.outputCalendar && this.loc.outputCalendar !== "gregory", c = (W, ee) => this.loc.extract(e, W, ee), h = (W) => e.isOffsetFixed && e.offset === 0 && W.allowZ ? "Z" : e.isValid ? e.zone.formatOffset(e.ts, W.format) : "", m = () => i ? sl(e) : c({ hour: "numeric", hourCycle: "h12" }, "dayperiod"), g = (W, ee) => i ? al(e, W) : c(ee ? { month: W } : { month: W, day: "numeric" }, "month"), A = (W, ee) => i ? ol(e, W) : c(
      ee ? { weekday: W } : { weekday: W, month: "long", day: "numeric" },
      "weekday"
    ), L = (W) => {
      const ee = be.macroTokenToFormatOpts(W);
      return ee ? this.formatWithSystemDefault(e, ee) : W;
    }, M = (W) => i ? ul(e, W) : c({ era: W }, "era"), Z = (W) => {
      switch (W) {
        case "S":
          return this.num(e.millisecond);
        case "u":
        case "SSS":
          return this.num(e.millisecond, 3);
        case "s":
          return this.num(e.second);
        case "ss":
          return this.num(e.second, 2);
        case "uu":
          return this.num(Math.floor(e.millisecond / 10), 2);
        case "uuu":
          return this.num(Math.floor(e.millisecond / 100));
        case "m":
          return this.num(e.minute);
        case "mm":
          return this.num(e.minute, 2);
        case "h":
          return this.num(e.hour % 12 === 0 ? 12 : e.hour % 12);
        case "hh":
          return this.num(e.hour % 12 === 0 ? 12 : e.hour % 12, 2);
        case "H":
          return this.num(e.hour);
        case "HH":
          return this.num(e.hour, 2);
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
        case "z":
          return e.zoneName;
        case "a":
          return m();
        case "d":
          return a ? c({ day: "numeric" }, "day") : this.num(e.day);
        case "dd":
          return a ? c({ day: "2-digit" }, "day") : this.num(e.day, 2);
        case "c":
          return this.num(e.weekday);
        case "ccc":
          return A("short", !0);
        case "cccc":
          return A("long", !0);
        case "ccccc":
          return A("narrow", !0);
        case "E":
          return this.num(e.weekday);
        case "EEE":
          return A("short", !1);
        case "EEEE":
          return A("long", !1);
        case "EEEEE":
          return A("narrow", !1);
        case "L":
          return a ? c({ month: "numeric", day: "numeric" }, "month") : this.num(e.month);
        case "LL":
          return a ? c({ month: "2-digit", day: "numeric" }, "month") : this.num(e.month, 2);
        case "LLL":
          return g("short", !0);
        case "LLLL":
          return g("long", !0);
        case "LLLLL":
          return g("narrow", !0);
        case "M":
          return a ? c({ month: "numeric" }, "month") : this.num(e.month);
        case "MM":
          return a ? c({ month: "2-digit" }, "month") : this.num(e.month, 2);
        case "MMM":
          return g("short", !1);
        case "MMMM":
          return g("long", !1);
        case "MMMMM":
          return g("narrow", !1);
        case "y":
          return a ? c({ year: "numeric" }, "year") : this.num(e.year);
        case "yy":
          return a ? c({ year: "2-digit" }, "year") : this.num(e.year.toString().slice(-2), 2);
        case "yyyy":
          return a ? c({ year: "numeric" }, "year") : this.num(e.year, 4);
        case "yyyyyy":
          return a ? c({ year: "numeric" }, "year") : this.num(e.year, 6);
        case "G":
          return M("short");
        case "GG":
          return M("long");
        case "GGGGG":
          return M("narrow");
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
          return L(W);
      }
    };
    return no(be.parseFormat(r), Z);
  }
  formatDurationFromString(e, r) {
    const i = (g) => {
      switch (g[0]) {
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
    }, a = (g) => (A) => {
      const L = i(A);
      return L ? this.num(g.get(L), A.length) : A;
    }, c = be.parseFormat(r), h = c.reduce(
      (g, { literal: A, val: L }) => A ? g : g.concat(L),
      []
    ), m = e.shiftTo(...h.map(i).filter((g) => g));
    return no(c, a(m));
  }
}
const pa = /[A-Za-z_+-]{1,256}(?::?\/[A-Za-z0-9_+-]{1,256}(?:\/[A-Za-z0-9_+-]{1,256})?)?/;
function tn(...s) {
  const e = s.reduce((r, i) => r + i.source, "");
  return RegExp(`^${e}$`);
}
function nn(...s) {
  return (e) => s.reduce(
    ([r, i, a], c) => {
      const [h, m, g] = c(e, a);
      return [{ ...r, ...h }, m || i, g];
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
function ya(...s) {
  return (e, r) => {
    const i = {};
    let a;
    for (a = 0; a < s.length; a++)
      i[s[a]] = rt(e[r + a]);
    return [i, null, r + a];
  };
}
const ga = /(?:(Z)|([+-]\d\d)(?::?(\d\d))?)/, fl = `(?:${ga.source}?(?:\\[(${pa.source})\\])?)?`, Ji = /(\d\d)(?::?(\d\d)(?::?(\d\d)(?:[.,](\d{1,30}))?)?)?/, va = RegExp(`${Ji.source}${fl}`), Xi = RegExp(`(?:T${va.source})?`), hl = /([+-]\d{6}|\d{4})(?:-?(\d\d)(?:-?(\d\d))?)?/, dl = /(\d{4})-?W(\d\d)(?:-?(\d))?/, ml = /(\d{4})-?(\d{3})/, pl = ya("weekYear", "weekNumber", "weekDay"), yl = ya("year", "ordinal"), gl = /(\d{4})-(\d\d)-(\d\d)/, ba = RegExp(
  `${Ji.source} ?(?:${ga.source}|(${pa.source}))?`
), vl = RegExp(`(?: ${ba.source})?`);
function Yt(s, e, r) {
  const i = s[e];
  return B(i) ? r : rt(i);
}
function bl(s, e) {
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
    milliseconds: Yi(s[e + 3])
  }, null, e + 4];
}
function Rn(s, e) {
  const r = !s[e] && !s[e + 1], i = Pr(s[e + 1], s[e + 2]), a = r ? null : we.instance(i);
  return [{}, a, e + 3];
}
function Vn(s, e) {
  const r = s[e] ? Ue.create(s[e]) : null;
  return [{}, r, e + 1];
}
const wl = RegExp(`^T?${Ji.source}$`), kl = /^-?P(?:(?:(-?\d{1,20}(?:\.\d{1,20})?)Y)?(?:(-?\d{1,20}(?:\.\d{1,20})?)M)?(?:(-?\d{1,20}(?:\.\d{1,20})?)W)?(?:(-?\d{1,20}(?:\.\d{1,20})?)D)?(?:T(?:(-?\d{1,20}(?:\.\d{1,20})?)H)?(?:(-?\d{1,20}(?:\.\d{1,20})?)M)?(?:(-?\d{1,20})(?:[.,](-?\d{1,20}))?S)?)?)$/;
function _l(s) {
  const [e, r, i, a, c, h, m, g, A] = s, L = e[0] === "-", M = g && g[0] === "-", Z = (W, ee = !1) => W !== void 0 && (ee || W && L) ? -W : W;
  return [
    {
      years: Z(St(r)),
      months: Z(St(i)),
      weeks: Z(St(a)),
      days: Z(St(c)),
      hours: Z(St(h)),
      minutes: Z(St(m)),
      seconds: Z(St(g), g === "-0"),
      milliseconds: Z(Yi(A), M)
    }
  ];
}
const Sl = {
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
function Qi(s, e, r, i, a, c, h) {
  const m = {
    year: e.length === 2 ? Ui(rt(e)) : rt(e),
    month: ua.indexOf(r) + 1,
    day: rt(i),
    hour: rt(a),
    minute: rt(c)
  };
  return h && (m.second = rt(h)), s && (m.weekday = s.length > 3 ? ca.indexOf(s) + 1 : fa.indexOf(s) + 1), m;
}
const Tl = /^(?:(Mon|Tue|Wed|Thu|Fri|Sat|Sun),\s)?(\d{1,2})\s(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)\s(\d{2,4})\s(\d\d):(\d\d)(?::(\d\d))?\s(?:(UT|GMT|[ECMP][SD]T)|([Zz])|(?:([+-]\d\d)(\d\d)))$/;
function Ol(s) {
  const [
    ,
    e,
    r,
    i,
    a,
    c,
    h,
    m,
    g,
    A,
    L,
    M
  ] = s, Z = Qi(e, a, i, r, c, h, m);
  let W;
  return g ? W = Sl[g] : A ? W = 0 : W = Pr(L, M), [Z, new we(W)];
}
function xl(s) {
  return s.replace(/\([^()]*\)|[\n\t]/g, " ").replace(/(\s\s+)/g, " ").trim();
}
const El = /^(Mon|Tue|Wed|Thu|Fri|Sat|Sun), (\d\d) (Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec) (\d{4}) (\d\d):(\d\d):(\d\d) GMT$/, Il = /^(Monday|Tuesday|Wednesday|Thursday|Friday|Saturday|Sunday), (\d\d)-(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)-(\d\d) (\d\d):(\d\d):(\d\d) GMT$/, Al = /^(Mon|Tue|Wed|Thu|Fri|Sat|Sun) (Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec) ( \d|\d\d) (\d\d):(\d\d):(\d\d) (\d{4})$/;
function ro(s) {
  const [, e, r, i, a, c, h, m] = s;
  return [Qi(e, a, i, r, c, h, m), we.utcInstance];
}
function Cl(s) {
  const [, e, r, i, a, c, h, m] = s;
  return [Qi(e, m, r, i, a, c, h), we.utcInstance];
}
const Dl = tn(hl, Xi), $l = tn(dl, Xi), Nl = tn(ml, Xi), Ml = tn(va), wa = nn(
  bl,
  sn,
  Rn,
  Vn
), Pl = nn(
  pl,
  sn,
  Rn,
  Vn
), Fl = nn(
  yl,
  sn,
  Rn,
  Vn
), Rl = nn(
  sn,
  Rn,
  Vn
);
function Vl(s) {
  return rn(
    s,
    [Dl, wa],
    [$l, Pl],
    [Nl, Fl],
    [Ml, Rl]
  );
}
function ql(s) {
  return rn(xl(s), [Tl, Ol]);
}
function Ll(s) {
  return rn(
    s,
    [El, ro],
    [Il, ro],
    [Al, Cl]
  );
}
function Ul(s) {
  return rn(s, [kl, _l]);
}
const jl = nn(sn);
function Wl(s) {
  return rn(s, [wl, jl]);
}
const Kl = tn(gl, vl), zl = tn(ba), Zl = nn(
  sn,
  Rn,
  Vn
);
function Bl(s) {
  return rn(
    s,
    [Kl, wa],
    [zl, Zl]
  );
}
const io = "Invalid Duration", ka = {
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
}, Hl = {
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
  ...ka
}, Ae = 146097 / 400, Ut = 146097 / 4800, Yl = {
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
    weeks: Ut / 7,
    days: Ut,
    hours: Ut * 24,
    minutes: Ut * 24 * 60,
    seconds: Ut * 24 * 60 * 60,
    milliseconds: Ut * 24 * 60 * 60 * 1e3
  },
  ...ka
}, Et = [
  "years",
  "quarters",
  "months",
  "weeks",
  "days",
  "hours",
  "minutes",
  "seconds",
  "milliseconds"
], Gl = Et.slice(0).reverse();
function nt(s, e, r = !1) {
  const i = {
    values: r ? e.values : { ...s.values, ...e.values || {} },
    loc: s.loc.clone(e.loc),
    conversionAccuracy: e.conversionAccuracy || s.conversionAccuracy,
    matrix: e.matrix || s.matrix
  };
  return new Q(i);
}
function _a(s, e) {
  let r = e.milliseconds ?? 0;
  for (const i of Gl.slice(1))
    e[i] && (r += e[i] * s[i].milliseconds);
  return r;
}
function so(s, e) {
  const r = _a(s, e) < 0 ? -1 : 1;
  Et.reduceRight((i, a) => {
    if (B(e[a]))
      return i;
    if (i) {
      const c = e[i] * r, h = s[a][i], m = Math.floor(c / h);
      e[a] += m * r, e[i] -= m * h * r;
    }
    return a;
  }, null), Et.reduce((i, a) => {
    if (B(e[a]))
      return i;
    if (i) {
      const c = e[i] % 1;
      e[i] -= c, e[a] += c * s[i][a];
    }
    return a;
  }, null);
}
function Jl(s) {
  const e = {};
  for (const [r, i] of Object.entries(s))
    i !== 0 && (e[r] = i);
  return e;
}
class Q {
  /**
   * @private
   */
  constructor(e) {
    const r = e.conversionAccuracy === "longterm" || !1;
    let i = r ? Yl : Hl;
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
    return Q.fromObject({ milliseconds: e }, r);
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
      throw new ve(
        `Duration.fromObject: argument expected to be an object, got ${e === null ? "null" : typeof e}`
      );
    return new Q({
      values: Cr(e, Q.normalizeUnit),
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
    if (at(e))
      return Q.fromMillis(e);
    if (Q.isDuration(e))
      return e;
    if (typeof e == "object")
      return Q.fromObject(e);
    throw new ve(
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
    const [i] = Ul(e);
    return i ? Q.fromObject(i, r) : Q.invalid("unparsable", `the input "${e}" can't be parsed as ISO 8601`);
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
    const [i] = Wl(e);
    return i ? Q.fromObject(i, r) : Q.invalid("unparsable", `the input "${e}" can't be parsed as ISO 8601`);
  }
  /**
   * Create an invalid Duration.
   * @param {string} reason - simple string of why this datetime is invalid. Should not contain parameters or anything else data-dependent
   * @param {string} [explanation=null] - longer explanation, may include parameters and other useful debugging information
   * @return {Duration}
   */
  static invalid(e, r = null) {
    if (!e)
      throw new ve("need to specify a reason the Duration is invalid");
    const i = e instanceof Pe ? e : new Pe(e, r);
    if (ue.throwOnInvalid)
      throw new _u(i);
    return new Q({ invalid: i });
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
   * @example Duration.fromObject({ years: 1, days: 6, seconds: 2 }).toFormat("y d s") //=> "1 6 2"
   * @example Duration.fromObject({ years: 1, days: 6, seconds: 2 }).toFormat("yy dd sss") //=> "01 06 002"
   * @example Duration.fromObject({ years: 1, days: 6, seconds: 2 }).toFormat("M S") //=> "12 518402000"
   * @return {string}
   */
  toFormat(e, r = {}) {
    const i = {
      ...r,
      floor: r.round !== !1 && r.floor !== !1
    };
    return this.isValid ? be.create(this.loc, i).formatDurationFromString(this, e) : io;
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
  toHuman(e = {}) {
    if (!this.isValid) return io;
    const r = Et.map((i) => {
      const a = this.values[i];
      return B(a) ? null : this.loc.numberFormatter({ style: "unit", unitDisplay: "long", ...e, unit: i.slice(0, -1) }).format(a);
    }).filter((i) => i);
    return this.loc.listFormatter({ type: "conjunction", style: e.listStyle || "narrow", ...e }).format(r);
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
    return this.years !== 0 && (e += this.years + "Y"), (this.months !== 0 || this.quarters !== 0) && (e += this.months + this.quarters * 3 + "M"), this.weeks !== 0 && (e += this.weeks + "W"), this.days !== 0 && (e += this.days + "D"), (this.hours !== 0 || this.minutes !== 0 || this.seconds !== 0 || this.milliseconds !== 0) && (e += "T"), this.hours !== 0 && (e += this.hours + "H"), this.minutes !== 0 && (e += this.minutes + "M"), (this.seconds !== 0 || this.milliseconds !== 0) && (e += Gi(this.seconds + this.milliseconds / 1e3, 3) + "S"), e === "P" && (e += "T0S"), e;
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
    }, z.fromMillis(r, { zone: "UTC" }).toISOTime(e));
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
    return this.isValid ? _a(this.matrix, this.values) : NaN;
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
    const r = Q.fromDurationLike(e), i = {};
    for (const a of Et)
      (Jt(r.values, a) || Jt(this.values, a)) && (i[a] = r.get(a) + this.get(a));
    return nt(this, { values: i }, !0);
  }
  /**
   * Make this Duration shorter by the specified amount. Return a newly-constructed Duration.
   * @param {Duration|Object|number} duration - The amount to subtract. Either a Luxon Duration, a number of milliseconds, the object argument to Duration.fromObject()
   * @return {Duration}
   */
  minus(e) {
    if (!this.isValid) return this;
    const r = Q.fromDurationLike(e);
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
      r[i] = aa(e(this.values[i], i));
    return nt(this, { values: r }, !0);
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
    return this[Q.normalizeUnit(e)];
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
    const r = { ...this.values, ...Cr(e, Q.normalizeUnit) };
    return nt(this, { values: r });
  }
  /**
   * "Set" the locale and/or numberingSystem.  Returns a newly-constructed Duration.
   * @example dur.reconfigure({ locale: 'en-GB' })
   * @return {Duration}
   */
  reconfigure({ locale: e, numberingSystem: r, conversionAccuracy: i, matrix: a } = {}) {
    const h = { loc: this.loc.clone({ locale: e, numberingSystem: r }), matrix: a, conversionAccuracy: i };
    return nt(this, h);
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
    return so(this.matrix, e), nt(this, { values: e }, !0);
  }
  /**
   * Rescale units to its largest representation
   * @example Duration.fromObject({ milliseconds: 90000 }).rescale().toObject() //=> { minutes: 1, seconds: 30 }
   * @return {Duration}
   */
  rescale() {
    if (!this.isValid) return this;
    const e = Jl(this.normalize().shiftToAll().toObject());
    return nt(this, { values: e }, !0);
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
    e = e.map((h) => Q.normalizeUnit(h));
    const r = {}, i = {}, a = this.toObject();
    let c;
    for (const h of Et)
      if (e.indexOf(h) >= 0) {
        c = h;
        let m = 0;
        for (const A in i)
          m += this.matrix[A][h] * i[A], i[A] = 0;
        at(a[h]) && (m += a[h]);
        const g = Math.trunc(m);
        r[h] = g, i[h] = (m * 1e3 - g * 1e3) / 1e3;
      } else at(a[h]) && (i[h] = a[h]);
    for (const h in i)
      i[h] !== 0 && (r[c] += h === c ? i[h] : i[h] / this.matrix[c][h]);
    return so(this.matrix, r), nt(this, { values: r }, !0);
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
    return nt(this, { values: e }, !0);
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
    for (const i of Et)
      if (!r(this.values[i], e.values[i]))
        return !1;
    return !0;
  }
}
const jt = "Invalid Interval";
function Xl(s, e) {
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
      throw new ve("need to specify a reason the Interval is invalid");
    const i = e instanceof Pe ? e : new Pe(e, r);
    if (ue.throwOnInvalid)
      throw new ku(i);
    return new ae({ invalid: i });
  }
  /**
   * Create an Interval from a start DateTime and an end DateTime. Inclusive of the start but not the end.
   * @param {DateTime|Date|Object} start
   * @param {DateTime|Date|Object} end
   * @return {Interval}
   */
  static fromDateTimes(e, r) {
    const i = Sn(e), a = Sn(r), c = Xl(i, a);
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
    const i = Q.fromDurationLike(r), a = Sn(e);
    return ae.fromDateTimes(a, a.plus(i));
  }
  /**
   * Create an Interval from an end DateTime and a Duration to extend backwards to.
   * @param {DateTime|Date|Object} end
   * @param {Duration|Object|number} duration - the length of the Interval.
   * @return {Interval}
   */
  static before(e, r) {
    const i = Q.fromDurationLike(r), a = Sn(e);
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
        c = z.fromISO(i, r), h = c.isValid;
      } catch {
        h = !1;
      }
      let m, g;
      try {
        m = z.fromISO(a, r), g = m.isValid;
      } catch {
        g = !1;
      }
      if (h && g)
        return ae.fromDateTimes(c, m);
      if (h) {
        const A = Q.fromISO(a, r);
        if (A.isValid)
          return ae.after(c, A);
      } else if (g) {
        const A = Q.fromISO(i, r);
        if (A.isValid)
          return ae.before(m, A);
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
    return r != null && r.useLocaleWeeks ? a = this.end.reconfigure({ locale: i.locale }) : a = this.end, a = a.startOf(e, r), Math.floor(a.diff(i, e).get(e)) + (a.valueOf() !== this.end.valueOf());
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
    const r = Q.fromDurationLike(e);
    if (!this.isValid || !r.isValid || r.as("milliseconds") === 0)
      return [];
    let { s: i } = this, a = 1, c;
    const h = [];
    for (; i < this.e; ) {
      const m = this.start.plus(r.mapUnits((g) => g * a));
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
   * Merge an array of Intervals into a equivalent minimal set of Intervals.
   * Combines overlapping and adjacent Intervals.
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
    const a = [], c = e.map((g) => [
      { time: g.s, type: "s" },
      { time: g.e, type: "e" }
    ]), h = Array.prototype.concat(...c), m = h.sort((g, A) => g.time - A.time);
    for (const g of m)
      i += g.type === "s" ? 1 : -1, i === 1 ? r = g.time : (r && +r != +g.time && a.push(ae.fromDateTimes(r, g.time)), r = null);
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
  toLocaleString(e = Er, r = {}) {
    return this.isValid ? be.create(this.s.loc.clone(r), e).formatInterval(this) : jt;
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
    return this.isValid ? this.e.diff(this.s, e, r) : Q.invalid(this.invalidReason);
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
class xn {
  /**
   * Return whether the specified zone contains a DST.
   * @param {string|Zone} [zone='local'] - Zone to check. Defaults to the environment's local zone.
   * @return {boolean}
   */
  static hasDST(e = ue.defaultZone) {
    const r = z.now().setZone(e).set({ month: 12 });
    return !e.isUniversal && r.offset !== r.set({ month: 6 }).offset;
  }
  /**
   * Return whether the specified zone is a valid IANA specifier.
   * @param {string} zone - Zone to check
   * @return {boolean}
   */
  static isValidIANAZone(e) {
    return Ue.isValidZone(e);
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
    return it(e, ue.defaultZone);
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
    return { relative: ia(), localeWeek: sa() };
  }
}
function oo(s, e) {
  const r = (a) => a.toUTC(0, { keepLocalTime: !0 }).startOf("day").valueOf(), i = r(e) - r(s);
  return Math.floor(Q.fromMillis(i).as("days"));
}
function Ql(s, e, r) {
  const i = [
    ["years", (g, A) => A.year - g.year],
    ["quarters", (g, A) => A.quarter - g.quarter + (A.year - g.year) * 4],
    ["months", (g, A) => A.month - g.month + (A.year - g.year) * 12],
    [
      "weeks",
      (g, A) => {
        const L = oo(g, A);
        return (L - L % 7) / 7;
      }
    ],
    ["days", oo]
  ], a = {}, c = s;
  let h, m;
  for (const [g, A] of i)
    r.indexOf(g) >= 0 && (h = g, a[g] = A(s, e), m = c.plus(a), m > e ? (a[g]--, s = c.plus(a), s > e && (m = s, a[g]--, s = c.plus(a))) : s = m);
  return [s, a, m, h];
}
function ec(s, e, r, i) {
  let [a, c, h, m] = Ql(s, e, r);
  const g = e - a, A = r.filter(
    (M) => ["hours", "minutes", "seconds", "milliseconds"].indexOf(M) >= 0
  );
  A.length === 0 && (h < e && (h = a.plus({ [m]: 1 })), h !== a && (c[m] = (c[m] || 0) + g / (h - a)));
  const L = Q.fromObject(c, i);
  return A.length > 0 ? Q.fromMillis(g, i).shiftTo(...A).plus(L) : L;
}
const tc = "missing Intl.DateTimeFormat.formatToParts support";
function ne(s, e = (r) => r) {
  return { regex: s, deser: ([r]) => e(Ku(r)) };
}
const nc = " ", Sa = `[ ${nc}]`, Ta = new RegExp(Sa, "g");
function rc(s) {
  return s.replace(/\./g, "\\.?").replace(Ta, Sa);
}
function ao(s) {
  return s.replace(/\./g, "").replace(Ta, " ").toLowerCase();
}
function Me(s, e) {
  return s === null ? null : {
    regex: RegExp(s.map(rc).join("|")),
    deser: ([r]) => s.findIndex((i) => ao(r) === ao(i)) + e
  };
}
function uo(s, e) {
  return { regex: s, deser: ([, r, i]) => Pr(r, i), groups: e };
}
function vr(s) {
  return { regex: s, deser: ([e]) => e };
}
function ic(s) {
  return s.replace(/[\-\[\]{}()*+?.,\\\^$|#\s]/g, "\\$&");
}
function sc(s, e) {
  const r = Ne(e), i = Ne(e, "{2}"), a = Ne(e, "{3}"), c = Ne(e, "{4}"), h = Ne(e, "{6}"), m = Ne(e, "{1,2}"), g = Ne(e, "{1,3}"), A = Ne(e, "{1,6}"), L = Ne(e, "{1,9}"), M = Ne(e, "{2,4}"), Z = Ne(e, "{4,6}"), W = (Ee) => ({ regex: RegExp(ic(Ee.val)), deser: ([Ze]) => Ze, literal: !0 }), Se = ((Ee) => {
    if (s.literal)
      return W(Ee);
    switch (Ee.val) {
      case "G":
        return Me(e.eras("short"), 0);
      case "GG":
        return Me(e.eras("long"), 0);
      case "y":
        return ne(A);
      case "yy":
        return ne(M, Ui);
      case "yyyy":
        return ne(c);
      case "yyyyy":
        return ne(Z);
      case "yyyyyy":
        return ne(h);
      case "M":
        return ne(m);
      case "MM":
        return ne(i);
      case "MMM":
        return Me(e.months("short", !0), 1);
      case "MMMM":
        return Me(e.months("long", !0), 1);
      case "L":
        return ne(m);
      case "LL":
        return ne(i);
      case "LLL":
        return Me(e.months("short", !1), 1);
      case "LLLL":
        return Me(e.months("long", !1), 1);
      case "d":
        return ne(m);
      case "dd":
        return ne(i);
      case "o":
        return ne(g);
      case "ooo":
        return ne(a);
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
        return ne(g);
      case "SSS":
        return ne(a);
      case "u":
        return vr(L);
      case "uu":
        return vr(m);
      case "uuu":
        return ne(r);
      case "a":
        return Me(e.meridiems(), 0);
      case "kkkk":
        return ne(c);
      case "kk":
        return ne(M, Ui);
      case "W":
        return ne(m);
      case "WW":
        return ne(i);
      case "E":
      case "c":
        return ne(r);
      case "EEE":
        return Me(e.weekdays("short", !1), 1);
      case "EEEE":
        return Me(e.weekdays("long", !1), 1);
      case "ccc":
        return Me(e.weekdays("short", !0), 1);
      case "cccc":
        return Me(e.weekdays("long", !0), 1);
      case "Z":
      case "ZZ":
        return uo(new RegExp(`([+-]${m.source})(?::(${i.source}))?`), 2);
      case "ZZZ":
        return uo(new RegExp(`([+-]${m.source})(${i.source})?`), 2);
      case "z":
        return vr(/[a-z_+-/]{1,256}?/i);
      case " ":
        return vr(/[^\S\n\r]/);
      default:
        return W(Ee);
    }
  })(s) || {
    invalidReason: tc
  };
  return Se.token = s, Se;
}
const oc = {
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
function ac(s, e, r) {
  const { type: i, value: a } = s;
  if (i === "literal") {
    const g = /^\s+$/.test(a);
    return {
      literal: !g,
      val: g ? " " : a
    };
  }
  const c = e[i];
  let h = i;
  i === "hour" && (e.hour12 != null ? h = e.hour12 ? "hour12" : "hour24" : e.hourCycle != null ? e.hourCycle === "h11" || e.hourCycle === "h12" ? h = "hour12" : h = "hour24" : h = r.hour12 ? "hour12" : "hour24");
  let m = oc[h];
  if (typeof m == "object" && (m = m[c]), m)
    return {
      literal: !1,
      val: m
    };
}
function uc(s) {
  return [`^${s.map((r) => r.regex).reduce((r, i) => `${r}(${i.source})`, "")}$`, s];
}
function lc(s, e, r) {
  const i = s.match(e);
  if (i) {
    const a = {};
    let c = 1;
    for (const h in r)
      if (Jt(r, h)) {
        const m = r[h], g = m.groups ? m.groups + 1 : 1;
        !m.literal && m.token && (a[m.token.val[0]] = m.deser(i.slice(c, c + g))), c += g;
      }
    return [i, a];
  } else
    return [i, {}];
}
function cc(s) {
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
  return B(s.z) || (r = Ue.create(s.z)), B(s.Z) || (r || (r = new we(s.Z)), i = s.Z), B(s.q) || (s.M = (s.q - 1) * 3 + 1), B(s.h) || (s.h < 12 && s.a === 1 ? s.h += 12 : s.h === 12 && s.a === 0 && (s.h = 0)), s.G === 0 && s.y && (s.y = -s.y), B(s.u) || (s.S = Yi(s.u)), [Object.keys(s).reduce((c, h) => {
    const m = e(h);
    return m && (c[m] = s[h]), c;
  }, {}), r, i];
}
let Ei = null;
function fc() {
  return Ei || (Ei = z.fromMillis(1555555555555)), Ei;
}
function hc(s, e) {
  if (s.literal)
    return s;
  const r = be.macroTokenToFormatOpts(s.val), i = Ia(r, e);
  return i == null || i.includes(void 0) ? s : i;
}
function Oa(s, e) {
  return Array.prototype.concat(...s.map((r) => hc(r, e)));
}
class xa {
  constructor(e, r) {
    if (this.locale = e, this.format = r, this.tokens = Oa(be.parseFormat(r), e), this.units = this.tokens.map((i) => sc(i, e)), this.disqualifyingUnit = this.units.find((i) => i.invalidReason), !this.disqualifyingUnit) {
      const [i, a] = uc(this.units);
      this.regex = RegExp(i, "i"), this.handlers = a;
    }
  }
  explainFromTokens(e) {
    if (this.isValid) {
      const [r, i] = lc(e, this.regex, this.handlers), [a, c, h] = i ? cc(i) : [null, null, void 0];
      if (Jt(i, "a") && Jt(i, "H"))
        throw new Zt(
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
function Ea(s, e, r) {
  return new xa(s, r).explainFromTokens(e);
}
function dc(s, e, r) {
  const { result: i, zone: a, specificOffset: c, invalidReason: h } = Ea(s, e, r);
  return [i, a, c, h];
}
function Ia(s, e) {
  if (!s)
    return null;
  const i = be.create(e, s).dtFormatter(fc()), a = i.formatToParts(), c = i.resolvedOptions();
  return a.map((h) => ac(h, s, c));
}
const Ii = "Invalid DateTime", lo = 864e13;
function En(s) {
  return new Pe("unsupported zone", `the zone "${s.name}" is not supported`);
}
function Ai(s) {
  return s.weekData === null && (s.weekData = Ir(s.c)), s.weekData;
}
function Ci(s) {
  return s.localWeekData === null && (s.localWeekData = Ir(
    s.c,
    s.loc.getMinDaysInFirstWeek(),
    s.loc.getStartOfWeek()
  )), s.localWeekData;
}
function Tt(s, e) {
  const r = {
    ts: s.ts,
    zone: s.zone,
    c: s.c,
    o: s.o,
    loc: s.loc,
    invalid: s.invalid
  };
  return new z({ ...r, ...e, old: r });
}
function Aa(s, e, r) {
  let i = s - e * 60 * 1e3;
  const a = r.offset(i);
  if (e === a)
    return [i, e];
  i -= (a - e) * 60 * 1e3;
  const c = r.offset(i);
  return a === c ? [i, a] : [s - Math.min(a, c) * 60 * 1e3, Math.max(a, c)];
}
function br(s, e) {
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
function _r(s, e, r) {
  return Aa(Mr(s), e, r);
}
function co(s, e) {
  const r = s.o, i = s.c.year + Math.trunc(e.years), a = s.c.month + Math.trunc(e.months) + Math.trunc(e.quarters) * 3, c = {
    ...s.c,
    year: i,
    month: a,
    day: Math.min(s.c.day, Ar(i, a)) + Math.trunc(e.days) + Math.trunc(e.weeks) * 7
  }, h = Q.fromObject({
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
  let [g, A] = Aa(m, r, s.zone);
  return h !== 0 && (g += h, A = s.zone.offset(g)), { ts: g, o: A };
}
function Wt(s, e, r, i, a, c) {
  const { setZone: h, zone: m } = r;
  if (s && Object.keys(s).length !== 0 || e) {
    const g = e || m, A = z.fromObject(s, {
      ...r,
      zone: g,
      specificOffset: c
    });
    return h ? A : A.setZone(m);
  } else
    return z.invalid(
      new Pe("unparsable", `the input "${a}" can't be parsed as ${i}`)
    );
}
function wr(s, e, r = !0) {
  return s.isValid ? be.create(re.create("en-US"), {
    allowZ: r,
    forceSimple: !0
  }).formatDateTimeFromString(s, e) : null;
}
function Di(s, e) {
  const r = s.c.year > 9999 || s.c.year < 0;
  let i = "";
  return r && s.c.year >= 0 && (i += "+"), i += fe(s.c.year, r ? 6 : 4), e ? (i += "-", i += fe(s.c.month), i += "-", i += fe(s.c.day)) : (i += fe(s.c.month), i += fe(s.c.day)), i;
}
function fo(s, e, r, i, a, c) {
  let h = fe(s.c.hour);
  return e ? (h += ":", h += fe(s.c.minute), (s.c.millisecond !== 0 || s.c.second !== 0 || !r) && (h += ":")) : h += fe(s.c.minute), (s.c.millisecond !== 0 || s.c.second !== 0 || !r) && (h += fe(s.c.second), (s.c.millisecond !== 0 || !i) && (h += ".", h += fe(s.c.millisecond, 3))), a && (s.isOffsetFixed && s.offset === 0 && !c ? h += "Z" : s.o < 0 ? (h += "-", h += fe(Math.trunc(-s.o / 60)), h += ":", h += fe(Math.trunc(-s.o % 60))) : (h += "+", h += fe(Math.trunc(s.o / 60)), h += ":", h += fe(Math.trunc(s.o % 60)))), c && (h += "[" + s.zone.ianaName + "]"), h;
}
const Ca = {
  month: 1,
  day: 1,
  hour: 0,
  minute: 0,
  second: 0,
  millisecond: 0
}, mc = {
  weekNumber: 1,
  weekday: 1,
  hour: 0,
  minute: 0,
  second: 0,
  millisecond: 0
}, pc = {
  ordinal: 1,
  hour: 0,
  minute: 0,
  second: 0,
  millisecond: 0
}, Da = ["year", "month", "day", "hour", "minute", "second", "millisecond"], yc = [
  "weekYear",
  "weekNumber",
  "weekday",
  "hour",
  "minute",
  "second",
  "millisecond"
], gc = ["year", "ordinal", "hour", "minute", "second", "millisecond"];
function vc(s) {
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
function ho(s) {
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
      return vc(s);
  }
}
function bc(s) {
  return Tr[s] || (Sr === void 0 && (Sr = ue.now()), Tr[s] = s.offset(Sr)), Tr[s];
}
function mo(s, e) {
  const r = it(e.zone, ue.defaultZone);
  if (!r.isValid)
    return z.invalid(En(r));
  const i = re.fromObject(e);
  let a, c;
  if (B(s.year))
    a = ue.now();
  else {
    for (const g of Da)
      B(s[g]) && (s[g] = Ca[g]);
    const h = na(s) || ra(s);
    if (h)
      return z.invalid(h);
    const m = bc(r);
    [a, c] = _r(s, m, r);
  }
  return new z({ ts: a, zone: r, loc: i, o: c });
}
function po(s, e, r) {
  const i = B(r.round) ? !0 : r.round, a = (h, m) => (h = Gi(h, i || r.calendary ? 0 : 2, !0), e.loc.clone(r).relFormatter(r).format(h, m)), c = (h) => r.calendary ? e.hasSame(s, h) ? 0 : e.startOf(h).diff(s.startOf(h), h).get(h) : e.diff(s, h).get(h);
  if (r.unit)
    return a(c(r.unit), r.unit);
  for (const h of r.units) {
    const m = c(h);
    if (Math.abs(m) >= 1)
      return a(m, h);
  }
  return a(s > e ? -0 : 0, r.units[r.units.length - 1]);
}
function yo(s) {
  let e = {}, r;
  return s.length > 0 && typeof s[s.length - 1] == "object" ? (e = s[s.length - 1], r = Array.from(s).slice(0, s.length - 1)) : r = Array.from(s), [e, r];
}
let Sr, Tr = {};
class z {
  /**
   * @access private
   */
  constructor(e) {
    const r = e.zone || ue.defaultZone;
    let i = e.invalid || (Number.isNaN(e.ts) ? new Pe("invalid input") : null) || (r.isValid ? null : En(r));
    this.ts = B(e.ts) ? ue.now() : e.ts;
    let a = null, c = null;
    if (!i)
      if (e.old && e.old.ts === this.ts && e.old.zone.equals(r))
        [a, c] = [e.old.c, e.old.o];
      else {
        const m = at(e.o) && !e.old ? e.o : r.offset(this.ts);
        a = br(this.ts, m), i = Number.isNaN(a.year) ? new Pe("invalid input") : null, a = i ? null : a, c = i ? null : m;
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
    return new z({});
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
    const [e, r] = yo(arguments), [i, a, c, h, m, g, A] = r;
    return mo({ year: i, month: a, day: c, hour: h, minute: m, second: g, millisecond: A }, e);
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
    const [e, r] = yo(arguments), [i, a, c, h, m, g, A] = r;
    return e.zone = we.utcInstance, mo({ year: i, month: a, day: c, hour: h, minute: m, second: g, millisecond: A }, e);
  }
  /**
   * Create a DateTime from a JavaScript Date object. Uses the default zone.
   * @param {Date} date - a JavaScript Date object
   * @param {Object} options - configuration options for the DateTime
   * @param {string|Zone} [options.zone='local'] - the zone to place the DateTime into
   * @return {DateTime}
   */
  static fromJSDate(e, r = {}) {
    const i = Yu(e) ? e.valueOf() : NaN;
    if (Number.isNaN(i))
      return z.invalid("invalid input");
    const a = it(r.zone, ue.defaultZone);
    return a.isValid ? new z({
      ts: i,
      zone: a,
      loc: re.fromObject(r)
    }) : z.invalid(En(a));
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
    if (at(e))
      return e < -lo || e > lo ? z.invalid("Timestamp out of range") : new z({
        ts: e,
        zone: it(r.zone, ue.defaultZone),
        loc: re.fromObject(r)
      });
    throw new ve(
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
    if (at(e))
      return new z({
        ts: e * 1e3,
        zone: it(r.zone, ue.defaultZone),
        loc: re.fromObject(r)
      });
    throw new ve("fromSeconds requires a numerical input");
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
    const i = it(r.zone, ue.defaultZone);
    if (!i.isValid)
      return z.invalid(En(i));
    const a = re.fromObject(r), c = Cr(e, ho), { minDaysInFirstWeek: h, startOfWeek: m } = Qs(c, a), g = ue.now(), A = B(r.specificOffset) ? i.offset(g) : r.specificOffset, L = !B(c.ordinal), M = !B(c.year), Z = !B(c.month) || !B(c.day), W = M || Z, ee = c.weekYear || c.weekNumber;
    if ((W || L) && ee)
      throw new Zt(
        "Can't mix weekYear/weekNumber units with year/month/day or ordinals"
      );
    if (Z && L)
      throw new Zt("Can't mix ordinal dates with month/day");
    const Se = ee || c.weekday && !W;
    let Ee, Ze, Re = br(g, A);
    Se ? (Ee = yc, Ze = mc, Re = Ir(Re, h, m)) : L ? (Ee = gc, Ze = pc, Re = xi(Re)) : (Ee = Da, Ze = Ca);
    let on = !1;
    for (const Be of Ee) {
      const Un = c[Be];
      B(Un) ? on ? c[Be] = Ze[Be] : c[Be] = Re[Be] : on = !0;
    }
    const lt = Se ? Zu(c, h, m) : L ? Bu(c) : na(c), an = lt || ra(c);
    if (an)
      return z.invalid(an);
    const $e = Se ? Js(c, h, m) : L ? Xs(c) : c, [ke, Ln] = _r($e, A, i), ct = new z({
      ts: ke,
      zone: i,
      o: Ln,
      loc: a
    });
    return c.weekday && W && e.weekday !== ct.weekday ? z.invalid(
      "mismatched weekday",
      `you can't specify both a weekday of ${c.weekday} and a date of ${ct.toISO()}`
    ) : ct.isValid ? ct : z.invalid(ct.invalid);
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
    const [i, a] = Vl(e);
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
    const [i, a] = ql(e);
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
    const [i, a] = Ll(e);
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
    if (B(e) || B(r))
      throw new ve("fromFormat requires an input string and a format");
    const { locale: a = null, numberingSystem: c = null } = i, h = re.fromOpts({
      locale: a,
      numberingSystem: c,
      defaultToEN: !0
    }), [m, g, A, L] = dc(h, e, r);
    return L ? z.invalid(L) : Wt(m, g, i, `format ${r}`, e, A);
  }
  /**
   * @deprecated use fromFormat instead
   */
  static fromString(e, r, i = {}) {
    return z.fromFormat(e, r, i);
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
    const [i, a] = Bl(e);
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
      throw new ve("need to specify a reason the DateTime is invalid");
    const i = e instanceof Pe ? e : new Pe(e, r);
    if (ue.throwOnInvalid)
      throw new wu(i);
    return new z({ invalid: i });
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
    const i = Ia(e, re.fromObject(r));
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
    return Oa(be.parseFormat(e), re.fromObject(r)).map((a) => a.val).join("");
  }
  static resetCache() {
    Sr = void 0, Tr = {};
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
    return this.isValid ? Ci(this).weekday : NaN;
  }
  /**
   * Get the week number of the week year according to the locale. Different locales assign week numbers differently,
   * because the week can start on different days of the week (see localWeekday) and because a different number of days
   * is required for a week to count as the first week of a year.
   * @returns {number}
   */
  get localWeekNumber() {
    return this.isValid ? Ci(this).weekNumber : NaN;
  }
  /**
   * Get the week year according to the locale. Different locales assign week numbers (and therefor week years)
   * differently, see localWeekNumber.
   * @returns {number}
   */
  get localWeekYear() {
    return this.isValid ? Ci(this).weekYear : NaN;
  }
  /**
   * Get the ordinal (meaning the day of the year)
   * @example DateTime.local(2017, 5, 25).ordinal //=> 145
   * @type {number|DateTime}
   */
  get ordinal() {
    return this.isValid ? xi(this.c).ordinal : NaN;
  }
  /**
   * Get the human readable short month name, such as 'Oct'.
   * Defaults to the system's locale if no locale has been specified
   * @example DateTime.local(2017, 10, 30).monthShort //=> Oct
   * @type {string}
   */
  get monthShort() {
    return this.isValid ? xn.months("short", { locObj: this.loc })[this.month - 1] : null;
  }
  /**
   * Get the human readable long month name, such as 'October'.
   * Defaults to the system's locale if no locale has been specified
   * @example DateTime.local(2017, 10, 30).monthLong //=> October
   * @type {string}
   */
  get monthLong() {
    return this.isValid ? xn.months("long", { locObj: this.loc })[this.month - 1] : null;
  }
  /**
   * Get the human readable short weekday, such as 'Mon'.
   * Defaults to the system's locale if no locale has been specified
   * @example DateTime.local(2017, 10, 30).weekdayShort //=> Mon
   * @type {string}
   */
  get weekdayShort() {
    return this.isValid ? xn.weekdays("short", { locObj: this.loc })[this.weekday - 1] : null;
  }
  /**
   * Get the human readable long weekday, such as 'Monday'.
   * Defaults to the system's locale if no locale has been specified
   * @example DateTime.local(2017, 10, 30).weekdayLong //=> Monday
   * @type {string}
   */
  get weekdayLong() {
    return this.isValid ? xn.weekdays("long", { locObj: this.loc })[this.weekday - 1] : null;
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
    const g = i - h * r, A = i - m * r, L = br(g, h), M = br(A, m);
    return L.hour === M.hour && L.minute === M.minute && L.second === M.second && L.millisecond === M.millisecond ? [Tt(this, { ts: g }), Tt(this, { ts: A })] : [this];
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
    return Ar(this.year, this.month);
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
    return this.isValid ? Dn(this.weekYear) : NaN;
  }
  /**
   * Returns the number of weeks in this DateTime's local week year
   * @example DateTime.local(2020, 6, {locale: 'en-US'}).weeksInLocalWeekYear //=> 52
   * @example DateTime.local(2020, 6, {locale: 'de-DE'}).weeksInLocalWeekYear //=> 53
   * @type {number}
   */
  get weeksInLocalWeekYear() {
    return this.isValid ? Dn(
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
    const { locale: r, numberingSystem: i, calendar: a } = be.create(
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
    return this.setZone(we.instance(e), r);
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
    if (e = it(e, ue.defaultZone), e.equals(this.zone))
      return this;
    if (e.isValid) {
      let a = this.ts;
      if (r || i) {
        const c = e.offset(this.ts), h = this.toObject();
        [a] = _r(h, c, e);
      }
      return Tt(this, { ts: a, zone: e });
    } else
      return z.invalid(En(e));
  }
  /**
   * "Set" the locale, numberingSystem, or outputCalendar. Returns a newly-constructed DateTime.
   * @param {Object} properties - the properties to set
   * @example DateTime.local(2017, 5, 25).reconfigure({ locale: 'en-GB' })
   * @return {DateTime}
   */
  reconfigure({ locale: e, numberingSystem: r, outputCalendar: i } = {}) {
    const a = this.loc.clone({ locale: e, numberingSystem: r, outputCalendar: i });
    return Tt(this, { loc: a });
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
    const r = Cr(e, ho), { minDaysInFirstWeek: i, startOfWeek: a } = Qs(r, this.loc), c = !B(r.weekYear) || !B(r.weekNumber) || !B(r.weekday), h = !B(r.ordinal), m = !B(r.year), g = !B(r.month) || !B(r.day), A = m || g, L = r.weekYear || r.weekNumber;
    if ((A || h) && L)
      throw new Zt(
        "Can't mix weekYear/weekNumber units with year/month/day or ordinals"
      );
    if (g && h)
      throw new Zt("Can't mix ordinal dates with month/day");
    let M;
    c ? M = Js(
      { ...Ir(this.c, i, a), ...r },
      i,
      a
    ) : B(r.ordinal) ? (M = { ...this.toObject(), ...r }, B(r.day) && (M.day = Math.min(Ar(M.year, M.month), M.day))) : M = Xs({ ...xi(this.c), ...r });
    const [Z, W] = _r(M, this.o, this.zone);
    return Tt(this, { ts: Z, o: W });
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
    const r = Q.fromDurationLike(e);
    return Tt(this, co(this, r));
  }
  /**
   * Subtract a period of time to this DateTime and return the resulting DateTime
   * See {@link DateTime#plus}
   * @param {Duration|Object|number} duration - The amount to subtract. Either a Luxon Duration, a number of milliseconds, the object argument to Duration.fromObject()
   @return {DateTime}
   */
  minus(e) {
    if (!this.isValid) return this;
    const r = Q.fromDurationLike(e).negate();
    return Tt(this, co(this, r));
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
    const i = {}, a = Q.normalizeUnit(e);
    switch (a) {
      case "years":
        i.month = 1;
      case "quarters":
      case "months":
        i.day = 1;
      case "weeks":
      case "days":
        i.hour = 0;
      case "hours":
        i.minute = 0;
      case "minutes":
        i.second = 0;
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
    return this.isValid ? be.create(this.loc.redefaultToEN(r)).formatDateTimeFromString(this, e) : Ii;
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
  toLocaleString(e = Er, r = {}) {
    return this.isValid ? be.create(this.loc.clone(r), e).formatDateTime(this) : Ii;
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
    return this.isValid ? be.create(this.loc.clone(e), e).formatDateTimeParts(this) : [];
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
    format: e = "extended",
    suppressSeconds: r = !1,
    suppressMilliseconds: i = !1,
    includeOffset: a = !0,
    extendedZone: c = !1
  } = {}) {
    if (!this.isValid)
      return null;
    const h = e === "extended";
    let m = Di(this, h);
    return m += "T", m += fo(this, h, r, i, a, c), m;
  }
  /**
   * Returns an ISO 8601-compliant string representation of this DateTime's date component
   * @param {Object} opts - options
   * @param {string} [opts.format='extended'] - choose between the basic and extended format
   * @example DateTime.utc(1982, 5, 25).toISODate() //=> '1982-05-25'
   * @example DateTime.utc(1982, 5, 25).toISODate({ format: 'basic' }) //=> '19820525'
   * @return {string}
   */
  toISODate({ format: e = "extended" } = {}) {
    return this.isValid ? Di(this, e === "extended") : null;
  }
  /**
   * Returns an ISO 8601-compliant string representation of this DateTime's week date
   * @example DateTime.utc(1982, 5, 25).toISOWeekDate() //=> '1982-W21-2'
   * @return {string}
   */
  toISOWeekDate() {
    return wr(this, "kkkk-'W'WW-c");
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
    suppressMilliseconds: e = !1,
    suppressSeconds: r = !1,
    includeOffset: i = !0,
    includePrefix: a = !1,
    extendedZone: c = !1,
    format: h = "extended"
  } = {}) {
    return this.isValid ? (a ? "T" : "") + fo(
      this,
      h === "extended",
      r,
      e,
      i,
      c
    ) : null;
  }
  /**
   * Returns an RFC 2822-compatible string representation of this DateTime
   * @example DateTime.utc(2014, 7, 13).toRFC2822() //=> 'Sun, 13 Jul 2014 00:00:00 +0000'
   * @example DateTime.local(2014, 7, 13).toRFC2822() //=> 'Sun, 13 Jul 2014 00:00:00 -0400'
   * @return {string}
   */
  toRFC2822() {
    return wr(this, "EEE, dd LLL yyyy HH:mm:ss ZZZ", !1);
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
    return wr(this.toUTC(), "EEE, dd LLL yyyy HH:mm:ss 'GMT'");
  }
  /**
   * Returns a string representation of this DateTime appropriate for use in SQL Date
   * @example DateTime.utc(2014, 7, 13).toSQLDate() //=> '2014-07-13'
   * @return {string}
   */
  toSQLDate() {
    return this.isValid ? Di(this, !0) : null;
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
    return (r || e) && (i && (a += " "), r ? a += "z" : e && (a += "ZZ")), wr(this, a, !0);
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
      return Q.invalid("created by diffing an invalid DateTime");
    const a = { locale: this.locale, numberingSystem: this.numberingSystem, ...i }, c = Gu(r).map(Q.normalizeUnit), h = e.valueOf() > this.valueOf(), m = h ? this : e, g = h ? e : this, A = ec(m, g, c, a);
    return h ? A.negate() : A;
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
    return this.diff(z.now(), e, r);
  }
  /**
   * Return an Interval spanning between this DateTime and another DateTime
   * @param {DateTime} otherDateTime - the other end point of the Interval
   * @return {Interval}
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
  toRelative(e = {}) {
    if (!this.isValid) return null;
    const r = e.base || z.fromObject({}, { zone: this.zone }), i = e.padding ? this < r ? -e.padding : e.padding : 0;
    let a = ["years", "months", "days", "hours", "minutes", "seconds"], c = e.unit;
    return Array.isArray(e.unit) && (a = e.unit, c = void 0), po(r, this.plus(i), {
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
    return this.isValid ? po(e.base || z.fromObject({}, { zone: this.zone }), this, {
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
    if (!e.every(z.isDateTime))
      throw new ve("min requires all arguments be DateTimes");
    return eo(e, (r) => r.valueOf(), Math.min);
  }
  /**
   * Return the max of several date times
   * @param {...DateTime} dateTimes - the DateTimes from which to choose the maximum
   * @return {DateTime} the max DateTime, or undefined if called with no argument
   */
  static max(...e) {
    if (!e.every(z.isDateTime))
      throw new ve("max requires all arguments be DateTimes");
    return eo(e, (r) => r.valueOf(), Math.max);
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
    return Ea(h, e, r);
  }
  /**
   * @deprecated use fromFormatExplain instead
   */
  static fromStringExplain(e, r, i = {}) {
    return z.fromFormatExplain(e, r, i);
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
    return new xa(c, e);
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
    if (B(e) || B(r))
      throw new ve(
        "fromFormatParser requires an input string and a format parser"
      );
    const { locale: a = null, numberingSystem: c = null } = i, h = re.fromOpts({
      locale: a,
      numberingSystem: c,
      defaultToEN: !0
    });
    if (!h.equals(r.locale))
      throw new ve(
        `fromFormatParser called with a locale of ${h}, but the format parser was created for ${r.locale}`
      );
    const { result: m, zone: g, specificOffset: A, invalidReason: L } = r.explainFromTokens(e);
    return L ? z.invalid(L) : Wt(
      m,
      g,
      i,
      `format ${r.format}`,
      e,
      A
    );
  }
  // FORMAT PRESETS
  /**
   * {@link DateTime#toLocaleString} format like 10/14/1983
   * @type {Object}
   */
  static get DATE_SHORT() {
    return Er;
  }
  /**
   * {@link DateTime#toLocaleString} format like 'Oct 14, 1983'
   * @type {Object}
   */
  static get DATE_MED() {
    return $o;
  }
  /**
   * {@link DateTime#toLocaleString} format like 'Fri, Oct 14, 1983'
   * @type {Object}
   */
  static get DATE_MED_WITH_WEEKDAY() {
    return Su;
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
    return Mo;
  }
  /**
   * {@link DateTime#toLocaleString} format like '09:30 AM'. Only 12-hour if the locale is.
   * @type {Object}
   */
  static get TIME_SIMPLE() {
    return Po;
  }
  /**
   * {@link DateTime#toLocaleString} format like '09:30:23 AM'. Only 12-hour if the locale is.
   * @type {Object}
   */
  static get TIME_WITH_SECONDS() {
    return Fo;
  }
  /**
   * {@link DateTime#toLocaleString} format like '09:30:23 AM EDT'. Only 12-hour if the locale is.
   * @type {Object}
   */
  static get TIME_WITH_SHORT_OFFSET() {
    return Ro;
  }
  /**
   * {@link DateTime#toLocaleString} format like '09:30:23 AM Eastern Daylight Time'. Only 12-hour if the locale is.
   * @type {Object}
   */
  static get TIME_WITH_LONG_OFFSET() {
    return Vo;
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
    return Uo;
  }
  /**
   * {@link DateTime#toLocaleString} format like '09:30:23 Eastern Daylight Time', always 24-hour.
   * @type {Object}
   */
  static get TIME_24_WITH_LONG_OFFSET() {
    return jo;
  }
  /**
   * {@link DateTime#toLocaleString} format like '10/14/1983, 9:30 AM'. Only 12-hour if the locale is.
   * @type {Object}
   */
  static get DATETIME_SHORT() {
    return Wo;
  }
  /**
   * {@link DateTime#toLocaleString} format like '10/14/1983, 9:30:33 AM'. Only 12-hour if the locale is.
   * @type {Object}
   */
  static get DATETIME_SHORT_WITH_SECONDS() {
    return Ko;
  }
  /**
   * {@link DateTime#toLocaleString} format like 'Oct 14, 1983, 9:30 AM'. Only 12-hour if the locale is.
   * @type {Object}
   */
  static get DATETIME_MED() {
    return zo;
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
    return Tu;
  }
  /**
   * {@link DateTime#toLocaleString} format like 'October 14, 1983, 9:30 AM EDT'. Only 12-hour if the locale is.
   * @type {Object}
   */
  static get DATETIME_FULL() {
    return Bo;
  }
  /**
   * {@link DateTime#toLocaleString} format like 'October 14, 1983, 9:30:33 AM EDT'. Only 12-hour if the locale is.
   * @type {Object}
   */
  static get DATETIME_FULL_WITH_SECONDS() {
    return Ho;
  }
  /**
   * {@link DateTime#toLocaleString} format like 'Friday, October 14, 1983, 9:30 AM Eastern Daylight Time'. Only 12-hour if the locale is.
   * @type {Object}
   */
  static get DATETIME_HUGE() {
    return Yo;
  }
  /**
   * {@link DateTime#toLocaleString} format like 'Friday, October 14, 1983, 9:30:33 AM Eastern Daylight Time'. Only 12-hour if the locale is.
   * @type {Object}
   */
  static get DATETIME_HUGE_WITH_SECONDS() {
    return Go;
  }
}
function Sn(s) {
  if (z.isDateTime(s))
    return s;
  if (s && s.valueOf && at(s.valueOf()))
    return z.fromJSDate(s);
  if (s && typeof s == "object")
    return z.fromObject(s);
  throw new ve(
    `Unknown datetime argument: ${s}, of type ${typeof s}`
  );
}
const wc = "3.5.0", Gc = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  DateTime: z,
  Duration: Q,
  FixedOffsetZone: we,
  IANAZone: Ue,
  Info: xn,
  Interval: ae,
  InvalidZone: Jo,
  Settings: ue,
  SystemZone: Pn,
  VERSION: wc,
  Zone: en
}, Symbol.toStringTag, { value: "Module" }));
class Or extends Error {
  constructor(e) {
    super(e), this.name = "KioskDateTimeError";
  }
}
class Bt {
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
    return r ? a + " " + e.toLocaleString(z.TIME_WITH_SECONDS) : a;
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
        let c = z.fromISO(a, { zone: "UTC" }), h = document.getElementById(e + "-tz").value, m = "-";
        r ? m = h : h != "-" && (m = Bt.getActiveUserTimeZone().ianaName), m !== "-" && m !== "UTC" && (c = c.setZone(m)), i.value = this.getLatinDate(c);
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
    var c;
    let a = (c = e.textContent) == null ? void 0 : c.trim();
    if (a) {
      let h = z.fromISO(a, { zone: "UTC" }), m, g;
      if (e.dataset.tzIndex != null && this.timeZones) {
        let Z = await this.timeZones.getTimeZoneByIndex(Number(e.dataset.tzIndex));
        Z && Z.tz_IANA && (m = Z.tz_IANA), g = Z && Z.tz_long ? Z.tz_long : m;
      }
      m || (m = e.dataset.recordingIanaTz), m && m !== "UTC" && m !== "-" && (h = h.setZone(m));
      const A = i ? this.getLatinDate(h) : h.toLocaleString(), L = g ? ` (${g})` : " (legacy)", M = r ? L : "";
      e.innerText = A + M;
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
    var m;
    const c = document.getElementById(e);
    let h = "";
    if (c) {
      r && c.classList.contains(r) && c.classList.remove(r);
      let g = c.value;
      if (g && g.trim()) {
        const A = a ? Bt.getActiveRecordingTimeZone().ianaName : Bt.getActiveUserTimeZone().ianaName, L = new Bt();
        try {
          if (h = (m = L.guessDateTime(g, !1, A)) == null ? void 0 : m.toISO({
            includeOffset: !1,
            suppressMilliseconds: !0
          }), !h)
            throw Error("date/time value not understood.");
        } catch (M) {
          throw r && c.classList.add(r), M instanceof Or && i && c.focus(), M;
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
    var c;
    const r = [
      /^(?<day>\d{1,2})\.(?<latinMonth>[IVX]{1,4})\.(?<year>\d{2,4})$/,
      /^(?<day>\d{1,2}) (?<latinMonth>[IVX]{1,4}) (?<year>\d{2,4})$/,
      /^(?<day>\d{1,2})(?<latinMonth>[IVX]{1,4})(?<year>\d{2,4})$/
    ];
    let i = "", a = null;
    for (const h of r)
      if (a = new RegExp(h).exec(e), a)
        break;
    if (a)
      try {
        const h = (c = a.groups) == null ? void 0 : c.latinMonth;
        a.groups && h && this.latinMonths.hasOwnProperty(h) && (i = this.formatISO8601DateStr(a.groups.year, this.latinMonths[h], a.groups.day));
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
    const a = z.fromISO(e, { zone: "utc" });
    if (a.isValid) return a;
    let [c, h] = this.splitDateAndTime(e);
    if (!h && !r)
      throw new Or(`${e} has no time.`);
    let m = this.guessLatinDate(c);
    m && (c = m);
    let A = /^(?<day>\d{1,2})\.(?<month>\d{1,2})\.(?<year>\d{2,4})$/.exec(c);
    if (A && A.groups)
      try {
        c = this.formatISO8601DateStr(A.groups.year, A.groups.month, A.groups.day);
      } catch {
      }
    if (A = /^(?<month>\d{1,2})\/(?<day>\d{1,2})\/(?<year>\d{2,4})$/.exec(c), A && A.groups)
      try {
        c = this.formatISO8601DateStr(A.groups.year, A.groups.month, A.groups.day);
      } catch {
      }
    let M;
    if (c && (h ? M = z.fromISO(c + "T" + h, { zone: i, setZone: !0 }).toUTC() : M = z.fromISO(c, { zone: i, setZone: !0 }).toUTC(), !M.isValid))
      throw new Or(`${e} is not a valid date`);
    return M;
  }
}
const Jc = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  KioskDateTime: Bt,
  KioskDateTimeError: Or
}, Symbol.toStringTag, { value: "Module" })), $a = 2, ji = 3;
/**
 * @license
 * Copyright 2019 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const xr = globalThis, es = xr.ShadowRoot && (xr.ShadyCSS === void 0 || xr.ShadyCSS.nativeShadow) && "adoptedStyleSheets" in Document.prototype && "replace" in CSSStyleSheet.prototype, Na = Symbol(), go = /* @__PURE__ */ new WeakMap();
let kc = class {
  constructor(e, r, i) {
    if (this._$cssResult$ = !0, i !== Na) throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");
    this.cssText = e, this.t = r;
  }
  get styleSheet() {
    let e = this.o;
    const r = this.t;
    if (es && e === void 0) {
      const i = r !== void 0 && r.length === 1;
      i && (e = go.get(r)), e === void 0 && ((this.o = e = new CSSStyleSheet()).replaceSync(this.cssText), i && go.set(r, e));
    }
    return e;
  }
  toString() {
    return this.cssText;
  }
};
const _c = (s) => new kc(typeof s == "string" ? s : s + "", void 0, Na), Sc = (s, e) => {
  if (es) s.adoptedStyleSheets = e.map((r) => r instanceof CSSStyleSheet ? r : r.styleSheet);
  else for (const r of e) {
    const i = document.createElement("style"), a = xr.litNonce;
    a !== void 0 && i.setAttribute("nonce", a), i.textContent = r.cssText, s.appendChild(i);
  }
}, vo = es ? (s) => s : (s) => s instanceof CSSStyleSheet ? ((e) => {
  let r = "";
  for (const i of e.cssRules) r += i.cssText;
  return _c(r);
})(s) : s;
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const { is: Tc, defineProperty: Oc, getOwnPropertyDescriptor: xc, getOwnPropertyNames: Ec, getOwnPropertySymbols: Ic, getPrototypeOf: Ac } = Object, ut = globalThis, bo = ut.trustedTypes, Cc = bo ? bo.emptyScript : "", $i = ut.reactiveElementPolyfillSupport, An = (s, e) => s, Dr = { toAttribute(s, e) {
  switch (e) {
    case Boolean:
      s = s ? Cc : null;
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
} }, ts = (s, e) => !Tc(s, e), wo = { attribute: !0, type: String, converter: Dr, reflect: !1, hasChanged: ts };
Symbol.metadata ?? (Symbol.metadata = Symbol("metadata")), ut.litPropertyMetadata ?? (ut.litPropertyMetadata = /* @__PURE__ */ new WeakMap());
class zt extends HTMLElement {
  static addInitializer(e) {
    this._$Ei(), (this.l ?? (this.l = [])).push(e);
  }
  static get observedAttributes() {
    return this.finalize(), this._$Eh && [...this._$Eh.keys()];
  }
  static createProperty(e, r = wo) {
    if (r.state && (r.attribute = !1), this._$Ei(), this.elementProperties.set(e, r), !r.noAccessor) {
      const i = Symbol(), a = this.getPropertyDescriptor(e, i, r);
      a !== void 0 && Oc(this.prototype, e, a);
    }
  }
  static getPropertyDescriptor(e, r, i) {
    const { get: a, set: c } = xc(this.prototype, e) ?? { get() {
      return this[r];
    }, set(h) {
      this[r] = h;
    } };
    return { get() {
      return a == null ? void 0 : a.call(this);
    }, set(h) {
      const m = a == null ? void 0 : a.call(this);
      c.call(this, h), this.requestUpdate(e, m, i);
    }, configurable: !0, enumerable: !0 };
  }
  static getPropertyOptions(e) {
    return this.elementProperties.get(e) ?? wo;
  }
  static _$Ei() {
    if (this.hasOwnProperty(An("elementProperties"))) return;
    const e = Ac(this);
    e.finalize(), e.l !== void 0 && (this.l = [...e.l]), this.elementProperties = new Map(e.elementProperties);
  }
  static finalize() {
    if (this.hasOwnProperty(An("finalized"))) return;
    if (this.finalized = !0, this._$Ei(), this.hasOwnProperty(An("properties"))) {
      const r = this.properties, i = [...Ec(r), ...Ic(r)];
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
      for (const a of i) r.unshift(vo(a));
    } else e !== void 0 && r.push(vo(e));
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
    var e;
    this._$ES = new Promise((r) => this.enableUpdating = r), this._$AL = /* @__PURE__ */ new Map(), this._$E_(), this.requestUpdate(), (e = this.constructor.l) == null || e.forEach((r) => r(this));
  }
  addController(e) {
    var r;
    (this._$EO ?? (this._$EO = /* @__PURE__ */ new Set())).add(e), this.renderRoot !== void 0 && this.isConnected && ((r = e.hostConnected) == null || r.call(e));
  }
  removeController(e) {
    var r;
    (r = this._$EO) == null || r.delete(e);
  }
  _$E_() {
    const e = /* @__PURE__ */ new Map(), r = this.constructor.elementProperties;
    for (const i of r.keys()) this.hasOwnProperty(i) && (e.set(i, this[i]), delete this[i]);
    e.size > 0 && (this._$Ep = e);
  }
  createRenderRoot() {
    const e = this.shadowRoot ?? this.attachShadow(this.constructor.shadowRootOptions);
    return Sc(e, this.constructor.elementStyles), e;
  }
  connectedCallback() {
    var e;
    this.renderRoot ?? (this.renderRoot = this.createRenderRoot()), this.enableUpdating(!0), (e = this._$EO) == null || e.forEach((r) => {
      var i;
      return (i = r.hostConnected) == null ? void 0 : i.call(r);
    });
  }
  enableUpdating(e) {
  }
  disconnectedCallback() {
    var e;
    (e = this._$EO) == null || e.forEach((r) => {
      var i;
      return (i = r.hostDisconnected) == null ? void 0 : i.call(r);
    });
  }
  attributeChangedCallback(e, r, i) {
    this._$AK(e, i);
  }
  _$EC(e, r) {
    var c;
    const i = this.constructor.elementProperties.get(e), a = this.constructor._$Eu(e, i);
    if (a !== void 0 && i.reflect === !0) {
      const h = (((c = i.converter) == null ? void 0 : c.toAttribute) !== void 0 ? i.converter : Dr).toAttribute(r, i.type);
      this._$Em = e, h == null ? this.removeAttribute(a) : this.setAttribute(a, h), this._$Em = null;
    }
  }
  _$AK(e, r) {
    var c;
    const i = this.constructor, a = i._$Eh.get(e);
    if (a !== void 0 && this._$Em !== a) {
      const h = i.getPropertyOptions(a), m = typeof h.converter == "function" ? { fromAttribute: h.converter } : ((c = h.converter) == null ? void 0 : c.fromAttribute) !== void 0 ? h.converter : Dr;
      this._$Em = a, this[a] = m.fromAttribute(r, h.type), this._$Em = null;
    }
  }
  requestUpdate(e, r, i) {
    if (e !== void 0) {
      if (i ?? (i = this.constructor.getPropertyOptions(e)), !(i.hasChanged ?? ts)(this[e], r)) return;
      this.P(e, r, i);
    }
    this.isUpdatePending === !1 && (this._$ES = this._$ET());
  }
  P(e, r, i) {
    this._$AL.has(e) || this._$AL.set(e, r), i.reflect === !0 && this._$Em !== e && (this._$Ej ?? (this._$Ej = /* @__PURE__ */ new Set())).add(e);
  }
  async _$ET() {
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
    var i;
    if (!this.isUpdatePending) return;
    if (!this.hasUpdated) {
      if (this.renderRoot ?? (this.renderRoot = this.createRenderRoot()), this._$Ep) {
        for (const [c, h] of this._$Ep) this[c] = h;
        this._$Ep = void 0;
      }
      const a = this.constructor.elementProperties;
      if (a.size > 0) for (const [c, h] of a) h.wrapped !== !0 || this._$AL.has(c) || this[c] === void 0 || this.P(c, this[c], h);
    }
    let e = !1;
    const r = this._$AL;
    try {
      e = this.shouldUpdate(r), e ? (this.willUpdate(r), (i = this._$EO) == null || i.forEach((a) => {
        var c;
        return (c = a.hostUpdate) == null ? void 0 : c.call(a);
      }), this.update(r)) : this._$EU();
    } catch (a) {
      throw e = !1, this._$EU(), a;
    }
    e && this._$AE(r);
  }
  willUpdate(e) {
  }
  _$AE(e) {
    var r;
    (r = this._$EO) == null || r.forEach((i) => {
      var a;
      return (a = i.hostUpdated) == null ? void 0 : a.call(i);
    }), this.hasUpdated || (this.hasUpdated = !0, this.firstUpdated(e)), this.updated(e);
  }
  _$EU() {
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
    this._$Ej && (this._$Ej = this._$Ej.forEach((r) => this._$EC(r, this[r]))), this._$EU();
  }
  updated(e) {
  }
  firstUpdated(e) {
  }
}
zt.elementStyles = [], zt.shadowRootOptions = { mode: "open" }, zt[An("elementProperties")] = /* @__PURE__ */ new Map(), zt[An("finalized")] = /* @__PURE__ */ new Map(), $i == null || $i({ ReactiveElement: zt }), (ut.reactiveElementVersions ?? (ut.reactiveElementVersions = [])).push("2.0.4");
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const Cn = globalThis, $r = Cn.trustedTypes, ko = $r ? $r.createPolicy("lit-html", { createHTML: (s) => s }) : void 0, Ma = "$lit$", st = `lit$${Math.random().toFixed(9).slice(2)}$`, Pa = "?" + st, Dc = `<${Pa}>`, At = document, $n = () => At.createComment(""), Nn = (s) => s === null || typeof s != "object" && typeof s != "function", ns = Array.isArray, $c = (s) => ns(s) || typeof (s == null ? void 0 : s[Symbol.iterator]) == "function", Ni = `[ 	
\f\r]`, Tn = /<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g, _o = /-->/g, So = />/g, Ot = RegExp(`>|${Ni}(?:([^\\s"'>=/]+)(${Ni}*=${Ni}*(?:[^ 	
\f\r"'\`<>=]|("|')|))|$)`, "g"), To = /'/g, Oo = /"/g, Fa = /^(?:script|style|textarea|title)$/i, Nc = (s) => (e, ...r) => ({ _$litType$: s, strings: e, values: r }), ot = Nc(1), Xt = Symbol.for("lit-noChange"), he = Symbol.for("lit-nothing"), xo = /* @__PURE__ */ new WeakMap(), It = At.createTreeWalker(At, 129);
function Ra(s, e) {
  if (!ns(s) || !s.hasOwnProperty("raw")) throw Error("invalid template strings array");
  return ko !== void 0 ? ko.createHTML(e) : e;
}
const Mc = (s, e) => {
  const r = s.length - 1, i = [];
  let a, c = e === 2 ? "<svg>" : e === 3 ? "<math>" : "", h = Tn;
  for (let m = 0; m < r; m++) {
    const g = s[m];
    let A, L, M = -1, Z = 0;
    for (; Z < g.length && (h.lastIndex = Z, L = h.exec(g), L !== null); ) Z = h.lastIndex, h === Tn ? L[1] === "!--" ? h = _o : L[1] !== void 0 ? h = So : L[2] !== void 0 ? (Fa.test(L[2]) && (a = RegExp("</" + L[2], "g")), h = Ot) : L[3] !== void 0 && (h = Ot) : h === Ot ? L[0] === ">" ? (h = a ?? Tn, M = -1) : L[1] === void 0 ? M = -2 : (M = h.lastIndex - L[2].length, A = L[1], h = L[3] === void 0 ? Ot : L[3] === '"' ? Oo : To) : h === Oo || h === To ? h = Ot : h === _o || h === So ? h = Tn : (h = Ot, a = void 0);
    const W = h === Ot && s[m + 1].startsWith("/>") ? " " : "";
    c += h === Tn ? g + Dc : M >= 0 ? (i.push(A), g.slice(0, M) + Ma + g.slice(M) + st + W) : g + st + (M === -2 ? m : W);
  }
  return [Ra(s, c + (s[r] || "<?>") + (e === 2 ? "</svg>" : e === 3 ? "</math>" : "")), i];
};
class Mn {
  constructor({ strings: e, _$litType$: r }, i) {
    let a;
    this.parts = [];
    let c = 0, h = 0;
    const m = e.length - 1, g = this.parts, [A, L] = Mc(e, r);
    if (this.el = Mn.createElement(A, i), It.currentNode = this.el.content, r === 2 || r === 3) {
      const M = this.el.content.firstChild;
      M.replaceWith(...M.childNodes);
    }
    for (; (a = It.nextNode()) !== null && g.length < m; ) {
      if (a.nodeType === 1) {
        if (a.hasAttributes()) for (const M of a.getAttributeNames()) if (M.endsWith(Ma)) {
          const Z = L[h++], W = a.getAttribute(M).split(st), ee = /([.?@])?(.*)/.exec(Z);
          g.push({ type: 1, index: c, name: ee[2], strings: W, ctor: ee[1] === "." ? Fc : ee[1] === "?" ? Rc : ee[1] === "@" ? Vc : Rr }), a.removeAttribute(M);
        } else M.startsWith(st) && (g.push({ type: 6, index: c }), a.removeAttribute(M));
        if (Fa.test(a.tagName)) {
          const M = a.textContent.split(st), Z = M.length - 1;
          if (Z > 0) {
            a.textContent = $r ? $r.emptyScript : "";
            for (let W = 0; W < Z; W++) a.append(M[W], $n()), It.nextNode(), g.push({ type: 2, index: ++c });
            a.append(M[Z], $n());
          }
        }
      } else if (a.nodeType === 8) if (a.data === Pa) g.push({ type: 2, index: c });
      else {
        let M = -1;
        for (; (M = a.data.indexOf(st, M + 1)) !== -1; ) g.push({ type: 7, index: c }), M += st.length - 1;
      }
      c++;
    }
  }
  static createElement(e, r) {
    const i = At.createElement("template");
    return i.innerHTML = e, i;
  }
}
function Qt(s, e, r = s, i) {
  var h, m;
  if (e === Xt) return e;
  let a = i !== void 0 ? (h = r._$Co) == null ? void 0 : h[i] : r._$Cl;
  const c = Nn(e) ? void 0 : e._$litDirective$;
  return (a == null ? void 0 : a.constructor) !== c && ((m = a == null ? void 0 : a._$AO) == null || m.call(a, !1), c === void 0 ? a = void 0 : (a = new c(s), a._$AT(s, r, i)), i !== void 0 ? (r._$Co ?? (r._$Co = []))[i] = a : r._$Cl = a), a !== void 0 && (e = Qt(s, a._$AS(s, e.values), a, i)), e;
}
class Pc {
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
    const { el: { content: r }, parts: i } = this._$AD, a = ((e == null ? void 0 : e.creationScope) ?? At).importNode(r, !0);
    It.currentNode = a;
    let c = It.nextNode(), h = 0, m = 0, g = i[0];
    for (; g !== void 0; ) {
      if (h === g.index) {
        let A;
        g.type === 2 ? A = new qn(c, c.nextSibling, this, e) : g.type === 1 ? A = new g.ctor(c, g.name, g.strings, this, e) : g.type === 6 && (A = new qc(c, this, e)), this._$AV.push(A), g = i[++m];
      }
      h !== (g == null ? void 0 : g.index) && (c = It.nextNode(), h++);
    }
    return It.currentNode = At, a;
  }
  p(e) {
    let r = 0;
    for (const i of this._$AV) i !== void 0 && (i.strings !== void 0 ? (i._$AI(e, i, r), r += i.strings.length - 2) : i._$AI(e[r])), r++;
  }
}
class qn {
  get _$AU() {
    var e;
    return ((e = this._$AM) == null ? void 0 : e._$AU) ?? this._$Cv;
  }
  constructor(e, r, i, a) {
    this.type = 2, this._$AH = he, this._$AN = void 0, this._$AA = e, this._$AB = r, this._$AM = i, this.options = a, this._$Cv = (a == null ? void 0 : a.isConnected) ?? !0;
  }
  get parentNode() {
    let e = this._$AA.parentNode;
    const r = this._$AM;
    return r !== void 0 && (e == null ? void 0 : e.nodeType) === 11 && (e = r.parentNode), e;
  }
  get startNode() {
    return this._$AA;
  }
  get endNode() {
    return this._$AB;
  }
  _$AI(e, r = this) {
    e = Qt(this, e, r), Nn(e) ? e === he || e == null || e === "" ? (this._$AH !== he && this._$AR(), this._$AH = he) : e !== this._$AH && e !== Xt && this._(e) : e._$litType$ !== void 0 ? this.$(e) : e.nodeType !== void 0 ? this.T(e) : $c(e) ? this.k(e) : this._(e);
  }
  O(e) {
    return this._$AA.parentNode.insertBefore(e, this._$AB);
  }
  T(e) {
    this._$AH !== e && (this._$AR(), this._$AH = this.O(e));
  }
  _(e) {
    this._$AH !== he && Nn(this._$AH) ? this._$AA.nextSibling.data = e : this.T(At.createTextNode(e)), this._$AH = e;
  }
  $(e) {
    var c;
    const { values: r, _$litType$: i } = e, a = typeof i == "number" ? this._$AC(e) : (i.el === void 0 && (i.el = Mn.createElement(Ra(i.h, i.h[0]), this.options)), i);
    if (((c = this._$AH) == null ? void 0 : c._$AD) === a) this._$AH.p(r);
    else {
      const h = new Pc(a, this), m = h.u(this.options);
      h.p(r), this.T(m), this._$AH = h;
    }
  }
  _$AC(e) {
    let r = xo.get(e.strings);
    return r === void 0 && xo.set(e.strings, r = new Mn(e)), r;
  }
  k(e) {
    ns(this._$AH) || (this._$AH = [], this._$AR());
    const r = this._$AH;
    let i, a = 0;
    for (const c of e) a === r.length ? r.push(i = new qn(this.O($n()), this.O($n()), this, this.options)) : i = r[a], i._$AI(c), a++;
    a < r.length && (this._$AR(i && i._$AB.nextSibling, a), r.length = a);
  }
  _$AR(e = this._$AA.nextSibling, r) {
    var i;
    for ((i = this._$AP) == null ? void 0 : i.call(this, !1, !0, r); e && e !== this._$AB; ) {
      const a = e.nextSibling;
      e.remove(), e = a;
    }
  }
  setConnected(e) {
    var r;
    this._$AM === void 0 && (this._$Cv = e, (r = this._$AP) == null || r.call(this, e));
  }
}
class Rr {
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
    if (c === void 0) e = Qt(this, e, r, 0), h = !Nn(e) || e !== this._$AH && e !== Xt, h && (this._$AH = e);
    else {
      const m = e;
      let g, A;
      for (e = c[0], g = 0; g < c.length - 1; g++) A = Qt(this, m[i + g], r, g), A === Xt && (A = this._$AH[g]), h || (h = !Nn(A) || A !== this._$AH[g]), A === he ? e = he : e !== he && (e += (A ?? "") + c[g + 1]), this._$AH[g] = A;
    }
    h && !a && this.j(e);
  }
  j(e) {
    e === he ? this.element.removeAttribute(this.name) : this.element.setAttribute(this.name, e ?? "");
  }
}
class Fc extends Rr {
  constructor() {
    super(...arguments), this.type = 3;
  }
  j(e) {
    this.element[this.name] = e === he ? void 0 : e;
  }
}
class Rc extends Rr {
  constructor() {
    super(...arguments), this.type = 4;
  }
  j(e) {
    this.element.toggleAttribute(this.name, !!e && e !== he);
  }
}
class Vc extends Rr {
  constructor(e, r, i, a, c) {
    super(e, r, i, a, c), this.type = 5;
  }
  _$AI(e, r = this) {
    if ((e = Qt(this, e, r, 0) ?? he) === Xt) return;
    const i = this._$AH, a = e === he && i !== he || e.capture !== i.capture || e.once !== i.once || e.passive !== i.passive, c = e !== he && (i === he || a);
    a && this.element.removeEventListener(this.name, this, i), c && this.element.addEventListener(this.name, this, e), this._$AH = e;
  }
  handleEvent(e) {
    var r;
    typeof this._$AH == "function" ? this._$AH.call(((r = this.options) == null ? void 0 : r.host) ?? this.element, e) : this._$AH.handleEvent(e);
  }
}
class qc {
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
const Mi = Cn.litHtmlPolyfillSupport;
Mi == null || Mi(Mn, qn), (Cn.litHtmlVersions ?? (Cn.litHtmlVersions = [])).push("3.2.1");
const Lc = (s, e, r) => {
  const i = (r == null ? void 0 : r.renderBefore) ?? e;
  let a = i._$litPart$;
  if (a === void 0) {
    const c = (r == null ? void 0 : r.renderBefore) ?? null;
    i._$litPart$ = a = new qn(e.insertBefore($n(), c), c, void 0, r ?? {});
  }
  return a._$AI(s), a;
};
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
let Gt = class extends zt {
  constructor() {
    super(...arguments), this.renderOptions = { host: this }, this._$Do = void 0;
  }
  createRenderRoot() {
    var r;
    const e = super.createRenderRoot();
    return (r = this.renderOptions).renderBefore ?? (r.renderBefore = e.firstChild), e;
  }
  update(e) {
    const r = this.render();
    this.hasUpdated || (this.renderOptions.isConnected = this.isConnected), super.update(e), this._$Do = Lc(r, this.renderRoot, this.renderOptions);
  }
  connectedCallback() {
    var e;
    super.connectedCallback(), (e = this._$Do) == null || e.setConnected(!0);
  }
  disconnectedCallback() {
    var e;
    super.disconnectedCallback(), (e = this._$Do) == null || e.setConnected(!1);
  }
  render() {
    return Xt;
  }
};
var Co;
Gt._$litElement$ = !0, Gt.finalized = !0, (Co = globalThis.litElementHydrateSupport) == null || Co.call(globalThis, { LitElement: Gt });
const Pi = globalThis.litElementPolyfillSupport;
Pi == null || Pi({ LitElement: Gt });
(globalThis.litElementVersions ?? (globalThis.litElementVersions = [])).push("4.1.1");
const rs = class rs extends Gt {
  constructor() {
    super(), this.kiosk_base_url = "/", this.appErrors = [], this.apiContext = void 0, this.showProgress = !1;
  }
  onAppMessage(e) {
    console.log("Unhandled AppMessage received", e.detail), this.addAppError(e.detail.headline + "<br>" + e.detail.body);
  }
  firstUpdated(e) {
    super.firstUpdated(e), this.addEventListener("send-message", this.onAppMessage);
  }
  updated(e) {
    e.has("apiContext") && (this.showProgress = !1, this.apiContext && this.apiContext.status === ji && this.addAppError("Cannot connect to Kiosk API."), !e.apiContext && this.apiContext && this.apiConnected());
  }
  apiConnected() {
  }
  render() {
    let e;
    return this.apiContext && this.apiContext.status === $a ? e = this.apiRender() : this.apiContext && this.apiContext.status === ji ? e = this.renderApiError() : e = this.renderNoContextYet(), ot`
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
            ${this.renderProgress()} ${this.renderErrors()} ${e}
        `;
  }
  renderNoContextYet() {
    return ot` <link rel="stylesheet" href="${this.kiosk_base_url}static/styles.css" /> `;
  }
  renderApiError() {
  }
  renderErrors() {
    return this.appErrors.length > 0 ? ot` ${this.appErrors.map((e) => ot`<div class="system-message" @click="${this.errorClicked}"><span>${e}</span><i>x</i></div>`)} ` : he;
  }
  errorClicked(e) {
    let r = e.currentTarget.children[0].textContent;
    r && this.deleteError(r);
  }
  renderProgress(e = !1) {
    if (e || this.showProgress)
      return ot` <div class="loading">
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
rs.properties = {
  /**
   * The Api Context
   */
  apiContext: { type: Object },
  appErrors: { type: Array },
  showProgress: { type: Boolean }
};
let Eo = rs;
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const Uc = { attribute: !0, type: String, converter: Dr, reflect: !1, hasChanged: ts }, jc = (s = Uc, e, r) => {
  const { kind: i, metadata: a } = r;
  let c = globalThis.litPropertyMetadata.get(a);
  if (c === void 0 && globalThis.litPropertyMetadata.set(a, c = /* @__PURE__ */ new Map()), c.set(r.name, s), i === "accessor") {
    const { name: h } = r;
    return { set(m) {
      const g = e.get.call(this);
      e.set.call(this, m), this.requestUpdate(h, g, s);
    }, init(m) {
      return m !== void 0 && this.P(h, void 0, s), m;
    } };
  }
  if (i === "setter") {
    const { name: h } = r;
    return function(m) {
      const g = this[h];
      e.call(this, m), this.requestUpdate(h, g, s);
    };
  }
  throw Error("Unsupported decorator location: " + i);
};
function Wc(s) {
  return (e, r) => typeof r == "object" ? jc(s, e, r) : ((i, a, c) => {
    const h = a.hasOwnProperty(c);
    return a.constructor.createProperty(c, h ? { ...i, wrapped: !0 } : i), h ? Object.getOwnPropertyDescriptor(a, c) : void 0;
  })(s, e, r);
}
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
function Kc(s) {
  return Wc({ ...s, state: !0, attribute: !1 });
}
var zc = Object.defineProperty, Zc = (s, e, r, i) => {
  for (var a = void 0, c = s.length - 1, h; c >= 0; c--)
    (h = s[c]) && (a = h(e, r, a) || a);
  return a && zc(e, r, a), a;
};
const is = class is extends Gt {
  constructor() {
    super(), this.kiosk_base_url = "/", this.showProgress = !1, this.apiContext = void 0;
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
    let h = {
      // some this math is going on in here: here this points to the beforeEventDetail object. That's why the component's this needed saving
      component: this,
      _defer: !1,
      defer: function(g = void 0) {
        return this._defer = !0, g && (g.stopPropagation(), g.preventDefault()), {
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
    Object.assign(h, r);
    const m = new CustomEvent(e, {
      bubbles: !0,
      composed: !0,
      cancelable: !0,
      detail: h
    });
    if (this.dispatchEvent(m))
      a();
    else {
      if (h._defer)
        return !1;
      i();
    }
    return !0;
  }
  render() {
    let e;
    return this.apiContext && this.apiContext.status === $a ? e = this.apiRender() : this.apiContext && this.apiContext.status === ji ? e = this.renderApiError() : e = this.renderNoContextYet(), ot`
            <link rel="stylesheet" href="${this.kiosk_base_url}static/styles.css" />
            ${e}
        `;
  }
  renderNoContextYet() {
    return ot` <link rel="stylesheet" href="${this.kiosk_base_url}static/styles.css" /> `;
  }
  renderApiError() {
  }
  renderProgress(e = !1) {
    if (e || this.showProgress)
      return ot` <div class="loading">
                <div class="loading-progress"></div>
            </div>`;
  }
};
is.properties = {
  /**
   * The Api Context
   */
  apiContext: { type: Object }
};
let Wi = is;
Zc([
  Kc()
], Wi.prototype, "showProgress");
var Io = typeof globalThis < "u" ? globalThis : typeof window < "u" ? window : typeof global < "u" ? global : typeof self < "u" ? self : {};
function Bc(s) {
  return s && s.__esModule && Object.prototype.hasOwnProperty.call(s, "default") ? s.default : s;
}
var Va = { exports: {} };
(function(s, e) {
  (function(r, i) {
    s.exports = i();
  })(Io, function() {
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
    var c = typeof globalThis < "u" ? globalThis : typeof self < "u" ? self : typeof window < "u" ? window : Io, h = Object.keys, m = Array.isArray;
    function g(t, n) {
      return typeof n != "object" || h(n).forEach(function(o) {
        t[o] = n[o];
      }), t;
    }
    typeof Promise > "u" || c.Promise || (c.Promise = Promise);
    var A = Object.getPrototypeOf, L = {}.hasOwnProperty;
    function M(t, n) {
      return L.call(t, n);
    }
    function Z(t, n) {
      typeof n == "function" && (n = n(A(t))), (typeof Reflect > "u" ? h : Reflect.ownKeys)(n).forEach(function(o) {
        ee(t, o, n[o]);
      });
    }
    var W = Object.defineProperty;
    function ee(t, n, o, u) {
      W(t, n, g(o && M(o, "get") && typeof o.get == "function" ? { get: o.get, set: o.set, configurable: !0 } : { value: o, configurable: !0, writable: !0 }, u));
    }
    function Se(t) {
      return { from: function(n) {
        return t.prototype = Object.create(n.prototype), ee(t.prototype, "constructor", t), { extend: Z.bind(null, t.prototype) };
      } };
    }
    var Ee = Object.getOwnPropertyDescriptor, Ze = [].slice;
    function Re(t, n, o) {
      return Ze.call(t, n, o);
    }
    function on(t, n) {
      return n(t);
    }
    function lt(t) {
      if (!t) throw new Error("Assertion Failed");
    }
    function an(t) {
      c.setImmediate ? setImmediate(t) : setTimeout(t, 0);
    }
    function $e(t, n) {
      if (typeof n == "string" && M(t, n)) return t[n];
      if (!n) return t;
      if (typeof n != "string") {
        for (var o = [], u = 0, l = n.length; u < l; ++u) {
          var f = $e(t, n[u]);
          o.push(f);
        }
        return o;
      }
      var d = n.indexOf(".");
      if (d !== -1) {
        var p = t[n.substr(0, d)];
        return p == null ? void 0 : $e(p, n.substr(d + 1));
      }
    }
    function ke(t, n, o) {
      if (t && n !== void 0 && !("isFrozen" in Object && Object.isFrozen(t))) if (typeof n != "string" && "length" in n) {
        lt(typeof o != "string" && "length" in o);
        for (var u = 0, l = n.length; u < l; ++u) ke(t, n[u], o[u]);
      } else {
        var f, d, p = n.indexOf(".");
        p !== -1 ? (f = n.substr(0, p), (d = n.substr(p + 1)) === "" ? o === void 0 ? m(t) && !isNaN(parseInt(f)) ? t.splice(f, 1) : delete t[f] : t[f] = o : ke(p = !(p = t[f]) || !M(t, f) ? t[f] = {} : p, d, o)) : o === void 0 ? m(t) && !isNaN(parseInt(n)) ? t.splice(n, 1) : delete t[n] : t[n] = o;
      }
    }
    function Ln(t) {
      var n, o = {};
      for (n in t) M(t, n) && (o[n] = t[n]);
      return o;
    }
    var ct = [].concat;
    function Be(t) {
      return ct.apply([], t);
    }
    var Ke = "BigUint64Array,BigInt64Array,Array,Boolean,String,Date,RegExp,Blob,File,FileList,FileSystemFileHandle,FileSystemDirectoryHandle,ArrayBuffer,DataView,Uint8ClampedArray,ImageBitmap,ImageData,Map,Set,CryptoKey".split(",").concat(Be([8, 16, 32, 64].map(function(t) {
      return ["Int", "Uint", "Float"].map(function(n) {
        return n + t + "Array";
      });
    }))).filter(function(t) {
      return c[t];
    }), Un = new Set(Ke.map(function(t) {
      return c[t];
    })), un = null;
    function ft(t) {
      return un = /* @__PURE__ */ new WeakMap(), t = function n(o) {
        if (!o || typeof o != "object") return o;
        var u = un.get(o);
        if (u) return u;
        if (m(o)) {
          u = [], un.set(o, u);
          for (var l = 0, f = o.length; l < f; ++l) u.push(n(o[l]));
        } else if (Un.has(o.constructor)) u = o;
        else {
          var d, p = A(o);
          for (d in u = p === Object.prototype ? {} : Object.create(p), un.set(o, u), o) M(o, d) && (u[d] = n(o[d]));
        }
        return u;
      }(t), un = null, t;
    }
    var qa = {}.toString;
    function Vr(t) {
      return qa.call(t).slice(8, -1);
    }
    var qr = typeof Symbol < "u" ? Symbol.iterator : "@@iterator", La = typeof qr == "symbol" ? function(t) {
      var n;
      return t != null && (n = t[qr]) && n.apply(t);
    } : function() {
      return null;
    };
    function ht(t, n) {
      return n = t.indexOf(n), 0 <= n && t.splice(n, 1), 0 <= n;
    }
    var Dt = {};
    function je(t) {
      var n, o, u, l;
      if (arguments.length === 1) {
        if (m(t)) return t.slice();
        if (this === Dt && typeof t == "string") return [t];
        if (l = La(t)) {
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
    var Lr = typeof Symbol < "u" ? function(t) {
      return t[Symbol.toStringTag] === "AsyncFunction";
    } : function() {
      return !1;
    }, fn = ["Unknown", "Constraint", "Data", "TransactionInactive", "ReadOnly", "Version", "NotFound", "InvalidState", "InvalidAccess", "Abort", "Timeout", "QuotaExceeded", "Syntax", "DataClone"], Ie = ["Modify", "Bulk", "OpenFailed", "VersionChange", "Schema", "Upgrade", "InvalidTable", "MissingAPI", "NoSuchDatabase", "InvalidArgument", "SubTransaction", "Unsupported", "Internal", "DatabaseClosed", "PrematureCommit", "ForeignAwait"].concat(fn), Ua = { VersionChanged: "Database version changed by other database connection", DatabaseClosed: "Database has been closed", Abort: "Transaction aborted", TransactionInactive: "Transaction has already completed or failed", MissingAPI: "IndexedDB API missing. Please visit https://tinyurl.com/y2uuvskb" };
    function $t(t, n) {
      this.name = t, this.message = n;
    }
    function ss(t, n) {
      return t + ". Errors: " + Object.keys(n).map(function(o) {
        return n[o].toString();
      }).filter(function(o, u, l) {
        return l.indexOf(o) === u;
      }).join(`
`);
    }
    function jn(t, n, o, u) {
      this.failures = n, this.failedKeys = u, this.successCount = o, this.message = ss(t, n);
    }
    function Nt(t, n) {
      this.name = "BulkError", this.failures = Object.keys(n).map(function(o) {
        return n[o];
      }), this.failuresByPos = n, this.message = ss(t, this.failures);
    }
    Se($t).from(Error).extend({ toString: function() {
      return this.name + ": " + this.message;
    } }), Se(jn).from($t), Se(Nt).from($t);
    var Ur = Ie.reduce(function(t, n) {
      return t[n] = n + "Error", t;
    }, {}), ja = $t, K = Ie.reduce(function(t, n) {
      var o = n + "Error";
      function u(l, f) {
        this.name = o, l ? typeof l == "string" ? (this.message = "".concat(l).concat(f ? `
 ` + f : ""), this.inner = f || null) : typeof l == "object" && (this.message = "".concat(l.name, " ").concat(l.message), this.inner = l) : (this.message = Ua[n] || o, this.inner = null);
      }
      return Se(u).from(ja), t[n] = u, t;
    }, {});
    K.Syntax = SyntaxError, K.Type = TypeError, K.Range = RangeError;
    var os = fn.reduce(function(t, n) {
      return t[n + "Error"] = K[n], t;
    }, {}), Wn = Ie.reduce(function(t, n) {
      return ["Syntax", "Type", "Range"].indexOf(n) === -1 && (t[n + "Error"] = K[n]), t;
    }, {});
    function ie() {
    }
    function ln(t) {
      return t;
    }
    function Wa(t, n) {
      return t == null || t === ln ? n : function(o) {
        return n(t(o));
      };
    }
    function dt(t, n) {
      return function() {
        t.apply(this, arguments), n.apply(this, arguments);
      };
    }
    function Ka(t, n) {
      return t === ie ? n : function() {
        var o = t.apply(this, arguments);
        o !== void 0 && (arguments[0] = o);
        var u = this.onsuccess, l = this.onerror;
        this.onsuccess = null, this.onerror = null;
        var f = n.apply(this, arguments);
        return u && (this.onsuccess = this.onsuccess ? dt(u, this.onsuccess) : u), l && (this.onerror = this.onerror ? dt(l, this.onerror) : l), f !== void 0 ? f : o;
      };
    }
    function za(t, n) {
      return t === ie ? n : function() {
        t.apply(this, arguments);
        var o = this.onsuccess, u = this.onerror;
        this.onsuccess = this.onerror = null, n.apply(this, arguments), o && (this.onsuccess = this.onsuccess ? dt(o, this.onsuccess) : o), u && (this.onerror = this.onerror ? dt(u, this.onerror) : u);
      };
    }
    function Za(t, n) {
      return t === ie ? n : function(o) {
        var u = t.apply(this, arguments);
        g(o, u);
        var l = this.onsuccess, f = this.onerror;
        return this.onsuccess = null, this.onerror = null, o = n.apply(this, arguments), l && (this.onsuccess = this.onsuccess ? dt(l, this.onsuccess) : l), f && (this.onerror = this.onerror ? dt(f, this.onerror) : f), u === void 0 ? o === void 0 ? void 0 : o : g(u, o);
      };
    }
    function Ba(t, n) {
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
    Wn.ModifyError = jn, Wn.DexieError = $t, Wn.BulkError = Nt;
    var Ve = typeof location < "u" && /^(http|https):\/\/(localhost|127\.0\.0\.1)/.test(location.href);
    function as(t) {
      Ve = t;
    }
    var cn = {}, us = 100, Ke = typeof Promise > "u" ? [] : function() {
      var t = Promise.resolve();
      if (typeof crypto > "u" || !crypto.subtle) return [t, A(t), t];
      var n = crypto.subtle.digest("SHA-512", new Uint8Array([0]));
      return [n, A(n), t];
    }(), fn = Ke[0], Ie = Ke[1], Ke = Ke[2], Ie = Ie && Ie.then, mt = fn && fn.constructor, Wr = !!Ke, hn = function(t, n) {
      dn.push([t, n]), Kn && (queueMicrotask(Ya), Kn = !1);
    }, Kr = !0, Kn = !0, pt = [], zn = [], zr = ln, He = { id: "global", global: !0, ref: 0, unhandleds: [], onunhandled: ie, pgp: !1, env: {}, finalize: ie }, j = He, dn = [], yt = 0, Zn = [];
    function q(t) {
      if (typeof this != "object") throw new TypeError("Promises must be constructed via new");
      this._listeners = [], this._lib = !1;
      var n = this._PSD = j;
      if (typeof t != "function") {
        if (t !== cn) throw new TypeError("Not a function");
        return this._state = arguments[1], this._value = arguments[2], void (this._state === !1 && Br(this, this._value));
      }
      this._state = null, this._value = null, ++n.ref, function o(u, l) {
        try {
          l(function(f) {
            if (u._state === null) {
              if (f === u) throw new TypeError("A promise cannot be resolved with itself.");
              var d = u._lib && Mt();
              f && typeof f.then == "function" ? o(u, function(p, v) {
                f instanceof q ? f._then(p, v) : f.then(p, v);
              }) : (u._state = !0, u._value = f, cs(u)), d && Pt();
            }
          }, Br.bind(null, u));
        } catch (f) {
          Br(u, f);
        }
      }(this, t);
    }
    var Zr = { get: function() {
      var t = j, n = Gn;
      function o(u, l) {
        var f = this, d = !t.global && (t !== j || n !== Gn), p = d && !Ge(), v = new q(function(w, S) {
          Hr(f, new ls(hs(u, t, d, p), hs(l, t, d, p), w, S, t));
        });
        return this._consoleTask && (v._consoleTask = this._consoleTask), v;
      }
      return o.prototype = cn, o;
    }, set: function(t) {
      ee(this, "then", t && t.prototype === cn ? Zr : { get: function() {
        return t;
      }, set: Zr.set });
    } };
    function ls(t, n, o, u, l) {
      this.onFulfilled = typeof t == "function" ? t : null, this.onRejected = typeof n == "function" ? n : null, this.resolve = o, this.reject = u, this.psd = l;
    }
    function Br(t, n) {
      var o, u;
      zn.push(n), t._state === null && (o = t._lib && Mt(), n = zr(n), t._state = !1, t._value = n, u = t, pt.some(function(l) {
        return l._value === u._value;
      }) || pt.push(u), cs(t), o && Pt());
    }
    function cs(t) {
      var n = t._listeners;
      t._listeners = [];
      for (var o = 0, u = n.length; o < u; ++o) Hr(t, n[o]);
      var l = t._PSD;
      --l.ref || l.finalize(), yt === 0 && (++yt, hn(function() {
        --yt == 0 && Yr();
      }, []));
    }
    function Hr(t, n) {
      if (t._state !== null) {
        var o = t._state ? n.onFulfilled : n.onRejected;
        if (o === null) return (t._state ? n.resolve : n.reject)(t._value);
        ++n.psd.ref, ++yt, hn(Ha, [o, t, n]);
      } else t._listeners.push(n);
    }
    function Ha(t, n, o) {
      try {
        var u, l = n._value;
        !n._state && zn.length && (zn = []), u = Ve && n._consoleTask ? n._consoleTask.run(function() {
          return t(l);
        }) : t(l), n._state || zn.indexOf(l) !== -1 || function(f) {
          for (var d = pt.length; d; ) if (pt[--d]._value === f._value) return pt.splice(d, 1);
        }(n), o.resolve(u);
      } catch (f) {
        o.reject(f);
      } finally {
        --yt == 0 && Yr(), --o.psd.ref || o.psd.finalize();
      }
    }
    function Ya() {
      gt(He, function() {
        Mt() && Pt();
      });
    }
    function Mt() {
      var t = Kr;
      return Kn = Kr = !1, t;
    }
    function Pt() {
      var t, n, o;
      do
        for (; 0 < dn.length; ) for (t = dn, dn = [], o = t.length, n = 0; n < o; ++n) {
          var u = t[n];
          u[0].apply(null, u[1]);
        }
      while (0 < dn.length);
      Kn = Kr = !0;
    }
    function Yr() {
      var t = pt;
      pt = [], t.forEach(function(u) {
        u._PSD.onunhandled.call(null, u._value, u);
      });
      for (var n = Zn.slice(0), o = n.length; o; ) n[--o]();
    }
    function Bn(t) {
      return new q(cn, !1, t);
    }
    function oe(t, n) {
      var o = j;
      return function() {
        var u = Mt(), l = j;
        try {
          return Je(o, !0), t.apply(this, arguments);
        } catch (f) {
          n && n(f);
        } finally {
          Je(l, !1), u && Pt();
        }
      };
    }
    Z(q.prototype, { then: Zr, _then: function(t, n) {
      Hr(this, new ls(null, null, t, n, j));
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
          return l(new K.Timeout(n));
        }, t);
        o.then(u, l).finally(clearTimeout.bind(null, f));
      }) : this;
    } }), typeof Symbol < "u" && Symbol.toStringTag && ee(q.prototype, Symbol.toStringTag, "Dexie.Promise"), He.env = fs(), Z(q, { all: function() {
      var t = je.apply(null, arguments).map(Jn);
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
      var t = je.apply(null, arguments).map(Jn);
      return new q(function(n, o) {
        t.map(function(u) {
          return q.resolve(u).then(n, o);
        });
      });
    }, PSD: { get: function() {
      return j;
    }, set: function(t) {
      return j = t;
    } }, totalEchoes: { get: function() {
      return Gn;
    } }, newPSD: Ye, usePSD: gt, scheduler: { get: function() {
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
          var d = j;
          d.unhandleds = [], d.onunhandled = f, d.finalize = dt(function() {
            var p, v = this;
            p = function() {
              v.unhandleds.length === 0 ? l() : f(v.unhandleds[0]);
            }, Zn.push(function w() {
              p(), Zn.splice(Zn.indexOf(w), 1);
            }), ++yt, hn(function() {
              --yt == 0 && Yr();
            }, []);
          }, d.finalize), t();
        }, n, o, u);
      });
    } }), mt && (mt.allSettled && ee(q, "allSettled", function() {
      var t = je.apply(null, arguments).map(Jn);
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
    }), mt.any && typeof AggregateError < "u" && ee(q, "any", function() {
      var t = je.apply(null, arguments).map(Jn);
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
    }), mt.withResolvers && (q.withResolvers = mt.withResolvers));
    var de = { awaits: 0, echoes: 0, id: 0 }, Ga = 0, Hn = [], Yn = 0, Gn = 0, Ja = 0;
    function Ye(t, n, o, u) {
      var l = j, f = Object.create(l);
      return f.parent = l, f.ref = 0, f.global = !1, f.id = ++Ja, He.env, f.env = Wr ? { Promise: q, PromiseProp: { value: q, configurable: !0, writable: !0 }, all: q.all, race: q.race, allSettled: q.allSettled, any: q.any, resolve: q.resolve, reject: q.reject } : {}, n && g(f, n), ++l.ref, f.finalize = function() {
        --this.parent.ref || this.parent.finalize();
      }, u = gt(f, t, o, u), f.ref === 0 && f.finalize(), u;
    }
    function Ft() {
      return de.id || (de.id = ++Ga), ++de.awaits, de.echoes += us, de.id;
    }
    function Ge() {
      return !!de.awaits && (--de.awaits == 0 && (de.id = 0), de.echoes = de.awaits * us, !0);
    }
    function Jn(t) {
      return de.echoes && t && t.constructor === mt ? (Ft(), t.then(function(n) {
        return Ge(), n;
      }, function(n) {
        return Ge(), le(n);
      })) : t;
    }
    function Xa() {
      var t = Hn[Hn.length - 1];
      Hn.pop(), Je(t, !1);
    }
    function Je(t, n) {
      var o, u = j;
      (n ? !de.echoes || Yn++ && t === j : !Yn || --Yn && t === j) || queueMicrotask(n ? (function(l) {
        ++Gn, de.echoes && --de.echoes != 0 || (de.echoes = de.awaits = de.id = 0), Hn.push(j), Je(l, !0);
      }).bind(null, t) : Xa), t !== j && (j = t, u === He && (He.env = fs()), Wr && (o = He.env.Promise, n = t.env, (u.global || t.global) && (Object.defineProperty(c, "Promise", n.PromiseProp), o.all = n.all, o.race = n.race, o.resolve = n.resolve, o.reject = n.reject, n.allSettled && (o.allSettled = n.allSettled), n.any && (o.any = n.any))));
    }
    function fs() {
      var t = c.Promise;
      return Wr ? { Promise: t, PromiseProp: Object.getOwnPropertyDescriptor(c, "Promise"), all: t.all, race: t.race, allSettled: t.allSettled, any: t.any, resolve: t.resolve, reject: t.reject } : {};
    }
    function gt(t, n, o, u, l) {
      var f = j;
      try {
        return Je(t, !0), n(o, u, l);
      } finally {
        Je(f, !1);
      }
    }
    function hs(t, n, o, u) {
      return typeof t != "function" ? t : function() {
        var l = j;
        o && Ft(), Je(n, !0);
        try {
          return t.apply(this, arguments);
        } finally {
          Je(l, !1), u && queueMicrotask(Ge);
        }
      };
    }
    function Gr(t) {
      Promise === mt && de.echoes === 0 ? Yn === 0 ? t() : enqueueNativeMicroTask(t) : setTimeout(t, 0);
    }
    ("" + Ie).indexOf("[native code]") === -1 && (Ft = Ge = ie);
    var le = q.reject, vt = "￿", We = "Invalid key provided. Keys must be of type string, number, Date or Array<string | number | Date>.", ds = "String expected.", Rt = [], Xn = "__dbnames", Jr = "readonly", Xr = "readwrite";
    function bt(t, n) {
      return t ? n ? function() {
        return t.apply(this, arguments) && n.apply(this, arguments);
      } : t : n;
    }
    var ms = { type: 3, lower: -1 / 0, lowerOpen: !1, upper: [[]], upperOpen: !1 };
    function Qn(t) {
      return typeof t != "string" || /\./.test(t) ? function(n) {
        return n;
      } : function(n) {
        return n[t] === void 0 && t in n && delete (n = ft(n))[t], n;
      };
    }
    function ps() {
      throw K.Type();
    }
    function X(t, n) {
      try {
        var o = ys(t), u = ys(n);
        if (o !== u) return o === "Array" ? 1 : u === "Array" ? -1 : o === "binary" ? 1 : u === "binary" ? -1 : o === "string" ? 1 : u === "string" ? -1 : o === "Date" ? 1 : u !== "Date" ? NaN : -1;
        switch (o) {
          case "number":
          case "Date":
          case "string":
            return n < t ? 1 : t < n ? -1 : 0;
          case "binary":
            return function(l, f) {
              for (var d = l.length, p = f.length, v = d < p ? d : p, w = 0; w < v; ++w) if (l[w] !== f[w]) return l[w] < f[w] ? -1 : 1;
              return d === p ? 0 : d < p ? -1 : 1;
            }(gs(t), gs(n));
          case "Array":
            return function(l, f) {
              for (var d = l.length, p = f.length, v = d < p ? d : p, w = 0; w < v; ++w) {
                var S = X(l[w], f[w]);
                if (S !== 0) return S;
              }
              return d === p ? 0 : d < p ? -1 : 1;
            }(t, n);
        }
      } catch {
      }
      return NaN;
    }
    function ys(t) {
      var n = typeof t;
      return n != "object" ? n : ArrayBuffer.isView(t) ? "binary" : (t = Vr(t), t === "ArrayBuffer" ? "binary" : t);
    }
    function gs(t) {
      return t instanceof Uint8Array ? t : ArrayBuffer.isView(t) ? new Uint8Array(t.buffer, t.byteOffset, t.byteLength) : new Uint8Array(t);
    }
    var vs = (se.prototype._trans = function(t, n, o) {
      var u = this._tx || j.trans, l = this.name, f = Ve && typeof console < "u" && console.createTask && console.createTask("Dexie: ".concat(t === "readonly" ? "read" : "write", " ").concat(this.name));
      function d(w, S, y) {
        if (!y.schema[l]) throw new K.NotFound("Table " + l + " not part of transaction");
        return n(y.idbtrans, y);
      }
      var p = Mt();
      try {
        var v = u && u.db._novip === this.db._novip ? u === j.trans ? u._promise(t, d, o) : Ye(function() {
          return u._promise(t, d, o);
        }, { trans: u, transless: j.transless || j }) : function w(S, y, O, b) {
          if (S.idbdb && (S._state.openComplete || j.letThrough || S._vip)) {
            var _ = S._createTransaction(y, O, S._dbSchema);
            try {
              _.create(), S._state.PR1398_maxLoop = 3;
            } catch (T) {
              return T.name === Ur.InvalidState && S.isOpen() && 0 < --S._state.PR1398_maxLoop ? (console.warn("Dexie: Need to reopen db"), S.close({ disableAutoOpen: !1 }), S.open().then(function() {
                return w(S, y, O, b);
              })) : le(T);
            }
            return _._promise(y, function(T, k) {
              return Ye(function() {
                return j.trans = _, b(T, k, _);
              });
            }).then(function(T) {
              if (y === "readwrite") try {
                _.idbtrans.commit();
              } catch {
              }
              return y === "readonly" ? T : _._completion.then(function() {
                return T;
              });
            });
          }
          if (S._state.openComplete) return le(new K.DatabaseClosed(S._state.dbOpenError));
          if (!S._state.isBeingOpened) {
            if (!S._state.autoOpen) return le(new K.DatabaseClosed());
            S.open().catch(ie);
          }
          return S._state.dbReadyPromise.then(function() {
            return w(S, y, O, b);
          });
        }(this.db, t, [this.name], d);
        return f && (v._consoleTask = f, v = v.catch(function(w) {
          return console.trace(w), le(w);
        })), v;
      } finally {
        p && Pt();
      }
    }, se.prototype.get = function(t, n) {
      var o = this;
      return t && t.constructor === Object ? this.where(t).first(n) : t == null ? le(new K.Type("Invalid argument to Table.get()")) : this._trans("readonly", function(u) {
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
        if (p.compound && n.every(function(w) {
          return 0 <= p.keyPath.indexOf(w);
        })) {
          for (var v = 0; v < n.length; ++v) if (n.indexOf(p.keyPath[v]) === -1) return !1;
          return !0;
        }
        return !1;
      }).sort(function(p, v) {
        return p.keyPath.length - v.keyPath.length;
      })[0];
      if (o && this.db._maxKey !== vt) {
        var f = o.keyPath.slice(0, n.length);
        return this.where(f).equals(f.map(function(v) {
          return t[v];
        }));
      }
      !o && Ve && console.warn("The query ".concat(JSON.stringify(t), " on ").concat(this.name, " would benefit from a ") + "compound index [".concat(n.join("+"), "]"));
      var u = this.schema.idxByName;
      function l(p, v) {
        return X(p, v) === 0;
      }
      var d = n.reduce(function(y, v) {
        var w = y[0], S = y[1], y = u[v], O = t[v];
        return [w || y, w || !y ? bt(S, y && y.multi ? function(b) {
          return b = $e(b, v), m(b) && b.some(function(_) {
            return l(O, _);
          });
        } : function(b) {
          return l(O, $e(b, v));
        }) : S];
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
      (this.schema.mappedClass = t).prototype instanceof ps && (function(v, w) {
        if (typeof w != "function" && w !== null) throw new TypeError("Class extends value " + String(w) + " is not a constructor or null");
        function S() {
          this.constructor = v;
        }
        r(v, w), v.prototype = w === null ? Object.create(w) : (S.prototype = w.prototype, new S());
      }(l, n = t), Object.defineProperty(l.prototype, "db", { get: function() {
        return o;
      }, enumerable: !1, configurable: !0 }), l.prototype.table = function() {
        return u;
      }, t = l);
      for (var f = /* @__PURE__ */ new Set(), d = t.prototype; d; d = A(d)) Object.getOwnPropertyNames(d).forEach(function(v) {
        return f.add(v);
      });
      function p(v) {
        if (!v) return v;
        var w, S = Object.create(t.prototype);
        for (w in v) if (!f.has(w)) try {
          S[w] = v[w];
        } catch {
        }
        return S;
      }
      return this.schema.readHook && this.hook.reading.unsubscribe(this.schema.readHook), this.schema.readHook = p, this.hook("reading", p), t;
    }, se.prototype.defineClass = function() {
      return this.mapToClass(function(t) {
        g(this, t);
      });
    }, se.prototype.add = function(t, n) {
      var o = this, u = this.schema.primKey, l = u.auto, f = u.keyPath, d = t;
      return f && l && (d = Qn(f)(t)), this._trans("readwrite", function(p) {
        return o.core.mutate({ trans: p, type: "add", keys: n != null ? [n] : null, values: [d] });
      }).then(function(p) {
        return p.numFailures ? q.reject(p.failures[0]) : p.lastResult;
      }).then(function(p) {
        if (f) try {
          ke(t, f, p);
        } catch {
        }
        return p;
      });
    }, se.prototype.update = function(t, n) {
      return typeof t != "object" || m(t) ? this.where(":id").equals(t).modify(n) : (t = $e(t, this.schema.primKey.keyPath), t === void 0 ? le(new K.InvalidArgument("Given object does not contain its primary key")) : this.where(":id").equals(t).modify(n));
    }, se.prototype.put = function(t, n) {
      var o = this, u = this.schema.primKey, l = u.auto, f = u.keyPath, d = t;
      return f && l && (d = Qn(f)(t)), this._trans("readwrite", function(p) {
        return o.core.mutate({ trans: p, type: "put", values: [d], keys: n != null ? [n] : null });
      }).then(function(p) {
        return p.numFailures ? q.reject(p.failures[0]) : p.lastResult;
      }).then(function(p) {
        if (f) try {
          ke(t, f, p);
        } catch {
        }
        return p;
      });
    }, se.prototype.delete = function(t) {
      var n = this;
      return this._trans("readwrite", function(o) {
        return n.core.mutate({ trans: o, type: "delete", keys: [t] });
      }).then(function(o) {
        return o.numFailures ? q.reject(o.failures[0]) : void 0;
      });
    }, se.prototype.clear = function() {
      var t = this;
      return this._trans("readwrite", function(n) {
        return t.core.mutate({ trans: n, type: "deleteRange", range: ms });
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
        var w = u.schema.primKey, p = w.auto, w = w.keyPath;
        if (w && l) throw new K.InvalidArgument("bulkAdd(): keys argument invalid on tables with inbound keys");
        if (l && l.length !== t.length) throw new K.InvalidArgument("Arguments objects and keys must have the same length");
        var v = t.length, w = w && p ? t.map(Qn(w)) : t;
        return u.core.mutate({ trans: d, type: "add", keys: l, values: w, wantResults: f }).then(function(_) {
          var y = _.numFailures, O = _.results, b = _.lastResult, _ = _.failures;
          if (y === 0) return f ? O : b;
          throw new Nt("".concat(u.name, ".bulkAdd(): ").concat(y, " of ").concat(v, " operations failed"), _);
        });
      });
    }, se.prototype.bulkPut = function(t, n, o) {
      var u = this, l = Array.isArray(n) ? n : void 0, f = (o = o || (l ? void 0 : n)) ? o.allKeys : void 0;
      return this._trans("readwrite", function(d) {
        var w = u.schema.primKey, p = w.auto, w = w.keyPath;
        if (w && l) throw new K.InvalidArgument("bulkPut(): keys argument invalid on tables with inbound keys");
        if (l && l.length !== t.length) throw new K.InvalidArgument("Arguments objects and keys must have the same length");
        var v = t.length, w = w && p ? t.map(Qn(w)) : t;
        return u.core.mutate({ trans: d, type: "put", keys: l, values: w, wantResults: f }).then(function(_) {
          var y = _.numFailures, O = _.results, b = _.lastResult, _ = _.failures;
          if (y === 0) return f ? O : b;
          throw new Nt("".concat(u.name, ".bulkPut(): ").concat(y, " of ").concat(v, " operations failed"), _);
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
          var v = [], w = [];
          t.forEach(function(y, O) {
            var b = y.key, _ = y.changes, T = p[O];
            if (T) {
              for (var k = 0, x = Object.keys(_); k < x.length; k++) {
                var E = x[k], I = _[E];
                if (E === n.schema.primKey.keyPath) {
                  if (X(I, b) !== 0) throw new K.Constraint("Cannot update primary key in bulkUpdate()");
                } else ke(T, E, I);
              }
              f.push(O), v.push(b), w.push(T);
            }
          });
          var S = v.length;
          return o.mutate({ trans: d, type: "put", keys: v, values: w, updates: { keys: u, changeSpecs: l } }).then(function(y) {
            var O = y.numFailures, b = y.failures;
            if (O === 0) return S;
            for (var _ = 0, T = Object.keys(b); _ < T.length; _++) {
              var k, x = T[_], E = f[Number(x)];
              E != null && (k = b[x], delete b[x], b[E] = k);
            }
            throw new Nt("".concat(n.name, ".bulkUpdate(): ").concat(O, " of ").concat(S, " operations failed"), b);
          });
        });
      });
    }, se.prototype.bulkDelete = function(t) {
      var n = this, o = t.length;
      return this._trans("readwrite", function(u) {
        return n.core.mutate({ trans: u, type: "delete", keys: t });
      }).then(function(d) {
        var l = d.numFailures, f = d.lastResult, d = d.failures;
        if (l === 0) return f;
        throw new Nt("".concat(n.name, ".bulkDelete(): ").concat(l, " of ").concat(o, " operations failed"), d);
      });
    }, se);
    function se() {
    }
    function mn(t) {
      function n(d, p) {
        if (p) {
          for (var v = arguments.length, w = new Array(v - 1); --v; ) w[v - 1] = arguments[v];
          return o[d].subscribe.apply(null, w), t;
        }
        if (typeof d == "string") return o[d];
      }
      var o = {};
      n.addEventType = f;
      for (var u = 1, l = arguments.length; u < l; ++u) f(arguments[u]);
      return n;
      function f(d, p, v) {
        if (typeof d != "object") {
          var w;
          p = p || Ba;
          var S = { subscribers: [], fire: v = v || ie, subscribe: function(y) {
            S.subscribers.indexOf(y) === -1 && (S.subscribers.push(y), S.fire = p(S.fire, y));
          }, unsubscribe: function(y) {
            S.subscribers = S.subscribers.filter(function(O) {
              return O !== y;
            }), S.fire = S.subscribers.reduce(p, v);
          } };
          return o[d] = n[d] = S;
        }
        h(w = d).forEach(function(y) {
          var O = w[y];
          if (m(O)) f(y, w[y][0], w[y][1]);
          else {
            if (O !== "asap") throw new K.InvalidArgument("Invalid event config");
            var b = f(y, ln, function() {
              for (var _ = arguments.length, T = new Array(_); _--; ) T[_] = arguments[_];
              b.subscribers.forEach(function(k) {
                an(function() {
                  k.apply(null, T);
                });
              });
            });
          }
        });
      }
    }
    function pn(t, n) {
      return Se(n).from({ prototype: t }), n;
    }
    function Vt(t, n) {
      return !(t.filter || t.algorithm || t.or) && (n ? t.justLimit : !t.replayFilter);
    }
    function Qr(t, n) {
      t.filter = bt(t.filter, n);
    }
    function ei(t, n, o) {
      var u = t.replayFilter;
      t.replayFilter = u ? function() {
        return bt(u(), n());
      } : n, t.justLimit = o && !u;
    }
    function er(t, n) {
      if (t.isPrimKey) return n.primaryKey;
      var o = n.getIndexByKeyPath(t.index);
      if (!o) throw new K.Schema("KeyPath " + t.index + " on object store " + n.name + " is not indexed");
      return o;
    }
    function bs(t, n, o) {
      var u = er(t, n.schema);
      return n.openCursor({ trans: o, values: !t.keysOnly, reverse: t.dir === "prev", unique: !!t.unique, query: { index: u, range: t.range } });
    }
    function tr(t, n, o, u) {
      var l = t.replayFilter ? bt(t.filter, t.replayFilter()) : t.filter;
      if (t.or) {
        var f = {}, d = function(p, v, w) {
          var S, y;
          l && !l(v, w, function(O) {
            return v.stop(O);
          }, function(O) {
            return v.fail(O);
          }) || ((y = "" + (S = v.primaryKey)) == "[object ArrayBuffer]" && (y = "" + new Uint8Array(S)), M(f, y) || (f[y] = !0, n(p, v, w)));
        };
        return Promise.all([t.or._iterate(d, o), ws(bs(t, u, o), t.algorithm, d, !t.keysOnly && t.valueMapper)]);
      }
      return ws(bs(t, u, o), bt(t.algorithm, l), n, !t.keysOnly && t.valueMapper);
    }
    function ws(t, n, o, u) {
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
    var Ke = Symbol(), yn = (ks.prototype.execute = function(t) {
      if (this.add !== void 0) {
        var n = this.add;
        if (m(n)) return a(a([], m(t) ? t : [], !0), n).sort();
        if (typeof n == "number") return (Number(t) || 0) + n;
        if (typeof n == "bigint") try {
          return BigInt(t) + n;
        } catch {
          return BigInt(0) + n;
        }
        throw new TypeError("Invalid term ".concat(n));
      }
      if (this.remove !== void 0) {
        var o = this.remove;
        if (m(o)) return m(t) ? t.filter(function(u) {
          return !o.includes(u);
        }).sort() : [];
        if (typeof o == "number") return Number(t) - o;
        if (typeof o == "bigint") try {
          return BigInt(t) - o;
        } catch {
          return BigInt(0) - o;
        }
        throw new TypeError("Invalid subtrahend ".concat(o));
      }
      return n = (n = this.replacePrefix) === null || n === void 0 ? void 0 : n[0], n && typeof t == "string" && t.startsWith(n) ? this.replacePrefix[1] + t.substring(n.length) : t;
    }, ks);
    function ks(t) {
      Object.assign(this, t);
    }
    var Qa = (te.prototype._read = function(t, n) {
      var o = this._ctx;
      return o.error ? o.table._trans(null, le.bind(null, o.error)) : o.table._trans("readonly", t).then(n);
    }, te.prototype._write = function(t) {
      var n = this._ctx;
      return n.error ? n.table._trans(null, le.bind(null, n.error)) : n.table._trans("readwrite", t, "locked");
    }, te.prototype._addAlgorithm = function(t) {
      var n = this._ctx;
      n.algorithm = bt(n.algorithm, t);
    }, te.prototype._iterate = function(t, n) {
      return tr(this._ctx, t, n, this._ctx.table.core);
    }, te.prototype.clone = function(t) {
      var n = Object.create(this.constructor.prototype), o = Object.create(this._ctx);
      return t && g(o, t), n._ctx = o, n;
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
        if (Vt(u, !0)) return l.count({ trans: o, query: { index: er(u, l.schema), range: u.range } }).then(function(d) {
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
      function f(v, w) {
        return w ? f(v[o[w]], w - 1) : v[u];
      }
      var d = this._ctx.dir === "next" ? 1 : -1;
      function p(v, w) {
        return X(f(v, l), f(w, l)) * d;
      }
      return this.toArray(function(v) {
        return v.sort(p);
      }).then(n);
    }, te.prototype.toArray = function(t) {
      var n = this;
      return this._read(function(o) {
        var u = n._ctx;
        if (u.dir === "next" && Vt(u, !0) && 0 < u.limit) {
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
      return t <= 0 || (n.offset += t, Vt(n) ? ei(n, function() {
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
      }), (n = this._ctx).isMatch = bt(n.isMatch, t), this;
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
      if (n.dir === "next" && Vt(n, !0) && 0 < n.limit) return this._read(function(u) {
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
        var u = l.primaryKey.toString(), l = M(n, u);
        return n[u] = !0, !l;
      }), this;
    }, te.prototype.modify = function(t) {
      var n = this, o = this._ctx;
      return this._write(function(u) {
        var l, f, d;
        d = typeof t == "function" ? t : (l = h(t), f = l.length, function(k) {
          for (var x = !1, E = 0; E < f; ++E) {
            var I = l[E], C = t[I], D = $e(k, I);
            C instanceof yn ? (ke(k, I, C.execute(D)), x = !0) : D !== C && (ke(k, I, C), x = !0);
          }
          return x;
        });
        var p = o.table.core, y = p.schema.primaryKey, v = y.outbound, w = y.extractKey, S = 200, y = n.db._options.modifyChunkSize;
        y && (S = typeof y == "object" ? y[p.name] || y["*"] || 200 : y);
        function O(k, I) {
          var E = I.failures, I = I.numFailures;
          _ += k - I;
          for (var C = 0, D = h(E); C < D.length; C++) {
            var F = D[C];
            b.push(E[F]);
          }
        }
        var b = [], _ = 0, T = [];
        return n.clone().primaryKeys().then(function(k) {
          function x(I) {
            var C = Math.min(S, k.length - I);
            return p.getMany({ trans: u, keys: k.slice(I, I + C), cache: "immutable" }).then(function(D) {
              for (var F = [], $ = [], N = v ? [] : null, R = [], P = 0; P < C; ++P) {
                var U = D[P], Y = { value: ft(U), primKey: k[I + P] };
                d.call(Y, Y.value, Y) !== !1 && (Y.value == null ? R.push(k[I + P]) : v || X(w(U), w(Y.value)) === 0 ? ($.push(Y.value), v && N.push(k[I + P])) : (R.push(k[I + P]), F.push(Y.value)));
              }
              return Promise.resolve(0 < F.length && p.mutate({ trans: u, type: "add", values: F }).then(function(G) {
                for (var J in G.failures) R.splice(parseInt(J), 1);
                O(F.length, G);
              })).then(function() {
                return (0 < $.length || E && typeof t == "object") && p.mutate({ trans: u, type: "put", keys: N, values: $, criteria: E, changeSpec: typeof t != "function" && t, isAdditionalChunk: 0 < I }).then(function(G) {
                  return O($.length, G);
                });
              }).then(function() {
                return (0 < R.length || E && t === ti) && p.mutate({ trans: u, type: "delete", keys: R, criteria: E, isAdditionalChunk: 0 < I }).then(function(G) {
                  return O(R.length, G);
                });
              }).then(function() {
                return k.length > I + C && x(I + S);
              });
            });
          }
          var E = Vt(o) && o.limit === 1 / 0 && (typeof t != "function" || t === ti) && { index: o.index, range: o.range };
          return x(0).then(function() {
            if (0 < b.length) throw new jn("Error modifying one or more objects", b, _, T);
            return k.length;
          });
        });
      });
    }, te.prototype.delete = function() {
      var t = this._ctx, n = t.range;
      return Vt(t) && (t.isPrimKey || n.type === 3) ? this._write(function(o) {
        var u = t.table.core.schema.primaryKey, l = n;
        return t.table.core.count({ trans: o, query: { index: u, range: l } }).then(function(f) {
          return t.table.core.mutate({ trans: o, type: "deleteRange", range: l }).then(function(d) {
            var p = d.failures;
            if (d.lastResult, d.results, d = d.numFailures, d) throw new jn("Could not delete some values", Object.keys(p).map(function(v) {
              return p[v];
            }), f - d);
            return f - d;
          });
        });
      }) : this.modify(ti);
    }, te);
    function te() {
    }
    var ti = function(t, n) {
      return n.value = null;
    };
    function eu(t, n) {
      return t < n ? -1 : t === n ? 0 : 1;
    }
    function tu(t, n) {
      return n < t ? -1 : t === n ? 0 : 1;
    }
    function Te(t, n, o) {
      return t = t instanceof Ss ? new t.Collection(t) : t, t._ctx.error = new (o || TypeError)(n), t;
    }
    function qt(t) {
      return new t.Collection(t, function() {
        return _s("");
      }).limit(0);
    }
    function nr(t, n, o, u) {
      var l, f, d, p, v, w, S, y = o.length;
      if (!o.every(function(_) {
        return typeof _ == "string";
      })) return Te(t, ds);
      function O(_) {
        l = _ === "next" ? function(k) {
          return k.toUpperCase();
        } : function(k) {
          return k.toLowerCase();
        }, f = _ === "next" ? function(k) {
          return k.toLowerCase();
        } : function(k) {
          return k.toUpperCase();
        }, d = _ === "next" ? eu : tu;
        var T = o.map(function(k) {
          return { lower: f(k), upper: l(k) };
        }).sort(function(k, x) {
          return d(k.lower, x.lower);
        });
        p = T.map(function(k) {
          return k.upper;
        }), v = T.map(function(k) {
          return k.lower;
        }), S = (w = _) === "next" ? "" : u;
      }
      O("next"), t = new t.Collection(t, function() {
        return Xe(p[0], v[y - 1] + u);
      }), t._ondirectionchange = function(_) {
        O(_);
      };
      var b = 0;
      return t._addAlgorithm(function(_, T, k) {
        var x = _.key;
        if (typeof x != "string") return !1;
        var E = f(x);
        if (n(E, v, b)) return !0;
        for (var I = null, C = b; C < y; ++C) {
          var D = function(F, $, N, R, P, U) {
            for (var Y = Math.min(F.length, R.length), G = -1, J = 0; J < Y; ++J) {
              var Oe = $[J];
              if (Oe !== R[J]) return P(F[J], N[J]) < 0 ? F.substr(0, J) + N[J] + N.substr(J + 1) : P(F[J], R[J]) < 0 ? F.substr(0, J) + R[J] + N.substr(J + 1) : 0 <= G ? F.substr(0, G) + $[G] + N.substr(G + 1) : null;
              P(F[J], Oe) < 0 && (G = J);
            }
            return Y < R.length && U === "next" ? F + N.substr(F.length) : Y < F.length && U === "prev" ? F.substr(0, N.length) : G < 0 ? null : F.substr(0, G) + R[G] + N.substr(G + 1);
          }(x, E, p[C], v[C], d, w);
          D === null && I === null ? b = C + 1 : (I === null || 0 < d(I, D)) && (I = D);
        }
        return T(I !== null ? function() {
          _.continue(I + S);
        } : k), !1;
      }), t;
    }
    function Xe(t, n, o, u) {
      return { type: 2, lower: t, upper: n, lowerOpen: o, upperOpen: u };
    }
    function _s(t) {
      return { type: 1, lower: t, upper: t };
    }
    var Ss = (Object.defineProperty(me.prototype, "Collection", { get: function() {
      return this._ctx.table.db.Collection;
    }, enumerable: !1, configurable: !0 }), me.prototype.between = function(t, n, o, u) {
      o = o !== !1, u = u === !0;
      try {
        return 0 < this._cmp(t, n) || this._cmp(t, n) === 0 && (o || u) && (!o || !u) ? qt(this) : new this.Collection(this, function() {
          return Xe(t, n, !o, !u);
        });
      } catch {
        return Te(this, We);
      }
    }, me.prototype.equals = function(t) {
      return t == null ? Te(this, We) : new this.Collection(this, function() {
        return _s(t);
      });
    }, me.prototype.above = function(t) {
      return t == null ? Te(this, We) : new this.Collection(this, function() {
        return Xe(t, void 0, !0);
      });
    }, me.prototype.aboveOrEqual = function(t) {
      return t == null ? Te(this, We) : new this.Collection(this, function() {
        return Xe(t, void 0, !1);
      });
    }, me.prototype.below = function(t) {
      return t == null ? Te(this, We) : new this.Collection(this, function() {
        return Xe(void 0, t, !1, !0);
      });
    }, me.prototype.belowOrEqual = function(t) {
      return t == null ? Te(this, We) : new this.Collection(this, function() {
        return Xe(void 0, t);
      });
    }, me.prototype.startsWith = function(t) {
      return typeof t != "string" ? Te(this, ds) : this.between(t, t + vt, !0, !0);
    }, me.prototype.startsWithIgnoreCase = function(t) {
      return t === "" ? this.startsWith(t) : nr(this, function(n, o) {
        return n.indexOf(o[0]) === 0;
      }, [t], vt);
    }, me.prototype.equalsIgnoreCase = function(t) {
      return nr(this, function(n, o) {
        return n === o[0];
      }, [t], "");
    }, me.prototype.anyOfIgnoreCase = function() {
      var t = je.apply(Dt, arguments);
      return t.length === 0 ? qt(this) : nr(this, function(n, o) {
        return o.indexOf(n) !== -1;
      }, t, "");
    }, me.prototype.startsWithAnyOfIgnoreCase = function() {
      var t = je.apply(Dt, arguments);
      return t.length === 0 ? qt(this) : nr(this, function(n, o) {
        return o.some(function(u) {
          return n.indexOf(u) === 0;
        });
      }, t, vt);
    }, me.prototype.anyOf = function() {
      var t = this, n = je.apply(Dt, arguments), o = this._cmp;
      try {
        n.sort(o);
      } catch {
        return Te(this, We);
      }
      if (n.length === 0) return qt(this);
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
    }, me.prototype.notEqual = function(t) {
      return this.inAnyRange([[-1 / 0, t], [t, this.db._maxKey]], { includeLowers: !1, includeUppers: !1 });
    }, me.prototype.noneOf = function() {
      var t = je.apply(Dt, arguments);
      if (t.length === 0) return new this.Collection(this);
      try {
        t.sort(this._ascending);
      } catch {
        return Te(this, We);
      }
      var n = t.reduce(function(o, u) {
        return o ? o.concat([[o[o.length - 1][1], u]]) : [[-1 / 0, u]];
      }, null);
      return n.push([t[t.length - 1], this.db._maxKey]), this.inAnyRange(n, { includeLowers: !1, includeUppers: !1 });
    }, me.prototype.inAnyRange = function(x, n) {
      var o = this, u = this._cmp, l = this._ascending, f = this._descending, d = this._min, p = this._max;
      if (x.length === 0) return qt(this);
      if (!x.every(function(E) {
        return E[0] !== void 0 && E[1] !== void 0 && l(E[0], E[1]) <= 0;
      })) return Te(this, "First argument to inAnyRange() must be an Array of two-value Arrays [lower,upper] where upper must not be lower than lower", K.InvalidArgument);
      var v = !n || n.includeLowers !== !1, w = n && n.includeUppers === !0, S, y = l;
      function O(E, I) {
        return y(E[0], I[0]);
      }
      try {
        (S = x.reduce(function(E, I) {
          for (var C = 0, D = E.length; C < D; ++C) {
            var F = E[C];
            if (u(I[0], F[1]) < 0 && 0 < u(I[1], F[0])) {
              F[0] = d(F[0], I[0]), F[1] = p(F[1], I[1]);
              break;
            }
          }
          return C === D && E.push(I), E;
        }, [])).sort(O);
      } catch {
        return Te(this, We);
      }
      var b = 0, _ = w ? function(E) {
        return 0 < l(E, S[b][1]);
      } : function(E) {
        return 0 <= l(E, S[b][1]);
      }, T = v ? function(E) {
        return 0 < f(E, S[b][0]);
      } : function(E) {
        return 0 <= f(E, S[b][0]);
      }, k = _, x = new this.Collection(this, function() {
        return Xe(S[0][0], S[S.length - 1][1], !v, !w);
      });
      return x._ondirectionchange = function(E) {
        y = E === "next" ? (k = _, l) : (k = T, f), S.sort(O);
      }, x._addAlgorithm(function(E, I, C) {
        for (var D, F = E.key; k(F); ) if (++b === S.length) return I(C), !1;
        return !_(D = F) && !T(D) || (o._cmp(F, S[b][1]) === 0 || o._cmp(F, S[b][0]) === 0 || I(function() {
          y === l ? E.continue(S[b][0]) : E.continue(S[b][1]);
        }), !1);
      }), x;
    }, me.prototype.startsWithAnyOf = function() {
      var t = je.apply(Dt, arguments);
      return t.every(function(n) {
        return typeof n == "string";
      }) ? t.length === 0 ? qt(this) : this.inAnyRange(t.map(function(n) {
        return [n, n + vt];
      })) : Te(this, "startsWithAnyOf() only works with strings");
    }, me);
    function me() {
    }
    function qe(t) {
      return oe(function(n) {
        return gn(n), t(n.target.error), !1;
      });
    }
    function gn(t) {
      t.stopPropagation && t.stopPropagation(), t.preventDefault && t.preventDefault();
    }
    var vn = "storagemutated", ni = "x-storagemutated-1", Qe = mn(null, vn), nu = (Le.prototype._lock = function() {
      return lt(!j.global), ++this._reculock, this._reculock !== 1 || j.global || (j.lockOwnerFor = this), this;
    }, Le.prototype._unlock = function() {
      if (lt(!j.global), --this._reculock == 0) for (j.global || (j.lockOwnerFor = null); 0 < this._blockedFuncs.length && !this._locked(); ) {
        var t = this._blockedFuncs.shift();
        try {
          gt(t[1], t[0]);
        } catch {
        }
      }
      return this;
    }, Le.prototype._locked = function() {
      return this._reculock && j.lockOwnerFor !== this;
    }, Le.prototype.create = function(t) {
      var n = this;
      if (!this.mode) return this;
      var o = this.db.idbdb, u = this.db._state.dbOpenError;
      if (lt(!this.idbtrans), !t && !o) switch (u && u.name) {
        case "DatabaseClosedError":
          throw new K.DatabaseClosed(u);
        case "MissingAPIError":
          throw new K.MissingAPI(u.message, u);
        default:
          throw new K.OpenFailed(u);
      }
      if (!this.active) throw new K.TransactionInactive();
      return lt(this._completion._state === null), (t = this.idbtrans = t || (this.db.core || o).transaction(this.storeNames, this.mode, { durability: this.chromeTransactionDurability })).onerror = oe(function(l) {
        gn(l), n._reject(t.error);
      }), t.onabort = oe(function(l) {
        gn(l), n.active && n._reject(new K.Abort(t.error)), n.active = !1, n.on("abort").fire(l);
      }), t.oncomplete = oe(function() {
        n.active = !1, n._resolve(), "mutatedParts" in t && Qe.storagemutated.fire(t.mutatedParts);
      }), this;
    }, Le.prototype._promise = function(t, n, o) {
      var u = this;
      if (t === "readwrite" && this.mode !== "readwrite") return le(new K.ReadOnly("Transaction is readonly"));
      if (!this.active) return le(new K.TransactionInactive());
      if (this._locked()) return new q(function(f, d) {
        u._blockedFuncs.push([function() {
          u._promise(t, n, o).then(f, d);
        }, j]);
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
    }, Le.prototype._root = function() {
      return this.parent ? this.parent._root() : this;
    }, Le.prototype.waitFor = function(t) {
      var n, o = this._root(), u = q.resolve(t);
      o._waitingFor ? o._waitingFor = o._waitingFor.then(function() {
        return u;
      }) : (o._waitingFor = u, o._waitingQueue = [], n = o.idbtrans.objectStore(o.storeNames[0]), function f() {
        for (++o._spinCount; o._waitingQueue.length; ) o._waitingQueue.shift()();
        o._waitingFor && (n.get(-1 / 0).onsuccess = f);
      }());
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
    }, Le.prototype.abort = function() {
      this.active && (this.active = !1, this.idbtrans && this.idbtrans.abort(), this._reject(new K.Abort()));
    }, Le.prototype.table = function(t) {
      var n = this._memoizedTables || (this._memoizedTables = {});
      if (M(n, t)) return n[t];
      var o = this.schema[t];
      if (!o) throw new K.NotFound("Table " + t + " not part of transaction");
      return o = new this.db.Table(t, o, this), o.core = this.db.core.table(t), n[t] = o;
    }, Le);
    function Le() {
    }
    function ri(t, n, o, u, l, f, d) {
      return { name: t, keyPath: n, unique: o, multi: u, auto: l, compound: f, src: (o && !d ? "&" : "") + (u ? "*" : "") + (l ? "++" : "") + Ts(n) };
    }
    function Ts(t) {
      return typeof t == "string" ? t : t ? "[" + [].join.call(t, "+") + "]" : "";
    }
    function ii(t, n, o) {
      return { name: t, primKey: n, indexes: o, mappedClass: null, idxByName: (u = function(l) {
        return [l.name, l];
      }, o.reduce(function(l, f, d) {
        return d = u(f, d), d && (l[d[0]] = d[1]), l;
      }, {})) };
      var u;
    }
    var bn = function(t) {
      try {
        return t.only([[]]), bn = function() {
          return [[]];
        }, [[]];
      } catch {
        return bn = function() {
          return vt;
        }, vt;
      }
    };
    function si(t) {
      return t == null ? function() {
      } : typeof t == "string" ? (n = t).split(".").length === 1 ? function(o) {
        return o[n];
      } : function(o) {
        return $e(o, n);
      } : function(o) {
        return $e(o, t);
      };
      var n;
    }
    function Os(t) {
      return [].slice.call(t);
    }
    var ru = 0;
    function wn(t) {
      return t == null ? ":id" : typeof t == "string" ? t : "[".concat(t.join("+"), "]");
    }
    function iu(t, n, v) {
      function u(k) {
        if (k.type === 3) return null;
        if (k.type === 4) throw new Error("Cannot convert never type to IDBKeyRange");
        var b = k.lower, _ = k.upper, T = k.lowerOpen, k = k.upperOpen;
        return b === void 0 ? _ === void 0 ? null : n.upperBound(_, !!k) : _ === void 0 ? n.lowerBound(b, !!T) : n.bound(b, _, !!T, !!k);
      }
      function l(O) {
        var b, _ = O.name;
        return { name: _, schema: O, mutate: function(T) {
          var k = T.trans, x = T.type, E = T.keys, I = T.values, C = T.range;
          return new Promise(function(D, F) {
            D = oe(D);
            var $ = k.objectStore(_), N = $.keyPath == null, R = x === "put" || x === "add";
            if (!R && x !== "delete" && x !== "deleteRange") throw new Error("Invalid operation type: " + x);
            var P, U = (E || I || { length: 1 }).length;
            if (E && I && E.length !== I.length) throw new Error("Given keys array must have same length as given values array.");
            if (U === 0) return D({ numFailures: 0, failures: {}, results: [], lastResult: void 0 });
            function Y(_e) {
              ++Oe, gn(_e);
            }
            var G = [], J = [], Oe = 0;
            if (x === "deleteRange") {
              if (C.type === 4) return D({ numFailures: Oe, failures: J, results: [], lastResult: void 0 });
              C.type === 3 ? G.push(P = $.clear()) : G.push(P = $.delete(u(C)));
            } else {
              var N = R ? N ? [I, E] : [I, null] : [E, null], H = N[0], ye = N[1];
              if (R) for (var ge = 0; ge < U; ++ge) G.push(P = ye && ye[ge] !== void 0 ? $[x](H[ge], ye[ge]) : $[x](H[ge])), P.onerror = Y;
              else for (ge = 0; ge < U; ++ge) G.push(P = $[x](H[ge])), P.onerror = Y;
            }
            function pr(_e) {
              _e = _e.target.result, G.forEach(function(_t, Si) {
                return _t.error != null && (J[Si] = _t.error);
              }), D({ numFailures: Oe, failures: J, results: x === "delete" ? E : G.map(function(_t) {
                return _t.result;
              }), lastResult: _e });
            }
            P.onerror = function(_e) {
              Y(_e), pr(_e);
            }, P.onsuccess = pr;
          });
        }, getMany: function(T) {
          var k = T.trans, x = T.keys;
          return new Promise(function(E, I) {
            E = oe(E);
            for (var C, D = k.objectStore(_), F = x.length, $ = new Array(F), N = 0, R = 0, P = function(G) {
              G = G.target, $[G._pos] = G.result, ++R === N && E($);
            }, U = qe(I), Y = 0; Y < F; ++Y) x[Y] != null && ((C = D.get(x[Y]))._pos = Y, C.onsuccess = P, C.onerror = U, ++N);
            N === 0 && E($);
          });
        }, get: function(T) {
          var k = T.trans, x = T.key;
          return new Promise(function(E, I) {
            E = oe(E);
            var C = k.objectStore(_).get(x);
            C.onsuccess = function(D) {
              return E(D.target.result);
            }, C.onerror = qe(I);
          });
        }, query: (b = w, function(T) {
          return new Promise(function(k, x) {
            k = oe(k);
            var E, I, C, N = T.trans, D = T.values, F = T.limit, P = T.query, $ = F === 1 / 0 ? void 0 : F, R = P.index, P = P.range, N = N.objectStore(_), R = R.isPrimaryKey ? N : N.index(R.name), P = u(P);
            if (F === 0) return k({ result: [] });
            b ? (($ = D ? R.getAll(P, $) : R.getAllKeys(P, $)).onsuccess = function(U) {
              return k({ result: U.target.result });
            }, $.onerror = qe(x)) : (E = 0, I = !D && "openKeyCursor" in R ? R.openKeyCursor(P) : R.openCursor(P), C = [], I.onsuccess = function(U) {
              var Y = I.result;
              return Y ? (C.push(D ? Y.value : Y.primaryKey), ++E === F ? k({ result: C }) : void Y.continue()) : k({ result: C });
            }, I.onerror = qe(x));
          });
        }), openCursor: function(T) {
          var k = T.trans, x = T.values, E = T.query, I = T.reverse, C = T.unique;
          return new Promise(function(D, F) {
            D = oe(D);
            var R = E.index, $ = E.range, N = k.objectStore(_), N = R.isPrimaryKey ? N : N.index(R.name), R = I ? C ? "prevunique" : "prev" : C ? "nextunique" : "next", P = !x && "openKeyCursor" in N ? N.openKeyCursor(u($), R) : N.openCursor(u($), R);
            P.onerror = qe(F), P.onsuccess = oe(function(U) {
              var Y, G, J, Oe, H = P.result;
              H ? (H.___id = ++ru, H.done = !1, Y = H.continue.bind(H), G = (G = H.continuePrimaryKey) && G.bind(H), J = H.advance.bind(H), Oe = function() {
                throw new Error("Cursor not stopped");
              }, H.trans = k, H.stop = H.continue = H.continuePrimaryKey = H.advance = function() {
                throw new Error("Cursor not started");
              }, H.fail = oe(F), H.next = function() {
                var ye = this, ge = 1;
                return this.start(function() {
                  return ge-- ? ye.continue() : ye.stop();
                }).then(function() {
                  return ye;
                });
              }, H.start = function(ye) {
                function ge() {
                  if (P.result) try {
                    ye();
                  } catch (_e) {
                    H.fail(_e);
                  }
                  else H.done = !0, H.start = function() {
                    throw new Error("Cursor behind last entry");
                  }, H.stop();
                }
                var pr = new Promise(function(_e, _t) {
                  _e = oe(_e), P.onerror = qe(_t), H.fail = _t, H.stop = function(Si) {
                    H.stop = H.continue = H.continuePrimaryKey = H.advance = Oe, _e(Si);
                  };
                });
                return P.onsuccess = oe(function(_e) {
                  P.onsuccess = ge, ge();
                }), H.continue = Y, H.continuePrimaryKey = G, H.advance = J, ge(), pr;
              }, D(H)) : D(null);
            }, F);
          });
        }, count: function(T) {
          var k = T.query, x = T.trans, E = k.index, I = k.range;
          return new Promise(function(C, D) {
            var F = x.objectStore(_), $ = E.isPrimaryKey ? F : F.index(E.name), F = u(I), $ = F ? $.count(F) : $.count();
            $.onsuccess = oe(function(N) {
              return C(N.target.result);
            }), $.onerror = qe(D);
          });
        } };
      }
      var f, d, p, S = (d = v, p = Os((f = t).objectStoreNames), { schema: { name: f.name, tables: p.map(function(O) {
        return d.objectStore(O);
      }).map(function(O) {
        var b = O.keyPath, k = O.autoIncrement, _ = m(b), T = {}, k = { name: O.name, primaryKey: { name: null, isPrimaryKey: !0, outbound: b == null, compound: _, keyPath: b, autoIncrement: k, unique: !0, extractKey: si(b) }, indexes: Os(O.indexNames).map(function(x) {
          return O.index(x);
        }).map(function(C) {
          var E = C.name, I = C.unique, D = C.multiEntry, C = C.keyPath, D = { name: E, compound: m(C), keyPath: C, unique: I, multiEntry: D, extractKey: si(C) };
          return T[wn(C)] = D;
        }), getIndexByKeyPath: function(x) {
          return T[wn(x)];
        } };
        return T[":id"] = k.primaryKey, b != null && (T[wn(b)] = k.primaryKey), k;
      }) }, hasGetAll: 0 < p.length && "getAll" in d.objectStore(p[0]) && !(typeof navigator < "u" && /Safari/.test(navigator.userAgent) && !/(Chrome\/|Edge\/)/.test(navigator.userAgent) && [].concat(navigator.userAgent.match(/Safari\/(\d*)/))[1] < 604) }), v = S.schema, w = S.hasGetAll, S = v.tables.map(l), y = {};
      return S.forEach(function(O) {
        return y[O.name] = O;
      }), { stack: "dbcore", transaction: t.transaction.bind(t), table: function(O) {
        if (!y[O]) throw new Error("Table '".concat(O, "' not found"));
        return y[O];
      }, MIN_KEY: -1 / 0, MAX_KEY: bn(n), schema: v };
    }
    function su(t, n, o, u) {
      var l = o.IDBKeyRange;
      return o.indexedDB, { dbcore: (u = iu(n, l, u), t.dbcore.reduce(function(f, d) {
        return d = d.create, i(i({}, f), d(f));
      }, u)) };
    }
    function rr(t, u) {
      var o = u.db, u = su(t._middlewares, o, t._deps, u);
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
          var p = function v(w, S) {
            return Ee(w, S) || (w = A(w)) && v(w, S);
          }(d, l);
          (!p || "value" in p && p.value === void 0) && (d === t.Transaction.prototype || d instanceof t.Transaction ? ee(d, l, { get: function() {
            return this.table(l);
          }, set: function(v) {
            W(this, l, { value: v, writable: !0, configurable: !0, enumerable: !0 });
          } }) : d[l] = new t.Table(l, f));
        });
      });
    }
    function oi(t, n) {
      n.forEach(function(o) {
        for (var u in o) o[u] instanceof t.Table && delete o[u];
      });
    }
    function ou(t, n) {
      return t._cfg.version - n._cfg.version;
    }
    function au(t, n, o, u) {
      var l = t._dbSchema;
      o.objectStoreNames.contains("$meta") && !l.$meta && (l.$meta = ii("$meta", Es("")[0], []), t._storeNames.push("$meta"));
      var f = t._createTransaction("readwrite", t._storeNames, l);
      f.create(o), f._completion.catch(u);
      var d = f._reject.bind(f), p = j.transless || j;
      Ye(function() {
        return j.trans = f, j.transless = p, n !== 0 ? (rr(t, o), w = n, ((v = f).storeNames.includes("$meta") ? v.table("$meta").get("version").then(function(S) {
          return S ?? w;
        }) : q.resolve(w)).then(function(S) {
          return O = S, b = f, _ = o, T = [], S = (y = t)._versions, k = y._dbSchema = or(0, y.idbdb, _), (S = S.filter(function(x) {
            return x._cfg.version >= O;
          })).length !== 0 ? (S.forEach(function(x) {
            T.push(function() {
              var E = k, I = x._cfg.dbschema;
              ar(y, E, _), ar(y, I, _), k = y._dbSchema = I;
              var C = ai(E, I);
              C.add.forEach(function(R) {
                ui(_, R[0], R[1].primKey, R[1].indexes);
              }), C.change.forEach(function(R) {
                if (R.recreate) throw new K.Upgrade("Not yet support for changing primary key");
                var P = _.objectStore(R.name);
                R.add.forEach(function(U) {
                  return sr(P, U);
                }), R.change.forEach(function(U) {
                  P.deleteIndex(U.name), sr(P, U);
                }), R.del.forEach(function(U) {
                  return P.deleteIndex(U);
                });
              });
              var D = x._cfg.contentUpgrade;
              if (D && x._cfg.version > O) {
                rr(y, _), b._memoizedTables = {};
                var F = Ln(I);
                C.del.forEach(function(R) {
                  F[R] = E[R];
                }), oi(y, [y.Transaction.prototype]), ir(y, [y.Transaction.prototype], h(F), F), b.schema = F;
                var $, N = Lr(D);
                return N && Ft(), C = q.follow(function() {
                  var R;
                  ($ = D(b)) && N && (R = Ge.bind(null, null), $.then(R, R));
                }), $ && typeof $.then == "function" ? q.resolve($) : C.then(function() {
                  return $;
                });
              }
            }), T.push(function(E) {
              var I, C, D = x._cfg.dbschema;
              I = D, C = E, [].slice.call(C.db.objectStoreNames).forEach(function(F) {
                return I[F] == null && C.db.deleteObjectStore(F);
              }), oi(y, [y.Transaction.prototype]), ir(y, [y.Transaction.prototype], y._storeNames, y._dbSchema), b.schema = y._dbSchema;
            }), T.push(function(E) {
              y.idbdb.objectStoreNames.contains("$meta") && (Math.ceil(y.idbdb.version / 10) === x._cfg.version ? (y.idbdb.deleteObjectStore("$meta"), delete y._dbSchema.$meta, y._storeNames = y._storeNames.filter(function(I) {
                return I !== "$meta";
              })) : E.objectStore("$meta").put(x._cfg.version, "version"));
            });
          }), function x() {
            return T.length ? q.resolve(T.shift()(b.idbtrans)).then(x) : q.resolve();
          }().then(function() {
            xs(k, _);
          })) : q.resolve();
          var y, O, b, _, T, k;
        }).catch(d)) : (h(l).forEach(function(S) {
          ui(o, S, l[S].primKey, l[S].indexes);
        }), rr(t, o), void q.follow(function() {
          return t.on.populate.fire(f);
        }).catch(d));
        var v, w;
      });
    }
    function uu(t, n) {
      xs(t._dbSchema, n), n.db.version % 10 != 0 || n.objectStoreNames.contains("$meta") || n.db.createObjectStore("$meta").add(Math.ceil(n.db.version / 10 - 1), "version");
      var o = or(0, t.idbdb, n);
      ar(t, t._dbSchema, n);
      for (var u = 0, l = ai(o, t._dbSchema).change; u < l.length; u++) {
        var f = function(d) {
          if (d.change.length || d.recreate) return console.warn("Unable to patch indexes of table ".concat(d.name, " because it has changes on the type of index or primary key.")), { value: void 0 };
          var p = n.objectStore(d.name);
          d.add.forEach(function(v) {
            Ve && console.debug("Dexie upgrade patch: Creating missing index ".concat(d.name, ".").concat(v.src)), sr(p, v);
          });
        }(l[u]);
        if (typeof f == "object") return f.value;
      }
    }
    function ai(t, n) {
      var o, u = { del: [], add: [], change: [] };
      for (o in t) n[o] || u.del.push(o);
      for (o in n) {
        var l = t[o], f = n[o];
        if (l) {
          var d = { name: o, def: f, recreate: !1, del: [], add: [], change: [] };
          if ("" + (l.primKey.keyPath || "") != "" + (f.primKey.keyPath || "") || l.primKey.auto !== f.primKey.auto) d.recreate = !0, u.change.push(d);
          else {
            var p = l.idxByName, v = f.idxByName, w = void 0;
            for (w in p) v[w] || d.del.push(w);
            for (w in v) {
              var S = p[w], y = v[w];
              S ? S.src !== y.src && d.change.push(y) : d.add.push(y);
            }
            (0 < d.del.length || 0 < d.add.length || 0 < d.change.length) && u.change.push(d);
          }
        } else u.add.push([o, f]);
      }
      return u;
    }
    function ui(t, n, o, u) {
      var l = t.db.createObjectStore(n, o.keyPath ? { keyPath: o.keyPath, autoIncrement: o.auto } : { autoIncrement: o.auto });
      return u.forEach(function(f) {
        return sr(l, f);
      }), l;
    }
    function xs(t, n) {
      h(t).forEach(function(o) {
        n.db.objectStoreNames.contains(o) || (Ve && console.debug("Dexie: Creating missing table", o), ui(n, o, t[o].primKey, t[o].indexes));
      });
    }
    function sr(t, n) {
      t.createIndex(n.name, n.keyPath, { unique: n.unique, multiEntry: n.multi });
    }
    function or(t, n, o) {
      var u = {};
      return Re(n.objectStoreNames, 0).forEach(function(l) {
        for (var f = o.objectStore(l), d = ri(Ts(w = f.keyPath), w || "", !0, !1, !!f.autoIncrement, w && typeof w != "string", !0), p = [], v = 0; v < f.indexNames.length; ++v) {
          var S = f.index(f.indexNames[v]), w = S.keyPath, S = ri(S.name, w, !!S.unique, !!S.multiEntry, !1, w && typeof w != "string", !1);
          p.push(S);
        }
        u[l] = ii(l, d, p);
      }), u;
    }
    function ar(t, n, o) {
      for (var u = o.db.objectStoreNames, l = 0; l < u.length; ++l) {
        var f = u[l], d = o.objectStore(f);
        t._hasGetAll = "getAll" in d;
        for (var p = 0; p < d.indexNames.length; ++p) {
          var v = d.indexNames[p], w = d.index(v).keyPath, S = typeof w == "string" ? w : "[" + Re(w).join("+") + "]";
          !n[f] || (w = n[f].idxByName[S]) && (w.name = v, delete n[f].idxByName[S], n[f].idxByName[v] = w);
        }
      }
      typeof navigator < "u" && /Safari/.test(navigator.userAgent) && !/(Chrome\/|Edge\/)/.test(navigator.userAgent) && c.WorkerGlobalScope && c instanceof c.WorkerGlobalScope && [].concat(navigator.userAgent.match(/Safari\/(\d*)/))[1] < 604 && (t._hasGetAll = !1);
    }
    function Es(t) {
      return t.split(",").map(function(n, o) {
        var u = (n = n.trim()).replace(/([&*]|\+\+)/g, ""), l = /^\[/.test(u) ? u.match(/^\[(.*)\]$/)[1].split("+") : u;
        return ri(u, l || null, /\&/.test(n), /\*/.test(n), /\+\+/.test(n), m(l), o === 0);
      });
    }
    var lu = (ur.prototype._parseStoresSpec = function(t, n) {
      h(t).forEach(function(o) {
        if (t[o] !== null) {
          var u = Es(t[o]), l = u.shift();
          if (l.unique = !0, l.multi) throw new K.Schema("Primary key cannot be multi-valued");
          u.forEach(function(f) {
            if (f.auto) throw new K.Schema("Only primary key can be marked as autoIncrement (++)");
            if (!f.keyPath) throw new K.Schema("Index must have a name and cannot be an empty string");
          }), n[o] = ii(o, l, u);
        }
      });
    }, ur.prototype.stores = function(o) {
      var n = this.db;
      this._cfg.storesSource = this._cfg.storesSource ? g(this._cfg.storesSource, o) : o;
      var o = n._versions, u = {}, l = {};
      return o.forEach(function(f) {
        g(u, f._cfg.storesSource), l = f._cfg.dbschema = {}, f._parseStoresSpec(u, l);
      }), n._dbSchema = l, oi(n, [n._allTables, n, n.Transaction.prototype]), ir(n, [n._allTables, n, n.Transaction.prototype, this._cfg.tables], h(l), l), n._storeNames = h(l), this;
    }, ur.prototype.upgrade = function(t) {
      return this._cfg.contentUpgrade = jr(this._cfg.contentUpgrade || ie, t), this;
    }, ur);
    function ur() {
    }
    function li(t, n) {
      var o = t._dbNamesDB;
      return o || (o = t._dbNamesDB = new ze(Xn, { addons: [], indexedDB: t, IDBKeyRange: n })).version(1).stores({ dbnames: "name" }), o.table("dbnames");
    }
    function ci(t) {
      return t && typeof t.databases == "function";
    }
    function fi(t) {
      return Ye(function() {
        return j.letThrough = !0, t();
      });
    }
    function hi(t) {
      return !("from" in t);
    }
    var pe = function(t, n) {
      if (!this) {
        var o = new pe();
        return t && "d" in t && g(o, t), o;
      }
      g(this, arguments.length ? { d: 1, from: t, to: 1 < arguments.length ? n : t } : { d: 0 });
    };
    function kn(t, n, o) {
      var u = X(n, o);
      if (!isNaN(u)) {
        if (0 < u) throw RangeError();
        if (hi(t)) return g(t, { from: n, to: o, d: 1 });
        var l = t.l, u = t.r;
        if (X(o, t.from) < 0) return l ? kn(l, n, o) : t.l = { from: n, to: o, d: 1, l: null, r: null }, As(t);
        if (0 < X(n, t.to)) return u ? kn(u, n, o) : t.r = { from: n, to: o, d: 1, l: null, r: null }, As(t);
        X(n, t.from) < 0 && (t.from = n, t.l = null, t.d = u ? u.d + 1 : 1), 0 < X(o, t.to) && (t.to = o, t.r = null, t.d = t.l ? t.l.d + 1 : 1), o = !t.r, l && !t.l && _n(t, l), u && o && _n(t, u);
      }
    }
    function _n(t, n) {
      hi(n) || function o(u, v) {
        var f = v.from, d = v.to, p = v.l, v = v.r;
        kn(u, f, d), p && o(u, p), v && o(u, v);
      }(t, n);
    }
    function Is(t, n) {
      var o = lr(n), u = o.next();
      if (u.done) return !1;
      for (var l = u.value, f = lr(t), d = f.next(l.from), p = d.value; !u.done && !d.done; ) {
        if (X(p.from, l.to) <= 0 && 0 <= X(p.to, l.from)) return !0;
        X(l.from, p.from) < 0 ? l = (u = o.next(p.from)).value : p = (d = f.next(l.from)).value;
      }
      return !1;
    }
    function lr(t) {
      var n = hi(t) ? null : { s: 0, n: t };
      return { next: function(o) {
        for (var u = 0 < arguments.length; n; ) switch (n.s) {
          case 0:
            if (n.s = 1, u) for (; n.n.l && X(o, n.n.from) < 0; ) n = { up: n, n: n.n.l, s: 1 };
            else for (; n.n.l; ) n = { up: n, n: n.n.l, s: 1 };
          case 1:
            if (n.s = 2, !u || X(o, n.n.to) <= 0) return { value: n.n, done: !1 };
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
    function As(t) {
      var n, o, u = (((n = t.r) === null || n === void 0 ? void 0 : n.d) || 0) - (((o = t.l) === null || o === void 0 ? void 0 : o.d) || 0), l = 1 < u ? "r" : u < -1 ? "l" : "";
      l && (n = l == "r" ? "l" : "r", o = i({}, t), u = t[l], t.from = u.from, t.to = u.to, t[l] = u[l], o[l] = u[n], (t[n] = o).d = Cs(o)), t.d = Cs(t);
    }
    function Cs(o) {
      var n = o.r, o = o.l;
      return (n ? o ? Math.max(n.d, o.d) : n.d : o ? o.d : 0) + 1;
    }
    function cr(t, n) {
      return h(n).forEach(function(o) {
        t[o] ? _n(t[o], n[o]) : t[o] = function u(l) {
          var f, d, p = {};
          for (f in l) M(l, f) && (d = l[f], p[f] = !d || typeof d != "object" || Un.has(d.constructor) ? d : u(d));
          return p;
        }(n[o]);
      }), t;
    }
    function di(t, n) {
      return t.all || n.all || Object.keys(t).some(function(o) {
        return n[o] && Is(n[o], t[o]);
      });
    }
    Z(pe.prototype, ((Ie = { add: function(t) {
      return _n(this, t), this;
    }, addKey: function(t) {
      return kn(this, t, t), this;
    }, addKeys: function(t) {
      var n = this;
      return t.forEach(function(o) {
        return kn(n, o, o);
      }), this;
    }, hasKey: function(t) {
      var n = lr(this).next(t).value;
      return n && X(n.from, t) <= 0 && 0 <= X(n.to, t);
    } })[qr] = function() {
      return lr(this);
    }, Ie));
    var wt = {}, mi = {}, pi = !1;
    function fr(t) {
      cr(mi, t), pi || (pi = !0, setTimeout(function() {
        pi = !1, yi(mi, !(mi = {}));
      }, 0));
    }
    function yi(t, n) {
      n === void 0 && (n = !1);
      var o = /* @__PURE__ */ new Set();
      if (t.all) for (var u = 0, l = Object.values(wt); u < l.length; u++) Ds(d = l[u], t, o, n);
      else for (var f in t) {
        var d, p = /^idb\:\/\/(.*)\/(.*)\//.exec(f);
        p && (f = p[1], p = p[2], (d = wt["idb://".concat(f, "/").concat(p)]) && Ds(d, t, o, n));
      }
      o.forEach(function(v) {
        return v();
      });
    }
    function Ds(t, n, o, u) {
      for (var l = [], f = 0, d = Object.entries(t.queries.query); f < d.length; f++) {
        for (var p = d[f], v = p[0], w = [], S = 0, y = p[1]; S < y.length; S++) {
          var O = y[S];
          di(n, O.obsSet) ? O.subscribers.forEach(function(k) {
            return o.add(k);
          }) : u && w.push(O);
        }
        u && l.push([v, w]);
      }
      if (u) for (var b = 0, _ = l; b < _.length; b++) {
        var T = _[b], v = T[0], w = T[1];
        t.queries.query[v] = w;
      }
    }
    function cu(t) {
      var n = t._state, o = t._deps.indexedDB;
      if (n.isBeingOpened || t.idbdb) return n.dbReadyPromise.then(function() {
        return n.dbOpenError ? le(n.dbOpenError) : t;
      });
      n.isBeingOpened = !0, n.dbOpenError = null, n.openComplete = !1;
      var u = n.openCanceller, l = Math.round(10 * t.verno), f = !1;
      function d() {
        if (n.openCanceller !== u) throw new K.DatabaseClosed("db.open() was cancelled");
      }
      function p() {
        return new q(function(O, b) {
          if (d(), !o) throw new K.MissingAPI();
          var _ = t.name, T = n.autoSchema || !l ? o.open(_) : o.open(_, l);
          if (!T) throw new K.MissingAPI();
          T.onerror = qe(b), T.onblocked = oe(t._fireOnBlocked), T.onupgradeneeded = oe(function(k) {
            var x;
            S = T.transaction, n.autoSchema && !t._options.allowEmptyDB ? (T.onerror = gn, S.abort(), T.result.close(), (x = o.deleteDatabase(_)).onsuccess = x.onerror = oe(function() {
              b(new K.NoSuchDatabase("Database ".concat(_, " doesnt exist")));
            })) : (S.onerror = qe(b), k = k.oldVersion > Math.pow(2, 62) ? 0 : k.oldVersion, y = k < 1, t.idbdb = T.result, f && uu(t, S), au(t, k / 10, S, b));
          }, b), T.onsuccess = oe(function() {
            S = null;
            var k, x, E, I, C, D = t.idbdb = T.result, F = Re(D.objectStoreNames);
            if (0 < F.length) try {
              var $ = D.transaction((I = F).length === 1 ? I[0] : I, "readonly");
              if (n.autoSchema) x = D, E = $, (k = t).verno = x.version / 10, E = k._dbSchema = or(0, x, E), k._storeNames = Re(x.objectStoreNames, 0), ir(k, [k._allTables], h(E), E);
              else if (ar(t, t._dbSchema, $), ((C = ai(or(0, (C = t).idbdb, $), C._dbSchema)).add.length || C.change.some(function(N) {
                return N.add.length || N.change.length;
              })) && !f) return console.warn("Dexie SchemaDiff: Schema was extended without increasing the number passed to db.version(). Dexie will add missing parts and increment native version number to workaround this."), D.close(), l = D.version + 1, f = !0, O(p());
              rr(t, $);
            } catch {
            }
            Rt.push(t), D.onversionchange = oe(function(N) {
              n.vcFired = !0, t.on("versionchange").fire(N);
            }), D.onclose = oe(function(N) {
              t.on("close").fire(N);
            }), y && (C = t._deps, $ = _, D = C.indexedDB, C = C.IDBKeyRange, ci(D) || $ === Xn || li(D, C).put({ name: $ }).catch(ie)), O();
          }, b);
        }).catch(function(O) {
          switch (O == null ? void 0 : O.name) {
            case "UnknownError":
              if (0 < n.PR1398_maxLoop) return n.PR1398_maxLoop--, console.warn("Dexie: Workaround for Chrome UnknownError on open()"), p();
              break;
            case "VersionError":
              if (0 < l) return l = 0, p();
          }
          return q.reject(O);
        });
      }
      var v, w = n.dbReadyResolve, S = null, y = !1;
      return q.race([u, (typeof navigator > "u" ? q.resolve() : !navigator.userAgentData && /Safari\//.test(navigator.userAgent) && !/Chrom(e|ium)\//.test(navigator.userAgent) && indexedDB.databases ? new Promise(function(O) {
        function b() {
          return indexedDB.databases().finally(O);
        }
        v = setInterval(b, 100), b();
      }).finally(function() {
        return clearInterval(v);
      }) : Promise.resolve()).then(p)]).then(function() {
        return d(), n.onReadyBeingFired = [], q.resolve(fi(function() {
          return t.on.ready.fire(t.vip);
        })).then(function O() {
          if (0 < n.onReadyBeingFired.length) {
            var b = n.onReadyBeingFired.reduce(jr, ie);
            return n.onReadyBeingFired = [], q.resolve(fi(function() {
              return b(t.vip);
            })).then(O);
          }
        });
      }).finally(function() {
        n.openCanceller === u && (n.onReadyBeingFired = null, n.isBeingOpened = !1);
      }).catch(function(O) {
        n.dbOpenError = O;
        try {
          S && S.abort();
        } catch {
        }
        return u === n.openCanceller && t._close(), le(O);
      }).finally(function() {
        n.openComplete = !0, w();
      }).then(function() {
        var O;
        return y && (O = {}, t.tables.forEach(function(b) {
          b.schema.indexes.forEach(function(_) {
            _.name && (O["idb://".concat(t.name, "/").concat(b.name, "/").concat(_.name)] = new pe(-1 / 0, [[[]]]));
          }), O["idb://".concat(t.name, "/").concat(b.name, "/")] = O["idb://".concat(t.name, "/").concat(b.name, "/:dels")] = new pe(-1 / 0, [[[]]]);
        }), Qe(vn).fire(O), yi(O, !0)), t;
      });
    }
    function gi(t) {
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
    function hr(t, n, o) {
      for (var u = m(t) ? t.slice() : [t], l = 0; l < o; ++l) u.push(n);
      return u;
    }
    var fu = { stack: "dbcore", name: "VirtualIndexMiddleware", level: 1, create: function(t) {
      return i(i({}, t), { table: function(n) {
        var o = t.table(n), u = o.schema, l = {}, f = [];
        function d(y, O, b) {
          var _ = wn(y), T = l[_] = l[_] || [], k = y == null ? 0 : typeof y == "string" ? 1 : y.length, x = 0 < O, x = i(i({}, b), { name: x ? "".concat(_, "(virtual-from:").concat(b.name, ")") : b.name, lowLevelIndex: b, isVirtual: x, keyTail: O, keyLength: k, extractKey: si(y), unique: !x && b.unique });
          return T.push(x), x.isPrimaryKey || f.push(x), 1 < k && d(k === 2 ? y[0] : y.slice(0, k - 1), O + 1, b), T.sort(function(E, I) {
            return E.keyTail - I.keyTail;
          }), x;
        }
        n = d(u.primaryKey.keyPath, 0, u.primaryKey), l[":id"] = [n];
        for (var p = 0, v = u.indexes; p < v.length; p++) {
          var w = v[p];
          d(w.keyPath, 0, w);
        }
        function S(y) {
          var O, b = y.query.index;
          return b.isVirtual ? i(i({}, y), { query: { index: b.lowLevelIndex, range: (O = y.query.range, b = b.keyTail, { type: O.type === 1 ? 2 : O.type, lower: hr(O.lower, O.lowerOpen ? t.MAX_KEY : t.MIN_KEY, b), lowerOpen: !0, upper: hr(O.upper, O.upperOpen ? t.MIN_KEY : t.MAX_KEY, b), upperOpen: !0 }) } }) : y;
        }
        return i(i({}, o), { schema: i(i({}, u), { primaryKey: n, indexes: f, getIndexByKeyPath: function(y) {
          return (y = l[wn(y)]) && y[0];
        } }), count: function(y) {
          return o.count(S(y));
        }, query: function(y) {
          return o.query(S(y));
        }, openCursor: function(y) {
          var O = y.query.index, b = O.keyTail, _ = O.isVirtual, T = O.keyLength;
          return _ ? o.openCursor(S(y)).then(function(x) {
            return x && k(x);
          }) : o.openCursor(y);
          function k(x) {
            return Object.create(x, { continue: { value: function(E) {
              E != null ? x.continue(hr(E, y.reverse ? t.MAX_KEY : t.MIN_KEY, b)) : y.unique ? x.continue(x.key.slice(0, T).concat(y.reverse ? t.MIN_KEY : t.MAX_KEY, b)) : x.continue();
            } }, continuePrimaryKey: { value: function(E, I) {
              x.continuePrimaryKey(hr(E, t.MAX_KEY, b), I);
            } }, primaryKey: { get: function() {
              return x.primaryKey;
            } }, key: { get: function() {
              var E = x.key;
              return T === 1 ? E[0] : E.slice(0, T);
            } }, value: { get: function() {
              return x.value;
            } } });
          }
        } });
      } });
    } };
    function vi(t, n, o, u) {
      return o = o || {}, u = u || "", h(t).forEach(function(l) {
        var f, d, p;
        M(n, l) ? (f = t[l], d = n[l], typeof f == "object" && typeof d == "object" && f && d ? (p = Vr(f)) !== Vr(d) ? o[u + l] = n[l] : p === "Object" ? vi(f, d, o, u + l + ".") : f !== d && (o[u + l] = n[l]) : f !== d && (o[u + l] = n[l])) : o[u + l] = void 0;
      }), h(n).forEach(function(l) {
        M(t, l) || (o[u + l] = n[l]);
      }), o;
    }
    function bi(t, n) {
      return n.type === "delete" ? n.keys : n.keys || n.values.map(t.extractKey);
    }
    var hu = { stack: "dbcore", name: "HooksMiddleware", level: 2, create: function(t) {
      return i(i({}, t), { table: function(n) {
        var o = t.table(n), u = o.schema.primaryKey;
        return i(i({}, o), { mutate: function(l) {
          var f = j.trans, d = f.table(n).hook, p = d.deleting, v = d.creating, w = d.updating;
          switch (l.type) {
            case "add":
              if (v.fire === ie) break;
              return f._promise("readwrite", function() {
                return S(l);
              }, !0);
            case "put":
              if (v.fire === ie && w.fire === ie) break;
              return f._promise("readwrite", function() {
                return S(l);
              }, !0);
            case "delete":
              if (p.fire === ie) break;
              return f._promise("readwrite", function() {
                return S(l);
              }, !0);
            case "deleteRange":
              if (p.fire === ie) break;
              return f._promise("readwrite", function() {
                return function y(O, b, _) {
                  return o.query({ trans: O, values: !1, query: { index: u, range: b }, limit: _ }).then(function(T) {
                    var k = T.result;
                    return S({ type: "delete", keys: k, trans: O }).then(function(x) {
                      return 0 < x.numFailures ? Promise.reject(x.failures[0]) : k.length < _ ? { failures: [], numFailures: 0, lastResult: void 0 } : y(O, i(i({}, b), { lower: k[k.length - 1], lowerOpen: !0 }), _);
                    });
                  });
                }(l.trans, l.range, 1e4);
              }, !0);
          }
          return o.mutate(l);
          function S(y) {
            var O, b, _, T = j.trans, k = y.keys || bi(u, y);
            if (!k) throw new Error("Keys missing");
            return (y = y.type === "add" || y.type === "put" ? i(i({}, y), { keys: k }) : i({}, y)).type !== "delete" && (y.values = a([], y.values)), y.keys && (y.keys = a([], y.keys)), O = o, _ = k, ((b = y).type === "add" ? Promise.resolve([]) : O.getMany({ trans: b.trans, keys: _, cache: "immutable" })).then(function(x) {
              var E = k.map(function(I, C) {
                var D, F, $, N = x[C], R = { onerror: null, onsuccess: null };
                return y.type === "delete" ? p.fire.call(R, I, N, T) : y.type === "add" || N === void 0 ? (D = v.fire.call(R, I, y.values[C], T), I == null && D != null && (y.keys[C] = I = D, u.outbound || ke(y.values[C], u.keyPath, I))) : (D = vi(N, y.values[C]), (F = w.fire.call(R, D, I, N, T)) && ($ = y.values[C], Object.keys(F).forEach(function(P) {
                  M($, P) ? $[P] = F[P] : ke($, P, F[P]);
                }))), R;
              });
              return o.mutate(y).then(function(I) {
                for (var C = I.failures, D = I.results, F = I.numFailures, I = I.lastResult, $ = 0; $ < k.length; ++$) {
                  var N = (D || k)[$], R = E[$];
                  N == null ? R.onerror && R.onerror(C[$]) : R.onsuccess && R.onsuccess(y.type === "put" && x[$] ? y.values[$] : N);
                }
                return { failures: C, results: D, numFailures: F, lastResult: I };
              }).catch(function(I) {
                return E.forEach(function(C) {
                  return C.onerror && C.onerror(I);
                }), Promise.reject(I);
              });
            });
          }
        } });
      } });
    } };
    function $s(t, n, o) {
      try {
        if (!n || n.keys.length < t.length) return null;
        for (var u = [], l = 0, f = 0; l < n.keys.length && f < t.length; ++l) X(n.keys[l], t[f]) === 0 && (u.push(o ? ft(n.values[l]) : n.values[l]), ++f);
        return u.length === t.length ? u : null;
      } catch {
        return null;
      }
    }
    var du = { stack: "dbcore", level: -1, create: function(t) {
      return { table: function(n) {
        var o = t.table(n);
        return i(i({}, o), { getMany: function(u) {
          if (!u.cache) return o.getMany(u);
          var l = $s(u.keys, u.trans._cache, u.cache === "clone");
          return l ? q.resolve(l) : o.getMany(u).then(function(f) {
            return u.trans._cache = { keys: u.keys, values: u.cache === "clone" ? ft(f) : f }, f;
          });
        }, mutate: function(u) {
          return u.type !== "add" && (u.trans._cache = null), o.mutate(u);
        } });
      } };
    } };
    function Ns(t, n) {
      return t.trans.mode === "readonly" && !!t.subscr && !t.trans.explicit && t.trans.db._options.cache !== "disabled" && !n.schema.primaryKey.outbound;
    }
    function Ms(t, n) {
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
    var mu = { stack: "dbcore", level: 0, name: "Observability", create: function(t) {
      var n = t.schema.name, o = new pe(t.MIN_KEY, t.MAX_KEY);
      return i(i({}, t), { transaction: function(u, l, f) {
        if (j.subscr && l !== "readonly") throw new K.ReadOnly("Readwrite transaction in liveQuery context. Querier source: ".concat(j.querier));
        return t.transaction(u, l, f);
      }, table: function(u) {
        var l = t.table(u), f = l.schema, d = f.primaryKey, y = f.indexes, p = d.extractKey, v = d.outbound, w = d.autoIncrement && y.filter(function(b) {
          return b.compound && b.keyPath.includes(d.keyPath);
        }), S = i(i({}, l), { mutate: function(b) {
          function _(P) {
            return P = "idb://".concat(n, "/").concat(u, "/").concat(P), I[P] || (I[P] = new pe());
          }
          var T, k, x, E = b.trans, I = b.mutatedParts || (b.mutatedParts = {}), C = _(""), D = _(":dels"), F = b.type, R = b.type === "deleteRange" ? [b.range] : b.type === "delete" ? [b.keys] : b.values.length < 50 ? [bi(d, b).filter(function(P) {
            return P;
          }), b.values] : [], $ = R[0], N = R[1], R = b.trans._cache;
          return m($) ? (C.addKeys($), (R = F === "delete" || $.length === N.length ? $s($, R) : null) || D.addKeys($), (R || N) && (T = _, k = R, x = N, f.indexes.forEach(function(P) {
            var U = T(P.name || "");
            function Y(J) {
              return J != null ? P.extractKey(J) : null;
            }
            function G(J) {
              return P.multiEntry && m(J) ? J.forEach(function(Oe) {
                return U.addKey(Oe);
              }) : U.addKey(J);
            }
            (k || x).forEach(function(J, ye) {
              var H = k && Y(k[ye]), ye = x && Y(x[ye]);
              X(H, ye) !== 0 && (H != null && G(H), ye != null && G(ye));
            });
          }))) : $ ? (N = { from: (N = $.lower) !== null && N !== void 0 ? N : t.MIN_KEY, to: (N = $.upper) !== null && N !== void 0 ? N : t.MAX_KEY }, D.add(N), C.add(N)) : (C.add(o), D.add(o), f.indexes.forEach(function(P) {
            return _(P.name).add(o);
          })), l.mutate(b).then(function(P) {
            return !$ || b.type !== "add" && b.type !== "put" || (C.addKeys(P.results), w && w.forEach(function(U) {
              for (var Y = b.values.map(function(H) {
                return U.extractKey(H);
              }), G = U.keyPath.findIndex(function(H) {
                return H === d.keyPath;
              }), J = 0, Oe = P.results.length; J < Oe; ++J) Y[J][G] = P.results[J];
              _(U.name).addKeys(Y);
            })), E.mutatedParts = cr(E.mutatedParts || {}, I), P;
          });
        } }), y = function(_) {
          var T = _.query, _ = T.index, T = T.range;
          return [_, new pe((_ = T.lower) !== null && _ !== void 0 ? _ : t.MIN_KEY, (T = T.upper) !== null && T !== void 0 ? T : t.MAX_KEY)];
        }, O = { get: function(b) {
          return [d, new pe(b.key)];
        }, getMany: function(b) {
          return [d, new pe().addKeys(b.keys)];
        }, count: y, query: y, openCursor: y };
        return h(O).forEach(function(b) {
          S[b] = function(_) {
            var T = j.subscr, k = !!T, x = Ns(j, l) && Ms(b, _) ? _.obsSet = {} : T;
            if (k) {
              var E = function(N) {
                return N = "idb://".concat(n, "/").concat(u, "/").concat(N), x[N] || (x[N] = new pe());
              }, I = E(""), C = E(":dels"), T = O[b](_), k = T[0], T = T[1];
              if ((b === "query" && k.isPrimaryKey && !_.values ? C : E(k.name || "")).add(T), !k.isPrimaryKey) {
                if (b !== "count") {
                  var D = b === "query" && v && _.values && l.query(i(i({}, _), { values: !1 }));
                  return l[b].apply(this, arguments).then(function(N) {
                    if (b === "query") {
                      if (v && _.values) return D.then(function(Y) {
                        return Y = Y.result, I.addKeys(Y), N;
                      });
                      var R = _.values ? N.result.map(p) : N.result;
                      (_.values ? I : C).addKeys(R);
                    } else if (b === "openCursor") {
                      var P = N, U = _.values;
                      return P && Object.create(P, { key: { get: function() {
                        return C.addKey(P.primaryKey), P.key;
                      } }, primaryKey: { get: function() {
                        var Y = P.primaryKey;
                        return C.addKey(Y), Y;
                      } }, value: { get: function() {
                        return U && I.addKey(P.primaryKey), P.value;
                      } } });
                    }
                    return N;
                  });
                }
                C.add(o);
              }
            }
            return l[b].apply(this, arguments);
          };
        }), S;
      } });
    } };
    function Ps(t, n, o) {
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
      return o = t, ((u = n).lower === void 0 || (u.lowerOpen ? 0 < X(o, u.lower) : 0 <= X(o, u.lower))) && (t = t, (n = n).upper === void 0 || (n.upperOpen ? X(t, n.upper) < 0 : X(t, n.upper) <= 0));
      var o, u;
    }
    function Fs(t, n, O, u, l, f) {
      if (!O || O.length === 0) return t;
      var d = n.query.index, p = d.multiEntry, v = n.query.range, w = u.schema.primaryKey.extractKey, S = d.extractKey, y = (d.lowLevelIndex || d).extractKey, O = O.reduce(function(b, _) {
        var T = b, k = [];
        if (_.type === "add" || _.type === "put") for (var x = new pe(), E = _.values.length - 1; 0 <= E; --E) {
          var I, C = _.values[E], D = w(C);
          x.hasKey(D) || (I = S(C), (p && m(I) ? I.some(function(P) {
            return wi(P, v);
          }) : wi(I, v)) && (x.addKey(D), k.push(C)));
        }
        switch (_.type) {
          case "add":
            var F = new pe().addKeys(n.values ? b.map(function(U) {
              return w(U);
            }) : b), T = b.concat(n.values ? k.filter(function(U) {
              return U = w(U), !F.hasKey(U) && (F.addKey(U), !0);
            }) : k.map(function(U) {
              return w(U);
            }).filter(function(U) {
              return !F.hasKey(U) && (F.addKey(U), !0);
            }));
            break;
          case "put":
            var $ = new pe().addKeys(_.values.map(function(U) {
              return w(U);
            }));
            T = b.filter(function(U) {
              return !$.hasKey(n.values ? w(U) : U);
            }).concat(n.values ? k : k.map(function(U) {
              return w(U);
            }));
            break;
          case "delete":
            var N = new pe().addKeys(_.keys);
            T = b.filter(function(U) {
              return !N.hasKey(n.values ? w(U) : U);
            });
            break;
          case "deleteRange":
            var R = _.range;
            T = b.filter(function(U) {
              return !wi(w(U), R);
            });
        }
        return T;
      }, t);
      return O === t ? t : (O.sort(function(b, _) {
        return X(y(b), y(_)) || X(w(b), w(_));
      }), n.limit && n.limit < 1 / 0 && (O.length > n.limit ? O.length = n.limit : t.length === n.limit && O.length < n.limit && (l.dirty = !0)), f ? Object.freeze(O) : O);
    }
    function Rs(t, n) {
      return X(t.lower, n.lower) === 0 && X(t.upper, n.upper) === 0 && !!t.lowerOpen == !!n.lowerOpen && !!t.upperOpen == !!n.upperOpen;
    }
    function pu(t, n) {
      return function(o, u, l, f) {
        if (o === void 0) return u !== void 0 ? -1 : 0;
        if (u === void 0) return 1;
        if ((u = X(o, u)) === 0) {
          if (l && f) return 0;
          if (l) return 1;
          if (f) return -1;
        }
        return u;
      }(t.lower, n.lower, t.lowerOpen, n.lowerOpen) <= 0 && 0 <= function(o, u, l, f) {
        if (o === void 0) return u !== void 0 ? 1 : 0;
        if (u === void 0) return -1;
        if ((u = X(o, u)) === 0) {
          if (l && f) return 0;
          if (l) return -1;
          if (f) return 1;
        }
        return u;
      }(t.upper, n.upper, t.upperOpen, n.upperOpen);
    }
    function yu(t, n, o, u) {
      t.subscribers.add(o), u.addEventListener("abort", function() {
        var l, f;
        t.subscribers.delete(o), t.subscribers.size === 0 && (l = t, f = n, setTimeout(function() {
          l.subscribers.size === 0 && ht(f, l);
        }, 3e3));
      });
    }
    var gu = { stack: "dbcore", level: 0, name: "Cache", create: function(t) {
      var n = t.schema.name;
      return i(i({}, t), { transaction: function(o, u, l) {
        var f, d, p = t.transaction(o, u, l);
        return u === "readwrite" && (d = (f = new AbortController()).signal, l = function(v) {
          return function() {
            if (f.abort(), u === "readwrite") {
              for (var w = /* @__PURE__ */ new Set(), S = 0, y = o; S < y.length; S++) {
                var O = y[S], b = wt["idb://".concat(n, "/").concat(O)];
                if (b) {
                  var _ = t.table(O), T = b.optimisticOps.filter(function(U) {
                    return U.trans === p;
                  });
                  if (p._explicit && v && p.mutatedParts) for (var k = 0, x = Object.values(b.queries.query); k < x.length; k++) for (var E = 0, I = (F = x[k]).slice(); E < I.length; E++) di(($ = I[E]).obsSet, p.mutatedParts) && (ht(F, $), $.subscribers.forEach(function(U) {
                    return w.add(U);
                  }));
                  else if (0 < T.length) {
                    b.optimisticOps = b.optimisticOps.filter(function(U) {
                      return U.trans !== p;
                    });
                    for (var C = 0, D = Object.values(b.queries.query); C < D.length; C++) for (var F, $, N, R = 0, P = (F = D[C]).slice(); R < P.length; R++) ($ = P[R]).res != null && p.mutatedParts && (v && !$.dirty ? (N = Object.isFrozen($.res), N = Fs($.res, $.req, T, _, $, N), $.dirty ? (ht(F, $), $.subscribers.forEach(function(U) {
                      return w.add(U);
                    })) : N !== $.res && ($.res = N, $.promise = q.resolve({ result: N }))) : ($.dirty && ht(F, $), $.subscribers.forEach(function(U) {
                      return w.add(U);
                    })));
                  }
                }
              }
              w.forEach(function(U) {
                return U();
              });
            }
          };
        }, p.addEventListener("abort", l(!1), { signal: d }), p.addEventListener("error", l(!1), { signal: d }), p.addEventListener("complete", l(!0), { signal: d })), p;
      }, table: function(o) {
        var u = t.table(o), l = u.schema.primaryKey;
        return i(i({}, u), { mutate: function(f) {
          var d = j.trans;
          if (l.outbound || d.db._options.cache === "disabled" || d.explicit || d.idbtrans.mode !== "readwrite") return u.mutate(f);
          var p = wt["idb://".concat(n, "/").concat(o)];
          return p ? (d = u.mutate(f), f.type !== "add" && f.type !== "put" || !(50 <= f.values.length || bi(l, f).some(function(v) {
            return v == null;
          })) ? (p.optimisticOps.push(f), f.mutatedParts && fr(f.mutatedParts), d.then(function(v) {
            0 < v.numFailures && (ht(p.optimisticOps, f), (v = Ps(0, f, v)) && p.optimisticOps.push(v), f.mutatedParts && fr(f.mutatedParts));
          }), d.catch(function() {
            ht(p.optimisticOps, f), f.mutatedParts && fr(f.mutatedParts);
          })) : d.then(function(v) {
            var w = Ps(0, i(i({}, f), { values: f.values.map(function(S, y) {
              var O;
              return v.failures[y] ? S : (S = (O = l.keyPath) !== null && O !== void 0 && O.includes(".") ? ft(S) : i({}, S), ke(S, l.keyPath, v.results[y]), S);
            }) }), v);
            p.optimisticOps.push(w), queueMicrotask(function() {
              return f.mutatedParts && fr(f.mutatedParts);
            });
          }), d) : u.mutate(f);
        }, query: function(f) {
          if (!Ns(j, u) || !Ms("query", f)) return u.query(f);
          var d = ((w = j.trans) === null || w === void 0 ? void 0 : w.db._options.cache) === "immutable", y = j, p = y.requery, v = y.signal, w = function(_, T, k, x) {
            var E = wt["idb://".concat(_, "/").concat(T)];
            if (!E) return [];
            if (!(T = E.queries[k])) return [null, !1, E, null];
            var I = T[(x.query ? x.query.index.name : null) || ""];
            if (!I) return [null, !1, E, null];
            switch (k) {
              case "query":
                var C = I.find(function(D) {
                  return D.req.limit === x.limit && D.req.values === x.values && Rs(D.req.query.range, x.query.range);
                });
                return C ? [C, !0, E, I] : [I.find(function(D) {
                  return ("limit" in D.req ? D.req.limit : 1 / 0) >= x.limit && (!x.values || D.req.values) && pu(D.req.query.range, x.query.range);
                }), !1, E, I];
              case "count":
                return C = I.find(function(D) {
                  return Rs(D.req.query.range, x.query.range);
                }), [C, !!C, E, I];
            }
          }(n, o, "query", f), S = w[0], y = w[1], O = w[2], b = w[3];
          return S && y ? S.obsSet = f.obsSet : (y = u.query(f).then(function(_) {
            var T = _.result;
            if (S && (S.res = T), d) {
              for (var k = 0, x = T.length; k < x; ++k) Object.freeze(T[k]);
              Object.freeze(T);
            } else _.result = ft(T);
            return _;
          }).catch(function(_) {
            return b && S && ht(b, S), Promise.reject(_);
          }), S = { obsSet: f.obsSet, promise: y, subscribers: /* @__PURE__ */ new Set(), type: "query", req: f, dirty: !1 }, b ? b.push(S) : (b = [S], (O = O || (wt["idb://".concat(n, "/").concat(o)] = { queries: { query: {}, count: {} }, objs: /* @__PURE__ */ new Map(), optimisticOps: [], unsignaledParts: {} })).queries.query[f.query.index.name || ""] = b)), yu(S, b, p, v), S.promise.then(function(_) {
            return { result: Fs(_.result, f, O == null ? void 0 : O.optimisticOps, u, S, d) };
          });
        } });
      } });
    } };
    function dr(t, n) {
      return new Proxy(t, { get: function(o, u, l) {
        return u === "db" ? n : Reflect.get(o, u, l);
      } });
    }
    var ze = (ce.prototype.version = function(t) {
      if (isNaN(t) || t < 0.1) throw new K.Type("Given version is not a positive number");
      if (t = Math.round(10 * t) / 10, this.idbdb || this._state.isBeingOpened) throw new K.Schema("Cannot add version when database is open");
      this.verno = Math.max(this.verno, t);
      var n = this._versions, o = n.filter(function(u) {
        return u._cfg.version === t;
      })[0];
      return o || (o = new this.Version(t), n.push(o), n.sort(ou), o.stores({}), this._state.autoSchema = !1, o);
    }, ce.prototype._whenReady = function(t) {
      var n = this;
      return this.idbdb && (this._state.openComplete || j.letThrough || this._vip) ? t() : new q(function(o, u) {
        if (n._state.openComplete) return u(new K.DatabaseClosed(n._state.dbOpenError));
        if (!n._state.isBeingOpened) {
          if (!n._state.autoOpen) return void u(new K.DatabaseClosed());
          n.open().catch(ie);
        }
        n._state.dbReadyPromise.then(o, u);
      }).then(t);
    }, ce.prototype.use = function(t) {
      var n = t.stack, o = t.create, u = t.level, l = t.name;
      return l && this.unuse({ stack: n, name: l }), t = this._middlewares[n] || (this._middlewares[n] = []), t.push({ stack: n, create: o, level: u ?? 10, name: l }), t.sort(function(f, d) {
        return f.level - d.level;
      }), this;
    }, ce.prototype.unuse = function(t) {
      var n = t.stack, o = t.name, u = t.create;
      return n && this._middlewares[n] && (this._middlewares[n] = this._middlewares[n].filter(function(l) {
        return u ? l.create !== u : !!o && l.name !== o;
      })), this;
    }, ce.prototype.open = function() {
      var t = this;
      return gt(He, function() {
        return cu(t);
      });
    }, ce.prototype._close = function() {
      var t = this._state, n = Rt.indexOf(this);
      if (0 <= n && Rt.splice(n, 1), this.idbdb) {
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
    }, ce.prototype.close = function(o) {
      var n = (o === void 0 ? { disableAutoOpen: !0 } : o).disableAutoOpen, o = this._state;
      n ? (o.isBeingOpened && o.cancelOpen(new K.DatabaseClosed()), this._close(), o.autoOpen = !1, o.dbOpenError = new K.DatabaseClosed()) : (this._close(), o.autoOpen = this._options.autoOpen || o.isBeingOpened, o.openComplete = !1, o.dbOpenError = null);
    }, ce.prototype.delete = function(t) {
      var n = this;
      t === void 0 && (t = { disableAutoOpen: !0 });
      var o = 0 < arguments.length && typeof arguments[0] != "object", u = this._state;
      return new q(function(l, f) {
        function d() {
          n.close(t);
          var p = n._deps.indexedDB.deleteDatabase(n.name);
          p.onsuccess = oe(function() {
            var v, w, S;
            v = n._deps, w = n.name, S = v.indexedDB, v = v.IDBKeyRange, ci(S) || w === Xn || li(S, v).delete(w).catch(ie), l();
          }), p.onerror = qe(f), p.onblocked = n._fireOnBlocked;
        }
        if (o) throw new K.InvalidArgument("Invalid closeOptions argument to db.delete()");
        u.isBeingOpened ? u.dbReadyPromise.then(d) : d();
      });
    }, ce.prototype.backendDB = function() {
      return this.idbdb;
    }, ce.prototype.isOpen = function() {
      return this.idbdb !== null;
    }, ce.prototype.hasBeenClosed = function() {
      var t = this._state.dbOpenError;
      return t && t.name === "DatabaseClosed";
    }, ce.prototype.hasFailed = function() {
      return this._state.dbOpenError !== null;
    }, ce.prototype.dynamicallyOpened = function() {
      return this._state.autoSchema;
    }, Object.defineProperty(ce.prototype, "tables", { get: function() {
      var t = this;
      return h(this._allTables).map(function(n) {
        return t._allTables[n];
      });
    }, enumerable: !1, configurable: !0 }), ce.prototype.transaction = function() {
      var t = (function(n, o, u) {
        var l = arguments.length;
        if (l < 2) throw new K.InvalidArgument("Too few arguments");
        for (var f = new Array(l - 1); --l; ) f[l - 1] = arguments[l];
        return u = f.pop(), [n, Be(f), u];
      }).apply(this, arguments);
      return this._transaction.apply(this, t);
    }, ce.prototype._transaction = function(t, n, o) {
      var u = this, l = j.trans;
      l && l.db === this && t.indexOf("!") === -1 || (l = null);
      var f, d, p = t.indexOf("?") !== -1;
      t = t.replace("!", "").replace("?", "");
      try {
        if (d = n.map(function(w) {
          if (w = w instanceof u.Table ? w.name : w, typeof w != "string") throw new TypeError("Invalid table argument to Dexie.transaction(). Only Table or String are allowed");
          return w;
        }), t == "r" || t === Jr) f = Jr;
        else {
          if (t != "rw" && t != Xr) throw new K.InvalidArgument("Invalid transaction mode: " + t);
          f = Xr;
        }
        if (l) {
          if (l.mode === Jr && f === Xr) {
            if (!p) throw new K.SubTransaction("Cannot enter a sub-transaction with READWRITE mode when parent transaction is READONLY");
            l = null;
          }
          l && d.forEach(function(w) {
            if (l && l.storeNames.indexOf(w) === -1) {
              if (!p) throw new K.SubTransaction("Table " + w + " not included in parent transaction.");
              l = null;
            }
          }), p && l && !l.active && (l = null);
        }
      } catch (w) {
        return l ? l._promise(null, function(S, y) {
          y(w);
        }) : le(w);
      }
      var v = (function w(S, y, O, b, _) {
        return q.resolve().then(function() {
          var T = j.transless || j, k = S._createTransaction(y, O, S._dbSchema, b);
          if (k.explicit = !0, T = { trans: k, transless: T }, b) k.idbtrans = b.idbtrans;
          else try {
            k.create(), k.idbtrans._explicit = !0, S._state.PR1398_maxLoop = 3;
          } catch (I) {
            return I.name === Ur.InvalidState && S.isOpen() && 0 < --S._state.PR1398_maxLoop ? (console.warn("Dexie: Need to reopen db"), S.close({ disableAutoOpen: !1 }), S.open().then(function() {
              return w(S, y, O, null, _);
            })) : le(I);
          }
          var x, E = Lr(_);
          return E && Ft(), T = q.follow(function() {
            var I;
            (x = _.call(k, k)) && (E ? (I = Ge.bind(null, null), x.then(I, I)) : typeof x.next == "function" && typeof x.throw == "function" && (x = gi(x)));
          }, T), (x && typeof x.then == "function" ? q.resolve(x).then(function(I) {
            return k.active ? I : le(new K.PrematureCommit("Transaction committed too early. See http://bit.ly/2kdckMn"));
          }) : T.then(function() {
            return x;
          })).then(function(I) {
            return b && k._resolve(), k._completion.then(function() {
              return I;
            });
          }).catch(function(I) {
            return k._reject(I), le(I);
          });
        });
      }).bind(null, this, f, d, l, o);
      return l ? l._promise(f, v, "lock") : j.trans ? gt(j.transless, function() {
        return u._whenReady(v);
      }) : this._whenReady(v);
    }, ce.prototype.table = function(t) {
      if (!M(this._allTables, t)) throw new K.InvalidTable("Table ".concat(t, " does not exist"));
      return this._allTables[t];
    }, ce);
    function ce(t, n) {
      var o = this;
      this._middlewares = {}, this.verno = 0;
      var u = ce.dependencies;
      this._options = n = i({ addons: ce.addons, autoOpen: !0, indexedDB: u.indexedDB, IDBKeyRange: u.IDBKeyRange, cache: "cloned" }, n), this._deps = { indexedDB: n.indexedDB, IDBKeyRange: n.IDBKeyRange }, u = n.addons, this._dbSchema = {}, this._versions = [], this._storeNames = [], this._allTables = {}, this.idbdb = null, this._novip = this;
      var l, f, d, p, v, w = { dbOpenError: null, isBeingOpened: !1, onReadyBeingFired: null, openComplete: !1, dbReadyResolve: ie, dbReadyPromise: null, cancelOpen: ie, openCanceller: null, autoSchema: !0, PR1398_maxLoop: 3, autoOpen: n.autoOpen };
      w.dbReadyPromise = new q(function(y) {
        w.dbReadyResolve = y;
      }), w.openCanceller = new q(function(y, O) {
        w.cancelOpen = O;
      }), this._state = w, this.name = t, this.on = mn(this, "populate", "blocked", "versionchange", "close", { ready: [jr, ie] }), this.on.ready.subscribe = on(this.on.ready.subscribe, function(y) {
        return function(O, b) {
          ce.vip(function() {
            var _, T = o._state;
            T.openComplete ? (T.dbOpenError || q.resolve().then(O), b && y(O)) : T.onReadyBeingFired ? (T.onReadyBeingFired.push(O), b && y(O)) : (y(O), _ = o, b || y(function k() {
              _.on.ready.unsubscribe(O), _.on.ready.unsubscribe(k);
            }));
          });
        };
      }), this.Collection = (l = this, pn(Qa.prototype, function(x, k) {
        this.db = l;
        var b = ms, _ = null;
        if (k) try {
          b = k();
        } catch (E) {
          _ = E;
        }
        var T = x._ctx, k = T.table, x = k.hook.reading.fire;
        this._ctx = { table: k, index: T.index, isPrimKey: !T.index || k.schema.primKey.keyPath && T.index === k.schema.primKey.name, range: b, keysOnly: !1, dir: "next", unique: "", algorithm: null, filter: null, replayFilter: null, justLimit: !0, isMatch: null, offset: 0, limit: 1 / 0, error: _, or: T.or, valueMapper: x !== ln ? x : null };
      })), this.Table = (f = this, pn(vs.prototype, function(y, O, b) {
        this.db = f, this._tx = b, this.name = y, this.schema = O, this.hook = f._allTables[y] ? f._allTables[y].hook : mn(null, { creating: [Ka, ie], reading: [Wa, ln], updating: [Za, ie], deleting: [za, ie] });
      })), this.Transaction = (d = this, pn(nu.prototype, function(y, O, b, _, T) {
        var k = this;
        this.db = d, this.mode = y, this.storeNames = O, this.schema = b, this.chromeTransactionDurability = _, this.idbtrans = null, this.on = mn(this, "complete", "error", "abort"), this.parent = T || null, this.active = !0, this._reculock = 0, this._blockedFuncs = [], this._resolve = null, this._reject = null, this._waitingFor = null, this._waitingQueue = null, this._spinCount = 0, this._completion = new q(function(x, E) {
          k._resolve = x, k._reject = E;
        }), this._completion.then(function() {
          k.active = !1, k.on.complete.fire();
        }, function(x) {
          var E = k.active;
          return k.active = !1, k.on.error.fire(x), k.parent ? k.parent._reject(x) : E && k.idbtrans && k.idbtrans.abort(), le(x);
        });
      })), this.Version = (p = this, pn(lu.prototype, function(y) {
        this.db = p, this._cfg = { version: y, storesSource: null, dbschema: {}, tables: {}, contentUpgrade: null };
      })), this.WhereClause = (v = this, pn(Ss.prototype, function(y, O, b) {
        if (this.db = v, this._ctx = { table: y, index: O === ":id" ? null : O, or: b }, this._cmp = this._ascending = X, this._descending = function(_, T) {
          return X(T, _);
        }, this._max = function(_, T) {
          return 0 < X(_, T) ? _ : T;
        }, this._min = function(_, T) {
          return X(_, T) < 0 ? _ : T;
        }, this._IDBKeyRange = v._deps.IDBKeyRange, !this._IDBKeyRange) throw new K.MissingAPI();
      })), this.on("versionchange", function(y) {
        0 < y.newVersion ? console.warn("Another connection wants to upgrade database '".concat(o.name, "'. Closing db now to resume the upgrade.")) : console.warn("Another connection wants to delete database '".concat(o.name, "'. Closing db now to resume the delete request.")), o.close({ disableAutoOpen: !1 });
      }), this.on("blocked", function(y) {
        !y.newVersion || y.newVersion < y.oldVersion ? console.warn("Dexie.delete('".concat(o.name, "') was blocked")) : console.warn("Upgrade '".concat(o.name, "' blocked by other connection holding version ").concat(y.oldVersion / 10));
      }), this._maxKey = bn(n.IDBKeyRange), this._createTransaction = function(y, O, b, _) {
        return new o.Transaction(y, O, b, o._options.chromeTransactionDurability, _);
      }, this._fireOnBlocked = function(y) {
        o.on("blocked").fire(y), Rt.filter(function(O) {
          return O.name === o.name && O !== o && !O._state.vcFired;
        }).map(function(O) {
          return O.on("versionchange").fire(y);
        });
      }, this.use(du), this.use(gu), this.use(mu), this.use(fu), this.use(hu);
      var S = new Proxy(this, { get: function(y, O, b) {
        if (O === "_vip") return !0;
        if (O === "table") return function(T) {
          return dr(o.table(T), S);
        };
        var _ = Reflect.get(y, O, b);
        return _ instanceof vs ? dr(_, S) : O === "tables" ? _.map(function(T) {
          return dr(T, S);
        }) : O === "_createTransaction" ? function() {
          return dr(_.apply(this, arguments), S);
        } : _;
      } });
      this.vip = S, u.forEach(function(y) {
        return y(o);
      });
    }
    var mr, Ie = typeof Symbol < "u" && "observable" in Symbol ? Symbol.observable : "@@observable", vu = (ki.prototype.subscribe = function(t, n, o) {
      return this._subscribe(t && typeof t != "function" ? t : { next: t, error: n, complete: o });
    }, ki.prototype[Ie] = function() {
      return this;
    }, ki);
    function ki(t) {
      this._subscribe = t;
    }
    try {
      mr = { indexedDB: c.indexedDB || c.mozIndexedDB || c.webkitIndexedDB || c.msIndexedDB, IDBKeyRange: c.IDBKeyRange || c.webkitIDBKeyRange };
    } catch {
      mr = { indexedDB: null, IDBKeyRange: null };
    }
    function Vs(t) {
      var n, o = !1, u = new vu(function(l) {
        var f = Lr(t), d, p = !1, v = {}, w = {}, S = { get closed() {
          return p;
        }, unsubscribe: function() {
          p || (p = !0, d && d.abort(), y && Qe.storagemutated.unsubscribe(b));
        } };
        l.start && l.start(S);
        var y = !1, O = function() {
          return Gr(_);
        }, b = function(T) {
          cr(v, T), di(w, v) && O();
        }, _ = function() {
          var T, k, x;
          !p && mr.indexedDB && (v = {}, T = {}, d && d.abort(), d = new AbortController(), x = function(E) {
            var I = Mt();
            try {
              f && Ft();
              var C = Ye(t, E);
              return C = f ? C.finally(Ge) : C;
            } finally {
              I && Pt();
            }
          }(k = { subscr: T, signal: d.signal, requery: O, querier: t, trans: null }), Promise.resolve(x).then(function(E) {
            o = !0, n = E, p || k.signal.aborted || (v = {}, function(I) {
              for (var C in I) if (M(I, C)) return;
              return 1;
            }(w = T) || y || (Qe(vn, b), y = !0), Gr(function() {
              return !p && l.next && l.next(E);
            }));
          }, function(E) {
            o = !1, ["DatabaseClosedError", "AbortError"].includes(E == null ? void 0 : E.name) || p || Gr(function() {
              p || l.error && l.error(E);
            });
          }));
        };
        return setTimeout(O, 0), S;
      });
      return u.hasValue = function() {
        return o;
      }, u.getValue = function() {
        return n;
      }, u;
    }
    var kt = ze;
    function _i(t) {
      var n = et;
      try {
        et = !0, Qe.storagemutated.fire(t), yi(t, !0);
      } finally {
        et = n;
      }
    }
    Z(kt, i(i({}, Wn), { delete: function(t) {
      return new kt(t, { addons: [] }).delete();
    }, exists: function(t) {
      return new kt(t, { addons: [] }).open().then(function(n) {
        return n.close(), !0;
      }).catch("NoSuchDatabaseError", function() {
        return !1;
      });
    }, getDatabaseNames: function(t) {
      try {
        return n = kt.dependencies, o = n.indexedDB, n = n.IDBKeyRange, (ci(o) ? Promise.resolve(o.databases()).then(function(u) {
          return u.map(function(l) {
            return l.name;
          }).filter(function(l) {
            return l !== Xn;
          });
        }) : li(o, n).toCollection().primaryKeys()).then(t);
      } catch {
        return le(new K.MissingAPI());
      }
      var n, o;
    }, defineClass: function() {
      return function(t) {
        g(this, t);
      };
    }, ignoreTransaction: function(t) {
      return j.trans ? gt(j.transless, t) : t();
    }, vip: fi, async: function(t) {
      return function() {
        try {
          var n = gi(t.apply(this, arguments));
          return n && typeof n.then == "function" ? n : q.resolve(n);
        } catch (o) {
          return le(o);
        }
      };
    }, spawn: function(t, n, o) {
      try {
        var u = gi(t.apply(o, n || []));
        return u && typeof u.then == "function" ? u : q.resolve(u);
      } catch (l) {
        return le(l);
      }
    }, currentTransaction: { get: function() {
      return j.trans || null;
    } }, waitFor: function(t, n) {
      return n = q.resolve(typeof t == "function" ? kt.ignoreTransaction(t) : t).timeout(n || 6e4), j.trans ? j.trans.waitFor(n) : n;
    }, Promise: q, debug: { get: function() {
      return Ve;
    }, set: function(t) {
      as(t);
    } }, derive: Se, extend: g, props: Z, override: on, Events: mn, on: Qe, liveQuery: Vs, extendObservabilitySet: cr, getByKeyPath: $e, setByKeyPath: ke, delByKeyPath: function(t, n) {
      typeof n == "string" ? ke(t, n, void 0) : "length" in n && [].map.call(n, function(o) {
        ke(t, o, void 0);
      });
    }, shallowClone: Ln, deepClone: ft, getObjectDiff: vi, cmp: X, asap: an, minKey: -1 / 0, addons: [], connections: Rt, errnames: Ur, dependencies: mr, cache: wt, semVer: "4.0.10", version: "4.0.10".split(".").map(function(t) {
      return parseInt(t);
    }).reduce(function(t, n, o) {
      return t + n / Math.pow(10, 2 * o);
    }) })), kt.maxKey = bn(kt.dependencies.IDBKeyRange), typeof dispatchEvent < "u" && typeof addEventListener < "u" && (Qe(vn, function(t) {
      et || (t = new CustomEvent(ni, { detail: t }), et = !0, dispatchEvent(t), et = !1);
    }), addEventListener(ni, function(t) {
      t = t.detail, et || _i(t);
    }));
    var Lt, et = !1, qs = function() {
    };
    return typeof BroadcastChannel < "u" && ((qs = function() {
      (Lt = new BroadcastChannel(ni)).onmessage = function(t) {
        return t.data && _i(t.data);
      };
    })(), typeof Lt.unref == "function" && Lt.unref(), Qe(vn, function(t) {
      et || Lt.postMessage(t);
    })), typeof addEventListener < "u" && (addEventListener("pagehide", function(t) {
      if (!ze.disableBfCache && t.persisted) {
        Ve && console.debug("Dexie: handling persisted pagehide"), Lt != null && Lt.close();
        for (var n = 0, o = Rt; n < o.length; n++) o[n].close({ disableAutoOpen: !1 });
      }
    }), addEventListener("pageshow", function(t) {
      !ze.disableBfCache && t.persisted && (Ve && console.debug("Dexie: handling persisted pageshow"), qs(), _i({ all: new pe(-1 / 0, [[]]) }));
    })), q.rejectionMapper = function(t, n) {
      return !t || t instanceof $t || t instanceof TypeError || t instanceof SyntaxError || !t.name || !os[t.name] ? t : (n = new os[t.name](n || t.message, t), "stack" in t && ee(n, "stack", { get: function() {
        return this.inner.stack;
      } }), n);
    }, as(Ve), i(ze, Object.freeze({ __proto__: null, Dexie: ze, liveQuery: Vs, Entity: ps, cmp: X, PropModSymbol: Ke, PropModification: yn, replacePrefix: function(t, n) {
      return new yn({ replacePrefix: [t, n] });
    }, add: function(t) {
      return new yn({ add: t });
    }, remove: function(t) {
      return new yn({ remove: t });
    }, default: ze, RangeSet: pe, mergeRanges: _n, rangesOverlap: Is }), { default: ze }), ze;
  });
})(Va);
var Hc = Va.exports;
const Ki = /* @__PURE__ */ Bc(Hc), Ao = Symbol.for("Dexie"), zi = globalThis[Ao] || (globalThis[Ao] = Ki);
if (Ki.semVer !== zi.semVer)
  throw new Error(`Two different versions of Dexie loaded in the same app: ${Ki.semVer} and ${zi.semVer}`);
class ef {
  constructor(e) {
    this.apiContext = void 0, this.db = void 0, this.hasRefreshedFavourites = !1, this.hasRefreshedAll = !1, this.localCache = /* @__PURE__ */ new Map(), this.apiContext = e, this.db = this.initDb();
  }
  initDb() {
    const e = new zi("KioskTimeZones");
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
    var e, r;
    if (!this.db) return [];
    if (!this.hasRefreshedFavourites) {
      const i = await this.fetchFavouriteTimeZones();
      if (i && i.length > 0) {
        let a = await ((e = this.db) == null ? void 0 : e.kioskTimeZones.where("favourite").equals(1).delete());
        console.log(`Deleted ${a} favourite time zones`);
        const c = i.map((m) => ({
          id: m.id,
          tz_IANA: m.tz_IANA,
          tz_long: m.tz_long,
          deprecated: m.deprecated ? 1 : 0,
          version: m.version,
          favourite: 1
        }));
        let h = await ((r = this.db) == null ? void 0 : r.kioskTimeZones.bulkAdd(c));
        return console.log(`Added ${h} new favourite time zones`), this.hasRefreshedFavourites = !0, c;
      }
    }
    return [];
  }
  async fetchFavouriteTimeZones() {
    var e;
    return await ((e = this.apiContext) == null ? void 0 : e.fetchFromApi(
      "",
      "favouritetimezones",
      {
        method: "GET",
        caller: "app.fetchFavouriteTimeZones"
      }
    ).then((r) => (console.log("favourite time zone information fetched"), r)).catch((r) => (console.log(`fetching time zone information failed: ${r}`), [])));
  }
  async fetchAllTimeZones(e = 0) {
    var i;
    const r = new URLSearchParams();
    return r.append("include_deprecated", "true"), e > 0 && r.append("newer_than", `${e}`), await ((i = this.apiContext) == null ? void 0 : i.fetchFromApi(
      "",
      "timezones",
      {
        method: "GET",
        caller: "app.fetchFavouriteTimeZones"
      },
      "v1",
      r
    ).then((a) => (console.log("time zone information fetched"), a)).catch((a) => (console.log(`time zone information failed: ${a}`), [])));
  }
  async getAllTimeZones(e = !1, r = !1) {
    var a;
    await this.refreshAllTimeZones(r);
    let i = await ((a = this.db) == null ? void 0 : a.kioskTimeZones.toArray());
    return i == null ? void 0 : i.filter((c) => c.deprecated == 0 || e);
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
  ef as KioskTimeZones,
  Jc as kioskdatetime,
  Yc as kioskstandardlib,
  Gc as luxon
};
