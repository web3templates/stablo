/**
 * @license Use of this source code is governed by an MIT-style license that
 * can be found in the LICENSE file at https://github.com/cartant/rxjs-etc
 */

import {
  ConnectableObservable,
  Observable,
  OperatorFunction,
  Subject,
  Subscription,
} from "rxjs";

import { publish } from "rxjs/operators";

export function prioritize<T, R = T>(
  selector: (
    prioritized: Observable<T>,
    deprioritized: Observable<T>,
    ...rest: Observable<T>[]
  ) => Observable<R>
): OperatorFunction<T, R> {
  return (source: Observable<T>) =>
    new Observable<R>((observer) => {
      const published = publish<T>()(source) as ConnectableObservable<T>;
      const subjects: Subject<T>[] = [];
      const subscription = new Subscription();
      const length = Math.max(selector.length, 2);
      for (let i = 0; i < length; ++i) {
        const subject = new Subject<T>();
        subjects.push(subject);
        subscription.add(published.subscribe(subject));
      }
      const [first, second, ...rest] = subjects;
      subscription.add(selector(first, second, ...rest).subscribe(observer));
      subscription.add(published.connect());
      return subscription;
    });
}
