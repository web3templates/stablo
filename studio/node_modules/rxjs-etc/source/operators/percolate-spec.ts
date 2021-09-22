/**
 * @license Use of this source code is governed by an MIT-style license that
 * can be found in the LICENSE file at https://github.com/cartant/rxjs-etc
 */

import { marbles } from "rxjs-marbles";
import { percolate } from "./percolate";

describe("percolate", () => {
  it(
    "finds the first successfully completed observable from a set",
    marbles((m) => {
      const firstObs$ = m.cold("--#");
      const secondObs$ = m.cold(" --z--#");
      const thirdObs$ = m.cold("       --x--y|");

      const expected = "        ----z----x--y|";

      m.expect(percolate(firstObs$, secondObs$, thirdObs$)).toBeObservable(
        expected
      );
    })
  );

  it(
    "expands an array of observables",
    marbles((m) => {
      const firstObs$ = m.cold("--#");
      const secondObs$ = m.cold(" --z--#");
      const thirdObs$ = m.cold("       --x--y|");

      const expected = "        ----z----x--y|";

      m.expect(percolate([firstObs$, secondObs$, thirdObs$])).toBeObservable(
        expected
      );
    })
  );

  it(
    "completes on the first successful observable",
    marbles((m) => {
      const firstObs$ = m.cold("--y#");
      const secondObs$ = m.cold("  --z--|");
      const thirdObs$ = m.cold("   --x--#");

      const expected = "        --y--z--|";

      m.expect(percolate(firstObs$, secondObs$, thirdObs$)).toBeObservable(
        expected
      );
    })
  );

  it(
    "throws the last error if no observables successfully complete",
    marbles((m) => {
      const firstError = new Error("first error");
      const lastError = new Error("last error");

      const firstObs$ = m.cold("--y#", { y: 1 }, firstError);
      const secondObs$ = m.cold("  z--#", { z: 2 });
      const thirdObs$ = m.cold("      --x--#", { x: 3 }, lastError);

      const expected = "        --yz----x--#";
      const expectedValues = { y: 1, z: 2, x: 3 };

      m.expect(percolate(firstObs$, secondObs$, thirdObs$)).toBeObservable(
        expected,
        expectedValues,
        lastError
      );
    })
  );
});
