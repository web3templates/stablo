/**
 * @license Use of this source code is governed by an MIT-style license that
 * can be found in the LICENSE file at https://github.com/cartant/rxjs-etc
 */
/*tslint:disable:no-unused-expression*/

import { marbles } from "rxjs-marbles";
import {
  bufferToggle,
  concatAll,
  switchMap,
  takeUntil,
  windowToggle,
} from "rxjs/operators";
import { toggle } from "./toggle";

// prettier-ignore
describe("toggle", () => {
  it(
    "should play nice with switchMap",
    marbles(m => {
      const source = m.hot("   ab-cd-ef-gh");
      const sourceSubs = [
        "                      --^--!-----",
        "                      --------^--"
      ];
      const notifier = m.hot(" --x--x--x--");
      const expected = "       ---cd----gh";

      const [on, off] = toggle(notifier);
      const destination = on.pipe(switchMap(() => source.pipe(takeUntil(off))));
      m.expect(destination).toBeObservable(expected);
      m.expect(source).toHaveSubscriptions(sourceSubs);
    })
  );

  it(
    "should play nice with bufferToggle",
    marbles(m => {
      const source = m.hot("   ab-cd-ef-gh");
      const sourceSubs = "     ^----------";
      const notifier = m.hot(" --x--x--x--");
      const expected = "       -----(cd)--";

      const [on, off] = toggle(notifier);
      const destination = source.pipe(
        bufferToggle(on, () => off),
        concatAll()
      );
      m.expect(destination).toBeObservable(expected);
      m.expect(source).toHaveSubscriptions(sourceSubs);
    })
  );

  it(
    "should play nice with windowToggle",
    marbles(m => {
      const source = m.hot("   ab-cd-ef-gh");
      const sourceSubs = "     ^----------";
      const notifier = m.hot(" --x--x--x--");
      const expected = "       ---cd----gh";

      const [on, off] = toggle(notifier);
      const destination = source.pipe(
        windowToggle(on, () => off),
        concatAll()
      );
      m.expect(destination).toBeObservable(expected);
      m.expect(source).toHaveSubscriptions(sourceSubs);
    })
  );

  it(
    "should support three states",
    marbles(m => {
      const notifier = m.hot(" abcdef");
      const e1 = "             a--d--";
      const e2 = "             -b--e-";
      const e3 = "             --c--f";

      const [t1, t2, t3] = toggle(notifier, 3);
      m.expect(t1).toBeObservable(e1);
      m.expect(t2).toBeObservable(e2);
      m.expect(t3).toBeObservable(e3);
    })
  );

  it(
    "should support four states",
    marbles(m => {
      const notifier = m.hot(" abcdef");
      const e1 = "             a---e-";
      const e2 = "             -b---f";
      const e3 = "             --c---";
      const e4 = "             ---d--";

      const [t1, t2, t3, t4] = toggle(notifier, 4);
      m.expect(t1).toBeObservable(e1);
      m.expect(t2).toBeObservable(e2);
      m.expect(t3).toBeObservable(e3);
      m.expect(t4).toBeObservable(e4);
    })
  );
});
