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
        this.root = document.createElement("div");
        this.root.style.fontFamily = "monospace";
        element.appendChild(this.root);
        this.rootObject = null;
    }
    load(schema, value) {
        this.root.childNodes.forEach(c => c.remove());
        if (schema.title) {
            const title = document.createElement("h3");
            title.textContent = schema.title;
            JsonElement.addDescription(title, schema.description);
            this.root.appendChild(title);
        }
        this.rootObject = document.createElement("div");
        this.root.appendChild(this.rootObject);
        new JsonElement(this.rootObject, schema, value);
    }
}
exports.JsonTool = JsonTool;
class JsonElement {
    constructor(element, schema, value) {
        this.element = element;
        this.setStyle();
        this.schema = schema;
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
        if (type === "number") {
            return this.isInteger(schema) ? Math.ceil((_a = schema === null || schema === void 0 ? void 0 : schema.minimum) !== null && _a !== void 0 ? _a : 0) : (_b = schema === null || schema === void 0 ? void 0 : schema.minimum) !== null && _b !== void 0 ? _b : 0;
        }
        else if (type === "string") {
            if (schema === null || schema === void 0 ? void 0 : schema.enum)
                return schema.enum[0];
            if ((schema === null || schema === void 0 ? void 0 : schema.format) === "color")
                return "#000000";
            if ((schema === null || schema === void 0 ? void 0 : schema.format) === "date")
                return Date.now();
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
        }
    }
    updateElement() {
        var _a, _b, _c, _d;
        this.element.childNodes.forEach(c => c.remove());
        this.element.style.display = "inline-block";
        const type = this.currentType;
        const val = (_a = this.currentValues[type]) !== null && _a !== void 0 ? _a : JsonElement.getDefaultValueForType(this.schema, type);
        if (type === "object") {
            this.element.style.display = "block";
            this.element.append("{");
            const object = document.createElement("div");
            this.element.append(object);
            this.element.append("}");
            object.style.paddingLeft = "25px";
            object.style.borderLeft = "1px dashed black";
            object.style.marginLeft = "3px";
            for (const key in val !== null && val !== void 0 ? val : {}) {
                object.append(this.createObjectKeyValuePair(key, ((_b = this.schema) === null || _b === void 0 ? void 0 : _b.properties) ? this.schema.properties[key] : null, val[key]));
            }
            if ((_c = this.schema) === null || _c === void 0 ? void 0 : _c.properties) {
                for (const key in this.schema.properties) {
                    if (val === null || val === void 0 ? void 0 : val.hasOwnProperty(key))
                        continue;
                    object.append(this.createObjectKeyValuePair(key, this.schema.properties[key]));
                }
            }
        }
        else if (type === "array") {
            this.element.style.display = "block";
            this.element.append("[");
            const array = document.createElement("div");
            this.element.append(array);
            this.element.append("]");
            array.style.paddingLeft = "25px";
            array.style.borderLeft = "1px dashed black";
            array.style.marginLeft = "3px";
            const arr = val !== null && val !== void 0 ? val : [];
            for (let i = 0; i < arr.length; i++) {
                array.append(this.createObjectKeyValuePair(i, ((_d = this.schema) === null || _d === void 0 ? void 0 : _d.items) ? this.schema.items : null, val[i]));
            }
        }
        else {
            this.element.innerText = `[${type}]`;
        }
    }
    createObjectKeyValuePair(key, schema, value) {
        var _a;
        const parent = document.createElement("div");
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
        parent.append(": ");
        const valueElement = document.createElement("div");
        new JsonElement(valueElement, schema, value);
        parent.append(valueElement);
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
    }
}
exports.JsonElement = JsonElement;


/***/ }),

