# React Click Outside

[![Build Status](https://travis-ci.org/kentor/react-click-outside.svg)](https://travis-ci.org/kentor/react-click-outside) [![npm](https://img.shields.io/npm/v/react-click-outside.svg)](https://www.npmjs.com/package/react-click-outside)

Enhance a React component with a Higher Order Component that provides click
outside detection.

**Note:** React 0.14 required for version >= 2.x. This assumes `react` and
`react-dom` is installed in your project. Continue using version 1.x for React
0.13 support.

**Note:** Use version >= 2.3.0 to get rid of `React.createClass`
warnings in React 15.5.

## Usage

Installation:

```
npm install react-click-outside
```

Some component that you wish to enhance with click outside detection:

```js
const createReactClass = require('create-react-class');
const enhanceWithClickOutside = require('react-click-outside');
const React = require('react');

const Dropdown = createReactClass({
  getInitialState() {
    return {
      isOpened: false,
    };
  },

  handleClickOutside() {
    this.toggle();
  },

  toggle() {
    this.setState({ isOpened: !this.state.isOpened });
  },

  render() {
    ...
  },
});

module.exports = enhanceWithClickOutside(Dropdown);
```

**Note:** There will be no error thrown if `handleClickOutside` is not
implemented.

### `wrappedRef` prop

Use the `wrappedRef` prop to get access to the wrapped component instance. For
example:

```js
// Inside a component's render method
<Dropdown
  wrappedRef={instance => { this.toggle = instance.toggle; }}
/>

// Now you can call toggle externally
this.toggle();
```

## Details

The `enhanceWithClickOutside` function wraps the provided component in another
component that registers a click handler on `document` for the event capturing
phase. Using the event capturing phase prevents elements with a click handler
that calls `stopPropagation` from cancelling the click event that would
eventually trigger the component's `handleClickOutside` function.

## Why not a mixin?

There are some mixins that provide click outside detection functionality, but
they prevent the component from implementing the  `componentDidMount` and
`componentWillUnmount` life cycle hooks. I recommend not using a mixin for this
case.

## Limitations

- IE9+ due to the usage of the event capturing phase.

## Not working on iOS?

If the `handleClickOutside` handler is not firing on iOS, try adding the
`cursor: pointer` css style to the `<body>` element. There are many ways to
achieve this, here is just one example:

```js
if ('ontouchstart' in document.documentElement) {
  document.body.style.cursor = 'pointer';
}
```

If your app already has a way for mobile detection (e.g. Modernizr), you may
want to use that instead.


See issue [#4][i] for a discussion.

## License

[MIT](LICENSE.txt)

[i]: https://github.com/kentor/react-click-outside/issues/4
