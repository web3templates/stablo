# direction

[![Build][build-badge]][build]
[![Coverage][coverage-badge]][coverage]
[![Downloads][downloads-badge]][downloads]
[![Size][size-badge]][size]

Detect direction: left-to-right, right-to-left, or neutral.

## API

Install:

```sh
npm install direction
```

Use:

```js
var direction = require('direction')

direction('A') // => 'ltr'
direction('anglais') // => 'ltr'
direction('بسيطة') // => 'rtl'
direction('@') // => 'neutral'
```

## CLI

Install:

```sh
npm install -g direction
```

Use:

```txt
Usage: direction [options] <words...>

Detect directionality: left-to-right, right-to-left, or neutral

Options:

  -h, --help           output usage information
  -v, --version        output version number

Usage:

# output directionality
$ direction @
# neutral

# output directionality from stdin
$ echo 'الانجليزية' | direction
# rtl
```

## License

[MIT][license] © [Titus Wormer][author]

<!-- Definitions -->

[build-badge]: https://img.shields.io/travis/wooorm/direction.svg

[build]: https://travis-ci.org/wooorm/direction

[coverage-badge]: https://img.shields.io/codecov/c/github/wooorm/direction.svg

[coverage]: https://codecov.io/github/wooorm/direction

[downloads-badge]: https://img.shields.io/npm/dm/direction.svg

[downloads]: https://www.npmjs.com/package/direction

[size-badge]: https://img.shields.io/bundlephobia/minzip/direction.svg

[size]: https://bundlephobia.com/result?p=direction

[license]: license

[author]: https://wooorm.com
