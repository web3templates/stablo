/**
 * @license Use of this source code is governed by an MIT-style license that
 * can be found in the LICENSE file at https://github.com/cartant/rxjs-etc
 */
/*tslint:disable:no-unused-expression*/

import { expect } from "chai";
import { defer, of, queueScheduler } from "rxjs";
import { publish } from "rxjs/operators";
import { refCountOn } from "./refCountOn";

// prettier-ignore
describe("refCountOn", () => {
  it("should support queue-scheduled actions", () => {
    let received = false;
    let subscribed = false;

    const source = defer(() => {
      subscribed = true;
      return of("foo");
    });

    queueScheduler.schedule(() => {
      const subscription = source
        .pipe(
          publish(),
          refCountOn(queueScheduler)
        )
        .subscribe(() => (received = true));
      subscription.unsubscribe();
    });

    expect(received).to.be.false;
    expect(subscribed).to.be.false;

    queueScheduler.schedule(() => {
      const subscription = source
        .pipe(
          publish(),
          refCountOn(queueScheduler)
        )
        .subscribe(() => (received = true));
      queueScheduler.schedule(() => {
        subscription.unsubscribe();
      });
    });

    expect(received).to.be.true;
    expect(subscribed).to.be.true;
  });
});
