/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./dist/JsonTool.js":
/*!**************************!*\
  !*** ./dist/JsonTool.js ***!
  \**************************/
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.JsonElement = exports.JsonTool = void 0;
class JsonTool {
    constructor(element) {
        var _a, _b;
        this.root = document.createElement("div");
        this.root.style.fontFamily = "monospace";
        this.root.style.marginLeft = "30px";
        this.root.classList.add("json-tool");
        this.rootObject = null;
        this.rootElement = null;
        const iframe = document.createElement("iframe");
        iframe.style.width = "100%";
        iframe.style.height = "100%";
        iframe.style.overflow = "scroll";
        iframe.style.border = "0";
        element.appendChild(iframe);
        this.iframeBody = (_b = (iframe.contentDocument || ((_a = iframe.contentWindow) === null || _a === void 0 ? void 0 : _a.document))) === null || _b === void 0 ? void 0 : _b.querySelector("body");
        this.iframeBody.append(this.root);
        this.createCss(this.iframeBody);
        iframe.onload = () => {
            var _a, _b;
            this.iframeBody = (_b = (iframe.contentDocument || ((_a = iframe.contentWindow) === null || _a === void 0 ? void 0 : _a.document))) === null || _b === void 0 ? void 0 : _b.querySelector("body");
            this.iframeBody.append(this.root);
            this.createCss(this.iframeBody);
        };
    }
    load(schema, value) {
        this.root.innerHTML = "";
        if (schema.title) {
            const title = document.createElement("h3");
            title.textContent = schema.title;
            JsonElement.addDescription(title, schema.description);
            this.root.appendChild(title);
        }
        this.rootObject = document.createElement("div");
        this.root.appendChild(this.rootObject);
        this.rootElement = new JsonElement(this.rootObject, schema, value, () => this.onUpdate());
    }
    getValue() {
        var _a;
        console.log(this.rootElement);
        return (_a = this.rootElement) === null || _a === void 0 ? void 0 : _a.getValue();
    }
    onUpdate() {
        var _a;
        if (!this.rootObject)
            return;
        let number = 1;
        (_a = this.rootObject) === null || _a === void 0 ? void 0 : _a.querySelectorAll(".line-number").forEach(e => {
            e.innerText = number.toString();
            number++;
        });
    }
    createCss(parent) {
        const style = document.createElement("style");
        parent.appendChild(style);
        style.innerHTML =
            `
            .json-tool-btn
             {
                border: 1px black solid;
                cursor: pointer;
                display: block;
             }
              .json-tool-block > .json-tool-btn {
                margin-top: -17px;
                margin-left: -40px;
                position: absolute;
                opacity: 0;
              }
              .json-tool-block:hover > .json-tool-btn
              {
                opacity: 1;
              }
              .json-tool-value > .json-tool-btn {
                margin-left: 10px;
                display: inline-block;
                position: absolute;
                opacity :0;
              }
              .json-tool-value:hover > .json-tool-btn
              {
                opacity :1;
              }
              .json-tool-key > .json-tool-btns {
                margin-left: -32px;
                display: inline-block;
                position: absolute;
                width: 32px;
                text-align: right;
                opacity: 0;
              }
              .json-tool-key:hover > .json-tool-btns
              {
                opacity: 1;
              }

              .json-tool-key > .json-tool-btns > .json-tool-btn {
                display: inline-block;
                margin-right: 2px;
              }
              .json-tool-value > .json-tool-type
              {
                float:right;
                opacity: 0;
                padding:0;
                margin:0;
                border:0;
              }
              .json-tool-value.json-tool-object > .json-tool-type
              {
                float:none;
                position: absolute;
                margin-left: 15px;
              }
              .json-tool-value:hover > .json-tool-type
              {
                opacity: 1;
              }

              .json-tool-block.opened > .json-tool-key {display: block}
              .json-tool-block.closed > .json-tool-key {display: none}

              .line-number
              {
                position: absolute;
                left: 0;
                text-align: right;
                width: 20px;
              }
              .json-tool-value.json-tool-object > .line-number
              {
                margin-top: -15px;
              }
              .json-tool input, .json-tool select, .json-tool textarea
              {
                border: 0;
                background-color: #ece9e9;
                padding: 0;
                margin: 1px;
              }
`;
    }
}
exports.JsonTool = JsonTool;
class JsonElement {
    constructor(element, schema, value, onUpdate) {
        this.arrayElements = [];
        this.objectElements = {};
        this.element = element;
        this.setStyle();
        this.schema = schema;
        this.onUpdate = onUpdate;
        this.currentValues = {};
        this.types = schema ? JsonElement.getDefaultAvailableTypes(schema) : [];
        const actualType = JsonElement.getType(value);
        this.currentType = "";
        if (actualType !== "undefined") {
            this.currentType = actualType;
            this.types.push(actualType);
            this.setCurrentTypeValue(value);
        }
        else if (this.schema) {
            const def = JsonElement.getDefaultValue(this.schema);
            this.currentType = def.type;
            this.setCurrentTypeValue(def.value);
        }
        this.types = [...new Set(this.types)];
        this.updateElement();
    }
    setCurrentTypeValue(value) {
        this.currentValues[this.currentType] = typeof value !== "undefined" ? JSON.parse(JSON.stringify(value)) : undefined;
    }
    static addDescription(element, description) {
        if (description) {
            element.title = description;
            element.style.textDecoration = "underline dotted";
            element.style.cursor = "help";
        }
    }
    static getType(value) {
        if (typeof value === "undefined")
            return "undefined";
        if (Array.isArray(value)) {
            return "array";
        }
        else if (value === null) {
            return "null";
        }
        else {
            return typeof value;
        }
    }
    static isInteger(schema) {
        if (!schema)
            return false;
        const arr = Array.isArray(schema.type) ? schema.type : [schema.type];
        return arr.includes("integer") && !arr.includes("number");
    }
    static getDefaultAvailableTypes(schema) {
        let types = Array.isArray(schema.type) ? [...schema.type] : [schema.type];
        types = types.map(t => {
            if (t === "integer")
                return "number";
            return t;
        });
        return types;
    }
    static getDefaultValue(schema) {
        const availableTypes = this.getDefaultAvailableTypes(schema);
        if (schema.default) {
            return { type: this.getType(schema.default), value: schema.default };
        }
        else {
            return { type: availableTypes[0], value: this.getDefaultValueForType(schema, availableTypes[0]) };
        }
    }
    static getDefaultValueForType(schema, type) {
        var _a, _b, _c;
        if (type === "null") {
            return null;
        }
        else if (type === "number") {
            return this.isInteger(schema) ? Math.ceil((_a = schema === null || schema === void 0 ? void 0 : schema.minimum) !== null && _a !== void 0 ? _a : 0) : (_b = schema === null || schema === void 0 ? void 0 : schema.minimum) !== null && _b !== void 0 ? _b : 0;
        }
        else if (type === "string") {
            if (schema === null || schema === void 0 ? void 0 : schema.enum)
                return schema.enum[0];
            if ((schema === null || schema === void 0 ? void 0 : schema.format) === "color")
                return "#000000";
            if ((schema === null || schema === void 0 ? void 0 : schema.format) === "date")
                return new Date().toDateString();
            return "";
        }
        else if (type === "boolean") {
            return false;
        }
        else if (type === "array") {
            return [];
        }
        else if (type === "object") {
            const obj = {};
            if (schema === null || schema === void 0 ? void 0 : schema.properties) {
                for (const required of (_c = schema.required) !== null && _c !== void 0 ? _c : []) {
                    if (!schema.properties.hasOwnProperty(required))
                        continue;
                    const def = this.getDefaultValue(schema.properties[required]);
                    obj[required] = def.value;
                }
            }
            return obj;
        }
    }
    updateElement() {
        var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q, _r, _s, _t, _u, _v, _w, _x, _y, _z, _0, _1, _2;
        this.objectElements = {};
        this.arrayElements = [];
        this.element.innerHTML = "";
        this.element.style.display = "inline-block";
        this.element.classList.remove("json-tool-object");
        this.element.append(this.createLineNumber());
        const type = this.currentType;
        const val = (_a = this.currentValues[type]) !== null && _a !== void 0 ? _a : (this.currentValues[type] = JsonElement.getDefaultValueForType(this.schema, type));
        if (this.types.length > 1) {
            const select = document.createElement("select");
            select.classList.add("json-tool-type");
            for (const t of this.types) {
                const option = document.createElement("option");
                option.innerText = t;
                option.value = t;
                select.append(option);
            }
            select.value = this.currentType;
            select.onchange = () => {
                var _a;
                this.currentType = select.value;
                this.setCurrentTypeValue((_a = this.currentValues[this.currentType]) !== null && _a !== void 0 ? _a : JsonElement.getDefaultValueForType(this.schema, this.currentType));
                this.updateElement();
            };
            this.element.append(select);
        }
        if (type === "object") {
            this.element.append(this.createLineNumber(true));
            this.element.style.display = "block";
            this.element.classList.add("json-tool-object");
            this.element.append("{");
            const object = this.createBlock();
            this.element.append(object);
            this.element.append("}");
            this.element.append(this.createLineNumber());
            for (const key in val !== null && val !== void 0 ? val : {}) {
                const obj = this.createObjectKeyValuePair(key, ((_b = this.schema) === null || _b === void 0 ? void 0 : _b.properties) ? this.schema.properties[key] : null, val[key]);
                object.append(obj);
                const buttons = document.createElement("div");
                obj.prepend(buttons);
                buttons.classList.add("json-tool-btns");
                if (((_c = this.schema) === null || _c === void 0 ? void 0 : _c.properties) && !this.schema.properties.hasOwnProperty(key)) {
                    const remove = document.createElement("div");
                    remove.classList.add("json-tool-btn");
                    remove.innerText = "X";
                    remove.onclick = () => {
                        const val = this.getValue();
                        delete val[key];
                        this.setCurrentTypeValue(val);
                        this.updateElement();
                    };
                    buttons.append(remove);
                }
                else if (!((_e = (_d = this.schema) === null || _d === void 0 ? void 0 : _d.required) === null || _e === void 0 ? void 0 : _e.includes(key))) {
                    const remove = document.createElement("div");
                    remove.classList.add("json-tool-btn");
                    remove.innerText = "∽";
                    remove.onclick = () => {
                        const val = this.getValue();
                        delete val[key];
                        this.setCurrentTypeValue(val);
                        this.updateElement();
                    };
                    buttons.append(remove);
                }
            }
            if ((_f = this.schema) === null || _f === void 0 ? void 0 : _f.properties) {
                for (const key in this.schema.properties) {
                    if (val === null || val === void 0 ? void 0 : val.hasOwnProperty(key))
                        continue;
                    if ((_h = (_g = this.schema) === null || _g === void 0 ? void 0 : _g.required) === null || _h === void 0 ? void 0 : _h.includes(key)) {
                        const obj = this.createObjectKeyValuePair(key, this.schema.properties[key]);
                        object.append(obj);
                    }
                    else {
                        const obj = this.createObjectKeyValuePair(key, this.schema.properties[key], undefined, true);
                        object.append(obj);
                        obj.style.textDecoration = "line-through 2px";
                        const buttons = document.createElement("div");
                        obj.prepend(buttons);
                        buttons.classList.add("json-tool-btns");
                        const add = document.createElement("div");
                        add.classList.add("json-tool-btn");
                        add.innerText = "≁";
                        add.onclick = () => {
                            var _a;
                            if ((_a = this.schema) === null || _a === void 0 ? void 0 : _a.properties) {
                                const val = this.getValue();
                                val[key] = JsonElement.getDefaultValue(this.schema.properties[key]).value;
                                this.setCurrentTypeValue(val);
                                this.updateElement();
                            }
                        };
                        buttons.append(add);
                    }
                }
            }
        }
        else if (type === "array") {
            this.element.append(this.createLineNumber(true));
            this.element.style.display = "block";
            this.element.classList.add("json-tool-object");
            this.element.append("[");
            const array = this.createBlock();
            this.element.append(array);
            const add = document.createElement("div");
            add.classList.add("json-tool-btn");
            add.innerText = "+";
            this.element.append(add);
            add.onclick = () => {
                var _a;
                const val = [...this.getValue()];
                console.log(JSON.stringify(val));
                if ((_a = this.schema) === null || _a === void 0 ? void 0 : _a.items) {
                    const defaultValue = JsonElement.getDefaultValue(this.schema.items).value;
                    val.push(defaultValue);
                    this.currentType = type;
                    this.setCurrentTypeValue(val);
                    this.updateElement();
                }
            };
            this.element.append("]");
            this.element.append(this.createLineNumber());
            const arr = val !== null && val !== void 0 ? val : [];
            for (let i = 0; i < arr.length; i++) {
                const idx = i;
                const obj = this.createObjectKeyValuePair(i, ((_j = this.schema) === null || _j === void 0 ? void 0 : _j.items) ? this.schema.items : null, val[i]);
                array.append(obj);
                const buttons = document.createElement("div");
                obj.prepend(buttons);
                buttons.classList.add("json-tool-btns");
                const remove = document.createElement("div");
                remove.classList.add("json-tool-btn");
                remove.innerText = "X";
                remove.onclick = () => {
                    const arr = [...this.getValue()];
                    arr.splice(idx, 1);
                    this.setCurrentTypeValue(arr);
                    this.updateElement();
                };
                buttons.append(remove);
                const up = document.createElement("div");
                up.classList.add("json-tool-btn");
                up.innerText = "ᐃ";
                up.onclick = () => {
                    let arr = [...this.getValue()];
                    const element = arr.splice(idx, 1);
                    arr = arr.slice(0, idx - 1).concat(element).concat(arr.slice(idx - 1));
                    this.setCurrentTypeValue(arr);
                    this.updateElement();
                };
                buttons.append(up);
                const down = document.createElement("div");
                down.classList.add("json-tool-btn");
                down.innerText = "ᐁ";
                down.onclick = () => {
                    let arr = [...this.getValue()];
                    const element = arr.splice(idx, 1);
                    arr = arr.slice(0, idx + 1).concat(element).concat(arr.slice(idx + 1));
                    this.setCurrentTypeValue(arr);
                    this.updateElement();
                };
                buttons.append(down);
            }
        }
        else if (type === "boolean") {
            const checkbox = document.createElement("input");
            checkbox.type = "checkbox";
            checkbox.checked = val;
            checkbox.onchange = () => {
                this.setCurrentTypeValue(checkbox.checked);
            };
            this.element.append(checkbox);
        }
        else if (type === "string") {
            if ((_k = this.schema) === null || _k === void 0 ? void 0 : _k.enum) {
                const select = document.createElement("select");
                for (const value of [...new Set(this.schema.enum.concat(val))]) {
                    const option = document.createElement("option");
                    option.innerText = value;
                    option.value = value;
                    select.append(option);
                }
                select.value = val;
                select.onchange = () => {
                    this.setCurrentTypeValue(select.value);
                };
                this.element.append(select);
            }
            else if (((_l = this.schema) === null || _l === void 0 ? void 0 : _l.format) === "textarea") {
                const input = document.createElement("textarea");
                input.value = val;
                input.minLength = (_o = (_m = this.schema) === null || _m === void 0 ? void 0 : _m.minLength) !== null && _o !== void 0 ? _o : 0;
                input.maxLength = (_q = (_p = this.schema) === null || _p === void 0 ? void 0 : _p.maxLength) !== null && _q !== void 0 ? _q : 99999999999999;
                input.onchange = () => {
                    this.setCurrentTypeValue(input.value);
                };
                this.element.append(input);
            }
            else if (((_r = this.schema) === null || _r === void 0 ? void 0 : _r.format) === "date") {
                const input = document.createElement("input");
                input.type = "date";
                input.onchange = () => {
                    var _a, _b;
                    this.setCurrentTypeValue((_b = (_a = input.valueAsDate) === null || _a === void 0 ? void 0 : _a.toDateString()) !== null && _b !== void 0 ? _b : "");
                };
                this.element.append(input);
                input.valueAsDate = new Date(val);
            }
            else {
                const input = document.createElement("input");
                input.type = "text";
                if (((_s = this.schema) === null || _s === void 0 ? void 0 : _s.format) && ["password", "email", "color", "url"].includes(this.schema.format))
                    input.type = this.schema.format;
                input.value = val;
                input.minLength = (_u = (_t = this.schema) === null || _t === void 0 ? void 0 : _t.minLength) !== null && _u !== void 0 ? _u : 0;
                input.maxLength = (_w = (_v = this.schema) === null || _v === void 0 ? void 0 : _v.maxLength) !== null && _w !== void 0 ? _w : 99999999999999;
                input.onchange = () => {
                    this.setCurrentTypeValue(input.value);
                };
                this.element.append(input);
            }
        }
        else if (type === "null") {
            this.element.append("null");
        }
        else if (type === "number") {
            const input = document.createElement("input");
            input.type = "number";
            input.value = val;
            input.min = (_z = (_y = (_x = this.schema) === null || _x === void 0 ? void 0 : _x.minimum) === null || _y === void 0 ? void 0 : _y.toString()) !== null && _z !== void 0 ? _z : "";
            input.max = (_2 = (_1 = (_0 = this.schema) === null || _0 === void 0 ? void 0 : _0.maximum) === null || _1 === void 0 ? void 0 : _1.toString()) !== null && _2 !== void 0 ? _2 : "";
            if (JsonElement.isInteger(this.schema))
                input.step = "1";
            input.onchange = () => {
                this.setCurrentTypeValue(input.value);
            };
            this.element.append(input);
        }
        else {
            this.element.append(`[${type}] : ${val}`);
        }
        if (this.onUpdate)
            this.onUpdate();
    }
    createLineNumber(overrideMargin = false) {
        const lineNumber = document.createElement("div");
        lineNumber.classList.add("line-number");
        if (overrideMargin)
            lineNumber.style.marginTop = "0";
        return lineNumber;
    }
    createBlock() {
        const block = document.createElement("div");
        block.classList.add("json-tool-block");
        block.style.paddingLeft = "25px";
        block.style.borderLeft = "1px dashed black";
        block.style.marginLeft = "3px";
        let opened = false;
        const collapse = document.createElement("div");
        block.append(collapse);
        collapse.classList.add("json-tool-btn");
        const toggle = () => {
            opened = !opened;
            collapse.innerText = opened ? "ᐯ" : "ᐳ";
            block.classList.remove("opened", "closed");
            block.classList.add(opened ? "opened" : "closed");
        };
        collapse.onclick = toggle;
        toggle();
        return block;
    }
    createObjectKeyValuePair(key, schema, value, noValue = false) {
        var _a;
        const parent = document.createElement("div");
        const originalKey = key;
        if (typeof key === "number") {
            key = (schema === null || schema === void 0 ? void 0 : schema.title) ? `${schema.title} ${key}` : key;
        }
        else {
            key = (_a = schema === null || schema === void 0 ? void 0 : schema.title) !== null && _a !== void 0 ? _a : key;
        }
        const title = document.createElement("span");
        title.innerText = key.toString();
        JsonElement.addDescription(title, schema === null || schema === void 0 ? void 0 : schema.description);
        parent.append(title);
        parent.classList.add("json-tool-key");
        parent.append(": ");
        if (!noValue) {
            const valueElement = document.createElement("div");
            const element = new JsonElement(valueElement, schema, value, () => this.onUpdate && this.onUpdate());
            if (this.currentType === "array")
                this.arrayElements.push(element);
            else if (this.currentType === "object")
                this.objectElements[originalKey] = element;
            parent.append(valueElement);
        }
        return parent;
    }
    changeType(type) {
        var _a;
        this.currentType = type;
        if (!this.currentValues.hasOwnProperty(type)) {
            if (typeof ((_a = this.schema) === null || _a === void 0 ? void 0 : _a.default) !== "undefined" && JsonElement.getType(this.schema.default) === type)
                this.setCurrentTypeValue(this.schema.default);
            else
                this.setCurrentTypeValue(JsonElement.getDefaultValueForType(this.schema, type));
        }
        this.updateElement();
    }
    setStyle() {
        this.element.style.whiteSpace = "pre";
        this.element.classList.add("json-tool-value");
    }
    getValue() {
        var _a;
        let val;
        if (this.currentType === "array") {
            val = this.arrayElements.map(e => e.getValue());
        }
        else if (this.currentType === "object") {
            const obj = {};
            for (const key in this.objectElements) {
                obj[key] = this.objectElements[key].getValue();
            }
            val = obj;
        }
        else {
            val = (_a = this.currentValues[this.currentType]) !== null && _a !== void 0 ? _a : JsonElement.getDefaultValueForType(this.schema, this.currentType);
        }
        this.currentValues[this.currentType] = val;
        return val;
    }
}
exports.JsonElement = JsonElement;


