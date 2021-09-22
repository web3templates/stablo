/**
 * @license Use of this source code is governed by an MIT-style license that
 * can be found in the LICENSE file at https://github.com/cartant/rxjs-etc
 */

import {
  ConnectableObservable,
  Observable,
  OperatorFunction,
  Subject,
  UnaryFunction,
} from "rxjs";
import { multicast } from "rxjs/operators";
import { CloseKind } from "../kinds";
import { finalizeWithKind } from "./finalizeWithKind";

export function multicastWithKind<T>(
  factory: (kind?: CloseKind, subject?: Subject<T>) => Subject<T>
): UnaryFunction<Observable<T>, ConnectableObservable<T>>;

export function multicastWithKind<T, R>(
  factory: (kind?: CloseKind, subject?: Subject<T>) => Subject<T>,
  selector: OperatorFunction<T, R>
): OperatorFunction<T, R>;

export function multicastWithKind<T, R>(
  factory: (kind?: CloseKind, subject?: Subject<T>) => Subject<T>,
  selector?: OperatorFunction<T, R>
): OperatorFunction<T, R> {
  return (source) => {
    let kind: CloseKind | undefined = undefined;
    let subject: Subject<T> | undefined = undefined;
    return source.pipe(
      finalizeWithKind((k) => (kind = k)),
      multicast(() => {
        subject = factory(kind, subject);
        kind = undefined;
        return subject;
      }, selector!)
    );
  };
}
