import * as React from 'react'
import {Observable} from 'rxjs'
import {map} from 'rxjs/operators'
import {streamingComponent} from './streamingComponent'

type ObservableFactory<SourceProps, TargetProps> = ((
  props$: Observable<SourceProps>
) => Observable<TargetProps>)

export function withPropsStream<SourceProps, TargetProps>(
  observableOrFactory: Observable<TargetProps> | ObservableFactory<SourceProps, TargetProps>,
  TargetComponent: React.ComponentType<TargetProps>
) {
  const ComposedComponent = streamingComponent<SourceProps>(sourceProps$ => {
    const targetProps$ =
      typeof observableOrFactory === 'function'
        ? observableOrFactory(sourceProps$)
        : observableOrFactory
    return targetProps$.pipe(map(props => <TargetComponent {...props} />))
  })

  const displayName =
    typeof TargetComponent === 'string'
      ? TargetComponent
      : TargetComponent.displayName || (TargetComponent as any).name || 'Component'

  ComposedComponent.displayName = `withPropsStream(${displayName})`
  return ComposedComponent
}
