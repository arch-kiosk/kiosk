/**
 * @license
 * Copyright 2019 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const qe = globalThis, Wt = qe.ShadowRoot && (qe.ShadyCSS === void 0 || qe.ShadyCSS.nativeShadow) && "adoptedStyleSheets" in Document.prototype && "replace" in CSSStyleSheet.prototype, Lr = Symbol(), Qt = /* @__PURE__ */ new WeakMap();
let Xs = class {
  constructor(e, t, s) {
    if (this._$cssResult$ = !0, s !== Lr) throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");
    this.cssText = e, this.t = t;
  }
  get styleSheet() {
    let e = this.o;
    const t = this.t;
    if (Wt && e === void 0) {
      const s = t !== void 0 && t.length === 1;
      s && (e = Qt.get(t)), e === void 0 && ((this.o = e = new CSSStyleSheet()).replaceSync(this.cssText), s && Qt.set(t, e));
    }
    return e;
  }
  toString() {
    return this.cssText;
  }
};
const Ae = (r) => new Xs(typeof r == "string" ? r : r + "", void 0, Lr), en = (r, e) => {
  if (Wt) r.adoptedStyleSheets = e.map((t) => t instanceof CSSStyleSheet ? t : t.styleSheet);
  else for (const t of e) {
    const s = document.createElement("style"), n = qe.litNonce;
    n !== void 0 && s.setAttribute("nonce", n), s.textContent = t.cssText, r.appendChild(s);
  }
}, Xt = Wt ? (r) => r : (r) => r instanceof CSSStyleSheet ? ((e) => {
  let t = "";
  for (const s of e.cssRules) t += s.cssText;
  return Ae(t);
})(r) : r;
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const { is: tn, defineProperty: rn, getOwnPropertyDescriptor: sn, getOwnPropertyNames: nn, getOwnPropertySymbols: on, getPrototypeOf: an } = Object, q = globalThis, er = q.trustedTypes, ln = er ? er.emptyScript : "", dt = q.reactiveElementPolyfillSupport, Oe = (r, e) => r, Ke = { toAttribute(r, e) {
  switch (e) {
    case Boolean:
      r = r ? ln : null;
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
} }, Ft = (r, e) => !tn(r, e), tr = { attribute: !0, type: String, converter: Ke, reflect: !1, hasChanged: Ft };
Symbol.metadata ?? (Symbol.metadata = Symbol("metadata")), q.litPropertyMetadata ?? (q.litPropertyMetadata = /* @__PURE__ */ new WeakMap());
class ae extends HTMLElement {
  static addInitializer(e) {
    this._$Ei(), (this.l ?? (this.l = [])).push(e);
  }
  static get observedAttributes() {
    return this.finalize(), this._$Eh && [...this._$Eh.keys()];
  }
  static createProperty(e, t = tr) {
    if (t.state && (t.attribute = !1), this._$Ei(), this.elementProperties.set(e, t), !t.noAccessor) {
      const s = Symbol(), n = this.getPropertyDescriptor(e, s, t);
      n !== void 0 && rn(this.prototype, e, n);
    }
  }
  static getPropertyDescriptor(e, t, s) {
    const { get: n, set: o } = sn(this.prototype, e) ?? { get() {
      return this[t];
    }, set(i) {
      this[t] = i;
    } };
    return { get() {
      return n == null ? void 0 : n.call(this);
    }, set(i) {
      const a = n == null ? void 0 : n.call(this);
      o.call(this, i), this.requestUpdate(e, a, s);
    }, configurable: !0, enumerable: !0 };
  }
  static getPropertyOptions(e) {
    return this.elementProperties.get(e) ?? tr;
  }
  static _$Ei() {
    if (this.hasOwnProperty(Oe("elementProperties"))) return;
    const e = an(this);
    e.finalize(), e.l !== void 0 && (this.l = [...e.l]), this.elementProperties = new Map(e.elementProperties);
  }
  static finalize() {
    if (this.hasOwnProperty(Oe("finalized"))) return;
    if (this.finalized = !0, this._$Ei(), this.hasOwnProperty(Oe("properties"))) {
      const t = this.properties, s = [...nn(t), ...on(t)];
      for (const n of s) this.createProperty(n, t[n]);
    }
    const e = this[Symbol.metadata];
    if (e !== null) {
      const t = litPropertyMetadata.get(e);
      if (t !== void 0) for (const [s, n] of t) this.elementProperties.set(s, n);
    }
    this._$Eh = /* @__PURE__ */ new Map();
    for (const [t, s] of this.elementProperties) {
      const n = this._$Eu(t, s);
      n !== void 0 && this._$Eh.set(n, t);
    }
    this.elementStyles = this.finalizeStyles(this.styles);
  }
  static finalizeStyles(e) {
    const t = [];
    if (Array.isArray(e)) {
      const s = new Set(e.flat(1 / 0).reverse());
      for (const n of s) t.unshift(Xt(n));
    } else e !== void 0 && t.push(Xt(e));
    return t;
  }
  static _$Eu(e, t) {
    const s = t.attribute;
    return s === !1 ? void 0 : typeof s == "string" ? s : typeof e == "string" ? e.toLowerCase() : void 0;
  }
  constructor() {
    super(), this._$Ep = void 0, this.isUpdatePending = !1, this.hasUpdated = !1, this._$Em = null, this._$Ev();
  }
  _$Ev() {
    var e;
    this._$ES = new Promise((t) => this.enableUpdating = t), this._$AL = /* @__PURE__ */ new Map(), this._$E_(), this.requestUpdate(), (e = this.constructor.l) == null || e.forEach((t) => t(this));
  }
  addController(e) {
    var t;
    (this._$EO ?? (this._$EO = /* @__PURE__ */ new Set())).add(e), this.renderRoot !== void 0 && this.isConnected && ((t = e.hostConnected) == null || t.call(e));
  }
  removeController(e) {
    var t;
    (t = this._$EO) == null || t.delete(e);
  }
  _$E_() {
    const e = /* @__PURE__ */ new Map(), t = this.constructor.elementProperties;
    for (const s of t.keys()) this.hasOwnProperty(s) && (e.set(s, this[s]), delete this[s]);
    e.size > 0 && (this._$Ep = e);
  }
  createRenderRoot() {
    const e = this.shadowRoot ?? this.attachShadow(this.constructor.shadowRootOptions);
    return en(e, this.constructor.elementStyles), e;
  }
  connectedCallback() {
    var e;
    this.renderRoot ?? (this.renderRoot = this.createRenderRoot()), this.enableUpdating(!0), (e = this._$EO) == null || e.forEach((t) => {
      var s;
      return (s = t.hostConnected) == null ? void 0 : s.call(t);
    });
  }
  enableUpdating(e) {
  }
  disconnectedCallback() {
    var e;
    (e = this._$EO) == null || e.forEach((t) => {
      var s;
      return (s = t.hostDisconnected) == null ? void 0 : s.call(t);
    });
  }
  attributeChangedCallback(e, t, s) {
    this._$AK(e, s);
  }
  _$EC(e, t) {
    var o;
    const s = this.constructor.elementProperties.get(e), n = this.constructor._$Eu(e, s);
    if (n !== void 0 && s.reflect === !0) {
      const i = (((o = s.converter) == null ? void 0 : o.toAttribute) !== void 0 ? s.converter : Ke).toAttribute(t, s.type);
      this._$Em = e, i == null ? this.removeAttribute(n) : this.setAttribute(n, i), this._$Em = null;
    }
  }
  _$AK(e, t) {
    var o;
    const s = this.constructor, n = s._$Eh.get(e);
    if (n !== void 0 && this._$Em !== n) {
      const i = s.getPropertyOptions(n), a = typeof i.converter == "function" ? { fromAttribute: i.converter } : ((o = i.converter) == null ? void 0 : o.fromAttribute) !== void 0 ? i.converter : Ke;
      this._$Em = n, this[n] = a.fromAttribute(t, i.type), this._$Em = null;
    }
  }
  requestUpdate(e, t, s) {
    if (e !== void 0) {
      if (s ?? (s = this.constructor.getPropertyOptions(e)), !(s.hasChanged ?? Ft)(this[e], t)) return;
      this.P(e, t, s);
    }
    this.isUpdatePending === !1 && (this._$ES = this._$ET());
  }
  P(e, t, s) {
    this._$AL.has(e) || this._$AL.set(e, t), s.reflect === !0 && this._$Em !== e && (this._$Ej ?? (this._$Ej = /* @__PURE__ */ new Set())).add(e);
  }
  async _$ET() {
    this.isUpdatePending = !0;
    try {
      await this._$ES;
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
    var s;
    if (!this.isUpdatePending) return;
    if (!this.hasUpdated) {
      if (this.renderRoot ?? (this.renderRoot = this.createRenderRoot()), this._$Ep) {
        for (const [o, i] of this._$Ep) this[o] = i;
        this._$Ep = void 0;
      }
      const n = this.constructor.elementProperties;
      if (n.size > 0) for (const [o, i] of n) i.wrapped !== !0 || this._$AL.has(o) || this[o] === void 0 || this.P(o, this[o], i);
    }
    let e = !1;
    const t = this._$AL;
    try {
      e = this.shouldUpdate(t), e ? (this.willUpdate(t), (s = this._$EO) == null || s.forEach((n) => {
        var o;
        return (o = n.hostUpdate) == null ? void 0 : o.call(n);
      }), this.update(t)) : this._$EU();
    } catch (n) {
      throw e = !1, this._$EU(), n;
    }
    e && this._$AE(t);
  }
  willUpdate(e) {
  }
  _$AE(e) {
    var t;
    (t = this._$EO) == null || t.forEach((s) => {
      var n;
      return (n = s.hostUpdated) == null ? void 0 : n.call(s);
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
    this._$Ej && (this._$Ej = this._$Ej.forEach((t) => this._$EC(t, this[t]))), this._$EU();
  }
  updated(e) {
  }
  firstUpdated(e) {
  }
}
ae.elementStyles = [], ae.shadowRootOptions = { mode: "open" }, ae[Oe("elementProperties")] = /* @__PURE__ */ new Map(), ae[Oe("finalized")] = /* @__PURE__ */ new Map(), dt == null || dt({ ReactiveElement: ae }), (q.reactiveElementVersions ?? (q.reactiveElementVersions = [])).push("2.0.4");
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const Ee = globalThis, Qe = Ee.trustedTypes, rr = Qe ? Qe.createPolicy("lit-html", { createHTML: (r) => r }) : void 0, Ur = "$lit$", Z = `lit$${Math.random().toFixed(9).slice(2)}$`, jr = "?" + Z, cn = `<${jr}>`, X = document, Ce = () => X.createComment(""), Me = (r) => r === null || typeof r != "object" && typeof r != "function", Vt = Array.isArray, un = (r) => Vt(r) || typeof (r == null ? void 0 : r[Symbol.iterator]) == "function", ht = `[ 	
\f\r]`, Se = /<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g, sr = /-->/g, nr = />/g, G = RegExp(`>|${ht}(?:([^\\s"'>=/]+)(${ht}*=${ht}*(?:[^ 	
\f\r"'\`<>=]|("|')|))|$)`, "g"), or = /'/g, ir = /"/g, Pr = /^(?:script|style|textarea|title)$/i, dn = (r) => (e, ...t) => ({ _$litType$: r, strings: e, values: t }), b = dn(1), fe = Symbol.for("lit-noChange"), _ = Symbol.for("lit-nothing"), ar = /* @__PURE__ */ new WeakMap(), K = X.createTreeWalker(X, 129);
function Zr(r, e) {
  if (!Vt(r) || !r.hasOwnProperty("raw")) throw Error("invalid template strings array");
  return rr !== void 0 ? rr.createHTML(e) : e;
}
const hn = (r, e) => {
  const t = r.length - 1, s = [];
  let n, o = e === 2 ? "<svg>" : e === 3 ? "<math>" : "", i = Se;
  for (let a = 0; a < t; a++) {
    const l = r[a];
    let c, d, h = -1, y = 0;
    for (; y < l.length && (i.lastIndex = y, d = i.exec(l), d !== null); ) y = i.lastIndex, i === Se ? d[1] === "!--" ? i = sr : d[1] !== void 0 ? i = nr : d[2] !== void 0 ? (Pr.test(d[2]) && (n = RegExp("</" + d[2], "g")), i = G) : d[3] !== void 0 && (i = G) : i === G ? d[0] === ">" ? (i = n ?? Se, h = -1) : d[1] === void 0 ? h = -2 : (h = i.lastIndex - d[2].length, c = d[1], i = d[3] === void 0 ? G : d[3] === '"' ? ir : or) : i === ir || i === or ? i = G : i === sr || i === nr ? i = Se : (i = G, n = void 0);
    const f = i === G && r[a + 1].startsWith("/>") ? " " : "";
    o += i === Se ? l + cn : h >= 0 ? (s.push(c), l.slice(0, h) + Ur + l.slice(h) + Z + f) : l + Z + (h === -2 ? a : f);
  }
  return [Zr(r, o + (r[t] || "<?>") + (e === 2 ? "</svg>" : e === 3 ? "</math>" : "")), s];
};
class Ie {
  constructor({ strings: e, _$litType$: t }, s) {
    let n;
    this.parts = [];
    let o = 0, i = 0;
    const a = e.length - 1, l = this.parts, [c, d] = hn(e, t);
    if (this.el = Ie.createElement(c, s), K.currentNode = this.el.content, t === 2 || t === 3) {
      const h = this.el.content.firstChild;
      h.replaceWith(...h.childNodes);
    }
    for (; (n = K.nextNode()) !== null && l.length < a; ) {
      if (n.nodeType === 1) {
        if (n.hasAttributes()) for (const h of n.getAttributeNames()) if (h.endsWith(Ur)) {
          const y = d[i++], f = n.getAttribute(h).split(Z), w = /([.?@])?(.*)/.exec(y);
          l.push({ type: 1, index: o, name: w[2], strings: f, ctor: w[1] === "." ? gn : w[1] === "?" ? mn : w[1] === "@" ? bn : nt }), n.removeAttribute(h);
        } else h.startsWith(Z) && (l.push({ type: 6, index: o }), n.removeAttribute(h));
        if (Pr.test(n.tagName)) {
          const h = n.textContent.split(Z), y = h.length - 1;
          if (y > 0) {
            n.textContent = Qe ? Qe.emptyScript : "";
            for (let f = 0; f < y; f++) n.append(h[f], Ce()), K.nextNode(), l.push({ type: 2, index: ++o });
            n.append(h[y], Ce());
          }
        }
      } else if (n.nodeType === 8) if (n.data === jr) l.push({ type: 2, index: o });
      else {
        let h = -1;
        for (; (h = n.data.indexOf(Z, h + 1)) !== -1; ) l.push({ type: 7, index: o }), h += Z.length - 1;
      }
      o++;
    }
  }
  static createElement(e, t) {
    const s = X.createElement("template");
    return s.innerHTML = e, s;
  }
}
function ge(r, e, t = r, s) {
  var i, a;
  if (e === fe) return e;
  let n = s !== void 0 ? (i = t.o) == null ? void 0 : i[s] : t.l;
  const o = Me(e) ? void 0 : e._$litDirective$;
  return (n == null ? void 0 : n.constructor) !== o && ((a = n == null ? void 0 : n._$AO) == null || a.call(n, !1), o === void 0 ? n = void 0 : (n = new o(r), n._$AT(r, t, s)), s !== void 0 ? (t.o ?? (t.o = []))[s] = n : t.l = n), n !== void 0 && (e = ge(r, n._$AS(r, e.values), n, s)), e;
}
class fn {
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
    const { el: { content: t }, parts: s } = this._$AD, n = ((e == null ? void 0 : e.creationScope) ?? X).importNode(t, !0);
    K.currentNode = n;
    let o = K.nextNode(), i = 0, a = 0, l = s[0];
    for (; l !== void 0; ) {
      if (i === l.index) {
        let c;
        l.type === 2 ? c = new We(o, o.nextSibling, this, e) : l.type === 1 ? c = new l.ctor(o, l.name, l.strings, this, e) : l.type === 6 && (c = new pn(o, this, e)), this._$AV.push(c), l = s[++a];
      }
      i !== (l == null ? void 0 : l.index) && (o = K.nextNode(), i++);
    }
    return K.currentNode = X, n;
  }
  p(e) {
    let t = 0;
    for (const s of this._$AV) s !== void 0 && (s.strings !== void 0 ? (s._$AI(e, s, t), t += s.strings.length - 2) : s._$AI(e[t])), t++;
  }
}
class We {
  get _$AU() {
    var e;
    return ((e = this._$AM) == null ? void 0 : e._$AU) ?? this.v;
  }
  constructor(e, t, s, n) {
    this.type = 2, this._$AH = _, this._$AN = void 0, this._$AA = e, this._$AB = t, this._$AM = s, this.options = n, this.v = (n == null ? void 0 : n.isConnected) ?? !0;
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
    e = ge(this, e, t), Me(e) ? e === _ || e == null || e === "" ? (this._$AH !== _ && this._$AR(), this._$AH = _) : e !== this._$AH && e !== fe && this._(e) : e._$litType$ !== void 0 ? this.$(e) : e.nodeType !== void 0 ? this.T(e) : un(e) ? this.k(e) : this._(e);
  }
  O(e) {
    return this._$AA.parentNode.insertBefore(e, this._$AB);
  }
  T(e) {
    this._$AH !== e && (this._$AR(), this._$AH = this.O(e));
  }
  _(e) {
    this._$AH !== _ && Me(this._$AH) ? this._$AA.nextSibling.data = e : this.T(X.createTextNode(e)), this._$AH = e;
  }
  $(e) {
    var o;
    const { values: t, _$litType$: s } = e, n = typeof s == "number" ? this._$AC(e) : (s.el === void 0 && (s.el = Ie.createElement(Zr(s.h, s.h[0]), this.options)), s);
    if (((o = this._$AH) == null ? void 0 : o._$AD) === n) this._$AH.p(t);
    else {
      const i = new fn(n, this), a = i.u(this.options);
      i.p(t), this.T(a), this._$AH = i;
    }
  }
  _$AC(e) {
    let t = ar.get(e.strings);
    return t === void 0 && ar.set(e.strings, t = new Ie(e)), t;
  }
  k(e) {
    Vt(this._$AH) || (this._$AH = [], this._$AR());
    const t = this._$AH;
    let s, n = 0;
    for (const o of e) n === t.length ? t.push(s = new We(this.O(Ce()), this.O(Ce()), this, this.options)) : s = t[n], s._$AI(o), n++;
    n < t.length && (this._$AR(s && s._$AB.nextSibling, n), t.length = n);
  }
  _$AR(e = this._$AA.nextSibling, t) {
    var s;
    for ((s = this._$AP) == null ? void 0 : s.call(this, !1, !0, t); e && e !== this._$AB; ) {
      const n = e.nextSibling;
      e.remove(), e = n;
    }
  }
  setConnected(e) {
    var t;
    this._$AM === void 0 && (this.v = e, (t = this._$AP) == null || t.call(this, e));
  }
}
class nt {
  get tagName() {
    return this.element.tagName;
  }
  get _$AU() {
    return this._$AM._$AU;
  }
  constructor(e, t, s, n, o) {
    this.type = 1, this._$AH = _, this._$AN = void 0, this.element = e, this.name = t, this._$AM = n, this.options = o, s.length > 2 || s[0] !== "" || s[1] !== "" ? (this._$AH = Array(s.length - 1).fill(new String()), this.strings = s) : this._$AH = _;
  }
  _$AI(e, t = this, s, n) {
    const o = this.strings;
    let i = !1;
    if (o === void 0) e = ge(this, e, t, 0), i = !Me(e) || e !== this._$AH && e !== fe, i && (this._$AH = e);
    else {
      const a = e;
      let l, c;
      for (e = o[0], l = 0; l < o.length - 1; l++) c = ge(this, a[s + l], t, l), c === fe && (c = this._$AH[l]), i || (i = !Me(c) || c !== this._$AH[l]), c === _ ? e = _ : e !== _ && (e += (c ?? "") + o[l + 1]), this._$AH[l] = c;
    }
    i && !n && this.j(e);
  }
  j(e) {
    e === _ ? this.element.removeAttribute(this.name) : this.element.setAttribute(this.name, e ?? "");
  }
}
class gn extends nt {
  constructor() {
    super(...arguments), this.type = 3;
  }
  j(e) {
    this.element[this.name] = e === _ ? void 0 : e;
  }
}
class mn extends nt {
  constructor() {
    super(...arguments), this.type = 4;
  }
  j(e) {
    this.element.toggleAttribute(this.name, !!e && e !== _);
  }
}
class bn extends nt {
  constructor(e, t, s, n, o) {
    super(e, t, s, n, o), this.type = 5;
  }
  _$AI(e, t = this) {
    if ((e = ge(this, e, t, 0) ?? _) === fe) return;
    const s = this._$AH, n = e === _ && s !== _ || e.capture !== s.capture || e.once !== s.once || e.passive !== s.passive, o = e !== _ && (s === _ || n);
    n && this.element.removeEventListener(this.name, this, s), o && this.element.addEventListener(this.name, this, e), this._$AH = e;
  }
  handleEvent(e) {
    var t;
    typeof this._$AH == "function" ? this._$AH.call(((t = this.options) == null ? void 0 : t.host) ?? this.element, e) : this._$AH.handleEvent(e);
  }
}
class pn {
  constructor(e, t, s) {
    this.element = e, this.type = 6, this._$AN = void 0, this._$AM = t, this.options = s;
  }
  get _$AU() {
    return this._$AM._$AU;
  }
  _$AI(e) {
    ge(this, e);
  }
}
const ft = Ee.litHtmlPolyfillSupport;
ft == null || ft(Ie, We), (Ee.litHtmlVersions ?? (Ee.litHtmlVersions = [])).push("3.2.0");
const yn = (r, e, t) => {
  const s = (t == null ? void 0 : t.renderBefore) ?? e;
  let n = s._$litPart$;
  if (n === void 0) {
    const o = (t == null ? void 0 : t.renderBefore) ?? null;
    s._$litPart$ = n = new We(e.insertBefore(Ce(), o), o, void 0, t ?? {});
  }
  return n._$AI(r), n;
};
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
class ue extends ae {
  constructor() {
    super(...arguments), this.renderOptions = { host: this }, this.o = void 0;
  }
  createRenderRoot() {
    var t;
    const e = super.createRenderRoot();
    return (t = this.renderOptions).renderBefore ?? (t.renderBefore = e.firstChild), e;
  }
  update(e) {
    const t = this.render();
    this.hasUpdated || (this.renderOptions.isConnected = this.isConnected), super.update(e), this.o = yn(t, this.renderRoot, this.renderOptions);
  }
  connectedCallback() {
    var e;
    super.connectedCallback(), (e = this.o) == null || e.setConnected(!0);
  }
  disconnectedCallback() {
    var e;
    super.disconnectedCallback(), (e = this.o) == null || e.setConnected(!1);
  }
  render() {
    return fe;
  }
}
var Rr;
ue._$litElement$ = !0, ue.finalized = !0, (Rr = globalThis.litElementHydrateSupport) == null || Rr.call(globalThis, { LitElement: ue });
const gt = globalThis.litElementPolyfillSupport;
gt == null || gt({ LitElement: ue });
(globalThis.litElementVersions ?? (globalThis.litElementVersions = [])).push("4.1.0");
const kn = 2, lr = 3;
class zt extends ue {
  constructor() {
    super(), this.kiosk_base_url = "/", this.appErrors = [], this.apiContext = void 0, this.showProgress = !1;
  }
  static get properties() {
    return {
      /**
       * The Api Context
       */
      apiContext: { type: Object },
      appErrors: { type: Array },
      showProgress: { type: Boolean }
    };
  }
  updated(e) {
    e.has("apiContext") && (this.showProgress = !1, this.apiContext && this.apiContext.status === lr && this.addAppError("Cannot connect to Kiosk API."));
  }
  render() {
    let e;
    return this.apiContext && this.apiContext.status === kn ? e = this.apiRender() : this.apiContext && this.apiContext.status === lr ? e = this.renderApiError() : e = this.renderNoContextYet(), b`
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
                    background: linear-gradient(90deg, red 0%, yellow 15%, lime 30%, cyan 50%, blue 65%, magenta 80%, red 100%);
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
            <link
                rel="stylesheet"
                href="${this.kiosk_base_url}static/styles.css"
            />
            ${this.renderProgress()}
            ${this.renderErrors()} ${e}
        `;
  }
  renderNoContextYet() {
    return b`
            <link
                rel="stylesheet"
                href="${this.kiosk_base_url}static/styles.css"
            />
        `;
  }
  renderApiError() {
  }
  renderErrors() {
    if (this.appErrors.length > 0)
      return b`
                ${this.appErrors.map(
        (e) => b`<div class="system-message">${e}</div>`
      )}
            `;
  }
  renderProgress(e = !1) {
    if (e || this.showProgress)
      return b`
                <div class="loading">
                    <div class="loading-progress"></div>
                </div>`;
  }
  addAppError(e) {
    this.appErrors.push(e), this.requestUpdate();
  }
  deleteError(e) {
    let t = -1;
    this.appErrors.find((s, n) => s === e ? (t = n, !0) : !1), t > -1 && (this.appErrors.splice(t, 1), this.appErrors = [...this.appErrors]);
  }
}
class ee extends Error {
}
class vn extends ee {
  constructor(e) {
    super(`Invalid DateTime: ${e.toMessage()}`);
  }
}
class wn extends ee {
  constructor(e) {
    super(`Invalid Interval: ${e.toMessage()}`);
  }
}
class xn extends ee {
  constructor(e) {
    super(`Invalid Duration: ${e.toMessage()}`);
  }
}
class ce extends ee {
}
class Hr extends ee {
  constructor(e) {
    super(`Invalid unit ${e}`);
  }
}
class O extends ee {
}
class U extends ee {
  constructor() {
    super("Zone is an abstract class");
  }
}
const u = "numeric", V = "short", C = "long", Xe = {
  year: u,
  month: u,
  day: u
}, qr = {
  year: u,
  month: V,
  day: u
}, Sn = {
  year: u,
  month: V,
  day: u,
  weekday: V
}, Yr = {
  year: u,
  month: C,
  day: u
}, Gr = {
  year: u,
  month: C,
  day: u,
  weekday: C
}, Jr = {
  hour: u,
  minute: u
}, Br = {
  hour: u,
  minute: u,
  second: u
}, Kr = {
  hour: u,
  minute: u,
  second: u,
  timeZoneName: V
}, Qr = {
  hour: u,
  minute: u,
  second: u,
  timeZoneName: C
}, Xr = {
  hour: u,
  minute: u,
  hourCycle: "h23"
}, es = {
  hour: u,
  minute: u,
  second: u,
  hourCycle: "h23"
}, ts = {
  hour: u,
  minute: u,
  second: u,
  hourCycle: "h23",
  timeZoneName: V
}, rs = {
  hour: u,
  minute: u,
  second: u,
  hourCycle: "h23",
  timeZoneName: C
}, ss = {
  year: u,
  month: u,
  day: u,
  hour: u,
  minute: u
}, ns = {
  year: u,
  month: u,
  day: u,
  hour: u,
  minute: u,
  second: u
}, os = {
  year: u,
  month: V,
  day: u,
  hour: u,
  minute: u
}, is = {
  year: u,
  month: V,
  day: u,
  hour: u,
  minute: u,
  second: u
}, Tn = {
  year: u,
  month: V,
  day: u,
  weekday: V,
  hour: u,
  minute: u
}, as = {
  year: u,
  month: C,
  day: u,
  hour: u,
  minute: u,
  timeZoneName: V
}, ls = {
  year: u,
  month: C,
  day: u,
  hour: u,
  minute: u,
  second: u,
  timeZoneName: V
}, cs = {
  year: u,
  month: C,
  day: u,
  weekday: C,
  hour: u,
  minute: u,
  timeZoneName: C
}, us = {
  year: u,
  month: C,
  day: u,
  weekday: C,
  hour: u,
  minute: u,
  second: u,
  timeZoneName: C
};
class Fe {
  /**
   * The type of zone
   * @abstract
   * @type {string}
   */
  get type() {
    throw new U();
  }
  /**
   * The name of this zone.
   * @abstract
   * @type {string}
   */
  get name() {
    throw new U();
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
    throw new U();
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
    throw new U();
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
    throw new U();
  }
  /**
   * Return the offset in minutes for this zone at the specified timestamp.
   * @abstract
   * @param {number} ts - Epoch milliseconds for which to compute the offset
   * @return {number}
   */
  offset(e) {
    throw new U();
  }
  /**
   * Return whether this Zone is equal to another zone
   * @abstract
   * @param {Zone} otherZone - the zone to compare
   * @return {boolean}
   */
  equals(e) {
    throw new U();
  }
  /**
   * Return whether this Zone is valid.
   * @abstract
   * @type {boolean}
   */
  get isValid() {
    throw new U();
  }
}
let mt = null;
class ot extends Fe {
  /**
   * Get a singleton instance of the local zone
   * @return {SystemZone}
   */
  static get instance() {
    return mt === null && (mt = new ot()), mt;
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
  offsetName(e, { format: t, locale: s }) {
    return ks(e, t, s);
  }
  /** @override **/
  formatOffset(e, t) {
    return Ne(this.offset(e), t);
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
let Ye = {};
function $n(r) {
  return Ye[r] || (Ye[r] = new Intl.DateTimeFormat("en-US", {
    hour12: !1,
    timeZone: r,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    era: "short"
  })), Ye[r];
}
const _n = {
  year: 0,
  month: 1,
  day: 2,
  era: 3,
  hour: 4,
  minute: 5,
  second: 6
};
function On(r, e) {
  const t = r.format(e).replace(/\u200E/g, ""), s = /(\d+)\/(\d+)\/(\d+) (AD|BC),? (\d+):(\d+):(\d+)/.exec(t), [, n, o, i, a, l, c, d] = s;
  return [i, n, o, a, l, c, d];
}
function En(r, e) {
  const t = r.formatToParts(e), s = [];
  for (let n = 0; n < t.length; n++) {
    const { type: o, value: i } = t[n], a = _n[o];
    o === "era" ? s[a] = i : m(a) || (s[a] = parseInt(i, 10));
  }
  return s;
}
let Le = {};
class R extends Fe {
  /**
   * @param {string} name - Zone name
   * @return {IANAZone}
   */
  static create(e) {
    return Le[e] || (Le[e] = new R(e)), Le[e];
  }
  /**
   * Reset local caches. Should only be necessary in testing scenarios.
   * @return {void}
   */
  static resetCache() {
    Le = {}, Ye = {};
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
    super(), this.zoneName = e, this.valid = R.isValidZone(e);
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
  offsetName(e, { format: t, locale: s }) {
    return ks(e, t, s, this.name);
  }
  /**
   * Returns the offset's value as a string
   * @override
   * @param {number} ts - Epoch milliseconds for which to get the offset
   * @param {string} format - What style of offset to return.
   *                          Accepts 'narrow', 'short', or 'techie'. Returning '+6', '+06:00', or '+0600' respectively
   * @return {string}
   */
  formatOffset(e, t) {
    return Ne(this.offset(e), t);
  }
  /**
   * Return the offset in minutes for this zone at the specified timestamp.
   * @override
   * @param {number} ts - Epoch milliseconds for which to compute the offset
   * @return {number}
   */
  offset(e) {
    const t = new Date(e);
    if (isNaN(t)) return NaN;
    const s = $n(this.name);
    let [n, o, i, a, l, c, d] = s.formatToParts ? En(s, t) : On(s, t);
    a === "BC" && (n = -Math.abs(n) + 1);
    const y = at({
      year: n,
      month: o,
      day: i,
      hour: l === 24 ? 0 : l,
      minute: c,
      second: d,
      millisecond: 0
    });
    let f = +t;
    const w = f % 1e3;
    return f -= w >= 0 ? w : 1e3 + w, (y - f) / (60 * 1e3);
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
let cr = {};
function Nn(r, e = {}) {
  const t = JSON.stringify([r, e]);
  let s = cr[t];
  return s || (s = new Intl.ListFormat(r, e), cr[t] = s), s;
}
let _t = {};
function Ot(r, e = {}) {
  const t = JSON.stringify([r, e]);
  let s = _t[t];
  return s || (s = new Intl.DateTimeFormat(r, e), _t[t] = s), s;
}
let Et = {};
function Cn(r, e = {}) {
  const t = JSON.stringify([r, e]);
  let s = Et[t];
  return s || (s = new Intl.NumberFormat(r, e), Et[t] = s), s;
}
let Nt = {};
function Mn(r, e = {}) {
  const { base: t, ...s } = e, n = JSON.stringify([r, s]);
  let o = Nt[n];
  return o || (o = new Intl.RelativeTimeFormat(r, e), Nt[n] = o), o;
}
let $e = null;
function In() {
  return $e || ($e = new Intl.DateTimeFormat().resolvedOptions().locale, $e);
}
let ur = {};
function Dn(r) {
  let e = ur[r];
  if (!e) {
    const t = new Intl.Locale(r);
    e = "getWeekInfo" in t ? t.getWeekInfo() : t.weekInfo, ur[r] = e;
  }
  return e;
}
function An(r) {
  const e = r.indexOf("-x-");
  e !== -1 && (r = r.substring(0, e));
  const t = r.indexOf("-u-");
  if (t === -1)
    return [r];
  {
    let s, n;
    try {
      s = Ot(r).resolvedOptions(), n = r;
    } catch {
      const l = r.substring(0, t);
      s = Ot(l).resolvedOptions(), n = l;
    }
    const { numberingSystem: o, calendar: i } = s;
    return [n, o, i];
  }
}
function Wn(r, e, t) {
  return (t || e) && (r.includes("-u-") || (r += "-u"), t && (r += `-ca-${t}`), e && (r += `-nu-${e}`)), r;
}
function Fn(r) {
  const e = [];
  for (let t = 1; t <= 12; t++) {
    const s = g.utc(2009, t, 1);
    e.push(r(s));
  }
  return e;
}
function Vn(r) {
  const e = [];
  for (let t = 1; t <= 7; t++) {
    const s = g.utc(2016, 11, 13 + t);
    e.push(r(s));
  }
  return e;
}
function Ue(r, e, t, s) {
  const n = r.listingMode();
  return n === "error" ? null : n === "en" ? t(e) : s(e);
}
function zn(r) {
  return r.numberingSystem && r.numberingSystem !== "latn" ? !1 : r.numberingSystem === "latn" || !r.locale || r.locale.startsWith("en") || new Intl.DateTimeFormat(r.intl).resolvedOptions().numberingSystem === "latn";
}
class Rn {
  constructor(e, t, s) {
    this.padTo = s.padTo || 0, this.floor = s.floor || !1;
    const { padTo: n, floor: o, ...i } = s;
    if (!t || Object.keys(i).length > 0) {
      const a = { useGrouping: !1, ...s };
      s.padTo > 0 && (a.minimumIntegerDigits = s.padTo), this.inf = Cn(e, a);
    }
  }
  format(e) {
    if (this.inf) {
      const t = this.floor ? Math.floor(e) : e;
      return this.inf.format(t);
    } else {
      const t = this.floor ? Math.floor(e) : Pt(e, 3);
      return T(t, this.padTo);
    }
  }
}
class Ln {
  constructor(e, t, s) {
    this.opts = s, this.originalZone = void 0;
    let n;
    if (this.opts.timeZone)
      this.dt = e;
    else if (e.zone.type === "fixed") {
      const i = -1 * (e.offset / 60), a = i >= 0 ? `Etc/GMT+${i}` : `Etc/GMT${i}`;
      e.offset !== 0 && R.create(a).valid ? (n = a, this.dt = e) : (n = "UTC", this.dt = e.offset === 0 ? e : e.setZone("UTC").plus({ minutes: e.offset }), this.originalZone = e.zone);
    } else e.zone.type === "system" ? this.dt = e : e.zone.type === "iana" ? (this.dt = e, n = e.zone.name) : (n = "UTC", this.dt = e.setZone("UTC").plus({ minutes: e.offset }), this.originalZone = e.zone);
    const o = { ...this.opts };
    o.timeZone = o.timeZone || n, this.dtf = Ot(t, o);
  }
  format() {
    return this.originalZone ? this.formatToParts().map(({ value: e }) => e).join("") : this.dtf.format(this.dt.toJSDate());
  }
  formatToParts() {
    const e = this.dtf.formatToParts(this.dt.toJSDate());
    return this.originalZone ? e.map((t) => {
      if (t.type === "timeZoneName") {
        const s = this.originalZone.offsetName(this.dt.ts, {
          locale: this.dt.locale,
          format: this.opts.timeZoneName
        });
        return {
          ...t,
          value: s
        };
      } else
        return t;
    }) : e;
  }
  resolvedOptions() {
    return this.dtf.resolvedOptions();
  }
}
class Un {
  constructor(e, t, s) {
    this.opts = { style: "long", ...s }, !t && ps() && (this.rtf = Mn(e, s));
  }
  format(e, t) {
    return this.rtf ? this.rtf.format(e, t) : uo(t, e, this.opts.numeric, this.opts.style !== "long");
  }
  formatToParts(e, t) {
    return this.rtf ? this.rtf.formatToParts(e, t) : [];
  }
}
const jn = {
  firstDay: 1,
  minimalDays: 4,
  weekend: [6, 7]
};
class v {
  static fromOpts(e) {
    return v.create(
      e.locale,
      e.numberingSystem,
      e.outputCalendar,
      e.weekSettings,
      e.defaultToEN
    );
  }
  static create(e, t, s, n, o = !1) {
    const i = e || S.defaultLocale, a = i || (o ? "en-US" : In()), l = t || S.defaultNumberingSystem, c = s || S.defaultOutputCalendar, d = Ct(n) || S.defaultWeekSettings;
    return new v(a, l, c, d, i);
  }
  static resetCache() {
    $e = null, _t = {}, Et = {}, Nt = {};
  }
  static fromObject({ locale: e, numberingSystem: t, outputCalendar: s, weekSettings: n } = {}) {
    return v.create(e, t, s, n);
  }
  constructor(e, t, s, n, o) {
    const [i, a, l] = An(e);
    this.locale = i, this.numberingSystem = t || a || null, this.outputCalendar = s || l || null, this.weekSettings = n, this.intl = Wn(this.locale, this.numberingSystem, this.outputCalendar), this.weekdaysCache = { format: {}, standalone: {} }, this.monthsCache = { format: {}, standalone: {} }, this.meridiemCache = null, this.eraCache = {}, this.specifiedLocale = o, this.fastNumbersCached = null;
  }
  get fastNumbers() {
    return this.fastNumbersCached == null && (this.fastNumbersCached = zn(this)), this.fastNumbersCached;
  }
  listingMode() {
    const e = this.isEnglish(), t = (this.numberingSystem === null || this.numberingSystem === "latn") && (this.outputCalendar === null || this.outputCalendar === "gregory");
    return e && t ? "en" : "intl";
  }
  clone(e) {
    return !e || Object.getOwnPropertyNames(e).length === 0 ? this : v.create(
      e.locale || this.specifiedLocale,
      e.numberingSystem || this.numberingSystem,
      e.outputCalendar || this.outputCalendar,
      Ct(e.weekSettings) || this.weekSettings,
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
    return Ue(this, e, xs, () => {
      const s = t ? { month: e, day: "numeric" } : { month: e }, n = t ? "format" : "standalone";
      return this.monthsCache[n][e] || (this.monthsCache[n][e] = Fn((o) => this.extract(o, s, "month"))), this.monthsCache[n][e];
    });
  }
  weekdays(e, t = !1) {
    return Ue(this, e, $s, () => {
      const s = t ? { weekday: e, year: "numeric", month: "long", day: "numeric" } : { weekday: e }, n = t ? "format" : "standalone";
      return this.weekdaysCache[n][e] || (this.weekdaysCache[n][e] = Vn(
        (o) => this.extract(o, s, "weekday")
      )), this.weekdaysCache[n][e];
    });
  }
  meridiems() {
    return Ue(
      this,
      void 0,
      () => _s,
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
    return Ue(this, e, Os, () => {
      const t = { era: e };
      return this.eraCache[e] || (this.eraCache[e] = [g.utc(-40, 1, 1), g.utc(2017, 1, 1)].map(
        (s) => this.extract(s, t, "era")
      )), this.eraCache[e];
    });
  }
  extract(e, t, s) {
    const n = this.dtFormatter(e, t), o = n.formatToParts(), i = o.find((a) => a.type.toLowerCase() === s);
    return i ? i.value : null;
  }
  numberFormatter(e = {}) {
    return new Rn(this.intl, e.forceSimple || this.fastNumbers, e);
  }
  dtFormatter(e, t = {}) {
    return new Ln(e, this.intl, t);
  }
  relFormatter(e = {}) {
    return new Un(this.intl, this.isEnglish(), e);
  }
  listFormatter(e = {}) {
    return Nn(this.intl, e);
  }
  isEnglish() {
    return this.locale === "en" || this.locale.toLowerCase() === "en-us" || new Intl.DateTimeFormat(this.intl).resolvedOptions().locale.startsWith("en-us");
  }
  getWeekSettings() {
    return this.weekSettings ? this.weekSettings : ys() ? Dn(this.locale) : jn;
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
let bt = null;
class N extends Fe {
  /**
   * Get a singleton instance of UTC
   * @return {FixedOffsetZone}
   */
  static get utcInstance() {
    return bt === null && (bt = new N(0)), bt;
  }
  /**
   * Get an instance with a specified offset
   * @param {number} offset - The offset in minutes
   * @return {FixedOffsetZone}
   */
  static instance(e) {
    return e === 0 ? N.utcInstance : new N(e);
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
        return new N(lt(t[1], t[2]));
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
    return this.fixed === 0 ? "UTC" : `UTC${Ne(this.fixed, "narrow")}`;
  }
  /**
   * The IANA name of this zone, i.e. `Etc/UTC` or `Etc/GMT+/-nn`
   *
   * @override
   * @type {string}
   */
  get ianaName() {
    return this.fixed === 0 ? "Etc/UTC" : `Etc/GMT${Ne(-this.fixed, "narrow")}`;
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
  formatOffset(e, t) {
    return Ne(this.fixed, t);
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
class Pn extends Fe {
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
  if (r instanceof Fe)
    return r;
  if (Jn(r)) {
    const t = r.toLowerCase();
    return t === "default" ? e : t === "local" || t === "system" ? ot.instance : t === "utc" || t === "gmt" ? N.utcInstance : N.parseSpecifier(t) || R.create(r);
  } else return Y(r) ? N.instance(r) : typeof r == "object" && "offset" in r && typeof r.offset == "function" ? r : new Pn(r);
}
const Rt = {
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
}, dr = {
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
}, Zn = Rt.hanidec.replace(/[\[|\]]/g, "").split("");
function Hn(r) {
  let e = parseInt(r, 10);
  if (isNaN(e)) {
    e = "";
    for (let t = 0; t < r.length; t++) {
      const s = r.charCodeAt(t);
      if (r[t].search(Rt.hanidec) !== -1)
        e += Zn.indexOf(r[t]);
      else
        for (const n in dr) {
          const [o, i] = dr[n];
          s >= o && s <= i && (e += s - o);
        }
    }
    return parseInt(e, 10);
  } else
    return e;
}
let le = {};
function qn() {
  le = {};
}
function A({ numberingSystem: r }, e = "") {
  const t = r || "latn";
  return le[t] || (le[t] = {}), le[t][e] || (le[t][e] = new RegExp(`${Rt[t]}${e}`)), le[t][e];
}
let hr = () => Date.now(), fr = "system", gr = null, mr = null, br = null, pr = 60, yr, kr = null;
class S {
  /**
   * Get the callback for returning the current timestamp.
   * @type {function}
   */
  static get now() {
    return hr;
  }
  /**
   * Set the callback for returning the current timestamp.
   * The function should return a number, which will be interpreted as an Epoch millisecond count
   * @type {function}
   * @example Settings.now = () => Date.now() + 3000 // pretend it is 3 seconds in the future
   * @example Settings.now = () => 0 // always pretend it's Jan 1, 1970 at midnight in UTC time
   */
  static set now(e) {
    hr = e;
  }
  /**
   * Set the default time zone to create DateTimes in. Does not affect existing instances.
   * Use the value "system" to reset this value to the system's time zone.
   * @type {string}
   */
  static set defaultZone(e) {
    fr = e;
  }
  /**
   * Get the default time zone object currently used to create DateTimes. Does not affect existing instances.
   * The default value is the system's time zone (the one set on the machine that runs this code).
   * @type {Zone}
   */
  static get defaultZone() {
    return H(fr, ot.instance);
  }
  /**
   * Get the default locale to create DateTimes with. Does not affect existing instances.
   * @type {string}
   */
  static get defaultLocale() {
    return gr;
  }
  /**
   * Set the default locale to create DateTimes with. Does not affect existing instances.
   * @type {string}
   */
  static set defaultLocale(e) {
    gr = e;
  }
  /**
   * Get the default numbering system to create DateTimes with. Does not affect existing instances.
   * @type {string}
   */
  static get defaultNumberingSystem() {
    return mr;
  }
  /**
   * Set the default numbering system to create DateTimes with. Does not affect existing instances.
   * @type {string}
   */
  static set defaultNumberingSystem(e) {
    mr = e;
  }
  /**
   * Get the default output calendar to create DateTimes with. Does not affect existing instances.
   * @type {string}
   */
  static get defaultOutputCalendar() {
    return br;
  }
  /**
   * Set the default output calendar to create DateTimes with. Does not affect existing instances.
   * @type {string}
   */
  static set defaultOutputCalendar(e) {
    br = e;
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
    return kr;
  }
  /**
   * Allows overriding the default locale week settings, i.e. the start of the week, the weekend and
   * how many days are required in the first week of a year.
   * Does not affect existing instances.
   *
   * @param {WeekSettings|null} weekSettings
   */
  static set defaultWeekSettings(e) {
    kr = Ct(e);
  }
  /**
   * Get the cutoff year for whether a 2-digit year string is interpreted in the current or previous century. Numbers higher than the cutoff will be considered to mean 19xx and numbers lower or equal to the cutoff will be considered 20xx.
   * @type {number}
   */
  static get twoDigitCutoffYear() {
    return pr;
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
    pr = e % 100;
  }
  /**
   * Get whether Luxon will throw when it encounters invalid DateTimes, Durations, or Intervals
   * @type {boolean}
   */
  static get throwOnInvalid() {
    return yr;
  }
  /**
   * Set whether Luxon will throw when it encounters invalid DateTimes, Durations, or Intervals
   * @type {boolean}
   */
  static set throwOnInvalid(e) {
    yr = e;
  }
  /**
   * Reset Luxon's global caches. Should only be necessary in testing scenarios.
   * @return {void}
   */
  static resetCaches() {
    v.resetCache(), R.resetCache(), g.resetCache(), qn();
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
const ds = [0, 31, 59, 90, 120, 151, 181, 212, 243, 273, 304, 334], hs = [0, 31, 60, 91, 121, 152, 182, 213, 244, 274, 305, 335];
function I(r, e) {
  return new F(
    "unit out of range",
    `you specified ${e} (of type ${typeof e}) as a ${r}, which is invalid`
  );
}
function Lt(r, e, t) {
  const s = new Date(Date.UTC(r, e - 1, t));
  r < 100 && r >= 0 && s.setUTCFullYear(s.getUTCFullYear() - 1900);
  const n = s.getUTCDay();
  return n === 0 ? 7 : n;
}
function fs(r, e, t) {
  return t + (Ve(r) ? hs : ds)[e - 1];
}
function gs(r, e) {
  const t = Ve(r) ? hs : ds, s = t.findIndex((o) => o < e), n = e - t[s];
  return { month: s + 1, day: n };
}
function Ut(r, e) {
  return (r - e + 7) % 7 + 1;
}
function et(r, e = 4, t = 1) {
  const { year: s, month: n, day: o } = r, i = fs(s, n, o), a = Ut(Lt(s, n, o), t);
  let l = Math.floor((i - a + 14 - e) / 7), c;
  return l < 1 ? (c = s - 1, l = De(c, e, t)) : l > De(s, e, t) ? (c = s + 1, l = 1) : c = s, { weekYear: c, weekNumber: l, weekday: a, ...ct(r) };
}
function vr(r, e = 4, t = 1) {
  const { weekYear: s, weekNumber: n, weekday: o } = r, i = Ut(Lt(s, 1, e), t), a = de(s);
  let l = n * 7 + o - i - 7 + e, c;
  l < 1 ? (c = s - 1, l += de(c)) : l > a ? (c = s + 1, l -= de(s)) : c = s;
  const { month: d, day: h } = gs(c, l);
  return { year: c, month: d, day: h, ...ct(r) };
}
function pt(r) {
  const { year: e, month: t, day: s } = r, n = fs(e, t, s);
  return { year: e, ordinal: n, ...ct(r) };
}
function wr(r) {
  const { year: e, ordinal: t } = r, { month: s, day: n } = gs(e, t);
  return { year: e, month: s, day: n, ...ct(r) };
}
function xr(r, e) {
  if (!m(r.localWeekday) || !m(r.localWeekNumber) || !m(r.localWeekYear)) {
    if (!m(r.weekday) || !m(r.weekNumber) || !m(r.weekYear))
      throw new ce(
        "Cannot mix locale-based week fields with ISO-based week fields"
      );
    return m(r.localWeekday) || (r.weekday = r.localWeekday), m(r.localWeekNumber) || (r.weekNumber = r.localWeekNumber), m(r.localWeekYear) || (r.weekYear = r.localWeekYear), delete r.localWeekday, delete r.localWeekNumber, delete r.localWeekYear, {
      minDaysInFirstWeek: e.getMinDaysInFirstWeek(),
      startOfWeek: e.getStartOfWeek()
    };
  } else
    return { minDaysInFirstWeek: 4, startOfWeek: 1 };
}
function Yn(r, e = 4, t = 1) {
  const s = it(r.weekYear), n = D(
    r.weekNumber,
    1,
    De(r.weekYear, e, t)
  ), o = D(r.weekday, 1, 7);
  return s ? n ? o ? !1 : I("weekday", r.weekday) : I("week", r.weekNumber) : I("weekYear", r.weekYear);
}
function Gn(r) {
  const e = it(r.year), t = D(r.ordinal, 1, de(r.year));
  return e ? t ? !1 : I("ordinal", r.ordinal) : I("year", r.year);
}
function ms(r) {
  const e = it(r.year), t = D(r.month, 1, 12), s = D(r.day, 1, tt(r.year, r.month));
  return e ? t ? s ? !1 : I("day", r.day) : I("month", r.month) : I("year", r.year);
}
function bs(r) {
  const { hour: e, minute: t, second: s, millisecond: n } = r, o = D(e, 0, 23) || e === 24 && t === 0 && s === 0 && n === 0, i = D(t, 0, 59), a = D(s, 0, 59), l = D(n, 0, 999);
  return o ? i ? a ? l ? !1 : I("millisecond", n) : I("second", s) : I("minute", t) : I("hour", e);
}
function m(r) {
  return typeof r > "u";
}
function Y(r) {
  return typeof r == "number";
}
function it(r) {
  return typeof r == "number" && r % 1 === 0;
}
function Jn(r) {
  return typeof r == "string";
}
function Bn(r) {
  return Object.prototype.toString.call(r) === "[object Date]";
}
function ps() {
  try {
    return typeof Intl < "u" && !!Intl.RelativeTimeFormat;
  } catch {
    return !1;
  }
}
function ys() {
  try {
    return typeof Intl < "u" && !!Intl.Locale && ("weekInfo" in Intl.Locale.prototype || "getWeekInfo" in Intl.Locale.prototype);
  } catch {
    return !1;
  }
}
function Kn(r) {
  return Array.isArray(r) ? r : [r];
}
function Sr(r, e, t) {
  if (r.length !== 0)
    return r.reduce((s, n) => {
      const o = [e(n), n];
      return s && t(s[0], o[0]) === s[0] ? s : o;
    }, null)[1];
}
function Qn(r, e) {
  return e.reduce((t, s) => (t[s] = r[s], t), {});
}
function me(r, e) {
  return Object.prototype.hasOwnProperty.call(r, e);
}
function Ct(r) {
  if (r == null)
    return null;
  if (typeof r != "object")
    throw new O("Week settings must be an object");
  if (!D(r.firstDay, 1, 7) || !D(r.minimalDays, 1, 7) || !Array.isArray(r.weekend) || r.weekend.some((e) => !D(e, 1, 7)))
    throw new O("Invalid week settings");
  return {
    firstDay: r.firstDay,
    minimalDays: r.minimalDays,
    weekend: Array.from(r.weekend)
  };
}
function D(r, e, t) {
  return it(r) && r >= e && r <= t;
}
function Xn(r, e) {
  return r - e * Math.floor(r / e);
}
function T(r, e = 2) {
  const t = r < 0;
  let s;
  return t ? s = "-" + ("" + -r).padStart(e, "0") : s = ("" + r).padStart(e, "0"), s;
}
function P(r) {
  if (!(m(r) || r === null || r === ""))
    return parseInt(r, 10);
}
function J(r) {
  if (!(m(r) || r === null || r === ""))
    return parseFloat(r);
}
function jt(r) {
  if (!(m(r) || r === null || r === "")) {
    const e = parseFloat("0." + r) * 1e3;
    return Math.floor(e);
  }
}
function Pt(r, e, t = !1) {
  const s = 10 ** e;
  return (t ? Math.trunc : Math.round)(r * s) / s;
}
function Ve(r) {
  return r % 4 === 0 && (r % 100 !== 0 || r % 400 === 0);
}
function de(r) {
  return Ve(r) ? 366 : 365;
}
function tt(r, e) {
  const t = Xn(e - 1, 12) + 1, s = r + (e - t) / 12;
  return t === 2 ? Ve(s) ? 29 : 28 : [31, null, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31][t - 1];
}
function at(r) {
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
function Tr(r, e, t) {
  return -Ut(Lt(r, 1, e), t) + e - 1;
}
function De(r, e = 4, t = 1) {
  const s = Tr(r, e, t), n = Tr(r + 1, e, t);
  return (de(r) - s + n) / 7;
}
function Mt(r) {
  return r > 99 ? r : r > S.twoDigitCutoffYear ? 1900 + r : 2e3 + r;
}
function ks(r, e, t, s = null) {
  const n = new Date(r), o = {
    hourCycle: "h23",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit"
  };
  s && (o.timeZone = s);
  const i = { timeZoneName: e, ...o }, a = new Intl.DateTimeFormat(t, i).formatToParts(n).find((l) => l.type.toLowerCase() === "timezonename");
  return a ? a.value : null;
}
function lt(r, e) {
  let t = parseInt(r, 10);
  Number.isNaN(t) && (t = 0);
  const s = parseInt(e, 10) || 0, n = t < 0 || Object.is(t, -0) ? -s : s;
  return t * 60 + n;
}
function vs(r) {
  const e = Number(r);
  if (typeof r == "boolean" || r === "" || Number.isNaN(e))
    throw new O(`Invalid unit value ${r}`);
  return e;
}
function rt(r, e) {
  const t = {};
  for (const s in r)
    if (me(r, s)) {
      const n = r[s];
      if (n == null) continue;
      t[e(s)] = vs(n);
    }
  return t;
}
function Ne(r, e) {
  const t = Math.trunc(Math.abs(r / 60)), s = Math.trunc(Math.abs(r % 60)), n = r >= 0 ? "+" : "-";
  switch (e) {
    case "short":
      return `${n}${T(t, 2)}:${T(s, 2)}`;
    case "narrow":
      return `${n}${t}${s > 0 ? `:${s}` : ""}`;
    case "techie":
      return `${n}${T(t, 2)}${T(s, 2)}`;
    default:
      throw new RangeError(`Value format ${e} is out of range for property format`);
  }
}
function ct(r) {
  return Qn(r, ["hour", "minute", "second", "millisecond"]);
}
const eo = [
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
], ws = [
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
], to = ["J", "F", "M", "A", "M", "J", "J", "A", "S", "O", "N", "D"];
function xs(r) {
  switch (r) {
    case "narrow":
      return [...to];
    case "short":
      return [...ws];
    case "long":
      return [...eo];
    case "numeric":
      return ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12"];
    case "2-digit":
      return ["01", "02", "03", "04", "05", "06", "07", "08", "09", "10", "11", "12"];
    default:
      return null;
  }
}
const Ss = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday"
], Ts = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"], ro = ["M", "T", "W", "T", "F", "S", "S"];
function $s(r) {
  switch (r) {
    case "narrow":
      return [...ro];
    case "short":
      return [...Ts];
    case "long":
      return [...Ss];
    case "numeric":
      return ["1", "2", "3", "4", "5", "6", "7"];
    default:
      return null;
  }
}
const _s = ["AM", "PM"], so = ["Before Christ", "Anno Domini"], no = ["BC", "AD"], oo = ["B", "A"];
function Os(r) {
  switch (r) {
    case "narrow":
      return [...oo];
    case "short":
      return [...no];
    case "long":
      return [...so];
    default:
      return null;
  }
}
function io(r) {
  return _s[r.hour < 12 ? 0 : 1];
}
function ao(r, e) {
  return $s(e)[r.weekday - 1];
}
function lo(r, e) {
  return xs(e)[r.month - 1];
}
function co(r, e) {
  return Os(e)[r.year < 0 ? 0 : 1];
}
function uo(r, e, t = "always", s = !1) {
  const n = {
    years: ["year", "yr."],
    quarters: ["quarter", "qtr."],
    months: ["month", "mo."],
    weeks: ["week", "wk."],
    days: ["day", "day", "days"],
    hours: ["hour", "hr."],
    minutes: ["minute", "min."],
    seconds: ["second", "sec."]
  }, o = ["hours", "minutes", "seconds"].indexOf(r) === -1;
  if (t === "auto" && o) {
    const h = r === "days";
    switch (e) {
      case 1:
        return h ? "tomorrow" : `next ${n[r][0]}`;
      case -1:
        return h ? "yesterday" : `last ${n[r][0]}`;
      case 0:
        return h ? "today" : `this ${n[r][0]}`;
    }
  }
  const i = Object.is(e, -0) || e < 0, a = Math.abs(e), l = a === 1, c = n[r], d = s ? l ? c[1] : c[2] || c[1] : l ? n[r][0] : r;
  return i ? `${a} ${d} ago` : `in ${a} ${d}`;
}
function $r(r, e) {
  let t = "";
  for (const s of r)
    s.literal ? t += s.val : t += e(s.val);
  return t;
}
const ho = {
  D: Xe,
  DD: qr,
  DDD: Yr,
  DDDD: Gr,
  t: Jr,
  tt: Br,
  ttt: Kr,
  tttt: Qr,
  T: Xr,
  TT: es,
  TTT: ts,
  TTTT: rs,
  f: ss,
  ff: os,
  fff: as,
  ffff: cs,
  F: ns,
  FF: is,
  FFF: ls,
  FFFF: us
};
class E {
  static create(e, t = {}) {
    return new E(e, t);
  }
  static parseFormat(e) {
    let t = null, s = "", n = !1;
    const o = [];
    for (let i = 0; i < e.length; i++) {
      const a = e.charAt(i);
      a === "'" ? (s.length > 0 && o.push({ literal: n || /^\s+$/.test(s), val: s }), t = null, s = "", n = !n) : n || a === t ? s += a : (s.length > 0 && o.push({ literal: /^\s+$/.test(s), val: s }), s = a, t = a);
    }
    return s.length > 0 && o.push({ literal: n || /^\s+$/.test(s), val: s }), o;
  }
  static macroTokenToFormatOpts(e) {
    return ho[e];
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
    const s = { ...this.opts };
    return t > 0 && (s.padTo = t), this.loc.numberFormatter(s).format(e);
  }
  formatDateTimeFromString(e, t) {
    const s = this.loc.listingMode() === "en", n = this.loc.outputCalendar && this.loc.outputCalendar !== "gregory", o = (f, w) => this.loc.extract(e, f, w), i = (f) => e.isOffsetFixed && e.offset === 0 && f.allowZ ? "Z" : e.isValid ? e.zone.formatOffset(e.ts, f.format) : "", a = () => s ? io(e) : o({ hour: "numeric", hourCycle: "h12" }, "dayperiod"), l = (f, w) => s ? lo(e, f) : o(w ? { month: f } : { month: f, day: "numeric" }, "month"), c = (f, w) => s ? ao(e, f) : o(
      w ? { weekday: f } : { weekday: f, month: "long", day: "numeric" },
      "weekday"
    ), d = (f) => {
      const w = E.macroTokenToFormatOpts(f);
      return w ? this.formatWithSystemDefault(e, w) : f;
    }, h = (f) => s ? co(e, f) : o({ era: f }, "era"), y = (f) => {
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
          return i({ format: "narrow", allowZ: this.opts.allowZ });
        case "ZZ":
          return i({ format: "short", allowZ: this.opts.allowZ });
        case "ZZZ":
          return i({ format: "techie", allowZ: this.opts.allowZ });
        case "ZZZZ":
          return e.zone.offsetName(e.ts, { format: "short", locale: this.loc.locale });
        case "ZZZZZ":
          return e.zone.offsetName(e.ts, { format: "long", locale: this.loc.locale });
        case "z":
          return e.zoneName;
        case "a":
          return a();
        case "d":
          return n ? o({ day: "numeric" }, "day") : this.num(e.day);
        case "dd":
          return n ? o({ day: "2-digit" }, "day") : this.num(e.day, 2);
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
          return n ? o({ month: "numeric", day: "numeric" }, "month") : this.num(e.month);
        case "LL":
          return n ? o({ month: "2-digit", day: "numeric" }, "month") : this.num(e.month, 2);
        case "LLL":
          return l("short", !0);
        case "LLLL":
          return l("long", !0);
        case "LLLLL":
          return l("narrow", !0);
        case "M":
          return n ? o({ month: "numeric" }, "month") : this.num(e.month);
        case "MM":
          return n ? o({ month: "2-digit" }, "month") : this.num(e.month, 2);
        case "MMM":
          return l("short", !1);
        case "MMMM":
          return l("long", !1);
        case "MMMMM":
          return l("narrow", !1);
        case "y":
          return n ? o({ year: "numeric" }, "year") : this.num(e.year);
        case "yy":
          return n ? o({ year: "2-digit" }, "year") : this.num(e.year.toString().slice(-2), 2);
        case "yyyy":
          return n ? o({ year: "numeric" }, "year") : this.num(e.year, 4);
        case "yyyyyy":
          return n ? o({ year: "numeric" }, "year") : this.num(e.year, 6);
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
    return $r(E.parseFormat(t), y);
  }
  formatDurationFromString(e, t) {
    const s = (l) => {
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
    }, n = (l) => (c) => {
      const d = s(c);
      return d ? this.num(l.get(d), c.length) : c;
    }, o = E.parseFormat(t), i = o.reduce(
      (l, { literal: c, val: d }) => c ? l : l.concat(d),
      []
    ), a = e.shiftTo(...i.map(s).filter((l) => l));
    return $r(o, n(a));
  }
}
const Es = /[A-Za-z_+-]{1,256}(?::?\/[A-Za-z0-9_+-]{1,256}(?:\/[A-Za-z0-9_+-]{1,256})?)?/;
function be(...r) {
  const e = r.reduce((t, s) => t + s.source, "");
  return RegExp(`^${e}$`);
}
function pe(...r) {
  return (e) => r.reduce(
    ([t, s, n], o) => {
      const [i, a, l] = o(e, n);
      return [{ ...t, ...i }, a || s, l];
    },
    [{}, null, 1]
  ).slice(0, 2);
}
function ye(r, ...e) {
  if (r == null)
    return [null, null];
  for (const [t, s] of e) {
    const n = t.exec(r);
    if (n)
      return s(n);
  }
  return [null, null];
}
function Ns(...r) {
  return (e, t) => {
    const s = {};
    let n;
    for (n = 0; n < r.length; n++)
      s[r[n]] = P(e[t + n]);
    return [s, null, t + n];
  };
}
const Cs = /(?:(Z)|([+-]\d\d)(?::?(\d\d))?)/, fo = `(?:${Cs.source}?(?:\\[(${Es.source})\\])?)?`, Zt = /(\d\d)(?::?(\d\d)(?::?(\d\d)(?:[.,](\d{1,30}))?)?)?/, Ms = RegExp(`${Zt.source}${fo}`), Ht = RegExp(`(?:T${Ms.source})?`), go = /([+-]\d{6}|\d{4})(?:-?(\d\d)(?:-?(\d\d))?)?/, mo = /(\d{4})-?W(\d\d)(?:-?(\d))?/, bo = /(\d{4})-?(\d{3})/, po = Ns("weekYear", "weekNumber", "weekDay"), yo = Ns("year", "ordinal"), ko = /(\d{4})-(\d\d)-(\d\d)/, Is = RegExp(
  `${Zt.source} ?(?:${Cs.source}|(${Es.source}))?`
), vo = RegExp(`(?: ${Is.source})?`);
function he(r, e, t) {
  const s = r[e];
  return m(s) ? t : P(s);
}
function wo(r, e) {
  return [{
    year: he(r, e),
    month: he(r, e + 1, 1),
    day: he(r, e + 2, 1)
  }, null, e + 3];
}
function ke(r, e) {
  return [{
    hours: he(r, e, 0),
    minutes: he(r, e + 1, 0),
    seconds: he(r, e + 2, 0),
    milliseconds: jt(r[e + 3])
  }, null, e + 4];
}
function ze(r, e) {
  const t = !r[e] && !r[e + 1], s = lt(r[e + 1], r[e + 2]), n = t ? null : N.instance(s);
  return [{}, n, e + 3];
}
function Re(r, e) {
  const t = r[e] ? R.create(r[e]) : null;
  return [{}, t, e + 1];
}
const xo = RegExp(`^T?${Zt.source}$`), So = /^-?P(?:(?:(-?\d{1,20}(?:\.\d{1,20})?)Y)?(?:(-?\d{1,20}(?:\.\d{1,20})?)M)?(?:(-?\d{1,20}(?:\.\d{1,20})?)W)?(?:(-?\d{1,20}(?:\.\d{1,20})?)D)?(?:T(?:(-?\d{1,20}(?:\.\d{1,20})?)H)?(?:(-?\d{1,20}(?:\.\d{1,20})?)M)?(?:(-?\d{1,20})(?:[.,](-?\d{1,20}))?S)?)?)$/;
function To(r) {
  const [e, t, s, n, o, i, a, l, c] = r, d = e[0] === "-", h = l && l[0] === "-", y = (f, w = !1) => f !== void 0 && (w || f && d) ? -f : f;
  return [
    {
      years: y(J(t)),
      months: y(J(s)),
      weeks: y(J(n)),
      days: y(J(o)),
      hours: y(J(i)),
      minutes: y(J(a)),
      seconds: y(J(l), l === "-0"),
      milliseconds: y(jt(c), h)
    }
  ];
}
const $o = {
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
function qt(r, e, t, s, n, o, i) {
  const a = {
    year: e.length === 2 ? Mt(P(e)) : P(e),
    month: ws.indexOf(t) + 1,
    day: P(s),
    hour: P(n),
    minute: P(o)
  };
  return i && (a.second = P(i)), r && (a.weekday = r.length > 3 ? Ss.indexOf(r) + 1 : Ts.indexOf(r) + 1), a;
}
const _o = /^(?:(Mon|Tue|Wed|Thu|Fri|Sat|Sun),\s)?(\d{1,2})\s(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)\s(\d{2,4})\s(\d\d):(\d\d)(?::(\d\d))?\s(?:(UT|GMT|[ECMP][SD]T)|([Zz])|(?:([+-]\d\d)(\d\d)))$/;
function Oo(r) {
  const [
    ,
    e,
    t,
    s,
    n,
    o,
    i,
    a,
    l,
    c,
    d,
    h
  ] = r, y = qt(e, n, s, t, o, i, a);
  let f;
  return l ? f = $o[l] : c ? f = 0 : f = lt(d, h), [y, new N(f)];
}
function Eo(r) {
  return r.replace(/\([^()]*\)|[\n\t]/g, " ").replace(/(\s\s+)/g, " ").trim();
}
const No = /^(Mon|Tue|Wed|Thu|Fri|Sat|Sun), (\d\d) (Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec) (\d{4}) (\d\d):(\d\d):(\d\d) GMT$/, Co = /^(Monday|Tuesday|Wednesday|Thursday|Friday|Saturday|Sunday), (\d\d)-(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)-(\d\d) (\d\d):(\d\d):(\d\d) GMT$/, Mo = /^(Mon|Tue|Wed|Thu|Fri|Sat|Sun) (Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec) ( \d|\d\d) (\d\d):(\d\d):(\d\d) (\d{4})$/;
function _r(r) {
  const [, e, t, s, n, o, i, a] = r;
  return [qt(e, n, s, t, o, i, a), N.utcInstance];
}
function Io(r) {
  const [, e, t, s, n, o, i, a] = r;
  return [qt(e, a, t, s, n, o, i), N.utcInstance];
}
const Do = be(go, Ht), Ao = be(mo, Ht), Wo = be(bo, Ht), Fo = be(Ms), Ds = pe(
  wo,
  ke,
  ze,
  Re
), Vo = pe(
  po,
  ke,
  ze,
  Re
), zo = pe(
  yo,
  ke,
  ze,
  Re
), Ro = pe(
  ke,
  ze,
  Re
);
function Lo(r) {
  return ye(
    r,
    [Do, Ds],
    [Ao, Vo],
    [Wo, zo],
    [Fo, Ro]
  );
}
function Uo(r) {
  return ye(Eo(r), [_o, Oo]);
}
function jo(r) {
  return ye(
    r,
    [No, _r],
    [Co, _r],
    [Mo, Io]
  );
}
function Po(r) {
  return ye(r, [So, To]);
}
const Zo = pe(ke);
function Ho(r) {
  return ye(r, [xo, Zo]);
}
const qo = be(ko, vo), Yo = be(Is), Go = pe(
  ke,
  ze,
  Re
);
function Jo(r) {
  return ye(
    r,
    [qo, Ds],
    [Yo, Go]
  );
}
const Or = "Invalid Duration", As = {
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
}, Bo = {
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
  ...As
}, M = 146097 / 400, ne = 146097 / 4800, Ko = {
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
  ...As
}, Q = [
  "years",
  "quarters",
  "months",
  "weeks",
  "days",
  "hours",
  "minutes",
  "seconds",
  "milliseconds"
], Qo = Q.slice(0).reverse();
function j(r, e, t = !1) {
  const s = {
    values: t ? e.values : { ...r.values, ...e.values || {} },
    loc: r.loc.clone(e.loc),
    conversionAccuracy: e.conversionAccuracy || r.conversionAccuracy,
    matrix: e.matrix || r.matrix
  };
  return new p(s);
}
function Ws(r, e) {
  let t = e.milliseconds ?? 0;
  for (const s of Qo.slice(1))
    e[s] && (t += e[s] * r[s].milliseconds);
  return t;
}
function Er(r, e) {
  const t = Ws(r, e) < 0 ? -1 : 1;
  Q.reduceRight((s, n) => {
    if (m(e[n]))
      return s;
    if (s) {
      const o = e[s] * t, i = r[n][s], a = Math.floor(o / i);
      e[n] += a * t, e[s] -= a * i * t;
    }
    return n;
  }, null), Q.reduce((s, n) => {
    if (m(e[n]))
      return s;
    if (s) {
      const o = e[s] % 1;
      e[s] -= o, e[n] += o * r[s][n];
    }
    return n;
  }, null);
}
function Xo(r) {
  const e = {};
  for (const [t, s] of Object.entries(r))
    s !== 0 && (e[t] = s);
  return e;
}
class p {
  /**
   * @private
   */
  constructor(e) {
    const t = e.conversionAccuracy === "longterm" || !1;
    let s = t ? Ko : Bo;
    e.matrix && (s = e.matrix), this.values = e.values, this.loc = e.loc || v.create(), this.conversionAccuracy = t ? "longterm" : "casual", this.invalid = e.invalid || null, this.matrix = s, this.isLuxonDuration = !0;
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
    return p.fromObject({ milliseconds: e }, t);
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
      throw new O(
        `Duration.fromObject: argument expected to be an object, got ${e === null ? "null" : typeof e}`
      );
    return new p({
      values: rt(e, p.normalizeUnit),
      loc: v.fromObject(t),
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
    if (Y(e))
      return p.fromMillis(e);
    if (p.isDuration(e))
      return e;
    if (typeof e == "object")
      return p.fromObject(e);
    throw new O(
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
    const [s] = Po(e);
    return s ? p.fromObject(s, t) : p.invalid("unparsable", `the input "${e}" can't be parsed as ISO 8601`);
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
    const [s] = Ho(e);
    return s ? p.fromObject(s, t) : p.invalid("unparsable", `the input "${e}" can't be parsed as ISO 8601`);
  }
  /**
   * Create an invalid Duration.
   * @param {string} reason - simple string of why this datetime is invalid. Should not contain parameters or anything else data-dependent
   * @param {string} [explanation=null] - longer explanation, may include parameters and other useful debugging information
   * @return {Duration}
   */
  static invalid(e, t = null) {
    if (!e)
      throw new O("need to specify a reason the Duration is invalid");
    const s = e instanceof F ? e : new F(e, t);
    if (S.throwOnInvalid)
      throw new xn(s);
    return new p({ invalid: s });
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
    if (!t) throw new Hr(e);
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
    const s = {
      ...t,
      floor: t.round !== !1 && t.floor !== !1
    };
    return this.isValid ? E.create(this.loc, s).formatDurationFromString(this, e) : Or;
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
    if (!this.isValid) return Or;
    const t = Q.map((s) => {
      const n = this.values[s];
      return m(n) ? null : this.loc.numberFormatter({ style: "unit", unitDisplay: "long", ...e, unit: s.slice(0, -1) }).format(n);
    }).filter((s) => s);
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
    if (!this.isValid) return null;
    let e = "P";
    return this.years !== 0 && (e += this.years + "Y"), (this.months !== 0 || this.quarters !== 0) && (e += this.months + this.quarters * 3 + "M"), this.weeks !== 0 && (e += this.weeks + "W"), this.days !== 0 && (e += this.days + "D"), (this.hours !== 0 || this.minutes !== 0 || this.seconds !== 0 || this.milliseconds !== 0) && (e += "T"), this.hours !== 0 && (e += this.hours + "H"), this.minutes !== 0 && (e += this.minutes + "M"), (this.seconds !== 0 || this.milliseconds !== 0) && (e += Pt(this.seconds + this.milliseconds / 1e3, 3) + "S"), e === "P" && (e += "T0S"), e;
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
    return this.isValid ? Ws(this.matrix, this.values) : NaN;
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
    const t = p.fromDurationLike(e), s = {};
    for (const n of Q)
      (me(t.values, n) || me(this.values, n)) && (s[n] = t.get(n) + this.get(n));
    return j(this, { values: s }, !0);
  }
  /**
   * Make this Duration shorter by the specified amount. Return a newly-constructed Duration.
   * @param {Duration|Object|number} duration - The amount to subtract. Either a Luxon Duration, a number of milliseconds, the object argument to Duration.fromObject()
   * @return {Duration}
   */
  minus(e) {
    if (!this.isValid) return this;
    const t = p.fromDurationLike(e);
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
    if (!this.isValid) return this;
    const t = {};
    for (const s of Object.keys(this.values))
      t[s] = vs(e(this.values[s], s));
    return j(this, { values: t }, !0);
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
    return this[p.normalizeUnit(e)];
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
    const t = { ...this.values, ...rt(e, p.normalizeUnit) };
    return j(this, { values: t });
  }
  /**
   * "Set" the locale and/or numberingSystem.  Returns a newly-constructed Duration.
   * @example dur.reconfigure({ locale: 'en-GB' })
   * @return {Duration}
   */
  reconfigure({ locale: e, numberingSystem: t, conversionAccuracy: s, matrix: n } = {}) {
    const i = { loc: this.loc.clone({ locale: e, numberingSystem: t }), matrix: n, conversionAccuracy: s };
    return j(this, i);
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
    return Er(this.matrix, e), j(this, { values: e }, !0);
  }
  /**
   * Rescale units to its largest representation
   * @example Duration.fromObject({ milliseconds: 90000 }).rescale().toObject() //=> { minutes: 1, seconds: 30 }
   * @return {Duration}
   */
  rescale() {
    if (!this.isValid) return this;
    const e = Xo(this.normalize().shiftToAll().toObject());
    return j(this, { values: e }, !0);
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
    e = e.map((i) => p.normalizeUnit(i));
    const t = {}, s = {}, n = this.toObject();
    let o;
    for (const i of Q)
      if (e.indexOf(i) >= 0) {
        o = i;
        let a = 0;
        for (const c in s)
          a += this.matrix[c][i] * s[c], s[c] = 0;
        Y(n[i]) && (a += n[i]);
        const l = Math.trunc(a);
        t[i] = l, s[i] = (a * 1e3 - l * 1e3) / 1e3;
      } else Y(n[i]) && (s[i] = n[i]);
    for (const i in s)
      s[i] !== 0 && (t[o] += i === o ? s[i] : s[i] / this.matrix[o][i]);
    return Er(this.matrix, t), j(this, { values: t }, !0);
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
    for (const t of Object.keys(this.values))
      e[t] = this.values[t] === 0 ? 0 : -this.values[t];
    return j(this, { values: e }, !0);
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
    function t(s, n) {
      return s === void 0 || s === 0 ? n === void 0 || n === 0 : s === n;
    }
    for (const s of Q)
      if (!t(this.values[s], e.values[s]))
        return !1;
    return !0;
  }
}
const oe = "Invalid Interval";
function ei(r, e) {
  return !r || !r.isValid ? x.invalid("missing or invalid start") : !e || !e.isValid ? x.invalid("missing or invalid end") : e < r ? x.invalid(
    "end before start",
    `The end of an interval must be after its start, but you had start=${r.toISO()} and end=${e.toISO()}`
  ) : null;
}
class x {
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
      throw new O("need to specify a reason the Interval is invalid");
    const s = e instanceof F ? e : new F(e, t);
    if (S.throwOnInvalid)
      throw new wn(s);
    return new x({ invalid: s });
  }
  /**
   * Create an Interval from a start DateTime and an end DateTime. Inclusive of the start but not the end.
   * @param {DateTime|Date|Object} start
   * @param {DateTime|Date|Object} end
   * @return {Interval}
   */
  static fromDateTimes(e, t) {
    const s = Te(e), n = Te(t), o = ei(s, n);
    return o ?? new x({
      start: s,
      end: n
    });
  }
  /**
   * Create an Interval from a start DateTime and a Duration to extend to.
   * @param {DateTime|Date|Object} start
   * @param {Duration|Object|number} duration - the length of the Interval.
   * @return {Interval}
   */
  static after(e, t) {
    const s = p.fromDurationLike(t), n = Te(e);
    return x.fromDateTimes(n, n.plus(s));
  }
  /**
   * Create an Interval from an end DateTime and a Duration to extend backwards to.
   * @param {DateTime|Date|Object} end
   * @param {Duration|Object|number} duration - the length of the Interval.
   * @return {Interval}
   */
  static before(e, t) {
    const s = p.fromDurationLike(t), n = Te(e);
    return x.fromDateTimes(n.minus(s), n);
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
    const [s, n] = (e || "").split("/", 2);
    if (s && n) {
      let o, i;
      try {
        o = g.fromISO(s, t), i = o.isValid;
      } catch {
        i = !1;
      }
      let a, l;
      try {
        a = g.fromISO(n, t), l = a.isValid;
      } catch {
        l = !1;
      }
      if (i && l)
        return x.fromDateTimes(o, a);
      if (i) {
        const c = p.fromISO(n, t);
        if (c.isValid)
          return x.after(o, c);
      } else if (l) {
        const c = p.fromISO(s, t);
        if (c.isValid)
          return x.before(a, c);
      }
    }
    return x.invalid("unparsable", `the input "${e}" can't be parsed as ISO 8601`);
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
    if (!this.isValid) return NaN;
    const s = this.start.startOf(e, t);
    let n;
    return t != null && t.useLocaleWeeks ? n = this.end.reconfigure({ locale: s.locale }) : n = this.end, n = n.startOf(e, t), Math.floor(n.diff(s, e).get(e)) + (n.valueOf() !== this.end.valueOf());
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
    return this.isValid ? x.fromDateTimes(e || this.s, t || this.e) : this;
  }
  /**
   * Split this Interval at each of the specified DateTimes
   * @param {...DateTime} dateTimes - the unit of time to count.
   * @return {Array}
   */
  splitAt(...e) {
    if (!this.isValid) return [];
    const t = e.map(Te).filter((i) => this.contains(i)).sort((i, a) => i.toMillis() - a.toMillis()), s = [];
    let { s: n } = this, o = 0;
    for (; n < this.e; ) {
      const i = t[o] || this.e, a = +i > +this.e ? this.e : i;
      s.push(x.fromDateTimes(n, a)), n = a, o += 1;
    }
    return s;
  }
  /**
   * Split this Interval into smaller Intervals, each of the specified length.
   * Left over time is grouped into a smaller interval
   * @param {Duration|Object|number} duration - The length of each resulting interval.
   * @return {Array}
   */
  splitBy(e) {
    const t = p.fromDurationLike(e);
    if (!this.isValid || !t.isValid || t.as("milliseconds") === 0)
      return [];
    let { s } = this, n = 1, o;
    const i = [];
    for (; s < this.e; ) {
      const a = this.start.plus(t.mapUnits((l) => l * n));
      o = +a > +this.e ? this.e : a, i.push(x.fromDateTimes(s, o)), s = o, n += 1;
    }
    return i;
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
    const t = this.s > e.s ? this.s : e.s, s = this.e < e.e ? this.e : e.e;
    return t >= s ? null : x.fromDateTimes(t, s);
  }
  /**
   * Return an Interval representing the union of this Interval and the specified Interval.
   * Specifically, the resulting Interval has the minimum start time and the maximum end time of the two Intervals.
   * @param {Interval} other
   * @return {Interval}
   */
  union(e) {
    if (!this.isValid) return this;
    const t = this.s < e.s ? this.s : e.s, s = this.e > e.e ? this.e : e.e;
    return x.fromDateTimes(t, s);
  }
  /**
   * Merge an array of Intervals into a equivalent minimal set of Intervals.
   * Combines overlapping and adjacent Intervals.
   * @param {Array} intervals
   * @return {Array}
   */
  static merge(e) {
    const [t, s] = e.sort((n, o) => n.s - o.s).reduce(
      ([n, o], i) => o ? o.overlaps(i) || o.abutsStart(i) ? [n, o.union(i)] : [n.concat([o]), i] : [n, i],
      [[], null]
    );
    return s && t.push(s), t;
  }
  /**
   * Return an array of Intervals representing the spans of time that only appear in one of the specified Intervals.
   * @param {Array} intervals
   * @return {Array}
   */
  static xor(e) {
    let t = null, s = 0;
    const n = [], o = e.map((l) => [
      { time: l.s, type: "s" },
      { time: l.e, type: "e" }
    ]), i = Array.prototype.concat(...o), a = i.sort((l, c) => l.time - c.time);
    for (const l of a)
      s += l.type === "s" ? 1 : -1, s === 1 ? t = l.time : (t && +t != +l.time && n.push(x.fromDateTimes(t, l.time)), t = null);
    return x.merge(n);
  }
  /**
   * Return an Interval representing the span of time in this Interval that doesn't overlap with any of the specified Intervals.
   * @param {...Interval} intervals
   * @return {Array}
   */
  difference(...e) {
    return x.xor([this].concat(e)).map((t) => this.intersection(t)).filter((t) => t && !t.isEmpty());
  }
  /**
   * Returns a string representation of this Interval appropriate for debugging.
   * @return {string}
   */
  toString() {
    return this.isValid ? `[${this.s.toISO()} – ${this.e.toISO()})` : oe;
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
  toLocaleString(e = Xe, t = {}) {
    return this.isValid ? E.create(this.s.loc.clone(t), e).formatInterval(this) : oe;
  }
  /**
   * Returns an ISO 8601-compliant string representation of this Interval.
   * @see https://en.wikipedia.org/wiki/ISO_8601#Time_intervals
   * @param {Object} opts - The same options as {@link DateTime#toISO}
   * @return {string}
   */
  toISO(e) {
    return this.isValid ? `${this.s.toISO(e)}/${this.e.toISO(e)}` : oe;
  }
  /**
   * Returns an ISO 8601-compliant string representation of date of this Interval.
   * The time components are ignored.
   * @see https://en.wikipedia.org/wiki/ISO_8601#Time_intervals
   * @return {string}
   */
  toISODate() {
    return this.isValid ? `${this.s.toISODate()}/${this.e.toISODate()}` : oe;
  }
  /**
   * Returns an ISO 8601-compliant string representation of time of this Interval.
   * The date components are ignored.
   * @see https://en.wikipedia.org/wiki/ISO_8601#Time_intervals
   * @param {Object} opts - The same options as {@link DateTime#toISO}
   * @return {string}
   */
  toISOTime(e) {
    return this.isValid ? `${this.s.toISOTime(e)}/${this.e.toISOTime(e)}` : oe;
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
    return this.isValid ? `${this.s.toFormat(e)}${t}${this.e.toFormat(e)}` : oe;
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
    return this.isValid ? this.e.diff(this.s, e, t) : p.invalid(this.invalidReason);
  }
  /**
   * Run mapFn on the interval start and end, returning a new Interval from the resulting DateTimes
   * @param {function} mapFn
   * @return {Interval}
   * @example Interval.fromDateTimes(dt1, dt2).mapEndpoints(endpoint => endpoint.toUTC())
   * @example Interval.fromDateTimes(dt1, dt2).mapEndpoints(endpoint => endpoint.plus({ hours: 2 }))
   */
  mapEndpoints(e) {
    return x.fromDateTimes(e(this.s), e(this.e));
  }
}
class je {
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
    return R.isValidZone(e);
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
    return (t || v.create(e)).getStartOfWeek();
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
    return (t || v.create(e)).getMinDaysInFirstWeek();
  }
  /**
   * Get the weekdays, which are considered the weekend according to the given locale
   * @param {Object} opts - options
   * @param {string} [opts.locale] - the locale code
   * @param {string} [opts.locObj=null] - an existing locale object to use
   * @returns {number[]} an array of weekdays, 1 for Monday through 7 for Sunday
   */
  static getWeekendWeekdays({ locale: e = null, locObj: t = null } = {}) {
    return (t || v.create(e)).getWeekendDays().slice();
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
  static months(e = "long", { locale: t = null, numberingSystem: s = null, locObj: n = null, outputCalendar: o = "gregory" } = {}) {
    return (n || v.create(t, s, o)).months(e);
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
  static monthsFormat(e = "long", { locale: t = null, numberingSystem: s = null, locObj: n = null, outputCalendar: o = "gregory" } = {}) {
    return (n || v.create(t, s, o)).months(e, !0);
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
  static weekdays(e = "long", { locale: t = null, numberingSystem: s = null, locObj: n = null } = {}) {
    return (n || v.create(t, s, null)).weekdays(e);
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
  static weekdaysFormat(e = "long", { locale: t = null, numberingSystem: s = null, locObj: n = null } = {}) {
    return (n || v.create(t, s, null)).weekdays(e, !0);
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
    return v.create(e).meridiems();
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
    return v.create(t, null, "gregory").eras(e);
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
    return { relative: ps(), localeWeek: ys() };
  }
}
function Nr(r, e) {
  const t = (n) => n.toUTC(0, { keepLocalTime: !0 }).startOf("day").valueOf(), s = t(e) - t(r);
  return Math.floor(p.fromMillis(s).as("days"));
}
function ti(r, e, t) {
  const s = [
    ["years", (l, c) => c.year - l.year],
    ["quarters", (l, c) => c.quarter - l.quarter + (c.year - l.year) * 4],
    ["months", (l, c) => c.month - l.month + (c.year - l.year) * 12],
    [
      "weeks",
      (l, c) => {
        const d = Nr(l, c);
        return (d - d % 7) / 7;
      }
    ],
    ["days", Nr]
  ], n = {}, o = r;
  let i, a;
  for (const [l, c] of s)
    t.indexOf(l) >= 0 && (i = l, n[l] = c(r, e), a = o.plus(n), a > e ? (n[l]--, r = o.plus(n), r > e && (a = r, n[l]--, r = o.plus(n))) : r = a);
  return [r, n, a, i];
}
function ri(r, e, t, s) {
  let [n, o, i, a] = ti(r, e, t);
  const l = e - n, c = t.filter(
    (h) => ["hours", "minutes", "seconds", "milliseconds"].indexOf(h) >= 0
  );
  c.length === 0 && (i < e && (i = n.plus({ [a]: 1 })), i !== n && (o[a] = (o[a] || 0) + l / (i - n)));
  const d = p.fromObject(o, s);
  return c.length > 0 ? p.fromMillis(l, s).shiftTo(...c).plus(d) : d;
}
const si = "missing Intl.DateTimeFormat.formatToParts support";
function k(r, e = (t) => t) {
  return { regex: r, deser: ([t]) => e(Hn(t)) };
}
const ni = " ", Fs = `[ ${ni}]`, Vs = new RegExp(Fs, "g");
function oi(r) {
  return r.replace(/\./g, "\\.?").replace(Vs, Fs);
}
function Cr(r) {
  return r.replace(/\./g, "").replace(Vs, " ").toLowerCase();
}
function W(r, e) {
  return r === null ? null : {
    regex: RegExp(r.map(oi).join("|")),
    deser: ([t]) => r.findIndex((s) => Cr(t) === Cr(s)) + e
  };
}
function Mr(r, e) {
  return { regex: r, deser: ([, t, s]) => lt(t, s), groups: e };
}
function Pe(r) {
  return { regex: r, deser: ([e]) => e };
}
function ii(r) {
  return r.replace(/[\-\[\]{}()*+?.,\\\^$|#\s]/g, "\\$&");
}
function ai(r, e) {
  const t = A(e), s = A(e, "{2}"), n = A(e, "{3}"), o = A(e, "{4}"), i = A(e, "{6}"), a = A(e, "{1,2}"), l = A(e, "{1,3}"), c = A(e, "{1,6}"), d = A(e, "{1,9}"), h = A(e, "{2,4}"), y = A(e, "{4,6}"), f = (z) => ({ regex: RegExp(ii(z.val)), deser: ([se]) => se, literal: !0 }), re = ((z) => {
    if (r.literal)
      return f(z);
    switch (z.val) {
      case "G":
        return W(e.eras("short"), 0);
      case "GG":
        return W(e.eras("long"), 0);
      case "y":
        return k(c);
      case "yy":
        return k(h, Mt);
      case "yyyy":
        return k(o);
      case "yyyyy":
        return k(y);
      case "yyyyyy":
        return k(i);
      case "M":
        return k(a);
      case "MM":
        return k(s);
      case "MMM":
        return W(e.months("short", !0), 1);
      case "MMMM":
        return W(e.months("long", !0), 1);
      case "L":
        return k(a);
      case "LL":
        return k(s);
      case "LLL":
        return W(e.months("short", !1), 1);
      case "LLLL":
        return W(e.months("long", !1), 1);
      case "d":
        return k(a);
      case "dd":
        return k(s);
      case "o":
        return k(l);
      case "ooo":
        return k(n);
      case "HH":
        return k(s);
      case "H":
        return k(a);
      case "hh":
        return k(s);
      case "h":
        return k(a);
      case "mm":
        return k(s);
      case "m":
        return k(a);
      case "q":
        return k(a);
      case "qq":
        return k(s);
      case "s":
        return k(a);
      case "ss":
        return k(s);
      case "S":
        return k(l);
      case "SSS":
        return k(n);
      case "u":
        return Pe(d);
      case "uu":
        return Pe(a);
      case "uuu":
        return k(t);
      case "a":
        return W(e.meridiems(), 0);
      case "kkkk":
        return k(o);
      case "kk":
        return k(h, Mt);
      case "W":
        return k(a);
      case "WW":
        return k(s);
      case "E":
      case "c":
        return k(t);
      case "EEE":
        return W(e.weekdays("short", !1), 1);
      case "EEEE":
        return W(e.weekdays("long", !1), 1);
      case "ccc":
        return W(e.weekdays("short", !0), 1);
      case "cccc":
        return W(e.weekdays("long", !0), 1);
      case "Z":
      case "ZZ":
        return Mr(new RegExp(`([+-]${a.source})(?::(${s.source}))?`), 2);
      case "ZZZ":
        return Mr(new RegExp(`([+-]${a.source})(${s.source})?`), 2);
      case "z":
        return Pe(/[a-z_+-/]{1,256}?/i);
      case " ":
        return Pe(/[^\S\n\r]/);
      default:
        return f(z);
    }
  })(r) || {
    invalidReason: si
  };
  return re.token = r, re;
}
const li = {
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
function ci(r, e, t) {
  const { type: s, value: n } = r;
  if (s === "literal") {
    const l = /^\s+$/.test(n);
    return {
      literal: !l,
      val: l ? " " : n
    };
  }
  const o = e[s];
  let i = s;
  s === "hour" && (e.hour12 != null ? i = e.hour12 ? "hour12" : "hour24" : e.hourCycle != null ? e.hourCycle === "h11" || e.hourCycle === "h12" ? i = "hour12" : i = "hour24" : i = t.hour12 ? "hour12" : "hour24");
  let a = li[i];
  if (typeof a == "object" && (a = a[o]), a)
    return {
      literal: !1,
      val: a
    };
}
function ui(r) {
  return [`^${r.map((t) => t.regex).reduce((t, s) => `${t}(${s.source})`, "")}$`, r];
}
function di(r, e, t) {
  const s = r.match(e);
  if (s) {
    const n = {};
    let o = 1;
    for (const i in t)
      if (me(t, i)) {
        const a = t[i], l = a.groups ? a.groups + 1 : 1;
        !a.literal && a.token && (n[a.token.val[0]] = a.deser(s.slice(o, o + l))), o += l;
      }
    return [s, n];
  } else
    return [s, {}];
}
function hi(r) {
  const e = (o) => {
    switch (o) {
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
  let t = null, s;
  return m(r.z) || (t = R.create(r.z)), m(r.Z) || (t || (t = new N(r.Z)), s = r.Z), m(r.q) || (r.M = (r.q - 1) * 3 + 1), m(r.h) || (r.h < 12 && r.a === 1 ? r.h += 12 : r.h === 12 && r.a === 0 && (r.h = 0)), r.G === 0 && r.y && (r.y = -r.y), m(r.u) || (r.S = jt(r.u)), [Object.keys(r).reduce((o, i) => {
    const a = e(i);
    return a && (o[a] = r[i]), o;
  }, {}), t, s];
}
let yt = null;
function fi() {
  return yt || (yt = g.fromMillis(1555555555555)), yt;
}
function gi(r, e) {
  if (r.literal)
    return r;
  const t = E.macroTokenToFormatOpts(r.val), s = Us(t, e);
  return s == null || s.includes(void 0) ? r : s;
}
function zs(r, e) {
  return Array.prototype.concat(...r.map((t) => gi(t, e)));
}
class Rs {
  constructor(e, t) {
    if (this.locale = e, this.format = t, this.tokens = zs(E.parseFormat(t), e), this.units = this.tokens.map((s) => ai(s, e)), this.disqualifyingUnit = this.units.find((s) => s.invalidReason), !this.disqualifyingUnit) {
      const [s, n] = ui(this.units);
      this.regex = RegExp(s, "i"), this.handlers = n;
    }
  }
  explainFromTokens(e) {
    if (this.isValid) {
      const [t, s] = di(e, this.regex, this.handlers), [n, o, i] = s ? hi(s) : [null, null, void 0];
      if (me(s, "a") && me(s, "H"))
        throw new ce(
          "Can't include meridiem when specifying 24-hour format"
        );
      return {
        input: e,
        tokens: this.tokens,
        regex: this.regex,
        rawMatches: t,
        matches: s,
        result: n,
        zone: o,
        specificOffset: i
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
function Ls(r, e, t) {
  return new Rs(r, t).explainFromTokens(e);
}
function mi(r, e, t) {
  const { result: s, zone: n, specificOffset: o, invalidReason: i } = Ls(r, e, t);
  return [s, n, o, i];
}
function Us(r, e) {
  if (!r)
    return null;
  const s = E.create(e, r).dtFormatter(fi()), n = s.formatToParts(), o = s.resolvedOptions();
  return n.map((i) => ci(i, r, o));
}
const kt = "Invalid DateTime", Ir = 864e13;
function _e(r) {
  return new F("unsupported zone", `the zone "${r.name}" is not supported`);
}
function vt(r) {
  return r.weekData === null && (r.weekData = et(r.c)), r.weekData;
}
function wt(r) {
  return r.localWeekData === null && (r.localWeekData = et(
    r.c,
    r.loc.getMinDaysInFirstWeek(),
    r.loc.getStartOfWeek()
  )), r.localWeekData;
}
function B(r, e) {
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
function js(r, e, t) {
  let s = r - e * 60 * 1e3;
  const n = t.offset(s);
  if (e === n)
    return [s, e];
  s -= (n - e) * 60 * 1e3;
  const o = t.offset(s);
  return n === o ? [s, n] : [r - Math.min(n, o) * 60 * 1e3, Math.max(n, o)];
}
function Ze(r, e) {
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
function Ge(r, e, t) {
  return js(at(r), e, t);
}
function Dr(r, e) {
  const t = r.o, s = r.c.year + Math.trunc(e.years), n = r.c.month + Math.trunc(e.months) + Math.trunc(e.quarters) * 3, o = {
    ...r.c,
    year: s,
    month: n,
    day: Math.min(r.c.day, tt(s, n)) + Math.trunc(e.days) + Math.trunc(e.weeks) * 7
  }, i = p.fromObject({
    years: e.years - Math.trunc(e.years),
    quarters: e.quarters - Math.trunc(e.quarters),
    months: e.months - Math.trunc(e.months),
    weeks: e.weeks - Math.trunc(e.weeks),
    days: e.days - Math.trunc(e.days),
    hours: e.hours,
    minutes: e.minutes,
    seconds: e.seconds,
    milliseconds: e.milliseconds
  }).as("milliseconds"), a = at(o);
  let [l, c] = js(a, t, r.zone);
  return i !== 0 && (l += i, c = r.zone.offset(l)), { ts: l, o: c };
}
function ie(r, e, t, s, n, o) {
  const { setZone: i, zone: a } = t;
  if (r && Object.keys(r).length !== 0 || e) {
    const l = e || a, c = g.fromObject(r, {
      ...t,
      zone: l,
      specificOffset: o
    });
    return i ? c : c.setZone(a);
  } else
    return g.invalid(
      new F("unparsable", `the input "${n}" can't be parsed as ${s}`)
    );
}
function He(r, e, t = !0) {
  return r.isValid ? E.create(v.create("en-US"), {
    allowZ: t,
    forceSimple: !0
  }).formatDateTimeFromString(r, e) : null;
}
function xt(r, e) {
  const t = r.c.year > 9999 || r.c.year < 0;
  let s = "";
  return t && r.c.year >= 0 && (s += "+"), s += T(r.c.year, t ? 6 : 4), e ? (s += "-", s += T(r.c.month), s += "-", s += T(r.c.day)) : (s += T(r.c.month), s += T(r.c.day)), s;
}
function Ar(r, e, t, s, n, o) {
  let i = T(r.c.hour);
  return e ? (i += ":", i += T(r.c.minute), (r.c.millisecond !== 0 || r.c.second !== 0 || !t) && (i += ":")) : i += T(r.c.minute), (r.c.millisecond !== 0 || r.c.second !== 0 || !t) && (i += T(r.c.second), (r.c.millisecond !== 0 || !s) && (i += ".", i += T(r.c.millisecond, 3))), n && (r.isOffsetFixed && r.offset === 0 && !o ? i += "Z" : r.o < 0 ? (i += "-", i += T(Math.trunc(-r.o / 60)), i += ":", i += T(Math.trunc(-r.o % 60))) : (i += "+", i += T(Math.trunc(r.o / 60)), i += ":", i += T(Math.trunc(r.o % 60)))), o && (i += "[" + r.zone.ianaName + "]"), i;
}
const Ps = {
  month: 1,
  day: 1,
  hour: 0,
  minute: 0,
  second: 0,
  millisecond: 0
}, bi = {
  weekNumber: 1,
  weekday: 1,
  hour: 0,
  minute: 0,
  second: 0,
  millisecond: 0
}, pi = {
  ordinal: 1,
  hour: 0,
  minute: 0,
  second: 0,
  millisecond: 0
}, Zs = ["year", "month", "day", "hour", "minute", "second", "millisecond"], yi = [
  "weekYear",
  "weekNumber",
  "weekday",
  "hour",
  "minute",
  "second",
  "millisecond"
], ki = ["year", "ordinal", "hour", "minute", "second", "millisecond"];
function vi(r) {
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
  if (!e) throw new Hr(r);
  return e;
}
function Wr(r) {
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
      return vi(r);
  }
}
function wi(r) {
  return Be[r] || (Je === void 0 && (Je = S.now()), Be[r] = r.offset(Je)), Be[r];
}
function Fr(r, e) {
  const t = H(e.zone, S.defaultZone);
  if (!t.isValid)
    return g.invalid(_e(t));
  const s = v.fromObject(e);
  let n, o;
  if (m(r.year))
    n = S.now();
  else {
    for (const l of Zs)
      m(r[l]) && (r[l] = Ps[l]);
    const i = ms(r) || bs(r);
    if (i)
      return g.invalid(i);
    const a = wi(t);
    [n, o] = Ge(r, a, t);
  }
  return new g({ ts: n, zone: t, loc: s, o });
}
function Vr(r, e, t) {
  const s = m(t.round) ? !0 : t.round, n = (i, a) => (i = Pt(i, s || t.calendary ? 0 : 2, !0), e.loc.clone(t).relFormatter(t).format(i, a)), o = (i) => t.calendary ? e.hasSame(r, i) ? 0 : e.startOf(i).diff(r.startOf(i), i).get(i) : e.diff(r, i).get(i);
  if (t.unit)
    return n(o(t.unit), t.unit);
  for (const i of t.units) {
    const a = o(i);
    if (Math.abs(a) >= 1)
      return n(a, i);
  }
  return n(r > e ? -0 : 0, t.units[t.units.length - 1]);
}
function zr(r) {
  let e = {}, t;
  return r.length > 0 && typeof r[r.length - 1] == "object" ? (e = r[r.length - 1], t = Array.from(r).slice(0, r.length - 1)) : t = Array.from(r), [e, t];
}
let Je, Be = {};
class g {
  /**
   * @access private
   */
  constructor(e) {
    const t = e.zone || S.defaultZone;
    let s = e.invalid || (Number.isNaN(e.ts) ? new F("invalid input") : null) || (t.isValid ? null : _e(t));
    this.ts = m(e.ts) ? S.now() : e.ts;
    let n = null, o = null;
    if (!s)
      if (e.old && e.old.ts === this.ts && e.old.zone.equals(t))
        [n, o] = [e.old.c, e.old.o];
      else {
        const a = Y(e.o) && !e.old ? e.o : t.offset(this.ts);
        n = Ze(this.ts, a), s = Number.isNaN(n.year) ? new F("invalid input") : null, n = s ? null : n, o = s ? null : a;
      }
    this._zone = t, this.loc = e.loc || v.create(), this.invalid = s, this.weekData = null, this.localWeekData = null, this.c = n, this.o = o, this.isLuxonDateTime = !0;
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
    const [e, t] = zr(arguments), [s, n, o, i, a, l, c] = t;
    return Fr({ year: s, month: n, day: o, hour: i, minute: a, second: l, millisecond: c }, e);
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
    const [e, t] = zr(arguments), [s, n, o, i, a, l, c] = t;
    return e.zone = N.utcInstance, Fr({ year: s, month: n, day: o, hour: i, minute: a, second: l, millisecond: c }, e);
  }
  /**
   * Create a DateTime from a JavaScript Date object. Uses the default zone.
   * @param {Date} date - a JavaScript Date object
   * @param {Object} options - configuration options for the DateTime
   * @param {string|Zone} [options.zone='local'] - the zone to place the DateTime into
   * @return {DateTime}
   */
  static fromJSDate(e, t = {}) {
    const s = Bn(e) ? e.valueOf() : NaN;
    if (Number.isNaN(s))
      return g.invalid("invalid input");
    const n = H(t.zone, S.defaultZone);
    return n.isValid ? new g({
      ts: s,
      zone: n,
      loc: v.fromObject(t)
    }) : g.invalid(_e(n));
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
  static fromMillis(e, t = {}) {
    if (Y(e))
      return e < -Ir || e > Ir ? g.invalid("Timestamp out of range") : new g({
        ts: e,
        zone: H(t.zone, S.defaultZone),
        loc: v.fromObject(t)
      });
    throw new O(
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
  static fromSeconds(e, t = {}) {
    if (Y(e))
      return new g({
        ts: e * 1e3,
        zone: H(t.zone, S.defaultZone),
        loc: v.fromObject(t)
      });
    throw new O("fromSeconds requires a numerical input");
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
  static fromObject(e, t = {}) {
    e = e || {};
    const s = H(t.zone, S.defaultZone);
    if (!s.isValid)
      return g.invalid(_e(s));
    const n = v.fromObject(t), o = rt(e, Wr), { minDaysInFirstWeek: i, startOfWeek: a } = xr(o, n), l = S.now(), c = m(t.specificOffset) ? s.offset(l) : t.specificOffset, d = !m(o.ordinal), h = !m(o.year), y = !m(o.month) || !m(o.day), f = h || y, w = o.weekYear || o.weekNumber;
    if ((f || d) && w)
      throw new ce(
        "Can't mix weekYear/weekNumber units with year/month/day or ordinals"
      );
    if (y && d)
      throw new ce("Can't mix ordinal dates with month/day");
    const re = w || o.weekday && !f;
    let z, se, ve = Ze(l, c);
    re ? (z = yi, se = bi, ve = et(ve, i, a)) : d ? (z = ki, se = pi, ve = pt(ve)) : (z = Zs, se = Ps);
    let Bt = !1;
    for (const xe of z) {
      const Qs = o[xe];
      m(Qs) ? Bt ? o[xe] = se[xe] : o[xe] = ve[xe] : Bt = !0;
    }
    const Gs = re ? Yn(o, i, a) : d ? Gn(o) : ms(o), Kt = Gs || bs(o);
    if (Kt)
      return g.invalid(Kt);
    const Js = re ? vr(o, i, a) : d ? wr(o) : o, [Bs, Ks] = Ge(Js, c, s), we = new g({
      ts: Bs,
      zone: s,
      o: Ks,
      loc: n
    });
    return o.weekday && f && e.weekday !== we.weekday ? g.invalid(
      "mismatched weekday",
      `you can't specify both a weekday of ${o.weekday} and a date of ${we.toISO()}`
    ) : we.isValid ? we : g.invalid(we.invalid);
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
  static fromISO(e, t = {}) {
    const [s, n] = Lo(e);
    return ie(s, n, t, "ISO 8601", e);
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
  static fromRFC2822(e, t = {}) {
    const [s, n] = Uo(e);
    return ie(s, n, t, "RFC 2822", e);
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
  static fromHTTP(e, t = {}) {
    const [s, n] = jo(e);
    return ie(s, n, t, "HTTP", t);
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
  static fromFormat(e, t, s = {}) {
    if (m(e) || m(t))
      throw new O("fromFormat requires an input string and a format");
    const { locale: n = null, numberingSystem: o = null } = s, i = v.fromOpts({
      locale: n,
      numberingSystem: o,
      defaultToEN: !0
    }), [a, l, c, d] = mi(i, e, t);
    return d ? g.invalid(d) : ie(a, l, s, `format ${t}`, e, c);
  }
  /**
   * @deprecated use fromFormat instead
   */
  static fromString(e, t, s = {}) {
    return g.fromFormat(e, t, s);
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
  static fromSQL(e, t = {}) {
    const [s, n] = Jo(e);
    return ie(s, n, t, "SQL", e);
  }
  /**
   * Create an invalid DateTime.
   * @param {string} reason - simple string of why this DateTime is invalid. Should not contain parameters or anything else data-dependent.
   * @param {string} [explanation=null] - longer explanation, may include parameters and other useful debugging information
   * @return {DateTime}
   */
  static invalid(e, t = null) {
    if (!e)
      throw new O("need to specify a reason the DateTime is invalid");
    const s = e instanceof F ? e : new F(e, t);
    if (S.throwOnInvalid)
      throw new vn(s);
    return new g({ invalid: s });
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
    const s = Us(e, v.fromObject(t));
    return s ? s.map((n) => n ? n.val : null).join("") : null;
  }
  /**
   * Produce the the fully expanded format token for the locale
   * Does NOT quote characters, so quoted tokens will not round trip correctly
   * @param fmt
   * @param localeOpts
   * @returns {string}
   */
  static expandFormat(e, t = {}) {
    return zs(E.parseFormat(e), v.fromObject(t)).map((n) => n.val).join("");
  }
  static resetCache() {
    Je = void 0, Be = {};
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
    return this.isValid ? vt(this).weekYear : NaN;
  }
  /**
   * Get the week number of the week year (1-52ish).
   * @see https://en.wikipedia.org/wiki/ISO_week_date
   * @example DateTime.local(2017, 5, 25).weekNumber //=> 21
   * @type {number}
   */
  get weekNumber() {
    return this.isValid ? vt(this).weekNumber : NaN;
  }
  /**
   * Get the day of the week.
   * 1 is Monday and 7 is Sunday
   * @see https://en.wikipedia.org/wiki/ISO_week_date
   * @example DateTime.local(2014, 11, 31).weekday //=> 4
   * @type {number}
   */
  get weekday() {
    return this.isValid ? vt(this).weekday : NaN;
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
    return this.isValid ? wt(this).weekday : NaN;
  }
  /**
   * Get the week number of the week year according to the locale. Different locales assign week numbers differently,
   * because the week can start on different days of the week (see localWeekday) and because a different number of days
   * is required for a week to count as the first week of a year.
   * @returns {number}
   */
  get localWeekNumber() {
    return this.isValid ? wt(this).weekNumber : NaN;
  }
  /**
   * Get the week year according to the locale. Different locales assign week numbers (and therefor week years)
   * differently, see localWeekNumber.
   * @returns {number}
   */
  get localWeekYear() {
    return this.isValid ? wt(this).weekYear : NaN;
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
    return this.isValid ? je.months("short", { locObj: this.loc })[this.month - 1] : null;
  }
  /**
   * Get the human readable long month name, such as 'October'.
   * Defaults to the system's locale if no locale has been specified
   * @example DateTime.local(2017, 10, 30).monthLong //=> October
   * @type {string}
   */
  get monthLong() {
    return this.isValid ? je.months("long", { locObj: this.loc })[this.month - 1] : null;
  }
  /**
   * Get the human readable short weekday, such as 'Mon'.
   * Defaults to the system's locale if no locale has been specified
   * @example DateTime.local(2017, 10, 30).weekdayShort //=> Mon
   * @type {string}
   */
  get weekdayShort() {
    return this.isValid ? je.weekdays("short", { locObj: this.loc })[this.weekday - 1] : null;
  }
  /**
   * Get the human readable long weekday, such as 'Monday'.
   * Defaults to the system's locale if no locale has been specified
   * @example DateTime.local(2017, 10, 30).weekdayLong //=> Monday
   * @type {string}
   */
  get weekdayLong() {
    return this.isValid ? je.weekdays("long", { locObj: this.loc })[this.weekday - 1] : null;
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
    const e = 864e5, t = 6e4, s = at(this.c), n = this.zone.offset(s - e), o = this.zone.offset(s + e), i = this.zone.offset(s - n * t), a = this.zone.offset(s - o * t);
    if (i === a)
      return [this];
    const l = s - i * t, c = s - a * t, d = Ze(l, i), h = Ze(c, a);
    return d.hour === h.hour && d.minute === h.minute && d.second === h.second && d.millisecond === h.millisecond ? [B(this, { ts: l }), B(this, { ts: c })] : [this];
  }
  /**
   * Returns true if this DateTime is in a leap year, false otherwise
   * @example DateTime.local(2016).isInLeapYear //=> true
   * @example DateTime.local(2013).isInLeapYear //=> false
   * @type {boolean}
   */
  get isInLeapYear() {
    return Ve(this.year);
  }
  /**
   * Returns the number of days in this DateTime's month
   * @example DateTime.local(2016, 2).daysInMonth //=> 29
   * @example DateTime.local(2016, 3).daysInMonth //=> 31
   * @type {number}
   */
  get daysInMonth() {
    return tt(this.year, this.month);
  }
  /**
   * Returns the number of days in this DateTime's year
   * @example DateTime.local(2016).daysInYear //=> 366
   * @example DateTime.local(2013).daysInYear //=> 365
   * @type {number}
   */
  get daysInYear() {
    return this.isValid ? de(this.year) : NaN;
  }
  /**
   * Returns the number of weeks in this DateTime's year
   * @see https://en.wikipedia.org/wiki/ISO_week_date
   * @example DateTime.local(2004).weeksInWeekYear //=> 53
   * @example DateTime.local(2013).weeksInWeekYear //=> 52
   * @type {number}
   */
  get weeksInWeekYear() {
    return this.isValid ? De(this.weekYear) : NaN;
  }
  /**
   * Returns the number of weeks in this DateTime's local week year
   * @example DateTime.local(2020, 6, {locale: 'en-US'}).weeksInLocalWeekYear //=> 52
   * @example DateTime.local(2020, 6, {locale: 'de-DE'}).weeksInLocalWeekYear //=> 53
   * @type {number}
   */
  get weeksInLocalWeekYear() {
    return this.isValid ? De(
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
    const { locale: t, numberingSystem: s, calendar: n } = E.create(
      this.loc.clone(e),
      e
    ).resolvedOptions(this);
    return { locale: t, numberingSystem: s, outputCalendar: n };
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
    return this.setZone(N.instance(e), t);
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
  setZone(e, { keepLocalTime: t = !1, keepCalendarTime: s = !1 } = {}) {
    if (e = H(e, S.defaultZone), e.equals(this.zone))
      return this;
    if (e.isValid) {
      let n = this.ts;
      if (t || s) {
        const o = e.offset(this.ts), i = this.toObject();
        [n] = Ge(i, o, e);
      }
      return B(this, { ts: n, zone: e });
    } else
      return g.invalid(_e(e));
  }
  /**
   * "Set" the locale, numberingSystem, or outputCalendar. Returns a newly-constructed DateTime.
   * @param {Object} properties - the properties to set
   * @example DateTime.local(2017, 5, 25).reconfigure({ locale: 'en-GB' })
   * @return {DateTime}
   */
  reconfigure({ locale: e, numberingSystem: t, outputCalendar: s } = {}) {
    const n = this.loc.clone({ locale: e, numberingSystem: t, outputCalendar: s });
    return B(this, { loc: n });
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
    const t = rt(e, Wr), { minDaysInFirstWeek: s, startOfWeek: n } = xr(t, this.loc), o = !m(t.weekYear) || !m(t.weekNumber) || !m(t.weekday), i = !m(t.ordinal), a = !m(t.year), l = !m(t.month) || !m(t.day), c = a || l, d = t.weekYear || t.weekNumber;
    if ((c || i) && d)
      throw new ce(
        "Can't mix weekYear/weekNumber units with year/month/day or ordinals"
      );
    if (l && i)
      throw new ce("Can't mix ordinal dates with month/day");
    let h;
    o ? h = vr(
      { ...et(this.c, s, n), ...t },
      s,
      n
    ) : m(t.ordinal) ? (h = { ...this.toObject(), ...t }, m(t.day) && (h.day = Math.min(tt(h.year, h.month), h.day))) : h = wr({ ...pt(this.c), ...t });
    const [y, f] = Ge(h, this.o, this.zone);
    return B(this, { ts: y, o: f });
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
    const t = p.fromDurationLike(e);
    return B(this, Dr(this, t));
  }
  /**
   * Subtract a period of time to this DateTime and return the resulting DateTime
   * See {@link DateTime#plus}
   * @param {Duration|Object|number} duration - The amount to subtract. Either a Luxon Duration, a number of milliseconds, the object argument to Duration.fromObject()
   @return {DateTime}
   */
  minus(e) {
    if (!this.isValid) return this;
    const t = p.fromDurationLike(e).negate();
    return B(this, Dr(this, t));
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
    if (!this.isValid) return this;
    const s = {}, n = p.normalizeUnit(e);
    switch (n) {
      case "years":
        s.month = 1;
      case "quarters":
      case "months":
        s.day = 1;
      case "weeks":
      case "days":
        s.hour = 0;
      case "hours":
        s.minute = 0;
      case "minutes":
        s.second = 0;
      case "seconds":
        s.millisecond = 0;
        break;
    }
    if (n === "weeks")
      if (t) {
        const o = this.loc.getStartOfWeek(), { weekday: i } = this;
        i < o && (s.weekNumber = this.weekNumber - 1), s.weekday = o;
      } else
        s.weekday = 1;
    if (n === "quarters") {
      const o = Math.ceil(this.month / 3);
      s.month = (o - 1) * 3 + 1;
    }
    return this.set(s);
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
    return this.isValid ? E.create(this.loc.redefaultToEN(t)).formatDateTimeFromString(this, e) : kt;
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
  toLocaleString(e = Xe, t = {}) {
    return this.isValid ? E.create(this.loc.clone(t), e).formatDateTime(this) : kt;
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
    return this.isValid ? E.create(this.loc.clone(e), e).formatDateTimeParts(this) : [];
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
    suppressMilliseconds: s = !1,
    includeOffset: n = !0,
    extendedZone: o = !1
  } = {}) {
    if (!this.isValid)
      return null;
    const i = e === "extended";
    let a = xt(this, i);
    return a += "T", a += Ar(this, i, t, s, n, o), a;
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
    return this.isValid ? xt(this, e === "extended") : null;
  }
  /**
   * Returns an ISO 8601-compliant string representation of this DateTime's week date
   * @example DateTime.utc(1982, 5, 25).toISOWeekDate() //=> '1982-W21-2'
   * @return {string}
   */
  toISOWeekDate() {
    return He(this, "kkkk-'W'WW-c");
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
    includeOffset: s = !0,
    includePrefix: n = !1,
    extendedZone: o = !1,
    format: i = "extended"
  } = {}) {
    return this.isValid ? (n ? "T" : "") + Ar(
      this,
      i === "extended",
      t,
      e,
      s,
      o
    ) : null;
  }
  /**
   * Returns an RFC 2822-compatible string representation of this DateTime
   * @example DateTime.utc(2014, 7, 13).toRFC2822() //=> 'Sun, 13 Jul 2014 00:00:00 +0000'
   * @example DateTime.local(2014, 7, 13).toRFC2822() //=> 'Sun, 13 Jul 2014 00:00:00 -0400'
   * @return {string}
   */
  toRFC2822() {
    return He(this, "EEE, dd LLL yyyy HH:mm:ss ZZZ", !1);
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
    return He(this.toUTC(), "EEE, dd LLL yyyy HH:mm:ss 'GMT'");
  }
  /**
   * Returns a string representation of this DateTime appropriate for use in SQL Date
   * @example DateTime.utc(2014, 7, 13).toSQLDate() //=> '2014-07-13'
   * @return {string}
   */
  toSQLDate() {
    return this.isValid ? xt(this, !0) : null;
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
  toSQLTime({ includeOffset: e = !0, includeZone: t = !1, includeOffsetSpace: s = !0 } = {}) {
    let n = "HH:mm:ss.SSS";
    return (t || e) && (s && (n += " "), t ? n += "z" : e && (n += "ZZ")), He(this, n, !0);
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
    return this.isValid ? this.toISO() : kt;
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
  diff(e, t = "milliseconds", s = {}) {
    if (!this.isValid || !e.isValid)
      return p.invalid("created by diffing an invalid DateTime");
    const n = { locale: this.locale, numberingSystem: this.numberingSystem, ...s }, o = Kn(t).map(p.normalizeUnit), i = e.valueOf() > this.valueOf(), a = i ? this : e, l = i ? e : this, c = ri(a, l, o, n);
    return i ? c.negate() : c;
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
    return this.isValid ? x.fromDateTimes(this, e) : this;
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
  hasSame(e, t, s) {
    if (!this.isValid) return !1;
    const n = e.valueOf(), o = this.setZone(e.zone, { keepLocalTime: !0 });
    return o.startOf(t, s) <= n && n <= o.endOf(t, s);
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
    const t = e.base || g.fromObject({}, { zone: this.zone }), s = e.padding ? this < t ? -e.padding : e.padding : 0;
    let n = ["years", "months", "days", "hours", "minutes", "seconds"], o = e.unit;
    return Array.isArray(e.unit) && (n = e.unit, o = void 0), Vr(t, this.plus(s), {
      ...e,
      numeric: "always",
      units: n,
      unit: o
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
    return this.isValid ? Vr(e.base || g.fromObject({}, { zone: this.zone }), this, {
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
      throw new O("min requires all arguments be DateTimes");
    return Sr(e, (t) => t.valueOf(), Math.min);
  }
  /**
   * Return the max of several date times
   * @param {...DateTime} dateTimes - the DateTimes from which to choose the maximum
   * @return {DateTime} the max DateTime, or undefined if called with no argument
   */
  static max(...e) {
    if (!e.every(g.isDateTime))
      throw new O("max requires all arguments be DateTimes");
    return Sr(e, (t) => t.valueOf(), Math.max);
  }
  // MISC
  /**
   * Explain how a string would be parsed by fromFormat()
   * @param {string} text - the string to parse
   * @param {string} fmt - the format the string is expected to be in (see description)
   * @param {Object} options - options taken by fromFormat()
   * @return {Object}
   */
  static fromFormatExplain(e, t, s = {}) {
    const { locale: n = null, numberingSystem: o = null } = s, i = v.fromOpts({
      locale: n,
      numberingSystem: o,
      defaultToEN: !0
    });
    return Ls(i, e, t);
  }
  /**
   * @deprecated use fromFormatExplain instead
   */
  static fromStringExplain(e, t, s = {}) {
    return g.fromFormatExplain(e, t, s);
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
  static buildFormatParser(e, t = {}) {
    const { locale: s = null, numberingSystem: n = null } = t, o = v.fromOpts({
      locale: s,
      numberingSystem: n,
      defaultToEN: !0
    });
    return new Rs(o, e);
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
  static fromFormatParser(e, t, s = {}) {
    if (m(e) || m(t))
      throw new O(
        "fromFormatParser requires an input string and a format parser"
      );
    const { locale: n = null, numberingSystem: o = null } = s, i = v.fromOpts({
      locale: n,
      numberingSystem: o,
      defaultToEN: !0
    });
    if (!i.equals(t.locale))
      throw new O(
        `fromFormatParser called with a locale of ${i}, but the format parser was created for ${t.locale}`
      );
    const { result: a, zone: l, specificOffset: c, invalidReason: d } = t.explainFromTokens(e);
    return d ? g.invalid(d) : ie(
      a,
      l,
      s,
      `format ${t.format}`,
      e,
      c
    );
  }
  // FORMAT PRESETS
  /**
   * {@link DateTime#toLocaleString} format like 10/14/1983
   * @type {Object}
   */
  static get DATE_SHORT() {
    return Xe;
  }
  /**
   * {@link DateTime#toLocaleString} format like 'Oct 14, 1983'
   * @type {Object}
   */
  static get DATE_MED() {
    return qr;
  }
  /**
   * {@link DateTime#toLocaleString} format like 'Fri, Oct 14, 1983'
   * @type {Object}
   */
  static get DATE_MED_WITH_WEEKDAY() {
    return Sn;
  }
  /**
   * {@link DateTime#toLocaleString} format like 'October 14, 1983'
   * @type {Object}
   */
  static get DATE_FULL() {
    return Yr;
  }
  /**
   * {@link DateTime#toLocaleString} format like 'Tuesday, October 14, 1983'
   * @type {Object}
   */
  static get DATE_HUGE() {
    return Gr;
  }
  /**
   * {@link DateTime#toLocaleString} format like '09:30 AM'. Only 12-hour if the locale is.
   * @type {Object}
   */
  static get TIME_SIMPLE() {
    return Jr;
  }
  /**
   * {@link DateTime#toLocaleString} format like '09:30:23 AM'. Only 12-hour if the locale is.
   * @type {Object}
   */
  static get TIME_WITH_SECONDS() {
    return Br;
  }
  /**
   * {@link DateTime#toLocaleString} format like '09:30:23 AM EDT'. Only 12-hour if the locale is.
   * @type {Object}
   */
  static get TIME_WITH_SHORT_OFFSET() {
    return Kr;
  }
  /**
   * {@link DateTime#toLocaleString} format like '09:30:23 AM Eastern Daylight Time'. Only 12-hour if the locale is.
   * @type {Object}
   */
  static get TIME_WITH_LONG_OFFSET() {
    return Qr;
  }
  /**
   * {@link DateTime#toLocaleString} format like '09:30', always 24-hour.
   * @type {Object}
   */
  static get TIME_24_SIMPLE() {
    return Xr;
  }
  /**
   * {@link DateTime#toLocaleString} format like '09:30:23', always 24-hour.
   * @type {Object}
   */
  static get TIME_24_WITH_SECONDS() {
    return es;
  }
  /**
   * {@link DateTime#toLocaleString} format like '09:30:23 EDT', always 24-hour.
   * @type {Object}
   */
  static get TIME_24_WITH_SHORT_OFFSET() {
    return ts;
  }
  /**
   * {@link DateTime#toLocaleString} format like '09:30:23 Eastern Daylight Time', always 24-hour.
   * @type {Object}
   */
  static get TIME_24_WITH_LONG_OFFSET() {
    return rs;
  }
  /**
   * {@link DateTime#toLocaleString} format like '10/14/1983, 9:30 AM'. Only 12-hour if the locale is.
   * @type {Object}
   */
  static get DATETIME_SHORT() {
    return ss;
  }
  /**
   * {@link DateTime#toLocaleString} format like '10/14/1983, 9:30:33 AM'. Only 12-hour if the locale is.
   * @type {Object}
   */
  static get DATETIME_SHORT_WITH_SECONDS() {
    return ns;
  }
  /**
   * {@link DateTime#toLocaleString} format like 'Oct 14, 1983, 9:30 AM'. Only 12-hour if the locale is.
   * @type {Object}
   */
  static get DATETIME_MED() {
    return os;
  }
  /**
   * {@link DateTime#toLocaleString} format like 'Oct 14, 1983, 9:30:33 AM'. Only 12-hour if the locale is.
   * @type {Object}
   */
  static get DATETIME_MED_WITH_SECONDS() {
    return is;
  }
  /**
   * {@link DateTime#toLocaleString} format like 'Fri, 14 Oct 1983, 9:30 AM'. Only 12-hour if the locale is.
   * @type {Object}
   */
  static get DATETIME_MED_WITH_WEEKDAY() {
    return Tn;
  }
  /**
   * {@link DateTime#toLocaleString} format like 'October 14, 1983, 9:30 AM EDT'. Only 12-hour if the locale is.
   * @type {Object}
   */
  static get DATETIME_FULL() {
    return as;
  }
  /**
   * {@link DateTime#toLocaleString} format like 'October 14, 1983, 9:30:33 AM EDT'. Only 12-hour if the locale is.
   * @type {Object}
   */
  static get DATETIME_FULL_WITH_SECONDS() {
    return ls;
  }
  /**
   * {@link DateTime#toLocaleString} format like 'Friday, October 14, 1983, 9:30 AM Eastern Daylight Time'. Only 12-hour if the locale is.
   * @type {Object}
   */
  static get DATETIME_HUGE() {
    return cs;
  }
  /**
   * {@link DateTime#toLocaleString} format like 'Friday, October 14, 1983, 9:30:33 AM Eastern Daylight Time'. Only 12-hour if the locale is.
   * @type {Object}
   */
  static get DATETIME_HUGE_WITH_SECONDS() {
    return us;
  }
}
function Te(r) {
  if (g.isDateTime(r))
    return r;
  if (r && r.valueOf && Y(r.valueOf()))
    return g.fromJSDate(r);
  if (r && typeof r == "object")
    return g.fromObject(r);
  throw new O(
    `Unknown datetime argument: ${r}, of type ${typeof r}`
  );
}
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const Yt = (r) => (e, t) => {
  t !== void 0 ? t.addInitializer(() => {
    customElements.define(r, e);
  }) : customElements.define(r, e);
};
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const xi = { attribute: !0, type: String, converter: Ke, reflect: !1, hasChanged: Ft }, Si = (r = xi, e, t) => {
  const { kind: s, metadata: n } = t;
  let o = globalThis.litPropertyMetadata.get(n);
  if (o === void 0 && globalThis.litPropertyMetadata.set(n, o = /* @__PURE__ */ new Map()), o.set(t.name, r), s === "accessor") {
    const { name: i } = t;
    return { set(a) {
      const l = e.get.call(this);
      e.set.call(this, a), this.requestUpdate(i, l, r);
    }, init(a) {
      return a !== void 0 && this.P(i, void 0, r), a;
    } };
  }
  if (s === "setter") {
    const { name: i } = t;
    return function(a) {
      const l = this[i];
      e.call(this, a), this.requestUpdate(i, l, r);
    };
  }
  throw Error("Unsupported decorator location: " + s);
};
function ut(r) {
  return (e, t) => typeof t == "object" ? Si(r, e, t) : ((s, n, o) => {
    const i = n.hasOwnProperty(o);
    return n.constructor.createProperty(o, i ? { ...s, wrapped: !0 } : s), i ? Object.getOwnPropertyDescriptor(n, o) : void 0;
  })(r, e, t);
}
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
function Ti(r) {
  return ut({ ...r, state: !0, attribute: !1 });
}
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const $i = (r, e, t) => (t.configurable = !0, t.enumerable = !0, Reflect.decorate && typeof e != "object" && Object.defineProperty(r, e, t), t);
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
function Gt(r, e) {
  return (t, s, n) => {
    const o = (i) => {
      var a;
      return ((a = i.renderRoot) == null ? void 0 : a.querySelector(r)) ?? null;
    };
    return $i(t, s, { get() {
      return o(this);
    } });
  };
}
class Hs {
  constructor() {
    this.job_result = {}, this.job_progress = {}, this.actions = {};
  }
  from_dict(e) {
    return this.description = e.description, this.workstation_id = e.id, this.state_text = e.state_text, this.state_description = e.state_description, this.disabled = e.disabled, this.recording_group = e.recording_group ? e.recording_group : "unassigned", this.workstation_class = e.workstation_class, this.icon_code = "icon_code" in e ? e.icon_code : "", this.icon_url = "icon_url" in e ? e.icon_url : "", this.job_status = "job_status" in e ? e.job_status : "", this.job_status_code = "job_status_code" in e ? e.job_status_code : "", this.job_result = "job_result" in e ? e.job_result : "", this.job_progress = "job_progress" in e ? e.job_progress : {}, this.actions = "actions" in e ? e.actions : {}, this.meta = "meta" in e ? e.meta : {}, this;
  }
}
function St(r, e) {
  kioskErrorToast(r, e);
}
function _i(r, e, t, s = {}, n = "") {
  kioskYesNoToast(r, e, t, s, n);
}
function Oi(r, e) {
  kioskOpenModalDialog(r, e);
}
const Tt = "MSG_NETWORK_ERROR";
class Ei {
  constructor(e, t, s = "") {
    this.messageId = e, this.headline = t, this.body = s;
  }
}
function $t(r, e, t, s = "") {
  let n = new Ei(
    e,
    t,
    s
  );
  r.dispatchEvent(new CustomEvent(
    "send-message",
    { bubbles: !0, composed: !0, detail: n }
  ));
}
const qs = 1, It = 20, Ni = 21;
function Ys(r, e, t = "", s = null) {
  if (t && (t += ": "), e.response) {
    if (e.response.status == 403 || e.response.status == 401) {
      $t(
        r,
        Tt,
        `${t}You are not logged in properly or your session has timed out`,
        '<a href="/logout">Please log in again.</a>'
      );
      return;
    }
    s ? s(e) : $t(
      r,
      Tt,
      `${t}Kiosk server responded with an error.`,
      `(${e.response.statusText}). 
                The server might be down or perhaps you are not logged in properly.`
    );
  } else {
    $t(
      r,
      Tt,
      `${t}Kiosk server responded with a network error.`,
      `(${e}). 
            The server might be down or perhaps you are not logged in properly.`
    );
    return;
  }
}
function Ci(r) {
  window.location.href = r;
}
const Mi = '.col-bg-body-lighter{background-color:var(--col-bg-body-lighter)}.col-bg-body{background-color:var(--col-bg-body)}.col-bg-body-darker{background-color:var(--col-bg-body-darker)}.col-bg-1-lighter{background-color:var(--col-bg-1-lighter)}.col-bg-1{background-color:var(--col-bg-1)}.col-bg-1-darker{background-color:var(--col-bg-1-darker)}.col-bg-1-input{background-color:var(--col-bg-1-input)}.col-primary-bg-1{background-color:var(--col-primary-bg-1)}.col-accent-bg-1{background-color:var(--col-accent-bg-1)}.col-success-bg-1{background-color:var(--col-success-bg-1)}.col-warning-bg-1{background-color:var(--col-warning-bg-1)}.col-error-bg-1{background-color:var(--col-error-bg-1)}.col-bg-2-lighter{background-color:var(--col-bg-2-lighter)}.col-bg-2{background-color:var(--col-bg-2)}.col-bg-2-darker{background-color:var(--col-bg-2-darker)}.col-bg-2-button{background-color:var(--col-bg-2-button)}.col-bg-2-input{background-color:var(--col-bg-2-input)}.col-primary-bg-2{background-color:var(--col-primary-bg-2)}.col-accent-bg-2{background-color:var(--col-accent-bg-2)}.col-success-bg-2{background-color:var(--col-success-bg-2)}.col-warning-bg-2{background-color:var(--col-warning-bg-2)}.col-error-bg-2{background-color:var(--col-error-bg-2)}.col-bg-3-lighter{background-color:var(--col-bg-3-lighter)}.col-bg-3{background-color:var(--col-bg-3)}.col-bg-3-darker{background-color:var(--col-bg-3-darker)}.col-bg-3-button{background-color:var(--col-bg-3-button)}.col-bg-3-input{background-color:var(--col-bg-3-input)}.col-primary-bg-3{background-color:var(--col-primary-bg-3)}.col-accent-bg-3{background-color:var(--col-accent-bg-3)}.col-success-bg-3{background-color:var(--col-success-bg-3)}.col-warning-bg-3{background-color:var(--col-warning-bg-3)}.col-error-bg-3{background-color:var(--col-error-bg-3)}.col-bg-ack-lighter{background-color:var(--col-bg-ack-lighter)}.col-bg-ack{background-color:var(--col-bg-ack)}.col-bg-ack-darker{background-color:var(--col-bg-ack-darker)}.col-primary-bg-ack{background-color:var(--col-primary-bg-ack)}.col-accent-bg-ack{background-color:var(--col-accent-bg-ack)}.col-bg-att-lighter{background-color:var(--col-bg-att-lighter)}.col-bg-att{background-color:var(--col-bg-att)}.col-bg-att-darker{background-color:var(--col-bg-att-darker)}.col-primary-bg-att{background-color:var(--col-primary-bg-att)}.col-accent-bg-att{background-color:var(--col-accent-bg-att)}.col-bg-alert-lighter{background-color:var(--col-bg-alert-lighter)}.col-bg-alert{background-color:var(--col-bg-alert)}.col-bg-alert-darker{background-color:var(--col-bg-alert-darker)}.col-primary-bg-alert{background-color:var(--col-primary-bg-alert)}.col-accent-bg-alert{background-color:var(--col-accent-bg-alert)}.col-bg-btn-lighter{background-color:var(--col-bg-btn-lighter)}.col-bg-btn{background-color:var(--col-bg-btn)}.col-bg-btn-darker{background-color:var(--col-bg-btn-darker)}.col-primary-bg-btn{background-color:var(--col-primary-bg-btn)}.col-accent-bg-btn{background-color:var(--col-accent-bg-btn)}.pattern-diagonal-stripes-sm{background:repeating-linear-gradient(45deg,transparent,transparent 10px,currentColor 10px,currentColor 20px)}.pattern-dots-lg{background-image:radial-gradient(currentColor 1.5px,transparent 1.5px);background-size:15px 15px}.pattern-dots-md{background-image:radial-gradient(currentColor 1px,transparent 1px);background-size:8px 8px}.pattern-dots-medium-dense{background-image:radial-gradient(currentColor .5px,transparent .5px);background-size:3px 3px}.pattern-dots-sm{background-image:radial-gradient(currentColor .5px,transparent .5px);background-size:5px 5px}.pattern-cross-dots-md,.imagelist-background{background-image:radial-gradient(currentColor .7px,transparent 1px),radial-gradient(currentColor .7px,transparent 1px);background-size:6.5px 6.5px;background-position:0 0,3.5px 3.5px}.imagelist-background{background-color:#fff9;background-blend-mode:overlay}p,div{padding:0;margin:0;border:0px;-webkit-user-select:text;user-select:text}select{-webkit-user-select:none;user-select:none}.fa,.fas{font-family:"Font Awesome 5 Free";font-weight:900;font-style:normal}.fa-trash:before{content:""}.fa-view-grid:before{content:""}.fa-reload:before{content:""}.fa-view-list:before{content:""}.fa-camera:before{content:""}.fa-view-image:before{content:""}.fa-check:before{content:""}.fa-bug:before{content:""}.fa-lightbulb:before{content:""}p,div{-webkit-user-select:none;user-select:none}.workstation-card{background:linear-gradient(to right bottom,var(--col-bg-1-darker),var(--col-bg-1-lighter));font-family:var(--standard-text-font);padding:.5em;border:2px solid var(--col-bg-1-darker);border-radius:5px;box-shadow:3px 3px 4px -2px var(--col-bg-1-darker);cursor:pointer}.workstation-card:hover,.workstation-cardfocus{background:var(--col-bg-1-lighter);border:2px solid var(--col-bg-btn);box-shadow:0 0 6px 1px var(--col-bg-btn)}.workstation-card:active{background:var(--col-bg-1-darker);border:2px solid var(--col-bg-body);box-shadow:0 0 6px 1px var(--col-bg-body)}.workstation-card.workstation-disabled{opacity:.75}.card-header{display:flex;flex-direction:row;align-items:center;padding:.25em;margin-bottom:.25em;background-color:var(--col-bg-1-darker)}.card-icon{font-size:32px;line-height:36px;color:var(--col-primary-bg-1);width:36px;height:36px}.title{margin-left:1em;font-weight:700;color:var(--col-primary-bg-1);display:flex;flex-direction:row;justify-content:space-between;width:100%;white-space:pre-wrap}.title span{display:block}.title span:nth-child(1){color:var(--col-accent-bg-1)}.title span:nth-child(2){padding-right:.5em}.title-state{background-color:var(--col-bg-ack);color:var(--col-primary-bg-ack);text-align:center;padding:.25em 0}.title-state.processing{background-color:var(--col-bg-att);color:var(--col-primary-bg-att)}.title-state.error{background-color:var(--col-bg-alert);color:var(--col-primary-bg-alert)}.kiosk-btn{border-radius:5px;border-style:solid;border-width:2px;background-color:var(--col-bg-btn);color:var(--col-primary-bg-btn);border-color:var(--col-bg-btn-darker);cursor:pointer;white-space:nowrap}.kiosk-btn:hover,.kiosk-btn:focus{outline:none;background-color:var(--col-bg-btn-lighter)}.kiosk-btn:active{margin-bottom:0;margin-top:2px;padding-left:2px;color:var(--col-primary-bg-btn);background-color:var(--col-bg-ack);border-color:var(--col-bg-ack-darker)}.kiosk-btn *{user-select:none;-moz-user-select:none;-webkit-user-select:none}.card-body{display:flex;flex-direction:row;margin-top:.5em}@media only screen and (max-width : 900px){.card-body{flex-direction:column}}.card-body .ws-info{display:flex;flex-direction:column;justify-content:center;height:100%}.card-body .ws-info>div{text-align:center}.card-body .job-info{display:flex;flex-direction:row;align-items:center;margin-left:.25em}@media only screen and (max-width : 900px){.card-body .job-info{margin-top:.25em;margin-left:0}}.card-body .job-info.error{font-size:1em}.card-body .job-info i{margin-right:.5em;margin-left:.2em;font-size:1.5em;color:var(--col-accent-bg-btn)}sl-progress-ring{min-width:48px;height:48px;align-self:center;margin-left:.5em;margin-right:.5em}.card-body>div{background-color:var(--col-bg-2);padding:.25em;min-height:3em;flex-basis:100%}.job-warnings{display:flex;flex-direction:row;align-items:center;justify-content:space-between;color:var(--col-accent-bg-2);text-align:left}.job-warnings p{width:100%;text-align:center}.job-warnings button{width:auto;padding-right:.5em}.spacer{width:100%;height:2px;background-color:var(--col-bg-1);margin:.5em 0}.job-cancelled-label{color:var(--col-error-bg-2)}', Ii = ":host{--track-color: var(--col-bg-2-lighter);--indicator-color: var(--col-accent-bg-2);--stroke-width: 6px;display:inline-flex}.progress-ring{display:inline-flex;align-items:center;justify-content:center;position:relative}.progress-ring__image{transform-origin:50% 50%}.progress-ring__track{stroke:var(--track-color)}.progress-ring__indicator{stroke:var(--indicator-color);transition:.35s stroke-dashoffset,.35s stroke}.progress-ring__label{display:flex;align-items:center;justify-content:center;position:absolute;top:0;left:0;width:100%;font-size:.9em;text-align:center;-webkit-user-select:none;user-select:none}.spinner{display:inline-block;width:100%;border-radius:50%;border:solid var(--stroke-width) var(--col-bg-2-lighter);border-top-color:var(--col-accent-bg-2);border-right-color:var(--col-accent-bg-2);animation:1s linear infinite spin}@keyframes spin{0%{transform:rotate(0)}to{transform:rotate(360deg)}}";
var Di = Object.defineProperty, Ai = Object.getOwnPropertyDescriptor, te = (r, e, t, s) => {
  for (var n = s > 1 ? void 0 : s ? Ai(e, t) : e, o = r.length - 1, i; o >= 0; o--)
    (i = r[o]) && (n = (s ? i(e, t, n) : i(n)) || n);
  return s && n && Di(e, t, n), n;
};
let L = class extends ue {
  constructor() {
    super(...arguments), this.size = 128, this.strokeWidth = 4;
  }
  firstUpdated() {
  }
  // @watch('percentage')
  // handlePercentageChange() {
  //   this.updateProgress();
  // }
  updated() {
    if (this.percentage > -1) {
      const e = this.indicator.r.baseVal.value * 2 * Math.PI, t = e - this.percentage / 100 * e;
      this.ring.style.transform = `rotate(-90deg) translateY(-${this.strokeWidth / 2}px)`, this.label.style.transform = `rotate(90deg) translateX(${this.strokeWidth * 2}px)`, this.indicator.style.strokeDasharray = `${e} ${e}`, this.indicator.style.strokeDashoffset = `${t}`;
    }
  }
  render() {
    return this.percentage == -1 ? b` <span class="spinner" aria-busy="true" aria-live="polite"></span> ` : b`
        <div part="base" class="progress-ring">
          <svg class="progress-ring__image" width=${this.size} height=${this.size}>
            <circle
              class="progress-ring__track"
              stroke-width="${this.strokeWidth}"
              stroke-linecap="round"
              fill="transparent"
              r=${this.size / 2 - this.strokeWidth}
              cx=${this.size / 2}
              cy=${this.size / 2}
            ></circle>
  
            <circle
              class="progress-ring__indicator"
              stroke-width="${this.strokeWidth}"
              stroke-linecap="round"
              fill="transparent"
              r=${this.size / 2 - this.strokeWidth}
              cx=${this.size / 2}
              cy=${this.size / 2}
            ></circle>
          </svg>
  
          <span part="label" class="progress-ring__label">
            <slot></slot>
          </span>
        </div>
      `;
  }
};
L.styles = Ae(Ii);
te([
  Gt(".progress-ring")
], L.prototype, "ring", 2);
te([
  Gt(".progress-ring__indicator")
], L.prototype, "indicator", 2);
te([
  Gt(".progress-ring__label")
], L.prototype, "label", 2);
te([
  ut({ type: Number })
], L.prototype, "size", 2);
te([
  ut({ attribute: "stroke-width", type: Number })
], L.prototype, "strokeWidth", 2);
te([
  ut({ type: Number, reflect: !0 })
], L.prototype, "percentage", 2);
L = te([
  Yt("sl-progress-ring")
], L);
var Wi = Object.defineProperty, Fi = Object.getOwnPropertyDescriptor, Vi = (r, e, t, s) => {
  for (var n = s > 1 ? void 0 : s ? Fi(e, t) : e, o = r.length - 1, i; o >= 0; o--)
    (i = r[o]) && (n = (s ? i(e, t, n) : i(n)) || n);
  return s && n && Wi(e, t, n), n;
};
let Dt = class extends zt {
  constructor() {
    super(), this.fetching = !1, this.fetch_error = "", this.workstation_data = new Hs(), this.percentage = -1, this.showJobInfo = !1, this.jobMessage = "", this.jobError = "", this.jobHasWarnings = !1, this.jobIsRunning = !1, this.jobGotCanceled = !1, this._init();
  }
  static get properties() {
    return {
      ...super.properties,
      fetching: { type: Boolean },
      workstation_id: { type: String },
      workstation_data: { type: Object }
    };
  }
  _init() {
  }
  cardClicked(r) {
    if (this.jobIsRunning)
      this.askCancelJob();
    else {
      let e = this.apiContext.getKioskRoute(
        `${this.workstation_data.workstation_class.toLowerCase()}.workstation_actions`
      );
      Oi(`${e}/${this.workstation_id}`, {
        closeOnBgClick: !1,
        // focus: "#backup-dir",
        showCloseBtn: !0,
        callbacks: {
          // open: () => {
          //     alert("message!")
          // },
          close: () => {
            this.dispatchEvent(
              new CustomEvent("fetch-workstations", {
                bubbles: !0,
                cancelable: !0
              })
            );
          },
          ajaxFailed: () => {
            $.magnificPopup.close(), St(
              'Sorry, there is no access to the actions panel of this workstation. Presumably your session has timed out <a href="/logout">Try a fresh log in.</a>'
            );
          }
        }
      });
    }
  }
  showLog(r) {
    r.stopPropagation(), Ci(this.workstation_data.actions.log);
  }
  apiRender() {
    return this._calc_job_progress(), b`
            <div
                id="${this.workstation_id}"
                class="workstation-card ${this.workstation_data.disabled ? "workstation-disabled" : void 0}"
                @click="${this.cardClicked}">
                <div class="card-header">
                    ${this.workstation_data.icon_code ? b` <div class="card-icon">
                              <i class="fas">${this.workstation_data.icon_code}</i>
                          </div>` : this.workstation_data.icon_url ? b` <div
                              class="card-icon"
                              style="background-image:url(${this.workstation_data.icon_url})"
                          ></div>` : b` <div class="card-icon">
                              <i class="fas"></i>
                          </div>`}

                    <div class="title">
                        <span>${this.workstation_data.description}</span>
                        <span>[${this.workstation_id}]</span>
                    </div>
                </div>
                ${this.showJobInfo && (!this.jobHasWarnings || this.jobError) ? b`
                          ${this.jobError ? b` <div class="title-state error">${this.jobError}</div>` : b` <div class="title-state processing">
                                    ${this.workstation_data.job_status_code == qs ? "pending..." : "processing..."}
                                </div>`}
                      ` : b` <div class="title-state">${this.workstation_data.state_text}</div>`}

                <div class="card-body">
                    ${this.jobIsRunning ? void 0 : b` <div class="ws-info">
                              <div class="job-warnings">
                                  ${this.jobHasWarnings ? b`<p>The last task was successful but returned warnings</p>` : b`${this.jobGotCanceled ? b`<p>
                                                  <span class="job-cancelled-label">The last task got cancelled</span>
                                              </p>` : void 0}`}
                                  ${this.jobError ? b`<p>There is more information available.</p>` : void 0}
                                  ${this.jobError || this.jobHasWarnings ? b` <button @click=${this.showLog} class="kiosk-btn job-info error">
                                            <i class="fas fa-bug"></i>
                                            <div>See details</div>
                                        </button>` : void 0}
                              </div>
                              ${this.jobError || this.jobHasWarnings ? b` <div class="spacer"></div>` : void 0}
                              <div>
                                  ${this.workstation_data.disabled ? b`This workstation is disabled. Please click to reactivate it.` : b`${this.workstation_data.state_description}`}
                              </div>
                          </div>`}
                    ${this.showJobInfo && !this.jobError && !this.jobHasWarnings ? b` <div class="job-info">
                              <sl-progress-ring percentage="${this.percentage}" size="54" stroke-width="6">
                                  ${this.percentage > 0 ? b`${this.percentage}%` : void 0}
                              </sl-progress-ring>
                              <div>${this.jobMessage}</div>
                          </div>` : void 0}
                </div>
            </div>
        `;
  }
  _calc_job_progress() {
    const r = this.workstation_data.job_progress;
    this.jobError = "", this.jobHasWarnings = !1, this.jobGotCanceled = !1, "job_status_code" in this.workstation_data && this.workstation_data.job_status_code ? this.workstation_data.job_status_code < It ? (this.showJobInfo = !0, "progress" in r && r.progress ? (this.percentage = r.progress, this.jobMessage = r.message) : (this.percentage = -1, this.jobMessage = r.message), this.jobIsRunning = !0) : (this.jobIsRunning = !1, "success" in this.workstation_data.job_result ? this.workstation_data.job_result.success ? (this.percentage = 100, this.jobMessage = "finished", this.workstation_data.job_result.has_warnings && (this.jobHasWarnings = !0), this.showJobInfo = this.jobHasWarnings) : (this.percentage = r.progress, this.jobMessage = "click to see details", this.showJobInfo = !0, this.jobError = this.workstation_data.job_result.message) : this.workstation_data.job_status_code == Ni ? (this.percentage = 0, this.showJobInfo = !1, this.jobIsRunning = !1, this.jobGotCanceled = !0) : (this.percentage = r.progress, this.jobMessage = this.workstation_data.job_result.message)) : (this.percentage = 0, this.showJobInfo = !1, this.jobMessage = "", this.jobIsRunning = !1);
  }
  askCancelJob() {
    _i(
      `${this.workstation_data.description} is currently on the job. <br>
        Do you want to cancel that job?`,
      () => {
        this.cancelJob();
      },
      () => {
        this.triggerReloadWorkstations();
      },
      {
        backgroundColor: "var(--col-bg-att)",
        messageColor: "var(--col-primary-bg-att)",
        iconColor: "var(--col-accent-bg-att)"
      }
    );
  }
  triggerReloadWorkstations() {
    this.dispatchEvent(
      new CustomEvent("fetch-workstations", {
        bubbles: !0,
        cancelable: !1
      })
    );
  }
  cancelJob() {
    this.apiContext.fetchFromApi("syncmanager", `workstation/${this.workstation_id}/job`, {
      method: "DELETE",
      caller: "workstationcard.cancelJob"
    }).then((r) => {
      r.result_msg !== "ok" && St(`It was not possible to cancel the job: <strong>${r.result_msg}</strong>`), this.triggerReloadWorkstations();
    }).catch((r) => {
      Ys(this, r, "workstationlist.fetchWorkstations", () => {
        St(`It was not possible to cancel the job because of an error ${r}.`);
      });
    });
  }
  // onAfterEnter(location: any, commands: any, router: any) {
  //     console.log("OnAfterEnter", location, commands, router);
  //     // this._installSyncEvents();
  // }
};
Dt.styles = Ae(Mi);
Dt = Vi([
  Yt("workstation-card")
], Dt);
const zi = '.col-bg-body-lighter{background-color:var(--col-bg-body-lighter)}.col-bg-body{background-color:var(--col-bg-body)}.col-bg-body-darker{background-color:var(--col-bg-body-darker)}.col-bg-1-lighter{background-color:var(--col-bg-1-lighter)}.col-bg-1{background-color:var(--col-bg-1)}.col-bg-1-darker{background-color:var(--col-bg-1-darker)}.col-bg-1-input{background-color:var(--col-bg-1-input)}.col-primary-bg-1{background-color:var(--col-primary-bg-1)}.col-accent-bg-1{background-color:var(--col-accent-bg-1)}.col-success-bg-1{background-color:var(--col-success-bg-1)}.col-warning-bg-1{background-color:var(--col-warning-bg-1)}.col-error-bg-1{background-color:var(--col-error-bg-1)}.col-bg-2-lighter{background-color:var(--col-bg-2-lighter)}.col-bg-2{background-color:var(--col-bg-2)}.col-bg-2-darker{background-color:var(--col-bg-2-darker)}.col-bg-2-button{background-color:var(--col-bg-2-button)}.col-bg-2-input{background-color:var(--col-bg-2-input)}.col-primary-bg-2{background-color:var(--col-primary-bg-2)}.col-accent-bg-2{background-color:var(--col-accent-bg-2)}.col-success-bg-2{background-color:var(--col-success-bg-2)}.col-warning-bg-2{background-color:var(--col-warning-bg-2)}.col-error-bg-2{background-color:var(--col-error-bg-2)}.col-bg-3-lighter{background-color:var(--col-bg-3-lighter)}.col-bg-3{background-color:var(--col-bg-3)}.col-bg-3-darker{background-color:var(--col-bg-3-darker)}.col-bg-3-button{background-color:var(--col-bg-3-button)}.col-bg-3-input{background-color:var(--col-bg-3-input)}.col-primary-bg-3{background-color:var(--col-primary-bg-3)}.col-accent-bg-3{background-color:var(--col-accent-bg-3)}.col-success-bg-3{background-color:var(--col-success-bg-3)}.col-warning-bg-3{background-color:var(--col-warning-bg-3)}.col-error-bg-3{background-color:var(--col-error-bg-3)}.col-bg-ack-lighter{background-color:var(--col-bg-ack-lighter)}.col-bg-ack{background-color:var(--col-bg-ack)}.col-bg-ack-darker{background-color:var(--col-bg-ack-darker)}.col-primary-bg-ack{background-color:var(--col-primary-bg-ack)}.col-accent-bg-ack{background-color:var(--col-accent-bg-ack)}.col-bg-att-lighter{background-color:var(--col-bg-att-lighter)}.col-bg-att{background-color:var(--col-bg-att)}.col-bg-att-darker{background-color:var(--col-bg-att-darker)}.col-primary-bg-att{background-color:var(--col-primary-bg-att)}.col-accent-bg-att{background-color:var(--col-accent-bg-att)}.col-bg-alert-lighter{background-color:var(--col-bg-alert-lighter)}.col-bg-alert{background-color:var(--col-bg-alert)}.col-bg-alert-darker{background-color:var(--col-bg-alert-darker)}.col-primary-bg-alert{background-color:var(--col-primary-bg-alert)}.col-accent-bg-alert{background-color:var(--col-accent-bg-alert)}.col-bg-btn-lighter{background-color:var(--col-bg-btn-lighter)}.col-bg-btn{background-color:var(--col-bg-btn)}.col-bg-btn-darker{background-color:var(--col-bg-btn-darker)}.col-primary-bg-btn{background-color:var(--col-primary-bg-btn)}.col-accent-bg-btn{background-color:var(--col-accent-bg-btn)}.pattern-diagonal-stripes-sm,.recording-group-background{background:repeating-linear-gradient(45deg,transparent,transparent 10px,currentColor 10px,currentColor 20px)}.pattern-dots-lg{background-image:radial-gradient(currentColor 1.5px,transparent 1.5px);background-size:15px 15px}.pattern-dots-md{background-image:radial-gradient(currentColor 1px,transparent 1px);background-size:8px 8px}.pattern-dots-medium-dense{background-image:radial-gradient(currentColor .5px,transparent .5px);background-size:3px 3px}.pattern-dots-sm{background-image:radial-gradient(currentColor .5px,transparent .5px);background-size:5px 5px}.pattern-cross-dots-md,.imagelist-background{background-image:radial-gradient(currentColor .7px,transparent 1px),radial-gradient(currentColor .7px,transparent 1px);background-size:6.5px 6.5px;background-position:0 0,3.5px 3.5px}.imagelist-background{background-color:#fff9;background-blend-mode:overlay}.fa,.fas{font-family:"Font Awesome 5 Free";font-weight:900;font-style:normal}.fa-trash:before{content:""}.fa-view-grid:before{content:""}.fa-reload:before{content:""}.fa-view-list:before{content:""}.fa-camera:before{content:""}.fa-view-image:before{content:""}.fa-check:before{content:""}.fa-bug:before{content:""}.fa-lightbulb:before{content:""}p,div{padding:0;margin:0;border:0px;-webkit-user-select:text;user-select:text}select{-webkit-user-select:none;user-select:none}.kiosk-btn{display:grid;place-content:center;border-radius:5px;border-style:solid;border-width:2px;background:var(--col-bg-btn);color:var(--col-primary-bg-btn);border-color:var(--col-bg-btn-darker);cursor:pointer;white-space:nowrap}.kiosk-btn:hover,.kiosk-btn:focus{outline:none;background-color:var(--col-bg-btn-lighter)}.kiosk-btn:active{margin-bottom:0;margin-top:2px;padding-left:2px;color:var(--col-primary-bg-btn);background-color:var(--col-bg-ack);border-color:var(--col-bg-ack-darker)}.kiosk-btn *{user-select:none;-moz-user-select:none;-webkit-user-select:none}.recording-group{display:block;flex-direction:column;margin:1em .5em 2em 0}.recording-group-header{width:20ch;border-top-right-radius:15px;background:linear-gradient(to right bottom,var(--col-bg-1-darker),var(--col-bg-1-lighter));background-color:#ffffffe6;background-blend-mode:color;padding:5px;font-weight:700}.recording-group-body{position:relative;display:grid;grid-template-columns:1fr 1fr;column-gap:1em;row-gap:1em;padding:1em}@media only screen and (max-width : 700px){.recording-group-body{grid-template-columns:1fr}}.recording-group-background{position:absolute;width:100%;height:100%;border-radius:15px;color:var(--col-bg-1);opacity:10%;z-index:-1}.one-recording-group{display:grid;grid-template-columns:1fr 1fr;column-gap:1em;row-gap:1em;padding:1em}@media only screen and (max-width : 700px){.one-recording-group{grid-template-columns:1fr}}.synchronization-running{height:80vh;width:100%;display:grid;place-items:center;position:fixed;background:var(--col-bg-body)}.synchronization-running .synchronization-reminder{padding:1.5em}.synchronization-reminder{background-color:var(--col-bg-att);border:1px solid var(--col-bg-att-darker);padding:.5em;margin:.5em 0;display:flex}.synchronization-reminder p{padding-left:1em}.synchronization-reminder i{font-size:1.2em}';
var Ri = Object.defineProperty, Li = Object.getOwnPropertyDescriptor, Ui = (r, e, t, s) => {
  for (var n = s > 1 ? void 0 : s ? Li(e, t) : e, o = r.length - 1, i; o >= 0; o--)
    (i = r[o]) && (n = (s ? i(e, t, n) : i(n)) || n);
  return s && n && Ri(e, t, n), n;
};
let At = class extends zt {
  constructor() {
    super(), this.fetching = !1, this.fetch_error = "", this.workstations = {}, this.timeoutId = null, this.fetchingStopped = !1, this.sync_status = -1, this.last_sync_date = "", this._init();
  }
  static get properties() {
    return {
      ...super.properties,
      fetching: { type: Boolean },
      sync_status: { type: Number },
      workstations: { type: Object }
    };
  }
  _init() {
  }
  fetchWorkstations() {
    this.timeoutId && clearTimeout(this.timeoutId), !this.fetchingStopped && this.apiContext.fetchFromApi(
      "syncmanager",
      "workstations",
      {
        method: "GET",
        caller: "workstationlist.fetchWorkstations"
      }
    ).then((r) => {
      if (r.result_msg !== "ok")
        this.fetch_error = r.result_msg;
      else {
        this.fetch_error = "";
        try {
          this.processData(r.workstations);
        } finally {
          let e = r.poll_delay;
          this.timeoutId = setTimeout(this.fetchWorkstations.bind(this), e * 1e3), this.sync_status = r.sync_status, this.last_sync_date = r.last_sync_ts ? r.last_sync_ts : "", this.reportLastSyncDate();
        }
      }
      this.fetching = !1;
    }).catch((r) => {
      Ys(this, r, "workstationlist.fetchWorkstations", null);
    });
  }
  processData(r) {
    let e = {};
    r.forEach((t) => {
      let s = new Hs();
      s.from_dict(t), (s.description || s.job_status_code != It) && (e[s.workstation_id] = s);
    }), this.workstations = e;
  }
  reportLastSyncDate() {
    this.dispatchEvent(new CustomEvent(
      "syncmanagerinfo",
      { bubbles: !0, composed: !0, detail: this.last_sync_date }
    ));
  }
  firstUpdated(r) {
    super.firstUpdated(r), this.shadowRoot.addEventListener("fetch-workstations", (function() {
      this.fetchWorkstations();
    }).bind(this)), this.fetchWorkstations();
  }
  updated(r) {
    super.updated(r);
  }
  stopFetching() {
    this.fetchingStopped = !0;
  }
  getRecordingGroups() {
    let r = {};
    return Object.values(this.workstations).map((e) => {
      e.recording_group in r || (r[e.recording_group] = []), r[e.recording_group].push(e.workstation_id);
    }), r;
  }
  renderWorkstationCards(r) {
    return b`${r.map(
      (e) => b`
                        <workstation-card
                                .apiContext="${this.apiContext}"
                                .workstation_id="${e}"
                                .workstation_data="${this.workstations[e]}">
                        </workstation-card>
                    `
    )}`;
  }
  renderSynchronizationRunning() {
    return b`
            <div class="synchronization-running">
                <div class="synchronization-reminder"
                    <div>
                        <p>Currently synchronization is running. <br>
                        <a href="${this.apiContext.getKioskRoute("syncmanager.synchronization_progress")}">Click here to monitor its progress.</a>
                        </p>
                    </div>
                </div>
            </div>
        `;
  }
  apiRender() {
    const r = this.getRecordingGroups(), e = Object.keys(r);
    return this.sync_status >= qs && this.sync_status < It ? this.renderSynchronizationRunning() : b`
                ${void 0}
                ${this.sync_status != -1 ? b`
                        <div class="synchronization-reminder">
                            <i class="fas fa-lightbulb"></i><p>The recently started synchronization has ended.</p> 
                            <p><a href="${this.apiContext.getKioskRoute("syncmanager.synchronization_progress")}">
                                Click here to see the results.</a></p>  
                        </div>
                    ` : void 0}
                ${e.length > 1 ? b`${e.map(
      (t) => b`
                                    <div id="${t}" class="recording-group">
                                        <div class="recording-group-header">${t}</div>
                                        <div class="recording-group-body">
                                            <div class="recording-group-background">
                                            </div>
                                            ${this.renderWorkstationCards(r[t])}
                                        </div>
                                    </div>`
    )}` : b`
                            <div class="one-recording-group">
                                ${e.length > 0 ? b`${this.renderWorkstationCards(r[e[0]])}` : void 0}
                            </div>
                        `}
            `;
  }
  // onAfterEnter(location: any, commands: any, router: any) {
  //     console.log("OnAfterEnter", location, commands, router);
  //     // this._installSyncEvents();
  // }
};
At.styles = Ae(zi);
At = Ui([
  Yt("workstation-list")
], At);
const ji = '.col-bg-body-lighter{background-color:var(--col-bg-body-lighter)}.col-bg-body{background-color:var(--col-bg-body)}.col-bg-body-darker{background-color:var(--col-bg-body-darker)}.col-bg-1-lighter{background-color:var(--col-bg-1-lighter)}.col-bg-1{background-color:var(--col-bg-1)}.col-bg-1-darker{background-color:var(--col-bg-1-darker)}.col-bg-1-input{background-color:var(--col-bg-1-input)}.col-primary-bg-1{background-color:var(--col-primary-bg-1)}.col-accent-bg-1{background-color:var(--col-accent-bg-1)}.col-success-bg-1{background-color:var(--col-success-bg-1)}.col-warning-bg-1{background-color:var(--col-warning-bg-1)}.col-error-bg-1{background-color:var(--col-error-bg-1)}.col-bg-2-lighter{background-color:var(--col-bg-2-lighter)}.col-bg-2{background-color:var(--col-bg-2)}.col-bg-2-darker{background-color:var(--col-bg-2-darker)}.col-bg-2-button{background-color:var(--col-bg-2-button)}.col-bg-2-input{background-color:var(--col-bg-2-input)}.col-primary-bg-2{background-color:var(--col-primary-bg-2)}.col-accent-bg-2{background-color:var(--col-accent-bg-2)}.col-success-bg-2{background-color:var(--col-success-bg-2)}.col-warning-bg-2{background-color:var(--col-warning-bg-2)}.col-error-bg-2{background-color:var(--col-error-bg-2)}.col-bg-3-lighter{background-color:var(--col-bg-3-lighter)}.col-bg-3{background-color:var(--col-bg-3)}.col-bg-3-darker{background-color:var(--col-bg-3-darker)}.col-bg-3-button{background-color:var(--col-bg-3-button)}.col-bg-3-input{background-color:var(--col-bg-3-input)}.col-primary-bg-3{background-color:var(--col-primary-bg-3)}.col-accent-bg-3{background-color:var(--col-accent-bg-3)}.col-success-bg-3{background-color:var(--col-success-bg-3)}.col-warning-bg-3{background-color:var(--col-warning-bg-3)}.col-error-bg-3{background-color:var(--col-error-bg-3)}.col-bg-ack-lighter{background-color:var(--col-bg-ack-lighter)}.col-bg-ack{background-color:var(--col-bg-ack)}.col-bg-ack-darker{background-color:var(--col-bg-ack-darker)}.col-primary-bg-ack{background-color:var(--col-primary-bg-ack)}.col-accent-bg-ack{background-color:var(--col-accent-bg-ack)}.col-bg-att-lighter{background-color:var(--col-bg-att-lighter)}.col-bg-att{background-color:var(--col-bg-att)}.col-bg-att-darker{background-color:var(--col-bg-att-darker)}.col-primary-bg-att{background-color:var(--col-primary-bg-att)}.col-accent-bg-att{background-color:var(--col-accent-bg-att)}.col-bg-alert-lighter{background-color:var(--col-bg-alert-lighter)}.col-bg-alert{background-color:var(--col-bg-alert)}.col-bg-alert-darker{background-color:var(--col-bg-alert-darker)}.col-primary-bg-alert{background-color:var(--col-primary-bg-alert)}.col-accent-bg-alert{background-color:var(--col-accent-bg-alert)}.col-bg-btn-lighter{background-color:var(--col-bg-btn-lighter)}.col-bg-btn{background-color:var(--col-bg-btn)}.col-bg-btn-darker{background-color:var(--col-bg-btn-darker)}.col-primary-bg-btn{background-color:var(--col-primary-bg-btn)}.col-accent-bg-btn{background-color:var(--col-accent-bg-btn)}.pattern-diagonal-stripes-sm{background:repeating-linear-gradient(45deg,transparent,transparent 10px,currentColor 10px,currentColor 20px)}.pattern-dots-lg{background-image:radial-gradient(currentColor 1.5px,transparent 1.5px);background-size:15px 15px}.pattern-dots-md{background-image:radial-gradient(currentColor 1px,transparent 1px);background-size:8px 8px}.pattern-dots-medium-dense{background-image:radial-gradient(currentColor .5px,transparent .5px);background-size:3px 3px}.pattern-dots-sm{background-image:radial-gradient(currentColor .5px,transparent .5px);background-size:5px 5px}.pattern-cross-dots-md,.imagelist-background{background-image:radial-gradient(currentColor .7px,transparent 1px),radial-gradient(currentColor .7px,transparent 1px);background-size:6.5px 6.5px;background-position:0 0,3.5px 3.5px}.imagelist-background{background-color:#fff9;background-blend-mode:overlay}p,div{padding:0;margin:0;border:0px;-webkit-user-select:text;user-select:text}select{-webkit-user-select:none;user-select:none}.fa,.fas{font-family:"Font Awesome 5 Free";font-weight:900;font-style:normal}.fa-trash:before{content:""}.fa-view-grid:before{content:""}.fa-reload:before{content:""}.fa-view-list:before{content:""}.fa-camera:before{content:""}.fa-view-image:before{content:""}.fa-check:before{content:""}.fa-bug:before{content:""}.fa-lightbulb:before{content:""}:host{display:block;width:100%}div,p{font-family:var(--standard-text-font)}.center-div{display:flex;flex-direction:column;align-items:center;background:var(--col-bg-body)}.wait-for-login{display:grid;place-items:center;height:100vh;background-color:var(--col-bg-body)}.wait-for-login p{font-family:var(--headline-text-font);font-size:var(--font-size-h2)}.logged-in-message{background-color:var(--col-bg-ack);color:var(--col-primary-bg-ack);display:grid;place-items:center;font-family:var(--standard-text-font)}.development{background-color:#8b0000;color:#fff;font-family:Courier New,sans-serif;font-size:18px;text-align:center}.toolbar{height:3em;background:var(--col-bg-3);display:flex;flex-direction:row;padding:0 1em;justify-content:space-between}.toolbar-info{display:flex;flex-direction:column;justify-content:center;margin-right:1em}#toolbar-filters{flex-grow:1}#toolbar-buttons{background-color:var(--col-bg-3-darker);height:100%;display:flex;flex-direction:row;align-items:center;padding:0 1em}.toolbar-button{color:var(--col-primary-bg-3);height:28px}.toolbar-button i{font-size:28px;line-height:100%}.toolbar-button:hover{color:var(--col-accent-bg-3)}.toolbar-button:active{color:var(--col-bg-ack)}.toolbar-button.disabled{opacity:.3}';
var Pi = Object.defineProperty, Zi = (r, e, t, s) => {
  for (var n = void 0, o = r.length - 1, i; o >= 0; o--)
    (i = r[o]) && (n = i(e, t, n) || n);
  return n && Pi(e, t, n), n;
};
const Jt = class Jt extends zt {
  constructor() {
    super(), this._messages = {};
  }
  static get properties() {
    return { ...super.properties };
  }
  firstUpdated(e) {
    super.firstUpdated(e);
  }
  updated(e) {
    super.updated(e), e.has("apiContext") && this.apiContext;
  }
  reloadClicked(e) {
    this.shadowRoot.getElementById("workstation-list").shadowRoot.dispatchEvent(new CustomEvent("fetch-workstations", {
      bubbles: !0,
      cancelable: !1
    }));
  }
  render_toolbar() {
    return b`
            <div class="toolbar">
                <div id="toolbar-filters"></div>
                <div class="toolbar-info">
                    ${this.last_sync_date ? b`<label>last synchronization</label><label>${this.last_sync_date.toLocaleString(g.DATETIME_MED)}</label>` : b`<label>no synchronization, yet</label>`}
                </div>
                <div id="toolbar-buttons">
                    <div class="toolbar-button" @click=${this.reloadClicked}>
                        <i class="fas fa-reload"></i>
                    </div>
                </div>
            <div>
        </div>`;
  }
  syncManagerInfoReceived(e) {
    e.detail && (this.last_sync_date = g.fromISO(e.detail, { zone: "utc", setZone: !0 }).setZone());
  }
  // apiRender is only called once the api is connected.
  apiRender() {
    let e = b``, t = this.render_toolbar(), s = b`
            <workstation-list id="workstation-list" .apiContext=${this.apiContext} @syncmanagerinfo="${this.syncManagerInfoReceived}"></workstation-list>`;
    return b`${e}${t}${s}`;
  }
};
Jt.styles = Ae(ji);
let st = Jt;
Zi([
  Ti()
], st.prototype, "last_sync_date");
window.customElements.define("syncmanager-app", st);
export {
  st as SyncManagerApp
};
