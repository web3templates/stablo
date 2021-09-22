/**
 * @license Use of this source code is governed by an MIT-style license that
 * can be found in the LICENSE file at https://github.com/cartant/rxjs-etc
 */

import { defer, MonoTypeOperatorFunction, noop } from "rxjs";
import { finalize, tap } from "rxjs/operators";

export interface TapSubscriberConfig {
  ignore?: { complete?: boolean; error?: boolean };
  subscribe?: () => void;
  unsubscribe?: () => void;
}

export function tapSubscribe<T>(
  config: TapSubscriberConfig
): MonoTypeOperatorFunction<T>;
export function tapSubscribe<T>(
  subscribe: () => void
): MonoTypeOperatorFunction<T>;
export function tapSubscribe<T>(
  configOrSubscribe: TapSubscriberConfig | (() => void)
): MonoTypeOperatorFunction<T> {
  const { ignore = {}, subscribe = noop, unsubscribe = noop } =
    typeof configOrSubscribe === "function"
      ? { subscribe: configOrSubscribe }
      : configOrSubscribe;
  return (source) =>
    defer(() => {
      let completed = false;
      let errored = false;
      subscribe();
      return source.pipe(
        tap({
          complete: () => (completed = true),
          error: () => (errored = true),
        }),
        finalize(() => {
          if (completed && ignore.complete) {
            return;
          }
          if (errored && ignore.error) {
            return;
          }
          unsubscribe();
        })
      );
    });
}
