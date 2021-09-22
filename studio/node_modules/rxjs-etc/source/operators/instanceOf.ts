/**
 * @license Use of this source code is governed by an MIT-style license that
 * can be found in the LICENSE file at https://github.com/cartant/rxjs-etc
 */

import { OperatorFunction } from "rxjs";
import { filter } from "rxjs/operators";

export function instanceOf<T, R extends T>(
  ctor: new (...args: any[]) => R
): OperatorFunction<T, R>;
export function instanceOf<
  T,
  R extends { [key: string]: new (...args: any[]) => T }
>(ctors: R): OperatorFunction<T, InstanceType<R[keyof R]>>;
export function instanceOf<T>(arg: any): OperatorFunction<T, any> {
  return typeof arg === "function"
    ? filter<any>((value) => value instanceof arg)
    : filter<any>((value) =>
        Object.keys(arg).some((key) => value instanceof arg[key])
      );
}
