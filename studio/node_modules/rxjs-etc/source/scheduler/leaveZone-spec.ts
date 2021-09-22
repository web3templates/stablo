/**
 * @license Use of this source code is governed by an MIT-style license that
 * can be found in the LICENSE file at https://github.com/cartant/rxjs-etc
 */
/*tslint:disable:no-unused-expression rxjs-no-ignored-subscription*/

import { expect } from "chai";
import { of } from "rxjs";
import * as sinon from "sinon";
import { leaveZone } from "./leaveZone";

describe("leaveZone", () => {
  it("should run outside Angular's zone", () => {
    const zone = {
      run: sinon.stub(),
      runOutsideAngular: sinon.stub(),
    };

    of(1, leaveZone(zone)).subscribe();
    expect(zone.runOutsideAngular).to.have.property("calledOnce", true);
  });
});
