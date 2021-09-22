/**
 * @license Use of this source code is governed by an MIT-style license that
 * can be found in the LICENSE file at https://github.com/cartant/rxjs-etc
 */
/*tslint:disable:deprecation no-use-before-declare*/

import {
  from,
  MonoTypeOperatorFunction,
  ObservableInput,
  Operator,
  Subscriber,
  Subscription,
  TeardownLogic,
} from "rxjs";
import { finalize } from "rxjs/operators";
import { CloseKind } from "../kinds";

export function deferFinalize<T>(
  callback: (kind: CloseKind) => ObservableInput<any>
): MonoTypeOperatorFunction<T> {
  return (source) => source.lift(new DeferFinalizeOperator(callback));
}

/*tslint:disable-next-line:no-unused-declaration*/
class DeferFinalizeOperator<T> implements Operator<T, T> {
  constructor(private callback: (kind: CloseKind) => ObservableInput<any>) {}
  call(subscriber: Subscriber<T>, source: any): TeardownLogic {
    return source.subscribe(
      new DeferFinalizeSubscriber(subscriber, this.callback)
    );
  }
}

/*tslint:disable-next-line:no-unused-declaration*/
class DeferFinalizeSubscriber<T> extends Subscriber<T> {
  private kind: CloseKind = "U";
  private subscription: Subscription | undefined = undefined;
  constructor(
    destination: Subscriber<T>,
    private callback: (kind: CloseKind) => ObservableInput<any>
  ) {
    super(destination);
  }
  complete(): void {
    this.kind = "C";
    this.defer(() => super.complete());
  }
  error(error: any): void {
    this.kind = "E";
    this.defer(() => super.error(error));
  }
  unsubscribe(): void {
    this.defer(() => super.unsubscribe());
  }
  defer(func: () => void): void {
    if (this.subscription) {
      this.subscription.add(func);
      return;
    }
    const subscription = new Subscription();
    this.subscription = subscription;
    subscription.add(func);
    const result = this.callback(this.kind);
    /*tslint:disable:rxjs-no-ignored-subscription*/
    from(result)
      .pipe(finalize(() => subscription.unsubscribe()))
      .subscribe();
  }
}
