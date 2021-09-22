import {rxComponent} from 'react-rx'
import {location$} from '../../datastores/location'
import {map} from 'rxjs/operators'
import {Examples} from './Examples'
import * as React from 'react'

export const ExamplesPage = rxComponent(
  location$.pipe(
    map(location => (
      <Examples selectedExampleName={location.hash?.substring(1)} />
    ))
  )
)
