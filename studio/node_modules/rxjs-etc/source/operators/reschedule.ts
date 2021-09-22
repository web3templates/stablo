/**
 * @license Use of this source code is governed by an MIT-style license that
 * can be found in the LICENSE file at https://github.com/cartant/rxjs-etc
 */

import {
  asapScheduler,
  MonoTypeOperatorFunction,
  of,
  SchedulerLike,
} from "rxjs";
import { concatMap } from "rxjs/operators";

export function reschedule<T>(
  scheduler: SchedulerLike = asapScheduler
): MonoTypeOperatorFunction<T> {
  return concatMap((value) => of(value, scheduler));
}
