/**
 * @license Use of this source code is governed by an MIT-style license that
 * can be found in the LICENSE file at https://github.com/cartant/rxjs-etc
 */
/*tslint:disable:rxjs-no-nested-subscribe*/

import { Observable, Observer, OperatorFunction, Subscription } from "rxjs";

interface Source<T> {
  completed: boolean;
  key: string;
  nexted: boolean;
  observable: Observable<T>;
  subscription?: Subscription;
  value?: T;
}

function combine<T>(
  sources: Source<T>[],
  observer: Observer<Record<string, T>>
): void {
  if (sources.every(({ nexted }) => nexted)) {
    observer.next(
      sources.reduce((acc, { key, value }) => ({ ...acc, [key]: value }), {})
    );
  }
}

export function combineLatestHigherOrderObject<T>(): OperatorFunction<
  Record<string, Observable<T>>,
  Record<string, T>
> {
  return (higherOrder) =>
    new Observable<Record<string, T>>((observer) => {
      let lasts: Source<T>[] = [];
      let nexts: Source<T>[] = [];
      let higherOrderCompleted = false;
      const higherOrderSubscription = new Subscription();
      higherOrderSubscription.add(
        higherOrder.subscribe(
          (observables) => {
            const subscribes: (() => void)[] = [];
            nexts = Object.keys(observables).map((key) => {
              const observable = observables[key];
              const index = lasts.findIndex(
                (last) => last.observable === observable && last.key === key
              );
              if (index !== -1) {
                const next = lasts[index];
                lasts.splice(index, 1);
                return next;
              }
              const next: Source<T> = {
                completed: false,
                key,
                nexted: false,
                observable,
              };
              subscribes.push(() => {
                if (higherOrderSubscription.closed) {
                  return;
                }
                next.subscription = next.observable.subscribe(
                  (value) => {
                    next.nexted = true;
                    next.value = value;
                    combine(nexts, observer);
                  },
                  (error) => observer.error(error),
                  () => {
                    next.completed = true;
                    if (
                      higherOrderCompleted &&
                      nexts.every(({ completed }) => completed)
                    ) {
                      observer.complete();
                    }
                  }
                );
                higherOrderSubscription.add(next.subscription);
              });
              return next;
            });
            lasts.forEach(({ subscription }) => {
              if (subscription) {
                subscription.unsubscribe();
              }
            });
            lasts = nexts;
            combine(nexts, observer);
            subscribes.forEach((subscribe) => subscribe());
          },
          (error) => observer.error(error),
          () => {
            if (lasts.every(({ completed }) => completed)) {
              observer.complete();
            }
            higherOrderCompleted = true;
          }
        )
      );
      return higherOrderSubscription;
    });
}
