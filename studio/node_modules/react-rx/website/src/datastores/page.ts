import {map} from 'rxjs/operators'
import {location$} from './location'
import {NOT_FOUND, Page, pages} from '../pages/pages'
import {Observable} from 'rxjs'

export const page$: Observable<Page> = location$.pipe(
  map(
    location =>
      pages.find(page => page.route === location.pathname) || NOT_FOUND
  )
)
