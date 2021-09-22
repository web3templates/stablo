/**
 * @license Use of this source code is governed by an MIT-style license that
 * can be found in the LICENSE file at https://github.com/cartant/rxjs-etc
 */

import { Observable } from "rxjs";
import { filter, map, share } from "rxjs/operators";

export function toggle<T>(
  source: Observable<T>
): [Observable<T>, Observable<T>];
export function toggle<T>(
  source: Observable<T>,
  states: 2
): [Observable<T>, Observable<T>];
export function toggle<T>(
  source: Observable<T>,
  states: 3
): [Observable<T>, Observable<T>, Observable<T>];
export function toggle<T>(
  source: Observable<T>,
  states: number
): Observable<T>[];
export function toggle<T>(
  source: Observable<T>,
  states: number = 2
): Observable<T>[] {
  const result: Observable<T>[] = [];
  const indexed = source.pipe(
    map((value, index) => [index, value] as [number, T]),
    share()
  );
  for (let state = 0; state < states; ++state) {
    result.push(
      indexed.pipe(
        filter(([index]) => index % states === state),
        map(([, value]) => value)
      )
    );
  }
  return result;
}
