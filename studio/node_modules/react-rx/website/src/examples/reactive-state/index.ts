import {Example} from '../../pages/Examples/Examples'

const fs = require('fs')

export const ReactiveStateExample: Example = {
  id: 'reactive-state',
  title: 'Reactive component state',
  source: fs.readFileSync(`${__dirname}/ReactiveState.example.jsx`, 'utf-8')
}
