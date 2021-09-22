import * as React from 'react'
import {Observable, timer} from 'rxjs'
import {debounceTime, distinctUntilChanged, filter, map, switchMap, tap} from 'rxjs/operators'
import {withPropsStream} from '../../withPropsStream'

interface SearchHitsSourceProps {
  keyword: string
}

interface SearchResult {
  keyword: string
  hits: Hit[]
}
interface Hit {
  title: string
}

interface SearchHitsTargetProps {
  result: SearchResult
}

const range = len => {
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
    map(hits => ({keyword, hits}))
  )
}

const mapOwnerPropsToChildProps = (
  sourceProps$: Observable<SearchHitsSourceProps>
): Observable<SearchHitsTargetProps> =>
  sourceProps$.pipe(
    map(props => props.keyword),
    debounceTime(200),
    distinctUntilChanged(),
    filter(Boolean),
    switchMap(keyword => search(keyword)),
    map(result => ({result}))
  )

const SearchHits = withPropsStream(mapOwnerPropsToChildProps, props => (
  <>
    <h1>Searched for {props.result.keyword}</h1>
    <div>Got {props.result.hits.length} hits</div>
    <ul>
      {props.result.hits.map((hit, i) => (
        <li key={i}>{hit.title}</li>
      ))}
    </ul>
  </>
))

interface State {
  keyword: string
}

export class SearchExample extends React.Component {
  state: State = {
    keyword: ''
  }
  render() {
    return (
      <>
        <input
          type="search"
          size={100}
          value={this.state.keyword}
          placeholder="Type a keyword to search"
          onChange={event => this.setState({keyword: event.target.value})}
        />
        <div>The more characters you type, the faster the results will appear</div>
        <SearchHits keyword={this.state.keyword} />
      </>
    )
  }
}
