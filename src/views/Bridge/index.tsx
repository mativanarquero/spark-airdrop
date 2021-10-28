import React, { useEffect, useMemo, useRef, useState, useContext } from 'react'
import { useLocation, Route, useRouteMatch } from 'react-router-dom'
import styled, { ThemeContext } from 'styled-components'
import BigNumber from 'bignumber.js'
import { useWeb3React } from '@web3-react/core'
import { Heading, Flex, Image } from '@pancakeswap/uikit'
import { Text, Input, Button, ArrowForwardIcon   } from '@sparkpointio/sparkswap-uikit'
import InputLabel from '@mui/material/InputLabel'
import MenuItem from '@mui/material/MenuItem'
import FormControl from '@mui/material/FormControl'
import Select from '@mui/material/Select'
import InputBase from '@mui/material/InputBase'
import { styled as MuiStyled } from '@mui/material/styles'
import orderBy from 'lodash/orderBy'
import partition from 'lodash/partition'
import { SvgIcon } from '@material-ui/core'
import { useTranslation } from 'contexts/Localization'
import usePersistState from 'hooks/usePersistState'
import { usePools, useFetchCakeVault, useFetchPublicPoolsData, usePollFarmsData, useCakeVault } from 'state/hooks'
import { latinise } from 'utils/latinise'
import FlexLayout from 'components/layout/Flex'
import Page from 'components/layout/Page'
import PageHeader from 'components/PageHeader'
import { StyledHr } from 'views/Farms/components/Divider'
import SearchInput from 'components/SearchInput'
import { OptionProps } from 'components/Select/Select'
import { Pool } from 'state/types'
import useMedia from 'use-media'
import UnlockButton from 'components/UnlockButton'
import PoolCard from './components/PoolCard'
import CakeVaultCard from './components/CakeVaultCard'
import PoolTabButtons from './components/PoolTabButtons'
import BountyCard from './components/BountyCard'
import HelpButton from './components/HelpButton'
import PoolsTable from './components/PoolsTable/PoolsTable'
import { ViewMode } from './components/ToggleView/ToggleView'
import { getAprData, getCakeVaultEarnings } from './helpers'
import { ReactComponent as PoolsDarkLogo } from './components/assets/pool-dark.svg'
import { ReactComponent as PoolsLightLogo } from './components/assets/pool-light.svg'

const CardLayout = styled(FlexLayout)`
  justify-content: flex-start;
`

const PoolControls = styled(Flex)`
  flex-direction: column;
  margin-bottom: 24px;
  ${({ theme }) => theme.mediaQueries.md} {
    flex-direction: row;
  }
`

const SearchSortContainer = styled(Flex)`
  gap: 10px;
  justify-content: space-between;
`

const ControlStretch = styled(Flex)`
  > div {
    flex: 1;
  }
`

const StyledContainer = styled(Flex)`
  padding: 30px;
  height: auto;
  min-height: 40vh;
  justify-content: space-around;
  align-items: center;
  border-radius: 6px;
  border-style: solid solid solid solid;
  border-width: 2px;
  // border-color: ${({ theme }) => theme.colors.primary};
  // border-color: red;
  background-color: #1c304a;
  // style={{ margin: '40px 90px 40px 90px' }}
  @media (max-width: 1920px) {
    margin: 60px 90px 40px 90px;
  }
  @media (max-width: 500px) {
    // margin: 40px 90px 40px 90px
  }
`

export const StyledLink = styled.a`
  text-decoration: none;
  color: ${({ theme }) => theme.colors.primary};
  &:focus,
  &:hover,
  &:visited,
  &:link,
  &:active {
    text-decoration: none;
  }
`
const BootstrapInput = styled(InputBase)(({ theme }) => ({
  'label + &': {
    marginTop: '10px',
  },
  '& .MuiInputBase-input': {
    borderRadius: 4,
    position: 'relative',
    backgroundColor: theme.isDark ? '#000C1A' : '#EFEFFF',
    border: 'none',
    fontSize: 16,
    padding: '10px 26px 10px 12px',
    color: 'white',
    // transition: theme.transitions.create(['border-color', 'box-shadow']),
    '&:focus': {
      borderRadius: 4,
      borderColor: '#80bdff',
      backgroundColor: theme.isDark ? '#000C1A' : '#EFEFFF',
      boxShadow: '0 0 0 0.2rem rgba(0,123,255,.25)',
      color: 'white',
    },
  },
  '*': {
    color: theme.isDark ? '#EFEFFF' : '#000C1A',
  },
}))

