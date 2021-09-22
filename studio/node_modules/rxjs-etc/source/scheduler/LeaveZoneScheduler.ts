/**
 * @license Use of this source code is governed by an MIT-style license that
 * can be found in the LICENSE file at https://github.com/cartant/rxjs-etc
 */

import { SchedulerLike, Subscription } from "rxjs";
import { Zone } from "./Zone";

export class LeaveZoneScheduler {
  constructor(private zone: Zone, private scheduler: SchedulerLike) {}

  schedule(...args: any[]): Subscription {
    return this.zone.runOutsideAngular(() =>
      this.scheduler.schedule.apply(this.scheduler, args as any)
    );
  }
}
