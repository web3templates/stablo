# @sanity/color

The Sanity color palette.

```sh
npm install @sanity/color
```

[![npm version](https://img.shields.io/npm/v/@sanity/color.svg?style=flat-square)](https://www.npmjs.com/package/@sanity/color)

## Usage

```js
import {black, hues, COLOR_HUES, COLOR_TINTS} from '@sanity/color'

console.log(black.title)
// "Black"
console.log(black.hex)
// "#101112"

console.log(hues.red['500'].title)
// "Red 500"
console.log(hues.red['500'].hex)
// "#f03e2f"

console.log(COLOR_HUES)
// ["gray", "blue", "purple", "magenta", "red", "orange", "yellow", "green", "cyan"]

console.log(COLOR_TINTS)
// ["50", "100", "200", "300", "400", "500", "600", "700", "800", "900", "950"]
```

## License

MIT-licensed. See LICENSE.
