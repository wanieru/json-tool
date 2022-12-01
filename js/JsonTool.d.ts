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
    private elementState;
    private validator;
    private undoStack;
    private redoStack;
    private undoing;
    private undoButton;
    private redoButton;
    constructor(element: Element, validator?: Validator | null);
    private deleteChild;
    private getState;
    load(schema: JsonSchemaProperty, value?: any, validator?: Validator): Promise<void>;
    hide(): void;
    setValidator(validator: Validator): void;
    getValue(): any;
    private update;
    private validate;
    private pushUndoState;
    private undo;
    private redo;
    private updateUndoRedoButtons;
    private createCss;
}
