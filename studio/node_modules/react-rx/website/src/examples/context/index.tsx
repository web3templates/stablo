import {Example} from '../../pages/Examples/Examples'

const fs = require('fs')

export const ContextExample: Example = {
  id: 'react-context',
  title: 'React context',
  source: fs.readFileSync(`${__dirname}/Context.example.jsx`, 'utf-8')
}
