> Hooks and utilities for combining React with RxJS Observables

Features:

- Works well with Observables emitting values synchronously. You don't pay the re-render-on-mount tax.
- Lightweight. Implemented on top of a small React Hook based core.
- Full TypeScript support.

This package offers two slightly different utilities for working with RxJS and React:

- A set of utilities for creating _Reactive components_
- A set of React hooks for using with observables with React

Although they share a lot of similarities, and reactiveComponent is built on top of `useObservable` are not intended to be used together inside the same component as they represent two different programming styles.

---

- [Reactive components](https://react-rx.dev/guide#reactive-components)
- [Observable hooks](https://react-rx.dev/guide#observable-hooks)
- [Code examples](https://react-rx.dev/examples)
