/**
 * @license Use of this source code is governed by an MIT-style license that
 * can be found in the LICENSE file at https://github.com/cartant/rxjs-etc
 */

import { MonoTypeOperatorFunction, SchedulerLike } from "rxjs";
import { debounceTime } from "rxjs/operators";
import { subsequent } from "./subsequent";

export function debounceTimeSubsequent<T>(
  duration: number,
  count: number,
  scheduler?: SchedulerLike
): MonoTypeOperatorFunction<T>;

export function debounceTimeSubsequent<T>(
  duration: number,
  scheduler?: SchedulerLike
): MonoTypeOperatorFunction<T>;

export function debounceTimeSubsequent<T>(
  duration: number,
  countOrScheduler?: number | SchedulerLike,
  scheduler?: SchedulerLike
): MonoTypeOperatorFunction<T> {
  let count: number;
  if (typeof countOrScheduler === "number") {
    count = countOrScheduler;
  } else {
    count = 1;
    scheduler = countOrScheduler;
  }
  return subsequent(count, debounceTime(duration, scheduler));
}
