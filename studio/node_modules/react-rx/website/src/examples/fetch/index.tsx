import {Example} from '../../pages/Examples/Examples'

const fs = require('fs')

export const FetchExample: Example = {
  id: 'fetch',
  title: 'Fetch',
  source: fs.readFileSync(`${__dirname}/FetchExample.jsx`, 'utf-8')
}
