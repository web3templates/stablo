import {Observable, OperatorFunction, Subject} from "rxjs"

const pass = (input$: Observable<any>) => input$

export function observableCallback(): [Observable<void>, () => void]
export function observableCallback<T>(): [Observable<T>, (arg: T) => void]

export function observableCallback<T, K>(
  operator: OperatorFunction<T, K>
): [Observable<K>, (arg: T) => void]

export function observableCallback<T, K>(
  operator: OperatorFunction<T, K> = pass
): [Observable<K>, (arg: T) => void] {
  const subject = new Subject<T>()
  return [subject.pipe(operator), (arg: T) => subject.next(arg)]
}
