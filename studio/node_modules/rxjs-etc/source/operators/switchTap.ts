/**
 * @license Use of this source code is governed by an MIT-style license that
 * can be found in the LICENSE file at https://github.com/cartant/rxjs-etc
 */

import {
  concat,
  from,
  MonoTypeOperatorFunction,
  ObservableInput,
  of,
} from "rxjs";
import { concatMap, ignoreElements, publish, takeUntil } from "rxjs/operators";

// This implementation does not mirror the source:
// https://github.com/angular/angular/blob/master/packages/router/src/operators/switch_tap.ts

export function switchTap<T>(
  next: (value: T) => ObservableInput<any>
): MonoTypeOperatorFunction<T> {
  return (source) =>
    source.pipe(
      publish((published) =>
        published.pipe(
          concatMap((value) =>
            concat(
              from(next(value)).pipe(ignoreElements(), takeUntil(published)),
              of(value)
            )
          )
        )
      )
    );
}
