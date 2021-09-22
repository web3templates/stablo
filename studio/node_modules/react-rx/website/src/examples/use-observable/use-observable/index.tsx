import {Example} from '../../../pages/Examples/Examples'

const fs = require('fs')

export const UseObservableExample: Example = {
  id: 'use-observable',
  title: 'Use observable',
  source: fs.readFileSync(`${__dirname}/UseObservableExample.tsx`, 'utf-8')
}
