/**
 * @license Use of this source code is governed by an MIT-style license that
 * can be found in the LICENSE file at https://github.com/cartant/rxjs-etc
 */

import {
  ConnectableObservable,
  Observable,
  Observer,
  Subject,
  Subscription,
  zip,
} from "rxjs";

import { first, map, publish } from "rxjs/operators";

export class NotificationQueue extends Observable<number> {
  private _count = 0;
  private _indices: Subject<number>;
  private _notifications: ConnectableObservable<number>;

  constructor(notifier: Observable<any>) {
    super((observer: Observer<number>) => {
      const index = this._count++;
      const subscription = this._notifications
        .pipe(first((value) => value === index))
        .subscribe(observer);
      this._indices.next(index);
      return subscription;
    });

    this._indices = new Subject<number>();
    this._notifications = zip(notifier, this._indices).pipe(
      map(([, index]) => index),
      publish()
    ) as ConnectableObservable<number>;
  }

  connect(): Subscription {
    return this._notifications.connect();
  }
}
