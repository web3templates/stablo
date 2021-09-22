import * as React from 'react'
import * as ReactDOM from 'react-dom'
import {Observable} from 'rxjs'
import {map} from 'rxjs/operators'
import {streamingComponent} from '../streamingComponent'
import {Examples} from './Examples'

const hash$: Observable<string> = new Observable(subscriber => {
  const emitHash = () => subscriber.next(window.location.hash)
  emitHash()
  window.addEventListener('hashchange', emitHash, false)
  return () => {
    window.removeEventListener('hashchange', emitHash, false)
  }
})

const App = streamingComponent(() =>
  hash$.pipe(
    map(hash => hash.substring(1)),
    map(hash => <Examples selectedExampleName={hash} />)
  )
)

ReactDOM.render(<App />, document.getElementById('main'))
