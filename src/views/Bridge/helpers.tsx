// eslint-disable-next-line import/prefer-default-export
import BigNumber from 'bignumber.js'
import { getAddress } from '../../utils/addressHelpers'
import { BASE_URL, BSC_TO_ETH_FEE, ETH_TO_BSC_FEE } from '../../config'
import { Token } from '../../config/constants/types'

export const getChainName = (chainId) => {
  switch (chainId) {
    case 56:
      return 'Binance Smart Chain'
    case 97:
      return 'BSC Testnet'
    case 3:
      return 'Ropsten'
    default:
      return 'Ethereum'
  }
}

export const getChainImg = (chainId) => {
  const imgUrl = `${BASE_URL}/images/bridge`

  switch (chainId) {
    case 56:
    case 97:
      return `${imgUrl}/bsc.png`
    default:
      return `${imgUrl}/eth.png`
  }
}

export const getTokenIcon = (token: Token) => {
  const tokenImgUrl = `${BASE_URL}/images/tokens/`
  return `${tokenImgUrl}${getAddress(token.address)}.${token.iconExtension}`
}

export const getTokenType = (chainId) => {
  switch (chainId) {
    case 56:
    case 97:
      return `BEP20`
    default:
      return `ERC20`
  }
}

export const calculateOutput = (amount, chainId, isTransferDisabled = true) => {
  if (isTransferDisabled) {
    return '0'
  }
  const amt = new BigNumber(amount)
  switch (chainId) {
    case 56:
    case 97:
      return amt.minus(BSC_TO_ETH_FEE).toString()
    default:
      return amt.minus(amt.times(ETH_TO_BSC_FEE)).toString()
  }
}
