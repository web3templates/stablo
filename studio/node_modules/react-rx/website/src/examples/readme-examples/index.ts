import ReadmeExamples from './README.mdx'

const fs = require('fs')

export default {
  name: 'readme-examples',
  component: ReadmeExamples,
  title: 'Readme examples',
  type: 'mixed',
  source: fs.readFileSync(`${__dirname}/ReadmeExamples.tsx`, 'utf-8')
}
