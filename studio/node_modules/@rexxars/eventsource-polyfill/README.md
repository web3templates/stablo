# EventSource Polyfill

**Forked from [amvtek/EventSource](https://github.com/amvtek/EventSource)**. See [fork modification](#fork-modifications) for more details.

Provide polyfill to support EventSource in browser where it is not available.

> - Used in production
> - Tested in Internet Explorer 8 +
> - Tested in Android browser 2.1 +
> - [Documented][]
> - Run the [Browser test suite][]

## Installing

```bash
$ npm install @rexxars/eventsource-polyfill
```

## Usage (through bundler)

```js
const EventSource =
  typeof window !== 'undefined' && window.EventSource
    ? window.EventSource
    : require('@rexxars/eventsource-polyfill')

const es = new EventSource('/my-es-endpoint')
```

## Usage (drop-in script)

```html
<script src="https://unpkg.com/@rexxars/eventsource-polyfill"></script>
<script>
  var es = new EventSource('/my-es-endpoint')
</script>
```

## Fork modifications

- New package name: `@rexxars/eventsource-polyfill`
- UMD module definition - CommonJS, AMD and browser globals
- Fixed a few global variable leaks-
- Check for `window.location` before usage (fixes react native crashing)
- Stop dispatching events after closed

## License

MIT-licensed. See LICENSE.
