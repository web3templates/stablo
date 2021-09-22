import {Example} from '../../pages/Examples/Examples'

const fs = require('fs')

export const TickExample: Example = {
  id: 'ticker',
  title: 'Ticker',
  source: fs.readFileSync(`${__dirname}/TickExample.jsx`, 'utf-8')
}
