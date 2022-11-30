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
    deleteChild(key: string | number): void;
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
    deleteChild(key: string | number): void;
    getState(): Record<string, any>;
    load(schema: JsonSchemaProperty, value?: any, validator?: Validator): void;
    hide(): void;
    setValidator(validator: Validator): void;
    getValue(): any;
    update(): void;
    validate(): void;
    private createCss;
}
export {};
