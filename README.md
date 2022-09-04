# JsonTool

```html
<script src="https://unpkg.com/@wanieru/json-tool/lib/json-tool.js"/>
```

```js
const htmlElement = ...; //HTMLElement
const jsonSchema = ...; //JSON Schema
const jsonValue = ...; //JSON value
const tool = new window.JsonTool(htmlElement);
tool.load(jsonSchema, jsonValue);
const value = tool.getValue();
```