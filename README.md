<div align="center">

![Logo](./dialecto.png)

A lightweight translation tool for React apps with support for variables, nested keys, and HTML parsing.

<a href="https://www.npmjs.com/package/dialecto">
    <img src="https://img.shields.io/npm/dm/dialecto.svg" alt="npm downloads" />
</a>

<a href="https://github.com/brunotbdev/dialecto">
    <img src="https://img.shields.io/github/stars/brunotbdev/dialecto" alt="github stars" />
</a>

[![License: MIT](https://img.shields.io/badge/license-MIT-green.svg)](LICENSE)

<br/>
<br/>

<pre>npm install dialecto</pre>

<br/>

</div>

- [📄 Documentation](#-documentation)
  - [🚀 Getting Started](#-getting-started)
  - [🔧 Importing and configuration](#-importing-and-configuration)
  - [📋 List of all configurations](#-list-of-all-configurations)
  - [Default Tags](#default-tags)
  - [Default Attributes](#default-attributes)
  - [🔨 Usage](#-usage)
  - [📝 Full Example](#-full-example)

## 📄 Documentation

### 🚀 Getting Started

- Create a folder for your translations and create JSON files for them.

```js
// src/translations/en-us.json

{
  "text": "english"
}
```

```js
// src/translations/pt-br.json

{
  "text": "portuguese"
}
```

### 🔧 Importing and Configuration

- Import the Dialecto provider and wrap your app with it. Then, import your translations and configure the package using <code>dialectoConfig</code>.
- Language keys must follow the <strong>BCP 47 format and be lowercase</strong>.
- <code>languages</code> and <code>defaultLanguage</code> are required.

```tsx
import ptbr from "./translations/pt-br.json";
import enus from "./translations/en-us.json";
import { Dialecto, dialectoConfig } from "dialecto";

dialectoConfig({
  languages: { ptbr, enus },
  defaultLanguage: "ptbr",
});

createRoot(document.getElementById("root")).render(
  <Dialecto>
    <App />
  </Dialecto>
);
```

### 📋 List of All Configurations

| Configuration        |                                                                 Description                                                                  |        Type         |               Default Value               |
| :------------------- | :------------------------------------------------------------------------------------------------------------------------------------------: | :-----------------: | :---------------------------------------: |
| languages            | - All available languages.<br/>- Each key must be a valid BCP 47 language tag in lowercase.<br />- You can use objects or import JSON files. |  { lang1, lang2 }   |                    {}                     |
| defaultLanguage      |       - The default language to use when no language is selected.<br />- The value needs to be the name of the object in 'languages'.        |       string        |                    ""                     |
| browserLanguage      |                                           Whether to detect the browser's language on first load.                                            |       boolean       |                   true                    |
| localStorage         |  - Whether to persist the selected language using localStorage.<br />- If true, the selected language is saved and reused on future visits.  |       boolean       |                   true                    |
| allowedTags          |                                                    List of additional allowed HTML tags.                                                     |        [""]         |       [Default Tags](#default-tags)       |
| attributeMap         |                                              Custom mapping for HTML attributes to React props.                                              | { attribute: prop } | [Default Attributes](#default-attributes) |
| allowAllTags         |                                                   If true, all HTML tags will be allowed.                                                    |       boolean       |                   false                   |
| disableAllTags       |                                                   If true, all HTML tags will be disabled.                                                   |       boolean       |                   false                   |
| disableAllAttributes |                                                If true all HTML attributes will be disabled.                                                 |       boolean       |                   false                   |

- #### Default Tags

```ts
[
  "a",
  "abbr",
  "b",
  "br",
  "code",
  "del",
  "dfn",
  "em",
  "i",
  "ins",
  "kbd",
  "mark",
  "q",
  "s",
  "small",
  "span",
  "strong",
  "sub",
  "sup",
  "time",
  "u",
  "var",
  "wbr",
];
```

- #### Default Attributes

```ts
{
  classname: "className",
  id: "id",
  style: "style",
  title: "title",
  href: "href",
  target: "target",
  rel: "rel",
}
```

### 🔨 Usage

- Import <code>useDialecto</code> to get the functions.

```tsx
import { useDialecto } from "dialecto";

export default function App() {
  const { d, changeLang } = useDialecto();
}
```

- The <code>d</code> function retrieves the translated text based on the provided path.
- <code>param1</code> Path to locate translation key.
- <code>param2</code> Optional variables.

```tsx
<h1>{d("text", { count })}</h1>
```

- The <code>changeLang</code> function changes the current language.

```tsx
<button onClick={() => changeLang("enus")}>en-us</button>
```

### 📝 Full Example

```js
// src/translations/en-us.json

{
  "text": "english",
  "textVar": "english ${count}",
  "textHtml": "<i>english</i>",
  "textVarHtml": "<i>english ${count}</i>"
}
```

```tsx
// App.tsx

import { useState } from "react";
import { useDialecto } from "dialecto";

export default function App() {
  const [count, setCount] = useState(0);
  const { d, changeLang } = useDialecto();

  return (
    <>
      <h1>{d("text")}</h1>
      <h1>{d("textVar", { count })}</h1>
      <h1>{d("textHtml")}</h1>
      <h1>{d("textVarHtml", { count })}</h1>
      <div>
        <button onClick={() => setCount((count) => count + 1)}>
          Add Count
        </button>
        <button onClick={() => changeLang("ptbr")}>pt-br</button>
        <button onClick={() => changeLang("enus")}>en-us</button>
      </div>
    </>
  );
}
```

## License

[MIT](https://choosealicense.com/licenses/mit/)
