function pn(o) {
  for (var e = 1; e < arguments.length; e++) {
    var n = arguments[e];
    for (var i in n)
      o[i] = n[i];
  }
  return o;
}
var Uu = {
  read: function(o) {
    return o[0] === '"' && (o = o.slice(1, -1)), o.replace(/(%[\dA-F]{2})+/gi, decodeURIComponent);
  },
  write: function(o) {
    return encodeURIComponent(o).replace(
      /%(2[346BF]|3[AC-F]|40|5[BDE]|60|7[BCD])/g,
      decodeURIComponent
    );
  }
};
function Wo(o, e) {
  function n(a, d, f) {
    if (!(typeof document > "u")) {
      f = pn({}, e, f), typeof f.expires == "number" && (f.expires = new Date(Date.now() + f.expires * 864e5)), f.expires && (f.expires = f.expires.toUTCString()), a = encodeURIComponent(a).replace(/%(2[346B]|5E|60|7C)/g, decodeURIComponent).replace(/[()]/g, escape);
      var p = "";
      for (var y in f)
        f[y] && (p += "; " + y, f[y] !== !0 && (p += "=" + f[y].split(";")[0]));
      return document.cookie = a + "=" + o.write(d, a) + p;
    }
  }
  function i(a) {
    if (!(typeof document > "u" || arguments.length && !a)) {
      for (var d = document.cookie ? document.cookie.split("; ") : [], f = {}, p = 0; p < d.length; p++) {
        var y = d[p].split("="), D = y.slice(1).join("=");
        try {
          var F = decodeURIComponent(y[0]);
          if (f[F] = o.read(D, F), a === F)
            break;
        } catch {
        }
      }
      return a ? f[a] : f;
    }
  }
  return Object.create(
    {
      set: n,
      get: i,
      remove: function(a, d) {
        n(
          a,
          "",
          pn({}, d, {
            expires: -1
          })
        );
      },
      withAttributes: function(a) {
        return Wo(this.converter, pn({}, this.attributes, a));
      },
      withConverter: function(a) {
        return Wo(pn({}, this.converter, a), this.attributes);
      }
    },
    {
      attributes: { value: Object.freeze(e) },
      converter: { value: Object.freeze(o) }
    }
  );
}
Wo(Uu, { path: "/" });
const wn = globalThis, oi = wn.ShadowRoot && (wn.ShadyCSS === void 0 || wn.ShadyCSS.nativeShadow) && "adoptedStyleSheets" in Document.prototype && "replace" in CSSStyleSheet.prototype, Bs = /* @__PURE__ */ Symbol(), ns = /* @__PURE__ */ new WeakMap();
let Lu = class {
  constructor(e, n, i) {
    if (this._$cssResult$ = !0, i !== Bs) throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");
    this.cssText = e, this.t = n;
  }
  get styleSheet() {
    let e = this.o;
    const n = this.t;
    if (oi && e === void 0) {
      const i = n !== void 0 && n.length === 1;
      i && (e = ns.get(n)), e === void 0 && ((this.o = e = new CSSStyleSheet()).replaceSync(this.cssText), i && ns.set(n, e));
    }
    return e;
  }
  toString() {
    return this.cssText;
  }
};
const Dr = (o) => new Lu(typeof o == "string" ? o : o + "", void 0, Bs), zu = (o, e) => {
  if (oi) o.adoptedStyleSheets = e.map((n) => n instanceof CSSStyleSheet ? n : n.styleSheet);
  else for (const n of e) {
    const i = document.createElement("style"), a = wn.litNonce;
    a !== void 0 && i.setAttribute("nonce", a), i.textContent = n.cssText, o.appendChild(i);
  }
}, os = oi ? (o) => o : (o) => o instanceof CSSStyleSheet ? ((e) => {
  let n = "";
  for (const i of e.cssRules) n += i.cssText;
  return Dr(n);
})(o) : o;
const { is: Ku, defineProperty: Bu, getOwnPropertyDescriptor: Hu, getOwnPropertyNames: Zu, getOwnPropertySymbols: Yu, getPrototypeOf: Gu } = Object, In = globalThis, is = In.trustedTypes, Ju = is ? is.emptyScript : "", Qu = In.reactiveElementPolyfillSupport, Er = (o, e) => o, On = { toAttribute(o, e) {
  switch (e) {
    case Boolean:
      o = o ? Ju : null;
      break;
    case Object:
    case Array:
      o = o == null ? o : JSON.stringify(o);
  }
  return o;
}, fromAttribute(o, e) {
  let n = o;
  switch (e) {
    case Boolean:
      n = o !== null;
      break;
    case Number:
      n = o === null ? null : Number(o);
      break;
    case Object:
    case Array:
      try {
        n = JSON.parse(o);
      } catch {
        n = null;
      }
  }
  return n;
} }, ii = (o, e) => !Ku(o, e), ss = { attribute: !0, type: String, converter: On, reflect: !1, useDefault: !1, hasChanged: ii };
Symbol.metadata ??= /* @__PURE__ */ Symbol("metadata"), In.litPropertyMetadata ??= /* @__PURE__ */ new WeakMap();
let Ht = class extends HTMLElement {
  static addInitializer(e) {
    this._$Ei(), (this.l ??= []).push(e);
  }
  static get observedAttributes() {
    return this.finalize(), this._$Eh && [...this._$Eh.keys()];
  }
  static createProperty(e, n = ss) {
    if (n.state && (n.attribute = !1), this._$Ei(), this.prototype.hasOwnProperty(e) && ((n = Object.create(n)).wrapped = !0), this.elementProperties.set(e, n), !n.noAccessor) {
      const i = /* @__PURE__ */ Symbol(), a = this.getPropertyDescriptor(e, i, n);
      a !== void 0 && Bu(this.prototype, e, a);
    }
  }
  static getPropertyDescriptor(e, n, i) {
    const { get: a, set: d } = Hu(this.prototype, e) ?? { get() {
      return this[n];
    }, set(f) {
      this[n] = f;
    } };
    return { get: a, set(f) {
      const p = a?.call(this);
      d?.call(this, f), this.requestUpdate(e, p, i);
    }, configurable: !0, enumerable: !0 };
  }
  static getPropertyOptions(e) {
    return this.elementProperties.get(e) ?? ss;
  }
  static _$Ei() {
    if (this.hasOwnProperty(Er("elementProperties"))) return;
    const e = Gu(this);
    e.finalize(), e.l !== void 0 && (this.l = [...e.l]), this.elementProperties = new Map(e.elementProperties);
  }
  static finalize() {
    if (this.hasOwnProperty(Er("finalized"))) return;
    if (this.finalized = !0, this._$Ei(), this.hasOwnProperty(Er("properties"))) {
      const n = this.properties, i = [...Zu(n), ...Yu(n)];
      for (const a of i) this.createProperty(a, n[a]);
    }
    const e = this[Symbol.metadata];
    if (e !== null) {
      const n = litPropertyMetadata.get(e);
      if (n !== void 0) for (const [i, a] of n) this.elementProperties.set(i, a);
    }
    this._$Eh = /* @__PURE__ */ new Map();
    for (const [n, i] of this.elementProperties) {
      const a = this._$Eu(n, i);
      a !== void 0 && this._$Eh.set(a, n);
    }
    this.elementStyles = this.finalizeStyles(this.styles);
  }
  static finalizeStyles(e) {
    const n = [];
    if (Array.isArray(e)) {
      const i = new Set(e.flat(1 / 0).reverse());
      for (const a of i) n.unshift(os(a));
    } else e !== void 0 && n.push(os(e));
    return n;
  }
  static _$Eu(e, n) {
    const i = n.attribute;
    return i === !1 ? void 0 : typeof i == "string" ? i : typeof e == "string" ? e.toLowerCase() : void 0;
  }
  constructor() {
    super(), this._$Ep = void 0, this.isUpdatePending = !1, this.hasUpdated = !1, this._$Em = null, this._$Ev();
  }
  _$Ev() {
    this._$ES = new Promise((e) => this.enableUpdating = e), this._$AL = /* @__PURE__ */ new Map(), this._$E_(), this.requestUpdate(), this.constructor.l?.forEach((e) => e(this));
  }
  addController(e) {
    (this._$EO ??= /* @__PURE__ */ new Set()).add(e), this.renderRoot !== void 0 && this.isConnected && e.hostConnected?.();
  }
  removeController(e) {
    this._$EO?.delete(e);
  }
  _$E_() {
    const e = /* @__PURE__ */ new Map(), n = this.constructor.elementProperties;
    for (const i of n.keys()) this.hasOwnProperty(i) && (e.set(i, this[i]), delete this[i]);
    e.size > 0 && (this._$Ep = e);
  }
  createRenderRoot() {
    const e = this.shadowRoot ?? this.attachShadow(this.constructor.shadowRootOptions);
    return zu(e, this.constructor.elementStyles), e;
  }
  connectedCallback() {
    this.renderRoot ??= this.createRenderRoot(), this.enableUpdating(!0), this._$EO?.forEach((e) => e.hostConnected?.());
  }
  enableUpdating(e) {
  }
  disconnectedCallback() {
    this._$EO?.forEach((e) => e.hostDisconnected?.());
  }
  attributeChangedCallback(e, n, i) {
    this._$AK(e, i);
  }
  _$ET(e, n) {
    const i = this.constructor.elementProperties.get(e), a = this.constructor._$Eu(e, i);
    if (a !== void 0 && i.reflect === !0) {
      const d = (i.converter?.toAttribute !== void 0 ? i.converter : On).toAttribute(n, i.type);
      this._$Em = e, d == null ? this.removeAttribute(a) : this.setAttribute(a, d), this._$Em = null;
    }
  }
  _$AK(e, n) {
    const i = this.constructor, a = i._$Eh.get(e);
    if (a !== void 0 && this._$Em !== a) {
      const d = i.getPropertyOptions(a), f = typeof d.converter == "function" ? { fromAttribute: d.converter } : d.converter?.fromAttribute !== void 0 ? d.converter : On;
      this._$Em = a;
      const p = f.fromAttribute(n, d.type);
      this[a] = p ?? this._$Ej?.get(a) ?? p, this._$Em = null;
    }
  }
  requestUpdate(e, n, i, a = !1, d) {
    if (e !== void 0) {
      const f = this.constructor;
      if (a === !1 && (d = this[e]), i ??= f.getPropertyOptions(e), !((i.hasChanged ?? ii)(d, n) || i.useDefault && i.reflect && d === this._$Ej?.get(e) && !this.hasAttribute(f._$Eu(e, i)))) return;
      this.C(e, n, i);
    }
    this.isUpdatePending === !1 && (this._$ES = this._$EP());
  }
  C(e, n, { useDefault: i, reflect: a, wrapped: d }, f) {
    i && !(this._$Ej ??= /* @__PURE__ */ new Map()).has(e) && (this._$Ej.set(e, f ?? n ?? this[e]), d !== !0 || f !== void 0) || (this._$AL.has(e) || (this.hasUpdated || i || (n = void 0), this._$AL.set(e, n)), a === !0 && this._$Em !== e && (this._$Eq ??= /* @__PURE__ */ new Set()).add(e));
  }
  async _$EP() {
    this.isUpdatePending = !0;
    try {
      await this._$ES;
    } catch (n) {
      Promise.reject(n);
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
        for (const [a, d] of this._$Ep) this[a] = d;
        this._$Ep = void 0;
      }
      const i = this.constructor.elementProperties;
      if (i.size > 0) for (const [a, d] of i) {
        const { wrapped: f } = d, p = this[a];
        f !== !0 || this._$AL.has(a) || p === void 0 || this.C(a, void 0, d, p);
      }
    }
    let e = !1;
    const n = this._$AL;
    try {
      e = this.shouldUpdate(n), e ? (this.willUpdate(n), this._$EO?.forEach((i) => i.hostUpdate?.()), this.update(n)) : this._$EM();
    } catch (i) {
      throw e = !1, this._$EM(), i;
    }
    e && this._$AE(n);
  }
  willUpdate(e) {
  }
  _$AE(e) {
    this._$EO?.forEach((n) => n.hostUpdated?.()), this.hasUpdated || (this.hasUpdated = !0, this.firstUpdated(e)), this.updated(e);
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
    this._$Eq &&= this._$Eq.forEach((n) => this._$ET(n, this[n])), this._$EM();
  }
  updated(e) {
  }
  firstUpdated(e) {
  }
};
Ht.elementStyles = [], Ht.shadowRootOptions = { mode: "open" }, Ht[Er("elementProperties")] = /* @__PURE__ */ new Map(), Ht[Er("finalized")] = /* @__PURE__ */ new Map(), Qu?.({ ReactiveElement: Ht }), (In.reactiveElementVersions ??= []).push("2.1.2");
const si = globalThis, as = (o) => o, En = si.trustedTypes, us = En ? En.createPolicy("lit-html", { createHTML: (o) => o }) : void 0, Hs = "$lit$", st = `lit$${Math.random().toFixed(9).slice(2)}$`, Zs = "?" + st, Xu = `<${Zs}>`, At = document, $r = () => At.createComment(""), Cr = (o) => o === null || typeof o != "object" && typeof o != "function", ai = Array.isArray, ec = (o) => ai(o) || typeof o?.[Symbol.iterator] == "function", Eo = `[ 	
\f\r]`, kr = /<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g, cs = /-->/g, ls = />/g, St = RegExp(`>|${Eo}(?:([^\\s"'>=/]+)(${Eo}*=${Eo}*(?:[^ 	
\f\r"'\`<>=]|("|')|))|$)`, "g"), ds = /'/g, fs = /"/g, Ys = /^(?:script|style|textarea|title)$/i, tc = (o) => (e, ...n) => ({ _$litType$: o, strings: e, values: n }), J = tc(1), Jt = /* @__PURE__ */ Symbol.for("lit-noChange"), pe = /* @__PURE__ */ Symbol.for("lit-nothing"), hs = /* @__PURE__ */ new WeakMap(), Tt = At.createTreeWalker(At, 129);
function Gs(o, e) {
  if (!ai(o) || !o.hasOwnProperty("raw")) throw Error("invalid template strings array");
  return us !== void 0 ? us.createHTML(e) : e;
}
const rc = (o, e) => {
  const n = o.length - 1, i = [];
  let a, d = e === 2 ? "<svg>" : e === 3 ? "<math>" : "", f = kr;
  for (let p = 0; p < n; p++) {
    const y = o[p];
    let D, F, j = -1, Y = 0;
    for (; Y < y.length && (f.lastIndex = Y, F = f.exec(y), F !== null); ) Y = f.lastIndex, f === kr ? F[1] === "!--" ? f = cs : F[1] !== void 0 ? f = ls : F[2] !== void 0 ? (Ys.test(F[2]) && (a = RegExp("</" + F[2], "g")), f = St) : F[3] !== void 0 && (f = St) : f === St ? F[0] === ">" ? (f = a ?? kr, j = -1) : F[1] === void 0 ? j = -2 : (j = f.lastIndex - F[2].length, D = F[1], f = F[3] === void 0 ? St : F[3] === '"' ? fs : ds) : f === fs || f === ds ? f = St : f === cs || f === ls ? f = kr : (f = St, a = void 0);
    const L = f === St && o[p + 1].startsWith("/>") ? " " : "";
    d += f === kr ? y + Xu : j >= 0 ? (i.push(D), y.slice(0, j) + Hs + y.slice(j) + st + L) : y + st + (j === -2 ? p : L);
  }
  return [Gs(o, d + (o[n] || "<?>") + (e === 2 ? "</svg>" : e === 3 ? "</math>" : "")), i];
};
let qo = class Js {
  constructor({ strings: e, _$litType$: n }, i) {
    let a;
    this.parts = [];
    let d = 0, f = 0;
    const p = e.length - 1, y = this.parts, [D, F] = rc(e, n);
    if (this.el = Js.createElement(D, i), Tt.currentNode = this.el.content, n === 2 || n === 3) {
      const j = this.el.content.firstChild;
      j.replaceWith(...j.childNodes);
    }
    for (; (a = Tt.nextNode()) !== null && y.length < p; ) {
      if (a.nodeType === 1) {
        if (a.hasAttributes()) for (const j of a.getAttributeNames()) if (j.endsWith(Hs)) {
          const Y = F[f++], L = a.getAttribute(j).split(st), ee = /([.?@])?(.*)/.exec(Y);
          y.push({ type: 1, index: d, name: ee[2], strings: L, ctor: ee[1] === "." ? oc : ee[1] === "?" ? ic : ee[1] === "@" ? sc : Mn }), a.removeAttribute(j);
        } else j.startsWith(st) && (y.push({ type: 6, index: d }), a.removeAttribute(j));
        if (Ys.test(a.tagName)) {
          const j = a.textContent.split(st), Y = j.length - 1;
          if (Y > 0) {
            a.textContent = En ? En.emptyScript : "";
            for (let L = 0; L < Y; L++) a.append(j[L], $r()), Tt.nextNode(), y.push({ type: 2, index: ++d });
            a.append(j[Y], $r());
          }
        }
      } else if (a.nodeType === 8) if (a.data === Zs) y.push({ type: 2, index: d });
      else {
        let j = -1;
        for (; (j = a.data.indexOf(st, j + 1)) !== -1; ) y.push({ type: 7, index: d }), j += st.length - 1;
      }
      d++;
    }
  }
  static createElement(e, n) {
    const i = At.createElement("template");
    return i.innerHTML = e, i;
  }
};
function Qt(o, e, n = o, i) {
  if (e === Jt) return e;
  let a = i !== void 0 ? n._$Co?.[i] : n._$Cl;
  const d = Cr(e) ? void 0 : e._$litDirective$;
  return a?.constructor !== d && (a?._$AO?.(!1), d === void 0 ? a = void 0 : (a = new d(o), a._$AT(o, n, i)), i !== void 0 ? (n._$Co ??= [])[i] = a : n._$Cl = a), a !== void 0 && (e = Qt(o, a._$AS(o, e.values), a, i)), e;
}
let nc = class {
  constructor(e, n) {
    this._$AV = [], this._$AN = void 0, this._$AD = e, this._$AM = n;
  }
  get parentNode() {
    return this._$AM.parentNode;
  }
  get _$AU() {
    return this._$AM._$AU;
  }
  u(e) {
    const { el: { content: n }, parts: i } = this._$AD, a = (e?.creationScope ?? At).importNode(n, !0);
    Tt.currentNode = a;
    let d = Tt.nextNode(), f = 0, p = 0, y = i[0];
    for (; y !== void 0; ) {
      if (f === y.index) {
        let D;
        y.type === 2 ? D = new ui(d, d.nextSibling, this, e) : y.type === 1 ? D = new y.ctor(d, y.name, y.strings, this, e) : y.type === 6 && (D = new ac(d, this, e)), this._$AV.push(D), y = i[++p];
      }
      f !== y?.index && (d = Tt.nextNode(), f++);
    }
    return Tt.currentNode = At, a;
  }
  p(e) {
    let n = 0;
    for (const i of this._$AV) i !== void 0 && (i.strings !== void 0 ? (i._$AI(e, i, n), n += i.strings.length - 2) : i._$AI(e[n])), n++;
  }
}, ui = class Qs {
  get _$AU() {
    return this._$AM?._$AU ?? this._$Cv;
  }
  constructor(e, n, i, a) {
    this.type = 2, this._$AH = pe, this._$AN = void 0, this._$AA = e, this._$AB = n, this._$AM = i, this.options = a, this._$Cv = a?.isConnected ?? !0;
  }
  get parentNode() {
    let e = this._$AA.parentNode;
    const n = this._$AM;
    return n !== void 0 && e?.nodeType === 11 && (e = n.parentNode), e;
  }
  get startNode() {
    return this._$AA;
  }
  get endNode() {
    return this._$AB;
  }
  _$AI(e, n = this) {
    e = Qt(this, e, n), Cr(e) ? e === pe || e == null || e === "" ? (this._$AH !== pe && this._$AR(), this._$AH = pe) : e !== this._$AH && e !== Jt && this._(e) : e._$litType$ !== void 0 ? this.$(e) : e.nodeType !== void 0 ? this.T(e) : ec(e) ? this.k(e) : this._(e);
  }
  O(e) {
    return this._$AA.parentNode.insertBefore(e, this._$AB);
  }
  T(e) {
    this._$AH !== e && (this._$AR(), this._$AH = this.O(e));
  }
  _(e) {
    this._$AH !== pe && Cr(this._$AH) ? this._$AA.nextSibling.data = e : this.T(At.createTextNode(e)), this._$AH = e;
  }
  $(e) {
    const { values: n, _$litType$: i } = e, a = typeof i == "number" ? this._$AC(e) : (i.el === void 0 && (i.el = qo.createElement(Gs(i.h, i.h[0]), this.options)), i);
    if (this._$AH?._$AD === a) this._$AH.p(n);
    else {
      const d = new nc(a, this), f = d.u(this.options);
      d.p(n), this.T(f), this._$AH = d;
    }
  }
  _$AC(e) {
    let n = hs.get(e.strings);
    return n === void 0 && hs.set(e.strings, n = new qo(e)), n;
  }
  k(e) {
    ai(this._$AH) || (this._$AH = [], this._$AR());
    const n = this._$AH;
    let i, a = 0;
    for (const d of e) a === n.length ? n.push(i = new Qs(this.O($r()), this.O($r()), this, this.options)) : i = n[a], i._$AI(d), a++;
    a < n.length && (this._$AR(i && i._$AB.nextSibling, a), n.length = a);
  }
  _$AR(e = this._$AA.nextSibling, n) {
    for (this._$AP?.(!1, !0, n); e !== this._$AB; ) {
      const i = as(e).nextSibling;
      as(e).remove(), e = i;
    }
  }
  setConnected(e) {
    this._$AM === void 0 && (this._$Cv = e, this._$AP?.(e));
  }
};
class Mn {
  get tagName() {
    return this.element.tagName;
  }
  get _$AU() {
    return this._$AM._$AU;
  }
  constructor(e, n, i, a, d) {
    this.type = 1, this._$AH = pe, this._$AN = void 0, this.element = e, this.name = n, this._$AM = a, this.options = d, i.length > 2 || i[0] !== "" || i[1] !== "" ? (this._$AH = Array(i.length - 1).fill(new String()), this.strings = i) : this._$AH = pe;
  }
  _$AI(e, n = this, i, a) {
    const d = this.strings;
    let f = !1;
    if (d === void 0) e = Qt(this, e, n, 0), f = !Cr(e) || e !== this._$AH && e !== Jt, f && (this._$AH = e);
    else {
      const p = e;
      let y, D;
      for (e = d[0], y = 0; y < d.length - 1; y++) D = Qt(this, p[i + y], n, y), D === Jt && (D = this._$AH[y]), f ||= !Cr(D) || D !== this._$AH[y], D === pe ? e = pe : e !== pe && (e += (D ?? "") + d[y + 1]), this._$AH[y] = D;
    }
    f && !a && this.j(e);
  }
  j(e) {
    e === pe ? this.element.removeAttribute(this.name) : this.element.setAttribute(this.name, e ?? "");
  }
}
class oc extends Mn {
  constructor() {
    super(...arguments), this.type = 3;
  }
  j(e) {
    this.element[this.name] = e === pe ? void 0 : e;
  }
}
class ic extends Mn {
  constructor() {
    super(...arguments), this.type = 4;
  }
  j(e) {
    this.element.toggleAttribute(this.name, !!e && e !== pe);
  }
}
class sc extends Mn {
  constructor(e, n, i, a, d) {
    super(e, n, i, a, d), this.type = 5;
  }
  _$AI(e, n = this) {
    if ((e = Qt(this, e, n, 0) ?? pe) === Jt) return;
    const i = this._$AH, a = e === pe && i !== pe || e.capture !== i.capture || e.once !== i.once || e.passive !== i.passive, d = e !== pe && (i === pe || a);
    a && this.element.removeEventListener(this.name, this, i), d && this.element.addEventListener(this.name, this, e), this._$AH = e;
  }
  handleEvent(e) {
    typeof this._$AH == "function" ? this._$AH.call(this.options?.host ?? this.element, e) : this._$AH.handleEvent(e);
  }
}
class ac {
  constructor(e, n, i) {
    this.element = e, this.type = 6, this._$AN = void 0, this._$AM = n, this.options = i;
  }
  get _$AU() {
    return this._$AM._$AU;
  }
  _$AI(e) {
    Qt(this, e);
  }
}
const uc = si.litHtmlPolyfillSupport;
uc?.(qo, ui), (si.litHtmlVersions ??= []).push("3.3.2");
const cc = (o, e, n) => {
  const i = n?.renderBefore ?? e;
  let a = i._$litPart$;
  if (a === void 0) {
    const d = n?.renderBefore ?? null;
    i._$litPart$ = a = new ui(e.insertBefore($r(), d), d, void 0, n ?? {});
  }
  return a._$AI(o), a;
};
const ci = globalThis;
class Ct extends Ht {
  constructor() {
    super(...arguments), this.renderOptions = { host: this }, this._$Do = void 0;
  }
  createRenderRoot() {
    const e = super.createRenderRoot();
    return this.renderOptions.renderBefore ??= e.firstChild, e;
  }
  update(e) {
    const n = this.render();
    this.hasUpdated || (this.renderOptions.isConnected = this.isConnected), super.update(e), this._$Do = cc(n, this.renderRoot, this.renderOptions);
  }
  connectedCallback() {
    super.connectedCallback(), this._$Do?.setConnected(!0);
  }
  disconnectedCallback() {
    super.disconnectedCallback(), this._$Do?.setConnected(!1);
  }
  render() {
    return Jt;
  }
}
Ct._$litElement$ = !0, Ct.finalized = !0, ci.litElementHydrateSupport?.({ LitElement: Ct });
const lc = ci.litElementPolyfillSupport;
lc?.({ LitElement: Ct });
(ci.litElementVersions ??= []).push("4.2.2");
const li = (o) => (e, n) => {
  n !== void 0 ? n.addInitializer(() => {
    customElements.define(o, e);
  }) : customElements.define(o, e);
};
const dc = { attribute: !0, type: String, converter: On, reflect: !1, hasChanged: ii }, fc = (o = dc, e, n) => {
  const { kind: i, metadata: a } = n;
  let d = globalThis.litPropertyMetadata.get(a);
  if (d === void 0 && globalThis.litPropertyMetadata.set(a, d = /* @__PURE__ */ new Map()), i === "setter" && ((o = Object.create(o)).wrapped = !0), d.set(n.name, o), i === "accessor") {
    const { name: f } = n;
    return { set(p) {
      const y = e.get.call(this);
      e.set.call(this, p), this.requestUpdate(f, y, o, !0, p);
    }, init(p) {
      return p !== void 0 && this.C(f, void 0, o, p), p;
    } };
  }
  if (i === "setter") {
    const { name: f } = n;
    return function(p) {
      const y = this[f];
      e.call(this, p), this.requestUpdate(f, y, o, !0, p);
    };
  }
  throw Error("Unsupported decorator location: " + i);
};
function Ir(o) {
  return (e, n) => typeof n == "object" ? fc(o, e, n) : ((i, a, d) => {
    const f = a.hasOwnProperty(d);
    return a.constructor.createProperty(d, i), f ? Object.getOwnPropertyDescriptor(a, d) : void 0;
  })(o, e, n);
}
function Xs(o) {
  return Ir({ ...o, state: !0, attribute: !1 });
}
const hc = (o, e, n) => (n.configurable = !0, n.enumerable = !0, Reflect.decorate && typeof e != "object" && Object.defineProperty(o, e, n), n);
function di(o, e) {
  return (n, i, a) => {
    const d = (f) => f.renderRoot?.querySelector(o) ?? null;
    return hc(n, i, { get() {
      return d(this);
    } });
  };
}
var pc = typeof globalThis < "u" ? globalThis : typeof window < "u" ? window : typeof global < "u" ? global : typeof self < "u" ? self : {};
function gc(o) {
  return o && o.__esModule && Object.prototype.hasOwnProperty.call(o, "default") ? o.default : o;
}
var kn = { exports: {} }, mc = kn.exports, ps;
function yc() {
  return ps || (ps = 1, (function(o, e) {
    (function(n, i) {
      o.exports = i();
    })(mc, function() {
      var n = function(t, r) {
        return (n = Object.setPrototypeOf || { __proto__: [] } instanceof Array && function(s, u) {
          s.__proto__ = u;
        } || function(s, u) {
          for (var c in u) Object.prototype.hasOwnProperty.call(u, c) && (s[c] = u[c]);
        })(t, r);
      }, i = function() {
        return (i = Object.assign || function(t) {
          for (var r, s = 1, u = arguments.length; s < u; s++) for (var c in r = arguments[s]) Object.prototype.hasOwnProperty.call(r, c) && (t[c] = r[c]);
          return t;
        }).apply(this, arguments);
      };
      function a(t, r, s) {
        for (var u, c = 0, l = r.length; c < l; c++) !u && c in r || ((u = u || Array.prototype.slice.call(r, 0, c))[c] = r[c]);
        return t.concat(u || Array.prototype.slice.call(r));
      }
      var d = typeof globalThis < "u" ? globalThis : typeof self < "u" ? self : typeof window < "u" ? window : pc, f = Object.keys, p = Array.isArray;
      function y(t, r) {
        return typeof r != "object" || f(r).forEach(function(s) {
          t[s] = r[s];
        }), t;
      }
      typeof Promise > "u" || d.Promise || (d.Promise = Promise);
      var D = Object.getPrototypeOf, F = {}.hasOwnProperty;
      function j(t, r) {
        return F.call(t, r);
      }
      function Y(t, r) {
        typeof r == "function" && (r = r(D(t))), (typeof Reflect > "u" ? f : Reflect.ownKeys)(r).forEach(function(s) {
          ee(t, s, r[s]);
        });
      }
      var L = Object.defineProperty;
      function ee(t, r, s, u) {
        L(t, r, y(s && j(s, "get") && typeof s.get == "function" ? { get: s.get, set: s.set, configurable: !0 } : { value: s, configurable: !0, writable: !0 }, u));
      }
      function me(t) {
        return { from: function(r) {
          return t.prototype = Object.create(r.prototype), ee(t.prototype, "constructor", t), { extend: Y.bind(null, t.prototype) };
        } };
      }
      var Ce = Object.getOwnPropertyDescriptor, Ye = [].slice;
      function We(t, r, s) {
        return Ye.call(t, r, s);
      }
      function or(t, r) {
        return r(t);
      }
      function ct(t) {
        if (!t) throw new Error("Assertion Failed");
      }
      function ir(t) {
        d.setImmediate ? setImmediate(t) : setTimeout(t, 0);
      }
      function Ne(t, r) {
        if (typeof r == "string" && j(t, r)) return t[r];
        if (!r) return t;
        if (typeof r != "string") {
          for (var s = [], u = 0, c = r.length; u < c; ++u) {
            var l = Ne(t, r[u]);
            s.push(l);
          }
          return s;
        }
        var h = r.indexOf(".");
        if (h !== -1) {
          var g = t[r.substr(0, h)];
          return g == null ? void 0 : Ne(g, r.substr(h + 1));
        }
      }
      function Se(t, r, s) {
        if (t && r !== void 0 && !("isFrozen" in Object && Object.isFrozen(t))) if (typeof r != "string" && "length" in r) {
          ct(typeof s != "string" && "length" in s);
          for (var u = 0, c = r.length; u < c; ++u) Se(t, r[u], s[u]);
        } else {
          var l, h, g = r.indexOf(".");
          g !== -1 ? (l = r.substr(0, g), (h = r.substr(g + 1)) === "" ? s === void 0 ? p(t) && !isNaN(parseInt(l)) ? t.splice(l, 1) : delete t[l] : t[l] = s : Se(g = !(g = t[l]) || !j(t, l) ? t[l] = {} : g, h, s)) : s === void 0 ? p(t) && !isNaN(parseInt(r)) ? t.splice(r, 1) : delete t[r] : t[r] = s;
        }
      }
      function Rr(t) {
        var r, s = {};
        for (r in t) j(t, r) && (s[r] = t[r]);
        return s;
      }
      var lt = [].concat;
      function Ge(t) {
        return lt.apply([], t);
      }
      var pt = "BigUint64Array,BigInt64Array,Array,Boolean,String,Date,RegExp,Blob,File,FileList,FileSystemFileHandle,FileSystemDirectoryHandle,ArrayBuffer,DataView,Uint8ClampedArray,ImageBitmap,ImageData,Map,Set,CryptoKey".split(",").concat(Ge([8, 16, 32, 64].map(function(t) {
        return ["Int", "Uint", "Float"].map(function(r) {
          return r + t + "Array";
        });
      }))).filter(function(t) {
        return d[t];
      }), Fr = new Set(pt.map(function(t) {
        return d[t];
      })), sr = null;
      function dt(t) {
        return sr = /* @__PURE__ */ new WeakMap(), t = (function r(s) {
          if (!s || typeof s != "object") return s;
          var u = sr.get(s);
          if (u) return u;
          if (p(s)) {
            u = [], sr.set(s, u);
            for (var c = 0, l = s.length; c < l; ++c) u.push(r(s[c]));
          } else if (Fr.has(s.constructor)) u = s;
          else {
            var h, g = D(s);
            for (h in u = g === Object.prototype ? {} : Object.create(g), sr.set(s, u), s) j(s, h) && (u[h] = r(s[h]));
          }
          return u;
        })(t), sr = null, t;
      }
      var uu = {}.toString;
      function qn(t) {
        return uu.call(t).slice(8, -1);
      }
      var Vn = typeof Symbol < "u" ? Symbol.iterator : "@@iterator", cu = typeof Vn == "symbol" ? function(t) {
        var r;
        return t != null && (r = t[Vn]) && r.apply(t);
      } : function() {
        return null;
      };
      function ft(t, r) {
        return r = t.indexOf(r), 0 <= r && t.splice(r, 1), 0 <= r;
      }
      var Mt = {};
      function Le(t) {
        var r, s, u, c;
        if (arguments.length === 1) {
          if (p(t)) return t.slice();
          if (this === Mt && typeof t == "string") return [t];
          if (c = cu(t)) {
            for (s = []; !(u = c.next()).done; ) s.push(u.value);
            return s;
          }
          if (t == null) return [t];
          if (typeof (r = t.length) != "number") return [t];
          for (s = new Array(r); r--; ) s[r] = t[r];
          return s;
        }
        for (r = arguments.length, s = new Array(r); r--; ) s[r] = arguments[r];
        return s;
      }
      var Un = typeof Symbol < "u" ? function(t) {
        return t[Symbol.toStringTag] === "AsyncFunction";
      } : function() {
        return !1;
      }, cr = ["Unknown", "Constraint", "Data", "TransactionInactive", "ReadOnly", "Version", "NotFound", "InvalidState", "InvalidAccess", "Abort", "Timeout", "QuotaExceeded", "Syntax", "DataClone"], Ae = ["Modify", "Bulk", "OpenFailed", "VersionChange", "Schema", "Upgrade", "InvalidTable", "MissingAPI", "NoSuchDatabase", "InvalidArgument", "SubTransaction", "Unsupported", "Internal", "DatabaseClosed", "PrematureCommit", "ForeignAwait"].concat(cr), lu = { VersionChanged: "Database version changed by other database connection", DatabaseClosed: "Database has been closed", Abort: "Transaction aborted", TransactionInactive: "Transaction has already completed or failed", MissingAPI: "IndexedDB API missing. Please visit https://tinyurl.com/y2uuvskb" };
      function Nt(t, r) {
        this.name = t, this.message = r;
      }
      function ki(t, r) {
        return t + ". Errors: " + Object.keys(r).map(function(s) {
          return r[s].toString();
        }).filter(function(s, u, c) {
          return c.indexOf(s) === u;
        }).join(`
`);
      }
      function Wr(t, r, s, u) {
        this.failures = r, this.failedKeys = u, this.successCount = s, this.message = ki(t, r);
      }
      function Pt(t, r) {
        this.name = "BulkError", this.failures = Object.keys(r).map(function(s) {
          return r[s];
        }), this.failuresByPos = r, this.message = ki(t, this.failures);
      }
      me(Nt).from(Error).extend({ toString: function() {
        return this.name + ": " + this.message;
      } }), me(Wr).from(Nt), me(Pt).from(Nt);
      var Ln = Ae.reduce(function(t, r) {
        return t[r] = r + "Error", t;
      }, {}), du = Nt, K = Ae.reduce(function(t, r) {
        var s = r + "Error";
        function u(c, l) {
          this.name = s, c ? typeof c == "string" ? (this.message = "".concat(c).concat(l ? `
 ` + l : ""), this.inner = l || null) : typeof c == "object" && (this.message = "".concat(c.name, " ").concat(c.message), this.inner = c) : (this.message = lu[r] || s, this.inner = null);
        }
        return me(u).from(du), t[r] = u, t;
      }, {});
      K.Syntax = SyntaxError, K.Type = TypeError, K.Range = RangeError;
      var _i = cr.reduce(function(t, r) {
        return t[r + "Error"] = K[r], t;
      }, {}), qr = Ae.reduce(function(t, r) {
        return ["Syntax", "Type", "Range"].indexOf(r) === -1 && (t[r + "Error"] = K[r]), t;
      }, {});
      function se() {
      }
      function ar(t) {
        return t;
      }
      function fu(t, r) {
        return t == null || t === ar ? r : function(s) {
          return r(t(s));
        };
      }
      function ht(t, r) {
        return function() {
          t.apply(this, arguments), r.apply(this, arguments);
        };
      }
      function hu(t, r) {
        return t === se ? r : function() {
          var s = t.apply(this, arguments);
          s !== void 0 && (arguments[0] = s);
          var u = this.onsuccess, c = this.onerror;
          this.onsuccess = null, this.onerror = null;
          var l = r.apply(this, arguments);
          return u && (this.onsuccess = this.onsuccess ? ht(u, this.onsuccess) : u), c && (this.onerror = this.onerror ? ht(c, this.onerror) : c), l !== void 0 ? l : s;
        };
      }
      function pu(t, r) {
        return t === se ? r : function() {
          t.apply(this, arguments);
          var s = this.onsuccess, u = this.onerror;
          this.onsuccess = this.onerror = null, r.apply(this, arguments), s && (this.onsuccess = this.onsuccess ? ht(s, this.onsuccess) : s), u && (this.onerror = this.onerror ? ht(u, this.onerror) : u);
        };
      }
      function gu(t, r) {
        return t === se ? r : function(s) {
          var u = t.apply(this, arguments);
          y(s, u);
          var c = this.onsuccess, l = this.onerror;
          return this.onsuccess = null, this.onerror = null, s = r.apply(this, arguments), c && (this.onsuccess = this.onsuccess ? ht(c, this.onsuccess) : c), l && (this.onerror = this.onerror ? ht(l, this.onerror) : l), u === void 0 ? s === void 0 ? void 0 : s : y(u, s);
        };
      }
      function mu(t, r) {
        return t === se ? r : function() {
          return r.apply(this, arguments) !== !1 && t.apply(this, arguments);
        };
      }
      function zn(t, r) {
        return t === se ? r : function() {
          var s = t.apply(this, arguments);
          if (s && typeof s.then == "function") {
            for (var u = this, c = arguments.length, l = new Array(c); c--; ) l[c] = arguments[c];
            return s.then(function() {
              return r.apply(u, l);
            });
          }
          return r.apply(this, arguments);
        };
      }
      qr.ModifyError = Wr, qr.DexieError = Nt, qr.BulkError = Pt;
      var qe = typeof location < "u" && /^(http|https):\/\/(localhost|127\.0\.0\.1)/.test(location.href);
      function xi(t) {
        qe = t;
      }
      var ur = {}, Si = 100, pt = typeof Promise > "u" ? [] : (function() {
        var t = Promise.resolve();
        if (typeof crypto > "u" || !crypto.subtle) return [t, D(t), t];
        var r = crypto.subtle.digest("SHA-512", new Uint8Array([0]));
        return [r, D(r), t];
      })(), cr = pt[0], Ae = pt[1], pt = pt[2], Ae = Ae && Ae.then, gt = cr && cr.constructor, Kn = !!pt, lr = function(t, r) {
        dr.push([t, r]), Vr && (queueMicrotask(bu), Vr = !1);
      }, Bn = !0, Vr = !0, mt = [], Ur = [], Hn = ar, Je = { id: "global", global: !0, ref: 0, unhandleds: [], onunhandled: se, pgp: !1, env: {}, finalize: se }, z = Je, dr = [], yt = 0, Lr = [];
      function V(t) {
        if (typeof this != "object") throw new TypeError("Promises must be constructed via new");
        this._listeners = [], this._lib = !1;
        var r = this._PSD = z;
        if (typeof t != "function") {
          if (t !== ur) throw new TypeError("Not a function");
          return this._state = arguments[1], this._value = arguments[2], void (this._state === !1 && Yn(this, this._value));
        }
        this._state = null, this._value = null, ++r.ref, (function s(u, c) {
          try {
            c(function(l) {
              if (u._state === null) {
                if (l === u) throw new TypeError("A promise cannot be resolved with itself.");
                var h = u._lib && jt();
                l && typeof l.then == "function" ? s(u, function(g, b) {
                  l instanceof V ? l._then(g, b) : l.then(g, b);
                }) : (u._state = !0, u._value = l, Ei(u)), h && Rt();
              }
            }, Yn.bind(null, u));
          } catch (l) {
            Yn(u, l);
          }
        })(this, t);
      }
      var Zn = { get: function() {
        var t = z, r = Hr;
        function s(u, c) {
          var l = this, h = !t.global && (t !== z || r !== Hr), g = h && !Xe(), b = new V(function(w, _) {
            Gn(l, new Oi($i(u, t, h, g), $i(c, t, h, g), w, _, t));
          });
          return this._consoleTask && (b._consoleTask = this._consoleTask), b;
        }
        return s.prototype = ur, s;
      }, set: function(t) {
        ee(this, "then", t && t.prototype === ur ? Zn : { get: function() {
          return t;
        }, set: Zn.set });
      } };
      function Oi(t, r, s, u, c) {
        this.onFulfilled = typeof t == "function" ? t : null, this.onRejected = typeof r == "function" ? r : null, this.resolve = s, this.reject = u, this.psd = c;
      }
      function Yn(t, r) {
        var s, u;
        Ur.push(r), t._state === null && (s = t._lib && jt(), r = Hn(r), t._state = !1, t._value = r, u = t, mt.some(function(c) {
          return c._value === u._value;
        }) || mt.push(u), Ei(t), s && Rt());
      }
      function Ei(t) {
        var r = t._listeners;
        t._listeners = [];
        for (var s = 0, u = r.length; s < u; ++s) Gn(t, r[s]);
        var c = t._PSD;
        --c.ref || c.finalize(), yt === 0 && (++yt, lr(function() {
          --yt == 0 && Jn();
        }, []));
      }
      function Gn(t, r) {
        if (t._state !== null) {
          var s = t._state ? r.onFulfilled : r.onRejected;
          if (s === null) return (t._state ? r.resolve : r.reject)(t._value);
          ++r.psd.ref, ++yt, lr(yu, [s, t, r]);
        } else t._listeners.push(r);
      }
      function yu(t, r, s) {
        try {
          var u, c = r._value;
          !r._state && Ur.length && (Ur = []), u = qe && r._consoleTask ? r._consoleTask.run(function() {
            return t(c);
          }) : t(c), r._state || Ur.indexOf(c) !== -1 || (function(l) {
            for (var h = mt.length; h; ) if (mt[--h]._value === l._value) return mt.splice(h, 1);
          })(r), s.resolve(u);
        } catch (l) {
          s.reject(l);
        } finally {
          --yt == 0 && Jn(), --s.psd.ref || s.psd.finalize();
        }
      }
      function bu() {
        bt(Je, function() {
          jt() && Rt();
        });
      }
      function jt() {
        var t = Bn;
        return Vr = Bn = !1, t;
      }
      function Rt() {
        var t, r, s;
        do
          for (; 0 < dr.length; ) for (t = dr, dr = [], s = t.length, r = 0; r < s; ++r) {
            var u = t[r];
            u[0].apply(null, u[1]);
          }
        while (0 < dr.length);
        Vr = Bn = !0;
      }
      function Jn() {
        var t = mt;
        mt = [], t.forEach(function(u) {
          u._PSD.onunhandled.call(null, u._value, u);
        });
        for (var r = Lr.slice(0), s = r.length; s; ) r[--s]();
      }
      function zr(t) {
        return new V(ur, !1, t);
      }
      function ue(t, r) {
        var s = z;
        return function() {
          var u = jt(), c = z;
          try {
            return et(s, !0), t.apply(this, arguments);
          } catch (l) {
            r && r(l);
          } finally {
            et(c, !1), u && Rt();
          }
        };
      }
      Y(V.prototype, { then: Zn, _then: function(t, r) {
        Gn(this, new Oi(null, null, t, r, z));
      }, catch: function(t) {
        if (arguments.length === 1) return this.then(null, t);
        var r = t, s = arguments[1];
        return typeof r == "function" ? this.then(null, function(u) {
          return (u instanceof r ? s : zr)(u);
        }) : this.then(null, function(u) {
          return (u && u.name === r ? s : zr)(u);
        });
      }, finally: function(t) {
        return this.then(function(r) {
          return V.resolve(t()).then(function() {
            return r;
          });
        }, function(r) {
          return V.resolve(t()).then(function() {
            return zr(r);
          });
        });
      }, timeout: function(t, r) {
        var s = this;
        return t < 1 / 0 ? new V(function(u, c) {
          var l = setTimeout(function() {
            return c(new K.Timeout(r));
          }, t);
          s.then(u, c).finally(clearTimeout.bind(null, l));
        }) : this;
      } }), typeof Symbol < "u" && Symbol.toStringTag && ee(V.prototype, Symbol.toStringTag, "Dexie.Promise"), Je.env = Ti(), Y(V, { all: function() {
        var t = Le.apply(null, arguments).map(Zr);
        return new V(function(r, s) {
          t.length === 0 && r([]);
          var u = t.length;
          t.forEach(function(c, l) {
            return V.resolve(c).then(function(h) {
              t[l] = h, --u || r(t);
            }, s);
          });
        });
      }, resolve: function(t) {
        return t instanceof V ? t : t && typeof t.then == "function" ? new V(function(r, s) {
          t.then(r, s);
        }) : new V(ur, !0, t);
      }, reject: zr, race: function() {
        var t = Le.apply(null, arguments).map(Zr);
        return new V(function(r, s) {
          t.map(function(u) {
            return V.resolve(u).then(r, s);
          });
        });
      }, PSD: { get: function() {
        return z;
      }, set: function(t) {
        return z = t;
      } }, totalEchoes: { get: function() {
        return Hr;
      } }, newPSD: Qe, usePSD: bt, scheduler: { get: function() {
        return lr;
      }, set: function(t) {
        lr = t;
      } }, rejectionMapper: { get: function() {
        return Hn;
      }, set: function(t) {
        Hn = t;
      } }, follow: function(t, r) {
        return new V(function(s, u) {
          return Qe(function(c, l) {
            var h = z;
            h.unhandleds = [], h.onunhandled = l, h.finalize = ht(function() {
              var g, b = this;
              g = function() {
                b.unhandleds.length === 0 ? c() : l(b.unhandleds[0]);
              }, Lr.push(function w() {
                g(), Lr.splice(Lr.indexOf(w), 1);
              }), ++yt, lr(function() {
                --yt == 0 && Jn();
              }, []);
            }, h.finalize), t();
          }, r, s, u);
        });
      } }), gt && (gt.allSettled && ee(V, "allSettled", function() {
        var t = Le.apply(null, arguments).map(Zr);
        return new V(function(r) {
          t.length === 0 && r([]);
          var s = t.length, u = new Array(s);
          t.forEach(function(c, l) {
            return V.resolve(c).then(function(h) {
              return u[l] = { status: "fulfilled", value: h };
            }, function(h) {
              return u[l] = { status: "rejected", reason: h };
            }).then(function() {
              return --s || r(u);
            });
          });
        });
      }), gt.any && typeof AggregateError < "u" && ee(V, "any", function() {
        var t = Le.apply(null, arguments).map(Zr);
        return new V(function(r, s) {
          t.length === 0 && s(new AggregateError([]));
          var u = t.length, c = new Array(u);
          t.forEach(function(l, h) {
            return V.resolve(l).then(function(g) {
              return r(g);
            }, function(g) {
              c[h] = g, --u || s(new AggregateError(c));
            });
          });
        });
      }), gt.withResolvers && (V.withResolvers = gt.withResolvers));
      var ye = { awaits: 0, echoes: 0, id: 0 }, vu = 0, Kr = [], Br = 0, Hr = 0, wu = 0;
      function Qe(t, r, s, u) {
        var c = z, l = Object.create(c);
        return l.parent = c, l.ref = 0, l.global = !1, l.id = ++wu, Je.env, l.env = Kn ? { Promise: V, PromiseProp: { value: V, configurable: !0, writable: !0 }, all: V.all, race: V.race, allSettled: V.allSettled, any: V.any, resolve: V.resolve, reject: V.reject } : {}, r && y(l, r), ++c.ref, l.finalize = function() {
          --this.parent.ref || this.parent.finalize();
        }, u = bt(l, t, s, u), l.ref === 0 && l.finalize(), u;
      }
      function Ft() {
        return ye.id || (ye.id = ++vu), ++ye.awaits, ye.echoes += Si, ye.id;
      }
      function Xe() {
        return !!ye.awaits && (--ye.awaits == 0 && (ye.id = 0), ye.echoes = ye.awaits * Si, !0);
      }
      function Zr(t) {
        return ye.echoes && t && t.constructor === gt ? (Ft(), t.then(function(r) {
          return Xe(), r;
        }, function(r) {
          return Xe(), fe(r);
        })) : t;
      }
      function ku() {
        var t = Kr[Kr.length - 1];
        Kr.pop(), et(t, !1);
      }
      function et(t, r) {
        var s, u = z;
        (r ? !ye.echoes || Br++ && t === z : !Br || --Br && t === z) || queueMicrotask(r ? (function(c) {
          ++Hr, ye.echoes && --ye.echoes != 0 || (ye.echoes = ye.awaits = ye.id = 0), Kr.push(z), et(c, !0);
        }).bind(null, t) : ku), t !== z && (z = t, u === Je && (Je.env = Ti()), Kn && (s = Je.env.Promise, r = t.env, (u.global || t.global) && (Object.defineProperty(d, "Promise", r.PromiseProp), s.all = r.all, s.race = r.race, s.resolve = r.resolve, s.reject = r.reject, r.allSettled && (s.allSettled = r.allSettled), r.any && (s.any = r.any))));
      }
      function Ti() {
        var t = d.Promise;
        return Kn ? { Promise: t, PromiseProp: Object.getOwnPropertyDescriptor(d, "Promise"), all: t.all, race: t.race, allSettled: t.allSettled, any: t.any, resolve: t.resolve, reject: t.reject } : {};
      }
      function bt(t, r, s, u, c) {
        var l = z;
        try {
          return et(t, !0), r(s, u, c);
        } finally {
          et(l, !1);
        }
      }
      function $i(t, r, s, u) {
        return typeof t != "function" ? t : function() {
          var c = z;
          s && Ft(), et(r, !0);
          try {
            return t.apply(this, arguments);
          } finally {
            et(c, !1), u && queueMicrotask(Xe);
          }
        };
      }
      function Qn(t) {
        Promise === gt && ye.echoes === 0 ? Br === 0 ? t() : enqueueNativeMicroTask(t) : setTimeout(t, 0);
      }
      ("" + Ae).indexOf("[native code]") === -1 && (Ft = Xe = se);
      var fe = V.reject, vt = "￿", ze = "Invalid key provided. Keys must be of type string, number, Date or Array<string | number | Date>.", Ci = "String expected.", Wt = [], Yr = "__dbnames", Xn = "readonly", eo = "readwrite";
      function wt(t, r) {
        return t ? r ? function() {
          return t.apply(this, arguments) && r.apply(this, arguments);
        } : t : r;
      }
      var Ai = { type: 3, lower: -1 / 0, lowerOpen: !1, upper: [[]], upperOpen: !1 };
      function Gr(t) {
        return typeof t != "string" || /\./.test(t) ? function(r) {
          return r;
        } : function(r) {
          return r[t] === void 0 && t in r && delete (r = dt(r))[t], r;
        };
      }
      function Di() {
        throw K.Type("Entity instances must never be new:ed. Instances are generated by the framework bypassing the constructor.");
      }
      function X(t, r) {
        try {
          var s = Ii(t), u = Ii(r);
          if (s !== u) return s === "Array" ? 1 : u === "Array" ? -1 : s === "binary" ? 1 : u === "binary" ? -1 : s === "string" ? 1 : u === "string" ? -1 : s === "Date" ? 1 : u !== "Date" ? NaN : -1;
          switch (s) {
            case "number":
            case "Date":
            case "string":
              return r < t ? 1 : t < r ? -1 : 0;
            case "binary":
              return (function(c, l) {
                for (var h = c.length, g = l.length, b = h < g ? h : g, w = 0; w < b; ++w) if (c[w] !== l[w]) return c[w] < l[w] ? -1 : 1;
                return h === g ? 0 : h < g ? -1 : 1;
              })(Mi(t), Mi(r));
            case "Array":
              return (function(c, l) {
                for (var h = c.length, g = l.length, b = h < g ? h : g, w = 0; w < b; ++w) {
                  var _ = X(c[w], l[w]);
                  if (_ !== 0) return _;
                }
                return h === g ? 0 : h < g ? -1 : 1;
              })(t, r);
          }
        } catch {
        }
        return NaN;
      }
      function Ii(t) {
        var r = typeof t;
        return r != "object" ? r : ArrayBuffer.isView(t) ? "binary" : (t = qn(t), t === "ArrayBuffer" ? "binary" : t);
      }
      function Mi(t) {
        return t instanceof Uint8Array ? t : ArrayBuffer.isView(t) ? new Uint8Array(t.buffer, t.byteOffset, t.byteLength) : new Uint8Array(t);
      }
      function Jr(t, r, s) {
        var u = t.schema.yProps;
        return u ? (r && 0 < s.numFailures && (r = r.filter(function(c, l) {
          return !s.failures[l];
        })), Promise.all(u.map(function(c) {
          return c = c.updatesTable, r ? t.db.table(c).where("k").anyOf(r).delete() : t.db.table(c).clear();
        })).then(function() {
          return s;
        })) : s;
      }
      var Ni = (ae.prototype._trans = function(t, r, s) {
        var u = this._tx || z.trans, c = this.name, l = qe && typeof console < "u" && console.createTask && void 0;
        function h(w, _, m) {
          if (!m.schema[c]) throw new K.NotFound("Table " + c + " not part of transaction");
          return r(m.idbtrans, m);
        }
        var g = jt();
        try {
          var b = u && u.db._novip === this.db._novip ? u === z.trans ? u._promise(t, h, s) : Qe(function() {
            return u._promise(t, h, s);
          }, { trans: u, transless: z.transless || z }) : (function w(_, m, O, v) {
            if (_.idbdb && (_._state.openComplete || z.letThrough || _._vip)) {
              var k = _._createTransaction(m, O, _._dbSchema);
              try {
                k.create(), _._state.PR1398_maxLoop = 3;
              } catch (S) {
                return S.name === Ln.InvalidState && _.isOpen() && 0 < --_._state.PR1398_maxLoop ? (_.close({ disableAutoOpen: !1 }), _.open().then(function() {
                  return w(_, m, O, v);
                })) : fe(S);
              }
              return k._promise(m, function(S, x) {
                return Qe(function() {
                  return z.trans = k, v(S, x, k);
                });
              }).then(function(S) {
                if (m === "readwrite") try {
                  k.idbtrans.commit();
                } catch {
                }
                return m === "readonly" ? S : k._completion.then(function() {
                  return S;
                });
              });
            }
            if (_._state.openComplete) return fe(new K.DatabaseClosed(_._state.dbOpenError));
            if (!_._state.isBeingOpened) {
              if (!_._state.autoOpen) return fe(new K.DatabaseClosed());
              _.open().catch(se);
            }
            return _._state.dbReadyPromise.then(function() {
              return w(_, m, O, v);
            });
          })(this.db, t, [this.name], h);
          return l && (b._consoleTask = l, b = b.catch(function(w) {
            return fe(w);
          })), b;
        } finally {
          g && Rt();
        }
      }, ae.prototype.get = function(t, r) {
        var s = this;
        return t && t.constructor === Object ? this.where(t).first(r) : t == null ? fe(new K.Type("Invalid argument to Table.get()")) : this._trans("readonly", function(u) {
          return s.core.get({ trans: u, key: t }).then(function(c) {
            return s.hook.reading.fire(c);
          });
        }).then(r);
      }, ae.prototype.where = function(t) {
        if (typeof t == "string") return new this.db.WhereClause(this, t);
        if (p(t)) return new this.db.WhereClause(this, "[".concat(t.join("+"), "]"));
        var r = f(t);
        if (r.length === 1) return this.where(r[0]).equals(t[r[0]]);
        var s = this.schema.indexes.concat(this.schema.primKey).filter(function(g) {
          if (g.compound && r.every(function(w) {
            return 0 <= g.keyPath.indexOf(w);
          })) {
            for (var b = 0; b < r.length; ++b) if (r.indexOf(g.keyPath[b]) === -1) return !1;
            return !0;
          }
          return !1;
        }).sort(function(g, b) {
          return g.keyPath.length - b.keyPath.length;
        })[0];
        if (s && this.db._maxKey !== vt) {
          var l = s.keyPath.slice(0, r.length);
          return this.where(l).equals(l.map(function(b) {
            return t[b];
          }));
        }
        var u = this.schema.idxByName;
        function c(g, b) {
          return X(g, b) === 0;
        }
        var h = r.reduce(function(m, b) {
          var w = m[0], _ = m[1], m = u[b], O = t[b];
          return [w || m, w || !m ? wt(_, m && m.multi ? function(v) {
            return v = Ne(v, b), p(v) && v.some(function(k) {
              return c(O, k);
            });
          } : function(v) {
            return c(O, Ne(v, b));
          }) : _];
        }, [null, null]), l = h[0], h = h[1];
        return l ? this.where(l.name).equals(t[l.keyPath]).filter(h) : s ? this.filter(h) : this.where(r).equals("");
      }, ae.prototype.filter = function(t) {
        return this.toCollection().and(t);
      }, ae.prototype.count = function(t) {
        return this.toCollection().count(t);
      }, ae.prototype.offset = function(t) {
        return this.toCollection().offset(t);
      }, ae.prototype.limit = function(t) {
        return this.toCollection().limit(t);
      }, ae.prototype.each = function(t) {
        return this.toCollection().each(t);
      }, ae.prototype.toArray = function(t) {
        return this.toCollection().toArray(t);
      }, ae.prototype.toCollection = function() {
        return new this.db.Collection(new this.db.WhereClause(this));
      }, ae.prototype.orderBy = function(t) {
        return new this.db.Collection(new this.db.WhereClause(this, p(t) ? "[".concat(t.join("+"), "]") : t));
      }, ae.prototype.reverse = function() {
        return this.toCollection().reverse();
      }, ae.prototype.mapToClass = function(t) {
        var r, s = this.db, u = this.name;
        function c() {
          return r !== null && r.apply(this, arguments) || this;
        }
        (this.schema.mappedClass = t).prototype instanceof Di && ((function(b, w) {
          if (typeof w != "function" && w !== null) throw new TypeError("Class extends value " + String(w) + " is not a constructor or null");
          function _() {
            this.constructor = b;
          }
          n(b, w), b.prototype = w === null ? Object.create(w) : (_.prototype = w.prototype, new _());
        })(c, r = t), Object.defineProperty(c.prototype, "db", { get: function() {
          return s;
        }, enumerable: !1, configurable: !0 }), c.prototype.table = function() {
          return u;
        }, t = c);
        for (var l = /* @__PURE__ */ new Set(), h = t.prototype; h; h = D(h)) Object.getOwnPropertyNames(h).forEach(function(b) {
          return l.add(b);
        });
        function g(b) {
          if (!b) return b;
          var w, _ = Object.create(t.prototype);
          for (w in b) if (!l.has(w)) try {
            _[w] = b[w];
          } catch {
          }
          return _;
        }
        return this.schema.readHook && this.hook.reading.unsubscribe(this.schema.readHook), this.schema.readHook = g, this.hook("reading", g), t;
      }, ae.prototype.defineClass = function() {
        return this.mapToClass(function(t) {
          y(this, t);
        });
      }, ae.prototype.add = function(t, r) {
        var s = this, u = this.schema.primKey, c = u.auto, l = u.keyPath, h = t;
        return l && c && (h = Gr(l)(t)), this._trans("readwrite", function(g) {
          return s.core.mutate({ trans: g, type: "add", keys: r != null ? [r] : null, values: [h] });
        }).then(function(g) {
          return g.numFailures ? V.reject(g.failures[0]) : g.lastResult;
        }).then(function(g) {
          if (l) try {
            Se(t, l, g);
          } catch {
          }
          return g;
        });
      }, ae.prototype.update = function(t, r) {
        return typeof t != "object" || p(t) ? this.where(":id").equals(t).modify(r) : (t = Ne(t, this.schema.primKey.keyPath), t === void 0 ? fe(new K.InvalidArgument("Given object does not contain its primary key")) : this.where(":id").equals(t).modify(r));
      }, ae.prototype.put = function(t, r) {
        var s = this, u = this.schema.primKey, c = u.auto, l = u.keyPath, h = t;
        return l && c && (h = Gr(l)(t)), this._trans("readwrite", function(g) {
          return s.core.mutate({ trans: g, type: "put", values: [h], keys: r != null ? [r] : null });
        }).then(function(g) {
          return g.numFailures ? V.reject(g.failures[0]) : g.lastResult;
        }).then(function(g) {
          if (l) try {
            Se(t, l, g);
          } catch {
          }
          return g;
        });
      }, ae.prototype.delete = function(t) {
        var r = this;
        return this._trans("readwrite", function(s) {
          return r.core.mutate({ trans: s, type: "delete", keys: [t] }).then(function(u) {
            return Jr(r, [t], u);
          }).then(function(u) {
            return u.numFailures ? V.reject(u.failures[0]) : void 0;
          });
        });
      }, ae.prototype.clear = function() {
        var t = this;
        return this._trans("readwrite", function(r) {
          return t.core.mutate({ trans: r, type: "deleteRange", range: Ai }).then(function(s) {
            return Jr(t, null, s);
          });
        }).then(function(r) {
          return r.numFailures ? V.reject(r.failures[0]) : void 0;
        });
      }, ae.prototype.bulkGet = function(t) {
        var r = this;
        return this._trans("readonly", function(s) {
          return r.core.getMany({ keys: t, trans: s }).then(function(u) {
            return u.map(function(c) {
              return r.hook.reading.fire(c);
            });
          });
        });
      }, ae.prototype.bulkAdd = function(t, r, s) {
        var u = this, c = Array.isArray(r) ? r : void 0, l = (s = s || (c ? void 0 : r)) ? s.allKeys : void 0;
        return this._trans("readwrite", function(h) {
          var w = u.schema.primKey, g = w.auto, w = w.keyPath;
          if (w && c) throw new K.InvalidArgument("bulkAdd(): keys argument invalid on tables with inbound keys");
          if (c && c.length !== t.length) throw new K.InvalidArgument("Arguments objects and keys must have the same length");
          var b = t.length, w = w && g ? t.map(Gr(w)) : t;
          return u.core.mutate({ trans: h, type: "add", keys: c, values: w, wantResults: l }).then(function(k) {
            var m = k.numFailures, O = k.results, v = k.lastResult, k = k.failures;
            if (m === 0) return l ? O : v;
            throw new Pt("".concat(u.name, ".bulkAdd(): ").concat(m, " of ").concat(b, " operations failed"), k);
          });
        });
      }, ae.prototype.bulkPut = function(t, r, s) {
        var u = this, c = Array.isArray(r) ? r : void 0, l = (s = s || (c ? void 0 : r)) ? s.allKeys : void 0;
        return this._trans("readwrite", function(h) {
          var w = u.schema.primKey, g = w.auto, w = w.keyPath;
          if (w && c) throw new K.InvalidArgument("bulkPut(): keys argument invalid on tables with inbound keys");
          if (c && c.length !== t.length) throw new K.InvalidArgument("Arguments objects and keys must have the same length");
          var b = t.length, w = w && g ? t.map(Gr(w)) : t;
          return u.core.mutate({ trans: h, type: "put", keys: c, values: w, wantResults: l }).then(function(k) {
            var m = k.numFailures, O = k.results, v = k.lastResult, k = k.failures;
            if (m === 0) return l ? O : v;
            throw new Pt("".concat(u.name, ".bulkPut(): ").concat(m, " of ").concat(b, " operations failed"), k);
          });
        });
      }, ae.prototype.bulkUpdate = function(t) {
        var r = this, s = this.core, u = t.map(function(h) {
          return h.key;
        }), c = t.map(function(h) {
          return h.changes;
        }), l = [];
        return this._trans("readwrite", function(h) {
          return s.getMany({ trans: h, keys: u, cache: "clone" }).then(function(g) {
            var b = [], w = [];
            t.forEach(function(m, O) {
              var v = m.key, k = m.changes, S = g[O];
              if (S) {
                for (var x = 0, E = Object.keys(k); x < E.length; x++) {
                  var T = E[x], C = k[T];
                  if (T === r.schema.primKey.keyPath) {
                    if (X(C, v) !== 0) throw new K.Constraint("Cannot update primary key in bulkUpdate()");
                  } else Se(S, T, C);
                }
                l.push(O), b.push(v), w.push(S);
              }
            });
            var _ = b.length;
            return s.mutate({ trans: h, type: "put", keys: b, values: w, updates: { keys: u, changeSpecs: c } }).then(function(m) {
              var O = m.numFailures, v = m.failures;
              if (O === 0) return _;
              for (var k = 0, S = Object.keys(v); k < S.length; k++) {
                var x, E = S[k], T = l[Number(E)];
                T != null && (x = v[E], delete v[E], v[T] = x);
              }
              throw new Pt("".concat(r.name, ".bulkUpdate(): ").concat(O, " of ").concat(_, " operations failed"), v);
            });
          });
        });
      }, ae.prototype.bulkDelete = function(t) {
        var r = this, s = t.length;
        return this._trans("readwrite", function(u) {
          return r.core.mutate({ trans: u, type: "delete", keys: t }).then(function(c) {
            return Jr(r, t, c);
          });
        }).then(function(h) {
          var c = h.numFailures, l = h.lastResult, h = h.failures;
          if (c === 0) return l;
          throw new Pt("".concat(r.name, ".bulkDelete(): ").concat(c, " of ").concat(s, " operations failed"), h);
        });
      }, ae);
      function ae() {
      }
      function fr(t) {
        function r(h, g) {
          if (g) {
            for (var b = arguments.length, w = new Array(b - 1); --b; ) w[b - 1] = arguments[b];
            return s[h].subscribe.apply(null, w), t;
          }
          if (typeof h == "string") return s[h];
        }
        var s = {};
        r.addEventType = l;
        for (var u = 1, c = arguments.length; u < c; ++u) l(arguments[u]);
        return r;
        function l(h, g, b) {
          if (typeof h != "object") {
            var w;
            g = g || mu;
            var _ = { subscribers: [], fire: b = b || se, subscribe: function(m) {
              _.subscribers.indexOf(m) === -1 && (_.subscribers.push(m), _.fire = g(_.fire, m));
            }, unsubscribe: function(m) {
              _.subscribers = _.subscribers.filter(function(O) {
                return O !== m;
              }), _.fire = _.subscribers.reduce(g, b);
            } };
            return s[h] = r[h] = _;
          }
          f(w = h).forEach(function(m) {
            var O = w[m];
            if (p(O)) l(m, w[m][0], w[m][1]);
            else {
              if (O !== "asap") throw new K.InvalidArgument("Invalid event config");
              var v = l(m, ar, function() {
                for (var k = arguments.length, S = new Array(k); k--; ) S[k] = arguments[k];
                v.subscribers.forEach(function(x) {
                  ir(function() {
                    x.apply(null, S);
                  });
                });
              });
            }
          });
        }
      }
      function hr(t, r) {
        return me(r).from({ prototype: t }), r;
      }
      function qt(t, r) {
        return !(t.filter || t.algorithm || t.or) && (r ? t.justLimit : !t.replayFilter);
      }
      function to(t, r) {
        t.filter = wt(t.filter, r);
      }
      function ro(t, r, s) {
        var u = t.replayFilter;
        t.replayFilter = u ? function() {
          return wt(u(), r());
        } : r, t.justLimit = s && !u;
      }
      function Qr(t, r) {
        if (t.isPrimKey) return r.primaryKey;
        var s = r.getIndexByKeyPath(t.index);
        if (!s) throw new K.Schema("KeyPath " + t.index + " on object store " + r.name + " is not indexed");
        return s;
      }
      function Pi(t, r, s) {
        var u = Qr(t, r.schema);
        return r.openCursor({ trans: s, values: !t.keysOnly, reverse: t.dir === "prev", unique: !!t.unique, query: { index: u, range: t.range } });
      }
      function Xr(t, r, s, u) {
        var c = t.replayFilter ? wt(t.filter, t.replayFilter()) : t.filter;
        if (t.or) {
          var l = {}, h = function(g, b, w) {
            var _, m;
            c && !c(b, w, function(O) {
              return b.stop(O);
            }, function(O) {
              return b.fail(O);
            }) || ((m = "" + (_ = b.primaryKey)) == "[object ArrayBuffer]" && (m = "" + new Uint8Array(_)), j(l, m) || (l[m] = !0, r(g, b, w)));
          };
          return Promise.all([t.or._iterate(h, s), ji(Pi(t, u, s), t.algorithm, h, !t.keysOnly && t.valueMapper)]);
        }
        return ji(Pi(t, u, s), wt(t.algorithm, c), r, !t.keysOnly && t.valueMapper);
      }
      function ji(t, r, s, u) {
        var c = ue(u ? function(l, h, g) {
          return s(u(l), h, g);
        } : s);
        return t.then(function(l) {
          if (l) return l.start(function() {
            var h = function() {
              return l.continue();
            };
            r && !r(l, function(g) {
              return h = g;
            }, function(g) {
              l.stop(g), h = se;
            }, function(g) {
              l.fail(g), h = se;
            }) || c(l.value, l, function(g) {
              return h = g;
            }), h();
          });
        });
      }
      var pr = (Ri.prototype.execute = function(t) {
        var r = this["@@propmod"];
        if (r.add !== void 0) {
          var s = r.add;
          if (p(s)) return a(a([], p(t) ? t : [], !0), s).sort();
          if (typeof s == "number") return (Number(t) || 0) + s;
          if (typeof s == "bigint") try {
            return BigInt(t) + s;
          } catch {
            return BigInt(0) + s;
          }
          throw new TypeError("Invalid term ".concat(s));
        }
        if (r.remove !== void 0) {
          var u = r.remove;
          if (p(u)) return p(t) ? t.filter(function(c) {
            return !u.includes(c);
          }).sort() : [];
          if (typeof u == "number") return Number(t) - u;
          if (typeof u == "bigint") try {
            return BigInt(t) - u;
          } catch {
            return BigInt(0) - u;
          }
          throw new TypeError("Invalid subtrahend ".concat(u));
        }
        return s = (s = r.replacePrefix) === null || s === void 0 ? void 0 : s[0], s && typeof t == "string" && t.startsWith(s) ? r.replacePrefix[1] + t.substring(s.length) : t;
      }, Ri);
      function Ri(t) {
        this["@@propmod"] = t;
      }
      var _u = (ne.prototype._read = function(t, r) {
        var s = this._ctx;
        return s.error ? s.table._trans(null, fe.bind(null, s.error)) : s.table._trans("readonly", t).then(r);
      }, ne.prototype._write = function(t) {
        var r = this._ctx;
        return r.error ? r.table._trans(null, fe.bind(null, r.error)) : r.table._trans("readwrite", t, "locked");
      }, ne.prototype._addAlgorithm = function(t) {
        var r = this._ctx;
        r.algorithm = wt(r.algorithm, t);
      }, ne.prototype._iterate = function(t, r) {
        return Xr(this._ctx, t, r, this._ctx.table.core);
      }, ne.prototype.clone = function(t) {
        var r = Object.create(this.constructor.prototype), s = Object.create(this._ctx);
        return t && y(s, t), r._ctx = s, r;
      }, ne.prototype.raw = function() {
        return this._ctx.valueMapper = null, this;
      }, ne.prototype.each = function(t) {
        var r = this._ctx;
        return this._read(function(s) {
          return Xr(r, t, s, r.table.core);
        });
      }, ne.prototype.count = function(t) {
        var r = this;
        return this._read(function(s) {
          var u = r._ctx, c = u.table.core;
          if (qt(u, !0)) return c.count({ trans: s, query: { index: Qr(u, c.schema), range: u.range } }).then(function(h) {
            return Math.min(h, u.limit);
          });
          var l = 0;
          return Xr(u, function() {
            return ++l, !1;
          }, s, c).then(function() {
            return l;
          });
        }).then(t);
      }, ne.prototype.sortBy = function(t, r) {
        var s = t.split(".").reverse(), u = s[0], c = s.length - 1;
        function l(b, w) {
          return w ? l(b[s[w]], w - 1) : b[u];
        }
        var h = this._ctx.dir === "next" ? 1 : -1;
        function g(b, w) {
          return X(l(b, c), l(w, c)) * h;
        }
        return this.toArray(function(b) {
          return b.sort(g);
        }).then(r);
      }, ne.prototype.toArray = function(t) {
        var r = this;
        return this._read(function(s) {
          var u = r._ctx;
          if (u.dir === "next" && qt(u, !0) && 0 < u.limit) {
            var c = u.valueMapper, l = Qr(u, u.table.core.schema);
            return u.table.core.query({ trans: s, limit: u.limit, values: !0, query: { index: l, range: u.range } }).then(function(g) {
              return g = g.result, c ? g.map(c) : g;
            });
          }
          var h = [];
          return Xr(u, function(g) {
            return h.push(g);
          }, s, u.table.core).then(function() {
            return h;
          });
        }, t);
      }, ne.prototype.offset = function(t) {
        var r = this._ctx;
        return t <= 0 || (r.offset += t, qt(r) ? ro(r, function() {
          var s = t;
          return function(u, c) {
            return s === 0 || (s === 1 ? --s : c(function() {
              u.advance(s), s = 0;
            }), !1);
          };
        }) : ro(r, function() {
          var s = t;
          return function() {
            return --s < 0;
          };
        })), this;
      }, ne.prototype.limit = function(t) {
        return this._ctx.limit = Math.min(this._ctx.limit, t), ro(this._ctx, function() {
          var r = t;
          return function(s, u, c) {
            return --r <= 0 && u(c), 0 <= r;
          };
        }, !0), this;
      }, ne.prototype.until = function(t, r) {
        return to(this._ctx, function(s, u, c) {
          return !t(s.value) || (u(c), r);
        }), this;
      }, ne.prototype.first = function(t) {
        return this.limit(1).toArray(function(r) {
          return r[0];
        }).then(t);
      }, ne.prototype.last = function(t) {
        return this.reverse().first(t);
      }, ne.prototype.filter = function(t) {
        var r;
        return to(this._ctx, function(s) {
          return t(s.value);
        }), (r = this._ctx).isMatch = wt(r.isMatch, t), this;
      }, ne.prototype.and = function(t) {
        return this.filter(t);
      }, ne.prototype.or = function(t) {
        return new this.db.WhereClause(this._ctx.table, t, this);
      }, ne.prototype.reverse = function() {
        return this._ctx.dir = this._ctx.dir === "prev" ? "next" : "prev", this._ondirectionchange && this._ondirectionchange(this._ctx.dir), this;
      }, ne.prototype.desc = function() {
        return this.reverse();
      }, ne.prototype.eachKey = function(t) {
        var r = this._ctx;
        return r.keysOnly = !r.isMatch, this.each(function(s, u) {
          t(u.key, u);
        });
      }, ne.prototype.eachUniqueKey = function(t) {
        return this._ctx.unique = "unique", this.eachKey(t);
      }, ne.prototype.eachPrimaryKey = function(t) {
        var r = this._ctx;
        return r.keysOnly = !r.isMatch, this.each(function(s, u) {
          t(u.primaryKey, u);
        });
      }, ne.prototype.keys = function(t) {
        var r = this._ctx;
        r.keysOnly = !r.isMatch;
        var s = [];
        return this.each(function(u, c) {
          s.push(c.key);
        }).then(function() {
          return s;
        }).then(t);
      }, ne.prototype.primaryKeys = function(t) {
        var r = this._ctx;
        if (r.dir === "next" && qt(r, !0) && 0 < r.limit) return this._read(function(u) {
          var c = Qr(r, r.table.core.schema);
          return r.table.core.query({ trans: u, values: !1, limit: r.limit, query: { index: c, range: r.range } });
        }).then(function(u) {
          return u.result;
        }).then(t);
        r.keysOnly = !r.isMatch;
        var s = [];
        return this.each(function(u, c) {
          s.push(c.primaryKey);
        }).then(function() {
          return s;
        }).then(t);
      }, ne.prototype.uniqueKeys = function(t) {
        return this._ctx.unique = "unique", this.keys(t);
      }, ne.prototype.firstKey = function(t) {
        return this.limit(1).keys(function(r) {
          return r[0];
        }).then(t);
      }, ne.prototype.lastKey = function(t) {
        return this.reverse().firstKey(t);
      }, ne.prototype.distinct = function() {
        var t = this._ctx, t = t.index && t.table.schema.idxByName[t.index];
        if (!t || !t.multi) return this;
        var r = {};
        return to(this._ctx, function(c) {
          var u = c.primaryKey.toString(), c = j(r, u);
          return r[u] = !0, !c;
        }), this;
      }, ne.prototype.modify = function(t) {
        var r = this, s = this._ctx;
        return this._write(function(u) {
          var c, l, h;
          h = typeof t == "function" ? t : (c = f(t), l = c.length, function(E) {
            for (var T = !1, C = 0; C < l; ++C) {
              var A = c[C], I = t[A], P = Ne(E, A);
              I instanceof pr ? (Se(E, A, I.execute(P)), T = !0) : P !== I && (Se(E, A, I), T = !0);
            }
            return T;
          });
          var g = s.table.core, m = g.schema.primaryKey, b = m.outbound, w = m.extractKey, _ = 200, m = r.db._options.modifyChunkSize;
          m && (_ = typeof m == "object" ? m[g.name] || m["*"] || 200 : m);
          function O(E, A) {
            var C = A.failures, A = A.numFailures;
            k += E - A;
            for (var I = 0, P = f(C); I < P.length; I++) {
              var M = P[I];
              v.push(C[M]);
            }
          }
          var v = [], k = 0, S = [], x = t === Fi;
          return r.clone().primaryKeys().then(function(E) {
            function T(A) {
              var I = Math.min(_, E.length - A), P = E.slice(A, A + I);
              return (x ? Promise.resolve([]) : g.getMany({ trans: u, keys: P, cache: "immutable" })).then(function(M) {
                var N = [], W = [], R = b ? [] : null, U = x ? P : [];
                if (!x) for (var Q = 0; Q < I; ++Q) {
                  var te = M[Q], G = { value: dt(te), primKey: E[A + Q] };
                  h.call(G, G.value, G) !== !1 && (G.value == null ? U.push(E[A + Q]) : b || X(w(te), w(G.value)) === 0 ? (W.push(G.value), b && R.push(E[A + Q])) : (U.push(E[A + Q]), N.push(G.value)));
                }
                return Promise.resolve(0 < N.length && g.mutate({ trans: u, type: "add", values: N }).then(function(ce) {
                  for (var Z in ce.failures) U.splice(parseInt(Z), 1);
                  O(N.length, ce);
                })).then(function() {
                  return (0 < W.length || C && typeof t == "object") && g.mutate({ trans: u, type: "put", keys: R, values: W, criteria: C, changeSpec: typeof t != "function" && t, isAdditionalChunk: 0 < A }).then(function(ce) {
                    return O(W.length, ce);
                  });
                }).then(function() {
                  return (0 < U.length || C && x) && g.mutate({ trans: u, type: "delete", keys: U, criteria: C, isAdditionalChunk: 0 < A }).then(function(ce) {
                    return Jr(s.table, U, ce);
                  }).then(function(ce) {
                    return O(U.length, ce);
                  });
                }).then(function() {
                  return E.length > A + I && T(A + _);
                });
              });
            }
            var C = qt(s) && s.limit === 1 / 0 && (typeof t != "function" || x) && { index: s.index, range: s.range };
            return T(0).then(function() {
              if (0 < v.length) throw new Wr("Error modifying one or more objects", v, k, S);
              return E.length;
            });
          });
        });
      }, ne.prototype.delete = function() {
        var t = this._ctx, r = t.range;
        return !qt(t) || t.table.schema.yProps || !t.isPrimKey && r.type !== 3 ? this.modify(Fi) : this._write(function(s) {
          var u = t.table.core.schema.primaryKey, c = r;
          return t.table.core.count({ trans: s, query: { index: u, range: c } }).then(function(l) {
            return t.table.core.mutate({ trans: s, type: "deleteRange", range: c }).then(function(b) {
              var g = b.failures, b = b.numFailures;
              if (b) throw new Wr("Could not delete some values", Object.keys(g).map(function(w) {
                return g[w];
              }), l - b);
              return l - b;
            });
          });
        });
      }, ne);
      function ne() {
      }
      var Fi = function(t, r) {
        return r.value = null;
      };
      function xu(t, r) {
        return t < r ? -1 : t === r ? 0 : 1;
      }
      function Su(t, r) {
        return r < t ? -1 : t === r ? 0 : 1;
      }
      function Te(t, r, s) {
        return t = t instanceof qi ? new t.Collection(t) : t, t._ctx.error = new (s || TypeError)(r), t;
      }
      function Vt(t) {
        return new t.Collection(t, function() {
          return Wi("");
        }).limit(0);
      }
      function en(t, r, s, u) {
        var c, l, h, g, b, w, _, m = s.length;
        if (!s.every(function(k) {
          return typeof k == "string";
        })) return Te(t, Ci);
        function O(k) {
          c = k === "next" ? function(x) {
            return x.toUpperCase();
          } : function(x) {
            return x.toLowerCase();
          }, l = k === "next" ? function(x) {
            return x.toLowerCase();
          } : function(x) {
            return x.toUpperCase();
          }, h = k === "next" ? xu : Su;
          var S = s.map(function(x) {
            return { lower: l(x), upper: c(x) };
          }).sort(function(x, E) {
            return h(x.lower, E.lower);
          });
          g = S.map(function(x) {
            return x.upper;
          }), b = S.map(function(x) {
            return x.lower;
          }), _ = (w = k) === "next" ? "" : u;
        }
        O("next"), t = new t.Collection(t, function() {
          return tt(g[0], b[m - 1] + u);
        }), t._ondirectionchange = function(k) {
          O(k);
        };
        var v = 0;
        return t._addAlgorithm(function(k, S, x) {
          var E = k.key;
          if (typeof E != "string") return !1;
          var T = l(E);
          if (r(T, b, v)) return !0;
          for (var C = null, A = v; A < m; ++A) {
            var I = (function(P, M, N, W, R, U) {
              for (var Q = Math.min(P.length, W.length), te = -1, G = 0; G < Q; ++G) {
                var ce = M[G];
                if (ce !== W[G]) return R(P[G], N[G]) < 0 ? P.substr(0, G) + N[G] + N.substr(G + 1) : R(P[G], W[G]) < 0 ? P.substr(0, G) + W[G] + N.substr(G + 1) : 0 <= te ? P.substr(0, te) + M[te] + N.substr(te + 1) : null;
                R(P[G], ce) < 0 && (te = G);
              }
              return Q < W.length && U === "next" ? P + N.substr(P.length) : Q < P.length && U === "prev" ? P.substr(0, N.length) : te < 0 ? null : P.substr(0, te) + W[te] + N.substr(te + 1);
            })(E, T, g[A], b[A], h, w);
            I === null && C === null ? v = A + 1 : (C === null || 0 < h(C, I)) && (C = I);
          }
          return S(C !== null ? function() {
            k.continue(C + _);
          } : x), !1;
        }), t;
      }
      function tt(t, r, s, u) {
        return { type: 2, lower: t, upper: r, lowerOpen: s, upperOpen: u };
      }
      function Wi(t) {
        return { type: 1, lower: t, upper: t };
      }
      var qi = (Object.defineProperty(be.prototype, "Collection", { get: function() {
        return this._ctx.table.db.Collection;
      }, enumerable: !1, configurable: !0 }), be.prototype.between = function(t, r, s, u) {
        s = s !== !1, u = u === !0;
        try {
          return 0 < this._cmp(t, r) || this._cmp(t, r) === 0 && (s || u) && (!s || !u) ? Vt(this) : new this.Collection(this, function() {
            return tt(t, r, !s, !u);
          });
        } catch {
          return Te(this, ze);
        }
      }, be.prototype.equals = function(t) {
        return t == null ? Te(this, ze) : new this.Collection(this, function() {
          return Wi(t);
        });
      }, be.prototype.above = function(t) {
        return t == null ? Te(this, ze) : new this.Collection(this, function() {
          return tt(t, void 0, !0);
        });
      }, be.prototype.aboveOrEqual = function(t) {
        return t == null ? Te(this, ze) : new this.Collection(this, function() {
          return tt(t, void 0, !1);
        });
      }, be.prototype.below = function(t) {
        return t == null ? Te(this, ze) : new this.Collection(this, function() {
          return tt(void 0, t, !1, !0);
        });
      }, be.prototype.belowOrEqual = function(t) {
        return t == null ? Te(this, ze) : new this.Collection(this, function() {
          return tt(void 0, t);
        });
      }, be.prototype.startsWith = function(t) {
        return typeof t != "string" ? Te(this, Ci) : this.between(t, t + vt, !0, !0);
      }, be.prototype.startsWithIgnoreCase = function(t) {
        return t === "" ? this.startsWith(t) : en(this, function(r, s) {
          return r.indexOf(s[0]) === 0;
        }, [t], vt);
      }, be.prototype.equalsIgnoreCase = function(t) {
        return en(this, function(r, s) {
          return r === s[0];
        }, [t], "");
      }, be.prototype.anyOfIgnoreCase = function() {
        var t = Le.apply(Mt, arguments);
        return t.length === 0 ? Vt(this) : en(this, function(r, s) {
          return s.indexOf(r) !== -1;
        }, t, "");
      }, be.prototype.startsWithAnyOfIgnoreCase = function() {
        var t = Le.apply(Mt, arguments);
        return t.length === 0 ? Vt(this) : en(this, function(r, s) {
          return s.some(function(u) {
            return r.indexOf(u) === 0;
          });
        }, t, vt);
      }, be.prototype.anyOf = function() {
        var t = this, r = Le.apply(Mt, arguments), s = this._cmp;
        try {
          r.sort(s);
        } catch {
          return Te(this, ze);
        }
        if (r.length === 0) return Vt(this);
        var u = new this.Collection(this, function() {
          return tt(r[0], r[r.length - 1]);
        });
        u._ondirectionchange = function(l) {
          s = l === "next" ? t._ascending : t._descending, r.sort(s);
        };
        var c = 0;
        return u._addAlgorithm(function(l, h, g) {
          for (var b = l.key; 0 < s(b, r[c]); ) if (++c === r.length) return h(g), !1;
          return s(b, r[c]) === 0 || (h(function() {
            l.continue(r[c]);
          }), !1);
        }), u;
      }, be.prototype.notEqual = function(t) {
        return this.inAnyRange([[-1 / 0, t], [t, this.db._maxKey]], { includeLowers: !1, includeUppers: !1 });
      }, be.prototype.noneOf = function() {
        var t = Le.apply(Mt, arguments);
        if (t.length === 0) return new this.Collection(this);
        try {
          t.sort(this._ascending);
        } catch {
          return Te(this, ze);
        }
        var r = t.reduce(function(s, u) {
          return s ? s.concat([[s[s.length - 1][1], u]]) : [[-1 / 0, u]];
        }, null);
        return r.push([t[t.length - 1], this.db._maxKey]), this.inAnyRange(r, { includeLowers: !1, includeUppers: !1 });
      }, be.prototype.inAnyRange = function(E, r) {
        var s = this, u = this._cmp, c = this._ascending, l = this._descending, h = this._min, g = this._max;
        if (E.length === 0) return Vt(this);
        if (!E.every(function(T) {
          return T[0] !== void 0 && T[1] !== void 0 && c(T[0], T[1]) <= 0;
        })) return Te(this, "First argument to inAnyRange() must be an Array of two-value Arrays [lower,upper] where upper must not be lower than lower", K.InvalidArgument);
        var b = !r || r.includeLowers !== !1, w = r && r.includeUppers === !0, _, m = c;
        function O(T, C) {
          return m(T[0], C[0]);
        }
        try {
          (_ = E.reduce(function(T, C) {
            for (var A = 0, I = T.length; A < I; ++A) {
              var P = T[A];
              if (u(C[0], P[1]) < 0 && 0 < u(C[1], P[0])) {
                P[0] = h(P[0], C[0]), P[1] = g(P[1], C[1]);
                break;
              }
            }
            return A === I && T.push(C), T;
          }, [])).sort(O);
        } catch {
          return Te(this, ze);
        }
        var v = 0, k = w ? function(T) {
          return 0 < c(T, _[v][1]);
        } : function(T) {
          return 0 <= c(T, _[v][1]);
        }, S = b ? function(T) {
          return 0 < l(T, _[v][0]);
        } : function(T) {
          return 0 <= l(T, _[v][0]);
        }, x = k, E = new this.Collection(this, function() {
          return tt(_[0][0], _[_.length - 1][1], !b, !w);
        });
        return E._ondirectionchange = function(T) {
          m = T === "next" ? (x = k, c) : (x = S, l), _.sort(O);
        }, E._addAlgorithm(function(T, C, A) {
          for (var I, P = T.key; x(P); ) if (++v === _.length) return C(A), !1;
          return !k(I = P) && !S(I) || (s._cmp(P, _[v][1]) === 0 || s._cmp(P, _[v][0]) === 0 || C(function() {
            m === c ? T.continue(_[v][0]) : T.continue(_[v][1]);
          }), !1);
        }), E;
      }, be.prototype.startsWithAnyOf = function() {
        var t = Le.apply(Mt, arguments);
        return t.every(function(r) {
          return typeof r == "string";
        }) ? t.length === 0 ? Vt(this) : this.inAnyRange(t.map(function(r) {
          return [r, r + vt];
        })) : Te(this, "startsWithAnyOf() only works with strings");
      }, be);
      function be() {
      }
      function Ve(t) {
        return ue(function(r) {
          return gr(r), t(r.target.error), !1;
        });
      }
      function gr(t) {
        t.stopPropagation && t.stopPropagation(), t.preventDefault && t.preventDefault();
      }
      var mr = "storagemutated", no = "x-storagemutated-1", rt = fr(null, mr), Ou = (Ue.prototype._lock = function() {
        return ct(!z.global), ++this._reculock, this._reculock !== 1 || z.global || (z.lockOwnerFor = this), this;
      }, Ue.prototype._unlock = function() {
        if (ct(!z.global), --this._reculock == 0) for (z.global || (z.lockOwnerFor = null); 0 < this._blockedFuncs.length && !this._locked(); ) {
          var t = this._blockedFuncs.shift();
          try {
            bt(t[1], t[0]);
          } catch {
          }
        }
        return this;
      }, Ue.prototype._locked = function() {
        return this._reculock && z.lockOwnerFor !== this;
      }, Ue.prototype.create = function(t) {
        var r = this;
        if (!this.mode) return this;
        var s = this.db.idbdb, u = this.db._state.dbOpenError;
        if (ct(!this.idbtrans), !t && !s) switch (u && u.name) {
          case "DatabaseClosedError":
            throw new K.DatabaseClosed(u);
          case "MissingAPIError":
            throw new K.MissingAPI(u.message, u);
          default:
            throw new K.OpenFailed(u);
        }
        if (!this.active) throw new K.TransactionInactive();
        return ct(this._completion._state === null), (t = this.idbtrans = t || (this.db.core || s).transaction(this.storeNames, this.mode, { durability: this.chromeTransactionDurability })).onerror = ue(function(c) {
          gr(c), r._reject(t.error);
        }), t.onabort = ue(function(c) {
          gr(c), r.active && r._reject(new K.Abort(t.error)), r.active = !1, r.on("abort").fire(c);
        }), t.oncomplete = ue(function() {
          r.active = !1, r._resolve(), "mutatedParts" in t && rt.storagemutated.fire(t.mutatedParts);
        }), this;
      }, Ue.prototype._promise = function(t, r, s) {
        var u = this;
        if (t === "readwrite" && this.mode !== "readwrite") return fe(new K.ReadOnly("Transaction is readonly"));
        if (!this.active) return fe(new K.TransactionInactive());
        if (this._locked()) return new V(function(l, h) {
          u._blockedFuncs.push([function() {
            u._promise(t, r, s).then(l, h);
          }, z]);
        });
        if (s) return Qe(function() {
          var l = new V(function(h, g) {
            u._lock();
            var b = r(h, g, u);
            b && b.then && b.then(h, g);
          });
          return l.finally(function() {
            return u._unlock();
          }), l._lib = !0, l;
        });
        var c = new V(function(l, h) {
          var g = r(l, h, u);
          g && g.then && g.then(l, h);
        });
        return c._lib = !0, c;
      }, Ue.prototype._root = function() {
        return this.parent ? this.parent._root() : this;
      }, Ue.prototype.waitFor = function(t) {
        var r, s = this._root(), u = V.resolve(t);
        s._waitingFor ? s._waitingFor = s._waitingFor.then(function() {
          return u;
        }) : (s._waitingFor = u, s._waitingQueue = [], r = s.idbtrans.objectStore(s.storeNames[0]), (function l() {
          for (++s._spinCount; s._waitingQueue.length; ) s._waitingQueue.shift()();
          s._waitingFor && (r.get(-1 / 0).onsuccess = l);
        })());
        var c = s._waitingFor;
        return new V(function(l, h) {
          u.then(function(g) {
            return s._waitingQueue.push(ue(l.bind(null, g)));
          }, function(g) {
            return s._waitingQueue.push(ue(h.bind(null, g)));
          }).finally(function() {
            s._waitingFor === c && (s._waitingFor = null);
          });
        });
      }, Ue.prototype.abort = function() {
        this.active && (this.active = !1, this.idbtrans && this.idbtrans.abort(), this._reject(new K.Abort()));
      }, Ue.prototype.table = function(t) {
        var r = this._memoizedTables || (this._memoizedTables = {});
        if (j(r, t)) return r[t];
        var s = this.schema[t];
        if (!s) throw new K.NotFound("Table " + t + " not part of transaction");
        return s = new this.db.Table(t, s, this), s.core = this.db.core.table(t), r[t] = s;
      }, Ue);
      function Ue() {
      }
      function oo(t, r, s, u, c, l, h, g) {
        return { name: t, keyPath: r, unique: s, multi: u, auto: c, compound: l, src: (s && !h ? "&" : "") + (u ? "*" : "") + (c ? "++" : "") + Vi(r), type: g };
      }
      function Vi(t) {
        return typeof t == "string" ? t : t ? "[" + [].join.call(t, "+") + "]" : "";
      }
      function io(t, r, s) {
        return { name: t, primKey: r, indexes: s, mappedClass: null, idxByName: (u = function(c) {
          return [c.name, c];
        }, s.reduce(function(c, l, h) {
          return h = u(l, h), h && (c[h[0]] = h[1]), c;
        }, {})) };
        var u;
      }
      var yr = function(t) {
        try {
          return t.only([[]]), yr = function() {
            return [[]];
          }, [[]];
        } catch {
          return yr = function() {
            return vt;
          }, vt;
        }
      };
      function so(t) {
        return t == null ? function() {
        } : typeof t == "string" ? (r = t).split(".").length === 1 ? function(s) {
          return s[r];
        } : function(s) {
          return Ne(s, r);
        } : function(s) {
          return Ne(s, t);
        };
        var r;
      }
      function Ui(t) {
        return [].slice.call(t);
      }
      var Eu = 0;
      function br(t) {
        return t == null ? ":id" : typeof t == "string" ? t : "[".concat(t.join("+"), "]");
      }
      function Tu(t, r, b) {
        function u(x) {
          if (x.type === 3) return null;
          if (x.type === 4) throw new Error("Cannot convert never type to IDBKeyRange");
          var v = x.lower, k = x.upper, S = x.lowerOpen, x = x.upperOpen;
          return v === void 0 ? k === void 0 ? null : r.upperBound(k, !!x) : k === void 0 ? r.lowerBound(v, !!S) : r.bound(v, k, !!S, !!x);
        }
        function c(O) {
          var v, k = O.name;
          return { name: k, schema: O, mutate: function(S) {
            var x = S.trans, E = S.type, T = S.keys, C = S.values, A = S.range;
            return new Promise(function(I, P) {
              I = ue(I);
              var M = x.objectStore(k), N = M.keyPath == null, W = E === "put" || E === "add";
              if (!W && E !== "delete" && E !== "deleteRange") throw new Error("Invalid operation type: " + E);
              var R, U = (T || C || { length: 1 }).length;
              if (T && C && T.length !== C.length) throw new Error("Given keys array must have same length as given values array.");
              if (U === 0) return I({ numFailures: 0, failures: {}, results: [], lastResult: void 0 });
              function Q(Oe) {
                ++ce, gr(Oe);
              }
              var te = [], G = [], ce = 0;
              if (E === "deleteRange") {
                if (A.type === 4) return I({ numFailures: ce, failures: G, results: [], lastResult: void 0 });
                A.type === 3 ? te.push(R = M.clear()) : te.push(R = M.delete(u(A)));
              } else {
                var N = W ? N ? [C, T] : [C, null] : [T, null], Z = N[0], we = N[1];
                if (W) for (var ke = 0; ke < U; ++ke) te.push(R = we && we[ke] !== void 0 ? M[E](Z[ke], we[ke]) : M[E](Z[ke])), R.onerror = Q;
                else for (ke = 0; ke < U; ++ke) te.push(R = M[E](Z[ke])), R.onerror = Q;
              }
              function hn(Oe) {
                Oe = Oe.target.result, te.forEach(function(xt, Oo) {
                  return xt.error != null && (G[Oo] = xt.error);
                }), I({ numFailures: ce, failures: G, results: E === "delete" ? T : te.map(function(xt) {
                  return xt.result;
                }), lastResult: Oe });
              }
              R.onerror = function(Oe) {
                Q(Oe), hn(Oe);
              }, R.onsuccess = hn;
            });
          }, getMany: function(S) {
            var x = S.trans, E = S.keys;
            return new Promise(function(T, C) {
              T = ue(T);
              for (var A, I = x.objectStore(k), P = E.length, M = new Array(P), N = 0, W = 0, R = function(te) {
                te = te.target, M[te._pos] = te.result, ++W === N && T(M);
              }, U = Ve(C), Q = 0; Q < P; ++Q) E[Q] != null && ((A = I.get(E[Q]))._pos = Q, A.onsuccess = R, A.onerror = U, ++N);
              N === 0 && T(M);
            });
          }, get: function(S) {
            var x = S.trans, E = S.key;
            return new Promise(function(T, C) {
              T = ue(T);
              var A = x.objectStore(k).get(E);
              A.onsuccess = function(I) {
                return T(I.target.result);
              }, A.onerror = Ve(C);
            });
          }, query: (v = w, function(S) {
            return new Promise(function(x, E) {
              x = ue(x);
              var T, C, A, N = S.trans, I = S.values, P = S.limit, R = S.query, M = P === 1 / 0 ? void 0 : P, W = R.index, R = R.range, N = N.objectStore(k), W = W.isPrimaryKey ? N : N.index(W.name), R = u(R);
              if (P === 0) return x({ result: [] });
              v ? ((M = I ? W.getAll(R, M) : W.getAllKeys(R, M)).onsuccess = function(U) {
                return x({ result: U.target.result });
              }, M.onerror = Ve(E)) : (T = 0, C = !I && "openKeyCursor" in W ? W.openKeyCursor(R) : W.openCursor(R), A = [], C.onsuccess = function(U) {
                var Q = C.result;
                return Q ? (A.push(I ? Q.value : Q.primaryKey), ++T === P ? x({ result: A }) : void Q.continue()) : x({ result: A });
              }, C.onerror = Ve(E));
            });
          }), openCursor: function(S) {
            var x = S.trans, E = S.values, T = S.query, C = S.reverse, A = S.unique;
            return new Promise(function(I, P) {
              I = ue(I);
              var W = T.index, M = T.range, N = x.objectStore(k), N = W.isPrimaryKey ? N : N.index(W.name), W = C ? A ? "prevunique" : "prev" : A ? "nextunique" : "next", R = !E && "openKeyCursor" in N ? N.openKeyCursor(u(M), W) : N.openCursor(u(M), W);
              R.onerror = Ve(P), R.onsuccess = ue(function(U) {
                var Q, te, G, ce, Z = R.result;
                Z ? (Z.___id = ++Eu, Z.done = !1, Q = Z.continue.bind(Z), te = (te = Z.continuePrimaryKey) && te.bind(Z), G = Z.advance.bind(Z), ce = function() {
                  throw new Error("Cursor not stopped");
                }, Z.trans = x, Z.stop = Z.continue = Z.continuePrimaryKey = Z.advance = function() {
                  throw new Error("Cursor not started");
                }, Z.fail = ue(P), Z.next = function() {
                  var we = this, ke = 1;
                  return this.start(function() {
                    return ke-- ? we.continue() : we.stop();
                  }).then(function() {
                    return we;
                  });
                }, Z.start = function(we) {
                  function ke() {
                    if (R.result) try {
                      we();
                    } catch (Oe) {
                      Z.fail(Oe);
                    }
                    else Z.done = !0, Z.start = function() {
                      throw new Error("Cursor behind last entry");
                    }, Z.stop();
                  }
                  var hn = new Promise(function(Oe, xt) {
                    Oe = ue(Oe), R.onerror = Ve(xt), Z.fail = xt, Z.stop = function(Oo) {
                      Z.stop = Z.continue = Z.continuePrimaryKey = Z.advance = ce, Oe(Oo);
                    };
                  });
                  return R.onsuccess = ue(function(Oe) {
                    R.onsuccess = ke, ke();
                  }), Z.continue = Q, Z.continuePrimaryKey = te, Z.advance = G, ke(), hn;
                }, I(Z)) : I(null);
              }, P);
            });
          }, count: function(S) {
            var x = S.query, E = S.trans, T = x.index, C = x.range;
            return new Promise(function(A, I) {
              var P = E.objectStore(k), M = T.isPrimaryKey ? P : P.index(T.name), P = u(C), M = P ? M.count(P) : M.count();
              M.onsuccess = ue(function(N) {
                return A(N.target.result);
              }), M.onerror = Ve(I);
            });
          } };
        }
        var l, h, g, _ = (h = b, g = Ui((l = t).objectStoreNames), { schema: { name: l.name, tables: g.map(function(O) {
          return h.objectStore(O);
        }).map(function(O) {
          var v = O.keyPath, x = O.autoIncrement, k = p(v), S = {}, x = { name: O.name, primaryKey: { name: null, isPrimaryKey: !0, outbound: v == null, compound: k, keyPath: v, autoIncrement: x, unique: !0, extractKey: so(v) }, indexes: Ui(O.indexNames).map(function(E) {
            return O.index(E);
          }).map(function(A) {
            var T = A.name, C = A.unique, I = A.multiEntry, A = A.keyPath, I = { name: T, compound: p(A), keyPath: A, unique: C, multiEntry: I, extractKey: so(A) };
            return S[br(A)] = I;
          }), getIndexByKeyPath: function(E) {
            return S[br(E)];
          } };
          return S[":id"] = x.primaryKey, v != null && (S[br(v)] = x.primaryKey), x;
        }) }, hasGetAll: 0 < g.length && "getAll" in h.objectStore(g[0]) && !(typeof navigator < "u" && /Safari/.test(navigator.userAgent) && !/(Chrome\/|Edge\/)/.test(navigator.userAgent) && [].concat(navigator.userAgent.match(/Safari\/(\d*)/))[1] < 604) }), b = _.schema, w = _.hasGetAll, _ = b.tables.map(c), m = {};
        return _.forEach(function(O) {
          return m[O.name] = O;
        }), { stack: "dbcore", transaction: t.transaction.bind(t), table: function(O) {
          if (!m[O]) throw new Error("Table '".concat(O, "' not found"));
          return m[O];
        }, MIN_KEY: -1 / 0, MAX_KEY: yr(r), schema: b };
      }
      function $u(t, r, s, u) {
        var c = s.IDBKeyRange;
        return s.indexedDB, { dbcore: (u = Tu(r, c, u), t.dbcore.reduce(function(l, h) {
          return h = h.create, i(i({}, l), h(l));
        }, u)) };
      }
      function tn(t, u) {
        var s = u.db, u = $u(t._middlewares, s, t._deps, u);
        t.core = u.dbcore, t.tables.forEach(function(c) {
          var l = c.name;
          t.core.schema.tables.some(function(h) {
            return h.name === l;
          }) && (c.core = t.core.table(l), t[l] instanceof t.Table && (t[l].core = c.core));
        });
      }
      function rn(t, r, s, u) {
        s.forEach(function(c) {
          var l = u[c];
          r.forEach(function(h) {
            var g = (function b(w, _) {
              return Ce(w, _) || (w = D(w)) && b(w, _);
            })(h, c);
            (!g || "value" in g && g.value === void 0) && (h === t.Transaction.prototype || h instanceof t.Transaction ? ee(h, c, { get: function() {
              return this.table(c);
            }, set: function(b) {
              L(this, c, { value: b, writable: !0, configurable: !0, enumerable: !0 });
            } }) : h[c] = new t.Table(c, l));
          });
        });
      }
      function ao(t, r) {
        r.forEach(function(s) {
          for (var u in s) s[u] instanceof t.Table && delete s[u];
        });
      }
      function Cu(t, r) {
        return t._cfg.version - r._cfg.version;
      }
      function Au(t, r, s, u) {
        var c = t._dbSchema;
        s.objectStoreNames.contains("$meta") && !c.$meta && (c.$meta = io("$meta", zi("")[0], []), t._storeNames.push("$meta"));
        var l = t._createTransaction("readwrite", t._storeNames, c);
        l.create(s), l._completion.catch(u);
        var h = l._reject.bind(l), g = z.transless || z;
        Qe(function() {
          return z.trans = l, z.transless = g, r !== 0 ? (tn(t, s), w = r, ((b = l).storeNames.includes("$meta") ? b.table("$meta").get("version").then(function(_) {
            return _ ?? w;
          }) : V.resolve(w)).then(function(_) {
            return O = _, v = l, k = s, S = [], _ = (m = t)._versions, x = m._dbSchema = on(0, m.idbdb, k), (_ = _.filter(function(E) {
              return E._cfg.version >= O;
            })).length !== 0 ? (_.forEach(function(E) {
              S.push(function() {
                var T = x, C = E._cfg.dbschema;
                sn(m, T, k), sn(m, C, k), x = m._dbSchema = C;
                var A = uo(T, C);
                A.add.forEach(function(W) {
                  co(k, W[0], W[1].primKey, W[1].indexes);
                }), A.change.forEach(function(W) {
                  if (W.recreate) throw new K.Upgrade("Not yet support for changing primary key");
                  var R = k.objectStore(W.name);
                  W.add.forEach(function(U) {
                    return nn(R, U);
                  }), W.change.forEach(function(U) {
                    R.deleteIndex(U.name), nn(R, U);
                  }), W.del.forEach(function(U) {
                    return R.deleteIndex(U);
                  });
                });
                var I = E._cfg.contentUpgrade;
                if (I && E._cfg.version > O) {
                  tn(m, k), v._memoizedTables = {};
                  var P = Rr(C);
                  A.del.forEach(function(W) {
                    P[W] = T[W];
                  }), ao(m, [m.Transaction.prototype]), rn(m, [m.Transaction.prototype], f(P), P), v.schema = P;
                  var M, N = Un(I);
                  return N && Ft(), A = V.follow(function() {
                    var W;
                    (M = I(v)) && N && (W = Xe.bind(null, null), M.then(W, W));
                  }), M && typeof M.then == "function" ? V.resolve(M) : A.then(function() {
                    return M;
                  });
                }
              }), S.push(function(T) {
                var C, A, I = E._cfg.dbschema;
                C = I, A = T, [].slice.call(A.db.objectStoreNames).forEach(function(P) {
                  return C[P] == null && A.db.deleteObjectStore(P);
                }), ao(m, [m.Transaction.prototype]), rn(m, [m.Transaction.prototype], m._storeNames, m._dbSchema), v.schema = m._dbSchema;
              }), S.push(function(T) {
                m.idbdb.objectStoreNames.contains("$meta") && (Math.ceil(m.idbdb.version / 10) === E._cfg.version ? (m.idbdb.deleteObjectStore("$meta"), delete m._dbSchema.$meta, m._storeNames = m._storeNames.filter(function(C) {
                  return C !== "$meta";
                })) : T.objectStore("$meta").put(E._cfg.version, "version"));
              });
            }), (function E() {
              return S.length ? V.resolve(S.shift()(v.idbtrans)).then(E) : V.resolve();
            })().then(function() {
              Li(x, k);
            })) : V.resolve();
            var m, O, v, k, S, x;
          }).catch(h)) : (f(c).forEach(function(_) {
            co(s, _, c[_].primKey, c[_].indexes);
          }), tn(t, s), void V.follow(function() {
            return t.on.populate.fire(l);
          }).catch(h));
          var b, w;
        });
      }
      function Du(t, r) {
        Li(t._dbSchema, r), r.db.version % 10 != 0 || r.objectStoreNames.contains("$meta") || r.db.createObjectStore("$meta").add(Math.ceil(r.db.version / 10 - 1), "version");
        var s = on(0, t.idbdb, r);
        sn(t, t._dbSchema, r);
        for (var u = 0, c = uo(s, t._dbSchema).change; u < c.length; u++) {
          var l = (function(h) {
            if (h.change.length || h.recreate) return { value: void 0 };
            var g = r.objectStore(h.name);
            h.add.forEach(function(b) {
              nn(g, b);
            });
          })(c[u]);
          if (typeof l == "object") return l.value;
        }
      }
      function uo(t, r) {
        var s, u = { del: [], add: [], change: [] };
        for (s in t) r[s] || u.del.push(s);
        for (s in r) {
          var c = t[s], l = r[s];
          if (c) {
            var h = { name: s, def: l, recreate: !1, del: [], add: [], change: [] };
            if ("" + (c.primKey.keyPath || "") != "" + (l.primKey.keyPath || "") || c.primKey.auto !== l.primKey.auto) h.recreate = !0, u.change.push(h);
            else {
              var g = c.idxByName, b = l.idxByName, w = void 0;
              for (w in g) b[w] || h.del.push(w);
              for (w in b) {
                var _ = g[w], m = b[w];
                _ ? _.src !== m.src && h.change.push(m) : h.add.push(m);
              }
              (0 < h.del.length || 0 < h.add.length || 0 < h.change.length) && u.change.push(h);
            }
          } else u.add.push([s, l]);
        }
        return u;
      }
      function co(t, r, s, u) {
        var c = t.db.createObjectStore(r, s.keyPath ? { keyPath: s.keyPath, autoIncrement: s.auto } : { autoIncrement: s.auto });
        return u.forEach(function(l) {
          return nn(c, l);
        }), c;
      }
      function Li(t, r) {
        f(t).forEach(function(s) {
          r.db.objectStoreNames.contains(s) || co(r, s, t[s].primKey, t[s].indexes);
        });
      }
      function nn(t, r) {
        t.createIndex(r.name, r.keyPath, { unique: r.unique, multiEntry: r.multi });
      }
      function on(t, r, s) {
        var u = {};
        return We(r.objectStoreNames, 0).forEach(function(c) {
          for (var l = s.objectStore(c), h = oo(Vi(w = l.keyPath), w || "", !0, !1, !!l.autoIncrement, w && typeof w != "string", !0), g = [], b = 0; b < l.indexNames.length; ++b) {
            var _ = l.index(l.indexNames[b]), w = _.keyPath, _ = oo(_.name, w, !!_.unique, !!_.multiEntry, !1, w && typeof w != "string", !1);
            g.push(_);
          }
          u[c] = io(c, h, g);
        }), u;
      }
      function sn(t, r, s) {
        for (var u = s.db.objectStoreNames, c = 0; c < u.length; ++c) {
          var l = u[c], h = s.objectStore(l);
          t._hasGetAll = "getAll" in h;
          for (var g = 0; g < h.indexNames.length; ++g) {
            var b = h.indexNames[g], w = h.index(b).keyPath, _ = typeof w == "string" ? w : "[" + We(w).join("+") + "]";
            !r[l] || (w = r[l].idxByName[_]) && (w.name = b, delete r[l].idxByName[_], r[l].idxByName[b] = w);
          }
        }
        typeof navigator < "u" && /Safari/.test(navigator.userAgent) && !/(Chrome\/|Edge\/)/.test(navigator.userAgent) && d.WorkerGlobalScope && d instanceof d.WorkerGlobalScope && [].concat(navigator.userAgent.match(/Safari\/(\d*)/))[1] < 604 && (t._hasGetAll = !1);
      }
      function zi(t) {
        return t.split(",").map(function(r, s) {
          var l = r.split(":"), u = (c = l[1]) === null || c === void 0 ? void 0 : c.trim(), c = (r = l[0].trim()).replace(/([&*]|\+\+)/g, ""), l = /^\[/.test(c) ? c.match(/^\[(.*)\]$/)[1].split("+") : c;
          return oo(c, l || null, /\&/.test(r), /\*/.test(r), /\+\+/.test(r), p(l), s === 0, u);
        });
      }
      var Iu = (Ut.prototype._createTableSchema = io, Ut.prototype._parseIndexSyntax = zi, Ut.prototype._parseStoresSpec = function(t, r) {
        var s = this;
        f(t).forEach(function(u) {
          if (t[u] !== null) {
            var c = s._parseIndexSyntax(t[u]), l = c.shift();
            if (!l) throw new K.Schema("Invalid schema for table " + u + ": " + t[u]);
            if (l.unique = !0, l.multi) throw new K.Schema("Primary key cannot be multiEntry*");
            c.forEach(function(h) {
              if (h.auto) throw new K.Schema("Only primary key can be marked as autoIncrement (++)");
              if (!h.keyPath) throw new K.Schema("Index must have a name and cannot be an empty string");
            }), c = s._createTableSchema(u, l, c), r[u] = c;
          }
        });
      }, Ut.prototype.stores = function(s) {
        var r = this.db;
        this._cfg.storesSource = this._cfg.storesSource ? y(this._cfg.storesSource, s) : s;
        var s = r._versions, u = {}, c = {};
        return s.forEach(function(l) {
          y(u, l._cfg.storesSource), c = l._cfg.dbschema = {}, l._parseStoresSpec(u, c);
        }), r._dbSchema = c, ao(r, [r._allTables, r, r.Transaction.prototype]), rn(r, [r._allTables, r, r.Transaction.prototype, this._cfg.tables], f(c), c), r._storeNames = f(c), this;
      }, Ut.prototype.upgrade = function(t) {
        return this._cfg.contentUpgrade = zn(this._cfg.contentUpgrade || se, t), this;
      }, Ut);
      function Ut() {
      }
      function lo(t, r) {
        var s = t._dbNamesDB;
        return s || (s = t._dbNamesDB = new Ke(Yr, { addons: [], indexedDB: t, IDBKeyRange: r })).version(1).stores({ dbnames: "name" }), s.table("dbnames");
      }
      function fo(t) {
        return t && typeof t.databases == "function";
      }
      function ho(t) {
        return Qe(function() {
          return z.letThrough = !0, t();
        });
      }
      function po(t) {
        return !("from" in t);
      }
      var ve = function(t, r) {
        if (!this) {
          var s = new ve();
          return t && "d" in t && y(s, t), s;
        }
        y(this, arguments.length ? { d: 1, from: t, to: 1 < arguments.length ? r : t } : { d: 0 });
      };
      function vr(t, r, s) {
        var u = X(r, s);
        if (!isNaN(u)) {
          if (0 < u) throw RangeError();
          if (po(t)) return y(t, { from: r, to: s, d: 1 });
          var c = t.l, u = t.r;
          if (X(s, t.from) < 0) return c ? vr(c, r, s) : t.l = { from: r, to: s, d: 1, l: null, r: null }, Bi(t);
          if (0 < X(r, t.to)) return u ? vr(u, r, s) : t.r = { from: r, to: s, d: 1, l: null, r: null }, Bi(t);
          X(r, t.from) < 0 && (t.from = r, t.l = null, t.d = u ? u.d + 1 : 1), 0 < X(s, t.to) && (t.to = s, t.r = null, t.d = t.l ? t.l.d + 1 : 1), s = !t.r, c && !t.l && wr(t, c), u && s && wr(t, u);
        }
      }
      function wr(t, r) {
        po(r) || (function s(u, b) {
          var l = b.from, h = b.to, g = b.l, b = b.r;
          vr(u, l, h), g && s(u, g), b && s(u, b);
        })(t, r);
      }
      function Ki(t, r) {
        var s = an(r), u = s.next();
        if (u.done) return !1;
        for (var c = u.value, l = an(t), h = l.next(c.from), g = h.value; !u.done && !h.done; ) {
          if (X(g.from, c.to) <= 0 && 0 <= X(g.to, c.from)) return !0;
          X(c.from, g.from) < 0 ? c = (u = s.next(g.from)).value : g = (h = l.next(c.from)).value;
        }
        return !1;
      }
      function an(t) {
        var r = po(t) ? null : { s: 0, n: t };
        return { next: function(s) {
          for (var u = 0 < arguments.length; r; ) switch (r.s) {
            case 0:
              if (r.s = 1, u) for (; r.n.l && X(s, r.n.from) < 0; ) r = { up: r, n: r.n.l, s: 1 };
              else for (; r.n.l; ) r = { up: r, n: r.n.l, s: 1 };
            case 1:
              if (r.s = 2, !u || X(s, r.n.to) <= 0) return { value: r.n, done: !1 };
            case 2:
              if (r.n.r) {
                r.s = 3, r = { up: r, n: r.n.r, s: 0 };
                continue;
              }
            case 3:
              r = r.up;
          }
          return { done: !0 };
        } };
      }
      function Bi(t) {
        var r, s, u = (((r = t.r) === null || r === void 0 ? void 0 : r.d) || 0) - (((s = t.l) === null || s === void 0 ? void 0 : s.d) || 0), c = 1 < u ? "r" : u < -1 ? "l" : "";
        c && (r = c == "r" ? "l" : "r", s = i({}, t), u = t[c], t.from = u.from, t.to = u.to, t[c] = u[c], s[c] = u[r], (t[r] = s).d = Hi(s)), t.d = Hi(t);
      }
      function Hi(s) {
        var r = s.r, s = s.l;
        return (r ? s ? Math.max(r.d, s.d) : r.d : s ? s.d : 0) + 1;
      }
      function un(t, r) {
        return f(r).forEach(function(s) {
          t[s] ? wr(t[s], r[s]) : t[s] = (function u(c) {
            var l, h, g = {};
            for (l in c) j(c, l) && (h = c[l], g[l] = !h || typeof h != "object" || Fr.has(h.constructor) ? h : u(h));
            return g;
          })(r[s]);
        }), t;
      }
      function go(t, r) {
        return t.all || r.all || Object.keys(t).some(function(s) {
          return r[s] && Ki(r[s], t[s]);
        });
      }
      Y(ve.prototype, ((Ae = { add: function(t) {
        return wr(this, t), this;
      }, addKey: function(t) {
        return vr(this, t, t), this;
      }, addKeys: function(t) {
        var r = this;
        return t.forEach(function(s) {
          return vr(r, s, s);
        }), this;
      }, hasKey: function(t) {
        var r = an(this).next(t).value;
        return r && X(r.from, t) <= 0 && 0 <= X(r.to, t);
      } })[Vn] = function() {
        return an(this);
      }, Ae));
      var kt = {}, mo = {}, yo = !1;
      function cn(t) {
        un(mo, t), yo || (yo = !0, setTimeout(function() {
          yo = !1, bo(mo, !(mo = {}));
        }, 0));
      }
      function bo(t, r) {
        r === void 0 && (r = !1);
        var s = /* @__PURE__ */ new Set();
        if (t.all) for (var u = 0, c = Object.values(kt); u < c.length; u++) Zi(h = c[u], t, s, r);
        else for (var l in t) {
          var h, g = /^idb\:\/\/(.*)\/(.*)\//.exec(l);
          g && (l = g[1], g = g[2], (h = kt["idb://".concat(l, "/").concat(g)]) && Zi(h, t, s, r));
        }
        s.forEach(function(b) {
          return b();
        });
      }
      function Zi(t, r, s, u) {
        for (var c = [], l = 0, h = Object.entries(t.queries.query); l < h.length; l++) {
          for (var g = h[l], b = g[0], w = [], _ = 0, m = g[1]; _ < m.length; _++) {
            var O = m[_];
            go(r, O.obsSet) ? O.subscribers.forEach(function(x) {
              return s.add(x);
            }) : u && w.push(O);
          }
          u && c.push([b, w]);
        }
        if (u) for (var v = 0, k = c; v < k.length; v++) {
          var S = k[v], b = S[0], w = S[1];
          t.queries.query[b] = w;
        }
      }
      function Mu(t) {
        var r = t._state, s = t._deps.indexedDB;
        if (r.isBeingOpened || t.idbdb) return r.dbReadyPromise.then(function() {
          return r.dbOpenError ? fe(r.dbOpenError) : t;
        });
        r.isBeingOpened = !0, r.dbOpenError = null, r.openComplete = !1;
        var u = r.openCanceller, c = Math.round(10 * t.verno), l = !1;
        function h() {
          if (r.openCanceller !== u) throw new K.DatabaseClosed("db.open() was cancelled");
        }
        function g() {
          return new V(function(O, v) {
            if (h(), !s) throw new K.MissingAPI();
            var k = t.name, S = r.autoSchema || !c ? s.open(k) : s.open(k, c);
            if (!S) throw new K.MissingAPI();
            S.onerror = Ve(v), S.onblocked = ue(t._fireOnBlocked), S.onupgradeneeded = ue(function(x) {
              var E;
              _ = S.transaction, r.autoSchema && !t._options.allowEmptyDB ? (S.onerror = gr, _.abort(), S.result.close(), (E = s.deleteDatabase(k)).onsuccess = E.onerror = ue(function() {
                v(new K.NoSuchDatabase("Database ".concat(k, " doesnt exist")));
              })) : (_.onerror = Ve(v), x = x.oldVersion > Math.pow(2, 62) ? 0 : x.oldVersion, m = x < 1, t.idbdb = S.result, l && Du(t, _), Au(t, x / 10, _, v));
            }, v), S.onsuccess = ue(function() {
              _ = null;
              var x, E, T, C, A, I = t.idbdb = S.result, P = We(I.objectStoreNames);
              if (0 < P.length) try {
                var M = I.transaction((C = P).length === 1 ? C[0] : C, "readonly");
                if (r.autoSchema) E = I, T = M, (x = t).verno = E.version / 10, T = x._dbSchema = on(0, E, T), x._storeNames = We(E.objectStoreNames, 0), rn(x, [x._allTables], f(T), T);
                else if (sn(t, t._dbSchema, M), ((A = uo(on(0, (A = t).idbdb, M), A._dbSchema)).add.length || A.change.some(function(N) {
                  return N.add.length || N.change.length;
                })) && !l) return I.close(), c = I.version + 1, l = !0, O(g());
                tn(t, M);
              } catch {
              }
              Wt.push(t), I.onversionchange = ue(function(N) {
                r.vcFired = !0, t.on("versionchange").fire(N);
              }), I.onclose = ue(function(N) {
                t.on("close").fire(N);
              }), m && (A = t._deps, M = k, I = A.indexedDB, A = A.IDBKeyRange, fo(I) || M === Yr || lo(I, A).put({ name: M }).catch(se)), O();
            }, v);
          }).catch(function(O) {
            switch (O?.name) {
              case "UnknownError":
                if (0 < r.PR1398_maxLoop) return r.PR1398_maxLoop--, g();
                break;
              case "VersionError":
                if (0 < c) return c = 0, g();
            }
            return V.reject(O);
          });
        }
        var b, w = r.dbReadyResolve, _ = null, m = !1;
        return V.race([u, (typeof navigator > "u" ? V.resolve() : !navigator.userAgentData && /Safari\//.test(navigator.userAgent) && !/Chrom(e|ium)\//.test(navigator.userAgent) && indexedDB.databases ? new Promise(function(O) {
          function v() {
            return indexedDB.databases().finally(O);
          }
          b = setInterval(v, 100), v();
        }).finally(function() {
          return clearInterval(b);
        }) : Promise.resolve()).then(g)]).then(function() {
          return h(), r.onReadyBeingFired = [], V.resolve(ho(function() {
            return t.on.ready.fire(t.vip);
          })).then(function O() {
            if (0 < r.onReadyBeingFired.length) {
              var v = r.onReadyBeingFired.reduce(zn, se);
              return r.onReadyBeingFired = [], V.resolve(ho(function() {
                return v(t.vip);
              })).then(O);
            }
          });
        }).finally(function() {
          r.openCanceller === u && (r.onReadyBeingFired = null, r.isBeingOpened = !1);
        }).catch(function(O) {
          r.dbOpenError = O;
          try {
            _ && _.abort();
          } catch {
          }
          return u === r.openCanceller && t._close(), fe(O);
        }).finally(function() {
          r.openComplete = !0, w();
        }).then(function() {
          var O;
          return m && (O = {}, t.tables.forEach(function(v) {
            v.schema.indexes.forEach(function(k) {
              k.name && (O["idb://".concat(t.name, "/").concat(v.name, "/").concat(k.name)] = new ve(-1 / 0, [[[]]]));
            }), O["idb://".concat(t.name, "/").concat(v.name, "/")] = O["idb://".concat(t.name, "/").concat(v.name, "/:dels")] = new ve(-1 / 0, [[[]]]);
          }), rt(mr).fire(O), bo(O, !0)), t;
        });
      }
      function vo(t) {
        function r(l) {
          return t.next(l);
        }
        var s = c(r), u = c(function(l) {
          return t.throw(l);
        });
        function c(l) {
          return function(b) {
            var g = l(b), b = g.value;
            return g.done ? b : b && typeof b.then == "function" ? b.then(s, u) : p(b) ? Promise.all(b).then(s, u) : s(b);
          };
        }
        return c(r)();
      }
      function ln(t, r, s) {
        for (var u = p(t) ? t.slice() : [t], c = 0; c < s; ++c) u.push(r);
        return u;
      }
      var Nu = { stack: "dbcore", name: "VirtualIndexMiddleware", level: 1, create: function(t) {
        return i(i({}, t), { table: function(r) {
          var s = t.table(r), u = s.schema, c = {}, l = [];
          function h(m, O, v) {
            var k = br(m), S = c[k] = c[k] || [], x = m == null ? 0 : typeof m == "string" ? 1 : m.length, E = 0 < O, E = i(i({}, v), { name: E ? "".concat(k, "(virtual-from:").concat(v.name, ")") : v.name, lowLevelIndex: v, isVirtual: E, keyTail: O, keyLength: x, extractKey: so(m), unique: !E && v.unique });
            return S.push(E), E.isPrimaryKey || l.push(E), 1 < x && h(x === 2 ? m[0] : m.slice(0, x - 1), O + 1, v), S.sort(function(T, C) {
              return T.keyTail - C.keyTail;
            }), E;
          }
          r = h(u.primaryKey.keyPath, 0, u.primaryKey), c[":id"] = [r];
          for (var g = 0, b = u.indexes; g < b.length; g++) {
            var w = b[g];
            h(w.keyPath, 0, w);
          }
          function _(m) {
            var O, v = m.query.index;
            return v.isVirtual ? i(i({}, m), { query: { index: v.lowLevelIndex, range: (O = m.query.range, v = v.keyTail, { type: O.type === 1 ? 2 : O.type, lower: ln(O.lower, O.lowerOpen ? t.MAX_KEY : t.MIN_KEY, v), lowerOpen: !0, upper: ln(O.upper, O.upperOpen ? t.MIN_KEY : t.MAX_KEY, v), upperOpen: !0 }) } }) : m;
          }
          return i(i({}, s), { schema: i(i({}, u), { primaryKey: r, indexes: l, getIndexByKeyPath: function(m) {
            return (m = c[br(m)]) && m[0];
          } }), count: function(m) {
            return s.count(_(m));
          }, query: function(m) {
            return s.query(_(m));
          }, openCursor: function(m) {
            var O = m.query.index, v = O.keyTail, k = O.isVirtual, S = O.keyLength;
            return k ? s.openCursor(_(m)).then(function(E) {
              return E && x(E);
            }) : s.openCursor(m);
            function x(E) {
              return Object.create(E, { continue: { value: function(T) {
                T != null ? E.continue(ln(T, m.reverse ? t.MAX_KEY : t.MIN_KEY, v)) : m.unique ? E.continue(E.key.slice(0, S).concat(m.reverse ? t.MIN_KEY : t.MAX_KEY, v)) : E.continue();
              } }, continuePrimaryKey: { value: function(T, C) {
                E.continuePrimaryKey(ln(T, t.MAX_KEY, v), C);
              } }, primaryKey: { get: function() {
                return E.primaryKey;
              } }, key: { get: function() {
                var T = E.key;
                return S === 1 ? T[0] : T.slice(0, S);
              } }, value: { get: function() {
                return E.value;
              } } });
            }
          } });
        } });
      } };
      function wo(t, r, s, u) {
        return s = s || {}, u = u || "", f(t).forEach(function(c) {
          var l, h, g;
          j(r, c) ? (l = t[c], h = r[c], typeof l == "object" && typeof h == "object" && l && h ? (g = qn(l)) !== qn(h) ? s[u + c] = r[c] : g === "Object" ? wo(l, h, s, u + c + ".") : l !== h && (s[u + c] = r[c]) : l !== h && (s[u + c] = r[c])) : s[u + c] = void 0;
        }), f(r).forEach(function(c) {
          j(t, c) || (s[u + c] = r[c]);
        }), s;
      }
      function ko(t, r) {
        return r.type === "delete" ? r.keys : r.keys || r.values.map(t.extractKey);
      }
      var Pu = { stack: "dbcore", name: "HooksMiddleware", level: 2, create: function(t) {
        return i(i({}, t), { table: function(r) {
          var s = t.table(r), u = s.schema.primaryKey;
          return i(i({}, s), { mutate: function(c) {
            var l = z.trans, h = l.table(r).hook, g = h.deleting, b = h.creating, w = h.updating;
            switch (c.type) {
              case "add":
                if (b.fire === se) break;
                return l._promise("readwrite", function() {
                  return _(c);
                }, !0);
              case "put":
                if (b.fire === se && w.fire === se) break;
                return l._promise("readwrite", function() {
                  return _(c);
                }, !0);
              case "delete":
                if (g.fire === se) break;
                return l._promise("readwrite", function() {
                  return _(c);
                }, !0);
              case "deleteRange":
                if (g.fire === se) break;
                return l._promise("readwrite", function() {
                  return (function m(O, v, k) {
                    return s.query({ trans: O, values: !1, query: { index: u, range: v }, limit: k }).then(function(S) {
                      var x = S.result;
                      return _({ type: "delete", keys: x, trans: O }).then(function(E) {
                        return 0 < E.numFailures ? Promise.reject(E.failures[0]) : x.length < k ? { failures: [], numFailures: 0, lastResult: void 0 } : m(O, i(i({}, v), { lower: x[x.length - 1], lowerOpen: !0 }), k);
                      });
                    });
                  })(c.trans, c.range, 1e4);
                }, !0);
            }
            return s.mutate(c);
            function _(m) {
              var O, v, k, S = z.trans, x = m.keys || ko(u, m);
              if (!x) throw new Error("Keys missing");
              return (m = m.type === "add" || m.type === "put" ? i(i({}, m), { keys: x }) : i({}, m)).type !== "delete" && (m.values = a([], m.values)), m.keys && (m.keys = a([], m.keys)), O = s, k = x, ((v = m).type === "add" ? Promise.resolve([]) : O.getMany({ trans: v.trans, keys: k, cache: "immutable" })).then(function(E) {
                var T = x.map(function(C, A) {
                  var I, P, M, N = E[A], W = { onerror: null, onsuccess: null };
                  return m.type === "delete" ? g.fire.call(W, C, N, S) : m.type === "add" || N === void 0 ? (I = b.fire.call(W, C, m.values[A], S), C == null && I != null && (m.keys[A] = C = I, u.outbound || Se(m.values[A], u.keyPath, C))) : (I = wo(N, m.values[A]), (P = w.fire.call(W, I, C, N, S)) && (M = m.values[A], Object.keys(P).forEach(function(R) {
                    j(M, R) ? M[R] = P[R] : Se(M, R, P[R]);
                  }))), W;
                });
                return s.mutate(m).then(function(C) {
                  for (var A = C.failures, I = C.results, P = C.numFailures, C = C.lastResult, M = 0; M < x.length; ++M) {
                    var N = (I || x)[M], W = T[M];
                    N == null ? W.onerror && W.onerror(A[M]) : W.onsuccess && W.onsuccess(m.type === "put" && E[M] ? m.values[M] : N);
                  }
                  return { failures: A, results: I, numFailures: P, lastResult: C };
                }).catch(function(C) {
                  return T.forEach(function(A) {
                    return A.onerror && A.onerror(C);
                  }), Promise.reject(C);
                });
              });
            }
          } });
        } });
      } };
      function Yi(t, r, s) {
        try {
          if (!r || r.keys.length < t.length) return null;
          for (var u = [], c = 0, l = 0; c < r.keys.length && l < t.length; ++c) X(r.keys[c], t[l]) === 0 && (u.push(s ? dt(r.values[c]) : r.values[c]), ++l);
          return u.length === t.length ? u : null;
        } catch {
          return null;
        }
      }
      var ju = { stack: "dbcore", level: -1, create: function(t) {
        return { table: function(r) {
          var s = t.table(r);
          return i(i({}, s), { getMany: function(u) {
            if (!u.cache) return s.getMany(u);
            var c = Yi(u.keys, u.trans._cache, u.cache === "clone");
            return c ? V.resolve(c) : s.getMany(u).then(function(l) {
              return u.trans._cache = { keys: u.keys, values: u.cache === "clone" ? dt(l) : l }, l;
            });
          }, mutate: function(u) {
            return u.type !== "add" && (u.trans._cache = null), s.mutate(u);
          } });
        } };
      } };
      function Gi(t, r) {
        return t.trans.mode === "readonly" && !!t.subscr && !t.trans.explicit && t.trans.db._options.cache !== "disabled" && !r.schema.primaryKey.outbound;
      }
      function Ji(t, r) {
        switch (t) {
          case "query":
            return r.values && !r.unique;
          case "get":
          case "getMany":
          case "count":
          case "openCursor":
            return !1;
        }
      }
      var Ru = { stack: "dbcore", level: 0, name: "Observability", create: function(t) {
        var r = t.schema.name, s = new ve(t.MIN_KEY, t.MAX_KEY);
        return i(i({}, t), { transaction: function(u, c, l) {
          if (z.subscr && c !== "readonly") throw new K.ReadOnly("Readwrite transaction in liveQuery context. Querier source: ".concat(z.querier));
          return t.transaction(u, c, l);
        }, table: function(u) {
          var c = t.table(u), l = c.schema, h = l.primaryKey, m = l.indexes, g = h.extractKey, b = h.outbound, w = h.autoIncrement && m.filter(function(v) {
            return v.compound && v.keyPath.includes(h.keyPath);
          }), _ = i(i({}, c), { mutate: function(v) {
            function k(R) {
              return R = "idb://".concat(r, "/").concat(u, "/").concat(R), C[R] || (C[R] = new ve());
            }
            var S, x, E, T = v.trans, C = v.mutatedParts || (v.mutatedParts = {}), A = k(""), I = k(":dels"), P = v.type, W = v.type === "deleteRange" ? [v.range] : v.type === "delete" ? [v.keys] : v.values.length < 50 ? [ko(h, v).filter(function(R) {
              return R;
            }), v.values] : [], M = W[0], N = W[1], W = v.trans._cache;
            return p(M) ? (A.addKeys(M), (W = P === "delete" || M.length === N.length ? Yi(M, W) : null) || I.addKeys(M), (W || N) && (S = k, x = W, E = N, l.indexes.forEach(function(R) {
              var U = S(R.name || "");
              function Q(G) {
                return G != null ? R.extractKey(G) : null;
              }
              function te(G) {
                return R.multiEntry && p(G) ? G.forEach(function(ce) {
                  return U.addKey(ce);
                }) : U.addKey(G);
              }
              (x || E).forEach(function(G, we) {
                var Z = x && Q(x[we]), we = E && Q(E[we]);
                X(Z, we) !== 0 && (Z != null && te(Z), we != null && te(we));
              });
            }))) : M ? (N = { from: (N = M.lower) !== null && N !== void 0 ? N : t.MIN_KEY, to: (N = M.upper) !== null && N !== void 0 ? N : t.MAX_KEY }, I.add(N), A.add(N)) : (A.add(s), I.add(s), l.indexes.forEach(function(R) {
              return k(R.name).add(s);
            })), c.mutate(v).then(function(R) {
              return !M || v.type !== "add" && v.type !== "put" || (A.addKeys(R.results), w && w.forEach(function(U) {
                for (var Q = v.values.map(function(Z) {
                  return U.extractKey(Z);
                }), te = U.keyPath.findIndex(function(Z) {
                  return Z === h.keyPath;
                }), G = 0, ce = R.results.length; G < ce; ++G) Q[G][te] = R.results[G];
                k(U.name).addKeys(Q);
              })), T.mutatedParts = un(T.mutatedParts || {}, C), R;
            });
          } }), m = function(k) {
            var S = k.query, k = S.index, S = S.range;
            return [k, new ve((k = S.lower) !== null && k !== void 0 ? k : t.MIN_KEY, (S = S.upper) !== null && S !== void 0 ? S : t.MAX_KEY)];
          }, O = { get: function(v) {
            return [h, new ve(v.key)];
          }, getMany: function(v) {
            return [h, new ve().addKeys(v.keys)];
          }, count: m, query: m, openCursor: m };
          return f(O).forEach(function(v) {
            _[v] = function(k) {
              var S = z.subscr, x = !!S, E = Gi(z, c) && Ji(v, k) ? k.obsSet = {} : S;
              if (x) {
                var T = function(N) {
                  return N = "idb://".concat(r, "/").concat(u, "/").concat(N), E[N] || (E[N] = new ve());
                }, C = T(""), A = T(":dels"), S = O[v](k), x = S[0], S = S[1];
                if ((v === "query" && x.isPrimaryKey && !k.values ? A : T(x.name || "")).add(S), !x.isPrimaryKey) {
                  if (v !== "count") {
                    var I = v === "query" && b && k.values && c.query(i(i({}, k), { values: !1 }));
                    return c[v].apply(this, arguments).then(function(N) {
                      if (v === "query") {
                        if (b && k.values) return I.then(function(Q) {
                          return Q = Q.result, C.addKeys(Q), N;
                        });
                        var W = k.values ? N.result.map(g) : N.result;
                        (k.values ? C : A).addKeys(W);
                      } else if (v === "openCursor") {
                        var R = N, U = k.values;
                        return R && Object.create(R, { key: { get: function() {
                          return A.addKey(R.primaryKey), R.key;
                        } }, primaryKey: { get: function() {
                          var Q = R.primaryKey;
                          return A.addKey(Q), Q;
                        } }, value: { get: function() {
                          return U && C.addKey(R.primaryKey), R.value;
                        } } });
                      }
                      return N;
                    });
                  }
                  A.add(s);
                }
              }
              return c[v].apply(this, arguments);
            };
          }), _;
        } });
      } };
      function Qi(t, r, s) {
        if (s.numFailures === 0) return r;
        if (r.type === "deleteRange") return null;
        var u = r.keys ? r.keys.length : "values" in r && r.values ? r.values.length : 1;
        return s.numFailures === u ? null : (r = i({}, r), p(r.keys) && (r.keys = r.keys.filter(function(c, l) {
          return !(l in s.failures);
        })), "values" in r && p(r.values) && (r.values = r.values.filter(function(c, l) {
          return !(l in s.failures);
        })), r);
      }
      function _o(t, r) {
        return s = t, ((u = r).lower === void 0 || (u.lowerOpen ? 0 < X(s, u.lower) : 0 <= X(s, u.lower))) && (t = t, (r = r).upper === void 0 || (r.upperOpen ? X(t, r.upper) < 0 : X(t, r.upper) <= 0));
        var s, u;
      }
      function Xi(t, r, O, u, c, l) {
        if (!O || O.length === 0) return t;
        var h = r.query.index, g = h.multiEntry, b = r.query.range, w = u.schema.primaryKey.extractKey, _ = h.extractKey, m = (h.lowLevelIndex || h).extractKey, O = O.reduce(function(v, k) {
          var S = v, x = [];
          if (k.type === "add" || k.type === "put") for (var E = new ve(), T = k.values.length - 1; 0 <= T; --T) {
            var C, A = k.values[T], I = w(A);
            E.hasKey(I) || (C = _(A), (g && p(C) ? C.some(function(R) {
              return _o(R, b);
            }) : _o(C, b)) && (E.addKey(I), x.push(A)));
          }
          switch (k.type) {
            case "add":
              var P = new ve().addKeys(r.values ? v.map(function(U) {
                return w(U);
              }) : v), S = v.concat(r.values ? x.filter(function(U) {
                return U = w(U), !P.hasKey(U) && (P.addKey(U), !0);
              }) : x.map(function(U) {
                return w(U);
              }).filter(function(U) {
                return !P.hasKey(U) && (P.addKey(U), !0);
              }));
              break;
            case "put":
              var M = new ve().addKeys(k.values.map(function(U) {
                return w(U);
              }));
              S = v.filter(function(U) {
                return !M.hasKey(r.values ? w(U) : U);
              }).concat(r.values ? x : x.map(function(U) {
                return w(U);
              }));
              break;
            case "delete":
              var N = new ve().addKeys(k.keys);
              S = v.filter(function(U) {
                return !N.hasKey(r.values ? w(U) : U);
              });
              break;
            case "deleteRange":
              var W = k.range;
              S = v.filter(function(U) {
                return !_o(w(U), W);
              });
          }
          return S;
        }, t);
        return O === t ? t : (O.sort(function(v, k) {
          return X(m(v), m(k)) || X(w(v), w(k));
        }), r.limit && r.limit < 1 / 0 && (O.length > r.limit ? O.length = r.limit : t.length === r.limit && O.length < r.limit && (c.dirty = !0)), l ? Object.freeze(O) : O);
      }
      function es(t, r) {
        return X(t.lower, r.lower) === 0 && X(t.upper, r.upper) === 0 && !!t.lowerOpen == !!r.lowerOpen && !!t.upperOpen == !!r.upperOpen;
      }
      function Fu(t, r) {
        return (function(s, u, c, l) {
          if (s === void 0) return u !== void 0 ? -1 : 0;
          if (u === void 0) return 1;
          if ((u = X(s, u)) === 0) {
            if (c && l) return 0;
            if (c) return 1;
            if (l) return -1;
          }
          return u;
        })(t.lower, r.lower, t.lowerOpen, r.lowerOpen) <= 0 && 0 <= (function(s, u, c, l) {
          if (s === void 0) return u !== void 0 ? 1 : 0;
          if (u === void 0) return -1;
          if ((u = X(s, u)) === 0) {
            if (c && l) return 0;
            if (c) return -1;
            if (l) return 1;
          }
          return u;
        })(t.upper, r.upper, t.upperOpen, r.upperOpen);
      }
      function Wu(t, r, s, u) {
        t.subscribers.add(s), u.addEventListener("abort", function() {
          var c, l;
          t.subscribers.delete(s), t.subscribers.size === 0 && (c = t, l = r, setTimeout(function() {
            c.subscribers.size === 0 && ft(l, c);
          }, 3e3));
        });
      }
      var qu = { stack: "dbcore", level: 0, name: "Cache", create: function(t) {
        var r = t.schema.name;
        return i(i({}, t), { transaction: function(s, u, c) {
          var l, h, g = t.transaction(s, u, c);
          return u === "readwrite" && (h = (l = new AbortController()).signal, c = function(b) {
            return function() {
              if (l.abort(), u === "readwrite") {
                for (var w = /* @__PURE__ */ new Set(), _ = 0, m = s; _ < m.length; _++) {
                  var O = m[_], v = kt["idb://".concat(r, "/").concat(O)];
                  if (v) {
                    var k = t.table(O), S = v.optimisticOps.filter(function(U) {
                      return U.trans === g;
                    });
                    if (g._explicit && b && g.mutatedParts) for (var x = 0, E = Object.values(v.queries.query); x < E.length; x++) for (var T = 0, C = (P = E[x]).slice(); T < C.length; T++) go((M = C[T]).obsSet, g.mutatedParts) && (ft(P, M), M.subscribers.forEach(function(U) {
                      return w.add(U);
                    }));
                    else if (0 < S.length) {
                      v.optimisticOps = v.optimisticOps.filter(function(U) {
                        return U.trans !== g;
                      });
                      for (var A = 0, I = Object.values(v.queries.query); A < I.length; A++) for (var P, M, N, W = 0, R = (P = I[A]).slice(); W < R.length; W++) (M = R[W]).res != null && g.mutatedParts && (b && !M.dirty ? (N = Object.isFrozen(M.res), N = Xi(M.res, M.req, S, k, M, N), M.dirty ? (ft(P, M), M.subscribers.forEach(function(U) {
                        return w.add(U);
                      })) : N !== M.res && (M.res = N, M.promise = V.resolve({ result: N }))) : (M.dirty && ft(P, M), M.subscribers.forEach(function(U) {
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
          }, g.addEventListener("abort", c(!1), { signal: h }), g.addEventListener("error", c(!1), { signal: h }), g.addEventListener("complete", c(!0), { signal: h })), g;
        }, table: function(s) {
          var u = t.table(s), c = u.schema.primaryKey;
          return i(i({}, u), { mutate: function(l) {
            var h = z.trans;
            if (c.outbound || h.db._options.cache === "disabled" || h.explicit || h.idbtrans.mode !== "readwrite") return u.mutate(l);
            var g = kt["idb://".concat(r, "/").concat(s)];
            return g ? (h = u.mutate(l), l.type !== "add" && l.type !== "put" || !(50 <= l.values.length || ko(c, l).some(function(b) {
              return b == null;
            })) ? (g.optimisticOps.push(l), l.mutatedParts && cn(l.mutatedParts), h.then(function(b) {
              0 < b.numFailures && (ft(g.optimisticOps, l), (b = Qi(0, l, b)) && g.optimisticOps.push(b), l.mutatedParts && cn(l.mutatedParts));
            }), h.catch(function() {
              ft(g.optimisticOps, l), l.mutatedParts && cn(l.mutatedParts);
            })) : h.then(function(b) {
              var w = Qi(0, i(i({}, l), { values: l.values.map(function(_, m) {
                var O;
                return b.failures[m] ? _ : (_ = (O = c.keyPath) !== null && O !== void 0 && O.includes(".") ? dt(_) : i({}, _), Se(_, c.keyPath, b.results[m]), _);
              }) }), b);
              g.optimisticOps.push(w), queueMicrotask(function() {
                return l.mutatedParts && cn(l.mutatedParts);
              });
            }), h) : u.mutate(l);
          }, query: function(l) {
            if (!Gi(z, u) || !Ji("query", l)) return u.query(l);
            var h = ((w = z.trans) === null || w === void 0 ? void 0 : w.db._options.cache) === "immutable", m = z, g = m.requery, b = m.signal, w = (function(k, S, x, E) {
              var T = kt["idb://".concat(k, "/").concat(S)];
              if (!T) return [];
              if (!(S = T.queries[x])) return [null, !1, T, null];
              var C = S[(E.query ? E.query.index.name : null) || ""];
              if (!C) return [null, !1, T, null];
              switch (x) {
                case "query":
                  var A = C.find(function(I) {
                    return I.req.limit === E.limit && I.req.values === E.values && es(I.req.query.range, E.query.range);
                  });
                  return A ? [A, !0, T, C] : [C.find(function(I) {
                    return ("limit" in I.req ? I.req.limit : 1 / 0) >= E.limit && (!E.values || I.req.values) && Fu(I.req.query.range, E.query.range);
                  }), !1, T, C];
                case "count":
                  return A = C.find(function(I) {
                    return es(I.req.query.range, E.query.range);
                  }), [A, !!A, T, C];
              }
            })(r, s, "query", l), _ = w[0], m = w[1], O = w[2], v = w[3];
            return _ && m ? _.obsSet = l.obsSet : (m = u.query(l).then(function(k) {
              var S = k.result;
              if (_ && (_.res = S), h) {
                for (var x = 0, E = S.length; x < E; ++x) Object.freeze(S[x]);
                Object.freeze(S);
              } else k.result = dt(S);
              return k;
            }).catch(function(k) {
              return v && _ && ft(v, _), Promise.reject(k);
            }), _ = { obsSet: l.obsSet, promise: m, subscribers: /* @__PURE__ */ new Set(), type: "query", req: l, dirty: !1 }, v ? v.push(_) : (v = [_], (O = O || (kt["idb://".concat(r, "/").concat(s)] = { queries: { query: {}, count: {} }, objs: /* @__PURE__ */ new Map(), optimisticOps: [], unsignaledParts: {} })).queries.query[l.query.index.name || ""] = v)), Wu(_, v, g, b), _.promise.then(function(k) {
              return { result: Xi(k.result, l, O?.optimisticOps, u, _, h) };
            });
          } });
        } });
      } };
      function dn(t, r) {
        return new Proxy(t, { get: function(s, u, c) {
          return u === "db" ? r : Reflect.get(s, u, c);
        } });
      }
      var Ke = (he.prototype.version = function(t) {
        if (isNaN(t) || t < 0.1) throw new K.Type("Given version is not a positive number");
        if (t = Math.round(10 * t) / 10, this.idbdb || this._state.isBeingOpened) throw new K.Schema("Cannot add version when database is open");
        this.verno = Math.max(this.verno, t);
        var r = this._versions, s = r.filter(function(u) {
          return u._cfg.version === t;
        })[0];
        return s || (s = new this.Version(t), r.push(s), r.sort(Cu), s.stores({}), this._state.autoSchema = !1, s);
      }, he.prototype._whenReady = function(t) {
        var r = this;
        return this.idbdb && (this._state.openComplete || z.letThrough || this._vip) ? t() : new V(function(s, u) {
          if (r._state.openComplete) return u(new K.DatabaseClosed(r._state.dbOpenError));
          if (!r._state.isBeingOpened) {
            if (!r._state.autoOpen) return void u(new K.DatabaseClosed());
            r.open().catch(se);
          }
          r._state.dbReadyPromise.then(s, u);
        }).then(t);
      }, he.prototype.use = function(t) {
        var r = t.stack, s = t.create, u = t.level, c = t.name;
        return c && this.unuse({ stack: r, name: c }), t = this._middlewares[r] || (this._middlewares[r] = []), t.push({ stack: r, create: s, level: u ?? 10, name: c }), t.sort(function(l, h) {
          return l.level - h.level;
        }), this;
      }, he.prototype.unuse = function(t) {
        var r = t.stack, s = t.name, u = t.create;
        return r && this._middlewares[r] && (this._middlewares[r] = this._middlewares[r].filter(function(c) {
          return u ? c.create !== u : !!s && c.name !== s;
        })), this;
      }, he.prototype.open = function() {
        var t = this;
        return bt(Je, function() {
          return Mu(t);
        });
      }, he.prototype._close = function() {
        this.on.close.fire(new CustomEvent("close"));
        var t = this._state, r = Wt.indexOf(this);
        if (0 <= r && Wt.splice(r, 1), this.idbdb) {
          try {
            this.idbdb.close();
          } catch {
          }
          this.idbdb = null;
        }
        t.isBeingOpened || (t.dbReadyPromise = new V(function(s) {
          t.dbReadyResolve = s;
        }), t.openCanceller = new V(function(s, u) {
          t.cancelOpen = u;
        }));
      }, he.prototype.close = function(s) {
        var r = (s === void 0 ? { disableAutoOpen: !0 } : s).disableAutoOpen, s = this._state;
        r ? (s.isBeingOpened && s.cancelOpen(new K.DatabaseClosed()), this._close(), s.autoOpen = !1, s.dbOpenError = new K.DatabaseClosed()) : (this._close(), s.autoOpen = this._options.autoOpen || s.isBeingOpened, s.openComplete = !1, s.dbOpenError = null);
      }, he.prototype.delete = function(t) {
        var r = this;
        t === void 0 && (t = { disableAutoOpen: !0 });
        var s = 0 < arguments.length && typeof arguments[0] != "object", u = this._state;
        return new V(function(c, l) {
          function h() {
            r.close(t);
            var g = r._deps.indexedDB.deleteDatabase(r.name);
            g.onsuccess = ue(function() {
              var b, w, _;
              b = r._deps, w = r.name, _ = b.indexedDB, b = b.IDBKeyRange, fo(_) || w === Yr || lo(_, b).delete(w).catch(se), c();
            }), g.onerror = Ve(l), g.onblocked = r._fireOnBlocked;
          }
          if (s) throw new K.InvalidArgument("Invalid closeOptions argument to db.delete()");
          u.isBeingOpened ? u.dbReadyPromise.then(h) : h();
        });
      }, he.prototype.backendDB = function() {
        return this.idbdb;
      }, he.prototype.isOpen = function() {
        return this.idbdb !== null;
      }, he.prototype.hasBeenClosed = function() {
        var t = this._state.dbOpenError;
        return t && t.name === "DatabaseClosed";
      }, he.prototype.hasFailed = function() {
        return this._state.dbOpenError !== null;
      }, he.prototype.dynamicallyOpened = function() {
        return this._state.autoSchema;
      }, Object.defineProperty(he.prototype, "tables", { get: function() {
        var t = this;
        return f(this._allTables).map(function(r) {
          return t._allTables[r];
        });
      }, enumerable: !1, configurable: !0 }), he.prototype.transaction = function() {
        var t = (function(r, s, u) {
          var c = arguments.length;
          if (c < 2) throw new K.InvalidArgument("Too few arguments");
          for (var l = new Array(c - 1); --c; ) l[c - 1] = arguments[c];
          return u = l.pop(), [r, Ge(l), u];
        }).apply(this, arguments);
        return this._transaction.apply(this, t);
      }, he.prototype._transaction = function(t, r, s) {
        var u = this, c = z.trans;
        c && c.db === this && t.indexOf("!") === -1 || (c = null);
        var l, h, g = t.indexOf("?") !== -1;
        t = t.replace("!", "").replace("?", "");
        try {
          if (h = r.map(function(w) {
            if (w = w instanceof u.Table ? w.name : w, typeof w != "string") throw new TypeError("Invalid table argument to Dexie.transaction(). Only Table or String are allowed");
            return w;
          }), t == "r" || t === Xn) l = Xn;
          else {
            if (t != "rw" && t != eo) throw new K.InvalidArgument("Invalid transaction mode: " + t);
            l = eo;
          }
          if (c) {
            if (c.mode === Xn && l === eo) {
              if (!g) throw new K.SubTransaction("Cannot enter a sub-transaction with READWRITE mode when parent transaction is READONLY");
              c = null;
            }
            c && h.forEach(function(w) {
              if (c && c.storeNames.indexOf(w) === -1) {
                if (!g) throw new K.SubTransaction("Table " + w + " not included in parent transaction.");
                c = null;
              }
            }), g && c && !c.active && (c = null);
          }
        } catch (w) {
          return c ? c._promise(null, function(_, m) {
            m(w);
          }) : fe(w);
        }
        var b = (function w(_, m, O, v, k) {
          return V.resolve().then(function() {
            var S = z.transless || z, x = _._createTransaction(m, O, _._dbSchema, v);
            if (x.explicit = !0, S = { trans: x, transless: S }, v) x.idbtrans = v.idbtrans;
            else try {
              x.create(), x.idbtrans._explicit = !0, _._state.PR1398_maxLoop = 3;
            } catch (C) {
              return C.name === Ln.InvalidState && _.isOpen() && 0 < --_._state.PR1398_maxLoop ? (_.close({ disableAutoOpen: !1 }), _.open().then(function() {
                return w(_, m, O, null, k);
              })) : fe(C);
            }
            var E, T = Un(k);
            return T && Ft(), S = V.follow(function() {
              var C;
              (E = k.call(x, x)) && (T ? (C = Xe.bind(null, null), E.then(C, C)) : typeof E.next == "function" && typeof E.throw == "function" && (E = vo(E)));
            }, S), (E && typeof E.then == "function" ? V.resolve(E).then(function(C) {
              return x.active ? C : fe(new K.PrematureCommit("Transaction committed too early. See http://bit.ly/2kdckMn"));
            }) : S.then(function() {
              return E;
            })).then(function(C) {
              return v && x._resolve(), x._completion.then(function() {
                return C;
              });
            }).catch(function(C) {
              return x._reject(C), fe(C);
            });
          });
        }).bind(null, this, l, h, c, s);
        return c ? c._promise(l, b, "lock") : z.trans ? bt(z.transless, function() {
          return u._whenReady(b);
        }) : this._whenReady(b);
      }, he.prototype.table = function(t) {
        if (!j(this._allTables, t)) throw new K.InvalidTable("Table ".concat(t, " does not exist"));
        return this._allTables[t];
      }, he);
      function he(t, r) {
        var s = this;
        this._middlewares = {}, this.verno = 0;
        var u = he.dependencies;
        this._options = r = i({ addons: he.addons, autoOpen: !0, indexedDB: u.indexedDB, IDBKeyRange: u.IDBKeyRange, cache: "cloned" }, r), this._deps = { indexedDB: r.indexedDB, IDBKeyRange: r.IDBKeyRange }, u = r.addons, this._dbSchema = {}, this._versions = [], this._storeNames = [], this._allTables = {}, this.idbdb = null, this._novip = this;
        var c, l, h, g, b, w = { dbOpenError: null, isBeingOpened: !1, onReadyBeingFired: null, openComplete: !1, dbReadyResolve: se, dbReadyPromise: null, cancelOpen: se, openCanceller: null, autoSchema: !0, PR1398_maxLoop: 3, autoOpen: r.autoOpen };
        w.dbReadyPromise = new V(function(m) {
          w.dbReadyResolve = m;
        }), w.openCanceller = new V(function(m, O) {
          w.cancelOpen = O;
        }), this._state = w, this.name = t, this.on = fr(this, "populate", "blocked", "versionchange", "close", { ready: [zn, se] }), this.once = function(m, O) {
          var v = function() {
            for (var k = [], S = 0; S < arguments.length; S++) k[S] = arguments[S];
            s.on(m).unsubscribe(v), O.apply(s, k);
          };
          return s.on(m, v);
        }, this.on.ready.subscribe = or(this.on.ready.subscribe, function(m) {
          return function(O, v) {
            he.vip(function() {
              var k, S = s._state;
              S.openComplete ? (S.dbOpenError || V.resolve().then(O), v && m(O)) : S.onReadyBeingFired ? (S.onReadyBeingFired.push(O), v && m(O)) : (m(O), k = s, v || m(function x() {
                k.on.ready.unsubscribe(O), k.on.ready.unsubscribe(x);
              }));
            });
          };
        }), this.Collection = (c = this, hr(_u.prototype, function(E, x) {
          this.db = c;
          var v = Ai, k = null;
          if (x) try {
            v = x();
          } catch (T) {
            k = T;
          }
          var S = E._ctx, x = S.table, E = x.hook.reading.fire;
          this._ctx = { table: x, index: S.index, isPrimKey: !S.index || x.schema.primKey.keyPath && S.index === x.schema.primKey.name, range: v, keysOnly: !1, dir: "next", unique: "", algorithm: null, filter: null, replayFilter: null, justLimit: !0, isMatch: null, offset: 0, limit: 1 / 0, error: k, or: S.or, valueMapper: E !== ar ? E : null };
        })), this.Table = (l = this, hr(Ni.prototype, function(m, O, v) {
          this.db = l, this._tx = v, this.name = m, this.schema = O, this.hook = l._allTables[m] ? l._allTables[m].hook : fr(null, { creating: [hu, se], reading: [fu, ar], updating: [gu, se], deleting: [pu, se] });
        })), this.Transaction = (h = this, hr(Ou.prototype, function(m, O, v, k, S) {
          var x = this;
          m !== "readonly" && O.forEach(function(E) {
            E = (E = v[E]) === null || E === void 0 ? void 0 : E.yProps, E && (O = O.concat(E.map(function(T) {
              return T.updatesTable;
            })));
          }), this.db = h, this.mode = m, this.storeNames = O, this.schema = v, this.chromeTransactionDurability = k, this.idbtrans = null, this.on = fr(this, "complete", "error", "abort"), this.parent = S || null, this.active = !0, this._reculock = 0, this._blockedFuncs = [], this._resolve = null, this._reject = null, this._waitingFor = null, this._waitingQueue = null, this._spinCount = 0, this._completion = new V(function(E, T) {
            x._resolve = E, x._reject = T;
          }), this._completion.then(function() {
            x.active = !1, x.on.complete.fire();
          }, function(E) {
            var T = x.active;
            return x.active = !1, x.on.error.fire(E), x.parent ? x.parent._reject(E) : T && x.idbtrans && x.idbtrans.abort(), fe(E);
          });
        })), this.Version = (g = this, hr(Iu.prototype, function(m) {
          this.db = g, this._cfg = { version: m, storesSource: null, dbschema: {}, tables: {}, contentUpgrade: null };
        })), this.WhereClause = (b = this, hr(qi.prototype, function(m, O, v) {
          if (this.db = b, this._ctx = { table: m, index: O === ":id" ? null : O, or: v }, this._cmp = this._ascending = X, this._descending = function(k, S) {
            return X(S, k);
          }, this._max = function(k, S) {
            return 0 < X(k, S) ? k : S;
          }, this._min = function(k, S) {
            return X(k, S) < 0 ? k : S;
          }, this._IDBKeyRange = b._deps.IDBKeyRange, !this._IDBKeyRange) throw new K.MissingAPI();
        })), this.on("versionchange", function(m) {
          0 < m.newVersion, s.close({ disableAutoOpen: !1 });
        }), this.on("blocked", function(m) {
          !m.newVersion || m.newVersion < m.oldVersion;
        }), this._maxKey = yr(r.IDBKeyRange), this._createTransaction = function(m, O, v, k) {
          return new s.Transaction(m, O, v, s._options.chromeTransactionDurability, k);
        }, this._fireOnBlocked = function(m) {
          s.on("blocked").fire(m), Wt.filter(function(O) {
            return O.name === s.name && O !== s && !O._state.vcFired;
          }).map(function(O) {
            return O.on("versionchange").fire(m);
          });
        }, this.use(ju), this.use(qu), this.use(Ru), this.use(Nu), this.use(Pu);
        var _ = new Proxy(this, { get: function(m, O, v) {
          if (O === "_vip") return !0;
          if (O === "table") return function(S) {
            return dn(s.table(S), _);
          };
          var k = Reflect.get(m, O, v);
          return k instanceof Ni ? dn(k, _) : O === "tables" ? k.map(function(S) {
            return dn(S, _);
          }) : O === "_createTransaction" ? function() {
            return dn(k.apply(this, arguments), _);
          } : k;
        } });
        this.vip = _, u.forEach(function(m) {
          return m(s);
        });
      }
      var fn, Ae = typeof Symbol < "u" && "observable" in Symbol ? Symbol.observable : "@@observable", Vu = (xo.prototype.subscribe = function(t, r, s) {
        return this._subscribe(t && typeof t != "function" ? t : { next: t, error: r, complete: s });
      }, xo.prototype[Ae] = function() {
        return this;
      }, xo);
      function xo(t) {
        this._subscribe = t;
      }
      try {
        fn = { indexedDB: d.indexedDB || d.mozIndexedDB || d.webkitIndexedDB || d.msIndexedDB, IDBKeyRange: d.IDBKeyRange || d.webkitIDBKeyRange };
      } catch {
        fn = { indexedDB: null, IDBKeyRange: null };
      }
      function ts(t) {
        var r, s = !1, u = new Vu(function(c) {
          var l = Un(t), h, g = !1, b = {}, w = {}, _ = { get closed() {
            return g;
          }, unsubscribe: function() {
            g || (g = !0, h && h.abort(), m && rt.storagemutated.unsubscribe(v));
          } };
          c.start && c.start(_);
          var m = !1, O = function() {
            return Qn(k);
          }, v = function(S) {
            un(b, S), go(w, b) && O();
          }, k = function() {
            var S, x, E;
            !g && fn.indexedDB && (b = {}, S = {}, h && h.abort(), h = new AbortController(), E = (function(T) {
              var C = jt();
              try {
                l && Ft();
                var A = Qe(t, T);
                return A = l ? A.finally(Xe) : A;
              } finally {
                C && Rt();
              }
            })(x = { subscr: S, signal: h.signal, requery: O, querier: t, trans: null }), Promise.resolve(E).then(function(T) {
              s = !0, r = T, g || x.signal.aborted || (b = {}, (function(C) {
                for (var A in C) if (j(C, A)) return;
                return 1;
              })(w = S) || m || (rt(mr, v), m = !0), Qn(function() {
                return !g && c.next && c.next(T);
              }));
            }, function(T) {
              s = !1, ["DatabaseClosedError", "AbortError"].includes(T?.name) || g || Qn(function() {
                g || c.error && c.error(T);
              });
            }));
          };
          return setTimeout(O, 0), _;
        });
        return u.hasValue = function() {
          return s;
        }, u.getValue = function() {
          return r;
        }, u;
      }
      var _t = Ke;
      function So(t) {
        var r = nt;
        try {
          nt = !0, rt.storagemutated.fire(t), bo(t, !0);
        } finally {
          nt = r;
        }
      }
      Y(_t, i(i({}, qr), { delete: function(t) {
        return new _t(t, { addons: [] }).delete();
      }, exists: function(t) {
        return new _t(t, { addons: [] }).open().then(function(r) {
          return r.close(), !0;
        }).catch("NoSuchDatabaseError", function() {
          return !1;
        });
      }, getDatabaseNames: function(t) {
        try {
          return r = _t.dependencies, s = r.indexedDB, r = r.IDBKeyRange, (fo(s) ? Promise.resolve(s.databases()).then(function(u) {
            return u.map(function(c) {
              return c.name;
            }).filter(function(c) {
              return c !== Yr;
            });
          }) : lo(s, r).toCollection().primaryKeys()).then(t);
        } catch {
          return fe(new K.MissingAPI());
        }
        var r, s;
      }, defineClass: function() {
        return function(t) {
          y(this, t);
        };
      }, ignoreTransaction: function(t) {
        return z.trans ? bt(z.transless, t) : t();
      }, vip: ho, async: function(t) {
        return function() {
          try {
            var r = vo(t.apply(this, arguments));
            return r && typeof r.then == "function" ? r : V.resolve(r);
          } catch (s) {
            return fe(s);
          }
        };
      }, spawn: function(t, r, s) {
        try {
          var u = vo(t.apply(s, r || []));
          return u && typeof u.then == "function" ? u : V.resolve(u);
        } catch (c) {
          return fe(c);
        }
      }, currentTransaction: { get: function() {
        return z.trans || null;
      } }, waitFor: function(t, r) {
        return r = V.resolve(typeof t == "function" ? _t.ignoreTransaction(t) : t).timeout(r || 6e4), z.trans ? z.trans.waitFor(r) : r;
      }, Promise: V, debug: { get: function() {
        return qe;
      }, set: function(t) {
        xi(t);
      } }, derive: me, extend: y, props: Y, override: or, Events: fr, on: rt, liveQuery: ts, extendObservabilitySet: un, getByKeyPath: Ne, setByKeyPath: Se, delByKeyPath: function(t, r) {
        typeof r == "string" ? Se(t, r, void 0) : "length" in r && [].map.call(r, function(s) {
          Se(t, s, void 0);
        });
      }, shallowClone: Rr, deepClone: dt, getObjectDiff: wo, cmp: X, asap: ir, minKey: -1 / 0, addons: [], connections: Wt, errnames: Ln, dependencies: fn, cache: kt, semVer: "4.2.0", version: "4.2.0".split(".").map(function(t) {
        return parseInt(t);
      }).reduce(function(t, r, s) {
        return t + r / Math.pow(10, 2 * s);
      }) })), _t.maxKey = yr(_t.dependencies.IDBKeyRange), typeof dispatchEvent < "u" && typeof addEventListener < "u" && (rt(mr, function(t) {
        nt || (t = new CustomEvent(no, { detail: t }), nt = !0, dispatchEvent(t), nt = !1);
      }), addEventListener(no, function(t) {
        t = t.detail, nt || So(t);
      }));
      var Lt, nt = !1, rs = function() {
      };
      return typeof BroadcastChannel < "u" && ((rs = function() {
        (Lt = new BroadcastChannel(no)).onmessage = function(t) {
          return t.data && So(t.data);
        };
      })(), typeof Lt.unref == "function" && Lt.unref(), rt(mr, function(t) {
        nt || Lt.postMessage(t);
      })), typeof addEventListener < "u" && (addEventListener("pagehide", function(t) {
        if (!Ke.disableBfCache && t.persisted) {
          Lt?.close();
          for (var r = 0, s = Wt; r < s.length; r++) s[r].close({ disableAutoOpen: !1 });
        }
      }), addEventListener("pageshow", function(t) {
        !Ke.disableBfCache && t.persisted && (rs(), So({ all: new ve(-1 / 0, [[]]) }));
      })), V.rejectionMapper = function(t, r) {
        return !t || t instanceof Nt || t instanceof TypeError || t instanceof SyntaxError || !t.name || !_i[t.name] ? t : (r = new _i[t.name](r || t.message, t), "stack" in t && ee(r, "stack", { get: function() {
          return this.inner.stack;
        } }), r);
      }, xi(qe), i(Ke, Object.freeze({ __proto__: null, Dexie: Ke, liveQuery: ts, Entity: Di, cmp: X, PropModification: pr, replacePrefix: function(t, r) {
        return new pr({ replacePrefix: [t, r] });
      }, add: function(t) {
        return new pr({ add: t });
      }, remove: function(t) {
        return new pr({ remove: t });
      }, default: Ke, RangeSet: ve, mergeRanges: wr, rangesOverlap: Ki }), { default: Ke }), Ke;
    });
  })(kn)), kn.exports;
}
var bc = yc();
const Vo = /* @__PURE__ */ gc(bc), gs = /* @__PURE__ */ Symbol.for("Dexie"), Uo = globalThis[gs] || (globalThis[gs] = Vo);
if (Vo.semVer !== Uo.semVer)
  throw new Error(`Two different versions of Dexie loaded in the same app: ${Vo.semVer} and ${Uo.semVer}`);
const {
  liveQuery: Wd,
  mergeRanges: qd,
  rangesOverlap: Vd,
  RangeSet: Ud,
  cmp: Ld,
  Entity: zd,
  PropModification: Kd,
  replacePrefix: Bd,
  add: Hd,
  remove: Zd,
  DexieYProvider: Yd
} = Uo, ea = 2, Lo = 3, ta = class extends Ct {
  constructor() {
    super(), this.kioskBaseUrl = "", this.autoRenderProgress = !0, this.autoRenderErrors = !0, this.appErrors = [], this.apiContext = void 0, this.showProgress = !1;
  }
  onAppMessage(e) {
    this.addAppError(e.detail.headline + "<br>" + e.detail.body);
  }
  firstUpdated(e) {
    super.firstUpdated(e), this.addEventListener("send-message", this.onAppMessage);
  }
  updated(e) {
    e.has("apiContext") && (this.showProgress = !1, this.apiContext && this.apiContext.status === Lo && this.addAppError("Cannot connect to Kiosk API."), !e.apiContext && this.apiContext && this.apiConnected());
  }
  apiConnected() {
  }
  render() {
    let e;
    return this.apiContext && this.apiContext.status === ea ? e = this.apiRender() : this.apiContext && this.apiContext.status === Lo ? e = this.renderApiError() : e = this.renderNoContextYet(), J`
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
            ${this.autoRenderProgress ? this.renderProgress() : pe} ${this.autoRenderErrors ? this.renderErrors() : pe} ${e}
        `;
  }
  renderNoContextYet() {
    return J` <link rel="stylesheet" href="${this.kioskBaseUrl}static/styles.css" /> `;
  }
  renderApiError() {
  }
  renderErrors() {
    return this.appErrors.length > 0 ? J` ${this.appErrors.map((e) => J`<div class="system-message" @click="${this.errorClicked}"><span>${e}</span><i>x</i></div>`)} ` : pe;
  }
  errorClicked(e) {
    let n = e.currentTarget.children[0].textContent;
    n && this.deleteError(n);
  }
  renderProgress(e = !1) {
    if (e || this.showProgress)
      return J` <div class="loading">
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
    let n = -1;
    this.appErrors.find((i, a) => i === e ? (n = a, !0) : !1), n > -1 && (this.appErrors.splice(n, 1), this.appErrors = [...this.appErrors]);
  }
};
ta.properties = {
  apiContext: { type: Object },
  appErrors: { type: Array },
  showProgress: { type: Boolean },
  kioskBaseUrl: { type: String }
};
let vc = ta;
var wc = Object.defineProperty, ra = (o, e, n, i) => {
  for (var a = void 0, d = o.length - 1, f; d >= 0; d--)
    (f = o[d]) && (a = f(e, n, a) || a);
  return a && wc(e, n, a), a;
};
const na = class extends Ct {
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
  emitBeforeEvent(e, n, i, a) {
    let d = {
      // some this math is going on in here: here this points to the beforeEventDetail object. That's why the component's this needed saving
      component: this,
      _defer: !1,
      defer: function(p = void 0) {
        return this._defer = !0, p && (p.stopPropagation(), p.preventDefault()), {
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
    Object.assign(d, n);
    const f = new CustomEvent(e, {
      bubbles: !0,
      composed: !0,
      cancelable: !0,
      detail: d
    });
    if (this.dispatchEvent(f))
      a();
    else {
      if (d._defer)
        return !1;
      i();
    }
    return !0;
  }
  render() {
    let e;
    return this.apiContext && this.apiContext.status === ea ? e = this.apiRender() : this.apiContext && this.apiContext.status === Lo ? e = this.renderApiError() : e = this.renderNoContextYet(), J`
            <link rel="stylesheet" href="${this.kioskBaseUrl}static/styles.css" />
            ${e}
        `;
  }
  renderNoContextYet() {
    return J` <link rel="stylesheet" href="${this.kioskBaseUrl}static/styles.css" /> `;
  }
  renderApiError() {
  }
  renderProgress(e = !1) {
    if (e || this.showProgress)
      return J` <div class="loading">
                <div class="loading-progress"></div>
            </div>`;
  }
};
na.properties = {
  /**
   * The Api Context
   */
  apiContext: { type: Object }
};
let Nn = na;
ra([
  Xs()
], Nn.prototype, "showProgress");
ra([
  Ir()
], Nn.prototype, "kioskBaseUrl");
class Dt extends Error {
}
class kc extends Dt {
  constructor(e) {
    super(`Invalid DateTime: ${e.toMessage()}`);
  }
}
class _c extends Dt {
  constructor(e) {
    super(`Invalid Interval: ${e.toMessage()}`);
  }
}
class xc extends Dt {
  constructor(e) {
    super(`Invalid Duration: ${e.toMessage()}`);
  }
}
class Zt extends Dt {
}
class oa extends Dt {
  constructor(e) {
    super(`Invalid unit ${e}`);
  }
}
class _e extends Dt {
}
class ot extends Dt {
  constructor() {
    super("Zone is an abstract class");
  }
}
const q = "numeric", Fe = "short", $e = "long", Tn = {
  year: q,
  month: q,
  day: q
}, ia = {
  year: q,
  month: Fe,
  day: q
}, Sc = {
  year: q,
  month: Fe,
  day: q,
  weekday: Fe
}, sa = {
  year: q,
  month: $e,
  day: q
}, aa = {
  year: q,
  month: $e,
  day: q,
  weekday: $e
}, ua = {
  hour: q,
  minute: q
}, ca = {
  hour: q,
  minute: q,
  second: q
}, la = {
  hour: q,
  minute: q,
  second: q,
  timeZoneName: Fe
}, da = {
  hour: q,
  minute: q,
  second: q,
  timeZoneName: $e
}, fa = {
  hour: q,
  minute: q,
  hourCycle: "h23"
}, ha = {
  hour: q,
  minute: q,
  second: q,
  hourCycle: "h23"
}, pa = {
  hour: q,
  minute: q,
  second: q,
  hourCycle: "h23",
  timeZoneName: Fe
}, ga = {
  hour: q,
  minute: q,
  second: q,
  hourCycle: "h23",
  timeZoneName: $e
}, ma = {
  year: q,
  month: q,
  day: q,
  hour: q,
  minute: q
}, ya = {
  year: q,
  month: q,
  day: q,
  hour: q,
  minute: q,
  second: q
}, ba = {
  year: q,
  month: Fe,
  day: q,
  hour: q,
  minute: q
}, va = {
  year: q,
  month: Fe,
  day: q,
  hour: q,
  minute: q,
  second: q
}, Oc = {
  year: q,
  month: Fe,
  day: q,
  weekday: Fe,
  hour: q,
  minute: q
}, wa = {
  year: q,
  month: $e,
  day: q,
  hour: q,
  minute: q,
  timeZoneName: Fe
}, ka = {
  year: q,
  month: $e,
  day: q,
  hour: q,
  minute: q,
  second: q,
  timeZoneName: Fe
}, _a = {
  year: q,
  month: $e,
  day: q,
  weekday: $e,
  hour: q,
  minute: q,
  timeZoneName: $e
}, xa = {
  year: q,
  month: $e,
  day: q,
  weekday: $e,
  hour: q,
  minute: q,
  second: q,
  timeZoneName: $e
};
class Mr {
  /**
   * The type of zone
   * @abstract
   * @type {string}
   */
  get type() {
    throw new ot();
  }
  /**
   * The name of this zone.
   * @abstract
   * @type {string}
   */
  get name() {
    throw new ot();
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
    throw new ot();
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
  offsetName(e, n) {
    throw new ot();
  }
  /**
   * Returns the offset's value as a string
   * @abstract
   * @param {number} ts - Epoch milliseconds for which to get the offset
   * @param {string} format - What style of offset to return.
   *                          Accepts 'narrow', 'short', or 'techie'. Returning '+6', '+06:00', or '+0600' respectively
   * @return {string}
   */
  formatOffset(e, n) {
    throw new ot();
  }
  /**
   * Return the offset in minutes for this zone at the specified timestamp.
   * @abstract
   * @param {number} ts - Epoch milliseconds for which to compute the offset
   * @return {number}
   */
  offset(e) {
    throw new ot();
  }
  /**
   * Return whether this Zone is equal to another zone
   * @abstract
   * @param {Zone} otherZone - the zone to compare
   * @return {boolean}
   */
  equals(e) {
    throw new ot();
  }
  /**
   * Return whether this Zone is valid.
   * @abstract
   * @type {boolean}
   */
  get isValid() {
    throw new ot();
  }
}
let To = null;
class Pn extends Mr {
  /**
   * Get a singleton instance of the local zone
   * @return {SystemZone}
   */
  static get instance() {
    return To === null && (To = new Pn()), To;
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
  offsetName(e, { format: n, locale: i }) {
    return Na(e, n, i);
  }
  /** @override **/
  formatOffset(e, n) {
    return Tr(this.offset(e), n);
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
const zo = /* @__PURE__ */ new Map();
function Ec(o) {
  let e = zo.get(o);
  return e === void 0 && (e = new Intl.DateTimeFormat("en-US", {
    hour12: !1,
    timeZone: o,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    era: "short"
  }), zo.set(o, e)), e;
}
const Tc = {
  year: 0,
  month: 1,
  day: 2,
  era: 3,
  hour: 4,
  minute: 5,
  second: 6
};
function $c(o, e) {
  const n = o.format(e).replace(/\u200E/g, ""), i = /(\d+)\/(\d+)\/(\d+) (AD|BC),? (\d+):(\d+):(\d+)/.exec(n), [, a, d, f, p, y, D, F] = i;
  return [f, a, d, p, y, D, F];
}
function Cc(o, e) {
  const n = o.formatToParts(e), i = [];
  for (let a = 0; a < n.length; a++) {
    const { type: d, value: f } = n[a], p = Tc[d];
    d === "era" ? i[p] = f : H(p) || (i[p] = parseInt(f, 10));
  }
  return i;
}
const $o = /* @__PURE__ */ new Map();
class He extends Mr {
  /**
   * @param {string} name - Zone name
   * @return {IANAZone}
   */
  static create(e) {
    let n = $o.get(e);
    return n === void 0 && $o.set(e, n = new He(e)), n;
  }
  /**
   * Reset local caches. Should only be necessary in testing scenarios.
   * @return {void}
   */
  static resetCache() {
    $o.clear(), zo.clear();
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
    super(), this.zoneName = e, this.valid = He.isValidZone(e);
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
  offsetName(e, { format: n, locale: i }) {
    return Na(e, n, i, this.name);
  }
  /**
   * Returns the offset's value as a string
   * @override
   * @param {number} ts - Epoch milliseconds for which to get the offset
   * @param {string} format - What style of offset to return.
   *                          Accepts 'narrow', 'short', or 'techie'. Returning '+6', '+06:00', or '+0600' respectively
   * @return {string}
   */
  formatOffset(e, n) {
    return Tr(this.offset(e), n);
  }
  /**
   * Return the offset in minutes for this zone at the specified timestamp.
   * @override
   * @param {number} ts - Epoch milliseconds for which to compute the offset
   * @return {number}
   */
  offset(e) {
    if (!this.valid) return NaN;
    const n = new Date(e);
    if (isNaN(n)) return NaN;
    const i = Ec(this.name);
    let [a, d, f, p, y, D, F] = i.formatToParts ? Cc(i, n) : $c(i, n);
    p === "BC" && (a = -Math.abs(a) + 1);
    const Y = Rn({
      year: a,
      month: d,
      day: f,
      hour: y === 24 ? 0 : y,
      minute: D,
      second: F,
      millisecond: 0
    });
    let L = +n;
    const ee = L % 1e3;
    return L -= ee >= 0 ? ee : 1e3 + ee, (Y - L) / (60 * 1e3);
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
let ms = {};
function Ac(o, e = {}) {
  const n = JSON.stringify([o, e]);
  let i = ms[n];
  return i || (i = new Intl.ListFormat(o, e), ms[n] = i), i;
}
const Ko = /* @__PURE__ */ new Map();
function Bo(o, e = {}) {
  const n = JSON.stringify([o, e]);
  let i = Ko.get(n);
  return i === void 0 && (i = new Intl.DateTimeFormat(o, e), Ko.set(n, i)), i;
}
const Ho = /* @__PURE__ */ new Map();
function Dc(o, e = {}) {
  const n = JSON.stringify([o, e]);
  let i = Ho.get(n);
  return i === void 0 && (i = new Intl.NumberFormat(o, e), Ho.set(n, i)), i;
}
const Zo = /* @__PURE__ */ new Map();
function Ic(o, e = {}) {
  const { base: n, ...i } = e, a = JSON.stringify([o, i]);
  let d = Zo.get(a);
  return d === void 0 && (d = new Intl.RelativeTimeFormat(o, e), Zo.set(a, d)), d;
}
let xr = null;
function Mc() {
  return xr || (xr = new Intl.DateTimeFormat().resolvedOptions().locale, xr);
}
const Yo = /* @__PURE__ */ new Map();
function Sa(o) {
  let e = Yo.get(o);
  return e === void 0 && (e = new Intl.DateTimeFormat(o).resolvedOptions(), Yo.set(o, e)), e;
}
const Go = /* @__PURE__ */ new Map();
function Nc(o) {
  let e = Go.get(o);
  if (!e) {
    const n = new Intl.Locale(o);
    e = "getWeekInfo" in n ? n.getWeekInfo() : n.weekInfo, "minimalDays" in e || (e = { ...Oa, ...e }), Go.set(o, e);
  }
  return e;
}
function Pc(o) {
  const e = o.indexOf("-x-");
  e !== -1 && (o = o.substring(0, e));
  const n = o.indexOf("-u-");
  if (n === -1)
    return [o];
  {
    let i, a;
    try {
      i = Bo(o).resolvedOptions(), a = o;
    } catch {
      const y = o.substring(0, n);
      i = Bo(y).resolvedOptions(), a = y;
    }
    const { numberingSystem: d, calendar: f } = i;
    return [a, d, f];
  }
}
function jc(o, e, n) {
  return (n || e) && (o.includes("-u-") || (o += "-u"), n && (o += `-ca-${n}`), e && (o += `-nu-${e}`)), o;
}
function Rc(o) {
  const e = [];
  for (let n = 1; n <= 12; n++) {
    const i = B.utc(2009, n, 1);
    e.push(o(i));
  }
  return e;
}
function Fc(o) {
  const e = [];
  for (let n = 1; n <= 7; n++) {
    const i = B.utc(2016, 11, 13 + n);
    e.push(o(i));
  }
  return e;
}
function gn(o, e, n, i) {
  const a = o.listingMode();
  return a === "error" ? null : a === "en" ? n(e) : i(e);
}
function Wc(o) {
  return o.numberingSystem && o.numberingSystem !== "latn" ? !1 : o.numberingSystem === "latn" || !o.locale || o.locale.startsWith("en") || Sa(o.locale).numberingSystem === "latn";
}
class qc {
  constructor(e, n, i) {
    this.padTo = i.padTo || 0, this.floor = i.floor || !1;
    const { padTo: a, floor: d, ...f } = i;
    if (!n || Object.keys(f).length > 0) {
      const p = { useGrouping: !1, ...i };
      i.padTo > 0 && (p.minimumIntegerDigits = i.padTo), this.inf = Dc(e, p);
    }
  }
  format(e) {
    if (this.inf) {
      const n = this.floor ? Math.floor(e) : e;
      return this.inf.format(n);
    } else {
      const n = this.floor ? Math.floor(e) : mi(e, 3);
      return ge(n, this.padTo);
    }
  }
}
class Vc {
  constructor(e, n, i) {
    this.opts = i, this.originalZone = void 0;
    let a;
    if (this.opts.timeZone)
      this.dt = e;
    else if (e.zone.type === "fixed") {
      const f = -1 * (e.offset / 60), p = f >= 0 ? `Etc/GMT+${f}` : `Etc/GMT${f}`;
      e.offset !== 0 && He.create(p).valid ? (a = p, this.dt = e) : (a = "UTC", this.dt = e.offset === 0 ? e : e.setZone("UTC").plus({ minutes: e.offset }), this.originalZone = e.zone);
    } else e.zone.type === "system" ? this.dt = e : e.zone.type === "iana" ? (this.dt = e, a = e.zone.name) : (a = "UTC", this.dt = e.setZone("UTC").plus({ minutes: e.offset }), this.originalZone = e.zone);
    const d = { ...this.opts };
    d.timeZone = d.timeZone || a, this.dtf = Bo(n, d);
  }
  format() {
    return this.originalZone ? this.formatToParts().map(({ value: e }) => e).join("") : this.dtf.format(this.dt.toJSDate());
  }
  formatToParts() {
    const e = this.dtf.formatToParts(this.dt.toJSDate());
    return this.originalZone ? e.map((n) => {
      if (n.type === "timeZoneName") {
        const i = this.originalZone.offsetName(this.dt.ts, {
          locale: this.dt.locale,
          format: this.opts.timeZoneName
        });
        return {
          ...n,
          value: i
        };
      } else
        return n;
    }) : e;
  }
  resolvedOptions() {
    return this.dtf.resolvedOptions();
  }
}
class Uc {
  constructor(e, n, i) {
    this.opts = { style: "long", ...i }, !n && Ia() && (this.rtf = Ic(e, i));
  }
  format(e, n) {
    return this.rtf ? this.rtf.format(e, n) : ll(n, e, this.opts.numeric, this.opts.style !== "long");
  }
  formatToParts(e, n) {
    return this.rtf ? this.rtf.formatToParts(e, n) : [];
  }
}
const Oa = {
  firstDay: 1,
  minimalDays: 4,
  weekend: [6, 7]
};
class ie {
  static fromOpts(e) {
    return ie.create(
      e.locale,
      e.numberingSystem,
      e.outputCalendar,
      e.weekSettings,
      e.defaultToEN
    );
  }
  static create(e, n, i, a, d = !1) {
    const f = e || de.defaultLocale, p = f || (d ? "en-US" : Mc()), y = n || de.defaultNumberingSystem, D = i || de.defaultOutputCalendar, F = Qo(a) || de.defaultWeekSettings;
    return new ie(p, y, D, F, f);
  }
  static resetCache() {
    xr = null, Ko.clear(), Ho.clear(), Zo.clear(), Yo.clear(), Go.clear();
  }
  static fromObject({ locale: e, numberingSystem: n, outputCalendar: i, weekSettings: a } = {}) {
    return ie.create(e, n, i, a);
  }
  constructor(e, n, i, a, d) {
    const [f, p, y] = Pc(e);
    this.locale = f, this.numberingSystem = n || p || null, this.outputCalendar = i || y || null, this.weekSettings = a, this.intl = jc(this.locale, this.numberingSystem, this.outputCalendar), this.weekdaysCache = { format: {}, standalone: {} }, this.monthsCache = { format: {}, standalone: {} }, this.meridiemCache = null, this.eraCache = {}, this.specifiedLocale = d, this.fastNumbersCached = null;
  }
  get fastNumbers() {
    return this.fastNumbersCached == null && (this.fastNumbersCached = Wc(this)), this.fastNumbersCached;
  }
  listingMode() {
    const e = this.isEnglish(), n = (this.numberingSystem === null || this.numberingSystem === "latn") && (this.outputCalendar === null || this.outputCalendar === "gregory");
    return e && n ? "en" : "intl";
  }
  clone(e) {
    return !e || Object.getOwnPropertyNames(e).length === 0 ? this : ie.create(
      e.locale || this.specifiedLocale,
      e.numberingSystem || this.numberingSystem,
      e.outputCalendar || this.outputCalendar,
      Qo(e.weekSettings) || this.weekSettings,
      e.defaultToEN || !1
    );
  }
  redefaultToEN(e = {}) {
    return this.clone({ ...e, defaultToEN: !0 });
  }
  redefaultToSystem(e = {}) {
    return this.clone({ ...e, defaultToEN: !1 });
  }
  months(e, n = !1) {
    return gn(this, e, Ra, () => {
      const i = this.intl === "ja" || this.intl.startsWith("ja-");
      n &= !i;
      const a = n ? { month: e, day: "numeric" } : { month: e }, d = n ? "format" : "standalone";
      if (!this.monthsCache[d][e]) {
        const f = i ? (p) => this.dtFormatter(p, a).format() : (p) => this.extract(p, a, "month");
        this.monthsCache[d][e] = Rc(f);
      }
      return this.monthsCache[d][e];
    });
  }
  weekdays(e, n = !1) {
    return gn(this, e, qa, () => {
      const i = n ? { weekday: e, year: "numeric", month: "long", day: "numeric" } : { weekday: e }, a = n ? "format" : "standalone";
      return this.weekdaysCache[a][e] || (this.weekdaysCache[a][e] = Fc(
        (d) => this.extract(d, i, "weekday")
      )), this.weekdaysCache[a][e];
    });
  }
  meridiems() {
    return gn(
      this,
      void 0,
      () => Va,
      () => {
        if (!this.meridiemCache) {
          const e = { hour: "numeric", hourCycle: "h12" };
          this.meridiemCache = [B.utc(2016, 11, 13, 9), B.utc(2016, 11, 13, 19)].map(
            (n) => this.extract(n, e, "dayperiod")
          );
        }
        return this.meridiemCache;
      }
    );
  }
  eras(e) {
    return gn(this, e, Ua, () => {
      const n = { era: e };
      return this.eraCache[e] || (this.eraCache[e] = [B.utc(-40, 1, 1), B.utc(2017, 1, 1)].map(
        (i) => this.extract(i, n, "era")
      )), this.eraCache[e];
    });
  }
  extract(e, n, i) {
    const a = this.dtFormatter(e, n), d = a.formatToParts(), f = d.find((p) => p.type.toLowerCase() === i);
    return f ? f.value : null;
  }
  numberFormatter(e = {}) {
    return new qc(this.intl, e.forceSimple || this.fastNumbers, e);
  }
  dtFormatter(e, n = {}) {
    return new Vc(e, this.intl, n);
  }
  relFormatter(e = {}) {
    return new Uc(this.intl, this.isEnglish(), e);
  }
  listFormatter(e = {}) {
    return Ac(this.intl, e);
  }
  isEnglish() {
    return this.locale === "en" || this.locale.toLowerCase() === "en-us" || Sa(this.intl).locale.startsWith("en-us");
  }
  getWeekSettings() {
    return this.weekSettings ? this.weekSettings : Ma() ? Nc(this.locale) : Oa;
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
let Co = null;
class Ee extends Mr {
  /**
   * Get a singleton instance of UTC
   * @return {FixedOffsetZone}
   */
  static get utcInstance() {
    return Co === null && (Co = new Ee(0)), Co;
  }
  /**
   * Get an instance with a specified offset
   * @param {number} offset - The offset in minutes
   * @return {FixedOffsetZone}
   */
  static instance(e) {
    return e === 0 ? Ee.utcInstance : new Ee(e);
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
      const n = e.match(/^utc(?:([+-]\d{1,2})(?::(\d{2}))?)?$/i);
      if (n)
        return new Ee(Fn(n[1], n[2]));
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
    return this.fixed === 0 ? "UTC" : `UTC${Tr(this.fixed, "narrow")}`;
  }
  /**
   * The IANA name of this zone, i.e. `Etc/UTC` or `Etc/GMT+/-nn`
   *
   * @override
   * @type {string}
   */
  get ianaName() {
    return this.fixed === 0 ? "Etc/UTC" : `Etc/GMT${Tr(-this.fixed, "narrow")}`;
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
  formatOffset(e, n) {
    return Tr(this.fixed, n);
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
class Lc extends Mr {
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
function at(o, e) {
  if (H(o) || o === null)
    return e;
  if (o instanceof Mr)
    return o;
  if (Yc(o)) {
    const n = o.toLowerCase();
    return n === "default" ? e : n === "local" || n === "system" ? Pn.instance : n === "utc" || n === "gmt" ? Ee.utcInstance : Ee.parseSpecifier(n) || He.create(o);
  } else return ut(o) ? Ee.instance(o) : typeof o == "object" && "offset" in o && typeof o.offset == "function" ? o : new Lc(o);
}
const fi = {
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
}, ys = {
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
}, zc = fi.hanidec.replace(/[\[|\]]/g, "").split("");
function Kc(o) {
  let e = parseInt(o, 10);
  if (isNaN(e)) {
    e = "";
    for (let n = 0; n < o.length; n++) {
      const i = o.charCodeAt(n);
      if (o[n].search(fi.hanidec) !== -1)
        e += zc.indexOf(o[n]);
      else
        for (const a in ys) {
          const [d, f] = ys[a];
          i >= d && i <= f && (e += i - d);
        }
    }
    return parseInt(e, 10);
  } else
    return e;
}
const Jo = /* @__PURE__ */ new Map();
function Bc() {
  Jo.clear();
}
function Pe({ numberingSystem: o }, e = "") {
  const n = o || "latn";
  let i = Jo.get(n);
  i === void 0 && (i = /* @__PURE__ */ new Map(), Jo.set(n, i));
  let a = i.get(e);
  return a === void 0 && (a = new RegExp(`${fi[n]}${e}`), i.set(e, a)), a;
}
let bs = () => Date.now(), vs = "system", ws = null, ks = null, _s = null, xs = 60, Ss, Os = null;
class de {
  /**
   * Get the callback for returning the current timestamp.
   * @type {function}
   */
  static get now() {
    return bs;
  }
  /**
   * Set the callback for returning the current timestamp.
   * The function should return a number, which will be interpreted as an Epoch millisecond count
   * @type {function}
   * @example Settings.now = () => Date.now() + 3000 // pretend it is 3 seconds in the future
   * @example Settings.now = () => 0 // always pretend it's Jan 1, 1970 at midnight in UTC time
   */
  static set now(e) {
    bs = e;
  }
  /**
   * Set the default time zone to create DateTimes in. Does not affect existing instances.
   * Use the value "system" to reset this value to the system's time zone.
   * @type {string}
   */
  static set defaultZone(e) {
    vs = e;
  }
  /**
   * Get the default time zone object currently used to create DateTimes. Does not affect existing instances.
   * The default value is the system's time zone (the one set on the machine that runs this code).
   * @type {Zone}
   */
  static get defaultZone() {
    return at(vs, Pn.instance);
  }
  /**
   * Get the default locale to create DateTimes with. Does not affect existing instances.
   * @type {string}
   */
  static get defaultLocale() {
    return ws;
  }
  /**
   * Set the default locale to create DateTimes with. Does not affect existing instances.
   * @type {string}
   */
  static set defaultLocale(e) {
    ws = e;
  }
  /**
   * Get the default numbering system to create DateTimes with. Does not affect existing instances.
   * @type {string}
   */
  static get defaultNumberingSystem() {
    return ks;
  }
  /**
   * Set the default numbering system to create DateTimes with. Does not affect existing instances.
   * @type {string}
   */
  static set defaultNumberingSystem(e) {
    ks = e;
  }
  /**
   * Get the default output calendar to create DateTimes with. Does not affect existing instances.
   * @type {string}
   */
  static get defaultOutputCalendar() {
    return _s;
  }
  /**
   * Set the default output calendar to create DateTimes with. Does not affect existing instances.
   * @type {string}
   */
  static set defaultOutputCalendar(e) {
    _s = e;
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
    return Os;
  }
  /**
   * Allows overriding the default locale week settings, i.e. the start of the week, the weekend and
   * how many days are required in the first week of a year.
   * Does not affect existing instances.
   *
   * @param {WeekSettings|null} weekSettings
   */
  static set defaultWeekSettings(e) {
    Os = Qo(e);
  }
  /**
   * Get the cutoff year for whether a 2-digit year string is interpreted in the current or previous century. Numbers higher than the cutoff will be considered to mean 19xx and numbers lower or equal to the cutoff will be considered 20xx.
   * @type {number}
   */
  static get twoDigitCutoffYear() {
    return xs;
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
    xs = e % 100;
  }
  /**
   * Get whether Luxon will throw when it encounters invalid DateTimes, Durations, or Intervals
   * @type {boolean}
   */
  static get throwOnInvalid() {
    return Ss;
  }
  /**
   * Set whether Luxon will throw when it encounters invalid DateTimes, Durations, or Intervals
   * @type {boolean}
   */
  static set throwOnInvalid(e) {
    Ss = e;
  }
  /**
   * Reset Luxon's global caches. Should only be necessary in testing scenarios.
   * @return {void}
   */
  static resetCaches() {
    ie.resetCache(), He.resetCache(), B.resetCache(), Bc();
  }
}
class Re {
  constructor(e, n) {
    this.reason = e, this.explanation = n;
  }
  toMessage() {
    return this.explanation ? `${this.reason}: ${this.explanation}` : this.reason;
  }
}
const Ea = [0, 31, 59, 90, 120, 151, 181, 212, 243, 273, 304, 334], Ta = [0, 31, 60, 91, 121, 152, 182, 213, 244, 274, 305, 335];
function Ie(o, e) {
  return new Re(
    "unit out of range",
    `you specified ${e} (of type ${typeof e}) as a ${o}, which is invalid`
  );
}
function hi(o, e, n) {
  const i = new Date(Date.UTC(o, e - 1, n));
  o < 100 && o >= 0 && i.setUTCFullYear(i.getUTCFullYear() - 1900);
  const a = i.getUTCDay();
  return a === 0 ? 7 : a;
}
function $a(o, e, n) {
  return n + (Nr(o) ? Ta : Ea)[e - 1];
}
function Ca(o, e) {
  const n = Nr(o) ? Ta : Ea, i = n.findIndex((d) => d < e), a = e - n[i];
  return { month: i + 1, day: a };
}
function pi(o, e) {
  return (o - e + 7) % 7 + 1;
}
function $n(o, e = 4, n = 1) {
  const { year: i, month: a, day: d } = o, f = $a(i, a, d), p = pi(hi(i, a, d), n);
  let y = Math.floor((f - p + 14 - e) / 7), D;
  return y < 1 ? (D = i - 1, y = Ar(D, e, n)) : y > Ar(i, e, n) ? (D = i + 1, y = 1) : D = i, { weekYear: D, weekNumber: y, weekday: p, ...Wn(o) };
}
function Es(o, e = 4, n = 1) {
  const { weekYear: i, weekNumber: a, weekday: d } = o, f = pi(hi(i, 1, e), n), p = Yt(i);
  let y = a * 7 + d - f - 7 + e, D;
  y < 1 ? (D = i - 1, y += Yt(D)) : y > p ? (D = i + 1, y -= Yt(i)) : D = i;
  const { month: F, day: j } = Ca(D, y);
  return { year: D, month: F, day: j, ...Wn(o) };
}
function Ao(o) {
  const { year: e, month: n, day: i } = o, a = $a(e, n, i);
  return { year: e, ordinal: a, ...Wn(o) };
}
function Ts(o) {
  const { year: e, ordinal: n } = o, { month: i, day: a } = Ca(e, n);
  return { year: e, month: i, day: a, ...Wn(o) };
}
function $s(o, e) {
  if (!H(o.localWeekday) || !H(o.localWeekNumber) || !H(o.localWeekYear)) {
    if (!H(o.weekday) || !H(o.weekNumber) || !H(o.weekYear))
      throw new Zt(
        "Cannot mix locale-based week fields with ISO-based week fields"
      );
    return H(o.localWeekday) || (o.weekday = o.localWeekday), H(o.localWeekNumber) || (o.weekNumber = o.localWeekNumber), H(o.localWeekYear) || (o.weekYear = o.localWeekYear), delete o.localWeekday, delete o.localWeekNumber, delete o.localWeekYear, {
      minDaysInFirstWeek: e.getMinDaysInFirstWeek(),
      startOfWeek: e.getStartOfWeek()
    };
  } else
    return { minDaysInFirstWeek: 4, startOfWeek: 1 };
}
function Hc(o, e = 4, n = 1) {
  const i = jn(o.weekYear), a = Me(
    o.weekNumber,
    1,
    Ar(o.weekYear, e, n)
  ), d = Me(o.weekday, 1, 7);
  return i ? a ? d ? !1 : Ie("weekday", o.weekday) : Ie("week", o.weekNumber) : Ie("weekYear", o.weekYear);
}
function Zc(o) {
  const e = jn(o.year), n = Me(o.ordinal, 1, Yt(o.year));
  return e ? n ? !1 : Ie("ordinal", o.ordinal) : Ie("year", o.year);
}
function Aa(o) {
  const e = jn(o.year), n = Me(o.month, 1, 12), i = Me(o.day, 1, Cn(o.year, o.month));
  return e ? n ? i ? !1 : Ie("day", o.day) : Ie("month", o.month) : Ie("year", o.year);
}
function Da(o) {
  const { hour: e, minute: n, second: i, millisecond: a } = o, d = Me(e, 0, 23) || e === 24 && n === 0 && i === 0 && a === 0, f = Me(n, 0, 59), p = Me(i, 0, 59), y = Me(a, 0, 999);
  return d ? f ? p ? y ? !1 : Ie("millisecond", a) : Ie("second", i) : Ie("minute", n) : Ie("hour", e);
}
function H(o) {
  return typeof o > "u";
}
function ut(o) {
  return typeof o == "number";
}
function jn(o) {
  return typeof o == "number" && o % 1 === 0;
}
function Yc(o) {
  return typeof o == "string";
}
function Gc(o) {
  return Object.prototype.toString.call(o) === "[object Date]";
}
function Ia() {
  try {
    return typeof Intl < "u" && !!Intl.RelativeTimeFormat;
  } catch {
    return !1;
  }
}
function Ma() {
  try {
    return typeof Intl < "u" && !!Intl.Locale && ("weekInfo" in Intl.Locale.prototype || "getWeekInfo" in Intl.Locale.prototype);
  } catch {
    return !1;
  }
}
function Jc(o) {
  return Array.isArray(o) ? o : [o];
}
function Cs(o, e, n) {
  if (o.length !== 0)
    return o.reduce((i, a) => {
      const d = [e(a), a];
      return i && n(i[0], d[0]) === i[0] ? i : d;
    }, null)[1];
}
function Qc(o, e) {
  return e.reduce((n, i) => (n[i] = o[i], n), {});
}
function Xt(o, e) {
  return Object.prototype.hasOwnProperty.call(o, e);
}
function Qo(o) {
  if (o == null)
    return null;
  if (typeof o != "object")
    throw new _e("Week settings must be an object");
  if (!Me(o.firstDay, 1, 7) || !Me(o.minimalDays, 1, 7) || !Array.isArray(o.weekend) || o.weekend.some((e) => !Me(e, 1, 7)))
    throw new _e("Invalid week settings");
  return {
    firstDay: o.firstDay,
    minimalDays: o.minimalDays,
    weekend: Array.from(o.weekend)
  };
}
function Me(o, e, n) {
  return jn(o) && o >= e && o <= n;
}
function Xc(o, e) {
  return o - e * Math.floor(o / e);
}
function ge(o, e = 2) {
  const n = o < 0;
  let i;
  return n ? i = "-" + ("" + -o).padStart(e, "0") : i = ("" + o).padStart(e, "0"), i;
}
function it(o) {
  if (!(H(o) || o === null || o === ""))
    return parseInt(o, 10);
}
function Ot(o) {
  if (!(H(o) || o === null || o === ""))
    return parseFloat(o);
}
function gi(o) {
  if (!(H(o) || o === null || o === "")) {
    const e = parseFloat("0." + o) * 1e3;
    return Math.floor(e);
  }
}
function mi(o, e, n = "round") {
  const i = 10 ** e;
  switch (n) {
    case "expand":
      return o > 0 ? Math.ceil(o * i) / i : Math.floor(o * i) / i;
    case "trunc":
      return Math.trunc(o * i) / i;
    case "round":
      return Math.round(o * i) / i;
    case "floor":
      return Math.floor(o * i) / i;
    case "ceil":
      return Math.ceil(o * i) / i;
    default:
      throw new RangeError(`Value rounding ${n} is out of range`);
  }
}
function Nr(o) {
  return o % 4 === 0 && (o % 100 !== 0 || o % 400 === 0);
}
function Yt(o) {
  return Nr(o) ? 366 : 365;
}
function Cn(o, e) {
  const n = Xc(e - 1, 12) + 1, i = o + (e - n) / 12;
  return n === 2 ? Nr(i) ? 29 : 28 : [31, null, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31][n - 1];
}
function Rn(o) {
  let e = Date.UTC(
    o.year,
    o.month - 1,
    o.day,
    o.hour,
    o.minute,
    o.second,
    o.millisecond
  );
  return o.year < 100 && o.year >= 0 && (e = new Date(e), e.setUTCFullYear(o.year, o.month - 1, o.day)), +e;
}
function As(o, e, n) {
  return -pi(hi(o, 1, e), n) + e - 1;
}
function Ar(o, e = 4, n = 1) {
  const i = As(o, e, n), a = As(o + 1, e, n);
  return (Yt(o) - i + a) / 7;
}
function Xo(o) {
  return o > 99 ? o : o > de.twoDigitCutoffYear ? 1900 + o : 2e3 + o;
}
function Na(o, e, n, i = null) {
  const a = new Date(o), d = {
    hourCycle: "h23",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit"
  };
  i && (d.timeZone = i);
  const f = { timeZoneName: e, ...d }, p = new Intl.DateTimeFormat(n, f).formatToParts(a).find((y) => y.type.toLowerCase() === "timezonename");
  return p ? p.value : null;
}
function Fn(o, e) {
  let n = parseInt(o, 10);
  Number.isNaN(n) && (n = 0);
  const i = parseInt(e, 10) || 0, a = n < 0 || Object.is(n, -0) ? -i : i;
  return n * 60 + a;
}
function Pa(o) {
  const e = Number(o);
  if (typeof o == "boolean" || o === "" || !Number.isFinite(e))
    throw new _e(`Invalid unit value ${o}`);
  return e;
}
function An(o, e) {
  const n = {};
  for (const i in o)
    if (Xt(o, i)) {
      const a = o[i];
      if (a == null) continue;
      n[e(i)] = Pa(a);
    }
  return n;
}
function Tr(o, e) {
  const n = Math.trunc(Math.abs(o / 60)), i = Math.trunc(Math.abs(o % 60)), a = o >= 0 ? "+" : "-";
  switch (e) {
    case "short":
      return `${a}${ge(n, 2)}:${ge(i, 2)}`;
    case "narrow":
      return `${a}${n}${i > 0 ? `:${i}` : ""}`;
    case "techie":
      return `${a}${ge(n, 2)}${ge(i, 2)}`;
    default:
      throw new RangeError(`Value format ${e} is out of range for property format`);
  }
}
function Wn(o) {
  return Qc(o, ["hour", "minute", "second", "millisecond"]);
}
const el = [
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
], ja = [
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
], tl = ["J", "F", "M", "A", "M", "J", "J", "A", "S", "O", "N", "D"];
function Ra(o) {
  switch (o) {
    case "narrow":
      return [...tl];
    case "short":
      return [...ja];
    case "long":
      return [...el];
    case "numeric":
      return ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12"];
    case "2-digit":
      return ["01", "02", "03", "04", "05", "06", "07", "08", "09", "10", "11", "12"];
    default:
      return null;
  }
}
const Fa = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday"
], Wa = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"], rl = ["M", "T", "W", "T", "F", "S", "S"];
function qa(o) {
  switch (o) {
    case "narrow":
      return [...rl];
    case "short":
      return [...Wa];
    case "long":
      return [...Fa];
    case "numeric":
      return ["1", "2", "3", "4", "5", "6", "7"];
    default:
      return null;
  }
}
const Va = ["AM", "PM"], nl = ["Before Christ", "Anno Domini"], ol = ["BC", "AD"], il = ["B", "A"];
function Ua(o) {
  switch (o) {
    case "narrow":
      return [...il];
    case "short":
      return [...ol];
    case "long":
      return [...nl];
    default:
      return null;
  }
}
function sl(o) {
  return Va[o.hour < 12 ? 0 : 1];
}
function al(o, e) {
  return qa(e)[o.weekday - 1];
}
function ul(o, e) {
  return Ra(e)[o.month - 1];
}
function cl(o, e) {
  return Ua(e)[o.year < 0 ? 0 : 1];
}
function ll(o, e, n = "always", i = !1) {
  const a = {
    years: ["year", "yr."],
    quarters: ["quarter", "qtr."],
    months: ["month", "mo."],
    weeks: ["week", "wk."],
    days: ["day", "day", "days"],
    hours: ["hour", "hr."],
    minutes: ["minute", "min."],
    seconds: ["second", "sec."]
  }, d = ["hours", "minutes", "seconds"].indexOf(o) === -1;
  if (n === "auto" && d) {
    const j = o === "days";
    switch (e) {
      case 1:
        return j ? "tomorrow" : `next ${a[o][0]}`;
      case -1:
        return j ? "yesterday" : `last ${a[o][0]}`;
      case 0:
        return j ? "today" : `this ${a[o][0]}`;
    }
  }
  const f = Object.is(e, -0) || e < 0, p = Math.abs(e), y = p === 1, D = a[o], F = i ? y ? D[1] : D[2] || D[1] : y ? a[o][0] : o;
  return f ? `${p} ${F} ago` : `in ${p} ${F}`;
}
function Ds(o, e) {
  let n = "";
  for (const i of o)
    i.literal ? n += i.val : n += e(i.val);
  return n;
}
const dl = {
  D: Tn,
  DD: ia,
  DDD: sa,
  DDDD: aa,
  t: ua,
  tt: ca,
  ttt: la,
  tttt: da,
  T: fa,
  TT: ha,
  TTT: pa,
  TTTT: ga,
  f: ma,
  ff: ba,
  fff: wa,
  ffff: _a,
  F: ya,
  FF: va,
  FFF: ka,
  FFFF: xa
};
class xe {
  static create(e, n = {}) {
    return new xe(e, n);
  }
  static parseFormat(e) {
    let n = null, i = "", a = !1;
    const d = [];
    for (let f = 0; f < e.length; f++) {
      const p = e.charAt(f);
      p === "'" ? ((i.length > 0 || a) && d.push({
        literal: a || /^\s+$/.test(i),
        val: i === "" ? "'" : i
      }), n = null, i = "", a = !a) : a || p === n ? i += p : (i.length > 0 && d.push({ literal: /^\s+$/.test(i), val: i }), i = p, n = p);
    }
    return i.length > 0 && d.push({ literal: a || /^\s+$/.test(i), val: i }), d;
  }
  static macroTokenToFormatOpts(e) {
    return dl[e];
  }
  constructor(e, n) {
    this.opts = n, this.loc = e, this.systemLoc = null;
  }
  formatWithSystemDefault(e, n) {
    return this.systemLoc === null && (this.systemLoc = this.loc.redefaultToSystem()), this.systemLoc.dtFormatter(e, { ...this.opts, ...n }).format();
  }
  dtFormatter(e, n = {}) {
    return this.loc.dtFormatter(e, { ...this.opts, ...n });
  }
  formatDateTime(e, n) {
    return this.dtFormatter(e, n).format();
  }
  formatDateTimeParts(e, n) {
    return this.dtFormatter(e, n).formatToParts();
  }
  formatInterval(e, n) {
    return this.dtFormatter(e.start, n).dtf.formatRange(e.start.toJSDate(), e.end.toJSDate());
  }
  resolvedOptions(e, n) {
    return this.dtFormatter(e, n).resolvedOptions();
  }
  num(e, n = 0, i = void 0) {
    if (this.opts.forceSimple)
      return ge(e, n);
    const a = { ...this.opts };
    return n > 0 && (a.padTo = n), i && (a.signDisplay = i), this.loc.numberFormatter(a).format(e);
  }
  formatDateTimeFromString(e, n) {
    const i = this.loc.listingMode() === "en", a = this.loc.outputCalendar && this.loc.outputCalendar !== "gregory", d = (L, ee) => this.loc.extract(e, L, ee), f = (L) => e.isOffsetFixed && e.offset === 0 && L.allowZ ? "Z" : e.isValid ? e.zone.formatOffset(e.ts, L.format) : "", p = () => i ? sl(e) : d({ hour: "numeric", hourCycle: "h12" }, "dayperiod"), y = (L, ee) => i ? ul(e, L) : d(ee ? { month: L } : { month: L, day: "numeric" }, "month"), D = (L, ee) => i ? al(e, L) : d(
      ee ? { weekday: L } : { weekday: L, month: "long", day: "numeric" },
      "weekday"
    ), F = (L) => {
      const ee = xe.macroTokenToFormatOpts(L);
      return ee ? this.formatWithSystemDefault(e, ee) : L;
    }, j = (L) => i ? cl(e, L) : d({ era: L }, "era"), Y = (L) => {
      switch (L) {
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
          return f({ format: "narrow", allowZ: this.opts.allowZ });
        case "ZZ":
          return f({ format: "short", allowZ: this.opts.allowZ });
        case "ZZZ":
          return f({ format: "techie", allowZ: this.opts.allowZ });
        case "ZZZZ":
          return e.zone.offsetName(e.ts, { format: "short", locale: this.loc.locale });
        case "ZZZZZ":
          return e.zone.offsetName(e.ts, { format: "long", locale: this.loc.locale });
        // zone
        case "z":
          return e.zoneName;
        // meridiems
        case "a":
          return p();
        // dates
        case "d":
          return a ? d({ day: "numeric" }, "day") : this.num(e.day);
        case "dd":
          return a ? d({ day: "2-digit" }, "day") : this.num(e.day, 2);
        // weekdays - standalone
        case "c":
          return this.num(e.weekday);
        case "ccc":
          return D("short", !0);
        case "cccc":
          return D("long", !0);
        case "ccccc":
          return D("narrow", !0);
        // weekdays - format
        case "E":
          return this.num(e.weekday);
        case "EEE":
          return D("short", !1);
        case "EEEE":
          return D("long", !1);
        case "EEEEE":
          return D("narrow", !1);
        // months - standalone
        case "L":
          return a ? d({ month: "numeric", day: "numeric" }, "month") : this.num(e.month);
        case "LL":
          return a ? d({ month: "2-digit", day: "numeric" }, "month") : this.num(e.month, 2);
        case "LLL":
          return y("short", !0);
        case "LLLL":
          return y("long", !0);
        case "LLLLL":
          return y("narrow", !0);
        // months - format
        case "M":
          return a ? d({ month: "numeric" }, "month") : this.num(e.month);
        case "MM":
          return a ? d({ month: "2-digit" }, "month") : this.num(e.month, 2);
        case "MMM":
          return y("short", !1);
        case "MMMM":
          return y("long", !1);
        case "MMMMM":
          return y("narrow", !1);
        // years
        case "y":
          return a ? d({ year: "numeric" }, "year") : this.num(e.year);
        case "yy":
          return a ? d({ year: "2-digit" }, "year") : this.num(e.year.toString().slice(-2), 2);
        case "yyyy":
          return a ? d({ year: "numeric" }, "year") : this.num(e.year, 4);
        case "yyyyyy":
          return a ? d({ year: "numeric" }, "year") : this.num(e.year, 6);
        // eras
        case "G":
          return j("short");
        case "GG":
          return j("long");
        case "GGGGG":
          return j("narrow");
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
          return F(L);
      }
    };
    return Ds(xe.parseFormat(n), Y);
  }
  formatDurationFromString(e, n) {
    const i = this.opts.signMode === "negativeLargestOnly" ? -1 : 1, a = (F) => {
      switch (F[0]) {
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
    }, d = (F, j) => (Y) => {
      const L = a(Y);
      if (L) {
        const ee = j.isNegativeDuration && L !== j.largestUnit ? i : 1;
        let me;
        return this.opts.signMode === "negativeLargestOnly" && L !== j.largestUnit ? me = "never" : this.opts.signMode === "all" ? me = "always" : me = "auto", this.num(F.get(L) * ee, Y.length, me);
      } else
        return Y;
    }, f = xe.parseFormat(n), p = f.reduce(
      (F, { literal: j, val: Y }) => j ? F : F.concat(Y),
      []
    ), y = e.shiftTo(...p.map(a).filter((F) => F)), D = {
      isNegativeDuration: y < 0,
      // this relies on "collapsed" being based on "shiftTo", which builds up the object
      // in order
      largestUnit: Object.keys(y.values)[0]
    };
    return Ds(f, d(y, D));
  }
}
const La = /[A-Za-z_+-]{1,256}(?::?\/[A-Za-z0-9_+-]{1,256}(?:\/[A-Za-z0-9_+-]{1,256})?)?/;
function er(...o) {
  const e = o.reduce((n, i) => n + i.source, "");
  return RegExp(`^${e}$`);
}
function tr(...o) {
  return (e) => o.reduce(
    ([n, i, a], d) => {
      const [f, p, y] = d(e, a);
      return [{ ...n, ...f }, p || i, y];
    },
    [{}, null, 1]
  ).slice(0, 2);
}
function rr(o, ...e) {
  if (o == null)
    return [null, null];
  for (const [n, i] of e) {
    const a = n.exec(o);
    if (a)
      return i(a);
  }
  return [null, null];
}
function za(...o) {
  return (e, n) => {
    const i = {};
    let a;
    for (a = 0; a < o.length; a++)
      i[o[a]] = it(e[n + a]);
    return [i, null, n + a];
  };
}
const Ka = /(?:([Zz])|([+-]\d\d)(?::?(\d\d))?)/, fl = `(?:${Ka.source}?(?:\\[(${La.source})\\])?)?`, yi = /(\d\d)(?::?(\d\d)(?::?(\d\d)(?:[.,](\d{1,30}))?)?)?/, Ba = RegExp(`${yi.source}${fl}`), bi = RegExp(`(?:[Tt]${Ba.source})?`), hl = /([+-]\d{6}|\d{4})(?:-?(\d\d)(?:-?(\d\d))?)?/, pl = /(\d{4})-?W(\d\d)(?:-?(\d))?/, gl = /(\d{4})-?(\d{3})/, ml = za("weekYear", "weekNumber", "weekDay"), yl = za("year", "ordinal"), bl = /(\d{4})-(\d\d)-(\d\d)/, Ha = RegExp(
  `${yi.source} ?(?:${Ka.source}|(${La.source}))?`
), vl = RegExp(`(?: ${Ha.source})?`);
function Gt(o, e, n) {
  const i = o[e];
  return H(i) ? n : it(i);
}
function wl(o, e) {
  return [{
    year: Gt(o, e),
    month: Gt(o, e + 1, 1),
    day: Gt(o, e + 2, 1)
  }, null, e + 3];
}
function nr(o, e) {
  return [{
    hours: Gt(o, e, 0),
    minutes: Gt(o, e + 1, 0),
    seconds: Gt(o, e + 2, 0),
    milliseconds: gi(o[e + 3])
  }, null, e + 4];
}
function Pr(o, e) {
  const n = !o[e] && !o[e + 1], i = Fn(o[e + 1], o[e + 2]), a = n ? null : Ee.instance(i);
  return [{}, a, e + 3];
}
function jr(o, e) {
  const n = o[e] ? He.create(o[e]) : null;
  return [{}, n, e + 1];
}
const kl = RegExp(`^T?${yi.source}$`), _l = /^-?P(?:(?:(-?\d{1,20}(?:\.\d{1,20})?)Y)?(?:(-?\d{1,20}(?:\.\d{1,20})?)M)?(?:(-?\d{1,20}(?:\.\d{1,20})?)W)?(?:(-?\d{1,20}(?:\.\d{1,20})?)D)?(?:T(?:(-?\d{1,20}(?:\.\d{1,20})?)H)?(?:(-?\d{1,20}(?:\.\d{1,20})?)M)?(?:(-?\d{1,20})(?:[.,](-?\d{1,20}))?S)?)?)$/;
function xl(o) {
  const [e, n, i, a, d, f, p, y, D] = o, F = e[0] === "-", j = y && y[0] === "-", Y = (L, ee = !1) => L !== void 0 && (ee || L && F) ? -L : L;
  return [
    {
      years: Y(Ot(n)),
      months: Y(Ot(i)),
      weeks: Y(Ot(a)),
      days: Y(Ot(d)),
      hours: Y(Ot(f)),
      minutes: Y(Ot(p)),
      seconds: Y(Ot(y), y === "-0"),
      milliseconds: Y(gi(D), j)
    }
  ];
}
const Sl = {
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
function vi(o, e, n, i, a, d, f) {
  const p = {
    year: e.length === 2 ? Xo(it(e)) : it(e),
    month: ja.indexOf(n) + 1,
    day: it(i),
    hour: it(a),
    minute: it(d)
  };
  return f && (p.second = it(f)), o && (p.weekday = o.length > 3 ? Fa.indexOf(o) + 1 : Wa.indexOf(o) + 1), p;
}
const Ol = /^(?:(Mon|Tue|Wed|Thu|Fri|Sat|Sun),\s)?(\d{1,2})\s(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)\s(\d{2,4})\s(\d\d):(\d\d)(?::(\d\d))?\s(?:(UT|GMT|[ECMP][SD]T)|([Zz])|(?:([+-]\d\d)(\d\d)))$/;
function El(o) {
  const [
    ,
    e,
    n,
    i,
    a,
    d,
    f,
    p,
    y,
    D,
    F,
    j
  ] = o, Y = vi(e, a, i, n, d, f, p);
  let L;
  return y ? L = Sl[y] : D ? L = 0 : L = Fn(F, j), [Y, new Ee(L)];
}
function Tl(o) {
  return o.replace(/\([^()]*\)|[\n\t]/g, " ").replace(/(\s\s+)/g, " ").trim();
}
const $l = /^(Mon|Tue|Wed|Thu|Fri|Sat|Sun), (\d\d) (Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec) (\d{4}) (\d\d):(\d\d):(\d\d) GMT$/, Cl = /^(Monday|Tuesday|Wednesday|Thursday|Friday|Saturday|Sunday), (\d\d)-(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)-(\d\d) (\d\d):(\d\d):(\d\d) GMT$/, Al = /^(Mon|Tue|Wed|Thu|Fri|Sat|Sun) (Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec) ( \d|\d\d) (\d\d):(\d\d):(\d\d) (\d{4})$/;
function Is(o) {
  const [, e, n, i, a, d, f, p] = o;
  return [vi(e, a, i, n, d, f, p), Ee.utcInstance];
}
function Dl(o) {
  const [, e, n, i, a, d, f, p] = o;
  return [vi(e, p, n, i, a, d, f), Ee.utcInstance];
}
const Il = er(hl, bi), Ml = er(pl, bi), Nl = er(gl, bi), Pl = er(Ba), Za = tr(
  wl,
  nr,
  Pr,
  jr
), jl = tr(
  ml,
  nr,
  Pr,
  jr
), Rl = tr(
  yl,
  nr,
  Pr,
  jr
), Fl = tr(
  nr,
  Pr,
  jr
);
function Wl(o) {
  return rr(
    o,
    [Il, Za],
    [Ml, jl],
    [Nl, Rl],
    [Pl, Fl]
  );
}
function ql(o) {
  return rr(Tl(o), [Ol, El]);
}
function Vl(o) {
  return rr(
    o,
    [$l, Is],
    [Cl, Is],
    [Al, Dl]
  );
}
function Ul(o) {
  return rr(o, [_l, xl]);
}
const Ll = tr(nr);
function zl(o) {
  return rr(o, [kl, Ll]);
}
const Kl = er(bl, vl), Bl = er(Ha), Hl = tr(
  nr,
  Pr,
  jr
);
function Zl(o) {
  return rr(
    o,
    [Kl, Za],
    [Bl, Hl]
  );
}
const Ms = "Invalid Duration", Ya = {
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
}, Yl = {
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
  ...Ya
}, De = 146097 / 400, zt = 146097 / 4800, Gl = {
  years: {
    quarters: 4,
    months: 12,
    weeks: De / 7,
    days: De,
    hours: De * 24,
    minutes: De * 24 * 60,
    seconds: De * 24 * 60 * 60,
    milliseconds: De * 24 * 60 * 60 * 1e3
  },
  quarters: {
    months: 3,
    weeks: De / 28,
    days: De / 4,
    hours: De * 24 / 4,
    minutes: De * 24 * 60 / 4,
    seconds: De * 24 * 60 * 60 / 4,
    milliseconds: De * 24 * 60 * 60 * 1e3 / 4
  },
  months: {
    weeks: zt / 7,
    days: zt,
    hours: zt * 24,
    minutes: zt * 24 * 60,
    seconds: zt * 24 * 60 * 60,
    milliseconds: zt * 24 * 60 * 60 * 1e3
  },
  ...Ya
}, $t = [
  "years",
  "quarters",
  "months",
  "weeks",
  "days",
  "hours",
  "minutes",
  "seconds",
  "milliseconds"
], Jl = $t.slice(0).reverse();
function Be(o, e, n = !1) {
  const i = {
    values: n ? e.values : { ...o.values, ...e.values || {} },
    loc: o.loc.clone(e.loc),
    conversionAccuracy: e.conversionAccuracy || o.conversionAccuracy,
    matrix: e.matrix || o.matrix
  };
  return new re(i);
}
function Ga(o, e) {
  let n = e.milliseconds ?? 0;
  for (const i of Jl.slice(1))
    e[i] && (n += e[i] * o[i].milliseconds);
  return n;
}
function Ns(o, e) {
  const n = Ga(o, e) < 0 ? -1 : 1;
  $t.reduceRight((i, a) => {
    if (H(e[a]))
      return i;
    if (i) {
      const d = e[i] * n, f = o[a][i], p = Math.floor(d / f);
      e[a] += p * n, e[i] -= p * f * n;
    }
    return a;
  }, null), $t.reduce((i, a) => {
    if (H(e[a]))
      return i;
    if (i) {
      const d = e[i] % 1;
      e[i] -= d, e[a] += d * o[i][a];
    }
    return a;
  }, null);
}
function Ps(o) {
  const e = {};
  for (const [n, i] of Object.entries(o))
    i !== 0 && (e[n] = i);
  return e;
}
class re {
  /**
   * @private
   */
  constructor(e) {
    const n = e.conversionAccuracy === "longterm" || !1;
    let i = n ? Gl : Yl;
    e.matrix && (i = e.matrix), this.values = e.values, this.loc = e.loc || ie.create(), this.conversionAccuracy = n ? "longterm" : "casual", this.invalid = e.invalid || null, this.matrix = i, this.isLuxonDuration = !0;
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
  static fromMillis(e, n) {
    return re.fromObject({ milliseconds: e }, n);
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
  static fromObject(e, n = {}) {
    if (e == null || typeof e != "object")
      throw new _e(
        `Duration.fromObject: argument expected to be an object, got ${e === null ? "null" : typeof e}`
      );
    return new re({
      values: An(e, re.normalizeUnit),
      loc: ie.fromObject(n),
      conversionAccuracy: n.conversionAccuracy,
      matrix: n.matrix
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
    if (ut(e))
      return re.fromMillis(e);
    if (re.isDuration(e))
      return e;
    if (typeof e == "object")
      return re.fromObject(e);
    throw new _e(
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
  static fromISO(e, n) {
    const [i] = Ul(e);
    return i ? re.fromObject(i, n) : re.invalid("unparsable", `the input "${e}" can't be parsed as ISO 8601`);
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
  static fromISOTime(e, n) {
    const [i] = zl(e);
    return i ? re.fromObject(i, n) : re.invalid("unparsable", `the input "${e}" can't be parsed as ISO 8601`);
  }
  /**
   * Create an invalid Duration.
   * @param {string} reason - simple string of why this datetime is invalid. Should not contain parameters or anything else data-dependent
   * @param {string} [explanation=null] - longer explanation, may include parameters and other useful debugging information
   * @return {Duration}
   */
  static invalid(e, n = null) {
    if (!e)
      throw new _e("need to specify a reason the Duration is invalid");
    const i = e instanceof Re ? e : new Re(e, n);
    if (de.throwOnInvalid)
      throw new xc(i);
    return new re({ invalid: i });
  }
  /**
   * @private
   */
  static normalizeUnit(e) {
    const n = {
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
    if (!n) throw new oa(e);
    return n;
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
  toFormat(e, n = {}) {
    const i = {
      ...n,
      floor: n.round !== !1 && n.floor !== !1
    };
    return this.isValid ? xe.create(this.loc, i).formatDurationFromString(this, e) : Ms;
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
    if (!this.isValid) return Ms;
    const n = e.showZeros !== !1, i = $t.map((a) => {
      const d = this.values[a];
      return H(d) || d === 0 && !n ? null : this.loc.numberFormatter({ style: "unit", unitDisplay: "long", ...e, unit: a.slice(0, -1) }).format(d);
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
    return this.years !== 0 && (e += this.years + "Y"), (this.months !== 0 || this.quarters !== 0) && (e += this.months + this.quarters * 3 + "M"), this.weeks !== 0 && (e += this.weeks + "W"), this.days !== 0 && (e += this.days + "D"), (this.hours !== 0 || this.minutes !== 0 || this.seconds !== 0 || this.milliseconds !== 0) && (e += "T"), this.hours !== 0 && (e += this.hours + "H"), this.minutes !== 0 && (e += this.minutes + "M"), (this.seconds !== 0 || this.milliseconds !== 0) && (e += mi(this.seconds + this.milliseconds / 1e3, 3) + "S"), e === "P" && (e += "T0S"), e;
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
    const n = this.toMillis();
    return n < 0 || n >= 864e5 ? null : (e = {
      suppressMilliseconds: !1,
      suppressSeconds: !1,
      includePrefix: !1,
      format: "extended",
      ...e,
      includeOffset: !1
    }, B.fromMillis(n, { zone: "UTC" }).toISOTime(e));
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
  [/* @__PURE__ */ Symbol.for("nodejs.util.inspect.custom")]() {
    return this.isValid ? `Duration { values: ${JSON.stringify(this.values)} }` : `Duration { Invalid, reason: ${this.invalidReason} }`;
  }
  /**
   * Returns an milliseconds value of this Duration.
   * @return {number}
   */
  toMillis() {
    return this.isValid ? Ga(this.matrix, this.values) : NaN;
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
    const n = re.fromDurationLike(e), i = {};
    for (const a of $t)
      (Xt(n.values, a) || Xt(this.values, a)) && (i[a] = n.get(a) + this.get(a));
    return Be(this, { values: i }, !0);
  }
  /**
   * Make this Duration shorter by the specified amount. Return a newly-constructed Duration.
   * @param {Duration|Object|number} duration - The amount to subtract. Either a Luxon Duration, a number of milliseconds, the object argument to Duration.fromObject()
   * @return {Duration}
   */
  minus(e) {
    if (!this.isValid) return this;
    const n = re.fromDurationLike(e);
    return this.plus(n.negate());
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
    const n = {};
    for (const i of Object.keys(this.values))
      n[i] = Pa(e(this.values[i], i));
    return Be(this, { values: n }, !0);
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
    return this[re.normalizeUnit(e)];
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
    const n = { ...this.values, ...An(e, re.normalizeUnit) };
    return Be(this, { values: n });
  }
  /**
   * "Set" the locale and/or numberingSystem.  Returns a newly-constructed Duration.
   * @example dur.reconfigure({ locale: 'en-GB' })
   * @return {Duration}
   */
  reconfigure({ locale: e, numberingSystem: n, conversionAccuracy: i, matrix: a } = {}) {
    const f = { loc: this.loc.clone({ locale: e, numberingSystem: n }), matrix: a, conversionAccuracy: i };
    return Be(this, f);
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
    return Ns(this.matrix, e), Be(this, { values: e }, !0);
  }
  /**
   * Rescale units to its largest representation
   * @example Duration.fromObject({ milliseconds: 90000 }).rescale().toObject() //=> { minutes: 1, seconds: 30 }
   * @return {Duration}
   */
  rescale() {
    if (!this.isValid) return this;
    const e = Ps(this.normalize().shiftToAll().toObject());
    return Be(this, { values: e }, !0);
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
    e = e.map((f) => re.normalizeUnit(f));
    const n = {}, i = {}, a = this.toObject();
    let d;
    for (const f of $t)
      if (e.indexOf(f) >= 0) {
        d = f;
        let p = 0;
        for (const D in i)
          p += this.matrix[D][f] * i[D], i[D] = 0;
        ut(a[f]) && (p += a[f]);
        const y = Math.trunc(p);
        n[f] = y, i[f] = (p * 1e3 - y * 1e3) / 1e3;
      } else ut(a[f]) && (i[f] = a[f]);
    for (const f in i)
      i[f] !== 0 && (n[d] += f === d ? i[f] : i[f] / this.matrix[d][f]);
    return Ns(this.matrix, n), Be(this, { values: n }, !0);
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
    for (const n of Object.keys(this.values))
      e[n] = this.values[n] === 0 ? 0 : -this.values[n];
    return Be(this, { values: e }, !0);
  }
  /**
   * Removes all units with values equal to 0 from this Duration.
   * @example Duration.fromObject({ years: 2, days: 0, hours: 0, minutes: 0 }).removeZeros().toObject() //=> { years: 2 }
   * @return {Duration}
   */
  removeZeros() {
    if (!this.isValid) return this;
    const e = Ps(this.values);
    return Be(this, { values: e }, !0);
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
    function n(i, a) {
      return i === void 0 || i === 0 ? a === void 0 || a === 0 : i === a;
    }
    for (const i of $t)
      if (!n(this.values[i], e.values[i]))
        return !1;
    return !0;
  }
}
const Kt = "Invalid Interval";
function Ql(o, e) {
  return !o || !o.isValid ? le.invalid("missing or invalid start") : !e || !e.isValid ? le.invalid("missing or invalid end") : e < o ? le.invalid(
    "end before start",
    `The end of an interval must be after its start, but you had start=${o.toISO()} and end=${e.toISO()}`
  ) : null;
}
class le {
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
  static invalid(e, n = null) {
    if (!e)
      throw new _e("need to specify a reason the Interval is invalid");
    const i = e instanceof Re ? e : new Re(e, n);
    if (de.throwOnInvalid)
      throw new _c(i);
    return new le({ invalid: i });
  }
  /**
   * Create an Interval from a start DateTime and an end DateTime. Inclusive of the start but not the end.
   * @param {DateTime|Date|Object} start
   * @param {DateTime|Date|Object} end
   * @return {Interval}
   */
  static fromDateTimes(e, n) {
    const i = _r(e), a = _r(n), d = Ql(i, a);
    return d ?? new le({
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
  static after(e, n) {
    const i = re.fromDurationLike(n), a = _r(e);
    return le.fromDateTimes(a, a.plus(i));
  }
  /**
   * Create an Interval from an end DateTime and a Duration to extend backwards to.
   * @param {DateTime|Date|Object} end
   * @param {Duration|Object|number} duration - the length of the Interval.
   * @return {Interval}
   */
  static before(e, n) {
    const i = re.fromDurationLike(n), a = _r(e);
    return le.fromDateTimes(a.minus(i), a);
  }
  /**
   * Create an Interval from an ISO 8601 string.
   * Accepts `<start>/<end>`, `<start>/<duration>`, and `<duration>/<end>` formats.
   * @param {string} text - the ISO string to parse
   * @param {Object} [opts] - options to pass {@link DateTime#fromISO} and optionally {@link Duration#fromISO}
   * @see https://en.wikipedia.org/wiki/ISO_8601#Time_intervals
   * @return {Interval}
   */
  static fromISO(e, n) {
    const [i, a] = (e || "").split("/", 2);
    if (i && a) {
      let d, f;
      try {
        d = B.fromISO(i, n), f = d.isValid;
      } catch {
        f = !1;
      }
      let p, y;
      try {
        p = B.fromISO(a, n), y = p.isValid;
      } catch {
        y = !1;
      }
      if (f && y)
        return le.fromDateTimes(d, p);
      if (f) {
        const D = re.fromISO(a, n);
        if (D.isValid)
          return le.after(d, D);
      } else if (y) {
        const D = re.fromISO(i, n);
        if (D.isValid)
          return le.before(p, D);
      }
    }
    return le.invalid("unparsable", `the input "${e}" can't be parsed as ISO 8601`);
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
  count(e = "milliseconds", n) {
    if (!this.isValid) return NaN;
    const i = this.start.startOf(e, n);
    let a;
    return n?.useLocaleWeeks ? a = this.end.reconfigure({ locale: i.locale }) : a = this.end, a = a.startOf(e, n), Math.floor(a.diff(i, e).get(e)) + (a.valueOf() !== this.end.valueOf());
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
  set({ start: e, end: n } = {}) {
    return this.isValid ? le.fromDateTimes(e || this.s, n || this.e) : this;
  }
  /**
   * Split this Interval at each of the specified DateTimes
   * @param {...DateTime} dateTimes - the unit of time to count.
   * @return {Array}
   */
  splitAt(...e) {
    if (!this.isValid) return [];
    const n = e.map(_r).filter((f) => this.contains(f)).sort((f, p) => f.toMillis() - p.toMillis()), i = [];
    let { s: a } = this, d = 0;
    for (; a < this.e; ) {
      const f = n[d] || this.e, p = +f > +this.e ? this.e : f;
      i.push(le.fromDateTimes(a, p)), a = p, d += 1;
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
    const n = re.fromDurationLike(e);
    if (!this.isValid || !n.isValid || n.as("milliseconds") === 0)
      return [];
    let { s: i } = this, a = 1, d;
    const f = [];
    for (; i < this.e; ) {
      const p = this.start.plus(n.mapUnits((y) => y * a));
      d = +p > +this.e ? this.e : p, f.push(le.fromDateTimes(i, d)), i = d, a += 1;
    }
    return f;
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
    const n = this.s > e.s ? this.s : e.s, i = this.e < e.e ? this.e : e.e;
    return n >= i ? null : le.fromDateTimes(n, i);
  }
  /**
   * Return an Interval representing the union of this Interval and the specified Interval.
   * Specifically, the resulting Interval has the minimum start time and the maximum end time of the two Intervals.
   * @param {Interval} other
   * @return {Interval}
   */
  union(e) {
    if (!this.isValid) return this;
    const n = this.s < e.s ? this.s : e.s, i = this.e > e.e ? this.e : e.e;
    return le.fromDateTimes(n, i);
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
    const [n, i] = e.sort((a, d) => a.s - d.s).reduce(
      ([a, d], f) => d ? d.overlaps(f) || d.abutsStart(f) ? [a, d.union(f)] : [a.concat([d]), f] : [a, f],
      [[], null]
    );
    return i && n.push(i), n;
  }
  /**
   * Return an array of Intervals representing the spans of time that only appear in one of the specified Intervals.
   * @param {Array} intervals
   * @return {Array}
   */
  static xor(e) {
    let n = null, i = 0;
    const a = [], d = e.map((y) => [
      { time: y.s, type: "s" },
      { time: y.e, type: "e" }
    ]), f = Array.prototype.concat(...d), p = f.sort((y, D) => y.time - D.time);
    for (const y of p)
      i += y.type === "s" ? 1 : -1, i === 1 ? n = y.time : (n && +n != +y.time && a.push(le.fromDateTimes(n, y.time)), n = null);
    return le.merge(a);
  }
  /**
   * Return an Interval representing the span of time in this Interval that doesn't overlap with any of the specified Intervals.
   * @param {...Interval} intervals
   * @return {Array}
   */
  difference(...e) {
    return le.xor([this].concat(e)).map((n) => this.intersection(n)).filter((n) => n && !n.isEmpty());
  }
  /**
   * Returns a string representation of this Interval appropriate for debugging.
   * @return {string}
   */
  toString() {
    return this.isValid ? `[${this.s.toISO()} – ${this.e.toISO()})` : Kt;
  }
  /**
   * Returns a string representation of this Interval appropriate for the REPL.
   * @return {string}
   */
  [/* @__PURE__ */ Symbol.for("nodejs.util.inspect.custom")]() {
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
  toLocaleString(e = Tn, n = {}) {
    return this.isValid ? xe.create(this.s.loc.clone(n), e).formatInterval(this) : Kt;
  }
  /**
   * Returns an ISO 8601-compliant string representation of this Interval.
   * @see https://en.wikipedia.org/wiki/ISO_8601#Time_intervals
   * @param {Object} opts - The same options as {@link DateTime#toISO}
   * @return {string}
   */
  toISO(e) {
    return this.isValid ? `${this.s.toISO(e)}/${this.e.toISO(e)}` : Kt;
  }
  /**
   * Returns an ISO 8601-compliant string representation of date of this Interval.
   * The time components are ignored.
   * @see https://en.wikipedia.org/wiki/ISO_8601#Time_intervals
   * @return {string}
   */
  toISODate() {
    return this.isValid ? `${this.s.toISODate()}/${this.e.toISODate()}` : Kt;
  }
  /**
   * Returns an ISO 8601-compliant string representation of time of this Interval.
   * The date components are ignored.
   * @see https://en.wikipedia.org/wiki/ISO_8601#Time_intervals
   * @param {Object} opts - The same options as {@link DateTime#toISO}
   * @return {string}
   */
  toISOTime(e) {
    return this.isValid ? `${this.s.toISOTime(e)}/${this.e.toISOTime(e)}` : Kt;
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
  toFormat(e, { separator: n = " – " } = {}) {
    return this.isValid ? `${this.s.toFormat(e)}${n}${this.e.toFormat(e)}` : Kt;
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
  toDuration(e, n) {
    return this.isValid ? this.e.diff(this.s, e, n) : re.invalid(this.invalidReason);
  }
  /**
   * Run mapFn on the interval start and end, returning a new Interval from the resulting DateTimes
   * @param {function} mapFn
   * @return {Interval}
   * @example Interval.fromDateTimes(dt1, dt2).mapEndpoints(endpoint => endpoint.toUTC())
   * @example Interval.fromDateTimes(dt1, dt2).mapEndpoints(endpoint => endpoint.plus({ hours: 2 }))
   */
  mapEndpoints(e) {
    return le.fromDateTimes(e(this.s), e(this.e));
  }
}
class mn {
  /**
   * Return whether the specified zone contains a DST.
   * @param {string|Zone} [zone='local'] - Zone to check. Defaults to the environment's local zone.
   * @return {boolean}
   */
  static hasDST(e = de.defaultZone) {
    const n = B.now().setZone(e).set({ month: 12 });
    return !e.isUniversal && n.offset !== n.set({ month: 6 }).offset;
  }
  /**
   * Return whether the specified zone is a valid IANA specifier.
   * @param {string} zone - Zone to check
   * @return {boolean}
   */
  static isValidIANAZone(e) {
    return He.isValidZone(e);
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
    return at(e, de.defaultZone);
  }
  /**
   * Get the weekday on which the week starts according to the given locale.
   * @param {Object} opts - options
   * @param {string} [opts.locale] - the locale code
   * @param {string} [opts.locObj=null] - an existing locale object to use
   * @returns {number} the start of the week, 1 for Monday through 7 for Sunday
   */
  static getStartOfWeek({ locale: e = null, locObj: n = null } = {}) {
    return (n || ie.create(e)).getStartOfWeek();
  }
  /**
   * Get the minimum number of days necessary in a week before it is considered part of the next year according
   * to the given locale.
   * @param {Object} opts - options
   * @param {string} [opts.locale] - the locale code
   * @param {string} [opts.locObj=null] - an existing locale object to use
   * @returns {number}
   */
  static getMinimumDaysInFirstWeek({ locale: e = null, locObj: n = null } = {}) {
    return (n || ie.create(e)).getMinDaysInFirstWeek();
  }
  /**
   * Get the weekdays, which are considered the weekend according to the given locale
   * @param {Object} opts - options
   * @param {string} [opts.locale] - the locale code
   * @param {string} [opts.locObj=null] - an existing locale object to use
   * @returns {number[]} an array of weekdays, 1 for Monday through 7 for Sunday
   */
  static getWeekendWeekdays({ locale: e = null, locObj: n = null } = {}) {
    return (n || ie.create(e)).getWeekendDays().slice();
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
  static months(e = "long", { locale: n = null, numberingSystem: i = null, locObj: a = null, outputCalendar: d = "gregory" } = {}) {
    return (a || ie.create(n, i, d)).months(e);
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
  static monthsFormat(e = "long", { locale: n = null, numberingSystem: i = null, locObj: a = null, outputCalendar: d = "gregory" } = {}) {
    return (a || ie.create(n, i, d)).months(e, !0);
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
  static weekdays(e = "long", { locale: n = null, numberingSystem: i = null, locObj: a = null } = {}) {
    return (a || ie.create(n, i, null)).weekdays(e);
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
  static weekdaysFormat(e = "long", { locale: n = null, numberingSystem: i = null, locObj: a = null } = {}) {
    return (a || ie.create(n, i, null)).weekdays(e, !0);
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
    return ie.create(e).meridiems();
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
  static eras(e = "short", { locale: n = null } = {}) {
    return ie.create(n, null, "gregory").eras(e);
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
    return { relative: Ia(), localeWeek: Ma() };
  }
}
function js(o, e) {
  const n = (a) => a.toUTC(0, { keepLocalTime: !0 }).startOf("day").valueOf(), i = n(e) - n(o);
  return Math.floor(re.fromMillis(i).as("days"));
}
function Xl(o, e, n) {
  const i = [
    ["years", (y, D) => D.year - y.year],
    ["quarters", (y, D) => D.quarter - y.quarter + (D.year - y.year) * 4],
    ["months", (y, D) => D.month - y.month + (D.year - y.year) * 12],
    [
      "weeks",
      (y, D) => {
        const F = js(y, D);
        return (F - F % 7) / 7;
      }
    ],
    ["days", js]
  ], a = {}, d = o;
  let f, p;
  for (const [y, D] of i)
    n.indexOf(y) >= 0 && (f = y, a[y] = D(o, e), p = d.plus(a), p > e ? (a[y]--, o = d.plus(a), o > e && (p = o, a[y]--, o = d.plus(a))) : o = p);
  return [o, a, p, f];
}
function ed(o, e, n, i) {
  let [a, d, f, p] = Xl(o, e, n);
  const y = e - a, D = n.filter(
    (j) => ["hours", "minutes", "seconds", "milliseconds"].indexOf(j) >= 0
  );
  D.length === 0 && (f < e && (f = a.plus({ [p]: 1 })), f !== a && (d[p] = (d[p] || 0) + y / (f - a)));
  const F = re.fromObject(d, i);
  return D.length > 0 ? re.fromMillis(y, i).shiftTo(...D).plus(F) : F;
}
const td = "missing Intl.DateTimeFormat.formatToParts support";
function oe(o, e = (n) => n) {
  return { regex: o, deser: ([n]) => e(Kc(n)) };
}
const rd = " ", Ja = `[ ${rd}]`, Qa = new RegExp(Ja, "g");
function nd(o) {
  return o.replace(/\./g, "\\.?").replace(Qa, Ja);
}
function Rs(o) {
  return o.replace(/\./g, "").replace(Qa, " ").toLowerCase();
}
function je(o, e) {
  return o === null ? null : {
    regex: RegExp(o.map(nd).join("|")),
    deser: ([n]) => o.findIndex((i) => Rs(n) === Rs(i)) + e
  };
}
function Fs(o, e) {
  return { regex: o, deser: ([, n, i]) => Fn(n, i), groups: e };
}
function yn(o) {
  return { regex: o, deser: ([e]) => e };
}
function od(o) {
  return o.replace(/[\-\[\]{}()*+?.,\\\^$|#\s]/g, "\\$&");
}
function id(o, e) {
  const n = Pe(e), i = Pe(e, "{2}"), a = Pe(e, "{3}"), d = Pe(e, "{4}"), f = Pe(e, "{6}"), p = Pe(e, "{1,2}"), y = Pe(e, "{1,3}"), D = Pe(e, "{1,6}"), F = Pe(e, "{1,9}"), j = Pe(e, "{2,4}"), Y = Pe(e, "{4,6}"), L = (Ce) => ({ regex: RegExp(od(Ce.val)), deser: ([Ye]) => Ye, literal: !0 }), me = ((Ce) => {
    if (o.literal)
      return L(Ce);
    switch (Ce.val) {
      // era
      case "G":
        return je(e.eras("short"), 0);
      case "GG":
        return je(e.eras("long"), 0);
      // years
      case "y":
        return oe(D);
      case "yy":
        return oe(j, Xo);
      case "yyyy":
        return oe(d);
      case "yyyyy":
        return oe(Y);
      case "yyyyyy":
        return oe(f);
      // months
      case "M":
        return oe(p);
      case "MM":
        return oe(i);
      case "MMM":
        return je(e.months("short", !0), 1);
      case "MMMM":
        return je(e.months("long", !0), 1);
      case "L":
        return oe(p);
      case "LL":
        return oe(i);
      case "LLL":
        return je(e.months("short", !1), 1);
      case "LLLL":
        return je(e.months("long", !1), 1);
      // dates
      case "d":
        return oe(p);
      case "dd":
        return oe(i);
      // ordinals
      case "o":
        return oe(y);
      case "ooo":
        return oe(a);
      // time
      case "HH":
        return oe(i);
      case "H":
        return oe(p);
      case "hh":
        return oe(i);
      case "h":
        return oe(p);
      case "mm":
        return oe(i);
      case "m":
        return oe(p);
      case "q":
        return oe(p);
      case "qq":
        return oe(i);
      case "s":
        return oe(p);
      case "ss":
        return oe(i);
      case "S":
        return oe(y);
      case "SSS":
        return oe(a);
      case "u":
        return yn(F);
      case "uu":
        return yn(p);
      case "uuu":
        return oe(n);
      // meridiem
      case "a":
        return je(e.meridiems(), 0);
      // weekYear (k)
      case "kkkk":
        return oe(d);
      case "kk":
        return oe(j, Xo);
      // weekNumber (W)
      case "W":
        return oe(p);
      case "WW":
        return oe(i);
      // weekdays
      case "E":
      case "c":
        return oe(n);
      case "EEE":
        return je(e.weekdays("short", !1), 1);
      case "EEEE":
        return je(e.weekdays("long", !1), 1);
      case "ccc":
        return je(e.weekdays("short", !0), 1);
      case "cccc":
        return je(e.weekdays("long", !0), 1);
      // offset/zone
      case "Z":
      case "ZZ":
        return Fs(new RegExp(`([+-]${p.source})(?::(${i.source}))?`), 2);
      case "ZZZ":
        return Fs(new RegExp(`([+-]${p.source})(${i.source})?`), 2);
      // we don't support ZZZZ (PST) or ZZZZZ (Pacific Standard Time) in parsing
      // because we don't have any way to figure out what they are
      case "z":
        return yn(/[a-z_+-/]{1,256}?/i);
      // this special-case "token" represents a place where a macro-token expanded into a white-space literal
      // in this case we accept any non-newline white-space
      case " ":
        return yn(/[^\S\n\r]/);
      default:
        return L(Ce);
    }
  })(o) || {
    invalidReason: td
  };
  return me.token = o, me;
}
const sd = {
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
function ad(o, e, n) {
  const { type: i, value: a } = o;
  if (i === "literal") {
    const y = /^\s+$/.test(a);
    return {
      literal: !y,
      val: y ? " " : a
    };
  }
  const d = e[i];
  let f = i;
  i === "hour" && (e.hour12 != null ? f = e.hour12 ? "hour12" : "hour24" : e.hourCycle != null ? e.hourCycle === "h11" || e.hourCycle === "h12" ? f = "hour12" : f = "hour24" : f = n.hour12 ? "hour12" : "hour24");
  let p = sd[f];
  if (typeof p == "object" && (p = p[d]), p)
    return {
      literal: !1,
      val: p
    };
}
function ud(o) {
  return [`^${o.map((n) => n.regex).reduce((n, i) => `${n}(${i.source})`, "")}$`, o];
}
function cd(o, e, n) {
  const i = o.match(e);
  if (i) {
    const a = {};
    let d = 1;
    for (const f in n)
      if (Xt(n, f)) {
        const p = n[f], y = p.groups ? p.groups + 1 : 1;
        !p.literal && p.token && (a[p.token.val[0]] = p.deser(i.slice(d, d + y))), d += y;
      }
    return [i, a];
  } else
    return [i, {}];
}
function ld(o) {
  const e = (d) => {
    switch (d) {
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
  let n = null, i;
  return H(o.z) || (n = He.create(o.z)), H(o.Z) || (n || (n = new Ee(o.Z)), i = o.Z), H(o.q) || (o.M = (o.q - 1) * 3 + 1), H(o.h) || (o.h < 12 && o.a === 1 ? o.h += 12 : o.h === 12 && o.a === 0 && (o.h = 0)), o.G === 0 && o.y && (o.y = -o.y), H(o.u) || (o.S = gi(o.u)), [Object.keys(o).reduce((d, f) => {
    const p = e(f);
    return p && (d[p] = o[f]), d;
  }, {}), n, i];
}
let Do = null;
function dd() {
  return Do || (Do = B.fromMillis(1555555555555)), Do;
}
function fd(o, e) {
  if (o.literal)
    return o;
  const n = xe.macroTokenToFormatOpts(o.val), i = ru(n, e);
  return i == null || i.includes(void 0) ? o : i;
}
function Xa(o, e) {
  return Array.prototype.concat(...o.map((n) => fd(n, e)));
}
class eu {
  constructor(e, n) {
    if (this.locale = e, this.format = n, this.tokens = Xa(xe.parseFormat(n), e), this.units = this.tokens.map((i) => id(i, e)), this.disqualifyingUnit = this.units.find((i) => i.invalidReason), !this.disqualifyingUnit) {
      const [i, a] = ud(this.units);
      this.regex = RegExp(i, "i"), this.handlers = a;
    }
  }
  explainFromTokens(e) {
    if (this.isValid) {
      const [n, i] = cd(e, this.regex, this.handlers), [a, d, f] = i ? ld(i) : [null, null, void 0];
      if (Xt(i, "a") && Xt(i, "H"))
        throw new Zt(
          "Can't include meridiem when specifying 24-hour format"
        );
      return {
        input: e,
        tokens: this.tokens,
        regex: this.regex,
        rawMatches: n,
        matches: i,
        result: a,
        zone: d,
        specificOffset: f
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
function tu(o, e, n) {
  return new eu(o, n).explainFromTokens(e);
}
function hd(o, e, n) {
  const { result: i, zone: a, specificOffset: d, invalidReason: f } = tu(o, e, n);
  return [i, a, d, f];
}
function ru(o, e) {
  if (!o)
    return null;
  const i = xe.create(e, o).dtFormatter(dd()), a = i.formatToParts(), d = i.resolvedOptions();
  return a.map((f) => ad(f, o, d));
}
const Io = "Invalid DateTime", Ws = 864e13;
function Sr(o) {
  return new Re("unsupported zone", `the zone "${o.name}" is not supported`);
}
function Mo(o) {
  return o.weekData === null && (o.weekData = $n(o.c)), o.weekData;
}
function No(o) {
  return o.localWeekData === null && (o.localWeekData = $n(
    o.c,
    o.loc.getMinDaysInFirstWeek(),
    o.loc.getStartOfWeek()
  )), o.localWeekData;
}
function Et(o, e) {
  const n = {
    ts: o.ts,
    zone: o.zone,
    c: o.c,
    o: o.o,
    loc: o.loc,
    invalid: o.invalid
  };
  return new B({ ...n, ...e, old: n });
}
function nu(o, e, n) {
  let i = o - e * 60 * 1e3;
  const a = n.offset(i);
  if (e === a)
    return [i, e];
  i -= (a - e) * 60 * 1e3;
  const d = n.offset(i);
  return a === d ? [i, a] : [o - Math.min(a, d) * 60 * 1e3, Math.max(a, d)];
}
function bn(o, e) {
  o += e * 60 * 1e3;
  const n = new Date(o);
  return {
    year: n.getUTCFullYear(),
    month: n.getUTCMonth() + 1,
    day: n.getUTCDate(),
    hour: n.getUTCHours(),
    minute: n.getUTCMinutes(),
    second: n.getUTCSeconds(),
    millisecond: n.getUTCMilliseconds()
  };
}
function _n(o, e, n) {
  return nu(Rn(o), e, n);
}
function qs(o, e) {
  const n = o.o, i = o.c.year + Math.trunc(e.years), a = o.c.month + Math.trunc(e.months) + Math.trunc(e.quarters) * 3, d = {
    ...o.c,
    year: i,
    month: a,
    day: Math.min(o.c.day, Cn(i, a)) + Math.trunc(e.days) + Math.trunc(e.weeks) * 7
  }, f = re.fromObject({
    years: e.years - Math.trunc(e.years),
    quarters: e.quarters - Math.trunc(e.quarters),
    months: e.months - Math.trunc(e.months),
    weeks: e.weeks - Math.trunc(e.weeks),
    days: e.days - Math.trunc(e.days),
    hours: e.hours,
    minutes: e.minutes,
    seconds: e.seconds,
    milliseconds: e.milliseconds
  }).as("milliseconds"), p = Rn(d);
  let [y, D] = nu(p, n, o.zone);
  return f !== 0 && (y += f, D = o.zone.offset(y)), { ts: y, o: D };
}
function Bt(o, e, n, i, a, d) {
  const { setZone: f, zone: p } = n;
  if (o && Object.keys(o).length !== 0 || e) {
    const y = e || p, D = B.fromObject(o, {
      ...n,
      zone: y,
      specificOffset: d
    });
    return f ? D : D.setZone(p);
  } else
    return B.invalid(
      new Re("unparsable", `the input "${a}" can't be parsed as ${i}`)
    );
}
function vn(o, e, n = !0) {
  return o.isValid ? xe.create(ie.create("en-US"), {
    allowZ: n,
    forceSimple: !0
  }).formatDateTimeFromString(o, e) : null;
}
function Po(o, e, n) {
  const i = o.c.year > 9999 || o.c.year < 0;
  let a = "";
  if (i && o.c.year >= 0 && (a += "+"), a += ge(o.c.year, i ? 6 : 4), n === "year") return a;
  if (e) {
    if (a += "-", a += ge(o.c.month), n === "month") return a;
    a += "-";
  } else if (a += ge(o.c.month), n === "month") return a;
  return a += ge(o.c.day), a;
}
function Vs(o, e, n, i, a, d, f) {
  let p = !n || o.c.millisecond !== 0 || o.c.second !== 0, y = "";
  switch (f) {
    case "day":
    case "month":
    case "year":
      break;
    default:
      if (y += ge(o.c.hour), f === "hour") break;
      if (e) {
        if (y += ":", y += ge(o.c.minute), f === "minute") break;
        p && (y += ":", y += ge(o.c.second));
      } else {
        if (y += ge(o.c.minute), f === "minute") break;
        p && (y += ge(o.c.second));
      }
      if (f === "second") break;
      p && (!i || o.c.millisecond !== 0) && (y += ".", y += ge(o.c.millisecond, 3));
  }
  return a && (o.isOffsetFixed && o.offset === 0 && !d ? y += "Z" : o.o < 0 ? (y += "-", y += ge(Math.trunc(-o.o / 60)), y += ":", y += ge(Math.trunc(-o.o % 60))) : (y += "+", y += ge(Math.trunc(o.o / 60)), y += ":", y += ge(Math.trunc(o.o % 60)))), d && (y += "[" + o.zone.ianaName + "]"), y;
}
const ou = {
  month: 1,
  day: 1,
  hour: 0,
  minute: 0,
  second: 0,
  millisecond: 0
}, pd = {
  weekNumber: 1,
  weekday: 1,
  hour: 0,
  minute: 0,
  second: 0,
  millisecond: 0
}, gd = {
  ordinal: 1,
  hour: 0,
  minute: 0,
  second: 0,
  millisecond: 0
}, xn = ["year", "month", "day", "hour", "minute", "second", "millisecond"], md = [
  "weekYear",
  "weekNumber",
  "weekday",
  "hour",
  "minute",
  "second",
  "millisecond"
], yd = ["year", "ordinal", "hour", "minute", "second", "millisecond"];
function Sn(o) {
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
  }[o.toLowerCase()];
  if (!e) throw new oa(o);
  return e;
}
function Us(o) {
  switch (o.toLowerCase()) {
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
      return Sn(o);
  }
}
function bd(o) {
  if (Or === void 0 && (Or = de.now()), o.type !== "iana")
    return o.offset(Or);
  const e = o.name;
  let n = ei.get(e);
  return n === void 0 && (n = o.offset(Or), ei.set(e, n)), n;
}
function Ls(o, e) {
  const n = at(e.zone, de.defaultZone);
  if (!n.isValid)
    return B.invalid(Sr(n));
  const i = ie.fromObject(e);
  let a, d;
  if (H(o.year))
    a = de.now();
  else {
    for (const y of xn)
      H(o[y]) && (o[y] = ou[y]);
    const f = Aa(o) || Da(o);
    if (f)
      return B.invalid(f);
    const p = bd(n);
    [a, d] = _n(o, p, n);
  }
  return new B({ ts: a, zone: n, loc: i, o: d });
}
function zs(o, e, n) {
  const i = H(n.round) ? !0 : n.round, a = H(n.rounding) ? "trunc" : n.rounding, d = (p, y) => (p = mi(p, i || n.calendary ? 0 : 2, n.calendary ? "round" : a), e.loc.clone(n).relFormatter(n).format(p, y)), f = (p) => n.calendary ? e.hasSame(o, p) ? 0 : e.startOf(p).diff(o.startOf(p), p).get(p) : e.diff(o, p).get(p);
  if (n.unit)
    return d(f(n.unit), n.unit);
  for (const p of n.units) {
    const y = f(p);
    if (Math.abs(y) >= 1)
      return d(y, p);
  }
  return d(o > e ? -0 : 0, n.units[n.units.length - 1]);
}
function Ks(o) {
  let e = {}, n;
  return o.length > 0 && typeof o[o.length - 1] == "object" ? (e = o[o.length - 1], n = Array.from(o).slice(0, o.length - 1)) : n = Array.from(o), [e, n];
}
let Or;
const ei = /* @__PURE__ */ new Map();
class B {
  /**
   * @access private
   */
  constructor(e) {
    const n = e.zone || de.defaultZone;
    let i = e.invalid || (Number.isNaN(e.ts) ? new Re("invalid input") : null) || (n.isValid ? null : Sr(n));
    this.ts = H(e.ts) ? de.now() : e.ts;
    let a = null, d = null;
    if (!i)
      if (e.old && e.old.ts === this.ts && e.old.zone.equals(n))
        [a, d] = [e.old.c, e.old.o];
      else {
        const p = ut(e.o) && !e.old ? e.o : n.offset(this.ts);
        a = bn(this.ts, p), i = Number.isNaN(a.year) ? new Re("invalid input") : null, a = i ? null : a, d = i ? null : p;
      }
    this._zone = n, this.loc = e.loc || ie.create(), this.invalid = i, this.weekData = null, this.localWeekData = null, this.c = a, this.o = d, this.isLuxonDateTime = !0;
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
    const [e, n] = Ks(arguments), [i, a, d, f, p, y, D] = n;
    return Ls({ year: i, month: a, day: d, hour: f, minute: p, second: y, millisecond: D }, e);
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
    const [e, n] = Ks(arguments), [i, a, d, f, p, y, D] = n;
    return e.zone = Ee.utcInstance, Ls({ year: i, month: a, day: d, hour: f, minute: p, second: y, millisecond: D }, e);
  }
  /**
   * Create a DateTime from a JavaScript Date object. Uses the default zone.
   * @param {Date} date - a JavaScript Date object
   * @param {Object} options - configuration options for the DateTime
   * @param {string|Zone} [options.zone='local'] - the zone to place the DateTime into
   * @return {DateTime}
   */
  static fromJSDate(e, n = {}) {
    const i = Gc(e) ? e.valueOf() : NaN;
    if (Number.isNaN(i))
      return B.invalid("invalid input");
    const a = at(n.zone, de.defaultZone);
    return a.isValid ? new B({
      ts: i,
      zone: a,
      loc: ie.fromObject(n)
    }) : B.invalid(Sr(a));
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
  static fromMillis(e, n = {}) {
    if (ut(e))
      return e < -Ws || e > Ws ? B.invalid("Timestamp out of range") : new B({
        ts: e,
        zone: at(n.zone, de.defaultZone),
        loc: ie.fromObject(n)
      });
    throw new _e(
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
  static fromSeconds(e, n = {}) {
    if (ut(e))
      return new B({
        ts: e * 1e3,
        zone: at(n.zone, de.defaultZone),
        loc: ie.fromObject(n)
      });
    throw new _e("fromSeconds requires a numerical input");
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
  static fromObject(e, n = {}) {
    e = e || {};
    const i = at(n.zone, de.defaultZone);
    if (!i.isValid)
      return B.invalid(Sr(i));
    const a = ie.fromObject(n), d = An(e, Us), { minDaysInFirstWeek: f, startOfWeek: p } = $s(d, a), y = de.now(), D = H(n.specificOffset) ? i.offset(y) : n.specificOffset, F = !H(d.ordinal), j = !H(d.year), Y = !H(d.month) || !H(d.day), L = j || Y, ee = d.weekYear || d.weekNumber;
    if ((L || F) && ee)
      throw new Zt(
        "Can't mix weekYear/weekNumber units with year/month/day or ordinals"
      );
    if (Y && F)
      throw new Zt("Can't mix ordinal dates with month/day");
    const me = ee || d.weekday && !L;
    let Ce, Ye, We = bn(y, D);
    me ? (Ce = md, Ye = pd, We = $n(We, f, p)) : F ? (Ce = yd, Ye = gd, We = Ao(We)) : (Ce = xn, Ye = ou);
    let or = !1;
    for (const Ge of Ce) {
      const Fr = d[Ge];
      H(Fr) ? or ? d[Ge] = Ye[Ge] : d[Ge] = We[Ge] : or = !0;
    }
    const ct = me ? Hc(d, f, p) : F ? Zc(d) : Aa(d), ir = ct || Da(d);
    if (ir)
      return B.invalid(ir);
    const Ne = me ? Es(d, f, p) : F ? Ts(d) : d, [Se, Rr] = _n(Ne, D, i), lt = new B({
      ts: Se,
      zone: i,
      o: Rr,
      loc: a
    });
    return d.weekday && L && e.weekday !== lt.weekday ? B.invalid(
      "mismatched weekday",
      `you can't specify both a weekday of ${d.weekday} and a date of ${lt.toISO()}`
    ) : lt.isValid ? lt : B.invalid(lt.invalid);
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
  static fromISO(e, n = {}) {
    const [i, a] = Wl(e);
    return Bt(i, a, n, "ISO 8601", e);
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
  static fromRFC2822(e, n = {}) {
    const [i, a] = ql(e);
    return Bt(i, a, n, "RFC 2822", e);
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
  static fromHTTP(e, n = {}) {
    const [i, a] = Vl(e);
    return Bt(i, a, n, "HTTP", n);
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
  static fromFormat(e, n, i = {}) {
    if (H(e) || H(n))
      throw new _e("fromFormat requires an input string and a format");
    const { locale: a = null, numberingSystem: d = null } = i, f = ie.fromOpts({
      locale: a,
      numberingSystem: d,
      defaultToEN: !0
    }), [p, y, D, F] = hd(f, e, n);
    return F ? B.invalid(F) : Bt(p, y, i, `format ${n}`, e, D);
  }
  /**
   * @deprecated use fromFormat instead
   */
  static fromString(e, n, i = {}) {
    return B.fromFormat(e, n, i);
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
  static fromSQL(e, n = {}) {
    const [i, a] = Zl(e);
    return Bt(i, a, n, "SQL", e);
  }
  /**
   * Create an invalid DateTime.
   * @param {string} reason - simple string of why this DateTime is invalid. Should not contain parameters or anything else data-dependent.
   * @param {string} [explanation=null] - longer explanation, may include parameters and other useful debugging information
   * @return {DateTime}
   */
  static invalid(e, n = null) {
    if (!e)
      throw new _e("need to specify a reason the DateTime is invalid");
    const i = e instanceof Re ? e : new Re(e, n);
    if (de.throwOnInvalid)
      throw new kc(i);
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
  static parseFormatForOpts(e, n = {}) {
    const i = ru(e, ie.fromObject(n));
    return i ? i.map((a) => a ? a.val : null).join("") : null;
  }
  /**
   * Produce the the fully expanded format token for the locale
   * Does NOT quote characters, so quoted tokens will not round trip correctly
   * @param fmt
   * @param localeOpts
   * @returns {string}
   */
  static expandFormat(e, n = {}) {
    return Xa(xe.parseFormat(e), ie.fromObject(n)).map((a) => a.val).join("");
  }
  static resetCache() {
    Or = void 0, ei.clear();
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
    return this.isValid ? Mo(this).weekYear : NaN;
  }
  /**
   * Get the week number of the week year (1-52ish).
   * @see https://en.wikipedia.org/wiki/ISO_week_date
   * @example DateTime.local(2017, 5, 25).weekNumber //=> 21
   * @type {number}
   */
  get weekNumber() {
    return this.isValid ? Mo(this).weekNumber : NaN;
  }
  /**
   * Get the day of the week.
   * 1 is Monday and 7 is Sunday
   * @see https://en.wikipedia.org/wiki/ISO_week_date
   * @example DateTime.local(2014, 11, 31).weekday //=> 4
   * @type {number}
   */
  get weekday() {
    return this.isValid ? Mo(this).weekday : NaN;
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
    return this.isValid ? No(this).weekday : NaN;
  }
  /**
   * Get the week number of the week year according to the locale. Different locales assign week numbers differently,
   * because the week can start on different days of the week (see localWeekday) and because a different number of days
   * is required for a week to count as the first week of a year.
   * @returns {number}
   */
  get localWeekNumber() {
    return this.isValid ? No(this).weekNumber : NaN;
  }
  /**
   * Get the week year according to the locale. Different locales assign week numbers (and therefor week years)
   * differently, see localWeekNumber.
   * @returns {number}
   */
  get localWeekYear() {
    return this.isValid ? No(this).weekYear : NaN;
  }
  /**
   * Get the ordinal (meaning the day of the year)
   * @example DateTime.local(2017, 5, 25).ordinal //=> 145
   * @type {number|DateTime}
   */
  get ordinal() {
    return this.isValid ? Ao(this.c).ordinal : NaN;
  }
  /**
   * Get the human readable short month name, such as 'Oct'.
   * Defaults to the system's locale if no locale has been specified
   * @example DateTime.local(2017, 10, 30).monthShort //=> Oct
   * @type {string}
   */
  get monthShort() {
    return this.isValid ? mn.months("short", { locObj: this.loc })[this.month - 1] : null;
  }
  /**
   * Get the human readable long month name, such as 'October'.
   * Defaults to the system's locale if no locale has been specified
   * @example DateTime.local(2017, 10, 30).monthLong //=> October
   * @type {string}
   */
  get monthLong() {
    return this.isValid ? mn.months("long", { locObj: this.loc })[this.month - 1] : null;
  }
  /**
   * Get the human readable short weekday, such as 'Mon'.
   * Defaults to the system's locale if no locale has been specified
   * @example DateTime.local(2017, 10, 30).weekdayShort //=> Mon
   * @type {string}
   */
  get weekdayShort() {
    return this.isValid ? mn.weekdays("short", { locObj: this.loc })[this.weekday - 1] : null;
  }
  /**
   * Get the human readable long weekday, such as 'Monday'.
   * Defaults to the system's locale if no locale has been specified
   * @example DateTime.local(2017, 10, 30).weekdayLong //=> Monday
   * @type {string}
   */
  get weekdayLong() {
    return this.isValid ? mn.weekdays("long", { locObj: this.loc })[this.weekday - 1] : null;
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
    const e = 864e5, n = 6e4, i = Rn(this.c), a = this.zone.offset(i - e), d = this.zone.offset(i + e), f = this.zone.offset(i - a * n), p = this.zone.offset(i - d * n);
    if (f === p)
      return [this];
    const y = i - f * n, D = i - p * n, F = bn(y, f), j = bn(D, p);
    return F.hour === j.hour && F.minute === j.minute && F.second === j.second && F.millisecond === j.millisecond ? [Et(this, { ts: y }), Et(this, { ts: D })] : [this];
  }
  /**
   * Returns true if this DateTime is in a leap year, false otherwise
   * @example DateTime.local(2016).isInLeapYear //=> true
   * @example DateTime.local(2013).isInLeapYear //=> false
   * @type {boolean}
   */
  get isInLeapYear() {
    return Nr(this.year);
  }
  /**
   * Returns the number of days in this DateTime's month
   * @example DateTime.local(2016, 2).daysInMonth //=> 29
   * @example DateTime.local(2016, 3).daysInMonth //=> 31
   * @type {number}
   */
  get daysInMonth() {
    return Cn(this.year, this.month);
  }
  /**
   * Returns the number of days in this DateTime's year
   * @example DateTime.local(2016).daysInYear //=> 366
   * @example DateTime.local(2013).daysInYear //=> 365
   * @type {number}
   */
  get daysInYear() {
    return this.isValid ? Yt(this.year) : NaN;
  }
  /**
   * Returns the number of weeks in this DateTime's year
   * @see https://en.wikipedia.org/wiki/ISO_week_date
   * @example DateTime.local(2004).weeksInWeekYear //=> 53
   * @example DateTime.local(2013).weeksInWeekYear //=> 52
   * @type {number}
   */
  get weeksInWeekYear() {
    return this.isValid ? Ar(this.weekYear) : NaN;
  }
  /**
   * Returns the number of weeks in this DateTime's local week year
   * @example DateTime.local(2020, 6, {locale: 'en-US'}).weeksInLocalWeekYear //=> 52
   * @example DateTime.local(2020, 6, {locale: 'de-DE'}).weeksInLocalWeekYear //=> 53
   * @type {number}
   */
  get weeksInLocalWeekYear() {
    return this.isValid ? Ar(
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
    const { locale: n, numberingSystem: i, calendar: a } = xe.create(
      this.loc.clone(e),
      e
    ).resolvedOptions(this);
    return { locale: n, numberingSystem: i, outputCalendar: a };
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
  toUTC(e = 0, n = {}) {
    return this.setZone(Ee.instance(e), n);
  }
  /**
   * "Set" the DateTime's zone to the host's local zone. Returns a newly-constructed DateTime.
   *
   * Equivalent to `setZone('local')`
   * @return {DateTime}
   */
  toLocal() {
    return this.setZone(de.defaultZone);
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
  setZone(e, { keepLocalTime: n = !1, keepCalendarTime: i = !1 } = {}) {
    if (e = at(e, de.defaultZone), e.equals(this.zone))
      return this;
    if (e.isValid) {
      let a = this.ts;
      if (n || i) {
        const d = e.offset(this.ts), f = this.toObject();
        [a] = _n(f, d, e);
      }
      return Et(this, { ts: a, zone: e });
    } else
      return B.invalid(Sr(e));
  }
  /**
   * "Set" the locale, numberingSystem, or outputCalendar. Returns a newly-constructed DateTime.
   * @param {Object} properties - the properties to set
   * @example DateTime.local(2017, 5, 25).reconfigure({ locale: 'en-GB' })
   * @return {DateTime}
   */
  reconfigure({ locale: e, numberingSystem: n, outputCalendar: i } = {}) {
    const a = this.loc.clone({ locale: e, numberingSystem: n, outputCalendar: i });
    return Et(this, { loc: a });
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
    const n = An(e, Us), { minDaysInFirstWeek: i, startOfWeek: a } = $s(n, this.loc), d = !H(n.weekYear) || !H(n.weekNumber) || !H(n.weekday), f = !H(n.ordinal), p = !H(n.year), y = !H(n.month) || !H(n.day), D = p || y, F = n.weekYear || n.weekNumber;
    if ((D || f) && F)
      throw new Zt(
        "Can't mix weekYear/weekNumber units with year/month/day or ordinals"
      );
    if (y && f)
      throw new Zt("Can't mix ordinal dates with month/day");
    let j;
    d ? j = Es(
      { ...$n(this.c, i, a), ...n },
      i,
      a
    ) : H(n.ordinal) ? (j = { ...this.toObject(), ...n }, H(n.day) && (j.day = Math.min(Cn(j.year, j.month), j.day))) : j = Ts({ ...Ao(this.c), ...n });
    const [Y, L] = _n(j, this.o, this.zone);
    return Et(this, { ts: Y, o: L });
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
    const n = re.fromDurationLike(e);
    return Et(this, qs(this, n));
  }
  /**
   * Subtract a period of time to this DateTime and return the resulting DateTime
   * See {@link DateTime#plus}
   * @param {Duration|Object|number} duration - The amount to subtract. Either a Luxon Duration, a number of milliseconds, the object argument to Duration.fromObject()
   @return {DateTime}
   */
  minus(e) {
    if (!this.isValid) return this;
    const n = re.fromDurationLike(e).negate();
    return Et(this, qs(this, n));
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
  startOf(e, { useLocaleWeeks: n = !1 } = {}) {
    if (!this.isValid) return this;
    const i = {}, a = re.normalizeUnit(e);
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
      if (n) {
        const d = this.loc.getStartOfWeek(), { weekday: f } = this;
        f < d && (i.weekNumber = this.weekNumber - 1), i.weekday = d;
      } else
        i.weekday = 1;
    if (a === "quarters") {
      const d = Math.ceil(this.month / 3);
      i.month = (d - 1) * 3 + 1;
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
  endOf(e, n) {
    return this.isValid ? this.plus({ [e]: 1 }).startOf(e, n).minus(1) : this;
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
  toFormat(e, n = {}) {
    return this.isValid ? xe.create(this.loc.redefaultToEN(n)).formatDateTimeFromString(this, e) : Io;
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
  toLocaleString(e = Tn, n = {}) {
    return this.isValid ? xe.create(this.loc.clone(n), e).formatDateTime(this) : Io;
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
    return this.isValid ? xe.create(this.loc.clone(e), e).formatDateTimeParts(this) : [];
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
    suppressSeconds: n = !1,
    suppressMilliseconds: i = !1,
    includeOffset: a = !0,
    extendedZone: d = !1,
    precision: f = "milliseconds"
  } = {}) {
    if (!this.isValid)
      return null;
    f = Sn(f);
    const p = e === "extended";
    let y = Po(this, p, f);
    return xn.indexOf(f) >= 3 && (y += "T"), y += Vs(
      this,
      p,
      n,
      i,
      a,
      d,
      f
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
  toISODate({ format: e = "extended", precision: n = "day" } = {}) {
    return this.isValid ? Po(this, e === "extended", Sn(n)) : null;
  }
  /**
   * Returns an ISO 8601-compliant string representation of this DateTime's week date
   * @example DateTime.utc(1982, 5, 25).toISOWeekDate() //=> '1982-W21-2'
   * @return {string}
   */
  toISOWeekDate() {
    return vn(this, "kkkk-'W'WW-c");
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
    suppressSeconds: n = !1,
    includeOffset: i = !0,
    includePrefix: a = !1,
    extendedZone: d = !1,
    format: f = "extended",
    precision: p = "milliseconds"
  } = {}) {
    return this.isValid ? (p = Sn(p), (a && xn.indexOf(p) >= 3 ? "T" : "") + Vs(
      this,
      f === "extended",
      n,
      e,
      i,
      d,
      p
    )) : null;
  }
  /**
   * Returns an RFC 2822-compatible string representation of this DateTime
   * @example DateTime.utc(2014, 7, 13).toRFC2822() //=> 'Sun, 13 Jul 2014 00:00:00 +0000'
   * @example DateTime.local(2014, 7, 13).toRFC2822() //=> 'Sun, 13 Jul 2014 00:00:00 -0400'
   * @return {string}
   */
  toRFC2822() {
    return vn(this, "EEE, dd LLL yyyy HH:mm:ss ZZZ", !1);
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
    return vn(this.toUTC(), "EEE, dd LLL yyyy HH:mm:ss 'GMT'");
  }
  /**
   * Returns a string representation of this DateTime appropriate for use in SQL Date
   * @example DateTime.utc(2014, 7, 13).toSQLDate() //=> '2014-07-13'
   * @return {string|null}
   */
  toSQLDate() {
    return this.isValid ? Po(this, !0) : null;
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
  toSQLTime({ includeOffset: e = !0, includeZone: n = !1, includeOffsetSpace: i = !0 } = {}) {
    let a = "HH:mm:ss.SSS";
    return (n || e) && (i && (a += " "), n ? a += "z" : e && (a += "ZZ")), vn(this, a, !0);
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
    return this.isValid ? this.toISO() : Io;
  }
  /**
   * Returns a string representation of this DateTime appropriate for the REPL.
   * @return {string}
   */
  [/* @__PURE__ */ Symbol.for("nodejs.util.inspect.custom")]() {
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
    const n = { ...this.c };
    return e.includeConfig && (n.outputCalendar = this.outputCalendar, n.numberingSystem = this.loc.numberingSystem, n.locale = this.loc.locale), n;
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
  diff(e, n = "milliseconds", i = {}) {
    if (!this.isValid || !e.isValid)
      return re.invalid("created by diffing an invalid DateTime");
    const a = { locale: this.locale, numberingSystem: this.numberingSystem, ...i }, d = Jc(n).map(re.normalizeUnit), f = e.valueOf() > this.valueOf(), p = f ? this : e, y = f ? e : this, D = ed(p, y, d, a);
    return f ? D.negate() : D;
  }
  /**
   * Return the difference between this DateTime and right now.
   * See {@link DateTime#diff}
   * @param {string|string[]} [unit=['milliseconds']] - the unit or units units (such as 'hours' or 'days') to include in the duration
   * @param {Object} opts - options that affect the creation of the Duration
   * @param {string} [opts.conversionAccuracy='casual'] - the conversion system to use
   * @return {Duration}
   */
  diffNow(e = "milliseconds", n = {}) {
    return this.diff(B.now(), e, n);
  }
  /**
   * Return an Interval spanning between this DateTime and another DateTime
   * @param {DateTime} otherDateTime - the other end point of the Interval
   * @return {Interval|DateTime}
   */
  until(e) {
    return this.isValid ? le.fromDateTimes(this, e) : this;
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
  hasSame(e, n, i) {
    if (!this.isValid) return !1;
    const a = e.valueOf(), d = this.setZone(e.zone, { keepLocalTime: !0 });
    return d.startOf(n, i) <= a && a <= d.endOf(n, i);
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
    const n = e.base || B.fromObject({}, { zone: this.zone }), i = e.padding ? this < n ? -e.padding : e.padding : 0;
    let a = ["years", "months", "days", "hours", "minutes", "seconds"], d = e.unit;
    return Array.isArray(e.unit) && (a = e.unit, d = void 0), zs(n, this.plus(i), {
      ...e,
      numeric: "always",
      units: a,
      unit: d
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
    return this.isValid ? zs(e.base || B.fromObject({}, { zone: this.zone }), this, {
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
      throw new _e("min requires all arguments be DateTimes");
    return Cs(e, (n) => n.valueOf(), Math.min);
  }
  /**
   * Return the max of several date times
   * @param {...DateTime} dateTimes - the DateTimes from which to choose the maximum
   * @return {DateTime} the max DateTime, or undefined if called with no argument
   */
  static max(...e) {
    if (!e.every(B.isDateTime))
      throw new _e("max requires all arguments be DateTimes");
    return Cs(e, (n) => n.valueOf(), Math.max);
  }
  // MISC
  /**
   * Explain how a string would be parsed by fromFormat()
   * @param {string} text - the string to parse
   * @param {string} fmt - the format the string is expected to be in (see description)
   * @param {Object} options - options taken by fromFormat()
   * @return {Object}
   */
  static fromFormatExplain(e, n, i = {}) {
    const { locale: a = null, numberingSystem: d = null } = i, f = ie.fromOpts({
      locale: a,
      numberingSystem: d,
      defaultToEN: !0
    });
    return tu(f, e, n);
  }
  /**
   * @deprecated use fromFormatExplain instead
   */
  static fromStringExplain(e, n, i = {}) {
    return B.fromFormatExplain(e, n, i);
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
  static buildFormatParser(e, n = {}) {
    const { locale: i = null, numberingSystem: a = null } = n, d = ie.fromOpts({
      locale: i,
      numberingSystem: a,
      defaultToEN: !0
    });
    return new eu(d, e);
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
  static fromFormatParser(e, n, i = {}) {
    if (H(e) || H(n))
      throw new _e(
        "fromFormatParser requires an input string and a format parser"
      );
    const { locale: a = null, numberingSystem: d = null } = i, f = ie.fromOpts({
      locale: a,
      numberingSystem: d,
      defaultToEN: !0
    });
    if (!f.equals(n.locale))
      throw new _e(
        `fromFormatParser called with a locale of ${f}, but the format parser was created for ${n.locale}`
      );
    const { result: p, zone: y, specificOffset: D, invalidReason: F } = n.explainFromTokens(e);
    return F ? B.invalid(F) : Bt(
      p,
      y,
      i,
      `format ${n.format}`,
      e,
      D
    );
  }
  // FORMAT PRESETS
  /**
   * {@link DateTime#toLocaleString} format like 10/14/1983
   * @type {Object}
   */
  static get DATE_SHORT() {
    return Tn;
  }
  /**
   * {@link DateTime#toLocaleString} format like 'Oct 14, 1983'
   * @type {Object}
   */
  static get DATE_MED() {
    return ia;
  }
  /**
   * {@link DateTime#toLocaleString} format like 'Fri, Oct 14, 1983'
   * @type {Object}
   */
  static get DATE_MED_WITH_WEEKDAY() {
    return Sc;
  }
  /**
   * {@link DateTime#toLocaleString} format like 'October 14, 1983'
   * @type {Object}
   */
  static get DATE_FULL() {
    return sa;
  }
  /**
   * {@link DateTime#toLocaleString} format like 'Tuesday, October 14, 1983'
   * @type {Object}
   */
  static get DATE_HUGE() {
    return aa;
  }
  /**
   * {@link DateTime#toLocaleString} format like '09:30 AM'. Only 12-hour if the locale is.
   * @type {Object}
   */
  static get TIME_SIMPLE() {
    return ua;
  }
  /**
   * {@link DateTime#toLocaleString} format like '09:30:23 AM'. Only 12-hour if the locale is.
   * @type {Object}
   */
  static get TIME_WITH_SECONDS() {
    return ca;
  }
  /**
   * {@link DateTime#toLocaleString} format like '09:30:23 AM EDT'. Only 12-hour if the locale is.
   * @type {Object}
   */
  static get TIME_WITH_SHORT_OFFSET() {
    return la;
  }
  /**
   * {@link DateTime#toLocaleString} format like '09:30:23 AM Eastern Daylight Time'. Only 12-hour if the locale is.
   * @type {Object}
   */
  static get TIME_WITH_LONG_OFFSET() {
    return da;
  }
  /**
   * {@link DateTime#toLocaleString} format like '09:30', always 24-hour.
   * @type {Object}
   */
  static get TIME_24_SIMPLE() {
    return fa;
  }
  /**
   * {@link DateTime#toLocaleString} format like '09:30:23', always 24-hour.
   * @type {Object}
   */
  static get TIME_24_WITH_SECONDS() {
    return ha;
  }
  /**
   * {@link DateTime#toLocaleString} format like '09:30:23 EDT', always 24-hour.
   * @type {Object}
   */
  static get TIME_24_WITH_SHORT_OFFSET() {
    return pa;
  }
  /**
   * {@link DateTime#toLocaleString} format like '09:30:23 Eastern Daylight Time', always 24-hour.
   * @type {Object}
   */
  static get TIME_24_WITH_LONG_OFFSET() {
    return ga;
  }
  /**
   * {@link DateTime#toLocaleString} format like '10/14/1983, 9:30 AM'. Only 12-hour if the locale is.
   * @type {Object}
   */
  static get DATETIME_SHORT() {
    return ma;
  }
  /**
   * {@link DateTime#toLocaleString} format like '10/14/1983, 9:30:33 AM'. Only 12-hour if the locale is.
   * @type {Object}
   */
  static get DATETIME_SHORT_WITH_SECONDS() {
    return ya;
  }
  /**
   * {@link DateTime#toLocaleString} format like 'Oct 14, 1983, 9:30 AM'. Only 12-hour if the locale is.
   * @type {Object}
   */
  static get DATETIME_MED() {
    return ba;
  }
  /**
   * {@link DateTime#toLocaleString} format like 'Oct 14, 1983, 9:30:33 AM'. Only 12-hour if the locale is.
   * @type {Object}
   */
  static get DATETIME_MED_WITH_SECONDS() {
    return va;
  }
  /**
   * {@link DateTime#toLocaleString} format like 'Fri, 14 Oct 1983, 9:30 AM'. Only 12-hour if the locale is.
   * @type {Object}
   */
  static get DATETIME_MED_WITH_WEEKDAY() {
    return Oc;
  }
  /**
   * {@link DateTime#toLocaleString} format like 'October 14, 1983, 9:30 AM EDT'. Only 12-hour if the locale is.
   * @type {Object}
   */
  static get DATETIME_FULL() {
    return wa;
  }
  /**
   * {@link DateTime#toLocaleString} format like 'October 14, 1983, 9:30:33 AM EDT'. Only 12-hour if the locale is.
   * @type {Object}
   */
  static get DATETIME_FULL_WITH_SECONDS() {
    return ka;
  }
  /**
   * {@link DateTime#toLocaleString} format like 'Friday, October 14, 1983, 9:30 AM Eastern Daylight Time'. Only 12-hour if the locale is.
   * @type {Object}
   */
  static get DATETIME_HUGE() {
    return _a;
  }
  /**
   * {@link DateTime#toLocaleString} format like 'Friday, October 14, 1983, 9:30:33 AM Eastern Daylight Time'. Only 12-hour if the locale is.
   * @type {Object}
   */
  static get DATETIME_HUGE_WITH_SECONDS() {
    return xa;
  }
}
function _r(o) {
  if (B.isDateTime(o))
    return o;
  if (o && o.valueOf && ut(o.valueOf()))
    return B.fromJSDate(o);
  if (o && typeof o == "object")
    return B.fromObject(o);
  throw new _e(
    `Unknown datetime argument: ${o}, of type ${typeof o}`
  );
}
class iu {
  constructor() {
    this.job_result = {}, this.job_progress = {}, this.actions = {};
  }
  from_dict(e) {
    return this.description = e.description, this.workstation_id = e.id, this.state_text = e.state_text, this.state_description = e.state_description, this.disabled = e.disabled, this.recording_group = e.recording_group ? e.recording_group : "unassigned", this.workstation_class = e.workstation_class, this.icon_code = "icon_code" in e ? e.icon_code : "", this.icon_url = "icon_url" in e ? e.icon_url : "", this.job_status = "job_status" in e ? e.job_status : "", this.job_status_code = "job_status_code" in e ? e.job_status_code : "", this.job_result = "job_result" in e ? e.job_result : "", this.job_progress = "job_progress" in e ? e.job_progress : {}, this.actions = "actions" in e ? e.actions : {}, this.meta = "meta" in e ? e.meta : {}, this;
  }
}
function jo(o, e) {
  kioskErrorToast(o, e);
}
function vd(o, e, n, i = {}, a = "") {
  kioskYesNoToast(o, e, n, i, a);
}
function wd(o, e) {
  kioskOpenModalDialog(o, e);
}
const Ro = "MSG_NETWORK_ERROR";
class kd {
  constructor(e, n, i = "") {
    this.messageId = e, this.headline = n, this.body = i;
  }
}
function Fo(o, e, n, i = "") {
  let a = new kd(
    e,
    n,
    i
  );
  o.dispatchEvent(new CustomEvent(
    "send-message",
    { bubbles: !0, composed: !0, detail: a }
  ));
}
const su = 1, ti = 20, _d = 21;
function au(o, e, n = "", i = null) {
  if (n && (n += ": "), e.response) {
    if (e.response.status == 403 || e.response.status == 401) {
      Fo(
        o,
        Ro,
        `${n}You are not logged in properly or your session has timed out`,
        '<a href="/logout">Please log in again.</a>'
      );
      return;
    }
    i ? i(e) : Fo(
      o,
      Ro,
      `${n}Kiosk server responded with an error.`,
      `(${e.response.statusText}). 
                The server might be down or perhaps you are not logged in properly.`
    );
  } else {
    Fo(
      o,
      Ro,
      `${n}Kiosk server responded with a network error.`,
      `(${e}). 
            The server might be down or perhaps you are not logged in properly.`
    );
    return;
  }
}
function xd(o) {
  window.location.href = o;
}
const Sd = '.col-bg-body-lighter{background-color:var(--col-bg-body-lighter)}.col-bg-body{background-color:var(--col-bg-body)}.col-bg-body-darker{background-color:var(--col-bg-body-darker)}.col-bg-1-lighter{background-color:var(--col-bg-1-lighter)}.col-bg-1{background-color:var(--col-bg-1)}.col-bg-1-darker{background-color:var(--col-bg-1-darker)}.col-bg-1-input{background-color:var(--col-bg-1-input)}.col-primary-bg-1{background-color:var(--col-primary-bg-1)}.col-accent-bg-1{background-color:var(--col-accent-bg-1)}.col-success-bg-1{background-color:var(--col-success-bg-1)}.col-warning-bg-1{background-color:var(--col-warning-bg-1)}.col-error-bg-1{background-color:var(--col-error-bg-1)}.col-bg-2-lighter{background-color:var(--col-bg-2-lighter)}.col-bg-2{background-color:var(--col-bg-2)}.col-bg-2-darker{background-color:var(--col-bg-2-darker)}.col-bg-2-button{background-color:var(--col-bg-2-button)}.col-bg-2-input{background-color:var(--col-bg-2-input)}.col-primary-bg-2{background-color:var(--col-primary-bg-2)}.col-accent-bg-2{background-color:var(--col-accent-bg-2)}.col-success-bg-2{background-color:var(--col-success-bg-2)}.col-warning-bg-2{background-color:var(--col-warning-bg-2)}.col-error-bg-2{background-color:var(--col-error-bg-2)}.col-bg-3-lighter{background-color:var(--col-bg-3-lighter)}.col-bg-3{background-color:var(--col-bg-3)}.col-bg-3-darker{background-color:var(--col-bg-3-darker)}.col-bg-3-button{background-color:var(--col-bg-3-button)}.col-bg-3-input{background-color:var(--col-bg-3-input)}.col-primary-bg-3{background-color:var(--col-primary-bg-3)}.col-accent-bg-3{background-color:var(--col-accent-bg-3)}.col-success-bg-3{background-color:var(--col-success-bg-3)}.col-warning-bg-3{background-color:var(--col-warning-bg-3)}.col-error-bg-3{background-color:var(--col-error-bg-3)}.col-bg-ack-lighter{background-color:var(--col-bg-ack-lighter)}.col-bg-ack{background-color:var(--col-bg-ack)}.col-bg-ack-darker{background-color:var(--col-bg-ack-darker)}.col-primary-bg-ack{background-color:var(--col-primary-bg-ack)}.col-accent-bg-ack{background-color:var(--col-accent-bg-ack)}.col-bg-att-lighter{background-color:var(--col-bg-att-lighter)}.col-bg-att{background-color:var(--col-bg-att)}.col-bg-att-darker{background-color:var(--col-bg-att-darker)}.col-primary-bg-att{background-color:var(--col-primary-bg-att)}.col-accent-bg-att{background-color:var(--col-accent-bg-att)}.col-bg-alert-lighter{background-color:var(--col-bg-alert-lighter)}.col-bg-alert{background-color:var(--col-bg-alert)}.col-bg-alert-darker{background-color:var(--col-bg-alert-darker)}.col-primary-bg-alert{background-color:var(--col-primary-bg-alert)}.col-accent-bg-alert{background-color:var(--col-accent-bg-alert)}.col-bg-btn-lighter{background-color:var(--col-bg-btn-lighter)}.col-bg-btn{background-color:var(--col-bg-btn)}.col-bg-btn-darker{background-color:var(--col-bg-btn-darker)}.col-primary-bg-btn{background-color:var(--col-primary-bg-btn)}.col-accent-bg-btn{background-color:var(--col-accent-bg-btn)}.pattern-diagonal-stripes-sm{background:repeating-linear-gradient(45deg,transparent,transparent 10px,currentColor 10px,currentColor 20px)}.pattern-dots-lg{background-image:radial-gradient(currentColor 1.5px,transparent 1.5px);background-size:15px 15px}.pattern-dots-md{background-image:radial-gradient(currentColor 1px,transparent 1px);background-size:8px 8px}.pattern-dots-medium-dense{background-image:radial-gradient(currentColor .5px,transparent .5px);background-size:3px 3px}.pattern-dots-sm{background-image:radial-gradient(currentColor .5px,transparent .5px);background-size:5px 5px}.pattern-cross-dots-md,.imagelist-background{background-image:radial-gradient(currentColor .7px,transparent 1px),radial-gradient(currentColor .7px,transparent 1px);background-size:6.5px 6.5px;background-position:0 0,3.5px 3.5px}.imagelist-background{background-color:#fff9;background-blend-mode:overlay}p,div{padding:0;margin:0;border:0px;user-select:text;-webkit-user-select:text}select{user-select:none;-webkit-user-select:none}.fa,.fas{font-family:"Font Awesome 5 Free";font-weight:900;font-style:normal}.fa-trash:before{content:""}.fa-view-grid:before{content:""}.fa-reload:before{content:""}.fa-view-list:before{content:""}.fa-camera:before{content:""}.fa-view-image:before{content:""}.fa-check:before{content:""}.fa-bug:before{content:""}.fa-lightbulb:before{content:""}p,div{-webkit-user-select:none;user-select:none}.workstation-card{background:linear-gradient(to right bottom,var(--col-bg-1-darker),var(--col-bg-1-lighter));font-family:var(--standard-text-font);padding:.5em;border:2px solid var(--col-bg-1-darker);border-radius:5px;box-shadow:3px 3px 4px -2px var(--col-bg-1-darker);cursor:pointer}.workstation-card:hover,.workstation-cardfocus{background:var(--col-bg-1-lighter);border:2px solid var(--col-bg-btn);box-shadow:0 0 6px 1px var(--col-bg-btn)}.workstation-card:active{background:var(--col-bg-1-darker);border:2px solid var(--col-bg-body);box-shadow:0 0 6px 1px var(--col-bg-body)}.workstation-card.workstation-disabled{opacity:.75}.card-header{display:flex;flex-direction:row;align-items:center;padding:.25em;margin-bottom:.25em;background-color:var(--col-bg-1-darker)}.card-icon{font-size:32px;line-height:36px;color:var(--col-primary-bg-1);width:36px;height:36px}.title{margin-left:1em;font-weight:700;color:var(--col-primary-bg-1);display:flex;flex-direction:row;justify-content:space-between;width:100%;white-space:pre-wrap}.title span{display:block}.title span:nth-child(1){color:var(--col-accent-bg-1)}.title span:nth-child(2){padding-right:.5em}.title-state{background-color:var(--col-bg-ack);color:var(--col-primary-bg-ack);text-align:center;padding:.25em 0}.title-state.processing{background-color:var(--col-bg-att);color:var(--col-primary-bg-att)}.title-state.error{background-color:var(--col-bg-alert);color:var(--col-primary-bg-alert)}.kiosk-btn{border-radius:5px;border-style:solid;border-width:2px;background-color:var(--col-bg-btn);color:var(--col-primary-bg-btn);border-color:var(--col-bg-btn-darker);cursor:pointer;white-space:nowrap}.kiosk-btn:hover,.kiosk-btn:focus{outline:none;background-color:var(--col-bg-btn-lighter)}.kiosk-btn:active{margin-bottom:0;margin-top:2px;padding-left:2px;color:var(--col-primary-bg-btn);background-color:var(--col-bg-ack);border-color:var(--col-bg-ack-darker)}.kiosk-btn *{user-select:none;-moz-user-select:none;-webkit-user-select:none}.card-body{display:flex;flex-direction:row;margin-top:.5em}@media only screen and (max-width:900px){.card-body{flex-direction:column}}.card-body .ws-info{display:flex;flex-direction:column;justify-content:center;height:100%}.card-body .ws-info>div{text-align:center}.card-body .job-info{display:flex;flex-direction:row;align-items:center;margin-left:.25em;min-height:3em}@media only screen and (max-width:900px){.card-body .job-info{margin-top:.25em;margin-left:0}}.card-body .job-info.error{font-size:1em}.card-body .job-info i{margin-right:.5em;margin-left:.2em;font-size:1.5em;color:var(--col-accent-bg-btn)}sl-progress-ring{min-width:48px;height:48px;align-self:center;margin-left:.5em;margin-right:.5em}.card-body>div{background-color:var(--col-bg-2);padding:.25em;min-height:3em;flex-basis:100%}.job-warnings{display:flex;flex-direction:row;align-items:center;justify-content:space-between;color:var(--col-accent-bg-2);text-align:left}.job-warnings p{width:100%;text-align:center}.job-warnings button{width:auto;padding-right:.5em}.spacer{width:100%;height:2px;background-color:var(--col-bg-1);margin:.5em 0}.job-cancelled-label{color:var(--col-error-bg-2)}', Od = ":host{--track-color: var(--col-bg-2-lighter);--indicator-color: var(--col-accent-bg-2);--stroke-width: 6px;display:inline-flex}.progress-ring{display:inline-flex;align-items:center;justify-content:center;position:relative}.progress-ring__image{transform-origin:50% 50%}.progress-ring__track{stroke:var(--track-color)}.progress-ring__indicator{stroke:var(--indicator-color);transition:.35s stroke-dashoffset,.35s stroke}.progress-ring__label{display:flex;align-items:center;justify-content:center;position:absolute;top:0;left:0;width:100%;font-size:.9em;text-align:center;-webkit-user-select:none;user-select:none}.spinner{display:inline-block;width:100%;border-radius:50%;border:solid var(--stroke-width) var(--col-bg-2-lighter);border-top-color:var(--col-accent-bg-2);border-right-color:var(--col-accent-bg-2);animation:1s linear infinite spin}@keyframes spin{0%{transform:rotate(0)}to{transform:rotate(360deg)}}";
var Ed = Object.defineProperty, Td = Object.getOwnPropertyDescriptor, It = (o, e, n, i) => {
  for (var a = i > 1 ? void 0 : i ? Td(e, n) : e, d = o.length - 1, f; d >= 0; d--)
    (f = o[d]) && (a = (i ? f(e, n, a) : f(a)) || a);
  return i && a && Ed(e, n, a), a;
};
let Ze = class extends Ct {
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
      const e = this.indicator.r.baseVal.value * 2 * Math.PI, n = e - this.percentage / 100 * e;
      this.ring.style.transform = `rotate(-90deg) translateY(-${this.strokeWidth / 2}px)`, this.label.style.transform = `rotate(90deg) translateX(${this.strokeWidth * 2}px)`, this.indicator.style.strokeDasharray = `${e} ${e}`, this.indicator.style.strokeDashoffset = `${n}`;
    }
  }
  render() {
    return this.percentage == -1 ? J` <span class="spinner" aria-busy="true" aria-live="polite"></span> ` : J`
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
Ze.styles = Dr(Od);
It([
  di(".progress-ring")
], Ze.prototype, "ring", 2);
It([
  di(".progress-ring__indicator")
], Ze.prototype, "indicator", 2);
It([
  di(".progress-ring__label")
], Ze.prototype, "label", 2);
It([
  Ir({ type: Number })
], Ze.prototype, "size", 2);
It([
  Ir({ attribute: "stroke-width", type: Number })
], Ze.prototype, "strokeWidth", 2);
It([
  Ir({ type: Number, reflect: !0 })
], Ze.prototype, "percentage", 2);
Ze = It([
  li("sl-progress-ring")
], Ze);
var $d = Object.getOwnPropertyDescriptor, Cd = (o, e, n, i) => {
  for (var a = i > 1 ? void 0 : i ? $d(e, n) : e, d = o.length - 1, f; d >= 0; d--)
    (f = o[d]) && (a = f(a) || a);
  return a;
};
let ri = class extends Nn {
  constructor() {
    super(), this.fetching = !1, this.fetch_error = "", this.workstation_data = new iu(), this.percentage = -1, this.showJobInfo = !1, this.jobMessage = "", this.jobError = "", this.jobHasWarnings = !1, this.jobAsksToShowLog = !1, this.jobIsRunning = !1, this.jobGotCanceled = !1, this._init();
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
  cardClicked(o) {
    if (this.jobIsRunning)
      this.askCancelJob();
    else {
      let e = this.apiContext.getKioskRoute(
        `${this.workstation_data.workstation_class.toLowerCase()}.workstation_actions`
      );
      wd(`${e}/${this.workstation_id}`, {
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
            $.magnificPopup.close(), jo(
              'Sorry, there is no access to the actions panel of this workstation. Presumably your session has timed out <a href="/logout">Try a fresh log in.</a>'
            );
          }
        }
      });
    }
  }
  showLog(o) {
    o.stopPropagation(), xd(this.workstation_data.actions.log);
  }
  apiRender() {
    return this._calc_job_progress(), J`
            <div
                id="${this.workstation_id}"
                class="workstation-card ${this.workstation_data.disabled ? "workstation-disabled" : void 0}"
                @click="${this.cardClicked}">
                <div class="card-header">
                    ${this.workstation_data.icon_code ? J` <div class="card-icon">
                              <i class="fas">${this.workstation_data.icon_code}</i>
                          </div>` : this.workstation_data.icon_url ? J` <div
                              class="card-icon"
                              style="background-image:url(${this.workstation_data.icon_url})"
                          ></div>` : J` <div class="card-icon">
                              <i class="fas"></i>
                          </div>`}

                    <div class="title">
                        <span>${this.workstation_data.description}</span>
                        <span>[${this.workstation_id}]</span>
                    </div>
                </div>
                ${this.showJobInfo && !this.jobHasWarnings && !this.jobAsksToShowLog || this.jobError ? J`
                          ${this.jobError ? J` <div class="title-state error">${this.jobError}</div>` : J` <div class="title-state processing">
                                    ${this.workstation_data.job_status_code == su ? "pending..." : "processing..."}
                                </div>`}
                      ` : J` <div class="title-state">${this.workstation_data.state_text}</div>`}

                <div class="card-body">
                    ${this.jobIsRunning ? void 0 : J` <div class="ws-info">
                              <div class="job-warnings">
                                  ${this.jobHasWarnings ? J`<p>The last task was successful but returned warnings</p>` : J`${this.jobGotCanceled ? J`<p>
                                                  <span class="job-cancelled-label">The last task got canceled</span>
                                              </p>` : void 0}`}
                                  ${this.jobError || this.jobAsksToShowLog ? J`<p>There is more information available.</p>` : void 0}
                                  ${this.jobError || this.jobHasWarnings || this.jobAsksToShowLog ? J` <button @click=${this.showLog} class="kiosk-btn job-info error">
                                            <i class="fas fa-bug"></i>
                                            <div>See details</div>
                                        </button>` : void 0}
                              </div>
                              ${this.jobError || this.jobHasWarnings ? J` <div class="spacer"></div>` : void 0}
                              <div>
                                  ${this.workstation_data.disabled ? J`This workstation is disabled. Please click to reactivate it.` : J`${this.workstation_data.state_description}`}
                              </div>
                          </div>`}
                    ${this.showJobInfo && !this.jobError && !this.jobHasWarnings && !this.jobAsksToShowLog ? J` <div class="job-info">
                              <sl-progress-ring percentage="${this.percentage}" size="54" stroke-width="6">
                                  ${this.percentage > 0 ? J`${this.percentage}%` : void 0}
                              </sl-progress-ring>
                              <div>${this.jobMessage}</div>
                          </div>` : void 0}
                </div>
            </div>
        `;
  }
  _calc_job_progress() {
    const o = this.workstation_data.job_progress;
    this.jobError = "", this.jobHasWarnings = !1, this.jobGotCanceled = !1, "job_status_code" in this.workstation_data && this.workstation_data.job_status_code ? this.workstation_data.job_status_code < ti ? (this.showJobInfo = !0, "progress" in o && o.progress ? (this.percentage = o.progress, this.jobMessage = o.message) : (this.percentage = -1, this.jobMessage = o.message), this.jobIsRunning = !0) : (this.jobIsRunning = !1, "success" in this.workstation_data.job_result ? this.workstation_data.job_result.success ? (this.percentage = 100, this.jobMessage = "finished", this.workstation_data.job_result.has_warnings && (this.jobHasWarnings = !0), this.jobAsksToShowLog = this.workstation_data.job_result.show_details ?? !1, this.showJobInfo = this.jobHasWarnings || this.jobAsksToShowLog) : (this.percentage = o.progress, this.jobMessage = "click to see details", this.showJobInfo = !0, this.jobError = this.workstation_data.job_result.message) : this.workstation_data.job_status_code == _d ? (this.percentage = 0, this.showJobInfo = !1, this.jobIsRunning = !1, this.jobGotCanceled = !0) : (this.percentage = o.progress, this.jobMessage = this.workstation_data.job_result.message)) : (this.percentage = 0, this.showJobInfo = !1, this.jobMessage = "", this.jobIsRunning = !1);
  }
  askCancelJob() {
    vd(
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
    }).then((o) => {
      o.result_msg !== "ok" && jo(`It was not possible to cancel the job: <strong>${o.result_msg}</strong>`), this.triggerReloadWorkstations();
    }).catch((o) => {
      au(this, o, "workstationlist.fetchWorkstations", () => {
        jo(`It was not possible to cancel the job because of an error ${o}.`);
      });
    });
  }
  // onAfterEnter(location: any, commands: any, router: any) {
  //     console.log("OnAfterEnter", location, commands, router);
  //     // this._installSyncEvents();
  // }
};
ri.styles = Dr(Sd);
ri = Cd([
  li("workstation-card")
], ri);
const Ad = '.col-bg-body-lighter{background-color:var(--col-bg-body-lighter)}.col-bg-body{background-color:var(--col-bg-body)}.col-bg-body-darker{background-color:var(--col-bg-body-darker)}.col-bg-1-lighter{background-color:var(--col-bg-1-lighter)}.col-bg-1{background-color:var(--col-bg-1)}.col-bg-1-darker{background-color:var(--col-bg-1-darker)}.col-bg-1-input{background-color:var(--col-bg-1-input)}.col-primary-bg-1{background-color:var(--col-primary-bg-1)}.col-accent-bg-1{background-color:var(--col-accent-bg-1)}.col-success-bg-1{background-color:var(--col-success-bg-1)}.col-warning-bg-1{background-color:var(--col-warning-bg-1)}.col-error-bg-1{background-color:var(--col-error-bg-1)}.col-bg-2-lighter{background-color:var(--col-bg-2-lighter)}.col-bg-2{background-color:var(--col-bg-2)}.col-bg-2-darker{background-color:var(--col-bg-2-darker)}.col-bg-2-button{background-color:var(--col-bg-2-button)}.col-bg-2-input{background-color:var(--col-bg-2-input)}.col-primary-bg-2{background-color:var(--col-primary-bg-2)}.col-accent-bg-2{background-color:var(--col-accent-bg-2)}.col-success-bg-2{background-color:var(--col-success-bg-2)}.col-warning-bg-2{background-color:var(--col-warning-bg-2)}.col-error-bg-2{background-color:var(--col-error-bg-2)}.col-bg-3-lighter{background-color:var(--col-bg-3-lighter)}.col-bg-3{background-color:var(--col-bg-3)}.col-bg-3-darker{background-color:var(--col-bg-3-darker)}.col-bg-3-button{background-color:var(--col-bg-3-button)}.col-bg-3-input{background-color:var(--col-bg-3-input)}.col-primary-bg-3{background-color:var(--col-primary-bg-3)}.col-accent-bg-3{background-color:var(--col-accent-bg-3)}.col-success-bg-3{background-color:var(--col-success-bg-3)}.col-warning-bg-3{background-color:var(--col-warning-bg-3)}.col-error-bg-3{background-color:var(--col-error-bg-3)}.col-bg-ack-lighter{background-color:var(--col-bg-ack-lighter)}.col-bg-ack{background-color:var(--col-bg-ack)}.col-bg-ack-darker{background-color:var(--col-bg-ack-darker)}.col-primary-bg-ack{background-color:var(--col-primary-bg-ack)}.col-accent-bg-ack{background-color:var(--col-accent-bg-ack)}.col-bg-att-lighter{background-color:var(--col-bg-att-lighter)}.col-bg-att{background-color:var(--col-bg-att)}.col-bg-att-darker{background-color:var(--col-bg-att-darker)}.col-primary-bg-att{background-color:var(--col-primary-bg-att)}.col-accent-bg-att{background-color:var(--col-accent-bg-att)}.col-bg-alert-lighter{background-color:var(--col-bg-alert-lighter)}.col-bg-alert{background-color:var(--col-bg-alert)}.col-bg-alert-darker{background-color:var(--col-bg-alert-darker)}.col-primary-bg-alert{background-color:var(--col-primary-bg-alert)}.col-accent-bg-alert{background-color:var(--col-accent-bg-alert)}.col-bg-btn-lighter{background-color:var(--col-bg-btn-lighter)}.col-bg-btn{background-color:var(--col-bg-btn)}.col-bg-btn-darker{background-color:var(--col-bg-btn-darker)}.col-primary-bg-btn{background-color:var(--col-primary-bg-btn)}.col-accent-bg-btn{background-color:var(--col-accent-bg-btn)}.pattern-diagonal-stripes-sm,.recording-group-background{background:repeating-linear-gradient(45deg,transparent,transparent 10px,currentColor 10px,currentColor 20px)}.pattern-dots-lg{background-image:radial-gradient(currentColor 1.5px,transparent 1.5px);background-size:15px 15px}.pattern-dots-md{background-image:radial-gradient(currentColor 1px,transparent 1px);background-size:8px 8px}.pattern-dots-medium-dense{background-image:radial-gradient(currentColor .5px,transparent .5px);background-size:3px 3px}.pattern-dots-sm{background-image:radial-gradient(currentColor .5px,transparent .5px);background-size:5px 5px}.pattern-cross-dots-md,.imagelist-background{background-image:radial-gradient(currentColor .7px,transparent 1px),radial-gradient(currentColor .7px,transparent 1px);background-size:6.5px 6.5px;background-position:0 0,3.5px 3.5px}.imagelist-background{background-color:#fff9;background-blend-mode:overlay}.fa,.fas{font-family:"Font Awesome 5 Free";font-weight:900;font-style:normal}.fa-trash:before{content:""}.fa-view-grid:before{content:""}.fa-reload:before{content:""}.fa-view-list:before{content:""}.fa-camera:before{content:""}.fa-view-image:before{content:""}.fa-check:before{content:""}.fa-bug:before{content:""}.fa-lightbulb:before{content:""}p,div{padding:0;margin:0;border:0px;user-select:text;-webkit-user-select:text}select{user-select:none;-webkit-user-select:none}.kiosk-btn{display:grid;place-content:center;border-radius:5px;border-style:solid;border-width:2px;background:var(--col-bg-btn);color:var(--col-primary-bg-btn);border-color:var(--col-bg-btn-darker);cursor:pointer;white-space:nowrap}.kiosk-btn:hover,.kiosk-btn:focus{outline:none;background-color:var(--col-bg-btn-lighter)}.kiosk-btn:active{margin-bottom:0;margin-top:2px;padding-left:2px;color:var(--col-primary-bg-btn);background-color:var(--col-bg-ack);border-color:var(--col-bg-ack-darker)}.kiosk-btn *{user-select:none;-moz-user-select:none;-webkit-user-select:none}.recording-group{display:block;flex-direction:column;margin:1em .5em 2em 0}.recording-group-header{width:20ch;border-top-right-radius:15px;background:linear-gradient(to right bottom,var(--col-bg-1-darker),var(--col-bg-1-lighter));background-color:#ffffffe6;background-blend-mode:color;padding:5px;font-weight:700}.recording-group-body{position:relative;display:grid;grid-template-columns:1fr 1fr;column-gap:1em;row-gap:1em;padding:1em}@media only screen and (max-width:700px){.recording-group-body{grid-template-columns:1fr}}.recording-group-background{position:absolute;width:100%;height:100%;border-radius:15px;color:var(--col-bg-1);opacity:10%;z-index:-1}.one-recording-group{display:grid;grid-template-columns:1fr 1fr;column-gap:1em;row-gap:1em;padding:1em}@media only screen and (max-width:700px){.one-recording-group{grid-template-columns:1fr}}.synchronization-running{height:80vh;width:100%;display:grid;place-items:center;position:fixed;background:var(--col-bg-body)}.synchronization-running .synchronization-reminder{padding:1.5em}.synchronization-reminder{background-color:var(--col-bg-att);border:1px solid var(--col-bg-att-darker);padding:.5em;margin:.5em 0;display:flex}.synchronization-reminder p{padding-left:1em}.synchronization-reminder i{font-size:1.2em}';
var Dd = Object.getOwnPropertyDescriptor, Id = (o, e, n, i) => {
  for (var a = i > 1 ? void 0 : i ? Dd(e, n) : e, d = o.length - 1, f; d >= 0; d--)
    (f = o[d]) && (a = f(a) || a);
  return a;
};
let ni = class extends Nn {
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
    ).then((o) => {
      if (o.result_msg !== "ok")
        this.fetch_error = o.result_msg;
      else {
        this.fetch_error = "";
        try {
          this.processData(o.workstations);
        } finally {
          let e = o.poll_delay;
          this.timeoutId = setTimeout(this.fetchWorkstations.bind(this), e * 1e3), this.sync_status = o.sync_status, this.last_sync_date = o.last_sync_ts ? o.last_sync_ts : "", this.reportLastSyncDate();
        }
      }
      this.fetching = !1;
    }).catch((o) => {
      au(this, o, "workstationlist.fetchWorkstations", null);
    });
  }
  processData(o) {
    let e = {};
    o.forEach((n) => {
      let i = new iu();
      i.from_dict(n), (i.description || i.job_status_code != ti) && (e[i.workstation_id] = i);
    }), this.workstations = e;
  }
  reportLastSyncDate() {
    this.dispatchEvent(new CustomEvent(
      "syncmanagerinfo",
      { bubbles: !0, composed: !0, detail: this.last_sync_date }
    ));
  }
  firstUpdated(o) {
    super.firstUpdated(o), this.shadowRoot.addEventListener("fetch-workstations", (function() {
      this.fetchWorkstations();
    }).bind(this)), this.fetchWorkstations();
  }
  updated(o) {
    super.updated(o);
  }
  stopFetching() {
    this.fetchingStopped = !0;
  }
  getRecordingGroups() {
    let o = {};
    return Object.values(this.workstations).map((e) => {
      e.recording_group in o || (o[e.recording_group] = []), o[e.recording_group].push(e.workstation_id);
    }), o;
  }
  renderWorkstationCards(o) {
    return J`${o.map(
      (e) => J`
                        <workstation-card
                                .apiContext="${this.apiContext}"
                                .workstation_id="${e}"
                                .workstation_data="${this.workstations[e]}">
                        </workstation-card>
                    `
    )}`;
  }
  renderSynchronizationRunning() {
    return J`
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
    const o = this.getRecordingGroups(), e = Object.keys(o);
    return this.sync_status >= su && this.sync_status < ti ? this.renderSynchronizationRunning() : J`
                ${void 0}
                ${this.sync_status != -1 ? J`
                        <div class="synchronization-reminder">
                            <i class="fas fa-lightbulb"></i><p>The recently started synchronization has ended.</p> 
                            <p><a href="${this.apiContext.getKioskRoute("syncmanager.synchronization_progress")}">
                                Click here to see the results.</a></p>  
                        </div>
                    ` : void 0}
                ${e.length > 1 ? J`${e.map(
      (n) => J`
                                    <div id="${n}" class="recording-group">
                                        <div class="recording-group-header">${n}</div>
                                        <div class="recording-group-body">
                                            <div class="recording-group-background">
                                            </div>
                                            ${this.renderWorkstationCards(o[n])}
                                        </div>
                                    </div>`
    )}` : J`
                            <div class="one-recording-group">
                                ${e.length > 0 ? J`${this.renderWorkstationCards(o[e[0]])}` : void 0}
                            </div>
                        `}
            `;
  }
  // onAfterEnter(location: any, commands: any, router: any) {
  //     console.log("OnAfterEnter", location, commands, router);
  //     // this._installSyncEvents();
  // }
};
ni.styles = Dr(Ad);
ni = Id([
  li("workstation-list")
], ni);
const Md = '.col-bg-body-lighter{background-color:var(--col-bg-body-lighter)}.col-bg-body{background-color:var(--col-bg-body)}.col-bg-body-darker{background-color:var(--col-bg-body-darker)}.col-bg-1-lighter{background-color:var(--col-bg-1-lighter)}.col-bg-1{background-color:var(--col-bg-1)}.col-bg-1-darker{background-color:var(--col-bg-1-darker)}.col-bg-1-input{background-color:var(--col-bg-1-input)}.col-primary-bg-1{background-color:var(--col-primary-bg-1)}.col-accent-bg-1{background-color:var(--col-accent-bg-1)}.col-success-bg-1{background-color:var(--col-success-bg-1)}.col-warning-bg-1{background-color:var(--col-warning-bg-1)}.col-error-bg-1{background-color:var(--col-error-bg-1)}.col-bg-2-lighter{background-color:var(--col-bg-2-lighter)}.col-bg-2{background-color:var(--col-bg-2)}.col-bg-2-darker{background-color:var(--col-bg-2-darker)}.col-bg-2-button{background-color:var(--col-bg-2-button)}.col-bg-2-input{background-color:var(--col-bg-2-input)}.col-primary-bg-2{background-color:var(--col-primary-bg-2)}.col-accent-bg-2{background-color:var(--col-accent-bg-2)}.col-success-bg-2{background-color:var(--col-success-bg-2)}.col-warning-bg-2{background-color:var(--col-warning-bg-2)}.col-error-bg-2{background-color:var(--col-error-bg-2)}.col-bg-3-lighter{background-color:var(--col-bg-3-lighter)}.col-bg-3{background-color:var(--col-bg-3)}.col-bg-3-darker{background-color:var(--col-bg-3-darker)}.col-bg-3-button{background-color:var(--col-bg-3-button)}.col-bg-3-input{background-color:var(--col-bg-3-input)}.col-primary-bg-3{background-color:var(--col-primary-bg-3)}.col-accent-bg-3{background-color:var(--col-accent-bg-3)}.col-success-bg-3{background-color:var(--col-success-bg-3)}.col-warning-bg-3{background-color:var(--col-warning-bg-3)}.col-error-bg-3{background-color:var(--col-error-bg-3)}.col-bg-ack-lighter{background-color:var(--col-bg-ack-lighter)}.col-bg-ack{background-color:var(--col-bg-ack)}.col-bg-ack-darker{background-color:var(--col-bg-ack-darker)}.col-primary-bg-ack{background-color:var(--col-primary-bg-ack)}.col-accent-bg-ack{background-color:var(--col-accent-bg-ack)}.col-bg-att-lighter{background-color:var(--col-bg-att-lighter)}.col-bg-att{background-color:var(--col-bg-att)}.col-bg-att-darker{background-color:var(--col-bg-att-darker)}.col-primary-bg-att{background-color:var(--col-primary-bg-att)}.col-accent-bg-att{background-color:var(--col-accent-bg-att)}.col-bg-alert-lighter{background-color:var(--col-bg-alert-lighter)}.col-bg-alert{background-color:var(--col-bg-alert)}.col-bg-alert-darker{background-color:var(--col-bg-alert-darker)}.col-primary-bg-alert{background-color:var(--col-primary-bg-alert)}.col-accent-bg-alert{background-color:var(--col-accent-bg-alert)}.col-bg-btn-lighter{background-color:var(--col-bg-btn-lighter)}.col-bg-btn{background-color:var(--col-bg-btn)}.col-bg-btn-darker{background-color:var(--col-bg-btn-darker)}.col-primary-bg-btn{background-color:var(--col-primary-bg-btn)}.col-accent-bg-btn{background-color:var(--col-accent-bg-btn)}.pattern-diagonal-stripes-sm{background:repeating-linear-gradient(45deg,transparent,transparent 10px,currentColor 10px,currentColor 20px)}.pattern-dots-lg{background-image:radial-gradient(currentColor 1.5px,transparent 1.5px);background-size:15px 15px}.pattern-dots-md{background-image:radial-gradient(currentColor 1px,transparent 1px);background-size:8px 8px}.pattern-dots-medium-dense{background-image:radial-gradient(currentColor .5px,transparent .5px);background-size:3px 3px}.pattern-dots-sm{background-image:radial-gradient(currentColor .5px,transparent .5px);background-size:5px 5px}.pattern-cross-dots-md,.imagelist-background{background-image:radial-gradient(currentColor .7px,transparent 1px),radial-gradient(currentColor .7px,transparent 1px);background-size:6.5px 6.5px;background-position:0 0,3.5px 3.5px}.imagelist-background{background-color:#fff9;background-blend-mode:overlay}p,div{padding:0;margin:0;border:0px;user-select:text;-webkit-user-select:text}select{user-select:none;-webkit-user-select:none}.fa,.fas{font-family:"Font Awesome 5 Free";font-weight:900;font-style:normal}.fa-trash:before{content:""}.fa-view-grid:before{content:""}.fa-reload:before{content:""}.fa-view-list:before{content:""}.fa-camera:before{content:""}.fa-view-image:before{content:""}.fa-check:before{content:""}.fa-bug:before{content:""}.fa-lightbulb:before{content:""}:host{display:block;width:100%}div,p{font-family:var(--standard-text-font)}.center-div{display:flex;flex-direction:column;align-items:center;background:var(--col-bg-body)}.wait-for-login{display:grid;place-items:center;height:100vh;background-color:var(--col-bg-body)}.wait-for-login p{font-family:var(--headline-text-font);font-size:var(--font-size-h2)}.logged-in-message{background-color:var(--col-bg-ack);color:var(--col-primary-bg-ack);display:grid;place-items:center;font-family:var(--standard-text-font)}.development{background-color:#8b0000;color:#fff;font-family:Courier New,sans-serif;font-size:18px;text-align:center}.toolbar{height:3em;background:var(--col-toolbar-bg, var(--col-bg-3));color:var(--col-text-toolbar-bg, var(--col-primary-bg-3));display:flex;flex-direction:row;padding:0 1em;justify-content:space-between}.toolbar-info{display:flex;flex-direction:column;justify-content:center;margin-right:1em}#toolbar-filters{flex-grow:1}#toolbar-buttons{background-color:var(--col-toolbar-bg-darker, var(--col-bg-3-darker));height:100%;display:flex;flex-direction:row;align-items:center;padding:0 1em}.toolbar-button{color:var(--col-primary-bg-3);height:28px}.toolbar-button i{font-size:28px;line-height:100%}.toolbar-button:hover{color:var(--col-accent-bg-3)}.toolbar-button:active{color:var(--col-bg-ack)}.toolbar-button.disabled{opacity:.3}';
var Nd = Object.defineProperty, Pd = (o, e, n, i) => {
  for (var a = void 0, d = o.length - 1, f; d >= 0; d--)
    (f = o[d]) && (a = f(e, n, a) || a);
  return a && Nd(e, n, a), a;
};
const wi = class wi extends vc {
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
  apiConnected() {
    super.apiConnected();
  }
  reloadClicked(e) {
    this.shadowRoot.getElementById("workstation-list").shadowRoot.dispatchEvent(new CustomEvent("fetch-workstations", {
      bubbles: !0,
      cancelable: !1
    }));
  }
  render_toolbar() {
    return J`
            <div class="toolbar">
                <div id="toolbar-filters"></div>
                <div class="toolbar-info">
                    ${this.last_sync_date ? J`<label>last synchronization</label><label>${this.last_sync_date.toLocaleString(B.DATETIME_MED)}</label>` : J`<label>no synchronization, yet</label>`}
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
    e.detail && (this.last_sync_date = B.fromISO(e.detail, { zone: "utc", setZone: !0 }).setZone());
  }
  // apiRender is only called once the api is connected.
  apiRender() {
    let e = J``, n = this.render_toolbar(), i = J`
            <workstation-list id="workstation-list" .apiContext=${this.apiContext} 
                              @syncmanagerinfo="${this.syncManagerInfoReceived}">
            </workstation-list>`;
    return J`${e}${n}${i}`;
  }
};
wi.styles = Dr(Md);
let Dn = wi;
Pd([
  Xs()
], Dn.prototype, "last_sync_date");
window.customElements.define("syncmanager-app", Dn);
export {
  Dn as SyncManagerApp
};
