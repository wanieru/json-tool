# JsonTool

```html
<script src="json-tool.js"/>
```

```js
const htmlElement = ...; //HTMLElement
const jsonSchema = ...; //JSON Schema
const jsonValue = ...; //JSON value
const tool = new window.JsonTool(htmlElement);
tool.load(jsonSchema, jsonValue);
const value = tool.getValue();
```