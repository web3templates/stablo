/**
 * @license Use of this source code is governed by an MIT-style license that
 * can be found in the LICENSE file at https://github.com/cartant/rxjs-etc
 */

import { Observable, queueScheduler } from "rxjs";
import { observeOn } from "rxjs/operators";

export function queue<T1>(s1: Observable<T1>): [Observable<T1>];
export function queue<T1, T2>(
  s1: Observable<T1>,
  s2: Observable<T2>
): [Observable<T1>, Observable<T2>];
export function queue<T1, T2, T3>(
  s1: Observable<T1>,
  s2: Observable<T2>,
  s3: Observable<T3>
): [Observable<T1>, Observable<T2>, Observable<T3>];
export function queue<T1, T2, T3, T4>(
  s1: Observable<T1>,
  s2: Observable<T2>,
  s3: Observable<T3>,
  s4: Observable<T4>
): [Observable<T1>, Observable<T2>, Observable<T3>, Observable<T4>];
export function queue<T1, T2, T3, T4, T5>(
  s1: Observable<T1>,
  s2: Observable<T2>,
  s3: Observable<T3>,
  s4: Observable<T4>,
  s5: Observable<T5>
): [
  Observable<T1>,
  Observable<T2>,
  Observable<T3>,
  Observable<T4>,
  Observable<T5>
];
export function queue<T1, T2, T3, T4, T5, T6>(
  s1: Observable<T1>,
  s2: Observable<T2>,
  s3: Observable<T3>,
  s4: Observable<T4>,
  s5: Observable<T5>,
  s6: Observable<T6>
): [
  Observable<T1>,
  Observable<T2>,
  Observable<T3>,
  Observable<T4>,
  Observable<T5>,
  Observable<T6>
];
export function queue<R = any>(...sources: Observable<any>[]): Observable<R>[];
export function queue(...sources: Observable<any>[]): Observable<any>[] {
  return sources.map((source) => source.pipe(observeOn(queueScheduler)));
}
