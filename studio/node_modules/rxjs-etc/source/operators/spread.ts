/**
 * @license Use of this source code is governed by an MIT-style license that
 * can be found in the LICENSE file at https://github.com/cartant/rxjs-etc
 */

import { Observable, OperatorFunction } from "rxjs";

export function spread<T, R>(
  ...operations: OperatorFunction<any, any>[]
): OperatorFunction<T, R> {
  return (source: Observable<any>) =>
    operations.reduce((acc, operator) => acc.pipe(operator), source);
}
