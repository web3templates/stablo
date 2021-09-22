/**
 * @license Use of this source code is governed by an MIT-style license that
 * can be found in the LICENSE file at https://github.com/cartant/rxjs-etc
 */
/*tslint:disable:no-unused-expression*/

import { marbles } from "rxjs-marbles/mocha";
import { mergeHigherOrderArray } from "./mergeHigherOrderArray";

// prettier-ignore
describe("mergeHigherOrderArray", () => {
  it(
    "should combine cold observables",
    marbles(m => {
      const a = m.cold(" a--");
      const b = m.cold(" b--");
      const c = m.cold(" c--");
      const d = m.cold(" d--");
      const h = m.cold(" i----j----k", { i: [a, b], j: [a, c], k: [d, c] });
      const as = "       ^---------!";
      const bs = "       ^----!-----";
      const cs = "       -----^-----";
      const ds = "       ----------^";
      const expected = " (ab)-c----d";

      const combined = h.pipe(mergeHigherOrderArray());
      m.expect(combined).toBeObservable(expected);
      m.expect(a).toHaveSubscriptions(as);
      m.expect(b).toHaveSubscriptions(bs);
      m.expect(c).toHaveSubscriptions(cs);
      m.expect(d).toHaveSubscriptions(ds);
    })
  );

  it(
    "should combine hot observables",
    marbles(m => {
      const a = m.hot("  --a-----------");
      const b = m.hot("  ---b----------");
      const c = m.hot("  --------c-----");
      const d = m.hot("  ------------d-");
      const h = m.hot("  i-----j----k--", { i: [a, b], j: [a, c], k: [d, c] });
      const as = "       ^----------!--";
      const bs = "       ^-----!-------";
      const cs = "       ------^-------";
      const ds = "       -----------^--";
      const expected = " --ab----c---d-";

      const combined = h.pipe(mergeHigherOrderArray());
      m.expect(combined).toBeObservable(expected);
      m.expect(a).toHaveSubscriptions(as);
      m.expect(b).toHaveSubscriptions(bs);
      m.expect(c).toHaveSubscriptions(cs);
      m.expect(d).toHaveSubscriptions(ds);
    })
  );

  it(
    "should forward error notifications",
    marbles(m => {
      const a = m.hot("  --a-----------");
      const b = m.hot("  ---b----------");
      const c = m.hot("  --------#-----");
      const d = m.hot("  ------------d-");
      const h = m.hot("  i-----j----k--", { i: [a, b], j: [a, c], k: [d, c] });
      const as = "       ^-------!-----";
      const bs = "       ^-----!-------";
      const cs = "       ------^-!-----";
      const expected = " --ab----#-----";

      const combined = h.pipe(mergeHigherOrderArray());
      m.expect(combined).toBeObservable(expected);
      m.expect(a).toHaveSubscriptions(as);
      m.expect(b).toHaveSubscriptions(bs);
      m.expect(c).toHaveSubscriptions(cs);
    })
  );

  it(
    "should not emit initial empty sources",
    marbles(m => {
      const a = m.hot("  --------------");
      const b = m.hot("  --------------");
      const c = m.hot("  --------c-----");
      const d = m.hot("  ------------d-");
      const h = m.hot("  i-----j----k--", { i: [a, b], j: [a, c], k: [d, c] });
      const as = "       ^----------!--";
      const bs = "       ^-----!-------";
      const cs = "       ------^-------";
      const ds = "       -----------^--";
      const expected = " --------c---d-";

      const combined = h.pipe(mergeHigherOrderArray());
      m.expect(combined).toBeObservable(expected);
      m.expect(a).toHaveSubscriptions(as);
      m.expect(b).toHaveSubscriptions(bs);
      m.expect(c).toHaveSubscriptions(cs);
      m.expect(d).toHaveSubscriptions(ds);
    })
  );

  it(
    "should not emit later empty sources",
    marbles(m => {
      const a = m.hot("  --a-----------");
      const b = m.hot("  ---b----------");
      const c = m.hot("  --------------");
      const d = m.hot("  --------------");
      const h = m.hot("  i-----j----k--", { i: [a, b], j: [a, c], k: [d, c] });
      const as = "       ^----------!--";
      const bs = "       ^-----!-------";
      const cs = "       ------^-------";
      const ds = "       -----------^--";
      const expected = " --ab----------";

      const combined = h.pipe(mergeHigherOrderArray());
      m.expect(combined).toBeObservable(expected);
      m.expect(a).toHaveSubscriptions(as);
      m.expect(b).toHaveSubscriptions(bs);
      m.expect(c).toHaveSubscriptions(cs);
      m.expect(d).toHaveSubscriptions(ds);
    })
  );

  it(
    "should support duplicate sources",
    marbles(m => {
      const a = m.hot("  -a----a----");
      const h = m.hot("  i----------", { i: [a, a] });
      const as = [
        "                ^----------",
        "                ^----------"
      ];
      const expected = " -(aa)-(aa)-";

      const combined = h.pipe(mergeHigherOrderArray());
      m.expect(combined).toBeObservable(expected);
      m.expect(a).toHaveSubscriptions(as);
    })
  );

  it(
    "should not emit is the array of sources is empty",
    marbles(m => {
      const h = m.hot("  i--", { i: [] });
      const expected = " ---";
      const combined = h.pipe(mergeHigherOrderArray());
      m.expect(combined).toBeObservable(expected);
    })
  );

  it(
    "should not emit when a source is removed",
    marbles(m => {
      const a = m.hot("  --a----");
      const b = m.hot("  ----b--");
      const h = m.hot("  i----j-", { i: [a, b], j: [a] });
      const as = "       ^------";
      const bs = "       ^----!-";
      const expected = " --a-b--";

      const combined = h.pipe(mergeHigherOrderArray());
      m.expect(combined).toBeObservable(expected);
      m.expect(a).toHaveSubscriptions(as);
      m.expect(b).toHaveSubscriptions(bs);
    })
  );

  it(
    "should support adds and removes",
    marbles(m => {
      const a = m.cold(" a");
      const b = m.cold(" b");
      const h = m.hot("  i---j--k-", { i: [a], j: [a, b], k: [b] });
      const expected = " a---b----";

      const combined = h.pipe(mergeHigherOrderArray());
      m.expect(combined).toBeObservable(expected);
    })
  );
});
