# mendoza-js

[![npm version](https://img.shields.io/npm/v/mendoza.svg?style=flat-square)](https://www.npmjs.com/package/mendoza)[![Build Status](https://img.shields.io/travis/sanity-io/mendoza-js/main.svg?style=flat-square)](https://travis-ci.org/sanity-io/mendoza-js)[![npm bundle size](https://img.shields.io/bundlephobia/minzip/mendoza?style=flat-square)](https://bundlephobia.com/result?p=mendoza)

[Mendoza](https://github.com/sanity-io/mendoza) decoder in TypeScript.

## Installation

```sh
$ npm install mendoza
// or
$ yarn add mendoza
```

## Usage

Basic example:

```typescript
import {applyPatch} from "mendoza"

let left = {…};
let patch = […];
let right = applyPatch(left, patch);
```

Incremental patcher:

```typescript
import {incremental} from "mendoza"

const {Value, rebaseValue, wrap, unwrap, getType, applyPatch} = incremental

// Create an empty initial version:
const ROOT = wrap(null, null);

// Input of patches:
let patches = […];

// `origin` can be whatever you want to identify where a change comes from:
let origin = 0;

// Reference to the latest version:
let value = ROOT;

// Rebasing is for maintaing history across deleted versions:
let rebaseTarget;

for (let patch of patches) {
  // Apply the patch:
  let newValue = applyPatch(value, patch, origin);

  // Rebase if needed:
  if (rebaseTarget) {
    newValue = rebaseValue(rebaseTarget, newValue);
  }

  // If the document was deleted, store the previous version so we can rebase:
  if (getType(newValue) === "null") {
    rebaseTarget = value;
  } else {
    rebaseTarget = null;
  }

  value = newValue;
  origin++;
}

// Return the final full object:
console.log(unwrap(value));
```

## License

MIT © [Sanity.io](https://www.sanity.io/)
