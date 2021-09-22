/**
 * @license Use of this source code is governed by an MIT-style license that
 * can be found in the LICENSE file at https://github.com/cartant/rxjs-etc
 */
/*tslint:disable:no-use-before-declare*/

import {
  MonoTypeOperatorFunction,
  Observable,
  Operator,
  SchedulerLike,
  Subscriber,
  TeardownLogic,
} from "rxjs";

export function unsubscribeOn<T>(
  scheduler: SchedulerLike,
  delay: number = 0
): MonoTypeOperatorFunction<T> {
  return (source: Observable<T>) =>
    source.lift(new UnsubscribeOnOperator<T>(scheduler, delay));
}

/*tslint:disable-next-line:no-unused-declaration*/
class UnsubscribeOnOperator<T> implements Operator<T, T> {
  constructor(private scheduler: SchedulerLike, private delay: number) {}
  call(subscriber: Subscriber<T>, source: any): TeardownLogic {
    return source.subscribe(
      new UnsubscribeOnSubscriber(subscriber, this.scheduler, this.delay)
    );
  }
}

/*tslint:disable-next-line:no-unused-declaration*/
class UnsubscribeOnSubscriber<T> extends Subscriber<T> {
  constructor(
    destination: Subscriber<T>,
    private scheduler: SchedulerLike,
    private delay: number
  ) {
    super(destination);
  }
  unsubscribe(): void {
    const { delay, scheduler } = this;
    scheduler.schedule(() => super.unsubscribe(), delay);
  }
}
