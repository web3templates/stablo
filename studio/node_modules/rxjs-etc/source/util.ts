/**
 * @license Use of this source code is governed by an MIT-style license that
 * can be found in the LICENSE file at https://github.com/cartant/rxjs-etc
 */

import { Observable, OperatorFunction, SchedulerLike } from "rxjs";

export type ObservableValue<T> = T extends Observable<infer U> ? U : never;

export type ObservableValues<T> = { [K in keyof T]: ObservableValue<T[K]> };

// https://github.com/ReactiveX/rxjs/issues/4632#issuecomment-481815411
export type Op<T> = OperatorFunction<any, T>;

export function isNonNulled<T>(value: T): value is NonNullable<T> {
  return value != null;
}

/** @deprecated Renamed to isNonNulled */
export const isNotNullish = isNonNulled;

export function isNulled<T>(
  value: T | null | undefined
): value is null | undefined {
  return value == null;
}

/** @deprecated Renamed to isNulled */
export const isNullish = isNulled;

export function isObservable(value: any): value is Observable<any> {
  return Boolean(
    value &&
      typeof value === "object" &&
      typeof value["subscribe"] === "function"
  );
}

export function isScheduler(
  value: object | null | undefined
): value is SchedulerLike {
  return Boolean(value && typeof (value as any)["schedule"] === "function");
}
