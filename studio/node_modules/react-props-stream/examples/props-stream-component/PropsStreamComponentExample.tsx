import * as React from 'react'
import {distinctUntilChanged, map, switchMap} from 'rxjs/operators'
import {streamingComponent} from '../../streamingComponent'

const FetchComponent = streamingComponent<{url: string}>(props$ =>
  props$.pipe(
    map(props => props.url),
    distinctUntilChanged(),
    switchMap(url => fetch(url).then(response => response.text())),
    map(responseText => <div>The result was: {responseText}</div>)
  )
)

const URLS = ['/fetch/a.txt', '/fetch/b.txt']

export class PropsStreamComponentExample extends React.Component {
  state = {currentUrl: ''}

  render() {
    const {currentUrl} = this.state
    return (
      <div>
        {URLS.map(url => (
          <button key={url} onClick={() => this.setState({currentUrl: url})}>
            {url}
          </button>
        ))}

        {currentUrl ? <FetchComponent url={currentUrl} /> : 'Click on url to fetch'}
      </div>
    )
  }
}
