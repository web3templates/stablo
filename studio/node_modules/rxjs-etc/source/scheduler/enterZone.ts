/**
 * @license Use of this source code is governed by an MIT-style license that
 * can be found in the LICENSE file at https://github.com/cartant/rxjs-etc
 */

import { queueScheduler, SchedulerLike } from "rxjs";
import { EnterZoneScheduler } from "./EnterZoneScheduler";
import { Zone } from "./Zone";

export function enterZone(
  zone: Zone,
  scheduler: SchedulerLike = queueScheduler
): SchedulerLike {
  return new EnterZoneScheduler(zone, scheduler) as any;
}
