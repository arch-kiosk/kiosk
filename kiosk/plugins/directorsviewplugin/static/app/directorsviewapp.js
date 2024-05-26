var Xn = Object.getPrototypeOf;
var Jn = Reflect.get;
var Qn = (r, e) => () => (e || r((e = { exports: {} }).exports, e), e.exports);
var ei = (r, e, t) => Jn(Xn(r), t, e);
var gg = Qn((Ug, go) => {
  /**
   * @license
   * Copyright 2019 Google LLC
   * SPDX-License-Identifier: BSD-3-Clause
   */
  const Xt = window, fo = Xt.ShadowRoot && (Xt.ShadyCSS === void 0 || Xt.ShadyCSS.nativeShadow) && "adoptedStyleSheets" in Document.prototype && "replace" in CSSStyleSheet.prototype, bo = Symbol(), ti = /* @__PURE__ */ new WeakMap();
  let mo = class {
    constructor(e, t, o) {
      if (this._$cssResult$ = !0, o !== bo)
        throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");
      this.cssText = e, this.t = t;
    }
    get styleSheet() {
      let e = this.o;
      const t = this.t;
      if (fo && e === void 0) {
        const o = t !== void 0 && t.length === 1;
        o && (e = ti.get(t)), e === void 0 && ((this.o = e = new CSSStyleSheet()).replaceSync(this.cssText), o && ti.set(t, e));
      }
      return e;
    }
    toString() {
      return this.cssText;
    }
  };
  const H = (r) => new mo(typeof r == "string" ? r : r + "", void 0, bo), A = (r, ...e) => {
    const t = r.length === 1 ? r[0] : e.reduce((o, i, a) => o + ((n) => {
      if (n._$cssResult$ === !0)
        return n.cssText;
      if (typeof n == "number")
        return n;
      throw Error("Value passed to 'css' function must be a 'css' function result: " + n + ". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.");
    })(i) + r[a + 1], r[0]);
    return new mo(t, r, bo);
  }, Zn = (r, e) => {
    fo ? r.adoptedStyleSheets = e.map((t) => t instanceof CSSStyleSheet ? t : t.styleSheet) : e.forEach((t) => {
      const o = document.createElement("style"), i = Xt.litNonce;
      i !== void 0 && o.setAttribute("nonce", i), o.textContent = t.cssText, r.appendChild(o);
    });
  }, ri = fo ? (r) => r : (r) => r instanceof CSSStyleSheet ? ((e) => {
    let t = "";
    for (const o of e.cssRules)
      t += o.cssText;
    return H(t);
  })(r) : r;
  /**
   * @license
   * Copyright 2017 Google LLC
   * SPDX-License-Identifier: BSD-3-Clause
   */
  var mr;
  const Zt = window, oi = Zt.trustedTypes, es = oi ? oi.emptyScript : "", ii = Zt.reactiveElementPolyfillSupport, Fr = { toAttribute(r, e) {
    switch (e) {
      case Boolean:
        r = r ? es : null;
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
  } }, sa = (r, e) => e !== r && (e == e || r == r), _r = { attribute: !0, type: String, converter: Fr, reflect: !1, hasChanged: sa }, Hr = "finalized";
  let Oe = class extends HTMLElement {
    constructor() {
      super(), this._$Ei = /* @__PURE__ */ new Map(), this.isUpdatePending = !1, this.hasUpdated = !1, this._$El = null, this._$Eu();
    }
    static addInitializer(e) {
      var t;
      this.finalize(), ((t = this.h) !== null && t !== void 0 ? t : this.h = []).push(e);
    }
    static get observedAttributes() {
      this.finalize();
      const e = [];
      return this.elementProperties.forEach((t, o) => {
        const i = this._$Ep(o, t);
        i !== void 0 && (this._$Ev.set(i, o), e.push(i));
      }), e;
    }
    static createProperty(e, t = _r) {
      if (t.state && (t.attribute = !1), this.finalize(), this.elementProperties.set(e, t), !t.noAccessor && !this.prototype.hasOwnProperty(e)) {
        const o = typeof e == "symbol" ? Symbol() : "__" + e, i = this.getPropertyDescriptor(e, o, t);
        i !== void 0 && Object.defineProperty(this.prototype, e, i);
      }
    }
    static getPropertyDescriptor(e, t, o) {
      return { get() {
        return this[t];
      }, set(i) {
        const a = this[e];
        this[t] = i, this.requestUpdate(e, a, o);
      }, configurable: !0, enumerable: !0 };
    }
    static getPropertyOptions(e) {
      return this.elementProperties.get(e) || _r;
    }
    static finalize() {
      if (this.hasOwnProperty(Hr))
        return !1;
      this[Hr] = !0;
      const e = Object.getPrototypeOf(this);
      if (e.finalize(), e.h !== void 0 && (this.h = [...e.h]), this.elementProperties = new Map(e.elementProperties), this._$Ev = /* @__PURE__ */ new Map(), this.hasOwnProperty("properties")) {
        const t = this.properties, o = [...Object.getOwnPropertyNames(t), ...Object.getOwnPropertySymbols(t)];
        for (const i of o)
          this.createProperty(i, t[i]);
      }
      return this.elementStyles = this.finalizeStyles(this.styles), !0;
    }
    static finalizeStyles(e) {
      const t = [];
      if (Array.isArray(e)) {
        const o = new Set(e.flat(1 / 0).reverse());
        for (const i of o)
          t.unshift(ri(i));
      } else
        e !== void 0 && t.push(ri(e));
      return t;
    }
    static _$Ep(e, t) {
      const o = t.attribute;
      return o === !1 ? void 0 : typeof o == "string" ? o : typeof e == "string" ? e.toLowerCase() : void 0;
    }
    _$Eu() {
      var e;
      this._$E_ = new Promise((t) => this.enableUpdating = t), this._$AL = /* @__PURE__ */ new Map(), this._$Eg(), this.requestUpdate(), (e = this.constructor.h) === null || e === void 0 || e.forEach((t) => t(this));
    }
    addController(e) {
      var t, o;
      ((t = this._$ES) !== null && t !== void 0 ? t : this._$ES = []).push(e), this.renderRoot !== void 0 && this.isConnected && ((o = e.hostConnected) === null || o === void 0 || o.call(e));
    }
    removeController(e) {
      var t;
      (t = this._$ES) === null || t === void 0 || t.splice(this._$ES.indexOf(e) >>> 0, 1);
    }
    _$Eg() {
      this.constructor.elementProperties.forEach((e, t) => {
        this.hasOwnProperty(t) && (this._$Ei.set(t, this[t]), delete this[t]);
      });
    }
    createRenderRoot() {
      var e;
      const t = (e = this.shadowRoot) !== null && e !== void 0 ? e : this.attachShadow(this.constructor.shadowRootOptions);
      return Zn(t, this.constructor.elementStyles), t;
    }
    connectedCallback() {
      var e;
      this.renderRoot === void 0 && (this.renderRoot = this.createRenderRoot()), this.enableUpdating(!0), (e = this._$ES) === null || e === void 0 || e.forEach((t) => {
        var o;
        return (o = t.hostConnected) === null || o === void 0 ? void 0 : o.call(t);
      });
    }
    enableUpdating(e) {
    }
    disconnectedCallback() {
      var e;
      (e = this._$ES) === null || e === void 0 || e.forEach((t) => {
        var o;
        return (o = t.hostDisconnected) === null || o === void 0 ? void 0 : o.call(t);
      });
    }
    attributeChangedCallback(e, t, o) {
      this._$AK(e, o);
    }
    _$EO(e, t, o = _r) {
      var i;
      const a = this.constructor._$Ep(e, o);
      if (a !== void 0 && o.reflect === !0) {
        const n = (((i = o.converter) === null || i === void 0 ? void 0 : i.toAttribute) !== void 0 ? o.converter : Fr).toAttribute(t, o.type);
        this._$El = e, n == null ? this.removeAttribute(a) : this.setAttribute(a, n), this._$El = null;
      }
    }
    _$AK(e, t) {
      var o;
      const i = this.constructor, a = i._$Ev.get(e);
      if (a !== void 0 && this._$El !== a) {
        const n = i.getPropertyOptions(a), s = typeof n.converter == "function" ? { fromAttribute: n.converter } : ((o = n.converter) === null || o === void 0 ? void 0 : o.fromAttribute) !== void 0 ? n.converter : Fr;
        this._$El = a, this[a] = s.fromAttribute(t, n.type), this._$El = null;
      }
    }
    requestUpdate(e, t, o) {
      let i = !0;
      e !== void 0 && (((o = o || this.constructor.getPropertyOptions(e)).hasChanged || sa)(this[e], t) ? (this._$AL.has(e) || this._$AL.set(e, t), o.reflect === !0 && this._$El !== e && (this._$EC === void 0 && (this._$EC = /* @__PURE__ */ new Map()), this._$EC.set(e, o))) : i = !1), !this.isUpdatePending && i && (this._$E_ = this._$Ej());
    }
    async _$Ej() {
      this.isUpdatePending = !0;
      try {
        await this._$E_;
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
      var e;
      if (!this.isUpdatePending)
        return;
      this.hasUpdated, this._$Ei && (this._$Ei.forEach((i, a) => this[a] = i), this._$Ei = void 0);
      let t = !1;
      const o = this._$AL;
      try {
        t = this.shouldUpdate(o), t ? (this.willUpdate(o), (e = this._$ES) === null || e === void 0 || e.forEach((i) => {
          var a;
          return (a = i.hostUpdate) === null || a === void 0 ? void 0 : a.call(i);
        }), this.update(o)) : this._$Ek();
      } catch (i) {
        throw t = !1, this._$Ek(), i;
      }
      t && this._$AE(o);
    }
    willUpdate(e) {
    }
    _$AE(e) {
      var t;
      (t = this._$ES) === null || t === void 0 || t.forEach((o) => {
        var i;
        return (i = o.hostUpdated) === null || i === void 0 ? void 0 : i.call(o);
      }), this.hasUpdated || (this.hasUpdated = !0, this.firstUpdated(e)), this.updated(e);
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
    shouldUpdate(e) {
      return !0;
    }
    update(e) {
      this._$EC !== void 0 && (this._$EC.forEach((t, o) => this._$EO(o, this[o], t)), this._$EC = void 0), this._$Ek();
    }
    updated(e) {
    }
    firstUpdated(e) {
    }
  };
  Oe[Hr] = !0, Oe.elementProperties = /* @__PURE__ */ new Map(), Oe.elementStyles = [], Oe.shadowRootOptions = { mode: "open" }, ii == null || ii({ ReactiveElement: Oe }), ((mr = Zt.reactiveElementVersions) !== null && mr !== void 0 ? mr : Zt.reactiveElementVersions = []).push("1.6.3");
  /**
   * @license
   * Copyright 2017 Google LLC
   * SPDX-License-Identifier: BSD-3-Clause
   */
  var vr;
  const er = window, Xe = er.trustedTypes, ai = Xe ? Xe.createPolicy("lit-html", { createHTML: (r) => r }) : void 0, Br = "$lit$", le = `lit$${(Math.random() + "").slice(9)}$`, la = "?" + le, ts = `<${la}>`, Ce = document, wt = () => Ce.createComment(""), Ct = (r) => r === null || typeof r != "object" && typeof r != "function", ca = Array.isArray, rs = (r) => ca(r) || typeof (r == null ? void 0 : r[Symbol.iterator]) == "function", yr = `[ 	
\f\r]`, lt = /<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g, ni = /-->/g, si = />/g, ve = RegExp(`>|${yr}(?:([^\\s"'>=/]+)(${yr}*=${yr}*(?:[^ 	
\f\r"'\`<>=]|("|')|))|$)`, "g"), li = /'/g, ci = /"/g, da = /^(?:script|style|textarea|title)$/i, os = (r) => (e, ...t) => ({ _$litType$: r, strings: e, values: t }), h = os(1), Je = Symbol.for("lit-noChange"), O = Symbol.for("lit-nothing"), di = /* @__PURE__ */ new WeakMap(), ye = Ce.createTreeWalker(Ce, 129, null, !1);
  function ua(r, e) {
    if (!Array.isArray(r) || !r.hasOwnProperty("raw"))
      throw Error("invalid template strings array");
    return ai !== void 0 ? ai.createHTML(e) : e;
  }
  const is = (r, e) => {
    const t = r.length - 1, o = [];
    let i, a = e === 2 ? "<svg>" : "", n = lt;
    for (let s = 0; s < t; s++) {
      const l = r[s];
      let c, d, u = -1, p = 0;
      for (; p < l.length && (n.lastIndex = p, d = n.exec(l), d !== null); )
        p = n.lastIndex, n === lt ? d[1] === "!--" ? n = ni : d[1] !== void 0 ? n = si : d[2] !== void 0 ? (da.test(d[2]) && (i = RegExp("</" + d[2], "g")), n = ve) : d[3] !== void 0 && (n = ve) : n === ve ? d[0] === ">" ? (n = i ?? lt, u = -1) : d[1] === void 0 ? u = -2 : (u = n.lastIndex - d[2].length, c = d[1], n = d[3] === void 0 ? ve : d[3] === '"' ? ci : li) : n === ci || n === li ? n = ve : n === ni || n === si ? n = lt : (n = ve, i = void 0);
      const g = n === ve && r[s + 1].startsWith("/>") ? " " : "";
      a += n === lt ? l + ts : u >= 0 ? (o.push(c), l.slice(0, u) + Br + l.slice(u) + le + g) : l + le + (u === -2 ? (o.push(void 0), s) : g);
    }
    return [ua(r, a + (r[t] || "<?>") + (e === 2 ? "</svg>" : "")), o];
  };
  class At {
    constructor({ strings: e, _$litType$: t }, o) {
      let i;
      this.parts = [];
      let a = 0, n = 0;
      const s = e.length - 1, l = this.parts, [c, d] = is(e, t);
      if (this.el = At.createElement(c, o), ye.currentNode = this.el.content, t === 2) {
        const u = this.el.content, p = u.firstChild;
        p.remove(), u.append(...p.childNodes);
      }
      for (; (i = ye.nextNode()) !== null && l.length < s; ) {
        if (i.nodeType === 1) {
          if (i.hasAttributes()) {
            const u = [];
            for (const p of i.getAttributeNames())
              if (p.endsWith(Br) || p.startsWith(le)) {
                const g = d[n++];
                if (u.push(p), g !== void 0) {
                  const b = i.getAttribute(g.toLowerCase() + Br).split(le), f = /([.?@])?(.*)/.exec(g);
                  l.push({ type: 1, index: a, name: f[2], strings: b, ctor: f[1] === "." ? ns : f[1] === "?" ? ls : f[1] === "@" ? cs : lr });
                } else
                  l.push({ type: 6, index: a });
              }
            for (const p of u)
              i.removeAttribute(p);
          }
          if (da.test(i.tagName)) {
            const u = i.textContent.split(le), p = u.length - 1;
            if (p > 0) {
              i.textContent = Xe ? Xe.emptyScript : "";
              for (let g = 0; g < p; g++)
                i.append(u[g], wt()), ye.nextNode(), l.push({ type: 2, index: ++a });
              i.append(u[p], wt());
            }
          }
        } else if (i.nodeType === 8)
          if (i.data === la)
            l.push({ type: 2, index: a });
          else {
            let u = -1;
            for (; (u = i.data.indexOf(le, u + 1)) !== -1; )
              l.push({ type: 7, index: a }), u += le.length - 1;
          }
        a++;
      }
    }
    static createElement(e, t) {
      const o = Ce.createElement("template");
      return o.innerHTML = e, o;
    }
  }
  function Qe(r, e, t = r, o) {
    var i, a, n, s;
    if (e === Je)
      return e;
    let l = o !== void 0 ? (i = t._$Co) === null || i === void 0 ? void 0 : i[o] : t._$Cl;
    const c = Ct(e) ? void 0 : e._$litDirective$;
    return (l == null ? void 0 : l.constructor) !== c && ((a = l == null ? void 0 : l._$AO) === null || a === void 0 || a.call(l, !1), c === void 0 ? l = void 0 : (l = new c(r), l._$AT(r, t, o)), o !== void 0 ? ((n = (s = t)._$Co) !== null && n !== void 0 ? n : s._$Co = [])[o] = l : t._$Cl = l), l !== void 0 && (e = Qe(r, l._$AS(r, e.values), l, o)), e;
  }
  class as {
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
      var t;
      const { el: { content: o }, parts: i } = this._$AD, a = ((t = e == null ? void 0 : e.creationScope) !== null && t !== void 0 ? t : Ce).importNode(o, !0);
      ye.currentNode = a;
      let n = ye.nextNode(), s = 0, l = 0, c = i[0];
      for (; c !== void 0; ) {
        if (s === c.index) {
          let d;
          c.type === 2 ? d = new Lt(n, n.nextSibling, this, e) : c.type === 1 ? d = new c.ctor(n, c.name, c.strings, this, e) : c.type === 6 && (d = new ds(n, this, e)), this._$AV.push(d), c = i[++l];
        }
        s !== (c == null ? void 0 : c.index) && (n = ye.nextNode(), s++);
      }
      return ye.currentNode = Ce, a;
    }
    v(e) {
      let t = 0;
      for (const o of this._$AV)
        o !== void 0 && (o.strings !== void 0 ? (o._$AI(e, o, t), t += o.strings.length - 2) : o._$AI(e[t])), t++;
    }
  }
  class Lt {
    constructor(e, t, o, i) {
      var a;
      this.type = 2, this._$AH = O, this._$AN = void 0, this._$AA = e, this._$AB = t, this._$AM = o, this.options = i, this._$Cp = (a = i == null ? void 0 : i.isConnected) === null || a === void 0 || a;
    }
    get _$AU() {
      var e, t;
      return (t = (e = this._$AM) === null || e === void 0 ? void 0 : e._$AU) !== null && t !== void 0 ? t : this._$Cp;
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
      e = Qe(this, e, t), Ct(e) ? e === O || e == null || e === "" ? (this._$AH !== O && this._$AR(), this._$AH = O) : e !== this._$AH && e !== Je && this._(e) : e._$litType$ !== void 0 ? this.g(e) : e.nodeType !== void 0 ? this.$(e) : rs(e) ? this.T(e) : this._(e);
    }
    k(e) {
      return this._$AA.parentNode.insertBefore(e, this._$AB);
    }
    $(e) {
      this._$AH !== e && (this._$AR(), this._$AH = this.k(e));
    }
    _(e) {
      this._$AH !== O && Ct(this._$AH) ? this._$AA.nextSibling.data = e : this.$(Ce.createTextNode(e)), this._$AH = e;
    }
    g(e) {
      var t;
      const { values: o, _$litType$: i } = e, a = typeof i == "number" ? this._$AC(e) : (i.el === void 0 && (i.el = At.createElement(ua(i.h, i.h[0]), this.options)), i);
      if (((t = this._$AH) === null || t === void 0 ? void 0 : t._$AD) === a)
        this._$AH.v(o);
      else {
        const n = new as(a, this), s = n.u(this.options);
        n.v(o), this.$(s), this._$AH = n;
      }
    }
    _$AC(e) {
      let t = di.get(e.strings);
      return t === void 0 && di.set(e.strings, t = new At(e)), t;
    }
    T(e) {
      ca(this._$AH) || (this._$AH = [], this._$AR());
      const t = this._$AH;
      let o, i = 0;
      for (const a of e)
        i === t.length ? t.push(o = new Lt(this.k(wt()), this.k(wt()), this, this.options)) : o = t[i], o._$AI(a), i++;
      i < t.length && (this._$AR(o && o._$AB.nextSibling, i), t.length = i);
    }
    _$AR(e = this._$AA.nextSibling, t) {
      var o;
      for ((o = this._$AP) === null || o === void 0 || o.call(this, !1, !0, t); e && e !== this._$AB; ) {
        const i = e.nextSibling;
        e.remove(), e = i;
      }
    }
    setConnected(e) {
      var t;
      this._$AM === void 0 && (this._$Cp = e, (t = this._$AP) === null || t === void 0 || t.call(this, e));
    }
  }
  class lr {
    constructor(e, t, o, i, a) {
      this.type = 1, this._$AH = O, this._$AN = void 0, this.element = e, this.name = t, this._$AM = i, this.options = a, o.length > 2 || o[0] !== "" || o[1] !== "" ? (this._$AH = Array(o.length - 1).fill(new String()), this.strings = o) : this._$AH = O;
    }
    get tagName() {
      return this.element.tagName;
    }
    get _$AU() {
      return this._$AM._$AU;
    }
    _$AI(e, t = this, o, i) {
      const a = this.strings;
      let n = !1;
      if (a === void 0)
        e = Qe(this, e, t, 0), n = !Ct(e) || e !== this._$AH && e !== Je, n && (this._$AH = e);
      else {
        const s = e;
        let l, c;
        for (e = a[0], l = 0; l < a.length - 1; l++)
          c = Qe(this, s[o + l], t, l), c === Je && (c = this._$AH[l]), n || (n = !Ct(c) || c !== this._$AH[l]), c === O ? e = O : e !== O && (e += (c ?? "") + a[l + 1]), this._$AH[l] = c;
      }
      n && !i && this.j(e);
    }
    j(e) {
      e === O ? this.element.removeAttribute(this.name) : this.element.setAttribute(this.name, e ?? "");
    }
  }
  class ns extends lr {
    constructor() {
      super(...arguments), this.type = 3;
    }
    j(e) {
      this.element[this.name] = e === O ? void 0 : e;
    }
  }
  const ss = Xe ? Xe.emptyScript : "";
  class ls extends lr {
    constructor() {
      super(...arguments), this.type = 4;
    }
    j(e) {
      e && e !== O ? this.element.setAttribute(this.name, ss) : this.element.removeAttribute(this.name);
    }
  }
  class cs extends lr {
    constructor(e, t, o, i, a) {
      super(e, t, o, i, a), this.type = 5;
    }
    _$AI(e, t = this) {
      var o;
      if ((e = (o = Qe(this, e, t, 0)) !== null && o !== void 0 ? o : O) === Je)
        return;
      const i = this._$AH, a = e === O && i !== O || e.capture !== i.capture || e.once !== i.once || e.passive !== i.passive, n = e !== O && (i === O || a);
      a && this.element.removeEventListener(this.name, this, i), n && this.element.addEventListener(this.name, this, e), this._$AH = e;
    }
    handleEvent(e) {
      var t, o;
      typeof this._$AH == "function" ? this._$AH.call((o = (t = this.options) === null || t === void 0 ? void 0 : t.host) !== null && o !== void 0 ? o : this.element, e) : this._$AH.handleEvent(e);
    }
  }
  class ds {
    constructor(e, t, o) {
      this.element = e, this.type = 6, this._$AN = void 0, this._$AM = t, this.options = o;
    }
    get _$AU() {
      return this._$AM._$AU;
    }
    _$AI(e) {
      Qe(this, e);
    }
  }
  const ui = er.litHtmlPolyfillSupport;
  ui == null || ui(At, Lt), ((vr = er.litHtmlVersions) !== null && vr !== void 0 ? vr : er.litHtmlVersions = []).push("2.8.0");
  const us = (r, e, t) => {
    var o, i;
    const a = (o = t == null ? void 0 : t.renderBefore) !== null && o !== void 0 ? o : e;
    let n = a._$litPart$;
    if (n === void 0) {
      const s = (i = t == null ? void 0 : t.renderBefore) !== null && i !== void 0 ? i : null;
      a._$litPart$ = n = new Lt(e.insertBefore(wt(), s), s, void 0, t ?? {});
    }
    return n._$AI(r), n;
  };
  /**
   * @license
   * Copyright 2017 Google LLC
   * SPDX-License-Identifier: BSD-3-Clause
   */
  var kr, xr;
  let Ie = class extends Oe {
    constructor() {
      super(...arguments), this.renderOptions = { host: this }, this._$Do = void 0;
    }
    createRenderRoot() {
      var e, t;
      const o = super.createRenderRoot();
      return (e = (t = this.renderOptions).renderBefore) !== null && e !== void 0 || (t.renderBefore = o.firstChild), o;
    }
    update(e) {
      const t = this.render();
      this.hasUpdated || (this.renderOptions.isConnected = this.isConnected), super.update(e), this._$Do = us(t, this.renderRoot, this.renderOptions);
    }
    connectedCallback() {
      var e;
      super.connectedCallback(), (e = this._$Do) === null || e === void 0 || e.setConnected(!0);
    }
    disconnectedCallback() {
      var e;
      super.disconnectedCallback(), (e = this._$Do) === null || e === void 0 || e.setConnected(!1);
    }
    render() {
      return Je;
    }
  };
  Ie.finalized = !0, Ie._$litElement$ = !0, (kr = globalThis.litElementHydrateSupport) === null || kr === void 0 || kr.call(globalThis, { LitElement: Ie });
  const hi = globalThis.litElementPolyfillSupport;
  hi == null || hi({ LitElement: Ie });
  ((xr = globalThis.litElementVersions) !== null && xr !== void 0 ? xr : globalThis.litElementVersions = []).push("3.3.3");
  const ha = 2, jr = 3;
  /**
  @license
  Copyright (c) 2018 The Polymer Project Authors. All rights reserved.
  This code may only be used under the BSD style license found at http://polymer.github.io/LICENSE.txt
  The complete set of authors may be found at http://polymer.github.io/AUTHORS.txt
  The complete set of contributors may be found at http://polymer.github.io/CONTRIBUTORS.txt
  Code distributed by Google as part of the polymer project is also
  subject to an additional IP rights grant found at http://polymer.github.io/PATENTS.txt
  */
  const pa = (r) => (e) => class extends e {
    connectedCallback() {
      super.connectedCallback && super.connectedCallback(), this._storeUnsubscribe = r.subscribe(() => this.stateChanged(r.getState())), this.stateChanged(r.getState());
    }
    disconnectedCallback() {
      this._storeUnsubscribe(), super.disconnectedCallback && super.disconnectedCallback();
    }
    /**
     * The `stateChanged(state)` method will be called when the state is updated.
     */
    stateChanged(t) {
    }
  };
  function hs(r) {
    var e, t = r.Symbol;
    return typeof t == "function" ? t.observable ? e = t.observable : (e = t("observable"), t.observable = e) : e = "@@observable", e;
  }
  var $e;
  typeof self < "u" ? $e = self : typeof window < "u" ? $e = window : typeof global < "u" ? $e = global : typeof go < "u" ? $e = go : $e = Function("return this")();
  var pi = hs($e), wr = function() {
    return Math.random().toString(36).substring(7).split("").join(".");
  }, gi = {
    INIT: "@@redux/INIT" + wr(),
    REPLACE: "@@redux/REPLACE" + wr(),
    PROBE_UNKNOWN_ACTION: function() {
      return "@@redux/PROBE_UNKNOWN_ACTION" + wr();
    }
  };
  function ps(r) {
    if (typeof r != "object" || r === null)
      return !1;
    for (var e = r; Object.getPrototypeOf(e) !== null; )
      e = Object.getPrototypeOf(e);
    return Object.getPrototypeOf(r) === e;
  }
  function ga(r, e, t) {
    var o;
    if (typeof e == "function" && typeof t == "function" || typeof t == "function" && typeof arguments[3] == "function")
      throw new Error("It looks like you are passing several store enhancers to createStore(). This is not supported. Instead, compose them together to a single function.");
    if (typeof e == "function" && typeof t > "u" && (t = e, e = void 0), typeof t < "u") {
      if (typeof t != "function")
        throw new Error("Expected the enhancer to be a function.");
      return t(ga)(r, e);
    }
    if (typeof r != "function")
      throw new Error("Expected the reducer to be a function.");
    var i = r, a = e, n = [], s = n, l = !1;
    function c() {
      s === n && (s = n.slice());
    }
    function d() {
      if (l)
        throw new Error("You may not call store.getState() while the reducer is executing. The reducer has already received the state as an argument. Pass it down from the top reducer instead of reading it from the store.");
      return a;
    }
    function u(f) {
      if (typeof f != "function")
        throw new Error("Expected the listener to be a function.");
      if (l)
        throw new Error("You may not call store.subscribe() while the reducer is executing. If you would like to be notified after the store has been updated, subscribe from a component and invoke store.getState() in the callback to access the latest state. See https://redux.js.org/api-reference/store#subscribelistener for more details.");
      var m = !0;
      return c(), s.push(f), function() {
        if (m) {
          if (l)
            throw new Error("You may not unsubscribe from a store listener while the reducer is executing. See https://redux.js.org/api-reference/store#subscribelistener for more details.");
          m = !1, c();
          var v = s.indexOf(f);
          s.splice(v, 1), n = null;
        }
      };
    }
    function p(f) {
      if (!ps(f))
        throw new Error("Actions must be plain objects. Use custom middleware for async actions.");
      if (typeof f.type > "u")
        throw new Error('Actions may not have an undefined "type" property. Have you misspelled a constant?');
      if (l)
        throw new Error("Reducers may not dispatch actions.");
      try {
        l = !0, a = i(a, f);
      } finally {
        l = !1;
      }
      for (var m = n = s, _ = 0; _ < m.length; _++) {
        var v = m[_];
        v();
      }
      return f;
    }
    function g(f) {
      if (typeof f != "function")
        throw new Error("Expected the nextReducer to be a function.");
      i = f, p({
        type: gi.REPLACE
      });
    }
    function b() {
      var f, m = u;
      return f = {
        /**
         * The minimal observable subscription method.
         * @param {Object} observer Any object that can be used as an observer.
         * The observer object should have a `next` method.
         * @returns {subscription} An object with an `unsubscribe` method that can
         * be used to unsubscribe the observable from the store, and prevent further
         * emission of values from the observable.
         */
        subscribe: function(v) {
          if (typeof v != "object" || v === null)
            throw new TypeError("Expected the observer to be an object.");
          function x() {
            v.next && v.next(d());
          }
          x();
          var y = m(x);
          return {
            unsubscribe: y
          };
        }
      }, f[pi] = function() {
        return this;
      }, f;
    }
    return p({
      type: gi.INIT
    }), o = {
      dispatch: p,
      subscribe: u,
      getState: d,
      replaceReducer: g
    }, o[pi] = b, o;
  }
  const gs = "INIT_APP", fa = "SET_SELECTOR", ba = "SET_DATAVIEW_CLASSVALUE", ma = "SET_CONSTANTS", fs = "SET_INIT_STATE";
  class bs {
  }
  const Ne = (r, e) => ({
    type: fa,
    selectorName: r,
    value: e
  }), ms = (r) => ({
    type: ma,
    constants: r
  }), _s = (r, e, t) => ({
    type: ba,
    dataView: r,
    key: e,
    value: t
  });
  class vs {
    constructor() {
      this.selectors = {}, this.dataviews = {}, this.constants = [], this.initState = 0;
    }
  }
  const ys = new vs(), ks = (r = ys, e) => {
    switch (e.type) {
      case gs:
        return r;
      case fs: {
        let t = { ...r };
        return t.initState = e.value, t;
      }
      case fa: {
        let t = { ...r };
        const o = e.selectorName;
        return t.selectors[o] = e.value, t;
      }
      case ba: {
        let t = e, o = { ...r };
        const i = t.dataView;
        i in o.dataviews || (o.dataviews[i] = {});
        let a = o.dataviews[i];
        return a[t.key] = t.value, o;
      }
      case ma: {
        let t = { ...r };
        return t.constants = e.constants, t.initState == 0 && (t.initState = 1), t;
      }
      case "@@INIT":
        return r;
      default:
        return r;
    }
  }, X = ga(
    ks,
    // @ts-ignore
    window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
  ), Uo = class Uo extends pa(X)(Ie) {
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
      e.has("apiContext") && (this.showProgress = !1, this.apiContext && this.apiContext.status === jr && this.addAppError("Cannot connect to Kiosk API."), !e.apiContext && this.apiContext && this.apiConnected());
    }
    apiConnected() {
    }
    render() {
      let e;
      return this.apiContext && this.apiContext.status === ha ? e = this.apiRender() : this.apiContext && this.apiContext.status === jr ? e = this.renderApiError() : e = this.renderNoContextYet(), h`
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
      return h` <link rel="stylesheet" href="${this.kiosk_base_url}static/styles.css" /> `;
    }
    renderApiError() {
    }
    renderErrors() {
      if (this.appErrors.length > 0)
        return h` ${this.appErrors.map((e) => h`<div class="system-message" @click="${this.errorClicked}">${e}</div>`)} `;
    }
    errorClicked(e) {
      this.deleteError(e.target.textContent);
    }
    renderProgress(e = !1) {
      if (e || this.showProgress)
        return h` <div class="loading">
                <div class="loading-progress"></div>
            </div>`;
    }
    addAppError(e) {
      this.appErrors.push(e), this.requestUpdate();
    }
    deleteError(e) {
      let t = -1;
      this.appErrors.find((o, i) => o === e ? (t = i, !0) : !1), t > -1 && (this.appErrors.splice(t, 1), this.appErrors = [...this.appErrors]);
    }
  };
  Uo.properties = {
    /**
     * The Api Context
     */
    apiContext: { type: Object },
    appErrors: { type: Array },
    showProgress: { type: Boolean }
  };
  let Ur = Uo;
  /**
   * @license
   * Copyright 2020 Google LLC
   * SPDX-License-Identifier: BSD-3-Clause
   */
  const xs = Symbol.for(""), ws = (r) => {
    if ((r == null ? void 0 : r.r) === xs)
      return r == null ? void 0 : r._$litStatic$;
  }, fi = /* @__PURE__ */ new Map(), Cs = (r) => (e, ...t) => {
    const o = t.length;
    let i, a;
    const n = [], s = [];
    let l, c = 0, d = !1;
    for (; c < o; ) {
      for (l = e[c]; c < o && (a = t[c], (i = ws(a)) !== void 0); )
        l += i + e[++c], d = !0;
      c !== o && s.push(a), n.push(l), c++;
    }
    if (c === o && n.push(e[o]), d) {
      const u = n.join("$$lit$$");
      (e = fi.get(u)) === void 0 && (n.raw = n, fi.set(u, e = n)), t = s;
    }
    return r(e, ...t);
  }, ct = Cs(h);
  function As(r, e = {}) {
    return kioskErrorToast(r, e);
  }
  function Es(r, e = {}) {
    return kioskSuccessToast(r, e);
  }
  const Ps = 5, Ss = 0, Cr = "MSG_NETWORK_ERROR";
  let Ts = {
    MSG_LOGGED_OUT: {
      severity: 10
    },
    MSG_NETWORK_ERROR: {
      severity: 10
    }
  };
  class Ds {
    constructor(e, t, o = "") {
      this.messageId = e, this.headline = t, this.body = o;
    }
  }
  function Ar(r, e, t, o = "") {
    let i = new Ds(
      e,
      t,
      o
    );
    r.dispatchEvent(new CustomEvent(
      "send-message",
      { bubbles: !0, composed: !0, detail: i }
    ));
  }
  function Os(r, e, t = null, o = !1) {
    if (!(e.messageId in r)) {
      let i = Ts[e.messageId], a = {};
      t ? a = {
        onClosing: t
      } : o && (a = {
        onClosing: () => {
          $s(r, e.messageId);
        }
      }), i.severity >= Ps ? (r[e.messageId] = e, As("<strong>" + e.headline + "</strong><br><br>" + e.body, a)) : i.severity >= Ss && (r[e.messageId] = e, Es("<strong>" + e.headline + "</strong><br><br>" + e.body, a));
    }
  }
  function $s(r, e) {
    e in r && delete r[e];
  }
  function ot(r) {
    const e = (r.getMonth() + 1).toString().padStart(2, "0"), t = r.getDate().toString().padStart(2, "0");
    return `${r.getFullYear()}-${e}-${t}`;
  }
  function ae(r) {
    const e = r.split("-");
    return new Date(parseInt(e[0]), parseInt(e[1]) - 1, parseInt(e[2]));
  }
  function _a(r) {
    let e = {};
    for (let t = 0; t < r.length; t++) {
      let o = r[t];
      try {
        o.path === "file_repository/recording_context_aliases" && (e[o.key] = o.value);
      } catch {
      }
    }
    return e;
  }
  function Ms(r) {
    let e = {}, t = r.split("\r");
    for (const o of t) {
      const i = o.split("=");
      e[i[0]] = i[1];
    }
    return e;
  }
  function de(r, e, t = !1, o = "") {
    let i = "", a = {};
    for (let n = 0; n < r.length; n++) {
      let s = r[n];
      try {
        if (s.path === "constants/labels" && s.key === e && (i = s.value, !t))
          return i;
        if (t && s.path === "constants/labels" && s.key === "plurals" && (a = Ms(s.value)), i && Object.keys(a).length > 0)
          break;
      } catch {
      }
    }
    try {
      i && a && (i = a[i]);
    } catch {
      i = o;
    }
    return i || o;
  }
  function _t(r, e) {
    return r && e in r ? r[e] : e;
  }
  function J(r, e, t = "", o = null) {
    if (t && (t += ": "), e.response) {
      if (e.response.status == 403 || e.response.status == 401) {
        Ar(
          r,
          Cr,
          `${t}You are not logged in properly or your session has timed out`,
          '<a href="/logout">Please log in again.</a>'
        );
        return;
      }
      o ? o(e) : Ar(
        r,
        Cr,
        `${t}Kiosk server responded with an error.`,
        `(${e.response.statusText}). 
                The server might be down or perhaps you are not logged in properly.`
      );
    } else {
      Ar(
        r,
        Cr,
        `${t}Kiosk server responded with a network error.`,
        `(${e}). 
            The server might be down or perhaps you are not logged in properly.`
      );
      return;
    }
  }
  const Is = '.col-bg-body-lighter{background-color:var(--col-bg-body-lighter)}.col-bg-body{background-color:var(--col-bg-body)}.col-bg-body-darker{background-color:var(--col-bg-body-darker)}.col-bg-1-lighter{background-color:var(--col-bg-1-lighter)}.col-bg-1{background-color:var(--col-bg-1)}.col-bg-1-darker{background-color:var(--col-bg-1-darker)}.col-bg-1-input{background-color:var(--col-bg-1-input)}.col-primary-bg-1{background-color:var(--col-primary-bg-1)}.col-accent-bg-1{background-color:var(--col-accent-bg-1)}.col-success-bg-1{background-color:var(--col-success-bg-1)}.col-warning-bg-1{background-color:var(--col-warning-bg-1)}.col-error-bg-1{background-color:var(--col-error-bg-1)}.col-bg-2-lighter{background-color:var(--col-bg-2-lighter)}.col-bg-2{background-color:var(--col-bg-2)}.col-bg-2-darker{background-color:var(--col-bg-2-darker)}.col-bg-2-button{background-color:var(--col-bg-2-button)}.col-bg-2-input{background-color:var(--col-bg-2-input)}.col-primary-bg-2{background-color:var(--col-primary-bg-2)}.col-accent-bg-2{background-color:var(--col-accent-bg-2)}.col-success-bg-2{background-color:var(--col-success-bg-2)}.col-warning-bg-2{background-color:var(--col-warning-bg-2)}.col-error-bg-2{background-color:var(--col-error-bg-2)}.col-bg-3-lighter{background-color:var(--col-bg-3-lighter)}.col-bg-3{background-color:var(--col-bg-3)}.col-bg-3-darker{background-color:var(--col-bg-3-darker)}.col-bg-3-button{background-color:var(--col-bg-3-button)}.col-bg-3-input{background-color:var(--col-bg-3-input)}.col-primary-bg-3{background-color:var(--col-primary-bg-3)}.col-accent-bg-3{background-color:var(--col-accent-bg-3)}.col-success-bg-3{background-color:var(--col-success-bg-3)}.col-warning-bg-3{background-color:var(--col-warning-bg-3)}.col-error-bg-3{background-color:var(--col-error-bg-3)}.col-bg-ack-lighter{background-color:var(--col-bg-ack-lighter)}.col-bg-ack{background-color:var(--col-bg-ack)}.col-bg-ack-darker{background-color:var(--col-bg-ack-darker)}.col-primary-bg-ack{background-color:var(--col-primary-bg-ack)}.col-accent-bg-ack{background-color:var(--col-accent-bg-ack)}.col-bg-att-lighter{background-color:var(--col-bg-att-lighter)}.col-bg-att{background-color:var(--col-bg-att)}.col-bg-att-darker{background-color:var(--col-bg-att-darker)}.col-primary-bg-att{background-color:var(--col-primary-bg-att)}.col-accent-bg-att{background-color:var(--col-accent-bg-att)}.col-bg-alert-lighter{background-color:var(--col-bg-alert-lighter)}.col-bg-alert{background-color:var(--col-bg-alert)}.col-bg-alert-darker{background-color:var(--col-bg-alert-darker)}.col-primary-bg-alert{background-color:var(--col-primary-bg-alert)}.col-accent-bg-alert{background-color:var(--col-accent-bg-alert)}.col-bg-btn-lighter{background-color:var(--col-bg-btn-lighter)}.col-bg-btn{background-color:var(--col-bg-btn)}.col-bg-btn-darker{background-color:var(--col-bg-btn-darker)}.col-primary-bg-btn{background-color:var(--col-primary-bg-btn)}.col-accent-bg-btn{background-color:var(--col-accent-bg-btn)}.pattern-diagonal-stripes-sm,.directors-view-frame{background:repeating-linear-gradient(45deg,transparent,transparent 10px,currentColor 10px,currentColor 20px)}.pattern-dots-lg{background-image:radial-gradient(currentColor 1.5px,transparent 1.5px);background-size:15px 15px}.pattern-dots-md{background-image:radial-gradient(currentColor 1px,transparent 1px);background-size:8px 8px}.pattern-dots-medium-dense{background-image:radial-gradient(currentColor .5px,transparent .5px);background-size:3px 3px}.pattern-dots-sm{background-image:radial-gradient(currentColor .5px,transparent .5px);background-size:5px 5px}.pattern-cross-dots-md,.imagelist-background{background-image:radial-gradient(currentColor .7px,transparent 1px),radial-gradient(currentColor .7px,transparent 1px);background-size:6.5px 6.5px;background-position:0 0,3.5px 3.5px}.imagelist-background{background-color:#fff9;background-blend-mode:overlay}p,div{padding:0;margin:0;border:0px;-webkit-user-select:text;user-select:text}select{-webkit-user-select:none;user-select:none}.fa,.fas{font-family:"Font Awesome 5 Free";font-weight:900;font-style:normal}.fa-trash:before{content:""}.fa-view-grid:before{content:""}.fa-view-list:before{content:""}.fa-camera:before{content:""}.fa-view-image:before{content:""}.fa-check:before{content:""}.fa-exclamation-circle:before{content:""}:host{background-color:var(--col-bg-body);display:block;height:100%;overflow-x:hidden;overflow-y:scroll}div,p{font-family:var(--standard-text-font)}.center-div{display:flex;flex-direction:column;align-items:center}.wait-for-login{display:grid;place-items:center;height:100vh;background-color:var(--col-bg-body)}.wait-for-login p{font-family:var(--main-headline-text-font);font-size:2em}.logged-in-message{background-color:var(--col-bg-ack);color:var(--col-accent-bg-ack);display:grid;place-items:center;font-family:var(--standard-text-font)}.development{background-color:#8b0000;color:#fff;font-family:Courier New,sans-serif;font-size:18px;text-align:center}.directors-view-frame{background-color:#fffffffa;background-blend-mode:overlay;min-height:100%;width:100%}';
  /**
   * @license
   * Copyright 2017 Google LLC
   * SPDX-License-Identifier: BSD-3-Clause
   */
  const W = (r) => (e) => typeof e == "function" ? ((t, o) => (customElements.define(t, o), o))(r, e) : ((t, o) => {
    const { kind: i, elements: a } = o;
    return { kind: i, elements: a, finisher(n) {
      customElements.define(t, n);
    } };
  })(r, e);
  /**
   * @license
   * Copyright 2017 Google LLC
   * SPDX-License-Identifier: BSD-3-Clause
   */
  const Ns = (r, e) => e.kind === "method" && e.descriptor && !("value" in e.descriptor) ? { ...e, finisher(t) {
    t.createProperty(e.key, r);
  } } : { kind: "field", key: Symbol(), placement: "own", descriptor: {}, originalKey: e.key, initializer() {
    typeof e.initializer == "function" && (this[e.key] = e.initializer.call(this));
  }, finisher(t) {
    t.createProperty(e.key, r);
  } }, zs = (r, e, t) => {
    e.constructor.createProperty(t, r);
  };
  function Ls(r) {
    return (e, t) => t !== void 0 ? zs(r, e, t) : Ns(r, e);
  }
  /**
   * @license
   * Copyright 2017 Google LLC
   * SPDX-License-Identifier: BSD-3-Clause
   */
  function Rs(r) {
    return Ls({ ...r, state: !0 });
  }
  /**
   * @license
   * Copyright 2021 Google LLC
   * SPDX-License-Identifier: BSD-3-Clause
   */
  var Er;
  ((Er = window.HTMLSlotElement) === null || Er === void 0 ? void 0 : Er.prototype.assignedElements) != null;
  const Fs = ".col-bg-body-lighter{background-color:var(--col-bg-body-lighter)}.col-bg-body{background-color:var(--col-bg-body)}.col-bg-body-darker{background-color:var(--col-bg-body-darker)}.col-bg-1-lighter{background-color:var(--col-bg-1-lighter)}.col-bg-1{background-color:var(--col-bg-1)}.col-bg-1-darker{background-color:var(--col-bg-1-darker)}.col-bg-1-input{background-color:var(--col-bg-1-input)}.col-primary-bg-1{background-color:var(--col-primary-bg-1)}.col-accent-bg-1{background-color:var(--col-accent-bg-1)}.col-success-bg-1{background-color:var(--col-success-bg-1)}.col-warning-bg-1{background-color:var(--col-warning-bg-1)}.col-error-bg-1{background-color:var(--col-error-bg-1)}.col-bg-2-lighter{background-color:var(--col-bg-2-lighter)}.col-bg-2{background-color:var(--col-bg-2)}.col-bg-2-darker{background-color:var(--col-bg-2-darker)}.col-bg-2-button{background-color:var(--col-bg-2-button)}.col-bg-2-input{background-color:var(--col-bg-2-input)}.col-primary-bg-2{background-color:var(--col-primary-bg-2)}.col-accent-bg-2{background-color:var(--col-accent-bg-2)}.col-success-bg-2{background-color:var(--col-success-bg-2)}.col-warning-bg-2{background-color:var(--col-warning-bg-2)}.col-error-bg-2{background-color:var(--col-error-bg-2)}.col-bg-3-lighter{background-color:var(--col-bg-3-lighter)}.col-bg-3{background-color:var(--col-bg-3)}.col-bg-3-darker{background-color:var(--col-bg-3-darker)}.col-bg-3-button{background-color:var(--col-bg-3-button)}.col-bg-3-input{background-color:var(--col-bg-3-input)}.col-primary-bg-3{background-color:var(--col-primary-bg-3)}.col-accent-bg-3{background-color:var(--col-accent-bg-3)}.col-success-bg-3{background-color:var(--col-success-bg-3)}.col-warning-bg-3{background-color:var(--col-warning-bg-3)}.col-error-bg-3{background-color:var(--col-error-bg-3)}.col-bg-ack-lighter{background-color:var(--col-bg-ack-lighter)}.col-bg-ack{background-color:var(--col-bg-ack)}.col-bg-ack-darker{background-color:var(--col-bg-ack-darker)}.col-primary-bg-ack{background-color:var(--col-primary-bg-ack)}.col-accent-bg-ack{background-color:var(--col-accent-bg-ack)}.col-bg-att-lighter{background-color:var(--col-bg-att-lighter)}.col-bg-att{background-color:var(--col-bg-att)}.col-bg-att-darker{background-color:var(--col-bg-att-darker)}.col-primary-bg-att{background-color:var(--col-primary-bg-att)}.col-accent-bg-att{background-color:var(--col-accent-bg-att)}.col-bg-alert-lighter{background-color:var(--col-bg-alert-lighter)}.col-bg-alert{background-color:var(--col-bg-alert)}.col-bg-alert-darker{background-color:var(--col-bg-alert-darker)}.col-primary-bg-alert{background-color:var(--col-primary-bg-alert)}.col-accent-bg-alert{background-color:var(--col-accent-bg-alert)}.col-bg-btn-lighter{background-color:var(--col-bg-btn-lighter)}.col-bg-btn{background-color:var(--col-bg-btn)}.col-bg-btn-darker{background-color:var(--col-bg-btn-darker)}.col-primary-bg-btn{background-color:var(--col-primary-bg-btn)}.col-accent-bg-btn{background-color:var(--col-accent-bg-btn)}.pattern-diagonal-stripes-sm{background:repeating-linear-gradient(45deg,transparent,transparent 10px,currentColor 10px,currentColor 20px)}.pattern-dots-lg{background-image:radial-gradient(currentColor 1.5px,transparent 1.5px);background-size:15px 15px}.pattern-dots-md{background-image:radial-gradient(currentColor 1px,transparent 1px);background-size:8px 8px}.pattern-dots-medium-dense{background-image:radial-gradient(currentColor .5px,transparent .5px);background-size:3px 3px}.pattern-dots-sm{background-image:radial-gradient(currentColor .5px,transparent .5px);background-size:5px 5px}.pattern-cross-dots-md,.imagelist-background{background-image:radial-gradient(currentColor .7px,transparent 1px),radial-gradient(currentColor .7px,transparent 1px);background-size:6.5px 6.5px;background-position:0 0,3.5px 3.5px}.imagelist-background{background-color:#fff9;background-blend-mode:overlay}p,div{padding:0;margin:0;border:0px;-webkit-user-select:text;user-select:text}select{-webkit-user-select:none;user-select:none}div,p{font-family:var(--standard-text-font)}:host{display:block;position:sticky;top:0}", Hs = ".col-bg-body-lighter{background-color:var(--col-bg-body-lighter)}.col-bg-body{background-color:var(--col-bg-body)}.col-bg-body-darker{background-color:var(--col-bg-body-darker)}.col-bg-1-lighter{background-color:var(--col-bg-1-lighter)}.col-bg-1{background-color:var(--col-bg-1)}.col-bg-1-darker{background-color:var(--col-bg-1-darker)}.col-bg-1-input{background-color:var(--col-bg-1-input)}.col-primary-bg-1{background-color:var(--col-primary-bg-1)}.col-accent-bg-1{background-color:var(--col-accent-bg-1)}.col-success-bg-1{background-color:var(--col-success-bg-1)}.col-warning-bg-1{background-color:var(--col-warning-bg-1)}.col-error-bg-1{background-color:var(--col-error-bg-1)}.col-bg-2-lighter{background-color:var(--col-bg-2-lighter)}.col-bg-2{background-color:var(--col-bg-2)}.col-bg-2-darker{background-color:var(--col-bg-2-darker)}.col-bg-2-button{background-color:var(--col-bg-2-button)}.col-bg-2-input{background-color:var(--col-bg-2-input)}.col-primary-bg-2{background-color:var(--col-primary-bg-2)}.col-accent-bg-2{background-color:var(--col-accent-bg-2)}.col-success-bg-2{background-color:var(--col-success-bg-2)}.col-warning-bg-2{background-color:var(--col-warning-bg-2)}.col-error-bg-2{background-color:var(--col-error-bg-2)}.col-bg-3-lighter{background-color:var(--col-bg-3-lighter)}.col-bg-3{background-color:var(--col-bg-3)}.col-bg-3-darker{background-color:var(--col-bg-3-darker)}.col-bg-3-button{background-color:var(--col-bg-3-button)}.col-bg-3-input{background-color:var(--col-bg-3-input)}.col-primary-bg-3{background-color:var(--col-primary-bg-3)}.col-accent-bg-3{background-color:var(--col-accent-bg-3)}.col-success-bg-3{background-color:var(--col-success-bg-3)}.col-warning-bg-3{background-color:var(--col-warning-bg-3)}.col-error-bg-3{background-color:var(--col-error-bg-3)}.col-bg-ack-lighter{background-color:var(--col-bg-ack-lighter)}.col-bg-ack{background-color:var(--col-bg-ack)}.col-bg-ack-darker{background-color:var(--col-bg-ack-darker)}.col-primary-bg-ack{background-color:var(--col-primary-bg-ack)}.col-accent-bg-ack{background-color:var(--col-accent-bg-ack)}.col-bg-att-lighter{background-color:var(--col-bg-att-lighter)}.col-bg-att{background-color:var(--col-bg-att)}.col-bg-att-darker{background-color:var(--col-bg-att-darker)}.col-primary-bg-att{background-color:var(--col-primary-bg-att)}.col-accent-bg-att{background-color:var(--col-accent-bg-att)}.col-bg-alert-lighter{background-color:var(--col-bg-alert-lighter)}.col-bg-alert{background-color:var(--col-bg-alert)}.col-bg-alert-darker{background-color:var(--col-bg-alert-darker)}.col-primary-bg-alert{background-color:var(--col-primary-bg-alert)}.col-accent-bg-alert{background-color:var(--col-accent-bg-alert)}.col-bg-btn-lighter{background-color:var(--col-bg-btn-lighter)}.col-bg-btn{background-color:var(--col-bg-btn)}.col-bg-btn-darker{background-color:var(--col-bg-btn-darker)}.col-primary-bg-btn{background-color:var(--col-primary-bg-btn)}.col-accent-bg-btn{background-color:var(--col-accent-bg-btn)}.pattern-diagonal-stripes-sm{background:repeating-linear-gradient(45deg,transparent,transparent 10px,currentColor 10px,currentColor 20px)}.pattern-dots-lg{background-image:radial-gradient(currentColor 1.5px,transparent 1.5px);background-size:15px 15px}.pattern-dots-md{background-image:radial-gradient(currentColor 1px,transparent 1px);background-size:8px 8px}.pattern-dots-medium-dense{background-image:radial-gradient(currentColor .5px,transparent .5px);background-size:3px 3px}.pattern-dots-sm{background-image:radial-gradient(currentColor .5px,transparent .5px);background-size:5px 5px}.pattern-cross-dots-md,.imagelist-background{background-image:radial-gradient(currentColor .7px,transparent 1px),radial-gradient(currentColor .7px,transparent 1px);background-size:6.5px 6.5px;background-position:0 0,3.5px 3.5px}.imagelist-background{background-color:#fff9;background-blend-mode:overlay}p,div{padding:0;margin:0;border:0px;-webkit-user-select:text;user-select:text}select{-webkit-user-select:none;user-select:none}:host{display:block}div,p{font-family:var(--standard-text-font);-webkit-user-select:none;user-select:none}.date-selector{width:100%;background-color:var(--col-bg-1);display:flex;flex-direction:row;align-items:center;justify-content:center}.date-selector-date{padding:.5em;cursor:pointer;color:var(--col-primary-bg-1);--lumo-body-text-color: $col-accent-bg-1}.selected-date{background-color:var(--col-bg-2);color:var(--col-accent-bg-1);font-weight:700;font-size:1.2em}";
  /**
   * @license
   * Copyright (c) 2017 - 2022 Vaadin Ltd.
   * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
   */
  class Bs extends HTMLElement {
    static get version() {
      return "23.3.29";
    }
  }
  customElements.define("vaadin-lumo-styles", Bs);
  /**
   * @license
   * Copyright (c) 2017 - 2022 Vaadin Ltd.
   * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
   */
  const js = (r) => class extends r {
    static get properties() {
      return {
        /**
         * Helper property with theme attribute value facilitating propagation
         * in shadow DOM.
         *
         * Enables the component implementation to propagate the `theme`
         * attribute value to the sub-components in Shadow DOM by binding
         * the sub-component’s "theme" attribute to the `theme` property of
         * the host.
         *
         * **NOTE:** Extending the mixin only provides the property for binding,
         * and does not make the propagation alone.
         *
         * See [Styling Components: Sub-components](https://vaadin.com/docs/latest/styling/custom-theme/styling-components/#sub-components).
         * page for more information.
         *
         * @deprecated The `theme` property is not supposed for public use and will be dropped in Vaadin 24.
         * Please, use the `theme` attribute instead.
         * @protected
         */
        theme: {
          type: String,
          reflectToAttribute: !0,
          observer: "__deprecatedThemePropertyChanged"
        },
        /**
         * Helper property with theme attribute value facilitating propagation
         * in shadow DOM.
         *
         * Enables the component implementation to propagate the `theme`
         * attribute value to the sub-components in Shadow DOM by binding
         * the sub-component’s "theme" attribute to the `theme` property of
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
    /** @private */
    __deprecatedThemePropertyChanged(t) {
      this._set_theme(t);
    }
  };
  /**
   * @license
   * Copyright (c) 2017 - 2022 Vaadin Ltd.
   * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
   */
  const va = [];
  function $(r, e, t = {}) {
    r && Gs(r), e = qs(e), window.Vaadin && window.Vaadin.styleModules ? window.Vaadin.styleModules.registerStyles(r, e, t) : va.push({
      themeFor: r,
      styles: e,
      include: t.include,
      moduleId: t.moduleId
    });
  }
  function Vr() {
    return window.Vaadin && window.Vaadin.styleModules ? window.Vaadin.styleModules.getAllThemes() : va;
  }
  function Us(r, e) {
    return (r || "").split(" ").some((t) => new RegExp(`^${t.split("*").join(".*")}$`).test(e));
  }
  function Vs(r = "") {
    let e = 0;
    return r.startsWith("lumo-") || r.startsWith("material-") ? e = 1 : r.startsWith("vaadin-") && (e = 2), e;
  }
  function qs(r = []) {
    return [r].flat(1 / 0).filter((e) => e instanceof mo);
  }
  function ya(r) {
    const e = [];
    return r.include && [].concat(r.include).forEach((t) => {
      const o = Vr().find((i) => i.moduleId === t);
      o && e.push(...ya(o), ...o.styles);
    }, r.styles), e;
  }
  function Ys(r, e) {
    const t = document.createElement("style");
    t.innerHTML = r.map((o) => o.cssText).join(`
`), e.content.appendChild(t);
  }
  function Ws(r) {
    const e = `${r}-default-theme`, t = Vr().filter((o) => o.moduleId !== e && Us(o.themeFor, r)).map((o) => ({
      ...o,
      // Prepend styles from included themes
      styles: [...ya(o), ...o.styles],
      // Map moduleId to includePriority
      includePriority: Vs(o.moduleId)
    })).sort((o, i) => i.includePriority - o.includePriority);
    return t.length > 0 ? t : Vr().filter((o) => o.moduleId === e);
  }
  function Gs(r) {
    return ka(customElements.get(r));
  }
  function ka(r) {
    return r && Object.prototype.hasOwnProperty.call(r, "__themes");
  }
  const it = (r) => class extends js(r) {
    /**
     * Covers PolymerElement based component styling
     * @protected
     */
    static finalize() {
      if (super.finalize(), this.elementStyles)
        return;
      const t = this.prototype._template;
      !t || ka(this) || Ys(this.getStylesForThis(), t);
    }
    /**
     * Covers LitElement based component styling
     *
     * @protected
     */
    static finalizeStyles(t) {
      const o = this.getStylesForThis();
      return t ? [...super.finalizeStyles(t), ...o] : o;
    }
    /**
     * Get styles for the component type
     *
     * @private
     */
    static getStylesForThis() {
      const t = Object.getPrototypeOf(this.prototype), o = (t ? t.constructor.__themes : []) || [];
      this.__themes = [...o, ...Ws(this.is)];
      const i = this.__themes.flatMap((a) => a.styles);
      return i.filter((a, n) => n === i.lastIndexOf(a));
    }
  };
  /**
   * @license
   * Copyright (c) 2017 - 2022 Vaadin Ltd.
   * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
   */
  const Ks = A`
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
  }
`, xa = document.createElement("template");
  xa.innerHTML = `<style>${Ks.toString().replace(":host", "html")}</style>`;
  document.head.appendChild(xa.content);
  const wa = A`
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
  $("", wa, { moduleId: "lumo-color" });
  const Xs = A`
  :host {
    color: var(--lumo-body-text-color) !important;
    background-color: var(--lumo-base-color) !important;
  }
`;
  $("", [wa, Xs], { moduleId: "lumo-color-legacy" });
  /**
   * @license
   * Copyright (c) 2017 - 2022 Vaadin Ltd.
   * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
   */
  const Js = A`
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
`, Ca = document.createElement("template");
  Ca.innerHTML = `<style>${Js.toString().replace(":host", "html")}</style>`;
  document.head.appendChild(Ca.content);
  /**
   * @license
   * Copyright (c) 2017 - 2022 Vaadin Ltd.
   * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
   */
  const Qs = A`
  :host {
    /* Border radius */
    --lumo-border-radius-s: 0.25em; /* Checkbox, badge, date-picker year indicator, etc */
    --lumo-border-radius-m: var(--lumo-border-radius, 0.25em); /* Button, text field, menu overlay, etc */
    --lumo-border-radius-l: 0.5em; /* Dialog, notification, etc */
    --lumo-border-radius: 0.25em; /* Deprecated */

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
  A`
  html {
    --vaadin-checkbox-size: calc(var(--lumo-size-m) / 2);
    --vaadin-radio-button-size: calc(var(--lumo-size-m) / 2);
  }
`;
  const Aa = document.createElement("template");
  Aa.innerHTML = `<style>${Qs.toString().replace(":host", "html")}$</style>`;
  document.head.appendChild(Aa.content);
  /**
   * @license
   * Copyright (c) 2017 - 2022 Vaadin Ltd.
   * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
   */
  const Zs = A`
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
`, el = A`
  html,
  :host {
    font-family: var(--lumo-font-family);
    font-size: var(--lumo-font-size, var(--lumo-font-size-m));
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

  h1,
  h2,
  h3,
  h4,
  h5,
  h6 {
    font-weight: 600;
    line-height: var(--lumo-line-height-xs);
    margin-top: 1.25em;
  }

  h1 {
    font-size: var(--lumo-font-size-xxxl);
    margin-bottom: 0.75em;
  }

  h2 {
    font-size: var(--lumo-font-size-xxl);
    margin-bottom: 0.5em;
  }

  h3 {
    font-size: var(--lumo-font-size-xl);
    margin-bottom: 0.5em;
  }

  h4 {
    font-size: var(--lumo-font-size-l);
    margin-bottom: 0.5em;
  }

  h5 {
    font-size: var(--lumo-font-size-m);
    margin-bottom: 0.25em;
  }

  h6 {
    font-size: var(--lumo-font-size-xs);
    margin-bottom: 0;
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
  $("", el, { moduleId: "lumo-typography" });
  const Ea = document.createElement("template");
  Ea.innerHTML = `<style>${Zs.toString().replace(":host", "html")}</style>`;
  document.head.appendChild(Ea.content);
  $(
    "vaadin-input-container",
    A`
    :host {
      border-radius: var(--lumo-border-radius-m);
      background-color: var(--lumo-contrast-10pct);
      padding: 0 calc(0.375em + var(--lumo-border-radius-m) / 4 - 1px);
      font-weight: 500;
      line-height: 1;
      position: relative;
      cursor: text;
      box-sizing: border-box;
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
    ::slotted(iron-icon),
    ::slotted(vaadin-icon) {
      color: var(--lumo-contrast-60pct);
      width: var(--lumo-icon-size-m);
      height: var(--lumo-icon-size-m);
    }

    /* Vaadin icons are based on a 16x16 grid (unlike Lumo and Material icons with 24x24), so they look too big by default */
    ::slotted(iron-icon[icon^='vaadin:']),
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
  window.JSCompiler_renameProperty = function(r, e) {
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
  let tl = /(url\()([^)]*)(\))/g, rl = /(^\/[^\/])|(^#)|(^[\w-\d]*:)/, qt, j;
  function vt(r, e) {
    if (r && rl.test(r) || r === "//")
      return r;
    if (qt === void 0) {
      qt = !1;
      try {
        const t = new URL("b", "http://a");
        t.pathname = "c%20d", qt = t.href === "http://a/c%20d";
      } catch {
      }
    }
    if (e || (e = document.baseURI || window.location.href), qt)
      try {
        return new URL(r, e).href;
      } catch {
        return r;
      }
    return j || (j = document.implementation.createHTMLDocument("temp"), j.base = j.createElement("base"), j.head.appendChild(j.base), j.anchor = j.createElement("a"), j.body.appendChild(j.anchor)), j.base.href = e, j.anchor.href = r, j.anchor.href || r;
  }
  function _o(r, e) {
    return r.replace(tl, function(t, o, i, a) {
      return o + "'" + vt(i.replace(/["']/g, ""), e) + "'" + a;
    });
  }
  function vo(r) {
    return r.substring(0, r.lastIndexOf("/") + 1);
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
  const Pa = !window.ShadyDOM || !window.ShadyDOM.inUse;
  !window.ShadyCSS || window.ShadyCSS.nativeCss;
  const ol = Pa && "adoptedStyleSheets" in Document.prototype && "replaceSync" in CSSStyleSheet.prototype && // Since spec may change, feature detect exact API we need
  (() => {
    try {
      const r = new CSSStyleSheet();
      r.replaceSync("");
      const e = document.createElement("div");
      return e.attachShadow({ mode: "open" }), e.shadowRoot.adoptedStyleSheets = [r], e.shadowRoot.adoptedStyleSheets[0] === r;
    } catch {
      return !1;
    }
  })();
  let il = window.Polymer && window.Polymer.rootPath || vo(document.baseURI || window.location.href), tr = window.Polymer && window.Polymer.sanitizeDOMValue || void 0;
  window.Polymer && window.Polymer.setPassiveTouchGestures;
  let rr = window.Polymer && window.Polymer.strictTemplatePolicy || !1, al = window.Polymer && window.Polymer.allowTemplateFromDomModule || !1, Sa = window.Polymer && window.Polymer.legacyOptimizations || !1, Ta = window.Polymer && window.Polymer.legacyWarnings || !1, nl = window.Polymer && window.Polymer.syncInitialRender || !1, qr = window.Polymer && window.Polymer.legacyUndefined || !1, sl = window.Polymer && window.Polymer.orderedComputed || !1, bi = window.Polymer && window.Polymer.removeNestedTemplates || !1, ll = window.Polymer && window.Polymer.fastDomIf || !1, mi = window.Polymer && window.Polymer.suppressTemplateNotifications || !1;
  window.Polymer && window.Polymer.legacyNoObservedAttributes;
  let cl = window.Polymer && window.Polymer.useAdoptedStyleSheetsWithBuiltCSS || !1;
  /**
  @license
  Copyright (c) 2017 The Polymer Project Authors. All rights reserved.
  This code may only be used under the BSD style license found at http://polymer.github.io/LICENSE.txt
  The complete set of authors may be found at http://polymer.github.io/AUTHORS.txt
  The complete set of contributors may be found at http://polymer.github.io/CONTRIBUTORS.txt
  Code distributed by Google as part of the polymer project is also
  subject to an additional IP rights grant found at http://polymer.github.io/PATENTS.txt
  */
  let dl = 0;
  const S = function(r) {
    let e = (
      /** @type {!MixinFunction} */
      r.__mixinApplications
    );
    e || (e = /* @__PURE__ */ new WeakMap(), r.__mixinApplications = e);
    let t = dl++;
    function o(i) {
      let a = (
        /** @type {!MixinFunction} */
        i.__mixinSet
      );
      if (a && a[t])
        return i;
      let n = e, s = n.get(i);
      if (!s) {
        s = /** @type {!Function} */
        r(i), n.set(i, s);
        let l = Object.create(
          /** @type {!MixinFunction} */
          s.__mixinSet || a || null
        );
        l[t] = !0, s.__mixinSet = l;
      }
      return s;
    }
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
  let yo = {}, Da = {};
  function _i(r, e) {
    yo[r] = Da[r.toLowerCase()] = e;
  }
  function vi(r) {
    return yo[r] || Da[r.toLowerCase()];
  }
  function ul(r) {
    r.querySelector("style");
  }
  class Et extends HTMLElement {
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
    static import(e, t) {
      if (e) {
        let o = vi(e);
        return o && t ? o.querySelector(t) : o;
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
    attributeChangedCallback(e, t, o, i) {
      t !== o && this.register();
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
        const e = window.HTMLImports && HTMLImports.importForElement ? HTMLImports.importForElement(this) || document : this.ownerDocument, t = vt(
          this.getAttribute("assetpath") || "",
          e.baseURI
        );
        this.__assetpath = vo(t);
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
    register(e) {
      if (e = e || this.id, e) {
        if (rr && vi(e) !== void 0)
          throw _i(e, null), new Error(`strictTemplatePolicy: dom-module ${e} re-registered`);
        this.id = e, _i(e, this), ul(this);
      }
    }
  }
  Et.prototype.modules = yo;
  customElements.define("dom-module", Et);
  /**
  @license
  Copyright (c) 2017 The Polymer Project Authors. All rights reserved.
  This code may only be used under the BSD style license found at http://polymer.github.io/LICENSE.txt
  The complete set of authors may be found at http://polymer.github.io/AUTHORS.txt
  The complete set of contributors may be found at http://polymer.github.io/CONTRIBUTORS.txt
  Code distributed by Google as part of the polymer project is also
  subject to an additional IP rights grant found at http://polymer.github.io/PATENTS.txt
  */
  const hl = "link[rel=import][type~=css]", pl = "include", yi = "shady-unscoped";
  function Oa(r) {
    return (
      /** @type {?DomModule} */
      Et.import(r)
    );
  }
  function ki(r) {
    let e = r.body ? r.body : r;
    const t = _o(
      e.textContent,
      r.baseURI
    ), o = document.createElement("style");
    return o.textContent = t, o;
  }
  function gl(r) {
    const e = r.trim().split(/\s+/), t = [];
    for (let o = 0; o < e.length; o++)
      t.push(...fl(e[o]));
    return t;
  }
  function fl(r) {
    const e = Oa(r);
    if (!e)
      return [];
    if (e._styles === void 0) {
      const t = [];
      t.push(...Ma(e));
      const o = (
        /** @type {?HTMLTemplateElement} */
        e.querySelector("template")
      );
      o && t.push(...$a(
        o,
        /** @type {templateWithAssetPath} */
        e.assetpath
      )), e._styles = t;
    }
    return e._styles;
  }
  function $a(r, e) {
    if (!r._styles) {
      const t = [], o = r.content.querySelectorAll("style");
      for (let i = 0; i < o.length; i++) {
        let a = o[i], n = a.getAttribute(pl);
        n && t.push(...gl(n).filter(function(s, l, c) {
          return c.indexOf(s) === l;
        })), e && (a.textContent = _o(
          a.textContent,
          /** @type {string} */
          e
        )), t.push(a);
      }
      r._styles = t;
    }
    return r._styles;
  }
  function bl(r) {
    let e = Oa(r);
    return e ? Ma(e) : [];
  }
  function Ma(r) {
    const e = [], t = r.querySelectorAll(hl);
    for (let o = 0; o < t.length; o++) {
      let i = t[o];
      if (i.import) {
        const a = i.import, n = i.hasAttribute(yi);
        if (n && !a._unscopedStyle) {
          const s = ki(a);
          s.setAttribute(yi, ""), a._unscopedStyle = s;
        } else
          a._style || (a._style = ki(a));
        e.push(n ? a._unscopedStyle : a._style);
      }
    }
    return e;
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
  const E = window.ShadyDOM && window.ShadyDOM.noPatch && window.ShadyDOM.wrap ? window.ShadyDOM.wrap : window.ShadyDOM ? (r) => ShadyDOM.patch(r) : (r) => r;
  /**
  @license
  Copyright (c) 2017 The Polymer Project Authors. All rights reserved.
  This code may only be used under the BSD style license found at http://polymer.github.io/LICENSE.txt
  The complete set of authors may be found at http://polymer.github.io/AUTHORS.txt
  The complete set of contributors may be found at http://polymer.github.io/CONTRIBUTORS.txt
  Code distributed by Google as part of the polymer project is also
  subject to an additional IP rights grant found at http://polymer.github.io/PATENTS.txt
  */
  function Yr(r) {
    return r.indexOf(".") >= 0;
  }
  function Ee(r) {
    let e = r.indexOf(".");
    return e === -1 ? r : r.slice(0, e);
  }
  function Ia(r, e) {
    return r.indexOf(e + ".") === 0;
  }
  function Pt(r, e) {
    return e.indexOf(r + ".") === 0;
  }
  function St(r, e, t) {
    return e + t.slice(r.length);
  }
  function ml(r, e) {
    return r === e || Ia(r, e) || Pt(r, e);
  }
  function bt(r) {
    if (Array.isArray(r)) {
      let e = [];
      for (let t = 0; t < r.length; t++) {
        let o = r[t].toString().split(".");
        for (let i = 0; i < o.length; i++)
          e.push(o[i]);
      }
      return e.join(".");
    } else
      return r;
  }
  function Na(r) {
    return Array.isArray(r) ? bt(r).split(".") : r.toString().split(".");
  }
  function L(r, e, t) {
    let o = r, i = Na(e);
    for (let a = 0; a < i.length; a++) {
      if (!o)
        return;
      let n = i[a];
      o = o[n];
    }
    return t && (t.path = i.join(".")), o;
  }
  function xi(r, e, t) {
    let o = r, i = Na(e), a = i[i.length - 1];
    if (i.length > 1) {
      for (let n = 0; n < i.length - 1; n++) {
        let s = i[n];
        if (o = o[s], !o)
          return;
      }
      o[a] = t;
    } else
      o[e] = t;
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
  const or = {}, _l = /-[a-z]/g, vl = /([A-Z])/g;
  function za(r) {
    return or[r] || (or[r] = r.indexOf("-") < 0 ? r : r.replace(
      _l,
      (e) => e[1].toUpperCase()
    ));
  }
  function cr(r) {
    return or[r] || (or[r] = r.replace(vl, "-$1").toLowerCase());
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
  let yl = 0, La = 0, ze = [], kl = 0, Wr = !1, Ra = document.createTextNode("");
  new window.MutationObserver(xl).observe(Ra, { characterData: !0 });
  function xl() {
    Wr = !1;
    const r = ze.length;
    for (let e = 0; e < r; e++) {
      let t = ze[e];
      if (t)
        try {
          t();
        } catch (o) {
          setTimeout(() => {
            throw o;
          });
        }
    }
    ze.splice(0, r), La += r;
  }
  const wl = {
    /**
     * Returns a sub-module with the async interface providing the provided
     * delay.
     *
     * @memberof timeOut
     * @param {number=} delay Time to wait before calling callbacks in ms
     * @return {!AsyncInterface} An async timeout interface
     */
    after(r) {
      return {
        run(e) {
          return window.setTimeout(e, r);
        },
        cancel(e) {
          window.clearTimeout(e);
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
    run(r, e) {
      return window.setTimeout(r, e);
    },
    /**
     * Cancels a previously enqueued `timeOut` callback.
     *
     * @memberof timeOut
     * @param {number} handle Handle returned from `run` of callback to cancel
     * @return {void}
     */
    cancel(r) {
      window.clearTimeout(r);
    }
  }, ko = {
    /**
     * Enqueues a function called at microtask timing.
     *
     * @memberof microTask
     * @param {!Function=} callback Callback to run
     * @return {number} Handle used for canceling task
     */
    run(r) {
      return Wr || (Wr = !0, Ra.textContent = kl++), ze.push(r), yl++;
    },
    /**
     * Cancels a previously enqueued `microTask` callback.
     *
     * @memberof microTask
     * @param {number} handle Handle returned from `run` of callback to cancel
     * @return {void}
     */
    cancel(r) {
      const e = r - La;
      if (e >= 0) {
        if (!ze[e])
          throw new Error("invalid async handle: " + r);
        ze[e] = null;
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
  const Cl = ko, Fa = S(
    /**
     * @template T
     * @param {function(new:T)} superClass Class to apply mixin to.
     * @return {function(new:T)} superClass with mixin applied.
     */
    (r) => {
      class e extends r {
        /**
         * Creates property accessors for the given property names.
         * @param {!Object} props Object whose keys are names of accessors.
         * @return {void}
         * @protected
         * @nocollapse
         */
        static createProperties(o) {
          const i = this.prototype;
          for (let a in o)
            a in i || i._createPropertyAccessor(a);
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
        static attributeNameForProperty(o) {
          return o.toLowerCase();
        }
        /**
         * Override point to provide a type to which to deserialize a value to
         * a given property.
         * @param {string} name Name of property
         *
         * @protected
         * @nocollapse
         */
        static typeForProperty(o) {
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
        _createPropertyAccessor(o, i) {
          this._addPropertyToAttributeMap(o), this.hasOwnProperty(JSCompiler_renameProperty("__dataHasAccessor", this)) || (this.__dataHasAccessor = Object.assign({}, this.__dataHasAccessor)), this.__dataHasAccessor[o] || (this.__dataHasAccessor[o] = !0, this._definePropertyAccessor(o, i));
        }
        /**
         * Adds the given `property` to a map matching attribute names
         * to property names, using `attributeNameForProperty`. This map is
         * used when deserializing attribute values to properties.
         *
         * @param {string} property Name of the property
         * @override
         */
        _addPropertyToAttributeMap(o) {
          this.hasOwnProperty(JSCompiler_renameProperty("__dataAttributes", this)) || (this.__dataAttributes = Object.assign({}, this.__dataAttributes));
          let i = this.__dataAttributes[o];
          return i || (i = this.constructor.attributeNameForProperty(o), this.__dataAttributes[i] = o), i;
        }
        /**
         * Defines a property accessor for the given property.
         * @param {string} property Name of the property
         * @param {boolean=} readOnly When true, no setter is created
         * @return {void}
         * @override
         */
        _definePropertyAccessor(o, i) {
          Object.defineProperty(this, o, {
            /* eslint-disable valid-jsdoc */
            /** @this {PropertiesChanged} */
            get() {
              return this.__data[o];
            },
            /** @this {PropertiesChanged} */
            set: i ? function() {
            } : function(a) {
              this._setPendingProperty(o, a, !0) && this._invalidateProperties();
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
          for (let o in this.__dataHasAccessor)
            this.hasOwnProperty(o) && (this.__dataInstanceProps = this.__dataInstanceProps || {}, this.__dataInstanceProps[o] = this[o], delete this[o]);
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
        _initializeInstanceProperties(o) {
          Object.assign(this, o);
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
        _setProperty(o, i) {
          this._setPendingProperty(o, i) && this._invalidateProperties();
        }
        /**
         * Returns the value for the given property.
         * @param {string} property Name of property
         * @return {*} Value for the given property
         * @protected
         * @override
         */
        _getProperty(o) {
          return this.__data[o];
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
        _setPendingProperty(o, i, a) {
          let n = this.__data[o], s = this._shouldPropertyChange(o, i, n);
          return s && (this.__dataPending || (this.__dataPending = {}, this.__dataOld = {}), this.__dataOld && !(o in this.__dataOld) && (this.__dataOld[o] = n), this.__data[o] = i, this.__dataPending[o] = i), s;
        }
        /* eslint-enable */
        /**
         * @param {string} property Name of the property
         * @return {boolean} Returns true if the property is pending.
         */
        _isPropertyPending(o) {
          return !!(this.__dataPending && this.__dataPending.hasOwnProperty(o));
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
          !this.__dataInvalid && this.__dataReady && (this.__dataInvalid = !0, Cl.run(() => {
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
          const o = this.__data, i = this.__dataPending, a = this.__dataOld;
          this._shouldPropertiesChange(o, i, a) && (this.__dataPending = null, this.__dataOld = null, this._propertiesChanged(o, i, a)), this.__dataCounter--;
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
        _shouldPropertiesChange(o, i, a) {
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
        _propertiesChanged(o, i, a) {
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
        _shouldPropertyChange(o, i, a) {
          return (
            // Strict equality check
            a !== i && // This ensures (old==NaN, value==NaN) always returns false
            (a === a || i === i)
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
        attributeChangedCallback(o, i, a, n) {
          i !== a && this._attributeToProperty(o, a), super.attributeChangedCallback && super.attributeChangedCallback(o, i, a, n);
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
        _attributeToProperty(o, i, a) {
          if (!this.__serializing) {
            const n = this.__dataAttributes, s = n && n[o] || o;
            this[s] = this._deserializeValue(i, a || this.constructor.typeForProperty(s));
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
        _propertyToAttribute(o, i, a) {
          this.__serializing = !0, a = arguments.length < 3 ? this[o] : a, this._valueToNodeAttribute(
            /** @type {!HTMLElement} */
            this,
            a,
            i || this.constructor.attributeNameForProperty(o)
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
        _valueToNodeAttribute(o, i, a) {
          const n = this._serializeValue(i);
          (a === "class" || a === "name" || a === "slot") && (o = /** @type {?Element} */
          E(o)), n === void 0 ? o.removeAttribute(a) : o.setAttribute(
            a,
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
        _serializeValue(o) {
          switch (typeof o) {
            case "boolean":
              return o ? "" : void 0;
            default:
              return o != null ? o.toString() : void 0;
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
        _deserializeValue(o, i) {
          switch (i) {
            case Boolean:
              return o !== null;
            case Number:
              return Number(o);
            default:
              return o;
          }
        }
      }
      return e;
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
  const Ha = {};
  let Yt = HTMLElement.prototype;
  for (; Yt; ) {
    let r = Object.getOwnPropertyNames(Yt);
    for (let e = 0; e < r.length; e++)
      Ha[r[e]] = !0;
    Yt = Object.getPrototypeOf(Yt);
  }
  const Al = window.trustedTypes ? (r) => trustedTypes.isHTML(r) || trustedTypes.isScript(r) || trustedTypes.isScriptURL(r) : () => !1;
  function El(r, e) {
    if (!Ha[e]) {
      let t = r[e];
      t !== void 0 && (r.__data ? r._setPendingProperty(e, t) : (r.__dataProto ? r.hasOwnProperty(JSCompiler_renameProperty("__dataProto", r)) || (r.__dataProto = Object.create(r.__dataProto)) : r.__dataProto = {}, r.__dataProto[e] = t));
    }
  }
  const Pl = S((r) => {
    const e = Fa(r);
    class t extends e {
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
        for (let a = 0; a < i.length; a++)
          this.prototype._createPropertyAccessor(za(i[a]));
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
        return cr(i);
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
        for (let a in i)
          this._setProperty(a, i[a]);
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
      _ensureAttribute(i, a) {
        const n = (
          /** @type {!HTMLElement} */
          this
        );
        n.hasAttribute(i) || this._valueToNodeAttribute(n, a, i);
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
              if (Al(i))
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
      _deserializeValue(i, a) {
        let n;
        switch (a) {
          case Object:
            try {
              n = JSON.parse(
                /** @type {string} */
                i
              );
            } catch {
              n = i;
            }
            break;
          case Array:
            try {
              n = JSON.parse(
                /** @type {string} */
                i
              );
            } catch {
              n = null;
            }
            break;
          case Date:
            n = isNaN(i) ? String(i) : Number(i), n = new Date(n);
            break;
          default:
            n = super._deserializeValue(i, a);
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
      _definePropertyAccessor(i, a) {
        El(this, i), super._definePropertyAccessor(i, a);
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
    return t;
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
  const Sl = {
    "dom-if": !0,
    "dom-repeat": !0
  };
  let wi = !1, Ci = !1;
  function Tl() {
    if (!wi) {
      wi = !0;
      const r = document.createElement("textarea");
      r.placeholder = "a", Ci = r.placeholder === r.textContent;
    }
    return Ci;
  }
  function Dl(r) {
    Tl() && r.localName === "textarea" && r.placeholder && r.placeholder === r.textContent && (r.textContent = null);
  }
  const Ol = (() => {
    const r = window.trustedTypes && window.trustedTypes.createPolicy(
      "polymer-template-event-attribute-policy",
      {
        createScript: (e) => e
      }
    );
    return (e, t, o) => {
      const i = t.getAttribute(o);
      if (r && o.startsWith("on-")) {
        e.setAttribute(
          o,
          r.createScript(i, o)
        );
        return;
      }
      e.setAttribute(o, i);
    };
  })();
  function $l(r) {
    let e = r.getAttribute("is");
    if (e && Sl[e]) {
      let t = r;
      for (t.removeAttribute("is"), r = t.ownerDocument.createElement(e), t.parentNode.replaceChild(r, t), r.appendChild(t); t.attributes.length; ) {
        const { name: o } = t.attributes[0];
        Ol(r, t, o), t.removeAttribute(o);
      }
    }
    return r;
  }
  function Ba(r, e) {
    let t = e.parentInfo && Ba(r, e.parentInfo);
    if (t) {
      for (let o = t.firstChild, i = 0; o; o = o.nextSibling)
        if (e.parentIndex === i++)
          return o;
    } else
      return r;
  }
  function Ml(r, e, t, o) {
    o.id && (e[o.id] = t);
  }
  function Il(r, e, t) {
    if (t.events && t.events.length)
      for (let o = 0, i = t.events, a; o < i.length && (a = i[o]); o++)
        r._addMethodEventListenerToNode(e, a.name, a.value, r);
  }
  function Nl(r, e, t, o) {
    t.templateInfo && (e._templateInfo = t.templateInfo, e._parentTemplateInfo = o);
  }
  function zl(r, e, t) {
    return r = r._methodHost || r, function(i) {
      r[t] && r[t](i, i.detail);
    };
  }
  const Ll = S(
    /**
     * @template T
     * @param {function(new:T)} superClass Class to apply mixin to.
     * @return {function(new:T)} superClass with mixin applied.
     */
    (r) => {
      class e extends r {
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
        static _parseTemplate(o, i) {
          if (!o._templateInfo) {
            let a = o._templateInfo = {};
            a.nodeInfoList = [], a.nestedTemplate = !!i, a.stripWhiteSpace = i && i.stripWhiteSpace || o.hasAttribute && o.hasAttribute("strip-whitespace"), this._parseTemplateContent(
              o,
              a,
              /** @type {?} */
              { parent: null }
            );
          }
          return o._templateInfo;
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
        static _parseTemplateContent(o, i, a) {
          return this._parseTemplateNode(o.content, i, a);
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
        static _parseTemplateNode(o, i, a) {
          let n = !1, s = (
            /** @type {!HTMLTemplateElement} */
            o
          );
          return s.localName == "template" && !s.hasAttribute("preserve-content") ? n = this._parseTemplateNestedTemplate(s, i, a) || n : s.localName === "slot" && (i.hasInsertionPoint = !0), Dl(s), s.firstChild && this._parseTemplateChildNodes(s, i, a), s.hasAttributes && s.hasAttributes() && (n = this._parseTemplateNodeAttributes(s, i, a) || n), n || a.noted;
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
        static _parseTemplateChildNodes(o, i, a) {
          if (!(o.localName === "script" || o.localName === "style"))
            for (let n = o.firstChild, s = 0, l; n; n = l) {
              if (n.localName == "template" && (n = $l(n)), l = n.nextSibling, n.nodeType === Node.TEXT_NODE) {
                let d = l;
                for (; d && d.nodeType === Node.TEXT_NODE; )
                  n.textContent += d.textContent, l = d.nextSibling, o.removeChild(d), d = l;
                if (i.stripWhiteSpace && !n.textContent.trim()) {
                  o.removeChild(n);
                  continue;
                }
              }
              let c = (
                /** @type {!NodeInfo} */
                { parentIndex: s, parentInfo: a }
              );
              this._parseTemplateNode(n, i, c) && (c.infoIndex = i.nodeInfoList.push(c) - 1), n.parentNode && s++;
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
        static _parseTemplateNestedTemplate(o, i, a) {
          let n = (
            /** @type {!HTMLTemplateElement} */
            o
          ), s = this._parseTemplate(n, i);
          return (s.content = n.content.ownerDocument.createDocumentFragment()).appendChild(n.content), a.templateInfo = s, !0;
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
        static _parseTemplateNodeAttributes(o, i, a) {
          let n = !1, s = Array.from(o.attributes);
          for (let l = s.length - 1, c; c = s[l]; l--)
            n = this._parseTemplateNodeAttribute(o, i, a, c.name, c.value) || n;
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
        static _parseTemplateNodeAttribute(o, i, a, n, s) {
          return n.slice(0, 3) === "on-" ? (o.removeAttribute(n), a.events = a.events || [], a.events.push({
            name: n.slice(3),
            value: s
          }), !0) : n === "id" ? (a.id = s, !0) : !1;
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
        static _contentForTemplate(o) {
          let i = (
            /** @type {HTMLTemplateElementWithInfo} */
            o._templateInfo
          );
          return i && i.content || o.content;
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
        _stampTemplate(o, i) {
          o && !o.content && window.HTMLTemplateElement && HTMLTemplateElement.decorate && HTMLTemplateElement.decorate(o), i = i || this.constructor._parseTemplate(o);
          let a = i.nodeInfoList, n = i.content || o.content, s = (
            /** @type {DocumentFragment} */
            document.importNode(n, !0)
          );
          s.__noInsertionPoint = !i.hasInsertionPoint;
          let l = s.nodeList = new Array(a.length);
          s.$ = {};
          for (let c = 0, d = a.length, u; c < d && (u = a[c]); c++) {
            let p = l[c] = Ba(s, u);
            Ml(this, s.$, p, u), Nl(this, p, u, i), Il(this, p, u);
          }
          return s = /** @type {!StampedTemplate} */
          s, s;
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
        _addMethodEventListenerToNode(o, i, a, n) {
          n = n || o;
          let s = zl(n, i, a);
          return this._addEventListenerToNode(o, i, s), s;
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
        _addEventListenerToNode(o, i, a) {
          o.addEventListener(i, a);
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
        _removeEventListenerFromNode(o, i, a) {
          o.removeEventListener(i, a);
        }
      }
      return e;
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
  let Tt = 0;
  const Dt = [], k = {
    COMPUTE: "__computeEffects",
    REFLECT: "__reflectEffects",
    NOTIFY: "__notifyEffects",
    PROPAGATE: "__propagateEffects",
    OBSERVE: "__observeEffects",
    READ_ONLY: "__readOnly"
  }, ja = "__computeInfo", Rl = /[A-Z]/;
  function Pr(r, e, t) {
    let o = r[e];
    if (!o)
      o = r[e] = {};
    else if (!r.hasOwnProperty(e) && (o = r[e] = Object.create(r[e]), t))
      for (let i in o) {
        let a = o[i], n = o[i] = Array(a.length);
        for (let s = 0; s < a.length; s++)
          n[s] = a[s];
      }
    return o;
  }
  function mt(r, e, t, o, i, a) {
    if (e) {
      let n = !1;
      const s = Tt++;
      for (let l in t) {
        let c = i ? Ee(l) : l, d = e[c];
        if (d)
          for (let u = 0, p = d.length, g; u < p && (g = d[u]); u++)
            (!g.info || g.info.lastRun !== s) && (!i || xo(l, g.trigger)) && (g.info && (g.info.lastRun = s), g.fn(r, l, t, o, g.info, i, a), n = !0);
      }
      return n;
    }
    return !1;
  }
  function Fl(r, e, t, o, i, a, n, s) {
    let l = !1, c = n ? Ee(o) : o, d = e[c];
    if (d)
      for (let u = 0, p = d.length, g; u < p && (g = d[u]); u++)
        (!g.info || g.info.lastRun !== t) && (!n || xo(o, g.trigger)) && (g.info && (g.info.lastRun = t), g.fn(r, o, i, a, g.info, n, s), l = !0);
    return l;
  }
  function xo(r, e) {
    if (e) {
      let t = (
        /** @type {string} */
        e.name
      );
      return t == r || !!(e.structured && Ia(t, r)) || !!(e.wildcard && Pt(t, r));
    } else
      return !0;
  }
  function Ai(r, e, t, o, i) {
    let a = typeof i.method == "string" ? r[i.method] : i.method, n = i.property;
    a ? a.call(r, r.__data[n], o[n]) : i.dynamicFn;
  }
  function Hl(r, e, t, o, i) {
    let a = r[k.NOTIFY], n, s = Tt++;
    for (let c in e)
      e[c] && (a && Fl(r, a, s, c, t, o, i) || i && Bl(r, c, t)) && (n = !0);
    let l;
    n && (l = r.__dataHost) && l._invalidateProperties && l._invalidateProperties();
  }
  function Bl(r, e, t) {
    let o = Ee(e);
    if (o !== e) {
      let i = cr(o) + "-changed";
      return Ua(r, i, t[e], e), !0;
    }
    return !1;
  }
  function Ua(r, e, t, o) {
    let i = {
      value: t,
      queueProperty: !0
    };
    o && (i.path = o), E(
      /** @type {!HTMLElement} */
      r
    ).dispatchEvent(new CustomEvent(e, { detail: i }));
  }
  function jl(r, e, t, o, i, a) {
    let s = (a ? Ee(e) : e) != e ? e : null, l = s ? L(r, s) : r.__data[e];
    s && l === void 0 && (l = t[e]), Ua(r, i.eventName, l, s);
  }
  function Ul(r, e, t, o, i) {
    let a, n = (
      /** @type {Object} */
      r.detail
    ), s = n && n.path;
    s ? (o = St(t, o, s), a = n && n.value) : a = r.currentTarget[t], a = i ? !a : a, (!e[k.READ_ONLY] || !e[k.READ_ONLY][o]) && e._setPendingPropertyOrPath(o, a, !0, !!s) && (!n || !n.queueProperty) && e._invalidateProperties();
  }
  function Vl(r, e, t, o, i) {
    let a = r.__data[e];
    tr && (a = tr(
      a,
      i.attrName,
      "attribute",
      /** @type {Node} */
      r
    )), r._propertyToAttribute(e, i.attrName, a);
  }
  function ql(r, e, t, o) {
    let i = r[k.COMPUTE];
    if (i)
      if (sl) {
        Tt++;
        const a = Wl(r), n = [];
        for (let l in e)
          Ei(l, i, n, a, o);
        let s;
        for (; s = n.shift(); )
          Va(r, "", e, t, s) && Ei(s.methodInfo, i, n, a, o);
        Object.assign(
          /** @type {!Object} */
          t,
          r.__dataOld
        ), Object.assign(
          /** @type {!Object} */
          e,
          r.__dataPending
        ), r.__dataPending = null;
      } else {
        let a = e;
        for (; mt(r, i, a, t, o); )
          Object.assign(
            /** @type {!Object} */
            t,
            r.__dataOld
          ), Object.assign(
            /** @type {!Object} */
            e,
            r.__dataPending
          ), a = r.__dataPending, r.__dataPending = null;
      }
  }
  const Yl = (r, e, t) => {
    let o = 0, i = e.length - 1, a = -1;
    for (; o <= i; ) {
      const n = o + i >> 1, s = t.get(e[n].methodInfo) - t.get(r.methodInfo);
      if (s < 0)
        o = n + 1;
      else if (s > 0)
        i = n - 1;
      else {
        a = n;
        break;
      }
    }
    a < 0 && (a = i + 1), e.splice(a, 0, r);
  }, Ei = (r, e, t, o, i) => {
    const a = i ? Ee(r) : r, n = e[a];
    if (n)
      for (let s = 0; s < n.length; s++) {
        const l = n[s];
        l.info.lastRun !== Tt && (!i || xo(r, l.trigger)) && (l.info.lastRun = Tt, Yl(l.info, t, o));
      }
  };
  function Wl(r) {
    let e = r.constructor.__orderedComputedDeps;
    if (!e) {
      e = /* @__PURE__ */ new Map();
      const t = r[k.COMPUTE];
      let { counts: o, ready: i, total: a } = Gl(r), n;
      for (; n = i.shift(); ) {
        e.set(n, e.size);
        const s = t[n];
        s && s.forEach((l) => {
          const c = l.info.methodInfo;
          --a, --o[c] === 0 && i.push(c);
        });
      }
      if (a !== 0) {
        const s = (
          /** @type {HTMLElement} */
          r
        );
      }
      r.constructor.__orderedComputedDeps = e;
    }
    return e;
  }
  function Gl(r) {
    const e = r[ja], t = {}, o = r[k.COMPUTE], i = [];
    let a = 0;
    for (let n in e) {
      const s = e[n];
      a += t[n] = s.args.filter((l) => !l.literal).length + (s.dynamicFn ? 1 : 0);
    }
    for (let n in o)
      e[n] || i.push(n);
    return { counts: t, ready: i, total: a };
  }
  function Va(r, e, t, o, i) {
    let a = Gr(r, e, t, o, i);
    if (a === Dt)
      return !1;
    let n = i.methodInfo;
    return r.__dataHasAccessor && r.__dataHasAccessor[n] ? r._setPendingProperty(n, a, !0) : (r[n] = a, !1);
  }
  function Kl(r, e, t) {
    let o = r.__dataLinkedPaths;
    if (o) {
      let i;
      for (let a in o) {
        let n = o[a];
        Pt(a, e) ? (i = St(a, n, e), r._setPendingPropertyOrPath(i, t, !0, !0)) : Pt(n, e) && (i = St(n, a, e), r._setPendingPropertyOrPath(i, t, !0, !0));
      }
    }
  }
  function Sr(r, e, t, o, i, a, n) {
    t.bindings = t.bindings || [];
    let s = { kind: o, target: i, parts: a, literal: n, isCompound: a.length !== 1 };
    if (t.bindings.push(s), ec(s)) {
      let { event: c, negate: d } = s.parts[0];
      s.listenerEvent = c || cr(i) + "-changed", s.listenerNegate = d;
    }
    let l = e.nodeInfoList.length;
    for (let c = 0; c < s.parts.length; c++) {
      let d = s.parts[c];
      d.compoundIndex = c, Xl(r, e, s, d, l);
    }
  }
  function Xl(r, e, t, o, i) {
    if (!o.literal && !(t.kind === "attribute" && t.target[0] === "-")) {
      let a = o.dependencies, n = { index: i, binding: t, part: o, evaluator: r };
      for (let s = 0; s < a.length; s++) {
        let l = a[s];
        typeof l == "string" && (l = Ya(l), l.wildcard = !0), r._addTemplatePropertyEffect(e, l.rootProperty, {
          fn: Jl,
          info: n,
          trigger: l
        });
      }
    }
  }
  function Jl(r, e, t, o, i, a, n) {
    let s = n[i.index], l = i.binding, c = i.part;
    if (a && c.source && e.length > c.source.length && l.kind == "property" && !l.isCompound && s.__isPropertyEffectsClient && s.__dataHasAccessor && s.__dataHasAccessor[l.target]) {
      let d = t[e];
      e = St(c.source, l.target, e), s._setPendingPropertyOrPath(e, d, !1, !0) && r._enqueueClient(s);
    } else {
      let d = i.evaluator._evaluateBinding(r, c, e, t, o, a);
      d !== Dt && Ql(r, s, l, c, d);
    }
  }
  function Ql(r, e, t, o, i) {
    if (i = Zl(e, i, t, o), tr && (i = tr(i, t.target, t.kind, e)), t.kind == "attribute")
      r._valueToNodeAttribute(
        /** @type {Element} */
        e,
        i,
        t.target
      );
    else {
      let a = t.target;
      e.__isPropertyEffectsClient && e.__dataHasAccessor && e.__dataHasAccessor[a] ? (!e[k.READ_ONLY] || !e[k.READ_ONLY][a]) && e._setPendingProperty(a, i) && r._enqueueClient(e) : r._setUnmanagedPropertyToNode(e, a, i);
    }
  }
  function Zl(r, e, t, o) {
    if (t.isCompound) {
      let i = r.__dataCompoundStorage[t.target];
      i[o.compoundIndex] = e, e = i.join("");
    }
    return t.kind !== "attribute" && (t.target === "textContent" || t.target === "value" && (r.localName === "input" || r.localName === "textarea")) && (e = e ?? ""), e;
  }
  function ec(r) {
    return !!r.target && r.kind != "attribute" && r.kind != "text" && !r.isCompound && r.parts[0].mode === "{";
  }
  function tc(r, e) {
    let { nodeList: t, nodeInfoList: o } = e;
    if (o.length)
      for (let i = 0; i < o.length; i++) {
        let a = o[i], n = t[i], s = a.bindings;
        if (s)
          for (let l = 0; l < s.length; l++) {
            let c = s[l];
            rc(n, c), oc(n, r, c);
          }
        n.__dataHost = r;
      }
  }
  function rc(r, e) {
    if (e.isCompound) {
      let t = r.__dataCompoundStorage || (r.__dataCompoundStorage = {}), o = e.parts, i = new Array(o.length);
      for (let n = 0; n < o.length; n++)
        i[n] = o[n].literal;
      let a = e.target;
      t[a] = i, e.literal && e.kind == "property" && (a === "className" && (r = E(r)), r[a] = e.literal);
    }
  }
  function oc(r, e, t) {
    if (t.listenerEvent) {
      let o = t.parts[0];
      r.addEventListener(t.listenerEvent, function(i) {
        Ul(i, e, t.target, o.source, o.negate);
      });
    }
  }
  function Pi(r, e, t, o, i, a) {
    a = e.static || a && (typeof a != "object" || a[e.methodName]);
    let n = {
      methodName: e.methodName,
      args: e.args,
      methodInfo: i,
      dynamicFn: a
    };
    for (let s = 0, l; s < e.args.length && (l = e.args[s]); s++)
      l.literal || r._addPropertyEffect(l.rootProperty, t, {
        fn: o,
        info: n,
        trigger: l
      });
    return a && r._addPropertyEffect(e.methodName, t, {
      fn: o,
      info: n
    }), n;
  }
  function Gr(r, e, t, o, i) {
    let a = r._methodHost || r, n = a[i.methodName];
    if (n) {
      let s = r._marshalArgs(i.args, e, t);
      return s === Dt ? Dt : n.apply(a, s);
    } else
      i.dynamicFn;
  }
  const ic = [], qa = "(?:[a-zA-Z_$][\\w.:$\\-*]*)", ac = "(?:[-+]?[0-9]*\\.?[0-9]+(?:[eE][-+]?[0-9]+)?)", nc = "(?:'(?:[^'\\\\]|\\\\.)*')", sc = '(?:"(?:[^"\\\\]|\\\\.)*")', lc = "(?:" + nc + "|" + sc + ")", Si = "(?:(" + qa + "|" + ac + "|" + lc + ")\\s*)", cc = "(?:" + Si + "(?:,\\s*" + Si + ")*)", dc = "(?:\\(\\s*(?:" + cc + "?)\\)\\s*)", uc = "(" + qa + "\\s*" + dc + "?)", hc = "(\\[\\[|{{)\\s*", pc = "(?:]]|}})", gc = "(?:(!)\\s*)?", fc = hc + gc + uc + pc, Ti = new RegExp(fc, "g");
  function Di(r) {
    let e = "";
    for (let t = 0; t < r.length; t++) {
      let o = r[t].literal;
      e += o || "";
    }
    return e;
  }
  function Tr(r) {
    let e = r.match(/([^\s]+?)\(([\s\S]*)\)/);
    if (e) {
      let o = { methodName: e[1], static: !0, args: ic };
      if (e[2].trim()) {
        let i = e[2].replace(/\\,/g, "&comma;").split(",");
        return bc(i, o);
      } else
        return o;
    }
    return null;
  }
  function bc(r, e) {
    return e.args = r.map(function(t) {
      let o = Ya(t);
      return o.literal || (e.static = !1), o;
    }, this), e;
  }
  function Ya(r) {
    let e = r.trim().replace(/&comma;/g, ",").replace(/\\(.)/g, "$1"), t = {
      name: e,
      value: "",
      literal: !1
    }, o = e[0];
    switch (o === "-" && (o = e[1]), o >= "0" && o <= "9" && (o = "#"), o) {
      case "'":
      case '"':
        t.value = e.slice(1, -1), t.literal = !0;
        break;
      case "#":
        t.value = Number(e), t.literal = !0;
        break;
    }
    return t.literal || (t.rootProperty = Ee(e), t.structured = Yr(e), t.structured && (t.wildcard = e.slice(-2) == ".*", t.wildcard && (t.name = e.slice(0, -2)))), t;
  }
  function Oi(r, e, t) {
    let o = L(r, t);
    return o === void 0 && (o = e[t]), o;
  }
  function Wa(r, e, t, o) {
    const i = { indexSplices: o };
    qr && !r._overrideLegacyUndefined && (e.splices = i), r.notifyPath(t + ".splices", i), r.notifyPath(t + ".length", e.length), qr && !r._overrideLegacyUndefined && (i.indexSplices = []);
  }
  function dt(r, e, t, o, i, a) {
    Wa(r, e, t, [{
      index: o,
      addedCount: i,
      removed: a,
      object: e,
      type: "splice"
    }]);
  }
  function mc(r) {
    return r[0].toUpperCase() + r.substring(1);
  }
  const wo = S((r) => {
    const e = Ll(Pl(r));
    class t extends e {
      constructor() {
        super(), this.__isPropertyEffectsClient = !0, this.__dataClientsReady, this.__dataPendingClients, this.__dataToNotify, this.__dataLinkedPaths, this.__dataHasPaths, this.__dataCompoundStorage, this.__dataHost, this.__dataTemp, this.__dataClientsInitialized, this.__data, this.__dataPending, this.__dataOld, this.__computeEffects, this.__computeInfo, this.__reflectEffects, this.__notifyEffects, this.__propagateEffects, this.__observeEffects, this.__readOnly, this.__templateInfo, this._overrideLegacyUndefined;
      }
      get PROPERTY_EFFECT_TYPES() {
        return k;
      }
      /**
       * @override
       * @return {void}
       */
      _initializeProperties() {
        super._initializeProperties(), this._registerHost(), this.__dataClientsReady = !1, this.__dataPendingClients = null, this.__dataToNotify = null, this.__dataLinkedPaths = null, this.__dataHasPaths = !1, this.__dataCompoundStorage = this.__dataCompoundStorage || null, this.__dataHost = this.__dataHost || null, this.__dataTemp = {}, this.__dataClientsInitialized = !1;
      }
      _registerHost() {
        if (ut.length) {
          let i = ut[ut.length - 1];
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
        let a = this[k.READ_ONLY];
        for (let n in i)
          (!a || !a[n]) && (this.__dataPending = this.__dataPending || {}, this.__dataOld = this.__dataOld || {}, this.__data[n] = this.__dataPending[n] = i[n]);
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
      _addPropertyEffect(i, a, n) {
        this._createPropertyAccessor(i, a == k.READ_ONLY);
        let s = Pr(this, a, !0)[i];
        s || (s = this[a][i] = []), s.push(n);
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
      _removePropertyEffect(i, a, n) {
        let s = Pr(this, a, !0)[i], l = s.indexOf(n);
        l >= 0 && s.splice(l, 1);
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
      _hasPropertyEffect(i, a) {
        let n = this[a];
        return !!(n && n[i]);
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
        return this._hasPropertyEffect(i, k.READ_ONLY);
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
        return this._hasPropertyEffect(i, k.NOTIFY);
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
        return this._hasPropertyEffect(i, k.REFLECT);
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
        return this._hasPropertyEffect(i, k.COMPUTE);
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
      _setPendingPropertyOrPath(i, a, n, s) {
        if (s || Ee(Array.isArray(i) ? i[0] : i) !== i) {
          if (!s) {
            let l = L(this, i);
            if (i = /** @type {string} */
            xi(this, i, a), !i || !super._shouldPropertyChange(i, a, l))
              return !1;
          }
          if (this.__dataHasPaths = !0, this._setPendingProperty(
            /**@type{string}*/
            i,
            a,
            n
          ))
            return Kl(
              this,
              /**@type{string}*/
              i,
              a
            ), !0;
        } else {
          if (this.__dataHasAccessor && this.__dataHasAccessor[i])
            return this._setPendingProperty(
              /**@type{string}*/
              i,
              a,
              n
            );
          this[i] = a;
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
      _setUnmanagedPropertyToNode(i, a, n) {
        (n !== i[a] || typeof n == "object") && (a === "className" && (i = /** @type {!Node} */
        E(i)), i[a] = n);
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
      _setPendingProperty(i, a, n) {
        let s = this.__dataHasPaths && Yr(i), l = s ? this.__dataTemp : this.__data;
        return this._shouldPropertyChange(i, a, l[i]) ? (this.__dataPending || (this.__dataPending = {}, this.__dataOld = {}), i in this.__dataOld || (this.__dataOld[i] = this.__data[i]), s ? this.__dataTemp[i] = a : this.__data[i] = a, this.__dataPending[i] = a, (s || this[k.NOTIFY] && this[k.NOTIFY][i]) && (this.__dataToNotify = this.__dataToNotify || {}, this.__dataToNotify[i] = n), !0) : !1;
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
      _setProperty(i, a) {
        this._setPendingProperty(i, a, !0) && this._invalidateProperties();
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
          for (let a = 0; a < i.length; a++) {
            let n = i[a];
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
      setProperties(i, a) {
        for (let n in i)
          (a || !this[k.READ_ONLY] || !this[k.READ_ONLY][n]) && this._setPendingPropertyOrPath(n, i[n], !0);
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
      _propertiesChanged(i, a, n) {
        let s = this.__dataHasPaths;
        this.__dataHasPaths = !1;
        let l;
        ql(this, a, n, s), l = this.__dataToNotify, this.__dataToNotify = null, this._propagatePropertyChanges(a, n, s), this._flushClients(), mt(this, this[k.REFLECT], a, n, s), mt(this, this[k.OBSERVE], a, n, s), l && Hl(this, l, a, n, s), this.__dataCounter == 1 && (this.__dataTemp = {});
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
      _propagatePropertyChanges(i, a, n) {
        this[k.PROPAGATE] && mt(this, this[k.PROPAGATE], i, a, n), this.__templateInfo && this._runEffectsForTemplate(this.__templateInfo, i, a, n);
      }
      _runEffectsForTemplate(i, a, n, s) {
        const l = (c, d) => {
          mt(
            this,
            i.propertyEffects,
            c,
            n,
            d,
            i.nodeList
          );
          for (let u = i.firstChild; u; u = u.nextSibling)
            this._runEffectsForTemplate(u, c, n, d);
        };
        i.runEffects ? i.runEffects(l, a, s) : l(a, s);
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
      linkPaths(i, a) {
        i = bt(i), a = bt(a), this.__dataLinkedPaths = this.__dataLinkedPaths || {}, this.__dataLinkedPaths[i] = a;
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
        i = bt(i), this.__dataLinkedPaths && delete this.__dataLinkedPaths[i];
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
      notifySplices(i, a) {
        let n = { path: "" }, s = (
          /** @type {Array} */
          L(this, i, n)
        );
        Wa(this, s, n.path, a);
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
      get(i, a) {
        return L(a || this, i);
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
      set(i, a, n) {
        n ? xi(n, i, a) : (!this[k.READ_ONLY] || !this[k.READ_ONLY][
          /** @type {string} */
          i
        ]) && this._setPendingPropertyOrPath(i, a, !0) && this._invalidateProperties();
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
      push(i, ...a) {
        let n = { path: "" }, s = (
          /** @type {Array}*/
          L(this, i, n)
        ), l = s.length, c = s.push(...a);
        return a.length && dt(this, s, n.path, l, a.length, []), c;
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
        let a = { path: "" }, n = (
          /** @type {Array} */
          L(this, i, a)
        ), s = !!n.length, l = n.pop();
        return s && dt(this, n, a.path, n.length, 0, [l]), l;
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
      splice(i, a, n, ...s) {
        let l = { path: "" }, c = (
          /** @type {Array} */
          L(this, i, l)
        );
        a < 0 ? a = c.length - Math.floor(-a) : a && (a = Math.floor(a));
        let d;
        return arguments.length === 2 ? d = c.splice(a) : d = c.splice(a, n, ...s), (s.length || d.length) && dt(this, c, l.path, a, s.length, d), d;
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
        let a = { path: "" }, n = (
          /** @type {Array} */
          L(this, i, a)
        ), s = !!n.length, l = n.shift();
        return s && dt(this, n, a.path, 0, 0, [l]), l;
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
      unshift(i, ...a) {
        let n = { path: "" }, s = (
          /** @type {Array} */
          L(this, i, n)
        ), l = s.unshift(...a);
        return a.length && dt(this, s, n.path, 0, a.length, []), l;
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
      notifyPath(i, a) {
        let n;
        if (arguments.length == 1) {
          let s = { path: "" };
          a = L(this, i, s), n = s.path;
        } else
          Array.isArray(i) ? n = bt(i) : n = /** @type{string} */
          i;
        this._setPendingPropertyOrPath(n, a, !0, !0) && this._invalidateProperties();
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
      _createReadOnlyProperty(i, a) {
        this._addPropertyEffect(i, k.READ_ONLY), a && (this["_set" + mc(i)] = /** @this {PropertyEffects} */
        function(n) {
          this._setProperty(i, n);
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
      _createPropertyObserver(i, a, n) {
        let s = { property: i, method: a, dynamicFn: !!n };
        this._addPropertyEffect(i, k.OBSERVE, {
          fn: Ai,
          info: s,
          trigger: { name: i }
        }), n && this._addPropertyEffect(
          /** @type {string} */
          a,
          k.OBSERVE,
          {
            fn: Ai,
            info: s,
            trigger: { name: a }
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
      _createMethodObserver(i, a) {
        let n = Tr(i);
        if (!n)
          throw new Error("Malformed observer expression '" + i + "'");
        Pi(this, n, k.OBSERVE, Gr, null, a);
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
        this._addPropertyEffect(i, k.NOTIFY, {
          fn: jl,
          info: {
            eventName: cr(i) + "-changed",
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
        let a = this.constructor.attributeNameForProperty(i);
        a[0] === "-" || this._addPropertyEffect(i, k.REFLECT, {
          fn: Vl,
          info: {
            attrName: a
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
      _createComputedProperty(i, a, n) {
        let s = Tr(a);
        if (!s)
          throw new Error("Malformed computed expression '" + a + "'");
        const l = Pi(this, s, k.COMPUTE, Va, i, n);
        Pr(this, ja)[i] = l;
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
      _marshalArgs(i, a, n) {
        const s = this.__data, l = [];
        for (let c = 0, d = i.length; c < d; c++) {
          let { name: u, structured: p, wildcard: g, value: b, literal: f } = i[c];
          if (!f)
            if (g) {
              const m = Pt(u, a), _ = Oi(s, n, m ? a : u);
              b = {
                path: m ? a : u,
                value: _,
                base: m ? L(s, u) : _
              };
            } else
              b = p ? Oi(s, n, u) : s[u];
          if (qr && !this._overrideLegacyUndefined && b === void 0 && i.length > 1)
            return Dt;
          l[c] = b;
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
      static addPropertyEffect(i, a, n) {
        this.prototype._addPropertyEffect(i, a, n);
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
      static createPropertyObserver(i, a, n) {
        this.prototype._createPropertyObserver(i, a, n);
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
      static createMethodObserver(i, a) {
        this.prototype._createMethodObserver(i, a);
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
      static createReadOnlyProperty(i, a) {
        this.prototype._createReadOnlyProperty(i, a);
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
      static createComputedProperty(i, a, n) {
        this.prototype._createComputedProperty(i, a, n);
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
      _bindTemplate(i, a) {
        let n = this.constructor._parseTemplate(i), s = this.__preBoundTemplateInfo == n;
        if (!s)
          for (let l in n.propertyEffects)
            this._createPropertyAccessor(l);
        if (a)
          if (n = /** @type {!TemplateInfo} */
          Object.create(n), n.wasPreBound = s, !this.__templateInfo)
            this.__templateInfo = n;
          else {
            const l = i._parentTemplateInfo || this.__templateInfo, c = l.lastChild;
            n.parent = l, l.lastChild = n, n.previousSibling = c, c ? c.nextSibling = n : l.firstChild = n;
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
      static _addTemplatePropertyEffect(i, a, n) {
        let s = i.hostProps = i.hostProps || {};
        s[a] = !0;
        let l = i.propertyEffects = i.propertyEffects || {};
        (l[a] = l[a] || []).push(n);
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
      _stampTemplate(i, a) {
        a = a || /** @type {!TemplateInfo} */
        this._bindTemplate(i, !0), ut.push(this);
        let n = super._stampTemplate(i, a);
        if (ut.pop(), a.nodeList = n.nodeList, !a.wasPreBound) {
          let s = a.childNodes = [];
          for (let l = n.firstChild; l; l = l.nextSibling)
            s.push(l);
        }
        return n.templateInfo = a, tc(this, a), this.__dataClientsReady && (this._runEffectsForTemplate(a, this.__data, null, !1), this._flushClients()), n;
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
        const a = i.templateInfo, { previousSibling: n, nextSibling: s, parent: l } = a;
        n ? n.nextSibling = s : l && (l.firstChild = s), s ? s.previousSibling = n : l && (l.lastChild = n), a.nextSibling = a.previousSibling = null;
        let c = a.childNodes;
        for (let d = 0; d < c.length; d++) {
          let u = c[d];
          E(E(u).parentNode).removeChild(u);
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
      static _parseTemplateNode(i, a, n) {
        let s = e._parseTemplateNode.call(
          this,
          i,
          a,
          n
        );
        if (i.nodeType === Node.TEXT_NODE) {
          let l = this._parseBindings(i.textContent, a);
          l && (i.textContent = Di(l) || " ", Sr(this, a, n, "text", "textContent", l), s = !0);
        }
        return s;
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
      static _parseTemplateNodeAttribute(i, a, n, s, l) {
        let c = this._parseBindings(l, a);
        if (c) {
          let d = s, u = "property";
          Rl.test(s) ? u = "attribute" : s[s.length - 1] == "$" && (s = s.slice(0, -1), u = "attribute");
          let p = Di(c);
          return p && u == "attribute" && (s == "class" && i.hasAttribute("class") && (p += " " + i.getAttribute(s)), i.setAttribute(s, p)), u == "attribute" && d == "disable-upgrade$" && i.setAttribute(s, ""), i.localName === "input" && d === "value" && i.setAttribute(d, ""), i.removeAttribute(d), u === "property" && (s = za(s)), Sr(this, a, n, u, s, c, p), !0;
        } else
          return e._parseTemplateNodeAttribute.call(
            this,
            i,
            a,
            n,
            s,
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
      static _parseTemplateNestedTemplate(i, a, n) {
        let s = e._parseTemplateNestedTemplate.call(
          this,
          i,
          a,
          n
        );
        const l = i.parentNode, c = n.templateInfo, d = l.localName === "dom-if", u = l.localName === "dom-repeat";
        bi && (d || u) && (l.removeChild(i), n = n.parentInfo, n.templateInfo = c, n.noted = !0, s = !1);
        let p = c.hostProps;
        if (ll && d)
          p && (a.hostProps = Object.assign(a.hostProps || {}, p), bi || (n.parentInfo.noted = !0));
        else {
          let g = "{";
          for (let b in p) {
            let f = [{ mode: g, source: b, dependencies: [b], hostProp: !0 }];
            Sr(this, a, n, "property", "_host_" + b, f);
          }
        }
        return s;
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
      static _parseBindings(i, a) {
        let n = [], s = 0, l;
        for (; (l = Ti.exec(i)) !== null; ) {
          l.index > s && n.push({ literal: i.slice(s, l.index) });
          let c = l[1][0], d = !!l[2], u = l[3].trim(), p = !1, g = "", b = -1;
          c == "{" && (b = u.indexOf("::")) > 0 && (g = u.substring(b + 2), u = u.substring(0, b), p = !0);
          let f = Tr(u), m = [];
          if (f) {
            let { args: _, methodName: v } = f;
            for (let y = 0; y < _.length; y++) {
              let w = _[y];
              w.literal || m.push(w);
            }
            let x = a.dynamicFns;
            (x && x[v] || f.static) && (m.push(v), f.dynamicFn = !0);
          } else
            m.push(u);
          n.push({
            source: u,
            mode: c,
            negate: d,
            customEvent: p,
            signature: f,
            dependencies: m,
            event: g
          }), s = Ti.lastIndex;
        }
        if (s && s < i.length) {
          let c = i.substring(s);
          c && n.push({
            literal: c
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
      static _evaluateBinding(i, a, n, s, l, c) {
        let d;
        return a.signature ? d = Gr(i, n, s, l, a.signature) : n != a.source ? d = L(i, a.source) : c && Yr(n) ? d = L(i, n) : d = i.__data[n], a.negate && (d = !d), d;
      }
    }
    return t;
  }), ut = [];
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
  function _c(r) {
    const e = {};
    for (let t in r) {
      const o = r[t];
      e[t] = typeof o == "function" ? { type: o } : o;
    }
    return e;
  }
  const vc = S((r) => {
    const e = Fa(r);
    function t(a) {
      const n = Object.getPrototypeOf(a);
      return n.prototype instanceof i ? (
        /** @type {!PropertiesMixinConstructor} */
        n
      ) : null;
    }
    function o(a) {
      if (!a.hasOwnProperty(JSCompiler_renameProperty("__ownProperties", a))) {
        let n = null;
        if (a.hasOwnProperty(JSCompiler_renameProperty("properties", a))) {
          const s = a.properties;
          s && (n = _c(s));
        }
        a.__ownProperties = n;
      }
      return a.__ownProperties;
    }
    class i extends e {
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
          this.__observedAttributes = n ? Object.keys(n).map((s) => this.prototype._addPropertyToAttributeMap(s)) : [];
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
          const n = t(
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
        const n = o(
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
          const n = t(
            /** @type {!PropertiesMixinConstructor} */
            this
          );
          this.__properties = Object.assign(
            {},
            n && n._properties,
            o(
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
        const s = this._properties[n];
        return s && s.type;
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
  const yc = "3.5.1", $i = window.ShadyCSS && window.ShadyCSS.cssBuild, Ga = S((r) => {
    const e = vc(wo(r));
    function t(l) {
      if (!l.hasOwnProperty(
        JSCompiler_renameProperty("__propertyDefaults", l)
      )) {
        l.__propertyDefaults = null;
        let c = l._properties;
        for (let d in c) {
          let u = c[d];
          "value" in u && (l.__propertyDefaults = l.__propertyDefaults || {}, l.__propertyDefaults[d] = u);
        }
      }
      return l.__propertyDefaults;
    }
    function o(l) {
      return l.hasOwnProperty(
        JSCompiler_renameProperty("__ownObservers", l)
      ) || (l.__ownObservers = l.hasOwnProperty(
        JSCompiler_renameProperty("observers", l)
      ) ? (
        /** @type {PolymerElementConstructor} */
        l.observers
      ) : null), l.__ownObservers;
    }
    function i(l, c, d, u) {
      d.computed && (d.readOnly = !0), d.computed && (l._hasReadOnlyEffect(c) || l._createComputedProperty(c, d.computed, u)), d.readOnly && !l._hasReadOnlyEffect(c) ? l._createReadOnlyProperty(c, !d.computed) : d.readOnly === !1 && l._hasReadOnlyEffect(c), d.reflectToAttribute && !l._hasReflectEffect(c) ? l._createReflectedProperty(c) : d.reflectToAttribute === !1 && l._hasReflectEffect(c), d.notify && !l._hasNotifyEffect(c) ? l._createNotifyingProperty(c) : d.notify === !1 && l._hasNotifyEffect(c), d.observer && l._createPropertyObserver(c, d.observer, u[d.observer]), l._addPropertyToAttributeMap(c);
    }
    function a(l, c, d, u) {
      if (!$i) {
        const p = c.content.querySelectorAll("style"), g = $a(c), b = bl(d), f = c.content.firstElementChild;
        for (let _ = 0; _ < b.length; _++) {
          let v = b[_];
          v.textContent = l._processStyleText(v.textContent, u), c.content.insertBefore(v, f);
        }
        let m = 0;
        for (let _ = 0; _ < g.length; _++) {
          let v = g[_], x = p[m];
          x !== v ? (v = v.cloneNode(!0), x.parentNode.insertBefore(v, x)) : m++, v.textContent = l._processStyleText(v.textContent, u);
        }
      }
      if (window.ShadyCSS && window.ShadyCSS.prepareTemplate(c, d), cl && $i && ol) {
        const p = c.content.querySelectorAll("style");
        if (p) {
          let g = "";
          Array.from(p).forEach((b) => {
            g += b.textContent, b.parentNode.removeChild(b);
          }), l._styleSheet = new CSSStyleSheet(), l._styleSheet.replaceSync(g);
        }
      }
    }
    function n(l) {
      let c = null;
      if (l && (!rr || al) && (c = /** @type {?HTMLTemplateElement} */
      Et.import(l, "template"), rr && !c))
        throw new Error(`strictTemplatePolicy: expecting dom-module or null template for ${l}`);
      return c;
    }
    class s extends e {
      /**
       * Current Polymer version in Semver notation.
       * @type {string} Semver notation of the current version of Polymer.
       * @nocollapse
       */
      static get polymerElementVersion() {
        return yc;
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
        e._finalizeClass.call(this);
        const c = o(this);
        c && this.createObservers(c, this._properties), this._prepareTemplate();
      }
      /** @nocollapse */
      static _prepareTemplate() {
        let c = (
          /** @type {PolymerElementConstructor} */
          this.template
        );
        c && (typeof c == "string" ? c = null : Sa || (c = c.cloneNode(!0))), this.prototype._template = c;
      }
      /**
       * Override of PropertiesChanged createProperties to create accessors
       * and property effects for all of the properties.
       * @param {!Object} props .
       * @return {void}
       * @protected
       * @nocollapse
       */
      static createProperties(c) {
        for (let d in c)
          i(
            /** @type {?} */
            this.prototype,
            d,
            c[d],
            c
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
      static createObservers(c, d) {
        const u = this.prototype;
        for (let p = 0; p < c.length; p++)
          u._createMethodObserver(c[p], d);
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
          let c = this.prototype.hasOwnProperty(
            JSCompiler_renameProperty("_template", this.prototype)
          ) ? this.prototype._template : void 0;
          typeof c == "function" && (c = c()), this._template = // If user has put template on prototype (e.g. in legacy via registered
          // callback or info object), prefer that first. Note that `null` is
          // used as a sentinel to indicate "no template" and can be used to
          // override a super template, whereas `undefined` is used as a
          // sentinel to mean "fall-back to default template lookup" via
          // dom-module and/or super.template.
          c !== void 0 ? c : (
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
      static set template(c) {
        this._template = c;
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
          const c = this.importMeta;
          if (c)
            this._importPath = vo(c.url);
          else {
            const d = Et.import(
              /** @type {PolymerElementConstructor} */
              this.is
            );
            this._importPath = d && d.assetpath || Object.getPrototypeOf(
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
        ), super._initializeProperties(), this.rootPath = il, this.importPath = this.constructor.importPath;
        let c = t(this.constructor);
        if (c)
          for (let d in c) {
            let u = c[d];
            if (this._canApplyPropertyDefault(d)) {
              let p = typeof u.value == "function" ? u.value.call(this) : u.value;
              this._hasAccessor(d) ? this._setPendingProperty(d, p, !0) : this[d] = p;
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
      _canApplyPropertyDefault(c) {
        return !this.hasOwnProperty(c);
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
      static _processStyleText(c, d) {
        return _o(c, d);
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
      static _finalizeTemplate(c) {
        const d = this.prototype._template;
        if (d && !d.__polymerFinalized) {
          d.__polymerFinalized = !0;
          const u = this.importPath, p = u ? vt(u) : "";
          a(this, d, c, p), this.prototype._bindTemplate(d);
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
      _attachDom(c) {
        const d = E(this);
        if (d.attachShadow)
          return c ? (d.shadowRoot || (d.attachShadow({ mode: "open", shadyUpgradeFragment: c }), d.shadowRoot.appendChild(c), this.constructor._styleSheet && (d.shadowRoot.adoptedStyleSheets = [this.constructor._styleSheet])), nl && window.ShadyDOM && window.ShadyDOM.flushInitial(d.shadowRoot), d.shadowRoot) : null;
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
      updateStyles(c) {
        window.ShadyCSS && window.ShadyCSS.styleSubtree(
          /** @type {!HTMLElement} */
          this,
          c
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
      resolveUrl(c, d) {
        return !d && this.importPath && (d = vt(this.importPath)), vt(c, d);
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
      static _parseTemplateContent(c, d, u) {
        return d.dynamicFns = d.dynamicFns || this._properties, e._parseTemplateContent.call(
          this,
          c,
          d,
          u
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
      static _addTemplatePropertyEffect(c, d, u) {
        return Ta && !(d in this._properties) && // Methods used in templates with no dependencies (or only literal
        // dependencies) become accessors with template effects; ignore these
        !(u.info.part.signature && u.info.part.signature.static) && // Warnings for bindings added to nested templates are handled by
        // templatizer so ignore both the host-to-template bindings
        // (`hostProp`) and TemplateInstance-to-child bindings
        // (`nestedTemplate`)
        !u.info.part.hostProp && c.nestedTemplate, e._addTemplatePropertyEffect.call(
          this,
          c,
          d,
          u
        );
      }
    }
    return s;
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
  const Mi = window.trustedTypes && trustedTypes.createPolicy("polymer-html-literal", { createHTML: (r) => r });
  class Ka {
    /**
     * @param {!ITemplateArray} strings Constant parts of tagged template literal
     * @param {!Array<*>} values Variable parts of tagged template literal
     */
    constructor(e, t) {
      Ja(e, t);
      const o = t.reduce(
        (i, a, n) => i + Xa(a) + e[n + 1],
        e[0]
      );
      this.value = o.toString();
    }
    /**
     * @return {string} LiteralString string value
     * @override
     */
    toString() {
      return this.value;
    }
  }
  function Xa(r) {
    if (r instanceof Ka)
      return (
        /** @type {!LiteralString} */
        r.value
      );
    throw new Error(
      `non-literal value passed to Polymer's htmlLiteral function: ${r}`
    );
  }
  function kc(r) {
    if (r instanceof HTMLTemplateElement)
      return (
        /** @type {!HTMLTemplateElement } */
        r.innerHTML
      );
    if (r instanceof Ka)
      return Xa(r);
    throw new Error(
      `non-template value passed to Polymer's html function: ${r}`
    );
  }
  const Pe = function(e, ...t) {
    Ja(e, t);
    const o = (
      /** @type {!HTMLTemplateElement} */
      document.createElement("template")
    );
    let i = t.reduce(
      (a, n, s) => a + kc(n) + e[s + 1],
      e[0]
    );
    return Mi && (i = Mi.createHTML(i)), o.innerHTML = i, o;
  }, Ja = (r, e) => {
    if (!Array.isArray(r) || !Array.isArray(r.raw) || e.length !== r.length - 1)
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
  const ue = Ga(HTMLElement);
  /**
   * @license
   * Copyright (c) 2021 - 2022 Vaadin Ltd.
   * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
   */
  class Dr {
    /**
     * Get the scroll type in the current browser view.
     *
     * @return {string} the scroll type. Possible values are `default|reverse|negative`
     */
    static detectScrollType() {
      const e = document.createElement("div");
      e.textContent = "ABCD", e.dir = "rtl", e.style.fontSize = "14px", e.style.width = "4px", e.style.height = "1px", e.style.position = "absolute", e.style.top = "-1000px", e.style.overflow = "scroll", document.body.appendChild(e);
      let t = "reverse";
      return e.scrollLeft > 0 ? t = "default" : (e.scrollLeft = 2, e.scrollLeft < 2 && (t = "negative")), document.body.removeChild(e), t;
    }
    /**
     * Get the scrollLeft value of the element relative to the direction
     *
     * @param {string} scrollType type of the scroll detected with `detectScrollType`
     * @param {string} direction current direction of the element
     * @param {Element} element
     * @return {number} the scrollLeft value.
     */
    static getNormalizedScrollLeft(e, t, o) {
      const { scrollLeft: i } = o;
      if (t !== "rtl" || !e)
        return i;
      switch (e) {
        case "negative":
          return o.scrollWidth - o.clientWidth + i;
        case "reverse":
          return o.scrollWidth - o.clientWidth - i;
        default:
          return i;
      }
    }
    /**
     * Set the scrollLeft value of the element relative to the direction
     *
     * @param {string} scrollType type of the scroll detected with `detectScrollType`
     * @param {string} direction current direction of the element
     * @param {Element} element
     * @param {number} scrollLeft the scrollLeft value to be set
     */
    static setNormalizedScrollLeft(e, t, o, i) {
      if (t !== "rtl" || !e) {
        o.scrollLeft = i;
        return;
      }
      switch (e) {
        case "negative":
          o.scrollLeft = o.clientWidth - o.scrollWidth + i;
          break;
        case "reverse":
          o.scrollLeft = o.scrollWidth - o.clientWidth - i;
          break;
        default:
          o.scrollLeft = i;
          break;
      }
    }
  }
  /**
   * @license
   * Copyright (c) 2021 - 2022 Vaadin Ltd.
   * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
   */
  const te = [];
  function xc() {
    const r = Xr();
    te.forEach((e) => {
      Kr(e, r);
    });
  }
  let Wt;
  const wc = new MutationObserver(xc);
  wc.observe(document.documentElement, { attributes: !0, attributeFilter: ["dir"] });
  function Kr(r, e, t = r.getAttribute("dir")) {
    e ? r.setAttribute("dir", e) : t != null && r.removeAttribute("dir");
  }
  function Xr() {
    return document.documentElement.getAttribute("dir");
  }
  const dr = (r) => class extends r {
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
            fromAttribute: (t) => t || "",
            toAttribute: (t) => t === "" ? null : t
          }
        }
      };
    }
    /** @protected */
    static finalize() {
      super.finalize(), Wt || (Wt = Dr.detectScrollType());
    }
    /** @protected */
    connectedCallback() {
      super.connectedCallback(), (!this.hasAttribute("dir") || this.__restoreSubscription) && (this.__subscribe(), Kr(this, Xr(), null));
    }
    /** @protected */
    attributeChangedCallback(t, o, i) {
      if (super.attributeChangedCallback(t, o, i), t !== "dir")
        return;
      const a = Xr(), n = i === a && te.indexOf(this) === -1, s = !i && o && te.indexOf(this) === -1;
      n || s ? (this.__subscribe(), Kr(this, a, i)) : i !== a && o === a && this.__unsubscribe();
    }
    /** @protected */
    disconnectedCallback() {
      super.disconnectedCallback(), this.__restoreSubscription = te.includes(this), this.__unsubscribe();
    }
    /** @protected */
    _valueToNodeAttribute(t, o, i) {
      i === "dir" && o === "" && !t.hasAttribute("dir") || super._valueToNodeAttribute(t, o, i);
    }
    /** @protected */
    _attributeToProperty(t, o, i) {
      t === "dir" && !o ? this.dir = "" : super._attributeToProperty(t, o, i);
    }
    /** @private */
    __subscribe() {
      te.includes(this) || te.push(this);
    }
    /** @private */
    __unsubscribe() {
      te.includes(this) && te.splice(te.indexOf(this), 1);
    }
    /**
     * @param {Element} element
     * @return {number}
     * @protected
     */
    __getNormalizedScrollLeft(t) {
      return Dr.getNormalizedScrollLeft(Wt, this.getAttribute("dir") || "ltr", t);
    }
    /**
     * @param {Element} element
     * @param {number} scrollLeft
     * @protected
     */
    __setNormalizedScrollLeft(t, o) {
      return Dr.setNormalizedScrollLeft(Wt, this.getAttribute("dir") || "ltr", t, o);
    }
  };
  /**
   * @license
   * Copyright (c) 2021 - 2022 Vaadin Ltd.
   * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
   */
  class Ii extends it(dr(ue)) {
    static get is() {
      return "vaadin-input-container";
    }
    static get template() {
      return Pe`
      <style>
        :host {
          display: flex;
          align-items: center;
          flex: 0 1 auto;
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
      super.ready(), this.addEventListener("pointerdown", (e) => {
        e.target === this && e.preventDefault();
      }), this.addEventListener("click", (e) => {
        e.target === this && this.shadowRoot.querySelector("slot:not([name])").assignedNodes({ flatten: !0 }).forEach((t) => t.focus && t.focus());
      });
    }
  }
  customElements.define(Ii.is, Ii);
  /**
   * @license
   * Copyright (c) 2017 - 2022 Vaadin Ltd.
   * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
   */
  const Cc = A`
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
`, Qa = document.createElement("template");
  Qa.innerHTML = `<style>${Cc.toString().replace(":host", "html")}</style>`;
  document.head.appendChild(Qa.content);
  /**
   * @license
   * Copyright (c) 2017 - 2022 Vaadin Ltd.
   * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
   */
  const Co = A`
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
  $("", Co, { moduleId: "lumo-overlay" });
  $("vaadin-overlay", Co, { moduleId: "lumo-vaadin-overlay" });
  /**
  @license
  Copyright (c) 2017 The Polymer Project Authors. All rights reserved.
  This code may only be used under the BSD style license found at http://polymer.github.io/LICENSE.txt
  The complete set of authors may be found at http://polymer.github.io/AUTHORS.txt
  The complete set of contributors may be found at http://polymer.github.io/CONTRIBUTORS.txt
  Code distributed by Google as part of the polymer project is also
  subject to an additional IP rights grant found at http://polymer.github.io/PATENTS.txt
  */
  function ht(r, e, t) {
    return {
      index: r,
      removed: e,
      addedCount: t
    };
  }
  const Za = 0, en = 1, Jr = 2, Qr = 3;
  function Ac(r, e, t, o, i, a) {
    let n = a - i + 1, s = t - e + 1, l = new Array(n);
    for (let c = 0; c < n; c++)
      l[c] = new Array(s), l[c][0] = c;
    for (let c = 0; c < s; c++)
      l[0][c] = c;
    for (let c = 1; c < n; c++)
      for (let d = 1; d < s; d++)
        if (Ao(r[e + d - 1], o[i + c - 1]))
          l[c][d] = l[c - 1][d - 1];
        else {
          let u = l[c - 1][d] + 1, p = l[c][d - 1] + 1;
          l[c][d] = u < p ? u : p;
        }
    return l;
  }
  function Ec(r) {
    let e = r.length - 1, t = r[0].length - 1, o = r[e][t], i = [];
    for (; e > 0 || t > 0; ) {
      if (e == 0) {
        i.push(Jr), t--;
        continue;
      }
      if (t == 0) {
        i.push(Qr), e--;
        continue;
      }
      let a = r[e - 1][t - 1], n = r[e - 1][t], s = r[e][t - 1], l;
      n < s ? l = n < a ? n : a : l = s < a ? s : a, l == a ? (a == o ? i.push(Za) : (i.push(en), o = a), e--, t--) : l == n ? (i.push(Qr), e--, o = n) : (i.push(Jr), t--, o = s);
    }
    return i.reverse(), i;
  }
  function Pc(r, e, t, o, i, a) {
    let n = 0, s = 0, l, c = Math.min(t - e, a - i);
    if (e == 0 && i == 0 && (n = Sc(r, o, c)), t == r.length && a == o.length && (s = Tc(r, o, c - n)), e += n, i += n, t -= s, a -= s, t - e == 0 && a - i == 0)
      return [];
    if (e == t) {
      for (l = ht(e, [], 0); i < a; )
        l.removed.push(o[i++]);
      return [l];
    } else if (i == a)
      return [ht(e, [], t - e)];
    let d = Ec(
      Ac(
        r,
        e,
        t,
        o,
        i,
        a
      )
    );
    l = void 0;
    let u = [], p = e, g = i;
    for (let b = 0; b < d.length; b++)
      switch (d[b]) {
        case Za:
          l && (u.push(l), l = void 0), p++, g++;
          break;
        case en:
          l || (l = ht(p, [], 0)), l.addedCount++, p++, l.removed.push(o[g]), g++;
          break;
        case Jr:
          l || (l = ht(p, [], 0)), l.addedCount++, p++;
          break;
        case Qr:
          l || (l = ht(p, [], 0)), l.removed.push(o[g]), g++;
          break;
      }
    return l && u.push(l), u;
  }
  function Sc(r, e, t) {
    for (let o = 0; o < t; o++)
      if (!Ao(r[o], e[o]))
        return o;
    return t;
  }
  function Tc(r, e, t) {
    let o = r.length, i = e.length, a = 0;
    for (; a < t && Ao(r[--o], e[--i]); )
      a++;
    return a;
  }
  function Dc(r, e) {
    return Pc(
      r,
      0,
      r.length,
      e,
      0,
      e.length
    );
  }
  function Ao(r, e) {
    return r === e;
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
  function De(r) {
    return r.localName === "slot";
  }
  let tn = class {
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
    static getFlattenedNodes(r) {
      const e = E(r);
      return De(r) ? (r = /** @type {!HTMLSlotElement} */
      r, e.assignedNodes({ flatten: !0 })) : Array.from(e.childNodes).map((t) => De(t) ? (t = /** @type {!HTMLSlotElement} */
      t, E(t).assignedNodes({ flatten: !0 })) : [t]).reduce((t, o) => t.concat(o), []);
    }
    /**
     * @param {!HTMLElement} target Node on which to listen for changes.
     * @param {?function(this: Element, { target: !HTMLElement, addedNodes: !Array<!Element>, removedNodes: !Array<!Element> }):void} callback Function called when there are additions
     * or removals from the target's list of flattened nodes.
     */
    // eslint-disable-next-line
    constructor(r, e) {
      this._shadyChildrenObserver = null, this._nativeChildrenObserver = null, this._connected = !1, this._target = r, this.callback = e, this._effectiveNodes = [], this._observer = null, this._scheduled = !1, this._boundSchedule = () => {
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
      De(this._target) ? this._listenSlots([this._target]) : E(this._target).children && (this._listenSlots(
        /** @type {!NodeList<!Node>} */
        E(this._target).children
      ), window.ShadyDOM ? this._shadyChildrenObserver = window.ShadyDOM.observeChildren(this._target, (r) => {
        this._processMutations(r);
      }) : (this._nativeChildrenObserver = new MutationObserver((r) => {
        this._processMutations(r);
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
      De(this._target) ? this._unlistenSlots([this._target]) : E(this._target).children && (this._unlistenSlots(
        /** @type {!NodeList<!Node>} */
        E(this._target).children
      ), window.ShadyDOM && this._shadyChildrenObserver ? (window.ShadyDOM.unobserveChildren(this._shadyChildrenObserver), this._shadyChildrenObserver = null) : this._nativeChildrenObserver && (this._nativeChildrenObserver.disconnect(), this._nativeChildrenObserver = null)), this._connected = !1;
    }
    /**
     * @return {void}
     * @private
     */
    _schedule() {
      this._scheduled || (this._scheduled = !0, ko.run(() => this.flush()));
    }
    /**
     * @param {Array<MutationRecord>} mutations Mutations signaled by the mutation observer
     * @return {void}
     * @private
     */
    _processMutations(r) {
      this._processSlotMutations(r), this.flush();
    }
    /**
     * @param {Array<MutationRecord>} mutations Mutations signaled by the mutation observer
     * @return {void}
     * @private
     */
    _processSlotMutations(r) {
      if (r)
        for (let e = 0; e < r.length; e++) {
          let t = r[e];
          t.addedNodes && this._listenSlots(t.addedNodes), t.removedNodes && this._unlistenSlots(t.removedNodes);
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
      let r = {
        target: this._target,
        addedNodes: [],
        removedNodes: []
      }, e = this.constructor.getFlattenedNodes(this._target), t = Dc(
        e,
        this._effectiveNodes
      );
      for (let i = 0, a; i < t.length && (a = t[i]); i++)
        for (let n = 0, s; n < a.removed.length && (s = a.removed[n]); n++)
          r.removedNodes.push(s);
      for (let i = 0, a; i < t.length && (a = t[i]); i++)
        for (let n = a.index; n < a.index + a.addedCount; n++)
          r.addedNodes.push(e[n]);
      this._effectiveNodes = e;
      let o = !1;
      return (r.addedNodes.length || r.removedNodes.length) && (o = !0, this.callback.call(this._target, r)), o;
    }
    /**
     * @param {!Array<!Node>|!NodeList<!Node>} nodeList Nodes that could change
     * @return {void}
     * @private
     */
    _listenSlots(r) {
      for (let e = 0; e < r.length; e++) {
        let t = r[e];
        De(t) && t.addEventListener("slotchange", this._boundSchedule);
      }
    }
    /**
     * @param {!Array<!Node>|!NodeList<!Node>} nodeList Nodes that could change
     * @return {void}
     * @private
     */
    _unlistenSlots(r) {
      for (let e = 0; e < r.length; e++) {
        let t = r[e];
        De(t) && t.removeEventListener("slotchange", this._boundSchedule);
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
  let Zr = !1, Oc = [], rn = [];
  function $c() {
    Zr = !0, requestAnimationFrame(function() {
      Zr = !1, Mc(Oc), setTimeout(function() {
        Ic(rn);
      });
    });
  }
  function Mc(r) {
    for (; r.length; )
      on(r.shift());
  }
  function Ic(r) {
    for (let e = 0, t = r.length; e < t; e++)
      on(r.shift());
  }
  function on(r) {
    const e = r[0], t = r[1], o = r[2];
    try {
      t.apply(e, o);
    } catch (i) {
      setTimeout(() => {
        throw i;
      });
    }
  }
  function an(r, e, t) {
    Zr || $c(), rn.push([r, e, t]);
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
  function Eo(r, e, t, o, i) {
    let a;
    i && (a = typeof t == "object" && t !== null, a && (o = r.__dataTemp[e]));
    let n = o !== t && (o === o || t === t);
    return a && n && (r.__dataTemp[e] = t), n;
  }
  const Po = S((r) => {
    class e extends r {
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
      _shouldPropertyChange(o, i, a) {
        return Eo(this, o, i, a, !0);
      }
    }
    return e;
  }), Nc = S((r) => {
    class e extends r {
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
      _shouldPropertyChange(o, i, a) {
        return Eo(this, o, i, a, this.mutableData);
      }
    }
    return e;
  });
  Po._mutablePropertyChange = Eo;
  /**
  @license
  Copyright (c) 2017 The Polymer Project Authors. All rights reserved.
  This code may only be used under the BSD style license found at http://polymer.github.io/LICENSE.txt
  The complete set of authors may be found at http://polymer.github.io/AUTHORS.txt
  The complete set of contributors may be found at http://polymer.github.io/CONTRIBUTORS.txt
  Code distributed by Google as part of the polymer project is also
  subject to an additional IP rights grant found at http://polymer.github.io/PATENTS.txt
  */
  let eo = null;
  function to() {
    return eo;
  }
  to.prototype = Object.create(HTMLTemplateElement.prototype, {
    constructor: {
      value: to,
      writable: !0
    }
  });
  const nn = wo(to), zc = Po(nn);
  function Lc(r, e) {
    eo = r, Object.setPrototypeOf(r, e.prototype), new e(), eo = null;
  }
  const Rc = wo(class {
  });
  function Fc(r, e) {
    for (let t = 0; t < e.length; t++) {
      let o = e[t];
      if (!!r != !!o.__hideTemplateChildren__)
        if (o.nodeType === Node.TEXT_NODE)
          r ? (o.__polymerTextContent__ = o.textContent, o.textContent = "") : o.textContent = o.__polymerTextContent__;
        else if (o.localName === "slot")
          if (r)
            o.__polymerReplaced__ = document.createComment("hidden-slot"), E(E(o).parentNode).replaceChild(o.__polymerReplaced__, o);
          else {
            const i = o.__polymerReplaced__;
            i && E(E(i).parentNode).replaceChild(o, i);
          }
        else
          o.style && (r ? (o.__polymerDisplay__ = o.style.display, o.style.display = "none") : o.style.display = o.__polymerDisplay__);
      o.__hideTemplateChildren__ = r, o._showHideChildren && o._showHideChildren(r);
    }
  }
  class he extends Rc {
    constructor(e) {
      super(), this._configureProperties(e), this.root = this._stampTemplate(this.__dataHost);
      let t = [];
      this.children = /** @type {!NodeList} */
      t;
      for (let i = this.root.firstChild; i; i = i.nextSibling)
        t.push(i), i.__templatizeInstance = this;
      this.__templatizeOwner && this.__templatizeOwner.__hideTemplateChildren__ && this._showHideChildren(!0);
      let o = this.__templatizeOptions;
      (e && o.instanceProps || !o.instanceProps) && this._enableProperties();
    }
    /**
     * Configure the given `props` by calling `_setPendingProperty`. Also
     * sets any properties stored in `__hostProps`.
     * @private
     * @param {Object} props Object of property name-value pairs to set.
     * @return {void}
     */
    _configureProperties(e) {
      if (this.__templatizeOptions.forwardHostProp)
        for (let o in this.__hostProps)
          this._setPendingProperty(o, this.__dataHost["_host_" + o]);
      for (let o in e)
        this._setPendingProperty(o, e[o]);
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
    forwardHostProp(e, t) {
      this._setPendingPropertyOrPath(e, t, !1, !0) && this.__dataHost._enqueueClient(this);
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
    _addEventListenerToNode(e, t, o) {
      if (this._methodHost && this.__templatizeOptions.parentModel)
        this._methodHost._addEventListenerToNode(e, t, (i) => {
          i.model = this, o(i);
        });
      else {
        let i = this.__dataHost.__dataHost;
        i && i._addEventListenerToNode(e, t, o);
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
    _showHideChildren(e) {
      Fc(e, this.children);
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
    _setUnmanagedPropertyToNode(e, t, o) {
      e.__hideTemplateChildren__ && e.nodeType == Node.TEXT_NODE && t == "textContent" ? e.__polymerTextContent__ = o : super._setUnmanagedPropertyToNode(e, t, o);
    }
    /**
     * Find the parent model of this template instance.  The parent model
     * is either another templatize instance that had option `parentModel: true`,
     * or else the host element.
     *
     * @return {!Polymer_PropertyEffects} The parent model of this instance
     */
    get parentModel() {
      let e = this.__parentModel;
      if (!e) {
        let t;
        e = this;
        do
          e = e.__dataHost.__dataHost;
        while ((t = e.__templatizeOptions) && !t.parentModel);
        this.__parentModel = e;
      }
      return e;
    }
    /**
     * Stub of HTMLElement's `dispatchEvent`, so that effects that may
     * dispatch events safely no-op.
     *
     * @param {Event} event Event to dispatch
     * @return {boolean} Always true.
     * @override
     */
    dispatchEvent(e) {
      return !0;
    }
  }
  he.prototype.__dataHost;
  he.prototype.__templatizeOptions;
  he.prototype._methodHost;
  he.prototype.__templatizeOwner;
  he.prototype.__hostProps;
  const Hc = Po(
    // This cast shouldn't be neccessary, but Closure doesn't understand that
    // TemplateInstanceBase is a constructor function.
    /** @type {function(new:TemplateInstanceBase)} */
    he
  );
  function Ni(r) {
    let e = r.__dataHost;
    return e && e._methodHost || e;
  }
  function Bc(r, e, t) {
    let o = t.mutableData ? Hc : he;
    Ot.mixin && (o = Ot.mixin(o));
    let i = class extends o {
    };
    return i.prototype.__templatizeOptions = t, i.prototype._bindTemplate(r), Vc(i, r, e, t), i;
  }
  function jc(r, e, t, o) {
    let i = t.forwardHostProp;
    if (i && e.hasHostProps) {
      const a = r.localName == "template";
      let n = e.templatizeTemplateClass;
      if (!n) {
        if (a) {
          let l = t.mutableData ? zc : nn;
          class c extends l {
          }
          n = e.templatizeTemplateClass = c;
        } else {
          const l = r.constructor;
          class c extends l {
          }
          n = e.templatizeTemplateClass = c;
        }
        let s = e.hostProps;
        for (let l in s)
          n.prototype._addPropertyEffect(
            "_host_" + l,
            n.prototype.PROPERTY_EFFECT_TYPES.PROPAGATE,
            { fn: Uc(l, i) }
          ), n.prototype._createNotifyingProperty("_host_" + l);
        Ta && o && Wc(e, t, o);
      }
      if (r.__dataProto && Object.assign(r.__data, r.__dataProto), a)
        Lc(r, n), r.__dataTemp = {}, r.__dataPending = null, r.__dataOld = null, r._enableProperties();
      else {
        Object.setPrototypeOf(r, n.prototype);
        const s = e.hostProps;
        for (let l in s)
          if (l = "_host_" + l, l in r) {
            const c = r[l];
            delete r[l], r.__data[l] = c;
          }
      }
    }
  }
  function Uc(r, e) {
    return function(o, i, a) {
      e.call(
        o.__templatizeOwner,
        i.substring(6),
        a[i]
      );
    };
  }
  function Vc(r, e, t, o) {
    let i = t.hostProps || {};
    for (let a in o.instanceProps) {
      delete i[a];
      let n = o.notifyInstanceProp;
      n && r.prototype._addPropertyEffect(
        a,
        r.prototype.PROPERTY_EFFECT_TYPES.NOTIFY,
        { fn: qc(a, n) }
      );
    }
    if (o.forwardHostProp && e.__dataHost)
      for (let a in i)
        t.hasHostProps || (t.hasHostProps = !0), r.prototype._addPropertyEffect(
          a,
          r.prototype.PROPERTY_EFFECT_TYPES.NOTIFY,
          { fn: Yc() }
        );
  }
  function qc(r, e) {
    return function(o, i, a) {
      e.call(
        o.__templatizeOwner,
        o,
        i,
        a[i]
      );
    };
  }
  function Yc() {
    return function(e, t, o) {
      e.__dataHost._setPendingPropertyOrPath("_host_" + t, o[t], !0, !0);
    };
  }
  function Ot(r, e, t) {
    if (rr && !Ni(r))
      throw new Error("strictTemplatePolicy: template owner not trusted");
    if (t = /** @type {!TemplatizeOptions} */
    t || {}, r.__templatizeOwner)
      throw new Error("A <template> can only be templatized once");
    r.__templatizeOwner = e;
    let i = (e ? e.constructor : he)._parseTemplate(r), a = i.templatizeInstanceClass;
    a || (a = Bc(r, i, t), i.templatizeInstanceClass = a);
    const n = Ni(r);
    jc(r, i, t, n);
    let s = class extends a {
    };
    return s.prototype._methodHost = n, s.prototype.__dataHost = /** @type {!DataTemplate} */
    r, s.prototype.__templatizeOwner = /** @type {!Object} */
    e, s.prototype.__hostProps = i.hostProps, s = /** @type {function(new:TemplateInstanceBase)} */
    s, s;
  }
  function Wc(r, e, t) {
    const o = t.constructor._properties, { propertyEffects: i } = r, { instanceProps: a } = e;
    for (let n in i)
      if (!o[n] && !(a && a[n])) {
        const s = i[n];
        for (let l = 0; l < s.length; l++) {
          const { part: c } = s[l].info;
          if (!(c.signature && c.signature.static))
            break;
        }
      }
  }
  function Gc(r, e) {
    let t;
    for (; e; )
      if (t = e.__dataHost ? e : e.__templatizeInstance)
        if (t.__dataHost != r)
          e = t.__dataHost;
        else
          return t;
      else
        e = E(e).parentNode;
    return null;
  }
  /**
   * @license
   * Copyright (c) 2021 - 2022 Vaadin Ltd.
   * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
   */
  const ur = (r) => r.test(navigator.userAgent), ro = (r) => r.test(navigator.platform), Kc = (r) => r.test(navigator.vendor);
  ur(/Android/);
  ur(/Chrome/) && Kc(/Google Inc/);
  const Xc = ur(/Firefox/), Jc = ro(/^iPad/) || ro(/^Mac/) && navigator.maxTouchPoints > 1, Qc = ro(/^iPhone/), sn = Qc || Jc;
  ur(/^((?!chrome|android).)*safari/i);
  const Zc = (() => {
    try {
      return document.createEvent("TouchEvent"), !0;
    } catch {
      return !1;
    }
  })();
  /**
   * @license
   * Copyright (c) 2021 - 2022 Vaadin Ltd.
   * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
   */
  const at = S(
    (r) => class extends r {
      constructor() {
        super(), this.__controllers = /* @__PURE__ */ new Set();
      }
      /** @protected */
      connectedCallback() {
        super.connectedCallback(), this.__controllers.forEach((t) => {
          t.hostConnected && t.hostConnected();
        });
      }
      /** @protected */
      disconnectedCallback() {
        super.disconnectedCallback(), this.__controllers.forEach((t) => {
          t.hostDisconnected && t.hostDisconnected();
        });
      }
      /**
       * Registers a controller to participate in the element update cycle.
       *
       * @param {ReactiveController} controller
       * @protected
       */
      addController(t) {
        this.__controllers.add(t), this.$ !== void 0 && this.isConnected && t.hostConnected && t.hostConnected();
      }
      /**
       * Removes a controller from the element.
       *
       * @param {ReactiveController} controller
       * @protected
       */
      removeController(t) {
        this.__controllers.delete(t);
      }
    }
  );
  /**
   * @license
   * Copyright (c) 2021 - 2022 Vaadin Ltd.
   * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
   */
  let So = !1;
  window.addEventListener(
    "keydown",
    () => {
      So = !0;
    },
    { capture: !0 }
  );
  window.addEventListener(
    "mousedown",
    () => {
      So = !1;
    },
    { capture: !0 }
  );
  function ed() {
    return So;
  }
  function td(r) {
    const e = r.style;
    if (e.visibility === "hidden" || e.display === "none")
      return !0;
    const t = window.getComputedStyle(r);
    return t.visibility === "hidden" || t.display === "none";
  }
  function rd(r) {
    if (!ad(r))
      return -1;
    const e = r.getAttribute("tabindex") || 0;
    return Number(e);
  }
  function od(r, e) {
    const t = Math.max(r.tabIndex, 0), o = Math.max(e.tabIndex, 0);
    return t === 0 || o === 0 ? o > t : t > o;
  }
  function id(r, e) {
    const t = [];
    for (; r.length > 0 && e.length > 0; )
      od(r[0], e[0]) ? t.push(e.shift()) : t.push(r.shift());
    return t.concat(r, e);
  }
  function oo(r) {
    const e = r.length;
    if (e < 2)
      return r;
    const t = Math.ceil(e / 2), o = oo(r.slice(0, t)), i = oo(r.slice(t));
    return id(o, i);
  }
  function ln(r, e) {
    if (r.nodeType !== Node.ELEMENT_NODE || td(r))
      return !1;
    const t = (
      /** @type {HTMLElement} */
      r
    ), o = rd(t);
    let i = o > 0;
    o >= 0 && e.push(t);
    let a = [];
    return t.localName === "slot" ? a = t.assignedNodes({ flatten: !0 }) : a = (t.shadowRoot || t).children, [...a].forEach((n) => {
      i = ln(n, e) || i;
    }), i;
  }
  function ad(r) {
    return r.matches('[tabindex="-1"]') ? !1 : r.matches("input, select, textarea, button, object") ? r.matches(":not([disabled])") : r.matches("a[href], area[href], iframe, [tabindex], [contentEditable]");
  }
  function nd(r) {
    return r.getRootNode().activeElement === r;
  }
  function sd(r) {
    const e = [];
    return ln(r, e) ? oo(e) : e;
  }
  /**
   * @license
   * Copyright (c) 2021 - 2022 Vaadin Ltd.
   * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
   */
  const Or = [];
  class ld {
    /**
     * @param {HTMLElement} host
     */
    constructor(e) {
      this.host = e, this.__trapNode = null, this.__onKeyDown = this.__onKeyDown.bind(this);
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
    trapFocus(e) {
      if (this.__trapNode = e, this.__focusableElements.length === 0)
        throw this.__trapNode = null, new Error("The trap node should have at least one focusable descendant or be focusable itself.");
      Or.push(this), this.__focusedElementIndex === -1 && this.__focusableElements[0].focus();
    }
    /**
     * Deactivates the focus trap set with the `.trapFocus()` method
     * so that it becomes possible to tab outside the trap node.
     */
    releaseFocus() {
      this.__trapNode = null, Or.pop();
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
    __onKeyDown(e) {
      if (this.__trapNode && this === Array.from(Or).pop() && e.key === "Tab") {
        e.preventDefault();
        const t = e.shiftKey;
        this.__focusNextElement(t);
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
    __focusNextElement(e = !1) {
      const t = this.__focusableElements, o = e ? -1 : 1, i = this.__focusedElementIndex, a = (t.length + i + o) % t.length, n = t[a];
      n.focus(), n.localName === "input" && n.select();
    }
    /**
     * An array of tab-ordered focusable elements inside the trap node.
     *
     * @return {HTMLElement[]}
     * @private
     */
    get __focusableElements() {
      return sd(this.__trapNode);
    }
    /**
     * The index of the element inside the trap node that currently has focus.
     *
     * @return {HTMLElement | undefined}
     * @private
     */
    get __focusedElementIndex() {
      const e = this.__focusableElements;
      return e.indexOf(e.filter(nd).pop());
    }
  }
  /**
   * @license
   * Copyright (c) 2017 - 2022 Vaadin Ltd.
   * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
   */
  class oe extends it(dr(at(ue))) {
    static get template() {
      return Pe`
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
         * The template of the overlay content.
         * @type {HTMLTemplateElement | null | undefined}
         */
        template: {
          type: Object,
          notify: !0
        },
        /**
         * References the content container after the template is stamped.
         * @type {!HTMLElement | undefined}
         */
        content: {
          type: Object,
          notify: !0
        },
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
         * it doesn’t change the functionality of the user interface.
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
         * When true move focus to the first focusable element in the overlay,
         * or to the overlay if there are no focusable elements.
         * @type {boolean}
         */
        focusTrap: {
          type: Boolean,
          value: !1
        },
        /**
         * Set to true to enable restoring of focus when overlay is closed.
         * @type {boolean}
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
        _instance: {
          type: Object
        },
        /** @private */
        _originalContentPart: Object,
        /** @private */
        _contentNodes: Array,
        /** @private */
        _oldOwner: Element,
        /** @private */
        _oldModel: Object,
        /** @private */
        _oldTemplate: Object,
        /** @private */
        _oldRenderer: Object,
        /** @private */
        _oldOpened: Boolean
      };
    }
    static get observers() {
      return ["_templateOrRendererChanged(template, renderer, owner, model, opened)"];
    }
    constructor() {
      super(), this._boundMouseDownListener = this._mouseDownListener.bind(this), this._boundMouseUpListener = this._mouseUpListener.bind(this), this._boundOutsideClickListener = this._outsideClickListener.bind(this), this._boundKeydownListener = this._keydownListener.bind(this), this._observer = new tn(this, (e) => {
        this._setTemplateFromNodes(e.addedNodes);
      }), this._boundIronOverlayCanceledListener = this._ironOverlayCanceled.bind(this), sn && (this._boundIosResizeListener = () => this._detectIosNavbar()), this.__focusTrapController = new ld(this);
    }
    /** @protected */
    ready() {
      super.ready(), this._observer.flush(), this.addEventListener("click", () => {
      }), this.$.backdrop.addEventListener("click", () => {
      }), this.addController(this.__focusTrapController);
    }
    /** @private */
    _detectIosNavbar() {
      if (!this.opened)
        return;
      const e = window.innerHeight, o = window.innerWidth > e, i = document.documentElement.clientHeight;
      o && i > e ? this.style.setProperty("--vaadin-overlay-viewport-bottom", `${i - e}px`) : this.style.setProperty("--vaadin-overlay-viewport-bottom", "0");
    }
    /**
     * @param {!Array<!Element>} nodes
     * @protected
     */
    _setTemplateFromNodes(e) {
      this.template = e.find((t) => t.localName && t.localName === "template") || this.template;
    }
    /**
     * @param {Event=} sourceEvent
     * @event vaadin-overlay-close
     * fired before the `vaadin-overlay` will be closed. If canceled the closing of the overlay is canceled as well.
     */
    close(e) {
      const t = new CustomEvent("vaadin-overlay-close", {
        bubbles: !0,
        cancelable: !0,
        detail: { sourceEvent: e }
      });
      this.dispatchEvent(t), t.defaultPrevented || (this.opened = !1);
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
      this.renderer && this.renderer.call(this.owner, this.content, this.owner, this.model);
    }
    /** @private */
    _ironOverlayCanceled(e) {
      e.preventDefault();
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
     * We need to listen on 'click' / 'tap' event and capture it and close the overlay before
     * propagating the event to the listener in the button. Otherwise, if the clicked button would call
     * open(), this would happen: https://www.youtube.com/watch?v=Z86V_ICUCD4
     *
     * @event vaadin-overlay-outside-click
     * fired before the `vaadin-overlay` will be closed on outside click. If canceled the closing of the overlay is canceled as well.
     *
     * @private
     */
    _outsideClickListener(e) {
      if (e.composedPath().includes(this.$.overlay) || this._mouseDownInside || this._mouseUpInside) {
        this._mouseDownInside = !1, this._mouseUpInside = !1;
        return;
      }
      if (!this._last)
        return;
      const t = new CustomEvent("vaadin-overlay-outside-click", {
        bubbles: !0,
        cancelable: !0,
        detail: { sourceEvent: e }
      });
      this.dispatchEvent(t), this.opened && !t.defaultPrevented && this.close(e);
    }
    /**
     * @event vaadin-overlay-escape-press
     * fired before the `vaadin-overlay` will be closed on ESC button press. If canceled the closing of the overlay is canceled as well.
     *
     * @private
     */
    _keydownListener(e) {
      if (this._last && !(this.modeless && !e.composedPath().includes(this.$.overlay)) && e.key === "Escape") {
        const t = new CustomEvent("vaadin-overlay-escape-press", {
          bubbles: !0,
          cancelable: !0,
          detail: { sourceEvent: e }
        });
        this.dispatchEvent(t), this.opened && !t.defaultPrevented && this.close(e);
      }
    }
    /** @protected */
    _ensureTemplatized() {
      this._setTemplateFromNodes(Array.from(this.children));
    }
    /**
     * @event vaadin-overlay-open
     * fired after the `vaadin-overlay` is opened.
     *
     * @private
     */
    _openedChanged(e, t) {
      this._instance || this._ensureTemplatized(), e ? (this.__restoreFocusNode = this._getActiveElement(), this._animatedOpening(), an(this, () => {
        this.focusTrap && this.__focusTrapController.trapFocus(this.$.overlay);
        const o = new CustomEvent("vaadin-overlay-open", { bubbles: !0 });
        this.dispatchEvent(o);
      }), document.addEventListener("keydown", this._boundKeydownListener), this.modeless || this._addGlobalListeners()) : t && (this.focusTrap && this.__focusTrapController.releaseFocus(), this._animatedClosing(), document.removeEventListener("keydown", this._boundKeydownListener), this.modeless || this._removeGlobalListeners());
    }
    /** @private */
    _hiddenChanged(e) {
      e && this.hasAttribute("closing") && this._flushAnimation("closing");
    }
    /**
     * @return {boolean}
     * @protected
     */
    _shouldAnimate() {
      const e = getComputedStyle(this).getPropertyValue("animation-name");
      return !(getComputedStyle(this).getPropertyValue("display") === "none") && e && e !== "none";
    }
    /**
     * @param {string} type
     * @param {Function} callback
     * @protected
     */
    _enqueueAnimation(e, t) {
      const o = `__${e}Handler`, i = (a) => {
        a && a.target !== this || (t(), this.removeEventListener("animationend", i), delete this[o]);
      };
      this[o] = i, this.addEventListener("animationend", i);
    }
    /**
     * @param {string} type
     * @protected
     */
    _flushAnimation(e) {
      const t = `__${e}Handler`;
      typeof this[t] == "function" && this[t]();
    }
    /** @protected */
    _animatedOpening() {
      this.parentNode === document.body && this.hasAttribute("closing") && this._flushAnimation("closing"), this._attachOverlay(), this.modeless || this._enterModalState(), this.setAttribute("opening", ""), this._shouldAnimate() ? this._enqueueAnimation("opening", () => {
        this._finishOpening();
      }) : this._finishOpening();
    }
    /** @protected */
    _attachOverlay() {
      this._placeholder = document.createComment("vaadin-overlay-placeholder"), this.parentNode.insertBefore(this._placeholder, this), document.body.appendChild(this), this.bringToFront();
    }
    /** @protected */
    _finishOpening() {
      document.addEventListener("iron-overlay-canceled", this._boundIronOverlayCanceledListener), this.removeAttribute("opening");
    }
    /** @protected */
    _finishClosing() {
      document.removeEventListener("iron-overlay-canceled", this._boundIronOverlayCanceledListener), this._detachOverlay(), this.$.overlay.style.removeProperty("pointer-events"), this.removeAttribute("closing");
    }
    /**
     * @event vaadin-overlay-closing
     * Fired when the overlay will be closed.
     *
     * @protected
     */
    _animatedClosing() {
      if (this.hasAttribute("opening") && this._flushAnimation("opening"), this._placeholder) {
        this._exitModalState();
        const e = this.restoreFocusNode || this.__restoreFocusNode;
        if (this.restoreFocusOnClose && e) {
          const t = this._getActiveElement();
          (t === document.body || this._deepContains(t)) && setTimeout(() => e.focus()), this.__restoreFocusNode = null;
        }
        this.setAttribute("closing", ""), this.dispatchEvent(new CustomEvent("vaadin-overlay-closing")), this._shouldAnimate() ? this._enqueueAnimation("closing", () => {
          this._finishClosing();
        }) : this._finishClosing();
      }
    }
    /** @protected */
    _detachOverlay() {
      this._placeholder.parentNode.insertBefore(this, this._placeholder), this._placeholder.parentNode.removeChild(this._placeholder);
    }
    /**
     * Returns all attached overlays in visual stacking order.
     * @private
     */
    static get __attachedInstances() {
      return Array.from(document.body.children).filter((e) => e instanceof oe && !e.hasAttribute("closing")).sort((e, t) => e.__zIndex - t.__zIndex || 0);
    }
    /**
     * Returns true if this is the last one in the opened overlays stack
     * @return {boolean}
     * @protected
     */
    get _last() {
      return this === oe.__attachedInstances.pop();
    }
    /** @private */
    _modelessChanged(e) {
      e ? (this._removeGlobalListeners(), this._exitModalState()) : this.opened && (this._addGlobalListeners(), this._enterModalState());
    }
    /** @protected */
    _addGlobalListeners() {
      document.addEventListener("mousedown", this._boundMouseDownListener), document.addEventListener("mouseup", this._boundMouseUpListener), document.documentElement.addEventListener("click", this._boundOutsideClickListener, !0);
    }
    /** @protected */
    _enterModalState() {
      document.body.style.pointerEvents !== "none" && (this._previousDocumentPointerEvents = document.body.style.pointerEvents, document.body.style.pointerEvents = "none"), oe.__attachedInstances.forEach((e) => {
        e !== this && (e.shadowRoot.querySelector('[part="overlay"]').style.pointerEvents = "none");
      });
    }
    /** @protected */
    _removeGlobalListeners() {
      document.removeEventListener("mousedown", this._boundMouseDownListener), document.removeEventListener("mouseup", this._boundMouseUpListener), document.documentElement.removeEventListener("click", this._boundOutsideClickListener, !0);
    }
    /** @protected */
    _exitModalState() {
      this._previousDocumentPointerEvents !== void 0 && (document.body.style.pointerEvents = this._previousDocumentPointerEvents, delete this._previousDocumentPointerEvents);
      const e = oe.__attachedInstances;
      let t;
      for (; (t = e.pop()) && !(t !== this && (t.shadowRoot.querySelector('[part="overlay"]').style.removeProperty("pointer-events"), !t.modeless)); )
        ;
    }
    /** @protected */
    _removeOldContent() {
      !this.content || !this._contentNodes || (this._observer.disconnect(), this._contentNodes.forEach((e) => {
        e.parentNode === this.content && this.content.removeChild(e);
      }), this._originalContentPart && (this.$.content.parentNode.replaceChild(this._originalContentPart, this.$.content), this.$.content = this._originalContentPart, this._originalContentPart = void 0), this._observer.connect(), this._contentNodes = void 0, this.content = void 0);
    }
    /**
     * @param {!HTMLTemplateElement} template
     * @protected
     */
    _stampOverlayTemplate(e) {
      this._removeOldContent(), e._Templatizer || (e._Templatizer = Ot(e, this, {
        forwardHostProp(o, i) {
          this._instance && this._instance.forwardHostProp(o, i);
        }
      })), this._instance = new e._Templatizer({}), this._contentNodes = Array.from(this._instance.root.childNodes);
      const t = e._templateRoot || (e._templateRoot = e.getRootNode());
      if (t !== document) {
        this.$.content.shadowRoot || this.$.content.attachShadow({ mode: "open" });
        let o = Array.from(t.querySelectorAll("style")).reduce(
          (i, a) => i + a.textContent,
          ""
        );
        if (o = o.replace(/:host/g, ":host-nomatch"), o) {
          const i = document.createElement("style");
          i.textContent = o, this.$.content.shadowRoot.appendChild(i), this._contentNodes.unshift(i);
        }
        this.$.content.shadowRoot.appendChild(this._instance.root), this.content = this.$.content.shadowRoot;
      } else
        this.appendChild(this._instance.root), this.content = this;
    }
    /** @private */
    _removeNewRendererOrTemplate(e, t, o, i) {
      e !== t ? this.template = void 0 : o !== i && (this.renderer = void 0);
    }
    /** @private */
    // eslint-disable-next-line max-params
    _templateOrRendererChanged(e, t, o, i, a) {
      if (e && t)
        throw this._removeNewRendererOrTemplate(e, this._oldTemplate, t, this._oldRenderer), new Error("You should only use either a renderer or a template for overlay content");
      const n = this._oldOwner !== o || this._oldModel !== i;
      this._oldModel = i, this._oldOwner = o;
      const s = this._oldTemplate !== e;
      this._oldTemplate = e;
      const l = this._oldRenderer !== t;
      this._oldRenderer = t;
      const c = this._oldOpened !== a;
      this._oldOpened = a, l && (this.content = this, this.content.innerHTML = "", delete this.content._$litPart$), e && s ? this._stampOverlayTemplate(e) : t && (l || c || n) && a && this.requestContentUpdate();
    }
    /**
     * @return {!Element}
     * @protected
     */
    _getActiveElement() {
      let e = document.activeElement || document.body;
      for (; e.shadowRoot && e.shadowRoot.activeElement; )
        e = e.shadowRoot.activeElement;
      return e;
    }
    /**
     * @param {!Node} node
     * @return {boolean}
     * @protected
     */
    _deepContains(e) {
      if (this.contains(e))
        return !0;
      let t = e;
      const o = e.ownerDocument;
      for (; t && t !== o && t !== this; )
        t = t.parentNode || t.host;
      return t === this;
    }
    /**
     * Brings the overlay as visually the frontmost one
     */
    bringToFront() {
      let e = "";
      const t = oe.__attachedInstances.filter((o) => o !== this).pop();
      t && (e = t.__zIndex + 1), this.style.zIndex = e, this.__zIndex = e || parseFloat(getComputedStyle(this).zIndex);
    }
  }
  customElements.define(oe.is, oe);
  /**
   * @license
   * Copyright (c) 2017 - 2022 Vaadin Ltd.
   * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
   */
  const cn = A`
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
  $("", cn, { moduleId: "lumo-menu-overlay-core" });
  const cd = A`
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
`, dn = [Co, cn, cd];
  $("", dn, { moduleId: "lumo-menu-overlay" });
  const dd = A`
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
  $("vaadin-date-picker-overlay", [dn, dd], {
    moduleId: "lumo-date-picker-overlay"
  });
  const ud = A`
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

  [part] ::slotted(vaadin-icon),
  [part] ::slotted(iron-icon) {
    display: inline-block;
    width: var(--lumo-icon-size-m);
    height: var(--lumo-icon-size-m);
  }

  /* Vaadin icons are based on a 16x16 grid (unlike Lumo and Material icons with 24x24), so they look too big by default */
  [part] ::slotted(vaadin-icon[icon^='vaadin:']),
  [part] ::slotted(iron-icon[icon^='vaadin:']) {
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
  $("vaadin-button", ud, { moduleId: "lumo-button" });
  const hd = /\/\*[\*!]\s+vaadin-dev-mode:start([\s\S]*)vaadin-dev-mode:end\s+\*\*\//i, Jt = window.Vaadin && window.Vaadin.Flow && window.Vaadin.Flow.clients;
  function pd() {
    function r() {
      return !0;
    }
    return un(r);
  }
  function gd() {
    try {
      return fd() ? !0 : bd() ? Jt ? !md() : !pd() : !1;
    } catch {
      return !1;
    }
  }
  function fd() {
    return localStorage.getItem("vaadin.developmentmode.force");
  }
  function bd() {
    return ["localhost", "127.0.0.1"].indexOf(window.location.hostname) >= 0;
  }
  function md() {
    return !!(Jt && Object.keys(Jt).map((e) => Jt[e]).filter((e) => e.productionMode).length > 0);
  }
  function un(r, e) {
    if (typeof r != "function")
      return;
    const t = hd.exec(r.toString());
    if (t)
      try {
        r = new Function(t[1]);
      } catch {
      }
    return r(e);
  }
  window.Vaadin = window.Vaadin || {};
  const zi = function(r, e) {
    if (window.Vaadin.developmentMode)
      return un(r, e);
  };
  window.Vaadin.developmentMode === void 0 && (window.Vaadin.developmentMode = gd());
  function _d() {
  }
  const vd = function() {
    if (typeof zi == "function")
      return zi(_d);
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
  let Li = 0, hn = 0;
  const Le = [];
  let Ri = 0, io = !1;
  const pn = document.createTextNode("");
  new window.MutationObserver(yd).observe(pn, { characterData: !0 });
  function yd() {
    io = !1;
    const r = Le.length;
    for (let e = 0; e < r; e++) {
      const t = Le[e];
      if (t)
        try {
          t();
        } catch (o) {
          setTimeout(() => {
            throw o;
          });
        }
    }
    Le.splice(0, r), hn += r;
  }
  const ir = {
    /**
     * Returns a sub-module with the async interface providing the provided
     * delay.
     *
     * @memberof timeOut
     * @param {number=} delay Time to wait before calling callbacks in ms
     * @return {!AsyncInterface} An async timeout interface
     */
    after(r) {
      return {
        run(e) {
          return window.setTimeout(e, r);
        },
        cancel(e) {
          window.clearTimeout(e);
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
    run(r, e) {
      return window.setTimeout(r, e);
    },
    /**
     * Cancels a previously enqueued `timeOut` callback.
     *
     * @memberof timeOut
     * @param {number} handle Handle returned from `run` of callback to cancel
     * @return {void}
     */
    cancel(r) {
      window.clearTimeout(r);
    }
  }, kd = {
    /**
     * Enqueues a function called at `requestIdleCallback` timing.
     *
     * @memberof idlePeriod
     * @param {function(!IdleDeadline):void} fn Callback to run
     * @return {number} Handle used for canceling task
     */
    run(r) {
      return window.requestIdleCallback ? window.requestIdleCallback(r) : window.setTimeout(r, 16);
    },
    /**
     * Cancels a previously enqueued `idlePeriod` callback.
     *
     * @memberof idlePeriod
     * @param {number} handle Handle returned from `run` of callback to cancel
     * @return {void}
     */
    cancel(r) {
      window.cancelIdleCallback ? window.cancelIdleCallback(r) : window.clearTimeout(r);
    }
  }, xd = {
    /**
     * Enqueues a function called at microtask timing.
     *
     * @memberof microTask
     * @param {!Function=} callback Callback to run
     * @return {number} Handle used for canceling task
     */
    run(r) {
      io || (io = !0, pn.textContent = Ri, Ri += 1), Le.push(r);
      const e = Li;
      return Li += 1, e;
    },
    /**
     * Cancels a previously enqueued `microTask` callback.
     *
     * @memberof microTask
     * @param {number} handle Handle returned from `run` of callback to cancel
     * @return {void}
     */
    cancel(r) {
      const e = r - hn;
      if (e >= 0) {
        if (!Le[e])
          throw new Error(`invalid async handle: ${r}`);
        Le[e] = null;
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
  let $t = class ao {
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
    static debounce(e, t, o) {
      return e instanceof ao ? e._cancelAsync() : e = new ao(), e.setConfig(t, o), e;
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
    setConfig(e, t) {
      this._asyncModule = e, this._callback = t, this._timer = this._asyncModule.run(() => {
        this._timer = null, no.delete(this), this._callback();
      });
    }
    /**
     * Cancels an active debouncer and returns a reference to itself.
     *
     * @return {void}
     */
    cancel() {
      this.isActive() && (this._cancelAsync(), no.delete(this));
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
  }, no = /* @__PURE__ */ new Set();
  function wd(r) {
    no.add(r);
  }
  /**
   * @license
   * Copyright (c) 2021 - 2022 Vaadin Ltd.
   * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
   */
  window.Vaadin = window.Vaadin || {};
  window.Vaadin.registrations = window.Vaadin.registrations || [];
  window.Vaadin.developmentModeCallback = window.Vaadin.developmentModeCallback || {};
  window.Vaadin.developmentModeCallback["vaadin-usage-statistics"] = function() {
    vd();
  };
  let $r;
  const Fi = /* @__PURE__ */ new Set(), gn = (r) => class extends dr(r) {
    static get version() {
      return "23.3.29";
    }
    /** @protected */
    static finalize() {
      super.finalize();
      const { is: t } = this;
      t && !Fi.has(t) && (window.Vaadin.registrations.push(this), Fi.add(t), window.Vaadin.developmentModeCallback && ($r = $t.debounce($r, kd, () => {
        window.Vaadin.developmentModeCallback["vaadin-usage-statistics"]();
      }), wd($r)));
    }
    constructor() {
      super(), document.doctype;
    }
  };
  /**
   * @license
   * Copyright (c) 2021 - 2022 Vaadin Ltd.
   * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
   */
  let Cd = 0;
  function Ad() {
    return Cd++;
  }
  /**
   * @license
   * Copyright (c) 2021 - 2022 Vaadin Ltd.
   * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
   */
  class Se extends EventTarget {
    /**
     * Ensure that every instance has unique ID.
     *
     * @param {string} slotName
     * @param {HTMLElement} host
     * @return {string}
     * @protected
     */
    static generateId(e, t) {
      return `${e || "default"}-${t.localName}-${Ad()}`;
    }
    constructor(e, t, o, i, a) {
      super(), this.host = e, this.slotName = t, this.slotFactory = o, this.slotInitializer = i, a && (this.defaultId = Se.generateId(t, e));
    }
    hostConnected() {
      if (!this.initialized) {
        let e = this.getSlotChild();
        e ? (this.node = e, this.initCustomNode(e)) : e = this.attachDefaultNode(), this.initNode(e), this.observe(), this.initialized = !0;
      }
    }
    /**
     * Create and attach default node using the slot factory.
     * @return {Node | undefined}
     * @protected
     */
    attachDefaultNode() {
      const { host: e, slotName: t, slotFactory: o } = this;
      let i = this.defaultNode;
      return !i && o && (i = o(e), i instanceof Element && (t !== "" && i.setAttribute("slot", t), this.node = i, this.defaultNode = i)), i && e.appendChild(i), i;
    }
    /**
     * Return a reference to the node managed by the controller.
     * @return {Node}
     */
    getSlotChild() {
      const { slotName: e } = this;
      return Array.from(this.host.childNodes).find((t) => t.nodeType === Node.ELEMENT_NODE && t.slot === e || t.nodeType === Node.TEXT_NODE && t.textContent.trim() && e === "");
    }
    /**
     * @param {Node} node
     * @protected
     */
    initNode(e) {
      const { slotInitializer: t } = this;
      t && t(this.host, e);
    }
    /**
     * Override to initialize the newly added custom node.
     *
     * @param {Node} _node
     * @protected
     */
    initCustomNode(e) {
    }
    /**
     * Override to teardown slotted node when it's removed.
     *
     * @param {Node} _node
     * @protected
     */
    teardownNode(e) {
    }
    /**
     * Setup the observer to manage slot content changes.
     * @protected
     */
    observe() {
      const { slotName: e } = this, t = e === "" ? "slot:not([name])" : `slot[name=${e}]`, o = this.host.shadowRoot.querySelector(t);
      this.__slotObserver = new tn(o, (i) => {
        const a = this.node, n = i.addedNodes.find((s) => s !== a);
        i.removedNodes.length && i.removedNodes.forEach((s) => {
          this.teardownNode(s);
        }), n && (a && a.isConnected && this.host.removeChild(a), this.node = n, n !== this.defaultNode && (this.initCustomNode(n), this.initNode(n)));
      });
    }
  }
  /**
   * @license
   * Copyright (c) 2022 Vaadin Ltd.
   * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
   */
  class fn extends Se {
    constructor(e) {
      super(e, "tooltip"), this.setTarget(e);
    }
    /**
     * Override to initialize the newly added custom tooltip.
     *
     * @param {Node} tooltipNode
     * @protected
     * @override
     */
    initCustomNode(e) {
      e.target = this.target, this.context !== void 0 && (e.context = this.context), this.manual !== void 0 && (e.manual = this.manual), this.opened !== void 0 && (e.opened = this.opened), this.position !== void 0 && (e._position = this.position), this.shouldShow !== void 0 && (e.shouldShow = this.shouldShow);
    }
    /**
     * Set a context object to be used by generator.
     * @param {object} context
     */
    setContext(e) {
      this.context = e;
      const t = this.node;
      t && (t.context = e);
    }
    /**
     * Toggle manual state on the slotted tooltip.
     * @param {boolean} manual
     */
    setManual(e) {
      this.manual = e;
      const t = this.node;
      t && (t.manual = e);
    }
    /**
     * Toggle opened state on the slotted tooltip.
     * @param {boolean} opened
     */
    setOpened(e) {
      this.opened = e;
      const t = this.node;
      t && (t.opened = e);
    }
    /**
     * Set default position for the slotted tooltip.
     * This can be overridden by setting the position
     * using corresponding property or attribute.
     * @param {string} position
     */
    setPosition(e) {
      this.position = e;
      const t = this.node;
      t && (t._position = e);
    }
    /**
     * Set function used to detect whether to show
     * the tooltip based on a condition.
     * @param {Function} shouldShow
     */
    setShouldShow(e) {
      this.shouldShow = e;
      const t = this.node;
      t && (t.shouldShow = e);
    }
    /**
     * Set an HTML element to attach the tooltip to.
     * @param {HTMLElement} target
     */
    setTarget(e) {
      this.target = e;
      const t = this.node;
      t && (t.target = e);
    }
  }
  /**
   * @license
   * Copyright (c) 2021 - 2022 Vaadin Ltd.
   * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
   */
  const bn = S(
    (r) => class extends r {
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
      _disabledChanged(t) {
        this._setAriaDisabled(t);
      }
      /**
       * @param {boolean} disabled
       * @protected
       */
      _setAriaDisabled(t) {
        t ? this.setAttribute("aria-disabled", "true") : this.removeAttribute("aria-disabled");
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
  @license
  Copyright (c) 2017 The Polymer Project Authors. All rights reserved.
  This code may only be used under the BSD style license found at http://polymer.github.io/LICENSE.txt
  The complete set of authors may be found at http://polymer.github.io/AUTHORS.txt
  The complete set of contributors may be found at http://polymer.github.io/CONTRIBUTORS.txt
  Code distributed by Google as part of the polymer project is also
  subject to an additional IP rights grant found at http://polymer.github.io/PATENTS.txt
  */
  const Ed = !1, Pd = (r) => r, To = typeof document.head.style.touchAction == "string", so = "__polymerGestures", Mr = "__polymerGesturesHandled", lo = "__polymerGesturesTouchAction", Hi = 25, Bi = 5, Sd = 2, Td = ["mousedown", "mousemove", "mouseup", "click"], Dd = [0, 1, 4, 2], Od = function() {
    try {
      return new MouseEvent("test", { buttons: 1 }).buttons === 1;
    } catch {
      return !1;
    }
  }();
  function Do(r) {
    return Td.indexOf(r) > -1;
  }
  let mn = !1;
  (function() {
    try {
      const r = Object.defineProperty({}, "passive", {
        // eslint-disable-next-line getter-return
        get() {
          mn = !0;
        }
      });
      window.addEventListener("test", null, r), window.removeEventListener("test", null, r);
    } catch {
    }
  })();
  function $d(r) {
    if (!(Do(r) || r === "touchend") && To && mn && Ed)
      return { passive: !0 };
  }
  const Md = navigator.userAgent.match(/iP(?:[oa]d|hone)|Android/), Id = {
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
  function xe(r) {
    const e = r.type;
    if (!Do(e))
      return !1;
    if (e === "mousemove") {
      let o = r.buttons === void 0 ? 1 : r.buttons;
      return r instanceof window.MouseEvent && !Od && (o = Dd[r.which] || 0), !!(o & 1);
    }
    return (r.button === void 0 ? 0 : r.button) === 0;
  }
  function Nd(r) {
    if (r.type === "click") {
      if (r.detail === 0)
        return !0;
      const e = ce(r);
      if (!e.nodeType || /** @type {Element} */
      e.nodeType !== Node.ELEMENT_NODE)
        return !0;
      const t = (
        /** @type {Element} */
        e.getBoundingClientRect()
      ), o = r.pageX, i = r.pageY;
      return !(o >= t.left && o <= t.right && i >= t.top && i <= t.bottom);
    }
    return !1;
  }
  const re = {
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
  function zd(r) {
    let e = "auto";
    const t = vn(r);
    for (let o = 0, i; o < t.length; o++)
      if (i = t[o], i[lo]) {
        e = i[lo];
        break;
      }
    return e;
  }
  function _n(r, e, t) {
    r.movefn = e, r.upfn = t, document.addEventListener("mousemove", e), document.addEventListener("mouseup", t);
  }
  function Re(r) {
    document.removeEventListener("mousemove", r.movefn), document.removeEventListener("mouseup", r.upfn), r.movefn = null, r.upfn = null;
  }
  const vn = window.ShadyDOM && window.ShadyDOM.noPatch ? window.ShadyDOM.composedPath : (r) => r.composedPath && r.composedPath() || [], Oo = {}, ke = [];
  function Ld(r, e) {
    let t = document.elementFromPoint(r, e), o = t;
    for (; o && o.shadowRoot && !window.ShadyDOM; ) {
      const i = o;
      if (o = o.shadowRoot.elementFromPoint(r, e), i === o)
        break;
      o && (t = o);
    }
    return t;
  }
  function ce(r) {
    const e = vn(
      /** @type {?Event} */
      r
    );
    return e.length > 0 ? e[0] : r.target;
  }
  function Rd(r) {
    const e = r.type, o = r.currentTarget[so];
    if (!o)
      return;
    const i = o[e];
    if (!i)
      return;
    if (!r[Mr] && (r[Mr] = {}, e.startsWith("touch"))) {
      const n = r.changedTouches[0];
      if (e === "touchstart" && r.touches.length === 1 && (re.touch.id = n.identifier), re.touch.id !== n.identifier)
        return;
      To || (e === "touchstart" || e === "touchmove") && Fd(r);
    }
    const a = r[Mr];
    if (!a.skip) {
      for (let n = 0, s; n < ke.length; n++)
        s = ke[n], i[s.name] && !a[s.name] && s.flow && s.flow.start.indexOf(r.type) > -1 && s.reset && s.reset();
      for (let n = 0, s; n < ke.length; n++)
        s = ke[n], i[s.name] && !a[s.name] && (a[s.name] = !0, s[e](r));
    }
  }
  function Fd(r) {
    const e = r.changedTouches[0], t = r.type;
    if (t === "touchstart")
      re.touch.x = e.clientX, re.touch.y = e.clientY, re.touch.scrollDecided = !1;
    else if (t === "touchmove") {
      if (re.touch.scrollDecided)
        return;
      re.touch.scrollDecided = !0;
      const o = zd(r);
      let i = !1;
      const a = Math.abs(re.touch.x - e.clientX), n = Math.abs(re.touch.y - e.clientY);
      r.cancelable && (o === "none" ? i = !0 : o === "pan-x" ? i = n > a : o === "pan-y" && (i = a > n)), i ? r.preventDefault() : ar("track");
    }
  }
  function Q(r, e, t) {
    return Oo[e] ? (Hd(r, e, t), !0) : !1;
  }
  function Hd(r, e, t) {
    const o = Oo[e], i = o.deps, a = o.name;
    let n = r[so];
    n || (r[so] = n = {});
    for (let s = 0, l, c; s < i.length; s++)
      l = i[s], !(Md && Do(l) && l !== "click") && (c = n[l], c || (n[l] = c = { _count: 0 }), c._count === 0 && r.addEventListener(l, Rd, $d(l)), c[a] = (c[a] || 0) + 1, c._count = (c._count || 0) + 1);
    r.addEventListener(e, t), o.touchAction && yn(r, o.touchAction);
  }
  function $o(r) {
    ke.push(r);
    for (let e = 0; e < r.emits.length; e++)
      Oo[r.emits[e]] = r;
  }
  function Bd(r) {
    for (let e = 0, t; e < ke.length; e++) {
      t = ke[e];
      for (let o = 0, i; o < t.emits.length; o++)
        if (i = t.emits[o], i === r)
          return t;
    }
    return null;
  }
  function yn(r, e) {
    To && r instanceof HTMLElement && xd.run(() => {
      r.style.touchAction = e;
    }), r[lo] = e;
  }
  function Mo(r, e, t) {
    const o = new Event(e, { bubbles: !0, cancelable: !0, composed: !0 });
    if (o.detail = t, Pd(
      /** @type {!Node} */
      r
    ).dispatchEvent(o), o.defaultPrevented) {
      const i = t.preventer || t.sourceEvent;
      i && i.preventDefault && i.preventDefault();
    }
  }
  function ar(r) {
    const e = Bd(r);
    e.info && (e.info.prevent = !0);
  }
  $o({
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
      Re(this.info);
    },
    /**
     * @this {GestureRecognizer}
     * @param {MouseEvent} e
     * @return {void}
     */
    mousedown(r) {
      if (!xe(r))
        return;
      const e = ce(r), t = this, o = (a) => {
        xe(a) || (pt("up", e, a), Re(t.info));
      }, i = (a) => {
        xe(a) && pt("up", e, a), Re(t.info);
      };
      _n(this.info, o, i), pt("down", e, r);
    },
    /**
     * @this {GestureRecognizer}
     * @param {TouchEvent} e
     * @return {void}
     */
    touchstart(r) {
      pt("down", ce(r), r.changedTouches[0], r);
    },
    /**
     * @this {GestureRecognizer}
     * @param {TouchEvent} e
     * @return {void}
     */
    touchend(r) {
      pt("up", ce(r), r.changedTouches[0], r);
    }
  });
  function pt(r, e, t, o) {
    e && Mo(e, r, {
      x: t.clientX,
      y: t.clientY,
      sourceEvent: t,
      preventer: o,
      prevent(i) {
        return ar(i);
      }
    });
  }
  $o({
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
      addMove(r) {
        this.moves.length > Sd && this.moves.shift(), this.moves.push(r);
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
      this.info.state = "start", this.info.started = !1, this.info.moves = [], this.info.x = 0, this.info.y = 0, this.info.prevent = !1, Re(this.info);
    },
    /**
     * @this {GestureRecognizer}
     * @param {MouseEvent} e
     * @return {void}
     */
    mousedown(r) {
      if (!xe(r))
        return;
      const e = ce(r), t = this, o = (a) => {
        const n = a.clientX, s = a.clientY;
        ji(t.info, n, s) && (t.info.state = t.info.started ? a.type === "mouseup" ? "end" : "track" : "start", t.info.state === "start" && ar("tap"), t.info.addMove({ x: n, y: s }), xe(a) || (t.info.state = "end", Re(t.info)), e && Ir(t.info, e, a), t.info.started = !0);
      }, i = (a) => {
        t.info.started && o(a), Re(t.info);
      };
      _n(this.info, o, i), this.info.x = r.clientX, this.info.y = r.clientY;
    },
    /**
     * @this {GestureRecognizer}
     * @param {TouchEvent} e
     * @return {void}
     */
    touchstart(r) {
      const e = r.changedTouches[0];
      this.info.x = e.clientX, this.info.y = e.clientY;
    },
    /**
     * @this {GestureRecognizer}
     * @param {TouchEvent} e
     * @return {void}
     */
    touchmove(r) {
      const e = ce(r), t = r.changedTouches[0], o = t.clientX, i = t.clientY;
      ji(this.info, o, i) && (this.info.state === "start" && ar("tap"), this.info.addMove({ x: o, y: i }), Ir(this.info, e, t), this.info.state = "track", this.info.started = !0);
    },
    /**
     * @this {GestureRecognizer}
     * @param {TouchEvent} e
     * @return {void}
     */
    touchend(r) {
      const e = ce(r), t = r.changedTouches[0];
      this.info.started && (this.info.state = "end", this.info.addMove({ x: t.clientX, y: t.clientY }), Ir(this.info, e, t));
    }
  });
  function ji(r, e, t) {
    if (r.prevent)
      return !1;
    if (r.started)
      return !0;
    const o = Math.abs(r.x - e), i = Math.abs(r.y - t);
    return o >= Bi || i >= Bi;
  }
  function Ir(r, e, t) {
    if (!e)
      return;
    const o = r.moves[r.moves.length - 2], i = r.moves[r.moves.length - 1], a = i.x - r.x, n = i.y - r.y;
    let s, l = 0;
    o && (s = i.x - o.x, l = i.y - o.y), Mo(e, "track", {
      state: r.state,
      x: t.clientX,
      y: t.clientY,
      dx: a,
      dy: n,
      ddx: s,
      ddy: l,
      sourceEvent: t,
      hover() {
        return Ld(t.clientX, t.clientY);
      }
    });
  }
  $o({
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
    mousedown(r) {
      xe(r) && (this.info.x = r.clientX, this.info.y = r.clientY);
    },
    /**
     * @this {GestureRecognizer}
     * @param {MouseEvent} e
     * @return {void}
     */
    click(r) {
      xe(r) && Ui(this.info, r);
    },
    /**
     * @this {GestureRecognizer}
     * @param {TouchEvent} e
     * @return {void}
     */
    touchstart(r) {
      const e = r.changedTouches[0];
      this.info.x = e.clientX, this.info.y = e.clientY;
    },
    /**
     * @this {GestureRecognizer}
     * @param {TouchEvent} e
     * @return {void}
     */
    touchend(r) {
      Ui(this.info, r.changedTouches[0], r);
    }
  });
  function Ui(r, e, t) {
    const o = Math.abs(e.clientX - r.x), i = Math.abs(e.clientY - r.y), a = ce(t || e);
    !a || Id[
      /** @type {!HTMLElement} */
      a.localName
    ] && a.hasAttribute("disabled") || (isNaN(o) || isNaN(i) || o <= Hi && i <= Hi || Nd(e)) && (r.prevent || Mo(a, "tap", {
      x: e.clientX,
      y: e.clientY,
      sourceEvent: e,
      preventer: t
    }));
  }
  /**
   * @license
   * Copyright (c) 2021 - 2022 Vaadin Ltd.
   * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
   */
  const Io = S(
    (r) => class extends r {
      /** @protected */
      ready() {
        super.ready(), this.addEventListener("keydown", (t) => {
          this._onKeyDown(t);
        }), this.addEventListener("keyup", (t) => {
          this._onKeyUp(t);
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
      _onKeyDown(t) {
        switch (t.key) {
          case "Enter":
            this._onEnter(t);
            break;
          case "Escape":
            this._onEscape(t);
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
      _onKeyUp(t) {
      }
      /**
       * A handler for the "Enter" key. By default, it does nothing.
       * Override the method to implement your own behavior.
       *
       * @param {KeyboardEvent} _event
       * @protected
       */
      _onEnter(t) {
      }
      /**
       * A handler for the "Escape" key. By default, it does nothing.
       * Override the method to implement your own behavior.
       *
       * @param {KeyboardEvent} _event
       * @protected
       */
      _onEscape(t) {
      }
    }
  );
  /**
   * @license
   * Copyright (c) 2021 - 2022 Vaadin Ltd.
   * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
   */
  const jd = (r) => class extends bn(Io(r)) {
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
      super.ready(), Q(this, "down", (t) => {
        this._shouldSetActive(t) && this._setActive(!0);
      }), Q(this, "up", () => {
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
    _shouldSetActive(t) {
      return !this.disabled;
    }
    /**
     * Sets the `active` attribute on the element if an activation key is pressed.
     *
     * @param {KeyboardEvent} event
     * @protected
     * @override
     */
    _onKeyDown(t) {
      super._onKeyDown(t), this._shouldSetActive(t) && this._activeKeys.includes(t.key) && (this._setActive(!0), document.addEventListener(
        "keyup",
        (o) => {
          this._activeKeys.includes(o.key) && this._setActive(!1);
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
    _setActive(t) {
      this.toggleAttribute("active", t);
    }
  };
  /**
   * @license
   * Copyright (c) 2021 - 2022 Vaadin Ltd.
   * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
   */
  const No = S(
    (r) => class extends r {
      /**
       * @protected
       * @return {boolean}
       */
      get _keyboardActive() {
        return ed();
      }
      /** @protected */
      ready() {
        this.addEventListener("focusin", (t) => {
          this._shouldSetFocus(t) && this._setFocused(!0);
        }), this.addEventListener("focusout", (t) => {
          this._shouldRemoveFocus(t) && this._setFocused(!1);
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
      _setFocused(t) {
        this.toggleAttribute("focused", t), this.toggleAttribute("focus-ring", t && this._keyboardActive);
      }
      /**
       * Override to define if the field receives focus based on the event.
       *
       * @param {FocusEvent} _event
       * @return {boolean}
       * @protected
       */
      _shouldSetFocus(t) {
        return !0;
      }
      /**
       * Override to define if the field loses focus based on the event.
       *
       * @param {FocusEvent} _event
       * @return {boolean}
       * @protected
       */
      _shouldRemoveFocus(t) {
        return !0;
      }
    }
  );
  /**
   * @license
   * Copyright (c) 2021 - 2022 Vaadin Ltd.
   * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
   */
  const kn = (r) => class extends bn(r) {
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
    _disabledChanged(t, o) {
      super._disabledChanged(t, o), t ? (this.tabindex !== void 0 && (this._lastTabIndex = this.tabindex), this.tabindex = -1) : o && (this.tabindex = this._lastTabIndex);
    }
    /**
     * When the user has changed tabindex while the element is disabled,
     * the observer reverts tabindex to -1 and rather saves the new tabindex value to apply it later.
     * The new value will be applied as soon as the element becomes enabled.
     *
     * @protected
     */
    _tabindexChanged(t) {
      this.disabled && t !== -1 && (this._lastTabIndex = t, this.tabindex = -1);
    }
  };
  /**
   * @license
   * Copyright (c) 2017 - 2022 Vaadin Ltd.
   * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
   */
  const Ud = (r) => class extends jd(kn(No(r))) {
    static get properties() {
      return {
        /**
         * Indicates whether the element can be focused and where it participates in sequential keyboard navigation.
         *
         * @override
         * @protected
         */
        tabindex: {
          value: 0
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
    _onKeyDown(t) {
      super._onKeyDown(t), this._activeKeys.includes(t.key) && (t.preventDefault(), this.click());
    }
  };
  /**
   * @license
   * Copyright (c) 2017 - 2022 Vaadin Ltd.
   * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
   */
  class Vi extends Ud(gn(it(at(ue)))) {
    static get is() {
      return "vaadin-button";
    }
    static get template() {
      return Pe`
      <style>
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
      </style>
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
    }
    /** @protected */
    ready() {
      super.ready(), this._tooltipController = new fn(this), this.addController(this._tooltipController);
    }
  }
  customElements.define(Vi.is, Vi);
  $(
    "vaadin-date-picker-overlay-content",
    A`
    :host {
      position: relative;
      /* Background for the year scroller, placed here as we are using a mask image on the actual years part */
      background-image: linear-gradient(var(--lumo-shade-5pct), var(--lumo-shade-5pct));
      background-size: 57px 100%;
      background-position: top right;
      background-repeat: no-repeat;
      cursor: default;
    }

    /* Month scroller */

    [part='months'] {
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

    /* Year scroller */
    [part='years'] {
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

    [part='year-number']:not([current]),
    [part='year-separator'] {
      opacity: 0.7;
      transition: 0.2s opacity;
    }

    [part='years']:hover [part='year-number'],
    [part='years']:hover [part='year-separator'] {
      opacity: 1;
    }

    /* TODO unsupported selector */
    #scrollers {
      position: static;
      display: block;
    }

    /* TODO unsupported selector, should fix this in vaadin-date-picker that it adapts to the
       * width of the year scroller */
    #scrollers[desktop] [part='months'] {
      right: auto;
    }

    /* Year scroller position indicator */
    [part='years']::before {
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

    [part='year-number'],
    [part='year-separator'] {
      display: flex;
      align-items: center;
      justify-content: center;
      height: 50%;
      transform: translateY(-50%);
    }

    [part='years'] [part='year-separator']::after {
      color: var(--lumo-disabled-text-color);
      content: '•';
    }

    /* Current year */

    [part='years'] [part='year-number'][current] {
      color: var(--lumo-primary-text-color);
    }

    /* Toolbar (footer) */

    [part='toolbar'] {
      padding: var(--lumo-space-s);
      border-bottom-left-radius: var(--lumo-border-radius-l);
      margin-right: 57px;
    }

    /* Today and Cancel buttons */

    [part='toolbar'] [part\$='button'] {
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

      [part='years'] {
        background-color: var(--lumo-shade-5pct);
      }

      [part='toolbar'],
      [part='months'] {
        margin-right: 0;
      }

      /* TODO make date-picker adapt to the width of the years part */
      [part='years'] {
        --vaadin-infinite-scroller-buffer-width: 90px;
        width: 50px;
      }

      :host([years-visible]) [part='months'] {
        padding-left: 50px;
      }
    }
  `,
    { moduleId: "lumo-date-picker-overlay-content" }
  );
  $(
    "vaadin-month-calendar",
    A`
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

    [part='date'],
    [part='week-number'] {
      box-sizing: border-box;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      height: var(--lumo-size-m);
      position: relative;
    }

    [part='date'] {
      transition: color 0.1s;
    }

    [part='date']:not(:empty) {
      cursor: var(--lumo-clickable-cursor);
    }

    :host([week-numbers]) [part='weekday']:not(:empty),
    :host([week-numbers]) [part='date'] {
      width: calc((100% - var(--lumo-size-xs)) / 7);
    }

    /* Today date */

    [part='date'][today] {
      color: var(--lumo-primary-text-color);
    }

    /* Focused date */

    [part='date']::before {
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

    [part='date'][focused]::before {
      box-shadow: 0 0 0 1px var(--lumo-base-color), 0 0 0 3px var(--lumo-primary-color-50pct);
    }

    :host(:not([focused])) [part='date'][focused]::before {
      animation: vaadin-date-picker-month-calendar-focus-date 1.4s infinite;
    }

    @keyframes vaadin-date-picker-month-calendar-focus-date {
      50% {
        box-shadow: 0 0 0 1px var(--lumo-base-color), 0 0 0 3px transparent;
      }
    }

    [part='date']:not(:empty):not([disabled]):not([selected]):hover::before {
      background-color: var(--lumo-primary-color-10pct);
    }

    [part='date'][selected] {
      color: var(--lumo-primary-contrast-color);
    }

    [part='date'][selected]::before {
      background-color: var(--lumo-primary-color);
    }

    [part='date'][disabled] {
      color: var(--lumo-disabled-text-color);
    }

    @media (pointer: coarse) {
      [part='date']:hover:not([selected])::before,
      [part='date'][focused]:not([selected])::before {
        display: none;
      }

      [part='date']:not(:empty):not([disabled]):active::before {
        display: block;
      }

      [part='date'][selected]::before {
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
  const xn = document.createElement("template");
  xn.innerHTML = `
  <style>
    @keyframes vaadin-date-picker-month-calendar-focus-date {
      50% {
        box-shadow: 0 0 0 2px transparent;
      }
    }
  </style>
`;
  document.head.appendChild(xn.content);
  /**
   * @license
   * Copyright (c) 2017 - 2022 Vaadin Ltd.
   * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
   */
  const wn = document.createElement("template");
  wn.innerHTML = `
  <style>
    @font-face {
      font-family: 'lumo-icons';
      src: url(data:application/font-woff;charset=utf-8;base64,d09GRgABAAAAABEgAAsAAAAAIjQAAQAAAAAAAAAAAAAAAAAAAAAAAAAAAABHU1VCAAABCAAAADsAAABUIIslek9TLzIAAAFEAAAAQwAAAFZAIUuKY21hcAAAAYgAAAD4AAADrsCU8d5nbHlmAAACgAAAC2cAABeAWri7U2hlYWQAAA3oAAAAMAAAADZa/6SsaGhlYQAADhgAAAAdAAAAJAbpA35obXR4AAAOOAAAABAAAACspBAAAGxvY2EAAA5IAAAAWAAAAFh57oA4bWF4cAAADqAAAAAfAAAAIAFKAXBuYW1lAAAOwAAAATEAAAIuUUJZCHBvc3QAAA/0AAABKwAAAelm8SzVeJxjYGRgYOBiMGCwY2BycfMJYeDLSSzJY5BiYGGAAJA8MpsxJzM9kYEDxgPKsYBpDiBmg4gCACY7BUgAeJxjYGS+yDiBgZWBgamKaQ8DA0MPhGZ8wGDIyAQUZWBlZsAKAtJcUxgcXjG+0mIO+p/FEMUcxDANKMwIkgMABn8MLQB4nO3SWW6DMABF0UtwCEnIPM/zhLK8LqhfXRybSP14XUYtHV9hGYQwQBNIo3cUIPkhQeM7rib1ekqnXg981XuC1qvy84lzojleh3puxL0hPjGjRU473teloEefAUNGjJkwZcacBUtWrNmwZceeA0dOnLlw5cadB09elPGhGf+j0NTI/65KfXerT6JhqKnpRKtgOpuqaTrtKjPUlqHmhto21I7pL6i6hlqY3q7qGWrfUAeGOjTUkaGODXViqFNDnRnq3FAXhro01JWhrg11Y6hbQ90Z6t5QD4Z6NNSToZ4N9WKoV0O9GerdUB+G+jTUl6GWRvkL24BkEXictVh9bFvVFb/nxvbz+7Rf/N6zHcd2bCfP+Wic1Z9N0jpNHCD9SNqqoVBgbQoMjY+pjA4hNnWa2pV1rHSIif0DGkyT2k10Kmu1Cag6huj4ZpqYBHSqJsTEJgZCG3TaVBFv595nO3ZIv4RIrPPuvefe884599zzO/cRF8G/tgn6CFFImNgkR0ggX8wlspbhSSWSdrC5ozd30s2dw5afzvgtyz9/zG9t1hV4RtF1pXolowvtzc2z6L2aYUQM45jKH9WDTvd1LRDoDASYWhfTzTyvboXz6uZX4ARX5wrF39y+HM2+CJ8d0pkyqBIqoze3D12ez4DrFoYzxI8dWwMrDlZ2DMqQAR9AROsJU+2smlTPaTTco52BVxXa2a2+I8vvqd2dVHm1LoPeTn/AZPRYGthDYOeZjBjKoFsVGulR3lGU95SeCK44oHU7MhWUGUKZDT3oSUcG2GWuh+EDDfUYA/jhIhl0TOsJNYSEu7mQmi3UzfXwZKA4BsVsHLXQYGgJW95qEtpJ1VcW9HiTriZBlFEqxsDjA09yCNUoQxxwd7KWSTt2y3GTKifkqHRCoWZc3m11Wa/dKdFgXD4kSYfkeJBKd8KMz7J8dZn/cGRCcLGDnA2Ge3bKzcvlnTDNthFWLH7Xt80ua5FMjA4WKelWv5Xo16vHuYzpRbJhhdVlftuRK0VlR27D9lu5TF0DPBi60OrHNO0AfP/uRWvhn/U3LXICE+nh+3IHPUJ8JE6GyBjZQLbjGchlrSgYngF8zyrIF4NJD3atUcgWsWunGN/UHX5B5/yg7uF87Nqp4Gf52F3gH73DjEZNRoqCKAr9giQJp5rGJABpiVE2htNhW9R8nw0jqYjCYcY4LIjwYNScf4WN06IZnZCEqsI4cFaQbo4Z1TsZBx40YhXkHOecaYE5oY37IIQ+iJJ+UsDYSun5MuRSBRZRUUhlY2DqOGajOR6zrSU/5My6l2DnusH1GQgnw5BZP7iuYM/ahcfQ7Z8y51ddfutvuwNqWQ0cBYr8fj0U0vsHpwerVaB2sWhXT2NExi2r1KUE2tUuVMnkepVQrxTmpQrZTG4iu8he8iPyM3KcPE/+RP5KPoE2CEAKclCBzXATxkYOtUY/o961PWRqsj0chRrHFBbtrjP9/P0ven5pcbRdpL94vfsy33e5+izuwz3nFLFPVNayPZx/jdG1fOChflFRvYzsW6L18efgLrSWIgvcqnGJYi4skO4xREURjbDuxKke5v0T3Mrzkt2fi31uyZlLLrqIpEuXXsMlgw442Jb0GAxjS1DM20kBoCzHLXm/jEm0IltdcvU0fEW24jgiwwRjVd9u4NJHcIyoHJcwvyVqgqj5hqBJ1ZWSJryh9p56UWhX1XbhRbW2ZopuZWsQd5y8mEQ8M+C6xjRYxZbDKWf5AgY+Qq/l6wSPk16zDFjowYuu+wjx13mfkxbyDDxadYT/LijZyI0THB+6yfLaWsRcO82zo9mWTNtpO18qlorZoIVMwSN40tky5DOQ1MCIAe24mvlsuwIIxPb10+uXDQ4uWz/9m3rj+ql7p6bufZARuPVq5tXtsn6KwfP8Jy0TeWOyNhUJN6mhX5rkUTtUppQWEMNTqEdaCGKFYKJaQrCE4JtDLYOlNEKmO5kBTPGY2A0N2sY3+dVlo1N9ycBsIGtOjQ2p/tlZvzo0ur4v6cOh8NTospB7U/X40KahoU3bGIH97dnwmtHlYffVG3R1YOwKM2vNhrPhCT5zk64sG53oS4b31aYjqe/B7+kQiXBN+b6h21hNUPMq29B8CU4elINdygMPKF1B+WBTG7Z9ZshpN/xwEuuDQZR+nuoo4CDaAiiwXmLpmukMQyPf/JMclqgL1ixZQ/nnP2VbdUODFGt2fgBvL123rlLYu/6A9ckb7F3K0/CyBMEu6aQoPscroCcacVehvyQyCZAsizsWWBkoLC+WAiWnOksLKaeuQDzGuqSk42aiYTiJ4zf9afl17SrqaTO1f+XlZAfIuYcq7/IqYMaMrksOJ6vHkOCPDq943xcCnHqVD9pHFRpMqSPXrIua1WNs+tOz1U+ciTCDpPk+c4QYJIHnYhxP/kVPAq+ahFpVhPcHp8qyarhiF+HsBU9Hrl+UZa876fbKipL0KqB6OdUveErgtOI97fZ63ae9SvWU6k2w1JfwqnUbHsYcFCJFrC/W12zIMMirWYEHxMPs6LGYSdkSZ5TsNP9PCpwnWC3HKZ1lydNjWHC2Mn3l6vL0dHn1ldP3LTSrX+vKrBqv7KmMr8p0SR6P1NqF63or6XRlIyO90f7+kf7+myOhvt4tq7f09oUiTc2/dycGgqFQcCDRLYmi1NL7fk0CknVMxEg/cdfs/TnpJMNkgqwj17B8beVazSrVbU4lG67IZYOCnWrYy3yBR9cyWcChywos3LJBEdhhFoAdYjiw0rLGm0xU5OzoGm5/ZfmHjVZpNNg6SznzGKDdwv2cCtVn6Eaxo12cfxLprpVtTcZ6hVx6dow7Yq7e8LXO8PY9Jgjoze9yCtU5FNbegcKkQMdCbt9au/te4Ebe0jkc0ukUL32eYnTpNs20h0KpUOhZPYwVcfhZnfdqeCvDfXiuCbAoYWcXERPc/mDQD3/hdF+wK4i/xv3kYfprIpAuMkk2kW3kdtS0kBIKpZwp8KxmsCyfM1MFzAss9LBkDxRyThiaqTLwKYKJVTwmWTudMyz+yks09346MDh4m72yOxCKrt1XMlQ1qPVlTEVVQ1ofdK/sCWjtZu9qGwZ8YZ9PPWlo1IV3eW3+U0aXblP39zrt+JPf6UhEQ1rUjNBULN+utyuaDNW34kpAVuSOeMTyWbSNWnooFu+QFNWQ4d/Ox4IPWx41fP/fB/Rjeoz08ezPA9TysMtmnOXfGN7Ui3xIYLDALrlDLOP09qtJuY2OeL0+QZXdRnR1nxRVBF/SOyKKPpcrn9mWzH4rH9IidE+PTNU2182+hOgSItrE1slByS24vaLvJpxOqe4Pduf3HJkZ+jLqUz9rRzB7p8gKcgWZwV1L8JtUS5Z2JxZSOCuBoMTQihMzLbCPA0KqGMAljRQjONklW/wjnXKy8vxT/Elvm3/KiMUMOoV0/vnDYlhec0SMKtt3/kKMyOt33tj2bqxQLsTjSGLl+EAsNhCnTyRGktW55EgCn/A4PlnWn+Mg8bgZrWqHxTbPwMuyy1u5YeZF2SUM7JRhddwRgiRuxpmgJmxn9ZW7XpcF3ViX/ar6ptRpGJ0S9Adg4qhb9sI3vbL7qNJV/y4i07t5TZBiho1imFoMz3gED+CtjYUxvP4SOxov4bFoNPg5aR1e+G4UgDPoedJTpogyCJ7oYvRqoVS0MQAy+CoNEdTDUjok5ZHZL/WtjV7rFj3PKQE3iKp7ou+rIxN3b9LB1dGjeT4cvKo3FrnWpYpuaFd/h3dtV8UeKN1Y9hpR3dt4p0H/zKuPQq0kZQUIIpuDfoiETsnIk+gCWMJZUXHtE8V9LkUc2TE8vOMbO4ax/MACabzyaGXc7u3FBr11ThBdB8SIeMAlCntG2KThHSPsaj2Dc9KNyY2a0KZ7ODaTHoRiFkeYz+shZBpCS4X6471KKKnuHd84edfk5F37d1XO5bbkcltu2ZLNbvnPXiUVAnVvprJrP+NObryjxrllS65md6Tm6wzFHRR4dY3QUUjb7MgxaIixU8hspi98fl/Xc+IB4iU66eCVL9YfAfahiSUt4TONS8x0D8W7u8vd3fGWx6OXlM/U1IoU/s61PGhpyXRFa3eReq2qG56lvmYtXavCC1iN7lbiBpWxXHU+cSlztVLVz0tVN600fVsLxaVDknhYioeoXP3t4lqV1r79MAw0GCI1FTL1YIGzPL1MMlJ9ZsN9P7lvA2yr9ZFUzwzPrVgxN/x/SS+chwB4nGNgZGBgAOLPrYdY4vltvjJwM78AijDUqG5oRND/XzNPZboF5HIwMIFEAU/lC+J4nGNgZGBgDvqfBSRfMAAB81QGRgZUoA0AVvYDbwAAAHicY2BgYGB+MTQwAM8EJo8AAAAAAE4AmgDoAQoBLAFOAXABmgHEAe4CGgKcAugEmgS8BNYE8gUOBSoFegXQBf4GRAZmBrYHGAeQCBgIUghqCP4JRgm+CdoKBAo+CoQKugr0C1QLmgvAeJxjYGRgYNBmTGEQZQABJiDmAkIGhv9gPgMAGJQBvAB4nG2RPU7DMBiG3/QP0UoIBGJh8QILavozdmRo9w7d09RpUzlx5LgVvQMn4BAcgoEzcAgOwVvzSZVQbcnf48fvFysJgGt8IcJxROiG9TgauODuj5ukG+EW+UG4jR4ehTv0Q+EunjER7uEWmk+IWpc0d3gVbuAKb8JN+nfhFvlDuI17fAp36L+Fu1jgR7iHp+jF7Arbz1Nb1nO93pnEncSJFtrVuS3VKB6e5EyX2iVer9TyoOr9eux9pjJnCzW1pdfGWFU5u9WpjzfeV5PBIBMfp7aAwQ4FLPrIkbKWqDHn+67pDRK4s4lzbsEux5qHvcIIMb/nueSMyTKkE3jWFdNLHLjW2PPmMa1Hxn3GjGW/wjT0HtOG09JU4WxLk9LH2ISuiv9twJn9y8fh9uIXI+BknAAAAHicbY7ZboMwEEW5CVBCSLrv+76kfJRjTwHFsdGAG+Xvy5JUfehIHp0rnxmNN/D6ir3/a4YBhvARIMQOIowQY4wEE0yxiz3s4wCHOMIxTnCKM5zjApe4wjVucIs73OMBj3jCM17wije84wMzfHqJ0EVmUkmmJo77oOmrHvfIRZbXsTCZplTZldlgb3TYGVHProwFs11t1A57tcON2rErR3PBqcwF1/6ctI6k0GSU4JHMSS6WghdJQ99sTbfuN7QLJ9vQ37dNrgyktnIxlDYLJNuqitpRbYWKFNuyDT6pog6oOYKHtKakeakqKjHXpPwlGRcsC+OqxLIiJpXqoqqDMreG2l5bv9Ri3TRX+c23DZna9WFFgmXuO6Ps1Jm/w6ErW8N3FbHn/QC444j0AA==) format('woff');
      font-weight: normal;
      font-style: normal;
    }

    html {
      --lumo-icons-align-center: "\\ea01";
      --lumo-icons-align-left: "\\ea02";
      --lumo-icons-align-right: "\\ea03";
      --lumo-icons-angle-down: "\\ea04";
      --lumo-icons-angle-left: "\\ea05";
      --lumo-icons-angle-right: "\\ea06";
      --lumo-icons-angle-up: "\\ea07";
      --lumo-icons-arrow-down: "\\ea08";
      --lumo-icons-arrow-left: "\\ea09";
      --lumo-icons-arrow-right: "\\ea0a";
      --lumo-icons-arrow-up: "\\ea0b";
      --lumo-icons-bar-chart: "\\ea0c";
      --lumo-icons-bell: "\\ea0d";
      --lumo-icons-calendar: "\\ea0e";
      --lumo-icons-checkmark: "\\ea0f";
      --lumo-icons-chevron-down: "\\ea10";
      --lumo-icons-chevron-left: "\\ea11";
      --lumo-icons-chevron-right: "\\ea12";
      --lumo-icons-chevron-up: "\\ea13";
      --lumo-icons-clock: "\\ea14";
      --lumo-icons-cog: "\\ea15";
      --lumo-icons-cross: "\\ea16";
      --lumo-icons-download: "\\ea17";
      --lumo-icons-dropdown: "\\ea18";
      --lumo-icons-edit: "\\ea19";
      --lumo-icons-error: "\\ea1a";
      --lumo-icons-eye: "\\ea1b";
      --lumo-icons-eye-disabled: "\\ea1c";
      --lumo-icons-menu: "\\ea1d";
      --lumo-icons-minus: "\\ea1e";
      --lumo-icons-ordered-list: "\\ea1f";
      --lumo-icons-phone: "\\ea20";
      --lumo-icons-photo: "\\ea21";
      --lumo-icons-play: "\\ea22";
      --lumo-icons-plus: "\\ea23";
      --lumo-icons-redo: "\\ea24";
      --lumo-icons-reload: "\\ea25";
      --lumo-icons-search: "\\ea26";
      --lumo-icons-undo: "\\ea27";
      --lumo-icons-unordered-list: "\\ea28";
      --lumo-icons-upload: "\\ea29";
      --lumo-icons-user: "\\ea2a";
    }
  </style>
`;
  document.head.appendChild(wn.content);
  /**
   * @license
   * Copyright (c) 2017 - 2022 Vaadin Ltd.
   * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
   */
  const Cn = A`
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
  $("", Cn, { moduleId: "lumo-field-button" });
  /**
   * @license
   * Copyright (c) 2017 - 2022 Vaadin Ltd.
   * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
   */
  const Vd = A`
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
   * Copyright (c) 2017 - 2022 Vaadin Ltd.
   * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
   */
  const An = A`
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
    content: var(--lumo-required-field-indicator, '•');
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
  $("", An, { moduleId: "lumo-required-field" });
  /**
   * @license
   * Copyright (c) 2017 - 2022 Vaadin Ltd.
   * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
   */
  const qd = A`
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

  /* Disabled style */
  :host([disabled]) {
    pointer-events: none;
  }

  :host([disabled]) [part='label'],
  :host([disabled]) [part='input-field'] ::slotted(*) {
    color: var(--lumo-disabled-text-color);
    -webkit-text-fill-color: var(--lumo-disabled-text-color);
  }

  /* Invalid style */
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
  [part='input-field'] ::slotted(:not(iron-icon):not(vaadin-icon):not(input):not(textarea)) {
    color: var(--lumo-secondary-text-color);
    font-weight: 400;
  }

  [part='clear-button']::before {
    content: var(--lumo-icons-cross);
  }
`, En = [An, Cn, Vd, qd];
  $("", En, {
    moduleId: "lumo-input-field-shared-styles"
  });
  const Yd = A`
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
  $("vaadin-date-picker", [En, Yd], { moduleId: "lumo-date-picker" });
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
  const Nr = "disable-upgrade", Wd = (r) => {
    for (; r; ) {
      const e = Object.getOwnPropertyDescriptor(r, "observedAttributes");
      if (e)
        return e.get;
      r = Object.getPrototypeOf(r.prototype).constructor;
    }
    return () => [];
  }, Gd = S((r) => {
    const e = Ga(r);
    let t = Wd(e);
    class o extends e {
      constructor() {
        super(), this.__isUpgradeDisabled;
      }
      static get observedAttributes() {
        return t.call(this).concat(Nr);
      }
      // Prevent element from initializing properties when it's upgrade disabled.
      /** @override */
      _initializeProperties() {
        this.hasAttribute(Nr) ? this.__isUpgradeDisabled = !0 : super._initializeProperties();
      }
      // Prevent element from enabling properties when it's upgrade disabled.
      // Normally overriding connectedCallback would be enough, but dom-* elements
      /** @override */
      _enableProperties() {
        this.__isUpgradeDisabled || super._enableProperties();
      }
      // If the element starts upgrade-disabled and a property is set for
      // which an accessor exists, the default should not be applied.
      // This additional check is needed because defaults are applied via
      // `_initializeProperties` which is called after initial properties
      // have been set when the element starts upgrade-disabled.
      /** @override */
      _canApplyPropertyDefault(a) {
        return super._canApplyPropertyDefault(a) && !(this.__isUpgradeDisabled && this._isPropertyPending(a));
      }
      /**
       * @override
       * @param {string} name Attribute name.
       * @param {?string} old The previous value for the attribute.
       * @param {?string} value The new value for the attribute.
       * @param {?string} namespace The XML namespace for the attribute.
       * @return {void}
       */
      attributeChangedCallback(a, n, s, l) {
        a == Nr ? this.__isUpgradeDisabled && s == null && (super._initializeProperties(), this.__isUpgradeDisabled = !1, E(this).isConnected && super.connectedCallback()) : super.attributeChangedCallback(
          a,
          n,
          s,
          /** @type {null|string} */
          l
        );
      }
      // Prevent element from connecting when it's upgrade disabled.
      // This prevents user code in `attached` from being called.
      /** @override */
      connectedCallback() {
        this.__isUpgradeDisabled || super.connectedCallback();
      }
      // Prevent element from disconnecting when it's upgrade disabled.
      // This avoids allowing user code `detached` from being called without a
      // paired call to `attached`.
      /** @override */
      disconnectedCallback() {
        this.__isUpgradeDisabled || super.disconnectedCallback();
      }
    }
    return o;
  });
  /**
   * @license
   * Copyright (c) 2021 - 2022 Vaadin Ltd.
   * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
   */
  function Kd(r) {
    const e = [];
    for (; r; ) {
      if (r.nodeType === Node.DOCUMENT_NODE) {
        e.push(r);
        break;
      }
      if (r.nodeType === Node.DOCUMENT_FRAGMENT_NODE) {
        e.push(r), r = r.host;
        continue;
      }
      if (r.assignedSlot) {
        r = r.assignedSlot;
        continue;
      }
      r = r.parentNode;
    }
    return e;
  }
  function Pn(r) {
    return r ? new Set(r.split(" ")) : /* @__PURE__ */ new Set();
  }
  function Sn(r) {
    return [...r].join(" ");
  }
  function Xd(r, e, t) {
    const o = Pn(r.getAttribute(e));
    o.add(t), r.setAttribute(e, Sn(o));
  }
  function Jd(r, e, t) {
    const o = Pn(r.getAttribute(e));
    if (o.delete(t), o.size === 0) {
      r.removeAttribute(e);
      return;
    }
    r.setAttribute(e, Sn(o));
  }
  /**
   * @license
   * Copyright (c) 2017 - 2022 Vaadin Ltd.
   * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
   */
  const zr = {
    start: "top",
    end: "bottom"
  }, Lr = {
    start: "left",
    end: "right"
  }, qi = new ResizeObserver((r) => {
    setTimeout(() => {
      r.forEach((e) => {
        e.target.__overlay && e.target.__overlay._updatePosition();
      });
    });
  }), Qd = (r) => class extends r {
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
      window.addEventListener("resize", this._updatePosition), this.__positionTargetAncestorRootNodes = Kd(this.positionTarget), this.__positionTargetAncestorRootNodes.forEach((t) => {
        t.addEventListener("scroll", this.__onScroll, !0);
      });
    }
    /** @private */
    __removeUpdatePositionEventListeners() {
      window.removeEventListener("resize", this._updatePosition), this.__positionTargetAncestorRootNodes && (this.__positionTargetAncestorRootNodes.forEach((t) => {
        t.removeEventListener("scroll", this.__onScroll, !0);
      }), this.__positionTargetAncestorRootNodes = null);
    }
    /** @private */
    __overlayOpenedChanged(t, o) {
      if (this.__removeUpdatePositionEventListeners(), o && (o.__overlay = null, qi.unobserve(o), t && (this.__addUpdatePositionEventListeners(), o.__overlay = this, qi.observe(o))), t) {
        const i = getComputedStyle(this);
        this.__margins || (this.__margins = {}, ["top", "bottom", "left", "right"].forEach((a) => {
          this.__margins[a] = parseInt(i[a], 10);
        })), this.setAttribute("dir", i.direction), this._updatePosition(), requestAnimationFrame(() => this._updatePosition());
      }
    }
    get __isRTL() {
      return this.getAttribute("dir") === "rtl";
    }
    __positionSettingsChanged() {
      this._updatePosition();
    }
    /** @private */
    __onScroll(t) {
      this.contains(t.target) || this._updatePosition();
    }
    _updatePosition() {
      if (!this.positionTarget || !this.opened)
        return;
      const t = this.positionTarget.getBoundingClientRect(), o = this.__shouldAlignStartVertically(t);
      this.style.justifyContent = o ? "flex-start" : "flex-end";
      const i = this.__shouldAlignStartHorizontally(t, this.__isRTL), a = !this.__isRTL && i || this.__isRTL && !i;
      this.style.alignItems = a ? "flex-start" : "flex-end";
      const n = this.getBoundingClientRect(), s = this.__calculatePositionInOneDimension(
        t,
        n,
        this.noVerticalOverlap,
        zr,
        this,
        o
      ), l = this.__calculatePositionInOneDimension(
        t,
        n,
        this.noHorizontalOverlap,
        Lr,
        this,
        i
      );
      Object.assign(this.style, s, l), this.toggleAttribute("bottom-aligned", !o), this.toggleAttribute("top-aligned", o), this.toggleAttribute("end-aligned", !a), this.toggleAttribute("start-aligned", a);
    }
    __shouldAlignStartHorizontally(t, o) {
      const i = Math.max(this.__oldContentWidth || 0, this.$.overlay.offsetWidth);
      this.__oldContentWidth = this.$.overlay.offsetWidth;
      const a = Math.min(window.innerWidth, document.documentElement.clientWidth), n = !o && this.horizontalAlign === "start" || o && this.horizontalAlign === "end";
      return this.__shouldAlignStart(
        t,
        i,
        a,
        this.__margins,
        n,
        this.noHorizontalOverlap,
        Lr
      );
    }
    __shouldAlignStartVertically(t) {
      const o = this.requiredVerticalSpace || Math.max(this.__oldContentHeight || 0, this.$.overlay.offsetHeight);
      this.__oldContentHeight = this.$.overlay.offsetHeight;
      const i = Math.min(window.innerHeight, document.documentElement.clientHeight), a = this.verticalAlign === "top";
      return this.__shouldAlignStart(
        t,
        o,
        i,
        this.__margins,
        a,
        this.noVerticalOverlap,
        zr
      );
    }
    // eslint-disable-next-line max-params
    __shouldAlignStart(t, o, i, a, n, s, l) {
      const c = i - t[s ? l.end : l.start] - a[l.end], d = t[s ? l.start : l.end] - a[l.start], u = n ? c : d, g = u > (n ? d : c) || u > o;
      return n === g;
    }
    /**
     * Returns an adjusted value after resizing the browser window,
     * to avoid wrong calculations when e.g. previously set `bottom`
     * CSS property value is larger than the updated viewport height.
     * See https://github.com/vaadin/web-components/issues/4604
     */
    __adjustBottomProperty(t, o, i) {
      let a;
      if (t === o.end) {
        if (o.end === zr.end) {
          const n = Math.min(window.innerHeight, document.documentElement.clientHeight);
          if (i > n && this.__oldViewportHeight) {
            const s = this.__oldViewportHeight - n;
            a = i - s;
          }
          this.__oldViewportHeight = n;
        }
        if (o.end === Lr.end) {
          const n = Math.min(window.innerWidth, document.documentElement.clientWidth);
          if (i > n && this.__oldViewportWidth) {
            const s = this.__oldViewportWidth - n;
            a = i - s;
          }
          this.__oldViewportWidth = n;
        }
      }
      return a;
    }
    /**
     * Returns an object with CSS position properties to set,
     * e.g. { top: "100px" }
     */
    // eslint-disable-next-line max-params
    __calculatePositionInOneDimension(t, o, i, a, n, s) {
      const l = s ? a.start : a.end, c = s ? a.end : a.start, d = parseFloat(n.style[l] || getComputedStyle(n)[l]), u = this.__adjustBottomProperty(l, a, d), p = o[s ? a.start : a.end] - t[i === s ? a.end : a.start], g = u ? `${u}px` : `${d + p * (s ? -1 : 1)}px`;
      return {
        [l]: g,
        [c]: ""
      };
    }
  };
  /**
   * @license
   * Copyright (c) 2016 - 2022 Vaadin Ltd.
   * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
   */
  const Zd = A`
  :host([dir='rtl']) [part='input-field'] {
    direction: ltr;
  }

  :host([dir='rtl']) [part='input-field'] ::slotted(input)::placeholder {
    direction: rtl;
    text-align: left;
  }
`, eu = A`
  [part='overlay'] {
    display: flex;
    flex: auto;
  }

  [part~='content'] {
    flex: auto;
  }
`;
  /**
   * @license
   * Copyright (c) 2016 - 2022 Vaadin Ltd.
   * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
   */
  $("vaadin-date-picker-overlay", eu, {
    moduleId: "vaadin-date-picker-overlay-styles"
  });
  let Gt;
  class Yi extends Gd(Qd(oe)) {
    static get is() {
      return "vaadin-date-picker-overlay";
    }
    static get template() {
      return Gt || (Gt = super.template.cloneNode(!0), Gt.content.querySelector('[part~="overlay"]').removeAttribute("tabindex")), Gt;
    }
  }
  customElements.define(Yi.is, Yi);
  /**
  @license
  Copyright (c) 2017 The Polymer Project Authors. All rights reserved.
  This code may only be used under the BSD style license found at http://polymer.github.io/LICENSE.txt
  The complete set of authors may be found at http://polymer.github.io/AUTHORS.txt
  The complete set of contributors may be found at http://polymer.github.io/CONTRIBUTORS.txt
  Code distributed by Google as part of the polymer project is also
  subject to an additional IP rights grant found at http://polymer.github.io/PATENTS.txt
  */
  class nr {
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
    setConfig(e, t) {
      this._asyncModule = e, this._callback = t, this._timer = this._asyncModule.run(() => {
        this._timer = null, Mt.delete(this), this._callback();
      });
    }
    /**
     * Cancels an active debouncer and returns a reference to itself.
     *
     * @return {void}
     */
    cancel() {
      this.isActive() && (this._cancelAsync(), Mt.delete(this));
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
    static debounce(e, t, o) {
      return e instanceof nr ? e._cancelAsync() : e = new nr(), e.setConfig(t, o), e;
    }
  }
  let Mt = /* @__PURE__ */ new Set();
  const tu = function(r) {
    Mt.add(r);
  }, ru = function() {
    const r = !!Mt.size;
    return Mt.forEach((e) => {
      try {
        e.flush();
      } catch (t) {
        setTimeout(() => {
          throw t;
        });
      }
    }), r;
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
  const ou = function() {
    let r, e;
    do
      r = window.ShadyDOM && ShadyDOM.flush(), window.ShadyCSS && window.ShadyCSS.ScopingShim && window.ShadyCSS.ScopingShim.flush(), e = ru();
    while (r || e);
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
  let Wi = !1;
  function iu() {
    if (Sa && !Pa) {
      if (!Wi) {
        Wi = !0;
        const r = document.createElement("style");
        r.textContent = "dom-bind,dom-if,dom-repeat{display:none;}", document.head.appendChild(r);
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
  const au = Nc(ue);
  class Gi extends au {
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
          notify: !mi,
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
      for (let e = 0; e < this.__instances.length; e++)
        this.__detachInstance(e);
      this.__chunkingId && cancelAnimationFrame(this.__chunkingId);
    }
    /**
     * @override
     * @return {void}
     */
    connectedCallback() {
      if (super.connectedCallback(), iu() || (this.style.display = "none"), this.__isDetached) {
        this.__isDetached = !1;
        let e = E(E(this).parentNode);
        for (let t = 0; t < this.__instances.length; t++)
          this.__attachInstance(t, e);
        this.__chunkingId && this.__render();
      }
    }
    __ensureTemplatized() {
      if (!this.__ctor) {
        const e = (
          /** @type {!HTMLTemplateElement} */
          /** @type {!HTMLElement} */
          this
        );
        let t = this.template = e._templateInfo ? e : (
          /** @type {!HTMLTemplateElement} */
          this.querySelector("template")
        );
        if (!t) {
          let i = new MutationObserver(() => {
            if (this.querySelector("template"))
              i.disconnect(), this.__render();
            else
              throw new Error("dom-repeat requires a <template> child");
          });
          return i.observe(this, { childList: !0 }), !1;
        }
        let o = {};
        o[this.as] = !0, o[this.indexAs] = !0, o[this.itemsIndexAs] = !0, this.__ctor = Ot(t, this, {
          mutableData: this.mutableData,
          parentModel: !0,
          instanceProps: o,
          /**
           * @this {DomRepeat}
           * @param {string} prop Property to set
           * @param {*} value Value to set property to
           */
          forwardHostProp: function(i, a) {
            let n = this.__instances;
            for (let s = 0, l; s < n.length && (l = n[s]); s++)
              l.forwardHostProp(i, a);
          },
          /**
           * @this {DomRepeat}
           * @param {Object} inst Instance to notify
           * @param {string} prop Property to notify
           * @param {*} value Value to notify
           */
          notifyInstanceProp: function(i, a, n) {
            if (ml(this.as, a)) {
              let s = i[this.itemsIndexAs];
              a == this.as && (this.items[s] = n);
              let l = St(this.as, `${JSCompiler_renameProperty("items", this)}.${s}`, a);
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
    __functionFromPropertyValue(e) {
      if (typeof e == "string") {
        let t = e, o = this.__getMethodHost();
        return function() {
          return o[t].apply(o, arguments);
        };
      }
      return e;
    }
    __sortChanged(e) {
      this.__sortFn = this.__functionFromPropertyValue(e), this.items && this.__debounceRender(this.__render);
    }
    __filterChanged(e) {
      this.__filterFn = this.__functionFromPropertyValue(e), this.items && this.__debounceRender(this.__render);
    }
    __computeFrameTime(e) {
      return Math.ceil(1e3 / e);
    }
    __observeChanged() {
      this.__observePaths = this.observe && this.observe.replace(".*", ".").split(" ");
    }
    __handleObservedPaths(e) {
      if (this.__sortFn || this.__filterFn) {
        if (!e)
          this.__debounceRender(this.__render, this.delay);
        else if (this.__observePaths) {
          let t = this.__observePaths;
          for (let o = 0; o < t.length; o++)
            e.indexOf(t[o]) === 0 && this.__debounceRender(this.__render, this.delay);
        }
      }
    }
    __itemsChanged(e) {
      this.items && Array.isArray(this.items), this.__handleItemPath(e.path, e.value) || (e.path === "items" && (this.__itemsArrayChanged = !0), this.__debounceRender(this.__render));
    }
    /**
     * @param {function(this:DomRepeat)} fn Function to debounce.
     * @param {number=} delay Delay in ms to debounce by.
     */
    __debounceRender(e, t = 0) {
      this.__renderDebouncer = nr.debounce(
        this.__renderDebouncer,
        t > 0 ? wl.after(t) : ko,
        e.bind(this)
      ), tu(this.__renderDebouncer);
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
      this.__debounceRender(this.__render), ou();
    }
    __render() {
      if (!this.__ensureTemplatized())
        return;
      let e = this.items || [];
      const t = this.__sortAndFilterItems(e), o = this.__calculateLimit(t.length);
      this.__updateInstances(e, o, t), this.initialCount && (this.__shouldMeasureChunk || this.__shouldContinueChunking) && (cancelAnimationFrame(this.__chunkingId), this.__chunkingId = requestAnimationFrame(() => {
        this.__chunkingId = null, this.__continueChunking();
      })), this._setRenderedItemCount(this.__instances.length), (!mi || this.notifyDomChange) && this.dispatchEvent(new CustomEvent("dom-change", {
        bubbles: !0,
        composed: !0
      }));
    }
    __sortAndFilterItems(e) {
      let t = new Array(e.length);
      for (let o = 0; o < e.length; o++)
        t[o] = o;
      return this.__filterFn && (t = t.filter((o, i, a) => this.__filterFn(e[o], i, a))), this.__sortFn && t.sort((o, i) => this.__sortFn(e[o], e[i])), t;
    }
    __calculateLimit(e) {
      let t = e;
      const o = this.__instances.length;
      if (this.initialCount) {
        let i;
        !this.__chunkCount || this.__itemsArrayChanged && !this.reuseChunkedInstances ? (t = Math.min(e, this.initialCount), i = Math.max(t - o, 0), this.__chunkCount = i || 1) : (i = Math.min(
          Math.max(e - o, 0),
          this.__chunkCount
        ), t = Math.min(o + i, e)), this.__shouldMeasureChunk = i === this.__chunkCount, this.__shouldContinueChunking = t < e, this.__renderStartTime = performance.now();
      }
      return this.__itemsArrayChanged = !1, t;
    }
    __continueChunking() {
      if (this.__shouldMeasureChunk) {
        const e = performance.now() - this.__renderStartTime, t = this._targetFrameTime / e;
        this.__chunkCount = Math.round(this.__chunkCount * t) || 1;
      }
      this.__shouldContinueChunking && this.__debounceRender(this.__render);
    }
    __updateInstances(e, t, o) {
      const i = this.__itemsIdxToInstIdx = {};
      let a;
      for (a = 0; a < t; a++) {
        let n = this.__instances[a], s = o[a], l = e[s];
        i[s] = a, n ? (n._setPendingProperty(this.as, l), n._setPendingProperty(this.indexAs, a), n._setPendingProperty(this.itemsIndexAs, s), n._flushProperties()) : this.__insertInstance(l, a, s);
      }
      for (let n = this.__instances.length - 1; n >= a; n--)
        this.__detachAndRemoveInstance(n);
    }
    __detachInstance(e) {
      let t = this.__instances[e];
      const o = E(t.root);
      for (let i = 0; i < t.children.length; i++) {
        let a = t.children[i];
        o.appendChild(a);
      }
      return t;
    }
    __attachInstance(e, t) {
      let o = this.__instances[e];
      t.insertBefore(o.root, this);
    }
    __detachAndRemoveInstance(e) {
      this.__detachInstance(e), this.__instances.splice(e, 1);
    }
    __stampInstance(e, t, o) {
      let i = {};
      return i[this.as] = e, i[this.indexAs] = t, i[this.itemsIndexAs] = o, new this.__ctor(i);
    }
    __insertInstance(e, t, o) {
      const i = this.__stampInstance(e, t, o);
      let a = this.__instances[t + 1], n = a ? a.children[0] : this;
      return E(E(this).parentNode).insertBefore(i.root, n), this.__instances[t] = i, i;
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
    _showHideChildren(e) {
      for (let t = 0; t < this.__instances.length; t++)
        this.__instances[t]._showHideChildren(e);
    }
    // Called as a side effect of a host items.<key>.<path> path change,
    // responsible for notifying item.<path> changes to inst for key
    __handleItemPath(e, t) {
      let o = e.slice(6), i = o.indexOf("."), a = i < 0 ? o : o.substring(0, i);
      if (a == parseInt(a, 10)) {
        let n = i < 0 ? "" : o.substring(i + 1);
        this.__handleObservedPaths(n);
        let s = this.__itemsIdxToInstIdx[a], l = this.__instances[s];
        if (l) {
          let c = this.as + (n ? "." + n : "");
          l._setPendingPropertyOrPath(c, t, !1, !0), l._flushProperties();
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
    itemForElement(e) {
      let t = this.modelForElement(e);
      return t && t[this.as];
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
    indexForElement(e) {
      let t = this.modelForElement(e);
      return t && t[this.indexAs];
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
    modelForElement(e) {
      return Gc(this.template, e);
    }
  }
  customElements.define(Gi.is, Gi);
  /**
   * @license
   * Copyright (c) 2016 - 2022 Vaadin Ltd.
   * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
   */
  function nu(r) {
    let e = r.getDay();
    e === 0 && (e = 7);
    const t = 4 - e, o = new Date(r.getTime() + t * 24 * 3600 * 1e3), i = new Date(0, 0);
    i.setFullYear(o.getFullYear());
    const a = o.getTime() - i.getTime(), n = Math.round(a / (24 * 3600 * 1e3));
    return Math.floor(n / 7 + 1);
  }
  function ie(r, e) {
    return r instanceof Date && e instanceof Date && r.getFullYear() === e.getFullYear() && r.getMonth() === e.getMonth() && r.getDate() === e.getDate();
  }
  function yt(r, e, t) {
    return (!e || r >= e) && (!t || r <= t);
  }
  function Tn(r, e) {
    return e.filter((t) => t !== void 0).reduce((t, o) => {
      if (!o)
        return t;
      if (!t)
        return o;
      const i = Math.abs(r.getTime() - o.getTime()), a = Math.abs(t.getTime() - r.getTime());
      return i < a ? o : t;
    });
  }
  function Dn(r) {
    return {
      day: r.getDate(),
      month: r.getMonth(),
      year: r.getFullYear()
    };
  }
  function su(r, e, t = 0, o = 1) {
    if (e > 99)
      throw new Error("The provided year cannot have more than 2 digits.");
    if (e < 0)
      throw new Error("The provided year cannot be negative.");
    let i = e + Math.floor(r.getFullYear() / 100) * 100;
    return r < new Date(i - 50, t, o) ? i -= 100 : r > new Date(i + 50, t, o) && (i += 100), i;
  }
  function gt(r) {
    const e = /^([-+]\d{1}|\d{2,4}|[-+]\d{6})-(\d{1,2})-(\d{1,2})$/.exec(r);
    if (!e)
      return;
    const t = new Date(0, 0);
    return t.setFullYear(parseInt(e[1], 10)), t.setMonth(parseInt(e[2], 10) - 1), t.setDate(parseInt(e[3], 10)), t;
  }
  /**
   * @license
   * Copyright (c) 2016 - 2022 Vaadin Ltd.
   * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
   */
  class Ki extends No(it(ue)) {
    static get template() {
      return Pe`
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

        [part='date'] {
          outline: none;
        }

        [part='week-number'][hidden],
        [part='weekday'][hidden] {
          display: none;
        }

        [part='weekday'],
        [part='date'] {
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
        :host([week-numbers]) [part='date'] {
          width: 12.5%;
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
                  part="date"
                  date="[[item]]"
                  today$="[[_isToday(item)]]"
                  focused$="[[__isDayFocused(item, focusedDate)]]"
                  tabindex$="[[__getDayTabindex(item, focusedDate)]]"
                  selected$="[[__isDaySelected(item, selectedDate)]]"
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
    /** @protected */
    ready() {
      super.ready(), Q(this.$.monthGrid, "tap", this._handleTap.bind(this));
    }
    get focusableDateElement() {
      return [...this.shadowRoot.querySelectorAll("[part=date]")].find((e) => ie(e.date, this.focusedDate));
    }
    /* Returns true if all the dates in the month are out of the allowed range */
    _isDisabled(e, t, o) {
      const i = new Date(0, 0);
      i.setFullYear(e.getFullYear()), i.setMonth(e.getMonth()), i.setDate(1);
      const a = new Date(0, 0);
      return a.setFullYear(e.getFullYear()), a.setMonth(e.getMonth() + 1), a.setDate(0), t && o && t.getMonth() === o.getMonth() && t.getMonth() === e.getMonth() && o.getDate() - t.getDate() >= 0 ? !1 : !yt(i, t, o) && !yt(a, t, o);
    }
    _getTitle(e, t) {
      if (!(e === void 0 || t === void 0))
        return this.i18n.formatTitle(t[e.getMonth()], e.getFullYear());
    }
    _onMonthGridTouchStart() {
      this._notTapping = !1, setTimeout(() => {
        this._notTapping = !0;
      }, 300);
    }
    _dateAdd(e, t) {
      e.setDate(e.getDate() + t);
    }
    _applyFirstDayOfWeek(e, t) {
      if (!(e === void 0 || t === void 0))
        return e.slice(t).concat(e.slice(0, t));
    }
    _getWeekDayNames(e, t, o, i) {
      if (!(e === void 0 || t === void 0 || o === void 0 || i === void 0))
        return e = this._applyFirstDayOfWeek(e, i), t = this._applyFirstDayOfWeek(t, i), e = e.map((a, n) => ({
          weekDay: a,
          weekDayShort: t[n]
        })), e;
    }
    __focusedDateChanged(e, t) {
      t.some((o) => ie(o, e)) ? this.removeAttribute("aria-hidden") : this.setAttribute("aria-hidden", "true");
    }
    _getDate(e) {
      return e ? e.getDate() : "";
    }
    _showWeekNumbersChanged(e, t) {
      e && t === 1 ? this.setAttribute("week-numbers", "") : this.removeAttribute("week-numbers");
    }
    _showWeekSeparator(e, t) {
      return e && t === 1;
    }
    _isToday(e) {
      return ie(/* @__PURE__ */ new Date(), e);
    }
    _getDays(e, t) {
      if (e === void 0 || t === void 0)
        return;
      const o = new Date(0, 0);
      for (o.setFullYear(e.getFullYear()), o.setMonth(e.getMonth()), o.setDate(1); o.getDay() !== t; )
        this._dateAdd(o, -1);
      const i = [], a = o.getMonth(), n = e.getMonth();
      for (; o.getMonth() === n || o.getMonth() === a; )
        i.push(o.getMonth() === n ? new Date(o.getTime()) : null), this._dateAdd(o, 1);
      return i;
    }
    _getWeeks(e) {
      return e.reduce((t, o, i) => (i % 7 === 0 && t.push([]), t[t.length - 1].push(o), t), []);
    }
    _handleTap(e) {
      !this.ignoreTaps && !this._notTapping && e.target.date && !e.target.hasAttribute("disabled") && (this.selectedDate = e.target.date, this.dispatchEvent(
        new CustomEvent("date-tap", { detail: { date: e.target.date }, bubbles: !0, composed: !0 })
      ));
    }
    _preventDefault(e) {
      e.preventDefault();
    }
    __getWeekNumber(e) {
      const t = e.reduce((o, i) => !o && i ? i : o);
      return nu(t);
    }
    __isDayFocused(e, t) {
      return ie(e, t);
    }
    __isDaySelected(e, t) {
      return ie(e, t);
    }
    __getDayAriaSelected(e, t) {
      if (this.__isDaySelected(e, t))
        return "true";
    }
    __isDayDisabled(e, t, o) {
      return !yt(e, t, o);
    }
    __getDayAriaDisabled(e, t, o) {
      if (!(e === void 0 || t === void 0 || o === void 0) && this.__isDayDisabled(e, t, o))
        return "true";
    }
    __getDayAriaLabel(e) {
      if (!e)
        return "";
      let t = `${this._getDate(e)} ${this.i18n.monthNames[e.getMonth()]} ${e.getFullYear()}, ${this.i18n.weekdays[e.getDay()]}`;
      return this._isToday(e) && (t += `, ${this.i18n.today}`), t;
    }
    __getDayTabindex(e, t) {
      return this.__isDayFocused(e, t) ? "0" : "-1";
    }
  }
  customElements.define(Ki.is, Ki);
  /**
   * @license
   * Copyright (c) 2016 - 2022 Vaadin Ltd.
   * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
   */
  class It extends ue {
    static get template() {
      return Pe`
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
    static get is() {
      return "vaadin-infinite-scroller";
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
    /** @protected */
    ready() {
      super.ready(), this._buffers = [...this.shadowRoot.querySelectorAll(".buffer")], this.$.fullHeight.style.height = `${this._initialScroll * 2}px`;
      const e = this.querySelector("template");
      this._TemplateClass = Ot(e, this, {
        forwardHostProp(t, o) {
          t !== "index" && this._buffers.forEach((i) => {
            [...i.children].forEach((a) => {
              a._itemWrapper.instance[t] = o;
            });
          });
        }
      }), Xc && (this.$.scroller.tabIndex = -1);
    }
    /**
     * Force the scroller to update clones after a reset, without
     * waiting for the debouncer to resolve.
     */
    forceUpdate() {
      this._debouncerUpdateClones && (this._buffers[0].updated = this._buffers[1].updated = !1, this._updateClones(), this._debouncerUpdateClones.cancel());
    }
    /** @private */
    _activated(e) {
      e && !this._initialized && (this._createPool(), this._initialized = !0);
    }
    /** @private */
    _finishInit() {
      this._initDone || (this._buffers.forEach((e) => {
        [...e.children].forEach((t) => {
          this._ensureStampedInstance(t._itemWrapper);
        });
      }), this._buffers[0].translateY || this._reset(), this._initDone = !0);
    }
    /** @private */
    _translateBuffer(e) {
      const t = e ? 1 : 0;
      this._buffers[t].translateY = this._buffers[t ? 0 : 1].translateY + this._bufferHeight * (t ? -1 : 1), this._buffers[t].style.transform = `translate3d(0, ${this._buffers[t].translateY}px, 0)`, this._buffers[t].updated = !1, this._buffers.reverse();
    }
    /** @private */
    _scroll() {
      if (this._scrollDisabled)
        return;
      const e = this.$.scroller.scrollTop;
      (e < this._bufferHeight || e > this._initialScroll * 2 - this._bufferHeight) && (this._initialIndex = ~~this.position, this._reset());
      const t = this.itemHeight + this.bufferOffset, o = e > this._buffers[1].translateY + t, i = e < this._buffers[0].translateY + t;
      (o || i) && (this._translateBuffer(i), this._updateClones()), this._preventScrollEvent || (this.dispatchEvent(new CustomEvent("custom-scroll", { bubbles: !1, composed: !0 })), this._mayHaveMomentum = !0), this._preventScrollEvent = !1, this._debouncerScrollFinish = $t.debounce(this._debouncerScrollFinish, ir.after(200), () => {
        const a = this.$.scroller.getBoundingClientRect();
        !this._isVisible(this._buffers[0], a) && !this._isVisible(this._buffers[1], a) && (this.position = this.position);
      });
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
    get position() {
      return (this.$.scroller.scrollTop - this._buffers[0].translateY) / this.itemHeight + this._firstIndex;
    }
    /**
     * Current scroller position as index. Can be a fractional number.
     *
     * @type {number}
     */
    set position(e) {
      this._preventScrollEvent = !0, e > this._firstIndex && e < this._firstIndex + this.bufferSize * 2 ? this.$.scroller.scrollTop = this.itemHeight * (e - this._firstIndex) + this._buffers[0].translateY : (this._initialIndex = ~~e, this._reset(), this._scrollDisabled = !0, this.$.scroller.scrollTop += e % 1 * this.itemHeight, this._scrollDisabled = !1), this._mayHaveMomentum && (this.$.scroller.classList.add("notouchscroll"), this._mayHaveMomentum = !1, setTimeout(() => {
        this.$.scroller.classList.remove("notouchscroll");
      }, 10));
    }
    /**
     * @return {number}
     */
    get itemHeight() {
      if (!this._itemHeightVal) {
        const e = getComputedStyle(this).getPropertyValue("--vaadin-infinite-scroller-item-height"), t = "background-position";
        this.$.fullHeight.style.setProperty(t, e);
        const o = getComputedStyle(this.$.fullHeight).getPropertyValue(t);
        this.$.fullHeight.style.removeProperty(t), this._itemHeightVal = parseFloat(o);
      }
      return this._itemHeightVal;
    }
    /** @private */
    get _bufferHeight() {
      return this.itemHeight * this.bufferSize;
    }
    /** @private */
    _reset() {
      this._scrollDisabled = !0, this.$.scroller.scrollTop = this._initialScroll, this._buffers[0].translateY = this._initialScroll - this._bufferHeight, this._buffers[1].translateY = this._initialScroll, this._buffers.forEach((e) => {
        e.style.transform = `translate3d(0, ${e.translateY}px, 0)`;
      }), this._buffers[0].updated = this._buffers[1].updated = !1, this._updateClones(!0), this._debouncerUpdateClones = $t.debounce(this._debouncerUpdateClones, ir.after(200), () => {
        this._buffers[0].updated = this._buffers[1].updated = !1, this._updateClones();
      }), this._scrollDisabled = !1;
    }
    /** @private */
    _createPool() {
      const e = this.getBoundingClientRect();
      this._buffers.forEach((t) => {
        for (let o = 0; o < this.bufferSize; o++) {
          const i = document.createElement("div");
          i.style.height = `${this.itemHeight}px`, i.instance = {};
          const n = `vaadin-infinite-scroller-item-content-${It._contentIndex = It._contentIndex + 1 || 0}`, s = document.createElement("slot");
          s.setAttribute("name", n), s._itemWrapper = i, t.appendChild(s), i.setAttribute("slot", n), this.appendChild(i), setTimeout(() => {
            this._isVisible(i, e) && this._ensureStampedInstance(i);
          }, 1);
        }
      }), setTimeout(() => {
        an(this, this._finishInit.bind(this));
      }, 1);
    }
    /** @private */
    _ensureStampedInstance(e) {
      if (e.firstElementChild)
        return;
      const t = e.instance;
      e.instance = new this._TemplateClass({}), e.appendChild(e.instance.root), Object.keys(t).forEach((o) => {
        e.instance.set(o, t[o]);
      });
    }
    /** @private */
    _updateClones(e) {
      this._firstIndex = ~~((this._buffers[0].translateY - this._initialScroll) / this.itemHeight) + this._initialIndex;
      const t = e ? this.$.scroller.getBoundingClientRect() : void 0;
      this._buffers.forEach((o, i) => {
        if (!o.updated) {
          const a = this._firstIndex + this.bufferSize * i;
          [...o.children].forEach((n, s) => {
            const l = n._itemWrapper;
            (!e || this._isVisible(l, t)) && (l.instance.index = a + s);
          }), o.updated = !0;
        }
      });
    }
    /** @private */
    _isVisible(e, t) {
      const o = e.getBoundingClientRect();
      return o.bottom > t.top && o.top < t.bottom;
    }
  }
  customElements.define(It.is, It);
  /**
   * @license
   * Copyright (c) 2021 - 2022 Vaadin Ltd.
   * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
   */
  class On {
    constructor(e, t) {
      this.query = e, this.callback = t, this._boundQueryHandler = this._queryHandler.bind(this);
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
    _queryHandler(e) {
      typeof this.callback == "function" && this.callback(e.matches);
    }
  }
  /**
   * @license
   * Copyright (c) 2016 - 2022 Vaadin Ltd.
   * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
   */
  class Xi extends at(it(dr(ue))) {
    static get template() {
      return Pe`
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

        [part='months'],
        [part='years'] {
          height: 100%;
        }

        [part='months'] {
          --vaadin-infinite-scroller-item-height: 270px;
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
        }

        #scrollers[desktop] [part='months'] {
          right: 50px;
          transform: none !important;
        }

        [part='years'] {
          --vaadin-infinite-scroller-item-height: 80px;
          width: 50px;
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

        #scrollers[desktop] [part='years'] {
          position: absolute;
          transform: none !important;
        }

        [part='years']::before {
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

        :host(.animate) [part='months'],
        :host(.animate) [part='years'] {
          transition: all 200ms;
        }

        [part='toolbar'] {
          display: flex;
          justify-content: space-between;
          z-index: 2;
          flex-shrink: 0;
        }
      </style>

      <div part="overlay-header" on-touchend="_preventDefault" desktop$="[[_desktopMode]]" aria-hidden="true">
        <div part="label">[[_formatDisplayed(selectedDate, i18n.formatDate, label)]]</div>
        <div part="clear-button" hidden$="[[!selectedDate]]"></div>
        <div part="toggle-button"></div>

        <div part="years-toggle-button" hidden$="[[_desktopMode]]" aria-hidden="true">
          [[_yearAfterXMonths(_visibleMonthIndex)]]
        </div>
      </div>

      <div id="scrollers" desktop$="[[_desktopMode]]">
        <vaadin-infinite-scroller
          id="monthScroller"
          on-custom-scroll="_onMonthScroll"
          on-touchstart="_onMonthScrollTouchStart"
          buffer-size="3"
          active="[[initialPosition]]"
          part="months"
        >
          <template>
            <vaadin-month-calendar
              i18n="[[i18n]]"
              month="[[_dateAfterXMonths(index)]]"
              selected-date="{{selectedDate}}"
              focused-date="[[focusedDate]]"
              ignore-taps="[[_ignoreTaps]]"
              show-week-numbers="[[showWeekNumbers]]"
              min-date="[[minDate]]"
              max-date="[[maxDate]]"
              part="month"
              theme$="[[_theme]]"
              on-keydown="__onMonthCalendarKeyDown"
            >
            </vaadin-month-calendar>
          </template>
        </vaadin-infinite-scroller>
        <vaadin-infinite-scroller
          id="yearScroller"
          on-custom-scroll="_onYearScroll"
          on-touchstart="_onYearScrollTouchStart"
          buffer-size="12"
          active="[[initialPosition]]"
          part="years"
          aria-hidden="true"
        >
          <template>
            <div
              part="year-number"
              current$="[[_isCurrentYear(index)]]"
              selected$="[[_isSelectedYear(index, selectedDate)]]"
            >
              [[_yearAfterXYears(index)]]
            </div>
            <div part="year-separator" aria-hidden="true"></div>
          </template>
        </vaadin-infinite-scroller>
      </div>

      <div on-touchend="_preventDefault" role="toolbar" part="toolbar">
        <vaadin-button
          id="todayButton"
          part="today-button"
          theme="tertiary"
          disabled="[[!_isTodayAllowed(minDate, maxDate)]]"
          on-keydown="__onTodayButtonKeyDown"
        >
          [[i18n.today]]
        </vaadin-button>
        <vaadin-button id="cancelButton" part="cancel-button" theme="tertiary" on-keydown="__onCancelButtonKeyDown">
          [[i18n.cancel]]
        </vaadin-button>
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
        _desktopMode: Boolean,
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
          type: Boolean
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
        label: String
      };
    }
    get __isRTL() {
      return this.getAttribute("dir") === "rtl";
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
      return this.$.monthScroller.clientHeight < this.$.monthScroller.itemHeight + this.$.monthScroller.bufferOffset;
    }
    get calendars() {
      return [...this.shadowRoot.querySelectorAll("vaadin-month-calendar")];
    }
    get focusableDateElement() {
      return this.calendars.map((e) => e.focusableDateElement).find(Boolean);
    }
    ready() {
      super.ready(), this.setAttribute("role", "dialog"), Q(this.$.scrollers, "track", this._track.bind(this)), Q(this.shadowRoot.querySelector('[part="clear-button"]'), "tap", this._clear.bind(this)), Q(this.shadowRoot.querySelector('[part="today-button"]'), "tap", this._onTodayTap.bind(this)), Q(this.shadowRoot.querySelector('[part="cancel-button"]'), "tap", this._cancel.bind(this)), Q(this.shadowRoot.querySelector('[part="toggle-button"]'), "tap", this._cancel.bind(this)), Q(this.shadowRoot.querySelector('[part="years"]'), "tap", this._onYearTap.bind(this)), Q(
        this.shadowRoot.querySelector('[part="years-toggle-button"]'),
        "tap",
        this._toggleYearScroller.bind(this)
      ), this.addController(
        new On(this._desktopMediaQuery, (e) => {
          this._desktopMode = e;
        })
      );
    }
    /**
     * Fired when the scroller reaches the target scrolling position.
     * @event scroll-animation-finished
     * @param {Number} detail.position new position
     * @param {Number} detail.oldPosition old position
     */
    connectedCallback() {
      super.connectedCallback(), this._closeYearScroller(), this._toggleAnimateClass(!0), yn(this.$.scrollers, "pan-y");
    }
    /**
     * Focuses the cancel button
     */
    focusCancel() {
      this.$.cancelButton.focus();
    }
    /**
     * Scrolls the list to the given Date.
     */
    scrollToDate(e, t) {
      const o = this.__useSubMonthScrolling ? this._calculateWeekScrollOffset(e) : 0;
      this._scrollToPosition(this._differenceInMonths(e, this._originDate) + o, t), this.$.monthScroller.forceUpdate();
    }
    /**
     * Select a date and fire event indicating user interaction.
     * @protected
     */
    _selectDate(e) {
      this.selectedDate = e, this.dispatchEvent(
        new CustomEvent("date-selected", { detail: { date: e }, bubbles: !0, composed: !0 })
      );
    }
    _focusedDateChanged(e) {
      this.revealDate(e);
    }
    _isCurrentYear(e) {
      return e === 0;
    }
    _isSelectedYear(e, t) {
      if (t)
        return t.getFullYear() === this._originDate.getFullYear() + e;
    }
    /**
     * Scrolls the month and year scrollers enough to reveal the given date.
     */
    revealDate(e, t = !0) {
      if (!e)
        return;
      const o = this._differenceInMonths(e, this._originDate);
      if (this.__useSubMonthScrolling) {
        const l = this._calculateWeekScrollOffset(e);
        this._scrollToPosition(o + l, t);
        return;
      }
      const i = this.$.monthScroller.position > o, n = Math.max(
        this.$.monthScroller.itemHeight,
        this.$.monthScroller.clientHeight - this.$.monthScroller.bufferOffset * 2
      ) / this.$.monthScroller.itemHeight, s = this.$.monthScroller.position + n - 1 < o;
      i ? this._scrollToPosition(o, t) : s && this._scrollToPosition(o - n + 1, t);
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
    _calculateWeekScrollOffset(e) {
      const t = new Date(0, 0);
      t.setFullYear(e.getFullYear()), t.setMonth(e.getMonth()), t.setDate(1);
      let o = 0;
      for (; t.getDate() < e.getDate(); )
        t.setDate(t.getDate() + 1), t.getDay() === this.i18n.firstDayOfWeek && (o += 1);
      return o / 6;
    }
    _initialPositionChanged(e) {
      this.scrollToDate(e);
    }
    _repositionYearScroller() {
      this._visibleMonthIndex = Math.floor(this.$.monthScroller.position), this.$.yearScroller.position = (this.$.monthScroller.position + this._originDate.getMonth()) / 12;
    }
    _repositionMonthScroller() {
      this.$.monthScroller.position = this.$.yearScroller.position * 12 - this._originDate.getMonth(), this._visibleMonthIndex = Math.floor(this.$.monthScroller.position);
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
      this._ignoreTaps = !0, this._debouncer = $t.debounce(this._debouncer, ir.after(300), () => {
        this._ignoreTaps = !1;
      });
    }
    _formatDisplayed(e, t, o) {
      return e ? t(Dn(e)) : o;
    }
    _onTodayTap() {
      const e = /* @__PURE__ */ new Date();
      Math.abs(this.$.monthScroller.position - this._differenceInMonths(e, this._originDate)) < 1e-3 ? (this._selectDate(e), this._close()) : this._scrollToCurrentMonth();
    }
    _scrollToCurrentMonth() {
      this.focusedDate && (this.focusedDate = /* @__PURE__ */ new Date()), this.scrollToDate(/* @__PURE__ */ new Date(), !0);
    }
    _onYearTap(e) {
      if (!this._ignoreTaps && !this._notTapping) {
        const o = (e.detail.y - (this.$.yearScroller.getBoundingClientRect().top + this.$.yearScroller.clientHeight / 2)) / this.$.yearScroller.itemHeight;
        this._scrollToPosition(this.$.monthScroller.position + o * 12, !0);
      }
    }
    _scrollToPosition(e, t) {
      if (this._targetPosition !== void 0) {
        this._targetPosition = e;
        return;
      }
      if (!t) {
        this.$.monthScroller.position = e, this._targetPosition = void 0, this._repositionYearScroller(), this.__tryFocusDate();
        return;
      }
      this._targetPosition = e;
      let o;
      this._revealPromise = new Promise((l) => {
        o = l;
      });
      const i = (l, c, d, u) => (l /= u / 2, l < 1 ? d / 2 * l * l + c : (l -= 1, -d / 2 * (l * (l - 2) - 1) + c));
      let a = 0;
      const n = this.$.monthScroller.position, s = (l) => {
        a = a || l;
        const c = l - a;
        if (c < this.scrollDuration) {
          const d = i(
            c,
            n,
            this._targetPosition - n,
            this.scrollDuration
          );
          this.$.monthScroller.position = d, window.requestAnimationFrame(s);
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
          ), this.$.monthScroller.position = this._targetPosition, this._targetPosition = void 0, o(), this._revealPromise = void 0;
        setTimeout(this._repositionYearScroller.bind(this), 1);
      };
      window.requestAnimationFrame(s);
    }
    _limit(e, t) {
      return Math.min(t.max, Math.max(t.min, e));
    }
    _handleTrack(e) {
      if (Math.abs(e.detail.dx) < 10 || Math.abs(e.detail.ddy) > 10)
        return;
      Math.abs(e.detail.ddx) > this._yearScrollerWidth / 3 && this._toggleAnimateClass(!0);
      const t = this._translateX + e.detail.ddx;
      this._translateX = this._limit(t, {
        min: 0,
        max: this._yearScrollerWidth
      });
    }
    _track(e) {
      if (!this._desktopMode)
        switch (e.detail.state) {
          case "start":
            this._toggleAnimateClass(!1);
            break;
          case "track":
            this._handleTrack(e);
            break;
          case "end":
            this._toggleAnimateClass(!0), this._translateX >= this._yearScrollerWidth / 2 ? this._closeYearScroller() : this._openYearScroller();
            break;
        }
    }
    _toggleAnimateClass(e) {
      e ? this.classList.add("animate") : this.classList.remove("animate");
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
    _translateXChanged(e) {
      this._desktopMode || (this.$.monthScroller.style.transform = `translateX(${e - this._yearScrollerWidth}px)`, this.$.yearScroller.style.transform = `translateX(${e}px)`);
    }
    _yearAfterXYears(e) {
      const t = new Date(this._originDate);
      return t.setFullYear(parseInt(e) + this._originDate.getFullYear()), t.getFullYear();
    }
    _yearAfterXMonths(e) {
      return this._dateAfterXMonths(e).getFullYear();
    }
    _dateAfterXMonths(e) {
      const t = new Date(this._originDate);
      return t.setDate(1), t.setMonth(parseInt(e) + this._originDate.getMonth()), t;
    }
    _differenceInMonths(e, t) {
      return (e.getFullYear() - t.getFullYear()) * 12 - t.getMonth() + e.getMonth();
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
    _preventDefault(e) {
      e.preventDefault();
    }
    __toggleDate(e) {
      ie(e, this.selectedDate) ? (this._clear(), this.focusedDate = e) : this._selectDate(e);
    }
    __onMonthCalendarKeyDown(e) {
      let t = !1;
      switch (e.key) {
        case "ArrowDown":
          this._moveFocusByDays(7), t = !0;
          break;
        case "ArrowUp":
          this._moveFocusByDays(-7), t = !0;
          break;
        case "ArrowRight":
          this._moveFocusByDays(this.__isRTL ? -1 : 1), t = !0;
          break;
        case "ArrowLeft":
          this._moveFocusByDays(this.__isRTL ? 1 : -1), t = !0;
          break;
        case "Enter":
          this._selectDate(this.focusedDate), this._close(), t = !0;
          break;
        case " ":
          this.__toggleDate(this.focusedDate), t = !0;
          break;
        case "Home":
          this._moveFocusInsideMonth(this.focusedDate, "minDate"), t = !0;
          break;
        case "End":
          this._moveFocusInsideMonth(this.focusedDate, "maxDate"), t = !0;
          break;
        case "PageDown":
          this._moveFocusByMonths(e.shiftKey ? 12 : 1), t = !0;
          break;
        case "PageUp":
          this._moveFocusByMonths(e.shiftKey ? -12 : -1), t = !0;
          break;
        case "Tab":
          this._onTabKeyDown(e, "calendar");
          break;
      }
      t && (e.preventDefault(), e.stopPropagation());
    }
    _onTabKeyDown(e, t) {
      switch (e.stopPropagation(), t) {
        case "calendar":
          e.shiftKey && (e.preventDefault(), this.hasAttribute("fullscreen") ? this.$.cancelButton.focus() : this.__focusInput());
          break;
        case "today":
          e.shiftKey && (e.preventDefault(), this.focusDateElement());
          break;
        case "cancel":
          e.shiftKey || (e.preventDefault(), this.hasAttribute("fullscreen") ? this.focusDateElement() : this.__focusInput());
          break;
      }
    }
    __onTodayButtonKeyDown(e) {
      e.key === "Tab" && this._onTabKeyDown(e, "today");
    }
    __onCancelButtonKeyDown(e) {
      e.key === "Tab" && this._onTabKeyDown(e, "cancel");
    }
    __focusInput() {
      this.dispatchEvent(new CustomEvent("focus-input", { bubbles: !0, composed: !0 }));
    }
    __tryFocusDate() {
      if (this.__pendingDateFocus) {
        const t = this.focusableDateElement;
        t && ie(t.date, this.__pendingDateFocus) && (delete this.__pendingDateFocus, t.focus());
      }
    }
    async focusDate(e, t) {
      const o = e || this.selectedDate || this.initialPosition || /* @__PURE__ */ new Date();
      this.focusedDate = o, t || (this._focusedMonthDate = o.getDate()), await this.focusDateElement(!1);
    }
    async focusDateElement(e = !0) {
      this.__pendingDateFocus = this.focusedDate, this.calendars.length || await new Promise((t) => {
        setTimeout(t);
      }), e && this.revealDate(this.focusedDate), this._revealPromise && await this._revealPromise, this.__tryFocusDate();
    }
    _focusClosestDate(e) {
      this.focusDate(Tn(e, [this.minDate, this.maxDate]));
    }
    _moveFocusByDays(e) {
      const t = this.focusedDate, o = new Date(0, 0);
      o.setFullYear(t.getFullYear()), o.setMonth(t.getMonth()), o.setDate(t.getDate() + e), this._dateAllowed(o, this.minDate, this.maxDate) ? this.focusDate(o) : this._dateAllowed(t, this.minDate, this.maxDate) ? e > 0 ? this.focusDate(this.maxDate) : this.focusDate(this.minDate) : this._focusClosestDate(t);
    }
    _moveFocusByMonths(e) {
      const t = this.focusedDate, o = new Date(0, 0);
      o.setFullYear(t.getFullYear()), o.setMonth(t.getMonth() + e);
      const i = o.getMonth();
      o.setDate(this._focusedMonthDate || (this._focusedMonthDate = t.getDate())), o.getMonth() !== i && o.setDate(0), this._dateAllowed(o, this.minDate, this.maxDate) ? this.focusDate(o, !0) : this._dateAllowed(t, this.minDate, this.maxDate) ? e > 0 ? this.focusDate(this.maxDate) : this.focusDate(this.minDate) : this._focusClosestDate(t);
    }
    _moveFocusInsideMonth(e, t) {
      const o = new Date(0, 0);
      o.setFullYear(e.getFullYear()), t === "minDate" ? (o.setMonth(e.getMonth()), o.setDate(1)) : (o.setMonth(e.getMonth() + 1), o.setDate(0)), this._dateAllowed(o, this.minDate, this.maxDate) ? this.focusDate(o) : this._dateAllowed(e, this.minDate, this.maxDate) ? this.focusDate(this[t]) : this._focusClosestDate(e);
    }
    _dateAllowed(e, t, o) {
      return (!t || e >= t) && (!o || e <= o);
    }
    _isTodayAllowed(e, t) {
      const o = /* @__PURE__ */ new Date(), i = new Date(0, 0);
      return i.setFullYear(o.getFullYear()), i.setMonth(o.getMonth()), i.setDate(o.getDate()), this._dateAllowed(i, e, t);
    }
  }
  customElements.define(Xi.is, Xi);
  /**
   * @license
   * Copyright (c) 2021 - 2022 Vaadin Ltd.
   * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
   */
  const $n = S(
    (r) => class extends No(kn(r)) {
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
      _focusElementChanged(t, o) {
        t ? (t.disabled = this.disabled, this._addFocusListeners(t), this.__forwardTabIndex(this.tabindex)) : o && this._removeFocusListeners(o);
      }
      /**
       * @param {HTMLElement} element
       * @protected
       */
      _addFocusListeners(t) {
        t.addEventListener("blur", this._boundOnBlur), t.addEventListener("focus", this._boundOnFocus);
      }
      /**
       * @param {HTMLElement} element
       * @protected
       */
      _removeFocusListeners(t) {
        t.removeEventListener("blur", this._boundOnBlur), t.removeEventListener("focus", this._boundOnFocus);
      }
      /**
       * Focus event does not bubble, so we dispatch it manually
       * on the host element to support adding focus listeners
       * when the focusable element is placed in light DOM.
       * @param {FocusEvent} event
       * @protected
       */
      _onFocus(t) {
        t.stopPropagation(), this.dispatchEvent(new Event("focus"));
      }
      /**
       * Blur event does not bubble, so we dispatch it manually
       * on the host element to support adding blur listeners
       * when the focusable element is placed in light DOM.
       * @param {FocusEvent} event
       * @protected
       */
      _onBlur(t) {
        t.stopPropagation(), this.dispatchEvent(new Event("blur"));
      }
      /**
       * @param {Event} event
       * @return {boolean}
       * @protected
       * @override
       */
      _shouldSetFocus(t) {
        return t.target === this.focusElement;
      }
      /**
       * @param {boolean} disabled
       * @param {boolean} oldDisabled
       * @protected
       * @override
       */
      _disabledChanged(t, o) {
        super._disabledChanged(t, o), this.focusElement && (this.focusElement.disabled = t), t && this.blur();
      }
      /**
       * Override an observer from `TabindexMixin`.
       * Do not call super to remove tabindex attribute
       * from the host after it has been forwarded.
       * @param {string} tabindex
       * @protected
       * @override
       */
      _tabindexChanged(t) {
        this.__forwardTabIndex(t);
      }
      /** @private */
      __forwardTabIndex(t) {
        t !== void 0 && this.focusElement && (this.focusElement.tabIndex = t, t !== -1 && (this.tabindex = void 0)), this.disabled && t && (t !== -1 && (this._lastTabIndex = t), this.tabindex = void 0);
      }
    }
  );
  /**
   * @license
   * Copyright (c) 2021 - 2022 Vaadin Ltd.
   * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
   */
  class lu extends Se {
    constructor(e) {
      super(
        e,
        "error-message",
        () => document.createElement("div"),
        (t, o) => {
          this.__updateErrorId(o), this.__updateHasError();
        },
        !0
      );
    }
    /**
     * ID attribute value set on the error message element.
     *
     * @return {string}
     */
    get errorId() {
      return this.node && this.node.id;
    }
    /**
     * Set the error message element text content.
     *
     * @param {string} errorMessage
     */
    setErrorMessage(e) {
      this.errorMessage = e, this.__updateHasError();
    }
    /**
     * Set invalid state for detecting whether to show error message.
     *
     * @param {boolean} invalid
     */
    setInvalid(e) {
      this.invalid = e, this.__updateHasError();
    }
    /**
     * Override to initialize the newly added custom error message.
     *
     * @param {Node} errorNode
     * @protected
     * @override
     */
    initCustomNode(e) {
      this.__updateErrorId(e), e.textContent && !this.errorMessage && (this.errorMessage = e.textContent.trim()), this.__updateHasError();
    }
    /**
     * Override to cleanup error message node when it's removed.
     *
     * @param {Node} node
     * @protected
     * @override
     */
    teardownNode(e) {
      let t = this.getSlotChild();
      !t && e !== this.defaultNode && (t = this.attachDefaultNode(), this.initNode(t)), this.__updateHasError();
    }
    /**
     * @param {string} error
     * @private
     */
    __isNotEmpty(e) {
      return !!(e && e.trim() !== "");
    }
    /** @private */
    __updateHasError() {
      const e = this.node, t = !!(this.invalid && this.__isNotEmpty(this.errorMessage));
      e && (e.textContent = t ? this.errorMessage : "", e.hidden = !t, t ? e.setAttribute("role", "alert") : e.removeAttribute("role")), this.host.toggleAttribute("has-error-message", t);
    }
    /**
     * @param {HTMLElement} errorNode
     * @private
     */
    __updateErrorId(e) {
      e.id || (e.id = this.defaultId);
    }
  }
  /**
   * @license
   * Copyright (c) 2021 - 2022 Vaadin Ltd.
   * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
   */
  class cu {
    constructor(e) {
      this.host = e, this.__required = !1;
    }
    /**
     * Sets a target element to which ARIA attributes are added.
     *
     * @param {HTMLElement} target
     */
    setTarget(e) {
      this.__target = e, this.__setAriaRequiredAttribute(this.__required), this.__setLabelIdToAriaAttribute(this.__labelId), this.__setErrorIdToAriaAttribute(this.__errorId), this.__setHelperIdToAriaAttribute(this.__helperId);
    }
    /**
     * Toggles the `aria-required` attribute on the target element
     * if the target is the host component (e.g. a field group).
     * Otherwise, it does nothing.
     *
     * @param {boolean} required
     */
    setRequired(e) {
      this.__setAriaRequiredAttribute(e), this.__required = e;
    }
    /**
     * Links the target element with a slotted label element
     * via the target's attribute `aria-labelledby`.
     *
     * To unlink the previous slotted label element, pass `null` as `labelId`.
     *
     * @param {string | null} labelId
     */
    setLabelId(e) {
      this.__setLabelIdToAriaAttribute(e, this.__labelId), this.__labelId = e;
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
    setErrorId(e) {
      this.__setErrorIdToAriaAttribute(e, this.__errorId), this.__errorId = e;
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
    setHelperId(e) {
      this.__setHelperIdToAriaAttribute(e, this.__helperId), this.__helperId = e;
    }
    /**
     * `true` if the target element is the host component itself, `false` otherwise.
     *
     * @return {boolean}
     * @private
     */
    get __isGroupField() {
      return this.__target === this.host;
    }
    /**
     * @param {string | null | undefined} labelId
     * @param {string | null | undefined} oldLabelId
     * @private
     */
    __setLabelIdToAriaAttribute(e, t) {
      this.__setAriaAttributeId("aria-labelledby", e, t);
    }
    /**
     * @param {string | null | undefined} errorId
     * @param {string | null | undefined} oldErrorId
     * @private
     */
    __setErrorIdToAriaAttribute(e, t) {
      this.__isGroupField ? this.__setAriaAttributeId("aria-labelledby", e, t) : this.__setAriaAttributeId("aria-describedby", e, t);
    }
    /**
     * @param {string | null | undefined} helperId
     * @param {string | null | undefined} oldHelperId
     * @private
     */
    __setHelperIdToAriaAttribute(e, t) {
      this.__isGroupField ? this.__setAriaAttributeId("aria-labelledby", e, t) : this.__setAriaAttributeId("aria-describedby", e, t);
    }
    /**
     * @param {boolean} required
     * @private
     */
    __setAriaRequiredAttribute(e) {
      this.__target && (["input", "textarea"].includes(this.__target.localName) || (e ? this.__target.setAttribute("aria-required", "true") : this.__target.removeAttribute("aria-required")));
    }
    /**
     * @param {string | null | undefined} newId
     * @param {string | null | undefined} oldId
     * @private
     */
    __setAriaAttributeId(e, t, o) {
      this.__target && (o && Jd(this.__target, e, o), t && Xd(this.__target, e, t));
    }
  }
  /**
   * @license
   * Copyright (c) 2021 - 2022 Vaadin Ltd.
   * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
   */
  class du extends Se {
    constructor(e) {
      super(e, "helper", null, null, !0);
    }
    get helperId() {
      return this.node && this.node.id;
    }
    /**
     * Override to initialize the newly added custom helper.
     *
     * @param {Node} helperNode
     * @protected
     * @override
     */
    initCustomNode(e) {
      this.__updateHelperId(e), this.__observeHelper(e);
      const t = this.__hasHelper(e);
      this.__toggleHasHelper(t);
    }
    /**
     * Override to cleanup helper node when it's removed.
     *
     * @param {Node} _node
     * @protected
     * @override
     */
    teardownNode(e) {
      this.__helperIdObserver && this.__helperIdObserver.disconnect();
      const t = this.getSlotChild();
      if (t && t !== this.defaultNode) {
        const o = this.__hasHelper(t);
        this.__toggleHasHelper(o);
      } else
        this.__applyDefaultHelper(this.helperText, t);
    }
    /**
     * Set helper text based on corresponding host property.
     * @param {string} helperText
     */
    setHelperText(e) {
      this.helperText = e;
      const t = this.getSlotChild();
      (!t || t === this.defaultNode) && this.__applyDefaultHelper(e, t);
    }
    /**
     * @param {HTMLElement} helperNode
     * @return {boolean}
     * @private
     */
    __hasHelper(e) {
      return e ? e.children.length > 0 || e.nodeType === Node.ELEMENT_NODE && customElements.get(e.localName) || this.__isNotEmpty(e.textContent) : !1;
    }
    /**
     * @param {string} helperText
     * @private
     */
    __isNotEmpty(e) {
      return e && e.trim() !== "";
    }
    /**
     * @param {string} helperText
     * @param {Node} helperNode
     * @private
     */
    __applyDefaultHelper(e, t) {
      const o = this.__isNotEmpty(e);
      o && !t && (this.slotFactory = () => document.createElement("div"), t = this.attachDefaultNode(), this.__updateHelperId(t), this.__observeHelper(t)), t && (t.textContent = e), this.__toggleHasHelper(o);
    }
    /**
     * @param {HTMLElement} helperNode
     * @private
     */
    __observeHelper(e) {
      this.__helperObserver = new MutationObserver((t) => {
        t.forEach((o) => {
          const i = o.target, a = i === this.node;
          if (o.type === "attributes")
            a && i.id !== this.defaultId && this.__updateHelperId(i);
          else if (a || i.parentElement === this.node) {
            const n = this.__hasHelper(this.node);
            this.__toggleHasHelper(n);
          }
        });
      }), this.__helperObserver.observe(e, {
        attributes: !0,
        attributeFilter: ["id"],
        childList: !0,
        subtree: !0,
        characterData: !0
      });
    }
    /**
     * @param {boolean} hasHelper
     * @private
     */
    __toggleHasHelper(e) {
      this.host.toggleAttribute("has-helper", e), this.dispatchEvent(
        new CustomEvent("helper-changed", {
          detail: {
            hasHelper: e,
            node: this.node
          }
        })
      );
    }
    /**
     * @param {HTMLElement} helperNode
     * @private
     */
    __updateHelperId(e) {
      e.id || (e.id = this.defaultId);
    }
  }
  /**
   * @license
   * Copyright (c) 2021 - 2022 Vaadin Ltd.
   * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
   */
  class uu extends Se {
    constructor(e) {
      super(
        e,
        "label",
        () => document.createElement("label"),
        (t, o) => {
          this.__updateLabelId(o), this.__updateDefaultLabel(this.label), this.__observeLabel(o);
        },
        !0
      );
    }
    /**
     * @return {string}
     */
    get labelId() {
      return this.node.id;
    }
    /**
     * Override to initialize the newly added custom label.
     *
     * @param {Node} labelNode
     * @protected
     * @override
     */
    initCustomNode(e) {
      this.__updateLabelId(e);
      const t = this.__hasLabel(e);
      this.__toggleHasLabel(t);
    }
    /**
     * Override to cleanup label node when it's removed.
     *
     * @param {Node} node
     * @protected
     * @override
     */
    teardownNode(e) {
      this.__labelObserver && this.__labelObserver.disconnect();
      let t = this.getSlotChild();
      !t && e !== this.defaultNode && (t = this.attachDefaultNode(), this.initNode(t));
      const o = this.__hasLabel(t);
      this.__toggleHasLabel(o);
    }
    /**
     * Set label based on corresponding host property.
     *
     * @param {string} label
     */
    setLabel(e) {
      this.label = e, this.__updateDefaultLabel(e);
    }
    /**
     * @param {HTMLElement} labelNode
     * @return {boolean}
     * @private
     */
    __hasLabel(e) {
      return e ? e.children.length > 0 || this.__isNotEmpty(e.textContent) : !1;
    }
    /**
     * @param {string} label
     * @private
     */
    __isNotEmpty(e) {
      return !!(e && e.trim() !== "");
    }
    /**
     * @param {HTMLElement} labelNode
     * @private
     */
    __observeLabel(e) {
      this.__labelObserver = new MutationObserver((t) => {
        t.forEach((o) => {
          const i = o.target, a = i === this.node;
          if (o.type === "attributes")
            a && i.id !== this.defaultId && this.__updateLabelId(i);
          else if (a || i.parentElement === this.node) {
            const n = this.__hasLabel(this.node);
            this.__toggleHasLabel(n);
          }
        });
      }), this.__labelObserver.observe(e, {
        attributes: !0,
        attributeFilter: ["id"],
        childList: !0,
        subtree: !0,
        characterData: !0
      });
    }
    /**
     * @param {boolean} hasLabel
     * @private
     */
    __toggleHasLabel(e) {
      this.host.toggleAttribute("has-label", e), this.dispatchEvent(
        new CustomEvent("label-changed", {
          detail: {
            hasLabel: e,
            node: this.node
          }
        })
      );
    }
    /**
     * @param {string} label
     * @private
     */
    __updateDefaultLabel(e) {
      if (this.defaultNode && (this.defaultNode.textContent = e, this.defaultNode === this.node)) {
        const t = this.__isNotEmpty(e);
        this.__toggleHasLabel(t);
      }
    }
    /**
     * @param {HTMLElement} labelNode
     * @private
     */
    __updateLabelId(e) {
      e.id || (e.id = this.defaultId);
    }
  }
  /**
   * @license
   * Copyright (c) 2021 - 2022 Vaadin Ltd.
   * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
   */
  const hu = S(
    (r) => class extends at(r) {
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
      /** @protected */
      get _labelId() {
        return this._labelController.labelId;
      }
      /** @protected */
      get _labelNode() {
        return this._labelController.node;
      }
      constructor() {
        super(), this._labelController = new uu(this);
      }
      /** @protected */
      ready() {
        super.ready(), this.addController(this._labelController);
      }
      /** @protected */
      _labelChanged(t) {
        this._labelController.setLabel(t);
      }
    }
  );
  /**
   * @license
   * Copyright (c) 2021 - 2022 Vaadin Ltd.
   * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
   */
  const Mn = S(
    (r) => class extends r {
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
        const t = this.checkValidity();
        return this._setInvalid(!t), this.dispatchEvent(new CustomEvent("validated", { detail: { valid: t } })), t;
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
      _setInvalid(t) {
        this._shouldSetInvalid(t) && (this.invalid = t);
      }
      /**
       * Override this method to define whether the given `invalid` state should be set.
       *
       * @param {boolean} _invalid
       * @return {boolean}
       * @protected
       */
      _shouldSetInvalid(t) {
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
   * Copyright (c) 2021 - 2022 Vaadin Ltd.
   * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
   */
  const pu = (r) => class extends Mn(hu(at(r))) {
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
        }
      };
    }
    static get observers() {
      return ["_invalidChanged(invalid)", "_requiredChanged(required)"];
    }
    /** @protected */
    get _errorId() {
      return this._errorController.errorId;
    }
    /**
     * @protected
     * @return {HTMLElement}
     */
    get _errorNode() {
      return this._errorController.node;
    }
    /** @protected */
    get _helperId() {
      return this._helperController.helperId;
    }
    /**
     * @protected
     * @return {HTMLElement}
     */
    get _helperNode() {
      return this._helperController.node;
    }
    constructor() {
      super(), this._fieldAriaController = new cu(this), this._helperController = new du(this), this._errorController = new lu(this), this._labelController.addEventListener("label-changed", (t) => {
        const { hasLabel: o, node: i } = t.detail;
        this.__labelChanged(o, i);
      }), this._helperController.addEventListener("helper-changed", (t) => {
        const { hasHelper: o, node: i } = t.detail;
        this.__helperChanged(o, i);
      });
    }
    /** @protected */
    ready() {
      super.ready(), this.addController(this._fieldAriaController), this.addController(this._helperController), this.addController(this._errorController);
    }
    /** @private */
    __helperChanged(t, o) {
      t ? this._fieldAriaController.setHelperId(o.id) : this._fieldAriaController.setHelperId(null);
    }
    /** @private */
    __labelChanged(t, o) {
      t ? this._fieldAriaController.setLabelId(o.id) : this._fieldAriaController.setLabelId(null);
    }
    /**
     * @param {string | null | undefined} errorMessage
     * @protected
     */
    _errorMessageChanged(t) {
      this._errorController.setErrorMessage(t);
    }
    /**
     * @param {string} helperText
     * @protected
     */
    _helperTextChanged(t) {
      this._helperController.setHelperText(t);
    }
    /**
     * @param {HTMLElement | null | undefined} target
     * @protected
     */
    _ariaTargetChanged(t) {
      t && this._fieldAriaController.setTarget(t);
    }
    /**
     * @param {boolean} required
     * @protected
     */
    _requiredChanged(t) {
      this._fieldAriaController.setRequired(t);
    }
    /**
     * @param {boolean} invalid
     * @protected
     */
    _invalidChanged(t) {
      this._errorController.setInvalid(t), setTimeout(() => {
        t ? this._fieldAriaController.setErrorId(this._errorController.errorId) : this._fieldAriaController.setErrorId(null);
      });
    }
  };
  /**
   * @license
   * Copyright (c) 2021 - 2022 Vaadin Ltd.
   * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
   */
  const gu = S(
    (r) => class extends r {
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
      _stateTargetChanged(t) {
        t && (this._ensureAttrsDelegated(), this._ensurePropsDelegated());
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
        this.constructor.delegateAttrs.forEach((t) => {
          this._delegateAttribute(t, this[t]);
        });
      }
      /** @protected */
      _ensurePropsDelegated() {
        this.constructor.delegateProps.forEach((t) => {
          this._delegateProperty(t, this[t]);
        });
      }
      /** @protected */
      _delegateAttrsChanged(...t) {
        this.constructor.delegateAttrs.forEach((o, i) => {
          this._delegateAttribute(o, t[i]);
        });
      }
      /** @protected */
      _delegatePropsChanged(...t) {
        this.constructor.delegateProps.forEach((o, i) => {
          this._delegateProperty(o, t[i]);
        });
      }
      /** @protected */
      _delegateAttribute(t, o) {
        this.stateTarget && (t === "invalid" && this._delegateAttribute("aria-invalid", o ? "true" : !1), typeof o == "boolean" ? this.stateTarget.toggleAttribute(t, o) : o ? this.stateTarget.setAttribute(t, o) : this.stateTarget.removeAttribute(t));
      }
      /** @protected */
      _delegateProperty(t, o) {
        this.stateTarget && (this.stateTarget[t] = o);
      }
    }
  );
  /**
   * @license
   * Copyright (c) 2021 - 2022 Vaadin Ltd.
   * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
   */
  const fu = S(
    (r) => class extends r {
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
           * When true, the input element has a non-empty value entered by the user.
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
       * Clear the value of the field.
       */
      clear() {
        this.value = "";
      }
      /**
       * Add event listeners to the input element instance.
       * Override this method to add custom listeners.
       * @param {!HTMLElement} input
       * @protected
       */
      _addInputListeners(t) {
        t.addEventListener("input", this._boundOnInput), t.addEventListener("change", this._boundOnChange);
      }
      /**
       * Remove event listeners from the input element instance.
       * @param {!HTMLElement} input
       * @protected
       */
      _removeInputListeners(t) {
        t.removeEventListener("input", this._boundOnInput), t.removeEventListener("change", this._boundOnChange);
      }
      /**
       * A method to forward the value property set on the field
       * programmatically back to the input element value.
       * Override this method to perform additional checks,
       * for example to skip this in certain conditions.
       * @param {string} value
       * @protected
       */
      _forwardInputValue(t) {
        this.inputElement && (t != null ? this.inputElement.value = t : this.inputElement.value = "");
      }
      /**
       * @param {HTMLElement | undefined} input
       * @param {HTMLElement | undefined} oldInput
       * @protected
       */
      _inputElementChanged(t, o) {
        t ? this._addInputListeners(t) : o && this._removeInputListeners(o);
      }
      /**
       * Observer to notify about the change of private property.
       *
       * @private
       */
      _hasInputValueChanged(t, o) {
        (t || o) && this.dispatchEvent(new CustomEvent("has-input-value-changed"));
      }
      /**
       * An input event listener used to update `_hasInputValue` property.
       * Do not override this method.
       *
       * @param {Event} event
       * @private
       */
      __onInput(t) {
        this._setHasInputValue(t), this._onInput(t);
      }
      /**
       * An input event listener used to update the field value.
       *
       * @param {Event} event
       * @protected
       */
      _onInput(t) {
        const o = t.composedPath()[0];
        this.__userInput = t.isTrusted, this.value = o.value, this.__userInput = !1;
      }
      /**
       * A change event listener.
       * Override this method with an actual implementation.
       * @param {Event} _event
       * @protected
       */
      _onChange(t) {
      }
      /**
       * Toggle the has-value attribute based on the value property.
       *
       * @param {boolean} hasValue
       * @protected
       */
      _toggleHasValue(t) {
        this.toggleAttribute("has-value", t);
      }
      /**
       * Observer called when a value property changes.
       * @param {string | undefined} newVal
       * @param {string | undefined} oldVal
       * @protected
       */
      _valueChanged(t, o) {
        this._toggleHasValue(this._hasValue), !(t === "" && o === void 0) && (this.__userInput || this._forwardInputValue(t));
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
       * Sets the `_hasInputValue` property based on the `input` event.
       *
       * @param {InputEvent} event
       * @protected
       */
      _setHasInputValue(t) {
        const o = t.composedPath()[0];
        this._hasInputValue = o.value.length > 0;
      }
    }
  );
  /**
   * @license
   * Copyright (c) 2021 - 2022 Vaadin Ltd.
   * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
   */
  const In = S(
    (r) => class extends gu(Mn(fu(r))) {
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
        return this.inputElement && this._hasValidConstraints(this.constructor.constraints.map((t) => this[t])) ? this.inputElement.checkValidity() : !this.invalid;
      }
      /**
       * Returns true if some of the provided set of constraints are valid.
       * @param {Array} constraints
       * @return {boolean}
       * @protected
       */
      _hasValidConstraints(t) {
        return t.some((o) => this.__isValidConstraint(o));
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
      _constraintsChanged(t, ...o) {
        if (!t)
          return;
        const i = this._hasValidConstraints(o), a = this.__previousHasConstraints && !i;
        (this._hasValue || this.invalid) && i ? this.validate() : a && this._setInvalid(!1), this.__previousHasConstraints = i;
      }
      /**
       * Override an event listener inherited from `InputMixin`
       * to capture native `change` event and make sure that
       * a new one is dispatched after validation runs.
       * @param {Event} event
       * @protected
       * @override
       */
      _onChange(t) {
        t.stopPropagation(), this.validate(), this.dispatchEvent(
          new CustomEvent("change", {
            detail: {
              sourceEvent: t
            },
            bubbles: t.bubbles,
            cancelable: t.cancelable
          })
        );
      }
      /** @private */
      __isValidConstraint(t) {
        return !!t || t === 0;
      }
    }
  );
  /**
   * @license
   * Copyright (c) 2021 - 2022 Vaadin Ltd.
   * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
   */
  const Rr = /* @__PURE__ */ new WeakMap();
  function bu(r) {
    return Rr.has(r) || Rr.set(r, /* @__PURE__ */ new Set()), Rr.get(r);
  }
  function mu(r, e) {
    const t = document.createElement("style");
    t.textContent = r, e === document ? document.head.appendChild(t) : e.insertBefore(t, e.firstChild);
  }
  const _u = S(
    (r) => class extends r {
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
        const t = this.getRootNode(), o = bu(t);
        this.slotStyles.forEach((i) => {
          o.has(i) || (mu(i, t), o.add(i));
        });
      }
    }
  );
  /**
   * @license
   * Copyright (c) 2021 - 2022 Vaadin Ltd.
   * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
   */
  const vu = (r) => class extends _u(
    $n(In(pu(Io(r))))
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
         * Set to true to display the clear icon which clears the input.
         * @attr {boolean} clear-button-visible
         */
        clearButtonVisible: {
          type: Boolean,
          reflectToAttribute: !0,
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
    /**
     * Any element extending this mixin is required to implement this getter.
     * It returns the reference to the clear button element.
     * @protected
     * @return {Element | null | undefined}
     */
    get clearElement() {
      return null;
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
    /** @protected */
    ready() {
      super.ready(), this.clearElement && (this.clearElement.addEventListener("click", (t) => this._onClearButtonClick(t)), this.clearElement.addEventListener("mousedown", (t) => this._onClearButtonMouseDown(t)));
    }
    /**
     * @param {Event} event
     * @protected
     */
    _onClearButtonClick(t) {
      t.preventDefault(), this.__clear();
    }
    /**
     * @param {Event} event
     * @protected
     */
    _onClearButtonMouseDown(t) {
      t.preventDefault(), Zc || this.inputElement.focus();
    }
    /**
     * Override an event listener from `DelegateFocusMixin`.
     * @param {FocusEvent} event
     * @protected
     * @override
     */
    _onFocus(t) {
      super._onFocus(t), this.autoselect && this.inputElement && this.inputElement.select();
    }
    /**
     * Override an event listener inherited from `KeydownMixin` to clear on Esc.
     * Components that extend this mixin can prevent this behavior by overriding
     * this method without calling `super._onEscape` to provide custom logic.
     * @param {KeyboardEvent} event
     * @protected
     * @override
     */
    _onEscape(t) {
      super._onEscape(t), this.clearButtonVisible && this.value && (t.stopPropagation(), this.__clear());
    }
    /**
     * Override an event listener inherited from `InputMixin`
     * to capture native `change` event and make sure that
     * a new one is dispatched after validation runs.
     * @param {Event} event
     * @protected
     * @override
     */
    _onChange(t) {
      t.stopPropagation(), this.validate(), this.dispatchEvent(
        new CustomEvent("change", {
          detail: {
            sourceEvent: t
          },
          bubbles: t.bubbles,
          cancelable: t.cancelable
        })
      );
    }
    /** @private */
    __clear() {
      this.clear(), this.inputElement.dispatchEvent(new Event("input", { bubbles: !0, composed: !0 })), this.inputElement.dispatchEvent(new Event("change", { bubbles: !0 }));
    }
    /**
     * Override a method from `InputMixin`.
     * @param {!HTMLElement} input
     * @protected
     * @override
     */
    _addInputListeners(t) {
      super._addInputListeners(t), t.addEventListener("paste", this._boundOnPaste), t.addEventListener("drop", this._boundOnDrop), t.addEventListener("beforeinput", this._boundOnBeforeInput);
    }
    /**
     * Override a method from `InputMixin`.
     * @param {!HTMLElement} input
     * @protected
     * @override
     */
    _removeInputListeners(t) {
      super._removeInputListeners(t), t.removeEventListener("paste", this._boundOnPaste), t.removeEventListener("drop", this._boundOnDrop), t.removeEventListener("beforeinput", this._boundOnBeforeInput);
    }
    /**
     * Override an event listener from `KeyboardMixin`.
     * @param {!KeyboardEvent} event
     * @protected
     * @override
     */
    _onKeyDown(t) {
      super._onKeyDown(t), this.allowedCharPattern && !this.__shouldAcceptKey(t) && (t.preventDefault(), this._markInputPrevented());
    }
    /** @protected */
    _markInputPrevented() {
      this.setAttribute("input-prevented", ""), this._preventInputDebouncer = $t.debounce(this._preventInputDebouncer, ir.after(200), () => {
        this.removeAttribute("input-prevented");
      });
    }
    /** @private */
    __shouldAcceptKey(t) {
      return t.metaKey || t.ctrlKey || !t.key || // Allow typing anything if event.key is not supported
      t.key.length !== 1 || // Allow "Backspace", "ArrowLeft" etc.
      this.__allowedCharRegExp.test(t.key);
    }
    /** @private */
    _onPaste(t) {
      if (this.allowedCharPattern) {
        const o = t.clipboardData.getData("text");
        this.__allowedTextRegExp.test(o) || (t.preventDefault(), this._markInputPrevented());
      }
    }
    /** @private */
    _onDrop(t) {
      if (this.allowedCharPattern) {
        const o = t.dataTransfer.getData("text");
        this.__allowedTextRegExp.test(o) || (t.preventDefault(), this._markInputPrevented());
      }
    }
    /** @private */
    _onBeforeInput(t) {
      this.allowedCharPattern && t.data && !this.__allowedTextRegExp.test(t.data) && (t.preventDefault(), this._markInputPrevented());
    }
    /** @private */
    _allowedCharPatternChanged(t) {
      if (t)
        try {
          this.__allowedCharRegExp = new RegExp(`^${t}$`), this.__allowedTextRegExp = new RegExp(`^${t}*$`);
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
   * Copyright (c) 2021 - 2022 Vaadin Ltd.
   * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
   */
  class yu extends Se {
    constructor(e, t) {
      super(
        e,
        "input",
        () => document.createElement("input"),
        (o, i) => {
          o.value && (i.value = o.value), o.type && i.setAttribute("type", o.type), i.id = this.defaultId, typeof t == "function" && t(i);
        },
        !0
      );
    }
  }
  /**
   * @license
   * Copyright (c) 2021 - 2022 Vaadin Ltd.
   * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
   */
  class ku {
    constructor(e, t) {
      this.input = e, this.__preventDuplicateLabelClick = this.__preventDuplicateLabelClick.bind(this), t.addEventListener("label-changed", (o) => {
        this.__initLabel(o.detail.node);
      }), this.__initLabel(t.node);
    }
    /**
     * @param {HTMLElement} label
     * @private
     */
    __initLabel(e) {
      e && (e.addEventListener("click", this.__preventDuplicateLabelClick), this.input && e.setAttribute("for", this.input.id));
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
      const e = (t) => {
        t.stopImmediatePropagation(), this.input.removeEventListener("click", e);
      };
      this.input.addEventListener("click", e);
    }
  }
  /**
   * @license
   * Copyright (c) 2021 - 2022 Vaadin Ltd..
   * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
   */
  const xu = A`
  [part='clear-button'] {
    display: none;
    cursor: default;
  }

  [part='clear-button']::before {
    content: '✕';
  }

  :host([clear-button-visible][has-value]:not([disabled]):not([readonly])) [part='clear-button'] {
    display: block;
  }
`;
  /**
   * @license
   * Copyright (c) 2021 - 2022 Vaadin Ltd..
   * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
   */
  const wu = A`
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
`;
  /**
   * @license
   * Copyright (c) 2021 - 2022 Vaadin Ltd..
   * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
   */
  const Cu = A`
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
   * Copyright (c) 2021 - 2022 Vaadin Ltd..
   * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
   */
  const Au = [wu, Cu, xu];
  /**
   * @license
   * Copyright (c) 2021 - 2022 Vaadin Ltd.
   * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
   */
  class Eu {
    /**
     * @param {{ inputElement?: HTMLElement; opened: boolean } & HTMLElement} host
     */
    constructor(e) {
      this.host = e, e.addEventListener("opened-changed", () => {
        e.opened || this.__setVirtualKeyboardEnabled(!1);
      }), e.addEventListener("blur", () => this.__setVirtualKeyboardEnabled(!0)), e.addEventListener("touchstart", () => this.__setVirtualKeyboardEnabled(!0));
    }
    /** @private */
    __setVirtualKeyboardEnabled(e) {
      this.host.inputElement && (this.host.inputElement.inputMode = e ? "" : "none");
    }
  }
  /**
   * @license
   * Copyright (c) 2016 - 2022 Vaadin Ltd.
   * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
   */
  const Pu = (r) => class extends at(
    $n(In(Io(r)))
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
          type: Boolean
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
         *   // Used in screen reader announcements along with week
         *   // numbers, if they are displayed.
         *   week: 'Week',
         *
         *   // Translation of the Calendar icon button title.
         *   calendar: 'Calendar',
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
            week: "Week",
            calendar: "Calendar",
            today: "Today",
            cancel: "Cancel",
            referenceDate: "",
            formatDate(t) {
              const o = String(t.year).replace(/\d+/, (i) => "0000".substr(i.length) + i);
              return [t.month + 1, t.day, o].join("/");
            },
            parseDate(t) {
              const o = t.split("/"), i = /* @__PURE__ */ new Date();
              let a, n = i.getMonth(), s = i.getFullYear();
              if (o.length === 3) {
                if (n = parseInt(o[0]) - 1, a = parseInt(o[1]), s = parseInt(o[2]), o[2].length < 3 && s >= 0) {
                  const l = this.referenceDate ? gt(this.referenceDate) : /* @__PURE__ */ new Date();
                  s = su(l, s, n, a);
                }
              } else
                o.length === 2 ? (n = parseInt(o[0]) - 1, a = parseInt(o[1])) : o.length === 1 && (a = parseInt(o[0]));
              if (a !== void 0)
                return { day: a, month: n, year: s };
            },
            formatTitle: (t, o) => `${t} ${o}`
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
          value: sn
        },
        /** @private */
        _focusOverlayOnOpen: Boolean,
        /** @protected */
        _overlayInitialized: Boolean
      };
    }
    static get observers() {
      return [
        "_selectedDateChanged(_selectedDate, i18n.formatDate)",
        "_focusedDateChanged(_focusedDate, i18n.formatDate)"
      ];
    }
    static get constraints() {
      return [...super.constraints, "min", "max"];
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
    /** @protected */
    get _inputValue() {
      return this.inputElement ? this.inputElement.value : void 0;
    }
    /** @protected */
    set _inputValue(t) {
      this.inputElement && (this.inputElement.value = t);
    }
    /** @private */
    get _nativeInput() {
      return this.inputElement ? this.inputElement.focusElement || this.inputElement : null;
    }
    constructor() {
      super(), this._boundOnClick = this._onClick.bind(this), this._boundOnScroll = this._onScroll.bind(this);
    }
    /**
     * Override an event listener from `DelegateFocusMixin`
     * @protected
     */
    _onFocus(t) {
      super._onFocus(t), this._noInput && t.target.blur();
    }
    /**
     * Override an event listener from `DelegateFocusMixin`
     * @protected
     */
    _onBlur(t) {
      super._onBlur(t), this.opened || (this.autoOpenDisabled && this._selectParsedOrFocusedDate(), this.validate(), this._inputValue === "" && this.value !== "" && (this.value = ""));
    }
    /** @protected */
    ready() {
      super.ready(), this.addEventListener("click", this._boundOnClick), this.addController(
        new On(this._fullscreenMediaQuery, (t) => {
          this._fullscreen = t;
        })
      ), this.addController(new Eu(this));
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
    _propertiesChanged(t, o, i) {
      super._propertiesChanged(t, o, i), "value" in o && this.__dispatchChange && (this.dispatchEvent(new CustomEvent("change", { bubbles: !0 })), this.__dispatchChange = !1);
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
      (this._overlayInitialized || this.autoOpenDisabled) && this.$.overlay.close();
    }
    /** @protected */
    _initOverlay() {
      this.$.overlay.removeAttribute("disable-upgrade"), this._overlayInitialized = !0, this.$.overlay.addEventListener("opened-changed", (t) => {
        this.opened = t.detail.value;
      }), this.$.overlay.addEventListener("vaadin-overlay-escape-press", () => {
        this._focusedDate = this._selectedDate, this._close();
      }), this._overlayContent.addEventListener("close", () => {
        this._close();
      }), this._overlayContent.addEventListener("focus-input", this._focusAndSelect.bind(this)), this._overlayContent.addEventListener("date-tap", (t) => {
        this.__userConfirmedDate = !0, this._selectDate(t.detail.date), this._close();
      }), this._overlayContent.addEventListener("date-selected", (t) => {
        this.__userConfirmedDate = !!t.detail.date, this._selectDate(t.detail.date);
      }), this._overlayContent.addEventListener("focusin", () => {
        this._keyboardActive && this._setFocused(!0);
      }), this.addEventListener("mousedown", () => this.__bringToFront()), this.addEventListener("touchstart", () => this.__bringToFront());
    }
    /**
     * Returns true if the current input value satisfies all constraints (if any)
     *
     * Override the `checkValidity` method for custom validations.
     *
     * @return {boolean} True if the value is valid
     */
    checkValidity() {
      const t = !this._inputValue || !!this._selectedDate && this._inputValue === this._getFormattedDate(this.i18n.formatDate, this._selectedDate), o = !this._selectedDate || yt(this._selectedDate, this._minDate, this._maxDate);
      let i = !0;
      return this.inputElement && (this.inputElement.checkValidity ? i = this.inputElement.checkValidity() : this.inputElement.validate && (i = this.inputElement.validate())), t && o && i;
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
    _shouldSetFocus(t) {
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
    _shouldRemoveFocus(t) {
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
    _setFocused(t) {
      super._setFocused(t), this._shouldKeepFocusRing = t && this._keyboardActive;
    }
    /**
     * Select date on user interaction and set the flag
     * to fire change event if necessary.
     *
     * @param {Date} dateToSelect
     * @protected
     */
    _selectDate(t) {
      const o = this._formatISO(t);
      this.value !== o && (this.__dispatchChange = !0), this._selectedDate = t;
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
    _isNoInput(t, o, i, a, n, s) {
      return !t || o && (!s || n) || i && n || !a.parseDate;
    }
    /** @private */
    _formatISO(t) {
      if (!(t instanceof Date))
        return "";
      const o = (d, u = "00") => (u + d).substr((u + d).length - u.length);
      let i = "", a = "0000", n = t.getFullYear();
      n < 0 ? (n = -n, i = "-", a = "000000") : t.getFullYear() >= 1e4 && (i = "+", a = "000000");
      const s = i + o(n, a), l = o(t.getMonth() + 1), c = o(t.getDate());
      return [s, l, c].join("-");
    }
    /** @protected */
    _inputElementChanged(t) {
      super._inputElementChanged(t), t && (t.autocomplete = "off", t.setAttribute("role", "combobox"), t.setAttribute("aria-haspopup", "dialog"), t.setAttribute("aria-expanded", !!this.opened), this._applyInputValue(this._selectedDate));
    }
    /** @protected */
    _openedChanged(t) {
      t && !this._overlayInitialized && this._initOverlay(), this._overlayInitialized && (this.$.overlay.opened = t), this.inputElement && this.inputElement.setAttribute("aria-expanded", t);
    }
    /** @private */
    _selectedDateChanged(t, o) {
      if (t === void 0 || o === void 0)
        return;
      const i = this._formatISO(t);
      this.__keepInputValue || this._applyInputValue(t), i !== this.value && (this.validate(), this.value = i), this._ignoreFocusedDateChange = !0, this._focusedDate = t, this._ignoreFocusedDateChange = !1;
    }
    /** @private */
    _focusedDateChanged(t, o) {
      t === void 0 || o === void 0 || !this._ignoreFocusedDateChange && !this._noInput && this._applyInputValue(t);
    }
    /** @private */
    __getOverlayTheme(t, o) {
      if (o)
        return t;
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
    _valueChanged(t, o) {
      const i = gt(t);
      if (t && !i) {
        this.value = o;
        return;
      }
      t ? ie(this._selectedDate, i) || (this._selectedDate = i, o !== void 0 && this.validate()) : this._selectedDate = null, this._toggleHasValue(this._hasValue);
    }
    /** @protected */
    _onOverlayOpened() {
      const t = gt(this.initialPosition), o = this._selectedDate || this._overlayContent.initialPosition || t || /* @__PURE__ */ new Date();
      t || yt(o, this._minDate, this._maxDate) ? this._overlayContent.initialPosition = o : this._overlayContent.initialPosition = Tn(o, [this._minDate, this._maxDate]), this._overlayContent.scrollToDate(this._overlayContent.focusedDate || this._overlayContent.initialPosition), this._ignoreFocusedDateChange = !0, this._overlayContent.focusedDate = this._overlayContent.focusedDate || this._overlayContent.initialPosition, this._ignoreFocusedDateChange = !1, window.addEventListener("scroll", this._boundOnScroll, !0), this._focusOverlayOnOpen ? (this._overlayContent.focusDateElement(), this._focusOverlayOnOpen = !1) : this._focus(), this._noInput && this.focusElement && (this.focusElement.blur(), this._overlayContent.focusDateElement());
    }
    /** @private */
    _selectParsedOrFocusedDate() {
      if (this._ignoreFocusedDateChange = !0, this.i18n.parseDate) {
        const t = this._inputValue || "", o = this._getParsedDate(t);
        this._isValidDate(o) ? this._selectDate(o) : (this.__keepInputValue = !0, this._selectDate(null), this._selectedDate = null, this.__keepInputValue = !1);
      } else
        this._focusedDate && this._selectDate(this._focusedDate);
      this._ignoreFocusedDateChange = !1;
    }
    /** @protected */
    _onOverlayClosed() {
      window.removeEventListener("scroll", this._boundOnScroll, !0), this.__userConfirmedDate ? this.__userConfirmedDate = !1 : this._selectParsedOrFocusedDate(), this._nativeInput && this._nativeInput.selectionStart && (this._nativeInput.selectionStart = this._nativeInput.selectionEnd), this.value || this.validate();
    }
    /** @private */
    _onScroll(t) {
      (t.target === window || !this._overlayContent.contains(t.target)) && this._overlayContent._repositionYearScroller();
    }
    /** @protected */
    _focus() {
      this._noInput || this.inputElement.focus();
    }
    /** @private */
    _focusAndSelect() {
      this._focus(), this._setSelectionRange(0, this._inputValue.length);
    }
    /** @private */
    _applyInputValue(t) {
      this._inputValue = t ? this._getFormattedDate(this.i18n.formatDate, t) : "";
    }
    /** @private */
    _getFormattedDate(t, o) {
      return t(Dn(o));
    }
    /** @private */
    _setSelectionRange(t, o) {
      this._nativeInput && this._nativeInput.setSelectionRange && this._nativeInput.setSelectionRange(t, o);
    }
    /** @private */
    _isValidDate(t) {
      return t && !isNaN(t.getTime());
    }
    /**
     * Override an event listener from `InputConstraintsMixin`
     * to have date-picker fully control when to fire a change event.
     * @protected
     */
    _onChange(t) {
      this._inputValue === "" && (this.__dispatchChange = !0), t.stopPropagation();
    }
    /**
     * @param {Event} event
     * @private
     */
    _onClick(t) {
      this._isClearButton(t) || this._onHostClick(t);
    }
    /**
     * @param {Event} event
     * @private
     */
    _onHostClick(t) {
      (!this.autoOpenDisabled || this._noInput) && (t.preventDefault(), this.open());
    }
    /**
     * Override an event listener from `InputControlMixin`
     * to validate and dispatch change on clear.
     * @protected
     */
    _onClearButtonClick(t) {
      t.preventDefault(), this.value = "", this._inputValue = "", this.validate(), this.dispatchEvent(new CustomEvent("change", { bubbles: !0 }));
    }
    /**
     * Override an event listener from `KeyboardMixin`.
     * @param {KeyboardEvent} e
     * @protected
     * @override
     */
    _onKeyDown(t) {
      switch (super._onKeyDown(t), this._noInput && [
        9
        // Tab
      ].indexOf(t.keyCode) === -1 && t.preventDefault(), t.key) {
        case "ArrowDown":
        case "ArrowUp":
          t.preventDefault(), this.opened ? this._overlayContent.focusDateElement() : (this._focusOverlayOnOpen = !0, this.open());
          break;
        case "Tab":
          this.opened && (t.preventDefault(), t.stopPropagation(), this._setSelectionRange(0, 0), t.shiftKey ? this._overlayContent.focusCancel() : this._overlayContent.focusDateElement());
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
    _onEnter(t) {
      const o = this.value;
      this.opened ? this.close() : this._selectParsedOrFocusedDate(), o === this.value && this.validate();
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
    _onEscape(t) {
      if (!this.opened) {
        if (this.clearButtonVisible && this.value) {
          t.stopPropagation(), this._onClearButtonClick(t);
          return;
        }
        this.autoOpenDisabled ? (this.inputElement.value === "" && this._selectDate(null), this._applyInputValue(this._selectedDate)) : (this._focusedDate = this._selectedDate, this._selectParsedOrFocusedDate());
      }
    }
    /** @private */
    _getParsedDate(t = this._inputValue) {
      const o = this.i18n.parseDate && this.i18n.parseDate(t);
      return o && gt(`${o.year}-${o.month + 1}-${o.day}`);
    }
    /** @protected */
    _isClearButton(t) {
      return t.composedPath()[0] === this.clearElement;
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
      if (this._inputValue) {
        const t = this._getParsedDate();
        this._isValidDate(t) && (this._ignoreFocusedDateChange = !0, ie(t, this._focusedDate) || (this._focusedDate = t), this._ignoreFocusedDateChange = !1);
      }
    }
    /** @private */
    get _overlayContent() {
      return this.$.overlay.content.querySelector("#overlay-content");
    }
    /** @private */
    __computeMinOrMaxDate(t) {
      return gt(t);
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
   * Copyright (c) 2016 - 2022 Vaadin Ltd.
   * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
   */
  $("vaadin-date-picker", [Au, Zd], { moduleId: "vaadin-date-picker-styles" });
  class Ji extends Pu(vu(it(gn(ue)))) {
    static get is() {
      return "vaadin-date-picker";
    }
    static get template() {
      return Pe`
      <style>
        :host([opened]) {
          pointer-events: auto;
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
        theme$="[[__getOverlayTheme(_theme, _overlayInitialized)]]"
        on-vaadin-overlay-open="_onOverlayOpened"
        on-vaadin-overlay-closing="_onOverlayClosed"
        restore-focus-on-close
        restore-focus-node="[[inputElement]]"
        disable-upgrade
      >
        <template>
          <vaadin-date-picker-overlay-content
            id="overlay-content"
            i18n="[[i18n]]"
            fullscreen$="[[_fullscreen]]"
            label="[[label]]"
            selected-date="[[_selectedDate]]"
            focused-date="{{_focusedDate}}"
            show-week-numbers="[[showWeekNumbers]]"
            min-date="[[_minDate]]"
            max-date="[[_maxDate]]"
            part="overlay-content"
            theme$="[[__getOverlayTheme(_theme, _overlayInitialized)]]"
          ></vaadin-date-picker-overlay-content>
        </template>
      </vaadin-date-picker-overlay>

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
        new yu(this, (t) => {
          this._setInputElement(t), this._setFocusElement(t), this.stateTarget = t, this.ariaTarget = t;
        })
      ), this.addController(new ku(this.inputElement, this._labelController)), this._tooltipController = new fn(this), this.addController(this._tooltipController), this._tooltipController.setPosition("top"), this._tooltipController.setShouldShow((t) => !t.opened), this.shadowRoot.querySelector('[part="toggle-button"]').addEventListener("mousedown", (t) => t.preventDefault());
    }
    /** @protected */
    _initOverlay() {
      super._initOverlay(), this.$.overlay.addEventListener("vaadin-overlay-close", this._onVaadinOverlayClose.bind(this));
    }
    /** @private */
    _onVaadinOverlayClose(e) {
      e.detail.sourceEvent && e.detail.sourceEvent.composedPath().includes(this) && e.preventDefault();
    }
    /** @private */
    _toggle(e) {
      e.stopPropagation(), this[this._overlayInitialized && this.$.overlay.opened ? "close" : "open"]();
    }
    // Workaround https://github.com/vaadin/web-components/issues/2855
    /** @protected */
    _openedChanged(e) {
      super._openedChanged(e), this.$.overlay.positionTarget = this.shadowRoot.querySelector('[part="input-field"]'), this.$.overlay.noVerticalOverlap = !0;
    }
  }
  customElements.define(Ji.is, Ji);
  /**
   * @license
   * Copyright (c) 2016 - 2022 Vaadin Ltd.
   * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
   */
  var Su = Object.defineProperty, Tu = Object.getOwnPropertyDescriptor, Du = (r, e, t, o) => {
    for (var i = o > 1 ? void 0 : o ? Tu(e, t) : e, a = r.length - 1, n; a >= 0; a--)
      (n = r[a]) && (i = (o ? n(e, t, i) : n(i)) || i);
    return o && i && Su(e, t, i), i;
  };
  const Vo = class Vo extends pa(X)(Ie) {
    constructor() {
      super(), this.kiosk_base_url = "/", this.showProgress = !1, this.apiContext = void 0;
    }
    updated(e) {
      e.has("apiContext") && (this.showProgress = !1);
    }
    render() {
      let e;
      return this.apiContext && this.apiContext.status === ha ? e = this.apiRender() : this.apiContext && this.apiContext.status === jr ? e = this.renderApiError() : e = this.renderNoContextYet(), h`
            <link rel="stylesheet" href="${this.kiosk_base_url}static/styles.css" />
            ${e}
        `;
    }
    renderNoContextYet() {
      return h` <link rel="stylesheet" href="${this.kiosk_base_url}static/styles.css" /> `;
    }
    renderApiError() {
    }
    renderProgress(e = !1) {
      if (e || this.showProgress)
        return h` <div class="loading">
                <div class="loading-progress"></div>
            </div>`;
    }
  };
  Vo.properties = {
    /**
     * The Api Context
     */
    apiContext: { type: Object }
  };
  let z = Vo;
  Du([
    Rs()
  ], z.prototype, "showProgress", 2);
  var Ou = Object.defineProperty, $u = Object.getOwnPropertyDescriptor, Mu = Object.getPrototypeOf, Iu = Reflect.get, Nu = (r, e, t, o) => {
    for (var i = o > 1 ? void 0 : o ? $u(e, t) : e, a = r.length - 1, n; a >= 0; a--)
      (n = r[a]) && (i = (o ? n(e, t, i) : n(i)) || i);
    return o && i && Ou(e, t, i), i;
  }, zu = (r, e, t) => Iu(Mu(r), t, e);
  let Fe = class extends z {
    constructor() {
      super(), this.login_token = "", this.api_url = "", this.selected_date = /* @__PURE__ */ new Date(), this._init();
    }
    _init() {
      X.dispatch(Ne("dateSelector", { selectedDate: this.selected_date }));
    }
    stateChanged(r) {
      if ("dateSelector" in r.selectors) {
        let e = r.selectors.dateSelector.selectedDate;
        e.getTime() !== this.selected_date.getTime() && (this.selected_date = e);
      }
    }
    apiRender() {
      let r = this.selected_date.getDate() - 3, e = this.selected_date.getDate() + 3, t = [];
      for (let o = r; o <= e; o++) {
        let i = new Date(this.selected_date);
        i.setDate(o), t.push(i);
      }
      return h`<div class="date-selector">
                          ${t.map((o) => h`
                            ${o.getDate() === this.selected_date.getDate() ? h`
                                <div date=${o.getTime()} class="date-selector-date selected-date">
                                    <vaadin-date-picker 
                                        id="date-picker" 
                                        @change=${this.dateClicked}
                                        auto-open-disabled 
                                        value="${ot(o)}">
                                    </vaadin-date-picker>
                                </div>` : h`
                                <div date=${o.getTime()} class="date-selector-date" @click=${this.dateClicked}>
                                    ${o.toLocaleDateString(void 0, { weekday: "short" })}
                                </div>`}
                            `)}
                    </div>`;
    }
    dateClicked(r) {
      if (r.currentTarget.id === "date-picker") {
        const e = ae(r.currentTarget.value);
        X.dispatch(Ne("dateSelector", { selectedDate: e }));
      } else {
        const e = /* @__PURE__ */ new Date();
        e.setTime(r.currentTarget.getAttribute("date")), X.dispatch(Ne("dateSelector", { selectedDate: e }));
      }
    }
    firstUpdated(r) {
      super.firstUpdated(r);
    }
    // protected updated(_changedProperties: any) {
    //     super.updated(_changedProperties);
    //     // if (this.editing !== "") {
    //     //     this.shadowRoot.getElementById("edit-list").focus();
    //     // }
    // }
    // onAfterEnter(location: any, commands: any, router: any) {
    //     console.log("OnAfterEnter", location, commands, router);
    //     // this._installSyncEvents();
    // }
  };
  Fe.styles = H(Hs);
  Fe.properties = {
    ...zu(Fe, Fe, "properties"),
    selected_date: { type: Date }
  };
  Fe = Nu([
    W("date-selector")
  ], Fe);
  const Lu = '.col-bg-body-lighter{background-color:var(--col-bg-body-lighter)}.col-bg-body{background-color:var(--col-bg-body)}.col-bg-body-darker{background-color:var(--col-bg-body-darker)}.col-bg-1-lighter{background-color:var(--col-bg-1-lighter)}.col-bg-1{background-color:var(--col-bg-1)}.col-bg-1-darker{background-color:var(--col-bg-1-darker)}.col-bg-1-input{background-color:var(--col-bg-1-input)}.col-primary-bg-1{background-color:var(--col-primary-bg-1)}.col-accent-bg-1{background-color:var(--col-accent-bg-1)}.col-success-bg-1{background-color:var(--col-success-bg-1)}.col-warning-bg-1{background-color:var(--col-warning-bg-1)}.col-error-bg-1{background-color:var(--col-error-bg-1)}.col-bg-2-lighter{background-color:var(--col-bg-2-lighter)}.col-bg-2{background-color:var(--col-bg-2)}.col-bg-2-darker{background-color:var(--col-bg-2-darker)}.col-bg-2-button{background-color:var(--col-bg-2-button)}.col-bg-2-input{background-color:var(--col-bg-2-input)}.col-primary-bg-2{background-color:var(--col-primary-bg-2)}.col-accent-bg-2{background-color:var(--col-accent-bg-2)}.col-success-bg-2{background-color:var(--col-success-bg-2)}.col-warning-bg-2{background-color:var(--col-warning-bg-2)}.col-error-bg-2{background-color:var(--col-error-bg-2)}.col-bg-3-lighter{background-color:var(--col-bg-3-lighter)}.col-bg-3{background-color:var(--col-bg-3)}.col-bg-3-darker{background-color:var(--col-bg-3-darker)}.col-bg-3-button{background-color:var(--col-bg-3-button)}.col-bg-3-input{background-color:var(--col-bg-3-input)}.col-primary-bg-3{background-color:var(--col-primary-bg-3)}.col-accent-bg-3{background-color:var(--col-accent-bg-3)}.col-success-bg-3{background-color:var(--col-success-bg-3)}.col-warning-bg-3{background-color:var(--col-warning-bg-3)}.col-error-bg-3{background-color:var(--col-error-bg-3)}.col-bg-ack-lighter{background-color:var(--col-bg-ack-lighter)}.col-bg-ack{background-color:var(--col-bg-ack)}.col-bg-ack-darker{background-color:var(--col-bg-ack-darker)}.col-primary-bg-ack{background-color:var(--col-primary-bg-ack)}.col-accent-bg-ack{background-color:var(--col-accent-bg-ack)}.col-bg-att-lighter{background-color:var(--col-bg-att-lighter)}.col-bg-att{background-color:var(--col-bg-att)}.col-bg-att-darker{background-color:var(--col-bg-att-darker)}.col-primary-bg-att{background-color:var(--col-primary-bg-att)}.col-accent-bg-att{background-color:var(--col-accent-bg-att)}.col-bg-alert-lighter{background-color:var(--col-bg-alert-lighter)}.col-bg-alert{background-color:var(--col-bg-alert)}.col-bg-alert-darker{background-color:var(--col-bg-alert-darker)}.col-primary-bg-alert{background-color:var(--col-primary-bg-alert)}.col-accent-bg-alert{background-color:var(--col-accent-bg-alert)}.col-bg-btn-lighter{background-color:var(--col-bg-btn-lighter)}.col-bg-btn{background-color:var(--col-bg-btn)}.col-bg-btn-darker{background-color:var(--col-bg-btn-darker)}.col-primary-bg-btn{background-color:var(--col-primary-bg-btn)}.col-accent-bg-btn{background-color:var(--col-accent-bg-btn)}.pattern-diagonal-stripes-sm{background:repeating-linear-gradient(45deg,transparent,transparent 10px,currentColor 10px,currentColor 20px)}.pattern-dots-lg{background-image:radial-gradient(currentColor 1.5px,transparent 1.5px);background-size:15px 15px}.pattern-dots-md{background-image:radial-gradient(currentColor 1px,transparent 1px);background-size:8px 8px}.pattern-dots-medium-dense{background-image:radial-gradient(currentColor .5px,transparent .5px);background-size:3px 3px}.pattern-dots-sm{background-image:radial-gradient(currentColor .5px,transparent .5px);background-size:5px 5px}.pattern-cross-dots-md,.imagelist-background{background-image:radial-gradient(currentColor .7px,transparent 1px),radial-gradient(currentColor .7px,transparent 1px);background-size:6.5px 6.5px;background-position:0 0,3.5px 3.5px}.imagelist-background{background-color:#fff9;background-blend-mode:overlay}.fa,.fas{font-family:"Font Awesome 5 Free";font-weight:900;font-style:normal}.fa-trash:before{content:""}.fa-view-grid:before{content:""}.fa-view-list:before{content:""}.fa-camera:before{content:""}.fa-view-image:before{content:""}.fa-check:before{content:""}.fa-exclamation-circle:before{content:""}p,div{padding:0;margin:0;border:0px;-webkit-user-select:text;user-select:text}select{-webkit-user-select:none;user-select:none}:host{display:block}div,p{font-family:var(--standard-text-font);-webkit-user-select:none;user-select:none}.context-selector{width:100%;background-color:var(--col-bg-2);display:flex;flex-direction:row;align-items:center;justify-content:center;flex-wrap:wrap;cursor:pointer;border-bottom:2px solid var(--col-bg-1-darker)}.selected-context{background-color:var(--col-bg-ack);color:var(--col-accent-bg-ack);font-weight:700;font-size:1.2em;cursor:default}.context{padding:.2em .5em}.context:hover{background-color:#ffffff80}.context:active{background-color:var(--col-bg-ack)}';
  var Ru = Object.defineProperty, Fu = Object.getOwnPropertyDescriptor, Hu = Object.getPrototypeOf, Bu = Reflect.get, ju = (r, e, t, o) => {
    for (var i = o > 1 ? void 0 : o ? Fu(e, t) : e, a = r.length - 1, n; a >= 0; a--)
      (n = r[a]) && (i = (o ? n(e, t, i) : n(i)) || i);
    return o && i && Ru(e, t, i), i;
  }, Uu = (r, e, t) => Bu(Hu(r), t, e);
  let He = class extends z {
    constructor() {
      super(), this.login_token = "", this.api_url = "", this.selected_date = null, this.selected_context = "", this.contexts = [], this.fetching_contexts = !1, this.fetch_error = "", this._init();
    }
    _init() {
    }
    fetch_contexts() {
      this.fetching_contexts = !0;
      const r = (this.selected_date.getMonth() + 1).toString().padStart(2, "0"), e = this.selected_date.getDate().toString().padStart(2, "0"), o = `${this.selected_date.getFullYear()}-${r}-${e}`;
      this.apiContext.fetchFromApi(
        "",
        "cql/query",
        {
          method: "POST",
          caller: "contextselector.fetch_contexts",
          body: JSON.stringify(
            {
              cql: {
                meta: {
                  version: 0.1
                },
                base: {
                  scope: {
                    unit: "browse()"
                  },
                  target: {
                    field_or_instruction: "modified",
                    format: "datetime(date)"
                  },
                  additional_fields: {
                    type: {
                      field_or_instruction: "unit.type",
                      default: "",
                      format: "dsd_type(varchar)"
                    }
                  }
                },
                query: {
                  type: "Raw",
                  distinct: !0,
                  columns: {
                    identifier: {
                      source_field: "identifier"
                    },
                    uid: {
                      source_field: "id_uuid"
                    },
                    type: {
                      source_field: "type"
                    }
                  },
                  conditions: {
                    "?": `equals(data, "${o}")`
                  }
                }
              }
            }
          )
        }
      ).then((i) => {
        i.result_msg !== "ok" ? this.fetch_error = i.result_msg : (this.fetch_error = "", this.load_contexts(i.records)), this.fetching_contexts = !1;
      }).catch((i) => {
        J(this, i, "contextselector.fetch_data", null);
      });
    }
    load_contexts(r) {
      this.contexts = [], r.forEach((e) => {
        let t = new bs();
        t.selectedContext = e.identifier, t.selectedUid = e.uid, t.selectedContextType = e.type, this.contexts.push(t);
      }), this.contexts.findIndex((e) => e.selectedContext === this.selected_context) == -1 && this.changeContext("");
    }
    stateChanged(r) {
      if ("dateSelector" in r.selectors) {
        let e = r.selectors.dateSelector.selectedDate;
        (!this.selected_date || e.getTime() !== this.selected_date.getTime()) && (this.selected_date = e, this.fetch_contexts());
      }
      if ("contextSelector" in r.selectors) {
        let e = r.selectors.contextSelector.selectedContext;
        (!this.selected_context || e !== this.selected_context) && (this.selected_context = e);
      }
    }
    apiRender() {
      return h`
            <div class="context-selector">
                ${this.selected_date !== null ? this.render_contexts() : h`Please select a date`}
            </div>`;
    }
    changeContext(r) {
      let e = { selectedContext: "", selectedUid: "" };
      r && (e = this.contexts.find((t) => t.selectedContext === r)), X.dispatch(Ne("contextSelector", e));
    }
    contextClicked(r) {
      const e = r.currentTarget.getAttribute("context");
      e != this.selected_context && this.changeContext(e);
    }
    render_contexts() {
      return this.fetching_contexts ? h`fetching contexts...` : h`
                <div class="context"
                     context=""
                     @click=${this.contextClicked}>
                    <i class="fa fa-trash"></i>
                </div>

                ${this.contexts.map(
        (r) => h`
                    <div class="context ${r.selectedContext === this.selected_context ? "selected-context" : ""}"
                         context="${r.selectedContext}"
                         @click=${this.contextClicked}>
                        ${r.selectedContext}
                    </div>`
      )}`;
    }
    firstUpdated(r) {
      super.firstUpdated(r);
    }
  };
  He.styles = H(Lu);
  He.properties = {
    ...Uu(He, He, "properties"),
    selected_date: { type: Date },
    selected_context: { type: String },
    fetching_contexts: { type: Boolean }
  };
  He = ju([
    W("context-selector")
  ], He);
  const Vu = '.col-bg-body-lighter{background-color:var(--col-bg-body-lighter)}.col-bg-body{background-color:var(--col-bg-body)}.col-bg-body-darker{background-color:var(--col-bg-body-darker)}.col-bg-1-lighter{background-color:var(--col-bg-1-lighter)}.col-bg-1{background-color:var(--col-bg-1)}.col-bg-1-darker{background-color:var(--col-bg-1-darker)}.col-bg-1-input{background-color:var(--col-bg-1-input)}.col-primary-bg-1{background-color:var(--col-primary-bg-1)}.col-accent-bg-1{background-color:var(--col-accent-bg-1)}.col-success-bg-1{background-color:var(--col-success-bg-1)}.col-warning-bg-1{background-color:var(--col-warning-bg-1)}.col-error-bg-1{background-color:var(--col-error-bg-1)}.col-bg-2-lighter{background-color:var(--col-bg-2-lighter)}.col-bg-2{background-color:var(--col-bg-2)}.col-bg-2-darker{background-color:var(--col-bg-2-darker)}.col-bg-2-button{background-color:var(--col-bg-2-button)}.col-bg-2-input{background-color:var(--col-bg-2-input)}.col-primary-bg-2{background-color:var(--col-primary-bg-2)}.col-accent-bg-2{background-color:var(--col-accent-bg-2)}.col-success-bg-2{background-color:var(--col-success-bg-2)}.col-warning-bg-2{background-color:var(--col-warning-bg-2)}.col-error-bg-2{background-color:var(--col-error-bg-2)}.col-bg-3-lighter{background-color:var(--col-bg-3-lighter)}.col-bg-3{background-color:var(--col-bg-3)}.col-bg-3-darker{background-color:var(--col-bg-3-darker)}.col-bg-3-button{background-color:var(--col-bg-3-button)}.col-bg-3-input{background-color:var(--col-bg-3-input)}.col-primary-bg-3{background-color:var(--col-primary-bg-3)}.col-accent-bg-3{background-color:var(--col-accent-bg-3)}.col-success-bg-3{background-color:var(--col-success-bg-3)}.col-warning-bg-3{background-color:var(--col-warning-bg-3)}.col-error-bg-3{background-color:var(--col-error-bg-3)}.col-bg-ack-lighter{background-color:var(--col-bg-ack-lighter)}.col-bg-ack{background-color:var(--col-bg-ack)}.col-bg-ack-darker{background-color:var(--col-bg-ack-darker)}.col-primary-bg-ack{background-color:var(--col-primary-bg-ack)}.col-accent-bg-ack{background-color:var(--col-accent-bg-ack)}.col-bg-att-lighter{background-color:var(--col-bg-att-lighter)}.col-bg-att{background-color:var(--col-bg-att)}.col-bg-att-darker{background-color:var(--col-bg-att-darker)}.col-primary-bg-att{background-color:var(--col-primary-bg-att)}.col-accent-bg-att{background-color:var(--col-accent-bg-att)}.col-bg-alert-lighter{background-color:var(--col-bg-alert-lighter)}.col-bg-alert{background-color:var(--col-bg-alert)}.col-bg-alert-darker{background-color:var(--col-bg-alert-darker)}.col-primary-bg-alert{background-color:var(--col-primary-bg-alert)}.col-accent-bg-alert{background-color:var(--col-accent-bg-alert)}.col-bg-btn-lighter{background-color:var(--col-bg-btn-lighter)}.col-bg-btn{background-color:var(--col-bg-btn)}.col-bg-btn-darker{background-color:var(--col-bg-btn-darker)}.col-primary-bg-btn{background-color:var(--col-primary-bg-btn)}.col-accent-bg-btn{background-color:var(--col-accent-bg-btn)}.pattern-diagonal-stripes-sm{background:repeating-linear-gradient(45deg,transparent,transparent 10px,currentColor 10px,currentColor 20px)}.pattern-dots-lg{background-image:radial-gradient(currentColor 1.5px,transparent 1.5px);background-size:15px 15px}.pattern-dots-md{background-image:radial-gradient(currentColor 1px,transparent 1px);background-size:8px 8px}.pattern-dots-medium-dense{background-image:radial-gradient(currentColor .5px,transparent .5px);background-size:3px 3px}.pattern-dots-sm{background-image:radial-gradient(currentColor .5px,transparent .5px);background-size:5px 5px}.pattern-cross-dots-md,.imagelist-background{background-image:radial-gradient(currentColor .7px,transparent 1px),radial-gradient(currentColor .7px,transparent 1px);background-size:6.5px 6.5px;background-position:0 0,3.5px 3.5px}.imagelist-background{background-color:#fff9;background-blend-mode:overlay}.fa,.fas{font-family:"Font Awesome 5 Free";font-weight:900;font-style:normal}.fa-trash:before{content:""}.fa-view-grid:before{content:""}.fa-view-list:before{content:""}.fa-camera:before{content:""}.fa-view-image:before{content:""}.fa-check:before{content:""}.fa-exclamation-circle:before{content:""}p,div{padding:0;margin:0;border:0px;-webkit-user-select:text;user-select:text}select{-webkit-user-select:none;user-select:none}:host{display:block}div,p{font-family:var(--standard-text-font);-webkit-user-select:none;user-select:none}.team-selector{width:100%;background-color:var(--col-bg-2);color:var(--col-primary-bg-2);display:flex;flex-direction:row;align-items:center;justify-content:center;flex-wrap:wrap;cursor:pointer;border-bottom:2px solid var(--col-bg-1-darker)}.selected-member{background:var(--col-bg-ack);color:var(--col-accent-bg-ack);font-weight:700;font-size:1.2em;cursor:default}.team-member{padding:.2em .5em}.team-member:hover{background-color:#ffffff80}.team-member:active{background-color:var(--col-bg-ack)}';
  var qu = Object.defineProperty, Yu = Object.getOwnPropertyDescriptor, Wu = Object.getPrototypeOf, Gu = Reflect.get, Ku = (r, e, t, o) => {
    for (var i = o > 1 ? void 0 : o ? Yu(e, t) : e, a = r.length - 1, n; a >= 0; a--)
      (n = r[a]) && (i = (o ? n(e, t, i) : n(i)) || i);
    return o && i && qu(e, t, i), i;
  }, Xu = (r, e, t) => Gu(Wu(r), t, e);
  let Be = class extends z {
    constructor() {
      super(), this.login_token = "", this.api_url = "", this.selected_date = null, this.selected_member = "", this.team = [], this.fetching_data = !1, this.fetch_error = "";
    }
    fetch_team() {
      this.fetching_data = !0;
      const r = (this.selected_date.getMonth() + 1).toString().padStart(2, "0"), e = this.selected_date.getDate().toString().padStart(2, "0"), o = `${this.selected_date.getFullYear()}-${r}-${e}`;
      this.apiContext.fetchFromApi(
        "",
        "cql/query",
        {
          method: "POST",
          caller: "teamselector.fetch_team",
          body: JSON.stringify(
            {
              cql: {
                meta: {
                  version: 0.1
                },
                base: {
                  scope: {
                    unit: "browse()"
                  },
                  target: {
                    field_or_instruction: "modified",
                    format: "datetime(date)"
                  },
                  additional_fields: {
                    modified_by: {
                      field_or_instruction: "replfield_modified_by()",
                      default: "?"
                    }
                  }
                },
                query: {
                  type: "Raw",
                  distinct: !0,
                  columns: {
                    member: {
                      source_field: "modified_by"
                    }
                  },
                  conditions: {
                    "?": `equals(data, "${o}")`
                  }
                }
              }
            }
          )
        }
      ).then((i) => {
        i.result_msg !== "ok" ? this.fetch_error = i.result_msg : (this.fetch_error = "", this.parse_records(i.records)), this.fetching_data = !1;
      }).catch((i) => {
        J(this, i, "teamselector.fetch_data", null);
      });
    }
    parse_records(r) {
      this.team = [], r.forEach((e) => {
        this.team.push(e.member);
      }), this.team.indexOf(this.selected_member) == -1 && this.changeSelection("");
    }
    changeSelection(r) {
      X.dispatch(Ne("teamSelector", { selectedMember: r }));
    }
    stateChanged(r) {
      if ("dateSelector" in r.selectors) {
        let e = r.selectors.dateSelector.selectedDate;
        (!this.selected_date || e.getTime() !== this.selected_date.getTime()) && (this.selected_date = e, this.fetch_team());
      }
      if ("teamSelector" in r.selectors) {
        let e = r.selectors.teamSelector.selectedMember;
        (!this.selected_member || e !== this.selected_member) && (this.selected_member = e);
      }
    }
    memberClicked(r) {
      const e = r.currentTarget.getAttribute("member");
      e != this.selected_member && this.changeSelection(e);
    }
    apiRender() {
      return h`
                <div class="team-selector">
                ${this.selected_date !== null ? this.render_team() : h`Please select a date`}
                </div>`;
    }
    render_team() {
      return this.fetching_data ? h`fetching data...` : h`
                        <div class="member"
                             member=""
                             @click=${this.memberClicked}>
                            <i class="fa fa-trash"></i>
                        </div>

                        ${this.team.map(
        (r) => h`
                            <div class="team-member ${r == this.selected_member ? "selected-member" : ""}"
                                 member="${r}"
                                  
                                 @click=${this.memberClicked}>
                                ${r}
                            </div>`
      )}`;
    }
    firstUpdated(r) {
      super.firstUpdated(r);
    }
  };
  Be.styles = H(Vu);
  Be.properties = {
    ...Xu(Be, Be, "properties"),
    selected_member: { type: String },
    selected_date: { type: Date },
    fetching_data: { type: Boolean }
  };
  Be = Ku([
    W("team-selector")
  ], Be);
  var Ju = Object.defineProperty, Qu = Object.getOwnPropertyDescriptor, Zu = (r, e, t, o) => {
    for (var i = o > 1 ? void 0 : o ? Qu(e, t) : e, a = r.length - 1, n; a >= 0; a--)
      (n = r[a]) && (i = (o ? n(e, t, i) : n(i)) || i);
    return o && i && Ju(e, t, i), i;
  };
  let co = class extends z {
    constructor() {
      super();
    }
    firstUpdated(r) {
      super.firstUpdated(r);
    }
    updated(r) {
      super.updated(r), r.has("apiContext") && this.apiContext;
    }
    renderSelectors() {
      return h`
            <date-selector .apiContext="${this.apiContext}"></date-selector>
            <context-selector .apiContext="${this.apiContext}"></context-selector>
            <team-selector .apiContext="${this.apiContext}"></team-selector>
        `;
    }
    apiRender() {
      return this.renderSelectors();
    }
    // onAfterEnter(location: any, commands: any, router: any) {
    //     console.log("OnAfterEnter", location, commands, router);
    //     // this._installSyncEvents();
    // }
  };
  co.styles = H(Fs);
  co = Zu([
    W("selection-frame")
  ], co);
  const eh = ".col-bg-body-lighter{background-color:var(--col-bg-body-lighter)}.col-bg-body{background-color:var(--col-bg-body)}.col-bg-body-darker{background-color:var(--col-bg-body-darker)}.col-bg-1-lighter{background-color:var(--col-bg-1-lighter)}.col-bg-1{background-color:var(--col-bg-1)}.col-bg-1-darker{background-color:var(--col-bg-1-darker)}.col-bg-1-input{background-color:var(--col-bg-1-input)}.col-primary-bg-1{background-color:var(--col-primary-bg-1)}.col-accent-bg-1{background-color:var(--col-accent-bg-1)}.col-success-bg-1{background-color:var(--col-success-bg-1)}.col-warning-bg-1{background-color:var(--col-warning-bg-1)}.col-error-bg-1{background-color:var(--col-error-bg-1)}.col-bg-2-lighter{background-color:var(--col-bg-2-lighter)}.col-bg-2{background-color:var(--col-bg-2)}.col-bg-2-darker{background-color:var(--col-bg-2-darker)}.col-bg-2-button{background-color:var(--col-bg-2-button)}.col-bg-2-input{background-color:var(--col-bg-2-input)}.col-primary-bg-2{background-color:var(--col-primary-bg-2)}.col-accent-bg-2{background-color:var(--col-accent-bg-2)}.col-success-bg-2{background-color:var(--col-success-bg-2)}.col-warning-bg-2{background-color:var(--col-warning-bg-2)}.col-error-bg-2{background-color:var(--col-error-bg-2)}.col-bg-3-lighter{background-color:var(--col-bg-3-lighter)}.col-bg-3{background-color:var(--col-bg-3)}.col-bg-3-darker{background-color:var(--col-bg-3-darker)}.col-bg-3-button{background-color:var(--col-bg-3-button)}.col-bg-3-input{background-color:var(--col-bg-3-input)}.col-primary-bg-3{background-color:var(--col-primary-bg-3)}.col-accent-bg-3{background-color:var(--col-accent-bg-3)}.col-success-bg-3{background-color:var(--col-success-bg-3)}.col-warning-bg-3{background-color:var(--col-warning-bg-3)}.col-error-bg-3{background-color:var(--col-error-bg-3)}.col-bg-ack-lighter{background-color:var(--col-bg-ack-lighter)}.col-bg-ack{background-color:var(--col-bg-ack)}.col-bg-ack-darker{background-color:var(--col-bg-ack-darker)}.col-primary-bg-ack{background-color:var(--col-primary-bg-ack)}.col-accent-bg-ack{background-color:var(--col-accent-bg-ack)}.col-bg-att-lighter{background-color:var(--col-bg-att-lighter)}.col-bg-att{background-color:var(--col-bg-att)}.col-bg-att-darker{background-color:var(--col-bg-att-darker)}.col-primary-bg-att{background-color:var(--col-primary-bg-att)}.col-accent-bg-att{background-color:var(--col-accent-bg-att)}.col-bg-alert-lighter{background-color:var(--col-bg-alert-lighter)}.col-bg-alert{background-color:var(--col-bg-alert)}.col-bg-alert-darker{background-color:var(--col-bg-alert-darker)}.col-primary-bg-alert{background-color:var(--col-primary-bg-alert)}.col-accent-bg-alert{background-color:var(--col-accent-bg-alert)}.col-bg-btn-lighter{background-color:var(--col-bg-btn-lighter)}.col-bg-btn{background-color:var(--col-bg-btn)}.col-bg-btn-darker{background-color:var(--col-bg-btn-darker)}.col-primary-bg-btn{background-color:var(--col-primary-bg-btn)}.col-accent-bg-btn{background-color:var(--col-accent-bg-btn)}.pattern-diagonal-stripes-sm{background:repeating-linear-gradient(45deg,transparent,transparent 10px,currentColor 10px,currentColor 20px)}.pattern-dots-lg{background-image:radial-gradient(currentColor 1.5px,transparent 1.5px);background-size:15px 15px}.pattern-dots-md{background-image:radial-gradient(currentColor 1px,transparent 1px);background-size:8px 8px}.pattern-dots-medium-dense{background-image:radial-gradient(currentColor .5px,transparent .5px);background-size:3px 3px}.pattern-dots-sm{background-image:radial-gradient(currentColor .5px,transparent .5px);background-size:5px 5px}.pattern-cross-dots-md,.imagelist-background{background-image:radial-gradient(currentColor .7px,transparent 1px),radial-gradient(currentColor .7px,transparent 1px);background-size:6.5px 6.5px;background-position:0 0,3.5px 3.5px}.imagelist-background{background-color:#fff9;background-blend-mode:overlay}p,div{padding:0;margin:0;border:0px;-webkit-user-select:text;user-select:text}select{-webkit-user-select:none;user-select:none}div,p{font-family:var(--standard-text-font)}:host{display:flex;flex-direction:row;flex-wrap:wrap;justify-content:space-between;padding-top:1em;width:100%;box-sizing:border-box}@media only screen and (max-width : 800px){:host{justify-content:left}:host>*{margin-right:1em}}locus-widget,file-widget,narrative-widget,cm-widget,feature-widget{margin-bottom:1em}unit-info-widget{width:100%;margin-bottom:2em}", th = '.col-bg-body-lighter{background-color:var(--col-bg-body-lighter)}.col-bg-body{background-color:var(--col-bg-body)}.col-bg-body-darker{background-color:var(--col-bg-body-darker)}.col-bg-1-lighter{background-color:var(--col-bg-1-lighter)}.col-bg-1{background-color:var(--col-bg-1)}.col-bg-1-darker{background-color:var(--col-bg-1-darker)}.col-bg-1-input{background-color:var(--col-bg-1-input)}.col-primary-bg-1{background-color:var(--col-primary-bg-1)}.col-accent-bg-1{background-color:var(--col-accent-bg-1)}.col-success-bg-1{background-color:var(--col-success-bg-1)}.col-warning-bg-1{background-color:var(--col-warning-bg-1)}.col-error-bg-1{background-color:var(--col-error-bg-1)}.col-bg-2-lighter{background-color:var(--col-bg-2-lighter)}.col-bg-2{background-color:var(--col-bg-2)}.col-bg-2-darker{background-color:var(--col-bg-2-darker)}.col-bg-2-button{background-color:var(--col-bg-2-button)}.col-bg-2-input{background-color:var(--col-bg-2-input)}.col-primary-bg-2{background-color:var(--col-primary-bg-2)}.col-accent-bg-2{background-color:var(--col-accent-bg-2)}.col-success-bg-2{background-color:var(--col-success-bg-2)}.col-warning-bg-2{background-color:var(--col-warning-bg-2)}.col-error-bg-2{background-color:var(--col-error-bg-2)}.col-bg-3-lighter{background-color:var(--col-bg-3-lighter)}.col-bg-3{background-color:var(--col-bg-3)}.col-bg-3-darker{background-color:var(--col-bg-3-darker)}.col-bg-3-button{background-color:var(--col-bg-3-button)}.col-bg-3-input{background-color:var(--col-bg-3-input)}.col-primary-bg-3{background-color:var(--col-primary-bg-3)}.col-accent-bg-3{background-color:var(--col-accent-bg-3)}.col-success-bg-3{background-color:var(--col-success-bg-3)}.col-warning-bg-3{background-color:var(--col-warning-bg-3)}.col-error-bg-3{background-color:var(--col-error-bg-3)}.col-bg-ack-lighter{background-color:var(--col-bg-ack-lighter)}.col-bg-ack{background-color:var(--col-bg-ack)}.col-bg-ack-darker{background-color:var(--col-bg-ack-darker)}.col-primary-bg-ack{background-color:var(--col-primary-bg-ack)}.col-accent-bg-ack{background-color:var(--col-accent-bg-ack)}.col-bg-att-lighter{background-color:var(--col-bg-att-lighter)}.col-bg-att{background-color:var(--col-bg-att)}.col-bg-att-darker{background-color:var(--col-bg-att-darker)}.col-primary-bg-att{background-color:var(--col-primary-bg-att)}.col-accent-bg-att{background-color:var(--col-accent-bg-att)}.col-bg-alert-lighter{background-color:var(--col-bg-alert-lighter)}.col-bg-alert{background-color:var(--col-bg-alert)}.col-bg-alert-darker{background-color:var(--col-bg-alert-darker)}.col-primary-bg-alert{background-color:var(--col-primary-bg-alert)}.col-accent-bg-alert{background-color:var(--col-accent-bg-alert)}.col-bg-btn-lighter{background-color:var(--col-bg-btn-lighter)}.col-bg-btn{background-color:var(--col-bg-btn)}.col-bg-btn-darker{background-color:var(--col-bg-btn-darker)}.col-primary-bg-btn{background-color:var(--col-primary-bg-btn)}.col-accent-bg-btn{background-color:var(--col-accent-bg-btn)}.pattern-diagonal-stripes-sm{background:repeating-linear-gradient(45deg,transparent,transparent 10px,currentColor 10px,currentColor 20px)}.pattern-dots-lg{background-image:radial-gradient(currentColor 1.5px,transparent 1.5px);background-size:15px 15px}.pattern-dots-md{background-image:radial-gradient(currentColor 1px,transparent 1px);background-size:8px 8px}.pattern-dots-medium-dense{background-image:radial-gradient(currentColor .5px,transparent .5px);background-size:3px 3px}.pattern-dots-sm{background-image:radial-gradient(currentColor .5px,transparent .5px);background-size:5px 5px}.pattern-cross-dots-md,.imagelist-background{background-image:radial-gradient(currentColor .7px,transparent 1px),radial-gradient(currentColor .7px,transparent 1px);background-size:6.5px 6.5px;background-position:0 0,3.5px 3.5px}.imagelist-background{background-color:#fff9;background-blend-mode:overlay}p,div{padding:0;margin:0;border:0px;-webkit-user-select:text;user-select:text}select{-webkit-user-select:none;user-select:none}.fa,.fas{font-family:"Font Awesome 5 Free";font-weight:900;font-style:normal}.fa-trash:before{content:""}.fa-view-grid:before{content:""}.fa-view-list:before{content:""}.fa-camera:before{content:""}.fa-view-image:before{content:""}.fa-check:before{content:""}.fa-exclamation-circle:before{content:""}.list-header{position:sticky;z-index:1;top:0}:host{max-height:45vh;background-color:var(--col-bg-body);display:block;border:solid 2px var(--col-bg-1-darker)}div,p{font-family:var(--standard-text-font)}.unit-list{display:grid;overflow-y:scroll;height:100%;max-height:calc(45vh - 2em);grid-row-gap:5px;grid-template-rows:[header] auto;grid-template-columns:repeat(6,auto);border-top:solid var(--col-bg-1-darker) 2px}.unit-list div{padding-right:1em}.list-header{background-color:var(--col-bg-1-lighter);color:var(--col-primary-bg-1);font-weight:700;padding-top:1em;border-bottom:solid var(--col-bg-1-darker) 1px}.list-identifier{cursor:pointer;text-decoration:underline}.headline{background-color:var(--col-bg-1-lighter);color:var(--col-primary-bg-1);padding:2px;font-weight:700}.controls{display:flex;flex-direction:row;background-color:var(--col-bg-1-lighter);color:var(--col-primary-bg-1);padding:2px;font-weight:700;justify-content:space-between}.no-data{padding:2px}#sort-type-selector{padding-right:1em}.center-col{display:flex;justify-content:center}';
  var rh = Object.defineProperty, oh = Object.getOwnPropertyDescriptor, ih = Object.getPrototypeOf, ah = Reflect.get, nh = (r, e, t, o) => {
    for (var i = o > 1 ? void 0 : o ? oh(e, t) : e, a = r.length - 1, n; a >= 0; a--)
      (n = r[a]) && (i = (o ? n(e, t, i) : n(i)) || i);
    return o && i && rh(e, t, i), i;
  }, sh = (r, e, t) => ah(ih(r), t, e);
  class lh {
  }
  let je = class extends z {
    constructor() {
      super(), this.selected_date = null, this.selected_context = "", this.selected_context_uid = "", this.units = [], this.fetching = !1, this.fetch_error = "", this.unitCount = 0, this.term_for_unit = "unit", this.term_for_supervisor = "supervisor", this.selected_sort = "identifier", this.sort_by = {
        identifier: ["identifier", "modified"],
        creation: ["created", "identifier"]
      };
    }
    get_conditions(r) {
      return ` identifier = '${r}'`;
    }
    fetch_data() {
      this.fetching = !0;
      const r = `
            primary_identifier, identifier, id_site, id_excavator, purpose, created, modified_by, modified_date, type, method 
            from {base} where ${this.get_conditions(this.selected_context)}  
        `, e = {
        cql: {
          base: {
            scope: {
              unit: {}
            },
            target: {
              field_or_instruction: "replfield_modified()"
            },
            additional_fields: {
              modified_date: {
                field_or_instruction: "replfield_modified()",
                default: "",
                format: "datetime(date)"
              },
              modified_by: {
                field_or_instruction: "replfield_modified_by()",
                default: ""
              },
              modified_timestamp: {
                field_or_instruction: "replfield_modified()",
                default: ""
              },
              created: {
                field_or_instruction: "replfield_created()",
                default: "null",
                format: "datetime(date)"
              },
              type: {
                field_or_instruction: "type",
                default: "null"
              },
              method: {
                field_or_instruction: "method",
                default: "null"
              },
              purpose: {
                field_or_instruction: "purpose",
                default: "null"
              },
              id_site: {
                field_or_instruction: "id_site",
                default: "null"
              },
              id_excavator: {
                field_or_instruction: "id_excavator",
                default: "null"
              }
            }
          },
          meta: {
            version: 0.1
          },
          query: {
            type: "DirectSqlQuery",
            sql: r
          }
        }
      };
      this.apiContext.fetchFromApi(
        "",
        "cql/query",
        {
          method: "POST",
          caller: "unit-info-widget.fetch_data",
          body: JSON.stringify(e)
        }
      ).then((t) => {
        t.result_msg !== "ok" ? this.fetch_error = t.result_msg : (this.fetch_error = "", this.load_records(t.records)), this.fetching = !1;
      }).catch((t) => {
        J(this, t, "unit-info-widget.fetch_data", null);
      });
    }
    load_records(r) {
      this.units = [];
      let e = {};
      r.forEach((t) => {
        const o = t.primary_identifier;
        let i;
        o in e ? i = e[o] : (i = new lh(), e[o] = i, this.units.push(i), i.id_excavator = "", i.purpose = "", i.id_site = "?", i.method = "?", i.type = "?", i.modified = 0, i.created = 0, i.unit_creation = "?"), i.identifier = t.primary_identifier, t.modified > i.modified && (i.modified = t.modified), t.type && (i.type = t.type), t.method && (i.method = t.method), t.id_site && (i.id_site = t.id_site), t.id_excavator && (i.id_excavator = t.id_excavator), t.purpose && (i.purpose = t.purpose), t.created && (i.unit_creation = ae(t.created).toLocaleDateString(), i.created = ae(t.created).getTime());
      }), this.unitCount = Object.keys(this.units).length;
    }
    // sort_records(sort_by: Array<string>) {
    //     function _sort(a: UnitRecord, b: UnitRecord): number {
    //         for (let i = 0; i < sort_by.length; i++) {
    //             let attrib: string = sort_by[i];
    //             let value_a = a[attrib as keyof UnitRecord]
    //             let value_b = b[attrib as keyof UnitRecord]
    //             let result: number = 0
    //
    //             if (typeof (value_a) === "string") {
    //                 result = (<string>value_a).localeCompare((<string>value_b))
    //             } else {
    //                 if (value_a < value_b) result = -1
    //                 if (value_a > value_b) result = 1
    //             }
    //
    //             if (result != 0)
    //                 return result
    //         }
    //         return 0
    //     }
    //     // console.log(`sorting loci by ${this.sort_by[this.selected_sort]}`)
    //     this.units.sort(_sort)
    //     this.requestUpdate();
    // }
    // protected changeContext(context: string) {
    //     store.dispatch(setSelector("contextSelector", {"selectedContext": context}))
    // }
    stateChanged(r) {
      if (this.fetch_error)
        return h`Error fetching: ${this.fetch_error}`;
      if (r.initState == 0)
        return;
      let e = !1;
      if (r.selectors.hasOwnProperty("contextSelector")) {
        let t = r.selectors.contextSelector.selectedContext;
        t !== this.selected_context && (this.selected_context = t, this.selected_context_uid = r.selectors.contextSelector.selectedUid, e = !0);
      }
      e && this.fetch_data(), r.constants.length > 0 && (this.term_for_unit = de(
        r.constants,
        "label_for_unit_on_start_page",
        !1,
        this.term_for_unit
      ).replace("\r", " or "), this.term_for_supervisor = de(
        r.constants,
        "label_supervisor",
        !1,
        this.term_for_supervisor
      ));
    }
    get_unit_term() {
      return this.term_for_unit;
    }
    apiRender() {
      return h`
            <div class="unit-info-widget">
                <div class="headline">
                    ${this.selected_context ? void 0 : h`<p>Please select a ${this.get_unit_term()} to see its information</p>`}
                    ${this.unitCount == 1 ? h`<p>information for ${this.units[0].identifier}</p>` : void 0}
                </div>            
                ${this.unitCount == 1 ? this.render_widget() : h`<p></p>`}
            </div>`;
    }
    render_widget() {
      return this.fetching ? h`fetching data ...` : this.unitCount == 0 ? h`
                    <div class="no-loci">
                        <p>No data found for your selection</p>
                    </div>` : h`
                <div class="unit-list">
                    <div class="list-header">site</div>
                    <div class="list-header">creation</div>
                    <div class="list-header">type</div>
                    <div class="list-header">method</div>
                    <div class="list-header">${this.term_for_supervisor}</div>
                    <div class="list-header">purpose</div>
                    ${this.units.map(
        (r) => h`
                        <div>${r.id_site}</div>
                        <div>${r.unit_creation}</div>
                        <div>${r.type}</div>
                        <div>${r.method}</div>
                        <div>${r.id_excavator}</div>
                        <div>${r.purpose}</div>`
      )}
                </div>`;
    }
  };
  je.styles = H(th);
  je.properties = {
    ...sh(je, je, "properties"),
    selected_context: { type: String },
    selected_date: { type: Date },
    fetching: { type: Boolean },
    sort_by: { type: Array },
    term_for_unit: { type: String },
    term_for_supervisor: { type: String }
  };
  je = nh([
    W("unit-info-widget")
  ], je);
  const ch = ".col-bg-body-lighter{background-color:var(--col-bg-body-lighter)}.col-bg-body{background-color:var(--col-bg-body)}.col-bg-body-darker{background-color:var(--col-bg-body-darker)}.col-bg-1-lighter{background-color:var(--col-bg-1-lighter)}.col-bg-1{background-color:var(--col-bg-1)}.col-bg-1-darker{background-color:var(--col-bg-1-darker)}.col-bg-1-input{background-color:var(--col-bg-1-input)}.col-primary-bg-1{background-color:var(--col-primary-bg-1)}.col-accent-bg-1{background-color:var(--col-accent-bg-1)}.col-success-bg-1{background-color:var(--col-success-bg-1)}.col-warning-bg-1{background-color:var(--col-warning-bg-1)}.col-error-bg-1{background-color:var(--col-error-bg-1)}.col-bg-2-lighter{background-color:var(--col-bg-2-lighter)}.col-bg-2{background-color:var(--col-bg-2)}.col-bg-2-darker{background-color:var(--col-bg-2-darker)}.col-bg-2-button{background-color:var(--col-bg-2-button)}.col-bg-2-input{background-color:var(--col-bg-2-input)}.col-primary-bg-2{background-color:var(--col-primary-bg-2)}.col-accent-bg-2{background-color:var(--col-accent-bg-2)}.col-success-bg-2{background-color:var(--col-success-bg-2)}.col-warning-bg-2{background-color:var(--col-warning-bg-2)}.col-error-bg-2{background-color:var(--col-error-bg-2)}.col-bg-3-lighter{background-color:var(--col-bg-3-lighter)}.col-bg-3{background-color:var(--col-bg-3)}.col-bg-3-darker{background-color:var(--col-bg-3-darker)}.col-bg-3-button{background-color:var(--col-bg-3-button)}.col-bg-3-input{background-color:var(--col-bg-3-input)}.col-primary-bg-3{background-color:var(--col-primary-bg-3)}.col-accent-bg-3{background-color:var(--col-accent-bg-3)}.col-success-bg-3{background-color:var(--col-success-bg-3)}.col-warning-bg-3{background-color:var(--col-warning-bg-3)}.col-error-bg-3{background-color:var(--col-error-bg-3)}.col-bg-ack-lighter{background-color:var(--col-bg-ack-lighter)}.col-bg-ack{background-color:var(--col-bg-ack)}.col-bg-ack-darker{background-color:var(--col-bg-ack-darker)}.col-primary-bg-ack{background-color:var(--col-primary-bg-ack)}.col-accent-bg-ack{background-color:var(--col-accent-bg-ack)}.col-bg-att-lighter{background-color:var(--col-bg-att-lighter)}.col-bg-att{background-color:var(--col-bg-att)}.col-bg-att-darker{background-color:var(--col-bg-att-darker)}.col-primary-bg-att{background-color:var(--col-primary-bg-att)}.col-accent-bg-att{background-color:var(--col-accent-bg-att)}.col-bg-alert-lighter{background-color:var(--col-bg-alert-lighter)}.col-bg-alert{background-color:var(--col-bg-alert)}.col-bg-alert-darker{background-color:var(--col-bg-alert-darker)}.col-primary-bg-alert{background-color:var(--col-primary-bg-alert)}.col-accent-bg-alert{background-color:var(--col-accent-bg-alert)}.col-bg-btn-lighter{background-color:var(--col-bg-btn-lighter)}.col-bg-btn{background-color:var(--col-bg-btn)}.col-bg-btn-darker{background-color:var(--col-bg-btn-darker)}.col-primary-bg-btn{background-color:var(--col-primary-bg-btn)}.col-accent-bg-btn{background-color:var(--col-accent-bg-btn)}.pattern-diagonal-stripes-sm{background:repeating-linear-gradient(45deg,transparent,transparent 10px,currentColor 10px,currentColor 20px)}.pattern-dots-lg{background-image:radial-gradient(currentColor 1.5px,transparent 1.5px);background-size:15px 15px}.pattern-dots-md{background-image:radial-gradient(currentColor 1px,transparent 1px);background-size:8px 8px}.pattern-dots-medium-dense{background-image:radial-gradient(currentColor .5px,transparent .5px);background-size:3px 3px}.pattern-dots-sm{background-image:radial-gradient(currentColor .5px,transparent .5px);background-size:5px 5px}.pattern-cross-dots-md,.imagelist-background{background-image:radial-gradient(currentColor .7px,transparent 1px),radial-gradient(currentColor .7px,transparent 1px);background-size:6.5px 6.5px;background-position:0 0,3.5px 3.5px}.imagelist-background{background-color:#fff9;background-blend-mode:overlay}p,div{padding:0;margin:0;border:0px;-webkit-user-select:text;user-select:text}select{-webkit-user-select:none;user-select:none}:host{max-width:45vw;background-color:var(--col-bg-body);display:block;border:solid 2px var(--col-bg-1-darker);overflow-y:hidden;padding-bottom:.5em}div,p{font-family:var(--standard-text-font)}.narrative-list{overflow-y:scroll;height:100%;width:100%;max-height:35vh}.headline{background-color:var(--col-bg-1-lighter);color:var(--col-primary-bg-1);padding:2px;font-weight:700}.controls{display:flex;flex-direction:row;background-color:var(--col-bg-1-lighter);color:var(--col-primary-bg-1);padding:2px;font-weight:700;justify-content:space-between}.no-narratives{padding:2px}.narrative{font-family:var(--standard-text-font);padding:.2em;border-bottom:var(--col-bg-1-darker) 2px solid}.narrative-headline{display:flex;flex-direction:row;justify-content:space-between;font-weight:700}";
  var dh = Object.defineProperty, uh = Object.getOwnPropertyDescriptor, hh = Object.getPrototypeOf, ph = Reflect.get, gh = (r, e, t, o) => {
    for (var i = o > 1 ? void 0 : o ? uh(e, t) : e, a = r.length - 1, n; a >= 0; a--)
      (n = r[a]) && (i = (o ? n(e, t, i) : n(i)) || i);
    return o && i && dh(e, t, i), i;
  }, fh = (r, e, t) => ph(hh(r), t, e);
  class bh {
  }
  let Ue = class extends z {
    constructor() {
      super(), this.selected_date = null, this.selected_context = "", this.selected_member = "", this.narratives = [], this.fetching = !1, this.fetch_error = "", this.record_types = /* @__PURE__ */ new Set(), this.show_record_types = "", this.record_type_names = null, this.sort_by = ["domain_identifier", "identifier", "modified"], this.record_count = 0, this.page_size = 0;
    }
    get_conditions(r, e, t) {
      if (e || t) {
        let o = [`equals(modified_date, ${r})`];
        return e && o.push(`equals(domain_identifier, '${e}')`), t && o.push(`equals(modified_by, '${t}')`), {
          AND: o
        };
      } else
        return {
          "?": `equals(modified_date, ${r})`
        };
    }
    fetch_data() {
      this.fetching = !0;
      const r = ot(this.selected_date);
      this.apiContext.fetchFromApi(
        "",
        "cql/query",
        {
          method: "POST",
          caller: "narrativewidget.fetch_data",
          body: JSON.stringify(
            {
              cql: {
                base: {
                  scope: {
                    unit: {
                      unit_narrative: {
                        join: "inner(uid, uid_unit)"
                      },
                      locus: {
                        collected_material: {}
                      }
                    }
                  },
                  target: {
                    field_or_instruction: "record_description()"
                  },
                  additional_fields: {
                    modified_date: {
                      field_or_instruction: "replfield_modified()",
                      default: "",
                      format: "datetime(date)"
                    },
                    modified_by: {
                      field_or_instruction: "replfield_modified_by()",
                      default: ""
                    },
                    modified_timestamp: {
                      field_or_instruction: "modified",
                      default: ""
                    },
                    id_excavator: {
                      field_or_instruction: "replfield_modified_by()",
                      default: ""
                    }
                  }
                },
                meta: {
                  version: 0.1
                },
                query: {
                  columns: {
                    domain_identifier: {
                      source_field: "identifier"
                    },
                    identifier: {
                      source_field: "primary_identifier"
                    },
                    modified_date: {
                      source_field: "modified_date"
                    },
                    modified_timestamp: {
                      source_field: "modified_timestamp"
                    },
                    modified_by: {
                      source_field: "id_excavator"
                    },
                    record_type: {
                      source_field: "record_type"
                    },
                    narrative: {
                      source_field: "data"
                    }
                  },
                  conditions: this.get_conditions(r, this.selected_context, this.selected_member),
                  distinct: "True",
                  type: "Raw"
                }
              }
            }
          )
        },
        "v1"
      ).then((e) => {
        e.result_msg !== "ok" ? this.fetch_error = e.result_msg : (this.fetch_error = "", this.record_count = e.overall_record_count, this.page_size = e.page_size, this.load_narratives(e.records)), this.fetching = !1;
      }).catch((e) => {
        J(this, e, "narrativeWidget.fetch_data", null);
      });
    }
    load_narratives(r) {
      this.narratives = [], r.forEach((e) => {
        let t = new bh();
        t.identifier = e.identifier, t.domain_identifier = e.domain_identifier, t.modified_by = e.modified_by ? e.modified_by : "?", t.modified = new Date(e.modified_timestamp), t.narrative = e.narrative, t.record_type = e.record_type, this.record_types.add(t.record_type), this.narratives.push(t);
      }), this.sort_records(this.sort_by);
    }
    sort_records(r) {
      function e(t, o) {
        for (let i = 0; i < r.length; i++) {
          let a = r[i], n = t[a], s = o[a], l = 0;
          if (typeof n == "string" ? l = n.localeCompare(s) : (n < s && (l = -1), n > s && (l = 1)), l != 0)
            return l;
        }
        return 0;
      }
      this.narratives.sort(e), this.requestUpdate();
    }
    // protected changeContext(context: string) {
    //     store.dispatch(setSelector("contextSelector", {"selectedContext": context}))
    // }
    stateChanged(r) {
      if (this.fetch_error)
        return h`Error fetching: ${this.fetch_error}`;
      if (r.initState == 0)
        return;
      let e = !1;
      if ("dateSelector" in r.selectors) {
        let t = r.selectors.dateSelector.selectedDate;
        if ((!this.selected_date || t.getTime() !== this.selected_date.getTime()) && (this.selected_date = t, e = !0), "contextSelector" in r.selectors) {
          let o = r.selectors.contextSelector.selectedContext;
          o !== this.selected_context && (this.selected_context = o, e = !0);
        }
        if ("teamSelector" in r.selectors) {
          let o = r.selectors.teamSelector.selectedMember;
          o !== this.selected_member && (this.selected_member = o, e = !0);
        }
        e && this.fetch_data();
      }
      r.constants.length > 0 && !this.record_type_names && (this.record_type_names = _a(r.constants), e || this.requestUpdate());
    }
    apiRender() {
      const r = this.narratives.filter((e) => this.show_record_types === "" || e.record_type === this.show_record_types).length;
      return h`
                    <div class="narrative-widget">
                        <div class="headline">
                            <p>${r} ${this.record_count ? " of " + this.record_count : void 0} Narrative(s)</p>
                        </div>
                        <div class="controls">
                            <div class="controls-left">
                                ${this.renderRecordTypeSelector()}
                            </div>
                        </div>
                        ${this.selected_date !== null ? this.render_widget() : h`Please select a date`}
                    </div>`;
    }
    renderRecordTypeSelector() {
      if (!this.selected_date)
        return h``;
      let r = Array.from(this.record_types);
      r.push(" all"), r.sort();
      let e = this.show_record_types == "" ? " all" : this.show_record_types;
      return h`
            <label for="record-type-selector">record type</label>
            <select name="record-type-selector" id="record-type-selector" @change="${this.recordTypeChanged}">
                ${r.map(
        (t) => h`
                            <option value="${t}"
                                    ?selected="${e === t}">
                                ${_t(this.record_type_names, t)}
                            </option>
                        `
      )}
            </select>
        `;
    }
    recordTypeChanged(r) {
      const e = r.currentTarget.value;
      e === " all" ? this.show_record_types = "" : this.show_record_types = e;
    }
    render_widget() {
      return this.selected_date ? this.fetching ? h`fetching data ...` : this.narratives.length == 0 ? h`
                    <div class="no-narratives">
                        <p>No narratives found for your selection</p>
                    </div>` : h`
                <div class="narrative-list">
                    ${this.narratives.map(
        (r) => h`${this.show_record_types === "" || r.record_type === this.show_record_types ? h`
                                        <div class="narrative">
                                            ${this.show_record_types === "" ? h`
                                                        <div class="narrative-headline">
                                                            <p>
                                                                ${_t(this.record_type_names, r.record_type)}</p>
                                                        </div>` : void 0}
                                            <div class="narrative-headline">
                                                <p>
                                                    ${this.selected_context ? void 0 : h`${r.domain_identifier}/`}
                                                    ${r.identifier}</p>
                                                <p>by: ${r.modified_by}
                                                        (${r.modified.toLocaleTimeString(
          [],
          { hour: "2-digit", minute: "2-digit" }
        )})</p>
                                            </div>
                                            <div class="narrative-body">
                                                ${r.narrative}
                                            </div>
                                        </div>` : void 0}`
      )}
                </div>` : h`please select a date`;
    }
  };
  Ue.styles = H(ch);
  Ue.properties = {
    ...fh(Ue, Ue, "properties"),
    selected_context: { type: String },
    selected_date: { type: Date },
    selected_member: { type: String },
    fetching: { type: Boolean },
    sort_by: { type: Array },
    show_record_types: { type: String }
  };
  Ue = gh([
    W("narrative-widget")
  ], Ue);
  var R = "top", q = "bottom", Y = "right", F = "left", zo = "auto", Rt = [R, q, Y, F], Ze = "start", Nt = "end", mh = "clippingParents", Nn = "viewport", ft = "popper", _h = "reference", Qi = /* @__PURE__ */ Rt.reduce(function(r, e) {
    return r.concat([e + "-" + Ze, e + "-" + Nt]);
  }, []), zn = /* @__PURE__ */ [].concat(Rt, [zo]).reduce(function(r, e) {
    return r.concat([e, e + "-" + Ze, e + "-" + Nt]);
  }, []), vh = "beforeRead", yh = "read", kh = "afterRead", xh = "beforeMain", wh = "main", Ch = "afterMain", Ah = "beforeWrite", Eh = "write", Ph = "afterWrite", Sh = [vh, yh, kh, xh, wh, Ch, Ah, Eh, Ph];
  function ee(r) {
    return r ? (r.nodeName || "").toLowerCase() : null;
  }
  function U(r) {
    if (r == null)
      return window;
    if (r.toString() !== "[object Window]") {
      var e = r.ownerDocument;
      return e && e.defaultView || window;
    }
    return r;
  }
  function Ae(r) {
    var e = U(r).Element;
    return r instanceof e || r instanceof Element;
  }
  function V(r) {
    var e = U(r).HTMLElement;
    return r instanceof e || r instanceof HTMLElement;
  }
  function Lo(r) {
    if (typeof ShadowRoot > "u")
      return !1;
    var e = U(r).ShadowRoot;
    return r instanceof e || r instanceof ShadowRoot;
  }
  function Th(r) {
    var e = r.state;
    Object.keys(e.elements).forEach(function(t) {
      var o = e.styles[t] || {}, i = e.attributes[t] || {}, a = e.elements[t];
      !V(a) || !ee(a) || (Object.assign(a.style, o), Object.keys(i).forEach(function(n) {
        var s = i[n];
        s === !1 ? a.removeAttribute(n) : a.setAttribute(n, s === !0 ? "" : s);
      }));
    });
  }
  function Dh(r) {
    var e = r.state, t = {
      popper: {
        position: e.options.strategy,
        left: "0",
        top: "0",
        margin: "0"
      },
      arrow: {
        position: "absolute"
      },
      reference: {}
    };
    return Object.assign(e.elements.popper.style, t.popper), e.styles = t, e.elements.arrow && Object.assign(e.elements.arrow.style, t.arrow), function() {
      Object.keys(e.elements).forEach(function(o) {
        var i = e.elements[o], a = e.attributes[o] || {}, n = Object.keys(e.styles.hasOwnProperty(o) ? e.styles[o] : t[o]), s = n.reduce(function(l, c) {
          return l[c] = "", l;
        }, {});
        !V(i) || !ee(i) || (Object.assign(i.style, s), Object.keys(a).forEach(function(l) {
          i.removeAttribute(l);
        }));
      });
    };
  }
  const Oh = {
    name: "applyStyles",
    enabled: !0,
    phase: "write",
    fn: Th,
    effect: Dh,
    requires: ["computeStyles"]
  };
  function Z(r) {
    return r.split("-")[0];
  }
  var we = Math.max, sr = Math.min, et = Math.round;
  function uo() {
    var r = navigator.userAgentData;
    return r != null && r.brands && Array.isArray(r.brands) ? r.brands.map(function(e) {
      return e.brand + "/" + e.version;
    }).join(" ") : navigator.userAgent;
  }
  function Ln() {
    return !/^((?!chrome|android).)*safari/i.test(uo());
  }
  function tt(r, e, t) {
    e === void 0 && (e = !1), t === void 0 && (t = !1);
    var o = r.getBoundingClientRect(), i = 1, a = 1;
    e && V(r) && (i = r.offsetWidth > 0 && et(o.width) / r.offsetWidth || 1, a = r.offsetHeight > 0 && et(o.height) / r.offsetHeight || 1);
    var n = Ae(r) ? U(r) : window, s = n.visualViewport, l = !Ln() && t, c = (o.left + (l && s ? s.offsetLeft : 0)) / i, d = (o.top + (l && s ? s.offsetTop : 0)) / a, u = o.width / i, p = o.height / a;
    return {
      width: u,
      height: p,
      top: d,
      right: c + u,
      bottom: d + p,
      left: c,
      x: c,
      y: d
    };
  }
  function Ro(r) {
    var e = tt(r), t = r.offsetWidth, o = r.offsetHeight;
    return Math.abs(e.width - t) <= 1 && (t = e.width), Math.abs(e.height - o) <= 1 && (o = e.height), {
      x: r.offsetLeft,
      y: r.offsetTop,
      width: t,
      height: o
    };
  }
  function Rn(r, e) {
    var t = e.getRootNode && e.getRootNode();
    if (r.contains(e))
      return !0;
    if (t && Lo(t)) {
      var o = e;
      do {
        if (o && r.isSameNode(o))
          return !0;
        o = o.parentNode || o.host;
      } while (o);
    }
    return !1;
  }
  function ne(r) {
    return U(r).getComputedStyle(r);
  }
  function $h(r) {
    return ["table", "td", "th"].indexOf(ee(r)) >= 0;
  }
  function pe(r) {
    return ((Ae(r) ? r.ownerDocument : (
      // $FlowFixMe[prop-missing]
      r.document
    )) || window.document).documentElement;
  }
  function hr(r) {
    return ee(r) === "html" ? r : (
      // this is a quicker (but less type safe) way to save quite some bytes from the bundle
      // $FlowFixMe[incompatible-return]
      // $FlowFixMe[prop-missing]
      r.assignedSlot || // step into the shadow DOM of the parent of a slotted node
      r.parentNode || // DOM Element detected
      (Lo(r) ? r.host : null) || // ShadowRoot detected
      // $FlowFixMe[incompatible-call]: HTMLElement is a Node
      pe(r)
    );
  }
  function Zi(r) {
    return !V(r) || // https://github.com/popperjs/popper-core/issues/837
    ne(r).position === "fixed" ? null : r.offsetParent;
  }
  function Mh(r) {
    var e = /firefox/i.test(uo()), t = /Trident/i.test(uo());
    if (t && V(r)) {
      var o = ne(r);
      if (o.position === "fixed")
        return null;
    }
    var i = hr(r);
    for (Lo(i) && (i = i.host); V(i) && ["html", "body"].indexOf(ee(i)) < 0; ) {
      var a = ne(i);
      if (a.transform !== "none" || a.perspective !== "none" || a.contain === "paint" || ["transform", "perspective"].indexOf(a.willChange) !== -1 || e && a.willChange === "filter" || e && a.filter && a.filter !== "none")
        return i;
      i = i.parentNode;
    }
    return null;
  }
  function Ft(r) {
    for (var e = U(r), t = Zi(r); t && $h(t) && ne(t).position === "static"; )
      t = Zi(t);
    return t && (ee(t) === "html" || ee(t) === "body" && ne(t).position === "static") ? e : t || Mh(r) || e;
  }
  function Fo(r) {
    return ["top", "bottom"].indexOf(r) >= 0 ? "x" : "y";
  }
  function kt(r, e, t) {
    return we(r, sr(e, t));
  }
  function Ih(r, e, t) {
    var o = kt(r, e, t);
    return o > t ? t : o;
  }
  function Fn() {
    return {
      top: 0,
      right: 0,
      bottom: 0,
      left: 0
    };
  }
  function Hn(r) {
    return Object.assign({}, Fn(), r);
  }
  function Bn(r, e) {
    return e.reduce(function(t, o) {
      return t[o] = r, t;
    }, {});
  }
  var Nh = function(e, t) {
    return e = typeof e == "function" ? e(Object.assign({}, t.rects, {
      placement: t.placement
    })) : e, Hn(typeof e != "number" ? e : Bn(e, Rt));
  };
  function zh(r) {
    var e, t = r.state, o = r.name, i = r.options, a = t.elements.arrow, n = t.modifiersData.popperOffsets, s = Z(t.placement), l = Fo(s), c = [F, Y].indexOf(s) >= 0, d = c ? "height" : "width";
    if (!(!a || !n)) {
      var u = Nh(i.padding, t), p = Ro(a), g = l === "y" ? R : F, b = l === "y" ? q : Y, f = t.rects.reference[d] + t.rects.reference[l] - n[l] - t.rects.popper[d], m = n[l] - t.rects.reference[l], _ = Ft(a), v = _ ? l === "y" ? _.clientHeight || 0 : _.clientWidth || 0 : 0, x = f / 2 - m / 2, y = u[g], w = v - p[d] - u[b], C = v / 2 - p[d] / 2 + x, P = kt(y, C, w), M = l;
      t.modifiersData[o] = (e = {}, e[M] = P, e.centerOffset = P - C, e);
    }
  }
  function Lh(r) {
    var e = r.state, t = r.options, o = t.element, i = o === void 0 ? "[data-popper-arrow]" : o;
    i != null && (typeof i == "string" && (i = e.elements.popper.querySelector(i), !i) || Rn(e.elements.popper, i) && (e.elements.arrow = i));
  }
  const Rh = {
    name: "arrow",
    enabled: !0,
    phase: "main",
    fn: zh,
    effect: Lh,
    requires: ["popperOffsets"],
    requiresIfExists: ["preventOverflow"]
  };
  function rt(r) {
    return r.split("-")[1];
  }
  var Fh = {
    top: "auto",
    right: "auto",
    bottom: "auto",
    left: "auto"
  };
  function Hh(r, e) {
    var t = r.x, o = r.y, i = e.devicePixelRatio || 1;
    return {
      x: et(t * i) / i || 0,
      y: et(o * i) / i || 0
    };
  }
  function ea(r) {
    var e, t = r.popper, o = r.popperRect, i = r.placement, a = r.variation, n = r.offsets, s = r.position, l = r.gpuAcceleration, c = r.adaptive, d = r.roundOffsets, u = r.isFixed, p = n.x, g = p === void 0 ? 0 : p, b = n.y, f = b === void 0 ? 0 : b, m = typeof d == "function" ? d({
      x: g,
      y: f
    }) : {
      x: g,
      y: f
    };
    g = m.x, f = m.y;
    var _ = n.hasOwnProperty("x"), v = n.hasOwnProperty("y"), x = F, y = R, w = window;
    if (c) {
      var C = Ft(t), P = "clientHeight", M = "clientWidth";
      if (C === U(t) && (C = pe(t), ne(C).position !== "static" && s === "absolute" && (P = "scrollHeight", M = "scrollWidth")), C = C, i === R || (i === F || i === Y) && a === Nt) {
        y = q;
        var D = u && C === w && w.visualViewport ? w.visualViewport.height : (
          // $FlowFixMe[prop-missing]
          C[P]
        );
        f -= D - o.height, f *= l ? 1 : -1;
      }
      if (i === F || (i === R || i === q) && a === Nt) {
        x = Y;
        var T = u && C === w && w.visualViewport ? w.visualViewport.width : (
          // $FlowFixMe[prop-missing]
          C[M]
        );
        g -= T - o.width, g *= l ? 1 : -1;
      }
    }
    var I = Object.assign({
      position: s
    }, c && Fh), G = d === !0 ? Hh({
      x: g,
      y: f
    }, U(t)) : {
      x: g,
      y: f
    };
    if (g = G.x, f = G.y, l) {
      var N;
      return Object.assign({}, I, (N = {}, N[y] = v ? "0" : "", N[x] = _ ? "0" : "", N.transform = (w.devicePixelRatio || 1) <= 1 ? "translate(" + g + "px, " + f + "px)" : "translate3d(" + g + "px, " + f + "px, 0)", N));
    }
    return Object.assign({}, I, (e = {}, e[y] = v ? f + "px" : "", e[x] = _ ? g + "px" : "", e.transform = "", e));
  }
  function Bh(r) {
    var e = r.state, t = r.options, o = t.gpuAcceleration, i = o === void 0 ? !0 : o, a = t.adaptive, n = a === void 0 ? !0 : a, s = t.roundOffsets, l = s === void 0 ? !0 : s, c = {
      placement: Z(e.placement),
      variation: rt(e.placement),
      popper: e.elements.popper,
      popperRect: e.rects.popper,
      gpuAcceleration: i,
      isFixed: e.options.strategy === "fixed"
    };
    e.modifiersData.popperOffsets != null && (e.styles.popper = Object.assign({}, e.styles.popper, ea(Object.assign({}, c, {
      offsets: e.modifiersData.popperOffsets,
      position: e.options.strategy,
      adaptive: n,
      roundOffsets: l
    })))), e.modifiersData.arrow != null && (e.styles.arrow = Object.assign({}, e.styles.arrow, ea(Object.assign({}, c, {
      offsets: e.modifiersData.arrow,
      position: "absolute",
      adaptive: !1,
      roundOffsets: l
    })))), e.attributes.popper = Object.assign({}, e.attributes.popper, {
      "data-popper-placement": e.placement
    });
  }
  const jh = {
    name: "computeStyles",
    enabled: !0,
    phase: "beforeWrite",
    fn: Bh,
    data: {}
  };
  var Kt = {
    passive: !0
  };
  function Uh(r) {
    var e = r.state, t = r.instance, o = r.options, i = o.scroll, a = i === void 0 ? !0 : i, n = o.resize, s = n === void 0 ? !0 : n, l = U(e.elements.popper), c = [].concat(e.scrollParents.reference, e.scrollParents.popper);
    return a && c.forEach(function(d) {
      d.addEventListener("scroll", t.update, Kt);
    }), s && l.addEventListener("resize", t.update, Kt), function() {
      a && c.forEach(function(d) {
        d.removeEventListener("scroll", t.update, Kt);
      }), s && l.removeEventListener("resize", t.update, Kt);
    };
  }
  const Vh = {
    name: "eventListeners",
    enabled: !0,
    phase: "write",
    fn: function() {
    },
    effect: Uh,
    data: {}
  };
  var qh = {
    left: "right",
    right: "left",
    bottom: "top",
    top: "bottom"
  };
  function Qt(r) {
    return r.replace(/left|right|bottom|top/g, function(e) {
      return qh[e];
    });
  }
  var Yh = {
    start: "end",
    end: "start"
  };
  function ta(r) {
    return r.replace(/start|end/g, function(e) {
      return Yh[e];
    });
  }
  function Ho(r) {
    var e = U(r), t = e.pageXOffset, o = e.pageYOffset;
    return {
      scrollLeft: t,
      scrollTop: o
    };
  }
  function Bo(r) {
    return tt(pe(r)).left + Ho(r).scrollLeft;
  }
  function Wh(r, e) {
    var t = U(r), o = pe(r), i = t.visualViewport, a = o.clientWidth, n = o.clientHeight, s = 0, l = 0;
    if (i) {
      a = i.width, n = i.height;
      var c = Ln();
      (c || !c && e === "fixed") && (s = i.offsetLeft, l = i.offsetTop);
    }
    return {
      width: a,
      height: n,
      x: s + Bo(r),
      y: l
    };
  }
  function Gh(r) {
    var e, t = pe(r), o = Ho(r), i = (e = r.ownerDocument) == null ? void 0 : e.body, a = we(t.scrollWidth, t.clientWidth, i ? i.scrollWidth : 0, i ? i.clientWidth : 0), n = we(t.scrollHeight, t.clientHeight, i ? i.scrollHeight : 0, i ? i.clientHeight : 0), s = -o.scrollLeft + Bo(r), l = -o.scrollTop;
    return ne(i || t).direction === "rtl" && (s += we(t.clientWidth, i ? i.clientWidth : 0) - a), {
      width: a,
      height: n,
      x: s,
      y: l
    };
  }
  function jo(r) {
    var e = ne(r), t = e.overflow, o = e.overflowX, i = e.overflowY;
    return /auto|scroll|overlay|hidden/.test(t + i + o);
  }
  function jn(r) {
    return ["html", "body", "#document"].indexOf(ee(r)) >= 0 ? r.ownerDocument.body : V(r) && jo(r) ? r : jn(hr(r));
  }
  function xt(r, e) {
    var t;
    e === void 0 && (e = []);
    var o = jn(r), i = o === ((t = r.ownerDocument) == null ? void 0 : t.body), a = U(o), n = i ? [a].concat(a.visualViewport || [], jo(o) ? o : []) : o, s = e.concat(n);
    return i ? s : (
      // $FlowFixMe[incompatible-call]: isBody tells us target will be an HTMLElement here
      s.concat(xt(hr(n)))
    );
  }
  function ho(r) {
    return Object.assign({}, r, {
      left: r.x,
      top: r.y,
      right: r.x + r.width,
      bottom: r.y + r.height
    });
  }
  function Kh(r, e) {
    var t = tt(r, !1, e === "fixed");
    return t.top = t.top + r.clientTop, t.left = t.left + r.clientLeft, t.bottom = t.top + r.clientHeight, t.right = t.left + r.clientWidth, t.width = r.clientWidth, t.height = r.clientHeight, t.x = t.left, t.y = t.top, t;
  }
  function ra(r, e, t) {
    return e === Nn ? ho(Wh(r, t)) : Ae(e) ? Kh(e, t) : ho(Gh(pe(r)));
  }
  function Xh(r) {
    var e = xt(hr(r)), t = ["absolute", "fixed"].indexOf(ne(r).position) >= 0, o = t && V(r) ? Ft(r) : r;
    return Ae(o) ? e.filter(function(i) {
      return Ae(i) && Rn(i, o) && ee(i) !== "body";
    }) : [];
  }
  function Jh(r, e, t, o) {
    var i = e === "clippingParents" ? Xh(r) : [].concat(e), a = [].concat(i, [t]), n = a[0], s = a.reduce(function(l, c) {
      var d = ra(r, c, o);
      return l.top = we(d.top, l.top), l.right = sr(d.right, l.right), l.bottom = sr(d.bottom, l.bottom), l.left = we(d.left, l.left), l;
    }, ra(r, n, o));
    return s.width = s.right - s.left, s.height = s.bottom - s.top, s.x = s.left, s.y = s.top, s;
  }
  function Un(r) {
    var e = r.reference, t = r.element, o = r.placement, i = o ? Z(o) : null, a = o ? rt(o) : null, n = e.x + e.width / 2 - t.width / 2, s = e.y + e.height / 2 - t.height / 2, l;
    switch (i) {
      case R:
        l = {
          x: n,
          y: e.y - t.height
        };
        break;
      case q:
        l = {
          x: n,
          y: e.y + e.height
        };
        break;
      case Y:
        l = {
          x: e.x + e.width,
          y: s
        };
        break;
      case F:
        l = {
          x: e.x - t.width,
          y: s
        };
        break;
      default:
        l = {
          x: e.x,
          y: e.y
        };
    }
    var c = i ? Fo(i) : null;
    if (c != null) {
      var d = c === "y" ? "height" : "width";
      switch (a) {
        case Ze:
          l[c] = l[c] - (e[d] / 2 - t[d] / 2);
          break;
        case Nt:
          l[c] = l[c] + (e[d] / 2 - t[d] / 2);
          break;
      }
    }
    return l;
  }
  function zt(r, e) {
    e === void 0 && (e = {});
    var t = e, o = t.placement, i = o === void 0 ? r.placement : o, a = t.strategy, n = a === void 0 ? r.strategy : a, s = t.boundary, l = s === void 0 ? mh : s, c = t.rootBoundary, d = c === void 0 ? Nn : c, u = t.elementContext, p = u === void 0 ? ft : u, g = t.altBoundary, b = g === void 0 ? !1 : g, f = t.padding, m = f === void 0 ? 0 : f, _ = Hn(typeof m != "number" ? m : Bn(m, Rt)), v = p === ft ? _h : ft, x = r.rects.popper, y = r.elements[b ? v : p], w = Jh(Ae(y) ? y : y.contextElement || pe(r.elements.popper), l, d, n), C = tt(r.elements.reference), P = Un({
      reference: C,
      element: x,
      strategy: "absolute",
      placement: i
    }), M = ho(Object.assign({}, x, P)), D = p === ft ? M : C, T = {
      top: w.top - D.top + _.top,
      bottom: D.bottom - w.bottom + _.bottom,
      left: w.left - D.left + _.left,
      right: D.right - w.right + _.right
    }, I = r.modifiersData.offset;
    if (p === ft && I) {
      var G = I[i];
      Object.keys(T).forEach(function(N) {
        var ge = [Y, q].indexOf(N) >= 0 ? 1 : -1, fe = [R, q].indexOf(N) >= 0 ? "y" : "x";
        T[N] += G[fe] * ge;
      });
    }
    return T;
  }
  function Qh(r, e) {
    e === void 0 && (e = {});
    var t = e, o = t.placement, i = t.boundary, a = t.rootBoundary, n = t.padding, s = t.flipVariations, l = t.allowedAutoPlacements, c = l === void 0 ? zn : l, d = rt(o), u = d ? s ? Qi : Qi.filter(function(b) {
      return rt(b) === d;
    }) : Rt, p = u.filter(function(b) {
      return c.indexOf(b) >= 0;
    });
    p.length === 0 && (p = u);
    var g = p.reduce(function(b, f) {
      return b[f] = zt(r, {
        placement: f,
        boundary: i,
        rootBoundary: a,
        padding: n
      })[Z(f)], b;
    }, {});
    return Object.keys(g).sort(function(b, f) {
      return g[b] - g[f];
    });
  }
  function Zh(r) {
    if (Z(r) === zo)
      return [];
    var e = Qt(r);
    return [ta(r), e, ta(e)];
  }
  function ep(r) {
    var e = r.state, t = r.options, o = r.name;
    if (!e.modifiersData[o]._skip) {
      for (var i = t.mainAxis, a = i === void 0 ? !0 : i, n = t.altAxis, s = n === void 0 ? !0 : n, l = t.fallbackPlacements, c = t.padding, d = t.boundary, u = t.rootBoundary, p = t.altBoundary, g = t.flipVariations, b = g === void 0 ? !0 : g, f = t.allowedAutoPlacements, m = e.options.placement, _ = Z(m), v = _ === m, x = l || (v || !b ? [Qt(m)] : Zh(m)), y = [m].concat(x).reduce(function(Te, se) {
        return Te.concat(Z(se) === zo ? Qh(e, {
          placement: se,
          boundary: d,
          rootBoundary: u,
          padding: c,
          flipVariations: b,
          allowedAutoPlacements: f
        }) : se);
      }, []), w = e.rects.reference, C = e.rects.popper, P = /* @__PURE__ */ new Map(), M = !0, D = y[0], T = 0; T < y.length; T++) {
        var I = y[T], G = Z(I), N = rt(I) === Ze, ge = [R, q].indexOf(G) >= 0, fe = ge ? "width" : "height", B = zt(e, {
          placement: I,
          boundary: d,
          rootBoundary: u,
          altBoundary: p,
          padding: c
        }), K = ge ? N ? Y : F : N ? q : R;
        w[fe] > C[fe] && (K = Qt(K));
        var Ht = Qt(K), be = [];
        if (a && be.push(B[G] <= 0), s && be.push(B[K] <= 0, B[Ht] <= 0), be.every(function(Te) {
          return Te;
        })) {
          D = I, M = !1;
          break;
        }
        P.set(I, be);
      }
      if (M)
        for (var Bt = b ? 3 : 1, pr = function(se) {
          var st = y.find(function(Ut) {
            var me = P.get(Ut);
            if (me)
              return me.slice(0, se).every(function(gr) {
                return gr;
              });
          });
          if (st)
            return D = st, "break";
        }, nt = Bt; nt > 0; nt--) {
          var jt = pr(nt);
          if (jt === "break")
            break;
        }
      e.placement !== D && (e.modifiersData[o]._skip = !0, e.placement = D, e.reset = !0);
    }
  }
  const tp = {
    name: "flip",
    enabled: !0,
    phase: "main",
    fn: ep,
    requiresIfExists: ["offset"],
    data: {
      _skip: !1
    }
  };
  function oa(r, e, t) {
    return t === void 0 && (t = {
      x: 0,
      y: 0
    }), {
      top: r.top - e.height - t.y,
      right: r.right - e.width + t.x,
      bottom: r.bottom - e.height + t.y,
      left: r.left - e.width - t.x
    };
  }
  function ia(r) {
    return [R, Y, q, F].some(function(e) {
      return r[e] >= 0;
    });
  }
  function rp(r) {
    var e = r.state, t = r.name, o = e.rects.reference, i = e.rects.popper, a = e.modifiersData.preventOverflow, n = zt(e, {
      elementContext: "reference"
    }), s = zt(e, {
      altBoundary: !0
    }), l = oa(n, o), c = oa(s, i, a), d = ia(l), u = ia(c);
    e.modifiersData[t] = {
      referenceClippingOffsets: l,
      popperEscapeOffsets: c,
      isReferenceHidden: d,
      hasPopperEscaped: u
    }, e.attributes.popper = Object.assign({}, e.attributes.popper, {
      "data-popper-reference-hidden": d,
      "data-popper-escaped": u
    });
  }
  const op = {
    name: "hide",
    enabled: !0,
    phase: "main",
    requiresIfExists: ["preventOverflow"],
    fn: rp
  };
  function ip(r, e, t) {
    var o = Z(r), i = [F, R].indexOf(o) >= 0 ? -1 : 1, a = typeof t == "function" ? t(Object.assign({}, e, {
      placement: r
    })) : t, n = a[0], s = a[1];
    return n = n || 0, s = (s || 0) * i, [F, Y].indexOf(o) >= 0 ? {
      x: s,
      y: n
    } : {
      x: n,
      y: s
    };
  }
  function ap(r) {
    var e = r.state, t = r.options, o = r.name, i = t.offset, a = i === void 0 ? [0, 0] : i, n = zn.reduce(function(d, u) {
      return d[u] = ip(u, e.rects, a), d;
    }, {}), s = n[e.placement], l = s.x, c = s.y;
    e.modifiersData.popperOffsets != null && (e.modifiersData.popperOffsets.x += l, e.modifiersData.popperOffsets.y += c), e.modifiersData[o] = n;
  }
  const np = {
    name: "offset",
    enabled: !0,
    phase: "main",
    requires: ["popperOffsets"],
    fn: ap
  };
  function sp(r) {
    var e = r.state, t = r.name;
    e.modifiersData[t] = Un({
      reference: e.rects.reference,
      element: e.rects.popper,
      strategy: "absolute",
      placement: e.placement
    });
  }
  const lp = {
    name: "popperOffsets",
    enabled: !0,
    phase: "read",
    fn: sp,
    data: {}
  };
  function cp(r) {
    return r === "x" ? "y" : "x";
  }
  function dp(r) {
    var e = r.state, t = r.options, o = r.name, i = t.mainAxis, a = i === void 0 ? !0 : i, n = t.altAxis, s = n === void 0 ? !1 : n, l = t.boundary, c = t.rootBoundary, d = t.altBoundary, u = t.padding, p = t.tether, g = p === void 0 ? !0 : p, b = t.tetherOffset, f = b === void 0 ? 0 : b, m = zt(e, {
      boundary: l,
      rootBoundary: c,
      padding: u,
      altBoundary: d
    }), _ = Z(e.placement), v = rt(e.placement), x = !v, y = Fo(_), w = cp(y), C = e.modifiersData.popperOffsets, P = e.rects.reference, M = e.rects.popper, D = typeof f == "function" ? f(Object.assign({}, e.rects, {
      placement: e.placement
    })) : f, T = typeof D == "number" ? {
      mainAxis: D,
      altAxis: D
    } : Object.assign({
      mainAxis: 0,
      altAxis: 0
    }, D), I = e.modifiersData.offset ? e.modifiersData.offset[e.placement] : null, G = {
      x: 0,
      y: 0
    };
    if (C) {
      if (a) {
        var N, ge = y === "y" ? R : F, fe = y === "y" ? q : Y, B = y === "y" ? "height" : "width", K = C[y], Ht = K + m[ge], be = K - m[fe], Bt = g ? -M[B] / 2 : 0, pr = v === Ze ? P[B] : M[B], nt = v === Ze ? -M[B] : -P[B], jt = e.elements.arrow, Te = g && jt ? Ro(jt) : {
          width: 0,
          height: 0
        }, se = e.modifiersData["arrow#persistent"] ? e.modifiersData["arrow#persistent"].padding : Fn(), st = se[ge], Ut = se[fe], me = kt(0, P[B], Te[B]), gr = x ? P[B] / 2 - Bt - me - st - T.mainAxis : pr - me - st - T.mainAxis, Vn = x ? -P[B] / 2 + Bt + me + Ut + T.mainAxis : nt + me + Ut + T.mainAxis, fr = e.elements.arrow && Ft(e.elements.arrow), qn = fr ? y === "y" ? fr.clientTop || 0 : fr.clientLeft || 0 : 0, qo = (N = I == null ? void 0 : I[y]) != null ? N : 0, Yn = K + gr - qo - qn, Wn = K + Vn - qo, Yo = kt(g ? sr(Ht, Yn) : Ht, K, g ? we(be, Wn) : be);
        C[y] = Yo, G[y] = Yo - K;
      }
      if (s) {
        var Wo, Gn = y === "x" ? R : F, Kn = y === "x" ? q : Y, _e = C[w], Vt = w === "y" ? "height" : "width", Go = _e + m[Gn], Ko = _e - m[Kn], br = [R, F].indexOf(_) !== -1, Xo = (Wo = I == null ? void 0 : I[w]) != null ? Wo : 0, Jo = br ? Go : _e - P[Vt] - M[Vt] - Xo + T.altAxis, Qo = br ? _e + P[Vt] + M[Vt] - Xo - T.altAxis : Ko, Zo = g && br ? Ih(Jo, _e, Qo) : kt(g ? Jo : Go, _e, g ? Qo : Ko);
        C[w] = Zo, G[w] = Zo - _e;
      }
      e.modifiersData[o] = G;
    }
  }
  const up = {
    name: "preventOverflow",
    enabled: !0,
    phase: "main",
    fn: dp,
    requiresIfExists: ["offset"]
  };
  function hp(r) {
    return {
      scrollLeft: r.scrollLeft,
      scrollTop: r.scrollTop
    };
  }
  function pp(r) {
    return r === U(r) || !V(r) ? Ho(r) : hp(r);
  }
  function gp(r) {
    var e = r.getBoundingClientRect(), t = et(e.width) / r.offsetWidth || 1, o = et(e.height) / r.offsetHeight || 1;
    return t !== 1 || o !== 1;
  }
  function fp(r, e, t) {
    t === void 0 && (t = !1);
    var o = V(e), i = V(e) && gp(e), a = pe(e), n = tt(r, i, t), s = {
      scrollLeft: 0,
      scrollTop: 0
    }, l = {
      x: 0,
      y: 0
    };
    return (o || !o && !t) && ((ee(e) !== "body" || // https://github.com/popperjs/popper-core/issues/1078
    jo(a)) && (s = pp(e)), V(e) ? (l = tt(e, !0), l.x += e.clientLeft, l.y += e.clientTop) : a && (l.x = Bo(a))), {
      x: n.left + s.scrollLeft - l.x,
      y: n.top + s.scrollTop - l.y,
      width: n.width,
      height: n.height
    };
  }
  function bp(r) {
    var e = /* @__PURE__ */ new Map(), t = /* @__PURE__ */ new Set(), o = [];
    r.forEach(function(a) {
      e.set(a.name, a);
    });
    function i(a) {
      t.add(a.name);
      var n = [].concat(a.requires || [], a.requiresIfExists || []);
      n.forEach(function(s) {
        if (!t.has(s)) {
          var l = e.get(s);
          l && i(l);
        }
      }), o.push(a);
    }
    return r.forEach(function(a) {
      t.has(a.name) || i(a);
    }), o;
  }
  function mp(r) {
    var e = bp(r);
    return Sh.reduce(function(t, o) {
      return t.concat(e.filter(function(i) {
        return i.phase === o;
      }));
    }, []);
  }
  function _p(r) {
    var e;
    return function() {
      return e || (e = new Promise(function(t) {
        Promise.resolve().then(function() {
          e = void 0, t(r());
        });
      })), e;
    };
  }
  function vp(r) {
    var e = r.reduce(function(t, o) {
      var i = t[o.name];
      return t[o.name] = i ? Object.assign({}, i, o, {
        options: Object.assign({}, i.options, o.options),
        data: Object.assign({}, i.data, o.data)
      }) : o, t;
    }, {});
    return Object.keys(e).map(function(t) {
      return e[t];
    });
  }
  var aa = {
    placement: "bottom",
    modifiers: [],
    strategy: "absolute"
  };
  function na() {
    for (var r = arguments.length, e = new Array(r), t = 0; t < r; t++)
      e[t] = arguments[t];
    return !e.some(function(o) {
      return !(o && typeof o.getBoundingClientRect == "function");
    });
  }
  function yp(r) {
    r === void 0 && (r = {});
    var e = r, t = e.defaultModifiers, o = t === void 0 ? [] : t, i = e.defaultOptions, a = i === void 0 ? aa : i;
    return function(s, l, c) {
      c === void 0 && (c = a);
      var d = {
        placement: "bottom",
        orderedModifiers: [],
        options: Object.assign({}, aa, a),
        modifiersData: {},
        elements: {
          reference: s,
          popper: l
        },
        attributes: {},
        styles: {}
      }, u = [], p = !1, g = {
        state: d,
        setOptions: function(_) {
          var v = typeof _ == "function" ? _(d.options) : _;
          f(), d.options = Object.assign({}, a, d.options, v), d.scrollParents = {
            reference: Ae(s) ? xt(s) : s.contextElement ? xt(s.contextElement) : [],
            popper: xt(l)
          };
          var x = mp(vp([].concat(o, d.options.modifiers)));
          return d.orderedModifiers = x.filter(function(y) {
            return y.enabled;
          }), b(), g.update();
        },
        // Sync update – it will always be executed, even if not necessary. This
        // is useful for low frequency updates where sync behavior simplifies the
        // logic.
        // For high frequency updates (e.g. `resize` and `scroll` events), always
        // prefer the async Popper#update method
        forceUpdate: function() {
          if (!p) {
            var _ = d.elements, v = _.reference, x = _.popper;
            if (na(v, x)) {
              d.rects = {
                reference: fp(v, Ft(x), d.options.strategy === "fixed"),
                popper: Ro(x)
              }, d.reset = !1, d.placement = d.options.placement, d.orderedModifiers.forEach(function(T) {
                return d.modifiersData[T.name] = Object.assign({}, T.data);
              });
              for (var y = 0; y < d.orderedModifiers.length; y++) {
                if (d.reset === !0) {
                  d.reset = !1, y = -1;
                  continue;
                }
                var w = d.orderedModifiers[y], C = w.fn, P = w.options, M = P === void 0 ? {} : P, D = w.name;
                typeof C == "function" && (d = C({
                  state: d,
                  options: M,
                  name: D,
                  instance: g
                }) || d);
              }
            }
          }
        },
        // Async and optimistically optimized update – it will not be executed if
        // not necessary (debounced to run at most once-per-tick)
        update: _p(function() {
          return new Promise(function(m) {
            g.forceUpdate(), m(d);
          });
        }),
        destroy: function() {
          f(), p = !0;
        }
      };
      if (!na(s, l))
        return g;
      g.setOptions(c).then(function(m) {
        !p && c.onFirstUpdate && c.onFirstUpdate(m);
      });
      function b() {
        d.orderedModifiers.forEach(function(m) {
          var _ = m.name, v = m.options, x = v === void 0 ? {} : v, y = m.effect;
          if (typeof y == "function") {
            var w = y({
              state: d,
              name: _,
              instance: g,
              options: x
            }), C = function() {
            };
            u.push(w || C);
          }
        });
      }
      function f() {
        u.forEach(function(m) {
          return m();
        }), u = [];
      }
      return g;
    };
  }
  var kp = [Vh, lp, jh, Oh, np, tp, up, Rh, op], xp = /* @__PURE__ */ yp({
    defaultModifiers: kp
  });
  const wp = '.col-bg-body-lighter{background-color:var(--col-bg-body-lighter)}.col-bg-body{background-color:var(--col-bg-body)}.col-bg-body-darker{background-color:var(--col-bg-body-darker)}.col-bg-1-lighter{background-color:var(--col-bg-1-lighter)}.col-bg-1{background-color:var(--col-bg-1)}.col-bg-1-darker{background-color:var(--col-bg-1-darker)}.col-bg-1-input{background-color:var(--col-bg-1-input)}.col-primary-bg-1{background-color:var(--col-primary-bg-1)}.col-accent-bg-1{background-color:var(--col-accent-bg-1)}.col-success-bg-1{background-color:var(--col-success-bg-1)}.col-warning-bg-1{background-color:var(--col-warning-bg-1)}.col-error-bg-1{background-color:var(--col-error-bg-1)}.col-bg-2-lighter{background-color:var(--col-bg-2-lighter)}.col-bg-2{background-color:var(--col-bg-2)}.col-bg-2-darker{background-color:var(--col-bg-2-darker)}.col-bg-2-button{background-color:var(--col-bg-2-button)}.col-bg-2-input{background-color:var(--col-bg-2-input)}.col-primary-bg-2{background-color:var(--col-primary-bg-2)}.col-accent-bg-2{background-color:var(--col-accent-bg-2)}.col-success-bg-2{background-color:var(--col-success-bg-2)}.col-warning-bg-2{background-color:var(--col-warning-bg-2)}.col-error-bg-2{background-color:var(--col-error-bg-2)}.col-bg-3-lighter{background-color:var(--col-bg-3-lighter)}.col-bg-3{background-color:var(--col-bg-3)}.col-bg-3-darker{background-color:var(--col-bg-3-darker)}.col-bg-3-button{background-color:var(--col-bg-3-button)}.col-bg-3-input{background-color:var(--col-bg-3-input)}.col-primary-bg-3{background-color:var(--col-primary-bg-3)}.col-accent-bg-3{background-color:var(--col-accent-bg-3)}.col-success-bg-3{background-color:var(--col-success-bg-3)}.col-warning-bg-3{background-color:var(--col-warning-bg-3)}.col-error-bg-3{background-color:var(--col-error-bg-3)}.col-bg-ack-lighter{background-color:var(--col-bg-ack-lighter)}.col-bg-ack{background-color:var(--col-bg-ack)}.col-bg-ack-darker{background-color:var(--col-bg-ack-darker)}.col-primary-bg-ack{background-color:var(--col-primary-bg-ack)}.col-accent-bg-ack{background-color:var(--col-accent-bg-ack)}.col-bg-att-lighter{background-color:var(--col-bg-att-lighter)}.col-bg-att{background-color:var(--col-bg-att)}.col-bg-att-darker{background-color:var(--col-bg-att-darker)}.col-primary-bg-att{background-color:var(--col-primary-bg-att)}.col-accent-bg-att{background-color:var(--col-accent-bg-att)}.col-bg-alert-lighter{background-color:var(--col-bg-alert-lighter)}.col-bg-alert{background-color:var(--col-bg-alert)}.col-bg-alert-darker{background-color:var(--col-bg-alert-darker)}.col-primary-bg-alert{background-color:var(--col-primary-bg-alert)}.col-accent-bg-alert{background-color:var(--col-accent-bg-alert)}.col-bg-btn-lighter{background-color:var(--col-bg-btn-lighter)}.col-bg-btn{background-color:var(--col-bg-btn)}.col-bg-btn-darker{background-color:var(--col-bg-btn-darker)}.col-primary-bg-btn{background-color:var(--col-primary-bg-btn)}.col-accent-bg-btn{background-color:var(--col-accent-bg-btn)}.pattern-diagonal-stripes-sm{background:repeating-linear-gradient(45deg,transparent,transparent 10px,currentColor 10px,currentColor 20px)}.pattern-dots-lg{background-image:radial-gradient(currentColor 1.5px,transparent 1.5px);background-size:15px 15px}.pattern-dots-md{background-image:radial-gradient(currentColor 1px,transparent 1px);background-size:8px 8px}.pattern-dots-medium-dense{background-image:radial-gradient(currentColor .5px,transparent .5px);background-size:3px 3px}.pattern-dots-sm{background-image:radial-gradient(currentColor .5px,transparent .5px);background-size:5px 5px}.pattern-cross-dots-md,.imagelist-background{background-image:radial-gradient(currentColor .7px,transparent 1px),radial-gradient(currentColor .7px,transparent 1px);background-size:6.5px 6.5px;background-position:0 0,3.5px 3.5px}.imagelist-background{background-color:#fff9;background-blend-mode:overlay}p,div{padding:0;margin:0;border:0px;-webkit-user-select:text;user-select:text}select{-webkit-user-select:none;user-select:none}.fa,.fas{font-family:"Font Awesome 5 Free";font-weight:900;font-style:normal}.fa-trash:before{content:""}.fa-view-grid:before{content:""}.fa-view-list:before{content:""}.fa-camera:before{content:""}.fa-view-image:before{content:""}.fa-check:before{content:""}.fa-exclamation-circle:before{content:""}.list-header{position:sticky;z-index:1;top:0}:host{background-color:var(--col-bg-body);display:block;border:solid 2px var(--col-bg-1-darker);overflow-y:hidden;padding-bottom:.5em}div,p{font-family:var(--standard-text-font)}.locus-list{display:grid;overflow-y:scroll;height:100%;width:100%;max-height:35vh;grid-row-gap:5px;grid-template-rows:[header] auto;grid-template-columns:repeat(8,auto);border-top:solid var(--col-bg-1-darker) 2px}.locus-list div{padding-right:.5em}.locus-list.locus-list-with-member{grid-template-columns:repeat(9,auto)}.list-header{background:var(--col-bg-1-lighter);color:var(--col-primary-bg-1);font-weight:700;padding-top:5px;word-wrap:break-word;border-bottom:solid var(--col-bg-1-darker) 1px}.list-header.tighter{max-width:4.5em}.headline{background-color:var(--col-bg-1-lighter);color:var(--col-primary-bg-1);padding:2px;font-weight:700}.controls{display:flex;flex-direction:row;background-color:var(--col-bg-1-lighter);color:var(--col-primary-bg-1);padding:2px;font-weight:700;justify-content:space-between}.no-loci{padding:2px}.locus{font-family:var(--standard-text-font);padding:.2em;border-bottom:var(--col-bg-1-darker) 2px solid}.locus-headline{display:flex;flex-direction:row;justify-content:space-between;font-size:1.2em;font-weight:700}.locus-body{display:flex;flex-direction:row}.locus-body div{padding:0 .5em}#sort-type-selector{padding-right:1em}.center-col{display:flex;justify-content:center}.identifier-col{display:flex;justify-content:space-between;flex-direction:row}.identifier-col i{margin-left:.2em}.fa-exclamation-circle.warning,.fa-exclamation-circle.warn{color:var(--col-bg-att)}.fa-exclamation-circle.error{color:var(--col-bg-alert)}.fa-exclamation-circle.hint{color:var(--col-bg-ack)}.tooltip{display:none;background-color:var(--col-bg-1);color:var(--col-primary-bg-1);border:solid 2px var(--col-bg-1-darker);box-shadow:2px 2px 5px var(--col-bg-1-darker)}.tooltip *{-webkit-user-select:none;user-select:none}.tooltip[data-show]{display:block}.qc-message{background-color:var(--col-bg-1)}.tooltip{z-index:1}.qc-message-view{padding:.5em}.qc-message-view p:first-child{margin-bottom:.5em;font-weight:700;color:var(--col-accent-bg-1)}.qc-message-view p{margin-bottom:.2em}.qc-message-view i{margin-right:.5em}';
  var Cp = Object.defineProperty, Ap = Object.getOwnPropertyDescriptor, Ep = Object.getPrototypeOf, Pp = Reflect.get, Sp = (r, e, t, o) => {
    for (var i = o > 1 ? void 0 : o ? Ap(e, t) : e, a = r.length - 1, n; a >= 0; a--)
      (n = r[a]) && (i = (o ? n(e, t, i) : n(i)) || i);
    return o && i && Cp(e, t, i), i;
  }, Tp = (r, e, t) => Pp(Ep(r), t, e);
  class Dp {
  }
  let Ve = class extends z {
    constructor() {
      super(), this.selected_date = null, this.selected_context = "", this.selected_context_uid = "", this.selected_member = "", this.loci = {}, this.lociList = [], this.fetching = !1, this.fetch_error = "", this.locusCount = 0, this.selected_sort = "identifier", this.term_for_locus = "locus", this.term_for_loci = "loci", this.poppers = null, this.sort_by = {
        identifier: ["identifier", "modified"],
        creation: ["created", "identifier"]
      };
    }
    get_conditions(r, e, t) {
      let o = `modified_date = '${r}' and coalesce(type,'') <> 'su'`;
      return (e || t) && (e && (o = o + ` and identifier = '${e}'`), t && (o = o + ` and modified_by ='${t}'`)), o;
    }
    fetch_data() {
      this.fetching = !0;
      const r = ot(this.selected_date), e = `
            primary_identifier, identifier, nointerpretation, nodescription, created, modified_by, modified_date, 
            record_type, type, primary_identifier_uuid qc_data_context, count(data_uuid) c 
            from {base} where ${this.get_conditions(r, this.selected_context, this.selected_member)}  
            group by primary_identifier, identifier, nointerpretation, nodescription, created, modified_by, 
            modified_date, record_type, type, primary_identifier_uuid         
        `, t = {
        cql: {
          base: {
            scope: {
              unit: {
                locus: {
                  locus_relations: {},
                  lot: {},
                  locus_photo: {}
                  // "collected_material": {}
                }
              }
            },
            target: {
              field_or_instruction: "replfield_modified()"
            },
            additional_fields: {
              modified_date: {
                field_or_instruction: "replfield_modified()",
                default: "",
                format: "datetime(date)"
              },
              modified_by: {
                field_or_instruction: "replfield_modified_by()",
                default: ""
              },
              modified_timestamp: {
                field_or_instruction: "replfield_modified()",
                default: ""
              },
              created: {
                field_or_instruction: "locus.replfield_created()",
                default: "null",
                format: "datetime(date)"
              },
              type: {
                field_or_instruction: "locus.type",
                default: "null"
              },
              nointerpretation: {
                field_or_instruction: "locus.interpretation",
                default: "true",
                format: "isempty()"
              },
              nodescription: {
                field_or_instruction: "locus.description",
                default: "true",
                format: "isempty()"
              }
            }
          },
          meta: {
            version: 0.1
          },
          query: {
            type: "DirectSqlQuery",
            sql: e
          }
        }
      };
      let o = new URLSearchParams({
        page_size: "-1",
        qc_data_context: "qc_data_context"
      });
      this.apiContext.fetchFromApi(
        "",
        "cql/query",
        {
          method: "POST",
          caller: "locuswidget.fetch_data",
          body: JSON.stringify(t)
        },
        "v1",
        o
      ).then((i) => {
        i.result_msg !== "ok" ? this.fetch_error = i.result_msg : (this.fetch_error = "", this.load_records(i.records, i.qc_messages)), this.fetching = !1;
      }).catch((i) => {
        J(this, i, "locusWidget.fetch_data", null);
      });
    }
    get_locus_qc_messages(r, e) {
      let t = [];
      for (const o of r)
        o.data_context == e && t.push(o);
      return t;
    }
    get_max_qc_severity(r) {
      let e = "";
      for (const t of r) {
        const o = t.severity;
        if (o.startsWith("err"))
          return "error";
        o.startsWith("warn") ? e = "warning" : o == "hint" && e != "warning" && (e = "hint");
      }
      return e;
    }
    load_records(r, e) {
      this.loci = {}, this.lociList = [], r.forEach((t) => {
        const o = t.primary_identifier;
        let i;
        t.record_type != "unit" && (o in this.loci ? i = this.loci[o] : (i = new Dp(), this.loci[o] = i, this.lociList.push(i), i.photoCount = 0, i.lotCount = 0, i.type = "?", i.hasDescription = !1, i.hasInterpretation = !1, i.relationsCount = 0, i.record_type = "", i.modified = 0, i.locus_creation = "?", i.max_severity = "", i.qc_messages = []), i.identifier = t.primary_identifier, i.unitId = t.identifier, i.record_type = t.record_type, t.modified > i.modified && (i.modified = t.modified), i.modified_by = t.modified_by, t.type && (i.type = t.type), t.created && (i.locus_creation = ae(t.created).toLocaleDateString(), i.created = ae(t.created).getTime()), t.nodescription || (i.hasDescription = !0), t.nointerpretation || (i.hasInterpretation = !0), e.length > 0 && i.qc_messages.length == 0 && (i.qc_messages = this.get_locus_qc_messages(e, t.qc_data_context), i.max_severity = "", i.qc_messages.length > 0 && (i.max_severity = this.get_max_qc_severity(i.qc_messages))), t.record_type == "locus_photo" && (i.photoCount = t.c), t.record_type == "locus_relations" && (i.relationsCount = t.c), t.record_type == "lot" && (i.lotCount = t.c));
      }), this.locusCount = Object.keys(this.loci).length, this.sort_records(this.sort_by[this.selected_sort]);
    }
    sort_records(r) {
      function e(t, o) {
        for (let i = 0; i < r.length; i++) {
          let a = r[i], n = t[a], s = o[a], l = 0;
          if (typeof n == "string" ? l = n.localeCompare(s) : (n < s && (l = -1), n > s && (l = 1)), l != 0)
            return l;
        }
        return 0;
      }
      this.lociList.sort(e), this.requestUpdate();
    }
    stateChanged(r) {
      if (this.fetch_error)
        return h`Error fetching: ${this.fetch_error}`;
      if (r.initState == 0)
        return;
      let e = !1;
      if ("dateSelector" in r.selectors) {
        let t = r.selectors.dateSelector.selectedDate;
        if ((!this.selected_date || t.getTime() !== this.selected_date.getTime()) && (this.selected_date = t, e = !0), "contextSelector" in r.selectors) {
          let o = r.selectors.contextSelector.selectedContext;
          o !== this.selected_context && (this.selected_context = o, this.selected_context_uid = r.selectors.contextSelector.selectedUid, e = !0);
        }
        if ("teamSelector" in r.selectors) {
          let o = r.selectors.teamSelector.selectedMember;
          o !== this.selected_member && (this.selected_member = o, e = !0);
        }
        e && this.fetch_data();
      }
      r.constants.length > 0 && (this.term_for_locus = de(
        r.constants,
        "standard_term_for_loci",
        !1,
        this.term_for_locus
      ), this.term_for_loci = de(
        r.constants,
        "standard_term_for_loci",
        !0,
        this.term_for_loci
      ));
    }
    showQcMessages(r) {
      const e = r.target, t = e.nextElementSibling, o = e.getAttribute("tip-id");
      this.poppers.get(o).update(), t.setAttribute("data-show", ""), t.addEventListener("blur", () => {
        t.removeAttribute("data-show");
      }), t.addEventListener("mouseleave", () => {
        t.removeAttribute("data-show");
      }), t.addEventListener("click", () => {
        t.removeAttribute("data-show");
      });
    }
    apiRender() {
      return h`
                    <div class="locus-widget">
                        <div class="headline">
                            <p>${this.locusCount} ${this.locusCount == 1 ? this.term_for_locus : this.term_for_loci}</p>
                        </div>
                        <div class="controls">
                            <div class="controls-left">
                                ${this.renderSortSelector()}
                            </div>
                        </div>
                        ${this.selected_date !== null ? this.render_widget() : h`Please select a date`}
                    </div>`;
    }
    sortTypeChanged(r) {
      this.selected_sort = r.currentTarget.value, this.sort_records(this.sort_by[this.selected_sort]);
    }
    renderSortSelector() {
      return h`
            <label for="sort-type-selector">sort by</label>
            <select name="sort-type-selector" id="sort-type-selector" @change="${this.sortTypeChanged}">
                ${Object.keys(this.sort_by).map(
        (r) => h`
                            <option value="${r}"
                                    ?selected="${this.selected_sort === r}">
                                ${r}
                            </option>
                        `
      )}
            </select>
        `;
    }
    renderQCMessages(r) {
      return h`
            <div class="qc-message-view">
                <p>recording quality for ${r.identifier}</p>
                ${r.qc_messages.map((e) => h`
                    <p class="qc-message ${e.severity}">
                        <i class="fa fa-exclamation-circle ${e.severity}"></i>${e.message}
                    </p>
                `)}
            </div>    
                
        `;
    }
    render_widget() {
      return this.selected_date ? this.fetching ? h`fetching data ...` : this.locusCount == 0 ? h`
                    <div class="no-loci">
                        <p>No data found for your selection</p>
                    </div>` : h`
                <div class="locus-list ${this.selected_member ? void 0 : "locus-list-with-member"}">
                    <div class="list-header">identifier</div>
                    <div class="list-header">type</div>
                    <div class="list-header">lots</div>
                    <div class="list-header">creation</div>
                    <div class="list-header">description?</div>
                    <div class="list-header tighter">interpre-tation?</div>
                    <div class="list-header">relations</div>
                    <div class="list-header">photos</div>
                    ${this.selected_member ? void 0 : h`<div class="list-header">by</div>`}
                    ${this.lociList.map(
        (r) => h`
                        <div class="identifier-col">
                            ${this.selected_context ? void 0 : h`${r.unitId}/`}${r.identifier}
                            ${r.max_severity != "" ? h`                                
                                    <i class="fa fa-exclamation-circle ${r.max_severity} tooltip-button" 
                                       tip-id="${r.identifier}" 
                                       @click="${this.showQcMessages}">
                                    </i>
                                    <div class="tooltip">
                                        ${this.renderQCMessages(r)}
                                    </div>
                                ` : void 0} 
                        </div>
                        <div>${r.type}</div>
                        <div class="center-col">${r.lotCount}</div>
                        <div>${r.locus_creation}</div>
                        <div class="center-col">${r.hasDescription ? h`                                
                                    <i class="fa fa-check"></i>
                                ` : void 0}</div>
                        <div class="center-col">${r.hasInterpretation ? h`                                
                                    <i class="fa fa-check"></i>
                                ` : void 0}</div>
                        <div class="center-col">${r.relationsCount}</div>
                        <div class="center-col">${r.photoCount}</div>
                        ${this.selected_member ? void 0 : h`<div class="center-col">${r.modified_by}</div>`}
                    `
      )}
                </div>
                ` : h`please select a date`;
    }
    updated(r) {
      super.updated(r);
      const e = this.shadowRoot.querySelectorAll(".tooltip-button");
      this.poppers = /* @__PURE__ */ new Map();
      for (const t of e) {
        const o = xp(t, t.nextElementSibling, {
          placement: "right",
          modifiers: [
            {
              name: "offset",
              options: {
                offset: [0, 8]
              }
            }
          ]
        });
        this.poppers.set(t.getAttribute("tip-id"), o);
      }
    }
  };
  Ve.styles = H(wp);
  Ve.properties = {
    ...Tp(Ve, Ve, "properties"),
    selected_context: { type: String },
    selected_date: { type: Date },
    selected_member: { type: String },
    fetching: { type: Boolean },
    sort_by: { type: Array },
    term_for_locus: { type: String }
  };
  Ve = Sp([
    W("locus-widget")
  ], Ve);
  const Op = '.col-bg-body-lighter{background-color:var(--col-bg-body-lighter)}.col-bg-body{background-color:var(--col-bg-body)}.col-bg-body-darker{background-color:var(--col-bg-body-darker)}.col-bg-1-lighter{background-color:var(--col-bg-1-lighter)}.col-bg-1{background-color:var(--col-bg-1)}.col-bg-1-darker{background-color:var(--col-bg-1-darker)}.col-bg-1-input{background-color:var(--col-bg-1-input)}.col-primary-bg-1{background-color:var(--col-primary-bg-1)}.col-accent-bg-1{background-color:var(--col-accent-bg-1)}.col-success-bg-1{background-color:var(--col-success-bg-1)}.col-warning-bg-1{background-color:var(--col-warning-bg-1)}.col-error-bg-1{background-color:var(--col-error-bg-1)}.col-bg-2-lighter{background-color:var(--col-bg-2-lighter)}.col-bg-2{background-color:var(--col-bg-2)}.col-bg-2-darker{background-color:var(--col-bg-2-darker)}.col-bg-2-button{background-color:var(--col-bg-2-button)}.col-bg-2-input{background-color:var(--col-bg-2-input)}.col-primary-bg-2{background-color:var(--col-primary-bg-2)}.col-accent-bg-2{background-color:var(--col-accent-bg-2)}.col-success-bg-2{background-color:var(--col-success-bg-2)}.col-warning-bg-2{background-color:var(--col-warning-bg-2)}.col-error-bg-2{background-color:var(--col-error-bg-2)}.col-bg-3-lighter{background-color:var(--col-bg-3-lighter)}.col-bg-3{background-color:var(--col-bg-3)}.col-bg-3-darker{background-color:var(--col-bg-3-darker)}.col-bg-3-button{background-color:var(--col-bg-3-button)}.col-bg-3-input{background-color:var(--col-bg-3-input)}.col-primary-bg-3{background-color:var(--col-primary-bg-3)}.col-accent-bg-3{background-color:var(--col-accent-bg-3)}.col-success-bg-3{background-color:var(--col-success-bg-3)}.col-warning-bg-3{background-color:var(--col-warning-bg-3)}.col-error-bg-3{background-color:var(--col-error-bg-3)}.col-bg-ack-lighter{background-color:var(--col-bg-ack-lighter)}.col-bg-ack{background-color:var(--col-bg-ack)}.col-bg-ack-darker{background-color:var(--col-bg-ack-darker)}.col-primary-bg-ack{background-color:var(--col-primary-bg-ack)}.col-accent-bg-ack{background-color:var(--col-accent-bg-ack)}.col-bg-att-lighter{background-color:var(--col-bg-att-lighter)}.col-bg-att{background-color:var(--col-bg-att)}.col-bg-att-darker{background-color:var(--col-bg-att-darker)}.col-primary-bg-att{background-color:var(--col-primary-bg-att)}.col-accent-bg-att{background-color:var(--col-accent-bg-att)}.col-bg-alert-lighter{background-color:var(--col-bg-alert-lighter)}.col-bg-alert{background-color:var(--col-bg-alert)}.col-bg-alert-darker{background-color:var(--col-bg-alert-darker)}.col-primary-bg-alert{background-color:var(--col-primary-bg-alert)}.col-accent-bg-alert{background-color:var(--col-accent-bg-alert)}.col-bg-btn-lighter{background-color:var(--col-bg-btn-lighter)}.col-bg-btn{background-color:var(--col-bg-btn)}.col-bg-btn-darker{background-color:var(--col-bg-btn-darker)}.col-primary-bg-btn{background-color:var(--col-primary-bg-btn)}.col-accent-bg-btn{background-color:var(--col-accent-bg-btn)}.pattern-diagonal-stripes-sm{background:repeating-linear-gradient(45deg,transparent,transparent 10px,currentColor 10px,currentColor 20px)}.pattern-dots-lg{background-image:radial-gradient(currentColor 1.5px,transparent 1.5px);background-size:15px 15px}.pattern-dots-md{background-image:radial-gradient(currentColor 1px,transparent 1px);background-size:8px 8px}.pattern-dots-medium-dense{background-image:radial-gradient(currentColor .5px,transparent .5px);background-size:3px 3px}.pattern-dots-sm{background-image:radial-gradient(currentColor .5px,transparent .5px);background-size:5px 5px}.pattern-cross-dots-md,.imagelist-background{background-image:radial-gradient(currentColor .7px,transparent 1px),radial-gradient(currentColor .7px,transparent 1px);background-size:6.5px 6.5px;background-position:0 0,3.5px 3.5px}.imagelist-background{background-color:#fff9;background-blend-mode:overlay}p,div{padding:0;margin:0;border:0px;-webkit-user-select:text;user-select:text}select{-webkit-user-select:none;user-select:none}.fa,.fas{font-family:"Font Awesome 5 Free";font-weight:900;font-style:normal}.fa-trash:before{content:""}.fa-view-grid:before{content:""}.fa-view-list:before{content:""}.fa-camera:before{content:""}.fa-view-image:before{content:""}.fa-check:before{content:""}.fa-exclamation-circle:before{content:""}.list-header{position:sticky;z-index:1;top:0}:host{display:block;background-color:var(--col-bg-body);border:solid 2px var(--col-bg-1-darker);overflow-y:hidden;padding-bottom:.5em}div,p{font-family:var(--standard-text-font)}.cm-list{display:grid;overflow-y:scroll;height:100%;width:100%;max-height:35vh;grid-row-gap:5px;grid-template-rows:[header] auto;grid-template-columns:repeat(7,auto);border-top:solid var(--col-bg-1-darker) 2px}.cm-list div{padding-right:1em}.cm-list.cm-list-with-member{grid-template-columns:repeat(8,auto)}.list-header{background:var(--col-bg-1-lighter);font-weight:700;padding-top:1em;border-bottom:solid 1px var(--col-bg-1-darker)}.headline{background-color:var(--col-bg-1-lighter);color:var(--col-primary-bg-1);padding:2px;font-weight:700}.controls{display:flex;flex-direction:row;background-color:var(--col-bg-1-lighter);color:var(--col-primary-bg-1);padding:2px;font-weight:700;justify-content:space-between}.no-data{padding:2px}#sort-type-selector{padding-right:1em}.center-col{display:flex;justify-content:center}';
  var $p = Object.defineProperty, Mp = Object.getOwnPropertyDescriptor, Ip = Object.getPrototypeOf, Np = Reflect.get, zp = (r, e, t, o) => {
    for (var i = o > 1 ? void 0 : o ? Mp(e, t) : e, a = r.length - 1, n; a >= 0; a--)
      (n = r[a]) && (i = (o ? n(e, t, i) : n(i)) || i);
    return o && i && $p(e, t, i), i;
  }, Lp = (r, e, t) => Np(Ip(r), t, e);
  class Rp {
  }
  let qe = class extends z {
    constructor() {
      super(), this.selected_date = null, this.selected_context = "", this.selected_context_uid = "", this.selected_member = "", this.cm = [], this.fetching = !1, this.fetch_error = "", this.cmCount = 0, this.selected_sort = "identifier", this.term_for_cm = "collected material", this.plural_for_cm = "collected materials", this.cm_types = {}, this.sort_by = {
        identifier: ["identifier", "modified"],
        creation: ["created", "identifier"],
        type: ["cm_type", "created", "identifier"],
        material: ["type", "created", "identifier"]
      };
    }
    get_conditions(r, e, t) {
      let o = `record_type in ('collected_material', 'collected_material_photo') and modified_date = '${r}'`;
      return (e || t) && (e && (o = o + ` and identifier = '${e}'`), t && (o = o + ` and modified_by ='${t}'`)), o;
    }
    fetch_data() {
      this.fetching = !0;
      const r = ot(this.selected_date), e = `
            primary_identifier, identifier, cm_type, nolot, nodescription, created, modified_by, modified_date, 
            record_type, type, count(data_uuid) c 
            from {base} 
            where ${this.get_conditions(r, this.selected_context, this.selected_member)}
            group by primary_identifier, identifier, cm_type, nolot, nodescription, created, modified_by, modified_date, 
            record_type, type         
        `, t = {
        cql: {
          base: {
            scope: {
              unit: {
                locus: {
                  collected_material: {
                    collected_material_photo: {}
                  }
                }
              }
            },
            target: {
              field_or_instruction: "replfield_modified()"
            },
            additional_fields: {
              modified_date: {
                field_or_instruction: "replfield_modified()",
                default: "",
                format: "datetime(date)"
              },
              modified_by: {
                field_or_instruction: "replfield_modified_by()",
                default: ""
              },
              modified_timestamp: {
                field_or_instruction: "replfield_modified()",
                default: ""
              },
              created: {
                field_or_instruction: "collected_material.replfield_created()",
                default: "null",
                format: "datetime(date)"
              },
              type: {
                field_or_instruction: "collected_material.type",
                default: "",
                format: "dsd_type(varchar)"
              },
              nolot: {
                field_or_instruction: "collected_material.uid_lot",
                default: "false",
                format: "isempty()"
              },
              nodescription: {
                field_or_instruction: "collected_material.description",
                default: "true",
                format: "isempty()"
              },
              cm_type: {
                field_or_instruction: "collected_material.cm_type",
                default: "-",
                format: "dsd_type(varchar)"
              }
            }
          },
          meta: {
            version: 0.1
            // "comment": "cmwidget"
          },
          query: {
            type: "DirectSqlQuery",
            sql: e
          }
        }
      };
      let o = new URLSearchParams({
        page_size: "-1"
      });
      this.apiContext.fetchFromApi(
        "",
        "cql/query",
        {
          method: "POST",
          caller: "cmwidget.fetch_data",
          body: JSON.stringify(t)
        },
        "v1",
        o
      ).then((i) => {
        i.result_msg !== "ok" ? this.fetch_error = i.result_msg : (this.fetch_error = "", this.load_records(i.records)), this.fetching = !1;
      }).catch((i) => {
        J(this, i, "cmwidget.fetch_data", null);
      });
    }
    load_records(r) {
      this.cm = [];
      let e = {};
      r.forEach((t) => {
        const o = t.primary_identifier;
        let i;
        o in e ? i = e[o] : (i = new Rp(), e[o] = i, this.cm.push(i), i.photoCount = 0, i.lot = !1, i.type = "?", i.hasDescription = !1, i.cm_type = "bulk", i.record_type = "", i.modified = 0, i.cm_creation = "?"), i.identifier = t.primary_identifier, i.unitId = t.identifier, i.record_type = t.record_type, t.modified > i.modified && (i.modified = t.modified), i.modified_by = t.modified_by, t.type && (i.type = t.type), t.cm_type && (i.cm_type = this.cm_types[t.cm_type]), t.created && (i.cm_creation = ae(t.created).toLocaleDateString(), i.created = ae(t.created).getTime()), t.nodescription || (i.hasDescription = !0), t.nolot || (i.lot = !0), t.record_type == "collected_material_photo" && (i.photoCount = t.c);
      }), this.cmCount = Object.keys(this.cm).length, this.sort_records(this.sort_by[this.selected_sort]);
    }
    sort_records(r) {
      function e(t, o) {
        for (let i = 0; i < r.length; i++) {
          let a = r[i], n = t[a], s = o[a], l = 0;
          if (typeof n == "string" ? l = n.localeCompare(s) : typeof n == "boolean" ? (n && !s && (l = -1), !n && s && (l = 1)) : (n < s && (l = -1), n > s && (l = 1)), l != 0)
            return l;
        }
        return 0;
      }
      this.cm.sort(e), this.requestUpdate();
    }
    stateChanged(r) {
      if (this.fetch_error || r.initState == 0)
        return;
      let e = !1;
      if ("dateSelector" in r.selectors) {
        let t = r.selectors.dateSelector.selectedDate;
        if ((!this.selected_date || t.getTime() !== this.selected_date.getTime()) && (this.selected_date = t, e = !0), "contextSelector" in r.selectors) {
          let o = r.selectors.contextSelector.selectedContext;
          o !== this.selected_context && (this.selected_context = o, this.selected_context_uid = r.selectors.contextSelector.selectedUid, e = !0);
        }
        if ("teamSelector" in r.selectors) {
          let o = r.selectors.teamSelector.selectedMember;
          o !== this.selected_member && (this.selected_member = o, e = !0);
        }
        e && this.fetch_data();
      }
      if (r.constants.length > 0) {
        this.term_for_cm = de(
          r.constants,
          "standard_term_for_cm",
          !1,
          this.term_for_cm
        ), this.plural_for_cm = de(
          r.constants,
          "standard_term_for_cm",
          !0,
          this.term_for_cm
        );
        for (let t = 0; t < r.constants.length; t++) {
          let o = r.constants[t];
          o.path === "constants/collected_material_types" && (this.cm_types[o.key] = o.value);
        }
      }
    }
    apiRender() {
      return h`
                    <div class="cm-widget">
                        <div class="headline">
                            <p>${this.cmCount} ${this.cmCount == 1 ? this.term_for_cm : this.plural_for_cm}</p>
                        </div>
                        <div class="controls">
                            <div class="controls-left">
                                ${this.renderSortSelector()}
                            </div>
                        </div>
                        ${this.selected_date !== null ? this.render_widget() : h`Please select a date`}
                    </div>`;
    }
    sortTypeChanged(r) {
      this.selected_sort = r.currentTarget.value, this.sort_records(this.sort_by[this.selected_sort]);
    }
    renderSortSelector() {
      return h`
            <label for="sort-type-selector">sort by</label>
            <select name="sort-type-selector" id="sort-type-selector" @change="${this.sortTypeChanged}">
                ${Object.keys(this.sort_by).map(
        (r) => h`
                            <option value="${r}"
                                    ?selected="${this.selected_sort === r}">
                                ${r}
                            </option>
                        `
      )}
            </select>
        `;
    }
    render_widget() {
      return this.selected_date ? this.fetching ? h`fetching data ...` : this.cmCount == 0 ? h`
                    <div class="no-data">
                        <p>No data found for your selection</p>
                    </div>` : h`
                <div class="cm-list ${this.selected_member ? void 0 : "cm-list-with-member"}">
                    <div class="list-header">identifier</div>
                    <div class="list-header">material</div>
                    <div class="list-header">creation</div>
                    <div class="list-header">description?</div>
                    <div class="list-header">type</div>
                    <div class="list-header">lot?</div>
                    <div class="list-header">photos</div>
                    ${this.selected_member ? void 0 : h`<div class="list-header">by</div>`}
                    ${this.cm.map(
        (r) => h`
                        <div>
                            ${this.selected_context ? void 0 : h`${r.unitId}/`}${r.identifier}
                        </div>
                        <div>${r.type}</div>
                        <div>${r.cm_creation}</div>
                        <div class="center-col">${r.hasDescription ? h`                                
                                    <i class="fa fa-check"></i>
                                ` : void 0}</div>
                        <div>${r.cm_type}</div>
                        <div class="center-col">${r.lot ? h`                                
                                    <i class="fa fa-check"></i>
                                ` : void 0}</div>
                        <div class="center-col">${r.photoCount}</div>
                        ${this.selected_member ? void 0 : h`<div class="center-col">${r.modified_by}</div>`}
                                `
      )}
                </div>` : h`please select a date`;
    }
  };
  qe.styles = H(Op);
  qe.properties = {
    ...Lp(qe, qe, "properties"),
    selected_context: { type: String },
    selected_date: { type: Date },
    selected_member: { type: String },
    fetching: { type: Boolean },
    sort_by: { type: Array },
    term_for_cm: { type: String }
  };
  qe = zp([
    W("cm-widget")
  ], qe);
  const Fp = '.col-bg-body-lighter{background-color:var(--col-bg-body-lighter)}.col-bg-body{background-color:var(--col-bg-body)}.col-bg-body-darker{background-color:var(--col-bg-body-darker)}.col-bg-1-lighter{background-color:var(--col-bg-1-lighter)}.col-bg-1{background-color:var(--col-bg-1)}.col-bg-1-darker{background-color:var(--col-bg-1-darker)}.col-bg-1-input{background-color:var(--col-bg-1-input)}.col-primary-bg-1{background-color:var(--col-primary-bg-1)}.col-accent-bg-1{background-color:var(--col-accent-bg-1)}.col-success-bg-1{background-color:var(--col-success-bg-1)}.col-warning-bg-1{background-color:var(--col-warning-bg-1)}.col-error-bg-1{background-color:var(--col-error-bg-1)}.col-bg-2-lighter{background-color:var(--col-bg-2-lighter)}.col-bg-2{background-color:var(--col-bg-2)}.col-bg-2-darker{background-color:var(--col-bg-2-darker)}.col-bg-2-button{background-color:var(--col-bg-2-button)}.col-bg-2-input{background-color:var(--col-bg-2-input)}.col-primary-bg-2{background-color:var(--col-primary-bg-2)}.col-accent-bg-2{background-color:var(--col-accent-bg-2)}.col-success-bg-2{background-color:var(--col-success-bg-2)}.col-warning-bg-2{background-color:var(--col-warning-bg-2)}.col-error-bg-2{background-color:var(--col-error-bg-2)}.col-bg-3-lighter{background-color:var(--col-bg-3-lighter)}.col-bg-3{background-color:var(--col-bg-3)}.col-bg-3-darker{background-color:var(--col-bg-3-darker)}.col-bg-3-button{background-color:var(--col-bg-3-button)}.col-bg-3-input{background-color:var(--col-bg-3-input)}.col-primary-bg-3{background-color:var(--col-primary-bg-3)}.col-accent-bg-3{background-color:var(--col-accent-bg-3)}.col-success-bg-3{background-color:var(--col-success-bg-3)}.col-warning-bg-3{background-color:var(--col-warning-bg-3)}.col-error-bg-3{background-color:var(--col-error-bg-3)}.col-bg-ack-lighter{background-color:var(--col-bg-ack-lighter)}.col-bg-ack{background-color:var(--col-bg-ack)}.col-bg-ack-darker{background-color:var(--col-bg-ack-darker)}.col-primary-bg-ack{background-color:var(--col-primary-bg-ack)}.col-accent-bg-ack{background-color:var(--col-accent-bg-ack)}.col-bg-att-lighter{background-color:var(--col-bg-att-lighter)}.col-bg-att{background-color:var(--col-bg-att)}.col-bg-att-darker{background-color:var(--col-bg-att-darker)}.col-primary-bg-att{background-color:var(--col-primary-bg-att)}.col-accent-bg-att{background-color:var(--col-accent-bg-att)}.col-bg-alert-lighter{background-color:var(--col-bg-alert-lighter)}.col-bg-alert{background-color:var(--col-bg-alert)}.col-bg-alert-darker{background-color:var(--col-bg-alert-darker)}.col-primary-bg-alert{background-color:var(--col-primary-bg-alert)}.col-accent-bg-alert{background-color:var(--col-accent-bg-alert)}.col-bg-btn-lighter{background-color:var(--col-bg-btn-lighter)}.col-bg-btn{background-color:var(--col-bg-btn)}.col-bg-btn-darker{background-color:var(--col-bg-btn-darker)}.col-primary-bg-btn{background-color:var(--col-primary-bg-btn)}.col-accent-bg-btn{background-color:var(--col-accent-bg-btn)}.pattern-diagonal-stripes-sm{background:repeating-linear-gradient(45deg,transparent,transparent 10px,currentColor 10px,currentColor 20px)}.pattern-dots-lg{background-image:radial-gradient(currentColor 1.5px,transparent 1.5px);background-size:15px 15px}.pattern-dots-md{background-image:radial-gradient(currentColor 1px,transparent 1px);background-size:8px 8px}.pattern-dots-medium-dense{background-image:radial-gradient(currentColor .5px,transparent .5px);background-size:3px 3px}.pattern-dots-sm{background-image:radial-gradient(currentColor .5px,transparent .5px);background-size:5px 5px}.pattern-cross-dots-md,.imagelist-background{background-image:radial-gradient(currentColor .7px,transparent 1px),radial-gradient(currentColor .7px,transparent 1px);background-size:6.5px 6.5px;background-position:0 0,3.5px 3.5px}.imagelist-background{background-color:#fff9;background-blend-mode:overlay}p,div{padding:0;margin:0;border:0px;-webkit-user-select:text;user-select:text}select{-webkit-user-select:none;user-select:none}.fa,.fas{font-family:"Font Awesome 5 Free";font-weight:900;font-style:normal}.fa-trash:before{content:""}.fa-view-grid:before{content:""}.fa-view-list:before{content:""}.fa-camera:before{content:""}.fa-view-image:before{content:""}.fa-check:before{content:""}.fa-exclamation-circle:before{content:""}.list-header{position:sticky;z-index:1;top:0}:host{background-color:var(--col-bg-body);display:block;border:solid 2px var(--col-bg-1-darker);overflow-y:hidden;padding-bottom:.5em}div,p{font-family:var(--standard-text-font)}.feature-list{display:grid;overflow-y:scroll;height:100%;width:100%;max-height:35vh;grid-row-gap:5px;grid-template-rows:[header] auto;grid-template-columns:repeat(4,auto);border-top:solid var(--col-bg-1-darker) 2px}.feature-list div{padding-right:1em}.feature-list.feature-list-with-member{grid-template-columns:repeat(5,auto)}.list-header{background:var(--col-bg-1-lighter);font-weight:700;padding-top:1em;border-bottom:solid var(--col-bg-1-darker) 1px}.list-identifier{cursor:pointer;text-decoration:underline}.headline{background-color:var(--col-bg-1-lighter);color:var(--col-primary-bg-1);padding:2px;font-weight:700}.controls{display:flex;flex-direction:row;background-color:var(--col-bg-1-lighter);color:var(--col-primary-bg-1);padding:2px;font-weight:700;justify-content:space-between}.no-data{padding:2px}#sort-type-selector{padding-right:1em}.center-col{display:flex;justify-content:center}';
  var Hp = Object.defineProperty, Bp = Object.getOwnPropertyDescriptor, jp = Object.getPrototypeOf, Up = Reflect.get, Vp = (r, e, t, o) => {
    for (var i = o > 1 ? void 0 : o ? Bp(e, t) : e, a = r.length - 1, n; a >= 0; a--)
      (n = r[a]) && (i = (o ? n(e, t, i) : n(i)) || i);
    return o && i && Hp(e, t, i), i;
  }, qp = (r, e, t) => Up(jp(r), t, e);
  class Yp {
  }
  let Ye = class extends z {
    constructor() {
      super(), this.login_token = "", this.api_url = "", this.selected_date = null, this.selected_context = "", this.selected_context_uid = "", this.selected_member = "", this.features = [], this.fetching = !1, this.fetch_error = "", this.featureCount = 0, this.selected_sort = "identifier", this.selected_context_type = "", this.term_for_feature = "feature", this.plural_for_feature = "features", this.sort_by = {
        identifier: ["identifier", "modified"],
        creation: ["created", "identifier"]
      };
    }
    get_conditions(r) {
      let e = this.selected_context, t = `unit_type = 'feature' and record_type in ('unit', 'dayplan') and modified_date = '${r}'`;
      return e && (this.selected_context_type === "feature" ? t = t + ` and identifier = '${e}'` : t = t + ` and "id_uuid" in (select "uid_dst_unit" from unit_unit_relation where "uid_src_unit"='${this.selected_context_uid}')`), this.selected_member && (t = t + ` and modified_by ='${this.selected_member}'`), t;
    }
    fetch_data() {
      this.fetching = !0;
      const r = ot(this.selected_date), e = `
            id_uuid, primary_identifier, identifier, recorder, created, modified_by, modified_date, 
            record_type, type, unit_type, count(data_uuid) c 
            from {base} 
            where ${this.get_conditions(r)}
            group by id_uuid, primary_identifier, identifier, recorder, created, modified_by, modified_date, 
            record_type, type, unit_type         
        `, t = {
        cql: {
          base: {
            scope: {
              unit: {
                feature_unit: {
                  dayplan: {
                    join: "inner(uid_unit, uid_unit)"
                  },
                  locus: {
                    join: "inner(uid_unit, uid_unit)",
                    relates_to: {
                      collected_material: {}
                    }
                  }
                }
              }
            },
            target: {
              field_or_instruction: "replfield_modified()"
            },
            additional_fields: {
              // "id_uuid": {
              //     "field_or_instruction": "id_uuid",
              //     "default": "",
              // },
              modified_date: {
                field_or_instruction: "replfield_modified()",
                default: "",
                format: "datetime(date)"
              },
              modified_by: {
                field_or_instruction: "replfield_modified_by()",
                default: "",
                format: "dsd_type(varchar)"
              },
              modified_timestamp: {
                field_or_instruction: "replfield_modified()",
                default: ""
              },
              created: {
                field_or_instruction: "feature_unit.replfield_created()",
                default: "null",
                format: "datetime(date)"
              },
              type: {
                field_or_instruction: "feature_unit.feature_type",
                default: "",
                format: "dsd_type(varchar)"
              },
              unit_type: {
                field_or_instruction: "unit.type",
                default: "",
                format: "dsd_type(varchar)"
              },
              recorder: {
                field_or_instruction: "unit.id_excavator",
                default: "",
                format: "dsd_type(varchar)"
              }
            }
          },
          meta: {
            version: 0.1
          },
          query: {
            type: "DirectSqlQuery",
            sql: e
          }
        }
      };
      this.apiContext.fetchFromApi(
        "",
        "cql/query",
        {
          method: "POST",
          body: JSON.stringify(t),
          caller: "featurewidget.fetch_data"
        }
      ).then((o) => {
        o.result_msg !== "ok" ? this.fetch_error = o.result_msg : (this.fetch_error = "", this.load_records(o.records)), this.fetching = !1;
      }).catch((o) => {
        J(this, o, "featureWidget.fetch_data", null);
      });
    }
    load_records(r) {
      this.features = [];
      let e = {};
      r.forEach((t) => {
        const o = t.identifier;
        let i;
        o in e ? i = e[o] : (i = new Yp(), e[o] = i, this.features.push(i), i.photoCount = 0, i.type = "?", i.modified = 0, i.feature_creation = "?", i.modified_by = ""), i.identifier = t.identifier, i.uid = t.id_uuid, t.modified > i.modified && (i.modified = t.modified), i.modified_by = t.modified_by, t.type && (i.type = t.type), t.created && (i.feature_creation = ae(t.created).toLocaleDateString(), i.created = ae(t.created).getTime()), t.record_type == "dayplan" && (i.photoCount = t.c);
      }), this.featureCount = Object.keys(this.features).length, this.sort_records(this.sort_by[this.selected_sort]);
    }
    sort_records(r) {
      function e(t, o) {
        for (let i = 0; i < r.length; i++) {
          let a = r[i], n = t[a], s = o[a], l = 0;
          if (typeof n == "string" ? l = n.localeCompare(s) : typeof n == "boolean" ? (n && !s && (l = -1), !n && s && (l = 1)) : (n < s && (l = -1), n > s && (l = 1)), l != 0)
            return l;
        }
        return 0;
      }
      this.features.sort(e), this.requestUpdate();
    }
    stateChanged(r) {
      if (this.fetch_error)
        return h`Error fetching: ${this.fetch_error}`;
      if (r.initState == 0)
        return;
      let e = !1;
      if ("dateSelector" in r.selectors) {
        let t = r.selectors.dateSelector.selectedDate;
        if ((!this.selected_date || t.getTime() !== this.selected_date.getTime()) && (this.selected_date = t, e = !0), "contextSelector" in r.selectors) {
          let o = r.selectors.contextSelector.selectedContext;
          o !== this.selected_context && (this.selected_context = o, this.selected_context_uid = r.selectors.contextSelector.selectedUid, this.selected_context_type = r.selectors.contextSelector.selectedContextType, e = !0);
        }
        if ("teamSelector" in r.selectors) {
          let o = r.selectors.teamSelector.selectedMember;
          o !== this.selected_member && (this.selected_member = o, e = !0);
        }
        e && this.fetch_data();
      }
      r.constants.length > 0 && (this.term_for_feature = de(
        r.constants,
        "standard_term_for_feature_unit",
        !1,
        this.term_for_feature
      ), this.plural_for_feature = de(
        r.constants,
        "standard_term_for_feature_unit",
        !0,
        this.plural_for_feature
      ));
    }
    apiRender() {
      return h`
                    <div class="feature-widget">
                        <div class="headline">
                            <p>${this.featureCount} ${this.featureCount == 1 ? this.term_for_feature : this.plural_for_feature}</p>
                        </div>
                        <div class="controls">
                            <div class="controls-left">
                                ${this.renderSortSelector()}
                            </div>
                        </div>
                        ${this.selected_date !== null ? this.render_widget() : h`Please select a date`}
                    </div>`;
    }
    sortTypeChanged(r) {
      this.selected_sort = r.currentTarget.value, this.sort_records(this.sort_by[this.selected_sort]);
    }
    renderSortSelector() {
      return h`
            <label for="sort-type-selector">sort by</label>
            <select name="sort-type-selector" id="sort-type-selector" @change="${this.sortTypeChanged}">
                ${Object.keys(this.sort_by).map(
        (r) => h`
                            <option value="${r}"
                                    ?selected="${this.selected_sort === r}">
                                ${r}
                            </option>
                        `
      )}
            </select>
        `;
    }
    changeContext(r) {
      let e = { selectedContext: "", selectedUid: "", selectedContextType: "" };
      if (r) {
        let t = this.features.find((o) => o.identifier === r);
        e.selectedContext = t.identifier, e.selectedUid = t.uid, e.selectedContextType = "feature", X.dispatch(Ne("contextSelector", e));
      }
    }
    gotoIdentifier(r) {
      const e = r.currentTarget.getAttribute("context");
      e != this.selected_context && this.changeContext(e);
    }
    render_widget() {
      return this.selected_date ? this.fetching ? h`fetching data ...` : this.featureCount == 0 ? h`
                    <div class="no-data">
                        <p>No data found for your selection</p>
                    </div>` : h`
                    <div class="feature-list ${this.selected_member ? void 0 : "feature-list-with-member"}">
                        <div class="list-header">identifier</div>
                        <div class="list-header">type</div>
                        <div class="list-header">creation</div>
                        <div class="list-header">photos</div>
                        ${this.selected_member ? void 0 : h`<div class="list-header">by</div>`}
                        ${this.features.map(
        (r) => h`
                                    <div class="list-identifier" context=${r.identifier} @click=${this.gotoIdentifier}>${r.identifier}</div>
                                    <div>${r.type}</div>
                                    <div>${r.feature_creation}</div>
                                    <div class="center-col">${r.photoCount}</div>
                                    ${this.selected_member ? void 0 : h`<div class="center-col">${r.modified_by}</div>`}
                                `
      )}
                        
                    </div>` : h`please select a date`;
    }
  };
  Ye.styles = H(Fp);
  Ye.properties = {
    ...qp(Ye, Ye, "properties"),
    selected_context: { type: String },
    selected_date: { type: Date },
    selected_member: { type: String },
    fetching: { type: Boolean },
    sort_by: { type: Array },
    term_for_feature: { type: String }
  };
  Ye = Vp([
    W("feature-widget")
  ], Ye);
  const Wp = '.col-bg-body-lighter{background-color:var(--col-bg-body-lighter)}.col-bg-body{background-color:var(--col-bg-body)}.col-bg-body-darker{background-color:var(--col-bg-body-darker)}.col-bg-1-lighter{background-color:var(--col-bg-1-lighter)}.col-bg-1{background-color:var(--col-bg-1)}.col-bg-1-darker{background-color:var(--col-bg-1-darker)}.col-bg-1-input{background-color:var(--col-bg-1-input)}.col-primary-bg-1{background-color:var(--col-primary-bg-1)}.col-accent-bg-1{background-color:var(--col-accent-bg-1)}.col-success-bg-1{background-color:var(--col-success-bg-1)}.col-warning-bg-1{background-color:var(--col-warning-bg-1)}.col-error-bg-1{background-color:var(--col-error-bg-1)}.col-bg-2-lighter{background-color:var(--col-bg-2-lighter)}.col-bg-2{background-color:var(--col-bg-2)}.col-bg-2-darker{background-color:var(--col-bg-2-darker)}.col-bg-2-button{background-color:var(--col-bg-2-button)}.col-bg-2-input{background-color:var(--col-bg-2-input)}.col-primary-bg-2{background-color:var(--col-primary-bg-2)}.col-accent-bg-2{background-color:var(--col-accent-bg-2)}.col-success-bg-2{background-color:var(--col-success-bg-2)}.col-warning-bg-2{background-color:var(--col-warning-bg-2)}.col-error-bg-2{background-color:var(--col-error-bg-2)}.col-bg-3-lighter{background-color:var(--col-bg-3-lighter)}.col-bg-3{background-color:var(--col-bg-3)}.col-bg-3-darker{background-color:var(--col-bg-3-darker)}.col-bg-3-button{background-color:var(--col-bg-3-button)}.col-bg-3-input{background-color:var(--col-bg-3-input)}.col-primary-bg-3{background-color:var(--col-primary-bg-3)}.col-accent-bg-3{background-color:var(--col-accent-bg-3)}.col-success-bg-3{background-color:var(--col-success-bg-3)}.col-warning-bg-3{background-color:var(--col-warning-bg-3)}.col-error-bg-3{background-color:var(--col-error-bg-3)}.col-bg-ack-lighter{background-color:var(--col-bg-ack-lighter)}.col-bg-ack{background-color:var(--col-bg-ack)}.col-bg-ack-darker{background-color:var(--col-bg-ack-darker)}.col-primary-bg-ack{background-color:var(--col-primary-bg-ack)}.col-accent-bg-ack{background-color:var(--col-accent-bg-ack)}.col-bg-att-lighter{background-color:var(--col-bg-att-lighter)}.col-bg-att{background-color:var(--col-bg-att)}.col-bg-att-darker{background-color:var(--col-bg-att-darker)}.col-primary-bg-att{background-color:var(--col-primary-bg-att)}.col-accent-bg-att{background-color:var(--col-accent-bg-att)}.col-bg-alert-lighter{background-color:var(--col-bg-alert-lighter)}.col-bg-alert{background-color:var(--col-bg-alert)}.col-bg-alert-darker{background-color:var(--col-bg-alert-darker)}.col-primary-bg-alert{background-color:var(--col-primary-bg-alert)}.col-accent-bg-alert{background-color:var(--col-accent-bg-alert)}.col-bg-btn-lighter{background-color:var(--col-bg-btn-lighter)}.col-bg-btn{background-color:var(--col-bg-btn)}.col-bg-btn-darker{background-color:var(--col-bg-btn-darker)}.col-primary-bg-btn{background-color:var(--col-primary-bg-btn)}.col-accent-bg-btn{background-color:var(--col-accent-bg-btn)}.pattern-diagonal-stripes-sm{background:repeating-linear-gradient(45deg,transparent,transparent 10px,currentColor 10px,currentColor 20px)}.pattern-dots-lg{background-image:radial-gradient(currentColor 1.5px,transparent 1.5px);background-size:15px 15px}.pattern-dots-md{background-image:radial-gradient(currentColor 1px,transparent 1px);background-size:8px 8px}.pattern-dots-medium-dense{background-image:radial-gradient(currentColor .5px,transparent .5px);background-size:3px 3px}.pattern-dots-sm{background-image:radial-gradient(currentColor .5px,transparent .5px);background-size:5px 5px}.pattern-cross-dots-md,.imagelist-background{background-image:radial-gradient(currentColor .7px,transparent 1px),radial-gradient(currentColor .7px,transparent 1px);background-size:6.5px 6.5px;background-position:0 0,3.5px 3.5px}.imagelist-background{background-color:#fff9;background-blend-mode:overlay}p,div{padding:0;margin:0;border:0px;-webkit-user-select:text;user-select:text}select{-webkit-user-select:none;user-select:none}.fa,.fas{font-family:"Font Awesome 5 Free";font-weight:900;font-style:normal}.fa-trash:before{content:""}.fa-view-grid:before{content:""}.fa-view-list:before{content:""}.fa-camera:before{content:""}.fa-view-image:before{content:""}.fa-check:before{content:""}.fa-exclamation-circle:before{content:""}:host{width:45vw;max-width:45vw;background-color:var(--col-bg-body);display:block;border:solid 2px var(--col-bg-1-darker);box-sizing:border-box;overflow-y:hidden;height:100%}div,p{font-family:var(--standard-text-font);padding:0;box-sizing:border-box}.file-list{overflow-y:scroll;height:100%;width:100%;max-height:35vh}.headline{background-color:var(--col-bg-1-lighter);color:var(--col-primary-bg-1);padding:2px;font-weight:700}.controls{display:flex;flex-direction:row;background-color:var(--col-bg-1-lighter);color:var(--col-primary-bg-1);padding:2px;font-weight:700;justify-content:space-between}.controls i{margin:0 5px;border:1px solid rgba(0,0,0,0);padding:2px;width:1em;height:1em}.controls-left{display:flex;flex-basis:auto;flex-wrap:wrap}.controls-right{min-width:100px;flex-basis:min-content;display:flex}.controls-right i{line-height:1em;text-align:center}.selected-view-mode{background-color:var(--col-bg-ack);color:var(--col-accent-bg-ack);border:1px solid var(--col-bg-1-darker)}.control-container{display:flex;margin-right:1em}label{padding-right:.5em;text-wrap:none;white-space:nowrap}.no-files{padding:2px}.file{font-family:var(--standard-text-font);padding:.2em;border-bottom:var(--col-bg-1-darker) 2px solid;display:flex;flex-direction:row}.file-headline{display:flex;flex-direction:column;margin-left:.5em;width:calc(100% - 1em)}.main-headline{font-weight:700;display:flex;flex-direction:row;justify-content:space-between}.file-grid{display:flex;flex-direction:row;flex-wrap:wrap;overflow-y:scroll;height:100%;width:100%;max-height:35vh;justify-content:space-between}.file-view{display:flex;flex-direction:column;height:100%;padding:0;width:calc(100% - 5px);max-height:35vh;margin:2px;overflow:auto}.grid-cell{display:flex;flex-direction:column;justify-content:space-between}.grid-cell p{margin-bottom:1em}.selected-image{border:2px solid var(--col-bg-1-lighter);box-shadow:2px 2px 10px var(--col-bg-1-lighter);padding:1px}', Gp = '.col-bg-body-lighter{background-color:var(--col-bg-body-lighter)}.col-bg-body{background-color:var(--col-bg-body)}.col-bg-body-darker{background-color:var(--col-bg-body-darker)}.col-bg-1-lighter{background-color:var(--col-bg-1-lighter)}.col-bg-1{background-color:var(--col-bg-1)}.col-bg-1-darker{background-color:var(--col-bg-1-darker)}.col-bg-1-input{background-color:var(--col-bg-1-input)}.col-primary-bg-1{background-color:var(--col-primary-bg-1)}.col-accent-bg-1{background-color:var(--col-accent-bg-1)}.col-success-bg-1{background-color:var(--col-success-bg-1)}.col-warning-bg-1{background-color:var(--col-warning-bg-1)}.col-error-bg-1{background-color:var(--col-error-bg-1)}.col-bg-2-lighter{background-color:var(--col-bg-2-lighter)}.col-bg-2{background-color:var(--col-bg-2)}.col-bg-2-darker{background-color:var(--col-bg-2-darker)}.col-bg-2-button{background-color:var(--col-bg-2-button)}.col-bg-2-input{background-color:var(--col-bg-2-input)}.col-primary-bg-2{background-color:var(--col-primary-bg-2)}.col-accent-bg-2{background-color:var(--col-accent-bg-2)}.col-success-bg-2{background-color:var(--col-success-bg-2)}.col-warning-bg-2{background-color:var(--col-warning-bg-2)}.col-error-bg-2{background-color:var(--col-error-bg-2)}.col-bg-3-lighter{background-color:var(--col-bg-3-lighter)}.col-bg-3{background-color:var(--col-bg-3)}.col-bg-3-darker{background-color:var(--col-bg-3-darker)}.col-bg-3-button{background-color:var(--col-bg-3-button)}.col-bg-3-input{background-color:var(--col-bg-3-input)}.col-primary-bg-3{background-color:var(--col-primary-bg-3)}.col-accent-bg-3{background-color:var(--col-accent-bg-3)}.col-success-bg-3{background-color:var(--col-success-bg-3)}.col-warning-bg-3{background-color:var(--col-warning-bg-3)}.col-error-bg-3{background-color:var(--col-error-bg-3)}.col-bg-ack-lighter{background-color:var(--col-bg-ack-lighter)}.col-bg-ack{background-color:var(--col-bg-ack)}.col-bg-ack-darker{background-color:var(--col-bg-ack-darker)}.col-primary-bg-ack{background-color:var(--col-primary-bg-ack)}.col-accent-bg-ack{background-color:var(--col-accent-bg-ack)}.col-bg-att-lighter{background-color:var(--col-bg-att-lighter)}.col-bg-att{background-color:var(--col-bg-att)}.col-bg-att-darker{background-color:var(--col-bg-att-darker)}.col-primary-bg-att{background-color:var(--col-primary-bg-att)}.col-accent-bg-att{background-color:var(--col-accent-bg-att)}.col-bg-alert-lighter{background-color:var(--col-bg-alert-lighter)}.col-bg-alert{background-color:var(--col-bg-alert)}.col-bg-alert-darker{background-color:var(--col-bg-alert-darker)}.col-primary-bg-alert{background-color:var(--col-primary-bg-alert)}.col-accent-bg-alert{background-color:var(--col-accent-bg-alert)}.col-bg-btn-lighter{background-color:var(--col-bg-btn-lighter)}.col-bg-btn{background-color:var(--col-bg-btn)}.col-bg-btn-darker{background-color:var(--col-bg-btn-darker)}.col-primary-bg-btn{background-color:var(--col-primary-bg-btn)}.col-accent-bg-btn{background-color:var(--col-accent-bg-btn)}.pattern-diagonal-stripes-sm{background:repeating-linear-gradient(45deg,transparent,transparent 10px,currentColor 10px,currentColor 20px)}.pattern-dots-lg{background-image:radial-gradient(currentColor 1.5px,transparent 1.5px);background-size:15px 15px}.pattern-dots-md{background-image:radial-gradient(currentColor 1px,transparent 1px);background-size:8px 8px}.pattern-dots-medium-dense{background-image:radial-gradient(currentColor .5px,transparent .5px);background-size:3px 3px}.pattern-dots-sm{background-image:radial-gradient(currentColor .5px,transparent .5px);background-size:5px 5px}.pattern-cross-dots-md,.imagelist-background{background-image:radial-gradient(currentColor .7px,transparent 1px),radial-gradient(currentColor .7px,transparent 1px);background-size:6.5px 6.5px;background-position:0 0,3.5px 3.5px}.imagelist-background{background-color:#fff9;background-blend-mode:overlay}p,div{padding:0;margin:0;border:0px;-webkit-user-select:text;user-select:text}select{-webkit-user-select:none;user-select:none}.fa,.fas{font-family:"Font Awesome 5 Free";font-weight:900;font-style:normal}.fa-trash:before{content:""}.fa-view-grid:before{content:""}.fa-view-list:before{content:""}.fa-camera:before{content:""}.fa-view-image:before{content:""}.fa-check:before{content:""}.fa-exclamation-circle:before{content:""}:host{display:block;padding:2px;box-sizing:border-box}div,p{font-family:var(--standard-text-font);box-sizing:border-box}.placeholder{width:128px;height:128px;display:flex;justify-content:center;align-items:center}.placeholder i{font-size:2em}img{object-fit:contain;width:100%;height:100%}';
  var Kp = Object.defineProperty, Xp = Object.getOwnPropertyDescriptor, Jp = Object.getPrototypeOf, Qp = Reflect.get, Zp = (r, e, t, o) => {
    for (var i = o > 1 ? void 0 : o ? Xp(e, t) : e, a = r.length - 1, n; a >= 0; a--)
      (n = r[a]) && (i = (o ? n(e, t, i) : n(i)) || i);
    return o && i && Kp(e, t, i), i;
  }, eg = (r, e, t) => Qp(Jp(r), t, e);
  let We = class extends z {
    constructor() {
      super(), this._resolution = "", this.description = "", this._visible = !1, this.loaded = !1, this.imageUrl = "", this.observer = null, this._uuid_file = "", this.observerCallback = this.observerCallback.bind(this), this._init();
    }
    get uuid_file() {
      return this._uuid_file;
    }
    set uuid_file(e) {
      e !== this._uuid_file && (this._uuid_file = e, this.load_image());
    }
    get resolution() {
      return this._resolution;
    }
    set resolution(e) {
      e !== this._resolution && (this._resolution = e, this.load_image());
    }
    get visible() {
      return this._visible;
    }
    set visible(e) {
      e !== this._visible && (this._visible = e, this.load_image());
    }
    _init() {
      this._visible = !1, this.loaded = !1;
    }
    connectedCallback() {
      super.connectedCallback(), this.setAttribute("role", "presentation"), this.initIntersectionObserver();
    }
    disconnectedCallback() {
      super.disconnectedCallback(), this.disconnectObserver();
    }
    /**
     * Sets the `intersecting` property when the element is on screen.
     * @param  {[IntersectionObserverEntry]} entries
     * @protected
     */
    observerCallback(e) {
      const t = ({ isIntersecting: o }) => o;
      e.some(t) && (this.visible = !0);
    }
    /**
     * Initializes the IntersectionObserver when the element instantiates.
     * @protected
     */
    initIntersectionObserver() {
      if (!("IntersectionObserver" in window))
        return this.visible = !0;
      if (this.observer)
        return;
      const e = "10px";
      this.observer = new IntersectionObserver(this.observerCallback, { rootMargin: e }), this.observer.observe(this);
    }
    /**
     * Disconnects and unloads the IntersectionObserver.
     * @protected
     */
    disconnectObserver() {
      this.observer.disconnect(), this.observer = null, delete this.observer;
    }
    clicked(e) {
      this.dispatchEvent(new CustomEvent(
        "select-image",
        { bubbles: !0, composed: !0, detail: this._uuid_file }
      ));
    }
    fetch_image() {
      this.loaded = !1;
      let e = new URLSearchParams({
        uuid: this._uuid_file,
        resolution: this._resolution
      });
      this.apiContext.fetchBlobFromApi(
        "",
        "files/file",
        {
          method: "GET",
          caller: "directorsview.fileview"
        },
        "v1",
        e
      ).then((t) => {
        this.imageUrl = URL.createObjectURL(t), this.loaded = !0;
      }).catch((t) => {
        t.response.status != 404 && J(this, t, "fileview.fetch_image", null);
      });
    }
    load_image() {
      this._resolution && this._uuid_file && this._visible && this.fetch_image();
    }
    render_image() {
      return h`<img @click="${this.clicked}" src="${this.imageUrl}" alt="${this.description}"/>`;
    }
    render_placeholder() {
      return h`
            <div class="placeholder"><i class="fa fa-camera"></i></div>`;
    }
    apiRender() {
      return h`
                    ${this.loaded ? this.render_image() : this.render_placeholder()}
                    </div>`;
    }
  };
  We.styles = H(Gp);
  We.properties = {
    ...eg(We, We, "properties"),
    uuid_file: { type: String },
    resolution: { type: String },
    loaded: { type: Boolean },
    imageUrl: { type: String },
    visible: { type: Boolean },
    description: { type: String }
  };
  We = Zp([
    W("file-view")
  ], We);
  var tg = Object.defineProperty, rg = Object.getOwnPropertyDescriptor, og = Object.getPrototypeOf, ig = Reflect.get, ag = (r, e, t, o) => {
    for (var i = o > 1 ? void 0 : o ? rg(e, t) : e, a = r.length - 1, n; a >= 0; a--)
      (n = r[a]) && (i = (o ? n(e, t, i) : n(i)) || i);
    return o && i && tg(e, t, i), i;
  }, ng = (r, e, t) => ig(og(r), t, e);
  class sg {
  }
  let Ge = class extends z {
    constructor() {
      super(), this.selected_date = null, this.selected_context = "", this.selected_member = "", this.selected_image = "", this.selected_sort = "modified", this.selected_resolution = "", this.files = [], this.fetching = !1, this.fetch_error = "", this.viewMode = "list", this.sort_by = {
        modified: ["modified", "identifier"],
        identifier: ["primary_identifier", "identifier", "created"]
      }, this.record_types = /* @__PURE__ */ new Set(), this.show_record_types = "", this.record_type_names = null, this.record_count = 0, this.page_size = 0;
    }
    connectedCallback() {
      super.connectedCallback(), this.fetchResolutions();
    }
    fetchResolutions() {
      this.selected_resolution || this.apiContext && this.apiContext.fetchFromApi(
        "",
        "files/resolutions",
        {
          method: "GET",
          caller: "filewidget.fetch_resolutions"
        }
      ).then((r) => {
        X.dispatch(_s("filewidget", "resolutions", r));
      }).catch((r) => {
        J(this, r, "fileWidget.fetchResolutions", null);
      });
    }
    get_conditions(r, e, t) {
      if (e || t) {
        let o = [`equals(modified_date, ${r})`];
        return e && o.push(`equals(base_identifier, '${e}')`), t && o.push(`equals(modified_by, '${t}')`), {
          AND: o
        };
      } else
        return {
          "?": `equals(modified_date, ${r})`
        };
    }
    fetch_data() {
      this.fetching = !0;
      const r = ot(this.selected_date), e = this.get_conditions(r, this.selected_context, this.selected_member);
      this.apiContext.fetchFromApi(
        "",
        "cql/query",
        {
          method: "POST",
          caller: "filewidget.fetch_data",
          body: JSON.stringify(
            {
              cql: {
                base: {
                  scope: {
                    unit: "browse()"
                  },
                  target: {
                    field_or_instruction: "uid_file()"
                  },
                  additional_fields: {
                    modified_date: {
                      field_or_instruction: "replfield_modified()",
                      default: "",
                      format: "datetime(date)"
                    },
                    modified_timestamp: {
                      field_or_instruction: "modified",
                      default: ""
                    },
                    modified_by: {
                      field_or_instruction: "modified_by",
                      default: ""
                    },
                    description: {
                      field_or_instruction: "describes_file()",
                      default: ""
                    },
                    image_description: {
                      field_or_instruction: "uid_file()",
                      default: "",
                      substitute: "lookup('images','uid','description')"
                    },
                    filename: {
                      field_or_instruction: "uid_file()",
                      default: "",
                      substitute: "lookup('images','uid','export_filename')"
                    }
                  }
                },
                meta: {
                  version: 0.1
                },
                query: {
                  columns: {
                    base_identifier: {
                      source_field: "identifier"
                    },
                    identifier: {
                      source_field: "primary_identifier"
                    },
                    modified_date: {
                      source_field: "modified_date"
                    },
                    modified_timestamp: {
                      source_field: "modified_timestamp"
                    },
                    modified_by: {
                      source_field: "modified_by"
                    },
                    description: {
                      source_field: "description"
                    },
                    image_description: {
                      source_field: "image_description"
                    },
                    filename: {
                      source_field: "filename"
                    },
                    record_type: {
                      source_field: "record_type"
                    },
                    uid_file: {
                      source_field: "data"
                    }
                  },
                  conditions: e,
                  distinct: "True",
                  type: "Raw"
                }
              }
            }
          )
        }
      ).then((t) => {
        t.result_msg !== "ok" ? (this.record_count = 0, this.fetch_error = t.result_msg) : (this.fetch_error = "", this.record_count = t.overall_record_count, this.page_size = t.page_size, this.load_files(t.records)), this.fetching = !1;
      }).catch((t) => {
        J(this, t, "filewidget.fetch_data", null);
      });
    }
    load_files(r) {
      this.files = [], this.record_types = /* @__PURE__ */ new Set(), r.forEach((e) => {
        let t = new sg();
        t.identifier = e.identifier, t.modified_by = e.modified_by ? e.modified_by : "?", t.modified = new Date(e.modified_timestamp), t.uid_file = e.uid_file, t.description = e.description, t.image_description = e.image_description, t.filename = e.filename, t.record_type = e.record_type, this.record_types.add(e.record_type), this.files.push(t);
      }), this.sort_records(this.sort_by[this.selected_sort]);
    }
    sort_records(r) {
      function e(o, i) {
        for (let a = 0; a < r.length; a++) {
          let n = r[a], s = o[n], l = i[n], c = 0;
          if (typeof s == "string" ? c = s.localeCompare(l) : (s < l && (c = -1), s > l && (c = 1)), c != 0)
            return c;
        }
        return 0;
      }
      this.files.sort(e);
      let t = "";
      this.files.forEach((o) => {
        (o.uid_file === this.selected_image || !t) && (t = o.uid_file);
      }), this.selected_image = t, this.requestUpdate();
    }
    // protected changeContext(context: string) {
    //     store.dispatch(setSelector("contextSelector", {"selectedContext": context}))
    // }
    setSmallestResolution(r) {
      let e = -1, t = "";
      for (let o = 0; o < r.length; o++) {
        let i = r[o].height * r[o].width;
        (e > i || e == -1) && (e = i, t = r[o].id);
      }
      return this.selected_resolution === t ? !1 : (this.selected_resolution = t, !0);
    }
    stateChanged(r) {
      let e = !1;
      if (r.initState != 0 && "dateSelector" in r.selectors && "filewidget" in r.dataviews) {
        let t = r.dataviews.filewidget;
        if ("resolutions" in t) {
          e = this.setSmallestResolution(t.resolutions);
          let o = r.selectors.dateSelector.selectedDate;
          if ((!this.selected_date || o.getTime() !== this.selected_date.getTime()) && (this.selected_date = o, e = !0), "contextSelector" in r.selectors) {
            let i = r.selectors.contextSelector.selectedContext;
            i !== this.selected_context && (this.selected_context = i, e = !0);
          }
          if ("teamSelector" in r.selectors) {
            let i = r.selectors.teamSelector.selectedMember;
            i !== this.selected_member && (this.selected_member = i, e = !0);
          }
          e && this.fetch_data();
        }
        r.constants.length > 0 && !this.record_type_names && (this.record_type_names = _a(r.constants), e || this.requestUpdate());
      }
    }
    recordTypeChanged(r) {
      const e = r.currentTarget.value;
      e === " all" ? this.show_record_types = "" : this.show_record_types = e;
    }
    gridView(r) {
      this.viewMode = "grid";
    }
    listView(r) {
      this.viewMode = "list";
    }
    imageView(r) {
      this.viewMode = "image";
    }
    selectImage(r) {
      const e = r.detail;
      this.selected_image = e, this.viewMode = "image";
    }
    apiRender() {
      const r = this.files.filter((e) => this.show_record_types === "" || e.record_type === this.show_record_types).length;
      return h`
                    <div class="file-widget">
                        <div class="headline">
                            <p>${r > this.page_size ? h`${this.page_size} of ${r}` : h`${r}`} Files</p>
                        </div>
                        <div class="controls">
                            <div class="controls-left">
                                ${this.renderRecordTypeSelector()}
                                ${this.renderSortSelector()}
                            </div>
                            <div class="controls-right">
                                <i @click=${this.listView}
                                   class="fa fa-view-list ${this.viewMode === "list" ? "selected-view-mode" : ""}"></i>
                                <i @click=${this.gridView}
                                   class="fa fa-view-grid ${this.viewMode === "grid" ? "selected-view-mode" : ""}"></i>
                                <i @click=${this.imageView}
                                   class="fa fa-view-image ${this.viewMode === "image" ? "selected-view-mode" : ""}"></i>
                            </div>
                        </div>
                        ${this.selected_date !== null && this.selected_resolution ? this.render_widget() : h`waiting for selection or server information...`}
                    </div>`;
    }
    renderRecordTypeSelector() {
      if (!this.selected_date)
        return h``;
      let r = Array.from(this.record_types);
      r.push(" all"), r.sort();
      let e = this.show_record_types == "" ? " all" : this.show_record_types;
      return h`
            <div class="control-container">
            <label for="record-type-selector">record type</label>
            <select name="record-type-selector" id="record-type-selector" @change="${this.recordTypeChanged}">
                ${r.map(
        (t) => h`
                            <option value="${t}"
                                    ?selected="${e === t}">
                                ${_t(this.record_type_names, t)}
                            </option>
                        `
      )}
            </select></div>
        `;
    }
    render_widget() {
      return this.selected_date ? this.fetching ? h`fetching data ...` : this.files.length == 0 ? h`
                    <div class="no-files">
                        <p>No files modified on that date / for that context</p>
                    </div>` : this.viewMode == "list" ? this.renderListView() : this.viewMode == "grid" ? this.renderGridView() : this.renderImageView() : h`please select a date`;
    }
    renderListView() {
      return h`
            <div id="file-list" class="file-list">
                ${this.files.map(
        (r) => h`
                    ${this.show_record_types === "" || r.record_type === this.show_record_types ? h`
                                <div class="file">
                                    <div class="file-body">
                                        <file-view id="${r.uid_file}"
                                                   .apiContext="${this.apiContext}"
                                                   .uuid_file="${r.uid_file}"
                                                   .resolution="${this.selected_resolution}"
                                                   .description="${r.description}"
                                                   class="${this.selected_image === r.uid_file ? "selected-image" : void 0}"
                                                   @select-image="${this.selectImage}"
                                        >
                                        </file-view>
                                    </div>
                                    <div class="file-headline">
                                        <div class="main-headline">
                                            <p>${r.identifier}</p>
                                            <p>by: ${r.modified_by}
                                                    (${r.modified.toLocaleTimeString(
          [],
          { hour: "2-digit", minute: "2-digit" }
        )})
                                            </p>
                                        </div>
                                        <p>${_t(this.record_type_names, r.record_type)}</p>
                                        <p>${r.description}</p>
                                        <p>${r.image_description}</p>
                                        ${r.filename ? h`<p>filename: ${r.filename}</p>` : void 0}
                                    </div>
                                </div>` : void 0}`
      )}
            </div>`;
    }
    renderGridView() {
      return h`
            <div class="file-grid">
                ${this.files.map(
        (r) => h`
                    ${this.show_record_types === "" || r.record_type === this.show_record_types ? h`
                                <div class="grid-cell" id="${r.uid_file}">
                                    <file-view @select-image="${this.selectImage}"
                                               .apiContext="${this.apiContext}"
                                               .uuid_file="${r.uid_file}"
                                               .resolution="${this.selected_resolution}"
                                               class="${this.selected_image === r.uid_file ? "selected-image" : void 0}"
                                    >
                                    </file-view>
                                    <p>${r.identifier}</p>
                                </div>` : void 0}`
      )}
            </div>`;
    }
    sortTypeChanged(r) {
      this.selected_sort = r.currentTarget.value, this.sort_records(this.sort_by[this.selected_sort]);
    }
    renderSortSelector() {
      return h`
            <div class="control-container"><label for="sort-type-selector">sort by</label>
            <select name="sort-type-selector" id="sort-type-selector" @change="${this.sortTypeChanged}">
                ${Object.keys(this.sort_by).map(
        (r) => h`
                            <option value="${r}"
                                    ?selected="${this.selected_sort === r}">
                                ${r}
                            </option>
                        `
      )}
            </select></div>
        `;
    }
    renderImageView() {
      return h`
            <div class="file-view">
                ${this.files.map(
        (r) => h`
                    ${this.selected_image === r.uid_file && (this.show_record_types === "" || r.record_type === this.show_record_types) ? h`
                            <file-view id="${r.uid_file}"
                                       .apiContext="${this.apiContext}"
                                       .uuid_file="${r.uid_file}"
                                       resolution="master">
                            </file-view>
                            <div class="file-headline">
                                <div class="main-headline">
                                    <p>${r.identifier}</p>
                                    <p>by: ${r.modified_by}
                                        (${r.modified.toLocaleTimeString(
          [],
          { hour: "2-digit", minute: "2-digit" }
        )})
                                    </p>
                                </div>
                                <p>${_t(this.record_type_names, r.record_type)}</p>
                                <p>${r.description}</p>
                                <p>ref# [${this.selected_image}]</p>
                            </div>` : void 0}`
      )}
            </div>`;
    }
    updated(r) {
      if (super.updated(r), this.selected_image) {
        let e = this.shadowRoot.getElementById(this.selected_image);
        e && setTimeout(() => {
          e.scrollIntoView({ block: "center", inline: "center" });
        }, 500);
      }
    }
  };
  Ge.styles = H(Wp);
  Ge.properties = {
    ...ng(Ge, Ge, "properties"),
    selected_context: { type: String },
    selected_member: { type: String },
    selected_date: { type: Date },
    selected_resolution: { type: String },
    selected_image: { type: String },
    selected_sort: { type: String },
    fetching: { type: Boolean },
    sort_by: { type: Array },
    viewMode: { type: String },
    show_record_types: { type: String }
  };
  Ge = ag([
    W("file-widget")
  ], Ge);
  var lg = Object.defineProperty, cg = Object.getOwnPropertyDescriptor, dg = Object.getPrototypeOf, ug = Reflect.get, hg = (r, e, t, o) => {
    for (var i = o > 1 ? void 0 : o ? cg(e, t) : e, a = r.length - 1, n; a >= 0; a--)
      (n = r[a]) && (i = (o ? n(e, t, i) : n(i)) || i);
    return o && i && lg(e, t, i), i;
  }, pg = (r, e, t) => ug(dg(r), t, e);
  let Ke = class extends z {
    constructor() {
      super();
    }
    stateChanged(r) {
    }
    firstUpdated(r) {
      super.firstUpdated(r);
    }
    renderDataWidgets() {
      return h`
            <unit-info-widget .apiContext="${this.apiContext}"></unit-info-widget>
            <narrative-widget .apiContext="${this.apiContext}"></narrative-widget>
            <file-widget .apiContext="${this.apiContext}"></file-widget>
            <locus-widget .apiContext="${this.apiContext}"></locus-widget>
            <cm-widget .apiContext="${this.apiContext}"></cm-widget>
            <feature-widget .apiContext="${this.apiContext}"></feature-widget>
            
        `;
    }
    apiRender() {
      return this.renderDataWidgets();
    }
  };
  Ke.styles = H(eh);
  Ke.properties = {
    ...pg(Ke, Ke, "properties")
  };
  Ke = hg([
    W("dataview-frame")
  ], Ke);
  const Me = class Me extends Ur {
    constructor() {
      super(), this.login_token = "", this._messages = {};
    }
    _show_message(e) {
      let t = e.detail;
      Os(this._messages, t, null, !0);
    }
    firstUpdated(e) {
      super.firstUpdated(e);
    }
    apiConnected() {
      this.fetchConstants();
    }
    fetchConstants() {
      X.getState().constants.length === 0 && this.apiContext && this.apiContext.fetchFromApi(
        "",
        "constants",
        {
          method: "GET",
          caller: "app.fetchConstants"
        }
      ).then((t) => {
        this.loadConstants(t);
      }).catch((t) => {
        J(this, t, "loadConstants", null);
      });
    }
    loadConstants(e) {
      X.dispatch(ms(e));
    }
    render_app() {
      let e = ct``, t = ct`
            <div class='directors-view-frame'>
                 <selection-frame .apiContext="${this.apiContext}"></selection-frame>
                 <dataview-frame .apiContext="${this.apiContext}""></dataview-frame>
             </div>`;
      return ct`${e}${t}`;
    }
    // apiRender is only called once the api is connected.
    apiRender() {
      let e = ct``;
      const t = this.render_app();
      return ct`${e}${t}`;
    }
  };
  Me.styles = H(Is), Me.properties = {
    ...ei(Me, Me, "properties"),
    login_token: { type: String }
  };
  let po = Me;
  window.customElements.define("directorsview-app", po);
});
export default gg();
