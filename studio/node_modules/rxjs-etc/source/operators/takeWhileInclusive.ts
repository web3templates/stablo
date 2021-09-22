/**
 * @license Use of this source code is governed by an MIT-style license that
 * can be found in the LICENSE file at https://github.com/cartant/rxjs-etc
 */

import { concat, MonoTypeOperatorFunction, ReplaySubject } from "rxjs";
import { filter, multicast, take, takeWhile } from "rxjs/operators";

export function takeWhileInclusive<T>(
  predicate: (value: T) => boolean
): MonoTypeOperatorFunction<T> {
  // https://stackoverflow.com/a/44644237/6680611

  return (source) =>
    source.pipe(
      multicast(
        () => new ReplaySubject<T>(1),
        (sharedSource) =>
          concat(
            sharedSource.pipe(takeWhile(predicate)),
            sharedSource.pipe(
              take(1),
              filter((value) => !predicate(value))
            )
          )
      )
    );
}
