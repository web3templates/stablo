/**
 * @license Use of this source code is governed by an MIT-style license that
 * can be found in the LICENSE file at https://github.com/cartant/rxjs-etc
 */

import { concat, from, OperatorFunction, SchedulerLike } from "rxjs";
import { isScheduler } from "../util";

export function endWith<T, E1 = T>(
  v1: E1,
  scheduler?: SchedulerLike
): OperatorFunction<T, T | E1>;
export function endWith<T, E1 = T, E2 = T>(
  v1: E1,
  v2: E2,
  scheduler?: SchedulerLike
): OperatorFunction<T, T | E1 | E2>;
export function endWith<T, E1 = T, E2 = T, E3 = T>(
  v1: E1,
  v2: E2,
  v3: E3,
  scheduler?: SchedulerLike
): OperatorFunction<T, T | E1 | E2 | E3>;
export function endWith<T, E1 = T, E2 = T, E3 = T, E4 = T>(
  v1: E1,
  v2: E2,
  v3: E3,
  v4: E4,
  scheduler?: SchedulerLike
): OperatorFunction<T, T | E1 | E2 | E3 | E4>;
export function endWith<T, E1 = T, E2 = T, E3 = T, E4 = T, E5 = T>(
  v1: E1,
  v2: E2,
  v3: E3,
  v4: E4,
  v5: E5,
  scheduler?: SchedulerLike
): OperatorFunction<T, T | E1 | E2 | E3 | E4 | E5>;
export function endWith<T, E1 = T, E2 = T, E3 = T, E4 = T, E5 = T, E6 = T>(
  v1: E1,
  v2: E2,
  v3: E3,
  v4: E4,
  v5: E5,
  v6: E6,
  scheduler?: SchedulerLike
): OperatorFunction<T, T | E1 | E2 | E3 | E4 | E5 | E6>;
export function endWith<T, E = T>(
  ...args: (E | SchedulerLike)[]
): OperatorFunction<T, T | E>;
export function endWith<T, E>(
  ...args: (E | SchedulerLike)[]
): OperatorFunction<T, T | E> {
  let scheduler = args[args.length - 1] as SchedulerLike | null;
  if (isScheduler(scheduler)) {
    args.pop();
  } else {
    scheduler = null;
  }
  /*tslint:disable-next-line:deprecation*/
  return (source) => concat(source, from(args as E[], scheduler as any));
}
