/**
 * @license Use of this source code is governed by an MIT-style license that
 * can be found in the LICENSE file at https://github.com/cartant/rxjs-etc
 */

import { Observable, Subject } from "rxjs";
import { startWith, switchMap } from "rxjs/operators";

// https://stackoverflow.com/a/51147023/6680611

export function resettable<T, U extends any[]>(
  factory: (...args: U) => Subject<T>,
  ...args: U
): {
  readonly closed: boolean;
  readonly observable: Observable<T>;
  readonly subject: Subject<T>;
  reset(...args: U): void;
  unsubscribe(): void;
} {
  const resetter = new Subject<void>();
  const source = new Subject<T>();
  let destination = factory(...args);
  let subscription = source.subscribe(destination);
  return {
    reset(...args: U): void {
      subscription.unsubscribe();
      destination = factory(...args);
      subscription = source.subscribe(destination);
      resetter.next();
    },
    unsubscribe(): void {
      subscription.unsubscribe();
      /*tslint:disable:rxjs-no-subject-unsubscribe*/
      source.unsubscribe();
      /*tslint:enable:rxjs-no-subject-unsubscribe*/
    },
    get closed(): boolean {
      return subscription.closed;
    },
    get observable(): Observable<T> {
      return resetter.asObservable().pipe(
        startWith(null),
        switchMap(() => destination)
      );
    },
    get subject(): Subject<T> {
      return source;
    },
  };
}
