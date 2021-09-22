import {Example} from '../../pages/Examples/Examples'

const fs = require('fs')

export const SharedStateExample: Example = {
  id: 'shared-state',
  title: 'Sharing state',
  source: fs.readFileSync(`${__dirname}/SharedState.example.tsx`, 'utf-8')
}
