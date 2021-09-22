import {
  defer,
  from,
  Observable,
  ObservableInput,
  OperatorFunction,
  Subject,
} from "rxjs"
import {exhaustMap, finalize, throttle} from "rxjs/operators"

/**
 * Like exhaustMap, but also includes the trailing value emitted from the source observable while waiting for the preceding inner observable to complete
 *
 * Original code adapted from https://github.com/ReactiveX/rxjs/issues/5004
 * @param {function(value: T, ?index: number): ObservableInput} project A function
 * that, when applied to an item emitted by the source Observable, returns an
 * Observable.
 */
export function exhaustMapWithTrailing<T, R>(
  project: (value: T, index: number) => ObservableInput<R>
): OperatorFunction<T, R> {
  return (source): Observable<R> =>
    defer(() => {
      const release = new Subject<void>()
      return source.pipe(
        throttle(() => release, {
          leading: true,
          trailing: true,
        }),
        exhaustMap((value, index) =>
          from(project(value, index)).pipe(
            finalize(() => {
              release.next()
            })
          )
        )
      )
    })
}

/**
 * Like exhaustMap, but also includes the trailing value emitted from the source observable while waiting for the preceding inner observable to complete
 *
 * Original code adapted from https://github.com/ReactiveX/rxjs/issues/5004
 * @param {ObservableInput} innerObservable An Observable to replace each value from
 * the source Observable.
 */
export function exhaustMapToWithTrailing<T, R>(
  innerObservable: Observable<R>
): OperatorFunction<T, R> {
  return exhaustMapWithTrailing(() => innerObservable)
}
