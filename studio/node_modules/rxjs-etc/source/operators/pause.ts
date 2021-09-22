/**
 * @license Use of this source code is governed by an MIT-style license that
 * can be found in the LICENSE file at https://github.com/cartant/rxjs-etc
 */

import { MonoTypeOperatorFunction, Observable } from "rxjs";
import {
  filter,
  first,
  map,
  mergeMap,
  publishReplay,
  startWith,
} from "rxjs/operators";

// I found this pause operator hiding within a more complicated operator that
// Alex Okrushko had built and that we were discussing. Thanks, Alex.

export type PausedState = "paused" | "resumed";

export function pause<T>(
  notifier: Observable<PausedState>,
  initialState: PausedState = "resumed"
): MonoTypeOperatorFunction<T> {
  return (source) =>
    notifier.pipe(
      startWith(initialState),
      publishReplay(1, undefined, (published) =>
        source.pipe(
          mergeMap((value) =>
            published.pipe(
              filter((state) => state === "resumed"),
              first(),
              map(() => value)
            )
          )
        )
      )
    );
}
