# [React](http://facebook.github.io/react/)-spinner

Zero configuration loading spinner.

[Live demo](https://rawgit.com/chenglou/react-spinner/master/example/index.html) from the example folder. (To build it locally, clone this repo, `npm install && npm start` then open http://localhost:3000/example/)

## install

Bower:
```sh
bower install react-spinner
```

Npm:
```sh
npm install react-spinner
```

Plain old script tag:
```html
<script src="path/to/react-spinner/build/index.js"></script>
```

(Compatible with CommonJS, e.g. Browserify.)

The CSS file:
```html
<link rel="stylesheet" type="text/css" href="path/to/react-spinner.css">
```

The spinner

## API

#### &lt;Spinner />
Adds the spinner, which centers itself based on its container's dimensions. If those are not predefined, simply manually center it by adding more style rules to the exposed `.react-spinner` class [here](https://github.com/chenglou/react-spinner/blob/master/react-spinner.css#L1-L7).

You can also override the `.react-spinner`'s `width` and `height` if you want a bigger or smaller spinner. Everything resizes correctly.

## License

MIT.
