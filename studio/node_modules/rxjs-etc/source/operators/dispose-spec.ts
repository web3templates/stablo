/**
 * @license Use of this source code is governed by an MIT-style license that
 * can be found in the LICENSE file at https://github.com/cartant/rxjs-etc
 */
/*tslint:disable:no-unused-expression rxjs-no-ignored-subscription*/

import { expect } from "chai";
import { defer, of } from "rxjs";
import { finalize, tap } from "rxjs/operators";
import { dispose } from "./dispose";

describe("dispose", () => {
  it("should unsubscribe child subscriptions first", () => {
    const subscribed: number[] = [];
    const completed: number[] = [];
    const disposed: number[] = [];
    const finalized: number[] = [];

    defer(() => {
      subscribed.push(1);
      return defer(() => {
        subscribed.push(2);
        return defer(() => {
          subscribed.push(3);
          return of(42).pipe(
            tap({ complete: () => completed.push(3) }),
            finalize(() => finalized.push(3)),
            dispose(() => disposed.push(3))
          );
        }).pipe(
          tap({ complete: () => completed.push(2) }),
          finalize(() => finalized.push(2)),
          dispose(() => disposed.push(2))
        );
      }).pipe(
        tap({ complete: () => completed.push(1) }),
        finalize(() => finalized.push(1)),
        dispose(() => disposed.push(1))
      );
    }).subscribe();

    expect(completed, "unexpected complete order").to.deep.equal([3, 2, 1]);
    expect(disposed, "unexpected dispose order").to.deep.equal([3, 2, 1]);
    expect(finalized, "unexpected finalize order").to.deep.equal([3, 2, 1]);
  });
});
