import {Observable, Subscription} from 'rxjs'
import {DependencyList, useMemo, useRef, useState} from 'react'
import {useIsomorphicEffect} from './useIsomorphicEffect'

function getValue<T>(value: T): T extends () => infer U ? U : T {
  return typeof value === 'function' ? value() : value
}

export function useObservable<T>(observable: Observable<T>): T | undefined
export function useObservable<T>(observable: Observable<T>, initialValue: T): T
export function useObservable<T>(observable: Observable<T>, initialValue: () => T): T
export function useObservable<T>(observable: Observable<T>, initialValue?: T | (() => T)) {
  const subscription = useRef<Subscription>()
  const isInitial = useRef(true)
  const [value, setState] = useState(() => {
    let isSync = true
    let syncVal = getValue(initialValue)
    subscription.current = observable.subscribe(nextVal => {
      if (isSync) {
        syncVal = nextVal
      } else {
        setState(nextVal)
      }
    })
    isSync = false
    return syncVal
  })

  useIsomorphicEffect(() => {
    // when the observable changes after initial (possibly sync render)
    if (!isInitial.current) {
      subscription.current = observable.subscribe(nextVal => setState(nextVal))
    }
    isInitial.current = false
    return () => {
      if (subscription.current) {
        subscription.current.unsubscribe()
        subscription.current = undefined
      }
    }
  }, [observable])

  return value
}

export function useMemoObservable<T>(
  observableOrFactory: Observable<T> | (() => Observable<T>),
  deps: DependencyList,
): T | undefined
export function useMemoObservable<T>(
  observableOrFactory: Observable<T> | (() => Observable<T>),
  deps: DependencyList,
  initialValue: T | (() => T),
): T
export function useMemoObservable<T>(
  observableOrFactory: Observable<T> | (() => Observable<T>),
  deps: DependencyList,
  initialValue?: T | (() => T),
) {
  return useObservable(
    useMemo(() => getValue(observableOrFactory), deps),
    initialValue,
  )
}
