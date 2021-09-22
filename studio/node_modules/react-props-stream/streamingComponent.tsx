import * as React from 'react'
import {Observable, Subject, Subscription} from 'rxjs'

type ObservableFactory<SourceProps> = ((
  props$: Observable<SourceProps>
) => Observable<React.ReactNode>)

interface State {
  node: React.ReactNode
}

export function streamingComponent<SourceProps>(
  observableOrFactory: Observable<SourceProps> | ObservableFactory<SourceProps>
): React.ComponentType<SourceProps> {
  return class StreamingComponent extends React.Component<SourceProps, State> {
    subscription: Subscription
    props$: Subject<SourceProps> = new Subject()

    constructor(props: SourceProps) {
      super(props)
      this.state = {node: null}

      const node$ =
        typeof observableOrFactory === 'function'
          ? observableOrFactory(this.props$.asObservable())
          : observableOrFactory

      let isSync = true
      this.subscription = node$.subscribe(node => {
        this.setStateMaybeSync({node}, isSync)
      })
      this.props$.next(this.props)
      isSync = false
    }

    setStateMaybeSync = (nextState: State, isSync: boolean) => {
      if (isSync) {
        this.state = nextState
      } else {
        this.setState(nextState)
      }
    }

    componentWillUnmount() {
      this.subscription.unsubscribe()
    }

    // todo: figure out a future proof way of handling this
    UNSAFE_componentWillReceiveProps(nextProps: SourceProps) {
      this.props$.next(nextProps)
    }

    render() {
      return this.state.node
    }
  }
}
