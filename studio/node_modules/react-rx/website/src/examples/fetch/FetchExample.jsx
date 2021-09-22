import {
  map,
  React,
  ReactDOM,
  rxComponent,
  switchMap
} from '../_utils/globalScope'
//@endimport

const {distinctUntilChanged} = operators

const FetchComponent = rxComponent(props$ =>
  props$.pipe(
    map(props => props.url),
    distinctUntilChanged(),
    switchMap(url => fetch(url).then(response => response.text())),
    map(responseText => <div>The result was: {responseText}</div>)
  )
)

const URLS = ['/fetch/a.txt', '/fetch/b.txt']

function FetchExample() {
  const [currentUrl, setCurrentUrl] = React.useState('')
  return (
    <div>
      <p>
        {URLS.map(url => (
          <button key={url} onClick={() => setCurrentUrl(url)}>
            {url}
          </button>
        ))}
      </p>
      {currentUrl ? (
        <FetchComponent url={currentUrl} />
      ) : (
        <>Click on url to fetch</>
      )}
    </div>
  )
}

ReactDOM.render(<FetchExample />, document.getElementById('fetch-example'))
