/**
 * @license Use of this source code is governed by an MIT-style license that
 * can be found in the LICENSE file at https://github.com/cartant/rxjs-etc
 */

import {
  ConnectableObservable,
  MonoTypeOperatorFunction,
  Observable,
  Subscription,
  using,
} from "rxjs";

export function refCountForever<T>(): MonoTypeOperatorFunction<T> {
  return (source: Observable<T>) => {
    const connectable: ConnectableObservable<T> = source as any;
    let subscription: Subscription | null = null;

    return using(
      () => {
        if (!subscription) {
          subscription = connectable.connect();
        }
        return {
          unsubscribe: () => {},
        };
      },
      () => source
    );
  };
}
