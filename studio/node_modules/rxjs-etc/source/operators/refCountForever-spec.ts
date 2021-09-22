/**
 * @license Use of this source code is governed by an MIT-style license that
 * can be found in the LICENSE file at https://github.com/cartant/rxjs-etc
 */
/*tslint:disable:no-unused-expression*/

import { marbles } from "rxjs-marbles";
import { publish } from "rxjs/operators";
import { materializeTo } from "./materializeTo";
import { refCountForever } from "./refCountForever";

// prettier-ignore
describe("refCountForever", () => {
  it(
    "should subscribe to the source once",
    marbles(m => {
      const source = m.cold("     -1-2-3----4--");
      const sourceSubs = "        ^------------";

      const published = source.pipe(
        publish(),
        refCountForever()
      );

      const subscriber1 = m.hot(" a            ").pipe(materializeTo(published));
      const expected1 = "         -1-2-3----4--";
      const subscriber2 = m.hot(" ----b        ").pipe(materializeTo(published));
      const expected2 = "         -----3----4--";
      const subscriber3 = m.hot(" --------c    ").pipe(materializeTo(published));
      const expected3 = "         ----------4--";

      m.expect(subscriber1).toBeObservable(expected1);
      m.expect(subscriber2).toBeObservable(expected2);
      m.expect(subscriber3).toBeObservable(expected3);
      m.expect(source).toHaveSubscriptions(sourceSubs);
    })
  );

  it(
    "should not unsubscribe on a ref count of zero",
    marbles(m => {
      const source = m.cold("     -1-2-3----4--");
      const sourceSubs = "        ^------------";

      const published = source.pipe(
        publish(),
        refCountForever()
      );

      const subscriber1 = m.hot(" a            ").pipe(materializeTo(published));
      const expected1 = "         -1-2-3----4--";
      const subscriber2 = m.hot(" ----b        ").pipe(materializeTo(published));
      const expected2 = "         -----3----4--";
      const subscriber3 = m.hot(" --------c    ").pipe(materializeTo(published));
      const expected3 = "         ----------4--";
      const unsub = "             ------------!";

      m.expect(subscriber1, unsub).toBeObservable(expected1);
      m.expect(subscriber2, unsub).toBeObservable(expected2);
      m.expect(subscriber3, unsub).toBeObservable(expected3);
      m.expect(source).toHaveSubscriptions(sourceSubs);
    })
  );

  it(
    "should unsubscribe on completion",
    marbles(m => {
      const source = m.cold("     -1-2-3----4-|");
      const sourceSubs = "        ^-----------!";

      const published = source.pipe(
        publish(),
        refCountForever()
      );

      const subscriber1 = m.hot(" a            ").pipe(materializeTo(published));
      const expected1 = "         -1-2-3----4-|";
      const subscriber2 = m.hot(" ----b        ").pipe(materializeTo(published));
      const expected2 = "         -----3----4-|";
      const subscriber3 = m.hot(" --------c    ").pipe(materializeTo(published));
      const expected3 = "         ----------4-|";

      m.expect(subscriber1).toBeObservable(expected1);
      m.expect(subscriber2).toBeObservable(expected2);
      m.expect(subscriber3).toBeObservable(expected3);
      m.expect(source).toHaveSubscriptions(sourceSubs);
    })
  );

  it(
    "should unsubscribe on error",
    marbles(m => {
      const source = m.cold("     -1-2-3----4-#");
      const sourceSubs = "        ^-----------!";

      const published = source.pipe(
        publish(),
        refCountForever()
      );

      const subscriber1 = m.hot(" a            ").pipe(materializeTo(published));
      const expected1 = "         -1-2-3----4-#";
      const subscriber2 = m.hot(" ----b        ").pipe(materializeTo(published));
      const expected2 = "         -----3----4-#";
      const subscriber3 = m.hot(" --------c    ").pipe(materializeTo(published));
      const expected3 = "         ----------4-#";

      m.expect(subscriber1).toBeObservable(expected1);
      m.expect(subscriber2).toBeObservable(expected2);
      m.expect(subscriber3).toBeObservable(expected3);
      m.expect(source).toHaveSubscriptions(sourceSubs);
    })
  );
});
