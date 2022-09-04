import { JsonSchemaProperty } from "tsch/dist/JsonSchemaPropert";
export class JsonTool
{
    private root: HTMLDivElement;
    private rootObject: HTMLDivElement | null;
    public constructor(element: Element)
    {
        this.root = document.createElement("div");

        this.root.style.fontFamily = "monospace";
        this.root.style.marginLeft = "20px";
        this.root.classList.add("json-tool");
        element.appendChild(this.root);
        this.rootObject = null;
        this.createCss(element);
    }
    public load(schema: JsonSchemaProperty, value?: any)
    {
        this.root.childNodes.forEach(c => c.remove());

        if (schema.title)
        {
            const title = document.createElement("h3");
            title.textContent = schema.title;
            JsonElement.addDescription(title, schema.description);
            this.root.appendChild(title)
        }
        this.rootObject = document.createElement("div");

        this.root.appendChild(this.rootObject);
        new JsonElement(this.rootObject, schema, value);
    }
    private createCss(parent: Element)
    {
        const style = document.createElement("style");
        parent.appendChild(style);
        style.innerHTML =
            `
              .json-tool-block > .json-tool-btn {
                position: absolute;
                left: 5px;
                border: 1px black solid;
                cursor: pointer;
                display: block;
                margin-top: -16px;
              }
              .json-tool-block.opened > .json-tool-key {display: block}
              .json-tool-block.closed > .json-tool-key {display: none}
`;
    }


}

export class JsonElement
{
    private element: HTMLDivElement;
    private schema: JsonSchemaProperty | null;
    private types: string[];

    private currentType: string;
    private currentValues: Record<string, any>;

    public constructor(element: HTMLDivElement, schema: JsonSchemaProperty | null, value: any)
    {
        this.element = element;
        this.setStyle();

        this.schema = schema;

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
    }
    public static addDescription(element: HTMLElement, description: string | undefined)
    {
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
        if (schema.default)
        {
            return { type: this.getType(schema.default), value: schema.default };
        }
        else
        {
            return { type: availableTypes[0], value: this.getDefaultValueForType(schema, availableTypes[0]) };
        }
    }
    private static getDefaultValueForType(schema: JsonSchemaProperty | null, type: string)
    {
        if (type === "number")
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
                return Date.now()
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
        }
    }
    private updateElement()
    {
        this.element.childNodes.forEach(c => c.remove());

        this.element.style.display = "inline-block";

        const type = this.currentType;
        const val = this.currentValues[type] ?? JsonElement.getDefaultValueForType(this.schema, type);

        if (type === "object")
        {
            this.element.style.display = "block";
            this.element.append("{");
            const object = this.createBlock();
            this.element.append(object);
            this.element.append("}");

            for (const key in val ?? {})
            {
                object.append(this.createObjectKeyValuePair(key, this.schema?.properties ? this.schema.properties[key] : null, val[key]));
            }
            if (this.schema?.properties)
            {
                for (const key in this.schema.properties)
                {
                    if (val?.hasOwnProperty(key)) continue;
                    object.append(this.createObjectKeyValuePair(key, this.schema.properties[key]));
                }
            }
        }
        else if (type === "array")
        {
            this.element.style.display = "block";
            this.element.append("[");
            const array = this.createBlock();
            this.element.append(array);
            this.element.append("]");

            const arr = val ?? [];
            for (let i = 0; i < arr.length; i++)
            {
                array.append(this.createObjectKeyValuePair(i, this.schema?.items ? this.schema.items : null, val[i]));
            }
        }
        else
        {
            this.element.innerText = `[${type}]`;
        }
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
            collapse.innerText = opened ? "-" : "+";
            block.classList.remove("opened", "closed");
            block.classList.add(opened ? "opened" : "closed");
        }
        collapse.onclick = toggle;
        toggle();

        return block;
    }
    private createObjectKeyValuePair(key: string | number, schema: JsonSchemaProperty | null, value?: any): HTMLDivElement
    {
        const parent = document.createElement("div");
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
        JsonElement.addDescription(title, schema?.description);
        parent.append(title);
        parent.classList.add("json-tool-key");
        parent.append(": ");
        const valueElement = document.createElement("div");
        new JsonElement(valueElement, schema, value);
        parent.append(valueElement);
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
}