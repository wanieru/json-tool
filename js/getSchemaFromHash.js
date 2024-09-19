"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetSchemaFromHash = void 0;
const tsch_1 = require("tsch");
const hashValueTsch = tsch_1.tsch.object({
    schema: tsch_1.tsch.object({}),
    value: tsch_1.tsch.object({})
});
function GetSchemaFromHash() {
    if (!location.hash)
        return null;
    const substr = location.hash.substring(1);
    if (!substr)
        return null;
    let decoded = "";
    let obj = null;
    try {
        const decoded = atob(substr);
        obj = JSON.parse(decoded);
        const validation = hashValueTsch.validate(obj);
        if (!validation.valid)
            throw validation.errors.join("\n");
    }
    catch (e) {
        alert(`Hash should be a base-64 encoded JSON-object with the keys \"schema\" and \"value\", where schema is a json schema, and value is the value to edit.\n${e}`);
        return null;
    }
    return obj;
}
exports.GetSchemaFromHash = GetSchemaFromHash;
//# sourceMappingURL=getSchemaFromHash.js.map