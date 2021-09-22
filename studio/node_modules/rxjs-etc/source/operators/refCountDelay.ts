/**
 * @license Use of this source code is governed by an MIT-style license that
 * can be found in the LICENSE file at https://github.com/cartant/rxjs-etc
 */

import {
  asapScheduler,
  ConnectableObservable,
  MonoTypeOperatorFunction,
  NEVER,
  Observable,
  SchedulerLike,
  Subject,
  Subscription,
  timer,
  using,
} from "rxjs";

import { scan, switchMap, tap } from "rxjs/operators";

export function refCountDelay<T>(
  duration: number,
  scheduler: SchedulerLike = asapScheduler
): MonoTypeOperatorFunction<T> {
  return (source: Observable<T>) => {
    // This implementation is based upon:
    // https://medium.com/@volkeron/rxjs-unsubscribe-delay-218a9ab2672e
    //
    // Which was based upon:
    // https://github.com/ReactiveX/rxjs/issues/171#issuecomment-131218605
    // https://github.com/ReactiveX/rxjs/issues/171#issuecomment-267881847

    const connectable: ConnectableObservable<T> = source as any;
    let connectableSubscription: Subscription | null = null;
    let connectorSubscription: Subscription | null = null;

    const notifier = new Subject<number>();
    const connector = notifier.pipe(
      scan((count, step) => count + step, 0),
      switchMap((count) => {
        if (count === 0) {
          return timer(duration, scheduler).pipe(
            tap(() => {
              if (connectableSubscription) {
                connectableSubscription.unsubscribe();
                connectableSubscription = null;
              }
              if (connectorSubscription) {
                connectorSubscription.unsubscribe();
                connectorSubscription = null;
              }
            })
          );
        }
        if (!connectableSubscription && count > 0) {
          return timer(0, scheduler).pipe(
            tap(() => {
              if (!connectableSubscription) {
                connectableSubscription = connectable.connect();
              }
            })
          );
        }
        return NEVER;
      })
    );

    return using(
      () => {
        if (!connectorSubscription) {
          connectorSubscription = connector.subscribe();
        }
        notifier.next(1);
        return { unsubscribe: () => notifier.next(-1) };
      },
      () => source
    );
  };
}

/** @deprecated Renamed to refCountDelay */
export const refCountAuditTime = refCountDelay;
