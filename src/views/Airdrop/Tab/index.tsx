import React from 'react'
import { Button, Flex, Text } from '@sparkpointio/sparkswap-uikit'
import styled from 'styled-components'
import { Grid } from '@mui/material'
import SearchInput from 'components/SearchInput'
import ProjectBoard from './Board'

const ButtonTab = styled(Button)<{ activeIndex: boolean }>`
  border-radius: 20px 20px 0px 0px;
  background-color: ${({ activeIndex, theme }) => (activeIndex ? theme.colors.primary : 'transparent')};
`
const TabContainer = styled(Flex)`
  border-radius: 20px 20px 0px 0px;
  background-color: ${({ theme }) => theme.card.background};
`

// for tab options
const Options = ({ active, setActive }) => {
  return (
    <TabContainer justifyContent="space-between">
      <ButtonTab onClick={() => setActive('UPCOMING')} activeIndex={active === 'UPCOMING'}>
        <Text>Upcoming</Text>
      </ButtonTab>
      <ButtonTab onClick={() => setActive('COMPLETED')} activeIndex={active === 'COMPLETED'}>
        <Text>Completed</Text>
      </ButtonTab>
    </TabContainer>
  )
}

const SearchBar = ({ searchFn }) => {
  return (
    <Grid lg={10}>
    <Flex flex={2} justifyContent="flex-end">
      <SearchInput onChange={(e) => searchFn(e.target.value)} />
    </Flex>
    </Grid>
  )
}

const Tab: React.FC = () => {
  const [active, setActive] = React.useState('UPCOMING')
  const [search, setSearch] = React.useState('')

  return (
    <Flex style={{ width: '100%', marginTop: '20px' }} flexDirection="column">
      <Flex justifyContent="space-between" style={{ width: '100%' }}>
        {/* <Options active={active} setActive={setActive} /> */}
        <SearchBar searchFn={setSearch} />
      </Flex>
      <Flex margin="10px 0px" padding="10px 0px" flexDirection="column">
        <ProjectBoard tab={active} />
      </Flex>
    </Flex>
  )
}

export default Tab
