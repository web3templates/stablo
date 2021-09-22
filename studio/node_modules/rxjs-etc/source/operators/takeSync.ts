/**
 * @license Use of this source code is governed by an MIT-style license that
 * can be found in the LICENSE file at https://github.com/cartant/rxjs-etc
 */

import { Observable, OperatorFunction } from "rxjs";

export function takeSync<T>(): OperatorFunction<T, T> {
  return (source) =>
    new Observable<T>((subscriber) => {
      const subscription = source.subscribe(subscriber);
      subscriber.complete();
      return subscription;
    });
}
