import * as React from 'react'
import {navigate} from '../datastores/location'

export function Link(props: React.ComponentProps<'a'>) {
  const onClick = React.useCallback(
    event => {
      if (props.onClick) {
        props.onClick(event)
      }
      event.preventDefault()
      if (props.href) {
        navigate(props.href)
      }
    },
    [props.href, props.onClick]
  )
  return <a {...props} onClick={onClick} />
}
