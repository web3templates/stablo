/**
 * @license Use of this source code is governed by an MIT-style license that
 * can be found in the LICENSE file at https://github.com/cartant/rxjs-etc
 */

import { EMPTY, merge, Observable, OperatorFunction } from "rxjs";
import { isEmpty, mergeMap, publish } from "rxjs/operators";

export function concatIfEmpty<T, D = T>(
  observable: Observable<D>
): OperatorFunction<T, D | T> {
  return (source) =>
    source.pipe(
      publish((sharedSource) =>
        merge(
          sharedSource,
          sharedSource.pipe(
            isEmpty(),
            mergeMap((empty) => (empty ? observable : EMPTY))
          )
        )
      )
    );
}
