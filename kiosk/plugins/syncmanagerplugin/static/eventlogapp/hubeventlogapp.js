var Gn = Object.getPrototypeOf;
var jn = Reflect.get;
var Yt = (r, e, t) => jn(Gn(r), t, e);
/**
 * @license
 * Copyright 2019 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const Ze = globalThis, It = Ze.ShadowRoot && (Ze.ShadyCSS === void 0 || Ze.ShadyCSS.nativeShadow) && "adoptedStyleSheets" in Document.prototype && "replace" in CSSStyleSheet.prototype, Fr = Symbol(), Gt = /* @__PURE__ */ new WeakMap();
let Jn = class {
  constructor(e, t, n) {
    if (this._$cssResult$ = !0, n !== Fr)
      throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");
    this.cssText = e, this.t = t;
  }
  get styleSheet() {
    let e = this.o;
    const t = this.t;
    if (It && e === void 0) {
      const n = t !== void 0 && t.length === 1;
      n && (e = Gt.get(t)), e === void 0 && ((this.o = e = new CSSStyleSheet()).replaceSync(this.cssText), n && Gt.set(t, e));
    }
    return e;
  }
  toString() {
    return this.cssText;
  }
};
const Dt = (r) => new Jn(typeof r == "string" ? r : r + "", void 0, Fr), Bn = (r, e) => {
  if (It)
    r.adoptedStyleSheets = e.map((t) => t instanceof CSSStyleSheet ? t : t.styleSheet);
  else
    for (const t of e) {
      const n = document.createElement("style"), s = Ze.litNonce;
      s !== void 0 && n.setAttribute("nonce", s), n.textContent = t.cssText, r.appendChild(n);
    }
}, jt = It ? (r) => r : (r) => r instanceof CSSStyleSheet ? ((e) => {
  let t = "";
  for (const n of e.cssRules)
    t += n.cssText;
  return Dt(t);
})(r) : r;
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const { is: Kn, defineProperty: Qn, getOwnPropertyDescriptor: Xn, getOwnPropertyNames: es, getOwnPropertySymbols: ts, getPrototypeOf: rs } = Object, q = globalThis, Jt = q.trustedTypes, ns = Jt ? Jt.emptyScript : "", lt = q.reactiveElementPolyfillSupport, $e = (r, e) => r, Ye = { toAttribute(r, e) {
  switch (e) {
    case Boolean:
      r = r ? ns : null;
      break;
    case Object:
    case Array:
      r = r == null ? r : JSON.stringify(r);
  }
  return r;
}, fromAttribute(r, e) {
  let t = r;
  switch (e) {
    case Boolean:
      t = r !== null;
      break;
    case Number:
      t = r === null ? null : Number(r);
      break;
    case Object:
    case Array:
      try {
        t = JSON.parse(r);
      } catch {
        t = null;
      }
  }
  return t;
} }, _t = (r, e) => !Kn(r, e), Bt = { attribute: !0, type: String, converter: Ye, reflect: !1, hasChanged: _t };
Symbol.metadata ?? (Symbol.metadata = Symbol("metadata")), q.litPropertyMetadata ?? (q.litPropertyMetadata = /* @__PURE__ */ new WeakMap());
class ie extends HTMLElement {
  static addInitializer(e) {
    this._$Ei(), (this.l ?? (this.l = [])).push(e);
  }
  static get observedAttributes() {
    return this.finalize(), this._$Eh && [...this._$Eh.keys()];
  }
  static createProperty(e, t = Bt) {
    if (t.state && (t.attribute = !1), this._$Ei(), this.elementProperties.set(e, t), !t.noAccessor) {
      const n = Symbol(), s = this.getPropertyDescriptor(e, n, t);
      s !== void 0 && Qn(this.prototype, e, s);
    }
  }
  static getPropertyDescriptor(e, t, n) {
    const { get: s, set: i } = Xn(this.prototype, e) ?? { get() {
      return this[t];
    }, set(o) {
      this[t] = o;
    } };
    return { get() {
      return s == null ? void 0 : s.call(this);
    }, set(o) {
      const a = s == null ? void 0 : s.call(this);
      i.call(this, o), this.requestUpdate(e, a, n);
    }, configurable: !0, enumerable: !0 };
  }
  static getPropertyOptions(e) {
    return this.elementProperties.get(e) ?? Bt;
  }
  static _$Ei() {
    if (this.hasOwnProperty($e("elementProperties")))
      return;
    const e = rs(this);
    e.finalize(), e.l !== void 0 && (this.l = [...e.l]), this.elementProperties = new Map(e.elementProperties);
  }
  static finalize() {
    if (this.hasOwnProperty($e("finalized")))
      return;
    if (this.finalized = !0, this._$Ei(), this.hasOwnProperty($e("properties"))) {
      const t = this.properties, n = [...es(t), ...ts(t)];
      for (const s of n)
        this.createProperty(s, t[s]);
    }
    const e = this[Symbol.metadata];
    if (e !== null) {
      const t = litPropertyMetadata.get(e);
      if (t !== void 0)
        for (const [n, s] of t)
          this.elementProperties.set(n, s);
    }
    this._$Eh = /* @__PURE__ */ new Map();
    for (const [t, n] of this.elementProperties) {
      const s = this._$Eu(t, n);
      s !== void 0 && this._$Eh.set(s, t);
    }
    this.elementStyles = this.finalizeStyles(this.styles);
  }
  static finalizeStyles(e) {
    const t = [];
    if (Array.isArray(e)) {
      const n = new Set(e.flat(1 / 0).reverse());
      for (const s of n)
        t.unshift(jt(s));
    } else
      e !== void 0 && t.push(jt(e));
    return t;
  }
  static _$Eu(e, t) {
    const n = t.attribute;
    return n === !1 ? void 0 : typeof n == "string" ? n : typeof e == "string" ? e.toLowerCase() : void 0;
  }
  constructor() {
    super(), this._$Ep = void 0, this.isUpdatePending = !1, this.hasUpdated = !1, this._$Em = null, this._$Ev();
  }
  _$Ev() {
    var e;
    this._$Eg = new Promise((t) => this.enableUpdating = t), this._$AL = /* @__PURE__ */ new Map(), this._$ES(), this.requestUpdate(), (e = this.constructor.l) == null || e.forEach((t) => t(this));
  }
  addController(e) {
    var t;
    (this._$E_ ?? (this._$E_ = /* @__PURE__ */ new Set())).add(e), this.renderRoot !== void 0 && this.isConnected && ((t = e.hostConnected) == null || t.call(e));
  }
  removeController(e) {
    var t;
    (t = this._$E_) == null || t.delete(e);
  }
  _$ES() {
    const e = /* @__PURE__ */ new Map(), t = this.constructor.elementProperties;
    for (const n of t.keys())
      this.hasOwnProperty(n) && (e.set(n, this[n]), delete this[n]);
    e.size > 0 && (this._$Ep = e);
  }
  createRenderRoot() {
    const e = this.shadowRoot ?? this.attachShadow(this.constructor.shadowRootOptions);
    return Bn(e, this.constructor.elementStyles), e;
  }
  connectedCallback() {
    var e;
    this.renderRoot ?? (this.renderRoot = this.createRenderRoot()), this.enableUpdating(!0), (e = this._$E_) == null || e.forEach((t) => {
      var n;
      return (n = t.hostConnected) == null ? void 0 : n.call(t);
    });
  }
  enableUpdating(e) {
  }
  disconnectedCallback() {
    var e;
    (e = this._$E_) == null || e.forEach((t) => {
      var n;
      return (n = t.hostDisconnected) == null ? void 0 : n.call(t);
    });
  }
  attributeChangedCallback(e, t, n) {
    this._$AK(e, n);
  }
  _$EO(e, t) {
    var i;
    const n = this.constructor.elementProperties.get(e), s = this.constructor._$Eu(e, n);
    if (s !== void 0 && n.reflect === !0) {
      const o = (((i = n.converter) == null ? void 0 : i.toAttribute) !== void 0 ? n.converter : Ye).toAttribute(t, n.type);
      this._$Em = e, o == null ? this.removeAttribute(s) : this.setAttribute(s, o), this._$Em = null;
    }
  }
  _$AK(e, t) {
    var i;
    const n = this.constructor, s = n._$Eh.get(e);
    if (s !== void 0 && this._$Em !== s) {
      const o = n.getPropertyOptions(s), a = typeof o.converter == "function" ? { fromAttribute: o.converter } : ((i = o.converter) == null ? void 0 : i.fromAttribute) !== void 0 ? o.converter : Ye;
      this._$Em = s, this[s] = a.fromAttribute(t, o.type), this._$Em = null;
    }
  }
  requestUpdate(e, t, n, s = !1, i) {
    if (e !== void 0) {
      if (n ?? (n = this.constructor.getPropertyOptions(e)), !(n.hasChanged ?? _t)(s ? i : this[e], t))
        return;
      this.C(e, t, n);
    }
    this.isUpdatePending === !1 && (this._$Eg = this._$EP());
  }
  C(e, t, n) {
    this._$AL.has(e) || this._$AL.set(e, t), n.reflect === !0 && this._$Em !== e && (this._$Ej ?? (this._$Ej = /* @__PURE__ */ new Set())).add(e);
  }
  async _$EP() {
    this.isUpdatePending = !0;
    try {
      await this._$Eg;
    } catch (t) {
      Promise.reject(t);
    }
    const e = this.scheduleUpdate();
    return e != null && await e, !this.isUpdatePending;
  }
  scheduleUpdate() {
    return this.performUpdate();
  }
  performUpdate() {
    var n;
    if (!this.isUpdatePending)
      return;
    if (!this.hasUpdated) {
      if (this.renderRoot ?? (this.renderRoot = this.createRenderRoot()), this._$Ep) {
        for (const [i, o] of this._$Ep)
          this[i] = o;
        this._$Ep = void 0;
      }
      const s = this.constructor.elementProperties;
      if (s.size > 0)
        for (const [i, o] of s)
          o.wrapped !== !0 || this._$AL.has(i) || this[i] === void 0 || this.C(i, this[i], o);
    }
    let e = !1;
    const t = this._$AL;
    try {
      e = this.shouldUpdate(t), e ? (this.willUpdate(t), (n = this._$E_) == null || n.forEach((s) => {
        var i;
        return (i = s.hostUpdate) == null ? void 0 : i.call(s);
      }), this.update(t)) : this._$ET();
    } catch (s) {
      throw e = !1, this._$ET(), s;
    }
    e && this._$AE(t);
  }
  willUpdate(e) {
  }
  _$AE(e) {
    var t;
    (t = this._$E_) == null || t.forEach((n) => {
      var s;
      return (s = n.hostUpdated) == null ? void 0 : s.call(n);
    }), this.hasUpdated || (this.hasUpdated = !0, this.firstUpdated(e)), this.updated(e);
  }
  _$ET() {
    this._$AL = /* @__PURE__ */ new Map(), this.isUpdatePending = !1;
  }
  get updateComplete() {
    return this.getUpdateComplete();
  }
  getUpdateComplete() {
    return this._$Eg;
  }
  shouldUpdate(e) {
    return !0;
  }
  update(e) {
    this._$Ej && (this._$Ej = this._$Ej.forEach((t) => this._$EO(t, this[t]))), this._$ET();
  }
  updated(e) {
  }
  firstUpdated(e) {
  }
}
ie.elementStyles = [], ie.shadowRootOptions = { mode: "open" }, ie[$e("elementProperties")] = /* @__PURE__ */ new Map(), ie[$e("finalized")] = /* @__PURE__ */ new Map(), lt == null || lt({ ReactiveElement: ie }), (q.reactiveElementVersions ?? (q.reactiveElementVersions = [])).push("2.0.2");
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const xe = globalThis, Ge = xe.trustedTypes, Kt = Ge ? Ge.createPolicy("lit-html", { createHTML: (r) => r }) : void 0, Vr = "$lit$", Z = `lit$${(Math.random() + "").slice(9)}$`, Wr = "?" + Z, ss = `<${Wr}>`, Q = document, Ee = () => Q.createComment(""), Ne = (r) => r === null || typeof r != "object" && typeof r != "function", Lr = Array.isArray, is = (r) => Lr(r) || typeof (r == null ? void 0 : r[Symbol.iterator]) == "function", ct = `[ 	
\f\r]`, ve = /<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g, Qt = /-->/g, Xt = />/g, Y = RegExp(`>|${ct}(?:([^\\s"'>=/]+)(${ct}*=${ct}*(?:[^ 	
\f\r"'\`<>=]|("|')|))|$)`, "g"), er = /'/g, tr = /"/g, Ur = /^(?:script|style|textarea|title)$/i, os = (r) => (e, ...t) => ({ _$litType$: r, strings: e, values: t }), O = os(1), de = Symbol.for("lit-noChange"), $ = Symbol.for("lit-nothing"), rr = /* @__PURE__ */ new WeakMap(), J = Q.createTreeWalker(Q, 129);
function Rr(r, e) {
  if (!Array.isArray(r) || !r.hasOwnProperty("raw"))
    throw Error("invalid template strings array");
  return Kt !== void 0 ? Kt.createHTML(e) : e;
}
const as = (r, e) => {
  const t = r.length - 1, n = [];
  let s, i = e === 2 ? "<svg>" : "", o = ve;
  for (let a = 0; a < t; a++) {
    const l = r[a];
    let c, d, h = -1, p = 0;
    for (; p < l.length && (o.lastIndex = p, d = o.exec(l), d !== null); )
      p = o.lastIndex, o === ve ? d[1] === "!--" ? o = Qt : d[1] !== void 0 ? o = Xt : d[2] !== void 0 ? (Ur.test(d[2]) && (s = RegExp("</" + d[2], "g")), o = Y) : d[3] !== void 0 && (o = Y) : o === Y ? d[0] === ">" ? (o = s ?? ve, h = -1) : d[1] === void 0 ? h = -2 : (h = o.lastIndex - d[2].length, c = d[1], o = d[3] === void 0 ? Y : d[3] === '"' ? tr : er) : o === tr || o === er ? o = Y : o === Qt || o === Xt ? o = ve : (o = Y, s = void 0);
    const f = o === Y && r[a + 1].startsWith("/>") ? " " : "";
    i += o === ve ? l + ss : h >= 0 ? (n.push(c), l.slice(0, h) + Vr + l.slice(h) + Z + f) : l + Z + (h === -2 ? a : f);
  }
  return [Rr(r, i + (r[t] || "<?>") + (e === 2 ? "</svg>" : "")), n];
};
class Ce {
  constructor({ strings: e, _$litType$: t }, n) {
    let s;
    this.parts = [];
    let i = 0, o = 0;
    const a = e.length - 1, l = this.parts, [c, d] = as(e, t);
    if (this.el = Ce.createElement(c, n), J.currentNode = this.el.content, t === 2) {
      const h = this.el.content.firstChild;
      h.replaceWith(...h.childNodes);
    }
    for (; (s = J.nextNode()) !== null && l.length < a; ) {
      if (s.nodeType === 1) {
        if (s.hasAttributes())
          for (const h of s.getAttributeNames())
            if (h.endsWith(Vr)) {
              const p = d[o++], f = s.getAttribute(h).split(Z), v = /([.?@])?(.*)/.exec(p);
              l.push({ type: 1, index: i, name: v[2], strings: f, ctor: v[1] === "." ? cs : v[1] === "?" ? us : v[1] === "@" ? ds : Xe }), s.removeAttribute(h);
            } else
              h.startsWith(Z) && (l.push({ type: 6, index: i }), s.removeAttribute(h));
        if (Ur.test(s.tagName)) {
          const h = s.textContent.split(Z), p = h.length - 1;
          if (p > 0) {
            s.textContent = Ge ? Ge.emptyScript : "";
            for (let f = 0; f < p; f++)
              s.append(h[f], Ee()), J.nextNode(), l.push({ type: 2, index: ++i });
            s.append(h[p], Ee());
          }
        }
      } else if (s.nodeType === 8)
        if (s.data === Wr)
          l.push({ type: 2, index: i });
        else {
          let h = -1;
          for (; (h = s.data.indexOf(Z, h + 1)) !== -1; )
            l.push({ type: 7, index: i }), h += Z.length - 1;
        }
      i++;
    }
  }
  static createElement(e, t) {
    const n = Q.createElement("template");
    return n.innerHTML = e, n;
  }
}
function he(r, e, t = r, n) {
  var o, a;
  if (e === de)
    return e;
  let s = n !== void 0 ? (o = t._$Co) == null ? void 0 : o[n] : t._$Cl;
  const i = Ne(e) ? void 0 : e._$litDirective$;
  return (s == null ? void 0 : s.constructor) !== i && ((a = s == null ? void 0 : s._$AO) == null || a.call(s, !1), i === void 0 ? s = void 0 : (s = new i(r), s._$AT(r, t, n)), n !== void 0 ? (t._$Co ?? (t._$Co = []))[n] = s : t._$Cl = s), s !== void 0 && (e = he(r, s._$AS(r, e.values), s, n)), e;
}
class ls {
  constructor(e, t) {
    this._$AV = [], this._$AN = void 0, this._$AD = e, this._$AM = t;
  }
  get parentNode() {
    return this._$AM.parentNode;
  }
  get _$AU() {
    return this._$AM._$AU;
  }
  u(e) {
    const { el: { content: t }, parts: n } = this._$AD, s = ((e == null ? void 0 : e.creationScope) ?? Q).importNode(t, !0);
    J.currentNode = s;
    let i = J.nextNode(), o = 0, a = 0, l = n[0];
    for (; l !== void 0; ) {
      if (o === l.index) {
        let c;
        l.type === 2 ? c = new Ie(i, i.nextSibling, this, e) : l.type === 1 ? c = new l.ctor(i, l.name, l.strings, this, e) : l.type === 6 && (c = new hs(i, this, e)), this._$AV.push(c), l = n[++a];
      }
      o !== (l == null ? void 0 : l.index) && (i = J.nextNode(), o++);
    }
    return J.currentNode = Q, s;
  }
  p(e) {
    let t = 0;
    for (const n of this._$AV)
      n !== void 0 && (n.strings !== void 0 ? (n._$AI(e, n, t), t += n.strings.length - 2) : n._$AI(e[t])), t++;
  }
}
class Ie {
  get _$AU() {
    var e;
    return ((e = this._$AM) == null ? void 0 : e._$AU) ?? this._$Cv;
  }
  constructor(e, t, n, s) {
    this.type = 2, this._$AH = $, this._$AN = void 0, this._$AA = e, this._$AB = t, this._$AM = n, this.options = s, this._$Cv = (s == null ? void 0 : s.isConnected) ?? !0;
  }
  get parentNode() {
    let e = this._$AA.parentNode;
    const t = this._$AM;
    return t !== void 0 && (e == null ? void 0 : e.nodeType) === 11 && (e = t.parentNode), e;
  }
  get startNode() {
    return this._$AA;
  }
  get endNode() {
    return this._$AB;
  }
  _$AI(e, t = this) {
    e = he(this, e, t), Ne(e) ? e === $ || e == null || e === "" ? (this._$AH !== $ && this._$AR(), this._$AH = $) : e !== this._$AH && e !== de && this._(e) : e._$litType$ !== void 0 ? this.g(e) : e.nodeType !== void 0 ? this.$(e) : is(e) ? this.T(e) : this._(e);
  }
  k(e) {
    return this._$AA.parentNode.insertBefore(e, this._$AB);
  }
  $(e) {
    this._$AH !== e && (this._$AR(), this._$AH = this.k(e));
  }
  _(e) {
    this._$AH !== $ && Ne(this._$AH) ? this._$AA.nextSibling.data = e : this.$(Q.createTextNode(e)), this._$AH = e;
  }
  g(e) {
    var i;
    const { values: t, _$litType$: n } = e, s = typeof n == "number" ? this._$AC(e) : (n.el === void 0 && (n.el = Ce.createElement(Rr(n.h, n.h[0]), this.options)), n);
    if (((i = this._$AH) == null ? void 0 : i._$AD) === s)
      this._$AH.p(t);
    else {
      const o = new ls(s, this), a = o.u(this.options);
      o.p(t), this.$(a), this._$AH = o;
    }
  }
  _$AC(e) {
    let t = rr.get(e.strings);
    return t === void 0 && rr.set(e.strings, t = new Ce(e)), t;
  }
  T(e) {
    Lr(this._$AH) || (this._$AH = [], this._$AR());
    const t = this._$AH;
    let n, s = 0;
    for (const i of e)
      s === t.length ? t.push(n = new Ie(this.k(Ee()), this.k(Ee()), this, this.options)) : n = t[s], n._$AI(i), s++;
    s < t.length && (this._$AR(n && n._$AB.nextSibling, s), t.length = s);
  }
  _$AR(e = this._$AA.nextSibling, t) {
    var n;
    for ((n = this._$AP) == null ? void 0 : n.call(this, !1, !0, t); e && e !== this._$AB; ) {
      const s = e.nextSibling;
      e.remove(), e = s;
    }
  }
  setConnected(e) {
    var t;
    this._$AM === void 0 && (this._$Cv = e, (t = this._$AP) == null || t.call(this, e));
  }
}
class Xe {
  get tagName() {
    return this.element.tagName;
  }
  get _$AU() {
    return this._$AM._$AU;
  }
  constructor(e, t, n, s, i) {
    this.type = 1, this._$AH = $, this._$AN = void 0, this.element = e, this.name = t, this._$AM = s, this.options = i, n.length > 2 || n[0] !== "" || n[1] !== "" ? (this._$AH = Array(n.length - 1).fill(new String()), this.strings = n) : this._$AH = $;
  }
  _$AI(e, t = this, n, s) {
    const i = this.strings;
    let o = !1;
    if (i === void 0)
      e = he(this, e, t, 0), o = !Ne(e) || e !== this._$AH && e !== de, o && (this._$AH = e);
    else {
      const a = e;
      let l, c;
      for (e = i[0], l = 0; l < i.length - 1; l++)
        c = he(this, a[n + l], t, l), c === de && (c = this._$AH[l]), o || (o = !Ne(c) || c !== this._$AH[l]), c === $ ? e = $ : e !== $ && (e += (c ?? "") + i[l + 1]), this._$AH[l] = c;
    }
    o && !s && this.O(e);
  }
  O(e) {
    e === $ ? this.element.removeAttribute(this.name) : this.element.setAttribute(this.name, e ?? "");
  }
}
class cs extends Xe {
  constructor() {
    super(...arguments), this.type = 3;
  }
  O(e) {
    this.element[this.name] = e === $ ? void 0 : e;
  }
}
class us extends Xe {
  constructor() {
    super(...arguments), this.type = 4;
  }
  O(e) {
    this.element.toggleAttribute(this.name, !!e && e !== $);
  }
}
class ds extends Xe {
  constructor(e, t, n, s, i) {
    super(e, t, n, s, i), this.type = 5;
  }
  _$AI(e, t = this) {
    if ((e = he(this, e, t, 0) ?? $) === de)
      return;
    const n = this._$AH, s = e === $ && n !== $ || e.capture !== n.capture || e.once !== n.once || e.passive !== n.passive, i = e !== $ && (n === $ || s);
    s && this.element.removeEventListener(this.name, this, n), i && this.element.addEventListener(this.name, this, e), this._$AH = e;
  }
  handleEvent(e) {
    var t;
    typeof this._$AH == "function" ? this._$AH.call(((t = this.options) == null ? void 0 : t.host) ?? this.element, e) : this._$AH.handleEvent(e);
  }
}
class hs {
  constructor(e, t, n) {
    this.element = e, this.type = 6, this._$AN = void 0, this._$AM = t, this.options = n;
  }
  get _$AU() {
    return this._$AM._$AU;
  }
  _$AI(e) {
    he(this, e);
  }
}
const ut = xe.litHtmlPolyfillSupport;
ut == null || ut(Ce, Ie), (xe.litHtmlVersions ?? (xe.litHtmlVersions = [])).push("3.1.0");
const fs = (r, e, t) => {
  const n = (t == null ? void 0 : t.renderBefore) ?? e;
  let s = n._$litPart$;
  if (s === void 0) {
    const i = (t == null ? void 0 : t.renderBefore) ?? null;
    n._$litPart$ = s = new Ie(e.insertBefore(Ee(), i), i, void 0, t ?? {});
  }
  return s._$AI(r), s;
};
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
let le = class extends ie {
  constructor() {
    super(...arguments), this.renderOptions = { host: this }, this._$Do = void 0;
  }
  createRenderRoot() {
    var t;
    const e = super.createRenderRoot();
    return (t = this.renderOptions).renderBefore ?? (t.renderBefore = e.firstChild), e;
  }
  update(e) {
    const t = this.render();
    this.hasUpdated || (this.renderOptions.isConnected = this.isConnected), super.update(e), this._$Do = fs(t, this.renderRoot, this.renderOptions);
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
    return de;
  }
};
var Ar;
le._$litElement$ = !0, le.finalized = !0, (Ar = globalThis.litElementHydrateSupport) == null || Ar.call(globalThis, { LitElement: le });
const dt = globalThis.litElementPolyfillSupport;
dt == null || dt({ LitElement: le });
(globalThis.litElementVersions ?? (globalThis.litElementVersions = [])).push("4.0.2");
const Pr = 2, St = 3, zt = class zt extends le {
  constructor() {
    super(), this.kiosk_base_url = "/", this.appErrors = [], this.apiContext = void 0, this.showProgress = !1;
  }
  onAppMessage(e) {
    this.addAppError(e.detail.headline + "<br>" + e.detail.body);
  }
  firstUpdated(e) {
    super.firstUpdated(e), this.addEventListener("send-message", this.onAppMessage);
  }
  updated(e) {
    e.has("apiContext") && (this.showProgress = !1, this.apiContext && this.apiContext.status === St && this.addAppError("Cannot connect to Kiosk API."), !e.apiContext && this.apiContext && this.apiConnected());
  }
  apiConnected() {
  }
  render() {
    let e;
    return this.apiContext && this.apiContext.status === Pr ? e = this.apiRender() : this.apiContext && this.apiContext.status === St ? e = this.renderApiError() : e = this.renderNoContextYet(), O`
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
            ${this.renderProgress()} ${this.renderErrors()} ${e}
        `;
  }
  renderNoContextYet() {
    return O` <link rel="stylesheet" href="${this.kiosk_base_url}static/styles.css" /> `;
  }
  renderApiError() {
  }
  renderErrors() {
    if (this.appErrors.length > 0)
      return O` ${this.appErrors.map((e) => O`<div class="system-message" @click="${this.errorClicked}">${e}</div>`)} `;
  }
  errorClicked(e) {
    this.deleteError(e.target.textContent);
  }
  renderProgress(e = !1) {
    if (e || this.showProgress)
      return O` <div class="loading">
                <div class="loading-progress"></div>
            </div>`;
  }
  addAppError(e) {
    this.appErrors.push(e), this.requestUpdate();
  }
  deleteError(e) {
    let t = -1;
    this.appErrors.find((n, s) => n === e ? (t = s, !0) : !1), t > -1 && (this.appErrors.splice(t, 1), this.appErrors = [...this.appErrors]);
  }
};
zt.properties = {
  /**
   * The Api Context
   */
  apiContext: { type: Object },
  appErrors: { type: Array },
  showProgress: { type: Boolean }
};
let Tt = zt;
/**
 * @license
 * Copyright 2020 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const ms = Symbol.for(""), gs = (r) => {
  if ((r == null ? void 0 : r.r) === ms)
    return r == null ? void 0 : r._$litStatic$;
}, nr = /* @__PURE__ */ new Map(), ps = (r) => (e, ...t) => {
  const n = t.length;
  let s, i;
  const o = [], a = [];
  let l, c = 0, d = !1;
  for (; c < n; ) {
    for (l = e[c]; c < n && (i = t[c], (s = gs(i)) !== void 0); )
      l += s + e[++c], d = !0;
    c !== n && a.push(i), o.push(l), c++;
  }
  if (c === n && o.push(e[n]), d) {
    const h = o.join("$$lit$$");
    (e = nr.get(h)) === void 0 && (o.raw = o, nr.set(h, e = o)), t = a;
  }
  return r(e, ...t);
}, re = ps(O), ys = '.col-bg-body-lighter{background-color:var(--col-bg-body-lighter)}.col-bg-body{background-color:var(--col-bg-body)}.col-bg-body-darker{background-color:var(--col-bg-body-darker)}.col-bg-1-lighter{background-color:var(--col-bg-1-lighter)}.col-bg-1{background-color:var(--col-bg-1)}.col-bg-1-darker{background-color:var(--col-bg-1-darker)}.col-bg-1-input{background-color:var(--col-bg-1-input)}.col-primary-bg-1{background-color:var(--col-primary-bg-1)}.col-accent-bg-1{background-color:var(--col-accent-bg-1)}.col-success-bg-1{background-color:var(--col-success-bg-1)}.col-warning-bg-1{background-color:var(--col-warning-bg-1)}.col-error-bg-1{background-color:var(--col-error-bg-1)}.col-bg-2-lighter{background-color:var(--col-bg-2-lighter)}.col-bg-2{background-color:var(--col-bg-2)}.col-bg-2-darker{background-color:var(--col-bg-2-darker)}.col-bg-2-button{background-color:var(--col-bg-2-button)}.col-bg-2-input{background-color:var(--col-bg-2-input)}.col-primary-bg-2{background-color:var(--col-primary-bg-2)}.col-accent-bg-2{background-color:var(--col-accent-bg-2)}.col-success-bg-2{background-color:var(--col-success-bg-2)}.col-warning-bg-2{background-color:var(--col-warning-bg-2)}.col-error-bg-2{background-color:var(--col-error-bg-2)}.col-bg-3-lighter{background-color:var(--col-bg-3-lighter)}.col-bg-3{background-color:var(--col-bg-3)}.col-bg-3-darker{background-color:var(--col-bg-3-darker)}.col-bg-3-button{background-color:var(--col-bg-3-button)}.col-bg-3-input{background-color:var(--col-bg-3-input)}.col-primary-bg-3{background-color:var(--col-primary-bg-3)}.col-accent-bg-3{background-color:var(--col-accent-bg-3)}.col-success-bg-3{background-color:var(--col-success-bg-3)}.col-warning-bg-3{background-color:var(--col-warning-bg-3)}.col-error-bg-3{background-color:var(--col-error-bg-3)}.col-bg-ack-lighter{background-color:var(--col-bg-ack-lighter)}.col-bg-ack{background-color:var(--col-bg-ack)}.col-bg-ack-darker{background-color:var(--col-bg-ack-darker)}.col-primary-bg-ack{background-color:var(--col-primary-bg-ack)}.col-accent-bg-ack{background-color:var(--col-accent-bg-ack)}.col-bg-att-lighter{background-color:var(--col-bg-att-lighter)}.col-bg-att{background-color:var(--col-bg-att)}.col-bg-att-darker{background-color:var(--col-bg-att-darker)}.col-primary-bg-att{background-color:var(--col-primary-bg-att)}.col-accent-bg-att{background-color:var(--col-accent-bg-att)}.col-bg-alert-lighter{background-color:var(--col-bg-alert-lighter)}.col-bg-alert{background-color:var(--col-bg-alert)}.col-bg-alert-darker{background-color:var(--col-bg-alert-darker)}.col-primary-bg-alert{background-color:var(--col-primary-bg-alert)}.col-accent-bg-alert{background-color:var(--col-accent-bg-alert)}.col-bg-btn-lighter{background-color:var(--col-bg-btn-lighter)}.col-bg-btn{background-color:var(--col-bg-btn)}.col-bg-btn-darker{background-color:var(--col-bg-btn-darker)}.col-primary-bg-btn{background-color:var(--col-primary-bg-btn)}.col-accent-bg-btn{background-color:var(--col-accent-bg-btn)}.pattern-diagonal-stripes-sm{background:repeating-linear-gradient(45deg,transparent,transparent 10px,currentColor 10px,currentColor 20px)}.pattern-dots-lg{background-image:radial-gradient(currentColor 1.5px,transparent 1.5px);background-size:15px 15px}.pattern-dots-md{background-image:radial-gradient(currentColor 1px,transparent 1px);background-size:8px 8px}.pattern-dots-medium-dense{background-image:radial-gradient(currentColor .5px,transparent .5px);background-size:3px 3px}.pattern-dots-sm{background-image:radial-gradient(currentColor .5px,transparent .5px);background-size:5px 5px}.pattern-cross-dots-md,.imagelist-background{background-image:radial-gradient(currentColor .7px,transparent 1px),radial-gradient(currentColor .7px,transparent 1px);background-size:6.5px 6.5px;background-position:0 0,3.5px 3.5px}.imagelist-background{background-color:#fff9;background-blend-mode:overlay}p,div{padding:0;margin:0;border:0px;-webkit-user-select:text;user-select:text}select{-webkit-user-select:none;user-select:none}.fa,.fas{font-family:"Font Awesome 5 Free";font-weight:900;font-style:normal}.fa-trash:before{content:""}.fa-view-grid:before{content:""}.fa-reload:before{content:""}.fa-view-list:before{content:""}.fa-camera:before{content:""}.fa-view-image:before{content:""}.fa-check:before{content:""}.fa-bug:before{content:""}.fa-lightbulb:before{content:""}.fa-desc:before{content:""}.fa-asc:before{content:""}:host{display:block;width:100%}div,p{font-family:var(--standard-text-font)}.center-div{display:flex;flex-direction:column;align-items:center;background:var(--col-bg-body)}.wait-for-login{display:grid;place-items:center;height:100vh;background-color:var(--col-bg-body)}.wait-for-login p{font-family:var(--headline-text-font);font-size:var(--font-size-h2)}.logged-in-message{background-color:var(--col-bg-ack);color:var(--col-primary-bg-ack);display:grid;place-items:center;font-family:var(--standard-text-font)}.development{background-color:#8b0000;color:#fff;font-family:Courier New,sans-serif;font-size:18px;text-align:center}.toolbar{height:3em;background:var(--col-bg-3);display:flex;flex-direction:row;padding:0 1em;justify-content:space-between;align-items:center}#toolbar-left{display:flex;flex-direction:row;align-items:center}#toolbar-left input{margin-left:1em;height:28px}#toolbar-filters{flex-grow:1}#toolbar-buttons{background-color:var(--col-bg-3-darker);height:100%;display:flex;flex-direction:row;align-items:center;padding:0 1em}.toolbar-button{color:var(--col-primary-bg-3);height:28px}.toolbar-button i{font-size:28px;line-height:100%}.toolbar-button:hover{color:var(--col-accent-bg-3)}.toolbar-button:active{color:var(--col-bg-ack)}.toolbar-button.disabled{opacity:.3}.small-list-button{display:block;margin-right:2em}.small-list-button i{font-size:2em;border-radius:25px;box-shadow:2px 2px 5px #2e380394}.small-list-button:hover{color:var(--col-bg-att)}.small-list-button:hover i{box-shadow:2px 2px 5px #2e380394}.small-list-button:active,.small-list-button:focus{color:var(--col-bg-ack);transform:translateY(5px)}.small-list-button:active i,.small-list-button:focus i{box-shadow:none}';
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const bs = (r) => (e, t) => {
  t !== void 0 ? t.addInitializer(() => {
    customElements.define(r, e);
  }) : customElements.define(r, e);
};
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const ks = { attribute: !0, type: String, converter: Ye, reflect: !1, hasChanged: _t }, vs = (r = ks, e, t) => {
  const { kind: n, metadata: s } = t;
  let i = globalThis.litPropertyMetadata.get(s);
  if (i === void 0 && globalThis.litPropertyMetadata.set(s, i = /* @__PURE__ */ new Map()), i.set(t.name, r), n === "accessor") {
    const { name: o } = t;
    return { set(a) {
      const l = e.get.call(this);
      e.set.call(this, a), this.requestUpdate(o, l, r);
    }, init(a) {
      return a !== void 0 && this.C(o, void 0, r), a;
    } };
  }
  if (n === "setter") {
    const { name: o } = t;
    return function(a) {
      const l = this[o];
      e.call(this, a), this.requestUpdate(o, l, r);
    };
  }
  throw Error("Unsupported decorator location: " + n);
};
function ws(r) {
  return (e, t) => typeof t == "object" ? vs(r, e, t) : ((n, s, i) => {
    const o = s.hasOwnProperty(i);
    return s.constructor.createProperty(i, o ? { ...n, wrapped: !0 } : n), o ? Object.getOwnPropertyDescriptor(s, i) : void 0;
  })(r, e, t);
}
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
function et(r) {
  return ws({ ...r, state: !0, attribute: !1 });
}
const Ss = '.col-bg-body-lighter{background-color:var(--col-bg-body-lighter)}.col-bg-body{background-color:var(--col-bg-body)}.col-bg-body-darker{background-color:var(--col-bg-body-darker)}.col-bg-1-lighter{background-color:var(--col-bg-1-lighter)}.col-bg-1{background-color:var(--col-bg-1)}.col-bg-1-darker{background-color:var(--col-bg-1-darker)}.col-bg-1-input{background-color:var(--col-bg-1-input)}.col-primary-bg-1{background-color:var(--col-primary-bg-1)}.col-accent-bg-1{background-color:var(--col-accent-bg-1)}.col-success-bg-1{background-color:var(--col-success-bg-1)}.col-warning-bg-1{background-color:var(--col-warning-bg-1)}.col-error-bg-1{background-color:var(--col-error-bg-1)}.col-bg-2-lighter{background-color:var(--col-bg-2-lighter)}.col-bg-2{background-color:var(--col-bg-2)}.col-bg-2-darker{background-color:var(--col-bg-2-darker)}.col-bg-2-button{background-color:var(--col-bg-2-button)}.col-bg-2-input{background-color:var(--col-bg-2-input)}.col-primary-bg-2{background-color:var(--col-primary-bg-2)}.col-accent-bg-2{background-color:var(--col-accent-bg-2)}.col-success-bg-2{background-color:var(--col-success-bg-2)}.col-warning-bg-2{background-color:var(--col-warning-bg-2)}.col-error-bg-2{background-color:var(--col-error-bg-2)}.col-bg-3-lighter{background-color:var(--col-bg-3-lighter)}.col-bg-3{background-color:var(--col-bg-3)}.col-bg-3-darker{background-color:var(--col-bg-3-darker)}.col-bg-3-button{background-color:var(--col-bg-3-button)}.col-bg-3-input{background-color:var(--col-bg-3-input)}.col-primary-bg-3{background-color:var(--col-primary-bg-3)}.col-accent-bg-3{background-color:var(--col-accent-bg-3)}.col-success-bg-3{background-color:var(--col-success-bg-3)}.col-warning-bg-3{background-color:var(--col-warning-bg-3)}.col-error-bg-3{background-color:var(--col-error-bg-3)}.col-bg-ack-lighter{background-color:var(--col-bg-ack-lighter)}.col-bg-ack{background-color:var(--col-bg-ack)}.col-bg-ack-darker{background-color:var(--col-bg-ack-darker)}.col-primary-bg-ack{background-color:var(--col-primary-bg-ack)}.col-accent-bg-ack{background-color:var(--col-accent-bg-ack)}.col-bg-att-lighter{background-color:var(--col-bg-att-lighter)}.col-bg-att{background-color:var(--col-bg-att)}.col-bg-att-darker{background-color:var(--col-bg-att-darker)}.col-primary-bg-att{background-color:var(--col-primary-bg-att)}.col-accent-bg-att{background-color:var(--col-accent-bg-att)}.col-bg-alert-lighter{background-color:var(--col-bg-alert-lighter)}.col-bg-alert{background-color:var(--col-bg-alert)}.col-bg-alert-darker{background-color:var(--col-bg-alert-darker)}.col-primary-bg-alert{background-color:var(--col-primary-bg-alert)}.col-accent-bg-alert{background-color:var(--col-accent-bg-alert)}.col-bg-btn-lighter{background-color:var(--col-bg-btn-lighter)}.col-bg-btn{background-color:var(--col-bg-btn)}.col-bg-btn-darker{background-color:var(--col-bg-btn-darker)}.col-primary-bg-btn{background-color:var(--col-primary-bg-btn)}.col-accent-bg-btn{background-color:var(--col-accent-bg-btn)}.pattern-diagonal-stripes-sm{background:repeating-linear-gradient(45deg,transparent,transparent 10px,currentColor 10px,currentColor 20px)}.pattern-dots-lg{background-image:radial-gradient(currentColor 1.5px,transparent 1.5px);background-size:15px 15px}.pattern-dots-md{background-image:radial-gradient(currentColor 1px,transparent 1px);background-size:8px 8px}.pattern-dots-medium-dense{background-image:radial-gradient(currentColor .5px,transparent .5px);background-size:3px 3px}.pattern-dots-sm{background-image:radial-gradient(currentColor .5px,transparent .5px);background-size:5px 5px}.pattern-cross-dots-md,.imagelist-background{background-image:radial-gradient(currentColor .7px,transparent 1px),radial-gradient(currentColor .7px,transparent 1px);background-size:6.5px 6.5px;background-position:0 0,3.5px 3.5px}.imagelist-background{background-color:#fff9;background-blend-mode:overlay}p,div{padding:0;margin:0;border:0px;-webkit-user-select:text;user-select:text}select{-webkit-user-select:none;user-select:none}.fa,.fas{font-family:"Font Awesome 5 Free";font-weight:900;font-style:normal}.fa-trash:before{content:""}.fa-view-grid:before{content:""}.fa-reload:before{content:""}.fa-view-list:before{content:""}.fa-camera:before{content:""}.fa-view-image:before{content:""}.fa-check:before{content:""}.fa-bug:before{content:""}.fa-lightbulb:before{content:""}.fa-desc:before{content:""}.fa-asc:before{content:""}:host{display:block;width:100%}div,p{font-family:var(--standard-text-font)}.center-div{display:flex;flex-direction:column;align-items:center;background:var(--col-bg-body)}.wait-for-login{display:grid;place-items:center;height:100vh;background-color:var(--col-bg-body)}.wait-for-login p{font-family:var(--headline-text-font);font-size:var(--font-size-h2)}.logged-in-message{background-color:var(--col-bg-ack);color:var(--col-primary-bg-ack);display:grid;place-items:center;font-family:var(--standard-text-font)}.development{background-color:#8b0000;color:#fff;font-family:Courier New,sans-serif;font-size:18px;text-align:center}#log-frame{display:grid;grid-template-columns:repeat(4,max-content) auto;width:100%;row-gap:2px;column-gap:1px}.log-cell{padding:0 .5em}.log-header{display:inline-flex;flex-direction:row;justify-content:space-between;position:sticky;top:0;background:var(--col-bg-1);align-items:center;padding:.2em .5em}.log-header .col-btn-grey{opacity:50%}.log-header span{font-weight:700}.log-header i{color:var(--col-accent-bg-1);margin-left:1em}.log-header .dim_sort_col{opacity:50%}';
var Ts = Object.defineProperty, $s = Object.getOwnPropertyDescriptor, xs = (r, e, t, n) => {
  for (var s = n > 1 ? void 0 : n ? $s(e, t) : e, i = r.length - 1, o; i >= 0; i--)
    (o = r[i]) && (s = (n ? o(e, t, s) : o(s)) || s);
  return n && s && Ts(e, t, s), s;
};
const Zt = class Zt extends le {
  constructor() {
    super(), this.kiosk_base_url = "/", this.showProgress = !1, this.apiContext = void 0;
  }
  updated(e) {
    e.has("apiContext") && (this.showProgress = !1);
  }
  render() {
    let e;
    return this.apiContext && this.apiContext.status === Pr ? e = this.apiRender() : this.apiContext && this.apiContext.status === St ? e = this.renderApiError() : e = this.renderNoContextYet(), O`
            <link rel="stylesheet" href="${this.kiosk_base_url}static/styles.css" />
            ${e}
        `;
  }
  renderNoContextYet() {
    return O` <link rel="stylesheet" href="${this.kiosk_base_url}static/styles.css" /> `;
  }
  renderApiError() {
  }
  renderProgress(e = !1) {
    if (e || this.showProgress)
      return O` <div class="loading">
                <div class="loading-progress"></div>
            </div>`;
  }
};
Zt.properties = {
  /**
   * The Api Context
   */
  apiContext: { type: Object }
};
let je = Zt;
xs([
  et()
], je.prototype, "showProgress", 2);
const ht = "MSG_NETWORK_ERROR";
class Os {
  constructor(e, t, n = "") {
    this.messageId = e, this.headline = t, this.body = n;
  }
}
function ft(r, e, t, n = "") {
  let s = new Os(
    e,
    t,
    n
  );
  r.dispatchEvent(new CustomEvent(
    "send-message",
    { bubbles: !0, composed: !0, detail: s }
  ));
}
function Es(r, e, t = "", n = null) {
  if (t && (t += ": "), e.response) {
    if (e.response.status == 403 || e.response.status == 401) {
      ft(
        r,
        ht,
        `${t}You are not logged in properly or your session has timed out`,
        '<a href="/logout">Please log in again.</a>'
      );
      return;
    }
    n ? n(e) : ft(
      r,
      ht,
      `${t}Kiosk server responded with an error.`,
      `(${e.response.statusText}). 
                The server might be down or perhaps you are not logged in properly.`
    );
  } else {
    ft(
      r,
      ht,
      `${t}Kiosk server responded with a network error.`,
      `(${e}). 
            The server might be down or perhaps you are not logged in properly.`
    );
    return;
  }
}
class X extends Error {
}
class Ns extends X {
  constructor(e) {
    super(`Invalid DateTime: ${e.toMessage()}`);
  }
}
class Cs extends X {
  constructor(e) {
    super(`Invalid Interval: ${e.toMessage()}`);
  }
}
class Ms extends X {
  constructor(e) {
    super(`Invalid Duration: ${e.toMessage()}`);
  }
}
class oe extends X {
}
class zr extends X {
  constructor(e) {
    super(`Invalid unit ${e}`);
  }
}
class N extends X {
}
class R extends X {
  constructor() {
    super("Zone is an abstract class");
  }
}
const u = "numeric", V = "short", C = "long", Je = {
  year: u,
  month: u,
  day: u
}, Zr = {
  year: u,
  month: V,
  day: u
}, Is = {
  year: u,
  month: V,
  day: u,
  weekday: V
}, Hr = {
  year: u,
  month: C,
  day: u
}, qr = {
  year: u,
  month: C,
  day: u,
  weekday: C
}, Yr = {
  hour: u,
  minute: u
}, Gr = {
  hour: u,
  minute: u,
  second: u
}, jr = {
  hour: u,
  minute: u,
  second: u,
  timeZoneName: V
}, Jr = {
  hour: u,
  minute: u,
  second: u,
  timeZoneName: C
}, Br = {
  hour: u,
  minute: u,
  hourCycle: "h23"
}, Kr = {
  hour: u,
  minute: u,
  second: u,
  hourCycle: "h23"
}, Qr = {
  hour: u,
  minute: u,
  second: u,
  hourCycle: "h23",
  timeZoneName: V
}, Xr = {
  hour: u,
  minute: u,
  second: u,
  hourCycle: "h23",
  timeZoneName: C
}, en = {
  year: u,
  month: u,
  day: u,
  hour: u,
  minute: u
}, tn = {
  year: u,
  month: u,
  day: u,
  hour: u,
  minute: u,
  second: u
}, rn = {
  year: u,
  month: V,
  day: u,
  hour: u,
  minute: u
}, nn = {
  year: u,
  month: V,
  day: u,
  hour: u,
  minute: u,
  second: u
}, Ds = {
  year: u,
  month: V,
  day: u,
  weekday: V,
  hour: u,
  minute: u
}, sn = {
  year: u,
  month: C,
  day: u,
  hour: u,
  minute: u,
  timeZoneName: V
}, on = {
  year: u,
  month: C,
  day: u,
  hour: u,
  minute: u,
  second: u,
  timeZoneName: V
}, an = {
  year: u,
  month: C,
  day: u,
  weekday: C,
  hour: u,
  minute: u,
  timeZoneName: C
}, ln = {
  year: u,
  month: C,
  day: u,
  weekday: C,
  hour: u,
  minute: u,
  second: u,
  timeZoneName: C
};
class De {
  /**
   * The type of zone
   * @abstract
   * @type {string}
   */
  get type() {
    throw new R();
  }
  /**
   * The name of this zone.
   * @abstract
   * @type {string}
   */
  get name() {
    throw new R();
  }
  get ianaName() {
    return this.name;
  }
  /**
   * Returns whether the offset is known to be fixed for the whole year.
   * @abstract
   * @type {boolean}
   */
  get isUniversal() {
    throw new R();
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
  offsetName(e, t) {
    throw new R();
  }
  /**
   * Returns the offset's value as a string
   * @abstract
   * @param {number} ts - Epoch milliseconds for which to get the offset
   * @param {string} format - What style of offset to return.
   *                          Accepts 'narrow', 'short', or 'techie'. Returning '+6', '+06:00', or '+0600' respectively
   * @return {string}
   */
  formatOffset(e, t) {
    throw new R();
  }
  /**
   * Return the offset in minutes for this zone at the specified timestamp.
   * @abstract
   * @param {number} ts - Epoch milliseconds for which to compute the offset
   * @return {number}
   */
  offset(e) {
    throw new R();
  }
  /**
   * Return whether this Zone is equal to another zone
   * @abstract
   * @param {Zone} otherZone - the zone to compare
   * @return {boolean}
   */
  equals(e) {
    throw new R();
  }
  /**
   * Return whether this Zone is valid.
   * @abstract
   * @type {boolean}
   */
  get isValid() {
    throw new R();
  }
}
let mt = null;
class tt extends De {
  /**
   * Get a singleton instance of the local zone
   * @return {SystemZone}
   */
  static get instance() {
    return mt === null && (mt = new tt()), mt;
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
  offsetName(e, { format: t, locale: n }) {
    return yn(e, t, n);
  }
  /** @override **/
  formatOffset(e, t) {
    return Oe(this.offset(e), t);
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
let He = {};
function _s(r) {
  return He[r] || (He[r] = new Intl.DateTimeFormat("en-US", {
    hour12: !1,
    timeZone: r,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    era: "short"
  })), He[r];
}
const As = {
  year: 0,
  month: 1,
  day: 2,
  era: 3,
  hour: 4,
  minute: 5,
  second: 6
};
function Fs(r, e) {
  const t = r.format(e).replace(/\u200E/g, ""), n = /(\d+)\/(\d+)\/(\d+) (AD|BC),? (\d+):(\d+):(\d+)/.exec(t), [, s, i, o, a, l, c, d] = n;
  return [o, s, i, a, l, c, d];
}
function Vs(r, e) {
  const t = r.formatToParts(e), n = [];
  for (let s = 0; s < t.length; s++) {
    const { type: i, value: o } = t[s], a = As[i];
    i === "era" ? n[a] = o : m(a) || (n[a] = parseInt(o, 10));
  }
  return n;
}
let Ve = {};
class U extends De {
  /**
   * @param {string} name - Zone name
   * @return {IANAZone}
   */
  static create(e) {
    return Ve[e] || (Ve[e] = new U(e)), Ve[e];
  }
  /**
   * Reset local caches. Should only be necessary in testing scenarios.
   * @return {void}
   */
  static resetCache() {
    Ve = {}, He = {};
  }
  /**
   * Returns whether the provided string is a valid specifier. This only checks the string's format, not that the specifier identifies a known zone; see isValidZone for that.
   * @param {string} s - The string to check validity on
   * @example IANAZone.isValidSpecifier("America/New_York") //=> true
   * @example IANAZone.isValidSpecifier("Sport~~blorp") //=> false
   * @deprecated This method returns false for some valid IANA names. Use isValidZone instead.
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
    super(), this.zoneName = e, this.valid = U.isValidZone(e);
  }
  /** @override **/
  get type() {
    return "iana";
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
  offsetName(e, { format: t, locale: n }) {
    return yn(e, t, n, this.name);
  }
  /** @override **/
  formatOffset(e, t) {
    return Oe(this.offset(e), t);
  }
  /** @override **/
  offset(e) {
    const t = new Date(e);
    if (isNaN(t))
      return NaN;
    const n = _s(this.name);
    let [s, i, o, a, l, c, d] = n.formatToParts ? Vs(n, t) : Fs(n, t);
    a === "BC" && (s = -Math.abs(s) + 1);
    const p = nt({
      year: s,
      month: i,
      day: o,
      hour: l === 24 ? 0 : l,
      minute: c,
      second: d,
      millisecond: 0
    });
    let f = +t;
    const v = f % 1e3;
    return f -= v >= 0 ? v : 1e3 + v, (p - f) / (60 * 1e3);
  }
  /** @override **/
  equals(e) {
    return e.type === "iana" && e.name === this.name;
  }
  /** @override **/
  get isValid() {
    return this.valid;
  }
}
let sr = {};
function Ws(r, e = {}) {
  const t = JSON.stringify([r, e]);
  let n = sr[t];
  return n || (n = new Intl.ListFormat(r, e), sr[t] = n), n;
}
let $t = {};
function xt(r, e = {}) {
  const t = JSON.stringify([r, e]);
  let n = $t[t];
  return n || (n = new Intl.DateTimeFormat(r, e), $t[t] = n), n;
}
let Ot = {};
function Ls(r, e = {}) {
  const t = JSON.stringify([r, e]);
  let n = Ot[t];
  return n || (n = new Intl.NumberFormat(r, e), Ot[t] = n), n;
}
let Et = {};
function Us(r, e = {}) {
  const { base: t, ...n } = e, s = JSON.stringify([r, n]);
  let i = Et[s];
  return i || (i = new Intl.RelativeTimeFormat(r, e), Et[s] = i), i;
}
let Te = null;
function Rs() {
  return Te || (Te = new Intl.DateTimeFormat().resolvedOptions().locale, Te);
}
let ir = {};
function Ps(r) {
  let e = ir[r];
  if (!e) {
    const t = new Intl.Locale(r);
    e = "getWeekInfo" in t ? t.getWeekInfo() : t.weekInfo, ir[r] = e;
  }
  return e;
}
function zs(r) {
  const e = r.indexOf("-x-");
  e !== -1 && (r = r.substring(0, e));
  const t = r.indexOf("-u-");
  if (t === -1)
    return [r];
  {
    let n, s;
    try {
      n = xt(r).resolvedOptions(), s = r;
    } catch {
      const l = r.substring(0, t);
      n = xt(l).resolvedOptions(), s = l;
    }
    const { numberingSystem: i, calendar: o } = n;
    return [s, i, o];
  }
}
function Zs(r, e, t) {
  return (t || e) && (r.includes("-u-") || (r += "-u"), t && (r += `-ca-${t}`), e && (r += `-nu-${e}`)), r;
}
function Hs(r) {
  const e = [];
  for (let t = 1; t <= 12; t++) {
    const n = g.utc(2009, t, 1);
    e.push(r(n));
  }
  return e;
}
function qs(r) {
  const e = [];
  for (let t = 1; t <= 7; t++) {
    const n = g.utc(2016, 11, 13 + t);
    e.push(r(n));
  }
  return e;
}
function We(r, e, t, n) {
  const s = r.listingMode();
  return s === "error" ? null : s === "en" ? t(e) : n(e);
}
function Ys(r) {
  return r.numberingSystem && r.numberingSystem !== "latn" ? !1 : r.numberingSystem === "latn" || !r.locale || r.locale.startsWith("en") || new Intl.DateTimeFormat(r.intl).resolvedOptions().numberingSystem === "latn";
}
class Gs {
  constructor(e, t, n) {
    this.padTo = n.padTo || 0, this.floor = n.floor || !1;
    const { padTo: s, floor: i, ...o } = n;
    if (!t || Object.keys(o).length > 0) {
      const a = { useGrouping: !1, ...n };
      n.padTo > 0 && (a.minimumIntegerDigits = n.padTo), this.inf = Ls(e, a);
    }
  }
  format(e) {
    if (this.inf) {
      const t = this.floor ? Math.floor(e) : e;
      return this.inf.format(t);
    } else {
      const t = this.floor ? Math.floor(e) : Wt(e, 3);
      return T(t, this.padTo);
    }
  }
}
class js {
  constructor(e, t, n) {
    this.opts = n, this.originalZone = void 0;
    let s;
    if (this.opts.timeZone)
      this.dt = e;
    else if (e.zone.type === "fixed") {
      const o = -1 * (e.offset / 60), a = o >= 0 ? `Etc/GMT+${o}` : `Etc/GMT${o}`;
      e.offset !== 0 && U.create(a).valid ? (s = a, this.dt = e) : (s = "UTC", this.dt = e.offset === 0 ? e : e.setZone("UTC").plus({ minutes: e.offset }), this.originalZone = e.zone);
    } else
      e.zone.type === "system" ? this.dt = e : e.zone.type === "iana" ? (this.dt = e, s = e.zone.name) : (s = "UTC", this.dt = e.setZone("UTC").plus({ minutes: e.offset }), this.originalZone = e.zone);
    const i = { ...this.opts };
    i.timeZone = i.timeZone || s, this.dtf = xt(t, i);
  }
  format() {
    return this.originalZone ? this.formatToParts().map(({ value: e }) => e).join("") : this.dtf.format(this.dt.toJSDate());
  }
  formatToParts() {
    const e = this.dtf.formatToParts(this.dt.toJSDate());
    return this.originalZone ? e.map((t) => {
      if (t.type === "timeZoneName") {
        const n = this.originalZone.offsetName(this.dt.ts, {
          locale: this.dt.locale,
          format: this.opts.timeZoneName
        });
        return {
          ...t,
          value: n
        };
      } else
        return t;
    }) : e;
  }
  resolvedOptions() {
    return this.dtf.resolvedOptions();
  }
}
class Js {
  constructor(e, t, n) {
    this.opts = { style: "long", ...n }, !t && gn() && (this.rtf = Us(e, n));
  }
  format(e, t) {
    return this.rtf ? this.rtf.format(e, t) : gi(t, e, this.opts.numeric, this.opts.style !== "long");
  }
  formatToParts(e, t) {
    return this.rtf ? this.rtf.formatToParts(e, t) : [];
  }
}
const Bs = {
  firstDay: 1,
  minimalDays: 4,
  weekend: [6, 7]
};
class k {
  static fromOpts(e) {
    return k.create(
      e.locale,
      e.numberingSystem,
      e.outputCalendar,
      e.weekSettings,
      e.defaultToEN
    );
  }
  static create(e, t, n, s, i = !1) {
    const o = e || S.defaultLocale, a = o || (i ? "en-US" : Rs()), l = t || S.defaultNumberingSystem, c = n || S.defaultOutputCalendar, d = Nt(s) || S.defaultWeekSettings;
    return new k(a, l, c, d, o);
  }
  static resetCache() {
    Te = null, $t = {}, Ot = {}, Et = {};
  }
  static fromObject({ locale: e, numberingSystem: t, outputCalendar: n, weekSettings: s } = {}) {
    return k.create(e, t, n, s);
  }
  constructor(e, t, n, s, i) {
    const [o, a, l] = zs(e);
    this.locale = o, this.numberingSystem = t || a || null, this.outputCalendar = n || l || null, this.weekSettings = s, this.intl = Zs(this.locale, this.numberingSystem, this.outputCalendar), this.weekdaysCache = { format: {}, standalone: {} }, this.monthsCache = { format: {}, standalone: {} }, this.meridiemCache = null, this.eraCache = {}, this.specifiedLocale = i, this.fastNumbersCached = null;
  }
  get fastNumbers() {
    return this.fastNumbersCached == null && (this.fastNumbersCached = Ys(this)), this.fastNumbersCached;
  }
  listingMode() {
    const e = this.isEnglish(), t = (this.numberingSystem === null || this.numberingSystem === "latn") && (this.outputCalendar === null || this.outputCalendar === "gregory");
    return e && t ? "en" : "intl";
  }
  clone(e) {
    return !e || Object.getOwnPropertyNames(e).length === 0 ? this : k.create(
      e.locale || this.specifiedLocale,
      e.numberingSystem || this.numberingSystem,
      e.outputCalendar || this.outputCalendar,
      Nt(e.weekSettings) || this.weekSettings,
      e.defaultToEN || !1
    );
  }
  redefaultToEN(e = {}) {
    return this.clone({ ...e, defaultToEN: !0 });
  }
  redefaultToSystem(e = {}) {
    return this.clone({ ...e, defaultToEN: !1 });
  }
  months(e, t = !1) {
    return We(this, e, vn, () => {
      const n = t ? { month: e, day: "numeric" } : { month: e }, s = t ? "format" : "standalone";
      return this.monthsCache[s][e] || (this.monthsCache[s][e] = Hs((i) => this.extract(i, n, "month"))), this.monthsCache[s][e];
    });
  }
  weekdays(e, t = !1) {
    return We(this, e, Tn, () => {
      const n = t ? { weekday: e, year: "numeric", month: "long", day: "numeric" } : { weekday: e }, s = t ? "format" : "standalone";
      return this.weekdaysCache[s][e] || (this.weekdaysCache[s][e] = qs(
        (i) => this.extract(i, n, "weekday")
      )), this.weekdaysCache[s][e];
    });
  }
  meridiems() {
    return We(
      this,
      void 0,
      () => $n,
      () => {
        if (!this.meridiemCache) {
          const e = { hour: "numeric", hourCycle: "h12" };
          this.meridiemCache = [g.utc(2016, 11, 13, 9), g.utc(2016, 11, 13, 19)].map(
            (t) => this.extract(t, e, "dayperiod")
          );
        }
        return this.meridiemCache;
      }
    );
  }
  eras(e) {
    return We(this, e, xn, () => {
      const t = { era: e };
      return this.eraCache[e] || (this.eraCache[e] = [g.utc(-40, 1, 1), g.utc(2017, 1, 1)].map(
        (n) => this.extract(n, t, "era")
      )), this.eraCache[e];
    });
  }
  extract(e, t, n) {
    const s = this.dtFormatter(e, t), i = s.formatToParts(), o = i.find((a) => a.type.toLowerCase() === n);
    return o ? o.value : null;
  }
  numberFormatter(e = {}) {
    return new Gs(this.intl, e.forceSimple || this.fastNumbers, e);
  }
  dtFormatter(e, t = {}) {
    return new js(e, this.intl, t);
  }
  relFormatter(e = {}) {
    return new Js(this.intl, this.isEnglish(), e);
  }
  listFormatter(e = {}) {
    return Ws(this.intl, e);
  }
  isEnglish() {
    return this.locale === "en" || this.locale.toLowerCase() === "en-us" || new Intl.DateTimeFormat(this.intl).resolvedOptions().locale.startsWith("en-us");
  }
  getWeekSettings() {
    return this.weekSettings ? this.weekSettings : pn() ? Ps(this.locale) : Bs;
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
}
let gt = null;
class E extends De {
  /**
   * Get a singleton instance of UTC
   * @return {FixedOffsetZone}
   */
  static get utcInstance() {
    return gt === null && (gt = new E(0)), gt;
  }
  /**
   * Get an instance with a specified offset
   * @param {number} offset - The offset in minutes
   * @return {FixedOffsetZone}
   */
  static instance(e) {
    return e === 0 ? E.utcInstance : new E(e);
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
      const t = e.match(/^utc(?:([+-]\d{1,2})(?::(\d{2}))?)?$/i);
      if (t)
        return new E(st(t[1], t[2]));
    }
    return null;
  }
  constructor(e) {
    super(), this.fixed = e;
  }
  /** @override **/
  get type() {
    return "fixed";
  }
  /** @override **/
  get name() {
    return this.fixed === 0 ? "UTC" : `UTC${Oe(this.fixed, "narrow")}`;
  }
  get ianaName() {
    return this.fixed === 0 ? "Etc/UTC" : `Etc/GMT${Oe(-this.fixed, "narrow")}`;
  }
  /** @override **/
  offsetName() {
    return this.name;
  }
  /** @override **/
  formatOffset(e, t) {
    return Oe(this.fixed, t);
  }
  /** @override **/
  get isUniversal() {
    return !0;
  }
  /** @override **/
  offset() {
    return this.fixed;
  }
  /** @override **/
  equals(e) {
    return e.type === "fixed" && e.fixed === this.fixed;
  }
  /** @override **/
  get isValid() {
    return !0;
  }
}
class Ks extends De {
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
function H(r, e) {
  if (m(r) || r === null)
    return e;
  if (r instanceof De)
    return r;
  if (ei(r)) {
    const t = r.toLowerCase();
    return t === "default" ? e : t === "local" || t === "system" ? tt.instance : t === "utc" || t === "gmt" ? E.utcInstance : E.parseSpecifier(t) || U.create(r);
  } else
    return K(r) ? E.instance(r) : typeof r == "object" && "offset" in r && typeof r.offset == "function" ? r : new Ks(r);
}
let or = () => Date.now(), ar = "system", lr = null, cr = null, ur = null, dr = 60, hr, fr = null;
class S {
  /**
   * Get the callback for returning the current timestamp.
   * @type {function}
   */
  static get now() {
    return or;
  }
  /**
   * Set the callback for returning the current timestamp.
   * The function should return a number, which will be interpreted as an Epoch millisecond count
   * @type {function}
   * @example Settings.now = () => Date.now() + 3000 // pretend it is 3 seconds in the future
   * @example Settings.now = () => 0 // always pretend it's Jan 1, 1970 at midnight in UTC time
   */
  static set now(e) {
    or = e;
  }
  /**
   * Set the default time zone to create DateTimes in. Does not affect existing instances.
   * Use the value "system" to reset this value to the system's time zone.
   * @type {string}
   */
  static set defaultZone(e) {
    ar = e;
  }
  /**
   * Get the default time zone object currently used to create DateTimes. Does not affect existing instances.
   * The default value is the system's time zone (the one set on the machine that runs this code).
   * @type {Zone}
   */
  static get defaultZone() {
    return H(ar, tt.instance);
  }
  /**
   * Get the default locale to create DateTimes with. Does not affect existing instances.
   * @type {string}
   */
  static get defaultLocale() {
    return lr;
  }
  /**
   * Set the default locale to create DateTimes with. Does not affect existing instances.
   * @type {string}
   */
  static set defaultLocale(e) {
    lr = e;
  }
  /**
   * Get the default numbering system to create DateTimes with. Does not affect existing instances.
   * @type {string}
   */
  static get defaultNumberingSystem() {
    return cr;
  }
  /**
   * Set the default numbering system to create DateTimes with. Does not affect existing instances.
   * @type {string}
   */
  static set defaultNumberingSystem(e) {
    cr = e;
  }
  /**
   * Get the default output calendar to create DateTimes with. Does not affect existing instances.
   * @type {string}
   */
  static get defaultOutputCalendar() {
    return ur;
  }
  /**
   * Set the default output calendar to create DateTimes with. Does not affect existing instances.
   * @type {string}
   */
  static set defaultOutputCalendar(e) {
    ur = e;
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
    return fr;
  }
  /**
   * Allows overriding the default locale week settings, i.e. the start of the week, the weekend and
   * how many days are required in the first week of a year.
   * Does not affect existing instances.
   *
   * @param {WeekSettings|null} weekSettings
   */
  static set defaultWeekSettings(e) {
    fr = Nt(e);
  }
  /**
   * Get the cutoff year after which a string encoding a year as two digits is interpreted to occur in the current century.
   * @type {number}
   */
  static get twoDigitCutoffYear() {
    return dr;
  }
  /**
   * Set the cutoff year after which a string encoding a year as two digits is interpreted to occur in the current century.
   * @type {number}
   * @example Settings.twoDigitCutoffYear = 0 // cut-off year is 0, so all 'yy' are interpreted as current century
   * @example Settings.twoDigitCutoffYear = 50 // '49' -> 1949; '50' -> 2050
   * @example Settings.twoDigitCutoffYear = 1950 // interpreted as 50
   * @example Settings.twoDigitCutoffYear = 2050 // ALSO interpreted as 50
   */
  static set twoDigitCutoffYear(e) {
    dr = e % 100;
  }
  /**
   * Get whether Luxon will throw when it encounters invalid DateTimes, Durations, or Intervals
   * @type {boolean}
   */
  static get throwOnInvalid() {
    return hr;
  }
  /**
   * Set whether Luxon will throw when it encounters invalid DateTimes, Durations, or Intervals
   * @type {boolean}
   */
  static set throwOnInvalid(e) {
    hr = e;
  }
  /**
   * Reset Luxon's global caches. Should only be necessary in testing scenarios.
   * @return {void}
   */
  static resetCaches() {
    k.resetCache(), U.resetCache();
  }
}
class F {
  constructor(e, t) {
    this.reason = e, this.explanation = t;
  }
  toMessage() {
    return this.explanation ? `${this.reason}: ${this.explanation}` : this.reason;
  }
}
const cn = [0, 31, 59, 90, 120, 151, 181, 212, 243, 273, 304, 334], un = [0, 31, 60, 91, 121, 152, 182, 213, 244, 274, 305, 335];
function I(r, e) {
  return new F(
    "unit out of range",
    `you specified ${e} (of type ${typeof e}) as a ${r}, which is invalid`
  );
}
function At(r, e, t) {
  const n = new Date(Date.UTC(r, e - 1, t));
  r < 100 && r >= 0 && n.setUTCFullYear(n.getUTCFullYear() - 1900);
  const s = n.getUTCDay();
  return s === 0 ? 7 : s;
}
function dn(r, e, t) {
  return t + (_e(r) ? un : cn)[e - 1];
}
function hn(r, e) {
  const t = _e(r) ? un : cn, n = t.findIndex((i) => i < e), s = e - t[n];
  return { month: n + 1, day: s };
}
function Ft(r, e) {
  return (r - e + 7) % 7 + 1;
}
function Be(r, e = 4, t = 1) {
  const { year: n, month: s, day: i } = r, o = dn(n, s, i), a = Ft(At(n, s, i), t);
  let l = Math.floor((o - a + 14 - e) / 7), c;
  return l < 1 ? (c = n - 1, l = Me(c, e, t)) : l > Me(n, e, t) ? (c = n + 1, l = 1) : c = n, { weekYear: c, weekNumber: l, weekday: a, ...it(r) };
}
function mr(r, e = 4, t = 1) {
  const { weekYear: n, weekNumber: s, weekday: i } = r, o = Ft(At(n, 1, e), t), a = ce(n);
  let l = s * 7 + i - o - 7 + e, c;
  l < 1 ? (c = n - 1, l += ce(c)) : l > a ? (c = n + 1, l -= ce(n)) : c = n;
  const { month: d, day: h } = hn(c, l);
  return { year: c, month: d, day: h, ...it(r) };
}
function pt(r) {
  const { year: e, month: t, day: n } = r, s = dn(e, t, n);
  return { year: e, ordinal: s, ...it(r) };
}
function gr(r) {
  const { year: e, ordinal: t } = r, { month: n, day: s } = hn(e, t);
  return { year: e, month: n, day: s, ...it(r) };
}
function pr(r, e) {
  if (!m(r.localWeekday) || !m(r.localWeekNumber) || !m(r.localWeekYear)) {
    if (!m(r.weekday) || !m(r.weekNumber) || !m(r.weekYear))
      throw new oe(
        "Cannot mix locale-based week fields with ISO-based week fields"
      );
    return m(r.localWeekday) || (r.weekday = r.localWeekday), m(r.localWeekNumber) || (r.weekNumber = r.localWeekNumber), m(r.localWeekYear) || (r.weekYear = r.localWeekYear), delete r.localWeekday, delete r.localWeekNumber, delete r.localWeekYear, {
      minDaysInFirstWeek: e.getMinDaysInFirstWeek(),
      startOfWeek: e.getStartOfWeek()
    };
  } else
    return { minDaysInFirstWeek: 4, startOfWeek: 1 };
}
function Qs(r, e = 4, t = 1) {
  const n = rt(r.weekYear), s = D(
    r.weekNumber,
    1,
    Me(r.weekYear, e, t)
  ), i = D(r.weekday, 1, 7);
  return n ? s ? i ? !1 : I("weekday", r.weekday) : I("week", r.weekNumber) : I("weekYear", r.weekYear);
}
function Xs(r) {
  const e = rt(r.year), t = D(r.ordinal, 1, ce(r.year));
  return e ? t ? !1 : I("ordinal", r.ordinal) : I("year", r.year);
}
function fn(r) {
  const e = rt(r.year), t = D(r.month, 1, 12), n = D(r.day, 1, Ke(r.year, r.month));
  return e ? t ? n ? !1 : I("day", r.day) : I("month", r.month) : I("year", r.year);
}
function mn(r) {
  const { hour: e, minute: t, second: n, millisecond: s } = r, i = D(e, 0, 23) || e === 24 && t === 0 && n === 0 && s === 0, o = D(t, 0, 59), a = D(n, 0, 59), l = D(s, 0, 999);
  return i ? o ? a ? l ? !1 : I("millisecond", s) : I("second", n) : I("minute", t) : I("hour", e);
}
function m(r) {
  return typeof r > "u";
}
function K(r) {
  return typeof r == "number";
}
function rt(r) {
  return typeof r == "number" && r % 1 === 0;
}
function ei(r) {
  return typeof r == "string";
}
function ti(r) {
  return Object.prototype.toString.call(r) === "[object Date]";
}
function gn() {
  try {
    return typeof Intl < "u" && !!Intl.RelativeTimeFormat;
  } catch {
    return !1;
  }
}
function pn() {
  try {
    return typeof Intl < "u" && !!Intl.Locale && ("weekInfo" in Intl.Locale.prototype || "getWeekInfo" in Intl.Locale.prototype);
  } catch {
    return !1;
  }
}
function ri(r) {
  return Array.isArray(r) ? r : [r];
}
function yr(r, e, t) {
  if (r.length !== 0)
    return r.reduce((n, s) => {
      const i = [e(s), s];
      return n && t(n[0], i[0]) === n[0] ? n : i;
    }, null)[1];
}
function ni(r, e) {
  return e.reduce((t, n) => (t[n] = r[n], t), {});
}
function fe(r, e) {
  return Object.prototype.hasOwnProperty.call(r, e);
}
function Nt(r) {
  if (r == null)
    return null;
  if (typeof r != "object")
    throw new N("Week settings must be an object");
  if (!D(r.firstDay, 1, 7) || !D(r.minimalDays, 1, 7) || !Array.isArray(r.weekend) || r.weekend.some((e) => !D(e, 1, 7)))
    throw new N("Invalid week settings");
  return {
    firstDay: r.firstDay,
    minimalDays: r.minimalDays,
    weekend: Array.from(r.weekend)
  };
}
function D(r, e, t) {
  return rt(r) && r >= e && r <= t;
}
function si(r, e) {
  return r - e * Math.floor(r / e);
}
function T(r, e = 2) {
  const t = r < 0;
  let n;
  return t ? n = "-" + ("" + -r).padStart(e, "0") : n = ("" + r).padStart(e, "0"), n;
}
function z(r) {
  if (!(m(r) || r === null || r === ""))
    return parseInt(r, 10);
}
function G(r) {
  if (!(m(r) || r === null || r === ""))
    return parseFloat(r);
}
function Vt(r) {
  if (!(m(r) || r === null || r === "")) {
    const e = parseFloat("0." + r) * 1e3;
    return Math.floor(e);
  }
}
function Wt(r, e, t = !1) {
  const n = 10 ** e;
  return (t ? Math.trunc : Math.round)(r * n) / n;
}
function _e(r) {
  return r % 4 === 0 && (r % 100 !== 0 || r % 400 === 0);
}
function ce(r) {
  return _e(r) ? 366 : 365;
}
function Ke(r, e) {
  const t = si(e - 1, 12) + 1, n = r + (e - t) / 12;
  return t === 2 ? _e(n) ? 29 : 28 : [31, null, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31][t - 1];
}
function nt(r) {
  let e = Date.UTC(
    r.year,
    r.month - 1,
    r.day,
    r.hour,
    r.minute,
    r.second,
    r.millisecond
  );
  return r.year < 100 && r.year >= 0 && (e = new Date(e), e.setUTCFullYear(r.year, r.month - 1, r.day)), +e;
}
function br(r, e, t) {
  return -Ft(At(r, 1, e), t) + e - 1;
}
function Me(r, e = 4, t = 1) {
  const n = br(r, e, t), s = br(r + 1, e, t);
  return (ce(r) - n + s) / 7;
}
function Ct(r) {
  return r > 99 ? r : r > S.twoDigitCutoffYear ? 1900 + r : 2e3 + r;
}
function yn(r, e, t, n = null) {
  const s = new Date(r), i = {
    hourCycle: "h23",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit"
  };
  n && (i.timeZone = n);
  const o = { timeZoneName: e, ...i }, a = new Intl.DateTimeFormat(t, o).formatToParts(s).find((l) => l.type.toLowerCase() === "timezonename");
  return a ? a.value : null;
}
function st(r, e) {
  let t = parseInt(r, 10);
  Number.isNaN(t) && (t = 0);
  const n = parseInt(e, 10) || 0, s = t < 0 || Object.is(t, -0) ? -n : n;
  return t * 60 + s;
}
function bn(r) {
  const e = Number(r);
  if (typeof r == "boolean" || r === "" || Number.isNaN(e))
    throw new N(`Invalid unit value ${r}`);
  return e;
}
function Qe(r, e) {
  const t = {};
  for (const n in r)
    if (fe(r, n)) {
      const s = r[n];
      if (s == null)
        continue;
      t[e(n)] = bn(s);
    }
  return t;
}
function Oe(r, e) {
  const t = Math.trunc(Math.abs(r / 60)), n = Math.trunc(Math.abs(r % 60)), s = r >= 0 ? "+" : "-";
  switch (e) {
    case "short":
      return `${s}${T(t, 2)}:${T(n, 2)}`;
    case "narrow":
      return `${s}${t}${n > 0 ? `:${n}` : ""}`;
    case "techie":
      return `${s}${T(t, 2)}${T(n, 2)}`;
    default:
      throw new RangeError(`Value format ${e} is out of range for property format`);
  }
}
function it(r) {
  return ni(r, ["hour", "minute", "second", "millisecond"]);
}
const ii = [
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
], kn = [
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
], oi = ["J", "F", "M", "A", "M", "J", "J", "A", "S", "O", "N", "D"];
function vn(r) {
  switch (r) {
    case "narrow":
      return [...oi];
    case "short":
      return [...kn];
    case "long":
      return [...ii];
    case "numeric":
      return ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12"];
    case "2-digit":
      return ["01", "02", "03", "04", "05", "06", "07", "08", "09", "10", "11", "12"];
    default:
      return null;
  }
}
const wn = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday"
], Sn = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"], ai = ["M", "T", "W", "T", "F", "S", "S"];
function Tn(r) {
  switch (r) {
    case "narrow":
      return [...ai];
    case "short":
      return [...Sn];
    case "long":
      return [...wn];
    case "numeric":
      return ["1", "2", "3", "4", "5", "6", "7"];
    default:
      return null;
  }
}
const $n = ["AM", "PM"], li = ["Before Christ", "Anno Domini"], ci = ["BC", "AD"], ui = ["B", "A"];
function xn(r) {
  switch (r) {
    case "narrow":
      return [...ui];
    case "short":
      return [...ci];
    case "long":
      return [...li];
    default:
      return null;
  }
}
function di(r) {
  return $n[r.hour < 12 ? 0 : 1];
}
function hi(r, e) {
  return Tn(e)[r.weekday - 1];
}
function fi(r, e) {
  return vn(e)[r.month - 1];
}
function mi(r, e) {
  return xn(e)[r.year < 0 ? 0 : 1];
}
function gi(r, e, t = "always", n = !1) {
  const s = {
    years: ["year", "yr."],
    quarters: ["quarter", "qtr."],
    months: ["month", "mo."],
    weeks: ["week", "wk."],
    days: ["day", "day", "days"],
    hours: ["hour", "hr."],
    minutes: ["minute", "min."],
    seconds: ["second", "sec."]
  }, i = ["hours", "minutes", "seconds"].indexOf(r) === -1;
  if (t === "auto" && i) {
    const h = r === "days";
    switch (e) {
      case 1:
        return h ? "tomorrow" : `next ${s[r][0]}`;
      case -1:
        return h ? "yesterday" : `last ${s[r][0]}`;
      case 0:
        return h ? "today" : `this ${s[r][0]}`;
    }
  }
  const o = Object.is(e, -0) || e < 0, a = Math.abs(e), l = a === 1, c = s[r], d = n ? l ? c[1] : c[2] || c[1] : l ? s[r][0] : r;
  return o ? `${a} ${d} ago` : `in ${a} ${d}`;
}
function kr(r, e) {
  let t = "";
  for (const n of r)
    n.literal ? t += n.val : t += e(n.val);
  return t;
}
const pi = {
  D: Je,
  DD: Zr,
  DDD: Hr,
  DDDD: qr,
  t: Yr,
  tt: Gr,
  ttt: jr,
  tttt: Jr,
  T: Br,
  TT: Kr,
  TTT: Qr,
  TTTT: Xr,
  f: en,
  ff: rn,
  fff: sn,
  ffff: an,
  F: tn,
  FF: nn,
  FFF: on,
  FFFF: ln
};
class x {
  static create(e, t = {}) {
    return new x(e, t);
  }
  static parseFormat(e) {
    let t = null, n = "", s = !1;
    const i = [];
    for (let o = 0; o < e.length; o++) {
      const a = e.charAt(o);
      a === "'" ? (n.length > 0 && i.push({ literal: s || /^\s+$/.test(n), val: n }), t = null, n = "", s = !s) : s || a === t ? n += a : (n.length > 0 && i.push({ literal: /^\s+$/.test(n), val: n }), n = a, t = a);
    }
    return n.length > 0 && i.push({ literal: s || /^\s+$/.test(n), val: n }), i;
  }
  static macroTokenToFormatOpts(e) {
    return pi[e];
  }
  constructor(e, t) {
    this.opts = t, this.loc = e, this.systemLoc = null;
  }
  formatWithSystemDefault(e, t) {
    return this.systemLoc === null && (this.systemLoc = this.loc.redefaultToSystem()), this.systemLoc.dtFormatter(e, { ...this.opts, ...t }).format();
  }
  dtFormatter(e, t = {}) {
    return this.loc.dtFormatter(e, { ...this.opts, ...t });
  }
  formatDateTime(e, t) {
    return this.dtFormatter(e, t).format();
  }
  formatDateTimeParts(e, t) {
    return this.dtFormatter(e, t).formatToParts();
  }
  formatInterval(e, t) {
    return this.dtFormatter(e.start, t).dtf.formatRange(e.start.toJSDate(), e.end.toJSDate());
  }
  resolvedOptions(e, t) {
    return this.dtFormatter(e, t).resolvedOptions();
  }
  num(e, t = 0) {
    if (this.opts.forceSimple)
      return T(e, t);
    const n = { ...this.opts };
    return t > 0 && (n.padTo = t), this.loc.numberFormatter(n).format(e);
  }
  formatDateTimeFromString(e, t) {
    const n = this.loc.listingMode() === "en", s = this.loc.outputCalendar && this.loc.outputCalendar !== "gregory", i = (f, v) => this.loc.extract(e, f, v), o = (f) => e.isOffsetFixed && e.offset === 0 && f.allowZ ? "Z" : e.isValid ? e.zone.formatOffset(e.ts, f.format) : "", a = () => n ? di(e) : i({ hour: "numeric", hourCycle: "h12" }, "dayperiod"), l = (f, v) => n ? fi(e, f) : i(v ? { month: f } : { month: f, day: "numeric" }, "month"), c = (f, v) => n ? hi(e, f) : i(
      v ? { weekday: f } : { weekday: f, month: "long", day: "numeric" },
      "weekday"
    ), d = (f) => {
      const v = x.macroTokenToFormatOpts(f);
      return v ? this.formatWithSystemDefault(e, v) : f;
    }, h = (f) => n ? mi(e, f) : i({ era: f }, "era"), p = (f) => {
      switch (f) {
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
          return o({ format: "narrow", allowZ: this.opts.allowZ });
        case "ZZ":
          return o({ format: "short", allowZ: this.opts.allowZ });
        case "ZZZ":
          return o({ format: "techie", allowZ: this.opts.allowZ });
        case "ZZZZ":
          return e.zone.offsetName(e.ts, { format: "short", locale: this.loc.locale });
        case "ZZZZZ":
          return e.zone.offsetName(e.ts, { format: "long", locale: this.loc.locale });
        case "z":
          return e.zoneName;
        case "a":
          return a();
        case "d":
          return s ? i({ day: "numeric" }, "day") : this.num(e.day);
        case "dd":
          return s ? i({ day: "2-digit" }, "day") : this.num(e.day, 2);
        case "c":
          return this.num(e.weekday);
        case "ccc":
          return c("short", !0);
        case "cccc":
          return c("long", !0);
        case "ccccc":
          return c("narrow", !0);
        case "E":
          return this.num(e.weekday);
        case "EEE":
          return c("short", !1);
        case "EEEE":
          return c("long", !1);
        case "EEEEE":
          return c("narrow", !1);
        case "L":
          return s ? i({ month: "numeric", day: "numeric" }, "month") : this.num(e.month);
        case "LL":
          return s ? i({ month: "2-digit", day: "numeric" }, "month") : this.num(e.month, 2);
        case "LLL":
          return l("short", !0);
        case "LLLL":
          return l("long", !0);
        case "LLLLL":
          return l("narrow", !0);
        case "M":
          return s ? i({ month: "numeric" }, "month") : this.num(e.month);
        case "MM":
          return s ? i({ month: "2-digit" }, "month") : this.num(e.month, 2);
        case "MMM":
          return l("short", !1);
        case "MMMM":
          return l("long", !1);
        case "MMMMM":
          return l("narrow", !1);
        case "y":
          return s ? i({ year: "numeric" }, "year") : this.num(e.year);
        case "yy":
          return s ? i({ year: "2-digit" }, "year") : this.num(e.year.toString().slice(-2), 2);
        case "yyyy":
          return s ? i({ year: "numeric" }, "year") : this.num(e.year, 4);
        case "yyyyyy":
          return s ? i({ year: "numeric" }, "year") : this.num(e.year, 6);
        case "G":
          return h("short");
        case "GG":
          return h("long");
        case "GGGGG":
          return h("narrow");
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
          return d(f);
      }
    };
    return kr(x.parseFormat(t), p);
  }
  formatDurationFromString(e, t) {
    const n = (l) => {
      switch (l[0]) {
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
    }, s = (l) => (c) => {
      const d = n(c);
      return d ? this.num(l.get(d), c.length) : c;
    }, i = x.parseFormat(t), o = i.reduce(
      (l, { literal: c, val: d }) => c ? l : l.concat(d),
      []
    ), a = e.shiftTo(...o.map(n).filter((l) => l));
    return kr(i, s(a));
  }
}
const On = /[A-Za-z_+-]{1,256}(?::?\/[A-Za-z0-9_+-]{1,256}(?:\/[A-Za-z0-9_+-]{1,256})?)?/;
function me(...r) {
  const e = r.reduce((t, n) => t + n.source, "");
  return RegExp(`^${e}$`);
}
function ge(...r) {
  return (e) => r.reduce(
    ([t, n, s], i) => {
      const [o, a, l] = i(e, s);
      return [{ ...t, ...o }, a || n, l];
    },
    [{}, null, 1]
  ).slice(0, 2);
}
function pe(r, ...e) {
  if (r == null)
    return [null, null];
  for (const [t, n] of e) {
    const s = t.exec(r);
    if (s)
      return n(s);
  }
  return [null, null];
}
function En(...r) {
  return (e, t) => {
    const n = {};
    let s;
    for (s = 0; s < r.length; s++)
      n[r[s]] = z(e[t + s]);
    return [n, null, t + s];
  };
}
const Nn = /(?:(Z)|([+-]\d\d)(?::?(\d\d))?)/, yi = `(?:${Nn.source}?(?:\\[(${On.source})\\])?)?`, Lt = /(\d\d)(?::?(\d\d)(?::?(\d\d)(?:[.,](\d{1,30}))?)?)?/, Cn = RegExp(`${Lt.source}${yi}`), Ut = RegExp(`(?:T${Cn.source})?`), bi = /([+-]\d{6}|\d{4})(?:-?(\d\d)(?:-?(\d\d))?)?/, ki = /(\d{4})-?W(\d\d)(?:-?(\d))?/, vi = /(\d{4})-?(\d{3})/, wi = En("weekYear", "weekNumber", "weekDay"), Si = En("year", "ordinal"), Ti = /(\d{4})-(\d\d)-(\d\d)/, Mn = RegExp(
  `${Lt.source} ?(?:${Nn.source}|(${On.source}))?`
), $i = RegExp(`(?: ${Mn.source})?`);
function ue(r, e, t) {
  const n = r[e];
  return m(n) ? t : z(n);
}
function xi(r, e) {
  return [{
    year: ue(r, e),
    month: ue(r, e + 1, 1),
    day: ue(r, e + 2, 1)
  }, null, e + 3];
}
function ye(r, e) {
  return [{
    hours: ue(r, e, 0),
    minutes: ue(r, e + 1, 0),
    seconds: ue(r, e + 2, 0),
    milliseconds: Vt(r[e + 3])
  }, null, e + 4];
}
function Ae(r, e) {
  const t = !r[e] && !r[e + 1], n = st(r[e + 1], r[e + 2]), s = t ? null : E.instance(n);
  return [{}, s, e + 3];
}
function Fe(r, e) {
  const t = r[e] ? U.create(r[e]) : null;
  return [{}, t, e + 1];
}
const Oi = RegExp(`^T?${Lt.source}$`), Ei = /^-?P(?:(?:(-?\d{1,20}(?:\.\d{1,20})?)Y)?(?:(-?\d{1,20}(?:\.\d{1,20})?)M)?(?:(-?\d{1,20}(?:\.\d{1,20})?)W)?(?:(-?\d{1,20}(?:\.\d{1,20})?)D)?(?:T(?:(-?\d{1,20}(?:\.\d{1,20})?)H)?(?:(-?\d{1,20}(?:\.\d{1,20})?)M)?(?:(-?\d{1,20})(?:[.,](-?\d{1,20}))?S)?)?)$/;
function Ni(r) {
  const [e, t, n, s, i, o, a, l, c] = r, d = e[0] === "-", h = l && l[0] === "-", p = (f, v = !1) => f !== void 0 && (v || f && d) ? -f : f;
  return [
    {
      years: p(G(t)),
      months: p(G(n)),
      weeks: p(G(s)),
      days: p(G(i)),
      hours: p(G(o)),
      minutes: p(G(a)),
      seconds: p(G(l), l === "-0"),
      milliseconds: p(Vt(c), h)
    }
  ];
}
const Ci = {
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
function Rt(r, e, t, n, s, i, o) {
  const a = {
    year: e.length === 2 ? Ct(z(e)) : z(e),
    month: kn.indexOf(t) + 1,
    day: z(n),
    hour: z(s),
    minute: z(i)
  };
  return o && (a.second = z(o)), r && (a.weekday = r.length > 3 ? wn.indexOf(r) + 1 : Sn.indexOf(r) + 1), a;
}
const Mi = /^(?:(Mon|Tue|Wed|Thu|Fri|Sat|Sun),\s)?(\d{1,2})\s(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)\s(\d{2,4})\s(\d\d):(\d\d)(?::(\d\d))?\s(?:(UT|GMT|[ECMP][SD]T)|([Zz])|(?:([+-]\d\d)(\d\d)))$/;
function Ii(r) {
  const [
    ,
    e,
    t,
    n,
    s,
    i,
    o,
    a,
    l,
    c,
    d,
    h
  ] = r, p = Rt(e, s, n, t, i, o, a);
  let f;
  return l ? f = Ci[l] : c ? f = 0 : f = st(d, h), [p, new E(f)];
}
function Di(r) {
  return r.replace(/\([^()]*\)|[\n\t]/g, " ").replace(/(\s\s+)/g, " ").trim();
}
const _i = /^(Mon|Tue|Wed|Thu|Fri|Sat|Sun), (\d\d) (Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec) (\d{4}) (\d\d):(\d\d):(\d\d) GMT$/, Ai = /^(Monday|Tuesday|Wednesday|Thursday|Friday|Saturday|Sunday), (\d\d)-(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)-(\d\d) (\d\d):(\d\d):(\d\d) GMT$/, Fi = /^(Mon|Tue|Wed|Thu|Fri|Sat|Sun) (Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec) ( \d|\d\d) (\d\d):(\d\d):(\d\d) (\d{4})$/;
function vr(r) {
  const [, e, t, n, s, i, o, a] = r;
  return [Rt(e, s, n, t, i, o, a), E.utcInstance];
}
function Vi(r) {
  const [, e, t, n, s, i, o, a] = r;
  return [Rt(e, a, t, n, s, i, o), E.utcInstance];
}
const Wi = me(bi, Ut), Li = me(ki, Ut), Ui = me(vi, Ut), Ri = me(Cn), In = ge(
  xi,
  ye,
  Ae,
  Fe
), Pi = ge(
  wi,
  ye,
  Ae,
  Fe
), zi = ge(
  Si,
  ye,
  Ae,
  Fe
), Zi = ge(
  ye,
  Ae,
  Fe
);
function Hi(r) {
  return pe(
    r,
    [Wi, In],
    [Li, Pi],
    [Ui, zi],
    [Ri, Zi]
  );
}
function qi(r) {
  return pe(Di(r), [Mi, Ii]);
}
function Yi(r) {
  return pe(
    r,
    [_i, vr],
    [Ai, vr],
    [Fi, Vi]
  );
}
function Gi(r) {
  return pe(r, [Ei, Ni]);
}
const ji = ge(ye);
function Ji(r) {
  return pe(r, [Oi, ji]);
}
const Bi = me(Ti, $i), Ki = me(Mn), Qi = ge(
  ye,
  Ae,
  Fe
);
function Xi(r) {
  return pe(
    r,
    [Bi, In],
    [Ki, Qi]
  );
}
const wr = "Invalid Duration", Dn = {
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
}, eo = {
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
  ...Dn
}, M = 146097 / 400, ne = 146097 / 4800, to = {
  years: {
    quarters: 4,
    months: 12,
    weeks: M / 7,
    days: M,
    hours: M * 24,
    minutes: M * 24 * 60,
    seconds: M * 24 * 60 * 60,
    milliseconds: M * 24 * 60 * 60 * 1e3
  },
  quarters: {
    months: 3,
    weeks: M / 28,
    days: M / 4,
    hours: M * 24 / 4,
    minutes: M * 24 * 60 / 4,
    seconds: M * 24 * 60 * 60 / 4,
    milliseconds: M * 24 * 60 * 60 * 1e3 / 4
  },
  months: {
    weeks: ne / 7,
    days: ne,
    hours: ne * 24,
    minutes: ne * 24 * 60,
    seconds: ne * 24 * 60 * 60,
    milliseconds: ne * 24 * 60 * 60 * 1e3
  },
  ...Dn
}, B = [
  "years",
  "quarters",
  "months",
  "weeks",
  "days",
  "hours",
  "minutes",
  "seconds",
  "milliseconds"
], ro = B.slice(0).reverse();
function P(r, e, t = !1) {
  const n = {
    values: t ? e.values : { ...r.values, ...e.values || {} },
    loc: r.loc.clone(e.loc),
    conversionAccuracy: e.conversionAccuracy || r.conversionAccuracy,
    matrix: e.matrix || r.matrix
  };
  return new y(n);
}
function _n(r, e) {
  let t = e.milliseconds ?? 0;
  for (const n of ro.slice(1))
    e[n] && (t += e[n] * r[n].milliseconds);
  return t;
}
function Sr(r, e) {
  const t = _n(r, e) < 0 ? -1 : 1;
  B.reduceRight((n, s) => {
    if (m(e[s]))
      return n;
    if (n) {
      const i = e[n] * t, o = r[s][n], a = Math.floor(i / o);
      e[s] += a * t, e[n] -= a * o * t;
    }
    return s;
  }, null), B.reduce((n, s) => {
    if (m(e[s]))
      return n;
    if (n) {
      const i = e[n] % 1;
      e[n] -= i, e[s] += i * r[n][s];
    }
    return s;
  }, null);
}
function no(r) {
  const e = {};
  for (const [t, n] of Object.entries(r))
    n !== 0 && (e[t] = n);
  return e;
}
class y {
  /**
   * @private
   */
  constructor(e) {
    const t = e.conversionAccuracy === "longterm" || !1;
    let n = t ? to : eo;
    e.matrix && (n = e.matrix), this.values = e.values, this.loc = e.loc || k.create(), this.conversionAccuracy = t ? "longterm" : "casual", this.invalid = e.invalid || null, this.matrix = n, this.isLuxonDuration = !0;
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
  static fromMillis(e, t) {
    return y.fromObject({ milliseconds: e }, t);
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
  static fromObject(e, t = {}) {
    if (e == null || typeof e != "object")
      throw new N(
        `Duration.fromObject: argument expected to be an object, got ${e === null ? "null" : typeof e}`
      );
    return new y({
      values: Qe(e, y.normalizeUnit),
      loc: k.fromObject(t),
      conversionAccuracy: t.conversionAccuracy,
      matrix: t.matrix
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
    if (K(e))
      return y.fromMillis(e);
    if (y.isDuration(e))
      return e;
    if (typeof e == "object")
      return y.fromObject(e);
    throw new N(
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
  static fromISO(e, t) {
    const [n] = Gi(e);
    return n ? y.fromObject(n, t) : y.invalid("unparsable", `the input "${e}" can't be parsed as ISO 8601`);
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
  static fromISOTime(e, t) {
    const [n] = Ji(e);
    return n ? y.fromObject(n, t) : y.invalid("unparsable", `the input "${e}" can't be parsed as ISO 8601`);
  }
  /**
   * Create an invalid Duration.
   * @param {string} reason - simple string of why this datetime is invalid. Should not contain parameters or anything else data-dependent
   * @param {string} [explanation=null] - longer explanation, may include parameters and other useful debugging information
   * @return {Duration}
   */
  static invalid(e, t = null) {
    if (!e)
      throw new N("need to specify a reason the Duration is invalid");
    const n = e instanceof F ? e : new F(e, t);
    if (S.throwOnInvalid)
      throw new Ms(n);
    return new y({ invalid: n });
  }
  /**
   * @private
   */
  static normalizeUnit(e) {
    const t = {
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
    if (!t)
      throw new zr(e);
    return t;
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
  toFormat(e, t = {}) {
    const n = {
      ...t,
      floor: t.round !== !1 && t.floor !== !1
    };
    return this.isValid ? x.create(this.loc, n).formatDurationFromString(this, e) : wr;
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
    if (!this.isValid)
      return wr;
    const t = B.map((n) => {
      const s = this.values[n];
      return m(s) ? null : this.loc.numberFormatter({ style: "unit", unitDisplay: "long", ...e, unit: n.slice(0, -1) }).format(s);
    }).filter((n) => n);
    return this.loc.listFormatter({ type: "conjunction", style: e.listStyle || "narrow", ...e }).format(t);
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
    if (!this.isValid)
      return null;
    let e = "P";
    return this.years !== 0 && (e += this.years + "Y"), (this.months !== 0 || this.quarters !== 0) && (e += this.months + this.quarters * 3 + "M"), this.weeks !== 0 && (e += this.weeks + "W"), this.days !== 0 && (e += this.days + "D"), (this.hours !== 0 || this.minutes !== 0 || this.seconds !== 0 || this.milliseconds !== 0) && (e += "T"), this.hours !== 0 && (e += this.hours + "H"), this.minutes !== 0 && (e += this.minutes + "M"), (this.seconds !== 0 || this.milliseconds !== 0) && (e += Wt(this.seconds + this.milliseconds / 1e3, 3) + "S"), e === "P" && (e += "T0S"), e;
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
    if (!this.isValid)
      return null;
    const t = this.toMillis();
    return t < 0 || t >= 864e5 ? null : (e = {
      suppressMilliseconds: !1,
      suppressSeconds: !1,
      includePrefix: !1,
      format: "extended",
      ...e,
      includeOffset: !1
    }, g.fromMillis(t, { zone: "UTC" }).toISOTime(e));
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
    return this.isValid ? _n(this.matrix, this.values) : NaN;
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
    if (!this.isValid)
      return this;
    const t = y.fromDurationLike(e), n = {};
    for (const s of B)
      (fe(t.values, s) || fe(this.values, s)) && (n[s] = t.get(s) + this.get(s));
    return P(this, { values: n }, !0);
  }
  /**
   * Make this Duration shorter by the specified amount. Return a newly-constructed Duration.
   * @param {Duration|Object|number} duration - The amount to subtract. Either a Luxon Duration, a number of milliseconds, the object argument to Duration.fromObject()
   * @return {Duration}
   */
  minus(e) {
    if (!this.isValid)
      return this;
    const t = y.fromDurationLike(e);
    return this.plus(t.negate());
  }
  /**
   * Scale this Duration by the specified amount. Return a newly-constructed Duration.
   * @param {function} fn - The function to apply to each unit. Arity is 1 or 2: the value of the unit and, optionally, the unit name. Must return a number.
   * @example Duration.fromObject({ hours: 1, minutes: 30 }).mapUnits(x => x * 2) //=> { hours: 2, minutes: 60 }
   * @example Duration.fromObject({ hours: 1, minutes: 30 }).mapUnits((x, u) => u === "hours" ? x * 2 : x) //=> { hours: 2, minutes: 30 }
   * @return {Duration}
   */
  mapUnits(e) {
    if (!this.isValid)
      return this;
    const t = {};
    for (const n of Object.keys(this.values))
      t[n] = bn(e(this.values[n], n));
    return P(this, { values: t }, !0);
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
    return this[y.normalizeUnit(e)];
  }
  /**
   * "Set" the values of specified units. Return a newly-constructed Duration.
   * @param {Object} values - a mapping of units to numbers
   * @example dur.set({ years: 2017 })
   * @example dur.set({ hours: 8, minutes: 30 })
   * @return {Duration}
   */
  set(e) {
    if (!this.isValid)
      return this;
    const t = { ...this.values, ...Qe(e, y.normalizeUnit) };
    return P(this, { values: t });
  }
  /**
   * "Set" the locale and/or numberingSystem.  Returns a newly-constructed Duration.
   * @example dur.reconfigure({ locale: 'en-GB' })
   * @return {Duration}
   */
  reconfigure({ locale: e, numberingSystem: t, conversionAccuracy: n, matrix: s } = {}) {
    const o = { loc: this.loc.clone({ locale: e, numberingSystem: t }), matrix: s, conversionAccuracy: n };
    return P(this, o);
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
    if (!this.isValid)
      return this;
    const e = this.toObject();
    return Sr(this.matrix, e), P(this, { values: e }, !0);
  }
  /**
   * Rescale units to its largest representation
   * @example Duration.fromObject({ milliseconds: 90000 }).rescale().toObject() //=> { minutes: 1, seconds: 30 }
   * @return {Duration}
   */
  rescale() {
    if (!this.isValid)
      return this;
    const e = no(this.normalize().shiftToAll().toObject());
    return P(this, { values: e }, !0);
  }
  /**
   * Convert this Duration into its representation in a different set of units.
   * @example Duration.fromObject({ hours: 1, seconds: 30 }).shiftTo('minutes', 'milliseconds').toObject() //=> { minutes: 60, milliseconds: 30000 }
   * @return {Duration}
   */
  shiftTo(...e) {
    if (!this.isValid)
      return this;
    if (e.length === 0)
      return this;
    e = e.map((o) => y.normalizeUnit(o));
    const t = {}, n = {}, s = this.toObject();
    let i;
    for (const o of B)
      if (e.indexOf(o) >= 0) {
        i = o;
        let a = 0;
        for (const c in n)
          a += this.matrix[c][o] * n[c], n[c] = 0;
        K(s[o]) && (a += s[o]);
        const l = Math.trunc(a);
        t[o] = l, n[o] = (a * 1e3 - l * 1e3) / 1e3;
      } else
        K(s[o]) && (n[o] = s[o]);
    for (const o in n)
      n[o] !== 0 && (t[i] += o === i ? n[o] : n[o] / this.matrix[i][o]);
    return Sr(this.matrix, t), P(this, { values: t }, !0);
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
    if (!this.isValid)
      return this;
    const e = {};
    for (const t of Object.keys(this.values))
      e[t] = this.values[t] === 0 ? 0 : -this.values[t];
    return P(this, { values: e }, !0);
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
    function t(n, s) {
      return n === void 0 || n === 0 ? s === void 0 || s === 0 : n === s;
    }
    for (const n of B)
      if (!t(this.values[n], e.values[n]))
        return !1;
    return !0;
  }
}
const se = "Invalid Interval";
function so(r, e) {
  return !r || !r.isValid ? w.invalid("missing or invalid start") : !e || !e.isValid ? w.invalid("missing or invalid end") : e < r ? w.invalid(
    "end before start",
    `The end of an interval must be after its start, but you had start=${r.toISO()} and end=${e.toISO()}`
  ) : null;
}
class w {
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
  static invalid(e, t = null) {
    if (!e)
      throw new N("need to specify a reason the Interval is invalid");
    const n = e instanceof F ? e : new F(e, t);
    if (S.throwOnInvalid)
      throw new Cs(n);
    return new w({ invalid: n });
  }
  /**
   * Create an Interval from a start DateTime and an end DateTime. Inclusive of the start but not the end.
   * @param {DateTime|Date|Object} start
   * @param {DateTime|Date|Object} end
   * @return {Interval}
   */
  static fromDateTimes(e, t) {
    const n = Se(e), s = Se(t), i = so(n, s);
    return i ?? new w({
      start: n,
      end: s
    });
  }
  /**
   * Create an Interval from a start DateTime and a Duration to extend to.
   * @param {DateTime|Date|Object} start
   * @param {Duration|Object|number} duration - the length of the Interval.
   * @return {Interval}
   */
  static after(e, t) {
    const n = y.fromDurationLike(t), s = Se(e);
    return w.fromDateTimes(s, s.plus(n));
  }
  /**
   * Create an Interval from an end DateTime and a Duration to extend backwards to.
   * @param {DateTime|Date|Object} end
   * @param {Duration|Object|number} duration - the length of the Interval.
   * @return {Interval}
   */
  static before(e, t) {
    const n = y.fromDurationLike(t), s = Se(e);
    return w.fromDateTimes(s.minus(n), s);
  }
  /**
   * Create an Interval from an ISO 8601 string.
   * Accepts `<start>/<end>`, `<start>/<duration>`, and `<duration>/<end>` formats.
   * @param {string} text - the ISO string to parse
   * @param {Object} [opts] - options to pass {@link DateTime#fromISO} and optionally {@link Duration#fromISO}
   * @see https://en.wikipedia.org/wiki/ISO_8601#Time_intervals
   * @return {Interval}
   */
  static fromISO(e, t) {
    const [n, s] = (e || "").split("/", 2);
    if (n && s) {
      let i, o;
      try {
        i = g.fromISO(n, t), o = i.isValid;
      } catch {
        o = !1;
      }
      let a, l;
      try {
        a = g.fromISO(s, t), l = a.isValid;
      } catch {
        l = !1;
      }
      if (o && l)
        return w.fromDateTimes(i, a);
      if (o) {
        const c = y.fromISO(s, t);
        if (c.isValid)
          return w.after(i, c);
      } else if (l) {
        const c = y.fromISO(n, t);
        if (c.isValid)
          return w.before(a, c);
      }
    }
    return w.invalid("unparsable", `the input "${e}" can't be parsed as ISO 8601`);
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
  count(e = "milliseconds", t) {
    if (!this.isValid)
      return NaN;
    const n = this.start.startOf(e, t);
    let s;
    return t != null && t.useLocaleWeeks ? s = this.end.reconfigure({ locale: n.locale }) : s = this.end, s = s.startOf(e, t), Math.floor(s.diff(n, e).get(e)) + (s.valueOf() !== this.end.valueOf());
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
  set({ start: e, end: t } = {}) {
    return this.isValid ? w.fromDateTimes(e || this.s, t || this.e) : this;
  }
  /**
   * Split this Interval at each of the specified DateTimes
   * @param {...DateTime} dateTimes - the unit of time to count.
   * @return {Array}
   */
  splitAt(...e) {
    if (!this.isValid)
      return [];
    const t = e.map(Se).filter((o) => this.contains(o)).sort((o, a) => o.toMillis() - a.toMillis()), n = [];
    let { s } = this, i = 0;
    for (; s < this.e; ) {
      const o = t[i] || this.e, a = +o > +this.e ? this.e : o;
      n.push(w.fromDateTimes(s, a)), s = a, i += 1;
    }
    return n;
  }
  /**
   * Split this Interval into smaller Intervals, each of the specified length.
   * Left over time is grouped into a smaller interval
   * @param {Duration|Object|number} duration - The length of each resulting interval.
   * @return {Array}
   */
  splitBy(e) {
    const t = y.fromDurationLike(e);
    if (!this.isValid || !t.isValid || t.as("milliseconds") === 0)
      return [];
    let { s: n } = this, s = 1, i;
    const o = [];
    for (; n < this.e; ) {
      const a = this.start.plus(t.mapUnits((l) => l * s));
      i = +a > +this.e ? this.e : a, o.push(w.fromDateTimes(n, i)), n = i, s += 1;
    }
    return o;
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
   * Return whether this Interval engulfs the start and end of the specified Interval.
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
    if (!this.isValid)
      return this;
    const t = this.s > e.s ? this.s : e.s, n = this.e < e.e ? this.e : e.e;
    return t >= n ? null : w.fromDateTimes(t, n);
  }
  /**
   * Return an Interval representing the union of this Interval and the specified Interval.
   * Specifically, the resulting Interval has the minimum start time and the maximum end time of the two Intervals.
   * @param {Interval} other
   * @return {Interval}
   */
  union(e) {
    if (!this.isValid)
      return this;
    const t = this.s < e.s ? this.s : e.s, n = this.e > e.e ? this.e : e.e;
    return w.fromDateTimes(t, n);
  }
  /**
   * Merge an array of Intervals into a equivalent minimal set of Intervals.
   * Combines overlapping and adjacent Intervals.
   * @param {Array} intervals
   * @return {Array}
   */
  static merge(e) {
    const [t, n] = e.sort((s, i) => s.s - i.s).reduce(
      ([s, i], o) => i ? i.overlaps(o) || i.abutsStart(o) ? [s, i.union(o)] : [s.concat([i]), o] : [s, o],
      [[], null]
    );
    return n && t.push(n), t;
  }
  /**
   * Return an array of Intervals representing the spans of time that only appear in one of the specified Intervals.
   * @param {Array} intervals
   * @return {Array}
   */
  static xor(e) {
    let t = null, n = 0;
    const s = [], i = e.map((l) => [
      { time: l.s, type: "s" },
      { time: l.e, type: "e" }
    ]), o = Array.prototype.concat(...i), a = o.sort((l, c) => l.time - c.time);
    for (const l of a)
      n += l.type === "s" ? 1 : -1, n === 1 ? t = l.time : (t && +t != +l.time && s.push(w.fromDateTimes(t, l.time)), t = null);
    return w.merge(s);
  }
  /**
   * Return an Interval representing the span of time in this Interval that doesn't overlap with any of the specified Intervals.
   * @param {...Interval} intervals
   * @return {Array}
   */
  difference(...e) {
    return w.xor([this].concat(e)).map((t) => this.intersection(t)).filter((t) => t && !t.isEmpty());
  }
  /**
   * Returns a string representation of this Interval appropriate for debugging.
   * @return {string}
   */
  toString() {
    return this.isValid ? `[${this.s.toISO()} – ${this.e.toISO()})` : se;
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
  toLocaleString(e = Je, t = {}) {
    return this.isValid ? x.create(this.s.loc.clone(t), e).formatInterval(this) : se;
  }
  /**
   * Returns an ISO 8601-compliant string representation of this Interval.
   * @see https://en.wikipedia.org/wiki/ISO_8601#Time_intervals
   * @param {Object} opts - The same options as {@link DateTime#toISO}
   * @return {string}
   */
  toISO(e) {
    return this.isValid ? `${this.s.toISO(e)}/${this.e.toISO(e)}` : se;
  }
  /**
   * Returns an ISO 8601-compliant string representation of date of this Interval.
   * The time components are ignored.
   * @see https://en.wikipedia.org/wiki/ISO_8601#Time_intervals
   * @return {string}
   */
  toISODate() {
    return this.isValid ? `${this.s.toISODate()}/${this.e.toISODate()}` : se;
  }
  /**
   * Returns an ISO 8601-compliant string representation of time of this Interval.
   * The date components are ignored.
   * @see https://en.wikipedia.org/wiki/ISO_8601#Time_intervals
   * @param {Object} opts - The same options as {@link DateTime#toISO}
   * @return {string}
   */
  toISOTime(e) {
    return this.isValid ? `${this.s.toISOTime(e)}/${this.e.toISOTime(e)}` : se;
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
  toFormat(e, { separator: t = " – " } = {}) {
    return this.isValid ? `${this.s.toFormat(e)}${t}${this.e.toFormat(e)}` : se;
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
  toDuration(e, t) {
    return this.isValid ? this.e.diff(this.s, e, t) : y.invalid(this.invalidReason);
  }
  /**
   * Run mapFn on the interval start and end, returning a new Interval from the resulting DateTimes
   * @param {function} mapFn
   * @return {Interval}
   * @example Interval.fromDateTimes(dt1, dt2).mapEndpoints(endpoint => endpoint.toUTC())
   * @example Interval.fromDateTimes(dt1, dt2).mapEndpoints(endpoint => endpoint.plus({ hours: 2 }))
   */
  mapEndpoints(e) {
    return w.fromDateTimes(e(this.s), e(this.e));
  }
}
class Le {
  /**
   * Return whether the specified zone contains a DST.
   * @param {string|Zone} [zone='local'] - Zone to check. Defaults to the environment's local zone.
   * @return {boolean}
   */
  static hasDST(e = S.defaultZone) {
    const t = g.now().setZone(e).set({ month: 12 });
    return !e.isUniversal && t.offset !== t.set({ month: 6 }).offset;
  }
  /**
   * Return whether the specified zone is a valid IANA specifier.
   * @param {string} zone - Zone to check
   * @return {boolean}
   */
  static isValidIANAZone(e) {
    return U.isValidZone(e);
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
    return H(e, S.defaultZone);
  }
  /**
   * Get the weekday on which the week starts according to the given locale.
   * @param {Object} opts - options
   * @param {string} [opts.locale] - the locale code
   * @param {string} [opts.locObj=null] - an existing locale object to use
   * @returns {number} the start of the week, 1 for Monday through 7 for Sunday
   */
  static getStartOfWeek({ locale: e = null, locObj: t = null } = {}) {
    return (t || k.create(e)).getStartOfWeek();
  }
  /**
   * Get the minimum number of days necessary in a week before it is considered part of the next year according
   * to the given locale.
   * @param {Object} opts - options
   * @param {string} [opts.locale] - the locale code
   * @param {string} [opts.locObj=null] - an existing locale object to use
   * @returns {number}
   */
  static getMinimumDaysInFirstWeek({ locale: e = null, locObj: t = null } = {}) {
    return (t || k.create(e)).getMinDaysInFirstWeek();
  }
  /**
   * Get the weekdays, which are considered the weekend according to the given locale
   * @param {Object} opts - options
   * @param {string} [opts.locale] - the locale code
   * @param {string} [opts.locObj=null] - an existing locale object to use
   * @returns {number[]} an array of weekdays, 1 for Monday through 7 for Sunday
   */
  static getWeekendWeekdays({ locale: e = null, locObj: t = null } = {}) {
    return (t || k.create(e)).getWeekendDays().slice();
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
  static months(e = "long", { locale: t = null, numberingSystem: n = null, locObj: s = null, outputCalendar: i = "gregory" } = {}) {
    return (s || k.create(t, n, i)).months(e);
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
  static monthsFormat(e = "long", { locale: t = null, numberingSystem: n = null, locObj: s = null, outputCalendar: i = "gregory" } = {}) {
    return (s || k.create(t, n, i)).months(e, !0);
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
  static weekdays(e = "long", { locale: t = null, numberingSystem: n = null, locObj: s = null } = {}) {
    return (s || k.create(t, n, null)).weekdays(e);
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
  static weekdaysFormat(e = "long", { locale: t = null, numberingSystem: n = null, locObj: s = null } = {}) {
    return (s || k.create(t, n, null)).weekdays(e, !0);
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
    return k.create(e).meridiems();
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
  static eras(e = "short", { locale: t = null } = {}) {
    return k.create(t, null, "gregory").eras(e);
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
    return { relative: gn(), localeWeek: pn() };
  }
}
function Tr(r, e) {
  const t = (s) => s.toUTC(0, { keepLocalTime: !0 }).startOf("day").valueOf(), n = t(e) - t(r);
  return Math.floor(y.fromMillis(n).as("days"));
}
function io(r, e, t) {
  const n = [
    ["years", (l, c) => c.year - l.year],
    ["quarters", (l, c) => c.quarter - l.quarter + (c.year - l.year) * 4],
    ["months", (l, c) => c.month - l.month + (c.year - l.year) * 12],
    [
      "weeks",
      (l, c) => {
        const d = Tr(l, c);
        return (d - d % 7) / 7;
      }
    ],
    ["days", Tr]
  ], s = {}, i = r;
  let o, a;
  for (const [l, c] of n)
    t.indexOf(l) >= 0 && (o = l, s[l] = c(r, e), a = i.plus(s), a > e ? (s[l]--, r = i.plus(s), r > e && (a = r, s[l]--, r = i.plus(s))) : r = a);
  return [r, s, a, o];
}
function oo(r, e, t, n) {
  let [s, i, o, a] = io(r, e, t);
  const l = e - s, c = t.filter(
    (h) => ["hours", "minutes", "seconds", "milliseconds"].indexOf(h) >= 0
  );
  c.length === 0 && (o < e && (o = s.plus({ [a]: 1 })), o !== s && (i[a] = (i[a] || 0) + l / (o - s)));
  const d = y.fromObject(i, n);
  return c.length > 0 ? y.fromMillis(l, n).shiftTo(...c).plus(d) : d;
}
const Pt = {
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
}, $r = {
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
}, ao = Pt.hanidec.replace(/[\[|\]]/g, "").split("");
function lo(r) {
  let e = parseInt(r, 10);
  if (isNaN(e)) {
    e = "";
    for (let t = 0; t < r.length; t++) {
      const n = r.charCodeAt(t);
      if (r[t].search(Pt.hanidec) !== -1)
        e += ao.indexOf(r[t]);
      else
        for (const s in $r) {
          const [i, o] = $r[s];
          n >= i && n <= o && (e += n - i);
        }
    }
    return parseInt(e, 10);
  } else
    return e;
}
function _({ numberingSystem: r }, e = "") {
  return new RegExp(`${Pt[r || "latn"]}${e}`);
}
const co = "missing Intl.DateTimeFormat.formatToParts support";
function b(r, e = (t) => t) {
  return { regex: r, deser: ([t]) => e(lo(t)) };
}
const uo = " ", An = `[ ${uo}]`, Fn = new RegExp(An, "g");
function ho(r) {
  return r.replace(/\./g, "\\.?").replace(Fn, An);
}
function xr(r) {
  return r.replace(/\./g, "").replace(Fn, " ").toLowerCase();
}
function A(r, e) {
  return r === null ? null : {
    regex: RegExp(r.map(ho).join("|")),
    deser: ([t]) => r.findIndex((n) => xr(t) === xr(n)) + e
  };
}
function Or(r, e) {
  return { regex: r, deser: ([, t, n]) => st(t, n), groups: e };
}
function Ue(r) {
  return { regex: r, deser: ([e]) => e };
}
function fo(r) {
  return r.replace(/[\-\[\]{}()*+?.,\\\^$|#\s]/g, "\\$&");
}
function mo(r, e) {
  const t = _(e), n = _(e, "{2}"), s = _(e, "{3}"), i = _(e, "{4}"), o = _(e, "{6}"), a = _(e, "{1,2}"), l = _(e, "{1,3}"), c = _(e, "{1,6}"), d = _(e, "{1,9}"), h = _(e, "{2,4}"), p = _(e, "{4,6}"), f = (W) => ({ regex: RegExp(fo(W.val)), deser: ([te]) => te, literal: !0 }), ee = ((W) => {
    if (r.literal)
      return f(W);
    switch (W.val) {
      case "G":
        return A(e.eras("short"), 0);
      case "GG":
        return A(e.eras("long"), 0);
      case "y":
        return b(c);
      case "yy":
        return b(h, Ct);
      case "yyyy":
        return b(i);
      case "yyyyy":
        return b(p);
      case "yyyyyy":
        return b(o);
      case "M":
        return b(a);
      case "MM":
        return b(n);
      case "MMM":
        return A(e.months("short", !0), 1);
      case "MMMM":
        return A(e.months("long", !0), 1);
      case "L":
        return b(a);
      case "LL":
        return b(n);
      case "LLL":
        return A(e.months("short", !1), 1);
      case "LLLL":
        return A(e.months("long", !1), 1);
      case "d":
        return b(a);
      case "dd":
        return b(n);
      case "o":
        return b(l);
      case "ooo":
        return b(s);
      case "HH":
        return b(n);
      case "H":
        return b(a);
      case "hh":
        return b(n);
      case "h":
        return b(a);
      case "mm":
        return b(n);
      case "m":
        return b(a);
      case "q":
        return b(a);
      case "qq":
        return b(n);
      case "s":
        return b(a);
      case "ss":
        return b(n);
      case "S":
        return b(l);
      case "SSS":
        return b(s);
      case "u":
        return Ue(d);
      case "uu":
        return Ue(a);
      case "uuu":
        return b(t);
      case "a":
        return A(e.meridiems(), 0);
      case "kkkk":
        return b(i);
      case "kk":
        return b(h, Ct);
      case "W":
        return b(a);
      case "WW":
        return b(n);
      case "E":
      case "c":
        return b(t);
      case "EEE":
        return A(e.weekdays("short", !1), 1);
      case "EEEE":
        return A(e.weekdays("long", !1), 1);
      case "ccc":
        return A(e.weekdays("short", !0), 1);
      case "cccc":
        return A(e.weekdays("long", !0), 1);
      case "Z":
      case "ZZ":
        return Or(new RegExp(`([+-]${a.source})(?::(${n.source}))?`), 2);
      case "ZZZ":
        return Or(new RegExp(`([+-]${a.source})(${n.source})?`), 2);
      case "z":
        return Ue(/[a-z_+-/]{1,256}?/i);
      case " ":
        return Ue(/[^\S\n\r]/);
      default:
        return f(W);
    }
  })(r) || {
    invalidReason: co
  };
  return ee.token = r, ee;
}
const go = {
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
function po(r, e, t) {
  const { type: n, value: s } = r;
  if (n === "literal") {
    const l = /^\s+$/.test(s);
    return {
      literal: !l,
      val: l ? " " : s
    };
  }
  const i = e[n];
  let o = n;
  n === "hour" && (e.hour12 != null ? o = e.hour12 ? "hour12" : "hour24" : e.hourCycle != null ? e.hourCycle === "h11" || e.hourCycle === "h12" ? o = "hour12" : o = "hour24" : o = t.hour12 ? "hour12" : "hour24");
  let a = go[o];
  if (typeof a == "object" && (a = a[i]), a)
    return {
      literal: !1,
      val: a
    };
}
function yo(r) {
  return [`^${r.map((t) => t.regex).reduce((t, n) => `${t}(${n.source})`, "")}$`, r];
}
function bo(r, e, t) {
  const n = r.match(e);
  if (n) {
    const s = {};
    let i = 1;
    for (const o in t)
      if (fe(t, o)) {
        const a = t[o], l = a.groups ? a.groups + 1 : 1;
        !a.literal && a.token && (s[a.token.val[0]] = a.deser(n.slice(i, i + l))), i += l;
      }
    return [n, s];
  } else
    return [n, {}];
}
function ko(r) {
  const e = (i) => {
    switch (i) {
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
  let t = null, n;
  return m(r.z) || (t = U.create(r.z)), m(r.Z) || (t || (t = new E(r.Z)), n = r.Z), m(r.q) || (r.M = (r.q - 1) * 3 + 1), m(r.h) || (r.h < 12 && r.a === 1 ? r.h += 12 : r.h === 12 && r.a === 0 && (r.h = 0)), r.G === 0 && r.y && (r.y = -r.y), m(r.u) || (r.S = Vt(r.u)), [Object.keys(r).reduce((i, o) => {
    const a = e(o);
    return a && (i[a] = r[o]), i;
  }, {}), t, n];
}
let yt = null;
function vo() {
  return yt || (yt = g.fromMillis(1555555555555)), yt;
}
function wo(r, e) {
  if (r.literal)
    return r;
  const t = x.macroTokenToFormatOpts(r.val), n = Ln(t, e);
  return n == null || n.includes(void 0) ? r : n;
}
function Vn(r, e) {
  return Array.prototype.concat(...r.map((t) => wo(t, e)));
}
function Wn(r, e, t) {
  const n = Vn(x.parseFormat(t), r), s = n.map((o) => mo(o, r)), i = s.find((o) => o.invalidReason);
  if (i)
    return { input: e, tokens: n, invalidReason: i.invalidReason };
  {
    const [o, a] = yo(s), l = RegExp(o, "i"), [c, d] = bo(e, l, a), [h, p, f] = d ? ko(d) : [null, null, void 0];
    if (fe(d, "a") && fe(d, "H"))
      throw new oe(
        "Can't include meridiem when specifying 24-hour format"
      );
    return { input: e, tokens: n, regex: l, rawMatches: c, matches: d, result: h, zone: p, specificOffset: f };
  }
}
function So(r, e, t) {
  const { result: n, zone: s, specificOffset: i, invalidReason: o } = Wn(r, e, t);
  return [n, s, i, o];
}
function Ln(r, e) {
  if (!r)
    return null;
  const n = x.create(e, r).dtFormatter(vo()), s = n.formatToParts(), i = n.resolvedOptions();
  return s.map((o) => po(o, r, i));
}
const bt = "Invalid DateTime", Er = 864e13;
function Re(r) {
  return new F("unsupported zone", `the zone "${r.name}" is not supported`);
}
function kt(r) {
  return r.weekData === null && (r.weekData = Be(r.c)), r.weekData;
}
function vt(r) {
  return r.localWeekData === null && (r.localWeekData = Be(
    r.c,
    r.loc.getMinDaysInFirstWeek(),
    r.loc.getStartOfWeek()
  )), r.localWeekData;
}
function j(r, e) {
  const t = {
    ts: r.ts,
    zone: r.zone,
    c: r.c,
    o: r.o,
    loc: r.loc,
    invalid: r.invalid
  };
  return new g({ ...t, ...e, old: t });
}
function Un(r, e, t) {
  let n = r - e * 60 * 1e3;
  const s = t.offset(n);
  if (e === s)
    return [n, e];
  n -= (s - e) * 60 * 1e3;
  const i = t.offset(n);
  return s === i ? [n, s] : [r - Math.min(s, i) * 60 * 1e3, Math.max(s, i)];
}
function Pe(r, e) {
  r += e * 60 * 1e3;
  const t = new Date(r);
  return {
    year: t.getUTCFullYear(),
    month: t.getUTCMonth() + 1,
    day: t.getUTCDate(),
    hour: t.getUTCHours(),
    minute: t.getUTCMinutes(),
    second: t.getUTCSeconds(),
    millisecond: t.getUTCMilliseconds()
  };
}
function qe(r, e, t) {
  return Un(nt(r), e, t);
}
function Nr(r, e) {
  const t = r.o, n = r.c.year + Math.trunc(e.years), s = r.c.month + Math.trunc(e.months) + Math.trunc(e.quarters) * 3, i = {
    ...r.c,
    year: n,
    month: s,
    day: Math.min(r.c.day, Ke(n, s)) + Math.trunc(e.days) + Math.trunc(e.weeks) * 7
  }, o = y.fromObject({
    years: e.years - Math.trunc(e.years),
    quarters: e.quarters - Math.trunc(e.quarters),
    months: e.months - Math.trunc(e.months),
    weeks: e.weeks - Math.trunc(e.weeks),
    days: e.days - Math.trunc(e.days),
    hours: e.hours,
    minutes: e.minutes,
    seconds: e.seconds,
    milliseconds: e.milliseconds
  }).as("milliseconds"), a = nt(i);
  let [l, c] = Un(a, t, r.zone);
  return o !== 0 && (l += o, c = r.zone.offset(l)), { ts: l, o: c };
}
function we(r, e, t, n, s, i) {
  const { setZone: o, zone: a } = t;
  if (r && Object.keys(r).length !== 0 || e) {
    const l = e || a, c = g.fromObject(r, {
      ...t,
      zone: l,
      specificOffset: i
    });
    return o ? c : c.setZone(a);
  } else
    return g.invalid(
      new F("unparsable", `the input "${s}" can't be parsed as ${n}`)
    );
}
function ze(r, e, t = !0) {
  return r.isValid ? x.create(k.create("en-US"), {
    allowZ: t,
    forceSimple: !0
  }).formatDateTimeFromString(r, e) : null;
}
function wt(r, e) {
  const t = r.c.year > 9999 || r.c.year < 0;
  let n = "";
  return t && r.c.year >= 0 && (n += "+"), n += T(r.c.year, t ? 6 : 4), e ? (n += "-", n += T(r.c.month), n += "-", n += T(r.c.day)) : (n += T(r.c.month), n += T(r.c.day)), n;
}
function Cr(r, e, t, n, s, i) {
  let o = T(r.c.hour);
  return e ? (o += ":", o += T(r.c.minute), (r.c.millisecond !== 0 || r.c.second !== 0 || !t) && (o += ":")) : o += T(r.c.minute), (r.c.millisecond !== 0 || r.c.second !== 0 || !t) && (o += T(r.c.second), (r.c.millisecond !== 0 || !n) && (o += ".", o += T(r.c.millisecond, 3))), s && (r.isOffsetFixed && r.offset === 0 && !i ? o += "Z" : r.o < 0 ? (o += "-", o += T(Math.trunc(-r.o / 60)), o += ":", o += T(Math.trunc(-r.o % 60))) : (o += "+", o += T(Math.trunc(r.o / 60)), o += ":", o += T(Math.trunc(r.o % 60)))), i && (o += "[" + r.zone.ianaName + "]"), o;
}
const Rn = {
  month: 1,
  day: 1,
  hour: 0,
  minute: 0,
  second: 0,
  millisecond: 0
}, To = {
  weekNumber: 1,
  weekday: 1,
  hour: 0,
  minute: 0,
  second: 0,
  millisecond: 0
}, $o = {
  ordinal: 1,
  hour: 0,
  minute: 0,
  second: 0,
  millisecond: 0
}, Pn = ["year", "month", "day", "hour", "minute", "second", "millisecond"], xo = [
  "weekYear",
  "weekNumber",
  "weekday",
  "hour",
  "minute",
  "second",
  "millisecond"
], Oo = ["year", "ordinal", "hour", "minute", "second", "millisecond"];
function Eo(r) {
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
  }[r.toLowerCase()];
  if (!e)
    throw new zr(r);
  return e;
}
function Mr(r) {
  switch (r.toLowerCase()) {
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
      return Eo(r);
  }
}
function Ir(r, e) {
  const t = H(e.zone, S.defaultZone), n = k.fromObject(e), s = S.now();
  let i, o;
  if (m(r.year))
    i = s;
  else {
    for (const c of Pn)
      m(r[c]) && (r[c] = Rn[c]);
    const a = fn(r) || mn(r);
    if (a)
      return g.invalid(a);
    const l = t.offset(s);
    [i, o] = qe(r, l, t);
  }
  return new g({ ts: i, zone: t, loc: n, o });
}
function Dr(r, e, t) {
  const n = m(t.round) ? !0 : t.round, s = (o, a) => (o = Wt(o, n || t.calendary ? 0 : 2, !0), e.loc.clone(t).relFormatter(t).format(o, a)), i = (o) => t.calendary ? e.hasSame(r, o) ? 0 : e.startOf(o).diff(r.startOf(o), o).get(o) : e.diff(r, o).get(o);
  if (t.unit)
    return s(i(t.unit), t.unit);
  for (const o of t.units) {
    const a = i(o);
    if (Math.abs(a) >= 1)
      return s(a, o);
  }
  return s(r > e ? -0 : 0, t.units[t.units.length - 1]);
}
function _r(r) {
  let e = {}, t;
  return r.length > 0 && typeof r[r.length - 1] == "object" ? (e = r[r.length - 1], t = Array.from(r).slice(0, r.length - 1)) : t = Array.from(r), [e, t];
}
class g {
  /**
   * @access private
   */
  constructor(e) {
    const t = e.zone || S.defaultZone;
    let n = e.invalid || (Number.isNaN(e.ts) ? new F("invalid input") : null) || (t.isValid ? null : Re(t));
    this.ts = m(e.ts) ? S.now() : e.ts;
    let s = null, i = null;
    if (!n)
      if (e.old && e.old.ts === this.ts && e.old.zone.equals(t))
        [s, i] = [e.old.c, e.old.o];
      else {
        const a = t.offset(this.ts);
        s = Pe(this.ts, a), n = Number.isNaN(s.year) ? new F("invalid input") : null, s = n ? null : s, i = n ? null : a;
      }
    this._zone = t, this.loc = e.loc || k.create(), this.invalid = n, this.weekData = null, this.localWeekData = null, this.c = s, this.o = i, this.isLuxonDateTime = !0;
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
    return new g({});
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
    const [e, t] = _r(arguments), [n, s, i, o, a, l, c] = t;
    return Ir({ year: n, month: s, day: i, hour: o, minute: a, second: l, millisecond: c }, e);
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
    const [e, t] = _r(arguments), [n, s, i, o, a, l, c] = t;
    return e.zone = E.utcInstance, Ir({ year: n, month: s, day: i, hour: o, minute: a, second: l, millisecond: c }, e);
  }
  /**
   * Create a DateTime from a JavaScript Date object. Uses the default zone.
   * @param {Date} date - a JavaScript Date object
   * @param {Object} options - configuration options for the DateTime
   * @param {string|Zone} [options.zone='local'] - the zone to place the DateTime into
   * @return {DateTime}
   */
  static fromJSDate(e, t = {}) {
    const n = ti(e) ? e.valueOf() : NaN;
    if (Number.isNaN(n))
      return g.invalid("invalid input");
    const s = H(t.zone, S.defaultZone);
    return s.isValid ? new g({
      ts: n,
      zone: s,
      loc: k.fromObject(t)
    }) : g.invalid(Re(s));
  }
  /**
   * Create a DateTime from a number of milliseconds since the epoch (meaning since 1 January 1970 00:00:00 UTC). Uses the default zone.
   * @param {number} milliseconds - a number of milliseconds since 1970 UTC
   * @param {Object} options - configuration options for the DateTime
   * @param {string|Zone} [options.zone='local'] - the zone to place the DateTime into
   * @param {string} [options.locale] - a locale to set on the resulting DateTime instance
   * @param {string} options.outputCalendar - the output calendar to set on the resulting DateTime instance
   * @param {string} options.numberingSystem - the numbering system to set on the resulting DateTime instance
   * @return {DateTime}
   */
  static fromMillis(e, t = {}) {
    if (K(e))
      return e < -Er || e > Er ? g.invalid("Timestamp out of range") : new g({
        ts: e,
        zone: H(t.zone, S.defaultZone),
        loc: k.fromObject(t)
      });
    throw new N(
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
   * @return {DateTime}
   */
  static fromSeconds(e, t = {}) {
    if (K(e))
      return new g({
        ts: e * 1e3,
        zone: H(t.zone, S.defaultZone),
        loc: k.fromObject(t)
      });
    throw new N("fromSeconds requires a numerical input");
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
  static fromObject(e, t = {}) {
    e = e || {};
    const n = H(t.zone, S.defaultZone);
    if (!n.isValid)
      return g.invalid(Re(n));
    const s = k.fromObject(t), i = Qe(e, Mr), { minDaysInFirstWeek: o, startOfWeek: a } = pr(i, s), l = S.now(), c = m(t.specificOffset) ? n.offset(l) : t.specificOffset, d = !m(i.ordinal), h = !m(i.year), p = !m(i.month) || !m(i.day), f = h || p, v = i.weekYear || i.weekNumber;
    if ((f || d) && v)
      throw new oe(
        "Can't mix weekYear/weekNumber units with year/month/day or ordinals"
      );
    if (p && d)
      throw new oe("Can't mix ordinal dates with month/day");
    const ee = v || i.weekday && !f;
    let W, te, be = Pe(l, c);
    ee ? (W = xo, te = To, be = Be(be, o, a)) : d ? (W = Oo, te = $o, be = pt(be)) : (W = Pn, te = Rn);
    let Ht = !1;
    for (const ke of W) {
      const Yn = i[ke];
      m(Yn) ? Ht ? i[ke] = te[ke] : i[ke] = be[ke] : Ht = !0;
    }
    const zn = ee ? Qs(i, o, a) : d ? Xs(i) : fn(i), qt = zn || mn(i);
    if (qt)
      return g.invalid(qt);
    const Zn = ee ? mr(i, o, a) : d ? gr(i) : i, [Hn, qn] = qe(Zn, c, n), at = new g({
      ts: Hn,
      zone: n,
      o: qn,
      loc: s
    });
    return i.weekday && f && e.weekday !== at.weekday ? g.invalid(
      "mismatched weekday",
      `you can't specify both a weekday of ${i.weekday} and a date of ${at.toISO()}`
    ) : at;
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
   * @example DateTime.fromISO('2016-05-25T09:08:34.123')
   * @example DateTime.fromISO('2016-05-25T09:08:34.123+06:00')
   * @example DateTime.fromISO('2016-05-25T09:08:34.123+06:00', {setZone: true})
   * @example DateTime.fromISO('2016-05-25T09:08:34.123', {zone: 'utc'})
   * @example DateTime.fromISO('2016-W05-4')
   * @return {DateTime}
   */
  static fromISO(e, t = {}) {
    const [n, s] = Hi(e);
    return we(n, s, t, "ISO 8601", e);
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
   * @example DateTime.fromRFC2822('25 Nov 2016 13:23:12 GMT')
   * @example DateTime.fromRFC2822('Fri, 25 Nov 2016 13:23:12 +0600')
   * @example DateTime.fromRFC2822('25 Nov 2016 13:23 Z')
   * @return {DateTime}
   */
  static fromRFC2822(e, t = {}) {
    const [n, s] = qi(e);
    return we(n, s, t, "RFC 2822", e);
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
   * @example DateTime.fromHTTP('Sun, 06 Nov 1994 08:49:37 GMT')
   * @example DateTime.fromHTTP('Sunday, 06-Nov-94 08:49:37 GMT')
   * @example DateTime.fromHTTP('Sun Nov  6 08:49:37 1994')
   * @return {DateTime}
   */
  static fromHTTP(e, t = {}) {
    const [n, s] = Yi(e);
    return we(n, s, t, "HTTP", t);
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
   * @param {string} opts.outputCalendar - the output calendar to set on the resulting DateTime instance
   * @return {DateTime}
   */
  static fromFormat(e, t, n = {}) {
    if (m(e) || m(t))
      throw new N("fromFormat requires an input string and a format");
    const { locale: s = null, numberingSystem: i = null } = n, o = k.fromOpts({
      locale: s,
      numberingSystem: i,
      defaultToEN: !0
    }), [a, l, c, d] = So(o, e, t);
    return d ? g.invalid(d) : we(a, l, n, `format ${t}`, e, c);
  }
  /**
   * @deprecated use fromFormat instead
   */
  static fromString(e, t, n = {}) {
    return g.fromFormat(e, t, n);
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
  static fromSQL(e, t = {}) {
    const [n, s] = Xi(e);
    return we(n, s, t, "SQL", e);
  }
  /**
   * Create an invalid DateTime.
   * @param {string} reason - simple string of why this DateTime is invalid. Should not contain parameters or anything else data-dependent.
   * @param {string} [explanation=null] - longer explanation, may include parameters and other useful debugging information
   * @return {DateTime}
   */
  static invalid(e, t = null) {
    if (!e)
      throw new N("need to specify a reason the DateTime is invalid");
    const n = e instanceof F ? e : new F(e, t);
    if (S.throwOnInvalid)
      throw new Ns(n);
    return new g({ invalid: n });
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
  static parseFormatForOpts(e, t = {}) {
    const n = Ln(e, k.fromObject(t));
    return n ? n.map((s) => s ? s.val : null).join("") : null;
  }
  /**
   * Produce the the fully expanded format token for the locale
   * Does NOT quote characters, so quoted tokens will not round trip correctly
   * @param fmt
   * @param localeOpts
   * @returns {string}
   */
  static expandFormat(e, t = {}) {
    return Vn(x.parseFormat(e), k.fromObject(t)).map((s) => s.val).join("");
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
    return this.isValid ? kt(this).weekYear : NaN;
  }
  /**
   * Get the week number of the week year (1-52ish).
   * @see https://en.wikipedia.org/wiki/ISO_week_date
   * @example DateTime.local(2017, 5, 25).weekNumber //=> 21
   * @type {number}
   */
  get weekNumber() {
    return this.isValid ? kt(this).weekNumber : NaN;
  }
  /**
   * Get the day of the week.
   * 1 is Monday and 7 is Sunday
   * @see https://en.wikipedia.org/wiki/ISO_week_date
   * @example DateTime.local(2014, 11, 31).weekday //=> 4
   * @type {number}
   */
  get weekday() {
    return this.isValid ? kt(this).weekday : NaN;
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
    return this.isValid ? vt(this).weekday : NaN;
  }
  /**
   * Get the week number of the week year according to the locale. Different locales assign week numbers differently,
   * because the week can start on different days of the week (see localWeekday) and because a different number of days
   * is required for a week to count as the first week of a year.
   * @returns {number}
   */
  get localWeekNumber() {
    return this.isValid ? vt(this).weekNumber : NaN;
  }
  /**
   * Get the week year according to the locale. Different locales assign week numbers (and therefor week years)
   * differently, see localWeekNumber.
   * @returns {number}
   */
  get localWeekYear() {
    return this.isValid ? vt(this).weekYear : NaN;
  }
  /**
   * Get the ordinal (meaning the day of the year)
   * @example DateTime.local(2017, 5, 25).ordinal //=> 145
   * @type {number|DateTime}
   */
  get ordinal() {
    return this.isValid ? pt(this.c).ordinal : NaN;
  }
  /**
   * Get the human readable short month name, such as 'Oct'.
   * Defaults to the system's locale if no locale has been specified
   * @example DateTime.local(2017, 10, 30).monthShort //=> Oct
   * @type {string}
   */
  get monthShort() {
    return this.isValid ? Le.months("short", { locObj: this.loc })[this.month - 1] : null;
  }
  /**
   * Get the human readable long month name, such as 'October'.
   * Defaults to the system's locale if no locale has been specified
   * @example DateTime.local(2017, 10, 30).monthLong //=> October
   * @type {string}
   */
  get monthLong() {
    return this.isValid ? Le.months("long", { locObj: this.loc })[this.month - 1] : null;
  }
  /**
   * Get the human readable short weekday, such as 'Mon'.
   * Defaults to the system's locale if no locale has been specified
   * @example DateTime.local(2017, 10, 30).weekdayShort //=> Mon
   * @type {string}
   */
  get weekdayShort() {
    return this.isValid ? Le.weekdays("short", { locObj: this.loc })[this.weekday - 1] : null;
  }
  /**
   * Get the human readable long weekday, such as 'Monday'.
   * Defaults to the system's locale if no locale has been specified
   * @example DateTime.local(2017, 10, 30).weekdayLong //=> Monday
   * @type {string}
   */
  get weekdayLong() {
    return this.isValid ? Le.weekdays("long", { locObj: this.loc })[this.weekday - 1] : null;
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
    const e = 864e5, t = 6e4, n = nt(this.c), s = this.zone.offset(n - e), i = this.zone.offset(n + e), o = this.zone.offset(n - s * t), a = this.zone.offset(n - i * t);
    if (o === a)
      return [this];
    const l = n - o * t, c = n - a * t, d = Pe(l, o), h = Pe(c, a);
    return d.hour === h.hour && d.minute === h.minute && d.second === h.second && d.millisecond === h.millisecond ? [j(this, { ts: l }), j(this, { ts: c })] : [this];
  }
  /**
   * Returns true if this DateTime is in a leap year, false otherwise
   * @example DateTime.local(2016).isInLeapYear //=> true
   * @example DateTime.local(2013).isInLeapYear //=> false
   * @type {boolean}
   */
  get isInLeapYear() {
    return _e(this.year);
  }
  /**
   * Returns the number of days in this DateTime's month
   * @example DateTime.local(2016, 2).daysInMonth //=> 29
   * @example DateTime.local(2016, 3).daysInMonth //=> 31
   * @type {number}
   */
  get daysInMonth() {
    return Ke(this.year, this.month);
  }
  /**
   * Returns the number of days in this DateTime's year
   * @example DateTime.local(2016).daysInYear //=> 366
   * @example DateTime.local(2013).daysInYear //=> 365
   * @type {number}
   */
  get daysInYear() {
    return this.isValid ? ce(this.year) : NaN;
  }
  /**
   * Returns the number of weeks in this DateTime's year
   * @see https://en.wikipedia.org/wiki/ISO_week_date
   * @example DateTime.local(2004).weeksInWeekYear //=> 53
   * @example DateTime.local(2013).weeksInWeekYear //=> 52
   * @type {number}
   */
  get weeksInWeekYear() {
    return this.isValid ? Me(this.weekYear) : NaN;
  }
  /**
   * Returns the number of weeks in this DateTime's local week year
   * @example DateTime.local(2020, 6, {locale: 'en-US'}).weeksInLocalWeekYear //=> 52
   * @example DateTime.local(2020, 6, {locale: 'de-DE'}).weeksInLocalWeekYear //=> 53
   * @type {number}
   */
  get weeksInLocalWeekYear() {
    return this.isValid ? Me(
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
    const { locale: t, numberingSystem: n, calendar: s } = x.create(
      this.loc.clone(e),
      e
    ).resolvedOptions(this);
    return { locale: t, numberingSystem: n, outputCalendar: s };
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
  toUTC(e = 0, t = {}) {
    return this.setZone(E.instance(e), t);
  }
  /**
   * "Set" the DateTime's zone to the host's local zone. Returns a newly-constructed DateTime.
   *
   * Equivalent to `setZone('local')`
   * @return {DateTime}
   */
  toLocal() {
    return this.setZone(S.defaultZone);
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
  setZone(e, { keepLocalTime: t = !1, keepCalendarTime: n = !1 } = {}) {
    if (e = H(e, S.defaultZone), e.equals(this.zone))
      return this;
    if (e.isValid) {
      let s = this.ts;
      if (t || n) {
        const i = e.offset(this.ts), o = this.toObject();
        [s] = qe(o, i, e);
      }
      return j(this, { ts: s, zone: e });
    } else
      return g.invalid(Re(e));
  }
  /**
   * "Set" the locale, numberingSystem, or outputCalendar. Returns a newly-constructed DateTime.
   * @param {Object} properties - the properties to set
   * @example DateTime.local(2017, 5, 25).reconfigure({ locale: 'en-GB' })
   * @return {DateTime}
   */
  reconfigure({ locale: e, numberingSystem: t, outputCalendar: n } = {}) {
    const s = this.loc.clone({ locale: e, numberingSystem: t, outputCalendar: n });
    return j(this, { loc: s });
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
    if (!this.isValid)
      return this;
    const t = Qe(e, Mr), { minDaysInFirstWeek: n, startOfWeek: s } = pr(t, this.loc), i = !m(t.weekYear) || !m(t.weekNumber) || !m(t.weekday), o = !m(t.ordinal), a = !m(t.year), l = !m(t.month) || !m(t.day), c = a || l, d = t.weekYear || t.weekNumber;
    if ((c || o) && d)
      throw new oe(
        "Can't mix weekYear/weekNumber units with year/month/day or ordinals"
      );
    if (l && o)
      throw new oe("Can't mix ordinal dates with month/day");
    let h;
    i ? h = mr(
      { ...Be(this.c, n, s), ...t },
      n,
      s
    ) : m(t.ordinal) ? (h = { ...this.toObject(), ...t }, m(t.day) && (h.day = Math.min(Ke(h.year, h.month), h.day))) : h = gr({ ...pt(this.c), ...t });
    const [p, f] = qe(h, this.o, this.zone);
    return j(this, { ts: p, o: f });
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
    if (!this.isValid)
      return this;
    const t = y.fromDurationLike(e);
    return j(this, Nr(this, t));
  }
  /**
   * Subtract a period of time to this DateTime and return the resulting DateTime
   * See {@link DateTime#plus}
   * @param {Duration|Object|number} duration - The amount to subtract. Either a Luxon Duration, a number of milliseconds, the object argument to Duration.fromObject()
   @return {DateTime}
   */
  minus(e) {
    if (!this.isValid)
      return this;
    const t = y.fromDurationLike(e).negate();
    return j(this, Nr(this, t));
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
  startOf(e, { useLocaleWeeks: t = !1 } = {}) {
    if (!this.isValid)
      return this;
    const n = {}, s = y.normalizeUnit(e);
    switch (s) {
      case "years":
        n.month = 1;
      case "quarters":
      case "months":
        n.day = 1;
      case "weeks":
      case "days":
        n.hour = 0;
      case "hours":
        n.minute = 0;
      case "minutes":
        n.second = 0;
      case "seconds":
        n.millisecond = 0;
        break;
    }
    if (s === "weeks")
      if (t) {
        const i = this.loc.getStartOfWeek(), { weekday: o } = this;
        o < i && (n.weekNumber = this.weekNumber - 1), n.weekday = i;
      } else
        n.weekday = 1;
    if (s === "quarters") {
      const i = Math.ceil(this.month / 3);
      n.month = (i - 1) * 3 + 1;
    }
    return this.set(n);
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
  endOf(e, t) {
    return this.isValid ? this.plus({ [e]: 1 }).startOf(e, t).minus(1) : this;
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
  toFormat(e, t = {}) {
    return this.isValid ? x.create(this.loc.redefaultToEN(t)).formatDateTimeFromString(this, e) : bt;
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
  toLocaleString(e = Je, t = {}) {
    return this.isValid ? x.create(this.loc.clone(t), e).formatDateTime(this) : bt;
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
    return this.isValid ? x.create(this.loc.clone(e), e).formatDateTimeParts(this) : [];
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
    suppressSeconds: t = !1,
    suppressMilliseconds: n = !1,
    includeOffset: s = !0,
    extendedZone: i = !1
  } = {}) {
    if (!this.isValid)
      return null;
    const o = e === "extended";
    let a = wt(this, o);
    return a += "T", a += Cr(this, o, t, n, s, i), a;
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
    return this.isValid ? wt(this, e === "extended") : null;
  }
  /**
   * Returns an ISO 8601-compliant string representation of this DateTime's week date
   * @example DateTime.utc(1982, 5, 25).toISOWeekDate() //=> '1982-W21-2'
   * @return {string}
   */
  toISOWeekDate() {
    return ze(this, "kkkk-'W'WW-c");
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
    suppressSeconds: t = !1,
    includeOffset: n = !0,
    includePrefix: s = !1,
    extendedZone: i = !1,
    format: o = "extended"
  } = {}) {
    return this.isValid ? (s ? "T" : "") + Cr(
      this,
      o === "extended",
      t,
      e,
      n,
      i
    ) : null;
  }
  /**
   * Returns an RFC 2822-compatible string representation of this DateTime
   * @example DateTime.utc(2014, 7, 13).toRFC2822() //=> 'Sun, 13 Jul 2014 00:00:00 +0000'
   * @example DateTime.local(2014, 7, 13).toRFC2822() //=> 'Sun, 13 Jul 2014 00:00:00 -0400'
   * @return {string}
   */
  toRFC2822() {
    return ze(this, "EEE, dd LLL yyyy HH:mm:ss ZZZ", !1);
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
    return ze(this.toUTC(), "EEE, dd LLL yyyy HH:mm:ss 'GMT'");
  }
  /**
   * Returns a string representation of this DateTime appropriate for use in SQL Date
   * @example DateTime.utc(2014, 7, 13).toSQLDate() //=> '2014-07-13'
   * @return {string}
   */
  toSQLDate() {
    return this.isValid ? wt(this, !0) : null;
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
  toSQLTime({ includeOffset: e = !0, includeZone: t = !1, includeOffsetSpace: n = !0 } = {}) {
    let s = "HH:mm:ss.SSS";
    return (t || e) && (n && (s += " "), t ? s += "z" : e && (s += "ZZ")), ze(this, s, !0);
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
    return this.isValid ? this.toISO() : bt;
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
    if (!this.isValid)
      return {};
    const t = { ...this.c };
    return e.includeConfig && (t.outputCalendar = this.outputCalendar, t.numberingSystem = this.loc.numberingSystem, t.locale = this.loc.locale), t;
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
  diff(e, t = "milliseconds", n = {}) {
    if (!this.isValid || !e.isValid)
      return y.invalid("created by diffing an invalid DateTime");
    const s = { locale: this.locale, numberingSystem: this.numberingSystem, ...n }, i = ri(t).map(y.normalizeUnit), o = e.valueOf() > this.valueOf(), a = o ? this : e, l = o ? e : this, c = oo(a, l, i, s);
    return o ? c.negate() : c;
  }
  /**
   * Return the difference between this DateTime and right now.
   * See {@link DateTime#diff}
   * @param {string|string[]} [unit=['milliseconds']] - the unit or units units (such as 'hours' or 'days') to include in the duration
   * @param {Object} opts - options that affect the creation of the Duration
   * @param {string} [opts.conversionAccuracy='casual'] - the conversion system to use
   * @return {Duration}
   */
  diffNow(e = "milliseconds", t = {}) {
    return this.diff(g.now(), e, t);
  }
  /**
   * Return an Interval spanning between this DateTime and another DateTime
   * @param {DateTime} otherDateTime - the other end point of the Interval
   * @return {Interval}
   */
  until(e) {
    return this.isValid ? w.fromDateTimes(this, e) : this;
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
  hasSame(e, t, n) {
    if (!this.isValid)
      return !1;
    const s = e.valueOf(), i = this.setZone(e.zone, { keepLocalTime: !0 });
    return i.startOf(t, n) <= s && s <= i.endOf(t, n);
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
    if (!this.isValid)
      return null;
    const t = e.base || g.fromObject({}, { zone: this.zone }), n = e.padding ? this < t ? -e.padding : e.padding : 0;
    let s = ["years", "months", "days", "hours", "minutes", "seconds"], i = e.unit;
    return Array.isArray(e.unit) && (s = e.unit, i = void 0), Dr(t, this.plus(n), {
      ...e,
      numeric: "always",
      units: s,
      unit: i
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
    return this.isValid ? Dr(e.base || g.fromObject({}, { zone: this.zone }), this, {
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
    if (!e.every(g.isDateTime))
      throw new N("min requires all arguments be DateTimes");
    return yr(e, (t) => t.valueOf(), Math.min);
  }
  /**
   * Return the max of several date times
   * @param {...DateTime} dateTimes - the DateTimes from which to choose the maximum
   * @return {DateTime} the max DateTime, or undefined if called with no argument
   */
  static max(...e) {
    if (!e.every(g.isDateTime))
      throw new N("max requires all arguments be DateTimes");
    return yr(e, (t) => t.valueOf(), Math.max);
  }
  // MISC
  /**
   * Explain how a string would be parsed by fromFormat()
   * @param {string} text - the string to parse
   * @param {string} fmt - the format the string is expected to be in (see description)
   * @param {Object} options - options taken by fromFormat()
   * @return {Object}
   */
  static fromFormatExplain(e, t, n = {}) {
    const { locale: s = null, numberingSystem: i = null } = n, o = k.fromOpts({
      locale: s,
      numberingSystem: i,
      defaultToEN: !0
    });
    return Wn(o, e, t);
  }
  /**
   * @deprecated use fromFormatExplain instead
   */
  static fromStringExplain(e, t, n = {}) {
    return g.fromFormatExplain(e, t, n);
  }
  // FORMAT PRESETS
  /**
   * {@link DateTime#toLocaleString} format like 10/14/1983
   * @type {Object}
   */
  static get DATE_SHORT() {
    return Je;
  }
  /**
   * {@link DateTime#toLocaleString} format like 'Oct 14, 1983'
   * @type {Object}
   */
  static get DATE_MED() {
    return Zr;
  }
  /**
   * {@link DateTime#toLocaleString} format like 'Fri, Oct 14, 1983'
   * @type {Object}
   */
  static get DATE_MED_WITH_WEEKDAY() {
    return Is;
  }
  /**
   * {@link DateTime#toLocaleString} format like 'October 14, 1983'
   * @type {Object}
   */
  static get DATE_FULL() {
    return Hr;
  }
  /**
   * {@link DateTime#toLocaleString} format like 'Tuesday, October 14, 1983'
   * @type {Object}
   */
  static get DATE_HUGE() {
    return qr;
  }
  /**
   * {@link DateTime#toLocaleString} format like '09:30 AM'. Only 12-hour if the locale is.
   * @type {Object}
   */
  static get TIME_SIMPLE() {
    return Yr;
  }
  /**
   * {@link DateTime#toLocaleString} format like '09:30:23 AM'. Only 12-hour if the locale is.
   * @type {Object}
   */
  static get TIME_WITH_SECONDS() {
    return Gr;
  }
  /**
   * {@link DateTime#toLocaleString} format like '09:30:23 AM EDT'. Only 12-hour if the locale is.
   * @type {Object}
   */
  static get TIME_WITH_SHORT_OFFSET() {
    return jr;
  }
  /**
   * {@link DateTime#toLocaleString} format like '09:30:23 AM Eastern Daylight Time'. Only 12-hour if the locale is.
   * @type {Object}
   */
  static get TIME_WITH_LONG_OFFSET() {
    return Jr;
  }
  /**
   * {@link DateTime#toLocaleString} format like '09:30', always 24-hour.
   * @type {Object}
   */
  static get TIME_24_SIMPLE() {
    return Br;
  }
  /**
   * {@link DateTime#toLocaleString} format like '09:30:23', always 24-hour.
   * @type {Object}
   */
  static get TIME_24_WITH_SECONDS() {
    return Kr;
  }
  /**
   * {@link DateTime#toLocaleString} format like '09:30:23 EDT', always 24-hour.
   * @type {Object}
   */
  static get TIME_24_WITH_SHORT_OFFSET() {
    return Qr;
  }
  /**
   * {@link DateTime#toLocaleString} format like '09:30:23 Eastern Daylight Time', always 24-hour.
   * @type {Object}
   */
  static get TIME_24_WITH_LONG_OFFSET() {
    return Xr;
  }
  /**
   * {@link DateTime#toLocaleString} format like '10/14/1983, 9:30 AM'. Only 12-hour if the locale is.
   * @type {Object}
   */
  static get DATETIME_SHORT() {
    return en;
  }
  /**
   * {@link DateTime#toLocaleString} format like '10/14/1983, 9:30:33 AM'. Only 12-hour if the locale is.
   * @type {Object}
   */
  static get DATETIME_SHORT_WITH_SECONDS() {
    return tn;
  }
  /**
   * {@link DateTime#toLocaleString} format like 'Oct 14, 1983, 9:30 AM'. Only 12-hour if the locale is.
   * @type {Object}
   */
  static get DATETIME_MED() {
    return rn;
  }
  /**
   * {@link DateTime#toLocaleString} format like 'Oct 14, 1983, 9:30:33 AM'. Only 12-hour if the locale is.
   * @type {Object}
   */
  static get DATETIME_MED_WITH_SECONDS() {
    return nn;
  }
  /**
   * {@link DateTime#toLocaleString} format like 'Fri, 14 Oct 1983, 9:30 AM'. Only 12-hour if the locale is.
   * @type {Object}
   */
  static get DATETIME_MED_WITH_WEEKDAY() {
    return Ds;
  }
  /**
   * {@link DateTime#toLocaleString} format like 'October 14, 1983, 9:30 AM EDT'. Only 12-hour if the locale is.
   * @type {Object}
   */
  static get DATETIME_FULL() {
    return sn;
  }
  /**
   * {@link DateTime#toLocaleString} format like 'October 14, 1983, 9:30:33 AM EDT'. Only 12-hour if the locale is.
   * @type {Object}
   */
  static get DATETIME_FULL_WITH_SECONDS() {
    return on;
  }
  /**
   * {@link DateTime#toLocaleString} format like 'Friday, October 14, 1983, 9:30 AM Eastern Daylight Time'. Only 12-hour if the locale is.
   * @type {Object}
   */
  static get DATETIME_HUGE() {
    return an;
  }
  /**
   * {@link DateTime#toLocaleString} format like 'Friday, October 14, 1983, 9:30:33 AM Eastern Daylight Time'. Only 12-hour if the locale is.
   * @type {Object}
   */
  static get DATETIME_HUGE_WITH_SECONDS() {
    return ln;
  }
}
function Se(r) {
  if (g.isDateTime(r))
    return r;
  if (r && r.valueOf && K(r.valueOf()))
    return g.fromJSDate(r);
  if (r && typeof r == "object")
    return g.fromObject(r);
  throw new N(
    `Unknown datetime argument: ${r}, of type ${typeof r}`
  );
}
function No(r, e = !0) {
  const t = ["I", "II", "III", "IV", "V", "VI", "VII", "VIII", "IX", "X", "XI", "XII"], n = `${r.day}.${t[r.month - 1]}.${r.year}`;
  return e ? n + " " + r.toLocaleString(g.TIME_SIMPLE) : n;
}
var Co = Object.defineProperty, Mo = Object.getOwnPropertyDescriptor, Io = Object.getPrototypeOf, Do = Reflect.get, ot = (r, e, t, n) => {
  for (var s = n > 1 ? void 0 : n ? Mo(e, t) : e, i = r.length - 1, o; i >= 0; i--)
    (o = r[i]) && (s = (n ? o(e, t, s) : o(s)) || s);
  return n && s && Co(e, t, s), s;
}, _o = (r, e, t) => Do(Io(r), t, e);
let L = class extends je {
  constructor() {
    super(), this.dock = "", this.sortedColumn = "time", this.sortDirection = 1;
  }
  firstUpdated(r) {
    super.firstUpdated(r);
  }
  willUpdate(r) {
    super.willUpdate(r), r.has("dock") && this.events && r.get("dock") !== this.dock && (this.events = void 0, this.fetchEvents());
  }
  updated(r) {
    super.updated(r), r.has("apiContext") && this.apiContext && this.fetchEvents();
  }
  fetchEvents() {
    this.showProgress = !0;
    const r = new URLSearchParams();
    this.dock && this.dock !== "" && r.append("dock_id", this.dock), this.apiContext.fetchFromApi(
      "syncmanager",
      "events",
      {
        method: "GET",
        caller: "hubeventlog.fetchEvents"
      },
      "v1",
      r
    ).then((e) => {
      this.loadEvents(e);
    }).catch((e) => {
      Es(this, e, "hubeventlog.fetchEvents", null);
    });
  }
  loadEvents(r) {
    this.events = r.events;
    for (const e of this.events)
      e.tsDate = g.fromISO(e.ts);
  }
  headerClicked(r) {
    let e = r.currentTarget.innerText;
    this.sortedColumn === e ? this.sortDirection = this.sortDirection == 1 ? 0 : 1 : this.sortedColumn = e, this.sort();
  }
  sort() {
    let r = [...this.events], e = "ts", t = this.sortDirection == 0 ? -1 : 1;
    switch (this.sortedColumn) {
      case "time":
        e = "ts";
        break;
      default:
        e = this.sortedColumn;
    }
    r.sort((n, s) => {
      let i = 0;
      return e != "ts" && (i = n[e] < s[e] ? -1 : n[e] > s[e] ? 1 : 0, i) ? i * t : (n.tsDate < s.tsDate ? 1 : n.tsDate > s.tsDate ? -1 : 0) * t;
    }), this.events = r;
  }
  renderHeader() {
    return ["time", "dock", "event", "user", "message"].map((e) => O`
            <div class="log-header" @click="${this.headerClicked}">
                <span>${e}</span>
                ${(this.sortedColumn === e || e === "time") && this.sortDirection == 0 ? O`<i class="fas fa-asc ${this.sortedColumn === e ? void 0 : "dim_sort_col"}"></i>` : void 0}
                ${(this.sortedColumn === e || e === "time") && this.sortDirection == 1 ? O`<i class="fas fa-desc ${this.sortedColumn === e ? void 0 : "dim_sort_col"}"></i>` : void 0}
            </div>
        `);
  }
  renderBody() {
    if (this.events, this.events)
      return O`${this.events.map((r) => O`
            <div class="log-cell">${No(r.tsDate, !0).toLocaleString()}</div>
            <div class="log-cell">${r.dock}</div>
            <div class="log-cell">${r.event}</div>
            <div class="log-cell">${r.user}</div>
            <div class="log-cell">${r.message}</div>
            `)}`;
  }
  apiRender() {
    const r = this.renderHeader(), e = this.renderBody();
    return O`<div id="log-frame">
            ${r}
            ${e}
            <div`;
  }
};
L.styles = Dt(Ss);
L.properties = {
  ..._o(L, L, "properties"),
  dock: { type: String }
};
ot([
  et()
], L.prototype, "events", 2);
ot([
  et()
], L.prototype, "sortedColumn", 2);
ot([
  et()
], L.prototype, "sortDirection", 2);
L = ot([
  bs("hub-event-log")
], L);
const ae = class ae extends Tt {
  constructor() {
    super(), this.login_token = "", this.dock = "", this._messages = {};
  }
  firstUpdated(e) {
    super.firstUpdated(e);
  }
  apiConnected() {
  }
  changeDock(e) {
    let t = e.currentTarget.value;
    this.shadowRoot.querySelector("hub-event-log").setAttribute("dock", t);
  }
  backClick() {
    const e = {
      bubbles: !0
    };
    this.dispatchEvent(new CustomEvent("go-back", e));
  }
  renderToolbar() {
    return re`
            <div class="toolbar">
                <div id="toolbar-left">
                    <div class="small-list-button"><i class='fas fa-arrow-circle-left' style='justify-self: center' @click="${this.backClick}"></i></div>
                    <label for="dock_filter">dock:</label><input id="dock_filter" name="dock_filter" type="text" value="${this.dock}" @change="${this.changeDock}"/>
                </div>
                <div></div>
            </div>`;
  }
  render_app() {
    let e = re``, t = re`
            <div class='event-log-frame'>
                 <hub-event-log .apiContext="${this.apiContext}" dock="${this.dock}"></hub-event-log>
             </div>`;
    return re`${e}${t}`;
  }
  apiRender() {
    let e = re``;
    const t = this.render_app(), n = this.renderToolbar();
    return re`${e}${n}${t}`;
  }
};
ae.styles = Dt(ys), ae.properties = {
  ...Yt(ae, ae, "properties"),
  login_token: { type: String },
  dock: { type: String }
};
let Mt = ae;
window.customElements.define("hubeventlog-app", Mt);
