# json-reduce

## Reduce a json tree by visiting each node

## Example
```js
import reduce from 'reduce-tree'

const document = {
  first: 1,
  second: 2,
  deep: {
    array: [3, 4, 5, 6],
    seven: 7
  }
}

const result = reduce(
  document,
  (acc, value, path) => (typeof value === 'number' ? acc + value : acc),
  0
)

console.log(result)
//=> 28
```

## API
```
reduce(value, callback, initialValue)
````

`callback` is the function to execute for each node in the tree, and is given three arguments:

  - `accumulator` - The accumulation of the callback's return values; it is the value returned 
  from the previous invocation of the callback, or `initialValue`.
  - `value` - The current node being traversed
  - `path` - The "dot-path" to the current node being traversed, e.g. `['deep', 'array', 2]`

## Gotchas / Limitations
- No circular reference detection and handling
- Traverses the whole tree
- Assumes a data structure that consists of valid JSON data types only. No special handling of Set, Map, etc.