import { JsonSchemaProperty } from "tsch/dist/JsonSchemaProperty";

export type Validator = (value: any, schema: JsonSchemaProperty) => { valid: boolean, errors?: (string | { message: string })[] }

export class JsonTool
{
    private root: HTMLDivElement;
    private rootObject: HTMLDivElement | null;
    private errorMessages: HTMLDivElement;
    private iframeBody: HTMLBodyElement;
    private rootElement: JsonElement | null;
    private schema: JsonSchemaProperty | null;
    private validator: Validator;

    public constructor(element: Element, validator: Validator | null = null)
    {
        this.validator = validator ?? (() => { return { valid: true } });
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
        this.iframeBody = (iframe.contentDocument || iframe.contentWindow?.document)?.querySelector("body") as HTMLBodyElement;
        this.iframeBody.append(this.root);
        this.createCss(this.iframeBody);
        iframe.onload = () => 
        {
            this.iframeBody = (iframe.contentDocument || iframe.contentWindow?.document)?.querySelector("body") as HTMLBodyElement;
            this.iframeBody.append(this.root);
            this.createCss(this.iframeBody);

            this.iframeBody.appendChild(this.errorMessages);
        }


    }
    public load(schema: JsonSchemaProperty, value?: any, validator?: Validator)
    {
        this.validator = validator ?? this.validator;
        this.schema = schema;
        this.root.innerHTML = "";

        if (schema.title)
        {
            const title = document.createElement("h3");
            title.textContent = schema.title;
            JsonElement.addDescription(title, schema.description, schema?.examples);
            this.root.appendChild(title)
        }
        this.rootObject = document.createElement("div");

        this.root.appendChild(this.rootObject);
        this.rootElement = new JsonElement(this.rootObject, schema, value, () => this.onUpdate(), () => this.validate());
        this.validate();
    }
    public setValidator(validator: Validator)
    {
        this.validator = validator;
    }
    public getValue(): any
    {
        return this.rootElement?.getValue();
    }
    private onUpdate()
    {
        if (!this.rootObject) return;
        let number = 1;
        this.rootObject?.querySelectorAll(".line-number").forEach(e =>
        {
            (e as HTMLElement).innerText = number.toString();
            number++;
        });
        this.validate();
    }
    private validate()
    {
        window.setTimeout(() =>
        {
            if (this.schema && this.errorMessages)
            {
                const valid = this.validator(this.getValue(), this.schema);

                this.errorMessages.innerHTML = "";
                if (!valid.valid)
                {
                    this.errorMessages.innerHTML = (valid.errors ?? []).map(e => typeof e === "string" ? e : e.message).join("\n");
                }
            }
        }, 1);
    }
    private createCss(parent: Element)
    {
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

class JsonElement
{
    private element: HTMLDivElement;
    private schema: JsonSchemaProperty | null;
    private types: string[];

    private currentType: string;
    private currentValues: Record<string, any>;

    private arrayElements: JsonElement[] = [];
    private objectElements: Record<string, JsonElement> = {};

    public onUpdate: (() => void) | undefined;
    public validate: (() => void) | undefined;

    public constructor(element: HTMLDivElement, schema: JsonSchemaProperty | null, value: any, onUpdate: (() => void), validate: (() => void))
    {
        this.element = element;
        this.setStyle();

        this.schema = schema;
        this.onUpdate = onUpdate;
        this.validate = validate;

        this.currentValues = {};
        this.types = schema ? JsonElement.getDefaultAvailableTypes(schema) : [];
        const actualType = JsonElement.getType(value);
        this.currentType = "";
        if (actualType !== "undefined")
        {
            this.currentType = actualType;
            this.types.push(actualType);
            this.setCurrentTypeValue(value);
        }
        else if (this.schema)
        {
            const def = JsonElement.getDefaultValue(this.schema);
            this.currentType = def.type;
            this.setCurrentTypeValue(def.value);
        }
        this.types = [...new Set(this.types)];
        this.updateElement();
    }
    private setCurrentTypeValue(value: any)
    {
        this.currentValues[this.currentType] = typeof value !== "undefined" ? JSON.parse(JSON.stringify(value)) : undefined;
        if (this.validate) this.validate();
    }
    public static addDescription(element: HTMLElement, description: string | undefined, examples: any[] | undefined)
    {
        if (examples)
        {
            description = `${description ? `${description}\n` : ""}Examples:\n${examples.map(e => JSON.stringify(e)).join(",\n")}`;
        }
        if (description)
        {
            element.title = description;
            element.style.textDecoration = "underline dotted";
            element.style.cursor = "help";
        }
    }
    private static getType(value: any)
    {
        if (typeof value === "undefined") return "undefined";

        if (Array.isArray(value))
        {
            return "array";
        }
        else if (value === null)
        {
            return "null";
        }
        else
        {
            return typeof value;
        }
    }
    private static isInteger(schema: JsonSchemaProperty | null)
    {
        if (!schema) return false;
        const arr = Array.isArray(schema.type) ? schema.type : [schema.type];
        return arr.includes("integer") && !arr.includes("number");
    }
    private static getDefaultAvailableTypes(schema: JsonSchemaProperty)
    {
        let types = Array.isArray(schema.type) ? [...schema.type] : [schema.type];
        types = types.map(t =>
        {
            if (t === "integer") return "number";
            return t;
        });
        return types;
    }
    private static getDefaultValue(schema: JsonSchemaProperty): { type: string, value: any }
    {
        const availableTypes = this.getDefaultAvailableTypes(schema);
        if (typeof schema.default !== "undefined")
        {
            return { type: this.getType(schema.default), value: schema.default };
        }
        else if (schema.examples && schema.examples.length > 0)
        {
            return { type: this.getType(schema.examples[0]), value: schema.examples[0] };
        }
        else
        {
            return { type: availableTypes[0], value: this.getDefaultValueForType(schema, availableTypes[0]) };
        }
    }
    private static getDefaultValueForType(schema: JsonSchemaProperty | null, type: string)
    {
        if (type === "null")
        {
            return null;
        }
        else if (type === "number")
        {
            return this.isInteger(schema) ? Math.ceil(schema?.minimum ?? 0) : schema?.minimum ?? 0;
        }
        else if (type === "string")
        {
            if (schema?.enum)
                return schema.enum[0];
            if (schema?.format === "color")
                return "#000000";
            if (schema?.format === "date")
                return new Date().toDateString()
            return "";
        }
        else if (type === "boolean")
        {
            return false;
        }
        else if (type === "array")
        {
            return [];
        }
        else if (type === "object")
        {
            const obj = {} as Record<string, any>;
            if (schema?.properties)
            {
                for (const required of schema.required ?? [])
                {
                    if (!schema.properties.hasOwnProperty(required)) continue;
                    const def = this.getDefaultValue(schema.properties[required]);
                    obj[required] = def.value;
                }
            }
            return obj;
        }
    }
    private updateElement()
    {
        this.objectElements = {};
        this.arrayElements = [];
        this.element.innerHTML = "";

        this.element.style.display = "inline-block";
        this.element.classList.remove("json-tool-object");


        this.element.append(this.createLineNumber());

        const type = this.currentType;
        const val = this.currentValues[type] ?? (this.currentValues[type] = JsonElement.getDefaultValueForType(this.schema, type));

        if (this.types.length > 1)
        {
            const select = document.createElement("select");
            select.classList.add("json-tool-type");
            for (const t of this.types)
            {
                const option = document.createElement("option");
                option.innerText = t;
                option.value = t;
                select.append(option);
            }
            select.value = this.currentType;
            select.onchange = () =>
            {
                this.changeType(select.value);
            };
            this.element.append(select);
        }

        if (type === "object")
        {
            this.element.append(this.createLineNumber(true));
            this.element.style.display = "block";
            this.element.classList.add("json-tool-object");
            this.element.append("{");
            const object = this.createBlock();
            this.element.append(object);
            this.element.append("}");
            this.element.append(this.createLineNumber());

            for (const key in val ?? {})
            {
                const obj = this.createObjectKeyValuePair(key, this.schema?.properties ? this.schema.properties[key] : null, val[key]);
                object.append(obj);

                const buttons = document.createElement("div");
                obj.prepend(buttons);
                buttons.classList.add("json-tool-btns");
                if (this.schema?.properties && !this.schema.properties.hasOwnProperty(key))
                {
                    const remove = document.createElement("div");
                    remove.classList.add("json-tool-btn");
                    remove.innerText = "X";
                    remove.onclick = () =>
                    {
                        const val = this.getValue();
                        delete val[key];
                        this.setCurrentTypeValue(val);
                        this.updateElement();
                    };
                    buttons.append(remove);
                }
                else if (!this.schema?.required?.includes(key))
                {
                    const remove = document.createElement("div");
                    remove.classList.add("json-tool-btn");
                    remove.innerText = "∽";
                    remove.onclick = () =>
                    {
                        const val = this.getValue();
                        delete val[key];
                        this.setCurrentTypeValue(val);
                        this.updateElement();
                    };
                    buttons.append(remove);
                }


            }
            if (this.schema?.properties)
            {
                for (const key in this.schema.properties)
                {
                    if (val?.hasOwnProperty(key)) continue;
                    if (this.schema?.required?.includes(key))
                    {
                        const obj = this.createObjectKeyValuePair(key, this.schema.properties[key]);
                        object.append(obj);
                    }
                    else
                    {
                        const obj = this.createObjectKeyValuePair(key, this.schema.properties[key], undefined, true);
                        object.append(obj);
                        obj.style.textDecoration = "line-through 2px";

                        const buttons = document.createElement("div");
                        obj.prepend(buttons);
                        buttons.classList.add("json-tool-btns");

                        const add = document.createElement("div");
                        add.classList.add("json-tool-btn");
                        add.innerText = "≁";
                        add.onclick = () =>
                        {
                            if (this.schema?.properties)
                            {
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
        else if (type === "array")
        {
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
            add.onclick = () =>
            {
                const val = [...this.getValue()];
                if (val.length === this.schema?.maxItems) return;
                if (this.schema?.items)
                {
                    const defaultValue = JsonElement.getDefaultValue(this.schema.items).value;
                    val.push(defaultValue);
                    this.currentType = type;
                    this.setCurrentTypeValue(val);
                    this.updateElement();
                }
            }

            this.element.append("]");
            this.element.append(this.createLineNumber());

            const arr = val ?? [];
            for (let i = 0; i < arr.length; i++)
            {
                const idx = i;
                const obj = this.createObjectKeyValuePair(i, this.schema?.items ? this.schema.items : null, val[i]);
                array.append(obj);

                const buttons = document.createElement("div");
                obj.prepend(buttons);
                buttons.classList.add("json-tool-btns");

                const remove = document.createElement("div");
                remove.classList.add("json-tool-btn");
                remove.innerText = "X";
                remove.onclick = () =>
                {
                    const arr = [...this.getValue()];
                    if (arr.length === this.schema?.minItems) return;
                    arr.splice(idx, 1);
                    this.setCurrentTypeValue(arr);
                    this.updateElement();
                };
                buttons.append(remove);

                const up = document.createElement("div");
                up.classList.add("json-tool-btn");
                up.innerText = "ᐃ";
                up.onclick = () =>
                {
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
                down.onclick = () =>
                {
                    let arr = [...this.getValue()];
                    const element = arr.splice(idx, 1);
                    arr = arr.slice(0, idx + 1).concat(element).concat(arr.slice(idx + 1));
                    this.setCurrentTypeValue(arr);
                    this.updateElement();
                };
                buttons.append(down);

            }
        }
        else if (type === "boolean")
        {
            const checkbox = document.createElement("input");
            checkbox.type = "checkbox";
            checkbox.checked = val;
            checkbox.onchange = () =>
            {
                this.setCurrentTypeValue(checkbox.checked);
            }
            this.element.append(checkbox);
        }
        else if (type === "string")
        {
            if (this.schema?.enum)
            {
                const select = document.createElement("select");
                for (const value of [... new Set(this.schema.enum.concat(val))])
                {
                    const option = document.createElement("option");
                    option.innerText = value;
                    option.value = value;
                    select.append(option);
                }
                select.value = val;
                select.onchange = () =>
                {
                    this.setCurrentTypeValue(select.value);
                };
                this.element.append(select);
            }
            else if (this.schema?.format === "textarea")
            {
                const input = document.createElement("textarea");
                input.value = val;
                input.minLength = this.schema?.minLength ?? 0;
                input.maxLength = this.schema?.maxLength ?? 99999999999999;
                input.onchange = () =>
                {
                    this.setCurrentTypeValue(input.value);
                }
                this.element.append(input);
            }
            else if (this.schema?.format === "date")
            {
                const input = document.createElement("input");
                input.type = "date";
                input.onchange = () =>
                {
                    this.setCurrentTypeValue(input.valueAsDate?.toDateString() ?? "");
                }
                this.element.append(input);
                input.valueAsDate = new Date(val);
            }
            else
            {
                const input = document.createElement("input");
                input.type = "text";
                if (this.schema?.format && ["password", "email", "color", "url"].includes(this.schema.format)) input.type = this.schema.format;
                input.value = val;
                input.minLength = this.schema?.minLength ?? 0;
                input.maxLength = this.schema?.maxLength ?? 99999999999999;
                input.onchange = () =>
                {
                    this.setCurrentTypeValue(input.value);
                }
                this.element.append(input);
            }
        }
        else if (type === "null")
        {
            this.element.append("null");
        }
        else if (type === "number")
        {
            const input = document.createElement("input");
            input.type = "number";
            input.value = val.toString();
            input.min = this.schema?.minimum?.toString() ?? "";
            input.max = this.schema?.maximum?.toString() ?? "";
            if (JsonElement.isInteger(this.schema)) input.step = "1";
            input.onchange = () =>
            {
                this.setCurrentTypeValue(parseFloat(input.value));
            }
            this.element.append(input);
        }
        else
        {
            this.element.append(`[${type}] : ${val}`);
        }

        if (this.onUpdate) this.onUpdate();
    }
    private createLineNumber(overrideMargin: boolean = false): HTMLDivElement
    {
        const lineNumber = document.createElement("div");
        lineNumber.classList.add("line-number");
        if (overrideMargin) lineNumber.style.marginTop = "0";
        return lineNumber;
    }
    private createBlock(): HTMLDivElement
    {
        const block = document.createElement("div");
        block.classList.add("json-tool-block");

        block.style.paddingLeft = "25px";
        block.style.borderLeft = "1px dashed black";
        block.style.marginLeft = "3px";

        let opened = false;
        const collapse = document.createElement("div");
        block.append(collapse);
        collapse.classList.add("json-tool-btn");
        const toggle = () =>
        {
            opened = !opened;
            collapse.innerText = opened ? "ᐯ" : "ᐳ";
            block.classList.remove("opened", "closed");
            block.classList.add(opened ? "opened" : "closed");
        }
        collapse.onclick = toggle;
        toggle();

        return block;
    }
    private createObjectKeyValuePair(key: string | number, schema: JsonSchemaProperty | null, value?: any, noValue: boolean = false): HTMLDivElement
    {
        const parent = document.createElement("div");
        const originalKey = key;
        if (typeof key === "number")
        {
            key = schema?.title ? `${schema.title} ${key}` : key;
        }
        else
        {
            key = schema?.title ?? key;
        }
        const title = document.createElement("span");
        title.innerText = key.toString();
        JsonElement.addDescription(title, schema?.description, schema?.examples);
        parent.append(title);
        parent.classList.add("json-tool-key");
        parent.append(": ");
        if (!noValue)
        {
            const valueElement = document.createElement("div");
            const element = new JsonElement(valueElement, schema, value, () => this.onUpdate && this.onUpdate(), () => this.validate && this.validate());
            if (this.currentType === "array") this.arrayElements.push(element);
            else if (this.currentType === "object") this.objectElements[originalKey] = element;
            parent.append(valueElement);
        }
        return parent;
    }
    private changeType(type: string)
    {
        this.currentType = type;
        if (!this.currentValues.hasOwnProperty(type))
        {
            if (typeof this.schema?.default !== "undefined" && JsonElement.getType(this.schema.default) === type)
                this.setCurrentTypeValue(this.schema.default);
            else
                this.setCurrentTypeValue(JsonElement.getDefaultValueForType(this.schema, type));
        }
        this.updateElement();
    }
    private setStyle()
    {
        this.element.style.whiteSpace = "pre";
        this.element.classList.add("json-tool-value");
    }

    public getValue(): any
    {
        let val: any;
        if (this.currentType === "array")
        {
            val = this.arrayElements.map(e => e.getValue());
        }
        else if (this.currentType === "object")
        {
            const obj = {} as Record<string, any>;
            for (const key in this.objectElements)
            {
                obj[key] = this.objectElements[key].getValue();
            }
            val = obj;
        }
        else
        {
            val = this.currentValues[this.currentType] ?? JsonElement.getDefaultValueForType(this.schema, this.currentType);
        }
        this.currentValues[this.currentType] = val;
        return val;
    }
}