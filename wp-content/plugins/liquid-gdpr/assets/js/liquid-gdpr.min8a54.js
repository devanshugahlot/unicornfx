"use strict";(()=>{class e{constructor(e,t){this.DOM={},this.DOM.element=e,this.DOM.acceptBtn=this.DOM.element.querySelector(".lqd-gdpr-accept"),this.expires=t,document.body.appendChild(this.DOM.element),this.init(),this.eventListeners(),this.DOM.element.classList.add("lqd-gdpr-ready")}init(){const e=this.getCookie();(e.length<1||"accepted"!==e[0].split("=")[1])&&this.showPopup()}eventListeners(){this.DOM.acceptBtn.addEventListener("click",(()=>{this.setCookie.call(this),this.hidePopup.call(this)}))}setCookie(){const e=new Date;e.setTime(e.getTime()+24*this.expires*60*60*1e3);const t="expires="+e.toUTCString();document.cookie="lqd-gdpr=accepted; ".concat(t)}getCookie(){return document.cookie.split(";").filter((e=>"lqd-gdpr"===e.trim().split("=")[0]))}showPopup(){this.DOM.element.classList.add("lqd-gdpr-visible"),this.DOM.element.classList.remove("lqd-gdpr-hidden")}hidePopup(){this.DOM.element.classList.add("lqd-gdpr-hidden"),this.DOM.element.classList.remove("lqd-gdpr-visible")}}const t=document.querySelector("#lqd-gdpr");t&&new e(t,365)})();