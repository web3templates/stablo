/**
 * @license Use of this source code is governed by an MIT-style license that
 * can be found in the LICENSE file at https://github.com/cartant/rxjs-etc
 */

import {
  concat,
  MonoTypeOperatorFunction,
  Observable,
  of,
  SchedulerLike,
} from "rxjs";

import {
  concatMap,
  delay,
  distinctUntilChanged,
  filter,
  publish,
  startWith,
  switchMap,
  take,
  takeUntil,
} from "rxjs/operators";

export function throttleAfter<T>(
  notifier: Observable<any>,
  duration: number,
  scheduler?: SchedulerLike
): MonoTypeOperatorFunction<T> {
  return (source: Observable<T>) =>
    source.pipe(
      publish((sharedSource) =>
        notifier.pipe(
          switchMap(() =>
            concat(of(true), delay<boolean>(duration, scheduler)(of(false)))
          ),
          startWith(false),
          distinctUntilChanged(),
          publish((sharedSignal: Observable<boolean>) =>
            sharedSignal.pipe(
              concatMap((signalled: boolean) =>
                signalled
                  ? sharedSource.pipe(
                      take(1),
                      takeUntil(
                        sharedSignal.pipe(
                          filter((signalled: boolean) => !signalled)
                        )
                      )
                    )
                  : sharedSource.pipe(
                      takeUntil(
                        sharedSignal.pipe(
                          filter((signalled: boolean) => signalled)
                        )
                      )
                    )
              )
            )
          )
        )
      )
    );
}
