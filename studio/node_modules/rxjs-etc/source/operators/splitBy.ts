/**
 * @license Use of this source code is governed by an MIT-style license that
 * can be found in the LICENSE file at https://github.com/cartant/rxjs-etc
 */

import { Observable, OperatorFunction, Subject } from "rxjs";
import { bucketBy } from "./bucketBy";

export function splitBy<T, S extends T>(
  predicate: (value: T, index: number) => value is S,
  subjectSelector?: () => Subject<T>
): OperatorFunction<T, [Observable<S>, Observable<Exclude<T, S>>]>;

export function splitBy<T>(
  predicate: (value: T, index: number) => boolean,
  subjectSelector?: () => Subject<T>
): OperatorFunction<T, [Observable<T>, Observable<T>]>;

export function splitBy<T>(
  predicate: (value: T, index: number) => boolean,
  subjectSelector: () => Subject<T> = () => new Subject<T>()
): OperatorFunction<T, [Observable<T>, Observable<T>]> {
  return bucketBy(
    2,
    (value, index) => (predicate(value, index) ? 0 : 1),
    subjectSelector
  ) as OperatorFunction<T, [Observable<T>, Observable<T>]>;
}
