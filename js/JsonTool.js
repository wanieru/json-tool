"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.JsonTool = void 0;
class JsonTool {
    constructor(element, validator = null) {
        var _a, _b;
        this.elementState = {};
        this.undoStack = [];
        this.redoStack = [];
        this.undoing = false;
        this.loadState();
        this.containerElement = element;
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
        const controlButtons = document.createElement("div");
        this.undoButton = document.createElement("button");
        this.undoButton.innerText = "⤶ Undo";
        this.undoButton.onclick = () => this.undo();
        controlButtons.appendChild(this.undoButton);
        this.redoButton = document.createElement("button");
        this.redoButton.innerText = "⤷ Redo";
        this.redoButton.style.marginLeft = "5px";
        this.redoButton.onclick = () => this.redo();
        controlButtons.appendChild(this.redoButton);
        const collapseExpandAll = document.createElement("button");
        let collapse = true;
        collapseExpandAll.innerText = "Collapse all";
        collapseExpandAll.onclick = () => {
            var _a, _b;
            ((_b = (_a = this.rootObject) === null || _a === void 0 ? void 0 : _a.querySelectorAll(`.json-tool-block.${collapse ? "opened" : "closed"} .json-tool-btn.collapse`)) !== null && _b !== void 0 ? _b : []).forEach(e => e.click());
            collapse = !collapse;
            collapseExpandAll.innerText = collapse ? "Collapse all" : "Expand all";
        };
        collapseExpandAll.style.marginLeft = "5px";
        controlButtons.appendChild(collapseExpandAll);
        const iframe = document.createElement("iframe");
        iframe.style.width = "100%";
        iframe.style.height = "100%";
        iframe.style.overflow = "scroll";
        iframe.style.border = "0";
        element.innerHTML = "";
        element.appendChild(iframe);
        this.iframeBody = (_b = (iframe.contentDocument || ((_a = iframe.contentWindow) === null || _a === void 0 ? void 0 : _a.document))) === null || _b === void 0 ? void 0 : _b.querySelector("body");
        this.iframeBody.append(this.root);
        this.createCss(this.iframeBody);
        iframe.onload = () => {
            var _a, _b;
            this.iframeBody = (_b = (iframe.contentDocument || ((_a = iframe.contentWindow) === null || _a === void 0 ? void 0 : _a.document))) === null || _b === void 0 ? void 0 : _b.querySelector("body");
            this.iframeBody.append(controlButtons);
            this.iframeBody.append(this.root);
            this.createCss(this.iframeBody);
            this.iframeBody.appendChild(this.errorMessages);
        };
    }
    deleteChild(key) {
    }
    getState() {
        return this.elementState;
    }
    saveState() {
        if (!(window === null || window === void 0 ? void 0 : window.localStorage))
            return;
        window.localStorage.setItem(`saved_json_tool_state`, JSON.stringify(this.elementState));
    }
    loadState() {
        var _a;
        if (!(window === null || window === void 0 ? void 0 : window.localStorage))
            return;
        this.elementState = JSON.parse((_a = window.localStorage.getItem(`saved_json_tool_state`)) !== null && _a !== void 0 ? _a : "{}");
    }
    load(schema, value, validator) {
        return __awaiter(this, void 0, void 0, function* () {
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
            this.rootElement = new JsonElement("", "root", this.rootObject, this.schema, value, this);
            yield this.validate();
        });
    }
    hide() {
        this.containerElement.innerHTML = "";
    }
    setValidator(validator) {
        this.validator = validator;
    }
    getValue() {
        var _a;
        return (_a = this.rootElement) === null || _a === void 0 ? void 0 : _a.getValue();
    }
    update() {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            if (!this.rootObject)
                return;
            let number = 1;
            (_a = this.rootObject) === null || _a === void 0 ? void 0 : _a.querySelectorAll(".line-number").forEach(e => {
                e.innerText = number.toString();
                number++;
            });
            yield this.validate();
        });
    }
    validate() {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            yield new Promise(resolve => window.setTimeout(resolve, 1));
            if (!this.schema || !this.errorMessages)
                return;
            const valid = this.validator(this.getValue(), this.schema);
            this.errorMessages.innerHTML = "";
            if (!valid.valid) {
                this.errorMessages.innerHTML = ((_a = valid.errors) !== null && _a !== void 0 ? _a : []).map(e => typeof e === "string" ? e : e.message).join("\n");
            }
            yield this.pushUndoState();
        });
    }
    pushUndoState() {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.undoing)
                return;
            this.undoing = true;
            yield new Promise(resolve => window.setTimeout(resolve, 1));
            const value = this.getValue();
            if (this.undoStack.length > 0 && JSON.stringify(value) === JSON.stringify(this.undoStack[0])) {
                this.undoing = false;
                return;
            }
            this.undoStack.unshift(value);
            this.redoStack = [];
            this.undoing = false;
            this.updateUndoRedoButtons();
        });
    }
    undo() {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.undoStack.length < 2 || this.undoing || !this.schema)
                return;
            this.undoing = true;
            this.redoStack.unshift(this.getValue());
            this.undoStack.splice(0, 1);
            const value = this.undoStack[0];
            yield this.load(this.schema, value, this.validator);
            this.undoing = false;
            this.updateUndoRedoButtons();
        });
    }
    redo() {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.redoStack.length < 1 || this.undoing || !this.schema)
                return;
            this.undoing = true;
            const value = this.redoStack.splice(0, 1)[0];
            this.undoStack.unshift(value);
            yield this.load(this.schema, value, this.validator);
            this.undoing = false;
            this.updateUndoRedoButtons();
        });
    }
    updateUndoRedoButtons() {
        this.undoButton.disabled = this.undoStack.length < 2;
        this.redoButton.disabled = this.redoStack.length < 1;
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
                margin-left: -36px;
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
              .json-tool-types > .json-tool-type
              {
                padding:0;
                margin:0;
                border:0;
              }
              .json-tool-value > .json-tool-types
              {
                float:right;
                opacity: 0;
              }
              .json-tool-value.json-tool-object > .json-tool-types
              {
                float:none;
                position: absolute;
                margin-left: 15px;
              }
              .json-tool-value:hover > .json-tool-types
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
    constructor(key, path, element, schema, value, parent) {
        this.arrayElements = [];
        this.objectElements = {};
        this.element = element;
        this.setStyle();
        this.schema = schema;
        this.parent = parent;
        this.key = key;
        this.path = path;
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
    update() {
        this.parent.update();
    }
    validate() {
        this.parent.validate();
    }
    getPath(element) {
        for (let i = 0; i < this.arrayElements.length; i++) {
            if (this.arrayElements[i] === element)
                return `${this.path}.${i}`;
        }
        for (const key in this.objectElements) {
            if (this.objectElements[key] === element)
                return `${this.path}.${key}`;
        }
        return `${this.path}.?`;
    }
    getState() {
        return this.parent.getState();
    }
    saveState() {
        this.parent.saveState();
    }
    deleteChild(key) {
        if (typeof key === "string") {
            const val = this.getValue();
            delete val[key];
            this.setCurrentTypeValue(val);
            this.updateElement();
        }
        else if (typeof key === "number") {
            const arr = [...this.getValue()];
            arr.splice(key, 1);
            this.setCurrentTypeValue(arr);
            this.updateElement();
        }
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
        else if (availableTypes.length > 0) {
            return { type: availableTypes[0], value: this.getDefaultValueForType(schema, availableTypes[0]) };
        }
        else {
            return { type: "null", value: this.getDefaultValueForType(schema, "null") };
        }
    }
    static getDefaultValueForType(schema, type) {
        var _a, _b, _c;
        if (type === "json") {
            return null;
        }
        else if (type === "null") {
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
        var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q, _r, _s, _t, _u, _v, _w, _x, _y, _z, _0, _1, _2, _3, _4, _5, _6;
        this.objectElements = {};
        this.arrayElements = [];
        this.element.innerHTML = "";
        this.element.style.display = "inline-block";
        this.element.classList.remove("json-tool-object");
        if (this.path !== "root")
            this.element.append(this.createLineNumber());
        const type = this.currentType;
        const val = (_a = this.currentValues[type]) !== null && _a !== void 0 ? _a : (this.currentValues[type] = JsonElement.getDefaultValueForType(this.schema, type));
        const typeDiv = document.createElement("div");
        typeDiv.classList.add("json-tool-types");
        this.element.append(typeDiv);
        if (this.types.length > 1 || type !== this.types[0]) {
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
            typeDiv.append(select);
        }
        const changeTypeButton = document.createElement("div");
        changeTypeButton.classList.add("json-tool-btn");
        changeTypeButton.style.display = "inline-block";
        changeTypeButton.style.marginLeft = "5px";
        changeTypeButton.innerText = "*";
        changeTypeButton.onclick = () => {
            var _a;
            const validTypes = ["object", "array", "boolean", "string", "number", "null", "undefined", "json"];
            const newType = (_a = window.prompt(`Enter new type:\n${validTypes.join(", ")}`)) !== null && _a !== void 0 ? _a : "";
            if (validTypes.includes(newType)) {
                if (newType === "undefined") {
                    this.parent.deleteChild(this.key);
                }
                else {
                    this.changeType(newType);
                }
            }
        };
        typeDiv.append(changeTypeButton);
        if (type === "object") {
            this.element.append(this.createLineNumber(true));
            this.element.style.display = "block";
            this.element.classList.add("json-tool-object");
            this.element.append("{");
            const object = this.createBlock();
            this.element.append(object);
            const add = document.createElement("div");
            add.classList.add("json-tool-btn");
            add.innerText = "+";
            this.element.append(add);
            add.onclick = () => {
                const key = prompt("Add new key?");
                if (!!key) {
                    const val = this.getValue();
                    val[key] = null;
                    this.setCurrentTypeValue(val);
                    this.updateElement();
                }
            };
            this.element.append("}");
            this.element.append(this.createLineNumber());
            const keyOrder = [];
            for (const key in (_c = (_b = this.schema) === null || _b === void 0 ? void 0 : _b.properties) !== null && _c !== void 0 ? _c : {}) {
                if (val.hasOwnProperty(key))
                    keyOrder.push(key);
            }
            ;
            for (const key in val !== null && val !== void 0 ? val : {}) {
                if (!keyOrder.includes(key))
                    keyOrder.push(key);
            }
            ;
            for (const key of keyOrder) {
                const obj = this.createObjectKeyValuePair(key, ((_d = this.schema) === null || _d === void 0 ? void 0 : _d.properties) ? this.schema.properties[key] : null, val[key]);
                object.append(obj);
                const buttons = document.createElement("div");
                obj.prepend(buttons);
                buttons.classList.add("json-tool-btns");
                if (((_e = this.schema) === null || _e === void 0 ? void 0 : _e.properties) && !this.schema.properties.hasOwnProperty(key)) {
                    const remove = document.createElement("div");
                    remove.classList.add("json-tool-btn");
                    remove.innerText = "X";
                    remove.onclick = () => {
                        if (!confirm(`Are you sure you want to delete the key ${key}?`))
                            return;
                        this.deleteChild(key);
                    };
                    buttons.append(remove);
                }
                else if (!((_g = (_f = this.schema) === null || _f === void 0 ? void 0 : _f.required) === null || _g === void 0 ? void 0 : _g.includes(key))) {
                    const remove = document.createElement("div");
                    remove.classList.add("json-tool-btn");
                    remove.innerText = "∽";
                    remove.onclick = () => {
                        if (!confirm(`Are you sure you want to delete the key ${key}?`))
                            return;
                        this.deleteChild(key);
                    };
                    buttons.append(remove);
                }
            }
            if ((_h = this.schema) === null || _h === void 0 ? void 0 : _h.properties) {
                for (const key in this.schema.properties) {
                    if (val === null || val === void 0 ? void 0 : val.hasOwnProperty(key))
                        continue;
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
                var _a, _b;
                const val = [...this.getValue()];
                if (val.length === ((_a = this.schema) === null || _a === void 0 ? void 0 : _a.maxItems) && !confirm(`This array is at max capacity - really add more?`))
                    return;
                const defaultValue = ((_b = this.schema) === null || _b === void 0 ? void 0 : _b.items) ? JsonElement.getDefaultValue(this.schema.items).value : null;
                val.push(defaultValue);
                this.currentType = type;
                this.setCurrentTypeValue(val);
                this.setIsOpened(true);
                this.updateElement();
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
                    var _a;
                    const arr = [...this.getValue()];
                    if (arr.length === ((_a = this.schema) === null || _a === void 0 ? void 0 : _a.minItems)) {
                        alert(`${this.path} needs at least ${arr.length} elements.`);
                        return;
                    }
                    if (!confirm(`Are you sure you want to delete element ${idx}?`))
                        return;
                    this.deleteChild(idx);
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
        else if (type === "json") {
            const input = document.createElement("textarea");
            input.value = JSON.stringify(val, null, 3);
            input.minLength = (_4 = (_3 = this.schema) === null || _3 === void 0 ? void 0 : _3.minLength) !== null && _4 !== void 0 ? _4 : 0;
            input.maxLength = (_6 = (_5 = this.schema) === null || _5 === void 0 ? void 0 : _5.maxLength) !== null && _6 !== void 0 ? _6 : 99999999999999;
            input.onchange = () => {
                const json = input.value;
                let value = null;
                try {
                    value = JSON.parse(json);
                    this.setCurrentTypeValue(value);
                    const actualType = JsonElement.getType(value);
                    this.currentValues[actualType] = value;
                }
                catch (e) {
                    alert("Couldn't parse JSON: " + e);
                }
            };
            this.element.append(input);
        }
        else {
            this.element.append(`[${type}] : ${val}`);
        }
        this.update();
    }
    createLineNumber(overrideMargin = false) {
        const lineNumber = document.createElement("div");
        lineNumber.classList.add("line-number");
        if (overrideMargin)
            lineNumber.style.marginTop = "0";
        return lineNumber;
    }
    isOpened() {
        var _a;
        return (_a = this.parent.getState()[`${this.path}_opened`]) !== null && _a !== void 0 ? _a : true;
    }
    setIsOpened(state) {
        this.parent.getState()[`${this.path}_opened`] = state;
        this.parent.saveState();
    }
    recursiveSetOpened(state) {
        this.setIsOpened(state);
        for (const child of [...this.arrayElements, ...Object.values(this.objectElements)])
            child.recursiveSetOpened(state);
    }
    createBlock() {
        const block = document.createElement("div");
        block.classList.add("json-tool-block");
        block.style.paddingLeft = "25px";
        block.style.borderLeft = "1px dashed black";
        block.style.marginLeft = "3px";
        const collapse = document.createElement("div");
        if (this.path !== "root")
            block.append(collapse);
        collapse.classList.add("json-tool-btn");
        collapse.classList.add("collapse");
        const updateOpened = (opened) => {
            collapse.innerText = opened ? "ᐯ" : "ᐳ";
            block.classList.remove("opened", "closed");
            block.classList.add(opened ? "opened" : "closed");
        };
        const toggle = () => {
            const opened = !this.isOpened();
            this.setIsOpened(opened);
            updateOpened(opened);
        };
        collapse.onclick = toggle;
        updateOpened(this.isOpened());
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
            const element = new JsonElement(originalKey, `${this.path}.${originalKey}`, valueElement, schema, value, this);
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
        const prevValue = this.getValue();
        this.currentType = type;
        if (type === "json") {
            this.setCurrentTypeValue(prevValue);
        }
        else if (!this.currentValues.hasOwnProperty(type)) {
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