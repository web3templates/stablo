# React JSON Inspector Component

![Component screenshot](http://i.imgur.com/8619dv9.png)

React-based JSON inspector that features tree expansion and fast search.

[Live demo](https://lapple.github.io/react-json-inspector/)

### Installation

    npm install react-json-inspector

### Usage

```jsx
var Inspector = require('react-json-inspector');
var data = { /* ... */ };

React.render(
    <Inspector data={ data } />,
    document.getElementById('inspector')
);
```

Make sure to include `json-inspector.css` in your stylesheet. Feel free to
override or amend default styles, for instance, when using a dark background.

### Run the example

```bash
cd /path/to/project
npm install
npm run watch
```

Then, visit http://localhost/path/to/project/example

### Properties

#### props.data

The only required propery, JSON object or array to inspect.

#### props.className

The class name to be added to the root component element.

#### props.search

Search bar component that accepts `onChange`, `data` and `query` properties.
Defaults to built-in search bar. Pass `false` to disable search.

#### props.searchOptions

Optional parameters for search (toolbar). Must be an object.

- `debounceTime`, wait time (ms) between search field `onChange` events before actually performing search. This can help provide a better user experience when searching larger data sets. Defaults to `0`.

#### props.query

Optional initial search query, defaults to an empty string.

#### props.interactiveLabel

Pass component factory that would receive the following properties:

- `value`, either stringified property value or key value that is being interacted with,
- `originalValue`, either the original property value or key value,
- `isKey`, boolean flag to differentiate between interacting with keys or properties,
- `keypath`, keypath of the node being interacted with, will be the same for keys and properties

Can be used to create custom input fields for JSON property names and primitive
values, see [#3](https://github.com/Lapple/react-json-inspector/issues/3)
for more information.

#### props.onClick

Callback to be run whenever any key-value pair is clicked. Receives an object
with `key`, `value` and `path` properties.

#### props.validateQuery

Function to check whether the entered search term is sufficient to query data.
Defaults to `(query) => query.length >= 2`.

#### props.isExpanded

Optional predicate that can determine whether the leaf node should be expanded
on initial render. Receives two arguments: `keypath` and `value`. Defaults to
`(keypath, query) => false`.

#### props.filterOptions

Optional parameters for filterer (search). Must be an object.

- `cacheResults`, Set to `false` to disable the filterer cache. This can sometimes provide performance enhancements with larger data sets. Defaults to `true`.
- `ignoreCase`, Set to `true` to enable case insensitivity in search. Defaults to `false`.

#### props.verboseShowOriginal

Set to `true` for full `showOriginal` expansion of children containing search term. Defaults to `false`.
