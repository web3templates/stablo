/**
 * @license Use of this source code is governed by an MIT-style license that
 * can be found in the LICENSE file at https://github.com/cartant/rxjs-etc
 */

import { queueScheduler, SchedulerLike } from "rxjs";
import { LeaveZoneScheduler } from "./LeaveZoneScheduler";
import { Zone } from "./Zone";

export function leaveZone(
  zone: Zone,
  scheduler: SchedulerLike = queueScheduler
): SchedulerLike {
  return new LeaveZoneScheduler(zone, scheduler) as any;
}