/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry need to be wrapped in an IIFE because it need to be isolated against other modules in the chunk.
(() => {
var exports = __webpack_exports__;
/*!***********************!*\
  !*** ./dist/index.js ***!
  \***********************/

Object.defineProperty(exports, "__esModule", ({ value: true }));
const JsonTool_1 = __webpack_require__(/*! ./JsonTool */ "./dist/JsonTool.js");
window.JsonTool = JsonTool_1.JsonTool;
/*
const person = tsch.object({
    name: tsch.string().description("First and Last Name").minLength(4).maxLength(6).default("Jeremy Dorn").nullable(),
    age: tsch.number().integer().default(25).min(18).max(99).optional().title("Age").union(tsch.string()),
    favorite_color: tsch.string().color().title("favorite color").default("#ffa500"),
    gender: tsch.string().enumeration(["male", "female", "other"]),
    date: tsch.string().date(),
    alive: tsch.boolean().default(true).nullable().title("Alive").description("If checked, this person is still alive"),
    description: tsch.string().textarea(),
    password: tsch.string().password(),
    website: tsch.string().url(),
    email: tsch.string().email(),
    location: tsch.object({
        city: tsch.string().default("San Francisco"),
        state: tsch.string().default("CA")
    }).title("Location"),
    pets: tsch.array(tsch.object({
        type: tsch.string().enumeration(["cat", "dog", "bird", "reptile", "other"]).default("dog"),
        name: tsch.string()
    }).title("Pet")).unique().table().default([{ type: "dog", name: "Walter" }])
}).title("Person");
type Person = tsch.Infer<typeof person>;
const personJsonSchema = person.getJsonSchemaProperty();

const rootElement = document.querySelector("#root");
if (rootElement)
{
    const tool = new JsonTool(rootElement);
    tool.load(personJsonSchema, { test: 123 });
    (window as any).getValue = () => tool.getValue();
}*/ 

})();

/******/ })()
;
//# sourceMappingURL=main.js.map