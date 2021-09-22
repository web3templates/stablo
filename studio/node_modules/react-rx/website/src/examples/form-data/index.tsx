import {Example} from '../../pages/Examples/Examples'
import storage from './storage'
import styled from 'styled-components'

const fs = require('fs')

export const FormDataExample: Example = {
  id: 'form-data',
  title: 'Form data',
  scope: {storage, styled},
  source: fs.readFileSync(`${__dirname}/FormDataExample.jsx`, 'utf-8')
}
