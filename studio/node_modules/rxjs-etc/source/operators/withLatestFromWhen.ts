/**
 * @license Use of this source code is governed by an MIT-style license that
 * can be found in the LICENSE file at https://github.com/cartant/rxjs-etc
 */

import {
  ConnectableObservable,
  from,
  Observable,
  ObservableInput,
  OperatorFunction,
  Subscription,
} from "rxjs";
import { publish, startWith, switchMap, withLatestFrom } from "rxjs/operators";

export function withLatestFromWhen<T, R>(
  flushSelector: () => Observable<any>
): OperatorFunction<T, R>;
export function withLatestFromWhen<T, T2>(
  o2: ObservableInput<T2>,
  flushSelector: () => Observable<any>
): OperatorFunction<T, [T, T2]>;
export function withLatestFromWhen<T, T2, T3>(
  o2: ObservableInput<T2>,
  o3: ObservableInput<T3>,
  flushSelector: () => Observable<any>
): OperatorFunction<T, [T, T2, T3]>;
export function withLatestFromWhen<T, T2, T3, T4>(
  o2: ObservableInput<T2>,
  o3: ObservableInput<T3>,
  o4: ObservableInput<T4>,
  flushSelector: () => Observable<any>
): OperatorFunction<T, [T, T2, T3, T4]>;
export function withLatestFromWhen<T, T2, T3, T4, T5>(
  o2: ObservableInput<T2>,
  o3: ObservableInput<T3>,
  o4: ObservableInput<T4>,
  o5: ObservableInput<T5>,
  flushSelector: () => Observable<any>
): OperatorFunction<T, [T, T2, T3, T4, T5]>;
export function withLatestFromWhen<T, T2, T3, T4, T5, T6>(
  o2: ObservableInput<T2>,
  o3: ObservableInput<T3>,
  o4: ObservableInput<T4>,
  o5: ObservableInput<T5>,
  o6: ObservableInput<T6>,
  flushSelector: () => Observable<any>
): OperatorFunction<T, [T, T2, T3, T4, T5, T6]>;
export function withLatestFromWhen<T, R>(
  array: ObservableInput<any>[],
  flushSelector: () => Observable<any>
): OperatorFunction<T, R>;
export function withLatestFromWhen<T, R>(
  ...observables: (ObservableInput<any> | (() => Observable<any>))[]
): OperatorFunction<T, R>;
export function withLatestFromWhen<T>(
  ...args: (ObservableInput<any> | (() => Observable<any>))[]
): OperatorFunction<T, any> {
  const flushSelector = args.pop() as () => Observable<any>;
  const observables = args as ObservableInput<any>[];
  return (source) =>
    new Observable<any>((subscriber) => {
      const publishedSource = publish<T>()(source) as ConnectableObservable<T>;
      const publishedObservables = observables.map(
        (o) => from(o).pipe(publish()) as ConnectableObservable<any>
      );
      const subscription = new Subscription();
      subscription.add(
        flushSelector()
          .pipe(
            startWith(undefined),
            switchMap(() =>
              publishedSource.pipe(withLatestFrom(...publishedObservables))
            )
          )
          .subscribe(subscriber)
      );
      publishedObservables.forEach((p) => subscription.add(p.connect()));
      subscription.add(publishedSource.connect());
      return subscription;
    });
}
