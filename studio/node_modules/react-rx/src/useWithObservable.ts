import {Observable} from 'rxjs'
import {useObservable} from './useObservable'
import {useAsObservable} from './useAsObservable'

/**
 * React hook to convert any props or state value into an observable
 * Returns an observable representing updates to any React value (props, state or any other calculated value)
 * Note: the returned observable is the same instance throughout the component lifecycle
 * @param value
 */
export function useWithObservable<T>(value: T): T | undefined
export function useWithObservable<T, K>(
  value: T,
  operator: (input: Observable<T>) => Observable<K>,
): K | undefined
export function useWithObservable<T, K = T>(
  value: T,
  operator?: (input: Observable<T>) => Observable<K>,
): T | K | undefined {
  return operator
    ? useObservable(useAsObservable(value, operator))
    : useObservable(useAsObservable(value))
}
