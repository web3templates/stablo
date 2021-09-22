import {
  map,
  React,
  ReactDOM,
  rxComponent,
  startWith,
  handler
} from '../_utils/globalScope'
//@endimport

const STYLE: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  textAlign: 'center',
  height: 150,
  width: 150,
  border: '1px dashed',
  padding: '1em'
}

const EventHandlersExample = rxComponent(() => {
  const [mouseMoves$, onMouseMove] = handler<React.MouseEvent>()

  const mousePosition$ = mouseMoves$.pipe(
    map(event => ({x: event.clientX, y: event.clientY})),
    startWith(null)
  )
  return mousePosition$.pipe(
    map(position => (
      <div style={STYLE} onMouseMove={onMouseMove}>
        <div style={{width: '100%'}}>
          {position ? (
            <>
              Cursor position: X:{position.x}, Y: {position.y}
            </>
          ) : (
            <>Move mouse here</>
          )}
        </div>
      </div>
    ))
  )
})

ReactDOM.render(
  <EventHandlersExample />,
  document.getElementById('event-handlers-example')
)
