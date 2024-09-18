function bu(s, e, r = 0) {
  let i = /* @__PURE__ */ new Date();
  i.setTime(i.getTime() + r * 24 * 60 * 60 * 1e3);
  let a = "expires=" + i.toUTCString();
  document.cookie = s + "=" + e + ";" + a + ";path=/";
}
function Tt(s) {
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
  getCookie: Tt,
  setCookie: bu
}, Symbol.toStringTag, { value: "Module" }));
class At extends Error {
}
class wu extends At {
  constructor(e) {
    super(`Invalid DateTime: ${e.toMessage()}`);
  }
}
class ku extends At {
  constructor(e) {
    super(`Invalid Interval: ${e.toMessage()}`);
  }
}
class _u extends At {
  constructor(e) {
    super(`Invalid Duration: ${e.toMessage()}`);
  }
}
class zt extends At {
}
class Co extends At {
  constructor(e) {
    super(`Invalid unit ${e}`);
  }
}
class ge extends At {
}
class tt extends At {
  constructor() {
    super("Zone is an abstract class");
  }
}
const V = "numeric", Fe = "short", Te = "long", Er = {
  year: V,
  month: V,
  day: V
}, Do = {
  year: V,
  month: Fe,
  day: V
}, Su = {
  year: V,
  month: Fe,
  day: V,
  weekday: Fe
}, $o = {
  year: V,
  month: Te,
  day: V
}, No = {
  year: V,
  month: Te,
  day: V,
  weekday: Te
}, Mo = {
  hour: V,
  minute: V
}, Po = {
  hour: V,
  minute: V,
  second: V
}, Fo = {
  hour: V,
  minute: V,
  second: V,
  timeZoneName: Fe
}, Ro = {
  hour: V,
  minute: V,
  second: V,
  timeZoneName: Te
}, Vo = {
  hour: V,
  minute: V,
  hourCycle: "h23"
}, qo = {
  hour: V,
  minute: V,
  second: V,
  hourCycle: "h23"
}, Lo = {
  hour: V,
  minute: V,
  second: V,
  hourCycle: "h23",
  timeZoneName: Fe
}, Uo = {
  hour: V,
  minute: V,
  second: V,
  hourCycle: "h23",
  timeZoneName: Te
}, jo = {
  year: V,
  month: V,
  day: V,
  hour: V,
  minute: V
}, Wo = {
  year: V,
  month: V,
  day: V,
  hour: V,
  minute: V,
  second: V
}, Ko = {
  year: V,
  month: Fe,
  day: V,
  hour: V,
  minute: V
}, zo = {
  year: V,
  month: Fe,
  day: V,
  hour: V,
  minute: V,
  second: V
}, xu = {
  year: V,
  month: Fe,
  day: V,
  weekday: Fe,
  hour: V,
  minute: V
}, Zo = {
  year: V,
  month: Te,
  day: V,
  hour: V,
  minute: V,
  timeZoneName: Fe
}, Bo = {
  year: V,
  month: Te,
  day: V,
  hour: V,
  minute: V,
  second: V,
  timeZoneName: Fe
}, Ho = {
  year: V,
  month: Te,
  day: V,
  weekday: Te,
  hour: V,
  minute: V,
  timeZoneName: Te
}, Yo = {
  year: V,
  month: Te,
  day: V,
  weekday: Te,
  hour: V,
  minute: V,
  second: V,
  timeZoneName: Te
};
class Qt {
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
let xi = null;
class Pn extends Qt {
  /**
   * Get a singleton instance of the local zone
   * @return {SystemZone}
   */
  static get instance() {
    return xi === null && (xi = new Pn()), xi;
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
    return sa(e, r, i);
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
function Tu(s) {
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
const Ou = {
  year: 0,
  month: 1,
  day: 2,
  era: 3,
  hour: 4,
  minute: 5,
  second: 6
};
function Eu(s, e) {
  const r = s.format(e).replace(/\u200E/g, ""), i = /(\d+)\/(\d+)\/(\d+) (AD|BC),? (\d+):(\d+):(\d+)/.exec(r), [, a, c, h, m, v, A, q] = i;
  return [h, a, c, m, v, A, q];
}
function Iu(s, e) {
  const r = s.formatToParts(e), i = [];
  for (let a = 0; a < r.length; a++) {
    const { type: c, value: h } = r[a], m = Ou[c];
    c === "era" ? i[m] = h : Z(m) || (i[m] = parseInt(h, 10));
  }
  return i;
}
let yr = {};
class Ue extends Qt {
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
    return sa(e, r, i, this.name);
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
    const i = Tu(this.name);
    let [a, c, h, m, v, A, q] = i.formatToParts ? Iu(i, r) : Eu(i, r);
    m === "BC" && (a = -Math.abs(a) + 1);
    const z = Mr({
      year: a,
      month: c,
      day: h,
      hour: v === 24 ? 0 : v,
      minute: A,
      second: q,
      millisecond: 0
    });
    let j = +r;
    const ee = j % 1e3;
    return j -= ee >= 0 ? ee : 1e3 + ee, (z - j) / (60 * 1e3);
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
let qs = {};
function Au(s, e = {}) {
  const r = JSON.stringify([s, e]);
  let i = qs[r];
  return i || (i = new Intl.ListFormat(s, e), qs[r] = i), i;
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
let Tn = null;
function $u() {
  return Tn || (Tn = new Intl.DateTimeFormat().resolvedOptions().locale, Tn);
}
let Ls = {};
function Nu(s) {
  let e = Ls[s];
  if (!e) {
    const r = new Intl.Locale(s);
    e = "getWeekInfo" in r ? r.getWeekInfo() : r.weekInfo, Ls[s] = e;
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
      const v = s.substring(0, r);
      i = Ri(v).resolvedOptions(), a = v;
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
    const i = K.utc(2009, r, 1);
    e.push(s(i));
  }
  return e;
}
function Ru(s) {
  const e = [];
  for (let r = 1; r <= 7; r++) {
    const i = K.utc(2016, 11, 13 + r);
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
    this.opts = { style: "long", ...i }, !r && ra() && (this.rtf = Du(e, i));
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
    const h = e || ue.defaultLocale, m = h || (c ? "en-US" : $u()), v = r || ue.defaultNumberingSystem, A = i || ue.defaultOutputCalendar, q = Li(a) || ue.defaultWeekSettings;
    return new re(m, v, A, q, h);
  }
  static resetCache() {
    Tn = null, Fi = {}, Vi = {}, qi = {};
  }
  static fromObject({ locale: e, numberingSystem: r, outputCalendar: i, weekSettings: a } = {}) {
    return re.create(e, r, i, a);
  }
  constructor(e, r, i, a, c) {
    const [h, m, v] = Mu(e);
    this.locale = h, this.numberingSystem = r || m || null, this.outputCalendar = i || v || null, this.weekSettings = a, this.intl = Pu(this.locale, this.numberingSystem, this.outputCalendar), this.weekdaysCache = { format: {}, standalone: {} }, this.monthsCache = { format: {}, standalone: {} }, this.meridiemCache = null, this.eraCache = {}, this.specifiedLocale = c, this.fastNumbersCached = null;
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
    return gr(this, e, ua, () => {
      const i = r ? { month: e, day: "numeric" } : { month: e }, a = r ? "format" : "standalone";
      return this.monthsCache[a][e] || (this.monthsCache[a][e] = Fu((c) => this.extract(c, i, "month"))), this.monthsCache[a][e];
    });
  }
  weekdays(e, r = !1) {
    return gr(this, e, fa, () => {
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
      () => ha,
      () => {
        if (!this.meridiemCache) {
          const e = { hour: "numeric", hourCycle: "h12" };
          this.meridiemCache = [K.utc(2016, 11, 13, 9), K.utc(2016, 11, 13, 19)].map(
            (r) => this.extract(r, e, "dayperiod")
          );
        }
        return this.meridiemCache;
      }
    );
  }
  eras(e) {
    return gr(this, e, da, () => {
      const r = { era: e };
      return this.eraCache[e] || (this.eraCache[e] = [K.utc(-40, 1, 1), K.utc(2017, 1, 1)].map(
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
    return this.weekSettings ? this.weekSettings : ia() ? Nu(this.locale) : ju;
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
let Ti = null;
class be extends Qt {
  /**
   * Get a singleton instance of UTC
   * @return {FixedOffsetZone}
   */
  static get utcInstance() {
    return Ti === null && (Ti = new be(0)), Ti;
  }
  /**
   * Get an instance with a specified offset
   * @param {number} offset - The offset in minutes
   * @return {FixedOffsetZone}
   */
  static instance(e) {
    return e === 0 ? be.utcInstance : new be(e);
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
        return new be(Pr(r[1], r[2]));
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
class Go extends Qt {
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
  if (Z(s) || s === null)
    return e;
  if (s instanceof Qt)
    return s;
  if (Hu(s)) {
    const r = s.toLowerCase();
    return r === "default" ? e : r === "local" || r === "system" ? Pn.instance : r === "utc" || r === "gmt" ? be.utcInstance : be.parseSpecifier(r) || Ue.create(s);
  } else return at(s) ? be.instance(s) : typeof s == "object" && "offset" in s && typeof s.offset == "function" ? s : new Go(s);
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
}, Us = {
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
        for (const a in Us) {
          const [c, h] = Us[a];
          i >= c && i <= h && (e += i - c);
        }
    }
    return parseInt(e, 10);
  } else
    return e;
}
let Wt = {};
function zu() {
  Wt = {};
}
function Ne({ numberingSystem: s }, e = "") {
  const r = s || "latn";
  return Wt[r] || (Wt[r] = {}), Wt[r][e] || (Wt[r][e] = new RegExp(`${Zi[r]}${e}`)), Wt[r][e];
}
let js = () => Date.now(), Ws = "system", Ks = null, zs = null, Zs = null, Bs = 60, Hs, Ys = null;
class ue {
  /**
   * Get the callback for returning the current timestamp.
   * @type {function}
   */
  static get now() {
    return js;
  }
  /**
   * Set the callback for returning the current timestamp.
   * The function should return a number, which will be interpreted as an Epoch millisecond count
   * @type {function}
   * @example Settings.now = () => Date.now() + 3000 // pretend it is 3 seconds in the future
   * @example Settings.now = () => 0 // always pretend it's Jan 1, 1970 at midnight in UTC time
   */
  static set now(e) {
    js = e;
  }
  /**
   * Set the default time zone to create DateTimes in. Does not affect existing instances.
   * Use the value "system" to reset this value to the system's time zone.
   * @type {string}
   */
  static set defaultZone(e) {
    Ws = e;
  }
  /**
   * Get the default time zone object currently used to create DateTimes. Does not affect existing instances.
   * The default value is the system's time zone (the one set on the machine that runs this code).
   * @type {Zone}
   */
  static get defaultZone() {
    return it(Ws, Pn.instance);
  }
  /**
   * Get the default locale to create DateTimes with. Does not affect existing instances.
   * @type {string}
   */
  static get defaultLocale() {
    return Ks;
  }
  /**
   * Set the default locale to create DateTimes with. Does not affect existing instances.
   * @type {string}
   */
  static set defaultLocale(e) {
    Ks = e;
  }
  /**
   * Get the default numbering system to create DateTimes with. Does not affect existing instances.
   * @type {string}
   */
  static get defaultNumberingSystem() {
    return zs;
  }
  /**
   * Set the default numbering system to create DateTimes with. Does not affect existing instances.
   * @type {string}
   */
  static set defaultNumberingSystem(e) {
    zs = e;
  }
  /**
   * Get the default output calendar to create DateTimes with. Does not affect existing instances.
   * @type {string}
   */
  static get defaultOutputCalendar() {
    return Zs;
  }
  /**
   * Set the default output calendar to create DateTimes with. Does not affect existing instances.
   * @type {string}
   */
  static set defaultOutputCalendar(e) {
    Zs = e;
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
    return Ys;
  }
  /**
   * Allows overriding the default locale week settings, i.e. the start of the week, the weekend and
   * how many days are required in the first week of a year.
   * Does not affect existing instances.
   *
   * @param {WeekSettings|null} weekSettings
   */
  static set defaultWeekSettings(e) {
    Ys = Li(e);
  }
  /**
   * Get the cutoff year for whether a 2-digit year string is interpreted in the current or previous century. Numbers higher than the cutoff will be considered to mean 19xx and numbers lower or equal to the cutoff will be considered 20xx.
   * @type {number}
   */
  static get twoDigitCutoffYear() {
    return Bs;
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
    Bs = e % 100;
  }
  /**
   * Get whether Luxon will throw when it encounters invalid DateTimes, Durations, or Intervals
   * @type {boolean}
   */
  static get throwOnInvalid() {
    return Hs;
  }
  /**
   * Set whether Luxon will throw when it encounters invalid DateTimes, Durations, or Intervals
   * @type {boolean}
   */
  static set throwOnInvalid(e) {
    Hs = e;
  }
  /**
   * Reset Luxon's global caches. Should only be necessary in testing scenarios.
   * @return {void}
   */
  static resetCaches() {
    re.resetCache(), Ue.resetCache(), K.resetCache(), zu();
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
const Jo = [0, 31, 59, 90, 120, 151, 181, 212, 243, 273, 304, 334], Xo = [0, 31, 60, 91, 121, 152, 182, 213, 244, 274, 305, 335];
function Ae(s, e) {
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
function Qo(s, e, r) {
  return r + (Fn(s) ? Xo : Jo)[e - 1];
}
function ea(s, e) {
  const r = Fn(s) ? Xo : Jo, i = r.findIndex((c) => c < e), a = e - r[i];
  return { month: i + 1, day: a };
}
function Hi(s, e) {
  return (s - e + 7) % 7 + 1;
}
function Ir(s, e = 4, r = 1) {
  const { year: i, month: a, day: c } = s, h = Qo(i, a, c), m = Hi(Bi(i, a, c), r);
  let v = Math.floor((h - m + 14 - e) / 7), A;
  return v < 1 ? (A = i - 1, v = Dn(A, e, r)) : v > Dn(i, e, r) ? (A = i + 1, v = 1) : A = i, { weekYear: A, weekNumber: v, weekday: m, ...Fr(s) };
}
function Gs(s, e = 4, r = 1) {
  const { weekYear: i, weekNumber: a, weekday: c } = s, h = Hi(Bi(i, 1, e), r), m = Bt(i);
  let v = a * 7 + c - h - 7 + e, A;
  v < 1 ? (A = i - 1, v += Bt(A)) : v > m ? (A = i + 1, v -= Bt(i)) : A = i;
  const { month: q, day: M } = ea(A, v);
  return { year: A, month: q, day: M, ...Fr(s) };
}
function Oi(s) {
  const { year: e, month: r, day: i } = s, a = Qo(e, r, i);
  return { year: e, ordinal: a, ...Fr(s) };
}
function Js(s) {
  const { year: e, ordinal: r } = s, { month: i, day: a } = ea(e, r);
  return { year: e, month: i, day: a, ...Fr(s) };
}
function Xs(s, e) {
  if (!Z(s.localWeekday) || !Z(s.localWeekNumber) || !Z(s.localWeekYear)) {
    if (!Z(s.weekday) || !Z(s.weekNumber) || !Z(s.weekYear))
      throw new zt(
        "Cannot mix locale-based week fields with ISO-based week fields"
      );
    return Z(s.localWeekday) || (s.weekday = s.localWeekday), Z(s.localWeekNumber) || (s.weekNumber = s.localWeekNumber), Z(s.localWeekYear) || (s.weekYear = s.localWeekYear), delete s.localWeekday, delete s.localWeekNumber, delete s.localWeekYear, {
      minDaysInFirstWeek: e.getMinDaysInFirstWeek(),
      startOfWeek: e.getStartOfWeek()
    };
  } else
    return { minDaysInFirstWeek: 4, startOfWeek: 1 };
}
function Zu(s, e = 4, r = 1) {
  const i = Nr(s.weekYear), a = Ce(
    s.weekNumber,
    1,
    Dn(s.weekYear, e, r)
  ), c = Ce(s.weekday, 1, 7);
  return i ? a ? c ? !1 : Ae("weekday", s.weekday) : Ae("week", s.weekNumber) : Ae("weekYear", s.weekYear);
}
function Bu(s) {
  const e = Nr(s.year), r = Ce(s.ordinal, 1, Bt(s.year));
  return e ? r ? !1 : Ae("ordinal", s.ordinal) : Ae("year", s.year);
}
function ta(s) {
  const e = Nr(s.year), r = Ce(s.month, 1, 12), i = Ce(s.day, 1, Ar(s.year, s.month));
  return e ? r ? i ? !1 : Ae("day", s.day) : Ae("month", s.month) : Ae("year", s.year);
}
function na(s) {
  const { hour: e, minute: r, second: i, millisecond: a } = s, c = Ce(e, 0, 23) || e === 24 && r === 0 && i === 0 && a === 0, h = Ce(r, 0, 59), m = Ce(i, 0, 59), v = Ce(a, 0, 999);
  return c ? h ? m ? v ? !1 : Ae("millisecond", a) : Ae("second", i) : Ae("minute", r) : Ae("hour", e);
}
function Z(s) {
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
function ra() {
  try {
    return typeof Intl < "u" && !!Intl.RelativeTimeFormat;
  } catch {
    return !1;
  }
}
function ia() {
  try {
    return typeof Intl < "u" && !!Intl.Locale && ("weekInfo" in Intl.Locale.prototype || "getWeekInfo" in Intl.Locale.prototype);
  } catch {
    return !1;
  }
}
function Gu(s) {
  return Array.isArray(s) ? s : [s];
}
function Qs(s, e, r) {
  if (s.length !== 0)
    return s.reduce((i, a) => {
      const c = [e(a), a];
      return i && r(i[0], c[0]) === i[0] ? i : c;
    }, null)[1];
}
function Ju(s, e) {
  return e.reduce((r, i) => (r[i] = s[i], r), {});
}
function Gt(s, e) {
  return Object.prototype.hasOwnProperty.call(s, e);
}
function Li(s) {
  if (s == null)
    return null;
  if (typeof s != "object")
    throw new ge("Week settings must be an object");
  if (!Ce(s.firstDay, 1, 7) || !Ce(s.minimalDays, 1, 7) || !Array.isArray(s.weekend) || s.weekend.some((e) => !Ce(e, 1, 7)))
    throw new ge("Invalid week settings");
  return {
    firstDay: s.firstDay,
    minimalDays: s.minimalDays,
    weekend: Array.from(s.weekend)
  };
}
function Ce(s, e, r) {
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
  if (!(Z(s) || s === null || s === ""))
    return parseInt(s, 10);
}
function _t(s) {
  if (!(Z(s) || s === null || s === ""))
    return parseFloat(s);
}
function Yi(s) {
  if (!(Z(s) || s === null || s === "")) {
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
function Bt(s) {
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
function eo(s, e, r) {
  return -Hi(Bi(s, 1, e), r) + e - 1;
}
function Dn(s, e = 4, r = 1) {
  const i = eo(s, e, r), a = eo(s + 1, e, r);
  return (Bt(s) - i + a) / 7;
}
function Ui(s) {
  return s > 99 ? s : s > ue.twoDigitCutoffYear ? 1900 + s : 2e3 + s;
}
function sa(s, e, r, i = null) {
  const a = new Date(s), c = {
    hourCycle: "h23",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit"
  };
  i && (c.timeZone = i);
  const h = { timeZoneName: e, ...c }, m = new Intl.DateTimeFormat(r, h).formatToParts(a).find((v) => v.type.toLowerCase() === "timezonename");
  return m ? m.value : null;
}
function Pr(s, e) {
  let r = parseInt(s, 10);
  Number.isNaN(r) && (r = 0);
  const i = parseInt(e, 10) || 0, a = r < 0 || Object.is(r, -0) ? -i : i;
  return r * 60 + a;
}
function oa(s) {
  const e = Number(s);
  if (typeof s == "boolean" || s === "" || Number.isNaN(e))
    throw new ge(`Invalid unit value ${s}`);
  return e;
}
function Cr(s, e) {
  const r = {};
  for (const i in s)
    if (Gt(s, i)) {
      const a = s[i];
      if (a == null) continue;
      r[e(i)] = oa(a);
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
], aa = [
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
function ua(s) {
  switch (s) {
    case "narrow":
      return [...el];
    case "short":
      return [...aa];
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
const la = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday"
], ca = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"], tl = ["M", "T", "W", "T", "F", "S", "S"];
function fa(s) {
  switch (s) {
    case "narrow":
      return [...tl];
    case "short":
      return [...ca];
    case "long":
      return [...la];
    case "numeric":
      return ["1", "2", "3", "4", "5", "6", "7"];
    default:
      return null;
  }
}
const ha = ["AM", "PM"], nl = ["Before Christ", "Anno Domini"], rl = ["BC", "AD"], il = ["B", "A"];
function da(s) {
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
  return ha[s.hour < 12 ? 0 : 1];
}
function ol(s, e) {
  return fa(e)[s.weekday - 1];
}
function al(s, e) {
  return ua(e)[s.month - 1];
}
function ul(s, e) {
  return da(e)[s.year < 0 ? 0 : 1];
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
  const h = Object.is(e, -0) || e < 0, m = Math.abs(e), v = m === 1, A = a[s], q = i ? v ? A[1] : A[2] || A[1] : v ? a[s][0] : s;
  return h ? `${m} ${q} ago` : `in ${m} ${q}`;
}
function to(s, e) {
  let r = "";
  for (const i of s)
    i.literal ? r += i.val : r += e(i.val);
  return r;
}
const cl = {
  D: Er,
  DD: Do,
  DDD: $o,
  DDDD: No,
  t: Mo,
  tt: Po,
  ttt: Fo,
  tttt: Ro,
  T: Vo,
  TT: qo,
  TTT: Lo,
  TTTT: Uo,
  f: jo,
  ff: Ko,
  fff: Zo,
  ffff: Ho,
  F: Wo,
  FF: zo,
  FFF: Bo,
  FFFF: Yo
};
class ve {
  static create(e, r = {}) {
    return new ve(e, r);
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
    const i = this.loc.listingMode() === "en", a = this.loc.outputCalendar && this.loc.outputCalendar !== "gregory", c = (j, ee) => this.loc.extract(e, j, ee), h = (j) => e.isOffsetFixed && e.offset === 0 && j.allowZ ? "Z" : e.isValid ? e.zone.formatOffset(e.ts, j.format) : "", m = () => i ? sl(e) : c({ hour: "numeric", hourCycle: "h12" }, "dayperiod"), v = (j, ee) => i ? al(e, j) : c(ee ? { month: j } : { month: j, day: "numeric" }, "month"), A = (j, ee) => i ? ol(e, j) : c(
      ee ? { weekday: j } : { weekday: j, month: "long", day: "numeric" },
      "weekday"
    ), q = (j) => {
      const ee = ve.macroTokenToFormatOpts(j);
      return ee ? this.formatWithSystemDefault(e, ee) : j;
    }, M = (j) => i ? ul(e, j) : c({ era: j }, "era"), z = (j) => {
      switch (j) {
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
          return v("short", !0);
        case "LLLL":
          return v("long", !0);
        case "LLLLL":
          return v("narrow", !0);
        case "M":
          return a ? c({ month: "numeric" }, "month") : this.num(e.month);
        case "MM":
          return a ? c({ month: "2-digit" }, "month") : this.num(e.month, 2);
        case "MMM":
          return v("short", !1);
        case "MMMM":
          return v("long", !1);
        case "MMMMM":
          return v("narrow", !1);
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
          return q(j);
      }
    };
    return to(ve.parseFormat(r), z);
  }
  formatDurationFromString(e, r) {
    const i = (v) => {
      switch (v[0]) {
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
    }, a = (v) => (A) => {
      const q = i(A);
      return q ? this.num(v.get(q), A.length) : A;
    }, c = ve.parseFormat(r), h = c.reduce(
      (v, { literal: A, val: q }) => A ? v : v.concat(q),
      []
    ), m = e.shiftTo(...h.map(i).filter((v) => v));
    return to(c, a(m));
  }
}
const ma = /[A-Za-z_+-]{1,256}(?::?\/[A-Za-z0-9_+-]{1,256}(?:\/[A-Za-z0-9_+-]{1,256})?)?/;
function en(...s) {
  const e = s.reduce((r, i) => r + i.source, "");
  return RegExp(`^${e}$`);
}
function tn(...s) {
  return (e) => s.reduce(
    ([r, i, a], c) => {
      const [h, m, v] = c(e, a);
      return [{ ...r, ...h }, m || i, v];
    },
    [{}, null, 1]
  ).slice(0, 2);
}
function nn(s, ...e) {
  if (s == null)
    return [null, null];
  for (const [r, i] of e) {
    const a = r.exec(s);
    if (a)
      return i(a);
  }
  return [null, null];
}
function pa(...s) {
  return (e, r) => {
    const i = {};
    let a;
    for (a = 0; a < s.length; a++)
      i[s[a]] = rt(e[r + a]);
    return [i, null, r + a];
  };
}
const ya = /(?:(Z)|([+-]\d\d)(?::?(\d\d))?)/, fl = `(?:${ya.source}?(?:\\[(${ma.source})\\])?)?`, Ji = /(\d\d)(?::?(\d\d)(?::?(\d\d)(?:[.,](\d{1,30}))?)?)?/, ga = RegExp(`${Ji.source}${fl}`), Xi = RegExp(`(?:T${ga.source})?`), hl = /([+-]\d{6}|\d{4})(?:-?(\d\d)(?:-?(\d\d))?)?/, dl = /(\d{4})-?W(\d\d)(?:-?(\d))?/, ml = /(\d{4})-?(\d{3})/, pl = pa("weekYear", "weekNumber", "weekDay"), yl = pa("year", "ordinal"), gl = /(\d{4})-(\d\d)-(\d\d)/, va = RegExp(
  `${Ji.source} ?(?:${ya.source}|(${ma.source}))?`
), vl = RegExp(`(?: ${va.source})?`);
function Ht(s, e, r) {
  const i = s[e];
  return Z(i) ? r : rt(i);
}
function bl(s, e) {
  return [{
    year: Ht(s, e),
    month: Ht(s, e + 1, 1),
    day: Ht(s, e + 2, 1)
  }, null, e + 3];
}
function rn(s, e) {
  return [{
    hours: Ht(s, e, 0),
    minutes: Ht(s, e + 1, 0),
    seconds: Ht(s, e + 2, 0),
    milliseconds: Yi(s[e + 3])
  }, null, e + 4];
}
function Rn(s, e) {
  const r = !s[e] && !s[e + 1], i = Pr(s[e + 1], s[e + 2]), a = r ? null : be.instance(i);
  return [{}, a, e + 3];
}
function Vn(s, e) {
  const r = s[e] ? Ue.create(s[e]) : null;
  return [{}, r, e + 1];
}
const wl = RegExp(`^T?${Ji.source}$`), kl = /^-?P(?:(?:(-?\d{1,20}(?:\.\d{1,20})?)Y)?(?:(-?\d{1,20}(?:\.\d{1,20})?)M)?(?:(-?\d{1,20}(?:\.\d{1,20})?)W)?(?:(-?\d{1,20}(?:\.\d{1,20})?)D)?(?:T(?:(-?\d{1,20}(?:\.\d{1,20})?)H)?(?:(-?\d{1,20}(?:\.\d{1,20})?)M)?(?:(-?\d{1,20})(?:[.,](-?\d{1,20}))?S)?)?)$/;
function _l(s) {
  const [e, r, i, a, c, h, m, v, A] = s, q = e[0] === "-", M = v && v[0] === "-", z = (j, ee = !1) => j !== void 0 && (ee || j && q) ? -j : j;
  return [
    {
      years: z(_t(r)),
      months: z(_t(i)),
      weeks: z(_t(a)),
      days: z(_t(c)),
      hours: z(_t(h)),
      minutes: z(_t(m)),
      seconds: z(_t(v), v === "-0"),
      milliseconds: z(Yi(A), M)
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
    month: aa.indexOf(r) + 1,
    day: rt(i),
    hour: rt(a),
    minute: rt(c)
  };
  return h && (m.second = rt(h)), s && (m.weekday = s.length > 3 ? la.indexOf(s) + 1 : ca.indexOf(s) + 1), m;
}
const xl = /^(?:(Mon|Tue|Wed|Thu|Fri|Sat|Sun),\s)?(\d{1,2})\s(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)\s(\d{2,4})\s(\d\d):(\d\d)(?::(\d\d))?\s(?:(UT|GMT|[ECMP][SD]T)|([Zz])|(?:([+-]\d\d)(\d\d)))$/;
function Tl(s) {
  const [
    ,
    e,
    r,
    i,
    a,
    c,
    h,
    m,
    v,
    A,
    q,
    M
  ] = s, z = Qi(e, a, i, r, c, h, m);
  let j;
  return v ? j = Sl[v] : A ? j = 0 : j = Pr(q, M), [z, new be(j)];
}
function Ol(s) {
  return s.replace(/\([^()]*\)|[\n\t]/g, " ").replace(/(\s\s+)/g, " ").trim();
}
const El = /^(Mon|Tue|Wed|Thu|Fri|Sat|Sun), (\d\d) (Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec) (\d{4}) (\d\d):(\d\d):(\d\d) GMT$/, Il = /^(Monday|Tuesday|Wednesday|Thursday|Friday|Saturday|Sunday), (\d\d)-(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)-(\d\d) (\d\d):(\d\d):(\d\d) GMT$/, Al = /^(Mon|Tue|Wed|Thu|Fri|Sat|Sun) (Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec) ( \d|\d\d) (\d\d):(\d\d):(\d\d) (\d{4})$/;
function no(s) {
  const [, e, r, i, a, c, h, m] = s;
  return [Qi(e, a, i, r, c, h, m), be.utcInstance];
}
function Cl(s) {
  const [, e, r, i, a, c, h, m] = s;
  return [Qi(e, m, r, i, a, c, h), be.utcInstance];
}
const Dl = en(hl, Xi), $l = en(dl, Xi), Nl = en(ml, Xi), Ml = en(ga), ba = tn(
  bl,
  rn,
  Rn,
  Vn
), Pl = tn(
  pl,
  rn,
  Rn,
  Vn
), Fl = tn(
  yl,
  rn,
  Rn,
  Vn
), Rl = tn(
  rn,
  Rn,
  Vn
);
function Vl(s) {
  return nn(
    s,
    [Dl, ba],
    [$l, Pl],
    [Nl, Fl],
    [Ml, Rl]
  );
}
function ql(s) {
  return nn(Ol(s), [xl, Tl]);
}
function Ll(s) {
  return nn(
    s,
    [El, no],
    [Il, no],
    [Al, Cl]
  );
}
function Ul(s) {
  return nn(s, [kl, _l]);
}
const jl = tn(rn);
function Wl(s) {
  return nn(s, [wl, jl]);
}
const Kl = en(gl, vl), zl = en(va), Zl = tn(
  rn,
  Rn,
  Vn
);
function Bl(s) {
  return nn(
    s,
    [Kl, ba],
    [zl, Zl]
  );
}
const ro = "Invalid Duration", wa = {
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
  ...wa
}, Ie = 146097 / 400, Lt = 146097 / 4800, Yl = {
  years: {
    quarters: 4,
    months: 12,
    weeks: Ie / 7,
    days: Ie,
    hours: Ie * 24,
    minutes: Ie * 24 * 60,
    seconds: Ie * 24 * 60 * 60,
    milliseconds: Ie * 24 * 60 * 60 * 1e3
  },
  quarters: {
    months: 3,
    weeks: Ie / 28,
    days: Ie / 4,
    hours: Ie * 24 / 4,
    minutes: Ie * 24 * 60 / 4,
    seconds: Ie * 24 * 60 * 60 / 4,
    milliseconds: Ie * 24 * 60 * 60 * 1e3 / 4
  },
  months: {
    weeks: Lt / 7,
    days: Lt,
    hours: Lt * 24,
    minutes: Lt * 24 * 60,
    seconds: Lt * 24 * 60 * 60,
    milliseconds: Lt * 24 * 60 * 60 * 1e3
  },
  ...wa
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
], Gl = Ot.slice(0).reverse();
function nt(s, e, r = !1) {
  const i = {
    values: r ? e.values : { ...s.values, ...e.values || {} },
    loc: s.loc.clone(e.loc),
    conversionAccuracy: e.conversionAccuracy || s.conversionAccuracy,
    matrix: e.matrix || s.matrix
  };
  return new X(i);
}
function ka(s, e) {
  let r = e.milliseconds ?? 0;
  for (const i of Gl.slice(1))
    e[i] && (r += e[i] * s[i].milliseconds);
  return r;
}
function io(s, e) {
  const r = ka(s, e) < 0 ? -1 : 1;
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
function Jl(s) {
  const e = {};
  for (const [r, i] of Object.entries(s))
    i !== 0 && (e[r] = i);
  return e;
}
class X {
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
    return X.fromObject({ milliseconds: e }, r);
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
      throw new ge(
        `Duration.fromObject: argument expected to be an object, got ${e === null ? "null" : typeof e}`
      );
    return new X({
      values: Cr(e, X.normalizeUnit),
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
      return X.fromMillis(e);
    if (X.isDuration(e))
      return e;
    if (typeof e == "object")
      return X.fromObject(e);
    throw new ge(
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
    return i ? X.fromObject(i, r) : X.invalid("unparsable", `the input "${e}" can't be parsed as ISO 8601`);
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
    return i ? X.fromObject(i, r) : X.invalid("unparsable", `the input "${e}" can't be parsed as ISO 8601`);
  }
  /**
   * Create an invalid Duration.
   * @param {string} reason - simple string of why this datetime is invalid. Should not contain parameters or anything else data-dependent
   * @param {string} [explanation=null] - longer explanation, may include parameters and other useful debugging information
   * @return {Duration}
   */
  static invalid(e, r = null) {
    if (!e)
      throw new ge("need to specify a reason the Duration is invalid");
    const i = e instanceof Pe ? e : new Pe(e, r);
    if (ue.throwOnInvalid)
      throw new _u(i);
    return new X({ invalid: i });
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
    if (!r) throw new Co(e);
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
    return this.isValid ? ve.create(this.loc, i).formatDurationFromString(this, e) : ro;
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
    if (!this.isValid) return ro;
    const r = Ot.map((i) => {
      const a = this.values[i];
      return Z(a) ? null : this.loc.numberFormatter({ style: "unit", unitDisplay: "long", ...e, unit: i.slice(0, -1) }).format(a);
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
    }, K.fromMillis(r, { zone: "UTC" }).toISOTime(e));
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
    return this.isValid ? ka(this.matrix, this.values) : NaN;
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
    const r = X.fromDurationLike(e), i = {};
    for (const a of Ot)
      (Gt(r.values, a) || Gt(this.values, a)) && (i[a] = r.get(a) + this.get(a));
    return nt(this, { values: i }, !0);
  }
  /**
   * Make this Duration shorter by the specified amount. Return a newly-constructed Duration.
   * @param {Duration|Object|number} duration - The amount to subtract. Either a Luxon Duration, a number of milliseconds, the object argument to Duration.fromObject()
   * @return {Duration}
   */
  minus(e) {
    if (!this.isValid) return this;
    const r = X.fromDurationLike(e);
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
      r[i] = oa(e(this.values[i], i));
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
    return this[X.normalizeUnit(e)];
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
    const r = { ...this.values, ...Cr(e, X.normalizeUnit) };
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
    return io(this.matrix, e), nt(this, { values: e }, !0);
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
    e = e.map((h) => X.normalizeUnit(h));
    const r = {}, i = {}, a = this.toObject();
    let c;
    for (const h of Ot)
      if (e.indexOf(h) >= 0) {
        c = h;
        let m = 0;
        for (const A in i)
          m += this.matrix[A][h] * i[A], i[A] = 0;
        at(a[h]) && (m += a[h]);
        const v = Math.trunc(m);
        r[h] = v, i[h] = (m * 1e3 - v * 1e3) / 1e3;
      } else at(a[h]) && (i[h] = a[h]);
    for (const h in i)
      i[h] !== 0 && (r[c] += h === c ? i[h] : i[h] / this.matrix[c][h]);
    return io(this.matrix, r), nt(this, { values: r }, !0);
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
    for (const i of Ot)
      if (!r(this.values[i], e.values[i]))
        return !1;
    return !0;
  }
}
const Ut = "Invalid Interval";
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
      throw new ge("need to specify a reason the Interval is invalid");
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
    const i = X.fromDurationLike(r), a = Sn(e);
    return ae.fromDateTimes(a, a.plus(i));
  }
  /**
   * Create an Interval from an end DateTime and a Duration to extend backwards to.
   * @param {DateTime|Date|Object} end
   * @param {Duration|Object|number} duration - the length of the Interval.
   * @return {Interval}
   */
  static before(e, r) {
    const i = X.fromDurationLike(r), a = Sn(e);
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
        c = K.fromISO(i, r), h = c.isValid;
      } catch {
        h = !1;
      }
      let m, v;
      try {
        m = K.fromISO(a, r), v = m.isValid;
      } catch {
        v = !1;
      }
      if (h && v)
        return ae.fromDateTimes(c, m);
      if (h) {
        const A = X.fromISO(a, r);
        if (A.isValid)
          return ae.after(c, A);
      } else if (v) {
        const A = X.fromISO(i, r);
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
    const r = X.fromDurationLike(e);
    if (!this.isValid || !r.isValid || r.as("milliseconds") === 0)
      return [];
    let { s: i } = this, a = 1, c;
    const h = [];
    for (; i < this.e; ) {
      const m = this.start.plus(r.mapUnits((v) => v * a));
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
    const a = [], c = e.map((v) => [
      { time: v.s, type: "s" },
      { time: v.e, type: "e" }
    ]), h = Array.prototype.concat(...c), m = h.sort((v, A) => v.time - A.time);
    for (const v of m)
      i += v.type === "s" ? 1 : -1, i === 1 ? r = v.time : (r && +r != +v.time && a.push(ae.fromDateTimes(r, v.time)), r = null);
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
    return this.isValid ? `[${this.s.toISO()} – ${this.e.toISO()})` : Ut;
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
    return this.isValid ? ve.create(this.s.loc.clone(r), e).formatInterval(this) : Ut;
  }
  /**
   * Returns an ISO 8601-compliant string representation of this Interval.
   * @see https://en.wikipedia.org/wiki/ISO_8601#Time_intervals
   * @param {Object} opts - The same options as {@link DateTime#toISO}
   * @return {string}
   */
  toISO(e) {
    return this.isValid ? `${this.s.toISO(e)}/${this.e.toISO(e)}` : Ut;
  }
  /**
   * Returns an ISO 8601-compliant string representation of date of this Interval.
   * The time components are ignored.
   * @see https://en.wikipedia.org/wiki/ISO_8601#Time_intervals
   * @return {string}
   */
  toISODate() {
    return this.isValid ? `${this.s.toISODate()}/${this.e.toISODate()}` : Ut;
  }
  /**
   * Returns an ISO 8601-compliant string representation of time of this Interval.
   * The date components are ignored.
   * @see https://en.wikipedia.org/wiki/ISO_8601#Time_intervals
   * @param {Object} opts - The same options as {@link DateTime#toISO}
   * @return {string}
   */
  toISOTime(e) {
    return this.isValid ? `${this.s.toISOTime(e)}/${this.e.toISOTime(e)}` : Ut;
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
    return this.isValid ? `${this.s.toFormat(e)}${r}${this.e.toFormat(e)}` : Ut;
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
    return this.isValid ? this.e.diff(this.s, e, r) : X.invalid(this.invalidReason);
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
    const r = K.now().setZone(e).set({ month: 12 });
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
    return { relative: ra(), localeWeek: ia() };
  }
}
function so(s, e) {
  const r = (a) => a.toUTC(0, { keepLocalTime: !0 }).startOf("day").valueOf(), i = r(e) - r(s);
  return Math.floor(X.fromMillis(i).as("days"));
}
function Ql(s, e, r) {
  const i = [
    ["years", (v, A) => A.year - v.year],
    ["quarters", (v, A) => A.quarter - v.quarter + (A.year - v.year) * 4],
    ["months", (v, A) => A.month - v.month + (A.year - v.year) * 12],
    [
      "weeks",
      (v, A) => {
        const q = so(v, A);
        return (q - q % 7) / 7;
      }
    ],
    ["days", so]
  ], a = {}, c = s;
  let h, m;
  for (const [v, A] of i)
    r.indexOf(v) >= 0 && (h = v, a[v] = A(s, e), m = c.plus(a), m > e ? (a[v]--, s = c.plus(a), s > e && (m = s, a[v]--, s = c.plus(a))) : s = m);
  return [s, a, m, h];
}
function ec(s, e, r, i) {
  let [a, c, h, m] = Ql(s, e, r);
  const v = e - a, A = r.filter(
    (M) => ["hours", "minutes", "seconds", "milliseconds"].indexOf(M) >= 0
  );
  A.length === 0 && (h < e && (h = a.plus({ [m]: 1 })), h !== a && (c[m] = (c[m] || 0) + v / (h - a)));
  const q = X.fromObject(c, i);
  return A.length > 0 ? X.fromMillis(v, i).shiftTo(...A).plus(q) : q;
}
const tc = "missing Intl.DateTimeFormat.formatToParts support";
function ne(s, e = (r) => r) {
  return { regex: s, deser: ([r]) => e(Ku(r)) };
}
const nc = " ", _a = `[ ${nc}]`, Sa = new RegExp(_a, "g");
function rc(s) {
  return s.replace(/\./g, "\\.?").replace(Sa, _a);
}
function oo(s) {
  return s.replace(/\./g, "").replace(Sa, " ").toLowerCase();
}
function Me(s, e) {
  return s === null ? null : {
    regex: RegExp(s.map(rc).join("|")),
    deser: ([r]) => s.findIndex((i) => oo(r) === oo(i)) + e
  };
}
function ao(s, e) {
  return { regex: s, deser: ([, r, i]) => Pr(r, i), groups: e };
}
function vr(s) {
  return { regex: s, deser: ([e]) => e };
}
function ic(s) {
  return s.replace(/[\-\[\]{}()*+?.,\\\^$|#\s]/g, "\\$&");
}
function sc(s, e) {
  const r = Ne(e), i = Ne(e, "{2}"), a = Ne(e, "{3}"), c = Ne(e, "{4}"), h = Ne(e, "{6}"), m = Ne(e, "{1,2}"), v = Ne(e, "{1,3}"), A = Ne(e, "{1,6}"), q = Ne(e, "{1,9}"), M = Ne(e, "{2,4}"), z = Ne(e, "{4,6}"), j = (Oe) => ({ regex: RegExp(ic(Oe.val)), deser: ([Ze]) => Ze, literal: !0 }), Se = ((Oe) => {
    if (s.literal)
      return j(Oe);
    switch (Oe.val) {
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
        return ne(z);
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
        return ne(v);
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
        return ne(v);
      case "SSS":
        return ne(a);
      case "u":
        return vr(q);
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
        return ao(new RegExp(`([+-]${m.source})(?::(${i.source}))?`), 2);
      case "ZZZ":
        return ao(new RegExp(`([+-]${m.source})(${i.source})?`), 2);
      case "z":
        return vr(/[a-z_+-/]{1,256}?/i);
      case " ":
        return vr(/[^\S\n\r]/);
      default:
        return j(Oe);
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
    const v = /^\s+$/.test(a);
    return {
      literal: !v,
      val: v ? " " : a
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
      if (Gt(r, h)) {
        const m = r[h], v = m.groups ? m.groups + 1 : 1;
        !m.literal && m.token && (a[m.token.val[0]] = m.deser(i.slice(c, c + v))), c += v;
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
  return Z(s.z) || (r = Ue.create(s.z)), Z(s.Z) || (r || (r = new be(s.Z)), i = s.Z), Z(s.q) || (s.M = (s.q - 1) * 3 + 1), Z(s.h) || (s.h < 12 && s.a === 1 ? s.h += 12 : s.h === 12 && s.a === 0 && (s.h = 0)), s.G === 0 && s.y && (s.y = -s.y), Z(s.u) || (s.S = Yi(s.u)), [Object.keys(s).reduce((c, h) => {
    const m = e(h);
    return m && (c[m] = s[h]), c;
  }, {}), r, i];
}
let Ei = null;
function fc() {
  return Ei || (Ei = K.fromMillis(1555555555555)), Ei;
}
function hc(s, e) {
  if (s.literal)
    return s;
  const r = ve.macroTokenToFormatOpts(s.val), i = Ea(r, e);
  return i == null || i.includes(void 0) ? s : i;
}
function xa(s, e) {
  return Array.prototype.concat(...s.map((r) => hc(r, e)));
}
class Ta {
  constructor(e, r) {
    if (this.locale = e, this.format = r, this.tokens = xa(ve.parseFormat(r), e), this.units = this.tokens.map((i) => sc(i, e)), this.disqualifyingUnit = this.units.find((i) => i.invalidReason), !this.disqualifyingUnit) {
      const [i, a] = uc(this.units);
      this.regex = RegExp(i, "i"), this.handlers = a;
    }
  }
  explainFromTokens(e) {
    if (this.isValid) {
      const [r, i] = lc(e, this.regex, this.handlers), [a, c, h] = i ? cc(i) : [null, null, void 0];
      if (Gt(i, "a") && Gt(i, "H"))
        throw new zt(
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
function Oa(s, e, r) {
  return new Ta(s, r).explainFromTokens(e);
}
function dc(s, e, r) {
  const { result: i, zone: a, specificOffset: c, invalidReason: h } = Oa(s, e, r);
  return [i, a, c, h];
}
function Ea(s, e) {
  if (!s)
    return null;
  const i = ve.create(e, s).dtFormatter(fc()), a = i.formatToParts(), c = i.resolvedOptions();
  return a.map((h) => ac(h, s, c));
}
const Ii = "Invalid DateTime", uo = 864e13;
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
function St(s, e) {
  const r = {
    ts: s.ts,
    zone: s.zone,
    c: s.c,
    o: s.o,
    loc: s.loc,
    invalid: s.invalid
  };
  return new K({ ...r, ...e, old: r });
}
function Ia(s, e, r) {
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
  return Ia(Mr(s), e, r);
}
function lo(s, e) {
  const r = s.o, i = s.c.year + Math.trunc(e.years), a = s.c.month + Math.trunc(e.months) + Math.trunc(e.quarters) * 3, c = {
    ...s.c,
    year: i,
    month: a,
    day: Math.min(s.c.day, Ar(i, a)) + Math.trunc(e.days) + Math.trunc(e.weeks) * 7
  }, h = X.fromObject({
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
  let [v, A] = Ia(m, r, s.zone);
  return h !== 0 && (v += h, A = s.zone.offset(v)), { ts: v, o: A };
}
function jt(s, e, r, i, a, c) {
  const { setZone: h, zone: m } = r;
  if (s && Object.keys(s).length !== 0 || e) {
    const v = e || m, A = K.fromObject(s, {
      ...r,
      zone: v,
      specificOffset: c
    });
    return h ? A : A.setZone(m);
  } else
    return K.invalid(
      new Pe("unparsable", `the input "${a}" can't be parsed as ${i}`)
    );
}
function wr(s, e, r = !0) {
  return s.isValid ? ve.create(re.create("en-US"), {
    allowZ: r,
    forceSimple: !0
  }).formatDateTimeFromString(s, e) : null;
}
function Di(s, e) {
  const r = s.c.year > 9999 || s.c.year < 0;
  let i = "";
  return r && s.c.year >= 0 && (i += "+"), i += fe(s.c.year, r ? 6 : 4), e ? (i += "-", i += fe(s.c.month), i += "-", i += fe(s.c.day)) : (i += fe(s.c.month), i += fe(s.c.day)), i;
}
function co(s, e, r, i, a, c) {
  let h = fe(s.c.hour);
  return e ? (h += ":", h += fe(s.c.minute), (s.c.millisecond !== 0 || s.c.second !== 0 || !r) && (h += ":")) : h += fe(s.c.minute), (s.c.millisecond !== 0 || s.c.second !== 0 || !r) && (h += fe(s.c.second), (s.c.millisecond !== 0 || !i) && (h += ".", h += fe(s.c.millisecond, 3))), a && (s.isOffsetFixed && s.offset === 0 && !c ? h += "Z" : s.o < 0 ? (h += "-", h += fe(Math.trunc(-s.o / 60)), h += ":", h += fe(Math.trunc(-s.o % 60))) : (h += "+", h += fe(Math.trunc(s.o / 60)), h += ":", h += fe(Math.trunc(s.o % 60)))), c && (h += "[" + s.zone.ianaName + "]"), h;
}
const Aa = {
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
}, Ca = ["year", "month", "day", "hour", "minute", "second", "millisecond"], yc = [
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
  if (!e) throw new Co(s);
  return e;
}
function fo(s) {
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
  return xr[s] || (Sr === void 0 && (Sr = ue.now()), xr[s] = s.offset(Sr)), xr[s];
}
function ho(s, e) {
  const r = it(e.zone, ue.defaultZone);
  if (!r.isValid)
    return K.invalid(En(r));
  const i = re.fromObject(e);
  let a, c;
  if (Z(s.year))
    a = ue.now();
  else {
    for (const v of Ca)
      Z(s[v]) && (s[v] = Aa[v]);
    const h = ta(s) || na(s);
    if (h)
      return K.invalid(h);
    const m = bc(r);
    [a, c] = _r(s, m, r);
  }
  return new K({ ts: a, zone: r, loc: i, o: c });
}
function mo(s, e, r) {
  const i = Z(r.round) ? !0 : r.round, a = (h, m) => (h = Gi(h, i || r.calendary ? 0 : 2, !0), e.loc.clone(r).relFormatter(r).format(h, m)), c = (h) => r.calendary ? e.hasSame(s, h) ? 0 : e.startOf(h).diff(s.startOf(h), h).get(h) : e.diff(s, h).get(h);
  if (r.unit)
    return a(c(r.unit), r.unit);
  for (const h of r.units) {
    const m = c(h);
    if (Math.abs(m) >= 1)
      return a(m, h);
  }
  return a(s > e ? -0 : 0, r.units[r.units.length - 1]);
}
function po(s) {
  let e = {}, r;
  return s.length > 0 && typeof s[s.length - 1] == "object" ? (e = s[s.length - 1], r = Array.from(s).slice(0, s.length - 1)) : r = Array.from(s), [e, r];
}
let Sr, xr = {};
class K {
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
    return new K({});
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
    const [e, r] = po(arguments), [i, a, c, h, m, v, A] = r;
    return ho({ year: i, month: a, day: c, hour: h, minute: m, second: v, millisecond: A }, e);
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
    const [e, r] = po(arguments), [i, a, c, h, m, v, A] = r;
    return e.zone = be.utcInstance, ho({ year: i, month: a, day: c, hour: h, minute: m, second: v, millisecond: A }, e);
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
      return K.invalid("invalid input");
    const a = it(r.zone, ue.defaultZone);
    return a.isValid ? new K({
      ts: i,
      zone: a,
      loc: re.fromObject(r)
    }) : K.invalid(En(a));
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
      return e < -uo || e > uo ? K.invalid("Timestamp out of range") : new K({
        ts: e,
        zone: it(r.zone, ue.defaultZone),
        loc: re.fromObject(r)
      });
    throw new ge(
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
      return new K({
        ts: e * 1e3,
        zone: it(r.zone, ue.defaultZone),
        loc: re.fromObject(r)
      });
    throw new ge("fromSeconds requires a numerical input");
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
      return K.invalid(En(i));
    const a = re.fromObject(r), c = Cr(e, fo), { minDaysInFirstWeek: h, startOfWeek: m } = Xs(c, a), v = ue.now(), A = Z(r.specificOffset) ? i.offset(v) : r.specificOffset, q = !Z(c.ordinal), M = !Z(c.year), z = !Z(c.month) || !Z(c.day), j = M || z, ee = c.weekYear || c.weekNumber;
    if ((j || q) && ee)
      throw new zt(
        "Can't mix weekYear/weekNumber units with year/month/day or ordinals"
      );
    if (z && q)
      throw new zt("Can't mix ordinal dates with month/day");
    const Se = ee || c.weekday && !j;
    let Oe, Ze, Re = br(v, A);
    Se ? (Oe = yc, Ze = mc, Re = Ir(Re, h, m)) : q ? (Oe = gc, Ze = pc, Re = Oi(Re)) : (Oe = Ca, Ze = Aa);
    let sn = !1;
    for (const Be of Oe) {
      const Un = c[Be];
      Z(Un) ? sn ? c[Be] = Ze[Be] : c[Be] = Re[Be] : sn = !0;
    }
    const lt = Se ? Zu(c, h, m) : q ? Bu(c) : ta(c), on = lt || na(c);
    if (on)
      return K.invalid(on);
    const De = Se ? Gs(c, h, m) : q ? Js(c) : c, [we, Ln] = _r(De, A, i), ct = new K({
      ts: we,
      zone: i,
      o: Ln,
      loc: a
    });
    return c.weekday && j && e.weekday !== ct.weekday ? K.invalid(
      "mismatched weekday",
      `you can't specify both a weekday of ${c.weekday} and a date of ${ct.toISO()}`
    ) : ct.isValid ? ct : K.invalid(ct.invalid);
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
    return jt(i, a, r, "ISO 8601", e);
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
    return jt(i, a, r, "RFC 2822", e);
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
    return jt(i, a, r, "HTTP", r);
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
      throw new ge("fromFormat requires an input string and a format");
    const { locale: a = null, numberingSystem: c = null } = i, h = re.fromOpts({
      locale: a,
      numberingSystem: c,
      defaultToEN: !0
    }), [m, v, A, q] = dc(h, e, r);
    return q ? K.invalid(q) : jt(m, v, i, `format ${r}`, e, A);
  }
  /**
   * @deprecated use fromFormat instead
   */
  static fromString(e, r, i = {}) {
    return K.fromFormat(e, r, i);
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
    return jt(i, a, r, "SQL", e);
  }
  /**
   * Create an invalid DateTime.
   * @param {string} reason - simple string of why this DateTime is invalid. Should not contain parameters or anything else data-dependent.
   * @param {string} [explanation=null] - longer explanation, may include parameters and other useful debugging information
   * @return {DateTime}
   */
  static invalid(e, r = null) {
    if (!e)
      throw new ge("need to specify a reason the DateTime is invalid");
    const i = e instanceof Pe ? e : new Pe(e, r);
    if (ue.throwOnInvalid)
      throw new wu(i);
    return new K({ invalid: i });
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
    const i = Ea(e, re.fromObject(r));
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
    return xa(ve.parseFormat(e), re.fromObject(r)).map((a) => a.val).join("");
  }
  static resetCache() {
    Sr = void 0, xr = {};
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
    const v = i - h * r, A = i - m * r, q = br(v, h), M = br(A, m);
    return q.hour === M.hour && q.minute === M.minute && q.second === M.second && q.millisecond === M.millisecond ? [St(this, { ts: v }), St(this, { ts: A })] : [this];
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
    return this.isValid ? Bt(this.year) : NaN;
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
    const { locale: r, numberingSystem: i, calendar: a } = ve.create(
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
    return this.setZone(be.instance(e), r);
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
      return St(this, { ts: a, zone: e });
    } else
      return K.invalid(En(e));
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
    const r = Cr(e, fo), { minDaysInFirstWeek: i, startOfWeek: a } = Xs(r, this.loc), c = !Z(r.weekYear) || !Z(r.weekNumber) || !Z(r.weekday), h = !Z(r.ordinal), m = !Z(r.year), v = !Z(r.month) || !Z(r.day), A = m || v, q = r.weekYear || r.weekNumber;
    if ((A || h) && q)
      throw new zt(
        "Can't mix weekYear/weekNumber units with year/month/day or ordinals"
      );
    if (v && h)
      throw new zt("Can't mix ordinal dates with month/day");
    let M;
    c ? M = Gs(
      { ...Ir(this.c, i, a), ...r },
      i,
      a
    ) : Z(r.ordinal) ? (M = { ...this.toObject(), ...r }, Z(r.day) && (M.day = Math.min(Ar(M.year, M.month), M.day))) : M = Js({ ...Oi(this.c), ...r });
    const [z, j] = _r(M, this.o, this.zone);
    return St(this, { ts: z, o: j });
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
    const r = X.fromDurationLike(e);
    return St(this, lo(this, r));
  }
  /**
   * Subtract a period of time to this DateTime and return the resulting DateTime
   * See {@link DateTime#plus}
   * @param {Duration|Object|number} duration - The amount to subtract. Either a Luxon Duration, a number of milliseconds, the object argument to Duration.fromObject()
   @return {DateTime}
   */
  minus(e) {
    if (!this.isValid) return this;
    const r = X.fromDurationLike(e).negate();
    return St(this, lo(this, r));
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
    const i = {}, a = X.normalizeUnit(e);
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
    return this.isValid ? ve.create(this.loc.redefaultToEN(r)).formatDateTimeFromString(this, e) : Ii;
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
    return this.isValid ? ve.create(this.loc.clone(r), e).formatDateTime(this) : Ii;
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
    return this.isValid ? ve.create(this.loc.clone(e), e).formatDateTimeParts(this) : [];
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
    return m += "T", m += co(this, h, r, i, a, c), m;
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
    return this.isValid ? (a ? "T" : "") + co(
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
      return X.invalid("created by diffing an invalid DateTime");
    const a = { locale: this.locale, numberingSystem: this.numberingSystem, ...i }, c = Gu(r).map(X.normalizeUnit), h = e.valueOf() > this.valueOf(), m = h ? this : e, v = h ? e : this, A = ec(m, v, c, a);
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
    return this.diff(K.now(), e, r);
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
    const r = e.base || K.fromObject({}, { zone: this.zone }), i = e.padding ? this < r ? -e.padding : e.padding : 0;
    let a = ["years", "months", "days", "hours", "minutes", "seconds"], c = e.unit;
    return Array.isArray(e.unit) && (a = e.unit, c = void 0), mo(r, this.plus(i), {
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
    return this.isValid ? mo(e.base || K.fromObject({}, { zone: this.zone }), this, {
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
    if (!e.every(K.isDateTime))
      throw new ge("min requires all arguments be DateTimes");
    return Qs(e, (r) => r.valueOf(), Math.min);
  }
  /**
   * Return the max of several date times
   * @param {...DateTime} dateTimes - the DateTimes from which to choose the maximum
   * @return {DateTime} the max DateTime, or undefined if called with no argument
   */
  static max(...e) {
    if (!e.every(K.isDateTime))
      throw new ge("max requires all arguments be DateTimes");
    return Qs(e, (r) => r.valueOf(), Math.max);
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
    return Oa(h, e, r);
  }
  /**
   * @deprecated use fromFormatExplain instead
   */
  static fromStringExplain(e, r, i = {}) {
    return K.fromFormatExplain(e, r, i);
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
    return new Ta(c, e);
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
      throw new ge(
        "fromFormatParser requires an input string and a format parser"
      );
    const { locale: a = null, numberingSystem: c = null } = i, h = re.fromOpts({
      locale: a,
      numberingSystem: c,
      defaultToEN: !0
    });
    if (!h.equals(r.locale))
      throw new ge(
        `fromFormatParser called with a locale of ${h}, but the format parser was created for ${r.locale}`
      );
    const { result: m, zone: v, specificOffset: A, invalidReason: q } = r.explainFromTokens(e);
    return q ? K.invalid(q) : jt(
      m,
      v,
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
    return Do;
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
    return $o;
  }
  /**
   * {@link DateTime#toLocaleString} format like 'Tuesday, October 14, 1983'
   * @type {Object}
   */
  static get DATE_HUGE() {
    return No;
  }
  /**
   * {@link DateTime#toLocaleString} format like '09:30 AM'. Only 12-hour if the locale is.
   * @type {Object}
   */
  static get TIME_SIMPLE() {
    return Mo;
  }
  /**
   * {@link DateTime#toLocaleString} format like '09:30:23 AM'. Only 12-hour if the locale is.
   * @type {Object}
   */
  static get TIME_WITH_SECONDS() {
    return Po;
  }
  /**
   * {@link DateTime#toLocaleString} format like '09:30:23 AM EDT'. Only 12-hour if the locale is.
   * @type {Object}
   */
  static get TIME_WITH_SHORT_OFFSET() {
    return Fo;
  }
  /**
   * {@link DateTime#toLocaleString} format like '09:30:23 AM Eastern Daylight Time'. Only 12-hour if the locale is.
   * @type {Object}
   */
  static get TIME_WITH_LONG_OFFSET() {
    return Ro;
  }
  /**
   * {@link DateTime#toLocaleString} format like '09:30', always 24-hour.
   * @type {Object}
   */
  static get TIME_24_SIMPLE() {
    return Vo;
  }
  /**
   * {@link DateTime#toLocaleString} format like '09:30:23', always 24-hour.
   * @type {Object}
   */
  static get TIME_24_WITH_SECONDS() {
    return qo;
  }
  /**
   * {@link DateTime#toLocaleString} format like '09:30:23 EDT', always 24-hour.
   * @type {Object}
   */
  static get TIME_24_WITH_SHORT_OFFSET() {
    return Lo;
  }
  /**
   * {@link DateTime#toLocaleString} format like '09:30:23 Eastern Daylight Time', always 24-hour.
   * @type {Object}
   */
  static get TIME_24_WITH_LONG_OFFSET() {
    return Uo;
  }
  /**
   * {@link DateTime#toLocaleString} format like '10/14/1983, 9:30 AM'. Only 12-hour if the locale is.
   * @type {Object}
   */
  static get DATETIME_SHORT() {
    return jo;
  }
  /**
   * {@link DateTime#toLocaleString} format like '10/14/1983, 9:30:33 AM'. Only 12-hour if the locale is.
   * @type {Object}
   */
  static get DATETIME_SHORT_WITH_SECONDS() {
    return Wo;
  }
  /**
   * {@link DateTime#toLocaleString} format like 'Oct 14, 1983, 9:30 AM'. Only 12-hour if the locale is.
   * @type {Object}
   */
  static get DATETIME_MED() {
    return Ko;
  }
  /**
   * {@link DateTime#toLocaleString} format like 'Oct 14, 1983, 9:30:33 AM'. Only 12-hour if the locale is.
   * @type {Object}
   */
  static get DATETIME_MED_WITH_SECONDS() {
    return zo;
  }
  /**
   * {@link DateTime#toLocaleString} format like 'Fri, 14 Oct 1983, 9:30 AM'. Only 12-hour if the locale is.
   * @type {Object}
   */
  static get DATETIME_MED_WITH_WEEKDAY() {
    return xu;
  }
  /**
   * {@link DateTime#toLocaleString} format like 'October 14, 1983, 9:30 AM EDT'. Only 12-hour if the locale is.
   * @type {Object}
   */
  static get DATETIME_FULL() {
    return Zo;
  }
  /**
   * {@link DateTime#toLocaleString} format like 'October 14, 1983, 9:30:33 AM EDT'. Only 12-hour if the locale is.
   * @type {Object}
   */
  static get DATETIME_FULL_WITH_SECONDS() {
    return Bo;
  }
  /**
   * {@link DateTime#toLocaleString} format like 'Friday, October 14, 1983, 9:30 AM Eastern Daylight Time'. Only 12-hour if the locale is.
   * @type {Object}
   */
  static get DATETIME_HUGE() {
    return Ho;
  }
  /**
   * {@link DateTime#toLocaleString} format like 'Friday, October 14, 1983, 9:30:33 AM Eastern Daylight Time'. Only 12-hour if the locale is.
   * @type {Object}
   */
  static get DATETIME_HUGE_WITH_SECONDS() {
    return Yo;
  }
}
function Sn(s) {
  if (K.isDateTime(s))
    return s;
  if (s && s.valueOf && at(s.valueOf()))
    return K.fromJSDate(s);
  if (s && typeof s == "object")
    return K.fromObject(s);
  throw new ge(
    `Unknown datetime argument: ${s}, of type ${typeof s}`
  );
}
const wc = "3.5.0", Gc = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  DateTime: K,
  Duration: X,
  FixedOffsetZone: be,
  IANAZone: Ue,
  Info: On,
  Interval: ae,
  InvalidZone: Go,
  Settings: ue,
  SystemZone: Pn,
  VERSION: wc,
  Zone: Qt
}, Symbol.toStringTag, { value: "Module" }));
class Tr extends Error {
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
    return r ? a + " " + e.toLocaleString(K.TIME_WITH_SECONDS) : a;
  }
  /**
   * returns a TimeZoneInfo object with id, ianaName and fullName of the
   * active user time zone (derived from the cookies kiosk_tz...)
   */
  static getActiveUserTimeZone() {
    return {
      id: parseInt(Tt("kiosk_tz_index")),
      ianaName: Tt("kiosk_iana_time_zone"),
      fullName: Tt("kiosk_tz_name")
    };
  }
  /**
   * returns a TimeZoneInfo object with id, ianaName and fullName of the
   * active recording time zone.
   * The active recording time zone is derived from the kiosk_recording_tz_... cookies.
   */
  static getActiveRecordingTimeZone() {
    return {
      id: parseInt(Tt("kiosk_recording_tz_index")),
      ianaName: Tt("kiosk_recording_iana_time_zone"),
      fullName: Tt("kiosk_recording_tz_name")
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
        let c = K.fromISO(a, { zone: "UTC" }), h = document.getElementById(e + "-tz").value, m = "-";
        r ? m = h : h != "-" && (m = Zt.getActiveUserTimeZone().ianaName), m !== "-" && m !== "UTC" && (c = c.setZone(m)), i.value = this.getLatinDate(c);
      }
    }
  }
  async initKioskDateTimeSpan(e, r = !0, i = !0) {
    var c;
    let a = (c = e.textContent) == null ? void 0 : c.trim();
    if (a) {
      let h = K.fromISO(a, { zone: "UTC" }), m, v;
      if (e.dataset.tzIndex != null && this.timeZones) {
        let z = await this.timeZones.getTimeZoneByIndex(Number(e.dataset.tzIndex));
        z && z.tz_IANA && (m = z.tz_IANA), v = z && z.tz_long ? z.tz_long : m;
      }
      m || (m = e.dataset.recordingIanaTz), m && m !== "UTC" && m !== "-" && (h = h.setZone(m));
      const A = i ? this.getLatinDate(h) : h.toLocaleString(), q = v ? ` (${v})` : " (legacy)", M = r ? q : "";
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
      let v = c.value;
      if (v && v.trim()) {
        const A = a ? Zt.getActiveRecordingTimeZone().ianaName : Zt.getActiveUserTimeZone().ianaName, q = new Zt();
        try {
          if (h = (m = q.guessDateTime(v, !1, A)) == null ? void 0 : m.toISO({
            includeOffset: !1,
            suppressMilliseconds: !0
          }), !h)
            throw Error("date/time value not understood.");
        } catch (M) {
          throw r && c.classList.add(r), M instanceof Tr && i && c.focus(), M;
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
    const a = K.fromISO(e, { zone: "utc" });
    if (a.isValid) return a;
    let [c, h] = this.splitDateAndTime(e);
    if (!h && !r)
      throw new Tr(`${e} has no time.`);
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
    if (c && (h ? M = K.fromISO(c + "T" + h, { zone: i, setZone: !0 }).toUTC() : M = K.fromISO(c, { zone: i, setZone: !0 }).toUTC(), !M.isValid))
      throw new Tr(`${e} is not a valid date`);
    return M;
  }
}
const Jc = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  KioskDateTime: Zt,
  KioskDateTimeError: Tr
}, Symbol.toStringTag, { value: "Module" })), Da = 2, ji = 3;
/**
 * @license
 * Copyright 2019 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const Or = globalThis, es = Or.ShadowRoot && (Or.ShadyCSS === void 0 || Or.ShadyCSS.nativeShadow) && "adoptedStyleSheets" in Document.prototype && "replace" in CSSStyleSheet.prototype, $a = Symbol(), yo = /* @__PURE__ */ new WeakMap();
let kc = class {
  constructor(e, r, i) {
    if (this._$cssResult$ = !0, i !== $a) throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");
    this.cssText = e, this.t = r;
  }
  get styleSheet() {
    let e = this.o;
    const r = this.t;
    if (es && e === void 0) {
      const i = r !== void 0 && r.length === 1;
      i && (e = yo.get(r)), e === void 0 && ((this.o = e = new CSSStyleSheet()).replaceSync(this.cssText), i && yo.set(r, e));
    }
    return e;
  }
  toString() {
    return this.cssText;
  }
};
const _c = (s) => new kc(typeof s == "string" ? s : s + "", void 0, $a), Sc = (s, e) => {
  if (es) s.adoptedStyleSheets = e.map((r) => r instanceof CSSStyleSheet ? r : r.styleSheet);
  else for (const r of e) {
    const i = document.createElement("style"), a = Or.litNonce;
    a !== void 0 && i.setAttribute("nonce", a), i.textContent = r.cssText, s.appendChild(i);
  }
}, go = es ? (s) => s : (s) => s instanceof CSSStyleSheet ? ((e) => {
  let r = "";
  for (const i of e.cssRules) r += i.cssText;
  return _c(r);
})(s) : s;
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const { is: xc, defineProperty: Tc, getOwnPropertyDescriptor: Oc, getOwnPropertyNames: Ec, getOwnPropertySymbols: Ic, getPrototypeOf: Ac } = Object, ut = globalThis, vo = ut.trustedTypes, Cc = vo ? vo.emptyScript : "", $i = ut.reactiveElementPolyfillSupport, An = (s, e) => s, Dr = { toAttribute(s, e) {
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
} }, ts = (s, e) => !xc(s, e), bo = { attribute: !0, type: String, converter: Dr, reflect: !1, hasChanged: ts };
Symbol.metadata ?? (Symbol.metadata = Symbol("metadata")), ut.litPropertyMetadata ?? (ut.litPropertyMetadata = /* @__PURE__ */ new WeakMap());
class Kt extends HTMLElement {
  static addInitializer(e) {
    this._$Ei(), (this.l ?? (this.l = [])).push(e);
  }
  static get observedAttributes() {
    return this.finalize(), this._$Eh && [...this._$Eh.keys()];
  }
  static createProperty(e, r = bo) {
    if (r.state && (r.attribute = !1), this._$Ei(), this.elementProperties.set(e, r), !r.noAccessor) {
      const i = Symbol(), a = this.getPropertyDescriptor(e, i, r);
      a !== void 0 && Tc(this.prototype, e, a);
    }
  }
  static getPropertyDescriptor(e, r, i) {
    const { get: a, set: c } = Oc(this.prototype, e) ?? { get() {
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
    return this.elementProperties.get(e) ?? bo;
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
      for (const a of i) r.unshift(go(a));
    } else e !== void 0 && r.push(go(e));
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
Kt.elementStyles = [], Kt.shadowRootOptions = { mode: "open" }, Kt[An("elementProperties")] = /* @__PURE__ */ new Map(), Kt[An("finalized")] = /* @__PURE__ */ new Map(), $i == null || $i({ ReactiveElement: Kt }), (ut.reactiveElementVersions ?? (ut.reactiveElementVersions = [])).push("2.0.4");
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const Cn = globalThis, $r = Cn.trustedTypes, wo = $r ? $r.createPolicy("lit-html", { createHTML: (s) => s }) : void 0, Na = "$lit$", st = `lit$${(Math.random() + "").slice(9)}$`, Ma = "?" + st, Dc = `<${Ma}>`, It = document, $n = () => It.createComment(""), Nn = (s) => s === null || typeof s != "object" && typeof s != "function", Pa = Array.isArray, $c = (s) => Pa(s) || typeof (s == null ? void 0 : s[Symbol.iterator]) == "function", Ni = `[ 	
\f\r]`, xn = /<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g, ko = /-->/g, _o = />/g, xt = RegExp(`>|${Ni}(?:([^\\s"'>=/]+)(${Ni}*=${Ni}*(?:[^ 	
\f\r"'\`<>=]|("|')|))|$)`, "g"), So = /'/g, xo = /"/g, Fa = /^(?:script|style|textarea|title)$/i, Nc = (s) => (e, ...r) => ({ _$litType$: s, strings: e, values: r }), ot = Nc(1), Jt = Symbol.for("lit-noChange"), he = Symbol.for("lit-nothing"), To = /* @__PURE__ */ new WeakMap(), Et = It.createTreeWalker(It, 129);
function Ra(s, e) {
  if (!Array.isArray(s) || !s.hasOwnProperty("raw")) throw Error("invalid template strings array");
  return wo !== void 0 ? wo.createHTML(e) : e;
}
const Mc = (s, e) => {
  const r = s.length - 1, i = [];
  let a, c = e === 2 ? "<svg>" : "", h = xn;
  for (let m = 0; m < r; m++) {
    const v = s[m];
    let A, q, M = -1, z = 0;
    for (; z < v.length && (h.lastIndex = z, q = h.exec(v), q !== null); ) z = h.lastIndex, h === xn ? q[1] === "!--" ? h = ko : q[1] !== void 0 ? h = _o : q[2] !== void 0 ? (Fa.test(q[2]) && (a = RegExp("</" + q[2], "g")), h = xt) : q[3] !== void 0 && (h = xt) : h === xt ? q[0] === ">" ? (h = a ?? xn, M = -1) : q[1] === void 0 ? M = -2 : (M = h.lastIndex - q[2].length, A = q[1], h = q[3] === void 0 ? xt : q[3] === '"' ? xo : So) : h === xo || h === So ? h = xt : h === ko || h === _o ? h = xn : (h = xt, a = void 0);
    const j = h === xt && s[m + 1].startsWith("/>") ? " " : "";
    c += h === xn ? v + Dc : M >= 0 ? (i.push(A), v.slice(0, M) + Na + v.slice(M) + st + j) : v + st + (M === -2 ? m : j);
  }
  return [Ra(s, c + (s[r] || "<?>") + (e === 2 ? "</svg>" : "")), i];
};
class Mn {
  constructor({ strings: e, _$litType$: r }, i) {
    let a;
    this.parts = [];
    let c = 0, h = 0;
    const m = e.length - 1, v = this.parts, [A, q] = Mc(e, r);
    if (this.el = Mn.createElement(A, i), Et.currentNode = this.el.content, r === 2) {
      const M = this.el.content.firstChild;
      M.replaceWith(...M.childNodes);
    }
    for (; (a = Et.nextNode()) !== null && v.length < m; ) {
      if (a.nodeType === 1) {
        if (a.hasAttributes()) for (const M of a.getAttributeNames()) if (M.endsWith(Na)) {
          const z = q[h++], j = a.getAttribute(M).split(st), ee = /([.?@])?(.*)/.exec(z);
          v.push({ type: 1, index: c, name: ee[2], strings: j, ctor: ee[1] === "." ? Fc : ee[1] === "?" ? Rc : ee[1] === "@" ? Vc : Rr }), a.removeAttribute(M);
        } else M.startsWith(st) && (v.push({ type: 6, index: c }), a.removeAttribute(M));
        if (Fa.test(a.tagName)) {
          const M = a.textContent.split(st), z = M.length - 1;
          if (z > 0) {
            a.textContent = $r ? $r.emptyScript : "";
            for (let j = 0; j < z; j++) a.append(M[j], $n()), Et.nextNode(), v.push({ type: 2, index: ++c });
            a.append(M[z], $n());
          }
        }
      } else if (a.nodeType === 8) if (a.data === Ma) v.push({ type: 2, index: c });
      else {
        let M = -1;
        for (; (M = a.data.indexOf(st, M + 1)) !== -1; ) v.push({ type: 7, index: c }), M += st.length - 1;
      }
      c++;
    }
  }
  static createElement(e, r) {
    const i = It.createElement("template");
    return i.innerHTML = e, i;
  }
}
function Xt(s, e, r = s, i) {
  var h, m;
  if (e === Jt) return e;
  let a = i !== void 0 ? (h = r._$Co) == null ? void 0 : h[i] : r._$Cl;
  const c = Nn(e) ? void 0 : e._$litDirective$;
  return (a == null ? void 0 : a.constructor) !== c && ((m = a == null ? void 0 : a._$AO) == null || m.call(a, !1), c === void 0 ? a = void 0 : (a = new c(s), a._$AT(s, r, i)), i !== void 0 ? (r._$Co ?? (r._$Co = []))[i] = a : r._$Cl = a), a !== void 0 && (e = Xt(s, a._$AS(s, e.values), a, i)), e;
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
    const { el: { content: r }, parts: i } = this._$AD, a = ((e == null ? void 0 : e.creationScope) ?? It).importNode(r, !0);
    Et.currentNode = a;
    let c = Et.nextNode(), h = 0, m = 0, v = i[0];
    for (; v !== void 0; ) {
      if (h === v.index) {
        let A;
        v.type === 2 ? A = new qn(c, c.nextSibling, this, e) : v.type === 1 ? A = new v.ctor(c, v.name, v.strings, this, e) : v.type === 6 && (A = new qc(c, this, e)), this._$AV.push(A), v = i[++m];
      }
      h !== (v == null ? void 0 : v.index) && (c = Et.nextNode(), h++);
    }
    return Et.currentNode = It, a;
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
    e = Xt(this, e, r), Nn(e) ? e === he || e == null || e === "" ? (this._$AH !== he && this._$AR(), this._$AH = he) : e !== this._$AH && e !== Jt && this._(e) : e._$litType$ !== void 0 ? this.$(e) : e.nodeType !== void 0 ? this.T(e) : $c(e) ? this.k(e) : this._(e);
  }
  S(e) {
    return this._$AA.parentNode.insertBefore(e, this._$AB);
  }
  T(e) {
    this._$AH !== e && (this._$AR(), this._$AH = this.S(e));
  }
  _(e) {
    this._$AH !== he && Nn(this._$AH) ? this._$AA.nextSibling.data = e : this.T(It.createTextNode(e)), this._$AH = e;
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
    let r = To.get(e.strings);
    return r === void 0 && To.set(e.strings, r = new Mn(e)), r;
  }
  k(e) {
    Pa(this._$AH) || (this._$AH = [], this._$AR());
    const r = this._$AH;
    let i, a = 0;
    for (const c of e) a === r.length ? r.push(i = new qn(this.S($n()), this.S($n()), this, this.options)) : i = r[a], i._$AI(c), a++;
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
    if (c === void 0) e = Xt(this, e, r, 0), h = !Nn(e) || e !== this._$AH && e !== Jt, h && (this._$AH = e);
    else {
      const m = e;
      let v, A;
      for (e = c[0], v = 0; v < c.length - 1; v++) A = Xt(this, m[i + v], r, v), A === Jt && (A = this._$AH[v]), h || (h = !Nn(A) || A !== this._$AH[v]), A === he ? e = he : e !== he && (e += (A ?? "") + c[v + 1]), this._$AH[v] = A;
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
    if ((e = Xt(this, e, r, 0) ?? he) === Jt) return;
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
    Xt(this, e);
  }
}
const Mi = Cn.litHtmlPolyfillSupport;
Mi == null || Mi(Mn, qn), (Cn.litHtmlVersions ?? (Cn.litHtmlVersions = [])).push("3.1.2");
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
class Yt extends Kt {
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
    return Jt;
  }
}
var Ao;
Yt._$litElement$ = !0, Yt.finalized = !0, (Ao = globalThis.litElementHydrateSupport) == null || Ao.call(globalThis, { LitElement: Yt });
const Pi = globalThis.litElementPolyfillSupport;
Pi == null || Pi({ LitElement: Yt });
(globalThis.litElementVersions ?? (globalThis.litElementVersions = [])).push("4.0.4");
const ns = class ns extends Yt {
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
    return this.apiContext && this.apiContext.status === Da ? e = this.apiRender() : this.apiContext && this.apiContext.status === ji ? e = this.renderApiError() : e = this.renderNoContextYet(), ot`
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
ns.properties = {
  /**
   * The Api Context
   */
  apiContext: { type: Object },
  appErrors: { type: Array },
  showProgress: { type: Boolean }
};
let Oo = ns;
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
      const v = e.get.call(this);
      e.set.call(this, m), this.requestUpdate(h, v, s);
    }, init(m) {
      return m !== void 0 && this.P(h, void 0, s), m;
    } };
  }
  if (i === "setter") {
    const { name: h } = r;
    return function(m) {
      const v = this[h];
      e.call(this, m), this.requestUpdate(h, v, s);
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
const rs = class rs extends Yt {
  constructor() {
    super(), this.kiosk_base_url = "/", this.showProgress = !1, this.apiContext = void 0;
  }
  updated(e) {
    e.has("apiContext") && (this.showProgress = !1);
  }
  render() {
    let e;
    return this.apiContext && this.apiContext.status === Da ? e = this.apiRender() : this.apiContext && this.apiContext.status === ji ? e = this.renderApiError() : e = this.renderNoContextYet(), ot`
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
rs.properties = {
  /**
   * The Api Context
   */
  apiContext: { type: Object }
};
let Wi = rs;
Zc([
  Kc()
], Wi.prototype, "showProgress");
var Eo = typeof globalThis < "u" ? globalThis : typeof window < "u" ? window : typeof global < "u" ? global : typeof self < "u" ? self : {};
function Bc(s) {
  return s && s.__esModule && Object.prototype.hasOwnProperty.call(s, "default") ? s.default : s;
}
var Va = { exports: {} };
(function(s, e) {
  (function(r, i) {
    s.exports = i();
  })(Eo, function() {
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
    var c = typeof globalThis < "u" ? globalThis : typeof self < "u" ? self : typeof window < "u" ? window : Eo, h = Object.keys, m = Array.isArray;
    function v(t, n) {
      return typeof n != "object" || h(n).forEach(function(o) {
        t[o] = n[o];
      }), t;
    }
    typeof Promise > "u" || c.Promise || (c.Promise = Promise);
    var A = Object.getPrototypeOf, q = {}.hasOwnProperty;
    function M(t, n) {
      return q.call(t, n);
    }
    function z(t, n) {
      typeof n == "function" && (n = n(A(t))), (typeof Reflect > "u" ? h : Reflect.ownKeys)(n).forEach(function(o) {
        ee(t, o, n[o]);
      });
    }
    var j = Object.defineProperty;
    function ee(t, n, o, u) {
      j(t, n, v(o && M(o, "get") && typeof o.get == "function" ? { get: o.get, set: o.set, configurable: !0 } : { value: o, configurable: !0, writable: !0 }, u));
    }
    function Se(t) {
      return { from: function(n) {
        return t.prototype = Object.create(n.prototype), ee(t.prototype, "constructor", t), { extend: z.bind(null, t.prototype) };
      } };
    }
    var Oe = Object.getOwnPropertyDescriptor, Ze = [].slice;
    function Re(t, n, o) {
      return Ze.call(t, n, o);
    }
    function sn(t, n) {
      return n(t);
    }
    function lt(t) {
      if (!t) throw new Error("Assertion Failed");
    }
    function on(t) {
      c.setImmediate ? setImmediate(t) : setTimeout(t, 0);
    }
    function De(t, n) {
      if (typeof n == "string" && M(t, n)) return t[n];
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
    function we(t, n, o) {
      if (t && n !== void 0 && !("isFrozen" in Object && Object.isFrozen(t))) if (typeof n != "string" && "length" in n) {
        lt(typeof o != "string" && "length" in o);
        for (var u = 0, l = n.length; u < l; ++u) we(t, n[u], o[u]);
      } else {
        var f, d, p = n.indexOf(".");
        p !== -1 ? (f = n.substr(0, p), (d = n.substr(p + 1)) === "" ? o === void 0 ? m(t) && !isNaN(parseInt(f)) ? t.splice(f, 1) : delete t[f] : t[f] = o : we(p = !(p = t[f]) || !M(t, f) ? t[f] = {} : p, d, o)) : o === void 0 ? m(t) && !isNaN(parseInt(n)) ? t.splice(n, 1) : delete t[n] : t[n] = o;
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
    })), an = null;
    function ft(t) {
      return an = /* @__PURE__ */ new WeakMap(), t = function n(o) {
        if (!o || typeof o != "object") return o;
        var u = an.get(o);
        if (u) return u;
        if (m(o)) {
          u = [], an.set(o, u);
          for (var l = 0, f = o.length; l < f; ++l) u.push(n(o[l]));
        } else if (Un.has(o.constructor)) u = o;
        else {
          var d, p = A(o);
          for (d in u = p === Object.prototype ? {} : Object.create(p), an.set(o, u), o) M(o, d) && (u[d] = n(o[d]));
        }
        return u;
      }(t), an = null, t;
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
    var Ct = {};
    function je(t) {
      var n, o, u, l;
      if (arguments.length === 1) {
        if (m(t)) return t.slice();
        if (this === Ct && typeof t == "string") return [t];
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
    }, cn = ["Unknown", "Constraint", "Data", "TransactionInactive", "ReadOnly", "Version", "NotFound", "InvalidState", "InvalidAccess", "Abort", "Timeout", "QuotaExceeded", "Syntax", "DataClone"], Ee = ["Modify", "Bulk", "OpenFailed", "VersionChange", "Schema", "Upgrade", "InvalidTable", "MissingAPI", "NoSuchDatabase", "InvalidArgument", "SubTransaction", "Unsupported", "Internal", "DatabaseClosed", "PrematureCommit", "ForeignAwait"].concat(cn), Ua = { VersionChanged: "Database version changed by other database connection", DatabaseClosed: "Database has been closed", Abort: "Transaction aborted", TransactionInactive: "Transaction has already completed or failed", MissingAPI: "IndexedDB API missing. Please visit https://tinyurl.com/y2uuvskb" };
    function Dt(t, n) {
      this.name = t, this.message = n;
    }
    function is(t, n) {
      return t + ". Errors: " + Object.keys(n).map(function(o) {
        return n[o].toString();
      }).filter(function(o, u, l) {
        return l.indexOf(o) === u;
      }).join(`
`);
    }
    function jn(t, n, o, u) {
      this.failures = n, this.failedKeys = u, this.successCount = o, this.message = is(t, n);
    }
    function $t(t, n) {
      this.name = "BulkError", this.failures = Object.keys(n).map(function(o) {
        return n[o];
      }), this.failuresByPos = n, this.message = is(t, this.failures);
    }
    Se(Dt).from(Error).extend({ toString: function() {
      return this.name + ": " + this.message;
    } }), Se(jn).from(Dt), Se($t).from(Dt);
    var Ur = Ee.reduce(function(t, n) {
      return t[n] = n + "Error", t;
    }, {}), ja = Dt, W = Ee.reduce(function(t, n) {
      var o = n + "Error";
      function u(l, f) {
        this.name = o, l ? typeof l == "string" ? (this.message = "".concat(l).concat(f ? `
 ` + f : ""), this.inner = f || null) : typeof l == "object" && (this.message = "".concat(l.name, " ").concat(l.message), this.inner = l) : (this.message = Ua[n] || o, this.inner = null);
      }
      return Se(u).from(ja), t[n] = u, t;
    }, {});
    W.Syntax = SyntaxError, W.Type = TypeError, W.Range = RangeError;
    var ss = cn.reduce(function(t, n) {
      return t[n + "Error"] = W[n], t;
    }, {}), Wn = Ee.reduce(function(t, n) {
      return ["Syntax", "Type", "Range"].indexOf(n) === -1 && (t[n + "Error"] = W[n]), t;
    }, {});
    function ie() {
    }
    function un(t) {
      return t;
    }
    function Wa(t, n) {
      return t == null || t === un ? n : function(o) {
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
        v(o, u);
        var l = this.onsuccess, f = this.onerror;
        return this.onsuccess = null, this.onerror = null, o = n.apply(this, arguments), l && (this.onsuccess = this.onsuccess ? dt(l, this.onsuccess) : l), f && (this.onerror = this.onerror ? dt(f, this.onerror) : f), u === void 0 ? o === void 0 ? void 0 : o : v(u, o);
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
    Wn.ModifyError = jn, Wn.DexieError = Dt, Wn.BulkError = $t;
    var Ve = typeof location < "u" && /^(http|https):\/\/(localhost|127\.0\.0\.1)/.test(location.href);
    function os(t) {
      Ve = t;
    }
    var ln = {}, as = 100, Ke = typeof Promise > "u" ? [] : function() {
      var t = Promise.resolve();
      if (typeof crypto > "u" || !crypto.subtle) return [t, A(t), t];
      var n = crypto.subtle.digest("SHA-512", new Uint8Array([0]));
      return [n, A(n), t];
    }(), cn = Ke[0], Ee = Ke[1], Ke = Ke[2], Ee = Ee && Ee.then, fn = cn && cn.constructor, Wr = !!Ke, hn = function(t, n) {
      dn.push([t, n]), Kn && (queueMicrotask(Ya), Kn = !1);
    }, Kr = !0, Kn = !0, mt = [], zn = [], zr = un, He = { id: "global", global: !0, ref: 0, unhandleds: [], onunhandled: ie, pgp: !1, env: {}, finalize: ie }, U = He, dn = [], pt = 0, Zn = [];
    function L(t) {
      if (typeof this != "object") throw new TypeError("Promises must be constructed via new");
      this._listeners = [], this._lib = !1;
      var n = this._PSD = U;
      if (typeof t != "function") {
        if (t !== ln) throw new TypeError("Not a function");
        return this._state = arguments[1], this._value = arguments[2], void (this._state === !1 && Br(this, this._value));
      }
      this._state = null, this._value = null, ++n.ref, function o(u, l) {
        try {
          l(function(f) {
            if (u._state === null) {
              if (f === u) throw new TypeError("A promise cannot be resolved with itself.");
              var d = u._lib && Nt();
              f && typeof f.then == "function" ? o(u, function(p, w) {
                f instanceof L ? f._then(p, w) : f.then(p, w);
              }) : (u._state = !0, u._value = f, ls(u)), d && Mt();
            }
          }, Br.bind(null, u));
        } catch (f) {
          Br(u, f);
        }
      }(this, t);
    }
    var Zr = { get: function() {
      var t = U, n = Gn;
      function o(u, l) {
        var f = this, d = !t.global && (t !== U || n !== Gn), p = d && !Ge(), w = new L(function(g, S) {
          Hr(f, new us(fs(u, t, d, p), fs(l, t, d, p), g, S, t));
        });
        return this._consoleTask && (w._consoleTask = this._consoleTask), w;
      }
      return o.prototype = ln, o;
    }, set: function(t) {
      ee(this, "then", t && t.prototype === ln ? Zr : { get: function() {
        return t;
      }, set: Zr.set });
    } };
    function us(t, n, o, u, l) {
      this.onFulfilled = typeof t == "function" ? t : null, this.onRejected = typeof n == "function" ? n : null, this.resolve = o, this.reject = u, this.psd = l;
    }
    function Br(t, n) {
      var o, u;
      zn.push(n), t._state === null && (o = t._lib && Nt(), n = zr(n), t._state = !1, t._value = n, u = t, mt.some(function(l) {
        return l._value === u._value;
      }) || mt.push(u), ls(t), o && Mt());
    }
    function ls(t) {
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
        ++n.psd.ref, ++pt, hn(Ha, [o, t, n]);
      } else t._listeners.push(n);
    }
    function Ha(t, n, o) {
      try {
        var u, l = n._value;
        !n._state && zn.length && (zn = []), u = Ve && n._consoleTask ? n._consoleTask.run(function() {
          return t(l);
        }) : t(l), n._state || zn.indexOf(l) !== -1 || function(f) {
          for (var d = mt.length; d; ) if (mt[--d]._value === f._value) return mt.splice(d, 1);
        }(n), o.resolve(u);
      } catch (f) {
        o.reject(f);
      } finally {
        --pt == 0 && Yr(), --o.psd.ref || o.psd.finalize();
      }
    }
    function Ya() {
      yt(He, function() {
        Nt() && Mt();
      });
    }
    function Nt() {
      var t = Kr;
      return Kn = Kr = !1, t;
    }
    function Mt() {
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
      var t = mt;
      mt = [], t.forEach(function(u) {
        u._PSD.onunhandled.call(null, u._value, u);
      });
      for (var n = Zn.slice(0), o = n.length; o; ) n[--o]();
    }
    function Bn(t) {
      return new L(ln, !1, t);
    }
    function oe(t, n) {
      var o = U;
      return function() {
        var u = Nt(), l = U;
        try {
          return Je(o, !0), t.apply(this, arguments);
        } catch (f) {
          n && n(f);
        } finally {
          Je(l, !1), u && Mt();
        }
      };
    }
    z(L.prototype, { then: Zr, _then: function(t, n) {
      Hr(this, new us(null, null, t, n, U));
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
        return L.resolve(t()).then(function() {
          return n;
        });
      }, function(n) {
        return L.resolve(t()).then(function() {
          return Bn(n);
        });
      });
    }, timeout: function(t, n) {
      var o = this;
      return t < 1 / 0 ? new L(function(u, l) {
        var f = setTimeout(function() {
          return l(new W.Timeout(n));
        }, t);
        o.then(u, l).finally(clearTimeout.bind(null, f));
      }) : this;
    } }), typeof Symbol < "u" && Symbol.toStringTag && ee(L.prototype, Symbol.toStringTag, "Dexie.Promise"), He.env = cs(), z(L, { all: function() {
      var t = je.apply(null, arguments).map(Jn);
      return new L(function(n, o) {
        t.length === 0 && n([]);
        var u = t.length;
        t.forEach(function(l, f) {
          return L.resolve(l).then(function(d) {
            t[f] = d, --u || n(t);
          }, o);
        });
      });
    }, resolve: function(t) {
      return t instanceof L ? t : t && typeof t.then == "function" ? new L(function(n, o) {
        t.then(n, o);
      }) : new L(ln, !0, t);
    }, reject: Bn, race: function() {
      var t = je.apply(null, arguments).map(Jn);
      return new L(function(n, o) {
        t.map(function(u) {
          return L.resolve(u).then(n, o);
        });
      });
    }, PSD: { get: function() {
      return U;
    }, set: function(t) {
      return U = t;
    } }, totalEchoes: { get: function() {
      return Gn;
    } }, newPSD: Ye, usePSD: yt, scheduler: { get: function() {
      return hn;
    }, set: function(t) {
      hn = t;
    } }, rejectionMapper: { get: function() {
      return zr;
    }, set: function(t) {
      zr = t;
    } }, follow: function(t, n) {
      return new L(function(o, u) {
        return Ye(function(l, f) {
          var d = U;
          d.unhandleds = [], d.onunhandled = f, d.finalize = dt(function() {
            var p, w = this;
            p = function() {
              w.unhandleds.length === 0 ? l() : f(w.unhandleds[0]);
            }, Zn.push(function g() {
              p(), Zn.splice(Zn.indexOf(g), 1);
            }), ++pt, hn(function() {
              --pt == 0 && Yr();
            }, []);
          }, d.finalize), t();
        }, n, o, u);
      });
    } }), fn && (fn.allSettled && ee(L, "allSettled", function() {
      var t = je.apply(null, arguments).map(Jn);
      return new L(function(n) {
        t.length === 0 && n([]);
        var o = t.length, u = new Array(o);
        t.forEach(function(l, f) {
          return L.resolve(l).then(function(d) {
            return u[f] = { status: "fulfilled", value: d };
          }, function(d) {
            return u[f] = { status: "rejected", reason: d };
          }).then(function() {
            return --o || n(u);
          });
        });
      });
    }), fn.any && typeof AggregateError < "u" && ee(L, "any", function() {
      var t = je.apply(null, arguments).map(Jn);
      return new L(function(n, o) {
        t.length === 0 && o(new AggregateError([]));
        var u = t.length, l = new Array(u);
        t.forEach(function(f, d) {
          return L.resolve(f).then(function(p) {
            return n(p);
          }, function(p) {
            l[d] = p, --u || o(new AggregateError(l));
          });
        });
      });
    }));
    var de = { awaits: 0, echoes: 0, id: 0 }, Ga = 0, Hn = [], Yn = 0, Gn = 0, Ja = 0;
    function Ye(t, n, o, u) {
      var l = U, f = Object.create(l);
      return f.parent = l, f.ref = 0, f.global = !1, f.id = ++Ja, He.env, f.env = Wr ? { Promise: L, PromiseProp: { value: L, configurable: !0, writable: !0 }, all: L.all, race: L.race, allSettled: L.allSettled, any: L.any, resolve: L.resolve, reject: L.reject } : {}, n && v(f, n), ++l.ref, f.finalize = function() {
        --this.parent.ref || this.parent.finalize();
      }, u = yt(f, t, o, u), f.ref === 0 && f.finalize(), u;
    }
    function Pt() {
      return de.id || (de.id = ++Ga), ++de.awaits, de.echoes += as, de.id;
    }
    function Ge() {
      return !!de.awaits && (--de.awaits == 0 && (de.id = 0), de.echoes = de.awaits * as, !0);
    }
    function Jn(t) {
      return de.echoes && t && t.constructor === fn ? (Pt(), t.then(function(n) {
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
      var o, u = U;
      (n ? !de.echoes || Yn++ && t === U : !Yn || --Yn && t === U) || queueMicrotask(n ? (function(l) {
        ++Gn, de.echoes && --de.echoes != 0 || (de.echoes = de.awaits = de.id = 0), Hn.push(U), Je(l, !0);
      }).bind(null, t) : Xa), t !== U && (U = t, u === He && (He.env = cs()), Wr && (o = He.env.Promise, n = t.env, (u.global || t.global) && (Object.defineProperty(c, "Promise", n.PromiseProp), o.all = n.all, o.race = n.race, o.resolve = n.resolve, o.reject = n.reject, n.allSettled && (o.allSettled = n.allSettled), n.any && (o.any = n.any))));
    }
    function cs() {
      var t = c.Promise;
      return Wr ? { Promise: t, PromiseProp: Object.getOwnPropertyDescriptor(c, "Promise"), all: t.all, race: t.race, allSettled: t.allSettled, any: t.any, resolve: t.resolve, reject: t.reject } : {};
    }
    function yt(t, n, o, u, l) {
      var f = U;
      try {
        return Je(t, !0), n(o, u, l);
      } finally {
        Je(f, !1);
      }
    }
    function fs(t, n, o, u) {
      return typeof t != "function" ? t : function() {
        var l = U;
        o && Pt(), Je(n, !0);
        try {
          return t.apply(this, arguments);
        } finally {
          Je(l, !1), u && queueMicrotask(Ge);
        }
      };
    }
    function Gr(t) {
      Promise === fn && de.echoes === 0 ? Yn === 0 ? t() : enqueueNativeMicroTask(t) : setTimeout(t, 0);
    }
    ("" + Ee).indexOf("[native code]") === -1 && (Pt = Ge = ie);
    var le = L.reject, gt = "￿", We = "Invalid key provided. Keys must be of type string, number, Date or Array<string | number | Date>.", hs = "String expected.", Ft = [], Xn = "__dbnames", Jr = "readonly", Xr = "readwrite";
    function vt(t, n) {
      return t ? n ? function() {
        return t.apply(this, arguments) && n.apply(this, arguments);
      } : t : n;
    }
    var ds = { type: 3, lower: -1 / 0, lowerOpen: !1, upper: [[]], upperOpen: !1 };
    function Qn(t) {
      return typeof t != "string" || /\./.test(t) ? function(n) {
        return n;
      } : function(n) {
        return n[t] === void 0 && t in n && delete (n = ft(n))[t], n;
      };
    }
    function ms() {
      throw W.Type();
    }
    function Q(t, n) {
      try {
        var o = ps(t), u = ps(n);
        if (o !== u) return o === "Array" ? 1 : u === "Array" ? -1 : o === "binary" ? 1 : u === "binary" ? -1 : o === "string" ? 1 : u === "string" ? -1 : o === "Date" ? 1 : u !== "Date" ? NaN : -1;
        switch (o) {
          case "number":
          case "Date":
          case "string":
            return n < t ? 1 : t < n ? -1 : 0;
          case "binary":
            return function(l, f) {
              for (var d = l.length, p = f.length, w = d < p ? d : p, g = 0; g < w; ++g) if (l[g] !== f[g]) return l[g] < f[g] ? -1 : 1;
              return d === p ? 0 : d < p ? -1 : 1;
            }(ys(t), ys(n));
          case "Array":
            return function(l, f) {
              for (var d = l.length, p = f.length, w = d < p ? d : p, g = 0; g < w; ++g) {
                var S = Q(l[g], f[g]);
                if (S !== 0) return S;
              }
              return d === p ? 0 : d < p ? -1 : 1;
            }(t, n);
        }
      } catch {
      }
      return NaN;
    }
    function ps(t) {
      var n = typeof t;
      return n != "object" ? n : ArrayBuffer.isView(t) ? "binary" : (t = Vr(t), t === "ArrayBuffer" ? "binary" : t);
    }
    function ys(t) {
      return t instanceof Uint8Array ? t : ArrayBuffer.isView(t) ? new Uint8Array(t.buffer, t.byteOffset, t.byteLength) : new Uint8Array(t);
    }
    var gs = (se.prototype._trans = function(t, n, o) {
      var u = this._tx || U.trans, l = this.name, f = Ve && typeof console < "u" && console.createTask && console.createTask("Dexie: ".concat(t === "readonly" ? "read" : "write", " ").concat(this.name));
      function d(g, S, y) {
        if (!y.schema[l]) throw new W.NotFound("Table " + l + " not part of transaction");
        return n(y.idbtrans, y);
      }
      var p = Nt();
      try {
        var w = u && u.db._novip === this.db._novip ? u === U.trans ? u._promise(t, d, o) : Ye(function() {
          return u._promise(t, d, o);
        }, { trans: u, transless: U.transless || U }) : function g(S, y, x, b) {
          if (S.idbdb && (S._state.openComplete || U.letThrough || S._vip)) {
            var _ = S._createTransaction(y, x, S._dbSchema);
            try {
              _.create(), S._state.PR1398_maxLoop = 3;
            } catch (T) {
              return T.name === Ur.InvalidState && S.isOpen() && 0 < --S._state.PR1398_maxLoop ? (console.warn("Dexie: Need to reopen db"), S.close({ disableAutoOpen: !1 }), S.open().then(function() {
                return g(S, y, x, b);
              })) : le(T);
            }
            return _._promise(y, function(T, k) {
              return Ye(function() {
                return U.trans = _, b(T, k, _);
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
          if (S._state.openComplete) return le(new W.DatabaseClosed(S._state.dbOpenError));
          if (!S._state.isBeingOpened) {
            if (!S._state.autoOpen) return le(new W.DatabaseClosed());
            S.open().catch(ie);
          }
          return S._state.dbReadyPromise.then(function() {
            return g(S, y, x, b);
          });
        }(this.db, t, [this.name], d);
        return f && (w._consoleTask = f, w = w.catch(function(g) {
          return console.trace(g), le(g);
        })), w;
      } finally {
        p && Mt();
      }
    }, se.prototype.get = function(t, n) {
      var o = this;
      return t && t.constructor === Object ? this.where(t).first(n) : t == null ? le(new W.Type("Invalid argument to Table.get()")) : this._trans("readonly", function(u) {
        return o.core.get({ trans: u, key: t }).then(function(l) {
          return o.hook.reading.fire(l);
        });
      }).then(n);
    }, se.prototype.where = function(t) {
      if (typeof t == "string") return new this.db.WhereClause(this, t);
      if (m(t)) return new this.db.WhereClause(this, "[".concat(t.join("+"), "]"));
      var n = h(t);
      if (n.length === 1) return this.where(n[0]).equals(t[n[0]]);
      var o = this.schema.indexes.concat(this.schema.primKey).filter(function(w) {
        if (w.compound && n.every(function(S) {
          return 0 <= w.keyPath.indexOf(S);
        })) {
          for (var g = 0; g < n.length; ++g) if (n.indexOf(w.keyPath[g]) === -1) return !1;
          return !0;
        }
        return !1;
      }).sort(function(w, g) {
        return w.keyPath.length - g.keyPath.length;
      })[0];
      if (o && this.db._maxKey !== gt) {
        var d = o.keyPath.slice(0, n.length);
        return this.where(d).equals(d.map(function(g) {
          return t[g];
        }));
      }
      !o && Ve && console.warn("The query ".concat(JSON.stringify(t), " on ").concat(this.name, " would benefit from a ") + "compound index [".concat(n.join("+"), "]"));
      var u = this.schema.idxByName, l = this.db._deps.indexedDB;
      function f(w, g) {
        return l.cmp(w, g) === 0;
      }
      var p = n.reduce(function(x, g) {
        var S = x[0], y = x[1], x = u[g], b = t[g];
        return [S || x, S || !x ? vt(y, x && x.multi ? function(_) {
          return _ = De(_, g), m(_) && _.some(function(T) {
            return f(b, T);
          });
        } : function(_) {
          return f(b, De(_, g));
        }) : y];
      }, [null, null]), d = p[0], p = p[1];
      return d ? this.where(d.name).equals(t[d.keyPath]).filter(p) : o ? this.filter(p) : this.where(n).equals("");
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
      (this.schema.mappedClass = t).prototype instanceof ms && (function(w, g) {
        if (typeof g != "function" && g !== null) throw new TypeError("Class extends value " + String(g) + " is not a constructor or null");
        function S() {
          this.constructor = w;
        }
        r(w, g), w.prototype = g === null ? Object.create(g) : (S.prototype = g.prototype, new S());
      }(l, n = t), Object.defineProperty(l.prototype, "db", { get: function() {
        return o;
      }, enumerable: !1, configurable: !0 }), l.prototype.table = function() {
        return u;
      }, t = l);
      for (var f = /* @__PURE__ */ new Set(), d = t.prototype; d; d = A(d)) Object.getOwnPropertyNames(d).forEach(function(w) {
        return f.add(w);
      });
      function p(w) {
        if (!w) return w;
        var g, S = Object.create(t.prototype);
        for (g in w) if (!f.has(g)) try {
          S[g] = w[g];
        } catch {
        }
        return S;
      }
      return this.schema.readHook && this.hook.reading.unsubscribe(this.schema.readHook), this.schema.readHook = p, this.hook("reading", p), t;
    }, se.prototype.defineClass = function() {
      return this.mapToClass(function(t) {
        v(this, t);
      });
    }, se.prototype.add = function(t, n) {
      var o = this, u = this.schema.primKey, l = u.auto, f = u.keyPath, d = t;
      return f && l && (d = Qn(f)(t)), this._trans("readwrite", function(p) {
        return o.core.mutate({ trans: p, type: "add", keys: n != null ? [n] : null, values: [d] });
      }).then(function(p) {
        return p.numFailures ? L.reject(p.failures[0]) : p.lastResult;
      }).then(function(p) {
        if (f) try {
          we(t, f, p);
        } catch {
        }
        return p;
      });
    }, se.prototype.update = function(t, n) {
      return typeof t != "object" || m(t) ? this.where(":id").equals(t).modify(n) : (t = De(t, this.schema.primKey.keyPath), t === void 0 ? le(new W.InvalidArgument("Given object does not contain its primary key")) : this.where(":id").equals(t).modify(n));
    }, se.prototype.put = function(t, n) {
      var o = this, u = this.schema.primKey, l = u.auto, f = u.keyPath, d = t;
      return f && l && (d = Qn(f)(t)), this._trans("readwrite", function(p) {
        return o.core.mutate({ trans: p, type: "put", values: [d], keys: n != null ? [n] : null });
      }).then(function(p) {
        return p.numFailures ? L.reject(p.failures[0]) : p.lastResult;
      }).then(function(p) {
        if (f) try {
          we(t, f, p);
        } catch {
        }
        return p;
      });
    }, se.prototype.delete = function(t) {
      var n = this;
      return this._trans("readwrite", function(o) {
        return n.core.mutate({ trans: o, type: "delete", keys: [t] });
      }).then(function(o) {
        return o.numFailures ? L.reject(o.failures[0]) : void 0;
      });
    }, se.prototype.clear = function() {
      var t = this;
      return this._trans("readwrite", function(n) {
        return t.core.mutate({ trans: n, type: "deleteRange", range: ds });
      }).then(function(n) {
        return n.numFailures ? L.reject(n.failures[0]) : void 0;
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
        var g = u.schema.primKey, p = g.auto, g = g.keyPath;
        if (g && l) throw new W.InvalidArgument("bulkAdd(): keys argument invalid on tables with inbound keys");
        if (l && l.length !== t.length) throw new W.InvalidArgument("Arguments objects and keys must have the same length");
        var w = t.length, g = g && p ? t.map(Qn(g)) : t;
        return u.core.mutate({ trans: d, type: "add", keys: l, values: g, wantResults: f }).then(function(_) {
          var y = _.numFailures, x = _.results, b = _.lastResult, _ = _.failures;
          if (y === 0) return f ? x : b;
          throw new $t("".concat(u.name, ".bulkAdd(): ").concat(y, " of ").concat(w, " operations failed"), _);
        });
      });
    }, se.prototype.bulkPut = function(t, n, o) {
      var u = this, l = Array.isArray(n) ? n : void 0, f = (o = o || (l ? void 0 : n)) ? o.allKeys : void 0;
      return this._trans("readwrite", function(d) {
        var g = u.schema.primKey, p = g.auto, g = g.keyPath;
        if (g && l) throw new W.InvalidArgument("bulkPut(): keys argument invalid on tables with inbound keys");
        if (l && l.length !== t.length) throw new W.InvalidArgument("Arguments objects and keys must have the same length");
        var w = t.length, g = g && p ? t.map(Qn(g)) : t;
        return u.core.mutate({ trans: d, type: "put", keys: l, values: g, wantResults: f }).then(function(_) {
          var y = _.numFailures, x = _.results, b = _.lastResult, _ = _.failures;
          if (y === 0) return f ? x : b;
          throw new $t("".concat(u.name, ".bulkPut(): ").concat(y, " of ").concat(w, " operations failed"), _);
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
          var w = [], g = [];
          t.forEach(function(y, x) {
            var b = y.key, _ = y.changes, T = p[x];
            if (T) {
              for (var k = 0, O = Object.keys(_); k < O.length; k++) {
                var E = O[k], I = _[E];
                if (E === n.schema.primKey.keyPath) {
                  if (Q(I, b) !== 0) throw new W.Constraint("Cannot update primary key in bulkUpdate()");
                } else we(T, E, I);
              }
              f.push(x), w.push(b), g.push(T);
            }
          });
          var S = w.length;
          return o.mutate({ trans: d, type: "put", keys: w, values: g, updates: { keys: u, changeSpecs: l } }).then(function(y) {
            var x = y.numFailures, b = y.failures;
            if (x === 0) return S;
            for (var _ = 0, T = Object.keys(b); _ < T.length; _++) {
              var k, O = T[_], E = f[Number(O)];
              E != null && (k = b[O], delete b[O], b[E] = k);
            }
            throw new $t("".concat(n.name, ".bulkUpdate(): ").concat(x, " of ").concat(S, " operations failed"), b);
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
        throw new $t("".concat(n.name, ".bulkDelete(): ").concat(l, " of ").concat(o, " operations failed"), d);
      });
    }, se);
    function se() {
    }
    function mn(t) {
      function n(d, p) {
        if (p) {
          for (var w = arguments.length, g = new Array(w - 1); --w; ) g[w - 1] = arguments[w];
          return o[d].subscribe.apply(null, g), t;
        }
        if (typeof d == "string") return o[d];
      }
      var o = {};
      n.addEventType = f;
      for (var u = 1, l = arguments.length; u < l; ++u) f(arguments[u]);
      return n;
      function f(d, p, w) {
        if (typeof d != "object") {
          var g;
          p = p || Ba;
          var S = { subscribers: [], fire: w = w || ie, subscribe: function(y) {
            S.subscribers.indexOf(y) === -1 && (S.subscribers.push(y), S.fire = p(S.fire, y));
          }, unsubscribe: function(y) {
            S.subscribers = S.subscribers.filter(function(x) {
              return x !== y;
            }), S.fire = S.subscribers.reduce(p, w);
          } };
          return o[d] = n[d] = S;
        }
        h(g = d).forEach(function(y) {
          var x = g[y];
          if (m(x)) f(y, g[y][0], g[y][1]);
          else {
            if (x !== "asap") throw new W.InvalidArgument("Invalid event config");
            var b = f(y, un, function() {
              for (var _ = arguments.length, T = new Array(_); _--; ) T[_] = arguments[_];
              b.subscribers.forEach(function(k) {
                on(function() {
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
      if (!o) throw new W.Schema("KeyPath " + t.index + " on object store " + n.name + " is not indexed");
      return o;
    }
    function vs(t, n, o) {
      var u = er(t, n.schema);
      return n.openCursor({ trans: o, values: !t.keysOnly, reverse: t.dir === "prev", unique: !!t.unique, query: { index: u, range: t.range } });
    }
    function tr(t, n, o, u) {
      var l = t.replayFilter ? vt(t.filter, t.replayFilter()) : t.filter;
      if (t.or) {
        var f = {}, d = function(p, w, g) {
          var S, y;
          l && !l(w, g, function(x) {
            return w.stop(x);
          }, function(x) {
            return w.fail(x);
          }) || ((y = "" + (S = w.primaryKey)) == "[object ArrayBuffer]" && (y = "" + new Uint8Array(S)), M(f, y) || (f[y] = !0, n(p, w, g)));
        };
        return Promise.all([t.or._iterate(d, o), bs(vs(t, u, o), t.algorithm, d, !t.keysOnly && t.valueMapper)]);
      }
      return bs(vs(t, u, o), vt(t.algorithm, l), n, !t.keysOnly && t.valueMapper);
    }
    function bs(t, n, o, u) {
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
    var Ke = Symbol(), yn = (ws.prototype.execute = function(t) {
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
    }, ws);
    function ws(t) {
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
      n.algorithm = vt(n.algorithm, t);
    }, te.prototype._iterate = function(t, n) {
      return tr(this._ctx, t, n, this._ctx.table.core);
    }, te.prototype.clone = function(t) {
      var n = Object.create(this.constructor.prototype), o = Object.create(this._ctx);
      return t && v(o, t), n._ctx = o, n;
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
      function f(w, g) {
        return g ? f(w[o[g]], g - 1) : w[u];
      }
      var d = this._ctx.dir === "next" ? 1 : -1;
      function p(w, g) {
        return w = f(w, l), g = f(g, l), w < g ? -d : g < w ? d : 0;
      }
      return this.toArray(function(w) {
        return w.sort(p);
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
        var u = l.primaryKey.toString(), l = M(n, u);
        return n[u] = !0, !l;
      }), this;
    }, te.prototype.modify = function(t) {
      var n = this, o = this._ctx;
      return this._write(function(u) {
        var l, f, d;
        d = typeof t == "function" ? t : (l = h(t), f = l.length, function(k) {
          for (var O = !1, E = 0; E < f; ++E) {
            var I = l[E], C = t[I], $ = De(k, I);
            C instanceof yn ? (we(k, I, C.execute($)), O = !0) : $ !== C && (we(k, I, C), O = !0);
          }
          return O;
        });
        function p(k, I) {
          var E = I.failures, I = I.numFailures;
          _ += k - I;
          for (var C = 0, $ = h(E); C < $.length; C++) {
            var F = $[C];
            b.push(E[F]);
          }
        }
        var w = o.table.core, g = w.schema.primaryKey, S = g.outbound, y = g.extractKey, x = n.db._options.modifyChunkSize || 200, b = [], _ = 0, T = [];
        return n.clone().primaryKeys().then(function(k) {
          function O(I) {
            var C = Math.min(x, k.length - I);
            return w.getMany({ trans: u, keys: k.slice(I, I + C), cache: "immutable" }).then(function($) {
              for (var F = [], N = [], P = S ? [] : null, R = [], D = 0; D < C; ++D) {
                var B = $[D], H = { value: ft(B), primKey: k[I + D] };
                d.call(H, H.value, H) !== !1 && (H.value == null ? R.push(k[I + D]) : S || Q(y(B), y(H.value)) === 0 ? (N.push(H.value), S && P.push(k[I + D])) : (R.push(k[I + D]), F.push(H.value)));
              }
              return Promise.resolve(0 < F.length && w.mutate({ trans: u, type: "add", values: F }).then(function(J) {
                for (var Y in J.failures) R.splice(parseInt(Y), 1);
                p(F.length, J);
              })).then(function() {
                return (0 < N.length || E && typeof t == "object") && w.mutate({ trans: u, type: "put", keys: P, values: N, criteria: E, changeSpec: typeof t != "function" && t, isAdditionalChunk: 0 < I }).then(function(J) {
                  return p(N.length, J);
                });
              }).then(function() {
                return (0 < R.length || E && t === ti) && w.mutate({ trans: u, type: "delete", keys: R, criteria: E, isAdditionalChunk: 0 < I }).then(function(J) {
                  return p(R.length, J);
                });
              }).then(function() {
                return k.length > I + C && O(I + x);
              });
            });
          }
          var E = Rt(o) && o.limit === 1 / 0 && (typeof t != "function" || t === ti) && { index: o.index, range: o.range };
          return O(0).then(function() {
            if (0 < b.length) throw new jn("Error modifying one or more objects", b, _, T);
            return k.length;
          });
        });
      });
    }, te.prototype.delete = function() {
      var t = this._ctx, n = t.range;
      return Rt(t) && (t.isPrimKey || n.type === 3) ? this._write(function(o) {
        var u = t.table.core.schema.primaryKey, l = n;
        return t.table.core.count({ trans: o, query: { index: u, range: l } }).then(function(f) {
          return t.table.core.mutate({ trans: o, type: "deleteRange", range: l }).then(function(d) {
            var p = d.failures;
            if (d.lastResult, d.results, d = d.numFailures, d) throw new jn("Could not delete some values", Object.keys(p).map(function(w) {
              return p[w];
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
    function xe(t, n, o) {
      return t = t instanceof _s ? new t.Collection(t) : t, t._ctx.error = new (o || TypeError)(n), t;
    }
    function Vt(t) {
      return new t.Collection(t, function() {
        return ks("");
      }).limit(0);
    }
    function nr(t, n, o, u) {
      var l, f, d, p, w, g, S, y = o.length;
      if (!o.every(function(_) {
        return typeof _ == "string";
      })) return xe(t, hs);
      function x(_) {
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
        }).sort(function(k, O) {
          return d(k.lower, O.lower);
        });
        p = T.map(function(k) {
          return k.upper;
        }), w = T.map(function(k) {
          return k.lower;
        }), S = (g = _) === "next" ? "" : u;
      }
      x("next"), t = new t.Collection(t, function() {
        return Xe(p[0], w[y - 1] + u);
      }), t._ondirectionchange = function(_) {
        x(_);
      };
      var b = 0;
      return t._addAlgorithm(function(_, T, k) {
        var O = _.key;
        if (typeof O != "string") return !1;
        var E = f(O);
        if (n(E, w, b)) return !0;
        for (var I = null, C = b; C < y; ++C) {
          var $ = function(F, N, P, R, D, B) {
            for (var H = Math.min(F.length, R.length), J = -1, Y = 0; Y < H; ++Y) {
              var $e = N[Y];
              if ($e !== R[Y]) return D(F[Y], P[Y]) < 0 ? F.substr(0, Y) + P[Y] + P.substr(Y + 1) : D(F[Y], R[Y]) < 0 ? F.substr(0, Y) + R[Y] + P.substr(Y + 1) : 0 <= J ? F.substr(0, J) + N[J] + P.substr(J + 1) : null;
              D(F[Y], $e) < 0 && (J = Y);
            }
            return H < R.length && B === "next" ? F + P.substr(F.length) : H < F.length && B === "prev" ? F.substr(0, P.length) : J < 0 ? null : F.substr(0, J) + R[J] + P.substr(J + 1);
          }(O, E, p[C], w[C], d, g);
          $ === null && I === null ? b = C + 1 : (I === null || 0 < d(I, $)) && (I = $);
        }
        return T(I !== null ? function() {
          _.continue(I + S);
        } : k), !1;
      }), t;
    }
    function Xe(t, n, o, u) {
      return { type: 2, lower: t, upper: n, lowerOpen: o, upperOpen: u };
    }
    function ks(t) {
      return { type: 1, lower: t, upper: t };
    }
    var _s = (Object.defineProperty(me.prototype, "Collection", { get: function() {
      return this._ctx.table.db.Collection;
    }, enumerable: !1, configurable: !0 }), me.prototype.between = function(t, n, o, u) {
      o = o !== !1, u = u === !0;
      try {
        return 0 < this._cmp(t, n) || this._cmp(t, n) === 0 && (o || u) && (!o || !u) ? Vt(this) : new this.Collection(this, function() {
          return Xe(t, n, !o, !u);
        });
      } catch {
        return xe(this, We);
      }
    }, me.prototype.equals = function(t) {
      return t == null ? xe(this, We) : new this.Collection(this, function() {
        return ks(t);
      });
    }, me.prototype.above = function(t) {
      return t == null ? xe(this, We) : new this.Collection(this, function() {
        return Xe(t, void 0, !0);
      });
    }, me.prototype.aboveOrEqual = function(t) {
      return t == null ? xe(this, We) : new this.Collection(this, function() {
        return Xe(t, void 0, !1);
      });
    }, me.prototype.below = function(t) {
      return t == null ? xe(this, We) : new this.Collection(this, function() {
        return Xe(void 0, t, !1, !0);
      });
    }, me.prototype.belowOrEqual = function(t) {
      return t == null ? xe(this, We) : new this.Collection(this, function() {
        return Xe(void 0, t);
      });
    }, me.prototype.startsWith = function(t) {
      return typeof t != "string" ? xe(this, hs) : this.between(t, t + gt, !0, !0);
    }, me.prototype.startsWithIgnoreCase = function(t) {
      return t === "" ? this.startsWith(t) : nr(this, function(n, o) {
        return n.indexOf(o[0]) === 0;
      }, [t], gt);
    }, me.prototype.equalsIgnoreCase = function(t) {
      return nr(this, function(n, o) {
        return n === o[0];
      }, [t], "");
    }, me.prototype.anyOfIgnoreCase = function() {
      var t = je.apply(Ct, arguments);
      return t.length === 0 ? Vt(this) : nr(this, function(n, o) {
        return o.indexOf(n) !== -1;
      }, t, "");
    }, me.prototype.startsWithAnyOfIgnoreCase = function() {
      var t = je.apply(Ct, arguments);
      return t.length === 0 ? Vt(this) : nr(this, function(n, o) {
        return o.some(function(u) {
          return n.indexOf(u) === 0;
        });
      }, t, gt);
    }, me.prototype.anyOf = function() {
      var t = this, n = je.apply(Ct, arguments), o = this._cmp;
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
        for (var w = f.key; 0 < o(w, n[l]); ) if (++l === n.length) return d(p), !1;
        return o(w, n[l]) === 0 || (d(function() {
          f.continue(n[l]);
        }), !1);
      }), u;
    }, me.prototype.notEqual = function(t) {
      return this.inAnyRange([[-1 / 0, t], [t, this.db._maxKey]], { includeLowers: !1, includeUppers: !1 });
    }, me.prototype.noneOf = function() {
      var t = je.apply(Ct, arguments);
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
    }, me.prototype.inAnyRange = function(O, n) {
      var o = this, u = this._cmp, l = this._ascending, f = this._descending, d = this._min, p = this._max;
      if (O.length === 0) return Vt(this);
      if (!O.every(function(E) {
        return E[0] !== void 0 && E[1] !== void 0 && l(E[0], E[1]) <= 0;
      })) return xe(this, "First argument to inAnyRange() must be an Array of two-value Arrays [lower,upper] where upper must not be lower than lower", W.InvalidArgument);
      var w = !n || n.includeLowers !== !1, g = n && n.includeUppers === !0, S, y = l;
      function x(E, I) {
        return y(E[0], I[0]);
      }
      try {
        (S = O.reduce(function(E, I) {
          for (var C = 0, $ = E.length; C < $; ++C) {
            var F = E[C];
            if (u(I[0], F[1]) < 0 && 0 < u(I[1], F[0])) {
              F[0] = d(F[0], I[0]), F[1] = p(F[1], I[1]);
              break;
            }
          }
          return C === $ && E.push(I), E;
        }, [])).sort(x);
      } catch {
        return xe(this, We);
      }
      var b = 0, _ = g ? function(E) {
        return 0 < l(E, S[b][1]);
      } : function(E) {
        return 0 <= l(E, S[b][1]);
      }, T = w ? function(E) {
        return 0 < f(E, S[b][0]);
      } : function(E) {
        return 0 <= f(E, S[b][0]);
      }, k = _, O = new this.Collection(this, function() {
        return Xe(S[0][0], S[S.length - 1][1], !w, !g);
      });
      return O._ondirectionchange = function(E) {
        y = E === "next" ? (k = _, l) : (k = T, f), S.sort(x);
      }, O._addAlgorithm(function(E, I, C) {
        for (var $, F = E.key; k(F); ) if (++b === S.length) return I(C), !1;
        return !_($ = F) && !T($) || (o._cmp(F, S[b][1]) === 0 || o._cmp(F, S[b][0]) === 0 || I(function() {
          y === l ? E.continue(S[b][0]) : E.continue(S[b][1]);
        }), !1);
      }), O;
    }, me.prototype.startsWithAnyOf = function() {
      var t = je.apply(Ct, arguments);
      return t.every(function(n) {
        return typeof n == "string";
      }) ? t.length === 0 ? Vt(this) : this.inAnyRange(t.map(function(n) {
        return [n, n + gt];
      })) : xe(this, "startsWithAnyOf() only works with strings");
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
      return lt(!U.global), ++this._reculock, this._reculock !== 1 || U.global || (U.lockOwnerFor = this), this;
    }, Le.prototype._unlock = function() {
      if (lt(!U.global), --this._reculock == 0) for (U.global || (U.lockOwnerFor = null); 0 < this._blockedFuncs.length && !this._locked(); ) {
        var t = this._blockedFuncs.shift();
        try {
          yt(t[1], t[0]);
        } catch {
        }
      }
      return this;
    }, Le.prototype._locked = function() {
      return this._reculock && U.lockOwnerFor !== this;
    }, Le.prototype.create = function(t) {
      var n = this;
      if (!this.mode) return this;
      var o = this.db.idbdb, u = this.db._state.dbOpenError;
      if (lt(!this.idbtrans), !t && !o) switch (u && u.name) {
        case "DatabaseClosedError":
          throw new W.DatabaseClosed(u);
        case "MissingAPIError":
          throw new W.MissingAPI(u.message, u);
        default:
          throw new W.OpenFailed(u);
      }
      if (!this.active) throw new W.TransactionInactive();
      return lt(this._completion._state === null), (t = this.idbtrans = t || (this.db.core || o).transaction(this.storeNames, this.mode, { durability: this.chromeTransactionDurability })).onerror = oe(function(l) {
        gn(l), n._reject(t.error);
      }), t.onabort = oe(function(l) {
        gn(l), n.active && n._reject(new W.Abort(t.error)), n.active = !1, n.on("abort").fire(l);
      }), t.oncomplete = oe(function() {
        n.active = !1, n._resolve(), "mutatedParts" in t && Qe.storagemutated.fire(t.mutatedParts);
      }), this;
    }, Le.prototype._promise = function(t, n, o) {
      var u = this;
      if (t === "readwrite" && this.mode !== "readwrite") return le(new W.ReadOnly("Transaction is readonly"));
      if (!this.active) return le(new W.TransactionInactive());
      if (this._locked()) return new L(function(f, d) {
        u._blockedFuncs.push([function() {
          u._promise(t, n, o).then(f, d);
        }, U]);
      });
      if (o) return Ye(function() {
        var f = new L(function(d, p) {
          u._lock();
          var w = n(d, p, u);
          w && w.then && w.then(d, p);
        });
        return f.finally(function() {
          return u._unlock();
        }), f._lib = !0, f;
      });
      var l = new L(function(f, d) {
        var p = n(f, d, u);
        p && p.then && p.then(f, d);
      });
      return l._lib = !0, l;
    }, Le.prototype._root = function() {
      return this.parent ? this.parent._root() : this;
    }, Le.prototype.waitFor = function(t) {
      var n, o = this._root(), u = L.resolve(t);
      o._waitingFor ? o._waitingFor = o._waitingFor.then(function() {
        return u;
      }) : (o._waitingFor = u, o._waitingQueue = [], n = o.idbtrans.objectStore(o.storeNames[0]), function f() {
        for (++o._spinCount; o._waitingQueue.length; ) o._waitingQueue.shift()();
        o._waitingFor && (n.get(-1 / 0).onsuccess = f);
      }());
      var l = o._waitingFor;
      return new L(function(f, d) {
        u.then(function(p) {
          return o._waitingQueue.push(oe(f.bind(null, p)));
        }, function(p) {
          return o._waitingQueue.push(oe(d.bind(null, p)));
        }).finally(function() {
          o._waitingFor === l && (o._waitingFor = null);
        });
      });
    }, Le.prototype.abort = function() {
      this.active && (this.active = !1, this.idbtrans && this.idbtrans.abort(), this._reject(new W.Abort()));
    }, Le.prototype.table = function(t) {
      var n = this._memoizedTables || (this._memoizedTables = {});
      if (M(n, t)) return n[t];
      var o = this.schema[t];
      if (!o) throw new W.NotFound("Table " + t + " not part of transaction");
      return o = new this.db.Table(t, o, this), o.core = this.db.core.table(t), n[t] = o;
    }, Le);
    function Le() {
    }
    function ri(t, n, o, u, l, f, d) {
      return { name: t, keyPath: n, unique: o, multi: u, auto: l, compound: f, src: (o && !d ? "&" : "") + (u ? "*" : "") + (l ? "++" : "") + Ss(n) };
    }
    function Ss(t) {
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
          return gt;
        }, gt;
      }
    };
    function si(t) {
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
    function xs(t) {
      return [].slice.call(t);
    }
    var ru = 0;
    function wn(t) {
      return t == null ? ":id" : typeof t == "string" ? t : "[".concat(t.join("+"), "]");
    }
    function iu(t, n, w) {
      function u(k) {
        if (k.type === 3) return null;
        if (k.type === 4) throw new Error("Cannot convert never type to IDBKeyRange");
        var b = k.lower, _ = k.upper, T = k.lowerOpen, k = k.upperOpen;
        return b === void 0 ? _ === void 0 ? null : n.upperBound(_, !!k) : _ === void 0 ? n.lowerBound(b, !!T) : n.bound(b, _, !!T, !!k);
      }
      function l(x) {
        var b, _ = x.name;
        return { name: _, schema: x, mutate: function(T) {
          var k = T.trans, O = T.type, E = T.keys, I = T.values, C = T.range;
          return new Promise(function($, F) {
            $ = oe($);
            var N = k.objectStore(_), P = N.keyPath == null, R = O === "put" || O === "add";
            if (!R && O !== "delete" && O !== "deleteRange") throw new Error("Invalid operation type: " + O);
            var D, B = (E || I || { length: 1 }).length;
            if (E && I && E.length !== I.length) throw new Error("Given keys array must have same length as given values array.");
            if (B === 0) return $({ numFailures: 0, failures: {}, results: [], lastResult: void 0 });
            function H(_e) {
              ++$e, gn(_e);
            }
            var J = [], Y = [], $e = 0;
            if (O === "deleteRange") {
              if (C.type === 4) return $({ numFailures: $e, failures: Y, results: [], lastResult: void 0 });
              C.type === 3 ? J.push(D = N.clear()) : J.push(D = N.delete(u(C)));
            } else {
              var P = R ? P ? [I, E] : [I, null] : [E, null], G = P[0], pe = P[1];
              if (R) for (var ye = 0; ye < B; ++ye) J.push(D = pe && pe[ye] !== void 0 ? N[O](G[ye], pe[ye]) : N[O](G[ye])), D.onerror = H;
              else for (ye = 0; ye < B; ++ye) J.push(D = N[O](G[ye])), D.onerror = H;
            }
            function pr(_e) {
              _e = _e.target.result, J.forEach(function(kt, Si) {
                return kt.error != null && (Y[Si] = kt.error);
              }), $({ numFailures: $e, failures: Y, results: O === "delete" ? E : J.map(function(kt) {
                return kt.result;
              }), lastResult: _e });
            }
            D.onerror = function(_e) {
              H(_e), pr(_e);
            }, D.onsuccess = pr;
          });
        }, getMany: function(T) {
          var k = T.trans, O = T.keys;
          return new Promise(function(E, I) {
            E = oe(E);
            for (var C, $ = k.objectStore(_), F = O.length, N = new Array(F), P = 0, R = 0, D = function(J) {
              J = J.target, N[J._pos] = J.result, ++R === P && E(N);
            }, B = qe(I), H = 0; H < F; ++H) O[H] != null && ((C = $.get(O[H]))._pos = H, C.onsuccess = D, C.onerror = B, ++P);
            P === 0 && E(N);
          });
        }, get: function(T) {
          var k = T.trans, O = T.key;
          return new Promise(function(E, I) {
            E = oe(E);
            var C = k.objectStore(_).get(O);
            C.onsuccess = function($) {
              return E($.target.result);
            }, C.onerror = qe(I);
          });
        }, query: (b = g, function(T) {
          return new Promise(function(k, O) {
            k = oe(k);
            var E, I, C, P = T.trans, $ = T.values, F = T.limit, D = T.query, N = F === 1 / 0 ? void 0 : F, R = D.index, D = D.range, P = P.objectStore(_), R = R.isPrimaryKey ? P : P.index(R.name), D = u(D);
            if (F === 0) return k({ result: [] });
            b ? ((N = $ ? R.getAll(D, N) : R.getAllKeys(D, N)).onsuccess = function(B) {
              return k({ result: B.target.result });
            }, N.onerror = qe(O)) : (E = 0, I = !$ && "openKeyCursor" in R ? R.openKeyCursor(D) : R.openCursor(D), C = [], I.onsuccess = function(B) {
              var H = I.result;
              return H ? (C.push($ ? H.value : H.primaryKey), ++E === F ? k({ result: C }) : void H.continue()) : k({ result: C });
            }, I.onerror = qe(O));
          });
        }), openCursor: function(T) {
          var k = T.trans, O = T.values, E = T.query, I = T.reverse, C = T.unique;
          return new Promise(function($, F) {
            $ = oe($);
            var R = E.index, N = E.range, P = k.objectStore(_), P = R.isPrimaryKey ? P : P.index(R.name), R = I ? C ? "prevunique" : "prev" : C ? "nextunique" : "next", D = !O && "openKeyCursor" in P ? P.openKeyCursor(u(N), R) : P.openCursor(u(N), R);
            D.onerror = qe(F), D.onsuccess = oe(function(B) {
              var H, J, Y, $e, G = D.result;
              G ? (G.___id = ++ru, G.done = !1, H = G.continue.bind(G), J = (J = G.continuePrimaryKey) && J.bind(G), Y = G.advance.bind(G), $e = function() {
                throw new Error("Cursor not stopped");
              }, G.trans = k, G.stop = G.continue = G.continuePrimaryKey = G.advance = function() {
                throw new Error("Cursor not started");
              }, G.fail = oe(F), G.next = function() {
                var pe = this, ye = 1;
                return this.start(function() {
                  return ye-- ? pe.continue() : pe.stop();
                }).then(function() {
                  return pe;
                });
              }, G.start = function(pe) {
                function ye() {
                  if (D.result) try {
                    pe();
                  } catch (_e) {
                    G.fail(_e);
                  }
                  else G.done = !0, G.start = function() {
                    throw new Error("Cursor behind last entry");
                  }, G.stop();
                }
                var pr = new Promise(function(_e, kt) {
                  _e = oe(_e), D.onerror = qe(kt), G.fail = kt, G.stop = function(Si) {
                    G.stop = G.continue = G.continuePrimaryKey = G.advance = $e, _e(Si);
                  };
                });
                return D.onsuccess = oe(function(_e) {
                  D.onsuccess = ye, ye();
                }), G.continue = H, G.continuePrimaryKey = J, G.advance = Y, ye(), pr;
              }, $(G)) : $(null);
            }, F);
          });
        }, count: function(T) {
          var k = T.query, O = T.trans, E = k.index, I = k.range;
          return new Promise(function(C, $) {
            var F = O.objectStore(_), N = E.isPrimaryKey ? F : F.index(E.name), F = u(I), N = F ? N.count(F) : N.count();
            N.onsuccess = oe(function(P) {
              return C(P.target.result);
            }), N.onerror = qe($);
          });
        } };
      }
      var f, d, p, S = (d = w, p = xs((f = t).objectStoreNames), { schema: { name: f.name, tables: p.map(function(x) {
        return d.objectStore(x);
      }).map(function(x) {
        var b = x.keyPath, k = x.autoIncrement, _ = m(b), T = {}, k = { name: x.name, primaryKey: { name: null, isPrimaryKey: !0, outbound: b == null, compound: _, keyPath: b, autoIncrement: k, unique: !0, extractKey: si(b) }, indexes: xs(x.indexNames).map(function(O) {
          return x.index(O);
        }).map(function(C) {
          var E = C.name, I = C.unique, $ = C.multiEntry, C = C.keyPath, $ = { name: E, compound: m(C), keyPath: C, unique: I, multiEntry: $, extractKey: si(C) };
          return T[wn(C)] = $;
        }), getIndexByKeyPath: function(O) {
          return T[wn(O)];
        } };
        return T[":id"] = k.primaryKey, b != null && (T[wn(b)] = k.primaryKey), k;
      }) }, hasGetAll: 0 < p.length && "getAll" in d.objectStore(p[0]) && !(typeof navigator < "u" && /Safari/.test(navigator.userAgent) && !/(Chrome\/|Edge\/)/.test(navigator.userAgent) && [].concat(navigator.userAgent.match(/Safari\/(\d*)/))[1] < 604) }), w = S.schema, g = S.hasGetAll, S = w.tables.map(l), y = {};
      return S.forEach(function(x) {
        return y[x.name] = x;
      }), { stack: "dbcore", transaction: t.transaction.bind(t), table: function(x) {
        if (!y[x]) throw new Error("Table '".concat(x, "' not found"));
        return y[x];
      }, MIN_KEY: -1 / 0, MAX_KEY: bn(n), schema: w };
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
          var p = function w(g, S) {
            return Oe(g, S) || (g = A(g)) && w(g, S);
          }(d, l);
          (!p || "value" in p && p.value === void 0) && (d === t.Transaction.prototype || d instanceof t.Transaction ? ee(d, l, { get: function() {
            return this.table(l);
          }, set: function(w) {
            j(this, l, { value: w, writable: !0, configurable: !0, enumerable: !0 });
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
      o.objectStoreNames.contains("$meta") && !l.$meta && (l.$meta = ii("$meta", Os("")[0], []), t._storeNames.push("$meta"));
      var f = t._createTransaction("readwrite", t._storeNames, l);
      f.create(o), f._completion.catch(u);
      var d = f._reject.bind(f), p = U.transless || U;
      Ye(function() {
        return U.trans = f, U.transless = p, n !== 0 ? (rr(t, o), g = n, ((w = f).storeNames.includes("$meta") ? w.table("$meta").get("version").then(function(S) {
          return S ?? g;
        }) : L.resolve(g)).then(function(S) {
          return x = S, b = f, _ = o, T = [], S = (y = t)._versions, k = y._dbSchema = or(0, y.idbdb, _), (S = S.filter(function(O) {
            return O._cfg.version >= x;
          })).length !== 0 ? (S.forEach(function(O) {
            T.push(function() {
              var E = k, I = O._cfg.dbschema;
              ar(y, E, _), ar(y, I, _), k = y._dbSchema = I;
              var C = ai(E, I);
              C.add.forEach(function(R) {
                ui(_, R[0], R[1].primKey, R[1].indexes);
              }), C.change.forEach(function(R) {
                if (R.recreate) throw new W.Upgrade("Not yet support for changing primary key");
                var D = _.objectStore(R.name);
                R.add.forEach(function(B) {
                  return sr(D, B);
                }), R.change.forEach(function(B) {
                  D.deleteIndex(B.name), sr(D, B);
                }), R.del.forEach(function(B) {
                  return D.deleteIndex(B);
                });
              });
              var $ = O._cfg.contentUpgrade;
              if ($ && O._cfg.version > x) {
                rr(y, _), b._memoizedTables = {};
                var F = Ln(I);
                C.del.forEach(function(R) {
                  F[R] = E[R];
                }), oi(y, [y.Transaction.prototype]), ir(y, [y.Transaction.prototype], h(F), F), b.schema = F;
                var N, P = Lr($);
                return P && Pt(), C = L.follow(function() {
                  var R;
                  (N = $(b)) && P && (R = Ge.bind(null, null), N.then(R, R));
                }), N && typeof N.then == "function" ? L.resolve(N) : C.then(function() {
                  return N;
                });
              }
            }), T.push(function(E) {
              var I, C, $ = O._cfg.dbschema;
              I = $, C = E, [].slice.call(C.db.objectStoreNames).forEach(function(F) {
                return I[F] == null && C.db.deleteObjectStore(F);
              }), oi(y, [y.Transaction.prototype]), ir(y, [y.Transaction.prototype], y._storeNames, y._dbSchema), b.schema = y._dbSchema;
            }), T.push(function(E) {
              y.idbdb.objectStoreNames.contains("$meta") && (Math.ceil(y.idbdb.version / 10) === O._cfg.version ? (y.idbdb.deleteObjectStore("$meta"), delete y._dbSchema.$meta, y._storeNames = y._storeNames.filter(function(I) {
                return I !== "$meta";
              })) : E.objectStore("$meta").put(O._cfg.version, "version"));
            });
          }), function O() {
            return T.length ? L.resolve(T.shift()(b.idbtrans)).then(O) : L.resolve();
          }().then(function() {
            Ts(k, _);
          })) : L.resolve();
          var y, x, b, _, T, k;
        }).catch(d)) : (h(l).forEach(function(S) {
          ui(o, S, l[S].primKey, l[S].indexes);
        }), rr(t, o), void L.follow(function() {
          return t.on.populate.fire(f);
        }).catch(d));
        var w, g;
      });
    }
    function uu(t, n) {
      Ts(t._dbSchema, n), n.db.version % 10 != 0 || n.objectStoreNames.contains("$meta") || n.db.createObjectStore("$meta").add(Math.ceil(n.db.version / 10 - 1), "version");
      var o = or(0, t.idbdb, n);
      ar(t, t._dbSchema, n);
      for (var u = 0, l = ai(o, t._dbSchema).change; u < l.length; u++) {
        var f = function(d) {
          if (d.change.length || d.recreate) return console.warn("Unable to patch indexes of table ".concat(d.name, " because it has changes on the type of index or primary key.")), { value: void 0 };
          var p = n.objectStore(d.name);
          d.add.forEach(function(w) {
            Ve && console.debug("Dexie upgrade patch: Creating missing index ".concat(d.name, ".").concat(w.src)), sr(p, w);
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
            var p = l.idxByName, w = f.idxByName, g = void 0;
            for (g in p) w[g] || d.del.push(g);
            for (g in w) {
              var S = p[g], y = w[g];
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
    function Ts(t, n) {
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
        for (var f = o.objectStore(l), d = ri(Ss(g = f.keyPath), g || "", !0, !1, !!f.autoIncrement, g && typeof g != "string", !0), p = [], w = 0; w < f.indexNames.length; ++w) {
          var S = f.index(f.indexNames[w]), g = S.keyPath, S = ri(S.name, g, !!S.unique, !!S.multiEntry, !1, g && typeof g != "string", !1);
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
          var w = d.indexNames[p], g = d.index(w).keyPath, S = typeof g == "string" ? g : "[" + Re(g).join("+") + "]";
          !n[f] || (g = n[f].idxByName[S]) && (g.name = w, delete n[f].idxByName[S], n[f].idxByName[w] = g);
        }
      }
      typeof navigator < "u" && /Safari/.test(navigator.userAgent) && !/(Chrome\/|Edge\/)/.test(navigator.userAgent) && c.WorkerGlobalScope && c instanceof c.WorkerGlobalScope && [].concat(navigator.userAgent.match(/Safari\/(\d*)/))[1] < 604 && (t._hasGetAll = !1);
    }
    function Os(t) {
      return t.split(",").map(function(n, o) {
        var u = (n = n.trim()).replace(/([&*]|\+\+)/g, ""), l = /^\[/.test(u) ? u.match(/^\[(.*)\]$/)[1].split("+") : u;
        return ri(u, l || null, /\&/.test(n), /\*/.test(n), /\+\+/.test(n), m(l), o === 0);
      });
    }
    var lu = (ur.prototype._parseStoresSpec = function(t, n) {
      h(t).forEach(function(o) {
        if (t[o] !== null) {
          var u = Os(t[o]), l = u.shift();
          if (l.unique = !0, l.multi) throw new W.Schema("Primary key cannot be multi-valued");
          u.forEach(function(f) {
            if (f.auto) throw new W.Schema("Only primary key can be marked as autoIncrement (++)");
            if (!f.keyPath) throw new W.Schema("Index must have a name and cannot be an empty string");
          }), n[o] = ii(o, l, u);
        }
      });
    }, ur.prototype.stores = function(o) {
      var n = this.db;
      this._cfg.storesSource = this._cfg.storesSource ? v(this._cfg.storesSource, o) : o;
      var o = n._versions, u = {}, l = {};
      return o.forEach(function(f) {
        v(u, f._cfg.storesSource), l = f._cfg.dbschema = {}, f._parseStoresSpec(u, l);
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
        return U.letThrough = !0, t();
      });
    }
    function hi(t) {
      return !("from" in t);
    }
    var ke = function(t, n) {
      if (!this) {
        var o = new ke();
        return t && "d" in t && v(o, t), o;
      }
      v(this, arguments.length ? { d: 1, from: t, to: 1 < arguments.length ? n : t } : { d: 0 });
    };
    function kn(t, n, o) {
      var u = Q(n, o);
      if (!isNaN(u)) {
        if (0 < u) throw RangeError();
        if (hi(t)) return v(t, { from: n, to: o, d: 1 });
        var l = t.l, u = t.r;
        if (Q(o, t.from) < 0) return l ? kn(l, n, o) : t.l = { from: n, to: o, d: 1, l: null, r: null }, Is(t);
        if (0 < Q(n, t.to)) return u ? kn(u, n, o) : t.r = { from: n, to: o, d: 1, l: null, r: null }, Is(t);
        Q(n, t.from) < 0 && (t.from = n, t.l = null, t.d = u ? u.d + 1 : 1), 0 < Q(o, t.to) && (t.to = o, t.r = null, t.d = t.l ? t.l.d + 1 : 1), o = !t.r, l && !t.l && _n(t, l), u && o && _n(t, u);
      }
    }
    function _n(t, n) {
      hi(n) || function o(u, w) {
        var f = w.from, d = w.to, p = w.l, w = w.r;
        kn(u, f, d), p && o(u, p), w && o(u, w);
      }(t, n);
    }
    function Es(t, n) {
      var o = lr(n), u = o.next();
      if (u.done) return !1;
      for (var l = u.value, f = lr(t), d = f.next(l.from), p = d.value; !u.done && !d.done; ) {
        if (Q(p.from, l.to) <= 0 && 0 <= Q(p.to, l.from)) return !0;
        Q(l.from, p.from) < 0 ? l = (u = o.next(p.from)).value : p = (d = f.next(l.from)).value;
      }
      return !1;
    }
    function lr(t) {
      var n = hi(t) ? null : { s: 0, n: t };
      return { next: function(o) {
        for (var u = 0 < arguments.length; n; ) switch (n.s) {
          case 0:
            if (n.s = 1, u) for (; n.n.l && Q(o, n.n.from) < 0; ) n = { up: n, n: n.n.l, s: 1 };
            else for (; n.n.l; ) n = { up: n, n: n.n.l, s: 1 };
          case 1:
            if (n.s = 2, !u || Q(o, n.n.to) <= 0) return { value: n.n, done: !1 };
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
    function Is(t) {
      var n, o, u = (((n = t.r) === null || n === void 0 ? void 0 : n.d) || 0) - (((o = t.l) === null || o === void 0 ? void 0 : o.d) || 0), l = 1 < u ? "r" : u < -1 ? "l" : "";
      l && (n = l == "r" ? "l" : "r", o = i({}, t), u = t[l], t.from = u.from, t.to = u.to, t[l] = u[l], o[l] = u[n], (t[n] = o).d = As(o)), t.d = As(t);
    }
    function As(o) {
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
        return n[o] && Es(n[o], t[o]);
      });
    }
    z(ke.prototype, ((Ee = { add: function(t) {
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
      return n && Q(n.from, t) <= 0 && 0 <= Q(n.to, t);
    } })[qr] = function() {
      return lr(this);
    }, Ee));
    var bt = {}, mi = {}, pi = !1;
    function fr(t) {
      cr(mi, t), pi || (pi = !0, setTimeout(function() {
        pi = !1, yi(mi, !(mi = {}));
      }, 0));
    }
    function yi(t, n) {
      n === void 0 && (n = !1);
      var o = /* @__PURE__ */ new Set();
      if (t.all) for (var u = 0, l = Object.values(bt); u < l.length; u++) Cs(d = l[u], t, o, n);
      else for (var f in t) {
        var d, p = /^idb\:\/\/(.*)\/(.*)\//.exec(f);
        p && (f = p[1], p = p[2], (d = bt["idb://".concat(f, "/").concat(p)]) && Cs(d, t, o, n));
      }
      o.forEach(function(w) {
        return w();
      });
    }
    function Cs(t, n, o, u) {
      for (var l = [], f = 0, d = Object.entries(t.queries.query); f < d.length; f++) {
        for (var p = d[f], w = p[0], g = [], S = 0, y = p[1]; S < y.length; S++) {
          var x = y[S];
          di(n, x.obsSet) ? x.subscribers.forEach(function(k) {
            return o.add(k);
          }) : u && g.push(x);
        }
        u && l.push([w, g]);
      }
      if (u) for (var b = 0, _ = l; b < _.length; b++) {
        var T = _[b], w = T[0], g = T[1];
        t.queries.query[w] = g;
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
        if (n.openCanceller !== u) throw new W.DatabaseClosed("db.open() was cancelled");
      }
      function p() {
        return new L(function(x, b) {
          if (d(), !o) throw new W.MissingAPI();
          var _ = t.name, T = n.autoSchema || !l ? o.open(_) : o.open(_, l);
          if (!T) throw new W.MissingAPI();
          T.onerror = qe(b), T.onblocked = oe(t._fireOnBlocked), T.onupgradeneeded = oe(function(k) {
            var O;
            S = T.transaction, n.autoSchema && !t._options.allowEmptyDB ? (T.onerror = gn, S.abort(), T.result.close(), (O = o.deleteDatabase(_)).onsuccess = O.onerror = oe(function() {
              b(new W.NoSuchDatabase("Database ".concat(_, " doesnt exist")));
            })) : (S.onerror = qe(b), k = k.oldVersion > Math.pow(2, 62) ? 0 : k.oldVersion, y = k < 1, t.idbdb = T.result, f && uu(t, S), au(t, k / 10, S, b));
          }, b), T.onsuccess = oe(function() {
            S = null;
            var k, O, E, I, C, $ = t.idbdb = T.result, F = Re($.objectStoreNames);
            if (0 < F.length) try {
              var N = $.transaction((I = F).length === 1 ? I[0] : I, "readonly");
              if (n.autoSchema) O = $, E = N, (k = t).verno = O.version / 10, E = k._dbSchema = or(0, O, E), k._storeNames = Re(O.objectStoreNames, 0), ir(k, [k._allTables], h(E), E);
              else if (ar(t, t._dbSchema, N), ((C = ai(or(0, (C = t).idbdb, N), C._dbSchema)).add.length || C.change.some(function(P) {
                return P.add.length || P.change.length;
              })) && !f) return console.warn("Dexie SchemaDiff: Schema was extended without increasing the number passed to db.version(). Dexie will add missing parts and increment native version number to workaround this."), $.close(), l = $.version + 1, f = !0, x(p());
              rr(t, N);
            } catch {
            }
            Ft.push(t), $.onversionchange = oe(function(P) {
              n.vcFired = !0, t.on("versionchange").fire(P);
            }), $.onclose = oe(function(P) {
              t.on("close").fire(P);
            }), y && (C = t._deps, N = _, $ = C.indexedDB, C = C.IDBKeyRange, ci($) || N === Xn || li($, C).put({ name: N }).catch(ie)), x();
          }, b);
        }).catch(function(x) {
          switch (x == null ? void 0 : x.name) {
            case "UnknownError":
              if (0 < n.PR1398_maxLoop) return n.PR1398_maxLoop--, console.warn("Dexie: Workaround for Chrome UnknownError on open()"), p();
              break;
            case "VersionError":
              if (0 < l) return l = 0, p();
          }
          return L.reject(x);
        });
      }
      var w, g = n.dbReadyResolve, S = null, y = !1;
      return L.race([u, (typeof navigator > "u" ? L.resolve() : !navigator.userAgentData && /Safari\//.test(navigator.userAgent) && !/Chrom(e|ium)\//.test(navigator.userAgent) && indexedDB.databases ? new Promise(function(x) {
        function b() {
          return indexedDB.databases().finally(x);
        }
        w = setInterval(b, 100), b();
      }).finally(function() {
        return clearInterval(w);
      }) : Promise.resolve()).then(p)]).then(function() {
        return d(), n.onReadyBeingFired = [], L.resolve(fi(function() {
          return t.on.ready.fire(t.vip);
        })).then(function x() {
          if (0 < n.onReadyBeingFired.length) {
            var b = n.onReadyBeingFired.reduce(jr, ie);
            return n.onReadyBeingFired = [], L.resolve(fi(function() {
              return b(t.vip);
            })).then(x);
          }
        });
      }).finally(function() {
        n.openCanceller === u && (n.onReadyBeingFired = null, n.isBeingOpened = !1);
      }).catch(function(x) {
        n.dbOpenError = x;
        try {
          S && S.abort();
        } catch {
        }
        return u === n.openCanceller && t._close(), le(x);
      }).finally(function() {
        n.openComplete = !0, g();
      }).then(function() {
        var x;
        return y && (x = {}, t.tables.forEach(function(b) {
          b.schema.indexes.forEach(function(_) {
            _.name && (x["idb://".concat(t.name, "/").concat(b.name, "/").concat(_.name)] = new ke(-1 / 0, [[[]]]));
          }), x["idb://".concat(t.name, "/").concat(b.name, "/")] = x["idb://".concat(t.name, "/").concat(b.name, "/:dels")] = new ke(-1 / 0, [[[]]]);
        }), Qe(vn).fire(x), yi(x, !0)), t;
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
        return function(w) {
          var p = f(w), w = p.value;
          return p.done ? w : w && typeof w.then == "function" ? w.then(o, u) : m(w) ? Promise.all(w).then(o, u) : o(w);
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
        function d(y, x, b) {
          var _ = wn(y), T = l[_] = l[_] || [], k = y == null ? 0 : typeof y == "string" ? 1 : y.length, O = 0 < x, O = i(i({}, b), { name: O ? "".concat(_, "(virtual-from:").concat(b.name, ")") : b.name, lowLevelIndex: b, isVirtual: O, keyTail: x, keyLength: k, extractKey: si(y), unique: !O && b.unique });
          return T.push(O), O.isPrimaryKey || f.push(O), 1 < k && d(k === 2 ? y[0] : y.slice(0, k - 1), x + 1, b), T.sort(function(E, I) {
            return E.keyTail - I.keyTail;
          }), O;
        }
        n = d(u.primaryKey.keyPath, 0, u.primaryKey), l[":id"] = [n];
        for (var p = 0, w = u.indexes; p < w.length; p++) {
          var g = w[p];
          d(g.keyPath, 0, g);
        }
        function S(y) {
          var x, b = y.query.index;
          return b.isVirtual ? i(i({}, y), { query: { index: b.lowLevelIndex, range: (x = y.query.range, b = b.keyTail, { type: x.type === 1 ? 2 : x.type, lower: hr(x.lower, x.lowerOpen ? t.MAX_KEY : t.MIN_KEY, b), lowerOpen: !0, upper: hr(x.upper, x.upperOpen ? t.MIN_KEY : t.MAX_KEY, b), upperOpen: !0 }) } }) : y;
        }
        return i(i({}, o), { schema: i(i({}, u), { primaryKey: n, indexes: f, getIndexByKeyPath: function(y) {
          return (y = l[wn(y)]) && y[0];
        } }), count: function(y) {
          return o.count(S(y));
        }, query: function(y) {
          return o.query(S(y));
        }, openCursor: function(y) {
          var x = y.query.index, b = x.keyTail, _ = x.isVirtual, T = x.keyLength;
          return _ ? o.openCursor(S(y)).then(function(O) {
            return O && k(O);
          }) : o.openCursor(y);
          function k(O) {
            return Object.create(O, { continue: { value: function(E) {
              E != null ? O.continue(hr(E, y.reverse ? t.MAX_KEY : t.MIN_KEY, b)) : y.unique ? O.continue(O.key.slice(0, T).concat(y.reverse ? t.MIN_KEY : t.MAX_KEY, b)) : O.continue();
            } }, continuePrimaryKey: { value: function(E, I) {
              O.continuePrimaryKey(hr(E, t.MAX_KEY, b), I);
            } }, primaryKey: { get: function() {
              return O.primaryKey;
            } }, key: { get: function() {
              var E = O.key;
              return T === 1 ? E[0] : E.slice(0, T);
            } }, value: { get: function() {
              return O.value;
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
          var f = U.trans, d = f.table(n).hook, p = d.deleting, w = d.creating, g = d.updating;
          switch (l.type) {
            case "add":
              if (w.fire === ie) break;
              return f._promise("readwrite", function() {
                return S(l);
              }, !0);
            case "put":
              if (w.fire === ie && g.fire === ie) break;
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
                return function y(x, b, _) {
                  return o.query({ trans: x, values: !1, query: { index: u, range: b }, limit: _ }).then(function(T) {
                    var k = T.result;
                    return S({ type: "delete", keys: k, trans: x }).then(function(O) {
                      return 0 < O.numFailures ? Promise.reject(O.failures[0]) : k.length < _ ? { failures: [], numFailures: 0, lastResult: void 0 } : y(x, i(i({}, b), { lower: k[k.length - 1], lowerOpen: !0 }), _);
                    });
                  });
                }(l.trans, l.range, 1e4);
              }, !0);
          }
          return o.mutate(l);
          function S(y) {
            var x, b, _, T = U.trans, k = y.keys || bi(u, y);
            if (!k) throw new Error("Keys missing");
            return (y = y.type === "add" || y.type === "put" ? i(i({}, y), { keys: k }) : i({}, y)).type !== "delete" && (y.values = a([], y.values)), y.keys && (y.keys = a([], y.keys)), x = o, _ = k, ((b = y).type === "add" ? Promise.resolve([]) : x.getMany({ trans: b.trans, keys: _, cache: "immutable" })).then(function(O) {
              var E = k.map(function(I, C) {
                var $, F, N, P = O[C], R = { onerror: null, onsuccess: null };
                return y.type === "delete" ? p.fire.call(R, I, P, T) : y.type === "add" || P === void 0 ? ($ = w.fire.call(R, I, y.values[C], T), I == null && $ != null && (y.keys[C] = I = $, u.outbound || we(y.values[C], u.keyPath, I))) : ($ = vi(P, y.values[C]), (F = g.fire.call(R, $, I, P, T)) && (N = y.values[C], Object.keys(F).forEach(function(D) {
                  M(N, D) ? N[D] = F[D] : we(N, D, F[D]);
                }))), R;
              });
              return o.mutate(y).then(function(I) {
                for (var C = I.failures, $ = I.results, F = I.numFailures, I = I.lastResult, N = 0; N < k.length; ++N) {
                  var P = ($ || k)[N], R = E[N];
                  P == null ? R.onerror && R.onerror(C[N]) : R.onsuccess && R.onsuccess(y.type === "put" && O[N] ? y.values[N] : P);
                }
                return { failures: C, results: $, numFailures: F, lastResult: I };
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
    function Ds(t, n, o) {
      try {
        if (!n || n.keys.length < t.length) return null;
        for (var u = [], l = 0, f = 0; l < n.keys.length && f < t.length; ++l) Q(n.keys[l], t[f]) === 0 && (u.push(o ? ft(n.values[l]) : n.values[l]), ++f);
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
          var l = Ds(u.keys, u.trans._cache, u.cache === "clone");
          return l ? L.resolve(l) : o.getMany(u).then(function(f) {
            return u.trans._cache = { keys: u.keys, values: u.cache === "clone" ? ft(f) : f }, f;
          });
        }, mutate: function(u) {
          return u.type !== "add" && (u.trans._cache = null), o.mutate(u);
        } });
      } };
    } };
    function $s(t, n) {
      return t.trans.mode === "readonly" && !!t.subscr && !t.trans.explicit && t.trans.db._options.cache !== "disabled" && !n.schema.primaryKey.outbound;
    }
    function Ns(t, n) {
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
      var n = t.schema.name, o = new ke(t.MIN_KEY, t.MAX_KEY);
      return i(i({}, t), { transaction: function(u, l, f) {
        if (U.subscr && l !== "readonly") throw new W.ReadOnly("Readwrite transaction in liveQuery context. Querier source: ".concat(U.querier));
        return t.transaction(u, l, f);
      }, table: function(u) {
        var l = t.table(u), f = l.schema, d = f.primaryKey, y = f.indexes, p = d.extractKey, w = d.outbound, g = d.autoIncrement && y.filter(function(b) {
          return b.compound && b.keyPath.includes(d.keyPath);
        }), S = i(i({}, l), { mutate: function(b) {
          function _(D) {
            return D = "idb://".concat(n, "/").concat(u, "/").concat(D), I[D] || (I[D] = new ke());
          }
          var T, k, O, E = b.trans, I = b.mutatedParts || (b.mutatedParts = {}), C = _(""), $ = _(":dels"), F = b.type, R = b.type === "deleteRange" ? [b.range] : b.type === "delete" ? [b.keys] : b.values.length < 50 ? [bi(d, b).filter(function(D) {
            return D;
          }), b.values] : [], N = R[0], P = R[1], R = b.trans._cache;
          return m(N) ? (C.addKeys(N), (R = F === "delete" || N.length === P.length ? Ds(N, R) : null) || $.addKeys(N), (R || P) && (T = _, k = R, O = P, f.indexes.forEach(function(D) {
            var B = T(D.name || "");
            function H(Y) {
              return Y != null ? D.extractKey(Y) : null;
            }
            function J(Y) {
              return D.multiEntry && m(Y) ? Y.forEach(function($e) {
                return B.addKey($e);
              }) : B.addKey(Y);
            }
            (k || O).forEach(function(Y, pe) {
              var G = k && H(k[pe]), pe = O && H(O[pe]);
              Q(G, pe) !== 0 && (G != null && J(G), pe != null && J(pe));
            });
          }))) : N ? (P = { from: N.lower, to: N.upper }, $.add(P), C.add(P)) : (C.add(o), $.add(o), f.indexes.forEach(function(D) {
            return _(D.name).add(o);
          })), l.mutate(b).then(function(D) {
            return !N || b.type !== "add" && b.type !== "put" || (C.addKeys(D.results), g && g.forEach(function(B) {
              var H = b.values.map(function(Y) {
                return B.extractKey(Y);
              }), J = B.keyPath.findIndex(function(Y) {
                return Y === d.keyPath;
              });
              D.results.forEach(function(Y) {
                return H[J] = Y;
              }), _(B.name).addKeys(H);
            })), E.mutatedParts = cr(E.mutatedParts || {}, I), D;
          });
        } }), y = function(_) {
          var T = _.query, _ = T.index, T = T.range;
          return [_, new ke((_ = T.lower) !== null && _ !== void 0 ? _ : t.MIN_KEY, (T = T.upper) !== null && T !== void 0 ? T : t.MAX_KEY)];
        }, x = { get: function(b) {
          return [d, new ke(b.key)];
        }, getMany: function(b) {
          return [d, new ke().addKeys(b.keys)];
        }, count: y, query: y, openCursor: y };
        return h(x).forEach(function(b) {
          S[b] = function(_) {
            var T = U.subscr, k = !!T, O = $s(U, l) && Ns(b, _) ? _.obsSet = {} : T;
            if (k) {
              var E = function(P) {
                return P = "idb://".concat(n, "/").concat(u, "/").concat(P), O[P] || (O[P] = new ke());
              }, I = E(""), C = E(":dels"), T = x[b](_), k = T[0], T = T[1];
              if ((b === "query" && k.isPrimaryKey && !_.values ? C : E(k.name || "")).add(T), !k.isPrimaryKey) {
                if (b !== "count") {
                  var $ = b === "query" && w && _.values && l.query(i(i({}, _), { values: !1 }));
                  return l[b].apply(this, arguments).then(function(P) {
                    if (b === "query") {
                      if (w && _.values) return $.then(function(H) {
                        return H = H.result, I.addKeys(H), P;
                      });
                      var R = _.values ? P.result.map(p) : P.result;
                      (_.values ? I : C).addKeys(R);
                    } else if (b === "openCursor") {
                      var D = P, B = _.values;
                      return D && Object.create(D, { key: { get: function() {
                        return C.addKey(D.primaryKey), D.key;
                      } }, primaryKey: { get: function() {
                        var H = D.primaryKey;
                        return C.addKey(H), H;
                      } }, value: { get: function() {
                        return B && I.addKey(D.primaryKey), D.value;
                      } } });
                    }
                    return P;
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
    function Ms(t, n, o) {
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
      return o = t, ((u = n).lower === void 0 || (u.lowerOpen ? 0 < Q(o, u.lower) : 0 <= Q(o, u.lower))) && (t = t, (n = n).upper === void 0 || (n.upperOpen ? Q(t, n.upper) < 0 : Q(t, n.upper) <= 0));
      var o, u;
    }
    function Ps(t, n, x, u, l, f) {
      if (!x || x.length === 0) return t;
      var d = n.query.index, p = d.multiEntry, w = n.query.range, g = u.schema.primaryKey.extractKey, S = d.extractKey, y = (d.lowLevelIndex || d).extractKey, x = x.reduce(function(b, _) {
        var T = b, k = [];
        if (_.type === "add" || _.type === "put") for (var O = new ke(), E = _.values.length - 1; 0 <= E; --E) {
          var I, C = _.values[E], $ = g(C);
          O.hasKey($) || (I = S(C), (p && m(I) ? I.some(function(R) {
            return wi(R, w);
          }) : wi(I, w)) && (O.addKey($), k.push(C)));
        }
        switch (_.type) {
          case "add":
            T = b.concat(n.values ? k : k.map(function(D) {
              return g(D);
            }));
            break;
          case "put":
            var F = new ke().addKeys(_.values.map(function(D) {
              return g(D);
            })), T = b.filter(function(D) {
              return !F.hasKey(n.values ? g(D) : D);
            }).concat(n.values ? k : k.map(function(D) {
              return g(D);
            }));
            break;
          case "delete":
            var N = new ke().addKeys(_.keys);
            T = b.filter(function(D) {
              return !N.hasKey(n.values ? g(D) : D);
            });
            break;
          case "deleteRange":
            var P = _.range;
            T = b.filter(function(D) {
              return !wi(g(D), P);
            });
        }
        return T;
      }, t);
      return x === t ? t : (x.sort(function(b, _) {
        return Q(y(b), y(_)) || Q(g(b), g(_));
      }), n.limit && n.limit < 1 / 0 && (x.length > n.limit ? x.length = n.limit : t.length === n.limit && x.length < n.limit && (l.dirty = !0)), f ? Object.freeze(x) : x);
    }
    function Fs(t, n) {
      return Q(t.lower, n.lower) === 0 && Q(t.upper, n.upper) === 0 && !!t.lowerOpen == !!n.lowerOpen && !!t.upperOpen == !!n.upperOpen;
    }
    function pu(t, n) {
      return function(o, u, l, f) {
        if (o === void 0) return u !== void 0 ? -1 : 0;
        if (u === void 0) return 1;
        if ((u = Q(o, u)) === 0) {
          if (l && f) return 0;
          if (l) return 1;
          if (f) return -1;
        }
        return u;
      }(t.lower, n.lower, t.lowerOpen, n.lowerOpen) <= 0 && 0 <= function(o, u, l, f) {
        if (o === void 0) return u !== void 0 ? 1 : 0;
        if (u === void 0) return -1;
        if ((u = Q(o, u)) === 0) {
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
        return u === "readwrite" && (d = (f = new AbortController()).signal, l = function(w) {
          return function() {
            if (f.abort(), u === "readwrite") {
              for (var g = /* @__PURE__ */ new Set(), S = 0, y = o; S < y.length; S++) {
                var x = y[S], b = bt["idb://".concat(n, "/").concat(x)];
                if (b) {
                  var _ = t.table(x), T = b.optimisticOps.filter(function(B) {
                    return B.trans === p;
                  });
                  if (p._explicit && w && p.mutatedParts) for (var k = 0, O = Object.values(b.queries.query); k < O.length; k++) for (var E = 0, I = (F = O[k]).slice(); E < I.length; E++) di((N = I[E]).obsSet, p.mutatedParts) && (ht(F, N), N.subscribers.forEach(function(B) {
                    return g.add(B);
                  }));
                  else if (0 < T.length) {
                    b.optimisticOps = b.optimisticOps.filter(function(B) {
                      return B.trans !== p;
                    });
                    for (var C = 0, $ = Object.values(b.queries.query); C < $.length; C++) for (var F, N, P, R = 0, D = (F = $[C]).slice(); R < D.length; R++) (N = D[R]).res != null && p.mutatedParts && (w && !N.dirty ? (P = Object.isFrozen(N.res), P = Ps(N.res, N.req, T, _, N, P), N.dirty ? (ht(F, N), N.subscribers.forEach(function(B) {
                      return g.add(B);
                    })) : P !== N.res && (N.res = P, N.promise = L.resolve({ result: P }))) : (N.dirty && ht(F, N), N.subscribers.forEach(function(B) {
                      return g.add(B);
                    })));
                  }
                }
              }
              g.forEach(function(B) {
                return B();
              });
            }
          };
        }, p.addEventListener("abort", l(!1), { signal: d }), p.addEventListener("error", l(!1), { signal: d }), p.addEventListener("complete", l(!0), { signal: d })), p;
      }, table: function(o) {
        var u = t.table(o), l = u.schema.primaryKey;
        return i(i({}, u), { mutate: function(f) {
          var d = U.trans;
          if (l.outbound || d.db._options.cache === "disabled" || d.explicit) return u.mutate(f);
          var p = bt["idb://".concat(n, "/").concat(o)];
          return p ? (d = u.mutate(f), f.type !== "add" && f.type !== "put" || !(50 <= f.values.length || bi(l, f).some(function(w) {
            return w == null;
          })) ? (p.optimisticOps.push(f), f.mutatedParts && fr(f.mutatedParts), d.then(function(w) {
            0 < w.numFailures && (ht(p.optimisticOps, f), (w = Ms(0, f, w)) && p.optimisticOps.push(w), f.mutatedParts && fr(f.mutatedParts));
          }), d.catch(function() {
            ht(p.optimisticOps, f), f.mutatedParts && fr(f.mutatedParts);
          })) : d.then(function(w) {
            var g = Ms(0, i(i({}, f), { values: f.values.map(function(b, y) {
              var x, b = (x = l.keyPath) !== null && x !== void 0 && x.includes(".") ? ft(b) : i({}, b);
              return we(b, l.keyPath, w.results[y]), b;
            }) }), w);
            p.optimisticOps.push(g), queueMicrotask(function() {
              return f.mutatedParts && fr(f.mutatedParts);
            });
          }), d) : u.mutate(f);
        }, query: function(f) {
          if (!$s(U, u) || !Ns("query", f)) return u.query(f);
          var d = ((g = U.trans) === null || g === void 0 ? void 0 : g.db._options.cache) === "immutable", y = U, p = y.requery, w = y.signal, g = function(_, T, k, O) {
            var E = bt["idb://".concat(_, "/").concat(T)];
            if (!E) return [];
            if (!(T = E.queries[k])) return [null, !1, E, null];
            var I = T[(O.query ? O.query.index.name : null) || ""];
            if (!I) return [null, !1, E, null];
            switch (k) {
              case "query":
                var C = I.find(function($) {
                  return $.req.limit === O.limit && $.req.values === O.values && Fs($.req.query.range, O.query.range);
                });
                return C ? [C, !0, E, I] : [I.find(function($) {
                  return ("limit" in $.req ? $.req.limit : 1 / 0) >= O.limit && (!O.values || $.req.values) && pu($.req.query.range, O.query.range);
                }), !1, E, I];
              case "count":
                return C = I.find(function($) {
                  return Fs($.req.query.range, O.query.range);
                }), [C, !!C, E, I];
            }
          }(n, o, "query", f), S = g[0], y = g[1], x = g[2], b = g[3];
          return S && y ? S.obsSet = f.obsSet : (y = u.query(f).then(function(_) {
            var T = _.result;
            if (S && (S.res = T), d) {
              for (var k = 0, O = T.length; k < O; ++k) Object.freeze(T[k]);
              Object.freeze(T);
            } else _.result = ft(T);
            return _;
          }).catch(function(_) {
            return b && S && ht(b, S), Promise.reject(_);
          }), S = { obsSet: f.obsSet, promise: y, subscribers: /* @__PURE__ */ new Set(), type: "query", req: f, dirty: !1 }, b ? b.push(S) : (b = [S], (x = x || (bt["idb://".concat(n, "/").concat(o)] = { queries: { query: {}, count: {} }, objs: /* @__PURE__ */ new Map(), optimisticOps: [], unsignaledParts: {} })).queries.query[f.query.index.name || ""] = b)), yu(S, b, p, w), S.promise.then(function(_) {
            return { result: Ps(_.result, f, x == null ? void 0 : x.optimisticOps, u, S, d) };
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
      if (isNaN(t) || t < 0.1) throw new W.Type("Given version is not a positive number");
      if (t = Math.round(10 * t) / 10, this.idbdb || this._state.isBeingOpened) throw new W.Schema("Cannot add version when database is open");
      this.verno = Math.max(this.verno, t);
      var n = this._versions, o = n.filter(function(u) {
        return u._cfg.version === t;
      })[0];
      return o || (o = new this.Version(t), n.push(o), n.sort(ou), o.stores({}), this._state.autoSchema = !1, o);
    }, ce.prototype._whenReady = function(t) {
      var n = this;
      return this.idbdb && (this._state.openComplete || U.letThrough || this._vip) ? t() : new L(function(o, u) {
        if (n._state.openComplete) return u(new W.DatabaseClosed(n._state.dbOpenError));
        if (!n._state.isBeingOpened) {
          if (!n._state.autoOpen) return void u(new W.DatabaseClosed());
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
      return yt(He, function() {
        return cu(t);
      });
    }, ce.prototype._close = function() {
      var t = this._state, n = Ft.indexOf(this);
      if (0 <= n && Ft.splice(n, 1), this.idbdb) {
        try {
          this.idbdb.close();
        } catch {
        }
        this.idbdb = null;
      }
      t.isBeingOpened || (t.dbReadyPromise = new L(function(o) {
        t.dbReadyResolve = o;
      }), t.openCanceller = new L(function(o, u) {
        t.cancelOpen = u;
      }));
    }, ce.prototype.close = function(o) {
      var n = (o === void 0 ? { disableAutoOpen: !0 } : o).disableAutoOpen, o = this._state;
      n ? (o.isBeingOpened && o.cancelOpen(new W.DatabaseClosed()), this._close(), o.autoOpen = !1, o.dbOpenError = new W.DatabaseClosed()) : (this._close(), o.autoOpen = this._options.autoOpen || o.isBeingOpened, o.openComplete = !1, o.dbOpenError = null);
    }, ce.prototype.delete = function(t) {
      var n = this;
      t === void 0 && (t = { disableAutoOpen: !0 });
      var o = 0 < arguments.length && typeof arguments[0] != "object", u = this._state;
      return new L(function(l, f) {
        function d() {
          n.close(t);
          var p = n._deps.indexedDB.deleteDatabase(n.name);
          p.onsuccess = oe(function() {
            var w, g, S;
            w = n._deps, g = n.name, S = w.indexedDB, w = w.IDBKeyRange, ci(S) || g === Xn || li(S, w).delete(g).catch(ie), l();
          }), p.onerror = qe(f), p.onblocked = n._fireOnBlocked;
        }
        if (o) throw new W.InvalidArgument("Invalid closeOptions argument to db.delete()");
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
        if (l < 2) throw new W.InvalidArgument("Too few arguments");
        for (var f = new Array(l - 1); --l; ) f[l - 1] = arguments[l];
        return u = f.pop(), [n, Be(f), u];
      }).apply(this, arguments);
      return this._transaction.apply(this, t);
    }, ce.prototype._transaction = function(t, n, o) {
      var u = this, l = U.trans;
      l && l.db === this && t.indexOf("!") === -1 || (l = null);
      var f, d, p = t.indexOf("?") !== -1;
      t = t.replace("!", "").replace("?", "");
      try {
        if (d = n.map(function(g) {
          if (g = g instanceof u.Table ? g.name : g, typeof g != "string") throw new TypeError("Invalid table argument to Dexie.transaction(). Only Table or String are allowed");
          return g;
        }), t == "r" || t === Jr) f = Jr;
        else {
          if (t != "rw" && t != Xr) throw new W.InvalidArgument("Invalid transaction mode: " + t);
          f = Xr;
        }
        if (l) {
          if (l.mode === Jr && f === Xr) {
            if (!p) throw new W.SubTransaction("Cannot enter a sub-transaction with READWRITE mode when parent transaction is READONLY");
            l = null;
          }
          l && d.forEach(function(g) {
            if (l && l.storeNames.indexOf(g) === -1) {
              if (!p) throw new W.SubTransaction("Table " + g + " not included in parent transaction.");
              l = null;
            }
          }), p && l && !l.active && (l = null);
        }
      } catch (g) {
        return l ? l._promise(null, function(S, y) {
          y(g);
        }) : le(g);
      }
      var w = (function g(S, y, x, b, _) {
        return L.resolve().then(function() {
          var T = U.transless || U, k = S._createTransaction(y, x, S._dbSchema, b);
          if (k.explicit = !0, T = { trans: k, transless: T }, b) k.idbtrans = b.idbtrans;
          else try {
            k.create(), k.idbtrans._explicit = !0, S._state.PR1398_maxLoop = 3;
          } catch (I) {
            return I.name === Ur.InvalidState && S.isOpen() && 0 < --S._state.PR1398_maxLoop ? (console.warn("Dexie: Need to reopen db"), S.close({ disableAutoOpen: !1 }), S.open().then(function() {
              return g(S, y, x, null, _);
            })) : le(I);
          }
          var O, E = Lr(_);
          return E && Pt(), T = L.follow(function() {
            var I;
            (O = _.call(k, k)) && (E ? (I = Ge.bind(null, null), O.then(I, I)) : typeof O.next == "function" && typeof O.throw == "function" && (O = gi(O)));
          }, T), (O && typeof O.then == "function" ? L.resolve(O).then(function(I) {
            return k.active ? I : le(new W.PrematureCommit("Transaction committed too early. See http://bit.ly/2kdckMn"));
          }) : T.then(function() {
            return O;
          })).then(function(I) {
            return b && k._resolve(), k._completion.then(function() {
              return I;
            });
          }).catch(function(I) {
            return k._reject(I), le(I);
          });
        });
      }).bind(null, this, f, d, l, o);
      return l ? l._promise(f, w, "lock") : U.trans ? yt(U.transless, function() {
        return u._whenReady(w);
      }) : this._whenReady(w);
    }, ce.prototype.table = function(t) {
      if (!M(this._allTables, t)) throw new W.InvalidTable("Table ".concat(t, " does not exist"));
      return this._allTables[t];
    }, ce);
    function ce(t, n) {
      var o = this;
      this._middlewares = {}, this.verno = 0;
      var u = ce.dependencies;
      this._options = n = i({ addons: ce.addons, autoOpen: !0, indexedDB: u.indexedDB, IDBKeyRange: u.IDBKeyRange, cache: "cloned" }, n), this._deps = { indexedDB: n.indexedDB, IDBKeyRange: n.IDBKeyRange }, u = n.addons, this._dbSchema = {}, this._versions = [], this._storeNames = [], this._allTables = {}, this.idbdb = null, this._novip = this;
      var l, f, d, p, w, g = { dbOpenError: null, isBeingOpened: !1, onReadyBeingFired: null, openComplete: !1, dbReadyResolve: ie, dbReadyPromise: null, cancelOpen: ie, openCanceller: null, autoSchema: !0, PR1398_maxLoop: 3, autoOpen: n.autoOpen };
      g.dbReadyPromise = new L(function(y) {
        g.dbReadyResolve = y;
      }), g.openCanceller = new L(function(y, x) {
        g.cancelOpen = x;
      }), this._state = g, this.name = t, this.on = mn(this, "populate", "blocked", "versionchange", "close", { ready: [jr, ie] }), this.on.ready.subscribe = sn(this.on.ready.subscribe, function(y) {
        return function(x, b) {
          ce.vip(function() {
            var _, T = o._state;
            T.openComplete ? (T.dbOpenError || L.resolve().then(x), b && y(x)) : T.onReadyBeingFired ? (T.onReadyBeingFired.push(x), b && y(x)) : (y(x), _ = o, b || y(function k() {
              _.on.ready.unsubscribe(x), _.on.ready.unsubscribe(k);
            }));
          });
        };
      }), this.Collection = (l = this, pn(Qa.prototype, function(O, k) {
        this.db = l;
        var b = ds, _ = null;
        if (k) try {
          b = k();
        } catch (E) {
          _ = E;
        }
        var T = O._ctx, k = T.table, O = k.hook.reading.fire;
        this._ctx = { table: k, index: T.index, isPrimKey: !T.index || k.schema.primKey.keyPath && T.index === k.schema.primKey.name, range: b, keysOnly: !1, dir: "next", unique: "", algorithm: null, filter: null, replayFilter: null, justLimit: !0, isMatch: null, offset: 0, limit: 1 / 0, error: _, or: T.or, valueMapper: O !== un ? O : null };
      })), this.Table = (f = this, pn(gs.prototype, function(y, x, b) {
        this.db = f, this._tx = b, this.name = y, this.schema = x, this.hook = f._allTables[y] ? f._allTables[y].hook : mn(null, { creating: [Ka, ie], reading: [Wa, un], updating: [Za, ie], deleting: [za, ie] });
      })), this.Transaction = (d = this, pn(nu.prototype, function(y, x, b, _, T) {
        var k = this;
        this.db = d, this.mode = y, this.storeNames = x, this.schema = b, this.chromeTransactionDurability = _, this.idbtrans = null, this.on = mn(this, "complete", "error", "abort"), this.parent = T || null, this.active = !0, this._reculock = 0, this._blockedFuncs = [], this._resolve = null, this._reject = null, this._waitingFor = null, this._waitingQueue = null, this._spinCount = 0, this._completion = new L(function(O, E) {
          k._resolve = O, k._reject = E;
        }), this._completion.then(function() {
          k.active = !1, k.on.complete.fire();
        }, function(O) {
          var E = k.active;
          return k.active = !1, k.on.error.fire(O), k.parent ? k.parent._reject(O) : E && k.idbtrans && k.idbtrans.abort(), le(O);
        });
      })), this.Version = (p = this, pn(lu.prototype, function(y) {
        this.db = p, this._cfg = { version: y, storesSource: null, dbschema: {}, tables: {}, contentUpgrade: null };
      })), this.WhereClause = (w = this, pn(_s.prototype, function(y, x, b) {
        if (this.db = w, this._ctx = { table: y, index: x === ":id" ? null : x, or: b }, this._cmp = this._ascending = Q, this._descending = function(_, T) {
          return Q(T, _);
        }, this._max = function(_, T) {
          return 0 < Q(_, T) ? _ : T;
        }, this._min = function(_, T) {
          return Q(_, T) < 0 ? _ : T;
        }, this._IDBKeyRange = w._deps.IDBKeyRange, !this._IDBKeyRange) throw new W.MissingAPI();
      })), this.on("versionchange", function(y) {
        0 < y.newVersion ? console.warn("Another connection wants to upgrade database '".concat(o.name, "'. Closing db now to resume the upgrade.")) : console.warn("Another connection wants to delete database '".concat(o.name, "'. Closing db now to resume the delete request.")), o.close({ disableAutoOpen: !1 });
      }), this.on("blocked", function(y) {
        !y.newVersion || y.newVersion < y.oldVersion ? console.warn("Dexie.delete('".concat(o.name, "') was blocked")) : console.warn("Upgrade '".concat(o.name, "' blocked by other connection holding version ").concat(y.oldVersion / 10));
      }), this._maxKey = bn(n.IDBKeyRange), this._createTransaction = function(y, x, b, _) {
        return new o.Transaction(y, x, b, o._options.chromeTransactionDurability, _);
      }, this._fireOnBlocked = function(y) {
        o.on("blocked").fire(y), Ft.filter(function(x) {
          return x.name === o.name && x !== o && !x._state.vcFired;
        }).map(function(x) {
          return x.on("versionchange").fire(y);
        });
      }, this.use(du), this.use(gu), this.use(mu), this.use(fu), this.use(hu);
      var S = new Proxy(this, { get: function(y, x, b) {
        if (x === "_vip") return !0;
        if (x === "table") return function(T) {
          return dr(o.table(T), S);
        };
        var _ = Reflect.get(y, x, b);
        return _ instanceof gs ? dr(_, S) : x === "tables" ? _.map(function(T) {
          return dr(T, S);
        }) : x === "_createTransaction" ? function() {
          return dr(_.apply(this, arguments), S);
        } : _;
      } });
      this.vip = S, u.forEach(function(y) {
        return y(o);
      });
    }
    var mr, Ee = typeof Symbol < "u" && "observable" in Symbol ? Symbol.observable : "@@observable", vu = (ki.prototype.subscribe = function(t, n, o) {
      return this._subscribe(t && typeof t != "function" ? t : { next: t, error: n, complete: o });
    }, ki.prototype[Ee] = function() {
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
    function Rs(t) {
      var n, o = !1, u = new vu(function(l) {
        var f = Lr(t), d, p = !1, w = {}, g = {}, S = { get closed() {
          return p;
        }, unsubscribe: function() {
          p || (p = !0, d && d.abort(), y && Qe.storagemutated.unsubscribe(b));
        } };
        l.start && l.start(S);
        var y = !1, x = function() {
          return Gr(_);
        }, b = function(T) {
          cr(w, T), di(g, w) && x();
        }, _ = function() {
          var T, k, O;
          !p && mr.indexedDB && (w = {}, T = {}, d && d.abort(), d = new AbortController(), O = function(E) {
            var I = Nt();
            try {
              f && Pt();
              var C = Ye(t, E);
              return C = f ? C.finally(Ge) : C;
            } finally {
              I && Mt();
            }
          }(k = { subscr: T, signal: d.signal, requery: x, querier: t, trans: null }), Promise.resolve(O).then(function(E) {
            o = !0, n = E, p || k.signal.aborted || (w = {}, function(I) {
              for (var C in I) if (M(I, C)) return;
              return 1;
            }(g = T) || y || (Qe(vn, b), y = !0), Gr(function() {
              return !p && l.next && l.next(E);
            }));
          }, function(E) {
            o = !1, ["DatabaseClosedError", "AbortError"].includes(E == null ? void 0 : E.name) || p || Gr(function() {
              p || l.error && l.error(E);
            });
          }));
        };
        return setTimeout(x, 0), S;
      });
      return u.hasValue = function() {
        return o;
      }, u.getValue = function() {
        return n;
      }, u;
    }
    var wt = ze;
    function _i(t) {
      var n = et;
      try {
        et = !0, Qe.storagemutated.fire(t), yi(t, !0);
      } finally {
        et = n;
      }
    }
    z(wt, i(i({}, Wn), { delete: function(t) {
      return new wt(t, { addons: [] }).delete();
    }, exists: function(t) {
      return new wt(t, { addons: [] }).open().then(function(n) {
        return n.close(), !0;
      }).catch("NoSuchDatabaseError", function() {
        return !1;
      });
    }, getDatabaseNames: function(t) {
      try {
        return n = wt.dependencies, o = n.indexedDB, n = n.IDBKeyRange, (ci(o) ? Promise.resolve(o.databases()).then(function(u) {
          return u.map(function(l) {
            return l.name;
          }).filter(function(l) {
            return l !== Xn;
          });
        }) : li(o, n).toCollection().primaryKeys()).then(t);
      } catch {
        return le(new W.MissingAPI());
      }
      var n, o;
    }, defineClass: function() {
      return function(t) {
        v(this, t);
      };
    }, ignoreTransaction: function(t) {
      return U.trans ? yt(U.transless, t) : t();
    }, vip: fi, async: function(t) {
      return function() {
        try {
          var n = gi(t.apply(this, arguments));
          return n && typeof n.then == "function" ? n : L.resolve(n);
        } catch (o) {
          return le(o);
        }
      };
    }, spawn: function(t, n, o) {
      try {
        var u = gi(t.apply(o, n || []));
        return u && typeof u.then == "function" ? u : L.resolve(u);
      } catch (l) {
        return le(l);
      }
    }, currentTransaction: { get: function() {
      return U.trans || null;
    } }, waitFor: function(t, n) {
      return n = L.resolve(typeof t == "function" ? wt.ignoreTransaction(t) : t).timeout(n || 6e4), U.trans ? U.trans.waitFor(n) : n;
    }, Promise: L, debug: { get: function() {
      return Ve;
    }, set: function(t) {
      os(t);
    } }, derive: Se, extend: v, props: z, override: sn, Events: mn, on: Qe, liveQuery: Rs, extendObservabilitySet: cr, getByKeyPath: De, setByKeyPath: we, delByKeyPath: function(t, n) {
      typeof n == "string" ? we(t, n, void 0) : "length" in n && [].map.call(n, function(o) {
        we(t, o, void 0);
      });
    }, shallowClone: Ln, deepClone: ft, getObjectDiff: vi, cmp: Q, asap: on, minKey: -1 / 0, addons: [], connections: Ft, errnames: Ur, dependencies: mr, cache: bt, semVer: "4.0.8", version: "4.0.8".split(".").map(function(t) {
      return parseInt(t);
    }).reduce(function(t, n, o) {
      return t + n / Math.pow(10, 2 * o);
    }) })), wt.maxKey = bn(wt.dependencies.IDBKeyRange), typeof dispatchEvent < "u" && typeof addEventListener < "u" && (Qe(vn, function(t) {
      et || (t = new CustomEvent(ni, { detail: t }), et = !0, dispatchEvent(t), et = !1);
    }), addEventListener(ni, function(t) {
      t = t.detail, et || _i(t);
    }));
    var qt, et = !1, Vs = function() {
    };
    return typeof BroadcastChannel < "u" && ((Vs = function() {
      (qt = new BroadcastChannel(ni)).onmessage = function(t) {
        return t.data && _i(t.data);
      };
    })(), typeof qt.unref == "function" && qt.unref(), Qe(vn, function(t) {
      et || qt.postMessage(t);
    })), typeof addEventListener < "u" && (addEventListener("pagehide", function(t) {
      if (!ze.disableBfCache && t.persisted) {
        Ve && console.debug("Dexie: handling persisted pagehide"), qt != null && qt.close();
        for (var n = 0, o = Ft; n < o.length; n++) o[n].close({ disableAutoOpen: !1 });
      }
    }), addEventListener("pageshow", function(t) {
      !ze.disableBfCache && t.persisted && (Ve && console.debug("Dexie: handling persisted pageshow"), Vs(), _i({ all: new ke(-1 / 0, [[]]) }));
    })), L.rejectionMapper = function(t, n) {
      return !t || t instanceof Dt || t instanceof TypeError || t instanceof SyntaxError || !t.name || !ss[t.name] ? t : (n = new ss[t.name](n || t.message, t), "stack" in t && ee(n, "stack", { get: function() {
        return this.inner.stack;
      } }), n);
    }, os(Ve), i(ze, Object.freeze({ __proto__: null, Dexie: ze, liveQuery: Rs, Entity: ms, cmp: Q, PropModSymbol: Ke, PropModification: yn, replacePrefix: function(t, n) {
      return new yn({ replacePrefix: [t, n] });
    }, add: function(t) {
      return new yn({ add: t });
    }, remove: function(t) {
      return new yn({ remove: t });
    }, default: ze, RangeSet: ke, mergeRanges: _n, rangesOverlap: Es }), { default: ze }), ze;
  });
})(Va);
var Hc = Va.exports;
const Ki = /* @__PURE__ */ Bc(Hc), Io = Symbol.for("Dexie"), zi = globalThis[Io] || (globalThis[Io] = Ki);
if (Ki.semVer !== zi.semVer)
  throw new Error(`Two different versions of Dexie loaded in the same app: ${Ki.semVer} and ${zi.semVer}`);
class Qc {
  constructor(e) {
    this.apiContext = void 0, this.db = void 0, this.hasRefreshedFavourites = !1, this.hasRefreshedAll = !1, this.apiContext = e, this.db = this.initDb();
  }
  initDb() {
    const e = new zi("KioskTimeZones");
    return e.version(1).stores({
      kioskTimeZones: "&id, tz_long, tz_IANA, deprecated, version, favourite"
    }), e;
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
    return i.length > 0 ? i[0] : null;
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
        })), h = await this.db.kioskTimeZones.bulkAdd(r), console.log(`added ${h} new time zones `), this.hasRefreshedAll = !0;
      }
    }
  }
}
export {
  Qc as KioskTimeZones,
  Jc as kioskdatetime,
  Yc as kioskstandardlib,
  Gc as luxon
};
