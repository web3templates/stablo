# @sanity/ui

The Sanity UI components.

```sh
npm install @sanity/ui

# Install peer dependencies
npm install react react-dom styled-components
```

[![npm version](https://img.shields.io/npm/v/@sanity/ui.svg?style=flat-square)](https://www.npmjs.com/package/@sanity/ui)

## Usage

```jsx
import {Button, studioTheme, ThemeProvider} from '@sanity/ui'
import React from 'react'
import ReactDOM from 'react-dom'

ReactDOM.render(
  <ThemeProvider theme={studioTheme}>
    <Button text="Hello, world" />
  </ThemeProvider>,
  document.getElementById('root')
)
```

## License

MIT-licensed. See LICENSE.
