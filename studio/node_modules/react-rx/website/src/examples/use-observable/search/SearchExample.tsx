import {
  map,
  React,
  ReactDOM,
  timer,
  useMemoObservable,
  of,
  operators,
  filter,
  switchMap
} from '../../_utils/globalScope'
import {Observable} from 'rxjs'
//@endimport

const {distinctUntilChanged, debounceTime} = operators

interface SearchResult {
  keyword: string
  hits: Hit[]
}

interface Hit {
  title: string
}

const range = (len: number) => {
  const res = []
  for (let i = 0; i <= len; i++) {
    res.push(null)
  }
  return res
}

// A search function that takes longer time to complete for shorter keywords
// e.g. a keyword of one character takes 9 seconds while a keyword of 9 characters takes 1 second
const search = (keyword: string): Observable<SearchResult> => {
  const delay = Math.max(1, Math.round(10 - keyword.length))
  return timer(delay * 200).pipe(
    map(() => range(delay).map((_, i) => ({title: `Hit #${i}`}))),
    map((hits) => ({keyword, hits}))
  )
}

function SearchExample() {
  const [keyword, setKeyword] = React.useState('')
  return (
    <>
      <input
        type="search"
        style={{width: '100%'}}
        value={keyword}
        placeholder="Type a keyword to search"
        onChange={(event) => setKeyword(event.target.value)}
      />
      <div>
        The more characters you type, the faster the results will appear
      </div>
      {useMemoObservable(() =>
        of(keyword).pipe(
          debounceTime(200),
          distinctUntilChanged(),
          filter((v) => v !== ''),
          switchMap((kw: string) => search(kw)),
          map((result: SearchResult) => (
            <>
              <h1>Searched for {result.keyword}</h1>
              <div>Got {result.hits.length} hits</div>
              <ul>
                {result.hits.map((hit, i) => (
                  <li key={i}>{hit.title}</li>
                ))}
              </ul>
            </>
          ))
        ),
        [keyword]
      )}
    </>
  )
}

ReactDOM.render(<SearchExample />, document.getElementById('search-example'))
