(()=>{let e=(null===(t=n())||void 0===t?void 0:t.children[0].className.toString()).includes("Player");var t;function n(){return document.getElementById("react-mount")}const c=new MutationObserver((function(t){for(const n of t){const t=n.addedNodes[0];t&&(t.className.includes("Player")?(e=!0,r(!0)):(e=!1,r(!1)))}})),o=n();c.observe(o,{attributes:!1,childList:!0,subtree:!1});const u={attributes:!0,childList:!1,subtree:!1},l=new MutationObserver((function(e){for(const t of e){const e=t.target.className,n=document.querySelector(".scene");n.style.cursor="scene hide"!==e?"auto":"none"}}));function r(e){e?l.observe(document.querySelector(".scene"),u):l.disconnect()}e&&r(!0);const s=()=>{document.querySelector(".scene").dispatchEvent(new Event("mousemove",{bubbles:!0}))},i=()=>{document.querySelector("button.language.subtitlesAvailable").dispatchEvent(new Event("mouseout",{bubbles:!0}))};function a(e){s(),document.querySelector(".audio-control").dispatchEvent(new Event("mouseover",{bubbles:!0}));const t=document.querySelector(".audio-slider"),n=Object.keys(t).filter((function(e){return e.indexOf("__reactProps")>=0}));try{const c=t[n[0]].children.props,o=Math.min(Math.max(c.value+e,0),1);c.onChange(o)}catch(e){console.log(e)}document.querySelector(".audio-control").dispatchEvent(new Event("mouseout",{bubbles:!0}))}document.addEventListener("dblclick",(function(t){e&&(s(),document.querySelector(".playback-controls").contains(t.target)||document.dispatchEvent(new KeyboardEvent("keyup",{key:"f"})))})),document.addEventListener("keyup",(t=>{var n;if(t.preventDefault(),e)switch(t.key){case"m":{s();const e=document.querySelector(".audio-control");null==e||e.click(),setTimeout((()=>{const e=document.querySelector(".play");null==e||e.click()}),10);break}case"f":{s();const e=null!==(n=document.querySelector(".fullscreen"))&&void 0!==n?n:document.querySelector(".no-fullscreen");null==e||e.click(),setTimeout((()=>{const e=document.querySelector(".play");null==e||e.click()}),10);break}case"s":{const e=document.querySelector(".skip-preliminaries-button");null==e||e.click();break}case"n":{const e=document.querySelector(".Buttons-primary-3n82B");null==e||e.click();break}case"t":d<=1&&(b.cancel(),v(!1),b.setup(i,2e3)),d=0}})),document.addEventListener("keydown",(t=>{if(t.preventDefault(),e)switch(t.key){case"ArrowUp":a(.1);break;case"ArrowDown":a(-.1);break;case"t":2==d&&(b.cancel(),v(!0),b.setup(i,2e3)),d++}}));let d=0,m=0;const b={remind:function(e){e(),this.timeoutID=void 0},setup:function(e,t){"number"==typeof this.timeoutID&&this.cancel(),this.timeoutID=setTimeout(function(){this.remind(e)}.bind(this),t)},cancel:function(){clearTimeout(this.timeoutID)}};function v(e){var t,n;s(),document.querySelector("button.language.subtitlesAvailable").dispatchEvent(new Event("mouseover",{bubbles:!0}));const c=Array.from(null===(n=null===(t=document.querySelector("div.subtitle-languages"))||void 0===t?void 0:t.children[1])||void 0===n?void 0:n.children),o=c.length;if(!(o<=1)){if(m>=o)return c[0].click(),void(m=0);if(c[o-1].className)c[m].click();else if(e)c[o-1].click();else{if(m<o-2)return c[m+1].click(),void m++;c[0].click(),m=0}}}})();