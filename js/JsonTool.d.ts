import { JsonSchemaProperty } from "tsch/dist/JsonSchemaPropert";
export declare class JsonTool {
    private root;
    private rootObject;
    private iframeBody;
    private rootElement;
    constructor(element: Element);
    load(schema: JsonSchemaProperty, value?: any): void;
    getValue(): any;
    private onUpdate;
    private createCss;
}
