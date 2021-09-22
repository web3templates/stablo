/**
 * @license Use of this source code is governed by an MIT-style license that
 * can be found in the LICENSE file at https://github.com/cartant/rxjs-etc
 */
/*tslint:disable:no-unused-expression*/

import { expect } from "chai";
import { concat, defer, NEVER, of, ReplaySubject } from "rxjs";
import { marbles } from "rxjs-marbles";
import { first, multicast, publish, toArray } from "rxjs/operators";
import { materializeTo } from "./materializeTo";
import { refCountDelay } from "./refCountDelay";

// prettier-ignore
describe("refCountDelay", () => {
  it(
    "should multicast to multiple observers and complete",
    marbles(m => {
      const source = m.cold("     -1-2-3----4-|");
      const sourceSubs = "        ^-----------!";

      const duration = m.time("--|");
      const refCounted = source.pipe(
        publish(),
        refCountDelay(duration, m.scheduler)
      );

      const subscriber1 = m.hot(" a            ").pipe(materializeTo(refCounted));
      const expected1 = "         -1-2-3----4-|";
      const subscriber2 = m.hot(" ----b        ").pipe(materializeTo(refCounted));
      const expected2 = "         -----3----4-|";
      const subscriber3 = m.hot(" --------c    ").pipe(materializeTo(refCounted));
      const expected3 = "         ----------4-|";

      m.expect(subscriber1).toBeObservable(expected1);
      m.expect(subscriber2).toBeObservable(expected2);
      m.expect(subscriber3).toBeObservable(expected3);
      m.expect(source).toHaveSubscriptions(sourceSubs);
    })
  );

  it(
    "should multicast an error to multiple observers",
    marbles(m => {
      const source = m.cold("     -1-2-3----4-#");
      const sourceSubs = "        ^-----------!";

      const duration = m.time("--|");
      const refCounted = source.pipe(
        publish(),
        refCountDelay(duration, m.scheduler)
      );

      const subscriber1 = m.hot(" a            ").pipe(materializeTo(refCounted));
      const expected1 = "         -1-2-3----4-#";
      const subscriber2 = m.hot(" ----b        ").pipe(materializeTo(refCounted));
      const expected2 = "         -----3----4-#";
      const subscriber3 = m.hot(" --------c    ").pipe(materializeTo(refCounted));
      const expected3 = "         ----------4-#";

      m.expect(subscriber1).toBeObservable(expected1);
      m.expect(subscriber2).toBeObservable(expected2);
      m.expect(subscriber3).toBeObservable(expected3);
      m.expect(source).toHaveSubscriptions(sourceSubs);
    })
  );

  it(
    "should disconnect after the specified duration once the last subscriber unsubscribes",
    marbles(m => {
      const source = m.cold("     -1-2-3----4-----");
      const sourceSubs = "        ---^----------! ";

      const duration = m.time("--|");
      const refCounted = source.pipe(
        publish(),
        refCountDelay(duration, m.scheduler)
      );

      const subscriber1 = m.hot(" ---a            ").pipe(materializeTo(refCounted));
      const unsub1 = "            ----------!     ";
      const expected1 = "         ----1-2-3--     ";
      const subscriber2 = m.hot(" -------b        ").pipe(materializeTo(refCounted));
      const unsub2 = "            ------------!   ";
      const expected2 = "         --------3----   ";

      m.expect(subscriber1, unsub1).toBeObservable(expected1);
      m.expect(subscriber2, unsub2).toBeObservable(expected2);
      m.expect(source).toHaveSubscriptions(sourceSubs);
    })
  );

  it(
    "should not disconnect if a subscription occurs within the duration",
    marbles(m => {
      const source = m.cold("     -1-2-3----4-5-------");
      const sourceSubs = "        ---^--------------! ";

      const duration = m.time("--|");
      const refCounted = source.pipe(
        publish(),
        refCountDelay(duration, m.scheduler)
      );

      const subscriber1 = m.hot(" ---a                ").pipe(materializeTo(refCounted));
      const unsub1 = "            ----------!         ";
      const expected1 = "         ----1-2-3--         ";
      const subscriber2 = m.hot(" -------b            ").pipe(materializeTo(refCounted));
      const unsub2 = "            ------------!       ";
      const expected2 = "         --------3----       ";
      const subscriber3 = m.hot(" --------------c     ").pipe(materializeTo(refCounted));
      const unsub3 = "            ----------------!   ";
      const expected3 = "         ---------------5-   ";

      m.expect(subscriber1, unsub1).toBeObservable(expected1);
      m.expect(subscriber2, unsub2).toBeObservable(expected2);
      m.expect(subscriber3, unsub3).toBeObservable(expected3);
      m.expect(source).toHaveSubscriptions(sourceSubs);
    })
  );

  it(
    "should reconnect if a subscription occurs after the duration",
    marbles(m => {
      const source = m.cold("     -1-2-3----4-5----------");
      const sourceSubs = [
        "                         ---^----------!        ",
        "                         -----------------^---! "
      ];

      const duration = m.time("--|");
      const refCounted = source.pipe(
        publish(),
        refCountDelay(duration, m.scheduler)
      );

      const subscriber1 = m.hot(" ---a                   ").pipe(materializeTo(refCounted));
      const unsub1 = "            ----------!            ";
      const expected1 = "         ----1-2-3--            ";
      const subscriber2 = m.hot(" -------b               ").pipe(materializeTo(refCounted));
      const unsub2 = "            ------------!          ";
      const expected2 = "         --------3----          ";
      const subscriber3 = m.hot(" -----------------c     ").pipe(materializeTo(refCounted));
      const unsub3 = "            -------------------!   ";
      const expected3 = "         ------------------1-   ";

      m.expect(subscriber1, unsub1).toBeObservable(expected1);
      m.expect(subscriber2, unsub2).toBeObservable(expected2);
      m.expect(subscriber3, unsub3).toBeObservable(expected3);
      m.expect(source).toHaveSubscriptions(sourceSubs);
    })
  );

  it("should support synchronous sources", () => {
    const source = of(1, 2, 3);
    const refCounted = source.pipe(
      publish(),
      refCountDelay(0),
      toArray()
    );
    return refCounted
      .toPromise()
      .then(value => expect(value).to.deep.equal([1, 2, 3]));
  });

  it("should support mutliple, synchronous subscriptions", () => {
    let subscribes = 0;
    const source = defer(() => {
      ++subscribes;
      return of(1, 2, 3);
    });

    const refCounted = source.pipe(
      publish(),
      refCountDelay(0),
      toArray()
    );
    return Promise.all([refCounted.toPromise(), refCounted.toPromise()]).then(
      () => expect(subscribes).to.equal(1)
    );
  });

  it(
    "should support a ReplaySubject",
    marbles(m => {
      const source = m.cold("     --(r|)------------------");
      const sourceSubs = [
        "                         ---^-!                  ",
        "                         -----------------^-!    "
      ];

      // Given a source that completes, concatenate NEVER so that the
      // completion of the source does not effect the unsubscription of the
      // ReplaySubject. Then use refCountDelay so that the ReplaySubject
      // remains subscribed and 'alive' for the specified duration - whilst
      // the ref count is zero. Use first, as the subscribers want the
      // replayed, first value from the source.
      //
      // This mechanism could be used to cache an HTTP response for a specific
      // duration - whether or not there are subscribers.

      const duration = m.time("-----|");
      const refCounted = source.pipe(
        s => concat(s, NEVER),
        multicast(() => new ReplaySubject(1)),
        refCountDelay(duration, m.scheduler),
        first()
      );

      const subscriber1 = m.hot(" ---a                    ").pipe(materializeTo(refCounted));
      const expected1 = "         -----(r|)               ";
      const subscriber2 = m.hot(" -------b                ").pipe(materializeTo(refCounted));
      const expected2 = "         -------(r|)             ";
      const subscriber3 = m.hot(" -----------------c      ").pipe(materializeTo(refCounted));
      const expected3 = "         -------------------(r|) ";

      m.expect(subscriber1).toBeObservable(expected1);
      m.expect(subscriber2).toBeObservable(expected2);
      m.expect(subscriber3).toBeObservable(expected3);
      m.expect(source).toHaveSubscriptions(sourceSubs);
    })
  );
});
