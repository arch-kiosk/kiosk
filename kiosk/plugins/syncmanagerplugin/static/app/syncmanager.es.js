var __defProp = Object.defineProperty;
var __defProps = Object.defineProperties;
var __getOwnPropDescs = Object.getOwnPropertyDescriptors;
var __getOwnPropSymbols = Object.getOwnPropertySymbols;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __propIsEnum = Object.prototype.propertyIsEnumerable;
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __spreadValues = (a2, b2) => {
  for (var prop in b2 || (b2 = {}))
    if (__hasOwnProp.call(b2, prop))
      __defNormalProp(a2, prop, b2[prop]);
  if (__getOwnPropSymbols)
    for (var prop of __getOwnPropSymbols(b2)) {
      if (__propIsEnum.call(b2, prop))
        __defNormalProp(a2, prop, b2[prop]);
    }
  return a2;
};
var __spreadProps = (a2, b2) => __defProps(a2, __getOwnPropDescs(b2));
/**
 * @license
 * Copyright 2019 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const t$1 = window.ShadowRoot && (window.ShadyCSS === void 0 || window.ShadyCSS.nativeShadow) && "adoptedStyleSheets" in Document.prototype && "replace" in CSSStyleSheet.prototype, e$3 = Symbol(), n$4 = new Map();
class s$3 {
  constructor(t2, n2) {
    if (this._$cssResult$ = true, n2 !== e$3)
      throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");
    this.cssText = t2;
  }
  get styleSheet() {
    let e2 = n$4.get(this.cssText);
    return t$1 && e2 === void 0 && (n$4.set(this.cssText, e2 = new CSSStyleSheet()), e2.replaceSync(this.cssText)), e2;
  }
  toString() {
    return this.cssText;
  }
}
const o$4 = (t2) => new s$3(typeof t2 == "string" ? t2 : t2 + "", e$3), i$3 = (e2, n2) => {
  t$1 ? e2.adoptedStyleSheets = n2.map((t2) => t2 instanceof CSSStyleSheet ? t2 : t2.styleSheet) : n2.forEach((t2) => {
    const n3 = document.createElement("style"), s2 = window.litNonce;
    s2 !== void 0 && n3.setAttribute("nonce", s2), n3.textContent = t2.cssText, e2.appendChild(n3);
  });
}, S$1 = t$1 ? (t2) => t2 : (t2) => t2 instanceof CSSStyleSheet ? ((t3) => {
  let e2 = "";
  for (const n2 of t3.cssRules)
    e2 += n2.cssText;
  return o$4(e2);
})(t2) : t2;
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
var s$2;
const e$2 = window.reactiveElementPolyfillSupport, r$1 = { toAttribute(t2, i2) {
  switch (i2) {
    case Boolean:
      t2 = t2 ? "" : null;
      break;
    case Object:
    case Array:
      t2 = t2 == null ? t2 : JSON.stringify(t2);
  }
  return t2;
}, fromAttribute(t2, i2) {
  let s2 = t2;
  switch (i2) {
    case Boolean:
      s2 = t2 !== null;
      break;
    case Number:
      s2 = t2 === null ? null : Number(t2);
      break;
    case Object:
    case Array:
      try {
        s2 = JSON.parse(t2);
      } catch (t3) {
        s2 = null;
      }
  }
  return s2;
} }, h$1 = (t2, i2) => i2 !== t2 && (i2 == i2 || t2 == t2), o$3 = { attribute: true, type: String, converter: r$1, reflect: false, hasChanged: h$1 };
class n$3 extends HTMLElement {
  constructor() {
    super(), this._$Et = new Map(), this.isUpdatePending = false, this.hasUpdated = false, this._$Ei = null, this.o();
  }
  static addInitializer(t2) {
    var i2;
    (i2 = this.l) !== null && i2 !== void 0 || (this.l = []), this.l.push(t2);
  }
  static get observedAttributes() {
    this.finalize();
    const t2 = [];
    return this.elementProperties.forEach((i2, s2) => {
      const e2 = this._$Eh(s2, i2);
      e2 !== void 0 && (this._$Eu.set(e2, s2), t2.push(e2));
    }), t2;
  }
  static createProperty(t2, i2 = o$3) {
    if (i2.state && (i2.attribute = false), this.finalize(), this.elementProperties.set(t2, i2), !i2.noAccessor && !this.prototype.hasOwnProperty(t2)) {
      const s2 = typeof t2 == "symbol" ? Symbol() : "__" + t2, e2 = this.getPropertyDescriptor(t2, s2, i2);
      e2 !== void 0 && Object.defineProperty(this.prototype, t2, e2);
    }
  }
  static getPropertyDescriptor(t2, i2, s2) {
    return { get() {
      return this[i2];
    }, set(e2) {
      const r2 = this[t2];
      this[i2] = e2, this.requestUpdate(t2, r2, s2);
    }, configurable: true, enumerable: true };
  }
  static getPropertyOptions(t2) {
    return this.elementProperties.get(t2) || o$3;
  }
  static finalize() {
    if (this.hasOwnProperty("finalized"))
      return false;
    this.finalized = true;
    const t2 = Object.getPrototypeOf(this);
    if (t2.finalize(), this.elementProperties = new Map(t2.elementProperties), this._$Eu = new Map(), this.hasOwnProperty("properties")) {
      const t3 = this.properties, i2 = [...Object.getOwnPropertyNames(t3), ...Object.getOwnPropertySymbols(t3)];
      for (const s2 of i2)
        this.createProperty(s2, t3[s2]);
    }
    return this.elementStyles = this.finalizeStyles(this.styles), true;
  }
  static finalizeStyles(i2) {
    const s2 = [];
    if (Array.isArray(i2)) {
      const e2 = new Set(i2.flat(1 / 0).reverse());
      for (const i3 of e2)
        s2.unshift(S$1(i3));
    } else
      i2 !== void 0 && s2.push(S$1(i2));
    return s2;
  }
  static _$Eh(t2, i2) {
    const s2 = i2.attribute;
    return s2 === false ? void 0 : typeof s2 == "string" ? s2 : typeof t2 == "string" ? t2.toLowerCase() : void 0;
  }
  o() {
    var t2;
    this._$Ev = new Promise((t3) => this.enableUpdating = t3), this._$AL = new Map(), this._$Ep(), this.requestUpdate(), (t2 = this.constructor.l) === null || t2 === void 0 || t2.forEach((t3) => t3(this));
  }
  addController(t2) {
    var i2, s2;
    ((i2 = this._$Em) !== null && i2 !== void 0 ? i2 : this._$Em = []).push(t2), this.renderRoot !== void 0 && this.isConnected && ((s2 = t2.hostConnected) === null || s2 === void 0 || s2.call(t2));
  }
  removeController(t2) {
    var i2;
    (i2 = this._$Em) === null || i2 === void 0 || i2.splice(this._$Em.indexOf(t2) >>> 0, 1);
  }
  _$Ep() {
    this.constructor.elementProperties.forEach((t2, i2) => {
      this.hasOwnProperty(i2) && (this._$Et.set(i2, this[i2]), delete this[i2]);
    });
  }
  createRenderRoot() {
    var t2;
    const s2 = (t2 = this.shadowRoot) !== null && t2 !== void 0 ? t2 : this.attachShadow(this.constructor.shadowRootOptions);
    return i$3(s2, this.constructor.elementStyles), s2;
  }
  connectedCallback() {
    var t2;
    this.renderRoot === void 0 && (this.renderRoot = this.createRenderRoot()), this.enableUpdating(true), (t2 = this._$Em) === null || t2 === void 0 || t2.forEach((t3) => {
      var i2;
      return (i2 = t3.hostConnected) === null || i2 === void 0 ? void 0 : i2.call(t3);
    });
  }
  enableUpdating(t2) {
  }
  disconnectedCallback() {
    var t2;
    (t2 = this._$Em) === null || t2 === void 0 || t2.forEach((t3) => {
      var i2;
      return (i2 = t3.hostDisconnected) === null || i2 === void 0 ? void 0 : i2.call(t3);
    });
  }
  attributeChangedCallback(t2, i2, s2) {
    this._$AK(t2, s2);
  }
  _$Eg(t2, i2, s2 = o$3) {
    var e2, h2;
    const n2 = this.constructor._$Eh(t2, s2);
    if (n2 !== void 0 && s2.reflect === true) {
      const o2 = ((h2 = (e2 = s2.converter) === null || e2 === void 0 ? void 0 : e2.toAttribute) !== null && h2 !== void 0 ? h2 : r$1.toAttribute)(i2, s2.type);
      this._$Ei = t2, o2 == null ? this.removeAttribute(n2) : this.setAttribute(n2, o2), this._$Ei = null;
    }
  }
  _$AK(t2, i2) {
    var s2, e2, h2;
    const o2 = this.constructor, n2 = o2._$Eu.get(t2);
    if (n2 !== void 0 && this._$Ei !== n2) {
      const t3 = o2.getPropertyOptions(n2), l2 = t3.converter, a2 = (h2 = (e2 = (s2 = l2) === null || s2 === void 0 ? void 0 : s2.fromAttribute) !== null && e2 !== void 0 ? e2 : typeof l2 == "function" ? l2 : null) !== null && h2 !== void 0 ? h2 : r$1.fromAttribute;
      this._$Ei = n2, this[n2] = a2(i2, t3.type), this._$Ei = null;
    }
  }
  requestUpdate(t2, i2, s2) {
    let e2 = true;
    t2 !== void 0 && (((s2 = s2 || this.constructor.getPropertyOptions(t2)).hasChanged || h$1)(this[t2], i2) ? (this._$AL.has(t2) || this._$AL.set(t2, i2), s2.reflect === true && this._$Ei !== t2 && (this._$ES === void 0 && (this._$ES = new Map()), this._$ES.set(t2, s2))) : e2 = false), !this.isUpdatePending && e2 && (this._$Ev = this._$EC());
  }
  async _$EC() {
    this.isUpdatePending = true;
    try {
      await this._$Ev;
    } catch (t3) {
      Promise.reject(t3);
    }
    const t2 = this.scheduleUpdate();
    return t2 != null && await t2, !this.isUpdatePending;
  }
  scheduleUpdate() {
    return this.performUpdate();
  }
  performUpdate() {
    var t2;
    if (!this.isUpdatePending)
      return;
    this.hasUpdated, this._$Et && (this._$Et.forEach((t3, i3) => this[i3] = t3), this._$Et = void 0);
    let i2 = false;
    const s2 = this._$AL;
    try {
      i2 = this.shouldUpdate(s2), i2 ? (this.willUpdate(s2), (t2 = this._$Em) === null || t2 === void 0 || t2.forEach((t3) => {
        var i3;
        return (i3 = t3.hostUpdate) === null || i3 === void 0 ? void 0 : i3.call(t3);
      }), this.update(s2)) : this._$EU();
    } catch (t3) {
      throw i2 = false, this._$EU(), t3;
    }
    i2 && this._$AE(s2);
  }
  willUpdate(t2) {
  }
  _$AE(t2) {
    var i2;
    (i2 = this._$Em) === null || i2 === void 0 || i2.forEach((t3) => {
      var i3;
      return (i3 = t3.hostUpdated) === null || i3 === void 0 ? void 0 : i3.call(t3);
    }), this.hasUpdated || (this.hasUpdated = true, this.firstUpdated(t2)), this.updated(t2);
  }
  _$EU() {
    this._$AL = new Map(), this.isUpdatePending = false;
  }
  get updateComplete() {
    return this.getUpdateComplete();
  }
  getUpdateComplete() {
    return this._$Ev;
  }
  shouldUpdate(t2) {
    return true;
  }
  update(t2) {
    this._$ES !== void 0 && (this._$ES.forEach((t3, i2) => this._$Eg(i2, this[i2], t3)), this._$ES = void 0), this._$EU();
  }
  updated(t2) {
  }
  firstUpdated(t2) {
  }
}
n$3.finalized = true, n$3.elementProperties = new Map(), n$3.elementStyles = [], n$3.shadowRootOptions = { mode: "open" }, e$2 == null || e$2({ ReactiveElement: n$3 }), ((s$2 = globalThis.reactiveElementVersions) !== null && s$2 !== void 0 ? s$2 : globalThis.reactiveElementVersions = []).push("1.0.1");
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
var t;
const i$2 = globalThis.trustedTypes, s$1 = i$2 ? i$2.createPolicy("lit-html", { createHTML: (t2) => t2 }) : void 0, e$1 = `lit$${(Math.random() + "").slice(9)}$`, o$2 = "?" + e$1, n$2 = `<${o$2}>`, l$1 = document, h = (t2 = "") => l$1.createComment(t2), r = (t2) => t2 === null || typeof t2 != "object" && typeof t2 != "function", d = Array.isArray, u = (t2) => {
  var i2;
  return d(t2) || typeof ((i2 = t2) === null || i2 === void 0 ? void 0 : i2[Symbol.iterator]) == "function";
}, c = /<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g, v = /-->/g, a = />/g, f = />|[ 	\n\r](?:([^\s"'>=/]+)([ 	\n\r]*=[ 	\n\r]*(?:[^ 	\n\r"'`<>=]|("|')|))|$)/g, _ = /'/g, m = /"/g, g = /^(?:script|style|textarea)$/i, $$1 = (t2) => (i2, ...s2) => ({ _$litType$: t2, strings: i2, values: s2 }), p = $$1(1), b = Symbol.for("lit-noChange"), T = Symbol.for("lit-nothing"), x = new WeakMap(), w = (t2, i2, s2) => {
  var e2, o2;
  const n2 = (e2 = s2 == null ? void 0 : s2.renderBefore) !== null && e2 !== void 0 ? e2 : i2;
  let l2 = n2._$litPart$;
  if (l2 === void 0) {
    const t3 = (o2 = s2 == null ? void 0 : s2.renderBefore) !== null && o2 !== void 0 ? o2 : null;
    n2._$litPart$ = l2 = new N(i2.insertBefore(h(), t3), t3, void 0, s2 != null ? s2 : {});
  }
  return l2._$AI(t2), l2;
}, A = l$1.createTreeWalker(l$1, 129, null, false), C = (t2, i2) => {
  const o2 = t2.length - 1, l2 = [];
  let h2, r2 = i2 === 2 ? "<svg>" : "", d2 = c;
  for (let i3 = 0; i3 < o2; i3++) {
    const s2 = t2[i3];
    let o3, u3, $2 = -1, p2 = 0;
    for (; p2 < s2.length && (d2.lastIndex = p2, u3 = d2.exec(s2), u3 !== null); )
      p2 = d2.lastIndex, d2 === c ? u3[1] === "!--" ? d2 = v : u3[1] !== void 0 ? d2 = a : u3[2] !== void 0 ? (g.test(u3[2]) && (h2 = RegExp("</" + u3[2], "g")), d2 = f) : u3[3] !== void 0 && (d2 = f) : d2 === f ? u3[0] === ">" ? (d2 = h2 != null ? h2 : c, $2 = -1) : u3[1] === void 0 ? $2 = -2 : ($2 = d2.lastIndex - u3[2].length, o3 = u3[1], d2 = u3[3] === void 0 ? f : u3[3] === '"' ? m : _) : d2 === m || d2 === _ ? d2 = f : d2 === v || d2 === a ? d2 = c : (d2 = f, h2 = void 0);
    const y = d2 === f && t2[i3 + 1].startsWith("/>") ? " " : "";
    r2 += d2 === c ? s2 + n$2 : $2 >= 0 ? (l2.push(o3), s2.slice(0, $2) + "$lit$" + s2.slice($2) + e$1 + y) : s2 + e$1 + ($2 === -2 ? (l2.push(void 0), i3) : y);
  }
  const u2 = r2 + (t2[o2] || "<?>") + (i2 === 2 ? "</svg>" : "");
  return [s$1 !== void 0 ? s$1.createHTML(u2) : u2, l2];
};
class P {
  constructor({ strings: t2, _$litType$: s2 }, n2) {
    let l2;
    this.parts = [];
    let r2 = 0, d2 = 0;
    const u2 = t2.length - 1, c2 = this.parts, [v2, a2] = C(t2, s2);
    if (this.el = P.createElement(v2, n2), A.currentNode = this.el.content, s2 === 2) {
      const t3 = this.el.content, i2 = t3.firstChild;
      i2.remove(), t3.append(...i2.childNodes);
    }
    for (; (l2 = A.nextNode()) !== null && c2.length < u2; ) {
      if (l2.nodeType === 1) {
        if (l2.hasAttributes()) {
          const t3 = [];
          for (const i2 of l2.getAttributeNames())
            if (i2.endsWith("$lit$") || i2.startsWith(e$1)) {
              const s3 = a2[d2++];
              if (t3.push(i2), s3 !== void 0) {
                const t4 = l2.getAttribute(s3.toLowerCase() + "$lit$").split(e$1), i3 = /([.?@])?(.*)/.exec(s3);
                c2.push({ type: 1, index: r2, name: i3[2], strings: t4, ctor: i3[1] === "." ? M : i3[1] === "?" ? k : i3[1] === "@" ? H : S });
              } else
                c2.push({ type: 6, index: r2 });
            }
          for (const i2 of t3)
            l2.removeAttribute(i2);
        }
        if (g.test(l2.tagName)) {
          const t3 = l2.textContent.split(e$1), s3 = t3.length - 1;
          if (s3 > 0) {
            l2.textContent = i$2 ? i$2.emptyScript : "";
            for (let i2 = 0; i2 < s3; i2++)
              l2.append(t3[i2], h()), A.nextNode(), c2.push({ type: 2, index: ++r2 });
            l2.append(t3[s3], h());
          }
        }
      } else if (l2.nodeType === 8)
        if (l2.data === o$2)
          c2.push({ type: 2, index: r2 });
        else {
          let t3 = -1;
          for (; (t3 = l2.data.indexOf(e$1, t3 + 1)) !== -1; )
            c2.push({ type: 7, index: r2 }), t3 += e$1.length - 1;
        }
      r2++;
    }
  }
  static createElement(t2, i2) {
    const s2 = l$1.createElement("template");
    return s2.innerHTML = t2, s2;
  }
}
function V(t2, i2, s2 = t2, e2) {
  var o2, n2, l2, h2;
  if (i2 === b)
    return i2;
  let d2 = e2 !== void 0 ? (o2 = s2._$Cl) === null || o2 === void 0 ? void 0 : o2[e2] : s2._$Cu;
  const u2 = r(i2) ? void 0 : i2._$litDirective$;
  return (d2 == null ? void 0 : d2.constructor) !== u2 && ((n2 = d2 == null ? void 0 : d2._$AO) === null || n2 === void 0 || n2.call(d2, false), u2 === void 0 ? d2 = void 0 : (d2 = new u2(t2), d2._$AT(t2, s2, e2)), e2 !== void 0 ? ((l2 = (h2 = s2)._$Cl) !== null && l2 !== void 0 ? l2 : h2._$Cl = [])[e2] = d2 : s2._$Cu = d2), d2 !== void 0 && (i2 = V(t2, d2._$AS(t2, i2.values), d2, e2)), i2;
}
class E {
  constructor(t2, i2) {
    this.v = [], this._$AN = void 0, this._$AD = t2, this._$AM = i2;
  }
  get parentNode() {
    return this._$AM.parentNode;
  }
  get _$AU() {
    return this._$AM._$AU;
  }
  p(t2) {
    var i2;
    const { el: { content: s2 }, parts: e2 } = this._$AD, o2 = ((i2 = t2 == null ? void 0 : t2.creationScope) !== null && i2 !== void 0 ? i2 : l$1).importNode(s2, true);
    A.currentNode = o2;
    let n2 = A.nextNode(), h2 = 0, r2 = 0, d2 = e2[0];
    for (; d2 !== void 0; ) {
      if (h2 === d2.index) {
        let i3;
        d2.type === 2 ? i3 = new N(n2, n2.nextSibling, this, t2) : d2.type === 1 ? i3 = new d2.ctor(n2, d2.name, d2.strings, this, t2) : d2.type === 6 && (i3 = new I(n2, this, t2)), this.v.push(i3), d2 = e2[++r2];
      }
      h2 !== (d2 == null ? void 0 : d2.index) && (n2 = A.nextNode(), h2++);
    }
    return o2;
  }
  m(t2) {
    let i2 = 0;
    for (const s2 of this.v)
      s2 !== void 0 && (s2.strings !== void 0 ? (s2._$AI(t2, s2, i2), i2 += s2.strings.length - 2) : s2._$AI(t2[i2])), i2++;
  }
}
class N {
  constructor(t2, i2, s2, e2) {
    var o2;
    this.type = 2, this._$AH = T, this._$AN = void 0, this._$AA = t2, this._$AB = i2, this._$AM = s2, this.options = e2, this._$Cg = (o2 = e2 == null ? void 0 : e2.isConnected) === null || o2 === void 0 || o2;
  }
  get _$AU() {
    var t2, i2;
    return (i2 = (t2 = this._$AM) === null || t2 === void 0 ? void 0 : t2._$AU) !== null && i2 !== void 0 ? i2 : this._$Cg;
  }
  get parentNode() {
    let t2 = this._$AA.parentNode;
    const i2 = this._$AM;
    return i2 !== void 0 && t2.nodeType === 11 && (t2 = i2.parentNode), t2;
  }
  get startNode() {
    return this._$AA;
  }
  get endNode() {
    return this._$AB;
  }
  _$AI(t2, i2 = this) {
    t2 = V(this, t2, i2), r(t2) ? t2 === T || t2 == null || t2 === "" ? (this._$AH !== T && this._$AR(), this._$AH = T) : t2 !== this._$AH && t2 !== b && this.$(t2) : t2._$litType$ !== void 0 ? this.T(t2) : t2.nodeType !== void 0 ? this.S(t2) : u(t2) ? this.M(t2) : this.$(t2);
  }
  A(t2, i2 = this._$AB) {
    return this._$AA.parentNode.insertBefore(t2, i2);
  }
  S(t2) {
    this._$AH !== t2 && (this._$AR(), this._$AH = this.A(t2));
  }
  $(t2) {
    this._$AH !== T && r(this._$AH) ? this._$AA.nextSibling.data = t2 : this.S(l$1.createTextNode(t2)), this._$AH = t2;
  }
  T(t2) {
    var i2;
    const { values: s2, _$litType$: e2 } = t2, o2 = typeof e2 == "number" ? this._$AC(t2) : (e2.el === void 0 && (e2.el = P.createElement(e2.h, this.options)), e2);
    if (((i2 = this._$AH) === null || i2 === void 0 ? void 0 : i2._$AD) === o2)
      this._$AH.m(s2);
    else {
      const t3 = new E(o2, this), i3 = t3.p(this.options);
      t3.m(s2), this.S(i3), this._$AH = t3;
    }
  }
  _$AC(t2) {
    let i2 = x.get(t2.strings);
    return i2 === void 0 && x.set(t2.strings, i2 = new P(t2)), i2;
  }
  M(t2) {
    d(this._$AH) || (this._$AH = [], this._$AR());
    const i2 = this._$AH;
    let s2, e2 = 0;
    for (const o2 of t2)
      e2 === i2.length ? i2.push(s2 = new N(this.A(h()), this.A(h()), this, this.options)) : s2 = i2[e2], s2._$AI(o2), e2++;
    e2 < i2.length && (this._$AR(s2 && s2._$AB.nextSibling, e2), i2.length = e2);
  }
  _$AR(t2 = this._$AA.nextSibling, i2) {
    var s2;
    for ((s2 = this._$AP) === null || s2 === void 0 || s2.call(this, false, true, i2); t2 && t2 !== this._$AB; ) {
      const i3 = t2.nextSibling;
      t2.remove(), t2 = i3;
    }
  }
  setConnected(t2) {
    var i2;
    this._$AM === void 0 && (this._$Cg = t2, (i2 = this._$AP) === null || i2 === void 0 || i2.call(this, t2));
  }
}
class S {
  constructor(t2, i2, s2, e2, o2) {
    this.type = 1, this._$AH = T, this._$AN = void 0, this.element = t2, this.name = i2, this._$AM = e2, this.options = o2, s2.length > 2 || s2[0] !== "" || s2[1] !== "" ? (this._$AH = Array(s2.length - 1).fill(new String()), this.strings = s2) : this._$AH = T;
  }
  get tagName() {
    return this.element.tagName;
  }
  get _$AU() {
    return this._$AM._$AU;
  }
  _$AI(t2, i2 = this, s2, e2) {
    const o2 = this.strings;
    let n2 = false;
    if (o2 === void 0)
      t2 = V(this, t2, i2, 0), n2 = !r(t2) || t2 !== this._$AH && t2 !== b, n2 && (this._$AH = t2);
    else {
      const e3 = t2;
      let l2, h2;
      for (t2 = o2[0], l2 = 0; l2 < o2.length - 1; l2++)
        h2 = V(this, e3[s2 + l2], i2, l2), h2 === b && (h2 = this._$AH[l2]), n2 || (n2 = !r(h2) || h2 !== this._$AH[l2]), h2 === T ? t2 = T : t2 !== T && (t2 += (h2 != null ? h2 : "") + o2[l2 + 1]), this._$AH[l2] = h2;
    }
    n2 && !e2 && this.k(t2);
  }
  k(t2) {
    t2 === T ? this.element.removeAttribute(this.name) : this.element.setAttribute(this.name, t2 != null ? t2 : "");
  }
}
class M extends S {
  constructor() {
    super(...arguments), this.type = 3;
  }
  k(t2) {
    this.element[this.name] = t2 === T ? void 0 : t2;
  }
}
class k extends S {
  constructor() {
    super(...arguments), this.type = 4;
  }
  k(t2) {
    t2 && t2 !== T ? this.element.setAttribute(this.name, "") : this.element.removeAttribute(this.name);
  }
}
class H extends S {
  constructor(t2, i2, s2, e2, o2) {
    super(t2, i2, s2, e2, o2), this.type = 5;
  }
  _$AI(t2, i2 = this) {
    var s2;
    if ((t2 = (s2 = V(this, t2, i2, 0)) !== null && s2 !== void 0 ? s2 : T) === b)
      return;
    const e2 = this._$AH, o2 = t2 === T && e2 !== T || t2.capture !== e2.capture || t2.once !== e2.once || t2.passive !== e2.passive, n2 = t2 !== T && (e2 === T || o2);
    o2 && this.element.removeEventListener(this.name, this, e2), n2 && this.element.addEventListener(this.name, this, t2), this._$AH = t2;
  }
  handleEvent(t2) {
    var i2, s2;
    typeof this._$AH == "function" ? this._$AH.call((s2 = (i2 = this.options) === null || i2 === void 0 ? void 0 : i2.host) !== null && s2 !== void 0 ? s2 : this.element, t2) : this._$AH.handleEvent(t2);
  }
}
class I {
  constructor(t2, i2, s2) {
    this.element = t2, this.type = 6, this._$AN = void 0, this._$AM = i2, this.options = s2;
  }
  get _$AU() {
    return this._$AM._$AU;
  }
  _$AI(t2) {
    V(this, t2);
  }
}
const R = window.litHtmlPolyfillSupport;
R == null || R(P, N), ((t = globalThis.litHtmlVersions) !== null && t !== void 0 ? t : globalThis.litHtmlVersions = []).push("2.0.1");
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
var l, o$1;
class s extends n$3 {
  constructor() {
    super(...arguments), this.renderOptions = { host: this }, this._$Dt = void 0;
  }
  createRenderRoot() {
    var t2, e2;
    const i2 = super.createRenderRoot();
    return (t2 = (e2 = this.renderOptions).renderBefore) !== null && t2 !== void 0 || (e2.renderBefore = i2.firstChild), i2;
  }
  update(t2) {
    const i2 = this.render();
    this.hasUpdated || (this.renderOptions.isConnected = this.isConnected), super.update(t2), this._$Dt = w(i2, this.renderRoot, this.renderOptions);
  }
  connectedCallback() {
    var t2;
    super.connectedCallback(), (t2 = this._$Dt) === null || t2 === void 0 || t2.setConnected(true);
  }
  disconnectedCallback() {
    var t2;
    super.disconnectedCallback(), (t2 = this._$Dt) === null || t2 === void 0 || t2.setConnected(false);
  }
  render() {
    return b;
  }
}
s.finalized = true, s._$litElement$ = true, (l = globalThis.litElementHydrateSupport) === null || l === void 0 || l.call(globalThis, { LitElement: s });
const n$1 = globalThis.litElementPolyfillSupport;
n$1 == null || n$1({ LitElement: s });
((o$1 = globalThis.litElementVersions) !== null && o$1 !== void 0 ? o$1 : globalThis.litElementVersions = []).push("3.0.1");
const API_STATE_READY = 2;
const API_STATE_ERROR = 3;
class KioskApp extends s {
  constructor() {
    super();
    this.kiosk_base_url = "/";
    this.appErrors = [];
    this.apiContext = void 0;
    this.showProgress = false;
  }
  static get properties() {
    return {
      apiContext: { type: Object },
      appErrors: { type: Array },
      showProgress: { type: Boolean }
    };
  }
  updated(_changedProperties) {
    if (_changedProperties.has("apiContext")) {
      this.showProgress = false;
      if (this.apiContext && this.apiContext.status === API_STATE_ERROR) {
        this.addAppError("Cannot connect to Kiosk API.");
      }
    }
  }
  render() {
    let renderedHtml;
    if (this.apiContext && this.apiContext.status === API_STATE_READY) {
      renderedHtml = this.apiRender();
    } else {
      if (this.apiContext && this.apiContext.status === API_STATE_ERROR)
        renderedHtml = this.renderApiError();
      else
        renderedHtml = this.renderNoContextYet();
    }
    return p`
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
            ${this.renderErrors()} ${renderedHtml}
        `;
  }
  renderNoContextYet() {
    return p`
            <link
                rel="stylesheet"
                href="${this.kiosk_base_url}static/styles.css"
            />
        `;
  }
  renderApiError() {
    return void 0;
  }
  renderErrors() {
    if (this.appErrors.length > 0) {
      return p`
                ${this.appErrors.map((error) => p`<div class="system-message">${error}</div>`)}
            `;
    } else
      return void 0;
  }
  renderProgress(force = false) {
    if (force || this.showProgress)
      return p`
                <div class="loading">
                    <div class="loading-progress"></div>
                </div>`;
    else
      return void 0;
  }
  addAppError(error) {
    this.appErrors.push(error);
    this.requestUpdate();
  }
  deleteError(error) {
    let foundIndex = -1;
    this.appErrors.find((apiErr, index) => {
      if (apiErr === error) {
        foundIndex = index;
        return true;
      } else
        return false;
    });
    if (foundIndex > -1) {
      this.appErrors.splice(foundIndex, 1);
      this.appErrors = [...this.appErrors];
    }
  }
}
class Workstation {
  constructor() {
    this.job_result = {};
    this.job_progress = {};
    this.actions = {};
  }
  from_dict(r2) {
    this.description = r2["description"];
    this.workstation_id = r2["id"];
    this.state_text = r2["state_text"];
    this.state_description = r2["state_description"];
    this.disabled = r2["disabled"];
    this.recording_group = r2["recording_group"] ? r2["recording_group"] : "unassigned";
    this.workstation_class = r2["workstation_class"];
    this.icon_code = "icon_code" in r2 ? r2["icon_code"] : "";
    this.icon_url = "icon_url" in r2 ? r2["icon_url"] : "";
    this.job_status = "job_status" in r2 ? r2["job_status"] : "";
    this.job_status_code = "job_status_code" in r2 ? r2["job_status_code"] : "";
    this.job_result = "job_result" in r2 ? r2["job_result"] : "";
    this.job_progress = "job_progress" in r2 ? r2["job_progress"] : {};
    this.actions = "actions" in r2 ? r2["actions"] : {};
    this.meta = "meta" in r2 ? r2["meta"] : {};
    return this;
  }
}
function _KioskErrorToast(err_message, options) {
  kioskErrorToast(err_message, options);
}
function _kioskYesNoToast(err_message, onYes, onNo, options = {}, target = "") {
  kioskYesNoToast(err_message, onYes, onNo, options, target);
}
function _kioskOpenModalDialog(href, paramAjaxOptions) {
  kioskOpenModalDialog(href, paramAjaxOptions);
}
const MSG_NETWORK_ERROR = "MSG_NETWORK_ERROR";
class MessageData {
  constructor(messageId, headline, body = "") {
    this.messageId = messageId;
    this.headline = headline;
    this.body = body;
  }
}
function sendMessage(senderInstance, messageId, headline, body = "") {
  let messageData = new MessageData(messageId, headline, body);
  senderInstance.dispatchEvent(new CustomEvent("send-message", { bubbles: true, composed: true, detail: messageData }));
}
const JOB_STATUS_REGISTERED = 1;
const JOB_STATUS_DONE = 20;
const JOB_STATUS_CANCELED = 21;
function handleCommonFetchErrors(handlerInstance, e2, messagePrefix = "", onUnhandledError = null) {
  if (messagePrefix)
    messagePrefix += ": ";
  if (e2.response) {
    if (e2.response.status == 403 || e2.response.status == 401) {
      sendMessage(handlerInstance, MSG_NETWORK_ERROR, `${messagePrefix}You are not logged in properly or your session has timed out`, `<a href="/logout">Please log in again.</a>`);
      return;
    }
    if (onUnhandledError) {
      onUnhandledError(e2);
    } else {
      sendMessage(handlerInstance, MSG_NETWORK_ERROR, `${messagePrefix}Kiosk server responded with an error.`, `(${e2.response.statusText}). 
                The server might be down or perhaps you are not logged in properly.`);
    }
  } else {
    sendMessage(handlerInstance, MSG_NETWORK_ERROR, `${messagePrefix}Kiosk server responded with a network error.`, `(${e2}). 
            The server might be down or perhaps you are not logged in properly.`);
    return;
  }
}
function gotoPage(href) {
  window.location.href = href;
}
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const n = (n2) => (e2) => typeof e2 == "function" ? ((n3, e3) => (window.customElements.define(n3, e3), e3))(n2, e2) : ((n3, e3) => {
  const { kind: t2, elements: i2 } = e3;
  return { kind: t2, elements: i2, finisher(e4) {
    window.customElements.define(n3, e4);
  } };
})(n2, e2);
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const i$1 = (i2, e2) => e2.kind === "method" && e2.descriptor && !("value" in e2.descriptor) ? __spreadProps(__spreadValues({}, e2), { finisher(n2) {
  n2.createProperty(e2.key, i2);
} }) : { kind: "field", key: Symbol(), placement: "own", descriptor: {}, originalKey: e2.key, initializer() {
  typeof e2.initializer == "function" && (this[e2.key] = e2.initializer.call(this));
}, finisher(n2) {
  n2.createProperty(e2.key, i2);
} };
function e(e2) {
  return (n2, t2) => t2 !== void 0 ? ((i2, e3, n3) => {
    e3.constructor.createProperty(n3, i2);
  })(e2, n2, t2) : i$1(e2, n2);
}
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const o = ({ finisher: e2, descriptor: t2 }) => (o2, n2) => {
  var r2;
  if (n2 === void 0) {
    const n3 = (r2 = o2.originalKey) !== null && r2 !== void 0 ? r2 : o2.key, i2 = t2 != null ? { kind: "method", placement: "prototype", key: n3, descriptor: t2(o2.key) } : __spreadProps(__spreadValues({}, o2), { key: n3 });
    return e2 != null && (i2.finisher = function(t3) {
      e2(t3, n3);
    }), i2;
  }
  {
    const r3 = o2.constructor;
    t2 !== void 0 && Object.defineProperty(o2, n2, t2(n2)), e2 == null || e2(r3, n2);
  }
};
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
function i(i2, n2) {
  return o({ descriptor: (o2) => {
    const t2 = { get() {
      var o3, n3;
      return (n3 = (o3 = this.renderRoot) === null || o3 === void 0 ? void 0 : o3.querySelector(i2)) !== null && n3 !== void 0 ? n3 : null;
    }, enumerable: true, configurable: true };
    if (n2) {
      const n3 = typeof o2 == "symbol" ? Symbol() : "__" + o2;
      t2.get = function() {
        var o3, t3;
        return this[n3] === void 0 && (this[n3] = (t3 = (o3 = this.renderRoot) === null || o3 === void 0 ? void 0 : o3.querySelector(i2)) !== null && t3 !== void 0 ? t3 : null), this[n3];
      };
    }
    return t2;
  } });
}
var local_css$2 = '.col-bg-body-lighter{background-color:var(--col-bg-body-lighter)}.col-bg-body{background-color:var(--col-bg-body)}.col-bg-body-darker{background-color:var(--col-bg-body-darker)}.col-bg-1-lighter{background-color:var(--col-bg-1-lighter)}.col-bg-1{background-color:var(--col-bg-1)}.col-bg-1-darker{background-color:var(--col-bg-1-darker)}.col-bg-1-input{background-color:var(--col-bg-1-input)}.col-primary-bg-1{background-color:var(--col-primary-bg-1)}.col-accent-bg-1{background-color:var(--col-accent-bg-1)}.col-success-bg-1{background-color:var(--col-success-bg-1)}.col-warning-bg-1{background-color:var(--col-warning-bg-1)}.col-error-bg-1{background-color:var(--col-error-bg-1)}.col-bg-2-lighter{background-color:var(--col-bg-2-lighter)}.col-bg-2{background-color:var(--col-bg-2)}.col-bg-2-darker{background-color:var(--col-bg-2-darker)}.col-bg-2-button{background-color:var(--col-bg-2-button)}.col-bg-2-input{background-color:var(--col-bg-2-input)}.col-primary-bg-2{background-color:var(--col-primary-bg-2)}.col-accent-bg-2{background-color:var(--col-accent-bg-2)}.col-success-bg-2{background-color:var(--col-success-bg-2)}.col-warning-bg-2{background-color:var(--col-warning-bg-2)}.col-error-bg-2{background-color:var(--col-error-bg-2)}.col-bg-3-lighter{background-color:var(--col-bg-3-lighter)}.col-bg-3{background-color:var(--col-bg-3)}.col-bg-3-darker{background-color:var(--col-bg-3-darker)}.col-bg-3-button{background-color:var(--col-bg-3-button)}.col-bg-3-input{background-color:var(--col-bg-3-input)}.col-primary-bg-3{background-color:var(--col-primary-bg-3)}.col-accent-bg-3{background-color:var(--col-accent-bg-3)}.col-success-bg-3{background-color:var(--col-success-bg-3)}.col-warning-bg-3{background-color:var(--col-warning-bg-3)}.col-error-bg-3{background-color:var(--col-error-bg-3)}.col-bg-ack-lighter{background-color:var(--col-bg-ack-lighter)}.col-bg-ack{background-color:var(--col-bg-ack)}.col-bg-ack-darker{background-color:var(--col-bg-ack-darker)}.col-primary-bg-ack{background-color:var(--col-primary-bg-ack)}.col-accent-bg-ack{background-color:var(--col-accent-bg-ack)}.col-bg-att-lighter{background-color:var(--col-bg-att-lighter)}.col-bg-att{background-color:var(--col-bg-att)}.col-bg-att-darker{background-color:var(--col-bg-att-darker)}.col-primary-bg-att{background-color:var(--col-primary-bg-att)}.col-accent-bg-att{background-color:var(--col-accent-bg-att)}.col-bg-alert-lighter{background-color:var(--col-bg-alert-lighter)}.col-bg-alert{background-color:var(--col-bg-alert)}.col-bg-alert-darker{background-color:var(--col-bg-alert-darker)}.col-primary-bg-alert{background-color:var(--col-primary-bg-alert)}.col-accent-bg-alert{background-color:var(--col-accent-bg-alert)}.col-bg-btn-lighter{background-color:var(--col-bg-btn-lighter)}.col-bg-btn{background-color:var(--col-bg-btn)}.col-bg-btn-darker{background-color:var(--col-bg-btn-darker)}.col-primary-bg-btn{background-color:var(--col-primary-bg-btn)}.col-accent-bg-btn{background-color:var(--col-accent-bg-btn)}.pattern-diagonal-stripes-sm{background:repeating-linear-gradient(45deg,transparent,transparent 10px,currentColor 10px,currentColor 20px)}.pattern-dots-lg{background-image:radial-gradient(currentColor 1.5px,transparent 1.5px);background-size:15px 15px}.pattern-dots-md{background-image:radial-gradient(currentColor 1px,transparent 1px);background-size:8px 8px}.pattern-dots-medium-dense{background-image:radial-gradient(currentColor .5px,transparent .5px);background-size:3px 3px}.pattern-dots-sm{background-image:radial-gradient(currentColor .5px,transparent .5px);background-size:5px 5px}.pattern-cross-dots-md,.imagelist-background{background-image:radial-gradient(currentColor .7px,transparent 1px),radial-gradient(currentColor .7px,transparent 1px);background-size:6.5px 6.5px;background-position:0 0,3.5px 3.5px}.imagelist-background{background-color:#fff9;background-blend-mode:overlay}p,div{padding:0;margin:0;border:0px;user-select:text}select{user-select:none}.fa,.fas{font-family:"Font Awesome 5 Free";font-weight:900;font-style:normal}.fa-trash:before{content:"\\f1f8"}.fa-view-grid:before{content:"\\f00a"}.fa-reload:before{content:"\\f021"}.fa-view-list:before{content:"\\f039"}.fa-camera:before{content:"\\f030"}.fa-view-image:before{content:"\\f03e"}.fa-check:before{content:"\\f00c"}.fa-bug:before{content:"\\f05a"}.fa-lightbulb:before{content:"\\f0eb"}p,div{user-select:none}.workstation-card{background:linear-gradient(to right bottom,var(--col-bg-1-darker),var(--col-bg-1-lighter));font-family:var(--standard-text-font);padding:.5em;border:2px solid var(--col-bg-1-darker);border-radius:5px;box-shadow:3px 3px 4px -2px var(--col-bg-1-darker);cursor:pointer}.workstation-card:hover,.workstation-cardfocus{background:var(--col-bg-1-lighter);border:2px solid var(--col-bg-btn);box-shadow:0 0 6px 1px var(--col-bg-btn)}.workstation-card:active{background:var(--col-bg-1-darker);border:2px solid var(--col-bg-body);box-shadow:0 0 6px 1px var(--col-bg-body)}.workstation-card.workstation-disabled{opacity:.75}.card-header{display:flex;flex-direction:row;align-items:center;padding:.25em;margin-bottom:.25em;background-color:var(--col-bg-1-darker)}.card-icon{font-size:32px;line-height:36px;color:var(--col-primary-bg-1);width:36px;height:36px}.title{margin-left:1em;font-weight:bold;color:var(--col-primary-bg-1);display:flex;flex-direction:row;justify-content:space-between;width:100%}.title span{display:block}.title span:nth-child(1){color:var(--col-accent-bg-1)}.title span:nth-child(2){padding-right:.5em}.title-state{background-color:var(--col-bg-ack);color:var(--col-primary-bg-ack);text-align:center;padding:.25em 0}.title-state.processing{background-color:var(--col-bg-att);color:var(--col-primary-bg-att)}.title-state.error{background-color:var(--col-bg-alert);color:var(--col-primary-bg-alert)}.kiosk-btn{border-radius:5px;border-style:solid;border-width:2px;background-color:var(--col-bg-btn);color:var(--col-primary-bg-btn);border-color:var(--col-bg-btn-darker);cursor:pointer;white-space:nowrap}.kiosk-btn:hover,.kiosk-btn:focus{outline:none;background-color:var(--col-bg-btn-lighter)}.kiosk-btn:active{margin-bottom:0;margin-top:2px;padding-left:2px;color:var(--col-primary-bg-btn);background-color:var(--col-bg-ack);border-color:var(--col-bg-ack-darker)}.kiosk-btn *{user-select:none;-moz-user-select:none;-webkit-user-select:none}.card-body{display:flex;flex-direction:row;margin-top:.5em}@media only screen and (max-width : 900px){.card-body{flex-direction:column}}.card-body .ws-info{display:flex;flex-direction:column;justify-content:center;height:100%}.card-body .ws-info>div{text-align:center}.card-body .job-info{display:flex;flex-direction:row;align-items:center;margin-left:.25em}@media only screen and (max-width : 900px){.card-body .job-info{margin-top:.25em;margin-left:0}}.card-body .job-info.error{font-size:1em}.card-body .job-info i{margin-right:.5em;margin-left:.2em;font-size:1.5em;color:var(--col-accent-bg-btn)}sl-progress-ring{min-width:48px;height:48px;align-self:center;margin-left:.5em;margin-right:.5em}.card-body>div{background-color:var(--col-bg-2);padding:.25em;min-height:3em;flex-basis:100%}.job-warnings{display:flex;flex-direction:row;align-items:center;justify-content:space-between;color:var(--col-accent-bg-2);text-align:left}.job-warnings p{width:100%;text-align:center}.job-warnings button{width:auto;padding-right:.5em}.spacer{width:100%;height:2px;background-color:var(--col-bg-1);margin:.5em 0}.job-cancelled-label{color:var(--col-error-bg-2)}\n';
var styles = "/**\n * @prop --track-color: The track color.\n * @prop --indicator-color: The indicator color.\n */\n:host {\n  --track-color: var(--col-bg-2-lighter);\n  --indicator-color: var(--col-accent-bg-2);\n  --stroke-width: 6px;\n  display: inline-flex;\n}\n\n.progress-ring {\n  display: inline-flex;\n  align-items: center;\n  justify-content: center;\n  position: relative;\n}\n\n.progress-ring__image {\n  transform-origin: 50% 50%;\n}\n\n.progress-ring__track {\n  stroke: var(--track-color);\n}\n\n.progress-ring__indicator {\n  stroke: var(--indicator-color);\n  transition: 0.35s stroke-dashoffset, 0.35s stroke;\n}\n\n.progress-ring__label {\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  position: absolute;\n  top: 0;\n  left: 0;\n  width: 100%;\n  font-size: 0.9em;\n  text-align: center;\n  user-select: none;\n}\n\n.spinner {\n  display: inline-block;\n  width: 100%;\n  border-radius: 50%;\n  border: solid var(--stroke-width) var(--col-bg-2-lighter);\n  border-top-color: var(--col-accent-bg-2);\n  border-right-color: var(--col-accent-bg-2);\n  animation: 1s linear infinite spin;\n}\n\n@keyframes spin {\n  0% {\n    transform: rotate(0deg);\n  }\n  100% {\n    transform: rotate(360deg);\n  }\n}";
var __defProp$2 = Object.defineProperty;
var __getOwnPropDesc$2 = Object.getOwnPropertyDescriptor;
var __decorateClass$2 = (decorators, target, key, kind) => {
  var result = kind > 1 ? void 0 : kind ? __getOwnPropDesc$2(target, key) : target;
  for (var i2 = decorators.length - 1, decorator; i2 >= 0; i2--)
    if (decorator = decorators[i2])
      result = (kind ? decorator(target, key, result) : decorator(result)) || result;
  if (kind && result)
    __defProp$2(target, key, result);
  return result;
};
let SlProgressRing = class extends s {
  constructor() {
    super(...arguments);
    this.size = 128;
    this.strokeWidth = 4;
  }
  firstUpdated() {
  }
  updated() {
    if (this.percentage > -1) {
      const radius = this.indicator.r.baseVal.value;
      const circumference = radius * 2 * Math.PI;
      const offset = circumference - this.percentage / 100 * circumference;
      this.ring.style.transform = `rotate(-90deg) translateY(-${this.strokeWidth / 2}px)`;
      this.label.style.transform = `rotate(90deg) translateX(${this.strokeWidth * 2}px)`;
      this.indicator.style.strokeDasharray = `${circumference} ${circumference}`;
      this.indicator.style.strokeDashoffset = `${offset}`;
    }
  }
  render() {
    if (this.percentage == -1) {
      return p` <span class="spinner" aria-busy="true" aria-live="polite"></span> `;
    } else
      return p`
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
SlProgressRing.styles = o$4(styles);
__decorateClass$2([
  i(".progress-ring")
], SlProgressRing.prototype, "ring", 2);
__decorateClass$2([
  i(".progress-ring__indicator")
], SlProgressRing.prototype, "indicator", 2);
__decorateClass$2([
  i(".progress-ring__label")
], SlProgressRing.prototype, "label", 2);
__decorateClass$2([
  e({ type: Number })
], SlProgressRing.prototype, "size", 2);
__decorateClass$2([
  e({ attribute: "stroke-width", type: Number })
], SlProgressRing.prototype, "strokeWidth", 2);
__decorateClass$2([
  e({ type: Number, reflect: true })
], SlProgressRing.prototype, "percentage", 2);
SlProgressRing = __decorateClass$2([
  n("sl-progress-ring")
], SlProgressRing);
var __defProp$1 = Object.defineProperty;
var __getOwnPropDesc$1 = Object.getOwnPropertyDescriptor;
var __decorateClass$1 = (decorators, target, key, kind) => {
  var result = kind > 1 ? void 0 : kind ? __getOwnPropDesc$1(target, key) : target;
  for (var i2 = decorators.length - 1, decorator; i2 >= 0; i2--)
    if (decorator = decorators[i2])
      result = (kind ? decorator(target, key, result) : decorator(result)) || result;
  if (kind && result)
    __defProp$1(target, key, result);
  return result;
};
let WorkstationCard = class extends KioskApp {
  constructor() {
    super();
    this.fetching = false;
    this.fetch_error = "";
    this.workstation_data = new Workstation();
    this.percentage = -1;
    this.showJobInfo = false;
    this.jobMessage = "";
    this.jobError = "";
    this.jobHasWarnings = false;
    this.jobIsRunning = false;
    this.jobGotCanceled = false;
    this._init();
  }
  static get properties() {
    return __spreadProps(__spreadValues({}, super.properties), {
      fetching: { type: Boolean },
      workstation_id: { type: String },
      workstation_data: { type: Object }
    });
  }
  _init() {
  }
  cardClicked(e2) {
    if (this.jobIsRunning) {
      this.askCancelJob();
    } else {
      let route = this.apiContext.getKioskRoute(`${this.workstation_data.workstation_class.toLowerCase()}.workstation_actions`);
      _kioskOpenModalDialog(`${route}/${this.workstation_id}`, {
        closeOnBgClick: false,
        showCloseBtn: true,
        callbacks: {
          close: () => {
            this.dispatchEvent(new CustomEvent("fetch-workstations", {
              bubbles: true,
              cancelable: true
            }));
          },
          ajaxFailed: () => {
            $.magnificPopup.close();
            _KioskErrorToast('Sorry, there is no access to the actions panel of this workstation. Presumably your session has timed out <a href="/logout">Try a fresh log in.</a>');
          }
        }
      });
    }
  }
  showLog(e2) {
    e2.stopPropagation();
    gotoPage(this.workstation_data.actions["log"]);
  }
  apiRender() {
    console.log(`rendering card ${this.workstation_id}:`);
    console.log(this.workstation_data);
    this._calc_job_progress();
    return p`
            <div
                id="${this.workstation_id}"
                class="workstation-card ${this.workstation_data.disabled ? "workstation-disabled" : void 0}"
                @click="${this.cardClicked}">
                <div class="card-header">
                    ${this.workstation_data.icon_code ? p` <div class="card-icon">
                              <i class="fas">${this.workstation_data.icon_code}</i>
                          </div>` : this.workstation_data.icon_url ? p` <div
                              class="card-icon"
                              style="background-image:url(${this.workstation_data.icon_url})"
                          ></div>` : p` <div class="card-icon">
                              <i class="fas"></i>
                          </div>`}

                    <div class="title">
                        <span>${this.workstation_data.description}</span>
                        <span>[${this.workstation_id}]</span>
                    </div>
                </div>
                ${this.showJobInfo && (!this.jobHasWarnings || this.jobError) ? p`
                          ${this.jobError ? p` <div class="title-state error">${this.jobError}</div>` : p` <div class="title-state processing">
                                    ${this.workstation_data.job_status_code == JOB_STATUS_REGISTERED ? "pending..." : "processing..."}
                                </div>`}
                      ` : p` <div class="title-state">${this.workstation_data.state_text}</div>`}

                <div class="card-body">
                    ${!this.jobIsRunning ? p` <div class="ws-info">
                              <div class="job-warnings">
                                  ${this.jobHasWarnings ? p`<p>The last task was successful but returned warnings</p>` : p`${this.jobGotCanceled ? p`<p>
                                                  <span class="job-cancelled-label">The last task got cancelled</span>
                                              </p>` : void 0}`}
                                  ${this.jobError ? p`<p>There is more information available.</p>` : void 0}
                                  ${this.jobError || this.jobHasWarnings ? p` <button @click=${this.showLog} class="kiosk-btn job-info error">
                                            <i class="fas fa-bug"></i>
                                            <div>See details</div>
                                        </button>` : void 0}
                              </div>
                              ${this.jobError || this.jobHasWarnings ? p` <div class="spacer"></div>` : void 0}
                              <div>
                                  ${this.workstation_data.disabled ? p`This workstation is disabled. Please click to reactivate it.` : p`${this.workstation_data.state_description}`}
                              </div>
                          </div>` : void 0}
                    ${this.showJobInfo && !this.jobError && !this.jobHasWarnings ? p` <div class="job-info">
                              <sl-progress-ring percentage="${this.percentage}" size="54" stroke-width="6">
                                  ${this.percentage > 0 ? p`${this.percentage}%` : void 0}
                              </sl-progress-ring>
                              <div>${this.jobMessage}</div>
                          </div>` : void 0}
                </div>
            </div>
        `;
  }
  _calc_job_progress() {
    const job_progress = this.workstation_data.job_progress;
    this.jobError = "";
    this.jobHasWarnings = false;
    this.jobGotCanceled = false;
    if ("job_status_code" in this.workstation_data && this.workstation_data.job_status_code) {
      if (this.workstation_data.job_status_code < JOB_STATUS_DONE) {
        this.showJobInfo = true;
        if ("progress" in job_progress && job_progress.progress) {
          this.percentage = job_progress.progress;
          this.jobMessage = job_progress.message;
        } else {
          this.percentage = -1;
          this.jobMessage = job_progress.message;
        }
        this.jobIsRunning = true;
      } else {
        this.jobIsRunning = false;
        if ("success" in this.workstation_data.job_result) {
          if (this.workstation_data.job_result.success) {
            this.percentage = 100;
            this.jobMessage = "finished";
            if (this.workstation_data.job_result.has_warnings)
              this.jobHasWarnings = true;
            this.showJobInfo = this.jobHasWarnings;
          } else {
            this.percentage = job_progress.progress;
            this.jobMessage = "click to see details";
            this.showJobInfo = true;
            this.jobError = this.workstation_data.job_result.message;
          }
        } else {
          if (this.workstation_data.job_status_code == JOB_STATUS_CANCELED) {
            this.percentage = 0;
            this.showJobInfo = false;
            this.jobIsRunning = false;
            this.jobGotCanceled = true;
          } else {
            this.percentage = job_progress.progress;
            this.jobMessage = this.workstation_data.job_result.message;
          }
        }
      }
    } else {
      this.percentage = 0;
      this.showJobInfo = false;
      this.jobMessage = "";
      this.jobIsRunning = false;
    }
    console.log(`job info for workstation ${this.workstation_id}: ${this.workstation_data.job_status_code}`);
  }
  askCancelJob() {
    _kioskYesNoToast(`${this.workstation_data.description} is currently on the job. <br>
        Do you want to cancel that job?`, () => {
      this.cancelJob();
    }, () => {
      this.triggerReloadWorkstations();
    }, {
      backgroundColor: "var(--col-bg-att)",
      messageColor: "var(--col-primary-bg-att)",
      iconColor: "var(--col-accent-bg-att)"
    });
  }
  triggerReloadWorkstations() {
    this.dispatchEvent(new CustomEvent("fetch-workstations", {
      bubbles: true,
      cancelable: false
    }));
  }
  cancelJob() {
    console.log("cancelling job for workstation " + this.workstation_id);
    this.apiContext.fetchFromApi("syncmanager", `workstation/${this.workstation_id}/job`, {
      method: "DELETE",
      caller: "workstationcard.cancelJob"
    }).then((data) => {
      if (data.result_msg !== "ok") {
        _KioskErrorToast(`It was not possible to cancel the job: <strong>${data.result_msg}</strong>`);
      }
      this.triggerReloadWorkstations();
    }).catch((e2) => {
      handleCommonFetchErrors(this, e2, "workstationlist.fetchWorkstations", () => {
        _KioskErrorToast(`It was not possible to cancel the job because of an error ${e2}.`);
      });
    });
  }
};
WorkstationCard.styles = o$4(local_css$2);
WorkstationCard = __decorateClass$1([
  n("workstation-card")
], WorkstationCard);
var local_css$1 = '.col-bg-body-lighter{background-color:var(--col-bg-body-lighter)}.col-bg-body{background-color:var(--col-bg-body)}.col-bg-body-darker{background-color:var(--col-bg-body-darker)}.col-bg-1-lighter{background-color:var(--col-bg-1-lighter)}.col-bg-1{background-color:var(--col-bg-1)}.col-bg-1-darker{background-color:var(--col-bg-1-darker)}.col-bg-1-input{background-color:var(--col-bg-1-input)}.col-primary-bg-1{background-color:var(--col-primary-bg-1)}.col-accent-bg-1{background-color:var(--col-accent-bg-1)}.col-success-bg-1{background-color:var(--col-success-bg-1)}.col-warning-bg-1{background-color:var(--col-warning-bg-1)}.col-error-bg-1{background-color:var(--col-error-bg-1)}.col-bg-2-lighter{background-color:var(--col-bg-2-lighter)}.col-bg-2{background-color:var(--col-bg-2)}.col-bg-2-darker{background-color:var(--col-bg-2-darker)}.col-bg-2-button{background-color:var(--col-bg-2-button)}.col-bg-2-input{background-color:var(--col-bg-2-input)}.col-primary-bg-2{background-color:var(--col-primary-bg-2)}.col-accent-bg-2{background-color:var(--col-accent-bg-2)}.col-success-bg-2{background-color:var(--col-success-bg-2)}.col-warning-bg-2{background-color:var(--col-warning-bg-2)}.col-error-bg-2{background-color:var(--col-error-bg-2)}.col-bg-3-lighter{background-color:var(--col-bg-3-lighter)}.col-bg-3{background-color:var(--col-bg-3)}.col-bg-3-darker{background-color:var(--col-bg-3-darker)}.col-bg-3-button{background-color:var(--col-bg-3-button)}.col-bg-3-input{background-color:var(--col-bg-3-input)}.col-primary-bg-3{background-color:var(--col-primary-bg-3)}.col-accent-bg-3{background-color:var(--col-accent-bg-3)}.col-success-bg-3{background-color:var(--col-success-bg-3)}.col-warning-bg-3{background-color:var(--col-warning-bg-3)}.col-error-bg-3{background-color:var(--col-error-bg-3)}.col-bg-ack-lighter{background-color:var(--col-bg-ack-lighter)}.col-bg-ack{background-color:var(--col-bg-ack)}.col-bg-ack-darker{background-color:var(--col-bg-ack-darker)}.col-primary-bg-ack{background-color:var(--col-primary-bg-ack)}.col-accent-bg-ack{background-color:var(--col-accent-bg-ack)}.col-bg-att-lighter{background-color:var(--col-bg-att-lighter)}.col-bg-att{background-color:var(--col-bg-att)}.col-bg-att-darker{background-color:var(--col-bg-att-darker)}.col-primary-bg-att{background-color:var(--col-primary-bg-att)}.col-accent-bg-att{background-color:var(--col-accent-bg-att)}.col-bg-alert-lighter{background-color:var(--col-bg-alert-lighter)}.col-bg-alert{background-color:var(--col-bg-alert)}.col-bg-alert-darker{background-color:var(--col-bg-alert-darker)}.col-primary-bg-alert{background-color:var(--col-primary-bg-alert)}.col-accent-bg-alert{background-color:var(--col-accent-bg-alert)}.col-bg-btn-lighter{background-color:var(--col-bg-btn-lighter)}.col-bg-btn{background-color:var(--col-bg-btn)}.col-bg-btn-darker{background-color:var(--col-bg-btn-darker)}.col-primary-bg-btn{background-color:var(--col-primary-bg-btn)}.col-accent-bg-btn{background-color:var(--col-accent-bg-btn)}.pattern-diagonal-stripes-sm,.recording-group-background{background:repeating-linear-gradient(45deg,transparent,transparent 10px,currentColor 10px,currentColor 20px)}.pattern-dots-lg{background-image:radial-gradient(currentColor 1.5px,transparent 1.5px);background-size:15px 15px}.pattern-dots-md{background-image:radial-gradient(currentColor 1px,transparent 1px);background-size:8px 8px}.pattern-dots-medium-dense{background-image:radial-gradient(currentColor .5px,transparent .5px);background-size:3px 3px}.pattern-dots-sm{background-image:radial-gradient(currentColor .5px,transparent .5px);background-size:5px 5px}.pattern-cross-dots-md,.imagelist-background{background-image:radial-gradient(currentColor .7px,transparent 1px),radial-gradient(currentColor .7px,transparent 1px);background-size:6.5px 6.5px;background-position:0 0,3.5px 3.5px}.imagelist-background{background-color:#fff9;background-blend-mode:overlay}.fa,.fas{font-family:"Font Awesome 5 Free";font-weight:900;font-style:normal}.fa-trash:before{content:"\\f1f8"}.fa-view-grid:before{content:"\\f00a"}.fa-reload:before{content:"\\f021"}.fa-view-list:before{content:"\\f039"}.fa-camera:before{content:"\\f030"}.fa-view-image:before{content:"\\f03e"}.fa-check:before{content:"\\f00c"}.fa-bug:before{content:"\\f05a"}.fa-lightbulb:before{content:"\\f0eb"}p,div{padding:0;margin:0;border:0px;user-select:text}select{user-select:none}.kiosk-btn{display:grid;place-content:center;border-radius:5px;border-style:solid;border-width:2px;background:var(--col-bg-btn);color:var(--col-primary-bg-btn);border-color:var(--col-bg-btn-darker);cursor:pointer;white-space:nowrap}.kiosk-btn:hover,.kiosk-btn:focus{outline:none;background-color:var(--col-bg-btn-lighter)}.kiosk-btn:active{margin-bottom:0;margin-top:2px;padding-left:2px;color:var(--col-primary-bg-btn);background-color:var(--col-bg-ack);border-color:var(--col-bg-ack-darker)}.kiosk-btn *{user-select:none;-moz-user-select:none;-webkit-user-select:none}.recording-group{display:block;flex-direction:column;margin:1em .5em 2em 0}.recording-group-header{width:20ch;border-top-right-radius:15px;background:linear-gradient(to right bottom,var(--col-bg-1-darker),var(--col-bg-1-lighter));background-color:#ffffffe6;background-blend-mode:color;padding:5px;font-weight:bold}.recording-group-body{position:relative;display:grid;grid-template-columns:1fr 1fr;column-gap:1em;row-gap:1em;padding:1em}@media only screen and (max-width : 700px){.recording-group-body{grid-template-columns:1fr}}.recording-group-background{position:absolute;width:100%;height:100%;border-radius:15px;color:var(--col-bg-1);opacity:10%;z-index:-1}.one-recording-group{display:grid;grid-template-columns:1fr 1fr;column-gap:1em;row-gap:1em;padding:1em}@media only screen and (max-width : 700px){.one-recording-group{grid-template-columns:1fr}}.synchronization-running{height:80vh;width:100%;display:grid;place-items:center;position:fixed;background:var(--col-bg-body)}.synchronization-running .synchronization-reminder{padding:1.5em}.synchronization-reminder{background-color:var(--col-bg-att);border:1px solid var(--col-bg-att-darker);padding:.5em;margin:.5em 0;display:flex}.synchronization-reminder p{padding-left:1em}.synchronization-reminder i{font-size:1.2em}\n';
var __defProp2 = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __decorateClass = (decorators, target, key, kind) => {
  var result = kind > 1 ? void 0 : kind ? __getOwnPropDesc(target, key) : target;
  for (var i2 = decorators.length - 1, decorator; i2 >= 0; i2--)
    if (decorator = decorators[i2])
      result = (kind ? decorator(target, key, result) : decorator(result)) || result;
  if (kind && result)
    __defProp2(target, key, result);
  return result;
};
let WorkstationList = class extends KioskApp {
  constructor() {
    super();
    this.fetching = false;
    this.fetch_error = "";
    this.workstations = {};
    this.timeoutId = null;
    this.fetchingStopped = false;
    this.sync_status = -1;
    this._init();
  }
  static get properties() {
    return __spreadProps(__spreadValues({}, super.properties), {
      fetching: { type: Boolean },
      sync_status: { type: Number },
      workstations: { type: Object }
    });
  }
  _init() {
  }
  fetchWorkstations() {
    if (this.timeoutId)
      clearTimeout(this.timeoutId);
    if (this.fetchingStopped)
      return;
    console.log("fetching workstations");
    this.apiContext.fetchFromApi("syncmanager", "workstations", {
      method: "GET",
      caller: "workstationlist.fetchWorkstations"
    }).then((data) => {
      if (data.result_msg !== "ok") {
        this.fetch_error = data.result_msg;
      } else {
        this.fetch_error = "";
        try {
          this.processData(data.workstations);
        } finally {
          let poll_delay = data.poll_delay;
          console.log(`Poll delay is ${poll_delay}`);
          this.timeoutId = setTimeout(this.fetchWorkstations.bind(this), poll_delay * 1e3);
          this.sync_status = data.sync_status;
          console.log(`Poll delay is ${this.sync_status}`);
        }
      }
      this.fetching = false;
    }).catch((e2) => {
      handleCommonFetchErrors(this, e2, "workstationlist.fetchWorkstations", null);
    });
  }
  processData(data) {
    let workstations = {};
    data.forEach((r2) => {
      let workstation = new Workstation();
      workstation.from_dict(r2);
      if (workstation.description || workstation.job_status_code != JOB_STATUS_DONE) {
        console.log(`pushing workstation ${workstation.workstation_id}`);
        workstations[workstation.workstation_id] = workstation;
      } else {
        console.log(`workstation ${workstation.workstation_id} not listed.`);
      }
    });
    this.workstations = workstations;
  }
  firstUpdated(_changedProperties) {
    super.firstUpdated(_changedProperties);
    this.shadowRoot.addEventListener("fetch-workstations", function() {
      this.fetchWorkstations();
    }.bind(this));
    this.fetchWorkstations();
  }
  updated(_changedProperties) {
    super.updated(_changedProperties);
  }
  stopFetching() {
    this.fetchingStopped = true;
    console.log("Stopped fetching.");
  }
  getRecordingGroups() {
    let result = {};
    Object.values(this.workstations).map((workstation) => {
      if (!(workstation.recording_group in result))
        result[workstation.recording_group] = [];
      result[workstation.recording_group].push(workstation.workstation_id);
    });
    return result;
  }
  renderWorkstationCards(workstations) {
    return p`${workstations.map((workstation_id) => p`
                        <workstation-card
                                .apiContext="${this.apiContext}"
                                .workstation_id="${workstation_id}"
                                .workstation_data="${this.workstations[workstation_id]}">
                        </workstation-card>
                    `)}`;
  }
  renderSynchronizationRunning() {
    return p`
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
    console.log("rendering workstations");
    const recordingGroupsAndWorkstations = this.getRecordingGroups();
    const recordingGroups = Object.keys(recordingGroupsAndWorkstations);
    if (this.sync_status >= JOB_STATUS_REGISTERED && this.sync_status < JOB_STATUS_DONE) {
      return this.renderSynchronizationRunning();
    } else {
      return p`
                ${void 0}
                ${this.sync_status != -1 ? p`
                        <div class="synchronization-reminder">
                            <i class="fas fa-lightbulb"></i><p>The recently started synchronization has ended.</p> 
                            <p><a href="${this.apiContext.getKioskRoute("syncmanager.synchronization_progress")}">
                                Click here to see the results.</a></p>  
                        </div>
                    ` : void 0}
                ${recordingGroups.length > 1 ? p`${recordingGroups.map((recordingGroup) => p`
                                    <div id="${recordingGroup}" class="recording-group">
                                        <div class="recording-group-header">${recordingGroup}</div>
                                        <div class="recording-group-body">
                                            <div class="recording-group-background">
                                            </div>
                                            ${this.renderWorkstationCards(recordingGroupsAndWorkstations[recordingGroup])}
                                        </div>
                                    </div>`)}` : p`
                            <div class="one-recording-group">
                                ${recordingGroups.length > 0 ? p`${this.renderWorkstationCards(recordingGroupsAndWorkstations[recordingGroups[0]])}` : void 0}
                            </div>
                        `}
            `;
    }
  }
};
WorkstationList.styles = o$4(local_css$1);
WorkstationList = __decorateClass([
  n("workstation-list")
], WorkstationList);
var local_css = '.col-bg-body-lighter{background-color:var(--col-bg-body-lighter)}.col-bg-body{background-color:var(--col-bg-body)}.col-bg-body-darker{background-color:var(--col-bg-body-darker)}.col-bg-1-lighter{background-color:var(--col-bg-1-lighter)}.col-bg-1{background-color:var(--col-bg-1)}.col-bg-1-darker{background-color:var(--col-bg-1-darker)}.col-bg-1-input{background-color:var(--col-bg-1-input)}.col-primary-bg-1{background-color:var(--col-primary-bg-1)}.col-accent-bg-1{background-color:var(--col-accent-bg-1)}.col-success-bg-1{background-color:var(--col-success-bg-1)}.col-warning-bg-1{background-color:var(--col-warning-bg-1)}.col-error-bg-1{background-color:var(--col-error-bg-1)}.col-bg-2-lighter{background-color:var(--col-bg-2-lighter)}.col-bg-2{background-color:var(--col-bg-2)}.col-bg-2-darker{background-color:var(--col-bg-2-darker)}.col-bg-2-button{background-color:var(--col-bg-2-button)}.col-bg-2-input{background-color:var(--col-bg-2-input)}.col-primary-bg-2{background-color:var(--col-primary-bg-2)}.col-accent-bg-2{background-color:var(--col-accent-bg-2)}.col-success-bg-2{background-color:var(--col-success-bg-2)}.col-warning-bg-2{background-color:var(--col-warning-bg-2)}.col-error-bg-2{background-color:var(--col-error-bg-2)}.col-bg-3-lighter{background-color:var(--col-bg-3-lighter)}.col-bg-3{background-color:var(--col-bg-3)}.col-bg-3-darker{background-color:var(--col-bg-3-darker)}.col-bg-3-button{background-color:var(--col-bg-3-button)}.col-bg-3-input{background-color:var(--col-bg-3-input)}.col-primary-bg-3{background-color:var(--col-primary-bg-3)}.col-accent-bg-3{background-color:var(--col-accent-bg-3)}.col-success-bg-3{background-color:var(--col-success-bg-3)}.col-warning-bg-3{background-color:var(--col-warning-bg-3)}.col-error-bg-3{background-color:var(--col-error-bg-3)}.col-bg-ack-lighter{background-color:var(--col-bg-ack-lighter)}.col-bg-ack{background-color:var(--col-bg-ack)}.col-bg-ack-darker{background-color:var(--col-bg-ack-darker)}.col-primary-bg-ack{background-color:var(--col-primary-bg-ack)}.col-accent-bg-ack{background-color:var(--col-accent-bg-ack)}.col-bg-att-lighter{background-color:var(--col-bg-att-lighter)}.col-bg-att{background-color:var(--col-bg-att)}.col-bg-att-darker{background-color:var(--col-bg-att-darker)}.col-primary-bg-att{background-color:var(--col-primary-bg-att)}.col-accent-bg-att{background-color:var(--col-accent-bg-att)}.col-bg-alert-lighter{background-color:var(--col-bg-alert-lighter)}.col-bg-alert{background-color:var(--col-bg-alert)}.col-bg-alert-darker{background-color:var(--col-bg-alert-darker)}.col-primary-bg-alert{background-color:var(--col-primary-bg-alert)}.col-accent-bg-alert{background-color:var(--col-accent-bg-alert)}.col-bg-btn-lighter{background-color:var(--col-bg-btn-lighter)}.col-bg-btn{background-color:var(--col-bg-btn)}.col-bg-btn-darker{background-color:var(--col-bg-btn-darker)}.col-primary-bg-btn{background-color:var(--col-primary-bg-btn)}.col-accent-bg-btn{background-color:var(--col-accent-bg-btn)}.pattern-diagonal-stripes-sm{background:repeating-linear-gradient(45deg,transparent,transparent 10px,currentColor 10px,currentColor 20px)}.pattern-dots-lg{background-image:radial-gradient(currentColor 1.5px,transparent 1.5px);background-size:15px 15px}.pattern-dots-md{background-image:radial-gradient(currentColor 1px,transparent 1px);background-size:8px 8px}.pattern-dots-medium-dense{background-image:radial-gradient(currentColor .5px,transparent .5px);background-size:3px 3px}.pattern-dots-sm{background-image:radial-gradient(currentColor .5px,transparent .5px);background-size:5px 5px}.pattern-cross-dots-md,.imagelist-background{background-image:radial-gradient(currentColor .7px,transparent 1px),radial-gradient(currentColor .7px,transparent 1px);background-size:6.5px 6.5px;background-position:0 0,3.5px 3.5px}.imagelist-background{background-color:#fff9;background-blend-mode:overlay}p,div{padding:0;margin:0;border:0px;user-select:text}select{user-select:none}.fa,.fas{font-family:"Font Awesome 5 Free";font-weight:900;font-style:normal}.fa-trash:before{content:"\\f1f8"}.fa-view-grid:before{content:"\\f00a"}.fa-reload:before{content:"\\f021"}.fa-view-list:before{content:"\\f039"}.fa-camera:before{content:"\\f030"}.fa-view-image:before{content:"\\f03e"}.fa-check:before{content:"\\f00c"}.fa-bug:before{content:"\\f05a"}.fa-lightbulb:before{content:"\\f0eb"}:host{display:block;width:100%}div,p{font-family:var(--standard-text-font)}.center-div{display:flex;flex-direction:column;align-items:center;background:var(--col-bg-body)}.wait-for-login{display:grid;place-items:center;height:100vh;background-color:var(--col-bg-body)}.wait-for-login p{font-family:var(--headline-text-font);font-size:var(--font-size-h2)}.logged-in-message{background-color:var(--col-bg-ack);color:var(--col-primary-bg-ack);display:grid;place-items:center;font-family:var(--standard-text-font)}.development{background-color:#8b0000;color:#fff;font-family:"Courier New",sans-serif;font-size:18px;text-align:center}.toolbar{height:3em;background:var(--col-bg-3);display:flex;flex-direction:row;padding:0 1em;justify-content:space-between}#toolbar-filters{flex-grow:1}#toolbar-buttons{background-color:var(--col-bg-3-darker);height:100%;display:flex;flex-direction:row;align-items:center;padding:0 1em}.toolbar-button{color:var(--col-primary-bg-3);height:28px}.toolbar-button i{font-size:28px;line-height:100%}.toolbar-button:hover{color:var(--col-accent-bg-3)}.toolbar-button:active{color:var(--col-bg-ack)}.toolbar-button.disabled{opacity:.3}\n';
class SyncManagerApp extends KioskApp {
  constructor() {
    super();
    this._messages = {};
  }
  static get properties() {
    return __spreadValues({}, super.properties);
  }
  firstUpdated(_changedProperties) {
    super.firstUpdated(_changedProperties);
  }
  updated(_changedProperties) {
    super.updated(_changedProperties);
    if (_changedProperties.has("apiContext")) {
      if (this.apiContext)
        console.log("starting app");
    }
  }
  reloadClicked(e2) {
    let el = this.shadowRoot.getElementById("workstation-list");
    el.shadowRoot.dispatchEvent(new CustomEvent("fetch-workstations", {
      bubbles: true,
      cancelable: false
    }));
  }
  render_toolbar() {
    return p`
            <div class="toolbar">
                <div id="toolbar-filters"></div>
                <div id="toolbar-buttons">
                    <div class="toolbar-button" @click=${this.reloadClicked}>
                        <i class="fas fa-reload"></i>
                    </div>
                </div>
            <div>
        </div>`;
  }
  apiRender() {
    let dev = p``;
    let toolbar = this.render_toolbar();
    let app = p`
            <workstation-list id="workstation-list" .apiContext=${this.apiContext}></workstation-list>`;
    return p`${dev}${toolbar}${app}`;
  }
}
SyncManagerApp.styles = o$4(local_css);
window.customElements.define("syncmanager-app", SyncManagerApp);
export { SyncManagerApp };
