import {createBrowserHistory, Location} from 'history'
import {Observable} from 'rxjs'
import {publishReplay, refCount} from 'rxjs/operators'

const history = createBrowserHistory()

export const location$ = new Observable<Location>((subscriber) => {
  subscriber.next(history.location)
  return history.listen((update) => subscriber.next(update.location))
}).pipe(publishReplay(1), refCount())

export const navigate = (url: string) => {
  history.push(url)
}
