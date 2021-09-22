import {Example} from '../../pages/Examples/Examples'

const fs = require('fs')

export const HelloWorldExample: Example = {
  id: 'hello-world',
  title: 'A simple component',
  source: fs.readFileSync(`${__dirname}/HelloWorld.example.jsx`, 'utf-8')
}
