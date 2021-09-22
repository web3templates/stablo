/**
 * @license Use of this source code is governed by an MIT-style license that
 * can be found in the LICENSE file at https://github.com/cartant/rxjs-etc
 */

import { concat, defer, of, OperatorFunction, SchedulerLike } from "rxjs";

export function startWithDeferred<T, S = T>(
  factory: () => S,
  scheduler?: SchedulerLike
): OperatorFunction<T, S | T> {
  return (source) =>
    concat(
      defer(() => {
        const value = factory();
        return scheduler ? of(value, scheduler) : of(value);
      }),
      source
    );
}
