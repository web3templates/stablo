import * as React from 'react'
import {map, startWith} from 'rxjs/operators'
import {createEventHandler} from '../../createEventHandler'
import {streamingComponent} from '../../streamingComponent'

const STYLE = {
  height: 200,
  border: '1px solid'
}

export const EventHandlersExample = streamingComponent(() => {
  const [mouseMoves$, onMouseMove] = createEventHandler<React.MouseEvent>()

  return mouseMoves$.pipe(
    map(event => ({x: event.clientX, y: event.clientY})),
    startWith({x: 0, y: 0}),
    map(props => (
      <div>
        <div style={STYLE} onMouseMove={onMouseMove}>
          Move mouse here
        </div>
        Current position:
        <pre>{JSON.stringify(props, null, 2)}</pre>
      </div>
    ))
  )
})
