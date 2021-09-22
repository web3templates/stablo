/**
 * @license Use of this source code is governed by an MIT-style license that
 * can be found in the LICENSE file at https://github.com/cartant/rxjs-etc
 */
/*tslint:disable:no-unused-expression rxjs-no-ignored-subscription*/

import { expect } from "chai";
import { from } from "rxjs";
import { marbles } from "rxjs-marbles";
import { tapWithIndex } from "./tapWithIndex";

// prettier-ignore
describe("tapWithIndex", () => {
  it(
    "should mirror multiple values and complete",
    marbles(m => {
      const source = m.cold("   --1--2--3--|");
      const subs = "            ^----------!";
      const expected = m.cold(" --1--2--3--|");

      const destination = source.pipe(tapWithIndex(() => {}));
      m.expect(destination).toBeObservable(expected);
      m.expect(source).toHaveSubscriptions(subs);
    })
  );

  it(
    "should mirror multiple values and terminate with error",
    marbles(m => {
      const source = m.cold("   --1--2--3--#");
      const subs = "            ^----------!";
      const expected = m.cold(" --1--2--3--#");

      const destination = source.pipe(tapWithIndex(() => {}));
      m.expect(destination).toBeObservable(expected);
      m.expect(source).toHaveSubscriptions(subs);
    })
  );

  it("should pass the index", () => {
    let seen: { index: number; value: string }[] = [];

    from(["alice", "bob"])
      .pipe(tapWithIndex(([value, index]) => seen.push({ index, value })))
      .subscribe();

    expect(seen).to.deep.equal([
      {
        index: 0,
        value: "alice"
      },
      {
        index: 1,
        value: "bob"
      }
    ]);
  });

  it("should reset the index for each subscription", () => {
    let seen: { index: number; value: string }[] = [];

    let observable = from(["alice", "bob"]).pipe(
      tapWithIndex(([value, index]) => seen.push({ index, value }))
    );

    observable.subscribe();
    observable.subscribe();

    expect(seen).to.deep.equal([
      {
        index: 0,
        value: "alice"
      },
      {
        index: 1,
        value: "bob"
      },
      {
        index: 0,
        value: "alice"
      },
      {
        index: 1,
        value: "bob"
      }
    ]);
  });

  it("should support a partial observer", () => {
    let seen: { index: number; value: string }[] = [];

    from(["alice", "bob"])
      .pipe(
        tapWithIndex({
          next: ([value, index]) => seen.push({ index, value })
        })
      )
      .subscribe();

    expect(seen).to.deep.equal([
      {
        index: 0,
        value: "alice"
      },
      {
        index: 1,
        value: "bob"
      }
    ]);
  });

  it("should use the partial observer as the context", () => {
    let seen: { context: any; index: number; value: string }[] = [];

    const observer = {
      next: function(this: {}, [value, index]: [string, number]): void {
        seen.push({
          context: this,
          index,
          value
        });
      }
    };
    from(["alice", "bob"])
      .pipe(tapWithIndex(observer))
      .subscribe();

    expect(seen).to.deep.equal([
      {
        context: observer,
        index: 0,
        value: "alice"
      },
      {
        context: observer,
        index: 1,
        value: "bob"
      }
    ]);
  });
});
