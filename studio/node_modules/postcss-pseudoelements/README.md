# postcss-pseudoelements

postcss helper for pseudo element colons, it handles double -> single and single -> double.

## Usage

### Double to Single (default)
```javascript
var pe = require('postcss-pseudoelements');
var postcss = require('postcss');
var options = {
	single: true, // default
	selectors: ['before','after','first-letter','first-line'], // default
};

var processor = postcss(pe(options));

console.log(processor.process('a:before {}').css) // outputs: a:before {}
console.log(processor.process('a::before {}').css) // outputs: a:before {}
```

### Single to Double

```javascript
var pe = require('postcss-pseudoelements');
var postcss = require('postcss');
var options = {
	single: false,
	selectors: ['before','after','first-letter','first-line'], // default
};

var processor = postcss(pe(options));

console.log(processor.process('a:before {}').css) // outputs: a::before {}
console.log(processor.process('a::before {}').css) // outputs: a::before {}
```

## Options

`single`: Boolean
* `true` (default) if you want to move from double colon to colon for backwards compatibility
* `false` if you need double colons

`selectors`: `Array` of pseudo-element selectors to rewrite with single and double colons. Note that these values will be used in a regexp without escaping. Defaults to `['before','after','first-letter','first-line']`

example selectors:
```
var options = {
  selectors: [
    'hover',
    'focus',
    'active',
    'after',
    'ms-expand',
    'not',
    'first-child',
    'last-child'
  ],
};
```

### Defaults
```javascript
var options = {
  single: true,
  [
    'before',
    'after',
    'first-letter',
    'first-line'
  ]
};
```
