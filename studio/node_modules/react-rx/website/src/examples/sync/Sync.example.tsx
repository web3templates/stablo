import * as React from 'react'
import {from, ReactDOM, rxComponent} from '../_utils/globalScope'
//@endimport

const Sync = rxComponent(
  from(['This', 'will', 'only', 'render', 'once!'])
)

ReactDOM.render(<Sync />, document.getElementById('counter-example'))
