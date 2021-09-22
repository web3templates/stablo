# json-lexer

[![Build Status](https://travis-ci.org/finnp/json-lexer.svg?branch=master)](https://travis-ci.org/finnp/json-lexer)
[![Coverage Status](https://coveralls.io/repos/finnp/json-lexer/badge.svg?branch=master&service=github)](https://coveralls.io/github/finnp/json-lexer?branch=master)
[![js-standard-style](https://img.shields.io/badge/code%20style-standard-brightgreen.svg?style=flat)](https://github.com/feross/standard)
[![semantic-release](https://img.shields.io/badge/%20%20%F0%9F%93%A6%F0%9F%9A%80-semantic--release-e10079.svg)](https://github.com/semantic-release/semantic-release)

[![NPM](https://nodei.co/npm/json-lexer.png?downloads=true&downloadRank=true&stars=true)](https://nodei.co/npm/json-lexer/)

This is a JSON lexer based on the implementation in [json3](https://github.com/bestiejs/json3).
It can split a JSON String into a list of annotated tokens. It will list whitespace
as well, so it can used in-place editing of JSON documents.

Note that this doesn't check the validity of your JSON, so it will tokenize something
like `"token"}:` happily.

```js
var lexer = require('json-lexer')
lexer('{"hello": 1.0}')
// results in
[ { type: 'punctuator', value: '{', raw: '{' },
  { type: 'string', value: 'hello', raw: '"hello"' },
  { type: 'punctuator', value: ':', raw: ':' },
  { type: 'whitespace', value: ' ', raw: ' ' },
  { type: 'number', value: 1, raw: '1.0' },
  { type: 'punctuator', value: '}', raw: '}' } ]
```

## types

### whitespace
Allowed white space between the actual relevant tokens.

### punctuator
The characters surrounding your data: `{`, `}`, `:` and `,`

### string
A JSON string `"hi"`, not that the value will be the parsed String without `"`

### number
A JSON number, like `1`, `-1` or `1e1000`. The value will be the parsed number.

### literal
One of the allowed literals `true`, `false` and `null`. The value will be the
specific JS literal.
