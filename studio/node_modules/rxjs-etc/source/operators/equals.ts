/**
 * @license Use of this source code is governed by an MIT-style license that
 * can be found in the LICENSE file at https://github.com/cartant/rxjs-etc
 */

import { Observable, OperatorFunction } from "rxjs";
import { filter } from "rxjs/operators";

export function equals<T, U extends T>(predicate: U): OperatorFunction<T, U> {
  return (source: Observable<T>) =>
    source.pipe(filter((value: T): value is U => predicate === value));
}
