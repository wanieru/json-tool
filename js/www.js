"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tsch_1 = require("tsch");
const JsonTool_1 = require("./JsonTool");
const person = tsch_1.tsch.object({
    name: tsch_1.tsch.string().description("First and Last Name").minLength(4).maxLength(6).default("Jeremy Dorn").nullable(),
    age: tsch_1.tsch.number().integer().default(25).min(18).max(99).optional().title("Age").union(tsch_1.tsch.string()),
    favorite_color: tsch_1.tsch.string().color().title("favorite color").default("#ffa500").examples(["#ff0000", "#00ff00"]),
    gender: tsch_1.tsch.string().enumeration(["male", "female", "other"]),
    date: tsch_1.tsch.string().date(),
    alive: tsch_1.tsch.boolean().default(true).nullable().title("Alive").description("If checked, this person is still alive"),
    description: tsch_1.tsch.string().textarea(),
    password: tsch_1.tsch.string().password(),
    website: tsch_1.tsch.string().url(),
    email: tsch_1.tsch.string().email(),
    location: tsch_1.tsch.object({
        city: tsch_1.tsch.string().default("San Francisco"),
        state: tsch_1.tsch.string().default("CA")
    }).title("Location"),
    pets: tsch_1.tsch.array(tsch_1.tsch.object({
        type: tsch_1.tsch.string().enumeration(["cat", "dog", "bird", "reptile", "other"]).default("dog"),
        name: tsch_1.tsch.string()
    }).title("Pet")).unique().table().default([{ type: "dog", name: "Walter" }]).minElements(1).maxElements(3)
}).title("Person");
const personJsonSchema = person.getJsonSchemaProperty();
const rootElement = document.querySelector("#root");
if (rootElement) {
    const tool = new JsonTool_1.JsonTool(rootElement);
    tool.load(personJsonSchema, { test: 123 }, v => person.validate(v));
    window.getValue = () => tool.getValue();
}
//# sourceMappingURL=www.js.map