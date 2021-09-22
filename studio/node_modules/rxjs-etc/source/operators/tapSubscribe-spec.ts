/**
 * @license Use of this source code is governed by an MIT-style license that
 * can be found in the LICENSE file at https://github.com/cartant/rxjs-etc
 */
/*tslint:disable:no-unused-expression*/

import { expect } from "chai";
import { marbles } from "rxjs-marbles";
import { tapSubscribe } from "./tapSubscribe";

// prettier-ignore
describe("tapSubscribe", () => {
  it(
    "should mirror the source with a function argument",
    marbles(m => {
      const source = m.cold(" abc|");
      const expected = "      abc|";

      let subscribeCount = 0;
      const result = source.pipe(tapSubscribe(() => ++subscribeCount));
      m.expect(result).toBeObservable(expected);
      m.flush();
      expect(subscribeCount).to.equal(1);
    })
  );

  it(
    "should mirror the source with a config argument",
    marbles(m => {
      const source = m.cold(" abc|");
      const expected = "      abc|";

      let subscribeCount = 0;
      let unsubscribeCount = 0;
      const result = source.pipe(tapSubscribe({
        subscribe: () => ++subscribeCount,
        unsubscribe: () => ++unsubscribeCount
      }));
      m.expect(result).toBeObservable(expected);
      m.flush();
      expect(subscribeCount).to.equal(1);
      expect(unsubscribeCount).to.equal(1);
    })
  );

  it(
    "should support ignoring complete",
    marbles(m => {
      const source = m.cold(" abc|");
      const expected = "      abc|";

      let subscribeCount = 0;
      let unsubscribeCount = 0;
      const result = source.pipe(tapSubscribe({
        ignore: { complete: true },
        subscribe: () => ++subscribeCount,
        unsubscribe: () => ++unsubscribeCount
      }));
      m.expect(result).toBeObservable(expected);
      m.flush();
      expect(subscribeCount).to.equal(1);
      expect(unsubscribeCount).to.equal(0);
    })
  );

  it(
    "should support ignoring error",
    marbles(m => {
      const source = m.cold(" abc#");
      const expected = "      abc#";

      let subscribeCount = 0;
      let unsubscribeCount = 0;
      const result = source.pipe(tapSubscribe({
        ignore: { error: true },
        subscribe: () => ++subscribeCount,
        unsubscribe: () => ++unsubscribeCount
      }));
      m.expect(result).toBeObservable(expected);
      m.flush();
      expect(subscribeCount).to.equal(1);
      expect(unsubscribeCount).to.equal(0);
    })
  );

  it(
    "should support explicit unsubscription",
    marbles(m => {
      const source = m.cold(" abc-");
      const expected = "      abc-";
      const subs = "          ^--!";

      let subscribeCount = 0;
      let unsubscribeCount = 0;
      const result = source.pipe(tapSubscribe({
        subscribe: () => ++subscribeCount,
        unsubscribe: () => ++unsubscribeCount
      }));
      m.expect(result, subs).toBeObservable(expected);
      m.flush();
      expect(subscribeCount).to.equal(1);
      expect(unsubscribeCount).to.equal(1);
    })
  );
});
