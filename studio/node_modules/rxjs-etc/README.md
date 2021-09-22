# rxjs-etc

[![GitHub License](https://img.shields.io/badge/license-MIT-blue.svg)](https://github.com/cartant/rxjs-etc/blob/master/LICENSE)
[![NPM version](https://img.shields.io/npm/v/rxjs-etc.svg)](https://www.npmjs.com/package/rxjs-etc)
[![Build status](https://img.shields.io/travis/cartant/rxjs-etc.svg)](http://travis-ci.org/cartant/rxjs-etc)
[![dependency status](https://img.shields.io/david/cartant/rxjs-etc.svg)](https://david-dm.org/cartant/rxjs-etc)
[![devDependency Status](https://img.shields.io/david/dev/cartant/rxjs-etc.svg)](https://david-dm.org/cartant/rxjs-etc#info=devDependencies)
[![peerDependency Status](https://img.shields.io/david/peer/cartant/rxjs-etc.svg)](https://david-dm.org/cartant/rxjs-etc#info=peerDependencies)

### What is it?

A bunch of observables and operators for RxJS.

### Why might you need it?

I created this package as a place to put additional RxJS observables, operators and methods. If you are looking for something that's not in the RxJS distribution, there might be something suitable in here - if you're lucky.

## Install

Install the package using NPM:

```sh
npm install rxjs-etc --save
```

## What's in it?

### `Observable` factories

* [combineLatestArray](./source/observable/combineLatestArray.ts), [concatArray](./source/observable/concatArray.ts), [forkJoinArray](./source/observable/forkJoinArray.ts), [mergeArray](./source/observable/mergeArray.ts), [zipArray](./source/observable/zipArray.ts)

    A bunch of static methods that behave in a predictable manner when passed empty arrays. Some of these are now redundant, but some aren't.

    To see how these methods behave, consult their tests.

* [combineLatestHigherOrderArray](./source/observable/combineLatestHigherOrderArray.ts), [combineLatestHigherOrderObject](./source/observable/combineLatestHigherOrderObject.ts)

    Higher-order variants of `combineLatestArray` - that takes `Observable<Observable<T>[]>` and returns `Observable<T[]>` - and `combineLatestObject`.

* [combineLatestObject](./source/observable/combineLatestObject.ts), [forkJoinObject](./source/observable/forkJoinObject.ts), [zipObject](./source/observable/zipObject.ts)

    Like the array versions, but these take objects. Observable properties are combined using either `combineLatest`, `forkJoin` or `zip`.

* [forkJoinConcurrent](./source/observable/forkJoinConcurrent.ts)

    Like `forkJoin` but only runs the specified number of observables concurrently.

* [mergeHigherOrderArray](./source/observable/mergeHigherOrderArray.ts)

    Higher-order variant of `mergeArray` - that takes `Observable<Observable<T>[]>` and returns `Observable<T>`.

* [toggle](./source/observable/toggle.ts)

    Splits a notifier into two or more states and between which notifications are toggled.

* [traverse](./source/observable/traverse.ts)

    Based on `expand`. Traverses a graph - with backpressure control - using either a notifier or a consumer.

* [zipPadded](./source/observable/zipPadded.ts)

    Works like `zipArray`, but if some sources complete whilst others continue to emit values, those the complete are 'padded' with the specified `padValue` (which defaults to `undefined`).

* [percolate](./source/observable/percolate.ts)

    Runs a sequence of observables in order until an observable completes successfully.

### Functions for use with `pipe` or `let`

A bunch of functions that can be passed to the `let` operator. Use them like this:

```ts
source.let(endWith("this is the end"))
```

They can also be used with `pipe`, like this:

```ts
source.pipe(endWith("this is the end"))
```

* [bucketBy](./source/operators/bucketBy.ts)

    Uses a hash function to put values from an observable stream into buckets - which are themselves observable streams. See `splitBy`.

* [bufferRecent](./source/operators/bufferRecent.ts)

    Buffers the specified number of most-recent values.

* [concatIfEmpty](./source/operators/concatIfEmpty.ts)

    Like `defaultIfEmpty`, but it takes a default observable instead of a default value.

* [concatMapEager](./source/operators/concatMapEager.ts)

    Like the RxJava `concatMapEager` operator. It accepts a concurrency and eagerly subscribes to its inner observables, buffering their values and then emitting them in the `concatMap` order.

* [continueWith](./source/operators/continueWith.ts)

    Mirrors the source, but sends the _last_ received value to a project function and merges the `ObservableInput` that it returns.

* [debounceAfter](./source/operators/debounceAfter.ts)

    Debounce the source observable, but only after the notifier emits a value.

* [debounceSync](./source/operators/debounceSync.ts)

    Debounces synchronously emitted values from a source.

* [debounceTimeSubsequent](./source/operators/debounceTimeSubsequent.ts)

    Debounce the source observable, but don't debounce the first `count` notifications - only the subsequent notifications.

* [debounceTimeWithinReason](./source/operators/debounceTimeWithinReason.ts)

    Like `debounceTime`, but with an additional duration to ensure some notifications are emitted for super-busy streams.

* [delayUntil](./source/operators/delayUntil.ts)

    Delays a source's value notifications until a signal is received from a notifier.

* [dispose](./source/operators/dispose.ts)

    Like `finalize`, but calls a child subscription's callback for its parent's.

* [endWith](./source/operators/endWith.ts)

    Like `startWith`, but for the other end.

* [equals](./source/operators/equals.ts)

    Like `filter`, but takes a value - rather than a function - and performs a reference equality check.

* [guard](./source/operators/guard.ts)

    Applies the specified TypeScript guard to change the source observable's type and perform a runtime check. Emits an error notification if the guard rejects a value.

* [hasCompleted](./source/operators/hasCompleted.ts)

    Emits `true` when the source observable completes.

* [indexElements](./source/operators/indexElements.ts)

    Like `map((value, index) => index)` when it's called without a selector. When called with a selector, it's just an alias for `map`.

* [inexorably](./source/operators/inexorably.ts)

    Like `finalize` (which is also exported as an alias), but passes the callback the `Notification` that effected the teardown, or `undefined` if explicitly unsubscribed.

* [initial](./source/operators/initial.ts)

    Apply the operator to the source observable, but select only the initial `count` notifications - don't select the subsequent notifications.

* [pairwiseStartWith](./source/operators/pairwiseStartWith.ts)

    Like a combination of `startWith` and `pairwise`, but with more specific typings.

* [pluck](./source/operators/pluck.ts)

    Like `pluck`, but it's type-safe and only lets you valid keys. And it returns the appropriate type.

* [prioritize](./source/operators/prioritize.ts)

    When creating signals from a source observable - for use with operators that take a notifier, like `buffer` and `window` - the order in which subscriptions are made is important. `prioritize` can be used to ensure that the notifier subscribes to the source first.

* [rateLimit](./source/operators/rateLimit.ts)

    A rate limiter with pass through when waiting is not necessary.

* [refCountDelay](./source/operators/refCountDelay.ts)

    Can be used with a `ConnectableObservable` instead of `refCount`. When the reference count drops to zero, it waits the specified duration and then if the reference count is zero, it unsubscribes. If the reference count is incremented within the duration, no unsubscription occurs.

* [refCountForever](./source/operators/refCountForever.ts)

    Somewhat like the change that was made to `shareReplay` in [`5.5.0.beta.4`](https://github.com/ReactiveX/rxjs/blob/master/CHANGELOG.md#550-beta4-2017-10-06). When first subscribed to, a subscription is made to the source, but the source is never explicitly unsubscribed from. Unsubscription from the source only occurs if the source completes or errors.

* [refCountOn](./source/operators/refCountOn.ts)

    Like `refCount`, but performs connections and unsubscriptions on the specified scheduler.

* [reschedule](./source/operators/reschedule.ts)

    Emits values using the specified scheduler.

* [skipSync](./source/operators/skipSync.ts)

    Skips the initial, synchronously emitted values from a source.

* [splitBy](./source/operators/splitBy.ts)

    Splits an observable stream into two streams. Values that satisfy a predicate are fed into the first stream and values that don't are fed into the second. It's a (better) replacement for `partition` - which did not multicast the source. See `bucketBy` for the general case of splitting a stream into a specific number of 'buckets'.

* [startWithTimeout](./source/operators/startWithTimeout.ts)

    Like `startWith` but only emits the starting value if the source does not emit within the specified duration.

* [subsequent](./source/operators/subsequent.ts)

    Apply the operator to the source observable, but don't select the first `count` notifications - only the subsequent notifications.

* [takeSync](./source/operators/takeSync.ts)

    Takes the initial, synchronously emitted values from a source and then completes.

* [takeWhileInclusive](./source/operators/takeWhileInclusive.ts)

    Like `takeWhile`, but the value that fails the predicate is taken.

* [tapSubscribe](./source/operators/tapSubscribe.ts)

    Like [`tap`](https://github.com/ReactiveX/rxjs/blob/5.5.2/src/operators/tap.ts#L54-L60), but for subscriptions and unsubscriptions instead of notifications.

* [tapWithIndex](./source/operators/tapWithIndex.ts)

    Like [`tap`](https://github.com/ReactiveX/rxjs/blob/5.5.2/src/operators/tap.ts#L54-L60), but it receives a tuple that includes the emitted value and the index.

* [throttleAfter](./source/operators/throttleAfter.ts)

    Throttle the source observable, but only after the notifier emits a value.

* [unsubscribeOn](./source/operators/unsubscribeOn.ts)

    Like `subscribeOn`, but for unsubscription.

### Utility functions

A bunch of utility functions that do what their names suggest:

* [isNulled/isNonNulled](./source/util.ts)

    `isNulled` returns `true` if a value is `null` or `undefined`.

* [isObservable](./source/util.ts)
* [isScheduler](./source/util.ts)
