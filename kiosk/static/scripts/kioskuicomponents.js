var Dd = Object.defineProperty;
var Md = (n, t, e) => t in n ? Dd(n, t, { enumerable: !0, configurable: !0, writable: !0, value: e }) : n[t] = e;
var ye = (n, t, e) => Md(n, typeof t != "symbol" ? t + "" : t, e);
/**
 * @license
 * Copyright (c) 2021 - 2024 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
function ct(n) {
  const t = customElements.get(n.is);
  if (!t)
    Object.defineProperty(n, "version", {
      get() {
        return "24.4.4";
      }
    }), customElements.define(n.is, n);
  else {
    const e = t.version;
    e && n.version && n.version;
  }
}
/**
 * @license
 * Copyright (c) 2017 - 2024 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
class Fd extends HTMLElement {
  static get is() {
    return "vaadin-lumo-styles";
  }
}
ct(Fd);
/**
 * @license
 * Copyright 2019 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const Hi = globalThis, Qo = Hi.ShadowRoot && (Hi.ShadyCSS === void 0 || Hi.ShadyCSS.nativeShadow) && "adoptedStyleSheets" in Document.prototype && "replace" in CSSStyleSheet.prototype, es = Symbol(), ga = /* @__PURE__ */ new WeakMap();
let ts = class {
  constructor(t, e, r) {
    if (this._$cssResult$ = !0, r !== es) throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");
    this.cssText = t, this.t = e;
  }
  get styleSheet() {
    let t = this.o;
    const e = this.t;
    if (Qo && t === void 0) {
      const r = e !== void 0 && e.length === 1;
      r && (t = ga.get(e)), t === void 0 && ((this.o = t = new CSSStyleSheet()).replaceSync(this.cssText), r && ga.set(e, t));
    }
    return t;
  }
  toString() {
    return this.cssText;
  }
};
const un = (n) => new ts(typeof n == "string" ? n : n + "", void 0, es), X = (n, ...t) => {
  const e = n.length === 1 ? n[0] : t.reduce((r, i, s) => r + ((l) => {
    if (l._$cssResult$ === !0) return l.cssText;
    if (typeof l == "number") return l;
    throw Error("Value passed to 'css' function must be a 'css' function result: " + l + ". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.");
  })(i) + n[s + 1], n[0]);
  return new ts(e, n, es);
}, Pl = (n, t) => {
  if (Qo) n.adoptedStyleSheets = t.map((e) => e instanceof CSSStyleSheet ? e : e.styleSheet);
  else for (const e of t) {
    const r = document.createElement("style"), i = Hi.litNonce;
    i !== void 0 && r.setAttribute("nonce", i), r.textContent = e.cssText, n.appendChild(r);
  }
}, ba = Qo ? (n) => n : (n) => n instanceof CSSStyleSheet ? ((t) => {
  let e = "";
  for (const r of t.cssRules) e += r.cssText;
  return un(e);
})(n) : n;
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const { is: Ld, defineProperty: Bd, getOwnPropertyDescriptor: Vd, getOwnPropertyNames: Hd, getOwnPropertySymbols: Ud, getPrototypeOf: jd } = Object, ot = globalThis, va = ot.trustedTypes, qd = va ? va.emptyScript : "", so = ot.reactiveElementPolyfillSupport, Dr = (n, t) => n, Zi = { toAttribute(n, t) {
  switch (t) {
    case Boolean:
      n = n ? qd : null;
      break;
    case Object:
    case Array:
      n = n == null ? n : JSON.stringify(n);
  }
  return n;
}, fromAttribute(n, t) {
  let e = n;
  switch (t) {
    case Boolean:
      e = n !== null;
      break;
    case Number:
      e = n === null ? null : Number(n);
      break;
    case Object:
    case Array:
      try {
        e = JSON.parse(n);
      } catch {
        e = null;
      }
  }
  return e;
} }, rs = (n, t) => !Ld(n, t), ya = { attribute: !0, type: String, converter: Zi, reflect: !1, hasChanged: rs };
Symbol.metadata ?? (Symbol.metadata = Symbol("metadata")), ot.litPropertyMetadata ?? (ot.litPropertyMetadata = /* @__PURE__ */ new WeakMap());
let Gt = class extends HTMLElement {
  static addInitializer(t) {
    this._$Ei(), (this.l ?? (this.l = [])).push(t);
  }
  static get observedAttributes() {
    return this.finalize(), this._$Eh && [...this._$Eh.keys()];
  }
  static createProperty(t, e = ya) {
    if (e.state && (e.attribute = !1), this._$Ei(), this.elementProperties.set(t, e), !e.noAccessor) {
      const r = Symbol(), i = this.getPropertyDescriptor(t, r, e);
      i !== void 0 && Bd(this.prototype, t, i);
    }
  }
  static getPropertyDescriptor(t, e, r) {
    const { get: i, set: s } = Vd(this.prototype, t) ?? { get() {
      return this[e];
    }, set(l) {
      this[e] = l;
    } };
    return { get() {
      return i == null ? void 0 : i.call(this);
    }, set(l) {
      const d = i == null ? void 0 : i.call(this);
      s.call(this, l), this.requestUpdate(t, d, r);
    }, configurable: !0, enumerable: !0 };
  }
  static getPropertyOptions(t) {
    return this.elementProperties.get(t) ?? ya;
  }
  static _$Ei() {
    if (this.hasOwnProperty(Dr("elementProperties"))) return;
    const t = jd(this);
    t.finalize(), t.l !== void 0 && (this.l = [...t.l]), this.elementProperties = new Map(t.elementProperties);
  }
  static finalize() {
    if (this.hasOwnProperty(Dr("finalized"))) return;
    if (this.finalized = !0, this._$Ei(), this.hasOwnProperty(Dr("properties"))) {
      const e = this.properties, r = [...Hd(e), ...Ud(e)];
      for (const i of r) this.createProperty(i, e[i]);
    }
    const t = this[Symbol.metadata];
    if (t !== null) {
      const e = litPropertyMetadata.get(t);
      if (e !== void 0) for (const [r, i] of e) this.elementProperties.set(r, i);
    }
    this._$Eh = /* @__PURE__ */ new Map();
    for (const [e, r] of this.elementProperties) {
      const i = this._$Eu(e, r);
      i !== void 0 && this._$Eh.set(i, e);
    }
    this.elementStyles = this.finalizeStyles(this.styles);
  }
  static finalizeStyles(t) {
    const e = [];
    if (Array.isArray(t)) {
      const r = new Set(t.flat(1 / 0).reverse());
      for (const i of r) e.unshift(ba(i));
    } else t !== void 0 && e.push(ba(t));
    return e;
  }
  static _$Eu(t, e) {
    const r = e.attribute;
    return r === !1 ? void 0 : typeof r == "string" ? r : typeof t == "string" ? t.toLowerCase() : void 0;
  }
  constructor() {
    super(), this._$Ep = void 0, this.isUpdatePending = !1, this.hasUpdated = !1, this._$Em = null, this._$Ev();
  }
  _$Ev() {
    var t;
    this._$ES = new Promise((e) => this.enableUpdating = e), this._$AL = /* @__PURE__ */ new Map(), this._$E_(), this.requestUpdate(), (t = this.constructor.l) == null || t.forEach((e) => e(this));
  }
  addController(t) {
    var e;
    (this._$EO ?? (this._$EO = /* @__PURE__ */ new Set())).add(t), this.renderRoot !== void 0 && this.isConnected && ((e = t.hostConnected) == null || e.call(t));
  }
  removeController(t) {
    var e;
    (e = this._$EO) == null || e.delete(t);
  }
  _$E_() {
    const t = /* @__PURE__ */ new Map(), e = this.constructor.elementProperties;
    for (const r of e.keys()) this.hasOwnProperty(r) && (t.set(r, this[r]), delete this[r]);
    t.size > 0 && (this._$Ep = t);
  }
  createRenderRoot() {
    const t = this.shadowRoot ?? this.attachShadow(this.constructor.shadowRootOptions);
    return Pl(t, this.constructor.elementStyles), t;
  }
  connectedCallback() {
    var t;
    this.renderRoot ?? (this.renderRoot = this.createRenderRoot()), this.enableUpdating(!0), (t = this._$EO) == null || t.forEach((e) => {
      var r;
      return (r = e.hostConnected) == null ? void 0 : r.call(e);
    });
  }
  enableUpdating(t) {
  }
  disconnectedCallback() {
    var t;
    (t = this._$EO) == null || t.forEach((e) => {
      var r;
      return (r = e.hostDisconnected) == null ? void 0 : r.call(e);
    });
  }
  attributeChangedCallback(t, e, r) {
    this._$AK(t, r);
  }
  _$EC(t, e) {
    var s;
    const r = this.constructor.elementProperties.get(t), i = this.constructor._$Eu(t, r);
    if (i !== void 0 && r.reflect === !0) {
      const l = (((s = r.converter) == null ? void 0 : s.toAttribute) !== void 0 ? r.converter : Zi).toAttribute(e, r.type);
      this._$Em = t, l == null ? this.removeAttribute(i) : this.setAttribute(i, l), this._$Em = null;
    }
  }
  _$AK(t, e) {
    var s;
    const r = this.constructor, i = r._$Eh.get(t);
    if (i !== void 0 && this._$Em !== i) {
      const l = r.getPropertyOptions(i), d = typeof l.converter == "function" ? { fromAttribute: l.converter } : ((s = l.converter) == null ? void 0 : s.fromAttribute) !== void 0 ? l.converter : Zi;
      this._$Em = i, this[i] = d.fromAttribute(e, l.type), this._$Em = null;
    }
  }
  requestUpdate(t, e, r) {
    if (t !== void 0) {
      if (r ?? (r = this.constructor.getPropertyOptions(t)), !(r.hasChanged ?? rs)(this[t], e)) return;
      this.P(t, e, r);
    }
    this.isUpdatePending === !1 && (this._$ES = this._$ET());
  }
  P(t, e, r) {
    this._$AL.has(t) || this._$AL.set(t, e), r.reflect === !0 && this._$Em !== t && (this._$Ej ?? (this._$Ej = /* @__PURE__ */ new Set())).add(t);
  }
  async _$ET() {
    this.isUpdatePending = !0;
    try {
      await this._$ES;
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
    var r;
    if (!this.isUpdatePending) return;
    if (!this.hasUpdated) {
      if (this.renderRoot ?? (this.renderRoot = this.createRenderRoot()), this._$Ep) {
        for (const [s, l] of this._$Ep) this[s] = l;
        this._$Ep = void 0;
      }
      const i = this.constructor.elementProperties;
      if (i.size > 0) for (const [s, l] of i) l.wrapped !== !0 || this._$AL.has(s) || this[s] === void 0 || this.P(s, this[s], l);
    }
    let t = !1;
    const e = this._$AL;
    try {
      t = this.shouldUpdate(e), t ? (this.willUpdate(e), (r = this._$EO) == null || r.forEach((i) => {
        var s;
        return (s = i.hostUpdate) == null ? void 0 : s.call(i);
      }), this.update(e)) : this._$EU();
    } catch (i) {
      throw t = !1, this._$EU(), i;
    }
    t && this._$AE(e);
  }
  willUpdate(t) {
  }
  _$AE(t) {
    var e;
    (e = this._$EO) == null || e.forEach((r) => {
      var i;
      return (i = r.hostUpdated) == null ? void 0 : i.call(r);
    }), this.hasUpdated || (this.hasUpdated = !0, this.firstUpdated(t)), this.updated(t);
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
  shouldUpdate(t) {
    return !0;
  }
  update(t) {
    this._$Ej && (this._$Ej = this._$Ej.forEach((e) => this._$EC(e, this[e]))), this._$EU();
  }
  updated(t) {
  }
  firstUpdated(t) {
  }
};
Gt.elementStyles = [], Gt.shadowRootOptions = { mode: "open" }, Gt[Dr("elementProperties")] = /* @__PURE__ */ new Map(), Gt[Dr("finalized")] = /* @__PURE__ */ new Map(), so == null || so({ ReactiveElement: Gt }), (ot.reactiveElementVersions ?? (ot.reactiveElementVersions = [])).push("2.0.4");
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const Mr = globalThis, Xi = Mr.trustedTypes, xa = Xi ? Xi.createPolicy("lit-html", { createHTML: (n) => n }) : void 0, Sl = "$lit$", tt = `lit$${(Math.random() + "").slice(9)}$`, Il = "?" + tt, Kd = `<${Il}>`, Ot = document, jr = () => Ot.createComment(""), qr = (n) => n === null || typeof n != "object" && typeof n != "function", Tl = Array.isArray, Wd = (n) => Tl(n) || typeof (n == null ? void 0 : n[Symbol.iterator]) == "function", ao = `[ 	
\f\r]`, Pr = /<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g, wa = /-->/g, Ca = />/g, xt = RegExp(`>|${ao}(?:([^\\s"'>=/]+)(${ao}*=${ao}*(?:[^ 	
\f\r"'\`<>=]|("|')|))|$)`, "g"), Ea = /'/g, Aa = /"/g, Ol = /^(?:script|style|textarea|title)$/i, Gd = (n) => (t, ...e) => ({ _$litType$: n, strings: t, values: e }), Fr = Gd(1), rr = Symbol.for("lit-noChange"), de = Symbol.for("lit-nothing"), ka = /* @__PURE__ */ new WeakMap(), Et = Ot.createTreeWalker(Ot, 129);
function zl(n, t) {
  if (!Array.isArray(n) || !n.hasOwnProperty("raw")) throw Error("invalid template strings array");
  return xa !== void 0 ? xa.createHTML(t) : t;
}
const Yd = (n, t) => {
  const e = n.length - 1, r = [];
  let i, s = t === 2 ? "<svg>" : "", l = Pr;
  for (let d = 0; d < e; d++) {
    const f = n[d];
    let m, g, v = -1, z = 0;
    for (; z < f.length && (l.lastIndex = z, g = l.exec(f), g !== null); ) z = l.lastIndex, l === Pr ? g[1] === "!--" ? l = wa : g[1] !== void 0 ? l = Ca : g[2] !== void 0 ? (Ol.test(g[2]) && (i = RegExp("</" + g[2], "g")), l = xt) : g[3] !== void 0 && (l = xt) : l === xt ? g[0] === ">" ? (l = i ?? Pr, v = -1) : g[1] === void 0 ? v = -2 : (v = l.lastIndex - g[2].length, m = g[1], l = g[3] === void 0 ? xt : g[3] === '"' ? Aa : Ea) : l === Aa || l === Ea ? l = xt : l === wa || l === Ca ? l = Pr : (l = xt, i = void 0);
    const B = l === xt && n[d + 1].startsWith("/>") ? " " : "";
    s += l === Pr ? f + Kd : v >= 0 ? (r.push(m), f.slice(0, v) + Sl + f.slice(v) + tt + B) : f + tt + (v === -2 ? d : B);
  }
  return [zl(n, s + (n[e] || "<?>") + (t === 2 ? "</svg>" : "")), r];
};
let zo = class Rl {
  constructor({ strings: t, _$litType$: e }, r) {
    let i;
    this.parts = [];
    let s = 0, l = 0;
    const d = t.length - 1, f = this.parts, [m, g] = Yd(t, e);
    if (this.el = Rl.createElement(m, r), Et.currentNode = this.el.content, e === 2) {
      const v = this.el.content.firstChild;
      v.replaceWith(...v.childNodes);
    }
    for (; (i = Et.nextNode()) !== null && f.length < d; ) {
      if (i.nodeType === 1) {
        if (i.hasAttributes()) for (const v of i.getAttributeNames()) if (v.endsWith(Sl)) {
          const z = g[l++], B = i.getAttribute(v).split(tt), H = /([.?@])?(.*)/.exec(z);
          f.push({ type: 1, index: s, name: H[2], strings: B, ctor: H[1] === "." ? Xd : H[1] === "?" ? Jd : H[1] === "@" ? Qd : hn }), i.removeAttribute(v);
        } else v.startsWith(tt) && (f.push({ type: 6, index: s }), i.removeAttribute(v));
        if (Ol.test(i.tagName)) {
          const v = i.textContent.split(tt), z = v.length - 1;
          if (z > 0) {
            i.textContent = Xi ? Xi.emptyScript : "";
            for (let B = 0; B < z; B++) i.append(v[B], jr()), Et.nextNode(), f.push({ type: 2, index: ++s });
            i.append(v[z], jr());
          }
        }
      } else if (i.nodeType === 8) if (i.data === Il) f.push({ type: 2, index: s });
      else {
        let v = -1;
        for (; (v = i.data.indexOf(tt, v + 1)) !== -1; ) f.push({ type: 7, index: s }), v += tt.length - 1;
      }
      s++;
    }
  }
  static createElement(t, e) {
    const r = Ot.createElement("template");
    return r.innerHTML = t, r;
  }
};
function ir(n, t, e = n, r) {
  var l, d;
  if (t === rr) return t;
  let i = r !== void 0 ? (l = e._$Co) == null ? void 0 : l[r] : e._$Cl;
  const s = qr(t) ? void 0 : t._$litDirective$;
  return (i == null ? void 0 : i.constructor) !== s && ((d = i == null ? void 0 : i._$AO) == null || d.call(i, !1), s === void 0 ? i = void 0 : (i = new s(n), i._$AT(n, e, r)), r !== void 0 ? (e._$Co ?? (e._$Co = []))[r] = i : e._$Cl = i), i !== void 0 && (t = ir(n, i._$AS(n, t.values), i, r)), t;
}
let Zd = class {
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
    const { el: { content: e }, parts: r } = this._$AD, i = ((t == null ? void 0 : t.creationScope) ?? Ot).importNode(e, !0);
    Et.currentNode = i;
    let s = Et.nextNode(), l = 0, d = 0, f = r[0];
    for (; f !== void 0; ) {
      if (l === f.index) {
        let m;
        f.type === 2 ? m = new is(s, s.nextSibling, this, t) : f.type === 1 ? m = new f.ctor(s, f.name, f.strings, this, t) : f.type === 6 && (m = new eu(s, this, t)), this._$AV.push(m), f = r[++d];
      }
      l !== (f == null ? void 0 : f.index) && (s = Et.nextNode(), l++);
    }
    return Et.currentNode = Ot, i;
  }
  p(t) {
    let e = 0;
    for (const r of this._$AV) r !== void 0 && (r.strings !== void 0 ? (r._$AI(t, r, e), e += r.strings.length - 2) : r._$AI(t[e])), e++;
  }
}, is = class $l {
  get _$AU() {
    var t;
    return ((t = this._$AM) == null ? void 0 : t._$AU) ?? this._$Cv;
  }
  constructor(t, e, r, i) {
    this.type = 2, this._$AH = de, this._$AN = void 0, this._$AA = t, this._$AB = e, this._$AM = r, this.options = i, this._$Cv = (i == null ? void 0 : i.isConnected) ?? !0;
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
    t = ir(this, t, e), qr(t) ? t === de || t == null || t === "" ? (this._$AH !== de && this._$AR(), this._$AH = de) : t !== this._$AH && t !== rr && this._(t) : t._$litType$ !== void 0 ? this.$(t) : t.nodeType !== void 0 ? this.T(t) : Wd(t) ? this.k(t) : this._(t);
  }
  S(t) {
    return this._$AA.parentNode.insertBefore(t, this._$AB);
  }
  T(t) {
    this._$AH !== t && (this._$AR(), this._$AH = this.S(t));
  }
  _(t) {
    this._$AH !== de && qr(this._$AH) ? this._$AA.nextSibling.data = t : this.T(Ot.createTextNode(t)), this._$AH = t;
  }
  $(t) {
    var s;
    const { values: e, _$litType$: r } = t, i = typeof r == "number" ? this._$AC(t) : (r.el === void 0 && (r.el = zo.createElement(zl(r.h, r.h[0]), this.options)), r);
    if (((s = this._$AH) == null ? void 0 : s._$AD) === i) this._$AH.p(e);
    else {
      const l = new Zd(i, this), d = l.u(this.options);
      l.p(e), this.T(d), this._$AH = l;
    }
  }
  _$AC(t) {
    let e = ka.get(t.strings);
    return e === void 0 && ka.set(t.strings, e = new zo(t)), e;
  }
  k(t) {
    Tl(this._$AH) || (this._$AH = [], this._$AR());
    const e = this._$AH;
    let r, i = 0;
    for (const s of t) i === e.length ? e.push(r = new $l(this.S(jr()), this.S(jr()), this, this.options)) : r = e[i], r._$AI(s), i++;
    i < e.length && (this._$AR(r && r._$AB.nextSibling, i), e.length = i);
  }
  _$AR(t = this._$AA.nextSibling, e) {
    var r;
    for ((r = this._$AP) == null ? void 0 : r.call(this, !1, !0, e); t && t !== this._$AB; ) {
      const i = t.nextSibling;
      t.remove(), t = i;
    }
  }
  setConnected(t) {
    var e;
    this._$AM === void 0 && (this._$Cv = t, (e = this._$AP) == null || e.call(this, t));
  }
}, hn = class {
  get tagName() {
    return this.element.tagName;
  }
  get _$AU() {
    return this._$AM._$AU;
  }
  constructor(t, e, r, i, s) {
    this.type = 1, this._$AH = de, this._$AN = void 0, this.element = t, this.name = e, this._$AM = i, this.options = s, r.length > 2 || r[0] !== "" || r[1] !== "" ? (this._$AH = Array(r.length - 1).fill(new String()), this.strings = r) : this._$AH = de;
  }
  _$AI(t, e = this, r, i) {
    const s = this.strings;
    let l = !1;
    if (s === void 0) t = ir(this, t, e, 0), l = !qr(t) || t !== this._$AH && t !== rr, l && (this._$AH = t);
    else {
      const d = t;
      let f, m;
      for (t = s[0], f = 0; f < s.length - 1; f++) m = ir(this, d[r + f], e, f), m === rr && (m = this._$AH[f]), l || (l = !qr(m) || m !== this._$AH[f]), m === de ? t = de : t !== de && (t += (m ?? "") + s[f + 1]), this._$AH[f] = m;
    }
    l && !i && this.j(t);
  }
  j(t) {
    t === de ? this.element.removeAttribute(this.name) : this.element.setAttribute(this.name, t ?? "");
  }
}, Xd = class extends hn {
  constructor() {
    super(...arguments), this.type = 3;
  }
  j(t) {
    this.element[this.name] = t === de ? void 0 : t;
  }
}, Jd = class extends hn {
  constructor() {
    super(...arguments), this.type = 4;
  }
  j(t) {
    this.element.toggleAttribute(this.name, !!t && t !== de);
  }
}, Qd = class extends hn {
  constructor(t, e, r, i, s) {
    super(t, e, r, i, s), this.type = 5;
  }
  _$AI(t, e = this) {
    if ((t = ir(this, t, e, 0) ?? de) === rr) return;
    const r = this._$AH, i = t === de && r !== de || t.capture !== r.capture || t.once !== r.once || t.passive !== r.passive, s = t !== de && (r === de || i);
    i && this.element.removeEventListener(this.name, this, r), s && this.element.addEventListener(this.name, this, t), this._$AH = t;
  }
  handleEvent(t) {
    var e;
    typeof this._$AH == "function" ? this._$AH.call(((e = this.options) == null ? void 0 : e.host) ?? this.element, t) : this._$AH.handleEvent(t);
  }
}, eu = class {
  constructor(t, e, r) {
    this.element = t, this.type = 6, this._$AN = void 0, this._$AM = e, this.options = r;
  }
  get _$AU() {
    return this._$AM._$AU;
  }
  _$AI(t) {
    ir(this, t);
  }
};
const lo = Mr.litHtmlPolyfillSupport;
lo == null || lo(zo, is), (Mr.litHtmlVersions ?? (Mr.litHtmlVersions = [])).push("3.1.2");
const Nl = (n, t, e) => {
  const r = (e == null ? void 0 : e.renderBefore) ?? t;
  let i = r._$litPart$;
  if (i === void 0) {
    const s = (e == null ? void 0 : e.renderBefore) ?? null;
    r._$litPart$ = i = new is(t.insertBefore(jr(), s), s, void 0, e ?? {});
  }
  return i._$AI(n), i;
};
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
let Pt = class extends Gt {
  constructor() {
    super(...arguments), this.renderOptions = { host: this }, this._$Do = void 0;
  }
  createRenderRoot() {
    var e;
    const t = super.createRenderRoot();
    return (e = this.renderOptions).renderBefore ?? (e.renderBefore = t.firstChild), t;
  }
  update(t) {
    const e = this.render();
    this.hasUpdated || (this.renderOptions.isConnected = this.isConnected), super.update(t), this._$Do = Nl(e, this.renderRoot, this.renderOptions);
  }
  connectedCallback() {
    var t;
    super.connectedCallback(), (t = this._$Do) == null || t.setConnected(!0);
  }
  disconnectedCallback() {
    var t;
    super.disconnectedCallback(), (t = this._$Do) == null || t.setConnected(!1);
  }
  render() {
    return rr;
  }
};
var Al;
Pt._$litElement$ = !0, Pt.finalized = !0, (Al = globalThis.litElementHydrateSupport) == null || Al.call(globalThis, { LitElement: Pt });
const co = globalThis.litElementPolyfillSupport;
co == null || co({ LitElement: Pt });
(globalThis.litElementVersions ?? (globalThis.litElementVersions = [])).push("4.0.4");
/**
 * @license
 * Copyright (c) 2017 - 2024 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
const tu = (n) => class extends n {
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
       * See [Styling Components: Sub-components](https://vaadin.com/docs/latest/styling/styling-components/#sub-components).
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
  attributeChangedCallback(e, r, i) {
    super.attributeChangedCallback(e, r, i), e === "theme" && this._set_theme(i);
  }
};
/**
 * @license
 * Copyright (c) 2017 - 2024 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
const Dl = [], Ro = /* @__PURE__ */ new Set(), ns = /* @__PURE__ */ new Set();
function Ml(n) {
  return n && Object.prototype.hasOwnProperty.call(n, "__themes");
}
function ru(n) {
  return Ml(customElements.get(n));
}
function iu(n = []) {
  return [n].flat(1 / 0).filter((t) => t instanceof ts);
}
function Fl(n, t) {
  return (n || "").split(" ").some((e) => new RegExp(`^${e.split("*").join(".*")}$`, "u").test(t));
}
function Ll(n) {
  return n.map((t) => t.cssText).join(`
`);
}
const Ji = "vaadin-themable-mixin-style";
function nu(n, t) {
  const e = document.createElement("style");
  e.id = Ji, e.textContent = Ll(n), t.content.appendChild(e);
}
function ou(n) {
  if (!n.shadowRoot)
    return;
  const t = n.constructor;
  if (n instanceof Pt)
    [...n.shadowRoot.querySelectorAll("style")].forEach((e) => e.remove()), Pl(n.shadowRoot, t.elementStyles);
  else {
    const e = n.shadowRoot.getElementById(Ji), r = t.prototype._template;
    e.textContent = r.content.getElementById(Ji).textContent;
  }
}
function su(n) {
  Ro.forEach((t) => {
    const e = t.deref();
    e instanceof n ? ou(e) : e || Ro.delete(t);
  });
}
function Bl(n) {
  if (n.prototype instanceof Pt)
    n.elementStyles = n.finalizeStyles(n.styles);
  else {
    const t = n.prototype._template;
    t.content.getElementById(Ji).textContent = Ll(n.getStylesForThis());
  }
  ns.forEach((t) => {
    const e = customElements.get(t);
    e !== n && e.prototype instanceof n && Bl(e);
  });
}
function au(n, t) {
  const e = n.__themes;
  return !e || !t ? !1 : e.some(
    (r) => r.styles.some((i) => t.some((s) => s.cssText === i.cssText))
  );
}
function fe(n, t, e = {}) {
  t = iu(t), window.Vaadin && window.Vaadin.styleModules ? window.Vaadin.styleModules.registerStyles(n, t, e) : Dl.push({
    themeFor: n,
    styles: t,
    include: e.include,
    moduleId: e.moduleId
  }), n && ns.forEach((r) => {
    if (Fl(n, r) && ru(r)) {
      const i = customElements.get(r);
      au(i, t) || !window.Vaadin || window.Vaadin.suppressPostFinalizeStylesWarning, Bl(i), su(i);
    }
  });
}
function $o() {
  return window.Vaadin && window.Vaadin.styleModules ? window.Vaadin.styleModules.getAllThemes() : Dl;
}
function lu(n = "") {
  let t = 0;
  return n.startsWith("lumo-") || n.startsWith("material-") ? t = 1 : n.startsWith("vaadin-") && (t = 2), t;
}
function Vl(n) {
  const t = [];
  return n.include && [].concat(n.include).forEach((e) => {
    const r = $o().find((i) => i.moduleId === e);
    r && t.push(...Vl(r), ...r.styles);
  }, n.styles), t;
}
function cu(n) {
  const t = `${n}-default-theme`, e = $o().filter((r) => r.moduleId !== t && Fl(r.themeFor, n)).map((r) => ({
    ...r,
    // Prepend styles from included themes
    styles: [...Vl(r), ...r.styles],
    // Map moduleId to includePriority
    includePriority: lu(r.moduleId)
  })).sort((r, i) => i.includePriority - r.includePriority);
  return e.length > 0 ? e : $o().filter((r) => r.moduleId === t);
}
const ti = (n) => class extends tu(n) {
  constructor() {
    super(), Ro.add(new WeakRef(this));
  }
  /**
   * Covers PolymerElement based component styling
   * @protected
   */
  static finalize() {
    if (super.finalize(), this.is && ns.add(this.is), this.elementStyles)
      return;
    const e = this.prototype._template;
    !e || Ml(this) || nu(this.getStylesForThis(), e);
  }
  /**
   * Covers LitElement based component styling
   *
   * @protected
   */
  static finalizeStyles(e) {
    const r = this.getStylesForThis();
    return e ? [...[e].flat(1 / 0), ...r] : r;
  }
  /**
   * Get styles for the component type
   *
   * @private
   */
  static getStylesForThis() {
    const e = n.__themes || [], r = Object.getPrototypeOf(this.prototype), i = (r ? r.constructor.__themes : []) || [];
    this.__themes = [...e, ...i, ...cu(this.is)];
    const s = this.__themes.flatMap((l) => l.styles);
    return s.filter((l, d) => d === s.lastIndexOf(l));
  }
};
/**
 * @license
 * Copyright (c) 2017 - 2024 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
const du = (n, ...t) => {
  const e = document.createElement("style");
  e.id = n, e.textContent = t.map((r) => r.toString()).join(`
`).replace(":host", "html"), document.head.insertAdjacentElement("afterbegin", e);
}, cr = (n, ...t) => {
  du(`lumo-${n}`, t);
};
/**
 * @license
 * Copyright (c) 2017 - 2024 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
const uu = X`
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
cr("color-props", uu);
const hu = X`
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
  pre code {
    background: transparent;
  }
`;
fe("", hu, { moduleId: "lumo-color" });
/**
 * @license
 * Copyright (c) 2017 - 2024 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
const fu = X`
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
cr("font-icons", fu);
/**
 * @license
 * Copyright (c) 2017 - 2024 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
const pu = X`
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
cr("sizing-props", pu);
/**
 * @license
 * Copyright (c) 2017 - 2024 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
const _u = X`
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
cr("spacing-props", _u);
/**
 * @license
 * Copyright (c) 2017 - 2024 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
const mu = X`
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
X`
  html {
    /* Button */
    --vaadin-button-background: var(--lumo-contrast-5pct);
    --vaadin-button-border: none;
    --vaadin-button-border-radius: var(--lumo-border-radius-m);
    --vaadin-button-font-size: var(--lumo-font-size-m);
    --vaadin-button-font-weight: 500;
    --vaadin-button-height: var(--lumo-size-m);
    --vaadin-button-margin: var(--lumo-space-xs) 0;
    --vaadin-button-min-width: calc(var(--vaadin-button-height) * 2);
    --vaadin-button-padding: 0 calc(var(--vaadin-button-height) / 3 + var(--lumo-border-radius-m) / 2);
    --vaadin-button-text-color: var(--lumo-primary-text-color);
    --vaadin-button-primary-background: var(--lumo-primary-color);
    --vaadin-button-primary-border: none;
    --vaadin-button-primary-font-weight: 600;
    --vaadin-button-primary-text-color: var(--lumo-primary-contrast-color);
    --vaadin-button-tertiary-background: transparent !important;
    --vaadin-button-tertiary-text-color: var(--lumo-primary-text-color);
    --vaadin-button-tertiary-font-weight: 500;
    --vaadin-button-tertiary-padding: 0 calc(var(--vaadin-button-height) / 6);
    /* Checkbox */
    --vaadin-checkbox-background: var(--lumo-contrast-20pct);
    --vaadin-checkbox-background-hover: var(--lumo-contrast-30pct);
    --vaadin-checkbox-border-radius: var(--lumo-border-radius-s);
    --vaadin-checkbox-checkmark-char: var(--lumo-icons-checkmark);
    --vaadin-checkbox-checkmark-char-indeterminate: '';
    --vaadin-checkbox-checkmark-color: var(--lumo-primary-contrast-color);
    --vaadin-checkbox-checkmark-size: calc(var(--vaadin-checkbox-size) + 2px);
    --vaadin-checkbox-label-color: var(--lumo-body-text-color);
    --vaadin-checkbox-label-font-size: var(--lumo-font-size-m);
    --vaadin-checkbox-label-padding: var(--lumo-space-xs) var(--lumo-space-s) var(--lumo-space-xs) var(--lumo-space-xs);
    --vaadin-checkbox-size: calc(var(--lumo-size-m) / 2);
    /* Radio button */
    --vaadin-radio-button-background: var(--lumo-contrast-20pct);
    --vaadin-radio-button-background-hover: var(--lumo-contrast-30pct);
    --vaadin-radio-button-dot-color: var(--lumo-primary-contrast-color);
    --vaadin-radio-button-dot-size: 3px;
    --vaadin-radio-button-label-color: var(--lumo-body-text-color);
    --vaadin-radio-button-label-font-size: var(--lumo-font-size-m);
    --vaadin-radio-button-label-padding: var(--lumo-space-xs) var(--lumo-space-s) var(--lumo-space-xs)
      var(--lumo-space-xs);
    --vaadin-radio-button-size: calc(var(--lumo-size-m) / 2);
    --vaadin-selection-color: var(--lumo-primary-color);
    --vaadin-selection-color-text: var(--lumo-primary-text-color);
    --vaadin-input-field-border-radius: var(--lumo-border-radius-m);
    --vaadin-focus-ring-color: var(--lumo-primary-color-50pct);
    --vaadin-focus-ring-width: 2px;
    /* Label */
    --vaadin-input-field-label-color: var(--lumo-secondary-text-color);
    --vaadin-input-field-focused-label-color: var(--lumo-primary-text-color);
    --vaadin-input-field-hovered-label-color: var(--lumo-body-text-color);
    --vaadin-input-field-label-font-size: var(--lumo-font-size-s);
    --vaadin-input-field-label-font-weight: 500;
    /* Helper */
    --vaadin-input-field-helper-color: var(--lumo-secondary-text-color);
    --vaadin-input-field-helper-font-size: var(--lumo-font-size-xs);
    --vaadin-input-field-helper-font-weight: 400;
    --vaadin-input-field-helper-spacing: 0.4em;
    /* Error message */
    --vaadin-input-field-error-color: var(--lumo-error-text-color);
    --vaadin-input-field-error-font-size: var(--lumo-font-size-xs);
    --vaadin-input-field-error-font-weight: 400;
    /* Input field */
    --vaadin-input-field-background: var(--lumo-contrast-10pct);
    --vaadin-input-field-icon-color: var(--lumo-contrast-60pct);
    --vaadin-input-field-icon-size: var(--lumo-icon-size-m);
    --vaadin-input-field-invalid-background: var(--lumo-error-color-10pct);
    --vaadin-input-field-invalid-hover-highlight: var(--lumo-error-color-50pct);
    --vaadin-input-field-height: var(--lumo-size-m);
    --vaadin-input-field-hover-highlight: var(--lumo-contrast-50pct);
    --vaadin-input-field-placeholder-color: var(--lumo-secondary-text-color);
    --vaadin-input-field-readonly-border: 1px dashed var(--lumo-contrast-30pct);
    --vaadin-input-field-value-color: var(--lumo-body-text-color);
    --vaadin-input-field-value-font-size: var(--lumo-font-size-m);
    --vaadin-input-field-value-font-weight: 400;
  }
`;
cr("style-props", mu);
/**
 * @license
 * Copyright (c) 2017 - 2024 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
const gu = X`
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
`, bu = X`
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
fe("", bu, { moduleId: "lumo-typography" });
cr("typography-props", gu);
fe(
  "vaadin-grid",
  X`
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
      --_focus-ring-color: var(--vaadin-focus-ring-color, var(--lumo-primary-color-50pct));
      --_focus-ring-width: var(--vaadin-focus-ring-width, 2px);
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
      background-color: var(--vaadin-grid-cell-background, var(--lumo-base-color));
      cursor: default;
      --_cell-padding: var(--vaadin-grid-cell-padding, var(--_cell-default-padding));
      --_cell-default-padding: var(--lumo-space-xs) var(--lumo-space-m);
    }

    [part~='cell'] ::slotted(vaadin-grid-cell-content) {
      cursor: inherit;
      padding: var(--_cell-padding);
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
      inset: 0;
      pointer-events: none;
      box-shadow: inset 0 0 0 var(--_focus-ring-width) var(--_focus-ring-color);
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
      inset: 0;
      pointer-events: none;
      box-shadow: inset 0 0 0 var(--_focus-ring-width) var(--_focus-ring-color);
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
      inset: 0;
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

    [part~='header-cell'],
    [part~='footer-cell'],
    [part~='reorder-ghost'] {
      font-size: var(--lumo-font-size-s);
      font-weight: 500;
    }

    [part~='footer-cell'] {
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

    /* Hide header row top border if previous row is hidden */
    [part~='row'][hidden] + [part~='row'] [part~='header-cell'] {
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
      --_cell-default-padding: var(--lumo-space-xs) var(--lumo-space-s);
    }

    :host([theme~='compact']) [part~='first-row'] [part~='cell']:not([part~='details-cell']) {
      min-height: calc(var(--lumo-size-s) - var(--_lumo-grid-border-width));
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
@license
Copyright (c) 2017 The Polymer Project Authors. All rights reserved.
This code may only be used under the BSD style license found at http://polymer.github.io/LICENSE.txt
The complete set of authors may be found at http://polymer.github.io/AUTHORS.txt
The complete set of contributors may be found at http://polymer.github.io/CONTRIBUTORS.txt
Code distributed by Google as part of the polymer project is also
subject to an additional IP rights grant found at http://polymer.github.io/PATENTS.txt
*/
window.JSCompiler_renameProperty = function(n, t) {
  return n;
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
let vu = /(url\()([^)]*)(\))/g, yu = /(^\/[^\/])|(^#)|(^[\w-\d]*:)/, $i, Te;
function Lr(n, t) {
  if (n && yu.test(n) || n === "//")
    return n;
  if ($i === void 0) {
    $i = !1;
    try {
      const e = new URL("b", "http://a");
      e.pathname = "c%20d", $i = e.href === "http://a/c%20d";
    } catch {
    }
  }
  if (t || (t = document.baseURI || window.location.href), $i)
    try {
      return new URL(n, t).href;
    } catch {
      return n;
    }
  return Te || (Te = document.implementation.createHTMLDocument("temp"), Te.base = Te.createElement("base"), Te.head.appendChild(Te.base), Te.anchor = Te.createElement("a"), Te.body.appendChild(Te.anchor)), Te.base.href = t, Te.anchor.href = n, Te.anchor.href || n;
}
function os(n, t) {
  return n.replace(vu, function(e, r, i, s) {
    return r + "'" + Lr(i.replace(/["']/g, ""), t) + "'" + s;
  });
}
function ss(n) {
  return n.substring(0, n.lastIndexOf("/") + 1);
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
const xu = !window.ShadyDOM || !window.ShadyDOM.inUse;
!window.ShadyCSS || window.ShadyCSS.nativeCss;
const wu = xu && "adoptedStyleSheets" in Document.prototype && "replaceSync" in CSSStyleSheet.prototype && // Since spec may change, feature detect exact API we need
(() => {
  try {
    const n = new CSSStyleSheet();
    n.replaceSync("");
    const t = document.createElement("div");
    return t.attachShadow({ mode: "open" }), t.shadowRoot.adoptedStyleSheets = [n], t.shadowRoot.adoptedStyleSheets[0] === n;
  } catch {
    return !1;
  }
})();
let Cu = window.Polymer && window.Polymer.rootPath || ss(document.baseURI || window.location.href), Qi = window.Polymer && window.Polymer.sanitizeDOMValue || void 0;
window.Polymer && window.Polymer.setPassiveTouchGestures;
let No = window.Polymer && window.Polymer.strictTemplatePolicy || !1, Eu = window.Polymer && window.Polymer.allowTemplateFromDomModule || !1, Au = window.Polymer && window.Polymer.legacyOptimizations || !1, ku = window.Polymer && window.Polymer.legacyWarnings || !1, Pu = window.Polymer && window.Polymer.syncInitialRender || !1, Do = window.Polymer && window.Polymer.legacyUndefined || !1, Su = window.Polymer && window.Polymer.orderedComputed || !1, Pa = window.Polymer && window.Polymer.removeNestedTemplates || !1, Iu = window.Polymer && window.Polymer.fastDomIf || !1;
window.Polymer && window.Polymer.suppressTemplateNotifications;
window.Polymer && window.Polymer.legacyNoObservedAttributes;
let Tu = window.Polymer && window.Polymer.useAdoptedStyleSheetsWithBuiltCSS || !1;
/**
@license
Copyright (c) 2017 The Polymer Project Authors. All rights reserved.
This code may only be used under the BSD style license found at http://polymer.github.io/LICENSE.txt
The complete set of authors may be found at http://polymer.github.io/AUTHORS.txt
The complete set of contributors may be found at http://polymer.github.io/CONTRIBUTORS.txt
Code distributed by Google as part of the polymer project is also
subject to an additional IP rights grant found at http://polymer.github.io/PATENTS.txt
*/
let Ou = 0;
const me = function(n) {
  let t = (
    /** @type {!MixinFunction} */
    n.__mixinApplications
  );
  t || (t = /* @__PURE__ */ new WeakMap(), n.__mixinApplications = t);
  let e = Ou++;
  function r(i) {
    let s = (
      /** @type {!MixinFunction} */
      i.__mixinSet
    );
    if (s && s[e])
      return i;
    let l = t, d = l.get(i);
    if (!d) {
      d = /** @type {!Function} */
      n(i), l.set(i, d);
      let f = Object.create(
        /** @type {!MixinFunction} */
        d.__mixinSet || s || null
      );
      f[e] = !0, d.__mixinSet = f;
    }
    return d;
  }
  return r;
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
let as = {}, Hl = {};
function Sa(n, t) {
  as[n] = Hl[n.toLowerCase()] = t;
}
function Ia(n) {
  return as[n] || Hl[n.toLowerCase()];
}
function zu(n) {
  n.querySelector("style");
}
class Kr extends HTMLElement {
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
      let r = Ia(t);
      return r && e ? r.querySelector(e) : r;
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
  attributeChangedCallback(t, e, r, i) {
    e !== r && this.register();
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
      const t = window.HTMLImports && HTMLImports.importForElement ? HTMLImports.importForElement(this) || document : this.ownerDocument, e = Lr(
        this.getAttribute("assetpath") || "",
        t.baseURI
      );
      this.__assetpath = ss(e);
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
      if (No && Ia(t) !== void 0)
        throw Sa(t, null), new Error(`strictTemplatePolicy: dom-module ${t} re-registered`);
      this.id = t, Sa(t, this), zu(this);
    }
  }
}
Kr.prototype.modules = as;
customElements.define("dom-module", Kr);
/**
@license
Copyright (c) 2017 The Polymer Project Authors. All rights reserved.
This code may only be used under the BSD style license found at http://polymer.github.io/LICENSE.txt
The complete set of authors may be found at http://polymer.github.io/AUTHORS.txt
The complete set of contributors may be found at http://polymer.github.io/CONTRIBUTORS.txt
Code distributed by Google as part of the polymer project is also
subject to an additional IP rights grant found at http://polymer.github.io/PATENTS.txt
*/
const Ru = "link[rel=import][type~=css]", $u = "include", Ta = "shady-unscoped";
function Ul(n) {
  return (
    /** @type {?DomModule} */
    Kr.import(n)
  );
}
function Oa(n) {
  let t = n.body ? n.body : n;
  const e = os(
    t.textContent,
    n.baseURI
  ), r = document.createElement("style");
  return r.textContent = e, r;
}
function Nu(n) {
  const t = n.trim().split(/\s+/), e = [];
  for (let r = 0; r < t.length; r++)
    e.push(...Du(t[r]));
  return e;
}
function Du(n) {
  const t = Ul(n);
  if (!t)
    return [];
  if (t._styles === void 0) {
    const e = [];
    e.push(...ql(t));
    const r = (
      /** @type {?HTMLTemplateElement} */
      t.querySelector("template")
    );
    r && e.push(...jl(
      r,
      /** @type {templateWithAssetPath} */
      t.assetpath
    )), t._styles = e;
  }
  return t._styles;
}
function jl(n, t) {
  if (!n._styles) {
    const e = [], r = n.content.querySelectorAll("style");
    for (let i = 0; i < r.length; i++) {
      let s = r[i], l = s.getAttribute($u);
      l && e.push(...Nu(l).filter(function(d, f, m) {
        return m.indexOf(d) === f;
      })), t && (s.textContent = os(
        s.textContent,
        /** @type {string} */
        t
      )), e.push(s);
    }
    n._styles = e;
  }
  return n._styles;
}
function Mu(n) {
  let t = Ul(n);
  return t ? ql(t) : [];
}
function ql(n) {
  const t = [], e = n.querySelectorAll(Ru);
  for (let r = 0; r < e.length; r++) {
    let i = e[r];
    if (i.import) {
      const s = i.import, l = i.hasAttribute(Ta);
      if (l && !s._unscopedStyle) {
        const d = Oa(s);
        d.setAttribute(Ta, ""), s._unscopedStyle = d;
      } else s._style || (s._style = Oa(s));
      t.push(l ? s._unscopedStyle : s._style);
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
const St = window.ShadyDOM && window.ShadyDOM.noPatch && window.ShadyDOM.wrap ? window.ShadyDOM.wrap : window.ShadyDOM ? (n) => ShadyDOM.patch(n) : (n) => n;
/**
@license
Copyright (c) 2017 The Polymer Project Authors. All rights reserved.
This code may only be used under the BSD style license found at http://polymer.github.io/LICENSE.txt
The complete set of authors may be found at http://polymer.github.io/AUTHORS.txt
The complete set of contributors may be found at http://polymer.github.io/CONTRIBUTORS.txt
Code distributed by Google as part of the polymer project is also
subject to an additional IP rights grant found at http://polymer.github.io/PATENTS.txt
*/
function Mo(n) {
  return n.indexOf(".") >= 0;
}
function Nt(n) {
  let t = n.indexOf(".");
  return t === -1 ? n : n.slice(0, t);
}
function Fu(n, t) {
  return n.indexOf(t + ".") === 0;
}
function en(n, t) {
  return t.indexOf(n + ".") === 0;
}
function tn(n, t, e) {
  return t + e.slice(n.length);
}
function Rr(n) {
  if (Array.isArray(n)) {
    let t = [];
    for (let e = 0; e < n.length; e++) {
      let r = n[e].toString().split(".");
      for (let i = 0; i < r.length; i++)
        t.push(r[i]);
    }
    return t.join(".");
  } else
    return n;
}
function Kl(n) {
  return Array.isArray(n) ? Rr(n).split(".") : n.toString().split(".");
}
function ke(n, t, e) {
  let r = n, i = Kl(t);
  for (let s = 0; s < i.length; s++) {
    if (!r)
      return;
    let l = i[s];
    r = r[l];
  }
  return e && (e.path = i.join(".")), r;
}
function za(n, t, e) {
  let r = n, i = Kl(t), s = i[i.length - 1];
  if (i.length > 1) {
    for (let l = 0; l < i.length - 1; l++) {
      let d = i[l];
      if (r = r[d], !r)
        return;
    }
    r[s] = e;
  } else
    r[t] = e;
  return i.join(".");
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
const rn = {}, Lu = /-[a-z]/g, Bu = /([A-Z])/g;
function Wl(n) {
  return rn[n] || (rn[n] = n.indexOf("-") < 0 ? n : n.replace(
    Lu,
    (t) => t[1].toUpperCase()
  ));
}
function fn(n) {
  return rn[n] || (rn[n] = n.replace(Bu, "-$1").toLowerCase());
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
let Vu = 0, Gl = 0, Xt = [], Hu = 0, Fo = !1, Yl = document.createTextNode("");
new window.MutationObserver(Uu).observe(Yl, { characterData: !0 });
function Uu() {
  Fo = !1;
  const n = Xt.length;
  for (let t = 0; t < n; t++) {
    let e = Xt[t];
    if (e)
      try {
        e();
      } catch (r) {
        setTimeout(() => {
          throw r;
        });
      }
  }
  Xt.splice(0, n), Gl += n;
}
const ju = {
  /**
   * Enqueues a function called at microtask timing.
   *
   * @memberof microTask
   * @param {!Function=} callback Callback to run
   * @return {number} Handle used for canceling task
   */
  run(n) {
    return Fo || (Fo = !0, Yl.textContent = Hu++), Xt.push(n), Vu++;
  },
  /**
   * Cancels a previously enqueued `microTask` callback.
   *
   * @memberof microTask
   * @param {number} handle Handle returned from `run` of callback to cancel
   * @return {void}
   */
  cancel(n) {
    const t = n - Gl;
    if (t >= 0) {
      if (!Xt[t])
        throw new Error("invalid async handle: " + n);
      Xt[t] = null;
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
const qu = ju, Zl = me(
  /**
   * @template T
   * @param {function(new:T)} superClass Class to apply mixin to.
   * @return {function(new:T)} superClass with mixin applied.
   */
  (n) => {
    class t extends n {
      /**
       * Creates property accessors for the given property names.
       * @param {!Object} props Object whose keys are names of accessors.
       * @return {void}
       * @protected
       * @nocollapse
       */
      static createProperties(r) {
        const i = this.prototype;
        for (let s in r)
          s in i || i._createPropertyAccessor(s);
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
      static attributeNameForProperty(r) {
        return r.toLowerCase();
      }
      /**
       * Override point to provide a type to which to deserialize a value to
       * a given property.
       * @param {string} name Name of property
       *
       * @protected
       * @nocollapse
       */
      static typeForProperty(r) {
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
      _createPropertyAccessor(r, i) {
        this._addPropertyToAttributeMap(r), this.hasOwnProperty(JSCompiler_renameProperty("__dataHasAccessor", this)) || (this.__dataHasAccessor = Object.assign({}, this.__dataHasAccessor)), this.__dataHasAccessor[r] || (this.__dataHasAccessor[r] = !0, this._definePropertyAccessor(r, i));
      }
      /**
       * Adds the given `property` to a map matching attribute names
       * to property names, using `attributeNameForProperty`. This map is
       * used when deserializing attribute values to properties.
       *
       * @param {string} property Name of the property
       * @override
       */
      _addPropertyToAttributeMap(r) {
        this.hasOwnProperty(JSCompiler_renameProperty("__dataAttributes", this)) || (this.__dataAttributes = Object.assign({}, this.__dataAttributes));
        let i = this.__dataAttributes[r];
        return i || (i = this.constructor.attributeNameForProperty(r), this.__dataAttributes[i] = r), i;
      }
      /**
       * Defines a property accessor for the given property.
       * @param {string} property Name of the property
       * @param {boolean=} readOnly When true, no setter is created
       * @return {void}
       * @override
       */
      _definePropertyAccessor(r, i) {
        Object.defineProperty(this, r, {
          /* eslint-disable valid-jsdoc */
          /** @this {PropertiesChanged} */
          get() {
            return this.__data[r];
          },
          /** @this {PropertiesChanged} */
          set: i ? function() {
          } : function(s) {
            this._setPendingProperty(r, s, !0) && this._invalidateProperties();
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
        for (let r in this.__dataHasAccessor)
          this.hasOwnProperty(r) && (this.__dataInstanceProps = this.__dataInstanceProps || {}, this.__dataInstanceProps[r] = this[r], delete this[r]);
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
      _initializeInstanceProperties(r) {
        Object.assign(this, r);
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
      _setProperty(r, i) {
        this._setPendingProperty(r, i) && this._invalidateProperties();
      }
      /**
       * Returns the value for the given property.
       * @param {string} property Name of property
       * @return {*} Value for the given property
       * @protected
       * @override
       */
      _getProperty(r) {
        return this.__data[r];
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
      _setPendingProperty(r, i, s) {
        let l = this.__data[r], d = this._shouldPropertyChange(r, i, l);
        return d && (this.__dataPending || (this.__dataPending = {}, this.__dataOld = {}), this.__dataOld && !(r in this.__dataOld) && (this.__dataOld[r] = l), this.__data[r] = i, this.__dataPending[r] = i), d;
      }
      /* eslint-enable */
      /**
       * @param {string} property Name of the property
       * @return {boolean} Returns true if the property is pending.
       */
      _isPropertyPending(r) {
        return !!(this.__dataPending && this.__dataPending.hasOwnProperty(r));
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
        !this.__dataInvalid && this.__dataReady && (this.__dataInvalid = !0, qu.run(() => {
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
        const r = this.__data, i = this.__dataPending, s = this.__dataOld;
        this._shouldPropertiesChange(r, i, s) && (this.__dataPending = null, this.__dataOld = null, this._propertiesChanged(r, i, s)), this.__dataCounter--;
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
      _shouldPropertiesChange(r, i, s) {
        return !!i;
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
      _propertiesChanged(r, i, s) {
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
      _shouldPropertyChange(r, i, s) {
        return (
          // Strict equality check
          s !== i && // This ensures (old==NaN, value==NaN) always returns false
          (s === s || i === i)
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
      attributeChangedCallback(r, i, s, l) {
        i !== s && this._attributeToProperty(r, s), super.attributeChangedCallback && super.attributeChangedCallback(r, i, s, l);
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
      _attributeToProperty(r, i, s) {
        if (!this.__serializing) {
          const l = this.__dataAttributes, d = l && l[r] || r;
          this[d] = this._deserializeValue(i, s || this.constructor.typeForProperty(d));
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
      _propertyToAttribute(r, i, s) {
        this.__serializing = !0, s = arguments.length < 3 ? this[r] : s, this._valueToNodeAttribute(
          /** @type {!HTMLElement} */
          this,
          s,
          i || this.constructor.attributeNameForProperty(r)
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
      _valueToNodeAttribute(r, i, s) {
        const l = this._serializeValue(i);
        (s === "class" || s === "name" || s === "slot") && (r = /** @type {?Element} */
        St(r)), l === void 0 ? r.removeAttribute(s) : r.setAttribute(
          s,
          // Closure's type for `setAttribute`'s second parameter incorrectly
          // excludes `TrustedScript`.
          l === "" && window.trustedTypes ? (
            /** @type {?} */
            window.trustedTypes.emptyScript
          ) : l
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
      _serializeValue(r) {
        switch (typeof r) {
          case "boolean":
            return r ? "" : void 0;
          default:
            return r != null ? r.toString() : void 0;
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
      _deserializeValue(r, i) {
        switch (i) {
          case Boolean:
            return r !== null;
          case Number:
            return Number(r);
          default:
            return r;
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
const Xl = {};
let Ni = HTMLElement.prototype;
for (; Ni; ) {
  let n = Object.getOwnPropertyNames(Ni);
  for (let t = 0; t < n.length; t++)
    Xl[n[t]] = !0;
  Ni = Object.getPrototypeOf(Ni);
}
const Ku = window.trustedTypes ? (n) => trustedTypes.isHTML(n) || trustedTypes.isScript(n) || trustedTypes.isScriptURL(n) : () => !1;
function Wu(n, t) {
  if (!Xl[t]) {
    let e = n[t];
    e !== void 0 && (n.__data ? n._setPendingProperty(t, e) : (n.__dataProto ? n.hasOwnProperty(JSCompiler_renameProperty("__dataProto", n)) || (n.__dataProto = Object.create(n.__dataProto)) : n.__dataProto = {}, n.__dataProto[t] = e));
  }
}
const Gu = me((n) => {
  const t = Zl(n);
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
      let i = (
        /** @type {?} */
        this.observedAttributes
      );
      for (let s = 0; s < i.length; s++)
        this.prototype._createPropertyAccessor(Wl(i[s]));
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
    static attributeNameForProperty(i) {
      return fn(i);
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
    _initializeProtoProperties(i) {
      for (let s in i)
        this._setProperty(s, i[s]);
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
    _ensureAttribute(i, s) {
      const l = (
        /** @type {!HTMLElement} */
        this
      );
      l.hasAttribute(i) || this._valueToNodeAttribute(l, s, i);
    }
    /**
     * Overrides PropertiesChanged implemention to serialize objects as JSON.
     *
     * @param {*} value Property value to serialize.
     * @return {string | undefined} String serialized from the provided property
     *     value.
     * @override
     */
    _serializeValue(i) {
      switch (typeof i) {
        case "object":
          if (i instanceof Date)
            return i.toString();
          if (i) {
            if (Ku(i))
              return (
                /** @type {?} */
                i
              );
            try {
              return JSON.stringify(i);
            } catch {
              return "";
            }
          }
        default:
          return super._serializeValue(i);
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
    _deserializeValue(i, s) {
      let l;
      switch (s) {
        case Object:
          try {
            l = JSON.parse(
              /** @type {string} */
              i
            );
          } catch {
            l = i;
          }
          break;
        case Array:
          try {
            l = JSON.parse(
              /** @type {string} */
              i
            );
          } catch {
            l = null;
          }
          break;
        case Date:
          l = isNaN(i) ? String(i) : Number(i), l = new Date(l);
          break;
        default:
          l = super._deserializeValue(i, s);
          break;
      }
      return l;
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
    _definePropertyAccessor(i, s) {
      Wu(this, i), super._definePropertyAccessor(i, s);
    }
    /**
     * Returns true if this library created an accessor for the given property.
     *
     * @param {string} property Property name
     * @return {boolean} True if an accessor was created
     * @override
     */
    _hasAccessor(i) {
      return this.__dataHasAccessor && this.__dataHasAccessor[i];
    }
    /**
     * Returns true if the specified property has a pending change.
     *
     * @param {string} prop Property name
     * @return {boolean} True if property has a pending change
     * @protected
     * @override
     */
    _isPropertyPending(i) {
      return !!(this.__dataPending && i in this.__dataPending);
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
const Yu = {
  "dom-if": !0,
  "dom-repeat": !0
};
let Ra = !1, $a = !1;
function Zu() {
  if (!Ra) {
    Ra = !0;
    const n = document.createElement("textarea");
    n.placeholder = "a", $a = n.placeholder === n.textContent;
  }
  return $a;
}
function Xu(n) {
  Zu() && n.localName === "textarea" && n.placeholder && n.placeholder === n.textContent && (n.textContent = null);
}
const Ju = (() => {
  const n = window.trustedTypes && window.trustedTypes.createPolicy(
    "polymer-template-event-attribute-policy",
    {
      createScript: (t) => t
    }
  );
  return (t, e, r) => {
    const i = e.getAttribute(r);
    if (n && r.startsWith("on-")) {
      t.setAttribute(
        r,
        n.createScript(i, r)
      );
      return;
    }
    t.setAttribute(r, i);
  };
})();
function Qu(n) {
  let t = n.getAttribute("is");
  if (t && Yu[t]) {
    let e = n;
    for (e.removeAttribute("is"), n = e.ownerDocument.createElement(t), e.parentNode.replaceChild(n, e), n.appendChild(e); e.attributes.length; ) {
      const { name: r } = e.attributes[0];
      Ju(n, e, r), e.removeAttribute(r);
    }
  }
  return n;
}
function Jl(n, t) {
  let e = t.parentInfo && Jl(n, t.parentInfo);
  if (e) {
    for (let r = e.firstChild, i = 0; r; r = r.nextSibling)
      if (t.parentIndex === i++)
        return r;
  } else
    return n;
}
function eh(n, t, e, r) {
  r.id && (t[r.id] = e);
}
function th(n, t, e) {
  if (e.events && e.events.length)
    for (let r = 0, i = e.events, s; r < i.length && (s = i[r]); r++)
      n._addMethodEventListenerToNode(t, s.name, s.value, n);
}
function rh(n, t, e, r) {
  e.templateInfo && (t._templateInfo = e.templateInfo, t._parentTemplateInfo = r);
}
function ih(n, t, e) {
  return n = n._methodHost || n, function(i) {
    n[e] && n[e](i, i.detail);
  };
}
const nh = me(
  /**
   * @template T
   * @param {function(new:T)} superClass Class to apply mixin to.
   * @return {function(new:T)} superClass with mixin applied.
   */
  (n) => {
    class t extends n {
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
      static _parseTemplate(r, i) {
        if (!r._templateInfo) {
          let s = r._templateInfo = {};
          s.nodeInfoList = [], s.nestedTemplate = !!i, s.stripWhiteSpace = i && i.stripWhiteSpace || r.hasAttribute && r.hasAttribute("strip-whitespace"), this._parseTemplateContent(
            r,
            s,
            /** @type {?} */
            { parent: null }
          );
        }
        return r._templateInfo;
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
      static _parseTemplateContent(r, i, s) {
        return this._parseTemplateNode(r.content, i, s);
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
      static _parseTemplateNode(r, i, s) {
        let l = !1, d = (
          /** @type {!HTMLTemplateElement} */
          r
        );
        return d.localName == "template" && !d.hasAttribute("preserve-content") ? l = this._parseTemplateNestedTemplate(d, i, s) || l : d.localName === "slot" && (i.hasInsertionPoint = !0), Xu(d), d.firstChild && this._parseTemplateChildNodes(d, i, s), d.hasAttributes && d.hasAttributes() && (l = this._parseTemplateNodeAttributes(d, i, s) || l), l || s.noted;
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
      static _parseTemplateChildNodes(r, i, s) {
        if (!(r.localName === "script" || r.localName === "style"))
          for (let l = r.firstChild, d = 0, f; l; l = f) {
            if (l.localName == "template" && (l = Qu(l)), f = l.nextSibling, l.nodeType === Node.TEXT_NODE) {
              let g = f;
              for (; g && g.nodeType === Node.TEXT_NODE; )
                l.textContent += g.textContent, f = g.nextSibling, r.removeChild(g), g = f;
              if (i.stripWhiteSpace && !l.textContent.trim()) {
                r.removeChild(l);
                continue;
              }
            }
            let m = (
              /** @type {!NodeInfo} */
              { parentIndex: d, parentInfo: s }
            );
            this._parseTemplateNode(l, i, m) && (m.infoIndex = i.nodeInfoList.push(m) - 1), l.parentNode && d++;
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
      static _parseTemplateNestedTemplate(r, i, s) {
        let l = (
          /** @type {!HTMLTemplateElement} */
          r
        ), d = this._parseTemplate(l, i);
        return (d.content = l.content.ownerDocument.createDocumentFragment()).appendChild(l.content), s.templateInfo = d, !0;
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
      static _parseTemplateNodeAttributes(r, i, s) {
        let l = !1, d = Array.from(r.attributes);
        for (let f = d.length - 1, m; m = d[f]; f--)
          l = this._parseTemplateNodeAttribute(r, i, s, m.name, m.value) || l;
        return l;
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
      static _parseTemplateNodeAttribute(r, i, s, l, d) {
        return l.slice(0, 3) === "on-" ? (r.removeAttribute(l), s.events = s.events || [], s.events.push({
          name: l.slice(3),
          value: d
        }), !0) : l === "id" ? (s.id = d, !0) : !1;
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
      static _contentForTemplate(r) {
        let i = (
          /** @type {HTMLTemplateElementWithInfo} */
          r._templateInfo
        );
        return i && i.content || r.content;
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
      _stampTemplate(r, i) {
        r && !r.content && window.HTMLTemplateElement && HTMLTemplateElement.decorate && HTMLTemplateElement.decorate(r), i = i || this.constructor._parseTemplate(r);
        let s = i.nodeInfoList, l = i.content || r.content, d = (
          /** @type {DocumentFragment} */
          document.importNode(l, !0)
        );
        d.__noInsertionPoint = !i.hasInsertionPoint;
        let f = d.nodeList = new Array(s.length);
        d.$ = {};
        for (let m = 0, g = s.length, v; m < g && (v = s[m]); m++) {
          let z = f[m] = Jl(d, v);
          eh(this, d.$, z, v), rh(this, z, v, i), th(this, z, v);
        }
        return d = /** @type {!StampedTemplate} */
        d, d;
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
      _addMethodEventListenerToNode(r, i, s, l) {
        l = l || r;
        let d = ih(l, i, s);
        return this._addEventListenerToNode(r, i, d), d;
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
      _addEventListenerToNode(r, i, s) {
        r.addEventListener(i, s);
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
      _removeEventListenerFromNode(r, i, s) {
        r.removeEventListener(i, s);
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
let Wr = 0;
const Gr = [], Q = {
  COMPUTE: "__computeEffects",
  REFLECT: "__reflectEffects",
  NOTIFY: "__notifyEffects",
  PROPAGATE: "__propagateEffects",
  OBSERVE: "__observeEffects",
  READ_ONLY: "__readOnly"
}, Ql = "__computeInfo", oh = /[A-Z]/;
function uo(n, t, e) {
  let r = n[t];
  if (!r)
    r = n[t] = {};
  else if (!n.hasOwnProperty(t) && (r = n[t] = Object.create(n[t]), e))
    for (let i in r) {
      let s = r[i], l = r[i] = Array(s.length);
      for (let d = 0; d < s.length; d++)
        l[d] = s[d];
    }
  return r;
}
function $r(n, t, e, r, i, s) {
  if (t) {
    let l = !1;
    const d = Wr++;
    for (let f in e) {
      let m = i ? Nt(f) : f, g = t[m];
      if (g)
        for (let v = 0, z = g.length, B; v < z && (B = g[v]); v++)
          (!B.info || B.info.lastRun !== d) && (!i || ls(f, B.trigger)) && (B.info && (B.info.lastRun = d), B.fn(n, f, e, r, B.info, i, s), l = !0);
    }
    return l;
  }
  return !1;
}
function sh(n, t, e, r, i, s, l, d) {
  let f = !1, m = l ? Nt(r) : r, g = t[m];
  if (g)
    for (let v = 0, z = g.length, B; v < z && (B = g[v]); v++)
      (!B.info || B.info.lastRun !== e) && (!l || ls(r, B.trigger)) && (B.info && (B.info.lastRun = e), B.fn(n, r, i, s, B.info, l, d), f = !0);
  return f;
}
function ls(n, t) {
  if (t) {
    let e = (
      /** @type {string} */
      t.name
    );
    return e == n || !!(t.structured && Fu(e, n)) || !!(t.wildcard && en(e, n));
  } else
    return !0;
}
function Na(n, t, e, r, i) {
  let s = typeof i.method == "string" ? n[i.method] : i.method, l = i.property;
  s ? s.call(n, n.__data[l], r[l]) : i.dynamicFn;
}
function ah(n, t, e, r, i) {
  let s = n[Q.NOTIFY], l, d = Wr++;
  for (let m in t)
    t[m] && (s && sh(n, s, d, m, e, r, i) || i && lh(n, m, e)) && (l = !0);
  let f;
  l && (f = n.__dataHost) && f._invalidateProperties && f._invalidateProperties();
}
function lh(n, t, e) {
  let r = Nt(t);
  if (r !== t) {
    let i = fn(r) + "-changed";
    return ec(n, i, e[t], t), !0;
  }
  return !1;
}
function ec(n, t, e, r) {
  let i = {
    value: e,
    queueProperty: !0
  };
  r && (i.path = r), St(
    /** @type {!HTMLElement} */
    n
  ).dispatchEvent(new CustomEvent(t, { detail: i }));
}
function ch(n, t, e, r, i, s) {
  let d = (s ? Nt(t) : t) != t ? t : null, f = d ? ke(n, d) : n.__data[t];
  d && f === void 0 && (f = e[t]), ec(n, i.eventName, f, d);
}
function dh(n, t, e, r, i) {
  let s, l = (
    /** @type {Object} */
    n.detail
  ), d = l && l.path;
  d ? (r = tn(e, r, d), s = l && l.value) : s = n.currentTarget[e], s = i ? !s : s, (!t[Q.READ_ONLY] || !t[Q.READ_ONLY][r]) && t._setPendingPropertyOrPath(r, s, !0, !!d) && (!l || !l.queueProperty) && t._invalidateProperties();
}
function uh(n, t, e, r, i) {
  let s = n.__data[t];
  Qi && (s = Qi(
    s,
    i.attrName,
    "attribute",
    /** @type {Node} */
    n
  )), n._propertyToAttribute(t, i.attrName, s);
}
function hh(n, t, e, r) {
  let i = n[Q.COMPUTE];
  if (i)
    if (Su) {
      Wr++;
      const s = ph(n), l = [];
      for (let f in t)
        Da(f, i, l, s, r);
      let d;
      for (; d = l.shift(); )
        tc(n, "", t, e, d) && Da(d.methodInfo, i, l, s, r);
      Object.assign(
        /** @type {!Object} */
        e,
        n.__dataOld
      ), Object.assign(
        /** @type {!Object} */
        t,
        n.__dataPending
      ), n.__dataPending = null;
    } else {
      let s = t;
      for (; $r(n, i, s, e, r); )
        Object.assign(
          /** @type {!Object} */
          e,
          n.__dataOld
        ), Object.assign(
          /** @type {!Object} */
          t,
          n.__dataPending
        ), s = n.__dataPending, n.__dataPending = null;
    }
}
const fh = (n, t, e) => {
  let r = 0, i = t.length - 1, s = -1;
  for (; r <= i; ) {
    const l = r + i >> 1, d = e.get(t[l].methodInfo) - e.get(n.methodInfo);
    if (d < 0)
      r = l + 1;
    else if (d > 0)
      i = l - 1;
    else {
      s = l;
      break;
    }
  }
  s < 0 && (s = i + 1), t.splice(s, 0, n);
}, Da = (n, t, e, r, i) => {
  const s = i ? Nt(n) : n, l = t[s];
  if (l)
    for (let d = 0; d < l.length; d++) {
      const f = l[d];
      f.info.lastRun !== Wr && (!i || ls(n, f.trigger)) && (f.info.lastRun = Wr, fh(f.info, e, r));
    }
};
function ph(n) {
  let t = n.constructor.__orderedComputedDeps;
  if (!t) {
    t = /* @__PURE__ */ new Map();
    const e = n[Q.COMPUTE];
    let { counts: r, ready: i, total: s } = _h(n), l;
    for (; l = i.shift(); ) {
      t.set(l, t.size);
      const d = e[l];
      d && d.forEach((f) => {
        const m = f.info.methodInfo;
        --s, --r[m] === 0 && i.push(m);
      });
    }
    if (s !== 0) {
      const d = (
        /** @type {HTMLElement} */
        n
      );
    }
    n.constructor.__orderedComputedDeps = t;
  }
  return t;
}
function _h(n) {
  const t = n[Ql], e = {}, r = n[Q.COMPUTE], i = [];
  let s = 0;
  for (let l in t) {
    const d = t[l];
    s += e[l] = d.args.filter((f) => !f.literal).length + (d.dynamicFn ? 1 : 0);
  }
  for (let l in r)
    t[l] || i.push(l);
  return { counts: e, ready: i, total: s };
}
function tc(n, t, e, r, i) {
  let s = Lo(n, t, e, r, i);
  if (s === Gr)
    return !1;
  let l = i.methodInfo;
  return n.__dataHasAccessor && n.__dataHasAccessor[l] ? n._setPendingProperty(l, s, !0) : (n[l] = s, !1);
}
function mh(n, t, e) {
  let r = n.__dataLinkedPaths;
  if (r) {
    let i;
    for (let s in r) {
      let l = r[s];
      en(s, t) ? (i = tn(s, l, t), n._setPendingPropertyOrPath(i, e, !0, !0)) : en(l, t) && (i = tn(l, s, t), n._setPendingPropertyOrPath(i, e, !0, !0));
    }
  }
}
function ho(n, t, e, r, i, s, l) {
  e.bindings = e.bindings || [];
  let d = { kind: r, target: i, parts: s, literal: l, isCompound: s.length !== 1 };
  if (e.bindings.push(d), xh(d)) {
    let { event: m, negate: g } = d.parts[0];
    d.listenerEvent = m || fn(i) + "-changed", d.listenerNegate = g;
  }
  let f = t.nodeInfoList.length;
  for (let m = 0; m < d.parts.length; m++) {
    let g = d.parts[m];
    g.compoundIndex = m, gh(n, t, d, g, f);
  }
}
function gh(n, t, e, r, i) {
  if (!r.literal && !(e.kind === "attribute" && e.target[0] === "-")) {
    let s = r.dependencies, l = { index: i, binding: e, part: r, evaluator: n };
    for (let d = 0; d < s.length; d++) {
      let f = s[d];
      typeof f == "string" && (f = ic(f), f.wildcard = !0), n._addTemplatePropertyEffect(t, f.rootProperty, {
        fn: bh,
        info: l,
        trigger: f
      });
    }
  }
}
function bh(n, t, e, r, i, s, l) {
  let d = l[i.index], f = i.binding, m = i.part;
  if (s && m.source && t.length > m.source.length && f.kind == "property" && !f.isCompound && d.__isPropertyEffectsClient && d.__dataHasAccessor && d.__dataHasAccessor[f.target]) {
    let g = e[t];
    t = tn(m.source, f.target, t), d._setPendingPropertyOrPath(t, g, !1, !0) && n._enqueueClient(d);
  } else {
    let g = i.evaluator._evaluateBinding(n, m, t, e, r, s);
    g !== Gr && vh(n, d, f, m, g);
  }
}
function vh(n, t, e, r, i) {
  if (i = yh(t, i, e, r), Qi && (i = Qi(i, e.target, e.kind, t)), e.kind == "attribute")
    n._valueToNodeAttribute(
      /** @type {Element} */
      t,
      i,
      e.target
    );
  else {
    let s = e.target;
    t.__isPropertyEffectsClient && t.__dataHasAccessor && t.__dataHasAccessor[s] ? (!t[Q.READ_ONLY] || !t[Q.READ_ONLY][s]) && t._setPendingProperty(s, i) && n._enqueueClient(t) : n._setUnmanagedPropertyToNode(t, s, i);
  }
}
function yh(n, t, e, r) {
  if (e.isCompound) {
    let i = n.__dataCompoundStorage[e.target];
    i[r.compoundIndex] = t, t = i.join("");
  }
  return e.kind !== "attribute" && (e.target === "textContent" || e.target === "value" && (n.localName === "input" || n.localName === "textarea")) && (t = t ?? ""), t;
}
function xh(n) {
  return !!n.target && n.kind != "attribute" && n.kind != "text" && !n.isCompound && n.parts[0].mode === "{";
}
function wh(n, t) {
  let { nodeList: e, nodeInfoList: r } = t;
  if (r.length)
    for (let i = 0; i < r.length; i++) {
      let s = r[i], l = e[i], d = s.bindings;
      if (d)
        for (let f = 0; f < d.length; f++) {
          let m = d[f];
          Ch(l, m), Eh(l, n, m);
        }
      l.__dataHost = n;
    }
}
function Ch(n, t) {
  if (t.isCompound) {
    let e = n.__dataCompoundStorage || (n.__dataCompoundStorage = {}), r = t.parts, i = new Array(r.length);
    for (let l = 0; l < r.length; l++)
      i[l] = r[l].literal;
    let s = t.target;
    e[s] = i, t.literal && t.kind == "property" && (s === "className" && (n = St(n)), n[s] = t.literal);
  }
}
function Eh(n, t, e) {
  if (e.listenerEvent) {
    let r = e.parts[0];
    n.addEventListener(e.listenerEvent, function(i) {
      dh(i, t, e.target, r.source, r.negate);
    });
  }
}
function Ma(n, t, e, r, i, s) {
  s = t.static || s && (typeof s != "object" || s[t.methodName]);
  let l = {
    methodName: t.methodName,
    args: t.args,
    methodInfo: i,
    dynamicFn: s
  };
  for (let d = 0, f; d < t.args.length && (f = t.args[d]); d++)
    f.literal || n._addPropertyEffect(f.rootProperty, e, {
      fn: r,
      info: l,
      trigger: f
    });
  return s && n._addPropertyEffect(t.methodName, e, {
    fn: r,
    info: l
  }), l;
}
function Lo(n, t, e, r, i) {
  let s = n._methodHost || n, l = s[i.methodName];
  if (l) {
    let d = n._marshalArgs(i.args, t, e);
    return d === Gr ? Gr : l.apply(s, d);
  } else i.dynamicFn;
}
const Ah = [], rc = "(?:[a-zA-Z_$][\\w.:$\\-*]*)", kh = "(?:[-+]?[0-9]*\\.?[0-9]+(?:[eE][-+]?[0-9]+)?)", Ph = "(?:'(?:[^'\\\\]|\\\\.)*')", Sh = '(?:"(?:[^"\\\\]|\\\\.)*")', Ih = "(?:" + Ph + "|" + Sh + ")", Fa = "(?:(" + rc + "|" + kh + "|" + Ih + ")\\s*)", Th = "(?:" + Fa + "(?:,\\s*" + Fa + ")*)", Oh = "(?:\\(\\s*(?:" + Th + "?)\\)\\s*)", zh = "(" + rc + "\\s*" + Oh + "?)", Rh = "(\\[\\[|{{)\\s*", $h = "(?:]]|}})", Nh = "(?:(!)\\s*)?", Dh = Rh + Nh + zh + $h, La = new RegExp(Dh, "g");
function Ba(n) {
  let t = "";
  for (let e = 0; e < n.length; e++) {
    let r = n[e].literal;
    t += r || "";
  }
  return t;
}
function fo(n) {
  let t = n.match(/([^\s]+?)\(([\s\S]*)\)/);
  if (t) {
    let r = { methodName: t[1], static: !0, args: Ah };
    if (t[2].trim()) {
      let i = t[2].replace(/\\,/g, "&comma;").split(",");
      return Mh(i, r);
    } else
      return r;
  }
  return null;
}
function Mh(n, t) {
  return t.args = n.map(function(e) {
    let r = ic(e);
    return r.literal || (t.static = !1), r;
  }, this), t;
}
function ic(n) {
  let t = n.trim().replace(/&comma;/g, ",").replace(/\\(.)/g, "$1"), e = {
    name: t,
    value: "",
    literal: !1
  }, r = t[0];
  switch (r === "-" && (r = t[1]), r >= "0" && r <= "9" && (r = "#"), r) {
    case "'":
    case '"':
      e.value = t.slice(1, -1), e.literal = !0;
      break;
    case "#":
      e.value = Number(t), e.literal = !0;
      break;
  }
  return e.literal || (e.rootProperty = Nt(t), e.structured = Mo(t), e.structured && (e.wildcard = t.slice(-2) == ".*", e.wildcard && (e.name = t.slice(0, -2)))), e;
}
function Va(n, t, e) {
  let r = ke(n, e);
  return r === void 0 && (r = t[e]), r;
}
function nc(n, t, e, r) {
  const i = { indexSplices: r };
  Do && !n._overrideLegacyUndefined && (t.splices = i), n.notifyPath(e + ".splices", i), n.notifyPath(e + ".length", t.length), Do && !n._overrideLegacyUndefined && (i.indexSplices = []);
}
function Sr(n, t, e, r, i, s) {
  nc(n, t, e, [{
    index: r,
    addedCount: i,
    removed: s,
    object: t,
    type: "splice"
  }]);
}
function Fh(n) {
  return n[0].toUpperCase() + n.substring(1);
}
const Lh = me((n) => {
  const t = nh(Gu(n));
  class e extends t {
    constructor() {
      super(), this.__isPropertyEffectsClient = !0, this.__dataClientsReady, this.__dataPendingClients, this.__dataToNotify, this.__dataLinkedPaths, this.__dataHasPaths, this.__dataCompoundStorage, this.__dataHost, this.__dataTemp, this.__dataClientsInitialized, this.__data, this.__dataPending, this.__dataOld, this.__computeEffects, this.__computeInfo, this.__reflectEffects, this.__notifyEffects, this.__propagateEffects, this.__observeEffects, this.__readOnly, this.__templateInfo, this._overrideLegacyUndefined;
    }
    get PROPERTY_EFFECT_TYPES() {
      return Q;
    }
    /**
     * @override
     * @return {void}
     */
    _initializeProperties() {
      super._initializeProperties(), this._registerHost(), this.__dataClientsReady = !1, this.__dataPendingClients = null, this.__dataToNotify = null, this.__dataLinkedPaths = null, this.__dataHasPaths = !1, this.__dataCompoundStorage = this.__dataCompoundStorage || null, this.__dataHost = this.__dataHost || null, this.__dataTemp = {}, this.__dataClientsInitialized = !1;
    }
    _registerHost() {
      if (Ir.length) {
        let i = Ir[Ir.length - 1];
        i._enqueueClient(this), this.__dataHost = i;
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
    _initializeProtoProperties(i) {
      this.__data = Object.create(i), this.__dataPending = Object.create(i), this.__dataOld = {};
    }
    /**
     * Overrides `PropertyAccessors` implementation to avoid setting
     * `_setProperty`'s `shouldNotify: true`.
     *
     * @override
     * @param {Object} props Properties to initialize on the instance
     * @return {void}
     */
    _initializeInstanceProperties(i) {
      let s = this[Q.READ_ONLY];
      for (let l in i)
        (!s || !s[l]) && (this.__dataPending = this.__dataPending || {}, this.__dataOld = this.__dataOld || {}, this.__data[l] = this.__dataPending[l] = i[l]);
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
    _addPropertyEffect(i, s, l) {
      this._createPropertyAccessor(i, s == Q.READ_ONLY);
      let d = uo(this, s, !0)[i];
      d || (d = this[s][i] = []), d.push(l);
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
    _removePropertyEffect(i, s, l) {
      let d = uo(this, s, !0)[i], f = d.indexOf(l);
      f >= 0 && d.splice(f, 1);
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
    _hasPropertyEffect(i, s) {
      let l = this[s];
      return !!(l && l[i]);
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
    _hasReadOnlyEffect(i) {
      return this._hasPropertyEffect(i, Q.READ_ONLY);
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
    _hasNotifyEffect(i) {
      return this._hasPropertyEffect(i, Q.NOTIFY);
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
    _hasReflectEffect(i) {
      return this._hasPropertyEffect(i, Q.REFLECT);
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
    _hasComputedEffect(i) {
      return this._hasPropertyEffect(i, Q.COMPUTE);
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
    _setPendingPropertyOrPath(i, s, l, d) {
      if (d || Nt(Array.isArray(i) ? i[0] : i) !== i) {
        if (!d) {
          let f = ke(this, i);
          if (i = /** @type {string} */
          za(this, i, s), !i || !super._shouldPropertyChange(i, s, f))
            return !1;
        }
        if (this.__dataHasPaths = !0, this._setPendingProperty(
          /**@type{string}*/
          i,
          s,
          l
        ))
          return mh(
            this,
            /**@type{string}*/
            i,
            s
          ), !0;
      } else {
        if (this.__dataHasAccessor && this.__dataHasAccessor[i])
          return this._setPendingProperty(
            /**@type{string}*/
            i,
            s,
            l
          );
        this[i] = s;
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
    _setUnmanagedPropertyToNode(i, s, l) {
      (l !== i[s] || typeof l == "object") && (s === "className" && (i = /** @type {!Node} */
      St(i)), i[s] = l);
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
    _setPendingProperty(i, s, l) {
      let d = this.__dataHasPaths && Mo(i), f = d ? this.__dataTemp : this.__data;
      return this._shouldPropertyChange(i, s, f[i]) ? (this.__dataPending || (this.__dataPending = {}, this.__dataOld = {}), i in this.__dataOld || (this.__dataOld[i] = this.__data[i]), d ? this.__dataTemp[i] = s : this.__data[i] = s, this.__dataPending[i] = s, (d || this[Q.NOTIFY] && this[Q.NOTIFY][i]) && (this.__dataToNotify = this.__dataToNotify || {}, this.__dataToNotify[i] = l), !0) : !1;
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
    _setProperty(i, s) {
      this._setPendingProperty(i, s, !0) && this._invalidateProperties();
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
    _enqueueClient(i) {
      this.__dataPendingClients = this.__dataPendingClients || [], i !== this && this.__dataPendingClients.push(i);
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
      let i = this.__dataPendingClients;
      if (i) {
        this.__dataPendingClients = null;
        for (let s = 0; s < i.length; s++) {
          let l = i[s];
          l.__dataEnabled ? l.__dataPending && l._flushProperties() : l._enableProperties();
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
    setProperties(i, s) {
      for (let l in i)
        (s || !this[Q.READ_ONLY] || !this[Q.READ_ONLY][l]) && this._setPendingPropertyOrPath(l, i[l], !0);
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
    _propertiesChanged(i, s, l) {
      let d = this.__dataHasPaths;
      this.__dataHasPaths = !1;
      let f;
      hh(this, s, l, d), f = this.__dataToNotify, this.__dataToNotify = null, this._propagatePropertyChanges(s, l, d), this._flushClients(), $r(this, this[Q.REFLECT], s, l, d), $r(this, this[Q.OBSERVE], s, l, d), f && ah(this, f, s, l, d), this.__dataCounter == 1 && (this.__dataTemp = {});
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
    _propagatePropertyChanges(i, s, l) {
      this[Q.PROPAGATE] && $r(this, this[Q.PROPAGATE], i, s, l), this.__templateInfo && this._runEffectsForTemplate(this.__templateInfo, i, s, l);
    }
    _runEffectsForTemplate(i, s, l, d) {
      const f = (m, g) => {
        $r(
          this,
          i.propertyEffects,
          m,
          l,
          g,
          i.nodeList
        );
        for (let v = i.firstChild; v; v = v.nextSibling)
          this._runEffectsForTemplate(v, m, l, g);
      };
      i.runEffects ? i.runEffects(f, s, d) : f(s, d);
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
    linkPaths(i, s) {
      i = Rr(i), s = Rr(s), this.__dataLinkedPaths = this.__dataLinkedPaths || {}, this.__dataLinkedPaths[i] = s;
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
    unlinkPaths(i) {
      i = Rr(i), this.__dataLinkedPaths && delete this.__dataLinkedPaths[i];
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
    notifySplices(i, s) {
      let l = { path: "" }, d = (
        /** @type {Array} */
        ke(this, i, l)
      );
      nc(this, d, l.path, s);
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
    get(i, s) {
      return ke(s || this, i);
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
    set(i, s, l) {
      l ? za(l, i, s) : (!this[Q.READ_ONLY] || !this[Q.READ_ONLY][
        /** @type {string} */
        i
      ]) && this._setPendingPropertyOrPath(i, s, !0) && this._invalidateProperties();
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
    push(i, ...s) {
      let l = { path: "" }, d = (
        /** @type {Array}*/
        ke(this, i, l)
      ), f = d.length, m = d.push(...s);
      return s.length && Sr(this, d, l.path, f, s.length, []), m;
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
    pop(i) {
      let s = { path: "" }, l = (
        /** @type {Array} */
        ke(this, i, s)
      ), d = !!l.length, f = l.pop();
      return d && Sr(this, l, s.path, l.length, 0, [f]), f;
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
    splice(i, s, l, ...d) {
      let f = { path: "" }, m = (
        /** @type {Array} */
        ke(this, i, f)
      );
      s < 0 ? s = m.length - Math.floor(-s) : s && (s = Math.floor(s));
      let g;
      return arguments.length === 2 ? g = m.splice(s) : g = m.splice(s, l, ...d), (d.length || g.length) && Sr(this, m, f.path, s, d.length, g), g;
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
    shift(i) {
      let s = { path: "" }, l = (
        /** @type {Array} */
        ke(this, i, s)
      ), d = !!l.length, f = l.shift();
      return d && Sr(this, l, s.path, 0, 0, [f]), f;
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
    unshift(i, ...s) {
      let l = { path: "" }, d = (
        /** @type {Array} */
        ke(this, i, l)
      ), f = d.unshift(...s);
      return s.length && Sr(this, d, l.path, 0, s.length, []), f;
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
    notifyPath(i, s) {
      let l;
      if (arguments.length == 1) {
        let d = { path: "" };
        s = ke(this, i, d), l = d.path;
      } else Array.isArray(i) ? l = Rr(i) : l = /** @type{string} */
      i;
      this._setPendingPropertyOrPath(l, s, !0, !0) && this._invalidateProperties();
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
    _createReadOnlyProperty(i, s) {
      this._addPropertyEffect(i, Q.READ_ONLY), s && (this["_set" + Fh(i)] = /** @this {PropertyEffects} */
      function(l) {
        this._setProperty(i, l);
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
    _createPropertyObserver(i, s, l) {
      let d = { property: i, method: s, dynamicFn: !!l };
      this._addPropertyEffect(i, Q.OBSERVE, {
        fn: Na,
        info: d,
        trigger: { name: i }
      }), l && this._addPropertyEffect(
        /** @type {string} */
        s,
        Q.OBSERVE,
        {
          fn: Na,
          info: d,
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
    _createMethodObserver(i, s) {
      let l = fo(i);
      if (!l)
        throw new Error("Malformed observer expression '" + i + "'");
      Ma(this, l, Q.OBSERVE, Lo, null, s);
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
    _createNotifyingProperty(i) {
      this._addPropertyEffect(i, Q.NOTIFY, {
        fn: ch,
        info: {
          eventName: fn(i) + "-changed",
          property: i
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
    _createReflectedProperty(i) {
      let s = this.constructor.attributeNameForProperty(i);
      s[0] === "-" || this._addPropertyEffect(i, Q.REFLECT, {
        fn: uh,
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
    _createComputedProperty(i, s, l) {
      let d = fo(s);
      if (!d)
        throw new Error("Malformed computed expression '" + s + "'");
      const f = Ma(this, d, Q.COMPUTE, tc, i, l);
      uo(this, Ql)[i] = f;
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
    _marshalArgs(i, s, l) {
      const d = this.__data, f = [];
      for (let m = 0, g = i.length; m < g; m++) {
        let { name: v, structured: z, wildcard: B, value: H, literal: ee } = i[m];
        if (!ee)
          if (B) {
            const se = en(v, s), ae = Va(d, l, se ? s : v);
            H = {
              path: se ? s : v,
              value: ae,
              base: se ? ke(d, v) : ae
            };
          } else
            H = z ? Va(d, l, v) : d[v];
        if (Do && !this._overrideLegacyUndefined && H === void 0 && i.length > 1)
          return Gr;
        f[m] = H;
      }
      return f;
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
    static addPropertyEffect(i, s, l) {
      this.prototype._addPropertyEffect(i, s, l);
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
    static createPropertyObserver(i, s, l) {
      this.prototype._createPropertyObserver(i, s, l);
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
    static createMethodObserver(i, s) {
      this.prototype._createMethodObserver(i, s);
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
    static createNotifyingProperty(i) {
      this.prototype._createNotifyingProperty(i);
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
    static createReadOnlyProperty(i, s) {
      this.prototype._createReadOnlyProperty(i, s);
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
    static createReflectedProperty(i) {
      this.prototype._createReflectedProperty(i);
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
    static createComputedProperty(i, s, l) {
      this.prototype._createComputedProperty(i, s, l);
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
    static bindTemplate(i) {
      return this.prototype._bindTemplate(i);
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
    _bindTemplate(i, s) {
      let l = this.constructor._parseTemplate(i), d = this.__preBoundTemplateInfo == l;
      if (!d)
        for (let f in l.propertyEffects)
          this._createPropertyAccessor(f);
      if (s)
        if (l = /** @type {!TemplateInfo} */
        Object.create(l), l.wasPreBound = d, !this.__templateInfo)
          this.__templateInfo = l;
        else {
          const f = i._parentTemplateInfo || this.__templateInfo, m = f.lastChild;
          l.parent = f, f.lastChild = l, l.previousSibling = m, m ? m.nextSibling = l : f.firstChild = l;
        }
      else
        this.__preBoundTemplateInfo = l;
      return l;
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
    static _addTemplatePropertyEffect(i, s, l) {
      let d = i.hostProps = i.hostProps || {};
      d[s] = !0;
      let f = i.propertyEffects = i.propertyEffects || {};
      (f[s] = f[s] || []).push(l);
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
    _stampTemplate(i, s) {
      s = s || /** @type {!TemplateInfo} */
      this._bindTemplate(i, !0), Ir.push(this);
      let l = super._stampTemplate(i, s);
      if (Ir.pop(), s.nodeList = l.nodeList, !s.wasPreBound) {
        let d = s.childNodes = [];
        for (let f = l.firstChild; f; f = f.nextSibling)
          d.push(f);
      }
      return l.templateInfo = s, wh(this, s), this.__dataClientsReady && (this._runEffectsForTemplate(s, this.__data, null, !1), this._flushClients()), l;
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
    _removeBoundDom(i) {
      const s = i.templateInfo, { previousSibling: l, nextSibling: d, parent: f } = s;
      l ? l.nextSibling = d : f && (f.firstChild = d), d ? d.previousSibling = l : f && (f.lastChild = l), s.nextSibling = s.previousSibling = null;
      let m = s.childNodes;
      for (let g = 0; g < m.length; g++) {
        let v = m[g];
        St(St(v).parentNode).removeChild(v);
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
    static _parseTemplateNode(i, s, l) {
      let d = t._parseTemplateNode.call(
        this,
        i,
        s,
        l
      );
      if (i.nodeType === Node.TEXT_NODE) {
        let f = this._parseBindings(i.textContent, s);
        f && (i.textContent = Ba(f) || " ", ho(this, s, l, "text", "textContent", f), d = !0);
      }
      return d;
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
    static _parseTemplateNodeAttribute(i, s, l, d, f) {
      let m = this._parseBindings(f, s);
      if (m) {
        let g = d, v = "property";
        oh.test(d) ? v = "attribute" : d[d.length - 1] == "$" && (d = d.slice(0, -1), v = "attribute");
        let z = Ba(m);
        return z && v == "attribute" && (d == "class" && i.hasAttribute("class") && (z += " " + i.getAttribute(d)), i.setAttribute(d, z)), v == "attribute" && g == "disable-upgrade$" && i.setAttribute(d, ""), i.localName === "input" && g === "value" && i.setAttribute(g, ""), i.removeAttribute(g), v === "property" && (d = Wl(d)), ho(this, s, l, v, d, m, z), !0;
      } else
        return t._parseTemplateNodeAttribute.call(
          this,
          i,
          s,
          l,
          d,
          f
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
    static _parseTemplateNestedTemplate(i, s, l) {
      let d = t._parseTemplateNestedTemplate.call(
        this,
        i,
        s,
        l
      );
      const f = i.parentNode, m = l.templateInfo, g = f.localName === "dom-if", v = f.localName === "dom-repeat";
      Pa && (g || v) && (f.removeChild(i), l = l.parentInfo, l.templateInfo = m, l.noted = !0, d = !1);
      let z = m.hostProps;
      if (Iu && g)
        z && (s.hostProps = Object.assign(s.hostProps || {}, z), Pa || (l.parentInfo.noted = !0));
      else {
        let B = "{";
        for (let H in z) {
          let ee = [{ mode: B, source: H, dependencies: [H], hostProp: !0 }];
          ho(this, s, l, "property", "_host_" + H, ee);
        }
      }
      return d;
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
    static _parseBindings(i, s) {
      let l = [], d = 0, f;
      for (; (f = La.exec(i)) !== null; ) {
        f.index > d && l.push({ literal: i.slice(d, f.index) });
        let m = f[1][0], g = !!f[2], v = f[3].trim(), z = !1, B = "", H = -1;
        m == "{" && (H = v.indexOf("::")) > 0 && (B = v.substring(H + 2), v = v.substring(0, H), z = !0);
        let ee = fo(v), se = [];
        if (ee) {
          let { args: ae, methodName: re } = ee;
          for (let we = 0; we < ae.length; we++) {
            let ue = ae[we];
            ue.literal || se.push(ue);
          }
          let Oe = s.dynamicFns;
          (Oe && Oe[re] || ee.static) && (se.push(re), ee.dynamicFn = !0);
        } else
          se.push(v);
        l.push({
          source: v,
          mode: m,
          negate: g,
          customEvent: z,
          signature: ee,
          dependencies: se,
          event: B
        }), d = La.lastIndex;
      }
      if (d && d < i.length) {
        let m = i.substring(d);
        m && l.push({
          literal: m
        });
      }
      return l.length ? l : null;
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
    static _evaluateBinding(i, s, l, d, f, m) {
      let g;
      return s.signature ? g = Lo(i, l, d, f, s.signature) : l != s.source ? g = ke(i, s.source) : m && Mo(l) ? g = ke(i, l) : g = i.__data[l], s.negate && (g = !g), g;
    }
  }
  return e;
}), Ir = [];
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
function Bh(n) {
  const t = {};
  for (let e in n) {
    const r = n[e];
    t[e] = typeof r == "function" ? { type: r } : r;
  }
  return t;
}
const Vh = me((n) => {
  const t = Zl(n);
  function e(s) {
    const l = Object.getPrototypeOf(s);
    return l.prototype instanceof i ? (
      /** @type {!PropertiesMixinConstructor} */
      l
    ) : null;
  }
  function r(s) {
    if (!s.hasOwnProperty(JSCompiler_renameProperty("__ownProperties", s))) {
      let l = null;
      if (s.hasOwnProperty(JSCompiler_renameProperty("properties", s))) {
        const d = s.properties;
        d && (l = Bh(d));
      }
      s.__ownProperties = l;
    }
    return s.__ownProperties;
  }
  class i extends t {
    /**
     * Implements standard custom elements getter to observes the attributes
     * listed in `properties`.
     * @suppress {missingProperties} Interfaces in closure do not inherit statics, but classes do
     * @nocollapse
     */
    static get observedAttributes() {
      if (!this.hasOwnProperty(JSCompiler_renameProperty("__observedAttributes", this))) {
        this.prototype;
        const l = this._properties;
        this.__observedAttributes = l ? Object.keys(l).map((d) => this.prototype._addPropertyToAttributeMap(d)) : [];
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
        const l = e(
          /** @type {!PropertiesMixinConstructor} */
          this
        );
        l && l.finalize(), this.__finalized = !0, this._finalizeClass();
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
      const l = r(
        /** @type {!PropertiesMixinConstructor} */
        this
      );
      l && this.createProperties(l);
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
        const l = e(
          /** @type {!PropertiesMixinConstructor} */
          this
        );
        this.__properties = Object.assign(
          {},
          l && l._properties,
          r(
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
    static typeForProperty(l) {
      const d = this._properties[l];
      return d && d.type;
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
  return i;
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
const Hh = "3.5.1", Ha = window.ShadyCSS && window.ShadyCSS.cssBuild, Uh = me((n) => {
  const t = Vh(Lh(n));
  function e(f) {
    if (!f.hasOwnProperty(
      JSCompiler_renameProperty("__propertyDefaults", f)
    )) {
      f.__propertyDefaults = null;
      let m = f._properties;
      for (let g in m) {
        let v = m[g];
        "value" in v && (f.__propertyDefaults = f.__propertyDefaults || {}, f.__propertyDefaults[g] = v);
      }
    }
    return f.__propertyDefaults;
  }
  function r(f) {
    return f.hasOwnProperty(
      JSCompiler_renameProperty("__ownObservers", f)
    ) || (f.__ownObservers = f.hasOwnProperty(
      JSCompiler_renameProperty("observers", f)
    ) ? (
      /** @type {PolymerElementConstructor} */
      f.observers
    ) : null), f.__ownObservers;
  }
  function i(f, m, g, v) {
    g.computed && (g.readOnly = !0), g.computed && (f._hasReadOnlyEffect(m) || f._createComputedProperty(m, g.computed, v)), g.readOnly && !f._hasReadOnlyEffect(m) ? f._createReadOnlyProperty(m, !g.computed) : g.readOnly === !1 && f._hasReadOnlyEffect(m), g.reflectToAttribute && !f._hasReflectEffect(m) ? f._createReflectedProperty(m) : g.reflectToAttribute === !1 && f._hasReflectEffect(m), g.notify && !f._hasNotifyEffect(m) ? f._createNotifyingProperty(m) : g.notify === !1 && f._hasNotifyEffect(m), g.observer && f._createPropertyObserver(m, g.observer, v[g.observer]), f._addPropertyToAttributeMap(m);
  }
  function s(f, m, g, v) {
    if (!Ha) {
      const z = m.content.querySelectorAll("style"), B = jl(m), H = Mu(g), ee = m.content.firstElementChild;
      for (let ae = 0; ae < H.length; ae++) {
        let re = H[ae];
        re.textContent = f._processStyleText(re.textContent, v), m.content.insertBefore(re, ee);
      }
      let se = 0;
      for (let ae = 0; ae < B.length; ae++) {
        let re = B[ae], Oe = z[se];
        Oe !== re ? (re = re.cloneNode(!0), Oe.parentNode.insertBefore(re, Oe)) : se++, re.textContent = f._processStyleText(re.textContent, v);
      }
    }
    if (window.ShadyCSS && window.ShadyCSS.prepareTemplate(m, g), Tu && Ha && wu) {
      const z = m.content.querySelectorAll("style");
      if (z) {
        let B = "";
        Array.from(z).forEach((H) => {
          B += H.textContent, H.parentNode.removeChild(H);
        }), f._styleSheet = new CSSStyleSheet(), f._styleSheet.replaceSync(B);
      }
    }
  }
  function l(f) {
    let m = null;
    if (f && (!No || Eu) && (m = /** @type {?HTMLTemplateElement} */
    Kr.import(f, "template"), No && !m))
      throw new Error(`strictTemplatePolicy: expecting dom-module or null template for ${f}`);
    return m;
  }
  class d extends t {
    /**
     * Current Polymer version in Semver notation.
     * @type {string} Semver notation of the current version of Polymer.
     * @nocollapse
     */
    static get polymerElementVersion() {
      return Hh;
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
      const m = r(this);
      m && this.createObservers(m, this._properties), this._prepareTemplate();
    }
    /** @nocollapse */
    static _prepareTemplate() {
      let m = (
        /** @type {PolymerElementConstructor} */
        this.template
      );
      m && (typeof m == "string" ? m = null : Au || (m = m.cloneNode(!0))), this.prototype._template = m;
    }
    /**
     * Override of PropertiesChanged createProperties to create accessors
     * and property effects for all of the properties.
     * @param {!Object} props .
     * @return {void}
     * @protected
     * @nocollapse
     */
    static createProperties(m) {
      for (let g in m)
        i(
          /** @type {?} */
          this.prototype,
          g,
          m[g],
          m
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
    static createObservers(m, g) {
      const v = this.prototype;
      for (let z = 0; z < m.length; z++)
        v._createMethodObserver(m[z], g);
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
        let m = this.prototype.hasOwnProperty(
          JSCompiler_renameProperty("_template", this.prototype)
        ) ? this.prototype._template : void 0;
        typeof m == "function" && (m = m()), this._template = // If user has put template on prototype (e.g. in legacy via registered
        // callback or info object), prefer that first. Note that `null` is
        // used as a sentinel to indicate "no template" and can be used to
        // override a super template, whereas `undefined` is used as a
        // sentinel to mean "fall-back to default template lookup" via
        // dom-module and/or super.template.
        m !== void 0 ? m : (
          // Look in dom-module associated with this element's is
          this.hasOwnProperty(JSCompiler_renameProperty("is", this)) && l(
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
    static set template(m) {
      this._template = m;
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
        const m = this.importMeta;
        if (m)
          this._importPath = ss(m.url);
        else {
          const g = Kr.import(
            /** @type {PolymerElementConstructor} */
            this.is
          );
          this._importPath = g && g.assetpath || Object.getPrototypeOf(
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
      ), super._initializeProperties(), this.rootPath = Cu, this.importPath = this.constructor.importPath;
      let m = e(this.constructor);
      if (m)
        for (let g in m) {
          let v = m[g];
          if (this._canApplyPropertyDefault(g)) {
            let z = typeof v.value == "function" ? v.value.call(this) : v.value;
            this._hasAccessor(g) ? this._setPendingProperty(g, z, !0) : this[g] = z;
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
    _canApplyPropertyDefault(m) {
      return !this.hasOwnProperty(m);
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
    static _processStyleText(m, g) {
      return os(m, g);
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
    static _finalizeTemplate(m) {
      const g = this.prototype._template;
      if (g && !g.__polymerFinalized) {
        g.__polymerFinalized = !0;
        const v = this.importPath, z = v ? Lr(v) : "";
        s(this, g, m, z), this.prototype._bindTemplate(g);
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
    _attachDom(m) {
      const g = St(this);
      if (g.attachShadow)
        return m ? (g.shadowRoot || (g.attachShadow({ mode: "open", shadyUpgradeFragment: m }), g.shadowRoot.appendChild(m), this.constructor._styleSheet && (g.shadowRoot.adoptedStyleSheets = [this.constructor._styleSheet])), Pu && window.ShadyDOM && window.ShadyDOM.flushInitial(g.shadowRoot), g.shadowRoot) : null;
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
    updateStyles(m) {
      window.ShadyCSS && window.ShadyCSS.styleSubtree(
        /** @type {!HTMLElement} */
        this,
        m
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
    resolveUrl(m, g) {
      return !g && this.importPath && (g = Lr(this.importPath)), Lr(m, g);
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
    static _parseTemplateContent(m, g, v) {
      return g.dynamicFns = g.dynamicFns || this._properties, t._parseTemplateContent.call(
        this,
        m,
        g,
        v
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
    static _addTemplatePropertyEffect(m, g, v) {
      return ku && !(g in this._properties) && // Methods used in templates with no dependencies (or only literal
      // dependencies) become accessors with template effects; ignore these
      !(v.info.part.signature && v.info.part.signature.static) && // Warnings for bindings added to nested templates are handled by
      // templatizer so ignore both the host-to-template bindings
      // (`hostProp`) and TemplateInstance-to-child bindings
      // (`nestedTemplate`)
      !v.info.part.hostProp && m.nestedTemplate, t._addTemplatePropertyEffect.call(
        this,
        m,
        g,
        v
      );
    }
  }
  return d;
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
const Ua = window.trustedTypes && trustedTypes.createPolicy("polymer-html-literal", { createHTML: (n) => n });
class oc {
  /**
   * @param {!ITemplateArray} strings Constant parts of tagged template literal
   * @param {!Array<*>} values Variable parts of tagged template literal
   */
  constructor(t, e) {
    ac(t, e);
    const r = e.reduce(
      (i, s, l) => i + sc(s) + t[l + 1],
      t[0]
    );
    this.value = r.toString();
  }
  /**
   * @return {string} LiteralString string value
   * @override
   */
  toString() {
    return this.value;
  }
}
function sc(n) {
  if (n instanceof oc)
    return (
      /** @type {!LiteralString} */
      n.value
    );
  throw new Error(
    `non-literal value passed to Polymer's htmlLiteral function: ${n}`
  );
}
function jh(n) {
  if (n instanceof HTMLTemplateElement)
    return (
      /** @type {!HTMLTemplateElement } */
      n.innerHTML
    );
  if (n instanceof oc)
    return sc(n);
  throw new Error(
    `non-template value passed to Polymer's html function: ${n}`
  );
}
const dr = function(t, ...e) {
  ac(t, e);
  const r = (
    /** @type {!HTMLTemplateElement} */
    document.createElement("template")
  );
  let i = e.reduce(
    (s, l, d) => s + jh(l) + t[d + 1],
    t[0]
  );
  return Ua && (i = Ua.createHTML(i)), r.innerHTML = i, r;
}, ac = (n, t) => {
  if (!Array.isArray(n) || !Array.isArray(n.raw) || t.length !== n.length - 1)
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
const Dt = Uh(HTMLElement);
/**
 * @license
 * Copyright (c) 2017 The Polymer Project Authors. All rights reserved.
 * This code may only be used under the BSD style license found at http://polymer.github.io/LICENSE.txt
 * The complete set of authors may be found at http://polymer.github.io/AUTHORS.txt
 * The complete set of contributors may be found at http://polymer.github.io/CONTRIBUTORS.txt
 * Code distributed by Google as part of the polymer project is also
 * subject to an additional IP rights grant found at http://polymer.github.io/PATENTS.txt
 */
let ja = 0, lc = 0;
const Jt = [];
let Bo = !1;
function qh() {
  Bo = !1;
  const n = Jt.length;
  for (let t = 0; t < n; t++) {
    const e = Jt[t];
    if (e)
      try {
        e();
      } catch (r) {
        setTimeout(() => {
          throw r;
        });
      }
  }
  Jt.splice(0, n), lc += n;
}
const Ke = {
  /**
   * Returns a sub-module with the async interface providing the provided
   * delay.
   *
   * @memberof timeOut
   * @param {number=} delay Time to wait before calling callbacks in ms
   * @return {!AsyncInterface} An async timeout interface
   */
  after(n) {
    return {
      run(t) {
        return window.setTimeout(t, n);
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
  run(n, t) {
    return window.setTimeout(n, t);
  },
  /**
   * Cancels a previously enqueued `timeOut` callback.
   *
   * @memberof timeOut
   * @param {number} handle Handle returned from `run` of callback to cancel
   * @return {void}
   */
  cancel(n) {
    window.clearTimeout(n);
  }
}, zt = {
  /**
   * Enqueues a function called at `requestAnimationFrame` timing.
   *
   * @memberof animationFrame
   * @param {function(number):void} fn Callback to run
   * @return {number} Handle used for canceling task
   */
  run(n) {
    return window.requestAnimationFrame(n);
  },
  /**
   * Cancels a previously enqueued `animationFrame` callback.
   *
   * @memberof animationFrame
   * @param {number} handle Handle returned from `run` of callback to cancel
   * @return {void}
   */
  cancel(n) {
    window.cancelAnimationFrame(n);
  }
}, cc = {
  /**
   * Enqueues a function called at `requestIdleCallback` timing.
   *
   * @memberof idlePeriod
   * @param {function(!IdleDeadline):void} fn Callback to run
   * @return {number} Handle used for canceling task
   */
  run(n) {
    return window.requestIdleCallback ? window.requestIdleCallback(n) : window.setTimeout(n, 16);
  },
  /**
   * Cancels a previously enqueued `idlePeriod` callback.
   *
   * @memberof idlePeriod
   * @param {number} handle Handle returned from `run` of callback to cancel
   * @return {void}
   */
  cancel(n) {
    window.cancelIdleCallback ? window.cancelIdleCallback(n) : window.clearTimeout(n);
  }
}, $e = {
  /**
   * Enqueues a function called at microtask timing.
   *
   * @memberof microTask
   * @param {!Function=} callback Callback to run
   * @return {number} Handle used for canceling task
   */
  run(n) {
    Bo || (Bo = !0, queueMicrotask(() => qh())), Jt.push(n);
    const t = ja;
    return ja += 1, t;
  },
  /**
   * Cancels a previously enqueued `microTask` callback.
   *
   * @memberof microTask
   * @param {number} handle Handle returned from `run` of callback to cancel
   * @return {void}
   */
  cancel(n) {
    const t = n - lc;
    if (t >= 0) {
      if (!Jt[t])
        throw new Error(`invalid async handle: ${n}`);
      Jt[t] = null;
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
const Yr = /* @__PURE__ */ new Set();
class ie {
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
  static debounce(t, e, r) {
    return t instanceof ie ? t._cancelAsync() : t = new ie(), t.setConfig(e, r), t;
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
      this._timer = null, Yr.delete(this), this._callback();
    });
  }
  /**
   * Cancels an active debouncer and returns a reference to itself.
   *
   * @return {void}
   */
  cancel() {
    this.isActive() && (this._cancelAsync(), Yr.delete(this));
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
}
function dc(n) {
  Yr.add(n);
}
function Kh() {
  const n = !!Yr.size;
  return Yr.forEach((t) => {
    try {
      t.flush();
    } catch (e) {
      setTimeout(() => {
        throw e;
      });
    }
  }), n;
}
const Nr = () => {
  let n;
  do
    n = Kh();
  while (n);
};
/**
 * @license
 * Copyright (c) 2021 - 2024 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
const je = [];
function Vo(n, t, e = n.getAttribute("dir")) {
  t ? n.setAttribute("dir", t) : e != null && n.removeAttribute("dir");
}
function Ho() {
  return document.documentElement.getAttribute("dir");
}
function Wh() {
  const n = Ho();
  je.forEach((t) => {
    Vo(t, n);
  });
}
const Gh = new MutationObserver(Wh);
Gh.observe(document.documentElement, { attributes: !0, attributeFilter: ["dir"] });
const ri = (n) => class extends n {
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
    super.connectedCallback(), (!this.hasAttribute("dir") || this.__restoreSubscription) && (this.__subscribe(), Vo(this, Ho(), null));
  }
  /** @protected */
  attributeChangedCallback(e, r, i) {
    if (super.attributeChangedCallback(e, r, i), e !== "dir")
      return;
    const s = Ho(), l = i === s && je.indexOf(this) === -1, d = !i && r && je.indexOf(this) === -1;
    l || d ? (this.__subscribe(), Vo(this, s, i)) : i !== s && r === s && this.__unsubscribe();
  }
  /** @protected */
  disconnectedCallback() {
    super.disconnectedCallback(), this.__restoreSubscription = je.includes(this), this.__unsubscribe();
  }
  /** @protected */
  _valueToNodeAttribute(e, r, i) {
    i === "dir" && r === "" && !e.hasAttribute("dir") || super._valueToNodeAttribute(e, r, i);
  }
  /** @protected */
  _attributeToProperty(e, r, i) {
    e === "dir" && !r ? this.dir = "" : super._attributeToProperty(e, r, i);
  }
  /** @private */
  __subscribe() {
    je.includes(this) || je.push(this);
  }
  /** @private */
  __unsubscribe() {
    je.includes(this) && je.splice(je.indexOf(this), 1);
  }
};
/**
 * @license
 * Copyright (c) 2023 - 2024 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
function Rt(n, t) {
  return n.split(".").reduce((e, r) => e ? e[r] : void 0, t);
}
/**
 * @license
 * Copyright (c) 2021 - 2024 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
function cs(n) {
  if (window.Vaadin && window.Vaadin.templateRendererCallback) {
    window.Vaadin.templateRendererCallback(n);
    return;
  }
  n.querySelector("template");
}
/**
 * @license
 * Copyright (c) 2021 - 2024 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
function Yh(n) {
  const t = [];
  for (; n; ) {
    if (n.nodeType === Node.DOCUMENT_NODE) {
      t.push(n);
      break;
    }
    if (n.nodeType === Node.DOCUMENT_FRAGMENT_NODE) {
      t.push(n), n = n.host;
      continue;
    }
    if (n.assignedSlot) {
      n = n.assignedSlot;
      continue;
    }
    n = n.parentNode;
  }
  return t;
}
function uc(n, t) {
  return t ? t.closest(n) || uc(n, t.getRootNode().host) : null;
}
function ds(n) {
  return n ? new Set(n.split(" ")) : /* @__PURE__ */ new Set();
}
function pn(n) {
  return n ? [...n].join(" ") : "";
}
function _n(n, t, e) {
  const r = ds(n.getAttribute(t));
  r.add(e), n.setAttribute(t, pn(r));
}
function us(n, t, e) {
  const r = ds(n.getAttribute(t));
  if (r.delete(e), r.size === 0) {
    n.removeAttribute(t);
    return;
  }
  n.setAttribute(t, pn(r));
}
function Zh(n) {
  return n.nodeType === Node.TEXT_NODE && n.textContent.trim() === "";
}
/**
 * @license
 * Copyright (c) 2016 - 2024 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
function nr(n) {
  return n.__cells || Array.from(n.querySelectorAll('[part~="cell"]:not([part~="details-cell"])'));
}
function Pe(n, t) {
  [...n.children].forEach(t);
}
function or(n, t) {
  nr(n).forEach(t), n.__detailsCell && t(n.__detailsCell);
}
function Xh(n, t, e) {
  let r = 1;
  n.forEach((i) => {
    r % 10 === 0 && (r += 1), i._order = e + r * t, r += 1;
  });
}
function mn(n, t, e) {
  switch (typeof e) {
    case "boolean":
      n.toggleAttribute(t, e);
      break;
    case "string":
      n.setAttribute(t, e);
      break;
    default:
      n.removeAttribute(t);
      break;
  }
}
function lt(n, t, e) {
  t || t === "" ? _n(n, "part", e) : us(n, "part", e);
}
function nt(n, t, e) {
  n.forEach((r) => {
    lt(r, e, t);
  });
}
function Br(n, t) {
  const e = nr(n);
  Object.entries(t).forEach(([r, i]) => {
    mn(n, r, i);
    const s = `${r}-row`;
    lt(n, i, s), nt(e, `${s}-cell`, i);
  });
}
function qa(n, t) {
  const e = nr(n);
  Object.entries(t).forEach(([r, i]) => {
    const s = n.getAttribute(r);
    if (mn(n, r, i), s) {
      const l = `${r}-${s}-row`;
      lt(n, !1, l), nt(e, `${l}-cell`, !1);
    }
    if (i) {
      const l = `${r}-${i}-row`;
      lt(n, i, l), nt(e, `${l}-cell`, i);
    }
  });
}
function Ct(n, t, e, r, i) {
  mn(n, t, e), i && lt(n, !1, i), lt(n, e, r || `${t}-cell`);
}
class Qt {
  constructor(t, e) {
    this.__host = t, this.__callback = e, this.__currentSlots = [], this.__onMutation = this.__onMutation.bind(this), this.__observer = new MutationObserver(this.__onMutation), this.__observer.observe(t, {
      childList: !0
    }), this.__initialCallDebouncer = ie.debounce(this.__initialCallDebouncer, $e, () => this.__onMutation());
  }
  disconnect() {
    this.__observer.disconnect(), this.__initialCallDebouncer.cancel(), this.__toggleSlotChangeListeners(!1);
  }
  flush() {
    this.__onMutation();
  }
  __toggleSlotChangeListeners(t) {
    this.__currentSlots.forEach((e) => {
      t ? e.addEventListener("slotchange", this.__onMutation) : e.removeEventListener("slotchange", this.__onMutation);
    });
  }
  __onMutation() {
    const t = !this.__currentColumns;
    this.__currentColumns || (this.__currentColumns = []);
    const e = Qt.getColumns(this.__host), r = e.filter((d) => !this.__currentColumns.includes(d)), i = this.__currentColumns.filter((d) => !e.includes(d)), s = this.__currentColumns.some((d, f) => d !== e[f]);
    this.__currentColumns = e, this.__toggleSlotChangeListeners(!1), this.__currentSlots = [...this.__host.children].filter((d) => d instanceof HTMLSlotElement), this.__toggleSlotChangeListeners(!0), (t || r.length || i.length || s) && this.__callback(r, i);
  }
  /**
   * Default filter for column elements.
   */
  static __isColumnElement(t) {
    return t.nodeType === Node.ELEMENT_NODE && /\bcolumn\b/u.test(t.localName);
  }
  static getColumns(t) {
    const e = [], r = t._isColumnElement || Qt.__isColumnElement;
    return [...t.children].forEach((i) => {
      r(i) ? e.push(i) : i instanceof HTMLSlotElement && [...i.assignedElements({ flatten: !0 })].filter((s) => r(s)).forEach((s) => e.push(s));
    }), e;
  }
}
/**
 * @license
 * Copyright (c) 2016 - 2024 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
const Jh = (n) => class extends n {
  static get properties() {
    return {
      /**
       * When set to true, the column is user-resizable.
       * @default false
       */
      resizable: {
        type: Boolean,
        sync: !0,
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
        value: !1,
        sync: !0
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
        value: !1,
        sync: !0
      },
      /**
       * When true, the cells for this column will be rendered with the `role` attribute
       * set as `rowheader`, instead of the `gridcell` role value used by default.
       *
       * When a column is set as row header, its cells will be announced by screen readers
       * while navigating to help user identify the current row as uniquely as possible.
       *
       * @attr {boolean} row-header
       * @type {boolean}
       */
      rowHeader: {
        type: Boolean,
        value: !1,
        sync: !0
      },
      /**
       * When set to true, the cells for this column are hidden.
       */
      hidden: {
        type: Boolean,
        value: !1,
        sync: !0
      },
      /**
       * Text content to display in the header cell of the column.
       */
      header: {
        type: String,
        sync: !0
      },
      /**
       * Aligns the columns cell content horizontally.
       * Supported values: "start", "center" and "end".
       * @attr {start|center|end} text-align
       * @type {GridColumnTextAlign | null | undefined}
       */
      textAlign: {
        type: String,
        sync: !0
      },
      /**
       * Custom part name for the header cell.
       *
       * @attr {string} header-part-name
       */
      headerPartName: {
        type: String,
        sync: !0
      },
      /**
       * Custom part name for the footer cell.
       *
       * @attr {string} footer-part-name
       */
      footerPartName: {
        type: String,
        sync: !0
      },
      /**
       * @type {boolean}
       * @protected
       */
      _lastFrozen: {
        type: Boolean,
        value: !1,
        sync: !0
      },
      /**
       * @type {boolean}
       * @protected
       */
      _bodyContentHidden: {
        type: Boolean,
        value: !1,
        sync: !0
      },
      /**
       * @type {boolean}
       * @protected
       */
      _firstFrozenToEnd: {
        type: Boolean,
        value: !1,
        sync: !0
      },
      /** @protected */
      _order: {
        type: Number,
        sync: !0
      },
      /** @private */
      _reorderStatus: {
        type: Boolean,
        sync: !0
      },
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
      headerRenderer: {
        type: Function,
        sync: !0
      },
      /**
       * Represents the final header renderer computed on the set of observable arguments.
       * It is supposed to be used internally when rendering the header cell content.
       *
       * @protected
       * @type {GridHeaderFooterRenderer | undefined}
       */
      _headerRenderer: {
        type: Function,
        computed: "_computeHeaderRenderer(headerRenderer, header, __initialized)",
        sync: !0
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
      footerRenderer: {
        type: Function,
        sync: !0
      },
      /**
       * Represents the final footer renderer computed on the set of observable arguments.
       * It is supposed to be used internally when rendering the footer cell content.
       *
       * @protected
       * @type {GridHeaderFooterRenderer | undefined}
       */
      _footerRenderer: {
        type: Function,
        computed: "_computeFooterRenderer(footerRenderer, __initialized)",
        sync: !0
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
      "_widthChanged(width, _headerCell, _footerCell, _cells)",
      "_frozenChanged(frozen, _headerCell, _footerCell, _cells)",
      "_frozenToEndChanged(frozenToEnd, _headerCell, _footerCell, _cells)",
      "_flexGrowChanged(flexGrow, _headerCell, _footerCell, _cells)",
      "_textAlignChanged(textAlign, _cells, _headerCell, _footerCell)",
      "_orderChanged(_order, _headerCell, _footerCell, _cells)",
      "_lastFrozenChanged(_lastFrozen)",
      "_firstFrozenToEndChanged(_firstFrozenToEnd)",
      "_onRendererOrBindingChanged(_renderer, _cells, _bodyContentHidden, path)",
      "_onHeaderRendererOrBindingChanged(_headerRenderer, _headerCell, path, header)",
      "_onFooterRendererOrBindingChanged(_footerRenderer, _footerCell)",
      "_resizableChanged(resizable, _headerCell)",
      "_reorderStatusChanged(_reorderStatus, _headerCell, _footerCell, _cells)",
      "_hiddenChanged(hidden, _headerCell, _footerCell, _cells)",
      "_rowHeaderChanged(rowHeader, _cells)",
      "__headerFooterPartNameChanged(_headerCell, _footerCell, headerPartName, footerPartName)"
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
    super.ready(), cs(this);
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
    this.parentElement && this.parentElement._columnPropChanged && this.parentElement._columnPropChanged("flexGrow"), this._allCells.forEach((r) => {
      r.style.flexGrow = e;
    });
  }
  /** @private */
  _orderChanged(e) {
    this._allCells.forEach((r) => {
      r.style.order = e;
    });
  }
  /** @private */
  _widthChanged(e) {
    this.parentElement && this.parentElement._columnPropChanged && this.parentElement._columnPropChanged("width"), this._allCells.forEach((r) => {
      r.style.width = e;
    });
  }
  /** @private */
  _frozenChanged(e) {
    this.parentElement && this.parentElement._columnPropChanged && this.parentElement._columnPropChanged("frozen", e), this._allCells.forEach((r) => {
      Ct(r, "frozen", e);
    }), this._grid && this._grid._frozenCellsChanged && this._grid._frozenCellsChanged();
  }
  /** @private */
  _frozenToEndChanged(e) {
    this.parentElement && this.parentElement._columnPropChanged && this.parentElement._columnPropChanged("frozenToEnd", e), this._allCells.forEach((r) => {
      this._grid && r.parentElement === this._grid.$.sizer || Ct(r, "frozen-to-end", e);
    }), this._grid && this._grid._frozenCellsChanged && this._grid._frozenCellsChanged();
  }
  /** @private */
  _lastFrozenChanged(e) {
    this._allCells.forEach((r) => {
      Ct(r, "last-frozen", e);
    }), this.parentElement && this.parentElement._columnPropChanged && (this.parentElement._lastFrozen = e);
  }
  /** @private */
  _firstFrozenToEndChanged(e) {
    this._allCells.forEach((r) => {
      this._grid && r.parentElement === this._grid.$.sizer || Ct(r, "first-frozen-to-end", e);
    }), this.parentElement && this.parentElement._columnPropChanged && (this.parentElement._firstFrozenToEnd = e);
  }
  /** @private */
  _rowHeaderChanged(e, r) {
    r && r.forEach((i) => {
      i.setAttribute("role", e ? "rowheader" : "gridcell");
    });
  }
  /**
   * @param {string} path
   * @return {string}
   * @protected
   */
  _generateHeader(e) {
    return e.substr(e.lastIndexOf(".") + 1).replace(/([A-Z])/gu, "-$1").toLowerCase().replace(/-/gu, " ").replace(/^./u, (r) => r.toUpperCase());
  }
  /** @private */
  _reorderStatusChanged(e) {
    const r = this.__previousReorderStatus, i = r ? `reorder-${r}-cell` : "", s = `reorder-${e}-cell`;
    this._allCells.forEach((l) => {
      Ct(l, "reorder-status", e, s, i);
    }), this.__previousReorderStatus = e;
  }
  /** @private */
  _resizableChanged(e, r) {
    e === void 0 || r === void 0 || r && [r].concat(this._emptyCells).forEach((i) => {
      if (i) {
        const s = i.querySelector('[part~="resize-handle"]');
        if (s && i.removeChild(s), e) {
          const l = document.createElement("div");
          l.setAttribute("part", "resize-handle"), i.appendChild(l);
        }
      }
    });
  }
  /** @private */
  _textAlignChanged(e) {
    if (e === void 0 || this._grid === void 0 || ["start", "end", "center"].indexOf(e) === -1)
      return;
    let r;
    getComputedStyle(this._grid).direction === "ltr" ? e === "start" ? r = "left" : e === "end" && (r = "right") : e === "start" ? r = "right" : e === "end" && (r = "left"), this._allCells.forEach((i) => {
      i._content.style.textAlign = e, getComputedStyle(i._content).textAlign !== e && (i._content.style.textAlign = r);
    });
  }
  /** @private */
  _hiddenChanged(e) {
    this.parentElement && this.parentElement._columnPropChanged && this.parentElement._columnPropChanged("hidden", e), !!e != !!this._previousHidden && this._grid && (e === !0 && this._allCells.forEach((r) => {
      r._content.parentNode && r._content.parentNode.removeChild(r._content);
    }), this._grid._debouncerHiddenChanged = ie.debounce(
      this._grid._debouncerHiddenChanged,
      zt,
      () => {
        this._grid && this._grid._renderColumnTree && this._grid._renderColumnTree(this._grid._columnTree);
      }
    ), this._grid._debounceUpdateFrozenColumn && this._grid._debounceUpdateFrozenColumn(), this._grid._resetKeyboardNavigation && this._grid._resetKeyboardNavigation()), this._previousHidden = e;
  }
  /** @protected */
  _runRenderer(e, r, i) {
    const s = i && i.item && !r.parentElement.hidden;
    if (!(s || e === this._headerRenderer || e === this._footerRenderer))
      return;
    const d = [r._content, this];
    s && d.push(i), e.apply(this, d);
  }
  /**
   * Renders the content to the given cells using a renderer.
   *
   * @private
   */
  __renderCellsContent(e, r) {
    this.hidden || !this._grid || r.forEach((i) => {
      if (!i.parentElement)
        return;
      const s = this._grid.__getRowModel(i.parentElement);
      e && (i._renderer !== e && this._clearCellContent(i), i._renderer = e, this._runRenderer(e, i, s));
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
  _renderHeaderCellContent(e, r) {
    !r || !e || (this.__renderCellsContent(e, [r]), this._grid && r.parentElement && this._grid.__debounceUpdateHeaderFooterRowVisibility(r.parentElement));
  }
  /** @protected */
  _onHeaderRendererOrBindingChanged(e, r, ...i) {
    this._renderHeaderCellContent(e, r);
  }
  /** @private */
  __headerFooterPartNameChanged(e, r, i, s) {
    [
      { cell: e, partName: i },
      { cell: r, partName: s }
    ].forEach(({ cell: l, partName: d }) => {
      if (l) {
        const f = l.__customParts || [];
        l.part.remove(...f), l.__customParts = d ? d.trim().split(" ") : [], l.part.add(...l.__customParts);
      }
    });
  }
  /**
   * Renders the content of body cells using a renderer.
   *
   * @protected
   */
  _renderBodyCellsContent(e, r) {
    !r || !e || this.__renderCellsContent(e, r);
  }
  /** @protected */
  _onRendererOrBindingChanged(e, r, ...i) {
    this._renderBodyCellsContent(e, r);
  }
  /**
   * Renders the footer cell content using a renderer
   * and then updates the visibility of the parent row depending on
   * whether all its children cells are empty or not.
   *
   * @protected
   */
  _renderFooterCellContent(e, r) {
    !r || !e || (this.__renderCellsContent(e, [r]), this._grid && r.parentElement && this._grid.__debounceUpdateHeaderFooterRowVisibility(r.parentElement));
  }
  /** @protected */
  _onFooterRendererOrBindingChanged(e, r) {
    this._renderFooterCellContent(e, r);
  }
  /** @private */
  __setTextContent(e, r) {
    e.textContent !== r && (e.textContent = r);
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
  _defaultRenderer(e, r, { item: i }) {
    this.path && this.__setTextContent(e, Rt(this.path, i));
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
  _computeHeaderRenderer(e, r) {
    return e || (r != null ? this.__textHeaderRenderer : this._defaultHeaderRenderer);
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
}, Qh = (n) => class extends Jh(ri(n)) {
  static get properties() {
    return {
      /**
       * Width of the cells for this column.
       *
       * Please note that using the `em` length unit is discouraged as
       * it might lead to misalignment issues if the header, body, and footer
       * cells have different font sizes. Instead, use `rem` if you need
       * a length unit relative to the font size.
       */
      width: {
        type: String,
        value: "100px",
        sync: !0
      },
      /**
       * Flex grow ratio for the cell widths. When set to 0, cell width is fixed.
       * @attr {number} flex-grow
       * @type {number}
       */
      flexGrow: {
        type: Number,
        value: 1,
        sync: !0
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
      renderer: {
        type: Function,
        sync: !0
      },
      /**
       * Represents the final renderer computed on the set of observable arguments.
       * It is supposed to be used internally when rendering the content of a body cell.
       *
       * @protected
       * @type {GridBodyRenderer | undefined}
       */
      _renderer: {
        type: Function,
        computed: "_computeRenderer(renderer, __initialized)",
        sync: !0
      },
      /**
       * Path to an item sub-property whose value gets displayed in the column body cells.
       * The property name is also shown in the column header if an explicit header or renderer isn't defined.
       */
      path: {
        type: String,
        sync: !0
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
      _cells: {
        type: Array,
        sync: !0
      }
    };
  }
};
/**
 * @license
 * Copyright (c) 2016 - 2024 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
class ef extends Qh(Dt) {
  static get is() {
    return "vaadin-grid-column";
  }
}
ct(ef);
/**
 * @license
 * Copyright (c) 2021 - 2024 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
const ii = me((n) => typeof n.prototype.addController == "function" ? n : class extends n {
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
}), tf = /\/\*[\*!]\s+vaadin-dev-mode:start([\s\S]*)vaadin-dev-mode:end\s+\*\*\//i, Ui = window.Vaadin && window.Vaadin.Flow && window.Vaadin.Flow.clients;
function rf() {
  function n() {
    return !0;
  }
  return hc(n);
}
function nf() {
  try {
    return of() ? !0 : sf() ? Ui ? !af() : !rf() : !1;
  } catch {
    return !1;
  }
}
function of() {
  return localStorage.getItem("vaadin.developmentmode.force");
}
function sf() {
  return ["localhost", "127.0.0.1"].indexOf(window.location.hostname) >= 0;
}
function af() {
  return !!(Ui && Object.keys(Ui).map((t) => Ui[t]).filter((t) => t.productionMode).length > 0);
}
function hc(n, t) {
  if (typeof n != "function")
    return;
  const e = tf.exec(n.toString());
  if (e)
    try {
      n = new Function(e[1]);
    } catch {
    }
  return n(t);
}
window.Vaadin = window.Vaadin || {};
const Ka = function(n, t) {
  if (window.Vaadin.developmentMode)
    return hc(n, t);
};
window.Vaadin.developmentMode === void 0 && (window.Vaadin.developmentMode = nf());
function lf() {
}
const cf = function() {
  if (typeof Ka == "function")
    return Ka(lf);
};
/**
 * @license
 * Copyright (c) 2021 - 2024 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
window.Vaadin || (window.Vaadin = {});
window.Vaadin.registrations || (window.Vaadin.registrations = []);
window.Vaadin.developmentModeCallback || (window.Vaadin.developmentModeCallback = {});
window.Vaadin.developmentModeCallback["vaadin-usage-statistics"] = function() {
  cf();
};
let po;
const Wa = /* @__PURE__ */ new Set(), fc = (n) => class extends ri(n) {
  /** @protected */
  static finalize() {
    super.finalize();
    const { is: e } = this;
    e && !Wa.has(e) && (window.Vaadin.registrations.push(this), Wa.add(e), window.Vaadin.developmentModeCallback && (po = ie.debounce(po, cc, () => {
      window.Vaadin.developmentModeCallback["vaadin-usage-statistics"]();
    }), dc(po)));
  }
  constructor() {
    super(), document.doctype;
  }
};
/**
 * @license
 * Copyright (c) 2021 - 2024 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
let hs = !1;
window.addEventListener(
  "keydown",
  () => {
    hs = !0;
  },
  { capture: !0 }
);
window.addEventListener(
  "mousedown",
  () => {
    hs = !1;
  },
  { capture: !0 }
);
function Uo() {
  let n = document.activeElement || document.body;
  for (; n.shadowRoot && n.shadowRoot.activeElement; )
    n = n.shadowRoot.activeElement;
  return n;
}
function fs() {
  return hs;
}
function pc(n) {
  const t = n.style;
  if (t.visibility === "hidden" || t.display === "none")
    return !0;
  const e = window.getComputedStyle(n);
  return e.visibility === "hidden" || e.display === "none";
}
function df(n, t) {
  const e = Math.max(n.tabIndex, 0), r = Math.max(t.tabIndex, 0);
  return e === 0 || r === 0 ? r > e : e > r;
}
function uf(n, t) {
  const e = [];
  for (; n.length > 0 && t.length > 0; )
    df(n[0], t[0]) ? e.push(t.shift()) : e.push(n.shift());
  return e.concat(n, t);
}
function jo(n) {
  const t = n.length;
  if (t < 2)
    return n;
  const e = Math.ceil(t / 2), r = jo(n.slice(0, e)), i = jo(n.slice(e));
  return uf(r, i);
}
function nn(n) {
  return n.offsetParent === null && n.clientWidth === 0 && n.clientHeight === 0 ? !0 : pc(n);
}
function hf(n) {
  return n.matches('[tabindex="-1"]') ? !1 : n.matches("input, select, textarea, button, object") ? n.matches(":not([disabled])") : n.matches("a[href], area[href], iframe, [tabindex], [contentEditable]");
}
function _c(n) {
  return n.getRootNode().activeElement === n;
}
function ff(n) {
  if (!hf(n))
    return -1;
  const t = n.getAttribute("tabindex") || 0;
  return Number(t);
}
function mc(n, t) {
  if (n.nodeType !== Node.ELEMENT_NODE || pc(n))
    return !1;
  const e = (
    /** @type {HTMLElement} */
    n
  ), r = ff(e);
  let i = r > 0;
  r >= 0 && t.push(e);
  let s = [];
  return e.localName === "slot" ? s = e.assignedNodes({ flatten: !0 }) : s = (e.shadowRoot || e).children, [...s].forEach((l) => {
    i = mc(l, t) || i;
  }), i;
}
function pf(n) {
  const t = [];
  return mc(n, t) ? jo(t) : t;
}
/**
 * @license
 * Copyright (c) 2021 - 2024 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
const gc = me(
  (n) => class extends n {
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
 * Copyright (c) 2021 - 2024 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
const bc = (n) => class extends gc(n) {
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
  _disabledChanged(e, r) {
    super._disabledChanged(e, r), e ? (this.tabindex !== void 0 && (this._lastTabIndex = this.tabindex), this.tabindex = -1) : r && (this.tabindex = this._lastTabIndex);
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
 * Copyright (c) 2021 - 2024 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
const gn = (n) => n.test(navigator.userAgent), qo = (n) => n.test(navigator.platform), _f = (n) => n.test(navigator.vendor), Ga = gn(/Android/u), mf = gn(/Chrome/u) && _f(/Google Inc/u), gf = gn(/Firefox/u), bf = qo(/^iPad/u) || qo(/^Mac/u) && navigator.maxTouchPoints > 1, vf = qo(/^iPhone/u), Ko = vf || bf, vc = gn(/^((?!chrome|android).)*safari/iu), Zr = (() => {
  try {
    return document.createEvent("TouchEvent"), !0;
  } catch {
    return !1;
  }
})();
/**
 * @license
 * Copyright (c) 2023 - 2024 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
class yf {
  constructor(t, e) {
    this.slot = t, this.callback = e, this._storedNodes = [], this._connected = !1, this._scheduled = !1, this._boundSchedule = () => {
      this._schedule();
    }, this.connect(), this._schedule();
  }
  /**
   * Activates an observer. This method is automatically called when
   * a `SlotObserver` is created. It should only be called to  re-activate
   * an observer that has been deactivated via the `disconnect` method.
   */
  connect() {
    this.slot.addEventListener("slotchange", this._boundSchedule), this._connected = !0;
  }
  /**
   * Deactivates the observer. After calling this method the observer callback
   * will not be called when changes to slotted nodes occur. The `connect` method
   * may be subsequently called to reactivate the observer.
   */
  disconnect() {
    this.slot.removeEventListener("slotchange", this._boundSchedule), this._connected = !1;
  }
  /** @private */
  _schedule() {
    this._scheduled || (this._scheduled = !0, queueMicrotask(() => {
      this.flush();
    }));
  }
  /**
   * Run the observer callback synchronously.
   */
  flush() {
    this._connected && (this._scheduled = !1, this._processNodes());
  }
  /** @private */
  _processNodes() {
    const t = this.slot.assignedNodes({ flatten: !0 });
    let e = [];
    const r = [], i = [];
    t.length && (e = t.filter((s) => !this._storedNodes.includes(s))), this._storedNodes.length && this._storedNodes.forEach((s, l) => {
      const d = t.indexOf(s);
      d === -1 ? r.push(s) : d !== l && i.push(s);
    }), (e.length || r.length || i.length) && this.callback({ addedNodes: e, movedNodes: i, removedNodes: r }), this._storedNodes = t;
  }
}
/**
 * @license
 * Copyright (c) 2021 - 2024 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
let xf = 0;
function yc() {
  return xf++;
}
/**
 * @license
 * Copyright (c) 2021 - 2024 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
class ps extends EventTarget {
  /**
   * Ensure that every instance has unique ID.
   *
   * @param {HTMLElement} host
   * @param {string} slotName
   * @return {string}
   * @protected
   */
  static generateId(t, e) {
    return `${e || "default"}-${t.localName}-${yc()}`;
  }
  constructor(t, e, r, i = {}) {
    super();
    const { initializer: s, multiple: l, observe: d, useUniqueId: f } = i;
    this.host = t, this.slotName = e, this.tagName = r, this.observe = typeof d == "boolean" ? d : !0, this.multiple = typeof l == "boolean" ? l : !1, this.slotInitializer = s, l && (this.nodes = []), f && (this.defaultId = this.constructor.generateId(t, e));
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
      e && (this.nodes = [e], this.initNode(e));
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
    const { host: t, slotName: e, tagName: r } = this;
    let i = this.defaultNode;
    return !i && r && (i = document.createElement(r), i instanceof Element && (e !== "" && i.setAttribute("slot", e), this.defaultNode = i)), i && (this.node = i, t.appendChild(i)), i;
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
    const { slotName: t } = this, e = t === "" ? "slot:not([name])" : `slot[name=${t}]`, r = this.host.shadowRoot.querySelector(e);
    this.__slotObserver = new yf(r, ({ addedNodes: i, removedNodes: s }) => {
      const l = this.multiple ? this.nodes : [this.node], d = i.filter((f) => !Zh(f) && !l.includes(f));
      s.length && (this.nodes = l.filter((f) => !s.includes(f)), s.forEach((f) => {
        this.teardownNode(f);
      })), d && d.length > 0 && (this.multiple ? (this.defaultNode && this.defaultNode.remove(), this.nodes = [...l, ...d].filter((f) => f !== this.defaultNode), d.forEach((f) => {
        this.initAddedNode(f);
      })) : (this.node && this.node.remove(), this.node = d[0], this.initAddedNode(this.node)));
    });
  }
}
/**
 * @license
 * Copyright (c) 2022 - 2024 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
class xc extends ps {
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
    t.target = this.target, this.ariaTarget !== void 0 && (t.ariaTarget = this.ariaTarget), this.context !== void 0 && (t.context = this.context), this.manual !== void 0 && (t.manual = this.manual), this.opened !== void 0 && (t.opened = this.opened), this.position !== void 0 && (t._position = this.position), this.shouldShow !== void 0 && (t.shouldShow = this.shouldShow), this.__notifyChange();
  }
  /**
   * Override to notify the host when the tooltip is removed.
   *
   * @param {Node} tooltipNode
   * @protected
   * @override
   */
  teardownNode() {
    this.__notifyChange();
  }
  /**
   * Set an HTML element for linking with the tooltip overlay
   * via `aria-describedby` attribute used by screen readers.
   * @param {HTMLElement} ariaTarget
   */
  setAriaTarget(t) {
    this.ariaTarget = t;
    const e = this.node;
    e && (e.ariaTarget = t);
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
  /** @private */
  __notifyChange() {
    this.dispatchEvent(new CustomEvent("tooltip-changed", { detail: { node: this.node } }));
  }
}
/**
 * @license
 * Copyright (c) 2016 The Polymer Project Authors. All rights reserved.
 * This code may only be used under the BSD style license found at http://polymer.github.io/LICENSE.txt
 * The complete set of authors may be found at http://polymer.github.io/AUTHORS.txt
 * The complete set of contributors may be found at http://polymer.github.io/CONTRIBUTORS.txt
 * Code distributed by Google as part of the polymer project is also
 * subject to an additional IP rights grant found at http://polymer.github.io/PATENTS.txt
 */
const Ya = navigator.userAgent.match(/iP(?:hone|ad;(?: U;)? CPU) OS (\d+)/u), wf = Ya && Ya[1] >= 8, Za = 3, Cf = {
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
    const n = this._virtualCount;
    return Math.max(0, n - this._physicalCount);
  },
  get _virtualStart() {
    return this._virtualStartVal || 0;
  },
  set _virtualStart(n) {
    n = this._clamp(n, 0, this._maxVirtualStart), this._virtualStartVal = n;
  },
  get _physicalStart() {
    return this._physicalStartVal || 0;
  },
  /**
   * The k-th tile that is at the top of the scrolling list.
   */
  set _physicalStart(n) {
    n %= this._physicalCount, n < 0 && (n = this._physicalCount + n), this._physicalStartVal = n;
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
  set _physicalCount(n) {
    this._physicalCountVal = n;
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
    let n = this._firstVisibleIndexVal;
    if (n == null) {
      let t = this._physicalTop + this._scrollOffset;
      n = this._iterateItems((e, r) => {
        if (t += this._getPhysicalSizeIncrement(e), t > this._scrollPosition)
          return r;
      }) || 0, this._firstVisibleIndexVal = n;
    }
    return n;
  },
  /**
   * Gets the index of the last visible item in the viewport.
   *
   * @type {number}
   */
  get lastVisibleIndex() {
    let n = this._lastVisibleIndexVal;
    if (n == null) {
      let t = this._physicalTop + this._scrollOffset;
      this._iterateItems((e, r) => {
        t < this._scrollBottom && (n = r), t += this._getPhysicalSizeIncrement(e);
      }), this._lastVisibleIndexVal = n;
    }
    return n;
  },
  get _scrollOffset() {
    return this._scrollerPaddingTop + this.scrollOffset;
  },
  /**
   * Recycles the physical items when needed.
   */
  _scrollHandler() {
    const n = Math.max(0, Math.min(this._maxScrollTop, this._scrollTop));
    let t = n - this._scrollPosition;
    const e = t >= 0;
    if (this._scrollPosition = n, this._firstVisibleIndexVal = null, this._lastVisibleIndexVal = null, Math.abs(t) > this._physicalSize && this._physicalSize > 0) {
      t -= this._scrollOffset;
      const r = Math.round(t / this._physicalAverage);
      this._virtualStart += r, this._physicalStart += r, this._physicalTop = Math.min(Math.floor(this._virtualStart) * this._physicalAverage, this._scrollPosition), this._update();
    } else if (this._physicalCount > 0) {
      const r = this._getReusables(e);
      e ? (this._physicalTop = r.physicalTop, this._virtualStart += r.indexes.length, this._physicalStart += r.indexes.length) : (this._virtualStart -= r.indexes.length, this._physicalStart -= r.indexes.length), this._update(r.indexes, e ? null : r.indexes), this._debounce("_increasePoolIfNeeded", this._increasePoolIfNeeded.bind(this, 0), $e);
    }
  },
  /**
   * Returns an object that contains the indexes of the physical items
   * that might be reused and the physicalTop.
   *
   * @param {boolean} fromTop If the potential reusable items are above the scrolling region.
   */
  _getReusables(n) {
    let t, e, r;
    const i = [], s = this._hiddenContentSize * this._ratio, l = this._virtualStart, d = this._virtualEnd, f = this._physicalCount;
    let m = this._physicalTop + this._scrollOffset;
    const g = this._physicalBottom + this._scrollOffset, v = this._scrollPosition, z = this._scrollBottom;
    for (n ? (t = this._physicalStart, e = v - m) : (t = this._physicalEnd, e = g - z); r = this._getPhysicalSizeIncrement(t), e -= r, !(i.length >= f || e <= s); )
      if (n) {
        if (d + i.length + 1 >= this._virtualCount || m + r >= v - this._scrollOffset)
          break;
        i.push(t), m += r, t = (t + 1) % f;
      } else {
        if (l - i.length <= 0 || m + this._physicalSize - r <= z)
          break;
        i.push(t), m -= r, t = t === 0 ? f - 1 : t - 1;
      }
    return { indexes: i, physicalTop: m - this._scrollOffset };
  },
  /**
   * Update the list of items, starting from the `_virtualStart` item.
   * @param {!Array<number>=} itemSet
   * @param {!Array<number>=} movingUp
   */
  _update(n, t) {
    if (!(n && n.length === 0 || this._physicalCount === 0)) {
      if (this._assignModels(n), this._updateMetrics(n), t)
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
  _increasePoolIfNeeded(n) {
    const e = this._clamp(
      this._physicalCount + n,
      Za,
      this._virtualCount - this._virtualStart
    ) - this._physicalCount;
    let r = Math.round(this._physicalCount * 0.5);
    if (!(e < 0)) {
      if (e > 0) {
        const i = window.performance.now();
        [].push.apply(this._physicalItems, this._createPool(e));
        for (let s = 0; s < e; s++)
          this._physicalSizes.push(0);
        this._physicalCount += e, this._physicalStart > this._physicalEnd && this._isIndexRendered(this._focusedVirtualIndex) && this._getPhysicalIndex(this._focusedVirtualIndex) < this._physicalEnd && (this._physicalStart += e), this._update(), this._templateCost = (window.performance.now() - i) / e, r = Math.round(this._physicalCount * 0.5);
      }
      this._virtualEnd >= this._virtualCount - 1 || r === 0 || (this._isClientFull() ? this._physicalSize < this._optPhysicalSize && this._debounce(
        "_increasePoolIfNeeded",
        this._increasePoolIfNeeded.bind(this, this._clamp(Math.round(50 / this._templateCost), 1, r)),
        cc
      ) : this._debounce("_increasePoolIfNeeded", this._increasePoolIfNeeded.bind(this, r), $e));
    }
  },
  /**
   * Renders the a new list.
   */
  _render() {
    if (!(!this.isAttached || !this._isVisible))
      if (this._physicalCount !== 0) {
        const n = this._getReusables(!0);
        this._physicalTop = n.physicalTop, this._virtualStart += n.indexes.length, this._physicalStart += n.indexes.length, this._update(n.indexes), this._update(), this._increasePoolIfNeeded(0);
      } else this._virtualCount > 0 && (this.updateViewportBoundaries(), this._increasePoolIfNeeded(Za));
  },
  /**
   * Called when the items have changed. That is, reassignments
   * to `items`, splices or updates to a single item.
   */
  _itemsChanged(n) {
    n.path === "items" && (this._virtualStart = 0, this._physicalTop = 0, this._virtualCount = this.items ? this.items.length : 0, this._physicalIndexForKey = {}, this._firstVisibleIndexVal = null, this._lastVisibleIndexVal = null, this._physicalItems || (this._physicalItems = []), this._physicalSizes || (this._physicalSizes = []), this._physicalStart = 0, this._scrollTop > this._scrollOffset && this._resetScrollPosition(0), this._debounce("_render", this._render, zt));
  },
  /**
   * Executes a provided function per every physical index in `itemSet`
   * `itemSet` default value is equivalent to the entire set of physical
   * indexes.
   *
   * @param {!function(number, number)} fn
   * @param {!Array<number>=} itemSet
   */
  _iterateItems(n, t) {
    let e, r, i, s;
    if (arguments.length === 2 && t) {
      for (s = 0; s < t.length; s++)
        if (e = t[s], r = this._computeVidx(e), (i = n.call(this, e, r)) != null)
          return i;
    } else {
      for (e = this._physicalStart, r = this._virtualStart; e < this._physicalCount; e++, r++)
        if ((i = n.call(this, e, r)) != null)
          return i;
      for (e = 0; e < this._physicalStart; e++, r++)
        if ((i = n.call(this, e, r)) != null)
          return i;
    }
  },
  /**
   * Returns the virtual index for a given physical index
   *
   * @param {number} pidx Physical index
   * @return {number}
   */
  _computeVidx(n) {
    return n >= this._physicalStart ? this._virtualStart + (n - this._physicalStart) : this._virtualStart + (this._physicalCount - this._physicalStart) + n;
  },
  /**
   * Updates the position of the physical items.
   */
  _positionItems() {
    this._adjustScrollPosition();
    let n = this._physicalTop;
    this._iterateItems((t) => {
      this.translate3d(0, `${n}px`, 0, this._physicalItems[t]), n += this._physicalSizes[t];
    });
  },
  _getPhysicalSizeIncrement(n) {
    return this._physicalSizes[n];
  },
  /**
   * Adjusts the scroll position when it was overestimated.
   */
  _adjustScrollPosition() {
    const n = this._virtualStart === 0 ? this._physicalTop : Math.min(this._scrollPosition + this._physicalTop, 0);
    if (n !== 0) {
      this._physicalTop -= n;
      const t = this._scrollPosition;
      !wf && t > 0 && this._resetScrollPosition(t - n);
    }
  },
  /**
   * Sets the position of the scroll.
   */
  _resetScrollPosition(n) {
    this.scrollTarget && n >= 0 && (this._scrollTop = n, this._scrollPosition = this._scrollTop);
  },
  /**
   * Sets the scroll height, that's the height of the content,
   *
   * @param {boolean=} forceUpdate If true, updates the height no matter what.
   */
  _updateScrollerSize(n) {
    const t = this._physicalBottom + Math.max(this._virtualCount - this._physicalCount - this._virtualStart, 0) * this._physicalAverage;
    this._estScrollHeight = t, (n || this._scrollHeight === 0 || this._scrollPosition >= t - this._physicalSize || Math.abs(t - this._scrollHeight) >= this._viewportHeight) && (this.$.items.style.height = `${t}px`, this._scrollHeight = t);
  },
  /**
   * Scroll to a specific index in the virtual list regardless
   * of the physical items in the DOM tree.
   *
   * @method scrollToIndex
   * @param {number} idx The index of the item
   */
  scrollToIndex(n) {
    if (typeof n != "number" || n < 0 || n > this.items.length - 1 || (Nr(), this._physicalCount === 0))
      return;
    n = this._clamp(n, 0, this._virtualCount - 1), (!this._isIndexRendered(n) || n >= this._maxVirtualStart) && (this._virtualStart = n - 1), this._assignModels(), this._updateMetrics(), this._physicalTop = this._virtualStart * this._physicalAverage;
    let t = this._physicalStart, e = this._virtualStart, r = 0;
    const i = this._hiddenContentSize;
    for (; e < n && r <= i; )
      r += this._getPhysicalSizeIncrement(t), t = (t + 1) % this._physicalCount, e += 1;
    this._updateScrollerSize(!0), this._positionItems(), this._resetScrollPosition(this._physicalTop + this._scrollOffset + r), this._increasePoolIfNeeded(0), this._firstVisibleIndexVal = null, this._lastVisibleIndexVal = null;
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
      zt
    );
  },
  _isIndexRendered(n) {
    return n >= this._virtualStart && n <= this._virtualEnd;
  },
  _getPhysicalIndex(n) {
    return (this._physicalStart + (n - this._virtualStart)) % this._physicalCount;
  },
  _clamp(n, t, e) {
    return Math.min(e, Math.max(t, n));
  },
  _debounce(n, t, e) {
    this._debouncers || (this._debouncers = {}), this._debouncers[n] = ie.debounce(this._debouncers[n], e, t.bind(this)), dc(this._debouncers[n]);
  }
};
/**
 * @license
 * Copyright (c) 2021 - 2024 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
const Ef = 1e5, _o = 1e3;
class wc {
  constructor({ createElements: t, updateElement: e, scrollTarget: r, scrollContainer: i, elementsContainer: s, reorderElements: l }) {
    this.isAttached = !0, this._vidxOffset = 0, this.createElements = t, this.updateElement = e, this.scrollTarget = r, this.scrollContainer = i, this.elementsContainer = s || i, this.reorderElements = l, this._maxPages = 1.3, this.__placeholderHeight = 200, this.__elementHeightQueue = Array(10), this.timeouts = {
      SCROLL_REORDER: 500,
      IGNORE_WHEEL: 500,
      FIX_INVALID_ITEM_POSITIONING: 100
    }, this.__resizeObserver = new ResizeObserver(() => this._resizeHandler()), getComputedStyle(this.scrollTarget).overflow === "visible" && (this.scrollTarget.style.overflow = "auto"), getComputedStyle(this.scrollContainer).position === "static" && (this.scrollContainer.style.position = "relative"), this.__resizeObserver.observe(this.scrollTarget), this.scrollTarget.addEventListener("scroll", () => this._scrollHandler()), this._scrollLineHeight = this._getScrollLineHeight(), this.scrollTarget.addEventListener("wheel", (d) => this.__onWheel(d)), this.scrollTarget.addEventListener("virtualizer-element-focused", (d) => this.__onElementFocused(d)), this.elementsContainer.addEventListener("focusin", (d) => {
      this.scrollTarget.dispatchEvent(
        new CustomEvent("virtualizer-element-focused", { detail: { element: this.__getFocusedElement() } })
      );
    }), this.reorderElements && (this.scrollTarget.addEventListener("mousedown", () => {
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
  get _maxVirtualIndexOffset() {
    return this.size - this._virtualCount;
  }
  __hasPlaceholders() {
    return this.__getVisibleElements().some((t) => t.__virtualizerPlaceholder);
  }
  scrollToIndex(t) {
    if (typeof t != "number" || isNaN(t) || this.size === 0 || !this.scrollTarget.offsetHeight)
      return;
    delete this.__pendingScrollToIndex, this._physicalCount <= 3 && this.flush(), t = this._clamp(t, 0, this.size - 1);
    const e = this.__getVisibleElements().length;
    let r = Math.floor(t / this.size * this._virtualCount);
    this._virtualCount - r < e ? (r = this._virtualCount - (this.size - t), this._vidxOffset = this._maxVirtualIndexOffset) : r < e ? t < _o ? (r = t, this._vidxOffset = 0) : (r = _o, this._vidxOffset = t - r) : this._vidxOffset = t - r, this.__skipNextVirtualIndexAdjust = !0, super.scrollToIndex(r), this.adjustedFirstVisibleIndex !== t && this._scrollTop < this._maxScrollTop && !this.grid && (this._scrollTop -= this.__getIndexScrollOffset(t) || 0), this._scrollHandler(), this.__hasPlaceholders() && (this.__pendingScrollToIndex = t);
  }
  flush() {
    this.scrollTarget.offsetHeight !== 0 && (this._resizeHandler(), Nr(), this._scrollHandler(), this.__fixInvalidItemPositioningDebouncer && this.__fixInvalidItemPositioningDebouncer.flush(), this.__scrollReorderDebouncer && this.__scrollReorderDebouncer.flush(), this.__debouncerWheelAnimationFrame && this.__debouncerWheelAnimationFrame.flush());
  }
  update(t = 0, e = this.size - 1) {
    const r = [];
    this.__getVisibleElements().forEach((i) => {
      i.__virtualIndex >= t && i.__virtualIndex <= e && (this.__updateElement(i, i.__virtualIndex, !0), r.push(i));
    }), this.__afterElementsUpdated(r);
  }
  /**
   * Updates the height for a given set of items.
   *
   * @param {!Array<number>=} itemSet
   */
  _updateMetrics(t) {
    Nr();
    let e = 0, r = 0;
    const i = this._physicalAverageCount, s = this._physicalAverage;
    this._iterateItems((l, d) => {
      r += this._physicalSizes[l], this._physicalSizes[l] = Math.ceil(this.__getBorderBoxHeight(this._physicalItems[l])), e += this._physicalSizes[l], this._physicalAverageCount += this._physicalSizes[l] ? 1 : 0;
    }, t), this._physicalSize = this._physicalSize + e - r, this._physicalAverageCount !== i && (this._physicalAverage = Math.round(
      (s * i + e) / this._physicalAverageCount
    ));
  }
  __getBorderBoxHeight(t) {
    const e = getComputedStyle(t), r = parseFloat(e.height) || 0;
    if (e.boxSizing === "border-box")
      return r;
    const i = parseFloat(e.paddingBottom) || 0, s = parseFloat(e.paddingTop) || 0, l = parseFloat(e.borderBottomWidth) || 0, d = parseFloat(e.borderTopWidth) || 0;
    return r + i + s + l + d;
  }
  __updateElement(t, e, r) {
    t.__virtualizerPlaceholder && (t.style.paddingTop = "", t.style.opacity = "", t.__virtualizerPlaceholder = !1), !this.__preventElementUpdates && (t.__lastUpdatedIndex !== e || r) && (this.updateElement(t, e), t.__lastUpdatedIndex = e);
  }
  /**
   * Called synchronously right after elements have been updated.
   * This is a good place to do any post-update work.
   *
   * @param {!Array<!HTMLElement>} updatedElements
   */
  __afterElementsUpdated(t) {
    t.forEach((e) => {
      const r = e.offsetHeight;
      if (r === 0)
        e.style.paddingTop = `${this.__placeholderHeight}px`, e.style.opacity = "0", e.__virtualizerPlaceholder = !0, this.__placeholderClearDebouncer = ie.debounce(
          this.__placeholderClearDebouncer,
          zt,
          () => this._resizeHandler()
        );
      else {
        this.__elementHeightQueue.push(r), this.__elementHeightQueue.shift();
        const i = this.__elementHeightQueue.filter((s) => s !== void 0);
        this.__placeholderHeight = Math.round(i.reduce((s, l) => s + l, 0) / i.length);
      }
    }), this.__pendingScrollToIndex !== void 0 && !this.__hasPlaceholders() && this.scrollToIndex(this.__pendingScrollToIndex);
  }
  __getIndexScrollOffset(t) {
    const e = this.__getVisibleElements().find((r) => r.__virtualIndex === t);
    return e ? this.scrollTarget.getBoundingClientRect().top - e.getBoundingClientRect().top : void 0;
  }
  get size() {
    return this.__size;
  }
  set size(t) {
    if (t === this.size)
      return;
    this.__fixInvalidItemPositioningDebouncer && this.__fixInvalidItemPositioningDebouncer.cancel(), this._debouncers && this._debouncers._increasePoolIfNeeded && this._debouncers._increasePoolIfNeeded.cancel(), this.__preventElementUpdates = !0;
    let e, r;
    if (t > 0 && (e = this.adjustedFirstVisibleIndex, r = this.__getIndexScrollOffset(e)), this.__size = t, this._itemsChanged({
      path: "items"
    }), Nr(), t > 0) {
      e = Math.min(e, t - 1), this.scrollToIndex(e);
      const i = this.__getIndexScrollOffset(e);
      r !== void 0 && i !== void 0 && (this._scrollTop += r - i);
    }
    this.__preventElementUpdates = !1, this._isVisible || this._assignModels(), this.elementsContainer.children.length || requestAnimationFrame(() => this._resizeHandler()), this._resizeHandler(), Nr(), this._debounce("_update", this._update, $e);
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
      length: Math.min(this.size, Ef)
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
    const e = this.createElements(t), r = document.createDocumentFragment();
    return e.forEach((i) => {
      i.style.position = "absolute", r.appendChild(i), this.__resizeObserver.observe(i);
    }), this.elementsContainer.appendChild(r), e;
  }
  /** @private */
  _assignModels(t) {
    const e = [];
    this._iterateItems((r, i) => {
      const s = this._physicalItems[r];
      s.hidden = i >= this.size, s.hidden ? delete s.__lastUpdatedIndex : (s.__virtualIndex = i + (this._vidxOffset || 0), this.__updateElement(s, s.__virtualIndex), e.push(s));
    }, t), this.__afterElementsUpdated(e);
  }
  /** @private */
  _isClientFull() {
    return setTimeout(() => {
      this.__clientFull = !0;
    }), this.__clientFull || super._isClientFull();
  }
  /** @private */
  translate3d(t, e, r, i) {
    i.style.transform = `translateY(${e})`;
  }
  /** @private */
  toggleScrollListener() {
  }
  /** @private */
  __getFocusedElement(t = this.__getVisibleElements()) {
    return t.find(
      (e) => e.contains(this.elementsContainer.getRootNode().activeElement) || e.contains(this.scrollTarget.getRootNode().activeElement)
    );
  }
  /** @private */
  __nextFocusableSiblingMissing(t, e) {
    return (
      // Check if focused element is the last visible DOM element
      e.indexOf(t) === e.length - 1 && // ...while there are more items available
      this.size > t.__virtualIndex + 1
    );
  }
  /** @private */
  __previousFocusableSiblingMissing(t, e) {
    return (
      // Check if focused element is the first visible DOM element
      e.indexOf(t) === 0 && // ...while there are preceding items available
      t.__virtualIndex > 0
    );
  }
  /** @private */
  __onElementFocused(t) {
    if (!this.reorderElements)
      return;
    const e = t.detail.element;
    if (!e)
      return;
    const r = this.__getVisibleElements();
    (this.__previousFocusableSiblingMissing(e, r) || this.__nextFocusableSiblingMissing(e, r)) && this.flush();
    const i = this.__getVisibleElements();
    this.__nextFocusableSiblingMissing(e, i) ? (this._scrollTop += Math.ceil(e.getBoundingClientRect().bottom) - Math.floor(this.scrollTarget.getBoundingClientRect().bottom - 1), this.flush()) : this.__previousFocusableSiblingMissing(e, i) && (this._scrollTop -= Math.ceil(this.scrollTarget.getBoundingClientRect().top + 1) - Math.floor(e.getBoundingClientRect().top), this.flush());
  }
  _scrollHandler() {
    if (this.scrollTarget.offsetHeight === 0)
      return;
    this._adjustVirtualIndexOffset(this._scrollTop - (this.__previousScrollTop || 0));
    const t = this.scrollTarget.scrollTop - this._scrollPosition;
    if (super._scrollHandler(), this._physicalCount !== 0) {
      const e = t >= 0, r = this._getReusables(!e);
      r.indexes.length && (this._physicalTop = r.physicalTop, e ? (this._virtualStart -= r.indexes.length, this._physicalStart -= r.indexes.length) : (this._virtualStart += r.indexes.length, this._physicalStart += r.indexes.length), this._resizeHandler());
    }
    t && (this.__fixInvalidItemPositioningDebouncer = ie.debounce(
      this.__fixInvalidItemPositioningDebouncer,
      Ke.after(this.timeouts.FIX_INVALID_ITEM_POSITIONING),
      () => this.__fixInvalidItemPositioning()
    )), this.reorderElements && (this.__scrollReorderDebouncer = ie.debounce(
      this.__scrollReorderDebouncer,
      Ke.after(this.timeouts.SCROLL_REORDER),
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
    const t = this._physicalTop > this._scrollTop, e = this._physicalBottom < this._scrollBottom, r = this.adjustedFirstVisibleIndex === 0, i = this.adjustedLastVisibleIndex === this.size - 1;
    if (t && !r || e && !i) {
      const s = e, l = this._ratio;
      this._ratio = 0, this._scrollPosition = this._scrollTop + (s ? -1 : 1), this._scrollHandler(), this._ratio = l;
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
    e += this._deltaYAcc, this._deltaYAcc = 0, this._wheelAnimationFrame = !0, this.__debouncerWheelAnimationFrame = ie.debounce(
      this.__debouncerWheelAnimationFrame,
      zt,
      () => {
        this._wheelAnimationFrame = !1;
      }
    );
    const r = Math.abs(t.deltaX) + Math.abs(e);
    this._canScroll(this.scrollTarget, t.deltaX, e) ? (t.preventDefault(), this.scrollTarget.scrollTop += e, this.scrollTarget.scrollLeft += t.deltaX, this._hasResidualMomentum = !0, this._ignoreNewWheel = !0, this._debouncerIgnoreNewWheel = ie.debounce(
      this._debouncerIgnoreNewWheel,
      Ke.after(this.timeouts.IGNORE_WHEEL),
      () => {
        this._ignoreNewWheel = !1;
      }
    )) : this._hasResidualMomentum && r <= this._previousMomentum || this._ignoreNewWheel ? t.preventDefault() : r > this._previousMomentum && (this._hasResidualMomentum = !1), this._previousMomentum = r;
  }
  /**
   * Determines if the element has an ancestor that handles the scroll delta prior to this
   *
   * @private
   */
  _hasScrolledAncestor(t, e, r) {
    if (t === this.scrollTarget || t === this.scrollTarget.getRootNode().host)
      return !1;
    if (this._canScroll(t, e, r) && ["auto", "scroll"].indexOf(getComputedStyle(t).overflow) !== -1)
      return !0;
    if (t !== this && t.parentElement)
      return this._hasScrolledAncestor(t.parentElement, e, r);
  }
  _canScroll(t, e, r) {
    return r > 0 && t.scrollTop < t.scrollHeight - t.offsetHeight || r < 0 && t.scrollTop > 0 || e > 0 && t.scrollLeft < t.scrollWidth - t.offsetWidth || e < 0 && t.scrollLeft > 0;
  }
  /**
   * Increases the pool size.
   * @override
   */
  _increasePoolIfNeeded(t) {
    if (this._physicalCount > 2 && t) {
      const r = Math.ceil(this._optPhysicalSize / this._physicalAverage) - this._physicalCount;
      super._increasePoolIfNeeded(Math.max(t, Math.min(100, r)));
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
    const t = this._virtualStart + (this._vidxOffset || 0), e = this.__getVisibleElements(), r = this.__getFocusedElement(e) || e[0];
    if (!r)
      return;
    const i = r.__virtualIndex - t, s = e.indexOf(r) - i;
    if (s > 0)
      for (let l = 0; l < s; l++)
        this.elementsContainer.appendChild(e[l]);
    else if (s < 0)
      for (let l = e.length + s; l < e.length; l++)
        this.elementsContainer.insertBefore(e[l], e[0]);
    if (vc) {
      const { transform: l } = this.scrollTarget.style;
      this.scrollTarget.style.transform = "translateZ(0)", setTimeout(() => {
        this.scrollTarget.style.transform = l;
      });
    }
  }
  /** @private */
  _adjustVirtualIndexOffset(t) {
    const e = this._maxVirtualIndexOffset;
    if (this._virtualCount >= this.size)
      this._vidxOffset = 0;
    else if (this.__skipNextVirtualIndexAdjust)
      this.__skipNextVirtualIndexAdjust = !1;
    else if (Math.abs(t) > 1e4) {
      const r = this._scrollTop / (this.scrollTarget.scrollHeight - this.scrollTarget.clientHeight);
      this._vidxOffset = Math.round(r * e);
    } else {
      const r = this._vidxOffset, i = _o, s = 100;
      this._scrollTop === 0 ? (this._vidxOffset = 0, r !== this._vidxOffset && super.scrollToIndex(0)) : this.firstVisibleIndex < i && this._vidxOffset > 0 && (this._vidxOffset -= Math.min(this._vidxOffset, s), super.scrollToIndex(this.firstVisibleIndex + (r - this._vidxOffset))), this._scrollTop >= this._maxScrollTop && this._maxScrollTop > 0 ? (this._vidxOffset = e, r !== this._vidxOffset && super.scrollToIndex(this._virtualCount - 1)) : this.firstVisibleIndex > this._virtualCount - i && this._vidxOffset < e && (this._vidxOffset += Math.min(e - this._vidxOffset, s), super.scrollToIndex(this.firstVisibleIndex - (this._vidxOffset - r)));
    }
  }
}
Object.setPrototypeOf(wc.prototype, Cf);
class Cc {
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
    this.__adapter = new wc(t);
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
 * Copyright (c) 2016 - 2024 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
const Af = (n) => class extends n {
  static get observers() {
    return ["_a11yUpdateGridSize(size, _columnTree)"];
  }
  /** @private */
  _a11yGetHeaderRowCount(e) {
    return e.filter(
      (r) => r.some((i) => i.headerRenderer || i.path && i.header !== null || i.header)
    ).length;
  }
  /** @private */
  _a11yGetFooterRowCount(e) {
    return e.filter((r) => r.some((i) => i.headerRenderer)).length;
  }
  /** @private */
  _a11yUpdateGridSize(e, r) {
    if (e === void 0 || r === void 0)
      return;
    const i = r[r.length - 1];
    this.$.table.setAttribute(
      "aria-rowcount",
      e + this._a11yGetHeaderRowCount(r) + this._a11yGetFooterRowCount(r)
    ), this.$.table.setAttribute("aria-colcount", i && i.length || 0), this._a11yUpdateHeaderRows(), this._a11yUpdateFooterRows();
  }
  /** @protected */
  _a11yUpdateHeaderRows() {
    Pe(this.$.header, (e, r) => {
      e.setAttribute("aria-rowindex", r + 1);
    });
  }
  /** @protected */
  _a11yUpdateFooterRows() {
    Pe(this.$.footer, (e, r) => {
      e.setAttribute("aria-rowindex", this._a11yGetHeaderRowCount(this._columnTree) + this.size + r + 1);
    });
  }
  /**
   * @param {!HTMLElement} row
   * @param {number} index
   * @protected
   */
  _a11yUpdateRowRowindex(e, r) {
    e.setAttribute("aria-rowindex", r + this._a11yGetHeaderRowCount(this._columnTree) + 1);
  }
  /**
   * @param {!HTMLElement} row
   * @param {boolean} selected
   * @protected
   */
  _a11yUpdateRowSelected(e, r) {
    e.setAttribute("aria-selected", !!r), or(e, (i) => {
      i.setAttribute("aria-selected", !!r);
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
  _a11yUpdateRowLevel(e, r) {
    r > 0 || this.__isRowCollapsible(e) || this.__isRowExpandable(e) ? e.setAttribute("aria-level", r + 1) : e.removeAttribute("aria-level");
  }
  /**
   * @param {!HTMLElement} row
   * @param {!HTMLElement} detailsCell
   * @protected
   */
  _a11ySetRowDetailsCell(e, r) {
    or(e, (i) => {
      i !== r && i.setAttribute("aria-controls", r.id);
    });
  }
  /**
   * @param {!HTMLElement} row
   * @param {number} colspan
   * @protected
   */
  _a11yUpdateCellColspan(e, r) {
    e.setAttribute("aria-colspan", Number(r));
  }
  /** @protected */
  _a11yUpdateSorters() {
    Array.from(this.querySelectorAll("vaadin-grid-sorter")).forEach((e) => {
      let r = e.parentNode;
      for (; r && r.localName !== "vaadin-grid-cell-content"; )
        r = r.parentNode;
      r && r.assignedSlot && r.assignedSlot.parentNode.setAttribute(
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
 * Copyright (c) 2016 - 2024 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
const kf = (n) => {
  if (!n.parentNode)
    return !1;
  const e = Array.from(
    n.parentNode.querySelectorAll(
      "[tabindex], button, input, select, textarea, object, iframe, a[href], area[href]"
    )
  ).filter((r) => {
    const i = r.getAttribute("part");
    return !(i && i.includes("body-cell"));
  }).includes(n);
  return !n.disabled && e && n.offsetParent && getComputedStyle(n).visibility !== "hidden";
}, Pf = (n) => class extends n {
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
        value: null,
        sync: !0
      }
    };
  }
  /** @protected */
  ready() {
    super.ready(), this.$.scroller.addEventListener("click", this._onClick.bind(this)), this.addEventListener("cell-activate", this._activateItem.bind(this)), this.addEventListener("row-activate", this._activateItem.bind(this));
  }
  /** @private */
  _activateItem(e) {
    const r = e.detail.model, i = r ? r.item : null;
    i && (this.activeItem = this._itemsEqual(this.activeItem, i) ? null : i);
  }
  /**
   * Checks whether the click event should not activate the cell on which it occurred.
   *
   * @protected
   */
  _shouldPreventCellActivationOnClick(e) {
    const { cell: r } = this._getGridEventLocation(e);
    return (
      // Something has handled this click already, e. g., <vaadin-grid-sorter>
      e.defaultPrevented || // No clicked cell available
      !r || // Cell is a details cell
      r.getAttribute("part").includes("details-cell") || // Cell content is focused
      r._content.contains(this.getRootNode().activeElement) || // Clicked on a focusable element
      this._isFocusable(e.target) || // Clicked on a label element
      e.target instanceof HTMLLabelElement
    );
  }
  /**
   * @param {!MouseEvent} e
   * @protected
   */
  _onClick(e) {
    if (this._shouldPreventCellActivationOnClick(e))
      return;
    const { cell: r } = this._getGridEventLocation(e);
    r && this.dispatchEvent(
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
    return kf(e);
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
function Zt(n, t) {
  return n.split(".").reduce((e, r) => e[r], t);
}
function Xa(n, t, e) {
  if (e.length === 0)
    return !1;
  let r = !0;
  return n.forEach(({ path: i }) => {
    if (!i || i.indexOf(".") === -1)
      return;
    const s = i.replace(/\.[^.]*$/u, "");
    Zt(s, e[0]) === void 0 && (r = !1);
  }), r;
}
function on(n) {
  return [void 0, null].indexOf(n) >= 0 ? "" : isNaN(n) ? n.toString() : n;
}
function Ja(n, t) {
  return n = on(n), t = on(t), n < t ? -1 : n > t ? 1 : 0;
}
function Sf(n, t) {
  return n.sort((e, r) => t.map((i) => i.direction === "asc" ? Ja(Zt(i.path, e), Zt(i.path, r)) : i.direction === "desc" ? Ja(Zt(i.path, r), Zt(i.path, e)) : 0).reduce((i, s) => i !== 0 ? i : s, 0));
}
function If(n, t) {
  return n.filter((e) => t.every((r) => {
    const i = on(Zt(r.path, e)), s = on(r.value).toString().toLowerCase();
    return i.toString().toLowerCase().includes(s);
  }));
}
const Tf = (n) => (t, e) => {
  let r = n ? [...n] : [];
  t.filters && Xa(t.filters, "filtering", r) && (r = If(r, t.filters)), Array.isArray(t.sortOrders) && t.sortOrders.length && Xa(t.sortOrders, "sorting", r) && (r = Sf(r, t.sortOrders));
  const i = Math.min(r.length, t.pageSize), s = t.page * i, l = s + i, d = r.slice(s, l);
  e(d, r.length);
};
/**
 * @license
 * Copyright (c) 2016 - 2024 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
const Of = (n) => class extends n {
  static get properties() {
    return {
      /**
       * An array containing the items which will be passed to renderer functions.
       *
       * @type {Array<!GridItem> | undefined}
       */
      items: {
        type: Array,
        sync: !0
      }
    };
  }
  static get observers() {
    return ["__dataProviderOrItemsChanged(dataProvider, items, isAttached, items.*)"];
  }
  /** @private */
  __setArrayDataProvider(e) {
    const r = Tf(this.items);
    r.__items = e, this._arrayDataProvider = r, this.size = e.length, this.dataProvider = r;
  }
  /**
   * @override
   * @protected
   */
  _onDataProviderPageReceived() {
    super._onDataProviderPageReceived(), this._arrayDataProvider && (this.size = this._flatSize);
  }
  /** @private */
  __dataProviderOrItemsChanged(e, r, i) {
    i && (this._arrayDataProvider ? e !== this._arrayDataProvider ? (this._arrayDataProvider = void 0, this.items = void 0) : r ? this._arrayDataProvider.__items === r ? this.clearCache() : this.__setArrayDataProvider(r) : (this._arrayDataProvider = void 0, this.dataProvider = void 0, this.size = 0, this.clearCache()) : r && this.__setArrayDataProvider(r));
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
const zf = !1, Rf = (n) => n, _s = typeof document.head.style.touchAction == "string", Wo = "__polymerGestures", mo = "__polymerGesturesHandled", Go = "__polymerGesturesTouchAction", Qa = 25, el = 5, $f = 2, Nf = ["mousedown", "mousemove", "mouseup", "click"], Df = [0, 1, 4, 2], Mf = function() {
  try {
    return new MouseEvent("test", { buttons: 1 }).buttons === 1;
  } catch {
    return !1;
  }
}();
function ms(n) {
  return Nf.indexOf(n) > -1;
}
let Ec = !1;
(function() {
  try {
    const n = Object.defineProperty({}, "passive", {
      // eslint-disable-next-line getter-return
      get() {
        Ec = !0;
      }
    });
    window.addEventListener("test", null, n), window.removeEventListener("test", null, n);
  } catch {
  }
})();
function Ff(n) {
  if (!(ms(n) || n === "touchend") && _s && Ec && zf)
    return { passive: !0 };
}
const Lf = navigator.userAgent.match(/iP(?:[oa]d|hone)|Android/u), Bf = {
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
function It(n) {
  const t = n.type;
  if (!ms(t))
    return !1;
  if (t === "mousemove") {
    let r = n.buttons === void 0 ? 1 : n.buttons;
    return n instanceof window.MouseEvent && !Mf && (r = Df[n.which] || 0), !!(r & 1);
  }
  return (n.button === void 0 ? 0 : n.button) === 0;
}
function Vf(n) {
  if (n.type === "click") {
    if (n.detail === 0)
      return !0;
    const t = st(n);
    if (!t.nodeType || /** @type {Element} */
    t.nodeType !== Node.ELEMENT_NODE)
      return !0;
    const e = (
      /** @type {Element} */
      t.getBoundingClientRect()
    ), r = n.pageX, i = n.pageY;
    return !(r >= e.left && r <= e.right && i >= e.top && i <= e.bottom);
  }
  return !1;
}
const qe = {
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
function Hf(n) {
  let t = "auto";
  const e = kc(n);
  for (let r = 0, i; r < e.length; r++)
    if (i = e[r], i[Go]) {
      t = i[Go];
      break;
    }
  return t;
}
function Ac(n, t, e) {
  n.movefn = t, n.upfn = e, document.addEventListener("mousemove", t), document.addEventListener("mouseup", e);
}
function er(n) {
  document.removeEventListener("mousemove", n.movefn), document.removeEventListener("mouseup", n.upfn), n.movefn = null, n.upfn = null;
}
const kc = window.ShadyDOM && window.ShadyDOM.noPatch ? window.ShadyDOM.composedPath : (n) => n.composedPath && n.composedPath() || [], gs = {}, At = [];
function Uf(n, t) {
  let e = document.elementFromPoint(n, t), r = e;
  for (; r && r.shadowRoot && !window.ShadyDOM; ) {
    const i = r;
    if (r = r.shadowRoot.elementFromPoint(n, t), i === r)
      break;
    r && (e = r);
  }
  return e;
}
function st(n) {
  const t = kc(
    /** @type {?Event} */
    n
  );
  return t.length > 0 ? t[0] : n.target;
}
function jf(n) {
  const t = n.type, r = n.currentTarget[Wo];
  if (!r)
    return;
  const i = r[t];
  if (!i)
    return;
  if (!n[mo] && (n[mo] = {}, t.startsWith("touch"))) {
    const l = n.changedTouches[0];
    if (t === "touchstart" && n.touches.length === 1 && (qe.touch.id = l.identifier), qe.touch.id !== l.identifier)
      return;
    _s || (t === "touchstart" || t === "touchmove") && qf(n);
  }
  const s = n[mo];
  if (!s.skip) {
    for (let l = 0, d; l < At.length; l++)
      d = At[l], i[d.name] && !s[d.name] && d.flow && d.flow.start.indexOf(n.type) > -1 && d.reset && d.reset();
    for (let l = 0, d; l < At.length; l++)
      d = At[l], i[d.name] && !s[d.name] && (s[d.name] = !0, d[t](n));
  }
}
function qf(n) {
  const t = n.changedTouches[0], e = n.type;
  if (e === "touchstart")
    qe.touch.x = t.clientX, qe.touch.y = t.clientY, qe.touch.scrollDecided = !1;
  else if (e === "touchmove") {
    if (qe.touch.scrollDecided)
      return;
    qe.touch.scrollDecided = !0;
    const r = Hf(n);
    let i = !1;
    const s = Math.abs(qe.touch.x - t.clientX), l = Math.abs(qe.touch.y - t.clientY);
    n.cancelable && (r === "none" ? i = !0 : r === "pan-x" ? i = l > s : r === "pan-y" && (i = s > l)), i ? n.preventDefault() : sn("track");
  }
}
function Pc(n, t, e) {
  return gs[t] ? (Kf(n, t, e), !0) : !1;
}
function Kf(n, t, e) {
  const r = gs[t], i = r.deps, s = r.name;
  let l = n[Wo];
  l || (n[Wo] = l = {});
  for (let d = 0, f, m; d < i.length; d++)
    f = i[d], !(Lf && ms(f) && f !== "click") && (m = l[f], m || (l[f] = m = { _count: 0 }), m._count === 0 && n.addEventListener(f, jf, Ff(f)), m[s] = (m[s] || 0) + 1, m._count = (m._count || 0) + 1);
  n.addEventListener(t, e), r.touchAction && Gf(n, r.touchAction);
}
function bs(n) {
  At.push(n), n.emits.forEach((t) => {
    gs[t] = n;
  });
}
function Wf(n) {
  for (let t = 0, e; t < At.length; t++) {
    e = At[t];
    for (let r = 0, i; r < e.emits.length; r++)
      if (i = e.emits[r], i === n)
        return e;
  }
  return null;
}
function Gf(n, t) {
  _s && n instanceof HTMLElement && $e.run(() => {
    n.style.touchAction = t;
  }), n[Go] = t;
}
function vs(n, t, e) {
  const r = new Event(t, { bubbles: !0, cancelable: !0, composed: !0 });
  if (r.detail = e, Rf(
    /** @type {!Node} */
    n
  ).dispatchEvent(r), r.defaultPrevented) {
    const i = e.preventer || e.sourceEvent;
    i && i.preventDefault && i.preventDefault();
  }
}
function sn(n) {
  const t = Wf(n);
  t.info && (t.info.prevent = !0);
}
bs({
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
    er(this.info);
  },
  /**
   * @this {GestureRecognizer}
   * @param {MouseEvent} e
   * @return {void}
   */
  mousedown(n) {
    if (!It(n))
      return;
    const t = st(n), e = this, r = (s) => {
      It(s) || (Tr("up", t, s), er(e.info));
    }, i = (s) => {
      It(s) && Tr("up", t, s), er(e.info);
    };
    Ac(this.info, r, i), Tr("down", t, n);
  },
  /**
   * @this {GestureRecognizer}
   * @param {TouchEvent} e
   * @return {void}
   */
  touchstart(n) {
    Tr("down", st(n), n.changedTouches[0], n);
  },
  /**
   * @this {GestureRecognizer}
   * @param {TouchEvent} e
   * @return {void}
   */
  touchend(n) {
    Tr("up", st(n), n.changedTouches[0], n);
  }
});
function Tr(n, t, e, r) {
  t && vs(t, n, {
    x: e.clientX,
    y: e.clientY,
    sourceEvent: e,
    preventer: r,
    prevent(i) {
      return sn(i);
    }
  });
}
bs({
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
    addMove(n) {
      this.moves.length > $f && this.moves.shift(), this.moves.push(n);
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
    this.info.state = "start", this.info.started = !1, this.info.moves = [], this.info.x = 0, this.info.y = 0, this.info.prevent = !1, er(this.info);
  },
  /**
   * @this {GestureRecognizer}
   * @param {MouseEvent} e
   * @return {void}
   */
  mousedown(n) {
    if (!It(n))
      return;
    const t = st(n), e = this, r = (s) => {
      const l = s.clientX, d = s.clientY;
      tl(e.info, l, d) && (e.info.state = e.info.started ? s.type === "mouseup" ? "end" : "track" : "start", e.info.state === "start" && sn("tap"), e.info.addMove({ x: l, y: d }), It(s) || (e.info.state = "end", er(e.info)), t && go(e.info, t, s), e.info.started = !0);
    }, i = (s) => {
      e.info.started && r(s), er(e.info);
    };
    Ac(this.info, r, i), this.info.x = n.clientX, this.info.y = n.clientY;
  },
  /**
   * @this {GestureRecognizer}
   * @param {TouchEvent} e
   * @return {void}
   */
  touchstart(n) {
    const t = n.changedTouches[0];
    this.info.x = t.clientX, this.info.y = t.clientY;
  },
  /**
   * @this {GestureRecognizer}
   * @param {TouchEvent} e
   * @return {void}
   */
  touchmove(n) {
    const t = st(n), e = n.changedTouches[0], r = e.clientX, i = e.clientY;
    tl(this.info, r, i) && (this.info.state === "start" && sn("tap"), this.info.addMove({ x: r, y: i }), go(this.info, t, e), this.info.state = "track", this.info.started = !0);
  },
  /**
   * @this {GestureRecognizer}
   * @param {TouchEvent} e
   * @return {void}
   */
  touchend(n) {
    const t = st(n), e = n.changedTouches[0];
    this.info.started && (this.info.state = "end", this.info.addMove({ x: e.clientX, y: e.clientY }), go(this.info, t, e));
  }
});
function tl(n, t, e) {
  if (n.prevent)
    return !1;
  if (n.started)
    return !0;
  const r = Math.abs(n.x - t), i = Math.abs(n.y - e);
  return r >= el || i >= el;
}
function go(n, t, e) {
  if (!t)
    return;
  const r = n.moves[n.moves.length - 2], i = n.moves[n.moves.length - 1], s = i.x - n.x, l = i.y - n.y;
  let d, f = 0;
  r && (d = i.x - r.x, f = i.y - r.y), vs(t, "track", {
    state: n.state,
    x: e.clientX,
    y: e.clientY,
    dx: s,
    dy: l,
    ddx: d,
    ddy: f,
    sourceEvent: e,
    hover() {
      return Uf(e.clientX, e.clientY);
    }
  });
}
bs({
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
  mousedown(n) {
    It(n) && (this.info.x = n.clientX, this.info.y = n.clientY);
  },
  /**
   * @this {GestureRecognizer}
   * @param {MouseEvent} e
   * @return {void}
   */
  click(n) {
    It(n) && rl(this.info, n);
  },
  /**
   * @this {GestureRecognizer}
   * @param {TouchEvent} e
   * @return {void}
   */
  touchstart(n) {
    const t = n.changedTouches[0];
    this.info.x = t.clientX, this.info.y = t.clientY;
  },
  /**
   * @this {GestureRecognizer}
   * @param {TouchEvent} e
   * @return {void}
   */
  touchend(n) {
    rl(this.info, n.changedTouches[0], n);
  }
});
function rl(n, t, e) {
  const r = Math.abs(t.clientX - n.x), i = Math.abs(t.clientY - n.y), s = st(e || t);
  !s || Bf[
    /** @type {!HTMLElement} */
    s.localName
  ] && s.hasAttribute("disabled") || (isNaN(r) || isNaN(i) || r <= Qa && i <= Qa || Vf(t)) && (n.prevent || vs(s, "tap", {
    x: t.clientX,
    y: t.clientY,
    sourceEvent: t,
    preventer: e
  }));
}
/**
 * @license
 * Copyright (c) 2016 - 2024 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
const Yf = (n) => class extends n {
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
    super.ready(), Pc(this, "track", this._onTrackEvent), this._reorderGhost = this.shadowRoot.querySelector('[part="reorder-ghost"]'), this.addEventListener("touchstart", this._onTouchStart.bind(this)), this.addEventListener("touchmove", this._onTouchMove.bind(this)), this.addEventListener("touchend", this._onTouchEnd.bind(this)), this.addEventListener("contextmenu", this._onContextMenu.bind(this));
  }
  /** @private */
  _onContextMenu(e) {
    this.hasAttribute("reordering") && (e.preventDefault(), Zr || this._onTrackEnd());
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
      const r = e.composedPath(), i = r[r.indexOf(this.$.header) - 2];
      if (!i || !i._content || i._content.contains(this.getRootNode().activeElement) || this.$.scroller.hasAttribute("column-resizing"))
        return;
      this._touchDevice || this._onTrackStart(e);
    } else e.detail.state === "track" ? this._onTrack(e) : e.detail.state === "end" && this._onTrackEnd(e);
  }
  /** @private */
  _onTrackStart(e) {
    if (!this.columnReorderingAllowed)
      return;
    const r = e.composedPath && e.composedPath();
    if (r && r.some((s) => s.hasAttribute && s.hasAttribute("draggable")))
      return;
    const i = this._cellFromPoint(e.detail.x, e.detail.y);
    if (!(!i || !i.getAttribute("part").includes("header-cell"))) {
      for (this.toggleAttribute("reordering", !0), this._draggedColumn = i._column; this._draggedColumn.parentElement.childElementCount === 1; )
        this._draggedColumn = this._draggedColumn.parentElement;
      this._setSiblingsReorderStatus(this._draggedColumn, "allowed"), this._draggedColumn._reorderStatus = "dragging", this._updateGhost(i), this._reorderGhost.style.visibility = "visible", this._updateGhostPosition(e.detail.x, this._touchDevice ? e.detail.y - 50 : e.detail.y), this._autoScroller();
    }
  }
  /** @private */
  _onTrack(e) {
    if (!this._draggedColumn)
      return;
    const r = this._cellFromPoint(e.detail.x, e.detail.y);
    if (!r)
      return;
    const i = this._getTargetColumn(r, this._draggedColumn);
    if (this._isSwapAllowed(this._draggedColumn, i) && this._isSwappableByPosition(i, e.detail.x)) {
      const s = this._columnTree.findIndex((g) => g.includes(i)), l = this._getColumnsInOrder(s), d = l.indexOf(this._draggedColumn), f = l.indexOf(i), m = d < f ? 1 : -1;
      for (let g = d; g !== f; g += m)
        this._swapColumnOrders(this._draggedColumn, l[g + m]);
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
    return this._columnTree[e].filter((r) => !r.hidden).sort((r, i) => r._order - i._order);
  }
  /**
   * @param {number} x
   * @param {number} y
   * @return {HTMLElement | undefined}
   * @protected
   */
  _cellFromPoint(e = 0, r = 0) {
    this._draggedColumn || this.$.scroller.toggleAttribute("no-content-pointer-events", !0);
    const i = this.shadowRoot.elementFromPoint(e, r);
    return this.$.scroller.toggleAttribute("no-content-pointer-events", !1), this._getCellFromElement(i);
  }
  /** @private */
  _getCellFromElement(e) {
    if (e) {
      if (e._column)
        return e;
      const { parentElement: r } = e;
      if (r && r._focusButton === e)
        return r;
    }
    return null;
  }
  /**
   * @param {number} eventClientX
   * @param {number} eventClientY
   * @protected
   */
  _updateGhostPosition(e, r) {
    const i = this._reorderGhost.getBoundingClientRect(), s = e - i.width / 2, l = r - i.height / 2, d = parseInt(this._reorderGhost._left || 0), f = parseInt(this._reorderGhost._top || 0);
    this._reorderGhost._left = d - (i.left - s), this._reorderGhost._top = f - (i.top - l), this._reorderGhost.style.transform = `translate(${this._reorderGhost._left}px, ${this._reorderGhost._top}px)`;
  }
  /**
   * @param {!HTMLElement} cell
   * @return {!HTMLElement}
   * @protected
   */
  _updateGhost(e) {
    const r = this._reorderGhost;
    r.textContent = e._content.innerText;
    const i = window.getComputedStyle(e);
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
      r.style[s] = i[s];
    }), r;
  }
  /** @private */
  _updateOrders(e) {
    e !== void 0 && (e[0].forEach((r) => {
      r._order = 0;
    }), Xh(e[0], this._orderBaseScope, 0));
  }
  /**
   * @param {!GridColumn} column
   * @param {string} status
   * @protected
   */
  _setSiblingsReorderStatus(e, r) {
    Pe(e.parentNode, (i) => {
      /column/u.test(i.localName) && this._isSwapAllowed(i, e) && (i._reorderStatus = r);
    });
  }
  /** @protected */
  _autoScroller() {
    if (this._lastDragClientX) {
      const e = this._lastDragClientX - this.getBoundingClientRect().right + 50, r = this.getBoundingClientRect().left - this._lastDragClientX + 50;
      e > 0 ? this.$.table.scrollLeft += e / 10 : r > 0 && (this.$.table.scrollLeft -= r / 10);
    }
    this._draggedColumn && setTimeout(() => this._autoScroller(), 10);
  }
  /**
   * @param {GridColumn | undefined} column1
   * @param {GridColumn | undefined} column2
   * @return {boolean | undefined}
   * @protected
   */
  _isSwapAllowed(e, r) {
    if (e && r) {
      const i = e !== r, s = e.parentElement === r.parentElement, l = e.frozen && r.frozen || // Both columns are frozen
      e.frozenToEnd && r.frozenToEnd || // Both columns are frozen to end
      !e.frozen && !e.frozenToEnd && !r.frozen && !r.frozenToEnd;
      return i && s && l;
    }
  }
  /**
   * @param {!GridColumn} targetColumn
   * @param {number} clientX
   * @return {boolean}
   * @protected
   */
  _isSwappableByPosition(e, r) {
    const i = Array.from(this.$.header.querySelectorAll('tr:not([hidden]) [part~="cell"]')).find(
      (d) => e.contains(d._column)
    ), s = this.$.header.querySelector("tr:not([hidden]) [reorder-status=dragging]").getBoundingClientRect(), l = i.getBoundingClientRect();
    return l.left > s.left ? r > l.right - s.width : r < l.left + s.width;
  }
  /**
   * @param {!GridColumn} column1
   * @param {!GridColumn} column2
   * @protected
   */
  _swapColumnOrders(e, r) {
    [e._order, r._order] = [r._order, e._order], this._debounceUpdateFrozenColumn(), this._updateFirstAndLastColumn();
  }
  /**
   * @param {HTMLElement | undefined} targetCell
   * @param {GridColumn} draggedColumn
   * @return {GridColumn | undefined}
   * @protected
   */
  _getTargetColumn(e, r) {
    if (e && r) {
      let i = e._column;
      for (; i.parentElement !== r.parentElement && i !== this; )
        i = i.parentElement;
      return i.parentElement === r.parentElement ? i : e._column;
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
 * Copyright (c) 2016 - 2024 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
const Zf = (n) => class extends n {
  /** @protected */
  ready() {
    super.ready();
    const e = this.$.scroller;
    Pc(e, "track", this._onHeaderTrack.bind(this)), e.addEventListener("touchmove", (r) => e.hasAttribute("column-resizing") && r.preventDefault()), e.addEventListener(
      "contextmenu",
      (r) => r.target.getAttribute("part") === "resize-handle" && r.preventDefault()
    ), e.addEventListener(
      "mousedown",
      (r) => r.target.getAttribute("part") === "resize-handle" && r.preventDefault()
    );
  }
  /** @private */
  _onHeaderTrack(e) {
    const r = e.target;
    if (r.getAttribute("part") === "resize-handle") {
      let s = r.parentElement._column;
      for (this.$.scroller.toggleAttribute("column-resizing", !0); s.localName === "vaadin-grid-column-group"; )
        s = s._childColumns.slice(0).sort((v, z) => v._order - z._order).filter((v) => !v.hidden).pop();
      const l = this.__isRTL, d = e.detail.x, f = Array.from(this.$.header.querySelectorAll('[part~="row"]:last-child [part~="cell"]')), m = f.find((v) => v._column === s);
      if (m.offsetWidth) {
        const v = getComputedStyle(m._content), z = 10 + parseInt(v.paddingLeft) + parseInt(v.paddingRight) + parseInt(v.borderLeftWidth) + parseInt(v.borderRightWidth) + parseInt(v.marginLeft) + parseInt(v.marginRight);
        let B;
        const H = m.offsetWidth, ee = m.getBoundingClientRect();
        m.hasAttribute("frozen-to-end") ? B = H + (l ? d - ee.right : ee.left - d) : B = H + (l ? ee.left - d : d - ee.right), s.width = `${Math.max(z, B)}px`, s.flexGrow = 0;
      }
      f.sort((v, z) => v._column._order - z._column._order).forEach((v, z, B) => {
        z < B.indexOf(m) && (v._column.width = `${v.offsetWidth}px`, v._column.flexGrow = 0);
      });
      const g = this._frozenToEndCells[0];
      if (g && this.$.table.scrollWidth > this.$.table.offsetWidth) {
        const v = g.getBoundingClientRect(), z = d - (l ? v.right : v.left);
        (l && z <= 0 || !l && z >= 0) && (this.$.table.scrollLeft += z);
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
 * Copyright (c) 2021 - 2024 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
function an(n, t, e = 0) {
  let r = t;
  for (const i of n.subCaches) {
    const s = i.parentCacheIndex;
    if (r <= s)
      break;
    if (r <= s + i.flatSize)
      return an(i, r - s - 1, e + 1);
    r -= i.flatSize;
  }
  return {
    cache: n,
    item: n.items[r],
    index: r,
    page: Math.floor(r / n.pageSize),
    level: e
  };
}
function Sc({ getItemId: n }, t, e, r = 0, i = 0) {
  for (let s = 0; s < t.items.length; s++) {
    const l = t.items[s];
    if (l && n(l) === n(e))
      return {
        cache: t,
        level: r,
        item: l,
        index: s,
        page: Math.floor(s / t.pageSize),
        subCache: t.getSubCache(s),
        flatIndex: i + t.getFlatIndex(s)
      };
  }
  for (const s of t.subCaches) {
    const l = i + t.getFlatIndex(s.parentCacheIndex), d = Sc({ getItemId: n }, s, e, r + 1, l + 1);
    if (d)
      return d;
  }
}
function Ic(n, [t, ...e], r = 0) {
  t === 1 / 0 && (t = n.size - 1);
  const i = n.getFlatIndex(t), s = n.getSubCache(t);
  return s && s.flatSize > 0 && e.length ? Ic(s, e, r + i + 1) : r + i;
}
/**
 * @license
 * Copyright (c) 2021 - 2024 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
class ys {
  /**
   * @param {Cache['context']} context
   * @param {number} pageSize
   * @param {number | undefined} size
   * @param {Cache | undefined} parentCache
   * @param {number | undefined} parentCacheIndex
   */
  constructor(t, e, r, i, s) {
    /**
     * A context object.
     *
     * @type {{ isExpanded: (item: unknown) => boolean }}
     */
    ye(this, "context");
    /**
     * The number of items.
     *
     * @type {number}
     */
    ye(this, "size", 0);
    /**
     * The number of items to display per page.
     *
     * @type {number}
     */
    ye(this, "pageSize");
    /**
     * An array of cached items.
     *
     * @type {object[]}
     */
    ye(this, "items", []);
    /**
     * A map where the key is a requested page and the value is a callback
     * that will be called with data once the request is complete.
     *
     * @type {Record<number, Function>}
     */
    ye(this, "pendingRequests", {});
    /**
     * A map where the key is the index of an item in the `items` array
     * and the value is a sub-cache associated with that item.
     *
     * Note, it's intentionally defined as an object instead of a Map
     * to ensure that Object.entries() returns an array with keys sorted
     * in alphabetical order, rather than the order they were added.
     *
     * @type {Record<number, Cache>}
     * @private
     */
    ye(this, "__subCacheByIndex", {});
    /**
     * The total number of items, including items from expanded sub-caches.
     *
     * @type {number}
     * @private
     */
    ye(this, "__flatSize", 0);
    this.context = t, this.pageSize = e, this.size = r || 0, this.parentCache = i, this.parentCacheIndex = s, this.__flatSize = r || 0;
  }
  /**
   * An item in the parent cache that the current cache is associated with.
   *
   * @return {object | undefined}
   */
  get parentItem() {
    return this.parentCache && this.parentCache.items[this.parentCacheIndex];
  }
  /**
   * An array of sub-caches sorted in the same order as their associated items
   * appear in the `items` array.
   *
   * @return {Cache[]}
   */
  get subCaches() {
    return Object.values(this.__subCacheByIndex);
  }
  /**
   * Whether the cache or any of its descendant caches have pending requests.
   *
   * @return {boolean}
   */
  get isLoading() {
    return Object.keys(this.pendingRequests).length > 0 ? !0 : this.subCaches.some((t) => t.isLoading);
  }
  /**
   * The total number of items, including items from expanded sub-caches.
   *
   * @return {number}
   */
  get flatSize() {
    return this.__flatSize;
  }
  /**
   * The total number of items, including items from expanded sub-caches.
   *
   * @protected
   * @deprecated since 24.3 and will be removed in Vaadin 25.
   */
  get effectiveSize() {
    return this.flatSize;
  }
  /**
   * Recalculates the flattened size for the cache and its descendant caches recursively.
   */
  recalculateFlatSize() {
    this.__flatSize = !this.parentItem || this.context.isExpanded(this.parentItem) ? this.size + this.subCaches.reduce((t, e) => (e.recalculateFlatSize(), t + e.flatSize), 0) : 0;
  }
  /**
   * Adds an array of items corresponding to the given page
   * to the `items` array.
   *
   * @param {number} page
   * @param {object[]} items
   */
  setPage(t, e) {
    const r = t * this.pageSize;
    e.forEach((i, s) => {
      this.items[r + s] = i;
    });
  }
  /**
   * Retrieves the sub-cache associated with the item at the given index
   * in the `items` array.
   *
   * @param {number} index
   * @return {Cache | undefined}
   */
  getSubCache(t) {
    return this.__subCacheByIndex[t];
  }
  /**
   * Removes the sub-cache associated with the item at the given index
   * in the `items` array.
   *
   * @param {number} index
   */
  removeSubCache(t) {
    delete this.__subCacheByIndex[t];
  }
  /**
   * Removes all sub-caches.
   */
  removeSubCaches() {
    this.__subCacheByIndex = {};
  }
  /**
   * Creates and associates a sub-cache for the item at the given index
   * in the `items` array.
   *
   * @param {number} index
   * @return {Cache}
   */
  createSubCache(t) {
    const e = new ys(this.context, this.pageSize, 0, this, t);
    return this.__subCacheByIndex[t] = e, e;
  }
  /**
   * Retrieves the flattened index corresponding to the given index
   * of an item in the `items` array.
   *
   * @param {number} index
   * @return {number}
   */
  getFlatIndex(t) {
    const e = Math.max(0, Math.min(this.size - 1, t));
    return this.subCaches.reduce((r, i) => {
      const s = i.parentCacheIndex;
      return e > s ? r + i.flatSize : r;
    }, e);
  }
  /**
   * @deprecated since 24.3 and will be removed in Vaadin 25.
   */
  getItemForIndex(t) {
    const { item: e } = an(this, t);
    return e;
  }
  /**
   * @deprecated since 24.3 and will be removed in Vaadin 25.
   */
  getCacheAndIndex(t) {
    const { cache: e, index: r } = an(this, t);
    return { cache: e, scaledIndex: r };
  }
  /**
   * @deprecated since 24.3 and will be removed in Vaadin 25.
   */
  updateSize() {
    this.recalculateFlatSize();
  }
  /**
   * @deprecated since 24.3 and will be removed in Vaadin 25.
   */
  ensureSubCacheForScaledIndex(t) {
    if (!this.getSubCache(t)) {
      const e = this.createSubCache(t);
      this.context.__controller.__loadCachePage(e, 0);
    }
  }
  /**
   * @deprecated since 24.3 and will be removed in Vaadin 25.
   */
  get grid() {
    return this.context.__controller.host;
  }
  /**
   * @deprecated since 24.3 and will be removed in Vaadin 25.
   */
  get itemCaches() {
    return this.__subCacheByIndex;
  }
}
/**
 * @license
 * Copyright (c) 2021 - 2024 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
class Xf extends EventTarget {
  constructor(e, { size: r, pageSize: i, isExpanded: s, getItemId: l, dataProvider: d, dataProviderParams: f }) {
    super();
    /**
     * The controller host element.
     *
     * @param {HTMLElement}
     */
    ye(this, "host");
    /**
     * A callback that returns data based on the passed params such as
     * `page`, `pageSize`, `parentItem`, etc.
     */
    ye(this, "dataProvider");
    /**
     * A callback that returns additional params that need to be passed
     * to the data provider callback with every request.
     */
    ye(this, "dataProviderParams");
    /**
     * A number of items in the root cache.
     *
     * @type {number}
     */
    ye(this, "size");
    /**
     * A number of items to display per page.
     *
     * @type {number}
     */
    ye(this, "pageSize");
    /**
     * A callback that returns whether the given item is expanded.
     *
     * @type {(item: unknown) => boolean}
     */
    ye(this, "isExpanded");
    /**
     * A callback that returns the id for the given item and that
     * is used when checking object items for equality.
     *
     * @type { (item: unknown) => unknown}
     */
    ye(this, "getItemId");
    /**
     * A reference to the root cache instance.
     *
     * @param {Cache}
     */
    ye(this, "rootCache");
    this.host = e, this.pageSize = i, this.getItemId = l, this.isExpanded = s, this.dataProvider = d, this.dataProviderParams = f, this.rootCache = this.__createRootCache(r);
  }
  /**
   * The total number of items, including items from expanded sub-caches.
   */
  get flatSize() {
    return this.rootCache.flatSize;
  }
  /** @private */
  get __cacheContext() {
    return {
      isExpanded: this.isExpanded,
      // The controller instance is needed to ensure deprecated cache methods work.
      __controller: this
    };
  }
  /**
   * Whether the root cache or any of its decendant caches have pending requests.
   *
   * @return {boolean}
   */
  isLoading() {
    return this.rootCache.isLoading;
  }
  /**
   * Sets the page size and clears the cache.
   *
   * @param {number} pageSize
   */
  setPageSize(e) {
    this.pageSize = e, this.clearCache();
  }
  /**
   * Sets the data provider callback and clears the cache.
   *
   * @type {Function}
   */
  setDataProvider(e) {
    this.dataProvider = e, this.clearCache();
  }
  /**
   * Recalculates the flattened size.
   */
  recalculateFlatSize() {
    this.rootCache.recalculateFlatSize();
  }
  /**
   * Clears the cache.
   */
  clearCache() {
    this.rootCache = this.__createRootCache(this.rootCache.size);
  }
  /**
   * Returns context for the given flattened index, including:
   * - the corresponding cache
   * - the cache level
   * - the corresponding item (if loaded)
   * - the item's index in the cache's items array
   * - the page containing the item
   *
   * @param {number} flatIndex
   */
  getFlatIndexContext(e) {
    return an(this.rootCache, e);
  }
  /**
   * Returns context for the given item, including:
   * - the cache containing the item
   * - the cache level
   * - the item
   * - the item's index in the cache's items array
   * - the item's flattened index
   * - the item's sub-cache (if exists)
   * - the page containing the item
   *
   * If the item isn't found, the method returns undefined.
   */
  getItemContext(e) {
    return Sc({ getItemId: this.getItemId }, this.rootCache, e);
  }
  /**
   * Returns the flattened index for the item that the given indexes point to.
   * Each index in the path array points to a sub-item of the previous index.
   * Using `Infinity` as an index will point to the last item on the level.
   *
   * @param {number[]} path
   * @return {number}
   */
  getFlatIndexByPath(e) {
    return Ic(this.rootCache, e);
  }
  /**
   * Requests the data provider to load the page with the item corresponding
   * to the given flattened index. If the item is already loaded, the method
   * returns immediatelly.
   *
   * @param {number} flatIndex
   */
  ensureFlatIndexLoaded(e) {
    const { cache: r, page: i, item: s } = this.getFlatIndexContext(e);
    s || this.__loadCachePage(r, i);
  }
  /**
   * Creates a sub-cache for the item corresponding to the given flattened index and
   * requests the data provider to load the first page into the created sub-cache.
   * If the sub-cache already exists, the method returns immediatelly.
   *
   * @param {number} flatIndex
   */
  ensureFlatIndexHierarchy(e) {
    const { cache: r, item: i, index: s } = this.getFlatIndexContext(e);
    if (i && this.isExpanded(i) && !r.getSubCache(s)) {
      const l = r.createSubCache(s);
      this.__loadCachePage(l, 0);
    }
  }
  /**
   * Loads the first page into the root cache.
   */
  loadFirstPage() {
    this.__loadCachePage(this.rootCache, 0);
  }
  /** @private */
  __createRootCache(e) {
    return new ys(this.__cacheContext, this.pageSize, e);
  }
  /** @private */
  __loadCachePage(e, r) {
    if (!this.dataProvider || e.pendingRequests[r])
      return;
    let i = {
      page: r,
      pageSize: this.pageSize,
      parentItem: e.parentItem
    };
    this.dataProviderParams && (i = { ...i, ...this.dataProviderParams() });
    const s = (l, d) => {
      e.pendingRequests[r] === s && (d !== void 0 ? e.size = d : i.parentItem && (e.size = l.length), e.setPage(r, l), this.recalculateFlatSize(), this.dispatchEvent(new CustomEvent("page-received")), delete e.pendingRequests[r], this.dispatchEvent(new CustomEvent("page-loaded")));
    };
    e.pendingRequests[r] = s, this.dispatchEvent(new CustomEvent("page-requested")), this.dataProvider(i, s);
  }
}
/**
 * @license
 * Copyright (c) 2016 - 2024 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
const Jf = (n) => class extends n {
  static get properties() {
    return {
      /**
       * The number of root-level items in the grid.
       * @attr {number} size
       * @type {number}
       */
      size: {
        type: Number,
        notify: !0,
        sync: !0
      },
      /**
       * @type {number}
       * @protected
       */
      _flatSize: {
        type: Number,
        sync: !0
      },
      /**
       * Number of items fetched at a time from the dataprovider.
       * @attr {number} page-size
       * @type {number}
       */
      pageSize: {
        type: Number,
        value: 50,
        observer: "_pageSizeChanged",
        sync: !0
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
        observer: "_dataProviderChanged",
        sync: !0
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
       * @protected
       */
      _hasData: {
        type: Boolean,
        value: !1,
        sync: !0
      },
      /**
       * Path to an item sub-property that indicates whether the item has child items.
       * @attr {string} item-has-children-path
       */
      itemHasChildrenPath: {
        type: String,
        value: "children",
        observer: "__itemHasChildrenPathChanged",
        sync: !0
      },
      /**
       * Path to an item sub-property that identifies the item.
       * @attr {string} item-id-path
       */
      itemIdPath: {
        type: String,
        value: null,
        sync: !0
      },
      /**
       * An array that contains the expanded items.
       * @type {!Array<!GridItem>}
       */
      expandedItems: {
        type: Object,
        notify: !0,
        value: () => [],
        sync: !0
      },
      /**
       * @private
       */
      __expandedKeys: {
        type: Object,
        computed: "__computeExpandedKeys(itemIdPath, expandedItems)"
      }
    };
  }
  static get observers() {
    return ["_sizeChanged(size)", "_expandedItemsChanged(expandedItems)"];
  }
  constructor() {
    super(), this._dataProviderController = new Xf(this, {
      size: this.size,
      pageSize: this.pageSize,
      getItemId: this.getItemId.bind(this),
      isExpanded: this._isExpanded.bind(this),
      dataProvider: this.dataProvider ? this.dataProvider.bind(this) : null,
      dataProviderParams: () => ({
        sortOrders: this._mapSorters(),
        filters: this._mapFilters()
      })
    }), this._dataProviderController.addEventListener("page-requested", this._onDataProviderPageRequested.bind(this)), this._dataProviderController.addEventListener("page-received", this._onDataProviderPageReceived.bind(this)), this._dataProviderController.addEventListener("page-loaded", this._onDataProviderPageLoaded.bind(this));
  }
  /**
   * @protected
   * @deprecated since 24.3 and will be removed in Vaadin 25.
   */
  get _cache() {
    return this._dataProviderController.rootCache;
  }
  /**
   * @protected
   * @deprecated since 24.3 and will be removed in Vaadin 25.
   */
  get _effectiveSize() {
    return this._flatSize;
  }
  /** @private */
  _sizeChanged(e) {
    this._dataProviderController.rootCache.size = e, this._dataProviderController.recalculateFlatSize(), this._flatSize = this._dataProviderController.flatSize;
  }
  /** @private */
  __itemHasChildrenPathChanged(e, r) {
    !r && e === "children" || this.requestContentUpdate();
  }
  /**
   * @param {number} index
   * @param {HTMLElement} el
   * @protected
   */
  _getItem(e, r) {
    r.index = e;
    const { item: i } = this._dataProviderController.getFlatIndexContext(e);
    i ? (this.__updateLoading(r, !1), this._updateItem(r, i), this._isExpanded(i) && this._dataProviderController.ensureFlatIndexHierarchy(e)) : (this.__updateLoading(r, !0), this._dataProviderController.ensureFlatIndexLoaded(e));
  }
  /**
   * @param {!HTMLElement} row
   * @param {boolean} loading
   * @private
   */
  __updateLoading(e, r) {
    const i = nr(e);
    mn(e, "loading", r), nt(i, "loading-row-cell", r), r && (this._generateCellClassNames(e), this._generateCellPartNames(e));
  }
  /**
   * Returns a value that identifies the item. Uses `itemIdPath` if available.
   * Can be customized by overriding.
   * @param {!GridItem} item
   * @return {!GridItem | !unknown}
   */
  getItemId(e) {
    return this.itemIdPath ? Rt(this.itemIdPath, e) : e;
  }
  /**
   * @param {!GridItem} item
   * @return {boolean}
   * @protected
   */
  _isExpanded(e) {
    return this.__expandedKeys && this.__expandedKeys.has(this.getItemId(e));
  }
  /** @private */
  _expandedItemsChanged() {
    this._dataProviderController.recalculateFlatSize(), this._flatSize = this._dataProviderController.flatSize, this.__updateVisibleRows();
  }
  /** @private */
  __computeExpandedKeys(e, r) {
    const i = r || [], s = /* @__PURE__ */ new Set();
    return i.forEach((l) => {
      s.add(this.getItemId(l));
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
    this._isExpanded(e) && (this.expandedItems = this.expandedItems.filter((r) => !this._itemsEqual(r, e)));
  }
  /**
   * @param {number} index
   * @return {number}
   * @protected
   */
  _getIndexLevel(e = 0) {
    const { level: r } = this._dataProviderController.getFlatIndexContext(e);
    return r;
  }
  /**
   * @param {number} page
   * @param {ItemCache} cache
   * @protected
   * @deprecated since 24.3 and will be removed in Vaadin 25.
   */
  _loadPage(e, r) {
    this._dataProviderController.__loadCachePage(r, e);
  }
  /** @protected */
  _onDataProviderPageRequested() {
    this._setLoading(!0);
  }
  /** @protected */
  _onDataProviderPageReceived() {
    this._flatSize !== this._dataProviderController.flatSize && (this._shouldUpdateAllRenderedRowsAfterPageLoad = !0, this._flatSize = this._dataProviderController.flatSize), this._getRenderedRows().forEach((e) => {
      this._dataProviderController.ensureFlatIndexHierarchy(e.index);
    }), this._hasData = !0;
  }
  /** @protected */
  _onDataProviderPageLoaded() {
    this._debouncerApplyCachedData = ie.debounce(this._debouncerApplyCachedData, Ke.after(0), () => {
      this._setLoading(!1);
      const e = this._shouldUpdateAllRenderedRowsAfterPageLoad;
      this._shouldUpdateAllRenderedRowsAfterPageLoad = !1, this._getRenderedRows().forEach((r) => {
        const { item: i } = this._dataProviderController.getFlatIndexContext(r.index);
        (i || e) && this._getItem(r.index, r);
      }), this.__scrollToPendingIndexes(), this.__dispatchPendingBodyCellFocus();
    }), this._dataProviderController.isLoading() || this._debouncerApplyCachedData.flush();
  }
  /** @private */
  __debounceClearCache() {
    this.__clearCacheDebouncer = ie.debounce(this.__clearCacheDebouncer, $e, () => this.clearCache());
  }
  /**
   * Clears the cached pages and reloads data from dataprovider when needed.
   */
  clearCache() {
    this._dataProviderController.clearCache(), this._dataProviderController.rootCache.size = this.size, this._dataProviderController.recalculateFlatSize(), this._hasData = !1, this.__updateVisibleRows(), (!this.__virtualizer || !this.__virtualizer.size) && this._dataProviderController.loadFirstPage();
  }
  /** @private */
  _pageSizeChanged(e, r) {
    this._dataProviderController.setPageSize(e), r !== void 0 && e !== r && this.clearCache();
  }
  /** @protected */
  _checkSize() {
    this.size === void 0 && this._flatSize;
  }
  /** @private */
  _dataProviderChanged(e, r) {
    this._dataProviderController.setDataProvider(e ? e.bind(this) : null), r !== void 0 && this.clearCache(), this._ensureFirstPageLoaded(), this._debouncerCheckSize = ie.debounce(
      this._debouncerCheckSize,
      Ke.after(2e3),
      this._checkSize.bind(this)
    );
  }
  /** @protected */
  _ensureFirstPageLoaded() {
    this._hasData || this._dataProviderController.loadFirstPage();
  }
  /**
   * @param {!GridItem} item1
   * @param {!GridItem} item2
   * @return {boolean}
   * @protected
   */
  _itemsEqual(e, r) {
    return this.getItemId(e) === this.getItemId(r);
  }
  /**
   * @param {!GridItem} item
   * @param {!Array<!GridItem>} array
   * @return {number}
   * @protected
   */
  _getItemIndexInArray(e, r) {
    let i = -1;
    return r.forEach((s, l) => {
      this._itemsEqual(s, e) && (i = l);
    }), i;
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
    let r;
    for (; r !== (r = this._dataProviderController.getFlatIndexByPath(e)); )
      this._scrollToFlatIndex(r);
    (this._dataProviderController.isLoading() || !this.clientHeight) && (this.__pendingScrollToIndexes = e);
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
 * Copyright (c) 2016 - 2024 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
const Or = {
  BETWEEN: "between",
  ON_TOP: "on-top",
  ON_TOP_OR_BETWEEN: "on-top-or-between",
  ON_GRID: "on-grid"
}, et = {
  ON_TOP: "on-top",
  ABOVE: "above",
  BELOW: "below",
  EMPTY: "empty"
}, Qf = !("draggable" in document.createElement("div")), ep = (n) => class extends n {
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
      dropMode: {
        type: String,
        sync: !0
      },
      /**
       * Marks the grid's rows to be available for dragging.
       * @attr {boolean} rows-draggable
       */
      rowsDraggable: {
        type: Boolean,
        sync: !0
      },
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
      dragFilter: {
        type: Function,
        sync: !0
      },
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
      dropFilter: {
        type: Function,
        sync: !0
      },
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
      let r = e.target;
      if (r.localName === "vaadin-grid-cell-content" && (r = r.assignedSlot.parentNode.parentNode), r.parentNode !== this.$.items)
        return;
      if (e.stopPropagation(), this.toggleAttribute("dragging-rows", !0), this._safari) {
        const d = r.style.transform;
        r.style.top = /translateY\((.*)\)/u.exec(d)[1], r.style.transform = "none", requestAnimationFrame(() => {
          r.style.top = "", r.style.transform = d;
        });
      }
      const i = r.getBoundingClientRect();
      Qf ? e.dataTransfer.setDragImage(r) : e.dataTransfer.setDragImage(r, e.clientX - i.left, e.clientY - i.top);
      let s = [r];
      this._isSelected(r._item) && (s = this.__getViewportRows().filter((d) => this._isSelected(d._item)).filter((d) => !this.dragFilter || this.dragFilter(this.__getRowModel(d)))), e.dataTransfer.setData("text", this.__formatDefaultTransferData(s)), Br(r, { dragstart: s.length > 1 ? `${s.length}` : "" }), this.style.setProperty("--_grid-drag-start-x", `${e.clientX - i.left + 20}px`), this.style.setProperty("--_grid-drag-start-y", `${e.clientY - i.top + 10}px`), requestAnimationFrame(() => {
        Br(r, { dragstart: !1 }), this.style.setProperty("--_grid-drag-start-x", ""), this.style.setProperty("--_grid-drag-start-y", "");
      });
      const l = new CustomEvent("grid-dragstart", {
        detail: {
          draggedItems: s.map((d) => d._item),
          setDragData: (d, f) => e.dataTransfer.setData(d, f),
          setDraggedItemsCount: (d) => r.setAttribute("dragstart", d)
        }
      });
      l.originalEvent = e, this.dispatchEvent(l);
    }
  }
  /** @private */
  _onDragEnd(e) {
    this.toggleAttribute("dragging-rows", !1), e.stopPropagation();
    const r = new CustomEvent("grid-dragend");
    r.originalEvent = e, this.dispatchEvent(r);
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
      let r = e.composedPath().find((i) => i.localName === "tr");
      if (!this._flatSize || this.dropMode === Or.ON_GRID)
        this._dropLocation = et.EMPTY;
      else if (!r || r.parentNode !== this.$.items) {
        if (r)
          return;
        if (this.dropMode === Or.BETWEEN || this.dropMode === Or.ON_TOP_OR_BETWEEN)
          r = Array.from(this.$.items.children).filter((i) => !i.hidden).pop(), this._dropLocation = et.BELOW;
        else
          return;
      } else {
        const i = r.getBoundingClientRect();
        if (this._dropLocation = et.ON_TOP, this.dropMode === Or.BETWEEN) {
          const s = e.clientY - i.top < i.bottom - e.clientY;
          this._dropLocation = s ? et.ABOVE : et.BELOW;
        } else this.dropMode === Or.ON_TOP_OR_BETWEEN && (e.clientY - i.top < i.height / 3 ? this._dropLocation = et.ABOVE : e.clientY - i.top > i.height / 3 * 2 && (this._dropLocation = et.BELOW));
      }
      if (r && r.hasAttribute("drop-disabled")) {
        this._dropLocation = void 0;
        return;
      }
      e.stopPropagation(), e.preventDefault(), this._dropLocation === et.EMPTY ? this.toggleAttribute("dragover", !0) : r ? (this._dragOverItem = r._item, r.getAttribute("dragover") !== this._dropLocation && qa(r, { dragover: this._dropLocation })) : this._clearDragStyles();
    }
  }
  /** @private */
  __dndAutoScroll(e) {
    if (this.__dndAutoScrolling)
      return !0;
    const r = this.$.header.getBoundingClientRect().bottom, i = this.$.footer.getBoundingClientRect().top, s = r - e + this.__dndAutoScrollThreshold, l = e - i + this.__dndAutoScrollThreshold;
    let d = 0;
    if (l > 0 ? d = l * 2 : s > 0 && (d = -s * 2), d) {
      const f = this.$.table.scrollTop;
      if (this.$.table.scrollTop += d, f !== this.$.table.scrollTop)
        return this.__dndAutoScrolling = !0, setTimeout(() => {
          this.__dndAutoScrolling = !1;
        }, 20), !0;
    }
  }
  /** @private */
  __getViewportRows() {
    const e = this.$.header.getBoundingClientRect().bottom, r = this.$.footer.getBoundingClientRect().top;
    return Array.from(this.$.items.children).filter((i) => {
      const s = i.getBoundingClientRect();
      return s.bottom > e && s.top < r;
    });
  }
  /** @protected */
  _clearDragStyles() {
    this.removeAttribute("dragover"), Pe(this.$.items, (e) => {
      qa(e, { dragover: null });
    });
  }
  /** @private */
  _onDrop(e) {
    if (this.dropMode) {
      e.stopPropagation(), e.preventDefault();
      const r = e.dataTransfer.types && Array.from(e.dataTransfer.types).map((s) => ({
        type: s,
        data: e.dataTransfer.getData(s)
      }));
      this._clearDragStyles();
      const i = new CustomEvent("grid-drop", {
        bubbles: e.bubbles,
        cancelable: e.cancelable,
        detail: {
          dropTargetItem: this._dragOverItem,
          dropLocation: this._dropLocation,
          dragData: r
        }
      });
      i.originalEvent = e, this.dispatchEvent(i);
    }
  }
  /** @private */
  __formatDefaultTransferData(e) {
    return e.map((r) => Array.from(r.children).filter((i) => !i.hidden && i.getAttribute("part").indexOf("details-cell") === -1).sort((i, s) => i._column._order > s._column._order ? 1 : -1).map((i) => i._content.textContent.trim()).filter((i) => i).join("	")).join(`
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
    Pe(this.$.items, (e) => {
      e.hidden || this._filterDragAndDrop(e, this.__getRowModel(e));
    });
  }
  /**
   * @param {!HTMLElement} row
   * @param {!GridItemModel} model
   * @protected
   */
  _filterDragAndDrop(e, r) {
    const i = this.loading || e.hasAttribute("loading"), s = !this.rowsDraggable || i || this.dragFilter && !this.dragFilter(r), l = !this.dropMode || i || this.dropFilter && !this.dropFilter(r);
    or(e, (d) => {
      s ? d._content.removeAttribute("draggable") : d._content.setAttribute("draggable", !0);
    }), Br(e, {
      "drag-disabled": !!s,
      "drop-disabled": !!l
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
 * Copyright (c) 2016 - 2024 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
function Tc(n, t) {
  if (!n || !t || n.length !== t.length)
    return !1;
  for (let e = 0, r = n.length; e < r; e++)
    if (n[e] instanceof Array && t[e] instanceof Array) {
      if (!Tc(n[e], t[e]))
        return !1;
    } else if (n[e] !== t[e])
      return !1;
  return !0;
}
const tp = (n) => class extends n {
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
    return e.some((r) => r.localName === "vaadin-grid-column-group");
  }
  /**
   * @param {!GridColumnGroup} el
   * @return {!Array<!GridColumn>}
   * @protected
   */
  _getChildColumns(e) {
    return Qt.getColumns(e);
  }
  /** @private */
  _flattenColumnGroups(e) {
    return e.map((r) => r.localName === "vaadin-grid-column-group" ? this._getChildColumns(r) : [r]).reduce((r, i) => r.concat(i), []);
  }
  /** @private */
  _getColumnTree() {
    const e = Qt.getColumns(this), r = [e];
    let i = e;
    for (; this._hasColumnGroups(i); )
      i = this._flattenColumnGroups(i), r.push(i);
    return r;
  }
  /** @protected */
  _debounceUpdateColumnTree() {
    this.__updateColumnTreeDebouncer = ie.debounce(
      this.__updateColumnTreeDebouncer,
      $e,
      () => this._updateColumnTree()
    );
  }
  /** @protected */
  _updateColumnTree() {
    const e = this._getColumnTree();
    Tc(e, this._columnTree) || (e.forEach((r) => {
      r.forEach((i) => {
        i.performUpdate && i.performUpdate();
      });
    }), this._columnTree = e);
  }
  /** @private */
  _addNodeObserver() {
    this._observer = new Qt(this, (e, r) => {
      const i = r.flatMap((l) => l._allCells), s = (l) => i.filter((d) => d && d._content.contains(l)).length;
      this.__removeSorters(this._sorters.filter(s)), this.__removeFilters(this._filters.filter(s)), this._debounceUpdateColumnTree(), this._debouncerCheckImports = ie.debounce(
        this._debouncerCheckImports,
        Ke.after(2e3),
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
      this.querySelector(e) && customElements.get(e);
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
    Array.from(e.querySelectorAll('[part~="cell"]:not([part~="details-cell"])')).sort((r, i) => r._column._order - i._column._order).forEach((r, i, s) => {
      Ct(r, "first-column", i === 0), Ct(r, "last-column", i === s.length - 1);
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
 * Copyright (c) 2016 - 2024 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
const rp = (n) => class extends n {
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
    const r = {}, i = e.__composedPath || e.composedPath(), s = i[i.indexOf(this.$.table) - 3];
    return s && (r.section = ["body", "header", "footer", "details"].find(
      (l) => s.getAttribute("part").indexOf(l) > -1
    ), s._column && (r.column = s._column), (r.section === "body" || r.section === "details") && Object.assign(r, this.__getRowModel(s.parentElement))), r;
  }
};
/**
 * @license
 * Copyright (c) 2016 - 2024 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
const ip = (n) => class extends n {
  static get properties() {
    return {
      /** @private */
      _filters: {
        type: Array,
        value: () => []
      }
    };
  }
  constructor() {
    super(), this._filterChanged = this._filterChanged.bind(this), this.addEventListener("filter-changed", this._filterChanged);
  }
  /** @private */
  _filterChanged(e) {
    e.stopPropagation(), this.__addFilter(e.target), this.__applyFilters();
  }
  /** @private */
  __removeFilters(e) {
    e.length !== 0 && (this._filters = this._filters.filter((r) => e.indexOf(r) < 0), this.__applyFilters());
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
 * Copyright (c) 2016 - 2024 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
const np = (n) => class extends n {
  static get properties() {
    return {
      /** @private */
      _headerFocusable: {
        type: Object,
        observer: "_focusableChanged",
        sync: !0
      },
      /**
       * @type {!HTMLElement | undefined}
       * @protected
       */
      _itemsFocusable: {
        type: Object,
        observer: "_focusableChanged",
        sync: !0
      },
      /** @private */
      _footerFocusable: {
        type: Object,
        observer: "_focusableChanged",
        sync: !0
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
        observer: "_focusedCellChanged",
        sync: !0
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
    ["_itemsFocusable", "_footerFocusable", "_headerFocusable"].forEach((r) => {
      const i = this[r];
      if (e) {
        const s = i && i.parentElement;
        this.__isCell(i) ? this[r] = s : this.__isCell(s) && (this[r] = s.parentElement);
      } else if (!e && this.__isRow(i)) {
        const s = i.firstElementChild;
        this[r] = s._focusButton || s;
      }
    });
  }
  /** @private */
  get _visibleItemsCount() {
    return this._lastVisibleIndex - this._firstVisibleIndex - 1;
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
  _focusableChanged(e, r) {
    r && r.setAttribute("tabindex", "-1"), e && this._updateGridSectionFocusTarget(e);
  }
  /** @private */
  _focusedCellChanged(e, r) {
    r && us(r, "part", "focused-cell"), e && _n(e, "part", "focused-cell");
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
    this._getRenderedRows().forEach((r) => {
      if (r.index === this._focusedItemIndex)
        if (this.__rowFocusMode)
          this._itemsFocusable = r;
        else {
          let i = this._itemsFocusable.parentElement, s = this._itemsFocusable;
          if (i) {
            this.__isCell(i) && (s = i, i = i.parentElement);
            const l = [...i.children].indexOf(s);
            this._itemsFocusable = this.__getFocusable(r, r.children[l]);
          }
        }
    }), e && this._itemsFocusable.focus();
  }
  /**
   * @param {!KeyboardEvent} e
   * @protected
   */
  _onKeyDown(e) {
    const r = e.key;
    let i;
    switch (r) {
      case "ArrowUp":
      case "ArrowDown":
      case "ArrowLeft":
      case "ArrowRight":
      case "PageUp":
      case "PageDown":
      case "Home":
      case "End":
        i = "Navigation";
        break;
      case "Enter":
      case "Escape":
      case "F2":
        i = "Interaction";
        break;
      case "Tab":
        i = "Tab";
        break;
      case " ":
        i = "Space";
        break;
    }
    this._detectInteracting(e), this.interacting && i !== "Interaction" && (i = void 0), i && this[`_on${i}KeyDown`](e, r);
  }
  /** @private */
  _ensureScrolledToIndex(e) {
    [...this.$.items.children].find((i) => i.index === e) ? this.__scrollIntoViewport(e) : this.scrollToIndex(e);
  }
  /** @private */
  __isRowExpandable(e) {
    if (this.itemHasChildrenPath) {
      const r = e._item;
      return !!(r && Rt(this.itemHasChildrenPath, r) && !this._isExpanded(r));
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
  _onNavigationKeyDown(e, r) {
    e.preventDefault();
    const i = this.__isRTL, s = e.composedPath().find((v) => this.__isRow(v)), l = e.composedPath().find((v) => this.__isCell(v));
    let d = 0, f = 0;
    switch (r) {
      case "ArrowRight":
        d = i ? -1 : 1;
        break;
      case "ArrowLeft":
        d = i ? 1 : -1;
        break;
      case "Home":
        this.__rowFocusMode || e.ctrlKey ? f = -1 / 0 : d = -1 / 0;
        break;
      case "End":
        this.__rowFocusMode || e.ctrlKey ? f = 1 / 0 : d = 1 / 0;
        break;
      case "ArrowDown":
        f = 1;
        break;
      case "ArrowUp":
        f = -1;
        break;
      case "PageDown":
        if (this.$.items.contains(s)) {
          const v = this.__getIndexInGroup(s, this._focusedItemIndex);
          this._scrollToFlatIndex(v);
        }
        f = this._visibleItemsCount;
        break;
      case "PageUp":
        f = -this._visibleItemsCount;
        break;
    }
    if (this.__rowFocusMode && !s || !this.__rowFocusMode && !l)
      return;
    const m = i ? "ArrowLeft" : "ArrowRight", g = i ? "ArrowRight" : "ArrowLeft";
    if (r === m) {
      if (this.__rowFocusMode) {
        if (this.__isRowExpandable(s)) {
          this.expandItem(s._item);
          return;
        }
        this.__rowFocusMode = !1, this._onCellNavigation(s.firstElementChild, 0, 0);
        return;
      }
    } else if (r === g)
      if (this.__rowFocusMode) {
        if (this.__isRowCollapsible(s)) {
          this.collapseItem(s._item);
          return;
        }
      } else {
        const v = [...s.children].sort((z, B) => z._order - B._order);
        if (l === v[0] || this.__isDetailsCell(l)) {
          this.__rowFocusMode = !0, this._onRowNavigation(s, 0);
          return;
        }
      }
    this.__rowFocusMode ? this._onRowNavigation(s, f) : this._onCellNavigation(l, d, f);
  }
  /**
   * Focuses the target row after navigating by the given dy offset.
   * If the row is not in the viewport, it is first scrolled to.
   * @private
   */
  _onRowNavigation(e, r) {
    const { dstRow: i } = this.__navigateRows(r, e);
    i && i.focus();
  }
  /** @private */
  __getIndexInGroup(e, r) {
    return e.parentNode === this.$.items ? r !== void 0 ? r : e.index : this.__getIndexOfChildElement(e);
  }
  /**
   * Returns the target row after navigating by the given dy offset.
   * Also returns information whether the details cell should be the target on the target row.
   * If the row is not in the viewport, it is first scrolled to.
   * @private
   */
  __navigateRows(e, r, i) {
    const s = this.__getIndexInGroup(r, this._focusedItemIndex), l = r.parentNode, d = (l === this.$.items ? this._flatSize : l.children.length) - 1;
    let f = Math.max(0, Math.min(s + e, d));
    if (l !== this.$.items) {
      if (f > s)
        for (; f < d && l.children[f].hidden; )
          f += 1;
      else if (f < s)
        for (; f > 0 && l.children[f].hidden; )
          f -= 1;
      return this.toggleAttribute("navigating", !0), { dstRow: l.children[f] };
    }
    let m = !1;
    if (i) {
      const g = this.__isDetailsCell(i);
      if (l === this.$.items) {
        const v = r._item, { item: z } = this._dataProviderController.getFlatIndexContext(f);
        g ? m = e === 0 : m = e === 1 && this._isDetailsOpened(v) || e === -1 && f !== s && this._isDetailsOpened(z), m !== g && (e === 1 && m || e === -1 && !m) && (f = s);
      }
    }
    return this._ensureScrolledToIndex(f), this._focusedItemIndex = f, this.toggleAttribute("navigating", !0), {
      dstRow: [...l.children].find((g) => !g.hidden && g.index === f),
      dstIsRowDetails: m
    };
  }
  /**
   * Focuses the target cell after navigating by the given dx and dy offset.
   * If the cell is not in the viewport, it is first scrolled to.
   * @private
   */
  _onCellNavigation(e, r, i) {
    const s = e.parentNode, { dstRow: l, dstIsRowDetails: d } = this.__navigateRows(i, s, e);
    if (!l)
      return;
    let f = this.__getIndexOfChildElement(e);
    this.$.items.contains(e) && (f = [...this.$.sizer.children].findIndex((z) => z._column === e._column));
    const m = this.__isDetailsCell(e), g = s.parentNode, v = this.__getIndexInGroup(s, this._focusedItemIndex);
    if (this._focusedColumnOrder === void 0 && (m ? this._focusedColumnOrder = 0 : this._focusedColumnOrder = this._getColumns(g, v).filter((z) => !z.hidden)[f]._order), d)
      [...l.children].find((B) => this.__isDetailsCell(B)).focus();
    else {
      const z = this.__getIndexInGroup(l, this._focusedItemIndex), B = this._getColumns(g, z).filter((ue) => !ue.hidden), H = B.map((ue) => ue._order).sort((ue, ge) => ue - ge), ee = H.length - 1, se = H.indexOf(
        H.slice(0).sort((ue, ge) => Math.abs(ue - this._focusedColumnOrder) - Math.abs(ge - this._focusedColumnOrder))[0]
      ), ae = i === 0 && m ? se : Math.max(0, Math.min(se + r, ee));
      ae !== se && (this._focusedColumnOrder = void 0);
      const Oe = B.reduce((ue, ge, Ce) => (ue[ge._order] = Ce, ue), {})[H[ae]];
      let we;
      if (this.$.items.contains(e)) {
        const ue = this.$.sizer.children[Oe];
        this._lazyColumns && (this.__isColumnInViewport(ue._column) || ue.scrollIntoView(), this.__updateColumnsBodyContentHidden(), this.__updateHorizontalScrollPosition()), we = [...l.children].find((ge) => ge._column === ue._column), this._scrollHorizontallyToCell(we);
      } else
        we = l.children[Oe], this._scrollHorizontallyToCell(we);
      we.focus();
    }
  }
  /** @private */
  _onInteractionKeyDown(e, r) {
    const i = e.composedPath()[0], s = i.localName === "input" && !/^(button|checkbox|color|file|image|radio|range|reset|submit)$/iu.test(i.type);
    let l;
    switch (r) {
      case "Enter":
        l = this.interacting ? !s : !0;
        break;
      case "Escape":
        l = !1;
        break;
      case "F2":
        l = !this.interacting;
        break;
    }
    const { cell: d } = this._getGridEventLocation(e);
    if (this.interacting !== l && d !== null)
      if (l) {
        const f = d._content.querySelector("[focus-target]") || // If a child element hasn't been explicitly marked as a focus target,
        // fall back to any focusable element inside the cell.
        [...d._content.querySelectorAll("*")].find((m) => this._isFocusable(m));
        f && (e.preventDefault(), f.focus(), this._setInteracting(!0), this.toggleAttribute("navigating", !1));
      } else
        e.preventDefault(), this._focusedColumnOrder = void 0, d.focus(), this._setInteracting(!1), this.toggleAttribute("navigating", !0);
    r === "Escape" && this._hideTooltip(!0);
  }
  /** @private */
  _predictFocusStepTarget(e, r) {
    const i = [
      this.$.table,
      this._headerFocusable,
      this._itemsFocusable,
      this._footerFocusable,
      this.$.focusexit
    ];
    let s = i.indexOf(e);
    for (s += r; s >= 0 && s <= i.length - 1; ) {
      let d = i[s];
      if (d && !this.__rowFocusMode && (d = i[s].parentNode), !d || d.hidden)
        s += r;
      else
        break;
    }
    let l = i[s];
    if (l && !this.__isHorizontallyInViewport(l)) {
      const d = this._getColumnsInOrder().find((f) => this.__isColumnInViewport(f));
      if (d)
        if (l === this._headerFocusable)
          l = d._headerCell;
        else if (l === this._itemsFocusable) {
          const f = l._column._cells.indexOf(l);
          l = d._cells[f];
        } else l === this._footerFocusable && (l = d._footerCell);
    }
    return l;
  }
  /** @private */
  _onTabKeyDown(e) {
    const r = this._predictFocusStepTarget(e.composedPath()[0], e.shiftKey ? -1 : 1);
    if (r) {
      if (e.stopPropagation(), r === this.$.table)
        this.$.table.focus();
      else if (r === this.$.focusexit)
        this.$.focusexit.focus();
      else if (r === this._itemsFocusable) {
        let i = r;
        const s = this.__isRow(r) ? r : r.parentNode;
        if (this._ensureScrolledToIndex(this._focusedItemIndex), s.index !== this._focusedItemIndex && this.__isCell(r)) {
          const l = Array.from(s.children).indexOf(this._itemsFocusable), d = Array.from(this.$.items.children).find(
            (f) => !f.hidden && f.index === this._focusedItemIndex
          );
          d && (i = d.children[l]);
        }
        e.preventDefault(), i.focus();
      } else
        e.preventDefault(), r.focus();
      this.toggleAttribute("navigating", !0);
    }
  }
  /** @private */
  _onSpaceKeyDown(e) {
    e.preventDefault();
    const r = e.composedPath()[0], i = this.__isRow(r);
    (i || !r._content || !r._content.firstElementChild) && this.dispatchEvent(
      new CustomEvent(i ? "row-activate" : "cell-activate", {
        detail: {
          model: this.__getRowModel(i ? r : r.parentElement)
        }
      })
    );
  }
  /** @private */
  _onKeyUp(e) {
    if (!/^( |SpaceBar)$/u.test(e.key) || this.interacting)
      return;
    e.preventDefault();
    const r = e.composedPath()[0];
    if (r._content && r._content.firstElementChild) {
      const i = this.hasAttribute("navigating");
      r._content.firstElementChild.dispatchEvent(
        new MouseEvent("click", {
          shiftKey: e.shiftKey,
          bubbles: !0,
          composed: !0,
          cancelable: !0
        })
      ), this.toggleAttribute("navigating", i);
    }
  }
  /**
   * @param {!FocusEvent} e
   * @protected
   */
  _onFocusIn(e) {
    this._isMousedown || this.toggleAttribute("navigating", !0);
    const r = e.composedPath()[0];
    r === this.$.table || r === this.$.focusexit ? (this._isMousedown || this._predictFocusStepTarget(r, r === this.$.table ? 1 : -1).focus(), this._setInteracting(!1)) : this._detectInteracting(e);
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
    const { section: r, cell: i, row: s } = this._getGridEventLocation(e);
    if (!(!i && !this.__rowFocusMode)) {
      if (this._detectInteracting(e), r && (i || s))
        if (this._activeRowGroup = r, this.$.header === r ? this._headerFocusable = this.__getFocusable(s, i) : this.$.items === r ? this._itemsFocusable = this.__getFocusable(s, i) : this.$.footer === r && (this._footerFocusable = this.__getFocusable(s, i)), i) {
          const l = this.getEventContext(e);
          this.__pendingBodyCellFocus = this.loading && l.section === "body", this.__pendingBodyCellFocus || i.dispatchEvent(new CustomEvent("cell-focus", { bubbles: !0, composed: !0, detail: { context: l } })), this._focusedCell = i._focusButton || i, fs() && e.target === i && this._showTooltip(e);
        } else
          this._focusedCell = null;
      this._detectFocusedItemIndex(e);
    }
  }
  /**
   * @private
   */
  __dispatchPendingBodyCellFocus() {
    this.__pendingBodyCellFocus && this.shadowRoot.activeElement === this._itemsFocusable && this._itemsFocusable.dispatchEvent(new Event("focusin", { bubbles: !0, composed: !0 }));
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
  __getFocusable(e, r) {
    return this.__rowFocusMode ? e : r._focusButton || r;
  }
  /**
   * Enables interaction mode if a cells descendant receives focus or keyboard
   * input. Disables it if the event is not related to cell content.
   * @param {!KeyboardEvent|!FocusEvent} e
   * @private
   */
  _detectInteracting(e) {
    const r = e.composedPath().some((i) => i.localName === "vaadin-grid-cell-content");
    this._setInteracting(r), this.__updateHorizontalScrollPosition();
  }
  /** @private */
  _detectFocusedItemIndex(e) {
    const { section: r, row: i } = this._getGridEventLocation(e);
    r === this.$.items && (this._focusedItemIndex = i.index);
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
    const r = this._getGridSectionFromFocusTarget(e), i = this.interacting && r === this._activeRowGroup;
    e.tabIndex = i ? -1 : 0;
  }
  /**
   * @param {!HTMLTableRowElement} row
   * @param {number} index
   * @protected
   */
  _preventScrollerRotatingCellFocus(e, r) {
    e.index === this._focusedItemIndex && this.hasAttribute("navigating") && this._activeRowGroup === this.$.items && (this._navigatingIsHidden = !0, this.toggleAttribute("navigating", !1)), r === this._focusedItemIndex && this._navigatingIsHidden && (this._navigatingIsHidden = !1, this.toggleAttribute("navigating", !0));
  }
  /**
   * @param {HTMLTableSectionElement=} rowGroup
   * @param {number=} rowIndex
   * @return {!Array<!GridColumn>}
   * @protected
   */
  _getColumns(e, r) {
    let i = this._columnTree.length - 1;
    return e === this.$.header ? i = r : e === this.$.footer && (i = this._columnTree.length - 1 - r), this._columnTree[i];
  }
  /** @private */
  __isValidFocusable(e) {
    return this.$.table.contains(e) && e.offsetHeight;
  }
  /** @protected */
  _resetKeyboardNavigation() {
    if (!this.$ && this.performUpdate && this.performUpdate(), ["header", "footer"].forEach((e) => {
      if (!this.__isValidFocusable(this[`_${e}Focusable`])) {
        const r = [...this.$[e].children].find((s) => s.offsetHeight), i = r ? [...r.children].find((s) => !s.hidden) : null;
        r && i && (this[`_${e}Focusable`] = this.__getFocusable(r, i));
      }
    }), !this.__isValidFocusable(this._itemsFocusable) && this.$.items.firstElementChild) {
      const e = this.__getFirstVisibleItem(), r = e ? [...e.children].find((i) => !i.hidden) : null;
      r && e && (this._focusedColumnOrder = void 0, this._itemsFocusable = this.__getFocusable(e, r));
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
    const r = e.getBoundingClientRect(), i = e.parentNode, s = Array.from(i.children).indexOf(e), l = this.$.table.getBoundingClientRect();
    let d = l.left, f = l.right;
    for (let m = s - 1; m >= 0; m--) {
      const g = i.children[m];
      if (!(g.hasAttribute("hidden") || this.__isDetailsCell(g)) && (g.hasAttribute("frozen") || g.hasAttribute("frozen-to-end"))) {
        d = g.getBoundingClientRect().right;
        break;
      }
    }
    for (let m = s + 1; m < i.children.length; m++) {
      const g = i.children[m];
      if (!(g.hasAttribute("hidden") || this.__isDetailsCell(g)) && (g.hasAttribute("frozen") || g.hasAttribute("frozen-to-end"))) {
        f = g.getBoundingClientRect().left;
        break;
      }
    }
    r.left < d && (this.$.table.scrollLeft += Math.round(r.left - d)), r.right > f && (this.$.table.scrollLeft += Math.round(r.right - f));
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
    const r = e.composedPath(), i = r.indexOf(this.$.table), s = i >= 1 ? r[i - 1] : null, l = i >= 2 ? r[i - 2] : null, d = i >= 3 ? r[i - 3] : null;
    return {
      section: s,
      row: l,
      cell: d
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
 * Copyright (c) 2016 - 2024 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
const op = (n) => class extends n {
  static get properties() {
    return {
      /**
       * An array containing references to items with open row details.
       * @type {!Array<!GridItem>}
       */
      detailsOpenedItems: {
        type: Array,
        value: () => [],
        sync: !0
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
      rowDetailsRenderer: {
        type: Function,
        sync: !0
      },
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
      "_detailsOpenedItemsChanged(detailsOpenedItems, rowDetailsRenderer)",
      "_rowDetailsRendererChanged(rowDetailsRenderer)"
    ];
  }
  /** @protected */
  ready() {
    super.ready(), this._detailsCellResizeObserver = new ResizeObserver((e) => {
      e.forEach(({ target: r }) => {
        this._updateDetailsCellHeight(r.parentElement);
      }), this.__virtualizer.__adapter._resizeHandler();
    });
  }
  /** @private */
  _rowDetailsRendererChanged(e) {
    e && this._columnTree && Pe(this.$.items, (r) => {
      if (!r.querySelector("[part~=details-cell]")) {
        this._updateRow(r, this._columnTree[this._columnTree.length - 1]);
        const i = this._isDetailsOpened(r._item);
        this._toggleDetailsCell(r, i);
      }
    });
  }
  /** @private */
  _detailsOpenedItemsChanged(e, r) {
    Pe(this.$.items, (i) => {
      if (i.hasAttribute("details-opened")) {
        this._updateItem(i, i._item);
        return;
      }
      r && this._isDetailsOpened(i._item) && this._updateItem(i, i._item);
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
  _toggleDetailsCell(e, r) {
    const i = e.querySelector('[part~="details-cell"]');
    i && (i.hidden = !r, !i.hidden && this.rowDetailsRenderer && (i._renderer = this.rowDetailsRenderer));
  }
  /** @protected */
  _updateDetailsCellHeight(e) {
    const r = e.querySelector('[part~="details-cell"]');
    r && (this.__updateDetailsRowPadding(e, r), requestAnimationFrame(() => this.__updateDetailsRowPadding(e, r)));
  }
  /** @private */
  __updateDetailsRowPadding(e, r) {
    r.hidden ? e.style.removeProperty("padding-bottom") : e.style.setProperty("padding-bottom", `${r.offsetHeight}px`);
  }
  /** @protected */
  _updateDetailsCellHeights() {
    Pe(this.$.items, (e) => {
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
    this._isDetailsOpened(e) && (this.detailsOpenedItems = this.detailsOpenedItems.filter((r) => !this._itemsEqual(r, e)));
  }
};
/**
 * @license
 * Copyright (c) 2022 - 2024 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
const bn = document.createElement("div");
bn.style.position = "fixed";
bn.style.clip = "rect(0px, 0px, 0px, 0px)";
bn.setAttribute("aria-live", "polite");
document.body.appendChild(bn);
/**
 * @license
 * Copyright (c) 2021 - 2024 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
const xs = me(
  (n) => class extends n {
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
 * Copyright (c) 2021 - 2024 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
const Oc = me(
  (n) => class extends n {
    /**
     * @protected
     * @return {boolean}
     */
    get _keyboardActive() {
      return fs();
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
 * Copyright (c) 2021 - 2024 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
const sp = me(
  (n) => class extends Oc(bc(n)) {
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
      this.focusElement && !this.disabled && this.focusElement.focus();
    }
    /**
     * @protected
     * @override
     */
    blur() {
      this.focusElement && this.focusElement.blur();
    }
    /**
     * @protected
     * @override
     */
    click() {
      this.focusElement && !this.disabled && this.focusElement.click();
    }
    /** @protected */
    _focusElementChanged(e, r) {
      e ? (e.disabled = this.disabled, this._addFocusListeners(e), this.__forwardTabIndex(this.tabindex)) : r && this._removeFocusListeners(r);
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
     * @param {FocusEvent} event
     * @return {boolean}
     * @protected
     * @override
     */
    _shouldSetFocus(e) {
      return e.target === this.focusElement;
    }
    /**
     * @param {FocusEvent} event
     * @return {boolean}
     * @protected
     * @override
     */
    _shouldRemoveFocus(e) {
      return e.target === this.focusElement;
    }
    /**
     * @param {boolean} disabled
     * @param {boolean} oldDisabled
     * @protected
     * @override
     */
    _disabledChanged(e, r) {
      super._disabledChanged(e, r), this.focusElement && (this.focusElement.disabled = e), e && this.blur();
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
 * Copyright (c) 2023 - 2024 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
const bo = /* @__PURE__ */ new Map();
function ws(n) {
  return bo.has(n) || bo.set(n, /* @__PURE__ */ new WeakMap()), bo.get(n);
}
function zc(n, t) {
  n && n.removeAttribute(t);
}
function Rc(n, t) {
  if (!n || !t)
    return;
  const e = ws(t);
  if (e.has(n))
    return;
  const r = ds(n.getAttribute(t));
  e.set(n, new Set(r));
}
function ap(n, t) {
  if (!n || !t)
    return;
  const e = ws(t), r = e.get(n);
  !r || r.size === 0 ? n.removeAttribute(t) : _n(n, t, pn(r)), e.delete(n);
}
function vo(n, t, e = { newId: null, oldId: null, fromUser: !1 }) {
  if (!n || !t)
    return;
  const { newId: r, oldId: i, fromUser: s } = e, l = ws(t), d = l.get(n);
  if (!s && d) {
    i && d.delete(i), r && d.add(r);
    return;
  }
  s && (d ? r || l.delete(n) : Rc(n, t), zc(n, t)), us(n, t, i);
  const f = r || pn(d);
  f && _n(n, t, f);
}
function lp(n, t) {
  Rc(n, t), zc(n, t);
}
/**
 * @license
 * Copyright (c) 2021 - 2024 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
class cp {
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
    const r = e ? this.__labelIdFromUser : this.__labelId;
    this.__setLabelIdToAriaAttribute(t, r, e), e ? this.__labelIdFromUser = t : this.__labelId = t;
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
    this.__target && (t ? (lp(this.__target, "aria-labelledby"), this.__target.setAttribute("aria-label", t)) : this.__label && (ap(this.__target, "aria-labelledby"), this.__target.removeAttribute("aria-label")));
  }
  /**
   * @param {string | null | undefined} labelId
   * @param {string | null | undefined} oldLabelId
   * @param {boolean | null | undefined} fromUser
   * @private
   */
  __setLabelIdToAriaAttribute(t, e, r) {
    vo(this.__target, "aria-labelledby", { newId: t, oldId: e, fromUser: r });
  }
  /**
   * @param {string | null | undefined} errorId
   * @param {string | null | undefined} oldErrorId
   * @private
   */
  __setErrorIdToAriaAttribute(t, e) {
    vo(this.__target, "aria-describedby", { newId: t, oldId: e, fromUser: !1 });
  }
  /**
   * @param {string | null | undefined} helperId
   * @param {string | null | undefined} oldHelperId
   * @private
   */
  __setHelperIdToAriaAttribute(t, e) {
    vo(this.__target, "aria-describedby", { newId: t, oldId: e, fromUser: !1 });
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
 * Copyright (c) 2021 - 2024 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
const yo = [];
class dp {
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
    return pf(this.__trapNode);
  }
  /**
   * The index of the element inside the trap node that currently has focus.
   *
   * @return {HTMLElement | undefined}
   * @private
   */
  get __focusedElementIndex() {
    const t = this.__focusableElements;
    return t.indexOf(t.filter(_c).pop());
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
    yo.push(this), this.__focusedElementIndex === -1 && this.__focusableElements[0].focus();
  }
  /**
   * Deactivates the focus trap set with the `.trapFocus()` method
   * so that it becomes possible to tab outside the trap node.
   */
  releaseFocus() {
    this.__trapNode = null, yo.pop();
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
    if (this.__trapNode && this === Array.from(yo).pop() && t.key === "Tab") {
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
    const e = this.__focusableElements, r = t ? -1 : 1, i = this.__focusedElementIndex, s = (e.length + i + r) % e.length, l = e[s];
    l.focus(), l.localName === "input" && l.select();
  }
}
/**
 * @license
 * Copyright (c) 2021 - 2024 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
class up {
  /**
   * Saves the given node as a target for restoring focus to
   * when `restoreFocus()` is called. If no node is provided,
   * the currently focused node in the DOM is saved as a target.
   *
   * @param {Node | null | undefined} focusNode
   */
  saveFocus(t) {
    this.focusNode = t || Uo();
  }
  /**
   * Restores focus to the target node that was saved previously with `saveFocus()`.
   */
  restoreFocus() {
    const t = this.focusNode;
    t && (Uo() === document.body ? setTimeout(() => t.focus()) : t.focus(), this.focusNode = null);
  }
}
/**
 * @license
 * Copyright (c) 2021 - 2024 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
function il(n, t) {
  const { scrollLeft: e } = n;
  return t !== "rtl" ? e : n.scrollWidth - n.clientWidth + e;
}
/**
 * @license
 * Copyright (c) 2021 - 2024 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
const Di = new ResizeObserver((n) => {
  setTimeout(() => {
    n.forEach((t) => {
      t.target.resizables ? t.target.resizables.forEach((e) => {
        e._onResize(t.contentRect);
      }) : t.target._onResize(t.contentRect);
    });
  });
}), hp = me(
  (n) => class extends n {
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
      if (super.connectedCallback(), Di.observe(this), this._observeParent) {
        const e = this.parentNode instanceof ShadowRoot ? this.parentNode.host : this.parentNode;
        e.resizables || (e.resizables = /* @__PURE__ */ new Set(), Di.observe(e)), e.resizables.add(this), this.__parent = e;
      }
    }
    /** @protected */
    disconnectedCallback() {
      super.disconnectedCallback(), Di.unobserve(this);
      const e = this.__parent;
      if (this._observeParent && e) {
        const r = e.resizables;
        r && (r.delete(this), r.size === 0 && Di.unobserve(e)), this.__parent = null;
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
 * Copyright (c) 2016 - 2024 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
const nl = {
  SCROLLING: 500,
  UPDATE_CONTENT_VISIBILITY: 100
}, fp = (n) => class extends hp(n) {
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
        value: "eager",
        sync: !0
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
      const r = e.composedPath().indexOf(this.$.items);
      this._rowWithFocusedElement = e.composedPath()[r - 1], this._rowWithFocusedElement && (this.__scrollIntoViewport(this._rowWithFocusedElement.index), this.$.table.contains(e.relatedTarget) || this.$.table.dispatchEvent(
        new CustomEvent("virtualizer-element-focused", { detail: { element: this._rowWithFocusedElement } })
      ));
    }), this.$.items.addEventListener("focusout", () => {
      this._rowWithFocusedElement = void 0;
    }), this.$.table.addEventListener("scroll", () => this._afterScroll());
  }
  /**
   * @protected
   * @override
   */
  _onResize() {
    if (this._updateOverflow(), this.__updateHorizontalScrollPosition(), this._firefox) {
      const e = !nn(this);
      e && this.__previousVisible === !1 && (this._scrollTop = this.__memorizedScrollTop || 0), this.__previousVisible = e;
    }
  }
  /**
   * Scroll to a flat index in the grid. The method doesn't take into account
   * the hierarchy of the items.
   *
   * @param {number} index Row index to scroll to
   * @protected
   */
  _scrollToFlatIndex(e) {
    e = Math.min(this._flatSize - 1, Math.max(0, e)), this.__virtualizer.scrollToIndex(e), this.__scrollIntoViewport(e);
  }
  /**
   * Makes sure the row with the given index (if found in the DOM) is fully
   * inside the visible viewport, taking header/footer into account.
   * @private
   */
  __scrollIntoViewport(e) {
    const r = [...this.$.items.children].find((i) => i.index === e);
    if (r) {
      const i = r.getBoundingClientRect(), s = this.$.footer.getBoundingClientRect().top, l = this.$.header.getBoundingClientRect().bottom;
      i.bottom > s ? this.$.table.scrollTop += i.bottom - s : i.top < l && (this.$.table.scrollTop -= l - i.top);
    }
  }
  /** @private */
  _scheduleScrolling() {
    this._scrollingFrame || (this._scrollingFrame = requestAnimationFrame(() => this.$.scroller.toggleAttribute("scrolling", !0))), this._debounceScrolling = ie.debounce(this._debounceScrolling, Ke.after(nl.SCROLLING), () => {
      cancelAnimationFrame(this._scrollingFrame), delete this._scrollingFrame, this.$.scroller.toggleAttribute("scrolling", !1);
    });
  }
  /** @private */
  _afterScroll() {
    this.__updateHorizontalScrollPosition(), this.hasAttribute("reordering") || this._scheduleScrolling(), this.hasAttribute("navigating") || this._hideTooltip(!0), this._updateOverflow(), this._debounceColumnContentVisibility = ie.debounce(
      this._debounceColumnContentVisibility,
      Ke.after(nl.UPDATE_CONTENT_VISIBILITY),
      () => {
        this._lazyColumns && this.__cachedScrollLeft !== this._scrollLeft && (this.__cachedScrollLeft = this._scrollLeft, this.__updateColumnsBodyContentHidden());
      }
    ), this._firefox && !nn(this) && this.__previousVisible !== !1 && (this.__memorizedScrollTop = this._scrollTop);
  }
  /** @private */
  __updateColumnsBodyContentHidden() {
    if (!this._columnTree || !this._areSizerCellsAssigned())
      return;
    const e = this._getColumnsInOrder();
    let r = !1;
    if (e.forEach((i) => {
      const s = this._lazyColumns && !this.__isColumnInViewport(i);
      i._bodyContentHidden !== s && (r = !0, i._cells.forEach((l) => {
        if (l !== i._sizerCell) {
          if (s)
            l.remove();
          else if (l.__parentRow) {
            const d = [...l.__parentRow.children].find(
              (f) => e.indexOf(f._column) > e.indexOf(i)
            );
            l.__parentRow.insertBefore(l, d);
          }
        }
      })), i._bodyContentHidden = s;
    }), r && this._frozenCellsChanged(), this._lazyColumns) {
      const i = [...e].reverse().find((d) => d.frozen), s = this.__getColumnEnd(i), l = e.find((d) => !d.frozen && !d._bodyContentHidden);
      this.__lazyColumnsStart = this.__getColumnStart(l) - s, this.$.items.style.setProperty("--_grid-lazy-columns-start", `${this.__lazyColumnsStart}px`), this._resetKeyboardNavigation();
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
    return e.frozen || e.frozenToEnd ? !0 : this.__isHorizontallyInViewport(e._sizerCell);
  }
  /** @private */
  __isHorizontallyInViewport(e) {
    return e.offsetLeft + e.offsetWidth >= this._scrollLeft && e.offsetLeft <= this._scrollLeft + this.clientWidth;
  }
  /** @private */
  __columnRenderingChanged(e, r) {
    r === "eager" ? this.$.scroller.removeAttribute("column-rendering") : this.$.scroller.setAttribute("column-rendering", r), this.__updateColumnsBodyContentHidden();
  }
  /** @private */
  _updateOverflow() {
    this._debounceOverflow = ie.debounce(this._debounceOverflow, zt, () => {
      this.__doUpdateOverflow();
    });
  }
  /** @private */
  __doUpdateOverflow() {
    let e = "";
    const r = this.$.table;
    r.scrollTop < r.scrollHeight - r.clientHeight && (e += " bottom"), r.scrollTop > 0 && (e += " top");
    const i = il(r, this.getAttribute("dir"));
    i > 0 && (e += " start"), i < r.scrollWidth - r.clientWidth && (e += " end"), this.__isRTL && (e = e.replace(/start|end/giu, (l) => l === "start" ? "end" : "start")), r.scrollLeft < r.scrollWidth - r.clientWidth && (e += " right"), r.scrollLeft > 0 && (e += " left");
    const s = e.trim();
    s.length > 0 && this.getAttribute("overflow") !== s ? this.setAttribute("overflow", s) : s.length === 0 && this.hasAttribute("overflow") && this.removeAttribute("overflow");
  }
  /** @protected */
  _frozenCellsChanged() {
    this._debouncerCacheElements = ie.debounce(this._debouncerCacheElements, $e, () => {
      Array.from(this.shadowRoot.querySelectorAll('[part~="cell"]')).forEach((e) => {
        e.style.transform = "";
      }), this._frozenCells = Array.prototype.slice.call(this.$.table.querySelectorAll("[frozen]")), this._frozenToEndCells = Array.prototype.slice.call(this.$.table.querySelectorAll("[frozen-to-end]")), this.__updateHorizontalScrollPosition();
    }), this._debounceUpdateFrozenColumn();
  }
  /** @protected */
  _debounceUpdateFrozenColumn() {
    this.__debounceUpdateFrozenColumn = ie.debounce(
      this.__debounceUpdateFrozenColumn,
      $e,
      () => this._updateFrozenColumn()
    );
  }
  /** @private */
  _updateFrozenColumn() {
    if (!this._columnTree)
      return;
    const e = this._columnTree[this._columnTree.length - 1].slice(0);
    e.sort((s, l) => s._order - l._order);
    let r, i;
    for (let s = 0; s < e.length; s++) {
      const l = e[s];
      l._lastFrozen = !1, l._firstFrozenToEnd = !1, i === void 0 && l.frozenToEnd && !l.hidden && (i = s), l.frozen && !l.hidden && (r = s);
    }
    r !== void 0 && (e[r]._lastFrozen = !0), i !== void 0 && (e[i]._firstFrozenToEnd = !0), this.__updateColumnsBodyContentHidden();
  }
  /** @private */
  __updateHorizontalScrollPosition() {
    if (!this._columnTree)
      return;
    const e = this.$.table.scrollWidth, r = this.$.table.clientWidth, i = Math.max(0, this.$.table.scrollLeft), s = il(this.$.table, this.getAttribute("dir")), l = `translate(${-i}px, 0)`;
    this.$.header.style.transform = l, this.$.footer.style.transform = l, this.$.items.style.transform = l;
    const d = this.__isRTL ? s + r - e : i, f = `translate(${d}px, 0)`;
    this._frozenCells.forEach((z) => {
      z.style.transform = f;
    });
    const m = this.__isRTL ? s : i + r - e, g = `translate(${m}px, 0)`;
    let v = g;
    if (this._lazyColumns && this._areSizerCellsAssigned()) {
      const z = this._getColumnsInOrder(), B = [...z].reverse().find((re) => !re.frozenToEnd && !re._bodyContentHidden), H = this.__getColumnEnd(B), ee = z.find((re) => re.frozenToEnd), se = this.__getColumnStart(ee);
      v = `translate(${m + (se - H) + this.__lazyColumnsStart}px, 0)`;
    }
    this._frozenToEndCells.forEach((z) => {
      this.$.items.contains(z) ? z.style.transform = v : z.style.transform = g;
    }), this.hasAttribute("navigating") && this.__rowFocusMode && this.$.table.style.setProperty("--_grid-horizontal-scroll-position", `${-d}px`);
  }
  /** @private */
  _areSizerCellsAssigned() {
    return this._getColumnsInOrder().every((e) => e._sizerCell);
  }
};
/**
 * @license
 * Copyright (c) 2016 - 2024 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
const pp = (n) => class extends n {
  static get properties() {
    return {
      /**
       * An array that contains the selected items.
       * @type {!Array<!GridItem>}
       */
      selectedItems: {
        type: Object,
        notify: !0,
        value: () => [],
        sync: !0
      },
      /**
       * Set of selected item ids
       * @private
       */
      __selectedKeys: {
        type: Object,
        computed: "__computeSelectedKeys(itemIdPath, selectedItems)"
      }
    };
  }
  static get observers() {
    return ["__selectedItemsChanged(itemIdPath, selectedItems)"];
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
    this._isSelected(e) && (this.selectedItems = this.selectedItems.filter((r) => !this._itemsEqual(r, e)));
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
  __computeSelectedKeys(e, r) {
    const i = r || [], s = /* @__PURE__ */ new Set();
    return i.forEach((l) => {
      s.add(this.getItemId(l));
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
 * Copyright (c) 2016 - 2024 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
let ol = "prepend";
const _p = (n) => class extends n {
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
        value: () => ol
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
    ol = ["append", "prepend"].includes(e) ? e : "prepend";
  }
  /** @protected */
  ready() {
    super.ready(), this.addEventListener("sorter-changed", this._onSorterChanged);
  }
  /** @private */
  _onSorterChanged(e) {
    const r = e.target;
    e.stopPropagation(), r._grid = this, this.__updateSorter(r, e.detail.shiftClick, e.detail.fromSorterClick), this.__applySorters();
  }
  /** @private */
  __removeSorters(e) {
    e.length !== 0 && (this._sorters = this._sorters.filter((r) => !e.includes(r)), this.__applySorters());
  }
  /** @private */
  __updateSortOrders() {
    this._sorters.forEach((r) => {
      r._order = null;
    });
    const e = this._getActiveSorters();
    e.length > 1 && e.forEach((r, i) => {
      r._order = i;
    });
  }
  /** @private */
  __updateSorter(e, r, i) {
    if (!e.direction && !this._sorters.includes(e))
      return;
    e._order = null;
    const s = this._sorters.filter((l) => l !== e);
    this.multiSort && (!this.multiSortOnShiftClick || !i) || this.multiSortOnShiftClick && r ? this.multiSortPriority === "append" ? this._sorters = [...s, e] : this._sorters = [e, ...s] : (e.direction || this.multiSortOnShiftClick) && (this._sorters = e.direction ? [e] : [], s.forEach((l) => {
      l._order = null, l.direction = null;
    }));
  }
  /** @private */
  __applySorters() {
    this.__updateSortOrders(), this.dataProvider && // No need to clear cache if sorters didn't change and grid is attached
    this.isAttached && JSON.stringify(this._previousSorters) !== JSON.stringify(this._mapSorters()) && this.__debounceClearCache(), this._a11yUpdateSorters(), this._previousSorters = this._mapSorters();
  }
  /**
   * @type {GridSorterDefinition[]}
   * @protected
   */
  _getActiveSorters() {
    return this._sorters.filter((e) => e.direction && e.isConnected);
  }
  /**
   * @return {!Array<!GridSorterDefinition>}
   * @protected
   */
  _mapSorters() {
    return this._getActiveSorters().map((e) => ({
      path: e.path,
      direction: e.direction
    }));
  }
};
/**
 * @license
 * Copyright (c) 2016 - 2024 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
const mp = (n) => class extends n {
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
      cellClassNameGenerator: {
        type: Function,
        sync: !0
      },
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
      cellPartNameGenerator: {
        type: Function,
        sync: !0
      }
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
    Pe(this.$.items, (e) => {
      e.hidden || this._generateCellClassNames(e, this.__getRowModel(e));
    });
  }
  /**
   * Runs the `cellPartNameGenerator` for the visible cells.
   * If the generator depends on varying conditions, you need to
   * call this function manually in order to update the styles when
   * the conditions change.
   */
  generateCellPartNames() {
    Pe(this.$.items, (e) => {
      e.hidden || this._generateCellPartNames(e, this.__getRowModel(e));
    });
  }
  /** @private */
  _generateCellClassNames(e, r) {
    or(e, (i) => {
      if (i.__generatedClasses && i.__generatedClasses.forEach((s) => i.classList.remove(s)), this.cellClassNameGenerator && !e.hasAttribute("loading")) {
        const s = this.cellClassNameGenerator(i._column, r);
        i.__generatedClasses = s && s.split(" ").filter((l) => l.length > 0), i.__generatedClasses && i.__generatedClasses.forEach((l) => i.classList.add(l));
      }
    });
  }
  /** @private */
  _generateCellPartNames(e, r) {
    or(e, (i) => {
      if (i.__generatedParts && i.__generatedParts.forEach((s) => {
        lt(i, null, s);
      }), this.cellPartNameGenerator && !e.hasAttribute("loading")) {
        const s = this.cellPartNameGenerator(i._column, r);
        i.__generatedParts = s && s.split(" ").filter((l) => l.length > 0), i.__generatedParts && i.__generatedParts.forEach((l) => {
          lt(i, !0, l);
        });
      }
    });
  }
};
/**
 * @license
 * Copyright (c) 2016 - 2024 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
const gp = (n) => class extends Of(
  Jf(
    tp(
      Pf(
        fp(
          pp(
            _p(
              op(
                np(
                  Af(
                    ip(
                      Yf(
                        Zf(
                          rp(ep(mp(bc(n))))
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
  static get observers() {
    return ["_columnTreeChanged(_columnTree)", "_flatSizeChanged(_flatSize, __virtualizer, _hasData, _columnTree)"];
  }
  static get properties() {
    return {
      /** @private */
      _safari: {
        type: Boolean,
        value: vc
      },
      /** @private */
      _ios: {
        type: Boolean,
        value: Ko
      },
      /** @private */
      _firefox: {
        type: Boolean,
        value: gf
      },
      /** @private */
      _android: {
        type: Boolean,
        value: Ga
      },
      /** @private */
      _touchDevice: {
        type: Boolean,
        value: Zr
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
    return this._getRenderedRows().find((t) => this._isInViewport(t));
  }
  /** @private */
  __getLastVisibleItem() {
    return this._getRenderedRows().reverse().find((t) => this._isInViewport(t));
  }
  /** @private */
  _isInViewport(t) {
    const e = this.$.table.getBoundingClientRect(), r = t.getBoundingClientRect(), i = this.$.header.getBoundingClientRect().height, s = this.$.footer.getBoundingClientRect().height;
    return r.bottom > e.top + i && r.top < e.bottom - s;
  }
  /** @private */
  _getRenderedRows() {
    return Array.from(this.$.items.children).filter((t) => !t.hidden).sort((t, e) => t.index - e.index);
  }
  /** @protected */
  _getRowContainingNode(t) {
    const e = uc("vaadin-grid-cell-content", t);
    return e ? e.assignedSlot.parentElement.parentElement : void 0;
  }
  /** @protected */
  _isItemAssignedToRow(t, e) {
    const r = this.__getRowModel(e);
    return this.getItemId(t) === this.getItemId(r.item);
  }
  /** @protected */
  ready() {
    super.ready(), this.__virtualizer = new Cc({
      createElements: this._createScrollerRows.bind(this),
      updateElement: this._updateScrollerItem.bind(this),
      scrollContainer: this.$.items,
      scrollTarget: this.$.table,
      reorderElements: !0
    }), new ResizeObserver(
      () => setTimeout(() => {
        this.__updateColumnsBodyContentHidden(), this.__tryToRecalculateColumnWidthsIfPending();
      })
    ).observe(this.$.table), cs(this), this._tooltipController = new xc(this), this.addController(this._tooltipController), this._tooltipController.setManual(!0);
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
    const r = this._getRenderedRows().find((s) => s._item === t), i = r && [...r.children].find((s) => s._column === e);
    i && i.focus();
  }
  /** @protected */
  _focusFirstVisibleRow() {
    const t = this.__getFirstVisibleItem();
    this.__rowFocusMode = !0, t.focus();
  }
  /** @private */
  _flatSizeChanged(t, e, r, i) {
    if (e && r && i) {
      const s = this.shadowRoot.activeElement, l = this.__getBodyCellCoordinates(s), d = e.size || 0;
      e.size = t, e.update(d - 1, d - 1), t < d && e.update(t - 1, t - 1), l && s.parentElement.hidden && this.__focusBodyCell(l), this._resetKeyboardNavigation();
    }
  }
  /** @private */
  __getIntrinsicWidth(t) {
    return this.__intrinsicWidthCache.has(t) || this.__calculateAndCacheIntrinsicWidths([t]), this.__intrinsicWidthCache.get(t);
  }
  /** @private */
  __getDistributedWidth(t, e) {
    if (t == null || t === this)
      return 0;
    const r = Math.max(
      this.__getIntrinsicWidth(t),
      this.__getDistributedWidth((t.assignedSlot || t).parentElement, t)
    );
    if (!e)
      return r;
    const i = t, s = r, l = i._visibleChildColumns.map((g) => this.__getIntrinsicWidth(g)).reduce((g, v) => g + v, 0), d = Math.max(0, s - l), m = this.__getIntrinsicWidth(e) / l * d;
    return this.__getIntrinsicWidth(e) + m;
  }
  /**
   * @param {!Array<!GridColumn>} cols the columns to auto size based on their content width
   * @private
   */
  _recalculateColumnWidths(t) {
    this.__virtualizer.flush(), [...this.$.header.children, ...this.$.footer.children].forEach((i) => {
      i.__debounceUpdateHeaderFooterRowVisibility && i.__debounceUpdateHeaderFooterRowVisibility.flush();
    }), this._debouncerHiddenChanged && this._debouncerHiddenChanged.flush(), this.__intrinsicWidthCache = /* @__PURE__ */ new Map();
    const e = this._firstVisibleIndex, r = this._lastVisibleIndex;
    this.__viewportRowsCache = this._getRenderedRows().filter((i) => i.index >= e && i.index <= r), this.__calculateAndCacheIntrinsicWidths(t), t.forEach((i) => {
      i.width = `${this.__getDistributedWidth(i)}px`;
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
    t._allCells.filter((r) => this.$.items.contains(r) ? this.__viewportRowsCache.includes(r.parentElement) : !0).forEach((r) => {
      r.__measuringAutoWidth = e, r.__measuringAutoWidth ? (r.__originalWidth = r.style.width, r.style.width = "auto", r.style.position = "absolute") : (r.style.width = r.__originalWidth, delete r.__originalWidth, r.style.position = "");
    }), e ? this.$.scroller.setAttribute("measuring-auto-width", "") : this.$.scroller.removeAttribute("measuring-auto-width");
  }
  /**
   * Returns the maximum intrinsic width of the cell content in the given column.
   * Only cells which are marked for measuring auto width are considered.
   *
   * @private
   */
  __getAutoWidthCellsMaxWidth(t) {
    return t._allCells.reduce((e, r) => r.__measuringAutoWidth ? Math.max(e, r.offsetWidth + 1) : e, 0);
  }
  /**
   * Calculates and caches the intrinsic width of each given column.
   *
   * @private
   */
  __calculateAndCacheIntrinsicWidths(t) {
    t.forEach((e) => this.__setVisibleCellContentAutoWidth(e, !0)), t.forEach((e) => {
      const r = this.__getAutoWidthCellsMaxWidth(e);
      this.__intrinsicWidthCache.set(e, r);
    }), t.forEach((e) => this.__setVisibleCellContentAutoWidth(e, !1));
  }
  /**
   * Updates the `width` of all columns which have `autoWidth` set to `true`.
   */
  recalculateColumnWidths() {
    if (!this._columnTree)
      return;
    if (nn(this) || this._dataProviderController.isLoading()) {
      this.__pendingRecalculateColumnWidths = !0;
      return;
    }
    const t = this._getColumns().filter((r) => !r.hidden && r.autoWidth), e = t.filter((r) => !customElements.get(r.localName));
    e.length ? Promise.all(e.map((r) => customElements.whenDefined(r.localName))).then(() => {
      this._recalculateColumnWidths(t);
    }) : this._recalculateColumnWidths(t);
  }
  /** @private */
  __tryToRecalculateColumnWidthsIfPending() {
    if (!this.__pendingRecalculateColumnWidths || nn(this) || this._dataProviderController.isLoading() || [...this.$.items.children].some((r) => r.index === void 0))
      return;
    [...this.$.items.children].some((r) => r.clientHeight > 0) && (this.__pendingRecalculateColumnWidths = !1, this.recalculateColumnWidths());
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
    for (let r = 0; r < t; r++) {
      const i = document.createElement("tr");
      i.setAttribute("part", "row body-row"), i.setAttribute("role", "row"), i.setAttribute("tabindex", "-1"), this._columnTree && this._updateRow(i, this._columnTree[this._columnTree.length - 1], "body", !1, !0), e.push(i);
    }
    return this._columnTree && this._columnTree[this._columnTree.length - 1].forEach((r) => {
      r.isConnected && r._cells && (r._cells = [...r._cells]);
    }), this.__afterCreateScrollerRowsDebouncer = ie.debounce(
      this.__afterCreateScrollerRowsDebouncer,
      zt,
      () => {
        this._afterScroll(), this.__tryToRecalculateColumnWidthsIfPending();
      }
    ), e;
  }
  /** @private */
  _createCell(t, e) {
    const i = `vaadin-grid-cell-content-${this._contentIndex = this._contentIndex + 1 || 0}`, s = document.createElement("vaadin-grid-cell-content");
    s.setAttribute("slot", i);
    const l = document.createElement(t);
    l.id = i.replace("-content-", "-"), l.setAttribute("role", t === "td" ? "gridcell" : "columnheader"), !Ga && !Ko && (l.addEventListener("mouseenter", (f) => {
      this.$.scroller.hasAttribute("scrolling") || this._showTooltip(f);
    }), l.addEventListener("mouseleave", () => {
      this._hideTooltip();
    }), l.addEventListener("mousedown", () => {
      this._hideTooltip(!0);
    }));
    const d = document.createElement("slot");
    if (d.setAttribute("name", i), e && e._focusButtonMode) {
      const f = document.createElement("div");
      f.setAttribute("role", "button"), f.setAttribute("tabindex", "-1"), l.appendChild(f), l._focusButton = f, l.focus = function() {
        l._focusButton.focus();
      }, f.appendChild(d);
    } else
      l.setAttribute("tabindex", "-1"), l.appendChild(d);
    return l._content = s, s.addEventListener("mousedown", () => {
      if (mf) {
        const f = (m) => {
          const g = s.contains(this.getRootNode().activeElement), v = m.composedPath().includes(s);
          !g && v && l.focus(), document.removeEventListener("mouseup", f, !0);
        };
        document.addEventListener("mouseup", f, !0);
      } else
        setTimeout(() => {
          s.contains(this.getRootNode().activeElement) || l.focus();
        });
    }), l;
  }
  /**
   * @param {!HTMLTableRowElement} row
   * @param {!Array<!GridColumn>} columns
   * @param {?string} section
   * @param {boolean} isColumnRow
   * @param {boolean} noNotify
   * @protected
   */
  _updateRow(t, e, r = "body", i = !1, s = !1) {
    const l = document.createDocumentFragment();
    or(t, (d) => {
      d._vacant = !0;
    }), t.innerHTML = "", r === "body" && (t.__cells = [], t.__detailsCell = null), e.filter((d) => !d.hidden).forEach((d, f, m) => {
      let g;
      if (r === "body") {
        d._cells || (d._cells = []), g = d._cells.find((z) => z._vacant), g || (g = this._createCell("td", d), d._onCellKeyDown && g.addEventListener("keydown", d._onCellKeyDown.bind(d)), d._cells.push(g)), g.setAttribute("part", "cell body-cell"), g.__parentRow = t, t.__cells.push(g);
        const v = t === this.$.sizer;
        if ((!d._bodyContentHidden || v) && t.appendChild(g), v && (d._sizerCell = g), f === m.length - 1 && this.rowDetailsRenderer) {
          this._detailsCells || (this._detailsCells = []);
          const z = this._detailsCells.find((B) => B._vacant) || this._createCell("td");
          this._detailsCells.indexOf(z) === -1 && this._detailsCells.push(z), z._content.parentElement || l.appendChild(z._content), this._configureDetailsCell(z), t.appendChild(z), t.__detailsCell = z, this._a11ySetRowDetailsCell(t, z), z._vacant = !1;
        }
        s || (d._cells = [...d._cells]);
      } else {
        const v = r === "header" ? "th" : "td";
        i || d.localName === "vaadin-grid-column-group" ? (g = d[`_${r}Cell`], g || (g = this._createCell(v), d._onCellKeyDown && g.addEventListener("keydown", d._onCellKeyDown.bind(d))), g._column = d, t.appendChild(g), d[`_${r}Cell`] = g) : (d._emptyCells || (d._emptyCells = []), g = d._emptyCells.find((z) => z._vacant) || this._createCell(v), g._column = d, t.appendChild(g), d._emptyCells.indexOf(g) === -1 && d._emptyCells.push(g)), g.part.add("cell", `${r}-cell`);
      }
      g._content.parentElement || l.appendChild(g._content), g._vacant = !1, g._column = d;
    }), r !== "body" && this.__debounceUpdateHeaderFooterRowVisibility(t), this.appendChild(l), this._frozenCellsChanged(), this._updateFirstAndLastColumnForRow(t);
  }
  /**
   * @param {HTMLTableRowElement} row
   * @protected
   */
  __debounceUpdateHeaderFooterRowVisibility(t) {
    t.__debounceUpdateHeaderFooterRowVisibility = ie.debounce(
      t.__debounceUpdateHeaderFooterRowVisibility,
      $e,
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
    const e = Array.from(t.children).filter((r) => {
      const i = r._column;
      if (i._emptyCells && i._emptyCells.indexOf(r) > -1)
        return !1;
      if (t.parentElement === this.$.header) {
        if (i.headerRenderer)
          return !0;
        if (i.header === null)
          return !1;
        if (i.path || i.header !== void 0)
          return !0;
      } else if (i.footerRenderer)
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
    Br(t, {
      first: e === 0,
      last: e === this._flatSize - 1,
      odd: e % 2 !== 0,
      even: e % 2 === 0
    });
  }
  /** @private */
  _updateRowStateParts(t, { expanded: e, selected: r, detailsOpened: i }) {
    Br(t, {
      expanded: e,
      collapsed: this.__isRowExpandable(t),
      selected: r,
      "details-opened": i
    });
  }
  /**
   * @param {!Array<!GridColumn>} columnTree
   * @protected
   */
  _renderColumnTree(t) {
    for (Pe(this.$.items, (e) => {
      this._updateRow(e, t[t.length - 1], "body", !1, !0);
      const r = this.__getRowModel(e);
      this._updateRowOrderParts(e), this._updateRowStateParts(e, r), this._filterDragAndDrop(e, r);
    }); this.$.header.children.length < t.length; ) {
      const e = document.createElement("tr");
      e.setAttribute("part", "row"), e.setAttribute("role", "row"), e.setAttribute("tabindex", "-1"), this.$.header.appendChild(e);
      const r = document.createElement("tr");
      r.setAttribute("part", "row"), r.setAttribute("role", "row"), r.setAttribute("tabindex", "-1"), this.$.footer.appendChild(r);
    }
    for (; this.$.header.children.length > t.length; )
      this.$.header.removeChild(this.$.header.firstElementChild), this.$.footer.removeChild(this.$.footer.firstElementChild);
    Pe(this.$.header, (e, r, i) => {
      this._updateRow(e, t[r], "header", r === t.length - 1);
      const s = nr(e);
      nt(s, "first-header-row-cell", r === 0), nt(s, "last-header-row-cell", r === i.length - 1);
    }), Pe(this.$.footer, (e, r, i) => {
      this._updateRow(e, t[t.length - 1 - r], "footer", r === 0);
      const s = nr(e);
      nt(s, "first-footer-row-cell", r === 0), nt(s, "last-footer-row-cell", r === i.length - 1);
    }), this._updateRow(this.$.sizer, t[t.length - 1]), this._resizeHandler(), this._frozenCellsChanged(), this._updateFirstAndLastColumn(), this._resetKeyboardNavigation(), this._a11yUpdateHeaderRows(), this._a11yUpdateFooterRows(), this.generateCellClassNames(), this.generateCellPartNames(), this.__updateHeaderAndFooter();
  }
  /**
   * @param {!HTMLElement} row
   * @param {GridItem} item
   * @protected
   */
  _updateItem(t, e) {
    t._item = e;
    const r = this.__getRowModel(t);
    this._toggleDetailsCell(t, r.detailsOpened), this._a11yUpdateRowLevel(t, r.level), this._a11yUpdateRowSelected(t, r.selected), this._updateRowStateParts(t, r), this._generateCellClassNames(t, r), this._generateCellPartNames(t, r), this._filterDragAndDrop(t, r), Pe(t, (i) => {
      if (!(i._column && !i._column.isConnected) && i._renderer) {
        const s = i._column || this;
        i._renderer.call(s, i._content, s, r);
      }
    }), this._updateDetailsCellHeight(t), this._a11yUpdateRowExpanded(t, r.expanded);
  }
  /** @private */
  _resizeHandler() {
    this._updateDetailsCellHeights(), this.__updateHorizontalScrollPosition();
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
    const e = this._tooltipController && this._tooltipController.node;
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
    this.__updateHeaderAndFooter(), this.__updateVisibleRows();
  }
  /** @private */
  __updateHeaderAndFooter() {
    (this._columnTree || []).forEach((t) => {
      t.forEach((e) => {
        e._renderHeaderAndFooter && e._renderHeaderAndFooter();
      });
    });
  }
  /** @protected */
  __updateVisibleRows(t, e) {
    this.__virtualizer && this.__virtualizer.update(t, e);
  }
};
/**
 * @license
 * Copyright (c) 2016 - 2024 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
const bp = X`
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
    inset: 0;
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
    inset: 0;
  }

  /* Switch the focusButtonMode wrapping element to "position: static" temporarily
     when measuring real width of the cells in the auto-width columns. */
  [measuring-auto-width] [part~='cell'] > [tabindex] {
    position: static;
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
`;
/**
 * @license
 * Copyright (c) 2016 - 2024 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
fe("vaadin-grid", bp, { moduleId: "vaadin-grid-styles" });
class vp extends gp(fc(ti(ii(Dt)))) {
  static get template() {
    return dr`
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
}
ct(vp);
const $c = X`
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
    --_focus-ring-color: var(--vaadin-focus-ring-color, var(--lumo-primary-color-50pct));
    --_focus-ring-width: var(--vaadin-focus-ring-width, 2px);
    --_selection-color-text: var(--vaadin-selection-color-text, var(--lumo-primary-text-color));
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
    color: var(--_selection-color-text);
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
  }

  :host([focus-ring]:not([disabled])) {
    box-shadow: inset 0 0 0 var(--_focus-ring-width) var(--_focus-ring-color);
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
fe("vaadin-item", $c, { moduleId: "lumo-item" });
const yp = X`
  :host {
    transition: background-color 100ms;
    overflow: hidden;
    --_lumo-item-selected-icon-display: block;
    --_focus-ring-color: var(--vaadin-focus-ring-color, var(--lumo-primary-color-50pct));
    --_focus-ring-width: var(--vaadin-focus-ring-width, 2px);
  }

  :host([focused]:not([disabled])) {
    box-shadow: inset 0 0 0 var(--_focus-ring-width) var(--_focus-ring-color);
  }
`;
fe("vaadin-combo-box-item", [$c, yp], {
  moduleId: "lumo-combo-box-item"
});
/**
 * @license
 * Copyright (c) 2022 - 2024 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
const xp = X`
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
`;
/**
 * @license
 * Copyright (c) 2017 - 2024 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
const Cs = X`
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
fe("", Cs, { moduleId: "lumo-overlay" });
/**
 * @license
 * Copyright (c) 2017 - 2024 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
const Es = X`
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
fe("", Es, { moduleId: "lumo-menu-overlay-core" });
const wp = X`
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
`, Cp = [Cs, Es, wp];
fe("", Cp, { moduleId: "lumo-menu-overlay" });
const Ep = X`
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
`, Ap = X`
  [part~='loader'] {
    position: absolute;
    z-index: 1;
    inset-inline: var(--lumo-space-s);
    top: var(--lumo-space-s);
    margin-inline: auto 0;
  }
`;
fe(
  "vaadin-combo-box-overlay",
  [
    Cs,
    Es,
    Ep,
    xp,
    Ap,
    X`
      :host {
        --_vaadin-combo-box-items-container-border-width: var(--lumo-space-xs);
        --_vaadin-combo-box-items-container-border-style: solid;
      }
    `
  ],
  { moduleId: "lumo-combo-box-overlay" }
);
fe(
  "vaadin-input-container",
  X`
    :host {
      background: var(--_background);
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
      --_input-height: var(--lumo-text-field-size, var(--lumo-size-m));
      /* Default values */
      --_background: var(--vaadin-input-field-background, var(--lumo-contrast-10pct));
      --_hover-highlight: var(--vaadin-input-field-hover-highlight, var(--lumo-contrast-50pct));
      --_input-border-color: var(--vaadin-input-field-border-color, var(--lumo-contrast-50pct));
      --_icon-color: var(--vaadin-input-field-icon-color, var(--lumo-contrast-60pct));
      --_icon-size: var(--vaadin-input-field-icon-size, var(--lumo-icon-size-m));
      --_invalid-background: var(--vaadin-input-field-invalid-background, var(--lumo-error-color-10pct));
      --_invalid-hover-highlight: var(--vaadin-input-field-invalid-hover-highlight, var(--lumo-error-color-50pct));
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
      inset: 0;
      border-radius: inherit;
      pointer-events: none;
      background: var(--_hover-highlight);
      opacity: 0;
      transition: transform 0.15s, opacity 0.2s;
      transform-origin: 100% 0;
    }

    ::slotted(:not([slot$='fix'])) {
      cursor: inherit;
      min-height: var(--vaadin-input-field-height, var(--_input-height));
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
      border: var(--vaadin-input-field-readonly-border, 1px dashed var(--lumo-contrast-30pct));
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
      background: var(--_invalid-background);
    }

    :host([invalid]:not([readonly]))::after {
      background: var(--_invalid-hover-highlight);
    }

    /* Slotted icons */
    ::slotted(vaadin-icon) {
      color: var(--_icon-color);
      width: var(--_icon-size);
      height: var(--_icon-size);
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
 * @license
 * Copyright (c) 2017 - 2024 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
const Nc = X`
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
fe("", Nc, { moduleId: "lumo-field-button" });
/**
 * @license
 * Copyright (c) 2017 - 2024 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
const kp = X`
  :host {
    --_helper-spacing: var(--vaadin-input-field-helper-spacing, 0.4em);
  }

  :host([has-helper]) [part='helper-text']::before {
    content: '';
    display: block;
    height: var(--_helper-spacing);
  }

  [part='helper-text'] {
    display: block;
    color: var(--vaadin-input-field-helper-color, var(--lumo-secondary-text-color));
    font-size: var(--vaadin-input-field-helper-font-size, var(--lumo-font-size-xs));
    line-height: var(--lumo-line-height-xs);
    font-weight: var(--vaadin-input-field-helper-font-weight, 400);
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
    height: var(--_helper-spacing);
  }

  :host([has-helper][theme~='helper-above-field']) [part='label'] {
    order: 0;
    padding-bottom: var(--_helper-spacing);
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
 * Copyright (c) 2017 - 2024 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
const Dc = X`
  [part='label'] {
    align-self: flex-start;
    color: var(--vaadin-input-field-label-color, var(--lumo-secondary-text-color));
    font-weight: var(--vaadin-input-field-label-font-weight, 500);
    font-size: var(--vaadin-input-field-label-font-size, var(--lumo-font-size-s));
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

  :host([focused]:not([readonly])) [part='label'] {
    color: var(--vaadin-input-field-focused-label-color, var(--lumo-primary-text-color));
  }

  :host(:hover:not([readonly]):not([focused])) [part='label'] {
    color: var(--vaadin-input-field-hovered-label-color, var(--lumo-body-text-color));
  }

  /* Touch device adjustment */
  @media (pointer: coarse) {
    :host(:hover:not([readonly]):not([focused])) [part='label'] {
      color: var(--vaadin-input-field-label-color, var(--lumo-secondary-text-color));
    }
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
    font-size: var(--vaadin-input-field-error-font-size, var(--lumo-font-size-xs));
    line-height: var(--lumo-line-height-xs);
    font-weight: var(--vaadin-input-field-error-font-weight, 400);
    color: var(--vaadin-input-field-error-color, var(--lumo-error-text-color));
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
fe("", Dc, { moduleId: "lumo-required-field" });
/**
 * @license
 * Copyright (c) 2017 - 2024 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
const Pp = X`
  :host {
    --lumo-text-field-size: var(--lumo-size-m);
    color: var(--vaadin-input-field-value-color, var(--lumo-body-text-color));
    font-size: var(--vaadin-input-field-value-font-size, var(--lumo-font-size-m));
    font-weight: var(--vaadin-input-field-value-font-weight, 400);
    font-family: var(--lumo-font-family);
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    -webkit-tap-highlight-color: transparent;
    padding: var(--lumo-space-xs) 0;
    --_focus-ring-color: var(--vaadin-focus-ring-color, var(--lumo-primary-color-50pct));
    --_focus-ring-width: var(--vaadin-focus-ring-width, 2px);
    --_input-height: var(--vaadin-input-field-height, var(--lumo-text-field-size));
  }

  :host::before {
    height: var(--_input-height);
    box-sizing: border-box;
    display: inline-flex;
    align-items: center;
  }

  :host([focused]) [part='input-field'] ::slotted(:is(input, textarea)) {
    -webkit-mask-image: none;
    mask-image: none;
  }

  ::slotted(:is(input, textarea):placeholder-shown) {
    color: var(--vaadin-input-field-placeholder-color, var(--lumo-secondary-text-color));
  }

  /* Hover */
  :host(:hover:not([readonly]):not([focused])) [part='input-field']::after {
    opacity: var(--vaadin-input-field-hover-highlight-opacity, 0.1);
  }

  /* Touch device adjustment */
  @media (pointer: coarse) {
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
    box-shadow: 0 0 0 var(--_focus-ring-width) var(--_focus-ring-color);
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
`, Mc = [Dc, Nc, kp, Pp];
fe("", Mc, {
  moduleId: "lumo-input-field-shared-styles"
});
const Sp = X`
  :host {
    outline: none;
  }

  [part='toggle-button']::before {
    content: var(--lumo-icons-dropdown);
  }
`;
fe("vaadin-combo-box", [Mc, Sp], { moduleId: "lumo-combo-box" });
/**
 * @license
 * Copyright (c) 2021 - 2024 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
const Ip = (n) => class extends n {
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
    super.ready(), this.addEventListener("pointerdown", (e) => {
      e.target === this && e.preventDefault();
    }), this.addEventListener("click", (e) => {
      e.target === this && this.shadowRoot.querySelector("slot:not([name])").assignedNodes({ flatten: !0 }).forEach((r) => r.focus && r.focus());
    });
  }
};
/**
 * @license
 * Copyright (c) 2021 - 2024 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
const Tp = X`
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
    --_border-radius: var(--vaadin-input-field-border-radius, 0);
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
`;
/**
 * @license
 * Copyright (c) 2021 - 2024 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
fe("vaadin-input-container", Tp, { moduleId: "vaadin-input-container-styles" });
class Op extends Ip(ti(ri(Dt))) {
  static get is() {
    return "vaadin-input-container";
  }
  static get template() {
    return dr`
      <slot name="prefix"></slot>
      <slot></slot>
      <slot name="suffix"></slot>
    `;
  }
}
ct(Op);
/**
 * @license
 * Copyright (c) 2015 - 2024 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
const zp = (n) => class extends n {
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
    return ["__rendererOrItemChanged(renderer, index, item, selected, focused)", "__updateLabel(label, renderer)"];
  }
  static get observedAttributes() {
    return [...super.observedAttributes, "hidden"];
  }
  attributeChangedCallback(e, r, i) {
    e === "hidden" && i !== null ? this.index = void 0 : super.attributeChangedCallback(e, r, i);
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
  __rendererOrItemChanged(e, r, i) {
    i === void 0 || r === void 0 || (this._oldRenderer !== e && (this.innerHTML = "", delete this._$litPart$), e && (this._oldRenderer = e, this.requestContentUpdate()));
  }
  /** @private */
  __updateLabel(e, r) {
    r || (this.textContent = e);
  }
};
/**
 * @license
 * Copyright (c) 2015 - 2024 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
class Rp extends zp(ti(ri(Dt))) {
  static get template() {
    return dr`
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
ct(Rp);
/**
@license
Copyright (c) 2017 The Polymer Project Authors. All rights reserved.
This code may only be used under the BSD style license found at http://polymer.github.io/LICENSE.txt
The complete set of authors may be found at http://polymer.github.io/AUTHORS.txt
The complete set of contributors may be found at http://polymer.github.io/CONTRIBUTORS.txt
Code distributed by Google as part of the polymer project is also
subject to an additional IP rights grant found at http://polymer.github.io/PATENTS.txt
*/
let Yo = !1, $p = [], Fc = [];
function Np() {
  Yo = !0, requestAnimationFrame(function() {
    Yo = !1, Dp($p), setTimeout(function() {
      Mp(Fc);
    });
  });
}
function Dp(n) {
  for (; n.length; )
    Lc(n.shift());
}
function Mp(n) {
  for (let t = 0, e = n.length; t < e; t++)
    Lc(n.shift());
}
function Lc(n) {
  const t = n[0], e = n[1], r = n[2];
  try {
    e.apply(t, r);
  } catch (i) {
    setTimeout(() => {
      throw i;
    });
  }
}
function Fp(n, t, e) {
  Yo || Np(), Fc.push([n, t, e]);
}
/**
 * @license
 * Copyright (c) 2017 Anton Korzunov
 * SPDX-License-Identifier: MIT
 */
let Wt = /* @__PURE__ */ new WeakMap(), Mi = /* @__PURE__ */ new WeakMap(), Fi = {}, xo = 0;
const sl = (n) => n && n.nodeType === Node.ELEMENT_NODE, wo = (...n) => {
}, Lp = (n, t) => sl(n) ? t.map((e) => {
  if (!sl(e))
    return wo(e, "is not a valid element"), null;
  let r = e;
  for (; r && r !== n; ) {
    if (n.contains(r))
      return e;
    r = r.getRootNode().host;
  }
  return wo(e, "is not contained inside", n), null;
}).filter((e) => !!e) : (wo(n, "is not a valid element"), []), Bp = (n, t, e, r) => {
  const i = Lp(t, Array.isArray(n) ? n : [n]);
  Fi[e] || (Fi[e] = /* @__PURE__ */ new WeakMap());
  const s = Fi[e], l = [], d = /* @__PURE__ */ new Set(), f = new Set(i), m = (v) => {
    if (!v || d.has(v))
      return;
    d.add(v);
    const z = v.assignedSlot;
    z && m(z), m(v.parentNode || v.host);
  };
  i.forEach(m);
  const g = (v) => {
    if (!v || f.has(v))
      return;
    const z = v.shadowRoot;
    (z ? [...v.children, ...z.children] : [...v.children]).forEach((H) => {
      if (!["template", "script", "style"].includes(H.localName))
        if (d.has(H))
          g(H);
        else {
          const ee = H.getAttribute(r), se = ee !== null && ee !== "false", ae = (Wt.get(H) || 0) + 1, re = (s.get(H) || 0) + 1;
          Wt.set(H, ae), s.set(H, re), l.push(H), ae === 1 && se && Mi.set(H, !0), re === 1 && H.setAttribute(e, "true"), se || H.setAttribute(r, "true");
        }
    });
  };
  return g(t), d.clear(), xo += 1, () => {
    l.forEach((v) => {
      const z = Wt.get(v) - 1, B = s.get(v) - 1;
      Wt.set(v, z), s.set(v, B), z || (Mi.has(v) ? Mi.delete(v) : v.removeAttribute(r)), B || v.removeAttribute(e);
    }), xo -= 1, xo || (Wt = /* @__PURE__ */ new WeakMap(), Wt = /* @__PURE__ */ new WeakMap(), Mi = /* @__PURE__ */ new WeakMap(), Fi = {});
  };
}, Vp = (n, t = document.body, e = "data-aria-hidden") => {
  const r = Array.from(Array.isArray(n) ? n : [n]);
  return t && r.push(...Array.from(t.querySelectorAll("[aria-live]"))), Bp(r, t, e, "aria-hidden");
};
/**
 * @license
 * Copyright (c) 2021 - 2024 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
class Hp {
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
    this.__showOthers = Vp(t);
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
 * Copyright (c) 2017 - 2024 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
const Up = (n) => class extends ii(n) {
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
    super(), this.__ariaModalController = new Hp(this), this.__focusTrapController = new dp(this), this.__focusRestorationController = new up();
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
    const e = Uo();
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
    let r = e;
    const i = e.ownerDocument;
    for (; r && r !== i && r !== this; )
      r = r.parentNode || r.host;
    return r === this;
  }
};
/**
 * @license
 * Copyright (c) 2017 - 2024 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
const ji = () => Array.from(document.body.children).filter((n) => n instanceof HTMLElement && n._hasOverlayStackMixin && !n.hasAttribute("closing")).sort((n, t) => n.__zIndex - t.__zIndex || 0), jp = (n) => n === ji().pop(), qp = (n) => class extends n {
  constructor() {
    super(), this._hasOverlayStackMixin = !0;
  }
  /**
   * Returns true if this is the last one in the opened overlays stack.
   *
   * @return {boolean}
   * @protected
   */
  get _last() {
    return jp(this);
  }
  /**
   * Brings the overlay as visually the frontmost one.
   */
  bringToFront() {
    let e = "";
    const r = ji().filter((i) => i !== this).pop();
    r && (e = r.__zIndex + 1), this.style.zIndex = e, this.__zIndex = e || parseFloat(getComputedStyle(this).zIndex);
  }
  /** @protected */
  _enterModalState() {
    document.body.style.pointerEvents !== "none" && (this._previousDocumentPointerEvents = document.body.style.pointerEvents, document.body.style.pointerEvents = "none"), ji().forEach((e) => {
      e !== this && (e.$.overlay.style.pointerEvents = "none");
    });
  }
  /** @protected */
  _exitModalState() {
    this._previousDocumentPointerEvents !== void 0 && (document.body.style.pointerEvents = this._previousDocumentPointerEvents, delete this._previousDocumentPointerEvents);
    const e = ji();
    let r;
    for (; (r = e.pop()) && !(r !== this && (r.$.overlay.style.removeProperty("pointer-events"), !r.modeless)); )
      ;
  }
};
/**
 * @license
 * Copyright (c) 2017 - 2024 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
const Kp = (n) => class extends Up(qp(n)) {
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
      owner: {
        type: Object
      },
      /**
       * Object with properties that is passed to `renderer` function
       */
      model: {
        type: Object
      },
      /**
       * Custom function for rendering the content of the overlay.
       * Receives three arguments:
       *
       * - `root` The root container DOM element. Append your content to it.
       * - `owner` The host element of the renderer function.
       * - `model` The object with the properties related with rendering.
       * @type {OverlayRenderer | null | undefined}
       */
      renderer: {
        type: Object
      },
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
      /**
       * When true the overlay has backdrop on top of content when opened.
       * @type {boolean}
       */
      withBackdrop: {
        type: Boolean,
        value: !1,
        reflectToAttribute: !0
      }
    };
  }
  static get observers() {
    return ["_rendererOrDataChanged(renderer, owner, model, opened)"];
  }
  constructor() {
    super(), this._boundMouseDownListener = this._mouseDownListener.bind(this), this._boundMouseUpListener = this._mouseUpListener.bind(this), this._boundOutsideClickListener = this._outsideClickListener.bind(this), this._boundKeydownListener = this._keydownListener.bind(this), Ko && (this._boundIosResizeListener = () => this._detectIosNavbar());
  }
  /** @protected */
  ready() {
    super.ready(), this.addEventListener("click", () => {
    }), this.$.backdrop.addEventListener("click", () => {
    }), this.addEventListener("mouseup", () => {
      document.activeElement === document.body && this.$.overlay.getAttribute("tabindex") === "0" && this.$.overlay.focus();
    });
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
  /**
   * @param {Event=} sourceEvent
   */
  close(e) {
    const r = new CustomEvent("vaadin-overlay-close", {
      bubbles: !0,
      cancelable: !0,
      detail: { sourceEvent: e }
    });
    this.dispatchEvent(r), r.defaultPrevented || (this.opened = !1);
  }
  /** @private */
  _detectIosNavbar() {
    if (!this.opened)
      return;
    const e = window.innerHeight, i = window.innerWidth > e, s = document.documentElement.clientHeight;
    i && s > e ? this.style.setProperty("--vaadin-overlay-viewport-bottom", `${s - e}px`) : this.style.setProperty("--vaadin-overlay-viewport-bottom", "0");
  }
  /** @private */
  _addGlobalListeners() {
    document.addEventListener("mousedown", this._boundMouseDownListener), document.addEventListener("mouseup", this._boundMouseUpListener), document.documentElement.addEventListener("click", this._boundOutsideClickListener, !0);
  }
  /** @private */
  _removeGlobalListeners() {
    document.removeEventListener("mousedown", this._boundMouseDownListener), document.removeEventListener("mouseup", this._boundMouseUpListener), document.documentElement.removeEventListener("click", this._boundOutsideClickListener, !0);
  }
  /** @private */
  _rendererOrDataChanged(e, r, i, s) {
    const l = this._oldOwner !== r || this._oldModel !== i;
    this._oldModel = i, this._oldOwner = r;
    const d = this._oldRenderer !== e, f = this._oldRenderer !== void 0;
    this._oldRenderer = e;
    const m = this._oldOpened !== s;
    this._oldOpened = s, d && f && (this.innerHTML = "", delete this._$litPart$), s && e && (d || m || l) && this.requestContentUpdate();
  }
  /** @private */
  _modelessChanged(e) {
    e ? (this._removeGlobalListeners(), this._exitModalState()) : this.opened && (this._addGlobalListeners(), this._enterModalState());
  }
  /** @private */
  _openedChanged(e, r) {
    e ? (this._saveFocus(), this._animatedOpening(), Fp(this, () => {
      this._trapFocus();
      const i = new CustomEvent("vaadin-overlay-open", { bubbles: !0 });
      this.dispatchEvent(i);
    }), document.addEventListener("keydown", this._boundKeydownListener), this.modeless || this._addGlobalListeners()) : r && (this._resetFocus(), this._animatedClosing(), document.removeEventListener("keydown", this._boundKeydownListener), this.modeless || this._removeGlobalListeners());
  }
  /** @private */
  _hiddenChanged(e) {
    e && this.hasAttribute("closing") && this._flushAnimation("closing");
  }
  /**
   * @return {boolean}
   * @private
   */
  _shouldAnimate() {
    const e = getComputedStyle(this), r = e.getPropertyValue("animation-name");
    return !(e.getPropertyValue("display") === "none") && r && r !== "none";
  }
  /**
   * @param {string} type
   * @param {Function} callback
   * @private
   */
  _enqueueAnimation(e, r) {
    const i = `__${e}Handler`, s = (l) => {
      l && l.target !== this || (r(), this.removeEventListener("animationend", s), delete this[i]);
    };
    this[i] = s, this.addEventListener("animationend", s);
  }
  /**
   * @param {string} type
   * @protected
   */
  _flushAnimation(e) {
    const r = `__${e}Handler`;
    typeof this[r] == "function" && this[r]();
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
  _mouseDownListener(e) {
    this._mouseDownInside = e.composedPath().indexOf(this.$.overlay) >= 0;
  }
  /** @private */
  _mouseUpListener(e) {
    this._mouseUpInside = e.composedPath().indexOf(this.$.overlay) >= 0;
  }
  /**
   * Whether to close the overlay on outside click or not.
   * Override this method to customize the closing logic.
   *
   * @param {Event} _event
   * @return {boolean}
   * @protected
   */
  _shouldCloseOnOutsideClick(e) {
    return this._last;
  }
  /**
   * Outside click listener used in capture phase to close the overlay before
   * propagating the event to the listener on the element that triggered it.
   * Otherwise, calling `open()` would result in closing and re-opening.
   *
   * @private
   */
  _outsideClickListener(e) {
    if (e.composedPath().includes(this.$.overlay) || this._mouseDownInside || this._mouseUpInside) {
      this._mouseDownInside = !1, this._mouseUpInside = !1;
      return;
    }
    if (!this._shouldCloseOnOutsideClick(e))
      return;
    const r = new CustomEvent("vaadin-overlay-outside-click", {
      bubbles: !0,
      cancelable: !0,
      detail: { sourceEvent: e }
    });
    this.dispatchEvent(r), this.opened && !r.defaultPrevented && this.close(e);
  }
  /**
   * Listener used to close whe overlay on Escape press, if it is the last one.
   * @private
   */
  _keydownListener(e) {
    if (this._last && !(this.modeless && !e.composedPath().includes(this.$.overlay)) && e.key === "Escape") {
      const r = new CustomEvent("vaadin-overlay-escape-press", {
        bubbles: !0,
        cancelable: !0,
        detail: { sourceEvent: e }
      });
      this.dispatchEvent(r), this.opened && !r.defaultPrevented && this.close(e);
    }
  }
};
/**
 * @license
 * Copyright (c) 2017 - 2024 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
const Wp = X`
  :host {
    z-index: 200;
    position: fixed;

    /* Despite of what the names say, <vaadin-overlay> is just a container
          for position/sizing/alignment. The actual overlay is the overlay part. */

    /* Default position constraints: the entire viewport. Note: themes can
          override this to introduce gaps between the overlay and the viewport. */
    inset: 0;
    bottom: var(--vaadin-overlay-viewport-bottom);

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
  :host(:not([opened]):not([closing])),
  :host(:not([opened]):not([closing])) [part='overlay'] {
    display: none !important;
  }

  [part='overlay'] {
    -webkit-overflow-scrolling: touch;
    overflow: auto;
    pointer-events: auto;

    /* Prevent overflowing the host */
    max-width: 100%;
    box-sizing: border-box;

    -webkit-tap-highlight-color: initial; /* reenable tap highlight inside */
  }

  [part='backdrop'] {
    z-index: -1;
    content: '';
    background: rgba(0, 0, 0, 0.5);
    position: fixed;
    inset: 0;
    pointer-events: auto;
  }
`;
/**
 * @license
 * Copyright (c) 2017 - 2024 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
const Co = {
  start: "top",
  end: "bottom"
}, Eo = {
  start: "left",
  end: "right"
}, al = new ResizeObserver((n) => {
  setTimeout(() => {
    n.forEach((t) => {
      t.target.__overlay && t.target.__overlay._updatePosition();
    });
  });
}), Gp = (n) => class extends n {
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
        value: null,
        sync: !0
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
        value: "start",
        sync: !0
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
        value: "top",
        sync: !0
      },
      /**
       * When `positionTarget` is set, this property defines whether the overlay should overlap
       * the target element in the x-axis, or be positioned right next to it.
       *
       * @attr {boolean} no-horizontal-overlap
       */
      noHorizontalOverlap: {
        type: Boolean,
        value: !1,
        sync: !0
      },
      /**
       * When `positionTarget` is set, this property defines whether the overlay should overlap
       * the target element in the y-axis, or be positioned right above/below it.
       *
       * @attr {boolean} no-vertical-overlap
       */
      noVerticalOverlap: {
        type: Boolean,
        value: !1,
        sync: !0
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
        value: 0,
        sync: !0
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
    window.visualViewport.addEventListener("resize", this._updatePosition), window.visualViewport.addEventListener("scroll", this.__onScroll, !0), this.__positionTargetAncestorRootNodes = Yh(this.positionTarget), this.__positionTargetAncestorRootNodes.forEach((e) => {
      e.addEventListener("scroll", this.__onScroll, !0);
    });
  }
  /** @private */
  __removeUpdatePositionEventListeners() {
    window.visualViewport.removeEventListener("resize", this._updatePosition), window.visualViewport.removeEventListener("scroll", this.__onScroll, !0), this.__positionTargetAncestorRootNodes && (this.__positionTargetAncestorRootNodes.forEach((e) => {
      e.removeEventListener("scroll", this.__onScroll, !0);
    }), this.__positionTargetAncestorRootNodes = null);
  }
  /** @private */
  __overlayOpenedChanged(e, r) {
    if (this.__removeUpdatePositionEventListeners(), r && (r.__overlay = null, al.unobserve(r), e && (this.__addUpdatePositionEventListeners(), r.__overlay = this, al.observe(r))), e) {
      const i = getComputedStyle(this);
      this.__margins || (this.__margins = {}, ["top", "bottom", "left", "right"].forEach((s) => {
        this.__margins[s] = parseInt(i[s], 10);
      })), this.setAttribute("dir", i.direction), this._updatePosition(), requestAnimationFrame(() => this._updatePosition());
    }
  }
  __positionSettingsChanged() {
    this._updatePosition();
  }
  /** @private */
  __onScroll(e) {
    e.target instanceof Node && this.contains(e.target) || this._updatePosition();
  }
  _updatePosition() {
    if (!this.positionTarget || !this.opened || !this.__margins)
      return;
    const e = this.positionTarget.getBoundingClientRect();
    if (e.width === 0 && e.height === 0 && this.opened) {
      this.opened = !1;
      return;
    }
    const r = this.__shouldAlignStartVertically(e);
    this.style.justifyContent = r ? "flex-start" : "flex-end";
    const i = this.__isRTL, s = this.__shouldAlignStartHorizontally(e, i), l = !i && s || i && !s;
    this.style.alignItems = l ? "flex-start" : "flex-end";
    const d = this.getBoundingClientRect(), f = this.__calculatePositionInOneDimension(
      e,
      d,
      this.noVerticalOverlap,
      Co,
      this,
      r
    ), m = this.__calculatePositionInOneDimension(
      e,
      d,
      this.noHorizontalOverlap,
      Eo,
      this,
      s
    );
    Object.assign(this.style, f, m), this.toggleAttribute("bottom-aligned", !r), this.toggleAttribute("top-aligned", r), this.toggleAttribute("end-aligned", !l), this.toggleAttribute("start-aligned", l);
  }
  __shouldAlignStartHorizontally(e, r) {
    const i = Math.max(this.__oldContentWidth || 0, this.$.overlay.offsetWidth);
    this.__oldContentWidth = this.$.overlay.offsetWidth;
    const s = Math.min(window.innerWidth, document.documentElement.clientWidth), l = !r && this.horizontalAlign === "start" || r && this.horizontalAlign === "end";
    return this.__shouldAlignStart(
      e,
      i,
      s,
      this.__margins,
      l,
      this.noHorizontalOverlap,
      Eo
    );
  }
  __shouldAlignStartVertically(e) {
    const r = this.requiredVerticalSpace || Math.max(this.__oldContentHeight || 0, this.$.overlay.offsetHeight);
    this.__oldContentHeight = this.$.overlay.offsetHeight;
    const i = Math.min(window.innerHeight, document.documentElement.clientHeight), s = this.verticalAlign === "top";
    return this.__shouldAlignStart(
      e,
      r,
      i,
      this.__margins,
      s,
      this.noVerticalOverlap,
      Co
    );
  }
  // eslint-disable-next-line max-params
  __shouldAlignStart(e, r, i, s, l, d, f) {
    const m = i - e[d ? f.end : f.start] - s[f.end], g = e[d ? f.start : f.end] - s[f.start], v = l ? m : g, B = v > (l ? g : m) || v > r;
    return l === B;
  }
  /**
   * Returns an adjusted value after resizing the browser window,
   * to avoid wrong calculations when e.g. previously set `bottom`
   * CSS property value is larger than the updated viewport height.
   * See https://github.com/vaadin/web-components/issues/4604
   */
  __adjustBottomProperty(e, r, i) {
    let s;
    if (e === r.end) {
      if (r.end === Co.end) {
        const l = Math.min(window.innerHeight, document.documentElement.clientHeight);
        if (i > l && this.__oldViewportHeight) {
          const d = this.__oldViewportHeight - l;
          s = i - d;
        }
        this.__oldViewportHeight = l;
      }
      if (r.end === Eo.end) {
        const l = Math.min(window.innerWidth, document.documentElement.clientWidth);
        if (i > l && this.__oldViewportWidth) {
          const d = this.__oldViewportWidth - l;
          s = i - d;
        }
        this.__oldViewportWidth = l;
      }
    }
    return s;
  }
  /**
   * Returns an object with CSS position properties to set,
   * e.g. { top: "100px" }
   */
  // eslint-disable-next-line max-params
  __calculatePositionInOneDimension(e, r, i, s, l, d) {
    const f = d ? s.start : s.end, m = d ? s.end : s.start, g = parseFloat(l.style[f] || getComputedStyle(l)[f]), v = this.__adjustBottomProperty(f, s, g), z = r[d ? s.start : s.end] - e[i === d ? s.end : s.start], B = v ? `${v}px` : `${g + z * (d ? -1 : 1)}px`;
    return {
      [f]: B,
      [m]: ""
    };
  }
};
/**
 * @license
 * Copyright (c) 2015 - 2024 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
const Yp = (n) => class extends Gp(n) {
  static get observers() {
    return ["_setOverlayWidth(positionTarget, opened)"];
  }
  constructor() {
    super(), this.requiredVerticalSpace = 200;
  }
  /** @protected */
  connectedCallback() {
    super.connectedCallback();
    const e = this._comboBox, r = e && e.getAttribute("dir");
    r && this.setAttribute("dir", r);
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
    const r = e.composedPath();
    return !r.includes(this.positionTarget) && !r.includes(this);
  }
  /** @protected */
  _updateOverlayWidth() {
    const e = this.localName;
    this.style.setProperty(`--_${e}-default-width`, `${this.positionTarget.clientWidth}px`);
    const r = getComputedStyle(this._comboBox).getPropertyValue(`--${e}-width`);
    r === "" ? this.style.removeProperty(`--${e}-width`) : this.style.setProperty(`--${e}-width`, r);
  }
  /** @private */
  _setOverlayWidth(e, r) {
    e && r && (this._updateOverlayWidth(), this._updatePosition());
  }
};
/**
 * @license
 * Copyright (c) 2015 - 2024 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
const Zp = X`
  #overlay {
    width: var(--vaadin-combo-box-overlay-width, var(--_vaadin-combo-box-overlay-default-width, auto));
  }

  [part='content'] {
    display: flex;
    flex-direction: column;
    height: 100%;
  }
`;
fe("vaadin-combo-box-overlay", [Wp, Zp], {
  moduleId: "vaadin-combo-box-overlay-styles"
});
class Xp extends Yp(Kp(ri(ti(Dt)))) {
  static get is() {
    return "vaadin-combo-box-overlay";
  }
  static get template() {
    return dr`
      <div id="backdrop" part="backdrop" hidden></div>
      <div part="overlay" id="overlay">
        <div part="loader"></div>
        <div part="content" id="content"><slot></slot></div>
      </div>
    `;
  }
}
ct(Xp);
/**
 * @license
 * Copyright (c) 2015 - 2024 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
const sr = class {
  toString() {
    return "";
  }
};
/**
 * @license
 * Copyright (c) 2015 - 2024 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
const Jp = (n) => class extends n {
  static get properties() {
    return {
      /**
       * A full set of items to filter the visible options from.
       * Set to an empty array when combo-box is not opened.
       */
      items: {
        type: Array,
        sync: !0,
        observer: "__itemsChanged"
      },
      /**
       * Index of an item that has focus outline and is scrolled into view.
       * The actual focus still remains in the input field.
       */
      focusedIndex: {
        type: Number,
        sync: !0,
        observer: "__focusedIndexChanged"
      },
      /**
       * Set to true while combo-box fetches new page from the data provider.
       */
      loading: {
        type: Boolean,
        sync: !0,
        observer: "__loadingChanged"
      },
      /**
       * Whether the combo-box is currently opened or not. If set to false,
       * calling `scrollIntoView` does not have any effect.
       */
      opened: {
        type: Boolean,
        sync: !0,
        observer: "__openedChanged"
      },
      /**
       * The selected item from the `items` array.
       */
      selectedItem: {
        type: Object,
        sync: !0,
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
        sync: !0,
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
      this._cachedViewportTotalPaddingBottom = [e.paddingBottom, e.borderBottomWidth].map((r) => parseInt(r, 10)).reduce((r, i) => r + i);
    }
    return this._cachedViewportTotalPaddingBottom;
  }
  /** @protected */
  ready() {
    super.ready(), this.setAttribute("role", "listbox"), this.id = `${this.localName}-${yc()}`, this.__hostTagName = this.constructor.is.replace("-scroller", ""), this.addEventListener("click", (e) => e.stopPropagation()), this.__patchWheelOverScrolling();
  }
  /**
   * Updates the virtualizer's size and items.
   */
  requestContentUpdate() {
    this.__virtualizer && (this.items && (this.__virtualizer.size = this.items.length), this.opened && this.__virtualizer.update());
  }
  /**
   * Scrolls an item at given index into view and adjusts `scrollTop`
   * so that the element gets fully visible on Arrow Down key press.
   * @param {number} index
   */
  scrollIntoView(e) {
    if (!this.__virtualizer || !(this.opened && e >= 0))
      return;
    const r = this._visibleItemsCount();
    let i = e;
    e > this.__virtualizer.lastVisibleIndex - 1 ? (this.__virtualizer.scrollToIndex(e), i = e - r + 1) : e > this.__virtualizer.firstVisibleIndex && (i = this.__virtualizer.firstVisibleIndex), this.__virtualizer.scrollToIndex(Math.max(0, i));
    const s = [...this.children].find(
      (m) => !m.hidden && m.index === this.__virtualizer.lastVisibleIndex
    );
    if (!s || e !== s.index)
      return;
    const l = s.getBoundingClientRect(), d = this.getBoundingClientRect(), f = l.bottom - d.bottom + this._viewportTotalPaddingBottom;
    f > 0 && (this.scrollTop += f);
  }
  /**
   * @param {string | object} item
   * @param {string | object} selectedItem
   * @param {string} itemIdPath
   * @protected
   */
  _isItemSelected(e, r, i) {
    return e instanceof sr ? !1 : i && e !== void 0 && r !== void 0 ? Rt(i, e) === Rt(i, r) : e === r;
  }
  /** @private */
  __initVirtualizer() {
    this.__virtualizer = new Cc({
      createElements: this.__createElements.bind(this),
      updateElement: this._updateElement.bind(this),
      elementsContainer: this,
      scrollTarget: this,
      scrollContainer: this.$.selector,
      reorderElements: !0
    });
  }
  /** @private */
  __itemsChanged(e) {
    e && this.__virtualizer && this.requestContentUpdate();
  }
  /** @private */
  __loadingChanged() {
    this.requestContentUpdate();
  }
  /** @private */
  __openedChanged(e) {
    e && (this.__virtualizer || this.__initVirtualizer(), this.requestContentUpdate());
  }
  /** @private */
  __selectedItemChanged() {
    this.requestContentUpdate();
  }
  /** @private */
  __focusedIndexChanged(e, r) {
    e !== r && this.requestContentUpdate(), e >= 0 && !this.loading && this.scrollIntoView(e);
  }
  /** @private */
  __rendererChanged(e, r) {
    (e || r) && this.requestContentUpdate();
  }
  /** @private */
  __createElements(e) {
    return [...Array(e)].map(() => {
      const r = document.createElement(`${this.__hostTagName}-item`);
      return r.addEventListener("click", this.__boundOnItemClick), r.tabIndex = "-1", r.style.width = "100%", r;
    });
  }
  /**
   * @param {HTMLElement} el
   * @param {number} index
   * @protected
   */
  _updateElement(e, r) {
    const i = this.items[r], s = this.focusedIndex, l = this._isItemSelected(i, this.selectedItem, this.itemIdPath);
    e.setProperties({
      item: i,
      index: r,
      label: this.getItemLabel(i),
      selected: l,
      renderer: this.renderer,
      focused: !this.loading && s === r
    }), e.performUpdate && !e.hasUpdated && e.performUpdate(), e.id = `${this.__hostTagName}-item-${r}`, e.setAttribute("role", r !== void 0 ? "option" : !1), e.setAttribute("aria-selected", l.toString()), e.setAttribute("aria-posinset", r + 1), e.setAttribute("aria-setsize", this.items.length), this.theme ? e.setAttribute("theme", this.theme) : e.removeAttribute("theme"), i instanceof sr && this.__requestItemByIndex(r);
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
      const r = this.scrollTop === 0, i = this.scrollHeight - this.scrollTop - this.clientHeight <= 1;
      (r && e.deltaY < 0 || i && e.deltaY > 0) && e.preventDefault();
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
            index: e
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
 * Copyright (c) 2015 - 2024 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
class Qp extends Jp(Dt) {
  static get is() {
    return "vaadin-combo-box-scroller";
  }
  static get template() {
    return dr`
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
ct(Qp);
/**
 * @license
 * Copyright (c) 2021 - 2024 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
const Ao = /* @__PURE__ */ new WeakMap();
function e_(n) {
  return Ao.has(n) || Ao.set(n, /* @__PURE__ */ new Set()), Ao.get(n);
}
function t_(n, t) {
  const e = document.createElement("style");
  e.textContent = n, t === document ? document.head.appendChild(e) : t.insertBefore(e, t.firstChild);
}
const r_ = me(
  (n) => class extends n {
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
      const e = this.getRootNode(), r = e_(e);
      this.slotStyles.forEach((i) => {
        r.has(i) || (t_(i, e), r.add(i));
      });
    }
  }
);
/**
 * @license
 * Copyright (c) 2021 - 2024 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
const As = me(
  (n) => class extends n {
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
          notify: !0,
          sync: !0
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
    _inputElementChanged(e, r) {
      e ? this._addInputListeners(e) : r && this._removeInputListeners(r);
    }
    /**
     * Observer to notify about the change of private property.
     *
     * @private
     */
    _hasInputValueChanged(e, r) {
      (e || r) && this.dispatchEvent(new CustomEvent("has-input-value-changed"));
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
      const r = e.composedPath()[0];
      this.__userInput = e.isTrusted, this.value = r.value, this.__userInput = !1;
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
    _valueChanged(e, r) {
      this._toggleHasValue(this._hasValue), !(e === "" && r === void 0) && (this.__userInput || this._forwardInputValue(e));
    }
    /**
     * Sets the `_hasInputValue` property based on the `input` event.
     *
     * @param {InputEvent} event
     * @protected
     */
    _setHasInputValue(e) {
      const r = e.composedPath()[0];
      this._hasInputValue = r.value.length > 0;
    }
  }
);
/**
 * @license
 * Copyright (c) 2021 - 2024 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
const i_ = (n) => class extends As(xs(n)) {
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
    super.ready(), this.clearElement && (this.clearElement.addEventListener("mousedown", (e) => this._onClearButtonMouseDown(e)), this.clearElement.addEventListener("click", (e) => this._onClearButtonClick(e)));
  }
  /**
   * @param {Event} event
   * @protected
   */
  _onClearButtonClick(e) {
    e.preventDefault(), this._onClearAction();
  }
  /**
   * @param {MouseEvent} event
   * @protected
   */
  _onClearButtonMouseDown(e) {
    e.preventDefault(), Zr || this.inputElement.focus();
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
    this._inputElementValue = "", this.inputElement.dispatchEvent(new Event("input", { bubbles: !0, composed: !0 })), this.inputElement.dispatchEvent(new Event("change", { bubbles: !0 }));
  }
};
/**
 * @license
 * Copyright (c) 2022 - 2024 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
class ks extends ps {
  constructor(t, e, r, i = {}) {
    super(t, e, r, { ...i, useUniqueId: !0 });
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
      e.forEach((r) => {
        const i = r.target, s = i === this.node;
        r.type === "attributes" ? s && this.__updateNodeId(i) : (s || i.parentElement === this.node) && this.__notifyChange(this.node);
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
    t.nodeType === Node.ELEMENT_NODE && (!this.multiple || e) && !t.id && (t.id = this.defaultId);
  }
}
/**
 * @license
 * Copyright (c) 2021 - 2024 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
class n_ extends ks {
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
    const { errorMessage: e, invalid: r } = this, i = !!(r && e && e.trim() !== "");
    t && (t.textContent = i ? e : "", t.hidden = !i, i ? t.setAttribute("role", "alert") : t.removeAttribute("role")), super.updateDefaultNode(t);
  }
}
/**
 * @license
 * Copyright (c) 2021 - 2024 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
class o_ extends ks {
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
 * Copyright (c) 2021 - 2024 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
class s_ extends ks {
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
 * Copyright (c) 2021 - 2024 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
const a_ = me(
  (n) => class extends ii(n) {
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
      super(), this._labelController = new s_(this), this._labelController.addEventListener("slot-content-changed", (e) => {
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
 * Copyright (c) 2021 - 2024 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
const Ps = me(
  (n) => class extends n {
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
 * Copyright (c) 2021 - 2024 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
const l_ = (n) => class extends Ps(a_(ii(n))) {
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
    super(), this._fieldAriaController = new cp(this), this._helperController = new o_(this), this._errorController = new n_(this), this._errorController.addEventListener("slot-content-changed", (e) => {
      this.toggleAttribute("has-error-message", e.detail.hasContent);
    }), this._labelController.addEventListener("slot-content-changed", (e) => {
      const { hasContent: r, node: i } = e.detail;
      this.__labelChanged(r, i);
    }), this._helperController.addEventListener("slot-content-changed", (e) => {
      const { hasContent: r, node: i } = e.detail;
      this.toggleAttribute("has-helper", r), this.__helperChanged(r, i);
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
  __helperChanged(e, r) {
    e ? this._fieldAriaController.setHelperId(r.id) : this._fieldAriaController.setHelperId(null);
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
  __labelChanged(e, r) {
    e ? this._fieldAriaController.setLabelId(r.id) : this._fieldAriaController.setLabelId(null);
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
        const r = this._errorNode;
        this._fieldAriaController.setErrorId(r && r.id);
      } else
        this._fieldAriaController.setErrorId(null);
    });
  }
};
/**
 * @license
 * Copyright (c) 2021 - 2024 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
const c_ = me(
  (n) => class extends n {
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
      this.constructor.delegateAttrs.forEach((r, i) => {
        this._delegateAttribute(r, e[i]);
      });
    }
    /** @protected */
    _delegatePropsChanged(...e) {
      this.constructor.delegateProps.forEach((r, i) => {
        this._delegateProperty(r, e[i]);
      });
    }
    /** @protected */
    _delegateAttribute(e, r) {
      this.stateTarget && (e === "invalid" && this._delegateAttribute("aria-invalid", r ? "true" : !1), typeof r == "boolean" ? this.stateTarget.toggleAttribute(e, r) : r ? this.stateTarget.setAttribute(e, r) : this.stateTarget.removeAttribute(e));
    }
    /** @protected */
    _delegateProperty(e, r) {
      this.stateTarget && (this.stateTarget[e] = r);
    }
  }
);
/**
 * @license
 * Copyright (c) 2021 - 2024 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
const Bc = me(
  (n) => class extends c_(Ps(As(n))) {
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
      return e.some((r) => this.__isValidConstraint(r));
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
    _constraintsChanged(e, ...r) {
      if (!e)
        return;
      const i = this._hasValidConstraints(r), s = this.__previousHasConstraints && !i;
      (this._hasValue || this.invalid) && i ? this.validate() : s && this._setInvalid(!1), this.__previousHasConstraints = i;
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
 * Copyright (c) 2021 - 2024 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
const d_ = (n) => class extends r_(
  sp(Bc(l_(i_(xs(n)))))
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
    super._onKeyDown(e), this.allowedCharPattern && !this.__shouldAcceptKey(e) && e.target === this.inputElement && (e.preventDefault(), this._markInputPrevented());
  }
  /** @protected */
  _markInputPrevented() {
    this.setAttribute("input-prevented", ""), this._preventInputDebouncer = ie.debounce(this._preventInputDebouncer, Ke.after(200), () => {
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
      const r = e.clipboardData.getData("text");
      this.__allowedTextRegExp.test(r) || (e.preventDefault(), this._markInputPrevented());
    }
  }
  /** @private */
  _onDrop(e) {
    if (this.allowedCharPattern) {
      const r = e.dataTransfer.getData("text");
      this.__allowedTextRegExp.test(r) || (e.preventDefault(), this._markInputPrevented());
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
 * Copyright (c) 2021 - 2024 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
class u_ extends ps {
  constructor(t, e) {
    super(t, "input", "input", {
      initializer: (r, i) => {
        i.value && (r.value = i.value), i.type && r.setAttribute("type", i.type), r.id = this.defaultId, typeof e == "function" && e(r);
      },
      useUniqueId: !0
    });
  }
}
/**
 * @license
 * Copyright (c) 2021 - 2024 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
class h_ {
  constructor(t, e) {
    this.input = t, this.__preventDuplicateLabelClick = this.__preventDuplicateLabelClick.bind(this), e.addEventListener("slot-content-changed", (r) => {
      this.__initLabel(r.detail.node);
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
 * Copyright (c) 2021 - 2024 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
const f_ = (n) => class extends Bc(n) {
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
 * Copyright (c) 2021 - 2024 Vaadin Ltd..
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
const p_ = X`
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
 * Copyright (c) 2021 - 2024 Vaadin Ltd..
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
const __ = X`
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
 * Copyright (c) 2021 - 2024 Vaadin Ltd..
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
const m_ = X`
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
 * Copyright (c) 2021 - 2024 Vaadin Ltd..
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
const g_ = [__, m_, p_];
/**
 * @license
 * Copyright (c) 2015 - 2024 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
const b_ = (n) => class extends n {
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
        observer: "_pageSizeChanged",
        sync: !0
      },
      /**
       * Total number of items.
       * @type {number | undefined}
       */
      size: {
        type: Number,
        observer: "_sizeChanged",
        sync: !0
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
        observer: "_dataProviderChanged",
        sync: !0
      },
      /** @private */
      _pendingRequests: {
        value: () => ({})
      },
      /** @private */
      __placeHolder: {
        value: new sr()
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
      if (!this._shouldFetchData())
        return;
      const r = e.detail.index;
      if (r !== void 0) {
        const i = this._getPageForIndex(r);
        this._shouldLoadPage(i) && this._loadPage(i);
      }
    });
  }
  /** @private */
  _dataProviderFilterChanged(e) {
    if (this.__previousDataProviderFilter === void 0 && e === "") {
      this.__previousDataProviderFilter = e;
      return;
    }
    this.__previousDataProviderFilter !== e && (this.__previousDataProviderFilter = e, this.__keepOverlayOpened = !0, this._pendingRequests = {}, this.size = void 0, this.clearCache(), this.__keepOverlayOpened = !1);
  }
  /** @protected */
  _shouldFetchData() {
    return this.dataProvider ? this.opened || this.filter && this.filter.length : !1;
  }
  /** @private */
  _ensureFirstPage(e) {
    this._shouldFetchData() && e && this._shouldLoadPage(0) && this._loadPage(0);
  }
  /** @private */
  _shouldLoadPage(e) {
    if (this._forceNextRequest)
      return this._forceNextRequest = !1, !0;
    const r = this.filteredItems[e * this.pageSize];
    return r !== void 0 ? r instanceof sr : this.size === void 0;
  }
  /** @private */
  _loadPage(e) {
    if (this._pendingRequests[e] || !this.dataProvider)
      return;
    const r = {
      page: e,
      pageSize: this.pageSize,
      filter: this.filter
    }, i = (s, l) => {
      if (this._pendingRequests[e] !== i)
        return;
      const d = this.filteredItems ? [...this.filteredItems] : [];
      d.splice(r.page * r.pageSize, s.length, ...s), this.filteredItems = d, !this.opened && !this._isInputFocused() && this._commitValue(), l !== void 0 && (this.size = l), delete this._pendingRequests[e], Object.keys(this._pendingRequests).length === 0 && (this.loading = !1);
    };
    this._pendingRequests[e] = i, this.loading = !0, this.dataProvider(r, i);
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
    for (let r = 0; r < (this.size || 0); r++)
      e.push(this.__placeHolder);
    this.filteredItems = e, this._shouldFetchData() ? (this._forceNextRequest = !1, this._loadPage(0)) : this._forceNextRequest = !0;
  }
  /** @private */
  _sizeChanged(e = 0) {
    const r = (this.filteredItems || []).slice(0, e);
    for (let i = 0; i < e; i++)
      r[i] = r[i] !== void 0 ? r[i] : this.__placeHolder;
    this.filteredItems = r, this._flushPendingRequests(e);
  }
  /** @private */
  _pageSizeChanged(e, r) {
    if (Math.floor(e) !== e || e < 1)
      throw this.pageSize = r, new Error("`pageSize` value must be an integer > 0");
    this.clearCache();
  }
  /** @private */
  _dataProviderChanged(e, r) {
    this._ensureItemsOrDataProvider(() => {
      this.dataProvider = r;
    }), this.clearCache();
  }
  /** @private */
  _ensureItemsOrDataProvider(e) {
    if (this.items !== void 0 && this.dataProvider !== void 0)
      throw e(), new Error("Using `items` and `dataProvider` together is not supported");
    this.dataProvider && !this.filteredItems && (this.filteredItems = []);
  }
  /** @private */
  _warnDataProviderValue(e, r) {
    if (e && r !== "" && (this.selectedItem === void 0 || this.selectedItem === null)) {
      const i = this.__getItemIndexByValue(this.filteredItems, r);
      i < 0 || this._getItemLabel(this.filteredItems[i]);
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
      const r = Math.ceil(e / this.pageSize);
      Object.entries(this._pendingRequests).forEach(([i, s]) => {
        parseInt(i) >= r && s([], e);
      });
    }
  }
};
/**
 * @license
 * Copyright (c) 2023 - 2024 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
const v_ = (n) => class extends n {
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
  __updateOverlayClassNames(e, r) {
    if (!r || e === void 0)
      return;
    const { classList: i } = r;
    if (this.__initialClasses || (this.__initialClasses = new Set(i)), Array.isArray(this.__previousClasses)) {
      const l = this.__previousClasses.filter((d) => !this.__initialClasses.has(d));
      l.length > 0 && i.remove(...l);
    }
    const s = typeof e == "string" ? e.split(" ").filter(Boolean) : [];
    s.length > 0 && i.add(...s), this.__previousClasses = s;
  }
};
/**
 * @license
 * Copyright (c) 2021 - 2024 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
class y_ {
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
 * Copyright (c) 2015 - 2024 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
function ll(n) {
  return n != null;
}
function cl(n, t) {
  return n.findIndex((e) => e instanceof sr ? !1 : t(e));
}
const x_ = (n) => class extends v_(
  ii(Ps(Oc(xs(As(gc(n))))))
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
        sync: !0,
        observer: "_openedChanged"
      },
      /**
       * Set true to prevent the overlay from opening automatically.
       * @attr {boolean} auto-open-disabled
       */
      autoOpenDisabled: {
        type: Boolean,
        sync: !0
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
      renderer: {
        type: Object,
        sync: !0
      },
      /**
       * A full set of items to filter the visible options from.
       * The items can be of either `String` or `Object` type.
       * @type {!Array<!ComboBoxItem | string> | undefined}
       */
      items: {
        type: Array,
        sync: !0,
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
        observer: "_filteredItemsChanged",
        sync: !0
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
        reflectToAttribute: !0,
        sync: !0
      },
      /**
       * @type {number}
       * @protected
       */
      _focusedIndex: {
        type: Number,
        observer: "_focusedIndexChanged",
        value: -1,
        sync: !0
      },
      /**
       * Filtering string the user has typed into the input field.
       * @type {string}
       */
      filter: {
        type: String,
        value: "",
        notify: !0,
        sync: !0
      },
      /**
       * The selected item from the `items` array.
       * @type {ComboBoxItem | string | undefined}
       */
      selectedItem: {
        type: Object,
        notify: !0,
        sync: !0
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
        observer: "_itemLabelPathChanged",
        sync: !0
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
        value: "value",
        sync: !0
      },
      /**
       * Path for the id of the item. If `items` is an array of objects,
       * the `itemIdPath` is used to compare and identify the same item
       * in `selectedItem` and `filteredItems` (items given by the
       * `dataProvider` callback).
       * @attr {string} item-id-path
       */
      itemIdPath: {
        type: String,
        sync: !0
      },
      /**
       * @type {!HTMLElement | undefined}
       * @protected
       */
      _toggleElement: {
        type: Object,
        observer: "_toggleElementChanged"
      },
      /**
       * Set of items to be rendered in the dropdown.
       * @protected
       */
      _dropdownItems: {
        type: Array,
        sync: !0
      },
      /** @private */
      _closeOnBlurIsPrevented: Boolean,
      /** @private */
      _scroller: {
        type: Object,
        sync: !0
      },
      /** @private */
      _overlayOpened: {
        type: Boolean,
        sync: !0,
        observer: "_overlayOpenedChanged"
      },
      /** @private */
      __keepOverlayOpened: {
        type: Boolean,
        sync: !0
      }
    };
  }
  static get observers() {
    return [
      "_selectedItemChanged(selectedItem, itemValuePath, itemLabelPath)",
      "_openedOrItemsChanged(opened, _dropdownItems, loading, __keepOverlayOpened)",
      "_updateScroller(_scroller, _dropdownItems, opened, loading, selectedItem, itemIdPath, _focusedIndex, renderer, _theme)"
    ];
  }
  constructor() {
    super(), this._boundOverlaySelectedItemChanged = this._overlaySelectedItemChanged.bind(this), this._boundOnClearButtonMouseDown = this.__onClearButtonMouseDown.bind(this), this._boundOnClick = this._onClick.bind(this), this._boundOnOverlayTouchAction = this._onOverlayTouchAction.bind(this), this._boundOnTouchend = this._onTouchend.bind(this);
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
    const r = this._nativeInput;
    r && (r.autocomplete = "off", r.autocapitalize = "off", r.setAttribute("role", "combobox"), r.setAttribute("aria-autocomplete", "list"), r.setAttribute("aria-expanded", !!this.opened), r.setAttribute("spellcheck", "false"), r.setAttribute("autocorrect", "off"), this._revertInputValueToValue(), this.clearElement && this.clearElement.addEventListener("mousedown", this._boundOnClearButtonMouseDown));
  }
  /** @protected */
  ready() {
    super.ready(), this._initOverlay(), this._initScroller(), this._lastCommittedValue = this.value, this.addEventListener("click", this._boundOnClick), this.addEventListener("touchend", this._boundOnTouchend);
    const e = () => {
      requestAnimationFrame(() => {
        this._overlayElement.bringToFront();
      });
    };
    this.addEventListener("mousedown", e), this.addEventListener("touchstart", e), cs(this), this.addController(new y_(this));
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
  _propertiesChanged(e, r, i) {
    super._propertiesChanged(e, r, i), r.filter !== void 0 && this._filterChanged(r.filter);
  }
  /**
   * Override LitElement lifecycle callback to handle filter property change.
   * @param {Object} props
   */
  updated(e) {
    super.updated(e), e.has("filter") && this._filterChanged(this.filter);
  }
  /** @private */
  _initOverlay() {
    const e = this.$.overlay;
    e._comboBox = this, e.addEventListener("touchend", this._boundOnOverlayTouchAction), e.addEventListener("touchmove", this._boundOnOverlayTouchAction), e.addEventListener("mousedown", (r) => r.preventDefault()), e.addEventListener("opened-changed", (r) => {
      this._overlayOpened = r.detail.value;
    }), this._overlayElement = e;
  }
  /**
   * Create and initialize the scroller element.
   * Override to provide custom host reference.
   *
   * @protected
   */
  _initScroller(e) {
    const r = document.createElement(`${this._tagNamePrefix}-scroller`);
    r.owner = e || this, r.getItemLabel = this._getItemLabel.bind(this), r.addEventListener("selection-changed", this._boundOverlaySelectedItemChanged);
    const i = this._overlayElement;
    i.renderer = (s) => {
      s.innerHTML || s.appendChild(r);
    }, i.requestContentUpdate(), this._scroller = r;
  }
  /** @private */
  // eslint-disable-next-line max-params
  _updateScroller(e, r, i, s, l, d, f, m, g) {
    if (e && (i && (e.style.maxHeight = getComputedStyle(this).getPropertyValue(`--${this._tagNamePrefix}-overlay-max-height`) || "65vh"), e.setProperties({
      items: i ? r : [],
      opened: i,
      loading: s,
      selectedItem: l,
      itemIdPath: d,
      focusedIndex: f,
      renderer: m,
      theme: g
    }), e.performUpdate && !e.hasUpdated))
      try {
        e.performUpdate();
      } catch {
      }
  }
  /** @private */
  _openedOrItemsChanged(e, r, i, s) {
    this._overlayOpened = e && (s || i || !!(r && r.length));
  }
  /** @private */
  _overlayOpenedChanged(e, r) {
    e ? (this.dispatchEvent(new CustomEvent("vaadin-combo-box-dropdown-opened", { bubbles: !0, composed: !0 })), this._onOpened()) : r && this._dropdownItems && this._dropdownItems.length && (this.close(), this.dispatchEvent(new CustomEvent("vaadin-combo-box-dropdown-closed", { bubbles: !0, composed: !0 })));
  }
  /** @private */
  _focusedIndexChanged(e, r) {
    r !== void 0 && this._updateActiveDescendant(e);
  }
  /** @protected */
  _isInputFocused() {
    return this.inputElement && _c(this.inputElement);
  }
  /** @private */
  _updateActiveDescendant(e) {
    const r = this._nativeInput;
    if (!r)
      return;
    const i = this._getItemElements().find((s) => s.index === e);
    i ? r.setAttribute("aria-activedescendant", i.id) : r.removeAttribute("aria-activedescendant");
  }
  /** @private */
  _openedChanged(e, r) {
    if (r === void 0)
      return;
    e ? (!this._isInputFocused() && !Zr && this.inputElement && this.inputElement.focus(), this._overlayElement.restoreFocusOnClose = !0) : this._onClosed();
    const i = this._nativeInput;
    i && (i.setAttribute("aria-expanded", !!e), e ? i.setAttribute("aria-controls", this._scroller.id) : i.removeAttribute("aria-controls"));
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
    let r = e && this.itemLabelPath ? Rt(this.itemLabelPath, e) : void 0;
    return r == null && (r = e ? e.toString() : ""), r;
  }
  /** @private */
  _getItemValue(e) {
    let r = e && this.itemValuePath ? Rt(this.itemValuePath, e) : void 0;
    return r === void 0 && (r = e ? e.toString() : ""), r;
  }
  /** @private */
  _onArrowDown() {
    if (this.opened) {
      const e = this._dropdownItems;
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
        const e = this._dropdownItems;
        e && (this._focusedIndex = e.length - 1);
      }
      this._prefillFocusedItemLabel();
    } else
      this.open();
  }
  /** @private */
  _prefillFocusedItemLabel() {
    if (this._focusedIndex > -1) {
      const e = this._dropdownItems[this._focusedIndex];
      this._inputElementValue = this._getItemLabel(e), this._markAllSelectionRange();
    }
  }
  /** @private */
  _setSelectionRange(e, r) {
    this._isInputFocused() && this.inputElement.setSelectionRange && this.inputElement.setSelectionRange(e, r);
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
    if (!this._hasValidInputValue()) {
      e.preventDefault(), e.stopPropagation();
      return;
    }
    this.opened && (e.preventDefault(), e.stopPropagation()), this._closeOrCommit();
  }
  /**
   * @protected
   */
  _hasValidInputValue() {
    const e = this._focusedIndex < 0 && this._inputElementValue !== "" && this._getItemLabel(this.selectedItem) !== this._inputElementValue;
    return this.allowCustomValue || !e;
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
    e && (e.addEventListener("mousedown", (r) => r.preventDefault()), e.addEventListener("click", () => {
      Zr && !this._isInputFocused() && document.activeElement.blur();
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
   * Clears the current filter. Should be used instead of setting the property
   * directly in order to allow overriding this in multi-select combo box.
   * @protected
   */
  _clearFilter() {
    this.filter = "";
  }
  /**
   * Reverts back to original value.
   */
  cancel() {
    this._revertInputValueToValue(), this._lastCommittedValue = this.value, this._closeOrCommit();
  }
  /** @private */
  _onOpened() {
    this._lastCommittedValue = this.value;
  }
  /** @private */
  _onClosed() {
    (!this.loading || this.allowCustomValue) && this._commitValue();
  }
  /** @private */
  _commitValue() {
    if (this._focusedIndex > -1) {
      const e = this._dropdownItems[this._focusedIndex];
      this.selectedItem !== e && (this.selectedItem = e), this._inputElementValue = this._getItemLabel(this.selectedItem), this._focusedIndex = -1;
    } else if (this._inputElementValue === "" || this._inputElementValue === void 0)
      this.selectedItem = null, this.allowCustomValue && (this.value = "");
    else {
      const e = [this.selectedItem, ...this._dropdownItems || []], r = e[this.__getItemIndexByLabel(e, this._inputElementValue)];
      if (this.allowCustomValue && // To prevent a repetitive input value being saved after pressing ESC and Tab.
      !r) {
        const i = this._inputElementValue;
        this._lastCustomValue = i;
        const s = new CustomEvent("custom-value-set", {
          detail: i,
          composed: !0,
          cancelable: !0,
          bubbles: !0
        });
        this.dispatchEvent(s), s.defaultPrevented || (this.value = i);
      } else !this.allowCustomValue && !this.opened && r ? this.value = this._getItemValue(r) : this._revertInputValueToValue();
    }
    this._detectAndDispatchChange(), this._clearSelectionRange(), this._clearFilter();
  }
  /**
   * Override an event listener from `InputMixin`.
   * @param {!Event} event
   * @protected
   * @override
   */
  _onInput(e) {
    const r = this._inputElementValue, i = {};
    this.filter === r ? this._filterChanged(this.filter) : i.filter = r, !this.opened && !this._isClearButton(e) && !this.autoOpenDisabled && (i.opened = !0), this.setProperties(i);
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
      const r = this._getItemValue(e);
      if (this.value !== r && (this.value = r, this.value !== r))
        return;
      this._toggleHasValue(!0), this._inputElementValue = this._getItemLabel(e);
    }
  }
  /**
   * Override an observer from `InputMixin`.
   * @protected
   * @override
   */
  _valueChanged(e, r) {
    e === "" && r === void 0 || (ll(e) ? (this._getItemValue(this.selectedItem) !== e && this._selectItemForValue(e), !this.selectedItem && this.allowCustomValue && (this._inputElementValue = e), this._toggleHasValue(this._hasValue)) : this.selectedItem = null, this._clearFilter(), this._lastCommittedValue = void 0);
  }
  /** @private */
  _detectAndDispatchChange() {
    document.hasFocus() && this.validate(), this.value !== this._lastCommittedValue && (this.dispatchEvent(new CustomEvent("change", { bubbles: !0 })), this._lastCommittedValue = this.value);
  }
  /** @private */
  _itemsChanged(e, r) {
    this._ensureItemsOrDataProvider(() => {
      this.items = r;
    }), e ? this.filteredItems = e.slice(0) : r && (this.filteredItems = null);
  }
  /** @private */
  _filteredItemsChanged(e) {
    this._setDropdownItems(e);
  }
  /** @private */
  _filterItems(e, r) {
    return e && e.filter((s) => (r = r ? r.toString().toLowerCase() : "", this._getItemLabel(s).toString().toLowerCase().indexOf(r) > -1));
  }
  /** @private */
  _selectItemForValue(e) {
    const r = this.__getItemIndexByValue(this.filteredItems, e), i = this.selectedItem;
    r >= 0 ? this.selectedItem = this.filteredItems[r] : this.dataProvider && this.selectedItem === void 0 ? this.selectedItem = void 0 : this.selectedItem = null, this.selectedItem === null && i === null && this._selectedItemChanged(this.selectedItem);
  }
  /**
   * Provide items to be rendered in the dropdown.
   * Override this method to show custom items.
   *
   * @protected
   */
  _setDropdownItems(e) {
    const r = this._dropdownItems;
    this._dropdownItems = e;
    const i = r ? r[this._focusedIndex] : null, s = this.__getItemIndexByValue(e, this.value);
    (this.selectedItem === null || this.selectedItem === void 0) && s >= 0 && (this.selectedItem = e[s]);
    const l = this.__getItemIndexByValue(e, this._getItemValue(i));
    l > -1 ? this._focusedIndex = l : this._focusedIndex = this.__getItemIndexByLabel(e, this.filter);
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
  __getItemIndexByValue(e, r) {
    return !e || !ll(r) ? -1 : cl(e, (i) => this._getItemValue(i) === r);
  }
  /**
   * Returns the first item that matches the provided label.
   * Labels are matched against each other case insensitively.
   *
   * @private
   */
  __getItemIndexByLabel(e, r) {
    return !e || !r ? -1 : cl(e, (i) => this._getItemLabel(i).toString().toLowerCase() === r.toString().toLowerCase());
  }
  /** @private */
  _overlaySelectedItemChanged(e) {
    e.stopPropagation(), !(e.detail.item instanceof sr) && this.opened && (this._focusedIndex = this.filteredItems.indexOf(e.detail.item), this.close());
  }
  /**
   * Override method inherited from `FocusMixin`
   * to close the overlay on blur and commit the value.
   *
   * @param {boolean} focused
   * @protected
   * @override
   */
  _setFocused(e) {
    if (super._setFocused(e), !e && !this.readonly && !this._closeOnBlurIsPrevented) {
      if (!this.opened && this.allowCustomValue && this._inputElementValue === this._lastCustomValue) {
        delete this._lastCustomValue;
        return;
      }
      if (fs()) {
        this._closeOrCommit();
        return;
      }
      this.opened ? this._overlayOpened || this.close() : this._commitValue();
    }
  }
  /**
   * Override method inherited from `FocusMixin` to not remove focused
   * state when focus moves to the overlay.
   *
   * @param {FocusEvent} event
   * @return {boolean}
   * @protected
   * @override
   */
  _shouldRemoveFocus(e) {
    return e.relatedTarget && e.relatedTarget.localName === `${this._tagNamePrefix}-item` ? !1 : e.relatedTarget === this._overlayElement ? (e.composedPath()[0].focus(), !1) : !0;
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
 * Copyright (c) 2015 - 2024 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
fe("vaadin-combo-box", g_, { moduleId: "vaadin-combo-box-styles" });
class w_ extends b_(
  x_(f_(d_(ti(fc(Dt)))))
) {
  static get is() {
    return "vaadin-combo-box";
  }
  static get template() {
    return dr`
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
      new u_(this, (t) => {
        this._setInputElement(t), this._setFocusElement(t), this.stateTarget = t, this.ariaTarget = t;
      })
    ), this.addController(new h_(this.inputElement, this._labelController)), this._tooltipController = new xc(this), this.addController(this._tooltipController), this._tooltipController.setPosition("top"), this._tooltipController.setAriaTarget(this.inputElement), this._tooltipController.setShouldShow((t) => !t.opened), this._positionTarget = this.shadowRoot.querySelector('[part="input-field"]'), this._toggleElement = this.$.toggleButton;
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
ct(w_);
const C_ = '*{padding:0;margin:0;border:0px;-webkit-user-select:none;user-select:none}p,div{-webkit-user-select:text;user-select:text}select{-webkit-user-select:none;user-select:none}.col-bg-body-lighter{background-color:var(--col-bg-body-lighter)}.col-bg-body{background-color:var(--col-bg-body)}.col-bg-body-darker{background-color:var(--col-bg-body-darker)}.col-bg-1-lighter{background-color:var(--col-bg-1-lighter)}.col-bg-1{background-color:var(--col-bg-1)}.col-bg-1-darker{background-color:var(--col-bg-1-darker)}.col-bg-1-input{background-color:var(--col-bg-1-input)}.col-primary-bg-1{background-color:var(--col-primary-bg-1)}.col-accent-bg-1{background-color:var(--col-accent-bg-1)}.col-success-bg-1{background-color:var(--col-success-bg-1)}.col-warning-bg-1{background-color:var(--col-warning-bg-1)}.col-error-bg-1{background-color:var(--col-error-bg-1)}.col-bg-2-lighter{background-color:var(--col-bg-2-lighter)}.col-bg-2{background-color:var(--col-bg-2)}.col-bg-2-darker{background-color:var(--col-bg-2-darker)}.col-bg-2-button{background-color:var(--col-bg-2-button)}.col-bg-2-input{background-color:var(--col-bg-2-input)}.col-primary-bg-2{background-color:var(--col-primary-bg-2)}.col-accent-bg-2{background-color:var(--col-accent-bg-2)}.col-success-bg-2{background-color:var(--col-success-bg-2)}.col-warning-bg-2{background-color:var(--col-warning-bg-2)}.col-error-bg-2{background-color:var(--col-error-bg-2)}.col-bg-3-lighter{background-color:var(--col-bg-3-lighter)}.col-bg-3{background-color:var(--col-bg-3)}.col-bg-3-darker{background-color:var(--col-bg-3-darker)}.col-bg-3-button{background-color:var(--col-bg-3-button)}.col-bg-3-input{background-color:var(--col-bg-3-input)}.col-primary-bg-3{background-color:var(--col-primary-bg-3)}.col-accent-bg-3{background-color:var(--col-accent-bg-3)}.col-success-bg-3{background-color:var(--col-success-bg-3)}.col-warning-bg-3{background-color:var(--col-warning-bg-3)}.col-error-bg-3{background-color:var(--col-error-bg-3)}.col-bg-ack-lighter{background-color:var(--col-bg-ack-lighter)}.col-bg-ack{background-color:var(--col-bg-ack)}.col-bg-ack-darker{background-color:var(--col-bg-ack-darker)}.col-primary-bg-ack{background-color:var(--col-primary-bg-ack)}.col-accent-bg-ack{background-color:var(--col-accent-bg-ack)}.col-bg-att-lighter{background-color:var(--col-bg-att-lighter)}.col-bg-att{background-color:var(--col-bg-att)}.col-bg-att-darker{background-color:var(--col-bg-att-darker)}.col-primary-bg-att{background-color:var(--col-primary-bg-att)}.col-accent-bg-att{background-color:var(--col-accent-bg-att)}.col-bg-alert-lighter{background-color:var(--col-bg-alert-lighter)}.col-bg-alert{background-color:var(--col-bg-alert)}.col-bg-alert-darker{background-color:var(--col-bg-alert-darker)}.col-primary-bg-alert{background-color:var(--col-primary-bg-alert)}.col-accent-bg-alert{background-color:var(--col-accent-bg-alert)}.col-bg-btn-lighter{background-color:var(--col-bg-btn-lighter)}.col-bg-btn{background-color:var(--col-bg-btn)}.col-bg-btn-darker{background-color:var(--col-bg-btn-darker)}.col-primary-bg-btn{background-color:var(--col-primary-bg-btn)}.col-accent-bg-btn{background-color:var(--col-accent-bg-btn)}.pattern-diagonal-stripes-sm{background:repeating-linear-gradient(45deg,transparent,transparent 10px,currentColor 10px,currentColor 20px)}.pattern-dots-lg{background-image:radial-gradient(currentColor 1.5px,transparent 1.5px);background-size:15px 15px}.pattern-dots-md{background-image:radial-gradient(currentColor 1px,transparent 1px);background-size:8px 8px}.pattern-dots-medium-dense{background-image:radial-gradient(currentColor .5px,transparent .5px);background-size:3px 3px}.pattern-dots-sm{background-image:radial-gradient(currentColor .5px,transparent .5px);background-size:5px 5px}.pattern-cross-dots-md,.imagelist-background{background-image:radial-gradient(currentColor .7px,transparent 1px),radial-gradient(currentColor .7px,transparent 1px);background-size:6.5px 6.5px;background-position:0 0,3.5px 3.5px}.imagelist-background{background-color:#fff9;background-blend-mode:overlay}label{font-family:var(--monospace-font);font-size:.9em}input:not([type=radio]),select{-webkit-user-select:text;-moz-user-select:text;-ms-user-select:text;box-sizing:border-box;border-radius:0;user-select:text;font-family:var(--standard-text-font);background-color:var(--col-bg-1-input);border:none;color:var(--col-primary-bg-1);padding:2px;margin-bottom:2px;width:100%}input:not([type=radio]):focus,select:focus{margin-bottom:0;border-bottom:2px solid rgb(0,0,0);outline:none}h1{font-size:var(--font-size-h1)}h2{font-size:var(--font-size-h2)}h3{font-size:var(--font-size-h3)}h4{font-size:var(--font-size-h4)}small,.font-small{font-size:var(--font-size-small)}button{width:60px;height:60px;border-radius:35px;border-style:solid;border-width:2px;background-color:var(--col-bg-btn);color:var(--col-primary-bg-btn);border-color:var(--col-bg-btn-darker);font-family:var(--headline-text-font);font-size:var(--font-size-h4);font-weight:700}button:hover,button:focus{outline:none;background-color:var(--col-bg-btn-lighter)}button:active{padding-top:3px;color:var(--col-primary-bg-btn);background-color:var(--col-bg-btn-darker);border-color:var(--col-bg-btn-darker)}.kiosk-btn-128{width:128px;height:128px}.kiosk-btn-32{width:32px;height:32px}.kiosk-dropdown-btn{box-sizing:content-box;border-radius:0;background-color:var(--col-bg-btn);border-color:var(--col-bg-btn-darker);color:var(--col-primary-bg-btn);height:30px;width:30px}.kiosk-dropdown-btn .drop-down-btn{float:left}.kiosk-dropdown-btn .caret{color:var(--col-primary-bg-btn);display:inline-block;width:0;height:0;margin-left:2px;vertical-align:middle;border-color:var(--col-primary-bg-btn);border-top:4px solid;border-right:4px solid transparent;border-left:4px solid transparent}button:disabled{opacity:.3}.modal-round-button,.modal-delete,.modal-close,.modal-cancel,.modal-back,.modal-next,.modal-ok,.modal-button{box-sizing:border-box;margin-left:25px;background-image:none;display:inline-block;font-style:normal;font-variant:normal;text-rendering:auto;-webkit-font-smoothing:antialiased;font-family:"Font Awesome 6 Free";font-weight:900;font-size:24px;line-height:24px;vertical-align:center;text-align:center}.modal-ok:after{content:var(--icon-bt-ok)}.modal-next:after{padding-left:2px;content:var(--icon-bt-next)}.modal-back:after{padding-right:2px;content:var(--icon-bt-back)}.modal-cancel:after{content:var(--icon-bt-cancel)}.modal-close:before{content:var(--icon-bt-close)}.modal-delete{background-color:var(--col-bg-alert);color:var(--col-primary-bg-alert)}.modal-delete:before{content:var(--icon-bt-trash)}.modal-delete:hover,.modal-delete:focus{border-color:var(--col-bg-alert);background-color:var(--col-bg-alert-lighter);background-size:75%}.modal-delete:active{border-color:var(--col-bg-alert);background-color:var(--col-bg-alert-darker);color:var(--col-primary-bg-alert)}.kiosk-rounded{border-radius:15px}.kiosk-shaded{box-shadow:2px 2px 10px #2e380394}.kiosk-margin-bottom{margin-bottom:1em}.flex-line-break{width:100%;height:0px}.kiosk-align-flex-end{align-items:flex-end}.kiosk-align-flex-start{align-items:flex-start}.full-background-bg-1{background:linear-gradient(to right bottom,var(--col-bg-1-darker),var(--col-bg-1-lighter));height:100%;width:100%}.small-list-button i{border-radius:25px;box-shadow:2px 2px 5px #2e380394}.small-list-button:hover{color:var(--col-bg-att)}.small-list-button:hover i{box-shadow:2px 2px 5px #2e380394}.small-list-button:active,.small-list-button:focus{color:var(--col-bg-ack);transform:translateY(5px)}.small-list-button:active i,.small-list-button:focus i{box-shadow:none}.dialog-radio-div{display:flex;flex-direction:row}.dialog-radio-div input[type=radio]{margin-right:.5em}.fa,.fas{font-family:"Font Awesome 6 Free";font-weight:900;font-style:normal}.fa-trash:before{content:""}.fa-view-grid:before{content:""}.fa-reload:before{content:""}.fa-view-list:before{content:""}.fa-camera:before{content:""}.fa-view-image:before{content:""}.fa-check:before{content:""}.fa-bug:before{content:""}.fa-lightbulb:before{content:""}.fa-query:before{content:""}.fa-footsteps{transform:rotate(270deg)}.fa-footsteps:before{content:""}i{font-family:"Font Awesome 6 Free";font-style:normal;font-variant:normal;text-rendering:auto;-webkit-font-smoothing:antialiased;font-weight:900;font-size:.9em}div,p{font-family:var(--standard-text-font)}:host{--lumo-font-size-s: $font-size-standard;--_lumo-grid-secondary-border-color: $col-bg-2-lighter;--_lumo-grid-border-width: 5px;--lumo-font-family: $standard-text;--lumo-size-m: $font-size-standard}vaadin-grid{margin-top:.5em;background-color:var(--col-bg-2);--_lumo-grid-selected-row-color: var(--col-bg-2-darker)}vaadin-grid::part(cell){padding-left:.5em;padding-top:3px;padding-bottom:3px;background-color:var(--col-bg-2)}vaadin-grid::part(header-cell){min-height:auto;padding-top:.2em;padding-bottom:.2em;border-bottom-color:var(--col-bg-2-darker);border-bottom-width:2px;background-color:var(--col-bg-2-darker)}vaadin-grid::part(row){background-color:var(--col-bg-2);color:var(--col-primary-bg-2)}vaadin-grid::part(selected-row){color:var(--col-accent-bg-2)}';
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const Ss = (n) => (t, e) => {
  e !== void 0 ? e.addInitializer(() => {
    customElements.define(n, t);
  }) : customElements.define(n, t);
};
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const E_ = { attribute: !0, type: String, converter: Zi, reflect: !1, hasChanged: rs }, A_ = (n = E_, t, e) => {
  const { kind: r, metadata: i } = e;
  let s = globalThis.litPropertyMetadata.get(i);
  if (s === void 0 && globalThis.litPropertyMetadata.set(i, s = /* @__PURE__ */ new Map()), s.set(e.name, n), r === "accessor") {
    const { name: l } = e;
    return { set(d) {
      const f = t.get.call(this);
      t.set.call(this, d), this.requestUpdate(l, f, n);
    }, init(d) {
      return d !== void 0 && this.P(l, void 0, n), d;
    } };
  }
  if (r === "setter") {
    const { name: l } = e;
    return function(d) {
      const f = this[l];
      t.call(this, d), this.requestUpdate(l, f, n);
    };
  }
  throw Error("Unsupported decorator location: " + r);
};
function Se(n) {
  return (t, e) => typeof e == "object" ? A_(n, t, e) : ((r, i, s) => {
    const l = i.hasOwnProperty(s);
    return i.constructor.createProperty(s, l ? { ...r, wrapped: !0 } : r), l ? Object.getOwnPropertyDescriptor(i, s) : void 0;
  })(n, t, e);
}
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
function Vc(n) {
  return Se({ ...n, state: !0, attribute: !1 });
}
const Hc = 2, Zo = 3;
/**
 * @license
 * Copyright 2019 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const qi = globalThis, Is = qi.ShadowRoot && (qi.ShadyCSS === void 0 || qi.ShadyCSS.nativeShadow) && "adoptedStyleSheets" in Document.prototype && "replace" in CSSStyleSheet.prototype, Uc = Symbol(), dl = /* @__PURE__ */ new WeakMap();
let k_ = class {
  constructor(t, e, r) {
    if (this._$cssResult$ = !0, r !== Uc) throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");
    this.cssText = t, this.t = e;
  }
  get styleSheet() {
    let t = this.o;
    const e = this.t;
    if (Is && t === void 0) {
      const r = e !== void 0 && e.length === 1;
      r && (t = dl.get(e)), t === void 0 && ((this.o = t = new CSSStyleSheet()).replaceSync(this.cssText), r && dl.set(e, t));
    }
    return t;
  }
  toString() {
    return this.cssText;
  }
};
const P_ = (n) => new k_(typeof n == "string" ? n : n + "", void 0, Uc), S_ = (n, t) => {
  if (Is) n.adoptedStyleSheets = t.map((e) => e instanceof CSSStyleSheet ? e : e.styleSheet);
  else for (const e of t) {
    const r = document.createElement("style"), i = qi.litNonce;
    i !== void 0 && r.setAttribute("nonce", i), r.textContent = e.cssText, n.appendChild(r);
  }
}, ul = Is ? (n) => n : (n) => n instanceof CSSStyleSheet ? ((t) => {
  let e = "";
  for (const r of t.cssRules) e += r.cssText;
  return P_(e);
})(n) : n;
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const { is: I_, defineProperty: T_, getOwnPropertyDescriptor: O_, getOwnPropertyNames: z_, getOwnPropertySymbols: R_, getPrototypeOf: $_ } = Object, at = globalThis, hl = at.trustedTypes, N_ = hl ? hl.emptyScript : "", ko = at.reactiveElementPolyfillSupport, Vr = (n, t) => n, ln = { toAttribute(n, t) {
  switch (t) {
    case Boolean:
      n = n ? N_ : null;
      break;
    case Object:
    case Array:
      n = n == null ? n : JSON.stringify(n);
  }
  return n;
}, fromAttribute(n, t) {
  let e = n;
  switch (t) {
    case Boolean:
      e = n !== null;
      break;
    case Number:
      e = n === null ? null : Number(n);
      break;
    case Object:
    case Array:
      try {
        e = JSON.parse(n);
      } catch {
        e = null;
      }
  }
  return e;
} }, Ts = (n, t) => !I_(n, t), fl = { attribute: !0, type: String, converter: ln, reflect: !1, hasChanged: Ts };
Symbol.metadata ?? (Symbol.metadata = Symbol("metadata")), at.litPropertyMetadata ?? (at.litPropertyMetadata = /* @__PURE__ */ new WeakMap());
class Yt extends HTMLElement {
  static addInitializer(t) {
    this._$Ei(), (this.l ?? (this.l = [])).push(t);
  }
  static get observedAttributes() {
    return this.finalize(), this._$Eh && [...this._$Eh.keys()];
  }
  static createProperty(t, e = fl) {
    if (e.state && (e.attribute = !1), this._$Ei(), this.elementProperties.set(t, e), !e.noAccessor) {
      const r = Symbol(), i = this.getPropertyDescriptor(t, r, e);
      i !== void 0 && T_(this.prototype, t, i);
    }
  }
  static getPropertyDescriptor(t, e, r) {
    const { get: i, set: s } = O_(this.prototype, t) ?? { get() {
      return this[e];
    }, set(l) {
      this[e] = l;
    } };
    return { get() {
      return i == null ? void 0 : i.call(this);
    }, set(l) {
      const d = i == null ? void 0 : i.call(this);
      s.call(this, l), this.requestUpdate(t, d, r);
    }, configurable: !0, enumerable: !0 };
  }
  static getPropertyOptions(t) {
    return this.elementProperties.get(t) ?? fl;
  }
  static _$Ei() {
    if (this.hasOwnProperty(Vr("elementProperties"))) return;
    const t = $_(this);
    t.finalize(), t.l !== void 0 && (this.l = [...t.l]), this.elementProperties = new Map(t.elementProperties);
  }
  static finalize() {
    if (this.hasOwnProperty(Vr("finalized"))) return;
    if (this.finalized = !0, this._$Ei(), this.hasOwnProperty(Vr("properties"))) {
      const e = this.properties, r = [...z_(e), ...R_(e)];
      for (const i of r) this.createProperty(i, e[i]);
    }
    const t = this[Symbol.metadata];
    if (t !== null) {
      const e = litPropertyMetadata.get(t);
      if (e !== void 0) for (const [r, i] of e) this.elementProperties.set(r, i);
    }
    this._$Eh = /* @__PURE__ */ new Map();
    for (const [e, r] of this.elementProperties) {
      const i = this._$Eu(e, r);
      i !== void 0 && this._$Eh.set(i, e);
    }
    this.elementStyles = this.finalizeStyles(this.styles);
  }
  static finalizeStyles(t) {
    const e = [];
    if (Array.isArray(t)) {
      const r = new Set(t.flat(1 / 0).reverse());
      for (const i of r) e.unshift(ul(i));
    } else t !== void 0 && e.push(ul(t));
    return e;
  }
  static _$Eu(t, e) {
    const r = e.attribute;
    return r === !1 ? void 0 : typeof r == "string" ? r : typeof t == "string" ? t.toLowerCase() : void 0;
  }
  constructor() {
    super(), this._$Ep = void 0, this.isUpdatePending = !1, this.hasUpdated = !1, this._$Em = null, this._$Ev();
  }
  _$Ev() {
    var t;
    this._$ES = new Promise((e) => this.enableUpdating = e), this._$AL = /* @__PURE__ */ new Map(), this._$E_(), this.requestUpdate(), (t = this.constructor.l) == null || t.forEach((e) => e(this));
  }
  addController(t) {
    var e;
    (this._$EO ?? (this._$EO = /* @__PURE__ */ new Set())).add(t), this.renderRoot !== void 0 && this.isConnected && ((e = t.hostConnected) == null || e.call(t));
  }
  removeController(t) {
    var e;
    (e = this._$EO) == null || e.delete(t);
  }
  _$E_() {
    const t = /* @__PURE__ */ new Map(), e = this.constructor.elementProperties;
    for (const r of e.keys()) this.hasOwnProperty(r) && (t.set(r, this[r]), delete this[r]);
    t.size > 0 && (this._$Ep = t);
  }
  createRenderRoot() {
    const t = this.shadowRoot ?? this.attachShadow(this.constructor.shadowRootOptions);
    return S_(t, this.constructor.elementStyles), t;
  }
  connectedCallback() {
    var t;
    this.renderRoot ?? (this.renderRoot = this.createRenderRoot()), this.enableUpdating(!0), (t = this._$EO) == null || t.forEach((e) => {
      var r;
      return (r = e.hostConnected) == null ? void 0 : r.call(e);
    });
  }
  enableUpdating(t) {
  }
  disconnectedCallback() {
    var t;
    (t = this._$EO) == null || t.forEach((e) => {
      var r;
      return (r = e.hostDisconnected) == null ? void 0 : r.call(e);
    });
  }
  attributeChangedCallback(t, e, r) {
    this._$AK(t, r);
  }
  _$EC(t, e) {
    var s;
    const r = this.constructor.elementProperties.get(t), i = this.constructor._$Eu(t, r);
    if (i !== void 0 && r.reflect === !0) {
      const l = (((s = r.converter) == null ? void 0 : s.toAttribute) !== void 0 ? r.converter : ln).toAttribute(e, r.type);
      this._$Em = t, l == null ? this.removeAttribute(i) : this.setAttribute(i, l), this._$Em = null;
    }
  }
  _$AK(t, e) {
    var s;
    const r = this.constructor, i = r._$Eh.get(t);
    if (i !== void 0 && this._$Em !== i) {
      const l = r.getPropertyOptions(i), d = typeof l.converter == "function" ? { fromAttribute: l.converter } : ((s = l.converter) == null ? void 0 : s.fromAttribute) !== void 0 ? l.converter : ln;
      this._$Em = i, this[i] = d.fromAttribute(e, l.type), this._$Em = null;
    }
  }
  requestUpdate(t, e, r) {
    if (t !== void 0) {
      if (r ?? (r = this.constructor.getPropertyOptions(t)), !(r.hasChanged ?? Ts)(this[t], e)) return;
      this.P(t, e, r);
    }
    this.isUpdatePending === !1 && (this._$ES = this._$ET());
  }
  P(t, e, r) {
    this._$AL.has(t) || this._$AL.set(t, e), r.reflect === !0 && this._$Em !== t && (this._$Ej ?? (this._$Ej = /* @__PURE__ */ new Set())).add(t);
  }
  async _$ET() {
    this.isUpdatePending = !0;
    try {
      await this._$ES;
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
    var r;
    if (!this.isUpdatePending) return;
    if (!this.hasUpdated) {
      if (this.renderRoot ?? (this.renderRoot = this.createRenderRoot()), this._$Ep) {
        for (const [s, l] of this._$Ep) this[s] = l;
        this._$Ep = void 0;
      }
      const i = this.constructor.elementProperties;
      if (i.size > 0) for (const [s, l] of i) l.wrapped !== !0 || this._$AL.has(s) || this[s] === void 0 || this.P(s, this[s], l);
    }
    let t = !1;
    const e = this._$AL;
    try {
      t = this.shouldUpdate(e), t ? (this.willUpdate(e), (r = this._$EO) == null || r.forEach((i) => {
        var s;
        return (s = i.hostUpdate) == null ? void 0 : s.call(i);
      }), this.update(e)) : this._$EU();
    } catch (i) {
      throw t = !1, this._$EU(), i;
    }
    t && this._$AE(e);
  }
  willUpdate(t) {
  }
  _$AE(t) {
    var e;
    (e = this._$EO) == null || e.forEach((r) => {
      var i;
      return (i = r.hostUpdated) == null ? void 0 : i.call(r);
    }), this.hasUpdated || (this.hasUpdated = !0, this.firstUpdated(t)), this.updated(t);
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
  shouldUpdate(t) {
    return !0;
  }
  update(t) {
    this._$Ej && (this._$Ej = this._$Ej.forEach((e) => this._$EC(e, this[e]))), this._$EU();
  }
  updated(t) {
  }
  firstUpdated(t) {
  }
}
Yt.elementStyles = [], Yt.shadowRootOptions = { mode: "open" }, Yt[Vr("elementProperties")] = /* @__PURE__ */ new Map(), Yt[Vr("finalized")] = /* @__PURE__ */ new Map(), ko == null || ko({ ReactiveElement: Yt }), (at.reactiveElementVersions ?? (at.reactiveElementVersions = [])).push("2.0.4");
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const Hr = globalThis, cn = Hr.trustedTypes, pl = cn ? cn.createPolicy("lit-html", { createHTML: (n) => n }) : void 0, jc = "$lit$", rt = `lit$${(Math.random() + "").slice(9)}$`, qc = "?" + rt, D_ = `<${qc}>`, $t = document, Xr = () => $t.createComment(""), Jr = (n) => n === null || typeof n != "object" && typeof n != "function", Kc = Array.isArray, M_ = (n) => Kc(n) || typeof (n == null ? void 0 : n[Symbol.iterator]) == "function", Po = `[ 	
\f\r]`, zr = /<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g, _l = /-->/g, ml = />/g, wt = RegExp(`>|${Po}(?:([^\\s"'>=/]+)(${Po}*=${Po}*(?:[^ 	
\f\r"'\`<>=]|("|')|))|$)`, "g"), gl = /'/g, bl = /"/g, Wc = /^(?:script|style|textarea|title)$/i, F_ = (n) => (t, ...e) => ({ _$litType$: n, strings: t, values: e }), it = F_(1), ar = Symbol.for("lit-noChange"), he = Symbol.for("lit-nothing"), vl = /* @__PURE__ */ new WeakMap(), kt = $t.createTreeWalker($t, 129);
function Gc(n, t) {
  if (!Array.isArray(n) || !n.hasOwnProperty("raw")) throw Error("invalid template strings array");
  return pl !== void 0 ? pl.createHTML(t) : t;
}
const L_ = (n, t) => {
  const e = n.length - 1, r = [];
  let i, s = t === 2 ? "<svg>" : "", l = zr;
  for (let d = 0; d < e; d++) {
    const f = n[d];
    let m, g, v = -1, z = 0;
    for (; z < f.length && (l.lastIndex = z, g = l.exec(f), g !== null); ) z = l.lastIndex, l === zr ? g[1] === "!--" ? l = _l : g[1] !== void 0 ? l = ml : g[2] !== void 0 ? (Wc.test(g[2]) && (i = RegExp("</" + g[2], "g")), l = wt) : g[3] !== void 0 && (l = wt) : l === wt ? g[0] === ">" ? (l = i ?? zr, v = -1) : g[1] === void 0 ? v = -2 : (v = l.lastIndex - g[2].length, m = g[1], l = g[3] === void 0 ? wt : g[3] === '"' ? bl : gl) : l === bl || l === gl ? l = wt : l === _l || l === ml ? l = zr : (l = wt, i = void 0);
    const B = l === wt && n[d + 1].startsWith("/>") ? " " : "";
    s += l === zr ? f + D_ : v >= 0 ? (r.push(m), f.slice(0, v) + jc + f.slice(v) + rt + B) : f + rt + (v === -2 ? d : B);
  }
  return [Gc(n, s + (n[e] || "<?>") + (t === 2 ? "</svg>" : "")), r];
};
class Qr {
  constructor({ strings: t, _$litType$: e }, r) {
    let i;
    this.parts = [];
    let s = 0, l = 0;
    const d = t.length - 1, f = this.parts, [m, g] = L_(t, e);
    if (this.el = Qr.createElement(m, r), kt.currentNode = this.el.content, e === 2) {
      const v = this.el.content.firstChild;
      v.replaceWith(...v.childNodes);
    }
    for (; (i = kt.nextNode()) !== null && f.length < d; ) {
      if (i.nodeType === 1) {
        if (i.hasAttributes()) for (const v of i.getAttributeNames()) if (v.endsWith(jc)) {
          const z = g[l++], B = i.getAttribute(v).split(rt), H = /([.?@])?(.*)/.exec(z);
          f.push({ type: 1, index: s, name: H[2], strings: B, ctor: H[1] === "." ? V_ : H[1] === "?" ? H_ : H[1] === "@" ? U_ : vn }), i.removeAttribute(v);
        } else v.startsWith(rt) && (f.push({ type: 6, index: s }), i.removeAttribute(v));
        if (Wc.test(i.tagName)) {
          const v = i.textContent.split(rt), z = v.length - 1;
          if (z > 0) {
            i.textContent = cn ? cn.emptyScript : "";
            for (let B = 0; B < z; B++) i.append(v[B], Xr()), kt.nextNode(), f.push({ type: 2, index: ++s });
            i.append(v[z], Xr());
          }
        }
      } else if (i.nodeType === 8) if (i.data === qc) f.push({ type: 2, index: s });
      else {
        let v = -1;
        for (; (v = i.data.indexOf(rt, v + 1)) !== -1; ) f.push({ type: 7, index: s }), v += rt.length - 1;
      }
      s++;
    }
  }
  static createElement(t, e) {
    const r = $t.createElement("template");
    return r.innerHTML = t, r;
  }
}
function lr(n, t, e = n, r) {
  var l, d;
  if (t === ar) return t;
  let i = r !== void 0 ? (l = e._$Co) == null ? void 0 : l[r] : e._$Cl;
  const s = Jr(t) ? void 0 : t._$litDirective$;
  return (i == null ? void 0 : i.constructor) !== s && ((d = i == null ? void 0 : i._$AO) == null || d.call(i, !1), s === void 0 ? i = void 0 : (i = new s(n), i._$AT(n, e, r)), r !== void 0 ? (e._$Co ?? (e._$Co = []))[r] = i : e._$Cl = i), i !== void 0 && (t = lr(n, i._$AS(n, t.values), i, r)), t;
}
class B_ {
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
    const { el: { content: e }, parts: r } = this._$AD, i = ((t == null ? void 0 : t.creationScope) ?? $t).importNode(e, !0);
    kt.currentNode = i;
    let s = kt.nextNode(), l = 0, d = 0, f = r[0];
    for (; f !== void 0; ) {
      if (l === f.index) {
        let m;
        f.type === 2 ? m = new ni(s, s.nextSibling, this, t) : f.type === 1 ? m = new f.ctor(s, f.name, f.strings, this, t) : f.type === 6 && (m = new j_(s, this, t)), this._$AV.push(m), f = r[++d];
      }
      l !== (f == null ? void 0 : f.index) && (s = kt.nextNode(), l++);
    }
    return kt.currentNode = $t, i;
  }
  p(t) {
    let e = 0;
    for (const r of this._$AV) r !== void 0 && (r.strings !== void 0 ? (r._$AI(t, r, e), e += r.strings.length - 2) : r._$AI(t[e])), e++;
  }
}
class ni {
  get _$AU() {
    var t;
    return ((t = this._$AM) == null ? void 0 : t._$AU) ?? this._$Cv;
  }
  constructor(t, e, r, i) {
    this.type = 2, this._$AH = he, this._$AN = void 0, this._$AA = t, this._$AB = e, this._$AM = r, this.options = i, this._$Cv = (i == null ? void 0 : i.isConnected) ?? !0;
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
    t = lr(this, t, e), Jr(t) ? t === he || t == null || t === "" ? (this._$AH !== he && this._$AR(), this._$AH = he) : t !== this._$AH && t !== ar && this._(t) : t._$litType$ !== void 0 ? this.$(t) : t.nodeType !== void 0 ? this.T(t) : M_(t) ? this.k(t) : this._(t);
  }
  S(t) {
    return this._$AA.parentNode.insertBefore(t, this._$AB);
  }
  T(t) {
    this._$AH !== t && (this._$AR(), this._$AH = this.S(t));
  }
  _(t) {
    this._$AH !== he && Jr(this._$AH) ? this._$AA.nextSibling.data = t : this.T($t.createTextNode(t)), this._$AH = t;
  }
  $(t) {
    var s;
    const { values: e, _$litType$: r } = t, i = typeof r == "number" ? this._$AC(t) : (r.el === void 0 && (r.el = Qr.createElement(Gc(r.h, r.h[0]), this.options)), r);
    if (((s = this._$AH) == null ? void 0 : s._$AD) === i) this._$AH.p(e);
    else {
      const l = new B_(i, this), d = l.u(this.options);
      l.p(e), this.T(d), this._$AH = l;
    }
  }
  _$AC(t) {
    let e = vl.get(t.strings);
    return e === void 0 && vl.set(t.strings, e = new Qr(t)), e;
  }
  k(t) {
    Kc(this._$AH) || (this._$AH = [], this._$AR());
    const e = this._$AH;
    let r, i = 0;
    for (const s of t) i === e.length ? e.push(r = new ni(this.S(Xr()), this.S(Xr()), this, this.options)) : r = e[i], r._$AI(s), i++;
    i < e.length && (this._$AR(r && r._$AB.nextSibling, i), e.length = i);
  }
  _$AR(t = this._$AA.nextSibling, e) {
    var r;
    for ((r = this._$AP) == null ? void 0 : r.call(this, !1, !0, e); t && t !== this._$AB; ) {
      const i = t.nextSibling;
      t.remove(), t = i;
    }
  }
  setConnected(t) {
    var e;
    this._$AM === void 0 && (this._$Cv = t, (e = this._$AP) == null || e.call(this, t));
  }
}
class vn {
  get tagName() {
    return this.element.tagName;
  }
  get _$AU() {
    return this._$AM._$AU;
  }
  constructor(t, e, r, i, s) {
    this.type = 1, this._$AH = he, this._$AN = void 0, this.element = t, this.name = e, this._$AM = i, this.options = s, r.length > 2 || r[0] !== "" || r[1] !== "" ? (this._$AH = Array(r.length - 1).fill(new String()), this.strings = r) : this._$AH = he;
  }
  _$AI(t, e = this, r, i) {
    const s = this.strings;
    let l = !1;
    if (s === void 0) t = lr(this, t, e, 0), l = !Jr(t) || t !== this._$AH && t !== ar, l && (this._$AH = t);
    else {
      const d = t;
      let f, m;
      for (t = s[0], f = 0; f < s.length - 1; f++) m = lr(this, d[r + f], e, f), m === ar && (m = this._$AH[f]), l || (l = !Jr(m) || m !== this._$AH[f]), m === he ? t = he : t !== he && (t += (m ?? "") + s[f + 1]), this._$AH[f] = m;
    }
    l && !i && this.j(t);
  }
  j(t) {
    t === he ? this.element.removeAttribute(this.name) : this.element.setAttribute(this.name, t ?? "");
  }
}
class V_ extends vn {
  constructor() {
    super(...arguments), this.type = 3;
  }
  j(t) {
    this.element[this.name] = t === he ? void 0 : t;
  }
}
class H_ extends vn {
  constructor() {
    super(...arguments), this.type = 4;
  }
  j(t) {
    this.element.toggleAttribute(this.name, !!t && t !== he);
  }
}
class U_ extends vn {
  constructor(t, e, r, i, s) {
    super(t, e, r, i, s), this.type = 5;
  }
  _$AI(t, e = this) {
    if ((t = lr(this, t, e, 0) ?? he) === ar) return;
    const r = this._$AH, i = t === he && r !== he || t.capture !== r.capture || t.once !== r.once || t.passive !== r.passive, s = t !== he && (r === he || i);
    i && this.element.removeEventListener(this.name, this, r), s && this.element.addEventListener(this.name, this, t), this._$AH = t;
  }
  handleEvent(t) {
    var e;
    typeof this._$AH == "function" ? this._$AH.call(((e = this.options) == null ? void 0 : e.host) ?? this.element, t) : this._$AH.handleEvent(t);
  }
}
class j_ {
  constructor(t, e, r) {
    this.element = t, this.type = 6, this._$AN = void 0, this._$AM = e, this.options = r;
  }
  get _$AU() {
    return this._$AM._$AU;
  }
  _$AI(t) {
    lr(this, t);
  }
}
const So = Hr.litHtmlPolyfillSupport;
So == null || So(Qr, ni), (Hr.litHtmlVersions ?? (Hr.litHtmlVersions = [])).push("3.1.2");
const q_ = (n, t, e) => {
  const r = (e == null ? void 0 : e.renderBefore) ?? t;
  let i = r._$litPart$;
  if (i === void 0) {
    const s = (e == null ? void 0 : e.renderBefore) ?? null;
    r._$litPart$ = i = new ni(t.insertBefore(Xr(), s), s, void 0, e ?? {});
  }
  return i._$AI(n), i;
};
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
let tr = class extends Yt {
  constructor() {
    super(...arguments), this.renderOptions = { host: this }, this._$Do = void 0;
  }
  createRenderRoot() {
    var e;
    const t = super.createRenderRoot();
    return (e = this.renderOptions).renderBefore ?? (e.renderBefore = t.firstChild), t;
  }
  update(t) {
    const e = this.render();
    this.hasUpdated || (this.renderOptions.isConnected = this.isConnected), super.update(t), this._$Do = q_(e, this.renderRoot, this.renderOptions);
  }
  connectedCallback() {
    var t;
    super.connectedCallback(), (t = this._$Do) == null || t.setConnected(!0);
  }
  disconnectedCallback() {
    var t;
    super.disconnectedCallback(), (t = this._$Do) == null || t.setConnected(!1);
  }
  render() {
    return ar;
  }
};
var kl;
tr._$litElement$ = !0, tr.finalized = !0, (kl = globalThis.litElementHydrateSupport) == null || kl.call(globalThis, { LitElement: tr });
const Io = globalThis.litElementPolyfillSupport;
Io == null || Io({ LitElement: tr });
(globalThis.litElementVersions ?? (globalThis.litElementVersions = [])).push("4.0.4");
const Os = class Os extends tr {
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
    t.has("apiContext") && (this.showProgress = !1, this.apiContext && this.apiContext.status === Zo && this.addAppError("Cannot connect to Kiosk API."), !t.apiContext && this.apiContext && this.apiConnected());
  }
  apiConnected() {
  }
  render() {
    let t;
    return this.apiContext && this.apiContext.status === Hc ? t = this.apiRender() : this.apiContext && this.apiContext.status === Zo ? t = this.renderApiError() : t = this.renderNoContextYet(), it`
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
            ${this.renderProgress()} ${this.renderErrors()} ${t}
        `;
  }
  renderNoContextYet() {
    return it` <link rel="stylesheet" href="${this.kiosk_base_url}static/styles.css" /> `;
  }
  renderApiError() {
  }
  renderErrors() {
    return this.appErrors.length > 0 ? it` ${this.appErrors.map((t) => it`<div class="system-message" @click="${this.errorClicked}"><span>${t}</span><i>x</i></div>`)} ` : he;
  }
  errorClicked(t) {
    let e = t.currentTarget.children[0].textContent;
    e && this.deleteError(e);
  }
  renderProgress(t = !1) {
    if (t || this.showProgress)
      return it` <div class="loading">
                <div class="loading-progress"></div>
            </div>`;
  }
  addAppError(t) {
    this.appErrors.push(t), this.requestUpdate();
  }
  clearAppErrors() {
    this.appErrors = [], this.requestUpdate();
  }
  deleteError(t) {
    let e = -1;
    this.appErrors.find((r, i) => r === t ? (e = i, !0) : !1), e > -1 && (this.appErrors.splice(e, 1), this.appErrors = [...this.appErrors]);
  }
};
Os.properties = {
  /**
   * The Api Context
   */
  apiContext: { type: Object },
  appErrors: { type: Array },
  showProgress: { type: Boolean }
};
let yl = Os;
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const K_ = { attribute: !0, type: String, converter: ln, reflect: !1, hasChanged: Ts }, W_ = (n = K_, t, e) => {
  const { kind: r, metadata: i } = e;
  let s = globalThis.litPropertyMetadata.get(i);
  if (s === void 0 && globalThis.litPropertyMetadata.set(i, s = /* @__PURE__ */ new Map()), s.set(e.name, n), r === "accessor") {
    const { name: l } = e;
    return { set(d) {
      const f = t.get.call(this);
      t.set.call(this, d), this.requestUpdate(l, f, n);
    }, init(d) {
      return d !== void 0 && this.P(l, void 0, n), d;
    } };
  }
  if (r === "setter") {
    const { name: l } = e;
    return function(d) {
      const f = this[l];
      t.call(this, d), this.requestUpdate(l, f, n);
    };
  }
  throw Error("Unsupported decorator location: " + r);
};
function G_(n) {
  return (t, e) => typeof e == "object" ? W_(n, t, e) : ((r, i, s) => {
    const l = i.hasOwnProperty(s);
    return i.constructor.createProperty(s, l ? { ...r, wrapped: !0 } : r), l ? Object.getOwnPropertyDescriptor(i, s) : void 0;
  })(n, t, e);
}
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
function Y_(n) {
  return G_({ ...n, state: !0, attribute: !1 });
}
var Z_ = Object.defineProperty, X_ = (n, t, e, r) => {
  for (var i = void 0, s = n.length - 1, l; s >= 0; s--)
    (l = n[s]) && (i = l(t, e, i) || i);
  return i && Z_(t, e, i), i;
};
const zs = class zs extends tr {
  constructor() {
    super(), this.kiosk_base_url = "/", this.showProgress = !1, this.apiContext = void 0;
  }
  updated(t) {
    t.has("apiContext") && (this.showProgress = !1);
  }
  render() {
    let t;
    return this.apiContext && this.apiContext.status === Hc ? t = this.apiRender() : this.apiContext && this.apiContext.status === Zo ? t = this.renderApiError() : t = this.renderNoContextYet(), it`
            <link rel="stylesheet" href="${this.kiosk_base_url}static/styles.css" />
            ${t}
        `;
  }
  renderNoContextYet() {
    return it` <link rel="stylesheet" href="${this.kiosk_base_url}static/styles.css" /> `;
  }
  renderApiError() {
  }
  renderProgress(t = !1) {
    if (t || this.showProgress)
      return it` <div class="loading">
                <div class="loading-progress"></div>
            </div>`;
  }
};
zs.properties = {
  /**
   * The Api Context
   */
  apiContext: { type: Object }
};
let ei = zs;
X_([
  Y_()
], ei.prototype, "showProgress");
const To = "MSG_NETWORK_ERROR";
class J_ {
  constructor(t, e, r = "") {
    this.messageId = t, this.headline = e, this.body = r;
  }
}
function Oo(n, t, e, r = "") {
  let i = new J_(
    t,
    e,
    r
  );
  n.dispatchEvent(new CustomEvent(
    "send-message",
    { bubbles: !0, composed: !0, detail: i }
  ));
}
function Q_(n, t) {
  return n && t in n ? n[t] : t.replace("_", " ");
}
function em(n, t, e = "", r = null) {
  if (e && (e += ": "), t.response) {
    if (t.response.status == 403 || t.response.status == 401) {
      Oo(
        n,
        To,
        `${e}You are not logged in properly or your session has timed out`,
        '<a href="/logout">Please log in again.</a>'
      );
      return;
    }
    r ? r(t) : Oo(
      n,
      To,
      `${e}Kiosk server responded with an error.`,
      `(${t.msg}). 
                The server might be down or perhaps you are not logged in properly.`
    );
  } else {
    Oo(
      n,
      To,
      `${e}Kiosk server responded with a network error.`,
      `(${t}). 
            The server might be down or perhaps you are not logged in properly.`
    );
    return;
  }
}
var xl = typeof globalThis < "u" ? globalThis : typeof window < "u" ? window : typeof global < "u" ? global : typeof self < "u" ? self : {};
function tm(n) {
  return n && n.__esModule && Object.prototype.hasOwnProperty.call(n, "default") ? n.default : n;
}
var Yc = { exports: {} };
(function(n, t) {
  (function(e, r) {
    n.exports = r();
  })(xl, function() {
    var e = function(o, a) {
      return (e = Object.setPrototypeOf || { __proto__: [] } instanceof Array && function(c, u) {
        c.__proto__ = u;
      } || function(c, u) {
        for (var h in u) Object.prototype.hasOwnProperty.call(u, h) && (c[h] = u[h]);
      })(o, a);
    }, r = function() {
      return (r = Object.assign || function(o) {
        for (var a, c = 1, u = arguments.length; c < u; c++) for (var h in a = arguments[c]) Object.prototype.hasOwnProperty.call(a, h) && (o[h] = a[h]);
        return o;
      }).apply(this, arguments);
    };
    function i(o, a, c) {
      for (var u, h = 0, p = a.length; h < p; h++) !u && h in a || ((u = u || Array.prototype.slice.call(a, 0, h))[h] = a[h]);
      return o.concat(u || Array.prototype.slice.call(a));
    }
    var s = typeof globalThis < "u" ? globalThis : typeof self < "u" ? self : typeof window < "u" ? window : xl, l = Object.keys, d = Array.isArray;
    function f(o, a) {
      return typeof a != "object" || l(a).forEach(function(c) {
        o[c] = a[c];
      }), o;
    }
    typeof Promise > "u" || s.Promise || (s.Promise = Promise);
    var m = Object.getPrototypeOf, g = {}.hasOwnProperty;
    function v(o, a) {
      return g.call(o, a);
    }
    function z(o, a) {
      typeof a == "function" && (a = a(m(o))), (typeof Reflect > "u" ? l : Reflect.ownKeys)(a).forEach(function(c) {
        H(o, c, a[c]);
      });
    }
    var B = Object.defineProperty;
    function H(o, a, c, u) {
      B(o, a, f(c && v(c, "get") && typeof c.get == "function" ? { get: c.get, set: c.set, configurable: !0 } : { value: c, configurable: !0, writable: !0 }, u));
    }
    function ee(o) {
      return { from: function(a) {
        return o.prototype = Object.create(a.prototype), H(o.prototype, "constructor", o), { extend: z.bind(null, o.prototype) };
      } };
    }
    var se = Object.getOwnPropertyDescriptor, ae = [].slice;
    function re(o, a, c) {
      return ae.call(o, a, c);
    }
    function Oe(o, a) {
      return a(o);
    }
    function we(o) {
      if (!o) throw new Error("Assertion Failed");
    }
    function ue(o) {
      s.setImmediate ? setImmediate(o) : setTimeout(o, 0);
    }
    function ge(o, a) {
      if (typeof a == "string" && v(o, a)) return o[a];
      if (!a) return o;
      if (typeof a != "string") {
        for (var c = [], u = 0, h = a.length; u < h; ++u) {
          var p = ge(o, a[u]);
          c.push(p);
        }
        return c;
      }
      var _ = a.indexOf(".");
      if (_ !== -1) {
        var b = o[a.substr(0, _)];
        return b == null ? void 0 : ge(b, a.substr(_ + 1));
      }
    }
    function Ce(o, a, c) {
      if (o && a !== void 0 && !("isFrozen" in Object && Object.isFrozen(o))) if (typeof a != "string" && "length" in a) {
        we(typeof c != "string" && "length" in c);
        for (var u = 0, h = a.length; u < h; ++u) Ce(o, a[u], c[u]);
      } else {
        var p, _, b = a.indexOf(".");
        b !== -1 ? (p = a.substr(0, b), (_ = a.substr(b + 1)) === "" ? c === void 0 ? d(o) && !isNaN(parseInt(p)) ? o.splice(p, 1) : delete o[p] : o[p] = c : Ce(b = !(b = o[p]) || !v(o, p) ? o[p] = {} : b, _, c)) : c === void 0 ? d(o) && !isNaN(parseInt(a)) ? o.splice(a, 1) : delete o[a] : o[a] = c;
      }
    }
    function Rs(o) {
      var a, c = {};
      for (a in o) v(o, a) && (c[a] = o[a]);
      return c;
    }
    var td = [].concat;
    function $s(o) {
      return td.apply([], o);
    }
    var He = "BigUint64Array,BigInt64Array,Array,Boolean,String,Date,RegExp,Blob,File,FileList,FileSystemFileHandle,FileSystemDirectoryHandle,ArrayBuffer,DataView,Uint8ClampedArray,ImageBitmap,ImageData,Map,Set,CryptoKey".split(",").concat($s([8, 16, 32, 64].map(function(o) {
      return ["Int", "Uint", "Float"].map(function(a) {
        return a + o + "Array";
      });
    }))).filter(function(o) {
      return s[o];
    }), Ns = new Set(He.map(function(o) {
      return s[o];
    })), ur = null;
    function dt(o) {
      return ur = /* @__PURE__ */ new WeakMap(), o = function a(c) {
        if (!c || typeof c != "object") return c;
        var u = ur.get(c);
        if (u) return u;
        if (d(c)) {
          u = [], ur.set(c, u);
          for (var h = 0, p = c.length; h < p; ++h) u.push(a(c[h]));
        } else if (Ns.has(c.constructor)) u = c;
        else {
          var _, b = m(c);
          for (_ in u = b === Object.prototype ? {} : Object.create(b), ur.set(c, u), c) v(c, _) && (u[_] = a(c[_]));
        }
        return u;
      }(o), ur = null, o;
    }
    var rd = {}.toString;
    function yn(o) {
      return rd.call(o).slice(8, -1);
    }
    var xn = typeof Symbol < "u" ? Symbol.iterator : "@@iterator", id = typeof xn == "symbol" ? function(o) {
      var a;
      return o != null && (a = o[xn]) && a.apply(o);
    } : function() {
      return null;
    };
    function ut(o, a) {
      return a = o.indexOf(a), 0 <= a && o.splice(a, 1), 0 <= a;
    }
    var Mt = {};
    function Be(o) {
      var a, c, u, h;
      if (arguments.length === 1) {
        if (d(o)) return o.slice();
        if (this === Mt && typeof o == "string") return [o];
        if (h = id(o)) {
          for (c = []; !(u = h.next()).done; ) c.push(u.value);
          return c;
        }
        if (o == null) return [o];
        if (typeof (a = o.length) != "number") return [o];
        for (c = new Array(a); a--; ) c[a] = o[a];
        return c;
      }
      for (a = arguments.length, c = new Array(a); a--; ) c[a] = arguments[a];
      return c;
    }
    var wn = typeof Symbol < "u" ? function(o) {
      return o[Symbol.toStringTag] === "AsyncFunction";
    } : function() {
      return !1;
    }, pr = ["Unknown", "Constraint", "Data", "TransactionInactive", "ReadOnly", "Version", "NotFound", "InvalidState", "InvalidAccess", "Abort", "Timeout", "QuotaExceeded", "Syntax", "DataClone"], ze = ["Modify", "Bulk", "OpenFailed", "VersionChange", "Schema", "Upgrade", "InvalidTable", "MissingAPI", "NoSuchDatabase", "InvalidArgument", "SubTransaction", "Unsupported", "Internal", "DatabaseClosed", "PrematureCommit", "ForeignAwait"].concat(pr), nd = { VersionChanged: "Database version changed by other database connection", DatabaseClosed: "Database has been closed", Abort: "Transaction aborted", TransactionInactive: "Transaction has already completed or failed", MissingAPI: "IndexedDB API missing. Please visit https://tinyurl.com/y2uuvskb" };
    function Ft(o, a) {
      this.name = o, this.message = a;
    }
    function Ds(o, a) {
      return o + ". Errors: " + Object.keys(a).map(function(c) {
        return a[c].toString();
      }).filter(function(c, u, h) {
        return h.indexOf(c) === u;
      }).join(`
`);
    }
    function si(o, a, c, u) {
      this.failures = a, this.failedKeys = u, this.successCount = c, this.message = Ds(o, a);
    }
    function Lt(o, a) {
      this.name = "BulkError", this.failures = Object.keys(a).map(function(c) {
        return a[c];
      }), this.failuresByPos = a, this.message = Ds(o, this.failures);
    }
    ee(Ft).from(Error).extend({ toString: function() {
      return this.name + ": " + this.message;
    } }), ee(si).from(Ft), ee(Lt).from(Ft);
    var Cn = ze.reduce(function(o, a) {
      return o[a] = a + "Error", o;
    }, {}), od = Ft, j = ze.reduce(function(o, a) {
      var c = a + "Error";
      function u(h, p) {
        this.name = c, h ? typeof h == "string" ? (this.message = "".concat(h).concat(p ? `
 ` + p : ""), this.inner = p || null) : typeof h == "object" && (this.message = "".concat(h.name, " ").concat(h.message), this.inner = h) : (this.message = nd[a] || c, this.inner = null);
      }
      return ee(u).from(od), o[a] = u, o;
    }, {});
    j.Syntax = SyntaxError, j.Type = TypeError, j.Range = RangeError;
    var Ms = pr.reduce(function(o, a) {
      return o[a + "Error"] = j[a], o;
    }, {}), ai = ze.reduce(function(o, a) {
      return ["Syntax", "Type", "Range"].indexOf(a) === -1 && (o[a + "Error"] = j[a]), o;
    }, {});
    function te() {
    }
    function hr(o) {
      return o;
    }
    function sd(o, a) {
      return o == null || o === hr ? a : function(c) {
        return a(o(c));
      };
    }
    function ht(o, a) {
      return function() {
        o.apply(this, arguments), a.apply(this, arguments);
      };
    }
    function ad(o, a) {
      return o === te ? a : function() {
        var c = o.apply(this, arguments);
        c !== void 0 && (arguments[0] = c);
        var u = this.onsuccess, h = this.onerror;
        this.onsuccess = null, this.onerror = null;
        var p = a.apply(this, arguments);
        return u && (this.onsuccess = this.onsuccess ? ht(u, this.onsuccess) : u), h && (this.onerror = this.onerror ? ht(h, this.onerror) : h), p !== void 0 ? p : c;
      };
    }
    function ld(o, a) {
      return o === te ? a : function() {
        o.apply(this, arguments);
        var c = this.onsuccess, u = this.onerror;
        this.onsuccess = this.onerror = null, a.apply(this, arguments), c && (this.onsuccess = this.onsuccess ? ht(c, this.onsuccess) : c), u && (this.onerror = this.onerror ? ht(u, this.onerror) : u);
      };
    }
    function cd(o, a) {
      return o === te ? a : function(c) {
        var u = o.apply(this, arguments);
        f(c, u);
        var h = this.onsuccess, p = this.onerror;
        return this.onsuccess = null, this.onerror = null, c = a.apply(this, arguments), h && (this.onsuccess = this.onsuccess ? ht(h, this.onsuccess) : h), p && (this.onerror = this.onerror ? ht(p, this.onerror) : p), u === void 0 ? c === void 0 ? void 0 : c : f(u, c);
      };
    }
    function dd(o, a) {
      return o === te ? a : function() {
        return a.apply(this, arguments) !== !1 && o.apply(this, arguments);
      };
    }
    function En(o, a) {
      return o === te ? a : function() {
        var c = o.apply(this, arguments);
        if (c && typeof c.then == "function") {
          for (var u = this, h = arguments.length, p = new Array(h); h--; ) p[h] = arguments[h];
          return c.then(function() {
            return a.apply(u, p);
          });
        }
        return a.apply(this, arguments);
      };
    }
    ai.ModifyError = si, ai.DexieError = Ft, ai.BulkError = Lt;
    var De = typeof location < "u" && /^(http|https):\/\/(localhost|127\.0\.0\.1)/.test(location.href);
    function Fs(o) {
      De = o;
    }
    var fr = {}, Ls = 100, He = typeof Promise > "u" ? [] : function() {
      var o = Promise.resolve();
      if (typeof crypto > "u" || !crypto.subtle) return [o, m(o), o];
      var a = crypto.subtle.digest("SHA-512", new Uint8Array([0]));
      return [a, m(a), o];
    }(), pr = He[0], ze = He[1], He = He[2], ze = ze && ze.then, _r = pr && pr.constructor, An = !!He, mr = function(o, a) {
      gr.push([o, a]), li && (queueMicrotask(hd), li = !1);
    }, kn = !0, li = !0, ft = [], ci = [], Pn = hr, We = { id: "global", global: !0, ref: 0, unhandleds: [], onunhandled: te, pgp: !1, env: {}, finalize: te }, U = We, gr = [], pt = 0, di = [];
    function V(o) {
      if (typeof this != "object") throw new TypeError("Promises must be constructed via new");
      this._listeners = [], this._lib = !1;
      var a = this._PSD = U;
      if (typeof o != "function") {
        if (o !== fr) throw new TypeError("Not a function");
        return this._state = arguments[1], this._value = arguments[2], void (this._state === !1 && In(this, this._value));
      }
      this._state = null, this._value = null, ++a.ref, function c(u, h) {
        try {
          h(function(p) {
            if (u._state === null) {
              if (p === u) throw new TypeError("A promise cannot be resolved with itself.");
              var _ = u._lib && Bt();
              p && typeof p.then == "function" ? c(u, function(b, C) {
                p instanceof V ? p._then(b, C) : p.then(b, C);
              }) : (u._state = !0, u._value = p, Vs(u)), _ && Vt();
            }
          }, In.bind(null, u));
        } catch (p) {
          In(u, p);
        }
      }(this, o);
    }
    var Sn = { get: function() {
      var o = U, a = pi;
      function c(u, h) {
        var p = this, _ = !o.global && (o !== U || a !== pi), b = _ && !Ye(), C = new V(function(x, k) {
          Tn(p, new Bs(Us(u, o, _, b), Us(h, o, _, b), x, k, o));
        });
        return this._consoleTask && (C._consoleTask = this._consoleTask), C;
      }
      return c.prototype = fr, c;
    }, set: function(o) {
      H(this, "then", o && o.prototype === fr ? Sn : { get: function() {
        return o;
      }, set: Sn.set });
    } };
    function Bs(o, a, c, u, h) {
      this.onFulfilled = typeof o == "function" ? o : null, this.onRejected = typeof a == "function" ? a : null, this.resolve = c, this.reject = u, this.psd = h;
    }
    function In(o, a) {
      var c, u;
      ci.push(a), o._state === null && (c = o._lib && Bt(), a = Pn(a), o._state = !1, o._value = a, u = o, ft.some(function(h) {
        return h._value === u._value;
      }) || ft.push(u), Vs(o), c && Vt());
    }
    function Vs(o) {
      var a = o._listeners;
      o._listeners = [];
      for (var c = 0, u = a.length; c < u; ++c) Tn(o, a[c]);
      var h = o._PSD;
      --h.ref || h.finalize(), pt === 0 && (++pt, mr(function() {
        --pt == 0 && On();
      }, []));
    }
    function Tn(o, a) {
      if (o._state !== null) {
        var c = o._state ? a.onFulfilled : a.onRejected;
        if (c === null) return (o._state ? a.resolve : a.reject)(o._value);
        ++a.psd.ref, ++pt, mr(ud, [c, o, a]);
      } else o._listeners.push(a);
    }
    function ud(o, a, c) {
      try {
        var u, h = a._value;
        !a._state && ci.length && (ci = []), u = De && a._consoleTask ? a._consoleTask.run(function() {
          return o(h);
        }) : o(h), a._state || ci.indexOf(h) !== -1 || function(p) {
          for (var _ = ft.length; _; ) if (ft[--_]._value === p._value) return ft.splice(_, 1);
        }(a), c.resolve(u);
      } catch (p) {
        c.reject(p);
      } finally {
        --pt == 0 && On(), --c.psd.ref || c.psd.finalize();
      }
    }
    function hd() {
      _t(We, function() {
        Bt() && Vt();
      });
    }
    function Bt() {
      var o = kn;
      return li = kn = !1, o;
    }
    function Vt() {
      var o, a, c;
      do
        for (; 0 < gr.length; ) for (o = gr, gr = [], c = o.length, a = 0; a < c; ++a) {
          var u = o[a];
          u[0].apply(null, u[1]);
        }
      while (0 < gr.length);
      li = kn = !0;
    }
    function On() {
      var o = ft;
      ft = [], o.forEach(function(u) {
        u._PSD.onunhandled.call(null, u._value, u);
      });
      for (var a = di.slice(0), c = a.length; c; ) a[--c]();
    }
    function ui(o) {
      return new V(fr, !1, o);
    }
    function oe(o, a) {
      var c = U;
      return function() {
        var u = Bt(), h = U;
        try {
          return Ze(c, !0), o.apply(this, arguments);
        } catch (p) {
          a && a(p);
        } finally {
          Ze(h, !1), u && Vt();
        }
      };
    }
    z(V.prototype, { then: Sn, _then: function(o, a) {
      Tn(this, new Bs(null, null, o, a, U));
    }, catch: function(o) {
      if (arguments.length === 1) return this.then(null, o);
      var a = o, c = arguments[1];
      return typeof a == "function" ? this.then(null, function(u) {
        return (u instanceof a ? c : ui)(u);
      }) : this.then(null, function(u) {
        return (u && u.name === a ? c : ui)(u);
      });
    }, finally: function(o) {
      return this.then(function(a) {
        return V.resolve(o()).then(function() {
          return a;
        });
      }, function(a) {
        return V.resolve(o()).then(function() {
          return ui(a);
        });
      });
    }, timeout: function(o, a) {
      var c = this;
      return o < 1 / 0 ? new V(function(u, h) {
        var p = setTimeout(function() {
          return h(new j.Timeout(a));
        }, o);
        c.then(u, h).finally(clearTimeout.bind(null, p));
      }) : this;
    } }), typeof Symbol < "u" && Symbol.toStringTag && H(V.prototype, Symbol.toStringTag, "Dexie.Promise"), We.env = Hs(), z(V, { all: function() {
      var o = Be.apply(null, arguments).map(_i);
      return new V(function(a, c) {
        o.length === 0 && a([]);
        var u = o.length;
        o.forEach(function(h, p) {
          return V.resolve(h).then(function(_) {
            o[p] = _, --u || a(o);
          }, c);
        });
      });
    }, resolve: function(o) {
      return o instanceof V ? o : o && typeof o.then == "function" ? new V(function(a, c) {
        o.then(a, c);
      }) : new V(fr, !0, o);
    }, reject: ui, race: function() {
      var o = Be.apply(null, arguments).map(_i);
      return new V(function(a, c) {
        o.map(function(u) {
          return V.resolve(u).then(a, c);
        });
      });
    }, PSD: { get: function() {
      return U;
    }, set: function(o) {
      return U = o;
    } }, totalEchoes: { get: function() {
      return pi;
    } }, newPSD: Ge, usePSD: _t, scheduler: { get: function() {
      return mr;
    }, set: function(o) {
      mr = o;
    } }, rejectionMapper: { get: function() {
      return Pn;
    }, set: function(o) {
      Pn = o;
    } }, follow: function(o, a) {
      return new V(function(c, u) {
        return Ge(function(h, p) {
          var _ = U;
          _.unhandleds = [], _.onunhandled = p, _.finalize = ht(function() {
            var b, C = this;
            b = function() {
              C.unhandleds.length === 0 ? h() : p(C.unhandleds[0]);
            }, di.push(function x() {
              b(), di.splice(di.indexOf(x), 1);
            }), ++pt, mr(function() {
              --pt == 0 && On();
            }, []);
          }, _.finalize), o();
        }, a, c, u);
      });
    } }), _r && (_r.allSettled && H(V, "allSettled", function() {
      var o = Be.apply(null, arguments).map(_i);
      return new V(function(a) {
        o.length === 0 && a([]);
        var c = o.length, u = new Array(c);
        o.forEach(function(h, p) {
          return V.resolve(h).then(function(_) {
            return u[p] = { status: "fulfilled", value: _ };
          }, function(_) {
            return u[p] = { status: "rejected", reason: _ };
          }).then(function() {
            return --c || a(u);
          });
        });
      });
    }), _r.any && typeof AggregateError < "u" && H(V, "any", function() {
      var o = Be.apply(null, arguments).map(_i);
      return new V(function(a, c) {
        o.length === 0 && c(new AggregateError([]));
        var u = o.length, h = new Array(u);
        o.forEach(function(p, _) {
          return V.resolve(p).then(function(b) {
            return a(b);
          }, function(b) {
            h[_] = b, --u || c(new AggregateError(h));
          });
        });
      });
    }));
    var pe = { awaits: 0, echoes: 0, id: 0 }, fd = 0, hi = [], fi = 0, pi = 0, pd = 0;
    function Ge(o, a, c, u) {
      var h = U, p = Object.create(h);
      return p.parent = h, p.ref = 0, p.global = !1, p.id = ++pd, We.env, p.env = An ? { Promise: V, PromiseProp: { value: V, configurable: !0, writable: !0 }, all: V.all, race: V.race, allSettled: V.allSettled, any: V.any, resolve: V.resolve, reject: V.reject } : {}, a && f(p, a), ++h.ref, p.finalize = function() {
        --this.parent.ref || this.parent.finalize();
      }, u = _t(p, o, c, u), p.ref === 0 && p.finalize(), u;
    }
    function Ht() {
      return pe.id || (pe.id = ++fd), ++pe.awaits, pe.echoes += Ls, pe.id;
    }
    function Ye() {
      return !!pe.awaits && (--pe.awaits == 0 && (pe.id = 0), pe.echoes = pe.awaits * Ls, !0);
    }
    function _i(o) {
      return pe.echoes && o && o.constructor === _r ? (Ht(), o.then(function(a) {
        return Ye(), a;
      }, function(a) {
        return Ye(), le(a);
      })) : o;
    }
    function _d() {
      var o = hi[hi.length - 1];
      hi.pop(), Ze(o, !1);
    }
    function Ze(o, a) {
      var c, u = U;
      (a ? !pe.echoes || fi++ && o === U : !fi || --fi && o === U) || queueMicrotask(a ? (function(h) {
        ++pi, pe.echoes && --pe.echoes != 0 || (pe.echoes = pe.awaits = pe.id = 0), hi.push(U), Ze(h, !0);
      }).bind(null, o) : _d), o !== U && (U = o, u === We && (We.env = Hs()), An && (c = We.env.Promise, a = o.env, (u.global || o.global) && (Object.defineProperty(s, "Promise", a.PromiseProp), c.all = a.all, c.race = a.race, c.resolve = a.resolve, c.reject = a.reject, a.allSettled && (c.allSettled = a.allSettled), a.any && (c.any = a.any))));
    }
    function Hs() {
      var o = s.Promise;
      return An ? { Promise: o, PromiseProp: Object.getOwnPropertyDescriptor(s, "Promise"), all: o.all, race: o.race, allSettled: o.allSettled, any: o.any, resolve: o.resolve, reject: o.reject } : {};
    }
    function _t(o, a, c, u, h) {
      var p = U;
      try {
        return Ze(o, !0), a(c, u, h);
      } finally {
        Ze(p, !1);
      }
    }
    function Us(o, a, c, u) {
      return typeof o != "function" ? o : function() {
        var h = U;
        c && Ht(), Ze(a, !0);
        try {
          return o.apply(this, arguments);
        } finally {
          Ze(h, !1), u && queueMicrotask(Ye);
        }
      };
    }
    function zn(o) {
      Promise === _r && pe.echoes === 0 ? fi === 0 ? o() : enqueueNativeMicroTask(o) : setTimeout(o, 0);
    }
    ("" + ze).indexOf("[native code]") === -1 && (Ht = Ye = te);
    var le = V.reject, mt = "￿", Ve = "Invalid key provided. Keys must be of type string, number, Date or Array<string | number | Date>.", js = "String expected.", Ut = [], mi = "__dbnames", Rn = "readonly", $n = "readwrite";
    function gt(o, a) {
      return o ? a ? function() {
        return o.apply(this, arguments) && a.apply(this, arguments);
      } : o : a;
    }
    var qs = { type: 3, lower: -1 / 0, lowerOpen: !1, upper: [[]], upperOpen: !1 };
    function gi(o) {
      return typeof o != "string" || /\./.test(o) ? function(a) {
        return a;
      } : function(a) {
        return a[o] === void 0 && o in a && delete (a = dt(a))[o], a;
      };
    }
    function Ks() {
      throw j.Type();
    }
    function Z(o, a) {
      try {
        var c = Ws(o), u = Ws(a);
        if (c !== u) return c === "Array" ? 1 : u === "Array" ? -1 : c === "binary" ? 1 : u === "binary" ? -1 : c === "string" ? 1 : u === "string" ? -1 : c === "Date" ? 1 : u !== "Date" ? NaN : -1;
        switch (c) {
          case "number":
          case "Date":
          case "string":
            return a < o ? 1 : o < a ? -1 : 0;
          case "binary":
            return function(h, p) {
              for (var _ = h.length, b = p.length, C = _ < b ? _ : b, x = 0; x < C; ++x) if (h[x] !== p[x]) return h[x] < p[x] ? -1 : 1;
              return _ === b ? 0 : _ < b ? -1 : 1;
            }(Gs(o), Gs(a));
          case "Array":
            return function(h, p) {
              for (var _ = h.length, b = p.length, C = _ < b ? _ : b, x = 0; x < C; ++x) {
                var k = Z(h[x], p[x]);
                if (k !== 0) return k;
              }
              return _ === b ? 0 : _ < b ? -1 : 1;
            }(o, a);
        }
      } catch {
      }
      return NaN;
    }
    function Ws(o) {
      var a = typeof o;
      return a != "object" ? a : ArrayBuffer.isView(o) ? "binary" : (o = yn(o), o === "ArrayBuffer" ? "binary" : o);
    }
    function Gs(o) {
      return o instanceof Uint8Array ? o : ArrayBuffer.isView(o) ? new Uint8Array(o.buffer, o.byteOffset, o.byteLength) : new Uint8Array(o);
    }
    var Ys = (ne.prototype._trans = function(o, a, c) {
      var u = this._tx || U.trans, h = this.name, p = De && typeof console < "u" && console.createTask && void 0;
      function _(x, k, y) {
        if (!y.schema[h]) throw new j.NotFound("Table " + h + " not part of transaction");
        return a(y.idbtrans, y);
      }
      var b = Bt();
      try {
        var C = u && u.db._novip === this.db._novip ? u === U.trans ? u._promise(o, _, c) : Ge(function() {
          return u._promise(o, _, c);
        }, { trans: u, transless: U.transless || U }) : function x(k, y, P, w) {
          if (k.idbdb && (k._state.openComplete || U.letThrough || k._vip)) {
            var A = k._createTransaction(y, P, k._dbSchema);
            try {
              A.create(), k._state.PR1398_maxLoop = 3;
            } catch (S) {
              return S.name === Cn.InvalidState && k.isOpen() && 0 < --k._state.PR1398_maxLoop ? (k.close({ disableAutoOpen: !1 }), k.open().then(function() {
                return x(k, y, P, w);
              })) : le(S);
            }
            return A._promise(y, function(S, E) {
              return Ge(function() {
                return U.trans = A, w(S, E, A);
              });
            }).then(function(S) {
              if (y === "readwrite") try {
                A.idbtrans.commit();
              } catch {
              }
              return y === "readonly" ? S : A._completion.then(function() {
                return S;
              });
            });
          }
          if (k._state.openComplete) return le(new j.DatabaseClosed(k._state.dbOpenError));
          if (!k._state.isBeingOpened) {
            if (!k._state.autoOpen) return le(new j.DatabaseClosed());
            k.open().catch(te);
          }
          return k._state.dbReadyPromise.then(function() {
            return x(k, y, P, w);
          });
        }(this.db, o, [this.name], _);
        return p && (C._consoleTask = p, C = C.catch(function(x) {
          return le(x);
        })), C;
      } finally {
        b && Vt();
      }
    }, ne.prototype.get = function(o, a) {
      var c = this;
      return o && o.constructor === Object ? this.where(o).first(a) : o == null ? le(new j.Type("Invalid argument to Table.get()")) : this._trans("readonly", function(u) {
        return c.core.get({ trans: u, key: o }).then(function(h) {
          return c.hook.reading.fire(h);
        });
      }).then(a);
    }, ne.prototype.where = function(o) {
      if (typeof o == "string") return new this.db.WhereClause(this, o);
      if (d(o)) return new this.db.WhereClause(this, "[".concat(o.join("+"), "]"));
      var a = l(o);
      if (a.length === 1) return this.where(a[0]).equals(o[a[0]]);
      var c = this.schema.indexes.concat(this.schema.primKey).filter(function(C) {
        if (C.compound && a.every(function(k) {
          return 0 <= C.keyPath.indexOf(k);
        })) {
          for (var x = 0; x < a.length; ++x) if (a.indexOf(C.keyPath[x]) === -1) return !1;
          return !0;
        }
        return !1;
      }).sort(function(C, x) {
        return C.keyPath.length - x.keyPath.length;
      })[0];
      if (c && this.db._maxKey !== mt) {
        var _ = c.keyPath.slice(0, a.length);
        return this.where(_).equals(_.map(function(x) {
          return o[x];
        }));
      }
      var u = this.schema.idxByName, h = this.db._deps.indexedDB;
      function p(C, x) {
        return h.cmp(C, x) === 0;
      }
      var b = a.reduce(function(P, x) {
        var k = P[0], y = P[1], P = u[x], w = o[x];
        return [k || P, k || !P ? gt(y, P && P.multi ? function(A) {
          return A = ge(A, x), d(A) && A.some(function(S) {
            return p(w, S);
          });
        } : function(A) {
          return p(w, ge(A, x));
        }) : y];
      }, [null, null]), _ = b[0], b = b[1];
      return _ ? this.where(_.name).equals(o[_.keyPath]).filter(b) : c ? this.filter(b) : this.where(a).equals("");
    }, ne.prototype.filter = function(o) {
      return this.toCollection().and(o);
    }, ne.prototype.count = function(o) {
      return this.toCollection().count(o);
    }, ne.prototype.offset = function(o) {
      return this.toCollection().offset(o);
    }, ne.prototype.limit = function(o) {
      return this.toCollection().limit(o);
    }, ne.prototype.each = function(o) {
      return this.toCollection().each(o);
    }, ne.prototype.toArray = function(o) {
      return this.toCollection().toArray(o);
    }, ne.prototype.toCollection = function() {
      return new this.db.Collection(new this.db.WhereClause(this));
    }, ne.prototype.orderBy = function(o) {
      return new this.db.Collection(new this.db.WhereClause(this, d(o) ? "[".concat(o.join("+"), "]") : o));
    }, ne.prototype.reverse = function() {
      return this.toCollection().reverse();
    }, ne.prototype.mapToClass = function(o) {
      var a, c = this.db, u = this.name;
      function h() {
        return a !== null && a.apply(this, arguments) || this;
      }
      (this.schema.mappedClass = o).prototype instanceof Ks && (function(C, x) {
        if (typeof x != "function" && x !== null) throw new TypeError("Class extends value " + String(x) + " is not a constructor or null");
        function k() {
          this.constructor = C;
        }
        e(C, x), C.prototype = x === null ? Object.create(x) : (k.prototype = x.prototype, new k());
      }(h, a = o), Object.defineProperty(h.prototype, "db", { get: function() {
        return c;
      }, enumerable: !1, configurable: !0 }), h.prototype.table = function() {
        return u;
      }, o = h);
      for (var p = /* @__PURE__ */ new Set(), _ = o.prototype; _; _ = m(_)) Object.getOwnPropertyNames(_).forEach(function(C) {
        return p.add(C);
      });
      function b(C) {
        if (!C) return C;
        var x, k = Object.create(o.prototype);
        for (x in C) if (!p.has(x)) try {
          k[x] = C[x];
        } catch {
        }
        return k;
      }
      return this.schema.readHook && this.hook.reading.unsubscribe(this.schema.readHook), this.schema.readHook = b, this.hook("reading", b), o;
    }, ne.prototype.defineClass = function() {
      return this.mapToClass(function(o) {
        f(this, o);
      });
    }, ne.prototype.add = function(o, a) {
      var c = this, u = this.schema.primKey, h = u.auto, p = u.keyPath, _ = o;
      return p && h && (_ = gi(p)(o)), this._trans("readwrite", function(b) {
        return c.core.mutate({ trans: b, type: "add", keys: a != null ? [a] : null, values: [_] });
      }).then(function(b) {
        return b.numFailures ? V.reject(b.failures[0]) : b.lastResult;
      }).then(function(b) {
        if (p) try {
          Ce(o, p, b);
        } catch {
        }
        return b;
      });
    }, ne.prototype.update = function(o, a) {
      return typeof o != "object" || d(o) ? this.where(":id").equals(o).modify(a) : (o = ge(o, this.schema.primKey.keyPath), o === void 0 ? le(new j.InvalidArgument("Given object does not contain its primary key")) : this.where(":id").equals(o).modify(a));
    }, ne.prototype.put = function(o, a) {
      var c = this, u = this.schema.primKey, h = u.auto, p = u.keyPath, _ = o;
      return p && h && (_ = gi(p)(o)), this._trans("readwrite", function(b) {
        return c.core.mutate({ trans: b, type: "put", values: [_], keys: a != null ? [a] : null });
      }).then(function(b) {
        return b.numFailures ? V.reject(b.failures[0]) : b.lastResult;
      }).then(function(b) {
        if (p) try {
          Ce(o, p, b);
        } catch {
        }
        return b;
      });
    }, ne.prototype.delete = function(o) {
      var a = this;
      return this._trans("readwrite", function(c) {
        return a.core.mutate({ trans: c, type: "delete", keys: [o] });
      }).then(function(c) {
        return c.numFailures ? V.reject(c.failures[0]) : void 0;
      });
    }, ne.prototype.clear = function() {
      var o = this;
      return this._trans("readwrite", function(a) {
        return o.core.mutate({ trans: a, type: "deleteRange", range: qs });
      }).then(function(a) {
        return a.numFailures ? V.reject(a.failures[0]) : void 0;
      });
    }, ne.prototype.bulkGet = function(o) {
      var a = this;
      return this._trans("readonly", function(c) {
        return a.core.getMany({ keys: o, trans: c }).then(function(u) {
          return u.map(function(h) {
            return a.hook.reading.fire(h);
          });
        });
      });
    }, ne.prototype.bulkAdd = function(o, a, c) {
      var u = this, h = Array.isArray(a) ? a : void 0, p = (c = c || (h ? void 0 : a)) ? c.allKeys : void 0;
      return this._trans("readwrite", function(_) {
        var x = u.schema.primKey, b = x.auto, x = x.keyPath;
        if (x && h) throw new j.InvalidArgument("bulkAdd(): keys argument invalid on tables with inbound keys");
        if (h && h.length !== o.length) throw new j.InvalidArgument("Arguments objects and keys must have the same length");
        var C = o.length, x = x && b ? o.map(gi(x)) : o;
        return u.core.mutate({ trans: _, type: "add", keys: h, values: x, wantResults: p }).then(function(A) {
          var y = A.numFailures, P = A.results, w = A.lastResult, A = A.failures;
          if (y === 0) return p ? P : w;
          throw new Lt("".concat(u.name, ".bulkAdd(): ").concat(y, " of ").concat(C, " operations failed"), A);
        });
      });
    }, ne.prototype.bulkPut = function(o, a, c) {
      var u = this, h = Array.isArray(a) ? a : void 0, p = (c = c || (h ? void 0 : a)) ? c.allKeys : void 0;
      return this._trans("readwrite", function(_) {
        var x = u.schema.primKey, b = x.auto, x = x.keyPath;
        if (x && h) throw new j.InvalidArgument("bulkPut(): keys argument invalid on tables with inbound keys");
        if (h && h.length !== o.length) throw new j.InvalidArgument("Arguments objects and keys must have the same length");
        var C = o.length, x = x && b ? o.map(gi(x)) : o;
        return u.core.mutate({ trans: _, type: "put", keys: h, values: x, wantResults: p }).then(function(A) {
          var y = A.numFailures, P = A.results, w = A.lastResult, A = A.failures;
          if (y === 0) return p ? P : w;
          throw new Lt("".concat(u.name, ".bulkPut(): ").concat(y, " of ").concat(C, " operations failed"), A);
        });
      });
    }, ne.prototype.bulkUpdate = function(o) {
      var a = this, c = this.core, u = o.map(function(_) {
        return _.key;
      }), h = o.map(function(_) {
        return _.changes;
      }), p = [];
      return this._trans("readwrite", function(_) {
        return c.getMany({ trans: _, keys: u, cache: "clone" }).then(function(b) {
          var C = [], x = [];
          o.forEach(function(y, P) {
            var w = y.key, A = y.changes, S = b[P];
            if (S) {
              for (var E = 0, I = Object.keys(A); E < I.length; E++) {
                var T = I[E], O = A[T];
                if (T === a.schema.primKey.keyPath) {
                  if (Z(O, w) !== 0) throw new j.Constraint("Cannot update primary key in bulkUpdate()");
                } else Ce(S, T, O);
              }
              p.push(P), C.push(w), x.push(S);
            }
          });
          var k = C.length;
          return c.mutate({ trans: _, type: "put", keys: C, values: x, updates: { keys: u, changeSpecs: h } }).then(function(y) {
            var P = y.numFailures, w = y.failures;
            if (P === 0) return k;
            for (var A = 0, S = Object.keys(w); A < S.length; A++) {
              var E, I = S[A], T = p[Number(I)];
              T != null && (E = w[I], delete w[I], w[T] = E);
            }
            throw new Lt("".concat(a.name, ".bulkUpdate(): ").concat(P, " of ").concat(k, " operations failed"), w);
          });
        });
      });
    }, ne.prototype.bulkDelete = function(o) {
      var a = this, c = o.length;
      return this._trans("readwrite", function(u) {
        return a.core.mutate({ trans: u, type: "delete", keys: o });
      }).then(function(_) {
        var h = _.numFailures, p = _.lastResult, _ = _.failures;
        if (h === 0) return p;
        throw new Lt("".concat(a.name, ".bulkDelete(): ").concat(h, " of ").concat(c, " operations failed"), _);
      });
    }, ne);
    function ne() {
    }
    function br(o) {
      function a(_, b) {
        if (b) {
          for (var C = arguments.length, x = new Array(C - 1); --C; ) x[C - 1] = arguments[C];
          return c[_].subscribe.apply(null, x), o;
        }
        if (typeof _ == "string") return c[_];
      }
      var c = {};
      a.addEventType = p;
      for (var u = 1, h = arguments.length; u < h; ++u) p(arguments[u]);
      return a;
      function p(_, b, C) {
        if (typeof _ != "object") {
          var x;
          b = b || dd;
          var k = { subscribers: [], fire: C = C || te, subscribe: function(y) {
            k.subscribers.indexOf(y) === -1 && (k.subscribers.push(y), k.fire = b(k.fire, y));
          }, unsubscribe: function(y) {
            k.subscribers = k.subscribers.filter(function(P) {
              return P !== y;
            }), k.fire = k.subscribers.reduce(b, C);
          } };
          return c[_] = a[_] = k;
        }
        l(x = _).forEach(function(y) {
          var P = x[y];
          if (d(P)) p(y, x[y][0], x[y][1]);
          else {
            if (P !== "asap") throw new j.InvalidArgument("Invalid event config");
            var w = p(y, hr, function() {
              for (var A = arguments.length, S = new Array(A); A--; ) S[A] = arguments[A];
              w.subscribers.forEach(function(E) {
                ue(function() {
                  E.apply(null, S);
                });
              });
            });
          }
        });
      }
    }
    function vr(o, a) {
      return ee(a).from({ prototype: o }), a;
    }
    function jt(o, a) {
      return !(o.filter || o.algorithm || o.or) && (a ? o.justLimit : !o.replayFilter);
    }
    function Nn(o, a) {
      o.filter = gt(o.filter, a);
    }
    function Dn(o, a, c) {
      var u = o.replayFilter;
      o.replayFilter = u ? function() {
        return gt(u(), a());
      } : a, o.justLimit = c && !u;
    }
    function bi(o, a) {
      if (o.isPrimKey) return a.primaryKey;
      var c = a.getIndexByKeyPath(o.index);
      if (!c) throw new j.Schema("KeyPath " + o.index + " on object store " + a.name + " is not indexed");
      return c;
    }
    function Zs(o, a, c) {
      var u = bi(o, a.schema);
      return a.openCursor({ trans: c, values: !o.keysOnly, reverse: o.dir === "prev", unique: !!o.unique, query: { index: u, range: o.range } });
    }
    function vi(o, a, c, u) {
      var h = o.replayFilter ? gt(o.filter, o.replayFilter()) : o.filter;
      if (o.or) {
        var p = {}, _ = function(b, C, x) {
          var k, y;
          h && !h(C, x, function(P) {
            return C.stop(P);
          }, function(P) {
            return C.fail(P);
          }) || ((y = "" + (k = C.primaryKey)) == "[object ArrayBuffer]" && (y = "" + new Uint8Array(k)), v(p, y) || (p[y] = !0, a(b, C, x)));
        };
        return Promise.all([o.or._iterate(_, c), Xs(Zs(o, u, c), o.algorithm, _, !o.keysOnly && o.valueMapper)]);
      }
      return Xs(Zs(o, u, c), gt(o.algorithm, h), a, !o.keysOnly && o.valueMapper);
    }
    function Xs(o, a, c, u) {
      var h = oe(u ? function(p, _, b) {
        return c(u(p), _, b);
      } : c);
      return o.then(function(p) {
        if (p) return p.start(function() {
          var _ = function() {
            return p.continue();
          };
          a && !a(p, function(b) {
            return _ = b;
          }, function(b) {
            p.stop(b), _ = te;
          }, function(b) {
            p.fail(b), _ = te;
          }) || h(p.value, p, function(b) {
            return _ = b;
          }), _();
        });
      });
    }
    var He = Symbol(), yr = (Js.prototype.execute = function(o) {
      if (this.add !== void 0) {
        var a = this.add;
        if (d(a)) return i(i([], d(o) ? o : [], !0), a).sort();
        if (typeof a == "number") return (Number(o) || 0) + a;
        if (typeof a == "bigint") try {
          return BigInt(o) + a;
        } catch {
          return BigInt(0) + a;
        }
        throw new TypeError("Invalid term ".concat(a));
      }
      if (this.remove !== void 0) {
        var c = this.remove;
        if (d(c)) return d(o) ? o.filter(function(u) {
          return !c.includes(u);
        }).sort() : [];
        if (typeof c == "number") return Number(o) - c;
        if (typeof c == "bigint") try {
          return BigInt(o) - c;
        } catch {
          return BigInt(0) - c;
        }
        throw new TypeError("Invalid subtrahend ".concat(c));
      }
      return a = (a = this.replacePrefix) === null || a === void 0 ? void 0 : a[0], a && typeof o == "string" && o.startsWith(a) ? this.replacePrefix[1] + o.substring(a.length) : o;
    }, Js);
    function Js(o) {
      Object.assign(this, o);
    }
    var md = (J.prototype._read = function(o, a) {
      var c = this._ctx;
      return c.error ? c.table._trans(null, le.bind(null, c.error)) : c.table._trans("readonly", o).then(a);
    }, J.prototype._write = function(o) {
      var a = this._ctx;
      return a.error ? a.table._trans(null, le.bind(null, a.error)) : a.table._trans("readwrite", o, "locked");
    }, J.prototype._addAlgorithm = function(o) {
      var a = this._ctx;
      a.algorithm = gt(a.algorithm, o);
    }, J.prototype._iterate = function(o, a) {
      return vi(this._ctx, o, a, this._ctx.table.core);
    }, J.prototype.clone = function(o) {
      var a = Object.create(this.constructor.prototype), c = Object.create(this._ctx);
      return o && f(c, o), a._ctx = c, a;
    }, J.prototype.raw = function() {
      return this._ctx.valueMapper = null, this;
    }, J.prototype.each = function(o) {
      var a = this._ctx;
      return this._read(function(c) {
        return vi(a, o, c, a.table.core);
      });
    }, J.prototype.count = function(o) {
      var a = this;
      return this._read(function(c) {
        var u = a._ctx, h = u.table.core;
        if (jt(u, !0)) return h.count({ trans: c, query: { index: bi(u, h.schema), range: u.range } }).then(function(_) {
          return Math.min(_, u.limit);
        });
        var p = 0;
        return vi(u, function() {
          return ++p, !1;
        }, c, h).then(function() {
          return p;
        });
      }).then(o);
    }, J.prototype.sortBy = function(o, a) {
      var c = o.split(".").reverse(), u = c[0], h = c.length - 1;
      function p(C, x) {
        return x ? p(C[c[x]], x - 1) : C[u];
      }
      var _ = this._ctx.dir === "next" ? 1 : -1;
      function b(C, x) {
        return C = p(C, h), x = p(x, h), C < x ? -_ : x < C ? _ : 0;
      }
      return this.toArray(function(C) {
        return C.sort(b);
      }).then(a);
    }, J.prototype.toArray = function(o) {
      var a = this;
      return this._read(function(c) {
        var u = a._ctx;
        if (u.dir === "next" && jt(u, !0) && 0 < u.limit) {
          var h = u.valueMapper, p = bi(u, u.table.core.schema);
          return u.table.core.query({ trans: c, limit: u.limit, values: !0, query: { index: p, range: u.range } }).then(function(b) {
            return b = b.result, h ? b.map(h) : b;
          });
        }
        var _ = [];
        return vi(u, function(b) {
          return _.push(b);
        }, c, u.table.core).then(function() {
          return _;
        });
      }, o);
    }, J.prototype.offset = function(o) {
      var a = this._ctx;
      return o <= 0 || (a.offset += o, jt(a) ? Dn(a, function() {
        var c = o;
        return function(u, h) {
          return c === 0 || (c === 1 ? --c : h(function() {
            u.advance(c), c = 0;
          }), !1);
        };
      }) : Dn(a, function() {
        var c = o;
        return function() {
          return --c < 0;
        };
      })), this;
    }, J.prototype.limit = function(o) {
      return this._ctx.limit = Math.min(this._ctx.limit, o), Dn(this._ctx, function() {
        var a = o;
        return function(c, u, h) {
          return --a <= 0 && u(h), 0 <= a;
        };
      }, !0), this;
    }, J.prototype.until = function(o, a) {
      return Nn(this._ctx, function(c, u, h) {
        return !o(c.value) || (u(h), a);
      }), this;
    }, J.prototype.first = function(o) {
      return this.limit(1).toArray(function(a) {
        return a[0];
      }).then(o);
    }, J.prototype.last = function(o) {
      return this.reverse().first(o);
    }, J.prototype.filter = function(o) {
      var a;
      return Nn(this._ctx, function(c) {
        return o(c.value);
      }), (a = this._ctx).isMatch = gt(a.isMatch, o), this;
    }, J.prototype.and = function(o) {
      return this.filter(o);
    }, J.prototype.or = function(o) {
      return new this.db.WhereClause(this._ctx.table, o, this);
    }, J.prototype.reverse = function() {
      return this._ctx.dir = this._ctx.dir === "prev" ? "next" : "prev", this._ondirectionchange && this._ondirectionchange(this._ctx.dir), this;
    }, J.prototype.desc = function() {
      return this.reverse();
    }, J.prototype.eachKey = function(o) {
      var a = this._ctx;
      return a.keysOnly = !a.isMatch, this.each(function(c, u) {
        o(u.key, u);
      });
    }, J.prototype.eachUniqueKey = function(o) {
      return this._ctx.unique = "unique", this.eachKey(o);
    }, J.prototype.eachPrimaryKey = function(o) {
      var a = this._ctx;
      return a.keysOnly = !a.isMatch, this.each(function(c, u) {
        o(u.primaryKey, u);
      });
    }, J.prototype.keys = function(o) {
      var a = this._ctx;
      a.keysOnly = !a.isMatch;
      var c = [];
      return this.each(function(u, h) {
        c.push(h.key);
      }).then(function() {
        return c;
      }).then(o);
    }, J.prototype.primaryKeys = function(o) {
      var a = this._ctx;
      if (a.dir === "next" && jt(a, !0) && 0 < a.limit) return this._read(function(u) {
        var h = bi(a, a.table.core.schema);
        return a.table.core.query({ trans: u, values: !1, limit: a.limit, query: { index: h, range: a.range } });
      }).then(function(u) {
        return u.result;
      }).then(o);
      a.keysOnly = !a.isMatch;
      var c = [];
      return this.each(function(u, h) {
        c.push(h.primaryKey);
      }).then(function() {
        return c;
      }).then(o);
    }, J.prototype.uniqueKeys = function(o) {
      return this._ctx.unique = "unique", this.keys(o);
    }, J.prototype.firstKey = function(o) {
      return this.limit(1).keys(function(a) {
        return a[0];
      }).then(o);
    }, J.prototype.lastKey = function(o) {
      return this.reverse().firstKey(o);
    }, J.prototype.distinct = function() {
      var o = this._ctx, o = o.index && o.table.schema.idxByName[o.index];
      if (!o || !o.multi) return this;
      var a = {};
      return Nn(this._ctx, function(h) {
        var u = h.primaryKey.toString(), h = v(a, u);
        return a[u] = !0, !h;
      }), this;
    }, J.prototype.modify = function(o) {
      var a = this, c = this._ctx;
      return this._write(function(u) {
        var h, p, _;
        _ = typeof o == "function" ? o : (h = l(o), p = h.length, function(E) {
          for (var I = !1, T = 0; T < p; ++T) {
            var O = h[T], R = o[O], N = ge(E, O);
            R instanceof yr ? (Ce(E, O, R.execute(N)), I = !0) : N !== R && (Ce(E, O, R), I = !0);
          }
          return I;
        });
        function b(E, O) {
          var T = O.failures, O = O.numFailures;
          A += E - O;
          for (var R = 0, N = l(T); R < N.length; R++) {
            var F = N[R];
            w.push(T[F]);
          }
        }
        var C = c.table.core, x = C.schema.primaryKey, k = x.outbound, y = x.extractKey, P = a.db._options.modifyChunkSize || 200, w = [], A = 0, S = [];
        return a.clone().primaryKeys().then(function(E) {
          function I(O) {
            var R = Math.min(P, E.length - O);
            return C.getMany({ trans: u, keys: E.slice(O, O + R), cache: "immutable" }).then(function(N) {
              for (var F = [], D = [], M = k ? [] : null, L = [], $ = 0; $ < R; ++$) {
                var q = N[$], K = { value: dt(q), primKey: E[O + $] };
                _.call(K, K.value, K) !== !1 && (K.value == null ? L.push(E[O + $]) : k || Z(y(q), y(K.value)) === 0 ? (D.push(K.value), k && M.push(E[O + $])) : (L.push(E[O + $]), F.push(K.value)));
              }
              return Promise.resolve(0 < F.length && C.mutate({ trans: u, type: "add", values: F }).then(function(Y) {
                for (var W in Y.failures) L.splice(parseInt(W), 1);
                b(F.length, Y);
              })).then(function() {
                return (0 < D.length || T && typeof o == "object") && C.mutate({ trans: u, type: "put", keys: M, values: D, criteria: T, changeSpec: typeof o != "function" && o, isAdditionalChunk: 0 < O }).then(function(Y) {
                  return b(D.length, Y);
                });
              }).then(function() {
                return (0 < L.length || T && o === Mn) && C.mutate({ trans: u, type: "delete", keys: L, criteria: T, isAdditionalChunk: 0 < O }).then(function(Y) {
                  return b(L.length, Y);
                });
              }).then(function() {
                return E.length > O + R && I(O + P);
              });
            });
          }
          var T = jt(c) && c.limit === 1 / 0 && (typeof o != "function" || o === Mn) && { index: c.index, range: c.range };
          return I(0).then(function() {
            if (0 < w.length) throw new si("Error modifying one or more objects", w, A, S);
            return E.length;
          });
        });
      });
    }, J.prototype.delete = function() {
      var o = this._ctx, a = o.range;
      return jt(o) && (o.isPrimKey || a.type === 3) ? this._write(function(c) {
        var u = o.table.core.schema.primaryKey, h = a;
        return o.table.core.count({ trans: c, query: { index: u, range: h } }).then(function(p) {
          return o.table.core.mutate({ trans: c, type: "deleteRange", range: h }).then(function(_) {
            var b = _.failures;
            if (_.lastResult, _.results, _ = _.numFailures, _) throw new si("Could not delete some values", Object.keys(b).map(function(C) {
              return b[C];
            }), p - _);
            return p - _;
          });
        });
      }) : this.modify(Mn);
    }, J);
    function J() {
    }
    var Mn = function(o, a) {
      return a.value = null;
    };
    function gd(o, a) {
      return o < a ? -1 : o === a ? 0 : 1;
    }
    function bd(o, a) {
      return a < o ? -1 : o === a ? 0 : 1;
    }
    function Ie(o, a, c) {
      return o = o instanceof ea ? new o.Collection(o) : o, o._ctx.error = new (c || TypeError)(a), o;
    }
    function qt(o) {
      return new o.Collection(o, function() {
        return Qs("");
      }).limit(0);
    }
    function yi(o, a, c, u) {
      var h, p, _, b, C, x, k, y = c.length;
      if (!c.every(function(A) {
        return typeof A == "string";
      })) return Ie(o, js);
      function P(A) {
        h = A === "next" ? function(E) {
          return E.toUpperCase();
        } : function(E) {
          return E.toLowerCase();
        }, p = A === "next" ? function(E) {
          return E.toLowerCase();
        } : function(E) {
          return E.toUpperCase();
        }, _ = A === "next" ? gd : bd;
        var S = c.map(function(E) {
          return { lower: p(E), upper: h(E) };
        }).sort(function(E, I) {
          return _(E.lower, I.lower);
        });
        b = S.map(function(E) {
          return E.upper;
        }), C = S.map(function(E) {
          return E.lower;
        }), k = (x = A) === "next" ? "" : u;
      }
      P("next"), o = new o.Collection(o, function() {
        return Xe(b[0], C[y - 1] + u);
      }), o._ondirectionchange = function(A) {
        P(A);
      };
      var w = 0;
      return o._addAlgorithm(function(A, S, E) {
        var I = A.key;
        if (typeof I != "string") return !1;
        var T = p(I);
        if (a(T, C, w)) return !0;
        for (var O = null, R = w; R < y; ++R) {
          var N = function(F, D, M, L, $, q) {
            for (var K = Math.min(F.length, L.length), Y = -1, W = 0; W < K; ++W) {
              var Re = D[W];
              if (Re !== L[W]) return $(F[W], M[W]) < 0 ? F.substr(0, W) + M[W] + M.substr(W + 1) : $(F[W], L[W]) < 0 ? F.substr(0, W) + L[W] + M.substr(W + 1) : 0 <= Y ? F.substr(0, Y) + D[Y] + M.substr(Y + 1) : null;
              $(F[W], Re) < 0 && (Y = W);
            }
            return K < L.length && q === "next" ? F + M.substr(F.length) : K < F.length && q === "prev" ? F.substr(0, M.length) : Y < 0 ? null : F.substr(0, Y) + L[Y] + M.substr(Y + 1);
          }(I, T, b[R], C[R], _, x);
          N === null && O === null ? w = R + 1 : (O === null || 0 < _(O, N)) && (O = N);
        }
        return S(O !== null ? function() {
          A.continue(O + k);
        } : E), !1;
      }), o;
    }
    function Xe(o, a, c, u) {
      return { type: 2, lower: o, upper: a, lowerOpen: c, upperOpen: u };
    }
    function Qs(o) {
      return { type: 1, lower: o, upper: o };
    }
    var ea = (Object.defineProperty(_e.prototype, "Collection", { get: function() {
      return this._ctx.table.db.Collection;
    }, enumerable: !1, configurable: !0 }), _e.prototype.between = function(o, a, c, u) {
      c = c !== !1, u = u === !0;
      try {
        return 0 < this._cmp(o, a) || this._cmp(o, a) === 0 && (c || u) && (!c || !u) ? qt(this) : new this.Collection(this, function() {
          return Xe(o, a, !c, !u);
        });
      } catch {
        return Ie(this, Ve);
      }
    }, _e.prototype.equals = function(o) {
      return o == null ? Ie(this, Ve) : new this.Collection(this, function() {
        return Qs(o);
      });
    }, _e.prototype.above = function(o) {
      return o == null ? Ie(this, Ve) : new this.Collection(this, function() {
        return Xe(o, void 0, !0);
      });
    }, _e.prototype.aboveOrEqual = function(o) {
      return o == null ? Ie(this, Ve) : new this.Collection(this, function() {
        return Xe(o, void 0, !1);
      });
    }, _e.prototype.below = function(o) {
      return o == null ? Ie(this, Ve) : new this.Collection(this, function() {
        return Xe(void 0, o, !1, !0);
      });
    }, _e.prototype.belowOrEqual = function(o) {
      return o == null ? Ie(this, Ve) : new this.Collection(this, function() {
        return Xe(void 0, o);
      });
    }, _e.prototype.startsWith = function(o) {
      return typeof o != "string" ? Ie(this, js) : this.between(o, o + mt, !0, !0);
    }, _e.prototype.startsWithIgnoreCase = function(o) {
      return o === "" ? this.startsWith(o) : yi(this, function(a, c) {
        return a.indexOf(c[0]) === 0;
      }, [o], mt);
    }, _e.prototype.equalsIgnoreCase = function(o) {
      return yi(this, function(a, c) {
        return a === c[0];
      }, [o], "");
    }, _e.prototype.anyOfIgnoreCase = function() {
      var o = Be.apply(Mt, arguments);
      return o.length === 0 ? qt(this) : yi(this, function(a, c) {
        return c.indexOf(a) !== -1;
      }, o, "");
    }, _e.prototype.startsWithAnyOfIgnoreCase = function() {
      var o = Be.apply(Mt, arguments);
      return o.length === 0 ? qt(this) : yi(this, function(a, c) {
        return c.some(function(u) {
          return a.indexOf(u) === 0;
        });
      }, o, mt);
    }, _e.prototype.anyOf = function() {
      var o = this, a = Be.apply(Mt, arguments), c = this._cmp;
      try {
        a.sort(c);
      } catch {
        return Ie(this, Ve);
      }
      if (a.length === 0) return qt(this);
      var u = new this.Collection(this, function() {
        return Xe(a[0], a[a.length - 1]);
      });
      u._ondirectionchange = function(p) {
        c = p === "next" ? o._ascending : o._descending, a.sort(c);
      };
      var h = 0;
      return u._addAlgorithm(function(p, _, b) {
        for (var C = p.key; 0 < c(C, a[h]); ) if (++h === a.length) return _(b), !1;
        return c(C, a[h]) === 0 || (_(function() {
          p.continue(a[h]);
        }), !1);
      }), u;
    }, _e.prototype.notEqual = function(o) {
      return this.inAnyRange([[-1 / 0, o], [o, this.db._maxKey]], { includeLowers: !1, includeUppers: !1 });
    }, _e.prototype.noneOf = function() {
      var o = Be.apply(Mt, arguments);
      if (o.length === 0) return new this.Collection(this);
      try {
        o.sort(this._ascending);
      } catch {
        return Ie(this, Ve);
      }
      var a = o.reduce(function(c, u) {
        return c ? c.concat([[c[c.length - 1][1], u]]) : [[-1 / 0, u]];
      }, null);
      return a.push([o[o.length - 1], this.db._maxKey]), this.inAnyRange(a, { includeLowers: !1, includeUppers: !1 });
    }, _e.prototype.inAnyRange = function(I, a) {
      var c = this, u = this._cmp, h = this._ascending, p = this._descending, _ = this._min, b = this._max;
      if (I.length === 0) return qt(this);
      if (!I.every(function(T) {
        return T[0] !== void 0 && T[1] !== void 0 && h(T[0], T[1]) <= 0;
      })) return Ie(this, "First argument to inAnyRange() must be an Array of two-value Arrays [lower,upper] where upper must not be lower than lower", j.InvalidArgument);
      var C = !a || a.includeLowers !== !1, x = a && a.includeUppers === !0, k, y = h;
      function P(T, O) {
        return y(T[0], O[0]);
      }
      try {
        (k = I.reduce(function(T, O) {
          for (var R = 0, N = T.length; R < N; ++R) {
            var F = T[R];
            if (u(O[0], F[1]) < 0 && 0 < u(O[1], F[0])) {
              F[0] = _(F[0], O[0]), F[1] = b(F[1], O[1]);
              break;
            }
          }
          return R === N && T.push(O), T;
        }, [])).sort(P);
      } catch {
        return Ie(this, Ve);
      }
      var w = 0, A = x ? function(T) {
        return 0 < h(T, k[w][1]);
      } : function(T) {
        return 0 <= h(T, k[w][1]);
      }, S = C ? function(T) {
        return 0 < p(T, k[w][0]);
      } : function(T) {
        return 0 <= p(T, k[w][0]);
      }, E = A, I = new this.Collection(this, function() {
        return Xe(k[0][0], k[k.length - 1][1], !C, !x);
      });
      return I._ondirectionchange = function(T) {
        y = T === "next" ? (E = A, h) : (E = S, p), k.sort(P);
      }, I._addAlgorithm(function(T, O, R) {
        for (var N, F = T.key; E(F); ) if (++w === k.length) return O(R), !1;
        return !A(N = F) && !S(N) || (c._cmp(F, k[w][1]) === 0 || c._cmp(F, k[w][0]) === 0 || O(function() {
          y === h ? T.continue(k[w][0]) : T.continue(k[w][1]);
        }), !1);
      }), I;
    }, _e.prototype.startsWithAnyOf = function() {
      var o = Be.apply(Mt, arguments);
      return o.every(function(a) {
        return typeof a == "string";
      }) ? o.length === 0 ? qt(this) : this.inAnyRange(o.map(function(a) {
        return [a, a + mt];
      })) : Ie(this, "startsWithAnyOf() only works with strings");
    }, _e);
    function _e() {
    }
    function Me(o) {
      return oe(function(a) {
        return xr(a), o(a.target.error), !1;
      });
    }
    function xr(o) {
      o.stopPropagation && o.stopPropagation(), o.preventDefault && o.preventDefault();
    }
    var wr = "storagemutated", Fn = "x-storagemutated-1", Je = br(null, wr), vd = (Fe.prototype._lock = function() {
      return we(!U.global), ++this._reculock, this._reculock !== 1 || U.global || (U.lockOwnerFor = this), this;
    }, Fe.prototype._unlock = function() {
      if (we(!U.global), --this._reculock == 0) for (U.global || (U.lockOwnerFor = null); 0 < this._blockedFuncs.length && !this._locked(); ) {
        var o = this._blockedFuncs.shift();
        try {
          _t(o[1], o[0]);
        } catch {
        }
      }
      return this;
    }, Fe.prototype._locked = function() {
      return this._reculock && U.lockOwnerFor !== this;
    }, Fe.prototype.create = function(o) {
      var a = this;
      if (!this.mode) return this;
      var c = this.db.idbdb, u = this.db._state.dbOpenError;
      if (we(!this.idbtrans), !o && !c) switch (u && u.name) {
        case "DatabaseClosedError":
          throw new j.DatabaseClosed(u);
        case "MissingAPIError":
          throw new j.MissingAPI(u.message, u);
        default:
          throw new j.OpenFailed(u);
      }
      if (!this.active) throw new j.TransactionInactive();
      return we(this._completion._state === null), (o = this.idbtrans = o || (this.db.core || c).transaction(this.storeNames, this.mode, { durability: this.chromeTransactionDurability })).onerror = oe(function(h) {
        xr(h), a._reject(o.error);
      }), o.onabort = oe(function(h) {
        xr(h), a.active && a._reject(new j.Abort(o.error)), a.active = !1, a.on("abort").fire(h);
      }), o.oncomplete = oe(function() {
        a.active = !1, a._resolve(), "mutatedParts" in o && Je.storagemutated.fire(o.mutatedParts);
      }), this;
    }, Fe.prototype._promise = function(o, a, c) {
      var u = this;
      if (o === "readwrite" && this.mode !== "readwrite") return le(new j.ReadOnly("Transaction is readonly"));
      if (!this.active) return le(new j.TransactionInactive());
      if (this._locked()) return new V(function(p, _) {
        u._blockedFuncs.push([function() {
          u._promise(o, a, c).then(p, _);
        }, U]);
      });
      if (c) return Ge(function() {
        var p = new V(function(_, b) {
          u._lock();
          var C = a(_, b, u);
          C && C.then && C.then(_, b);
        });
        return p.finally(function() {
          return u._unlock();
        }), p._lib = !0, p;
      });
      var h = new V(function(p, _) {
        var b = a(p, _, u);
        b && b.then && b.then(p, _);
      });
      return h._lib = !0, h;
    }, Fe.prototype._root = function() {
      return this.parent ? this.parent._root() : this;
    }, Fe.prototype.waitFor = function(o) {
      var a, c = this._root(), u = V.resolve(o);
      c._waitingFor ? c._waitingFor = c._waitingFor.then(function() {
        return u;
      }) : (c._waitingFor = u, c._waitingQueue = [], a = c.idbtrans.objectStore(c.storeNames[0]), function p() {
        for (++c._spinCount; c._waitingQueue.length; ) c._waitingQueue.shift()();
        c._waitingFor && (a.get(-1 / 0).onsuccess = p);
      }());
      var h = c._waitingFor;
      return new V(function(p, _) {
        u.then(function(b) {
          return c._waitingQueue.push(oe(p.bind(null, b)));
        }, function(b) {
          return c._waitingQueue.push(oe(_.bind(null, b)));
        }).finally(function() {
          c._waitingFor === h && (c._waitingFor = null);
        });
      });
    }, Fe.prototype.abort = function() {
      this.active && (this.active = !1, this.idbtrans && this.idbtrans.abort(), this._reject(new j.Abort()));
    }, Fe.prototype.table = function(o) {
      var a = this._memoizedTables || (this._memoizedTables = {});
      if (v(a, o)) return a[o];
      var c = this.schema[o];
      if (!c) throw new j.NotFound("Table " + o + " not part of transaction");
      return c = new this.db.Table(o, c, this), c.core = this.db.core.table(o), a[o] = c;
    }, Fe);
    function Fe() {
    }
    function Ln(o, a, c, u, h, p, _) {
      return { name: o, keyPath: a, unique: c, multi: u, auto: h, compound: p, src: (c && !_ ? "&" : "") + (u ? "*" : "") + (h ? "++" : "") + ta(a) };
    }
    function ta(o) {
      return typeof o == "string" ? o : o ? "[" + [].join.call(o, "+") + "]" : "";
    }
    function Bn(o, a, c) {
      return { name: o, primKey: a, indexes: c, mappedClass: null, idxByName: (u = function(h) {
        return [h.name, h];
      }, c.reduce(function(h, p, _) {
        return _ = u(p, _), _ && (h[_[0]] = _[1]), h;
      }, {})) };
      var u;
    }
    var Cr = function(o) {
      try {
        return o.only([[]]), Cr = function() {
          return [[]];
        }, [[]];
      } catch {
        return Cr = function() {
          return mt;
        }, mt;
      }
    };
    function Vn(o) {
      return o == null ? function() {
      } : typeof o == "string" ? (a = o).split(".").length === 1 ? function(c) {
        return c[a];
      } : function(c) {
        return ge(c, a);
      } : function(c) {
        return ge(c, o);
      };
      var a;
    }
    function ra(o) {
      return [].slice.call(o);
    }
    var yd = 0;
    function Er(o) {
      return o == null ? ":id" : typeof o == "string" ? o : "[".concat(o.join("+"), "]");
    }
    function xd(o, a, C) {
      function u(E) {
        if (E.type === 3) return null;
        if (E.type === 4) throw new Error("Cannot convert never type to IDBKeyRange");
        var w = E.lower, A = E.upper, S = E.lowerOpen, E = E.upperOpen;
        return w === void 0 ? A === void 0 ? null : a.upperBound(A, !!E) : A === void 0 ? a.lowerBound(w, !!S) : a.bound(w, A, !!S, !!E);
      }
      function h(P) {
        var w, A = P.name;
        return { name: A, schema: P, mutate: function(S) {
          var E = S.trans, I = S.type, T = S.keys, O = S.values, R = S.range;
          return new Promise(function(N, F) {
            N = oe(N);
            var D = E.objectStore(A), M = D.keyPath == null, L = I === "put" || I === "add";
            if (!L && I !== "delete" && I !== "deleteRange") throw new Error("Invalid operation type: " + I);
            var $, q = (T || O || { length: 1 }).length;
            if (T && O && T.length !== O.length) throw new Error("Given keys array must have same length as given values array.");
            if (q === 0) return N({ numFailures: 0, failures: {}, results: [], lastResult: void 0 });
            function K(Ae) {
              ++Re, xr(Ae);
            }
            var Y = [], W = [], Re = 0;
            if (I === "deleteRange") {
              if (R.type === 4) return N({ numFailures: Re, failures: W, results: [], lastResult: void 0 });
              R.type === 3 ? Y.push($ = D.clear()) : Y.push($ = D.delete(u(R)));
            } else {
              var M = L ? M ? [O, T] : [O, null] : [T, null], G = M[0], be = M[1];
              if (L) for (var ve = 0; ve < q; ++ve) Y.push($ = be && be[ve] !== void 0 ? D[I](G[ve], be[ve]) : D[I](G[ve])), $.onerror = K;
              else for (ve = 0; ve < q; ++ve) Y.push($ = D[I](G[ve])), $.onerror = K;
            }
            function Ri(Ae) {
              Ae = Ae.target.result, Y.forEach(function(yt, oo) {
                return yt.error != null && (W[oo] = yt.error);
              }), N({ numFailures: Re, failures: W, results: I === "delete" ? T : Y.map(function(yt) {
                return yt.result;
              }), lastResult: Ae });
            }
            $.onerror = function(Ae) {
              K(Ae), Ri(Ae);
            }, $.onsuccess = Ri;
          });
        }, getMany: function(S) {
          var E = S.trans, I = S.keys;
          return new Promise(function(T, O) {
            T = oe(T);
            for (var R, N = E.objectStore(A), F = I.length, D = new Array(F), M = 0, L = 0, $ = function(Y) {
              Y = Y.target, D[Y._pos] = Y.result, ++L === M && T(D);
            }, q = Me(O), K = 0; K < F; ++K) I[K] != null && ((R = N.get(I[K]))._pos = K, R.onsuccess = $, R.onerror = q, ++M);
            M === 0 && T(D);
          });
        }, get: function(S) {
          var E = S.trans, I = S.key;
          return new Promise(function(T, O) {
            T = oe(T);
            var R = E.objectStore(A).get(I);
            R.onsuccess = function(N) {
              return T(N.target.result);
            }, R.onerror = Me(O);
          });
        }, query: (w = x, function(S) {
          return new Promise(function(E, I) {
            E = oe(E);
            var T, O, R, M = S.trans, N = S.values, F = S.limit, $ = S.query, D = F === 1 / 0 ? void 0 : F, L = $.index, $ = $.range, M = M.objectStore(A), L = L.isPrimaryKey ? M : M.index(L.name), $ = u($);
            if (F === 0) return E({ result: [] });
            w ? ((D = N ? L.getAll($, D) : L.getAllKeys($, D)).onsuccess = function(q) {
              return E({ result: q.target.result });
            }, D.onerror = Me(I)) : (T = 0, O = !N && "openKeyCursor" in L ? L.openKeyCursor($) : L.openCursor($), R = [], O.onsuccess = function(q) {
              var K = O.result;
              return K ? (R.push(N ? K.value : K.primaryKey), ++T === F ? E({ result: R }) : void K.continue()) : E({ result: R });
            }, O.onerror = Me(I));
          });
        }), openCursor: function(S) {
          var E = S.trans, I = S.values, T = S.query, O = S.reverse, R = S.unique;
          return new Promise(function(N, F) {
            N = oe(N);
            var L = T.index, D = T.range, M = E.objectStore(A), M = L.isPrimaryKey ? M : M.index(L.name), L = O ? R ? "prevunique" : "prev" : R ? "nextunique" : "next", $ = !I && "openKeyCursor" in M ? M.openKeyCursor(u(D), L) : M.openCursor(u(D), L);
            $.onerror = Me(F), $.onsuccess = oe(function(q) {
              var K, Y, W, Re, G = $.result;
              G ? (G.___id = ++yd, G.done = !1, K = G.continue.bind(G), Y = (Y = G.continuePrimaryKey) && Y.bind(G), W = G.advance.bind(G), Re = function() {
                throw new Error("Cursor not stopped");
              }, G.trans = E, G.stop = G.continue = G.continuePrimaryKey = G.advance = function() {
                throw new Error("Cursor not started");
              }, G.fail = oe(F), G.next = function() {
                var be = this, ve = 1;
                return this.start(function() {
                  return ve-- ? be.continue() : be.stop();
                }).then(function() {
                  return be;
                });
              }, G.start = function(be) {
                function ve() {
                  if ($.result) try {
                    be();
                  } catch (Ae) {
                    G.fail(Ae);
                  }
                  else G.done = !0, G.start = function() {
                    throw new Error("Cursor behind last entry");
                  }, G.stop();
                }
                var Ri = new Promise(function(Ae, yt) {
                  Ae = oe(Ae), $.onerror = Me(yt), G.fail = yt, G.stop = function(oo) {
                    G.stop = G.continue = G.continuePrimaryKey = G.advance = Re, Ae(oo);
                  };
                });
                return $.onsuccess = oe(function(Ae) {
                  $.onsuccess = ve, ve();
                }), G.continue = K, G.continuePrimaryKey = Y, G.advance = W, ve(), Ri;
              }, N(G)) : N(null);
            }, F);
          });
        }, count: function(S) {
          var E = S.query, I = S.trans, T = E.index, O = E.range;
          return new Promise(function(R, N) {
            var F = I.objectStore(A), D = T.isPrimaryKey ? F : F.index(T.name), F = u(O), D = F ? D.count(F) : D.count();
            D.onsuccess = oe(function(M) {
              return R(M.target.result);
            }), D.onerror = Me(N);
          });
        } };
      }
      var p, _, b, k = (_ = C, b = ra((p = o).objectStoreNames), { schema: { name: p.name, tables: b.map(function(P) {
        return _.objectStore(P);
      }).map(function(P) {
        var w = P.keyPath, E = P.autoIncrement, A = d(w), S = {}, E = { name: P.name, primaryKey: { name: null, isPrimaryKey: !0, outbound: w == null, compound: A, keyPath: w, autoIncrement: E, unique: !0, extractKey: Vn(w) }, indexes: ra(P.indexNames).map(function(I) {
          return P.index(I);
        }).map(function(R) {
          var T = R.name, O = R.unique, N = R.multiEntry, R = R.keyPath, N = { name: T, compound: d(R), keyPath: R, unique: O, multiEntry: N, extractKey: Vn(R) };
          return S[Er(R)] = N;
        }), getIndexByKeyPath: function(I) {
          return S[Er(I)];
        } };
        return S[":id"] = E.primaryKey, w != null && (S[Er(w)] = E.primaryKey), E;
      }) }, hasGetAll: 0 < b.length && "getAll" in _.objectStore(b[0]) && !(typeof navigator < "u" && /Safari/.test(navigator.userAgent) && !/(Chrome\/|Edge\/)/.test(navigator.userAgent) && [].concat(navigator.userAgent.match(/Safari\/(\d*)/))[1] < 604) }), C = k.schema, x = k.hasGetAll, k = C.tables.map(h), y = {};
      return k.forEach(function(P) {
        return y[P.name] = P;
      }), { stack: "dbcore", transaction: o.transaction.bind(o), table: function(P) {
        if (!y[P]) throw new Error("Table '".concat(P, "' not found"));
        return y[P];
      }, MIN_KEY: -1 / 0, MAX_KEY: Cr(a), schema: C };
    }
    function wd(o, a, c, u) {
      var h = c.IDBKeyRange;
      return c.indexedDB, { dbcore: (u = xd(a, h, u), o.dbcore.reduce(function(p, _) {
        return _ = _.create, r(r({}, p), _(p));
      }, u)) };
    }
    function xi(o, u) {
      var c = u.db, u = wd(o._middlewares, c, o._deps, u);
      o.core = u.dbcore, o.tables.forEach(function(h) {
        var p = h.name;
        o.core.schema.tables.some(function(_) {
          return _.name === p;
        }) && (h.core = o.core.table(p), o[p] instanceof o.Table && (o[p].core = h.core));
      });
    }
    function wi(o, a, c, u) {
      c.forEach(function(h) {
        var p = u[h];
        a.forEach(function(_) {
          var b = function C(x, k) {
            return se(x, k) || (x = m(x)) && C(x, k);
          }(_, h);
          (!b || "value" in b && b.value === void 0) && (_ === o.Transaction.prototype || _ instanceof o.Transaction ? H(_, h, { get: function() {
            return this.table(h);
          }, set: function(C) {
            B(this, h, { value: C, writable: !0, configurable: !0, enumerable: !0 });
          } }) : _[h] = new o.Table(h, p));
        });
      });
    }
    function Hn(o, a) {
      a.forEach(function(c) {
        for (var u in c) c[u] instanceof o.Table && delete c[u];
      });
    }
    function Cd(o, a) {
      return o._cfg.version - a._cfg.version;
    }
    function Ed(o, a, c, u) {
      var h = o._dbSchema;
      c.objectStoreNames.contains("$meta") && !h.$meta && (h.$meta = Bn("$meta", na("")[0], []), o._storeNames.push("$meta"));
      var p = o._createTransaction("readwrite", o._storeNames, h);
      p.create(c), p._completion.catch(u);
      var _ = p._reject.bind(p), b = U.transless || U;
      Ge(function() {
        return U.trans = p, U.transless = b, a !== 0 ? (xi(o, c), x = a, ((C = p).storeNames.includes("$meta") ? C.table("$meta").get("version").then(function(k) {
          return k ?? x;
        }) : V.resolve(x)).then(function(k) {
          return P = k, w = p, A = c, S = [], k = (y = o)._versions, E = y._dbSchema = Ei(0, y.idbdb, A), (k = k.filter(function(I) {
            return I._cfg.version >= P;
          })).length !== 0 ? (k.forEach(function(I) {
            S.push(function() {
              var T = E, O = I._cfg.dbschema;
              Ai(y, T, A), Ai(y, O, A), E = y._dbSchema = O;
              var R = Un(T, O);
              R.add.forEach(function(L) {
                jn(A, L[0], L[1].primKey, L[1].indexes);
              }), R.change.forEach(function(L) {
                if (L.recreate) throw new j.Upgrade("Not yet support for changing primary key");
                var $ = A.objectStore(L.name);
                L.add.forEach(function(q) {
                  return Ci($, q);
                }), L.change.forEach(function(q) {
                  $.deleteIndex(q.name), Ci($, q);
                }), L.del.forEach(function(q) {
                  return $.deleteIndex(q);
                });
              });
              var N = I._cfg.contentUpgrade;
              if (N && I._cfg.version > P) {
                xi(y, A), w._memoizedTables = {};
                var F = Rs(O);
                R.del.forEach(function(L) {
                  F[L] = T[L];
                }), Hn(y, [y.Transaction.prototype]), wi(y, [y.Transaction.prototype], l(F), F), w.schema = F;
                var D, M = wn(N);
                return M && Ht(), R = V.follow(function() {
                  var L;
                  (D = N(w)) && M && (L = Ye.bind(null, null), D.then(L, L));
                }), D && typeof D.then == "function" ? V.resolve(D) : R.then(function() {
                  return D;
                });
              }
            }), S.push(function(T) {
              var O, R, N = I._cfg.dbschema;
              O = N, R = T, [].slice.call(R.db.objectStoreNames).forEach(function(F) {
                return O[F] == null && R.db.deleteObjectStore(F);
              }), Hn(y, [y.Transaction.prototype]), wi(y, [y.Transaction.prototype], y._storeNames, y._dbSchema), w.schema = y._dbSchema;
            }), S.push(function(T) {
              y.idbdb.objectStoreNames.contains("$meta") && (Math.ceil(y.idbdb.version / 10) === I._cfg.version ? (y.idbdb.deleteObjectStore("$meta"), delete y._dbSchema.$meta, y._storeNames = y._storeNames.filter(function(O) {
                return O !== "$meta";
              })) : T.objectStore("$meta").put(I._cfg.version, "version"));
            });
          }), function I() {
            return S.length ? V.resolve(S.shift()(w.idbtrans)).then(I) : V.resolve();
          }().then(function() {
            ia(E, A);
          })) : V.resolve();
          var y, P, w, A, S, E;
        }).catch(_)) : (l(h).forEach(function(k) {
          jn(c, k, h[k].primKey, h[k].indexes);
        }), xi(o, c), void V.follow(function() {
          return o.on.populate.fire(p);
        }).catch(_));
        var C, x;
      });
    }
    function Ad(o, a) {
      ia(o._dbSchema, a), a.db.version % 10 != 0 || a.objectStoreNames.contains("$meta") || a.db.createObjectStore("$meta").add(Math.ceil(a.db.version / 10 - 1), "version");
      var c = Ei(0, o.idbdb, a);
      Ai(o, o._dbSchema, a);
      for (var u = 0, h = Un(c, o._dbSchema).change; u < h.length; u++) {
        var p = function(_) {
          if (_.change.length || _.recreate) return { value: void 0 };
          var b = a.objectStore(_.name);
          _.add.forEach(function(C) {
            Ci(b, C);
          });
        }(h[u]);
        if (typeof p == "object") return p.value;
      }
    }
    function Un(o, a) {
      var c, u = { del: [], add: [], change: [] };
      for (c in o) a[c] || u.del.push(c);
      for (c in a) {
        var h = o[c], p = a[c];
        if (h) {
          var _ = { name: c, def: p, recreate: !1, del: [], add: [], change: [] };
          if ("" + (h.primKey.keyPath || "") != "" + (p.primKey.keyPath || "") || h.primKey.auto !== p.primKey.auto) _.recreate = !0, u.change.push(_);
          else {
            var b = h.idxByName, C = p.idxByName, x = void 0;
            for (x in b) C[x] || _.del.push(x);
            for (x in C) {
              var k = b[x], y = C[x];
              k ? k.src !== y.src && _.change.push(y) : _.add.push(y);
            }
            (0 < _.del.length || 0 < _.add.length || 0 < _.change.length) && u.change.push(_);
          }
        } else u.add.push([c, p]);
      }
      return u;
    }
    function jn(o, a, c, u) {
      var h = o.db.createObjectStore(a, c.keyPath ? { keyPath: c.keyPath, autoIncrement: c.auto } : { autoIncrement: c.auto });
      return u.forEach(function(p) {
        return Ci(h, p);
      }), h;
    }
    function ia(o, a) {
      l(o).forEach(function(c) {
        a.db.objectStoreNames.contains(c) || jn(a, c, o[c].primKey, o[c].indexes);
      });
    }
    function Ci(o, a) {
      o.createIndex(a.name, a.keyPath, { unique: a.unique, multiEntry: a.multi });
    }
    function Ei(o, a, c) {
      var u = {};
      return re(a.objectStoreNames, 0).forEach(function(h) {
        for (var p = c.objectStore(h), _ = Ln(ta(x = p.keyPath), x || "", !0, !1, !!p.autoIncrement, x && typeof x != "string", !0), b = [], C = 0; C < p.indexNames.length; ++C) {
          var k = p.index(p.indexNames[C]), x = k.keyPath, k = Ln(k.name, x, !!k.unique, !!k.multiEntry, !1, x && typeof x != "string", !1);
          b.push(k);
        }
        u[h] = Bn(h, _, b);
      }), u;
    }
    function Ai(o, a, c) {
      for (var u = c.db.objectStoreNames, h = 0; h < u.length; ++h) {
        var p = u[h], _ = c.objectStore(p);
        o._hasGetAll = "getAll" in _;
        for (var b = 0; b < _.indexNames.length; ++b) {
          var C = _.indexNames[b], x = _.index(C).keyPath, k = typeof x == "string" ? x : "[" + re(x).join("+") + "]";
          !a[p] || (x = a[p].idxByName[k]) && (x.name = C, delete a[p].idxByName[k], a[p].idxByName[C] = x);
        }
      }
      typeof navigator < "u" && /Safari/.test(navigator.userAgent) && !/(Chrome\/|Edge\/)/.test(navigator.userAgent) && s.WorkerGlobalScope && s instanceof s.WorkerGlobalScope && [].concat(navigator.userAgent.match(/Safari\/(\d*)/))[1] < 604 && (o._hasGetAll = !1);
    }
    function na(o) {
      return o.split(",").map(function(a, c) {
        var u = (a = a.trim()).replace(/([&*]|\+\+)/g, ""), h = /^\[/.test(u) ? u.match(/^\[(.*)\]$/)[1].split("+") : u;
        return Ln(u, h || null, /\&/.test(a), /\*/.test(a), /\+\+/.test(a), d(h), c === 0);
      });
    }
    var kd = (ki.prototype._parseStoresSpec = function(o, a) {
      l(o).forEach(function(c) {
        if (o[c] !== null) {
          var u = na(o[c]), h = u.shift();
          if (h.unique = !0, h.multi) throw new j.Schema("Primary key cannot be multi-valued");
          u.forEach(function(p) {
            if (p.auto) throw new j.Schema("Only primary key can be marked as autoIncrement (++)");
            if (!p.keyPath) throw new j.Schema("Index must have a name and cannot be an empty string");
          }), a[c] = Bn(c, h, u);
        }
      });
    }, ki.prototype.stores = function(c) {
      var a = this.db;
      this._cfg.storesSource = this._cfg.storesSource ? f(this._cfg.storesSource, c) : c;
      var c = a._versions, u = {}, h = {};
      return c.forEach(function(p) {
        f(u, p._cfg.storesSource), h = p._cfg.dbschema = {}, p._parseStoresSpec(u, h);
      }), a._dbSchema = h, Hn(a, [a._allTables, a, a.Transaction.prototype]), wi(a, [a._allTables, a, a.Transaction.prototype, this._cfg.tables], l(h), h), a._storeNames = l(h), this;
    }, ki.prototype.upgrade = function(o) {
      return this._cfg.contentUpgrade = En(this._cfg.contentUpgrade || te, o), this;
    }, ki);
    function ki() {
    }
    function qn(o, a) {
      var c = o._dbNamesDB;
      return c || (c = o._dbNamesDB = new Ue(mi, { addons: [], indexedDB: o, IDBKeyRange: a })).version(1).stores({ dbnames: "name" }), c.table("dbnames");
    }
    function Kn(o) {
      return o && typeof o.databases == "function";
    }
    function Wn(o) {
      return Ge(function() {
        return U.letThrough = !0, o();
      });
    }
    function Gn(o) {
      return !("from" in o);
    }
    var Ee = function(o, a) {
      if (!this) {
        var c = new Ee();
        return o && "d" in o && f(c, o), c;
      }
      f(this, arguments.length ? { d: 1, from: o, to: 1 < arguments.length ? a : o } : { d: 0 });
    };
    function Ar(o, a, c) {
      var u = Z(a, c);
      if (!isNaN(u)) {
        if (0 < u) throw RangeError();
        if (Gn(o)) return f(o, { from: a, to: c, d: 1 });
        var h = o.l, u = o.r;
        if (Z(c, o.from) < 0) return h ? Ar(h, a, c) : o.l = { from: a, to: c, d: 1, l: null, r: null }, sa(o);
        if (0 < Z(a, o.to)) return u ? Ar(u, a, c) : o.r = { from: a, to: c, d: 1, l: null, r: null }, sa(o);
        Z(a, o.from) < 0 && (o.from = a, o.l = null, o.d = u ? u.d + 1 : 1), 0 < Z(c, o.to) && (o.to = c, o.r = null, o.d = o.l ? o.l.d + 1 : 1), c = !o.r, h && !o.l && kr(o, h), u && c && kr(o, u);
      }
    }
    function kr(o, a) {
      Gn(a) || function c(u, C) {
        var p = C.from, _ = C.to, b = C.l, C = C.r;
        Ar(u, p, _), b && c(u, b), C && c(u, C);
      }(o, a);
    }
    function oa(o, a) {
      var c = Pi(a), u = c.next();
      if (u.done) return !1;
      for (var h = u.value, p = Pi(o), _ = p.next(h.from), b = _.value; !u.done && !_.done; ) {
        if (Z(b.from, h.to) <= 0 && 0 <= Z(b.to, h.from)) return !0;
        Z(h.from, b.from) < 0 ? h = (u = c.next(b.from)).value : b = (_ = p.next(h.from)).value;
      }
      return !1;
    }
    function Pi(o) {
      var a = Gn(o) ? null : { s: 0, n: o };
      return { next: function(c) {
        for (var u = 0 < arguments.length; a; ) switch (a.s) {
          case 0:
            if (a.s = 1, u) for (; a.n.l && Z(c, a.n.from) < 0; ) a = { up: a, n: a.n.l, s: 1 };
            else for (; a.n.l; ) a = { up: a, n: a.n.l, s: 1 };
          case 1:
            if (a.s = 2, !u || Z(c, a.n.to) <= 0) return { value: a.n, done: !1 };
          case 2:
            if (a.n.r) {
              a.s = 3, a = { up: a, n: a.n.r, s: 0 };
              continue;
            }
          case 3:
            a = a.up;
        }
        return { done: !0 };
      } };
    }
    function sa(o) {
      var a, c, u = (((a = o.r) === null || a === void 0 ? void 0 : a.d) || 0) - (((c = o.l) === null || c === void 0 ? void 0 : c.d) || 0), h = 1 < u ? "r" : u < -1 ? "l" : "";
      h && (a = h == "r" ? "l" : "r", c = r({}, o), u = o[h], o.from = u.from, o.to = u.to, o[h] = u[h], c[h] = u[a], (o[a] = c).d = aa(c)), o.d = aa(o);
    }
    function aa(c) {
      var a = c.r, c = c.l;
      return (a ? c ? Math.max(a.d, c.d) : a.d : c ? c.d : 0) + 1;
    }
    function Si(o, a) {
      return l(a).forEach(function(c) {
        o[c] ? kr(o[c], a[c]) : o[c] = function u(h) {
          var p, _, b = {};
          for (p in h) v(h, p) && (_ = h[p], b[p] = !_ || typeof _ != "object" || Ns.has(_.constructor) ? _ : u(_));
          return b;
        }(a[c]);
      }), o;
    }
    function Yn(o, a) {
      return o.all || a.all || Object.keys(o).some(function(c) {
        return a[c] && oa(a[c], o[c]);
      });
    }
    z(Ee.prototype, ((ze = { add: function(o) {
      return kr(this, o), this;
    }, addKey: function(o) {
      return Ar(this, o, o), this;
    }, addKeys: function(o) {
      var a = this;
      return o.forEach(function(c) {
        return Ar(a, c, c);
      }), this;
    }, hasKey: function(o) {
      var a = Pi(this).next(o).value;
      return a && Z(a.from, o) <= 0 && 0 <= Z(a.to, o);
    } })[xn] = function() {
      return Pi(this);
    }, ze));
    var bt = {}, Zn = {}, Xn = !1;
    function Ii(o) {
      Si(Zn, o), Xn || (Xn = !0, setTimeout(function() {
        Xn = !1, Jn(Zn, !(Zn = {}));
      }, 0));
    }
    function Jn(o, a) {
      a === void 0 && (a = !1);
      var c = /* @__PURE__ */ new Set();
      if (o.all) for (var u = 0, h = Object.values(bt); u < h.length; u++) la(_ = h[u], o, c, a);
      else for (var p in o) {
        var _, b = /^idb\:\/\/(.*)\/(.*)\//.exec(p);
        b && (p = b[1], b = b[2], (_ = bt["idb://".concat(p, "/").concat(b)]) && la(_, o, c, a));
      }
      c.forEach(function(C) {
        return C();
      });
    }
    function la(o, a, c, u) {
      for (var h = [], p = 0, _ = Object.entries(o.queries.query); p < _.length; p++) {
        for (var b = _[p], C = b[0], x = [], k = 0, y = b[1]; k < y.length; k++) {
          var P = y[k];
          Yn(a, P.obsSet) ? P.subscribers.forEach(function(E) {
            return c.add(E);
          }) : u && x.push(P);
        }
        u && h.push([C, x]);
      }
      if (u) for (var w = 0, A = h; w < A.length; w++) {
        var S = A[w], C = S[0], x = S[1];
        o.queries.query[C] = x;
      }
    }
    function Pd(o) {
      var a = o._state, c = o._deps.indexedDB;
      if (a.isBeingOpened || o.idbdb) return a.dbReadyPromise.then(function() {
        return a.dbOpenError ? le(a.dbOpenError) : o;
      });
      a.isBeingOpened = !0, a.dbOpenError = null, a.openComplete = !1;
      var u = a.openCanceller, h = Math.round(10 * o.verno), p = !1;
      function _() {
        if (a.openCanceller !== u) throw new j.DatabaseClosed("db.open() was cancelled");
      }
      function b() {
        return new V(function(P, w) {
          if (_(), !c) throw new j.MissingAPI();
          var A = o.name, S = a.autoSchema || !h ? c.open(A) : c.open(A, h);
          if (!S) throw new j.MissingAPI();
          S.onerror = Me(w), S.onblocked = oe(o._fireOnBlocked), S.onupgradeneeded = oe(function(E) {
            var I;
            k = S.transaction, a.autoSchema && !o._options.allowEmptyDB ? (S.onerror = xr, k.abort(), S.result.close(), (I = c.deleteDatabase(A)).onsuccess = I.onerror = oe(function() {
              w(new j.NoSuchDatabase("Database ".concat(A, " doesnt exist")));
            })) : (k.onerror = Me(w), E = E.oldVersion > Math.pow(2, 62) ? 0 : E.oldVersion, y = E < 1, o.idbdb = S.result, p && Ad(o, k), Ed(o, E / 10, k, w));
          }, w), S.onsuccess = oe(function() {
            k = null;
            var E, I, T, O, R, N = o.idbdb = S.result, F = re(N.objectStoreNames);
            if (0 < F.length) try {
              var D = N.transaction((O = F).length === 1 ? O[0] : O, "readonly");
              if (a.autoSchema) I = N, T = D, (E = o).verno = I.version / 10, T = E._dbSchema = Ei(0, I, T), E._storeNames = re(I.objectStoreNames, 0), wi(E, [E._allTables], l(T), T);
              else if (Ai(o, o._dbSchema, D), ((R = Un(Ei(0, (R = o).idbdb, D), R._dbSchema)).add.length || R.change.some(function(M) {
                return M.add.length || M.change.length;
              })) && !p) return N.close(), h = N.version + 1, p = !0, P(b());
              xi(o, D);
            } catch {
            }
            Ut.push(o), N.onversionchange = oe(function(M) {
              a.vcFired = !0, o.on("versionchange").fire(M);
            }), N.onclose = oe(function(M) {
              o.on("close").fire(M);
            }), y && (R = o._deps, D = A, N = R.indexedDB, R = R.IDBKeyRange, Kn(N) || D === mi || qn(N, R).put({ name: D }).catch(te)), P();
          }, w);
        }).catch(function(P) {
          switch (P == null ? void 0 : P.name) {
            case "UnknownError":
              if (0 < a.PR1398_maxLoop) return a.PR1398_maxLoop--, b();
              break;
            case "VersionError":
              if (0 < h) return h = 0, b();
          }
          return V.reject(P);
        });
      }
      var C, x = a.dbReadyResolve, k = null, y = !1;
      return V.race([u, (typeof navigator > "u" ? V.resolve() : !navigator.userAgentData && /Safari\//.test(navigator.userAgent) && !/Chrom(e|ium)\//.test(navigator.userAgent) && indexedDB.databases ? new Promise(function(P) {
        function w() {
          return indexedDB.databases().finally(P);
        }
        C = setInterval(w, 100), w();
      }).finally(function() {
        return clearInterval(C);
      }) : Promise.resolve()).then(b)]).then(function() {
        return _(), a.onReadyBeingFired = [], V.resolve(Wn(function() {
          return o.on.ready.fire(o.vip);
        })).then(function P() {
          if (0 < a.onReadyBeingFired.length) {
            var w = a.onReadyBeingFired.reduce(En, te);
            return a.onReadyBeingFired = [], V.resolve(Wn(function() {
              return w(o.vip);
            })).then(P);
          }
        });
      }).finally(function() {
        a.openCanceller === u && (a.onReadyBeingFired = null, a.isBeingOpened = !1);
      }).catch(function(P) {
        a.dbOpenError = P;
        try {
          k && k.abort();
        } catch {
        }
        return u === a.openCanceller && o._close(), le(P);
      }).finally(function() {
        a.openComplete = !0, x();
      }).then(function() {
        var P;
        return y && (P = {}, o.tables.forEach(function(w) {
          w.schema.indexes.forEach(function(A) {
            A.name && (P["idb://".concat(o.name, "/").concat(w.name, "/").concat(A.name)] = new Ee(-1 / 0, [[[]]]));
          }), P["idb://".concat(o.name, "/").concat(w.name, "/")] = P["idb://".concat(o.name, "/").concat(w.name, "/:dels")] = new Ee(-1 / 0, [[[]]]);
        }), Je(wr).fire(P), Jn(P, !0)), o;
      });
    }
    function Qn(o) {
      function a(p) {
        return o.next(p);
      }
      var c = h(a), u = h(function(p) {
        return o.throw(p);
      });
      function h(p) {
        return function(C) {
          var b = p(C), C = b.value;
          return b.done ? C : C && typeof C.then == "function" ? C.then(c, u) : d(C) ? Promise.all(C).then(c, u) : c(C);
        };
      }
      return h(a)();
    }
    function Ti(o, a, c) {
      for (var u = d(o) ? o.slice() : [o], h = 0; h < c; ++h) u.push(a);
      return u;
    }
    var Sd = { stack: "dbcore", name: "VirtualIndexMiddleware", level: 1, create: function(o) {
      return r(r({}, o), { table: function(a) {
        var c = o.table(a), u = c.schema, h = {}, p = [];
        function _(y, P, w) {
          var A = Er(y), S = h[A] = h[A] || [], E = y == null ? 0 : typeof y == "string" ? 1 : y.length, I = 0 < P, I = r(r({}, w), { name: I ? "".concat(A, "(virtual-from:").concat(w.name, ")") : w.name, lowLevelIndex: w, isVirtual: I, keyTail: P, keyLength: E, extractKey: Vn(y), unique: !I && w.unique });
          return S.push(I), I.isPrimaryKey || p.push(I), 1 < E && _(E === 2 ? y[0] : y.slice(0, E - 1), P + 1, w), S.sort(function(T, O) {
            return T.keyTail - O.keyTail;
          }), I;
        }
        a = _(u.primaryKey.keyPath, 0, u.primaryKey), h[":id"] = [a];
        for (var b = 0, C = u.indexes; b < C.length; b++) {
          var x = C[b];
          _(x.keyPath, 0, x);
        }
        function k(y) {
          var P, w = y.query.index;
          return w.isVirtual ? r(r({}, y), { query: { index: w.lowLevelIndex, range: (P = y.query.range, w = w.keyTail, { type: P.type === 1 ? 2 : P.type, lower: Ti(P.lower, P.lowerOpen ? o.MAX_KEY : o.MIN_KEY, w), lowerOpen: !0, upper: Ti(P.upper, P.upperOpen ? o.MIN_KEY : o.MAX_KEY, w), upperOpen: !0 }) } }) : y;
        }
        return r(r({}, c), { schema: r(r({}, u), { primaryKey: a, indexes: p, getIndexByKeyPath: function(y) {
          return (y = h[Er(y)]) && y[0];
        } }), count: function(y) {
          return c.count(k(y));
        }, query: function(y) {
          return c.query(k(y));
        }, openCursor: function(y) {
          var P = y.query.index, w = P.keyTail, A = P.isVirtual, S = P.keyLength;
          return A ? c.openCursor(k(y)).then(function(I) {
            return I && E(I);
          }) : c.openCursor(y);
          function E(I) {
            return Object.create(I, { continue: { value: function(T) {
              T != null ? I.continue(Ti(T, y.reverse ? o.MAX_KEY : o.MIN_KEY, w)) : y.unique ? I.continue(I.key.slice(0, S).concat(y.reverse ? o.MIN_KEY : o.MAX_KEY, w)) : I.continue();
            } }, continuePrimaryKey: { value: function(T, O) {
              I.continuePrimaryKey(Ti(T, o.MAX_KEY, w), O);
            } }, primaryKey: { get: function() {
              return I.primaryKey;
            } }, key: { get: function() {
              var T = I.key;
              return S === 1 ? T[0] : T.slice(0, S);
            } }, value: { get: function() {
              return I.value;
            } } });
          }
        } });
      } });
    } };
    function eo(o, a, c, u) {
      return c = c || {}, u = u || "", l(o).forEach(function(h) {
        var p, _, b;
        v(a, h) ? (p = o[h], _ = a[h], typeof p == "object" && typeof _ == "object" && p && _ ? (b = yn(p)) !== yn(_) ? c[u + h] = a[h] : b === "Object" ? eo(p, _, c, u + h + ".") : p !== _ && (c[u + h] = a[h]) : p !== _ && (c[u + h] = a[h])) : c[u + h] = void 0;
      }), l(a).forEach(function(h) {
        v(o, h) || (c[u + h] = a[h]);
      }), c;
    }
    function to(o, a) {
      return a.type === "delete" ? a.keys : a.keys || a.values.map(o.extractKey);
    }
    var Id = { stack: "dbcore", name: "HooksMiddleware", level: 2, create: function(o) {
      return r(r({}, o), { table: function(a) {
        var c = o.table(a), u = c.schema.primaryKey;
        return r(r({}, c), { mutate: function(h) {
          var p = U.trans, _ = p.table(a).hook, b = _.deleting, C = _.creating, x = _.updating;
          switch (h.type) {
            case "add":
              if (C.fire === te) break;
              return p._promise("readwrite", function() {
                return k(h);
              }, !0);
            case "put":
              if (C.fire === te && x.fire === te) break;
              return p._promise("readwrite", function() {
                return k(h);
              }, !0);
            case "delete":
              if (b.fire === te) break;
              return p._promise("readwrite", function() {
                return k(h);
              }, !0);
            case "deleteRange":
              if (b.fire === te) break;
              return p._promise("readwrite", function() {
                return function y(P, w, A) {
                  return c.query({ trans: P, values: !1, query: { index: u, range: w }, limit: A }).then(function(S) {
                    var E = S.result;
                    return k({ type: "delete", keys: E, trans: P }).then(function(I) {
                      return 0 < I.numFailures ? Promise.reject(I.failures[0]) : E.length < A ? { failures: [], numFailures: 0, lastResult: void 0 } : y(P, r(r({}, w), { lower: E[E.length - 1], lowerOpen: !0 }), A);
                    });
                  });
                }(h.trans, h.range, 1e4);
              }, !0);
          }
          return c.mutate(h);
          function k(y) {
            var P, w, A, S = U.trans, E = y.keys || to(u, y);
            if (!E) throw new Error("Keys missing");
            return (y = y.type === "add" || y.type === "put" ? r(r({}, y), { keys: E }) : r({}, y)).type !== "delete" && (y.values = i([], y.values)), y.keys && (y.keys = i([], y.keys)), P = c, A = E, ((w = y).type === "add" ? Promise.resolve([]) : P.getMany({ trans: w.trans, keys: A, cache: "immutable" })).then(function(I) {
              var T = E.map(function(O, R) {
                var N, F, D, M = I[R], L = { onerror: null, onsuccess: null };
                return y.type === "delete" ? b.fire.call(L, O, M, S) : y.type === "add" || M === void 0 ? (N = C.fire.call(L, O, y.values[R], S), O == null && N != null && (y.keys[R] = O = N, u.outbound || Ce(y.values[R], u.keyPath, O))) : (N = eo(M, y.values[R]), (F = x.fire.call(L, N, O, M, S)) && (D = y.values[R], Object.keys(F).forEach(function($) {
                  v(D, $) ? D[$] = F[$] : Ce(D, $, F[$]);
                }))), L;
              });
              return c.mutate(y).then(function(O) {
                for (var R = O.failures, N = O.results, F = O.numFailures, O = O.lastResult, D = 0; D < E.length; ++D) {
                  var M = (N || E)[D], L = T[D];
                  M == null ? L.onerror && L.onerror(R[D]) : L.onsuccess && L.onsuccess(y.type === "put" && I[D] ? y.values[D] : M);
                }
                return { failures: R, results: N, numFailures: F, lastResult: O };
              }).catch(function(O) {
                return T.forEach(function(R) {
                  return R.onerror && R.onerror(O);
                }), Promise.reject(O);
              });
            });
          }
        } });
      } });
    } };
    function ca(o, a, c) {
      try {
        if (!a || a.keys.length < o.length) return null;
        for (var u = [], h = 0, p = 0; h < a.keys.length && p < o.length; ++h) Z(a.keys[h], o[p]) === 0 && (u.push(c ? dt(a.values[h]) : a.values[h]), ++p);
        return u.length === o.length ? u : null;
      } catch {
        return null;
      }
    }
    var Td = { stack: "dbcore", level: -1, create: function(o) {
      return { table: function(a) {
        var c = o.table(a);
        return r(r({}, c), { getMany: function(u) {
          if (!u.cache) return c.getMany(u);
          var h = ca(u.keys, u.trans._cache, u.cache === "clone");
          return h ? V.resolve(h) : c.getMany(u).then(function(p) {
            return u.trans._cache = { keys: u.keys, values: u.cache === "clone" ? dt(p) : p }, p;
          });
        }, mutate: function(u) {
          return u.type !== "add" && (u.trans._cache = null), c.mutate(u);
        } });
      } };
    } };
    function da(o, a) {
      return o.trans.mode === "readonly" && !!o.subscr && !o.trans.explicit && o.trans.db._options.cache !== "disabled" && !a.schema.primaryKey.outbound;
    }
    function ua(o, a) {
      switch (o) {
        case "query":
          return a.values && !a.unique;
        case "get":
        case "getMany":
        case "count":
        case "openCursor":
          return !1;
      }
    }
    var Od = { stack: "dbcore", level: 0, name: "Observability", create: function(o) {
      var a = o.schema.name, c = new Ee(o.MIN_KEY, o.MAX_KEY);
      return r(r({}, o), { transaction: function(u, h, p) {
        if (U.subscr && h !== "readonly") throw new j.ReadOnly("Readwrite transaction in liveQuery context. Querier source: ".concat(U.querier));
        return o.transaction(u, h, p);
      }, table: function(u) {
        var h = o.table(u), p = h.schema, _ = p.primaryKey, y = p.indexes, b = _.extractKey, C = _.outbound, x = _.autoIncrement && y.filter(function(w) {
          return w.compound && w.keyPath.includes(_.keyPath);
        }), k = r(r({}, h), { mutate: function(w) {
          function A($) {
            return $ = "idb://".concat(a, "/").concat(u, "/").concat($), O[$] || (O[$] = new Ee());
          }
          var S, E, I, T = w.trans, O = w.mutatedParts || (w.mutatedParts = {}), R = A(""), N = A(":dels"), F = w.type, L = w.type === "deleteRange" ? [w.range] : w.type === "delete" ? [w.keys] : w.values.length < 50 ? [to(_, w).filter(function($) {
            return $;
          }), w.values] : [], D = L[0], M = L[1], L = w.trans._cache;
          return d(D) ? (R.addKeys(D), (L = F === "delete" || D.length === M.length ? ca(D, L) : null) || N.addKeys(D), (L || M) && (S = A, E = L, I = M, p.indexes.forEach(function($) {
            var q = S($.name || "");
            function K(W) {
              return W != null ? $.extractKey(W) : null;
            }
            function Y(W) {
              return $.multiEntry && d(W) ? W.forEach(function(Re) {
                return q.addKey(Re);
              }) : q.addKey(W);
            }
            (E || I).forEach(function(W, be) {
              var G = E && K(E[be]), be = I && K(I[be]);
              Z(G, be) !== 0 && (G != null && Y(G), be != null && Y(be));
            });
          }))) : D ? (M = { from: D.lower, to: D.upper }, N.add(M), R.add(M)) : (R.add(c), N.add(c), p.indexes.forEach(function($) {
            return A($.name).add(c);
          })), h.mutate(w).then(function($) {
            return !D || w.type !== "add" && w.type !== "put" || (R.addKeys($.results), x && x.forEach(function(q) {
              var K = w.values.map(function(W) {
                return q.extractKey(W);
              }), Y = q.keyPath.findIndex(function(W) {
                return W === _.keyPath;
              });
              $.results.forEach(function(W) {
                return K[Y] = W;
              }), A(q.name).addKeys(K);
            })), T.mutatedParts = Si(T.mutatedParts || {}, O), $;
          });
        } }), y = function(A) {
          var S = A.query, A = S.index, S = S.range;
          return [A, new Ee((A = S.lower) !== null && A !== void 0 ? A : o.MIN_KEY, (S = S.upper) !== null && S !== void 0 ? S : o.MAX_KEY)];
        }, P = { get: function(w) {
          return [_, new Ee(w.key)];
        }, getMany: function(w) {
          return [_, new Ee().addKeys(w.keys)];
        }, count: y, query: y, openCursor: y };
        return l(P).forEach(function(w) {
          k[w] = function(A) {
            var S = U.subscr, E = !!S, I = da(U, h) && ua(w, A) ? A.obsSet = {} : S;
            if (E) {
              var T = function(M) {
                return M = "idb://".concat(a, "/").concat(u, "/").concat(M), I[M] || (I[M] = new Ee());
              }, O = T(""), R = T(":dels"), S = P[w](A), E = S[0], S = S[1];
              if ((w === "query" && E.isPrimaryKey && !A.values ? R : T(E.name || "")).add(S), !E.isPrimaryKey) {
                if (w !== "count") {
                  var N = w === "query" && C && A.values && h.query(r(r({}, A), { values: !1 }));
                  return h[w].apply(this, arguments).then(function(M) {
                    if (w === "query") {
                      if (C && A.values) return N.then(function(K) {
                        return K = K.result, O.addKeys(K), M;
                      });
                      var L = A.values ? M.result.map(b) : M.result;
                      (A.values ? O : R).addKeys(L);
                    } else if (w === "openCursor") {
                      var $ = M, q = A.values;
                      return $ && Object.create($, { key: { get: function() {
                        return R.addKey($.primaryKey), $.key;
                      } }, primaryKey: { get: function() {
                        var K = $.primaryKey;
                        return R.addKey(K), K;
                      } }, value: { get: function() {
                        return q && O.addKey($.primaryKey), $.value;
                      } } });
                    }
                    return M;
                  });
                }
                R.add(c);
              }
            }
            return h[w].apply(this, arguments);
          };
        }), k;
      } });
    } };
    function ha(o, a, c) {
      if (c.numFailures === 0) return a;
      if (a.type === "deleteRange") return null;
      var u = a.keys ? a.keys.length : "values" in a && a.values ? a.values.length : 1;
      return c.numFailures === u ? null : (a = r({}, a), d(a.keys) && (a.keys = a.keys.filter(function(h, p) {
        return !(p in c.failures);
      })), "values" in a && d(a.values) && (a.values = a.values.filter(function(h, p) {
        return !(p in c.failures);
      })), a);
    }
    function ro(o, a) {
      return c = o, ((u = a).lower === void 0 || (u.lowerOpen ? 0 < Z(c, u.lower) : 0 <= Z(c, u.lower))) && (o = o, (a = a).upper === void 0 || (a.upperOpen ? Z(o, a.upper) < 0 : Z(o, a.upper) <= 0));
      var c, u;
    }
    function fa(o, a, P, u, h, p) {
      if (!P || P.length === 0) return o;
      var _ = a.query.index, b = _.multiEntry, C = a.query.range, x = u.schema.primaryKey.extractKey, k = _.extractKey, y = (_.lowLevelIndex || _).extractKey, P = P.reduce(function(w, A) {
        var S = w, E = [];
        if (A.type === "add" || A.type === "put") for (var I = new Ee(), T = A.values.length - 1; 0 <= T; --T) {
          var O, R = A.values[T], N = x(R);
          I.hasKey(N) || (O = k(R), (b && d(O) ? O.some(function(L) {
            return ro(L, C);
          }) : ro(O, C)) && (I.addKey(N), E.push(R)));
        }
        switch (A.type) {
          case "add":
            S = w.concat(a.values ? E : E.map(function($) {
              return x($);
            }));
            break;
          case "put":
            var F = new Ee().addKeys(A.values.map(function($) {
              return x($);
            })), S = w.filter(function($) {
              return !F.hasKey(a.values ? x($) : $);
            }).concat(a.values ? E : E.map(function($) {
              return x($);
            }));
            break;
          case "delete":
            var D = new Ee().addKeys(A.keys);
            S = w.filter(function($) {
              return !D.hasKey(a.values ? x($) : $);
            });
            break;
          case "deleteRange":
            var M = A.range;
            S = w.filter(function($) {
              return !ro(x($), M);
            });
        }
        return S;
      }, o);
      return P === o ? o : (P.sort(function(w, A) {
        return Z(y(w), y(A)) || Z(x(w), x(A));
      }), a.limit && a.limit < 1 / 0 && (P.length > a.limit ? P.length = a.limit : o.length === a.limit && P.length < a.limit && (h.dirty = !0)), p ? Object.freeze(P) : P);
    }
    function pa(o, a) {
      return Z(o.lower, a.lower) === 0 && Z(o.upper, a.upper) === 0 && !!o.lowerOpen == !!a.lowerOpen && !!o.upperOpen == !!a.upperOpen;
    }
    function zd(o, a) {
      return function(c, u, h, p) {
        if (c === void 0) return u !== void 0 ? -1 : 0;
        if (u === void 0) return 1;
        if ((u = Z(c, u)) === 0) {
          if (h && p) return 0;
          if (h) return 1;
          if (p) return -1;
        }
        return u;
      }(o.lower, a.lower, o.lowerOpen, a.lowerOpen) <= 0 && 0 <= function(c, u, h, p) {
        if (c === void 0) return u !== void 0 ? 1 : 0;
        if (u === void 0) return -1;
        if ((u = Z(c, u)) === 0) {
          if (h && p) return 0;
          if (h) return -1;
          if (p) return 1;
        }
        return u;
      }(o.upper, a.upper, o.upperOpen, a.upperOpen);
    }
    function Rd(o, a, c, u) {
      o.subscribers.add(c), u.addEventListener("abort", function() {
        var h, p;
        o.subscribers.delete(c), o.subscribers.size === 0 && (h = o, p = a, setTimeout(function() {
          h.subscribers.size === 0 && ut(p, h);
        }, 3e3));
      });
    }
    var $d = { stack: "dbcore", level: 0, name: "Cache", create: function(o) {
      var a = o.schema.name;
      return r(r({}, o), { transaction: function(c, u, h) {
        var p, _, b = o.transaction(c, u, h);
        return u === "readwrite" && (_ = (p = new AbortController()).signal, h = function(C) {
          return function() {
            if (p.abort(), u === "readwrite") {
              for (var x = /* @__PURE__ */ new Set(), k = 0, y = c; k < y.length; k++) {
                var P = y[k], w = bt["idb://".concat(a, "/").concat(P)];
                if (w) {
                  var A = o.table(P), S = w.optimisticOps.filter(function(q) {
                    return q.trans === b;
                  });
                  if (b._explicit && C && b.mutatedParts) for (var E = 0, I = Object.values(w.queries.query); E < I.length; E++) for (var T = 0, O = (F = I[E]).slice(); T < O.length; T++) Yn((D = O[T]).obsSet, b.mutatedParts) && (ut(F, D), D.subscribers.forEach(function(q) {
                    return x.add(q);
                  }));
                  else if (0 < S.length) {
                    w.optimisticOps = w.optimisticOps.filter(function(q) {
                      return q.trans !== b;
                    });
                    for (var R = 0, N = Object.values(w.queries.query); R < N.length; R++) for (var F, D, M, L = 0, $ = (F = N[R]).slice(); L < $.length; L++) (D = $[L]).res != null && b.mutatedParts && (C && !D.dirty ? (M = Object.isFrozen(D.res), M = fa(D.res, D.req, S, A, D, M), D.dirty ? (ut(F, D), D.subscribers.forEach(function(q) {
                      return x.add(q);
                    })) : M !== D.res && (D.res = M, D.promise = V.resolve({ result: M }))) : (D.dirty && ut(F, D), D.subscribers.forEach(function(q) {
                      return x.add(q);
                    })));
                  }
                }
              }
              x.forEach(function(q) {
                return q();
              });
            }
          };
        }, b.addEventListener("abort", h(!1), { signal: _ }), b.addEventListener("error", h(!1), { signal: _ }), b.addEventListener("complete", h(!0), { signal: _ })), b;
      }, table: function(c) {
        var u = o.table(c), h = u.schema.primaryKey;
        return r(r({}, u), { mutate: function(p) {
          var _ = U.trans;
          if (h.outbound || _.db._options.cache === "disabled" || _.explicit) return u.mutate(p);
          var b = bt["idb://".concat(a, "/").concat(c)];
          return b ? (_ = u.mutate(p), p.type !== "add" && p.type !== "put" || !(50 <= p.values.length || to(h, p).some(function(C) {
            return C == null;
          })) ? (b.optimisticOps.push(p), p.mutatedParts && Ii(p.mutatedParts), _.then(function(C) {
            0 < C.numFailures && (ut(b.optimisticOps, p), (C = ha(0, p, C)) && b.optimisticOps.push(C), p.mutatedParts && Ii(p.mutatedParts));
          }), _.catch(function() {
            ut(b.optimisticOps, p), p.mutatedParts && Ii(p.mutatedParts);
          })) : _.then(function(C) {
            var x = ha(0, r(r({}, p), { values: p.values.map(function(w, y) {
              var P, w = (P = h.keyPath) !== null && P !== void 0 && P.includes(".") ? dt(w) : r({}, w);
              return Ce(w, h.keyPath, C.results[y]), w;
            }) }), C);
            b.optimisticOps.push(x), queueMicrotask(function() {
              return p.mutatedParts && Ii(p.mutatedParts);
            });
          }), _) : u.mutate(p);
        }, query: function(p) {
          if (!da(U, u) || !ua("query", p)) return u.query(p);
          var _ = ((x = U.trans) === null || x === void 0 ? void 0 : x.db._options.cache) === "immutable", y = U, b = y.requery, C = y.signal, x = function(A, S, E, I) {
            var T = bt["idb://".concat(A, "/").concat(S)];
            if (!T) return [];
            if (!(S = T.queries[E])) return [null, !1, T, null];
            var O = S[(I.query ? I.query.index.name : null) || ""];
            if (!O) return [null, !1, T, null];
            switch (E) {
              case "query":
                var R = O.find(function(N) {
                  return N.req.limit === I.limit && N.req.values === I.values && pa(N.req.query.range, I.query.range);
                });
                return R ? [R, !0, T, O] : [O.find(function(N) {
                  return ("limit" in N.req ? N.req.limit : 1 / 0) >= I.limit && (!I.values || N.req.values) && zd(N.req.query.range, I.query.range);
                }), !1, T, O];
              case "count":
                return R = O.find(function(N) {
                  return pa(N.req.query.range, I.query.range);
                }), [R, !!R, T, O];
            }
          }(a, c, "query", p), k = x[0], y = x[1], P = x[2], w = x[3];
          return k && y ? k.obsSet = p.obsSet : (y = u.query(p).then(function(A) {
            var S = A.result;
            if (k && (k.res = S), _) {
              for (var E = 0, I = S.length; E < I; ++E) Object.freeze(S[E]);
              Object.freeze(S);
            } else A.result = dt(S);
            return A;
          }).catch(function(A) {
            return w && k && ut(w, k), Promise.reject(A);
          }), k = { obsSet: p.obsSet, promise: y, subscribers: /* @__PURE__ */ new Set(), type: "query", req: p, dirty: !1 }, w ? w.push(k) : (w = [k], (P = P || (bt["idb://".concat(a, "/").concat(c)] = { queries: { query: {}, count: {} }, objs: /* @__PURE__ */ new Map(), optimisticOps: [], unsignaledParts: {} })).queries.query[p.query.index.name || ""] = w)), Rd(k, w, b, C), k.promise.then(function(A) {
            return { result: fa(A.result, p, P == null ? void 0 : P.optimisticOps, u, k, _) };
          });
        } });
      } });
    } };
    function Oi(o, a) {
      return new Proxy(o, { get: function(c, u, h) {
        return u === "db" ? a : Reflect.get(c, u, h);
      } });
    }
    var Ue = (ce.prototype.version = function(o) {
      if (isNaN(o) || o < 0.1) throw new j.Type("Given version is not a positive number");
      if (o = Math.round(10 * o) / 10, this.idbdb || this._state.isBeingOpened) throw new j.Schema("Cannot add version when database is open");
      this.verno = Math.max(this.verno, o);
      var a = this._versions, c = a.filter(function(u) {
        return u._cfg.version === o;
      })[0];
      return c || (c = new this.Version(o), a.push(c), a.sort(Cd), c.stores({}), this._state.autoSchema = !1, c);
    }, ce.prototype._whenReady = function(o) {
      var a = this;
      return this.idbdb && (this._state.openComplete || U.letThrough || this._vip) ? o() : new V(function(c, u) {
        if (a._state.openComplete) return u(new j.DatabaseClosed(a._state.dbOpenError));
        if (!a._state.isBeingOpened) {
          if (!a._state.autoOpen) return void u(new j.DatabaseClosed());
          a.open().catch(te);
        }
        a._state.dbReadyPromise.then(c, u);
      }).then(o);
    }, ce.prototype.use = function(o) {
      var a = o.stack, c = o.create, u = o.level, h = o.name;
      return h && this.unuse({ stack: a, name: h }), o = this._middlewares[a] || (this._middlewares[a] = []), o.push({ stack: a, create: c, level: u ?? 10, name: h }), o.sort(function(p, _) {
        return p.level - _.level;
      }), this;
    }, ce.prototype.unuse = function(o) {
      var a = o.stack, c = o.name, u = o.create;
      return a && this._middlewares[a] && (this._middlewares[a] = this._middlewares[a].filter(function(h) {
        return u ? h.create !== u : !!c && h.name !== c;
      })), this;
    }, ce.prototype.open = function() {
      var o = this;
      return _t(We, function() {
        return Pd(o);
      });
    }, ce.prototype._close = function() {
      var o = this._state, a = Ut.indexOf(this);
      if (0 <= a && Ut.splice(a, 1), this.idbdb) {
        try {
          this.idbdb.close();
        } catch {
        }
        this.idbdb = null;
      }
      o.isBeingOpened || (o.dbReadyPromise = new V(function(c) {
        o.dbReadyResolve = c;
      }), o.openCanceller = new V(function(c, u) {
        o.cancelOpen = u;
      }));
    }, ce.prototype.close = function(c) {
      var a = (c === void 0 ? { disableAutoOpen: !0 } : c).disableAutoOpen, c = this._state;
      a ? (c.isBeingOpened && c.cancelOpen(new j.DatabaseClosed()), this._close(), c.autoOpen = !1, c.dbOpenError = new j.DatabaseClosed()) : (this._close(), c.autoOpen = this._options.autoOpen || c.isBeingOpened, c.openComplete = !1, c.dbOpenError = null);
    }, ce.prototype.delete = function(o) {
      var a = this;
      o === void 0 && (o = { disableAutoOpen: !0 });
      var c = 0 < arguments.length && typeof arguments[0] != "object", u = this._state;
      return new V(function(h, p) {
        function _() {
          a.close(o);
          var b = a._deps.indexedDB.deleteDatabase(a.name);
          b.onsuccess = oe(function() {
            var C, x, k;
            C = a._deps, x = a.name, k = C.indexedDB, C = C.IDBKeyRange, Kn(k) || x === mi || qn(k, C).delete(x).catch(te), h();
          }), b.onerror = Me(p), b.onblocked = a._fireOnBlocked;
        }
        if (c) throw new j.InvalidArgument("Invalid closeOptions argument to db.delete()");
        u.isBeingOpened ? u.dbReadyPromise.then(_) : _();
      });
    }, ce.prototype.backendDB = function() {
      return this.idbdb;
    }, ce.prototype.isOpen = function() {
      return this.idbdb !== null;
    }, ce.prototype.hasBeenClosed = function() {
      var o = this._state.dbOpenError;
      return o && o.name === "DatabaseClosed";
    }, ce.prototype.hasFailed = function() {
      return this._state.dbOpenError !== null;
    }, ce.prototype.dynamicallyOpened = function() {
      return this._state.autoSchema;
    }, Object.defineProperty(ce.prototype, "tables", { get: function() {
      var o = this;
      return l(this._allTables).map(function(a) {
        return o._allTables[a];
      });
    }, enumerable: !1, configurable: !0 }), ce.prototype.transaction = function() {
      var o = (function(a, c, u) {
        var h = arguments.length;
        if (h < 2) throw new j.InvalidArgument("Too few arguments");
        for (var p = new Array(h - 1); --h; ) p[h - 1] = arguments[h];
        return u = p.pop(), [a, $s(p), u];
      }).apply(this, arguments);
      return this._transaction.apply(this, o);
    }, ce.prototype._transaction = function(o, a, c) {
      var u = this, h = U.trans;
      h && h.db === this && o.indexOf("!") === -1 || (h = null);
      var p, _, b = o.indexOf("?") !== -1;
      o = o.replace("!", "").replace("?", "");
      try {
        if (_ = a.map(function(x) {
          if (x = x instanceof u.Table ? x.name : x, typeof x != "string") throw new TypeError("Invalid table argument to Dexie.transaction(). Only Table or String are allowed");
          return x;
        }), o == "r" || o === Rn) p = Rn;
        else {
          if (o != "rw" && o != $n) throw new j.InvalidArgument("Invalid transaction mode: " + o);
          p = $n;
        }
        if (h) {
          if (h.mode === Rn && p === $n) {
            if (!b) throw new j.SubTransaction("Cannot enter a sub-transaction with READWRITE mode when parent transaction is READONLY");
            h = null;
          }
          h && _.forEach(function(x) {
            if (h && h.storeNames.indexOf(x) === -1) {
              if (!b) throw new j.SubTransaction("Table " + x + " not included in parent transaction.");
              h = null;
            }
          }), b && h && !h.active && (h = null);
        }
      } catch (x) {
        return h ? h._promise(null, function(k, y) {
          y(x);
        }) : le(x);
      }
      var C = (function x(k, y, P, w, A) {
        return V.resolve().then(function() {
          var S = U.transless || U, E = k._createTransaction(y, P, k._dbSchema, w);
          if (E.explicit = !0, S = { trans: E, transless: S }, w) E.idbtrans = w.idbtrans;
          else try {
            E.create(), E.idbtrans._explicit = !0, k._state.PR1398_maxLoop = 3;
          } catch (O) {
            return O.name === Cn.InvalidState && k.isOpen() && 0 < --k._state.PR1398_maxLoop ? (k.close({ disableAutoOpen: !1 }), k.open().then(function() {
              return x(k, y, P, null, A);
            })) : le(O);
          }
          var I, T = wn(A);
          return T && Ht(), S = V.follow(function() {
            var O;
            (I = A.call(E, E)) && (T ? (O = Ye.bind(null, null), I.then(O, O)) : typeof I.next == "function" && typeof I.throw == "function" && (I = Qn(I)));
          }, S), (I && typeof I.then == "function" ? V.resolve(I).then(function(O) {
            return E.active ? O : le(new j.PrematureCommit("Transaction committed too early. See http://bit.ly/2kdckMn"));
          }) : S.then(function() {
            return I;
          })).then(function(O) {
            return w && E._resolve(), E._completion.then(function() {
              return O;
            });
          }).catch(function(O) {
            return E._reject(O), le(O);
          });
        });
      }).bind(null, this, p, _, h, c);
      return h ? h._promise(p, C, "lock") : U.trans ? _t(U.transless, function() {
        return u._whenReady(C);
      }) : this._whenReady(C);
    }, ce.prototype.table = function(o) {
      if (!v(this._allTables, o)) throw new j.InvalidTable("Table ".concat(o, " does not exist"));
      return this._allTables[o];
    }, ce);
    function ce(o, a) {
      var c = this;
      this._middlewares = {}, this.verno = 0;
      var u = ce.dependencies;
      this._options = a = r({ addons: ce.addons, autoOpen: !0, indexedDB: u.indexedDB, IDBKeyRange: u.IDBKeyRange, cache: "cloned" }, a), this._deps = { indexedDB: a.indexedDB, IDBKeyRange: a.IDBKeyRange }, u = a.addons, this._dbSchema = {}, this._versions = [], this._storeNames = [], this._allTables = {}, this.idbdb = null, this._novip = this;
      var h, p, _, b, C, x = { dbOpenError: null, isBeingOpened: !1, onReadyBeingFired: null, openComplete: !1, dbReadyResolve: te, dbReadyPromise: null, cancelOpen: te, openCanceller: null, autoSchema: !0, PR1398_maxLoop: 3, autoOpen: a.autoOpen };
      x.dbReadyPromise = new V(function(y) {
        x.dbReadyResolve = y;
      }), x.openCanceller = new V(function(y, P) {
        x.cancelOpen = P;
      }), this._state = x, this.name = o, this.on = br(this, "populate", "blocked", "versionchange", "close", { ready: [En, te] }), this.on.ready.subscribe = Oe(this.on.ready.subscribe, function(y) {
        return function(P, w) {
          ce.vip(function() {
            var A, S = c._state;
            S.openComplete ? (S.dbOpenError || V.resolve().then(P), w && y(P)) : S.onReadyBeingFired ? (S.onReadyBeingFired.push(P), w && y(P)) : (y(P), A = c, w || y(function E() {
              A.on.ready.unsubscribe(P), A.on.ready.unsubscribe(E);
            }));
          });
        };
      }), this.Collection = (h = this, vr(md.prototype, function(I, E) {
        this.db = h;
        var w = qs, A = null;
        if (E) try {
          w = E();
        } catch (T) {
          A = T;
        }
        var S = I._ctx, E = S.table, I = E.hook.reading.fire;
        this._ctx = { table: E, index: S.index, isPrimKey: !S.index || E.schema.primKey.keyPath && S.index === E.schema.primKey.name, range: w, keysOnly: !1, dir: "next", unique: "", algorithm: null, filter: null, replayFilter: null, justLimit: !0, isMatch: null, offset: 0, limit: 1 / 0, error: A, or: S.or, valueMapper: I !== hr ? I : null };
      })), this.Table = (p = this, vr(Ys.prototype, function(y, P, w) {
        this.db = p, this._tx = w, this.name = y, this.schema = P, this.hook = p._allTables[y] ? p._allTables[y].hook : br(null, { creating: [ad, te], reading: [sd, hr], updating: [cd, te], deleting: [ld, te] });
      })), this.Transaction = (_ = this, vr(vd.prototype, function(y, P, w, A, S) {
        var E = this;
        this.db = _, this.mode = y, this.storeNames = P, this.schema = w, this.chromeTransactionDurability = A, this.idbtrans = null, this.on = br(this, "complete", "error", "abort"), this.parent = S || null, this.active = !0, this._reculock = 0, this._blockedFuncs = [], this._resolve = null, this._reject = null, this._waitingFor = null, this._waitingQueue = null, this._spinCount = 0, this._completion = new V(function(I, T) {
          E._resolve = I, E._reject = T;
        }), this._completion.then(function() {
          E.active = !1, E.on.complete.fire();
        }, function(I) {
          var T = E.active;
          return E.active = !1, E.on.error.fire(I), E.parent ? E.parent._reject(I) : T && E.idbtrans && E.idbtrans.abort(), le(I);
        });
      })), this.Version = (b = this, vr(kd.prototype, function(y) {
        this.db = b, this._cfg = { version: y, storesSource: null, dbschema: {}, tables: {}, contentUpgrade: null };
      })), this.WhereClause = (C = this, vr(ea.prototype, function(y, P, w) {
        if (this.db = C, this._ctx = { table: y, index: P === ":id" ? null : P, or: w }, this._cmp = this._ascending = Z, this._descending = function(A, S) {
          return Z(S, A);
        }, this._max = function(A, S) {
          return 0 < Z(A, S) ? A : S;
        }, this._min = function(A, S) {
          return Z(A, S) < 0 ? A : S;
        }, this._IDBKeyRange = C._deps.IDBKeyRange, !this._IDBKeyRange) throw new j.MissingAPI();
      })), this.on("versionchange", function(y) {
        0 < y.newVersion, c.close({ disableAutoOpen: !1 });
      }), this.on("blocked", function(y) {
        !y.newVersion || y.newVersion < y.oldVersion;
      }), this._maxKey = Cr(a.IDBKeyRange), this._createTransaction = function(y, P, w, A) {
        return new c.Transaction(y, P, w, c._options.chromeTransactionDurability, A);
      }, this._fireOnBlocked = function(y) {
        c.on("blocked").fire(y), Ut.filter(function(P) {
          return P.name === c.name && P !== c && !P._state.vcFired;
        }).map(function(P) {
          return P.on("versionchange").fire(y);
        });
      }, this.use(Td), this.use($d), this.use(Od), this.use(Sd), this.use(Id);
      var k = new Proxy(this, { get: function(y, P, w) {
        if (P === "_vip") return !0;
        if (P === "table") return function(S) {
          return Oi(c.table(S), k);
        };
        var A = Reflect.get(y, P, w);
        return A instanceof Ys ? Oi(A, k) : P === "tables" ? A.map(function(S) {
          return Oi(S, k);
        }) : P === "_createTransaction" ? function() {
          return Oi(A.apply(this, arguments), k);
        } : A;
      } });
      this.vip = k, u.forEach(function(y) {
        return y(c);
      });
    }
    var zi, ze = typeof Symbol < "u" && "observable" in Symbol ? Symbol.observable : "@@observable", Nd = (io.prototype.subscribe = function(o, a, c) {
      return this._subscribe(o && typeof o != "function" ? o : { next: o, error: a, complete: c });
    }, io.prototype[ze] = function() {
      return this;
    }, io);
    function io(o) {
      this._subscribe = o;
    }
    try {
      zi = { indexedDB: s.indexedDB || s.mozIndexedDB || s.webkitIndexedDB || s.msIndexedDB, IDBKeyRange: s.IDBKeyRange || s.webkitIDBKeyRange };
    } catch {
      zi = { indexedDB: null, IDBKeyRange: null };
    }
    function _a(o) {
      var a, c = !1, u = new Nd(function(h) {
        var p = wn(o), _, b = !1, C = {}, x = {}, k = { get closed() {
          return b;
        }, unsubscribe: function() {
          b || (b = !0, _ && _.abort(), y && Je.storagemutated.unsubscribe(w));
        } };
        h.start && h.start(k);
        var y = !1, P = function() {
          return zn(A);
        }, w = function(S) {
          Si(C, S), Yn(x, C) && P();
        }, A = function() {
          var S, E, I;
          !b && zi.indexedDB && (C = {}, S = {}, _ && _.abort(), _ = new AbortController(), I = function(T) {
            var O = Bt();
            try {
              p && Ht();
              var R = Ge(o, T);
              return R = p ? R.finally(Ye) : R;
            } finally {
              O && Vt();
            }
          }(E = { subscr: S, signal: _.signal, requery: P, querier: o, trans: null }), Promise.resolve(I).then(function(T) {
            c = !0, a = T, b || E.signal.aborted || (C = {}, function(O) {
              for (var R in O) if (v(O, R)) return;
              return 1;
            }(x = S) || y || (Je(wr, w), y = !0), zn(function() {
              return !b && h.next && h.next(T);
            }));
          }, function(T) {
            c = !1, ["DatabaseClosedError", "AbortError"].includes(T == null ? void 0 : T.name) || b || zn(function() {
              b || h.error && h.error(T);
            });
          }));
        };
        return setTimeout(P, 0), k;
      });
      return u.hasValue = function() {
        return c;
      }, u.getValue = function() {
        return a;
      }, u;
    }
    var vt = Ue;
    function no(o) {
      var a = Qe;
      try {
        Qe = !0, Je.storagemutated.fire(o), Jn(o, !0);
      } finally {
        Qe = a;
      }
    }
    z(vt, r(r({}, ai), { delete: function(o) {
      return new vt(o, { addons: [] }).delete();
    }, exists: function(o) {
      return new vt(o, { addons: [] }).open().then(function(a) {
        return a.close(), !0;
      }).catch("NoSuchDatabaseError", function() {
        return !1;
      });
    }, getDatabaseNames: function(o) {
      try {
        return a = vt.dependencies, c = a.indexedDB, a = a.IDBKeyRange, (Kn(c) ? Promise.resolve(c.databases()).then(function(u) {
          return u.map(function(h) {
            return h.name;
          }).filter(function(h) {
            return h !== mi;
          });
        }) : qn(c, a).toCollection().primaryKeys()).then(o);
      } catch {
        return le(new j.MissingAPI());
      }
      var a, c;
    }, defineClass: function() {
      return function(o) {
        f(this, o);
      };
    }, ignoreTransaction: function(o) {
      return U.trans ? _t(U.transless, o) : o();
    }, vip: Wn, async: function(o) {
      return function() {
        try {
          var a = Qn(o.apply(this, arguments));
          return a && typeof a.then == "function" ? a : V.resolve(a);
        } catch (c) {
          return le(c);
        }
      };
    }, spawn: function(o, a, c) {
      try {
        var u = Qn(o.apply(c, a || []));
        return u && typeof u.then == "function" ? u : V.resolve(u);
      } catch (h) {
        return le(h);
      }
    }, currentTransaction: { get: function() {
      return U.trans || null;
    } }, waitFor: function(o, a) {
      return a = V.resolve(typeof o == "function" ? vt.ignoreTransaction(o) : o).timeout(a || 6e4), U.trans ? U.trans.waitFor(a) : a;
    }, Promise: V, debug: { get: function() {
      return De;
    }, set: function(o) {
      Fs(o);
    } }, derive: ee, extend: f, props: z, override: Oe, Events: br, on: Je, liveQuery: _a, extendObservabilitySet: Si, getByKeyPath: ge, setByKeyPath: Ce, delByKeyPath: function(o, a) {
      typeof a == "string" ? Ce(o, a, void 0) : "length" in a && [].map.call(a, function(c) {
        Ce(o, c, void 0);
      });
    }, shallowClone: Rs, deepClone: dt, getObjectDiff: eo, cmp: Z, asap: ue, minKey: -1 / 0, addons: [], connections: Ut, errnames: Cn, dependencies: zi, cache: bt, semVer: "4.0.8", version: "4.0.8".split(".").map(function(o) {
      return parseInt(o);
    }).reduce(function(o, a, c) {
      return o + a / Math.pow(10, 2 * c);
    }) })), vt.maxKey = Cr(vt.dependencies.IDBKeyRange), typeof dispatchEvent < "u" && typeof addEventListener < "u" && (Je(wr, function(o) {
      Qe || (o = new CustomEvent(Fn, { detail: o }), Qe = !0, dispatchEvent(o), Qe = !1);
    }), addEventListener(Fn, function(o) {
      o = o.detail, Qe || no(o);
    }));
    var Kt, Qe = !1, ma = function() {
    };
    return typeof BroadcastChannel < "u" && ((ma = function() {
      (Kt = new BroadcastChannel(Fn)).onmessage = function(o) {
        return o.data && no(o.data);
      };
    })(), typeof Kt.unref == "function" && Kt.unref(), Je(wr, function(o) {
      Qe || Kt.postMessage(o);
    })), typeof addEventListener < "u" && (addEventListener("pagehide", function(o) {
      if (!Ue.disableBfCache && o.persisted) {
        Kt != null && Kt.close();
        for (var a = 0, c = Ut; a < c.length; a++) c[a].close({ disableAutoOpen: !1 });
      }
    }), addEventListener("pageshow", function(o) {
      !Ue.disableBfCache && o.persisted && (ma(), no({ all: new Ee(-1 / 0, [[]]) }));
    })), V.rejectionMapper = function(o, a) {
      return !o || o instanceof Ft || o instanceof TypeError || o instanceof SyntaxError || !o.name || !Ms[o.name] ? o : (a = new Ms[o.name](a || o.message, o), "stack" in o && H(a, "stack", { get: function() {
        return this.inner.stack;
      } }), a);
    }, Fs(De), r(Ue, Object.freeze({ __proto__: null, Dexie: Ue, liveQuery: _a, Entity: Ks, cmp: Z, PropModSymbol: He, PropModification: yr, replacePrefix: function(o, a) {
      return new yr({ replacePrefix: [o, a] });
    }, add: function(o) {
      return new yr({ add: o });
    }, remove: function(o) {
      return new yr({ remove: o });
    }, default: Ue, RangeSet: Ee, mergeRanges: kr, rangesOverlap: oa }), { default: Ue }), Ue;
  });
})(Yc);
var rm = Yc.exports;
const Xo = /* @__PURE__ */ tm(rm), wl = Symbol.for("Dexie"), Jo = globalThis[wl] || (globalThis[wl] = Xo);
if (Xo.semVer !== Jo.semVer)
  throw new Error(`Two different versions of Dexie loaded in the same app: ${Xo.semVer} and ${Jo.semVer}`);
class im {
  constructor(t) {
    this.apiContext = void 0, this.db = void 0, this.hasRefreshedFavourites = !1, this.hasRefreshedAll = !1, this.apiContext = t, this.db = this.initDb();
  }
  initDb() {
    const t = new Jo("KioskTimeZones");
    return t.version(1).stores({
      kioskTimeZones: "&id, tz_long, tz_IANA, deprecated, version, favourite"
    }), t;
  }
  async getFavouriteTimeZones(t = !1, e = !1) {
    if (this.db) {
      const r = await this.db.kioskTimeZones.count();
      let i;
      return r == 0 && await this.refreshFavourites(), t ? i = await this.db.kioskTimeZones.where({ favourite: 1 }).toArray() : i = await this.db.kioskTimeZones.where({ deprecated: 0, favourite: 1 }).toArray(), e && this.refreshFavourites().finally(() => {
      }), i;
    } else return [];
  }
  async refreshFavourites() {
    var t, e;
    if (!this.db) return [];
    if (!this.hasRefreshedFavourites) {
      const r = await this.fetchFavouriteTimeZones();
      if (r && r.length > 0) {
        await ((t = this.db) == null ? void 0 : t.kioskTimeZones.where("favourite").equals(1).delete());
        const i = r.map((s) => ({
          id: s.id,
          tz_IANA: s.tz_IANA,
          tz_long: s.tz_long,
          deprecated: s.deprecated ? 1 : 0,
          version: s.version,
          favourite: 1
        }));
        return await ((e = this.db) == null ? void 0 : e.kioskTimeZones.bulkAdd(i)), this.hasRefreshedFavourites = !0, i;
      }
    }
    return [];
  }
  async fetchFavouriteTimeZones() {
    var t;
    return await ((t = this.apiContext) == null ? void 0 : t.fetchFromApi(
      "",
      "favouritetimezones",
      {
        method: "GET",
        caller: "app.fetchFavouriteTimeZones"
      }
    ).then((e) => e).catch((e) => []));
  }
  async fetchAllTimeZones(t = 0) {
    var r;
    const e = new URLSearchParams();
    return e.append("include_deprecated", "true"), t > 0 && e.append("newer_than", `${t}`), await ((r = this.apiContext) == null ? void 0 : r.fetchFromApi(
      "",
      "timezones",
      {
        method: "GET",
        caller: "app.fetchFavouriteTimeZones"
      },
      "v1",
      e
    ).then((i) => i).catch((i) => []));
  }
  async getAllTimeZones(t = !1, e = !1) {
    var i;
    await this.refreshAllTimeZones(e);
    let r = await ((i = this.db) == null ? void 0 : i.kioskTimeZones.toArray());
    return r == null ? void 0 : r.filter((s) => s.deprecated == 0 || t);
  }
  async refreshAllTimeZones(t) {
    let e = [];
    if (this.db && (t || !this.hasRefreshedAll)) {
      let r = 0;
      const i = (await this.getFavouriteTimeZones()).filter((l) => l.favourite == 1).map((l) => l.id);
      if (!t)
        try {
          r = (await this.db.kioskTimeZones.where("favourite").equals(0).reverse().sortBy("version"))[0].version;
        } catch {
        }
      const s = await this.fetchAllTimeZones(r);
      s && s.length > 0 && (await this.db.kioskTimeZones.where("version").above(r).delete(), e = s.map((l) => ({
        id: l.id,
        tz_IANA: l.tz_IANA,
        tz_long: l.tz_long,
        deprecated: l.deprecated ? 1 : 0,
        version: l.version,
        favourite: i.includes(l.id) ? 1 : 0
      })), await this.db.kioskTimeZones.bulkAdd(e), this.hasRefreshedAll = !0);
    }
  }
}
const nm = '*{padding:0;margin:0;border:0px;-webkit-user-select:none;user-select:none}p,div{-webkit-user-select:text;user-select:text}select{-webkit-user-select:none;user-select:none}.col-bg-body-lighter{background-color:var(--col-bg-body-lighter)}.col-bg-body{background-color:var(--col-bg-body)}.col-bg-body-darker{background-color:var(--col-bg-body-darker)}.col-bg-1-lighter{background-color:var(--col-bg-1-lighter)}.col-bg-1{background-color:var(--col-bg-1)}.col-bg-1-darker{background-color:var(--col-bg-1-darker)}.col-bg-1-input{background-color:var(--col-bg-1-input)}.col-primary-bg-1{background-color:var(--col-primary-bg-1)}.col-accent-bg-1{background-color:var(--col-accent-bg-1)}.col-success-bg-1{background-color:var(--col-success-bg-1)}.col-warning-bg-1{background-color:var(--col-warning-bg-1)}.col-error-bg-1{background-color:var(--col-error-bg-1)}.col-bg-2-lighter{background-color:var(--col-bg-2-lighter)}.col-bg-2{background-color:var(--col-bg-2)}.col-bg-2-darker{background-color:var(--col-bg-2-darker)}.col-bg-2-button{background-color:var(--col-bg-2-button)}.col-bg-2-input{background-color:var(--col-bg-2-input)}.col-primary-bg-2{background-color:var(--col-primary-bg-2)}.col-accent-bg-2{background-color:var(--col-accent-bg-2)}.col-success-bg-2{background-color:var(--col-success-bg-2)}.col-warning-bg-2{background-color:var(--col-warning-bg-2)}.col-error-bg-2{background-color:var(--col-error-bg-2)}.col-bg-3-lighter{background-color:var(--col-bg-3-lighter)}.col-bg-3{background-color:var(--col-bg-3)}.col-bg-3-darker{background-color:var(--col-bg-3-darker)}.col-bg-3-button{background-color:var(--col-bg-3-button)}.col-bg-3-input{background-color:var(--col-bg-3-input)}.col-primary-bg-3{background-color:var(--col-primary-bg-3)}.col-accent-bg-3{background-color:var(--col-accent-bg-3)}.col-success-bg-3{background-color:var(--col-success-bg-3)}.col-warning-bg-3{background-color:var(--col-warning-bg-3)}.col-error-bg-3{background-color:var(--col-error-bg-3)}.col-bg-ack-lighter{background-color:var(--col-bg-ack-lighter)}.col-bg-ack{background-color:var(--col-bg-ack)}.col-bg-ack-darker{background-color:var(--col-bg-ack-darker)}.col-primary-bg-ack{background-color:var(--col-primary-bg-ack)}.col-accent-bg-ack{background-color:var(--col-accent-bg-ack)}.col-bg-att-lighter{background-color:var(--col-bg-att-lighter)}.col-bg-att{background-color:var(--col-bg-att)}.col-bg-att-darker{background-color:var(--col-bg-att-darker)}.col-primary-bg-att{background-color:var(--col-primary-bg-att)}.col-accent-bg-att{background-color:var(--col-accent-bg-att)}.col-bg-alert-lighter{background-color:var(--col-bg-alert-lighter)}.col-bg-alert{background-color:var(--col-bg-alert)}.col-bg-alert-darker{background-color:var(--col-bg-alert-darker)}.col-primary-bg-alert{background-color:var(--col-primary-bg-alert)}.col-accent-bg-alert{background-color:var(--col-accent-bg-alert)}.col-bg-btn-lighter{background-color:var(--col-bg-btn-lighter)}.col-bg-btn{background-color:var(--col-bg-btn)}.col-bg-btn-darker{background-color:var(--col-bg-btn-darker)}.col-primary-bg-btn{background-color:var(--col-primary-bg-btn)}.col-accent-bg-btn{background-color:var(--col-accent-bg-btn)}.pattern-diagonal-stripes-sm{background:repeating-linear-gradient(45deg,transparent,transparent 10px,currentColor 10px,currentColor 20px)}.pattern-dots-lg{background-image:radial-gradient(currentColor 1.5px,transparent 1.5px);background-size:15px 15px}.pattern-dots-md{background-image:radial-gradient(currentColor 1px,transparent 1px);background-size:8px 8px}.pattern-dots-medium-dense{background-image:radial-gradient(currentColor .5px,transparent .5px);background-size:3px 3px}.pattern-dots-sm{background-image:radial-gradient(currentColor .5px,transparent .5px);background-size:5px 5px}.pattern-cross-dots-md,.imagelist-background{background-image:radial-gradient(currentColor .7px,transparent 1px),radial-gradient(currentColor .7px,transparent 1px);background-size:6.5px 6.5px;background-position:0 0,3.5px 3.5px}.imagelist-background{background-color:#fff9;background-blend-mode:overlay}label{font-family:var(--monospace-font);font-size:.9em}input:not([type=radio]),select{-webkit-user-select:text;-moz-user-select:text;-ms-user-select:text;box-sizing:border-box;border-radius:0;user-select:text;font-family:var(--standard-text-font);background-color:var(--col-bg-1-input);border:none;color:var(--col-primary-bg-1);padding:2px;margin-bottom:2px;width:100%}input:not([type=radio]):focus,select:focus{margin-bottom:0;border-bottom:2px solid rgb(0,0,0);outline:none}h1{font-size:var(--font-size-h1)}h2{font-size:var(--font-size-h2)}h3{font-size:var(--font-size-h3)}h4{font-size:var(--font-size-h4)}small,.font-small{font-size:var(--font-size-small)}button{width:60px;height:60px;border-radius:35px;border-style:solid;border-width:2px;background-color:var(--col-bg-btn);color:var(--col-primary-bg-btn);border-color:var(--col-bg-btn-darker);font-family:var(--headline-text-font);font-size:var(--font-size-h4);font-weight:700}button:hover,button:focus{outline:none;background-color:var(--col-bg-btn-lighter)}button:active{padding-top:3px;color:var(--col-primary-bg-btn);background-color:var(--col-bg-btn-darker);border-color:var(--col-bg-btn-darker)}.kiosk-btn-128{width:128px;height:128px}.kiosk-btn-32{width:32px;height:32px}.kiosk-dropdown-btn{box-sizing:content-box;border-radius:0;background-color:var(--col-bg-btn);border-color:var(--col-bg-btn-darker);color:var(--col-primary-bg-btn);height:30px;width:30px}.kiosk-dropdown-btn .drop-down-btn{float:left}.kiosk-dropdown-btn .caret{color:var(--col-primary-bg-btn);display:inline-block;width:0;height:0;margin-left:2px;vertical-align:middle;border-color:var(--col-primary-bg-btn);border-top:4px solid;border-right:4px solid transparent;border-left:4px solid transparent}button:disabled{opacity:.3}.modal-round-button,.modal-delete,.modal-close,.modal-cancel,.modal-back,.modal-next,.modal-ok,.modal-button{box-sizing:border-box;margin-left:25px;background-image:none;display:inline-block;font-style:normal;font-variant:normal;text-rendering:auto;-webkit-font-smoothing:antialiased;font-family:"Font Awesome 6 Free";font-weight:900;font-size:24px;line-height:24px;vertical-align:center;text-align:center}.modal-ok:after{content:var(--icon-bt-ok)}.modal-next:after{padding-left:2px;content:var(--icon-bt-next)}.modal-back:after{padding-right:2px;content:var(--icon-bt-back)}.modal-cancel:after{content:var(--icon-bt-cancel)}.modal-close:before{content:var(--icon-bt-close)}.modal-delete{background-color:var(--col-bg-alert);color:var(--col-primary-bg-alert)}.modal-delete:before{content:var(--icon-bt-trash)}.modal-delete:hover,.modal-delete:focus{border-color:var(--col-bg-alert);background-color:var(--col-bg-alert-lighter);background-size:75%}.modal-delete:active{border-color:var(--col-bg-alert);background-color:var(--col-bg-alert-darker);color:var(--col-primary-bg-alert)}.kiosk-rounded{border-radius:15px}.kiosk-shaded{box-shadow:2px 2px 10px #2e380394}.kiosk-margin-bottom{margin-bottom:1em}.flex-line-break{width:100%;height:0px}.kiosk-align-flex-end{align-items:flex-end}.kiosk-align-flex-start{align-items:flex-start}.full-background-bg-1{background:linear-gradient(to right bottom,var(--col-bg-1-darker),var(--col-bg-1-lighter));height:100%;width:100%}.small-list-button i{border-radius:25px;box-shadow:2px 2px 5px #2e380394}.small-list-button:hover{color:var(--col-bg-att)}.small-list-button:hover i{box-shadow:2px 2px 5px #2e380394}.small-list-button:active,.small-list-button:focus{color:var(--col-bg-ack);transform:translateY(5px)}.small-list-button:active i,.small-list-button:focus i{box-shadow:none}.dialog-radio-div{display:flex;flex-direction:row}.dialog-radio-div input[type=radio]{margin-right:.5em}.fa,.fas{font-family:"Font Awesome 6 Free";font-weight:900;font-style:normal}.fa-trash:before{content:""}.fa-view-grid:before{content:""}.fa-reload:before{content:""}.fa-view-list:before{content:""}.fa-camera:before{content:""}.fa-view-image:before{content:""}.fa-check:before{content:""}.fa-bug:before{content:""}.fa-lightbulb:before{content:""}.fa-query:before{content:""}.fa-footsteps{transform:rotate(270deg)}.fa-footsteps:before{content:""}i{font-family:"Font Awesome 6 Free";font-style:normal;font-variant:normal;text-rendering:auto;-webkit-font-smoothing:antialiased;font-weight:900;font-size:.9em}div,p{font-family:var(--standard-text-font)}dialog{margin:auto;width:100%;height:100%;background-color:unset;outline:none;border:none}dialog .dialog-outer-zone{display:grid;background-color:unset;width:100%;height:100%;place-items:center}.dialog-frame{position:relative;background-color:var(--col-bg-1);display:flex;padding:20px 25px 10px;flex-direction:column;justify-content:space-between;border:2px solid var(--col-bg-1)}.dialog-header{height:auto;display:flex;width:100%;flex-direction:row;flex-wrap:nowrap;align-items:center;padding-bottom:.5rem;margin-top:.5em;margin-right:1em;border:0px solid black;border-bottom-width:1px;margin-bottom:1rem}.dialog-image{box-sizing:border-box;padding-right:10px;background-repeat:no-repeat;z-index:0}.dialog-name h3{font-family:var(--monospace-font)}.close-button{-webkit-user-select:none;user-select:none;position:absolute;font-size:var(--font-size-h3);color:var(--col-primary-bg-1);margin-left:auto;right:.5rem;top:.5rem}.close-button :hover{background-color:var(--col-bg-btn);color:var(--col-primary-bg-btn)}.close-button :active{background-color:var(--col-bg-btn);color:var(--col-accent-bg-btn)}';
var om = Object.defineProperty, sm = Object.getOwnPropertyDescriptor, am = Object.getPrototypeOf, lm = Reflect.get, Zc = (n, t, e, r) => {
  for (var i = r > 1 ? void 0 : r ? sm(t, e) : t, s = n.length - 1, l; s >= 0; s--)
    (l = n[s]) && (i = (r ? l(t, e, i) : l(i)) || i);
  return r && i && om(t, e, i), i;
}, cm = (n, t, e) => lm(am(n), e, t);
let Tt = class extends Pt {
  constructor() {
    super(...arguments), this.heading = "";
  }
  firstUpdated(n) {
    super.firstUpdated(n);
  }
  openDialog() {
    var t;
    let n = (t = this.shadowRoot) == null ? void 0 : t.querySelector("dialog");
    n && n.showModal();
  }
  closeDialog(n) {
    var e;
    let t = (e = this.shadowRoot) == null ? void 0 : e.querySelector("dialog");
    t && t.close(n);
  }
  _overlayClicked(n) {
    var t;
    n.target == ((t = this.shadowRoot) == null ? void 0 : t.querySelector(".dialog-outer-zone")) && this.closeDialog();
  }
  _onCloseDialog() {
    var e;
    let n = (e = this.shadowRoot) == null ? void 0 : e.querySelector("dialog"), t = new CustomEvent("kiosk-dialog-closed", {
      bubbles: !1,
      cancelable: !1,
      composed: !1,
      detail: n == null ? void 0 : n.returnValue
    });
    this.dispatchEvent(t);
  }
  render() {
    return Fr`
            <dialog id="my-dialog" @close="${this._onCloseDialog}">
                <div class="dialog-outer-zone" @click="${this._overlayClicked}">
                    <div class="dialog-frame">
                        <div class="dialog-header">
                            <div class="dialog-image">
                                <slot name="dialog-image"></slot>
                            </div>
                            <div class="dialog-name">
                                <h3 class="dialog-title">${this.heading}</h3>
                            </div>
                            <div class="close-button" @click="${this.closeDialog}">
                                <i class="fa"></i>
                            </div>
                        </div>
                        <slot name="dialog-content">
                        </slot>
                    </div>
                </div>
            </dialog>
        `;
  }
};
Tt.styles = un(nm);
Tt.properties = {
  ...cm(Tt, Tt, "properties")
};
Zc([
  Se()
], Tt.prototype, "heading", 2);
Tt = Zc([
  Ss("kiosk-dialog")
], Tt);
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const Xc = { ATTRIBUTE: 1, CHILD: 2, PROPERTY: 3, BOOLEAN_ATTRIBUTE: 4, EVENT: 5, ELEMENT: 6 }, dm = (n) => (...t) => ({ _$litDirective$: n, values: t });
class um {
  constructor(t) {
  }
  get _$AU() {
    return this._$AM._$AU;
  }
  _$AT(t, e, r) {
    this._$Ct = t, this._$AM = e, this._$Ci = r;
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
const hm = (n) => n.strings === void 0;
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const Ur = (n, t) => {
  var r;
  const e = n._$AN;
  if (e === void 0) return !1;
  for (const i of e) (r = i._$AO) == null || r.call(i, t, !1), Ur(i, t);
  return !0;
}, dn = (n) => {
  let t, e;
  do {
    if ((t = n._$AM) === void 0) break;
    e = t._$AN, e.delete(n), n = t;
  } while ((e == null ? void 0 : e.size) === 0);
}, Jc = (n) => {
  for (let t; t = n._$AM; n = t) {
    let e = t._$AN;
    if (e === void 0) t._$AN = e = /* @__PURE__ */ new Set();
    else if (e.has(n)) break;
    e.add(n), _m(t);
  }
};
function fm(n) {
  this._$AN !== void 0 ? (dn(this), this._$AM = n, Jc(this)) : this._$AM = n;
}
function pm(n, t = !1, e = 0) {
  const r = this._$AH, i = this._$AN;
  if (i !== void 0 && i.size !== 0) if (t) if (Array.isArray(r)) for (let s = e; s < r.length; s++) Ur(r[s], !1), dn(r[s]);
  else r != null && (Ur(r, !1), dn(r));
  else Ur(this, n);
}
const _m = (n) => {
  n.type == Xc.CHILD && (n._$AP ?? (n._$AP = pm), n._$AQ ?? (n._$AQ = fm));
};
class mm extends um {
  constructor() {
    super(...arguments), this._$AN = void 0;
  }
  _$AT(t, e, r) {
    super._$AT(t, e, r), Jc(this), this.isConnected = t._$AU;
  }
  _$AO(t, e = !0) {
    var r, i;
    t !== this.isConnected && (this.isConnected = t, t ? (r = this.reconnected) == null || r.call(this) : (i = this.disconnected) == null || i.call(this)), e && (Ur(this, t), dn(this));
  }
  setValue(t) {
    if (hm(this._$Ct)) this._$Ct._$AI(t, this);
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
 * Copyright (c) 2016 - 2024 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
const Cl = Symbol("valueNotInitialized");
class gm extends mm {
  constructor(t) {
    if (super(t), t.type !== Xc.ELEMENT)
      throw new Error(`\`${this.constructor.name}\` must be bound to an element.`);
    this.previousValue = Cl;
  }
  /** @override */
  render(t, e) {
    return de;
  }
  /** @override */
  update(t, [e, r]) {
    return this.hasChanged(r) && (this.host = t.options && t.options.host, this.element = t.element, this.renderer = e, this.previousValue === Cl ? this.addRenderer() : this.runRenderer(), this.previousValue = Array.isArray(r) ? [...r] : r), de;
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
    const r = this.renderer.call(this.host, ...e);
    Nl(r, t, { host: this.host });
  }
  /** @protected */
  hasChanged(t) {
    return Array.isArray(t) ? !Array.isArray(this.previousValue) || this.previousValue.length !== t.length ? !0 : t.some((e, r) => e !== this.previousValue[r]) : this.previousValue !== t;
  }
}
/**
 * @license
 * Copyright (c) 2017 - 2024 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
const El = Symbol("contentUpdateDebouncer");
/**
 * @license
 * Copyright (c) 2017 - 2024 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
class bm extends gm {
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
    t[El] = ie.debounce(t[El], $e, () => {
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
class vm extends bm {
  get rendererProperty() {
    return "renderer";
  }
  addRenderer() {
    this.element[this.rendererProperty] = (t, e, r) => {
      this.renderRenderer(t, r.item, r, e);
    };
  }
}
const ym = dm(vm);
var xm = Object.defineProperty, wm = Object.getOwnPropertyDescriptor, Cm = Object.getPrototypeOf, Em = Reflect.get, Qc = (n) => {
  throw TypeError(n);
}, Ne = (n, t, e, r) => {
  for (var i = r > 1 ? void 0 : r ? wm(t, e) : t, s = n.length - 1, l; s >= 0; s--)
    (l = n[s]) && (i = (r ? l(t, e, i) : l(i)) || i);
  return r && i && xm(t, e, i), i;
}, ed = (n, t, e) => t.has(n) || Qc("Cannot " + e), Li = (n, t, e) => (ed(n, t, "read from private field"), e ? e.call(n) : t.get(n)), Bi = (n, t, e) => t.has(n) ? Qc("Cannot add the same private member more than once") : t instanceof WeakSet ? t.add(n) : t.set(n, e), Vi = (n, t, e, r) => (ed(n, t, "write to private field"), t.set(n, e), e), Am = (n, t, e) => Em(Cm(n), e, t), Ki, Wi, Gi, Yi;
let xe = class extends ei {
  constructor() {
    super(), this.constants = {}, Bi(this, Ki, []), Bi(this, Wi, []), this.searchIdentifier = "", this.heading = "select archaeological entity", this.identifierColumnTitle = "entity", this.initialRecordType = "unit", Bi(this, Gi, []), Bi(this, Yi, {}), this.recordTypeFilter = [], this.cellRenderer = (n) => {
      const t = Q_(this.recordTypeAliases, n.record_type);
      return Fr`
            <div>
                ${t}
            </div>`;
    }, fe("vaadin-grid", X`
            :host [part~="header-cell"] ::slotted(vaadin-grid-cell-content), [part~="footer-cell"] ::slotted(vaadin-grid-cell-content), [part~="reorder-ghost"] {
                font-weight: bold
            }
        `);
  }
  get identifiers() {
    return Li(this, Ki);
  }
  set identifiers(n) {
    Vi(this, Ki, n);
  }
  get _identifiers() {
    return Li(this, Wi);
  }
  set _identifiers(n) {
    Vi(this, Wi, n);
  }
  get selectedItems() {
    return Li(this, Gi);
  }
  set selectedItems(n) {
    Vi(this, Gi, n);
  }
  get recordTypeAliases() {
    return Li(this, Yi);
  }
  set recordTypeAliases(n) {
    Vi(this, Yi, n);
  }
  updated(n) {
    var t;
    if (super.updated(n), n.has("apiContext") && this.apiConnected(), n.has("selectedItems") && this.selectedItems.length > 0) {
      const e = (t = this.shadowRoot) == null ? void 0 : t.querySelector("kiosk-dialog");
      e && setTimeout(() => {
        const r = new CustomEvent("closeSelection", {
          detail: this.selectedItems[0]
        });
        this.dispatchEvent(r), e.closeDialog();
      }, 250);
    }
  }
  willUpdate(n) {
    (n.has("identifiers") || n.has("recordTypeFilter")) && this.prepareIdentifiers();
  }
  apiConnected() {
    (!this.identifiers || this.identifiers.length == 0) && this.fetchIdentifiers();
  }
  fetchIdentifiers() {
    this.apiContext.fetchFromApi(
      "",
      "contexts/full",
      {
        method: "GET",
        caller: "app.fetchConstants"
      }
    ).then((n) => {
      this.identifiers = n.identifiers;
    }).catch((n) => {
      this.showProgress = !1, em(this, n, "loadConstants");
    });
  }
  prepareIdentifiers() {
    this.recordTypeFilter.length > 0 ? this._identifiers = this.identifiers.filter((n) => this.recordTypeFilter.includes(n.record_type.toLowerCase())) : this._identifiers = this.identifiers;
  }
  filterIdentifiers() {
    return this.searchIdentifier === "" && this.initialRecordType !== "" ? this._identifiers.filter((n) => n.record_type === this.initialRecordType) : this.searchIdentifier || this._identifiers.length < 50 ? this._identifiers.filter((n) => n.identifier.toLowerCase().startsWith(this.searchIdentifier)) : [];
  }
  openDialog() {
    var t;
    ((t = this.shadowRoot) == null ? void 0 : t.querySelector("kiosk-dialog")).openDialog();
  }
  searchChanged(n) {
    let t = n.target.value;
    this.searchIdentifier = t.toLowerCase();
  }
  activeItemChanged(n) {
    const t = n.detail.value;
    t && (this.selectedItems = [t]);
  }
  renderGrid() {
    return Fr`
            <vaadin-grid id="grid" class="selection-grid"
                         .items=${this.filterIdentifiers()}
                         .selectedItems="${this.selectedItems}"
                         @active-item-changed="${this.activeItemChanged}">
                <vaadin-grid-column header="${this.identifierColumnTitle}" path="identifier"></vaadin-grid-column>
                <vaadin-grid-column header="type" ${ym(this.cellRenderer, [])}></vaadin-grid-column>
            </vaadin-grid>
        `;
  }
  apiRender() {
    return Fr`
            <kiosk-dialog api heading="${this.heading}">
                <!--svg slot="dialog-image" xmlns="http://www.w3.org/2000/svg" width="auto" height="auto" viewBox="0 0 24 24" style="fill: rgba(0, 0, 0, 1);transform: ;msFilter:;"><path d="M11 19.91 10 22h4l-1-2.09c4-.65 7-5.28 7-9.91a8 8 0 0 0-16 0c0 4.63 3.08 9.26 7 9.91zm1-15.66v1.5A4.26 4.26 0 0 0 7.75 10h-1.5A5.76 5.76 0 0 1 12 4.25z"></path></svg-->
                <div slot="dialog-image">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"
                         style="fill: rgba(0, 0, 0, 1);transform: ;msFilter:;">
                        <path d="M4 22h12v-2H4V8H2v12c0 1.103.897 2 2 2z"></path>
                        <path
                            d="M20 2H8c-1.103 0-2 .897-2 2v12c0 1.103.897 2 2 2h12c1.103 0 2-.897 2-2V4c0-1.103-.897-2-2-2zm-2 9h-3v3h-2v-3h-3V9h3V6h2v3h3v2z"></path>
                    </svg>
                </div>
                <div slot="dialog-content">
                    <label for="identifier">search word expands selection</label>
                    <input id="identifier" type="text" @input="${this.searchChanged}" autofocus>
                    ${this.renderGrid()}
                </div>
            </kiosk-dialog>
        `;
  }
};
Ki = /* @__PURE__ */ new WeakMap();
Wi = /* @__PURE__ */ new WeakMap();
Gi = /* @__PURE__ */ new WeakMap();
Yi = /* @__PURE__ */ new WeakMap();
xe.styles = un(C_);
xe.properties = {
  ...Am(xe, xe, "properties")
};
Ne([
  Se()
], xe.prototype, "constants", 2);
Ne([
  Se()
], xe.prototype, "identifiers", 1);
Ne([
  Vc()
], xe.prototype, "_identifiers", 1);
Ne([
  Se()
], xe.prototype, "searchIdentifier", 2);
Ne([
  Se()
], xe.prototype, "heading", 2);
Ne([
  Se()
], xe.prototype, "identifierColumnTitle", 2);
Ne([
  Se()
], xe.prototype, "initialRecordType", 2);
Ne([
  Se()
], xe.prototype, "selectedItems", 1);
Ne([
  Se()
], xe.prototype, "recordTypeAliases", 1);
Ne([
  Se()
], xe.prototype, "recordTypeFilter", 2);
xe = Ne([
  Ss("kiosk-context-selector")
], xe);
const km = '*{padding:0;margin:0;border:0px;-webkit-user-select:none;user-select:none}p,div{-webkit-user-select:text;user-select:text}select{-webkit-user-select:none;user-select:none}.col-bg-body-lighter{background-color:var(--col-bg-body-lighter)}.col-bg-body{background-color:var(--col-bg-body)}.col-bg-body-darker{background-color:var(--col-bg-body-darker)}.col-bg-1-lighter{background-color:var(--col-bg-1-lighter)}.col-bg-1{background-color:var(--col-bg-1)}.col-bg-1-darker{background-color:var(--col-bg-1-darker)}.col-bg-1-input{background-color:var(--col-bg-1-input)}.col-primary-bg-1{background-color:var(--col-primary-bg-1)}.col-accent-bg-1{background-color:var(--col-accent-bg-1)}.col-success-bg-1{background-color:var(--col-success-bg-1)}.col-warning-bg-1{background-color:var(--col-warning-bg-1)}.col-error-bg-1{background-color:var(--col-error-bg-1)}.col-bg-2-lighter{background-color:var(--col-bg-2-lighter)}.col-bg-2{background-color:var(--col-bg-2)}.col-bg-2-darker{background-color:var(--col-bg-2-darker)}.col-bg-2-button{background-color:var(--col-bg-2-button)}.col-bg-2-input{background-color:var(--col-bg-2-input)}.col-primary-bg-2{background-color:var(--col-primary-bg-2)}.col-accent-bg-2{background-color:var(--col-accent-bg-2)}.col-success-bg-2{background-color:var(--col-success-bg-2)}.col-warning-bg-2{background-color:var(--col-warning-bg-2)}.col-error-bg-2{background-color:var(--col-error-bg-2)}.col-bg-3-lighter{background-color:var(--col-bg-3-lighter)}.col-bg-3{background-color:var(--col-bg-3)}.col-bg-3-darker{background-color:var(--col-bg-3-darker)}.col-bg-3-button{background-color:var(--col-bg-3-button)}.col-bg-3-input{background-color:var(--col-bg-3-input)}.col-primary-bg-3{background-color:var(--col-primary-bg-3)}.col-accent-bg-3{background-color:var(--col-accent-bg-3)}.col-success-bg-3{background-color:var(--col-success-bg-3)}.col-warning-bg-3{background-color:var(--col-warning-bg-3)}.col-error-bg-3{background-color:var(--col-error-bg-3)}.col-bg-ack-lighter{background-color:var(--col-bg-ack-lighter)}.col-bg-ack{background-color:var(--col-bg-ack)}.col-bg-ack-darker{background-color:var(--col-bg-ack-darker)}.col-primary-bg-ack{background-color:var(--col-primary-bg-ack)}.col-accent-bg-ack{background-color:var(--col-accent-bg-ack)}.col-bg-att-lighter{background-color:var(--col-bg-att-lighter)}.col-bg-att{background-color:var(--col-bg-att)}.col-bg-att-darker{background-color:var(--col-bg-att-darker)}.col-primary-bg-att{background-color:var(--col-primary-bg-att)}.col-accent-bg-att{background-color:var(--col-accent-bg-att)}.col-bg-alert-lighter{background-color:var(--col-bg-alert-lighter)}.col-bg-alert{background-color:var(--col-bg-alert)}.col-bg-alert-darker{background-color:var(--col-bg-alert-darker)}.col-primary-bg-alert{background-color:var(--col-primary-bg-alert)}.col-accent-bg-alert{background-color:var(--col-accent-bg-alert)}.col-bg-btn-lighter{background-color:var(--col-bg-btn-lighter)}.col-bg-btn{background-color:var(--col-bg-btn)}.col-bg-btn-darker{background-color:var(--col-bg-btn-darker)}.col-primary-bg-btn{background-color:var(--col-primary-bg-btn)}.col-accent-bg-btn{background-color:var(--col-accent-bg-btn)}.pattern-diagonal-stripes-sm{background:repeating-linear-gradient(45deg,transparent,transparent 10px,currentColor 10px,currentColor 20px)}.pattern-dots-lg{background-image:radial-gradient(currentColor 1.5px,transparent 1.5px);background-size:15px 15px}.pattern-dots-md{background-image:radial-gradient(currentColor 1px,transparent 1px);background-size:8px 8px}.pattern-dots-medium-dense{background-image:radial-gradient(currentColor .5px,transparent .5px);background-size:3px 3px}.pattern-dots-sm{background-image:radial-gradient(currentColor .5px,transparent .5px);background-size:5px 5px}.pattern-cross-dots-md,.imagelist-background{background-image:radial-gradient(currentColor .7px,transparent 1px),radial-gradient(currentColor .7px,transparent 1px);background-size:6.5px 6.5px;background-position:0 0,3.5px 3.5px}.imagelist-background{background-color:#fff9;background-blend-mode:overlay}label{font-family:var(--monospace-font);font-size:.9em}input:not([type=radio]),select{-webkit-user-select:text;-moz-user-select:text;-ms-user-select:text;box-sizing:border-box;border-radius:0;user-select:text;font-family:var(--standard-text-font);background-color:var(--col-bg-1-input);border:none;color:var(--col-primary-bg-1);padding:2px;margin-bottom:2px;width:100%}input:not([type=radio]):focus,select:focus{margin-bottom:0;border-bottom:2px solid rgb(0,0,0);outline:none}h1{font-size:var(--font-size-h1)}h2{font-size:var(--font-size-h2)}h3{font-size:var(--font-size-h3)}h4{font-size:var(--font-size-h4)}small,.font-small{font-size:var(--font-size-small)}button{width:60px;height:60px;border-radius:35px;border-style:solid;border-width:2px;background-color:var(--col-bg-btn);color:var(--col-primary-bg-btn);border-color:var(--col-bg-btn-darker);font-family:var(--headline-text-font);font-size:var(--font-size-h4);font-weight:700}button:hover,button:focus{outline:none;background-color:var(--col-bg-btn-lighter)}button:active{padding-top:3px;color:var(--col-primary-bg-btn);background-color:var(--col-bg-btn-darker);border-color:var(--col-bg-btn-darker)}.kiosk-btn-128{width:128px;height:128px}.kiosk-btn-32{width:32px;height:32px}.kiosk-dropdown-btn{box-sizing:content-box;border-radius:0;background-color:var(--col-bg-btn);border-color:var(--col-bg-btn-darker);color:var(--col-primary-bg-btn);height:30px;width:30px}.kiosk-dropdown-btn .drop-down-btn{float:left}.kiosk-dropdown-btn .caret{color:var(--col-primary-bg-btn);display:inline-block;width:0;height:0;margin-left:2px;vertical-align:middle;border-color:var(--col-primary-bg-btn);border-top:4px solid;border-right:4px solid transparent;border-left:4px solid transparent}button:disabled{opacity:.3}.modal-round-button,.modal-delete,.modal-close,.modal-cancel,.modal-back,.modal-next,.modal-ok,.modal-button{box-sizing:border-box;margin-left:25px;background-image:none;display:inline-block;font-style:normal;font-variant:normal;text-rendering:auto;-webkit-font-smoothing:antialiased;font-family:"Font Awesome 6 Free";font-weight:900;font-size:24px;line-height:24px;vertical-align:center;text-align:center}.modal-ok:after{content:var(--icon-bt-ok)}.modal-next:after{padding-left:2px;content:var(--icon-bt-next)}.modal-back:after{padding-right:2px;content:var(--icon-bt-back)}.modal-cancel:after{content:var(--icon-bt-cancel)}.modal-close:before{content:var(--icon-bt-close)}.modal-delete{background-color:var(--col-bg-alert);color:var(--col-primary-bg-alert)}.modal-delete:before{content:var(--icon-bt-trash)}.modal-delete:hover,.modal-delete:focus{border-color:var(--col-bg-alert);background-color:var(--col-bg-alert-lighter);background-size:75%}.modal-delete:active{border-color:var(--col-bg-alert);background-color:var(--col-bg-alert-darker);color:var(--col-primary-bg-alert)}.kiosk-rounded{border-radius:15px}.kiosk-shaded{box-shadow:2px 2px 10px #2e380394}.kiosk-margin-bottom{margin-bottom:1em}.flex-line-break{width:100%;height:0px}.kiosk-align-flex-end{align-items:flex-end}.kiosk-align-flex-start{align-items:flex-start}.full-background-bg-1{background:linear-gradient(to right bottom,var(--col-bg-1-darker),var(--col-bg-1-lighter));height:100%;width:100%}.small-list-button i{border-radius:25px;box-shadow:2px 2px 5px #2e380394}.small-list-button:hover{color:var(--col-bg-att)}.small-list-button:hover i{box-shadow:2px 2px 5px #2e380394}.small-list-button:active,.small-list-button:focus{color:var(--col-bg-ack);transform:translateY(5px)}.small-list-button:active i,.small-list-button:focus i{box-shadow:none}.dialog-radio-div{display:flex;flex-direction:row}.dialog-radio-div input[type=radio]{margin-right:.5em}.fa,.fas{font-family:"Font Awesome 6 Free";font-weight:900;font-style:normal}.fa-trash:before{content:""}.fa-view-grid:before{content:""}.fa-reload:before{content:""}.fa-view-list:before{content:""}.fa-camera:before{content:""}.fa-view-image:before{content:""}.fa-check:before{content:""}.fa-bug:before{content:""}.fa-lightbulb:before{content:""}.fa-query:before{content:""}.fa-footsteps{transform:rotate(270deg)}.fa-footsteps:before{content:""}i{font-family:"Font Awesome 6 Free";font-style:normal;font-variant:normal;text-rendering:auto;-webkit-font-smoothing:antialiased;font-weight:900;font-size:.9em}div,p{font-family:var(--standard-text-font)}:host{--lumo-font-size-s: $font-size-standard;--lumo-font-family: $standard-text;--lumo-size-m: $font-size-standard;--lumo-contrast-10pct: rgba(0,0,0,0);--lumo-contrast-60pct: var(--col-accent-bg-1);--lumo-text-field-size: 1em;--lumo-font-size: var(--font-size-standard)}vaadin-combo-box{margin-left:calc(-1 * (.375em + var(--lumo-border-radius-m) / 4 - 1px));margin-right:calc(-1 * (.375em + var(--lumo-border-radius-m) / 4 - 1px));padding-top:0}vaadin-combo-box>input{--_lumo-text-field-overflow-mask-image: white;--lumo-text-field-size: 22px;background-color:#fff;max-height:30px}vaadin-combo-box>input:disabled{background-color:var(--col-bg-1-lighter);--lumo-disabled-text-color: $col-primary-bg-1}vaadin-combo-box{font-family:var(--standard-text-font);font-size:var(--font-size-standard, 1rem);color:var(--col-primary-bg-1);background-color:var(--col-bg-2);width:100%;padding:0}vaadin-combo-box input:disabled,vaadin-combo-box textarea:disabled{background-color:var(--col-bg-1-lighter);color:var(--col-primary-bg-1);-webkit-text-fill-color:currentcolor;opacity:1}vaadin-combo-box::part(input-field){padding:0}';
var Pm = Object.defineProperty, Sm = Object.getOwnPropertyDescriptor, Im = Object.getPrototypeOf, Tm = Reflect.get, oi = (n, t, e, r) => {
  for (var i = r > 1 ? void 0 : r ? Sm(t, e) : t, s = n.length - 1, l; s >= 0; s--)
    (l = n[s]) && (i = (r ? l(t, e, i) : l(i)) || i);
  return r && i && Pm(t, e, i), i;
}, Om = (n, t, e) => Tm(Im(n), e, t);
let Le = class extends ei {
  // @property()
  // public timeZone: string;
  constructor() {
    super(), this.timeZones = [], this.value = null, this.text = "", this.disabled = !1;
  }
  updated(n) {
    var t;
    if (super.updated(n), n.has("apiContext") && this.apiConnected(), n.has("value")) {
      const e = (t = this.shadowRoot) == null ? void 0 : t.querySelector("vaadin-combo-box");
      e && !this.value && (e.value = "");
    }
  }
  // willUpdate(_changedProperties: any) {
  //     // if (_changedProperties.has("identifiers") || _changedProperties.has("recordTypeFilter")) {
  //     //     this.prepareIdentifiers();
  //     // }
  // }
  apiConnected() {
    this.kioskTimeZones = new im(this.apiContext), this.fetchFavouriteTimeZones();
  }
  fetchFavouriteTimeZones() {
    this.kioskTimeZones && this.kioskTimeZones.getFavouriteTimeZones(!1, !0).then((n) => {
      this.addTimeZones(n, !0), this.kioskTimeZones && this.kioskTimeZones.getAllTimeZones().then((t) => {
        t && this.addTimeZones(t, !1);
      });
    });
  }
  addTimeZones(n, t = !1) {
    const e = n.filter((r) => t || r.favourite == 1).map((r) => ({ label: r.tz_long, value: r.id }));
    t || (e.push({ label: "------", value: -1 }), e.push(...n.filter((r) => r.favourite != 1).map((r) => ({ label: r.tz_long, value: r.id })))), this.timeZones = e;
  }
  timeZoneChanged(n) {
    const t = n.target;
    t.selectedItem && t.selectedItem.value > -1 ? (this.value = t.selectedItem.value, this.text = t.selectedItem.label) : (this.value = null, this.text = "", this.requestUpdate("value", -1)), n.preventDefault();
    const e = new CustomEvent("change");
    this.dispatchEvent(e);
  }
  apiRender() {
    return Fr`
            <vaadin-combo-box id="kiosk-tz-combo-box" ?disabled="${this.disabled || this.timeZones.length == 0}" .value=${this.value && this.value > -1 ? this.value : ""} @change=${this.timeZoneChanged} .items="${this.timeZones}" ></vaadin-combo-box>
        `;
  }
};
Le.styles = un(km);
Le.properties = {
  ...Om(Le, Le, "properties")
};
oi([
  Vc()
], Le.prototype, "timeZones", 2);
oi([
  Se({ type: Number, reflect: !0 })
], Le.prototype, "value", 2);
oi([
  Se({ type: String, reflect: !0 })
], Le.prototype, "text", 2);
oi([
  Se({ attribute: !0, type: Boolean, reflect: !0 })
], Le.prototype, "disabled", 2);
Le = oi([
  Ss("kiosk-tz-combo-box")
], Le);
export {
  w_ as ComboBox,
  vp as Grid,
  xe as KioskContextSelector,
  Tt as KioskDialog,
  Le as KioskTZComboBox
};
