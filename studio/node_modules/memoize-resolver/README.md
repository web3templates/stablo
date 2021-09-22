# memoize-resolver

## What is it?

`memoize-resolver` is a general purpose key resolver for use with a `memoize` implementation like the one in [Lodash](https://lodash.com/docs/#memoize).

## Why might you need it?

When you memoize a function that receives multiple argments, by default only the first argument is used as the cache key.

The key resolver implemented in `memoize-resolver` will create a key that's generated from all of the arguments received by the memoized function.

# Install

Install the package using NPM:

```
npm install memoize-resolver --save
```

And import the function for use with TypeScript or ES2015:

```
import { createResolver } from "memoize-resolver";
```

# Usage

```
const work = (state, props) => { /* something expensive */ };
const resolver = createResolver();
const memoizedWork = _.memoize(work, resolver);
```