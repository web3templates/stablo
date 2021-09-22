import {Example} from '../../pages/Examples/Examples'

const fs = require('fs')

export const EventHandlersExample: Example = {
  id: 'event-handlers',
  title: 'Event handlers',
  source: fs.readFileSync(`${__dirname}/EventHandlersExample.tsx`, 'utf-8')
}
