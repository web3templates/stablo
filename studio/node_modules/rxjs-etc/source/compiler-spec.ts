/**
 * @license Use of this source code is governed by an MIT-style license that
 * can be found in the LICENSE file at https://github.com/cartant/rxjs-etc
 */

import { Compiler } from "ts-snippet";

export const compiler: Compiler = (global as any).window
  ? undefined!
  : new Compiler({ strict: true });
