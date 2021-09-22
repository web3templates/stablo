import * as React from 'react'
import {ErrorsExample} from './errors'
import {EventHandlersExample} from './event-handlers'
import {FetchExample} from './fetch'
import { FormDataExample } from "./form-data";
import {PassThroughPropsExample} from './passthrough-props'
import {SearchExample} from './search'
import {SimpleExample} from './simple'
import {SyncExample} from './sync'
import {WithObservableExample} from './with-observable'

interface Example {
  title: string
  component: React.ComponentType
}

const examples: {[exampleName: string]: Example} = {
  search: {title: 'Search', component: SearchExample},
  sync: {title: 'Sync', component: SyncExample},
  simple: {title: 'Simple', component: SimpleExample},
  eventHandlers: {title: 'Event handlers', component: EventHandlersExample},
  fetch: {title: 'Fetch', component: FetchExample},
  passThroughProps: {title: 'Pass through props', component: PassThroughPropsExample},
  errors: {title: 'Errors', component: ErrorsExample},
  formData: {title: 'Form data', component: FormDataExample},
  withObservable: {title: 'WithObservable component', component: WithObservableExample}
}

const LINK_STYLE = {
  padding: 4
}
const SELECTED_LINK_STYLE = {
  ...LINK_STYLE,
  backgroundColor: '#dddddd'
}
export class Examples extends React.Component<{selectedExampleName: string}> {
  render() {
    const {selectedExampleName} = this.props
    const selectedExample = examples[selectedExampleName] || examples[Object.keys(examples)[0]]
    const ExampleComponent = selectedExample.component
    return (
      <>
        {Object.keys(examples).map(exampleName => (
          <a
            key={exampleName}
            href={`#${exampleName}`}
            style={selectedExample === examples[exampleName] ? SELECTED_LINK_STYLE : LINK_STYLE}
          >
            {examples[exampleName].title}
          </a>
        ))}
        <h2>{selectedExample.title}</h2>
        <ExampleComponent />
      </>
    )
  }
}
