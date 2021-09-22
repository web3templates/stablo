import {Example} from '../../pages/Examples/Examples'

const fs = require('fs')

export const UseElementExample: Example = {
  id: 'use-element',
  title: 'Use element',
  source: fs.readFileSync(`${__dirname}/UseElementExample.tsx`, 'utf-8')
}
