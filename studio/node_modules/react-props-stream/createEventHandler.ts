import {Observable, Subject} from 'rxjs'

export function createEventHandler<Event>(): [Observable<Event>, (event: Event) => void] {
  const events$: Subject<Event> = new Subject()
  return [events$.asObservable(), (event: Event) => events$.next(event)]
}
