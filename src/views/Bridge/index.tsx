import React, { useCallback, useContext, useEffect, useState } from 'react'
import styled, { ThemeContext } from 'styled-components'
import { useWeb3React } from '@web3-react/core'
import { Flex } from '@pancakeswap/uikit'
import { TokenAmount } from '@pancakeswap-libs/sdk'
import { ArrowForwardIcon, Button, Text } from '@sparkpointio/sparkswap-uikit'
import MenuItem from '@mui/material/MenuItem'
import FormControl from '@mui/material/FormControl'
import Select from '@mui/material/Select'
import InputBase from '@mui/material/InputBase'
import BigNumber from 'bignumber.js'
import ModalInput from 'components/ModalInput'
import { useTranslation } from 'contexts/Localization'
import { useBridges } from 'state/hooks'
import useMedia from 'use-media'
import UnlockButton from 'components/UnlockButton'
import srkTokenIcon from './components/assets/srk.png'
import testTokenIcon from './components/assets/t_token.png'
import { getAddress } from '../../utils/addressHelpers'
import { BASE_URL, MAINNET_ETH_CHAIN_ID } from '../../config'
import { getChainImg, getChainName, getTokenIcon, getTokenType } from './helpers'
import { useBridgeAllowance } from '../../hooks/useAllowance'
import { useApproveBridge } from '../../hooks/useApprove'
import useBridge from '../../hooks/useBridge'
import { BIG_TEN } from '../../utils/bigNumber'
import useTokenBalance from '../../hooks/useTokenBalance'
import { getBalanceAmount } from '../../utils/formatBalance'


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


