/**
 * @license Use of this source code is governed by an MIT-style license that
 * can be found in the LICENSE file at https://github.com/cartant/rxjs-etc
 */

import {
  concat,
  Observable,
  OperatorFunction,
  race,
  SchedulerLike,
  timer,
} from "rxjs";
import { mapTo, publish } from "rxjs/operators";

export function startWithTimeout<T, S = T>(
  value: S,
  duration: number | Date,
  scheduler?: SchedulerLike
): OperatorFunction<T, S | T> {
  if (duration === 0 && !scheduler) {
    return (source) =>
      new Observable<T | S>((subscriber) => {
        let nexted = false;
        const subscription = source.subscribe(
          (value) => {
            nexted = true;
            subscriber.next(value);
          },
          subscriber.error.bind(subscriber),
          subscriber.complete.bind(subscriber)
        );
        if (!nexted) {
          subscriber.next(value);
        }
        return subscription;
      });
  }
  return (source) =>
    source.pipe(
      publish((published) =>
        race(
          published,
          concat(timer(duration, scheduler).pipe(mapTo(value)), published)
        )
      )
    );
}
