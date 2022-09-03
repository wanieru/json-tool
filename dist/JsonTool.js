"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
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
        var _a, _b, _c;
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
            object.style.paddingLeft = "10px";
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
        else {
            this.element.innerText = `[${type}]`;
        }
    }
    createObjectKeyValuePair(key, schema, value) {
        var _a;
        const parent = document.createElement("div");
        key = (_a = schema === null || schema === void 0 ? void 0 : schema.title) !== null && _a !== void 0 ? _a : key;
        const title = document.createElement("span");
        title.innerText = key;
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
