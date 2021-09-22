import {Example} from '../../pages/Examples/Examples'

const fs = require('fs')

export const ErrorsExample: Example = {
  id: 'errors',
  title: 'Errors',
  source: fs.readFileSync(`${__dirname}/Errors.example.jsx`, 'utf-8')
}
