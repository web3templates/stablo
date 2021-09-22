/**
 * @license Use of this source code is governed by an MIT-style license that
 * can be found in the LICENSE file at https://github.com/cartant/rxjs-etc
 */
/*tslint:disable:no-unused-expression*/

import { expect } from "chai";
import { asyncScheduler, from, merge, of } from "rxjs";

import {
  bufferCount,
  concatMap,
  filter,
  mapTo,
  toArray,
  window,
} from "rxjs/operators";

import { marbles } from "rxjs-marbles";
import { materializeTo } from "./materializeTo";
import { prioritize } from "./prioritize";

// prettier-ignore
describe("prioritize", () => {
  it("should control the subscription order", () => {
    const source = of(1);
    const result = source.pipe(
      prioritize((first, second) =>
        merge(first.pipe(mapTo("first")), second.pipe(mapTo("second")))
      ),
      toArray()
    );
    return result
      .toPromise()
      .then(value => expect(value).to.deep.equal(["first", "second"]));
  });

  it("should support self notifications", () => {
    /*tslint:disable-next-line:deprecation*/
    const source = from("aabccdee", asyncScheduler);
    const result = source.pipe(
      prioritize((first, second) =>
        second.pipe(
          window(
            first.pipe(
              bufferCount(2, 1),
              filter(([previous, current]) => current !== previous)
            )
          ),
          concatMap(w => w.pipe(toArray())),
          toArray()
        )
      )
    );
    return result
      .toPromise()
      .then(value =>
        expect(value).to.deep.equal([
          ["a", "a"],
          ["b"],
          ["c", "c"],
          ["d"],
          ["e", "e"],
          []
        ])
      );
  });

  it("should support synchronous sources", () => {
    const source = from("aabccdee");
    const result = source.pipe(
      prioritize((first, second) =>
        second.pipe(
          window(
            first.pipe(
              bufferCount(2, 1),
              filter(([previous, current]) => current !== previous)
            )
          ),
          concatMap(w => w.pipe(toArray())),
          toArray()
        )
      )
    );
    return result
      .toPromise()
      .then(value =>
        expect(value).to.deep.equal([
          ["a", "a"],
          ["b"],
          ["c", "c"],
          ["d"],
          ["e", "e"],
          []
        ])
      );
  });

  it(
    "should unsubscribe from the source",
    marbles(m => {
      const source = m.cold("    -1-2-3----4--");
      const sourceSubs = "       ---^------!-----";

      const result = source.pipe(
        /*tslint:disable-next-line:deprecation*/
        prioritize(merge),
        filter(() => false)
      );

      const subscriber = m.hot(" ---a------------").pipe(materializeTo(result));
      const unsub = "            ----------!-----";
      const expected = "         ----------------";

      m.expect(subscriber, unsub).toBeObservable(expected);
      m.expect(source).toHaveSubscriptions(sourceSubs);
    })
  );
});
