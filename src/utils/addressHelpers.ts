import { MAINNET_CHAIN_ID } from 'config'
import addresses from 'config/constants/contracts'
import tokens from 'config/constants/tokens'
import { Address } from 'config/constants/types'

export const getAddress = (address: Address, chainId = MAINNET_CHAIN_ID): string => {
  return address[chainId]
}

export const getCakeAddress = (chainId = MAINNET_CHAIN_ID) => {
  return getAddress(tokens.cake.address, chainId)
}
export const getMasterChefAddress = (chainId = MAINNET_CHAIN_ID) => {
  return getAddress(addresses.masterChef, chainId)
}
export const getMulticallAddress = (chainId = MAINNET_CHAIN_ID) => {
  return getAddress(addresses.multiCall, chainId)
}
export const getWbnbAddress = (chainId = MAINNET_CHAIN_ID) => {
  return getAddress(tokens.wbnb.address, chainId)
}
export const getLotteryAddress = (chainId = MAINNET_CHAIN_ID) => {
  return getAddress(addresses.lottery, chainId)
}
export const getLotteryTicketAddress = (chainId = MAINNET_CHAIN_ID) => {
  return getAddress(addresses.lotteryNFT, chainId)
}
export const getLotteryV2Address = (chainId = MAINNET_CHAIN_ID) => {
  return getAddress(addresses.lotteryV2, chainId)
}
export const getPancakeProfileAddress = (chainId = MAINNET_CHAIN_ID) => {
  return getAddress(addresses.pancakeProfile, chainId)
}
export const getPancakeRabbitsAddress = (chainId = MAINNET_CHAIN_ID) => {
  return getAddress(addresses.pancakeRabbits, chainId)
}
export const getBunnyFactoryAddress = (chainId = MAINNET_CHAIN_ID) => {
  return getAddress(addresses.bunnyFactory, chainId)
}
export const getClaimRefundAddress = (chainId = MAINNET_CHAIN_ID) => {
  return getAddress(addresses.claimRefund, chainId)
}
export const getPointCenterIfoAddress = (chainId = MAINNET_CHAIN_ID) => {
  return getAddress(addresses.pointCenterIfo, chainId)
}
export const getBunnySpecialAddress = (chainId = MAINNET_CHAIN_ID) => {
  return getAddress(addresses.bunnySpecial, chainId)
}
export const getTradingCompetitionAddress = (chainId = MAINNET_CHAIN_ID) => {
  return getAddress(addresses.tradingCompetition, chainId)
}
export const getEasterNftAddress = (chainId = MAINNET_CHAIN_ID) => {
  return getAddress(addresses.easterNft, chainId)
}
export const getCakeVaultAddress = (chainId = MAINNET_CHAIN_ID) => {
  return getAddress(addresses.cakeVault, chainId)
}
export const getPredictionsAddress = (chainId = MAINNET_CHAIN_ID) => {
  return getAddress(addresses.predictions, chainId)
}
export const getChainlinkOracleAddress = (chainId = MAINNET_CHAIN_ID) => {
  return getAddress(addresses.chainlinkOracle, chainId)
}
