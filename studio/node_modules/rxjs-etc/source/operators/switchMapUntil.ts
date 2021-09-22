/**
 * @license Use of this source code is governed by an MIT-style license that
 * can be found in the LICENSE file at https://github.com/cartant/rxjs-etc
 */

import { Observable, OperatorFunction } from "rxjs";
import { publish, switchMap, takeUntil } from "rxjs/operators";

// This is an operator that applies a time-based operator - like debounceTime -
// before a switchMap, but unsubscribes the projected observable as soon as the
// source emits another value. Inspired by:
// https://blog.strongbrew.io/building-a-safe-autocomplete-operator-with-rxjs/

export function switchMapUntil<T, I, R>(
  prelude: OperatorFunction<T, I>,
  project: (value: I, index: number) => Observable<R>
): OperatorFunction<T, R> {
  return (source) =>
    source.pipe(
      publish((shared) =>
        shared.pipe(
          prelude,
          switchMap((value, index) =>
            project(value, index).pipe(takeUntil(shared))
          )
        )
      )
    );
}
