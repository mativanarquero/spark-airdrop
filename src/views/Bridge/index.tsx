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
import { Grid } from '@mui/material'
import UnlockButton from 'components/UnlockButton'
import { getAddress } from '../../utils/addressHelpers'
import { BASE_URL, MAINNET_ETH_CHAIN_ID } from '../../config'
import { calculateOutput, getChainImg, getChainName, getTokenIcon, getTokenType } from './helpers'
import { useApproveBridge } from '../../hooks/useApprove'
import useBridge, { useBridgeAllowance, useBridgeLimit } from '../../hooks/useBridge'
import { BIG_TEN } from '../../utils/bigNumber'
import useTokenBalance from '../../hooks/useTokenBalance'
import { getBalanceAmount } from '../../utils/formatBalance'
import useToast from '../../hooks/useToast'


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
  @media (max-width: 4000px) {
    margin: 60px auto 40px auto!important;
  }

  @media (max-width: 1920px) {
    margin: 60px auto 40px auto!important;
  }
  @media (max-width: 768px) {
    height: auto;
    margin: 40px 40px 40px 40px!important;
    padding-left: 20px;
    padding-right: 20px;
  }
  @media (max-width: 500px) {
    height: auto;
    margin: 40px 20px 40px 20px!important;
    padding-left: 20px;
    padding-right: 20px;
    width:460px!important;
  }
  @media (max-width: 375px) {
    width:350px!important;
    display: flex;
    justify-content: center;
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
  const [isTransferDisabled, setIsTransferDisabled] = useState(true)
  const [bridgeAmount, setBridgeAmount] = useState('')
  const [receiveAmount, setReceiveAmount] = useState(0)
  const [requestedApproval, setRequestedApproval] = useState(false)
  const { toastError, toastSuccess } = useToast()

  const bridges = useBridges()
  const activeBridge = bridges.data.filter(bridge => {
    return bridge.chainId === currentChain
  })[0]
  const [bridgeToken, setBridgeToken] = useState(activeBridge.tokens[0])
  const [currentTokenSymbol, setCurrentTokenSymbol] = useState(activeBridge.tokens[0].symbol)
  const [outputTokenSymbol, setOuputTokenSymbol] = useState(activeBridge.tokens[0].symbol)
  const allowance = useBridgeAllowance(getAddress(bridgeToken.address, currentChain.toString()), activeBridge.address)
  const [isApproved, setIsApproved] = useState(false)

  const { onApprove } = useApproveBridge(getAddress(bridgeToken.address, currentChain.toString()), activeBridge.address)
  const handleApprove = useCallback(async () => {
    try {
      setRequestedApproval(true)
      await onApprove()
      // dispatch(fetchFarmUserDataAsync())
      toastSuccess(t('Transaction confirmed'), t('You can now bridge your tokens'))
      setIsApproved(true)
      setRequestedApproval(false)
    } catch (e) {
      toastError(t('Something went wrong, please try again'))
      setRequestedApproval(false)
      console.error(e)
    }
  }, [onApprove, toastSuccess, toastError, t])

  const { onBridge } = useBridge(activeBridge)

  const handleTransfer = useCallback(async () => {
    try {
      setRequestedApproval(true)
      await onBridge(new BigNumber(bridgeAmount).times(BIG_TEN.pow(bridgeToken.decimals)).toString(), getAddress(bridgeToken.address, currentChain.toString()))
      toastSuccess(t('Transaction confirmed'))
      // dispatch(fetchFarmUserDataAsync())
      setRequestedApproval(false)
    } catch (e) {
      toastError(t('Something went wrong, please try again'))
      setRequestedApproval(false)
      console.error(e)
    }
    // dispatch(fetchFarmUserDataAsync({ account, pids: [pid] }))
  }, [onBridge, bridgeAmount, bridgeToken, currentChain, toastSuccess, toastError, t])


  const bridgeLimits = useBridgeLimit(bridgeToken, activeBridge)
  const tokenBalance = useTokenBalance(getAddress(bridgeToken.address, currentChain.toString()))
  const tokenBalanceAmount = getBalanceAmount(tokenBalance.balance, bridgeToken.decimals)

  useEffect(() => {
    setIsApproved(account && allowance && new BigNumber(allowance).isGreaterThan(0))

    setCurrentTokenSymbol(bridgeToken.symbol === 'SRK' && (currentChain === 56 || currentChain === 97)? 'SRKb': bridgeToken.symbol)
    setOuputTokenSymbol(bridgeToken.symbol === 'SRK' && (currentChain === 1 || currentChain === 3)? 'SRKb': bridgeToken.symbol)
  }, [setIsApproved, account, allowance, bridgeToken, currentChain])


  // Prepare function to handle bridge amount input
  const handleAmountInputChange = (input: string) => {
    const amount = new BigNumber(input)
    if (amount.gte(bridgeLimits.min) && amount.lte(bridgeLimits.max) && amount.lte(tokenBalanceAmount)) {
      setIsTransferDisabled(false)
    } else {
      setIsTransferDisabled(true)
    }

    setBridgeAmount(input)
  }
  // handle max value
  const handleMax = () => {
    if (!tokenBalanceAmount) {
      setBridgeAmount('0')
      return
    }
    if (tokenBalanceAmount.gt(bridgeLimits.max)) {
      setBridgeAmount(bridgeLimits.max.toString())
      setIsTransferDisabled(false)
      return;
    }
    setBridgeAmount(tokenBalanceAmount.toString())
    setIsTransferDisabled(false)
  }


  return (
    <Grid xs={12} sm={12} md={8} lg={6} margin='auto'>
      <StyledContainer>
        <Flex flexDirection='row' width='100%' >
          <Flex flexDirection='column' style={{width: '100%'}}>
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
                    {currentTokenSymbol}
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
                  onSelectMax={handleMax}
                  onChange={(e) => handleAmountInputChange(e.currentTarget.value)}
                  max=''
                  inputType='number'
                  symbol={currentTokenSymbol}
                  addLiquidityUrl=''
                />
              </Flex>
              <Text style={{ color: 'red', fontSize: '14px' }}>Minimum bridgeable amount is
                &nbsp;<strong>{bridgeLimits.min.toFormat()} {currentTokenSymbol}</strong></Text>
              <Text style={{ color: 'red', fontSize: '14px' }}>Maximum bridgeable amount is
                &nbsp;<strong>{bridgeLimits.max.toFormat()} {currentTokenSymbol}</strong></Text>
              <Text color='textSubtle' style={{ fontSize: '14px' }}>
                Balance: {tokenBalanceAmount.toFormat(6)} {currentTokenSymbol}
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
                  {calculateOutput(bridgeAmount, currentChain, isTransferDisabled || !isApproved)}
                  &nbsp;{outputTokenSymbol}{' '}
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
                    {getTokenType(activeBridge.supportedChains[0])}
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
            {account && isApproved && <Button fullWidth onClick={handleTransfer} disabled={requestedApproval || isTransferDisabled}>
              Transfer
            </Button>}
          </Flex>
        </Flex>
      </StyledContainer>
    </Grid>

  )
}

export default Bridge
