/**
 * @license Use of this source code is governed by an MIT-style license that
 * can be found in the LICENSE file at https://github.com/cartant/rxjs-etc
 */

import { concat, EMPTY, Observable } from "rxjs";

export function concatArray<T, R>(observables: Observable<T>[]): Observable<R> {
  if (observables.length === 0) {
    return EMPTY;
  }
  /*tslint:disable-next-line:deprecation*/
  return concat.apply(null, observables as any) as any;
}
