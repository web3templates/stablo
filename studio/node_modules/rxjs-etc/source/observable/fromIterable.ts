/**
 * @license Use of this source code is governed by an MIT-style license that
 * can be found in the LICENSE file at https://github.com/cartant/rxjs-etc
 */

import { from, Observable } from "rxjs";

// https://github.com/ReactiveX/rxjs/issues/2306

export interface IterableLike<T> {
  [Symbol.iterator]: () => Iterator<T> | IterableIterator<T>;
}

export function fromIterable<T>(iterable: IterableLike<T>): Observable<T> {
  return from(iterable as any) as Observable<T>;
}
