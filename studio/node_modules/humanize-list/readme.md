# humanize-list [![Build Status](https://secure.travis-ci.org/johnotander/humanize-list.png?branch=master)](https://travis-ci.org/johnotander/humanize-list)

Comma delimit an array for human readability, the Oxford comma is optional.

## Installation

```bash
npm install --save humanize-list
```

## Usage

```javascript
var humanizeList = require('humanize-list')

humanizeList(['apples', 'tomatoes', 'unicorns']) // => 'apples, tomatoes and unicorns'
humanizeList(['apples', 'tomatoes', 'unicorns'], { oxfordComma: true }) // => 'apples, tomatoes, and unicorns'
humanizeList(['apples', 'tomatoes', 'unicorns'], { conjunction: 'or' }) // => 'apples, tomatoes or unicorns'
humanizeList(['apples', 'tomatoes', 'unicorns'], { skipConjunction: true }) // => 'apples, tomatoes, unicorns'
```

### Options

- `oxfordComma` Boolean - Specify whether the Oxford comma should be included. Default: `false`
- `conjunction` String - Specify a conjunction. Default: `'and'`
- `skipConjunction` Boolean - Skip the conjunction altogether. Default: `false`

## License

MIT

## Contributing

1. Fork it
2. Create your feature branch (`git checkout -b my-new-feature`)
3. Commit your changes (`git commit -am 'Add some feature'`)
4. Push to the branch (`git push origin my-new-feature`)
5. Create new Pull Request

Crafted with <3 by John Otander ([@4lpine](https://twitter.com/4lpine)).

***

> This package was initially generated with [yeoman](http://yeoman.io) and the [p generator](https://github.com/johnotander/generator-p.git).
