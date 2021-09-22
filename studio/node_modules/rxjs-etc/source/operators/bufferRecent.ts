/**
 * @license Use of this source code is governed by an MIT-style license that
 * can be found in the LICENSE file at https://github.com/cartant/rxjs-etc
 */

import { OperatorFunction } from "rxjs";
import { map, mapTo, scan } from "rxjs/operators";

export function bufferRecent<T>(count: number): OperatorFunction<T, T[]> {
  if (count < 1) {
    return (source) => source.pipe(mapTo([]));
  }
  if (count === 1) {
    return (source) => source.pipe(map((value) => [value]));
  }
  return (source) =>
    source.pipe(
      scan((acc: T[], value: T) => [...acc.slice(1 - count), value], [])
    );
}
