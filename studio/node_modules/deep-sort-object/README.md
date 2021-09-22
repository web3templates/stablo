# deep-sort-object

[![NPM version][npm-image]][npm-url] [![Downloads][downloads-image]][npm-url] [![Build Status][travis-image]][travis-url] [![Dependency status][david-dm-image]][david-dm-url] [![Dev Dependency status][david-dm-dev-image]][david-dm-dev-url]

[npm-url]:https://npmjs.org/package/deep-sort-object
[downloads-image]:http://img.shields.io/npm/dm/deep-sort-object.svg
[npm-image]:http://img.shields.io/npm/v/deep-sort-object.svg
[travis-url]:https://travis-ci.org/IndigoUnited/js-deep-sort-object
[travis-image]:http://img.shields.io/travis/IndigoUnited/js-deep-sort-object/master.svg
[david-dm-url]:https://david-dm.org/IndigoUnited/js-deep-sort-object
[david-dm-image]:https://img.shields.io/david/IndigoUnited/js-deep-sort-object.svg
[david-dm-dev-url]:https://david-dm.org/IndigoUnited/js-deep-sort-object#info=devDependencies
[david-dm-dev-image]:https://img.shields.io/david/dev/IndigoUnited/js-deep-sort-object.svg

Simple module to sort objects recursively by its keys.


## Installation

`$ npm install deep-sort-object` - `NPM`   
`$ bower install deep-sort-object` - `bower`

The browser file is named `index.umd.js` which supports CommonJS, AMD and globals (`deepForEach`).
If you want to run this module on old browsers, you must include [es5-shim](https://github.com/es-shims/es5-shim).


## Usage

The example bellow is based on `nodejs`.

```js
var sortobject = require('deep-sort-object');

sortobject({
    'z': 'foo',
    'b': 'bar',
    'a': [
        {
            'z': 'foo',
            'b': 'bar'
        }
    ]
});

/*
{
    'a': [
        {
            'b': 'bar',
            'z': 'foo'
        }
    ],
    'b': 'bar',
    'z': 'foo'
});
*/
```


## Tests

`$ npm test`


## License

Released under the [MIT License](http://www.opensource.org/licenses/mit-license.php).
