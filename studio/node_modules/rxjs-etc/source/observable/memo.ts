/**
 * @license Use of this source code is governed by an MIT-style license that
 * can be found in the LICENSE file at https://github.com/cartant/rxjs-etc
 */

import { createResolver } from "memoize-resolver";
import { Observable, ReplaySubject } from "rxjs";
import { multicast, refCount } from "rxjs/operators";

export function memo<A extends any[], T>(
  func: (...args: A) => Observable<T>,
  memoize?: (
    func: (...args: any[]) => any,
    resolver: (...args: any[]) => string
  ) => (...args: any[]) => any
): (...args: A) => Observable<T> {
  const resolver = createResolver();
  return (memoize || defaultMemoize)(
    (...args: A) =>
      func(...args).pipe(multicast(new ReplaySubject<T>(Infinity)), refCount()),
    resolver
  );
}

function defaultMemoize(
  func: (...args: any[]) => any,
  resolver: (...args: any[]) => string
): (...args: any[]) => any {
  const map = new Map<string, any>();
  return (...args: any[]) => {
    const key = resolver(...args);
    if (map.has(key)) {
      return map.get(key);
    }
    const result = func(...args);
    map.set(key, result);
    return result;
  };
}
