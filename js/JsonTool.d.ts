import { JsonSchemaProperty } from "tsch/dist/JsonSchemaProperty";
export declare type Validator = (value: any, schema: JsonSchemaProperty) => {
    valid: boolean;
    errors?: (string | {
        message: string;
    })[];
};
export declare class JsonTool {
    private containerElement;
    private root;
    private rootObject;
    private errorMessages;
    private iframeBody;
    private rootElement;
    private schema;
    private validator;
    constructor(element: Element, validator?: Validator | null);
    load(schema: JsonSchemaProperty, value?: any, validator?: Validator): void;
    hide(): void;
    setValidator(validator: Validator): void;
    getValue(): any;
    private onUpdate;
    private validate;
    private createCss;
}
