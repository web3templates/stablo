import * as React from 'react'
import {Observable} from 'rxjs'
import {map} from 'rxjs/operators'
import {wrapDisplayName} from './displayName'
import {reactiveComponent} from './reactiveComponent'

type ObservableFactory<SourceProps, TargetProps> = (
  props$: Observable<SourceProps>,
) => Observable<TargetProps>

/**
 * @deprecated Use reactiveComponent instead
 */
export function withPropsStream<SourceProps, TargetProps>(
  observableOrFactory: Observable<TargetProps> | ObservableFactory<SourceProps, TargetProps>,
  TargetComponent: React.ComponentType<TargetProps>,
) {
  const ComposedComponent = reactiveComponent<SourceProps>(sourceProps$ => {
    const targetProps$ =
      typeof observableOrFactory === 'function'
        ? observableOrFactory(sourceProps$)
        : observableOrFactory
    return targetProps$.pipe(map(props => <TargetComponent {...props} />))
  })
  ComposedComponent.displayName = wrapDisplayName(TargetComponent, 'withPropsStream')
  return ComposedComponent
}
