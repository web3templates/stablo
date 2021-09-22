import * as React from 'react'

interface EvalErrorBoundaryProps {
  code: string
  renderError: (error: Error) => React.ReactNode
}

interface EvalErrorBoundaryState {
  error: Error | null
}

class EvalErrorBoundary extends React.Component<
  EvalErrorBoundaryProps,
  EvalErrorBoundaryState
> {
  state: EvalErrorBoundaryState = {error: null}

  static getDerivedStateFromError(error: Error) {
    return {error}
  }

  componentDidUpdate(
    prevProps: Readonly<EvalErrorBoundaryProps>,
    prevState: Readonly<EvalErrorBoundaryState>
  ) {
    if (prevProps.code !== this.props.code) {
      this.setState({error: null})
    }
  }

  render() {
    const {error} = this.state
    return error ? this.props.renderError(error) : this.props.children
  }
}

type Runner = (code: string) => React.ReactNode

const Eval = (props: {with: Runner; code: string}) => (
  <>{props.with(props.code)}</>
)

interface Props {
  code: string
  renderError: (error: Error) => React.ReactNode
  evalWith: Runner
}

export function EvalCode(props: Props) {
  return (
    <EvalErrorBoundary code={props.code} renderError={props.renderError}>
      <Eval with={props.evalWith} code={props.code} />
    </EvalErrorBoundary>
  )
}
