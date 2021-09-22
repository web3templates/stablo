# rgb-hex [![Build Status](https://travis-ci.org/sindresorhus/rgb-hex.svg?branch=master)](https://travis-ci.org/sindresorhus/rgb-hex)

> Convert RGB(A) color to HEX


## Install

```
$ npm install --save rgb-hex
```


## Usage

```js
const rgbHex = require('rgb-hex');

rgbHex(65, 131, 196);
//=> '4183c4'

rgbHex('rgb(40, 42, 54)');
//=> '282a36'

rgbHex(65, 131, 196, 0.2);
//=> '4183c433'

rgbHex(40, 42, 54, '75%');
//=> '282a36c0'

rgbHex('rgba(40, 42, 54, 75%)');
//=> '282a36c0'
```


## Related

- [rgb-hex-cli](https://github.com/sindresorhus/rgb-hex-cli) - CLI for this module
- [hex-rgb](https://github.com/sindresorhus/hex-rgb) - Convert HEX color to RGB


## License

MIT © [Sindre Sorhus](https://sindresorhus.com)
