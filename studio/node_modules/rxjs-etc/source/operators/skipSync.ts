/**
 * @license Use of this source code is governed by an MIT-style license that
 * can be found in the LICENSE file at https://github.com/cartant/rxjs-etc
 */

import { Observable, OperatorFunction } from "rxjs";

export function skipSync<T>(): OperatorFunction<T, T> {
  return (source) =>
    new Observable<T>((subscriber) => {
      let subscribed = false;
      const subscription = source.subscribe(
        (value) => subscribed && subscriber.next(value),
        subscriber.error.bind(subscriber),
        subscriber.complete.bind(subscriber)
      );
      subscribed = true;
      return subscription;
    });
}
