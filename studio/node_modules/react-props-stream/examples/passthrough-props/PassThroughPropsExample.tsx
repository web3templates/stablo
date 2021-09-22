import {format, formatDistance, formatRelative, subDays} from 'date-fns'
import * as React from 'react'
import {combineLatest, timer} from 'rxjs'
import {map, share, take} from 'rxjs/operators'
import {withPropsStream} from '../../withPropsStream'

const UPDATE_INTERVAL = 1000
const currentTime$ = timer(0, UPDATE_INTERVAL).pipe(
  take(10),
  map(() => new Date()),
  share()
)

interface OwnerProps {
  time: Date
  includeSeconds?: boolean
}

interface ChildProps extends OwnerProps {
  relativeTime: string
}

const TimeDistance = withPropsStream<OwnerProps, ChildProps>(
  ownerProps$ =>
    combineLatest(currentTime$, ownerProps$).pipe(
      map(([currentTime, ownerProps]) => ({
        ...ownerProps,
        relativeTime: formatDistance(ownerProps.time, currentTime, {
          includeSeconds: ownerProps.includeSeconds
        })
      }))
    ),
  props => <>{props.relativeTime}</>
)

const NOW = new Date()
export const PassThroughPropsExample = () => (
  <>
    <h2>
      With <code>includeSeconds</code> true
    </h2>
    With synchronized updates
    <p>
      Page loaded <TimeDistance time={NOW} includeSeconds /> ago
    </p>
    <p>
      Page loaded <TimeDistance time={NOW} includeSeconds /> ago
    </p>
    <h2>
      Without <code>includeSeconds</code>
    </h2>
    <p>
      Page loaded <TimeDistance time={NOW} /> ago
    </p>
  </>
)
