/**
 * @license Use of this source code is governed by an MIT-style license that
 * can be found in the LICENSE file at https://github.com/cartant/rxjs-etc
 */

import { MonoTypeOperatorFunction, Notification } from "rxjs";
import { tap } from "rxjs/operators";

export function materializeTap<T>(
  next: (notification: Notification<T>) => void
): MonoTypeOperatorFunction<T> {
  return (source) =>
    source.pipe(
      tap({
        complete: () => next(new Notification("C")),
        error: (error) => next(new Notification("E", undefined, error)),
        next: (value) => next(new Notification("N", value)),
      })
    );
}
