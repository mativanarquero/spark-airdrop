/* eslint-disable import/prefer-default-export */

import React from 'react'
import { Redirect, RouteComponentProps } from 'react-router-dom'

export function RedirectToAirdrop({ location }: RouteComponentProps) {
  return <Redirect to={{ ...location, pathname: '/airdrop' }} />
}
