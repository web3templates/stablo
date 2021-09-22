import * as React from 'react'
import {concat, of, timer} from 'rxjs'
import {map, mapTo, take} from 'rxjs/operators'
import {withPropsStream} from '../../withPropsStream'

// this will synchronously set the state before the component mounts, and thereafter
// wait 1 second before starting updating every 500ms

const UPDATE_COUNT = 10

export const SyncExample = withPropsStream(
  () =>
    concat(
      of(0).pipe(mapTo('First render is sync! (waiting…)')),
      timer(1000, 500).pipe(
        map(n => `Update #${n + 1} of ${UPDATE_COUNT}`),
        take(UPDATE_COUNT)
      ),
      of('Completed!')
    ).pipe(map(message => ({message}))),
  props => <>{props.message}</>
)
