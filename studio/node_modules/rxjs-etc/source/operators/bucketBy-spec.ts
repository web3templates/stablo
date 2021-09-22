/**
 * @license Use of this source code is governed by an MIT-style license that
 * can be found in the LICENSE file at https://github.com/cartant/rxjs-etc
 */
/*tslint:disable:no-unused-expression*/

import { marbles } from "rxjs-marbles";
import { mergeMap } from "rxjs/operators";
import { bucketBy } from "./bucketBy";

describe("bucketBy", () => {
  it(
    "should bucket values",
    marbles((m) => {
      const source = m.cold(" --a-b-c-a-b-c-|");
      const x = m.cold("      --a-----a-----|");
      const y = m.cold("      ----b-----b---|");
      const z = m.cold("      ------c-----c-|");
      const expected = "      (xyz)---------|";

      const bucketed = source.pipe(
        bucketBy(3, (value) => value.charCodeAt(0) - "a".charCodeAt(0)),
        mergeMap((buckets) => buckets)
      );
      m.expect(bucketed).toBeObservable(expected, { x, y, z });
    })
  );

  it(
    "should forward errors for non-empty sources",
    marbles((m) => {
      const source = m.cold(" --a-b--#");
      const x = m.cold("      --a----#");
      const y = m.cold("      ----b--#");
      const z = m.cold("      -------#");
      const expected = "      (xyz)--#";

      const bucketed = source.pipe(
        bucketBy(3, (value) => value.charCodeAt(0) - "a".charCodeAt(0)),
        mergeMap((buckets) => buckets)
      );
      m.expect(bucketed).toBeObservable(expected, { x, y, z });
    })
  );

  it(
    "should forward errors for empty sources",
    marbles((m) => {
      const source = m.cold(" #");
      const x = m.cold("      #");
      const y = m.cold("      #");
      const z = m.cold("      #");
      const expected = "      (xyz#)";

      const bucketed = source.pipe(
        bucketBy(3, (value) => value.charCodeAt(0) - "a".charCodeAt(0)),
        mergeMap((buckets) => buckets)
      );
      m.expect(bucketed).toBeObservable(expected, { x, y, z });
    })
  );

  it(
    "should forward completions for empty sources",
    marbles((m) => {
      const source = m.cold(" |     ");
      const x = m.cold("      |     ");
      const y = m.cold("      |     ");
      const z = m.cold("      |     ");
      const expected = "      (xyz|)";

      const bucketed = source.pipe(
        bucketBy(3, (value) => value.charCodeAt(0) - "a".charCodeAt(0)),
        mergeMap((buckets) => buckets)
      );
      m.expect(bucketed).toBeObservable(expected, { x, y, z });
    })
  );

  it(
    "should handle hash values that exceed the count",
    marbles((m) => {
      const source = m.cold(" --a----|");
      const x = m.cold("      -------|");
      const y = m.cold("      --a----|");
      const z = m.cold("      -------|");
      const expected = "      (xyz)--|";

      const bucketed = source.pipe(
        bucketBy(3, () => 4),
        mergeMap((buckets) => buckets)
      );
      m.expect(bucketed).toBeObservable(expected, { x, y, z });
    })
  );

  it(
    "should handle negative hash values",
    marbles((m) => {
      const source = m.cold(" --a----|");
      const x = m.cold("      -------|");
      const y = m.cold("      --a----|");
      const z = m.cold("      -------|");
      const expected = "      (xyz)--|";

      const bucketed = source.pipe(
        bucketBy(3, () => -1),
        mergeMap((buckets) => buckets)
      );
      m.expect(bucketed).toBeObservable(expected, { x, y, z });
    })
  );

  it(
    "should handle floating-point hash values",
    marbles((m) => {
      const source = m.cold(" --a----|");
      const x = m.cold("      -------|");
      const y = m.cold("      --a----|");
      const z = m.cold("      -------|");
      const expected = "      (xyz)--|";

      const bucketed = source.pipe(
        bucketBy(3, () => 1.5),
        mergeMap((buckets) => buckets)
      );
      m.expect(bucketed).toBeObservable(expected, { x, y, z });
    })
  );

  it(
    "should forward errors thrown from the hash selector",
    marbles((m) => {
      const error = new Error("Kaboom!");
      const source = m.cold(" ------a-|");
      const x = m.cold("      ------#  ", undefined, error);
      const y = m.cold("      ------#  ", undefined, error);
      const z = m.cold("      ------#  ", undefined, error);
      const expected = "      (xyz)-#  ";

      const bucketed = source.pipe(
        bucketBy(3, () => {
          throw error;
        }),
        mergeMap((buckets) => buckets)
      );
      m.expect(bucketed).toBeObservable(expected, { x, y, z }, error);
    })
  );
});
