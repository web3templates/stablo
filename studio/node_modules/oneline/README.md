# oneline

Write nice template literals with newlines, but format as a single-line string.
Trims leading/trailing whitespace and replaces all newlines and subsequent whitespace with a single space.

[![npm version](https://img.shields.io/npm/v/oneline.svg?style=flat-square)](http://browsenpm.org/package/oneline)[![Build Status](https://img.shields.io/travis/rexxars/oneline/master.svg?style=flat-square)](https://travis-ci.org/rexxars/oneline)

## Installing

```
npm install --save oneline
```

## Basic usage

```js
const oneline = require('oneline')

const url = 'https://docs.npmjs.com/'
const message = oneline`
  It's a fine day to write a long, verbose string.
  It could contain all sorts of expressions, let's for instance
  inject a URL, say to the NPM docs: ${url}. In the end, this will
  all result in a single line of text.
`

console.log(message)
// It's a fine day to write a long, verbose string. It could contain all sorts of expressions, let's for instance inject a URL, say to the NPM docs: https://docs.npmjs.com/. In the end, this will all result in a single line of text.
```

## Thanks to...

Thanks [Hal Henke](https://github.com/halhenke) for donating the package name! <3

## License

MIT © [Espen Hovlandsdal](https://espen.codes/)
