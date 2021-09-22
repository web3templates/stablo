/**
 * @license Use of this source code is governed by an MIT-style license that
 * can be found in the LICENSE file at https://github.com/cartant/rxjs-etc
 */
/*tslint:disable:no-unused-expression*/

import { of, SchedulerAction, SchedulerLike, Subscription } from "rxjs";
import { marbles } from "rxjs-marbles";
import { reschedule } from "./reschedule";

// prettier-ignore
describe("reschedule", () => {
  it(
    "should reschedule to emit using the specified scheduler",
    marbles(m => {
      class MoreDelayScheduler implements SchedulerLike {
        constructor(private moreDelay: number) {}
        public now(): number {
          return m.scheduler.now();
        }
        public schedule<T>(
          work: (this: SchedulerAction<T>, state?: T) => void,
          delay: number = 0,
          state?: T
        ): Subscription {
          return m.scheduler.schedule(work, delay + this.moreDelay, state);
        }
      }

      const source = of("a", "b", "c", m.scheduler);
      const expected = m.cold("--a-b-(c|)");

      const destination = source.pipe(
        reschedule(new MoreDelayScheduler(m.time("--|")))
      );
      m.expect(destination).toBeObservable(expected);
    })
  );
});
