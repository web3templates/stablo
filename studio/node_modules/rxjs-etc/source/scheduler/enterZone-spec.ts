/**
 * @license Use of this source code is governed by an MIT-style license that
 * can be found in the LICENSE file at https://github.com/cartant/rxjs-etc
 */
/*tslint:disable:no-unused-expression rxjs-no-ignored-subscription*/

import { expect } from "chai";
import { of } from "rxjs";
import * as sinon from "sinon";
import { enterZone } from "./enterZone";

describe("enterZone", () => {
  it("should run inside Angular's zone", () => {
    const zone = {
      run: sinon.stub(),
      runOutsideAngular: sinon.stub(),
    };

    of(1, enterZone(zone)).subscribe();
    expect(zone.run).to.have.property("calledOnce", true);
  });
});
