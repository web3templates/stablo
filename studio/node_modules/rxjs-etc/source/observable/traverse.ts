/**
 * @license Use of this source code is governed by an MIT-style license that
 * can be found in the LICENSE file at https://github.com/cartant/rxjs-etc
 */

import {
  concat,
  from,
  identity,
  MonoTypeOperatorFunction,
  noop,
  Observable,
  ObservableInput,
  of,
  OperatorFunction,
  Subject,
} from "rxjs";
import { expand, ignoreElements, mergeMap, tap } from "rxjs/operators";
import { OperatorSubscriber } from "../OperatorSubscriber";
import { NotificationQueue } from "./NotificationQueue";

export type TraverseElement<T, M> = {
  markers: ObservableInput<M>;
  values: ObservableInput<T>;
};
export type TraverseFactory<T, M> = (
  marker: M | undefined,
  index: number
) => Observable<TraverseElement<T, M>>;

export function traverse<T, M>(options: {
  concurrency?: number;
  factory: TraverseFactory<T, M>;
  notifier: Observable<any>;
}): Observable<T>;

export function traverse<T, M, R>(options: {
  concurrency?: number;
  factory: TraverseFactory<T, M>;
  operator: OperatorFunction<T, R>;
}): Observable<R>;

export function traverse<T, M>(options: {
  concurrency?: number;
  factory: TraverseFactory<T, M>;
}): Observable<T>;

// https://github.com/palantir/tslint/issues/3906

export function traverse<T, M, R>({
  concurrency = 1,
  factory,
  operator = identity,
  notifier,
}: {
  concurrency?: number;
  factory: TraverseFactory<T, M>;
  operator?: OperatorFunction<T, T | R>;
  notifier?: Observable<any>;
}): Observable<T | R> {
  return new Observable<T | R>((subscriber) => {
    let queue: NotificationQueue;
    let queueOperator: MonoTypeOperatorFunction<M | undefined>;

    if (notifier) {
      queue = new NotificationQueue(notifier);
      queueOperator = identity;
    } else {
      const subject = new Subject<void>();
      queue = new NotificationQueue(subject);
      queueOperator = (markers) => {
        subject.next();
        return markers;
      };
    }

    const destination = new Subject<T | R>();
    destination.subscribe(subscriber);
    subscriber.add(queue.connect());
    of(undefined)
      .pipe(
        expand(
          (marker: M | undefined) =>
            queue.pipe(
              mergeMap((index) =>
                factory(marker, index).pipe(
                  mergeMap(({ markers, values }) =>
                    concat(
                      from(values).pipe(
                        operator,
                        tap((value) => destination.next(value)),
                        ignoreElements()
                      ),
                      from(markers)
                    )
                  )
                )
              ),
              queueOperator
            ),
          concurrency
        )
      )
      .subscribe(
        new OperatorSubscriber(subscriber, {
          complete: () => destination.complete(),
          error: (error) => destination.error(error),
          next: noop,
        })
      );
  });
}
