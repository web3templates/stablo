import {Example} from '../../pages/Examples/Examples'

const fs = require('fs')

export const SimpleExample: Example = {
  id: 'stateful-component',
  title: 'A stateful component',
  source: fs.readFileSync(`${__dirname}/Counter.example.tsx`, 'utf-8')
}
