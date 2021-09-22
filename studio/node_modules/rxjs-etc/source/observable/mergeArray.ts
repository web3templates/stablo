/**
 * @license Use of this source code is governed by an MIT-style license that
 * can be found in the LICENSE file at https://github.com/cartant/rxjs-etc
 */

import { EMPTY, merge, Observable } from "rxjs";

export function mergeArray<T, R>(
  observables: Observable<T>[],
  concurrent?: number
): Observable<R> {
  if (observables.length === 0) {
    return EMPTY;
  }

  const applyArgs: any[] = [...observables];
  if (concurrent) {
    applyArgs.push(concurrent);
  }
  /*tslint:disable-next-line:deprecation*/
  return merge.apply(null, applyArgs) as any;
}
