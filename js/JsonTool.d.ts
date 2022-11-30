import { JsonSchemaProperty } from "tsch/dist/JsonSchemaProperty";
export declare type Validator = (value: any, schema: JsonSchemaProperty) => {
    valid: boolean;
    errors?: (string | {
        message: string;
    })[];
};
interface JsonElementParent {
    update(): void;
    validate(): void;
    getState(): Record<string, any>;
}
export declare class JsonTool implements JsonElementParent {
    private containerElement;
    private root;
    private rootObject;
    private errorMessages;
    private iframeBody;
    private rootElement;
    private schema;
    private elementState;
    private validator;
    constructor(element: Element, validator?: Validator | null);
    getPath(element: JsonElement): string;
    getState(): Record<string, any>;
    load(schema: JsonSchemaProperty, value?: any, validator?: Validator): void;
    hide(): void;
    setValidator(validator: Validator): void;
    getValue(): any;
    update(): void;
    validate(): void;
    private createCss;
}
declare class JsonElement implements JsonElementParent {
    private element;
    private schema;
    private types;
    private currentType;
    private currentValues;
    private arrayElements;
    private objectElements;
    private parent;
    private path;
    constructor(path: string, element: HTMLDivElement, schema: JsonSchemaProperty | null, value: any, parent: JsonElementParent);
    update(): void;
    validate(): void;
    getPath(element: JsonElement): string;
    getState(): Record<string, any>;
    private setCurrentTypeValue;
    static addDescription(element: HTMLElement, description: string | undefined, examples: any[] | undefined): void;
    private static getType;
    private static isInteger;
    private static getDefaultAvailableTypes;
    private static getDefaultValue;
    private static getDefaultValueForType;
    private updateElement;
    private createLineNumber;
    private isOpened;
    private setIsOpened;
    private createBlock;
    private createObjectKeyValuePair;
    private changeType;
    private setStyle;
    getValue(): any;
}
export {};
