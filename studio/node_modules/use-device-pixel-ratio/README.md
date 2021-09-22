# use-device-pixel-ratio

[![github status checks](https://badgen.net/github/checks/rexxars/use-device-pixel-ratio)](https://github.com/rexxars/use-device-pixel-ratio/actions) [![bundlephobia](https://badgen.net/bundlephobia/minzip/use-device-pixel-ratio)](https://bundlephobia.com/result?p=use-device-pixel-ratio)

`useDevicePixelRatio()` is a React hook (and utility) that will tell you what the current device has as its Device Pixel Ratio (DPR). The hook is reactive - if the browser window moves to a different display with a different DPR, it will update automatically. If you only need to get the DPR statically, there is a function (`getDevicePixelRatio()`) equivalent.

## Installing

```
npm i use-device-pixel-ratio
```

## Server rendering

When rendering on the server or in browsers that do not support the `devicePixelRatio` property, it will default to `1` unless overriden by using the `defaultDpr` option.

## Rounding/limiting

The hook (by default) both rounds and limits the DPR - it will round _down_ by default, and cap the number at `3`. In other words, you should by default only have three values returned: `1`, `2` or `3`. To allow larger DPRs, pass a higher number to the `maxDpr` option. To prevent rounding, pass `round: false`.

## Usage

**Default usage**

```jsx
import {useDevicePixelRatio} from 'use-device-pixel-ratio'

async function MyComponent() {
  const dpr = useDevicePixelRatio()
  return <img src={`https://my.image.host/file.jpg?dpr=${dpr}`}>
}
```

**Setting higher limit**

```jsx
import {useDevicePixelRatio} from 'use-device-pixel-ratio'

async function MyComponent() {
  const dpr = useDevicePixelRatio({maxDpr: 50})
  return <div>DPR is {dpr}</div>
}
```

**Getting the "raw" DPR**

```jsx
import {useDevicePixelRatio} from 'use-device-pixel-ratio'

async function MyComponent() {
  const dpr = useDevicePixelRatio({maxDpr: +Infinity, round: false})
  return <div>DPR is {dpr}</div>
}
```

**Setting the default DPR**

```jsx
import {useDevicePixelRatio} from 'use-device-pixel-ratio'

async function MyComponent() {
  const dpr = useDevicePixelRatio({defaultDpr: 2})

  // Actual device DPR if available, 2 otherwise
  return <div>DPR is {dpr}</div>
}
```

## Function usage

```ts
import {getDevicePixelRatio} from 'use-device-pixel-ratio'

console.log('Device pixel ratio is ', getDevicePixelRatio())

// Or, with options (same options as hook):
console.log('Device pixel ratio is ', getDevicePixelRatio({maxDpr: 5}))
```

## License

MIT © [Espen Hovlandsdal](https://espen.codes/)
