import * as React from 'react'
import {timer} from 'rxjs'
import {map} from 'rxjs/operators'
import {withPropsStream} from '../../withPropsStream'

const numbers$ = timer(0, 100).pipe(map(n => ({number: n})))

const MyComponent = props => <>The number is {props.number}</>

export const SimpleExample = withPropsStream(numbers$, MyComponent)
