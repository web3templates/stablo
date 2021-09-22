/**
 * @license Use of this source code is governed by an MIT-style license that
 * can be found in the LICENSE file at https://github.com/cartant/rxjs-etc
 */

import { OperatorFunction } from "rxjs";
import { pairwise, startWith } from "rxjs/operators";

export function pairwiseStartWith<T, S = T>(
  value: S
): OperatorFunction<T, [S | T, T]> {
  return (source) =>
    source.pipe(
      startWith(value),
      pairwise() as OperatorFunction<S | T, [S | T, T]>
    );
}
