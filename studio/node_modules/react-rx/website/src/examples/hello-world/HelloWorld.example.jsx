import {of, React, ReactDOM, rxComponent} from '../_utils/globalScope'
//@endimport

const HelloWorld = rxComponent(of(<div>Hello World!</div>))

ReactDOM.render(<HelloWorld />, document.getElementById('hello-world-example'))
