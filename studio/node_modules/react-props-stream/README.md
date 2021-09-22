# react-props-stream

Utility belt for RxJS streams and React

## API
### `withPropsStream` HOC
```
withPropsStream(
  ownerPropsToChildProps: Observable<object> | (props$: Observable<object>) => Observable<object>,
  BaseComponent: ReactElementType
): ReactComponent
```

Similar to [recompose/mapPropsStream](https://github.com/acdlite/recompose/blob/master/docs/API.md#mappropsstream)

#### Example: Component that displays an ever-increasing counter every second
```jsx
import {withPropsStream} from 'react-props-stream'
import {timer} from 'rxjs'
import {map} from 'rxjs/operators'

const numbers$ = timer(0, 1000).pipe(map(n => ({number: n})))

const MyStreamingComponent = withPropsStream(
  numbers$,
  props => <div>The number is {props.number}</div>
)
```

#### Example: Component that automatically fetches `props.url` when its value change

```jsx
import {createEventHandler} from 'react-props-stream'
import {map, distinctUntilChanged, switchMap} from 'rxjs/operators'

const FetchComponent = withPropsStream(
  props$ =>
    props$.pipe(
      map(props => props.url),
      distinctUntilChanged(),
      switchMap(url => fetch(url).then(response => response.text())),
      map(responseText => ({responseText}))
    ),
  props => <div>The result was: {props.responseText}</div>
)

// Usage
ReactDOM.render(<FetchComponent url="http://example.com" />, document.getElementById('myid'))
```

### `streamingComponent`
Similar to [recompose/componentFromStream](https://github.com/acdlite/recompose/blob/master/docs/API.md#mappropsstream)

###
```jsx
import {streamingComponent} from 'react-props-stream'
import {map, distinctUntilChanged, switchMap} from 'rxjs/operators'

const FetchComponent = streamingComponent<{url: string}>(props$ =>
  props$.pipe(
    map(props => props.url),
    distinctUntilChanged(),
    switchMap(url => fetch(url).then(response => response.text())),
    map(responseText => <div>The result was: {responseText}</div>)
  )
)
```

### `WithObservable` React component

```jsx
import {WithObservable} from 'react-props-stream'
import {timer} from 'rxjs'
import {map} from 'rxjs/operators'

const numbers$ = timer(0, 1000).pipe(map(n => ({number: n})))

function MyComponent(props)  {
  return (
    <WithObservable observable={numbers$}>
      {num => <div>The number is {num}</div>}
    </WithObservable>
  )
}
```

## More examples
See more examples here: https://github.com/sanity-io/react-props-stream/tree/master/examples

# Prior art
This is heavily inspired by [recompose](https://github.com/acdlite/recompose)
