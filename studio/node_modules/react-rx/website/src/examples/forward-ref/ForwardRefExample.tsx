import {
  forwardRef,
  map,
  React,
  ReactDOM,
  rxComponent,
  state
} from '../_utils/globalScope'
//@endimport

const CustomInput = forwardRef((props$, ref) => {
  return props$.pipe(
    map((props) => (
      <input
        ref={ref}
        type="text"
        value={props.value}
        onChange={props.onChange}
      />
    ))
  )
})

const ForwardRefExample = rxComponent(() => {
  const [value$, setValue] = state('hello world')
  const inputRef = React.useRef<HTMLInputElement>(null)

  return value$.pipe(
    map((value) => (
      <>
        <button
          onClick={() => {
            inputRef.current?.select()
          }}
        >
          Select text in input
        </button>
        <div>
          <CustomInput
            ref={inputRef}
            value={value}
            onChange={() => {
              setValue(inputRef.current?.value || '')
            }}
          />
        </div>
      </>
    ))
  )
})

ReactDOM.render(
  <ForwardRefExample />,
  document.getElementById('forward-ref-example')
)
