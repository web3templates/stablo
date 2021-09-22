/**
 * @license Use of this source code is governed by an MIT-style license that
 * can be found in the LICENSE file at https://github.com/cartant/rxjs-etc
 */

import { concat, of, OperatorFunction } from "rxjs";
import { ignoreElements } from "rxjs/operators";

export function hasCompleted<T>(): OperatorFunction<T, boolean> {
  return (source) => concat(source.pipe(ignoreElements()), of(true));
}
