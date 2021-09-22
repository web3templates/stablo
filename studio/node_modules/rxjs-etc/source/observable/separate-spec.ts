/**
 * @license Use of this source code is governed by an MIT-style license that
 * can be found in the LICENSE file at https://github.com/cartant/rxjs-etc
 */
/*tslint:disable:no-unused-expression*/

import { marbles } from "rxjs-marbles";
import { separate } from "./separate";

// prettier-ignore
describe("separate", () => {
  it(
    "should support a single predicate",
    marbles(m => {
      const source = m.hot("  --a--b--c--d--e--|");
      const subs = "          ^----------------!";
      const expected1 = "     --a--------------|";
      const expectedOther = " -----b--c--d--e--|";

      const [sep1, sepOther] = separate(source, value => value === "a");
      m.expect(sep1).toBeObservable(expected1);
      m.expect(sepOther).toBeObservable(expectedOther);
      m.expect(source).toHaveSubscriptions(subs);
    })
  );

  it(
    "should support two predicates",
    marbles(m => {
      const source = m.hot("  --a--b--c--d--e--|");
      const subs = "          ^----------------!";
      const expected1 = "     --a--------------|";
      const expected2 = "     -----b-----------|";
      const expectedOther = " --------c--d--e--|";

      const [sep1, sep2, sepOther] = separate(
        source,
        value => value === "a",
        value => value === "b"
      );
      m.expect(sep1).toBeObservable(expected1);
      m.expect(sep2).toBeObservable(expected2);
      m.expect(sepOther).toBeObservable(expectedOther);
      m.expect(source).toHaveSubscriptions(subs);
    })
  );

  it(
    "should support three predicates",
    marbles(m => {
      const source = m.hot("  --a--b--c--d--e--|");
      const subs = "          ^----------------!";
      const expected1 = "     --a--------------|";
      const expected2 = "     -----b-----------|";
      const expected3 = "     --------c--------|";
      const expectedOther = " -----------d--e--|";

      const [sep1, sep2, sep3, sepOther] = separate(
        source,
        value => value === "a",
        value => value === "b",
        value => value === "c"
      );
      m.expect(sep1).toBeObservable(expected1);
      m.expect(sep2).toBeObservable(expected2);
      m.expect(sep3).toBeObservable(expected3);
      m.expect(sepOther).toBeObservable(expectedOther);
      m.expect(source).toHaveSubscriptions(subs);
    })
  );

  it(
    "should support multiple predicates",
    marbles(m => {
      const source = m.hot("  --a--b--c--d--e--|");
      const subs = "          ^----------------!";
      const expected1 = "     --a--------------|";
      const expected2 = "     -----b-----------|";
      const expected3 = "     --------c--------|";
      const expected4 = "     -----------d-----|";
      const expectedOther = " --------------e--|";

      const [sep1, sep2, sep3, sep4, sepOther] = separate(
        source,
        value => value === "a",
        value => value === "b",
        value => value === "c",
        value => value === "d"
      );
      m.expect(sep1).toBeObservable(expected1);
      m.expect(sep2).toBeObservable(expected2);
      m.expect(sep3).toBeObservable(expected3);
      m.expect(sep4).toBeObservable(expected4);
      m.expect(sepOther).toBeObservable(expectedOther);
      m.expect(source).toHaveSubscriptions(subs);
    })
  );
});
