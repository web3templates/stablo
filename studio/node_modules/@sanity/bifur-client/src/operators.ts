import {Observable, timer, race} from 'rxjs'
import {mergeMapTo} from 'rxjs/operators'

// Operator that will time out using <withObservable> if <due> time passes before receiving the first value
export const timeoutFirstWith = <T>(
  due: number,
  withObservable: Observable<any>,
) => {
  return (input$: Observable<T>): Observable<T> => {
    return race(input$, timer(due).pipe(mergeMapTo(withObservable)))
  }
}