const NUMBER_OF_POOLS_VISIBLE = 12

const Pools: React.FC = () => {
  const theme = useContext(ThemeContext)
  const location = useLocation()
  const { t } = useTranslation()
  const { account } = useWeb3React()
  const { pools: poolsWithoutAutoVault, userDataLoaded } = usePools(account)
  const [stakedOnly, setStakedOnly] = usePersistState(false, { localStorageKey: 'pancake_pool_staked' })
  const [numberOfPoolsVisible, setNumberOfPoolsVisible] = useState(NUMBER_OF_POOLS_VISIBLE)
  const [observerIsSet, setObserverIsSet] = useState(false)
  const loadMoreRef = useRef<HTMLDivElement>(null)
  const [viewMode, setViewMode] = usePersistState(ViewMode.TABLE, { localStorageKey: 'pancake_farm_view' })
  const [searchQuery, setSearchQuery] = useState('')
  const [sortOption, setSortOption] = useState('hot')
  const isMobile = useMedia({ maxWidth: 500 })
  const isStandard = useMedia({ maxWidth: 1366 })
  const isDesktop = useMedia({ maxWidth: 1920 })
  const {
    userData: { cakeAtLastUserAction, userShares },
    fees: { performanceFee },
    pricePerFullShare,
    totalCakeInVault,
  } = useCakeVault()
  const accountHasVaultShares = userShares && userShares.gt(0)
  const performanceFeeAsDecimal = performanceFee && performanceFee / 100

  const pools = useMemo(() => {
    const cakePool = poolsWithoutAutoVault.find((pool) => pool.sousId === 0)
    const cakeAutoVault = { ...cakePool, isAutoVault: true }
    return [...poolsWithoutAutoVault]
  }, [poolsWithoutAutoVault])

  // TODO aren't arrays in dep array checked just by reference, i.e. it will rerender every time reference changes?
  const [finishedPools, openPools] = useMemo(() => partition(pools, (pool) => pool.isFinished), [pools])
  const [upcomingPools, notUpcomingPools] = useMemo(() => partition(pools, (pool) => pool.isComingSoon), [pools])
  const stakedOnlyFinishedPools = useMemo(
    () =>
      finishedPools.filter((pool) => {
        if (pool.isAutoVault) {
          return accountHasVaultShares
        }
        return pool.userData && new BigNumber(pool.userData.stakedBalance).isGreaterThan(0)
      }),
    [finishedPools, accountHasVaultShares],
  )
  const stakedOnlyOpenPools = useMemo(
    () =>
      openPools.filter((pool) => {
        if (pool.isAutoVault) {
          return accountHasVaultShares
        }
        return pool.userData && new BigNumber(pool.userData.stakedBalance).isGreaterThan(0)
      }),
    [openPools, accountHasVaultShares],
  )
  const hasStakeInFinishedPools = stakedOnlyFinishedPools.length > 0

  usePollFarmsData()
  useFetchCakeVault()
  useFetchPublicPoolsData()

  // useEffect(() => {
  //   const showMorePools = (entries) => {
  //     const [entry] = entries
  //     if (entry.isIntersecting) {
  //       setNumberOfPoolsVisible((poolsCurrentlyVisible) => poolsCurrentlyVisible + NUMBER_OF_POOLS_VISIBLE)
  //     }
  //   }

  //   if (!observerIsSet) {
  //     const loadMoreObserver = new IntersectionObserver(showMorePools, {
  //       rootMargin: '0px',
  //       threshold: 1,
  //     })
  //     loadMoreObserver.observe(loadMoreRef.current)
  //     setObserverIsSet(true)
  //   }
  // }, [observerIsSet])

  const showFinishedPools = location.pathname.includes('history')
  const showUpcomingPools = location.pathname.includes('upcoming')

  const handleChangeSearchQuery = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(event.target.value)
  }

  const handleSortOptionChange = (option: OptionProps): void => {
    setSortOption(option.value)
  }

  const sortPools = (poolsToSort: Pool[]) => {
    switch (sortOption) {
      case 'apr':
        // Ternary is needed to prevent pools without APR (like MIX) getting top spot
        return orderBy(
          poolsToSort,
          (pool: Pool) => (pool.apr ? getAprData(pool, performanceFeeAsDecimal).apr : 0),
          'desc',
        )
      case 'earned':
        return orderBy(
          poolsToSort,
          (pool: Pool) => {
            if (!pool.userData || !pool.earningTokenPrice) {
              return 0
            }
            return pool.isAutoVault
              ? getCakeVaultEarnings(
                  account,
                  cakeAtLastUserAction,
                  userShares,
                  pricePerFullShare,
                  pool.earningTokenPrice,
                ).autoUsdToDisplay
              : pool.userData.pendingReward.times(pool.earningTokenPrice).toNumber()
          },
          'desc',
        )
      case 'totalStaked':
        return orderBy(
          poolsToSort,
          (pool: Pool) => (pool.isAutoVault ? totalCakeInVault.toNumber() : pool.totalStaked.toNumber()),
          'desc',
        )
      default:
        return poolsToSort
    }
  }

  const poolsToShow = () => {
    let chosenPools = []
    if (showUpcomingPools) {
      chosenPools = stakedOnly ? stakedOnlyFinishedPools : finishedPools // TODO: @koji @mat-ivan Please apply here how to filter upcoming pools
    } else if (showFinishedPools) {
      chosenPools = stakedOnly ? stakedOnlyFinishedPools : finishedPools
    } else {
      chosenPools = stakedOnly ? stakedOnlyOpenPools : openPools
    }

    if (searchQuery) {
      const lowercaseQuery = latinise(searchQuery.toLowerCase())
      chosenPools = chosenPools.filter((pool) =>
        latinise(pool.earningToken.symbol.toLowerCase()).includes(lowercaseQuery),
      )
    }

    return sortPools(chosenPools).slice(0, numberOfPoolsVisible)
  }

  const cardLayout = (
    <CardLayout>
      {poolsToShow().map((pool) =>
        pool.isAutoVault ? (
          <CakeVaultCard key="auto-cake" pool={pool} showStakedOnly={stakedOnly} />
        ) : (
          <PoolCard key={pool.sousId} pool={pool} account={account} />
        ),
      )}
    </CardLayout>
  )

  const tableLayout = <PoolsTable pools={poolsToShow()} account={account} userDataLoaded={userDataLoaded} />
  const { path, url, isExact } = useRouteMatch()
  const [activeSelect, setActiveSelect] = useState(false)

  return (
    <StyledContainer
      style={isStandard ? { marginLeft: '18vw', marginRight: '18vw' } : { marginLeft: '28vw', marginRight: '28vw' }}
    >
      <Flex>
        <Flex>
          <Flex flexDirection="column">
            <Text marginBottom="5px">Asset</Text>
            <FormControl variant="standard">
              {/* <InputLabel id="asset-dropdown" style={{color: theme.colors.text}}>Select Asset</InputLabel> */}
              <Select labelId="asset-dropdown" defaultValue={0} input={<BootstrapInput />}>
                {/* {activeSelect ? <ChevronDown /> : <ChevronUp />} */}
                <MenuItem disabled value={0}>
                  <em>Select Asset</em>
                </MenuItem>
                <MenuItem value={1} divider>
                  <img src="/t_token.png" alt="LogoIcon" width="14px" style={{ verticalAlign: 'middle' }} /> &nbsp; USDT
                </MenuItem>
                <MenuItem value={2} divider>
                  <img src="/srk.png" alt="LogoIcon" width="15px" style={{ verticalAlign: 'middle' }} /> &nbsp; SRKb
                </MenuItem>
                {/* <CollectionsButton setCollection={setCollection} setSelectedCollection={setSelectedCollection} /> */}
              </Select>
            </FormControl>

            <Flex
              flexDirection="row"
              style={{ marginBottom: '40px', marginTop: '40px', columnGap: '30px', justifyContent: 'center' }}
            >
              <FormControl style={{ width: '100%' }} variant="standard">
                <Text marginBottom="5px" id="network-dropdown">From</Text>
                <Select labelId="network-dropdown" defaultValue={0} input={<BootstrapInput />}>
                  <MenuItem disabled value={0}>
                    <em>Select Network</em>
                  </MenuItem>
                  <MenuItem value={1} divider>
                    <img src="/t_token.png" alt="LogoIcon" width="14px" style={{ verticalAlign: 'middle' }} />
                    &nbsp;TRX Network
                  </MenuItem>
                  <MenuItem value={2}>
                    <img src="/t_token.png" alt="LogoIcon" width="14px" style={{ verticalAlign: 'middle' }} />
                    &nbsp; Poly Network
                  </MenuItem>
                  <MenuItem value={3}>
                    <img src="/t_token.png" alt="LogoIcon" width="14px" style={{ verticalAlign: 'middle' }} />
                    &nbsp; Binance Smart Chain
                  </MenuItem>
                </Select>
              </FormControl>

              <Flex style={{ justifyContent: 'center' }}>
                <ArrowForwardIcon
                  style={
                    isStandard
                      ? {
                          backgroundColor: theme.colors.primary,
                          marginTop: '39px',
                          marginBottom: '40px',
                          width: '7vh',
                          height: '8.5vh',
                          borderRadius: '4px',
                          padding: '8px',
                        }
                      : {
                          backgroundColor: theme.colors.primary,
                          marginTop: '38px',
                          marginBottom: '40px',
                          width: '5vh',
                          height: '4.8vh',
                          borderRadius: '6px',
                          padding: '8px',
                        }
                  }
                />
              </Flex>
    
              <FormControl variant="standard" style={{ width: '100%' }}>
                <Text marginBottom="5px" id="network-to-id">To</Text>
                  <Select labelId="network-to-id"  input={<BootstrapInput />} defaultValue={0}>
                  <MenuItem disabled value={0}>
                    <em>Select Network</em>
                  </MenuItem>
                  <MenuItem value={1} divider>
                    <img src="/t_token.png" alt="LogoIcon" width="14px" style={{ verticalAlign: 'middle' }} />
                    &nbsp;TRX Network
                  </MenuItem>
                  <MenuItem value={2}>
                    <img src="/t_token.png" alt="LogoIcon" width="14px" style={{ verticalAlign: 'middle' }} />
                    &nbsp; Poly Network
                  </MenuItem>
                  <MenuItem value={3}>
                    <img src="/t_token.png" alt="LogoIcon" width="14px" style={{ verticalAlign: 'middle' }} />
                    &nbsp; Binance Smart Chain
                  </MenuItem>
                  </Select>
              </FormControl>
            </Flex>
            <Text style={{ marginTop: '-6vh', marginBottom: '40px', fontSize: '14px', fontStyle: 'italic' }}>
              If you have not added Binance Smart Chain network in your MetaMask yet, please click{' '}
              <StyledLink style={{ color: 'white', cursor: 'pointer' }}>Add Network</StyledLink> and continue
            </Text>
            <Text color="text" fontSize="16px" marginBottom="40px">
              Amount
              <Flex>
                <Input
                  type="Number"
                  // disabled
                  // value={collection}
                  // maxLength={158}
                  style={{
                    marginTop: '15px',
                    width: '100%',
                    height: '50px',
                    borderRadius: '6px',
                    backgroundColor: theme.colors.background,
                  }}
                  placeholder={t('Enter amount here')}
                />
              </Flex>
              <Text style={{ fontSize: '14px', marginTop: '2vh' }}>
                You will receive ={' '}
                <img src="/srk.png" alt="LogoIcon" width="20px" height="20px" style={{ verticalAlign: 'middle' }} /> 0
                SRK{' '}
                <Button
                  style={{
                    verticalAlign: 'middle',
                    height: '10%',
                    width: '7%',
                    fontSize: '14px',
                    borderRadius: '4px',
                    cursor: 'none',
                  }}
                >
                  {' '}
                  BEP20
                </Button>
              </Text>
            </Text>
            {!account ? <UnlockButton mt="40px" mb="15px" width="100%" style={{ borderRadius: '6px' }} /> : null}
          </Flex>
        </Flex>
      </Flex>
    </StyledContainer>
  )
}

export default Pools
