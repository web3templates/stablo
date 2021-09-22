import {Example} from '../../pages/Examples/Examples'
const fs = require('fs')

export const SearchExample: Example = {
  id: 'search',
  title: 'Search',
  source: fs.readFileSync(`${__dirname}/SearchExample.tsx`, 'utf-8')
}
