import {Example} from '../../pages/Examples/Examples'

const fs = require('fs')

export const ForwardRefExample: Example = {
  id: 'forward-ref',
  title: 'Forward Ref',
  source: fs.readFileSync(`${__dirname}/ForwardRefExample.tsx`, 'utf-8')
}
