/**
 * @license Use of this source code is governed by an MIT-style license that
 * can be found in the LICENSE file at https://github.com/cartant/rxjs-etc
 */

import {
  asapScheduler,
  MonoTypeOperatorFunction,
  Observable,
  Subscription,
} from "rxjs";
import { OperatorSubscriber } from "../OperatorSubscriber";

export function debounceSync<T>(): MonoTypeOperatorFunction<T> {
  return (source) =>
    new Observable<T>((subscriber) => {
      let actionSubscription: Subscription | undefined;
      let actionValue: T | undefined;
      source.subscribe(
        new OperatorSubscriber(subscriber, {
          complete: () => {
            if (actionSubscription) {
              subscriber.next(actionValue);
            }
            subscriber.complete();
          },
          error: (error) => subscriber.error(error),
          next: (value) => {
            actionValue = value;
            if (!actionSubscription) {
              actionSubscription = asapScheduler.schedule(() => {
                subscriber.next(actionValue);
                actionSubscription = undefined;
              });
              subscriber.add(actionSubscription);
            }
          },
        })
      );
    });
}
