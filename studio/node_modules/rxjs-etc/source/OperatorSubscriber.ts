/**
 * @license Use of this source code is governed by an MIT-style license that
 * can be found in the LICENSE file at https://github.com/cartant/rxjs-etc
 */

import { Subscriber } from "rxjs";

// @ts-ignore
const defaultComplete = Subscriber.prototype._complete;
// @ts-ignore
const defaultError = Subscriber.prototype._error;
// @ts-ignore
const defaultNext = Subscriber.prototype._next;

export class OperatorSubscriber<
  TSource,
  TDestination
> extends Subscriber<TSource> {
  constructor(
    destination: Subscriber<TDestination>,
    handlers: {
      next?: (value: TSource) => void;
      error?: (error: unknown) => void;
      complete?: () => void;
    }
  ) {
    super(destination);
    const { complete, error, next } = handlers;
    this._complete = complete
      ? () => {
          try {
            complete();
          } catch (caught: unknown) {
            destination.error(caught);
          }
          this.unsubscribe();
        }
      : defaultComplete;
    this._error = error
      ? (received) => {
          try {
            error(received);
          } catch (caught: unknown) {
            destination.error(caught);
          }
          this.unsubscribe();
        }
      : defaultError;
    this._next = next
      ? (value: TSource) => {
          try {
            next(value);
          } catch (caught: unknown) {
            destination.error(caught);
          }
        }
      : defaultNext;
  }
}
