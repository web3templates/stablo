/**
 * @license Use of this source code is governed by an MIT-style license that
 * can be found in the LICENSE file at https://github.com/cartant/rxjs-etc
 */
/*tslint:disable:no-unused-expression*/

import { marbles } from "rxjs-marbles/mocha";
import { combineLatestHigherOrderArray } from "./combineLatestHigherOrderArray";

// prettier-ignore
describe("combineLatestHigherOrder", () => {
  it(
    "should combine cold observables",
    marbles(m => {
      const a = m.cold("        a--");
      const b = m.cold("        b--");
      const c = m.cold("        c--");
      const d = m.cold("        d--");
      const h = m.cold("        ijk", { i: [a, b], j: [a, c], k: [d, c] });
      const as = "              ^-!";
      const bs = "              ^!-";
      const cs = "              -^-";
      const ds = "              --^";
      const expected = m.cold(" xyz", { x: ["a", "b"], y: ["a", "c"], z: ["d", "c"] });

      const combined = h.pipe(combineLatestHigherOrderArray());
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
      const a = m.hot("         --a------");
      const b = m.hot("         ---b-----");
      const c = m.hot("         ------c--");
      const d = m.hot("         --------d");
      const h = m.hot("         i---j--k-", { i: [a, b], j: [a, c], k: [d, c] });
      const as = "              ^------!-";
      const bs = "              ^---!----";
      const cs = "              ----^----";
      const ds = "              -------^-";
      const expected = m.cold(" ---x--y-z", { x: ["a", "b"], y: ["a", "c"], z: ["d", "c"] });

      const combined = h.pipe(combineLatestHigherOrderArray());
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
      const a = m.hot("         --a------");
      const b = m.hot("         ---b-----");
      const c = m.hot("         ------#--");
      const d = m.hot("         --------d");
      const h = m.hot("         i---j--k-", { i: [a, b], j: [a, c], k: [d, c] });
      const as = "              ^-----!--";
      const bs = "              ^---!----";
      const cs = "              ----^-!--";
      const expected = m.cold(" ---x--#--", { x: ["a", "b"] });

      const combined = h.pipe(combineLatestHigherOrderArray());
      m.expect(combined).toBeObservable(expected);
      m.expect(a).toHaveSubscriptions(as);
      m.expect(b).toHaveSubscriptions(bs);
      m.expect(c).toHaveSubscriptions(cs);
    })
  );

  it(
    "should not emit initial empty sources",
    marbles(m => {
      const a = m.hot("         ---------");
      const b = m.hot("         ---------");
      const c = m.hot("         ------c--");
      const d = m.hot("         --------d");
      const h = m.hot("         i---j--k-", { i: [a, b], j: [a, c], k: [d, c] });
      const as = "              ^------!-";
      const bs = "              ^---!----";
      const cs = "              ----^----";
      const ds = "              -------^-";
      const expected = m.cold(" --------z", { z: ["d", "c"] });

      const combined = h.pipe(combineLatestHigherOrderArray());
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
      const a = m.hot("         --a------");
      const b = m.hot("         ---b-----");
      const c = m.hot("         ---------");
      const d = m.hot("         ---------");
      const h = m.hot("         i---j--k-", { i: [a, b], j: [a, c], k: [d, c] });
      const as = "              ^------!-";
      const bs = "              ^---!----";
      const cs = "              ----^----";
      const ds = "              -------^-";
      const expected = m.cold(" ---x-----", { x: ["a", "b"] });

      const combined = h.pipe(combineLatestHigherOrderArray());
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
      const a = m.hot("         -a----a----");
      const h = m.hot("         i----------", { i: [a, a] });
      const as = [
        "                       ^----------",
        "                       ^----------"
      ];
      const expected = m.cold(" -x----(xx)-", { x: ["a", "a"] });

      const combined = h.pipe(combineLatestHigherOrderArray());
      m.expect(combined).toBeObservable(expected);
      m.expect(a).toHaveSubscriptions(as);
    })
  );

  it(
    "should emit an empty array",
    marbles(m => {
      const h = m.hot("         i--", { i: [] });
      const expected = m.cold(" x--", { x: [] });

      const combined = h.pipe(combineLatestHigherOrderArray());
      m.expect(combined).toBeObservable(expected);
    })
  );

  it(
    "should emit when a source is removed",
    marbles(m => {
      const a = m.hot("         --a----");
      const b = m.hot("         ----b--");
      const h = m.hot("         i----j-", { i: [a, b], j: [a] });
      const as = "              ^------";
      const bs = "              ^----!-";
      const expected = m.cold(" ----xy-", { x: ["a", "b"], y: ["a"] });

      const combined = h.pipe(combineLatestHigherOrderArray());
      m.expect(combined).toBeObservable(expected);
      m.expect(a).toHaveSubscriptions(as);
      m.expect(b).toHaveSubscriptions(bs);
    })
  );

  it(
    "should support adds and removes",
    marbles(m => {
      const a = m.cold("        a");
      const b = m.cold("        b");
      const h = m.hot("         i---j--k-", { i: [a], j: [a, b], k: [b] });
      const expected = m.cold(" x---y--z-", { x: ["a"], y: ["a", "b"], z: ["b"] });

      const combined = h.pipe(combineLatestHigherOrderArray());
      m.expect(combined).toBeObservable(expected);
    })
  );
});
