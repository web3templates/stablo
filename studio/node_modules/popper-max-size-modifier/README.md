# popper-max-size-modifier

A [Popper.js](https://popper.js.org) modifier to change the size of your popper
to fit it within the available viewport space.

## Installation

```bash
# With npm
npm i popper-max-size-modifier

# With Yarn
yarn add popper-max-size-modifier
```

## Demo

https://codesandbox.io/s/great-tesla-3roz7

## Usage

```js
import {createPopper} from '@popperjs/core';
import maxSize from 'popper-max-size-modifier';

// Create your own apply modifier that adds the styles to the state
const applyMaxSize = {
  name: 'applyMaxSize',
  enabled: true,
  phase: 'beforeWrite',
  requires: ['maxSize'],
  fn({state}) {
    // The `maxSize` modifier provides this data
    const {width, height} = state.modifiersData.maxSize;

    state.styles.popper = {
      ...state.styles.popper,
      maxWidth: `${width}px`,
      maxHeight: `${height}px`
    };
  }
};

createPopper(reference, popper, {
  modifiers: [maxSize, applyMaxSize]
});
```

Sometimes you may want the `flip` modifier to take precedence in cases where the
`maxSize` modifier will make the popper too small (e.g. a minimum acceptable
size):

```js
// Minimum acceptable size is 100px
`${Math.max(100, width)}px`;
`${Math.max(100, height)}px`;
```

## Options

All
[`detectOverflow` options](https://popper.js.org/docs/v2/utils/detect-overflow/#options)
can be passed.

```js
createPopper(reference, popper, {
  modifiers: [
    {
      ...maxSize,
      options: {
        boundary: customBoundaryElement,
        padding: 20
      }
    },
    applyMaxSize
  ]
});
```

## Contributing

The source is located in the root package at
[`src/modifiers/maxSize.js`](https://github.com/atomiks/popper.js/blob/master/src/modifiers/maxSize.js).
