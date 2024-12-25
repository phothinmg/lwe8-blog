# ShowMark

***This project is for learning purposes only. It is not suitable for production use.***


## About

Markdown component with [Showdown.js](https://github.com/showdownjs/showdown) and [@types/mdx](https://www.npmjs.com/package/@types/mdx).

## Webpack

Webpack Loader for Showdown.js and mdx components at [showmark-webpack](https://www.npmjs.com/package/showmark-webpack)

## Install

```bash
npm i showmark
```

```bash
pnpm i showmark
```

```bash
yarn add showmark
```

## Usage

### Convert to html

```ts
import Converter from "showmark";

const mdContent = `
---
title: "Hello"
date: "2024-12-12"
---

# Hello World

[.foo]Foo
`;

const converter = new Converter(mdContent, {
  customClassJsx: false,
  showdownOptions: {
    /** showdown-options */
  },
  sanitizeOptions: {
    /**sanitize-html-options */
  },
});

/* 
Frontmatter Data
{ title: 'Hello', date: '2024-12-12' } 
 */
console.log(converter.metadata);

/*
  Raw converted HTML

  <h1>Hello World</h1>
  <p class="foo">Foo</p>
 */
console.log(converter.rawHtml);

/*
 Sanitized HTML

  <h1>Hello World</h1>
  <p class="foo">Foo</p>
 */
console.log(converter.cleanHtml);
```

### Compile to JSX

#### React

```ts
import jsxCompiler from "showmark/jsx";

const mdContent = `
---
title: "Hello"
date: "2024-12-12"
---

# Hello World

[.foo]Foo
`;

/**
 * @returns An object with the compiled code, source map, and metadata
 */
const reactJsx = jsxCompiler(
  mdContent,
  /** compiler options */
  {
    /**
     * @default "prose dark:prose-invert"
     */
    className: "prose dark:prose-invert",
    /**
     * @default "react"
     */
    jsxSource: "react",
    /**
     * @default "compiled.js"
     */
    fileName: "compiled.js",
  },
  /** converter options */
  {
    customClassJsx: true,
    showdownOptions: {
      /** showdown-options */
    },
    sanitizeOptions: {
      /**sanitize-html-options */
    },
  }
);

console.log(reactJsx.code);
```

**React output**

```js
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
export default function MarkdownContent() {
  return /*#__PURE__*/ _jsxs("div", {
    className: "prose dark:prose-invert",
    children: [
      /*#__PURE__*/ _jsx("h1", {
        children: "Hello World",
      }),
      /*#__PURE__*/ _jsx("p", {
        classname: "foo",
        children: "Foo",
      }),
    ],
  });
}
```

#### Preact

```ts
const preactJsx = jsxCompiler(
  mdContent,
  /** compiler options */
  {
    /**
     * @default "prose dark:prose-invert"
     */
    className: "prose dark:prose-invert",
    /**
     * @default "react"
     */
    jsxSource: "preact",
    /**
     * @default "compiled.js"
     */
    fileName: "compiled.js",
  },
  /** converter options */
  {
    customClassJsx: false,
    showdownOptions: {
      /** showdown-options */
    },
    sanitizeOptions: {
      /**sanitize-html-options */
    },
  }
);

console.log(preactJsx.code);
```

**Preact Output**

```jsx
/** @jsx Preact.h */
import Preact from "preact";
export default function MarkdownContent() {
  return Preact.h(
    "div",
    {
      class: "prose dark:prose-invert",
    },
    Preact.h("h1", null, "Hello World"),
    Preact.h(
      "p",
      {
        class: "foo",
      },
      "Foo"
    )
  );
}
```
