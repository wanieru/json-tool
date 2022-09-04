import { tsch } from "tsch";
import { JsonTool } from "./JsonTool";

(window as any).JsonTool = JsonTool;

const person = tsch.object({
    name: tsch.string().description("First and Last Name").minLength(4).default("Jeremy Dorn").nullable(),
    age: tsch.number().integer().default(25).min(18).max(99).optional().title("Age").union(tsch.string()),
    favorite_color: tsch.string().color().title("favorite color").default("#ffa500"),
    gender: tsch.string().enumeration(["male", "female", "other"]),
    date: tsch.string().date(),
    alive: tsch.boolean().optional().nullable().title("Alive").description("If checked, this person is still alive"),
    description: tsch.string().textarea(),
    email: tsch.string().email(),
    location: tsch.object({
        city: tsch.string().default("San Francisco"),
        state: tsch.string().default("CA")
    }).title("Location"),
    pets: tsch.array(tsch.object({
        type: tsch.string().enumeration(["cat", "dog", "bird", "reptile", "other"]).default("dog"),
        name: tsch.string()
    }).title("Pet")).unique().table().default([{ type: "dog", name: "Walter" }])
}).title("Person");
type Person = tsch.Infer<typeof person>;
const personJsonSchema = person.getJsonSchemaProperty();

const rootElement = document.querySelector("#root");
if (rootElement)
{
    const tool = new JsonTool(rootElement);
    tool.load(personJsonSchema, { test: 123 });
    (window as any).getValue = () => tool.getValue();
}