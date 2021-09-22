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
  takeLast,
  takeUntil,
} from "rxjs/operators";

export function debounceAfter<T>(
  notifier: Observable<any>,
  duration: number,
  scheduler?: SchedulerLike
): MonoTypeOperatorFunction<T> {
  // https://stackoverflow.com/a/44257656/6680611

  return (source: Observable<T>) =>
    source.pipe(
      publish((sharedSource) =>
        notifier.pipe(
          switchMap(() =>
            concat(of(true), of(false).pipe(delay(duration, scheduler)))
          ),
          startWith(false),
          distinctUntilChanged(),
          publish((sharedSignal: Observable<boolean>) =>
            sharedSignal.pipe(
              concatMap((signalled: boolean) =>
                signalled
                  ? sharedSource.pipe(
                      takeUntil(
                        sharedSignal.pipe(
                          filter((signalled: boolean) => !signalled)
                        )
                      ),
                      takeLast(1)
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
