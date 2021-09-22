# observable-callback

A small utility for simplified creation of callback functions that publishes the argument to an observable stream when called.

It's a small wrapper around [RxJS Subjects](https://rxjs.dev/api/index/class/Subject) that returns a tuple of the Subject as an observable and the subject's `next()` function

### Example:

```js
const [value$, onValue] = observableCallback()

value$.subscribe((value) => {
  // will print "Hello world!"
  console.log(value)
})

setTimeout(() => onValue("Hello world!"), 100)
```

### Example, passing an operator function:

```js
const [greeting$, onPlanet] = observableCallback((planet$) =>
  planet$.pipe(map((planet) => `Hello ${planet}!`))
)

greeting$.subscribe((greeting) => {
  // will print "Hello world!" after 100ms
  console.log(greeting)
})

setTimeout(() => onPlanet("world"), 100)
```

### When to use

Sometimes the only way to know when an event happens in different APIs is by providing a function that will be called at some later point.
Sometimes it makes sense represent calls to a function as an observable of its called arguments. One example of this can be event handlers in React:

```jsx
const [clicks$, onClick] = observableCallback()

clicks$.subscribe(() => {
  console.log("User clicked the button")
})

render(<button onClick={onClick}>Click me!</button>)
```

Another use case could be to provide an action stream, and a way of dispatching actions. For example, here's a simple router that exposes the current page as an observable stream, and a function to call in order to navigate to another page:

```jsx
// page.js
const [onNavigate$, onNavigate] = observableCallback()

export const currentPage$ = onNavigate$.pipe(
  switchMap((page) => {
    return loadPage(page)
  })
)

export const navigate = onNavigate

//... some other part of the application
function SomeComponent() {
  return <button onClick={() => navigate("page2")}>Go to page 2</button>
}
```

### When not to use

- If you you are using node-style callback APIs. You are probably better off using [bindNodeCallback](https://rxjs.dev/api/index/function/bindNodeCallback) instead.
- If you want resource disposal, e.g. cancellation or listener removal.

# API

```ts
function observableCallback<T>(): [Observable<T>, (argument: T) => void]
function observableCallback<T, K>(
  operator: OperatorFunction<T, K>
): [Observable<T>, (argument: T) => void]
```

# License

MIT
