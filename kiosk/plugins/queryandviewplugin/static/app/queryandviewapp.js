/**
 * @license
 * Copyright 2019 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const qt = window, xr = qt.ShadowRoot && (qt.ShadyCSS === void 0 || qt.ShadyCSS.nativeShadow) && "adoptedStyleSheets" in Document.prototype && "replace" in CSSStyleSheet.prototype, wr = Symbol(), io = /* @__PURE__ */ new WeakMap();
let Ar = class {
  constructor(t, e, i) {
    if (this._$cssResult$ = !0, i !== wr)
      throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");
    this.cssText = t, this.t = e;
  }
  get styleSheet() {
    let t = this.o;
    const e = this.t;
    if (xr && t === void 0) {
      const i = e !== void 0 && e.length === 1;
      i && (t = io.get(e)), t === void 0 && ((this.o = t = new CSSStyleSheet()).replaceSync(this.cssText), i && io.set(e, t));
    }
    return t;
  }
  toString() {
    return this.cssText;
  }
};
const We = (o) => new Ar(typeof o == "string" ? o : o + "", void 0, wr), _ = (o, ...t) => {
  const e = o.length === 1 ? o[0] : t.reduce((i, r, s) => i + ((n) => {
    if (n._$cssResult$ === !0)
      return n.cssText;
    if (typeof n == "number")
      return n;
    throw Error("Value passed to 'css' function must be a 'css' function result: " + n + ". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.");
  })(r) + o[s + 1], o[0]);
  return new Ar(e, o, wr);
}, Ua = (o, t) => {
  xr ? o.adoptedStyleSheets = t.map((e) => e instanceof CSSStyleSheet ? e : e.styleSheet) : t.forEach((e) => {
    const i = document.createElement("style"), r = qt.litNonce;
    r !== void 0 && i.setAttribute("nonce", r), i.textContent = e.cssText, o.appendChild(i);
  });
}, ro = xr ? (o) => o : (o) => o instanceof CSSStyleSheet ? ((t) => {
  let e = "";
  for (const i of t.cssRules)
    e += i.cssText;
  return We(e);
})(o) : o;
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
var vi;
const jt = window, oo = jt.trustedTypes, qa = oo ? oo.emptyScript : "", so = jt.reactiveElementPolyfillSupport, Wi = { toAttribute(o, t) {
  switch (t) {
    case Boolean:
      o = o ? qa : null;
      break;
    case Object:
    case Array:
      o = o == null ? o : JSON.stringify(o);
  }
  return o;
}, fromAttribute(o, t) {
  let e = o;
  switch (t) {
    case Boolean:
      e = o !== null;
      break;
    case Number:
      e = o === null ? null : Number(o);
      break;
    case Object:
    case Array:
      try {
        e = JSON.parse(o);
      } catch {
        e = null;
      }
  }
  return e;
} }, Gs = (o, t) => t !== o && (t == t || o == o), yi = { attribute: !0, type: String, converter: Wi, reflect: !1, hasChanged: Gs }, Gi = "finalized";
let De = class extends HTMLElement {
  constructor() {
    super(), this._$Ei = /* @__PURE__ */ new Map(), this.isUpdatePending = !1, this.hasUpdated = !1, this._$El = null, this.u();
  }
  static addInitializer(t) {
    var e;
    this.finalize(), ((e = this.h) !== null && e !== void 0 ? e : this.h = []).push(t);
  }
  static get observedAttributes() {
    this.finalize();
    const t = [];
    return this.elementProperties.forEach((e, i) => {
      const r = this._$Ep(i, e);
      r !== void 0 && (this._$Ev.set(r, i), t.push(r));
    }), t;
  }
  static createProperty(t, e = yi) {
    if (e.state && (e.attribute = !1), this.finalize(), this.elementProperties.set(t, e), !e.noAccessor && !this.prototype.hasOwnProperty(t)) {
      const i = typeof t == "symbol" ? Symbol() : "__" + t, r = this.getPropertyDescriptor(t, i, e);
      r !== void 0 && Object.defineProperty(this.prototype, t, r);
    }
  }
  static getPropertyDescriptor(t, e, i) {
    return { get() {
      return this[e];
    }, set(r) {
      const s = this[t];
      this[e] = r, this.requestUpdate(t, s, i);
    }, configurable: !0, enumerable: !0 };
  }
  static getPropertyOptions(t) {
    return this.elementProperties.get(t) || yi;
  }
  static finalize() {
    if (this.hasOwnProperty(Gi))
      return !1;
    this[Gi] = !0;
    const t = Object.getPrototypeOf(this);
    if (t.finalize(), t.h !== void 0 && (this.h = [...t.h]), this.elementProperties = new Map(t.elementProperties), this._$Ev = /* @__PURE__ */ new Map(), this.hasOwnProperty("properties")) {
      const e = this.properties, i = [...Object.getOwnPropertyNames(e), ...Object.getOwnPropertySymbols(e)];
      for (const r of i)
        this.createProperty(r, e[r]);
    }
    return this.elementStyles = this.finalizeStyles(this.styles), !0;
  }
  static finalizeStyles(t) {
    const e = [];
    if (Array.isArray(t)) {
      const i = new Set(t.flat(1 / 0).reverse());
      for (const r of i)
        e.unshift(ro(r));
    } else
      t !== void 0 && e.push(ro(t));
    return e;
  }
  static _$Ep(t, e) {
    const i = e.attribute;
    return i === !1 ? void 0 : typeof i == "string" ? i : typeof t == "string" ? t.toLowerCase() : void 0;
  }
  u() {
    var t;
    this._$E_ = new Promise((e) => this.enableUpdating = e), this._$AL = /* @__PURE__ */ new Map(), this._$Eg(), this.requestUpdate(), (t = this.constructor.h) === null || t === void 0 || t.forEach((e) => e(this));
  }
  addController(t) {
    var e, i;
    ((e = this._$ES) !== null && e !== void 0 ? e : this._$ES = []).push(t), this.renderRoot !== void 0 && this.isConnected && ((i = t.hostConnected) === null || i === void 0 || i.call(t));
  }
  removeController(t) {
    var e;
    (e = this._$ES) === null || e === void 0 || e.splice(this._$ES.indexOf(t) >>> 0, 1);
  }
  _$Eg() {
    this.constructor.elementProperties.forEach((t, e) => {
      this.hasOwnProperty(e) && (this._$Ei.set(e, this[e]), delete this[e]);
    });
  }
  createRenderRoot() {
    var t;
    const e = (t = this.shadowRoot) !== null && t !== void 0 ? t : this.attachShadow(this.constructor.shadowRootOptions);
    return Ua(e, this.constructor.elementStyles), e;
  }
  connectedCallback() {
    var t;
    this.renderRoot === void 0 && (this.renderRoot = this.createRenderRoot()), this.enableUpdating(!0), (t = this._$ES) === null || t === void 0 || t.forEach((e) => {
      var i;
      return (i = e.hostConnected) === null || i === void 0 ? void 0 : i.call(e);
    });
  }
  enableUpdating(t) {
  }
  disconnectedCallback() {
    var t;
    (t = this._$ES) === null || t === void 0 || t.forEach((e) => {
      var i;
      return (i = e.hostDisconnected) === null || i === void 0 ? void 0 : i.call(e);
    });
  }
  attributeChangedCallback(t, e, i) {
    this._$AK(t, i);
  }
  _$EO(t, e, i = yi) {
    var r;
    const s = this.constructor._$Ep(t, i);
    if (s !== void 0 && i.reflect === !0) {
      const n = (((r = i.converter) === null || r === void 0 ? void 0 : r.toAttribute) !== void 0 ? i.converter : Wi).toAttribute(e, i.type);
      this._$El = t, n == null ? this.removeAttribute(s) : this.setAttribute(s, n), this._$El = null;
    }
  }
  _$AK(t, e) {
    var i;
    const r = this.constructor, s = r._$Ev.get(t);
    if (s !== void 0 && this._$El !== s) {
      const n = r.getPropertyOptions(s), a = typeof n.converter == "function" ? { fromAttribute: n.converter } : ((i = n.converter) === null || i === void 0 ? void 0 : i.fromAttribute) !== void 0 ? n.converter : Wi;
      this._$El = s, this[s] = a.fromAttribute(e, n.type), this._$El = null;
    }
  }
  requestUpdate(t, e, i) {
    let r = !0;
    t !== void 0 && (((i = i || this.constructor.getPropertyOptions(t)).hasChanged || Gs)(this[t], e) ? (this._$AL.has(t) || this._$AL.set(t, e), i.reflect === !0 && this._$El !== t && (this._$EC === void 0 && (this._$EC = /* @__PURE__ */ new Map()), this._$EC.set(t, i))) : r = !1), !this.isUpdatePending && r && (this._$E_ = this._$Ej());
  }
  async _$Ej() {
    this.isUpdatePending = !0;
    try {
      await this._$E_;
    } catch (e) {
      Promise.reject(e);
    }
    const t = this.scheduleUpdate();
    return t != null && await t, !this.isUpdatePending;
  }
  scheduleUpdate() {
    return this.performUpdate();
  }
  performUpdate() {
    var t;
    if (!this.isUpdatePending)
      return;
    this.hasUpdated, this._$Ei && (this._$Ei.forEach((r, s) => this[s] = r), this._$Ei = void 0);
    let e = !1;
    const i = this._$AL;
    try {
      e = this.shouldUpdate(i), e ? (this.willUpdate(i), (t = this._$ES) === null || t === void 0 || t.forEach((r) => {
        var s;
        return (s = r.hostUpdate) === null || s === void 0 ? void 0 : s.call(r);
      }), this.update(i)) : this._$Ek();
    } catch (r) {
      throw e = !1, this._$Ek(), r;
    }
    e && this._$AE(i);
  }
  willUpdate(t) {
  }
  _$AE(t) {
    var e;
    (e = this._$ES) === null || e === void 0 || e.forEach((i) => {
      var r;
      return (r = i.hostUpdated) === null || r === void 0 ? void 0 : r.call(i);
    }), this.hasUpdated || (this.hasUpdated = !0, this.firstUpdated(t)), this.updated(t);
  }
  _$Ek() {
    this._$AL = /* @__PURE__ */ new Map(), this.isUpdatePending = !1;
  }
  get updateComplete() {
    return this.getUpdateComplete();
  }
  getUpdateComplete() {
    return this._$E_;
  }
  shouldUpdate(t) {
    return !0;
  }
  update(t) {
    this._$EC !== void 0 && (this._$EC.forEach((e, i) => this._$EO(i, this[i], e)), this._$EC = void 0), this._$Ek();
  }
  updated(t) {
  }
  firstUpdated(t) {
  }
};
De[Gi] = !0, De.elementProperties = /* @__PURE__ */ new Map(), De.elementStyles = [], De.shadowRootOptions = { mode: "open" }, so == null || so({ ReactiveElement: De }), ((vi = jt.reactiveElementVersions) !== null && vi !== void 0 ? vi : jt.reactiveElementVersions = []).push("1.6.2");
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
var Ci;
const Yt = window, Le = Yt.trustedTypes, no = Le ? Le.createPolicy("lit-html", { createHTML: (o) => o }) : void 0, ji = "$lit$", oe = `lit$${(Math.random() + "").slice(9)}$`, js = "?" + oe, Wa = `<${js}>`, xe = document, ht = () => xe.createComment(""), ut = (o) => o === null || typeof o != "object" && typeof o != "function", Ys = Array.isArray, Ga = (o) => Ys(o) || typeof (o == null ? void 0 : o[Symbol.iterator]) == "function", xi = `[ 	
\f\r]`, Ke = /<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g, ao = /-->/g, lo = />/g, fe = RegExp(`>|${xi}(?:([^\\s"'>=/]+)(${xi}*=${xi}*(?:[^ 	
\f\r"'\`<>=]|("|')|))|$)`, "g"), co = /'/g, ho = /"/g, Ks = /^(?:script|style|textarea|title)$/i, ja = (o) => (t, ...e) => ({ _$litType$: o, strings: t, values: e }), y = ja(1), we = Symbol.for("lit-noChange"), b = Symbol.for("lit-nothing"), uo = /* @__PURE__ */ new WeakMap(), be = xe.createTreeWalker(xe, 129, null, !1), Ya = (o, t) => {
  const e = o.length - 1, i = [];
  let r, s = t === 2 ? "<svg>" : "", n = Ke;
  for (let l = 0; l < e; l++) {
    const d = o[l];
    let c, h, u = -1, p = 0;
    for (; p < d.length && (n.lastIndex = p, h = n.exec(d), h !== null); )
      p = n.lastIndex, n === Ke ? h[1] === "!--" ? n = ao : h[1] !== void 0 ? n = lo : h[2] !== void 0 ? (Ks.test(h[2]) && (r = RegExp("</" + h[2], "g")), n = fe) : h[3] !== void 0 && (n = fe) : n === fe ? h[0] === ">" ? (n = r ?? Ke, u = -1) : h[1] === void 0 ? u = -2 : (u = n.lastIndex - h[2].length, c = h[1], n = h[3] === void 0 ? fe : h[3] === '"' ? ho : co) : n === ho || n === co ? n = fe : n === ao || n === lo ? n = Ke : (n = fe, r = void 0);
    const f = n === fe && o[l + 1].startsWith("/>") ? " " : "";
    s += n === Ke ? d + Wa : u >= 0 ? (i.push(c), d.slice(0, u) + ji + d.slice(u) + oe + f) : d + oe + (u === -2 ? (i.push(void 0), l) : f);
  }
  const a = s + (o[e] || "<?>") + (t === 2 ? "</svg>" : "");
  if (!Array.isArray(o) || !o.hasOwnProperty("raw"))
    throw Error("invalid template strings array");
  return [no !== void 0 ? no.createHTML(a) : a, i];
};
class pt {
  constructor({ strings: t, _$litType$: e }, i) {
    let r;
    this.parts = [];
    let s = 0, n = 0;
    const a = t.length - 1, l = this.parts, [d, c] = Ya(t, e);
    if (this.el = pt.createElement(d, i), be.currentNode = this.el.content, e === 2) {
      const h = this.el.content, u = h.firstChild;
      u.remove(), h.append(...u.childNodes);
    }
    for (; (r = be.nextNode()) !== null && l.length < a; ) {
      if (r.nodeType === 1) {
        if (r.hasAttributes()) {
          const h = [];
          for (const u of r.getAttributeNames())
            if (u.endsWith(ji) || u.startsWith(oe)) {
              const p = c[n++];
              if (h.push(u), p !== void 0) {
                const f = r.getAttribute(p.toLowerCase() + ji).split(oe), x = /([.?@])?(.*)/.exec(p);
                l.push({ type: 1, index: s, name: x[2], strings: f, ctor: x[1] === "." ? Qa : x[1] === "?" ? Xa : x[1] === "@" ? Ja : si });
              } else
                l.push({ type: 6, index: s });
            }
          for (const u of h)
            r.removeAttribute(u);
        }
        if (Ks.test(r.tagName)) {
          const h = r.textContent.split(oe), u = h.length - 1;
          if (u > 0) {
            r.textContent = Le ? Le.emptyScript : "";
            for (let p = 0; p < u; p++)
              r.append(h[p], ht()), be.nextNode(), l.push({ type: 2, index: ++s });
            r.append(h[u], ht());
          }
        }
      } else if (r.nodeType === 8)
        if (r.data === js)
          l.push({ type: 2, index: s });
        else {
          let h = -1;
          for (; (h = r.data.indexOf(oe, h + 1)) !== -1; )
            l.push({ type: 7, index: s }), h += oe.length - 1;
        }
      s++;
    }
  }
  static createElement(t, e) {
    const i = xe.createElement("template");
    return i.innerHTML = t, i;
  }
}
function Be(o, t, e = o, i) {
  var r, s, n, a;
  if (t === we)
    return t;
  let l = i !== void 0 ? (r = e._$Co) === null || r === void 0 ? void 0 : r[i] : e._$Cl;
  const d = ut(t) ? void 0 : t._$litDirective$;
  return (l == null ? void 0 : l.constructor) !== d && ((s = l == null ? void 0 : l._$AO) === null || s === void 0 || s.call(l, !1), d === void 0 ? l = void 0 : (l = new d(o), l._$AT(o, e, i)), i !== void 0 ? ((n = (a = e)._$Co) !== null && n !== void 0 ? n : a._$Co = [])[i] = l : e._$Cl = l), l !== void 0 && (t = Be(o, l._$AS(o, t.values), l, i)), t;
}
let Ka = class {
  constructor(t, e) {
    this._$AV = [], this._$AN = void 0, this._$AD = t, this._$AM = e;
  }
  get parentNode() {
    return this._$AM.parentNode;
  }
  get _$AU() {
    return this._$AM._$AU;
  }
  u(t) {
    var e;
    const { el: { content: i }, parts: r } = this._$AD, s = ((e = t == null ? void 0 : t.creationScope) !== null && e !== void 0 ? e : xe).importNode(i, !0);
    be.currentNode = s;
    let n = be.nextNode(), a = 0, l = 0, d = r[0];
    for (; d !== void 0; ) {
      if (a === d.index) {
        let c;
        d.type === 2 ? c = new xt(n, n.nextSibling, this, t) : d.type === 1 ? c = new d.ctor(n, d.name, d.strings, this, t) : d.type === 6 && (c = new el(n, this, t)), this._$AV.push(c), d = r[++l];
      }
      a !== (d == null ? void 0 : d.index) && (n = be.nextNode(), a++);
    }
    return be.currentNode = xe, s;
  }
  v(t) {
    let e = 0;
    for (const i of this._$AV)
      i !== void 0 && (i.strings !== void 0 ? (i._$AI(t, i, e), e += i.strings.length - 2) : i._$AI(t[e])), e++;
  }
};
class xt {
  constructor(t, e, i, r) {
    var s;
    this.type = 2, this._$AH = b, this._$AN = void 0, this._$AA = t, this._$AB = e, this._$AM = i, this.options = r, this._$Cp = (s = r == null ? void 0 : r.isConnected) === null || s === void 0 || s;
  }
  get _$AU() {
    var t, e;
    return (e = (t = this._$AM) === null || t === void 0 ? void 0 : t._$AU) !== null && e !== void 0 ? e : this._$Cp;
  }
  get parentNode() {
    let t = this._$AA.parentNode;
    const e = this._$AM;
    return e !== void 0 && (t == null ? void 0 : t.nodeType) === 11 && (t = e.parentNode), t;
  }
  get startNode() {
    return this._$AA;
  }
  get endNode() {
    return this._$AB;
  }
  _$AI(t, e = this) {
    t = Be(this, t, e), ut(t) ? t === b || t == null || t === "" ? (this._$AH !== b && this._$AR(), this._$AH = b) : t !== this._$AH && t !== we && this._(t) : t._$litType$ !== void 0 ? this.g(t) : t.nodeType !== void 0 ? this.$(t) : Ga(t) ? this.T(t) : this._(t);
  }
  k(t) {
    return this._$AA.parentNode.insertBefore(t, this._$AB);
  }
  $(t) {
    this._$AH !== t && (this._$AR(), this._$AH = this.k(t));
  }
  _(t) {
    this._$AH !== b && ut(this._$AH) ? this._$AA.nextSibling.data = t : this.$(xe.createTextNode(t)), this._$AH = t;
  }
  g(t) {
    var e;
    const { values: i, _$litType$: r } = t, s = typeof r == "number" ? this._$AC(t) : (r.el === void 0 && (r.el = pt.createElement(r.h, this.options)), r);
    if (((e = this._$AH) === null || e === void 0 ? void 0 : e._$AD) === s)
      this._$AH.v(i);
    else {
      const n = new Ka(s, this), a = n.u(this.options);
      n.v(i), this.$(a), this._$AH = n;
    }
  }
  _$AC(t) {
    let e = uo.get(t.strings);
    return e === void 0 && uo.set(t.strings, e = new pt(t)), e;
  }
  T(t) {
    Ys(this._$AH) || (this._$AH = [], this._$AR());
    const e = this._$AH;
    let i, r = 0;
    for (const s of t)
      r === e.length ? e.push(i = new xt(this.k(ht()), this.k(ht()), this, this.options)) : i = e[r], i._$AI(s), r++;
    r < e.length && (this._$AR(i && i._$AB.nextSibling, r), e.length = r);
  }
  _$AR(t = this._$AA.nextSibling, e) {
    var i;
    for ((i = this._$AP) === null || i === void 0 || i.call(this, !1, !0, e); t && t !== this._$AB; ) {
      const r = t.nextSibling;
      t.remove(), t = r;
    }
  }
  setConnected(t) {
    var e;
    this._$AM === void 0 && (this._$Cp = t, (e = this._$AP) === null || e === void 0 || e.call(this, t));
  }
}
class si {
  constructor(t, e, i, r, s) {
    this.type = 1, this._$AH = b, this._$AN = void 0, this.element = t, this.name = e, this._$AM = r, this.options = s, i.length > 2 || i[0] !== "" || i[1] !== "" ? (this._$AH = Array(i.length - 1).fill(new String()), this.strings = i) : this._$AH = b;
  }
  get tagName() {
    return this.element.tagName;
  }
  get _$AU() {
    return this._$AM._$AU;
  }
  _$AI(t, e = this, i, r) {
    const s = this.strings;
    let n = !1;
    if (s === void 0)
      t = Be(this, t, e, 0), n = !ut(t) || t !== this._$AH && t !== we, n && (this._$AH = t);
    else {
      const a = t;
      let l, d;
      for (t = s[0], l = 0; l < s.length - 1; l++)
        d = Be(this, a[i + l], e, l), d === we && (d = this._$AH[l]), n || (n = !ut(d) || d !== this._$AH[l]), d === b ? t = b : t !== b && (t += (d ?? "") + s[l + 1]), this._$AH[l] = d;
    }
    n && !r && this.j(t);
  }
  j(t) {
    t === b ? this.element.removeAttribute(this.name) : this.element.setAttribute(this.name, t ?? "");
  }
}
let Qa = class extends si {
  constructor() {
    super(...arguments), this.type = 3;
  }
  j(t) {
    this.element[this.name] = t === b ? void 0 : t;
  }
};
const Za = Le ? Le.emptyScript : "";
class Xa extends si {
  constructor() {
    super(...arguments), this.type = 4;
  }
  j(t) {
    t && t !== b ? this.element.setAttribute(this.name, Za) : this.element.removeAttribute(this.name);
  }
}
let Ja = class extends si {
  constructor(t, e, i, r, s) {
    super(t, e, i, r, s), this.type = 5;
  }
  _$AI(t, e = this) {
    var i;
    if ((t = (i = Be(this, t, e, 0)) !== null && i !== void 0 ? i : b) === we)
      return;
    const r = this._$AH, s = t === b && r !== b || t.capture !== r.capture || t.once !== r.once || t.passive !== r.passive, n = t !== b && (r === b || s);
    s && this.element.removeEventListener(this.name, this, r), n && this.element.addEventListener(this.name, this, t), this._$AH = t;
  }
  handleEvent(t) {
    var e, i;
    typeof this._$AH == "function" ? this._$AH.call((i = (e = this.options) === null || e === void 0 ? void 0 : e.host) !== null && i !== void 0 ? i : this.element, t) : this._$AH.handleEvent(t);
  }
}, el = class {
  constructor(t, e, i) {
    this.element = t, this.type = 6, this._$AN = void 0, this._$AM = e, this.options = i;
  }
  get _$AU() {
    return this._$AM._$AU;
  }
  _$AI(t) {
    Be(this, t);
  }
};
const po = Yt.litHtmlPolyfillSupport;
po == null || po(pt, xt), ((Ci = Yt.litHtmlVersions) !== null && Ci !== void 0 ? Ci : Yt.litHtmlVersions = []).push("2.7.4");
const Qs = (o, t, e) => {
  var i, r;
  const s = (i = e == null ? void 0 : e.renderBefore) !== null && i !== void 0 ? i : t;
  let n = s._$litPart$;
  if (n === void 0) {
    const a = (r = e == null ? void 0 : e.renderBefore) !== null && r !== void 0 ? r : null;
    s._$litPart$ = n = new xt(t.insertBefore(ht(), a), a, void 0, e ?? {});
  }
  return n._$AI(o), n;
};
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
var wi, Ai;
let ne = class extends De {
  constructor() {
    super(...arguments), this.renderOptions = { host: this }, this._$Do = void 0;
  }
  createRenderRoot() {
    var t, e;
    const i = super.createRenderRoot();
    return (t = (e = this.renderOptions).renderBefore) !== null && t !== void 0 || (e.renderBefore = i.firstChild), i;
  }
  update(t) {
    const e = this.render();
    this.hasUpdated || (this.renderOptions.isConnected = this.isConnected), super.update(t), this._$Do = Qs(e, this.renderRoot, this.renderOptions);
  }
  connectedCallback() {
    var t;
    super.connectedCallback(), (t = this._$Do) === null || t === void 0 || t.setConnected(!0);
  }
  disconnectedCallback() {
    var t;
    super.disconnectedCallback(), (t = this._$Do) === null || t === void 0 || t.setConnected(!1);
  }
  render() {
    return we;
  }
};
ne.finalized = !0, ne._$litElement$ = !0, (wi = globalThis.litElementHydrateSupport) === null || wi === void 0 || wi.call(globalThis, { LitElement: ne });
const _o = globalThis.litElementPolyfillSupport;
_o == null || _o({ LitElement: ne });
((Ai = globalThis.litElementVersions) !== null && Ai !== void 0 ? Ai : globalThis.litElementVersions = []).push("3.3.2");
const Zs = 2, Yi = 3;
class Xs extends ne {
  constructor() {
    super(), this.kiosk_base_url = "/", this.appErrors = [], this.apiContext = void 0, this.showProgress = !1;
  }
  onAppMessage(t) {
    this.addAppError(t.detail.headline + "<br>" + t.detail.body);
  }
  firstUpdated(t) {
    super.firstUpdated(t), this.addEventListener("send-message", this.onAppMessage);
  }
  updated(t) {
    t.has("apiContext") && (this.showProgress = !1, this.apiContext && this.apiContext.status === Yi && this.addAppError("Cannot connect to Kiosk API."));
  }
  render() {
    let t;
    return this.apiContext && this.apiContext.status === Zs ? t = this.apiRender() : this.apiContext && this.apiContext.status === Yi ? t = this.renderApiError() : t = this.renderNoContextYet(), y`
            <style>
                .system-message {
                    border-style: solid;
                    border-width: 2px;
                    padding: 2px 1em;
                    position: relative;
                    margin-bottom: 10px;
                    background: linear-gradient(135deg, #882501, #bb3302);
                    color: #fabc02;
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
            ${this.renderProgress()} ${this.renderErrors()} ${t}
        `;
  }
  renderNoContextYet() {
    return y` <link rel="stylesheet" href="${this.kiosk_base_url}static/styles.css" /> `;
  }
  renderApiError() {
  }
  renderErrors() {
    if (this.appErrors.length > 0)
      return y` ${this.appErrors.map((t) => y`<div class="system-message" @click="${this.errorClicked}">${t}</div>`)} `;
  }
  errorClicked(t) {
    this.deleteError(t.target.textContent);
  }
  renderProgress(t = !1) {
    if (t || this.showProgress)
      return y` <div class="loading">
                <div class="loading-progress"></div>
            </div>`;
  }
  addAppError(t) {
    this.appErrors.push(t), this.requestUpdate();
  }
  deleteError(t) {
    let e = -1;
    this.appErrors.find((i, r) => i === t ? (e = r, !0) : !1), e > -1 && (this.appErrors.splice(e, 1), this.appErrors = [...this.appErrors]);
  }
}
Xs.properties = {
  /**
   * The Api Context
   */
  apiContext: { type: Object },
  appErrors: { type: Array },
  showProgress: { type: Boolean }
};
/**
 * @license
 * Copyright 2020 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const Js = Symbol.for(""), tl = (o) => {
  if ((o == null ? void 0 : o.r) === Js)
    return o == null ? void 0 : o._$litStatic$;
}, Ki = (o, ...t) => ({ _$litStatic$: t.reduce((e, i, r) => e + ((s) => {
  if (s._$litStatic$ !== void 0)
    return s._$litStatic$;
  throw Error(`Value passed to 'literal' function must be a 'literal' result: ${s}. Use 'unsafeStatic' to pass non-literal values, but
            take care to ensure page security.`);
})(i) + o[r + 1], o[0]), r: Js }), fo = /* @__PURE__ */ new Map(), il = (o) => (t, ...e) => {
  const i = e.length;
  let r, s;
  const n = [], a = [];
  let l, d = 0, c = !1;
  for (; d < i; ) {
    for (l = t[d]; d < i && (s = e[d], (r = tl(s)) !== void 0); )
      l += r + t[++d], c = !0;
    d !== i && a.push(s), n.push(l), d++;
  }
  if (d === i && n.push(t[i]), c) {
    const h = n.join("$$lit$$");
    (t = fo.get(h)) === void 0 && (n.raw = n, fo.set(h, t = n)), e = a;
  }
  return o(t, ...e);
}, E = il(y);
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const ee = (o) => (t) => typeof t == "function" ? ((e, i) => (customElements.define(e, i), i))(o, t) : ((e, i) => {
  const { kind: r, elements: s } = i;
  return { kind: r, elements: s, finisher(n) {
    customElements.define(e, n);
  } };
})(o, t);
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const rl = (o, t) => t.kind === "method" && t.descriptor && !("value" in t.descriptor) ? { ...t, finisher(e) {
  e.createProperty(t.key, o);
} } : { kind: "field", key: Symbol(), placement: "own", descriptor: {}, originalKey: t.key, initializer() {
  typeof t.initializer == "function" && (this[t.key] = t.initializer.call(this));
}, finisher(e) {
  e.createProperty(t.key, o);
} }, ol = (o, t, e) => {
  t.constructor.createProperty(e, o);
};
function C(o) {
  return (t, e) => e !== void 0 ? ol(o, t, e) : rl(o, t);
}
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
function R(o) {
  return C({ ...o, state: !0 });
}
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const sl = ({ finisher: o, descriptor: t }) => (e, i) => {
  var r;
  if (i === void 0) {
    const s = (r = e.originalKey) !== null && r !== void 0 ? r : e.key, n = t != null ? { kind: "method", placement: "prototype", key: s, descriptor: t(e.key) } : { ...e, key: s };
    return o != null && (n.finisher = function(a) {
      o(a, s);
    }), n;
  }
  {
    const s = e.constructor;
    t !== void 0 && Object.defineProperty(e, i, t(i)), o == null || o(s, i);
  }
};
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
function ke(o, t) {
  return sl({ descriptor: (e) => {
    const i = { get() {
      var r, s;
      return (s = (r = this.renderRoot) === null || r === void 0 ? void 0 : r.querySelector(o)) !== null && s !== void 0 ? s : null;
    }, enumerable: !0, configurable: !0 };
    if (t) {
      const r = typeof e == "symbol" ? Symbol() : "__" + e;
      i.get = function() {
        var s, n;
        return this[r] === void 0 && (this[r] = (n = (s = this.renderRoot) === null || s === void 0 ? void 0 : s.querySelector(o)) !== null && n !== void 0 ? n : null), this[r];
      };
    }
    return i;
  } });
}
/**
 * @license
 * Copyright 2021 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
var ki;
((ki = window.HTMLSlotElement) === null || ki === void 0 ? void 0 : ki.prototype.assignedElements) != null;
const nl = `.col-bg-body-lighter{background-color:var(--col-bg-body-lighter)}.col-bg-body{background-color:var(--col-bg-body)}.col-bg-body-darker{background-color:var(--col-bg-body-darker)}.col-bg-1-lighter{background-color:var(--col-bg-1-lighter)}.col-bg-1{background-color:var(--col-bg-1)}.col-bg-1-darker{background-color:var(--col-bg-1-darker)}.col-bg-1-input{background-color:var(--col-bg-1-input)}.col-primary-bg-1{background-color:var(--col-primary-bg-1)}.col-accent-bg-1{background-color:var(--col-accent-bg-1)}.col-success-bg-1{background-color:var(--col-success-bg-1)}.col-warning-bg-1{background-color:var(--col-warning-bg-1)}.col-error-bg-1{background-color:var(--col-error-bg-1)}.col-bg-2-lighter{background-color:var(--col-bg-2-lighter)}.col-bg-2{background-color:var(--col-bg-2)}.col-bg-2-darker{background-color:var(--col-bg-2-darker)}.col-bg-2-button{background-color:var(--col-bg-2-button)}.col-bg-2-input{background-color:var(--col-bg-2-input)}.col-primary-bg-2{background-color:var(--col-primary-bg-2)}.col-accent-bg-2{background-color:var(--col-accent-bg-2)}.col-success-bg-2{background-color:var(--col-success-bg-2)}.col-warning-bg-2{background-color:var(--col-warning-bg-2)}.col-error-bg-2{background-color:var(--col-error-bg-2)}.col-bg-3-lighter{background-color:var(--col-bg-3-lighter)}.col-bg-3{background-color:var(--col-bg-3)}.col-bg-3-darker{background-color:var(--col-bg-3-darker)}.col-bg-3-button{background-color:var(--col-bg-3-button)}.col-bg-3-input{background-color:var(--col-bg-3-input)}.col-primary-bg-3{background-color:var(--col-primary-bg-3)}.col-accent-bg-3{background-color:var(--col-accent-bg-3)}.col-success-bg-3{background-color:var(--col-success-bg-3)}.col-warning-bg-3{background-color:var(--col-warning-bg-3)}.col-error-bg-3{background-color:var(--col-error-bg-3)}.col-bg-ack-lighter{background-color:var(--col-bg-ack-lighter)}.col-bg-ack{background-color:var(--col-bg-ack)}.col-bg-ack-darker{background-color:var(--col-bg-ack-darker)}.col-primary-bg-ack{background-color:var(--col-primary-bg-ack)}.col-accent-bg-ack{background-color:var(--col-accent-bg-ack)}.col-bg-att-lighter{background-color:var(--col-bg-att-lighter)}.col-bg-att{background-color:var(--col-bg-att)}.col-bg-att-darker{background-color:var(--col-bg-att-darker)}.col-primary-bg-att{background-color:var(--col-primary-bg-att)}.col-accent-bg-att{background-color:var(--col-accent-bg-att)}.col-bg-alert-lighter{background-color:var(--col-bg-alert-lighter)}.col-bg-alert{background-color:var(--col-bg-alert)}.col-bg-alert-darker{background-color:var(--col-bg-alert-darker)}.col-primary-bg-alert{background-color:var(--col-primary-bg-alert)}.col-accent-bg-alert{background-color:var(--col-accent-bg-alert)}.col-bg-btn-lighter{background-color:var(--col-bg-btn-lighter)}.col-bg-btn{background-color:var(--col-bg-btn)}.col-bg-btn-darker{background-color:var(--col-bg-btn-darker)}.col-primary-bg-btn{background-color:var(--col-primary-bg-btn)}.col-accent-bg-btn{background-color:var(--col-accent-bg-btn)}.pattern-diagonal-stripes-sm{background:repeating-linear-gradient(45deg,transparent,transparent 10px,currentColor 10px,currentColor 20px)}.pattern-dots-lg{background-image:radial-gradient(currentColor 1.5px,transparent 1.5px);background-size:15px 15px}.pattern-dots-md{background-image:radial-gradient(currentColor 1px,transparent 1px);background-size:8px 8px}.pattern-dots-medium-dense{background-image:radial-gradient(currentColor .5px,transparent .5px);background-size:3px 3px}.pattern-dots-sm{background-image:radial-gradient(currentColor .5px,transparent .5px);background-size:5px 5px}.pattern-cross-dots-md,.imagelist-background{background-image:radial-gradient(currentColor .7px,transparent 1px),radial-gradient(currentColor .7px,transparent 1px);background-size:6.5px 6.5px;background-position:0 0,3.5px 3.5px}.imagelist-background{background-color:#fff9;background-blend-mode:overlay}*{box-sizing:border-box}.loading{display:flex;justify-content:center;align-content:center;height:5px;background-color:#000;width:100%}.loading-progress{height:5px;width:100%;border-radius:3px;background:linear-gradient(90deg,red 0%,yellow 15%,lime 30%,cyan 50%,blue 65%,magenta 80%,red 100%);background-size:200%;animation:move-gradient 2s ease-in infinite}.loading-message{font-family:var(--monospace-font);text-align:center;width:100%;color:var(--col-accent-bg-1);padding:1em}@keyframes move-gradient{0%{background-position:0 0}to{background-position:-200% 0%}}p,div{padding:0;margin:0;border:0px;user-select:text}select{user-select:none}.fa,.fas{font-family:"Font Awesome 6 Free";font-weight:900;font-style:normal}.fa-trash:before{content:""}.fa-view-grid:before{content:""}.fa-reload:before{content:""}.fa-view-list:before{content:""}.fa-camera:before{content:""}.fa-view-image:before{content:""}.fa-check:before{content:""}.fa-bug:before{content:""}.fa-lightbulb:before{content:""}.fa-query:before{content:""}:host *{user-select:none}.query-selector-overlay{position:fixed;width:100%;height:100%;top:0;left:0;right:0;bottom:0;background-color:#00000080;z-index:2;cursor:pointer}.query-selector{position:relative;background-color:var(--col-bg-1);margin:2em;min-height:200px;width:calc(100% - 4em);z-index:3;padding:1em;user-select:none;overflow-y:auto}.kiosk-query-selector-title-bar{position:sticky;top:0;text-align:right;z-index:2}.kiosk-query-selector-title-bar i{line-height:var(--font-size-h3);font-size:var(--font-size-h3)}.kiosk-query-selector-title-bar i:hover{color:var(--col-accent-bg-1)}.kiosk-query-selector-headline{position:sticky;background-color:var(--col-bg-1);top:0;display:flex;align-items:center;border-bottom:1px solid var(--col-bg-1-darker);padding-bottom:1em;margin-bottom:1em}.kiosk-query-selector-headline h3{margin-left:.5em}.kiosk-query-selector-headline i{font-size:var(--font-size-h2)}#kiosk-query-list{display:grid;width:100%;grid-template-columns:repeat(auto-fill,minmax(350px,1fr));grid-column-gap:1em;grid-row-gap:.3em}.kiosk-query{display:flex;align-items:center;padding-bottom:.2em;margin-bottom:.2em;color:var(--col-primary-bg-1)}.kiosk-query:hover{color:var(--col-accent-bg-1)}.kiosk-query:active{background-color:var(--col-bg-1-darker)}.kiosk-query i{font-size:var(--font-size-h3)}.kiosk-query .kiosk-query-text{margin-left:1em;display:flex;flex-direction:column}.kiosk-query .kiosk-query-text div{color:inherit;font-size:var(--font-size-standard, 1rem)}.kiosk-query .kiosk-query-text div:first-child{font-size:var(--font-size-h4);font-weight:700}
`, Ei = "MSG_NETWORK_ERROR";
class al {
  constructor(t, e, i = "") {
    this.messageId = t, this.headline = e, this.body = i;
  }
}
function Si(o, t, e, i = "") {
  let r = new al(
    t,
    e,
    i
  );
  o.dispatchEvent(new CustomEvent(
    "send-message",
    { bubbles: !0, composed: !0, detail: r }
  ));
}
function Qi(o, t, e = "", i = null) {
  if (e && (e += ": "), t.response) {
    if (t.response.status == 403 || t.response.status == 401) {
      Si(
        o,
        Ei,
        `${e}You are not logged in properly or your session has timed out`,
        '<a href="/logout">Please log in again.</a>'
      );
      return;
    }
    i ? i(t) : Si(
      o,
      Ei,
      `${e}Kiosk server responded with an error.`,
      `(${t.msg}). 
                The server might be down or perhaps you are not logged in properly.`
    );
  } else {
    Si(
      o,
      Ei,
      `${e}Kiosk server responded with a network error.`,
      `(${t}). 
            The server might be down or perhaps you are not logged in properly.`
    );
    return;
  }
}
var ll = Object.defineProperty, dl = Object.getOwnPropertyDescriptor, cl = (o, t, e, i) => {
  for (var r = i > 1 ? void 0 : i ? dl(t, e) : t, s = o.length - 1, n; s >= 0; s--)
    (n = o[s]) && (r = (i ? n(t, e, r) : n(r)) || r);
  return i && r && ll(t, e, r), r;
};
class wt extends ne {
  constructor() {
    super(), this.kiosk_base_url = "/", this.showProgress = !1, this.apiContext = void 0;
  }
  updated(t) {
    t.has("apiContext") && (this.showProgress = !1);
  }
  render() {
    let t;
    return this.apiContext && this.apiContext.status === Zs ? t = this.apiRender() : this.apiContext && this.apiContext.status === Yi ? t = this.renderApiError() : t = this.renderNoContextYet(), y`
            <link rel="stylesheet" href="${this.kiosk_base_url}static/styles.css" />
            ${t}
        `;
  }
  renderNoContextYet() {
    return y` <link rel="stylesheet" href="${this.kiosk_base_url}static/styles.css" /> `;
  }
  renderApiError() {
  }
  renderProgress(t = !1) {
    if (t || this.showProgress)
      return y` <div class="loading">
                <div class="loading-progress"></div>
            </div>`;
  }
}
wt.properties = {
  /**
   * The Api Context
   */
  apiContext: { type: Object }
};
cl([
  R()
], wt.prototype, "showProgress", 2);
const hl = `.col-bg-body-lighter{background-color:var(--col-bg-body-lighter)}.col-bg-body{background-color:var(--col-bg-body)}.col-bg-body-darker{background-color:var(--col-bg-body-darker)}.col-bg-1-lighter{background-color:var(--col-bg-1-lighter)}.col-bg-1{background-color:var(--col-bg-1)}.col-bg-1-darker{background-color:var(--col-bg-1-darker)}.col-bg-1-input{background-color:var(--col-bg-1-input)}.col-primary-bg-1{background-color:var(--col-primary-bg-1)}.col-accent-bg-1{background-color:var(--col-accent-bg-1)}.col-success-bg-1{background-color:var(--col-success-bg-1)}.col-warning-bg-1{background-color:var(--col-warning-bg-1)}.col-error-bg-1{background-color:var(--col-error-bg-1)}.col-bg-2-lighter{background-color:var(--col-bg-2-lighter)}.col-bg-2{background-color:var(--col-bg-2)}.col-bg-2-darker{background-color:var(--col-bg-2-darker)}.col-bg-2-button{background-color:var(--col-bg-2-button)}.col-bg-2-input{background-color:var(--col-bg-2-input)}.col-primary-bg-2{background-color:var(--col-primary-bg-2)}.col-accent-bg-2{background-color:var(--col-accent-bg-2)}.col-success-bg-2{background-color:var(--col-success-bg-2)}.col-warning-bg-2{background-color:var(--col-warning-bg-2)}.col-error-bg-2{background-color:var(--col-error-bg-2)}.col-bg-3-lighter{background-color:var(--col-bg-3-lighter)}.col-bg-3{background-color:var(--col-bg-3)}.col-bg-3-darker{background-color:var(--col-bg-3-darker)}.col-bg-3-button{background-color:var(--col-bg-3-button)}.col-bg-3-input{background-color:var(--col-bg-3-input)}.col-primary-bg-3{background-color:var(--col-primary-bg-3)}.col-accent-bg-3{background-color:var(--col-accent-bg-3)}.col-success-bg-3{background-color:var(--col-success-bg-3)}.col-warning-bg-3{background-color:var(--col-warning-bg-3)}.col-error-bg-3{background-color:var(--col-error-bg-3)}.col-bg-ack-lighter{background-color:var(--col-bg-ack-lighter)}.col-bg-ack{background-color:var(--col-bg-ack)}.col-bg-ack-darker{background-color:var(--col-bg-ack-darker)}.col-primary-bg-ack{background-color:var(--col-primary-bg-ack)}.col-accent-bg-ack{background-color:var(--col-accent-bg-ack)}.col-bg-att-lighter{background-color:var(--col-bg-att-lighter)}.col-bg-att{background-color:var(--col-bg-att)}.col-bg-att-darker{background-color:var(--col-bg-att-darker)}.col-primary-bg-att{background-color:var(--col-primary-bg-att)}.col-accent-bg-att{background-color:var(--col-accent-bg-att)}.col-bg-alert-lighter{background-color:var(--col-bg-alert-lighter)}.col-bg-alert{background-color:var(--col-bg-alert)}.col-bg-alert-darker{background-color:var(--col-bg-alert-darker)}.col-primary-bg-alert{background-color:var(--col-primary-bg-alert)}.col-accent-bg-alert{background-color:var(--col-accent-bg-alert)}.col-bg-btn-lighter{background-color:var(--col-bg-btn-lighter)}.col-bg-btn{background-color:var(--col-bg-btn)}.col-bg-btn-darker{background-color:var(--col-bg-btn-darker)}.col-primary-bg-btn{background-color:var(--col-primary-bg-btn)}.col-accent-bg-btn{background-color:var(--col-accent-bg-btn)}.pattern-diagonal-stripes-sm{background:repeating-linear-gradient(45deg,transparent,transparent 10px,currentColor 10px,currentColor 20px)}.pattern-dots-lg{background-image:radial-gradient(currentColor 1.5px,transparent 1.5px);background-size:15px 15px}.pattern-dots-md{background-image:radial-gradient(currentColor 1px,transparent 1px);background-size:8px 8px}.pattern-dots-medium-dense{background-image:radial-gradient(currentColor .5px,transparent .5px);background-size:3px 3px}.pattern-dots-sm{background-image:radial-gradient(currentColor .5px,transparent .5px);background-size:5px 5px}.pattern-cross-dots-md,.imagelist-background{background-image:radial-gradient(currentColor .7px,transparent 1px),radial-gradient(currentColor .7px,transparent 1px);background-size:6.5px 6.5px;background-position:0 0,3.5px 3.5px}.imagelist-background{background-color:#fff9;background-blend-mode:overlay}*{box-sizing:border-box}.loading{display:flex;justify-content:center;align-content:center;height:5px;background-color:#000;width:100%}.loading-progress{height:5px;width:100%;border-radius:3px;background:linear-gradient(90deg,red 0%,yellow 15%,lime 30%,cyan 50%,blue 65%,magenta 80%,red 100%);background-size:200%;animation:move-gradient 2s ease-in infinite}.loading-message{font-family:var(--monospace-font);text-align:center;width:100%;color:var(--col-accent-bg-1);padding:1em}@keyframes move-gradient{0%{background-position:0 0}to{background-position:-200% 0%}}p,div{padding:0;margin:0;border:0px;user-select:text}select{user-select:none}.fa,.fas{font-family:"Font Awesome 6 Free";font-weight:900;font-style:normal}.fa-trash:before{content:""}.fa-view-grid:before{content:""}.fa-reload:before{content:""}.fa-view-list:before{content:""}.fa-camera:before{content:""}.fa-view-image:before{content:""}.fa-check:before{content:""}.fa-bug:before{content:""}.fa-lightbulb:before{content:""}.fa-query:before{content:""}:host{--lumo-font-size-s: $font-size-standard;--_lumo-grid-secondary-border-color: $col-bg-1-lighter;--_lumo-grid-border-width: 5px;--lumo-font-family: $standard-text;--lumo-size-m: $font-size-standard}:host *{user-select:none}.kiosk-query-ui{background-color:var(--col-bg-2);--ui-col-bg-1: $col-bg-2;--ui-button-width: 42px;--ui-button-height: 42px;--ui-button-font-size: 20px;padding:.5em}vaadin-grid::part(cell){padding-left:.5em;padding-top:3px;padding-bottom:3px}vaadin-grid::part(header-cell){min-height:auto;padding-top:.5em;padding-bottom:.5em;border-bottom-color:var(--col-bg-1-darker);border-bottom-width:2px}.identifier{text-decoration:underline;text-decoration-style:dotted;cursor:pointer}.kiosk-query-results{position:relative}.no-records{position:absolute;display:grid;place-items:center;height:100%;width:100%;background-color:var(--col-bg-body);top:0px}.no-records div{padding-right:1em;font-size:var(--font-size-standard, 1rem);display:flex;flex-direction:row;line-height:var(--font-size-h3)}.no-records i{font-style:normal;font-size:var(--font-size-h3);vertical-align:middle;font-family:"Font Awesome 6 Free";padding-right:1em}
`;
/**
 * @license
 * Copyright (c) 2017 - 2023 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
class ul extends HTMLElement {
  static get version() {
    return "24.1.1";
  }
}
customElements.define("vaadin-lumo-styles", ul);
/**
 * @license
 * Copyright (c) 2017 - 2023 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
const pl = (o) => class extends o {
  static get properties() {
    return {
      /**
       * Helper property with theme attribute value facilitating propagation
       * in shadow DOM.
       *
       * Enables the component implementation to propagate the `theme`
       * attribute value to the sub-components in Shadow DOM by binding
       * the sub-component's "theme" attribute to the `theme` property of
       * the host.
       *
       * **NOTE:** Extending the mixin only provides the property for binding,
       * and does not make the propagation alone.
       *
       * See [Styling Components: Sub-components](https://vaadin.com/docs/latest/styling/custom-theme/styling-components/#sub-components).
       * page for more information.
       *
       * @protected
       */
      _theme: {
        type: String,
        readOnly: !0
      }
    };
  }
  static get observedAttributes() {
    return [...super.observedAttributes, "theme"];
  }
  /** @protected */
  attributeChangedCallback(e, i, r) {
    super.attributeChangedCallback(e, i, r), e === "theme" && this._set_theme(r);
  }
};
/**
 * @license
 * Copyright (c) 2017 - 2023 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
const en = [];
function tn(o) {
  return o && Object.prototype.hasOwnProperty.call(o, "__themes");
}
function _l(o) {
  return tn(customElements.get(o));
}
function fl(o = []) {
  return [o].flat(1 / 0).filter((t) => t instanceof Ar);
}
function m(o, t, e = {}) {
  o && _l(o), t = fl(t), window.Vaadin && window.Vaadin.styleModules ? window.Vaadin.styleModules.registerStyles(o, t, e) : en.push({
    themeFor: o,
    styles: t,
    include: e.include,
    moduleId: e.moduleId
  });
}
function Zi() {
  return window.Vaadin && window.Vaadin.styleModules ? window.Vaadin.styleModules.getAllThemes() : en;
}
function ml(o, t) {
  return (o || "").split(" ").some((e) => new RegExp(`^${e.split("*").join(".*")}$`, "u").test(t));
}
function gl(o = "") {
  let t = 0;
  return o.startsWith("lumo-") || o.startsWith("material-") ? t = 1 : o.startsWith("vaadin-") && (t = 2), t;
}
function rn(o) {
  const t = [];
  return o.include && [].concat(o.include).forEach((e) => {
    const i = Zi().find((r) => r.moduleId === e);
    i && t.push(...rn(i), ...i.styles);
  }, o.styles), t;
}
function bl(o, t) {
  const e = document.createElement("style");
  e.innerHTML = o.map((i) => i.cssText).join(`
`), t.content.appendChild(e);
}
function vl(o) {
  const t = `${o}-default-theme`, e = Zi().filter((i) => i.moduleId !== t && ml(i.themeFor, o)).map((i) => ({
    ...i,
    // Prepend styles from included themes
    styles: [...rn(i), ...i.styles],
    // Map moduleId to includePriority
    includePriority: gl(i.moduleId)
  })).sort((i, r) => r.includePriority - i.includePriority);
  return e.length > 0 ? e : Zi().filter((i) => i.moduleId === t);
}
const O = (o) => class extends pl(o) {
  /**
   * Covers PolymerElement based component styling
   * @protected
   */
  static finalize() {
    if (super.finalize(), this.elementStyles)
      return;
    const e = this.prototype._template;
    !e || tn(this) || bl(this.getStylesForThis(), e);
  }
  /**
   * Covers LitElement based component styling
   *
   * @protected
   */
  static finalizeStyles(e) {
    const i = this.getStylesForThis();
    return e ? [...super.finalizeStyles(e), ...i] : i;
  }
  /**
   * Get styles for the component type
   *
   * @private
   */
  static getStylesForThis() {
    const e = Object.getPrototypeOf(this.prototype), i = (e ? e.constructor.__themes : []) || [];
    this.__themes = [...i, ...vl(this.is)];
    const r = this.__themes.flatMap((s) => s.styles);
    return r.filter((s, n) => n === r.lastIndexOf(s));
  }
};
/**
 * @license
 * Copyright (c) 2017 - 2023 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
const yl = (o, ...t) => {
  const e = document.createElement("style");
  e.id = o, e.textContent = t.map((i) => i.toString()).join(`
`).replace(":host", "html"), document.head.insertAdjacentElement("afterbegin", e);
}, Ge = (o, ...t) => {
  yl(`lumo-${o}`, t);
};
/**
 * @license
 * Copyright (c) 2017 - 2023 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
const Cl = _`
  :host {
    /* Base (background) */
    --lumo-base-color: #fff;

    /* Tint */
    --lumo-tint-5pct: hsla(0, 0%, 100%, 0.3);
    --lumo-tint-10pct: hsla(0, 0%, 100%, 0.37);
    --lumo-tint-20pct: hsla(0, 0%, 100%, 0.44);
    --lumo-tint-30pct: hsla(0, 0%, 100%, 0.5);
    --lumo-tint-40pct: hsla(0, 0%, 100%, 0.57);
    --lumo-tint-50pct: hsla(0, 0%, 100%, 0.64);
    --lumo-tint-60pct: hsla(0, 0%, 100%, 0.7);
    --lumo-tint-70pct: hsla(0, 0%, 100%, 0.77);
    --lumo-tint-80pct: hsla(0, 0%, 100%, 0.84);
    --lumo-tint-90pct: hsla(0, 0%, 100%, 0.9);
    --lumo-tint: #fff;

    /* Shade */
    --lumo-shade-5pct: hsla(214, 61%, 25%, 0.05);
    --lumo-shade-10pct: hsla(214, 57%, 24%, 0.1);
    --lumo-shade-20pct: hsla(214, 53%, 23%, 0.16);
    --lumo-shade-30pct: hsla(214, 50%, 22%, 0.26);
    --lumo-shade-40pct: hsla(214, 47%, 21%, 0.38);
    --lumo-shade-50pct: hsla(214, 45%, 20%, 0.52);
    --lumo-shade-60pct: hsla(214, 43%, 19%, 0.6);
    --lumo-shade-70pct: hsla(214, 42%, 18%, 0.69);
    --lumo-shade-80pct: hsla(214, 41%, 17%, 0.83);
    --lumo-shade-90pct: hsla(214, 40%, 16%, 0.94);
    --lumo-shade: hsl(214, 35%, 15%);

    /* Contrast */
    --lumo-contrast-5pct: var(--lumo-shade-5pct);
    --lumo-contrast-10pct: var(--lumo-shade-10pct);
    --lumo-contrast-20pct: var(--lumo-shade-20pct);
    --lumo-contrast-30pct: var(--lumo-shade-30pct);
    --lumo-contrast-40pct: var(--lumo-shade-40pct);
    --lumo-contrast-50pct: var(--lumo-shade-50pct);
    --lumo-contrast-60pct: var(--lumo-shade-60pct);
    --lumo-contrast-70pct: var(--lumo-shade-70pct);
    --lumo-contrast-80pct: var(--lumo-shade-80pct);
    --lumo-contrast-90pct: var(--lumo-shade-90pct);
    --lumo-contrast: var(--lumo-shade);

    /* Text */
    --lumo-header-text-color: var(--lumo-contrast);
    --lumo-body-text-color: var(--lumo-contrast-90pct);
    --lumo-secondary-text-color: var(--lumo-contrast-70pct);
    --lumo-tertiary-text-color: var(--lumo-contrast-50pct);
    --lumo-disabled-text-color: var(--lumo-contrast-30pct);

    /* Primary */
    --lumo-primary-color: hsl(214, 100%, 48%);
    --lumo-primary-color-50pct: hsla(214, 100%, 49%, 0.76);
    --lumo-primary-color-10pct: hsla(214, 100%, 60%, 0.13);
    --lumo-primary-text-color: hsl(214, 100%, 43%);
    --lumo-primary-contrast-color: #fff;

    /* Error */
    --lumo-error-color: hsl(3, 85%, 48%);
    --lumo-error-color-50pct: hsla(3, 85%, 49%, 0.5);
    --lumo-error-color-10pct: hsla(3, 85%, 49%, 0.1);
    --lumo-error-text-color: hsl(3, 89%, 42%);
    --lumo-error-contrast-color: #fff;

    /* Success */
    --lumo-success-color: hsl(145, 72%, 30%);
    --lumo-success-color-50pct: hsla(145, 72%, 31%, 0.5);
    --lumo-success-color-10pct: hsla(145, 72%, 31%, 0.1);
    --lumo-success-text-color: hsl(145, 85%, 25%);
    --lumo-success-contrast-color: #fff;

    /* Warning */
    --lumo-warning-color: hsl(48, 100%, 50%);
    --lumo-warning-color-10pct: hsla(48, 100%, 50%, 0.25);
    --lumo-warning-text-color: hsl(32, 100%, 30%);
    --lumo-warning-contrast-color: var(--lumo-shade-90pct);
  }

  /* forced-colors mode adjustments */
  @media (forced-colors: active) {
    html {
      --lumo-disabled-text-color: GrayText;
    }
  }
`;
Ge("color-props", Cl);
const xl = _`
  [theme~='dark'] {
    /* Base (background) */
    --lumo-base-color: hsl(214, 35%, 21%);

    /* Tint */
    --lumo-tint-5pct: hsla(214, 65%, 85%, 0.06);
    --lumo-tint-10pct: hsla(214, 60%, 80%, 0.14);
    --lumo-tint-20pct: hsla(214, 64%, 82%, 0.23);
    --lumo-tint-30pct: hsla(214, 69%, 84%, 0.32);
    --lumo-tint-40pct: hsla(214, 73%, 86%, 0.41);
    --lumo-tint-50pct: hsla(214, 78%, 88%, 0.5);
    --lumo-tint-60pct: hsla(214, 82%, 90%, 0.58);
    --lumo-tint-70pct: hsla(214, 87%, 92%, 0.69);
    --lumo-tint-80pct: hsla(214, 91%, 94%, 0.8);
    --lumo-tint-90pct: hsla(214, 96%, 96%, 0.9);
    --lumo-tint: hsl(214, 100%, 98%);

    /* Shade */
    --lumo-shade-5pct: hsla(214, 0%, 0%, 0.07);
    --lumo-shade-10pct: hsla(214, 4%, 2%, 0.15);
    --lumo-shade-20pct: hsla(214, 8%, 4%, 0.23);
    --lumo-shade-30pct: hsla(214, 12%, 6%, 0.32);
    --lumo-shade-40pct: hsla(214, 16%, 8%, 0.41);
    --lumo-shade-50pct: hsla(214, 20%, 10%, 0.5);
    --lumo-shade-60pct: hsla(214, 24%, 12%, 0.6);
    --lumo-shade-70pct: hsla(214, 28%, 13%, 0.7);
    --lumo-shade-80pct: hsla(214, 32%, 13%, 0.8);
    --lumo-shade-90pct: hsla(214, 33%, 13%, 0.9);
    --lumo-shade: hsl(214, 33%, 13%);

    /* Contrast */
    --lumo-contrast-5pct: var(--lumo-tint-5pct);
    --lumo-contrast-10pct: var(--lumo-tint-10pct);
    --lumo-contrast-20pct: var(--lumo-tint-20pct);
    --lumo-contrast-30pct: var(--lumo-tint-30pct);
    --lumo-contrast-40pct: var(--lumo-tint-40pct);
    --lumo-contrast-50pct: var(--lumo-tint-50pct);
    --lumo-contrast-60pct: var(--lumo-tint-60pct);
    --lumo-contrast-70pct: var(--lumo-tint-70pct);
    --lumo-contrast-80pct: var(--lumo-tint-80pct);
    --lumo-contrast-90pct: var(--lumo-tint-90pct);
    --lumo-contrast: var(--lumo-tint);

    /* Text */
    --lumo-header-text-color: var(--lumo-contrast);
    --lumo-body-text-color: var(--lumo-contrast-90pct);
    --lumo-secondary-text-color: var(--lumo-contrast-70pct);
    --lumo-tertiary-text-color: var(--lumo-contrast-50pct);
    --lumo-disabled-text-color: var(--lumo-contrast-30pct);

    /* Primary */
    --lumo-primary-color: hsl(214, 90%, 48%);
    --lumo-primary-color-50pct: hsla(214, 90%, 70%, 0.69);
    --lumo-primary-color-10pct: hsla(214, 90%, 55%, 0.13);
    --lumo-primary-text-color: hsl(214, 90%, 77%);
    --lumo-primary-contrast-color: #fff;

    /* Error */
    --lumo-error-color: hsl(3, 79%, 49%);
    --lumo-error-color-50pct: hsla(3, 75%, 62%, 0.5);
    --lumo-error-color-10pct: hsla(3, 75%, 62%, 0.14);
    --lumo-error-text-color: hsl(3, 100%, 80%);

    /* Success */
    --lumo-success-color: hsl(145, 72%, 30%);
    --lumo-success-color-50pct: hsla(145, 92%, 51%, 0.5);
    --lumo-success-color-10pct: hsla(145, 92%, 51%, 0.1);
    --lumo-success-text-color: hsl(145, 85%, 46%);

    /* Warning */
    --lumo-warning-color: hsl(43, 100%, 48%);
    --lumo-warning-color-10pct: hsla(40, 100%, 50%, 0.2);
    --lumo-warning-text-color: hsl(45, 100%, 60%);
    --lumo-warning-contrast-color: var(--lumo-shade-90pct);
  }

  html {
    color: var(--lumo-body-text-color);
    background-color: var(--lumo-base-color);
    color-scheme: light;
  }

  [theme~='dark'] {
    color: var(--lumo-body-text-color);
    background-color: var(--lumo-base-color);
    color-scheme: dark;
  }

  h1,
  h2,
  h3,
  h4,
  h5,
  h6 {
    color: var(--lumo-header-text-color);
  }

  a:where(:any-link) {
    color: var(--lumo-primary-text-color);
  }

  a:not(:any-link) {
    color: var(--lumo-disabled-text-color);
  }

  blockquote {
    color: var(--lumo-secondary-text-color);
  }

  code,
  pre {
    background-color: var(--lumo-contrast-10pct);
    border-radius: var(--lumo-border-radius-m);
  }
`;
m("", xl, { moduleId: "lumo-color" });
/**
 * @license
 * Copyright (c) 2017 - 2023 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
const wl = _`
  :host {
    --lumo-size-xs: 1.625rem;
    --lumo-size-s: 1.875rem;
    --lumo-size-m: 2.25rem;
    --lumo-size-l: 2.75rem;
    --lumo-size-xl: 3.5rem;

    /* Icons */
    --lumo-icon-size-s: 1.25em;
    --lumo-icon-size-m: 1.5em;
    --lumo-icon-size-l: 2.25em;
    /* For backwards compatibility */
    --lumo-icon-size: var(--lumo-icon-size-m);
  }
`;
Ge("sizing-props", wl);
/**
 * @license
 * Copyright (c) 2017 - 2023 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
const Al = _`
  :host {
    /* Border radius */
    --lumo-border-radius-s: 0.25em; /* Checkbox, badge, date-picker year indicator, etc */
    --lumo-border-radius-m: var(--lumo-border-radius, 0.25em); /* Button, text field, menu overlay, etc */
    --lumo-border-radius-l: 0.5em; /* Dialog, notification, etc */

    /* Shadow */
    --lumo-box-shadow-xs: 0 1px 4px -1px var(--lumo-shade-50pct);
    --lumo-box-shadow-s: 0 2px 4px -1px var(--lumo-shade-20pct), 0 3px 12px -1px var(--lumo-shade-30pct);
    --lumo-box-shadow-m: 0 2px 6px -1px var(--lumo-shade-20pct), 0 8px 24px -4px var(--lumo-shade-40pct);
    --lumo-box-shadow-l: 0 3px 18px -2px var(--lumo-shade-20pct), 0 12px 48px -6px var(--lumo-shade-40pct);
    --lumo-box-shadow-xl: 0 4px 24px -3px var(--lumo-shade-20pct), 0 18px 64px -8px var(--lumo-shade-40pct);

    /* Clickable element cursor */
    --lumo-clickable-cursor: default;
  }
`;
_`
  html {
    --vaadin-checkbox-size: calc(var(--lumo-size-m) / 2);
    --vaadin-radio-button-size: calc(var(--lumo-size-m) / 2);
    --vaadin-input-field-border-radius: var(--lumo-border-radius-m);
  }
`;
Ge("style-props", Al);
/**
 * @license
 * Copyright (c) 2017 - 2023 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
const kl = _`
  :host {
    /* prettier-ignore */
    --lumo-font-family: -apple-system, BlinkMacSystemFont, 'Roboto', 'Segoe UI', Helvetica, Arial, sans-serif, 'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol';

    /* Font sizes */
    --lumo-font-size-xxs: 0.75rem;
    --lumo-font-size-xs: 0.8125rem;
    --lumo-font-size-s: 0.875rem;
    --lumo-font-size-m: 1rem;
    --lumo-font-size-l: 1.125rem;
    --lumo-font-size-xl: 1.375rem;
    --lumo-font-size-xxl: 1.75rem;
    --lumo-font-size-xxxl: 2.5rem;

    /* Line heights */
    --lumo-line-height-xs: 1.25;
    --lumo-line-height-s: 1.375;
    --lumo-line-height-m: 1.625;
  }
`, El = _`
  body,
  :host {
    font-family: var(--lumo-font-family);
    font-size: var(--lumo-font-size-m);
    line-height: var(--lumo-line-height-m);
    -webkit-text-size-adjust: 100%;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }

  small,
  [theme~='font-size-s'] {
    font-size: var(--lumo-font-size-s);
    line-height: var(--lumo-line-height-s);
  }

  [theme~='font-size-xs'] {
    font-size: var(--lumo-font-size-xs);
    line-height: var(--lumo-line-height-xs);
  }

  :where(h1, h2, h3, h4, h5, h6) {
    font-weight: 600;
    line-height: var(--lumo-line-height-xs);
    margin-block: 0;
  }

  :where(h1) {
    font-size: var(--lumo-font-size-xxxl);
  }

  :where(h2) {
    font-size: var(--lumo-font-size-xxl);
  }

  :where(h3) {
    font-size: var(--lumo-font-size-xl);
  }

  :where(h4) {
    font-size: var(--lumo-font-size-l);
  }

  :where(h5) {
    font-size: var(--lumo-font-size-m);
  }

  :where(h6) {
    font-size: var(--lumo-font-size-xs);
    text-transform: uppercase;
    letter-spacing: 0.03em;
  }

  p,
  blockquote {
    margin-top: 0.5em;
    margin-bottom: 0.75em;
  }

  a {
    text-decoration: none;
  }

  a:where(:any-link):hover {
    text-decoration: underline;
  }

  hr {
    display: block;
    align-self: stretch;
    height: 1px;
    border: 0;
    padding: 0;
    margin: var(--lumo-space-s) calc(var(--lumo-border-radius-m) / 2);
    background-color: var(--lumo-contrast-10pct);
  }

  blockquote {
    border-left: 2px solid var(--lumo-contrast-30pct);
  }

  b,
  strong {
    font-weight: 600;
  }

  /* RTL specific styles */
  blockquote[dir='rtl'] {
    border-left: none;
    border-right: 2px solid var(--lumo-contrast-30pct);
  }
`;
m("", El, { moduleId: "lumo-typography" });
Ge("typography-props", kl);
m(
  "vaadin-input-container",
  _`
    :host {
      background-color: var(--lumo-contrast-10pct);
      padding: 0 calc(0.375em + var(--_input-container-radius) / 4 - 1px);
      font-weight: 500;
      line-height: 1;
      position: relative;
      cursor: text;
      box-sizing: border-box;
      border-radius:
        /* See https://developer.mozilla.org/en-US/docs/Web/CSS/border-radius#syntax */
        var(--vaadin-input-field-top-start-radius, var(--_input-container-radius))
        var(--vaadin-input-field-top-end-radius, var(--_input-container-radius))
        var(--vaadin-input-field-bottom-end-radius, var(--_input-container-radius))
        var(--vaadin-input-field-bottom-start-radius, var(--_input-container-radius));
      /* Fallback */
      --_input-container-radius: var(--vaadin-input-field-border-radius, var(--lumo-border-radius-m));
      /* Default field border color */
      --_input-border-color: var(--vaadin-input-field-border-color, var(--lumo-contrast-50pct));
    }

    :host([dir='rtl']) {
      border-radius:
        /* Don't use logical props, see https://github.com/vaadin/vaadin-time-picker/issues/145 */
        var(--vaadin-input-field-top-end-radius, var(--_input-container-radius))
        var(--vaadin-input-field-top-start-radius, var(--_input-container-radius))
        var(--vaadin-input-field-bottom-start-radius, var(--_input-container-radius))
        var(--vaadin-input-field-bottom-end-radius, var(--_input-container-radius));
    }

    /* Used for hover and activation effects */
    :host::after {
      content: '';
      position: absolute;
      top: 0;
      right: 0;
      bottom: 0;
      left: 0;
      border-radius: inherit;
      pointer-events: none;
      background-color: var(--lumo-contrast-50pct);
      opacity: 0;
      transition: transform 0.15s, opacity 0.2s;
      transform-origin: 100% 0;
    }

    ::slotted(:not([slot$='fix'])) {
      cursor: inherit;
      min-height: var(--lumo-text-field-size, var(--lumo-size-m));
      padding: 0 0.25em;
      --_lumo-text-field-overflow-mask-image: linear-gradient(to left, transparent, #000 1.25em);
      -webkit-mask-image: var(--_lumo-text-field-overflow-mask-image);
      mask-image: var(--_lumo-text-field-overflow-mask-image);
    }

    /* Read-only */
    :host([readonly]) {
      color: var(--lumo-secondary-text-color);
      background-color: transparent;
      cursor: default;
    }

    :host([readonly])::after {
      background-color: transparent;
      opacity: 1;
      border: 1px dashed var(--lumo-contrast-30pct);
    }

    /* Disabled */
    :host([disabled]) {
      background-color: var(--lumo-contrast-5pct);
    }

    :host([disabled]) ::slotted(*) {
      color: var(--lumo-disabled-text-color);
      -webkit-text-fill-color: var(--lumo-disabled-text-color);
    }

    /* Invalid */
    :host([invalid]) {
      background-color: var(--lumo-error-color-10pct);
    }

    :host([invalid])::after {
      background-color: var(--lumo-error-color-50pct);
    }

    /* Slotted icons */
    ::slotted(vaadin-icon) {
      color: var(--lumo-contrast-60pct);
      width: var(--lumo-icon-size-m);
      height: var(--lumo-icon-size-m);
    }

    /* Vaadin icons are based on a 16x16 grid (unlike Lumo and Material icons with 24x24), so they look too big by default */
    ::slotted(vaadin-icon[icon^='vaadin:']) {
      padding: 0.25em;
      box-sizing: border-box !important;
    }

    /* Text align */
    :host([dir='rtl']) ::slotted(:not([slot$='fix'])) {
      --_lumo-text-field-overflow-mask-image: linear-gradient(to right, transparent, #000 1.25em);
    }

    @-moz-document url-prefix() {
      :host([dir='rtl']) ::slotted(:not([slot$='fix'])) {
        mask-image: var(--_lumo-text-field-overflow-mask-image);
      }
    }

    :host([theme~='align-left']) ::slotted(:not([slot$='fix'])) {
      text-align: start;
      --_lumo-text-field-overflow-mask-image: none;
    }

    :host([theme~='align-center']) ::slotted(:not([slot$='fix'])) {
      text-align: center;
      --_lumo-text-field-overflow-mask-image: none;
    }

    :host([theme~='align-right']) ::slotted(:not([slot$='fix'])) {
      text-align: end;
      --_lumo-text-field-overflow-mask-image: none;
    }

    @-moz-document url-prefix() {
      /* Firefox is smart enough to align overflowing text to right */
      :host([theme~='align-right']) ::slotted(:not([slot$='fix'])) {
        --_lumo-text-field-overflow-mask-image: linear-gradient(to right, transparent 0.25em, #000 1.5em);
      }
    }

    @-moz-document url-prefix() {
      /* Firefox is smart enough to align overflowing text to right */
      :host([theme~='align-left']) ::slotted(:not([slot$='fix'])) {
        --_lumo-text-field-overflow-mask-image: linear-gradient(to left, transparent 0.25em, #000 1.5em);
      }
    }

    /* RTL specific styles */
    :host([dir='rtl'])::after {
      transform-origin: 0% 0;
    }

    :host([theme~='align-left'][dir='rtl']) ::slotted(:not([slot$='fix'])) {
      --_lumo-text-field-overflow-mask-image: none;
    }

    :host([theme~='align-center'][dir='rtl']) ::slotted(:not([slot$='fix'])) {
      --_lumo-text-field-overflow-mask-image: none;
    }

    :host([theme~='align-right'][dir='rtl']) ::slotted(:not([slot$='fix'])) {
      --_lumo-text-field-overflow-mask-image: none;
    }

    @-moz-document url-prefix() {
      /* Firefox is smart enough to align overflowing text to right */
      :host([theme~='align-right'][dir='rtl']) ::slotted(:not([slot$='fix'])) {
        --_lumo-text-field-overflow-mask-image: linear-gradient(to right, transparent 0.25em, #000 1.5em);
      }
    }

    @-moz-document url-prefix() {
      /* Firefox is smart enough to align overflowing text to right */
      :host([theme~='align-left'][dir='rtl']) ::slotted(:not([slot$='fix'])) {
        --_lumo-text-field-overflow-mask-image: linear-gradient(to left, transparent 0.25em, #000 1.5em);
      }
    }
  `,
  { moduleId: "lumo-input-container" }
);
/**
@license
Copyright (c) 2017 The Polymer Project Authors. All rights reserved.
This code may only be used under the BSD style license found at http://polymer.github.io/LICENSE.txt
The complete set of authors may be found at http://polymer.github.io/AUTHORS.txt
The complete set of contributors may be found at http://polymer.github.io/CONTRIBUTORS.txt
Code distributed by Google as part of the polymer project is also
subject to an additional IP rights grant found at http://polymer.github.io/PATENTS.txt
*/
window.JSCompiler_renameProperty = function(o, t) {
  return o;
};
/**
@license
Copyright (c) 2017 The Polymer Project Authors. All rights reserved.
This code may only be used under the BSD style license found at http://polymer.github.io/LICENSE.txt
The complete set of authors may be found at http://polymer.github.io/AUTHORS.txt
The complete set of contributors may be found at http://polymer.github.io/CONTRIBUTORS.txt
Code distributed by Google as part of the polymer project is also
subject to an additional IP rights grant found at http://polymer.github.io/PATENTS.txt
*/
let Sl = /(url\()([^)]*)(\))/g, Il = /(^\/[^\/])|(^#)|(^[\w-\d]*:)/, zt, F;
function nt(o, t) {
  if (o && Il.test(o) || o === "//")
    return o;
  if (zt === void 0) {
    zt = !1;
    try {
      const e = new URL("b", "http://a");
      e.pathname = "c%20d", zt = e.href === "http://a/c%20d";
    } catch {
    }
  }
  if (t || (t = document.baseURI || window.location.href), zt)
    try {
      return new URL(o, t).href;
    } catch {
      return o;
    }
  return F || (F = document.implementation.createHTMLDocument("temp"), F.base = F.createElement("base"), F.head.appendChild(F.base), F.anchor = F.createElement("a"), F.body.appendChild(F.anchor)), F.base.href = t, F.anchor.href = o, F.anchor.href || o;
}
function kr(o, t) {
  return o.replace(Sl, function(e, i, r, s) {
    return i + "'" + nt(r.replace(/["']/g, ""), t) + "'" + s;
  });
}
function Er(o) {
  return o.substring(0, o.lastIndexOf("/") + 1);
}
/**
@license
Copyright (c) 2017 The Polymer Project Authors. All rights reserved.
This code may only be used under the BSD style license found at http://polymer.github.io/LICENSE.txt
The complete set of authors may be found at http://polymer.github.io/AUTHORS.txt
The complete set of contributors may be found at http://polymer.github.io/CONTRIBUTORS.txt
Code distributed by Google as part of the polymer project is also
subject to an additional IP rights grant found at http://polymer.github.io/PATENTS.txt
*/
const on = !window.ShadyDOM || !window.ShadyDOM.inUse;
!window.ShadyCSS || window.ShadyCSS.nativeCss;
const Tl = on && "adoptedStyleSheets" in Document.prototype && "replaceSync" in CSSStyleSheet.prototype && // Since spec may change, feature detect exact API we need
(() => {
  try {
    const o = new CSSStyleSheet();
    o.replaceSync("");
    const t = document.createElement("div");
    return t.attachShadow({ mode: "open" }), t.shadowRoot.adoptedStyleSheets = [o], t.shadowRoot.adoptedStyleSheets[0] === o;
  } catch {
    return !1;
  }
})();
let Pl = window.Polymer && window.Polymer.rootPath || Er(document.baseURI || window.location.href), Kt = window.Polymer && window.Polymer.sanitizeDOMValue || void 0;
window.Polymer && window.Polymer.setPassiveTouchGestures;
let Qt = window.Polymer && window.Polymer.strictTemplatePolicy || !1, Dl = window.Polymer && window.Polymer.allowTemplateFromDomModule || !1, sn = window.Polymer && window.Polymer.legacyOptimizations || !1, nn = window.Polymer && window.Polymer.legacyWarnings || !1, Ol = window.Polymer && window.Polymer.syncInitialRender || !1, Xi = window.Polymer && window.Polymer.legacyUndefined || !1, zl = window.Polymer && window.Polymer.orderedComputed || !1, mo = window.Polymer && window.Polymer.removeNestedTemplates || !1, $l = window.Polymer && window.Polymer.fastDomIf || !1, go = window.Polymer && window.Polymer.suppressTemplateNotifications || !1;
window.Polymer && window.Polymer.legacyNoObservedAttributes;
let Ml = window.Polymer && window.Polymer.useAdoptedStyleSheetsWithBuiltCSS || !1;
/**
@license
Copyright (c) 2017 The Polymer Project Authors. All rights reserved.
This code may only be used under the BSD style license found at http://polymer.github.io/LICENSE.txt
The complete set of authors may be found at http://polymer.github.io/AUTHORS.txt
The complete set of contributors may be found at http://polymer.github.io/CONTRIBUTORS.txt
Code distributed by Google as part of the polymer project is also
subject to an additional IP rights grant found at http://polymer.github.io/PATENTS.txt
*/
let Rl = 0;
const I = function(o) {
  let t = (
    /** @type {!MixinFunction} */
    o.__mixinApplications
  );
  t || (t = /* @__PURE__ */ new WeakMap(), o.__mixinApplications = t);
  let e = Rl++;
  function i(r) {
    let s = (
      /** @type {!MixinFunction} */
      r.__mixinSet
    );
    if (s && s[e])
      return r;
    let n = t, a = n.get(r);
    if (!a) {
      a = /** @type {!Function} */
      o(r), n.set(r, a);
      let l = Object.create(
        /** @type {!MixinFunction} */
        a.__mixinSet || s || null
      );
      l[e] = !0, a.__mixinSet = l;
    }
    return a;
  }
  return i;
};
/**
@license
Copyright (c) 2017 The Polymer Project Authors. All rights reserved.
This code may only be used under the BSD style license found at http://polymer.github.io/LICENSE.txt
The complete set of authors may be found at http://polymer.github.io/AUTHORS.txt
The complete set of contributors may be found at http://polymer.github.io/CONTRIBUTORS.txt
Code distributed by Google as part of the polymer project is also
subject to an additional IP rights grant found at http://polymer.github.io/PATENTS.txt
*/
let Sr = {}, an = {};
function bo(o, t) {
  Sr[o] = an[o.toLowerCase()] = t;
}
function vo(o) {
  return Sr[o] || an[o.toLowerCase()];
}
function Fl(o) {
  o.querySelector("style");
}
class _t extends HTMLElement {
  /** @override */
  static get observedAttributes() {
    return ["id"];
  }
  /**
   * Retrieves the element specified by the css `selector` in the module
   * registered by `id`. For example, this.import('foo', 'img');
   * @param {string} id The id of the dom-module in which to search.
   * @param {string=} selector The css selector by which to find the element.
   * @return {Element} Returns the element which matches `selector` in the
   * module registered at the specified `id`.
   *
   * @export
   * @nocollapse Referred to indirectly in style-gather.js
   */
  static import(t, e) {
    if (t) {
      let i = vo(t);
      return i && e ? i.querySelector(e) : i;
    }
    return null;
  }
  /* eslint-disable no-unused-vars */
  /**
   * @param {string} name Name of attribute.
   * @param {?string} old Old value of attribute.
   * @param {?string} value Current value of attribute.
   * @param {?string} namespace Attribute namespace.
   * @return {void}
   * @override
   */
  attributeChangedCallback(t, e, i, r) {
    e !== i && this.register();
  }
  /* eslint-enable no-unused-args */
  /**
   * The absolute URL of the original location of this `dom-module`.
   *
   * This value will differ from this element's `ownerDocument` in the
   * following ways:
   * - Takes into account any `assetpath` attribute added during bundling
   *   to indicate the original location relative to the bundled location
   * - Uses the HTMLImports polyfill's `importForElement` API to ensure
   *   the path is relative to the import document's location since
   *   `ownerDocument` is not currently polyfilled
   */
  get assetpath() {
    if (!this.__assetpath) {
      const t = window.HTMLImports && HTMLImports.importForElement ? HTMLImports.importForElement(this) || document : this.ownerDocument, e = nt(
        this.getAttribute("assetpath") || "",
        t.baseURI
      );
      this.__assetpath = Er(e);
    }
    return this.__assetpath;
  }
  /**
   * Registers the dom-module at a given id. This method should only be called
   * when a dom-module is imperatively created. For
   * example, `document.createElement('dom-module').register('foo')`.
   * @param {string=} id The id at which to register the dom-module.
   * @return {void}
   */
  register(t) {
    if (t = t || this.id, t) {
      if (Qt && vo(t) !== void 0)
        throw bo(t, null), new Error(`strictTemplatePolicy: dom-module ${t} re-registered`);
      this.id = t, bo(t, this), Fl(this);
    }
  }
}
_t.prototype.modules = Sr;
customElements.define("dom-module", _t);
/**
@license
Copyright (c) 2017 The Polymer Project Authors. All rights reserved.
This code may only be used under the BSD style license found at http://polymer.github.io/LICENSE.txt
The complete set of authors may be found at http://polymer.github.io/AUTHORS.txt
The complete set of contributors may be found at http://polymer.github.io/CONTRIBUTORS.txt
Code distributed by Google as part of the polymer project is also
subject to an additional IP rights grant found at http://polymer.github.io/PATENTS.txt
*/
const Nl = "link[rel=import][type~=css]", Ll = "include", yo = "shady-unscoped";
function ln(o) {
  return (
    /** @type {?DomModule} */
    _t.import(o)
  );
}
function Co(o) {
  let t = o.body ? o.body : o;
  const e = kr(
    t.textContent,
    o.baseURI
  ), i = document.createElement("style");
  return i.textContent = e, i;
}
function Bl(o) {
  const t = o.trim().split(/\s+/), e = [];
  for (let i = 0; i < t.length; i++)
    e.push(...Hl(t[i]));
  return e;
}
function Hl(o) {
  const t = ln(o);
  if (!t)
    return [];
  if (t._styles === void 0) {
    const e = [];
    e.push(...cn(t));
    const i = (
      /** @type {?HTMLTemplateElement} */
      t.querySelector("template")
    );
    i && e.push(...dn(
      i,
      /** @type {templateWithAssetPath} */
      t.assetpath
    )), t._styles = e;
  }
  return t._styles;
}
function dn(o, t) {
  if (!o._styles) {
    const e = [], i = o.content.querySelectorAll("style");
    for (let r = 0; r < i.length; r++) {
      let s = i[r], n = s.getAttribute(Ll);
      n && e.push(...Bl(n).filter(function(a, l, d) {
        return d.indexOf(a) === l;
      })), t && (s.textContent = kr(
        s.textContent,
        /** @type {string} */
        t
      )), e.push(s);
    }
    o._styles = e;
  }
  return o._styles;
}
function Vl(o) {
  let t = ln(o);
  return t ? cn(t) : [];
}
function cn(o) {
  const t = [], e = o.querySelectorAll(Nl);
  for (let i = 0; i < e.length; i++) {
    let r = e[i];
    if (r.import) {
      const s = r.import, n = r.hasAttribute(yo);
      if (n && !s._unscopedStyle) {
        const a = Co(s);
        a.setAttribute(yo, ""), s._unscopedStyle = a;
      } else
        s._style || (s._style = Co(s));
      t.push(n ? s._unscopedStyle : s._style);
    }
  }
  return t;
}
/**
@license
Copyright (c) 2017 The Polymer Project Authors. All rights reserved.
This code may only be used under the BSD style license found at http://polymer.github.io/LICENSE.txt
The complete set of authors may be found at http://polymer.github.io/AUTHORS.txt
The complete set of contributors may be found at http://polymer.github.io/CONTRIBUTORS.txt
Code distributed by Google as part of the polymer project is also
subject to an additional IP rights grant found at http://polymer.github.io/PATENTS.txt
*/
const S = window.ShadyDOM && window.ShadyDOM.noPatch && window.ShadyDOM.wrap ? window.ShadyDOM.wrap : window.ShadyDOM ? (o) => ShadyDOM.patch(o) : (o) => o;
/**
@license
Copyright (c) 2017 The Polymer Project Authors. All rights reserved.
This code may only be used under the BSD style license found at http://polymer.github.io/LICENSE.txt
The complete set of authors may be found at http://polymer.github.io/AUTHORS.txt
The complete set of contributors may be found at http://polymer.github.io/CONTRIBUTORS.txt
Code distributed by Google as part of the polymer project is also
subject to an additional IP rights grant found at http://polymer.github.io/PATENTS.txt
*/
function Ji(o) {
  return o.indexOf(".") >= 0;
}
function Ee(o) {
  let t = o.indexOf(".");
  return t === -1 ? o : o.slice(0, t);
}
function hn(o, t) {
  return o.indexOf(t + ".") === 0;
}
function ft(o, t) {
  return t.indexOf(o + ".") === 0;
}
function mt(o, t, e) {
  return t + e.slice(o.length);
}
function Ul(o, t) {
  return o === t || hn(o, t) || ft(o, t);
}
function rt(o) {
  if (Array.isArray(o)) {
    let t = [];
    for (let e = 0; e < o.length; e++) {
      let i = o[e].toString().split(".");
      for (let r = 0; r < i.length; r++)
        t.push(i[r]);
    }
    return t.join(".");
  } else
    return o;
}
function un(o) {
  return Array.isArray(o) ? rt(o).split(".") : o.toString().split(".");
}
function M(o, t, e) {
  let i = o, r = un(t);
  for (let s = 0; s < r.length; s++) {
    if (!i)
      return;
    let n = r[s];
    i = i[n];
  }
  return e && (e.path = r.join(".")), i;
}
function xo(o, t, e) {
  let i = o, r = un(t), s = r[r.length - 1];
  if (r.length > 1) {
    for (let n = 0; n < r.length - 1; n++) {
      let a = r[n];
      if (i = i[a], !i)
        return;
    }
    i[s] = e;
  } else
    i[t] = e;
  return r.join(".");
}
/**
@license
Copyright (c) 2017 The Polymer Project Authors. All rights reserved.
This code may only be used under the BSD style license found at http://polymer.github.io/LICENSE.txt
The complete set of authors may be found at http://polymer.github.io/AUTHORS.txt
The complete set of contributors may be found at http://polymer.github.io/CONTRIBUTORS.txt
Code distributed by Google as part of the polymer project is also
subject to an additional IP rights grant found at http://polymer.github.io/PATENTS.txt
*/
const Zt = {}, ql = /-[a-z]/g, Wl = /([A-Z])/g;
function pn(o) {
  return Zt[o] || (Zt[o] = o.indexOf("-") < 0 ? o : o.replace(
    ql,
    (t) => t[1].toUpperCase()
  ));
}
function ni(o) {
  return Zt[o] || (Zt[o] = o.replace(Wl, "-$1").toLowerCase());
}
/**
@license
Copyright (c) 2017 The Polymer Project Authors. All rights reserved.
This code may only be used under the BSD style license found at http://polymer.github.io/LICENSE.txt
The complete set of authors may be found at http://polymer.github.io/AUTHORS.txt
The complete set of contributors may be found at http://polymer.github.io/CONTRIBUTORS.txt
Code distributed by Google as part of the polymer project is also
subject to an additional IP rights grant found at http://polymer.github.io/PATENTS.txt
*/
let Gl = 0, _n = 0, Me = [], jl = 0, er = !1, fn = document.createTextNode("");
new window.MutationObserver(Yl).observe(fn, { characterData: !0 });
function Yl() {
  er = !1;
  const o = Me.length;
  for (let t = 0; t < o; t++) {
    let e = Me[t];
    if (e)
      try {
        e();
      } catch (i) {
        setTimeout(() => {
          throw i;
        });
      }
  }
  Me.splice(0, o), _n += o;
}
const Kl = {
  /**
   * Returns a sub-module with the async interface providing the provided
   * delay.
   *
   * @memberof timeOut
   * @param {number=} delay Time to wait before calling callbacks in ms
   * @return {!AsyncInterface} An async timeout interface
   */
  after(o) {
    return {
      run(t) {
        return window.setTimeout(t, o);
      },
      cancel(t) {
        window.clearTimeout(t);
      }
    };
  },
  /**
   * Enqueues a function called in the next task.
   *
   * @memberof timeOut
   * @param {!Function} fn Callback to run
   * @param {number=} delay Delay in milliseconds
   * @return {number} Handle used for canceling task
   */
  run(o, t) {
    return window.setTimeout(o, t);
  },
  /**
   * Cancels a previously enqueued `timeOut` callback.
   *
   * @memberof timeOut
   * @param {number} handle Handle returned from `run` of callback to cancel
   * @return {void}
   */
  cancel(o) {
    window.clearTimeout(o);
  }
}, Ir = {
  /**
   * Enqueues a function called at microtask timing.
   *
   * @memberof microTask
   * @param {!Function=} callback Callback to run
   * @return {number} Handle used for canceling task
   */
  run(o) {
    return er || (er = !0, fn.textContent = jl++), Me.push(o), Gl++;
  },
  /**
   * Cancels a previously enqueued `microTask` callback.
   *
   * @memberof microTask
   * @param {number} handle Handle returned from `run` of callback to cancel
   * @return {void}
   */
  cancel(o) {
    const t = o - _n;
    if (t >= 0) {
      if (!Me[t])
        throw new Error("invalid async handle: " + o);
      Me[t] = null;
    }
  }
};
/**
@license
Copyright (c) 2017 The Polymer Project Authors. All rights reserved.
This code may only be used under the BSD style license found at http://polymer.github.io/LICENSE.txt
The complete set of authors may be found at http://polymer.github.io/AUTHORS.txt
The complete set of contributors may be found at http://polymer.github.io/CONTRIBUTORS.txt
Code distributed by Google as part of the polymer project is also
subject to an additional IP rights grant found at http://polymer.github.io/PATENTS.txt
*/
const Ql = Ir, mn = I(
  /**
   * @template T
   * @param {function(new:T)} superClass Class to apply mixin to.
   * @return {function(new:T)} superClass with mixin applied.
   */
  (o) => {
    class t extends o {
      /**
       * Creates property accessors for the given property names.
       * @param {!Object} props Object whose keys are names of accessors.
       * @return {void}
       * @protected
       * @nocollapse
       */
      static createProperties(i) {
        const r = this.prototype;
        for (let s in i)
          s in r || r._createPropertyAccessor(s);
      }
      /**
       * Returns an attribute name that corresponds to the given property.
       * The attribute name is the lowercased property name. Override to
       * customize this mapping.
       * @param {string} property Property to convert
       * @return {string} Attribute name corresponding to the given property.
       *
       * @protected
       * @nocollapse
       */
      static attributeNameForProperty(i) {
        return i.toLowerCase();
      }
      /**
       * Override point to provide a type to which to deserialize a value to
       * a given property.
       * @param {string} name Name of property
       *
       * @protected
       * @nocollapse
       */
      static typeForProperty(i) {
      }
      //eslint-disable-line no-unused-vars
      /**
       * Creates a setter/getter pair for the named property with its own
       * local storage.  The getter returns the value in the local storage,
       * and the setter calls `_setProperty`, which updates the local storage
       * for the property and enqueues a `_propertiesChanged` callback.
       *
       * This method may be called on a prototype or an instance.  Calling
       * this method may overwrite a property value that already exists on
       * the prototype/instance by creating the accessor.
       *
       * @param {string} property Name of the property
       * @param {boolean=} readOnly When true, no setter is created; the
       *   protected `_setProperty` function must be used to set the property
       * @return {void}
       * @protected
       * @override
       */
      _createPropertyAccessor(i, r) {
        this._addPropertyToAttributeMap(i), this.hasOwnProperty(JSCompiler_renameProperty("__dataHasAccessor", this)) || (this.__dataHasAccessor = Object.assign({}, this.__dataHasAccessor)), this.__dataHasAccessor[i] || (this.__dataHasAccessor[i] = !0, this._definePropertyAccessor(i, r));
      }
      /**
       * Adds the given `property` to a map matching attribute names
       * to property names, using `attributeNameForProperty`. This map is
       * used when deserializing attribute values to properties.
       *
       * @param {string} property Name of the property
       * @override
       */
      _addPropertyToAttributeMap(i) {
        this.hasOwnProperty(JSCompiler_renameProperty("__dataAttributes", this)) || (this.__dataAttributes = Object.assign({}, this.__dataAttributes));
        let r = this.__dataAttributes[i];
        return r || (r = this.constructor.attributeNameForProperty(i), this.__dataAttributes[r] = i), r;
      }
      /**
       * Defines a property accessor for the given property.
       * @param {string} property Name of the property
       * @param {boolean=} readOnly When true, no setter is created
       * @return {void}
       * @override
       */
      _definePropertyAccessor(i, r) {
        Object.defineProperty(this, i, {
          /* eslint-disable valid-jsdoc */
          /** @this {PropertiesChanged} */
          get() {
            return this.__data[i];
          },
          /** @this {PropertiesChanged} */
          set: r ? function() {
          } : function(s) {
            this._setPendingProperty(i, s, !0) && this._invalidateProperties();
          }
          /* eslint-enable */
        });
      }
      constructor() {
        super(), this.__dataEnabled = !1, this.__dataReady = !1, this.__dataInvalid = !1, this.__data = {}, this.__dataPending = null, this.__dataOld = null, this.__dataInstanceProps = null, this.__dataCounter = 0, this.__serializing = !1, this._initializeProperties();
      }
      /**
       * Lifecycle callback called when properties are enabled via
       * `_enableProperties`.
       *
       * Users may override this function to implement behavior that is
       * dependent on the element having its property data initialized, e.g.
       * from defaults (initialized from `constructor`, `_initializeProperties`),
       * `attributeChangedCallback`, or values propagated from host e.g. via
       * bindings.  `super.ready()` must be called to ensure the data system
       * becomes enabled.
       *
       * @return {void}
       * @public
       * @override
       */
      ready() {
        this.__dataReady = !0, this._flushProperties();
      }
      /**
       * Initializes the local storage for property accessors.
       *
       * Provided as an override point for performing any setup work prior
       * to initializing the property accessor system.
       *
       * @return {void}
       * @protected
       * @override
       */
      _initializeProperties() {
        for (let i in this.__dataHasAccessor)
          this.hasOwnProperty(i) && (this.__dataInstanceProps = this.__dataInstanceProps || {}, this.__dataInstanceProps[i] = this[i], delete this[i]);
      }
      /**
       * Called at ready time with bag of instance properties that overwrote
       * accessors when the element upgraded.
       *
       * The default implementation sets these properties back into the
       * setter at ready time.  This method is provided as an override
       * point for customizing or providing more efficient initialization.
       *
       * @param {Object} props Bag of property values that were overwritten
       *   when creating property accessors.
       * @return {void}
       * @protected
       * @override
       */
      _initializeInstanceProperties(i) {
        Object.assign(this, i);
      }
      /**
       * Updates the local storage for a property (via `_setPendingProperty`)
       * and enqueues a `_proeprtiesChanged` callback.
       *
       * @param {string} property Name of the property
       * @param {*} value Value to set
       * @return {void}
       * @protected
       * @override
       */
      _setProperty(i, r) {
        this._setPendingProperty(i, r) && this._invalidateProperties();
      }
      /**
       * Returns the value for the given property.
       * @param {string} property Name of property
       * @return {*} Value for the given property
       * @protected
       * @override
       */
      _getProperty(i) {
        return this.__data[i];
      }
      /* eslint-disable no-unused-vars */
      /**
       * Updates the local storage for a property, records the previous value,
       * and adds it to the set of "pending changes" that will be passed to the
       * `_propertiesChanged` callback.  This method does not enqueue the
       * `_propertiesChanged` callback.
       *
       * @param {string} property Name of the property
       * @param {*} value Value to set
       * @param {boolean=} ext Not used here; affordance for closure
       * @return {boolean} Returns true if the property changed
       * @protected
       * @override
       */
      _setPendingProperty(i, r, s) {
        let n = this.__data[i], a = this._shouldPropertyChange(i, r, n);
        return a && (this.__dataPending || (this.__dataPending = {}, this.__dataOld = {}), this.__dataOld && !(i in this.__dataOld) && (this.__dataOld[i] = n), this.__data[i] = r, this.__dataPending[i] = r), a;
      }
      /* eslint-enable */
      /**
       * @param {string} property Name of the property
       * @return {boolean} Returns true if the property is pending.
       */
      _isPropertyPending(i) {
        return !!(this.__dataPending && this.__dataPending.hasOwnProperty(i));
      }
      /**
       * Marks the properties as invalid, and enqueues an async
       * `_propertiesChanged` callback.
       *
       * @return {void}
       * @protected
       * @override
       */
      _invalidateProperties() {
        !this.__dataInvalid && this.__dataReady && (this.__dataInvalid = !0, Ql.run(() => {
          this.__dataInvalid && (this.__dataInvalid = !1, this._flushProperties());
        }));
      }
      /**
       * Call to enable property accessor processing. Before this method is
       * called accessor values will be set but side effects are
       * queued. When called, any pending side effects occur immediately.
       * For elements, generally `connectedCallback` is a normal spot to do so.
       * It is safe to call this method multiple times as it only turns on
       * property accessors once.
       *
       * @return {void}
       * @protected
       * @override
       */
      _enableProperties() {
        this.__dataEnabled || (this.__dataEnabled = !0, this.__dataInstanceProps && (this._initializeInstanceProperties(this.__dataInstanceProps), this.__dataInstanceProps = null), this.ready());
      }
      /**
       * Calls the `_propertiesChanged` callback with the current set of
       * pending changes (and old values recorded when pending changes were
       * set), and resets the pending set of changes. Generally, this method
       * should not be called in user code.
       *
       * @return {void}
       * @protected
       * @override
       */
      _flushProperties() {
        this.__dataCounter++;
        const i = this.__data, r = this.__dataPending, s = this.__dataOld;
        this._shouldPropertiesChange(i, r, s) && (this.__dataPending = null, this.__dataOld = null, this._propertiesChanged(i, r, s)), this.__dataCounter--;
      }
      /**
       * Called in `_flushProperties` to determine if `_propertiesChanged`
       * should be called. The default implementation returns true if
       * properties are pending. Override to customize when
       * `_propertiesChanged` is called.
       * @param {!Object} currentProps Bag of all current accessor values
       * @param {?Object} changedProps Bag of properties changed since the last
       *   call to `_propertiesChanged`
       * @param {?Object} oldProps Bag of previous values for each property
       *   in `changedProps`
       * @return {boolean} true if changedProps is truthy
       * @override
       */
      _shouldPropertiesChange(i, r, s) {
        return !!r;
      }
      /**
       * Callback called when any properties with accessors created via
       * `_createPropertyAccessor` have been set.
       *
       * @param {!Object} currentProps Bag of all current accessor values
       * @param {?Object} changedProps Bag of properties changed since the last
       *   call to `_propertiesChanged`
       * @param {?Object} oldProps Bag of previous values for each property
       *   in `changedProps`
       * @return {void}
       * @protected
       * @override
       */
      _propertiesChanged(i, r, s) {
      }
      /**
       * Method called to determine whether a property value should be
       * considered as a change and cause the `_propertiesChanged` callback
       * to be enqueued.
       *
       * The default implementation returns `true` if a strict equality
       * check fails. The method always returns false for `NaN`.
       *
       * Override this method to e.g. provide stricter checking for
       * Objects/Arrays when using immutable patterns.
       *
       * @param {string} property Property name
       * @param {*} value New property value
       * @param {*} old Previous property value
       * @return {boolean} Whether the property should be considered a change
       *   and enqueue a `_proeprtiesChanged` callback
       * @protected
       * @override
       */
      _shouldPropertyChange(i, r, s) {
        return (
          // Strict equality check
          s !== r && // This ensures (old==NaN, value==NaN) always returns false
          (s === s || r === r)
        );
      }
      /**
       * Implements native Custom Elements `attributeChangedCallback` to
       * set an attribute value to a property via `_attributeToProperty`.
       *
       * @param {string} name Name of attribute that changed
       * @param {?string} old Old attribute value
       * @param {?string} value New attribute value
       * @param {?string} namespace Attribute namespace.
       * @return {void}
       * @suppress {missingProperties} Super may or may not implement the callback
       * @override
       */
      attributeChangedCallback(i, r, s, n) {
        r !== s && this._attributeToProperty(i, s), super.attributeChangedCallback && super.attributeChangedCallback(i, r, s, n);
      }
      /**
       * Deserializes an attribute to its associated property.
       *
       * This method calls the `_deserializeValue` method to convert the string to
       * a typed value.
       *
       * @param {string} attribute Name of attribute to deserialize.
       * @param {?string} value of the attribute.
       * @param {*=} type type to deserialize to, defaults to the value
       * returned from `typeForProperty`
       * @return {void}
       * @override
       */
      _attributeToProperty(i, r, s) {
        if (!this.__serializing) {
          const n = this.__dataAttributes, a = n && n[i] || i;
          this[a] = this._deserializeValue(r, s || this.constructor.typeForProperty(a));
        }
      }
      /**
       * Serializes a property to its associated attribute.
       *
       * @suppress {invalidCasts} Closure can't figure out `this` is an element.
       *
       * @param {string} property Property name to reflect.
       * @param {string=} attribute Attribute name to reflect to.
       * @param {*=} value Property value to refect.
       * @return {void}
       * @override
       */
      _propertyToAttribute(i, r, s) {
        this.__serializing = !0, s = arguments.length < 3 ? this[i] : s, this._valueToNodeAttribute(
          /** @type {!HTMLElement} */
          this,
          s,
          r || this.constructor.attributeNameForProperty(i)
        ), this.__serializing = !1;
      }
      /**
       * Sets a typed value to an HTML attribute on a node.
       *
       * This method calls the `_serializeValue` method to convert the typed
       * value to a string.  If the `_serializeValue` method returns `undefined`,
       * the attribute will be removed (this is the default for boolean
       * type `false`).
       *
       * @param {Element} node Element to set attribute to.
       * @param {*} value Value to serialize.
       * @param {string} attribute Attribute name to serialize to.
       * @return {void}
       * @override
       */
      _valueToNodeAttribute(i, r, s) {
        const n = this._serializeValue(r);
        (s === "class" || s === "name" || s === "slot") && (i = /** @type {?Element} */
        S(i)), n === void 0 ? i.removeAttribute(s) : i.setAttribute(
          s,
          // Closure's type for `setAttribute`'s second parameter incorrectly
          // excludes `TrustedScript`.
          n === "" && window.trustedTypes ? (
            /** @type {?} */
            window.trustedTypes.emptyScript
          ) : n
        );
      }
      /**
       * Converts a typed JavaScript value to a string.
       *
       * This method is called when setting JS property values to
       * HTML attributes.  Users may override this method to provide
       * serialization for custom types.
       *
       * @param {*} value Property value to serialize.
       * @return {string | undefined} String serialized from the provided
       * property  value.
       * @override
       */
      _serializeValue(i) {
        switch (typeof i) {
          case "boolean":
            return i ? "" : void 0;
          default:
            return i != null ? i.toString() : void 0;
        }
      }
      /**
       * Converts a string to a typed JavaScript value.
       *
       * This method is called when reading HTML attribute values to
       * JS properties.  Users may override this method to provide
       * deserialization for custom `type`s. Types for `Boolean`, `String`,
       * and `Number` convert attributes to the expected types.
       *
       * @param {?string} value Value to deserialize.
       * @param {*=} type Type to deserialize the string to.
       * @return {*} Typed value deserialized from the provided string.
       * @override
       */
      _deserializeValue(i, r) {
        switch (r) {
          case Boolean:
            return i !== null;
          case Number:
            return Number(i);
          default:
            return i;
        }
      }
    }
    return t;
  }
);
/**
@license
Copyright (c) 2017 The Polymer Project Authors. All rights reserved.
This code may only be used under the BSD style license found at http://polymer.github.io/LICENSE.txt
The complete set of authors may be found at http://polymer.github.io/AUTHORS.txt
The complete set of contributors may be found at http://polymer.github.io/CONTRIBUTORS.txt
Code distributed by Google as part of the polymer project is also
subject to an additional IP rights grant found at http://polymer.github.io/PATENTS.txt
*/
const gn = {};
let $t = HTMLElement.prototype;
for (; $t; ) {
  let o = Object.getOwnPropertyNames($t);
  for (let t = 0; t < o.length; t++)
    gn[o[t]] = !0;
  $t = Object.getPrototypeOf($t);
}
const Zl = (() => window.trustedTypes ? (o) => trustedTypes.isHTML(o) || trustedTypes.isScript(o) || trustedTypes.isScriptURL(o) : () => !1)();
function Xl(o, t) {
  if (!gn[t]) {
    let e = o[t];
    e !== void 0 && (o.__data ? o._setPendingProperty(t, e) : (o.__dataProto ? o.hasOwnProperty(JSCompiler_renameProperty("__dataProto", o)) || (o.__dataProto = Object.create(o.__dataProto)) : o.__dataProto = {}, o.__dataProto[t] = e));
  }
}
const Jl = I((o) => {
  const t = mn(o);
  class e extends t {
    /**
     * Generates property accessors for all attributes in the standard
     * static `observedAttributes` array.
     *
     * Attribute names are mapped to property names using the `dash-case` to
     * `camelCase` convention
     *
     * @return {void}
     * @nocollapse
     */
    static createPropertiesForAttributes() {
      let r = (
        /** @type {?} */
        this.observedAttributes
      );
      for (let s = 0; s < r.length; s++)
        this.prototype._createPropertyAccessor(pn(r[s]));
    }
    /**
     * Returns an attribute name that corresponds to the given property.
     * By default, converts camel to dash case, e.g. `fooBar` to `foo-bar`.
     * @param {string} property Property to convert
     * @return {string} Attribute name corresponding to the given property.
     *
     * @protected
     * @nocollapse
     */
    static attributeNameForProperty(r) {
      return ni(r);
    }
    /**
     * Overrides PropertiesChanged implementation to initialize values for
     * accessors created for values that already existed on the element
     * prototype.
     *
     * @return {void}
     * @protected
     * @override
     */
    _initializeProperties() {
      this.__dataProto && (this._initializeProtoProperties(this.__dataProto), this.__dataProto = null), super._initializeProperties();
    }
    /**
     * Called at instance time with bag of properties that were overwritten
     * by accessors on the prototype when accessors were created.
     *
     * The default implementation sets these properties back into the
     * setter at instance time.  This method is provided as an override
     * point for customizing or providing more efficient initialization.
     *
     * @param {Object} props Bag of property values that were overwritten
     *   when creating property accessors.
     * @return {void}
     * @protected
     * @override
     */
    _initializeProtoProperties(r) {
      for (let s in r)
        this._setProperty(s, r[s]);
    }
    /**
     * Ensures the element has the given attribute. If it does not,
     * assigns the given value to the attribute.
     *
     * @suppress {invalidCasts} Closure can't figure out `this` is infact an
     *     element
     *
     * @param {string} attribute Name of attribute to ensure is set.
     * @param {string} value of the attribute.
     * @return {void}
     * @override
     */
    _ensureAttribute(r, s) {
      const n = (
        /** @type {!HTMLElement} */
        this
      );
      n.hasAttribute(r) || this._valueToNodeAttribute(n, s, r);
    }
    /**
     * Overrides PropertiesChanged implemention to serialize objects as JSON.
     *
     * @param {*} value Property value to serialize.
     * @return {string | undefined} String serialized from the provided property
     *     value.
     * @override
     */
    _serializeValue(r) {
      switch (typeof r) {
        case "object":
          if (r instanceof Date)
            return r.toString();
          if (r) {
            if (Zl(r))
              return (
                /** @type {?} */
                r
              );
            try {
              return JSON.stringify(r);
            } catch {
              return "";
            }
          }
        default:
          return super._serializeValue(r);
      }
    }
    /**
     * Converts a string to a typed JavaScript value.
     *
     * This method is called by Polymer when reading HTML attribute values to
     * JS properties.  Users may override this method on Polymer element
     * prototypes to provide deserialization for custom `type`s.  Note,
     * the `type` argument is the value of the `type` field provided in the
     * `properties` configuration object for a given property, and is
     * by convention the constructor for the type to deserialize.
     *
     *
     * @param {?string} value Attribute value to deserialize.
     * @param {*=} type Type to deserialize the string to.
     * @return {*} Typed value deserialized from the provided string.
     * @override
     */
    _deserializeValue(r, s) {
      let n;
      switch (s) {
        case Object:
          try {
            n = JSON.parse(
              /** @type {string} */
              r
            );
          } catch {
            n = r;
          }
          break;
        case Array:
          try {
            n = JSON.parse(
              /** @type {string} */
              r
            );
          } catch {
            n = null;
          }
          break;
        case Date:
          n = isNaN(r) ? String(r) : Number(r), n = new Date(n);
          break;
        default:
          n = super._deserializeValue(r, s);
          break;
      }
      return n;
    }
    /* eslint-enable no-fallthrough */
    /**
     * Overrides PropertiesChanged implementation to save existing prototype
     * property value so that it can be reset.
     * @param {string} property Name of the property
     * @param {boolean=} readOnly When true, no setter is created
     *
     * When calling on a prototype, any overwritten values are saved in
     * `__dataProto`, and it is up to the subclasser to decide how/when
     * to set those properties back into the accessor.  When calling on an
     * instance, the overwritten value is set via `_setPendingProperty`,
     * and the user should call `_invalidateProperties` or `_flushProperties`
     * for the values to take effect.
     * @protected
     * @return {void}
     * @override
     */
    _definePropertyAccessor(r, s) {
      Xl(this, r), super._definePropertyAccessor(r, s);
    }
    /**
     * Returns true if this library created an accessor for the given property.
     *
     * @param {string} property Property name
     * @return {boolean} True if an accessor was created
     * @override
     */
    _hasAccessor(r) {
      return this.__dataHasAccessor && this.__dataHasAccessor[r];
    }
    /**
     * Returns true if the specified property has a pending change.
     *
     * @param {string} prop Property name
     * @return {boolean} True if property has a pending change
     * @protected
     * @override
     */
    _isPropertyPending(r) {
      return !!(this.__dataPending && r in this.__dataPending);
    }
  }
  return e;
});
/**
@license
Copyright (c) 2017 The Polymer Project Authors. All rights reserved.
This code may only be used under the BSD style license found at http://polymer.github.io/LICENSE.txt
The complete set of authors may be found at http://polymer.github.io/AUTHORS.txt
The complete set of contributors may be found at http://polymer.github.io/CONTRIBUTORS.txt
Code distributed by Google as part of the polymer project is also
subject to an additional IP rights grant found at http://polymer.github.io/PATENTS.txt
*/
const ed = {
  "dom-if": !0,
  "dom-repeat": !0
};
let wo = !1, Ao = !1;
function td() {
  if (!wo) {
    wo = !0;
    const o = document.createElement("textarea");
    o.placeholder = "a", Ao = o.placeholder === o.textContent;
  }
  return Ao;
}
function id(o) {
  td() && o.localName === "textarea" && o.placeholder && o.placeholder === o.textContent && (o.textContent = null);
}
const rd = (() => {
  const o = window.trustedTypes && window.trustedTypes.createPolicy(
    "polymer-template-event-attribute-policy",
    {
      createScript: (t) => t
    }
  );
  return (t, e, i) => {
    const r = e.getAttribute(i);
    if (o && i.startsWith("on-")) {
      t.setAttribute(
        i,
        o.createScript(r, i)
      );
      return;
    }
    t.setAttribute(i, r);
  };
})();
function od(o) {
  let t = o.getAttribute("is");
  if (t && ed[t]) {
    let e = o;
    for (e.removeAttribute("is"), o = e.ownerDocument.createElement(t), e.parentNode.replaceChild(o, e), o.appendChild(e); e.attributes.length; ) {
      const { name: i } = e.attributes[0];
      rd(o, e, i), e.removeAttribute(i);
    }
  }
  return o;
}
function bn(o, t) {
  let e = t.parentInfo && bn(o, t.parentInfo);
  if (e) {
    for (let i = e.firstChild, r = 0; i; i = i.nextSibling)
      if (t.parentIndex === r++)
        return i;
  } else
    return o;
}
function sd(o, t, e, i) {
  i.id && (t[i.id] = e);
}
function nd(o, t, e) {
  if (e.events && e.events.length)
    for (let i = 0, r = e.events, s; i < r.length && (s = r[i]); i++)
      o._addMethodEventListenerToNode(t, s.name, s.value, o);
}
function ad(o, t, e, i) {
  e.templateInfo && (t._templateInfo = e.templateInfo, t._parentTemplateInfo = i);
}
function ld(o, t, e) {
  return o = o._methodHost || o, function(r) {
    o[e] && o[e](r, r.detail);
  };
}
const dd = I(
  /**
   * @template T
   * @param {function(new:T)} superClass Class to apply mixin to.
   * @return {function(new:T)} superClass with mixin applied.
   */
  (o) => {
    class t extends o {
      /**
       * Scans a template to produce template metadata.
       *
       * Template-specific metadata are stored in the object returned, and node-
       * specific metadata are stored in objects in its flattened `nodeInfoList`
       * array.  Only nodes in the template that were parsed as nodes of
       * interest contain an object in `nodeInfoList`.  Each `nodeInfo` object
       * contains an `index` (`childNodes` index in parent) and optionally
       * `parent`, which points to node info of its parent (including its index).
       *
       * The template metadata object returned from this method has the following
       * structure (many fields optional):
       *
       * ```js
       *   {
       *     // Flattened list of node metadata (for nodes that generated metadata)
       *     nodeInfoList: [
       *       {
       *         // `id` attribute for any nodes with id's for generating `$` map
       *         id: {string},
       *         // `on-event="handler"` metadata
       *         events: [
       *           {
       *             name: {string},   // event name
       *             value: {string},  // handler method name
       *           }, ...
       *         ],
       *         // Notes when the template contained a `<slot>` for shady DOM
       *         // optimization purposes
       *         hasInsertionPoint: {boolean},
       *         // For nested `<template>`` nodes, nested template metadata
       *         templateInfo: {object}, // nested template metadata
       *         // Metadata to allow efficient retrieval of instanced node
       *         // corresponding to this metadata
       *         parentInfo: {number},   // reference to parent nodeInfo>
       *         parentIndex: {number},  // index in parent's `childNodes` collection
       *         infoIndex: {number},    // index of this `nodeInfo` in `templateInfo.nodeInfoList`
       *       },
       *       ...
       *     ],
       *     // When true, the template had the `strip-whitespace` attribute
       *     // or was nested in a template with that setting
       *     stripWhitespace: {boolean},
       *     // For nested templates, nested template content is moved into
       *     // a document fragment stored here; this is an optimization to
       *     // avoid the cost of nested template cloning
       *     content: {DocumentFragment}
       *   }
       * ```
       *
       * This method kicks off a recursive treewalk as follows:
       *
       * ```
       *    _parseTemplate <---------------------+
       *      _parseTemplateContent              |
       *        _parseTemplateNode  <------------|--+
       *          _parseTemplateNestedTemplate --+  |
       *          _parseTemplateChildNodes ---------+
       *          _parseTemplateNodeAttributes
       *            _parseTemplateNodeAttribute
       *
       * ```
       *
       * These methods may be overridden to add custom metadata about templates
       * to either `templateInfo` or `nodeInfo`.
       *
       * Note that this method may be destructive to the template, in that
       * e.g. event annotations may be removed after being noted in the
       * template metadata.
       *
       * @param {!HTMLTemplateElement} template Template to parse
       * @param {TemplateInfo=} outerTemplateInfo Template metadata from the outer
       *   template, for parsing nested templates
       * @return {!TemplateInfo} Parsed template metadata
       * @nocollapse
       */
      static _parseTemplate(i, r) {
        if (!i._templateInfo) {
          let s = i._templateInfo = {};
          s.nodeInfoList = [], s.nestedTemplate = !!r, s.stripWhiteSpace = r && r.stripWhiteSpace || i.hasAttribute && i.hasAttribute("strip-whitespace"), this._parseTemplateContent(
            i,
            s,
            /** @type {?} */
            { parent: null }
          );
        }
        return i._templateInfo;
      }
      /**
       * See docs for _parseTemplateNode.
       *
       * @param {!HTMLTemplateElement} template .
       * @param {!TemplateInfo} templateInfo .
       * @param {!NodeInfo} nodeInfo .
       * @return {boolean} .
       * @nocollapse
       */
      static _parseTemplateContent(i, r, s) {
        return this._parseTemplateNode(i.content, r, s);
      }
      /**
       * Parses template node and adds template and node metadata based on
       * the current node, and its `childNodes` and `attributes`.
       *
       * This method may be overridden to add custom node or template specific
       * metadata based on this node.
       *
       * @param {Node} node Node to parse
       * @param {!TemplateInfo} templateInfo Template metadata for current template
       * @param {!NodeInfo} nodeInfo Node metadata for current template.
       * @return {boolean} `true` if the visited node added node-specific
       *   metadata to `nodeInfo`
       * @nocollapse
       */
      static _parseTemplateNode(i, r, s) {
        let n = !1, a = (
          /** @type {!HTMLTemplateElement} */
          i
        );
        return a.localName == "template" && !a.hasAttribute("preserve-content") ? n = this._parseTemplateNestedTemplate(a, r, s) || n : a.localName === "slot" && (r.hasInsertionPoint = !0), id(a), a.firstChild && this._parseTemplateChildNodes(a, r, s), a.hasAttributes && a.hasAttributes() && (n = this._parseTemplateNodeAttributes(a, r, s) || n), n || s.noted;
      }
      /**
       * Parses template child nodes for the given root node.
       *
       * This method also wraps whitelisted legacy template extensions
       * (`is="dom-if"` and `is="dom-repeat"`) with their equivalent element
       * wrappers, collapses text nodes, and strips whitespace from the template
       * if the `templateInfo.stripWhitespace` setting was provided.
       *
       * @param {Node} root Root node whose `childNodes` will be parsed
       * @param {!TemplateInfo} templateInfo Template metadata for current template
       * @param {!NodeInfo} nodeInfo Node metadata for current template.
       * @return {void}
       */
      static _parseTemplateChildNodes(i, r, s) {
        if (!(i.localName === "script" || i.localName === "style"))
          for (let n = i.firstChild, a = 0, l; n; n = l) {
            if (n.localName == "template" && (n = od(n)), l = n.nextSibling, n.nodeType === Node.TEXT_NODE) {
              let c = l;
              for (; c && c.nodeType === Node.TEXT_NODE; )
                n.textContent += c.textContent, l = c.nextSibling, i.removeChild(c), c = l;
              if (r.stripWhiteSpace && !n.textContent.trim()) {
                i.removeChild(n);
                continue;
              }
            }
            let d = (
              /** @type {!NodeInfo} */
              { parentIndex: a, parentInfo: s }
            );
            this._parseTemplateNode(n, r, d) && (d.infoIndex = r.nodeInfoList.push(d) - 1), n.parentNode && a++;
          }
      }
      /**
       * Parses template content for the given nested `<template>`.
       *
       * Nested template info is stored as `templateInfo` in the current node's
       * `nodeInfo`. `template.content` is removed and stored in `templateInfo`.
       * It will then be the responsibility of the host to set it back to the
       * template and for users stamping nested templates to use the
       * `_contentForTemplate` method to retrieve the content for this template
       * (an optimization to avoid the cost of cloning nested template content).
       *
       * @param {HTMLTemplateElement} node Node to parse (a <template>)
       * @param {TemplateInfo} outerTemplateInfo Template metadata for current template
       *   that includes the template `node`
       * @param {!NodeInfo} nodeInfo Node metadata for current template.
       * @return {boolean} `true` if the visited node added node-specific
       *   metadata to `nodeInfo`
       * @nocollapse
       */
      static _parseTemplateNestedTemplate(i, r, s) {
        let n = (
          /** @type {!HTMLTemplateElement} */
          i
        ), a = this._parseTemplate(n, r);
        return (a.content = n.content.ownerDocument.createDocumentFragment()).appendChild(n.content), s.templateInfo = a, !0;
      }
      /**
       * Parses template node attributes and adds node metadata to `nodeInfo`
       * for nodes of interest.
       *
       * @param {Element} node Node to parse
       * @param {!TemplateInfo} templateInfo Template metadata for current
       *     template
       * @param {!NodeInfo} nodeInfo Node metadata for current template.
       * @return {boolean} `true` if the visited node added node-specific
       *   metadata to `nodeInfo`
       * @nocollapse
       */
      static _parseTemplateNodeAttributes(i, r, s) {
        let n = !1, a = Array.from(i.attributes);
        for (let l = a.length - 1, d; d = a[l]; l--)
          n = this._parseTemplateNodeAttribute(i, r, s, d.name, d.value) || n;
        return n;
      }
      /**
       * Parses a single template node attribute and adds node metadata to
       * `nodeInfo` for attributes of interest.
       *
       * This implementation adds metadata for `on-event="handler"` attributes
       * and `id` attributes.
       *
       * @param {Element} node Node to parse
       * @param {!TemplateInfo} templateInfo Template metadata for current template
       * @param {!NodeInfo} nodeInfo Node metadata for current template.
       * @param {string} name Attribute name
       * @param {string} value Attribute value
       * @return {boolean} `true` if the visited node added node-specific
       *   metadata to `nodeInfo`
       * @nocollapse
       */
      static _parseTemplateNodeAttribute(i, r, s, n, a) {
        return n.slice(0, 3) === "on-" ? (i.removeAttribute(n), s.events = s.events || [], s.events.push({
          name: n.slice(3),
          value: a
        }), !0) : n === "id" ? (s.id = a, !0) : !1;
      }
      /**
       * Returns the `content` document fragment for a given template.
       *
       * For nested templates, Polymer performs an optimization to cache nested
       * template content to avoid the cost of cloning deeply nested templates.
       * This method retrieves the cached content for a given template.
       *
       * @param {HTMLTemplateElement} template Template to retrieve `content` for
       * @return {DocumentFragment} Content fragment
       * @nocollapse
       */
      static _contentForTemplate(i) {
        let r = (
          /** @type {HTMLTemplateElementWithInfo} */
          i._templateInfo
        );
        return r && r.content || i.content;
      }
      /**
       * Clones the provided template content and returns a document fragment
       * containing the cloned dom.
       *
       * The template is parsed (once and memoized) using this library's
       * template parsing features, and provides the following value-added
       * features:
       * * Adds declarative event listeners for `on-event="handler"` attributes
       * * Generates an "id map" for all nodes with id's under `$` on returned
       *   document fragment
       * * Passes template info including `content` back to templates as
       *   `_templateInfo` (a performance optimization to avoid deep template
       *   cloning)
       *
       * Note that the memoized template parsing process is destructive to the
       * template: attributes for bindings and declarative event listeners are
       * removed after being noted in notes, and any nested `<template>.content`
       * is removed and stored in notes as well.
       *
       * @param {!HTMLTemplateElement} template Template to stamp
       * @param {TemplateInfo=} templateInfo Optional template info associated
       *   with the template to be stamped; if omitted the template will be
       *   automatically parsed.
       * @return {!StampedTemplate} Cloned template content
       * @override
       */
      _stampTemplate(i, r) {
        i && !i.content && window.HTMLTemplateElement && HTMLTemplateElement.decorate && HTMLTemplateElement.decorate(i), r = r || this.constructor._parseTemplate(i);
        let s = r.nodeInfoList, n = r.content || i.content, a = (
          /** @type {DocumentFragment} */
          document.importNode(n, !0)
        );
        a.__noInsertionPoint = !r.hasInsertionPoint;
        let l = a.nodeList = new Array(s.length);
        a.$ = {};
        for (let d = 0, c = s.length, h; d < c && (h = s[d]); d++) {
          let u = l[d] = bn(a, h);
          sd(this, a.$, u, h), ad(this, u, h, r), nd(this, u, h);
        }
        return a = /** @type {!StampedTemplate} */
        a, a;
      }
      /**
       * Adds an event listener by method name for the event provided.
       *
       * This method generates a handler function that looks up the method
       * name at handling time.
       *
       * @param {!EventTarget} node Node to add listener on
       * @param {string} eventName Name of event
       * @param {string} methodName Name of method
       * @param {*=} context Context the method will be called on (defaults
       *   to `node`)
       * @return {Function} Generated handler function
       * @override
       */
      _addMethodEventListenerToNode(i, r, s, n) {
        n = n || i;
        let a = ld(n, r, s);
        return this._addEventListenerToNode(i, r, a), a;
      }
      /**
       * Override point for adding custom or simulated event handling.
       *
       * @param {!EventTarget} node Node to add event listener to
       * @param {string} eventName Name of event
       * @param {function(!Event):void} handler Listener function to add
       * @return {void}
       * @override
       */
      _addEventListenerToNode(i, r, s) {
        i.addEventListener(r, s);
      }
      /**
       * Override point for adding custom or simulated event handling.
       *
       * @param {!EventTarget} node Node to remove event listener from
       * @param {string} eventName Name of event
       * @param {function(!Event):void} handler Listener function to remove
       * @return {void}
       * @override
       */
      _removeEventListenerFromNode(i, r, s) {
        i.removeEventListener(r, s);
      }
    }
    return t;
  }
);
/**
 * @fileoverview
 * @suppress {checkPrototypalTypes}
 * @license Copyright (c) 2017 The Polymer Project Authors. All rights reserved.
 * This code may only be used under the BSD style license found at
 * http://polymer.github.io/LICENSE.txt The complete set of authors may be found
 * at http://polymer.github.io/AUTHORS.txt The complete set of contributors may
 * be found at http://polymer.github.io/CONTRIBUTORS.txt Code distributed by
 * Google as part of the polymer project is also subject to an additional IP
 * rights grant found at http://polymer.github.io/PATENTS.txt
 */
let gt = 0;
const bt = [], v = {
  COMPUTE: "__computeEffects",
  REFLECT: "__reflectEffects",
  NOTIFY: "__notifyEffects",
  PROPAGATE: "__propagateEffects",
  OBSERVE: "__observeEffects",
  READ_ONLY: "__readOnly"
}, vn = "__computeInfo", cd = /[A-Z]/;
function Ii(o, t, e) {
  let i = o[t];
  if (!i)
    i = o[t] = {};
  else if (!o.hasOwnProperty(t) && (i = o[t] = Object.create(o[t]), e))
    for (let r in i) {
      let s = i[r], n = i[r] = Array(s.length);
      for (let a = 0; a < s.length; a++)
        n[a] = s[a];
    }
  return i;
}
function ot(o, t, e, i, r, s) {
  if (t) {
    let n = !1;
    const a = gt++;
    for (let l in e) {
      let d = r ? Ee(l) : l, c = t[d];
      if (c)
        for (let h = 0, u = c.length, p; h < u && (p = c[h]); h++)
          (!p.info || p.info.lastRun !== a) && (!r || Tr(l, p.trigger)) && (p.info && (p.info.lastRun = a), p.fn(o, l, e, i, p.info, r, s), n = !0);
    }
    return n;
  }
  return !1;
}
function hd(o, t, e, i, r, s, n, a) {
  let l = !1, d = n ? Ee(i) : i, c = t[d];
  if (c)
    for (let h = 0, u = c.length, p; h < u && (p = c[h]); h++)
      (!p.info || p.info.lastRun !== e) && (!n || Tr(i, p.trigger)) && (p.info && (p.info.lastRun = e), p.fn(o, i, r, s, p.info, n, a), l = !0);
  return l;
}
function Tr(o, t) {
  if (t) {
    let e = (
      /** @type {string} */
      t.name
    );
    return e == o || !!(t.structured && hn(e, o)) || !!(t.wildcard && ft(e, o));
  } else
    return !0;
}
function ko(o, t, e, i, r) {
  let s = typeof r.method == "string" ? o[r.method] : r.method, n = r.property;
  s ? s.call(o, o.__data[n], i[n]) : r.dynamicFn;
}
function ud(o, t, e, i, r) {
  let s = o[v.NOTIFY], n, a = gt++;
  for (let d in t)
    t[d] && (s && hd(o, s, a, d, e, i, r) || r && pd(o, d, e)) && (n = !0);
  let l;
  n && (l = o.__dataHost) && l._invalidateProperties && l._invalidateProperties();
}
function pd(o, t, e) {
  let i = Ee(t);
  if (i !== t) {
    let r = ni(i) + "-changed";
    return yn(o, r, e[t], t), !0;
  }
  return !1;
}
function yn(o, t, e, i) {
  let r = {
    value: e,
    queueProperty: !0
  };
  i && (r.path = i), S(
    /** @type {!HTMLElement} */
    o
  ).dispatchEvent(new CustomEvent(t, { detail: r }));
}
function _d(o, t, e, i, r, s) {
  let a = (s ? Ee(t) : t) != t ? t : null, l = a ? M(o, a) : o.__data[t];
  a && l === void 0 && (l = e[t]), yn(o, r.eventName, l, a);
}
function fd(o, t, e, i, r) {
  let s, n = (
    /** @type {Object} */
    o.detail
  ), a = n && n.path;
  a ? (i = mt(e, i, a), s = n && n.value) : s = o.currentTarget[e], s = r ? !s : s, (!t[v.READ_ONLY] || !t[v.READ_ONLY][i]) && t._setPendingPropertyOrPath(i, s, !0, !!a) && (!n || !n.queueProperty) && t._invalidateProperties();
}
function md(o, t, e, i, r) {
  let s = o.__data[t];
  Kt && (s = Kt(
    s,
    r.attrName,
    "attribute",
    /** @type {Node} */
    o
  )), o._propertyToAttribute(t, r.attrName, s);
}
function gd(o, t, e, i) {
  let r = o[v.COMPUTE];
  if (r)
    if (zl) {
      gt++;
      const s = vd(o), n = [];
      for (let l in t)
        Eo(l, r, n, s, i);
      let a;
      for (; a = n.shift(); )
        Cn(o, "", t, e, a) && Eo(a.methodInfo, r, n, s, i);
      Object.assign(
        /** @type {!Object} */
        e,
        o.__dataOld
      ), Object.assign(
        /** @type {!Object} */
        t,
        o.__dataPending
      ), o.__dataPending = null;
    } else {
      let s = t;
      for (; ot(o, r, s, e, i); )
        Object.assign(
          /** @type {!Object} */
          e,
          o.__dataOld
        ), Object.assign(
          /** @type {!Object} */
          t,
          o.__dataPending
        ), s = o.__dataPending, o.__dataPending = null;
    }
}
const bd = (o, t, e) => {
  let i = 0, r = t.length - 1, s = -1;
  for (; i <= r; ) {
    const n = i + r >> 1, a = e.get(t[n].methodInfo) - e.get(o.methodInfo);
    if (a < 0)
      i = n + 1;
    else if (a > 0)
      r = n - 1;
    else {
      s = n;
      break;
    }
  }
  s < 0 && (s = r + 1), t.splice(s, 0, o);
}, Eo = (o, t, e, i, r) => {
  const s = r ? Ee(o) : o, n = t[s];
  if (n)
    for (let a = 0; a < n.length; a++) {
      const l = n[a];
      l.info.lastRun !== gt && (!r || Tr(o, l.trigger)) && (l.info.lastRun = gt, bd(l.info, e, i));
    }
};
function vd(o) {
  let t = o.constructor.__orderedComputedDeps;
  if (!t) {
    t = /* @__PURE__ */ new Map();
    const e = o[v.COMPUTE];
    let { counts: i, ready: r, total: s } = yd(o), n;
    for (; n = r.shift(); ) {
      t.set(n, t.size);
      const a = e[n];
      a && a.forEach((l) => {
        const d = l.info.methodInfo;
        --s, --i[d] === 0 && r.push(d);
      });
    }
    if (s !== 0) {
      const a = (
        /** @type {HTMLElement} */
        o
      );
    }
    o.constructor.__orderedComputedDeps = t;
  }
  return t;
}
function yd(o) {
  const t = o[vn], e = {}, i = o[v.COMPUTE], r = [];
  let s = 0;
  for (let n in t) {
    const a = t[n];
    s += e[n] = a.args.filter((l) => !l.literal).length + (a.dynamicFn ? 1 : 0);
  }
  for (let n in i)
    t[n] || r.push(n);
  return { counts: e, ready: r, total: s };
}
function Cn(o, t, e, i, r) {
  let s = tr(o, t, e, i, r);
  if (s === bt)
    return !1;
  let n = r.methodInfo;
  return o.__dataHasAccessor && o.__dataHasAccessor[n] ? o._setPendingProperty(n, s, !0) : (o[n] = s, !1);
}
function Cd(o, t, e) {
  let i = o.__dataLinkedPaths;
  if (i) {
    let r;
    for (let s in i) {
      let n = i[s];
      ft(s, t) ? (r = mt(s, n, t), o._setPendingPropertyOrPath(r, e, !0, !0)) : ft(n, t) && (r = mt(n, s, t), o._setPendingPropertyOrPath(r, e, !0, !0));
    }
  }
}
function Ti(o, t, e, i, r, s, n) {
  e.bindings = e.bindings || [];
  let a = { kind: i, target: r, parts: s, literal: n, isCompound: s.length !== 1 };
  if (e.bindings.push(a), Ed(a)) {
    let { event: d, negate: c } = a.parts[0];
    a.listenerEvent = d || ni(r) + "-changed", a.listenerNegate = c;
  }
  let l = t.nodeInfoList.length;
  for (let d = 0; d < a.parts.length; d++) {
    let c = a.parts[d];
    c.compoundIndex = d, xd(o, t, a, c, l);
  }
}
function xd(o, t, e, i, r) {
  if (!i.literal && !(e.kind === "attribute" && e.target[0] === "-")) {
    let s = i.dependencies, n = { index: r, binding: e, part: i, evaluator: o };
    for (let a = 0; a < s.length; a++) {
      let l = s[a];
      typeof l == "string" && (l = wn(l), l.wildcard = !0), o._addTemplatePropertyEffect(t, l.rootProperty, {
        fn: wd,
        info: n,
        trigger: l
      });
    }
  }
}
function wd(o, t, e, i, r, s, n) {
  let a = n[r.index], l = r.binding, d = r.part;
  if (s && d.source && t.length > d.source.length && l.kind == "property" && !l.isCompound && a.__isPropertyEffectsClient && a.__dataHasAccessor && a.__dataHasAccessor[l.target]) {
    let c = e[t];
    t = mt(d.source, l.target, t), a._setPendingPropertyOrPath(t, c, !1, !0) && o._enqueueClient(a);
  } else {
    let c = r.evaluator._evaluateBinding(o, d, t, e, i, s);
    c !== bt && Ad(o, a, l, d, c);
  }
}
function Ad(o, t, e, i, r) {
  if (r = kd(t, r, e, i), Kt && (r = Kt(r, e.target, e.kind, t)), e.kind == "attribute")
    o._valueToNodeAttribute(
      /** @type {Element} */
      t,
      r,
      e.target
    );
  else {
    let s = e.target;
    t.__isPropertyEffectsClient && t.__dataHasAccessor && t.__dataHasAccessor[s] ? (!t[v.READ_ONLY] || !t[v.READ_ONLY][s]) && t._setPendingProperty(s, r) && o._enqueueClient(t) : o._setUnmanagedPropertyToNode(t, s, r);
  }
}
function kd(o, t, e, i) {
  if (e.isCompound) {
    let r = o.__dataCompoundStorage[e.target];
    r[i.compoundIndex] = t, t = r.join("");
  }
  return e.kind !== "attribute" && (e.target === "textContent" || e.target === "value" && (o.localName === "input" || o.localName === "textarea")) && (t = t ?? ""), t;
}
function Ed(o) {
  return !!o.target && o.kind != "attribute" && o.kind != "text" && !o.isCompound && o.parts[0].mode === "{";
}
function Sd(o, t) {
  let { nodeList: e, nodeInfoList: i } = t;
  if (i.length)
    for (let r = 0; r < i.length; r++) {
      let s = i[r], n = e[r], a = s.bindings;
      if (a)
        for (let l = 0; l < a.length; l++) {
          let d = a[l];
          Id(n, d), Td(n, o, d);
        }
      n.__dataHost = o;
    }
}
function Id(o, t) {
  if (t.isCompound) {
    let e = o.__dataCompoundStorage || (o.__dataCompoundStorage = {}), i = t.parts, r = new Array(i.length);
    for (let n = 0; n < i.length; n++)
      r[n] = i[n].literal;
    let s = t.target;
    e[s] = r, t.literal && t.kind == "property" && (s === "className" && (o = S(o)), o[s] = t.literal);
  }
}
function Td(o, t, e) {
  if (e.listenerEvent) {
    let i = e.parts[0];
    o.addEventListener(e.listenerEvent, function(r) {
      fd(r, t, e.target, i.source, i.negate);
    });
  }
}
function So(o, t, e, i, r, s) {
  s = t.static || s && (typeof s != "object" || s[t.methodName]);
  let n = {
    methodName: t.methodName,
    args: t.args,
    methodInfo: r,
    dynamicFn: s
  };
  for (let a = 0, l; a < t.args.length && (l = t.args[a]); a++)
    l.literal || o._addPropertyEffect(l.rootProperty, e, {
      fn: i,
      info: n,
      trigger: l
    });
  return s && o._addPropertyEffect(t.methodName, e, {
    fn: i,
    info: n
  }), n;
}
function tr(o, t, e, i, r) {
  let s = o._methodHost || o, n = s[r.methodName];
  if (n) {
    let a = o._marshalArgs(r.args, t, e);
    return a === bt ? bt : n.apply(s, a);
  } else
    r.dynamicFn;
}
const Pd = [], xn = "(?:[a-zA-Z_$][\\w.:$\\-*]*)", Dd = "(?:[-+]?[0-9]*\\.?[0-9]+(?:[eE][-+]?[0-9]+)?)", Od = "(?:'(?:[^'\\\\]|\\\\.)*')", zd = '(?:"(?:[^"\\\\]|\\\\.)*")', $d = "(?:" + Od + "|" + zd + ")", Io = "(?:(" + xn + "|" + Dd + "|" + $d + ")\\s*)", Md = "(?:" + Io + "(?:,\\s*" + Io + ")*)", Rd = "(?:\\(\\s*(?:" + Md + "?)\\)\\s*)", Fd = "(" + xn + "\\s*" + Rd + "?)", Nd = "(\\[\\[|{{)\\s*", Ld = "(?:]]|}})", Bd = "(?:(!)\\s*)?", Hd = Nd + Bd + Fd + Ld, To = new RegExp(Hd, "g");
function Po(o) {
  let t = "";
  for (let e = 0; e < o.length; e++) {
    let i = o[e].literal;
    t += i || "";
  }
  return t;
}
function Pi(o) {
  let t = o.match(/([^\s]+?)\(([\s\S]*)\)/);
  if (t) {
    let i = { methodName: t[1], static: !0, args: Pd };
    if (t[2].trim()) {
      let r = t[2].replace(/\\,/g, "&comma;").split(",");
      return Vd(r, i);
    } else
      return i;
  }
  return null;
}
function Vd(o, t) {
  return t.args = o.map(function(e) {
    let i = wn(e);
    return i.literal || (t.static = !1), i;
  }, this), t;
}
function wn(o) {
  let t = o.trim().replace(/&comma;/g, ",").replace(/\\(.)/g, "$1"), e = {
    name: t,
    value: "",
    literal: !1
  }, i = t[0];
  switch (i === "-" && (i = t[1]), i >= "0" && i <= "9" && (i = "#"), i) {
    case "'":
    case '"':
      e.value = t.slice(1, -1), e.literal = !0;
      break;
    case "#":
      e.value = Number(t), e.literal = !0;
      break;
  }
  return e.literal || (e.rootProperty = Ee(t), e.structured = Ji(t), e.structured && (e.wildcard = t.slice(-2) == ".*", e.wildcard && (e.name = t.slice(0, -2)))), e;
}
function Do(o, t, e) {
  let i = M(o, e);
  return i === void 0 && (i = t[e]), i;
}
function An(o, t, e, i) {
  const r = { indexSplices: i };
  Xi && !o._overrideLegacyUndefined && (t.splices = r), o.notifyPath(e + ".splices", r), o.notifyPath(e + ".length", t.length), Xi && !o._overrideLegacyUndefined && (r.indexSplices = []);
}
function Qe(o, t, e, i, r, s) {
  An(o, t, e, [{
    index: i,
    addedCount: r,
    removed: s,
    object: t,
    type: "splice"
  }]);
}
function Ud(o) {
  return o[0].toUpperCase() + o.substring(1);
}
const Pr = I((o) => {
  const t = dd(Jl(o));
  class e extends t {
    constructor() {
      super(), this.__isPropertyEffectsClient = !0, this.__dataClientsReady, this.__dataPendingClients, this.__dataToNotify, this.__dataLinkedPaths, this.__dataHasPaths, this.__dataCompoundStorage, this.__dataHost, this.__dataTemp, this.__dataClientsInitialized, this.__data, this.__dataPending, this.__dataOld, this.__computeEffects, this.__computeInfo, this.__reflectEffects, this.__notifyEffects, this.__propagateEffects, this.__observeEffects, this.__readOnly, this.__templateInfo, this._overrideLegacyUndefined;
    }
    get PROPERTY_EFFECT_TYPES() {
      return v;
    }
    /**
     * @override
     * @return {void}
     */
    _initializeProperties() {
      super._initializeProperties(), this._registerHost(), this.__dataClientsReady = !1, this.__dataPendingClients = null, this.__dataToNotify = null, this.__dataLinkedPaths = null, this.__dataHasPaths = !1, this.__dataCompoundStorage = this.__dataCompoundStorage || null, this.__dataHost = this.__dataHost || null, this.__dataTemp = {}, this.__dataClientsInitialized = !1;
    }
    _registerHost() {
      if (Ze.length) {
        let r = Ze[Ze.length - 1];
        r._enqueueClient(this), this.__dataHost = r;
      }
    }
    /**
     * Overrides `PropertyAccessors` implementation to provide a
     * more efficient implementation of initializing properties from
     * the prototype on the instance.
     *
     * @override
     * @param {Object} props Properties to initialize on the prototype
     * @return {void}
     */
    _initializeProtoProperties(r) {
      this.__data = Object.create(r), this.__dataPending = Object.create(r), this.__dataOld = {};
    }
    /**
     * Overrides `PropertyAccessors` implementation to avoid setting
     * `_setProperty`'s `shouldNotify: true`.
     *
     * @override
     * @param {Object} props Properties to initialize on the instance
     * @return {void}
     */
    _initializeInstanceProperties(r) {
      let s = this[v.READ_ONLY];
      for (let n in r)
        (!s || !s[n]) && (this.__dataPending = this.__dataPending || {}, this.__dataOld = this.__dataOld || {}, this.__data[n] = this.__dataPending[n] = r[n]);
    }
    // Prototype setup ----------------------------------------
    /**
     * Equivalent to static `addPropertyEffect` API but can be called on
     * an instance to add effects at runtime.  See that method for
     * full API docs.
     *
     * @override
     * @param {string} property Property that should trigger the effect
     * @param {string} type Effect type, from this.PROPERTY_EFFECT_TYPES
     * @param {Object=} effect Effect metadata object
     * @return {void}
     * @protected
     */
    _addPropertyEffect(r, s, n) {
      this._createPropertyAccessor(r, s == v.READ_ONLY);
      let a = Ii(this, s, !0)[r];
      a || (a = this[s][r] = []), a.push(n);
    }
    /**
     * Removes the given property effect.
     *
     * @override
     * @param {string} property Property the effect was associated with
     * @param {string} type Effect type, from this.PROPERTY_EFFECT_TYPES
     * @param {Object=} effect Effect metadata object to remove
     * @return {void}
     */
    _removePropertyEffect(r, s, n) {
      let a = Ii(this, s, !0)[r], l = a.indexOf(n);
      l >= 0 && a.splice(l, 1);
    }
    /**
     * Returns whether the current prototype/instance has a property effect
     * of a certain type.
     *
     * @override
     * @param {string} property Property name
     * @param {string=} type Effect type, from this.PROPERTY_EFFECT_TYPES
     * @return {boolean} True if the prototype/instance has an effect of this
     *     type
     * @protected
     */
    _hasPropertyEffect(r, s) {
      let n = this[s];
      return !!(n && n[r]);
    }
    /**
     * Returns whether the current prototype/instance has a "read only"
     * accessor for the given property.
     *
     * @override
     * @param {string} property Property name
     * @return {boolean} True if the prototype/instance has an effect of this
     *     type
     * @protected
     */
    _hasReadOnlyEffect(r) {
      return this._hasPropertyEffect(r, v.READ_ONLY);
    }
    /**
     * Returns whether the current prototype/instance has a "notify"
     * property effect for the given property.
     *
     * @override
     * @param {string} property Property name
     * @return {boolean} True if the prototype/instance has an effect of this
     *     type
     * @protected
     */
    _hasNotifyEffect(r) {
      return this._hasPropertyEffect(r, v.NOTIFY);
    }
    /**
     * Returns whether the current prototype/instance has a "reflect to
     * attribute" property effect for the given property.
     *
     * @override
     * @param {string} property Property name
     * @return {boolean} True if the prototype/instance has an effect of this
     *     type
     * @protected
     */
    _hasReflectEffect(r) {
      return this._hasPropertyEffect(r, v.REFLECT);
    }
    /**
     * Returns whether the current prototype/instance has a "computed"
     * property effect for the given property.
     *
     * @override
     * @param {string} property Property name
     * @return {boolean} True if the prototype/instance has an effect of this
     *     type
     * @protected
     */
    _hasComputedEffect(r) {
      return this._hasPropertyEffect(r, v.COMPUTE);
    }
    // Runtime ----------------------------------------
    /**
     * Sets a pending property or path.  If the root property of the path in
     * question had no accessor, the path is set, otherwise it is enqueued
     * via `_setPendingProperty`.
     *
     * This function isolates relatively expensive functionality necessary
     * for the public API (`set`, `setProperties`, `notifyPath`, and property
     * change listeners via {{...}} bindings), such that it is only done
     * when paths enter the system, and not at every propagation step.  It
     * also sets a `__dataHasPaths` flag on the instance which is used to
     * fast-path slower path-matching code in the property effects host paths.
     *
     * `path` can be a path string or array of path parts as accepted by the
     * public API.
     *
     * @override
     * @param {string | !Array<number|string>} path Path to set
     * @param {*} value Value to set
     * @param {boolean=} shouldNotify Set to true if this change should
     *  cause a property notification event dispatch
     * @param {boolean=} isPathNotification If the path being set is a path
     *   notification of an already changed value, as opposed to a request
     *   to set and notify the change.  In the latter `false` case, a dirty
     *   check is performed and then the value is set to the path before
     *   enqueuing the pending property change.
     * @return {boolean} Returns true if the property/path was enqueued in
     *   the pending changes bag.
     * @protected
     */
    _setPendingPropertyOrPath(r, s, n, a) {
      if (a || Ee(Array.isArray(r) ? r[0] : r) !== r) {
        if (!a) {
          let l = M(this, r);
          if (r = /** @type {string} */
          xo(this, r, s), !r || !super._shouldPropertyChange(r, s, l))
            return !1;
        }
        if (this.__dataHasPaths = !0, this._setPendingProperty(
          /**@type{string}*/
          r,
          s,
          n
        ))
          return Cd(
            this,
            /**@type{string}*/
            r,
            s
          ), !0;
      } else {
        if (this.__dataHasAccessor && this.__dataHasAccessor[r])
          return this._setPendingProperty(
            /**@type{string}*/
            r,
            s,
            n
          );
        this[r] = s;
      }
      return !1;
    }
    /**
     * Applies a value to a non-Polymer element/node's property.
     *
     * The implementation makes a best-effort at binding interop:
     * Some native element properties have side-effects when
     * re-setting the same value (e.g. setting `<input>.value` resets the
     * cursor position), so we do a dirty-check before setting the value.
     * However, for better interop with non-Polymer custom elements that
     * accept objects, we explicitly re-set object changes coming from the
     * Polymer world (which may include deep object changes without the
     * top reference changing), erring on the side of providing more
     * information.
     *
     * Users may override this method to provide alternate approaches.
     *
     * @override
     * @param {!Node} node The node to set a property on
     * @param {string} prop The property to set
     * @param {*} value The value to set
     * @return {void}
     * @protected
     */
    _setUnmanagedPropertyToNode(r, s, n) {
      (n !== r[s] || typeof n == "object") && (s === "className" && (r = /** @type {!Node} */
      S(r)), r[s] = n);
    }
    /**
     * Overrides the `PropertiesChanged` implementation to introduce special
     * dirty check logic depending on the property & value being set:
     *
     * 1. Any value set to a path (e.g. 'obj.prop': 42 or 'obj.prop': {...})
     *    Stored in `__dataTemp`, dirty checked against `__dataTemp`
     * 2. Object set to simple property (e.g. 'prop': {...})
     *    Stored in `__dataTemp` and `__data`, dirty checked against
     *    `__dataTemp` by default implementation of `_shouldPropertyChange`
     * 3. Primitive value set to simple property (e.g. 'prop': 42)
     *    Stored in `__data`, dirty checked against `__data`
     *
     * The dirty-check is important to prevent cycles due to two-way
     * notification, but paths and objects are only dirty checked against any
     * previous value set during this turn via a "temporary cache" that is
     * cleared when the last `_propertiesChanged` exits. This is so:
     * a. any cached array paths (e.g. 'array.3.prop') may be invalidated
     *    due to array mutations like shift/unshift/splice; this is fine
     *    since path changes are dirty-checked at user entry points like `set`
     * b. dirty-checking for objects only lasts one turn to allow the user
     *    to mutate the object in-place and re-set it with the same identity
     *    and have all sub-properties re-propagated in a subsequent turn.
     *
     * The temp cache is not necessarily sufficient to prevent invalid array
     * paths, since a splice can happen during the same turn (with pathological
     * user code); we could introduce a "fixup" for temporarily cached array
     * paths if needed: https://github.com/Polymer/polymer/issues/4227
     *
     * @override
     * @param {string} property Name of the property
     * @param {*} value Value to set
     * @param {boolean=} shouldNotify True if property should fire notification
     *   event (applies only for `notify: true` properties)
     * @return {boolean} Returns true if the property changed
     */
    _setPendingProperty(r, s, n) {
      let a = this.__dataHasPaths && Ji(r), l = a ? this.__dataTemp : this.__data;
      return this._shouldPropertyChange(r, s, l[r]) ? (this.__dataPending || (this.__dataPending = {}, this.__dataOld = {}), r in this.__dataOld || (this.__dataOld[r] = this.__data[r]), a ? this.__dataTemp[r] = s : this.__data[r] = s, this.__dataPending[r] = s, (a || this[v.NOTIFY] && this[v.NOTIFY][r]) && (this.__dataToNotify = this.__dataToNotify || {}, this.__dataToNotify[r] = n), !0) : !1;
    }
    /**
     * Overrides base implementation to ensure all accessors set `shouldNotify`
     * to true, for per-property notification tracking.
     *
     * @override
     * @param {string} property Name of the property
     * @param {*} value Value to set
     * @return {void}
     */
    _setProperty(r, s) {
      this._setPendingProperty(r, s, !0) && this._invalidateProperties();
    }
    /**
     * Overrides `PropertyAccessor`'s default async queuing of
     * `_propertiesChanged`: if `__dataReady` is false (has not yet been
     * manually flushed), the function no-ops; otherwise flushes
     * `_propertiesChanged` synchronously.
     *
     * @override
     * @return {void}
     */
    _invalidateProperties() {
      this.__dataReady && this._flushProperties();
    }
    /**
     * Enqueues the given client on a list of pending clients, whose
     * pending property changes can later be flushed via a call to
     * `_flushClients`.
     *
     * @override
     * @param {Object} client PropertyEffects client to enqueue
     * @return {void}
     * @protected
     */
    _enqueueClient(r) {
      this.__dataPendingClients = this.__dataPendingClients || [], r !== this && this.__dataPendingClients.push(r);
    }
    /**
     * Flushes any clients previously enqueued via `_enqueueClient`, causing
     * their `_flushProperties` method to run.
     *
     * @override
     * @return {void}
     * @protected
     */
    _flushClients() {
      this.__dataClientsReady ? this.__enableOrFlushClients() : (this.__dataClientsReady = !0, this._readyClients(), this.__dataReady = !0);
    }
    // NOTE: We ensure clients either enable or flush as appropriate. This
    // handles two corner cases:
    // (1) clients flush properly when connected/enabled before the host
    // enables; e.g.
    //   (a) Templatize stamps with no properties and does not flush and
    //   (b) the instance is inserted into dom and
    //   (c) then the instance flushes.
    // (2) clients enable properly when not connected/enabled when the host
    // flushes; e.g.
    //   (a) a template is runtime stamped and not yet connected/enabled
    //   (b) a host sets a property, causing stamped dom to flush
    //   (c) the stamped dom enables.
    __enableOrFlushClients() {
      let r = this.__dataPendingClients;
      if (r) {
        this.__dataPendingClients = null;
        for (let s = 0; s < r.length; s++) {
          let n = r[s];
          n.__dataEnabled ? n.__dataPending && n._flushProperties() : n._enableProperties();
        }
      }
    }
    /**
     * Perform any initial setup on client dom. Called before the first
     * `_flushProperties` call on client dom and before any element
     * observers are called.
     *
     * @override
     * @return {void}
     * @protected
     */
    _readyClients() {
      this.__enableOrFlushClients();
    }
    /**
     * Sets a bag of property changes to this instance, and
     * synchronously processes all effects of the properties as a batch.
     *
     * Property names must be simple properties, not paths.  Batched
     * path propagation is not supported.
     *
     * @override
     * @param {Object} props Bag of one or more key-value pairs whose key is
     *   a property and value is the new value to set for that property.
     * @param {boolean=} setReadOnly When true, any private values set in
     *   `props` will be set. By default, `setProperties` will not set
     *   `readOnly: true` root properties.
     * @return {void}
     * @public
     */
    setProperties(r, s) {
      for (let n in r)
        (s || !this[v.READ_ONLY] || !this[v.READ_ONLY][n]) && this._setPendingPropertyOrPath(n, r[n], !0);
      this._invalidateProperties();
    }
    /**
     * Overrides `PropertyAccessors` so that property accessor
     * side effects are not enabled until after client dom is fully ready.
     * Also calls `_flushClients` callback to ensure client dom is enabled
     * that was not enabled as a result of flushing properties.
     *
     * @override
     * @return {void}
     */
    ready() {
      this._flushProperties(), this.__dataClientsReady || this._flushClients(), this.__dataPending && this._flushProperties();
    }
    /**
     * Implements `PropertyAccessors`'s properties changed callback.
     *
     * Runs each class of effects for the batch of changed properties in
     * a specific order (compute, propagate, reflect, observe, notify).
     *
     * @override
     * @param {!Object} currentProps Bag of all current accessor values
     * @param {?Object} changedProps Bag of properties changed since the last
     *   call to `_propertiesChanged`
     * @param {?Object} oldProps Bag of previous values for each property
     *   in `changedProps`
     * @return {void}
     */
    _propertiesChanged(r, s, n) {
      let a = this.__dataHasPaths;
      this.__dataHasPaths = !1;
      let l;
      gd(this, s, n, a), l = this.__dataToNotify, this.__dataToNotify = null, this._propagatePropertyChanges(s, n, a), this._flushClients(), ot(this, this[v.REFLECT], s, n, a), ot(this, this[v.OBSERVE], s, n, a), l && ud(this, l, s, n, a), this.__dataCounter == 1 && (this.__dataTemp = {});
    }
    /**
     * Called to propagate any property changes to stamped template nodes
     * managed by this element.
     *
     * @override
     * @param {Object} changedProps Bag of changed properties
     * @param {Object} oldProps Bag of previous values for changed properties
     * @param {boolean} hasPaths True with `props` contains one or more paths
     * @return {void}
     * @protected
     */
    _propagatePropertyChanges(r, s, n) {
      this[v.PROPAGATE] && ot(this, this[v.PROPAGATE], r, s, n), this.__templateInfo && this._runEffectsForTemplate(this.__templateInfo, r, s, n);
    }
    _runEffectsForTemplate(r, s, n, a) {
      const l = (d, c) => {
        ot(
          this,
          r.propertyEffects,
          d,
          n,
          c,
          r.nodeList
        );
        for (let h = r.firstChild; h; h = h.nextSibling)
          this._runEffectsForTemplate(h, d, n, c);
      };
      r.runEffects ? r.runEffects(l, s, a) : l(s, a);
    }
    /**
     * Aliases one data path as another, such that path notifications from one
     * are routed to the other.
     *
     * @override
     * @param {string | !Array<string|number>} to Target path to link.
     * @param {string | !Array<string|number>} from Source path to link.
     * @return {void}
     * @public
     */
    linkPaths(r, s) {
      r = rt(r), s = rt(s), this.__dataLinkedPaths = this.__dataLinkedPaths || {}, this.__dataLinkedPaths[r] = s;
    }
    /**
     * Removes a data path alias previously established with `_linkPaths`.
     *
     * Note, the path to unlink should be the target (`to`) used when
     * linking the paths.
     *
     * @override
     * @param {string | !Array<string|number>} path Target path to unlink.
     * @return {void}
     * @public
     */
    unlinkPaths(r) {
      r = rt(r), this.__dataLinkedPaths && delete this.__dataLinkedPaths[r];
    }
    /**
     * Notify that an array has changed.
     *
     * Example:
     *
     *     this.items = [ {name: 'Jim'}, {name: 'Todd'}, {name: 'Bill'} ];
     *     ...
     *     this.items.splice(1, 1, {name: 'Sam'});
     *     this.items.push({name: 'Bob'});
     *     this.notifySplices('items', [
     *       { index: 1, removed: [{name: 'Todd'}], addedCount: 1,
     *         object: this.items, type: 'splice' },
     *       { index: 3, removed: [], addedCount: 1,
     *         object: this.items, type: 'splice'}
     *     ]);
     *
     * @param {string} path Path that should be notified.
     * @param {Array} splices Array of splice records indicating ordered
     *   changes that occurred to the array. Each record should have the
     *   following fields:
     *    * index: index at which the change occurred
     *    * removed: array of items that were removed from this index
     *    * addedCount: number of new items added at this index
     *    * object: a reference to the array in question
     *    * type: the string literal 'splice'
     *
     *   Note that splice records _must_ be normalized such that they are
     *   reported in index order (raw results from `Object.observe` are not
     *   ordered and must be normalized/merged before notifying).
     *
     * @override
     * @return {void}
     * @public
     */
    notifySplices(r, s) {
      let n = { path: "" }, a = (
        /** @type {Array} */
        M(this, r, n)
      );
      An(this, a, n.path, s);
    }
    /**
     * Convenience method for reading a value from a path.
     *
     * Note, if any part in the path is undefined, this method returns
     * `undefined` (this method does not throw when dereferencing undefined
     * paths).
     *
     * @override
     * @param {(string|!Array<(string|number)>)} path Path to the value
     *   to read.  The path may be specified as a string (e.g. `foo.bar.baz`)
     *   or an array of path parts (e.g. `['foo.bar', 'baz']`).  Note that
     *   bracketed expressions are not supported; string-based path parts
     *   *must* be separated by dots.  Note that when dereferencing array
     *   indices, the index may be used as a dotted part directly
     *   (e.g. `users.12.name` or `['users', 12, 'name']`).
     * @param {Object=} root Root object from which the path is evaluated.
     * @return {*} Value at the path, or `undefined` if any part of the path
     *   is undefined.
     * @public
     */
    get(r, s) {
      return M(s || this, r);
    }
    /**
     * Convenience method for setting a value to a path and notifying any
     * elements bound to the same path.
     *
     * Note, if any part in the path except for the last is undefined,
     * this method does nothing (this method does not throw when
     * dereferencing undefined paths).
     *
     * @override
     * @param {(string|!Array<(string|number)>)} path Path to the value
     *   to write.  The path may be specified as a string (e.g. `'foo.bar.baz'`)
     *   or an array of path parts (e.g. `['foo.bar', 'baz']`).  Note that
     *   bracketed expressions are not supported; string-based path parts
     *   *must* be separated by dots.  Note that when dereferencing array
     *   indices, the index may be used as a dotted part directly
     *   (e.g. `'users.12.name'` or `['users', 12, 'name']`).
     * @param {*} value Value to set at the specified path.
     * @param {Object=} root Root object from which the path is evaluated.
     *   When specified, no notification will occur.
     * @return {void}
     * @public
     */
    set(r, s, n) {
      n ? xo(n, r, s) : (!this[v.READ_ONLY] || !this[v.READ_ONLY][
        /** @type {string} */
        r
      ]) && this._setPendingPropertyOrPath(r, s, !0) && this._invalidateProperties();
    }
    /**
     * Adds items onto the end of the array at the path specified.
     *
     * The arguments after `path` and return value match that of
     * `Array.prototype.push`.
     *
     * This method notifies other paths to the same array that a
     * splice occurred to the array.
     *
     * @override
     * @param {string | !Array<string|number>} path Path to array.
     * @param {...*} items Items to push onto array
     * @return {number} New length of the array.
     * @public
     */
    push(r, ...s) {
      let n = { path: "" }, a = (
        /** @type {Array}*/
        M(this, r, n)
      ), l = a.length, d = a.push(...s);
      return s.length && Qe(this, a, n.path, l, s.length, []), d;
    }
    /**
     * Removes an item from the end of array at the path specified.
     *
     * The arguments after `path` and return value match that of
     * `Array.prototype.pop`.
     *
     * This method notifies other paths to the same array that a
     * splice occurred to the array.
     *
     * @override
     * @param {string | !Array<string|number>} path Path to array.
     * @return {*} Item that was removed.
     * @public
     */
    pop(r) {
      let s = { path: "" }, n = (
        /** @type {Array} */
        M(this, r, s)
      ), a = !!n.length, l = n.pop();
      return a && Qe(this, n, s.path, n.length, 0, [l]), l;
    }
    /**
     * Starting from the start index specified, removes 0 or more items
     * from the array and inserts 0 or more new items in their place.
     *
     * The arguments after `path` and return value match that of
     * `Array.prototype.splice`.
     *
     * This method notifies other paths to the same array that a
     * splice occurred to the array.
     *
     * @override
     * @param {string | !Array<string|number>} path Path to array.
     * @param {number} start Index from which to start removing/inserting.
     * @param {number=} deleteCount Number of items to remove.
     * @param {...*} items Items to insert into array.
     * @return {!Array} Array of removed items.
     * @public
     */
    splice(r, s, n, ...a) {
      let l = { path: "" }, d = (
        /** @type {Array} */
        M(this, r, l)
      );
      s < 0 ? s = d.length - Math.floor(-s) : s && (s = Math.floor(s));
      let c;
      return arguments.length === 2 ? c = d.splice(s) : c = d.splice(s, n, ...a), (a.length || c.length) && Qe(this, d, l.path, s, a.length, c), c;
    }
    /**
     * Removes an item from the beginning of array at the path specified.
     *
     * The arguments after `path` and return value match that of
     * `Array.prototype.pop`.
     *
     * This method notifies other paths to the same array that a
     * splice occurred to the array.
     *
     * @override
     * @param {string | !Array<string|number>} path Path to array.
     * @return {*} Item that was removed.
     * @public
     */
    shift(r) {
      let s = { path: "" }, n = (
        /** @type {Array} */
        M(this, r, s)
      ), a = !!n.length, l = n.shift();
      return a && Qe(this, n, s.path, 0, 0, [l]), l;
    }
    /**
     * Adds items onto the beginning of the array at the path specified.
     *
     * The arguments after `path` and return value match that of
     * `Array.prototype.push`.
     *
     * This method notifies other paths to the same array that a
     * splice occurred to the array.
     *
     * @override
     * @param {string | !Array<string|number>} path Path to array.
     * @param {...*} items Items to insert info array
     * @return {number} New length of the array.
     * @public
     */
    unshift(r, ...s) {
      let n = { path: "" }, a = (
        /** @type {Array} */
        M(this, r, n)
      ), l = a.unshift(...s);
      return s.length && Qe(this, a, n.path, 0, s.length, []), l;
    }
    /**
     * Notify that a path has changed.
     *
     * Example:
     *
     *     this.item.user.name = 'Bob';
     *     this.notifyPath('item.user.name');
     *
     * @override
     * @param {string} path Path that should be notified.
     * @param {*=} value Value at the path (optional).
     * @return {void}
     * @public
     */
    notifyPath(r, s) {
      let n;
      if (arguments.length == 1) {
        let a = { path: "" };
        s = M(this, r, a), n = a.path;
      } else
        Array.isArray(r) ? n = rt(r) : n = /** @type{string} */
        r;
      this._setPendingPropertyOrPath(n, s, !0, !0) && this._invalidateProperties();
    }
    /**
     * Equivalent to static `createReadOnlyProperty` API but can be called on
     * an instance to add effects at runtime.  See that method for
     * full API docs.
     *
     * @override
     * @param {string} property Property name
     * @param {boolean=} protectedSetter Creates a custom protected setter
     *   when `true`.
     * @return {void}
     * @protected
     */
    _createReadOnlyProperty(r, s) {
      this._addPropertyEffect(r, v.READ_ONLY), s && (this["_set" + Ud(r)] = /** @this {PropertyEffects} */
      function(n) {
        this._setProperty(r, n);
      });
    }
    /**
     * Equivalent to static `createPropertyObserver` API but can be called on
     * an instance to add effects at runtime.  See that method for
     * full API docs.
     *
     * @override
     * @param {string} property Property name
     * @param {string|function(*,*)} method Function or name of observer method
     *     to call
     * @param {boolean=} dynamicFn Whether the method name should be included as
     *   a dependency to the effect.
     * @return {void}
     * @protected
     */
    _createPropertyObserver(r, s, n) {
      let a = { property: r, method: s, dynamicFn: !!n };
      this._addPropertyEffect(r, v.OBSERVE, {
        fn: ko,
        info: a,
        trigger: { name: r }
      }), n && this._addPropertyEffect(
        /** @type {string} */
        s,
        v.OBSERVE,
        {
          fn: ko,
          info: a,
          trigger: { name: s }
        }
      );
    }
    /**
     * Equivalent to static `createMethodObserver` API but can be called on
     * an instance to add effects at runtime.  See that method for
     * full API docs.
     *
     * @override
     * @param {string} expression Method expression
     * @param {boolean|Object=} dynamicFn Boolean or object map indicating
     *   whether method names should be included as a dependency to the effect.
     * @return {void}
     * @protected
     */
    _createMethodObserver(r, s) {
      let n = Pi(r);
      if (!n)
        throw new Error("Malformed observer expression '" + r + "'");
      So(this, n, v.OBSERVE, tr, null, s);
    }
    /**
     * Equivalent to static `createNotifyingProperty` API but can be called on
     * an instance to add effects at runtime.  See that method for
     * full API docs.
     *
     * @override
     * @param {string} property Property name
     * @return {void}
     * @protected
     */
    _createNotifyingProperty(r) {
      this._addPropertyEffect(r, v.NOTIFY, {
        fn: _d,
        info: {
          eventName: ni(r) + "-changed",
          property: r
        }
      });
    }
    /**
     * Equivalent to static `createReflectedProperty` API but can be called on
     * an instance to add effects at runtime.  See that method for
     * full API docs.
     *
     * @override
     * @param {string} property Property name
     * @return {void}
     * @protected
     * @suppress {missingProperties} go/missingfnprops
     */
    _createReflectedProperty(r) {
      let s = this.constructor.attributeNameForProperty(r);
      s[0] === "-" || this._addPropertyEffect(r, v.REFLECT, {
        fn: md,
        info: {
          attrName: s
        }
      });
    }
    /**
     * Equivalent to static `createComputedProperty` API but can be called on
     * an instance to add effects at runtime.  See that method for
     * full API docs.
     *
     * @override
     * @param {string} property Name of computed property to set
     * @param {string} expression Method expression
     * @param {boolean|Object=} dynamicFn Boolean or object map indicating
     *   whether method names should be included as a dependency to the effect.
     * @return {void}
     * @protected
     */
    _createComputedProperty(r, s, n) {
      let a = Pi(s);
      if (!a)
        throw new Error("Malformed computed expression '" + s + "'");
      const l = So(this, a, v.COMPUTE, Cn, r, n);
      Ii(this, vn)[r] = l;
    }
    /**
     * Gather the argument values for a method specified in the provided array
     * of argument metadata.
     *
     * The `path` and `value` arguments are used to fill in wildcard descriptor
     * when the method is being called as a result of a path notification.
     *
     * @param {!Array<!MethodArg>} args Array of argument metadata
     * @param {string} path Property/path name that triggered the method effect
     * @param {Object} props Bag of current property changes
     * @return {!Array<*>} Array of argument values
     * @private
     */
    _marshalArgs(r, s, n) {
      const a = this.__data, l = [];
      for (let d = 0, c = r.length; d < c; d++) {
        let { name: h, structured: u, wildcard: p, value: f, literal: x } = r[d];
        if (!x)
          if (p) {
            const T = ft(h, s), z = Do(a, n, T ? s : h);
            f = {
              path: T ? s : h,
              value: z,
              base: T ? M(a, h) : z
            };
          } else
            f = u ? Do(a, n, h) : a[h];
        if (Xi && !this._overrideLegacyUndefined && f === void 0 && r.length > 1)
          return bt;
        l[d] = f;
      }
      return l;
    }
    // -- static class methods ------------
    /**
     * Ensures an accessor exists for the specified property, and adds
     * to a list of "property effects" that will run when the accessor for
     * the specified property is set.  Effects are grouped by "type", which
     * roughly corresponds to a phase in effect processing.  The effect
     * metadata should be in the following form:
     *
     *     {
     *       fn: effectFunction, // Reference to function to call to perform effect
     *       info: { ... }       // Effect metadata passed to function
     *       trigger: {          // Optional triggering metadata; if not provided
     *         name: string      // the property is treated as a wildcard
     *         structured: boolean
     *         wildcard: boolean
     *       }
     *     }
     *
     * Effects are called from `_propertiesChanged` in the following order by
     * type:
     *
     * 1. COMPUTE
     * 2. PROPAGATE
     * 3. REFLECT
     * 4. OBSERVE
     * 5. NOTIFY
     *
     * Effect functions are called with the following signature:
     *
     *     effectFunction(inst, path, props, oldProps, info, hasPaths)
     *
     * @param {string} property Property that should trigger the effect
     * @param {string} type Effect type, from this.PROPERTY_EFFECT_TYPES
     * @param {Object=} effect Effect metadata object
     * @return {void}
     * @protected
     * @nocollapse
     */
    static addPropertyEffect(r, s, n) {
      this.prototype._addPropertyEffect(r, s, n);
    }
    /**
     * Creates a single-property observer for the given property.
     *
     * @param {string} property Property name
     * @param {string|function(*,*)} method Function or name of observer method to call
     * @param {boolean=} dynamicFn Whether the method name should be included as
     *   a dependency to the effect.
     * @return {void}
     * @protected
     * @nocollapse
     */
    static createPropertyObserver(r, s, n) {
      this.prototype._createPropertyObserver(r, s, n);
    }
    /**
     * Creates a multi-property "method observer" based on the provided
     * expression, which should be a string in the form of a normal JavaScript
     * function signature: `'methodName(arg1, [..., argn])'`.  Each argument
     * should correspond to a property or path in the context of this
     * prototype (or instance), or may be a literal string or number.
     *
     * @param {string} expression Method expression
     * @param {boolean|Object=} dynamicFn Boolean or object map indicating
     * @return {void}
     *   whether method names should be included as a dependency to the effect.
     * @protected
     * @nocollapse
     */
    static createMethodObserver(r, s) {
      this.prototype._createMethodObserver(r, s);
    }
    /**
     * Causes the setter for the given property to dispatch `<property>-changed`
     * events to notify of changes to the property.
     *
     * @param {string} property Property name
     * @return {void}
     * @protected
     * @nocollapse
     */
    static createNotifyingProperty(r) {
      this.prototype._createNotifyingProperty(r);
    }
    /**
     * Creates a read-only accessor for the given property.
     *
     * To set the property, use the protected `_setProperty` API.
     * To create a custom protected setter (e.g. `_setMyProp()` for
     * property `myProp`), pass `true` for `protectedSetter`.
     *
     * Note, if the property will have other property effects, this method
     * should be called first, before adding other effects.
     *
     * @param {string} property Property name
     * @param {boolean=} protectedSetter Creates a custom protected setter
     *   when `true`.
     * @return {void}
     * @protected
     * @nocollapse
     */
    static createReadOnlyProperty(r, s) {
      this.prototype._createReadOnlyProperty(r, s);
    }
    /**
     * Causes the setter for the given property to reflect the property value
     * to a (dash-cased) attribute of the same name.
     *
     * @param {string} property Property name
     * @return {void}
     * @protected
     * @nocollapse
     */
    static createReflectedProperty(r) {
      this.prototype._createReflectedProperty(r);
    }
    /**
     * Creates a computed property whose value is set to the result of the
     * method described by the given `expression` each time one or more
     * arguments to the method changes.  The expression should be a string
     * in the form of a normal JavaScript function signature:
     * `'methodName(arg1, [..., argn])'`
     *
     * @param {string} property Name of computed property to set
     * @param {string} expression Method expression
     * @param {boolean|Object=} dynamicFn Boolean or object map indicating whether
     *   method names should be included as a dependency to the effect.
     * @return {void}
     * @protected
     * @nocollapse
     */
    static createComputedProperty(r, s, n) {
      this.prototype._createComputedProperty(r, s, n);
    }
    /**
     * Parses the provided template to ensure binding effects are created
     * for them, and then ensures property accessors are created for any
     * dependent properties in the template.  Binding effects for bound
     * templates are stored in a linked list on the instance so that
     * templates can be efficiently stamped and unstamped.
     *
     * @param {!HTMLTemplateElement} template Template containing binding
     *   bindings
     * @return {!TemplateInfo} Template metadata object
     * @protected
     * @nocollapse
     */
    static bindTemplate(r) {
      return this.prototype._bindTemplate(r);
    }
    // -- binding ----------------------------------------------
    /*
     * Overview of binding flow:
     *
     * During finalization (`instanceBinding==false`, `wasPreBound==false`):
     *  `_bindTemplate(t, false)` called directly during finalization - parses
     *  the template (for the first time), and then assigns that _prototypical_
     *  template info to `__preboundTemplateInfo` _on the prototype_; note in
     *  this case `wasPreBound` is false; this is the first time we're binding
     *  it, thus we create accessors.
     *
     * During first stamping (`instanceBinding==true`, `wasPreBound==true`):
     *   `_stampTemplate` calls `_bindTemplate(t, true)`: the `templateInfo`
     *   returned matches the prebound one, and so this is `wasPreBound == true`
     *   state; thus we _skip_ creating accessors, but _do_ create an instance
     *   of the template info to serve as the start of our linked list (needs to
     *   be an instance, not the prototypical one, so that we can add `nodeList`
     *   to it to contain the `nodeInfo`-ordered list of instance nodes for
     *   bindings, and so we can chain runtime-stamped template infos off of
     *   it). At this point, the call to `_stampTemplate` calls
     *   `applyTemplateInfo` for each nested `<template>` found during parsing
     *   to hand prototypical `_templateInfo` to them; we also pass the _parent_
     *   `templateInfo` to the `<template>` so that we have the instance-time
     *   parent to link the `templateInfo` under in the case it was
     *   runtime-stamped.
     *
     * During subsequent runtime stamping (`instanceBinding==true`,
     *   `wasPreBound==false`): `_stampTemplate` calls `_bindTemplate(t, true)`
     *   - here `templateInfo` is guaranteed to _not_ match the prebound one,
     *   because it was either a different template altogether, or even if it
     *   was the same template, the step above created a instance of the info;
     *   in this case `wasPreBound == false`, so we _do_ create accessors, _and_
     *   link a instance into the linked list.
     */
    /**
     * Equivalent to static `bindTemplate` API but can be called on an instance
     * to add effects at runtime.  See that method for full API docs.
     *
     * This method may be called on the prototype (for prototypical template
     * binding, to avoid creating accessors every instance) once per prototype,
     * and will be called with `runtimeBinding: true` by `_stampTemplate` to
     * create and link an instance of the template metadata associated with a
     * particular stamping.
     *
     * @override
     * @param {!HTMLTemplateElement} template Template containing binding
     * bindings
     * @param {boolean=} instanceBinding When false (default), performs
     * "prototypical" binding of the template and overwrites any previously
     * bound template for the class. When true (as passed from
     * `_stampTemplate`), the template info is instanced and linked into the
     * list of bound templates.
     * @return {!TemplateInfo} Template metadata object; for `runtimeBinding`,
     * this is an instance of the prototypical template info
     * @protected
     * @suppress {missingProperties} go/missingfnprops
     */
    _bindTemplate(r, s) {
      let n = this.constructor._parseTemplate(r), a = this.__preBoundTemplateInfo == n;
      if (!a)
        for (let l in n.propertyEffects)
          this._createPropertyAccessor(l);
      if (s)
        if (n = /** @type {!TemplateInfo} */
        Object.create(n), n.wasPreBound = a, !this.__templateInfo)
          this.__templateInfo = n;
        else {
          const l = r._parentTemplateInfo || this.__templateInfo, d = l.lastChild;
          n.parent = l, l.lastChild = n, n.previousSibling = d, d ? d.nextSibling = n : l.firstChild = n;
        }
      else
        this.__preBoundTemplateInfo = n;
      return n;
    }
    /**
     * Adds a property effect to the given template metadata, which is run
     * at the "propagate" stage of `_propertiesChanged` when the template
     * has been bound to the element via `_bindTemplate`.
     *
     * The `effect` object should match the format in `_addPropertyEffect`.
     *
     * @param {Object} templateInfo Template metadata to add effect to
     * @param {string} prop Property that should trigger the effect
     * @param {Object=} effect Effect metadata object
     * @return {void}
     * @protected
     * @nocollapse
     */
    static _addTemplatePropertyEffect(r, s, n) {
      let a = r.hostProps = r.hostProps || {};
      a[s] = !0;
      let l = r.propertyEffects = r.propertyEffects || {};
      (l[s] = l[s] || []).push(n);
    }
    /**
     * Stamps the provided template and performs instance-time setup for
     * Polymer template features, including data bindings, declarative event
     * listeners, and the `this.$` map of `id`'s to nodes.  A document fragment
     * is returned containing the stamped DOM, ready for insertion into the
     * DOM.
     *
     * This method may be called more than once; however note that due to
     * `shadycss` polyfill limitations, only styles from templates prepared
     * using `ShadyCSS.prepareTemplate` will be correctly polyfilled (scoped
     * to the shadow root and support CSS custom properties), and note that
     * `ShadyCSS.prepareTemplate` may only be called once per element. As such,
     * any styles required by in runtime-stamped templates must be included
     * in the main element template.
     *
     * @param {!HTMLTemplateElement} template Template to stamp
     * @param {TemplateInfo=} templateInfo Optional bound template info associated
     *   with the template to be stamped; if omitted the template will be
     *   automatically bound.
     * @return {!StampedTemplate} Cloned template content
     * @override
     * @protected
     */
    _stampTemplate(r, s) {
      s = s || /** @type {!TemplateInfo} */
      this._bindTemplate(r, !0), Ze.push(this);
      let n = super._stampTemplate(r, s);
      if (Ze.pop(), s.nodeList = n.nodeList, !s.wasPreBound) {
        let a = s.childNodes = [];
        for (let l = n.firstChild; l; l = l.nextSibling)
          a.push(l);
      }
      return n.templateInfo = s, Sd(this, s), this.__dataClientsReady && (this._runEffectsForTemplate(s, this.__data, null, !1), this._flushClients()), n;
    }
    /**
     * Removes and unbinds the nodes previously contained in the provided
     * DocumentFragment returned from `_stampTemplate`.
     *
     * @override
     * @param {!StampedTemplate} dom DocumentFragment previously returned
     *   from `_stampTemplate` associated with the nodes to be removed
     * @return {void}
     * @protected
     */
    _removeBoundDom(r) {
      const s = r.templateInfo, { previousSibling: n, nextSibling: a, parent: l } = s;
      n ? n.nextSibling = a : l && (l.firstChild = a), a ? a.previousSibling = n : l && (l.lastChild = n), s.nextSibling = s.previousSibling = null;
      let d = s.childNodes;
      for (let c = 0; c < d.length; c++) {
        let h = d[c];
        S(S(h).parentNode).removeChild(h);
      }
    }
    /**
     * Overrides default `TemplateStamp` implementation to add support for
     * parsing bindings from `TextNode`'s' `textContent`.  A `bindings`
     * array is added to `nodeInfo` and populated with binding metadata
     * with information capturing the binding target, and a `parts` array
     * with one or more metadata objects capturing the source(s) of the
     * binding.
     *
     * @param {Node} node Node to parse
     * @param {TemplateInfo} templateInfo Template metadata for current template
     * @param {NodeInfo} nodeInfo Node metadata for current template node
     * @return {boolean} `true` if the visited node added node-specific
     *   metadata to `nodeInfo`
     * @protected
     * @suppress {missingProperties} Interfaces in closure do not inherit statics, but classes do
     * @nocollapse
     */
    static _parseTemplateNode(r, s, n) {
      let a = t._parseTemplateNode.call(
        this,
        r,
        s,
        n
      );
      if (r.nodeType === Node.TEXT_NODE) {
        let l = this._parseBindings(r.textContent, s);
        l && (r.textContent = Po(l) || " ", Ti(this, s, n, "text", "textContent", l), a = !0);
      }
      return a;
    }
    /**
     * Overrides default `TemplateStamp` implementation to add support for
     * parsing bindings from attributes.  A `bindings`
     * array is added to `nodeInfo` and populated with binding metadata
     * with information capturing the binding target, and a `parts` array
     * with one or more metadata objects capturing the source(s) of the
     * binding.
     *
     * @param {Element} node Node to parse
     * @param {TemplateInfo} templateInfo Template metadata for current template
     * @param {NodeInfo} nodeInfo Node metadata for current template node
     * @param {string} name Attribute name
     * @param {string} value Attribute value
     * @return {boolean} `true` if the visited node added node-specific
     *   metadata to `nodeInfo`
     * @protected
     * @suppress {missingProperties} Interfaces in closure do not inherit statics, but classes do
     * @nocollapse
     */
    static _parseTemplateNodeAttribute(r, s, n, a, l) {
      let d = this._parseBindings(l, s);
      if (d) {
        let c = a, h = "property";
        cd.test(a) ? h = "attribute" : a[a.length - 1] == "$" && (a = a.slice(0, -1), h = "attribute");
        let u = Po(d);
        return u && h == "attribute" && (a == "class" && r.hasAttribute("class") && (u += " " + r.getAttribute(a)), r.setAttribute(a, u)), h == "attribute" && c == "disable-upgrade$" && r.setAttribute(a, ""), r.localName === "input" && c === "value" && r.setAttribute(c, ""), r.removeAttribute(c), h === "property" && (a = pn(a)), Ti(this, s, n, h, a, d, u), !0;
      } else
        return t._parseTemplateNodeAttribute.call(
          this,
          r,
          s,
          n,
          a,
          l
        );
    }
    /**
     * Overrides default `TemplateStamp` implementation to add support for
     * binding the properties that a nested template depends on to the template
     * as `_host_<property>`.
     *
     * @param {Node} node Node to parse
     * @param {TemplateInfo} templateInfo Template metadata for current template
     * @param {NodeInfo} nodeInfo Node metadata for current template node
     * @return {boolean} `true` if the visited node added node-specific
     *   metadata to `nodeInfo`
     * @protected
     * @suppress {missingProperties} Interfaces in closure do not inherit statics, but classes do
     * @nocollapse
     */
    static _parseTemplateNestedTemplate(r, s, n) {
      let a = t._parseTemplateNestedTemplate.call(
        this,
        r,
        s,
        n
      );
      const l = r.parentNode, d = n.templateInfo, c = l.localName === "dom-if", h = l.localName === "dom-repeat";
      mo && (c || h) && (l.removeChild(r), n = n.parentInfo, n.templateInfo = d, n.noted = !0, a = !1);
      let u = d.hostProps;
      if ($l && c)
        u && (s.hostProps = Object.assign(s.hostProps || {}, u), mo || (n.parentInfo.noted = !0));
      else {
        let p = "{";
        for (let f in u) {
          let x = [{ mode: p, source: f, dependencies: [f], hostProp: !0 }];
          Ti(this, s, n, "property", "_host_" + f, x);
        }
      }
      return a;
    }
    /**
     * Called to parse text in a template (either attribute values or
     * textContent) into binding metadata.
     *
     * Any overrides of this method should return an array of binding part
     * metadata  representing one or more bindings found in the provided text
     * and any "literal" text in between.  Any non-literal parts will be passed
     * to `_evaluateBinding` when any dependencies change.  The only required
     * fields of each "part" in the returned array are as follows:
     *
     * - `dependencies` - Array containing trigger metadata for each property
     *   that should trigger the binding to update
     * - `literal` - String containing text if the part represents a literal;
     *   in this case no `dependencies` are needed
     *
     * Additional metadata for use by `_evaluateBinding` may be provided in
     * each part object as needed.
     *
     * The default implementation handles the following types of bindings
     * (one or more may be intermixed with literal strings):
     * - Property binding: `[[prop]]`
     * - Path binding: `[[object.prop]]`
     * - Negated property or path bindings: `[[!prop]]` or `[[!object.prop]]`
     * - Two-way property or path bindings (supports negation):
     *   `{{prop}}`, `{{object.prop}}`, `{{!prop}}` or `{{!object.prop}}`
     * - Inline computed method (supports negation):
     *   `[[compute(a, 'literal', b)]]`, `[[!compute(a, 'literal', b)]]`
     *
     * The default implementation uses a regular expression for best
     * performance. However, the regular expression uses a white-list of
     * allowed characters in a data-binding, which causes problems for
     * data-bindings that do use characters not in this white-list.
     *
     * Instead of updating the white-list with all allowed characters,
     * there is a StrictBindingParser (see lib/mixins/strict-binding-parser)
     * that uses a state machine instead. This state machine is able to handle
     * all characters. However, it is slightly less performant, therefore we
     * extracted it into a separate optional mixin.
     *
     * @param {string} text Text to parse from attribute or textContent
     * @param {Object} templateInfo Current template metadata
     * @return {Array<!BindingPart>} Array of binding part metadata
     * @protected
     * @nocollapse
     */
    static _parseBindings(r, s) {
      let n = [], a = 0, l;
      for (; (l = To.exec(r)) !== null; ) {
        l.index > a && n.push({ literal: r.slice(a, l.index) });
        let d = l[1][0], c = !!l[2], h = l[3].trim(), u = !1, p = "", f = -1;
        d == "{" && (f = h.indexOf("::")) > 0 && (p = h.substring(f + 2), h = h.substring(0, f), u = !0);
        let x = Pi(h), T = [];
        if (x) {
          let { args: z, methodName: D } = x;
          for (let K = 0; K < z.length; K++) {
            let $ = z[K];
            $.literal || T.push($);
          }
          let Y = s.dynamicFns;
          (Y && Y[D] || x.static) && (T.push(D), x.dynamicFn = !0);
        } else
          T.push(h);
        n.push({
          source: h,
          mode: d,
          negate: c,
          customEvent: u,
          signature: x,
          dependencies: T,
          event: p
        }), a = To.lastIndex;
      }
      if (a && a < r.length) {
        let d = r.substring(a);
        d && n.push({
          literal: d
        });
      }
      return n.length ? n : null;
    }
    /**
     * Called to evaluate a previously parsed binding part based on a set of
     * one or more changed dependencies.
     *
     * @param {!Polymer_PropertyEffects} inst Element that should be used as
     *     scope for binding dependencies
     * @param {BindingPart} part Binding part metadata
     * @param {string} path Property/path that triggered this effect
     * @param {Object} props Bag of current property changes
     * @param {Object} oldProps Bag of previous values for changed properties
     * @param {boolean} hasPaths True with `props` contains one or more paths
     * @return {*} Value the binding part evaluated to
     * @protected
     * @nocollapse
     */
    static _evaluateBinding(r, s, n, a, l, d) {
      let c;
      return s.signature ? c = tr(r, n, a, l, s.signature) : n != s.source ? c = M(r, s.source) : d && Ji(n) ? c = M(r, n) : c = r.__data[n], s.negate && (c = !c), c;
    }
  }
  return e;
}), Ze = [];
/**
@license
Copyright (c) 2017 The Polymer Project Authors. All rights reserved.
This code may only be used under the BSD style license found at http://polymer.github.io/LICENSE.txt
The complete set of authors may be found at http://polymer.github.io/AUTHORS.txt
The complete set of contributors may be found at http://polymer.github.io/CONTRIBUTORS.txt
Code distributed by Google as part of the polymer project is also
subject to an additional IP rights grant found at http://polymer.github.io/PATENTS.txt
*/
/**
@license
Copyright (c) 2017 The Polymer Project Authors. All rights reserved.
This code may only be used under the BSD style license found at http://polymer.github.io/LICENSE.txt
The complete set of authors may be found at http://polymer.github.io/AUTHORS.txt
The complete set of contributors may be found at http://polymer.github.io/CONTRIBUTORS.txt
Code distributed by Google as part of the polymer project is also
subject to an additional IP rights grant found at http://polymer.github.io/PATENTS.txt
*/
function qd(o) {
  const t = {};
  for (let e in o) {
    const i = o[e];
    t[e] = typeof i == "function" ? { type: i } : i;
  }
  return t;
}
const Wd = I((o) => {
  const t = mn(o);
  function e(s) {
    const n = Object.getPrototypeOf(s);
    return n.prototype instanceof r ? (
      /** @type {!PropertiesMixinConstructor} */
      n
    ) : null;
  }
  function i(s) {
    if (!s.hasOwnProperty(JSCompiler_renameProperty("__ownProperties", s))) {
      let n = null;
      if (s.hasOwnProperty(JSCompiler_renameProperty("properties", s))) {
        const a = s.properties;
        a && (n = qd(a));
      }
      s.__ownProperties = n;
    }
    return s.__ownProperties;
  }
  class r extends t {
    /**
     * Implements standard custom elements getter to observes the attributes
     * listed in `properties`.
     * @suppress {missingProperties} Interfaces in closure do not inherit statics, but classes do
     * @nocollapse
     */
    static get observedAttributes() {
      if (!this.hasOwnProperty(JSCompiler_renameProperty("__observedAttributes", this))) {
        this.prototype;
        const n = this._properties;
        this.__observedAttributes = n ? Object.keys(n).map((a) => this.prototype._addPropertyToAttributeMap(a)) : [];
      }
      return this.__observedAttributes;
    }
    /**
     * Finalizes an element definition, including ensuring any super classes
     * are also finalized. This includes ensuring property
     * accessors exist on the element prototype. This method calls
     * `_finalizeClass` to finalize each constructor in the prototype chain.
     * @return {void}
     * @nocollapse
     */
    static finalize() {
      if (!this.hasOwnProperty(JSCompiler_renameProperty("__finalized", this))) {
        const n = e(
          /** @type {!PropertiesMixinConstructor} */
          this
        );
        n && n.finalize(), this.__finalized = !0, this._finalizeClass();
      }
    }
    /**
     * Finalize an element class. This includes ensuring property
     * accessors exist on the element prototype. This method is called by
     * `finalize` and finalizes the class constructor.
     *
     * @protected
     * @nocollapse
     */
    static _finalizeClass() {
      const n = i(
        /** @type {!PropertiesMixinConstructor} */
        this
      );
      n && this.createProperties(n);
    }
    /**
     * Returns a memoized version of all properties, including those inherited
     * from super classes. Properties not in object format are converted to
     * at least {type}.
     *
     * @return {Object} Object containing properties for this class
     * @protected
     * @nocollapse
     */
    static get _properties() {
      if (!this.hasOwnProperty(
        JSCompiler_renameProperty("__properties", this)
      )) {
        const n = e(
          /** @type {!PropertiesMixinConstructor} */
          this
        );
        this.__properties = Object.assign(
          {},
          n && n._properties,
          i(
            /** @type {PropertiesMixinConstructor} */
            this
          )
        );
      }
      return this.__properties;
    }
    /**
     * Overrides `PropertiesChanged` method to return type specified in the
     * static `properties` object for the given property.
     * @param {string} name Name of property
     * @return {*} Type to which to deserialize attribute
     *
     * @protected
     * @nocollapse
     */
    static typeForProperty(n) {
      const a = this._properties[n];
      return a && a.type;
    }
    /**
     * Overrides `PropertiesChanged` method and adds a call to
     * `finalize` which lazily configures the element's property accessors.
     * @override
     * @return {void}
     */
    _initializeProperties() {
      this.constructor.finalize(), super._initializeProperties();
    }
    /**
     * Called when the element is added to a document.
     * Calls `_enableProperties` to turn on property system from
     * `PropertiesChanged`.
     * @suppress {missingProperties} Super may or may not implement the callback
     * @return {void}
     * @override
     */
    connectedCallback() {
      super.connectedCallback && super.connectedCallback(), this._enableProperties();
    }
    /**
     * Called when the element is removed from a document
     * @suppress {missingProperties} Super may or may not implement the callback
     * @return {void}
     * @override
     */
    disconnectedCallback() {
      super.disconnectedCallback && super.disconnectedCallback();
    }
  }
  return r;
});
/**
 * @fileoverview
 * @suppress {checkPrototypalTypes}
 * @license Copyright (c) 2017 The Polymer Project Authors. All rights reserved.
 * This code may only be used under the BSD style license found at
 * http://polymer.github.io/LICENSE.txt The complete set of authors may be found
 * at http://polymer.github.io/AUTHORS.txt The complete set of contributors may
 * be found at http://polymer.github.io/CONTRIBUTORS.txt Code distributed by
 * Google as part of the polymer project is also subject to an additional IP
 * rights grant found at http://polymer.github.io/PATENTS.txt
 */
const Gd = "3.5.1", Oo = window.ShadyCSS && window.ShadyCSS.cssBuild, jd = I((o) => {
  const t = Wd(Pr(o));
  function e(l) {
    if (!l.hasOwnProperty(
      JSCompiler_renameProperty("__propertyDefaults", l)
    )) {
      l.__propertyDefaults = null;
      let d = l._properties;
      for (let c in d) {
        let h = d[c];
        "value" in h && (l.__propertyDefaults = l.__propertyDefaults || {}, l.__propertyDefaults[c] = h);
      }
    }
    return l.__propertyDefaults;
  }
  function i(l) {
    return l.hasOwnProperty(
      JSCompiler_renameProperty("__ownObservers", l)
    ) || (l.__ownObservers = l.hasOwnProperty(
      JSCompiler_renameProperty("observers", l)
    ) ? (
      /** @type {PolymerElementConstructor} */
      l.observers
    ) : null), l.__ownObservers;
  }
  function r(l, d, c, h) {
    c.computed && (c.readOnly = !0), c.computed && (l._hasReadOnlyEffect(d) || l._createComputedProperty(d, c.computed, h)), c.readOnly && !l._hasReadOnlyEffect(d) ? l._createReadOnlyProperty(d, !c.computed) : c.readOnly === !1 && l._hasReadOnlyEffect(d), c.reflectToAttribute && !l._hasReflectEffect(d) ? l._createReflectedProperty(d) : c.reflectToAttribute === !1 && l._hasReflectEffect(d), c.notify && !l._hasNotifyEffect(d) ? l._createNotifyingProperty(d) : c.notify === !1 && l._hasNotifyEffect(d), c.observer && l._createPropertyObserver(d, c.observer, h[c.observer]), l._addPropertyToAttributeMap(d);
  }
  function s(l, d, c, h) {
    if (!Oo) {
      const u = d.content.querySelectorAll("style"), p = dn(d), f = Vl(c), x = d.content.firstElementChild;
      for (let z = 0; z < f.length; z++) {
        let D = f[z];
        D.textContent = l._processStyleText(D.textContent, h), d.content.insertBefore(D, x);
      }
      let T = 0;
      for (let z = 0; z < p.length; z++) {
        let D = p[z], Y = u[T];
        Y !== D ? (D = D.cloneNode(!0), Y.parentNode.insertBefore(D, Y)) : T++, D.textContent = l._processStyleText(D.textContent, h);
      }
    }
    if (window.ShadyCSS && window.ShadyCSS.prepareTemplate(d, c), Ml && Oo && Tl) {
      const u = d.content.querySelectorAll("style");
      if (u) {
        let p = "";
        Array.from(u).forEach((f) => {
          p += f.textContent, f.parentNode.removeChild(f);
        }), l._styleSheet = new CSSStyleSheet(), l._styleSheet.replaceSync(p);
      }
    }
  }
  function n(l) {
    let d = null;
    if (l && (!Qt || Dl) && (d = /** @type {?HTMLTemplateElement} */
    _t.import(l, "template"), Qt && !d))
      throw new Error(`strictTemplatePolicy: expecting dom-module or null template for ${l}`);
    return d;
  }
  class a extends t {
    /**
     * Current Polymer version in Semver notation.
     * @type {string} Semver notation of the current version of Polymer.
     * @nocollapse
     */
    static get polymerElementVersion() {
      return Gd;
    }
    /**
     * Override of PropertiesMixin _finalizeClass to create observers and
     * find the template.
     * @return {void}
     * @protected
     * @suppress {missingProperties} Interfaces in closure do not inherit statics, but classes do
     * @nocollapse
     */
    static _finalizeClass() {
      t._finalizeClass.call(this);
      const d = i(this);
      d && this.createObservers(d, this._properties), this._prepareTemplate();
    }
    /** @nocollapse */
    static _prepareTemplate() {
      let d = (
        /** @type {PolymerElementConstructor} */
        this.template
      );
      d && (typeof d == "string" ? d = null : sn || (d = d.cloneNode(!0))), this.prototype._template = d;
    }
    /**
     * Override of PropertiesChanged createProperties to create accessors
     * and property effects for all of the properties.
     * @param {!Object} props .
     * @return {void}
     * @protected
     * @nocollapse
     */
    static createProperties(d) {
      for (let c in d)
        r(
          /** @type {?} */
          this.prototype,
          c,
          d[c],
          d
        );
    }
    /**
     * Creates observers for the given `observers` array.
     * Leverages `PropertyEffects` to create observers.
     * @param {Object} observers Array of observer descriptors for
     *   this class
     * @param {Object} dynamicFns Object containing keys for any properties
     *   that are functions and should trigger the effect when the function
     *   reference is changed
     * @return {void}
     * @protected
     * @nocollapse
     */
    static createObservers(d, c) {
      const h = this.prototype;
      for (let u = 0; u < d.length; u++)
        h._createMethodObserver(d[u], c);
    }
    /**
     * Returns the template that will be stamped into this element's shadow root.
     *
     * If a `static get is()` getter is defined, the default implementation will
     * return the first `<template>` in a `dom-module` whose `id` matches this
     * element's `is` (note that a `_template` property on the class prototype
     * takes precedence over the `dom-module` template, to maintain legacy
     * element semantics; a subclass will subsequently fall back to its super
     * class template if neither a `prototype._template` or a `dom-module` for
     * the class's `is` was found).
     *
     * Users may override this getter to return an arbitrary template
     * (in which case the `is` getter is unnecessary). The template returned
     * must be an `HTMLTemplateElement`.
     *
     * Note that when subclassing, if the super class overrode the default
     * implementation and the subclass would like to provide an alternate
     * template via a `dom-module`, it should override this getter and
     * return `DomModule.import(this.is, 'template')`.
     *
     * If a subclass would like to modify the super class template, it should
     * clone it rather than modify it in place.  If the getter does expensive
     * work such as cloning/modifying a template, it should memoize the
     * template for maximum performance:
     *
     *   let memoizedTemplate;
     *   class MySubClass extends MySuperClass {
     *     static get template() {
     *       if (!memoizedTemplate) {
     *         memoizedTemplate = super.template.cloneNode(true);
     *         let subContent = document.createElement('div');
     *         subContent.textContent = 'This came from MySubClass';
     *         memoizedTemplate.content.appendChild(subContent);
     *       }
     *       return memoizedTemplate;
     *     }
     *   }
     *
     * @return {!HTMLTemplateElement|string} Template to be stamped
     * @nocollapse
     */
    static get template() {
      if (!this.hasOwnProperty(JSCompiler_renameProperty("_template", this))) {
        let d = this.prototype.hasOwnProperty(
          JSCompiler_renameProperty("_template", this.prototype)
        ) ? this.prototype._template : void 0;
        typeof d == "function" && (d = d()), this._template = // If user has put template on prototype (e.g. in legacy via registered
        // callback or info object), prefer that first. Note that `null` is
        // used as a sentinel to indicate "no template" and can be used to
        // override a super template, whereas `undefined` is used as a
        // sentinel to mean "fall-back to default template lookup" via
        // dom-module and/or super.template.
        d !== void 0 ? d : (
          // Look in dom-module associated with this element's is
          this.hasOwnProperty(JSCompiler_renameProperty("is", this)) && n(
            /** @type {PolymerElementConstructor}*/
            this.is
          ) || // Next look for superclass template (call the super impl this
          // way so that `this` points to the superclass)
          Object.getPrototypeOf(
            /** @type {PolymerElementConstructor}*/
            this.prototype
          ).constructor.template
        );
      }
      return this._template;
    }
    /**
     * Set the template.
     *
     * @param {!HTMLTemplateElement|string} value Template to set.
     * @nocollapse
     */
    static set template(d) {
      this._template = d;
    }
    /**
     * Path matching the url from which the element was imported.
     *
     * This path is used to resolve url's in template style cssText.
     * The `importPath` property is also set on element instances and can be
     * used to create bindings relative to the import path.
     *
     * For elements defined in ES modules, users should implement
     * `static get importMeta() { return import.meta; }`, and the default
     * implementation of `importPath` will  return `import.meta.url`'s path.
     * For elements defined in HTML imports, this getter will return the path
     * to the document containing a `dom-module` element matching this
     * element's static `is` property.
     *
     * Note, this path should contain a trailing `/`.
     *
     * @return {string} The import path for this element class
     * @suppress {missingProperties}
     * @nocollapse
     */
    static get importPath() {
      if (!this.hasOwnProperty(JSCompiler_renameProperty("_importPath", this))) {
        const d = this.importMeta;
        if (d)
          this._importPath = Er(d.url);
        else {
          const c = _t.import(
            /** @type {PolymerElementConstructor} */
            this.is
          );
          this._importPath = c && c.assetpath || Object.getPrototypeOf(
            /** @type {PolymerElementConstructor}*/
            this.prototype
          ).constructor.importPath;
        }
      }
      return this._importPath;
    }
    constructor() {
      super(), this._template, this._importPath, this.rootPath, this.importPath, this.root, this.$;
    }
    /**
     * Overrides the default `PropertyAccessors` to ensure class
     * metaprogramming related to property accessors and effects has
     * completed (calls `finalize`).
     *
     * It also initializes any property defaults provided via `value` in
     * `properties` metadata.
     *
     * @return {void}
     * @override
     * @suppress {invalidCasts,missingProperties} go/missingfnprops
     */
    _initializeProperties() {
      this.constructor.finalize(), this.constructor._finalizeTemplate(
        /** @type {!HTMLElement} */
        this.localName
      ), super._initializeProperties(), this.rootPath = Pl, this.importPath = this.constructor.importPath;
      let d = e(this.constructor);
      if (d)
        for (let c in d) {
          let h = d[c];
          if (this._canApplyPropertyDefault(c)) {
            let u = typeof h.value == "function" ? h.value.call(this) : h.value;
            this._hasAccessor(c) ? this._setPendingProperty(c, u, !0) : this[c] = u;
          }
        }
    }
    /**
     * Determines if a property dfeault can be applied. For example, this
     * prevents a default from being applied when a property that has no
     * accessor is overridden by its host before upgrade (e.g. via a binding).
     * @override
     * @param {string} property Name of the property
     * @return {boolean} Returns true if the property default can be applied.
     */
    _canApplyPropertyDefault(d) {
      return !this.hasOwnProperty(d);
    }
    /**
     * Gather style text for a style element in the template.
     *
     * @param {string} cssText Text containing styling to process
     * @param {string} baseURI Base URI to rebase CSS paths against
     * @return {string} The processed CSS text
     * @protected
     * @nocollapse
     */
    static _processStyleText(d, c) {
      return kr(d, c);
    }
    /**
    * Configures an element `proto` to function with a given `template`.
    * The element name `is` and extends `ext` must be specified for ShadyCSS
    * style scoping.
    *
    * @param {string} is Tag name (or type extension name) for this element
    * @return {void}
    * @protected
    * @nocollapse
    */
    static _finalizeTemplate(d) {
      const c = this.prototype._template;
      if (c && !c.__polymerFinalized) {
        c.__polymerFinalized = !0;
        const h = this.importPath, u = h ? nt(h) : "";
        s(this, c, d, u), this.prototype._bindTemplate(c);
      }
    }
    /**
     * Provides a default implementation of the standard Custom Elements
     * `connectedCallback`.
     *
     * The default implementation enables the property effects system and
     * flushes any pending properties, and updates shimmed CSS properties
     * when using the ShadyCSS scoping/custom properties polyfill.
     *
     * @override
     * @suppress {missingProperties, invalidCasts} Super may or may not
     *     implement the callback
     * @return {void}
     */
    connectedCallback() {
      window.ShadyCSS && this._template && window.ShadyCSS.styleElement(
        /** @type {!HTMLElement} */
        this
      ), super.connectedCallback();
    }
    /**
     * Stamps the element template.
     *
     * @return {void}
     * @override
     */
    ready() {
      this._template && (this.root = this._stampTemplate(this._template), this.$ = this.root.$), super.ready();
    }
    /**
     * Implements `PropertyEffects`'s `_readyClients` call. Attaches
     * element dom by calling `_attachDom` with the dom stamped from the
     * element's template via `_stampTemplate`. Note that this allows
     * client dom to be attached to the element prior to any observers
     * running.
     *
     * @return {void}
     * @override
     */
    _readyClients() {
      this._template && (this.root = this._attachDom(
        /** @type {StampedTemplate} */
        this.root
      )), super._readyClients();
    }
    /**
     * Attaches an element's stamped dom to itself. By default,
     * this method creates a `shadowRoot` and adds the dom to it.
     * However, this method may be overridden to allow an element
     * to put its dom in another location.
     *
     * @override
     * @throws {Error}
     * @suppress {missingReturn}
     * @param {StampedTemplate} dom to attach to the element.
     * @return {ShadowRoot} node to which the dom has been attached.
     */
    _attachDom(d) {
      const c = S(this);
      if (c.attachShadow)
        return d ? (c.shadowRoot || (c.attachShadow({ mode: "open", shadyUpgradeFragment: d }), c.shadowRoot.appendChild(d), this.constructor._styleSheet && (c.shadowRoot.adoptedStyleSheets = [this.constructor._styleSheet])), Ol && window.ShadyDOM && window.ShadyDOM.flushInitial(c.shadowRoot), c.shadowRoot) : null;
      throw new Error("ShadowDOM not available. PolymerElement can create dom as children instead of in ShadowDOM by setting `this.root = this;` before `ready`.");
    }
    /**
     * When using the ShadyCSS scoping and custom property shim, causes all
     * shimmed styles in this element (and its subtree) to be updated
     * based on current custom property values.
     *
     * The optional parameter overrides inline custom property styles with an
     * object of properties where the keys are CSS properties, and the values
     * are strings.
     *
     * Example: `this.updateStyles({'--color': 'blue'})`
     *
     * These properties are retained unless a value of `null` is set.
     *
     * Note: This function does not support updating CSS mixins.
     * You can not dynamically change the value of an `@apply`.
     *
     * @override
     * @param {Object=} properties Bag of custom property key/values to
     *   apply to this element.
     * @return {void}
     * @suppress {invalidCasts}
     */
    updateStyles(d) {
      window.ShadyCSS && window.ShadyCSS.styleSubtree(
        /** @type {!HTMLElement} */
        this,
        d
      );
    }
    /**
     * Rewrites a given URL relative to a base URL. The base URL defaults to
     * the original location of the document containing the `dom-module` for
     * this element. This method will return the same URL before and after
     * bundling.
     *
     * Note that this function performs no resolution for URLs that start
     * with `/` (absolute URLs) or `#` (hash identifiers).  For general purpose
     * URL resolution, use `window.URL`.
     *
     * @override
     * @param {string} url URL to resolve.
     * @param {string=} base Optional base URL to resolve against, defaults
     * to the element's `importPath`
     * @return {string} Rewritten URL relative to base
     */
    resolveUrl(d, c) {
      return !c && this.importPath && (c = nt(this.importPath)), nt(d, c);
    }
    /**
     * Overrides `PropertyEffects` to add map of dynamic functions on
     * template info, for consumption by `PropertyEffects` template binding
     * code. This map determines which method templates should have accessors
     * created for them.
     *
     * @param {!HTMLTemplateElement} template Template
     * @param {!TemplateInfo} templateInfo Template metadata for current template
     * @param {!NodeInfo} nodeInfo Node metadata for current template.
     * @return {boolean} .
     * @suppress {missingProperties} Interfaces in closure do not inherit statics, but classes do
     * @nocollapse
     */
    static _parseTemplateContent(d, c, h) {
      return c.dynamicFns = c.dynamicFns || this._properties, t._parseTemplateContent.call(
        this,
        d,
        c,
        h
      );
    }
    /**
     * Overrides `PropertyEffects` to warn on use of undeclared properties in
     * template.
     *
     * @param {Object} templateInfo Template metadata to add effect to
     * @param {string} prop Property that should trigger the effect
     * @param {Object=} effect Effect metadata object
     * @return {void}
     * @protected
     * @suppress {missingProperties} Interfaces in closure do not inherit statics, but classes do
     * @nocollapse
     */
    static _addTemplatePropertyEffect(d, c, h) {
      return nn && !(c in this._properties) && // Methods used in templates with no dependencies (or only literal
      // dependencies) become accessors with template effects; ignore these
      !(h.info.part.signature && h.info.part.signature.static) && // Warnings for bindings added to nested templates are handled by
      // templatizer so ignore both the host-to-template bindings
      // (`hostProp`) and TemplateInstance-to-child bindings
      // (`nestedTemplate`)
      !h.info.part.hostProp && d.nestedTemplate, t._addTemplatePropertyEffect.call(
        this,
        d,
        c,
        h
      );
    }
  }
  return a;
});
/**
@license
Copyright (c) 2017 The Polymer Project Authors. All rights reserved.
This code may only be used under the BSD style license found at http://polymer.github.io/LICENSE.txt
The complete set of authors may be found at http://polymer.github.io/AUTHORS.txt
The complete set of contributors may be found at http://polymer.github.io/CONTRIBUTORS.txt
Code distributed by Google as part of the polymer project is also
subject to an additional IP rights grant found at http://polymer.github.io/PATENTS.txt
*/
const zo = window.trustedTypes && trustedTypes.createPolicy("polymer-html-literal", { createHTML: (o) => o });
class kn {
  /**
   * @param {!ITemplateArray} strings Constant parts of tagged template literal
   * @param {!Array<*>} values Variable parts of tagged template literal
   */
  constructor(t, e) {
    Sn(t, e);
    const i = e.reduce(
      (r, s, n) => r + En(s) + t[n + 1],
      t[0]
    );
    this.value = i.toString();
  }
  /**
   * @return {string} LiteralString string value
   * @override
   */
  toString() {
    return this.value;
  }
}
function En(o) {
  if (o instanceof kn)
    return (
      /** @type {!LiteralString} */
      o.value
    );
  throw new Error(
    `non-literal value passed to Polymer's htmlLiteral function: ${o}`
  );
}
function Yd(o) {
  if (o instanceof HTMLTemplateElement)
    return (
      /** @type {!HTMLTemplateElement } */
      o.innerHTML
    );
  if (o instanceof kn)
    return En(o);
  throw new Error(
    `non-template value passed to Polymer's html function: ${o}`
  );
}
const k = function(t, ...e) {
  Sn(t, e);
  const i = (
    /** @type {!HTMLTemplateElement} */
    document.createElement("template")
  );
  let r = e.reduce(
    (s, n, a) => s + Yd(n) + t[a + 1],
    t[0]
  );
  return zo && (r = zo.createHTML(r)), i.innerHTML = r, i;
}, Sn = (o, t) => {
  if (!Array.isArray(o) || !Array.isArray(o.raw) || t.length !== o.length - 1)
    throw new TypeError("Invalid call to the html template tag");
};
/**
@license
Copyright (c) 2017 The Polymer Project Authors. All rights reserved.
This code may only be used under the BSD style license found at http://polymer.github.io/LICENSE.txt
The complete set of authors may be found at http://polymer.github.io/AUTHORS.txt
The complete set of contributors may be found at http://polymer.github.io/CONTRIBUTORS.txt
Code distributed by Google as part of the polymer project is also
subject to an additional IP rights grant found at http://polymer.github.io/PATENTS.txt
*/
const A = jd(HTMLElement);
/**
 * @license
 * Copyright (c) 2021 - 2023 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
const Q = [];
function ir(o, t, e = o.getAttribute("dir")) {
  t ? o.setAttribute("dir", t) : e != null && o.removeAttribute("dir");
}
function rr() {
  return document.documentElement.getAttribute("dir");
}
function Kd() {
  const o = rr();
  Q.forEach((t) => {
    ir(t, o);
  });
}
const Qd = new MutationObserver(Kd);
Qd.observe(document.documentElement, { attributes: !0, attributeFilter: ["dir"] });
const te = (o) => class extends o {
  static get properties() {
    return {
      /**
       * @protected
       */
      dir: {
        type: String,
        value: "",
        reflectToAttribute: !0,
        converter: {
          fromAttribute: (e) => e || "",
          toAttribute: (e) => e === "" ? null : e
        }
      }
    };
  }
  /**
   * @return {boolean}
   * @protected
   */
  get __isRTL() {
    return this.getAttribute("dir") === "rtl";
  }
  /** @protected */
  connectedCallback() {
    super.connectedCallback(), (!this.hasAttribute("dir") || this.__restoreSubscription) && (this.__subscribe(), ir(this, rr(), null));
  }
  /** @protected */
  attributeChangedCallback(e, i, r) {
    if (super.attributeChangedCallback(e, i, r), e !== "dir")
      return;
    const s = rr(), n = r === s && Q.indexOf(this) === -1, a = !r && i && Q.indexOf(this) === -1;
    n || a ? (this.__subscribe(), ir(this, s, r)) : r !== s && i === s && this.__unsubscribe();
  }
  /** @protected */
  disconnectedCallback() {
    super.disconnectedCallback(), this.__restoreSubscription = Q.includes(this), this.__unsubscribe();
  }
  /** @protected */
  _valueToNodeAttribute(e, i, r) {
    r === "dir" && i === "" && !e.hasAttribute("dir") || super._valueToNodeAttribute(e, i, r);
  }
  /** @protected */
  _attributeToProperty(e, i, r) {
    e === "dir" && !i ? this.dir = "" : super._attributeToProperty(e, i, r);
  }
  /** @private */
  __subscribe() {
    Q.includes(this) || Q.push(this);
  }
  /** @private */
  __unsubscribe() {
    Q.includes(this) && Q.splice(Q.indexOf(this), 1);
  }
};
/**
 * @license
 * Copyright (c) 2021 - 2023 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
class $o extends O(te(A)) {
  static get is() {
    return "vaadin-input-container";
  }
  static get template() {
    return k`
      <style>
        :host {
          display: flex;
          align-items: center;
          flex: 0 1 auto;
          border-radius:
            /* See https://developer.mozilla.org/en-US/docs/Web/CSS/border-radius */
            var(--vaadin-input-field-top-start-radius, var(--__border-radius))
            var(--vaadin-input-field-top-end-radius, var(--__border-radius))
            var(--vaadin-input-field-bottom-end-radius, var(--__border-radius))
            var(--vaadin-input-field-bottom-start-radius, var(--__border-radius));
          --_border-radius: var(--vaadin-input-field-border-radius, 0px);
          --_input-border-width: var(--vaadin-input-field-border-width, 0);
          --_input-border-color: var(--vaadin-input-field-border-color, transparent);
          box-shadow: inset 0 0 0 var(--_input-border-width, 0) var(--_input-border-color);
        }

        :host([dir='rtl']) {
          border-radius:
            /* Don't use logical props, see https://github.com/vaadin/vaadin-time-picker/issues/145 */
            var(--vaadin-input-field-top-end-radius, var(--_border-radius))
            var(--vaadin-input-field-top-start-radius, var(--_border-radius))
            var(--vaadin-input-field-bottom-start-radius, var(--_border-radius))
            var(--vaadin-input-field-bottom-end-radius, var(--_border-radius));
        }

        :host([hidden]) {
          display: none !important;
        }

        /* Reset the native input styles */
        ::slotted(input) {
          -webkit-appearance: none;
          -moz-appearance: none;
          flex: auto;
          white-space: nowrap;
          overflow: hidden;
          width: 100%;
          height: 100%;
          outline: none;
          margin: 0;
          padding: 0;
          border: 0;
          border-radius: 0;
          min-width: 0;
          font: inherit;
          line-height: normal;
          color: inherit;
          background-color: transparent;
          /* Disable default invalid style in Firefox */
          box-shadow: none;
        }

        ::slotted(*) {
          flex: none;
        }

        ::slotted(:is(input, textarea))::placeholder {
          /* Use ::slotted(input:placeholder-shown) in themes to style the placeholder. */
          /* because ::slotted(...)::placeholder does not work in Safari. */
          font: inherit;
          color: inherit;
          /* Override default opacity in Firefox */
          opacity: 1;
        }
      </style>
      <slot name="prefix"></slot>
      <slot></slot>
      <slot name="suffix"></slot>
    `;
  }
  static get properties() {
    return {
      /**
       * If true, the user cannot interact with this element.
       */
      disabled: {
        type: Boolean,
        reflectToAttribute: !0
      },
      /**
       * Set to true to make this element read-only.
       */
      readonly: {
        type: Boolean,
        reflectToAttribute: !0
      },
      /**
       * Set to true when the element is invalid.
       */
      invalid: {
        type: Boolean,
        reflectToAttribute: !0
      }
    };
  }
  /** @protected */
  ready() {
    super.ready(), this.addEventListener("pointerdown", (t) => {
      t.target === this && t.preventDefault();
    }), this.addEventListener("click", (t) => {
      t.target === this && this.shadowRoot.querySelector("slot:not([name])").assignedNodes({ flatten: !0 }).forEach((e) => e.focus && e.focus());
    });
  }
}
customElements.define($o.is, $o);
/**
 * @license
 * Copyright (c) 2017 - 2023 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
const Zd = _`
  :host {
    /* Square */
    --lumo-space-xs: 0.25rem;
    --lumo-space-s: 0.5rem;
    --lumo-space-m: 1rem;
    --lumo-space-l: 1.5rem;
    --lumo-space-xl: 2.5rem;

    /* Wide */
    --lumo-space-wide-xs: calc(var(--lumo-space-xs) / 2) var(--lumo-space-xs);
    --lumo-space-wide-s: calc(var(--lumo-space-s) / 2) var(--lumo-space-s);
    --lumo-space-wide-m: calc(var(--lumo-space-m) / 2) var(--lumo-space-m);
    --lumo-space-wide-l: calc(var(--lumo-space-l) / 2) var(--lumo-space-l);
    --lumo-space-wide-xl: calc(var(--lumo-space-xl) / 2) var(--lumo-space-xl);

    /* Tall */
    --lumo-space-tall-xs: var(--lumo-space-xs) calc(var(--lumo-space-xs) / 2);
    --lumo-space-tall-s: var(--lumo-space-s) calc(var(--lumo-space-s) / 2);
    --lumo-space-tall-m: var(--lumo-space-m) calc(var(--lumo-space-m) / 2);
    --lumo-space-tall-l: var(--lumo-space-l) calc(var(--lumo-space-l) / 2);
    --lumo-space-tall-xl: var(--lumo-space-xl) calc(var(--lumo-space-xl) / 2);
  }
`;
Ge("spacing-props", Zd);
/**
 * @license
 * Copyright (c) 2017 - 2023 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
const At = _`
  :host {
    top: var(--lumo-space-m);
    right: var(--lumo-space-m);
    bottom: var(--lumo-space-m);
    left: var(--lumo-space-m);
    /* Workaround for Edge issue (only on Surface), where an overflowing vaadin-list-box inside vaadin-select-overlay makes the overlay transparent */
    /* stylelint-disable-next-line */
    outline: 0px solid transparent;
  }

  [part='overlay'] {
    background-color: var(--lumo-base-color);
    background-image: linear-gradient(var(--lumo-tint-5pct), var(--lumo-tint-5pct));
    border-radius: var(--lumo-border-radius-m);
    box-shadow: 0 0 0 1px var(--lumo-shade-5pct), var(--lumo-box-shadow-m);
    color: var(--lumo-body-text-color);
    font-family: var(--lumo-font-family);
    font-size: var(--lumo-font-size-m);
    font-weight: 400;
    line-height: var(--lumo-line-height-m);
    letter-spacing: 0;
    text-transform: none;
    -webkit-text-size-adjust: 100%;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }

  [part='content'] {
    padding: var(--lumo-space-xs);
  }

  [part='backdrop'] {
    background-color: var(--lumo-shade-20pct);
    animation: 0.2s lumo-overlay-backdrop-enter both;
    will-change: opacity;
  }

  @keyframes lumo-overlay-backdrop-enter {
    0% {
      opacity: 0;
    }
  }

  :host([closing]) [part='backdrop'] {
    animation: 0.2s lumo-overlay-backdrop-exit both;
  }

  @keyframes lumo-overlay-backdrop-exit {
    100% {
      opacity: 0;
    }
  }

  @keyframes lumo-overlay-dummy-animation {
    0% {
      opacity: 1;
    }

    100% {
      opacity: 1;
    }
  }
`;
m("", At, { moduleId: "lumo-overlay" });
m("vaadin-overlay", At, { moduleId: "lumo-vaadin-overlay" });
/**
@license
Copyright (c) 2017 The Polymer Project Authors. All rights reserved.
This code may only be used under the BSD style license found at http://polymer.github.io/LICENSE.txt
The complete set of authors may be found at http://polymer.github.io/AUTHORS.txt
The complete set of contributors may be found at http://polymer.github.io/CONTRIBUTORS.txt
Code distributed by Google as part of the polymer project is also
subject to an additional IP rights grant found at http://polymer.github.io/PATENTS.txt
*/
let or = !1, Xd = [], In = [];
function Jd() {
  or = !0, requestAnimationFrame(function() {
    or = !1, ec(Xd), setTimeout(function() {
      tc(In);
    });
  });
}
function ec(o) {
  for (; o.length; )
    Tn(o.shift());
}
function tc(o) {
  for (let t = 0, e = o.length; t < e; t++)
    Tn(o.shift());
}
function Tn(o) {
  const t = o[0], e = o[1], i = o[2];
  try {
    e.apply(t, i);
  } catch (r) {
    setTimeout(() => {
      throw r;
    });
  }
}
function Dr(o, t, e) {
  or || Jd(), In.push([o, t, e]);
}
/**
 * @license
 * Copyright (c) 2021 - 2023 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
const ai = (o) => o.test(navigator.userAgent), sr = (o) => o.test(navigator.platform), ic = (o) => o.test(navigator.vendor), Mo = ai(/Android/u), rc = ai(/Chrome/u) && ic(/Google Inc/u), Pn = ai(/Firefox/u), oc = sr(/^iPad/u) || sr(/^Mac/u) && navigator.maxTouchPoints > 1, sc = sr(/^iPhone/u), Xt = sc || oc, Dn = ai(/^((?!chrome|android).)*safari/iu), Jt = (() => {
  try {
    return document.createEvent("TouchEvent"), !0;
  } catch {
    return !1;
  }
})();
/**
 * @license
 * Copyright (c) 2021 - 2023 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
function li(o) {
  if (window.Vaadin && window.Vaadin.templateRendererCallback) {
    window.Vaadin.templateRendererCallback(o);
    return;
  }
  o.querySelector("template");
}
/**
 * @license
 * Copyright (c) 2017 Anton Korzunov
 * SPDX-License-Identifier: MIT
 */
let Te = /* @__PURE__ */ new WeakMap(), Mt = /* @__PURE__ */ new WeakMap(), Rt = {}, Di = 0;
const On = (o) => o ? o.host || On(o.parentNode) : null, Ro = (o) => o && o.nodeType === Node.ELEMENT_NODE, Oi = (...o) => {
}, nc = (o, t) => Ro(o) ? t.map((e) => {
  if (!Ro(e))
    return Oi(e, "is not a valid element"), null;
  if (o.contains(e))
    return e;
  const i = On(e);
  return i && o.contains(i) ? i : (Oi(e, "is not contained inside", o), null);
}).filter((e) => !!e) : (Oi(o, "is not a valid element"), []), ac = (o, t, e, i) => {
  const r = nc(t, Array.isArray(o) ? o : [o]);
  Rt[e] || (Rt[e] = /* @__PURE__ */ new WeakMap());
  const s = Rt[e], n = [], a = /* @__PURE__ */ new Set(), l = new Set(r), d = (h) => {
    !h || a.has(h) || (a.add(h), d(h.parentNode));
  };
  r.forEach(d);
  const c = (h) => {
    !h || l.has(h) || [...h.children].forEach((u) => {
      if (!["template", "script", "style"].includes(u.localName))
        if (a.has(u))
          c(u);
        else {
          const p = u.getAttribute(i), f = p !== null && p !== "false", x = (Te.get(u) || 0) + 1, T = (s.get(u) || 0) + 1;
          Te.set(u, x), s.set(u, T), n.push(u), x === 1 && f && Mt.set(u, !0), T === 1 && u.setAttribute(e, "true"), f || u.setAttribute(i, "true");
        }
    });
  };
  return c(t), a.clear(), Di += 1, () => {
    n.forEach((h) => {
      const u = Te.get(h) - 1, p = s.get(h) - 1;
      Te.set(h, u), s.set(h, p), u || (Mt.has(h) ? Mt.delete(h) : h.removeAttribute(i)), p || h.removeAttribute(e);
    }), Di -= 1, Di || (Te = /* @__PURE__ */ new WeakMap(), Te = /* @__PURE__ */ new WeakMap(), Mt = /* @__PURE__ */ new WeakMap(), Rt = {});
  };
}, zn = (o, t = document.body, e = "data-aria-hidden") => {
  const i = Array.from(Array.isArray(o) ? o : [o]);
  return t && i.push(...Array.from(t.querySelectorAll("[aria-live]"))), ac(i, t, e, "aria-hidden");
};
/**
 * @license
 * Copyright (c) 2021 - 2023 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
class lc {
  /**
   * @param {HTMLElement} host
   */
  constructor(t, e) {
    this.host = t, this.callback = typeof e == "function" ? e : () => t;
  }
  /**
   * Make the controller host modal by hiding other elements from screen readers
   * using `aria-hidden` attribute (can be replaced with `inert` in the future).
   *
   * The method name is chosen to align with the one provided by native `<dialog>`:
   * https://developer.mozilla.org/en-US/docs/Web/API/HTMLDialogElement/showModal
   */
  showModal() {
    const t = this.callback();
    this.__showOthers = zn(t);
  }
  /**
   * Remove `aria-hidden` from other elements unless there are any other
   * controller hosts on the page activated by using `showModal()` call.
   */
  close() {
    this.__showOthers && (this.__showOthers(), this.__showOthers = null);
  }
}
/**
 * @license
 * Copyright (c) 2021 - 2023 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
let Or = !1;
window.addEventListener(
  "keydown",
  () => {
    Or = !0;
  },
  { capture: !0 }
);
window.addEventListener(
  "mousedown",
  () => {
    Or = !1;
  },
  { capture: !0 }
);
function nr() {
  let o = document.activeElement || document.body;
  for (; o.shadowRoot && o.shadowRoot.activeElement; )
    o = o.shadowRoot.activeElement;
  return o;
}
function $n() {
  return Or;
}
function Mn(o) {
  const t = o.style;
  if (t.visibility === "hidden" || t.display === "none")
    return !0;
  const e = window.getComputedStyle(o);
  return e.visibility === "hidden" || e.display === "none";
}
function dc(o, t) {
  const e = Math.max(o.tabIndex, 0), i = Math.max(t.tabIndex, 0);
  return e === 0 || i === 0 ? i > e : e > i;
}
function cc(o, t) {
  const e = [];
  for (; o.length > 0 && t.length > 0; )
    dc(o[0], t[0]) ? e.push(t.shift()) : e.push(o.shift());
  return e.concat(o, t);
}
function ar(o) {
  const t = o.length;
  if (t < 2)
    return o;
  const e = Math.ceil(t / 2), i = ar(o.slice(0, e)), r = ar(o.slice(e));
  return cc(i, r);
}
function Fo(o) {
  return o.offsetParent === null && o.clientWidth === 0 && o.clientHeight === 0 ? !0 : Mn(o);
}
function hc(o) {
  return o.matches('[tabindex="-1"]') ? !1 : o.matches("input, select, textarea, button, object") ? o.matches(":not([disabled])") : o.matches("a[href], area[href], iframe, [tabindex], [contentEditable]");
}
function zr(o) {
  return o.getRootNode().activeElement === o;
}
function uc(o) {
  if (!hc(o))
    return -1;
  const t = o.getAttribute("tabindex") || 0;
  return Number(t);
}
function Rn(o, t) {
  if (o.nodeType !== Node.ELEMENT_NODE || Mn(o))
    return !1;
  const e = (
    /** @type {HTMLElement} */
    o
  ), i = uc(e);
  let r = i > 0;
  i >= 0 && t.push(e);
  let s = [];
  return e.localName === "slot" ? s = e.assignedNodes({ flatten: !0 }) : s = (e.shadowRoot || e).children, [...s].forEach((n) => {
    r = Rn(n, t) || r;
  }), r;
}
function pc(o) {
  const t = [];
  return Rn(o, t) ? ar(t) : t;
}
/**
 * @license
 * Copyright (c) 2021 - 2023 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
class _c {
  /**
   * Saves the given node as a target for restoring focus to
   * when `restoreFocus()` is called. If no node is provided,
   * the currently focused node in the DOM is saved as a target.
   *
   * @param {Node | null | undefined} focusNode
   */
  saveFocus(t) {
    this.focusNode = t || nr();
  }
  /**
   * Restores focus to the target node that was saved previously with `saveFocus()`.
   */
  restoreFocus() {
    const t = this.focusNode;
    t && (nr() === document.body ? setTimeout(() => t.focus()) : t.focus(), this.focusNode = null);
  }
}
/**
 * @license
 * Copyright (c) 2021 - 2023 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
const zi = [];
class fc {
  /**
   * @param {HTMLElement} host
   */
  constructor(t) {
    this.host = t, this.__trapNode = null, this.__onKeyDown = this.__onKeyDown.bind(this);
  }
  /**
   * An array of tab-ordered focusable elements inside the trap node.
   *
   * @return {HTMLElement[]}
   * @private
   */
  get __focusableElements() {
    return pc(this.__trapNode);
  }
  /**
   * The index of the element inside the trap node that currently has focus.
   *
   * @return {HTMLElement | undefined}
   * @private
   */
  get __focusedElementIndex() {
    const t = this.__focusableElements;
    return t.indexOf(t.filter(zr).pop());
  }
  hostConnected() {
    document.addEventListener("keydown", this.__onKeyDown);
  }
  hostDisconnected() {
    document.removeEventListener("keydown", this.__onKeyDown);
  }
  /**
   * Activates a focus trap for a DOM node that will prevent focus from escaping the node.
   * The trap can be deactivated with the `.releaseFocus()` method.
   *
   * If focus is initially outside the trap, the method will move focus inside,
   * on the first focusable element of the trap in the tab order.
   * The first focusable element can be the trap node itself if it is focusable
   * and comes first in the tab order.
   *
   * If there are no focusable elements, the method will throw an exception
   * and the trap will not be set.
   *
   * @param {HTMLElement} trapNode
   */
  trapFocus(t) {
    if (this.__trapNode = t, this.__focusableElements.length === 0)
      throw this.__trapNode = null, new Error("The trap node should have at least one focusable descendant or be focusable itself.");
    zi.push(this), this.__focusedElementIndex === -1 && this.__focusableElements[0].focus();
  }
  /**
   * Deactivates the focus trap set with the `.trapFocus()` method
   * so that it becomes possible to tab outside the trap node.
   */
  releaseFocus() {
    this.__trapNode = null, zi.pop();
  }
  /**
   * A `keydown` event handler that manages tabbing navigation when the trap is enabled.
   *
   * - Moves focus to the next focusable element of the trap on `Tab` press.
   * When no next element to focus, the method moves focus to the first focusable element.
   * - Moves focus to the prev focusable element of the trap on `Shift+Tab` press.
   * When no prev element to focus, the method moves focus to the last focusable element.
   *
   * @param {KeyboardEvent} event
   * @private
   */
  __onKeyDown(t) {
    if (this.__trapNode && this === Array.from(zi).pop() && t.key === "Tab") {
      t.preventDefault();
      const e = t.shiftKey;
      this.__focusNextElement(e);
    }
  }
  /**
   * - Moves focus to the next focusable element if `backward === false`.
   * When no next element to focus, the method moves focus to the first focusable element.
   * - Moves focus to the prev focusable element if `backward === true`.
   * When no prev element to focus the method moves focus to the last focusable element.
   *
   * If no focusable elements, the method returns immediately.
   *
   * @param {boolean} backward
   * @private
   */
  __focusNextElement(t = !1) {
    const e = this.__focusableElements, i = t ? -1 : 1, r = this.__focusedElementIndex, s = (e.length + r + i) % e.length, n = e[s];
    n.focus(), n.localName === "input" && n.select();
  }
}
/**
 * @license
 * Copyright (c) 2021 - 2023 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
const ie = I(
  (o) => class extends o {
    constructor() {
      super(), this.__controllers = /* @__PURE__ */ new Set();
    }
    /** @protected */
    connectedCallback() {
      super.connectedCallback(), this.__controllers.forEach((e) => {
        e.hostConnected && e.hostConnected();
      });
    }
    /** @protected */
    disconnectedCallback() {
      super.disconnectedCallback(), this.__controllers.forEach((e) => {
        e.hostDisconnected && e.hostDisconnected();
      });
    }
    /**
     * Registers a controller to participate in the element update cycle.
     *
     * @param {ReactiveController} controller
     * @protected
     */
    addController(e) {
      this.__controllers.add(e), this.$ !== void 0 && this.isConnected && e.hostConnected && e.hostConnected();
    }
    /**
     * Removes a controller from the element.
     *
     * @param {ReactiveController} controller
     * @protected
     */
    removeController(e) {
      this.__controllers.delete(e);
    }
  }
);
/**
 * @license
 * Copyright (c) 2017 - 2023 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
const mc = (o) => class extends ie(o) {
  static get properties() {
    return {
      /**
       * When true, opening the overlay moves focus to the first focusable child,
       * or to the overlay part with tabindex if there are no focusable children.
       * @attr {boolean} focus-trap
       */
      focusTrap: {
        type: Boolean,
        value: !1
      },
      /**
       * Set to true to enable restoring of focus when overlay is closed.
       * @attr {boolean} restore-focus-on-close
       */
      restoreFocusOnClose: {
        type: Boolean,
        value: !1
      },
      /**
       * Set to specify the element which should be focused on overlay close,
       * if `restoreFocusOnClose` is set to true.
       * @type {HTMLElement}
       */
      restoreFocusNode: {
        type: HTMLElement
      }
    };
  }
  constructor() {
    super(), this.__ariaModalController = new lc(this), this.__focusTrapController = new fc(this), this.__focusRestorationController = new _c();
  }
  /** @protected */
  ready() {
    super.ready(), this.addController(this.__ariaModalController), this.addController(this.__focusTrapController), this.addController(this.__focusRestorationController);
  }
  /**
   * Release focus and restore focus after the overlay is closed.
   *
   * @protected
   */
  _resetFocus() {
    this.focusTrap && (this.__ariaModalController.close(), this.__focusTrapController.releaseFocus()), this.restoreFocusOnClose && this._shouldRestoreFocus() && this.__focusRestorationController.restoreFocus();
  }
  /**
   * Save the previously focused node when the overlay starts to open.
   *
   * @protected
   */
  _saveFocus() {
    this.restoreFocusOnClose && this.__focusRestorationController.saveFocus(this.restoreFocusNode);
  }
  /**
   * Trap focus within the overlay after opening has completed.
   *
   * @protected
   */
  _trapFocus() {
    this.focusTrap && (this.__ariaModalController.showModal(), this.__focusTrapController.trapFocus(this.$.overlay));
  }
  /**
   * Returns true if focus is still inside the overlay or on the body element,
   * otherwise false.
   *
   * Focus shouldn't be restored if it's been moved elsewhere by another
   * component or as a result of a user interaction e.g. the user clicked
   * on a button outside the overlay while the overlay was open.
   *
   * @protected
   * @return {boolean}
   */
  _shouldRestoreFocus() {
    const e = nr();
    return e === document.body || this._deepContains(e);
  }
  /**
   * Returns true if the overlay contains the given node,
   * including those within shadow DOM trees.
   *
   * @param {Node} node
   * @return {boolean}
   * @protected
   */
  _deepContains(e) {
    if (this.contains(e))
      return !0;
    let i = e;
    const r = e.ownerDocument;
    for (; i && i !== r && i !== this; )
      i = i.parentNode || i.host;
    return i === this;
  }
};
/**
 * @license
 * Copyright (c) 2017 - 2023 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
class U extends mc(O(te(A))) {
  static get template() {
    return k`
      <style>
        :host {
          z-index: 200;
          position: fixed;

          /* Despite of what the names say, <vaadin-overlay> is just a container
          for position/sizing/alignment. The actual overlay is the overlay part. */

          /* Default position constraints: the entire viewport. Note: themes can
          override this to introduce gaps between the overlay and the viewport. */
          top: 0;
          right: 0;
          bottom: var(--vaadin-overlay-viewport-bottom);
          left: 0;

          /* Use flexbox alignment for the overlay part. */
          display: flex;
          flex-direction: column; /* makes dropdowns sizing easier */
          /* Align to center by default. */
          align-items: center;
          justify-content: center;

          /* Allow centering when max-width/max-height applies. */
          margin: auto;

          /* The host is not clickable, only the overlay part is. */
          pointer-events: none;

          /* Remove tap highlight on touch devices. */
          -webkit-tap-highlight-color: transparent;

          /* CSS API for host */
          --vaadin-overlay-viewport-bottom: 0;
        }

        :host([hidden]),
        :host(:not([opened]):not([closing])) {
          display: none !important;
        }

        [part='overlay'] {
          -webkit-overflow-scrolling: touch;
          overflow: auto;
          pointer-events: auto;

          /* Prevent overflowing the host in MSIE 11 */
          max-width: 100%;
          box-sizing: border-box;

          -webkit-tap-highlight-color: initial; /* reenable tap highlight inside */
        }

        [part='backdrop'] {
          z-index: -1;
          content: '';
          background: rgba(0, 0, 0, 0.5);
          position: fixed;
          top: 0;
          left: 0;
          bottom: 0;
          right: 0;
          pointer-events: auto;
        }
      </style>

      <div id="backdrop" part="backdrop" hidden$="[[!withBackdrop]]"></div>
      <div part="overlay" id="overlay" tabindex="0">
        <div part="content" id="content">
          <slot></slot>
        </div>
      </div>
    `;
  }
  static get is() {
    return "vaadin-overlay";
  }
  static get properties() {
    return {
      /**
       * When true, the overlay is visible and attached to body.
       */
      opened: {
        type: Boolean,
        notify: !0,
        observer: "_openedChanged",
        reflectToAttribute: !0
      },
      /**
       * Owner element passed with renderer function
       * @type {HTMLElement}
       */
      owner: Element,
      /**
       * Custom function for rendering the content of the overlay.
       * Receives three arguments:
       *
       * - `root` The root container DOM element. Append your content to it.
       * - `owner` The host element of the renderer function.
       * - `model` The object with the properties related with rendering.
       * @type {OverlayRenderer | null | undefined}
       */
      renderer: Function,
      /**
       * When true the overlay has backdrop on top of content when opened.
       * @type {boolean}
       */
      withBackdrop: {
        type: Boolean,
        value: !1,
        reflectToAttribute: !0
      },
      /**
       * Object with properties that is passed to `renderer` function
       */
      model: Object,
      /**
       * When true the overlay won't disable the main content, showing
       * it doesn't change the functionality of the user interface.
       * @type {boolean}
       */
      modeless: {
        type: Boolean,
        value: !1,
        reflectToAttribute: !0,
        observer: "_modelessChanged"
      },
      /**
       * When set to true, the overlay is hidden. This also closes the overlay
       * immediately in case there is a closing animation in progress.
       * @type {boolean}
       */
      hidden: {
        type: Boolean,
        reflectToAttribute: !0,
        observer: "_hiddenChanged"
      },
      /** @private */
      _mouseDownInside: {
        type: Boolean
      },
      /** @private */
      _mouseUpInside: {
        type: Boolean
      },
      /** @private */
      _oldOwner: Element,
      /** @private */
      _oldModel: Object,
      /** @private */
      _oldRenderer: Object,
      /** @private */
      _oldOpened: Boolean
    };
  }
  static get observers() {
    return ["_rendererOrDataChanged(renderer, owner, model, opened)"];
  }
  /**
   * Returns all attached overlays in visual stacking order.
   * @private
   */
  static get __attachedInstances() {
    return Array.from(document.body.children).filter((t) => t instanceof U && !t.hasAttribute("closing")).sort((t, e) => t.__zIndex - e.__zIndex || 0);
  }
  constructor() {
    super(), this._boundMouseDownListener = this._mouseDownListener.bind(this), this._boundMouseUpListener = this._mouseUpListener.bind(this), this._boundOutsideClickListener = this._outsideClickListener.bind(this), this._boundKeydownListener = this._keydownListener.bind(this), Xt && (this._boundIosResizeListener = () => this._detectIosNavbar());
  }
  /**
   * Returns true if this is the last one in the opened overlays stack
   * @return {boolean}
   * @protected
   */
  get _last() {
    return this === U.__attachedInstances.pop();
  }
  /** @protected */
  ready() {
    super.ready(), this.addEventListener("click", () => {
    }), this.$.backdrop.addEventListener("click", () => {
    }), li(this);
  }
  /** @private */
  _detectIosNavbar() {
    if (!this.opened)
      return;
    const t = window.innerHeight, i = window.innerWidth > t, r = document.documentElement.clientHeight;
    i && r > t ? this.style.setProperty("--vaadin-overlay-viewport-bottom", `${r - t}px`) : this.style.setProperty("--vaadin-overlay-viewport-bottom", "0");
  }
  /**
   * @param {Event=} sourceEvent
   */
  close(t) {
    const e = new CustomEvent("vaadin-overlay-close", {
      bubbles: !0,
      cancelable: !0,
      detail: { sourceEvent: t }
    });
    this.dispatchEvent(e), e.defaultPrevented || (this.opened = !1);
  }
  /** @protected */
  connectedCallback() {
    super.connectedCallback(), this._boundIosResizeListener && (this._detectIosNavbar(), window.addEventListener("resize", this._boundIosResizeListener));
  }
  /** @protected */
  disconnectedCallback() {
    super.disconnectedCallback(), this._boundIosResizeListener && window.removeEventListener("resize", this._boundIosResizeListener);
  }
  /**
   * Requests an update for the content of the overlay.
   * While performing the update, it invokes the renderer passed in the `renderer` property.
   *
   * It is not guaranteed that the update happens immediately (synchronously) after it is requested.
   */
  requestContentUpdate() {
    this.renderer && this.renderer.call(this.owner, this, this.owner, this.model);
  }
  /** @private */
  _mouseDownListener(t) {
    this._mouseDownInside = t.composedPath().indexOf(this.$.overlay) >= 0;
  }
  /** @private */
  _mouseUpListener(t) {
    this._mouseUpInside = t.composedPath().indexOf(this.$.overlay) >= 0;
  }
  /**
   * Whether to close the overlay on outside click or not.
   * Override this method to customize the closing logic.
   *
   * @param {Event} _event
   * @return {boolean}
   * @protected
   */
  _shouldCloseOnOutsideClick(t) {
    return this._last;
  }
  /**
   * Outside click listener used in capture phase to close the overlay before
   * propagating the event to the listener on the element that triggered it.
   * Otherwise, calling `open()` would result in closing and re-opening.
   *
   * @private
   */
  _outsideClickListener(t) {
    if (t.composedPath().includes(this.$.overlay) || this._mouseDownInside || this._mouseUpInside) {
      this._mouseDownInside = !1, this._mouseUpInside = !1;
      return;
    }
    if (!this._shouldCloseOnOutsideClick(t))
      return;
    const e = new CustomEvent("vaadin-overlay-outside-click", {
      bubbles: !0,
      cancelable: !0,
      detail: { sourceEvent: t }
    });
    this.dispatchEvent(e), this.opened && !e.defaultPrevented && this.close(t);
  }
  /**
   * Listener used to close whe overlay on Escape press, if it is the last one.
   * @private
   */
  _keydownListener(t) {
    if (this._last && !(this.modeless && !t.composedPath().includes(this.$.overlay)) && t.key === "Escape") {
      const e = new CustomEvent("vaadin-overlay-escape-press", {
        bubbles: !0,
        cancelable: !0,
        detail: { sourceEvent: t }
      });
      this.dispatchEvent(e), this.opened && !e.defaultPrevented && this.close(t);
    }
  }
  /** @private */
  _openedChanged(t, e) {
    t ? (this._saveFocus(), this._animatedOpening(), Dr(this, () => {
      this._trapFocus();
      const i = new CustomEvent("vaadin-overlay-open", { bubbles: !0 });
      this.dispatchEvent(i);
    }), document.addEventListener("keydown", this._boundKeydownListener), this.modeless || this._addGlobalListeners()) : e && (this._resetFocus(), this._animatedClosing(), document.removeEventListener("keydown", this._boundKeydownListener), this.modeless || this._removeGlobalListeners());
  }
  /** @private */
  _hiddenChanged(t) {
    t && this.hasAttribute("closing") && this._flushAnimation("closing");
  }
  /**
   * @return {boolean}
   * @private
   */
  _shouldAnimate() {
    const t = getComputedStyle(this), e = t.getPropertyValue("animation-name");
    return !(t.getPropertyValue("display") === "none") && e && e !== "none";
  }
  /**
   * @param {string} type
   * @param {Function} callback
   * @private
   */
  _enqueueAnimation(t, e) {
    const i = `__${t}Handler`, r = (s) => {
      s && s.target !== this || (e(), this.removeEventListener("animationend", r), delete this[i]);
    };
    this[i] = r, this.addEventListener("animationend", r);
  }
  /**
   * @param {string} type
   * @protected
   */
  _flushAnimation(t) {
    const e = `__${t}Handler`;
    typeof this[e] == "function" && this[e]();
  }
  /** @private */
  _animatedOpening() {
    this.parentNode === document.body && this.hasAttribute("closing") && this._flushAnimation("closing"), this._attachOverlay(), this.modeless || this._enterModalState(), this.setAttribute("opening", ""), this._shouldAnimate() ? this._enqueueAnimation("opening", () => {
      this._finishOpening();
    }) : this._finishOpening();
  }
  /** @private */
  _attachOverlay() {
    this._placeholder = document.createComment("vaadin-overlay-placeholder"), this.parentNode.insertBefore(this._placeholder, this), document.body.appendChild(this), this.bringToFront();
  }
  /** @private */
  _finishOpening() {
    this.removeAttribute("opening");
  }
  /** @private */
  _finishClosing() {
    this._detachOverlay(), this.$.overlay.style.removeProperty("pointer-events"), this.removeAttribute("closing"), this.dispatchEvent(new CustomEvent("vaadin-overlay-closed"));
  }
  /** @private */
  _animatedClosing() {
    this.hasAttribute("opening") && this._flushAnimation("opening"), this._placeholder && (this._exitModalState(), this.setAttribute("closing", ""), this.dispatchEvent(new CustomEvent("vaadin-overlay-closing")), this._shouldAnimate() ? this._enqueueAnimation("closing", () => {
      this._finishClosing();
    }) : this._finishClosing());
  }
  /** @private */
  _detachOverlay() {
    this._placeholder.parentNode.insertBefore(this, this._placeholder), this._placeholder.parentNode.removeChild(this._placeholder);
  }
  /** @private */
  _modelessChanged(t) {
    t ? (this._removeGlobalListeners(), this._exitModalState()) : this.opened && (this._addGlobalListeners(), this._enterModalState());
  }
  /** @private */
  _addGlobalListeners() {
    document.addEventListener("mousedown", this._boundMouseDownListener), document.addEventListener("mouseup", this._boundMouseUpListener), document.documentElement.addEventListener("click", this._boundOutsideClickListener, !0);
  }
  /** @private */
  _enterModalState() {
    document.body.style.pointerEvents !== "none" && (this._previousDocumentPointerEvents = document.body.style.pointerEvents, document.body.style.pointerEvents = "none"), U.__attachedInstances.forEach((t) => {
      t !== this && (t.shadowRoot.querySelector('[part="overlay"]').style.pointerEvents = "none");
    });
  }
  /** @private */
  _removeGlobalListeners() {
    document.removeEventListener("mousedown", this._boundMouseDownListener), document.removeEventListener("mouseup", this._boundMouseUpListener), document.documentElement.removeEventListener("click", this._boundOutsideClickListener, !0);
  }
  /** @private */
  _exitModalState() {
    this._previousDocumentPointerEvents !== void 0 && (document.body.style.pointerEvents = this._previousDocumentPointerEvents, delete this._previousDocumentPointerEvents);
    const t = U.__attachedInstances;
    let e;
    for (; (e = t.pop()) && !(e !== this && (e.shadowRoot.querySelector('[part="overlay"]').style.removeProperty("pointer-events"), !e.modeless)); )
      ;
  }
  /** @private */
  _rendererOrDataChanged(t, e, i, r) {
    const s = this._oldOwner !== e || this._oldModel !== i;
    this._oldModel = i, this._oldOwner = e;
    const n = this._oldRenderer !== t;
    this._oldRenderer = t;
    const a = this._oldOpened !== r;
    this._oldOpened = r, n && (this.innerHTML = "", delete this._$litPart$), r && t && (n || a || s) && this.requestContentUpdate();
  }
  /**
   * Brings the overlay as visually the frontmost one
   */
  bringToFront() {
    let t = "";
    const e = U.__attachedInstances.filter((i) => i !== this).pop();
    e && (t = e.__zIndex + 1), this.style.zIndex = t, this.__zIndex = t || parseFloat(getComputedStyle(this).zIndex);
  }
  /**
   * @event vaadin-overlay-open
   * Fired after the overlay is opened.
   */
  /**
   * @event vaadin-overlay-close
   * Fired when the opened overlay is about to be closed.
   * Calling `preventDefault()` on the event cancels the closing.
   */
  /**
   * @event vaadin-overlay-closing
   * Fired when the overlay starts to close.
   * Closing the overlay can be asynchronous depending on the animation.
   */
  /**
   * @event vaadin-overlay-closed
   * Fired after the overlay is closed.
   */
  /**
   * @event vaadin-overlay-escape-press
   * Fired before the overlay is closed on Escape key press.
   * Calling `preventDefault()` on the event cancels the closing.
   */
  /**
   * @event vaadin-overlay-outside-click
   * Fired before the overlay is closed on outside click.
   * Calling `preventDefault()` on the event cancels the closing.
   */
}
customElements.define(U.is, U);
/**
 * @license
 * Copyright (c) 2017 - 2023 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
const di = _`
  :host([opening]),
  :host([closing]) {
    animation: 0.14s lumo-overlay-dummy-animation;
  }

  [part='overlay'] {
    will-change: opacity, transform;
  }

  :host([opening]) [part='overlay'] {
    animation: 0.1s lumo-menu-overlay-enter ease-out both;
  }

  @keyframes lumo-menu-overlay-enter {
    0% {
      opacity: 0;
      transform: translateY(-4px);
    }
  }

  :host([closing]) [part='overlay'] {
    animation: 0.1s lumo-menu-overlay-exit both;
  }

  @keyframes lumo-menu-overlay-exit {
    100% {
      opacity: 0;
    }
  }
`;
m("", di, { moduleId: "lumo-menu-overlay-core" });
const gc = _`
  /* Small viewport (bottom sheet) styles */
  /* Use direct media queries instead of the state attributes ([phone] and [fullscreen]) provided by the elements */
  @media (max-width: 420px), (max-height: 420px) {
    :host {
      top: 0 !important;
      right: 0 !important;
      bottom: var(--vaadin-overlay-viewport-bottom, 0) !important;
      left: 0 !important;
      align-items: stretch !important;
      justify-content: flex-end !important;
    }

    [part='overlay'] {
      max-height: 50vh;
      width: 100vw;
      border-radius: 0;
      box-shadow: var(--lumo-box-shadow-xl);
    }

    /* The content part scrolls instead of the overlay part, because of the gradient fade-out */
    [part='content'] {
      padding: 30px var(--lumo-space-m);
      max-height: inherit;
      box-sizing: border-box;
      -webkit-overflow-scrolling: touch;
      overflow: auto;
      -webkit-mask-image: linear-gradient(transparent, #000 40px, #000 calc(100% - 40px), transparent);
      mask-image: linear-gradient(transparent, #000 40px, #000 calc(100% - 40px), transparent);
    }

    [part='backdrop'] {
      display: block;
    }

    /* Animations */

    :host([opening]) [part='overlay'] {
      animation: 0.2s lumo-mobile-menu-overlay-enter cubic-bezier(0.215, 0.61, 0.355, 1) both;
    }

    :host([closing]),
    :host([closing]) [part='backdrop'] {
      animation-delay: 0.14s;
    }

    :host([closing]) [part='overlay'] {
      animation: 0.14s 0.14s lumo-mobile-menu-overlay-exit cubic-bezier(0.55, 0.055, 0.675, 0.19) both;
    }
  }

  @keyframes lumo-mobile-menu-overlay-enter {
    0% {
      transform: translateY(150%);
    }
  }

  @keyframes lumo-mobile-menu-overlay-exit {
    100% {
      transform: translateY(150%);
    }
  }
`, Fn = [At, di, gc];
m("", Fn, { moduleId: "lumo-menu-overlay" });
const bc = _`
  [part='overlay'] {
    /*
  Width:
      date cell widths
    + month calendar side padding
    + year scroller width
  */
    /* prettier-ignore */
    width:
    calc(
        var(--lumo-size-m) * 7
      + var(--lumo-space-xs) * 2
      + 57px
    );
    height: 100%;
    max-height: calc(var(--lumo-size-m) * 14);
    overflow: hidden;
    -webkit-tap-highlight-color: transparent;
  }

  [part='overlay'] {
    flex-direction: column;
  }

  [part='content'] {
    padding: 0;
    height: 100%;
    overflow: hidden;
    -webkit-mask-image: none;
    mask-image: none;
  }

  :host([top-aligned]) [part~='overlay'] {
    margin-top: var(--lumo-space-xs);
  }

  :host([bottom-aligned]) [part~='overlay'] {
    margin-bottom: var(--lumo-space-xs);
  }

  @media (max-width: 420px), (max-height: 420px) {
    [part='overlay'] {
      width: 100vw;
      height: 70vh;
      max-height: 70vh;
    }
  }
`;
m("vaadin-date-picker-overlay", [Fn, bc], {
  moduleId: "lumo-date-picker-overlay"
});
const vc = _`
  :host {
    /* Sizing */
    --lumo-button-size: var(--lumo-size-m);
    min-width: calc(var(--lumo-button-size) * 2);
    height: var(--lumo-button-size);
    padding: 0 calc(var(--lumo-button-size) / 3 + var(--lumo-border-radius-m) / 2);
    margin: var(--lumo-space-xs) 0;
    box-sizing: border-box;
    /* Style */
    font-family: var(--lumo-font-family);
    font-size: var(--lumo-font-size-m);
    font-weight: 500;
    color: var(--_lumo-button-color, var(--lumo-primary-text-color));
    background-color: var(--_lumo-button-background-color, var(--lumo-contrast-5pct));
    border-radius: var(--lumo-border-radius-m);
    cursor: var(--lumo-clickable-cursor);
    -webkit-tap-highlight-color: transparent;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    flex-shrink: 0;
  }

  /* Set only for the internal parts so we don't affect the host vertical alignment */
  [part='label'],
  [part='prefix'],
  [part='suffix'] {
    line-height: var(--lumo-line-height-xs);
  }

  [part='label'] {
    padding: calc(var(--lumo-button-size) / 6) 0;
  }

  :host([theme~='small']) {
    font-size: var(--lumo-font-size-s);
    --lumo-button-size: var(--lumo-size-s);
  }

  :host([theme~='large']) {
    font-size: var(--lumo-font-size-l);
    --lumo-button-size: var(--lumo-size-l);
  }

  /* For interaction states */
  :host::before,
  :host::after {
    content: '';
    /* We rely on the host always being relative */
    position: absolute;
    z-index: 1;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    background-color: currentColor;
    border-radius: inherit;
    opacity: 0;
    pointer-events: none;
  }

  /* Hover */

  @media (any-hover: hover) {
    :host(:hover)::before {
      opacity: 0.02;
    }
  }

  /* Active */

  :host::after {
    transition: opacity 1.4s, transform 0.1s;
    filter: blur(8px);
  }

  :host([active])::before {
    opacity: 0.05;
    transition-duration: 0s;
  }

  :host([active])::after {
    opacity: 0.1;
    transition-duration: 0s, 0s;
    transform: scale(0);
  }

  /* Keyboard focus */

  :host([focus-ring]) {
    box-shadow: 0 0 0 2px var(--lumo-primary-color-50pct);
  }

  :host([theme~='primary'][focus-ring]) {
    box-shadow: 0 0 0 1px var(--lumo-base-color), 0 0 0 3px var(--lumo-primary-color-50pct);
  }

  /* Types (primary, tertiary, tertiary-inline */

  :host([theme~='tertiary']),
  :host([theme~='tertiary-inline']) {
    background-color: transparent !important;
    min-width: 0;
  }

  :host([theme~='tertiary']) {
    padding: 0 calc(var(--lumo-button-size) / 6);
  }

  :host([theme~='tertiary-inline'])::before {
    display: none;
  }

  :host([theme~='tertiary-inline']) {
    margin: 0;
    height: auto;
    padding: 0;
    line-height: inherit;
    font-size: inherit;
  }

  :host([theme~='tertiary-inline']) [part='label'] {
    padding: 0;
    overflow: visible;
    line-height: inherit;
  }

  :host([theme~='primary']) {
    background-color: var(--_lumo-button-primary-background-color, var(--lumo-primary-color));
    color: var(--_lumo-button-primary-color, var(--lumo-primary-contrast-color));
    font-weight: 600;
    min-width: calc(var(--lumo-button-size) * 2.5);
  }

  :host([theme~='primary'])::before {
    background-color: black;
  }

  @media (any-hover: hover) {
    :host([theme~='primary']:hover)::before {
      opacity: 0.05;
    }
  }

  :host([theme~='primary'][active])::before {
    opacity: 0.1;
  }

  :host([theme~='primary'][active])::after {
    opacity: 0.2;
  }

  /* Colors (success, error, contrast) */

  :host([theme~='success']) {
    color: var(--lumo-success-text-color);
  }

  :host([theme~='success'][theme~='primary']) {
    background-color: var(--lumo-success-color);
    color: var(--lumo-success-contrast-color);
  }

  :host([theme~='error']) {
    color: var(--lumo-error-text-color);
  }

  :host([theme~='error'][theme~='primary']) {
    background-color: var(--lumo-error-color);
    color: var(--lumo-error-contrast-color);
  }

  :host([theme~='contrast']) {
    color: var(--lumo-contrast);
  }

  :host([theme~='contrast'][theme~='primary']) {
    background-color: var(--lumo-contrast);
    color: var(--lumo-base-color);
  }

  /* Disabled state. Keep selectors after other color variants. */

  :host([disabled]) {
    pointer-events: none;
    color: var(--lumo-disabled-text-color);
  }

  :host([theme~='primary'][disabled]) {
    background-color: var(--lumo-contrast-30pct);
    color: var(--lumo-base-color);
  }

  :host([theme~='primary'][disabled]) [part] {
    opacity: 0.7;
  }

  /* Icons */

  [part] ::slotted(vaadin-icon) {
    display: inline-block;
    width: var(--lumo-icon-size-m);
    height: var(--lumo-icon-size-m);
  }

  /* Vaadin icons are based on a 16x16 grid (unlike Lumo and Material icons with 24x24), so they look too big by default */
  [part] ::slotted(vaadin-icon[icon^='vaadin:']) {
    padding: 0.25em;
    box-sizing: border-box !important;
  }

  [part='prefix'] {
    margin-left: -0.25em;
    margin-right: 0.25em;
  }

  [part='suffix'] {
    margin-left: 0.25em;
    margin-right: -0.25em;
  }

  /* Icon-only */

  :host([theme~='icon']:not([theme~='tertiary-inline'])) {
    min-width: var(--lumo-button-size);
    padding-left: calc(var(--lumo-button-size) / 4);
    padding-right: calc(var(--lumo-button-size) / 4);
  }

  :host([theme~='icon']) [part='prefix'],
  :host([theme~='icon']) [part='suffix'] {
    margin-left: 0;
    margin-right: 0;
  }

  /* RTL specific styles */

  :host([dir='rtl']) [part='prefix'] {
    margin-left: 0.25em;
    margin-right: -0.25em;
  }

  :host([dir='rtl']) [part='suffix'] {
    margin-left: -0.25em;
    margin-right: 0.25em;
  }

  :host([dir='rtl'][theme~='icon']) [part='prefix'],
  :host([dir='rtl'][theme~='icon']) [part='suffix'] {
    margin-left: 0;
    margin-right: 0;
  }
`;
m("vaadin-button", vc, { moduleId: "lumo-button" });
const yc = /\/\*[\*!]\s+vaadin-dev-mode:start([\s\S]*)vaadin-dev-mode:end\s+\*\*\//i, Wt = window.Vaadin && window.Vaadin.Flow && window.Vaadin.Flow.clients;
function Cc() {
  function o() {
    return !0;
  }
  return Nn(o);
}
function xc() {
  try {
    return wc() ? !0 : Ac() ? Wt ? !kc() : !Cc() : !1;
  } catch {
    return !1;
  }
}
function wc() {
  return localStorage.getItem("vaadin.developmentmode.force");
}
function Ac() {
  return ["localhost", "127.0.0.1"].indexOf(window.location.hostname) >= 0;
}
function kc() {
  return !!(Wt && Object.keys(Wt).map((t) => Wt[t]).filter((t) => t.productionMode).length > 0);
}
function Nn(o, t) {
  if (typeof o != "function")
    return;
  const e = yc.exec(o.toString());
  if (e)
    try {
      o = new Function(e[1]);
    } catch {
    }
  return o(t);
}
window.Vaadin = window.Vaadin || {};
const No = function(o, t) {
  if (window.Vaadin.developmentMode)
    return Nn(o, t);
};
window.Vaadin.developmentMode === void 0 && (window.Vaadin.developmentMode = xc());
function Ec() {
}
const Sc = function() {
  if (typeof No == "function")
    return No(Ec);
};
/**
 * @license
 * Copyright (c) 2017 The Polymer Project Authors. All rights reserved.
 * This code may only be used under the BSD style license found at http://polymer.github.io/LICENSE.txt
 * The complete set of authors may be found at http://polymer.github.io/AUTHORS.txt
 * The complete set of contributors may be found at http://polymer.github.io/CONTRIBUTORS.txt
 * Code distributed by Google as part of the polymer project is also
 * subject to an additional IP rights grant found at http://polymer.github.io/PATENTS.txt
 */
let Lo = 0, Ln = 0;
const Re = [];
let lr = !1;
function Ic() {
  lr = !1;
  const o = Re.length;
  for (let t = 0; t < o; t++) {
    const e = Re[t];
    if (e)
      try {
        e();
      } catch (i) {
        setTimeout(() => {
          throw i;
        });
      }
  }
  Re.splice(0, o), Ln += o;
}
const L = {
  /**
   * Returns a sub-module with the async interface providing the provided
   * delay.
   *
   * @memberof timeOut
   * @param {number=} delay Time to wait before calling callbacks in ms
   * @return {!AsyncInterface} An async timeout interface
   */
  after(o) {
    return {
      run(t) {
        return window.setTimeout(t, o);
      },
      cancel(t) {
        window.clearTimeout(t);
      }
    };
  },
  /**
   * Enqueues a function called in the next task.
   *
   * @memberof timeOut
   * @param {!Function} fn Callback to run
   * @param {number=} delay Delay in milliseconds
   * @return {number} Handle used for canceling task
   */
  run(o, t) {
    return window.setTimeout(o, t);
  },
  /**
   * Cancels a previously enqueued `timeOut` callback.
   *
   * @memberof timeOut
   * @param {number} handle Handle returned from `run` of callback to cancel
   * @return {void}
   */
  cancel(o) {
    window.clearTimeout(o);
  }
}, le = {
  /**
   * Enqueues a function called at `requestAnimationFrame` timing.
   *
   * @memberof animationFrame
   * @param {function(number):void} fn Callback to run
   * @return {number} Handle used for canceling task
   */
  run(o) {
    return window.requestAnimationFrame(o);
  },
  /**
   * Cancels a previously enqueued `animationFrame` callback.
   *
   * @memberof animationFrame
   * @param {number} handle Handle returned from `run` of callback to cancel
   * @return {void}
   */
  cancel(o) {
    window.cancelAnimationFrame(o);
  }
}, Bn = {
  /**
   * Enqueues a function called at `requestIdleCallback` timing.
   *
   * @memberof idlePeriod
   * @param {function(!IdleDeadline):void} fn Callback to run
   * @return {number} Handle used for canceling task
   */
  run(o) {
    return window.requestIdleCallback ? window.requestIdleCallback(o) : window.setTimeout(o, 16);
  },
  /**
   * Cancels a previously enqueued `idlePeriod` callback.
   *
   * @memberof idlePeriod
   * @param {number} handle Handle returned from `run` of callback to cancel
   * @return {void}
   */
  cancel(o) {
    window.cancelIdleCallback ? window.cancelIdleCallback(o) : window.clearTimeout(o);
  }
}, de = {
  /**
   * Enqueues a function called at microtask timing.
   *
   * @memberof microTask
   * @param {!Function=} callback Callback to run
   * @return {number} Handle used for canceling task
   */
  run(o) {
    lr || (lr = !0, queueMicrotask(() => Ic())), Re.push(o);
    const t = Lo;
    return Lo += 1, t;
  },
  /**
   * Cancels a previously enqueued `microTask` callback.
   *
   * @memberof microTask
   * @param {number} handle Handle returned from `run` of callback to cancel
   * @return {void}
   */
  cancel(o) {
    const t = o - Ln;
    if (t >= 0) {
      if (!Re[t])
        throw new Error(`invalid async handle: ${o}`);
      Re[t] = null;
    }
  }
};
/**
@license
Copyright (c) 2017 The Polymer Project Authors. All rights reserved.
This code may only be used under the BSD style license found at http://polymer.github.io/LICENSE.txt
The complete set of authors may be found at http://polymer.github.io/AUTHORS.txt
The complete set of contributors may be found at http://polymer.github.io/CONTRIBUTORS.txt
Code distributed by Google as part of the polymer project is also
subject to an additional IP rights grant found at http://polymer.github.io/PATENTS.txt
*/
const vt = /* @__PURE__ */ new Set();
let w = class dr {
  /**
   * Creates a debouncer if no debouncer is passed as a parameter
   * or it cancels an active debouncer otherwise. The following
   * example shows how a debouncer can be called multiple times within a
   * microtask and "debounced" such that the provided callback function is
   * called once. Add this method to a custom element:
   *
   * ```js
   * import {microTask} from '@vaadin/component-base/src/async.js';
   * import {Debouncer} from '@vaadin/component-base/src/debounce.js';
   * // ...
   *
   * _debounceWork() {
   *   this._debounceJob = Debouncer.debounce(this._debounceJob,
   *       microTask, () => this._doWork());
   * }
   * ```
   *
   * If the `_debounceWork` method is called multiple times within the same
   * microtask, the `_doWork` function will be called only once at the next
   * microtask checkpoint.
   *
   * Note: In testing it is often convenient to avoid asynchrony. To accomplish
   * this with a debouncer, you can use `enqueueDebouncer` and
   * `flush`. For example, extend the above example by adding
   * `enqueueDebouncer(this._debounceJob)` at the end of the
   * `_debounceWork` method. Then in a test, call `flush` to ensure
   * the debouncer has completed.
   *
   * @param {Debouncer?} debouncer Debouncer object.
   * @param {!AsyncInterface} asyncModule Object with Async interface
   * @param {function()} callback Callback to run.
   * @return {!Debouncer} Returns a debouncer object.
   */
  static debounce(t, e, i) {
    return t instanceof dr ? t._cancelAsync() : t = new dr(), t.setConfig(e, i), t;
  }
  constructor() {
    this._asyncModule = null, this._callback = null, this._timer = null;
  }
  /**
   * Sets the scheduler; that is, a module with the Async interface,
   * a callback and optional arguments to be passed to the run function
   * from the async module.
   *
   * @param {!AsyncInterface} asyncModule Object with Async interface.
   * @param {function()} callback Callback to run.
   * @return {void}
   */
  setConfig(t, e) {
    this._asyncModule = t, this._callback = e, this._timer = this._asyncModule.run(() => {
      this._timer = null, vt.delete(this), this._callback();
    });
  }
  /**
   * Cancels an active debouncer and returns a reference to itself.
   *
   * @return {void}
   */
  cancel() {
    this.isActive() && (this._cancelAsync(), vt.delete(this));
  }
  /**
   * Cancels a debouncer's async callback.
   *
   * @return {void}
   */
  _cancelAsync() {
    this.isActive() && (this._asyncModule.cancel(
      /** @type {number} */
      this._timer
    ), this._timer = null);
  }
  /**
   * Flushes an active debouncer and returns a reference to itself.
   *
   * @return {void}
   */
  flush() {
    this.isActive() && (this.cancel(), this._callback());
  }
  /**
   * Returns true if the debouncer is active.
   *
   * @return {boolean} True if active.
   */
  isActive() {
    return this._timer != null;
  }
};
function Hn(o) {
  vt.add(o);
}
function Tc() {
  const o = !!vt.size;
  return vt.forEach((t) => {
    try {
      t.flush();
    } catch (e) {
      setTimeout(() => {
        throw e;
      });
    }
  }), o;
}
const st = () => {
  let o;
  do
    o = Tc();
  while (o);
};
/**
 * @license
 * Copyright (c) 2021 - 2023 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
window.Vaadin || (window.Vaadin = {});
window.Vaadin.registrations || (window.Vaadin.registrations = []);
window.Vaadin.developmentModeCallback || (window.Vaadin.developmentModeCallback = {});
window.Vaadin.developmentModeCallback["vaadin-usage-statistics"] = function() {
  Sc();
};
let $i;
const Bo = /* @__PURE__ */ new Set(), he = (o) => class extends te(o) {
  static get version() {
    return "24.1.1";
  }
  /** @protected */
  static finalize() {
    super.finalize();
    const { is: e } = this;
    e && !Bo.has(e) && (window.Vaadin.registrations.push(this), Bo.add(e), window.Vaadin.developmentModeCallback && ($i = w.debounce($i, Bn, () => {
      window.Vaadin.developmentModeCallback["vaadin-usage-statistics"]();
    }), Hn($i)));
  }
  constructor() {
    super(), document.doctype;
  }
};
/**
@license
Copyright (c) 2017 The Polymer Project Authors. All rights reserved.
This code may only be used under the BSD style license found at http://polymer.github.io/LICENSE.txt
The complete set of authors may be found at http://polymer.github.io/AUTHORS.txt
The complete set of contributors may be found at http://polymer.github.io/CONTRIBUTORS.txt
Code distributed by Google as part of the polymer project is also
subject to an additional IP rights grant found at http://polymer.github.io/PATENTS.txt
*/
function Xe(o, t, e) {
  return {
    index: o,
    removed: t,
    addedCount: e
  };
}
const Vn = 0, Un = 1, cr = 2, hr = 3;
function Pc(o, t, e, i, r, s) {
  let n = s - r + 1, a = e - t + 1, l = new Array(n);
  for (let d = 0; d < n; d++)
    l[d] = new Array(a), l[d][0] = d;
  for (let d = 0; d < a; d++)
    l[0][d] = d;
  for (let d = 1; d < n; d++)
    for (let c = 1; c < a; c++)
      if ($r(o[t + c - 1], i[r + d - 1]))
        l[d][c] = l[d - 1][c - 1];
      else {
        let h = l[d - 1][c] + 1, u = l[d][c - 1] + 1;
        l[d][c] = h < u ? h : u;
      }
  return l;
}
function Dc(o) {
  let t = o.length - 1, e = o[0].length - 1, i = o[t][e], r = [];
  for (; t > 0 || e > 0; ) {
    if (t == 0) {
      r.push(cr), e--;
      continue;
    }
    if (e == 0) {
      r.push(hr), t--;
      continue;
    }
    let s = o[t - 1][e - 1], n = o[t - 1][e], a = o[t][e - 1], l;
    n < a ? l = n < s ? n : s : l = a < s ? a : s, l == s ? (s == i ? r.push(Vn) : (r.push(Un), i = s), t--, e--) : l == n ? (r.push(hr), t--, i = n) : (r.push(cr), e--, i = a);
  }
  return r.reverse(), r;
}
function Oc(o, t, e, i, r, s) {
  let n = 0, a = 0, l, d = Math.min(e - t, s - r);
  if (t == 0 && r == 0 && (n = zc(o, i, d)), e == o.length && s == i.length && (a = $c(o, i, d - n)), t += n, r += n, e -= a, s -= a, e - t == 0 && s - r == 0)
    return [];
  if (t == e) {
    for (l = Xe(t, [], 0); r < s; )
      l.removed.push(i[r++]);
    return [l];
  } else if (r == s)
    return [Xe(t, [], e - t)];
  let c = Dc(
    Pc(
      o,
      t,
      e,
      i,
      r,
      s
    )
  );
  l = void 0;
  let h = [], u = t, p = r;
  for (let f = 0; f < c.length; f++)
    switch (c[f]) {
      case Vn:
        l && (h.push(l), l = void 0), u++, p++;
        break;
      case Un:
        l || (l = Xe(u, [], 0)), l.addedCount++, u++, l.removed.push(i[p]), p++;
        break;
      case cr:
        l || (l = Xe(u, [], 0)), l.addedCount++, u++;
        break;
      case hr:
        l || (l = Xe(u, [], 0)), l.removed.push(i[p]), p++;
        break;
    }
  return l && h.push(l), h;
}
function zc(o, t, e) {
  for (let i = 0; i < e; i++)
    if (!$r(o[i], t[i]))
      return i;
  return e;
}
function $c(o, t, e) {
  let i = o.length, r = t.length, s = 0;
  for (; s < e && $r(o[--i], t[--r]); )
    s++;
  return s;
}
function Mc(o, t) {
  return Oc(
    o,
    0,
    o.length,
    t,
    0,
    t.length
  );
}
function $r(o, t) {
  return o === t;
}
/**
@license
Copyright (c) 2017 The Polymer Project Authors. All rights reserved.
This code may only be used under the BSD style license found at http://polymer.github.io/LICENSE.txt
The complete set of authors may be found at http://polymer.github.io/AUTHORS.txt
The complete set of contributors may be found at http://polymer.github.io/CONTRIBUTORS.txt
Code distributed by Google as part of the polymer project is also
subject to an additional IP rights grant found at http://polymer.github.io/PATENTS.txt
*/
function Pe(o) {
  return o.localName === "slot";
}
let Fe = class {
  /**
   * Returns the list of flattened nodes for the given `node`.
   * This list consists of a node's children and, for any children
   * that are `<slot>` elements, the expanded flattened list of `assignedNodes`.
   * For example, if the observed node has children `<a></a><slot></slot><b></b>`
   * and the `<slot>` has one `<div>` assigned to it, then the flattened
   * nodes list is `<a></a><div></div><b></b>`. If the `<slot>` has other
   * `<slot>` elements assigned to it, these are flattened as well.
   *
   * @param {!HTMLElement|!HTMLSlotElement} node The node for which to
   *      return the list of flattened nodes.
   * @return {!Array<!Node>} The list of flattened nodes for the given `node`.
   * @nocollapse See https://github.com/google/closure-compiler/issues/2763
   */
  // eslint-disable-next-line
  static getFlattenedNodes(o) {
    const t = S(o);
    return Pe(o) ? (o = /** @type {!HTMLSlotElement} */
    o, t.assignedNodes({ flatten: !0 })) : Array.from(t.childNodes).map((e) => Pe(e) ? (e = /** @type {!HTMLSlotElement} */
    e, S(e).assignedNodes({ flatten: !0 })) : [e]).reduce((e, i) => e.concat(i), []);
  }
  /**
   * @param {!HTMLElement} target Node on which to listen for changes.
   * @param {?function(this: Element, { target: !HTMLElement, addedNodes: !Array<!Element>, removedNodes: !Array<!Element> }):void} callback Function called when there are additions
   * or removals from the target's list of flattened nodes.
   */
  // eslint-disable-next-line
  constructor(o, t) {
    this._shadyChildrenObserver = null, this._nativeChildrenObserver = null, this._connected = !1, this._target = o, this.callback = t, this._effectiveNodes = [], this._observer = null, this._scheduled = !1, this._boundSchedule = () => {
      this._schedule();
    }, this.connect(), this._schedule();
  }
  /**
   * Activates an observer. This method is automatically called when
   * a `FlattenedNodesObserver` is created. It should only be called to
   * re-activate an observer that has been deactivated via the `disconnect` method.
   *
   * @return {void}
   */
  connect() {
    Pe(this._target) ? this._listenSlots([this._target]) : S(this._target).children && (this._listenSlots(
      /** @type {!NodeList<!Node>} */
      S(this._target).children
    ), window.ShadyDOM ? this._shadyChildrenObserver = window.ShadyDOM.observeChildren(this._target, (o) => {
      this._processMutations(o);
    }) : (this._nativeChildrenObserver = new MutationObserver((o) => {
      this._processMutations(o);
    }), this._nativeChildrenObserver.observe(this._target, { childList: !0 }))), this._connected = !0;
  }
  /**
   * Deactivates the flattened nodes observer. After calling this method
   * the observer callback will not be called when changes to flattened nodes
   * occur. The `connect` method may be subsequently called to reactivate
   * the observer.
   *
   * @return {void}
   * @override
   */
  disconnect() {
    Pe(this._target) ? this._unlistenSlots([this._target]) : S(this._target).children && (this._unlistenSlots(
      /** @type {!NodeList<!Node>} */
      S(this._target).children
    ), window.ShadyDOM && this._shadyChildrenObserver ? (window.ShadyDOM.unobserveChildren(this._shadyChildrenObserver), this._shadyChildrenObserver = null) : this._nativeChildrenObserver && (this._nativeChildrenObserver.disconnect(), this._nativeChildrenObserver = null)), this._connected = !1;
  }
  /**
   * @return {void}
   * @private
   */
  _schedule() {
    this._scheduled || (this._scheduled = !0, Ir.run(() => this.flush()));
  }
  /**
   * @param {Array<MutationRecord>} mutations Mutations signaled by the mutation observer
   * @return {void}
   * @private
   */
  _processMutations(o) {
    this._processSlotMutations(o), this.flush();
  }
  /**
   * @param {Array<MutationRecord>} mutations Mutations signaled by the mutation observer
   * @return {void}
   * @private
   */
  _processSlotMutations(o) {
    if (o)
      for (let t = 0; t < o.length; t++) {
        let e = o[t];
        e.addedNodes && this._listenSlots(e.addedNodes), e.removedNodes && this._unlistenSlots(e.removedNodes);
      }
  }
  /**
   * Flushes the observer causing any pending changes to be immediately
   * delivered the observer callback. By default these changes are delivered
   * asynchronously at the next microtask checkpoint.
   *
   * @return {boolean} Returns true if any pending changes caused the observer
   * callback to run.
   */
  flush() {
    if (!this._connected)
      return !1;
    window.ShadyDOM && ShadyDOM.flush(), this._nativeChildrenObserver ? this._processSlotMutations(this._nativeChildrenObserver.takeRecords()) : this._shadyChildrenObserver && this._processSlotMutations(this._shadyChildrenObserver.takeRecords()), this._scheduled = !1;
    let o = {
      target: this._target,
      addedNodes: [],
      removedNodes: []
    }, t = this.constructor.getFlattenedNodes(this._target), e = Mc(
      t,
      this._effectiveNodes
    );
    for (let r = 0, s; r < e.length && (s = e[r]); r++)
      for (let n = 0, a; n < s.removed.length && (a = s.removed[n]); n++)
        o.removedNodes.push(a);
    for (let r = 0, s; r < e.length && (s = e[r]); r++)
      for (let n = s.index; n < s.index + s.addedCount; n++)
        o.addedNodes.push(t[n]);
    this._effectiveNodes = t;
    let i = !1;
    return (o.addedNodes.length || o.removedNodes.length) && (i = !0, this.callback.call(this._target, o)), i;
  }
  /**
   * @param {!Array<!Node>|!NodeList<!Node>} nodeList Nodes that could change
   * @return {void}
   * @private
   */
  _listenSlots(o) {
    for (let t = 0; t < o.length; t++) {
      let e = o[t];
      Pe(e) && e.addEventListener("slotchange", this._boundSchedule);
    }
  }
  /**
   * @param {!Array<!Node>|!NodeList<!Node>} nodeList Nodes that could change
   * @return {void}
   * @private
   */
  _unlistenSlots(o) {
    for (let t = 0; t < o.length; t++) {
      let e = o[t];
      Pe(e) && e.removeEventListener("slotchange", this._boundSchedule);
    }
  }
};
/**
 * @license
 * Copyright (c) 2021 - 2023 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
function Rc(o) {
  const t = [];
  for (; o; ) {
    if (o.nodeType === Node.DOCUMENT_NODE) {
      t.push(o);
      break;
    }
    if (o.nodeType === Node.DOCUMENT_FRAGMENT_NODE) {
      t.push(o), o = o.host;
      continue;
    }
    if (o.assignedSlot) {
      o = o.assignedSlot;
      continue;
    }
    o = o.parentNode;
  }
  return t;
}
function Mr(o) {
  return o ? new Set(o.split(" ")) : /* @__PURE__ */ new Set();
}
function ci(o) {
  return o ? [...o].join(" ") : "";
}
function hi(o, t, e) {
  const i = Mr(o.getAttribute(t));
  i.add(e), o.setAttribute(t, ci(i));
}
function Rr(o, t, e) {
  const i = Mr(o.getAttribute(t));
  if (i.delete(e), i.size === 0) {
    o.removeAttribute(t);
    return;
  }
  o.setAttribute(t, ci(i));
}
function Fc(o) {
  return o.nodeType === Node.TEXT_NODE && o.textContent.trim() === "";
}
/**
 * @license
 * Copyright (c) 2021 - 2023 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
let Nc = 0;
function Fr() {
  return Nc++;
}
/**
 * @license
 * Copyright (c) 2021 - 2023 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
class X extends EventTarget {
  /**
   * Ensure that every instance has unique ID.
   *
   * @param {HTMLElement} host
   * @param {string} slotName
   * @return {string}
   * @protected
   */
  static generateId(t, e) {
    return `${e || "default"}-${t.localName}-${Fr()}`;
  }
  constructor(t, e, i, r = {}) {
    super();
    const { initializer: s, multiple: n, observe: a, useUniqueId: l } = r;
    this.host = t, this.slotName = e, this.tagName = i, this.observe = typeof a == "boolean" ? a : !0, this.multiple = typeof n == "boolean" ? n : !1, this.slotInitializer = s, n && (this.nodes = []), l && (this.defaultId = this.constructor.generateId(t, e));
  }
  hostConnected() {
    this.initialized || (this.multiple ? this.initMultiple() : this.initSingle(), this.observe && this.observeSlot(), this.initialized = !0);
  }
  /** @protected */
  initSingle() {
    let t = this.getSlotChild();
    t ? (this.node = t, this.initAddedNode(t)) : (t = this.attachDefaultNode(), this.initNode(t));
  }
  /** @protected */
  initMultiple() {
    const t = this.getSlotChildren();
    if (t.length === 0) {
      const e = this.attachDefaultNode();
      this.nodes = [e], this.initNode(e);
    } else
      this.nodes = t, t.forEach((e) => {
        this.initAddedNode(e);
      });
  }
  /**
   * Create and attach default node using the provided tag name, if any.
   * @return {Node | undefined}
   * @protected
   */
  attachDefaultNode() {
    const { host: t, slotName: e, tagName: i } = this;
    let r = this.defaultNode;
    return !r && i && (r = document.createElement(i), r instanceof Element && (e !== "" && r.setAttribute("slot", e), this.node = r, this.defaultNode = r)), r && t.appendChild(r), r;
  }
  /**
   * Return the list of nodes matching the slot managed by the controller.
   * @return {Node}
   */
  getSlotChildren() {
    const { slotName: t } = this;
    return Array.from(this.host.childNodes).filter((e) => e.nodeType === Node.ELEMENT_NODE && e.slot === t || e.nodeType === Node.TEXT_NODE && e.textContent.trim() && t === "");
  }
  /**
   * Return a reference to the node managed by the controller.
   * @return {Node}
   */
  getSlotChild() {
    return this.getSlotChildren()[0];
  }
  /**
   * Run `slotInitializer` for the node managed by the controller.
   *
   * @param {Node} node
   * @protected
   */
  initNode(t) {
    const { slotInitializer: e } = this;
    e && e(t, this.host);
  }
  /**
   * Override to initialize the newly added custom node.
   *
   * @param {Node} _node
   * @protected
   */
  initCustomNode(t) {
  }
  /**
   * Override to teardown slotted node when it's removed.
   *
   * @param {Node} _node
   * @protected
   */
  teardownNode(t) {
  }
  /**
   * Run both `initCustomNode` and `initNode` for a custom slotted node.
   *
   * @param {Node} node
   * @protected
   */
  initAddedNode(t) {
    t !== this.defaultNode && (this.initCustomNode(t), this.initNode(t));
  }
  /**
   * Setup the observer to manage slot content changes.
   * @protected
   */
  observeSlot() {
    const { slotName: t } = this, e = t === "" ? "slot:not([name])" : `slot[name=${t}]`, i = this.host.shadowRoot.querySelector(e);
    this.__slotObserver = new Fe(i, (r) => {
      const s = this.multiple ? this.nodes : [this.node], n = r.addedNodes.filter((a) => !Fc(a) && !s.includes(a));
      r.removedNodes.length && r.removedNodes.forEach((a) => {
        this.teardownNode(a);
      }), n && n.length > 0 && (this.multiple ? (this.defaultNode && this.defaultNode.remove(), this.nodes = [...s, ...n].filter((a) => a !== this.defaultNode), n.forEach((a) => {
        this.initAddedNode(a);
      })) : (this.node && this.node.remove(), this.node = n[0], this.initAddedNode(this.node)));
    });
  }
}
/**
 * @license
 * Copyright (c) 2022 - 2023 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
class ue extends X {
  constructor(t) {
    super(t, "tooltip"), this.setTarget(t);
  }
  /**
   * Override to initialize the newly added custom tooltip.
   *
   * @param {Node} tooltipNode
   * @protected
   * @override
   */
  initCustomNode(t) {
    t.target = this.target, this.context !== void 0 && (t.context = this.context), this.manual !== void 0 && (t.manual = this.manual), this.opened !== void 0 && (t.opened = this.opened), this.position !== void 0 && (t._position = this.position), this.shouldShow !== void 0 && (t.shouldShow = this.shouldShow);
  }
  /**
   * Set a context object to be used by generator.
   * @param {object} context
   */
  setContext(t) {
    this.context = t;
    const e = this.node;
    e && (e.context = t);
  }
  /**
   * Toggle manual state on the slotted tooltip.
   * @param {boolean} manual
   */
  setManual(t) {
    this.manual = t;
    const e = this.node;
    e && (e.manual = t);
  }
  /**
   * Toggle opened state on the slotted tooltip.
   * @param {boolean} opened
   */
  setOpened(t) {
    this.opened = t;
    const e = this.node;
    e && (e.opened = t);
  }
  /**
   * Set default position for the slotted tooltip.
   * This can be overridden by setting the position
   * using corresponding property or attribute.
   * @param {string} position
   */
  setPosition(t) {
    this.position = t;
    const e = this.node;
    e && (e._position = t);
  }
  /**
   * Set function used to detect whether to show
   * the tooltip based on a condition.
   * @param {Function} shouldShow
   */
  setShouldShow(t) {
    this.shouldShow = t;
    const e = this.node;
    e && (e.shouldShow = t);
  }
  /**
   * Set an HTML element to attach the tooltip to.
   * @param {HTMLElement} target
   */
  setTarget(t) {
    this.target = t;
    const e = this.node;
    e && (e.target = t);
  }
}
/**
 * @license
 * Copyright (c) 2017 - 2023 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
const Lc = _`
  :host {
    display: inline-block;
    position: relative;
    outline: none;
    white-space: nowrap;
    -webkit-user-select: none;
    -moz-user-select: none;
    user-select: none;
  }

  :host([hidden]) {
    display: none !important;
  }

  /* Aligns the button with form fields when placed on the same line.
  Note, to make it work, the form fields should have the same "::before" pseudo-element. */
  .vaadin-button-container::before {
    content: '\\2003';
    display: inline-block;
    width: 0;
    max-height: 100%;
  }

  .vaadin-button-container {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    text-align: center;
    width: 100%;
    height: 100%;
    min-height: inherit;
    text-shadow: inherit;
  }

  [part='prefix'],
  [part='suffix'] {
    flex: none;
  }

  [part='label'] {
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  @media (forced-colors: active) {
    :host {
      outline: 1px solid;
      outline-offset: -1px;
    }

    :host([focused]) {
      outline-width: 2px;
    }

    :host([disabled]) {
      outline-color: GrayText;
    }
  }
`, Bc = (o) => o`
  <div class="vaadin-button-container">
    <span part="prefix" aria-hidden="true">
      <slot name="prefix"></slot>
    </span>
    <span part="label">
      <slot></slot>
    </span>
    <span part="suffix" aria-hidden="true">
      <slot name="suffix"></slot>
    </span>
  </div>
  <slot name="tooltip"></slot>
`;
/**
@license
Copyright (c) 2017 The Polymer Project Authors. All rights reserved.
This code may only be used under the BSD style license found at http://polymer.github.io/LICENSE.txt
The complete set of authors may be found at http://polymer.github.io/AUTHORS.txt
The complete set of contributors may be found at http://polymer.github.io/CONTRIBUTORS.txt
Code distributed by Google as part of the polymer project is also
subject to an additional IP rights grant found at http://polymer.github.io/PATENTS.txt
*/
const Hc = !1, Vc = (o) => o, Nr = typeof document.head.style.touchAction == "string", ur = "__polymerGestures", Mi = "__polymerGesturesHandled", pr = "__polymerGesturesTouchAction", Ho = 25, Vo = 5, Uc = 2, qc = ["mousedown", "mousemove", "mouseup", "click"], Wc = [0, 1, 4, 2], Gc = function() {
  try {
    return new MouseEvent("test", { buttons: 1 }).buttons === 1;
  } catch {
    return !1;
  }
}();
function Lr(o) {
  return qc.indexOf(o) > -1;
}
let qn = !1;
(function() {
  try {
    const o = Object.defineProperty({}, "passive", {
      // eslint-disable-next-line getter-return
      get() {
        qn = !0;
      }
    });
    window.addEventListener("test", null, o), window.removeEventListener("test", null, o);
  } catch {
  }
})();
function jc(o) {
  if (!(Lr(o) || o === "touchend") && Nr && qn && Hc)
    return { passive: !0 };
}
const Yc = navigator.userAgent.match(/iP(?:[oa]d|hone)|Android/u), Kc = {
  button: !0,
  command: !0,
  fieldset: !0,
  input: !0,
  keygen: !0,
  optgroup: !0,
  option: !0,
  select: !0,
  textarea: !0
};
function ye(o) {
  const t = o.type;
  if (!Lr(t))
    return !1;
  if (t === "mousemove") {
    let i = o.buttons === void 0 ? 1 : o.buttons;
    return o instanceof window.MouseEvent && !Gc && (i = Wc[o.which] || 0), !!(i & 1);
  }
  return (o.button === void 0 ? 0 : o.button) === 0;
}
function Qc(o) {
  if (o.type === "click") {
    if (o.detail === 0)
      return !0;
    const t = ae(o);
    if (!t.nodeType || /** @type {Element} */
    t.nodeType !== Node.ELEMENT_NODE)
      return !0;
    const e = (
      /** @type {Element} */
      t.getBoundingClientRect()
    ), i = o.pageX, r = o.pageY;
    return !(i >= e.left && i <= e.right && r >= e.top && r <= e.bottom);
  }
  return !1;
}
const Z = {
  mouse: {
    target: null,
    mouseIgnoreJob: null
  },
  touch: {
    x: 0,
    y: 0,
    id: -1,
    scrollDecided: !1
  }
};
function Zc(o) {
  let t = "auto";
  const e = Gn(o);
  for (let i = 0, r; i < e.length; i++)
    if (r = e[i], r[pr]) {
      t = r[pr];
      break;
    }
  return t;
}
function Wn(o, t, e) {
  o.movefn = t, o.upfn = e, document.addEventListener("mousemove", t), document.addEventListener("mouseup", e);
}
function Ne(o) {
  document.removeEventListener("mousemove", o.movefn), document.removeEventListener("mouseup", o.upfn), o.movefn = null, o.upfn = null;
}
const Gn = window.ShadyDOM && window.ShadyDOM.noPatch ? window.ShadyDOM.composedPath : (o) => o.composedPath && o.composedPath() || [], Br = {}, ve = [];
function Xc(o, t) {
  let e = document.elementFromPoint(o, t), i = e;
  for (; i && i.shadowRoot && !window.ShadyDOM; ) {
    const r = i;
    if (i = i.shadowRoot.elementFromPoint(o, t), r === i)
      break;
    i && (e = i);
  }
  return e;
}
function ae(o) {
  const t = Gn(
    /** @type {?Event} */
    o
  );
  return t.length > 0 ? t[0] : o.target;
}
function Jc(o) {
  const t = o.type, i = o.currentTarget[ur];
  if (!i)
    return;
  const r = i[t];
  if (!r)
    return;
  if (!o[Mi] && (o[Mi] = {}, t.startsWith("touch"))) {
    const n = o.changedTouches[0];
    if (t === "touchstart" && o.touches.length === 1 && (Z.touch.id = n.identifier), Z.touch.id !== n.identifier)
      return;
    Nr || (t === "touchstart" || t === "touchmove") && eh(o);
  }
  const s = o[Mi];
  if (!s.skip) {
    for (let n = 0, a; n < ve.length; n++)
      a = ve[n], r[a.name] && !s[a.name] && a.flow && a.flow.start.indexOf(o.type) > -1 && a.reset && a.reset();
    for (let n = 0, a; n < ve.length; n++)
      a = ve[n], r[a.name] && !s[a.name] && (s[a.name] = !0, a[t](o));
  }
}
function eh(o) {
  const t = o.changedTouches[0], e = o.type;
  if (e === "touchstart")
    Z.touch.x = t.clientX, Z.touch.y = t.clientY, Z.touch.scrollDecided = !1;
  else if (e === "touchmove") {
    if (Z.touch.scrollDecided)
      return;
    Z.touch.scrollDecided = !0;
    const i = Zc(o);
    let r = !1;
    const s = Math.abs(Z.touch.x - t.clientX), n = Math.abs(Z.touch.y - t.clientY);
    o.cancelable && (i === "none" ? r = !0 : i === "pan-x" ? r = n > s : i === "pan-y" && (r = s > n)), r ? o.preventDefault() : ei("track");
  }
}
function V(o, t, e) {
  return Br[t] ? (th(o, t, e), !0) : !1;
}
function th(o, t, e) {
  const i = Br[t], r = i.deps, s = i.name;
  let n = o[ur];
  n || (o[ur] = n = {});
  for (let a = 0, l, d; a < r.length; a++)
    l = r[a], !(Yc && Lr(l) && l !== "click") && (d = n[l], d || (n[l] = d = { _count: 0 }), d._count === 0 && o.addEventListener(l, Jc, jc(l)), d[s] = (d[s] || 0) + 1, d._count = (d._count || 0) + 1);
  o.addEventListener(t, e), i.touchAction && jn(o, i.touchAction);
}
function Hr(o) {
  ve.push(o), o.emits.forEach((t) => {
    Br[t] = o;
  });
}
function ih(o) {
  for (let t = 0, e; t < ve.length; t++) {
    e = ve[t];
    for (let i = 0, r; i < e.emits.length; i++)
      if (r = e.emits[i], r === o)
        return e;
  }
  return null;
}
function jn(o, t) {
  Nr && o instanceof HTMLElement && de.run(() => {
    o.style.touchAction = t;
  }), o[pr] = t;
}
function Vr(o, t, e) {
  const i = new Event(t, { bubbles: !0, cancelable: !0, composed: !0 });
  if (i.detail = e, Vc(
    /** @type {!Node} */
    o
  ).dispatchEvent(i), i.defaultPrevented) {
    const r = e.preventer || e.sourceEvent;
    r && r.preventDefault && r.preventDefault();
  }
}
function ei(o) {
  const t = ih(o);
  t.info && (t.info.prevent = !0);
}
Hr({
  name: "downup",
  deps: ["mousedown", "touchstart", "touchend"],
  flow: {
    start: ["mousedown", "touchstart"],
    end: ["mouseup", "touchend"]
  },
  emits: ["down", "up"],
  info: {
    movefn: null,
    upfn: null
  },
  /**
   * @this {GestureRecognizer}
   * @return {void}
   */
  reset() {
    Ne(this.info);
  },
  /**
   * @this {GestureRecognizer}
   * @param {MouseEvent} e
   * @return {void}
   */
  mousedown(o) {
    if (!ye(o))
      return;
    const t = ae(o), e = this, i = (s) => {
      ye(s) || (Je("up", t, s), Ne(e.info));
    }, r = (s) => {
      ye(s) && Je("up", t, s), Ne(e.info);
    };
    Wn(this.info, i, r), Je("down", t, o);
  },
  /**
   * @this {GestureRecognizer}
   * @param {TouchEvent} e
   * @return {void}
   */
  touchstart(o) {
    Je("down", ae(o), o.changedTouches[0], o);
  },
  /**
   * @this {GestureRecognizer}
   * @param {TouchEvent} e
   * @return {void}
   */
  touchend(o) {
    Je("up", ae(o), o.changedTouches[0], o);
  }
});
function Je(o, t, e, i) {
  t && Vr(t, o, {
    x: e.clientX,
    y: e.clientY,
    sourceEvent: e,
    preventer: i,
    prevent(r) {
      return ei(r);
    }
  });
}
Hr({
  name: "track",
  touchAction: "none",
  deps: ["mousedown", "touchstart", "touchmove", "touchend"],
  flow: {
    start: ["mousedown", "touchstart"],
    end: ["mouseup", "touchend"]
  },
  emits: ["track"],
  info: {
    x: 0,
    y: 0,
    state: "start",
    started: !1,
    moves: [],
    /** @this {GestureInfo} */
    addMove(o) {
      this.moves.length > Uc && this.moves.shift(), this.moves.push(o);
    },
    movefn: null,
    upfn: null,
    prevent: !1
  },
  /**
   * @this {GestureRecognizer}
   * @return {void}
   */
  reset() {
    this.info.state = "start", this.info.started = !1, this.info.moves = [], this.info.x = 0, this.info.y = 0, this.info.prevent = !1, Ne(this.info);
  },
  /**
   * @this {GestureRecognizer}
   * @param {MouseEvent} e
   * @return {void}
   */
  mousedown(o) {
    if (!ye(o))
      return;
    const t = ae(o), e = this, i = (s) => {
      const n = s.clientX, a = s.clientY;
      Uo(e.info, n, a) && (e.info.state = e.info.started ? s.type === "mouseup" ? "end" : "track" : "start", e.info.state === "start" && ei("tap"), e.info.addMove({ x: n, y: a }), ye(s) || (e.info.state = "end", Ne(e.info)), t && Ri(e.info, t, s), e.info.started = !0);
    }, r = (s) => {
      e.info.started && i(s), Ne(e.info);
    };
    Wn(this.info, i, r), this.info.x = o.clientX, this.info.y = o.clientY;
  },
  /**
   * @this {GestureRecognizer}
   * @param {TouchEvent} e
   * @return {void}
   */
  touchstart(o) {
    const t = o.changedTouches[0];
    this.info.x = t.clientX, this.info.y = t.clientY;
  },
  /**
   * @this {GestureRecognizer}
   * @param {TouchEvent} e
   * @return {void}
   */
  touchmove(o) {
    const t = ae(o), e = o.changedTouches[0], i = e.clientX, r = e.clientY;
    Uo(this.info, i, r) && (this.info.state === "start" && ei("tap"), this.info.addMove({ x: i, y: r }), Ri(this.info, t, e), this.info.state = "track", this.info.started = !0);
  },
  /**
   * @this {GestureRecognizer}
   * @param {TouchEvent} e
   * @return {void}
   */
  touchend(o) {
    const t = ae(o), e = o.changedTouches[0];
    this.info.started && (this.info.state = "end", this.info.addMove({ x: e.clientX, y: e.clientY }), Ri(this.info, t, e));
  }
});
function Uo(o, t, e) {
  if (o.prevent)
    return !1;
  if (o.started)
    return !0;
  const i = Math.abs(o.x - t), r = Math.abs(o.y - e);
  return i >= Vo || r >= Vo;
}
function Ri(o, t, e) {
  if (!t)
    return;
  const i = o.moves[o.moves.length - 2], r = o.moves[o.moves.length - 1], s = r.x - o.x, n = r.y - o.y;
  let a, l = 0;
  i && (a = r.x - i.x, l = r.y - i.y), Vr(t, "track", {
    state: o.state,
    x: e.clientX,
    y: e.clientY,
    dx: s,
    dy: n,
    ddx: a,
    ddy: l,
    sourceEvent: e,
    hover() {
      return Xc(e.clientX, e.clientY);
    }
  });
}
Hr({
  name: "tap",
  deps: ["mousedown", "click", "touchstart", "touchend"],
  flow: {
    start: ["mousedown", "touchstart"],
    end: ["click", "touchend"]
  },
  emits: ["tap"],
  info: {
    x: NaN,
    y: NaN,
    prevent: !1
  },
  /**
   * @this {GestureRecognizer}
   * @return {void}
   */
  reset() {
    this.info.x = NaN, this.info.y = NaN, this.info.prevent = !1;
  },
  /**
   * @this {GestureRecognizer}
   * @param {MouseEvent} e
   * @return {void}
   */
  mousedown(o) {
    ye(o) && (this.info.x = o.clientX, this.info.y = o.clientY);
  },
  /**
   * @this {GestureRecognizer}
   * @param {MouseEvent} e
   * @return {void}
   */
  click(o) {
    ye(o) && qo(this.info, o);
  },
  /**
   * @this {GestureRecognizer}
   * @param {TouchEvent} e
   * @return {void}
   */
  touchstart(o) {
    const t = o.changedTouches[0];
    this.info.x = t.clientX, this.info.y = t.clientY;
  },
  /**
   * @this {GestureRecognizer}
   * @param {TouchEvent} e
   * @return {void}
   */
  touchend(o) {
    qo(this.info, o.changedTouches[0], o);
  }
});
function qo(o, t, e) {
  const i = Math.abs(t.clientX - o.x), r = Math.abs(t.clientY - o.y), s = ae(e || t);
  !s || Kc[
    /** @type {!HTMLElement} */
    s.localName
  ] && s.hasAttribute("disabled") || (isNaN(i) || isNaN(r) || i <= Ho && r <= Ho || Qc(t)) && (o.prevent || Vr(s, "tap", {
    x: t.clientX,
    y: t.clientY,
    sourceEvent: t,
    preventer: e
  }));
}
/**
 * @license
 * Copyright (c) 2021 - 2023 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
const kt = I(
  (o) => class extends o {
    static get properties() {
      return {
        /**
         * If true, the user cannot interact with this element.
         */
        disabled: {
          type: Boolean,
          value: !1,
          observer: "_disabledChanged",
          reflectToAttribute: !0
        }
      };
    }
    /**
     * @param {boolean} disabled
     * @protected
     */
    _disabledChanged(e) {
      this._setAriaDisabled(e);
    }
    /**
     * @param {boolean} disabled
     * @protected
     */
    _setAriaDisabled(e) {
      e ? this.setAttribute("aria-disabled", "true") : this.removeAttribute("aria-disabled");
    }
    /**
     * Overrides the default element `click` method in order to prevent
     * firing the `click` event when the element is disabled.
     * @protected
     * @override
     */
    click() {
      this.disabled || super.click();
    }
  }
);
/**
 * @license
 * Copyright (c) 2021 - 2023 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
const Et = I(
  (o) => class extends o {
    /** @protected */
    ready() {
      super.ready(), this.addEventListener("keydown", (e) => {
        this._onKeyDown(e);
      }), this.addEventListener("keyup", (e) => {
        this._onKeyUp(e);
      });
    }
    /**
     * A handler for the `keydown` event. By default, it calls
     * separate methods for handling "Enter" and "Escape" keys.
     * Override the method to implement your own behavior.
     *
     * @param {KeyboardEvent} event
     * @protected
     */
    _onKeyDown(e) {
      switch (e.key) {
        case "Enter":
          this._onEnter(e);
          break;
        case "Escape":
          this._onEscape(e);
          break;
      }
    }
    /**
     * A handler for the `keyup` event. By default, it does nothing.
     * Override the method to implement your own behavior.
     *
     * @param {KeyboardEvent} _event
     * @protected
     */
    _onKeyUp(e) {
    }
    /**
     * A handler for the "Enter" key. By default, it does nothing.
     * Override the method to implement your own behavior.
     *
     * @param {KeyboardEvent} _event
     * @protected
     */
    _onEnter(e) {
    }
    /**
     * A handler for the "Escape" key. By default, it does nothing.
     * Override the method to implement your own behavior.
     *
     * @param {KeyboardEvent} _event
     * @protected
     */
    _onEscape(e) {
    }
  }
);
/**
 * @license
 * Copyright (c) 2021 - 2023 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
const Yn = (o) => class extends kt(Et(o)) {
  /**
   * An array of activation keys.
   *
   * See possible values here:
   * https://developer.mozilla.org/ru/docs/Web/API/KeyboardEvent/key/Key_Values
   *
   * @protected
   * @return {!Array<!string>}
   */
  get _activeKeys() {
    return [" "];
  }
  /** @protected */
  ready() {
    super.ready(), V(this, "down", (e) => {
      this._shouldSetActive(e) && this._setActive(!0);
    }), V(this, "up", () => {
      this._setActive(!1);
    });
  }
  /** @protected */
  disconnectedCallback() {
    super.disconnectedCallback(), this._setActive(!1);
  }
  /**
   * @param {KeyboardEvent | MouseEvent} _event
   * @protected
   */
  _shouldSetActive(e) {
    return !this.disabled;
  }
  /**
   * Sets the `active` attribute on the element if an activation key is pressed.
   *
   * @param {KeyboardEvent} event
   * @protected
   * @override
   */
  _onKeyDown(e) {
    super._onKeyDown(e), this._shouldSetActive(e) && this._activeKeys.includes(e.key) && (this._setActive(!0), document.addEventListener(
      "keyup",
      (i) => {
        this._activeKeys.includes(i.key) && this._setActive(!1);
      },
      { once: !0 }
    ));
  }
  /**
   * Toggles the `active` attribute on the element.
   *
   * @param {boolean} active
   * @protected
   */
  _setActive(e) {
    this.toggleAttribute("active", e);
  }
};
/**
 * @license
 * Copyright (c) 2021 - 2023 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
const ui = I(
  (o) => class extends o {
    /**
     * @protected
     * @return {boolean}
     */
    get _keyboardActive() {
      return $n();
    }
    /** @protected */
    ready() {
      this.addEventListener("focusin", (e) => {
        this._shouldSetFocus(e) && this._setFocused(!0);
      }), this.addEventListener("focusout", (e) => {
        this._shouldRemoveFocus(e) && this._setFocused(!1);
      }), super.ready();
    }
    /** @protected */
    disconnectedCallback() {
      super.disconnectedCallback(), this.hasAttribute("focused") && this._setFocused(!1);
    }
    /**
     * Override to change how focused and focus-ring attributes are set.
     *
     * @param {boolean} focused
     * @protected
     */
    _setFocused(e) {
      this.toggleAttribute("focused", e), this.toggleAttribute("focus-ring", e && this._keyboardActive);
    }
    /**
     * Override to define if the field receives focus based on the event.
     *
     * @param {FocusEvent} _event
     * @return {boolean}
     * @protected
     */
    _shouldSetFocus(e) {
      return !0;
    }
    /**
     * Override to define if the field loses focus based on the event.
     *
     * @param {FocusEvent} _event
     * @return {boolean}
     * @protected
     */
    _shouldRemoveFocus(e) {
      return !0;
    }
  }
);
/**
 * @license
 * Copyright (c) 2021 - 2023 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
const Ur = (o) => class extends kt(o) {
  static get properties() {
    return {
      /**
       * Indicates whether the element can be focused and where it participates in sequential keyboard navigation.
       *
       * @protected
       */
      tabindex: {
        type: Number,
        reflectToAttribute: !0,
        observer: "_tabindexChanged"
      },
      /**
       * Stores the last known tabindex since the element has been disabled.
       *
       * @protected
       */
      _lastTabIndex: {
        type: Number
      }
    };
  }
  /**
   * When the element gets disabled, the observer saves the last known tabindex
   * and makes the element not focusable by setting tabindex to -1.
   * As soon as the element gets enabled, the observer restores the last known tabindex
   * so that the element can be focusable again.
   *
   * @protected
   * @override
   */
  _disabledChanged(e, i) {
    super._disabledChanged(e, i), e ? (this.tabindex !== void 0 && (this._lastTabIndex = this.tabindex), this.tabindex = -1) : i && (this.tabindex = this._lastTabIndex);
  }
  /**
   * When the user has changed tabindex while the element is disabled,
   * the observer reverts tabindex to -1 and rather saves the new tabindex value to apply it later.
   * The new value will be applied as soon as the element becomes enabled.
   *
   * @protected
   */
  _tabindexChanged(e) {
    this.disabled && e !== -1 && (this._lastTabIndex = e, this.tabindex = -1);
  }
};
/**
 * @license
 * Copyright (c) 2017 - 2023 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
const rh = (o) => class extends Yn(Ur(ui(o))) {
  static get properties() {
    return {
      /**
       * Indicates whether the element can be focused and where it participates in sequential keyboard navigation.
       *
       * @override
       * @protected
       */
      tabindex: {
        type: Number,
        value: 0,
        reflectToAttribute: !0
      }
    };
  }
  /**
   * By default, `Space` is the only possible activation key for a focusable HTML element.
   * Nonetheless, the button is an exception as it can be also activated by pressing `Enter`.
   * See the "Keyboard Support" section in https://www.w3.org/TR/wai-aria-practices/examples/button/button.html.
   *
   * @protected
   * @override
   */
  get _activeKeys() {
    return ["Enter", " "];
  }
  /** @protected */
  ready() {
    super.ready(), this.hasAttribute("role") || this.setAttribute("role", "button");
  }
  /**
   * Since the button component is designed on the base of the `[role=button]` attribute,
   * and doesn't have a native <button> inside, in order to be fully accessible from the keyboard,
   * it should manually fire the `click` event once an activation key is pressed,
   * as it follows from the WAI-ARIA specifications:
   * https://www.w3.org/TR/wai-aria-practices-1.1/#button
   *
   * According to the UI Events specifications,
   * the `click` event should be fired exactly on `keydown`:
   * https://www.w3.org/TR/uievents/#event-type-keydown
   *
   * @param {KeyboardEvent} event
   * @protected
   * @override
   */
  _onKeyDown(e) {
    super._onKeyDown(e), this._activeKeys.includes(e.key) && (e.preventDefault(), this.click());
  }
};
/**
 * @license
 * Copyright (c) 2017 - 2023 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
m("vaadin-button", Lc, { moduleId: "vaadin-button-styles" });
class Wo extends rh(he(O(ie(A)))) {
  static get is() {
    return "vaadin-button";
  }
  static get template() {
    return Bc(k);
  }
  /** @protected */
  ready() {
    super.ready(), this._tooltipController = new ue(this), this.addController(this._tooltipController);
  }
}
customElements.define(Wo.is, Wo);
m(
  "vaadin-date-picker-year",
  _`
    :host([current]) [part='year-number'] {
      color: var(--lumo-primary-text-color);
    }

    :host(:not([current])) [part='year-number'],
    [part='year-separator'] {
      opacity: var(--_lumo-date-picker-year-opacity, 0.7);
      transition: 0.2s opacity;
    }

    [part='year-number'],
    [part='year-separator'] {
      display: flex;
      align-items: center;
      justify-content: center;
      height: 50%;
      transform: translateY(-50%);
    }

    [part='year-separator']::after {
      color: var(--lumo-disabled-text-color);
      content: '\\2022';
    }
  `,
  { moduleId: "lumo-date-picker-year" }
);
m(
  "vaadin-date-picker-overlay-content",
  _`
    :host {
      position: relative;
      /* Background for the year scroller, placed here as we are using a mask image on the actual years part */
      background-image: linear-gradient(var(--lumo-shade-5pct), var(--lumo-shade-5pct));
      background-size: 57px 100%;
      background-position: top right;
      background-repeat: no-repeat;
      cursor: default;
    }

    ::slotted([slot='months']) {
      /* Month calendar height:
              header height + margin-bottom
            + weekdays height + margin-bottom
            + date cell heights
            + small margin between month calendars
        */
      /* prettier-ignore */
      --vaadin-infinite-scroller-item-height:
          calc(
              var(--lumo-font-size-l) + var(--lumo-space-m)
            + var(--lumo-font-size-xs) + var(--lumo-space-s)
            + var(--lumo-size-m) * 6
            + var(--lumo-space-s)
          );
      --vaadin-infinite-scroller-buffer-offset: 10%;
      -webkit-mask-image: linear-gradient(transparent, #000 10%, #000 85%, transparent);
      mask-image: linear-gradient(transparent, #000 10%, #000 85%, transparent);
      position: relative;
      margin-right: 57px;
    }

    ::slotted([slot='years']) {
      /* TODO get rid of fixed magic number */
      --vaadin-infinite-scroller-buffer-width: 97px;
      width: 57px;
      height: auto;
      top: 0;
      bottom: 0;
      font-size: var(--lumo-font-size-s);
      box-shadow: inset 2px 0 4px 0 var(--lumo-shade-5pct);
      -webkit-mask-image: linear-gradient(transparent, #000 35%, #000 65%, transparent);
      mask-image: linear-gradient(transparent, #000 35%, #000 65%, transparent);
      cursor: var(--lumo-clickable-cursor);
    }

    ::slotted([slot='years']:hover) {
      --_lumo-date-picker-year-opacity: 1;
    }

    /* TODO unsupported selector */
    #scrollers {
      position: static;
      display: block;
    }

    /* TODO fix this in vaadin-date-picker that it adapts to the width of the year scroller */
    :host([desktop]) ::slotted([slot='months']) {
      right: auto;
    }

    /* Year scroller position indicator */
    ::slotted([slot='years'])::before {
      border: none;
      width: 1em;
      height: 1em;
      background-color: var(--lumo-base-color);
      background-image: linear-gradient(var(--lumo-tint-5pct), var(--lumo-tint-5pct));
      transform: translate(-75%, -50%) rotate(45deg);
      border-top-right-radius: var(--lumo-border-radius-s);
      box-shadow: 2px -2px 6px 0 var(--lumo-shade-5pct);
      z-index: 1;
    }

    [part='toolbar'] {
      padding: var(--lumo-space-s);
      border-bottom-left-radius: var(--lumo-border-radius-l);
      margin-right: 57px;
    }

    [part='toolbar'] ::slotted(vaadin-button) {
      margin: 0;
    }

    /* Narrow viewport mode (fullscreen) */

    :host([fullscreen]) [part='toolbar'] {
      order: -1;
      background-color: var(--lumo-base-color);
    }

    :host([fullscreen]) [part='overlay-header'] {
      order: -2;
      height: var(--lumo-size-m);
      padding: var(--lumo-space-s);
      position: absolute;
      left: 0;
      right: 0;
      justify-content: center;
    }

    :host([fullscreen]) [part='toggle-button'],
    :host([fullscreen]) [part='clear-button'],
    [part='overlay-header'] [part='label'] {
      display: none;
    }

    /* Very narrow screen (year scroller initially hidden) */

    [part='years-toggle-button'] {
      display: flex;
      align-items: center;
      height: var(--lumo-size-s);
      padding: 0 0.5em;
      border-radius: var(--lumo-border-radius-m);
      z-index: 3;
      color: var(--lumo-primary-text-color);
      font-weight: 500;
      -webkit-font-smoothing: antialiased;
      -moz-osx-font-smoothing: grayscale;
    }

    :host([years-visible]) [part='years-toggle-button'] {
      background-color: var(--lumo-primary-color);
      color: var(--lumo-primary-contrast-color);
    }

    /* TODO magic number (same as used for media-query in vaadin-date-picker-overlay-content) */
    @media screen and (max-width: 374px) {
      :host {
        background-image: none;
      }

      [part='toolbar'],
      ::slotted([slot='months']) {
        margin-right: 0;
      }

      /* TODO make date-picker adapt to the width of the years part */
      ::slotted([slot='years']) {
        --vaadin-infinite-scroller-buffer-width: 90px;
        width: 50px;
        background-color: var(--lumo-shade-5pct);
      }

      :host([years-visible]) ::slotted([slot='months']) {
        padding-left: 50px;
      }
    }
  `,
  { moduleId: "lumo-date-picker-overlay-content" }
);
m(
  "vaadin-month-calendar",
  _`
    :host {
      -moz-user-select: none;
      -webkit-user-select: none;
      -webkit-tap-highlight-color: transparent;
      user-select: none;
      font-size: var(--lumo-font-size-m);
      color: var(--lumo-body-text-color);
      text-align: center;
      padding: 0 var(--lumo-space-xs);
    }

    /* Month header */

    [part='month-header'] {
      color: var(--lumo-header-text-color);
      font-size: var(--lumo-font-size-l);
      line-height: 1;
      font-weight: 500;
      margin-bottom: var(--lumo-space-m);
    }

    /* Week days and numbers */

    [part='weekdays'],
    [part='weekday'],
    [part='week-number'] {
      font-size: var(--lumo-font-size-xxs);
      line-height: 1;
      color: var(--lumo-secondary-text-color);
    }

    [part='weekdays'] {
      margin-bottom: var(--lumo-space-s);
    }

    [part='weekday']:empty,
    [part='week-number'] {
      width: var(--lumo-size-xs);
    }

    /* Date and week number cells */

    [part~='date'],
    [part='week-number'] {
      box-sizing: border-box;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      height: var(--lumo-size-m);
      position: relative;
    }

    [part~='date'] {
      transition: color 0.1s;
    }

    [part~='date']:not(:empty) {
      cursor: var(--lumo-clickable-cursor);
    }

    :host([week-numbers]) [part='weekday']:not(:empty),
    :host([week-numbers]) [part~='date'] {
      width: calc((100% - var(--lumo-size-xs)) / 7);
    }

    /* Today date */

    [part~='date'][part~='today'] {
      color: var(--lumo-primary-text-color);
    }

    /* Focused date */

    [part~='date']::before {
      content: '';
      position: absolute;
      z-index: -1;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      min-width: 2em;
      min-height: 2em;
      width: 80%;
      height: 80%;
      max-height: 100%;
      max-width: 100%;
      border-radius: var(--lumo-border-radius-m);
    }

    [part~='date'][part~='focused']::before {
      box-shadow: 0 0 0 1px var(--lumo-base-color), 0 0 0 3px var(--lumo-primary-color-50pct);
    }

    :host(:not([focused])) [part~='date'][part~='focused']::before {
      animation: vaadin-date-picker-month-calendar-focus-date 1.4s infinite;
    }

    @keyframes vaadin-date-picker-month-calendar-focus-date {
      50% {
        box-shadow: 0 0 0 1px var(--lumo-base-color), 0 0 0 3px transparent;
      }
    }

    [part~='date']:not(:empty):not([part~='disabled']):not([part~='selected']):hover::before {
      background-color: var(--lumo-primary-color-10pct);
    }

    [part~='date'][part~='selected'] {
      color: var(--lumo-primary-contrast-color);
    }

    [part~='date'][part~='selected']::before {
      background-color: var(--lumo-primary-color);
    }

    [part~='date'][part~='disabled'] {
      color: var(--lumo-disabled-text-color);
    }

    @media (pointer: coarse) {
      [part~='date']:hover:not([part~='selected'])::before,
      [part~='focused']:not([part~='selected'])::before {
        display: none;
      }

      [part~='date']:not(:empty):not([part~='disabled']):active::before {
        display: block;
      }

      [part~='date'][part~='selected']::before {
        box-shadow: none;
      }
    }

    /* Disabled */

    :host([disabled]) * {
      color: var(--lumo-disabled-text-color) !important;
    }
  `,
  { moduleId: "lumo-month-calendar" }
);
const Kn = document.createElement("template");
Kn.innerHTML = `
  <style>
    @keyframes vaadin-date-picker-month-calendar-focus-date {
      50% {
        box-shadow: 0 0 0 2px transparent;
      }
    }
  </style>
`;
document.head.appendChild(Kn.content);
/**
 * @license
 * Copyright (c) 2017 - 2023 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
const oh = _`
  @font-face {
    font-family: 'lumo-icons';
    src: url(data:application/font-woff;charset=utf-8;base64,d09GRgABAAAAABEgAAsAAAAAIjQAAQAAAAAAAAAAAAAAAAAAAAAAAAAAAABHU1VCAAABCAAAADsAAABUIIslek9TLzIAAAFEAAAAQwAAAFZAIUuKY21hcAAAAYgAAAD4AAADrsCU8d5nbHlmAAACgAAAC2cAABeAWri7U2hlYWQAAA3oAAAAMAAAADZa/6SsaGhlYQAADhgAAAAdAAAAJAbpA35obXR4AAAOOAAAABAAAACspBAAAGxvY2EAAA5IAAAAWAAAAFh57oA4bWF4cAAADqAAAAAfAAAAIAFKAXBuYW1lAAAOwAAAATEAAAIuUUJZCHBvc3QAAA/0AAABKwAAAelm8SzVeJxjYGRgYOBiMGCwY2BycfMJYeDLSSzJY5BiYGGAAJA8MpsxJzM9kYEDxgPKsYBpDiBmg4gCACY7BUgAeJxjYGS+yDiBgZWBgamKaQ8DA0MPhGZ8wGDIyAQUZWBlZsAKAtJcUxgcXjG+0mIO+p/FEMUcxDANKMwIkgMABn8MLQB4nO3SWW6DMABF0UtwCEnIPM/zhLK8LqhfXRybSP14XUYtHV9hGYQwQBNIo3cUIPkhQeM7rib1ekqnXg981XuC1qvy84lzojleh3puxL0hPjGjRU473teloEefAUNGjJkwZcacBUtWrNmwZceeA0dOnLlw5cadB09elPGhGf+j0NTI/65KfXerT6JhqKnpRKtgOpuqaTrtKjPUlqHmhto21I7pL6i6hlqY3q7qGWrfUAeGOjTUkaGODXViqFNDnRnq3FAXhro01JWhrg11Y6hbQ90Z6t5QD4Z6NNSToZ4N9WKoV0O9GerdUB+G+jTUl6GWRvkL24BkEXictVh9bFvVFb/nxvbz+7Rf/N6zHcd2bCfP+Wic1Z9N0jpNHCD9SNqqoVBgbQoMjY+pjA4hNnWa2pV1rHSIif0DGkyT2k10Kmu1Cag6huj4ZpqYBHSqJsTEJgZCG3TaVBFv595nO3ZIv4RIrPPuvefe884599zzO/cRF8G/tgn6CFFImNgkR0ggX8wlspbhSSWSdrC5ozd30s2dw5afzvgtyz9/zG9t1hV4RtF1pXolowvtzc2z6L2aYUQM45jKH9WDTvd1LRDoDASYWhfTzTyvboXz6uZX4ARX5wrF39y+HM2+CJ8d0pkyqBIqoze3D12ez4DrFoYzxI8dWwMrDlZ2DMqQAR9AROsJU+2smlTPaTTco52BVxXa2a2+I8vvqd2dVHm1LoPeTn/AZPRYGthDYOeZjBjKoFsVGulR3lGU95SeCK44oHU7MhWUGUKZDT3oSUcG2GWuh+EDDfUYA/jhIhl0TOsJNYSEu7mQmi3UzfXwZKA4BsVsHLXQYGgJW95qEtpJ1VcW9HiTriZBlFEqxsDjA09yCNUoQxxwd7KWSTt2y3GTKifkqHRCoWZc3m11Wa/dKdFgXD4kSYfkeJBKd8KMz7J8dZn/cGRCcLGDnA2Ge3bKzcvlnTDNthFWLH7Xt80ua5FMjA4WKelWv5Xo16vHuYzpRbJhhdVlftuRK0VlR27D9lu5TF0DPBi60OrHNO0AfP/uRWvhn/U3LXICE+nh+3IHPUJ8JE6GyBjZQLbjGchlrSgYngF8zyrIF4NJD3atUcgWsWunGN/UHX5B5/yg7uF87Nqp4Gf52F3gH73DjEZNRoqCKAr9giQJp5rGJABpiVE2htNhW9R8nw0jqYjCYcY4LIjwYNScf4WN06IZnZCEqsI4cFaQbo4Z1TsZBx40YhXkHOecaYE5oY37IIQ+iJJ+UsDYSun5MuRSBRZRUUhlY2DqOGajOR6zrSU/5My6l2DnusH1GQgnw5BZP7iuYM/ahcfQ7Z8y51ddfutvuwNqWQ0cBYr8fj0U0vsHpwerVaB2sWhXT2NExi2r1KUE2tUuVMnkepVQrxTmpQrZTG4iu8he8iPyM3KcPE/+RP5KPoE2CEAKclCBzXATxkYOtUY/o961PWRqsj0chRrHFBbtrjP9/P0ven5pcbRdpL94vfsy33e5+izuwz3nFLFPVNayPZx/jdG1fOChflFRvYzsW6L18efgLrSWIgvcqnGJYi4skO4xREURjbDuxKke5v0T3Mrzkt2fi31uyZlLLrqIpEuXXsMlgw442Jb0GAxjS1DM20kBoCzHLXm/jEm0IltdcvU0fEW24jgiwwRjVd9u4NJHcIyoHJcwvyVqgqj5hqBJ1ZWSJryh9p56UWhX1XbhRbW2ZopuZWsQd5y8mEQ8M+C6xjRYxZbDKWf5AgY+Qq/l6wSPk16zDFjowYuu+wjx13mfkxbyDDxadYT/LijZyI0THB+6yfLaWsRcO82zo9mWTNtpO18qlorZoIVMwSN40tky5DOQ1MCIAe24mvlsuwIIxPb10+uXDQ4uWz/9m3rj+ql7p6bufZARuPVq5tXtsn6KwfP8Jy0TeWOyNhUJN6mhX5rkUTtUppQWEMNTqEdaCGKFYKJaQrCE4JtDLYOlNEKmO5kBTPGY2A0N2sY3+dVlo1N9ycBsIGtOjQ2p/tlZvzo0ur4v6cOh8NTospB7U/X40KahoU3bGIH97dnwmtHlYffVG3R1YOwKM2vNhrPhCT5zk64sG53oS4b31aYjqe/B7+kQiXBN+b6h21hNUPMq29B8CU4elINdygMPKF1B+WBTG7Z9ZshpN/xwEuuDQZR+nuoo4CDaAiiwXmLpmukMQyPf/JMclqgL1ixZQ/nnP2VbdUODFGt2fgBvL123rlLYu/6A9ckb7F3K0/CyBMEu6aQoPscroCcacVehvyQyCZAsizsWWBkoLC+WAiWnOksLKaeuQDzGuqSk42aiYTiJ4zf9afl17SrqaTO1f+XlZAfIuYcq7/IqYMaMrksOJ6vHkOCPDq943xcCnHqVD9pHFRpMqSPXrIua1WNs+tOz1U+ciTCDpPk+c4QYJIHnYhxP/kVPAq+ahFpVhPcHp8qyarhiF+HsBU9Hrl+UZa876fbKipL0KqB6OdUveErgtOI97fZ63ae9SvWU6k2w1JfwqnUbHsYcFCJFrC/W12zIMMirWYEHxMPs6LGYSdkSZ5TsNP9PCpwnWC3HKZ1lydNjWHC2Mn3l6vL0dHn1ldP3LTSrX+vKrBqv7KmMr8p0SR6P1NqF63or6XRlIyO90f7+kf7+myOhvt4tq7f09oUiTc2/dycGgqFQcCDRLYmi1NL7fk0CknVMxEg/cdfs/TnpJMNkgqwj17B8beVazSrVbU4lG67IZYOCnWrYy3yBR9cyWcChywos3LJBEdhhFoAdYjiw0rLGm0xU5OzoGm5/ZfmHjVZpNNg6SznzGKDdwv2cCtVn6Eaxo12cfxLprpVtTcZ6hVx6dow7Yq7e8LXO8PY9Jgjoze9yCtU5FNbegcKkQMdCbt9au/te4Ebe0jkc0ukUL32eYnTpNs20h0KpUOhZPYwVcfhZnfdqeCvDfXiuCbAoYWcXERPc/mDQD3/hdF+wK4i/xv3kYfprIpAuMkk2kW3kdtS0kBIKpZwp8KxmsCyfM1MFzAss9LBkDxRyThiaqTLwKYKJVTwmWTudMyz+yks09346MDh4m72yOxCKrt1XMlQ1qPVlTEVVQ1ofdK/sCWjtZu9qGwZ8YZ9PPWlo1IV3eW3+U0aXblP39zrt+JPf6UhEQ1rUjNBULN+utyuaDNW34kpAVuSOeMTyWbSNWnooFu+QFNWQ4d/Ox4IPWx41fP/fB/Rjeoz08ezPA9TysMtmnOXfGN7Ui3xIYLDALrlDLOP09qtJuY2OeL0+QZXdRnR1nxRVBF/SOyKKPpcrn9mWzH4rH9IidE+PTNU2182+hOgSItrE1slByS24vaLvJpxOqe4Pduf3HJkZ+jLqUz9rRzB7p8gKcgWZwV1L8JtUS5Z2JxZSOCuBoMTQihMzLbCPA0KqGMAljRQjONklW/wjnXKy8vxT/Elvm3/KiMUMOoV0/vnDYlhec0SMKtt3/kKMyOt33tj2bqxQLsTjSGLl+EAsNhCnTyRGktW55EgCn/A4PlnWn+Mg8bgZrWqHxTbPwMuyy1u5YeZF2SUM7JRhddwRgiRuxpmgJmxn9ZW7XpcF3ViX/ar6ptRpGJ0S9Adg4qhb9sI3vbL7qNJV/y4i07t5TZBiho1imFoMz3gED+CtjYUxvP4SOxov4bFoNPg5aR1e+G4UgDPoedJTpogyCJ7oYvRqoVS0MQAy+CoNEdTDUjok5ZHZL/WtjV7rFj3PKQE3iKp7ou+rIxN3b9LB1dGjeT4cvKo3FrnWpYpuaFd/h3dtV8UeKN1Y9hpR3dt4p0H/zKuPQq0kZQUIIpuDfoiETsnIk+gCWMJZUXHtE8V9LkUc2TE8vOMbO4ax/MACabzyaGXc7u3FBr11ThBdB8SIeMAlCntG2KThHSPsaj2Dc9KNyY2a0KZ7ODaTHoRiFkeYz+shZBpCS4X6471KKKnuHd84edfk5F37d1XO5bbkcltu2ZLNbvnPXiUVAnVvprJrP+NObryjxrllS65md6Tm6wzFHRR4dY3QUUjb7MgxaIixU8hspi98fl/Xc+IB4iU66eCVL9YfAfahiSUt4TONS8x0D8W7u8vd3fGWx6OXlM/U1IoU/s61PGhpyXRFa3eReq2qG56lvmYtXavCC1iN7lbiBpWxXHU+cSlztVLVz0tVN600fVsLxaVDknhYioeoXP3t4lqV1r79MAw0GCI1FTL1YIGzPL1MMlJ9ZsN9P7lvA2yr9ZFUzwzPrVgxN/x/SS+chwB4nGNgZGBgAOLPrYdY4vltvjJwM78AijDUqG5oRND/XzNPZboF5HIwMIFEAU/lC+J4nGNgZGBgDvqfBSRfMAAB81QGRgZUoA0AVvYDbwAAAHicY2BgYGB+MTQwAM8EJo8AAAAAAE4AmgDoAQoBLAFOAXABmgHEAe4CGgKcAugEmgS8BNYE8gUOBSoFegXQBf4GRAZmBrYHGAeQCBgIUghqCP4JRgm+CdoKBAo+CoQKugr0C1QLmgvAeJxjYGRgYNBmTGEQZQABJiDmAkIGhv9gPgMAGJQBvAB4nG2RPU7DMBiG3/QP0UoIBGJh8QILavozdmRo9w7d09RpUzlx5LgVvQMn4BAcgoEzcAgOwVvzSZVQbcnf48fvFysJgGt8IcJxROiG9TgauODuj5ukG+EW+UG4jR4ehTv0Q+EunjER7uEWmk+IWpc0d3gVbuAKb8JN+nfhFvlDuI17fAp36L+Fu1jgR7iHp+jF7Arbz1Nb1nO93pnEncSJFtrVuS3VKB6e5EyX2iVer9TyoOr9eux9pjJnCzW1pdfGWFU5u9WpjzfeV5PBIBMfp7aAwQ4FLPrIkbKWqDHn+67pDRK4s4lzbsEux5qHvcIIMb/nueSMyTKkE3jWFdNLHLjW2PPmMa1Hxn3GjGW/wjT0HtOG09JU4WxLk9LH2ISuiv9twJn9y8fh9uIXI+BknAAAAHicbY7ZboMwEEW5CVBCSLrv+76kfJRjTwHFsdGAG+Xvy5JUfehIHp0rnxmNN/D6ir3/a4YBhvARIMQOIowQY4wEE0yxiz3s4wCHOMIxTnCKM5zjApe4wjVucIs73OMBj3jCM17wije84wMzfHqJ0EVmUkmmJo77oOmrHvfIRZbXsTCZplTZldlgb3TYGVHProwFs11t1A57tcON2rErR3PBqcwF1/6ctI6k0GSU4JHMSS6WghdJQ99sTbfuN7QLJ9vQ37dNrgyktnIxlDYLJNuqitpRbYWKFNuyDT6pog6oOYKHtKakeakqKjHXpPwlGRcsC+OqxLIiJpXqoqqDMreG2l5bv9Ri3TRX+c23DZna9WFFgmXuO6Ps1Jm/w6ErW8N3FbHn/QC444j0AA==)
      format('woff');
    font-weight: normal;
    font-style: normal;
  }

  html {
    --lumo-icons-align-center: '\\ea01';
    --lumo-icons-align-left: '\\ea02';
    --lumo-icons-align-right: '\\ea03';
    --lumo-icons-angle-down: '\\ea04';
    --lumo-icons-angle-left: '\\ea05';
    --lumo-icons-angle-right: '\\ea06';
    --lumo-icons-angle-up: '\\ea07';
    --lumo-icons-arrow-down: '\\ea08';
    --lumo-icons-arrow-left: '\\ea09';
    --lumo-icons-arrow-right: '\\ea0a';
    --lumo-icons-arrow-up: '\\ea0b';
    --lumo-icons-bar-chart: '\\ea0c';
    --lumo-icons-bell: '\\ea0d';
    --lumo-icons-calendar: '\\ea0e';
    --lumo-icons-checkmark: '\\ea0f';
    --lumo-icons-chevron-down: '\\ea10';
    --lumo-icons-chevron-left: '\\ea11';
    --lumo-icons-chevron-right: '\\ea12';
    --lumo-icons-chevron-up: '\\ea13';
    --lumo-icons-clock: '\\ea14';
    --lumo-icons-cog: '\\ea15';
    --lumo-icons-cross: '\\ea16';
    --lumo-icons-download: '\\ea17';
    --lumo-icons-dropdown: '\\ea18';
    --lumo-icons-edit: '\\ea19';
    --lumo-icons-error: '\\ea1a';
    --lumo-icons-eye: '\\ea1b';
    --lumo-icons-eye-disabled: '\\ea1c';
    --lumo-icons-menu: '\\ea1d';
    --lumo-icons-minus: '\\ea1e';
    --lumo-icons-ordered-list: '\\ea1f';
    --lumo-icons-phone: '\\ea20';
    --lumo-icons-photo: '\\ea21';
    --lumo-icons-play: '\\ea22';
    --lumo-icons-plus: '\\ea23';
    --lumo-icons-redo: '\\ea24';
    --lumo-icons-reload: '\\ea25';
    --lumo-icons-search: '\\ea26';
    --lumo-icons-undo: '\\ea27';
    --lumo-icons-unordered-list: '\\ea28';
    --lumo-icons-upload: '\\ea29';
    --lumo-icons-user: '\\ea2a';
  }
`;
Ge("font-icons", oh);
/**
 * @license
 * Copyright (c) 2017 - 2023 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
const Qn = _`
  [part$='button'] {
    flex: none;
    width: 1em;
    height: 1em;
    line-height: 1;
    font-size: var(--lumo-icon-size-m);
    text-align: center;
    color: var(--lumo-contrast-60pct);
    transition: 0.2s color;
    cursor: var(--lumo-clickable-cursor);
  }

  [part$='button']:hover {
    color: var(--lumo-contrast-90pct);
  }

  :host([disabled]) [part$='button'],
  :host([readonly]) [part$='button'] {
    color: var(--lumo-contrast-20pct);
    cursor: default;
  }

  [part$='button']::before {
    font-family: 'lumo-icons';
    display: block;
  }
`;
m("", Qn, { moduleId: "lumo-field-button" });
/**
 * @license
 * Copyright (c) 2017 - 2023 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
const qr = _`
  :host([has-helper]) [part='helper-text']::before {
    content: '';
    display: block;
    height: 0.4em;
  }

  [part='helper-text'] {
    display: block;
    color: var(--lumo-secondary-text-color);
    font-size: var(--lumo-font-size-xs);
    line-height: var(--lumo-line-height-xs);
    margin-left: calc(var(--lumo-border-radius-m) / 4);
    transition: color 0.2s;
  }

  :host(:hover:not([readonly])) [part='helper-text'] {
    color: var(--lumo-body-text-color);
  }

  :host([disabled]) [part='helper-text'] {
    color: var(--lumo-disabled-text-color);
    -webkit-text-fill-color: var(--lumo-disabled-text-color);
  }

  :host([has-helper][theme~='helper-above-field']) [part='helper-text']::before {
    display: none;
  }

  :host([has-helper][theme~='helper-above-field']) [part='helper-text']::after {
    content: '';
    display: block;
    height: 0.4em;
  }

  :host([has-helper][theme~='helper-above-field']) [part='label'] {
    order: 0;
    padding-bottom: 0.4em;
  }

  :host([has-helper][theme~='helper-above-field']) [part='helper-text'] {
    order: 1;
  }

  :host([has-helper][theme~='helper-above-field']) [part='label'] + * {
    order: 2;
  }

  :host([has-helper][theme~='helper-above-field']) [part='error-message'] {
    order: 3;
  }
`;
/**
 * @license
 * Copyright (c) 2017 - 2023 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
const pi = _`
  [part='label'] {
    align-self: flex-start;
    color: var(--lumo-secondary-text-color);
    font-weight: 500;
    font-size: var(--lumo-font-size-s);
    margin-left: calc(var(--lumo-border-radius-m) / 4);
    transition: color 0.2s;
    line-height: 1;
    padding-right: 1em;
    padding-bottom: 0.5em;
    /* As a workaround for diacritics being cut off, add a top padding and a 
    negative margin to compensate */
    padding-top: 0.25em;
    margin-top: -0.25em;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
    position: relative;
    max-width: 100%;
    box-sizing: border-box;
  }

  :host([has-label])::before {
    margin-top: calc(var(--lumo-font-size-s) * 1.5);
  }

  :host([has-label][theme~='small'])::before {
    margin-top: calc(var(--lumo-font-size-xs) * 1.5);
  }

  :host([has-label]) {
    padding-top: var(--lumo-space-m);
  }

  :host([has-label]) ::slotted([slot='tooltip']) {
    --vaadin-tooltip-offset-bottom: calc((var(--lumo-space-m) - var(--lumo-space-xs)) * -1);
  }

  :host([required]) [part='required-indicator']::after {
    content: var(--lumo-required-field-indicator, '\\2022');
    transition: opacity 0.2s;
    color: var(--lumo-required-field-indicator-color, var(--lumo-primary-text-color));
    position: absolute;
    right: 0;
    width: 1em;
    text-align: center;
  }

  :host([invalid]) [part='required-indicator']::after {
    color: var(--lumo-required-field-indicator-color, var(--lumo-error-text-color));
  }

  [part='error-message'] {
    margin-left: calc(var(--lumo-border-radius-m) / 4);
    font-size: var(--lumo-font-size-xs);
    line-height: var(--lumo-line-height-xs);
    color: var(--lumo-error-text-color);
    will-change: max-height;
    transition: 0.4s max-height;
    max-height: 5em;
  }

  :host([has-error-message]) [part='error-message']::before,
  :host([has-error-message]) [part='error-message']::after {
    content: '';
    display: block;
    height: 0.4em;
  }

  :host(:not([invalid])) [part='error-message'] {
    max-height: 0;
    overflow: hidden;
  }

  /* RTL specific styles */

  :host([dir='rtl']) [part='label'] {
    margin-left: 0;
    margin-right: calc(var(--lumo-border-radius-m) / 4);
  }

  :host([dir='rtl']) [part='label'] {
    padding-left: 1em;
    padding-right: 0;
  }

  :host([dir='rtl']) [part='required-indicator']::after {
    right: auto;
    left: 0;
  }

  :host([dir='rtl']) [part='error-message'] {
    margin-left: 0;
    margin-right: calc(var(--lumo-border-radius-m) / 4);
  }
`;
m("", pi, { moduleId: "lumo-required-field" });
/**
 * @license
 * Copyright (c) 2017 - 2023 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
const sh = _`
  :host {
    --lumo-text-field-size: var(--lumo-size-m);
    color: var(--lumo-body-text-color);
    font-size: var(--lumo-font-size-m);
    font-family: var(--lumo-font-family);
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    -webkit-tap-highlight-color: transparent;
    padding: var(--lumo-space-xs) 0;
  }

  :host::before {
    height: var(--lumo-text-field-size);
    box-sizing: border-box;
    display: inline-flex;
    align-items: center;
  }

  :host([focused]:not([readonly])) [part='label'] {
    color: var(--lumo-primary-text-color);
  }

  :host([focused]) [part='input-field'] ::slotted(:is(input, textarea)) {
    -webkit-mask-image: none;
    mask-image: none;
  }

  ::slotted(:is(input, textarea):placeholder-shown) {
    color: var(--lumo-secondary-text-color);
  }

  /* Hover */
  :host(:hover:not([readonly]):not([focused])) [part='label'] {
    color: var(--lumo-body-text-color);
  }

  :host(:hover:not([readonly]):not([focused])) [part='input-field']::after {
    opacity: 0.1;
  }

  /* Touch device adjustment */
  @media (pointer: coarse) {
    :host(:hover:not([readonly]):not([focused])) [part='label'] {
      color: var(--lumo-secondary-text-color);
    }

    :host(:hover:not([readonly]):not([focused])) [part='input-field']::after {
      opacity: 0;
    }

    :host(:active:not([readonly]):not([focused])) [part='input-field']::after {
      opacity: 0.2;
    }
  }

  /* Trigger when not focusing using the keyboard */
  :host([focused]:not([focus-ring]):not([readonly])) [part='input-field']::after {
    transform: scaleX(0);
    transition-duration: 0.15s, 1s;
  }

  /* Focus-ring */
  :host([focus-ring]) [part='input-field'] {
    box-shadow: 0 0 0 2px var(--lumo-primary-color-50pct);
  }

  /* Read-only and disabled */
  :host(:is([readonly], [disabled])) ::slotted(:is(input, textarea):placeholder-shown) {
    opacity: 0;
  }

  /* Read-only style */
  :host([readonly]) {
    --vaadin-input-field-border-color: transparent;
  }

  /* Disabled style */
  :host([disabled]) {
    pointer-events: none;
    --vaadin-input-field-border-color: var(--lumo-contrast-20pct);
  }

  :host([disabled]) [part='label'],
  :host([disabled]) [part='input-field'] ::slotted(*) {
    color: var(--lumo-disabled-text-color);
    -webkit-text-fill-color: var(--lumo-disabled-text-color);
  }

  /* Invalid style */
  :host([invalid]) {
    --vaadin-input-field-border-color: var(--lumo-error-color);
  }

  :host([invalid][focus-ring]) [part='input-field'] {
    box-shadow: 0 0 0 2px var(--lumo-error-color-50pct);
  }

  :host([input-prevented]) [part='input-field'] {
    animation: shake 0.15s infinite;
  }

  @keyframes shake {
    25% {
      transform: translateX(4px);
    }
    75% {
      transform: translateX(-4px);
    }
  }

  /* Small theme */
  :host([theme~='small']) {
    font-size: var(--lumo-font-size-s);
    --lumo-text-field-size: var(--lumo-size-s);
  }

  :host([theme~='small']) [part='label'] {
    font-size: var(--lumo-font-size-xs);
  }

  :host([theme~='small']) [part='error-message'] {
    font-size: var(--lumo-font-size-xxs);
  }

  /* Slotted content */
  [part='input-field'] ::slotted(:not(vaadin-icon):not(input):not(textarea)) {
    color: var(--lumo-secondary-text-color);
    font-weight: 400;
  }

  [part='clear-button']::before {
    content: var(--lumo-icons-cross);
  }
`, St = [pi, Qn, qr, sh];
m("", St, {
  moduleId: "lumo-input-field-shared-styles"
});
const nh = _`
  :host {
    outline: none;
  }

  [part='toggle-button']::before {
    content: var(--lumo-icons-calendar);
  }

  [part='clear-button']::before {
    content: var(--lumo-icons-cross);
  }

  @media (max-width: 420px), (max-height: 420px) {
    [part='overlay-content'] {
      height: 70vh;
    }
  }

  :host([dir='rtl']) [part='input-field'] ::slotted(input) {
    --_lumo-text-field-overflow-mask-image: linear-gradient(to left, transparent, #000 1.25em);
  }

  :host([dir='rtl']) [part='input-field'] ::slotted(input:placeholder-shown) {
    --_lumo-text-field-overflow-mask-image: none;
  }
`;
m("vaadin-date-picker", [St, nh], { moduleId: "lumo-date-picker" });
/**
 * @license
 * Copyright (c) 2017 - 2023 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
const Fi = {
  start: "top",
  end: "bottom"
}, Ni = {
  start: "left",
  end: "right"
}, Go = new ResizeObserver((o) => {
  setTimeout(() => {
    o.forEach((t) => {
      t.target.__overlay && t.target.__overlay._updatePosition();
    });
  });
}), Zn = (o) => class extends o {
  static get properties() {
    return {
      /**
       * The element next to which this overlay should be aligned.
       * The position of the overlay relative to the positionTarget can be adjusted
       * with properties `horizontalAlign`, `verticalAlign`, `noHorizontalOverlap`
       * and `noVerticalOverlap`.
       */
      positionTarget: {
        type: Object,
        value: null
      },
      /**
       * When `positionTarget` is set, this property defines whether to align the overlay's
       * left or right side to the target element by default.
       * Possible values are `start` and `end`.
       * RTL is taken into account when interpreting the value.
       * The overlay is automatically flipped to the opposite side when it doesn't fit into
       * the default side defined by this property.
       *
       * @attr {start|end} horizontal-align
       */
      horizontalAlign: {
        type: String,
        value: "start"
      },
      /**
       * When `positionTarget` is set, this property defines whether to align the overlay's
       * top or bottom side to the target element by default.
       * Possible values are `top` and `bottom`.
       * The overlay is automatically flipped to the opposite side when it doesn't fit into
       * the default side defined by this property.
       *
       * @attr {top|bottom} vertical-align
       */
      verticalAlign: {
        type: String,
        value: "top"
      },
      /**
       * When `positionTarget` is set, this property defines whether the overlay should overlap
       * the target element in the x-axis, or be positioned right next to it.
       *
       * @attr {boolean} no-horizontal-overlap
       */
      noHorizontalOverlap: {
        type: Boolean,
        value: !1
      },
      /**
       * When `positionTarget` is set, this property defines whether the overlay should overlap
       * the target element in the y-axis, or be positioned right above/below it.
       *
       * @attr {boolean} no-vertical-overlap
       */
      noVerticalOverlap: {
        type: Boolean,
        value: !1
      },
      /**
       * If the overlay content has no intrinsic height, this property can be used to set
       * the minimum vertical space (in pixels) required by the overlay. Setting a value to
       * the property effectively disables the content measurement in favor of using this
       * fixed value for determining the open direction.
       *
       * @attr {number} required-vertical-space
       */
      requiredVerticalSpace: {
        type: Number,
        value: 0
      }
    };
  }
  static get observers() {
    return [
      "__positionSettingsChanged(horizontalAlign, verticalAlign, noHorizontalOverlap, noVerticalOverlap, requiredVerticalSpace)",
      "__overlayOpenedChanged(opened, positionTarget)"
    ];
  }
  constructor() {
    super(), this.__onScroll = this.__onScroll.bind(this), this._updatePosition = this._updatePosition.bind(this);
  }
  /** @protected */
  connectedCallback() {
    super.connectedCallback(), this.opened && this.__addUpdatePositionEventListeners();
  }
  /** @protected */
  disconnectedCallback() {
    super.disconnectedCallback(), this.__removeUpdatePositionEventListeners();
  }
  /** @private */
  __addUpdatePositionEventListeners() {
    window.addEventListener("resize", this._updatePosition), this.__positionTargetAncestorRootNodes = Rc(this.positionTarget), this.__positionTargetAncestorRootNodes.forEach((e) => {
      e.addEventListener("scroll", this.__onScroll, !0);
    });
  }
  /** @private */
  __removeUpdatePositionEventListeners() {
    window.removeEventListener("resize", this._updatePosition), this.__positionTargetAncestorRootNodes && (this.__positionTargetAncestorRootNodes.forEach((e) => {
      e.removeEventListener("scroll", this.__onScroll, !0);
    }), this.__positionTargetAncestorRootNodes = null);
  }
  /** @private */
  __overlayOpenedChanged(e, i) {
    if (this.__removeUpdatePositionEventListeners(), i && (i.__overlay = null, Go.unobserve(i), e && (this.__addUpdatePositionEventListeners(), i.__overlay = this, Go.observe(i))), e) {
      const r = getComputedStyle(this);
      this.__margins || (this.__margins = {}, ["top", "bottom", "left", "right"].forEach((s) => {
        this.__margins[s] = parseInt(r[s], 10);
      })), this.setAttribute("dir", r.direction), this._updatePosition(), requestAnimationFrame(() => this._updatePosition());
    }
  }
  __positionSettingsChanged() {
    this._updatePosition();
  }
  /** @private */
  __onScroll(e) {
    this.contains(e.target) || this._updatePosition();
  }
  _updatePosition() {
    if (!this.positionTarget || !this.opened)
      return;
    const e = this.positionTarget.getBoundingClientRect(), i = this.__shouldAlignStartVertically(e);
    this.style.justifyContent = i ? "flex-start" : "flex-end";
    const r = this.__isRTL, s = this.__shouldAlignStartHorizontally(e, r), n = !r && s || r && !s;
    this.style.alignItems = n ? "flex-start" : "flex-end";
    const a = this.getBoundingClientRect(), l = this.__calculatePositionInOneDimension(
      e,
      a,
      this.noVerticalOverlap,
      Fi,
      this,
      i
    ), d = this.__calculatePositionInOneDimension(
      e,
      a,
      this.noHorizontalOverlap,
      Ni,
      this,
      s
    );
    Object.assign(this.style, l, d), this.toggleAttribute("bottom-aligned", !i), this.toggleAttribute("top-aligned", i), this.toggleAttribute("end-aligned", !n), this.toggleAttribute("start-aligned", n);
  }
  __shouldAlignStartHorizontally(e, i) {
    const r = Math.max(this.__oldContentWidth || 0, this.$.overlay.offsetWidth);
    this.__oldContentWidth = this.$.overlay.offsetWidth;
    const s = Math.min(window.innerWidth, document.documentElement.clientWidth), n = !i && this.horizontalAlign === "start" || i && this.horizontalAlign === "end";
    return this.__shouldAlignStart(
      e,
      r,
      s,
      this.__margins,
      n,
      this.noHorizontalOverlap,
      Ni
    );
  }
  __shouldAlignStartVertically(e) {
    const i = this.requiredVerticalSpace || Math.max(this.__oldContentHeight || 0, this.$.overlay.offsetHeight);
    this.__oldContentHeight = this.$.overlay.offsetHeight;
    const r = Math.min(window.innerHeight, document.documentElement.clientHeight), s = this.verticalAlign === "top";
    return this.__shouldAlignStart(
      e,
      i,
      r,
      this.__margins,
      s,
      this.noVerticalOverlap,
      Fi
    );
  }
  // eslint-disable-next-line max-params
  __shouldAlignStart(e, i, r, s, n, a, l) {
    const d = r - e[a ? l.end : l.start] - s[l.end], c = e[a ? l.start : l.end] - s[l.start], h = n ? d : c, p = h > (n ? c : d) || h > i;
    return n === p;
  }
  /**
   * Returns an adjusted value after resizing the browser window,
   * to avoid wrong calculations when e.g. previously set `bottom`
   * CSS property value is larger than the updated viewport height.
   * See https://github.com/vaadin/web-components/issues/4604
   */
  __adjustBottomProperty(e, i, r) {
    let s;
    if (e === i.end) {
      if (i.end === Fi.end) {
        const n = Math.min(window.innerHeight, document.documentElement.clientHeight);
        if (r > n && this.__oldViewportHeight) {
          const a = this.__oldViewportHeight - n;
          s = r - a;
        }
        this.__oldViewportHeight = n;
      }
      if (i.end === Ni.end) {
        const n = Math.min(window.innerWidth, document.documentElement.clientWidth);
        if (r > n && this.__oldViewportWidth) {
          const a = this.__oldViewportWidth - n;
          s = r - a;
        }
        this.__oldViewportWidth = n;
      }
    }
    return s;
  }
  /**
   * Returns an object with CSS position properties to set,
   * e.g. { top: "100px" }
   */
  // eslint-disable-next-line max-params
  __calculatePositionInOneDimension(e, i, r, s, n, a) {
    const l = a ? s.start : s.end, d = a ? s.end : s.start, c = parseFloat(n.style[l] || getComputedStyle(n)[l]), h = this.__adjustBottomProperty(l, s, c), u = i[a ? s.start : s.end] - e[r === a ? s.end : s.start], p = h ? `${h}px` : `${c + u * (a ? -1 : 1)}px`;
    return {
      [l]: p,
      [d]: ""
    };
  }
};
/**
 * @license
 * Copyright (c) 2016 - 2023 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
m(
  "vaadin-date-picker-overlay",
  _`
    [part='overlay'] {
      display: flex;
      flex: auto;
    }

    [part~='content'] {
      flex: auto;
    }

    @media (forced-colors: active) {
      [part='overlay'] {
        outline: 3px solid;
      }
    }
  `,
  {
    moduleId: "vaadin-date-picker-overlay-styles"
  }
);
let Ft;
class jo extends Zn(U) {
  static get is() {
    return "vaadin-date-picker-overlay";
  }
  static get template() {
    return Ft || (Ft = super.template.cloneNode(!0), Ft.content.querySelector('[part~="overlay"]').removeAttribute("tabindex")), Ft;
  }
}
customElements.define(jo.is, jo);
/**
@license
Copyright (c) 2017 The Polymer Project Authors. All rights reserved.
This code may only be used under the BSD style license found at http://polymer.github.io/LICENSE.txt
The complete set of authors may be found at http://polymer.github.io/AUTHORS.txt
The complete set of contributors may be found at http://polymer.github.io/CONTRIBUTORS.txt
Code distributed by Google as part of the polymer project is also
subject to an additional IP rights grant found at http://polymer.github.io/PATENTS.txt
*/
function Wr(o, t, e, i, r) {
  let s;
  r && (s = typeof e == "object" && e !== null, s && (i = o.__dataTemp[t]));
  let n = i !== e && (i === i || e === e);
  return s && n && (o.__dataTemp[t] = e), n;
}
const Gr = I((o) => {
  class t extends o {
    /**
     * Overrides `PropertyEffects` to provide option for skipping
     * strict equality checking for Objects and Arrays.
     *
     * This method pulls the value to dirty check against from the `__dataTemp`
     * cache (rather than the normal `__data` cache) for Objects.  Since the temp
     * cache is cleared at the end of a turn, this implementation allows
     * side-effects of deep object changes to be processed by re-setting the
     * same object (using the temp cache as an in-turn backstop to prevent
     * cycles due to 2-way notification).
     *
     * @param {string} property Property name
     * @param {*} value New property value
     * @param {*} old Previous property value
     * @return {boolean} Whether the property should be considered a change
     * @protected
     */
    _shouldPropertyChange(i, r, s) {
      return Wr(this, i, r, s, !0);
    }
  }
  return t;
}), ah = I((o) => {
  class t extends o {
    /** @nocollapse */
    static get properties() {
      return {
        /**
         * Instance-level flag for configuring the dirty-checking strategy
         * for this element.  When true, Objects and Arrays will skip dirty
         * checking, otherwise strict equality checking will be used.
         */
        mutableData: Boolean
      };
    }
    /**
     * Overrides `PropertyEffects` to provide option for skipping
     * strict equality checking for Objects and Arrays.
     *
     * When `this.mutableData` is true on this instance, this method
     * pulls the value to dirty check against from the `__dataTemp` cache
     * (rather than the normal `__data` cache) for Objects.  Since the temp
     * cache is cleared at the end of a turn, this implementation allows
     * side-effects of deep object changes to be processed by re-setting the
     * same object (using the temp cache as an in-turn backstop to prevent
     * cycles due to 2-way notification).
     *
     * @param {string} property Property name
     * @param {*} value New property value
     * @param {*} old Previous property value
     * @return {boolean} Whether the property should be considered a change
     * @protected
     */
    _shouldPropertyChange(i, r, s) {
      return Wr(this, i, r, s, this.mutableData);
    }
  }
  return t;
});
Gr._mutablePropertyChange = Wr;
/**
@license
Copyright (c) 2017 The Polymer Project Authors. All rights reserved.
This code may only be used under the BSD style license found at http://polymer.github.io/LICENSE.txt
The complete set of authors may be found at http://polymer.github.io/AUTHORS.txt
The complete set of contributors may be found at http://polymer.github.io/CONTRIBUTORS.txt
Code distributed by Google as part of the polymer project is also
subject to an additional IP rights grant found at http://polymer.github.io/PATENTS.txt
*/
let _r = null;
function fr() {
  return _r;
}
fr.prototype = Object.create(HTMLTemplateElement.prototype, {
  constructor: {
    value: fr,
    writable: !0
  }
});
const Xn = Pr(fr), lh = Gr(Xn);
function dh(o, t) {
  _r = o, Object.setPrototypeOf(o, t.prototype), new t(), _r = null;
}
const ch = Pr(class {
});
function hh(o, t) {
  for (let e = 0; e < t.length; e++) {
    let i = t[e];
    if (!!o != !!i.__hideTemplateChildren__)
      if (i.nodeType === Node.TEXT_NODE)
        o ? (i.__polymerTextContent__ = i.textContent, i.textContent = "") : i.textContent = i.__polymerTextContent__;
      else if (i.localName === "slot")
        if (o)
          i.__polymerReplaced__ = document.createComment("hidden-slot"), S(S(i).parentNode).replaceChild(i.__polymerReplaced__, i);
        else {
          const r = i.__polymerReplaced__;
          r && S(S(r).parentNode).replaceChild(i, r);
        }
      else
        i.style && (o ? (i.__polymerDisplay__ = i.style.display, i.style.display = "none") : i.style.display = i.__polymerDisplay__);
    i.__hideTemplateChildren__ = o, i._showHideChildren && i._showHideChildren(o);
  }
}
class pe extends ch {
  constructor(t) {
    super(), this._configureProperties(t), this.root = this._stampTemplate(this.__dataHost);
    let e = [];
    this.children = /** @type {!NodeList} */
    e;
    for (let r = this.root.firstChild; r; r = r.nextSibling)
      e.push(r), r.__templatizeInstance = this;
    this.__templatizeOwner && this.__templatizeOwner.__hideTemplateChildren__ && this._showHideChildren(!0);
    let i = this.__templatizeOptions;
    (t && i.instanceProps || !i.instanceProps) && this._enableProperties();
  }
  /**
   * Configure the given `props` by calling `_setPendingProperty`. Also
   * sets any properties stored in `__hostProps`.
   * @private
   * @param {Object} props Object of property name-value pairs to set.
   * @return {void}
   */
  _configureProperties(t) {
    if (this.__templatizeOptions.forwardHostProp)
      for (let i in this.__hostProps)
        this._setPendingProperty(i, this.__dataHost["_host_" + i]);
    for (let i in t)
      this._setPendingProperty(i, t[i]);
  }
  /**
   * Forwards a host property to this instance.  This method should be
   * called on instances from the `options.forwardHostProp` callback
   * to propagate changes of host properties to each instance.
   *
   * Note this method enqueues the change, which are flushed as a batch.
   *
   * @param {string} prop Property or path name
   * @param {*} value Value of the property to forward
   * @return {void}
   */
  forwardHostProp(t, e) {
    this._setPendingPropertyOrPath(t, e, !1, !0) && this.__dataHost._enqueueClient(this);
  }
  /**
   * Override point for adding custom or simulated event handling.
   *
   * @override
   * @param {!Node} node Node to add event listener to
   * @param {string} eventName Name of event
   * @param {function(!Event):void} handler Listener function to add
   * @return {void}
   */
  _addEventListenerToNode(t, e, i) {
    if (this._methodHost && this.__templatizeOptions.parentModel)
      this._methodHost._addEventListenerToNode(t, e, (r) => {
        r.model = this, i(r);
      });
    else {
      let r = this.__dataHost.__dataHost;
      r && r._addEventListenerToNode(t, e, i);
    }
  }
  /**
   * Shows or hides the template instance top level child elements. For
   * text nodes, `textContent` is removed while "hidden" and replaced when
   * "shown."
   * @param {boolean} hide Set to true to hide the children;
   * set to false to show them.
   * @return {void}
   * @protected
   */
  _showHideChildren(t) {
    hh(t, this.children);
  }
  /**
   * Overrides default property-effects implementation to intercept
   * textContent bindings while children are "hidden" and cache in
   * private storage for later retrieval.
   *
   * @override
   * @param {!Node} node The node to set a property on
   * @param {string} prop The property to set
   * @param {*} value The value to set
   * @return {void}
   * @protected
   */
  _setUnmanagedPropertyToNode(t, e, i) {
    t.__hideTemplateChildren__ && t.nodeType == Node.TEXT_NODE && e == "textContent" ? t.__polymerTextContent__ = i : super._setUnmanagedPropertyToNode(t, e, i);
  }
  /**
   * Find the parent model of this template instance.  The parent model
   * is either another templatize instance that had option `parentModel: true`,
   * or else the host element.
   *
   * @return {!Polymer_PropertyEffects} The parent model of this instance
   */
  get parentModel() {
    let t = this.__parentModel;
    if (!t) {
      let e;
      t = this;
      do
        t = t.__dataHost.__dataHost;
      while ((e = t.__templatizeOptions) && !e.parentModel);
      this.__parentModel = t;
    }
    return t;
  }
  /**
   * Stub of HTMLElement's `dispatchEvent`, so that effects that may
   * dispatch events safely no-op.
   *
   * @param {Event} event Event to dispatch
   * @return {boolean} Always true.
   * @override
   */
  dispatchEvent(t) {
    return !0;
  }
}
pe.prototype.__dataHost;
pe.prototype.__templatizeOptions;
pe.prototype._methodHost;
pe.prototype.__templatizeOwner;
pe.prototype.__hostProps;
const uh = Gr(
  // This cast shouldn't be neccessary, but Closure doesn't understand that
  // TemplateInstanceBase is a constructor function.
  /** @type {function(new:TemplateInstanceBase)} */
  pe
);
function Yo(o) {
  let t = o.__dataHost;
  return t && t._methodHost || t;
}
function ph(o, t, e) {
  let i = e.mutableData ? uh : pe;
  mr.mixin && (i = mr.mixin(i));
  let r = class extends i {
  };
  return r.prototype.__templatizeOptions = e, r.prototype._bindTemplate(o), mh(r, o, t, e), r;
}
function _h(o, t, e, i) {
  let r = e.forwardHostProp;
  if (r && t.hasHostProps) {
    const s = o.localName == "template";
    let n = t.templatizeTemplateClass;
    if (!n) {
      if (s) {
        let l = e.mutableData ? lh : Xn;
        class d extends l {
        }
        n = t.templatizeTemplateClass = d;
      } else {
        const l = o.constructor;
        class d extends l {
        }
        n = t.templatizeTemplateClass = d;
      }
      let a = t.hostProps;
      for (let l in a)
        n.prototype._addPropertyEffect(
          "_host_" + l,
          n.prototype.PROPERTY_EFFECT_TYPES.PROPAGATE,
          { fn: fh(l, r) }
        ), n.prototype._createNotifyingProperty("_host_" + l);
      nn && i && vh(t, e, i);
    }
    if (o.__dataProto && Object.assign(o.__data, o.__dataProto), s)
      dh(o, n), o.__dataTemp = {}, o.__dataPending = null, o.__dataOld = null, o._enableProperties();
    else {
      Object.setPrototypeOf(o, n.prototype);
      const a = t.hostProps;
      for (let l in a)
        if (l = "_host_" + l, l in o) {
          const d = o[l];
          delete o[l], o.__data[l] = d;
        }
    }
  }
}
function fh(o, t) {
  return function(i, r, s) {
    t.call(
      i.__templatizeOwner,
      r.substring(6),
      s[r]
    );
  };
}
function mh(o, t, e, i) {
  let r = e.hostProps || {};
  for (let s in i.instanceProps) {
    delete r[s];
    let n = i.notifyInstanceProp;
    n && o.prototype._addPropertyEffect(
      s,
      o.prototype.PROPERTY_EFFECT_TYPES.NOTIFY,
      { fn: gh(s, n) }
    );
  }
  if (i.forwardHostProp && t.__dataHost)
    for (let s in r)
      e.hasHostProps || (e.hasHostProps = !0), o.prototype._addPropertyEffect(
        s,
        o.prototype.PROPERTY_EFFECT_TYPES.NOTIFY,
        { fn: bh() }
      );
}
function gh(o, t) {
  return function(i, r, s) {
    t.call(
      i.__templatizeOwner,
      i,
      r,
      s[r]
    );
  };
}
function bh() {
  return function(t, e, i) {
    t.__dataHost._setPendingPropertyOrPath("_host_" + e, i[e], !0, !0);
  };
}
function mr(o, t, e) {
  if (Qt && !Yo(o))
    throw new Error("strictTemplatePolicy: template owner not trusted");
  if (e = /** @type {!TemplatizeOptions} */
  e || {}, o.__templatizeOwner)
    throw new Error("A <template> can only be templatized once");
  o.__templatizeOwner = t;
  let r = (t ? t.constructor : pe)._parseTemplate(o), s = r.templatizeInstanceClass;
  s || (s = ph(o, r, e), r.templatizeInstanceClass = s);
  const n = Yo(o);
  _h(o, r, e, n);
  let a = class extends s {
  };
  return a.prototype._methodHost = n, a.prototype.__dataHost = /** @type {!DataTemplate} */
  o, a.prototype.__templatizeOwner = /** @type {!Object} */
  t, a.prototype.__hostProps = r.hostProps, a = /** @type {function(new:TemplateInstanceBase)} */
  a, a;
}
function vh(o, t, e) {
  const i = e.constructor._properties, { propertyEffects: r } = o, { instanceProps: s } = t;
  for (let n in r)
    if (!i[n] && !(s && s[n])) {
      const a = r[n];
      for (let l = 0; l < a.length; l++) {
        const { part: d } = a[l].info;
        if (!(d.signature && d.signature.static))
          break;
      }
    }
}
function yh(o, t) {
  let e;
  for (; t; )
    if (e = t.__dataHost ? t : t.__templatizeInstance)
      if (e.__dataHost != o)
        t = e.__dataHost;
      else
        return e;
    else
      t = S(t).parentNode;
  return null;
}
/**
@license
Copyright (c) 2017 The Polymer Project Authors. All rights reserved.
This code may only be used under the BSD style license found at http://polymer.github.io/LICENSE.txt
The complete set of authors may be found at http://polymer.github.io/AUTHORS.txt
The complete set of contributors may be found at http://polymer.github.io/CONTRIBUTORS.txt
Code distributed by Google as part of the polymer project is also
subject to an additional IP rights grant found at http://polymer.github.io/PATENTS.txt
*/
class ti {
  constructor() {
    this._asyncModule = null, this._callback = null, this._timer = null;
  }
  /**
   * Sets the scheduler; that is, a module with the Async interface,
   * a callback and optional arguments to be passed to the run function
   * from the async module.
   *
   * @param {!AsyncInterface} asyncModule Object with Async interface.
   * @param {function()} callback Callback to run.
   * @return {void}
   */
  setConfig(t, e) {
    this._asyncModule = t, this._callback = e, this._timer = this._asyncModule.run(() => {
      this._timer = null, yt.delete(this), this._callback();
    });
  }
  /**
   * Cancels an active debouncer and returns a reference to itself.
   *
   * @return {void}
   */
  cancel() {
    this.isActive() && (this._cancelAsync(), yt.delete(this));
  }
  /**
   * Cancels a debouncer's async callback.
   *
   * @return {void}
   */
  _cancelAsync() {
    this.isActive() && (this._asyncModule.cancel(
      /** @type {number} */
      this._timer
    ), this._timer = null);
  }
  /**
   * Flushes an active debouncer and returns a reference to itself.
   *
   * @return {void}
   */
  flush() {
    this.isActive() && (this.cancel(), this._callback());
  }
  /**
   * Returns true if the debouncer is active.
   *
   * @return {boolean} True if active.
   */
  isActive() {
    return this._timer != null;
  }
  /**
   * Creates a debouncer if no debouncer is passed as a parameter
   * or it cancels an active debouncer otherwise. The following
   * example shows how a debouncer can be called multiple times within a
   * microtask and "debounced" such that the provided callback function is
   * called once. Add this method to a custom element:
   *
   * ```js
   * import {microTask} from '@polymer/polymer/lib/utils/async.js';
   * import {Debouncer} from '@polymer/polymer/lib/utils/debounce.js';
   * // ...
   *
   * _debounceWork() {
   *   this._debounceJob = Debouncer.debounce(this._debounceJob,
   *       microTask, () => this._doWork());
   * }
   * ```
   *
   * If the `_debounceWork` method is called multiple times within the same
   * microtask, the `_doWork` function will be called only once at the next
   * microtask checkpoint.
   *
   * Note: In testing it is often convenient to avoid asynchrony. To accomplish
   * this with a debouncer, you can use `enqueueDebouncer` and
   * `flush`. For example, extend the above example by adding
   * `enqueueDebouncer(this._debounceJob)` at the end of the
   * `_debounceWork` method. Then in a test, call `flush` to ensure
   * the debouncer has completed.
   *
   * @param {Debouncer?} debouncer Debouncer object.
   * @param {!AsyncInterface} asyncModule Object with Async interface
   * @param {function()} callback Callback to run.
   * @return {!Debouncer} Returns a debouncer object.
   */
  static debounce(t, e, i) {
    return t instanceof ti ? t._cancelAsync() : t = new ti(), t.setConfig(e, i), t;
  }
}
let yt = /* @__PURE__ */ new Set();
const Ch = function(o) {
  yt.add(o);
}, xh = function() {
  const o = !!yt.size;
  return yt.forEach((t) => {
    try {
      t.flush();
    } catch (e) {
      setTimeout(() => {
        throw e;
      });
    }
  }), o;
};
/**
@license
Copyright (c) 2017 The Polymer Project Authors. All rights reserved.
This code may only be used under the BSD style license found at http://polymer.github.io/LICENSE.txt
The complete set of authors may be found at http://polymer.github.io/AUTHORS.txt
The complete set of contributors may be found at http://polymer.github.io/CONTRIBUTORS.txt
Code distributed by Google as part of the polymer project is also
subject to an additional IP rights grant found at http://polymer.github.io/PATENTS.txt
*/
const Jn = function() {
  let o, t;
  do
    o = window.ShadyDOM && ShadyDOM.flush(), window.ShadyCSS && window.ShadyCSS.ScopingShim && window.ShadyCSS.ScopingShim.flush(), t = xh();
  while (o || t);
};
/**
@license
Copyright (c) 2017 The Polymer Project Authors. All rights reserved.
This code may only be used under the BSD style license found at http://polymer.github.io/LICENSE.txt
The complete set of authors may be found at http://polymer.github.io/AUTHORS.txt
The complete set of contributors may be found at http://polymer.github.io/CONTRIBUTORS.txt
Code distributed by Google as part of the polymer project is also
subject to an additional IP rights grant found at http://polymer.github.io/PATENTS.txt
*/
let Ko = !1;
function wh() {
  if (sn && !on) {
    if (!Ko) {
      Ko = !0;
      const o = document.createElement("style");
      o.textContent = "dom-bind,dom-if,dom-repeat{display:none;}", document.head.appendChild(o);
    }
    return !0;
  }
  return !1;
}
/**
@license
Copyright (c) 2017 The Polymer Project Authors. All rights reserved.
This code may only be used under the BSD style license found at http://polymer.github.io/LICENSE.txt
The complete set of authors may be found at http://polymer.github.io/AUTHORS.txt
The complete set of contributors may be found at http://polymer.github.io/CONTRIBUTORS.txt
Code distributed by Google as part of the polymer project is also
subject to an additional IP rights grant found at http://polymer.github.io/PATENTS.txt
*/
const Ah = ah(A);
class Qo extends Ah {
  // Not needed to find template; can be removed once the analyzer
  // can find the tag name from customElements.define call
  static get is() {
    return "dom-repeat";
  }
  static get template() {
    return null;
  }
  static get properties() {
    return {
      /**
       * An array containing items determining how many instances of the template
       * to stamp and that that each template instance should bind to.
       */
      items: {
        type: Array
      },
      /**
       * The name of the variable to add to the binding scope for the array
       * element associated with a given template instance.
       */
      as: {
        type: String,
        value: "item"
      },
      /**
       * The name of the variable to add to the binding scope with the index
       * of the instance in the sorted and filtered list of rendered items.
       * Note, for the index in the `this.items` array, use the value of the
       * `itemsIndexAs` property.
       */
      indexAs: {
        type: String,
        value: "index"
      },
      /**
       * The name of the variable to add to the binding scope with the index
       * of the instance in the `this.items` array. Note, for the index of
       * this instance in the sorted and filtered list of rendered items,
       * use the value of the `indexAs` property.
       */
      itemsIndexAs: {
        type: String,
        value: "itemsIndex"
      },
      /**
       * A function that should determine the sort order of the items.  This
       * property should either be provided as a string, indicating a method
       * name on the element's host, or else be an actual function.  The
       * function should match the sort function passed to `Array.sort`.
       * Using a sort function has no effect on the underlying `items` array.
       */
      sort: {
        type: Function,
        observer: "__sortChanged"
      },
      /**
       * A function that can be used to filter items out of the view.  This
       * property should either be provided as a string, indicating a method
       * name on the element's host, or else be an actual function.  The
       * function should match the sort function passed to `Array.filter`.
       * Using a filter function has no effect on the underlying `items` array.
       */
      filter: {
        type: Function,
        observer: "__filterChanged"
      },
      /**
       * When using a `filter` or `sort` function, the `observe` property
       * should be set to a space-separated list of the names of item
       * sub-fields that should trigger a re-sort or re-filter when changed.
       * These should generally be fields of `item` that the sort or filter
       * function depends on.
       */
      observe: {
        type: String,
        observer: "__observeChanged"
      },
      /**
       * When using a `filter` or `sort` function, the `delay` property
       * determines a debounce time in ms after a change to observed item
       * properties that must pass before the filter or sort is re-run.
       * This is useful in rate-limiting shuffling of the view when
       * item changes may be frequent.
       */
      delay: Number,
      /**
       * Count of currently rendered items after `filter` (if any) has been applied.
       * If "chunking mode" is enabled, `renderedItemCount` is updated each time a
       * set of template instances is rendered.
       *
       */
      renderedItemCount: {
        type: Number,
        notify: !go,
        readOnly: !0
      },
      /**
       * When greater than zero, defines an initial count of template instances
       * to render after setting the `items` array, before the next paint, and
       * puts the `dom-repeat` into "chunking mode".  The remaining items (and
       * any future items as a result of pushing onto the array) will be created
       * and rendered incrementally at each animation frame thereof until all
       * instances have been rendered.
       */
      initialCount: {
        type: Number
      },
      /**
       * When `initialCount` is used, this property defines a frame rate (in
       * fps) to target by throttling the number of instances rendered each
       * frame to not exceed the budget for the target frame rate.  The
       * framerate is effectively the number of `requestAnimationFrame`s that
       * it tries to allow to actually fire in a given second. It does this
       * by measuring the time between `rAF`s and continuously adjusting the
       * number of items created each `rAF` to maintain the target framerate.
       * Setting this to a higher number allows lower latency and higher
       * throughput for event handlers and other tasks, but results in a
       * longer time for the remaining items to complete rendering.
       */
      targetFramerate: {
        type: Number,
        value: 20
      },
      _targetFrameTime: {
        type: Number,
        computed: "__computeFrameTime(targetFramerate)"
      },
      /**
       * When the global `suppressTemplateNotifications` setting is used, setting
       * `notifyDomChange: true` will enable firing `dom-change` events on this
       * element.
       */
      notifyDomChange: {
        type: Boolean
      },
      /**
       * When chunking is enabled via `initialCount` and the `items` array is
       * set to a new array, this flag controls whether the previously rendered
       * instances are reused or not.
       *
       * When `true`, any previously rendered template instances are updated in
       * place to their new item values synchronously in one shot, and then any
       * further items (if any) are chunked out.  When `false`, the list is
       * returned back to its `initialCount` (any instances over the initial
       * count are discarded) and the remainder of the list is chunked back in.
       * Set this to `true` to avoid re-creating the list and losing scroll
       * position, although note that when changing the list to completely
       * different data the render thread will be blocked until all existing
       * instances are updated to their new data.
       */
      reuseChunkedInstances: {
        type: Boolean
      }
    };
  }
  static get observers() {
    return ["__itemsChanged(items.*)"];
  }
  constructor() {
    super(), this.__instances = [], this.__renderDebouncer = null, this.__itemsIdxToInstIdx = {}, this.__chunkCount = null, this.__renderStartTime = null, this.__itemsArrayChanged = !1, this.__shouldMeasureChunk = !1, this.__shouldContinueChunking = !1, this.__chunkingId = 0, this.__sortFn = null, this.__filterFn = null, this.__observePaths = null, this.__ctor = null, this.__isDetached = !0, this.template = null, this._templateInfo;
  }
  /**
   * @override
   * @return {void}
   */
  disconnectedCallback() {
    super.disconnectedCallback(), this.__isDetached = !0;
    for (let t = 0; t < this.__instances.length; t++)
      this.__detachInstance(t);
    this.__chunkingId && cancelAnimationFrame(this.__chunkingId);
  }
  /**
   * @override
   * @return {void}
   */
  connectedCallback() {
    if (super.connectedCallback(), wh() || (this.style.display = "none"), this.__isDetached) {
      this.__isDetached = !1;
      let t = S(S(this).parentNode);
      for (let e = 0; e < this.__instances.length; e++)
        this.__attachInstance(e, t);
      this.__chunkingId && this.__render();
    }
  }
  __ensureTemplatized() {
    if (!this.__ctor) {
      const t = (
        /** @type {!HTMLTemplateElement} */
        /** @type {!HTMLElement} */
        this
      );
      let e = this.template = t._templateInfo ? t : (
        /** @type {!HTMLTemplateElement} */
        this.querySelector("template")
      );
      if (!e) {
        let r = new MutationObserver(() => {
          if (this.querySelector("template"))
            r.disconnect(), this.__render();
          else
            throw new Error("dom-repeat requires a <template> child");
        });
        return r.observe(this, { childList: !0 }), !1;
      }
      let i = {};
      i[this.as] = !0, i[this.indexAs] = !0, i[this.itemsIndexAs] = !0, this.__ctor = mr(e, this, {
        mutableData: this.mutableData,
        parentModel: !0,
        instanceProps: i,
        /**
         * @this {DomRepeat}
         * @param {string} prop Property to set
         * @param {*} value Value to set property to
         */
        forwardHostProp: function(r, s) {
          let n = this.__instances;
          for (let a = 0, l; a < n.length && (l = n[a]); a++)
            l.forwardHostProp(r, s);
        },
        /**
         * @this {DomRepeat}
         * @param {Object} inst Instance to notify
         * @param {string} prop Property to notify
         * @param {*} value Value to notify
         */
        notifyInstanceProp: function(r, s, n) {
          if (Ul(this.as, s)) {
            let a = r[this.itemsIndexAs];
            s == this.as && (this.items[a] = n);
            let l = mt(this.as, `${JSCompiler_renameProperty("items", this)}.${a}`, s);
            this.notifyPath(l, n);
          }
        }
      });
    }
    return !0;
  }
  __getMethodHost() {
    return this.__dataHost._methodHost || this.__dataHost;
  }
  __functionFromPropertyValue(t) {
    if (typeof t == "string") {
      let e = t, i = this.__getMethodHost();
      return function() {
        return i[e].apply(i, arguments);
      };
    }
    return t;
  }
  __sortChanged(t) {
    this.__sortFn = this.__functionFromPropertyValue(t), this.items && this.__debounceRender(this.__render);
  }
  __filterChanged(t) {
    this.__filterFn = this.__functionFromPropertyValue(t), this.items && this.__debounceRender(this.__render);
  }
  __computeFrameTime(t) {
    return Math.ceil(1e3 / t);
  }
  __observeChanged() {
    this.__observePaths = this.observe && this.observe.replace(".*", ".").split(" ");
  }
  __handleObservedPaths(t) {
    if (this.__sortFn || this.__filterFn) {
      if (!t)
        this.__debounceRender(this.__render, this.delay);
      else if (this.__observePaths) {
        let e = this.__observePaths;
        for (let i = 0; i < e.length; i++)
          t.indexOf(e[i]) === 0 && this.__debounceRender(this.__render, this.delay);
      }
    }
  }
  __itemsChanged(t) {
    this.items && Array.isArray(this.items), this.__handleItemPath(t.path, t.value) || (t.path === "items" && (this.__itemsArrayChanged = !0), this.__debounceRender(this.__render));
  }
  /**
   * @param {function(this:DomRepeat)} fn Function to debounce.
   * @param {number=} delay Delay in ms to debounce by.
   */
  __debounceRender(t, e = 0) {
    this.__renderDebouncer = ti.debounce(
      this.__renderDebouncer,
      e > 0 ? Kl.after(e) : Ir,
      t.bind(this)
    ), Ch(this.__renderDebouncer);
  }
  /**
   * Forces the element to render its content. Normally rendering is
   * asynchronous to a provoking change. This is done for efficiency so
   * that multiple changes trigger only a single render. The render method
   * should be called if, for example, template rendering is required to
   * validate application state.
   * @return {void}
   */
  render() {
    this.__debounceRender(this.__render), Jn();
  }
  __render() {
    if (!this.__ensureTemplatized())
      return;
    let t = this.items || [];
    const e = this.__sortAndFilterItems(t), i = this.__calculateLimit(e.length);
    this.__updateInstances(t, i, e), this.initialCount && (this.__shouldMeasureChunk || this.__shouldContinueChunking) && (cancelAnimationFrame(this.__chunkingId), this.__chunkingId = requestAnimationFrame(() => {
      this.__chunkingId = null, this.__continueChunking();
    })), this._setRenderedItemCount(this.__instances.length), (!go || this.notifyDomChange) && this.dispatchEvent(new CustomEvent("dom-change", {
      bubbles: !0,
      composed: !0
    }));
  }
  __sortAndFilterItems(t) {
    let e = new Array(t.length);
    for (let i = 0; i < t.length; i++)
      e[i] = i;
    return this.__filterFn && (e = e.filter((i, r, s) => this.__filterFn(t[i], r, s))), this.__sortFn && e.sort((i, r) => this.__sortFn(t[i], t[r])), e;
  }
  __calculateLimit(t) {
    let e = t;
    const i = this.__instances.length;
    if (this.initialCount) {
      let r;
      !this.__chunkCount || this.__itemsArrayChanged && !this.reuseChunkedInstances ? (e = Math.min(t, this.initialCount), r = Math.max(e - i, 0), this.__chunkCount = r || 1) : (r = Math.min(
        Math.max(t - i, 0),
        this.__chunkCount
      ), e = Math.min(i + r, t)), this.__shouldMeasureChunk = r === this.__chunkCount, this.__shouldContinueChunking = e < t, this.__renderStartTime = performance.now();
    }
    return this.__itemsArrayChanged = !1, e;
  }
  __continueChunking() {
    if (this.__shouldMeasureChunk) {
      const t = performance.now() - this.__renderStartTime, e = this._targetFrameTime / t;
      this.__chunkCount = Math.round(this.__chunkCount * e) || 1;
    }
    this.__shouldContinueChunking && this.__debounceRender(this.__render);
  }
  __updateInstances(t, e, i) {
    const r = this.__itemsIdxToInstIdx = {};
    let s;
    for (s = 0; s < e; s++) {
      let n = this.__instances[s], a = i[s], l = t[a];
      r[a] = s, n ? (n._setPendingProperty(this.as, l), n._setPendingProperty(this.indexAs, s), n._setPendingProperty(this.itemsIndexAs, a), n._flushProperties()) : this.__insertInstance(l, s, a);
    }
    for (let n = this.__instances.length - 1; n >= s; n--)
      this.__detachAndRemoveInstance(n);
  }
  __detachInstance(t) {
    let e = this.__instances[t];
    const i = S(e.root);
    for (let r = 0; r < e.children.length; r++) {
      let s = e.children[r];
      i.appendChild(s);
    }
    return e;
  }
  __attachInstance(t, e) {
    let i = this.__instances[t];
    e.insertBefore(i.root, this);
  }
  __detachAndRemoveInstance(t) {
    this.__detachInstance(t), this.__instances.splice(t, 1);
  }
  __stampInstance(t, e, i) {
    let r = {};
    return r[this.as] = t, r[this.indexAs] = e, r[this.itemsIndexAs] = i, new this.__ctor(r);
  }
  __insertInstance(t, e, i) {
    const r = this.__stampInstance(t, e, i);
    let s = this.__instances[e + 1], n = s ? s.children[0] : this;
    return S(S(this).parentNode).insertBefore(r.root, n), this.__instances[e] = r, r;
  }
  // Implements extension point from Templatize mixin
  /**
   * Shows or hides the template instance top level child elements. For
   * text nodes, `textContent` is removed while "hidden" and replaced when
   * "shown."
   * @param {boolean} hidden Set to true to hide the children;
   * set to false to show them.
   * @return {void}
   * @protected
   */
  _showHideChildren(t) {
    for (let e = 0; e < this.__instances.length; e++)
      this.__instances[e]._showHideChildren(t);
  }
  // Called as a side effect of a host items.<key>.<path> path change,
  // responsible for notifying item.<path> changes to inst for key
  __handleItemPath(t, e) {
    let i = t.slice(6), r = i.indexOf("."), s = r < 0 ? i : i.substring(0, r);
    if (s == parseInt(s, 10)) {
      let n = r < 0 ? "" : i.substring(r + 1);
      this.__handleObservedPaths(n);
      let a = this.__itemsIdxToInstIdx[s], l = this.__instances[a];
      if (l) {
        let d = this.as + (n ? "." + n : "");
        l._setPendingPropertyOrPath(d, e, !1, !0), l._flushProperties();
      }
      return !0;
    }
  }
  /**
   * Returns the item associated with a given element stamped by
   * this `dom-repeat`.
   *
   * Note, to modify sub-properties of the item,
   * `modelForElement(el).set('item.<sub-prop>', value)`
   * should be used.
   *
   * @param {!HTMLElement} el Element for which to return the item.
   * @return {*} Item associated with the element.
   */
  itemForElement(t) {
    let e = this.modelForElement(t);
    return e && e[this.as];
  }
  /**
   * Returns the inst index for a given element stamped by this `dom-repeat`.
   * If `sort` is provided, the index will reflect the sorted order (rather
   * than the original array order).
   *
   * @param {!HTMLElement} el Element for which to return the index.
   * @return {?number} Row index associated with the element (note this may
   *   not correspond to the array index if a user `sort` is applied).
   */
  indexForElement(t) {
    let e = this.modelForElement(t);
    return e && e[this.indexAs];
  }
  /**
   * Returns the template "model" associated with a given element, which
   * serves as the binding scope for the template instance the element is
   * contained in. A template model
   * should be used to manipulate data associated with this template instance.
   *
   * Example:
   *
   *   let model = modelForElement(el);
   *   if (model.index < 10) {
   *     model.set('item.checked', true);
   *   }
   *
   * @param {!HTMLElement} el Element for which to return a template model.
   * @return {TemplateInstanceBase} Model representing the binding scope for
   *   the element.
   */
  modelForElement(t) {
    return yh(this.template, t);
  }
}
customElements.define(Qo.is, Qo);
/**
 * @license
 * Copyright (c) 2016 - 2023 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
function kh(o) {
  let t = o.getDay();
  t === 0 && (t = 7);
  const e = 4 - t, i = new Date(o.getTime() + e * 24 * 3600 * 1e3), r = new Date(0, 0);
  r.setFullYear(i.getFullYear());
  const s = i.getTime() - r.getTime(), n = Math.round(s / (24 * 3600 * 1e3));
  return Math.floor(n / 7 + 1);
}
function N(o, t) {
  return o instanceof Date && t instanceof Date && o.getFullYear() === t.getFullYear() && o.getMonth() === t.getMonth() && o.getDate() === t.getDate();
}
function at(o, t, e) {
  return (!t || o >= t) && (!e || o <= e);
}
function ea(o, t) {
  return t.filter((e) => e !== void 0).reduce((e, i) => {
    if (!i)
      return e;
    if (!e)
      return i;
    const r = Math.abs(o.getTime() - i.getTime()), s = Math.abs(e.getTime() - o.getTime());
    return r < s ? i : e;
  });
}
function ta(o) {
  return {
    day: o.getDate(),
    month: o.getMonth(),
    year: o.getFullYear()
  };
}
function ia(o) {
  const t = /* @__PURE__ */ new Date(), e = new Date(t);
  return e.setDate(1), e.setMonth(parseInt(o) + t.getMonth()), e;
}
function Eh(o, t, e = 0, i = 1) {
  if (t > 99)
    throw new Error("The provided year cannot have more than 2 digits.");
  if (t < 0)
    throw new Error("The provided year cannot be negative.");
  let r = t + Math.floor(o.getFullYear() / 100) * 100;
  return o < new Date(r - 50, e, i) ? r -= 100 : o > new Date(r + 50, e, i) && (r += 100), r;
}
function Oe(o) {
  const t = /^([-+]\d{1}|\d{2,4}|[-+]\d{6})-(\d{1,2})-(\d{1,2})$/u.exec(o);
  if (!t)
    return;
  const e = new Date(0, 0);
  return e.setFullYear(parseInt(t[1], 10)), e.setMonth(parseInt(t[2], 10) - 1), e.setDate(parseInt(t[3], 10)), e;
}
/**
 * @license
 * Copyright (c) 2016 - 2023 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
class Zo extends ui(O(A)) {
  static get template() {
    return k`
      <style>
        :host {
          display: block;
        }

        #monthGrid {
          width: 100%;
          border-collapse: collapse;
        }

        #days-container tr,
        #weekdays-container tr {
          display: flex;
        }

        [part~='date'] {
          outline: none;
        }

        [part~='disabled'] {
          pointer-events: none;
        }

        [part='week-number'][hidden],
        [part='weekday'][hidden] {
          display: none;
        }

        [part='weekday'],
        [part~='date'] {
          width: calc(100% / 7);
          padding: 0;
          font-weight: normal;
        }

        [part='weekday']:empty,
        [part='week-number'] {
          width: 12.5%;
          flex-shrink: 0;
          padding: 0;
        }

        :host([week-numbers]) [part='weekday']:not(:empty),
        :host([week-numbers]) [part~='date'] {
          width: 12.5%;
        }

        @media (forced-colors: active) {
          [part~='date'][part~='focused'] {
            outline: 1px solid;
          }
          [part~='date'][part~='selected'] {
            outline: 3px solid;
          }
        }
      </style>

      <div part="month-header" id="month-header" aria-hidden="true">[[_getTitle(month, i18n.monthNames)]]</div>
      <table
        id="monthGrid"
        role="grid"
        aria-labelledby="month-header"
        on-touchend="_preventDefault"
        on-touchstart="_onMonthGridTouchStart"
      >
        <thead id="weekdays-container">
          <tr role="row" part="weekdays">
            <th
              part="weekday"
              aria-hidden="true"
              hidden$="[[!_showWeekSeparator(showWeekNumbers, i18n.firstDayOfWeek)]]"
            ></th>
            <template
              is="dom-repeat"
              items="[[_getWeekDayNames(i18n.weekdays, i18n.weekdaysShort, showWeekNumbers, i18n.firstDayOfWeek)]]"
            >
              <th role="columnheader" part="weekday" scope="col" abbr$="[[item.weekDay]]" aria-hidden="true">
                [[item.weekDayShort]]
              </th>
            </template>
          </tr>
        </thead>
        <tbody id="days-container">
          <template is="dom-repeat" items="[[_weeks]]" as="week">
            <tr role="row">
              <td
                part="week-number"
                aria-hidden="true"
                hidden$="[[!_showWeekSeparator(showWeekNumbers, i18n.firstDayOfWeek)]]"
              >
                [[__getWeekNumber(week)]]
              </td>
              <template is="dom-repeat" items="[[week]]">
                <td
                  role="gridcell"
                  part$="[[__getDatePart(item, focusedDate, selectedDate, minDate, maxDate)]]"
                  date="[[item]]"
                  tabindex$="[[__getDayTabindex(item, focusedDate)]]"
                  disabled$="[[__isDayDisabled(item, minDate, maxDate)]]"
                  aria-selected$="[[__getDayAriaSelected(item, selectedDate)]]"
                  aria-disabled$="[[__getDayAriaDisabled(item, minDate, maxDate)]]"
                  aria-label$="[[__getDayAriaLabel(item)]]"
                  >[[_getDate(item)]]</td
                >
              </template>
            </tr>
          </template>
        </tbody>
      </table>
    `;
  }
  static get is() {
    return "vaadin-month-calendar";
  }
  static get properties() {
    return {
      /**
       * A `Date` object defining the month to be displayed. Only year and
       * month properties are actually used.
       */
      month: {
        type: Date,
        value: /* @__PURE__ */ new Date()
      },
      /**
       * A `Date` object for the currently selected date.
       */
      selectedDate: {
        type: Date,
        notify: !0
      },
      /**
       * A `Date` object for the currently focused date.
       */
      focusedDate: Date,
      showWeekNumbers: {
        type: Boolean,
        value: !1
      },
      i18n: {
        type: Object
      },
      /**
       * Flag stating whether taps on the component should be ignored.
       */
      ignoreTaps: Boolean,
      _notTapping: Boolean,
      /**
       * The earliest date that can be selected. All earlier dates will be disabled.
       */
      minDate: {
        type: Date,
        value: null
      },
      /**
       * The latest date that can be selected. All later dates will be disabled.
       */
      maxDate: {
        type: Date,
        value: null
      },
      _days: {
        type: Array,
        computed: "_getDays(month, i18n.firstDayOfWeek, minDate, maxDate)"
      },
      _weeks: {
        type: Array,
        computed: "_getWeeks(_days)"
      },
      disabled: {
        type: Boolean,
        reflectToAttribute: !0,
        computed: "_isDisabled(month, minDate, maxDate)"
      }
    };
  }
  static get observers() {
    return [
      "_showWeekNumbersChanged(showWeekNumbers, i18n.firstDayOfWeek)",
      "__focusedDateChanged(focusedDate, _days)"
    ];
  }
  get focusableDateElement() {
    return [...this.shadowRoot.querySelectorAll("[part~=date]")].find((t) => N(t.date, this.focusedDate));
  }
  /** @protected */
  ready() {
    super.ready(), V(this.$.monthGrid, "tap", this._handleTap.bind(this));
  }
  /* Returns true if all the dates in the month are out of the allowed range */
  _isDisabled(t, e, i) {
    const r = new Date(0, 0);
    r.setFullYear(t.getFullYear()), r.setMonth(t.getMonth()), r.setDate(1);
    const s = new Date(0, 0);
    return s.setFullYear(t.getFullYear()), s.setMonth(t.getMonth() + 1), s.setDate(0), e && i && e.getMonth() === i.getMonth() && e.getMonth() === t.getMonth() && i.getDate() - e.getDate() >= 0 ? !1 : !at(r, e, i) && !at(s, e, i);
  }
  _getTitle(t, e) {
    if (!(t === void 0 || e === void 0))
      return this.i18n.formatTitle(e[t.getMonth()], t.getFullYear());
  }
  _onMonthGridTouchStart() {
    this._notTapping = !1, setTimeout(() => {
      this._notTapping = !0;
    }, 300);
  }
  _dateAdd(t, e) {
    t.setDate(t.getDate() + e);
  }
  _applyFirstDayOfWeek(t, e) {
    if (!(t === void 0 || e === void 0))
      return t.slice(e).concat(t.slice(0, e));
  }
  _getWeekDayNames(t, e, i, r) {
    if (!(t === void 0 || e === void 0 || i === void 0 || r === void 0))
      return t = this._applyFirstDayOfWeek(t, r), e = this._applyFirstDayOfWeek(e, r), t = t.map((s, n) => ({
        weekDay: s,
        weekDayShort: e[n]
      })), t;
  }
  __focusedDateChanged(t, e) {
    e.some((i) => N(i, t)) ? this.removeAttribute("aria-hidden") : this.setAttribute("aria-hidden", "true");
  }
  _getDate(t) {
    return t ? t.getDate() : "";
  }
  _showWeekNumbersChanged(t, e) {
    t && e === 1 ? this.setAttribute("week-numbers", "") : this.removeAttribute("week-numbers");
  }
  _showWeekSeparator(t, e) {
    return t && e === 1;
  }
  _isToday(t) {
    return N(/* @__PURE__ */ new Date(), t);
  }
  _getDays(t, e) {
    if (t === void 0 || e === void 0)
      return;
    const i = new Date(0, 0);
    for (i.setFullYear(t.getFullYear()), i.setMonth(t.getMonth()), i.setDate(1); i.getDay() !== e; )
      this._dateAdd(i, -1);
    const r = [], s = i.getMonth(), n = t.getMonth();
    for (; i.getMonth() === n || i.getMonth() === s; )
      r.push(i.getMonth() === n ? new Date(i.getTime()) : null), this._dateAdd(i, 1);
    return r;
  }
  _getWeeks(t) {
    return t.reduce((e, i, r) => (r % 7 === 0 && e.push([]), e[e.length - 1].push(i), e), []);
  }
  _handleTap(t) {
    !this.ignoreTaps && !this._notTapping && t.target.date && !t.target.hasAttribute("disabled") && (this.selectedDate = t.target.date, this.dispatchEvent(
      new CustomEvent("date-tap", { detail: { date: t.target.date }, bubbles: !0, composed: !0 })
    ));
  }
  _preventDefault(t) {
    t.preventDefault();
  }
  __getDatePart(t, e, i, r, s) {
    const n = ["date"];
    return this.__isDayDisabled(t, r, s) && n.push("disabled"), this.__isDayFocused(t, e) && n.push("focused"), this.__isDaySelected(t, i) && n.push("selected"), this._isToday(t) && n.push("today"), n.join(" ");
  }
  __getWeekNumber(t) {
    const e = t.reduce((i, r) => !i && r ? r : i);
    return kh(e);
  }
  __isDayFocused(t, e) {
    return N(t, e);
  }
  __isDaySelected(t, e) {
    return N(t, e);
  }
  __getDayAriaSelected(t, e) {
    if (this.__isDaySelected(t, e))
      return "true";
  }
  __isDayDisabled(t, e, i) {
    return !at(t, e, i);
  }
  __getDayAriaDisabled(t, e, i) {
    if (!(t === void 0 || e === void 0 || i === void 0) && this.__isDayDisabled(t, e, i))
      return "true";
  }
  __getDayAriaLabel(t) {
    if (!t)
      return "";
    let e = `${this._getDate(t)} ${this.i18n.monthNames[t.getMonth()]} ${t.getFullYear()}, ${this.i18n.weekdays[t.getDay()]}`;
    return this._isToday(t) && (e += `, ${this.i18n.today}`), e;
  }
  __getDayTabindex(t, e) {
    return this.__isDayFocused(t, e) ? "0" : "-1";
  }
}
customElements.define(Zo.is, Zo);
/**
 * @license
 * Copyright (c) 2016 - 2023 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
class ra extends A {
  static get template() {
    return k`
      <style>
        :host {
          display: block;
          overflow: hidden;
          height: 500px;
        }

        #scroller {
          position: relative;
          height: 100%;
          overflow: auto;
          outline: none;
          margin-right: -40px;
          -webkit-overflow-scrolling: touch;
          overflow-x: hidden;
        }

        #scroller.notouchscroll {
          -webkit-overflow-scrolling: auto;
        }

        #scroller::-webkit-scrollbar {
          display: none;
        }

        .buffer {
          position: absolute;
          width: var(--vaadin-infinite-scroller-buffer-width, 100%);
          box-sizing: border-box;
          padding-right: 40px;
          top: var(--vaadin-infinite-scroller-buffer-offset, 0);
          animation: fadein 0.2s;
        }

        @keyframes fadein {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }
      </style>

      <div id="scroller" on-scroll="_scroll">
        <div class="buffer"></div>
        <div class="buffer"></div>
        <div id="fullHeight"></div>
      </div>
    `;
  }
  static get properties() {
    return {
      /**
       * Count of individual items in each buffer.
       * The scroller has 2 buffers altogether so bufferSize of 20
       * will result in 40 buffered DOM items in total.
       * Changing after initialization not supported.
       */
      bufferSize: {
        type: Number,
        value: 20
      },
      /**
       * The amount of initial scroll top. Needed in order for the
       * user to be able to scroll backwards.
       * @private
       */
      _initialScroll: {
        value: 5e5
      },
      /**
       * The index/position mapped at _initialScroll point.
       * @private
       */
      _initialIndex: {
        value: 0
      },
      /** @private */
      _buffers: Array,
      /** @private */
      _preventScrollEvent: Boolean,
      /** @private */
      _mayHaveMomentum: Boolean,
      /** @private */
      _initialized: Boolean,
      active: {
        type: Boolean,
        observer: "_activated"
      }
    };
  }
  /**
   * @return {number}
   */
  get bufferOffset() {
    return this._buffers[0].offsetTop;
  }
  /**
   * @return {number}
   */
  get itemHeight() {
    if (!this._itemHeightVal) {
      const t = getComputedStyle(this).getPropertyValue("--vaadin-infinite-scroller-item-height"), e = "background-position";
      this.$.fullHeight.style.setProperty(e, t);
      const i = getComputedStyle(this.$.fullHeight).getPropertyValue(e);
      this.$.fullHeight.style.removeProperty(e), this._itemHeightVal = parseFloat(i);
    }
    return this._itemHeightVal;
  }
  /** @private */
  get _bufferHeight() {
    return this.itemHeight * this.bufferSize;
  }
  /**
   * @return {number}
   */
  get position() {
    return (this.$.scroller.scrollTop - this._buffers[0].translateY) / this.itemHeight + this._firstIndex;
  }
  /**
   * Current scroller position as index. Can be a fractional number.
   *
   * @type {number}
   */
  set position(t) {
    this._preventScrollEvent = !0, t > this._firstIndex && t < this._firstIndex + this.bufferSize * 2 ? this.$.scroller.scrollTop = this.itemHeight * (t - this._firstIndex) + this._buffers[0].translateY : (this._initialIndex = ~~t, this._reset(), this._scrollDisabled = !0, this.$.scroller.scrollTop += t % 1 * this.itemHeight, this._scrollDisabled = !1), this._mayHaveMomentum && (this.$.scroller.classList.add("notouchscroll"), this._mayHaveMomentum = !1, setTimeout(() => {
      this.$.scroller.classList.remove("notouchscroll");
    }, 10));
  }
  /** @protected */
  ready() {
    super.ready(), this._buffers = [...this.shadowRoot.querySelectorAll(".buffer")], this.$.fullHeight.style.height = `${this._initialScroll * 2}px`, Pn && (this.$.scroller.tabIndex = -1);
  }
  /**
   * Force the scroller to update clones after a reset, without
   * waiting for the debouncer to resolve.
   */
  forceUpdate() {
    this._debouncerUpdateClones && (this._buffers[0].updated = this._buffers[1].updated = !1, this._updateClones(), this._debouncerUpdateClones.cancel());
  }
  /**
   * @protected
   * @override
   */
  _createElement() {
  }
  /**
   * @param {HTMLElement} _element
   * @param {number} _index
   * @protected
   * @override
   */
  _updateElement(t, e) {
  }
  /** @private */
  _activated(t) {
    t && !this._initialized && (this._createPool(), this._initialized = !0);
  }
  /** @private */
  _finishInit() {
    this._initDone || (this._buffers.forEach((t) => {
      [...t.children].forEach((e) => {
        this._ensureStampedInstance(e._itemWrapper);
      });
    }), this._buffers[0].translateY || this._reset(), this._initDone = !0, this.dispatchEvent(new CustomEvent("init-done")));
  }
  /** @private */
  _translateBuffer(t) {
    const e = t ? 1 : 0;
    this._buffers[e].translateY = this._buffers[e ? 0 : 1].translateY + this._bufferHeight * (e ? -1 : 1), this._buffers[e].style.transform = `translate3d(0, ${this._buffers[e].translateY}px, 0)`, this._buffers[e].updated = !1, this._buffers.reverse();
  }
  /** @private */
  _scroll() {
    if (this._scrollDisabled)
      return;
    const t = this.$.scroller.scrollTop;
    (t < this._bufferHeight || t > this._initialScroll * 2 - this._bufferHeight) && (this._initialIndex = ~~this.position, this._reset());
    const e = this.itemHeight + this.bufferOffset, i = t > this._buffers[1].translateY + e, r = t < this._buffers[0].translateY + e;
    (i || r) && (this._translateBuffer(r), this._updateClones()), this._preventScrollEvent || (this.dispatchEvent(new CustomEvent("custom-scroll", { bubbles: !1, composed: !0 })), this._mayHaveMomentum = !0), this._preventScrollEvent = !1, this._debouncerScrollFinish = w.debounce(this._debouncerScrollFinish, L.after(200), () => {
      const s = this.$.scroller.getBoundingClientRect();
      !this._isVisible(this._buffers[0], s) && !this._isVisible(this._buffers[1], s) && (this.position = this.position);
    });
  }
  /** @private */
  _reset() {
    this._scrollDisabled = !0, this.$.scroller.scrollTop = this._initialScroll, this._buffers[0].translateY = this._initialScroll - this._bufferHeight, this._buffers[1].translateY = this._initialScroll, this._buffers.forEach((t) => {
      t.style.transform = `translate3d(0, ${t.translateY}px, 0)`;
    }), this._buffers[0].updated = this._buffers[1].updated = !1, this._updateClones(!0), this._debouncerUpdateClones = w.debounce(this._debouncerUpdateClones, L.after(200), () => {
      this._buffers[0].updated = this._buffers[1].updated = !1, this._updateClones();
    }), this._scrollDisabled = !1;
  }
  /** @private */
  _createPool() {
    const t = this.getBoundingClientRect();
    this._buffers.forEach((e) => {
      for (let i = 0; i < this.bufferSize; i++) {
        const r = document.createElement("div");
        r.style.height = `${this.itemHeight}px`, r.instance = {};
        const s = `vaadin-infinite-scroller-item-content-${Fr()}`, n = document.createElement("slot");
        n.setAttribute("name", s), n._itemWrapper = r, e.appendChild(n), r.setAttribute("slot", s), this.appendChild(r), this._isVisible(r, t) && this._ensureStampedInstance(r);
      }
    }), Dr(this, () => {
      this._finishInit();
    });
  }
  /** @private */
  _ensureStampedInstance(t) {
    if (t.firstElementChild)
      return;
    const e = t.instance;
    t.instance = this._createElement(), t.appendChild(t.instance), Object.keys(e).forEach((i) => {
      t.instance.set(i, e[i]);
    });
  }
  /** @private */
  _updateClones(t) {
    this._firstIndex = ~~((this._buffers[0].translateY - this._initialScroll) / this.itemHeight) + this._initialIndex;
    const e = t ? this.$.scroller.getBoundingClientRect() : void 0;
    this._buffers.forEach((i, r) => {
      if (!i.updated) {
        const s = this._firstIndex + this.bufferSize * r;
        [...i.children].forEach((n, a) => {
          const l = n._itemWrapper;
          (!t || this._isVisible(l, e)) && this._updateElement(l.instance, s + a);
        }), i.updated = !0;
      }
    });
  }
  /** @private */
  _isVisible(t, e) {
    const i = t.getBoundingClientRect();
    return i.bottom > e.top && i.top < e.bottom;
  }
}
/**
 * @license
 * Copyright (c) 2016 - 2023 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
const Sh = k`
  <style>
    :host {
      --vaadin-infinite-scroller-item-height: 270px;
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      height: 100%;
    }
  </style>
`;
let Nt;
class Xo extends ra {
  static get is() {
    return "vaadin-date-picker-month-scroller";
  }
  static get template() {
    return Nt || (Nt = super.template.cloneNode(!0), Nt.content.appendChild(Sh.content.cloneNode(!0))), Nt;
  }
  static get properties() {
    return {
      bufferSize: {
        type: Number,
        value: 3
      }
    };
  }
  /**
   * @protected
   * @override
   */
  _createElement() {
    return document.createElement("vaadin-month-calendar");
  }
  /**
   * @param {HTMLElement} element
   * @param {number} index
   * @protected
   * @override
   */
  _updateElement(t, e) {
    t.month = ia(e);
  }
}
customElements.define(Xo.is, Xo);
/**
 * @license
 * Copyright (c) 2016 - 2023 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
const Ih = k`
  <style>
    :host {
      --vaadin-infinite-scroller-item-height: 80px;
      width: 50px;
      display: block;
      height: 100%;
      position: absolute;
      right: 0;
      transform: translateX(100%);
      -webkit-tap-highlight-color: transparent;
      -webkit-user-select: none;
      -moz-user-select: none;
      user-select: none;
      /* Center the year scroller position. */
      --vaadin-infinite-scroller-buffer-offset: 50%;
    }

    :host::before {
      content: '';
      display: block;
      background: transparent;
      width: 0;
      height: 0;
      position: absolute;
      left: 0;
      top: 50%;
      transform: translateY(-50%);
      border-width: 6px;
      border-style: solid;
      border-color: transparent;
      border-left-color: #000;
    }
  </style>
`;
let Lt;
class Jo extends ra {
  static get is() {
    return "vaadin-date-picker-year-scroller";
  }
  static get template() {
    return Lt || (Lt = super.template.cloneNode(!0), Lt.content.appendChild(Ih.content.cloneNode(!0))), Lt;
  }
  static get properties() {
    return {
      bufferSize: {
        type: Number,
        value: 12
      }
    };
  }
  /**
   * @protected
   * @override
   */
  _createElement() {
    return document.createElement("vaadin-date-picker-year");
  }
  /**
   * @param {HTMLElement} element
   * @param {number} index
   * @protected
   * @override
   */
  _updateElement(t, e) {
    t.year = this._yearAfterXYears(e);
  }
  /** @private */
  _yearAfterXYears(t) {
    const e = /* @__PURE__ */ new Date(), i = new Date(e);
    return i.setFullYear(parseInt(t) + e.getFullYear()), i.getFullYear();
  }
}
customElements.define(Jo.is, Jo);
/**
 * @license
 * Copyright (c) 2016 - 2023 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
class es extends O(A) {
  static get is() {
    return "vaadin-date-picker-year";
  }
  static get template() {
    return k`
      <style>
        :host {
          display: block;
          height: 100%;
        }
      </style>
      <div part="year-number">[[year]]</div>
      <div part="year-separator" aria-hidden="true"></div>
    `;
  }
  static get properties() {
    return {
      year: {
        type: String
      },
      selectedDate: {
        type: Object
      }
    };
  }
  static get observers() {
    return ["__updateSelected(year, selectedDate)"];
  }
  /** @private */
  __updateSelected(t, e) {
    this.toggleAttribute("selected", e && e.getFullYear() === t), this.toggleAttribute("current", t === (/* @__PURE__ */ new Date()).getFullYear());
  }
}
customElements.define(es.is, es);
/**
 * @license
 * Copyright (c) 2021 - 2023 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
class oa {
  constructor(t, e) {
    this.query = t, this.callback = e, this._boundQueryHandler = this._queryHandler.bind(this);
  }
  hostConnected() {
    this._removeListener(), this._mediaQuery = window.matchMedia(this.query), this._addListener(), this._queryHandler(this._mediaQuery);
  }
  hostDisconnected() {
    this._removeListener();
  }
  /** @private */
  _addListener() {
    this._mediaQuery && this._mediaQuery.addListener(this._boundQueryHandler);
  }
  /** @private */
  _removeListener() {
    this._mediaQuery && this._mediaQuery.removeListener(this._boundQueryHandler), this._mediaQuery = null;
  }
  /** @private */
  _queryHandler(t) {
    typeof this.callback == "function" && this.callback(t.matches);
  }
}
/**
 * @license
 * Copyright (c) 2016 - 2023 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
class ts extends ie(O(te(A))) {
  static get template() {
    return k`
      <style>
        :host {
          display: flex;
          flex-direction: column;
          height: 100%;
          width: 100%;
          outline: none;
        }

        [part='overlay-header'] {
          display: flex;
          flex-shrink: 0;
          flex-wrap: nowrap;
          align-items: center;
        }

        :host(:not([fullscreen])) [part='overlay-header'] {
          display: none;
        }

        [part='label'] {
          flex-grow: 1;
        }

        [hidden] {
          display: none !important;
        }

        [part='years-toggle-button'] {
          display: flex;
        }

        #scrollers {
          display: flex;
          height: 100%;
          width: 100%;
          position: relative;
          overflow: hidden;
        }

        :host([desktop]) ::slotted([slot='months']) {
          right: 50px;
          transform: none !important;
        }

        :host([desktop]) ::slotted([slot='years']) {
          transform: none !important;
        }

        :host(.animate) ::slotted([slot='months']),
        :host(.animate) ::slotted([slot='years']) {
          transition: all 200ms;
        }

        [part='toolbar'] {
          display: flex;
          justify-content: space-between;
          z-index: 2;
          flex-shrink: 0;
        }
      </style>

      <div part="overlay-header" on-touchend="_preventDefault" aria-hidden="true">
        <div part="label">[[_formatDisplayed(selectedDate, i18n.formatDate, label)]]</div>
        <div part="clear-button" hidden$="[[!selectedDate]]"></div>
        <div part="toggle-button"></div>

        <div part="years-toggle-button" hidden$="[[_desktopMode]]" aria-hidden="true">
          [[_yearAfterXMonths(_visibleMonthIndex)]]
        </div>
      </div>

      <div id="scrollers">
        <slot name="months"></slot>
        <slot name="years"></slot>
      </div>

      <div on-touchend="_preventDefault" role="toolbar" part="toolbar">
        <slot name="today-button"></slot>
        <slot name="cancel-button"></slot>
      </div>
    `;
  }
  static get is() {
    return "vaadin-date-picker-overlay-content";
  }
  static get properties() {
    return {
      scrollDuration: {
        type: Number,
        value: 300
      },
      /**
       * The value for this element.
       */
      selectedDate: {
        type: Date,
        value: null
      },
      /**
       * Date value which is focused using keyboard.
       */
      focusedDate: {
        type: Date,
        notify: !0,
        observer: "_focusedDateChanged"
      },
      _focusedMonthDate: Number,
      /**
       * Date which should be visible when there is no value selected.
       */
      initialPosition: {
        type: Date,
        observer: "_initialPositionChanged"
      },
      _originDate: {
        value: /* @__PURE__ */ new Date()
      },
      _visibleMonthIndex: Number,
      _desktopMode: {
        type: Boolean,
        observer: "_desktopModeChanged"
      },
      _desktopMediaQuery: {
        type: String,
        value: "(min-width: 375px)"
      },
      _translateX: {
        observer: "_translateXChanged"
      },
      _yearScrollerWidth: {
        value: 50
      },
      i18n: {
        type: Object
      },
      showWeekNumbers: {
        type: Boolean,
        value: !1
      },
      _ignoreTaps: Boolean,
      _notTapping: Boolean,
      /**
       * The earliest date that can be selected. All earlier dates will be disabled.
       */
      minDate: Date,
      /**
       * The latest date that can be selected. All later dates will be disabled.
       */
      maxDate: Date,
      /**
       * Input label
       */
      label: String,
      _cancelButton: {
        type: Object
      },
      _todayButton: {
        type: Object
      },
      calendars: {
        type: Array,
        value: () => []
      },
      years: {
        type: Array,
        value: () => []
      }
    };
  }
  static get observers() {
    return [
      "__updateCalendars(calendars, i18n, minDate, maxDate, selectedDate, focusedDate, showWeekNumbers, _ignoreTaps, _theme)",
      "__updateCancelButton(_cancelButton, i18n)",
      "__updateTodayButton(_todayButton, i18n, minDate, maxDate)",
      "__updateYears(years, selectedDate, _theme)"
    ];
  }
  /**
   * Whether to scroll to a sub-month position when scrolling to a date.
   * This is active if the month scroller is not large enough to fit a
   * full month. In that case we want to scroll to a position between
   * two months in order to have the focused date in the visible area.
   * @returns {boolean} whether to use sub-month scrolling
   * @private
   */
  get __useSubMonthScrolling() {
    return this._monthScroller.clientHeight < this._monthScroller.itemHeight + this._monthScroller.bufferOffset;
  }
  get focusableDateElement() {
    return this.calendars.map((t) => t.focusableDateElement).find(Boolean);
  }
  ready() {
    super.ready(), this.setAttribute("role", "dialog"), V(this.$.scrollers, "track", this._track.bind(this)), V(this.shadowRoot.querySelector('[part="clear-button"]'), "tap", this._clear.bind(this)), V(this.shadowRoot.querySelector('[part="toggle-button"]'), "tap", this._cancel.bind(this)), V(
      this.shadowRoot.querySelector('[part="years-toggle-button"]'),
      "tap",
      this._toggleYearScroller.bind(this)
    ), this.addController(
      new oa(this._desktopMediaQuery, (t) => {
        this._desktopMode = t;
      })
    ), this.addController(
      new X(this, "today-button", "vaadin-button", {
        observe: !1,
        initializer: (t) => {
          t.setAttribute("theme", "tertiary"), t.addEventListener("keydown", (e) => this.__onTodayButtonKeyDown(e)), V(t, "tap", this._onTodayTap.bind(this)), this._todayButton = t;
        }
      })
    ), this.addController(
      new X(this, "cancel-button", "vaadin-button", {
        observe: !1,
        initializer: (t) => {
          t.setAttribute("theme", "tertiary"), t.addEventListener("keydown", (e) => this.__onCancelButtonKeyDown(e)), V(t, "tap", this._cancel.bind(this)), this._cancelButton = t;
        }
      })
    ), this.__initMonthScroller(), this.__initYearScroller();
  }
  /**
   * Fired when the scroller reaches the target scrolling position.
   * @event scroll-animation-finished
   * @param {Number} detail.position new position
   * @param {Number} detail.oldPosition old position
   */
  connectedCallback() {
    super.connectedCallback(), this._closeYearScroller(), this._toggleAnimateClass(!0), jn(this.$.scrollers, "pan-y");
  }
  /**
   * Focuses the cancel button
   */
  focusCancel() {
    this._cancelButton.focus();
  }
  /**
   * Scrolls the list to the given Date.
   */
  scrollToDate(t, e) {
    const i = this.__useSubMonthScrolling ? this._calculateWeekScrollOffset(t) : 0;
    this._scrollToPosition(this._differenceInMonths(t, this._originDate) + i, e), this._monthScroller.forceUpdate();
  }
  __initMonthScroller() {
    this.addController(
      new X(this, "months", "vaadin-date-picker-month-scroller", {
        observe: !1,
        initializer: (t) => {
          t.addEventListener("custom-scroll", () => {
            this._onMonthScroll();
          }), t.addEventListener("touchstart", () => {
            this._onMonthScrollTouchStart();
          }), t.addEventListener("keydown", (e) => {
            this.__onMonthCalendarKeyDown(e);
          }), t.addEventListener("init-done", () => {
            const e = [...this.querySelectorAll("vaadin-month-calendar")];
            e.forEach((i) => {
              i.addEventListener("selected-date-changed", (r) => {
                this.selectedDate = r.detail.value;
              });
            }), this.calendars = e;
          }), this._monthScroller = t;
        }
      })
    );
  }
  __initYearScroller() {
    this.addController(
      new X(this, "years", "vaadin-date-picker-year-scroller", {
        observe: !1,
        initializer: (t) => {
          t.setAttribute("aria-hidden", "true"), V(t, "tap", (e) => {
            this._onYearTap(e);
          }), t.addEventListener("custom-scroll", () => {
            this._onYearScroll();
          }), t.addEventListener("touchstart", () => {
            this._onYearScrollTouchStart();
          }), t.addEventListener("init-done", () => {
            this.years = [...this.querySelectorAll("vaadin-date-picker-year")];
          }), this._yearScroller = t;
        }
      })
    );
  }
  __updateCancelButton(t, e) {
    t && (t.textContent = e && e.cancel);
  }
  __updateTodayButton(t, e, i, r) {
    t && (t.textContent = e && e.today, t.disabled = !this._isTodayAllowed(i, r));
  }
  // eslint-disable-next-line max-params
  __updateCalendars(t, e, i, r, s, n, a, l, d) {
    t && t.length && t.forEach((c) => {
      c.setProperties({
        i18n: e,
        minDate: i,
        maxDate: r,
        focusedDate: n,
        selectedDate: s,
        showWeekNumbers: a,
        ignoreTaps: l
      }), d ? c.setAttribute("theme", d) : c.removeAttribute("theme");
    });
  }
  __updateYears(t, e, i) {
    t && t.length && t.forEach((r) => {
      r.selectedDate = e, i ? r.setAttribute("theme", i) : r.removeAttribute("theme");
    });
  }
  /**
   * Select a date and fire event indicating user interaction.
   * @protected
   */
  _selectDate(t) {
    this.selectedDate = t, this.dispatchEvent(
      new CustomEvent("date-selected", { detail: { date: t }, bubbles: !0, composed: !0 })
    );
  }
  _desktopModeChanged(t) {
    this.toggleAttribute("desktop", t);
  }
  _focusedDateChanged(t) {
    this.revealDate(t);
  }
  /**
   * Scrolls the month and year scrollers enough to reveal the given date.
   */
  revealDate(t, e = !0) {
    if (!t)
      return;
    const i = this._differenceInMonths(t, this._originDate);
    if (this.__useSubMonthScrolling) {
      const l = this._calculateWeekScrollOffset(t);
      this._scrollToPosition(i + l, e);
      return;
    }
    const r = this._monthScroller.position > i, n = Math.max(
      this._monthScroller.itemHeight,
      this._monthScroller.clientHeight - this._monthScroller.bufferOffset * 2
    ) / this._monthScroller.itemHeight, a = this._monthScroller.position + n - 1 < i;
    r ? this._scrollToPosition(i, e) : a && this._scrollToPosition(i - n + 1, e);
  }
  /**
   * Calculates an offset to be added to the month scroll position
   * when using sub-month scrolling, in order ensure that the week
   * that the date is in is visible even for small scroll areas.
   * As the month scroller uses a month as minimal scroll unit
   * (a value of `1` equals one month), we can not exactly identify
   * the position of a specific week. This is a best effort
   * implementation based on manual testing.
   * @param date the date for which to calculate the offset
   * @returns {number} the offset
   * @private
   */
  _calculateWeekScrollOffset(t) {
    const e = new Date(0, 0);
    e.setFullYear(t.getFullYear()), e.setMonth(t.getMonth()), e.setDate(1);
    let i = 0;
    for (; e.getDate() < t.getDate(); )
      e.setDate(e.getDate() + 1), e.getDay() === this.i18n.firstDayOfWeek && (i += 1);
    return i / 6;
  }
  _initialPositionChanged(t) {
    this._monthScroller && this._yearScroller && (this._monthScroller.active = !0, this._yearScroller.active = !0), this.scrollToDate(t);
  }
  _repositionYearScroller() {
    const t = this._monthScroller.position;
    this._visibleMonthIndex = Math.floor(t), this._yearScroller.position = (t + this._originDate.getMonth()) / 12;
  }
  _repositionMonthScroller() {
    this._monthScroller.position = this._yearScroller.position * 12 - this._originDate.getMonth(), this._visibleMonthIndex = Math.floor(this._monthScroller.position);
  }
  _onMonthScroll() {
    this._repositionYearScroller(), this._doIgnoreTaps();
  }
  _onYearScroll() {
    this._repositionMonthScroller(), this._doIgnoreTaps();
  }
  _onYearScrollTouchStart() {
    this._notTapping = !1, setTimeout(() => {
      this._notTapping = !0;
    }, 300), this._repositionMonthScroller();
  }
  _onMonthScrollTouchStart() {
    this._repositionYearScroller();
  }
  _doIgnoreTaps() {
    this._ignoreTaps = !0, this._debouncer = w.debounce(this._debouncer, L.after(300), () => {
      this._ignoreTaps = !1;
    });
  }
  _formatDisplayed(t, e, i) {
    return t ? e(ta(t)) : i;
  }
  _onTodayTap() {
    const t = /* @__PURE__ */ new Date();
    Math.abs(this._monthScroller.position - this._differenceInMonths(t, this._originDate)) < 1e-3 ? (this._selectDate(t), this._close()) : this._scrollToCurrentMonth();
  }
  _scrollToCurrentMonth() {
    this.focusedDate && (this.focusedDate = /* @__PURE__ */ new Date()), this.scrollToDate(/* @__PURE__ */ new Date(), !0);
  }
  _onYearTap(t) {
    if (!this._ignoreTaps && !this._notTapping) {
      const i = (t.detail.y - (this._yearScroller.getBoundingClientRect().top + this._yearScroller.clientHeight / 2)) / this._yearScroller.itemHeight;
      this._scrollToPosition(this._monthScroller.position + i * 12, !0);
    }
  }
  _scrollToPosition(t, e) {
    if (this._targetPosition !== void 0) {
      this._targetPosition = t;
      return;
    }
    if (!e) {
      this._monthScroller.position = t, this._targetPosition = void 0, this._repositionYearScroller(), this.__tryFocusDate();
      return;
    }
    this._targetPosition = t;
    let i;
    this._revealPromise = new Promise((l) => {
      i = l;
    });
    const r = (l, d, c, h) => (l /= h / 2, l < 1 ? c / 2 * l * l + d : (l -= 1, -c / 2 * (l * (l - 2) - 1) + d));
    let s = 0;
    const n = this._monthScroller.position, a = (l) => {
      s || (s = l);
      const d = l - s;
      if (d < this.scrollDuration) {
        const c = r(
          d,
          n,
          this._targetPosition - n,
          this.scrollDuration
        );
        this._monthScroller.position = c, window.requestAnimationFrame(a);
      } else
        this.dispatchEvent(
          new CustomEvent("scroll-animation-finished", {
            bubbles: !0,
            composed: !0,
            detail: {
              position: this._targetPosition,
              oldPosition: n
            }
          })
        ), this._monthScroller.position = this._targetPosition, this._targetPosition = void 0, i(), this._revealPromise = void 0;
      setTimeout(this._repositionYearScroller.bind(this), 1);
    };
    window.requestAnimationFrame(a);
  }
  _limit(t, e) {
    return Math.min(e.max, Math.max(e.min, t));
  }
  _handleTrack(t) {
    if (Math.abs(t.detail.dx) < 10 || Math.abs(t.detail.ddy) > 10)
      return;
    Math.abs(t.detail.ddx) > this._yearScrollerWidth / 3 && this._toggleAnimateClass(!0);
    const e = this._translateX + t.detail.ddx;
    this._translateX = this._limit(e, {
      min: 0,
      max: this._yearScrollerWidth
    });
  }
  _track(t) {
    if (!this._desktopMode)
      switch (t.detail.state) {
        case "start":
          this._toggleAnimateClass(!1);
          break;
        case "track":
          this._handleTrack(t);
          break;
        case "end":
          this._toggleAnimateClass(!0), this._translateX >= this._yearScrollerWidth / 2 ? this._closeYearScroller() : this._openYearScroller();
          break;
      }
  }
  _toggleAnimateClass(t) {
    t ? this.classList.add("animate") : this.classList.remove("animate");
  }
  _toggleYearScroller() {
    this._isYearScrollerVisible() ? this._closeYearScroller() : this._openYearScroller();
  }
  _openYearScroller() {
    this._translateX = 0, this.setAttribute("years-visible", "");
  }
  _closeYearScroller() {
    this.removeAttribute("years-visible"), this._translateX = this._yearScrollerWidth;
  }
  _isYearScrollerVisible() {
    return this._translateX < this._yearScrollerWidth / 2;
  }
  _translateXChanged(t) {
    this._desktopMode || (this._monthScroller.style.transform = `translateX(${t - this._yearScrollerWidth}px)`, this._yearScroller.style.transform = `translateX(${t}px)`);
  }
  _yearAfterXMonths(t) {
    return ia(t).getFullYear();
  }
  _differenceInMonths(t, e) {
    return (t.getFullYear() - e.getFullYear()) * 12 - e.getMonth() + t.getMonth();
  }
  _clear() {
    this._selectDate("");
  }
  _close() {
    this.dispatchEvent(new CustomEvent("close", { bubbles: !0, composed: !0 }));
  }
  _cancel() {
    this.focusedDate = this.selectedDate, this._close();
  }
  _preventDefault(t) {
    t.preventDefault();
  }
  __toggleDate(t) {
    N(t, this.selectedDate) ? (this._clear(), this.focusedDate = t) : this._selectDate(t);
  }
  __onMonthCalendarKeyDown(t) {
    let e = !1;
    switch (t.key) {
      case "ArrowDown":
        this._moveFocusByDays(7), e = !0;
        break;
      case "ArrowUp":
        this._moveFocusByDays(-7), e = !0;
        break;
      case "ArrowRight":
        this._moveFocusByDays(this.__isRTL ? -1 : 1), e = !0;
        break;
      case "ArrowLeft":
        this._moveFocusByDays(this.__isRTL ? 1 : -1), e = !0;
        break;
      case "Enter":
        this._selectDate(this.focusedDate), this._close(), e = !0;
        break;
      case " ":
        this.__toggleDate(this.focusedDate), e = !0;
        break;
      case "Home":
        this._moveFocusInsideMonth(this.focusedDate, "minDate"), e = !0;
        break;
      case "End":
        this._moveFocusInsideMonth(this.focusedDate, "maxDate"), e = !0;
        break;
      case "PageDown":
        this._moveFocusByMonths(t.shiftKey ? 12 : 1), e = !0;
        break;
      case "PageUp":
        this._moveFocusByMonths(t.shiftKey ? -12 : -1), e = !0;
        break;
      case "Tab":
        this._onTabKeyDown(t, "calendar");
        break;
    }
    e && (t.preventDefault(), t.stopPropagation());
  }
  _onTabKeyDown(t, e) {
    switch (t.stopPropagation(), e) {
      case "calendar":
        t.shiftKey && (t.preventDefault(), this.hasAttribute("fullscreen") ? this.focusCancel() : this.__focusInput());
        break;
      case "today":
        t.shiftKey && (t.preventDefault(), this.focusDateElement());
        break;
      case "cancel":
        t.shiftKey || (t.preventDefault(), this.hasAttribute("fullscreen") ? this.focusDateElement() : this.__focusInput());
        break;
    }
  }
  __onTodayButtonKeyDown(t) {
    t.key === "Tab" && this._onTabKeyDown(t, "today");
  }
  __onCancelButtonKeyDown(t) {
    t.key === "Tab" && this._onTabKeyDown(t, "cancel");
  }
  __focusInput() {
    this.dispatchEvent(new CustomEvent("focus-input", { bubbles: !0, composed: !0 }));
  }
  __tryFocusDate() {
    if (this.__pendingDateFocus) {
      const e = this.focusableDateElement;
      e && N(e.date, this.__pendingDateFocus) && (delete this.__pendingDateFocus, e.focus());
    }
  }
  async focusDate(t, e) {
    const i = t || this.selectedDate || this.initialPosition || /* @__PURE__ */ new Date();
    this.focusedDate = i, e || (this._focusedMonthDate = i.getDate()), await this.focusDateElement(!1);
  }
  async focusDateElement(t = !0) {
    this.__pendingDateFocus = this.focusedDate, this.calendars.length || await new Promise((e) => {
      Dr(this, () => {
        Jn(), e();
      });
    }), t && this.revealDate(this.focusedDate), this._revealPromise && await this._revealPromise, this.__tryFocusDate();
  }
  _focusClosestDate(t) {
    this.focusDate(ea(t, [this.minDate, this.maxDate]));
  }
  _focusAllowedDate(t, e, i) {
    this._dateAllowed(t) ? this.focusDate(t, i) : this._dateAllowed(this.focusedDate) ? e > 0 ? this.focusDate(this.maxDate) : this.focusDate(this.minDate) : this._focusClosestDate(this.focusedDate);
  }
  _getDateDiff(t, e) {
    const i = new Date(0, 0);
    return i.setFullYear(this.focusedDate.getFullYear()), i.setMonth(this.focusedDate.getMonth() + t), e && i.setDate(this.focusedDate.getDate() + e), i;
  }
  _moveFocusByDays(t) {
    const e = this._getDateDiff(0, t);
    this._focusAllowedDate(e, t, !1);
  }
  _moveFocusByMonths(t) {
    const e = this._getDateDiff(t), i = e.getMonth();
    this._focusedMonthDate || (this._focusedMonthDate = this.focusedDate.getDate()), e.setDate(this._focusedMonthDate), e.getMonth() !== i && e.setDate(0), this._focusAllowedDate(e, t, !0);
  }
  _moveFocusInsideMonth(t, e) {
    const i = new Date(0, 0);
    i.setFullYear(t.getFullYear()), e === "minDate" ? (i.setMonth(t.getMonth()), i.setDate(1)) : (i.setMonth(t.getMonth() + 1), i.setDate(0)), this._dateAllowed(i) ? this.focusDate(i) : this._dateAllowed(t) ? this.focusDate(this[e]) : this._focusClosestDate(t);
  }
  _dateAllowed(t, e = this.minDate, i = this.maxDate) {
    return (!e || t >= e) && (!i || t <= i);
  }
  _isTodayAllowed(t, e) {
    const i = /* @__PURE__ */ new Date(), r = new Date(0, 0);
    return r.setFullYear(i.getFullYear()), r.setMonth(i.getMonth()), r.setDate(i.getDate()), this._dateAllowed(r, t, e);
  }
}
customElements.define(ts.is, ts);
/**
 * @license
 * Copyright (c) 2021 - 2023 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
const jr = I(
  (o) => class extends ui(Ur(o)) {
    static get properties() {
      return {
        /**
         * Specify that this control should have input focus when the page loads.
         */
        autofocus: {
          type: Boolean
        },
        /**
         * A reference to the focusable element controlled by the mixin.
         * It can be an input, textarea, button or any element with tabindex > -1.
         *
         * Any component implementing this mixin is expected to provide it
         * by using `this._setFocusElement(input)` Polymer API.
         *
         * Toggling `tabindex` attribute on the host element propagates its value to `focusElement`.
         *
         * @protected
         * @type {!HTMLElement}
         */
        focusElement: {
          type: Object,
          readOnly: !0,
          observer: "_focusElementChanged"
        },
        /**
         * Override the property from `TabIndexMixin`
         * to ensure the `tabindex` attribute of the focus element
         * will be restored to `0` after re-enabling the element.
         *
         * @protected
         * @override
         */
        _lastTabIndex: {
          value: 0
        }
      };
    }
    constructor() {
      super(), this._boundOnBlur = this._onBlur.bind(this), this._boundOnFocus = this._onFocus.bind(this);
    }
    /** @protected */
    ready() {
      super.ready(), this.autofocus && !this.disabled && requestAnimationFrame(() => {
        this.focus(), this.setAttribute("focus-ring", "");
      });
    }
    /**
     * @protected
     * @override
     */
    focus() {
      !this.focusElement || this.disabled || (this.focusElement.focus(), this._setFocused(!0));
    }
    /**
     * @protected
     * @override
     */
    blur() {
      this.focusElement && (this.focusElement.blur(), this._setFocused(!1));
    }
    /**
     * @protected
     * @override
     */
    click() {
      this.focusElement && !this.disabled && this.focusElement.click();
    }
    /** @protected */
    _focusElementChanged(e, i) {
      e ? (e.disabled = this.disabled, this._addFocusListeners(e), this.__forwardTabIndex(this.tabindex)) : i && this._removeFocusListeners(i);
    }
    /**
     * @param {HTMLElement} element
     * @protected
     */
    _addFocusListeners(e) {
      e.addEventListener("blur", this._boundOnBlur), e.addEventListener("focus", this._boundOnFocus);
    }
    /**
     * @param {HTMLElement} element
     * @protected
     */
    _removeFocusListeners(e) {
      e.removeEventListener("blur", this._boundOnBlur), e.removeEventListener("focus", this._boundOnFocus);
    }
    /**
     * Focus event does not bubble, so we dispatch it manually
     * on the host element to support adding focus listeners
     * when the focusable element is placed in light DOM.
     * @param {FocusEvent} event
     * @protected
     */
    _onFocus(e) {
      e.stopPropagation(), this.dispatchEvent(new Event("focus"));
    }
    /**
     * Blur event does not bubble, so we dispatch it manually
     * on the host element to support adding blur listeners
     * when the focusable element is placed in light DOM.
     * @param {FocusEvent} event
     * @protected
     */
    _onBlur(e) {
      e.stopPropagation(), this.dispatchEvent(new Event("blur"));
    }
    /**
     * @param {Event} event
     * @return {boolean}
     * @protected
     * @override
     */
    _shouldSetFocus(e) {
      return e.target === this.focusElement;
    }
    /**
     * @param {boolean} disabled
     * @param {boolean} oldDisabled
     * @protected
     * @override
     */
    _disabledChanged(e, i) {
      super._disabledChanged(e, i), this.focusElement && (this.focusElement.disabled = e), e && this.blur();
    }
    /**
     * Override an observer from `TabindexMixin`.
     * Do not call super to remove tabindex attribute
     * from the host after it has been forwarded.
     * @param {string} tabindex
     * @protected
     * @override
     */
    _tabindexChanged(e) {
      this.__forwardTabIndex(e);
    }
    /** @private */
    __forwardTabIndex(e) {
      e !== void 0 && this.focusElement && (this.focusElement.tabIndex = e, e !== -1 && (this.tabindex = void 0)), this.disabled && e && (e !== -1 && (this._lastTabIndex = e), this.tabindex = void 0);
    }
  }
);
/**
 * @license
 * Copyright (c) 2021 - 2023 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
const _i = I(
  (o) => class extends o {
    static get properties() {
      return {
        /**
         * A reference to the input element controlled by the mixin.
         * Any component implementing this mixin is expected to provide it
         * by using `this._setInputElement(input)` Polymer API.
         *
         * A typical case is using `InputController` that does this automatically.
         * However, the input element does not have to always be native <input>:
         * as an example, <vaadin-combo-box-light> accepts other components.
         *
         * @protected
         * @type {!HTMLElement}
         */
        inputElement: {
          type: Object,
          readOnly: !0,
          observer: "_inputElementChanged"
        },
        /**
         * String used to define input type.
         * @protected
         */
        type: {
          type: String,
          readOnly: !0
        },
        /**
         * The value of the field.
         */
        value: {
          type: String,
          value: "",
          observer: "_valueChanged",
          notify: !0
        },
        /**
         * Whether the input element has a non-empty value.
         *
         * @protected
         */
        _hasInputValue: {
          type: Boolean,
          value: !1,
          observer: "_hasInputValueChanged"
        }
      };
    }
    constructor() {
      super(), this._boundOnInput = this.__onInput.bind(this), this._boundOnChange = this._onChange.bind(this);
    }
    /**
     * Indicates whether the value is different from the default one.
     * Override if the `value` property has a type other than `string`.
     *
     * @protected
     */
    get _hasValue() {
      return this.value != null && this.value !== "";
    }
    /**
     * A property for accessing the input element's value.
     *
     * Override this getter if the property is different from the default `value` one.
     *
     * @protected
     * @return {string}
     */
    get _inputElementValueProperty() {
      return "value";
    }
    /**
     * The input element's value.
     *
     * @protected
     * @return {string}
     */
    get _inputElementValue() {
      return this.inputElement ? this.inputElement[this._inputElementValueProperty] : void 0;
    }
    /**
     * The input element's value.
     *
     * @protected
     */
    set _inputElementValue(e) {
      this.inputElement && (this.inputElement[this._inputElementValueProperty] = e);
    }
    /**
     * Clear the value of the field.
     */
    clear() {
      this._hasInputValue = !1, this.value = "", this._inputElementValue = "";
    }
    /**
     * Add event listeners to the input element instance.
     * Override this method to add custom listeners.
     * @param {!HTMLElement} input
     * @protected
     */
    _addInputListeners(e) {
      e.addEventListener("input", this._boundOnInput), e.addEventListener("change", this._boundOnChange);
    }
    /**
     * Remove event listeners from the input element instance.
     * @param {!HTMLElement} input
     * @protected
     */
    _removeInputListeners(e) {
      e.removeEventListener("input", this._boundOnInput), e.removeEventListener("change", this._boundOnChange);
    }
    /**
     * A method to forward the value property set on the field
     * programmatically back to the input element value.
     * Override this method to perform additional checks,
     * for example to skip this in certain conditions.
     * @param {string} value
     * @protected
     */
    _forwardInputValue(e) {
      this.inputElement && (this._inputElementValue = e ?? "");
    }
    /**
     * @param {HTMLElement | undefined} input
     * @param {HTMLElement | undefined} oldInput
     * @protected
     */
    _inputElementChanged(e, i) {
      e ? this._addInputListeners(e) : i && this._removeInputListeners(i);
    }
    /**
     * Observer to notify about the change of private property.
     *
     * @private
     */
    _hasInputValueChanged(e, i) {
      (e || i) && this.dispatchEvent(new CustomEvent("has-input-value-changed"));
    }
    /**
     * An input event listener used to update `_hasInputValue` property.
     * Do not override this method.
     *
     * @param {Event} event
     * @private
     */
    __onInput(e) {
      this._setHasInputValue(e), this._onInput(e);
    }
    /**
     * An input event listener used to update the field value.
     *
     * @param {Event} event
     * @protected
     */
    _onInput(e) {
      const i = e.composedPath()[0];
      this.__userInput = e.isTrusted, this.value = i.value, this.__userInput = !1;
    }
    /**
     * A change event listener.
     * Override this method with an actual implementation.
     * @param {Event} _event
     * @protected
     */
    _onChange(e) {
    }
    /**
     * Toggle the has-value attribute based on the value property.
     *
     * @param {boolean} hasValue
     * @protected
     */
    _toggleHasValue(e) {
      this.toggleAttribute("has-value", e);
    }
    /**
     * Observer called when a value property changes.
     * @param {string | undefined} newVal
     * @param {string | undefined} oldVal
     * @protected
     */
    _valueChanged(e, i) {
      this._toggleHasValue(this._hasValue), !(e === "" && i === void 0) && (this.__userInput || this._forwardInputValue(e));
    }
    /**
     * Sets the `_hasInputValue` property based on the `input` event.
     *
     * @param {InputEvent} event
     * @protected
     */
    _setHasInputValue(e) {
      const i = e.composedPath()[0];
      this._hasInputValue = i.value.length > 0;
    }
  }
);
/**
 * @license
 * Copyright (c) 2021 - 2023 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
const Th = (o) => class extends _i(Et(o)) {
  static get properties() {
    return {
      /**
       * Set to true to display the clear icon which clears the input.
       *
       * It is up to the component to choose where to place the clear icon:
       * in the Shadow DOM or in the light DOM. In any way, a reference to
       * the clear icon element should be provided via the `clearElement` getter.
       *
       * @attr {boolean} clear-button-visible
       */
      clearButtonVisible: {
        type: Boolean,
        reflectToAttribute: !0,
        value: !1
      }
    };
  }
  /**
   * Any element extending this mixin is required to implement this getter.
   * It returns the reference to the clear button element.
   *
   * @protected
   * @return {Element | null | undefined}
   */
  get clearElement() {
    return null;
  }
  /** @protected */
  ready() {
    super.ready(), this.clearElement && this.clearElement.addEventListener("click", (e) => this._onClearButtonClick(e));
  }
  /**
   * @param {Event} event
   * @protected
   */
  _onClearButtonClick(e) {
    e.preventDefault(), this.inputElement.focus(), this._onClearAction();
  }
  /**
   * Override an event listener inherited from `KeydownMixin` to clear on Esc.
   * Components that extend this mixin can prevent this behavior by overriding
   * this method without calling `super._onEscape` to provide custom logic.
   *
   * @param {KeyboardEvent} event
   * @protected
   * @override
   */
  _onEscape(e) {
    super._onEscape(e), this.clearButtonVisible && this.value && (e.stopPropagation(), this._onClearAction());
  }
  /**
   * Clears the value and dispatches `input` and `change` events
   * on the input element. This method should be called
   * when the clear action originates from the user.
   *
   * @protected
   */
  _onClearAction() {
    this.clear(), this.inputElement.dispatchEvent(new Event("input", { bubbles: !0, composed: !0 })), this.inputElement.dispatchEvent(new Event("change", { bubbles: !0 }));
  }
};
/**
 * @license
 * Copyright (c) 2023 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
const Li = /* @__PURE__ */ new Map();
function Yr(o) {
  return Li.has(o) || Li.set(o, /* @__PURE__ */ new WeakMap()), Li.get(o);
}
function sa(o, t) {
  o && o.removeAttribute(t);
}
function na(o, t) {
  if (!o || !t)
    return;
  const e = Yr(t);
  if (e.has(o))
    return;
  const i = Mr(o.getAttribute(t));
  e.set(o, new Set(i));
}
function Ph(o, t) {
  if (!o || !t)
    return;
  const e = Yr(t), i = e.get(o);
  !i || i.size === 0 ? o.removeAttribute(t) : hi(o, t, ci(i)), e.delete(o);
}
function Bi(o, t, e = { newId: null, oldId: null, fromUser: !1 }) {
  if (!o || !t)
    return;
  const { newId: i, oldId: r, fromUser: s } = e, n = Yr(t), a = n.get(o);
  if (!s && a) {
    r && a.delete(r), i && a.add(i);
    return;
  }
  s && (a ? i || n.delete(o) : na(o, t), sa(o, t)), Rr(o, t, r);
  const l = i || ci(a);
  l && hi(o, t, l);
}
function Dh(o, t) {
  na(o, t), sa(o, t);
}
/**
 * @license
 * Copyright (c) 2021 - 2023 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
class Oh {
  constructor(t) {
    this.host = t, this.__required = !1;
  }
  /**
   * Sets a target element to which ARIA attributes are added.
   *
   * @param {HTMLElement} target
   */
  setTarget(t) {
    this.__target = t, this.__setAriaRequiredAttribute(this.__required), this.__setLabelIdToAriaAttribute(this.__labelId, this.__labelId), this.__labelIdFromUser != null && this.__setLabelIdToAriaAttribute(this.__labelIdFromUser, this.__labelIdFromUser, !0), this.__setErrorIdToAriaAttribute(this.__errorId), this.__setHelperIdToAriaAttribute(this.__helperId), this.setAriaLabel(this.__label);
  }
  /**
   * Toggles the `aria-required` attribute on the target element
   * if the target is the host component (e.g. a field group).
   * Otherwise, it does nothing.
   *
   * @param {boolean} required
   */
  setRequired(t) {
    this.__setAriaRequiredAttribute(t), this.__required = t;
  }
  /**
   * Defines the `aria-label` attribute of the target element.
   *
   * To remove the attribute, pass `null` as `label`.
   *
   * @param {string | null | undefined} label
   */
  setAriaLabel(t) {
    this.__setAriaLabelToAttribute(t), this.__label = t;
  }
  /**
   * Links the target element with a slotted label element
   * via the target's attribute `aria-labelledby`.
   *
   * To unlink the previous slotted label element, pass `null` as `labelId`.
   *
   * @param {string | null} labelId
   */
  setLabelId(t, e = !1) {
    const i = e ? this.__labelIdFromUser : this.__labelId;
    this.__setLabelIdToAriaAttribute(t, i, e), e ? this.__labelIdFromUser = t : this.__labelId = t;
  }
  /**
   * Links the target element with a slotted error element via the target's attribute:
   * - `aria-labelledby` if the target is the host component (e.g a field group).
   * - `aria-describedby` otherwise.
   *
   * To unlink the previous slotted error element, pass `null` as `errorId`.
   *
   * @param {string | null} errorId
   */
  setErrorId(t) {
    this.__setErrorIdToAriaAttribute(t, this.__errorId), this.__errorId = t;
  }
  /**
   * Links the target element with a slotted helper element via the target's attribute:
   * - `aria-labelledby` if the target is the host component (e.g a field group).
   * - `aria-describedby` otherwise.
   *
   * To unlink the previous slotted helper element, pass `null` as `helperId`.
   *
   * @param {string | null} helperId
   */
  setHelperId(t) {
    this.__setHelperIdToAriaAttribute(t, this.__helperId), this.__helperId = t;
  }
  /**
   * @param {string | null | undefined} label
   * @private
   * */
  __setAriaLabelToAttribute(t) {
    this.__target && (t ? (Dh(this.__target, "aria-labelledby"), this.__target.setAttribute("aria-label", t)) : this.__label && (Ph(this.__target, "aria-labelledby"), this.__target.removeAttribute("aria-label")));
  }
  /**
   * @param {string | null | undefined} labelId
   * @param {string | null | undefined} oldLabelId
   * @param {boolean | null | undefined} fromUser
   * @private
   */
  __setLabelIdToAriaAttribute(t, e, i) {
    Bi(this.__target, "aria-labelledby", { newId: t, oldId: e, fromUser: i });
  }
  /**
   * @param {string | null | undefined} errorId
   * @param {string | null | undefined} oldErrorId
   * @private
   */
  __setErrorIdToAriaAttribute(t, e) {
    Bi(this.__target, "aria-describedby", { newId: t, oldId: e, fromUser: !1 });
  }
  /**
   * @param {string | null | undefined} helperId
   * @param {string | null | undefined} oldHelperId
   * @private
   */
  __setHelperIdToAriaAttribute(t, e) {
    Bi(this.__target, "aria-describedby", { newId: t, oldId: e, fromUser: !1 });
  }
  /**
   * @param {boolean} required
   * @private
   */
  __setAriaRequiredAttribute(t) {
    this.__target && (["input", "textarea"].includes(this.__target.localName) || (t ? this.__target.setAttribute("aria-required", "true") : this.__target.removeAttribute("aria-required")));
  }
}
/**
 * @license
 * Copyright (c) 2022 - 2023 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
class Kr extends X {
  constructor(t, e, i, r = {}) {
    super(t, e, i, { ...r, useUniqueId: !0 });
  }
  /**
   * Override to initialize the newly added custom node.
   *
   * @param {Node} node
   * @protected
   * @override
   */
  initCustomNode(t) {
    this.__updateNodeId(t), this.__notifyChange(t);
  }
  /**
   * Override to notify the controller host about removal of
   * the custom node, and to apply the default one if needed.
   *
   * @param {Node} _node
   * @protected
   * @override
   */
  teardownNode(t) {
    const e = this.getSlotChild();
    e && e !== this.defaultNode ? this.__notifyChange(e) : (this.restoreDefaultNode(), this.updateDefaultNode(this.node));
  }
  /**
   * Override method inherited from `SlotMixin`
   * to set ID attribute on the default node.
   *
   * @return {Node}
   * @protected
   * @override
   */
  attachDefaultNode() {
    const t = super.attachDefaultNode();
    return t && this.__updateNodeId(t), t;
  }
  /**
   * Override to restore default node when a custom one is removed.
   *
   * @protected
   */
  restoreDefaultNode() {
  }
  /**
   * Override to update default node text on property change.
   *
   * @param {Node} node
   * @protected
   */
  updateDefaultNode(t) {
    this.__notifyChange(t);
  }
  /**
   * Setup the mutation observer on the node to update ID and notify host.
   * Node doesn't get observed automatically until this method is called.
   *
   * @param {Node} node
   * @protected
   */
  observeNode(t) {
    this.__nodeObserver && this.__nodeObserver.disconnect(), this.__nodeObserver = new MutationObserver((e) => {
      e.forEach((i) => {
        const r = i.target, s = r === this.node;
        i.type === "attributes" ? s && this.__updateNodeId(r) : (s || r.parentElement === this.node) && this.__notifyChange(this.node);
      });
    }), this.__nodeObserver.observe(t, {
      attributes: !0,
      attributeFilter: ["id"],
      childList: !0,
      subtree: !0,
      characterData: !0
    });
  }
  /**
   * Returns true if a node is an HTML element with children,
   * or is a defined custom element, or has non-empty text.
   *
   * @param {Node} node
   * @return {boolean}
   * @private
   */
  __hasContent(t) {
    return t ? t.nodeType === Node.ELEMENT_NODE && (customElements.get(t.localName) || t.children.length > 0) || t.textContent && t.textContent.trim() !== "" : !1;
  }
  /**
   * Fire an event to notify the controller host about node changes.
   *
   * @param {Node} node
   * @private
   */
  __notifyChange(t) {
    this.dispatchEvent(
      new CustomEvent("slot-content-changed", {
        detail: { hasContent: this.__hasContent(t), node: t }
      })
    );
  }
  /**
   * Set default ID on the node in case it is an HTML element.
   *
   * @param {Node} node
   * @private
   */
  __updateNodeId(t) {
    const e = !this.nodes || t === this.nodes[0];
    t.nodeType === Node.ELEMENT_NODE && e && !t.id && (t.id = this.defaultId);
  }
}
/**
 * @license
 * Copyright (c) 2021 - 2023 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
class zh extends Kr {
  constructor(t) {
    super(t, "error-message", "div");
  }
  /**
   * Set the error message element text content.
   *
   * @param {string} errorMessage
   */
  setErrorMessage(t) {
    this.errorMessage = t, this.updateDefaultNode(this.node);
  }
  /**
   * Set invalid state for detecting whether to show error message.
   *
   * @param {boolean} invalid
   */
  setInvalid(t) {
    this.invalid = t, this.updateDefaultNode(this.node);
  }
  /**
   * Override method inherited from `SlotController` to not run
   * initializer on the custom slotted node unnecessarily.
   *
   * @param {Node} node
   * @protected
   * @override
   */
  initAddedNode(t) {
    t !== this.defaultNode && this.initCustomNode(t);
  }
  /**
   * Override to initialize the newly added default error message.
   *
   * @param {Node} errorNode
   * @protected
   * @override
   */
  initNode(t) {
    this.updateDefaultNode(t);
  }
  /**
   * Override to initialize the newly added custom error message.
   *
   * @param {Node} errorNode
   * @protected
   * @override
   */
  initCustomNode(t) {
    t.textContent && !this.errorMessage && (this.errorMessage = t.textContent.trim()), super.initCustomNode(t);
  }
  /**
   * Override method inherited from `SlotChildObserveController`
   * to restore the default error message element.
   *
   * @protected
   * @override
   */
  restoreDefaultNode() {
    this.attachDefaultNode();
  }
  /**
   * Override method inherited from `SlotChildObserveController`
   * to update the error message text and hidden state.
   *
   * Note: unlike with other controllers, this method is
   * called for both default and custom error message.
   *
   * @param {Node | undefined} node
   * @protected
   * @override
   */
  updateDefaultNode(t) {
    const { errorMessage: e, invalid: i } = this, r = !!(i && e && e.trim() !== "");
    t && (t.textContent = r ? e : "", t.hidden = !r, r ? t.setAttribute("role", "alert") : t.removeAttribute("role")), super.updateDefaultNode(t);
  }
}
/**
 * @license
 * Copyright (c) 2021 - 2023 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
class $h extends Kr {
  constructor(t) {
    super(t, "helper", null);
  }
  /**
   * Set helper text based on corresponding host property.
   *
   * @param {string} helperText
   */
  setHelperText(t) {
    this.helperText = t, this.getSlotChild() || this.restoreDefaultNode(), this.node === this.defaultNode && this.updateDefaultNode(this.node);
  }
  /**
   * Override method inherited from `SlotChildObserveController`
   * to create the default helper element lazily as needed.
   *
   * @param {Node | undefined} node
   * @protected
   * @override
   */
  restoreDefaultNode() {
    const { helperText: t } = this;
    if (t && t.trim() !== "") {
      this.tagName = "div";
      const e = this.attachDefaultNode();
      this.observeNode(e);
    }
  }
  /**
   * Override method inherited from `SlotChildObserveController`
   * to update the default helper element text content.
   *
   * @param {Node | undefined} node
   * @protected
   * @override
   */
  updateDefaultNode(t) {
    t && (t.textContent = this.helperText), super.updateDefaultNode(t);
  }
  /**
   * Override to observe the newly added custom node.
   *
   * @param {Node} node
   * @protected
   * @override
   */
  initCustomNode(t) {
    super.initCustomNode(t), this.observeNode(t);
  }
}
/**
 * @license
 * Copyright (c) 2021 - 2023 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
class Mh extends Kr {
  constructor(t) {
    super(t, "label", "label");
  }
  /**
   * Set label based on corresponding host property.
   *
   * @param {string} label
   */
  setLabel(t) {
    this.label = t, this.getSlotChild() || this.restoreDefaultNode(), this.node === this.defaultNode && this.updateDefaultNode(this.node);
  }
  /**
   * Override method inherited from `SlotChildObserveController`
   * to restore and observe the default label element.
   *
   * @protected
   * @override
   */
  restoreDefaultNode() {
    const { label: t } = this;
    if (t && t.trim() !== "") {
      const e = this.attachDefaultNode();
      this.observeNode(e);
    }
  }
  /**
   * Override method inherited from `SlotChildObserveController`
   * to update the default label element text content.
   *
   * @param {Node | undefined} node
   * @protected
   * @override
   */
  updateDefaultNode(t) {
    t && (t.textContent = this.label), super.updateDefaultNode(t);
  }
  /**
   * Override to observe the newly added custom node.
   *
   * @param {Node} node
   * @protected
   * @override
   */
  initCustomNode(t) {
    super.initCustomNode(t), this.observeNode(t);
  }
}
/**
 * @license
 * Copyright (c) 2021 - 2023 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
const aa = I(
  (o) => class extends ie(o) {
    static get properties() {
      return {
        /**
         * The label text for the input node.
         * When no light dom defined via [slot=label], this value will be used.
         */
        label: {
          type: String,
          observer: "_labelChanged"
        }
      };
    }
    constructor() {
      super(), this._labelController = new Mh(this), this._labelController.addEventListener("slot-content-changed", (e) => {
        this.toggleAttribute("has-label", e.detail.hasContent);
      });
    }
    /** @protected */
    get _labelId() {
      const e = this._labelNode;
      return e && e.id;
    }
    /** @protected */
    get _labelNode() {
      return this._labelController.node;
    }
    /** @protected */
    ready() {
      super.ready(), this.addController(this._labelController);
    }
    /** @protected */
    _labelChanged(e) {
      this._labelController.setLabel(e);
    }
  }
);
/**
 * @license
 * Copyright (c) 2021 - 2023 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
const la = I(
  (o) => class extends o {
    static get properties() {
      return {
        /**
         * Set to true when the field is invalid.
         */
        invalid: {
          type: Boolean,
          reflectToAttribute: !0,
          notify: !0,
          value: !1
        },
        /**
         * Specifies that the user must fill in a value.
         */
        required: {
          type: Boolean,
          reflectToAttribute: !0
        }
      };
    }
    /**
     * Validates the field and sets the `invalid` property based on the result.
     *
     * The method fires a `validated` event with the result of the validation.
     *
     * @return {boolean} True if the value is valid.
     */
    validate() {
      const e = this.checkValidity();
      return this._setInvalid(!e), this.dispatchEvent(new CustomEvent("validated", { detail: { valid: e } })), e;
    }
    /**
     * Returns true if the field value satisfies all constraints (if any).
     *
     * @return {boolean}
     */
    checkValidity() {
      return !this.required || !!this.value;
    }
    /**
     * @param {boolean} invalid
     * @protected
     */
    _setInvalid(e) {
      this._shouldSetInvalid(e) && (this.invalid = e);
    }
    /**
     * Override this method to define whether the given `invalid` state should be set.
     *
     * @param {boolean} _invalid
     * @return {boolean}
     * @protected
     */
    _shouldSetInvalid(e) {
      return !0;
    }
    /**
     * Fired whenever the field is validated.
     *
     * @event validated
     * @param {Object} detail
     * @param {boolean} detail.valid the result of the validation.
     */
  }
);
/**
 * @license
 * Copyright (c) 2021 - 2023 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
const da = (o) => class extends la(aa(ie(o))) {
  static get properties() {
    return {
      /**
       * A target element to which ARIA attributes are set.
       * @protected
       */
      ariaTarget: {
        type: Object,
        observer: "_ariaTargetChanged"
      },
      /**
       * Error to show when the field is invalid.
       *
       * @attr {string} error-message
       */
      errorMessage: {
        type: String,
        observer: "_errorMessageChanged"
      },
      /**
       * String used for the helper text.
       * @attr {string} helper-text
       */
      helperText: {
        type: String,
        observer: "_helperTextChanged"
      },
      /**
       * String used to label the component to screen reader users.
       * @attr {string} accessible-name
       */
      accessibleName: {
        type: String,
        observer: "_accessibleNameChanged"
      },
      /**
       * Id of the element used as label of the component to screen reader users.
       * @attr {string} accessible-name-ref
       */
      accessibleNameRef: {
        type: String,
        observer: "_accessibleNameRefChanged"
      }
    };
  }
  static get observers() {
    return ["_invalidChanged(invalid)", "_requiredChanged(required)"];
  }
  constructor() {
    super(), this._fieldAriaController = new Oh(this), this._helperController = new $h(this), this._errorController = new zh(this), this._errorController.addEventListener("slot-content-changed", (e) => {
      this.toggleAttribute("has-error-message", e.detail.hasContent);
    }), this._labelController.addEventListener("slot-content-changed", (e) => {
      const { hasContent: i, node: r } = e.detail;
      this.__labelChanged(i, r);
    }), this._helperController.addEventListener("slot-content-changed", (e) => {
      const { hasContent: i, node: r } = e.detail;
      this.toggleAttribute("has-helper", i), this.__helperChanged(i, r);
    });
  }
  /**
   * @protected
   * @return {HTMLElement}
   */
  get _errorNode() {
    return this._errorController.node;
  }
  /**
   * @protected
   * @return {HTMLElement}
   */
  get _helperNode() {
    return this._helperController.node;
  }
  /** @protected */
  ready() {
    super.ready(), this.addController(this._fieldAriaController), this.addController(this._helperController), this.addController(this._errorController);
  }
  /** @private */
  __helperChanged(e, i) {
    e ? this._fieldAriaController.setHelperId(i.id) : this._fieldAriaController.setHelperId(null);
  }
  /** @protected */
  _accessibleNameChanged(e) {
    this._fieldAriaController.setAriaLabel(e);
  }
  /** @protected */
  _accessibleNameRefChanged(e) {
    this._fieldAriaController.setLabelId(e, !0);
  }
  /** @private */
  __labelChanged(e, i) {
    e ? this._fieldAriaController.setLabelId(i.id) : this._fieldAriaController.setLabelId(null);
  }
  /**
   * @param {string | null | undefined} errorMessage
   * @protected
   */
  _errorMessageChanged(e) {
    this._errorController.setErrorMessage(e);
  }
  /**
   * @param {string} helperText
   * @protected
   */
  _helperTextChanged(e) {
    this._helperController.setHelperText(e);
  }
  /**
   * @param {HTMLElement | null | undefined} target
   * @protected
   */
  _ariaTargetChanged(e) {
    e && this._fieldAriaController.setTarget(e);
  }
  /**
   * @param {boolean} required
   * @protected
   */
  _requiredChanged(e) {
    this._fieldAriaController.setRequired(e);
  }
  /**
   * @param {boolean} invalid
   * @protected
   */
  _invalidChanged(e) {
    this._errorController.setInvalid(e), setTimeout(() => {
      if (e) {
        const i = this._errorNode;
        this._fieldAriaController.setErrorId(i && i.id);
      } else
        this._fieldAriaController.setErrorId(null);
    });
  }
};
/**
 * @license
 * Copyright (c) 2021 - 2023 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
const ca = I(
  (o) => class extends o {
    static get properties() {
      return {
        /**
         * A target element to which attributes and properties are delegated.
         * @protected
         */
        stateTarget: {
          type: Object,
          observer: "_stateTargetChanged"
        }
      };
    }
    /**
     * An array of the host attributes to delegate to the target element.
     */
    static get delegateAttrs() {
      return [];
    }
    /**
     * An array of the host properties to delegate to the target element.
     */
    static get delegateProps() {
      return [];
    }
    /** @protected */
    ready() {
      super.ready(), this._createDelegateAttrsObserver(), this._createDelegatePropsObserver();
    }
    /** @protected */
    _stateTargetChanged(e) {
      e && (this._ensureAttrsDelegated(), this._ensurePropsDelegated());
    }
    /** @protected */
    _createDelegateAttrsObserver() {
      this._createMethodObserver(`_delegateAttrsChanged(${this.constructor.delegateAttrs.join(", ")})`);
    }
    /** @protected */
    _createDelegatePropsObserver() {
      this._createMethodObserver(`_delegatePropsChanged(${this.constructor.delegateProps.join(", ")})`);
    }
    /** @protected */
    _ensureAttrsDelegated() {
      this.constructor.delegateAttrs.forEach((e) => {
        this._delegateAttribute(e, this[e]);
      });
    }
    /** @protected */
    _ensurePropsDelegated() {
      this.constructor.delegateProps.forEach((e) => {
        this._delegateProperty(e, this[e]);
      });
    }
    /** @protected */
    _delegateAttrsChanged(...e) {
      this.constructor.delegateAttrs.forEach((i, r) => {
        this._delegateAttribute(i, e[r]);
      });
    }
    /** @protected */
    _delegatePropsChanged(...e) {
      this.constructor.delegateProps.forEach((i, r) => {
        this._delegateProperty(i, e[r]);
      });
    }
    /** @protected */
    _delegateAttribute(e, i) {
      this.stateTarget && (e === "invalid" && this._delegateAttribute("aria-invalid", i ? "true" : !1), typeof i == "boolean" ? this.stateTarget.toggleAttribute(e, i) : i ? this.stateTarget.setAttribute(e, i) : this.stateTarget.removeAttribute(e));
    }
    /** @protected */
    _delegateProperty(e, i) {
      this.stateTarget && (this.stateTarget[e] = i);
    }
  }
);
/**
 * @license
 * Copyright (c) 2021 - 2023 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
const Qr = I(
  (o) => class extends ca(la(_i(o))) {
    /**
     * An array of attributes which participate in the input validation.
     * Changing these attributes will cause the input to re-validate.
     *
     * IMPORTANT: The attributes should be properly delegated to the input element
     * from the host using `delegateAttrs` getter (see `DelegateStateMixin`).
     * The `required` attribute is already delegated.
     */
    static get constraints() {
      return ["required"];
    }
    static get delegateAttrs() {
      return [...super.delegateAttrs, "required"];
    }
    /** @protected */
    ready() {
      super.ready(), this._createConstraintsObserver();
    }
    /**
     * Returns true if the current input value satisfies all constraints (if any).
     * @return {boolean}
     */
    checkValidity() {
      return this.inputElement && this._hasValidConstraints(this.constructor.constraints.map((e) => this[e])) ? this.inputElement.checkValidity() : !this.invalid;
    }
    /**
     * Returns true if some of the provided set of constraints are valid.
     * @param {Array} constraints
     * @return {boolean}
     * @protected
     */
    _hasValidConstraints(e) {
      return e.some((i) => this.__isValidConstraint(i));
    }
    /**
     * Override this method to customize setting up constraints observer.
     * @protected
     */
    _createConstraintsObserver() {
      this._createMethodObserver(`_constraintsChanged(stateTarget, ${this.constructor.constraints.join(", ")})`);
    }
    /**
     * Override this method to implement custom validation constraints.
     * @param {HTMLElement | undefined} stateTarget
     * @param {unknown[]} constraints
     * @protected
     */
    _constraintsChanged(e, ...i) {
      if (!e)
        return;
      const r = this._hasValidConstraints(i), s = this.__previousHasConstraints && !r;
      (this._hasValue || this.invalid) && r ? this.validate() : s && this._setInvalid(!1), this.__previousHasConstraints = r;
    }
    /**
     * Override an event listener inherited from `InputMixin`
     * to capture native `change` event and make sure that
     * a new one is dispatched after validation runs.
     * @param {Event} event
     * @protected
     * @override
     */
    _onChange(e) {
      e.stopPropagation(), this.validate(), this.dispatchEvent(
        new CustomEvent("change", {
          detail: {
            sourceEvent: e
          },
          bubbles: e.bubbles,
          cancelable: e.cancelable
        })
      );
    }
    /** @private */
    __isValidConstraint(e) {
      return !!e || e === 0;
    }
  }
);
/**
 * @license
 * Copyright (c) 2021 - 2023 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
const Hi = /* @__PURE__ */ new WeakMap();
function Rh(o) {
  return Hi.has(o) || Hi.set(o, /* @__PURE__ */ new Set()), Hi.get(o);
}
function Fh(o, t) {
  const e = document.createElement("style");
  e.textContent = o, t === document ? document.head.appendChild(e) : t.insertBefore(e, t.firstChild);
}
const Nh = I(
  (o) => class extends o {
    /**
     * List of styles to insert into root.
     * @protected
     */
    get slotStyles() {
      return {};
    }
    /** @protected */
    connectedCallback() {
      super.connectedCallback(), this.__applySlotStyles();
    }
    /** @private */
    __applySlotStyles() {
      const e = this.getRootNode(), i = Rh(e);
      this.slotStyles.forEach((r) => {
        i.has(r) || (Fh(r, e), i.add(r));
      });
    }
  }
);
/**
 * @license
 * Copyright (c) 2021 - 2023 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
const fi = (o) => class extends Nh(
  jr(Qr(da(Th(Et(o)))))
) {
  static get properties() {
    return {
      /**
       * A pattern matched against individual characters the user inputs.
       *
       * When set, the field will prevent:
       * - `keydown` events if the entered key doesn't match `/^allowedCharPattern$/`
       * - `paste` events if the pasted text doesn't match `/^allowedCharPattern*$/`
       * - `drop` events if the dropped text doesn't match `/^allowedCharPattern*$/`
       *
       * For example, to allow entering only numbers and minus signs, use:
       * `allowedCharPattern = "[\\d-]"`
       * @attr {string} allowed-char-pattern
       */
      allowedCharPattern: {
        type: String,
        observer: "_allowedCharPatternChanged"
      },
      /**
       * If true, the input text gets fully selected when the field is focused using click or touch / tap.
       */
      autoselect: {
        type: Boolean,
        value: !1
      },
      /**
       * The name of this field.
       */
      name: {
        type: String,
        reflectToAttribute: !0
      },
      /**
       * A hint to the user of what can be entered in the field.
       */
      placeholder: {
        type: String,
        reflectToAttribute: !0
      },
      /**
       * When present, it specifies that the field is read-only.
       */
      readonly: {
        type: Boolean,
        value: !1,
        reflectToAttribute: !0
      },
      /**
       * The text usually displayed in a tooltip popup when the mouse is over the field.
       */
      title: {
        type: String,
        reflectToAttribute: !0
      }
    };
  }
  static get delegateAttrs() {
    return [...super.delegateAttrs, "name", "type", "placeholder", "readonly", "invalid", "title"];
  }
  constructor() {
    super(), this._boundOnPaste = this._onPaste.bind(this), this._boundOnDrop = this._onDrop.bind(this), this._boundOnBeforeInput = this._onBeforeInput.bind(this);
  }
  /** @protected */
  get slotStyles() {
    return [
      `
          :is(input[slot='input'], textarea[slot='textarea'])::placeholder {
            font: inherit;
            color: inherit;
          }
        `
    ];
  }
  /**
   * Override an event listener from `DelegateFocusMixin`.
   * @param {FocusEvent} event
   * @protected
   * @override
   */
  _onFocus(e) {
    super._onFocus(e), this.autoselect && this.inputElement && this.inputElement.select();
  }
  /**
   * Override an event listener inherited from `InputMixin`
   * to capture native `change` event and make sure that
   * a new one is dispatched after validation runs.
   * @param {Event} event
   * @protected
   * @override
   */
  _onChange(e) {
    e.stopPropagation(), this.validate(), this.dispatchEvent(
      new CustomEvent("change", {
        detail: {
          sourceEvent: e
        },
        bubbles: e.bubbles,
        cancelable: e.cancelable
      })
    );
  }
  /**
   * Override a method from `InputMixin`.
   * @param {!HTMLElement} input
   * @protected
   * @override
   */
  _addInputListeners(e) {
    super._addInputListeners(e), e.addEventListener("paste", this._boundOnPaste), e.addEventListener("drop", this._boundOnDrop), e.addEventListener("beforeinput", this._boundOnBeforeInput);
  }
  /**
   * Override a method from `InputMixin`.
   * @param {!HTMLElement} input
   * @protected
   * @override
   */
  _removeInputListeners(e) {
    super._removeInputListeners(e), e.removeEventListener("paste", this._boundOnPaste), e.removeEventListener("drop", this._boundOnDrop), e.removeEventListener("beforeinput", this._boundOnBeforeInput);
  }
  /**
   * Override an event listener from `KeyboardMixin`.
   * @param {!KeyboardEvent} event
   * @protected
   * @override
   */
  _onKeyDown(e) {
    super._onKeyDown(e), this.allowedCharPattern && !this.__shouldAcceptKey(e) && (e.preventDefault(), this._markInputPrevented());
  }
  /** @protected */
  _markInputPrevented() {
    this.setAttribute("input-prevented", ""), this._preventInputDebouncer = w.debounce(this._preventInputDebouncer, L.after(200), () => {
      this.removeAttribute("input-prevented");
    });
  }
  /** @private */
  __shouldAcceptKey(e) {
    return e.metaKey || e.ctrlKey || !e.key || // Allow typing anything if event.key is not supported
    e.key.length !== 1 || // Allow "Backspace", "ArrowLeft" etc.
    this.__allowedCharRegExp.test(e.key);
  }
  /** @private */
  _onPaste(e) {
    if (this.allowedCharPattern) {
      const i = e.clipboardData.getData("text");
      this.__allowedTextRegExp.test(i) || (e.preventDefault(), this._markInputPrevented());
    }
  }
  /** @private */
  _onDrop(e) {
    if (this.allowedCharPattern) {
      const i = e.dataTransfer.getData("text");
      this.__allowedTextRegExp.test(i) || (e.preventDefault(), this._markInputPrevented());
    }
  }
  /** @private */
  _onBeforeInput(e) {
    this.allowedCharPattern && e.data && !this.__allowedTextRegExp.test(e.data) && (e.preventDefault(), this._markInputPrevented());
  }
  /** @private */
  _allowedCharPatternChanged(e) {
    if (e)
      try {
        this.__allowedCharRegExp = new RegExp(`^${e}$`, "u"), this.__allowedTextRegExp = new RegExp(`^${e}*$`, "u");
      } catch {
      }
  }
  /**
   * Fired when the user commits a value change.
   *
   * @event change
   */
  /**
   * Fired when the value is changed by the user: on every typing keystroke,
   * and the value is cleared using the clear button.
   *
   * @event input
   */
};
/**
 * @license
 * Copyright (c) 2021 - 2023 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
class It extends X {
  constructor(t, e) {
    super(t, "input", "input", {
      initializer: (i, r) => {
        r.value && i.setAttribute("value", r.value), r.type && i.setAttribute("type", r.type), i.id = this.defaultId, typeof e == "function" && e(i);
      },
      useUniqueId: !0
    });
  }
}
/**
 * @license
 * Copyright (c) 2021 - 2023 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
class Tt {
  constructor(t, e) {
    this.input = t, this.__preventDuplicateLabelClick = this.__preventDuplicateLabelClick.bind(this), e.addEventListener("slot-content-changed", (i) => {
      this.__initLabel(i.detail.node);
    }), this.__initLabel(e.node);
  }
  /**
   * @param {HTMLElement} label
   * @private
   */
  __initLabel(t) {
    t && (t.addEventListener("click", this.__preventDuplicateLabelClick), this.input && t.setAttribute("for", this.input.id));
  }
  /**
   * The native platform fires an event for both the click on the label, and also
   * the subsequent click on the native input element caused by label click.
   * This results in two click events arriving at the host, but we only want one.
   * This method prevents the duplicate click and ensures the correct isTrusted event
   * with the correct event.target arrives at the host.
   * @private
   */
  __preventDuplicateLabelClick() {
    const t = (e) => {
      e.stopImmediatePropagation(), this.input.removeEventListener("click", t);
    };
    this.input.addEventListener("click", t);
  }
}
/**
 * @license
 * Copyright (c) 2021 - 2023 Vaadin Ltd..
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
const Lh = _`
  [part='clear-button'] {
    display: none;
    cursor: default;
  }

  [part='clear-button']::before {
    content: '\\2715';
  }

  :host([clear-button-visible][has-value]:not([disabled]):not([readonly])) [part='clear-button'] {
    display: block;
  }
`;
/**
 * @license
 * Copyright (c) 2021 - 2023 Vaadin Ltd..
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
const Bh = _`
  :host {
    display: inline-flex;
    outline: none;
  }

  :host::before {
    content: '\\2003';
    width: 0;
    display: inline-block;
    /* Size and position this element on the same vertical position as the input-field element
          to make vertical align for the host element work as expected */
  }

  :host([hidden]) {
    display: none !important;
  }

  :host(:not([has-label])) [part='label'] {
    display: none;
  }

  @media (forced-colors: active) {
    :host(:not([readonly])) [part='input-field'] {
      outline: 1px solid;
      outline-offset: -1px;
    }
    :host([focused]) [part='input-field'] {
      outline-width: 2px;
    }
    :host([disabled]) [part='input-field'] {
      outline-color: GrayText;
    }
  }
`;
/**
 * @license
 * Copyright (c) 2021 - 2023 Vaadin Ltd..
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
const Hh = _`
  [class$='container'] {
    display: flex;
    flex-direction: column;
    min-width: 100%;
    max-width: 100%;
    width: var(--vaadin-field-default-width, 12em);
  }
`;
/**
 * @license
 * Copyright (c) 2021 - 2023 Vaadin Ltd..
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
const Pt = [Bh, Hh, Lh];
/**
 * @license
 * Copyright (c) 2023 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
const ha = (o) => class extends o {
  static get properties() {
    return {
      /**
       * A space-delimited list of CSS class names to set on the overlay element.
       * This property does not affect other CSS class names set manually via JS.
       *
       * Note, if the CSS class name was set with this property, clearing it will
       * remove it from the overlay, even if the same class name was also added
       * manually, e.g. by using `classList.add()` in the `renderer` function.
       *
       * @attr {string} overlay-class
       */
      overlayClass: {
        type: String
      },
      /**
       * An overlay element on which CSS class names are set.
       *
       * @protected
       */
      _overlayElement: {
        type: Object
      }
    };
  }
  static get observers() {
    return ["__updateOverlayClassNames(overlayClass, _overlayElement)"];
  }
  /** @private */
  __updateOverlayClassNames(e, i) {
    if (!i || e === void 0)
      return;
    const { classList: r } = i;
    if (this.__initialClasses || (this.__initialClasses = new Set(r)), Array.isArray(this.__previousClasses)) {
      const n = this.__previousClasses.filter((a) => !this.__initialClasses.has(a));
      n.length > 0 && r.remove(...n);
    }
    const s = typeof e == "string" ? e.split(" ") : [];
    s.length > 0 && r.add(...s), this.__previousClasses = s;
  }
};
/**
 * @license
 * Copyright (c) 2021 - 2023 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
class ua {
  /**
   * @param {{ inputElement?: HTMLElement; opened: boolean } & HTMLElement} host
   */
  constructor(t) {
    this.host = t, t.addEventListener("opened-changed", () => {
      t.opened || this.__setVirtualKeyboardEnabled(!1);
    }), t.addEventListener("blur", () => this.__setVirtualKeyboardEnabled(!0)), t.addEventListener("touchstart", () => this.__setVirtualKeyboardEnabled(!0));
  }
  /** @private */
  __setVirtualKeyboardEnabled(t) {
    this.host.inputElement && (this.host.inputElement.inputMode = t ? "" : "none");
  }
}
/**
 * @license
 * Copyright (c) 2016 - 2023 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
const Vh = (o) => class extends ha(
  ie(jr(Qr(Et(o))))
) {
  static get properties() {
    return {
      /**
       * The current selected date.
       * @type {Date | undefined}
       * @protected
       */
      _selectedDate: {
        type: Date
      },
      /**
       * @type {Date | undefined}
       * @protected
       */
      _focusedDate: Date,
      /**
       * Selected date.
       *
       * Supported date formats:
       * - ISO 8601 `"YYYY-MM-DD"` (default)
       * - 6-digit extended ISO 8601 `"+YYYYYY-MM-DD"`, `"-YYYYYY-MM-DD"`
       *
       * @type {string}
       */
      value: {
        type: String,
        notify: !0,
        value: ""
      },
      /**
       * Date which should be visible when there is no value selected.
       *
       * The same date formats as for the `value` property are supported.
       * @attr {string} initial-position
       */
      initialPosition: String,
      /**
       * Set true to open the date selector overlay.
       */
      opened: {
        type: Boolean,
        reflectToAttribute: !0,
        notify: !0,
        observer: "_openedChanged"
      },
      /**
       * Set true to prevent the overlay from opening automatically.
       * @attr {boolean} auto-open-disabled
       */
      autoOpenDisabled: Boolean,
      /**
       * Set true to display ISO-8601 week numbers in the calendar. Notice that
       * displaying week numbers is only supported when `i18n.firstDayOfWeek`
       * is 1 (Monday).
       * @attr {boolean} show-week-numbers
       */
      showWeekNumbers: {
        type: Boolean,
        value: !1
      },
      /**
       * @type {boolean}
       * @protected
       */
      _fullscreen: {
        type: Boolean,
        value: !1
      },
      /**
       * @type {string}
       * @protected
       */
      _fullscreenMediaQuery: {
        value: "(max-width: 420px), (max-height: 420px)"
      },
      /**
       * The object used to localize this component.
       * To change the default localization, replace the entire
       * `i18n` object with a custom one.
       *
       * To update individual properties, extend the existing i18n object like so:
       * ```
       * datePicker.i18n = { ...datePicker.i18n, {
       *   formatDate: date => { ... },
       *   parseDate: value => { ... },
       * }};
       * ```
       *
       * The object has the following JSON structure and default values:
       *
       * ```
       * {
       *   // An array with the full names of months starting
       *   // with January.
       *   monthNames: [
       *     'January', 'February', 'March', 'April', 'May',
       *     'June', 'July', 'August', 'September',
       *     'October', 'November', 'December'
       *   ],
       *
       *   // An array of weekday names starting with Sunday. Used
       *   // in screen reader announcements.
       *   weekdays: [
       *     'Sunday', 'Monday', 'Tuesday', 'Wednesday',
       *     'Thursday', 'Friday', 'Saturday'
       *   ],
       *
       *   // An array of short weekday names starting with Sunday.
       *   // Displayed in the calendar.
       *   weekdaysShort: [
       *     'Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'
       *   ],
       *
       *   // An integer indicating the first day of the week
       *   // (0 = Sunday, 1 = Monday, etc.).
       *   firstDayOfWeek: 0,
       *
       *   // Translation of the Today shortcut button text.
       *   today: 'Today',
       *
       *   // Translation of the Cancel button text.
       *   cancel: 'Cancel',
       *
       *   // Used for adjusting the year value when parsing dates with short years.
       *   // The year values between 0 and 99 are evaluated and adjusted.
       *   // Example: for a referenceDate of 1970-10-30;
       *   //   dateToBeParsed: 40-10-30, result: 1940-10-30
       *   //   dateToBeParsed: 80-10-30, result: 1980-10-30
       *   //   dateToBeParsed: 10-10-30, result: 2010-10-30
       *   // Supported date format: ISO 8601 `"YYYY-MM-DD"` (default)
       *   // The default value is the current date.
       *   referenceDate: '',
       *
       *   // A function to format given `Object` as
       *   // date string. Object is in the format `{ day: ..., month: ..., year: ... }`
       *   // Note: The argument month is 0-based. This means that January = 0 and December = 11.
       *   formatDate: d => {
       *     // returns a string representation of the given
       *     // object in 'MM/DD/YYYY' -format
       *   },
       *
       *   // A function to parse the given text to an `Object` in the format `{ day: ..., month: ..., year: ... }`.
       *   // Must properly parse (at least) text formatted by `formatDate`.
       *   // Setting the property to null will disable keyboard input feature.
       *   // Note: The argument month is 0-based. This means that January = 0 and December = 11.
       *   parseDate: text => {
       *     // Parses a string in 'MM/DD/YY', 'MM/DD' or 'DD' -format to
       *     // an `Object` in the format `{ day: ..., month: ..., year: ... }`.
       *   }
       *
       *   // A function to format given `monthName` and
       *   // `fullYear` integer as calendar title string.
       *   formatTitle: (monthName, fullYear) => {
       *     return monthName + ' ' + fullYear;
       *   }
       * }
       * ```
       *
       * @type {!DatePickerI18n}
       * @default {English/US}
       */
      i18n: {
        type: Object,
        value: () => ({
          monthNames: [
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
          ],
          weekdays: ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
          weekdaysShort: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
          firstDayOfWeek: 0,
          today: "Today",
          cancel: "Cancel",
          referenceDate: "",
          formatDate(e) {
            const i = String(e.year).replace(/\d+/u, (r) => "0000".substr(r.length) + r);
            return [e.month + 1, e.day, i].join("/");
          },
          parseDate(e) {
            const i = e.split("/"), r = /* @__PURE__ */ new Date();
            let s, n = r.getMonth(), a = r.getFullYear();
            if (i.length === 3) {
              if (n = parseInt(i[0]) - 1, s = parseInt(i[1]), a = parseInt(i[2]), i[2].length < 3 && a >= 0) {
                const l = this.referenceDate ? Oe(this.referenceDate) : /* @__PURE__ */ new Date();
                a = Eh(l, a, n, s);
              }
            } else
              i.length === 2 ? (n = parseInt(i[0]) - 1, s = parseInt(i[1])) : i.length === 1 && (s = parseInt(i[0]));
            if (s !== void 0)
              return { day: s, month: n, year: a };
          },
          formatTitle: (e, i) => `${e} ${i}`
        })
      },
      /**
       * The earliest date that can be selected. All earlier dates will be disabled.
       *
       * Supported date formats:
       * - ISO 8601 `"YYYY-MM-DD"` (default)
       * - 6-digit extended ISO 8601 `"+YYYYYY-MM-DD"`, `"-YYYYYY-MM-DD"`
       *
       * @type {string | undefined}
       */
      min: {
        type: String
      },
      /**
       * The latest date that can be selected. All later dates will be disabled.
       *
       * Supported date formats:
       * - ISO 8601 `"YYYY-MM-DD"` (default)
       * - 6-digit extended ISO 8601 `"+YYYYYY-MM-DD"`, `"-YYYYYY-MM-DD"`
       *
       * @type {string | undefined}
       */
      max: {
        type: String
      },
      /**
       * The earliest date that can be selected. All earlier dates will be disabled.
       * @type {Date | undefined}
       * @protected
       */
      _minDate: {
        type: Date,
        computed: "__computeMinOrMaxDate(min)"
      },
      /**
       * The latest date that can be selected. All later dates will be disabled.
       * @type {Date | undefined}
       * @protected
       */
      _maxDate: {
        type: Date,
        computed: "__computeMinOrMaxDate(max)"
      },
      /** @private */
      _noInput: {
        type: Boolean,
        computed: "_isNoInput(inputElement, _fullscreen, _ios, i18n, opened, autoOpenDisabled)"
      },
      /** @private */
      _ios: {
        type: Boolean,
        value: Xt
      },
      /** @private */
      _focusOverlayOnOpen: Boolean,
      /** @private */
      _overlayContent: Object,
      /**
       * In date-picker, unlike other components extending `InputMixin`,
       * the property indicates true only if the input has been entered by the user.
       * In the case of programmatic changes, the property is reset to false.
       * Read more about why this workaround is needed:
       * https://github.com/vaadin/web-components/issues/5639
       *
       * @protected
       * @override
       */
      _hasInputValue: {
        type: Boolean
      }
    };
  }
  static get observers() {
    return [
      "_selectedDateChanged(_selectedDate, i18n.formatDate)",
      "_focusedDateChanged(_focusedDate, i18n.formatDate)",
      "__updateOverlayContent(_overlayContent, i18n, label, _minDate, _maxDate, _focusedDate, _selectedDate, showWeekNumbers)",
      "__updateOverlayContentTheme(_overlayContent, _theme)",
      "__updateOverlayContentFullScreen(_overlayContent, _fullscreen)"
    ];
  }
  static get constraints() {
    return [...super.constraints, "min", "max"];
  }
  constructor() {
    super(), this._boundOnClick = this._onClick.bind(this), this._boundOnScroll = this._onScroll.bind(this), this._boundOverlayRenderer = this._overlayRenderer.bind(this);
  }
  /**
   * @override
   * @protected
   */
  get _inputElementValue() {
    return super._inputElementValue;
  }
  /**
   * The setter is overridden to reset the `_hasInputValue` property
   * to false when the input element's value is updated programmatically.
   * In date-picker, `_hasInputValue` is supposed to indicate true only
   * if the input has been entered by the user.
   * Read more about why this workaround is needed:
   * https://github.com/vaadin/web-components/issues/5639
   *
   * @override
   * @protected
   */
  set _inputElementValue(e) {
    super._inputElementValue = e, this._hasInputValue = !1;
  }
  /**
   * Override a getter from `InputControlMixin` to make it optional
   * and to prevent warning when a clear button is missing,
   * for example when using <vaadin-date-picker-light>.
   * @protected
   * @return {Element | null | undefined}
   */
  get clearElement() {
    return null;
  }
  /** @private */
  get _nativeInput() {
    return this.inputElement ? this.inputElement.focusElement || this.inputElement : null;
  }
  /**
   * Override an event listener from `DelegateFocusMixin`
   * @protected
   */
  _onFocus(e) {
    super._onFocus(e), this._noInput && e.target.blur();
  }
  /**
   * Override an event listener from `DelegateFocusMixin`
   * @protected
   */
  _onBlur(e) {
    super._onBlur(e), this.opened || (this.autoOpenDisabled && this._selectParsedOrFocusedDate(), this.validate(), this._inputElementValue === "" && this.value !== "" && (this.value = ""));
  }
  /** @protected */
  ready() {
    super.ready(), this.addEventListener("click", this._boundOnClick), this.addController(
      new oa(this._fullscreenMediaQuery, (i) => {
        this._fullscreen = i;
      })
    ), this.addController(new ua(this));
    const e = this.$.overlay;
    this._overlayElement = e, e.renderer = this._boundOverlayRenderer, this.addEventListener("mousedown", () => this.__bringToFront()), this.addEventListener("touchstart", () => this.__bringToFront());
  }
  /** @protected */
  disconnectedCallback() {
    super.disconnectedCallback(), this.opened = !1;
  }
  /**
   * Override Polymer lifecycle callback to dispatch `change` event if needed.
   * This is necessary to ensure `change` is fired after `value-changed`.
   *
   * @param {!Object} currentProps Current accessor values
   * @param {?Object} changedProps Properties changed since the last call
   * @param {?Object} oldProps Previous values for each changed property
   * @protected
   * @override
   */
  _propertiesChanged(e, i, r) {
    super._propertiesChanged(e, i, r), "value" in i && this.__dispatchChange && (this.dispatchEvent(new CustomEvent("change", { bubbles: !0 })), this.__dispatchChange = !1);
  }
  /**
   * Opens the dropdown.
   */
  open() {
    !this.disabled && !this.readonly && (this.opened = !0);
  }
  /**
   * Closes the dropdown.
   */
  close() {
    this.$.overlay.close();
  }
  /** @private */
  _overlayRenderer(e) {
    if (e.firstChild)
      return;
    const i = document.createElement("vaadin-date-picker-overlay-content");
    e.appendChild(i), this._overlayContent = i, i.addEventListener("close", () => {
      this._close();
    }), i.addEventListener("focus-input", this._focusAndSelect.bind(this)), i.addEventListener("date-tap", (r) => {
      this.__userConfirmedDate = !0, this._selectDate(r.detail.date), this._close();
    }), i.addEventListener("date-selected", (r) => {
      this.__userConfirmedDate = !!r.detail.date, this._selectDate(r.detail.date);
    }), i.addEventListener("focusin", () => {
      this._keyboardActive && this._setFocused(!0);
    }), i.addEventListener("focused-date-changed", (r) => {
      this._focusedDate = r.detail.value;
    });
  }
  /**
   * Returns true if the current input value satisfies all constraints (if any)
   *
   * Override the `checkValidity` method for custom validations.
   *
   * @return {boolean} True if the value is valid
   */
  checkValidity() {
    const e = this._inputElementValue, i = !e || !!this._selectedDate && e === this._getFormattedDate(this.i18n.formatDate, this._selectedDate), r = !this._selectedDate || at(this._selectedDate, this._minDate, this._maxDate);
    let s = !0;
    return this.inputElement && (this.inputElement.checkValidity ? s = this.inputElement.checkValidity() : this.inputElement.validate && (s = this.inputElement.validate())), i && r && s;
  }
  /**
   * Override method inherited from `FocusMixin`
   * to not call `_setFocused(true)` when focus
   * is restored after closing overlay on click,
   * and to avoid removing `focus-ring` attribute.
   *
   * @param {!FocusEvent} _event
   * @return {boolean}
   * @protected
   * @override
   */
  _shouldSetFocus(e) {
    return !this._shouldKeepFocusRing;
  }
  /**
   * Override method inherited from `FocusMixin`
   * to prevent removing the `focused` attribute:
   * - when moving focus to the overlay content,
   * - when closing on date click / outside click.
   *
   * @param {!FocusEvent} _event
   * @return {boolean}
   * @protected
   * @override
   */
  _shouldRemoveFocus(e) {
    return !this.opened;
  }
  /**
   * Override method inherited from `FocusMixin`
   * to store the `focus-ring` state to restore
   * it later when closing on outside click.
   *
   * @param {boolean} focused
   * @protected
   * @override
   */
  _setFocused(e) {
    super._setFocused(e), this._shouldKeepFocusRing = e && this._keyboardActive;
  }
  /**
   * Select date on user interaction and set the flag
   * to fire change event if necessary.
   *
   * @param {Date} dateToSelect
   * @protected
   */
  _selectDate(e) {
    const i = this._formatISO(e);
    this.value !== i && (this.__dispatchChange = !0), this._selectedDate = e;
  }
  /** @private */
  _close() {
    this._focus(), this.close();
  }
  /** @private */
  __bringToFront() {
    requestAnimationFrame(() => {
      this.$.overlay.bringToFront();
    });
  }
  /** @private */
  // eslint-disable-next-line max-params
  _isNoInput(e, i, r, s, n, a) {
    return !e || i && (!a || n) || r && n || !s.parseDate;
  }
  /** @private */
  _formatISO(e) {
    if (!(e instanceof Date))
      return "";
    const i = (c, h = "00") => (h + c).substr((h + c).length - h.length);
    let r = "", s = "0000", n = e.getFullYear();
    n < 0 ? (n = -n, r = "-", s = "000000") : e.getFullYear() >= 1e4 && (r = "+", s = "000000");
    const a = r + i(n, s), l = i(e.getMonth() + 1), d = i(e.getDate());
    return [a, l, d].join("-");
  }
  /** @protected */
  _inputElementChanged(e) {
    super._inputElementChanged(e), e && (e.autocomplete = "off", e.setAttribute("role", "combobox"), e.setAttribute("aria-haspopup", "dialog"), e.setAttribute("aria-expanded", !!this.opened), this._applyInputValue(this._selectedDate));
  }
  /** @protected */
  _openedChanged(e) {
    this.inputElement && this.inputElement.setAttribute("aria-expanded", e);
  }
  /** @private */
  _selectedDateChanged(e, i) {
    if (e === void 0 || i === void 0)
      return;
    const r = this._formatISO(e);
    this.__keepInputValue || this._applyInputValue(e), r !== this.value && (this.validate(), this.value = r), this._ignoreFocusedDateChange = !0, this._focusedDate = e, this._ignoreFocusedDateChange = !1;
  }
  /** @private */
  _focusedDateChanged(e, i) {
    e === void 0 || i === void 0 || !this._ignoreFocusedDateChange && !this._noInput && this._applyInputValue(e);
  }
  /**
   * Override the value observer from `InputMixin` to implement custom
   * handling of the `value` property. The date-picker doesn't forward
   * the value directly to the input like the default implementation of `InputMixin`.
   * Instead, it parses the value into a date, puts it in `_selectedDate` which
   * is then displayed in the input with respect to the specified date format.
   *
   * @param {string | undefined} value
   * @param {string | undefined} oldValue
   * @protected
   * @override
   */
  _valueChanged(e, i) {
    const r = Oe(e);
    if (e && !r) {
      this.value = i;
      return;
    }
    e ? N(this._selectedDate, r) || (this._selectedDate = r, i !== void 0 && this.validate()) : this._selectedDate = null, this._toggleHasValue(this._hasValue);
  }
  /** @private */
  // eslint-disable-next-line max-params
  __updateOverlayContent(e, i, r, s, n, a, l, d) {
    e && e.setProperties({
      i18n: i,
      label: r,
      minDate: s,
      maxDate: n,
      focusedDate: a,
      selectedDate: l,
      showWeekNumbers: d
    });
  }
  /** @private */
  __updateOverlayContentTheme(e, i) {
    e && (i ? e.setAttribute("theme", i) : e.removeAttribute("theme"));
  }
  /** @private */
  __updateOverlayContentFullScreen(e, i) {
    e && e.toggleAttribute("fullscreen", i);
  }
  /** @protected */
  _onOverlayEscapePress() {
    this._focusedDate = this._selectedDate, this._close();
  }
  /** @protected */
  _onOverlayOpened() {
    const e = this._overlayContent, i = this._getInitialPosition();
    e.initialPosition = i;
    const r = e.focusedDate || i;
    e.scrollToDate(r), this._ignoreFocusedDateChange = !0, e.focusedDate = r, this._ignoreFocusedDateChange = !1, window.addEventListener("scroll", this._boundOnScroll, !0), this._focusOverlayOnOpen ? (e.focusDateElement(), this._focusOverlayOnOpen = !1) : this._focus();
    const s = this._nativeInput;
    this._noInput && s && (s.blur(), this._overlayContent.focusDateElement());
    const n = this._noInput ? e : [s, e];
    this.__showOthers = zn(n);
  }
  /** @private */
  _getInitialPosition() {
    const e = Oe(this.initialPosition), i = this._selectedDate || this._overlayContent.initialPosition || e || /* @__PURE__ */ new Date();
    return e || at(i, this._minDate, this._maxDate) ? i : ea(i, [this._minDate, this._maxDate]);
  }
  /** @private */
  _selectParsedOrFocusedDate() {
    if (this._ignoreFocusedDateChange = !0, this.i18n.parseDate) {
      const e = this._inputElementValue || "", i = this._getParsedDate(e);
      this._isValidDate(i) ? this._selectDate(i) : (this.__keepInputValue = !0, this._selectDate(null), this._selectedDate = null, this.__keepInputValue = !1);
    } else
      this._focusedDate && this._selectDate(this._focusedDate);
    this._ignoreFocusedDateChange = !1;
  }
  /** @protected */
  _onOverlayClosed() {
    this.__showOthers && (this.__showOthers(), this.__showOthers = null), window.removeEventListener("scroll", this._boundOnScroll, !0), this.__userConfirmedDate ? this.__userConfirmedDate = !1 : this._selectParsedOrFocusedDate(), this._nativeInput && this._nativeInput.selectionStart && (this._nativeInput.selectionStart = this._nativeInput.selectionEnd), this.value || this.validate();
  }
  /** @private */
  _onScroll(e) {
    (e.target === window || !this._overlayContent.contains(e.target)) && this._overlayContent._repositionYearScroller();
  }
  /** @protected */
  _focus() {
    this._noInput || this.inputElement.focus();
  }
  /** @private */
  _focusAndSelect() {
    this._focus(), this._setSelectionRange(0, this._inputElementValue.length);
  }
  /** @private */
  _applyInputValue(e) {
    this._inputElementValue = e ? this._getFormattedDate(this.i18n.formatDate, e) : "";
  }
  /** @private */
  _getFormattedDate(e, i) {
    return e(ta(i));
  }
  /** @private */
  _setSelectionRange(e, i) {
    this._nativeInput && this._nativeInput.setSelectionRange && this._nativeInput.setSelectionRange(e, i);
  }
  /** @private */
  _isValidDate(e) {
    return e && !isNaN(e.getTime());
  }
  /**
   * Override an event listener from `InputConstraintsMixin`
   * to have date-picker fully control when to fire a change event.
   * @protected
   */
  _onChange(e) {
    this._inputElementValue === "" && (this.__dispatchChange = !0), e.stopPropagation();
  }
  /**
   * @param {Event} event
   * @private
   */
  _onClick(e) {
    this._isClearButton(e) || this._onHostClick(e);
  }
  /**
   * @param {Event} event
   * @private
   */
  _onHostClick(e) {
    (!this.autoOpenDisabled || this._noInput) && (e.preventDefault(), this.open());
  }
  /**
   * Override an event listener from `InputControlMixin`
   * to validate and dispatch change on clear.
   * @protected
   */
  _onClearButtonClick(e) {
    e.preventDefault(), this._inputElementValue = "", this.value = "", this.validate(), this.dispatchEvent(new CustomEvent("change", { bubbles: !0 }));
  }
  /**
   * Override an event listener from `KeyboardMixin`.
   * @param {KeyboardEvent} e
   * @protected
   * @override
   */
  _onKeyDown(e) {
    switch (super._onKeyDown(e), this._noInput && [
      9
      // Tab
    ].indexOf(e.keyCode) === -1 && e.preventDefault(), e.key) {
      case "ArrowDown":
      case "ArrowUp":
        e.preventDefault(), this.opened ? this._overlayContent.focusDateElement() : (this._focusOverlayOnOpen = !0, this.open());
        break;
      case "Tab":
        this.opened && (e.preventDefault(), e.stopPropagation(), this._setSelectionRange(0, 0), e.shiftKey ? this._overlayContent.focusCancel() : this._overlayContent.focusDateElement());
        break;
    }
  }
  /**
   * Override an event listener from `KeyboardMixin`.
   *
   * @param {!KeyboardEvent} _event
   * @protected
   * @override
   */
  _onEnter(e) {
    const i = this.value;
    this.opened ? this.close() : this._selectParsedOrFocusedDate(), i === this.value && this.validate();
  }
  /**
   * Override an event listener from `KeyboardMixin`.
   * Do not call `super` in order to override clear
   * button logic defined in `InputControlMixin`.
   *
   * @param {!KeyboardEvent} event
   * @protected
   * @override
   */
  _onEscape(e) {
    if (!this.opened) {
      if (this.clearButtonVisible && this.value) {
        e.stopPropagation(), this._onClearButtonClick(e);
        return;
      }
      this.autoOpenDisabled ? (this.inputElement.value === "" && this._selectDate(null), this._applyInputValue(this._selectedDate)) : (this._focusedDate = this._selectedDate, this._selectParsedOrFocusedDate());
    }
  }
  /** @private */
  _getParsedDate(e = this._inputElementValue) {
    const i = this.i18n.parseDate && this.i18n.parseDate(e);
    return i && Oe(`${i.year}-${i.month + 1}-${i.day}`);
  }
  /** @protected */
  _isClearButton(e) {
    return e.composedPath()[0] === this.clearElement;
  }
  /**
   * Override an event listener from `InputMixin`
   * @protected
   */
  _onInput() {
    !this.opened && this.inputElement.value && !this.autoOpenDisabled && this.open(), this._userInputValueChanged();
  }
  /** @private */
  _userInputValueChanged() {
    if (this._inputElementValue) {
      const e = this._getParsedDate();
      this._isValidDate(e) && (this._ignoreFocusedDateChange = !0, N(e, this._focusedDate) || (this._focusedDate = e), this._ignoreFocusedDateChange = !1);
    }
  }
  /** @private */
  __computeMinOrMaxDate(e) {
    return Oe(e);
  }
  /**
   * Fired when the user commits a value change.
   *
   * @event change
   */
  /**
   * Fired when `value` property value changes.
   *
   * @event value-changed
   */
  /**
   * Fired when `opened` property value changes.
   *
   * @event opened-changed
   */
};
/**
 * @license
 * Copyright (c) 2016 - 2023 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
m("vaadin-date-picker", Pt, { moduleId: "vaadin-date-picker-styles" });
class ii extends Vh(fi(O(he(A)))) {
  static get is() {
    return "vaadin-date-picker";
  }
  static get template() {
    return k`
      <style>
        :host([opened]) {
          pointer-events: auto;
        }

        :host([dir='rtl']) [part='input-field'] {
          direction: ltr;
        }

        :host([dir='rtl']) [part='input-field'] ::slotted(input)::placeholder {
          direction: rtl;
          text-align: left;
        }
      </style>

      <div class="vaadin-date-picker-container">
        <div part="label">
          <slot name="label"></slot>
          <span part="required-indicator" aria-hidden="true" on-click="focus"></span>
        </div>

        <vaadin-input-container
          part="input-field"
          readonly="[[readonly]]"
          disabled="[[disabled]]"
          invalid="[[invalid]]"
          theme$="[[_theme]]"
        >
          <slot name="prefix" slot="prefix"></slot>
          <slot name="input"></slot>
          <div id="clearButton" part="clear-button" slot="suffix" aria-hidden="true"></div>
          <div part="toggle-button" slot="suffix" aria-hidden="true" on-click="_toggle"></div>
        </vaadin-input-container>

        <div part="helper-text">
          <slot name="helper"></slot>
        </div>

        <div part="error-message">
          <slot name="error-message"></slot>
        </div>
      </div>

      <vaadin-date-picker-overlay
        id="overlay"
        fullscreen$="[[_fullscreen]]"
        theme$="[[_theme]]"
        opened="{{opened}}"
        on-vaadin-overlay-escape-press="_onOverlayEscapePress"
        on-vaadin-overlay-open="_onOverlayOpened"
        on-vaadin-overlay-closing="_onOverlayClosed"
        restore-focus-on-close
        restore-focus-node="[[inputElement]]"
      ></vaadin-date-picker-overlay>

      <slot name="tooltip"></slot>
    `;
  }
  /**
   * Used by `InputControlMixin` as a reference to the clear button element.
   * @protected
   * @return {!HTMLElement}
   */
  get clearElement() {
    return this.$.clearButton;
  }
  /** @protected */
  ready() {
    super.ready(), this.addController(
      new It(this, (e) => {
        this._setInputElement(e), this._setFocusElement(e), this.stateTarget = e, this.ariaTarget = e;
      })
    ), this.addController(new Tt(this.inputElement, this._labelController)), this._tooltipController = new ue(this), this.addController(this._tooltipController), this._tooltipController.setPosition("top"), this._tooltipController.setShouldShow((e) => !e.opened), this.shadowRoot.querySelector('[part="toggle-button"]').addEventListener("mousedown", (e) => e.preventDefault()), this.$.overlay.addEventListener("vaadin-overlay-close", this._onVaadinOverlayClose.bind(this));
  }
  /** @private */
  _onVaadinOverlayClose(t) {
    t.detail.sourceEvent && t.detail.sourceEvent.composedPath().includes(this) && t.preventDefault();
  }
  /** @private */
  _toggle(t) {
    t.stopPropagation(), this.$.overlay.opened ? this.close() : this.open();
  }
  // Workaround https://github.com/vaadin/web-components/issues/2855
  /** @protected */
  _openedChanged(t) {
    super._openedChanged(t), this.$.overlay.positionTarget = this.shadowRoot.querySelector('[part="input-field"]'), this.$.overlay.noVerticalOverlap = !0;
  }
}
customElements.define(ii.is, ii);
const Zr = _`
  :host {
    display: flex;
    align-items: center;
    box-sizing: border-box;
    font-family: var(--lumo-font-family);
    font-size: var(--lumo-font-size-m);
    line-height: var(--lumo-line-height-xs);
    padding: 0.5em calc(var(--lumo-space-l) + var(--lumo-border-radius-m) / 4) 0.5em
      var(--_lumo-list-box-item-padding-left, calc(var(--lumo-border-radius-m) / 4));
    min-height: var(--lumo-size-m);
    outline: none;
    border-radius: var(--lumo-border-radius-m);
    cursor: var(--lumo-clickable-cursor);
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    -webkit-tap-highlight-color: var(--lumo-primary-color-10pct);
  }

  /* Checkmark */
  [part='checkmark']::before {
    display: var(--_lumo-item-selected-icon-display, none);
    content: var(--lumo-icons-checkmark);
    font-family: lumo-icons;
    font-size: var(--lumo-icon-size-m);
    line-height: 1;
    font-weight: normal;
    width: 1em;
    height: 1em;
    margin: calc((1 - var(--lumo-line-height-xs)) * var(--lumo-font-size-m) / 2) 0;
    color: var(--lumo-primary-text-color);
    flex: none;
    opacity: 0;
    transition: transform 0.2s cubic-bezier(0.12, 0.32, 0.54, 2), opacity 0.1s;
  }

  :host([selected]) [part='checkmark']::before {
    opacity: 1;
  }

  :host([active]:not([selected])) [part='checkmark']::before {
    transform: scale(0.8);
    opacity: 0;
    transition-duration: 0s;
  }

  [part='content'] {
    flex: auto;
  }

  /* Disabled */
  :host([disabled]) {
    color: var(--lumo-disabled-text-color);
    cursor: default;
    pointer-events: none;
  }

  /* TODO a workaround until we have "focus-follows-mouse". After that, use the hover style for focus-ring as well */
  @media (any-hover: hover) {
    :host(:hover:not([disabled])) {
      background-color: var(--lumo-primary-color-10pct);
    }

    :host([focus-ring]:not([disabled])) {
      box-shadow: inset 0 0 0 2px var(--lumo-primary-color-50pct);
    }
  }

  /* RTL specific styles */
  :host([dir='rtl']) {
    padding-left: calc(var(--lumo-space-l) + var(--lumo-border-radius-m) / 4);
    padding-right: var(--_lumo-list-box-item-padding-left, calc(var(--lumo-border-radius-m) / 4));
  }

  /* Slotted icons */
  :host ::slotted(vaadin-icon) {
    width: var(--lumo-icon-size-m);
    height: var(--lumo-icon-size-m);
  }
`;
m("vaadin-item", Zr, { moduleId: "lumo-item" });
const pa = _`
  :host {
    transition: background-color 100ms;
    overflow: hidden;
    --_lumo-item-selected-icon-display: block;
  }

  @media (any-hover: hover) {
    :host([focused]:not([disabled])) {
      box-shadow: inset 0 0 0 2px var(--lumo-primary-color-50pct);
    }
  }
`;
m("vaadin-combo-box-item", [Zr, pa], {
  moduleId: "lumo-combo-box-item"
});
/**
 * @license
 * Copyright (c) 2022 - 2023 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
const Uh = _`
  [part~='loader'] {
    box-sizing: border-box;
    width: var(--lumo-icon-size-s);
    height: var(--lumo-icon-size-s);
    border: 2px solid transparent;
    border-color: var(--lumo-primary-color-10pct) var(--lumo-primary-color-10pct) var(--lumo-primary-color)
      var(--lumo-primary-color);
    border-radius: calc(0.5 * var(--lumo-icon-size-s));
    opacity: 0;
    pointer-events: none;
  }

  :host(:not([loading])) [part~='loader'] {
    display: none;
  }

  :host([loading]) [part~='loader'] {
    animation: 1s linear infinite lumo-loader-rotate, 0.3s 0.1s lumo-loader-fade-in both;
  }

  @keyframes lumo-loader-fade-in {
    0% {
      opacity: 0;
    }

    100% {
      opacity: 1;
    }
  }

  @keyframes lumo-loader-rotate {
    0% {
      transform: rotate(0deg);
    }

    100% {
      transform: rotate(360deg);
    }
  }
`, _a = _`
  [part='content'] {
    padding: 0;
  }

  /* When items are empty, the spinner needs some room */
  :host(:not([closing])) [part~='content'] {
    min-height: calc(2 * var(--lumo-space-s) + var(--lumo-icon-size-s));
  }

  [part~='overlay'] {
    position: relative;
  }

  :host([top-aligned]) [part~='overlay'] {
    margin-top: var(--lumo-space-xs);
  }

  :host([bottom-aligned]) [part~='overlay'] {
    margin-bottom: var(--lumo-space-xs);
  }
`, qh = _`
  [part~='loader'] {
    position: absolute;
    z-index: 1;
    left: var(--lumo-space-s);
    right: var(--lumo-space-s);
    top: var(--lumo-space-s);
    margin-left: auto;
    margin-inline-start: auto;
    margin-inline-end: 0;
  }

  :host([dir='rtl']) [part~='loader'] {
    left: auto;
    margin-left: 0;
    margin-right: auto;
    margin-inline-start: 0;
    margin-inline-end: auto;
  }
`;
m(
  "vaadin-combo-box-overlay",
  [
    At,
    di,
    _a,
    Uh,
    qh,
    _`
      :host {
        --_vaadin-combo-box-items-container-border-width: var(--lumo-space-xs);
        --_vaadin-combo-box-items-container-border-style: solid;
      }
    `
  ],
  { moduleId: "lumo-combo-box-overlay" }
);
/**
 * @license
 * Copyright (c) 2018 - 2023 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
m("vaadin-time-picker-item", [Zr, pa], {
  moduleId: "lumo-time-picker-item"
});
m(
  "vaadin-time-picker-overlay",
  [
    At,
    di,
    _a,
    _`
      :host {
        --_vaadin-time-picker-items-container-border-width: var(--lumo-space-xs);
        --_vaadin-time-picker-items-container-border-style: solid;
      }
    `
  ],
  {
    moduleId: "lumo-time-picker-overlay"
  }
);
const Wh = _`
  [part~='toggle-button']::before {
    content: var(--lumo-icons-clock);
  }

  :host([dir='rtl']) [part='input-field'] ::slotted(input:placeholder-shown) {
    --_lumo-text-field-overflow-mask-image: none;
  }

  :host([dir='rtl']) [part='input-field'] ::slotted(input) {
    --_lumo-text-field-overflow-mask-image: linear-gradient(to left, transparent, #000 1.25em);
  }
`;
m("vaadin-time-picker", [St, Wh], { moduleId: "lumo-time-picker" });
/**
 * @license
 * Copyright (c) 2015 - 2023 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
const fa = (o) => class extends o {
  static get properties() {
    return {
      /**
       * The index of the item.
       */
      index: {
        type: Number
      },
      /**
       * The item to render.
       */
      item: {
        type: Object
      },
      /**
       * The text to render in the item.
       */
      label: {
        type: String
      },
      /**
       * True when item is selected.
       */
      selected: {
        type: Boolean,
        value: !1,
        reflectToAttribute: !0
      },
      /**
       * True when item is focused.
       */
      focused: {
        type: Boolean,
        value: !1,
        reflectToAttribute: !0
      },
      /**
       * Custom function for rendering the item content.
       */
      renderer: {
        type: Function
      }
    };
  }
  static get observers() {
    return ["__rendererOrItemChanged(renderer, index, item.*, selected, focused)", "__updateLabel(label, renderer)"];
  }
  /** @protected */
  connectedCallback() {
    super.connectedCallback(), this._owner = this.parentNode.owner;
    const e = this._owner.getAttribute("dir");
    e && this.setAttribute("dir", e);
  }
  /**
   * Requests an update for the content of the item.
   * While performing the update, it invokes the renderer passed in the `renderer` property.
   *
   * It is not guaranteed that the update happens immediately (synchronously) after it is requested.
   */
  requestContentUpdate() {
    if (!this.renderer)
      return;
    const e = {
      index: this.index,
      item: this.item,
      focused: this.focused,
      selected: this.selected
    };
    this.renderer(this, this._owner, e);
  }
  /** @private */
  __rendererOrItemChanged(e, i, r) {
    r === void 0 || i === void 0 || (this._oldRenderer !== e && (this.innerHTML = "", delete this._$litPart$), e && (this._oldRenderer = e, this.requestContentUpdate()));
  }
  /** @private */
  __updateLabel(e, i) {
    i || (this.textContent = e);
  }
};
/**
 * @license
 * Copyright (c) 2018 - 2023 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
class is extends fa(O(te(A))) {
  static get is() {
    return "vaadin-time-picker-item";
  }
  static get template() {
    return k`
      <style>
        :host {
          display: block;
        }

        :host([hidden]) {
          display: none !important;
        }
      </style>
      <span part="checkmark" aria-hidden="true"></span>
      <div part="content">
        <slot></slot>
      </div>
    `;
  }
}
customElements.define(is.is, is);
/**
 * @license
 * Copyright (c) 2016 The Polymer Project Authors. All rights reserved.
 * This code may only be used under the BSD style license found at http://polymer.github.io/LICENSE.txt
 * The complete set of authors may be found at http://polymer.github.io/AUTHORS.txt
 * The complete set of contributors may be found at http://polymer.github.io/CONTRIBUTORS.txt
 * Code distributed by Google as part of the polymer project is also
 * subject to an additional IP rights grant found at http://polymer.github.io/PATENTS.txt
 */
const rs = navigator.userAgent.match(/iP(?:hone|ad;(?: U;)? CPU) OS (\d+)/u), Gh = rs && rs[1] >= 8, os = 3, jh = {
  /**
   * The ratio of hidden tiles that should remain in the scroll direction.
   * Recommended value ~0.5, so it will distribute tiles evenly in both
   * directions.
   */
  _ratio: 0.5,
  /**
   * The padding-top value for the list.
   */
  _scrollerPaddingTop: 0,
  /**
   * This value is a cached value of `scrollTop` from the last `scroll` event.
   */
  _scrollPosition: 0,
  /**
   * The sum of the heights of all the tiles in the DOM.
   */
  _physicalSize: 0,
  /**
   * The average `offsetHeight` of the tiles observed till now.
   */
  _physicalAverage: 0,
  /**
   * The number of tiles which `offsetHeight` > 0 observed until now.
   */
  _physicalAverageCount: 0,
  /**
   * The Y position of the item rendered in the `_physicalStart`
   * tile relative to the scrolling list.
   */
  _physicalTop: 0,
  /**
   * The number of items in the list.
   */
  _virtualCount: 0,
  /**
   * The estimated scroll height based on `_physicalAverage`
   */
  _estScrollHeight: 0,
  /**
   * The scroll height of the dom node
   */
  _scrollHeight: 0,
  /**
   * The height of the list. This is referred as the viewport in the context of
   * list.
   */
  _viewportHeight: 0,
  /**
   * The width of the list. This is referred as the viewport in the context of
   * list.
   */
  _viewportWidth: 0,
  /**
   * An array of DOM nodes that are currently in the tree
   * @type {?Array<!HTMLElement>}
   */
  _physicalItems: null,
  /**
   * An array of heights for each item in `_physicalItems`
   * @type {?Array<number>}
   */
  _physicalSizes: null,
  /**
   * A cached value for the first visible index.
   * See `firstVisibleIndex`
   * @type {?number}
   */
  _firstVisibleIndexVal: null,
  /**
   * A cached value for the last visible index.
   * See `lastVisibleIndex`
   * @type {?number}
   */
  _lastVisibleIndexVal: null,
  /**
   * The max number of pages to render. One page is equivalent to the height of
   * the list.
   */
  _maxPages: 2,
  /**
   * The cost of stamping a template in ms.
   */
  _templateCost: 0,
  /**
   * The bottom of the physical content.
   */
  get _physicalBottom() {
    return this._physicalTop + this._physicalSize;
  },
  /**
   * The bottom of the scroll.
   */
  get _scrollBottom() {
    return this._scrollPosition + this._viewportHeight;
  },
  /**
   * The n-th item rendered in the last physical item.
   */
  get _virtualEnd() {
    return this._virtualStart + this._physicalCount - 1;
  },
  /**
   * The height of the physical content that isn't on the screen.
   */
  get _hiddenContentSize() {
    return this._physicalSize - this._viewportHeight;
  },
  /**
   * The maximum scroll top value.
   */
  get _maxScrollTop() {
    return this._estScrollHeight - this._viewportHeight + this._scrollOffset;
  },
  /**
   * The largest n-th value for an item such that it can be rendered in
   * `_physicalStart`.
   */
  get _maxVirtualStart() {
    const o = this._virtualCount;
    return Math.max(0, o - this._physicalCount);
  },
  get _virtualStart() {
    return this._virtualStartVal || 0;
  },
  set _virtualStart(o) {
    o = this._clamp(o, 0, this._maxVirtualStart), this._virtualStartVal = o;
  },
  get _physicalStart() {
    return this._physicalStartVal || 0;
  },
  /**
   * The k-th tile that is at the top of the scrolling list.
   */
  set _physicalStart(o) {
    o %= this._physicalCount, o < 0 && (o = this._physicalCount + o), this._physicalStartVal = o;
  },
  /**
   * The k-th tile that is at the bottom of the scrolling list.
   */
  get _physicalEnd() {
    return (this._physicalStart + this._physicalCount - 1) % this._physicalCount;
  },
  get _physicalCount() {
    return this._physicalCountVal || 0;
  },
  set _physicalCount(o) {
    this._physicalCountVal = o;
  },
  /**
   * An optimal physical size such that we will have enough physical items
   * to fill up the viewport and recycle when the user scrolls.
   *
   * This default value assumes that we will at least have the equivalent
   * to a viewport of physical items above and below the user's viewport.
   */
  get _optPhysicalSize() {
    return this._viewportHeight === 0 ? 1 / 0 : this._viewportHeight * this._maxPages;
  },
  /**
   * True if the current list is visible.
   */
  get _isVisible() {
    return !!(this.offsetWidth || this.offsetHeight);
  },
  /**
   * Gets the index of the first visible item in the viewport.
   *
   * @type {number}
   */
  get firstVisibleIndex() {
    let o = this._firstVisibleIndexVal;
    if (o == null) {
      let t = this._physicalTop + this._scrollOffset;
      o = this._iterateItems((e, i) => {
        if (t += this._getPhysicalSizeIncrement(e), t > this._scrollPosition)
          return i;
      }) || 0, this._firstVisibleIndexVal = o;
    }
    return o;
  },
  /**
   * Gets the index of the last visible item in the viewport.
   *
   * @type {number}
   */
  get lastVisibleIndex() {
    let o = this._lastVisibleIndexVal;
    if (o == null) {
      let t = this._physicalTop + this._scrollOffset;
      this._iterateItems((e, i) => {
        t < this._scrollBottom && (o = i), t += this._getPhysicalSizeIncrement(e);
      }), this._lastVisibleIndexVal = o;
    }
    return o;
  },
  get _scrollOffset() {
    return this._scrollerPaddingTop + this.scrollOffset;
  },
  /**
   * Recycles the physical items when needed.
   */
  _scrollHandler() {
    const o = Math.max(0, Math.min(this._maxScrollTop, this._scrollTop));
    let t = o - this._scrollPosition;
    const e = t >= 0;
    if (this._scrollPosition = o, this._firstVisibleIndexVal = null, this._lastVisibleIndexVal = null, Math.abs(t) > this._physicalSize && this._physicalSize > 0) {
      t -= this._scrollOffset;
      const i = Math.round(t / this._physicalAverage);
      this._virtualStart += i, this._physicalStart += i, this._physicalTop = Math.min(Math.floor(this._virtualStart) * this._physicalAverage, this._scrollPosition), this._update();
    } else if (this._physicalCount > 0) {
      const i = this._getReusables(e);
      e ? (this._physicalTop = i.physicalTop, this._virtualStart += i.indexes.length, this._physicalStart += i.indexes.length) : (this._virtualStart -= i.indexes.length, this._physicalStart -= i.indexes.length), this._update(i.indexes, e ? null : i.indexes), this._debounce("_increasePoolIfNeeded", this._increasePoolIfNeeded.bind(this, 0), de);
    }
  },
  /**
   * Returns an object that contains the indexes of the physical items
   * that might be reused and the physicalTop.
   *
   * @param {boolean} fromTop If the potential reusable items are above the scrolling region.
   */
  _getReusables(o) {
    let t, e, i;
    const r = [], s = this._hiddenContentSize * this._ratio, n = this._virtualStart, a = this._virtualEnd, l = this._physicalCount;
    let d = this._physicalTop + this._scrollOffset;
    const c = this._physicalBottom + this._scrollOffset, h = this._scrollPosition, u = this._scrollBottom;
    for (o ? (t = this._physicalStart, e = h - d) : (t = this._physicalEnd, e = c - u); i = this._getPhysicalSizeIncrement(t), e -= i, !(r.length >= l || e <= s); )
      if (o) {
        if (a + r.length + 1 >= this._virtualCount || d + i >= h - this._scrollOffset)
          break;
        r.push(t), d += i, t = (t + 1) % l;
      } else {
        if (n - r.length <= 0 || d + this._physicalSize - i <= u)
          break;
        r.push(t), d -= i, t = t === 0 ? l - 1 : t - 1;
      }
    return { indexes: r, physicalTop: d - this._scrollOffset };
  },
  /**
   * Update the list of items, starting from the `_virtualStart` item.
   * @param {!Array<number>=} itemSet
   * @param {!Array<number>=} movingUp
   */
  _update(o, t) {
    if (!(o && o.length === 0 || this._physicalCount === 0)) {
      if (this._assignModels(o), this._updateMetrics(o), t)
        for (; t.length; ) {
          const e = t.pop();
          this._physicalTop -= this._getPhysicalSizeIncrement(e);
        }
      this._positionItems(), this._updateScrollerSize();
    }
  },
  _isClientFull() {
    return this._scrollBottom !== 0 && this._physicalBottom - 1 >= this._scrollBottom && this._physicalTop <= this._scrollPosition;
  },
  /**
   * Increases the pool size.
   */
  _increasePoolIfNeeded(o) {
    const e = this._clamp(
      this._physicalCount + o,
      os,
      this._virtualCount - this._virtualStart
    ) - this._physicalCount;
    let i = Math.round(this._physicalCount * 0.5);
    if (!(e < 0)) {
      if (e > 0) {
        const r = window.performance.now();
        [].push.apply(this._physicalItems, this._createPool(e));
        for (let s = 0; s < e; s++)
          this._physicalSizes.push(0);
        this._physicalCount += e, this._physicalStart > this._physicalEnd && this._isIndexRendered(this._focusedVirtualIndex) && this._getPhysicalIndex(this._focusedVirtualIndex) < this._physicalEnd && (this._physicalStart += e), this._update(), this._templateCost = (window.performance.now() - r) / e, i = Math.round(this._physicalCount * 0.5);
      }
      this._virtualEnd >= this._virtualCount - 1 || i === 0 || (this._isClientFull() ? this._physicalSize < this._optPhysicalSize && this._debounce(
        "_increasePoolIfNeeded",
        this._increasePoolIfNeeded.bind(this, this._clamp(Math.round(50 / this._templateCost), 1, i)),
        Bn
      ) : this._debounce("_increasePoolIfNeeded", this._increasePoolIfNeeded.bind(this, i), de));
    }
  },
  /**
   * Renders the a new list.
   */
  _render() {
    if (!(!this.isAttached || !this._isVisible))
      if (this._physicalCount !== 0) {
        const o = this._getReusables(!0);
        this._physicalTop = o.physicalTop, this._virtualStart += o.indexes.length, this._physicalStart += o.indexes.length, this._update(o.indexes), this._update(), this._increasePoolIfNeeded(0);
      } else
        this._virtualCount > 0 && (this.updateViewportBoundaries(), this._increasePoolIfNeeded(os));
  },
  /**
   * Called when the items have changed. That is, reassignments
   * to `items`, splices or updates to a single item.
   */
  _itemsChanged(o) {
    o.path === "items" && (this._virtualStart = 0, this._physicalTop = 0, this._virtualCount = this.items ? this.items.length : 0, this._physicalIndexForKey = {}, this._firstVisibleIndexVal = null, this._lastVisibleIndexVal = null, this._physicalItems || (this._physicalItems = []), this._physicalSizes || (this._physicalSizes = []), this._physicalStart = 0, this._scrollTop > this._scrollOffset && this._resetScrollPosition(0), this._debounce("_render", this._render, le));
  },
  /**
   * Executes a provided function per every physical index in `itemSet`
   * `itemSet` default value is equivalent to the entire set of physical
   * indexes.
   *
   * @param {!function(number, number)} fn
   * @param {!Array<number>=} itemSet
   */
  _iterateItems(o, t) {
    let e, i, r, s;
    if (arguments.length === 2 && t) {
      for (s = 0; s < t.length; s++)
        if (e = t[s], i = this._computeVidx(e), (r = o.call(this, e, i)) != null)
          return r;
    } else {
      for (e = this._physicalStart, i = this._virtualStart; e < this._physicalCount; e++, i++)
        if ((r = o.call(this, e, i)) != null)
          return r;
      for (e = 0; e < this._physicalStart; e++, i++)
        if ((r = o.call(this, e, i)) != null)
          return r;
    }
  },
  /**
   * Returns the virtual index for a given physical index
   *
   * @param {number} pidx Physical index
   * @return {number}
   */
  _computeVidx(o) {
    return o >= this._physicalStart ? this._virtualStart + (o - this._physicalStart) : this._virtualStart + (this._physicalCount - this._physicalStart) + o;
  },
  /**
   * Updates the position of the physical items.
   */
  _positionItems() {
    this._adjustScrollPosition();
    let o = this._physicalTop;
    this._iterateItems((t) => {
      this.translate3d(0, `${o}px`, 0, this._physicalItems[t]), o += this._physicalSizes[t];
    });
  },
  _getPhysicalSizeIncrement(o) {
    return this._physicalSizes[o];
  },
  /**
   * Adjusts the scroll position when it was overestimated.
   */
  _adjustScrollPosition() {
    const o = this._virtualStart === 0 ? this._physicalTop : Math.min(this._scrollPosition + this._physicalTop, 0);
    if (o !== 0) {
      this._physicalTop -= o;
      const t = this._scrollPosition;
      !Gh && t > 0 && this._resetScrollPosition(t - o);
    }
  },
  /**
   * Sets the position of the scroll.
   */
  _resetScrollPosition(o) {
    this.scrollTarget && o >= 0 && (this._scrollTop = o, this._scrollPosition = this._scrollTop);
  },
  /**
   * Sets the scroll height, that's the height of the content,
   *
   * @param {boolean=} forceUpdate If true, updates the height no matter what.
   */
  _updateScrollerSize(o) {
    const t = this._physicalBottom + Math.max(this._virtualCount - this._physicalCount - this._virtualStart, 0) * this._physicalAverage;
    this._estScrollHeight = t, (o || this._scrollHeight === 0 || this._scrollPosition >= t - this._physicalSize || Math.abs(t - this._scrollHeight) >= this._viewportHeight) && (this.$.items.style.height = `${t}px`, this._scrollHeight = t);
  },
  /**
   * Scroll to a specific index in the virtual list regardless
   * of the physical items in the DOM tree.
   *
   * @method scrollToIndex
   * @param {number} idx The index of the item
   */
  scrollToIndex(o) {
    if (typeof o != "number" || o < 0 || o > this.items.length - 1 || (st(), this._physicalCount === 0))
      return;
    o = this._clamp(o, 0, this._virtualCount - 1), (!this._isIndexRendered(o) || o >= this._maxVirtualStart) && (this._virtualStart = o - 1), this._assignModels(), this._updateMetrics(), this._physicalTop = this._virtualStart * this._physicalAverage;
    let t = this._physicalStart, e = this._virtualStart, i = 0;
    const r = this._hiddenContentSize;
    for (; e < o && i <= r; )
      i += this._getPhysicalSizeIncrement(t), t = (t + 1) % this._physicalCount, e += 1;
    this._updateScrollerSize(!0), this._positionItems(), this._resetScrollPosition(this._physicalTop + this._scrollOffset + i), this._increasePoolIfNeeded(0), this._firstVisibleIndexVal = null, this._lastVisibleIndexVal = null;
  },
  /**
   * Reset the physical average and the average count.
   */
  _resetAverage() {
    this._physicalAverage = 0, this._physicalAverageCount = 0;
  },
  /**
   * A handler for the `iron-resize` event triggered by `IronResizableBehavior`
   * when the element is resized.
   */
  _resizeHandler() {
    this._debounce(
      "_render",
      () => {
        this._firstVisibleIndexVal = null, this._lastVisibleIndexVal = null, this._isVisible ? (this.updateViewportBoundaries(), this.toggleScrollListener(!0), this._resetAverage(), this._render()) : this.toggleScrollListener(!1);
      },
      le
    );
  },
  _isIndexRendered(o) {
    return o >= this._virtualStart && o <= this._virtualEnd;
  },
  _getPhysicalIndex(o) {
    return (this._physicalStart + (o - this._virtualStart)) % this._physicalCount;
  },
  _clamp(o, t, e) {
    return Math.min(e, Math.max(t, o));
  },
  _debounce(o, t, e) {
    this._debouncers || (this._debouncers = {}), this._debouncers[o] = w.debounce(this._debouncers[o], e, t.bind(this)), Hn(this._debouncers[o]);
  }
};
/**
 * @license
 * Copyright (c) 2021 - 2023 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
const Yh = 1e5, Vi = 1e3;
class ma {
  constructor({ createElements: t, updateElement: e, scrollTarget: i, scrollContainer: r, elementsContainer: s, reorderElements: n }) {
    this.isAttached = !0, this._vidxOffset = 0, this.createElements = t, this.updateElement = e, this.scrollTarget = i, this.scrollContainer = r, this.elementsContainer = s || r, this.reorderElements = n, this._maxPages = 1.3, this.__placeholderHeight = 200, this.__elementHeightQueue = Array(10), this.timeouts = {
      SCROLL_REORDER: 500,
      IGNORE_WHEEL: 500,
      FIX_INVALID_ITEM_POSITIONING: 100
    }, this.__resizeObserver = new ResizeObserver(() => this._resizeHandler()), getComputedStyle(this.scrollTarget).overflow === "visible" && (this.scrollTarget.style.overflow = "auto"), getComputedStyle(this.scrollContainer).position === "static" && (this.scrollContainer.style.position = "relative"), this.__resizeObserver.observe(this.scrollTarget), this.scrollTarget.addEventListener("scroll", () => this._scrollHandler()), this._scrollLineHeight = this._getScrollLineHeight(), this.scrollTarget.addEventListener("wheel", (a) => this.__onWheel(a)), this.reorderElements && (this.scrollTarget.addEventListener("mousedown", () => {
      this.__mouseDown = !0;
    }), this.scrollTarget.addEventListener("mouseup", () => {
      this.__mouseDown = !1, this.__pendingReorder && this.__reorderElements();
    }));
  }
  get scrollOffset() {
    return 0;
  }
  get adjustedFirstVisibleIndex() {
    return this.firstVisibleIndex + this._vidxOffset;
  }
  get adjustedLastVisibleIndex() {
    return this.lastVisibleIndex + this._vidxOffset;
  }
  scrollToIndex(t) {
    if (typeof t != "number" || isNaN(t) || this.size === 0 || !this.scrollTarget.offsetHeight)
      return;
    t = this._clamp(t, 0, this.size - 1);
    const e = this.__getVisibleElements().length;
    let i = Math.floor(t / this.size * this._virtualCount);
    this._virtualCount - i < e ? (i = this._virtualCount - (this.size - t), this._vidxOffset = this.size - this._virtualCount) : i < e ? t < Vi ? (i = t, this._vidxOffset = 0) : (i = Vi, this._vidxOffset = t - i) : this._vidxOffset = t - i, this.__skipNextVirtualIndexAdjust = !0, super.scrollToIndex(i), this.adjustedFirstVisibleIndex !== t && this._scrollTop < this._maxScrollTop && !this.grid && (this._scrollTop -= this.__getIndexScrollOffset(t) || 0), this._scrollHandler();
  }
  flush() {
    this.scrollTarget.offsetHeight !== 0 && (this._resizeHandler(), st(), this._scrollHandler(), this.__fixInvalidItemPositioningDebouncer && this.__fixInvalidItemPositioningDebouncer.flush(), this.__scrollReorderDebouncer && this.__scrollReorderDebouncer.flush(), this.__debouncerWheelAnimationFrame && this.__debouncerWheelAnimationFrame.flush());
  }
  update(t = 0, e = this.size - 1) {
    const i = [];
    this.__getVisibleElements().forEach((r) => {
      r.__virtualIndex >= t && r.__virtualIndex <= e && (this.__updateElement(r, r.__virtualIndex, !0), i.push(r));
    }), this.__afterElementsUpdated(i);
  }
  /**
   * Updates the height for a given set of items.
   *
   * @param {!Array<number>=} itemSet
   */
  _updateMetrics(t) {
    st();
    let e = 0, i = 0;
    const r = this._physicalAverageCount, s = this._physicalAverage;
    this._iterateItems((n, a) => {
      i += this._physicalSizes[n], this._physicalSizes[n] = Math.ceil(this.__getBorderBoxHeight(this._physicalItems[n])), e += this._physicalSizes[n], this._physicalAverageCount += this._physicalSizes[n] ? 1 : 0;
    }, t), this._physicalSize = this._physicalSize + e - i, this._physicalAverageCount !== r && (this._physicalAverage = Math.round(
      (s * r + e) / this._physicalAverageCount
    ));
  }
  __getBorderBoxHeight(t) {
    const e = getComputedStyle(t), i = parseFloat(e.height) || 0;
    if (e.boxSizing === "border-box")
      return i;
    const r = parseFloat(e.paddingBottom) || 0, s = parseFloat(e.paddingTop) || 0, n = parseFloat(e.borderBottomWidth) || 0, a = parseFloat(e.borderTopWidth) || 0;
    return i + r + s + n + a;
  }
  __updateElement(t, e, i) {
    t.style.paddingTop && (t.style.paddingTop = ""), !this.__preventElementUpdates && (t.__lastUpdatedIndex !== e || i) && (this.updateElement(t, e), t.__lastUpdatedIndex = e);
  }
  /**
   * Called synchronously right after elements have been updated.
   * This is a good place to do any post-update work.
   *
   * @param {!Array<!HTMLElement>} updatedElements
   */
  __afterElementsUpdated(t) {
    t.forEach((e) => {
      const i = e.offsetHeight;
      if (i === 0)
        e.style.paddingTop = `${this.__placeholderHeight}px`, this.__placeholderClearDebouncer = w.debounce(
          this.__placeholderClearDebouncer,
          le,
          () => this._resizeHandler()
        );
      else {
        this.__elementHeightQueue.push(i), this.__elementHeightQueue.shift();
        const r = this.__elementHeightQueue.filter((s) => s !== void 0);
        this.__placeholderHeight = Math.round(r.reduce((s, n) => s + n, 0) / r.length);
      }
    });
  }
  __getIndexScrollOffset(t) {
    const e = this.__getVisibleElements().find((i) => i.__virtualIndex === t);
    return e ? this.scrollTarget.getBoundingClientRect().top - e.getBoundingClientRect().top : void 0;
  }
  get size() {
    return this.__size;
  }
  set size(t) {
    t !== this.size && (this.__fixInvalidItemPositioningDebouncer && this.__fixInvalidItemPositioningDebouncer.cancel(), this._debouncers && this._debouncers._increasePoolIfNeeded && this._debouncers._increasePoolIfNeeded.cancel(), this.__size = t, this._physicalItems ? this._virtualCount = this.items.length : (this._itemsChanged({
      path: "items"
    }), this.__preventElementUpdates = !0, st(), this.__preventElementUpdates = !1), this._isVisible || this._assignModels(), this.elementsContainer.children.length || requestAnimationFrame(() => this._resizeHandler()), this._resizeHandler(), st());
  }
  /** @private */
  get _scrollTop() {
    return this.scrollTarget.scrollTop;
  }
  /** @private */
  set _scrollTop(t) {
    this.scrollTarget.scrollTop = t;
  }
  /** @private */
  get items() {
    return {
      length: Math.min(this.size, Yh)
    };
  }
  /** @private */
  get offsetHeight() {
    return this.scrollTarget.offsetHeight;
  }
  /** @private */
  get $() {
    return {
      items: this.scrollContainer
    };
  }
  /** @private */
  updateViewportBoundaries() {
    const t = window.getComputedStyle(this.scrollTarget);
    this._scrollerPaddingTop = this.scrollTarget === this ? 0 : parseInt(t["padding-top"], 10), this._isRTL = t.direction === "rtl", this._viewportWidth = this.elementsContainer.offsetWidth, this._viewportHeight = this.scrollTarget.offsetHeight, this._scrollPageHeight = this._viewportHeight - this._scrollLineHeight, this.grid && this._updateGridMetrics();
  }
  /** @private */
  setAttribute() {
  }
  /** @private */
  _createPool(t) {
    const e = this.createElements(t), i = document.createDocumentFragment();
    return e.forEach((r) => {
      r.style.position = "absolute", i.appendChild(r), this.__resizeObserver.observe(r);
    }), this.elementsContainer.appendChild(i), e;
  }
  /** @private */
  _assignModels(t) {
    const e = [];
    this._iterateItems((i, r) => {
      const s = this._physicalItems[i];
      s.hidden = r >= this.size, s.hidden ? delete s.__lastUpdatedIndex : (s.__virtualIndex = r + (this._vidxOffset || 0), this.__updateElement(s, s.__virtualIndex), e.push(s));
    }, t), this.__afterElementsUpdated(e);
  }
  /** @private */
  _isClientFull() {
    return setTimeout(() => {
      this.__clientFull = !0;
    }), this.__clientFull || super._isClientFull();
  }
  /** @private */
  translate3d(t, e, i, r) {
    r.style.transform = `translateY(${e})`;
  }
  /** @private */
  toggleScrollListener() {
  }
  _scrollHandler() {
    if (this.scrollTarget.offsetHeight === 0)
      return;
    this._adjustVirtualIndexOffset(this._scrollTop - (this.__previousScrollTop || 0));
    const t = this.scrollTarget.scrollTop - this._scrollPosition;
    if (super._scrollHandler(), this._physicalCount !== 0) {
      const e = t >= 0, i = this._getReusables(!e);
      i.indexes.length && (this._physicalTop = i.physicalTop, e ? (this._virtualStart -= i.indexes.length, this._physicalStart -= i.indexes.length) : (this._virtualStart += i.indexes.length, this._physicalStart += i.indexes.length), this._resizeHandler());
    }
    t && (this.__fixInvalidItemPositioningDebouncer = w.debounce(
      this.__fixInvalidItemPositioningDebouncer,
      L.after(this.timeouts.FIX_INVALID_ITEM_POSITIONING),
      () => this.__fixInvalidItemPositioning()
    )), this.reorderElements && (this.__scrollReorderDebouncer = w.debounce(
      this.__scrollReorderDebouncer,
      L.after(this.timeouts.SCROLL_REORDER),
      () => this.__reorderElements()
    )), this.__previousScrollTop = this._scrollTop, this._scrollTop === 0 && this.firstVisibleIndex !== 0 && Math.abs(t) > 0 && this.scrollToIndex(0);
  }
  /**
   * Work around an iron-list issue with invalid item positioning.
   * See https://github.com/vaadin/flow-components/issues/4306
   * @private
   */
  __fixInvalidItemPositioning() {
    if (!this.scrollTarget.isConnected)
      return;
    const t = this._physicalTop > this._scrollTop, e = this._physicalBottom < this._scrollBottom, i = this.adjustedFirstVisibleIndex === 0, r = this.adjustedLastVisibleIndex === this.size - 1;
    if (t && !i || e && !r) {
      const s = e, n = this._ratio;
      this._ratio = 0, this._scrollPosition = this._scrollTop + (s ? -1 : 1), this._scrollHandler(), this._ratio = n;
    }
  }
  /** @private */
  __onWheel(t) {
    if (t.ctrlKey || this._hasScrolledAncestor(t.target, t.deltaX, t.deltaY))
      return;
    let e = t.deltaY;
    if (t.deltaMode === WheelEvent.DOM_DELTA_LINE ? e *= this._scrollLineHeight : t.deltaMode === WheelEvent.DOM_DELTA_PAGE && (e *= this._scrollPageHeight), this._deltaYAcc || (this._deltaYAcc = 0), this._wheelAnimationFrame) {
      this._deltaYAcc += e, t.preventDefault();
      return;
    }
    e += this._deltaYAcc, this._deltaYAcc = 0, this._wheelAnimationFrame = !0, this.__debouncerWheelAnimationFrame = w.debounce(
      this.__debouncerWheelAnimationFrame,
      le,
      () => {
        this._wheelAnimationFrame = !1;
      }
    );
    const i = Math.abs(t.deltaX) + Math.abs(e);
    this._canScroll(this.scrollTarget, t.deltaX, e) ? (t.preventDefault(), this.scrollTarget.scrollTop += e, this.scrollTarget.scrollLeft += t.deltaX, this._hasResidualMomentum = !0, this._ignoreNewWheel = !0, this._debouncerIgnoreNewWheel = w.debounce(
      this._debouncerIgnoreNewWheel,
      L.after(this.timeouts.IGNORE_WHEEL),
      () => {
        this._ignoreNewWheel = !1;
      }
    )) : this._hasResidualMomentum && i <= this._previousMomentum || this._ignoreNewWheel ? t.preventDefault() : i > this._previousMomentum && (this._hasResidualMomentum = !1), this._previousMomentum = i;
  }
  /**
   * Determines if the element has an ancestor that handles the scroll delta prior to this
   *
   * @private
   */
  _hasScrolledAncestor(t, e, i) {
    if (t === this.scrollTarget || t === this.scrollTarget.getRootNode().host)
      return !1;
    if (this._canScroll(t, e, i) && ["auto", "scroll"].indexOf(getComputedStyle(t).overflow) !== -1)
      return !0;
    if (t !== this && t.parentElement)
      return this._hasScrolledAncestor(t.parentElement, e, i);
  }
  _canScroll(t, e, i) {
    return i > 0 && t.scrollTop < t.scrollHeight - t.offsetHeight || i < 0 && t.scrollTop > 0 || e > 0 && t.scrollLeft < t.scrollWidth - t.offsetWidth || e < 0 && t.scrollLeft > 0;
  }
  /**
   * Increases the pool size.
   * @override
   */
  _increasePoolIfNeeded(t) {
    if (this._physicalCount > 2 && t) {
      const i = Math.ceil(this._optPhysicalSize / this._physicalAverage) - this._physicalCount;
      super._increasePoolIfNeeded(Math.max(t, Math.min(100, i)));
    } else
      super._increasePoolIfNeeded(t);
  }
  /**
   * @returns {Number|undefined} - The browser's default font-size in pixels
   * @private
   */
  _getScrollLineHeight() {
    const t = document.createElement("div");
    t.style.fontSize = "initial", t.style.display = "none", document.body.appendChild(t);
    const e = window.getComputedStyle(t).fontSize;
    return document.body.removeChild(t), e ? window.parseInt(e) : void 0;
  }
  __getVisibleElements() {
    return Array.from(this.elementsContainer.children).filter((t) => !t.hidden);
  }
  /** @private */
  __reorderElements() {
    if (this.__mouseDown) {
      this.__pendingReorder = !0;
      return;
    }
    this.__pendingReorder = !1;
    const t = this._virtualStart + (this._vidxOffset || 0), e = this.__getVisibleElements(), r = e.find(
      (a) => a.contains(this.elementsContainer.getRootNode().activeElement) || a.contains(this.scrollTarget.getRootNode().activeElement)
    ) || e[0];
    if (!r)
      return;
    const s = r.__virtualIndex - t, n = e.indexOf(r) - s;
    if (n > 0)
      for (let a = 0; a < n; a++)
        this.elementsContainer.appendChild(e[a]);
    else if (n < 0)
      for (let a = e.length + n; a < e.length; a++)
        this.elementsContainer.insertBefore(e[a], e[0]);
    if (Dn) {
      const { transform: a } = this.scrollTarget.style;
      this.scrollTarget.style.transform = "translateZ(0)", setTimeout(() => {
        this.scrollTarget.style.transform = a;
      });
    }
  }
  /** @private */
  _adjustVirtualIndexOffset(t) {
    if (this._virtualCount >= this.size)
      this._vidxOffset = 0;
    else if (this.__skipNextVirtualIndexAdjust)
      this.__skipNextVirtualIndexAdjust = !1;
    else if (Math.abs(t) > 1e4) {
      const e = this._scrollTop / (this.scrollTarget.scrollHeight - this.scrollTarget.offsetHeight), i = e * this.size;
      this._vidxOffset = Math.round(i - e * this._virtualCount);
    } else {
      const e = this._vidxOffset, i = Vi, r = 100;
      this._scrollTop === 0 ? (this._vidxOffset = 0, e !== this._vidxOffset && super.scrollToIndex(0)) : this.firstVisibleIndex < i && this._vidxOffset > 0 && (this._vidxOffset -= Math.min(this._vidxOffset, r), super.scrollToIndex(this.firstVisibleIndex + (e - this._vidxOffset)));
      const s = this.size - this._virtualCount;
      this._scrollTop >= this._maxScrollTop && this._maxScrollTop > 0 ? (this._vidxOffset = s, e !== this._vidxOffset && super.scrollToIndex(this._virtualCount - 1)) : this.firstVisibleIndex > this._virtualCount - i && this._vidxOffset < s && (this._vidxOffset += Math.min(s - this._vidxOffset, r), super.scrollToIndex(this.firstVisibleIndex - (this._vidxOffset - e)));
    }
  }
}
Object.setPrototypeOf(ma.prototype, jh);
class ga {
  /**
   * @typedef {Object} VirtualizerConfig
   * @property {Function} createElements Function that returns the given number of new elements
   * @property {Function} updateElement Function that updates the element at a specific index
   * @property {HTMLElement} scrollTarget Reference to the scrolling element
   * @property {HTMLElement} scrollContainer Reference to a wrapper for the item elements (or a slot) inside the scrollTarget
   * @property {HTMLElement | undefined} elementsContainer Reference to the container in which the item elements are placed, defaults to scrollContainer
   * @property {boolean | undefined} reorderElements Determines whether the physical item elements should be kept in order in the DOM
   * @param {VirtualizerConfig} config Configuration for the virtualizer
   */
  constructor(t) {
    this.__adapter = new ma(t);
  }
  /**
   * Gets the index of the first visible item in the viewport.
   *
   * @return {number}
   */
  get firstVisibleIndex() {
    return this.__adapter.adjustedFirstVisibleIndex;
  }
  /**
   * Gets the index of the last visible item in the viewport.
   *
   * @return {number}
   */
  get lastVisibleIndex() {
    return this.__adapter.adjustedLastVisibleIndex;
  }
  /**
   * The size of the virtualizer
   * @return {number | undefined} The size of the virtualizer
   */
  get size() {
    return this.__adapter.size;
  }
  /**
   * The size of the virtualizer
   * @param {number} size The size of the virtualizer
   */
  set size(t) {
    this.__adapter.size = t;
  }
  /**
   * Scroll to a specific index in the virtual list
   *
   * @method scrollToIndex
   * @param {number} index The index of the item
   */
  scrollToIndex(t) {
    this.__adapter.scrollToIndex(t);
  }
  /**
   * Requests the virtualizer to re-render the item elements on an index range, if currently in the DOM
   *
   * @method update
   * @param {number | undefined} startIndex The start index of the range
   * @param {number | undefined} endIndex The end index of the range
   */
  update(t = 0, e = this.size - 1) {
    this.__adapter.update(t, e);
  }
  /**
   * Flushes active asynchronous tasks so that the component and the DOM end up in a stable state
   *
   * @method update
   * @param {number | undefined} startIndex The start index of the range
   * @param {number | undefined} endIndex The end index of the range
   */
  flush() {
    this.__adapter.flush();
  }
}
/**
 * @license
 * Copyright (c) 2015 - 2023 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
const He = class {
  toString() {
    return "";
  }
};
/**
 * @license
 * Copyright (c) 2015 - 2023 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
const ba = (o) => class extends o {
  static get properties() {
    return {
      /**
       * A full set of items to filter the visible options from.
       * Set to an empty array when combo-box is not opened.
       */
      items: {
        type: Array,
        observer: "__itemsChanged"
      },
      /**
       * Index of an item that has focus outline and is scrolled into view.
       * The actual focus still remains in the input field.
       */
      focusedIndex: {
        type: Number,
        observer: "__focusedIndexChanged"
      },
      /**
       * Set to true while combo-box fetches new page from the data provider.
       */
      loading: {
        type: Boolean,
        observer: "__loadingChanged"
      },
      /**
       * Whether the combo-box is currently opened or not. If set to false,
       * calling `scrollIntoView` does not have any effect.
       */
      opened: {
        type: Boolean,
        observer: "__openedChanged"
      },
      /**
       * The selected item from the `items` array.
       */
      selectedItem: {
        type: Object,
        observer: "__selectedItemChanged"
      },
      /**
       * Path for the id of the item, used to detect whether the item is selected.
       */
      itemIdPath: {
        type: String
      },
      /**
       * Reference to the owner (combo-box owner), used by the item elements.
       */
      owner: {
        type: Object
      },
      /**
       * Function used to set a label for every combo-box item.
       */
      getItemLabel: {
        type: Object
      },
      /**
       * Function used to render the content of every combo-box item.
       */
      renderer: {
        type: Object,
        observer: "__rendererChanged"
      },
      /**
       * Used to propagate the `theme` attribute from the host element.
       */
      theme: {
        type: String
      }
    };
  }
  constructor() {
    super(), this.__boundOnItemClick = this.__onItemClick.bind(this);
  }
  /** @private */
  get _viewportTotalPaddingBottom() {
    if (this._cachedViewportTotalPaddingBottom === void 0) {
      const e = window.getComputedStyle(this.$.selector);
      this._cachedViewportTotalPaddingBottom = [e.paddingBottom, e.borderBottomWidth].map((i) => parseInt(i, 10)).reduce((i, r) => i + r);
    }
    return this._cachedViewportTotalPaddingBottom;
  }
  /** @protected */
  ready() {
    super.ready(), this.setAttribute("role", "listbox"), this.id = `${this.localName}-${Fr()}`, this.__hostTagName = this.constructor.is.replace("-scroller", ""), this.addEventListener("click", (e) => e.stopPropagation()), this.__patchWheelOverScrolling(), this.__virtualizer = new ga({
      createElements: this.__createElements.bind(this),
      updateElement: this._updateElement.bind(this),
      elementsContainer: this,
      scrollTarget: this,
      scrollContainer: this.$.selector
    });
  }
  /**
   * Requests an update for the virtualizer to re-render items.
   */
  requestContentUpdate() {
    this.__virtualizer && this.__virtualizer.update();
  }
  /**
   * Scrolls an item at given index into view and adjusts `scrollTop`
   * so that the element gets fully visible on Arrow Down key press.
   * @param {number} index
   */
  scrollIntoView(e) {
    if (!(this.opened && e >= 0))
      return;
    const i = this._visibleItemsCount();
    let r = e;
    e > this.__virtualizer.lastVisibleIndex - 1 ? (this.__virtualizer.scrollToIndex(e), r = e - i + 1) : e > this.__virtualizer.firstVisibleIndex && (r = this.__virtualizer.firstVisibleIndex), this.__virtualizer.scrollToIndex(Math.max(0, r));
    const s = [...this.children].find(
      (d) => !d.hidden && d.index === this.__virtualizer.lastVisibleIndex
    );
    if (!s || e !== s.index)
      return;
    const n = s.getBoundingClientRect(), a = this.getBoundingClientRect(), l = n.bottom - a.bottom + this._viewportTotalPaddingBottom;
    l > 0 && (this.scrollTop += l);
  }
  /**
   * @param {string | object} item
   * @param {string | object} selectedItem
   * @param {string} itemIdPath
   * @protected
   */
  _isItemSelected(e, i, r) {
    return e instanceof He ? !1 : r && e !== void 0 && i !== void 0 ? this.get(r, e) === this.get(r, i) : e === i;
  }
  /** @private */
  __itemsChanged(e) {
    this.__virtualizer && e && (this.__virtualizer.size = e.length, this.__virtualizer.flush(), this.requestContentUpdate());
  }
  /** @private */
  __loadingChanged() {
    this.requestContentUpdate();
  }
  /** @private */
  __openedChanged(e) {
    e && this.requestContentUpdate();
  }
  /** @private */
  __selectedItemChanged() {
    this.requestContentUpdate();
  }
  /** @private */
  __focusedIndexChanged(e, i) {
    e !== i && this.requestContentUpdate(), e >= 0 && !this.loading && this.scrollIntoView(e);
  }
  /** @private */
  __rendererChanged(e, i) {
    (e || i) && this.requestContentUpdate();
  }
  /** @private */
  __createElements(e) {
    return [...Array(e)].map(() => {
      const i = document.createElement(`${this.__hostTagName}-item`);
      return i.addEventListener("click", this.__boundOnItemClick), i.tabIndex = "-1", i.style.width = "100%", i;
    });
  }
  /**
   * @param {HTMLElement} el
   * @param {number} index
   * @protected
   */
  _updateElement(e, i) {
    const r = this.items[i], s = this.focusedIndex, n = this._isItemSelected(r, this.selectedItem, this.itemIdPath);
    e.setProperties({
      item: r,
      index: i,
      label: this.getItemLabel(r),
      selected: n,
      renderer: this.renderer,
      focused: !this.loading && s === i
    }), e.id = `${this.__hostTagName}-item-${i}`, e.setAttribute("role", i !== void 0 ? "option" : !1), e.setAttribute("aria-selected", n.toString()), e.setAttribute("aria-posinset", i + 1), e.setAttribute("aria-setsize", this.items.length), this.theme ? e.setAttribute("theme", this.theme) : e.removeAttribute("theme"), r instanceof He && this.__requestItemByIndex(i);
  }
  /** @private */
  __onItemClick(e) {
    this.dispatchEvent(new CustomEvent("selection-changed", { detail: { item: e.currentTarget.item } }));
  }
  /**
   * We want to prevent the kinetic scrolling energy from being transferred from the overlay contents over to the parent.
   * Further improvement ideas: after the contents have been scrolled to the top or bottom and scrolling has stopped, it could allow
   * scrolling the parent similarly to touch scrolling.
   * @private
   */
  __patchWheelOverScrolling() {
    this.$.selector.addEventListener("wheel", (e) => {
      const i = this.scrollTop === 0, r = this.scrollHeight - this.scrollTop - this.clientHeight <= 1;
      (i && e.deltaY < 0 || r && e.deltaY > 0) && e.preventDefault();
    });
  }
  /**
   * Dispatches an `index-requested` event for the given index to notify
   * the data provider that it should start loading the page containing the requested index.
   *
   * The event is dispatched asynchronously to prevent an immediate page request and therefore
   * a possible infinite recursion in case the data provider implements page request cancelation logic
   * by invoking data provider page callbacks with an empty array.
   * The infinite recursion may occur otherwise since invoking a data provider page callback with an empty array
   * triggers a synchronous scroller update and, if the callback corresponds to the currently visible page,
   * the scroller will synchronously request the page again which may lead to looping in the end.
   * That was the case for the Flow counterpart:
   * https://github.com/vaadin/flow-components/issues/3553#issuecomment-1239344828
   * @private
   */
  __requestItemByIndex(e) {
    requestAnimationFrame(() => {
      this.dispatchEvent(
        new CustomEvent("index-requested", {
          detail: {
            index: e,
            currentScrollerPos: this._oldScrollerPosition
          }
        })
      );
    });
  }
  /** @private */
  _visibleItemsCount() {
    return this.__virtualizer.scrollToIndex(this.__virtualizer.firstVisibleIndex), this.__virtualizer.size > 0 ? this.__virtualizer.lastVisibleIndex - this.__virtualizer.firstVisibleIndex + 1 : 0;
  }
};
/**
 * @license
 * Copyright (c) 2018 - 2023 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
class ss extends ba(A) {
  static get is() {
    return "vaadin-time-picker-scroller";
  }
  static get template() {
    return k`
      <style>
        :host {
          display: block;
          min-height: 1px;
          overflow: auto;

          /* Fixes item background from getting on top of scrollbars on Safari */
          transform: translate3d(0, 0, 0);

          /* Enable momentum scrolling on iOS */
          -webkit-overflow-scrolling: touch;

          /* Fixes scrollbar disappearing when 'Show scroll bars: Always' enabled in Safari */
          box-shadow: 0 0 0 white;
        }

        #selector {
          border-width: var(--_vaadin-time-picker-items-container-border-width);
          border-style: var(--_vaadin-time-picker-items-container-border-style);
          border-color: var(--_vaadin-time-picker-items-container-border-color, transparent);
          position: relative;
        }
      </style>
      <div id="selector">
        <slot></slot>
      </div>
    `;
  }
}
customElements.define(ss.is, ss);
/**
 * @license
 * Copyright (c) 2015 - 2023 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
const va = (o) => class extends Zn(o) {
  static get observers() {
    return ["_setOverlayWidth(positionTarget, opened)"];
  }
  constructor() {
    super(), this.requiredVerticalSpace = 200;
  }
  /** @protected */
  connectedCallback() {
    super.connectedCallback();
    const e = this._comboBox, i = e && e.getAttribute("dir");
    i && this.setAttribute("dir", i);
  }
  /**
   * Override method inherited from `Overlay`
   * to not close on position target click.
   *
   * @param {Event} event
   * @return {boolean}
   * @protected
   */
  _shouldCloseOnOutsideClick(e) {
    const i = e.composedPath();
    return !i.includes(this.positionTarget) && !i.includes(this);
  }
  /** @private */
  _setOverlayWidth(e, i) {
    if (e && i) {
      const r = this.localName;
      this.style.setProperty(`--_${r}-default-width`, `${e.clientWidth}px`);
      const s = getComputedStyle(this._comboBox).getPropertyValue(`--${r}-width`);
      s === "" ? this.style.removeProperty(`--${r}-width`) : this.style.setProperty(`--${r}-width`, s), this._updatePosition();
    }
  }
};
/**
 * @license
 * Copyright (c) 2018 - 2023 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
m(
  "vaadin-time-picker-overlay",
  _`
    #overlay {
      width: var(--vaadin-time-picker-overlay-width, var(--_vaadin-time-picker-overlay-default-width, auto));
    }

    [part='content'] {
      display: flex;
      flex-direction: column;
      height: 100%;
    }
  `,
  { moduleId: "vaadin-time-picker-overlay-styles" }
);
let Bt;
class ns extends va(U) {
  static get is() {
    return "vaadin-time-picker-overlay";
  }
  static get template() {
    return Bt || (Bt = super.template.cloneNode(!0), Bt.content.querySelector('[part~="overlay"]').removeAttribute("tabindex")), Bt;
  }
}
customElements.define(ns.is, ns);
/**
 * @license
 * Copyright (c) 2015 - 2023 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
function as(o) {
  return o != null;
}
function ls(o, t) {
  return o.findIndex((e) => e instanceof He ? !1 : t(e));
}
const ya = (o) => class extends ha(
  ie(Et(_i(kt(o))))
) {
  static get properties() {
    return {
      /**
       * True if the dropdown is open, false otherwise.
       * @type {boolean}
       */
      opened: {
        type: Boolean,
        notify: !0,
        value: !1,
        reflectToAttribute: !0,
        observer: "_openedChanged"
      },
      /**
       * Set true to prevent the overlay from opening automatically.
       * @attr {boolean} auto-open-disabled
       */
      autoOpenDisabled: {
        type: Boolean
      },
      /**
       * When present, it specifies that the field is read-only.
       * @type {boolean}
       */
      readonly: {
        type: Boolean,
        value: !1,
        reflectToAttribute: !0
      },
      /**
       * Custom function for rendering the content of every item.
       * Receives three arguments:
       *
       * - `root` The `<vaadin-combo-box-item>` internal container DOM element.
       * - `comboBox` The reference to the `<vaadin-combo-box>` element.
       * - `model` The object with the properties related with the rendered
       *   item, contains:
       *   - `model.index` The index of the rendered item.
       *   - `model.item` The item.
       * @type {ComboBoxRenderer | undefined}
       */
      renderer: Function,
      /**
       * A full set of items to filter the visible options from.
       * The items can be of either `String` or `Object` type.
       * @type {!Array<!ComboBoxItem | string> | undefined}
       */
      items: {
        type: Array,
        observer: "_itemsChanged"
      },
      /**
       * If `true`, the user can input a value that is not present in the items list.
       * `value` property will be set to the input value in this case.
       * Also, when `value` is set programmatically, the input value will be set
       * to reflect that value.
       * @attr {boolean} allow-custom-value
       * @type {boolean}
       */
      allowCustomValue: {
        type: Boolean,
        value: !1
      },
      /**
       * A subset of items, filtered based on the user input. Filtered items
       * can be assigned directly to omit the internal filtering functionality.
       * The items can be of either `String` or `Object` type.
       * @type {!Array<!ComboBoxItem | string> | undefined}
       */
      filteredItems: {
        type: Array,
        observer: "_filteredItemsChanged"
      },
      /**
       * Used to detect user value changes and fire `change` events.
       * @private
       */
      _lastCommittedValue: String,
      /**
       * When set to `true`, "loading" attribute is added to host and the overlay element.
       * @type {boolean}
       */
      loading: {
        type: Boolean,
        value: !1,
        reflectToAttribute: !0
      },
      /**
       * @type {number}
       * @protected
       */
      _focusedIndex: {
        type: Number,
        observer: "_focusedIndexChanged",
        value: -1
      },
      /**
       * Filtering string the user has typed into the input field.
       * @type {string}
       */
      filter: {
        type: String,
        value: "",
        notify: !0
      },
      /**
       * The selected item from the `items` array.
       * @type {ComboBoxItem | string | undefined}
       */
      selectedItem: {
        type: Object,
        notify: !0
      },
      /**
       * Path for label of the item. If `items` is an array of objects, the
       * `itemLabelPath` is used to fetch the displayed string label for each
       * item.
       *
       * The item label is also used for matching items when processing user
       * input, i.e., for filtering and selecting items.
       * @attr {string} item-label-path
       * @type {string}
       */
      itemLabelPath: {
        type: String,
        value: "label",
        observer: "_itemLabelPathChanged"
      },
      /**
       * Path for the value of the item. If `items` is an array of objects, the
       * `itemValuePath:` is used to fetch the string value for the selected
       * item.
       *
       * The item value is used in the `value` property of the combo box,
       * to provide the form value.
       * @attr {string} item-value-path
       * @type {string}
       */
      itemValuePath: {
        type: String,
        value: "value"
      },
      /**
       * Path for the id of the item. If `items` is an array of objects,
       * the `itemIdPath` is used to compare and identify the same item
       * in `selectedItem` and `filteredItems` (items given by the
       * `dataProvider` callback).
       * @attr {string} item-id-path
       */
      itemIdPath: String,
      /**
       * @type {!HTMLElement | undefined}
       * @protected
       */
      _toggleElement: {
        type: Object,
        observer: "_toggleElementChanged"
      },
      /** @private */
      _closeOnBlurIsPrevented: Boolean,
      /** @private */
      _scroller: Object,
      /** @private */
      _overlayOpened: {
        type: Boolean,
        observer: "_overlayOpenedChanged"
      }
    };
  }
  static get observers() {
    return [
      "_selectedItemChanged(selectedItem, itemValuePath, itemLabelPath)",
      "_openedOrItemsChanged(opened, filteredItems, loading)",
      "_updateScroller(_scroller, filteredItems, opened, loading, selectedItem, itemIdPath, _focusedIndex, renderer, theme)"
    ];
  }
  constructor() {
    super(), this._boundOnFocusout = this._onFocusout.bind(this), this._boundOverlaySelectedItemChanged = this._overlaySelectedItemChanged.bind(this), this._boundOnClearButtonMouseDown = this.__onClearButtonMouseDown.bind(this), this._boundOnClick = this._onClick.bind(this), this._boundOnOverlayTouchAction = this._onOverlayTouchAction.bind(this), this._boundOnTouchend = this._onTouchend.bind(this);
  }
  /**
   * Tag name prefix used by scroller and items.
   * @protected
   * @return {string}
   */
  get _tagNamePrefix() {
    return "vaadin-combo-box";
  }
  /**
   * Get a reference to the native `<input>` element.
   * Override to provide a custom input.
   * @protected
   * @return {HTMLInputElement | undefined}
   */
  get _nativeInput() {
    return this.inputElement;
  }
  /**
   * Override method inherited from `InputMixin`
   * to customize the input element.
   * @protected
   * @override
   */
  _inputElementChanged(e) {
    super._inputElementChanged(e);
    const i = this._nativeInput;
    i && (i.autocomplete = "off", i.autocapitalize = "off", i.setAttribute("role", "combobox"), i.setAttribute("aria-autocomplete", "list"), i.setAttribute("aria-expanded", !!this.opened), i.setAttribute("spellcheck", "false"), i.setAttribute("autocorrect", "off"), this._revertInputValueToValue(), this.clearElement && this.clearElement.addEventListener("mousedown", this._boundOnClearButtonMouseDown));
  }
  /** @protected */
  ready() {
    super.ready(), this._initOverlay(), this._initScroller(), this.addEventListener("focusout", this._boundOnFocusout), this._lastCommittedValue = this.value, this.addEventListener("click", this._boundOnClick), this.addEventListener("touchend", this._boundOnTouchend);
    const e = () => {
      requestAnimationFrame(() => {
        this._overlayElement.bringToFront();
      });
    };
    this.addEventListener("mousedown", e), this.addEventListener("touchstart", e), li(this), this.addController(new ua(this));
  }
  /** @protected */
  disconnectedCallback() {
    super.disconnectedCallback(), this.close();
  }
  /**
   * Requests an update for the content of items.
   * While performing the update, it invokes the renderer (passed in the `renderer` property) once an item.
   *
   * It is not guaranteed that the update happens immediately (synchronously) after it is requested.
   */
  requestContentUpdate() {
    this._scroller && (this._scroller.requestContentUpdate(), this._getItemElements().forEach((e) => {
      e.requestContentUpdate();
    }));
  }
  /**
   * Opens the dropdown list.
   */
  open() {
    !this.disabled && !this.readonly && (this.opened = !0);
  }
  /**
   * Closes the dropdown list.
   */
  close() {
    this.opened = !1;
  }
  /**
   * Override Polymer lifecycle callback to handle `filter` property change after
   * the observer for `opened` property is triggered. This is needed when opening
   * combo-box on user input to ensure the focused index is set correctly.
   *
   * @param {!Object} currentProps Current accessor values
   * @param {?Object} changedProps Properties changed since the last call
   * @param {?Object} oldProps Previous values for each changed property
   * @protected
   * @override
   */
  _propertiesChanged(e, i, r) {
    super._propertiesChanged(e, i, r), i.filter !== void 0 && this._filterChanged(i.filter);
  }
  /** @private */
  _initOverlay() {
    const e = this.$.overlay;
    e._comboBox = this, e.addEventListener("touchend", this._boundOnOverlayTouchAction), e.addEventListener("touchmove", this._boundOnOverlayTouchAction), e.addEventListener("mousedown", (i) => i.preventDefault()), e.addEventListener("opened-changed", (i) => {
      this._overlayOpened = i.detail.value;
    }), this._overlayElement = e;
  }
  /**
   * Create and initialize the scroller element.
   * Override to provide custom host reference.
   *
   * @protected
   */
  _initScroller(e) {
    const i = `${this._tagNamePrefix}-scroller`, r = this._overlayElement;
    r.renderer = (n) => {
      n.firstChild || n.appendChild(document.createElement(i));
    }, r.requestContentUpdate();
    const s = r.querySelector(i);
    s.owner = e || this, s.getItemLabel = this._getItemLabel.bind(this), s.addEventListener("selection-changed", this._boundOverlaySelectedItemChanged), this._scroller = s;
  }
  /** @private */
  // eslint-disable-next-line max-params
  _updateScroller(e, i, r, s, n, a, l, d, c) {
    e && (r && (e.style.maxHeight = getComputedStyle(this).getPropertyValue(`--${this._tagNamePrefix}-overlay-max-height`) || "65vh"), e.setProperties({
      items: r ? i : [],
      opened: r,
      loading: s,
      selectedItem: n,
      itemIdPath: a,
      focusedIndex: l,
      renderer: d,
      theme: c
    }));
  }
  /** @private */
  _openedOrItemsChanged(e, i, r) {
    this._overlayOpened = !!(e && (r || i && i.length));
  }
  /** @private */
  _overlayOpenedChanged(e, i) {
    e ? (this.dispatchEvent(new CustomEvent("vaadin-combo-box-dropdown-opened", { bubbles: !0, composed: !0 })), this._onOpened()) : i && this.filteredItems && this.filteredItems.length && (this.close(), this.dispatchEvent(new CustomEvent("vaadin-combo-box-dropdown-closed", { bubbles: !0, composed: !0 })));
  }
  /** @private */
  _focusedIndexChanged(e, i) {
    i !== void 0 && this._updateActiveDescendant(e);
  }
  /** @protected */
  _isInputFocused() {
    return this.inputElement && zr(this.inputElement);
  }
  /** @private */
  _updateActiveDescendant(e) {
    const i = this._nativeInput;
    if (!i)
      return;
    const r = this._getItemElements().find((s) => s.index === e);
    r ? i.setAttribute("aria-activedescendant", r.id) : i.removeAttribute("aria-activedescendant");
  }
  /** @private */
  _openedChanged(e, i) {
    if (i === void 0)
      return;
    e ? (this._openedWithFocusRing = this.hasAttribute("focus-ring"), !this._isInputFocused() && !Jt && this.inputElement && this.inputElement.focus(), this._overlayElement.restoreFocusOnClose = !0) : (this._onClosed(), this._openedWithFocusRing && this._isInputFocused() && this.setAttribute("focus-ring", ""));
    const r = this._nativeInput;
    r && (r.setAttribute("aria-expanded", !!e), e ? r.setAttribute("aria-controls", this._scroller.id) : r.removeAttribute("aria-controls"));
  }
  /** @private */
  _onOverlayTouchAction() {
    this._closeOnBlurIsPrevented = !0, this.inputElement.blur(), this._closeOnBlurIsPrevented = !1;
  }
  /** @protected */
  _isClearButton(e) {
    return e.composedPath()[0] === this.clearElement;
  }
  /** @private */
  __onClearButtonMouseDown(e) {
    e.preventDefault(), this.inputElement.focus();
  }
  /**
   * @param {Event} event
   * @protected
   */
  _onClearButtonClick(e) {
    e.preventDefault(), this._onClearAction(), this.opened && this.requestContentUpdate();
  }
  /**
   * @param {Event} event
   * @private
   */
  _onToggleButtonClick(e) {
    e.preventDefault(), this.opened ? this.close() : this.open();
  }
  /**
   * @param {Event} event
   * @protected
   */
  _onHostClick(e) {
    this.autoOpenDisabled || (e.preventDefault(), this.open());
  }
  /** @private */
  _onClick(e) {
    this._isClearButton(e) ? this._onClearButtonClick(e) : e.composedPath().includes(this._toggleElement) ? this._onToggleButtonClick(e) : this._onHostClick(e);
  }
  /**
   * Override an event listener from `KeyboardMixin`.
   *
   * @param {KeyboardEvent} e
   * @protected
   * @override
   */
  _onKeyDown(e) {
    super._onKeyDown(e), e.key === "Tab" ? this._overlayElement.restoreFocusOnClose = !1 : e.key === "ArrowDown" ? (this._onArrowDown(), e.preventDefault()) : e.key === "ArrowUp" && (this._onArrowUp(), e.preventDefault());
  }
  /** @private */
  _getItemLabel(e) {
    let i = e && this.itemLabelPath ? this.get(this.itemLabelPath, e) : void 0;
    return i == null && (i = e ? e.toString() : ""), i;
  }
  /** @private */
  _getItemValue(e) {
    let i = e && this.itemValuePath ? this.get(this.itemValuePath, e) : void 0;
    return i === void 0 && (i = e ? e.toString() : ""), i;
  }
  /** @private */
  _onArrowDown() {
    if (this.opened) {
      const e = this.filteredItems;
      e && (this._focusedIndex = Math.min(e.length - 1, this._focusedIndex + 1), this._prefillFocusedItemLabel());
    } else
      this.open();
  }
  /** @private */
  _onArrowUp() {
    if (this.opened) {
      if (this._focusedIndex > -1)
        this._focusedIndex = Math.max(0, this._focusedIndex - 1);
      else {
        const e = this.filteredItems;
        e && (this._focusedIndex = e.length - 1);
      }
      this._prefillFocusedItemLabel();
    } else
      this.open();
  }
  /** @private */
  _prefillFocusedItemLabel() {
    if (this._focusedIndex > -1) {
      const e = this.filteredItems[this._focusedIndex];
      this._inputElementValue = this._getItemLabel(e), this._markAllSelectionRange();
    }
  }
  /** @private */
  _setSelectionRange(e, i) {
    this._isInputFocused() && this.inputElement.setSelectionRange && this.inputElement.setSelectionRange(e, i);
  }
  /** @private */
  _markAllSelectionRange() {
    this._inputElementValue !== void 0 && this._setSelectionRange(0, this._inputElementValue.length);
  }
  /** @private */
  _clearSelectionRange() {
    if (this._inputElementValue !== void 0) {
      const e = this._inputElementValue ? this._inputElementValue.length : 0;
      this._setSelectionRange(e, e);
    }
  }
  /** @private */
  _closeOrCommit() {
    !this.opened && !this.loading ? this._commitValue() : this.close();
  }
  /**
   * Override an event listener from `KeyboardMixin`.
   *
   * @param {KeyboardEvent} e
   * @protected
   * @override
   */
  _onEnter(e) {
    const i = this._focusedIndex < 0 && this._inputElementValue !== "" && this._getItemLabel(this.selectedItem) !== this._inputElementValue;
    if (!this.allowCustomValue && i) {
      e.preventDefault(), e.stopPropagation();
      return;
    }
    this.opened && (e.preventDefault(), e.stopPropagation()), this._closeOrCommit();
  }
  /**
   * Override an event listener from `KeyboardMixin`.
   * Do not call `super` in order to override clear
   * button logic defined in `InputControlMixin`.
   *
   * @param {!KeyboardEvent} e
   * @protected
   * @override
   */
  _onEscape(e) {
    this.autoOpenDisabled ? this.opened || this.value !== this._inputElementValue && this._inputElementValue.length > 0 ? (e.stopPropagation(), this._focusedIndex = -1, this.cancel()) : this.clearButtonVisible && !this.opened && this.value && (e.stopPropagation(), this._onClearAction()) : this.opened ? (e.stopPropagation(), this._focusedIndex > -1 ? (this._focusedIndex = -1, this._revertInputValue()) : this.cancel()) : this.clearButtonVisible && this.value && (e.stopPropagation(), this._onClearAction());
  }
  /** @private */
  _toggleElementChanged(e) {
    e && (e.addEventListener("mousedown", (i) => i.preventDefault()), e.addEventListener("click", () => {
      Jt && !this._isInputFocused() && document.activeElement.blur();
    }));
  }
  /**
   * Clears the current value.
   * @protected
   */
  _onClearAction() {
    this.selectedItem = null, this.allowCustomValue && (this.value = ""), this._detectAndDispatchChange();
  }
  /**
   * Reverts back to original value.
   */
  cancel() {
    this._revertInputValueToValue(), this._lastCommittedValue = this.value, this._closeOrCommit();
  }
  /** @private */
  _onOpened() {
    requestAnimationFrame(() => {
      this._scrollIntoView(this._focusedIndex), this._updateActiveDescendant(this._focusedIndex);
    }), this._lastCommittedValue = this.value;
  }
  /** @private */
  _onClosed() {
    (!this.loading || this.allowCustomValue) && this._commitValue();
  }
  /** @private */
  _commitValue() {
    if (this._focusedIndex > -1) {
      const e = this.filteredItems[this._focusedIndex];
      this.selectedItem !== e && (this.selectedItem = e), this._inputElementValue = this._getItemLabel(this.selectedItem);
    } else if (this._inputElementValue === "" || this._inputElementValue === void 0)
      this.selectedItem = null, this.allowCustomValue && (this.value = "");
    else {
      const e = [...this.filteredItems || [], this.selectedItem], i = e[this.__getItemIndexByLabel(e, this._inputElementValue)];
      if (this.allowCustomValue && // To prevent a repetitive input value being saved after pressing ESC and Tab.
      !i) {
        const r = this._inputElementValue;
        this._lastCustomValue = r;
        const s = new CustomEvent("custom-value-set", {
          detail: r,
          composed: !0,
          cancelable: !0,
          bubbles: !0
        });
        this.dispatchEvent(s), s.defaultPrevented || (this.value = r);
      } else
        !this.allowCustomValue && !this.opened && i ? this.value = this._getItemValue(i) : this._inputElementValue = this.selectedItem ? this._getItemLabel(this.selectedItem) : this.value || "";
    }
    this._detectAndDispatchChange(), this._clearSelectionRange(), this.filter = "";
  }
  /**
   * Override an event listener from `InputMixin`.
   * @param {!Event} event
   * @protected
   * @override
   */
  _onInput(e) {
    const i = this._inputElementValue, r = {};
    this.filter === i ? this._filterChanged(this.filter) : r.filter = i, !this.opened && !this._isClearButton(e) && !this.autoOpenDisabled && (r.opened = !0), this.setProperties(r);
  }
  /**
   * Override an event listener from `InputMixin`.
   * @param {!Event} event
   * @protected
   * @override
   */
  _onChange(e) {
    e.stopPropagation();
  }
  /** @private */
  _itemLabelPathChanged(e) {
  }
  /** @private */
  _filterChanged(e) {
    this._scrollIntoView(0), this._focusedIndex = -1, this.items ? this.filteredItems = this._filterItems(this.items, e) : this._filteredItemsChanged(this.filteredItems);
  }
  /** @protected */
  _revertInputValue() {
    this.filter !== "" ? this._inputElementValue = this.filter : this._revertInputValueToValue(), this._clearSelectionRange();
  }
  /** @private */
  _revertInputValueToValue() {
    this.allowCustomValue && !this.selectedItem ? this._inputElementValue = this.value : this._inputElementValue = this._getItemLabel(this.selectedItem);
  }
  /** @private */
  _selectedItemChanged(e) {
    if (e == null)
      this.filteredItems && (this.allowCustomValue || (this.value = ""), this._toggleHasValue(this._hasValue), this._inputElementValue = this.value);
    else {
      const i = this._getItemValue(e);
      if (this.value !== i && (this.value = i, this.value !== i))
        return;
      this._toggleHasValue(!0), this._inputElementValue = this._getItemLabel(e);
    }
    this.filteredItems && (this._focusedIndex = this.filteredItems.indexOf(e));
  }
  /**
   * Override an observer from `InputMixin`.
   * @protected
   * @override
   */
  _valueChanged(e, i) {
    e === "" && i === void 0 || (as(e) ? (this._getItemValue(this.selectedItem) !== e && this._selectItemForValue(e), !this.selectedItem && this.allowCustomValue && (this._inputElementValue = e), this._toggleHasValue(this._hasValue)) : this.selectedItem = null, this.filter = "", this._lastCommittedValue = void 0);
  }
  /** @private */
  _detectAndDispatchChange() {
    this.value !== this._lastCommittedValue && (this.dispatchEvent(new CustomEvent("change", { bubbles: !0 })), this._lastCommittedValue = this.value);
  }
  /** @private */
  _itemsChanged(e, i) {
    this._ensureItemsOrDataProvider(() => {
      this.items = i;
    }), e ? this.filteredItems = e.slice(0) : i && (this.filteredItems = null);
  }
  /** @private */
  _filteredItemsChanged(e, i) {
    const r = i ? i[this._focusedIndex] : null, s = this.__getItemIndexByValue(e, this.value);
    (this.selectedItem === null || this.selectedItem === void 0) && s >= 0 && (this.selectedItem = e[s]);
    const n = this.__getItemIndexByValue(e, this._getItemValue(r));
    n > -1 ? this._focusedIndex = n : this.__setInitialFocusedIndex();
  }
  /** @private */
  __setInitialFocusedIndex() {
    const e = this._inputElementValue;
    e === void 0 || e === this._getItemLabel(this.selectedItem) ? this._focusedIndex = this.__getItemIndexByLabel(this.filteredItems, this._getItemLabel(this.selectedItem)) : this._focusedIndex = this.__getItemIndexByLabel(this.filteredItems, this.filter);
  }
  /** @private */
  _filterItems(e, i) {
    return e && e.filter((s) => (i = i ? i.toString().toLowerCase() : "", this._getItemLabel(s).toString().toLowerCase().indexOf(i) > -1));
  }
  /** @private */
  _selectItemForValue(e) {
    const i = this.__getItemIndexByValue(this.filteredItems, e), r = this.selectedItem;
    i >= 0 ? this.selectedItem = this.filteredItems[i] : this.dataProvider && this.selectedItem === void 0 ? this.selectedItem = void 0 : this.selectedItem = null, this.selectedItem === null && r === null && this._selectedItemChanged(this.selectedItem);
  }
  /** @private */
  _getItemElements() {
    return Array.from(this._scroller.querySelectorAll(`${this._tagNamePrefix}-item`));
  }
  /** @private */
  _scrollIntoView(e) {
    this._scroller && this._scroller.scrollIntoView(e);
  }
  /**
   * Returns the first item that matches the provided value.
   *
   * @private
   */
  __getItemIndexByValue(e, i) {
    return !e || !as(i) ? -1 : ls(e, (r) => this._getItemValue(r) === i);
  }
  /**
   * Returns the first item that matches the provided label.
   * Labels are matched against each other case insensitively.
   *
   * @private
   */
  __getItemIndexByLabel(e, i) {
    return !e || !i ? -1 : ls(e, (r) => this._getItemLabel(r).toString().toLowerCase() === i.toString().toLowerCase());
  }
  /** @private */
  _overlaySelectedItemChanged(e) {
    e.stopPropagation(), !(e.detail.item instanceof He) && this.opened && (this._focusedIndex = this.filteredItems.indexOf(e.detail.item), this.close());
  }
  /** @private */
  _onFocusout(e) {
    if (!(e.relatedTarget && e.relatedTarget.localName === `${this._tagNamePrefix}-item`)) {
      if (e.relatedTarget === this._overlayElement) {
        e.composedPath()[0].focus();
        return;
      }
      if (!this.readonly && !this._closeOnBlurIsPrevented) {
        if (!this.opened && this.allowCustomValue && this._inputElementValue === this._lastCustomValue) {
          delete this._lastCustomValue;
          return;
        }
        this._closeOrCommit();
      }
    }
  }
  /** @private */
  _onTouchend(e) {
    !this.clearElement || e.composedPath()[0] !== this.clearElement || (e.preventDefault(), this._onClearAction());
  }
  /**
   * Fired when the value changes.
   *
   * @event value-changed
   * @param {Object} detail
   * @param {String} detail.value the combobox value
   */
  /**
   * Fired when selected item changes.
   *
   * @event selected-item-changed
   * @param {Object} detail
   * @param {Object|String} detail.value the selected item. Type is the same as the type of `items`.
   */
  /**
   * Fired when the user sets a custom value.
   * @event custom-value-set
   * @param {String} detail the custom value
   */
  /**
   * Fired when value changes.
   * To comply with https://developer.mozilla.org/en-US/docs/Web/Events/change
   * @event change
   */
  /**
   * Fired after the `vaadin-combo-box-overlay` opens.
   *
   * @event vaadin-combo-box-dropdown-opened
   */
  /**
   * Fired after the `vaadin-combo-box-overlay` closes.
   *
   * @event vaadin-combo-box-dropdown-closed
   */
};
/**
 * @license
 * Copyright (c) 2018 - 2023 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
class ds extends ya(O(A)) {
  static get is() {
    return "vaadin-time-picker-combo-box";
  }
  static get template() {
    return k`
      <style>
        :host([opened]) {
          pointer-events: auto;
        }
      </style>

      <slot></slot>

      <vaadin-time-picker-overlay
        id="overlay"
        opened="[[_overlayOpened]]"
        loading$="[[loading]]"
        theme$="[[_theme]]"
        position-target="[[positionTarget]]"
        no-vertical-overlap
        restore-focus-node="[[inputElement]]"
      ></vaadin-time-picker-overlay>
    `;
  }
  static get properties() {
    return {
      positionTarget: {
        type: Object
      }
    };
  }
  /**
   * Tag name prefix used by scroller and items.
   * @protected
   * @return {string}
   */
  get _tagNamePrefix() {
    return "vaadin-time-picker";
  }
  /**
   * Reference to the clear button element.
   * @protected
   * @return {!HTMLElement}
   */
  get clearElement() {
    return this.querySelector('[part="clear-button"]');
  }
  /**
   * @override
   * @protected
   */
  get _inputElementValue() {
    return super._inputElementValue;
  }
  /**
   * The setter is overridden to ensure the `_hasInputValue` property
   * doesn't wrongly indicate true after the input element's value
   * is reverted or cleared programmatically.
   *
   * @override
   * @protected
   */
  set _inputElementValue(t) {
    super._inputElementValue = t, this._hasInputValue = t.length > 0;
  }
  /** @protected */
  ready() {
    super.ready(), this.allowCustomValue = !0, this._toggleElement = this.querySelector(".toggle-button"), this.setAttribute("dir", "ltr");
  }
}
customElements.define(ds.is, ds);
/**
 * @license
 * Copyright (c) 2021 - 2023 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
const Ca = (o) => class extends Qr(o) {
  static get properties() {
    return {
      /**
       * A regular expression that the value is checked against.
       * The pattern must match the entire value, not just some subset.
       */
      pattern: {
        type: String
      }
    };
  }
  static get delegateAttrs() {
    return [...super.delegateAttrs, "pattern"];
  }
  static get constraints() {
    return [...super.constraints, "pattern"];
  }
};
/**
 * @license
 * Copyright (c) 2018 - 2023 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
const cs = "00:00:00.000", hs = "23:59:59.999";
m("vaadin-time-picker", Pt, { moduleId: "vaadin-time-picker-styles" });
class Ve extends Ca(fi(O(he(A)))) {
  static get is() {
    return "vaadin-time-picker";
  }
  static get template() {
    return k`
      <style>
        /* See https://github.com/vaadin/vaadin-time-picker/issues/145 */
        :host([dir='rtl']) [part='input-field'] {
          direction: ltr;
        }

        :host([dir='rtl']) [part='input-field'] ::slotted(input)::placeholder {
          direction: rtl;
          text-align: left;
        }

        [part~='toggle-button'] {
          cursor: pointer;
        }
      </style>

      <div class="vaadin-time-picker-container">
        <div part="label">
          <slot name="label"></slot>
          <span part="required-indicator" aria-hidden="true" on-click="focus"></span>
        </div>

        <vaadin-time-picker-combo-box
          id="comboBox"
          filtered-items="[[__dropdownItems]]"
          value="{{_comboBoxValue}}"
          opened="{{opened}}"
          disabled="[[disabled]]"
          readonly="[[readonly]]"
          clear-button-visible="[[clearButtonVisible]]"
          auto-open-disabled="[[autoOpenDisabled]]"
          overlay-class="[[overlayClass]]"
          position-target="[[_inputContainer]]"
          theme$="[[_theme]]"
          on-change="__onComboBoxChange"
          on-has-input-value-changed="__onComboBoxHasInputValueChanged"
        >
          <vaadin-input-container
            part="input-field"
            readonly="[[readonly]]"
            disabled="[[disabled]]"
            invalid="[[invalid]]"
            theme$="[[_theme]]"
          >
            <slot name="prefix" slot="prefix"></slot>
            <slot name="input"></slot>
            <div id="clearButton" part="clear-button" slot="suffix" aria-hidden="true"></div>
            <div id="toggleButton" class="toggle-button" part="toggle-button" slot="suffix" aria-hidden="true"></div>
          </vaadin-input-container>
        </vaadin-time-picker-combo-box>

        <div part="helper-text">
          <slot name="helper"></slot>
        </div>

        <div part="error-message">
          <slot name="error-message"></slot>
        </div>
      </div>
      <slot name="tooltip"></slot>
    `;
  }
  static get properties() {
    return {
      /**
       * The time value for this element.
       *
       * Supported time formats are in ISO 8601:
       * - `hh:mm` (default)
       * - `hh:mm:ss`
       * - `hh:mm:ss.fff`
       * @type {string}
       */
      value: {
        type: String,
        notify: !0,
        value: ""
      },
      /**
       * True if the dropdown is open, false otherwise.
       */
      opened: {
        type: Boolean,
        notify: !0,
        value: !1,
        reflectToAttribute: !0
      },
      /**
       * Minimum time allowed.
       *
       * Supported time formats are in ISO 8601:
       * - `hh:mm`
       * - `hh:mm:ss`
       * - `hh:mm:ss.fff`
       * @type {string}
       */
      min: {
        type: String,
        value: ""
      },
      /**
       * Maximum time allowed.
       *
       * Supported time formats are in ISO 8601:
       * - `hh:mm`
       * - `hh:mm:ss`
       * - `hh:mm:ss.fff`
       * @type {string}
       */
      max: {
        type: String,
        value: ""
      },
      /**
       * Defines the time interval (in seconds) between the items displayed
       * in the time selection box. The default is 1 hour (i.e. `3600`).
       *
       * It also configures the precision of the value string. By default
       * the component formats values as `hh:mm` but setting a step value
       * lower than one minute or one second, format resolution changes to
       * `hh:mm:ss` and `hh:mm:ss.fff` respectively.
       *
       * Unit must be set in seconds, and for correctly configuring intervals
       * in the dropdown, it need to evenly divide a day.
       *
       * Note: it is possible to define step that is dividing an hour in inexact
       * fragments (i.e. 5760 seconds which equals 1 hour 36 minutes), but it is
       * not recommended to use it for better UX experience.
       */
      step: {
        type: Number
      },
      /**
       * Set true to prevent the overlay from opening automatically.
       * @attr {boolean} auto-open-disabled
       */
      autoOpenDisabled: Boolean,
      /**
       * A space-delimited list of CSS class names to set on the overlay element.
       *
       * @attr {string} overlay-class
       */
      overlayClass: {
        type: String
      },
      /** @private */
      __dropdownItems: {
        type: Array
      },
      /**
       * The object used to localize this component.
       * To change the default localization, replace the entire
       * _i18n_ object or just the property you want to modify.
       *
       * The object has the following JSON structure:
       *
       * ```
       * {
       *   // A function to format given `Object` as
       *   // time string. Object is in the format `{ hours: ..., minutes: ..., seconds: ..., milliseconds: ... }`
       *   formatTime: (time) => {
       *     // returns a string representation of the given
       *     // object in `hh` / 'hh:mm' / 'hh:mm:ss' / 'hh:mm:ss.fff' - formats
       *   },
       *
       *   // A function to parse the given text to an `Object` in the format
       *   // `{ hours: ..., minutes: ..., seconds: ..., milliseconds: ... }`.
       *   // Must properly parse (at least) text
       *   // formatted by `formatTime`.
       *   parseTime: text => {
       *     // Parses a string in object/string that can be formatted by`formatTime`.
       *   }
       * }
       * ```
       *
       * Both `formatTime` and `parseTime` need to be implemented
       * to ensure the component works properly.
       *
       * @type {!TimePickerI18n}
       */
      i18n: {
        type: Object,
        value: () => ({
          formatTime: (t) => {
            if (!t)
              return;
            const e = (r = 0, s = "00") => (s + r).substr((s + r).length - s.length);
            let i = `${e(t.hours)}:${e(t.minutes)}`;
            return t.seconds !== void 0 && (i += `:${e(t.seconds)}`), t.milliseconds !== void 0 && (i += `.${e(t.milliseconds, "000")}`), i;
          },
          parseTime: (t) => {
            const e = "(\\d|[0-1]\\d|2[0-3])", i = "(\\d|[0-5]\\d)", r = i, s = "(\\d{1,3})", a = new RegExp(
              `^${e}(?::${i}(?::${r}(?:\\.${s})?)?)?$`,
              "u"
            ).exec(t);
            if (a) {
              if (a[4])
                for (; a[4].length < 3; )
                  a[4] += "0";
              return { hours: a[1], minutes: a[2], seconds: a[3], milliseconds: a[4] };
            }
          }
        })
      },
      /** @private */
      _comboBoxValue: {
        type: String,
        observer: "__comboBoxValueChanged"
      },
      /** @private */
      _inputContainer: Object
    };
  }
  static get observers() {
    return ["__updateDropdownItems(i18n.*, min, max, step)"];
  }
  static get constraints() {
    return [...super.constraints, "min", "max"];
  }
  /**
   * Used by `InputControlMixin` as a reference to the clear button element.
   * @protected
   * @return {!HTMLElement}
   */
  get clearElement() {
    return this.$.clearButton;
  }
  /** @protected */
  ready() {
    super.ready(), this.addController(
      new It(this, (t) => {
        this._setInputElement(t), this._setFocusElement(t), this.stateTarget = t, this.ariaTarget = t;
      })
    ), this.addController(new Tt(this.inputElement, this._labelController)), this._inputContainer = this.shadowRoot.querySelector('[part~="input-field"]'), this._tooltipController = new ue(this), this._tooltipController.setShouldShow((t) => !t.opened), this._tooltipController.setPosition("top"), this.addController(this._tooltipController);
  }
  /**
   * Override method inherited from `InputMixin` to forward the input to combo-box.
   * @protected
   * @override
   */
  _inputElementChanged(t) {
    super._inputElementChanged(t), t && this.$.comboBox._setInputElement(t);
  }
  /**
   * Opens the dropdown list.
   */
  open() {
    !this.disabled && !this.readonly && (this.opened = !0);
  }
  /**
   * Closes the dropdown list.
   */
  close() {
    this.opened = !1;
  }
  /**
   * Returns true if the current input value satisfies all constraints (if any).
   * You can override this method for custom validations.
   *
   * @return {boolean} True if the value is valid
   */
  checkValidity() {
    return !!(this.inputElement.checkValidity() && (!this.value || this._timeAllowed(this.i18n.parseTime(this.value))) && (!this._comboBoxValue || this.i18n.parseTime(this._comboBoxValue)));
  }
  /**
   * Override method inherited from `FocusMixin` to validate on blur.
   * @param {boolean} focused
   * @protected
   */
  _setFocused(t) {
    super._setFocused(t), t || this.validate();
  }
  /** @private */
  __validDayDivisor(t) {
    return !t || 24 * 3600 % t === 0 || t < 1 && t % 1 * 1e3 % 1 === 0;
  }
  /**
   * Override an event listener from `KeyboardMixin`.
   * @param {!KeyboardEvent} e
   * @protected
   */
  _onKeyDown(t) {
    if (super._onKeyDown(t), this.readonly || this.disabled || this.__dropdownItems.length)
      return;
    const e = this.__validDayDivisor(this.step) && this.step || 60;
    t.keyCode === 40 ? this.__onArrowPressWithStep(-e) : t.keyCode === 38 && this.__onArrowPressWithStep(e);
  }
  /**
   * Override an event listener from `KeyboardMixin`.
   * Do not call `super` in order to override clear
   * button logic defined in `InputControlMixin`.
   * @param {Event} event
   * @protected
   */
  _onEscape() {
  }
  /** @private */
  __onArrowPressWithStep(t) {
    const e = this.__addStep(this.__getMsec(this.__memoValue), t, !0);
    this.__memoValue = e, this.inputElement.value = this.i18n.formatTime(this.__validateTime(e)), this.__dispatchChange();
  }
  /** @private */
  __dispatchChange() {
    this.dispatchEvent(new CustomEvent("change", { bubbles: !0 }));
  }
  /**
   * Returning milliseconds from Object in the format `{ hours: ..., minutes: ..., seconds: ..., milliseconds: ... }`
   * @private
   */
  __getMsec(t) {
    let e = (t && t.hours || 0) * 60 * 60 * 1e3;
    return e += (t && t.minutes || 0) * 60 * 1e3, e += (t && t.seconds || 0) * 1e3, e += t && parseInt(t.milliseconds) || 0, e;
  }
  /**
   * Returning seconds from Object in the format `{ hours: ..., minutes: ..., seconds: ..., milliseconds: ... }`
   * @private
   */
  __getSec(t) {
    let e = (t && t.hours || 0) * 60 * 60;
    return e += (t && t.minutes || 0) * 60, e += t && t.seconds || 0, e += t && t.milliseconds / 1e3 || 0, e;
  }
  /**
   * Returning Object in the format `{ hours: ..., minutes: ..., seconds: ..., milliseconds: ... }`
   * from the result of adding step value in milliseconds to the milliseconds amount.
   * With `precision` parameter rounding the value to the closest step valid interval.
   * @private
   */
  __addStep(t, e, i) {
    t === 0 && e < 0 && (t = 24 * 60 * 60 * 1e3);
    const r = e * 1e3, s = t % r;
    r < 0 && s && i ? t -= s : r > 0 && s && i ? t -= s - r : t += r;
    const n = Math.floor(t / 1e3 / 60 / 60);
    t -= n * 1e3 * 60 * 60;
    const a = Math.floor(t / 1e3 / 60);
    t -= a * 1e3 * 60;
    const l = Math.floor(t / 1e3);
    return t -= l * 1e3, { hours: n < 24 ? n : 0, minutes: a, seconds: l, milliseconds: t };
  }
  /** @private */
  __updateDropdownItems(t, e, i, r) {
    const s = this.__validateTime(this.__parseISO(e || cs)), n = this.__getSec(s), a = this.__validateTime(this.__parseISO(i || hs)), l = this.__getSec(a);
    if (this.__dropdownItems = this.__generateDropdownList(n, l, r), r !== this.__oldStep) {
      this.__oldStep = r;
      const d = this.__validateTime(this.__parseISO(this.value));
      this.__updateValue(d);
    }
    this.value && (this._comboBoxValue = this.i18n.formatTime(this.i18n.parseTime(this.value)));
  }
  /** @private */
  __generateDropdownList(t, e, i) {
    if (i < 15 * 60 || !this.__validDayDivisor(i))
      return [];
    const r = [];
    i || (i = 3600);
    let s = -i + t;
    for (; s + i >= t && s + i <= e; ) {
      const n = this.__validateTime(this.__addStep(s * 1e3, i));
      s += i;
      const a = this.i18n.formatTime(n);
      r.push({ label: a, value: a });
    }
    return r;
  }
  /**
   * Override an observer from `InputMixin`.
   * @protected
   * @override
   */
  _valueChanged(t, e) {
    const i = this.__memoValue = this.__parseISO(t), r = this.__formatISO(i) || "";
    t !== "" && t !== null && !i ? this.value = e === void 0 ? "" : e : t !== r ? this.value = r : this.__keepInvalidInput ? delete this.__keepInvalidInput : this.__updateInputValue(i), this._toggleHasValue(this._hasValue);
  }
  /** @private */
  __comboBoxValueChanged(t, e) {
    if (t === "" && e === void 0)
      return;
    const i = this.i18n.parseTime(t), r = this.i18n.formatTime(i) || "";
    i ? t !== r ? this._comboBoxValue = r : this.__updateValue(i) : (this.value !== "" && t !== "" && (this.__keepInvalidInput = !0), this.value = "");
  }
  /** @private */
  __onComboBoxChange(t) {
    t.stopPropagation(), this.validate(), this.__dispatchChange();
  }
  /**
   * Synchronizes the `_hasInputValue` property with the internal combo-box's one.
   *
   * @private
   */
  __onComboBoxHasInputValueChanged() {
    this._hasInputValue = this.$.comboBox._hasInputValue;
  }
  /** @private */
  __updateValue(t) {
    const e = this.__formatISO(this.__validateTime(t)) || "";
    this.value = e;
  }
  /** @private */
  __updateInputValue(t) {
    const e = this.i18n.formatTime(this.__validateTime(t)) || "";
    this._comboBoxValue = e;
  }
  /** @private */
  __validateTime(t) {
    if (t) {
      const e = this.__getStepSegment();
      t.hours = parseInt(t.hours), t.minutes = parseInt(t.minutes || 0), t.seconds = e < 3 ? void 0 : parseInt(t.seconds || 0), t.milliseconds = e < 4 ? void 0 : parseInt(t.milliseconds || 0);
    }
    return t;
  }
  /** @private */
  __getStepSegment() {
    if (this.step % 3600 === 0)
      return 1;
    if (this.step % 60 === 0 || !this.step)
      return 2;
    if (this.step % 1 === 0)
      return 3;
    if (this.step < 1)
      return 4;
  }
  /** @private */
  __formatISO(t) {
    return Ve.properties.i18n.value().formatTime(t);
  }
  /** @private */
  __parseISO(t) {
    return Ve.properties.i18n.value().parseTime(t);
  }
  /**
   * Returns true if `time` satisfies the `min` and `max` constraints (if any).
   *
   * @param {!TimePickerTime} time Value to check against constraints
   * @return {boolean} True if `time` satisfies the constraints
   * @protected
   */
  _timeAllowed(t) {
    const e = this.i18n.parseTime(this.min || cs), i = this.i18n.parseTime(this.max || hs);
    return (!this.__getMsec(e) || this.__getMsec(t) >= this.__getMsec(e)) && (!this.__getMsec(i) || this.__getMsec(t) <= this.__getMsec(i));
  }
  /**
   * Override method inherited from `InputControlMixin`.
   * @protected
   */
  _onClearButtonClick() {
  }
  /**
   * Override method inherited from `InputConstraintsMixin`.
   * @protected
   */
  _onChange() {
  }
  /**
   * Override method inherited from `InputMixin`.
   * @protected
   */
  _onInput() {
  }
  /**
   * Fired when the user commits a value change.
   *
   * @event change
   */
}
customElements.define(Ve.is, Ve);
/**
 * @license
 * Copyright (c) 2019 - 2023 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
const xa = _`
  :host {
    --lumo-text-field-size: var(--lumo-size-m);
    color: var(--lumo-body-text-color);
    font-size: var(--lumo-font-size-m);
    /* align with text-field height + vertical paddings */
    line-height: calc(var(--lumo-text-field-size) + 2 * var(--lumo-space-xs));
    font-family: var(--lumo-font-family);
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    -webkit-tap-highlight-color: transparent;
    padding: 0;
  }

  :host::before {
    margin-top: var(--lumo-space-xs);
    height: var(--lumo-text-field-size);
    box-sizing: border-box;
    display: inline-flex;
    align-items: center;
  }

  /* align with text-field label */
  :host([has-label]) [part='label'] {
    padding-bottom: calc(0.5em - var(--lumo-space-xs));
  }

  :host(:not([has-label])) [part='label'],
  :host(:not([has-label]))::before {
    display: none;
  }

  /* align with text-field error message */
  :host([has-error-message]) [part='error-message']::before {
    height: calc(0.4em - var(--lumo-space-xs));
  }

  :host([focused]:not([readonly]):not([disabled])) [part='label'] {
    color: var(--lumo-primary-text-color);
  }

  :host(:hover:not([readonly]):not([disabled]):not([focused])) [part='label'],
  :host(:hover:not([readonly]):not([disabled]):not([focused])) [part='helper-text'] {
    color: var(--lumo-body-text-color);
  }

  /* Touch device adjustment */
  @media (pointer: coarse) {
    :host(:hover:not([readonly]):not([disabled]):not([focused])) [part='label'] {
      color: var(--lumo-secondary-text-color);
    }
  }

  /* Disabled */
  :host([disabled]) [part='label'] {
    color: var(--lumo-disabled-text-color);
    -webkit-text-fill-color: var(--lumo-disabled-text-color);
  }

  /* Small theme */
  :host([theme~='small']) {
    font-size: var(--lumo-font-size-s);
    --lumo-text-field-size: var(--lumo-size-s);
  }

  :host([theme~='small'][has-label]) [part='label'] {
    font-size: var(--lumo-font-size-xs);
  }

  :host([theme~='small'][has-label]) [part='error-message'] {
    font-size: var(--lumo-font-size-xxs);
  }

  /* When custom-field is used with components without outer margin */
  :host([theme~='whitespace'][has-label]) [part='label'] {
    padding-bottom: 0.5em;
  }
`;
m("vaadin-custom-field", [pi, qr, xa], {
  moduleId: "lumo-custom-field"
});
const Kh = _`
  ::slotted([slot='date-picker']) {
    margin-inline-end: 2px;
    --vaadin-input-field-top-end-radius: 0;
    --vaadin-input-field-bottom-end-radius: 0;
  }

  ::slotted([slot='time-picker']) {
    --vaadin-input-field-top-start-radius: 0;
    --vaadin-input-field-bottom-start-radius: 0;
  }
`;
m("vaadin-date-time-picker", [Kh, pi, qr, xa], {
  moduleId: "lumo-date-time-picker"
});
/**
 * @license
 * Copyright (c) 2019 - 2023 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
m("vaadin-date-time-picker", Pt, { moduleId: "vaadin-date-time-picker" });
function wa(o, t) {
  for (; o; ) {
    if (o.properties && o.properties[t])
      return o.properties[t];
    o = Object.getPrototypeOf(o);
  }
}
const Aa = wa(ii, "i18n").value(), Gt = wa(Ve, "i18n").value(), us = Object.keys(Aa), ps = Object.keys(Gt);
class _s extends X {
  constructor(t, e) {
    super(t, `${e}-picker`, `vaadin-${e}-picker`, {
      initializer: (i, r) => {
        const s = `__${e}Picker`;
        r[s] = i;
      }
    });
  }
}
class fs extends da(kt(ui(O(he(A))))) {
  static get template() {
    return k`
      <style>
        .vaadin-date-time-picker-container {
          --vaadin-field-default-width: auto;
        }

        .slots {
          display: flex;
          --vaadin-field-default-width: 12em;
        }

        .slots ::slotted([slot='date-picker']) {
          min-width: 0;
          flex: 1 1 auto;
        }

        .slots ::slotted([slot='time-picker']) {
          min-width: 0;
          flex: 1 1.65 auto;
        }
      </style>

      <div class="vaadin-date-time-picker-container">
        <div part="label" on-click="focus">
          <slot name="label"></slot>
          <span part="required-indicator" aria-hidden="true"></span>
        </div>

        <div class="slots">
          <slot name="date-picker" id="dateSlot"></slot>
          <slot name="time-picker" id="timeSlot"></slot>
        </div>

        <div part="helper-text">
          <slot name="helper"></slot>
        </div>

        <div part="error-message">
          <slot name="error-message"></slot>
        </div>
      </div>

      <slot name="tooltip"></slot>
    `;
  }
  static get is() {
    return "vaadin-date-time-picker";
  }
  static get properties() {
    return {
      /**
       * The name of the control, which is submitted with the form data.
       */
      name: {
        type: String
      },
      /**
       * The value for this element.
       *
       * Supported date time format is based on ISO 8601 (without a time zone designator):
       * - Minute precision `"YYYY-MM-DDThh:mm"` (default)
       * - Second precision `"YYYY-MM-DDThh:mm:ss"`
       * - Millisecond precision `"YYYY-MM-DDThh:mm:ss.fff"`
       * @type {string}
       */
      value: {
        type: String,
        notify: !0,
        value: "",
        observer: "__valueChanged"
      },
      /**
       * The earliest allowed value (date and time) that can be selected. All earlier values will be disabled.
       *
       * Supported date time format is based on ISO 8601 (without a time zone designator):
       * - Minute precision `"YYYY-MM-DDThh:mm"`
       * - Second precision `"YYYY-MM-DDThh:mm:ss"`
       * - Millisecond precision `"YYYY-MM-DDThh:mm:ss.fff"`
       *
       * @type {string | undefined}
       */
      min: {
        type: String,
        observer: "__minChanged"
      },
      /**
       * The latest value (date and time) that can be selected. All later values will be disabled.
       *
       * Supported date time format is based on ISO 8601 (without a time zone designator):
       * - Minute precision `"YYYY-MM-DDThh:mm"`
       * - Second precision `"YYYY-MM-DDThh:mm:ss"`
       * - Millisecond precision `"YYYY-MM-DDThh:mm:ss.fff"`
       *
       * @type {string | undefined}
       */
      max: {
        type: String,
        observer: "__maxChanged"
      },
      /**
       * The earliest value that can be selected. All earlier values will be disabled.
       * @private
       */
      __minDateTime: {
        type: Date,
        value: ""
      },
      /**
       * The latest value that can be selected. All later values will be disabled.
       * @private
       */
      __maxDateTime: {
        type: Date,
        value: ""
      },
      /**
       * A placeholder string for the date field.
       * @attr {string} date-placeholder
       */
      datePlaceholder: {
        type: String
      },
      /**
       * A placeholder string for the time field.
       * @attr {string} time-placeholder
       */
      timePlaceholder: {
        type: String
      },
      /**
       * Defines the time interval (in seconds) between the items displayed
       * in the time selection box. The default is 1 hour (i.e. `3600`).
       *
       * It also configures the precision of the time part of the value string. By default
       * the component formats time values as `hh:mm` but setting a step value
       * lower than one minute or one second, format resolution changes to
       * `hh:mm:ss` and `hh:mm:ss.fff` respectively.
       *
       * Unit must be set in seconds, and for correctly configuring intervals
       * in the dropdown, it need to evenly divide a day.
       *
       * Note: it is possible to define step that is dividing an hour in inexact
       * fragments (i.e. 5760 seconds which equals 1 hour 36 minutes), but it is
       * not recommended to use it for better UX.
       */
      step: {
        type: Number
      },
      /**
       * Date which should be visible in the date picker overlay when there is no value selected.
       *
       * The same date formats as for the `value` property are supported but without the time part.
       * @attr {string} initial-position
       */
      initialPosition: String,
      /**
       * Set true to display ISO-8601 week numbers in the calendar. Notice that
       * displaying week numbers is only supported when `i18n.firstDayOfWeek`
       * is 1 (Monday).
       * @attr {boolean} show-week-numbers
       */
      showWeekNumbers: {
        type: Boolean
      },
      /**
       * Set to true to prevent the overlays from opening automatically.
       * @attr {boolean} auto-open-disabled
       */
      autoOpenDisabled: Boolean,
      /**
       * Set to true to make this element read-only.
       * @type {boolean}
       */
      readonly: {
        type: Boolean,
        value: !1,
        reflectToAttribute: !0
      },
      /**
       * Specify that this control should have input focus when the page loads.
       * @type {boolean}
       */
      autofocus: {
        type: Boolean
      },
      /**
       * The current selected date time.
       * @private
       */
      __selectedDateTime: {
        type: Date
      },
      /**
       * The object used to localize this component.
       * To change the default localization, replace the entire
       * `i18n` object or just the properties you want to modify.
       *
       * The object is a combination of the i18n properties supported by
       * [`<vaadin-date-picker>`](#/elements/vaadin-date-picker) and
       * [`<vaadin-time-picker>`](#/elements/vaadin-time-picker).
       * @type {!DateTimePickerI18n}
       */
      i18n: {
        type: Object,
        value: () => ({ ...Aa, ...Gt })
      },
      /**
       * A space-delimited list of CSS class names to set on the overlay elements
       * of the internal components controlled by the `<vaadin-date-time-picker>`:
       *
       * - [`<vaadin-date-picker>`](#/elements/vaadin-date-picker#property-overlayClass)
       * - [`<vaadin-time-picker>`](#/elements/vaadin-time-picker#property-overlayClass)
       *
       * @attr {string} overlay-class
       */
      overlayClass: {
        type: String
      },
      /**
       * The current slotted date picker.
       * @private
       */
      __datePicker: {
        type: HTMLElement,
        observer: "__datePickerChanged"
      },
      /**
       * The current slotted time picker.
       * @private
       */
      __timePicker: {
        type: HTMLElement,
        observer: "__timePickerChanged"
      }
    };
  }
  static get observers() {
    return [
      "__selectedDateTimeChanged(__selectedDateTime)",
      "__datePlaceholderChanged(datePlaceholder, __datePicker)",
      "__timePlaceholderChanged(timePlaceholder, __timePicker)",
      "__stepChanged(step, __timePicker)",
      "__initialPositionChanged(initialPosition, __datePicker)",
      "__showWeekNumbersChanged(showWeekNumbers, __datePicker)",
      "__requiredChanged(required, __datePicker, __timePicker)",
      "__invalidChanged(invalid, __datePicker, __timePicker)",
      "__disabledChanged(disabled, __datePicker, __timePicker)",
      "__readonlyChanged(readonly, __datePicker, __timePicker)",
      "__i18nChanged(i18n, __datePicker, __timePicker)",
      "__autoOpenDisabledChanged(autoOpenDisabled, __datePicker, __timePicker)",
      "__themeChanged(_theme, __datePicker, __timePicker)",
      "__overlayClassChanged(overlayClass, __datePicker, __timePicker)",
      "__pickersChanged(__datePicker, __timePicker)",
      "__labelOrAccessibleNameChanged(label, accessibleName, i18n, __datePicker, __timePicker)"
    ];
  }
  constructor() {
    super(), this.__defaultDateMinMaxValue = void 0, this.__defaultTimeMinValue = "00:00:00.000", this.__defaultTimeMaxValue = "23:59:59.999", this.__changeEventHandler = this.__changeEventHandler.bind(this), this.__valueChangedEventHandler = this.__valueChangedEventHandler.bind(this);
  }
  /** @private */
  get __inputs() {
    return [this.__datePicker, this.__timePicker];
  }
  /** @private */
  get __formattedValue() {
    const [t, e] = this.__inputs.map((i) => i.value);
    return t && e ? [t, e].join("T") : "";
  }
  /** @protected */
  ready() {
    super.ready(), this._datePickerController = new _s(this, "date"), this.addController(this._datePickerController), this._timePickerController = new _s(this, "time"), this.addController(this._timePickerController), this.autofocus && !this.disabled && window.requestAnimationFrame(() => this.focus()), this.setAttribute("role", "group"), this._tooltipController = new ue(this), this.addController(this._tooltipController), this._tooltipController.setPosition("top"), this._tooltipController.setShouldShow((t) => t.__datePicker && !t.__datePicker.opened && t.__timePicker && !t.__timePicker.opened), this.ariaTarget = this;
  }
  focus() {
    this.__datePicker.focus();
  }
  /**
   * Override method inherited from `FocusMixin` to validate on blur.
   * @param {boolean} focused
   * @protected
   * @override
   */
  _setFocused(t) {
    super._setFocused(t), t || this.validate();
  }
  /**
   * Override method inherited from `FocusMixin` to not remove focused
   * state when focus moves between pickers or to the overlay.
   * @param {FocusEvent} event
   * @return {boolean}
   * @protected
   * @override
   */
  _shouldRemoveFocus(t) {
    const e = t.relatedTarget, i = this.__datePicker._overlayContent;
    return !(this.__datePicker.contains(e) || this.__timePicker.contains(e) || i && i.contains(e));
  }
  /** @private */
  __syncI18n(t, e, i = Object.keys(e.i18n)) {
    i.forEach((r) => {
      e.i18n && e.i18n.hasOwnProperty(r) && t.set(`i18n.${r}`, e.i18n[r]);
    });
  }
  /** @private */
  __changeEventHandler(t) {
    t.stopPropagation(), this.__dispatchChangeForValue === this.value && (this.__dispatchChange(), this.validate()), this.__dispatchChangeForValue = void 0;
  }
  /** @private */
  __addInputListeners(t) {
    t.addEventListener("change", this.__changeEventHandler), t.addEventListener("value-changed", this.__valueChangedEventHandler);
  }
  /** @private */
  __removeInputListeners(t) {
    t.removeEventListener("change", this.__changeEventHandler), t.removeEventListener("value-changed", this.__valueChangedEventHandler);
  }
  /** @private */
  __isDefaultPicker(t, e) {
    const i = this[`_${e}PickerController`];
    return i && t === i.defaultNode;
  }
  /** @private */
  __datePickerChanged(t, e) {
    t && (e && (this.__removeInputListeners(e), e.remove()), this.__addInputListeners(t), this.__isDefaultPicker(t, "date") ? (t.placeholder = this.datePlaceholder, t.invalid = this.invalid, t.initialPosition = this.initialPosition, t.showWeekNumbers = this.showWeekNumbers, this.__syncI18n(t, this, us)) : (this.datePlaceholder = t.placeholder, this.initialPosition = t.initialPosition, this.showWeekNumbers = t.showWeekNumbers, this.__syncI18n(this, t, us)), t.min = this.__formatDateISO(this.__minDateTime, this.__defaultDateMinMaxValue), t.max = this.__formatDateISO(this.__maxDateTime, this.__defaultDateMinMaxValue), t.validate = () => {
    }, t._validateInput = () => {
    });
  }
  /** @private */
  __timePickerChanged(t, e) {
    t && (e && (this.__removeInputListeners(e), e.remove()), this.__addInputListeners(t), this.__isDefaultPicker(t, "time") ? (t.placeholder = this.timePlaceholder, t.step = this.step, t.invalid = this.invalid, this.__syncI18n(t, this, ps)) : (this.timePlaceholder = t.placeholder, this.step = t.step, this.__syncI18n(this, t, ps)), this.__updateTimePickerMinMax(), t.validate = () => {
    });
  }
  /** @private */
  __updateTimePickerMinMax() {
    if (this.__timePicker && this.__datePicker) {
      const t = this.__parseDate(this.__datePicker.value), e = N(this.__minDateTime, this.__maxDateTime), i = this.__timePicker.value;
      this.__minDateTime && N(t, this.__minDateTime) || e ? this.__timePicker.min = this.__dateToIsoTimeString(this.__minDateTime) : this.__timePicker.min = this.__defaultTimeMinValue, this.__maxDateTime && N(t, this.__maxDateTime) || e ? this.__timePicker.max = this.__dateToIsoTimeString(this.__maxDateTime) : this.__timePicker.max = this.__defaultTimeMaxValue, this.__timePicker.value !== i && (this.__timePicker.value = i);
    }
  }
  /** @private */
  __i18nChanged(t, e, i) {
    e && (e.i18n = { ...e.i18n, ...t }), i && (i.i18n = { ...i.i18n, ...t });
  }
  /** @private */
  __labelOrAccessibleNameChanged(t, e, i, r, s) {
    const n = e || t || "";
    r && (r.accessibleName = `${n} ${i.dateLabel || ""}`.trim()), s && (s.accessibleName = `${n} ${i.timeLabel || ""}`.trim());
  }
  /** @private */
  __datePlaceholderChanged(t, e) {
    e && (e.placeholder = t);
  }
  /** @private */
  __timePlaceholderChanged(t, e) {
    e && (e.placeholder = t);
  }
  /** @private */
  __stepChanged(t, e) {
    e && e.step !== t && (e.step = t);
  }
  /** @private */
  __initialPositionChanged(t, e) {
    e && (e.initialPosition = t);
  }
  /** @private */
  __showWeekNumbersChanged(t, e) {
    e && (e.showWeekNumbers = t);
  }
  /** @private */
  __invalidChanged(t, e, i) {
    e && (e.invalid = t), i && (i.invalid = t);
  }
  /** @private */
  __requiredChanged(t, e, i) {
    e && (e.required = t), i && (i.required = t);
  }
  /** @private */
  __disabledChanged(t, e, i) {
    e && (e.disabled = t), i && (i.disabled = t);
  }
  /** @private */
  __readonlyChanged(t, e, i) {
    e && (e.readonly = t), i && (i.readonly = t);
  }
  /**
   * String (ISO date) to Date object
   * @param {string} str e.g. 'yyyy-mm-dd'
   * @return {Date | undefined}
   * @private
   */
  __parseDate(t) {
    return Oe(t);
  }
  /**
   * Date object to string (ISO date)
   * @param {Date} date
   * @param {string} defaultValue
   * @return {string} e.g. 'yyyy-mm-dd' (or defaultValue when date is falsy)
   * @private
   */
  __formatDateISO(t, e) {
    return t ? ii.prototype._formatISO(t) : e;
  }
  /**
   * Custom time object to string (ISO time)
   * @param {!TimePickerTime} time Time components as properties { hours, minutes, seconds, milliseconds }
   * @return {string} e.g. 'hh:mm', 'hh:mm:ss', 'hh:mm:ss.fff'
   * @private
   */
  __formatTimeISO(t) {
    return Gt.formatTime(t);
  }
  /**
   * String (ISO time) to custom time object
   * @param {string} str e.g. 'hh:mm', 'hh:mm:ss', 'hh:mm:ss.fff'
   * @return {!TimePickerTime | undefined} Time components as properties { hours, minutes, seconds, milliseconds }
   * @private
   */
  __parseTimeISO(t) {
    return Gt.parseTime(t);
  }
  /**
   * String (ISO date time) to Date object
   * @param {string} str e.g. 'yyyy-mm-ddThh:mm', 'yyyy-mm-ddThh:mm:ss', 'yyyy-mm-ddThh:mm:ss.fff'
   * @return {Date | undefined}
   * @private
   */
  __parseDateTime(t) {
    const [e, i] = t.split("T");
    if (!(e && i))
      return;
    const r = this.__parseDate(e);
    if (!r)
      return;
    const s = this.__parseTimeISO(i);
    if (s)
      return r.setHours(parseInt(s.hours)), r.setMinutes(parseInt(s.minutes || 0)), r.setSeconds(parseInt(s.seconds || 0)), r.setMilliseconds(parseInt(s.milliseconds || 0)), r;
  }
  /**
   * Date object to string (ISO date time)
   * @param {Date} date
   * @return {string} e.g. 'yyyy-mm-ddThh:mm', 'yyyy-mm-ddThh:mm:ss', 'yyyy-mm-ddThh:mm:ss.fff'
   *                  (depending on precision defined by "step" property)
   * @private
   */
  __formatDateTime(t) {
    if (!t)
      return "";
    const e = this.__formatDateISO(t, ""), i = this.__dateToIsoTimeString(t);
    return `${e}T${i}`;
  }
  /**
   * Date object to string (ISO time)
   * @param {Date} date
   * @return {string} e.g. 'hh:mm', 'hh:mm:ss', 'hh:mm:ss.fff' (depending on precision defined by "step" property)
   * @private
   */
  __dateToIsoTimeString(t) {
    return this.__formatTimeISO(
      this.__validateTime({
        hours: t.getHours(),
        minutes: t.getMinutes(),
        seconds: t.getSeconds(),
        milliseconds: t.getMilliseconds()
      })
    );
  }
  /**
   * @param {!TimePickerTime} timeObject
   * @return {!TimePickerTime}
   * @private
   */
  __validateTime(t) {
    if (t) {
      const e = this.__getStepSegment();
      t.seconds = e < 3 ? void 0 : t.seconds, t.milliseconds = e < 4 ? void 0 : t.milliseconds;
    }
    return t;
  }
  /**
   * Returns true if the current input value satisfies all constraints (if any)
   *
   * You can override the `checkValidity` method for custom validations.
   * @return {boolean}
   */
  checkValidity() {
    const t = this.__inputs.some((i) => !i.checkValidity()), e = this.required && this.__inputs.some((i) => !i.value);
    return !(t || e);
  }
  // Copied from vaadin-time-picker
  /** @private */
  __getStepSegment() {
    const t = this.step == null ? 60 : parseFloat(this.step);
    if (t % 3600 === 0)
      return 1;
    if (t % 60 === 0 || !t)
      return 2;
    if (t % 1 === 0)
      return 3;
    if (t < 1)
      return 4;
  }
  /**
   * @param {Date} date1
   * @param {Date} date2
   * @return {boolean}
   * @private
   */
  __dateTimeEquals(t, e) {
    return N(t, e) ? t.getHours() === e.getHours() && t.getMinutes() === e.getMinutes() && t.getSeconds() === e.getSeconds() && t.getMilliseconds() === e.getMilliseconds() : !1;
  }
  /** @private */
  __handleDateTimeChange(t, e, i, r) {
    if (!i) {
      this[t] = "", this[e] = "";
      return;
    }
    const s = this.__parseDateTime(i);
    if (!s) {
      this[t] = r;
      return;
    }
    this.__dateTimeEquals(this[e], s) || (this[e] = s);
  }
  /** @private */
  __valueChanged(t, e) {
    this.__handleDateTimeChange("value", "__selectedDateTime", t, e), e !== void 0 && (this.__dispatchChangeForValue = t), this.toggleAttribute("has-value", !!t), this.__updateTimePickerMinMax();
  }
  /** @private */
  __dispatchChange() {
    this.dispatchEvent(new CustomEvent("change", { bubbles: !0 }));
  }
  /** @private */
  __minChanged(t, e) {
    this.__handleDateTimeChange("min", "__minDateTime", t, e), this.__datePicker && (this.__datePicker.min = this.__formatDateISO(this.__minDateTime, this.__defaultDateMinMaxValue)), this.__updateTimePickerMinMax(), this.__datePicker && this.__timePicker && this.value && this.validate();
  }
  /** @private */
  __maxChanged(t, e) {
    this.__handleDateTimeChange("max", "__maxDateTime", t, e), this.__datePicker && (this.__datePicker.max = this.__formatDateISO(this.__maxDateTime, this.__defaultDateMinMaxValue)), this.__updateTimePickerMinMax(), this.__datePicker && this.__timePicker && this.value && this.validate();
  }
  /** @private */
  __selectedDateTimeChanged(t) {
    const e = this.__formatDateTime(t);
    if (this.value !== e && (this.value = e), !!(this.__datePicker && this.__datePicker.$) && !this.__ignoreInputValueChange) {
      this.__ignoreInputValueChange = !0;
      const [r, s] = this.value.split("T");
      this.__datePicker.value = r || "", this.__timePicker.value = s || "", this.__ignoreInputValueChange = !1;
    }
  }
  /** @private */
  __valueChangedEventHandler() {
    if (this.__ignoreInputValueChange)
      return;
    const t = this.__formattedValue, [e, i] = t.split("T");
    this.__ignoreInputValueChange = !0, this.__updateTimePickerMinMax(), e && i ? t !== this.value && (this.value = t) : this.value = "", this.__ignoreInputValueChange = !1;
  }
  /** @private */
  __autoOpenDisabledChanged(t, e, i) {
    e && (e.autoOpenDisabled = t), i && (i.autoOpenDisabled = t);
  }
  /** @private */
  __themeChanged(t, e, i) {
    !e || !i || [e, i].forEach((r) => {
      t ? r.setAttribute("theme", t) : r.removeAttribute("theme");
    });
  }
  /** @private */
  __overlayClassChanged(t, e, i) {
    !e || !i || (e.overlayClass = t, i.overlayClass = t);
  }
  /** @private */
  __pickersChanged(t, e) {
    !t || !e || this.__isDefaultPicker(t, "date") === this.__isDefaultPicker(e, "time") && (t.value ? this.__valueChangedEventHandler() : this.value && (this.__selectedDateTimeChanged(this.__selectedDateTime), (this.min || this.max) && this.validate()));
  }
  /**
   * Fired when the user commits a value change.
   *
   * @event change
   */
}
customElements.define(fs.is, fs);
const Qh = _`
  :host {
    outline: none;
  }

  [part='toggle-button']::before {
    content: var(--lumo-icons-dropdown);
  }
`;
m("vaadin-combo-box", [St, Qh], { moduleId: "lumo-combo-box" });
/**
 * @license
 * Copyright (c) 2015 - 2023 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
class ms extends fa(O(te(A))) {
  static get template() {
    return k`
      <style>
        :host {
          display: block;
        }

        :host([hidden]) {
          display: none;
        }
      </style>
      <span part="checkmark" aria-hidden="true"></span>
      <div part="content">
        <slot></slot>
      </div>
    `;
  }
  static get is() {
    return "vaadin-combo-box-item";
  }
}
customElements.define(ms.is, ms);
/**
 * @license
 * Copyright (c) 2015 - 2023 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
m(
  "vaadin-combo-box-overlay",
  _`
    #overlay {
      width: var(--vaadin-combo-box-overlay-width, var(--_vaadin-combo-box-overlay-default-width, auto));
    }

    [part='content'] {
      display: flex;
      flex-direction: column;
      height: 100%;
    }
  `,
  { moduleId: "vaadin-combo-box-overlay-styles" }
);
let Ht;
class gs extends va(U) {
  static get is() {
    return "vaadin-combo-box-overlay";
  }
  static get template() {
    if (!Ht) {
      Ht = super.template.cloneNode(!0);
      const t = Ht.content.querySelector('[part~="overlay"]');
      t.removeAttribute("tabindex");
      const e = document.createElement("div");
      e.setAttribute("part", "loader"), t.insertBefore(e, t.firstElementChild);
    }
    return Ht;
  }
}
customElements.define(gs.is, gs);
/**
 * @license
 * Copyright (c) 2015 - 2023 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
class bs extends ba(A) {
  static get is() {
    return "vaadin-combo-box-scroller";
  }
  static get template() {
    return k`
      <style>
        :host {
          display: block;
          min-height: 1px;
          overflow: auto;

          /* Fixes item background from getting on top of scrollbars on Safari */
          transform: translate3d(0, 0, 0);

          /* Enable momentum scrolling on iOS */
          -webkit-overflow-scrolling: touch;

          /* Fixes scrollbar disappearing when 'Show scroll bars: Always' enabled in Safari */
          box-shadow: 0 0 0 white;
        }

        #selector {
          border-width: var(--_vaadin-combo-box-items-container-border-width);
          border-style: var(--_vaadin-combo-box-items-container-border-style);
          border-color: var(--_vaadin-combo-box-items-container-border-color, transparent);
          position: relative;
        }
      </style>
      <div id="selector">
        <slot></slot>
      </div>
    `;
  }
}
customElements.define(bs.is, bs);
/**
 * @license
 * Copyright (c) 2015 - 2023 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
const Zh = (o) => class extends o {
  static get properties() {
    return {
      /**
       * Number of items fetched at a time from the dataprovider.
       * @attr {number} page-size
       * @type {number}
       */
      pageSize: {
        type: Number,
        value: 50,
        observer: "_pageSizeChanged"
      },
      /**
       * Total number of items.
       * @type {number | undefined}
       */
      size: {
        type: Number,
        observer: "_sizeChanged"
      },
      /**
       * Function that provides items lazily. Receives arguments `params`, `callback`
       *
       * `params.page` Requested page index
       *
       * `params.pageSize` Current page size
       *
       * `params.filter` Currently applied filter
       *
       * `callback(items, size)` Callback function with arguments:
       *   - `items` Current page of items
       *   - `size` Total number of items.
       * @type {ComboBoxDataProvider | undefined}
       */
      dataProvider: {
        type: Object,
        observer: "_dataProviderChanged"
      },
      /** @private */
      _pendingRequests: {
        value: () => ({})
      },
      /** @private */
      __placeHolder: {
        value: new He()
      },
      /** @private */
      __previousDataProviderFilter: {
        type: String
      }
    };
  }
  static get observers() {
    return [
      "_dataProviderFilterChanged(filter)",
      "_warnDataProviderValue(dataProvider, value)",
      "_ensureFirstPage(opened)"
    ];
  }
  /** @protected */
  ready() {
    super.ready(), this._scroller.addEventListener("index-requested", (e) => {
      const i = e.detail.index, r = e.detail.currentScrollerPos, s = Math.floor(this.pageSize * 1.5);
      if (!this._shouldSkipIndex(i, s, r) && i !== void 0) {
        const n = this._getPageForIndex(i);
        this._shouldLoadPage(n) && this._loadPage(n);
      }
    });
  }
  /** @private */
  _dataProviderFilterChanged(e) {
    if (this.__previousDataProviderFilter === void 0 && e === "") {
      this.__previousDataProviderFilter = e;
      return;
    }
    this.__previousDataProviderFilter !== e && (this.__previousDataProviderFilter = e, this._pendingRequests = {}, this.loading = this._shouldFetchData(), this.size = void 0, this.clearCache());
  }
  /** @private */
  _shouldFetchData() {
    return this.dataProvider ? this.opened || this.filter && this.filter.length : !1;
  }
  /** @private */
  _ensureFirstPage(e) {
    e && this._shouldLoadPage(0) && this._loadPage(0);
  }
  /** @private */
  _shouldSkipIndex(e, i, r) {
    return r !== 0 && e >= r - i && e <= r + i;
  }
  /** @private */
  _shouldLoadPage(e) {
    if (!this.filteredItems || this._forceNextRequest)
      return this._forceNextRequest = !1, !0;
    const i = this.filteredItems[e * this.pageSize];
    return i !== void 0 ? i instanceof He : this.size === void 0;
  }
  /** @private */
  _loadPage(e) {
    if (this._pendingRequests[e] || !this.dataProvider)
      return;
    const i = {
      page: e,
      pageSize: this.pageSize,
      filter: this.filter
    }, r = (s, n) => {
      if (this._pendingRequests[e] !== r)
        return;
      const a = this.filteredItems ? [...this.filteredItems] : [];
      a.splice(i.page * i.pageSize, s.length, ...s), this.filteredItems = a, !this.opened && !this._isInputFocused() && this._commitValue(), n !== void 0 && (this.size = n), delete this._pendingRequests[e], Object.keys(this._pendingRequests).length === 0 && (this.loading = !1);
    };
    this._pendingRequests[e] = r, this.loading = !0, this.dataProvider(i, r);
  }
  /** @private */
  _getPageForIndex(e) {
    return Math.floor(e / this.pageSize);
  }
  /**
   * Clears the cached pages and reloads data from dataprovider when needed.
   */
  clearCache() {
    if (!this.dataProvider)
      return;
    this._pendingRequests = {};
    const e = [];
    for (let i = 0; i < (this.size || 0); i++)
      e.push(this.__placeHolder);
    this.filteredItems = e, this._shouldFetchData() ? (this._forceNextRequest = !1, this._loadPage(0)) : this._forceNextRequest = !0;
  }
  /** @private */
  _sizeChanged(e = 0) {
    const i = (this.filteredItems || []).slice(0, e);
    for (let r = 0; r < e; r++)
      i[r] = i[r] !== void 0 ? i[r] : this.__placeHolder;
    this.filteredItems = i, this._flushPendingRequests(e);
  }
  /** @private */
  _pageSizeChanged(e, i) {
    if (Math.floor(e) !== e || e < 1)
      throw this.pageSize = i, new Error("`pageSize` value must be an integer > 0");
    this.clearCache();
  }
  /** @private */
  _dataProviderChanged(e, i) {
    this._ensureItemsOrDataProvider(() => {
      this.dataProvider = i;
    }), this.clearCache();
  }
  /** @private */
  _ensureItemsOrDataProvider(e) {
    if (this.items !== void 0 && this.dataProvider !== void 0)
      throw e(), new Error("Using `items` and `dataProvider` together is not supported");
    this.dataProvider && !this.filteredItems && (this.filteredItems = []);
  }
  /** @private */
  _warnDataProviderValue(e, i) {
    if (e && i !== "" && (this.selectedItem === void 0 || this.selectedItem === null)) {
      const r = this.__getItemIndexByValue(this.filteredItems, i);
      r < 0 || this._getItemLabel(this.filteredItems[r]);
    }
  }
  /**
   * This method cleans up the page callbacks which refers to the
   * non-existing pages, i.e. which item indexes are greater than the
   * changed size.
   * This case is basically happens when:
   * 1. Users scroll fast to the bottom and combo box generates the
   * redundant page request/callback
   * 2. Server side uses undefined size lazy loading and suddenly reaches
   * the exact size which is on the range edge
   * (for default page size = 50, it will be 100, 200, 300, ...).
   * @param size the new size of items
   * @private
   */
  _flushPendingRequests(e) {
    if (this._pendingRequests) {
      const i = Math.ceil(e / this.pageSize);
      Object.entries(this._pendingRequests).forEach(([r, s]) => {
        parseInt(r) >= i && s([], e);
      });
    }
  }
};
/**
 * @license
 * Copyright (c) 2015 - 2023 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
m("vaadin-combo-box", Pt, { moduleId: "vaadin-combo-box-styles" });
class vs extends Zh(
  ya(Ca(fi(O(he(A)))))
) {
  static get is() {
    return "vaadin-combo-box";
  }
  static get template() {
    return k`
      <style>
        :host([opened]) {
          pointer-events: auto;
        }
      </style>

      <div class="vaadin-combo-box-container">
        <div part="label">
          <slot name="label"></slot>
          <span part="required-indicator" aria-hidden="true" on-click="focus"></span>
        </div>

        <vaadin-input-container
          part="input-field"
          readonly="[[readonly]]"
          disabled="[[disabled]]"
          invalid="[[invalid]]"
          theme$="[[_theme]]"
        >
          <slot name="prefix" slot="prefix"></slot>
          <slot name="input"></slot>
          <div id="clearButton" part="clear-button" slot="suffix" aria-hidden="true"></div>
          <div id="toggleButton" part="toggle-button" slot="suffix" aria-hidden="true"></div>
        </vaadin-input-container>

        <div part="helper-text">
          <slot name="helper"></slot>
        </div>

        <div part="error-message">
          <slot name="error-message"></slot>
        </div>
      </div>

      <vaadin-combo-box-overlay
        id="overlay"
        opened="[[_overlayOpened]]"
        loading$="[[loading]]"
        theme$="[[_theme]]"
        position-target="[[_positionTarget]]"
        no-vertical-overlap
        restore-focus-node="[[inputElement]]"
      ></vaadin-combo-box-overlay>

      <slot name="tooltip"></slot>
    `;
  }
  static get properties() {
    return {
      /**
       * @protected
       */
      _positionTarget: {
        type: Object
      }
    };
  }
  /**
   * Used by `InputControlMixin` as a reference to the clear button element.
   * @protected
   * @return {!HTMLElement}
   */
  get clearElement() {
    return this.$.clearButton;
  }
  /** @protected */
  ready() {
    super.ready(), this.addController(
      new It(this, (t) => {
        this._setInputElement(t), this._setFocusElement(t), this.stateTarget = t, this.ariaTarget = t;
      })
    ), this.addController(new Tt(this.inputElement, this._labelController)), this._tooltipController = new ue(this), this.addController(this._tooltipController), this._tooltipController.setPosition("top"), this._tooltipController.setShouldShow((t) => !t.opened), this._positionTarget = this.shadowRoot.querySelector('[part="input-field"]'), this._toggleElement = this.$.toggleButton;
  }
  /**
   * Override method inherited from `FocusMixin` to validate on blur.
   * @param {boolean} focused
   * @protected
   * @override
   */
  _setFocused(t) {
    super._setFocused(t), t || this.validate();
  }
  /**
   * Override method inherited from `FocusMixin` to not remove focused
   * state when focus moves to the overlay.
   * @param {FocusEvent} event
   * @return {boolean}
   * @protected
   * @override
   */
  _shouldRemoveFocus(t) {
    return t.relatedTarget === this._overlayElement ? (t.composedPath()[0].focus(), !1) : !0;
  }
  /**
   * Override the method from `InputControlMixin`
   * to stop event propagation to prevent `ComboBoxMixin`
   * from handling this click event also on its own.
   *
   * @param {Event} event
   * @protected
   * @override
   */
  _onClearButtonClick(t) {
    t.stopPropagation(), super._onClearButtonClick(t);
  }
  /**
   * @param {Event} event
   * @protected
   */
  _onHostClick(t) {
    const e = t.composedPath();
    (e.includes(this._labelNode) || e.includes(this._positionTarget)) && super._onHostClick(t);
  }
}
customElements.define(vs.is, vs);
const Xh = `.col-bg-body-lighter{background-color:var(--ui-col-bg-body-lighter, var(--col-bg-body-lighter))}.col-bg-body{background-color:var(--ui-col-bg-body, var(--col-bg-body))}.col-bg-body-darker{background-color:var(--ui-col-bg-body-darker, var(--col-bg-body-darker))}.col-bg-1-lighter{background-color:var(--ui-col-bg-1-lighter, var(--col-bg-1-lighter))}.col-bg-1{background-color:var(--ui-col-bg-1, var(--ui-col-bg-1, var(--col-bg-1)))}.col-bg-1-darker{background-color:var(--ui-col-bg-1-darker, var(--col-bg-1-darker))}.col-bg-1-input{background-color:var(--ui-col-bg-1-input, var(--col-bg-1-input))}.col-primary-bg-1{background-color:var(--ui-col-primary-bg-1, var(--col-primary-bg-1))}.col-accent-bg-1{background-color:var(--ui-col-accent-bg-1, var(--col-accent-bg-1))}.col-success-bg-1{background-color:var(--ui-col-success-bg-1, var(--col-success-bg-1))}.col-warning-bg-1{background-color:var(--ui-col-warning-bg-1, var(--col-warning-bg-1))}.col-error-bg-1{background-color:var(--ui-col-error-bg-1, var(--col-error-bg-1))}.col-bg-2-lighter{background-color:var(--ui-col-bg-2-lighter, var(--col-bg-2-lighter))}.col-bg-2{background-color:var(--ui-col-bg-2, var(--col-bg-2))}.col-bg-2-darker{background-color:var(--ui-col-bg-2-darker, var(--col-bg-2-darker))}.col-bg-2-button{background-color:var(--ui-col-bg-2-button, var(--col-bg-2-button))}.col-bg-2-input{background-color:var(--ui-col-bg-2-input, var(--col-bg-2-input))}.col-primary-bg-2{background-color:var(--ui-col-primary-bg-2, var(--col-primary-bg-2))}.col-accent-bg-2{background-color:var(--ui-col-accent-bg-2, var(--col-accent-bg-2))}.col-success-bg-2{background-color:var(--ui-col-success-bg-2, var(--col-success-bg-2))}.col-warning-bg-2{background-color:var(--ui-col-warning-bg-2, var(--col-warning-bg-2))}.col-error-bg-2{background-color:var(--ui-col-error-bg-2, var(--col-error-bg-2))}.col-bg-3-lighter{background-color:var(--ui-col-bg-3-lighter, var(--col-bg-3-lighter))}.col-bg-3{background-color:var(--ui-col-bg-3, var(--col-bg-3))}.col-bg-3-darker{background-color:var(--ui-col-bg-3-darker, var(--col-bg-3-darker))}.col-bg-3-button{background-color:var(--ui-col-bg-3-button, var(--col-bg-3-button))}.col-bg-3-input{background-color:var(--ui-col-bg-3-input, var(--col-bg-3-input))}.col-primary-bg-3{background-color:var(--ui-col-primary-bg-3, var(--col-primary-bg-3))}.col-accent-bg-3{background-color:var(--ui-col-accent-bg-3, var(--col-accent-bg-3))}.col-success-bg-3{background-color:var(--ui-col-success-bg-3, var(--col-success-bg-3))}.col-warning-bg-3{background-color:var(--ui-col-warning-bg-3, var(--col-warning-bg-3))}.col-error-bg-3{background-color:var(--ui-col-error-bg-3, var(--col-error-bg-3))}.col-bg-ack-lighter{background-color:var(--ui-col-bg-ack-lighter, var(--col-bg-ack-lighter))}.col-bg-ack{background-color:var(--ui-col-bg-ack, var(--col-bg-ack))}.col-bg-ack-darker{background-color:var(--ui-col-bg-ack-darker, var(--col-bg-ack-darker))}.col-primary-bg-ack{background-color:var(--ui-col-primary-bg-ack, var(--col-primary-bg-ack))}.col-accent-bg-ack{background-color:var(--ui-col-accent-bg-ack, var(--col-accent-bg-ack))}.col-bg-att-lighter{background-color:var(--ui-col-bg-att-lighter, var(--col-bg-att-lighter))}.col-bg-att{background-color:var(--ui-col-bg-att, var(--col-bg-att))}.col-bg-att-darker{background-color:var(--ui-col-bg-att-darker, var(--col-bg-att-darker))}.col-primary-bg-att{background-color:var(--ui-col-primary-bg-att, var(--col-primary-bg-att))}.col-accent-bg-att{background-color:var(--ui-col-accent-bg-att, var(--col-accent-bg-att))}.col-bg-alert-lighter{background-color:var(--ui-col-bg-alert-lighter, var(--col-bg-alert-lighter))}.col-bg-alert{background-color:var(--ui-col-bg-alert, var(--col-bg-alert))}.col-bg-alert-darker{background-color:var(--ui-col-bg-alert-darker, var(--col-bg-alert-darker))}.col-primary-bg-alert{background-color:var(--ui-col-primary-bg-alert, var(--col-primary-bg-alert))}.col-accent-bg-alert{background-color:var(--ui-col-accent-bg-alert, var(--col-accent-bg-alert))}.col-bg-btn-lighter{background-color:var(--ui-col-bg-btn-lighter, var(--col-bg-btn-lighter))}.col-bg-btn{background-color:var(--ui-col-bg-btn, var(--col-bg-btn))}.col-bg-btn-darker{background-color:var(--ui-col-bg-btn-darker, var(--col-bg-btn-darker))}.col-primary-bg-btn{background-color:var(--ui-col-primary-bg-btn, var(--col-primary-bg-btn))}.col-accent-bg-btn{background-color:var(--ui-col-accent-bg-btn, var(--col-accent-bg-btn))}.pattern-diagonal-stripes-sm{background:repeating-linear-gradient(45deg,transparent,transparent 10px,currentColor 10px,currentColor 20px)}.pattern-dots-lg{background-image:radial-gradient(currentColor 1.5px,transparent 1.5px);background-size:15px 15px}.pattern-dots-md{background-image:radial-gradient(currentColor 1px,transparent 1px);background-size:8px 8px}.pattern-dots-medium-dense{background-image:radial-gradient(currentColor .5px,transparent .5px);background-size:3px 3px}.pattern-dots-sm{background-image:radial-gradient(currentColor .5px,transparent .5px);background-size:5px 5px}.pattern-cross-dots-md,.imagelist-background{background-image:radial-gradient(currentColor .7px,transparent 1px),radial-gradient(currentColor .7px,transparent 1px);background-size:6.5px 6.5px;background-position:0 0,3.5px 3.5px}.imagelist-background{background-color:#fff9;background-blend-mode:overlay}:host{box-sizing:border-box;background-color:var(--ui-col-bg-1, var(--ui-col-bg-1, var(--col-bg-1)))}*:not(textarea){-webkit-touch-callout:none;-webkit-user-select:none;-khtml-user-select:none;-moz-user-select:none;-ms-user-select:none;user-select:none}html{font-family:var(--ui-standard-text-font, var(--standard-text-font));font-size:var(--ui-font-size-standard, var(--font-size-standard, 1rem));line-height:var(--ui-line-height-std, var(--line-height-std, 1.5em))}body{height:100%;width:100%}body a{text-decoration:none}label{font-family:var(--ui-monospace-font, var(--monospace-font));font-size:.9em}input,select{-webkit-user-select:text;-moz-user-select:text;-ms-user-select:text;box-sizing:border-box;border-radius:0;user-select:text;font-family:var(--ui-standard-text-font, var(--standard-text-font));background-color:var(--ui-col-bg-1-input, var(--col-bg-1-input));border:none;height:30px;color:var(--ui-col-primary-bg-1, var(--col-primary-bg-1));padding:4px}input:focus,select:focus{outline:none}input:focus,select:focus{border-bottom:2px solid rgb(0,0,0)}h1{font-size:var(--ui-font-size-h1, var(--font-size-h1))}h2{font-size:var(--ui-font-size-h2, var(--font-size-h2))}h3{font-size:var(--ui-font-size-h3, var(--font-size-h3))}h4{font-size:var(--ui-font-size-h4, var(--font-size-h4))}small,.font-small{font-size:var(--ui-font-size-small, var(--font-size-small))}button{width:var(--ui-button-width, 60px);height:var(--ui-button-height, 60px);border-radius:calc(var(--ui-button-height, 60px) / 2);border-style:solid;border-width:2px;background-color:var(--ui-col-bg-btn, var(--col-bg-btn));color:var(--ui-col-primary-bg-btn, var(--col-primary-bg-btn));border-color:var(--ui-col-bg-btn-darker, var(--col-bg-btn-darker));font-family:var(--ui-headline-text-font, var(--headline-text-font));font-size:var(--ui-font-size-h4, var(--font-size-h4));font-weight:700}button:hover,button:focus{outline:none;background-color:var(--ui-col-bg-btn-lighter, var(--col-bg-btn-lighter))}button:active{padding-top:3px;color:var(--ui-col-primary-bg-btn, var(--col-primary-bg-btn));background-color:var(--ui-col-bg-btn-darker, var(--col-bg-btn-darker));border-color:var(--ui-col-bg-btn-darker, var(--col-bg-btn-darker))}button:disabled{opacity:.3}.modal-round-button,.modal-delete,.modal-close,.modal-cancel,.modal-back,.modal-next,.modal-ok,.modal-button{box-sizing:border-box;margin-left:25px;background-image:none;display:inline-block;font-style:normal;font-variant:normal;text-rendering:auto;-webkit-font-smoothing:antialiased;font-family:"Font Awesome 5 Free";font-weight:900;font-size:var(--ui-button-font-size, 24px);line-height:var(--ui-button-font-size, 24px);vertical-align:center;text-align:center}.modal-ok:after{content:var(--icon-bt-ok)}.modal-next:after{padding-left:2px;content:var(--icon-bt-next)}.modal-back:after{padding-right:2px;content:var(--icon-bt-back)}.modal-cancel:after{content:var(--icon-bt-cancel)}.modal-close:before{content:var(--icon-bt-close)}.modal-delete{background-color:var(--ui-col-bg-alert, var(--col-bg-alert));color:var(--ui-col-primary-bg-alert, var(--col-primary-bg-alert))}.modal-delete:before{content:var(--icon-bt-trash)}.modal-delete:hover,.modal-delete:focus{border-color:var(--ui-col-bg-alert, var(--col-bg-alert));background-color:var(--ui-col-bg-alert-lighter, var(--col-bg-alert-lighter));background-size:75%}.modal-delete:active{border-color:var(--ui-col-bg-alert, var(--col-bg-alert));background-color:var(--ui-col-bg-alert-darker, var(--col-bg-alert-darker));color:var(--ui-col-primary-bg-alert, var(--col-primary-bg-alert))}:host{--lumo-contrast-10pct: rgba(0,0,0,0);--lumo-contrast-60pct: var(--col-accent-bg-1);--lumo-text-field-size: 1em;--lumo-font-size: var(--font-size-standard);--lumo-font-family: var(--standard-text-font)}input{font-size:var(--ui-font-size-standard, var(--font-size-standard, 1rem))}.ui-layout,.ui-right-align-layout,.ui-stack-layout,.ui-column-layout{background-color:var(--ui-col-bg-1, var(--ui-col-bg-1, var(--col-bg-1)))}.ui-column-layout{display:grid;grid-template-columns:repeat(auto-fill,200px)}.ui-stack-layout{display:flex;flex-direction:column}.ui-right-align-layout{display:flex;flex-direction:row;justify-content:end}.ui-line{width:100%;height:1px;margin-top:1em;margin-bottom:1em;border-top:solid 1px var(--ui-col-accent-bg-1, var(--col-accent-bg-1))}.element-wrapper{padding:5px}.element-wrapper.new-line{grid-column-start:1}.templateLabel{height:30px;line-height:30px;vertical-align:middle}.light-background{background-color:var(--ui-col-bg-1-lighter, var(--col-bg-1-lighter))}.text-field-div,.combobox-div{display:flex;font-family:var(--ui-standard-text-font, var(--standard-text-font));font-size:var(--ui-font-size-standard, var(--font-size-standard, 1rem));flex-direction:column;margin-left:.5em;margin-bottom:.5em}.combobox-div{margin-bottom:0}vaadin-date-picker{padding:0}vaadin-date-picker,vaadin-time-picker,vaadin-combo-box{margin-left:calc(-1 * (.375em + var(--lumo-border-radius-m) / 4 - 1px));margin-right:calc(-1 * (.375em + var(--lumo-border-radius-m) / 4 - 1px));padding-top:0}vaadin-date-picker>input,vaadin-time-picker>input,vaadin-combo-box>input{--_lumo-text-field-overflow-mask-image: white;--lumo-text-field-size: 22px;background-color:#fff;max-height:30px}
`;
function et(o, t) {
  if (!o)
    return "";
  const e = new RegExp(String.raw`\$\{(.*?)\}`, "g");
  let i = o;
  return i = i.replace(e, (r, s) => {
    try {
      let n = t[s];
      if (n)
        return n;
    } catch {
    }
    return "";
  }), i;
}
class Xr {
  constructor(t) {
    this.layoutSettings = t;
  }
}
class ys extends Xr {
  constructor() {
    super(...arguments), this.cssClass = "ui-column-layout";
  }
  renderLayoutStyles(t) {
    const e = t == null ? void 0 : t.min_width;
    let i = "";
    return e && (e === "max" ? i = "grid-column: 1 / -1;" : i = `grid-column-end: span ${e}`), i;
  }
}
class Jh extends Xr {
  constructor() {
    super(...arguments), this.cssClass = "ui-stack-layout";
  }
  renderLayoutStyles(t) {
    const e = t == null ? void 0 : t.min_width;
    let i = "";
    return e && (e === "max" ? i = "width: 100%" : i = `width: ${e * 100}px`), i;
  }
}
class eu extends Xr {
  constructor() {
    super(...arguments), this.cssClass = "ui-right-align-layout";
  }
  renderLayoutStyles() {
    return "";
  }
}
var tu = Object.defineProperty, iu = Object.getOwnPropertyDescriptor, Dt = (o, t, e, i) => {
  for (var r = i > 1 ? void 0 : i ? iu(t, e) : t, s = o.length - 1, n; s >= 0; s--)
    (n = o[s]) && (r = (i ? n(t, e, r) : n(r)) || r);
  return i && r && tu(t, e, r), r;
};
let Ae = class extends ne {
  constructor() {
    super(), this._messages = {}, this._dsd_to_element_list = {}, this._element_list = {}, this._selection_data = {}, this.uiSchema = null, this.data = {}, this.lookupProvider = null, this._showError = null, this._messages = {};
  }
  willUpdate(o) {
    o.has("uiSchema") && this.processSchemaDefinition();
  }
  firstUpdated(o) {
    super.firstUpdated(o);
    for (const t of this.renderRoot.querySelectorAll("vaadin-combo-box"))
      if (t && !t.items && this.lookupProvider) {
        let e = this.lookupProvider, i = this.getSchemaElement(t.id);
        if (i.element_type.name.toLowerCase() !== "selection")
          continue;
        const r = i.element_type;
        if (Array.isArray(r.items))
          continue;
        t.dataProvider = async (s, n) => {
          if (!(t.id in this._selection_data))
            e(
              t.id,
              r.items,
              s,
              (a, l) => {
                const d = [];
                this._selection_data[t.id] = {};
                for (const c of a)
                  this._selection_data[t.id][c[1]] = c[0], d.push(c[1]);
                n(d, l);
              }
            );
          else {
            const a = Object.entries(this._selection_data[t.id]).map((l) => l[0]).filter((l) => l.startsWith(s.filter));
            n(a, a.length);
          }
        };
      }
  }
  updated(o) {
    super.updated(o);
  }
  getSchemaElement(o) {
    return this._element_list[o];
  }
  processSchemaDefinition() {
    function o(s) {
      s && Object.entries(s).map(([n, a]) => {
        var l, d;
        const c = new RegExp("^[a-z][a-z0-9\\-_]*$", "gmi");
        if (!n.match(c)) {
          e = `There is an error in the schema definition: the element id "${n}" is illegal. It must start with a letter followed by only letters and numbers`;
          return;
        }
        if (n in t) {
          e = `There is an error in the schema definition: the element id "${n}" is used more than once in the UI schema`;
          return;
        }
        t.push(n);
        const h = (d = (l = a.binding) == null ? void 0 : l.field_name) == null ? void 0 : d.toLowerCase();
        h && (h in i ? e = `There is an error in the schema definition: dsd field "${h}" bound again in element "${n}" in UI schema` : i[h] = { id: n, element: a }), r[n] = a, a.element_type.name === "layout" && o(a.element_type.ui_elements);
      });
    }
    this._dsd_to_element_list = {};
    const t = [];
    let e = "";
    const i = this._dsd_to_element_list, r = this._element_list;
    this.uiSchema && o(this.uiSchema.ui_elements), this._showError = e;
  }
  gatherData() {
    const o = {};
    return !this._dsd_to_element_list || Object.keys(this._dsd_to_element_list).length === 0 ? {} : (Object.entries(this._dsd_to_element_list).map(([t, e]) => {
      o[t] = this.get_field_value(e.id, e.element);
    }), o);
  }
  get_field_value(o, t) {
    const e = this.renderRoot.querySelector(`#${o}`);
    switch (t.element_type.name.toLowerCase()) {
      case "selection":
        return this.getSelectionValue(o, e);
      default:
        return e != null && e.value ? e == null ? void 0 : e.value : "";
    }
  }
  getSelectionValue(o, t) {
    let e = t != null && t.value ? t == null ? void 0 : t.value : "", i = t == null ? void 0 : t.getAttribute("data-value");
    if (e && o in this._selection_data)
      try {
        i = this._selection_data[o][e];
      } catch {
      }
    return i || "";
  }
  fieldChanged(o) {
    if ("currentTarget" in o) {
      const t = {
        detail: {
          srcElement: o.currentTarget.id,
          newData: this.gatherData()
        },
        bubbles: !0
      };
      this.dispatchEvent(new CustomEvent("dataChanged", t));
    }
  }
  getLayoutClass(o) {
    if (o != null && o.orchestration_strategy)
      switch (o == null ? void 0 : o.orchestration_strategy.toLowerCase()) {
        case "columns":
          return new ys(o);
        case "rightalign":
          return new eu(o);
        case "stack":
          return new Jh(o);
        default:
          return null;
      }
    else
      return new ys(o);
  }
  renderTextField(o, t, e) {
    const i = et(t.element_type.value, this.data);
    return E`
            <div class="text-field-div" style="${e.renderLayoutStyles(t.layout)}">
                <label for="${o}">${t.element_type.text}</label> 
                <input id=${o} name=${o} type="text" 
                       value="${i || b}"
                       @change="${this.fieldChanged}"/>
            </div>
        `;
  }
  renderDateField(o, t, e) {
    const i = et(t.element_type.value, this.data);
    return E`
            <div class="text-field-div" style="${e.renderLayoutStyles(t.layout)}">
                <label for="${o}">${t.element_type.text}</label> 
                <vaadin-date-picker id=${o} name=${o}
                                    value="${i || b}"
                                    @change="${this.fieldChanged}"></vaadin-date-picker>
            </div>
        `;
  }
  renderDateTimeField(o, t, e) {
    const i = et(t.element_type.value, this.data);
    return E`
            <div class="text-field-div" style="${e.renderLayoutStyles(t.layout)}">
                <label for="${o}">${t.element_type.text}</label> 
                <vaadin-date-time-picker id=${o} name=${o}
                                         value="${i || b}"
                                         @change="${this.fieldChanged}"></vaadin-date-time-picker>
            </div>
        `;
  }
  renderButton(o, t) {
    const e = t.element_type;
    let i = "modal-button", r = "", s = e.extra_style ? e.extra_style : b;
    switch (e.type) {
      case "cancelButton":
        i = "modal-cancel";
        break;
      case "okButton":
        i = "modal-ok";
        break;
      case "iconButton":
        i = "modal-round-button", r = e.icon;
        break;
    }
    return E`
            <button class="${i}" style="${s}" id=${o} name=${o} @click="${this.fieldChanged}"">
                ${r} 
            </button>
        `;
  }
  renderComboBox(o, t, e) {
    const i = t.element_type;
    if (Array.isArray(i.items)) {
      const r = [];
      let s = "";
      for (const n of i.items) {
        const a = Array.isArray(n) ? n.length > 1 ? n[1] : n[0] : n, l = Array.isArray(n) ? n[0] : n;
        if (r.push(a), this.data[o] == l) {
          const d = {};
          d[o] = a, s = et(t.element_type.value, d);
        }
      }
      return E`
            <div class="combobox-div" style="${e.renderLayoutStyles(t.layout)}">
                <label for="${o}">${t.element_type.text}</label> 
                <vaadin-combo-box id="${o}" name="${o}" .items="${r}"
                                  .selectedItem="${s || b}"
                                  @change="${this.fieldChanged}"></vaadin-combo-box>
            </div>
            `;
    } else if (i.items && "topic" in i.items) {
      let r = "", s = "";
      const n = o in this.data ? this.data[o] : "";
      return Array.isArray(n) && n.length == 2 && (r = n[0], s = n[1]), E`
                    <div class="combobox-div" style="${e.renderLayoutStyles(t.layout)}">
                        <label for="${o}">${t.element_type.text}</label> 
                        <vaadin-combo-box id="${o}" name="${o}"
                                          .selectedItem="${r || b}"
                                          value="${r || b}"
                                          data-value="${s}"
                                          @change="${this.fieldChanged}"></vaadin-combo-box>
                    </div>
                `;
    } else
      return E`
            <div class="combobox-div" style="${e.renderLayoutStyles(t.layout)}">
                <label for="${o}">${t.element_type.text}</label> 
                <div>selection field ${o} is missing a list.</div>
            </div>`;
  }
  renderLine(o, t) {
    return E`
            <div class="ui-line" id="${o}" style="${this.getPaddingStyle(t.element_type.padding).replace("padding", "margin")}">
            </div>
        `;
  }
  renderTemplateLabel(o, t, e) {
    const i = t.element_type, r = et(t.element_type.value, this.data), s = i.style ? `templateLabel ${i.style}` : "templateLabel";
    return E`
            <div class="text-field-div" style="${e.renderLayoutStyles(t.layout)}">
                ${t.element_type.text ? E`<label for="${o}">${t.element_type.text}</label>` : b} 
                <div class="${s}" id=${o}>
                    ${r || b}
                </div>
            </div>
        `;
  }
  renderElement(o, t, e) {
    switch (t.element_type.name.toLowerCase()) {
      case "textfield":
        return this.renderTextField(o, t, e);
      case "templatelabel":
        return this.renderTemplateLabel(o, t, e);
      case "selection":
        return this.renderComboBox(o, t, e);
      case "datefield":
        return this.renderDateField(o, t, e);
      case "datetimefield":
        return this.renderDateTimeField(o, t, e);
      case "layout":
        return this.renderLayoutElement(o, t.element_type, e);
      case "button":
        return this.renderButton(o, t);
      case "line":
        return this.renderLine(o, t);
      default:
        return E`
                    ${o}: Unknown field type ${t.element_type.name}
                `;
    }
  }
  getPaddingStyle(o) {
    let t = "";
    return typeof o == "number" ? t = `padding: ${o}px` : typeof o == "string" ? t = `padding: ${o}` : o && (t = `padding: ${o.top} ${o.right} ${o.bottom} ${o.left}`), t;
  }
  renderLayoutElement(o, t, e) {
    var i;
    const r = this.getLayoutClass(t.layout_settings);
    if (!r)
      return E`Unknown Orchestration Strategy in element ${o}`;
    let s = e.renderLayoutStyles(t.layout);
    return s += s ? ";" : "" + this.getPaddingStyle((i = t.layout) == null ? void 0 : i.padding), this.renderLayout(t, r, s);
  }
  renderLayout(o, t, e = "") {
    return E`
            <div class="${t.cssClass}" style="${e}">
                ${Object.entries(o.ui_elements).map(([i, r]) => this.renderElement(i, r, t))}
            </div>
        `;
  }
  render() {
    var o, t, e;
    const i = this.getLayoutClass((o = this.uiSchema) == null ? void 0 : o.layout_settings);
    return i || (this._showError = `The schema definition is calling an unknown Orchestration Strategy "${(e = (t = this.uiSchema) == null ? void 0 : t.layout_settings) == null ? void 0 : e.orchestration_strategy}"`), this._showError ? E`<div style="background-color: var(--col-bg-alert); color: var(--col-primary-bg-alert); padding: .5em; font-family: monospace">${this._showError}</div>` : this.uiSchema && i ? this.renderLayout(this.uiSchema, i) : E``;
  }
};
Ae.styles = We(Xh);
Dt([
  C()
], Ae.prototype, "uiSchema", 2);
Dt([
  C()
], Ae.prototype, "data", 2);
Dt([
  C()
], Ae.prototype, "lookupProvider", 2);
Dt([
  R()
], Ae.prototype, "_showError", 2);
Ae = Dt([
  ee("ui-component")
], Ae);
m(
  "vaadin-checkbox",
  _`
    :host {
      color: var(--lumo-body-text-color);
      font-size: var(--lumo-font-size-m);
      font-family: var(--lumo-font-family);
      line-height: var(--lumo-line-height-s);
      -webkit-font-smoothing: antialiased;
      -moz-osx-font-smoothing: grayscale;
      -webkit-tap-highlight-color: transparent;
      -webkit-user-select: none;
      -moz-user-select: none;
      user-select: none;
      cursor: default;
      outline: none;
      --_checkbox-size: var(--vaadin-checkbox-size, calc(var(--lumo-size-m) / 2));
    }

    :host([has-label]) ::slotted(label) {
      padding-block: var(--lumo-space-xs);
      padding-inline: var(--lumo-space-xs) var(--lumo-space-s);
    }

    [part='checkbox'] {
      width: var(--_checkbox-size);
      height: var(--_checkbox-size);
      margin: var(--lumo-space-xs);
      position: relative;
      border-radius: var(--lumo-border-radius-s);
      background-color: var(--lumo-contrast-20pct);
      transition: transform 0.2s cubic-bezier(0.12, 0.32, 0.54, 2), background-color 0.15s;
      cursor: var(--lumo-clickable-cursor);
      /* Default field border color */
      --_input-border-color: var(--vaadin-input-field-border-color, var(--lumo-contrast-50pct));
    }

    :host([indeterminate]),
    :host([checked]) {
      --vaadin-input-field-border-color: transparent;
    }

    :host([indeterminate]) [part='checkbox'],
    :host([checked]) [part='checkbox'] {
      background-color: var(--lumo-primary-color);
    }

    /* Checkmark */
    [part='checkbox']::after {
      pointer-events: none;
      font-family: 'lumo-icons';
      content: var(--lumo-icons-checkmark);
      color: var(--lumo-primary-contrast-color);
      font-size: calc(var(--_checkbox-size) + 2px);
      line-height: 1;
      position: absolute;
      top: -1px;
      left: -1px;
      contain: content;
      opacity: 0;
    }

    :host([checked]) [part='checkbox']::after {
      opacity: 1;
    }

    /* Indeterminate checkmark */
    :host([indeterminate]) [part='checkbox']::after {
      content: '';
      opacity: 1;
      top: 45%;
      height: 10%;
      left: 22%;
      right: 22%;
      width: auto;
      border: 0;
      background-color: var(--lumo-primary-contrast-color);
    }

    /* Focus ring */
    :host([focus-ring]) [part='checkbox'] {
      box-shadow: 0 0 0 1px var(--lumo-base-color), 0 0 0 3px var(--lumo-primary-color-50pct),
        inset 0 0 0 var(--_input-border-width, 0) var(--_input-border-color);
    }

    /* Disabled */
    :host([disabled]) {
      pointer-events: none;
      color: var(--lumo-disabled-text-color);
      --vaadin-input-field-border-color: var(--lumo-contrast-20pct);
    }

    :host([disabled]) ::slotted(label) {
      color: inherit;
    }

    :host([disabled]) [part='checkbox'] {
      background-color: var(--lumo-contrast-10pct);
    }

    :host([disabled]) [part='checkbox']::after {
      color: var(--lumo-contrast-30pct);
    }

    :host([indeterminate][disabled]) [part='checkbox']::after {
      background-color: var(--lumo-contrast-30pct);
    }

    /* RTL specific styles */
    :host([dir='rtl'][has-label]) ::slotted(label) {
      padding: var(--lumo-space-xs) var(--lumo-space-xs) var(--lumo-space-xs) var(--lumo-space-s);
    }

    /* Used for activation "halo" */
    [part='checkbox']::before {
      pointer-events: none;
      color: transparent;
      width: 100%;
      height: 100%;
      line-height: var(--_checkbox-size);
      border-radius: inherit;
      background-color: inherit;
      transform: scale(1.4);
      opacity: 0;
      transition: transform 0.1s, opacity 0.8s;
    }

    /* Hover */
    :host(:not([checked]):not([indeterminate]):not([disabled]):hover) [part='checkbox'] {
      background-color: var(--lumo-contrast-30pct);
    }

    /* Disable hover for touch devices */
    @media (pointer: coarse) {
      :host(:not([checked]):not([indeterminate]):not([disabled]):hover) [part='checkbox'] {
        background-color: var(--lumo-contrast-20pct);
      }
    }

    /* Active */
    :host([active]) [part='checkbox'] {
      transform: scale(0.9);
      transition-duration: 0.05s;
    }

    :host([active][checked]) [part='checkbox'] {
      transform: scale(1.1);
    }

    :host([active]:not([checked])) [part='checkbox']::before {
      transition-duration: 0.01s, 0.01s;
      transform: scale(0);
      opacity: 0.4;
    }
  `,
  { moduleId: "lumo-checkbox" }
);
/**
 * @license
 * Copyright (c) 2021 - 2023 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
const ru = I(
  (o) => class extends ca(kt(_i(o))) {
    static get properties() {
      return {
        /**
         * True if the element is checked.
         * @type {boolean}
         */
        checked: {
          type: Boolean,
          value: !1,
          notify: !0,
          reflectToAttribute: !0
        }
      };
    }
    static get delegateProps() {
      return [...super.delegateProps, "checked"];
    }
    /**
     * @param {Event} event
     * @protected
     * @override
     */
    _onChange(e) {
      const i = e.target;
      this._toggleChecked(i.checked), zr(i) || i.focus();
    }
    /** @protected */
    _toggleChecked(e) {
      this.checked = e;
    }
  }
);
/**
 * @license
 * Copyright (c) 2017 - 2023 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
const ou = (o) => class extends aa(ru(jr(Yn(o)))) {
  static get properties() {
    return {
      /**
       * True if the checkbox is in the indeterminate state which means
       * it is not possible to say whether it is checked or unchecked.
       * The state is reset once the user switches the checkbox by hand.
       *
       * https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input/checkbox#Indeterminate_state_checkboxes
       *
       * @type {boolean}
       */
      indeterminate: {
        type: Boolean,
        notify: !0,
        value: !1,
        reflectToAttribute: !0
      },
      /**
       * The name of the checkbox.
       *
       * @type {string}
       */
      name: {
        type: String,
        value: ""
      }
    };
  }
  /** @override */
  static get delegateProps() {
    return [...super.delegateProps, "indeterminate"];
  }
  /** @override */
  static get delegateAttrs() {
    return [...super.delegateAttrs, "name"];
  }
  constructor() {
    super(), this._setType("checkbox"), this.value = "on";
  }
  /** @protected */
  ready() {
    super.ready(), this.addController(
      new It(this, (e) => {
        this._setInputElement(e), this._setFocusElement(e), this.stateTarget = e, this.ariaTarget = e;
      })
    ), this.addController(new Tt(this.inputElement, this._labelController));
  }
  /**
   * Override method inherited from `ActiveMixin` to prevent setting
   * `active` attribute when clicking a link placed inside the label.
   *
   * @param {Event} event
   * @return {boolean}
   * @protected
   * @override
   */
  _shouldSetActive(e) {
    return e.target.localName === "a" ? !1 : super._shouldSetActive(e);
  }
  /**
   * Override method inherited from `CheckedMixin` to reset
   * `indeterminate` state checkbox is toggled by the user.
   *
   * @param {boolean} checked
   * @protected
   * @override
   */
  _toggleChecked(e) {
    this.indeterminate && (this.indeterminate = !1), super._toggleChecked(e);
  }
};
/**
 * @license
 * Copyright (c) 2017 - 2023 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
const su = _`
  :host {
    display: inline-block;
  }

  :host([hidden]) {
    display: none !important;
  }

  :host([disabled]) {
    -webkit-tap-highlight-color: transparent;
  }

  .vaadin-checkbox-container {
    display: grid;
    grid-template-columns: auto 1fr;
    align-items: baseline;
  }

  [part='checkbox'],
  ::slotted(input),
  ::slotted(label) {
    grid-row: 1;
  }

  [part='checkbox'],
  ::slotted(input) {
    grid-column: 1;
  }

  [part='checkbox'] {
    width: var(--vaadin-checkbox-size, 1em);
    height: var(--vaadin-checkbox-size, 1em);
    --_input-border-width: var(--vaadin-input-field-border-width, 0);
    --_input-border-color: var(--vaadin-input-field-border-color, transparent);
    box-shadow: inset 0 0 0 var(--_input-border-width, 0) var(--_input-border-color);
  }

  [part='checkbox']::before {
    display: block;
    content: '\\202F';
    line-height: var(--vaadin-checkbox-size, 1em);
    contain: paint;
  }

  /* visually hidden */
  ::slotted(input) {
    opacity: 0;
    cursor: inherit;
    margin: 0;
    align-self: stretch;
    -webkit-appearance: none;
  }

  @media (forced-colors: active) {
    [part='checkbox'] {
      outline: 1px solid;
      outline-offset: -1px;
    }

    :host([disabled]) [part='checkbox'],
    :host([disabled]) [part='checkbox']::after {
      outline-color: GrayText;
    }

    :host(:is([checked], [indeterminate])) [part='checkbox']::after {
      outline: 1px solid;
      outline-offset: -1px;
      border-radius: inherit;
    }

    :host([focused]) [part='checkbox'],
    :host([focused]) [part='checkbox']::after {
      outline-width: 2px;
    }
  }
`;
/**
 * @license
 * Copyright (c) 2017 - 2023 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
m("vaadin-checkbox", su, { moduleId: "vaadin-checkbox-styles" });
class Cs extends ou(he(O(A))) {
  static get is() {
    return "vaadin-checkbox";
  }
  static get template() {
    return k`
      <div class="vaadin-checkbox-container">
        <div part="checkbox" aria-hidden="true"></div>
        <slot name="input"></slot>
        <slot name="label"></slot>
      </div>
      <slot name="tooltip"></slot>
    `;
  }
  /** @protected */
  ready() {
    super.ready(), this._tooltipController = new ue(this), this.addController(this._tooltipController);
  }
}
customElements.define(Cs.is, Cs);
m(
  "vaadin-grid",
  _`
    :host {
      font-family: var(--lumo-font-family);
      font-size: var(--lumo-font-size-m);
      line-height: var(--lumo-line-height-s);
      color: var(--lumo-body-text-color);
      background-color: var(--lumo-base-color);
      box-sizing: border-box;
      -webkit-text-size-adjust: 100%;
      -webkit-tap-highlight-color: transparent;
      -webkit-font-smoothing: antialiased;
      -moz-osx-font-smoothing: grayscale;

      /* For internal use only */
      --_lumo-grid-border-color: var(--lumo-contrast-20pct);
      --_lumo-grid-secondary-border-color: var(--lumo-contrast-10pct);
      --_lumo-grid-border-width: 1px;
      --_lumo-grid-selected-row-color: var(--lumo-primary-color-10pct);
    }

    /* No (outer) border */

    :host(:not([theme~='no-border'])) {
      border: var(--_lumo-grid-border-width) solid var(--_lumo-grid-border-color);
    }

    :host([disabled]) {
      opacity: 0.7;
    }

    /* Cell styles */

    [part~='cell'] {
      min-height: var(--lumo-size-m);
      background-color: var(--lumo-base-color);
    }

    [part~='cell'] ::slotted(vaadin-grid-cell-content) {
      cursor: default;
      padding: var(--lumo-space-xs) var(--lumo-space-m);
    }

    /* Apply row borders by default and introduce the "no-row-borders" variant */
    :host(:not([theme~='no-row-borders'])) [part~='cell']:not([part~='details-cell']) {
      border-top: var(--_lumo-grid-border-width) solid var(--_lumo-grid-secondary-border-color);
    }

    /* Hide first body row top border */
    :host(:not([theme~='no-row-borders'])) [part~='first-row'] [part~='cell']:not([part~='details-cell']) {
      border-top: 0;
      min-height: calc(var(--lumo-size-m) - var(--_lumo-grid-border-width));
    }

    /* Focus-ring */

    [part~='row'] {
      position: relative;
    }

    [part~='row']:focus,
    [part~='focused-cell']:focus {
      outline: none;
    }

    :host([navigating]) [part~='row']:focus::before,
    :host([navigating]) [part~='focused-cell']:focus::before {
      content: '';
      position: absolute;
      top: 0;
      right: 0;
      bottom: 0;
      left: 0;
      pointer-events: none;
      box-shadow: inset 0 0 0 2px var(--lumo-primary-color-50pct);
    }

    :host([navigating]) [part~='row']:focus::before {
      transform: translateX(calc(-1 * var(--_grid-horizontal-scroll-position)));
      z-index: 3;
    }

    /* Drag and Drop styles */
    :host([dragover])::after {
      content: '';
      position: absolute;
      z-index: 100;
      top: 0;
      right: 0;
      bottom: 0;
      left: 0;
      pointer-events: none;
      box-shadow: inset 0 0 0 2px var(--lumo-primary-color-50pct);
    }

    [part~='row'][dragover] {
      z-index: 100 !important;
    }

    [part~='row'][dragover] [part~='cell'] {
      overflow: visible;
    }

    [part~='row'][dragover] [part~='cell']::after {
      content: '';
      position: absolute;
      top: 0;
      right: 0;
      bottom: 0;
      left: 0;
      height: calc(var(--_lumo-grid-border-width) + 2px);
      pointer-events: none;
      background: var(--lumo-primary-color-50pct);
    }

    [part~='row'][dragover] [part~='cell'][last-frozen]::after {
      right: -1px;
    }

    :host([theme~='no-row-borders']) [dragover] [part~='cell']::after {
      height: 2px;
    }

    [part~='row'][dragover='below'] [part~='cell']::after {
      top: 100%;
      bottom: auto;
      margin-top: -1px;
    }

    :host([all-rows-visible]) [part~='last-row'][dragover='below'] [part~='cell']::after {
      height: 1px;
    }

    [part~='row'][dragover='above'] [part~='cell']::after {
      top: auto;
      bottom: 100%;
      margin-bottom: -1px;
    }

    [part~='row'][details-opened][dragover='below'] [part~='cell']:not([part~='details-cell'])::after,
    [part~='row'][details-opened][dragover='above'] [part~='details-cell']::after {
      display: none;
    }

    [part~='row'][dragover][dragover='on-top'] [part~='cell']::after {
      height: 100%;
      opacity: 0.5;
    }

    [part~='row'][dragstart] [part~='cell'] {
      border: none !important;
      box-shadow: none !important;
    }

    [part~='row'][dragstart] [part~='cell'][last-column] {
      border-radius: 0 var(--lumo-border-radius-s) var(--lumo-border-radius-s) 0;
    }

    [part~='row'][dragstart] [part~='cell'][first-column] {
      border-radius: var(--lumo-border-radius-s) 0 0 var(--lumo-border-radius-s);
    }

    #scroller [part~='row'][dragstart]:not([dragstart=''])::after {
      display: block;
      position: absolute;
      left: var(--_grid-drag-start-x);
      top: var(--_grid-drag-start-y);
      z-index: 100;
      content: attr(dragstart);
      align-items: center;
      justify-content: center;
      box-sizing: border-box;
      padding: calc(var(--lumo-space-xs) * 0.8);
      color: var(--lumo-error-contrast-color);
      background-color: var(--lumo-error-color);
      border-radius: var(--lumo-border-radius-m);
      font-family: var(--lumo-font-family);
      font-size: var(--lumo-font-size-xxs);
      line-height: 1;
      font-weight: 500;
      text-transform: initial;
      letter-spacing: initial;
      min-width: calc(var(--lumo-size-s) * 0.7);
      text-align: center;
    }

    /* Headers and footers */

    [part~='header-cell'] ::slotted(vaadin-grid-cell-content),
    [part~='footer-cell'] ::slotted(vaadin-grid-cell-content),
    [part~='reorder-ghost'] {
      font-size: var(--lumo-font-size-s);
      font-weight: 500;
    }

    [part~='footer-cell'] ::slotted(vaadin-grid-cell-content) {
      font-weight: 400;
    }

    [part~='row']:only-child [part~='header-cell'] {
      min-height: var(--lumo-size-xl);
    }

    /* Header borders */

    /* Hide first header row top border */
    :host(:not([theme~='no-row-borders'])) [part~='row']:first-child [part~='header-cell'] {
      border-top: 0;
    }

    [part~='row']:last-child [part~='header-cell'] {
      border-bottom: var(--_lumo-grid-border-width) solid transparent;
    }

    :host(:not([theme~='no-row-borders'])) [part~='row']:last-child [part~='header-cell'] {
      border-bottom-color: var(--_lumo-grid-secondary-border-color);
    }

    /* Overflow uses a stronger border color */
    :host([overflow~='top']) [part~='row']:last-child [part~='header-cell'] {
      border-bottom-color: var(--_lumo-grid-border-color);
    }

    /* Footer borders */

    [part~='row']:first-child [part~='footer-cell'] {
      border-top: var(--_lumo-grid-border-width) solid transparent;
    }

    :host(:not([theme~='no-row-borders'])) [part~='row']:first-child [part~='footer-cell'] {
      border-top-color: var(--_lumo-grid-secondary-border-color);
    }

    /* Overflow uses a stronger border color */
    :host([overflow~='bottom']) [part~='row']:first-child [part~='footer-cell'] {
      border-top-color: var(--_lumo-grid-border-color);
    }

    /* Column reordering */

    :host([reordering]) [part~='cell'] {
      background: linear-gradient(var(--lumo-shade-20pct), var(--lumo-shade-20pct)) var(--lumo-base-color);
    }

    :host([reordering]) [part~='cell'][reorder-status='allowed'] {
      background: var(--lumo-base-color);
    }

    :host([reordering]) [part~='cell'][reorder-status='dragging'] {
      background: linear-gradient(var(--lumo-contrast-5pct), var(--lumo-contrast-5pct)) var(--lumo-base-color);
    }

    [part~='reorder-ghost'] {
      opacity: 0.85;
      box-shadow: var(--lumo-box-shadow-s);
      /* TODO Use the same styles as for the cell element (reorder-ghost copies styles from the cell element) */
      padding: var(--lumo-space-s) var(--lumo-space-m) !important;
    }

    /* Column resizing */

    [part='resize-handle'] {
      width: 3px;
      background-color: var(--lumo-primary-color-50pct);
      opacity: 0;
      transition: opacity 0.2s;
    }

    :host(:not([reordering])) *:not([column-resizing]) [part~='cell']:hover [part='resize-handle'],
    [part='resize-handle']:active {
      opacity: 1;
      transition-delay: 0.15s;
    }

    /* Column borders */

    :host([theme~='column-borders']) [part~='cell']:not([last-column]):not([part~='details-cell']) {
      border-right: var(--_lumo-grid-border-width) solid var(--_lumo-grid-secondary-border-color);
    }

    /* Frozen columns */

    [last-frozen] {
      border-right: var(--_lumo-grid-border-width) solid transparent;
      overflow: hidden;
    }

    :host([overflow~='start']) [part~='cell'][last-frozen]:not([part~='details-cell']) {
      border-right-color: var(--_lumo-grid-border-color);
    }

    [first-frozen-to-end] {
      border-left: var(--_lumo-grid-border-width) solid transparent;
    }

    :host([overflow~='end']) [part~='cell'][first-frozen-to-end]:not([part~='details-cell']) {
      border-left-color: var(--_lumo-grid-border-color);
    }

    /* Row stripes */

    :host([theme~='row-stripes']) [part~='even-row'] [part~='body-cell'],
    :host([theme~='row-stripes']) [part~='even-row'] [part~='details-cell'] {
      background-image: linear-gradient(var(--lumo-contrast-5pct), var(--lumo-contrast-5pct));
      background-repeat: repeat-x;
    }

    /* Selected row */

    /* Raise the selected rows above unselected rows (so that box-shadow can cover unselected rows) */
    :host(:not([reordering])) [part~='row'][selected] {
      z-index: 1;
    }

    :host(:not([reordering])) [part~='row'][selected] [part~='body-cell']:not([part~='details-cell']) {
      background-image: linear-gradient(var(--_lumo-grid-selected-row-color), var(--_lumo-grid-selected-row-color));
      background-repeat: repeat;
    }

    /* Cover the border of an unselected row */
    :host(:not([theme~='no-row-borders'])) [part~='row'][selected] [part~='cell']:not([part~='details-cell']) {
      box-shadow: 0 var(--_lumo-grid-border-width) 0 0 var(--_lumo-grid-selected-row-color);
    }

    /* Compact */

    :host([theme~='compact']) [part~='row']:only-child [part~='header-cell'] {
      min-height: var(--lumo-size-m);
    }

    :host([theme~='compact']) [part~='cell'] {
      min-height: var(--lumo-size-s);
    }

    :host([theme~='compact']) [part~='first-row'] [part~='cell']:not([part~='details-cell']) {
      min-height: calc(var(--lumo-size-s) - var(--_lumo-grid-border-width));
    }

    :host([theme~='compact']) [part~='cell'] ::slotted(vaadin-grid-cell-content) {
      padding: var(--lumo-space-xs) var(--lumo-space-s);
    }

    /* Wrap cell contents */

    :host([theme~='wrap-cell-content']) [part~='cell'] ::slotted(vaadin-grid-cell-content) {
      white-space: normal;
    }

    /* RTL specific styles */

    :host([dir='rtl']) [part~='row'][dragstart] [part~='cell'][last-column] {
      border-radius: var(--lumo-border-radius-s) 0 0 var(--lumo-border-radius-s);
    }

    :host([dir='rtl']) [part~='row'][dragstart] [part~='cell'][first-column] {
      border-radius: 0 var(--lumo-border-radius-s) var(--lumo-border-radius-s) 0;
    }

    :host([dir='rtl'][theme~='column-borders']) [part~='cell']:not([last-column]):not([part~='details-cell']) {
      border-right: none;
      border-left: var(--_lumo-grid-border-width) solid var(--_lumo-grid-secondary-border-color);
    }

    :host([dir='rtl']) [last-frozen] {
      border-right: none;
      border-left: var(--_lumo-grid-border-width) solid transparent;
    }

    :host([dir='rtl']) [first-frozen-to-end] {
      border-left: none;
      border-right: var(--_lumo-grid-border-width) solid transparent;
    }

    :host([dir='rtl'][overflow~='start']) [part~='cell'][last-frozen]:not([part~='details-cell']) {
      border-left-color: var(--_lumo-grid-border-color);
    }

    :host([dir='rtl'][overflow~='end']) [part~='cell'][first-frozen-to-end]:not([part~='details-cell']) {
      border-right-color: var(--_lumo-grid-border-color);
    }
  `,
  { moduleId: "lumo-grid" }
);
/**
 * @license
 * Copyright (c) 2016 - 2023 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
function Ct(o) {
  return Array.from(o.querySelectorAll('[part~="cell"]:not([part~="details-cell"])'));
}
function P(o, t) {
  [...o.children].forEach(t);
}
function ka(o, t, e) {
  let i = 1;
  o.forEach((r) => {
    i % 10 === 0 && (i += 1), r._order = e + i * t, i += 1;
  });
}
function mi(o, t, e) {
  switch (typeof e) {
    case "boolean":
      o.toggleAttribute(t, e);
      break;
    case "string":
      o.setAttribute(t, e);
      break;
    default:
      o.removeAttribute(t);
      break;
  }
}
function ce(o, t, e) {
  t || t === "" ? hi(o, "part", e) : Rr(o, "part", e);
}
function se(o, t, e) {
  o.forEach((i) => {
    ce(i, e, t);
  });
}
function lt(o, t) {
  const e = Ct(o);
  Object.entries(t).forEach(([i, r]) => {
    mi(o, i, r);
    const s = `${i}-row`;
    ce(o, r, s), se(e, `${s}-cell`, r);
  });
}
function xs(o, t) {
  const e = Ct(o);
  Object.entries(t).forEach(([i, r]) => {
    const s = o.getAttribute(i);
    if (mi(o, i, r), s) {
      const n = `${i}-${s}-row`;
      ce(o, !1, n), se(e, `${n}-cell`, !1);
    }
    if (r) {
      const n = `${i}-${r}-row`;
      ce(o, r, n), se(e, `${n}-cell`, r);
    }
  });
}
function me(o, t, e, i, r) {
  mi(o, t, e), r && ce(o, !1, r), ce(o, e, i || `${t}-cell`);
}
/**
 * @license
 * Copyright (c) 2016 - 2023 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
const Ea = (o) => class extends o {
  static get properties() {
    return {
      /**
       * When set to true, the column is user-resizable.
       * @default false
       */
      resizable: {
        type: Boolean,
        value() {
          if (this.localName === "vaadin-grid-column-group")
            return;
          const e = this.parentNode;
          return e && e.localName === "vaadin-grid-column-group" && e.resizable || !1;
        }
      },
      /**
       * When true, the column is frozen. When a column inside of a column group is frozen,
       * all of the sibling columns inside the group will get frozen also.
       * @type {boolean}
       */
      frozen: {
        type: Boolean,
        value: !1
      },
      /**
       * When true, the column is frozen to end of grid.
       *
       * When a column inside of a column group is frozen to end, all of the sibling columns
       * inside the group will get frozen to end also.
       *
       * Column can not be set as `frozen` and `frozenToEnd` at the same time.
       * @attr {boolean} frozen-to-end
       * @type {boolean}
       */
      frozenToEnd: {
        type: Boolean,
        value: !1
      },
      /**
       * When set to true, the cells for this column are hidden.
       */
      hidden: {
        type: Boolean,
        value: !1
      },
      /**
       * Text content to display in the header cell of the column.
       */
      header: {
        type: String
      },
      /**
       * Aligns the columns cell content horizontally.
       * Supported values: "start", "center" and "end".
       * @attr {start|center|end} text-align
       * @type {GridColumnTextAlign | null | undefined}
       */
      textAlign: {
        type: String
      },
      /**
       * @type {boolean}
       * @protected
       */
      _lastFrozen: {
        type: Boolean,
        value: !1
      },
      /**
       * @type {boolean}
       * @protected
       */
      _bodyContentHidden: {
        type: Boolean,
        value: !1
      },
      /**
       * @type {boolean}
       * @protected
       */
      _firstFrozenToEnd: {
        type: Boolean,
        value: !1
      },
      /** @protected */
      _order: Number,
      /** @private */
      _reorderStatus: Boolean,
      /**
       * @type {Array<!HTMLElement>}
       * @protected
       */
      _emptyCells: Array,
      /** @private */
      _headerCell: Object,
      /** @private */
      _footerCell: Object,
      /** @protected */
      _grid: Object,
      /**
       * By default, the Polymer doesn't invoke the observer
       * during initialization if all of its dependencies are `undefined`.
       * This internal property can be used to force initial invocation of an observer
       * even the other dependencies of the observer are `undefined`.
       *
       * @private
       */
      __initialized: {
        type: Boolean,
        value: !0
      },
      /**
       * Custom function for rendering the header content.
       * Receives two arguments:
       *
       * - `root` The header cell content DOM element. Append your content to it.
       * - `column` The `<vaadin-grid-column>` element.
       *
       * @type {GridHeaderFooterRenderer | null | undefined}
       */
      headerRenderer: Function,
      /**
       * Represents the final header renderer computed on the set of observable arguments.
       * It is supposed to be used internally when rendering the header cell content.
       *
       * @protected
       * @type {GridHeaderFooterRenderer | undefined}
       */
      _headerRenderer: {
        type: Function,
        computed: "_computeHeaderRenderer(headerRenderer, header, __initialized)"
      },
      /**
       * Custom function for rendering the footer content.
       * Receives two arguments:
       *
       * - `root` The footer cell content DOM element. Append your content to it.
       * - `column` The `<vaadin-grid-column>` element.
       *
       * @type {GridHeaderFooterRenderer | null | undefined}
       */
      footerRenderer: Function,
      /**
       * Represents the final footer renderer computed on the set of observable arguments.
       * It is supposed to be used internally when rendering the footer cell content.
       *
       * @protected
       * @type {GridHeaderFooterRenderer | undefined}
       */
      _footerRenderer: {
        type: Function,
        computed: "_computeFooterRenderer(footerRenderer, __initialized)"
      },
      /**
       * An internal property that is mainly used by `vaadin-template-renderer`
       * to identify grid column elements.
       *
       * @private
       */
      __gridColumnElement: {
        type: Boolean,
        value: !0
      }
    };
  }
  static get observers() {
    return [
      "_widthChanged(width, _headerCell, _footerCell, _cells.*)",
      "_frozenChanged(frozen, _headerCell, _footerCell, _cells.*)",
      "_frozenToEndChanged(frozenToEnd, _headerCell, _footerCell, _cells.*)",
      "_flexGrowChanged(flexGrow, _headerCell, _footerCell, _cells.*)",
      "_textAlignChanged(textAlign, _cells.*, _headerCell, _footerCell)",
      "_orderChanged(_order, _headerCell, _footerCell, _cells.*)",
      "_lastFrozenChanged(_lastFrozen)",
      "_firstFrozenToEndChanged(_firstFrozenToEnd)",
      "_onRendererOrBindingChanged(_renderer, _cells, _bodyContentHidden, _cells.*, path)",
      "_onHeaderRendererOrBindingChanged(_headerRenderer, _headerCell, path, header)",
      "_onFooterRendererOrBindingChanged(_footerRenderer, _footerCell)",
      "_resizableChanged(resizable, _headerCell)",
      "_reorderStatusChanged(_reorderStatus, _headerCell, _footerCell, _cells.*)",
      "_hiddenChanged(hidden, _headerCell, _footerCell, _cells.*)"
    ];
  }
  /**
   * @return {!Grid | undefined}
   * @protected
   */
  get _grid() {
    return this._gridValue || (this._gridValue = this._findHostGrid()), this._gridValue;
  }
  /**
   * @return {!Array<!HTMLElement>}
   * @protected
   */
  get _allCells() {
    return [].concat(this._cells || []).concat(this._emptyCells || []).concat(this._headerCell).concat(this._footerCell).filter((e) => e);
  }
  /** @protected */
  connectedCallback() {
    super.connectedCallback(), requestAnimationFrame(() => {
      this._grid && this._allCells.forEach((e) => {
        e._content.parentNode || this._grid.appendChild(e._content);
      });
    });
  }
  /** @protected */
  disconnectedCallback() {
    super.disconnectedCallback(), requestAnimationFrame(() => {
      this._grid || this._allCells.forEach((e) => {
        e._content.parentNode && e._content.parentNode.removeChild(e._content);
      });
    }), this._gridValue = void 0;
  }
  /** @protected */
  ready() {
    super.ready(), li(this);
  }
  /**
   * @return {!Grid | undefined}
   * @protected
   */
  _findHostGrid() {
    let e = this;
    for (; e && !/^vaadin.*grid(-pro)?$/u.test(e.localName); )
      e = e.assignedSlot ? e.assignedSlot.parentNode : e.parentNode;
    return e || void 0;
  }
  /** @protected */
  _renderHeaderAndFooter() {
    this._renderHeaderCellContent(this._headerRenderer, this._headerCell), this._renderFooterCellContent(this._footerRenderer, this._footerCell);
  }
  /** @private */
  _flexGrowChanged(e) {
    this.parentElement && this.parentElement._columnPropChanged && this.parentElement._columnPropChanged("flexGrow"), this._allCells.forEach((i) => {
      i.style.flexGrow = e;
    });
  }
  /** @private */
  _orderChanged(e) {
    this._allCells.forEach((i) => {
      i.style.order = e;
    });
  }
  /** @private */
  _widthChanged(e) {
    this.parentElement && this.parentElement._columnPropChanged && this.parentElement._columnPropChanged("width"), this._allCells.forEach((i) => {
      i.style.width = e;
    });
  }
  /** @private */
  _frozenChanged(e) {
    this.parentElement && this.parentElement._columnPropChanged && this.parentElement._columnPropChanged("frozen", e), this._allCells.forEach((i) => {
      me(i, "frozen", e);
    }), this._grid && this._grid._frozenCellsChanged && this._grid._frozenCellsChanged();
  }
  /** @private */
  _frozenToEndChanged(e) {
    this.parentElement && this.parentElement._columnPropChanged && this.parentElement._columnPropChanged("frozenToEnd", e), this._allCells.forEach((i) => {
      this._grid && i.parentElement === this._grid.$.sizer || me(i, "frozen-to-end", e);
    }), this._grid && this._grid._frozenCellsChanged && this._grid._frozenCellsChanged();
  }
  /** @private */
  _lastFrozenChanged(e) {
    this._allCells.forEach((i) => {
      me(i, "last-frozen", e);
    }), this.parentElement && this.parentElement._columnPropChanged && (this.parentElement._lastFrozen = e);
  }
  /** @private */
  _firstFrozenToEndChanged(e) {
    this._allCells.forEach((i) => {
      this._grid && i.parentElement === this._grid.$.sizer || me(i, "first-frozen-to-end", e);
    }), this.parentElement && this.parentElement._columnPropChanged && (this.parentElement._firstFrozenToEnd = e);
  }
  /**
   * @param {string} path
   * @return {string}
   * @protected
   */
  _generateHeader(e) {
    return e.substr(e.lastIndexOf(".") + 1).replace(/([A-Z])/gu, "-$1").toLowerCase().replace(/-/gu, " ").replace(/^./u, (i) => i.toUpperCase());
  }
  /** @private */
  _reorderStatusChanged(e) {
    const i = this.__previousReorderStatus, r = i ? `reorder-${i}-cell` : "", s = `reorder-${e}-cell`;
    this._allCells.forEach((n) => {
      me(n, "reorder-status", e, s, r);
    }), this.__previousReorderStatus = e;
  }
  /** @private */
  _resizableChanged(e, i) {
    e === void 0 || i === void 0 || i && [i].concat(this._emptyCells).forEach((r) => {
      if (r) {
        const s = r.querySelector('[part~="resize-handle"]');
        if (s && r.removeChild(s), e) {
          const n = document.createElement("div");
          n.setAttribute("part", "resize-handle"), r.appendChild(n);
        }
      }
    });
  }
  /** @private */
  _textAlignChanged(e) {
    if (e === void 0 || ["start", "end", "center"].indexOf(e) === -1)
      return;
    let i;
    getComputedStyle(this._grid).direction === "ltr" ? e === "start" ? i = "left" : e === "end" && (i = "right") : e === "start" ? i = "right" : e === "end" && (i = "left"), this._allCells.forEach((r) => {
      r._content.style.textAlign = e, getComputedStyle(r._content).textAlign !== e && (r._content.style.textAlign = i);
    });
  }
  /** @private */
  _hiddenChanged(e) {
    this.parentElement && this.parentElement._columnPropChanged && this.parentElement._columnPropChanged("hidden", e), !!e != !!this._previousHidden && this._grid && (e === !0 && this._allCells.forEach((i) => {
      i._content.parentNode && i._content.parentNode.removeChild(i._content);
    }), this._grid._debouncerHiddenChanged = w.debounce(
      this._grid._debouncerHiddenChanged,
      le,
      () => {
        this._grid && this._grid._renderColumnTree && this._grid._renderColumnTree(this._grid._columnTree);
      }
    ), this._grid._debounceUpdateFrozenColumn && this._grid._debounceUpdateFrozenColumn(), this._grid._resetKeyboardNavigation && this._grid._resetKeyboardNavigation()), this._previousHidden = e;
  }
  /** @protected */
  _runRenderer(e, i, r) {
    const s = [i._content, this];
    r && r.item && s.push(r), e.apply(this, s);
  }
  /**
   * Renders the content to the given cells using a renderer.
   *
   * @private
   */
  __renderCellsContent(e, i) {
    this.hidden || !this._grid || i.forEach((r) => {
      if (!r.parentElement)
        return;
      const s = this._grid.__getRowModel(r.parentElement);
      e && (r._renderer !== e && this._clearCellContent(r), r._renderer = e, (s.item || e === this._headerRenderer || e === this._footerRenderer) && this._runRenderer(e, r, s));
    });
  }
  /**
   * Clears the content of a cell.
   *
   * @protected
   */
  _clearCellContent(e) {
    e._content.innerHTML = "", delete e._content._$litPart$;
  }
  /**
   * Renders the header cell content using a renderer,
   * and then updates the visibility of the parent row depending on
   * whether all its children cells are empty or not.
   *
   * @protected
   */
  _renderHeaderCellContent(e, i) {
    !i || !e || (this.__renderCellsContent(e, [i]), this._grid && i.parentElement && this._grid.__debounceUpdateHeaderFooterRowVisibility(i.parentElement));
  }
  /** @protected */
  _onHeaderRendererOrBindingChanged(e, i, ...r) {
    this._renderHeaderCellContent(e, i);
  }
  /**
   * Renders the content of body cells using a renderer.
   *
   * @protected
   */
  _renderBodyCellsContent(e, i) {
    !i || !e || this.__renderCellsContent(e, i);
  }
  /** @protected */
  _onRendererOrBindingChanged(e, i, ...r) {
    this._renderBodyCellsContent(e, i);
  }
  /**
   * Renders the footer cell content using a renderer
   * and then updates the visibility of the parent row depending on
   * whether all its children cells are empty or not.
   *
   * @protected
   */
  _renderFooterCellContent(e, i) {
    !i || !e || (this.__renderCellsContent(e, [i]), this._grid && i.parentElement && this._grid.__debounceUpdateHeaderFooterRowVisibility(i.parentElement));
  }
  /** @protected */
  _onFooterRendererOrBindingChanged(e, i) {
    this._renderFooterCellContent(e, i);
  }
  /** @private */
  __setTextContent(e, i) {
    e.textContent !== i && (e.textContent = i);
  }
  /**
   * Renders the text header to the header cell.
   *
   * @private
   */
  __textHeaderRenderer() {
    this.__setTextContent(this._headerCell._content, this.header);
  }
  /**
   * Computes the property name based on the path and renders it to the header cell.
   * If the path is not defined, then nothing is rendered.
   *
   * @protected
   */
  _defaultHeaderRenderer() {
    this.path && this.__setTextContent(this._headerCell._content, this._generateHeader(this.path));
  }
  /**
   * Computes the item property value based on the path and renders it to the body cell.
   * If the path is not defined, then nothing is rendered.
   *
   * @protected
   */
  _defaultRenderer(e, i, { item: r }) {
    this.path && this.__setTextContent(e, this.get(this.path, r));
  }
  /**
   * By default, nothing is rendered to the footer cell.
   *
   * @protected
   */
  _defaultFooterRenderer() {
  }
  /**
   * Computes the final header renderer for the `_headerRenderer` computed property.
   * All the arguments are observable by the Polymer, it re-calls the method
   * once an argument is changed to update the property value.
   *
   * @protected
   * @return {GridHeaderFooterRenderer | undefined}
   */
  _computeHeaderRenderer(e, i) {
    return e || (i != null ? this.__textHeaderRenderer : this._defaultHeaderRenderer);
  }
  /**
   * Computes the final renderer for the `_renderer` property.
   * All the arguments are observable by the Polymer, it re-calls the method
   * once an argument is changed to update the property value.
   *
   * @protected
   * @return {GridBodyRenderer | undefined}
   */
  _computeRenderer(e) {
    return e || this._defaultRenderer;
  }
  /**
   * Computes the final footer renderer for the `_footerRenderer` property.
   * All the arguments are observable by the Polymer, it re-calls the method
   * once an argument is changed to update the property value.
   *
   * @protected
   * @return {GridHeaderFooterRenderer | undefined}
   */
  _computeFooterRenderer(e) {
    return e || this._defaultFooterRenderer;
  }
};
class Ue extends Ea(te(A)) {
  static get is() {
    return "vaadin-grid-column";
  }
  static get properties() {
    return {
      /**
       * Width of the cells for this column.
       */
      width: {
        type: String,
        value: "100px"
      },
      /**
       * Flex grow ratio for the cell widths. When set to 0, cell width is fixed.
       * @attr {number} flex-grow
       * @type {number}
       */
      flexGrow: {
        type: Number,
        value: 1
      },
      /**
       * Custom function for rendering the cell content.
       * Receives three arguments:
       *
       * - `root` The cell content DOM element. Append your content to it.
       * - `column` The `<vaadin-grid-column>` element.
       * - `model` The object with the properties related with
       *   the rendered item, contains:
       *   - `model.index` The index of the item.
       *   - `model.item` The item.
       *   - `model.expanded` Sublevel toggle state.
       *   - `model.level` Level of the tree represented with a horizontal offset of the toggle button.
       *   - `model.selected` Selected state.
       *   - `model.detailsOpened` Details opened state.
       *
       * @type {GridBodyRenderer | null | undefined}
       */
      renderer: Function,
      /**
       * Represents the final renderer computed on the set of observable arguments.
       * It is supposed to be used internally when rendering the content of a body cell.
       *
       * @protected
       * @type {GridBodyRenderer | undefined}
       */
      _renderer: {
        type: Function,
        computed: "_computeRenderer(renderer, __initialized)"
      },
      /**
       * Path to an item sub-property whose value gets displayed in the column body cells.
       * The property name is also shown in the column header if an explicit header or renderer isn't defined.
       */
      path: {
        type: String
      },
      /**
       * Automatically sets the width of the column based on the column contents when this is set to `true`.
       *
       * For performance reasons the column width is calculated automatically only once when the grid items
       * are rendered for the first time and the calculation only considers the rows which are currently
       * rendered in DOM (a bit more than what is currently visible). If the grid is scrolled, or the cell
       * content changes, the column width might not match the contents anymore.
       *
       * Hidden columns are ignored in the calculation and their widths are not automatically updated when
       * you show a column that was initially hidden.
       *
       * You can manually trigger the auto sizing behavior again by calling `grid.recalculateColumnWidths()`.
       *
       * The column width may still grow larger when `flexGrow` is not 0.
       * @attr {boolean} auto-width
       * @type {boolean}
       */
      autoWidth: {
        type: Boolean,
        value: !1
      },
      /**
       * When true, wraps the cell's slot into an element with role="button", and sets
       * the tabindex attribute on the button element, instead of the cell itself.
       * This is needed to keep focus in sync with VoiceOver cursor when navigating
       * with Control + Option + arrow keys: focusing the `<td>` element does not fire
       * a focus event, but focusing an element with role="button" inside a cell fires it.
       * @protected
       */
      _focusButtonMode: {
        type: Boolean,
        value: !1
      },
      /**
       * @type {Array<!HTMLElement>}
       * @protected
       */
      _cells: Array
    };
  }
}
customElements.define(Ue.is, Ue);
/**
 * @license
 * Copyright (c) 2016 - 2023 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
m(
  "vaadin-grid",
  _`
    @keyframes vaadin-grid-appear {
      to {
        opacity: 1;
      }
    }

    :host {
      display: flex;
      flex-direction: column;
      animation: 1ms vaadin-grid-appear;
      height: 400px;
      flex: 1 1 auto;
      align-self: stretch;
      position: relative;
    }

    :host([hidden]) {
      display: none !important;
    }

    :host([disabled]) {
      pointer-events: none;
    }

    #scroller {
      display: flex;
      flex-direction: column;
      min-height: 100%;
      transform: translateY(0);
      width: auto;
      height: auto;
      position: absolute;
      top: 0;
      right: 0;
      bottom: 0;
      left: 0;
    }

    :host([all-rows-visible]) {
      height: auto;
      align-self: flex-start;
      flex-grow: 0;
      width: 100%;
    }

    :host([all-rows-visible]) #scroller {
      width: 100%;
      height: 100%;
      position: relative;
    }

    :host([all-rows-visible]) #items {
      min-height: 1px;
    }

    #table {
      display: flex;
      flex-direction: column;
      width: 100%;
      height: 100%;
      overflow: auto;
      position: relative;
      outline: none;
      /* Workaround for a Desktop Safari bug: new stacking context here prevents the scrollbar from getting hidden */
      z-index: 0;
    }

    #header,
    #footer {
      display: block;
      position: -webkit-sticky;
      position: sticky;
      left: 0;
      overflow: visible;
      width: 100%;
      z-index: 1;
    }

    #header {
      top: 0;
    }

    th {
      text-align: inherit;
    }

    /* Safari doesn't work with "inherit" */
    [safari] th {
      text-align: initial;
    }

    #footer {
      bottom: 0;
    }

    #items {
      flex-grow: 1;
      flex-shrink: 0;
      display: block;
      position: -webkit-sticky;
      position: sticky;
      width: 100%;
      left: 0;
      overflow: visible;
    }

    [part~='row'] {
      display: flex;
      width: 100%;
      box-sizing: border-box;
      margin: 0;
    }

    [part~='row'][loading] [part~='body-cell'] ::slotted(vaadin-grid-cell-content) {
      visibility: hidden;
    }

    [column-rendering='lazy'] [part~='body-cell']:not([frozen]):not([frozen-to-end]) {
      transform: translateX(var(--_grid-lazy-columns-start));
    }

    #items [part~='row'] {
      position: absolute;
    }

    #items [part~='row']:empty {
      height: 100%;
    }

    [part~='cell']:not([part~='details-cell']) {
      flex-shrink: 0;
      flex-grow: 1;
      box-sizing: border-box;
      display: flex;
      width: 100%;
      position: relative;
      align-items: center;
      padding: 0;
      white-space: nowrap;
    }

    [part~='cell'] > [tabindex] {
      display: flex;
      align-items: inherit;
      outline: none;
      position: absolute;
      top: 0;
      bottom: 0;
      left: 0;
      right: 0;
    }

    [part~='details-cell'] {
      position: absolute;
      bottom: 0;
      width: 100%;
      box-sizing: border-box;
      padding: 0;
    }

    [part~='cell'] ::slotted(vaadin-grid-cell-content) {
      display: block;
      width: 100%;
      box-sizing: border-box;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    [hidden] {
      display: none !important;
    }

    [frozen],
    [frozen-to-end] {
      z-index: 2;
      will-change: transform;
    }

    [no-scrollbars][safari] #table,
    [no-scrollbars][firefox] #table {
      overflow: hidden;
    }

    /* Reordering styles */
    :host([reordering]) [part~='cell'] ::slotted(vaadin-grid-cell-content),
    :host([reordering]) [part~='resize-handle'],
    #scroller[no-content-pointer-events] [part~='cell'] ::slotted(vaadin-grid-cell-content) {
      pointer-events: none;
    }

    [part~='reorder-ghost'] {
      visibility: hidden;
      position: fixed;
      pointer-events: none;
      opacity: 0.5;

      /* Prevent overflowing the grid in Firefox */
      top: 0;
      left: 0;
    }

    :host([reordering]) {
      -moz-user-select: none;
      -webkit-user-select: none;
      user-select: none;
    }

    /* Resizing styles */
    [part~='resize-handle'] {
      position: absolute;
      top: 0;
      right: 0;
      height: 100%;
      cursor: col-resize;
      z-index: 1;
    }

    [part~='resize-handle']::before {
      position: absolute;
      content: '';
      height: 100%;
      width: 35px;
      transform: translateX(-50%);
    }

    [last-column] [part~='resize-handle']::before,
    [last-frozen] [part~='resize-handle']::before {
      width: 18px;
      transform: none;
      right: 0;
    }

    [frozen-to-end] [part~='resize-handle'] {
      left: 0;
      right: auto;
    }

    [frozen-to-end] [part~='resize-handle']::before {
      left: 0;
      right: auto;
    }

    [first-frozen-to-end] [part~='resize-handle']::before {
      width: 18px;
      transform: none;
    }

    [first-frozen-to-end] {
      margin-inline-start: auto;
    }

    /* Hide resize handle if scrolled to end */
    :host(:not([overflow~='end'])) [first-frozen-to-end] [part~='resize-handle'] {
      display: none;
    }

    #scroller[column-resizing] {
      -ms-user-select: none;
      -moz-user-select: none;
      -webkit-user-select: none;
      user-select: none;
    }

    /* Sizer styles */
    #sizer {
      display: flex;
      position: absolute;
      visibility: hidden;
    }

    #sizer [part~='details-cell'] {
      display: none !important;
    }

    #sizer [part~='cell'][hidden] {
      display: none !important;
    }

    #sizer [part~='cell'] {
      display: block;
      flex-shrink: 0;
      line-height: 0;
      height: 0 !important;
      min-height: 0 !important;
      max-height: 0 !important;
      padding: 0 !important;
      border: none !important;
    }

    #sizer [part~='cell']::before {
      content: '-';
    }

    #sizer [part~='cell'] ::slotted(vaadin-grid-cell-content) {
      display: none !important;
    }

    /* RTL specific styles */

    :host([dir='rtl']) #items,
    :host([dir='rtl']) #header,
    :host([dir='rtl']) #footer {
      left: auto;
    }

    :host([dir='rtl']) [part~='reorder-ghost'] {
      left: auto;
      right: 0;
    }

    :host([dir='rtl']) [part~='resize-handle'] {
      left: 0;
      right: auto;
    }

    :host([dir='rtl']) [part~='resize-handle']::before {
      transform: translateX(50%);
    }

    :host([dir='rtl']) [last-column] [part~='resize-handle']::before,
    :host([dir='rtl']) [last-frozen] [part~='resize-handle']::before {
      left: 0;
      right: auto;
    }

    :host([dir='rtl']) [frozen-to-end] [part~='resize-handle'] {
      right: 0;
      left: auto;
    }

    :host([dir='rtl']) [frozen-to-end] [part~='resize-handle']::before {
      right: 0;
      left: auto;
    }

    @media (forced-colors: active) {
      [part~='selected-row'] [part~='first-column-cell']::after {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        bottom: 0;
        border: 2px solid;
      }

      [part~='focused-cell']::before {
        outline: 2px solid !important;
        outline-offset: -1px;
      }
    }
  `,
  { moduleId: "vaadin-grid-styles" }
);
/**
 * @license
 * Copyright (c) 2016 - 2023 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
const nu = (o) => class extends o {
  static get observers() {
    return ["_a11yUpdateGridSize(size, _columnTree, _columnTree.*)"];
  }
  /** @private */
  _a11yGetHeaderRowCount(e) {
    return e.filter((i) => i.some((r) => r.headerRenderer || r.path || r.header)).length;
  }
  /** @private */
  _a11yGetFooterRowCount(e) {
    return e.filter((i) => i.some((r) => r.headerRenderer)).length;
  }
  /** @private */
  _a11yUpdateGridSize(e, i) {
    if (e === void 0 || i === void 0)
      return;
    const r = i[i.length - 1];
    this.$.table.setAttribute(
      "aria-rowcount",
      e + this._a11yGetHeaderRowCount(i) + this._a11yGetFooterRowCount(i)
    ), this.$.table.setAttribute("aria-colcount", r && r.length || 0), this._a11yUpdateHeaderRows(), this._a11yUpdateFooterRows();
  }
  /** @protected */
  _a11yUpdateHeaderRows() {
    P(this.$.header, (e, i) => {
      e.setAttribute("aria-rowindex", i + 1);
    });
  }
  /** @protected */
  _a11yUpdateFooterRows() {
    P(this.$.footer, (e, i) => {
      e.setAttribute("aria-rowindex", this._a11yGetHeaderRowCount(this._columnTree) + this.size + i + 1);
    });
  }
  /**
   * @param {!HTMLElement} row
   * @param {number} index
   * @protected
   */
  _a11yUpdateRowRowindex(e, i) {
    e.setAttribute("aria-rowindex", i + this._a11yGetHeaderRowCount(this._columnTree) + 1);
  }
  /**
   * @param {!HTMLElement} row
   * @param {boolean} selected
   * @protected
   */
  _a11yUpdateRowSelected(e, i) {
    e.setAttribute("aria-selected", !!i), P(e, (r) => {
      r.setAttribute("aria-selected", !!i);
    });
  }
  /**
   * @param {!HTMLElement} row
   * @protected
   */
  _a11yUpdateRowExpanded(e) {
    this.__isRowExpandable(e) ? e.setAttribute("aria-expanded", "false") : this.__isRowCollapsible(e) ? e.setAttribute("aria-expanded", "true") : e.removeAttribute("aria-expanded");
  }
  /**
   * @param {!HTMLElement} row
   * @param {number} level
   * @protected
   */
  _a11yUpdateRowLevel(e, i) {
    i > 0 || this.__isRowCollapsible(e) || this.__isRowExpandable(e) ? e.setAttribute("aria-level", i + 1) : e.removeAttribute("aria-level");
  }
  /**
   * @param {!HTMLElement} row
   * @param {!HTMLElement} detailsCell
   * @protected
   */
  _a11ySetRowDetailsCell(e, i) {
    P(e, (r) => {
      r !== i && r.setAttribute("aria-controls", i.id);
    });
  }
  /**
   * @param {!HTMLElement} row
   * @param {number} colspan
   * @protected
   */
  _a11yUpdateCellColspan(e, i) {
    e.setAttribute("aria-colspan", Number(i));
  }
  /** @protected */
  _a11yUpdateSorters() {
    Array.from(this.querySelectorAll("vaadin-grid-sorter")).forEach((e) => {
      let i = e.parentNode;
      for (; i && i.localName !== "vaadin-grid-cell-content"; )
        i = i.parentNode;
      i && i.assignedSlot && i.assignedSlot.parentNode.setAttribute(
        "aria-sort",
        {
          asc: "ascending",
          desc: "descending"
        }[String(e.direction)] || "none"
      );
    });
  }
};
/**
 * @license
 * Copyright (c) 2016 - 2023 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
const Sa = (o) => {
  if (!o.parentNode)
    return !1;
  const e = Array.from(
    o.parentNode.querySelectorAll(
      "[tabindex], button, input, select, textarea, object, iframe, a[href], area[href]"
    )
  ).filter((i) => {
    const r = i.getAttribute("part");
    return !(r && r.includes("body-cell"));
  }).includes(o);
  return !o.disabled && e && o.offsetParent && getComputedStyle(o).visibility !== "hidden";
}, au = (o) => class extends o {
  static get properties() {
    return {
      /**
       * The item user has last interacted with. Turns to `null` after user deactivates
       * the item by re-interacting with the currently active item.
       * @type {GridItem}
       */
      activeItem: {
        type: Object,
        notify: !0,
        value: null
      }
    };
  }
  /** @protected */
  ready() {
    super.ready(), this.$.scroller.addEventListener("click", this._onClick.bind(this)), this.addEventListener("cell-activate", this._activateItem.bind(this)), this.addEventListener("row-activate", this._activateItem.bind(this));
  }
  /** @private */
  _activateItem(e) {
    const i = e.detail.model, r = i ? i.item : null;
    r && (this.activeItem = this._itemsEqual(this.activeItem, r) ? null : r);
  }
  /**
   * We need to listen to click instead of tap because on mobile safari, the
   * document.activeElement has not been updated (focus has not been shifted)
   * yet at the point when tap event is being executed.
   * @param {!MouseEvent} e
   * @protected
   */
  _onClick(e) {
    if (e.defaultPrevented)
      return;
    const i = e.composedPath(), r = i[i.indexOf(this.$.table) - 3];
    if (!r || r.getAttribute("part").indexOf("details-cell") > -1)
      return;
    const s = r._content, n = this.getRootNode().activeElement;
    !s.contains(n) && !this._isFocusable(e.target) && !(e.target instanceof HTMLLabelElement) && this.dispatchEvent(
      new CustomEvent("cell-activate", {
        detail: {
          model: this.__getRowModel(r.parentElement)
        }
      })
    );
  }
  /**
   * @param {!Element} target
   * @return {boolean}
   * @protected
   */
  _isFocusable(e) {
    return Sa(e);
  }
  /**
   * Fired when the `activeItem` property changes.
   *
   * @event active-item-changed
   */
  /**
   * Fired when the cell is activated with click or keyboard.
   *
   * @event cell-activate
   */
};
function ze(o, t) {
  return o.split(".").reduce((e, i) => e[i], t);
}
function ws(o, t, e) {
  if (e.length === 0)
    return !1;
  let i = !0;
  return o.forEach(({ path: r }) => {
    if (!r || r.indexOf(".") === -1)
      return;
    const s = r.replace(/\.[^.]*$/u, "");
    ze(s, e[0]) === void 0 && (i = !1);
  }), i;
}
function ri(o) {
  return [void 0, null].indexOf(o) >= 0 ? "" : isNaN(o) ? o.toString() : o;
}
function As(o, t) {
  return o = ri(o), t = ri(t), o < t ? -1 : o > t ? 1 : 0;
}
function lu(o, t) {
  return o.sort((e, i) => t.map((r) => r.direction === "asc" ? As(ze(r.path, e), ze(r.path, i)) : r.direction === "desc" ? As(ze(r.path, i), ze(r.path, e)) : 0).reduce((r, s) => r !== 0 ? r : s, 0));
}
function du(o, t) {
  return o.filter((e) => t.every((i) => {
    const r = ri(ze(i.path, e)), s = ri(i.value).toString().toLowerCase();
    return r.toString().toLowerCase().includes(s);
  }));
}
const cu = (o) => (t, e) => {
  let i = o ? [...o] : [];
  t.filters && ws(t.filters, "filtering", i) && (i = du(i, t.filters)), Array.isArray(t.sortOrders) && t.sortOrders.length && ws(t.sortOrders, "sorting", i) && (i = lu(i, t.sortOrders));
  const r = Math.min(i.length, t.pageSize), s = t.page * r, n = s + r, a = i.slice(s, n);
  e(a, i.length);
};
/**
 * @license
 * Copyright (c) 2016 - 2023 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
const hu = (o) => class extends o {
  static get properties() {
    return {
      /**
       * An array containing the items which will be passed to renderer functions.
       *
       * @type {Array<!GridItem> | undefined}
       */
      items: Array
    };
  }
  static get observers() {
    return ["__dataProviderOrItemsChanged(dataProvider, items, isAttached, items.*, _filters, _sorters)"];
  }
  /** @private */
  __setArrayDataProvider(e) {
    const i = cu(this.items);
    i.__items = e, this.setProperties({
      _arrayDataProvider: i,
      size: e.length,
      dataProvider: i
    });
  }
  /** @private */
  __dataProviderOrItemsChanged(e, i, r) {
    r && (this._arrayDataProvider ? e !== this._arrayDataProvider ? this.setProperties({
      _arrayDataProvider: void 0,
      items: void 0
    }) : i ? this._arrayDataProvider.__items === i ? (this.clearCache(), this.size = this._effectiveSize) : this.__setArrayDataProvider(i) : (this.setProperties({
      _arrayDataProvider: void 0,
      dataProvider: void 0,
      size: 0
    }), this.clearCache()) : i && this.__setArrayDataProvider(i));
  }
};
/**
 * @license
 * Copyright (c) 2016 - 2023 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
const uu = (o) => class extends o {
  static get properties() {
    return {
      /**
       * Set to true to allow column reordering.
       * @attr {boolean} column-reordering-allowed
       * @type {boolean}
       */
      columnReorderingAllowed: {
        type: Boolean,
        value: !1
      },
      /** @private */
      _orderBaseScope: {
        type: Number,
        value: 1e7
      }
    };
  }
  static get observers() {
    return ["_updateOrders(_columnTree)"];
  }
  /** @protected */
  ready() {
    super.ready(), V(this, "track", this._onTrackEvent), this._reorderGhost = this.shadowRoot.querySelector('[part="reorder-ghost"]'), this.addEventListener("touchstart", this._onTouchStart.bind(this)), this.addEventListener("touchmove", this._onTouchMove.bind(this)), this.addEventListener("touchend", this._onTouchEnd.bind(this)), this.addEventListener("contextmenu", this._onContextMenu.bind(this));
  }
  /** @private */
  _onContextMenu(e) {
    this.hasAttribute("reordering") && (e.preventDefault(), Jt || this._onTrackEnd());
  }
  /** @private */
  _onTouchStart(e) {
    this._startTouchReorderTimeout = setTimeout(() => {
      this._onTrackStart({
        detail: {
          x: e.touches[0].clientX,
          y: e.touches[0].clientY
        }
      });
    }, 100);
  }
  /** @private */
  _onTouchMove(e) {
    this._draggedColumn && e.preventDefault(), clearTimeout(this._startTouchReorderTimeout);
  }
  /** @private */
  _onTouchEnd() {
    clearTimeout(this._startTouchReorderTimeout), this._onTrackEnd();
  }
  /** @private */
  _onTrackEvent(e) {
    if (e.detail.state === "start") {
      const i = e.composedPath(), r = i[i.indexOf(this.$.header) - 2];
      if (!r || !r._content || r._content.contains(this.getRootNode().activeElement) || this.$.scroller.hasAttribute("column-resizing"))
        return;
      this._touchDevice || this._onTrackStart(e);
    } else
      e.detail.state === "track" ? this._onTrack(e) : e.detail.state === "end" && this._onTrackEnd(e);
  }
  /** @private */
  _onTrackStart(e) {
    if (!this.columnReorderingAllowed)
      return;
    const i = e.composedPath && e.composedPath();
    if (i && i.some((s) => s.hasAttribute && s.hasAttribute("draggable")))
      return;
    const r = this._cellFromPoint(e.detail.x, e.detail.y);
    if (!(!r || !r.getAttribute("part").includes("header-cell"))) {
      for (this.toggleAttribute("reordering", !0), this._draggedColumn = r._column; this._draggedColumn.parentElement.childElementCount === 1; )
        this._draggedColumn = this._draggedColumn.parentElement;
      this._setSiblingsReorderStatus(this._draggedColumn, "allowed"), this._draggedColumn._reorderStatus = "dragging", this._updateGhost(r), this._reorderGhost.style.visibility = "visible", this._updateGhostPosition(e.detail.x, this._touchDevice ? e.detail.y - 50 : e.detail.y), this._autoScroller();
    }
  }
  /** @private */
  _onTrack(e) {
    if (!this._draggedColumn)
      return;
    const i = this._cellFromPoint(e.detail.x, e.detail.y);
    if (!i)
      return;
    const r = this._getTargetColumn(i, this._draggedColumn);
    if (this._isSwapAllowed(this._draggedColumn, r) && this._isSwappableByPosition(r, e.detail.x)) {
      const s = this._columnTree.findIndex((c) => c.includes(r)), n = this._getColumnsInOrder(s), a = n.indexOf(this._draggedColumn), l = n.indexOf(r), d = a < l ? 1 : -1;
      for (let c = a; c !== l; c += d)
        this._swapColumnOrders(this._draggedColumn, n[c + d]);
    }
    this._updateGhostPosition(e.detail.x, this._touchDevice ? e.detail.y - 50 : e.detail.y), this._lastDragClientX = e.detail.x;
  }
  /** @private */
  _onTrackEnd() {
    this._draggedColumn && (this.toggleAttribute("reordering", !1), this._draggedColumn._reorderStatus = "", this._setSiblingsReorderStatus(this._draggedColumn, ""), this._draggedColumn = null, this._lastDragClientX = null, this._reorderGhost.style.visibility = "hidden", this.dispatchEvent(
      new CustomEvent("column-reorder", {
        detail: {
          columns: this._getColumnsInOrder()
        }
      })
    ));
  }
  /**
   * Returns the columns (or column groups) on the specified header level in visual order.
   * By default, the bottom level is used.
   *
   * @return {!Array<!GridColumn>}
   * @protected
   */
  _getColumnsInOrder(e = this._columnTree.length - 1) {
    return this._columnTree[e].filter((i) => !i.hidden).sort((i, r) => i._order - r._order);
  }
  /**
   * @param {number} x
   * @param {number} y
   * @return {HTMLElement | undefined}
   * @protected
   */
  _cellFromPoint(e = 0, i = 0) {
    this._draggedColumn || this.$.scroller.toggleAttribute("no-content-pointer-events", !0);
    const r = this.shadowRoot.elementFromPoint(e, i);
    if (this.$.scroller.toggleAttribute("no-content-pointer-events", !1), r && r._column)
      return r;
  }
  /**
   * @param {number} eventClientX
   * @param {number} eventClientY
   * @protected
   */
  _updateGhostPosition(e, i) {
    const r = this._reorderGhost.getBoundingClientRect(), s = e - r.width / 2, n = i - r.height / 2, a = parseInt(this._reorderGhost._left || 0), l = parseInt(this._reorderGhost._top || 0);
    this._reorderGhost._left = a - (r.left - s), this._reorderGhost._top = l - (r.top - n), this._reorderGhost.style.transform = `translate(${this._reorderGhost._left}px, ${this._reorderGhost._top}px)`;
  }
  /**
   * @param {!HTMLElement} cell
   * @return {!HTMLElement}
   * @protected
   */
  _updateGhost(e) {
    const i = this._reorderGhost;
    i.textContent = e._content.innerText;
    const r = window.getComputedStyle(e);
    return [
      "boxSizing",
      "display",
      "width",
      "height",
      "background",
      "alignItems",
      "padding",
      "border",
      "flex-direction",
      "overflow"
    ].forEach((s) => {
      i.style[s] = r[s];
    }), i;
  }
  /** @private */
  _updateOrders(e) {
    e !== void 0 && (e[0].forEach((i) => {
      i._order = 0;
    }), ka(e[0], this._orderBaseScope, 0));
  }
  /**
   * @param {!GridColumn} column
   * @param {string} status
   * @protected
   */
  _setSiblingsReorderStatus(e, i) {
    P(e.parentNode, (r) => {
      /column/u.test(r.localName) && this._isSwapAllowed(r, e) && (r._reorderStatus = i);
    });
  }
  /** @protected */
  _autoScroller() {
    if (this._lastDragClientX) {
      const e = this._lastDragClientX - this.getBoundingClientRect().right + 50, i = this.getBoundingClientRect().left - this._lastDragClientX + 50;
      e > 0 ? this.$.table.scrollLeft += e / 10 : i > 0 && (this.$.table.scrollLeft -= i / 10);
    }
    this._draggedColumn && setTimeout(() => this._autoScroller(), 10);
  }
  /**
   * @param {GridColumn | undefined} column1
   * @param {GridColumn | undefined} column2
   * @return {boolean | undefined}
   * @protected
   */
  _isSwapAllowed(e, i) {
    if (e && i) {
      const r = e !== i, s = e.parentElement === i.parentElement, n = e.frozen && i.frozen || // Both columns are frozen
      e.frozenToEnd && i.frozenToEnd || // Both columns are frozen to end
      !e.frozen && !e.frozenToEnd && !i.frozen && !i.frozenToEnd;
      return r && s && n;
    }
  }
  /**
   * @param {!GridColumn} targetColumn
   * @param {number} clientX
   * @return {boolean}
   * @protected
   */
  _isSwappableByPosition(e, i) {
    const r = Array.from(this.$.header.querySelectorAll('tr:not([hidden]) [part~="cell"]')).find(
      (a) => e.contains(a._column)
    ), s = this.$.header.querySelector("tr:not([hidden]) [reorder-status=dragging]").getBoundingClientRect(), n = r.getBoundingClientRect();
    return n.left > s.left ? i > n.right - s.width : i < n.left + s.width;
  }
  /**
   * @param {!GridColumn} column1
   * @param {!GridColumn} column2
   * @protected
   */
  _swapColumnOrders(e, i) {
    [e._order, i._order] = [i._order, e._order], this._debounceUpdateFrozenColumn(), this._updateFirstAndLastColumn();
  }
  /**
   * @param {HTMLElement | undefined} targetCell
   * @param {GridColumn} draggedColumn
   * @return {GridColumn | undefined}
   * @protected
   */
  _getTargetColumn(e, i) {
    if (e && i) {
      let r = e._column;
      for (; r.parentElement !== i.parentElement && r !== this; )
        r = r.parentElement;
      return r.parentElement === i.parentElement ? r : e._column;
    }
  }
  /**
   * Fired when the columns in the grid are reordered.
   *
   * @event column-reorder
   * @param {Object} detail
   * @param {Object} detail.columns the columns in the new order
   */
};
/**
 * @license
 * Copyright (c) 2016 - 2023 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
const pu = (o) => class extends o {
  /** @protected */
  ready() {
    super.ready();
    const e = this.$.scroller;
    V(e, "track", this._onHeaderTrack.bind(this)), e.addEventListener("touchmove", (i) => e.hasAttribute("column-resizing") && i.preventDefault()), e.addEventListener(
      "contextmenu",
      (i) => i.target.getAttribute("part") === "resize-handle" && i.preventDefault()
    ), e.addEventListener(
      "mousedown",
      (i) => i.target.getAttribute("part") === "resize-handle" && i.preventDefault()
    );
  }
  /** @private */
  _onHeaderTrack(e) {
    const i = e.target;
    if (i.getAttribute("part") === "resize-handle") {
      let s = i.parentElement._column;
      for (this.$.scroller.toggleAttribute("column-resizing", !0); s.localName === "vaadin-grid-column-group"; )
        s = s._childColumns.slice(0).sort((h, u) => h._order - u._order).filter((h) => !h.hidden).pop();
      const n = this.__isRTL, a = e.detail.x, l = Array.from(this.$.header.querySelectorAll('[part~="row"]:last-child [part~="cell"]')), d = l.find((h) => h._column === s);
      if (d.offsetWidth) {
        const h = getComputedStyle(d._content), u = 10 + parseInt(h.paddingLeft) + parseInt(h.paddingRight) + parseInt(h.borderLeftWidth) + parseInt(h.borderRightWidth) + parseInt(h.marginLeft) + parseInt(h.marginRight);
        let p;
        const f = d.offsetWidth, x = d.getBoundingClientRect();
        d.hasAttribute("frozen-to-end") ? p = f + (n ? a - x.right : x.left - a) : p = f + (n ? x.left - a : a - x.right), s.width = `${Math.max(u, p)}px`, s.flexGrow = 0;
      }
      l.sort((h, u) => h._column._order - u._column._order).forEach((h, u, p) => {
        u < p.indexOf(d) && (h._column.width = `${h.offsetWidth}px`, h._column.flexGrow = 0);
      });
      const c = this._frozenToEndCells[0];
      if (c && this.$.table.scrollWidth > this.$.table.offsetWidth) {
        const h = c.getBoundingClientRect(), u = a - (n ? h.right : h.left);
        (n && u <= 0 || !n && u >= 0) && (this.$.table.scrollLeft += u);
      }
      e.detail.state === "end" && (this.$.scroller.toggleAttribute("column-resizing", !1), this.dispatchEvent(
        new CustomEvent("column-resize", {
          detail: { resizedColumn: s }
        })
      )), this._resizeHandler();
    }
  }
  /**
   * Fired when a column in the grid is resized by the user.
   *
   * @event column-resize
   * @param {Object} detail
   * @param {Object} detail.resizedColumn the column that was resized
   */
};
/**
 * @license
 * Copyright (c) 2016 - 2023 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
const ks = class Ia {
  /**
   * @param {!HTMLElement} grid
   * @param {!ItemCache | undefined} parentCache
   * @param {!GridItem | undefined} parentItem
   */
  constructor(t, e, i) {
    this.grid = t, this.parentCache = e, this.parentItem = i, this.itemCaches = {}, this.items = {}, this.effectiveSize = 0, this.size = 0, this.pendingRequests = {};
  }
  /**
   * @return {boolean}
   */
  isLoading() {
    return !!(Object.keys(this.pendingRequests).length || Object.keys(this.itemCaches).filter((t) => this.itemCaches[t].isLoading())[0]);
  }
  /**
   * @param {number} index
   * @return {!GridItem | undefined}
   */
  getItemForIndex(t) {
    const { cache: e, scaledIndex: i } = this.getCacheAndIndex(t);
    return e.items[i];
  }
  updateSize() {
    this.effectiveSize = !this.parentItem || this.grid._isExpanded(this.parentItem) ? this.size + Object.keys(this.itemCaches).reduce((t, e) => {
      const i = this.itemCaches[e];
      return i.updateSize(), t + i.effectiveSize;
    }, 0) : 0;
  }
  /**
   * @param {number} scaledIndex
   */
  ensureSubCacheForScaledIndex(t) {
    if (!this.itemCaches[t]) {
      const e = new Ia(this.grid, this, this.items[t]);
      this.itemCaches[t] = e, this.grid._loadPage(0, e);
    }
  }
  /**
   * @param {number} index
   * @return {{cache: !ItemCache, scaledIndex: number}}
   */
  getCacheAndIndex(t) {
    let e = t;
    for (const [i, r] of Object.entries(this.itemCaches)) {
      const s = Number(i);
      if (e <= s)
        return { cache: this, scaledIndex: e };
      if (e <= s + r.effectiveSize)
        return r.getCacheAndIndex(e - s - 1);
      e -= r.effectiveSize;
    }
    return { cache: this, scaledIndex: e };
  }
  /**
   * Gets the scaled index as flattened index on this cache level.
   * In practice, this means that the effective size of any expanded
   * subcaches preceding the index are added to the value.
   * @param {number} scaledIndex
   * @return {number} The flat index on this cache level.
   */
  getFlatIndex(t) {
    const e = Math.max(0, Math.min(this.size - 1, t));
    return Object.entries(this.itemCaches).reduce((i, [r, s]) => e > Number(r) ? i + s.effectiveSize : i, e);
  }
}, _u = (o) => class extends o {
  static get properties() {
    return {
      /**
       * The number of root-level items in the grid.
       * @attr {number} size
       * @type {number}
       */
      size: {
        type: Number,
        notify: !0
      },
      /**
       * Number of items fetched at a time from the dataprovider.
       * @attr {number} page-size
       * @type {number}
       */
      pageSize: {
        type: Number,
        value: 50,
        observer: "_pageSizeChanged"
      },
      /**
       * Function that provides items lazily. Receives arguments `params`, `callback`
       *
       * `params.page` Requested page index
       *
       * `params.pageSize` Current page size
       *
       * `params.filters` Currently applied filters
       *
       * `params.sortOrders` Currently applied sorting orders
       *
       * `params.parentItem` When tree is used, and sublevel items
       * are requested, reference to parent item of the requested sublevel.
       * Otherwise `undefined`.
       *
       * `callback(items, size)` Callback function with arguments:
       *   - `items` Current page of items
       *   - `size` Total number of items. When tree sublevel items
       *     are requested, total number of items in the requested sublevel.
       *     Optional when tree is not used, required for tree.
       *
       * @type {GridDataProvider | null | undefined}
       */
      dataProvider: {
        type: Object,
        notify: !0,
        observer: "_dataProviderChanged"
      },
      /**
       * `true` while data is being requested from the data provider.
       */
      loading: {
        type: Boolean,
        notify: !0,
        readOnly: !0,
        reflectToAttribute: !0
      },
      /**
       * @type {!ItemCache}
       * @protected
       */
      _cache: {
        type: Object,
        value() {
          return new ks(this);
        }
      },
      /**
       * @protected
       */
      _hasData: {
        type: Boolean,
        value: !1
      },
      /**
       * Path to an item sub-property that indicates whether the item has child items.
       * @attr {string} item-has-children-path
       */
      itemHasChildrenPath: {
        type: String,
        value: "children",
        observer: "__itemHasChildrenPathChanged"
      },
      /**
       * Path to an item sub-property that identifies the item.
       * @attr {string} item-id-path
       */
      itemIdPath: {
        type: String,
        value: null
      },
      /**
       * An array that contains the expanded items.
       * @type {!Array<!GridItem>}
       */
      expandedItems: {
        type: Object,
        notify: !0,
        value: () => []
      },
      /**
       * @private
       */
      __expandedKeys: {
        type: Object,
        computed: "__computeExpandedKeys(itemIdPath, expandedItems.*)"
      }
    };
  }
  static get observers() {
    return ["_sizeChanged(size)", "_expandedItemsChanged(expandedItems.*)"];
  }
  /** @private */
  _sizeChanged(e) {
    const i = e - this._cache.size;
    this._cache.size += i, this._cache.effectiveSize += i, this._effectiveSize = this._cache.effectiveSize;
  }
  /** @private */
  __itemHasChildrenPathChanged(e, i) {
    !i && e === "children" || this.requestContentUpdate();
  }
  /**
   * @param {number} index
   * @param {HTMLElement} el
   * @protected
   */
  _getItem(e, i) {
    if (e >= this._effectiveSize)
      return;
    i.index = e;
    const { cache: r, scaledIndex: s } = this._cache.getCacheAndIndex(e), n = r.items[s];
    n ? (this.__updateLoading(i, !1), this._updateItem(i, n), this._isExpanded(n) && r.ensureSubCacheForScaledIndex(s)) : (this.__updateLoading(i, !0), this._loadPage(this._getPageForIndex(s), r));
  }
  /**
   * @param {!HTMLElement} row
   * @param {boolean} loading
   * @private
   */
  __updateLoading(e, i) {
    const r = Ct(e);
    mi(e, "loading", i), se(r, "loading-row-cell", i);
  }
  /**
   * Returns a value that identifies the item. Uses `itemIdPath` if available.
   * Can be customized by overriding.
   * @param {!GridItem} item
   * @return {!GridItem | !unknown}
   */
  getItemId(e) {
    return this.itemIdPath ? this.get(this.itemIdPath, e) : e;
  }
  /**
   * @param {!GridItem} item
   * @return {boolean}
   * @protected
   */
  _isExpanded(e) {
    return this.__expandedKeys.has(this.getItemId(e));
  }
  /** @private */
  _expandedItemsChanged() {
    this._cache.updateSize(), this._effectiveSize = this._cache.effectiveSize, this.__updateVisibleRows();
  }
  /** @private */
  __computeExpandedKeys(e, i) {
    const r = i.base || [], s = /* @__PURE__ */ new Set();
    return r.forEach((n) => {
      s.add(this.getItemId(n));
    }), s;
  }
  /**
   * Expands the given item tree.
   * @param {!GridItem} item
   */
  expandItem(e) {
    this._isExpanded(e) || (this.expandedItems = [...this.expandedItems, e]);
  }
  /**
   * Collapses the given item tree.
   * @param {!GridItem} item
   */
  collapseItem(e) {
    this._isExpanded(e) && (this.expandedItems = this.expandedItems.filter((i) => !this._itemsEqual(i, e)));
  }
  /**
   * @param {number} index
   * @return {number}
   * @protected
   */
  _getIndexLevel(e) {
    let { cache: i } = this._cache.getCacheAndIndex(e), r = 0;
    for (; i.parentCache; )
      i = i.parentCache, r += 1;
    return r;
  }
  /**
   * @param {number} page
   * @param {ItemCache} cache
   * @protected
   */
  _loadPage(e, i) {
    if (!i.pendingRequests[e] && this.dataProvider) {
      this._setLoading(!0), i.pendingRequests[e] = !0;
      const r = {
        page: e,
        pageSize: this.pageSize,
        sortOrders: this._mapSorters(),
        filters: this._mapFilters(),
        parentItem: i.parentItem
      };
      this.dataProvider(r, (s, n) => {
        n !== void 0 ? i.size = n : r.parentItem && (i.size = s.length), s.forEach((a, l) => {
          const d = e * this.pageSize + l;
          i.items[d] = a;
        }), this._cache.updateSize(), this._effectiveSize = this._cache.effectiveSize, this._getVisibleRows().forEach((a) => {
          const { cache: l, scaledIndex: d } = this._cache.getCacheAndIndex(a.index), c = l.items[d];
          c && this._isExpanded(c) && l.ensureSubCacheForScaledIndex(d);
        }), this._hasData = !0, delete i.pendingRequests[e], this._debouncerApplyCachedData = w.debounce(this._debouncerApplyCachedData, L.after(0), () => {
          this._setLoading(!1), this._getVisibleRows().forEach((a) => {
            this._cache.getItemForIndex(a.index) && this._getItem(a.index, a);
          }), this.__scrollToPendingIndexes();
        }), this._cache.isLoading() || this._debouncerApplyCachedData.flush(), this._onDataProviderPageLoaded();
      });
    }
  }
  /** @protected */
  _onDataProviderPageLoaded() {
  }
  /**
   * @param {number} index
   * @return {number}
   * @private
   */
  _getPageForIndex(e) {
    return Math.floor(e / this.pageSize);
  }
  /**
   * Clears the cached pages and reloads data from dataprovider when needed.
   */
  clearCache() {
    this._cache = new ks(this), this._cache.size = this.size || 0, this._cache.updateSize(), this._hasData = !1, this.__updateVisibleRows(), this._effectiveSize || this._loadPage(0, this._cache);
  }
  /** @private */
  _pageSizeChanged(e, i) {
    i !== void 0 && e !== i && this.clearCache();
  }
  /** @protected */
  _checkSize() {
    this.size === void 0 && this._effectiveSize;
  }
  /** @private */
  _dataProviderChanged(e, i) {
    i !== void 0 && this.clearCache(), this._ensureFirstPageLoaded(), this._debouncerCheckSize = w.debounce(
      this._debouncerCheckSize,
      L.after(2e3),
      this._checkSize.bind(this)
    );
  }
  /** @protected */
  _ensureFirstPageLoaded() {
    this._hasData || this._loadPage(0, this._cache);
  }
  /**
   * @param {!GridItem} item1
   * @param {!GridItem} item2
   * @return {boolean}
   * @protected
   */
  _itemsEqual(e, i) {
    return this.getItemId(e) === this.getItemId(i);
  }
  /**
   * @param {!GridItem} item
   * @param {!Array<!GridItem>} array
   * @return {number}
   * @protected
   */
  _getItemIndexInArray(e, i) {
    let r = -1;
    return i.forEach((s, n) => {
      this._itemsEqual(s, e) && (r = n);
    }), r;
  }
  /**
   * Scroll to a specific row index in the virtual list. Note that the row index is
   * not always the same for any particular item. For example, sorting or filtering
   * items can affect the row index related to an item.
   *
   * The `indexes` parameter can be either a single number or multiple numbers.
   * The grid will first try to scroll to the item at the first index on the top level.
   * In case the item at the first index is expanded, the grid will then try scroll to the
   * item at the second index within the children of the expanded first item, and so on.
   * Each given index points to a child of the item at the previous index.
   *
   * Using `Infinity` as an index will point to the last item on the level.
   *
   * @param indexes {...number} Row indexes to scroll to
   */
  scrollToIndex(...e) {
    let i;
    for (; i !== (i = this.__getGlobalFlatIndex(e)); )
      this._scrollToFlatIndex(i);
    (this._cache.isLoading() || !this.clientHeight) && (this.__pendingScrollToIndexes = e);
  }
  /**
   * Recursively returns the globally flat index of the item the given indexes point to.
   * Each index in the array points to a sub-item of the previous index.
   * Using `Infinity` as an index will point to the last item on the level.
   *
   * @param {!Array<number>} indexes
   * @param {!ItemCache} cache
   * @param {number} flatIndex
   * @return {number}
   * @private
   */
  __getGlobalFlatIndex([e, ...i], r = this._cache, s = 0) {
    e === 1 / 0 && (e = r.size - 1);
    const n = r.getFlatIndex(e), a = r.itemCaches[e];
    return a && a.effectiveSize && i.length ? this.__getGlobalFlatIndex(i, a, s + n + 1) : s + n;
  }
  /** @private */
  __scrollToPendingIndexes() {
    if (this.__pendingScrollToIndexes && this.$.items.children.length) {
      const e = this.__pendingScrollToIndexes;
      delete this.__pendingScrollToIndexes, this.scrollToIndex(...e);
    }
  }
  /**
   * Fired when the `expandedItems` property changes.
   *
   * @event expanded-items-changed
   */
  /**
   * Fired when the `loading` property changes.
   *
   * @event loading-changed
   */
};
/**
 * @license
 * Copyright (c) 2016 - 2023 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
const tt = {
  BETWEEN: "between",
  ON_TOP: "on-top",
  ON_TOP_OR_BETWEEN: "on-top-or-between",
  ON_GRID: "on-grid"
}, re = {
  ON_TOP: "on-top",
  ABOVE: "above",
  BELOW: "below",
  EMPTY: "empty"
}, fu = !("draggable" in document.createElement("div")), mu = (o) => class extends o {
  static get properties() {
    return {
      /**
       * Defines the locations within the Grid row where an element can be dropped.
       *
       * Possible values are:
       * - `between`: The drop event can happen between Grid rows.
       * - `on-top`: The drop event can happen on top of Grid rows.
       * - `on-top-or-between`: The drop event can happen either on top of or between Grid rows.
       * - `on-grid`: The drop event will not happen on any specific row, it will show the drop target outline around the whole grid.
       * @attr {between|on-top|on-top-or-between|on-grid} drop-mode
       * @type {GridDropMode | null | undefined}
       */
      dropMode: String,
      /**
       * Marks the grid's rows to be available for dragging.
       * @attr {boolean} rows-draggable
       */
      rowsDraggable: Boolean,
      /**
       * A function that filters dragging of specific grid rows. The return value should be false
       * if dragging of the row should be disabled.
       *
       * Receives one argument:
       * - `model` The object with the properties related with
       *   the rendered item, contains:
       *   - `model.index` The index of the item.
       *   - `model.item` The item.
       *   - `model.expanded` Sublevel toggle state.
       *   - `model.level` Level of the tree represented with a horizontal offset of the toggle button.
       *   - `model.selected` Selected state.
       *
       * @type {GridDragAndDropFilter | null | undefined}
       */
      dragFilter: Function,
      /**
       * A function that filters dropping on specific grid rows. The return value should be false
       * if dropping on the row should be disabled.
       *
       * Receives one argument:
       * - `model` The object with the properties related with
       *   the rendered item, contains:
       *   - `model.index` The index of the item.
       *   - `model.item` The item.
       *   - `model.expanded` Sublevel toggle state.
       *   - `model.level` Level of the tree represented with a horizontal offset of the toggle button.
       *   - `model.selected` Selected state.
       *
       * @type {GridDragAndDropFilter | null | undefined}
       */
      dropFilter: Function,
      /** @private */
      __dndAutoScrollThreshold: {
        value: 50
      }
    };
  }
  static get observers() {
    return ["_dragDropAccessChanged(rowsDraggable, dropMode, dragFilter, dropFilter, loading)"];
  }
  /** @protected */
  ready() {
    super.ready(), this.$.table.addEventListener("dragstart", this._onDragStart.bind(this)), this.$.table.addEventListener("dragend", this._onDragEnd.bind(this)), this.$.table.addEventListener("dragover", this._onDragOver.bind(this)), this.$.table.addEventListener("dragleave", this._onDragLeave.bind(this)), this.$.table.addEventListener("drop", this._onDrop.bind(this)), this.$.table.addEventListener("dragenter", (e) => {
      this.dropMode && (e.preventDefault(), e.stopPropagation());
    });
  }
  /** @private */
  _onDragStart(e) {
    if (this.rowsDraggable) {
      let i = e.target;
      if (i.localName === "vaadin-grid-cell-content" && (i = i.assignedSlot.parentNode.parentNode), i.parentNode !== this.$.items)
        return;
      if (e.stopPropagation(), this.toggleAttribute("dragging-rows", !0), this._safari) {
        const a = i.style.transform;
        i.style.top = /translateY\((.*)\)/u.exec(a)[1], i.style.transform = "none", requestAnimationFrame(() => {
          i.style.top = "", i.style.transform = a;
        });
      }
      const r = i.getBoundingClientRect();
      fu ? e.dataTransfer.setDragImage(i) : e.dataTransfer.setDragImage(i, e.clientX - r.left, e.clientY - r.top);
      let s = [i];
      this._isSelected(i._item) && (s = this.__getViewportRows().filter((a) => this._isSelected(a._item)).filter((a) => !this.dragFilter || this.dragFilter(this.__getRowModel(a)))), e.dataTransfer.setData("text", this.__formatDefaultTransferData(s)), lt(i, { dragstart: s.length > 1 ? `${s.length}` : "" }), this.style.setProperty("--_grid-drag-start-x", `${e.clientX - r.left + 20}px`), this.style.setProperty("--_grid-drag-start-y", `${e.clientY - r.top + 10}px`), requestAnimationFrame(() => {
        lt(i, { dragstart: !1 }), this.style.setProperty("--_grid-drag-start-x", ""), this.style.setProperty("--_grid-drag-start-y", "");
      });
      const n = new CustomEvent("grid-dragstart", {
        detail: {
          draggedItems: s.map((a) => a._item),
          setDragData: (a, l) => e.dataTransfer.setData(a, l),
          setDraggedItemsCount: (a) => i.setAttribute("dragstart", a)
        }
      });
      n.originalEvent = e, this.dispatchEvent(n);
    }
  }
  /** @private */
  _onDragEnd(e) {
    this.toggleAttribute("dragging-rows", !1), e.stopPropagation();
    const i = new CustomEvent("grid-dragend");
    i.originalEvent = e, this.dispatchEvent(i);
  }
  /** @private */
  _onDragLeave(e) {
    e.stopPropagation(), this._clearDragStyles();
  }
  /** @private */
  _onDragOver(e) {
    if (this.dropMode) {
      if (this._dropLocation = void 0, this._dragOverItem = void 0, this.__dndAutoScroll(e.clientY)) {
        this._clearDragStyles();
        return;
      }
      let i = e.composedPath().find((r) => r.localName === "tr");
      if (!this._effectiveSize || this.dropMode === tt.ON_GRID)
        this._dropLocation = re.EMPTY;
      else if (!i || i.parentNode !== this.$.items) {
        if (i)
          return;
        if (this.dropMode === tt.BETWEEN || this.dropMode === tt.ON_TOP_OR_BETWEEN)
          i = Array.from(this.$.items.children).filter((r) => !r.hidden).pop(), this._dropLocation = re.BELOW;
        else
          return;
      } else {
        const r = i.getBoundingClientRect();
        if (this._dropLocation = re.ON_TOP, this.dropMode === tt.BETWEEN) {
          const s = e.clientY - r.top < r.bottom - e.clientY;
          this._dropLocation = s ? re.ABOVE : re.BELOW;
        } else
          this.dropMode === tt.ON_TOP_OR_BETWEEN && (e.clientY - r.top < r.height / 3 ? this._dropLocation = re.ABOVE : e.clientY - r.top > r.height / 3 * 2 && (this._dropLocation = re.BELOW));
      }
      if (i && i.hasAttribute("drop-disabled")) {
        this._dropLocation = void 0;
        return;
      }
      e.stopPropagation(), e.preventDefault(), this._dropLocation === re.EMPTY ? this.toggleAttribute("dragover", !0) : i ? (this._dragOverItem = i._item, i.getAttribute("dragover") !== this._dropLocation && xs(i, { dragover: this._dropLocation })) : this._clearDragStyles();
    }
  }
  /** @private */
  __dndAutoScroll(e) {
    if (this.__dndAutoScrolling)
      return !0;
    const i = this.$.header.getBoundingClientRect().bottom, r = this.$.footer.getBoundingClientRect().top, s = i - e + this.__dndAutoScrollThreshold, n = e - r + this.__dndAutoScrollThreshold;
    let a = 0;
    if (n > 0 ? a = n * 2 : s > 0 && (a = -s * 2), a) {
      const l = this.$.table.scrollTop;
      if (this.$.table.scrollTop += a, l !== this.$.table.scrollTop)
        return this.__dndAutoScrolling = !0, setTimeout(() => {
          this.__dndAutoScrolling = !1;
        }, 20), !0;
    }
  }
  /** @private */
  __getViewportRows() {
    const e = this.$.header.getBoundingClientRect().bottom, i = this.$.footer.getBoundingClientRect().top;
    return Array.from(this.$.items.children).filter((r) => {
      const s = r.getBoundingClientRect();
      return s.bottom > e && s.top < i;
    });
  }
  /** @protected */
  _clearDragStyles() {
    this.removeAttribute("dragover"), P(this.$.items, (e) => {
      xs(e, { dragover: null });
    });
  }
  /** @private */
  _onDrop(e) {
    if (this.dropMode) {
      e.stopPropagation(), e.preventDefault();
      const i = e.dataTransfer.types && Array.from(e.dataTransfer.types).map((s) => ({
        type: s,
        data: e.dataTransfer.getData(s)
      }));
      this._clearDragStyles();
      const r = new CustomEvent("grid-drop", {
        bubbles: e.bubbles,
        cancelable: e.cancelable,
        detail: {
          dropTargetItem: this._dragOverItem,
          dropLocation: this._dropLocation,
          dragData: i
        }
      });
      r.originalEvent = e, this.dispatchEvent(r);
    }
  }
  /** @private */
  __formatDefaultTransferData(e) {
    return e.map((i) => Array.from(i.children).filter((r) => !r.hidden && r.getAttribute("part").indexOf("details-cell") === -1).sort((r, s) => r._column._order > s._column._order ? 1 : -1).map((r) => r._content.textContent.trim()).filter((r) => r).join("	")).join(`
`);
  }
  /** @private */
  _dragDropAccessChanged() {
    this.filterDragAndDrop();
  }
  /**
   * Runs the `dragFilter` and `dropFilter` hooks for the visible cells.
   * If the filter depends on varying conditions, you may need to
   * call this function manually in order to update the draggability when
   * the conditions change.
   */
  filterDragAndDrop() {
    P(this.$.items, (e) => {
      e.hidden || this._filterDragAndDrop(e, this.__getRowModel(e));
    });
  }
  /**
   * @param {!HTMLElement} row
   * @param {!GridItemModel} model
   * @protected
   */
  _filterDragAndDrop(e, i) {
    const r = this.loading || e.hasAttribute("loading"), s = !this.rowsDraggable || r || this.dragFilter && !this.dragFilter(i), n = !this.dropMode || r || this.dropFilter && !this.dropFilter(i);
    P(e, (a) => {
      s ? a._content.removeAttribute("draggable") : a._content.setAttribute("draggable", !0);
    }), lt(e, {
      "drag-disabled": !!s,
      "drop-disabled": !!n
    });
  }
  /**
   * Fired when starting to drag grid rows.
   *
   * @event grid-dragstart
   * @param {Object} originalEvent The native dragstart event
   * @param {Object} detail
   * @param {Object} detail.draggedItems the items in the visible viewport that are dragged
   * @param {Function} detail.setDraggedItemsCount Overrides the default number shown in the drag image on multi row drag.
   * Parameter is of type number.
   * @param {Function} detail.setDragData Sets dataTransfer data for the drag operation.
   * Note that "text" is the only data type supported by all the browsers the grid currently supports (including IE11).
   * The function takes two parameters:
   * - type:string The type of the data
   * - data:string The data
   */
  /**
   * Fired when the dragging of the rows ends.
   *
   * @event grid-dragend
   * @param {Object} originalEvent The native dragend event
   */
  /**
   * Fired when a drop occurs on top of the grid.
   *
   * @event grid-drop
   * @param {Object} originalEvent The native drop event
   * @param {Object} detail
   * @param {Object} detail.dropTargetItem The item of the grid row on which the drop occurred.
   * @param {string} detail.dropLocation The position at which the drop event took place relative to a row.
   * Depending on the dropMode value, the drop location can be one of the following
   * - `on-top`: when the drop occurred on top of the row
   * - `above`: when the drop occurred above the row
   * - `below`: when the drop occurred below the row
   * - `empty`: when the drop occurred over the grid, not relative to any specific row
   * @param {string} detail.dragData An array of items with the payload as a string representation as the
   * `data` property and the type of the data as `type` property.
   */
};
/**
 * @license
 * Copyright (c) 2016 - 2023 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
function Ta(o, t) {
  if (!o || !t || o.length !== t.length)
    return !1;
  for (let e = 0, i = o.length; e < i; e++)
    if (o[e] instanceof Array && t[e] instanceof Array) {
      if (!Ta(o[e], t[e]))
        return !1;
    } else if (o[e] !== t[e])
      return !1;
  return !0;
}
const gu = (o) => class extends o {
  static get properties() {
    return {
      /**
       * @protected
       */
      _columnTree: Object
    };
  }
  /** @protected */
  ready() {
    super.ready(), this._addNodeObserver();
  }
  /** @private */
  _hasColumnGroups(e) {
    return e.some((i) => i.localName === "vaadin-grid-column-group");
  }
  /**
   * @param {!GridColumnGroup} el
   * @return {!Array<!GridColumn>}
   * @protected
   */
  _getChildColumns(e) {
    return Fe.getFlattenedNodes(e).filter(this._isColumnElement);
  }
  /** @private */
  _flattenColumnGroups(e) {
    return e.map((i) => i.localName === "vaadin-grid-column-group" ? this._getChildColumns(i) : [i]).reduce((i, r) => i.concat(r), []);
  }
  /** @private */
  _getColumnTree() {
    const e = Fe.getFlattenedNodes(this).filter(this._isColumnElement), i = [e];
    let r = e;
    for (; this._hasColumnGroups(r); )
      r = this._flattenColumnGroups(r), i.push(r);
    return i;
  }
  /** @protected */
  _debounceUpdateColumnTree() {
    this.__updateColumnTreeDebouncer = w.debounce(
      this.__updateColumnTreeDebouncer,
      de,
      () => this._updateColumnTree()
    );
  }
  /** @protected */
  _updateColumnTree() {
    const e = this._getColumnTree();
    Ta(e, this._columnTree) || (this._columnTree = e);
  }
  /** @private */
  _addNodeObserver() {
    this._observer = new Fe(this, (e) => {
      const i = (r) => r.filter(this._isColumnElement).length > 0;
      if (i(e.addedNodes) || i(e.removedNodes)) {
        const r = e.removedNodes.flatMap((n) => n._allCells), s = (n) => r.filter((a) => a._content.contains(n)).length;
        this.__removeSorters(this._sorters.filter(s)), this.__removeFilters(this._filters.filter(s)), this._debounceUpdateColumnTree();
      }
      this._debouncerCheckImports = w.debounce(
        this._debouncerCheckImports,
        L.after(2e3),
        this._checkImports.bind(this)
      ), this._ensureFirstPageLoaded();
    });
  }
  /** @protected */
  _checkImports() {
    [
      "vaadin-grid-column-group",
      "vaadin-grid-filter",
      "vaadin-grid-filter-column",
      "vaadin-grid-tree-toggle",
      "vaadin-grid-selection-column",
      "vaadin-grid-sort-column",
      "vaadin-grid-sorter"
    ].forEach((e) => {
      const i = this.querySelector(e);
      i && i instanceof A;
    });
  }
  /** @protected */
  _updateFirstAndLastColumn() {
    Array.from(this.shadowRoot.querySelectorAll("tr")).forEach((e) => this._updateFirstAndLastColumnForRow(e));
  }
  /**
   * @param {!HTMLElement} row
   * @protected
   */
  _updateFirstAndLastColumnForRow(e) {
    Array.from(e.querySelectorAll('[part~="cell"]:not([part~="details-cell"])')).sort((i, r) => i._column._order - r._column._order).forEach((i, r, s) => {
      me(i, "first-column", r === 0), me(i, "last-column", r === s.length - 1);
    });
  }
  /**
   * @param {!Node} node
   * @return {boolean}
   * @protected
   */
  _isColumnElement(e) {
    return e.nodeType === Node.ELEMENT_NODE && /\bcolumn\b/u.test(e.localName);
  }
};
/**
 * @license
 * Copyright (c) 2016 - 2023 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
const bu = (o) => class extends o {
  /**
   * Returns an object with context information about the event target:
   * - `item`: the data object corresponding to the targeted row (not specified when targeting header or footer)
   * - `column`: the column element corresponding to the targeted cell (not specified when targeting row details)
   * - `section`: whether the event targeted the body, header, footer or details of the grid
   *
   * These additional properties are included when `item` is specified:
   * - `index`: the index of the item
   * - `selected`: the selected state of the item
   * - `detailsOpened`: whether the row details are open for the item
   * - `expanded`: the expanded state of the tree toggle
   * - `level`: the tree hierarchy level
   *
   * The returned object is populated only when a grid cell, header, footer or row details is found in `event.composedPath()`.
   * This means mostly mouse and keyboard events. If such a grid part is not found in the path, an empty object is returned.
   * This may be the case eg. if the event is fired on the `<vaadin-grid>` element and not any deeper in the DOM, or if
   * the event targets the empty part of the grid body.
   *
   * @param {!Event} event
   * @return {GridEventContext}
   */
  getEventContext(e) {
    const i = {}, r = e.__composedPath || e.composedPath(), s = r[r.indexOf(this.$.table) - 3];
    return s && (i.section = ["body", "header", "footer", "details"].find(
      (n) => s.getAttribute("part").indexOf(n) > -1
    ), s._column && (i.column = s._column), (i.section === "body" || i.section === "details") && Object.assign(i, this.__getRowModel(s.parentElement))), i;
  }
};
/**
 * @license
 * Copyright (c) 2016 - 2023 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
const vu = (o) => class extends o {
  static get properties() {
    return {
      /** @private */
      _filters: {
        type: Array,
        value: () => []
      }
    };
  }
  /** @protected */
  ready() {
    super.ready(), this.addEventListener("filter-changed", this._filterChanged.bind(this));
  }
  /** @private */
  _filterChanged(e) {
    e.stopPropagation(), this.__addFilter(e.target), this.__applyFilters();
  }
  /** @private */
  __removeFilters(e) {
    e.length !== 0 && (this._filters = this._filters.filter((i) => e.indexOf(i) < 0), this.__applyFilters());
  }
  /** @private */
  __addFilter(e) {
    this._filters.indexOf(e) === -1 && this._filters.push(e);
  }
  /** @private */
  __applyFilters() {
    this.dataProvider && this.isAttached && this.clearCache();
  }
  /**
   * @return {!Array<!GridFilterDefinition>}
   * @protected
   */
  _mapFilters() {
    return this._filters.map((e) => ({
      path: e.path,
      value: e.value
    }));
  }
};
/**
 * @license
 * Copyright (c) 2016 - 2023 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
const yu = (o) => class extends o {
  static get properties() {
    return {
      /** @private */
      _headerFocusable: {
        type: Object,
        observer: "_focusableChanged"
      },
      /**
       * @type {!HTMLElement | undefined}
       * @protected
       */
      _itemsFocusable: {
        type: Object,
        observer: "_focusableChanged"
      },
      /** @private */
      _footerFocusable: {
        type: Object,
        observer: "_focusableChanged"
      },
      /** @private */
      _navigatingIsHidden: Boolean,
      /**
       * @type {number}
       * @protected
       */
      _focusedItemIndex: {
        type: Number,
        value: 0
      },
      /** @private */
      _focusedColumnOrder: Number,
      /** @private */
      _focusedCell: {
        type: Object,
        observer: "_focusedCellChanged"
      },
      /**
       * Indicates whether the grid is currently in interaction mode.
       * In interaction mode the user is currently interacting with a control,
       * such as an input or a select, within a cell.
       * In interaction mode keyboard navigation between cells is disabled.
       * Interaction mode also prevents the focus target cell of that section of
       * the grid from receiving focus, allowing the user to switch focus to
       * controls in adjacent cells, rather than focussing the outer cell
       * itself.
       * @type {boolean}
       * @private
       */
      interacting: {
        type: Boolean,
        value: !1,
        reflectToAttribute: !0,
        readOnly: !0,
        observer: "_interactingChanged"
      }
    };
  }
  /** @private */
  get __rowFocusMode() {
    return this.__isRow(this._itemsFocusable) || this.__isRow(this._headerFocusable) || this.__isRow(this._footerFocusable);
  }
  set __rowFocusMode(e) {
    ["_itemsFocusable", "_footerFocusable", "_headerFocusable"].forEach((i) => {
      const r = this[i];
      if (e) {
        const s = r && r.parentElement;
        this.__isCell(r) ? this[i] = s : this.__isCell(s) && (this[i] = s.parentElement);
      } else if (!e && this.__isRow(r)) {
        const s = r.firstElementChild;
        this[i] = s._focusButton || s;
      }
    });
  }
  /** @protected */
  ready() {
    super.ready(), !(this._ios || this._android) && (this.addEventListener("keydown", this._onKeyDown), this.addEventListener("keyup", this._onKeyUp), this.addEventListener("focusin", this._onFocusIn), this.addEventListener("focusout", this._onFocusOut), this.$.table.addEventListener("focusin", this._onContentFocusIn.bind(this)), this.addEventListener("mousedown", () => {
      this.toggleAttribute("navigating", !1), this._isMousedown = !0, this._focusedColumnOrder = void 0;
    }), this.addEventListener("mouseup", () => {
      this._isMousedown = !1;
    }));
  }
  /** @private */
  _focusableChanged(e, i) {
    i && i.setAttribute("tabindex", "-1"), e && this._updateGridSectionFocusTarget(e);
  }
  /** @private */
  _focusedCellChanged(e, i) {
    i && Rr(i, "part", "focused-cell"), e && hi(e, "part", "focused-cell");
  }
  /** @private */
  _interactingChanged() {
    this._updateGridSectionFocusTarget(this._headerFocusable), this._updateGridSectionFocusTarget(this._itemsFocusable), this._updateGridSectionFocusTarget(this._footerFocusable);
  }
  /**
   * Since the focused cell/row state is stored as an element reference, the reference may get
   * out of sync when the virtual indexes for elements update due to effective size change.
   * This function updates the reference to the correct element after a possible index change.
   * @private
   */
  __updateItemsFocusable() {
    if (!this._itemsFocusable)
      return;
    const e = this.shadowRoot.activeElement === this._itemsFocusable;
    this._getVisibleRows().forEach((i) => {
      if (i.index === this._focusedItemIndex)
        if (this.__rowFocusMode)
          this._itemsFocusable = i;
        else {
          let r = this._itemsFocusable.parentElement, s = this._itemsFocusable;
          if (r) {
            this.__isCell(r) && (s = r, r = r.parentElement);
            const n = [...r.children].indexOf(s);
            this._itemsFocusable = this.__getFocusable(i, i.children[n]);
          }
        }
    }), e && this._itemsFocusable.focus();
  }
  /**
   * @param {!KeyboardEvent} e
   * @protected
   */
  _onKeyDown(e) {
    const i = e.key;
    let r;
    switch (i) {
      case "ArrowUp":
      case "ArrowDown":
      case "ArrowLeft":
      case "ArrowRight":
      case "PageUp":
      case "PageDown":
      case "Home":
      case "End":
        r = "Navigation";
        break;
      case "Enter":
      case "Escape":
      case "F2":
        r = "Interaction";
        break;
      case "Tab":
        r = "Tab";
        break;
      case " ":
        r = "Space";
        break;
    }
    this._detectInteracting(e), this.interacting && r !== "Interaction" && (r = void 0), r && this[`_on${r}KeyDown`](e, i);
  }
  /** @private */
  _ensureScrolledToIndex(e) {
    [...this.$.items.children].find((r) => r.index === e) ? this.__scrollIntoViewport(e) : this.scrollToIndex(e);
  }
  /** @private */
  __isRowExpandable(e) {
    if (this.itemHasChildrenPath) {
      const i = e._item;
      return i && this.get(this.itemHasChildrenPath, i) && !this._isExpanded(i);
    }
  }
  /** @private */
  __isRowCollapsible(e) {
    return this._isExpanded(e._item);
  }
  /** @private */
  __isDetailsCell(e) {
    return e.matches('[part~="details-cell"]');
  }
  /** @private */
  __isCell(e) {
    return e instanceof HTMLTableCellElement;
  }
  /** @private */
  __isRow(e) {
    return e instanceof HTMLTableRowElement;
  }
  /** @private */
  __getIndexOfChildElement(e) {
    return Array.prototype.indexOf.call(e.parentNode.children, e);
  }
  /** @private */
  _onNavigationKeyDown(e, i) {
    e.preventDefault();
    const r = this._lastVisibleIndex - this._firstVisibleIndex - 1, s = this.__isRTL;
    let n = 0, a = 0;
    switch (i) {
      case "ArrowRight":
        n = s ? -1 : 1;
        break;
      case "ArrowLeft":
        n = s ? 1 : -1;
        break;
      case "Home":
        this.__rowFocusMode || e.ctrlKey ? a = -1 / 0 : n = -1 / 0;
        break;
      case "End":
        this.__rowFocusMode || e.ctrlKey ? a = 1 / 0 : n = 1 / 0;
        break;
      case "ArrowDown":
        a = 1;
        break;
      case "ArrowUp":
        a = -1;
        break;
      case "PageDown":
        a = r;
        break;
      case "PageUp":
        a = -r;
        break;
    }
    const l = e.composedPath().find((u) => this.__isRow(u)), d = e.composedPath().find((u) => this.__isCell(u));
    if (this.__rowFocusMode && !l || !this.__rowFocusMode && !d)
      return;
    const c = s ? "ArrowLeft" : "ArrowRight", h = s ? "ArrowRight" : "ArrowLeft";
    if (i === c) {
      if (this.__rowFocusMode) {
        if (this.__isRowExpandable(l)) {
          this.expandItem(l._item);
          return;
        }
        this.__rowFocusMode = !1, this._onCellNavigation(l.firstElementChild, 0, 0);
        return;
      }
    } else if (i === h)
      if (this.__rowFocusMode) {
        if (this.__isRowCollapsible(l)) {
          this.collapseItem(l._item);
          return;
        }
      } else {
        const u = [...l.children].sort((p, f) => p._order - f._order);
        if (d === u[0] || this.__isDetailsCell(d)) {
          this.__rowFocusMode = !0, this._onRowNavigation(l, 0);
          return;
        }
      }
    this.__rowFocusMode ? this._onRowNavigation(l, a) : this._onCellNavigation(d, n, a);
  }
  /**
   * Focuses the target row after navigating by the given dy offset.
   * If the row is not in the viewport, it is first scrolled to.
   * @private
   */
  _onRowNavigation(e, i) {
    const { dstRow: r } = this.__navigateRows(i, e);
    r && r.focus();
  }
  /** @private */
  __getIndexInGroup(e, i) {
    return e.parentNode === this.$.items ? i !== void 0 ? i : e.index : this.__getIndexOfChildElement(e);
  }
  /**
   * Returns the target row after navigating by the given dy offset.
   * Also returns information whether the details cell should be the target on the target row.
   * If the row is not in the viewport, it is first scrolled to.
   * @private
   */
  __navigateRows(e, i, r) {
    const s = this.__getIndexInGroup(i, this._focusedItemIndex), n = i.parentNode, a = (n === this.$.items ? this._effectiveSize : n.children.length) - 1;
    let l = Math.max(0, Math.min(s + e, a));
    if (n !== this.$.items) {
      if (l > s)
        for (; l < a && n.children[l].hidden; )
          l += 1;
      else if (l < s)
        for (; l > 0 && n.children[l].hidden; )
          l -= 1;
      return this.toggleAttribute("navigating", !0), { dstRow: n.children[l] };
    }
    let d = !1;
    if (r) {
      const c = this.__isDetailsCell(r);
      if (n === this.$.items) {
        const h = i._item, u = this._cache.getItemForIndex(l);
        c ? d = e === 0 : d = e === 1 && this._isDetailsOpened(h) || e === -1 && l !== s && this._isDetailsOpened(u), d !== c && (e === 1 && d || e === -1 && !d) && (l = s);
      }
    }
    return this._ensureScrolledToIndex(l), this._focusedItemIndex = l, this.toggleAttribute("navigating", !0), {
      dstRow: [...n.children].find((c) => !c.hidden && c.index === l),
      dstIsRowDetails: d
    };
  }
  /**
   * Focuses the target cell after navigating by the given dx and dy offset.
   * If the cell is not in the viewport, it is first scrolled to.
   * @private
   */
  _onCellNavigation(e, i, r) {
    const s = e.parentNode, { dstRow: n, dstIsRowDetails: a } = this.__navigateRows(r, s, e);
    if (!n)
      return;
    let l = this.__getIndexOfChildElement(e);
    this.$.items.contains(e) && (l = [...this.$.sizer.children].findIndex((u) => u._column === e._column));
    const d = this.__isDetailsCell(e), c = s.parentNode, h = this.__getIndexInGroup(s, this._focusedItemIndex);
    if (this._focusedColumnOrder === void 0 && (d ? this._focusedColumnOrder = 0 : this._focusedColumnOrder = this._getColumns(c, h).filter((u) => !u.hidden)[l]._order), a)
      [...n.children].find((p) => this.__isDetailsCell(p)).focus();
    else {
      const u = this.__getIndexInGroup(n, this._focusedItemIndex), p = this._getColumns(c, u).filter(($) => !$.hidden), f = p.map(($) => $._order).sort(($, _e) => $ - _e), x = f.length - 1, T = f.indexOf(
        f.slice(0).sort(($, _e) => Math.abs($ - this._focusedColumnOrder) - Math.abs(_e - this._focusedColumnOrder))[0]
      ), z = r === 0 && d ? T : Math.max(0, Math.min(T + i, x));
      z !== T && (this._focusedColumnOrder = void 0);
      const Y = p.reduce(($, _e, Va) => ($[_e._order] = Va, $), {})[f[z]];
      let K;
      if (this.$.items.contains(e)) {
        const $ = this.$.sizer.children[Y];
        this._lazyColumns && (this.__isColumnInViewport($._column) || $.scrollIntoView(), this.__updateColumnsBodyContentHidden(), this.__updateHorizontalScrollPosition()), K = [...n.children].find((_e) => _e._column === $._column), this._scrollHorizontallyToCell(K);
      } else
        K = n.children[Y], this._scrollHorizontallyToCell(K);
      K.focus();
    }
  }
  /** @private */
  _onInteractionKeyDown(e, i) {
    const r = e.composedPath()[0], s = r.localName === "input" && !/^(button|checkbox|color|file|image|radio|range|reset|submit)$/iu.test(r.type);
    let n;
    switch (i) {
      case "Enter":
        n = this.interacting ? !s : !0;
        break;
      case "Escape":
        n = !1;
        break;
      case "F2":
        n = !this.interacting;
        break;
    }
    const { cell: a } = this._getGridEventLocation(e);
    if (this.interacting !== n && a !== null)
      if (n) {
        const l = a._content.querySelector("[focus-target]") || // If a child element hasn't been explicitly marked as a focus target,
        // fall back to any focusable element inside the cell.
        [...a._content.querySelectorAll("*")].find((d) => this._isFocusable(d));
        l && (e.preventDefault(), l.focus(), this._setInteracting(!0), this.toggleAttribute("navigating", !1));
      } else
        e.preventDefault(), this._focusedColumnOrder = void 0, a.focus(), this._setInteracting(!1), this.toggleAttribute("navigating", !0);
    i === "Escape" && this._hideTooltip(!0);
  }
  /** @private */
  _predictFocusStepTarget(e, i) {
    const r = [
      this.$.table,
      this._headerFocusable,
      this._itemsFocusable,
      this._footerFocusable,
      this.$.focusexit
    ];
    let s = r.indexOf(e);
    for (s += i; s >= 0 && s <= r.length - 1; ) {
      let n = r[s];
      if (n && !this.__rowFocusMode && (n = r[s].parentNode), !n || n.hidden)
        s += i;
      else
        break;
    }
    return r[s];
  }
  /** @private */
  _onTabKeyDown(e) {
    const i = this._predictFocusStepTarget(e.composedPath()[0], e.shiftKey ? -1 : 1);
    if (i) {
      if (e.stopPropagation(), i === this.$.table)
        this.$.table.focus();
      else if (i === this.$.focusexit)
        this.$.focusexit.focus();
      else if (i === this._itemsFocusable) {
        let r = i;
        const s = this.__isRow(i) ? i : i.parentNode;
        if (this._ensureScrolledToIndex(this._focusedItemIndex), s.index !== this._focusedItemIndex && this.__isCell(i)) {
          const n = Array.from(s.children).indexOf(this._itemsFocusable), a = Array.from(this.$.items.children).find(
            (l) => !l.hidden && l.index === this._focusedItemIndex
          );
          a && (r = a.children[n]);
        }
        e.preventDefault(), r.focus();
      } else
        e.preventDefault(), i.focus();
      this.toggleAttribute("navigating", !0);
    }
  }
  /** @private */
  _onSpaceKeyDown(e) {
    e.preventDefault();
    const i = e.composedPath()[0], r = this.__isRow(i);
    (r || !i._content || !i._content.firstElementChild) && this.dispatchEvent(
      new CustomEvent(r ? "row-activate" : "cell-activate", {
        detail: {
          model: this.__getRowModel(r ? i : i.parentElement)
        }
      })
    );
  }
  /** @private */
  _onKeyUp(e) {
    if (!/^( |SpaceBar)$/u.test(e.key) || this.interacting)
      return;
    e.preventDefault();
    const i = e.composedPath()[0];
    if (i._content && i._content.firstElementChild) {
      const r = this.hasAttribute("navigating");
      i._content.firstElementChild.dispatchEvent(
        new MouseEvent("click", {
          shiftKey: e.shiftKey,
          bubbles: !0,
          composed: !0,
          cancelable: !0
        })
      ), this.toggleAttribute("navigating", r);
    }
  }
  /**
   * @param {!FocusEvent} e
   * @protected
   */
  _onFocusIn(e) {
    this._isMousedown || this.toggleAttribute("navigating", !0);
    const i = e.composedPath()[0];
    i === this.$.table || i === this.$.focusexit ? (this._predictFocusStepTarget(i, i === this.$.table ? 1 : -1).focus(), this._setInteracting(!1)) : this._detectInteracting(e);
  }
  /**
   * @param {!FocusEvent} e
   * @protected
   */
  _onFocusOut(e) {
    this.toggleAttribute("navigating", !1), this._detectInteracting(e), this._hideTooltip(), this._focusedCell = null;
  }
  /** @private */
  _onContentFocusIn(e) {
    const { section: i, cell: r, row: s } = this._getGridEventLocation(e);
    if (!(!r && !this.__rowFocusMode)) {
      if (this._detectInteracting(e), i && (r || s))
        if (this._activeRowGroup = i, this.$.header === i ? this._headerFocusable = this.__getFocusable(s, r) : this.$.items === i ? this._itemsFocusable = this.__getFocusable(s, r) : this.$.footer === i && (this._footerFocusable = this.__getFocusable(s, r)), r) {
          const n = this.getEventContext(e);
          r.dispatchEvent(new CustomEvent("cell-focus", { bubbles: !0, composed: !0, detail: { context: n } })), this._focusedCell = r._focusButton || r, $n() && e.target === r && this._showTooltip(e);
        } else
          this._focusedCell = null;
      this._detectFocusedItemIndex(e);
    }
  }
  /**
   * Get the focusable element depending on the current focus mode.
   * It can be a row, a cell, or a focusable div inside a cell.
   *
   * @param {HTMLElement} row
   * @param {HTMLElement} cell
   * @return {HTMLElement}
   * @private
   */
  __getFocusable(e, i) {
    return this.__rowFocusMode ? e : i._focusButton || i;
  }
  /**
   * Enables interaction mode if a cells descendant receives focus or keyboard
   * input. Disables it if the event is not related to cell content.
   * @param {!KeyboardEvent|!FocusEvent} e
   * @private
   */
  _detectInteracting(e) {
    const i = e.composedPath().some((r) => r.localName === "vaadin-grid-cell-content");
    this._setInteracting(i), this.__updateHorizontalScrollPosition();
  }
  /** @private */
  _detectFocusedItemIndex(e) {
    const { section: i, row: r } = this._getGridEventLocation(e);
    i === this.$.items && (this._focusedItemIndex = r.index);
  }
  /**
   * Enables or disables the focus target of the containing section of the
   * grid from receiving focus, based on whether the user is interacting with
   * that section of the grid.
   * @param {HTMLElement} focusTarget
   * @private
   */
  _updateGridSectionFocusTarget(e) {
    if (!e)
      return;
    const i = this._getGridSectionFromFocusTarget(e), r = this.interacting && i === this._activeRowGroup;
    e.tabIndex = r ? -1 : 0;
  }
  /**
   * @param {!HTMLTableRowElement} row
   * @param {number} index
   * @protected
   */
  _preventScrollerRotatingCellFocus(e, i) {
    e.index === this._focusedItemIndex && this.hasAttribute("navigating") && this._activeRowGroup === this.$.items && (this._navigatingIsHidden = !0, this.toggleAttribute("navigating", !1)), i === this._focusedItemIndex && this._navigatingIsHidden && (this._navigatingIsHidden = !1, this.toggleAttribute("navigating", !0));
  }
  /**
   * @param {HTMLTableSectionElement=} rowGroup
   * @param {number=} rowIndex
   * @return {!Array<!GridColumn>}
   * @protected
   */
  _getColumns(e, i) {
    let r = this._columnTree.length - 1;
    return e === this.$.header ? r = i : e === this.$.footer && (r = this._columnTree.length - 1 - i), this._columnTree[r];
  }
  /** @private */
  __isValidFocusable(e) {
    return this.$.table.contains(e) && e.offsetHeight;
  }
  /** @protected */
  _resetKeyboardNavigation() {
    if (["header", "footer"].forEach((e) => {
      if (!this.__isValidFocusable(this[`_${e}Focusable`])) {
        const i = [...this.$[e].children].find((s) => s.offsetHeight), r = i ? [...i.children].find((s) => !s.hidden) : null;
        i && r && (this[`_${e}Focusable`] = this.__getFocusable(i, r));
      }
    }), !this.__isValidFocusable(this._itemsFocusable) && this.$.items.firstElementChild) {
      const e = this.__getFirstVisibleItem(), i = e ? [...e.children].find((r) => !r.hidden) : null;
      i && e && (delete this._focusedColumnOrder, this._itemsFocusable = this.__getFocusable(e, i));
    } else
      this.__updateItemsFocusable();
  }
  /**
   * @param {!HTMLElement} dstCell
   * @protected
   */
  _scrollHorizontallyToCell(e) {
    if (e.hasAttribute("frozen") || e.hasAttribute("frozen-to-end") || this.__isDetailsCell(e))
      return;
    const i = e.getBoundingClientRect(), r = e.parentNode, s = Array.from(r.children).indexOf(e), n = this.$.table.getBoundingClientRect();
    let a = n.left, l = n.right;
    for (let d = s - 1; d >= 0; d--) {
      const c = r.children[d];
      if (!(c.hasAttribute("hidden") || this.__isDetailsCell(c)) && (c.hasAttribute("frozen") || c.hasAttribute("frozen-to-end"))) {
        a = c.getBoundingClientRect().right;
        break;
      }
    }
    for (let d = s + 1; d < r.children.length; d++) {
      const c = r.children[d];
      if (!(c.hasAttribute("hidden") || this.__isDetailsCell(c)) && (c.hasAttribute("frozen") || c.hasAttribute("frozen-to-end"))) {
        l = c.getBoundingClientRect().left;
        break;
      }
    }
    i.left < a && (this.$.table.scrollLeft += Math.round(i.left - a)), i.right > l && (this.$.table.scrollLeft += Math.round(i.right - l));
  }
  /**
   * @typedef {Object} GridEventLocation
   * @property {HTMLTableSectionElement | null} section - The table section element that the event occurred in (header, body, or footer), or null if the event did not occur in a section
   * @property {HTMLTableRowElement | null} row - The row element that the event occurred in, or null if the event did not occur in a row
   * @property {HTMLTableCellElement | null} cell - The cell element that the event occurred in, or null if the event did not occur in a cell
   * @private
   */
  /**
   * Takes an event and returns a location object describing in which part of the grid the event occurred.
   * The event may either target table section, a row, a cell or contents of a cell.
   * @param {Event} e
   * @returns {GridEventLocation}
   * @private
   */
  _getGridEventLocation(e) {
    const i = e.composedPath(), r = i.indexOf(this.$.table), s = r >= 1 ? i[r - 1] : null, n = r >= 2 ? i[r - 2] : null, a = r >= 3 ? i[r - 3] : null;
    return {
      section: s,
      row: n,
      cell: a
    };
  }
  /**
   * Helper method that maps a focus target cell to the containing grid section
   * @param {HTMLElement} focusTarget
   * @returns {HTMLTableSectionElement | null}
   * @private
   */
  _getGridSectionFromFocusTarget(e) {
    return e === this._headerFocusable ? this.$.header : e === this._itemsFocusable ? this.$.items : e === this._footerFocusable ? this.$.footer : null;
  }
  /**
   * Fired when a cell is focused with click or keyboard navigation.
   *
   * Use context property of @see {@link GridCellFocusEvent} to get detail information about the event.
   *
   * @event cell-focus
   */
};
/**
 * @license
 * Copyright (c) 2016 - 2023 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
const Cu = (o) => class extends o {
  static get properties() {
    return {
      /**
       * An array containing references to items with open row details.
       * @type {!Array<!GridItem>}
       */
      detailsOpenedItems: {
        type: Array,
        value: () => []
      },
      /**
       * Custom function for rendering the content of the row details.
       * Receives three arguments:
       *
       * - `root` The row details content DOM element. Append your content to it.
       * - `grid` The `<vaadin-grid>` element.
       * - `model` The object with the properties related with
       *   the rendered item, contains:
       *   - `model.index` The index of the item.
       *   - `model.item` The item.
       *   - `model.level` The number of the item's tree sublevel, starts from 0.
       *   - `model.expanded` True if the item's tree sublevel is expanded.
       *   - `model.selected` True if the item is selected.
       *
       * @type {GridRowDetailsRenderer | null | undefined}
       */
      rowDetailsRenderer: Function,
      /**
       * @type {!Array<!HTMLElement> | undefined}
       * @protected
       */
      _detailsCells: {
        type: Array
      }
    };
  }
  static get observers() {
    return [
      "_detailsOpenedItemsChanged(detailsOpenedItems.*, rowDetailsRenderer)",
      "_rowDetailsRendererChanged(rowDetailsRenderer)"
    ];
  }
  /** @protected */
  ready() {
    super.ready(), this._detailsCellResizeObserver = new ResizeObserver((e) => {
      e.forEach(({ target: i }) => {
        this._updateDetailsCellHeight(i.parentElement);
      }), this.__virtualizer.__adapter._resizeHandler();
    });
  }
  /** @private */
  _rowDetailsRendererChanged(e) {
    e && this._columnTree && P(this.$.items, (i) => {
      if (!i.querySelector("[part~=details-cell]")) {
        this._updateRow(i, this._columnTree[this._columnTree.length - 1]);
        const r = this._isDetailsOpened(i._item);
        this._toggleDetailsCell(i, r);
      }
    });
  }
  /** @private */
  _detailsOpenedItemsChanged(e, i) {
    e.path === "detailsOpenedItems.length" || !e.value || P(this.$.items, (r) => {
      if (r.hasAttribute("details-opened")) {
        this._updateItem(r, r._item);
        return;
      }
      i && this._isDetailsOpened(r._item) && this._updateItem(r, r._item);
    });
  }
  /**
   * @param {!HTMLElement} cell
   * @protected
   */
  _configureDetailsCell(e) {
    e.setAttribute("part", "cell details-cell"), e.toggleAttribute("frozen", !0), this._detailsCellResizeObserver.observe(e);
  }
  /**
   * @param {!HTMLElement} row
   * @param {!GridItem} item
   * @protected
   */
  _toggleDetailsCell(e, i) {
    const r = e.querySelector('[part~="details-cell"]');
    r && (r.hidden = !i, !r.hidden && this.rowDetailsRenderer && (r._renderer = this.rowDetailsRenderer));
  }
  /** @protected */
  _updateDetailsCellHeight(e) {
    const i = e.querySelector('[part~="details-cell"]');
    i && (i.hidden ? e.style.removeProperty("padding-bottom") : e.style.setProperty("padding-bottom", `${i.offsetHeight}px`));
  }
  /** @protected */
  _updateDetailsCellHeights() {
    P(this.$.items, (e) => {
      this._updateDetailsCellHeight(e);
    });
  }
  /**
   * @param {!GridItem} item
   * @return {boolean}
   * @protected
   */
  _isDetailsOpened(e) {
    return this.detailsOpenedItems && this._getItemIndexInArray(e, this.detailsOpenedItems) !== -1;
  }
  /**
   * Open the details row of a given item.
   * @param {!GridItem} item
   */
  openItemDetails(e) {
    this._isDetailsOpened(e) || (this.detailsOpenedItems = [...this.detailsOpenedItems, e]);
  }
  /**
   * Close the details row of a given item.
   * @param {!GridItem} item
   */
  closeItemDetails(e) {
    this._isDetailsOpened(e) && (this.detailsOpenedItems = this.detailsOpenedItems.filter((i) => !this._itemsEqual(i, e)));
  }
};
/**
 * @license
 * Copyright (c) 2021 - 2023 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
function Es(o, t) {
  const { scrollLeft: e } = o;
  return t !== "rtl" ? e : o.scrollWidth - o.clientWidth + e;
}
/**
 * @license
 * Copyright (c) 2021 - 2023 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
const Vt = new ResizeObserver((o) => {
  setTimeout(() => {
    o.forEach((t) => {
      t.target.resizables ? t.target.resizables.forEach((e) => {
        e._onResize(t.contentRect);
      }) : t.target._onResize(t.contentRect);
    });
  });
}), xu = I(
  (o) => class extends o {
    /**
     * When true, the parent element resize will be also observed.
     * Override this getter and return `true` to enable this.
     *
     * @protected
     */
    get _observeParent() {
      return !1;
    }
    /** @protected */
    connectedCallback() {
      if (super.connectedCallback(), Vt.observe(this), this._observeParent) {
        const e = this.parentNode instanceof ShadowRoot ? this.parentNode.host : this.parentNode;
        e.resizables || (e.resizables = /* @__PURE__ */ new Set(), Vt.observe(e)), e.resizables.add(this), this.__parent = e;
      }
    }
    /** @protected */
    disconnectedCallback() {
      super.disconnectedCallback(), Vt.unobserve(this);
      const e = this.__parent;
      if (this._observeParent && e) {
        const i = e.resizables;
        i && (i.delete(this), i.size === 0 && Vt.unobserve(e)), this.__parent = null;
      }
    }
    /**
     * A handler invoked on host resize. By default, it does nothing.
     * Override the method to implement your own behavior.
     *
     * @protected
     */
    _onResize(e) {
    }
  }
);
/**
 * @license
 * Copyright (c) 2016 - 2023 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
const Ss = {
  SCROLLING: 500,
  UPDATE_CONTENT_VISIBILITY: 100
}, wu = (o) => class extends xu(o) {
  static get properties() {
    return {
      /**
       * Allows you to choose between modes for rendering columns in the grid:
       *
       * "eager" (default): All columns are rendered upfront, regardless of their visibility within the viewport.
       * This mode should generally be preferred, as it avoids the limitations imposed by the "lazy" mode.
       * Use this mode unless the grid has a large number of columns and performance outweighs the limitations
       * in priority.
       *
       * "lazy": Optimizes the rendering of cells when there are multiple columns in the grid by virtualizing
       * horizontal scrolling. In this mode, body cells are rendered only when their corresponding columns are
       * inside the visible viewport.
       *
       * Using "lazy" rendering should be used only if you're dealing with a large number of columns and performance
       * is your highest priority. For most use cases, the default "eager" mode is recommended due to the
       * limitations imposed by the "lazy" mode.
       *
       * When using the "lazy" mode, keep the following limitations in mind:
       *
       * - Row Height: When only a number of columns are visible at once, the height of a row can only be that of
       * the highest cell currently visible on that row. Make sure each cell on a single row has the same height
       * as all other cells on that row. If row cells have different heights, users may experience jumpiness when
       * scrolling the grid horizontally as lazily rendered cells with different heights are scrolled into view.
       *
       * - Auto-width Columns: For the columns that are initially outside the visible viewport but still use auto-width,
       * only the header content is taken into account when calculating the column width because the body cells
       * of the columns outside the viewport are not initially rendered.
       *
       * - Screen Reader Compatibility: Screen readers may not be able to associate the focused cells with the correct
       * headers when only a subset of the body cells on a row is rendered.
       *
       * - Keyboard Navigation: Tabbing through focusable elements inside the grid body may not work as expected because
       * some of the columns that would include focusable elements in the body cells may be outside the visible viewport
       * and thus not rendered.
       *
       * @attr {eager|lazy} column-rendering
       * @type {!ColumnRendering}
       */
      columnRendering: {
        type: String,
        value: "eager"
      },
      /**
       * Cached array of frozen cells
       * @private
       */
      _frozenCells: {
        type: Array,
        value: () => []
      },
      /**
       * Cached array of cells frozen to end
       * @private
       */
      _frozenToEndCells: {
        type: Array,
        value: () => []
      },
      /** @private */
      _rowWithFocusedElement: Element
    };
  }
  static get observers() {
    return ["__columnRenderingChanged(_columnTree, columnRendering)"];
  }
  /** @private */
  get _scrollLeft() {
    return this.$.table.scrollLeft;
  }
  /** @private */
  get _scrollTop() {
    return this.$.table.scrollTop;
  }
  /**
   * Override (from iron-scroll-target-behavior) to avoid document scroll
   * @private
   */
  set _scrollTop(e) {
    this.$.table.scrollTop = e;
  }
  /** @protected */
  get _lazyColumns() {
    return this.columnRendering === "lazy";
  }
  /** @protected */
  ready() {
    super.ready(), this.scrollTarget = this.$.table, this.$.items.addEventListener("focusin", (e) => {
      const i = e.composedPath().indexOf(this.$.items);
      this._rowWithFocusedElement = e.composedPath()[i - 1];
    }), this.$.items.addEventListener("focusout", () => {
      this._rowWithFocusedElement = void 0;
    }), this.$.table.addEventListener("scroll", () => this._afterScroll());
  }
  /**
   * @protected
   * @override
   */
  _onResize() {
    this._updateOverflow(), this.__updateHorizontalScrollPosition();
  }
  /**
   * Scroll to a flat index in the grid. The method doesn't take into account
   * the hierarchy of the items.
   *
   * @param {number} index Row index to scroll to
   * @protected
   */
  _scrollToFlatIndex(e) {
    e = Math.min(this._effectiveSize - 1, Math.max(0, e)), this.__virtualizer.scrollToIndex(e), this.__scrollIntoViewport(e);
  }
  /**
   * Makes sure the row with the given index (if found in the DOM) is fully
   * inside the visible viewport, taking header/footer into account.
   * @private
   */
  __scrollIntoViewport(e) {
    const i = [...this.$.items.children].find((r) => r.index === e);
    if (i) {
      const r = i.getBoundingClientRect(), s = this.$.footer.getBoundingClientRect().top, n = this.$.header.getBoundingClientRect().bottom;
      r.bottom > s ? this.$.table.scrollTop += r.bottom - s : r.top < n && (this.$.table.scrollTop -= n - r.top);
    }
  }
  /** @private */
  _scheduleScrolling() {
    this._scrollingFrame || (this._scrollingFrame = requestAnimationFrame(() => this.$.scroller.toggleAttribute("scrolling", !0))), this._debounceScrolling = w.debounce(this._debounceScrolling, L.after(Ss.SCROLLING), () => {
      cancelAnimationFrame(this._scrollingFrame), delete this._scrollingFrame, this.$.scroller.toggleAttribute("scrolling", !1);
    });
  }
  /** @private */
  _afterScroll() {
    this.__updateHorizontalScrollPosition(), this.hasAttribute("reordering") || this._scheduleScrolling(), this.hasAttribute("navigating") || this._hideTooltip(!0), this._updateOverflow(), this._debounceColumnContentVisibility = w.debounce(
      this._debounceColumnContentVisibility,
      L.after(Ss.UPDATE_CONTENT_VISIBILITY),
      () => {
        this._lazyColumns && this.__cachedScrollLeft !== this._scrollLeft && (this.__cachedScrollLeft = this._scrollLeft, this.__updateColumnsBodyContentHidden());
      }
    );
  }
  /** @private */
  __updateColumnsBodyContentHidden() {
    if (!this._columnTree)
      return;
    const e = this._getColumnsInOrder();
    if (!e[0] || !e[0]._sizerCell)
      return;
    let i = !1;
    if (e.forEach((r) => {
      const s = this._lazyColumns && !this.__isColumnInViewport(r);
      r._bodyContentHidden !== s && (i = !0, r._cells.forEach((n) => {
        if (n !== r._sizerCell) {
          if (s)
            n.remove();
          else if (n.__parentRow) {
            const a = [...n.__parentRow.children].find(
              (l) => e.indexOf(l._column) > e.indexOf(r)
            );
            n.__parentRow.insertBefore(n, a);
          }
        }
      })), r._bodyContentHidden = s;
    }), i && this._frozenCellsChanged(), this._lazyColumns) {
      const r = [...e].reverse().find((a) => a.frozen), s = this.__getColumnEnd(r), n = e.find((a) => !a.frozen && !a._bodyContentHidden);
      this.__lazyColumnsStart = this.__getColumnStart(n) - s, this.$.items.style.setProperty("--_grid-lazy-columns-start", `${this.__lazyColumnsStart}px`), this._resetKeyboardNavigation();
    }
  }
  /** @private */
  __getColumnEnd(e) {
    return e ? e._sizerCell.offsetLeft + (this.__isRTL ? 0 : e._sizerCell.offsetWidth) : this.__isRTL ? this.$.table.clientWidth : 0;
  }
  /** @private */
  __getColumnStart(e) {
    return e ? e._sizerCell.offsetLeft + (this.__isRTL ? e._sizerCell.offsetWidth : 0) : this.__isRTL ? this.$.table.clientWidth : 0;
  }
  /**
   * Returns true if the given column is horizontally inside the viewport.
   * @private
   */
  __isColumnInViewport(e) {
    return e.frozen || e.frozenToEnd ? !0 : e._sizerCell.offsetLeft + e._sizerCell.offsetWidth >= this._scrollLeft && e._sizerCell.offsetLeft <= this._scrollLeft + this.clientWidth;
  }
  /** @private */
  __columnRenderingChanged(e, i) {
    i === "eager" ? this.$.scroller.removeAttribute("column-rendering") : this.$.scroller.setAttribute("column-rendering", i), this.__updateColumnsBodyContentHidden();
  }
  /** @private */
  _updateOverflow() {
    this._debounceOverflow = w.debounce(this._debounceOverflow, le, () => {
      this.__doUpdateOverflow();
    });
  }
  /** @private */
  __doUpdateOverflow() {
    let e = "";
    const i = this.$.table;
    i.scrollTop < i.scrollHeight - i.clientHeight && (e += " bottom"), i.scrollTop > 0 && (e += " top");
    const r = Es(i, this.getAttribute("dir"));
    r > 0 && (e += " start"), r < i.scrollWidth - i.clientWidth && (e += " end"), this.__isRTL && (e = e.replace(/start|end/giu, (n) => n === "start" ? "end" : "start")), i.scrollLeft < i.scrollWidth - i.clientWidth && (e += " right"), i.scrollLeft > 0 && (e += " left");
    const s = e.trim();
    s.length > 0 && this.getAttribute("overflow") !== s ? this.setAttribute("overflow", s) : s.length === 0 && this.hasAttribute("overflow") && this.removeAttribute("overflow");
  }
  /** @protected */
  _frozenCellsChanged() {
    this._debouncerCacheElements = w.debounce(this._debouncerCacheElements, de, () => {
      Array.from(this.shadowRoot.querySelectorAll('[part~="cell"]')).forEach((e) => {
        e.style.transform = "";
      }), this._frozenCells = Array.prototype.slice.call(this.$.table.querySelectorAll("[frozen]")), this._frozenToEndCells = Array.prototype.slice.call(this.$.table.querySelectorAll("[frozen-to-end]")), this.__updateHorizontalScrollPosition();
    }), this._debounceUpdateFrozenColumn();
  }
  /** @protected */
  _debounceUpdateFrozenColumn() {
    this.__debounceUpdateFrozenColumn = w.debounce(
      this.__debounceUpdateFrozenColumn,
      de,
      () => this._updateFrozenColumn()
    );
  }
  /** @private */
  _updateFrozenColumn() {
    if (!this._columnTree)
      return;
    const e = this._columnTree[this._columnTree.length - 1].slice(0);
    e.sort((s, n) => s._order - n._order);
    let i, r;
    for (let s = 0; s < e.length; s++) {
      const n = e[s];
      n._lastFrozen = !1, n._firstFrozenToEnd = !1, r === void 0 && n.frozenToEnd && !n.hidden && (r = s), n.frozen && !n.hidden && (i = s);
    }
    i !== void 0 && (e[i]._lastFrozen = !0), r !== void 0 && (e[r]._firstFrozenToEnd = !0), this.__updateColumnsBodyContentHidden();
  }
  /** @private */
  __updateHorizontalScrollPosition() {
    if (!this._columnTree)
      return;
    const e = this.$.table.scrollWidth, i = this.$.table.clientWidth, r = Math.max(0, this.$.table.scrollLeft), s = Es(this.$.table, this.getAttribute("dir")), n = `translate(${-r}px, 0)`;
    this.$.header.style.transform = n, this.$.footer.style.transform = n, this.$.items.style.transform = n;
    const a = this.__isRTL ? s + i - e : r, l = `translate(${a}px, 0)`;
    this._frozenCells.forEach((u) => {
      u.style.transform = l;
    });
    const d = this.__isRTL ? s : r + i - e, c = `translate(${d}px, 0)`;
    let h = c;
    if (this._lazyColumns) {
      const u = this._getColumnsInOrder(), p = [...u].reverse().find((D) => !D.frozenToEnd && !D._bodyContentHidden), f = this.__getColumnEnd(p), x = u.find((D) => D.frozenToEnd), T = this.__getColumnStart(x);
      h = `translate(${d + (T - f) + this.__lazyColumnsStart}px, 0)`;
    }
    this._frozenToEndCells.forEach((u) => {
      this.$.items.contains(u) ? u.style.transform = h : u.style.transform = c;
    }), this.hasAttribute("navigating") && this.__rowFocusMode && this.$.table.style.setProperty("--_grid-horizontal-scroll-position", `${-a}px`);
  }
};
/**
 * @license
 * Copyright (c) 2016 - 2023 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
const Au = (o) => class extends o {
  static get properties() {
    return {
      /**
       * An array that contains the selected items.
       * @type {!Array<!GridItem>}
       */
      selectedItems: {
        type: Object,
        notify: !0,
        value: () => []
      },
      /**
       * Set of selected item ids
       * @private
       */
      __selectedKeys: {
        type: Object,
        computed: "__computeSelectedKeys(itemIdPath, selectedItems.*)"
      }
    };
  }
  static get observers() {
    return ["__selectedItemsChanged(itemIdPath, selectedItems.*)"];
  }
  /**
   * @param {!GridItem} item
   * @return {boolean}
   * @protected
   */
  _isSelected(e) {
    return this.__selectedKeys.has(this.getItemId(e));
  }
  /**
   * Selects the given item.
   *
   * @method selectItem
   * @param {!GridItem} item The item object
   */
  selectItem(e) {
    this._isSelected(e) || (this.selectedItems = [...this.selectedItems, e]);
  }
  /**
   * Deselects the given item if it is already selected.
   *
   * @method deselect
   * @param {!GridItem} item The item object
   */
  deselectItem(e) {
    this._isSelected(e) && (this.selectedItems = this.selectedItems.filter((i) => !this._itemsEqual(i, e)));
  }
  /**
   * Toggles the selected state of the given item.
   *
   * @method toggle
   * @param {!GridItem} item The item object
   * @protected
   */
  _toggleItem(e) {
    this._isSelected(e) ? this.deselectItem(e) : this.selectItem(e);
  }
  /** @private */
  __selectedItemsChanged() {
    this.requestContentUpdate();
  }
  /** @private */
  __computeSelectedKeys(e, i) {
    const r = i.base || [], s = /* @__PURE__ */ new Set();
    return r.forEach((n) => {
      s.add(this.getItemId(n));
    }), s;
  }
  /**
   * Fired when the `selectedItems` property changes.
   *
   * @event selected-items-changed
   */
};
/**
 * @license
 * Copyright (c) 2016 - 2023 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
let Is = "prepend";
const ku = (o) => class extends o {
  static get properties() {
    return {
      /**
       * When `true`, all `<vaadin-grid-sorter>` are applied for sorting.
       * @attr {boolean} multi-sort
       * @type {boolean}
       */
      multiSort: {
        type: Boolean,
        value: !1
      },
      /**
       * Controls how columns are added to the sort order when using multi-sort.
       * The sort order is visually indicated by numbers in grid sorters placed in column headers.
       *
       * By default, whenever an unsorted column is sorted, or the sort-direction of a column is
       * changed, that column gets sort priority 1, thus affecting the priority for all the other
       * sorted columns. This is identical to using `multi-sort-priority="prepend"`.
       *
       * Using this property allows to change this behavior so that sorting an unsorted column
       * would add it to the "end" of the sort, and changing column's sort direction would retain
       * it's previous priority. To set this, use `multi-sort-priority="append"`.
       *
       * @attr {string} multi-sort-priority
       */
      multiSortPriority: {
        type: String,
        value: () => Is
      },
      /**
       * When `true`, Shift-clicking an unsorted column's sorter adds it to the multi-sort.
       * Shift + Space does the same action via keyboard. This property has precedence over the
       * `multiSort` property. If `multiSortOnShiftClick` is true, the multiSort property is effectively ignored.
       *
       * @attr {boolean} multi-sort-on-shift-click
       * @type {boolean}
       */
      multiSortOnShiftClick: {
        type: Boolean,
        value: !1
      },
      /**
       * @type {!Array<!GridSorterDefinition>}
       * @protected
       */
      _sorters: {
        type: Array,
        value: () => []
      },
      /** @private */
      _previousSorters: {
        type: Array,
        value: () => []
      }
    };
  }
  /**
   * Sets the default multi-sort priority to use for all grid instances.
   * This method should be called before creating any grid instances.
   * Changing this setting does not affect the default for existing grids.
   *
   * @param {string} priority
   */
  static setDefaultMultiSortPriority(e) {
    Is = ["append", "prepend"].includes(e) ? e : "prepend";
  }
  /** @protected */
  ready() {
    super.ready(), this.addEventListener("sorter-changed", this._onSorterChanged);
  }
  /** @private */
  _onSorterChanged(e) {
    const i = e.target;
    e.stopPropagation(), i._grid = this, this.__updateSorter(i, e.detail.shiftClick, e.detail.fromSorterClick), this.__applySorters();
  }
  /** @private */
  __removeSorters(e) {
    e.length !== 0 && (this._sorters = this._sorters.filter((i) => e.indexOf(i) < 0), this.multiSort && this.__updateSortOrders(), this.__applySorters());
  }
  /** @private */
  __updateSortOrders() {
    this._sorters.forEach((e, i) => {
      e._order = this._sorters.length > 1 ? i : null;
    });
  }
  /** @private */
  __appendSorter(e) {
    e.direction ? this._sorters.includes(e) || this._sorters.push(e) : this._removeArrayItem(this._sorters, e), this.__updateSortOrders();
  }
  /** @private */
  __prependSorter(e) {
    this._removeArrayItem(this._sorters, e), e.direction && this._sorters.unshift(e), this.__updateSortOrders();
  }
  /** @private */
  __updateSorter(e, i, r) {
    if (!(!e.direction && this._sorters.indexOf(e) === -1)) {
      if (e._order = null, this.multiSort && (!this.multiSortOnShiftClick || !r) || this.multiSortOnShiftClick && i)
        this.multiSortPriority === "append" ? this.__appendSorter(e) : this.__prependSorter(e);
      else if (e.direction || this.multiSortOnShiftClick) {
        const s = this._sorters.filter((n) => n !== e);
        this._sorters = e.direction ? [e] : [], s.forEach((n) => {
          n._order = null, n.direction = null;
        });
      }
    }
  }
  /** @private */
  __applySorters() {
    this.dataProvider && // No need to clear cache if sorters didn't change and grid is attached
    this.isAttached && JSON.stringify(this._previousSorters) !== JSON.stringify(this._mapSorters()) && this.clearCache(), this._a11yUpdateSorters(), this._previousSorters = this._mapSorters();
  }
  /**
   * @return {!Array<!GridSorterDefinition>}
   * @protected
   */
  _mapSorters() {
    return this._sorters.map((e) => ({
      path: e.path,
      direction: e.direction
    }));
  }
  /** @private */
  _removeArrayItem(e, i) {
    const r = e.indexOf(i);
    r > -1 && e.splice(r, 1);
  }
};
/**
 * @license
 * Copyright (c) 2016 - 2023 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
const Eu = (o) => class extends o {
  static get properties() {
    return {
      /**
       * A function that allows generating CSS class names for grid cells
       * based on their row and column. The return value should be the generated
       * class name as a string, or multiple class names separated by whitespace
       * characters.
       *
       * Receives two arguments:
       * - `column` The `<vaadin-grid-column>` element (`undefined` for details-cell).
       * - `model` The object with the properties related with
       *   the rendered item, contains:
       *   - `model.index` The index of the item.
       *   - `model.item` The item.
       *   - `model.expanded` Sublevel toggle state.
       *   - `model.level` Level of the tree represented with a horizontal offset of the toggle button.
       *   - `model.selected` Selected state.
       *
       * @type {GridCellClassNameGenerator | null | undefined}
       * @deprecated Use `cellPartNameGenerator` instead.
       */
      cellClassNameGenerator: Function,
      /**
       * A function that allows generating CSS `part` names for grid cells in Shadow DOM based
       * on their row and column, for styling from outside using the `::part()` selector.
       *
       * The return value should be the generated part name as a string, or multiple part names
       * separated by whitespace characters.
       *
       * Receives two arguments:
       * - `column` The `<vaadin-grid-column>` element (`undefined` for details-cell).
       * - `model` The object with the properties related with
       *   the rendered item, contains:
       *   - `model.index` The index of the item.
       *   - `model.item` The item.
       *   - `model.expanded` Sublevel toggle state.
       *   - `model.level` Level of the tree represented with a horizontal offset of the toggle button.
       *   - `model.selected` Selected state.
       *
       * @type {GridCellPartNameGenerator | null | undefined}
       */
      cellPartNameGenerator: Function
    };
  }
  static get observers() {
    return [
      "__cellClassNameGeneratorChanged(cellClassNameGenerator)",
      "__cellPartNameGeneratorChanged(cellPartNameGenerator)"
    ];
  }
  /** @private */
  __cellClassNameGeneratorChanged() {
    this.generateCellClassNames();
  }
  /** @private */
  __cellPartNameGeneratorChanged() {
    this.generateCellPartNames();
  }
  /**
   * Runs the `cellClassNameGenerator` for the visible cells.
   * If the generator depends on varying conditions, you need to
   * call this function manually in order to update the styles when
   * the conditions change.
   *
   * @deprecated Use `cellPartNameGenerator` and `generateCellPartNames()` instead.
   */
  generateCellClassNames() {
    P(this.$.items, (e) => {
      !e.hidden && !e.hasAttribute("loading") && this._generateCellClassNames(e, this.__getRowModel(e));
    });
  }
  /**
   * Runs the `cellPartNameGenerator` for the visible cells.
   * If the generator depends on varying conditions, you need to
   * call this function manually in order to update the styles when
   * the conditions change.
   */
  generateCellPartNames() {
    P(this.$.items, (e) => {
      !e.hidden && !e.hasAttribute("loading") && this._generateCellPartNames(e, this.__getRowModel(e));
    });
  }
  /** @private */
  _generateCellClassNames(e, i) {
    P(e, (r) => {
      if (r.__generatedClasses && r.__generatedClasses.forEach((s) => r.classList.remove(s)), this.cellClassNameGenerator) {
        const s = this.cellClassNameGenerator(r._column, i);
        r.__generatedClasses = s && s.split(" ").filter((n) => n.length > 0), r.__generatedClasses && r.__generatedClasses.forEach((n) => r.classList.add(n));
      }
    });
  }
  /** @private */
  _generateCellPartNames(e, i) {
    P(e, (r) => {
      if (r.__generatedParts && r.__generatedParts.forEach((s) => {
        ce(r, null, s);
      }), this.cellPartNameGenerator) {
        const s = this.cellPartNameGenerator(r._column, i);
        r.__generatedParts = s && s.split(" ").filter((n) => n.length > 0), r.__generatedParts && r.__generatedParts.forEach((n) => {
          ce(r, !0, n);
        });
      }
    });
  }
};
/**
 * @license
 * Copyright (c) 2016 - 2023 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
class Ts extends he(
  O(
    _u(
      hu(
        gu(
          au(
            wu(
              Au(
                ku(
                  Cu(
                    yu(
                      nu(
                        vu(
                          uu(
                            pu(
                              ie(
                                bu(mu(Eu(Ur(A))))
                              )
                            )
                          )
                        )
                      )
                    )
                  )
                )
              )
            )
          )
        )
      )
    )
  )
) {
  static get template() {
    return k`
      <div
        id="scroller"
        safari$="[[_safari]]"
        ios$="[[_ios]]"
        loading$="[[loading]]"
        column-reordering-allowed$="[[columnReorderingAllowed]]"
      >
        <table id="table" role="treegrid" aria-multiselectable="true" tabindex="0">
          <caption id="sizer" part="row"></caption>
          <thead id="header" role="rowgroup"></thead>
          <tbody id="items" role="rowgroup"></tbody>
          <tfoot id="footer" role="rowgroup"></tfoot>
        </table>

        <div part="reorder-ghost"></div>
      </div>

      <slot name="tooltip"></slot>

      <div id="focusexit" tabindex="0"></div>
    `;
  }
  static get is() {
    return "vaadin-grid";
  }
  static get observers() {
    return [
      "_columnTreeChanged(_columnTree, _columnTree.*)",
      "_effectiveSizeChanged(_effectiveSize, __virtualizer, _hasData, _columnTree)"
    ];
  }
  static get properties() {
    return {
      /** @private */
      _safari: {
        type: Boolean,
        value: Dn
      },
      /** @private */
      _ios: {
        type: Boolean,
        value: Xt
      },
      /** @private */
      _firefox: {
        type: Boolean,
        value: Pn
      },
      /** @private */
      _android: {
        type: Boolean,
        value: Mo
      },
      /** @private */
      _touchDevice: {
        type: Boolean,
        value: Jt
      },
      /**
       * If true, the grid's height is defined by its rows.
       *
       * Effectively, this disables the grid's virtual scrolling so that all the rows are rendered in the DOM at once.
       * If the grid has a large number of items, using the feature is discouraged to avoid performance issues.
       * @attr {boolean} all-rows-visible
       * @type {boolean}
       */
      allRowsVisible: {
        type: Boolean,
        value: !1,
        reflectToAttribute: !0
      },
      /** @private */
      __pendingRecalculateColumnWidths: {
        type: Boolean,
        value: !0
      },
      /** @private */
      isAttached: {
        value: !1
      },
      /**
       * An internal property that is mainly used by `vaadin-template-renderer`
       * to identify grid elements.
       *
       * @private
       */
      __gridElement: {
        type: Boolean,
        value: !0
      }
    };
  }
  constructor() {
    super(), this.addEventListener("animationend", this._onAnimationEnd);
  }
  /** @private */
  get _firstVisibleIndex() {
    const t = this.__getFirstVisibleItem();
    return t ? t.index : void 0;
  }
  /** @private */
  get _lastVisibleIndex() {
    const t = this.__getLastVisibleItem();
    return t ? t.index : void 0;
  }
  /** @protected */
  connectedCallback() {
    super.connectedCallback(), this.isAttached = !0, this.recalculateColumnWidths();
  }
  /** @protected */
  disconnectedCallback() {
    super.disconnectedCallback(), this.isAttached = !1, this._hideTooltip(!0);
  }
  /** @private */
  __getFirstVisibleItem() {
    return this._getVisibleRows().find((t) => this._isInViewport(t));
  }
  /** @private */
  __getLastVisibleItem() {
    return this._getVisibleRows().reverse().find((t) => this._isInViewport(t));
  }
  /** @private */
  _isInViewport(t) {
    const e = this.$.table.getBoundingClientRect(), i = t.getBoundingClientRect(), r = this.$.header.getBoundingClientRect().height, s = this.$.footer.getBoundingClientRect().height;
    return i.bottom > e.top + r && i.top < e.bottom - s;
  }
  /** @private */
  _getVisibleRows() {
    return Array.from(this.$.items.children).filter((t) => !t.hidden).sort((t, e) => t.index - e.index);
  }
  /** @protected */
  ready() {
    super.ready(), this.__virtualizer = new ga({
      createElements: this._createScrollerRows.bind(this),
      updateElement: this._updateScrollerItem.bind(this),
      scrollContainer: this.$.items,
      scrollTarget: this.$.table,
      reorderElements: !0
    }), new ResizeObserver(
      () => setTimeout(() => {
        this.__updateFooterPositioning(), this.__updateColumnsBodyContentHidden(), this.__tryToRecalculateColumnWidthsIfPending();
      })
    ).observe(this.$.table), li(this), this._tooltipController = new ue(this), this.addController(this._tooltipController), this._tooltipController.setManual(!0);
  }
  /** @private */
  __getBodyCellCoordinates(t) {
    if (this.$.items.contains(t) && t.localName === "td")
      return {
        item: t.parentElement._item,
        column: t._column
      };
  }
  /** @private */
  __focusBodyCell({ item: t, column: e }) {
    const i = this._getVisibleRows().find((s) => s._item === t), r = i && [...i.children].find((s) => s._column === e);
    r && r.focus();
  }
  /** @private */
  _effectiveSizeChanged(t, e, i, r) {
    if (e && i && r) {
      const s = this.shadowRoot.activeElement, n = this.__getBodyCellCoordinates(s), a = e.size || 0;
      e.size = t, e.update(a - 1, a - 1), t < a && e.update(t - 1, t - 1), n && s.parentElement.hidden && this.__focusBodyCell(n), this._resetKeyboardNavigation();
    }
  }
  /** @private */
  __hasRowsWithClientHeight() {
    return !!Array.from(this.$.items.children).filter((t) => t.clientHeight).length;
  }
  /** @private */
  __getIntrinsicWidth(t) {
    return this.__intrinsicWidthCache.has(t) || this.__calculateAndCacheIntrinsicWidths([t]), this.__intrinsicWidthCache.get(t);
  }
  /** @private */
  __getDistributedWidth(t, e) {
    if (t == null || t === this)
      return 0;
    const i = Math.max(this.__getIntrinsicWidth(t), this.__getDistributedWidth(t.parentElement, t));
    if (!e)
      return i;
    const r = t, s = i, n = r._visibleChildColumns.map((c) => this.__getIntrinsicWidth(c)).reduce((c, h) => c + h, 0), a = Math.max(0, s - n), d = this.__getIntrinsicWidth(e) / n * a;
    return this.__getIntrinsicWidth(e) + d;
  }
  /**
   * @param {!Array<!GridColumn>} cols the columns to auto size based on their content width
   * @private
   */
  _recalculateColumnWidths(t) {
    this.__virtualizer.flush(), [...this.$.header.children, ...this.$.footer.children].forEach((r) => {
      r.__debounceUpdateHeaderFooterRowVisibility && r.__debounceUpdateHeaderFooterRowVisibility.flush();
    }), this._debouncerHiddenChanged && this._debouncerHiddenChanged.flush(), this.__intrinsicWidthCache = /* @__PURE__ */ new Map();
    const e = this._firstVisibleIndex, i = this._lastVisibleIndex;
    this.__viewportRowsCache = this._getVisibleRows().filter((r) => r.index >= e && r.index <= i), this.__calculateAndCacheIntrinsicWidths(t), t.forEach((r) => {
      r.width = `${this.__getDistributedWidth(r)}px`;
    });
  }
  /**
   * Toggles the cell content for the given column to use or not use auto width.
   *
   * While content for all the column cells uses auto width (instead of the default 100%),
   * their offsetWidth can be used to calculate the collective intrinsic width of the column.
   *
   * @private
   */
  __setVisibleCellContentAutoWidth(t, e) {
    t._allCells.filter((i) => this.$.items.contains(i) ? this.__viewportRowsCache.includes(i.parentElement) : !0).forEach((i) => {
      i.__measuringAutoWidth = e, i._content.style.width = e ? "auto" : "", i._content.style.position = e ? "absolute" : "";
    });
  }
  /**
   * Returns the maximum intrinsic width of the cell content in the given column.
   * Only cells which are marked for measuring auto width are considered.
   *
   * @private
   */
  __getAutoWidthCellsMaxWidth(t) {
    return t._allCells.reduce((e, i) => i.__measuringAutoWidth ? Math.max(e, i._content.offsetWidth + 1) : e, 0);
  }
  /**
   * Calculates and caches the intrinsic width of each given column.
   *
   * @private
   */
  __calculateAndCacheIntrinsicWidths(t) {
    t.forEach((e) => this.__setVisibleCellContentAutoWidth(e, !0)), t.forEach((e) => {
      const i = this.__getAutoWidthCellsMaxWidth(e);
      this.__intrinsicWidthCache.set(e, i);
    }), t.forEach((e) => this.__setVisibleCellContentAutoWidth(e, !1));
  }
  /**
   * Updates the `width` of all columns which have `autoWidth` set to `true`.
   */
  recalculateColumnWidths() {
    if (!this._columnTree)
      return;
    if (Fo(this) || this._cache.isLoading()) {
      this.__pendingRecalculateColumnWidths = !0;
      return;
    }
    const t = this._getColumns().filter((e) => !e.hidden && e.autoWidth);
    this._recalculateColumnWidths(t);
  }
  /** @private */
  __tryToRecalculateColumnWidthsIfPending() {
    this.__pendingRecalculateColumnWidths && !Fo(this) && !this._cache.isLoading() && this.__hasRowsWithClientHeight() && (this.__pendingRecalculateColumnWidths = !1, this.recalculateColumnWidths());
  }
  /**
   * @protected
   * @override
   */
  _onDataProviderPageLoaded() {
    super._onDataProviderPageLoaded(), this.__tryToRecalculateColumnWidthsIfPending();
  }
  /** @private */
  _createScrollerRows(t) {
    const e = [];
    for (let i = 0; i < t; i++) {
      const r = document.createElement("tr");
      r.setAttribute("part", "row"), r.setAttribute("role", "row"), r.setAttribute("tabindex", "-1"), this._columnTree && this._updateRow(r, this._columnTree[this._columnTree.length - 1], "body", !1, !0), e.push(r);
    }
    return this._columnTree && this._columnTree[this._columnTree.length - 1].forEach(
      (i) => i.isConnected && i.notifyPath && i.notifyPath("_cells.*", i._cells)
    ), this.__afterCreateScrollerRowsDebouncer = w.debounce(
      this.__afterCreateScrollerRowsDebouncer,
      le,
      () => {
        this._afterScroll(), this.__tryToRecalculateColumnWidthsIfPending();
      }
    ), e;
  }
  /** @private */
  _createCell(t, e) {
    const r = `vaadin-grid-cell-content-${this._contentIndex = this._contentIndex + 1 || 0}`, s = document.createElement("vaadin-grid-cell-content");
    s.setAttribute("slot", r);
    const n = document.createElement(t);
    n.id = r.replace("-content-", "-"), n.setAttribute("role", t === "td" ? "gridcell" : "columnheader"), !Mo && !Xt && (n.addEventListener("mouseenter", (l) => {
      this.$.scroller.hasAttribute("scrolling") || this._showTooltip(l);
    }), n.addEventListener("mouseleave", () => {
      this._hideTooltip();
    }), n.addEventListener("mousedown", () => {
      this._hideTooltip(!0);
    }));
    const a = document.createElement("slot");
    if (a.setAttribute("name", r), e && e._focusButtonMode) {
      const l = document.createElement("div");
      l.setAttribute("role", "button"), l.setAttribute("tabindex", "-1"), n.appendChild(l), n._focusButton = l, n.focus = function() {
        n._focusButton.focus();
      }, l.appendChild(a);
    } else
      n.setAttribute("tabindex", "-1"), n.appendChild(a);
    return n._content = s, s.addEventListener("mousedown", () => {
      if (rc) {
        const l = (d) => {
          const c = s.contains(this.getRootNode().activeElement), h = d.composedPath().includes(s);
          !c && h && n.focus(), document.removeEventListener("mouseup", l, !0);
        };
        document.addEventListener("mouseup", l, !0);
      } else
        setTimeout(() => {
          s.contains(this.getRootNode().activeElement) || n.focus();
        });
    }), n;
  }
  /**
   * @param {!HTMLTableRowElement} row
   * @param {!Array<!GridColumn>} columns
   * @param {?string} section
   * @param {boolean} isColumnRow
   * @param {boolean} noNotify
   * @protected
   */
  _updateRow(t, e, i = "body", r = !1, s = !1) {
    const n = document.createDocumentFragment();
    P(t, (a) => {
      a._vacant = !0;
    }), t.innerHTML = "", e.filter((a) => !a.hidden).forEach((a, l, d) => {
      let c;
      if (i === "body") {
        if (a._cells || (a._cells = []), c = a._cells.find((h) => h._vacant), c || (c = this._createCell("td", a), a._cells.push(c)), c.setAttribute("part", "cell body-cell"), c.__parentRow = t, a._bodyContentHidden || t.appendChild(c), t === this.$.sizer && (a._sizerCell = c), l === d.length - 1 && this.rowDetailsRenderer) {
          this._detailsCells || (this._detailsCells = []);
          const h = this._detailsCells.find((u) => u._vacant) || this._createCell("td");
          this._detailsCells.indexOf(h) === -1 && this._detailsCells.push(h), h._content.parentElement || n.appendChild(h._content), this._configureDetailsCell(h), t.appendChild(h), this._a11ySetRowDetailsCell(t, h), h._vacant = !1;
        }
        a.notifyPath && !s && a.notifyPath("_cells.*", a._cells);
      } else {
        const h = i === "header" ? "th" : "td";
        r || a.localName === "vaadin-grid-column-group" ? (c = a[`_${i}Cell`] || this._createCell(h), c._column = a, t.appendChild(c), a[`_${i}Cell`] = c) : (a._emptyCells || (a._emptyCells = []), c = a._emptyCells.find((u) => u._vacant) || this._createCell(h), c._column = a, t.appendChild(c), a._emptyCells.indexOf(c) === -1 && a._emptyCells.push(c)), c.setAttribute("part", `cell ${i}-cell`);
      }
      c._content.parentElement || n.appendChild(c._content), c._vacant = !1, c._column = a;
    }), i !== "body" && this.__debounceUpdateHeaderFooterRowVisibility(t), this.appendChild(n), this._frozenCellsChanged(), this._updateFirstAndLastColumnForRow(t);
  }
  /**
   * @param {HTMLTableRowElement} row
   * @protected
   */
  __debounceUpdateHeaderFooterRowVisibility(t) {
    t.__debounceUpdateHeaderFooterRowVisibility = w.debounce(
      t.__debounceUpdateHeaderFooterRowVisibility,
      de,
      () => this.__updateHeaderFooterRowVisibility(t)
    );
  }
  /**
   * @param {HTMLTableRowElement} row
   * @protected
   */
  __updateHeaderFooterRowVisibility(t) {
    if (!t)
      return;
    const e = Array.from(t.children).filter((i) => {
      const r = i._column;
      if (r._emptyCells && r._emptyCells.indexOf(i) > -1)
        return !1;
      if (t.parentElement === this.$.header) {
        if (r.headerRenderer)
          return !0;
        if (r.header === null)
          return !1;
        if (r.path || r.header !== void 0)
          return !0;
      } else if (r.footerRenderer)
        return !0;
      return !1;
    });
    t.hidden !== !e.length && (t.hidden = !e.length), this._resetKeyboardNavigation();
  }
  /** @private */
  _updateScrollerItem(t, e) {
    this._preventScrollerRotatingCellFocus(t, e), this._columnTree && (this._updateRowOrderParts(t, e), this._a11yUpdateRowRowindex(t, e), this._getItem(e, t));
  }
  /** @private */
  _columnTreeChanged(t) {
    this._renderColumnTree(t), this.recalculateColumnWidths(), this.__updateColumnsBodyContentHidden();
  }
  /** @private */
  _updateRowOrderParts(t, e = t.index) {
    lt(t, {
      first: e === 0,
      last: e === this._effectiveSize - 1,
      odd: e % 2 !== 0,
      even: e % 2 === 0
    });
  }
  /** @private */
  _updateRowStateParts(t, { expanded: e, selected: i, detailsOpened: r }) {
    lt(t, {
      expanded: e,
      selected: i,
      "details-opened": r
    });
  }
  /**
   * @param {!Array<!GridColumn>} columnTree
   * @protected
   */
  _renderColumnTree(t) {
    for (P(this.$.items, (e) => {
      this._updateRow(e, t[t.length - 1], "body", !1, !0);
      const i = this.__getRowModel(e);
      this._updateRowOrderParts(e), this._updateRowStateParts(e, i), this._filterDragAndDrop(e, i);
    }); this.$.header.children.length < t.length; ) {
      const e = document.createElement("tr");
      e.setAttribute("part", "row"), e.setAttribute("role", "row"), e.setAttribute("tabindex", "-1"), this.$.header.appendChild(e);
      const i = document.createElement("tr");
      i.setAttribute("part", "row"), i.setAttribute("role", "row"), i.setAttribute("tabindex", "-1"), this.$.footer.appendChild(i);
    }
    for (; this.$.header.children.length > t.length; )
      this.$.header.removeChild(this.$.header.firstElementChild), this.$.footer.removeChild(this.$.footer.firstElementChild);
    P(this.$.header, (e, i, r) => {
      this._updateRow(e, t[i], "header", i === t.length - 1);
      const s = Ct(e);
      se(s, "first-header-row-cell", i === 0), se(s, "last-header-row-cell", i === r.length - 1);
    }), P(this.$.footer, (e, i, r) => {
      this._updateRow(e, t[t.length - 1 - i], "footer", i === 0);
      const s = Ct(e);
      se(s, "first-footer-row-cell", i === 0), se(s, "last-footer-row-cell", i === r.length - 1);
    }), this._updateRow(this.$.sizer, t[t.length - 1]), this._resizeHandler(), this._frozenCellsChanged(), this._updateFirstAndLastColumn(), this._resetKeyboardNavigation(), this._a11yUpdateHeaderRows(), this._a11yUpdateFooterRows(), this.__updateFooterPositioning(), this.generateCellClassNames(), this.generateCellPartNames();
  }
  /** @private */
  __updateFooterPositioning() {
    this._firefox && parseFloat(navigator.userAgent.match(/Firefox\/(\d{2,3}.\d)/u)[1]) < 99 && (this.$.items.style.paddingBottom = 0, this.allRowsVisible || (this.$.items.style.paddingBottom = `${this.$.footer.offsetHeight}px`));
  }
  /**
   * @param {!HTMLElement} row
   * @param {GridItem} item
   * @protected
   */
  _updateItem(t, e) {
    t._item = e;
    const i = this.__getRowModel(t);
    this._toggleDetailsCell(t, i.detailsOpened), this._a11yUpdateRowLevel(t, i.level), this._a11yUpdateRowSelected(t, i.selected), this._updateRowStateParts(t, i), this._generateCellClassNames(t, i), this._generateCellPartNames(t, i), this._filterDragAndDrop(t, i), P(t, (r) => {
      if (r._renderer) {
        const s = r._column || this;
        r._renderer.call(s, r._content, s, i);
      }
    }), this._updateDetailsCellHeight(t), this._a11yUpdateRowExpanded(t, i.expanded);
  }
  /** @private */
  _resizeHandler() {
    this._updateDetailsCellHeights(), this.__updateFooterPositioning(), this.__updateHorizontalScrollPosition();
  }
  /** @private */
  _onAnimationEnd(t) {
    t.animationName.indexOf("vaadin-grid-appear") === 0 && (t.stopPropagation(), this.__tryToRecalculateColumnWidthsIfPending(), requestAnimationFrame(() => {
      this.__scrollToPendingIndexes();
    }));
  }
  /**
   * @param {!HTMLTableRowElement} row
   * @return {!GridItemModel}
   * @protected
   */
  __getRowModel(t) {
    return {
      index: t.index,
      item: t._item,
      level: this._getIndexLevel(t.index),
      expanded: this._isExpanded(t._item),
      selected: this._isSelected(t._item),
      detailsOpened: !!this.rowDetailsRenderer && this._isDetailsOpened(t._item)
    };
  }
  /**
   * @param {Event} event
   * @protected
   */
  _showTooltip(t) {
    const e = this._tooltipController.node;
    e && e.isConnected && (this._tooltipController.setTarget(t.target), this._tooltipController.setContext(this.getEventContext(t)), e._stateController.open({
      focus: t.type === "focusin",
      hover: t.type === "mouseenter"
    }));
  }
  /** @protected */
  _hideTooltip(t) {
    const e = this._tooltipController.node;
    e && e._stateController.close(t);
  }
  /**
   * Requests an update for the content of cells.
   *
   * While performing the update, the following renderers are invoked:
   * - `Grid.rowDetailsRenderer`
   * - `GridColumn.renderer`
   * - `GridColumn.headerRenderer`
   * - `GridColumn.footerRenderer`
   *
   * It is not guaranteed that the update happens immediately (synchronously) after it is requested.
   */
  requestContentUpdate() {
    this._columnTree && (this._columnTree.forEach((t) => {
      t.forEach((e) => {
        e._renderHeaderAndFooter && e._renderHeaderAndFooter();
      });
    }), this.__updateVisibleRows());
  }
  /** @protected */
  __updateVisibleRows(t, e) {
    this.__virtualizer && this.__virtualizer.update(t, e);
  }
}
customElements.define(Ts.is, Ts);
/**
 * @license
 * Copyright (c) 2016 - 2023 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
class Ps extends Ea(A) {
  static get is() {
    return "vaadin-grid-column-group";
  }
  static get properties() {
    return {
      /** @private */
      _childColumns: {
        value() {
          return this._getChildColumns(this);
        }
      },
      /**
       * Flex grow ratio for the column group as the sum of the ratios of its child columns.
       * @attr {number} flex-grow
       */
      flexGrow: {
        type: Number,
        readOnly: !0
      },
      /**
       * Width of the column group as the sum of the widths of its child columns.
       */
      width: {
        type: String,
        readOnly: !0
      },
      /** @private */
      _visibleChildColumns: Array,
      /** @private */
      _colSpan: Number,
      /** @private */
      _rootColumns: Array
    };
  }
  static get observers() {
    return [
      "_groupFrozenChanged(frozen, _rootColumns)",
      "_groupFrozenToEndChanged(frozenToEnd, _rootColumns)",
      "_groupHiddenChanged(hidden)",
      "_colSpanChanged(_colSpan, _headerCell, _footerCell)",
      "_groupOrderChanged(_order, _rootColumns)",
      "_groupReorderStatusChanged(_reorderStatus, _rootColumns)",
      "_groupResizableChanged(resizable, _rootColumns)"
    ];
  }
  /** @protected */
  connectedCallback() {
    super.connectedCallback(), this._addNodeObserver(), this._updateFlexAndWidth();
  }
  /** @protected */
  disconnectedCallback() {
    super.disconnectedCallback(), this._observer && this._observer.disconnect();
  }
  /**
   * @param {string} path
   * @param {unknown=} value
   * @protected
   */
  _columnPropChanged(t, e) {
    t === "hidden" && (this._preventHiddenSynchronization = !0, this._updateVisibleChildColumns(this._childColumns), this._preventHiddenSynchronization = !1), /flexGrow|width|hidden|_childColumns/u.test(t) && this._updateFlexAndWidth(), t === "frozen" && !this.frozen && (this.frozen = e), t === "lastFrozen" && !this._lastFrozen && (this._lastFrozen = e), t === "frozenToEnd" && !this.frozenToEnd && (this.frozenToEnd = e), t === "firstFrozenToEnd" && !this._firstFrozenToEnd && (this._firstFrozenToEnd = e);
  }
  /** @private */
  _groupOrderChanged(t, e) {
    if (e) {
      const i = e.slice(0);
      if (!t) {
        i.forEach((a) => {
          a._order = 0;
        });
        return;
      }
      const r = /(0+)$/u.exec(t).pop().length, s = ~~(Math.log(e.length) / Math.LN10) + 1, n = 10 ** (r - s);
      i[0] && i[0]._order && i.sort((a, l) => a._order - l._order), ka(i, n, t);
    }
  }
  /** @private */
  _groupReorderStatusChanged(t, e) {
    t === void 0 || e === void 0 || e.forEach((i) => {
      i._reorderStatus = t;
    });
  }
  /** @private */
  _groupResizableChanged(t, e) {
    t === void 0 || e === void 0 || e.forEach((i) => {
      i.resizable = t;
    });
  }
  /** @private */
  _updateVisibleChildColumns(t) {
    this._visibleChildColumns = Array.prototype.filter.call(t, (e) => !e.hidden), this._colSpan = this._visibleChildColumns.length, this._updateAutoHidden();
  }
  /** @protected */
  _updateFlexAndWidth() {
    if (this._visibleChildColumns) {
      if (this._visibleChildColumns.length > 0) {
        const t = this._visibleChildColumns.reduce((e, i) => (e += ` + ${(i.width || "0px").replace("calc", "")}`, e), "").substring(3);
        this._setWidth(`calc(${t})`);
      } else
        this._setWidth("0px");
      this._setFlexGrow(Array.prototype.reduce.call(this._visibleChildColumns, (t, e) => t + e.flexGrow, 0));
    }
  }
  /**
   * This method is called before the group's frozen value is being propagated to the child columns.
   * In case some of the child columns are frozen, while others are not, the non-frozen ones
   * will get automatically frozen as well. As this may sometimes be unintended, this method
   * shows a warning in the console in such cases.
   * @private
   */
  __scheduleAutoFreezeWarning(t, e) {
    if (this._grid) {
      const i = e.replace(/([A-Z])/gu, "-$1").toLowerCase(), r = t[0][e] || t[0].hasAttribute(i);
      t.every((n) => (n[e] || n.hasAttribute(i)) === r) || (this._grid.__autoFreezeWarningDebouncer = w.debounce(
        this._grid.__autoFreezeWarningDebouncer,
        le,
        () => {
        }
      ));
    }
  }
  /** @private */
  _groupFrozenChanged(t, e) {
    e === void 0 || t === void 0 || t !== !1 && (this.__scheduleAutoFreezeWarning(e, "frozen"), Array.from(e).forEach((i) => {
      i.frozen = t;
    }));
  }
  /** @private */
  _groupFrozenToEndChanged(t, e) {
    e === void 0 || t === void 0 || t !== !1 && (this.__scheduleAutoFreezeWarning(e, "frozenToEnd"), Array.from(e).forEach((i) => {
      i.frozenToEnd = t;
    }));
  }
  /** @private */
  _groupHiddenChanged(t) {
    (t || this.__groupHiddenInitialized) && this._synchronizeHidden(), this.__groupHiddenInitialized = !0;
  }
  /** @private */
  _updateAutoHidden() {
    const t = this._autoHidden;
    this._autoHidden = (this._visibleChildColumns || []).length === 0, (t || this._autoHidden) && (this.hidden = this._autoHidden);
  }
  /** @private */
  _synchronizeHidden() {
    this._childColumns && !this._preventHiddenSynchronization && this._childColumns.forEach((t) => {
      t.hidden = this.hidden;
    });
  }
  /** @private */
  _colSpanChanged(t, e, i) {
    e && (e.setAttribute("colspan", t), this._grid && this._grid._a11yUpdateCellColspan(e, t)), i && (i.setAttribute("colspan", t), this._grid && this._grid._a11yUpdateCellColspan(i, t));
  }
  /**
   * @param {!GridColumnGroup} el
   * @return {!Array<!GridColumn>}
   * @protected
   */
  _getChildColumns(t) {
    return Fe.getFlattenedNodes(t).filter(this._isColumnElement);
  }
  /** @private */
  _addNodeObserver() {
    this._observer = new Fe(this, (t) => {
      (t.addedNodes.filter(this._isColumnElement).length > 0 || t.removedNodes.filter(this._isColumnElement).length > 0) && (this._preventHiddenSynchronization = !0, this._rootColumns = this._getChildColumns(this), this._childColumns = this._rootColumns, this._updateVisibleChildColumns(this._childColumns), this._preventHiddenSynchronization = !1, this._grid && this._grid._debounceUpdateColumnTree && this._grid._debounceUpdateColumnTree());
    }), this._observer.flush();
  }
  /**
   * @param {!Node} node
   * @return {boolean}
   * @protected
   */
  _isColumnElement(t) {
    return t.nodeType === Node.ELEMENT_NODE && /\bcolumn\b/u.test(t.localName);
  }
}
customElements.define(Ps.is, Ps);
/**
 * @license
 * Copyright (c) 2017 - 2023 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
m("vaadin-text-field", St, {
  moduleId: "lumo-text-field-styles"
});
/**
 * @license
 * Copyright (c) 2021 - 2023 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
const Su = (o) => class extends fi(o) {
  static get properties() {
    return {
      /**
       * Whether the value of the control can be automatically completed by the browser.
       * List of available options at:
       * https://developer.mozilla.org/en/docs/Web/HTML/Element/input#attr-autocomplete
       */
      autocomplete: {
        type: String
      },
      /**
       * This is a property supported by Safari that is used to control whether
       * autocorrection should be enabled when the user is entering/editing the text.
       * Possible values are:
       * on: Enable autocorrection.
       * off: Disable autocorrection.
       */
      autocorrect: {
        type: String
      },
      /**
       * This is a property supported by Safari and Chrome that is used to control whether
       * autocapitalization should be enabled when the user is entering/editing the text.
       * Possible values are:
       * characters: Characters capitalization.
       * words: Words capitalization.
       * sentences: Sentences capitalization.
       * none: No capitalization.
       */
      autocapitalize: {
        type: String,
        reflectToAttribute: !0
      }
    };
  }
  static get delegateAttrs() {
    return [...super.delegateAttrs, "autocapitalize", "autocomplete", "autocorrect"];
  }
  // Workaround for https://github.com/Polymer/polymer/issues/5259
  get __data() {
    return this.__dataValue || {};
  }
  set __data(e) {
    this.__dataValue = e;
  }
  /**
   * @param {HTMLElement} input
   * @protected
   * @override
   */
  _inputElementChanged(e) {
    super._inputElementChanged(e), e && (e.value && e.value !== this.value && (e.value = ""), this.value && (e.value = this.value));
  }
  /**
   * Override an event listener from `FocusMixin`.
   * @param {boolean} focused
   * @protected
   * @override
   */
  _setFocused(e) {
    super._setFocused(e), e || this.validate();
  }
  /**
   * Override an event listener from `InputMixin`
   * to mark as valid after user started typing.
   * @param {Event} event
   * @protected
   * @override
   */
  _onInput(e) {
    super._onInput(e), this.invalid && this.validate();
  }
  /**
   * Override an observer from `InputMixin` to validate the field
   * when a new value is set programmatically.
   *
   * @param {string | undefined} newValue
   * @param {string | undefined} oldValue
   * @protected
   * @override
   */
  _valueChanged(e, i) {
    super._valueChanged(e, i), i !== void 0 && this.invalid && this.validate();
  }
};
/**
 * @license
 * Copyright (c) 2021 - 2023 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
const Iu = (o) => class extends Su(o) {
  static get properties() {
    return {
      /**
       * Maximum number of characters (in Unicode code points) that the user can enter.
       */
      maxlength: {
        type: Number
      },
      /**
       * Minimum number of characters (in Unicode code points) that the user can enter.
       */
      minlength: {
        type: Number
      },
      /**
       * A regular expression that the value is checked against.
       * The pattern must match the entire value, not just some subset.
       */
      pattern: {
        type: String
      }
    };
  }
  static get delegateAttrs() {
    return [...super.delegateAttrs, "maxlength", "minlength", "pattern"];
  }
  static get constraints() {
    return [...super.constraints, "maxlength", "minlength", "pattern"];
  }
  constructor() {
    super(), this._setType("text");
  }
  /** @protected */
  get clearElement() {
    return this.$.clearButton;
  }
  /** @protected */
  ready() {
    super.ready(), this.addController(
      new It(this, (e) => {
        this._setInputElement(e), this._setFocusElement(e), this.stateTarget = e, this.ariaTarget = e;
      })
    ), this.addController(new Tt(this.inputElement, this._labelController));
  }
};
/**
 * @license
 * Copyright (c) 2017 - 2023 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
m("vaadin-text-field", Pt, { moduleId: "vaadin-text-field-styles" });
class Ds extends Iu(O(he(A))) {
  static get is() {
    return "vaadin-text-field";
  }
  static get template() {
    return k`
      <style>
        [part='input-field'] {
          flex-grow: 0;
        }
      </style>

      <div class="vaadin-field-container">
        <div part="label">
          <slot name="label"></slot>
          <span part="required-indicator" aria-hidden="true" on-click="focus"></span>
        </div>

        <vaadin-input-container
          part="input-field"
          readonly="[[readonly]]"
          disabled="[[disabled]]"
          invalid="[[invalid]]"
          theme$="[[_theme]]"
        >
          <slot name="prefix" slot="prefix"></slot>
          <slot name="input"></slot>
          <slot name="suffix" slot="suffix"></slot>
          <div id="clearButton" part="clear-button" slot="suffix" aria-hidden="true"></div>
        </vaadin-input-container>

        <div part="helper-text">
          <slot name="helper"></slot>
        </div>

        <div part="error-message">
          <slot name="error-message"></slot>
        </div>
      </div>
      <slot name="tooltip"></slot>
    `;
  }
  static get properties() {
    return {
      /**
       * Maximum number of characters (in Unicode code points) that the user can enter.
       */
      maxlength: {
        type: Number
      },
      /**
       * Minimum number of characters (in Unicode code points) that the user can enter.
       */
      minlength: {
        type: Number
      }
    };
  }
  /** @protected */
  ready() {
    super.ready(), this._tooltipController = new ue(this), this._tooltipController.setPosition("top"), this.addController(this._tooltipController);
  }
}
customElements.define(Ds.is, Ds);
/**
 * @license
 * Copyright (c) 2016 - 2023 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
class Os extends ie(A) {
  static get template() {
    return k`
      <style>
        :host {
          display: inline-flex;
          max-width: 100%;
        }

        ::slotted(*) {
          width: 100%;
          box-sizing: border-box;
        }
      </style>
      <slot></slot>
    `;
  }
  static get is() {
    return "vaadin-grid-filter";
  }
  static get properties() {
    return {
      /**
       * JS Path of the property in the item used for filtering the data.
       */
      path: String,
      /**
       * Current filter value.
       */
      value: {
        type: String,
        notify: !0
      },
      /** @private */
      _textField: {
        type: Object
      }
    };
  }
  static get observers() {
    return ["_filterChanged(path, value, _textField)"];
  }
  /** @protected */
  ready() {
    super.ready(), this._filterController = new X(this, "", "vaadin-text-field", {
      initializer: (t) => {
        t.addEventListener("value-changed", (e) => {
          this.value = e.detail.value;
        }), this._textField = t;
      }
    }), this.addController(this._filterController);
  }
  /** @private */
  _filterChanged(t, e, i) {
    t === void 0 || e === void 0 || !i || this._previousValue === void 0 && e === "" || (i.value = e, this._previousValue = e, this._debouncerFilterChanged = w.debounce(this._debouncerFilterChanged, L.after(200), () => {
      this.dispatchEvent(new CustomEvent("filter-changed", { bubbles: !0 }));
    }));
  }
  focus() {
    this._textField && this._textField.focus();
  }
}
customElements.define(Os.is, Os);
/**
 * @license
 * Copyright (c) 2016 - 2023 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
class zs extends Ue {
  static get is() {
    return "vaadin-grid-filter-column";
  }
  static get properties() {
    return {
      /**
       * JS Path of the property in the item used for filtering the data.
       */
      path: String,
      /**
       * Text to display as the label of the column filter text-field.
       */
      header: String
    };
  }
  static get observers() {
    return ["_onHeaderRendererOrBindingChanged(_headerRenderer, _headerCell, path, header, _filterValue)"];
  }
  constructor() {
    super(), this.__boundOnFilterValueChanged = this.__onFilterValueChanged.bind(this);
  }
  /**
   * Renders the grid filter with the custom text field to the header cell.
   *
   * @override
   */
  _defaultHeaderRenderer(t, e) {
    let i = t.firstElementChild, r = i ? i.firstElementChild : void 0;
    i || (i = document.createElement("vaadin-grid-filter"), r = document.createElement("vaadin-text-field"), r.setAttribute("theme", "small"), r.setAttribute("style", "max-width: 100%;"), r.setAttribute("focus-target", ""), r.addEventListener("value-changed", this.__boundOnFilterValueChanged), i.appendChild(r), t.appendChild(i)), i.path = this.path, i.value = this._filterValue, r.__rendererValue = this._filterValue, r.value = this._filterValue, r.label = this.__getHeader(this.header, this.path);
  }
  /**
   * The filter column doesn't allow to use a custom header renderer
   * to override the header cell content.
   * It always renders the grid filter to the header cell.
   *
   * @override
   */
  _computeHeaderRenderer() {
    return this._defaultHeaderRenderer;
  }
  /**
   * Updates the internal filter value once the filter text field is changed.
   * The listener handles only user-fired events.
   *
   * @private
   */
  __onFilterValueChanged(t) {
    t.detail.value !== t.target.__rendererValue && (this._filterValue = t.detail.value);
  }
  /** @private */
  __getHeader(t, e) {
    if (t)
      return t;
    if (e)
      return this._generateHeader(e);
  }
}
customElements.define(zs.is, zs);
/**
 * @license
 * Copyright (c) 2016 - 2023 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
class $s extends Ue {
  static get is() {
    return "vaadin-grid-selection-column";
  }
  static get properties() {
    return {
      /**
       * Width of the cells for this column.
       */
      width: {
        type: String,
        value: "58px"
      },
      /**
       * Flex grow ratio for the cell widths. When set to 0, cell width is fixed.
       * @attr {number} flex-grow
       * @type {number}
       */
      flexGrow: {
        type: Number,
        value: 0
      },
      /**
       * When true, all the items are selected.
       * @attr {boolean} select-all
       * @type {boolean}
       */
      selectAll: {
        type: Boolean,
        value: !1,
        notify: !0
      },
      /**
       * When true, the active gets automatically selected.
       * @attr {boolean} auto-select
       * @type {boolean}
       */
      autoSelect: {
        type: Boolean,
        value: !1
      },
      /** @private */
      __indeterminate: Boolean,
      /**
       * The previous state of activeItem. When activeItem turns to `null`,
       * previousActiveItem will have an Object with just unselected activeItem
       * @private
       */
      __previousActiveItem: Object,
      /** @private */
      __selectAllHidden: Boolean
    };
  }
  static get observers() {
    return [
      "__onSelectAllChanged(selectAll)",
      "_onHeaderRendererOrBindingChanged(_headerRenderer, _headerCell, path, header, selectAll, __indeterminate, __selectAllHidden)"
    ];
  }
  constructor() {
    super(), this.__boundOnActiveItemChanged = this.__onActiveItemChanged.bind(this), this.__boundOnDataProviderChanged = this.__onDataProviderChanged.bind(this), this.__boundOnSelectedItemsChanged = this.__onSelectedItemsChanged.bind(this);
  }
  /** @protected */
  disconnectedCallback() {
    this._grid.removeEventListener("active-item-changed", this.__boundOnActiveItemChanged), this._grid.removeEventListener("data-provider-changed", this.__boundOnDataProviderChanged), this._grid.removeEventListener("filter-changed", this.__boundOnSelectedItemsChanged), this._grid.removeEventListener("selected-items-changed", this.__boundOnSelectedItemsChanged), super.disconnectedCallback();
  }
  /** @protected */
  connectedCallback() {
    super.connectedCallback(), this._grid && (this._grid.addEventListener("active-item-changed", this.__boundOnActiveItemChanged), this._grid.addEventListener("data-provider-changed", this.__boundOnDataProviderChanged), this._grid.addEventListener("filter-changed", this.__boundOnSelectedItemsChanged), this._grid.addEventListener("selected-items-changed", this.__boundOnSelectedItemsChanged));
  }
  /**
   * Renders the Select All checkbox to the header cell.
   *
   * @override
   */
  _defaultHeaderRenderer(t, e) {
    let i = t.firstElementChild;
    i || (i = document.createElement("vaadin-checkbox"), i.setAttribute("aria-label", "Select All"), i.classList.add("vaadin-grid-select-all-checkbox"), i.addEventListener("checked-changed", this.__onSelectAllCheckedChanged.bind(this)), t.appendChild(i));
    const r = this.__isChecked(this.selectAll, this.__indeterminate);
    i.__rendererChecked = r, i.checked = r, i.hidden = this.__selectAllHidden, i.indeterminate = this.__indeterminate;
  }
  /**
   * Renders the Select Row checkbox to the body cell.
   *
   * @override
   */
  _defaultRenderer(t, e, { item: i, selected: r }) {
    let s = t.firstElementChild;
    s || (s = document.createElement("vaadin-checkbox"), s.setAttribute("aria-label", "Select Row"), s.addEventListener("checked-changed", this.__onSelectRowCheckedChanged.bind(this)), t.appendChild(s)), s.__item = i, s.__rendererChecked = r, s.checked = r;
  }
  /** @private */
  __onSelectAllChanged(t) {
    if (!(t === void 0 || !this._grid)) {
      if (!this.__selectAllInitialized) {
        this.__selectAllInitialized = !0;
        return;
      }
      this._selectAllChangeLock || (t && this.__hasArrayDataProvider() ? this.__withFilteredItemsArray((e) => {
        this._grid.selectedItems = e;
      }) : this._grid.selectedItems = []);
    }
  }
  /**
   * Return true if array `a` contains all the items in `b`
   * We need this when sorting or to preserve selection after filtering.
   * @private
   */
  __arrayContains(t, e) {
    return Array.isArray(t) && Array.isArray(e) && e.every((i) => t.includes(i));
  }
  /**
   * Enables or disables the Select All mode once the Select All checkbox is switched.
   * The listener handles only user-fired events.
   *
   * @private
   */
  __onSelectAllCheckedChanged(t) {
    t.target.checked !== t.target.__rendererChecked && (this.selectAll = this.__indeterminate || t.target.checked);
  }
  /**
   * Selects or deselects the row once the Select Row checkbox is switched.
   * The listener handles only user-fired events.
   *
   * @private
   */
  __onSelectRowCheckedChanged(t) {
    t.target.checked !== t.target.__rendererChecked && (t.target.checked ? this._grid.selectItem(t.target.__item) : this._grid.deselectItem(t.target.__item));
  }
  /**
   * IOS needs indeterminate + checked at the same time
   * @private
   */
  __isChecked(t, e) {
    return e || t;
  }
  /** @private */
  __onActiveItemChanged(t) {
    const e = t.detail.value;
    if (this.autoSelect) {
      const i = e || this.__previousActiveItem;
      i && this._grid._toggleItem(i);
    }
    this.__previousActiveItem = e;
  }
  /** @private */
  __hasArrayDataProvider() {
    return Array.isArray(this._grid.items) && !!this._grid.dataProvider;
  }
  /** @private */
  __onSelectedItemsChanged() {
    this._selectAllChangeLock = !0, this.__hasArrayDataProvider() && this.__withFilteredItemsArray((t) => {
      this._grid.selectedItems.length ? this.__arrayContains(this._grid.selectedItems, t) ? (this.selectAll = !0, this.__indeterminate = !1) : (this.selectAll = !1, this.__indeterminate = !0) : (this.selectAll = !1, this.__indeterminate = !1);
    }), this._selectAllChangeLock = !1;
  }
  /** @private */
  __onDataProviderChanged() {
    this.__selectAllHidden = !Array.isArray(this._grid.items);
  }
  /**
   * Assuming the grid uses an items array data provider, fetches all the filtered items
   * from the data provider and invokes the callback with the resulting array.
   *
   * @private
   */
  __withFilteredItemsArray(t) {
    const e = {
      page: 0,
      pageSize: 1 / 0,
      sortOrders: [],
      filters: this._grid._mapFilters()
    };
    this._grid.dataProvider(e, (i) => t(i));
  }
}
customElements.define($s.is, $s);
m(
  "vaadin-grid-sorter",
  _`
    :host {
      justify-content: flex-start;
      align-items: baseline;
      -webkit-user-select: none;
      -moz-user-select: none;
      user-select: none;
      cursor: var(--lumo-clickable-cursor);
    }

    [part='content'] {
      display: inline-block;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    [part='indicators'] {
      margin-left: var(--lumo-space-s);
    }

    [part='indicators']::before {
      transform: scale(0.8);
    }

    :host(:not([direction]):not(:hover)) [part='indicators'] {
      color: var(--lumo-tertiary-text-color);
    }

    :host([direction]) {
      color: var(--lumo-primary-text-color);
    }

    [part='order'] {
      font-size: var(--lumo-font-size-xxs);
      line-height: 1;
    }

    /* RTL specific styles */

    :host([dir='rtl']) [part='indicators'] {
      margin-right: var(--lumo-space-s);
      margin-left: 0;
    }
  `,
  { moduleId: "lumo-grid-sorter" }
);
/**
 * @license
 * Copyright (c) 2016 - 2023 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
const Pa = document.createElement("template");
Pa.innerHTML = `
  <style>
    @font-face {
      font-family: 'vaadin-grid-sorter-icons';
      src: url(data:application/font-woff;charset=utf-8;base64,d09GRgABAAAAAAQwAA0AAAAABuwAAQAAAAAAAAAAAAAAAAAAAAAAAAAAAABGRlRNAAAEFAAAABkAAAAcfep+mUdERUYAAAP4AAAAHAAAAB4AJwAOT1MvMgAAAZgAAAA/AAAAYA8TBPpjbWFwAAAB7AAAAFUAAAFeF1fZ4mdhc3AAAAPwAAAACAAAAAgAAAAQZ2x5ZgAAAlgAAABcAAAAnMvguMloZWFkAAABMAAAAC8AAAA2C5Ap72hoZWEAAAFgAAAAHQAAACQGbQPHaG10eAAAAdgAAAAUAAAAHAoAAABsb2NhAAACRAAAABIAAAASAIwAYG1heHAAAAGAAAAAFgAAACAACwAKbmFtZQAAArQAAAECAAACZxWCgKhwb3N0AAADuAAAADUAAABZCrApUXicY2BkYGAA4rDECVrx/DZfGbhZGEDgyqNPOxH0/wNMq5kPALkcDEwgUQBWRA0dAHicY2BkYGA+8P8AAwMLAwgwrWZgZEAFbABY4QM8AAAAeJxjYGRgYOAAQiYGEICQSAAAAi8AFgAAeJxjYGY6yziBgZWBgWkm0xkGBoZ+CM34msGYkZMBFTAKoAkwODAwvmRiPvD/AIMDMxCD1CDJKjAwAgBktQsXAHicY2GAAMZQCM0EwqshbAALxAEKeJxjYGBgZoBgGQZGBhCIAPIYwXwWBhsgzcXAwcAEhIwMCi+Z/v/9/x+sSuElA4T9/4k4K1gHFwMMMILMY2QDYmaoABOQYGJABUA7WBiGNwAAJd4NIQAAAAAAAAAACAAIABAAGAAmAEAATgAAeJyNjLENgDAMBP9tIURJwQCMQccSZgk2i5fIYBDAidJjycXr7x5EPwE2wY8si7jmyBNXGo/bNBerxJNrpxhbO3/fEFpx8ZICpV+ghxJ74fAMe+h7Ox14AbrsHB14nK2QQWrDMBRER4mTkhQK3ZRQKOgCNk7oGQqhhEIX2WSlWEI1BAlkJ5CDdNsj5Ey9Rncdi38ES+jzNJo/HwTgATcoDEthhY3wBHc4CE+pfwsX5F/hGe7Vo/AcK/UhvMSz+mGXKhZU6pww8ISz3oWn1BvhgnwTnuEJf8Jz1OpFeIlX9YULDLdFi4ASHolkSR0iuYdjLak1vAequBhj21D61Nqyi6l3qWybGPjySbPHGScGJl6dP58MYcQRI0bts7mjebBqrFENH7t3qWtj0OuqHnXcW7b0HOTZFnKryRGW2hFX1m0O2vEM3opNMfTau+CS6Z3Vx6veNnEXY6jwDxhsc2gAAHicY2BiwA84GBgYmRiYGJkZmBlZGFkZ2djScyoLMgzZS/MyDQwMwLSrpYEBlIbxjQDrzgsuAAAAAAEAAf//AA94nGNgZGBg4AFiMSBmYmAEQnYgZgHzGAAD6wA2eJxjYGBgZACCKyoz1cD0o087YTQATOcIewAAAA==) format('woff');
      font-weight: normal;
      font-style: normal;
    }
  </style>
`;
document.head.appendChild(Pa.content);
class Ms extends O(te(A)) {
  static get template() {
    return k`
      <style>
        :host {
          display: inline-flex;
          cursor: pointer;
          max-width: 100%;
        }

        [part='content'] {
          flex: 1 1 auto;
        }

        [part='indicators'] {
          position: relative;
          align-self: center;
          flex: none;
        }

        [part='order'] {
          display: inline;
          vertical-align: super;
        }

        [part='indicators']::before {
          font-family: 'vaadin-grid-sorter-icons';
          display: inline-block;
        }

        :host(:not([direction])) [part='indicators']::before {
          content: '\\e901';
        }

        :host([direction='asc']) [part='indicators']::before {
          content: '\\e900';
        }

        :host([direction='desc']) [part='indicators']::before {
          content: '\\e902';
        }
      </style>

      <div part="content">
        <slot></slot>
      </div>
      <div part="indicators">
        <span part="order">[[_getDisplayOrder(_order)]]</span>
      </div>
    `;
  }
  static get is() {
    return "vaadin-grid-sorter";
  }
  static get properties() {
    return {
      /**
       * JS Path of the property in the item used for sorting the data.
       */
      path: String,
      /**
       * How to sort the data.
       * Possible values are `asc` to use an ascending algorithm, `desc` to sort the data in
       * descending direction, or `null` for not sorting the data.
       * @type {GridSorterDirection | undefined}
       */
      direction: {
        type: String,
        reflectToAttribute: !0,
        notify: !0,
        value: null
      },
      /**
       * @type {number | null}
       * @protected
       */
      _order: {
        type: Number,
        value: null
      },
      /** @private */
      _isConnected: {
        type: Boolean,
        observer: "__isConnectedChanged"
      }
    };
  }
  static get observers() {
    return ["_pathOrDirectionChanged(path, direction)"];
  }
  /** @protected */
  ready() {
    super.ready(), this.addEventListener("click", this._onClick.bind(this));
  }
  /** @protected */
  connectedCallback() {
    super.connectedCallback(), this._isConnected = !0;
  }
  /** @protected */
  disconnectedCallback() {
    super.disconnectedCallback(), this._isConnected = !1, !this.parentNode && this._grid && this._grid.__removeSorters([this]);
  }
  /** @private */
  _pathOrDirectionChanged() {
    this.__dispatchSorterChangedEvenIfPossible();
  }
  /** @private */
  __isConnectedChanged(t, e) {
    e !== !1 && this.__dispatchSorterChangedEvenIfPossible();
  }
  /** @private */
  __dispatchSorterChangedEvenIfPossible() {
    this.path === void 0 || this.direction === void 0 || !this._isConnected || (this.dispatchEvent(
      new CustomEvent("sorter-changed", {
        detail: { shiftClick: !!this._shiftClick, fromSorterClick: !!this._fromSorterClick },
        bubbles: !0,
        composed: !0
      })
    ), this._fromSorterClick = !1, this._shiftClick = !1);
  }
  /** @private */
  _getDisplayOrder(t) {
    return t === null ? "" : t + 1;
  }
  /** @private */
  _onClick(t) {
    if (t.defaultPrevented)
      return;
    const e = this.getRootNode().activeElement;
    this !== e && this.contains(e) || (t.preventDefault(), this._shiftClick = t.shiftKey, this._fromSorterClick = !0, this.direction === "asc" ? this.direction = "desc" : this.direction === "desc" ? this.direction = null : this.direction = "asc");
  }
}
customElements.define(Ms.is, Ms);
/**
 * @license
 * Copyright (c) 2016 - 2023 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
class Rs extends Ue {
  static get is() {
    return "vaadin-grid-sort-column";
  }
  static get properties() {
    return {
      /**
       * JS Path of the property in the item used for sorting the data.
       */
      path: String,
      /**
       * How to sort the data.
       * Possible values are `asc` to use an ascending algorithm, `desc` to sort the data in
       * descending direction, or `null` for not sorting the data.
       * @type {GridSorterDirection | undefined}
       */
      direction: {
        type: String,
        notify: !0
      }
    };
  }
  static get observers() {
    return ["_onHeaderRendererOrBindingChanged(_headerRenderer, _headerCell, path, header, direction)"];
  }
  constructor() {
    super(), this.__boundOnDirectionChanged = this.__onDirectionChanged.bind(this);
  }
  /**
   * Renders the grid sorter to the header cell.
   *
   * @override
   */
  _defaultHeaderRenderer(t, e) {
    let i = t.firstElementChild;
    i || (i = document.createElement("vaadin-grid-sorter"), i.addEventListener("direction-changed", this.__boundOnDirectionChanged), t.appendChild(i)), i.path = this.path, i.__rendererDirection = this.direction, i.direction = this.direction, i.textContent = this.__getHeader(this.header, this.path);
  }
  /**
   * The sort column doesn't allow to use a custom header renderer
   * to override the header cell content.
   * It always renders the grid sorter to the header cell.
   *
   * @override
   */
  _computeHeaderRenderer() {
    return this._defaultHeaderRenderer;
  }
  /**
   * Updates the sorting direction once the grid sorter's direction is changed.
   * The listener handles only user-fired events.
   *
   * @private
   */
  __onDirectionChanged(t) {
    t.detail.value !== t.target.__rendererDirection && (this.direction = t.detail.value);
  }
  /** @private */
  __getHeader(t, e) {
    if (t)
      return t;
    if (e)
      return this._generateHeader(e);
  }
}
customElements.define(Rs.is, Rs);
m(
  "vaadin-grid-tree-toggle",
  _`
    :host {
      --vaadin-grid-tree-toggle-level-offset: 2em;
      align-items: center;
      vertical-align: middle;
      transform: translateX(calc(var(--lumo-space-s) * -1));
      -webkit-tap-highlight-color: transparent;
    }

    :host(:not([leaf])) {
      cursor: default;
    }

    [part='toggle'] {
      display: inline-block;
      font-size: 1.5em;
      line-height: 1;
      width: 1em;
      height: 1em;
      text-align: center;
      color: var(--lumo-contrast-50pct);
      cursor: var(--lumo-clickable-cursor);
      /* Increase touch target area */
      padding: calc(1em / 3);
      margin: calc(1em / -3);
    }

    :host(:not([dir='rtl'])) [part='toggle'] {
      margin-right: 0;
    }

    @media (hover: hover) {
      :host(:hover) [part='toggle'] {
        color: var(--lumo-contrast-80pct);
      }
    }

    [part='toggle']::before {
      font-family: 'lumo-icons';
      display: inline-block;
      height: 100%;
    }

    :host(:not([expanded])) [part='toggle']::before {
      content: var(--lumo-icons-angle-right);
    }

    :host([expanded]) [part='toggle']::before {
      content: var(--lumo-icons-angle-right);
      transform: rotate(90deg);
    }

    /* Experimental support for hierarchy connectors, using an unsupported selector */
    :host([theme~='connectors']) #level-spacer {
      position: relative;
      z-index: -1;
      font-size: 1em;
      height: 1.5em;
    }

    :host([theme~='connectors']) #level-spacer::before {
      display: block;
      content: '';
      margin-top: calc(var(--lumo-space-m) * -1);
      height: calc(var(--lumo-space-m) + 3em);
      background-image: linear-gradient(
        to right,
        transparent calc(var(--vaadin-grid-tree-toggle-level-offset) - 1px),
        var(--lumo-contrast-10pct) calc(var(--vaadin-grid-tree-toggle-level-offset) - 1px)
      );
      background-size: var(--vaadin-grid-tree-toggle-level-offset) var(--vaadin-grid-tree-toggle-level-offset);
      background-position: calc(var(--vaadin-grid-tree-toggle-level-offset) / 2 - 2px) 0;
    }

    /* RTL specific styles */

    :host([dir='rtl']) {
      margin-left: 0;
      margin-right: calc(var(--lumo-space-s) * -1);
    }

    :host([dir='rtl']) [part='toggle'] {
      margin-left: 0;
    }

    :host([dir='rtl'][expanded]) [part='toggle']::before {
      transform: rotate(-90deg);
    }

    :host([dir='rtl'][theme~='connectors']) #level-spacer::before {
      background-image: linear-gradient(
        to left,
        transparent calc(var(--vaadin-grid-tree-toggle-level-offset) - 1px),
        var(--lumo-contrast-10pct) calc(var(--vaadin-grid-tree-toggle-level-offset) - 1px)
      );
      background-position: calc(100% - (var(--vaadin-grid-tree-toggle-level-offset) / 2 - 2px)) 0;
    }

    :host([dir='rtl']:not([expanded])) [part='toggle']::before,
    :host([dir='rtl'][expanded]) [part='toggle']::before {
      content: var(--lumo-icons-angle-left);
    }
  `,
  { moduleId: "lumo-grid-tree-toggle" }
);
/**
 * @license
 * Copyright (c) 2016 - 2023 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
const Da = document.createElement("template");
Da.innerHTML = `
  <style>
    @font-face {
      font-family: "vaadin-grid-tree-icons";
      src: url(data:application/font-woff;charset=utf-8;base64,d09GRgABAAAAAAQkAA0AAAAABrwAAQAAAAAAAAAAAAAAAAAAAAAAAAAAAABGRlRNAAAECAAAABoAAAAcgHwa6EdERUYAAAPsAAAAHAAAAB4AJwAOT1MvMgAAAZQAAAA/AAAAYA8TBIJjbWFwAAAB8AAAAFUAAAFeGJvXWmdhc3AAAAPkAAAACAAAAAgAAAAQZ2x5ZgAAAlwAAABLAAAAhIrPOhFoZWFkAAABMAAAACsAAAA2DsJI02hoZWEAAAFcAAAAHQAAACQHAgPHaG10eAAAAdQAAAAZAAAAHAxVAgBsb2NhAAACSAAAABIAAAASAIAAVG1heHAAAAF8AAAAGAAAACAACgAFbmFtZQAAAqgAAAECAAACTwflzbdwb3N0AAADrAAAADYAAABZQ7Ajh3icY2BkYGAA4twv3Vfi+W2+MnCzMIDANSOmbGSa2YEZRHEwMIEoAAoiB6sAeJxjYGRgYD7w/wADAwsDCDA7MDAyoAI2AFEEAtIAAAB4nGNgZGBg4GBgZgDRDAxMDGgAAAGbABB4nGNgZp7JOIGBlYGBaSbTGQYGhn4IzfiawZiRkwEVMAqgCTA4MDA+38d84P8BBgdmIAapQZJVYGAEAGc/C54AeJxjYYAAxlAIzQTELAwMBxgZGB0ACy0BYwAAAHicY2BgYGaAYBkGRgYQiADyGMF8FgYbIM3FwMHABISMDArP9/3/+/8/WJXC8z0Q9v8nEp5gHVwMMMAIMo+RDYiZoQJMQIKJARUA7WBhGN4AACFKDtoAAAAAAAAAAAgACAAQABgAJgA0AEIAAHichYvBEYBADAKBVHBjBT4swl9KS2k05o0XHd/yW1hAfBFwCv9sIlJu3nZaNS3PXAaXXHI8Lge7DlzF7C1RgXc7xkK6+gvcD2URmQB4nK2RQWoCMRiFX3RUqtCli65yADModOMBLLgQSqHddRFnQghIAnEUvEA3vUUP0LP0Fj1G+yb8R5iEhO9/ef/7FwFwj28o9EthiVp4hBlehcfUP4Ur8o/wBAv8CU+xVFvhOR7UB7tUdUdlVRJ6HnHWTnhM/V24In8JT5j/KzzFSi2E53hUz7jCcrcIiDDwyKSW1JEct2HdIPH1DFytbUM0PofWdNk5E5oUqb/Q6HHBiVGZpfOXkyUMEj5IyBuNmYZQjBobfsuassvnkKLe1OuBBj0VQ8cRni2xjLWsHaM0jrjx3peYA0/vrdmUYqe9iy7bzrX6eNP7Jh1SijX+AaUVbB8AAHicY2BiwA84GBgYmRiYGJkZmBlZGFkZ2djScyoLMgzZS/MyDQwMwLSruZMzlHaB0q4A76kLlwAAAAEAAf//AA94nGNgZGBg4AFiMSBmYmAEQnYgZgHzGAAD6wA2eJxjYGBgZACCKxJigiD6mhFTNowGACmcA/8AAA==) format('woff');
      font-weight: normal;
      font-style: normal;
    }
  </style>
`;
document.head.appendChild(Da.content);
class Fs extends O(te(A)) {
  static get template() {
    return k`
      <style>
        :host {
          display: inline-flex;
          align-items: baseline;
          max-width: 100%;

          /* CSS API for :host */
          --vaadin-grid-tree-toggle-level-offset: 1em;
          --_collapsed-icon: '\\e7be\\00a0';
        }

        :host([dir='rtl']) {
          --_collapsed-icon: '\\e7bd\\00a0';
        }

        :host([hidden]) {
          display: none !important;
        }

        :host(:not([leaf])) {
          cursor: pointer;
        }

        #level-spacer,
        [part='toggle'] {
          flex: none;
        }

        #level-spacer {
          display: inline-block;
          width: calc(var(---level, '0') * var(--vaadin-grid-tree-toggle-level-offset));
        }

        [part='toggle']::before {
          font-family: 'vaadin-grid-tree-icons';
          line-height: 1em; /* make icon font metrics not affect baseline */
        }

        :host(:not([expanded])) [part='toggle']::before {
          content: var(--_collapsed-icon);
        }

        :host([expanded]) [part='toggle']::before {
          content: '\\e7bc\\00a0'; /* icon glyph + single non-breaking space */
        }

        :host([leaf]) [part='toggle'] {
          visibility: hidden;
        }

        slot {
          display: block;
          overflow: hidden;
          text-overflow: ellipsis;
        }
      </style>

      <span id="level-spacer"></span>
      <span part="toggle"></span>
      <slot></slot>
    `;
  }
  static get is() {
    return "vaadin-grid-tree-toggle";
  }
  static get properties() {
    return {
      /**
       * Current level of the tree represented with a horizontal offset
       * of the toggle button.
       * @type {number}
       */
      level: {
        type: Number,
        value: 0,
        observer: "_levelChanged"
      },
      /**
       * Hides the toggle icon and disables toggling a tree sublevel.
       * @type {boolean}
       */
      leaf: {
        type: Boolean,
        value: !1,
        reflectToAttribute: !0
      },
      /**
       * Sublevel toggle state.
       * @type {boolean}
       */
      expanded: {
        type: Boolean,
        value: !1,
        reflectToAttribute: !0,
        notify: !0
      }
    };
  }
  /** @protected */
  ready() {
    super.ready(), this.addEventListener("click", (t) => this._onClick(t));
  }
  /** @private */
  _onClick(t) {
    this.leaf || Sa(t.target) || t.target instanceof HTMLLabelElement || (t.preventDefault(), this.expanded = !this.expanded);
  }
  /** @private */
  _levelChanged(t) {
    const e = Number(t).toString();
    this.style.setProperty("---level", e);
  }
}
customElements.define(Fs.is, Fs);
/**
 * @license
 * Copyright (c) 2016 - 2023 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
class Ns extends Ue {
  static get is() {
    return "vaadin-grid-tree-column";
  }
  static get properties() {
    return {
      /**
       * JS Path of the property in the item used as text content for the tree toggle.
       */
      path: String
    };
  }
  static get observers() {
    return ["_onRendererOrBindingChanged(_renderer, _cells, _bodyContentHidden, _cells.*, path)"];
  }
  constructor() {
    super(), this.__boundOnExpandedChanged = this.__onExpandedChanged.bind(this);
  }
  /**
   * Renders the grid tree toggle to the body cell
   *
   * @private
   */
  __defaultRenderer(t, e, { item: i, expanded: r, level: s }) {
    let n = t.firstElementChild;
    n || (n = document.createElement("vaadin-grid-tree-toggle"), n.addEventListener("expanded-changed", this.__boundOnExpandedChanged), t.appendChild(n)), n.__item = i, n.__rendererExpanded = r, n.expanded = r, n.leaf = this.__isLeafItem(i, this._grid.itemHasChildrenPath), n.textContent = this.__getToggleContent(this.path, i), n.level = s;
  }
  /**
   * The tree column doesn't allow to use a custom renderer
   * to override the content of body cells.
   * It always renders the grid tree toggle to body cells.
   *
   * @override
   */
  _computeRenderer() {
    return this.__defaultRenderer;
  }
  /**
   * Expands or collapses the row once the tree toggle is switched.
   * The listener handles only user-fired events.
   *
   * @private
   */
  __onExpandedChanged(t) {
    t.detail.value !== t.target.__rendererExpanded && (t.detail.value ? this._grid.expandItem(t.target.__item) : this._grid.collapseItem(t.target.__item));
  }
  /** @private */
  __isLeafItem(t, e) {
    return !t || !t[e];
  }
  /** @private */
  __getToggleContent(t, e) {
    return t && this.get(t, e);
  }
}
customElements.define(Ns.is, Ns);
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const Jr = { ATTRIBUTE: 1, CHILD: 2, PROPERTY: 3, BOOLEAN_ATTRIBUTE: 4, EVENT: 5, ELEMENT: 6 }, eo = (o) => (...t) => ({ _$litDirective$: o, values: t });
class Oa {
  constructor(t) {
  }
  get _$AU() {
    return this._$AM._$AU;
  }
  _$AT(t, e, i) {
    this._$Ct = t, this._$AM = e, this._$Ci = i;
  }
  _$AS(t, e) {
    return this.update(t, e);
  }
  update(t, e) {
    return this.render(...e);
  }
}
/**
 * @license
 * Copyright 2020 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const Tu = (o, t) => t === void 0 ? (o == null ? void 0 : o._$litType$) !== void 0 : (o == null ? void 0 : o._$litType$) === t, Pu = (o) => o.strings === void 0;
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const dt = (o, t) => {
  var e, i;
  const r = o._$AN;
  if (r === void 0)
    return !1;
  for (const s of r)
    (i = (e = s)._$AO) === null || i === void 0 || i.call(e, t, !1), dt(s, t);
  return !0;
}, oi = (o) => {
  let t, e;
  do {
    if ((t = o._$AM) === void 0)
      break;
    e = t._$AN, e.delete(o), o = t;
  } while ((e == null ? void 0 : e.size) === 0);
}, za = (o) => {
  for (let t; t = o._$AM; o = t) {
    let e = t._$AN;
    if (e === void 0)
      t._$AN = e = /* @__PURE__ */ new Set();
    else if (e.has(o))
      break;
    e.add(o), zu(t);
  }
};
function Du(o) {
  this._$AN !== void 0 ? (oi(this), this._$AM = o, za(this)) : this._$AM = o;
}
function Ou(o, t = !1, e = 0) {
  const i = this._$AH, r = this._$AN;
  if (r !== void 0 && r.size !== 0)
    if (t)
      if (Array.isArray(i))
        for (let s = e; s < i.length; s++)
          dt(i[s], !1), oi(i[s]);
      else
        i != null && (dt(i, !1), oi(i));
    else
      dt(this, o);
}
const zu = (o) => {
  var t, e, i, r;
  o.type == Jr.CHILD && ((t = (i = o)._$AP) !== null && t !== void 0 || (i._$AP = Ou), (e = (r = o)._$AQ) !== null && e !== void 0 || (r._$AQ = Du));
};
class $u extends Oa {
  constructor() {
    super(...arguments), this._$AN = void 0;
  }
  _$AT(t, e, i) {
    super._$AT(t, e, i), za(this), this.isConnected = t._$AU;
  }
  _$AO(t, e = !0) {
    var i, r;
    t !== this.isConnected && (this.isConnected = t, t ? (i = this.reconnected) === null || i === void 0 || i.call(this) : (r = this.disconnected) === null || r === void 0 || r.call(this)), e && (dt(this, t), oi(this));
  }
  setValue(t) {
    if (Pu(this._$Ct))
      this._$Ct._$AI(t, this);
    else {
      const e = [...this._$Ct._$AH];
      e[this._$Ci] = t, this._$Ct._$AI(e, this, 0);
    }
  }
  disconnected() {
  }
  reconnected() {
  }
}
/**
 * @license
 * Copyright (c) 2016 - 2023 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
const Ls = Symbol("valueNotInitialized");
class Mu extends $u {
  constructor(t) {
    if (super(t), t.type !== Jr.ELEMENT)
      throw new Error(`\`${this.constructor.name}\` must be bound to an element.`);
    this.previousValue = Ls;
  }
  /** @override */
  render(t, e) {
    return b;
  }
  /** @override */
  update(t, [e, i]) {
    return this.hasChanged(i) && (this.host = t.options && t.options.host, this.element = t.element, this.renderer = e, this.previousValue === Ls ? this.addRenderer() : this.runRenderer(), this.previousValue = Array.isArray(i) ? [...i] : i), b;
  }
  /** @override */
  reconnected() {
    this.addRenderer();
  }
  /** @override */
  disconnected() {
    this.removeRenderer();
  }
  /** @abstract */
  addRenderer() {
    throw new Error("The `addRenderer` method must be implemented.");
  }
  /** @abstract */
  runRenderer() {
    throw new Error("The `runRenderer` method must be implemented.");
  }
  /** @abstract */
  removeRenderer() {
    throw new Error("The `removeRenderer` method must be implemented.");
  }
  /** @protected */
  renderRenderer(t, ...e) {
    const i = this.renderer.call(this.host, ...e);
    Qs(i, t, { host: this.host });
  }
  /** @protected */
  hasChanged(t) {
    return Array.isArray(t) ? !Array.isArray(this.previousValue) || this.previousValue.length !== t.length ? !0 : t.some((e, i) => e !== this.previousValue[i]) : this.previousValue !== t;
  }
}
/**
 * @license
 * Copyright (c) 2017 - 2023 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
const Bs = Symbol("contentUpdateDebouncer");
/**
 * @license
 * Copyright (c) 2017 - 2023 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
class $a extends Mu {
  /**
   * A property to that the renderer callback will be assigned.
   *
   * @abstract
   */
  get rendererProperty() {
    throw new Error("The `rendererProperty` getter must be implemented.");
  }
  /**
   * Adds the renderer callback to the grid column.
   */
  addRenderer() {
    this.element[this.rendererProperty] = (t, e) => {
      this.renderRenderer(t, e);
    };
  }
  /**
   * Runs the renderer callback on the grid column.
   */
  runRenderer() {
    const t = this.element._grid;
    t[Bs] = w.debounce(t[Bs], de, () => {
      t.requestContentUpdate();
    });
  }
  /**
   * Removes the renderer callback from the grid column.
   */
  removeRenderer() {
    this.element[this.rendererProperty] = null;
  }
}
class Ru extends $a {
  get rendererProperty() {
    return "renderer";
  }
  addRenderer() {
    this.element[this.rendererProperty] = (t, e, i) => {
      this.renderRenderer(t, i.item, i, e);
    };
  }
}
class Fu extends $a {
  get rendererProperty() {
    return "headerRenderer";
  }
}
const Nu = eo(Ru), Lu = eo(Fu);
var Bu = Object.defineProperty, Hu = Object.getOwnPropertyDescriptor, Vu = Object.getPrototypeOf, Uu = Reflect.get, je = (o, t, e, i) => {
  for (var r = i > 1 ? void 0 : i ? Hu(t, e) : t, s = o.length - 1, n; s >= 0; s--)
    (n = o[s]) && (r = (i ? n(t, e, r) : n(r)) || r);
  return i && r && Bu(t, e, r), r;
}, qu = (o, t, e) => Uu(Vu(o), e, t);
let q = class extends wt {
  constructor() {
    super(), this.overall_record_count = -1, this.data = null, this.dataProvider = async (o, t) => {
      const { page: e, pageSize: i, sortOrders: r } = o;
      if (this._inputData) {
        const s = await this.fetchQueryResults({
          page: e + 1,
          pageSize: i,
          sortOrders: r,
          searchTerm: ""
        });
        let n, a;
        [n, a] = s, (a > 0 || e == 0) && (this.overall_record_count = a, this.requestUpdate()), t(n, this.overall_record_count);
      } else
        t([], 0);
    }, this.cellRenderer = (o, t, e) => {
      const i = e.getAttribute("data-column");
      return this.isIdentifier(i) ? y`
                <div class="identifier" data-column=${i} data-identifier="${o[i]}" @click="${this.gotoIdentifier}">
                    ${o[i]}
                </div>` : y`
                <div>
                    ${o[i]}
                </div>`;
    }, m("vaadin-grid", _`
      :host [part~="header-cell"] ::slotted(vaadin-grid-cell-content), [part~="footer-cell"] ::slotted(vaadin-grid-cell-content), [part~="reorder-ghost"] {
        font-weight: bold
      }
    `);
  }
  firstUpdated(o) {
    super.firstUpdated(o);
  }
  apiLookupProvider(o, t, e, i) {
    this.apiContext.fetchFromApi("", "lookup", {
      method: "POST",
      caller: "structuredKioskQuery.apiLookupProvider",
      body: JSON.stringify(t)
    }).then((r) => {
      "result_msg" in r && r.result_msg !== "ok" ? i([], 0) : i(r.records, r.record_count);
    }).catch((r) => {
      Qi(this, r, "structuredKioskQuery.apiLookupProvider", null), i([], 0);
    });
  }
  async fetchQueryResults(o) {
    const t = {
      query_id: this.queryDefinition.id,
      inputs: this._inputData
    }, e = new URLSearchParams();
    e.append("page_size", o.pageSize.toString()), e.append("page", o.page.toString());
    try {
      const i = await this.apiContext.fetchFromApi(
        "",
        "kioskquery",
        {
          method: "POST",
          caller: "structuredKioskQuery.fetchQueryResults",
          body: JSON.stringify(t)
        },
        "v1",
        e
      );
      return "result_msg" in i && i.result_msg !== "ok" ? [null, 0] : (this.data = i, [i.records, this.data.overall_record_count]);
    } catch (i) {
      return Qi(this, i, "structuredKioskQuery.fetchQueryResults", null), [[], 0];
    }
  }
  updated(o) {
    super.updated(o);
    const t = this.renderRoot.querySelector("#ui");
    t.lookupProvider = this.apiLookupProvider.bind(this), t.uiSchema = this.uiSchema;
  }
  getQueryUiSchema(o) {
    this.uiSchema = {
      header: { version: 1 },
      dsd: this.queryDefinition.ui.dsd,
      layout_settings: {
        orchestration_strategy: "stack"
      },
      meta: {
        scenario: "query-ui"
      },
      ui_elements: {
        query_fields: {
          element_type: {
            name: "layout",
            layout_settings: {
              orchestration_strategy: "stack"
            },
            ui_elements: o
          }
        },
        query_ui_controls: {
          element_type: {
            name: "layout",
            layout_settings: {
              orchestration_strategy: "stack"
            },
            ui_elements: {
              line: {
                element_type: {
                  name: "line"
                }
              },
              buttons: {
                element_type: {
                  name: "layout",
                  layout_settings: {
                    orchestration_strategy: "rightalign"
                  },
                  ui_elements: {
                    start: {
                      element_type: {
                        name: "button",
                        type: "iconButton",
                        icon: "",
                        extra_style: "padding: 2px 2px 0px 0px"
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
    };
  }
  willUpdate(o) {
    o.has("queryDefinition") && this.queryDefinition && this.getQueryUiSchema(this.queryDefinition.ui.ui_elements);
  }
  queryUIChanged(o) {
    var t;
    o.detail.srcElement === "start" && (this.overall_record_count = -1, this._inputData = o.detail.newData, (t = this.grid) == null || t.clearCache());
  }
  isIdentifier(o) {
    const t = this.data.document_information.columns[o];
    return "identifier" in t && t.identifier;
  }
  getColumnLabel(o) {
    const t = this.data.document_information.columns[o];
    return "label" in t ? t.label : o;
  }
  gotoIdentifier(o) {
    const t = o.currentTarget, e = t.getAttribute("data-identifier"), i = t.getAttribute("data-column"), r = this.data.document_information.columns[i], s = r.table, n = r.field, a = new CustomEvent(
      "identifierClicked",
      {
        detail: {
          dsdName: n,
          tableName: s,
          identifier: e
        },
        bubbles: !0
      }
    );
    this.dispatchEvent(a);
  }
  headerRenderer(o) {
    return y`<div>${this.getColumnLabel(o.getAttribute("data-column"))}</div>`;
  }
  renderQueryResult() {
    return y`
        <vaadin-grid id="grid" .dataProvider="${this.dataProvider}" theme="no-border">
            ${this.data ? this.data.document_information.column_order.map(
      (o) => y`
                    <vaadin-grid-column 
                                        data-column="${o}"
                                        ${Lu(this.headerRenderer, [])}
                                        ${Nu(this.cellRenderer, [])}></vaadin-grid-column>
                `
    ) : y`<vaadin-grid-column></vaadin-grid-column>`}
            
        </vaadin-grid>`;
  }
  apiRender() {
    return y`
            <div class="kiosk-query-ui">
                <ui-component id="ui" @dataChanged="${this.queryUIChanged}"></ui-component>
            </div>
            <div class="kiosk-query-results">
                ${this._inputData ? this.renderQueryResult() : b}
                ${!this._inputData || this.overall_record_count != 0 ? b : y`
                    <div class="no-records"><div><i></i>Sorry, your query yielded no results.</div></div>`}
            </div>
        `;
  }
};
q.styles = We(hl);
q.properties = {
  ...qu(q, q, "properties")
};
je([
  C()
], q.prototype, "queryDefinition", 2);
je([
  R()
], q.prototype, "uiSchema", 2);
je([
  R()
], q.prototype, "_inputData", 2);
je([
  ke("#grid")
], q.prototype, "grid", 2);
je([
  R()
], q.prototype, "data", 2);
q = je([
  ee("structured-kiosk-query")
], q);
class ct {
  static getTypeIcon(t) {
    switch (t.toLowerCase()) {
      case "structuredkioskquery":
        return "";
      default:
        return "";
    }
  }
  static getKioskQueryTag(t) {
    switch (t.toLowerCase()) {
      case "structuredkioskquery":
        return this.tagKioskStructuredQuery;
      default:
        return null;
    }
  }
}
ct.tagKioskStructuredQuery = Ki`structured-kiosk-query`;
const Wu = "query-ui";
var Gu = Object.defineProperty, ju = Object.getOwnPropertyDescriptor, Yu = Object.getPrototypeOf, Ku = Reflect.get, gi = (o, t, e, i) => {
  for (var r = i > 1 ? void 0 : i ? ju(t, e) : t, s = o.length - 1, n; s >= 0; s--)
    (n = o[s]) && (r = (i ? n(t, e, r) : n(r)) || r);
  return i && r && Gu(t, e, r), r;
}, Qu = (o, t, e) => Ku(Yu(o), e, t);
let J = class extends wt {
  constructor() {
    super(...arguments), this.showLocalProgress = !1, this.loadingMessage = "", this.kioskQueries = [];
  }
  firstUpdated(o) {
    super.firstUpdated(o);
  }
  updated(o) {
    super.updated(o), o.has("apiContext") && this.apiContext && this.loadQueries();
  }
  loadQueries() {
    this.loadingMessage = "loading queries ...", this.showLocalProgress = !0;
    const o = new URLSearchParams();
    o.append("uic_literal", Wu), this.apiContext.fetchFromApi(
      "",
      "kioskquery",
      {
        method: "GET",
        caller: "kioskqueryselector.loadQueries"
      },
      "v1",
      o
    ).then((t) => {
      "result_msg" in t && t.result_msg !== "ok" || this.showQueries(t);
    }).catch((t) => {
      Qi(this, t, "kioskqueryselector.loadQueries", null);
    });
  }
  showQueries(o) {
    this.showLocalProgress = !1, o.forEach((t) => {
    }), this.kioskQueries = o;
  }
  overlayClicked() {
    this.tryClose();
  }
  connectedCallback() {
    super.connectedCallback();
  }
  tryClose(o = null) {
    const t = new CustomEvent("closeSelection", o ? {
      detail: o
    } : { detail: null });
    this.dispatchEvent(t);
  }
  selectQuery(o) {
    if (!(o.currentTarget instanceof HTMLDivElement))
      return;
    const t = o.currentTarget;
    let e = this.kioskQueries.find((i) => i.id === t.id);
    this.tryClose(e);
  }
  renderQueryItem(o) {
    return y`
            <div id="${o.id}" class="kiosk-query" @click="${this.selectQuery}">
                <i class="fas">${ct.getTypeIcon(o.type)}</i>
                <div class="kiosk-query-text">
                    <div>${o.name}</div>
                    <div>${o.description}</div>
                </div>
            </div>
        `;
  }
  apiRender() {
    return y`
            <div class="query-selector-overlay" @click=${this.overlayClicked}></div>
            <div class="query-selector">
                ${this.showLocalProgress ? this.renderProgress(!0) : y`
                          <div class="kiosk-query-selector-title-bar" @click="${this.overlayClicked}">
                              <i class="fas fa-xmark"></i>
                          </div>
                          <div class="kiosk-query-selector-headline">
                              <i class="fas fa-query"></i>
                              <h3>Choose your way to search and query</h3>
                          </div>
                      `}
                <div id="kiosk-query-list">${this.kioskQueries.map((o) => this.renderQueryItem(o))}</div>
            </div>
        `;
  }
  renderProgress(o = !1) {
    let t = super.renderProgress(o);
    return t ? y`${t}
                  <div class="loading-message">${this.loadingMessage}</div>` : y``;
  }
};
J.styles = We(nl);
J.properties = {
  ...Qu(J, J, "properties")
};
gi([
  R()
], J.prototype, "showLocalProgress", 2);
gi([
  R()
], J.prototype, "loadingMessage", 2);
gi([
  R()
], J.prototype, "kioskQueries", 2);
J = gi([
  ee("kiosk-query-selector")
], J);
var Ma = Object.defineProperty, Zu = Object.getOwnPropertyDescriptor, Hs = Object.getOwnPropertySymbols, Xu = Object.prototype.hasOwnProperty, Ju = Object.prototype.propertyIsEnumerable, Vs = (o, t, e) => t in o ? Ma(o, t, { enumerable: !0, configurable: !0, writable: !0, value: e }) : o[t] = e, ep = (o, t) => {
  for (var e in t || (t = {}))
    Xu.call(t, e) && Vs(o, e, t[e]);
  if (Hs)
    for (var e of Hs(t))
      Ju.call(t, e) && Vs(o, e, t[e]);
  return o;
}, g = (o, t, e, i) => {
  for (var r = i > 1 ? void 0 : i ? Zu(t, e) : t, s = o.length - 1, n; s >= 0; s--)
    (n = o[s]) && (r = (i ? n(t, e, r) : n(r)) || r);
  return i && r && Ma(t, e, r), r;
};
let gr = "";
function br(o) {
  gr = o;
}
function tp(o = "") {
  if (!gr) {
    const t = [...document.getElementsByTagName("script")], e = t.find((i) => i.hasAttribute("data-shoelace"));
    if (e)
      br(e.getAttribute("data-shoelace"));
    else {
      const i = t.find((s) => /shoelace(\.min)?\.js($|\?)/.test(s.src) || /shoelace-autoloader(\.min)?\.js($|\?)/.test(s.src));
      let r = "";
      i && (r = i.getAttribute("src")), br(r.split("/").slice(0, -1).join("/"));
    }
  }
  return gr.replace(/\/$/, "") + (o ? `/${o.replace(/^\//, "")}` : "");
}
const ip = `.col-bg-body-lighter{background-color:var(--col-bg-body-lighter)}.col-bg-body{background-color:var(--col-bg-body)}.col-bg-body-darker{background-color:var(--col-bg-body-darker)}.col-bg-1-lighter{background-color:var(--col-bg-1-lighter)}.col-bg-1{background-color:var(--col-bg-1)}.col-bg-1-darker{background-color:var(--col-bg-1-darker)}.col-bg-1-input{background-color:var(--col-bg-1-input)}.col-primary-bg-1{background-color:var(--col-primary-bg-1)}.col-accent-bg-1{background-color:var(--col-accent-bg-1)}.col-success-bg-1{background-color:var(--col-success-bg-1)}.col-warning-bg-1{background-color:var(--col-warning-bg-1)}.col-error-bg-1{background-color:var(--col-error-bg-1)}.col-bg-2-lighter{background-color:var(--col-bg-2-lighter)}.col-bg-2{background-color:var(--col-bg-2)}.col-bg-2-darker{background-color:var(--col-bg-2-darker)}.col-bg-2-button{background-color:var(--col-bg-2-button)}.col-bg-2-input{background-color:var(--col-bg-2-input)}.col-primary-bg-2{background-color:var(--col-primary-bg-2)}.col-accent-bg-2{background-color:var(--col-accent-bg-2)}.col-success-bg-2{background-color:var(--col-success-bg-2)}.col-warning-bg-2{background-color:var(--col-warning-bg-2)}.col-error-bg-2{background-color:var(--col-error-bg-2)}.col-bg-3-lighter{background-color:var(--col-bg-3-lighter)}.col-bg-3{background-color:var(--col-bg-3)}.col-bg-3-darker{background-color:var(--col-bg-3-darker)}.col-bg-3-button{background-color:var(--col-bg-3-button)}.col-bg-3-input{background-color:var(--col-bg-3-input)}.col-primary-bg-3{background-color:var(--col-primary-bg-3)}.col-accent-bg-3{background-color:var(--col-accent-bg-3)}.col-success-bg-3{background-color:var(--col-success-bg-3)}.col-warning-bg-3{background-color:var(--col-warning-bg-3)}.col-error-bg-3{background-color:var(--col-error-bg-3)}.col-bg-ack-lighter{background-color:var(--col-bg-ack-lighter)}.col-bg-ack{background-color:var(--col-bg-ack)}.col-bg-ack-darker{background-color:var(--col-bg-ack-darker)}.col-primary-bg-ack{background-color:var(--col-primary-bg-ack)}.col-accent-bg-ack{background-color:var(--col-accent-bg-ack)}.col-bg-att-lighter{background-color:var(--col-bg-att-lighter)}.col-bg-att{background-color:var(--col-bg-att)}.col-bg-att-darker{background-color:var(--col-bg-att-darker)}.col-primary-bg-att{background-color:var(--col-primary-bg-att)}.col-accent-bg-att{background-color:var(--col-accent-bg-att)}.col-bg-alert-lighter{background-color:var(--col-bg-alert-lighter)}.col-bg-alert{background-color:var(--col-bg-alert)}.col-bg-alert-darker{background-color:var(--col-bg-alert-darker)}.col-primary-bg-alert{background-color:var(--col-primary-bg-alert)}.col-accent-bg-alert{background-color:var(--col-accent-bg-alert)}.col-bg-btn-lighter{background-color:var(--col-bg-btn-lighter)}.col-bg-btn{background-color:var(--col-bg-btn)}.col-bg-btn-darker{background-color:var(--col-bg-btn-darker)}.col-primary-bg-btn{background-color:var(--col-primary-bg-btn)}.col-accent-bg-btn{background-color:var(--col-accent-bg-btn)}.pattern-diagonal-stripes-sm{background:repeating-linear-gradient(45deg,transparent,transparent 10px,currentColor 10px,currentColor 20px)}.pattern-dots-lg{background-image:radial-gradient(currentColor 1.5px,transparent 1.5px);background-size:15px 15px}.pattern-dots-md{background-image:radial-gradient(currentColor 1px,transparent 1px);background-size:8px 8px}.pattern-dots-medium-dense{background-image:radial-gradient(currentColor .5px,transparent .5px);background-size:3px 3px}.pattern-dots-sm{background-image:radial-gradient(currentColor .5px,transparent .5px);background-size:5px 5px}.pattern-cross-dots-md,.imagelist-background{background-image:radial-gradient(currentColor .7px,transparent 1px),radial-gradient(currentColor .7px,transparent 1px);background-size:6.5px 6.5px;background-position:0 0,3.5px 3.5px}.imagelist-background{background-color:#fff9;background-blend-mode:overlay}p,div{padding:0;margin:0;border:0px;user-select:text}select{user-select:none}.fa,.fas{font-family:"Font Awesome 6 Free";font-weight:900;font-style:normal}.fa-trash:before{content:""}.fa-view-grid:before{content:""}.fa-reload:before{content:""}.fa-view-list:before{content:""}.fa-camera:before{content:""}.fa-view-image:before{content:""}.fa-check:before{content:""}.fa-bug:before{content:""}.fa-lightbulb:before{content:""}.fa-query:before{content:""}:host{display:block;width:100%}div,p{font-family:var(--standard-text-font)}.center-div{display:flex;flex-direction:column;align-items:center;background:var(--col-bg-body)}.wait-for-login{display:grid;place-items:center;height:100vh;background-color:var(--col-bg-body)}.wait-for-login p{font-family:var(--headline-text-font);font-size:var(--font-size-h2)}.logged-in-message{background-color:var(--col-bg-ack);color:var(--col-primary-bg-ack);display:grid;place-items:center;font-family:var(--standard-text-font)}.development{background-color:#8b0000;color:#fff;font-family:Courier New,sans-serif;font-size:18px;text-align:center}.toolbar{height:3em;background:var(--col-bg-3);display:flex;flex-direction:row;justify-content:space-between;padding:0}.toolbar-section,#toolbar-buttons,#toolbar-left{height:100%;display:flex;flex-direction:row;align-items:center;padding-left:1em}#toolbar-left{flex-grow:1;border-right:1px solid var(--col-bg-body)}#toolbar-buttons{background-color:var(--col-bg-3-darker)}.toolbar-button{color:var(--col-primary-bg-3);height:28px;border:None}.toolbar-button i{font-size:28px;line-height:100%}.toolbar-button:hover{color:var(--col-accent-bg-3)}.toolbar-button:active{color:var(--col-bg-ack)}.toolbar-button.disabled{opacity:.3}
`;
let rp = (o = 21) => crypto.getRandomValues(new Uint8Array(o)).reduce((t, e) => (e &= 63, e < 36 ? t += e.toString(36) : e < 62 ? t += (e - 26).toString(36).toUpperCase() : e > 62 ? t += "-" : t += "_", t), "");
const op = `.col-bg-body-lighter{background-color:var(--col-bg-body-lighter)}.col-bg-body{background-color:var(--col-bg-body)}.col-bg-body-darker{background-color:var(--col-bg-body-darker)}.col-bg-1-lighter{background-color:var(--col-bg-1-lighter)}.col-bg-1{background-color:var(--col-bg-1)}.col-bg-1-darker{background-color:var(--col-bg-1-darker)}.col-bg-1-input{background-color:var(--col-bg-1-input)}.col-primary-bg-1{background-color:var(--col-primary-bg-1)}.col-accent-bg-1{background-color:var(--col-accent-bg-1)}.col-success-bg-1{background-color:var(--col-success-bg-1)}.col-warning-bg-1{background-color:var(--col-warning-bg-1)}.col-error-bg-1{background-color:var(--col-error-bg-1)}.col-bg-2-lighter{background-color:var(--col-bg-2-lighter)}.col-bg-2{background-color:var(--col-bg-2)}.col-bg-2-darker{background-color:var(--col-bg-2-darker)}.col-bg-2-button{background-color:var(--col-bg-2-button)}.col-bg-2-input{background-color:var(--col-bg-2-input)}.col-primary-bg-2{background-color:var(--col-primary-bg-2)}.col-accent-bg-2{background-color:var(--col-accent-bg-2)}.col-success-bg-2{background-color:var(--col-success-bg-2)}.col-warning-bg-2{background-color:var(--col-warning-bg-2)}.col-error-bg-2{background-color:var(--col-error-bg-2)}.col-bg-3-lighter{background-color:var(--col-bg-3-lighter)}.col-bg-3{background-color:var(--col-bg-3)}.col-bg-3-darker{background-color:var(--col-bg-3-darker)}.col-bg-3-button{background-color:var(--col-bg-3-button)}.col-bg-3-input{background-color:var(--col-bg-3-input)}.col-primary-bg-3{background-color:var(--col-primary-bg-3)}.col-accent-bg-3{background-color:var(--col-accent-bg-3)}.col-success-bg-3{background-color:var(--col-success-bg-3)}.col-warning-bg-3{background-color:var(--col-warning-bg-3)}.col-error-bg-3{background-color:var(--col-error-bg-3)}.col-bg-ack-lighter{background-color:var(--col-bg-ack-lighter)}.col-bg-ack{background-color:var(--col-bg-ack)}.col-bg-ack-darker{background-color:var(--col-bg-ack-darker)}.col-primary-bg-ack{background-color:var(--col-primary-bg-ack)}.col-accent-bg-ack{background-color:var(--col-accent-bg-ack)}.col-bg-att-lighter{background-color:var(--col-bg-att-lighter)}.col-bg-att{background-color:var(--col-bg-att)}.col-bg-att-darker{background-color:var(--col-bg-att-darker)}.col-primary-bg-att{background-color:var(--col-primary-bg-att)}.col-accent-bg-att{background-color:var(--col-accent-bg-att)}.col-bg-alert-lighter{background-color:var(--col-bg-alert-lighter)}.col-bg-alert{background-color:var(--col-bg-alert)}.col-bg-alert-darker{background-color:var(--col-bg-alert-darker)}.col-primary-bg-alert{background-color:var(--col-primary-bg-alert)}.col-accent-bg-alert{background-color:var(--col-accent-bg-alert)}.col-bg-btn-lighter{background-color:var(--col-bg-btn-lighter)}.col-bg-btn{background-color:var(--col-bg-btn)}.col-bg-btn-darker{background-color:var(--col-bg-btn-darker)}.col-primary-bg-btn{background-color:var(--col-primary-bg-btn)}.col-accent-bg-btn{background-color:var(--col-accent-bg-btn)}.pattern-diagonal-stripes-sm{background:repeating-linear-gradient(45deg,transparent,transparent 10px,currentColor 10px,currentColor 20px)}.pattern-dots-lg{background-image:radial-gradient(currentColor 1.5px,transparent 1.5px);background-size:15px 15px}.pattern-dots-md{background-image:radial-gradient(currentColor 1px,transparent 1px);background-size:8px 8px}.pattern-dots-medium-dense{background-image:radial-gradient(currentColor .5px,transparent .5px);background-size:3px 3px}.pattern-dots-sm{background-image:radial-gradient(currentColor .5px,transparent .5px);background-size:5px 5px}.pattern-cross-dots-md,.imagelist-background{background-image:radial-gradient(currentColor .7px,transparent 1px),radial-gradient(currentColor .7px,transparent 1px);background-size:6.5px 6.5px;background-position:0 0,3.5px 3.5px}.imagelist-background{background-color:#fff9;background-blend-mode:overlay}*{box-sizing:border-box}.loading{display:flex;justify-content:center;align-content:center;height:5px;background-color:#000;width:100%}.loading-progress{height:5px;width:100%;border-radius:3px;background:linear-gradient(90deg,red 0%,yellow 15%,lime 30%,cyan 50%,blue 65%,magenta 80%,red 100%);background-size:200%;animation:move-gradient 2s ease-in infinite}.loading-message{font-family:var(--monospace-font);text-align:center;width:100%;color:var(--col-accent-bg-1);padding:1em}@keyframes move-gradient{0%{background-position:0 0}to{background-position:-200% 0%}}p,div{padding:0;margin:0;border:0px;user-select:text}select{user-select:none}.fa,.fas{font-family:"Font Awesome 6 Free";font-weight:900;font-style:normal}.fa-trash:before{content:""}.fa-view-grid:before{content:""}.fa-reload:before{content:""}.fa-view-list:before{content:""}.fa-camera:before{content:""}.fa-view-image:before{content:""}.fa-check:before{content:""}.fa-bug:before{content:""}.fa-lightbulb:before{content:""}.fa-query:before{content:""}:host *{user-select:none}.kiosk-query-layouter{background-color:var(--col-bg-1)}sl-tab-group{--sl-color-neutral-600: var(--col-primary-bg-1);--sl-color-primary-600: var(--col-accent-bg-1);--indicator-color: var(--col-success-bg-1);--track-color: var(--col-bg-1-darker)}sl-tab-panel{padding:.5em 1em}
`;
/**
 * @license
 * Copyright 2018 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const bi = eo(class extends Oa {
  constructor(o) {
    var t;
    if (super(o), o.type !== Jr.ATTRIBUTE || o.name !== "class" || ((t = o.strings) === null || t === void 0 ? void 0 : t.length) > 2)
      throw Error("`classMap()` can only be used in the `class` attribute and must be the only part in the attribute.");
  }
  render(o) {
    return " " + Object.keys(o).filter((t) => o[t]).join(" ") + " ";
  }
  update(o, [t]) {
    var e, i;
    if (this.it === void 0) {
      this.it = /* @__PURE__ */ new Set(), o.strings !== void 0 && (this.nt = new Set(o.strings.join(" ").split(/\s/).filter((s) => s !== "")));
      for (const s in t)
        t[s] && !(!((e = this.nt) === null || e === void 0) && e.has(s)) && this.it.add(s);
      return this.render(t);
    }
    const r = o.element.classList;
    this.it.forEach((s) => {
      s in t || (r.remove(s), this.it.delete(s));
    });
    for (const s in t) {
      const n = !!t[s];
      n === this.it.has(s) || !((i = this.nt) === null || i === void 0) && i.has(s) || (n ? (r.add(s), this.it.add(s)) : (r.remove(s), this.it.delete(s)));
    }
    return we;
  }
});
function Se(o, t) {
  const e = Object.assign({ waitUntilFirstUpdate: !1 }, t);
  return (i, r) => {
    const { update: s } = i, n = Array.isArray(o) ? o : [o];
    i.update = function(a) {
      n.forEach((l) => {
        const d = l;
        if (a.has(d)) {
          const c = a.get(d), h = this[d];
          c !== h && (!e.waitUntilFirstUpdate || this.hasUpdated) && this[r](c, h);
        }
      }), s.call(this, a);
    };
  };
}
var Ra = globalThis && globalThis.__decorate || function(o, t, e, i) {
  var r = arguments.length, s = r < 3 ? t : i === null ? i = Object.getOwnPropertyDescriptor(t, e) : i, n;
  if (typeof Reflect == "object" && typeof Reflect.decorate == "function")
    s = Reflect.decorate(o, t, e, i);
  else
    for (var a = o.length - 1; a >= 0; a--)
      (n = o[a]) && (s = (r < 3 ? n(s) : r > 3 ? n(t, e, s) : n(t, e)) || s);
  return r > 3 && s && Object.defineProperty(t, e, s), s;
};
class Ie extends ne {
  emit(t, e) {
    const i = new CustomEvent(t, Object.assign({ bubbles: !0, cancelable: !1, composed: !0, detail: {} }, e));
    return this.dispatchEvent(i), i;
  }
}
Ra([
  C()
], Ie.prototype, "dir", void 0);
Ra([
  C()
], Ie.prototype, "lang", void 0);
const Ot = _`
  :host {
    box-sizing: border-box;
  }

  :host *,
  :host *::before,
  :host *::after {
    box-sizing: inherit;
  }

  [hidden] {
    display: none !important;
  }
`;
var sp = _`
  ${Ot}

  :host {
    --padding: 0;

    display: none;
  }

  :host([active]) {
    display: block;
  }

  .tab-panel {
    display: block;
    padding: var(--padding);
  }
`;
let np = 0, qe = class extends Ie {
  constructor() {
    super(...arguments), this.attrId = ++np, this.componentId = `sl-tab-panel-${this.attrId}`, this.name = "", this.active = !1;
  }
  connectedCallback() {
    super.connectedCallback(), this.id = this.id.length > 0 ? this.id : this.componentId, this.setAttribute("role", "tabpanel");
  }
  handleActiveChange() {
    this.setAttribute("aria-hidden", this.active ? "false" : "true");
  }
  render() {
    return y`
      <slot
        part="base"
        class=${bi({
      "tab-panel": !0,
      "tab-panel--active": this.active
    })}
      ></slot>
    `;
  }
};
qe.styles = sp;
g([
  C({ reflect: !0 })
], qe.prototype, "name", 2);
g([
  C({ type: Boolean, reflect: !0 })
], qe.prototype, "active", 2);
g([
  Se("active")
], qe.prototype, "handleActiveChange", 1);
qe = g([
  ee("sl-tab-panel")
], qe);
const ap = {
  name: "default",
  resolver: (o) => tp(`assets/icons/${o}.svg`)
};
var lp = ap;
const Us = {
  caret: `
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <polyline points="6 9 12 15 18 9"></polyline>
    </svg>
  `,
  check: `
    <svg part="checked-icon" class="checkbox__icon" viewBox="0 0 16 16">
      <g stroke="none" stroke-width="1" fill="none" fill-rule="evenodd" stroke-linecap="round">
        <g stroke="currentColor" stroke-width="2">
          <g transform="translate(3.428571, 3.428571)">
            <path d="M0,5.71428571 L3.42857143,9.14285714"></path>
            <path d="M9.14285714,0 L3.42857143,9.14285714"></path>
          </g>
        </g>
      </g>
    </svg>
  `,
  "chevron-down": `
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-chevron-down" viewBox="0 0 16 16">
      <path fill-rule="evenodd" d="M1.646 4.646a.5.5 0 0 1 .708 0L8 10.293l5.646-5.647a.5.5 0 0 1 .708.708l-6 6a.5.5 0 0 1-.708 0l-6-6a.5.5 0 0 1 0-.708z"/>
    </svg>
  `,
  "chevron-left": `
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-chevron-left" viewBox="0 0 16 16">
      <path fill-rule="evenodd" d="M11.354 1.646a.5.5 0 0 1 0 .708L5.707 8l5.647 5.646a.5.5 0 0 1-.708.708l-6-6a.5.5 0 0 1 0-.708l6-6a.5.5 0 0 1 .708 0z"/>
    </svg>
  `,
  "chevron-right": `
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-chevron-right" viewBox="0 0 16 16">
      <path fill-rule="evenodd" d="M4.646 1.646a.5.5 0 0 1 .708 0l6 6a.5.5 0 0 1 0 .708l-6 6a.5.5 0 0 1-.708-.708L10.293 8 4.646 2.354a.5.5 0 0 1 0-.708z"/>
    </svg>
  `,
  eye: `
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-eye" viewBox="0 0 16 16">
      <path d="M16 8s-3-5.5-8-5.5S0 8 0 8s3 5.5 8 5.5S16 8 16 8zM1.173 8a13.133 13.133 0 0 1 1.66-2.043C4.12 4.668 5.88 3.5 8 3.5c2.12 0 3.879 1.168 5.168 2.457A13.133 13.133 0 0 1 14.828 8c-.058.087-.122.183-.195.288-.335.48-.83 1.12-1.465 1.755C11.879 11.332 10.119 12.5 8 12.5c-2.12 0-3.879-1.168-5.168-2.457A13.134 13.134 0 0 1 1.172 8z"/>
      <path d="M8 5.5a2.5 2.5 0 1 0 0 5 2.5 2.5 0 0 0 0-5zM4.5 8a3.5 3.5 0 1 1 7 0 3.5 3.5 0 0 1-7 0z"/>
    </svg>
  `,
  "eye-slash": `
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-eye-slash" viewBox="0 0 16 16">
      <path d="M13.359 11.238C15.06 9.72 16 8 16 8s-3-5.5-8-5.5a7.028 7.028 0 0 0-2.79.588l.77.771A5.944 5.944 0 0 1 8 3.5c2.12 0 3.879 1.168 5.168 2.457A13.134 13.134 0 0 1 14.828 8c-.058.087-.122.183-.195.288-.335.48-.83 1.12-1.465 1.755-.165.165-.337.328-.517.486l.708.709z"/>
      <path d="M11.297 9.176a3.5 3.5 0 0 0-4.474-4.474l.823.823a2.5 2.5 0 0 1 2.829 2.829l.822.822zm-2.943 1.299.822.822a3.5 3.5 0 0 1-4.474-4.474l.823.823a2.5 2.5 0 0 0 2.829 2.829z"/>
      <path d="M3.35 5.47c-.18.16-.353.322-.518.487A13.134 13.134 0 0 0 1.172 8l.195.288c.335.48.83 1.12 1.465 1.755C4.121 11.332 5.881 12.5 8 12.5c.716 0 1.39-.133 2.02-.36l.77.772A7.029 7.029 0 0 1 8 13.5C3 13.5 0 8 0 8s.939-1.721 2.641-3.238l.708.709zm10.296 8.884-12-12 .708-.708 12 12-.708.708z"/>
    </svg>
  `,
  eyedropper: `
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-eyedropper" viewBox="0 0 16 16">
      <path d="M13.354.646a1.207 1.207 0 0 0-1.708 0L8.5 3.793l-.646-.647a.5.5 0 1 0-.708.708L8.293 5l-7.147 7.146A.5.5 0 0 0 1 12.5v1.793l-.854.853a.5.5 0 1 0 .708.707L1.707 15H3.5a.5.5 0 0 0 .354-.146L11 7.707l1.146 1.147a.5.5 0 0 0 .708-.708l-.647-.646 3.147-3.146a1.207 1.207 0 0 0 0-1.708l-2-2zM2 12.707l7-7L10.293 7l-7 7H2v-1.293z"></path>
    </svg>
  `,
  "grip-vertical": `
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-grip-vertical" viewBox="0 0 16 16">
      <path d="M7 2a1 1 0 1 1-2 0 1 1 0 0 1 2 0zm3 0a1 1 0 1 1-2 0 1 1 0 0 1 2 0zM7 5a1 1 0 1 1-2 0 1 1 0 0 1 2 0zm3 0a1 1 0 1 1-2 0 1 1 0 0 1 2 0zM7 8a1 1 0 1 1-2 0 1 1 0 0 1 2 0zm3 0a1 1 0 1 1-2 0 1 1 0 0 1 2 0zm-3 3a1 1 0 1 1-2 0 1 1 0 0 1 2 0zm3 0a1 1 0 1 1-2 0 1 1 0 0 1 2 0zm-3 3a1 1 0 1 1-2 0 1 1 0 0 1 2 0zm3 0a1 1 0 1 1-2 0 1 1 0 0 1 2 0z"></path>
    </svg>
  `,
  indeterminate: `
    <svg part="indeterminate-icon" class="checkbox__icon" viewBox="0 0 16 16">
      <g stroke="none" stroke-width="1" fill="none" fill-rule="evenodd" stroke-linecap="round">
        <g stroke="currentColor" stroke-width="2">
          <g transform="translate(2.285714, 6.857143)">
            <path d="M10.2857143,1.14285714 L1.14285714,1.14285714"></path>
          </g>
        </g>
      </g>
    </svg>
  `,
  "person-fill": `
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-person-fill" viewBox="0 0 16 16">
      <path d="M3 14s-1 0-1-1 1-4 6-4 6 3 6 4-1 1-1 1H3zm5-6a3 3 0 1 0 0-6 3 3 0 0 0 0 6z"/>
    </svg>
  `,
  "play-fill": `
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-play-fill" viewBox="0 0 16 16">
      <path d="m11.596 8.697-6.363 3.692c-.54.313-1.233-.066-1.233-.697V4.308c0-.63.692-1.01 1.233-.696l6.363 3.692a.802.802 0 0 1 0 1.393z"></path>
    </svg>
  `,
  "pause-fill": `
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-pause-fill" viewBox="0 0 16 16">
      <path d="M5.5 3.5A1.5 1.5 0 0 1 7 5v6a1.5 1.5 0 0 1-3 0V5a1.5 1.5 0 0 1 1.5-1.5zm5 0A1.5 1.5 0 0 1 12 5v6a1.5 1.5 0 0 1-3 0V5a1.5 1.5 0 0 1 1.5-1.5z"></path>
    </svg>
  `,
  radio: `
    <svg part="checked-icon" class="radio__icon" viewBox="0 0 16 16">
      <g stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
        <g fill="currentColor">
          <circle cx="8" cy="8" r="3.42857143"></circle>
        </g>
      </g>
    </svg>
  `,
  "star-fill": `
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-star-fill" viewBox="0 0 16 16">
      <path d="M3.612 15.443c-.386.198-.824-.149-.746-.592l.83-4.73L.173 6.765c-.329-.314-.158-.888.283-.95l4.898-.696L7.538.792c.197-.39.73-.39.927 0l2.184 4.327 4.898.696c.441.062.612.636.282.95l-3.522 3.356.83 4.73c.078.443-.36.79-.746.592L8 13.187l-4.389 2.256z"/>
    </svg>
  `,
  "x-lg": `
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-x-lg" viewBox="0 0 16 16">
      <path d="M2.146 2.854a.5.5 0 1 1 .708-.708L8 7.293l5.146-5.147a.5.5 0 0 1 .708.708L8.707 8l5.147 5.146a.5.5 0 0 1-.708.708L8 8.707l-5.146 5.147a.5.5 0 0 1-.708-.708L7.293 8 2.146 2.854Z"/>
    </svg>
  `,
  "x-circle-fill": `
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-x-circle-fill" viewBox="0 0 16 16">
      <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zM5.354 4.646a.5.5 0 1 0-.708.708L7.293 8l-2.647 2.646a.5.5 0 0 0 .708.708L8 8.707l2.646 2.647a.5.5 0 0 0 .708-.708L8.707 8l2.647-2.646a.5.5 0 0 0-.708-.708L8 7.293 5.354 4.646z"></path>
    </svg>
  `
}, dp = {
  name: "system",
  resolver: (o) => o in Us ? `data:image/svg+xml,${encodeURIComponent(Us[o])}` : ""
};
var cp = dp;
let hp = [lp, cp], vr = [];
function up(o) {
  vr.push(o);
}
function pp(o) {
  vr = vr.filter((t) => t !== o);
}
function qs(o) {
  return hp.find((t) => t.name === o);
}
var _p = _`
  ${Ot}

  :host {
    display: inline-block;
    width: 1em;
    height: 1em;
    box-sizing: content-box !important;
  }

  svg {
    display: block;
    height: 100%;
    width: 100%;
  }
`;
const it = Symbol(), Ut = Symbol();
let Ui;
const qi = /* @__PURE__ */ new Map();
let G = class extends Ie {
  constructor() {
    super(...arguments), this.initialRender = !1, this.svg = null, this.label = "", this.library = "default";
  }
  /** Given a URL, this function returns the resulting SVG element or an appropriate error symbol. */
  async resolveIcon(o, t) {
    var e;
    let i;
    if (t != null && t.spriteSheet)
      return y`<svg part="svg">
        <use part="use" href="${o}"></use>
      </svg>`;
    try {
      if (i = await fetch(o, { mode: "cors" }), !i.ok)
        return i.status === 410 ? it : Ut;
    } catch {
      return Ut;
    }
    try {
      const r = document.createElement("div");
      r.innerHTML = await i.text();
      const s = r.firstElementChild;
      if (((e = s == null ? void 0 : s.tagName) == null ? void 0 : e.toLowerCase()) !== "svg")
        return it;
      Ui || (Ui = new DOMParser());
      const a = Ui.parseFromString(s.outerHTML, "text/html").body.querySelector("svg");
      return a ? (a.part.add("svg"), document.adoptNode(a)) : it;
    } catch {
      return it;
    }
  }
  connectedCallback() {
    super.connectedCallback(), up(this);
  }
  firstUpdated() {
    this.initialRender = !0, this.setIcon();
  }
  disconnectedCallback() {
    super.disconnectedCallback(), pp(this);
  }
  getUrl() {
    const o = qs(this.library);
    return this.name && o ? o.resolver(this.name) : this.src;
  }
  handleLabelChange() {
    typeof this.label == "string" && this.label.length > 0 ? (this.setAttribute("role", "img"), this.setAttribute("aria-label", this.label), this.removeAttribute("aria-hidden")) : (this.removeAttribute("role"), this.removeAttribute("aria-label"), this.setAttribute("aria-hidden", "true"));
  }
  async setIcon() {
    var o;
    const t = qs(this.library), e = this.getUrl();
    if (!e) {
      this.svg = null;
      return;
    }
    let i = qi.get(e);
    if (i || (i = this.resolveIcon(e, t), qi.set(e, i)), !this.initialRender)
      return;
    const r = await i;
    if (r === Ut && qi.delete(e), e === this.getUrl()) {
      if (Tu(r)) {
        this.svg = r;
        return;
      }
      switch (r) {
        case Ut:
        case it:
          this.svg = null, this.emit("sl-error");
          break;
        default:
          this.svg = r.cloneNode(!0), (o = t == null ? void 0 : t.mutator) == null || o.call(t, this.svg), this.emit("sl-load");
      }
    }
  }
  render() {
    return this.svg;
  }
};
G.styles = _p;
g([
  R()
], G.prototype, "svg", 2);
g([
  C({ reflect: !0 })
], G.prototype, "name", 2);
g([
  C()
], G.prototype, "src", 2);
g([
  C()
], G.prototype, "label", 2);
g([
  C({ reflect: !0 })
], G.prototype, "library", 2);
g([
  Se("label")
], G.prototype, "handleLabelChange", 1);
g([
  Se(["name", "src", "library"])
], G.prototype, "setIcon", 1);
G = g([
  ee("sl-icon")
], G);
/**
 * @license
 * Copyright 2018 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const W = (o) => o ?? b;
var fp = _`
  ${Ot}

  :host {
    display: inline-block;
    color: var(--sl-color-neutral-600);
  }

  .icon-button {
    flex: 0 0 auto;
    display: flex;
    align-items: center;
    background: none;
    border: none;
    border-radius: var(--sl-border-radius-medium);
    font-size: inherit;
    color: inherit;
    padding: var(--sl-spacing-x-small);
    cursor: pointer;
    transition: var(--sl-transition-x-fast) color;
    -webkit-appearance: none;
  }

  .icon-button:hover:not(.icon-button--disabled),
  .icon-button:focus-visible:not(.icon-button--disabled) {
    color: var(--sl-color-primary-600);
  }

  .icon-button:active:not(.icon-button--disabled) {
    color: var(--sl-color-primary-700);
  }

  .icon-button:focus {
    outline: none;
  }

  .icon-button--disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  .icon-button:focus-visible {
    outline: var(--sl-focus-ring);
    outline-offset: var(--sl-focus-ring-offset);
  }

  .icon-button__icon {
    pointer-events: none;
  }
`;
let B = class extends Ie {
  constructor() {
    super(...arguments), this.hasFocus = !1, this.label = "", this.disabled = !1;
  }
  handleBlur() {
    this.hasFocus = !1, this.emit("sl-blur");
  }
  handleFocus() {
    this.hasFocus = !0, this.emit("sl-focus");
  }
  handleClick(o) {
    this.disabled && (o.preventDefault(), o.stopPropagation());
  }
  /** Simulates a click on the icon button. */
  click() {
    this.button.click();
  }
  /** Sets focus on the icon button. */
  focus(o) {
    this.button.focus(o);
  }
  /** Removes focus from the icon button. */
  blur() {
    this.button.blur();
  }
  render() {
    const o = !!this.href, t = o ? Ki`a` : Ki`button`;
    return E`
      <${t}
        part="base"
        class=${bi({
      "icon-button": !0,
      "icon-button--disabled": !o && this.disabled,
      "icon-button--focused": this.hasFocus
    })}
        ?disabled=${W(o ? void 0 : this.disabled)}
        type=${W(o ? void 0 : "button")}
        href=${W(o ? this.href : void 0)}
        target=${W(o ? this.target : void 0)}
        download=${W(o ? this.download : void 0)}
        rel=${W(o && this.target ? "noreferrer noopener" : void 0)}
        role=${W(o ? void 0 : "button")}
        aria-disabled=${this.disabled ? "true" : "false"}
        aria-label="${this.label}"
        tabindex=${this.disabled ? "-1" : "0"}
        @blur=${this.handleBlur}
        @focus=${this.handleFocus}
        @click=${this.handleClick}
      >
        <sl-icon
          class="icon-button__icon"
          name=${W(this.name)}
          library=${W(this.library)}
          src=${W(this.src)}
          aria-hidden="true"
        ></sl-icon>
      </${t}>
    `;
  }
};
B.styles = fp;
g([
  ke(".icon-button")
], B.prototype, "button", 2);
g([
  R()
], B.prototype, "hasFocus", 2);
g([
  C()
], B.prototype, "name", 2);
g([
  C()
], B.prototype, "library", 2);
g([
  C()
], B.prototype, "src", 2);
g([
  C()
], B.prototype, "href", 2);
g([
  C()
], B.prototype, "target", 2);
g([
  C()
], B.prototype, "download", 2);
g([
  C()
], B.prototype, "label", 2);
g([
  C({ type: Boolean, reflect: !0 })
], B.prototype, "disabled", 2);
B = g([
  ee("sl-icon-button")
], B);
const yr = /* @__PURE__ */ new Set(), mp = new MutationObserver(La), $e = /* @__PURE__ */ new Map();
let Fa = document.documentElement.dir || "ltr", Na = document.documentElement.lang || navigator.language, ge;
mp.observe(document.documentElement, {
  attributes: !0,
  attributeFilter: ["dir", "lang"]
});
function gp(...o) {
  o.map((t) => {
    const e = t.$code.toLowerCase();
    $e.has(e) ? $e.set(e, Object.assign(Object.assign({}, $e.get(e)), t)) : $e.set(e, t), ge || (ge = t);
  }), La();
}
function La() {
  Fa = document.documentElement.dir || "ltr", Na = document.documentElement.lang || navigator.language, [...yr.keys()].map((o) => {
    typeof o.requestUpdate == "function" && o.requestUpdate();
  });
}
let bp = class {
  constructor(t) {
    this.host = t, this.host.addController(this);
  }
  hostConnected() {
    yr.add(this.host);
  }
  hostDisconnected() {
    yr.delete(this.host);
  }
  dir() {
    return `${this.host.dir || Fa}`.toLowerCase();
  }
  lang() {
    return `${this.host.lang || Na}`.toLowerCase();
  }
  getTranslationData(t) {
    var e, i;
    const r = new Intl.Locale(t), s = r == null ? void 0 : r.language.toLowerCase(), n = (i = (e = r == null ? void 0 : r.region) === null || e === void 0 ? void 0 : e.toLowerCase()) !== null && i !== void 0 ? i : "", a = $e.get(`${s}-${n}`), l = $e.get(s);
    return { locale: r, language: s, region: n, primary: a, secondary: l };
  }
  exists(t, e) {
    var i;
    const { primary: r, secondary: s } = this.getTranslationData((i = e.lang) !== null && i !== void 0 ? i : this.lang());
    return e = Object.assign({ includeFallback: !1 }, e), !!(r && r[t] || s && s[t] || e.includeFallback && ge && ge[t]);
  }
  term(t, ...e) {
    const { primary: i, secondary: r } = this.getTranslationData(this.lang());
    let s;
    if (i && i[t])
      s = i[t];
    else if (r && r[t])
      s = r[t];
    else if (ge && ge[t])
      s = ge[t];
    else
      return String(t);
    return typeof s == "function" ? s(...e) : s;
  }
  date(t, e) {
    return t = new Date(t), new Intl.DateTimeFormat(this.lang(), e).format(t);
  }
  number(t, e) {
    return t = Number(t), isNaN(t) ? "" : new Intl.NumberFormat(this.lang(), e).format(t);
  }
  relativeTime(t, e, i) {
    return new Intl.RelativeTimeFormat(this.lang(), i).format(t, e);
  }
};
const vp = {
  $code: "en",
  $name: "English",
  $dir: "ltr",
  carousel: "Carousel",
  clearEntry: "Clear entry",
  close: "Close",
  copy: "Copy",
  currentValue: "Current value",
  goToSlide: (o, t) => `Go to slide ${o} of ${t}`,
  hidePassword: "Hide password",
  loading: "Loading",
  nextSlide: "Next slide",
  numOptionsSelected: (o) => o === 0 ? "No options selected" : o === 1 ? "1 option selected" : `${o} options selected`,
  previousSlide: "Previous slide",
  progress: "Progress",
  remove: "Remove",
  resize: "Resize",
  scrollToEnd: "Scroll to end",
  scrollToStart: "Scroll to start",
  selectAColorFromTheScreen: "Select a color from the screen",
  showPassword: "Show password",
  slideNum: (o) => `Slide ${o}`,
  toggleColorFormat: "Toggle color format"
};
gp(vp);
class Ba extends bp {
}
var yp = _`
  ${Ot}

  :host {
    display: inline-block;
  }

  .tab {
    display: inline-flex;
    align-items: center;
    font-family: var(--sl-font-sans);
    font-size: var(--sl-font-size-small);
    font-weight: var(--sl-font-weight-semibold);
    border-radius: var(--sl-border-radius-medium);
    color: var(--sl-color-neutral-600);
    padding: var(--sl-spacing-medium) var(--sl-spacing-large);
    white-space: nowrap;
    user-select: none;
    cursor: pointer;
    transition: var(--transition-speed) box-shadow, var(--transition-speed) color;
  }

  .tab:hover:not(.tab--disabled) {
    color: var(--sl-color-primary-600);
  }

  .tab:focus {
    outline: none;
  }

  .tab:focus-visible:not(.tab--disabled) {
    color: var(--sl-color-primary-600);
  }

  .tab:focus-visible {
    outline: var(--sl-focus-ring);
    outline-offset: calc(-1 * var(--sl-focus-ring-width) - var(--sl-focus-ring-offset));
  }

  .tab.tab--active:not(.tab--disabled) {
    color: var(--sl-color-primary-600);
  }

  .tab.tab--closable {
    padding-inline-end: var(--sl-spacing-small);
  }

  .tab.tab--disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  .tab__close-button {
    font-size: var(--sl-font-size-small);
    margin-inline-start: var(--sl-spacing-small);
  }

  .tab__close-button::part(base) {
    padding: var(--sl-spacing-3x-small);
  }

  @media (forced-colors: active) {
    .tab.tab--active:not(.tab--disabled) {
      outline: solid 1px transparent;
      outline-offset: -3px;
    }
  }
`;
let Cp = 0, j = class extends Ie {
  constructor() {
    super(...arguments), this.localize = new Ba(this), this.attrId = ++Cp, this.componentId = `sl-tab-${this.attrId}`, this.panel = "", this.active = !1, this.closable = !1, this.disabled = !1;
  }
  connectedCallback() {
    super.connectedCallback(), this.setAttribute("role", "tab");
  }
  handleCloseClick(o) {
    o.stopPropagation(), this.emit("sl-close");
  }
  handleActiveChange() {
    this.setAttribute("aria-selected", this.active ? "true" : "false");
  }
  handleDisabledChange() {
    this.setAttribute("aria-disabled", this.disabled ? "true" : "false");
  }
  /** Sets focus to the tab. */
  focus(o) {
    this.tab.focus(o);
  }
  /** Removes focus from the tab. */
  blur() {
    this.tab.blur();
  }
  render() {
    return this.id = this.id.length > 0 ? this.id : this.componentId, y`
      <div
        part="base"
        class=${bi({
      tab: !0,
      "tab--active": this.active,
      "tab--closable": this.closable,
      "tab--disabled": this.disabled
    })}
        tabindex=${this.disabled ? "-1" : "0"}
      >
        <slot></slot>
        ${this.closable ? y`
              <sl-icon-button
                part="close-button"
                exportparts="base:close-button__base"
                name="x-lg"
                library="system"
                label=${this.localize.term("close")}
                class="tab__close-button"
                @click=${this.handleCloseClick}
                tabindex="-1"
              ></sl-icon-button>
            ` : ""}
      </div>
    `;
  }
};
j.styles = yp;
g([
  ke(".tab")
], j.prototype, "tab", 2);
g([
  C({ reflect: !0 })
], j.prototype, "panel", 2);
g([
  C({ type: Boolean, reflect: !0 })
], j.prototype, "active", 2);
g([
  C({ type: Boolean })
], j.prototype, "closable", 2);
g([
  C({ type: Boolean, reflect: !0 })
], j.prototype, "disabled", 2);
g([
  Se("active")
], j.prototype, "handleActiveChange", 1);
g([
  Se("disabled")
], j.prototype, "handleDisabledChange", 1);
j = g([
  ee("sl-tab")
], j);
function xp(o, t) {
  return {
    top: Math.round(o.getBoundingClientRect().top - t.getBoundingClientRect().top),
    left: Math.round(o.getBoundingClientRect().left - t.getBoundingClientRect().left)
  };
}
function Ws(o, t, e = "vertical", i = "smooth") {
  const r = xp(o, t), s = r.top + t.scrollTop, n = r.left + t.scrollLeft, a = t.scrollLeft, l = t.scrollLeft + t.offsetWidth, d = t.scrollTop, c = t.scrollTop + t.offsetHeight;
  (e === "horizontal" || e === "both") && (n < a ? t.scrollTo({ left: n, behavior: i }) : n + o.clientWidth > l && t.scrollTo({ left: n - t.offsetWidth + o.clientWidth, behavior: i })), (e === "vertical" || e === "both") && (s < d ? t.scrollTo({ top: s, behavior: i }) : s + o.clientHeight > c && t.scrollTo({ top: s - t.offsetHeight + o.clientHeight, behavior: i }));
}
var wp = _`
  ${Ot}

  :host {
    --indicator-color: var(--sl-color-primary-600);
    --track-color: var(--sl-color-neutral-200);
    --track-width: 2px;

    display: block;
  }

  .tab-group {
    display: flex;
    border-radius: 0;
  }

  .tab-group__tabs {
    display: flex;
    position: relative;
  }

  .tab-group__indicator {
    position: absolute;
    transition: var(--sl-transition-fast) translate ease, var(--sl-transition-fast) width ease;
  }

  .tab-group--has-scroll-controls .tab-group__nav-container {
    position: relative;
    padding: 0 var(--sl-spacing-x-large);
  }

  .tab-group__body {
    display: block;
    overflow: auto;
  }

  .tab-group__scroll-button {
    display: flex;
    align-items: center;
    justify-content: center;
    position: absolute;
    top: 0;
    bottom: 0;
    width: var(--sl-spacing-x-large);
  }

  .tab-group__scroll-button--start {
    left: 0;
  }

  .tab-group__scroll-button--end {
    right: 0;
  }

  .tab-group--rtl .tab-group__scroll-button--start {
    left: auto;
    right: 0;
  }

  .tab-group--rtl .tab-group__scroll-button--end {
    left: 0;
    right: auto;
  }

  /*
   * Top
   */

  .tab-group--top {
    flex-direction: column;
  }

  .tab-group--top .tab-group__nav-container {
    order: 1;
  }

  .tab-group--top .tab-group__nav {
    display: flex;
    overflow-x: auto;

    /* Hide scrollbar in Firefox */
    scrollbar-width: none;
  }

  /* Hide scrollbar in Chrome/Safari */
  .tab-group--top .tab-group__nav::-webkit-scrollbar {
    width: 0;
    height: 0;
  }

  .tab-group--top .tab-group__tabs {
    flex: 1 1 auto;
    position: relative;
    flex-direction: row;
    border-bottom: solid var(--track-width) var(--track-color);
  }

  .tab-group--top .tab-group__indicator {
    bottom: calc(-1 * var(--track-width));
    border-bottom: solid var(--track-width) var(--indicator-color);
  }

  .tab-group--top .tab-group__body {
    order: 2;
  }

  .tab-group--top ::slotted(sl-tab-panel) {
    --padding: var(--sl-spacing-medium) 0;
  }

  /*
   * Bottom
   */

  .tab-group--bottom {
    flex-direction: column;
  }

  .tab-group--bottom .tab-group__nav-container {
    order: 2;
  }

  .tab-group--bottom .tab-group__nav {
    display: flex;
    overflow-x: auto;

    /* Hide scrollbar in Firefox */
    scrollbar-width: none;
  }

  /* Hide scrollbar in Chrome/Safari */
  .tab-group--bottom .tab-group__nav::-webkit-scrollbar {
    width: 0;
    height: 0;
  }

  .tab-group--bottom .tab-group__tabs {
    flex: 1 1 auto;
    position: relative;
    flex-direction: row;
    border-top: solid var(--track-width) var(--track-color);
  }

  .tab-group--bottom .tab-group__indicator {
    top: calc(-1 * var(--track-width));
    border-top: solid var(--track-width) var(--indicator-color);
  }

  .tab-group--bottom .tab-group__body {
    order: 1;
  }

  .tab-group--bottom ::slotted(sl-tab-panel) {
    --padding: var(--sl-spacing-medium) 0;
  }

  /*
   * Start
   */

  .tab-group--start {
    flex-direction: row;
  }

  .tab-group--start .tab-group__nav-container {
    order: 1;
  }

  .tab-group--start .tab-group__tabs {
    flex: 0 0 auto;
    flex-direction: column;
    border-inline-end: solid var(--track-width) var(--track-color);
  }

  .tab-group--start .tab-group__indicator {
    right: calc(-1 * var(--track-width));
    border-right: solid var(--track-width) var(--indicator-color);
  }

  .tab-group--start.tab-group--rtl .tab-group__indicator {
    right: auto;
    left: calc(-1 * var(--track-width));
  }

  .tab-group--start .tab-group__body {
    flex: 1 1 auto;
    order: 2;
  }

  .tab-group--start ::slotted(sl-tab-panel) {
    --padding: 0 var(--sl-spacing-medium);
  }

  /*
   * End
   */

  .tab-group--end {
    flex-direction: row;
  }

  .tab-group--end .tab-group__nav-container {
    order: 2;
  }

  .tab-group--end .tab-group__tabs {
    flex: 0 0 auto;
    flex-direction: column;
    border-left: solid var(--track-width) var(--track-color);
  }

  .tab-group--end .tab-group__indicator {
    left: calc(-1 * var(--track-width));
    border-inline-start: solid var(--track-width) var(--indicator-color);
  }

  .tab-group--end.tab-group--rtl .tab-group__indicator {
    right: calc(-1 * var(--track-width));
    left: auto;
  }

  .tab-group--end .tab-group__body {
    flex: 1 1 auto;
    order: 1;
  }

  .tab-group--end ::slotted(sl-tab-panel) {
    --padding: 0 var(--sl-spacing-medium);
  }
`;
let H = class extends Ie {
  constructor() {
    super(...arguments), this.localize = new Ba(this), this.tabs = [], this.panels = [], this.hasScrollControls = !1, this.placement = "top", this.activation = "auto", this.noScrollControls = !1;
  }
  connectedCallback() {
    const o = Promise.all([
      customElements.whenDefined("sl-tab"),
      customElements.whenDefined("sl-tab-panel")
    ]);
    super.connectedCallback(), this.resizeObserver = new ResizeObserver(() => {
      this.repositionIndicator(), this.updateScrollControls();
    }), this.mutationObserver = new MutationObserver((t) => {
      t.some((e) => !["aria-labelledby", "aria-controls"].includes(e.attributeName)) && setTimeout(() => this.setAriaLabels()), t.some((e) => e.attributeName === "disabled") && this.syncTabsAndPanels();
    }), this.updateComplete.then(() => {
      this.syncTabsAndPanels(), this.mutationObserver.observe(this, { attributes: !0, childList: !0, subtree: !0 }), this.resizeObserver.observe(this.nav), o.then(() => {
        new IntersectionObserver((e, i) => {
          var r;
          e[0].intersectionRatio > 0 && (this.setAriaLabels(), this.setActiveTab((r = this.getActiveTab()) != null ? r : this.tabs[0], { emitEvents: !1 }), i.unobserve(e[0].target));
        }).observe(this.tabGroup);
      });
    });
  }
  disconnectedCallback() {
    this.mutationObserver.disconnect(), this.resizeObserver.unobserve(this.nav);
  }
  getAllTabs(o = { includeDisabled: !0 }) {
    return [...this.shadowRoot.querySelector('slot[name="nav"]').assignedElements()].filter((e) => o.includeDisabled ? e.tagName.toLowerCase() === "sl-tab" : e.tagName.toLowerCase() === "sl-tab" && !e.disabled);
  }
  getAllPanels() {
    return [...this.body.assignedElements()].filter((o) => o.tagName.toLowerCase() === "sl-tab-panel");
  }
  getActiveTab() {
    return this.tabs.find((o) => o.active);
  }
  handleClick(o) {
    const e = o.target.closest("sl-tab");
    (e == null ? void 0 : e.closest("sl-tab-group")) === this && e !== null && this.setActiveTab(e, { scrollBehavior: "smooth" });
  }
  handleKeyDown(o) {
    const e = o.target.closest("sl-tab");
    if ((e == null ? void 0 : e.closest("sl-tab-group")) === this && (["Enter", " "].includes(o.key) && e !== null && (this.setActiveTab(e, { scrollBehavior: "smooth" }), o.preventDefault()), ["ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown", "Home", "End"].includes(o.key))) {
      const r = this.tabs.find((n) => n.matches(":focus")), s = this.localize.dir() === "rtl";
      if ((r == null ? void 0 : r.tagName.toLowerCase()) === "sl-tab") {
        let n = this.tabs.indexOf(r);
        o.key === "Home" ? n = 0 : o.key === "End" ? n = this.tabs.length - 1 : ["top", "bottom"].includes(this.placement) && o.key === (s ? "ArrowRight" : "ArrowLeft") || ["start", "end"].includes(this.placement) && o.key === "ArrowUp" ? n-- : (["top", "bottom"].includes(this.placement) && o.key === (s ? "ArrowLeft" : "ArrowRight") || ["start", "end"].includes(this.placement) && o.key === "ArrowDown") && n++, n < 0 && (n = this.tabs.length - 1), n > this.tabs.length - 1 && (n = 0), this.tabs[n].focus({ preventScroll: !0 }), this.activation === "auto" && this.setActiveTab(this.tabs[n], { scrollBehavior: "smooth" }), ["top", "bottom"].includes(this.placement) && Ws(this.tabs[n], this.nav, "horizontal"), o.preventDefault();
      }
    }
  }
  handleScrollToStart() {
    this.nav.scroll({
      left: this.localize.dir() === "rtl" ? this.nav.scrollLeft + this.nav.clientWidth : this.nav.scrollLeft - this.nav.clientWidth,
      behavior: "smooth"
    });
  }
  handleScrollToEnd() {
    this.nav.scroll({
      left: this.localize.dir() === "rtl" ? this.nav.scrollLeft - this.nav.clientWidth : this.nav.scrollLeft + this.nav.clientWidth,
      behavior: "smooth"
    });
  }
  setActiveTab(o, t) {
    if (t = ep({
      emitEvents: !0,
      scrollBehavior: "auto"
    }, t), o !== this.activeTab && !o.disabled) {
      const e = this.activeTab;
      this.activeTab = o, this.tabs.forEach((i) => i.active = i === this.activeTab), this.panels.forEach((i) => {
        var r;
        return i.active = i.name === ((r = this.activeTab) == null ? void 0 : r.panel);
      }), this.syncIndicator(), ["top", "bottom"].includes(this.placement) && Ws(this.activeTab, this.nav, "horizontal", t.scrollBehavior), t.emitEvents && (e && this.emit("sl-tab-hide", { detail: { name: e.panel } }), this.emit("sl-tab-show", { detail: { name: this.activeTab.panel } }));
    }
  }
  setAriaLabels() {
    this.tabs.forEach((o) => {
      const t = this.panels.find((e) => e.name === o.panel);
      t && (o.setAttribute("aria-controls", t.getAttribute("id")), t.setAttribute("aria-labelledby", o.getAttribute("id")));
    });
  }
  repositionIndicator() {
    const o = this.getActiveTab();
    if (!o)
      return;
    const t = o.clientWidth, e = o.clientHeight, i = this.localize.dir() === "rtl", r = this.getAllTabs(), n = r.slice(0, r.indexOf(o)).reduce(
      (a, l) => ({
        left: a.left + l.clientWidth,
        top: a.top + l.clientHeight
      }),
      { left: 0, top: 0 }
    );
    switch (this.placement) {
      case "top":
      case "bottom":
        this.indicator.style.width = `${t}px`, this.indicator.style.height = "auto", this.indicator.style.translate = i ? `${-1 * n.left}px` : `${n.left}px`;
        break;
      case "start":
      case "end":
        this.indicator.style.width = "auto", this.indicator.style.height = `${e}px`, this.indicator.style.translate = `0 ${n.top}px`;
        break;
    }
  }
  // This stores tabs and panels so we can refer to a cache instead of calling querySelectorAll() multiple times.
  syncTabsAndPanels() {
    this.tabs = this.getAllTabs({ includeDisabled: !1 }), this.panels = this.getAllPanels(), this.syncIndicator(), this.updateComplete.then(() => this.updateScrollControls());
  }
  updateScrollControls() {
    this.noScrollControls ? this.hasScrollControls = !1 : this.hasScrollControls = ["top", "bottom"].includes(this.placement) && this.nav.scrollWidth > this.nav.clientWidth;
  }
  syncIndicator() {
    this.getActiveTab() ? (this.indicator.style.display = "block", this.repositionIndicator()) : this.indicator.style.display = "none";
  }
  /** Shows the specified tab panel. */
  show(o) {
    const t = this.tabs.find((e) => e.panel === o);
    t && this.setActiveTab(t, { scrollBehavior: "smooth" });
  }
  render() {
    const o = this.localize.dir() === "rtl";
    return y`
      <div
        part="base"
        class=${bi({
      "tab-group": !0,
      "tab-group--top": this.placement === "top",
      "tab-group--bottom": this.placement === "bottom",
      "tab-group--start": this.placement === "start",
      "tab-group--end": this.placement === "end",
      "tab-group--rtl": this.localize.dir() === "rtl",
      "tab-group--has-scroll-controls": this.hasScrollControls
    })}
        @click=${this.handleClick}
        @keydown=${this.handleKeyDown}
      >
        <div class="tab-group__nav-container" part="nav">
          ${this.hasScrollControls ? y`
                <sl-icon-button
                  part="scroll-button scroll-button--start"
                  exportparts="base:scroll-button__base"
                  class="tab-group__scroll-button tab-group__scroll-button--start"
                  name=${o ? "chevron-right" : "chevron-left"}
                  library="system"
                  label=${this.localize.term("scrollToStart")}
                  @click=${this.handleScrollToStart}
                ></sl-icon-button>
              ` : ""}

          <div class="tab-group__nav">
            <div part="tabs" class="tab-group__tabs" role="tablist">
              <div part="active-tab-indicator" class="tab-group__indicator"></div>
              <slot name="nav" @slotchange=${this.syncTabsAndPanels}></slot>
            </div>
          </div>

          ${this.hasScrollControls ? y`
                <sl-icon-button
                  part="scroll-button scroll-button--end"
                  exportparts="base:scroll-button__base"
                  class="tab-group__scroll-button tab-group__scroll-button--end"
                  name=${o ? "chevron-left" : "chevron-right"}
                  library="system"
                  label=${this.localize.term("scrollToEnd")}
                  @click=${this.handleScrollToEnd}
                ></sl-icon-button>
              ` : ""}
        </div>

        <slot part="body" class="tab-group__body" @slotchange=${this.syncTabsAndPanels}></slot>
      </div>
    `;
  }
};
H.styles = wp;
g([
  ke(".tab-group")
], H.prototype, "tabGroup", 2);
g([
  ke(".tab-group__body")
], H.prototype, "body", 2);
g([
  ke(".tab-group__nav")
], H.prototype, "nav", 2);
g([
  ke(".tab-group__indicator")
], H.prototype, "indicator", 2);
g([
  R()
], H.prototype, "hasScrollControls", 2);
g([
  C()
], H.prototype, "placement", 2);
g([
  C()
], H.prototype, "activation", 2);
g([
  C({ attribute: "no-scroll-controls", type: Boolean })
], H.prototype, "noScrollControls", 2);
g([
  Se("noScrollControls", { waitUntilFirstUpdate: !0 })
], H.prototype, "updateScrollControls", 1);
g([
  Se("placement", { waitUntilFirstUpdate: !0 })
], H.prototype, "syncIndicator", 1);
H = g([
  ee("sl-tab-group")
], H);
var Ap = Object.defineProperty, kp = Object.getOwnPropertyDescriptor, Ep = Object.getPrototypeOf, Sp = Reflect.get, Ha = (o, t, e, i) => {
  for (var r = i > 1 ? void 0 : i ? kp(t, e) : t, s = o.length - 1, n; s >= 0; s--)
    (n = o[s]) && (r = (i ? n(t, e, r) : n(r)) || r);
  return i && r && Ap(t, e, r), r;
}, Ip = (o, t, e) => Sp(Ep(o), e, t);
let Ce = class extends wt {
  constructor() {
    super(...arguments), this.assignedQueries = [];
  }
  firstUpdated(o) {
    super.firstUpdated(o);
  }
  updated(o) {
    super.updated(o);
  }
  selectQuery(o) {
    let t = this.shadowRoot.querySelector("sl-tab-group");
    setTimeout(() => t.show(o), 100);
  }
  tryClose(o) {
    const t = o.target;
    if ("panel" in t) {
      const e = t.panel, i = new CustomEvent("close", { detail: e });
      this.dispatchEvent(i);
    }
  }
  apiRender() {
    return y`
            <div class="kiosk-query-layouter">
                <sl-tab-group @sl-close="${this.tryClose}">
                    ${this.assignedQueries.map((o) => y`
                        <sl-tab slot="nav" panel="${o[0]}" closable>${o[1]}</sl-tab>
                    `)}
                    ${this.assignedQueries.map((o) => y`
                        <sl-tab-panel name="${o[0]}"><slot name="${o[0]}"></slot></sl-tab-panel>
                    `)}
                </sl-tab-group>
            </div>
        `;
  }
};
Ce.styles = We(op);
Ce.properties = {
  ...Ip(Ce, Ce, "properties")
};
Ha([
  C()
], Ce.prototype, "assignedQueries", 2);
Ce = Ha([
  ee("kiosk-query-layouter")
], Ce);
var Tp = Object.defineProperty, Pp = Object.getOwnPropertyDescriptor, Dp = Object.getPrototypeOf, Op = Reflect.get, to = (o, t, e, i) => {
  for (var r = i > 1 ? void 0 : i ? Pp(t, e) : t, s = o.length - 1, n; s >= 0; s--)
    (n = o[s]) && (r = (i ? n(t, e, r) : n(r)) || r);
  return i && r && Tp(t, e, r), r;
}, zp = (o, t, e) => Op(Dp(o), e, t);
br("/sl_assets");
const Cr = class extends Xs {
  constructor() {
    super(), this._messages = {}, this.inSelectQueryMode = !0, this.queries = [], this.selectQueryTab = null;
  }
  firstUpdated(o) {
    super.firstUpdated(o);
  }
  updated(o) {
    super.updated(o), o.has("apiContext") && this.apiContext;
  }
  reloadClicked(o) {
    this.requestUpdate();
  }
  selectQueryClicked(o) {
    this.inSelectQueryMode || (this.inSelectQueryMode = !0);
  }
  queryModeClosed(o) {
    o.detail && this.openQuery(o.detail), this.inSelectQueryMode = !1;
  }
  openQuery(o) {
    if (ct.getKioskQueryTag(o.type)) {
      let e = { uid: rp(), ...o };
      this.queries.push(e), this.requestUpdate(), this.updateComplete.then(() => {
        this.shadowRoot.querySelector("kiosk-query-layouter").selectQuery(e.uid);
      });
    }
  }
  gotoIdentifier(o) {
    alert("Sorry, this is not implemented, yet.");
  }
  render_toolbar() {
    return E` <div class="toolbar">
            <div id="toolbar-left">
                <div class="toolbar-button" @click="${this.selectQueryClicked}">
                    <i class="fas fa-query"></i>
                </div>
            </div>
            <div id="toolbar-buttons">
                <div style="display:none" class="toolbar-button" @click="${this.reloadClicked}">
                    <i class="fas fa-window-restore"></i>
                </div>
                <div class="toolbar-button" @click="${this.reloadClicked}">
                    <i class="fas fa-reload"></i>
                </div>
            </div>
            <div></div>
        </div>`;
  }
  renderQueryMode() {
    return E`<kiosk-query-selector
            id="kiosk-query-selector"
            .apiContext=${this.apiContext}
            @closeSelection="${this.queryModeClosed}"
            style="display:${this.inSelectQueryMode ? "block" : "none"}"
        >
        </kiosk-query-selector>`;
  }
  renderQuery(o) {
    return E`<${ct.getKioskQueryTag(o.type)} 
            id="${o.uid}" 
            .apiContext=${this.apiContext} 
            .queryDefinition=${o}
            slot="${o.uid}"
        >
            
        </${ct.getKioskQueryTag(o.type)}>`;
  }
  onCloseQuery(o) {
    const t = o.detail, e = this.queries.findIndex((i) => i.uid === t);
    this.queries.splice(e, 1), this.requestUpdate();
  }
  renderLayout() {
    return E`<kiosk-query-layouter
            .apiContext="${this.apiContext}"
            .assignedQueries="${this.queries.map((o) => [o.uid, o.name])}"
            @close="${this.onCloseQuery}"
            @identifierClicked="${this.gotoIdentifier}" 
            style="display:${this.inSelectQueryMode ? "none" : "block"}"
        >
            ${this.queries.map((o) => this.renderQuery(o))}
        </kiosk-query-layouter>`;
  }
  // apiRender is only called once the api is connected.
  apiRender() {
    let o = E``, t = this.render_toolbar();
    const e = E`${this.renderQueryMode()}${this.renderLayout()}`;
    return E`${o}${t}${e}`;
  }
};
let Ye = Cr;
Ye.styles = We(ip);
Ye.properties = {
  ...zp(Cr, Cr, "properties")
};
to([
  R()
], Ye.prototype, "inSelectQueryMode", 2);
to([
  R()
], Ye.prototype, "queries", 2);
to([
  R()
], Ye.prototype, "selectQueryTab", 2);
window.customElements.define("queryandview-app", Ye);
export {
  Ye as QueryAndViewApp
};
