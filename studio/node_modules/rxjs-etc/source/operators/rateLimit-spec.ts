/**
 * @license Use of this source code is governed by an MIT-style license that
 * can be found in the LICENSE file at https://github.com/cartant/rxjs-etc
 */
/*tslint:disable:no-unused-expression*/

import { marbles } from "rxjs-marbles";
import { rateLimit } from "./rateLimit";

// prettier-ignore
describe("rateLimit", () => {
  it(
    "should emit synchronous pass-though values immediately",
    marbles(m => {
      const source = m.cold("   (ab)----|");
      const subs = "            ^-------!";
      const expected = m.cold(" (ab)----|");

      const period = m.time("------|");
      const destination = source.pipe(rateLimit(period, 2, m.scheduler));
      m.expect(destination).toBeObservable(expected);
      m.expect(source).toHaveSubscriptions(subs);
    })
  );

  it(
    "should emit consecutive pass-though values immediately",
    marbles(m => {
      const source = m.cold("   ab----|");
      const subs = "            ^-----!";
      const expected = m.cold(" ab----|");

      const period = m.time("------|");
      const destination = source.pipe(rateLimit(period, 2, m.scheduler));
      m.expect(destination).toBeObservable(expected);
      m.expect(source).toHaveSubscriptions(subs);
    })
  );

  it(
    "should delay excess synchronous values by the period",
    marbles(m => {
      const source = m.cold("   (abc)----|");
      const subs = "            ^--------!";
      const expected = m.cold(" (ab)--c--|");

      const period = m.time("------|");
      const destination = source.pipe(rateLimit(period, 2, m.scheduler));
      m.expect(destination).toBeObservable(expected);
      m.expect(source).toHaveSubscriptions(subs);
    })
  );

  it(
    "should delay excess consecutive values by the period",
    marbles(m => {
      const source = m.cold("   abc------|");
      const subs = "            ^--------!";
      const expected = m.cold(" ab----c--|");

      const period = m.time("------|");
      const destination = source.pipe(rateLimit(period, 2, m.scheduler));
      m.expect(destination).toBeObservable(expected);
      m.expect(source).toHaveSubscriptions(subs);
    })
  );

  it(
    "should delay excess synchronous values by the period even if the source completes",
    marbles(m => {
      const source = m.cold("   (abc)|");
      const subs = "            ^----!";
      const expected = m.cold(" (ab)--(c|)");

      const period = m.time("------|");
      const destination = source.pipe(rateLimit(period, 2, m.scheduler));
      m.expect(destination).toBeObservable(expected);
      m.expect(source).toHaveSubscriptions(subs);
    })
  );

  it(
    "should delay excess consecutive values by the period even if the source completes",
    marbles(m => {
      const source = m.cold("   abc|");
      const subs = "            ^--!";
      const expected = m.cold(" ab----(c|)");

      const period = m.time("------|");
      const destination = source.pipe(rateLimit(period, 2, m.scheduler));
      m.expect(destination).toBeObservable(expected);
      m.expect(source).toHaveSubscriptions(subs);
    })
  );

  it(
    "should delay excess synchronous values by several periods",
    marbles(m => {
      const source = m.cold("   (abcde)----------|");
      const subs = "            ^----------------!";
      const expected = m.cold(" (ab)----(cd)----e|");

      const period = m.time("--------|");
      const destination = source.pipe(rateLimit(period, 2, m.scheduler));
      m.expect(destination).toBeObservable(expected);
      m.expect(source).toHaveSubscriptions(subs);
    })
  );

  it(
    "should delay excess consecutive values by several periods",
    marbles(m => {
      const source = m.cold("   abcde------------|");
      const subs = "            ^----------------!";
      const expected = m.cold(" ab------(cd)----e|");

      const period = m.time("--------|");
      const destination = source.pipe(rateLimit(period, 2, m.scheduler));
      m.expect(destination).toBeObservable(expected);
      m.expect(source).toHaveSubscriptions(subs);
    })
  );
});
