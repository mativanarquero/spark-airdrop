import React from 'react'
import { Text } from '@sparkpointio/sparkswap-uikit'
import CTable from '../CTable'

const Upcoming: React.FC = () => {
  return <CTable />
}

const Completed: React.FC = () => {
  // Content for completed tab here
  return <Text />
}

const Board: React.FC<{ tab: string }> = ({ tab }) => {
  return tab === 'UPCOMING' ? <Upcoming /> : tab === 'COMPLETED' && <Completed />
}

export default Board
