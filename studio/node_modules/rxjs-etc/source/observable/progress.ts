/**
 * @license Use of this source code is governed by an MIT-style license that
 * can be found in the LICENSE file at https://github.com/cartant/rxjs-etc
 */

import { forkJoin, Observable, Subject } from "rxjs";
import { finalize, tap } from "rxjs/operators";
import { ObservableValues } from "../util";

export interface ProgressState {
  finalized: number;
  nexted: number;
  total: number;
}

export function progress<
  Observables extends Observable<any>[],
  SourceSelector extends (obervables: Observables) => Observable<any>,
  T
>(
  observables: Observables,
  resultSelector: (
    state: Observable<ProgressState>,
    source: ReturnType<SourceSelector>
  ) => Observable<T>,
  sourceSelector: SourceSelector
): Observable<T>;

export function progress<Observables extends Observable<any>[], T>(
  observables: Observables,
  resultSelector: (
    state: Observable<ProgressState>,
    source: Observable<ObservableValues<Observables>>
  ) => Observable<T>
): Observable<T>;

export function progress<
  Observables extends Observable<any>[],
  SourceSelector extends (obervables: Observables) => Observable<any>,
  T
>(
  observables: Observables,
  resultSelector: (
    state: Observable<ProgressState>,
    source: ReturnType<SourceSelector>
  ) => Observable<T>,
  sourceSelector?: SourceSelector
): Observable<T> {
  return new Observable((subscriber) => {
    let finalized = 0;
    let nexted = 0;
    const total = observables.length;
    const state = new Subject<ProgressState>();
    const shared = new Subject<any>();
    const source = (sourceSelector || forkJoin)(
      observables.map((o) =>
        o.pipe(
          tap(() =>
            state.next({
              finalized,
              nexted: ++nexted,
              total,
            })
          ),
          finalize(() => {
            state.next({
              finalized: ++finalized,
              nexted,
              total,
            });
            if (finalized === total) {
              state.complete();
            }
          })
        )
      ) as any
    );
    const result = resultSelector(state, shared as any);
    const subscription = result.subscribe(subscriber);
    subscription.add(source.subscribe(shared));
    return subscription;
  });
}
