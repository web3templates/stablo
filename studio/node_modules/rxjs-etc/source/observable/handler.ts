/**
 * @license Use of this source code is governed by an MIT-style license that
 * can be found in the LICENSE file at https://github.com/cartant/rxjs-etc
 */

import { observable, ObservableInput, OperatorFunction, Subject } from "rxjs";

export function handler<T>(): ((value: T) => void) & ObservableInput<T>;
export function handler<T, R = T>(
  operator: OperatorFunction<T, R>
): ((value: T) => void) & ObservableInput<R>;
export function handler<T, R>(
  operator?: OperatorFunction<T, R>
): ((value: T) => void) & ObservableInput<T | R> {
  const subject = new Subject<T>();
  const source = operator ? subject.pipe(operator) : subject;

  const next: any = (arg: T) => subject.next(arg);
  next[observable] = () => source;
  return next;
}
