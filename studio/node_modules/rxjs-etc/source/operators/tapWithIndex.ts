/**
 * @license Use of this source code is governed by an MIT-style license that
 * can be found in the LICENSE file at https://github.com/cartant/rxjs-etc
 */

import { defer, MonoTypeOperatorFunction, noop, PartialObserver } from "rxjs";
import { tap } from "rxjs/operators";

export function tapWithIndex<T>(
  next?: (tuple: [T, number]) => void,
  error?: (error: any) => void,
  complete?: () => void
): MonoTypeOperatorFunction<T>;
export function tapWithIndex<T>(
  observer: PartialObserver<[T, number]>
): MonoTypeOperatorFunction<T>;
export function tapWithIndex<T>(
  nextOrObserver?:
    | ((tuple: [T, number]) => void)
    | PartialObserver<[T, number]>,
  error?: (error: any) => void,
  complete?: () => void
): MonoTypeOperatorFunction<T> {
  return (source) =>
    defer(() => {
      /*tslint:disable-next-line:no-unused-declaration*/
      let index = -1;
      let context: any;
      let handleNext: ([value, index]: [T, number]) => void;
      let handleError: (error: any) => void;
      let handleComplete: () => void;
      if (nextOrObserver && typeof nextOrObserver !== "function") {
        context = nextOrObserver;
        handleNext = nextOrObserver.next || noop;
        handleError = nextOrObserver.error || noop;
        handleComplete = nextOrObserver.complete || noop;
      } else {
        context = undefined;
        handleNext = nextOrObserver || noop;
        handleError = error || noop;
        handleComplete = complete || noop;
      }
      return source.pipe(
        tap(
          (value) => handleNext.call(context, [value, ++index]),
          (error) => handleError.call(context, error),
          () => handleComplete.call(context)
        )
      );
    });
}
