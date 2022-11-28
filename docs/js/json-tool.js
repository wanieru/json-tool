(()=>{"use strict";var e={671:(e,t)=>{Object.defineProperty(t,"__esModule",{value:!0}),t.JsonTool=void 0,t.JsonTool=class{constructor(e){var t,n;this.root=document.createElement("div"),this.root.style.fontFamily="monospace",this.root.style.marginLeft="30px",this.root.classList.add("json-tool"),this.rootObject=null,this.rootElement=null;const o=document.createElement("iframe");o.style.width="100%",o.style.height="100%",o.style.overflow="scroll",o.style.border="0",e.appendChild(o),this.iframeBody=null===(n=o.contentDocument||(null===(t=o.contentWindow)||void 0===t?void 0:t.document))||void 0===n?void 0:n.querySelector("body"),this.iframeBody.append(this.root),this.createCss(this.iframeBody),o.onload=()=>{var e,t;this.iframeBody=null===(t=o.contentDocument||(null===(e=o.contentWindow)||void 0===e?void 0:e.document))||void 0===t?void 0:t.querySelector("body"),this.iframeBody.append(this.root),this.createCss(this.iframeBody)}}load(e,t){if(this.root.innerHTML="",e.title){const t=document.createElement("h3");t.textContent=e.title,n.addDescription(t,e.description),this.root.appendChild(t)}this.rootObject=document.createElement("div"),this.root.appendChild(this.rootObject),this.rootElement=new n(this.rootObject,e,t,(()=>this.onUpdate()))}getValue(){var e;return null===(e=this.rootElement)||void 0===e?void 0:e.getValue()}onUpdate(){var e;if(!this.rootObject)return;let t=1;null===(e=this.rootObject)||void 0===e||e.querySelectorAll(".line-number").forEach((e=>{e.innerText=t.toString(),t++}))}createCss(e){const t=document.createElement("style");e.appendChild(t),t.innerHTML="\n            .json-tool-btn\n             {\n                border: 1px black solid;\n                cursor: pointer;\n                display: block;\n             }\n              .json-tool-block > .json-tool-btn {\n                margin-top: -17px;\n                margin-left: -40px;\n                position: absolute;\n                opacity: 0;\n              }\n              .json-tool-block:hover > .json-tool-btn\n              {\n                opacity: 1;\n              }\n              .json-tool-value > .json-tool-btn {\n                margin-left: 10px;\n                display: inline-block;\n                position: absolute;\n                opacity :0;\n              }\n              .json-tool-value:hover > .json-tool-btn\n              {\n                opacity :1;\n              }\n              .json-tool-key > .json-tool-btns {\n                margin-left: -32px;\n                display: inline-block;\n                position: absolute;\n                width: 32px;\n                text-align: right;\n                opacity: 0;\n              }\n              .json-tool-key:hover > .json-tool-btns\n              {\n                opacity: 1;\n              }\n\n              .json-tool-key > .json-tool-btns > .json-tool-btn {\n                display: inline-block;\n                margin-right: 2px;\n              }\n              .json-tool-value > .json-tool-type\n              {\n                float:right;\n                opacity: 0;\n                padding:0;\n                margin:0;\n                border:0;\n              }\n              .json-tool-value.json-tool-object > .json-tool-type\n              {\n                float:none;\n                position: absolute;\n                margin-left: 15px;\n              }\n              .json-tool-value:hover > .json-tool-type\n              {\n                opacity: 1;\n              }\n\n              .json-tool-block.opened > .json-tool-key {display: block}\n              .json-tool-block.closed > .json-tool-key {display: none}\n\n              .line-number\n              {\n                position: absolute;\n                left: 0;\n                text-align: right;\n                width: 20px;\n              }\n              .json-tool-value.json-tool-object > .line-number\n              {\n                margin-top: -15px;\n              }\n              .json-tool input, .json-tool select, .json-tool textarea\n              {\n                border: 0;\n                background-color: #ece9e9;\n                padding: 0;\n                margin: 1px;\n              }\n"}};class n{constructor(e,t,o,s){this.arrayElements=[],this.objectElements={},this.element=e,this.setStyle(),this.schema=t,this.onUpdate=s,this.currentValues={},this.types=t?n.getDefaultAvailableTypes(t):[];const i=n.getType(o);if(this.currentType="","undefined"!==i)this.currentType=i,this.types.push(i),this.setCurrentTypeValue(o);else if(this.schema){const e=n.getDefaultValue(this.schema);this.currentType=e.type,this.setCurrentTypeValue(e.value)}this.types=[...new Set(this.types)],this.updateElement()}setCurrentTypeValue(e){this.currentValues[this.currentType]=void 0!==e?JSON.parse(JSON.stringify(e)):void 0}static addDescription(e,t){t&&(e.title=t,e.style.textDecoration="underline dotted",e.style.cursor="help")}static getType(e){return void 0===e?"undefined":Array.isArray(e)?"array":null===e?"null":typeof e}static isInteger(e){if(!e)return!1;const t=Array.isArray(e.type)?e.type:[e.type];return t.includes("integer")&&!t.includes("number")}static getDefaultAvailableTypes(e){let t=Array.isArray(e.type)?[...e.type]:[e.type];return t=t.map((e=>"integer"===e?"number":e)),t}static getDefaultValue(e){const t=this.getDefaultAvailableTypes(e);return e.default?{type:this.getType(e.default),value:e.default}:{type:t[0],value:this.getDefaultValueForType(e,t[0])}}static getDefaultValueForType(e,t){var n,o,s;if("null"===t)return null;if("number"===t)return this.isInteger(e)?Math.ceil(null!==(n=null==e?void 0:e.minimum)&&void 0!==n?n:0):null!==(o=null==e?void 0:e.minimum)&&void 0!==o?o:0;if("string"===t)return(null==e?void 0:e.enum)?e.enum[0]:"color"===(null==e?void 0:e.format)?"#000000":"date"===(null==e?void 0:e.format)?(new Date).toDateString():"";if("boolean"===t)return!1;if("array"===t)return[];if("object"===t){const t={};if(null==e?void 0:e.properties)for(const n of null!==(s=e.required)&&void 0!==s?s:[]){if(!e.properties.hasOwnProperty(n))continue;const o=this.getDefaultValue(e.properties[n]);t[n]=o.value}return t}}updateElement(){var e,t,o,s,i,l,a,r,c,d,u,p,h,m,v,y,f,b,g,j,T,E,V,x,L,k,C;this.objectElements={},this.arrayElements=[],this.element.innerHTML="",this.element.style.display="inline-block",this.element.classList.remove("json-tool-object"),this.element.append(this.createLineNumber());const D=this.currentType,w=null!==(e=this.currentValues[D])&&void 0!==e?e:this.currentValues[D]=n.getDefaultValueForType(this.schema,D);if(this.types.length>1){const e=document.createElement("select");e.classList.add("json-tool-type");for(const t of this.types){const n=document.createElement("option");n.innerText=t,n.value=t,e.append(n)}e.value=this.currentType,e.onchange=()=>{this.changeType(e.value)},this.element.append(e)}if("object"===D){this.element.append(this.createLineNumber(!0)),this.element.style.display="block",this.element.classList.add("json-tool-object"),this.element.append("{");const e=this.createBlock();this.element.append(e),this.element.append("}"),this.element.append(this.createLineNumber());for(const n in null!=w?w:{}){const l=this.createObjectKeyValuePair(n,(null===(t=this.schema)||void 0===t?void 0:t.properties)?this.schema.properties[n]:null,w[n]);e.append(l);const a=document.createElement("div");if(l.prepend(a),a.classList.add("json-tool-btns"),(null===(o=this.schema)||void 0===o?void 0:o.properties)&&!this.schema.properties.hasOwnProperty(n)){const e=document.createElement("div");e.classList.add("json-tool-btn"),e.innerText="X",e.onclick=()=>{const e=this.getValue();delete e[n],this.setCurrentTypeValue(e),this.updateElement()},a.append(e)}else if(!(null===(i=null===(s=this.schema)||void 0===s?void 0:s.required)||void 0===i?void 0:i.includes(n))){const e=document.createElement("div");e.classList.add("json-tool-btn"),e.innerText="∽",e.onclick=()=>{const e=this.getValue();delete e[n],this.setCurrentTypeValue(e),this.updateElement()},a.append(e)}}if(null===(l=this.schema)||void 0===l?void 0:l.properties)for(const t in this.schema.properties)if(!(null==w?void 0:w.hasOwnProperty(t)))if(null===(r=null===(a=this.schema)||void 0===a?void 0:a.required)||void 0===r?void 0:r.includes(t)){const n=this.createObjectKeyValuePair(t,this.schema.properties[t]);e.append(n)}else{const o=this.createObjectKeyValuePair(t,this.schema.properties[t],void 0,!0);e.append(o),o.style.textDecoration="line-through 2px";const s=document.createElement("div");o.prepend(s),s.classList.add("json-tool-btns");const i=document.createElement("div");i.classList.add("json-tool-btn"),i.innerText="≁",i.onclick=()=>{var e;if(null===(e=this.schema)||void 0===e?void 0:e.properties){const e=this.getValue();e[t]=n.getDefaultValue(this.schema.properties[t]).value,this.setCurrentTypeValue(e),this.updateElement()}},s.append(i)}}else if("array"===D){this.element.append(this.createLineNumber(!0)),this.element.style.display="block",this.element.classList.add("json-tool-object"),this.element.append("[");const e=this.createBlock();this.element.append(e);const t=document.createElement("div");t.classList.add("json-tool-btn"),t.innerText="+",this.element.append(t),t.onclick=()=>{var e;const t=[...this.getValue()];if(null===(e=this.schema)||void 0===e?void 0:e.items){const e=n.getDefaultValue(this.schema.items).value;t.push(e),this.currentType=D,this.setCurrentTypeValue(t),this.updateElement()}},this.element.append("]"),this.element.append(this.createLineNumber());const o=null!=w?w:[];for(let t=0;t<o.length;t++){const n=t,o=this.createObjectKeyValuePair(t,(null===(c=this.schema)||void 0===c?void 0:c.items)?this.schema.items:null,w[t]);e.append(o);const s=document.createElement("div");o.prepend(s),s.classList.add("json-tool-btns");const i=document.createElement("div");i.classList.add("json-tool-btn"),i.innerText="X",i.onclick=()=>{const e=[...this.getValue()];e.splice(n,1),this.setCurrentTypeValue(e),this.updateElement()},s.append(i);const l=document.createElement("div");l.classList.add("json-tool-btn"),l.innerText="ᐃ",l.onclick=()=>{let e=[...this.getValue()];const t=e.splice(n,1);e=e.slice(0,n-1).concat(t).concat(e.slice(n-1)),this.setCurrentTypeValue(e),this.updateElement()},s.append(l);const a=document.createElement("div");a.classList.add("json-tool-btn"),a.innerText="ᐁ",a.onclick=()=>{let e=[...this.getValue()];const t=e.splice(n,1);e=e.slice(0,n+1).concat(t).concat(e.slice(n+1)),this.setCurrentTypeValue(e),this.updateElement()},s.append(a)}}else if("boolean"===D){const e=document.createElement("input");e.type="checkbox",e.checked=w,e.onchange=()=>{this.setCurrentTypeValue(e.checked)},this.element.append(e)}else if("string"===D)if(null===(d=this.schema)||void 0===d?void 0:d.enum){const e=document.createElement("select");for(const t of[...new Set(this.schema.enum.concat(w))]){const n=document.createElement("option");n.innerText=t,n.value=t,e.append(n)}e.value=w,e.onchange=()=>{this.setCurrentTypeValue(e.value)},this.element.append(e)}else if("textarea"===(null===(u=this.schema)||void 0===u?void 0:u.format)){const e=document.createElement("textarea");e.value=w,e.minLength=null!==(h=null===(p=this.schema)||void 0===p?void 0:p.minLength)&&void 0!==h?h:0,e.maxLength=null!==(v=null===(m=this.schema)||void 0===m?void 0:m.maxLength)&&void 0!==v?v:99999999999999,e.onchange=()=>{this.setCurrentTypeValue(e.value)},this.element.append(e)}else if("date"===(null===(y=this.schema)||void 0===y?void 0:y.format)){const e=document.createElement("input");e.type="date",e.onchange=()=>{var t,n;this.setCurrentTypeValue(null!==(n=null===(t=e.valueAsDate)||void 0===t?void 0:t.toDateString())&&void 0!==n?n:"")},this.element.append(e),e.valueAsDate=new Date(w)}else{const e=document.createElement("input");e.type="text",(null===(f=this.schema)||void 0===f?void 0:f.format)&&["password","email","color","url"].includes(this.schema.format)&&(e.type=this.schema.format),e.value=w,e.minLength=null!==(g=null===(b=this.schema)||void 0===b?void 0:b.minLength)&&void 0!==g?g:0,e.maxLength=null!==(T=null===(j=this.schema)||void 0===j?void 0:j.maxLength)&&void 0!==T?T:99999999999999,e.onchange=()=>{this.setCurrentTypeValue(e.value)},this.element.append(e)}else if("null"===D)this.element.append("null");else if("number"===D){const e=document.createElement("input");e.type="number",e.value=w.toString(),e.min=null!==(x=null===(V=null===(E=this.schema)||void 0===E?void 0:E.minimum)||void 0===V?void 0:V.toString())&&void 0!==x?x:"",e.max=null!==(C=null===(k=null===(L=this.schema)||void 0===L?void 0:L.maximum)||void 0===k?void 0:k.toString())&&void 0!==C?C:"",n.isInteger(this.schema)&&(e.step="1"),e.onchange=()=>{this.setCurrentTypeValue(parseFloat(e.value))},this.element.append(e)}else this.element.append(`[${D}] : ${w}`);this.onUpdate&&this.onUpdate()}createLineNumber(e=!1){const t=document.createElement("div");return t.classList.add("line-number"),e&&(t.style.marginTop="0"),t}createBlock(){const e=document.createElement("div");e.classList.add("json-tool-block"),e.style.paddingLeft="25px",e.style.borderLeft="1px dashed black",e.style.marginLeft="3px";let t=!1;const n=document.createElement("div");e.append(n),n.classList.add("json-tool-btn");const o=()=>{t=!t,n.innerText=t?"ᐯ":"ᐳ",e.classList.remove("opened","closed"),e.classList.add(t?"opened":"closed")};return n.onclick=o,o(),e}createObjectKeyValuePair(e,t,o,s=!1){var i;const l=document.createElement("div"),a=e;e="number"==typeof e?(null==t?void 0:t.title)?`${t.title} ${e}`:e:null!==(i=null==t?void 0:t.title)&&void 0!==i?i:e;const r=document.createElement("span");if(r.innerText=e.toString(),n.addDescription(r,null==t?void 0:t.description),l.append(r),l.classList.add("json-tool-key"),l.append(": "),!s){const e=document.createElement("div"),s=new n(e,t,o,(()=>this.onUpdate&&this.onUpdate()));"array"===this.currentType?this.arrayElements.push(s):"object"===this.currentType&&(this.objectElements[a]=s),l.append(e)}return l}changeType(e){var t;this.currentType=e,this.currentValues.hasOwnProperty(e)||(void 0!==(null===(t=this.schema)||void 0===t?void 0:t.default)&&n.getType(this.schema.default)===e?this.setCurrentTypeValue(this.schema.default):this.setCurrentTypeValue(n.getDefaultValueForType(this.schema,e))),this.updateElement()}setStyle(){this.element.style.whiteSpace="pre",this.element.classList.add("json-tool-value")}getValue(){var e;let t;if("array"===this.currentType)t=this.arrayElements.map((e=>e.getValue()));else if("object"===this.currentType){const e={};for(const t in this.objectElements)e[t]=this.objectElements[t].getValue();t=e}else t=null!==(e=this.currentValues[this.currentType])&&void 0!==e?e:n.getDefaultValueForType(this.schema,this.currentType);return this.currentValues[this.currentType]=t,t}}}},t={};function n(o){var s=t[o];if(void 0!==s)return s.exports;var i=t[o]={exports:{}};return e[o](i,i.exports,n),i.exports}(()=>{const e=n(671);window.JsonTool=e.JsonTool})()})();
//# sourceMappingURL=json-tool.js.map