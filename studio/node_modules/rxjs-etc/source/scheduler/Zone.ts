/**
 * @license Use of this source code is governed by an MIT-style license that
 * can be found in the LICENSE file at https://github.com/cartant/rxjs-etc
 */

export interface Zone {
  run(fn: () => any): any;
  runOutsideAngular(fn: () => any): any;
}
