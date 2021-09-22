/**
 * @license Use of this source code is governed by an MIT-style license that
 * can be found in the LICENSE file at https://github.com/cartant/rxjs-etc
 */

import { OperatorFunction } from "rxjs";
import { map } from "rxjs/operators";

export function indexElements<T>(): OperatorFunction<T, number>;
export function indexElements<T, R>(
  project: (value: T, index: number) => R
): OperatorFunction<T, R>;
export function indexElements<T>(
  project: (value: T, index: number) => any = (value, index) => index
): OperatorFunction<T, any> {
  return map<T, any>(project);
}
