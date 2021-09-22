# get-random-values

`window.crypto.getRandomValues` or `window.msCrypto.getRandomValues` or
`require('crypto').randomBytes` or an _Error_.

## Example

``` javascript
var getRandomValues = require('get-random-values');

var array = new Uint32Array(10);
getRandomValues(array);
// => [
// =>   183,
// =>   76,
// =>   18,
// =>   177,
// =>   73,
// =>   9,
// =>   50,
// =>   248,
// =>   216,
// =>   104
// => ]
```

## Installation

``` bash
$ npm install get-random-values
```

## API

``` javascript
var getRandomValues = require('get-random-values');
```

### `getRandomValues(buf)`

Fills integer-based _TypedArray_ `buf` with cryptographically random numbers.
Checks for and uses the first of the following:

  - `window.crypto.getRandomValues`
  - `window.msCrypto.getRandomValues`
  - Node.js crypto

If none of the above are available, then an _Error_ is thrown.

Throws _QuotaExceededError_ if `buf.length > 65536` (even if Node.js crypto,
which doesn't have that limit, is being used).

`buf` **must** be a _Uint8Array_ if Node.js crypto is used, otherwise a
_TypeError_ will be thrown.
