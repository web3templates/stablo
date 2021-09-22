/**
 * @license Use of this source code is governed by an MIT-style license that
 * can be found in the LICENSE file at https://github.com/cartant/rxjs-etc
 */
/*tslint:disable:no-unused-expression rxjs-no-ignored-subscription*/

import { expect } from "chai";
import { BehaviorSubject, Subject } from "rxjs";
import { marbles } from "rxjs-marbles";
import { startWithTimeout } from "./startWithTimeout";

// prettier-ignore
describe("startWithTimeout", () => {
  it(
    "should do nothing if the source emits within the duration",
    marbles(m => {
      const source = m.cold("   --a--b--c--|");
      const subs = "            ^----------!";
      const expected = m.cold(" --a--b--c--|");

      const destination = source.pipe(startWithTimeout("z", m.time("---|")));
      m.expect(destination).toBeObservable(expected);
      m.expect(source).toHaveSubscriptions(subs);
    })
  );

  it(
    "should emit the value if the source is empty",
    marbles(m => {
      const source = m.cold("   -----------|");
      const subs = "            ^----------!";
      const expected = m.cold(" ---z-------|");

      const destination = source.pipe(startWithTimeout("z", m.time("---|")));
      m.expect(destination).toBeObservable(expected);
      m.expect(source).toHaveSubscriptions(subs);
    })
  );

  it(
    "should emit the value if the source emits after the duration",
    marbles(m => {
      const source = m.cold("   -----a-b-c-|");
      const subs = "            ^----------!";
      const expected = m.cold(" ---z-a-b-c-|");

      const destination = source.pipe(startWithTimeout("z", m.time("---|")));
      m.expect(destination).toBeObservable(expected);
      m.expect(source).toHaveSubscriptions(subs);
    })
  );

  it(
    "should not emit if the source completes within the duration",
    marbles(m => {
      const source = m.cold("   --|");
      const subs = "            ^-!";
      const expected = m.cold(" --|");

      const destination = source.pipe(startWithTimeout("z", m.time("---|")));
      m.expect(destination).toBeObservable(expected);
      m.expect(source).toHaveSubscriptions(subs);
    })
  );

  it(
    "should emit a value if the source does not emit synchronously with a timeout of zero",
    () => {
      const subject = new Subject<string>();
      const composed = subject.pipe(startWithTimeout("z", 0));

      const values: string[] = [];
      composed.subscribe(value => values.push(value));
      subject.next("a");
      expect(values).to.deep.equal(["z", "a"]);
    }
  );

  it(
    "should do nothing if the source emits synchronously with a timeout of zero",
    () => {
      const subject = new BehaviorSubject("a");
      const composed = subject.pipe(startWithTimeout("z", 0));

      const values: string[] = [];
      composed.subscribe(value => values.push(value));
      expect(values).to.deep.equal(["a"]);
    }
  );
});
