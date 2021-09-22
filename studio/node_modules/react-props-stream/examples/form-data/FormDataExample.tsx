import * as React from 'react'
import {concat, merge, timer} from 'rxjs'
import {concatMap, map, scan, startWith, tap, withLatestFrom} from 'rxjs/operators'
import {createEventHandler} from '../../createEventHandler'
import {streamingComponent} from '../../streamingComponent'
import storage from './storage'

const STORAGE_KEY = '__form-submit-example__'

const save = data =>
  timer(100 + Math.round(Math.random() * 1000)).pipe(
    concatMap(() => storage.set(STORAGE_KEY, data))
  )

interface FormData {
  title?: string
  description?: string
}

interface Props {
  submitState: {status: 'saved' | 'saving'; result: null | FormData}
  formData: FormData
}

export const FormDataExample = streamingComponent(() => {
  const [onChange$, onChange] = createEventHandler<
    React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  >()

  const [onSubmit$, onSubmit] = createEventHandler<React.SyntheticEvent>()

  const formData$ = concat(
    storage.get(STORAGE_KEY, {title: '', description: ''}),
    onChange$.pipe(
      map(event => event.target),
      map(target => ({
        [target.name]: target.value
      }))
    )
  ).pipe(scan((formData, update) => ({...formData, ...update}), {}))

  const submitState$ = onSubmit$.pipe(
    tap(event => event.preventDefault()),
    withLatestFrom(formData$),
    concatMap(([event, formData]) =>
      save(formData).pipe(
        map(res => ({status: 'saved', result: res})),
        startWith({status: 'saving'})
      )
    )
  )

  return merge(
    formData$.pipe(map(formData => ({formData}))),
    submitState$.pipe(map(submitState => ({submitState})))
  ).pipe(
    scan((prev, curr) => ({...prev, ...curr}), {}),
    map((props: Props) => (
      <div>
        <form onSubmit={onSubmit}>
          {props.submitState && <div>{props.submitState.status}</div>}

          <h2>Title</h2>
          <input type="text" name="title" value={props.formData.title} onChange={onChange} />

          <h2>Description</h2>
          <textarea name="description" value={props.formData.description} onChange={onChange} />

          <div>
            <button>Save</button>
          </div>
        </form>
      </div>
    ))
  )
})
