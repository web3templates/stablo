import * as React from 'react'
import {RefractorSyntax} from 'refractor'

declare function Refractor(props: Refractor.Props): JSX.Element
declare namespace Refractor {
  export interface MarkerProps {
    className: string
    markers: (Marker | number)[]
    children?: React.ReactNode
  }

  export interface Marker {
    line: number
    className?: string
    component?: string | React.FunctionComponent<MarkerProps> | React.ComponentClass<MarkerProps>
  }

  export interface Props {
    value: string
    language: string
    className?: string
    inline?: boolean
    markers?: (Marker | number)[]
  }

  var registerLanguage: (lang: RefractorSyntax) => void
  var hasLanguage: (lang: RefractorSyntax) => boolean
}

export = Refractor
