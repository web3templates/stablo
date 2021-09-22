/**
 * @license Use of this source code is governed by an MIT-style license that
 * can be found in the LICENSE file at https://github.com/cartant/rxjs-etc
 */
/*tslint:disable:no-unused-expression*/

import { expect } from "chai";
import { marbles } from "rxjs-marbles";
import { CloseKind } from "../kinds";
import { finalizeWithKind } from "./finalizeWithKind";

// prettier-ignore
describe("finalizeWithKind", () => {
  it(
    "should indicate closing via a complete notification",
    marbles(m => {
      let kind: CloseKind | undefined = undefined;
      const source = m.cold("a|");
      const result = source.pipe(finalizeWithKind(k => (kind = k)));
      m.expect(result).toBeObservable(source);
      m.scheduler.schedule(() => expect(kind).to.equal("C"), m.time("--|"));
    })
  );

  it(
    "should indicate closing via an error notification",
    marbles(m => {
      let kind: CloseKind | undefined = undefined;
      const source = m.cold("a#");
      const result = source.pipe(finalizeWithKind(k => (kind = k)));
      m.expect(result).toBeObservable(source);
      m.scheduler.schedule(() => expect(kind).to.equal("E"), m.time("--|"));
    })
  );

  it(
    "should indicate closing via an unsubscription",
    marbles(m => {
      let kind: CloseKind | undefined = undefined;

      const source = m.cold(" a-|");
      const sub = "           -!";
      const expected = "      a-";

      const result = source.pipe(finalizeWithKind(k => (kind = k)));
      m.expect(result, sub).toBeObservable(expected);
      m.scheduler.schedule(() => expect(kind).to.equal("U"), m.time("--|"));
    })
  );
});
