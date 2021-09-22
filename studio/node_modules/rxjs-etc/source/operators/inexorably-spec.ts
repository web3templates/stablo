/**
 * @license Use of this source code is governed by an MIT-style license that
 * can be found in the LICENSE file at https://github.com/cartant/rxjs-etc
 */
/*tslint:disable:deprecation no-unused-expression throw-error rxjs-no-ignored-subscription rxjs-throw-error*/

import { expect } from "chai";
import { interval, Notification, of, timer } from "rxjs";
import { marbles } from "rxjs-marbles";
import { map, share } from "rxjs/operators";
import { finalize, inexorably } from "./inexorably";

// prettier-ignore
describe("inexorably", () => {
  it("should export an alias", () => {
    expect(finalize).to.equal(inexorably);
  });

  it("should call finally after complete", (done: Mocha.Done) => {
    let completed = false;
    of(1, 2, 3)
      .pipe(
        inexorably((notification: Notification<number> | undefined) => {
          expect(notification).to.not.be.undefined;
          expect(notification).to.have.property("kind", "C");
          expect(completed).to.be.true;
          done();
        })
      )
      .subscribe({
        complete: () => (completed = true)
      });
  });

  it("should call finally after error", (done: Mocha.Done) => {
    let thrown = false;
    of(1, 2, 3)
      .pipe(
        map(x => {
          if (x === 3) {
            throw x;
          }
          return x;
        }),
        inexorably((notification: Notification<number> | undefined) => {
          expect(notification).to.not.be.undefined;
          expect(notification).to.have.property("kind", "E");
          expect(thrown).to.be.true;
          done();
        })
      )
      .subscribe({
        error: () => (thrown = true)
      });
  });

  it("should call finally upon disposal", (done: Mocha.Done) => {
    let disposed = false;
    const subscription = timer(100)
      .pipe(
        inexorably((notification: Notification<number> | undefined) => {
          expect(notification).to.be.undefined;
          expect(disposed).to.be.true;
          done();
        })
      )
      .subscribe();
    disposed = true;
    subscription.unsubscribe();
  });

  it("should call finally when synchronously subscribing to and unsubscribing from a shared Observable", (done: Mocha.Done) => {
    interval(50)
      .pipe(
        /*tslint:disable-next-line:no-unnecessary-callback-wrapper*/
        inexorably((notification: Notification<number> | undefined) => {
          expect(notification).to.be.undefined;
          done();
        }),
        share()
      )
      .subscribe()
      .unsubscribe();
  });

  it("should call two finally instances in succession on a shared Observable", (done: Mocha.Done) => {
    let invoked = 0;
    function checkFinally(
      notification: Notification<number> | undefined
    ): void {
      expect(notification).to.not.be.undefined;
      expect(notification).to.have.property("kind", "C");
      invoked += 1;
      if (invoked === 2) {
        done();
      }
    }

    of(1, 2, 3)
      .pipe(
        inexorably(checkFinally),
        inexorably(checkFinally),
        share()
      )
      .subscribe();
  });

  it(
    "should handle empty",
    marbles(m => {
      let executed = false;
      let s = m.hot("|");
      let result = s.pipe(
        inexorably((notification: Notification<number> | undefined) => {
          expect(notification).to.not.be.undefined;
          expect(notification).to.have.property("kind", "C");
          executed = true;
        })
      );
      let expected = "|";
      m.expect(result).toBeObservable(expected);
      m.flush();
      expect(executed).to.be.true;
    })
  );

  it(
    "should handle never",
    marbles(m => {
      let executed = false;
      let s = m.hot("-");
      let result = s.pipe(inexorably(() => (executed = true)));
      let expected = "-";
      m.expect(result).toBeObservable(expected);
      m.flush();
      expect(executed).to.be.false;
    })
  );

  it(
    "should handle throw",
    marbles(m => {
      let executed = false;
      let s = m.hot("#");
      let result = s.pipe(
        inexorably((notification: Notification<number> | undefined) => {
          expect(notification).to.not.be.undefined;
          expect(notification).to.have.property("kind", "E");
          executed = true;
        })
      );
      let expected = "#";
      m.expect(result).toBeObservable(expected);
      m.flush();
      expect(executed).to.be.true;
    })
  );

  it(
    "should handle basic hot observable",
    marbles(m => {
      let executed = false;
      let s = m.hot("  --a--b--c--|");
      let subs = "     ^----------!";
      let expected = " --a--b--c--|";
      let result = s.pipe(
        inexorably((notification: Notification<number> | undefined) => {
          expect(notification).to.not.be.undefined;
          expect(notification).to.have.property("kind", "C");
          executed = true;
        })
      );
      m.expect(result).toBeObservable(expected);
      m.expect(s).toHaveSubscriptions(subs);
      m.flush();
      expect(executed).to.be.true;
    })
  );

  it(
    "should handle basic cold observable",
    marbles(m => {
      let executed = false;
      let s = m.cold(" --a--b--c--|");
      let subs = "     ^----------!";
      let expected = " --a--b--c--|";
      let result = s.pipe(
        inexorably((notification: Notification<number> | undefined) => {
          expect(notification).to.not.be.undefined;
          expect(notification).to.have.property("kind", "C");
          executed = true;
        })
      );
      m.expect(result).toBeObservable(expected);
      m.expect(s).toHaveSubscriptions(subs);
      m.flush();
      expect(executed).to.be.true;
    })
  );

  it(
    "should handle basic error",
    marbles(m => {
      let executed = false;
      let s = m.hot("  --a--b--c--#");
      let subs = "     ^----------!";
      let expected = " --a--b--c--#";
      let result = s.pipe(
        inexorably((notification: Notification<number> | undefined) => {
          expect(notification).to.not.be.undefined;
          expect(notification).to.have.property("kind", "E");
          executed = true;
        })
      );
      m.expect(result).toBeObservable(expected);
      m.expect(s).toHaveSubscriptions(subs);
      m.flush();
      expect(executed).to.be.true;
    })
  );

  it(
    "should handle unsubscription",
    marbles(m => {
      let executed = false;
      let s = m.hot("  --a--b--c--|");
      let subs = "     ^-----!     ";
      let expected = " --a--b-";
      let unsub = "    ------!";
      let result = s.pipe(
        inexorably((notification: Notification<number> | undefined) => {
          expect(notification).to.be.undefined;
          executed = true;
        })
      );
      m.expect(result, unsub).toBeObservable(expected);
      m.expect(s).toHaveSubscriptions(subs);
      m.flush();
      expect(executed).to.be.true;
    })
  );
});
