/**
 * @license Use of this source code is governed by an MIT-style license that
 * can be found in the LICENSE file at https://github.com/cartant/rxjs-etc
 */
/*tslint:disable:no-unused-expression rxjs-no-ignored-subscription*/

import { expect } from "chai";
import { asapScheduler, from, merge, scheduled } from "rxjs";
import { skipSync } from "./skipSync";

describe("skipSync", () => {
  it("should skip synchronous values", (done: Mocha.Done) => {
    const source = merge(from([42]), scheduled([54], asapScheduler));
    const values: number[] = [];
    source.pipe(skipSync()).subscribe((value) => values.push(value));
    asapScheduler.schedule(() => {
      expect(values).to.deep.equal([54]);
      done();
    });
  });
});
