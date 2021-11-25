import React, { useContext, useEffect, useState } from 'react'
import styled, { ThemeContext } from 'styled-components'
import { useWeb3React } from '@web3-react/core'
import { Button, Flex } from '@pancakeswap/uikit'
import { ArrowForwardIcon, Input, Text } from '@sparkpointio/sparkswap-uikit'
import MenuItem from '@mui/material/MenuItem'
import FormControl from '@mui/material/FormControl'
import Select from '@mui/material/Select'
import InputBase from '@mui/material/InputBase'
import { useTranslation } from 'contexts/Localization'
import UnlockButton from 'components/UnlockButton'
import { useMedia } from 'use-media'
import tokens from '../../config/constants/tokens'
import { getAddress } from '../../utils/addressHelpers'
import { BASE_URL } from '../../config'
import bridgeTokens from '../../config/constants/bridge/bridgeTokens'
import bridgeChains from '../../config/constants/bridge/bridgeChains'
import useTokenBalance from '../../hooks/useTokenBalance'
import { getBalanceAmount } from '../../utils/formatBalance'
import ModalInput from '../../components/ModalInput'

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
    height: auto;
    padding-left: 20px;
    padding-right: 20px;
    margin-left: 25px;
    margin-right: 25px;
  }
  @media (min-width: 375px) {
    display: flex;
    justify-content: center;
    margin-left: 15px;
    margin-right: 15px;
  }
`
const ArrowContainer = styled(Flex)`
  justify-content: center;
  align-items: center;
  background-color: ${({ theme }) => theme.colors.primary};
  margin-top: 30px;
  margin-bottom: 40px;
  border-radius: 6px;
  padding: 8px;
  width: 100px;
  height: 4vh;
  @media (max-width: 1366px) {
    height: 7vh;
  }
  @media (max-width: 500px) {
    height: 5.6vh;
  }
  @media (max-width: 414px) {
    height: 40px;
  }
  @media (max-width: 375px) {
    height: 40px;
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

const Bridge: React.FC = () => {
  const theme = useContext(ThemeContext)
  const { t } = useTranslation()
  const { account, chainId } = useWeb3React()
  const isMobile = useMedia({ maxWidth: 500 })
  const isStandard = useMedia({ maxWidth: 1366 })
  const isDesktop = useMedia({ maxWidth: 1920 })
  const [availBalance, setAvailBalance] = useState(0)
  const [bridgeAmount, setBridgeAmount] = useState('')
  const [toBSC, setToBSC] = useState(false)
  const bridgeSymbol = toBSC ? 'SRK' : 'SRKb'

  const [state, setState] = useState({
    bridgeTokenAddress: getAddress(tokens.srkb.address),
    'bridgeTokens': bridgeTokens
  })

  useEffect(() => {
    // setState(prevState => ({
    //   ...prevState,
    //   bridgeTokenAddress: getAddress(tokens.srkb.address),
    //   'bridgeTokens': bridgeTokens
    // }))
    // _setState('bridgeTokenAddress', getAddress(tokens.srkb.address))
    _setState('bridgeTokens', bridgeTokens)
  }, [])

  // const { pools: poolsWithoutAutoVault, userDataLoaded } = usePools(account)

  function _setState(name, value) {
    setState(prevState => ({ ...prevState, [name]: value }))
  }

  function onChange(event) {
    const { name, value } = event.target
    _setState(name, value)
  }

  function GetTokenBalance(tokenAddress) {
    return useTokenBalance(tokenAddress)
  }

  const handleAmountInputChange = (input: string) => {
    setBridgeAmount(input)
  }


  // usePollFarmsData()
  // useFetchCakeVault()
  // useFetchPublicPoolsData()

  const imgUrl = `${BASE_URL}/images/bridge`
  const tokenImgUrl = `${BASE_URL}/images/tokens`

  return (
    <StyledContainer style={isMobile ? { justifyContent: 'center' } : { marginLeft: '28vw', marginRight: '28vw' }}>
      <Flex>
        <Flex>
          <Flex flexDirection="column" style={isMobile ? { width: '300px' } : {}}>
            <Text marginBottom="5px" marginTop="5px">
              Asset
            </Text>
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
              style={
                isMobile
                  ? { marginTop: '35px', columnGap: '10px' }
                  : { marginTop: '40px', columnGap: '30px', justifyContent: 'center' }
              }
            >
              <FormControl style={{ width: '100%' }} variant="standard">
                <Text marginBottom="5px" id="network-dropdown">
                  From
                </Text>
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

              {/* Switch network button */}
              <ArrowContainer>
                <ArrowForwardIcon />
              </ArrowContainer>

              <FormControl variant="standard" style={{ width: '100%' }}>
                <Text marginBottom="5px" id="network-to-id">
                  To
                </Text>
                <Select labelId="network-to-id" input={<BootstrapInput />} defaultValue={0}>
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
            <Text style={{ marginBottom: '40px', fontSize: '14px', fontStyle: 'italic' }}>
              If you have not added Binance Smart Chain network in your MetaMask yet, please click{' '}
              <StyledLink style={{ color: 'white', cursor: 'pointer' }}>Add Network</StyledLink> and continue
            </Text>
            <Text color="text" fontSize="16px" marginBottom="40px">
              Amount
              <Flex>
                {/* <Input
                  type="Number"
                  // disabled
                  // value={collection}
                  // maxLength={158}
                  style={{
                    marginTop: '15px',
                    width: '100%',
                    height: '100px',
                    borderRadius: '6px',
                    backgroundColor: theme.colors.background,
                    fontSize: '32px',
                  }}
                  placeholder={t('Enter amount here')}
                /> */}
                <ModalInput
                  value={bridgeAmount}
                  // onSelectMax={() => { handleMaxFunctionHere() }}
                  onChange={(e) => handleAmountInputChange(e.currentTarget.value)}
                  max=""
                  symbol={bridgeSymbol}
                  addLiquidityUrl=""
                />
              </Flex>
              <Text style={{ color: 'red', fontSize: '14px' }}>Minimum bridgeable amount is 50,000 {bridgeSymbol}</Text>
              <Text color="textSubtle" style={{ fontSize: '14px' }}>
                Available: {availBalance} {bridgeSymbol}
              </Text>
              <Text mt="30px" style={{ fontSize: '14px' }}>
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
            {!account ? <UnlockButton mb="15px" width="100%" style={{ borderRadius: '6px' }} /> : null}
          </Flex>
        </Flex>
      </Flex>
    </StyledContainer>
  )
}

export default Bridge
