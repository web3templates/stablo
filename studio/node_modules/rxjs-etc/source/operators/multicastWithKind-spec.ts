/**
 * @license Use of this source code is governed by an MIT-style license that
 * can be found in the LICENSE file at https://github.com/cartant/rxjs-etc
 */
/*tslint:disable:no-unused-expression*/

import { expect } from "chai";
import { ReplaySubject, Subject } from "rxjs";
import { marbles } from "rxjs-marbles";
import { CloseKind } from "../kinds";
import { multicastWithKind } from "./multicastWithKind";

// prettier-ignore
describe("multicastWithKind", () => {
  it(
    "should indicate closing via a complete notification",
    marbles(m => {
      let kind: CloseKind | undefined = undefined;

      const source = m.cold(" a|");
      const subs = [
        "                     ^---",
        "                     --^-"
      ];
      const expected = [
        "                     a|--",
        "                     --a|"
      ];

      const result = source.pipe(
        multicastWithKind(
          k => {
            kind = k;
            return new Subject<string>();
          },
          source => source
        )
      );
      m.expect(result, subs[0]).toBeObservable(expected[0]);
      m.expect(result, subs[1]).toBeObservable(expected[1]);
      m.scheduler.schedule(
        () => expect(kind).to.equal(undefined),
        m.time("-|")
      );
      m.scheduler.schedule(() => expect(kind).to.equal("C"), m.time("---|"));
    })
  );

  it(
    "should indicate closing via an error notification",
    marbles(m => {
      let kind: CloseKind | undefined = undefined;

      const source = m.cold(" a#");
      const subs = [
        "                     ^---",
        "                     --^-"
      ];
      const expected = [
        "                     a#--",
        "                     --a#"
      ];

      const result = source.pipe(
        multicastWithKind(
          k => {
            kind = k;
            return new Subject<string>();
          },
          source => source
        )
      );
      m.expect(result, subs[0]).toBeObservable(expected[0]);
      m.expect(result, subs[1]).toBeObservable(expected[1]);
      m.scheduler.schedule(
        () => expect(kind).to.equal(undefined),
        m.time("-|")
      );
      m.scheduler.schedule(() => expect(kind).to.equal("E"), m.time("---|"));
    })
  );

  it(
    "should indicate closing via an unsubscription",
    marbles(m => {
      let kind: CloseKind | undefined = undefined;

      const source = m.cold(" a-");
      const subs = [
        "                     ^!--",
        "                     --^!"
      ];
      const expected = [
        "                     a---",
        "                     --a-"
      ];

      const result = source.pipe(
        multicastWithKind(
          k => {
            kind = k;
            return new Subject<string>();
          },
          source => source
        )
      );
      m.expect(result, subs[0]).toBeObservable(expected[0]);
      m.expect(result, subs[1]).toBeObservable(expected[1]);
      m.scheduler.schedule(
        () => expect(kind).to.equal(undefined),
        m.time("-|")
      );
      m.scheduler.schedule(() => expect(kind).to.equal("U"), m.time("---|"));
    })
  );

  it(
    "should be able to reuse the subject",
    marbles(m => {
      const source = m.cold(" a|");
      const subs = [
        "                     ^-----",
        "                     --^---"
      ];
      const expected = [
        "                     a|----",
        "                     --(a|)"
      ];

      const result = source.pipe(
        multicastWithKind(
          (kind, subject) =>
            kind === "C" ? subject! : new ReplaySubject<string>(1),
          source => source
        )
      );
      m.expect(result, subs[0]).toBeObservable(expected[0]);
      m.expect(result, subs[1]).toBeObservable(expected[1]);

      // This works, but a second subscription to the source is made
      // unnecessarily. The implementation should check the subject's
      // isStopped to determine whether or not a subscription should be
      // made.
    })
  );
});
