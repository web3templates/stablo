/**
 * @license Use of this source code is governed by an MIT-style license that
 * can be found in the LICENSE file at https://github.com/cartant/rxjs-etc
 */

import {
  defer,
  EMPTY,
  from,
  ObservableInput,
  ObservedValueOf,
  OperatorFunction,
} from "rxjs";
import { map, materialize, mergeMap } from "rxjs/operators";

export function concatMapEager<T, O extends ObservableInput<any>>(
  project: (value: T, index: number) => O,
  concurrency?: number
): OperatorFunction<T, ObservedValueOf<O>> {
  type R = ObservedValueOf<O>;
  type Inner = {
    complete: boolean;
    index: number;
    values: R[];
  };

  return (source) =>
    defer(() => {
      let activeIndex = 0;
      const innersByIndex = new Map<number, Inner>();

      function flush() {
        const values: R[] = [];
        let activeInner = innersByIndex.get(activeIndex);
        while (activeInner) {
          values.push(...activeInner.values);
          activeInner.values.length = 0;
          if (activeInner.complete) {
            innersByIndex.delete(activeIndex);
            activeInner = innersByIndex.get(++activeIndex);
          } else {
            break;
          }
        }
        return values;
      }

      return source.pipe(
        mergeMap(
          (value, index) =>
            from(project(value, index)).pipe(
              /*tslint:disable-next-line:rxjs-no-explicit-generics*/
              materialize<R>(),
              map((notification) => ({
                index,
                notification,
              }))
            ),
          concurrency
        ),
        mergeMap(({ index, notification }) => {
          let inner = innersByIndex.get(index);
          if (!inner) {
            inner = { complete: false, index, values: [] };
            innersByIndex.set(index, inner);
          }
          switch (notification.kind) {
            case "N":
              inner.values.push(notification.value!);
              break;
            case "C":
              inner.complete = true;
              break;
            case "E":
              return notification.toObservable();
            default:
              break;
          }
          if (inner.index !== activeIndex) {
            return EMPTY;
          }
          return flush();
        })
      );
    });
}
