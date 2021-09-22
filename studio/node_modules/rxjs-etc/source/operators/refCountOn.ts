/**
 * @license Use of this source code is governed by an MIT-style license that
 * can be found in the LICENSE file at https://github.com/cartant/rxjs-etc
 */

import {
  ConnectableObservable,
  MonoTypeOperatorFunction,
  Observable,
  SchedulerLike,
  Subscription,
  using,
} from "rxjs";

export function refCountOn<T>(
  scheduler: SchedulerLike
): MonoTypeOperatorFunction<T> {
  return (source: Observable<T>) => {
    const connectable: ConnectableObservable<T> = source as any;
    let count = 0;
    let subscription: Subscription | null = null;

    return using(
      () => {
        ++count;
        scheduler.schedule(() => {
          if (!subscription && count > 0) {
            subscription = connectable.connect();
          }
        });
        return {
          unsubscribe: () => {
            --count;
            scheduler.schedule(() => {
              if (subscription && count === 0) {
                subscription.unsubscribe();
                subscription = null;
              }
            });
          },
        };
      },
      () => source
    );
  };
}
