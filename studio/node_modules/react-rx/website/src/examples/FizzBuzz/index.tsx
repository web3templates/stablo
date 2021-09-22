import {Example} from '../../pages/Examples/Examples'

const fs = require('fs')

export const FizzBuzzExample: Example = {
  id: 'fizz-buzz',
  title: 'Fizz Buzz',
  source: fs.readFileSync(`${__dirname}/FizzBuzzExample.tsx`, 'utf-8')
}
