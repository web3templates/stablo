/**
 * @license Use of this source code is governed by an MIT-style license that
 * can be found in the LICENSE file at https://github.com/cartant/rxjs-etc
 */
/*tslint:disable:rxjs-no-unsafe-takeuntil*/

import {
  concat,
  from,
  MonoTypeOperatorFunction,
  NEVER,
  ObservableInput,
} from "rxjs";
import {
  exhaustMap,
  ignoreElements,
  mergeAll,
  publishReplay,
  takeUntil,
  toArray,
} from "rxjs/operators";
import { endWith } from "./endWith";

export function exhaustTap<T>(
  next: (value: T) => ObservableInput<any>
): MonoTypeOperatorFunction<T> {
  return (source) =>
    source.pipe(
      publishReplay(1, undefined, (published) =>
        published.pipe(
          exhaustMap((value) =>
            concat(published, NEVER).pipe(
              takeUntil(
                from(next(value)).pipe(ignoreElements(), endWith(null))
              ),
              toArray(),
              mergeAll()
            )
          )
        )
      )
    );
}
