if (!window.bf_globals) {
  window.bf_globals = {};
}
["bitforms_1_10561_1"].forEach(function (contentId) {
  const form = document.getElementById(contentId);
  if (!form) {
    delete window.bf_globals[contentId];
    return;
  }
  if (!window.bf_globals[contentId]) {
    window.bf_globals[contentId] = { inits: {}, contentId: contentId };
  } else {
    window.bf_globals[contentId].inits = {};
    window.bf_globals[contentId].contentId = contentId;
  }
});
var bfSelect = (function () {
  "use strict";
  return function (e, t) {
    return (t || document).querySelector(e);
  };
})();
var bfReset = (function () {
  "use strict";
  return function (e, t = !1) {
    if (t) {
      const t = new CustomEvent("bf-form-reset", { detail: { formId: e } });
      bfSelect(`#form-${e}`).dispatchEvent(t);
    }
    const r = window.bf_globals[e];
    bfSelect(`#form-${e}`).reset(),
      localStorage.setItem("bf-entry-id", ""),
      "undefined" != typeof resetPlaceholders && resetPlaceholders(r),
      "undefined" != typeof customFieldsReset && customFieldsReset(r),
      "undefined" != typeof resetOtherOpt && resetOtherOpt(),
      (window.bf_globals[e].modifiedFields = r.fields),
      Object.keys(r.fields).forEach((t) => {
        const r = bfSelect(`#form-${e} .${t}-err-wrp`);
        r &&
          (setStyleProperty(r, "height", "0px"),
          setStyleProperty(r, "opacity", 0),
          setStyleProperty(bfSelect(`.${t}-err-msg`, r), "display", "none"));
      }),
      r.gRecaptchaSiteKey &&
        "v2" === r.gRecaptchaVersion &&
        window?.grecaptcha?.reset(),
      r.turnstileSiteKey && window?.turnstile?.reset();
  };
})();
var setBFMsg = (function () {
  "use strict";
  return function (e) {
    if (
      "undefined" != typeof handleConversationalFormMsg &&
      handleConversationalFormMsg(e)
    )
      return;
    let t = bfSelect(`#bf-form-msg-wrp-${e.contentId}`);
    (t.innerHTML = `<div class="bf-form-msg deactive ${e.type} scroll">${e.msg}</div>`),
      (t = bfSelect(".bf-form-msg", t));
    let s = 5e3;
    e.msgId &&
      ((t = bfSelect(
        `.msg-content-${e.msgId} .msg-content`,
        bfSelect(`#${e.contentId}`)
      )),
      (t.innerHTML = e.msg),
      (t = bfSelect(`.msg-container-${e.msgId}`, bfSelect(`#${e.contentId}`))),
      (s = e.duration)),
      t && t.classList.replace("active", "deactive"),
      t.classList.contains("scroll") && scrollToElm(t),
      t &&
        (setTimeout(() => {
          t.classList.replace("deactive", "active");
        }, 100),
        s &&
          setTimeout(() => {
            t.classList.replace("active", "deactive");
          }, s));
  };
})();
var scrollToElm = (function () {
  "use strict";
  const t = function (t) {
      (function (t, e = 10) {
        const n = t.getBoundingClientRect(),
          o = window.innerHeight || document.documentElement.clientHeight,
          i = window.innerWidth || document.documentElement.clientWidth;
        return (
          n.top >= e && n.left >= e && n.bottom <= o - e && n.right <= i - e
        );
      })(t) ||
        ((function (t) {
          let e = t.parentElement;
          for (; e && e !== document.body; ) {
            if (
              e.scrollHeight > e.clientHeight ||
              e.scrollWidth > e.clientWidth
            ) {
              e.scrollIntoView({ behavior: "smooth" });
              break;
            }
            e = e.parentElement;
          }
        })(t),
        t.scrollIntoView({
          behavior: "smooth",
          block: "center",
          inline: "center",
        }));
    },
    e = (function (t, e) {
      let n;
      const o = function (...e) {
        clearTimeout(n), (n = setTimeout(() => t(...e), 300));
      };
      return (
        (o.cancel = function () {
          clearTimeout(n);
        }),
        o
      );
    })(t);
  return function (n, { immediate: o = !1 } = {}) {
    e.cancel(), o ? t(n) : e(n);
  };
})();
var getFldKeyAndRowIndx = (function () {
  "use strict";
  return function (n) {
    const t = n.match(/([^\[]+)(?:\[(\d+)\])?/);
    return t ? [t[1], t[2] || ""] : [n];
  };
})();
var moveToFirstErrFld = (function () {
  "use strict";
  return function (t, r = []) {
    const n = t?.layout || {},
      e = t?.nestedLayout || {},
      o = Array.isArray(n) && n.length > 1,
      i = Array.isArray(n) ? n : [{ layout: n }];
    let s = -1;
    const c = i.reduce((t, n, o) => {
      const i = n.layout.lg.reduce((t, r) => {
          const n = r.i;
          if (n in e) {
            const r = e[n].lg.map((t) => t.i);
            return [...t, n, ...r];
          }
          return [...t, n];
        }, []),
        c = i.find((t) => r.includes(t));
      return -1 === s && c && (s = o), [...t, ...i];
    }, []);
    o && s > -1 && (t.inits.multi_step_form.step = s + 1),
      t.inits.conversational_form &&
        (t.inits.conversational_form.activeFieldStep = r[0]),
      c.some((n) =>
        r.some((r) => {
          const [e, o] = getFldKeyAndRowIndx(r);
          if (n === e) {
            const r = o ? `.rpt-index-${o}` : "",
              e = bfSelect(`#form-${t.contentId} ${r} .btcd-fld-itm.${n}`);
            return scrollToElm(e), !0;
          }
          return !1;
        })
      );
  };
})();
var bfValidationErrMsg = (function () {
  "use strict";
  return function (e, t) {
    const { data: r } = e;
    r && "string" == typeof r
      ? setBFMsg({ contentId: t, msg: r, error: !0, show: !0, type: "error" })
      : r &&
        (void 0 !== r.$form &&
          (setBFMsg({
            contentId: t,
            msg: r.$form.message,
            msgId: r.$form.msg_id,
            duration: r.$form.msg_duration,
            type: "error",
          }),
          delete r.$form),
        Object.keys(r).length > 0 &&
          (function (e, t) {
            const r = Object.keys(e);
            r.forEach((r) => {
              const [o, s] = getFldKeyAndRowIndx(r),
                y = bfSelect(
                  `#form-${t} ${s ? `.rpt-index-${s}` : ""} .${o}-err-wrp`
                ),
                i = bfSelect(`.${o}-err-txt`, y),
                n = bfSelect(`.${o}-err-msg`, y);
              let l = !1;
              try {
                (l = "grid" === getComputedStyle(y).display),
                  l &&
                    (y.style.removeProperty("opacity"),
                    y.style.removeProperty("height"),
                    n.style.removeProperty("display"));
              } catch (e) {
                l = !1;
              }
              (i.innerHTML = e[r]),
                l
                  ? setStyleProperty(y, "grid-template-rows", "1fr")
                  : setTimeout(() => {
                      n.style.removeProperty("display"),
                        setStyleProperty(y, "height", `${i.offsetHeight}px`),
                        setStyleProperty(y, "opacity", 1);
                    }, 100);
            }),
              moveToFirstErrFld(window?.bf_globals?.[t], r);
          })(r, t));
  };
})();
var setHiddenFld = (function () {
  "use strict";
  return function e(t, n) {
    let a = bfSelect(`input[name="${t.name}"]`, n);
    return (
      a ||
        ((a = document.createElement("input")),
        (a.type = "text"),
        (a.className = "d-none"),
        n.append(a)),
      "b_h_t" === t.name &&
        (bfSelect(`input[name="${a.value}"]`, n)?.remove(),
        e({ name: t.value, required: "" }, n)),
      Object.keys(t).forEach((e) => {
        a.setAttribute(e, t[e]);
      }),
      a
    );
  };
})();
var submit_form = (function () {
  "use strict";
  function e(e, t) {
    const o = new URL(e?.ajaxURL),
      n = e?.entryId ? "bitforms_update_form_entry" : "bitforms_submit_form";
    return (
      o.searchParams.append("action", n),
      e?.entryId &&
        (o.searchParams.append("_ajax_nonce", e.nonce || ""),
        o.searchParams.append("entryID", e.entryId),
        o.searchParams.append("formID", e.formId),
        o.searchParams.append("entryToken", e.entryToken)),
      fetch(o, { method: "POST", body: t })
    );
  }
  function t(e, t, n) {
    e.then(
      (e) =>
        new Promise((o, n) => {
          if (e.staus > 400) {
            const o = new CustomEvent("bf-form-submit-error", {
              detail: { formId: t, errors: result.data },
            });
            bfSelect(`#form-${t}`).dispatchEvent(o),
              500 === e.staus
                ? n(new Error("Mayebe Internal Server Error"))
                : n(e.json());
          } else o(e.json());
        })
    )
      .then((e) => {
        const a = new CustomEvent("bf-form-submit-success", {
          detail: { formId: t, entryId: e.entryId, formData: n },
        });
        bfSelect(`#form-${t}`).dispatchEvent(a);
        let r = null,
          s = null,
          c = "",
          d = 1e3;
        const i = window.bf_globals[t];
        if (void 0 !== e && e.success) {
          const o = bfSelect(`#form-${t}`);
          bfReset(t),
            "object" == typeof e.data
              ? (o &&
                  e?.data?.hidden_fields?.map((e) => {
                    setHiddenFld(e, o);
                  }),
                (r = e.data.redirectPage),
                e.data.cron && (s = e.data.cron),
                e.data.cronNotOk && (s = e.data.cronNotOk),
                e.data.new_nonce && (c = e.data.new_nonce),
                setBFMsg({
                  contentId: t,
                  msgId: e.data.msg_id,
                  msg: e.data.message,
                  duration: e.data.msg_duration,
                  show: !0,
                  type: "success",
                  error: !1,
                }),
                (d = Number(e.data.msg_duration || 1e3)))
              : setBFMsg({
                  contentId: t,
                  msg: e.data,
                  type: "success",
                  show: !0,
                  error: !1,
                }),
            localStorage.removeItem(`bitform-partial-form-${i.formId}`);
          const n = bfSelect('input[name="entryID"]', o);
          n && n.remove(), delete i.entryId;
        } else {
          const o = new CustomEvent("bf-form-submit-error", {
            detail: { formId: t, errors: e.data },
          });
          bfSelect(`#form-${t}`).dispatchEvent(o), bfValidationErrMsg(e, t);
        }
        if (
          ((function (e, t, o) {
            const n = window.bf_globals[o];
            if (e)
              if ("string" == typeof e) {
                const t = new URL(e);
                t.protocol !== window.location.protocol &&
                  (t.protocol = window.location.protocol),
                  fetch(t);
              } else {
                const o = new URL(n.ajaxURL);
                o.searchParams.append("action", "bitforms_trigger_workflow");
                const a = { cronNotOk: e, token: t || n.nonce, id: n.appID };
                fetch(o, {
                  method: "POST",
                  body: JSON.stringify(a),
                  headers: { "Content-Type": "application/json" },
                }).then((e) => e.json());
              }
          })(s, c, t),
          r)
        ) {
          const e = setTimeout(() => {
            (window.location = decodeURI(r)), e && clearTimeout(e);
          }, d);
        }
        o(t, !1);
      })
      .catch((e) => {
        const n = e?.message ? e.message : "Unknown Error";
        setBFMsg({ contentId: t, msg: n, show: !0, type: "error", error: !0 }),
          o(t, !1);
      });
  }
  function o(e, t) {
    const o = bfSelect('button[type="submit"]', bfSelect(`#form-${e}`));
    o && (o.disabled = t);
    const n = bfSelect('button[type="submit"] span', bfSelect(`#form-${e}`));
    n && n.classList.toggle("d-none");
  }
  return function (n = null) {
    (n ? [n] : Object.keys(window.bf_globals)).forEach((n) => {
      const a = bfSelect(`#form-${n}`);
      a &&
        (a.addEventListener("submit", (n) => {
          !(function (n) {
            n.preventDefault();
            const a = n.target.id.slice(n.target.id.indexOf("-") + 1);
            if (
              "undefined" != typeof validateForm &&
              !validateForm({ form: a })
            ) {
              const e = new CustomEvent("bf-form-validation-error", {
                detail: { formId: a, fieldId: "", error: "" },
              });
              return void n.target.dispatchEvent(e);
            }
            o(a, !0);
            let r = new FormData(n.target);
            const s = window.bf_globals[a];
            "undefined" != typeof advancedFileHandle &&
              (r = advancedFileHandle(s, r)),
              "undefined" != typeof decisionFldHandle &&
                (r = decisionFldHandle(s, r)),
              s.GCLID && r.set("GCLID", s.GCLID);
            const c = [];
            Object.entries(s?.fields || {}).forEach((e) => {
              e[1]?.valid?.hide && c.push(e[0]);
            }),
              c.length && r.append("hidden_fields", c),
              "v3" === s?.gRecaptchaVersion && s?.gRecaptchaSiteKey
                ? grecaptcha.ready(() => {
                    grecaptcha
                      .execute(s.gRecaptchaSiteKey, { action: "submit" })
                      .then((o) => {
                        r.append("g-recaptcha-response", o), t(e(s, r), a, r);
                      });
                  })
                : t(e(s, r), a, r);
          })(n);
        }),
        bfSelect('button[type="reset"]', a)?.addEventListener("click", () =>
          bfReset(a.id.replace("form-", ""), !0)
        ));
    }),
      document.querySelectorAll(".msg-backdrop,.bf-msg-close").forEach((e) => {
        e.addEventListener("click", (t) => {
          t.target === e &&
            (t.stopPropagation(),
            bfSelect(
              `#${e.dataset.contentid} .msg-container-${e.dataset.msgid}`
            ).classList.replace("active", "deactive"));
        });
      }),
      localStorage.setItem("bf-entry-id", "");
  };
})();
var setStyleProperty = (function () {
  "use strict";
  return function (t, e, r) {
    t?.style && t.style.setProperty(e, r, "important");
  };
})();
var observeElm = (function () {
  "use strict";
  return function (t, e, r, u = 0) {
    const i = new MutationObserver((t) => {
        t.forEach((t) => {
          if (t.attributeName === e) {
            const { oldValue: i } = t,
              a = t.target[e];
            "function" == typeof r && setTimeout(r.call(this, i, a), u);
          }
        });
      }),
      a = { attributes: !0, attributeOldValue: !0, attributeFilter: [e] };
    return i.observe(t, a), i;
  };
})();
var decisionFldHandle = (function () {
  "use strict";
  return (e, c) => (
    Object.entries(e.fields).forEach(([, e]) => {
      "decision-box" === e.typ &&
      bfSelect(`input[name="${e.fieldName}"]`).checked
        ? c.set(e.fieldName, e.msg.checked)
        : "decision-box" === e.typ && c.set(e.fieldName, e.msg.unchecked);
    }),
    c
  );
})();
var customFieldsReset = (function () {
  "use strict";
  return function (e) {
    Object.entries(e.inits || {}).map(([t, s]) => {
      if (s?.reset) {
        const i = t.replace(/\[\w+\]/g, ""),
          n = e.fields[i];
        s.reset(n?.val);
      }
    });
  };
})();
var bit_country_field = (function () {
  "use strict";
  return class {
    #t;
    #e;
    #s;
    #i;
    #n;
    #r;
    #l = "data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg'/>";
    #o;
    #a;
    #h;
    #d;
    #c;
    #p = "";
    #u = [];
    #m = !0;
    #y = !0;
    #C = !0;
    #b = !0;
    #E = !1;
    #g = !1;
    #f = "";
    #I = "Select a Country";
    #w = "Search Country";
    #v = "No Currency Found";
    #O = 370;
    #S = 30;
    #x;
    #L = {};
    #A = [];
    #F = {};
    #W = {};
    #T = "";
    #k = "";
    #B = null;
    #H = "";
    #N = [];
    #$;
    #P = !1;
    constructor(t, e) {
      this.#M(e),
        (this.#t = "string" == typeof t ? this.#x.querySelector(t) : t),
        (this.fieldKey = this.#k),
        this.init();
    }
    #M(t) {
      (this.#x = t.document || document),
        (this.#L = t.window || window),
        (this.#k = t.fieldKey),
        (this.#f = t.defaultValue),
        (this.#I = t.placeholder),
        (this.#w = t.searchPlaceholder || "Search Country"),
        (this.#v = t.noCountryFoundText || "No Country Found"),
        (this.#S = t.rowHeight || 30),
        (this.#O = t.maxHeight || 370),
        (this.#m = t.selectedFlagImage),
        (this.#y = t.selectedCountryClearable),
        (this.#C = t.searchClearable),
        (this.#b = t.optionFlagImage),
        (this.#E = t.detectCountryByIp),
        (this.#g = t.detectCountryByGeo),
        (this.#T = t.assetsURL),
        (this.#$ = t.onChange),
        (this.#F = t.attributes || {}),
        (this.#W = t.classNames || {}),
        "string" == typeof t.options && (t.options = this.#K(t.options)),
        (this.#A = t.options.filter((t) => !t.hide)),
        (this.#u = this.#A);
    }
    init() {
      (this.#e = this.#R(`.${this.fieldKey}-country-hidden-input`)),
        (this.#s = this.#R(`.${this.fieldKey}-dpd-wrp`)),
        (this.#i = this.#R(`.${this.fieldKey}-selected-country-img`)),
        (this.#n = this.#R(`.${this.fieldKey}-selected-country-lbl`)),
        (this.#r = this.#y ? this.#R(`.${this.fieldKey}-inp-clr-btn`) : {}),
        (this.#o = this.#R(`.${this.fieldKey}-option-search-wrp`)),
        (this.#a = this.#R(`.${this.fieldKey}-opt-search-input`)),
        (this.#h = this.#R(`.${this.fieldKey}-search-clear-btn`)),
        (this.#d = this.#R(`.${this.fieldKey}-option-wrp`)),
        (this.#c = this.#R(`.${this.fieldKey}-option-list`)),
        this.setMenu({ open: !1 }),
        this.#E && this.#V(),
        this.#g && this.#D(),
        this.#f && this.#U(),
        this.#G(),
        this.#z(),
        this.#L.observeElm(this.#e, "value", (t, e) => {
          this.#_(t, e);
        }),
        this.#m || this.#i?.remove(),
        this.#C &&
          (this.#q(this.#a, "padding-right", "35px"),
          this.#q(this.#h, "display", "none"));
    }
    #K(t) {
      const e = t.split("->");
      let s = this.#L;
      return (
        e.forEach((t) => {
          s = s[t];
        }),
        s
      );
    }
    #z() {
      this.#j(this.#s, "click", (t) => {
        this.#J(t);
      }),
        this.#j(this.#s, "keyup", (t) => {
          this.#J(t);
        }),
        this.#j(this.#t, "keydown", (t) => {
          this.#Q(t);
        }),
        this.#C &&
          this.#j(this.#h, "click", () => {
            this.searchOptions("");
          }),
        this.#j(this.#a, "keyup", (t) => {
          this.#X(t);
        });
    }
    #U() {
      const t = this.#A.find((t) => {
        const e = this.#f;
        return !(t.i !== e) || (t.val ? t.val === e : t.lbl === e);
      });
      t && this.setSelectedCountryItem(t.i);
    }
    #G() {
      const t = this.#e.name,
        e = decodeURIComponent(`${this.#x.URL}`.replace(/\+/g, "%20")).replace(
          new RegExp(`.*${t}=([^&]*).*|(.*)`),
          "$1"
        );
      e && this.#_("", e);
    }
    #R(t) {
      return this.#t.querySelector(t);
    }
    #j(t, e, s) {
      t.addEventListener(e, s),
        this.#N.push({ selector: t, eventType: e, cb: s });
    }
    #V() {
      const { protocol: t } = this.#L.location;
      fetch(`${t}//www.cloudflare.com/cdn-cgi/trace`)
        .then((t) => t.text())
        .then((t) => {
          const e = t
            .trim()
            .split("\n")
            .reduce((t, e) => {
              const [s, i] = e.split("=");
              return (t[s] = i), t;
            }, {});
          this.setSelectedCountryItem(e?.loc);
        });
    }
    #D() {
      navigator.geolocation.getCurrentPosition((t) => {
        const { latitude: e, longitude: s } = t.coords,
          { protocol: i } = this.#L.location;
        fetch(
          `${
            "https:" === i ? `${i}//secure` : `${i}//api`
          }.geonames.org/countryCodeJSON?username=bitcodezoho1&lat=${e}&lng=${s}`
        )
          .then((t) => t.json())
          .then((t) => {
            this.setSelectedCountryItem(t.countryCode);
          });
      });
    }
    #Q(t) {
      t.stopPropagation();
      const e = this.#x.activeElement;
      let s = null;
      if (this.#Y()) {
        const i = Number(e.dataset.index || -1);
        if ("ArrowDown" === t.key || (!t.shiftKey && "Tab" === t.key)) {
          if ((t.preventDefault(), e === this.#a))
            s = this.#R(".option:not(.disabled-opt)");
          else if (e.classList.contains("option")) {
            const t = this.#Z(i, "next"),
              e = this.#tt(t);
            e
              ? (s = e)
              : t + 1 < this.#u.length &&
                (this.virtualOptionList?.scrollToIndex(t),
                setTimeout(() => {
                  const e = this.#tt(t);
                  e && e.focus();
                }, 50));
          }
        } else if ("ArrowUp" === t.key || (t.shiftKey && "Tab" === t.key)) {
          if ((t.preventDefault(), e === this.#a))
            (s = this.#s), this.#Y() && this.setMenu({ open: !1 });
          else if (e.classList.contains("option")) {
            const t = this.#Z(i, "previous"),
              e = this.#tt(t);
            e
              ? (s = e)
              : t > 0
              ? (this.virtualOptionList?.scrollToIndex(t),
                setTimeout(() => {
                  const e = this.#tt(t);
                  e && e.focus();
                }, 50))
              : e || (s = this.#a);
          }
        } else "Escape" === t.key && this.setMenu({ open: !1 });
      } else if (t.key >= "a" && t.key <= "z") {
        clearTimeout(this.#B),
          (this.#H += t.key),
          (this.#B = setTimeout(() => {
            this.#H = "";
          }, 300));
        const e = this.#A.find(
          (t) => !t.disabled && t.lbl.toLowerCase().startsWith(this.#H)
        );
        e && this.setSelectedCountryItem(e.i);
      } else if ("ArrowDown" === t.key || "ArrowUp" === t.key) {
        t.preventDefault();
        const e = this.#et(),
          s = "ArrowDown" === t.key ? "next" : "previous",
          i = this.#Z(e, s);
        i > -1 &&
          i < this.#A.length &&
          ((this.value = this.#A[i].val || this.#A[i].lbl),
          this.#st(this.#e, "blur"));
      }
      s && s.focus();
    }
    #tt(t) {
      return this.#R(
        `.${this.fieldKey}-option-list .option[data-index="${t}"]`
      );
    }
    #Z(t = -1, e) {
      if ("next" === e) {
        const e = this.#A.length;
        for (let s = t + 1; s < e; s += 1) if (!this.#A[s].disabled) return s;
      } else if ("previous" === e)
        for (let e = t - 1; e >= 0; e -= 1) if (!this.#A[e].disabled) return e;
    }
    #_(t, e) {
      const s = this.#A.find((t) => t.i === e || t.val === e || t.lbl === e);
      s && t !== e && this.setSelectedCountryItem(s.i),
        "undefined" != typeof bit_conditionals &&
          bit_conditionals({ target: this.#e });
    }
    #it(t) {
      t?.stopPropagation(),
        (this.#p = ""),
        this.#m && (this.#i.src = this.#l),
        this.#nt(this.#n, this.#I),
        this.#y && this.#q(this.#r, "display", "none"),
        this.#rt(this.#s, "aria-label", "Selected country cleared"),
        this.#P || this.#s.focus(),
        this.setMenu({ open: !1 }),
        (this.value = ""),
        this.#st(this.#e, "blur"),
        setTimeout(() => {
          this.#rt(this.#s, "aria-label", this.#I);
        }, 100);
    }
    #st(t, e) {
      const s = new Event(e);
      t.dispatchEvent(s);
    }
    setSelectedCountryItem(t) {
      if (((this.#p = t), !this.#p)) return;
      const e = this.#lt();
      e &&
        (this.#m && this.#i && (this.#i.src = `${this.#T}${e.img}`),
        this.#nt(this.#n, e.lbl),
        this.setMenu({ open: !1 }),
        (this.value = e.val || e.lbl),
        this.#y &&
          (this.#q(this.#r, "display", "grid"),
          this.#j(this.#r, "click", (t) => {
            this.#it(t);
          })),
        this.#$ && this.#$(e.val || e.lbl),
        this.#rt(this.#s, "aria-label", `${e.lbl} selected`),
        this.#st(this.#e, "blur"),
        setTimeout(() => {
          this.#rt(this.#s, "aria-label", e.lbl);
        }, 100));
    }
    #et() {
      return this.#u.findIndex((t) => t.i === this.#p);
    }
    #lt() {
      return this.#A.find((t) => t.i === this.#p);
    }
    #ot(t) {
      return this.#x.createElement(t);
    }
    #at(t, e) {
      t.classList.add(e);
    }
    #nt(t, e) {
      t.textContent = e;
    }
    #rt(t, e, s) {
      t?.setAttribute?.(e, s);
    }
    #q(t, e, s) {
      t.style.setProperty(e, s, "important");
    }
    #ht() {
      if (!this.#Y()) return;
      this.#dt();
      const t = this.#et(),
        e = this.#R(`.option[data-index="${t}"]`);
      e && e.scrollIntoView({ block: "nearest", inline: "nearest" });
    }
    #ct(t, e) {
      e.trim()
        .split(/\b\s+\b/g)
        .forEach((e) => this.#at(t, e));
    }
    #pt(t, e) {
      const s = e.length;
      if (s) for (let i = 0; i < s; i += 1) this.#rt(t, e[i].key, e[i].value);
    }
    #ut() {
      const t = this.#R(".option");
      if (!t) return;
      const e = this.#L.getComputedStyle(t),
        s = parseFloat(e.marginTop) + parseFloat(e.marginBottom),
        i = t.offsetHeight + s || 0;
      i !== this.#S && ((this.#S = i), (this.#c.innerHTML = ""), this.#dt());
    }
    #dt() {
      this.#c.innerHTML = "";
      const t = this.#u.map((t, e) => {
        const s = this.#ot("li");
        if (
          (this.#rt(s, "data-key", t.i),
          this.#rt(s, "data-index", e),
          "option" in this.#F)
        ) {
          const t = this.#F.option;
          this.#pt(s, t);
        }
        if ((this.#rt(s, "data-dev-option", this.fieldKey), !t.i))
          return this.#nt(s, t.lbl), this.#at(s, "opt-not-found"), s;
        if ((this.#at(s, "option"), "option" in this.#W)) {
          const t = this.#W.option;
          t && this.#ct(s, t);
        }
        const i = this.#ot("span");
        if ((this.#at(i, "opt-lbl-wrp"), "opt-lbl-wrp" in this.#W)) {
          const t = this.#W["opt-lbl-wrp"];
          t && this.#ct(i, t);
        }
        if ("opt-lbl-wrp" in this.#F) {
          const t = this.#F["opt-lbl-wrp"];
          this.#pt(i, t);
        }
        if (this.#b) {
          const e = this.#ot("img");
          if ("opt-icn" in this.#F) {
            const t = this.#F["opt-icn"];
            t && this.#pt(e, t);
          }
          if ((this.#at(e, "opt-icn"), "opt-icn" in this.#W)) {
            const t = this.#W["opt-icn"];
            t && this.#ct(e, t);
          }
          (e.src = `${this.#T}${t.img}`),
            (e.alt = `${t.lbl} flag image`),
            (e.loading = "lazy"),
            this.#rt(e, "aria-hidden", !0),
            i.append(e);
        }
        const n = this.#ot("span");
        if ("opt-lbl" in this.#F) {
          const t = this.#F["opt-lbl"];
          this.#pt(n, t);
        }
        if ((this.#at(n, "opt-lbl"), "opt-lbl" in this.#W)) {
          const t = this.#W["opt-lbl"];
          t && this.#ct(n, t);
        }
        return (
          this.#nt(n, t.lbl),
          i.append(n),
          (s.tabIndex = this.#Y() ? "0" : "-1"),
          this.#rt(s, "role", "option"),
          this.#rt(s, "aria-posinset", e + 1),
          this.#rt(s, "aria-setsize", this.#u.length),
          this.#j(s, "click", (t) => {
            this.setSelectedCountryItem(t.currentTarget.dataset.key);
          }),
          this.#j(s, "keyup", (t) => {
            "Enter" === t.key &&
              this.setSelectedCountryItem(t.currentTarget.dataset.key);
          }),
          t.disabled && this.#at(s, "disabled-opt"),
          s.append(i),
          this.#p === t.i
            ? (this.#at(s, "selected-opt"), this.#rt(s, "aria-selected", !0))
            : this.#rt(s, "aria-selected", !1),
          s
        );
      });
      this.#c.append(...t);
    }
    #X(t) {
      if ((t.stopPropagation(), "Enter" === t.key && this.#u.length)) {
        const t = this.#u?.[0].i;
        t && (this.setSelectedCountryItem(t), this.searchOptions(""));
      } else this.searchOptions(t.target.value);
    }
    searchOptions(t) {
      this.#mt(t);
      let e = [];
      t
        ? ((e = this.#A.filter((e) =>
            e.lbl.toLowerCase().includes(t.toLowerCase())
          )),
          e.length || (e = [{ i: 0, lbl: this.#v }]),
          (this.#u = e),
          this.#C && this.#q(this.#h, "display", "grid"))
        : ((this.#u = this.#A), this.#C && this.#q(this.#h, "display", "none")),
        this.#ht();
    }
    #mt(t) {
      this.#a.value = t;
    }
    #yt(t) {
      this.#t.contains(t.target) || this.setMenu({ open: !1 });
    }
    #Y() {
      return this.#t.classList.contains("menu-open");
    }
    #Ct() {
      const t = this.#L,
        e = this.#s.getBoundingClientRect(),
        s = e.top,
        i = t.innerHeight - e.bottom;
      i < s && i < this.#O
        ? (this.#q(this.#t, "flex-direction", "column-reverse"),
          this.#q(this.#t, "bottom", "0%"))
        : (this.#q(this.#t, "flex-direction", "column"),
          this.#q(this.#t, "bottom", "auto"));
    }
    setMenu({ open: t }) {
      this.#q(this.#d, "max-height", `${t ? this.#O : 0}px`),
        t
          ? (this.#Ct(),
            this.#t.classList.add("menu-open"),
            this.#j(this.#x, "click", (t) => this.#yt(t)),
            (this.#a.tabIndex = "0"),
            (this.#h.tabIndex = "0"),
            this.#s.setAttribute("aria-expanded", "true"),
            this.#rt(this.#c, "aria-hidden", !1),
            this.#rt(this.#a, "aria-hidden", !1),
            this.#ht())
          : (this.#t.classList.remove("menu-open"),
            this.#x.removeEventListener("click", this.#yt),
            setTimeout(() => {
              this.searchOptions("");
            }, 100),
            this.#a.blur(),
            (this.#a.tabIndex = "-1"),
            (this.#h.tabIndex = "-1"),
            this.#s.setAttribute("aria-expanded", "false"),
            this.#rt(this.#c, "aria-hidden", !0),
            this.#rt(this.#a, "aria-hidden", !0));
    }
    #J(t) {
      "Space" === t.code && (this.#a.focus(), this.setMenu({ open: !0 })),
        "click" === t.type &&
          (this.#Y()
            ? this.setMenu({ open: !1 })
            : (this.#a.focus(), this.setMenu({ open: !0 })));
    }
    set disabled(t) {
      "true" === String(t).toLowerCase()
        ? (this.#t.classList.add("disabled"),
          (this.#e.disabled = !0),
          this.#y && this.#rt(this.#r, "tabindex", "-1"),
          this.#rt(this.#s, "aria-label", "Country Field disabled"),
          this.#rt(this.#s, "tabindex", "-1"),
          this.setMenu({ open: !1 }),
          this.#N.forEach(({ selector: t, eventType: e, cb: s }) => {
            t.removeEventListener(e, s);
          }))
        : "false" === String(t).toLowerCase() &&
          (this.#t.classList.remove("disabled"),
          this.#e.removeAttribute("disabled"),
          this.#rt(this.#s, "tabindex", "0"),
          this.#y && this.#rt(this.#r, "tabindex", "0"),
          this.#rt(this.#s, "aria-label", this.#I),
          this.#z());
    }
    get disabled() {
      return this.#e.disabled;
    }
    set readonly(t) {
      "true" === String(t).toLowerCase()
        ? (this.#t.classList.add("disabled"),
          (this.#e.readOnly = !0),
          this.#rt(this.#s, "tabindex", "-1"),
          this.#y && this.#rt(this.#r, "tabindex", "-1"),
          this.setMenu({ open: !1 }))
        : "false" === String(t).toLowerCase() &&
          (this.#t.classList.remove("disabled"),
          this.#e.removeAttribute("readonly"),
          this.#y && this.#rt(this.#s, "tabindex", "0"),
          this.#rt(this.#r, "tabindex", "0"));
    }
    get readonly() {
      return this.#e.readOnly;
    }
    set value(t) {
      (this.#e.value = t), this.#rt(this.#e, "value", t);
    }
    get value() {
      const t = this.#lt();
      return t.val || t.lbl;
    }
    #bt() {
      this.#N.forEach(({ selector: t, eventType: e, cb: s }) => {
        t.removeEventListener(e, s);
      });
    }
    destroy() {
      (this.#c.innerHTML = ""), (this.value = ""), this.#bt();
    }
    reset(t) {
      (this.#P = !0),
        this.#it(),
        this.destroy(),
        this.init(),
        this.setSelectedCountryItem(t),
        (this.#P = !1);
    }
  };
})();
var bit_phone_number_field = (function () {
  "use strict";
  return class {
    #t = "data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg'/>";
    #e = "www.cloudflare.com/cdn-cgi/trace";
    #s = "api.geonames.org/countryCodeJSON?username=bitcodezoho1";
    #i = null;
    #n = null;
    #o = null;
    #l = null;
    #h = null;
    #r = null;
    #a = null;
    #u = null;
    #c = null;
    #p = null;
    #d = null;
    #m = null;
    #f = null;
    #g = 30;
    #y = [];
    #C = {};
    #b = !1;
    #E = [];
    #I = {
      maxHeight: 370,
      detectCountryByIp: !1,
      detectCountryByGeo: !1,
      optionFlagImage: !0,
      searchCountryPlaceholder: "Search Country",
      noCountryFoundText: "No Country Found",
      searchClearable: !0,
      defaultCountryKey: "",
      attributes: {},
      classNames: {},
    };
    #v = "";
    #w = null;
    #S = "";
    #N = null;
    #x = null;
    constructor(t, e) {
      Object.assign(this.#I, e),
        (this.#N = e.document || document),
        (this.#x = e.window || window),
        (this.#v = e.assetsURL || ""),
        (this.#i = "string" == typeof t ? this.#N.querySelector(t) : t),
        "string" == typeof this.#I.options &&
          (this.#I.options = this.#P(this.#I.options)),
        (this.#I.options = this.#I.options.filter((t) => !t.hide)),
        (this.#y = [...this.#I.options]),
        (this.#C = this.#L()),
        (this.fieldKey = this.#I.fieldKey),
        this.init();
    }
    init() {
      (this.#p = this.#F(`.${this.fieldKey}-phone-inner-wrp`)),
        (this.#d = this.#F(`.${this.fieldKey}-phone-number-input`)),
        (this.#n = this.#F(`.${this.fieldKey}-phone-hidden-input`)),
        (this.#o = this.#F(`.${this.fieldKey}-input-clear-btn`)),
        (this.#r = this.#F(`.${this.fieldKey}-selected-country-img`)),
        (this.#u = this.#F(`.${this.fieldKey}-option-search-wrp`)),
        (this.#c = this.#F(`.${this.fieldKey}-opt-search-input`)),
        (this.#l = this.#F(`.${this.fieldKey}-dpd-wrp`)),
        (this.#h = this.#F(`.${this.fieldKey}-option-wrp`)),
        (this.#m = this.#F(`.${this.fieldKey}-search-clear-btn`)),
        (this.#f = this.#F(`.${this.fieldKey}-option-list`)),
        this.setMenu({ open: !1 }),
        this.#A(this.#i, "keydown", (t) => {
          this.#O(t);
        }),
        this.#A(this.#l, "click", (t) => {
          this.#k(t);
        }),
        this.#A(this.#l, "keyup", (t) => {
          this.#k(t);
        }),
        this.#$(),
        this.#I.defaultCountryKey &&
          this.setSelectedCountryItem(this.#I.defaultCountryKey),
        this.#A(this.#d, "blur", (t) => {
          this.#W();
        }),
        this.#A(this.#d, "input", (t) => {
          this.#T(t);
        }),
        this.#A(this.#d, "focusout", (t) => {
          this.#B(t);
        }),
        this.#I.selectedCountryClearable &&
          this.#A(this.#o, "click", (t) => {
            this.#H(t);
          }),
        this.#I.detectCountryByIp && this.#V(),
        this.#I.detectCountryByGeo && this.#K(),
        this.#I.searchClearable &&
          (this.#M(this.#c, "padding-right", "35px"),
          this.#M(this.#m, "display", "none"),
          this.#A(this.#m, "click", () => {
            this.searchOptions("");
          })),
        (this.#c.value = ""),
        this.#A(this.#c, "keyup", (t) => {
          this.#D(t);
        }),
        (this.#t = this.#I.placeholderImage
          ? this.#I.placeholderImage
          : this.#t),
        this.#x.observeElm(this.#n, "value", (t, e) => {
          this.#R(t, e);
        });
    }
    #P(t) {
      const e = t.split("->");
      let s = this.#x;
      return (
        e.forEach((t) => {
          s = s[t];
        }),
        s
      );
    }
    #F(t) {
      return this.#i.querySelector(t);
    }
    #A(t, e, s) {
      t.addEventListener(e, s),
        this.#E.push({ selector: t, eventType: e, cb: s });
    }
    #$() {
      this.#n.value &&
        (this.#R("", this.#n.value),
        this.#I.selectedCountryClearable &&
          this.#M(this.#o, "display", "grid"));
    }
    #V() {
      const { protocol: t } = this.#x.location;
      fetch(`${t}//${this.#e}`)
        .then((t) => t.text())
        .then((t) => {
          const e = t
            .trim()
            .split("\n")
            .reduce((t, e) => ((t[(e = e.split("="))[0]] = e[1]), t), {});
          this.setSelectedCountryItem(e.loc);
        });
    }
    #K() {
      navigator.geolocation.getCurrentPosition((t) => {
        const { latitude: e, longitude: s } = t.coords,
          { protocol: i } = this.#x.location;
        fetch(
          `${
            "https:" === i ? `${i}//secure` : `${i}//api`
          }.geonames.org/countryCodeJSON?username=bitcodezoho1&lat=${e}&lng=${s}`
        )
          .then((t) => t.json())
          .then((t) => {
            this.setSelectedCountryItem(t.countryCode);
          });
      });
    }
    #O(t) {
      const e = this.#N.activeElement;
      let s = null;
      const i = this.#U();
      if (t.target !== this.#d) {
        if (i) {
          const i = Number(e.dataset.index || -1);
          if ("ArrowDown" === t.key || (!t.shiftKey && "Tab" === t.key)) {
            if ((t.preventDefault(), e === this.#c))
              s = this.#F(".option:not(.disabled-opt)");
            else if (e.classList.contains("option")) {
              const t = this.#G(i, "next"),
                e = this.#_(t);
              e
                ? (s = e)
                : t + 1 < this.#y.length &&
                  (this.virtualOptionList?.scrollToIndex(t),
                  setTimeout(() => {
                    const e = this.#_(t);
                    e && e.focus();
                  }, 50));
            }
          } else if ("ArrowUp" === t.key || (t.shiftKey && "Tab" === t.key)) {
            if ((t.preventDefault(), e === this.#c))
              (s = this.#d), this.#U() && this.setMenu({ open: !1 });
            else if (e.classList.contains("option")) {
              const t = this.#G(i, "previous"),
                e = this.#_(t);
              e
                ? (s = e)
                : t > 0
                ? (this.virtualOptionList?.scrollToIndex(t),
                  setTimeout(() => {
                    const e = this.#_(t);
                    e && e.focus();
                  }, 50))
                : e || (s = this.#c);
            }
          } else "Escape" === t.key && this.setMenu({ open: !1 });
        } else if (t.key >= "a" && t.key <= "z") {
          clearTimeout(this.#w),
            (this.#S += t.key),
            (this.#w = setTimeout(() => {
              this.#S = "";
            }, 300));
          const e = this.#I.options.find(
            (t) => !t.disabled && t.lbl.toLowerCase().startsWith(this.#S)
          );
          e && this.setSelectedCountryItem(e.i);
        } else if ("ArrowDown" === t.key || "ArrowUp" === t.key) {
          t.preventDefault();
          const e = this.#z(),
            s = "ArrowDown" === t.key ? "next" : "previous",
            i = this.#G(e, s);
          i > -1 &&
            i < this.#I.options.length &&
            (this.value = this.#I.options[i].val);
        }
        s && s.focus();
      }
    }
    #q(t, e) {
      const s = new Event(e);
      t.dispatchEvent(s);
    }
    #H() {
      (this.#d.value = ""),
        this.setSelectedCountryItem(""),
        this.#q(this.#d, "input"),
        this.#q(this.#n, "blur");
    }
    #_(t) {
      return this.#F(
        `.${this.fieldKey}-option-list .option[data-index="${t}"]`
      );
    }
    #G(t = -1, e) {
      if ("next" === e) {
        const e = this.#I.options.length;
        for (let s = t + 1; s < e; s += 1)
          if (!this.#I.options[s].disabled) return s;
      } else if ("previous" === e)
        for (let e = t - 1; e >= 0; e -= 1)
          if (!this.#I.options[e].disabled) return e;
    }
    #j(t) {
      this.#i.contains(t.target) || this.setMenu({ open: !1 });
    }
    #L() {
      return this.#I.options.reduce((t, e) => {
        if (!t[e.code]) {
          let { code: s } = e;
          "+" === s[0] && (s = s.substring(1)),
            !(s in t) && e.ptrn && (t[s] = e.i);
        }
        return t;
      }, {});
    }
    #J(t) {
      let e = t;
      "+" === e[0] && (e = e.substring(1, 4));
      let s = "";
      for (let t = 3; t > 0; t -= 1)
        if (((s = e.substring(0, t)), s in this.#C)) return s;
      return "";
    }
    #Q(t) {
      let e = this.#J(t);
      e && "+" !== e[0] && (e = `+${e}`);
      let s = this.#X()?.code || "";
      return (
        s && "+" !== s[0] && (s = `+${s}`),
        e !== s ? (this.setSelectedCountryItem(this.#C[e.substring(1)]), e) : s
      );
    }
    #Y(t) {
      return t.replace(/[^+0-9]/g, "");
    }
    #R(t, e) {
      this.#Q(e) && t !== e && this.#Z(this.#Y(e)),
        "undefined" != typeof bit_conditionals &&
          bit_conditionals({ target: this.#n });
    }
    #W() {
      this.value.length > 3 && (this.#d.value = this.value),
        this.#q(this.#n, "blur");
    }
    #T(t) {
      const { value: e } = t.target;
      e && this.#I.selectedCountryClearable
        ? this.#M(this.#o, "display", "grid")
        : this.#I.selectedCountryClearable &&
          this.#M(this.#o, "display", "none"),
        this.#Z(e);
    }
    #Z(t) {
      const e = this.#X();
      let s = "";
      if (((s = this.#b ? e.code : this.#Q(t)), s && e)) {
        let i = e.frmt;
        const n = this.#I.valueFormat || "";
        i || (i = this.#I.inputFormat || "");
        const o = this.#tt(s, t, i);
        if (n) {
          const e = this.#Y(t),
            i = this.#tt(s, e, n);
          this.value = i;
        } else this.value = t;
        this.#d.value = o;
      }
    }
    #et = (t) => /[0-9]/.test(t);
    #tt(t, e, s = "") {
      let i = "",
        n = 0;
      const o = "+" === e[0] ? e.substring(1) : e;
      for (let e = 0; e < s.length && !(n >= o.length); e += 1) {
        const l = s[e];
        if ("c" === l) {
          const e = "+" === t[0] ? t.substring(1) : t;
          (i += e), (n += e.length);
        } else if ("#" === l) {
          if (!this.#et(o[n])) break;
          (i += o[n]), (n += 1);
        } else o[n] === l ? ((i += l), (n += 1)) : (i += l);
      }
      return n < o.length && (i += o.substring(n)), i;
    }
    #B(t) {
      const e = this.#Y(t.target.value),
        s = this.#X();
      if (s) {
        const t = e.substring(s.code.length);
        if (s.ptrn && t) {
          const e = s.ptrn.replace(/\$_bf_\$/g, "\\");
          return new RegExp(`^(${e})$`).test(t) ? "" : "invalid";
        }
        return t ? "" : "required";
      }
      return "required";
    }
    isValidated() {
      return this.#B({ target: this.#d });
    }
    #z() {
      const t = this.#y.findIndex((t) => t.i === this.#a);
      return -1 === t ? 0 : t;
    }
    #X() {
      return this.#I.options.find((t) => t.i === this.#a);
    }
    #st(t) {
      return this.#N.createElement(t);
    }
    #it(t, e) {
      t.classList.add(e);
    }
    #nt(t, e) {
      t.textContent = e;
    }
    #ot(t, e, s) {
      t?.setAttribute?.(e, s);
    }
    #lt(t, e) {
      e.trim()
        .split(/\b\s+\b/g)
        .forEach((e) => this.#it(t, e));
    }
    #ht(t, e) {
      const s = e.length;
      if (s) for (let i = 0; i < s; i += 1) this.#ot(t, e[i].key, e[i].value);
    }
    #M(t, e, s) {
      t.style.setProperty(e, s, "important");
    }
    #rt() {
      const t = this.#F(".option");
      if (!t) return;
      const e = this.#x.getComputedStyle(t),
        s = parseFloat(e.marginTop) + parseFloat(e.marginBottom),
        i = t.offsetHeight + s || 0;
      i !== this.#g && ((this.#g = i), (this.#f.innerHTML = ""), this.#at());
    }
    #at() {
      this.#f.innerHTML = "";
      const t = this.#y.map((t, e) => {
        const s = this.#st("li");
        if (
          (this.#ot(s, "data-key", t.i),
          this.#ot(s, "data-index", e),
          "option" in this.#I.attributes)
        ) {
          const t = this.#I.attributes.option;
          this.#ht(s, t);
        }
        if (!t.i) return this.#nt(s, t.lbl), this.#it(s, "opt-not-found"), s;
        if ((this.#it(s, "option"), "option" in this.#I.classNames)) {
          const t = this.#I.classNames.option;
          t && this.#lt(s, t);
        }
        const i = this.#st("span");
        if ((this.#it(i, "opt-lbl-wrp"), "opt-lbl-wrp" in this.#I.classNames)) {
          const t = this.#I.classNames["opt-lbl-wrp"];
          t && this.#lt(i, t);
        }
        if ("opt-lbl-wrp" in this.#I.attributes) {
          const t = this.#I.attributes["opt-lbl-wrp"];
          this.#ht(i, t);
        }
        if (this.#I.optionFlagImage) {
          const e = this.#st("img");
          if ((this.#it(e, "opt-icn"), "opt-icn" in this.#I.classNames)) {
            const t = this.#I.classNames["opt-icn"];
            t && this.#lt(e, t);
          }
          if ("opt-icn" in this.#I.attributes) {
            const t = this.#I.attributes["opt-icn"];
            this.#ht(e, t);
          }
          (e.src = `${this.#v}/${t.img}`),
            (e.alt = `${t.lbl} flag image`),
            (e.loading = "lazy"),
            this.#ot(e, "aria-hidden", !0),
            i.append(e);
        }
        const n = this.#st("span");
        if ((this.#it(n, "opt-lbl"), "opt-lbl" in this.#I.classNames)) {
          const t = this.#I.classNames["opt-lbl"];
          t && this.#lt(n, t);
        }
        if ("opt-lbl" in this.#I.attributes) {
          const t = this.#I.attributes["opt-lbl"];
          this.#ht(n, t);
        }
        this.#nt(n, t.lbl), i.append(n);
        const o = this.#st("span");
        if ((this.#it(o, "opt-suffix"), "opt-suffix" in this.#I.classNames)) {
          const t = this.#I.classNames["opt-suffix"];
          t && this.#lt(o, t);
        }
        if (
          (this.#nt(o, t.code),
          this.#ot(o, "data-dev-opt-suffix", this.fieldKey),
          "opt-suffix" in this.#I.attributes)
        ) {
          const t = this.#I.attributes["opt-suffix"];
          this.#ht(o, t);
        }
        return (
          this.#ot(s, "tabindex", this.#U() ? "0" : "-1"),
          this.#ot(s, "role", "option"),
          this.#ot(s, "aria-posinset", e + 1),
          this.#ot(s, "aria-setsize", this.#y.length),
          this.#A(s, "click", (t) => {
            (this.#b = !0),
              this.setSelectedCountryItem(t.currentTarget.dataset.key);
          }),
          this.#A(s, "keyup", (t) => {
            "Enter" === t.key &&
              ((this.#b = !0),
              this.setSelectedCountryItem(t.currentTarget.dataset.key));
          }),
          t.disabled && this.#it(s, "disabled-opt"),
          s.append(i, o),
          this.#a === t.i
            ? (this.#it(s, "selected-opt"), this.#ot(s, "aria-selected", !0))
            : this.#ot(s, "aria-selected", !1),
          s
        );
      });
      this.#f.append(...t);
    }
    #ut(t) {
      const e = this.#Y(this.#d.value);
      if (e) {
        let s = this.#X().frmt;
        s || (s = this.#I.inputFormat || "");
        const i = this.#Y(e);
        this.#d.value = this.#tt(t, i, s);
      } else this.#d.value = t;
      if (e) {
        const e = this.#I.valueFormat || "",
          s = this.#Y(this.#d.value);
        this.value = e ? this.#tt(t, s, e) : this.#d.value;
      } else this.value = t;
    }
    #ct() {
      (this.#a = ""),
        this.#I.selectedFlagImage && (this.#r.src = this.#t),
        (this.#b = !1),
        this.setMenu({ open: !1 }),
        (this.value = ""),
        this.#I.selectedCountryClearable && this.#M(this.#o, "display", "none");
    }
    setSelectedCountryItem(t) {
      if (((this.value = ""), (this.#a = t), !this.#a)) return void this.#ct();
      const e = this.#X();
      e &&
        (this.#I.selectedFlagImage && (this.#r.src = `${this.#v}/${e.img}`),
        this.#ut(e.code),
        this.setMenu({ open: !1 }),
        this.#b && this.#d.focus());
    }
    #pt() {
      if (!this.#U()) return;
      this.#at();
      const t = this.#z(),
        e = this.#F(`.option[data-index="${t}"]`);
      e && e.scrollIntoView({ block: "nearest", inline: "nearest" });
    }
    #dt(t) {
      this.#c.value = t;
    }
    #D(t) {
      if ("Enter" === t.key && this.#y.length) {
        const t = this.#F(".option")?.dataset.key;
        this.setSelectedCountryItem(t), this.searchOptions("");
      } else this.searchOptions(t.target.value);
    }
    searchOptions(t) {
      this.#dt(t);
      let e = [];
      t
        ? ((e = this.#I.options.filter((e) => {
            const s = t.toLowerCase(),
              i = (e.lbl || "").toLowerCase(),
              n = (e.val || "").toLowerCase(),
              o = e.code || "";
            return (
              !!i.includes(s) || !!n.includes(s) || !!o.includes(s) || void 0
            );
          })),
          e.length || (e = [{ i: 0, lbl: this.#I.noCountryFoundText }]),
          (this.#y = e),
          this.#I.searchClearable && this.#M(this.#m, "display", "grid"))
        : ((this.#y = this.#I.options),
          this.#I.searchClearable && this.#M(this.#m, "display", "none")),
        this.#pt();
    }
    #U() {
      return this.#i.classList.contains("menu-open");
    }
    #mt() {
      const t = this.#p.getBoundingClientRect(),
        e = t.top,
        s = this.#x.innerHeight - t.bottom;
      s < e && s < this.#I.maxHeight
        ? (this.#M(this.#i, "flex-direction", "column-reverse"),
          this.#M(this.#i, "bottom", "0%"))
        : (this.#M(this.#i, "flex-direction", "column"),
          this.#M(this.#i, "bottom", "auto"));
    }
    setMenu({ open: t }) {
      this.#M(this.#h, "max-height", `${t ? this.#I.maxHeight : 0}px`),
        t
          ? (this.#mt(),
            this.#it(this.#i, "menu-open"),
            this.#A(this.#N, "click", (t) => this.#j(t)),
            this.#ot(this.#c, "tabindex", 0),
            this.#ot(this.#m, "tabindex", 0),
            this.#ot(this.#l, "aria-expanded", !0),
            this.#pt())
          : (this.#i.classList.remove("menu-open"),
            this.#N.removeEventListener("click", this.#j),
            setTimeout(() => {
              this.searchOptions("");
            }, 100),
            this.#ot(this.#c, "tabindex", -1),
            this.#ot(this.#m, "tabindex", -1),
            this.#ot(this.#l, "aria-expanded", !1));
    }
    #k(t) {
      "Space" === t.code && (this.#c.focus(), this.setMenu({ open: !0 })),
        "click" === t.type &&
          (this.#U()
            ? this.setMenu({ open: !1 })
            : (this.#c.focus(), this.setMenu({ open: !0 })));
    }
    set value(t) {
      (this.#n.value = t || ""), this.#ot(this.#n, "value", t || "");
    }
    get value() {
      return this.#n.value;
    }
    #ft() {
      this.#E.forEach(({ selector: t, eventType: e, cb: s }) => {
        t.removeEventListener(e, s);
      });
    }
    destroy() {
      (this.#f.innerHTML = ""), (this.value = ""), (this.#b = !1), this.#ft();
    }
    reset(t) {
      this.#ct(), this.destroy(), (this.value = t), this.init();
    }
  };
})();
var requiredFldValidation = (function () {
  "use strict";
  return (r) => (r?.valid?.req ? "req" : "");
})();
var generateBackslashPattern = (function () {
  "use strict";
  return (t) => (t || "").split("$_bf_$").join("\\");
})();
var emailFldValidation = (function () {
  "use strict";
  return (e, t) =>
    t.err.invalid.show
      ? new RegExp(generateBackslashPattern(t.pattern)).test(e)
        ? ""
        : "invalid"
      : "";
})();
var phoneNumberFldValidation = (function () {
  "use strict";
  return (i, r) => {
    const e = i.isValidated();
    return "invalid" === e
      ? "invalid"
      : "required" === e && r?.valid?.req
      ? "req"
      : "";
  };
})();
var dcsnbxFldValidation = (function () {
  "use strict";
  return (e, r) => (r.valid.req && e !== r.msg.checked ? "req" : "");
})();
var validateForm = (function () {
  "use strict";
  let e,
    t,
    i = {},
    n = [];
  const r = (t) => window?.bf_globals?.[e].inits?.[t],
    o = (e) => {
      const n = e.replace(/\[\d*\]/g, "");
      if (i[n]) return i[n];
      const r = Object.entries(t);
      for (let e = 0; e < r.length; e += 1) {
        const [t, o] = r[e];
        if (o?.fieldName === n) return (i[n] = t), t;
      }
      return "";
    },
    l = () => {
      const n = new FormData(bfSelect(`#form-${e}`)),
        r = {},
        l = Array.from(n.entries());
      return (
        (i = {}),
        l.forEach(([e, i]) => {
          const n = o(e),
            l = e.replace("[]", "");
          n in t &&
            (r[l]
              ? (Array.isArray(r[l]) || (r[l] = [r[l]]), r[l].push(i))
              : (r[l] = i));
        }),
        r
      );
    },
    d = (t, i, r, o = "") => {
      const l = bfSelect(`#form-${e} ${o} .${i}-err-wrp`),
        d = bfSelect(`.${i}-err-txt`, l),
        a = bfSelect(`.${i}-err-msg`, l);
      let s = !1;
      try {
        (s = "grid" === getComputedStyle(l).display),
          s &&
            (l.style.removeProperty("opacity"),
            l.style.removeProperty("height"),
            a.style.removeProperty("display"));
      } catch (e) {
        s = !1;
      }
      d &&
        "err" in (r || {}) &&
        (t && r?.err?.[t]?.show
          ? ((d.innerHTML = r.err[t].custom ? r.err[t].msg : r.err[t].dflt),
            s
              ? setStyleProperty(l, "grid-template-rows", "1fr")
              : setTimeout(() => {
                  a.style.removeProperty("display"),
                    setStyleProperty(l, "height", `${d.offsetHeight}px`),
                    setStyleProperty(l, "opacity", 1);
                }, 100),
            n.push(i))
          : ((d.innerHTML = ""),
            s
              ? setStyleProperty(l, "grid-template-rows", "0fr")
              : (setStyleProperty(l, "height", 0),
                setStyleProperty(l, "opacity", 0),
                setStyleProperty(a, "display", "none"))));
    };
  return function ({ form: i, input: a }, { step: s, otherOptions: f } = {}) {
    i ? (e = i) : a?.form?.id && ([, e] = a.form.id.split("form-"));
    const c = window?.bf_globals?.[e];
    if (void 0 === c) return !1;
    let p = {};
    n = [];
    const u = c.configs.bf_separator;
    if (s) {
      let e = c.layout[s - 1];
      if (!e) return !1;
      e = e?.layout || e;
      const i = e.lg.map((e) => e.i),
        n = c.nestedLayout || {};
      Object.entries(n).forEach(([e, t]) => {
        if (i.includes(e)) {
          const e = t.lg.map((e) => e.i);
          i.push(...e);
        }
      }),
        (t = i.reduce((e, t) => ({ ...e, [t]: c.fields[t] }), {}));
    } else t = c.fields;
    const { modifiedFields: y } = c;
    if ((y && Object.assign(t, y), i)) p = l();
    else if (a) {
      if (!c.validateFocusLost && !f?.validateOnInput) return !0;
      const e = o(a.name);
      (p = l()), (t = { [e]: t[e] });
    }
    let m = !0;
    const h = Object.entries(t);
    let { length: F } = h;
    for (; F--; ) {
      const [t, i] = h[F];
      let n = [""];
      if ("undefined" != typeof checkRepeatedField) {
        const e = checkRepeatedField(t, c);
        n = getRepeatedIndexes(e, c, a);
      }
      for (let o = 0; o < n.length; o += 1) {
        const l = n[o],
          a = l ? `${i.fieldName}[${l}]` : i.fieldName,
          s = l ? `.rpt-index-${l}` : "",
          f = i.typ,
          c = "string" == typeof p[a] ? p[a].trim() : p[a];
        if (bfSelect(`#form-${e} ${s} .${t}.fld-hide`)) {
          d("", t, i, s);
          continue;
        }
        let y = "";
        "check" === f &&
          (y =
            "undefined" != typeof checkFldValidation
              ? checkFldValidation(c, i)
              : ""),
          ("check" !== f && "radio" !== f) ||
            y ||
            "undefined" == typeof customOptionValidation ||
            (y = customOptionValidation(e, t, i)),
          c ||
            y ||
            (y =
              "undefined" != typeof requiredFldValidation
                ? requiredFldValidation(i)
                : null),
          d(y, t, i, s),
          y
            ? (m = !1)
            : c &&
              ("number" === f && "undefined" != typeof nmbrFldValidation
                ? (y = nmbrFldValidation(c, i))
                : "email" === f && "undefined" != typeof emailFldValidation
                ? (y = emailFldValidation(c, i))
                : "url" === f && "undefined" != typeof urlFldValidation
                ? (y = urlFldValidation(c, i))
                : "decision-box" === f &&
                  "undefined" != typeof dcsnbxFldValidation
                ? (y = dcsnbxFldValidation(c, i))
                : ["check", "select", "image-select"].includes(f) &&
                  "undefined" != typeof checkMinMaxOptions
                ? (y = checkMinMaxOptions(c, i, u))
                : "range" === f && "undefined" != typeof checkMinMaxValue
                ? (y = checkMinMaxValue(c, i))
                : "file-up" === f && "undefined" != typeof fileupFldValidation
                ? (y = fileupFldValidation(c, i))
                : "advanced-file-up" === f &&
                  "undefined" != typeof advanceFileUpFldValidation
                ? (y = advanceFileUpFldValidation(r(t), i))
                : "phone-number" === f &&
                  "undefined" != typeof phoneNumberFldValidation &&
                  (y = phoneNumberFldValidation(r(t), i)),
              i?.valid?.regexr &&
                !y &&
                (y =
                  "undefined" != typeof regexPatternValidation
                    ? regexPatternValidation(c, i)
                    : null),
              d(y, t, i, s),
              y && (m = !1));
      }
    }
    return moveToFirstErrFld(c, n), m;
  };
})();
const customFldConfigPaths = {
  country: {
    fieldKey: { var: "fieldKey" },
    options: { path: "options" },
    placeholder: { path: "ph" },
    assetsURL: {
      val: "https:// Unicorn Fxglobal.com/wp-content/plugins/bit-form/static/countries/",
    },
    classNames: { path: "customClasses" },
    attributes: { path: "customAttributes" },
    defaultValue: { path: ["val", "config->defaultValue"], val: "" },
  },
  "phone-number": {
    fieldKey: { var: "fieldKey" },
    options: { path: "options" },
    assetsURL: {
      val: "https:// Unicorn Fxglobal.com/wp-content/plugins/bit-form/static/countries/",
    },
    classNames: { path: "customClasses" },
    attributes: { path: "customAttributes" },
  },
};
const fldContainers = {
  country: ".__$fk__-country-fld-wrp",
  "phone-number": ".__$fk__-phone-fld-wrp",
};
function initAllCustomFlds(formContentId = null) {
  const allContendIds = formContentId
    ? [formContentId]
    : Object.keys(bf_globals);
  allContendIds.forEach((contentId) => {
    const contentData = bf_globals[contentId];
    const flds = bf_globals[contentId].fields;
    const fldKeys = Object.keys(flds).reverse();
    fldKeys.forEach((fldKey) => {
      const fldData = flds[fldKey];
      const fldType = fldData.typ;
      if (fldType === "paypal") {
      } else if (fldType === "razorpay") {
      } else if (fldType === "recaptcha") {
      } else if (fldType === "turnstile") {
      } else if (fldType === "stripe") {
      } else if (customFldConfigPaths[fldType]) {
        contentData.inits[fldKey] = getFldInstance(contentId, fldKey, fldType);
      }
    });
    if (
      contentData.gRecaptchaVersion === "v3" &&
      contentData.gRecaptchaSiteKey
    ) {
    }
  });
}
function getFldInstance(contentId, fldKey, fldTyp, nestedSelector = "") {
  const fldClass = this["bit_" + fldTyp.replace(/-/g, "_") + "_field"];
  const selector =
    "#form-" +
    contentId +
    " " +
    nestedSelector +
    fldContainers[fldTyp].replace("__$fk__", fldKey);
  if (!fldClass || !bfSelect(selector)) return;
  return new fldClass(selector, getFldConf(contentId, fldKey, fldTyp));
}
function getFldConf(contentId, fieldKey, fldTyp) {
  const fldData = bf_globals[contentId].fields[fieldKey];
  const fldConfPaths = Object.entries(customFldConfigPaths[fldTyp]);
  let fldConf = {};
  const { formId } = bf_globals[contentId];
  if (!("config" in customFldConfigPaths[fldTyp]) && "config" in fldData)
    fldConf = fldData.config;
  const varData = { contentId, fieldKey, formId };
  fldConfPaths.forEach(([confPath, fldPath]) => {
    let value = "";
    if (fldPath.var) value = varData[fldPath.var];
    if (!value && fldPath.path) {
      if (Array.isArray(fldPath.path)) {
        fldPath.path.forEach((path) => {
          if (!value) value = getDataFromNestedPath(fldData, path);
        });
      } else {
        value = getDataFromNestedPath(fldData, fldPath.path);
      }
    }
    if (!value && fldPath.val) {
      value = fldPath.val;
      if (typeof value === "string") {
        Object.entries(varData).forEach(([key, val]) => {
          value = value.replace("__$" + key + "__", val);
        });
      }
    }
    fldConf = setDataToNestedPath(fldConf, confPath, value);
  });
  return fldConf;
}
function getDataFromNestedPath(data, key) {
  const keys = key.split("->");
  const lastKey = keys.pop();
  let current = { ...data };
  for (const k of keys) {
    if (!(k in current)) return null;
    current = current[k];
  }
  return current[lastKey] || null;
}
function setDataToNestedPath(data, key, value) {
  const keys = key.split("->");
  const lastKey = keys.pop();
  let current = { ...data };
  keys.forEach((k) => {
    if (!current[k]) current[k] = {};
    current = current[k];
  });
  current[lastKey] = value;
  return current;
}
var bitform_init = (function () {
  "use strict";
  function e(e = null) {
    "undefined" != typeof hidden_token_field && hidden_token_field(e),
      "undefined" != typeof initAllCustomFlds && initAllCustomFlds(e),
      "undefined" != typeof initAddOtherOpt && initAddOtherOpt(e),
      "undefined" != typeof setSliderFieldValue && setSliderFieldValue(e),
      "undefined" != typeof initCheckDisableOnMax && initCheckDisableOnMax(e),
      "undefined" != typeof validate_focus && validate_focus(e),
      "undefined" != typeof submit_form && submit_form(e),
      "undefined" != typeof bit_form_abandonment && bit_form_abandonment(e),
      "undefined" != typeof setFieldValues && setFieldValues(e),
      "undefined" != typeof bit_multi_step_form && bit_multi_step_form(e),
      "undefined" != typeof bit_conversational_form &&
        bit_conversational_form(e);
  }
  return (
    document.addEventListener("DOMContentLoaded", () => {
      e();
    }),
    e
  );
})();
let bfContentId = "",
  bfVars = "";
