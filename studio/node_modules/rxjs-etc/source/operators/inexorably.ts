/**
 * @license Use of this source code is governed by an MIT-style license that
 * can be found in the LICENSE file at https://github.com/cartant/rxjs-etc
 */
/*tslint:disable:deprecation no-use-before-declare*/

import {
  MonoTypeOperatorFunction,
  Notification,
  Observable,
  Operator,
  Subscriber,
  Subscription,
  TeardownLogic,
} from "rxjs";

/** @deprecated Use finalizeWithKind */
export function inexorably<T>(
  callback: (notification: Notification<T> | undefined) => void
): MonoTypeOperatorFunction<T> {
  return (source: Observable<T>) =>
    source.lift(new InexorablyOperator(callback));
}

/** @deprecated Use finalizeWithKind */
export const finalize = inexorably;

/*tslint:disable-next-line:no-unused-declaration*/
class InexorablyOperator<T> implements Operator<T, T> {
  constructor(
    private callback: (notification: Notification<T> | undefined) => void
  ) {}
  call(subscriber: Subscriber<T>, source: any): TeardownLogic {
    return source.subscribe(
      new InexorablySubscriber(subscriber, this.callback)
    );
  }
}

/*tslint:disable-next-line:no-unused-declaration*/
class InexorablySubscriber<T> extends Subscriber<T> {
  private notification: Notification<T> | undefined;
  constructor(
    destination: Subscriber<T>,
    callback: (notification: Notification<T> | undefined) => void
  ) {
    super(destination);
    this.add(new Subscription(() => callback(this.notification)));
  }
  complete(): void {
    this.notification = new Notification<T>("C");
    super.complete();
  }
  error(error: any): void {
    this.notification = new Notification<T>("E", undefined, error);
    super.error(error);
  }
}
