/**
 * @license Use of this source code is governed by an MIT-style license that
 * can be found in the LICENSE file at https://github.com/cartant/rxjs-etc
 */

import { defer, EMPTY, from, ObservableInput, OperatorFunction } from "rxjs";
import { concat, last, mergeMap, tap } from "rxjs/operators";

export function auditMap<T, R>(
  project: (value: T, index: number) => ObservableInput<R>
): OperatorFunction<T, R> {
  return (source) => {
    let pending = false;
    let queued: [T, number] | undefined = undefined;
    return source.pipe(
      mergeMap((value, index) => {
        if (pending) {
          queued = [value, index];
          return EMPTY;
        }
        pending = true;
        return from(project(value, index)).pipe(
          /*tslint:disable-next-line:deprecation*/
          concat(
            defer(() => {
              if (!queued) {
                return EMPTY;
              }
              const projected = project(...queued);
              queued = undefined;
              return from(projected);
            })
          ),
          last(),
          tap({
            complete: () => (pending = false),
          })
        );
      })
    );
  };
}
