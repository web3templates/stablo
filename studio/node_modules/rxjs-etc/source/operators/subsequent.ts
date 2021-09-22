/**
 * @license Use of this source code is governed by an MIT-style license that
 * can be found in the LICENSE file at https://github.com/cartant/rxjs-etc
 */

import {
  concat,
  MonoTypeOperatorFunction,
  Observable,
  OperatorFunction,
} from "rxjs";
import { publish, take } from "rxjs/operators";

export function subsequent<T, R>(
  count: number,
  operator: (source: Observable<T>) => Observable<R>
): OperatorFunction<T, T | R>;

export function subsequent<T>(
  count: number,
  operator: (source: Observable<T>) => Observable<T>
): MonoTypeOperatorFunction<T>;

export function subsequent<T, R>(
  operator: (source: Observable<T>) => Observable<R>
): OperatorFunction<T, T | R>;

export function subsequent<T>(
  operator: (source: Observable<T>) => Observable<T>
): MonoTypeOperatorFunction<T>;

export function subsequent<T, R>(
  countOrOperator: number | ((source: Observable<T>) => Observable<R>),
  operator?: (source: Observable<T>) => Observable<R>
): OperatorFunction<T, T | R> {
  let count: number;
  if (typeof countOrOperator === "number") {
    count = countOrOperator;
  } else {
    count = 1;
    operator = countOrOperator;
  }

  return (source) =>
    source.pipe(
      publish((published) =>
        concat(published.pipe(take(count)), published.pipe(operator!))
      )
    );
}
