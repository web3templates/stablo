import {Example} from '../../pages/Examples/Examples'
import storage from './storage'
import styled from 'styled-components'

const fs = require('fs')

export const TodoAppExample: Example = {
  id: 'todo-app',
  title: 'An Application',
  scope: {storage, styled},
  source: fs.readFileSync(`${__dirname}/TodoApp.example.tsx`, 'utf-8')
}
