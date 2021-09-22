import {Example} from '../../pages/Examples/Examples'

const fs = require('fs')

export const HooksInteropExample: Example = {
  id: 'hooks-interop',
  title: 'React hooks interop',
  source: fs.readFileSync(`${__dirname}/HooksInterop.example.tsx`, 'utf-8')
}
