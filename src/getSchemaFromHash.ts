import { tsch } from "tsch";
import { JsonSchemaProperty } from "tsch/dist/JsonSchemaProperty";

const hashValueTsch = tsch.object({
    schema: tsch.object({}),
    value: tsch.object({})
});

export function GetSchemaFromHash(): { schema: JsonSchemaProperty, value: any } | null
{
    if (!location.hash) return null;
    const substr = location.hash.substring(1);
    if (!substr) return null;
    let decoded = "";
    let obj: tsch.Infer<typeof hashValueTsch> = null as any;
    try
    {
        const decoded = atob(substr);
        obj = JSON.parse(decoded);
        const validation = hashValueTsch.validate(obj);
        if (!validation.valid) throw validation.errors.join("\n");
    }
    catch (e)
    {
        alert(`Hash should be a base-64 encoded JSON-object with the keys \"schema\" and \"value\", where schema is a json schema, and value is the value to edit.\n${e}`);
        return null;
    }
    return obj as any;
}