# postcss-color-function [![Build Status](https://travis-ci.org/postcss/postcss-color-function.svg)](https://travis-ci.org/postcss/postcss-color-function)

[PostCSS](https://github.com/postcss/postcss) plugin to transform CSS color function from editor draft of 'Color Module Level 4' specification to more compatible CSS.

## Deprecated

**⚠️ `color()` was changed to `color-mod()`. See [postcss-color-mod-function](https://github.com/jonathantneal/postcss-color-mod-function).**

> There is a
  [`color-mod`](https://github.com/jonathantneal/postcss-color-mod-function)
  implementation.

**⚠️ `color-mod()` has been removed from [Color Module Level 4 specification](https://www.w3.org/TR/css-color-4/#changes-from-20160705).**

## Installation

```console
npm install postcss-color-function
```

## Usage

```js
// dependencies
var fs = require("fs")
var postcss = require("postcss")
var colorFunction = require("postcss-color-function")

// css to be processed
var css = fs.readFileSync("input.css", "utf8")

// process css
// set preserveCustomProps to `false` by default `true`
//for delete declarations with custom properties
var output = postcss()
  .use(colorFunction({preserveCustomProps: true}))
  .process(css)
  .css
```

Using this `input.css`:

```css
body {
  background: color(red a(90%))
}

```

you will get:

```css
body {
  background: rgba(255, 0, 0, 0.9)
}
```

Checkout [tests](test) for examples.

## Interface (according to CSS specs)

```
color( [ <color> | <hue> ] <color-adjuster>* )
```

### List of `color-adjuster`

- `[red( | green( | blue( | alpha( | a(] ['+' | '-']? [<number> | <percentage>] )`
- `[red( | green( | blue( | alpha( | a(] '*' <percentage> )`
- ~~`rgb( ['+' | '-'] [<number> | <percentage>]{3} )`~~ @todo
- ~~`rgb( ['+' | '-'] <hash-token> )`~~ @todo
- ~~`rgb( '*' <percentage> ) |`~~ @todo
- `[hue( | h(] ['+' | '-' | '*']? <angle> )`
- `[saturation( | s(] ['+' | '-' | '*']? <percentage> )`
- `[lightness( | l(] ['+' | '-' | '*']? <percentage> )`
- `[whiteness( | w(] ['+' | '-' | '*']? <percentage> )`
- `[blackness( | b(] ['+' | '-' | '*']? <percentage> )`
- `tint( <percentage> )`
- `shade( <percentage> )`
- `blend( <color> <percentage> [rgb | hsl | hwb]? )`
- ~~`blenda( <color> <percentage> [rgb | hsl | hwb]? )`~~ @todo
- `contrast( <percentage>? )`

Notes:

- some adjusts have shortcuts,
- can be used on every value on any property,
- some values can use add/subtract/scale modifiers or a direct value.

### Examples

```css
whatever {
  color: color(red a(10%));

  background-color: color(red lightness(50%)); /* == color(red l(50%)); */

  border-color: color(hsla(125, 50%, 50%, .4) saturation(+ 10%) w(- 20%));
}
```

## FAQ

### Can you support `currentcolor` so we can do `color(currentcolor adjuster())`?

No we cannot do that. `currentcolor` depends on the cascade (so the DOM) and we can't handle that in a simple preprocessing step. You need to handle that with polyfills.

### Can we use CSS custom properties so we can do `color(var(--mainColor) adjuster())`?

By using [postcss-custom-properties](https://github.com/postcss/postcss-custom-properties) before this plugin, you can do that (sort of).
You have some examples in [cssnext playground](http://cssnext.io/playground/).

## Notes for former Sass users

`lighten` and `darken` are Sass specific methods and not supported by native CSS specs. The same functionality can be achieved with the [tint and shade adjusters](https://drafts.csswg.org/css-color/#tint-shade-adjusters):

```css
$lighten(red, 20%)
/*  is equivalent to */
color(red tint(20%))

$darken(red, 20%)
/*  is equivalent to */
color(red shade(20%))
```

---

## [Changelog](CHANGELOG.md)

## [License](LICENSE)
