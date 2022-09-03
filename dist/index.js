"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tsch_1 = require("tsch");
const JsonTool_1 = require("./JsonTool");
window.JsonTool = JsonTool_1.JsonTool;
const person = tsch_1.tsch.object({
    name: tsch_1.tsch.string().description("First and Last Name").minLength(4).default("Jeremy Dorn"),
    age: tsch_1.tsch.number().integer().default(25).min(18).max(99).optional().title("Age"),
    favorite_color: tsch_1.tsch.string().color().title("favorite color").default("#ffa500"),
    gender: tsch_1.tsch.string().enumeration(["male", "female", "other"]),
    date: tsch_1.tsch.string().date(),
    location: tsch_1.tsch.object({
        city: tsch_1.tsch.string().default("San Francisco"),
        state: tsch_1.tsch.string().default("CA")
    }).title("Location"),
    pets: tsch_1.tsch.array(tsch_1.tsch.object({
        type: tsch_1.tsch.string().enumeration(["cat", "dog", "bird", "reptile", "other"]).default("dog"),
        name: tsch_1.tsch.string()
    }).title("Pet")).unique().table().default([{ type: "dog", name: "Walter" }])
}).title("Person");
const personJsonSchema = person.getJsonSchemaProperty();
const rootElement = document.querySelector("#root");
if (rootElement) {
    const tool = new JsonTool_1.JsonTool(rootElement);
    tool.load(personJsonSchema);
}
