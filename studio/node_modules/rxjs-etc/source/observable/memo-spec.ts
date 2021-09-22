/**
 * @license Use of this source code is governed by an MIT-style license that
 * can be found in the LICENSE file at https://github.com/cartant/rxjs-etc
 */
/*tslint:disable:no-unnecessary-callback-wrapper no-unused-expression*/

import { expect } from "chai";
import { of } from "rxjs";
import { marbles } from "rxjs-marbles";
import * as sinon from "sinon";
import { memo } from "./memo";

// prettier-ignore
describe("memo", () => {
  it("should memoize an observable-returning function", () => {
    const func = memo((value: number) => of(value));
    expect(func(42)).to.equal(func(42));
    expect(func(42)).to.not.equal(func(54));
  });

  it("should accept a Lodash-style memoize implemetation", marbles(m => {
    const stub = sinon.stub();
    memo((value: number) => of(value), stub);
    expect(stub).to.have.property("calledOnce", true);
    expect(stub.firstCall.args).to.have.length(2);
  }));

  it("should memoize notifications", marbles(m => {
    const source = m.cold("a----b----c-------");
    const subs = "         ^-----------------";
    const expected1 = "    a----b----c-------";
    const expected2 = "    --a--b----c-------";
    const expected3 = "    -----(ab)-c-------";
    const expected4 = "    ------------(abc)-";

    const func = memo(() => source);
    m.expect(func(), "     ^-----------------").toBeObservable(expected1);
    m.expect(func(), "     --^---------------").toBeObservable(expected2);
    m.expect(func(), "     -----^------------").toBeObservable(expected3);
    m.expect(func(), "     ------------^-----").toBeObservable(expected4);
    m.expect(source).toHaveSubscriptions(subs);
  }));

  it("should memoize complete", marbles(m => {
    const source = m.cold("a----b----c|      ");
    const subs = "         ^----------!      ";
    const expected1 = "    a----b----c|      ";
    const expected2 = "    --a--b----c|      ";
    const expected3 = "    -----(ab)-c|      ";
    const expected4 = "    ------------(abc|)";

    const func = memo(() => source);
    m.expect(func(), "     ^-----------------").toBeObservable(expected1);
    m.expect(func(), "     --^---------------").toBeObservable(expected2);
    m.expect(func(), "     -----^------------").toBeObservable(expected3);
    m.expect(func(), "     ------------^-----").toBeObservable(expected4);
    m.expect(source).toHaveSubscriptions(subs);
  }));

  it("should memoize error", marbles(m => {
    const source = m.cold("a----b----c#      ");
    const subs = "         ^----------!      ";
    const expected1 = "    a----b----c#      ";
    const expected2 = "    --a--b----c#      ";
    const expected3 = "    -----(ab)-c#      ";
    const expected4 = "    ------------(abc#)";

    const func = memo(() => source);
    m.expect(func(), "     ^-----------------").toBeObservable(expected1);
    m.expect(func(), "     --^---------------").toBeObservable(expected2);
    m.expect(func(), "     -----^------------").toBeObservable(expected3);
    m.expect(func(), "     ------------^-----").toBeObservable(expected4);
    m.expect(source).toHaveSubscriptions(subs);
  }));
});
