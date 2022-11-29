/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./js/JsonTool.js":
/*!************************!*\
  !*** ./js/JsonTool.js ***!
  \************************/
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.JsonTool = void 0;
class JsonTool {
    constructor(element, validator = null) {
        var _a, _b;
        this.validator = validator !== null && validator !== void 0 ? validator : (() => { return { valid: true }; });
        this.schema = null;
        this.root = document.createElement("div");
        this.root.style.fontFamily = "monospace";
        this.root.style.marginLeft = "30px";
        this.root.classList.add("json-tool");
        this.rootObject = null;
        this.rootElement = null;
        this.errorMessages = document.createElement("div");
        this.errorMessages.classList.add("json-tool-errors");
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
            this.iframeBody.appendChild(this.errorMessages);
        };
    }
    load(schema, value, validator) {
        this.validator = validator !== null && validator !== void 0 ? validator : this.validator;
        this.schema = schema;
        this.root.innerHTML = "";
        if (schema.title) {
            const title = document.createElement("h3");
            title.textContent = schema.title;
            JsonElement.addDescription(title, schema.description, schema === null || schema === void 0 ? void 0 : schema.examples);
            this.root.appendChild(title);
        }
        this.rootObject = document.createElement("div");
        this.root.appendChild(this.rootObject);
        this.rootElement = new JsonElement(this.rootObject, schema, value, () => this.onUpdate(), () => this.validate());
        this.validate();
    }
    setValidator(validator) {
        this.validator = validator;
    }
    getValue() {
        var _a;
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
        this.validate();
    }
    validate() {
        var _a;
        if (this.schema && this.errorMessages) {
            const valid = this.validator(this.getValue(), this.schema);
            this.errorMessages.innerHTML = "";
            if (!valid.valid) {
                this.errorMessages.innerHTML = ((_a = valid.errors) !== null && _a !== void 0 ? _a : []).map(e => typeof e === "string" ? e : e.message).join("\n");
            }
        }
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

                .json-tool-errors {
                    color: red;
                    white-space: pre;
                    font-family: monospace;
                    line-height: 2em;
                    font-weight: bold;
                    font-size: 1.2em;
                }
`;
    }
}
exports.JsonTool = JsonTool;
class JsonElement {
    constructor(element, schema, value, onUpdate, validate) {
        this.arrayElements = [];
        this.objectElements = {};
        this.element = element;
        this.setStyle();
        this.schema = schema;
        this.onUpdate = onUpdate;
        this.validate = validate;
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
        if (this.validate)
            this.validate();
    }
    static addDescription(element, description, examples) {
        if (examples) {
            description = `${description ? `${description}\n` : ""}Examples:\n${examples.map(e => JSON.stringify(e)).join(",\n")}`;
        }
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
        if (typeof schema.default !== "undefined") {
            return { type: this.getType(schema.default), value: schema.default };
        }
        else if (schema.examples && schema.examples.length > 0) {
            return { type: this.getType(schema.examples[0]), value: schema.examples[0] };
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
                this.changeType(select.value);
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
            input.value = val.toString();
            input.min = (_z = (_y = (_x = this.schema) === null || _x === void 0 ? void 0 : _x.minimum) === null || _y === void 0 ? void 0 : _y.toString()) !== null && _z !== void 0 ? _z : "";
            input.max = (_2 = (_1 = (_0 = this.schema) === null || _0 === void 0 ? void 0 : _0.maximum) === null || _1 === void 0 ? void 0 : _1.toString()) !== null && _2 !== void 0 ? _2 : "";
            if (JsonElement.isInteger(this.schema))
                input.step = "1";
            input.onchange = () => {
                this.setCurrentTypeValue(parseFloat(input.value));
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
        JsonElement.addDescription(title, schema === null || schema === void 0 ? void 0 : schema.description, schema === null || schema === void 0 ? void 0 : schema.examples);
        parent.append(title);
        parent.classList.add("json-tool-key");
        parent.append(": ");
        if (!noValue) {
            const valueElement = document.createElement("div");
            const element = new JsonElement(valueElement, schema, value, () => this.onUpdate && this.onUpdate(), () => this.validate && this.validate());
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
//# sourceMappingURL=JsonTool.js.map

/***/ }),

/***/ "./node_modules/tsch/dist/TschType.js":
/*!********************************************!*\
  !*** ./node_modules/tsch/dist/TschType.js ***!
  \********************************************/
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.TschArray = exports.TschObject = exports.TschUnion = exports.TschUndefined = exports.TschNull = exports.TschBoolean = exports.TschNumber = exports.TschString = exports.TschType = void 0;
class TschValidationError {
    constructor(path, message) {
        this.path = path;
        this.pathString = TschValidationError.formatPath(path);
        this.rawMessage = message;
        this.message = `${this.pathString}: ${message}`;
    }
    static formatPath(path) {
        if (path.length < 1)
            return "root";
        return path.join(".");
    }
}
class TschType {
    constructor(type) {
        this._ts = null; //_ts is only used by Typescript for type inference, and so actually doesn't need to be assigned
        this._type = type;
        this._title = null;
        this._description = null;
        this._default = null;
        this._examples = null;
    }
    union(other) {
        return new TschUnion(this, other);
    }
    optional() {
        return new TschUnion(this, new TschUndefined());
    }
    nullable() {
        return new TschUnion(this, new TschNull());
    }
    clone() {
        const clone = this.newInstance();
        clone._title = this._title;
        clone._description = this._description;
        clone._default = this._default;
        clone._examples = this._examples ? [...this._examples] : null;
        return clone;
    }
    title(title) {
        const clone = this.clone();
        clone._title = title;
        return clone;
    }
    description(descriptin) {
        const clone = this.clone();
        clone._description = descriptin;
        return clone;
    }
    default(defaultValue) {
        const clone = this.clone();
        clone._default = defaultValue;
        return clone;
    }
    examples(examples) {
        const clone = this.clone();
        clone._examples = [...examples];
        return clone;
    }
    getJsonSchemaProperty() {
        const schema = {
            "type": this._type
        };
        if (this._title)
            schema.title = this._title;
        if (this._description)
            schema.description = this._description;
        if (this._default)
            schema.default = this._default;
        if (this._examples)
            schema.examples = this._examples;
        return schema;
    }
    validate(input) {
        const errors = [];
        this.validateInternal([], input, errors);
        return { valid: errors.length == 0, errors };
    }
    validateInternal(path, input, errors) {
        if (!this.isCorrectType(input)) {
            errors.push(new TschValidationError(path, `Value has to be of type ${this.getTypeName()}`));
            return;
        }
        this.validateCorrectType(path, input, errors);
    }
    isOptional() { return false; }
    isNullable() { return false; }
}
exports.TschType = TschType;
class TschString extends TschType {
    constructor() {
        super("string");
        this._format = null;
        this._enum = null;
        this._minLength = null;
        this._maxLength = null;
    }
    newInstance() {
        return new TschString();
    }
    clone() {
        const clone = super.clone();
        clone._format = this._format;
        clone._enum = this._enum;
        clone._minLength = this._minLength;
        clone._maxLength = this._maxLength;
        return clone;
    }
    getJsonSchemaProperty() {
        const schema = super.getJsonSchemaProperty();
        if (this._format)
            schema.format = this._format;
        if (this._enum)
            schema.enum = this._enum;
        if (this._minLength)
            schema.minLength = this._minLength;
        if (this._maxLength)
            schema.maxLength = this._maxLength;
        return schema;
    }
    minLength(min) {
        const clone = this.clone();
        clone._minLength = min;
        return clone;
    }
    maxLength(max) {
        const clone = this.clone();
        clone._maxLength = max;
        return clone;
    }
    enumeration(enumeration) {
        const clone = this.clone();
        clone._enum = [...enumeration];
        return clone;
    }
    format(format) {
        const clone = this.clone();
        clone._format = format;
        return clone;
    }
    color() {
        return this.format("color");
    }
    date() {
        return this.format("date");
    }
    email() {
        return this.format("email");
    }
    password() {
        return this.format("password");
    }
    textarea() {
        return this.format("textarea");
    }
    url() {
        return this.format("url");
    }
    isCorrectType(input) {
        return typeof input === "string";
    }
    getTypeName() { return "string"; }
    validateCorrectType(path, input, errors) {
        if (!!this._enum && !this._enum.includes(input)) {
            errors.push(new TschValidationError(path, `Value has to be one of the following: ${this._enum.join(", ")}`));
        }
        if (typeof this._minLength === "number" && input.length < this._minLength) {
            errors.push(new TschValidationError(path, `Value must be longer than ${this._minLength} characters.`));
        }
        if (typeof this._maxLength === "number" && input.length > this._maxLength) {
            errors.push(new TschValidationError(path, `Value must be shorter than ${this._maxLength} characters.`));
        }
        if (this._format === "color" && !/^#?[0-9a-f]{3,6}$/i.test(input)) {
            errors.push(new TschValidationError(path, `Value must be a color hex code.`));
        }
        if (this._format === "date" && Number.isNaN(Date.parse(input))) {
            errors.push(new TschValidationError(path, `Value must be a date.`));
        }
        if (this._format === "email" && !/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(input)) {
            errors.push(new TschValidationError(path, `Value must be an email.`));
        }
        if (this._format === "url" && !/^https?:\/\/(?:www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b(?:[-a-zA-Z0-9()@:%_\+.~#?&\/=]*)$/.test(input)) {
            errors.push(new TschValidationError(path, `Value must be an email.`));
        }
    }
}
exports.TschString = TschString;
class TschNumber extends TschType {
    constructor() {
        super("number");
        this._integer = false;
        this._min = null;
        this._max = null;
    }
    newInstance() {
        return new TschNumber();
    }
    clone() {
        const clone = super.clone();
        clone._integer = this._integer;
        clone._min = this._min;
        clone._max = this._max;
        return clone;
    }
    integer() {
        const clone = this.clone();
        clone._integer = true;
        return clone;
    }
    min(min) {
        const clone = this.clone();
        clone._min = min;
        return clone;
    }
    max(max) {
        const clone = this.clone();
        clone._max = max;
        return clone;
    }
    getJsonSchemaProperty() {
        const schema = super.getJsonSchemaProperty();
        if (this._integer)
            schema.type = "integer";
        if (this._min !== null)
            schema.minimum = this._min;
        if (this._max !== null)
            schema.maximum = this._max;
        return schema;
    }
    isCorrectType(input) {
        return typeof input === "number";
    }
    getTypeName() { return "number"; }
    validateCorrectType(path, input, errors) {
        if (this._integer && !Number.isInteger(input)) {
            errors.push(new TschValidationError(path, `Value has to be an integer.`));
        }
        if (typeof this._min === "number" && input < this._min) {
            errors.push(new TschValidationError(path, `Value must be at least ${this._min}.`));
        }
        if (typeof this._max === "number" && input > this._max) {
            errors.push(new TschValidationError(path, `Value must be at less than ${this._max}.`));
        }
    }
}
exports.TschNumber = TschNumber;
class TschBoolean extends TschType {
    constructor() {
        super("boolean");
    }
    newInstance() {
        return new TschBoolean();
    }
    clone() {
        const clone = super.clone();
        return clone;
    }
    isCorrectType(input) {
        return typeof input === "boolean";
    }
    getTypeName() { return "boolean"; }
    validateCorrectType(path, input, errors) {
    }
}
exports.TschBoolean = TschBoolean;
class TschNull extends TschType {
    constructor() {
        super("null");
    }
    newInstance() {
        return new TschNull();
    }
    clone() {
        const clone = super.clone();
        return clone;
    }
    isCorrectType(input) {
        return input === null;
    }
    getTypeName() { return "null"; }
    validateCorrectType(path, input, errors) {
    }
}
exports.TschNull = TschNull;
class TschUndefined extends TschType {
    constructor() {
        super("undefined");
    }
    newInstance() {
        return new TschUndefined();
    }
    clone() {
        const clone = super.clone();
        return clone;
    }
    isCorrectType(input) {
        return typeof input === "undefined";
    }
    getTypeName() { return "undefined"; }
    validateCorrectType(path, input, errors) {
    }
}
exports.TschUndefined = TschUndefined;
class TschUnion extends TschType {
    constructor(type1, type2) {
        super(`union_${type1._type}_${type2._type}`);
        this.type1 = type1;
        this.type2 = type2;
    }
    Type1Internal() { return this.type1; }
    Type2Internal() { return this.type2; }
    newInstance() {
        return new TschUnion(this.type1.clone(), this.type2.clone());
    }
    clone() {
        const clone = super.clone();
        clone.type1 = this.Type1Internal().clone();
        clone.type2 = this.Type2Internal().clone();
        return clone;
    }
    getJsonSchemaProperty() {
        var _a, _b, _c, _d;
        const schema1 = this.Type1Internal()._type === "undefined" ? {} : this.type1.getJsonSchemaProperty();
        const schema2 = this.Type2Internal()._type === "undefined" ? {} : this.type2.getJsonSchemaProperty();
        const combined = Object.assign(Object.assign({}, schema1), schema2);
        combined.type = [...(Array.isArray(schema1.type) ? schema1.type : [schema1.type]), ...(Array.isArray(schema2.type) ? schema2.type : [schema2.type])].filter(t => !!t && t !== "undefined");
        if (combined.type.length < 2)
            combined.type = combined.type[0];
        if (schema1.properties && schema2.properties) {
            combined.properties = Object.assign(Object.assign({}, ((_a = schema1.properties) !== null && _a !== void 0 ? _a : {})), ((_b = schema2.properties) !== null && _b !== void 0 ? _b : {}));
            if (!!schema1.required && !!schema2.required)
                combined.required = schema1.required.filter((f) => { var _a; return (_a = schema2.required) === null || _a === void 0 ? void 0 : _a.includes(f); });
            else
                combined.required = (_d = (_c = schema1.required) !== null && _c !== void 0 ? _c : schema2.required) !== null && _d !== void 0 ? _d : [];
        }
        if (this._title)
            combined.title = this._title;
        if (this._description)
            combined.description = this._description;
        if (this._default)
            combined.default = this._default;
        return combined;
    }
    isNullable() {
        return this.Type1Internal()._type === "null" || this.Type2Internal()._type === "null" || this.Type1Internal().isNullable() || this.Type2Internal().isNullable();
    }
    isOptional() {
        return this.Type1Internal()._type === "undefined" || this.Type2Internal()._type === "undefined" || this.Type1Internal().isOptional() || this.Type2Internal().isOptional();
    }
    isCorrectType(input) {
        return this.Type1Internal().isCorrectType(input) || this.Type2Internal().isCorrectType(input);
    }
    getTypeName() { return `${this.type1.getTypeName()} or ${this.type2.getTypeName()}`; }
    validateCorrectType(path, input, errors) {
        if (this.Type1Internal().isCorrectType(input)) {
            this.Type1Internal().validateInternal(path, input, errors);
        }
        if (this.Type2Internal().isCorrectType(input)) {
            this.Type2Internal().validateInternal(path, input, errors);
        }
    }
}
exports.TschUnion = TschUnion;
class TschObject extends TschType {
    constructor(shape) {
        super("object");
        this.shape = shape;
    }
    newInstance() {
        return new TschObject(this.shape);
    }
    clone() {
        const clone = super.clone();
        clone.shape = this.shape;
        return clone;
    }
    getJsonSchemaProperty() {
        const schema = super.getJsonSchemaProperty();
        schema.required = Object.keys(this.shape).filter(k => !this.shape[k].isOptional());
        schema.properties = {};
        for (const key in this.shape) {
            schema.properties[key] = this.shape[key].getJsonSchemaProperty();
        }
        return schema;
    }
    isCorrectType(input) {
        return typeof input === "object" && input !== null && !Array.isArray(input);
    }
    getTypeName() {
        return "object";
    }
    validateCorrectType(path, input, errors) {
        for (const key in this.shape) {
            const child = this.shape[key];
            const childInternal = child;
            if (!childInternal.isOptional() && !input.hasOwnProperty(key)) {
                errors.push(new TschValidationError(path, `Property ${key} of type ${childInternal.getTypeName()} is required.`));
            }
            if (input.hasOwnProperty(key)) {
                childInternal.validateInternal([...path, key], input[key], errors);
            }
        }
    }
}
exports.TschObject = TschObject;
class TschArray extends TschType {
    constructor(elementType) {
        super("array");
        this.elementType = elementType;
        this._format = null;
        this._minElementCount = null;
        this._maxElementCount = null;
        this._unique = false;
    }
    newInstance() {
        return new TschArray(this.elementType);
    }
    clone() {
        const clone = super.clone();
        clone.elementType = this.elementType;
        clone._format = this._format;
        clone._unique = this._unique;
        clone._minElementCount = this._minElementCount;
        clone._maxElementCount = this._maxElementCount;
        return clone;
    }
    getJsonSchemaProperty() {
        const schema = super.getJsonSchemaProperty();
        schema.items = this.elementType.getJsonSchemaProperty();
        if (this._format)
            schema.format = this._format;
        if (this._unique)
            schema.uniqueItems = this._unique;
        return schema;
    }
    table() {
        const clone = this.clone();
        clone._format = "table";
        return clone;
    }
    minElements(count) {
        const clone = this.clone();
        clone._minElementCount = count;
        return clone;
    }
    maxElements(count) {
        const clone = this.clone();
        clone._maxElementCount = count;
        return clone;
    }
    unique() {
        const clone = this.clone();
        clone._unique = true;
        return clone;
    }
    isCorrectType(input) {
        return typeof input === "object" && input !== null && Array.isArray(input);
    }
    getTypeName() {
        return `array of ${this.elementType.getTypeName()}`;
    }
    validateCorrectType(path, input, errors) {
        const elementTypeInternal = this.elementType;
        const used = new Set();
        if (typeof this._minElementCount === "number" && input.length < this._minElementCount) {
            errors.push(new TschValidationError(path, `Array must contain at least ${this._minElementCount} elements.`));
        }
        if (typeof this._maxElementCount === "number" && input.length > this._maxElementCount) {
            errors.push(new TschValidationError(path, `Array must contain at most ${this._maxElementCount} elements.`));
        }
        for (let i = 0; i < input.length; i++) {
            const element = input[i];
            elementTypeInternal.validateInternal([...path, i.toString()], element, errors);
            if (this._unique) {
                const json = JSON.stringify(element);
                if (used.has(json)) {
                    errors.push(new TschValidationError(path, "All values have to be unique."));
                }
                used.add(json);
            }
        }
    }
}
exports.TschArray = TschArray;
//# sourceMappingURL=TschType.js.map

/***/ }),

/***/ "./node_modules/tsch/dist/index.js":
/*!*****************************************!*\
  !*** ./node_modules/tsch/dist/index.js ***!
  \*****************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.tsch = void 0;
const tsch = __importStar(__webpack_require__(/*! ./tsch */ "./node_modules/tsch/dist/tsch.js"));
exports.tsch = tsch;
//# sourceMappingURL=index.js.map

/***/ }),

/***/ "./node_modules/tsch/dist/tsch.js":
/*!****************************************!*\
  !*** ./node_modules/tsch/dist/tsch.js ***!
  \****************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.array = exports.object = exports.boolean = exports.number = exports.string = void 0;
const TschType_1 = __webpack_require__(/*! ./TschType */ "./node_modules/tsch/dist/TschType.js");
function string() { return new TschType_1.TschString(); }
exports.string = string;
function number() { return new TschType_1.TschNumber(); }
exports.number = number;
function boolean() { return new TschType_1.TschBoolean(); }
exports.boolean = boolean;
function object(shape) {
    return new TschType_1.TschObject(shape);
}
exports.object = object;
function array(elementType) {
    return new TschType_1.TschArray(elementType);
}
exports.array = array;
//# sourceMappingURL=tsch.js.map

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
/******/ 		__webpack_modules__[moduleId].call(module.exports, module, module.exports, __webpack_require__);
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
/*!*******************!*\
  !*** ./js/www.js ***!
  \*******************/

Object.defineProperty(exports, "__esModule", ({ value: true }));
const tsch_1 = __webpack_require__(/*! tsch */ "./node_modules/tsch/dist/index.js");
const JsonTool_1 = __webpack_require__(/*! ./JsonTool */ "./js/JsonTool.js");
const person = tsch_1.tsch.object({
    name: tsch_1.tsch.string().description("First and Last Name").minLength(4).maxLength(6).default("Jeremy Dorn").nullable(),
    age: tsch_1.tsch.number().integer().default(25).min(18).max(99).optional().title("Age").union(tsch_1.tsch.string()),
    favorite_color: tsch_1.tsch.string().color().title("favorite color").default("#ffa500").examples(["#ff0000", "#00ff00"]),
    gender: tsch_1.tsch.string().enumeration(["male", "female", "other"]),
    date: tsch_1.tsch.string().date(),
    alive: tsch_1.tsch.boolean().default(true).nullable().title("Alive").description("If checked, this person is still alive"),
    description: tsch_1.tsch.string().textarea(),
    password: tsch_1.tsch.string().password(),
    website: tsch_1.tsch.string().url(),
    email: tsch_1.tsch.string().email(),
    location: tsch_1.tsch.object({
        city: tsch_1.tsch.string().default("San Francisco"),
        state: tsch_1.tsch.string().default("CA")
    }).title("Location"),
    pets: tsch_1.tsch.array(tsch_1.tsch.object({
        type: tsch_1.tsch.string().enumeration(["cat", "dog", "bird", "reptile", "other"]).default("dog"),
        name: tsch_1.tsch.string()
    }).title("Pet")).unique().table().default([{ type: "dog", name: "Walter" }])
}).title("Person");
const personJsonSchema = person.getJsonSchemaProperty();
const rootElement = document.querySelector("#root");
if (rootElement) {
    const tool = new JsonTool_1.JsonTool(rootElement);
    tool.load(personJsonSchema, { test: 123 }, v => person.validate(v));
    window.getValue = () => tool.getValue();
}
//# sourceMappingURL=www.js.map
})();

/******/ })()
;
//# sourceMappingURL=main.js.map