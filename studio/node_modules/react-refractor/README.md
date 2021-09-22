# react-refractor

Syntax highlighter for React, utilizing VDOM for efficient updates

[![npm version](http://img.shields.io/npm/v/react-refractor.svg?style=flat-square)](http://browsenpm.org/package/react-refractor)[![Build Status](https://img.shields.io/github/workflow/status/rexxars/react-refractor/CI?style=flat-square)](https://github.com/rexxars/react-refractor/actions/workflows/main.yml)

- Thin wrapper on top of [refractor](https://github.com/wooorm/refractor) (Syntax highlighting using VDOM)
- refractor uses [Prism](https://github.com/PrismJS/prism) under the hood, thus supports all the same syntaxes
- About 14kB minified + gziped when using a single language syntax. Languages tend to add a bit of weight, see [unpkg](https://unpkg.com/refractor@2.3.0/lang/) for some pointers on how much.

Feel free to check out a [super-simple demo](http://rexxars.github.io/react-refractor/).

## Installation

```
npm install --save react-refractor refractor
```

## Usage

```js
import Refractor from 'react-refractor'

// Load any languages you want to use from `refractor`
import js from 'refractor/lang/javascript'
import php from 'refractor/lang/php'

// Then register them
Refractor.registerLanguage(js)
Refractor.registerLanguage(php)

ReactDOM.render(
  <Refractor language="js" value="/* Code to highlight */" />,
  document.getElementById('target')
)
```

You'll need to register the languages you want to use - I've intentionally left all languages out of the default bundle in order to reduce th ebundle size out of the box. Load and register them from [refractor](https://unpkg.com/refractor/lang/) using something like this: `Refractor.registerLanguage(require('refractor/lang/docker'))`.

If you are only rendering on the server or _really_ don't care about the bundle size, you can import Refractor from `react-refractor/all` to include all supported languages.

## Styling

Stylesheets are **not** automatically handled for you - but there is [a bunch of premade themes](https://github.com/PrismJS/prism/tree/gh-pages/themes) for Prism which you can simply drop in and they'll "just work". You can either grab these from the source, of pull them in using a CSS loader - whatever works best for you. You can also download a customized stylesheet from Prism's [download customizer](http://prismjs.com/download.html).

Note that when using the `markers` feature, there is an additional class name called `hljs-marker` which is not defined by highlight js as it's not a part of its feature set. You can either set it yourself, or you can explicitly set class names on markers.

## Props

| Name        | Description                                                                           |
| :---------- | :------------------------------------------------------------------------------------ |
| `className` | Class name for the outermost `pre` tag. Default: `refractor`                          |
| `language`  | Language to use for syntax highlighting this value. Must be registered prior to usage |
| `value`     | The code snippet to syntax highlight                                                  |
| `inline`    | Whether code should be displayed inline (no `<pre>` tag, sets `display: inline`)      |
| `markers`   | Array of lines to mark. See section on markers below                                  |

## Differences to Prism

Prism.js operates directly on the DOM, while refractor generates an AST which react-refractor walks over and converts into virtual DOM nodes. The benefit of the AST approach is that we can easily reuse this across different platforms, highlight on both the server and the client using the same code base and benefit from Reacts virtual DOM diff algorithm to only update the nodes that change.

The drawback to this approach is that you cannot use Prism plugins, since they _also_ work and depend directly on the DOM.

## Markers

It's quite common to want to highlight lines when doing syntax highlighting, but Prism uses a very DOM-centric approach to achieve this. In order to make up for this, react-refractor provides a custom plugin that lets you define "markers". Since this is a non-standard feature, you will have to provide your own styling for the `refractor-marker` class name. To highlight lines, simply provide the line numbers in the `markers` property:

```js
const source = `
const foo = 'bar'
const bar = 'foo'
const baz = foo + bar
`

// Highlight line 1 and 2, but not 3
<Refractor
  language="js"
  value={source}
  markers={[1, 2]}
/>
```

You are also able to provide greater customization by specifying an object for each marker, which can include either a `className` or a `component` property. This allows you to render basically anything you want:

```js
const source = `
const foo = 'bar'
const bar = 'foo'
const baz = "bar" + bar
`

// Highlight line 1 and 2, but not 3
<Refractor
  language="js"
  value={source}
  markers={[
    {line: 1, className: 'no-not-use-foo-in-examples'},
    {line: 3, component: props => (
      <TooltipedLine tooltipText="Prefer template for string concatenation">
        {props.children}
      </TooltipedLine>
    )}
  ]}
/>
```

## Dynamic loading

You can use `Refractor.hasLanguage(language)` to check if a language has been registered. Combining this with Webpack's [code splitting abilities](https://webpack.github.io/docs/code-splitting.html) (or something similar), you should be able to load definitions for languages on the fly.

## License

MIT-licensed. See LICENSE.