/***/ "./node_modules/tsch/dist/TschType.js":
/*!********************************************!*\
  !*** ./node_modules/tsch/dist/TschType.js ***!
  \********************************************/
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.TschArray = exports.TschObject = exports.TschUnion = exports.TschBoolean = exports.TschNumber = exports.TschString = exports.TschType = void 0;
class TschType {
    constructor(type) {
        this._ts = null; //_ts is only used by Typescript for type inference, and so actually doesn't need to be assigned
        this._type = type;
        this._title = null;
        this._description = null;
        this._default = null;
    }
    union(other) {
        return new TschUnion(this, other);
    }
    optional() {
        return new TschUnion(this, new TschType("undefined"));
    }
    nullable() {
        return new TschUnion(this, new TschType("null"));
    }
    _baseClone() {
        return new TschType(this._type);
    }
    _clone() {
        const clone = this._baseClone();
        clone._title = this._title;
        clone._description = this._description;
        clone._default = this._default;
        return clone;
    }
    title(title) {
        const clone = this._clone();
        clone._title = title;
        return clone;
    }
    description(descriptin) {
        const clone = this._clone();
        clone._description = descriptin;
        return clone;
    }
    default(defaultValue) {
        const clone = this._clone();
        clone._default = defaultValue;
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
        return schema;
    }
    _isOptional() { return false; }
    _isNullable() { return false; }
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
    _baseClone() {
        return new TschString();
    }
    _clone() {
        const clone = super._clone();
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
        const clone = this._clone();
        clone._minLength = min;
        return clone;
    }
    maxLength(max) {
        const clone = this._clone();
        clone._maxLength = max;
        return clone;
    }
    enumeration(enumeration) {
        const clone = this._clone();
        clone._enum = [...enumeration];
        return clone;
    }
    format(format) {
        const clone = this._clone();
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
}
exports.TschString = TschString;
class TschNumber extends TschType {
    constructor() {
        super("number");
        this._integer = false;
        this._min = null;
        this._max = null;
    }
    _baseClone() {
        return new TschNumber();
    }
    _clone() {
        const clone = super._clone();
        clone._integer = this._integer;
        clone._min = this._min;
        clone._max = this._max;
        return clone;
    }
    integer() {
        const clone = this._clone();
        clone._integer = true;
        return clone;
    }
    min(min) {
        const clone = this._clone();
        clone._min = min;
        return clone;
    }
    max(max) {
        const clone = this._clone();
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
}
exports.TschNumber = TschNumber;
class TschBoolean extends TschType {
    constructor() {
        super("boolean");
    }
    _baseClone() {
        return new TschBoolean();
    }
    _clone() {
        const clone = super._clone();
        return clone;
    }
}
exports.TschBoolean = TschBoolean;
class TschUnion extends TschType {
    constructor(type1, type2) {
        super(`union_${type1._type}_${type2._type}`);
        this.type1 = type1;
        this.type2 = type2;
    }
    _baseClone() {
        return new TschUnion(this.type1._clone(), this.type2._clone());
    }
    _clone() {
        const clone = super._clone();
        clone.type1 = this.type1._clone();
        clone.type2 = this.type2._clone();
        return clone;
    }
    getJsonSchemaProperty() {
        var _a, _b, _c, _d;
        const schema1 = this.type1._type === "undefined" ? {} : this.type1.getJsonSchemaProperty();
        const schema2 = this.type2._type === "undefined" ? {} : this.type2.getJsonSchemaProperty();
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
    _isNullable() {
        return this.type1._type === "null" || this.type2._type === "null" || this.type1._isNullable() || this.type2._isNullable();
    }
    _isOptional() {
        return this.type1._type === "undefined" || this.type2._type === "undefined" || this.type1._isOptional() || this.type2._isOptional();
    }
}
exports.TschUnion = TschUnion;
class TschObject extends TschType {
    constructor(shape) {
        super("object");
        this.shape = shape;
    }
    _baseClone() {
        return new TschObject(this.shape);
    }
    _clone() {
        const clone = super._clone();
        clone.shape = this.shape;
        return clone;
    }
    getJsonSchemaProperty() {
        const schema = super.getJsonSchemaProperty();
        schema.required = Object.keys(this.shape).filter(k => !this.shape[k]._isOptional());
        schema.properties = {};
        for (const key in this.shape) {
            schema.properties[key] = this.shape[key].getJsonSchemaProperty();
        }
        return schema;
    }
}
exports.TschObject = TschObject;
class TschArray extends TschType {
    constructor(elementType) {
        super("array");
        this.elementType = elementType;
        this._format = null;
        this._unique = false;
    }
    _baseClone() {
        return new TschArray(this.elementType);
    }
    _clone() {
        const clone = super._clone();
        clone.elementType = this.elementType;
        clone._format = this._format;
        clone._unique = this._unique;
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
        const clone = this._clone();
        clone._format = "table";
        return clone;
    }
    unique() {
        const clone = this._clone();
        clone._unique = true;
        return clone;
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
/*!***********************!*\
  !*** ./dist/index.js ***!
  \***********************/

Object.defineProperty(exports, "__esModule", ({ value: true }));
const tsch_1 = __webpack_require__(/*! tsch */ "./node_modules/tsch/dist/index.js");
const JsonTool_1 = __webpack_require__(/*! ./JsonTool */ "./dist/JsonTool.js");
window.JsonTool = JsonTool_1.JsonTool;
const person = tsch_1.tsch.object({
    name: tsch_1.tsch.string().description("First and Last Name").minLength(4).default("Jeremy Dorn"),
    age: tsch_1.tsch.number().integer().default(25).min(18).max(99).optional().title("Age"),
    favorite_color: tsch_1.tsch.string().color().title("favorite color").default("#ffa500"),
    gender: tsch_1.tsch.string().enumeration(["male", "female", "other"]),
    date: tsch_1.tsch.string().date(),
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
    tool.load(personJsonSchema);
}

})();

/******/ })()
;
//# sourceMappingURL=main.js.map