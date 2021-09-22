/* eslint-disable @typescript-eslint/no-use-before-define */
import {
  map,
  React,
  ReactDOM,
  rxComponent,
  switchMap,
  timer,
  state
} from '../_utils/globalScope'
import styled from 'styled-components'
import bezier from 'bezier-easing'
//@endimport

const BALL_SIZE = 30
const BOX_SIZE = 300

const MAX_TOP = BOX_SIZE - BALL_SIZE

function easeCustom(n: number) {
  // implement your own easing function here by returning a number in the range of [0, 1]
  return n
}

type EasingName = keyof typeof EASINGS

const AnimationExample = rxComponent(() => {
  const [easing$, setEasing] = state<EasingName>('easeCustom')
  return easing$.pipe(
    switchMap((easing: EasingName) =>
      timer(0, 16).pipe(
        map((n) => (n % MAX_TOP) * 2),
        map((n) => (n > MAX_TOP ? MAX_TOP * 2 - n : n)),
        map((linearTop): [number, EasingName] => [
          EASINGS[easing](linearTop / MAX_TOP) * MAX_TOP,
          easing
        ])
      )
    ),
    map(([top, currentEasing]) => (
      <>
        <BoxWrapper>
          <Box>
            <Ball style={{top}} />
          </Box>
        </BoxWrapper>
        <SelectWrapperLabel>Easing function:</SelectWrapperLabel>
        <SelectWrapper>
          {Object.keys(EASINGS).map((easingName) => (
            <label key={easingName} className={easingName === currentEasing ? 'selected' : ''}>
              <input
                tabIndex={0}
                type="checkbox"
                checked={easingName === currentEasing}
                key={easingName}
                onChange={() => setEasing(easingName as EasingName)}
              />
              {easingName.substring(4)}
            </label>
          ))}
        </SelectWrapper>
      </>
    ))
  )
})

ReactDOM.render(
  <AnimationExample />,
  document.getElementById('animation-example')
)

// --- easing definitions and stylings
const EASINGS = {
  easeCustom: easeCustom,
  easeInSine: bezier(0.47, 0, 0.745, 0.715),
  easeOutSine: bezier(0.39, 0.575, 0.565, 1),
  easeInOutSine: bezier(0.445, 0.05, 0.55, 0.95),
  easeInQuad: bezier(0.55, 0.085, 0.68, 0.53),
  easeOutQuad: bezier(0.25, 0.46, 0.45, 0.94),
  easeInOutQuad: bezier(0.455, 0.03, 0.515, 0.955),
  easeInCubic: bezier(0.55, 0.055, 0.675, 0.19),
  easeOutCubic: bezier(0.215, 0.61, 0.355, 1),
  easeInOutCubic: bezier(0.645, 0.045, 0.355, 1),
  easeInQuart: bezier(0.895, 0.03, 0.685, 0.22),
  easeOutQuart: bezier(0.165, 0.84, 0.44, 1),
  easeInOutQuart: bezier(0.77, 0, 0.175, 1),
  easeInQuint: bezier(0.755, 0.05, 0.855, 0.06),
  easeOutQuint: bezier(0.23, 1, 0.32, 1),
  easeInOutQuint: bezier(0.86, 0, 0.07, 1),
  easeInExpo: bezier(0.95, 0.05, 0.795, 0.035),
  easeOutExpo: bezier(0.19, 1, 0.22, 1),
  easeInOutExpo: bezier(1, 0, 0, 1),
  easeInCirc: bezier(0.6, 0.04, 0.98, 0.335),
  easeOutCirc: bezier(0.075, 0.82, 0.165, 1),
  easeInOutCirc: bezier(0.785, 0.135, 0.15, 0.86),
  easeInBack: bezier(0.6, -0.28, 0.735, 0.045),
  easeOutBack: bezier(0.175, 0.885, 0.32, 1.275),
  easeInOutBack: bezier(0.68, -0.55, 0.265, 1.55),
  easeLinear: (n: number) => n
}

const BoxWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`
const Box = styled.div`
  position: relative;
  border: 1px solid #555;
  height: ${BOX_SIZE}px;
  width: ${BOX_SIZE}px;
`

const Ball = styled.div`
  position: absolute;
  border-radius: 100%;
  background-color: #901a3b;
  width: ${BALL_SIZE}px;
  height: ${BALL_SIZE}px;
  left: ${BOX_SIZE / 2 - BALL_SIZE / 2}px;
`

const SelectWrapperLabel = styled.h2`
  margin-top: 2em;
  font-size: 0.8em;
`

const SelectWrapper = styled.div`
  display: flex;
  flex-wrap: wrap;
  flex-direction: row;
  input[type='checkbox'] {
    opacity: 0;
    position: absolute;
    height: 1px;
    width: 1px;
  }
  font-size: 90%;
  label {
    border-radius: 3px;
    padding: 0 2px;
    margin: 0 2px;
  }
  label:focus-within {
    color: #333;
    background-color: #ccc;
  }
  label.selected {
    background-color: #5588ee;
    color: #333;
  }
`