const Bridge: React.FC = () => {
  const theme = useContext(ThemeContext)
  const { t } = useTranslation()
  const { account, chainId } = useWeb3React()
  const currentChain = chainId ?? parseInt(MAINNET_ETH_CHAIN_ID)
  const isMobile = useMedia({ maxWidth: 500 })
  const [availBalance, setAvailBalance] = useState('0')
  const [bridgeAmount, setBridgeAmount] = useState('')
  const [receiveAmount, setReceiveAmount] = useState(0)
  const [requestedApproval, setRequestedApproval] = useState(false)

  const bridges = useBridges()
  const activeBridge = bridges.data.filter(bridge => {
    return bridge.chainId === currentChain
  })[0]
  const [bridgeToken, setBridgeToken] = useState(activeBridge.tokens[0])
  const [bridgeTokenSymbol, setBridgeTokenSymbol] = useState(activeBridge.tokens[0].symbol)
  const allowance = useBridgeAllowance(getAddress(bridgeToken.address, currentChain.toString()), activeBridge.address)
  const [isApproved, setIsApproved] = useState(false)

  const { onApprove } = useApproveBridge(getAddress(bridgeToken.address, currentChain.toString()), activeBridge.address)
  const handleApprove = useCallback(async () => {
    try {
      setRequestedApproval(true)
      await onApprove()
      // dispatch(fetchFarmUserDataAsync())
      setIsApproved(true)
      setRequestedApproval(false)
    } catch (e) {
      setRequestedApproval(false)
      console.error(e)
    }
  }, [onApprove])

  const { onBridge } = useBridge(activeBridge)

  const handleTransfer = useCallback(async () => {
    try {
      setRequestedApproval(true)
      await onBridge(new BigNumber(bridgeAmount).times(BIG_TEN.pow(bridgeToken.decimals)).toString(), getAddress(bridgeToken.address, currentChain.toString()))
      // dispatch(fetchFarmUserDataAsync())
      setRequestedApproval(false)
    } catch (e) {
      setRequestedApproval(false)
      console.error(e)
    }
    // dispatch(fetchFarmUserDataAsync({ account, pids: [pid] }))
  }, [onBridge, bridgeAmount, bridgeToken, currentChain])


  const tokenBalance = useTokenBalance(getAddress(bridgeToken.address, currentChain.toString()))
  const formatTokenBalance = getBalanceAmount(tokenBalance.balance, bridgeToken.decimals).toFormat(6)

  useEffect(() => {
    setIsApproved(account && allowance && new BigNumber(allowance).isGreaterThan(0))

    setBridgeTokenSymbol(bridgeToken.symbol === 'SRK' && (currentChain === 56 || currentChain === 97)? 'SRKb': bridgeToken.symbol)
  }, [setIsApproved, account, allowance, bridgeToken, currentChain])

  // const [state, setState] = useState({
  //   bridgeTokenAddress: getAddress(tokens.srkb.address),
  //   'bridgeTokens': bridgeTokens
  // })

  // // Set default bridge network - from BSC to ETH
  // useEffect(() => {
  //   if (toBSC) {
  //     setToBSC(true)
  //   }
  // }, [toBSC])

  // function onChange(event) {
  //   const { name, value } = event.target
  //   // _setState(name, value)
  // }
  //
  // function GetTokenBalance(tokenAddress) {
  //   // return useTokenBalance(tokenAddress)
  // }

  // Prepare function to handle bridge amount input
  const handleAmountInputChange = (input: string) => {
    setBridgeAmount(input)
  }


  return (
    <StyledContainer style={isMobile ? { justifyContent: 'center' } : { marginLeft: '28vw', marginRight: '28vw' }}>
      <Flex>
        <Flex>
          <Flex flexDirection='column' style={isMobile ? { width: '300px' } : {}}>
            <Text marginBottom='5px' marginTop='5px'>
              Asset
            </Text>
            <FormControl variant='standard'>
              {/* <InputLabel id="asset-dropdown" style={{color: theme.colors.text}}>Select Asset</InputLabel> */}
              <Select labelId='asset-dropdown' defaultValue={activeBridge.tokens[0]} onChange={setBridgeToken}
                      input={<BootstrapInput />}>
                {/* {activeSelect ? <ChevronDown /> : <ChevronUp />} */}
                <MenuItem disabled value={0}>
                  <em>Select Asset</em>
                </MenuItem>

                {activeBridge.tokens.map(token => {
                  return <MenuItem value={token} divider key={token.chainId}>
                    <img src={getTokenIcon(token)} alt='LogoIcon'
                         width='14px'
                         style={{ verticalAlign: 'middle' }} /> &nbsp;
                    {token.symbol}
                  </MenuItem>
                })}
                {/* <CollectionsButton setCollection={setCollection} setSelectedCollection={setSelectedCollection} /> */}
              </Select>
            </FormControl>

            <Flex
              flexDirection='row'
              style={
                isMobile
                  ? { marginTop: '35px', columnGap: '10px' }
                  : { marginTop: '40px', columnGap: '30px', justifyContent: 'center' }
              }
            >
              <FormControl style={{ width: '100%' }} variant='standard'>
                <Text marginBottom='5px' id='network-dropdown'>
                  From
                </Text>
                <Select labelId='network-dropdown' defaultValue={1} input={<BootstrapInput />}>
                  <MenuItem value={1} divider>
                    <img src={getChainImg(activeBridge.chainId)} alt='LogoIcon' width='14px' style={{ verticalAlign: 'middle' }} />
                    &nbsp;{getChainName(activeBridge.chainId)}
                  </MenuItem>
                </Select>
              </FormControl>

              {/* Switch network button */}
              <ArrowContainer>
                <ArrowForwardIcon />
              </ArrowContainer>

              <FormControl variant='standard' style={{ width: '100%' }}>
                <Text marginBottom='5px' id='network-to-id'>
                  To
                </Text>
                <Select labelId='network-to-id' input={<BootstrapInput />} defaultValue={1}>
                  <MenuItem value={1}>
                    <img src={getChainImg(activeBridge.supportedChains[0])} alt='LogoIcon' width='14px' style={{ verticalAlign: 'middle' }} />
                    &nbsp;{getChainName(activeBridge.supportedChains[0])}
                  </MenuItem>
                </Select>
              </FormControl>
            </Flex>
            {/* <Text style={{ marginBottom: '40px', fontSize: '14px', fontStyle: 'italic' }}>
              If you have not added Binance Smart Chain network in your MetaMask yet, please click{' '}
              <StyledLink style={{ color: 'white', cursor: 'pointer' }}>Add Network</StyledLink> and continue
            </Text> */}
            <Text color='text' fontSize='16px' marginBottom='40px'>
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
                  max=''
                  symbol={bridgeTokenSymbol}
                  addLiquidityUrl=''
                />
              </Flex>
              <Text style={{ color: 'red', fontSize: '14px' }}>Minimum bridgeable amount is
                50,000 {bridgeTokenSymbol}</Text>
              <Text color='textSubtle' style={{ fontSize: '14px' }}>
                Balance: {formatTokenBalance} {bridgeTokenSymbol}
              </Text>
              <Flex>
                <Text mt='30px' style={{ fontSize: '14px' }}>
                  You will receive ={' '}
                  <img
                    src={getTokenIcon(bridgeToken)}
                    alt='ReceiveLogoIcon'
                    width='14px'
                    height='14px'
                    style={{ verticalAlign: 'middle', marginBottom: '1px' }}
                  />{' '}
                  {receiveAmount}
                  &nbsp;{bridgeTokenSymbol}{' '}
                  <Button
                    style={{
                      verticalAlign: 'middle',
                      height: '14px',
                      width: '7%',
                      fontSize: '14px',
                      borderRadius: '4px',
                      cursor: 'none',
                      marginBottom: '2.5px',
                    }}
                  >
                    {' '}
                    {getTokenType(currentChain)}
                  </Button>
                </Text>
              </Flex>
            </Text>
            {!account ?
              <UnlockButton mb='15px' width='100%' style={{ borderRadius: '6px' }} /> :
              !isApproved && <Button fullWidth onClick={handleApprove} disabled={requestedApproval}>
                Enable bridge
              </Button>
            }
            {account && isApproved && <Button fullWidth onClick={handleTransfer} disabled={requestedApproval}>
              Transfer
            </Button>}
          </Flex>
        </Flex>
      </Flex>
    </StyledContainer>
  )
}

export default Bridge
