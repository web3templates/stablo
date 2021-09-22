import {Example} from '../../pages/Examples/Examples'
import styled from 'styled-components'
import bezier from 'bezier-easing'

const fs = require('fs')

export const AnimationExample: Example = {
  id: 'animation',
  title: 'Animation',
  prelude: `import styled from 'styled-components'
import bezier from 'bezier-easing'
`,
  scope: {bezier, styled},
  source: fs.readFileSync(`${__dirname}/AnimationExample.tsx`, 'utf-8')
}
