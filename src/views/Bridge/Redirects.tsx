/* eslint-disable import/prefer-default-export */

import React from 'react'
import { Redirect, RouteComponentProps } from 'react-router-dom'

export function RedirectToBridge({ location }: RouteComponentProps) {
  return <Redirect to={{ ...location, pathname: '/bridge' }} />
}
