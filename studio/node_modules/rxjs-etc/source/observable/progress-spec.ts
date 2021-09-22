/**
 * @license Use of this source code is governed by an MIT-style license that
 * can be found in the LICENSE file at https://github.com/cartant/rxjs-etc
 */
/*tslint:disable:no-unnecessary-callback-wrapper no-unused-expression*/

import { concat, forkJoin, merge } from "rxjs";
import { marbles } from "rxjs-marbles";
import { progress } from "./progress";

// prettier-ignore
describe("progress", () => {
  it("should default to forkJoin", marbles(m => {
    const a = m.cold("        a|         ");
    const b = m.cold("        --b|       ");
    const c = m.cold("        ----c|     ");
    const expected = m.cold(" ijklm(rn|) ", {
      i: { finalized: 0, nexted: 1, total: 3 },
      j: { finalized: 1, nexted: 1, total: 3 },
      k: { finalized: 1, nexted: 2, total: 3 },
      l: { finalized: 2, nexted: 2, total: 3 },
      m: { finalized: 2, nexted: 3, total: 3 },
      n: { finalized: 3, nexted: 3, total: 3 },
      r: ["a", "b", "c"]
    });
    const result = progress(
      [a, b, c],
      (state, joined) => merge(state, joined)
    );
    m.expect(result).toBeObservable(expected);
  }));

  it("should support forkJoin", marbles(m => {
    const a = m.cold("        a|         ");
    const b = m.cold("        --b|       ");
    const c = m.cold("        ----c|     ");
    const expected = m.cold(" ijklm(rn|) ", {
      i: { finalized: 0, nexted: 1, total: 3 },
      j: { finalized: 1, nexted: 1, total: 3 },
      k: { finalized: 1, nexted: 2, total: 3 },
      l: { finalized: 2, nexted: 2, total: 3 },
      m: { finalized: 2, nexted: 3, total: 3 },
      n: { finalized: 3, nexted: 3, total: 3 },
      r: ["a", "b", "c"]
    });
    const result = progress(
      [a, b, c],
      (state, joined) => merge(state, joined),
      o => forkJoin(...o)
    );
    m.expect(result).toBeObservable(expected);
  }));

  it("should support concat", marbles(m => {
    const a = m.cold("        a---|                ");
    const b = m.cold("            --b---|          ");
    const c = m.cold("                  --c---|    ");
    const expected = m.cold(" (ia)j-(kb)l-(mc)(n|) ", {
      a: "a",
      b: "b",
      c: "c",
      i: { finalized: 0, nexted: 1, total: 3 },
      j: { finalized: 1, nexted: 1, total: 3 },
      k: { finalized: 1, nexted: 2, total: 3 },
      l: { finalized: 2, nexted: 2, total: 3 },
      m: { finalized: 2, nexted: 3, total: 3 },
      n: { finalized: 3, nexted: 3, total: 3 }
    });
    const result = progress(
      [a, b, c],
      (state, joined) => merge(state, joined),
      o => concat(...o)
    );
    m.expect(result).toBeObservable(expected);
  }));

  it("should support merge", marbles(m => {
    const a = m.cold("        a---|                ");
    const b = m.cold("        ------b---|          ");
    const c = m.cold("        ------------c---|    ");
    const expected = m.cold(" (ia)j-(kb)l-(mc)(n|) ", {
      a: "a",
      b: "b",
      c: "c",
      i: { finalized: 0, nexted: 1, total: 3 },
      j: { finalized: 1, nexted: 1, total: 3 },
      k: { finalized: 1, nexted: 2, total: 3 },
      l: { finalized: 2, nexted: 2, total: 3 },
      m: { finalized: 2, nexted: 3, total: 3 },
      n: { finalized: 3, nexted: 3, total: 3 }
    });
    const result = progress(
      [a, b, c],
      (state, joined) => merge(state, joined),
      o => merge(...o)
    );
    m.expect(result).toBeObservable(expected);
  }));
});
