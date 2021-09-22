/**
 * @license Use of this source code is governed by an MIT-style license that
 * can be found in the LICENSE file at https://github.com/cartant/rxjs-etc
 */

import { from, ObservableInput, OperatorFunction } from "rxjs";
import { dematerialize, materialize, mergeMapTo } from "rxjs/operators";

export function materializeTo<T, I>(
  innerObservable: ObservableInput<I>
): OperatorFunction<T, I> {
  return (source) =>
    source.pipe(
      mergeMapTo(from(innerObservable).pipe(materialize())),
      dematerialize()
    );
}
