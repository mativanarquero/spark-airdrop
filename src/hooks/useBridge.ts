import { useCallback, useEffect, useState } from 'react'
import { useWeb3React } from '@web3-react/core'
import BigNumber from 'bignumber.js'
import { bridgeToken } from 'utils/callHelpers'
import { Token } from '../config/constants/types'
import { useBridgeContract, useERC20 } from './useContract'
import { Bridge } from '../state/types'
import { BIG_ZERO } from '../utils/bigNumber'
import useRefresh from './useRefresh'
import { getAddress } from '../utils/addressHelpers'
import { getBalanceAmount } from '../utils/formatBalance'

const useBridge = (bridge: Bridge) => {
  const { account } = useWeb3React()
  const contract = useBridgeContract(bridge)

  const handleBridge = useCallback(
    async (amount: string, tokenAddress) => {
      const hash = await bridgeToken(contract, account, amount, tokenAddress, bridge)
      return hash
    },
    [account, contract, bridge],
  )

  return { onBridge: handleBridge }
}

// Retrieve bridge allowance
export const useBridgeAllowance = (tokenAddress: string, bridgeAddress: string) => {
  const [allowance, setAllowance] = useState(BIG_ZERO)
  const { account } = useWeb3React()
  const tokenContract = useERC20(tokenAddress)
  const { fastRefresh } = useRefresh()

  useEffect(() => {
    const fetchAllowance = async () => {
      const res = await tokenContract.methods.allowance(account, bridgeAddress).call()
      setAllowance(new BigNumber(res))
    }

    if (account) {
      fetchAllowance()
    }
  }, [account, tokenContract, bridgeAddress, fastRefresh])

  return allowance
}

export const useBridgeLimit = (token: Token, bridge: Bridge) => {
  const [limits, setLimits] = useState({
    daily: BIG_ZERO,
    min: BIG_ZERO,
    max: BIG_ZERO,
  })
  const { account } = useWeb3React()
  const contract = useBridgeContract(bridge, bridge.type === 'bscToEth')
  const { fastRefresh } = useRefresh()

  useEffect(() => {
    const fetchLimits = async () => {
      const daily = await contract.methods.dailyLimit(getAddress(token.address, bridge.chainId.toString())).call()
      const minPerTx = await contract.methods.minPerTx(getAddress(token.address, bridge.chainId.toString())).call()
      const maxPerTx = await contract.methods.maxPerTx(getAddress(token.address, bridge.chainId.toString())).call()

      setLimits({
        daily: getBalanceAmount(daily, token.decimals),
        min: getBalanceAmount(minPerTx, token.decimals),
        max: getBalanceAmount(maxPerTx, token.decimals),
      })
    }

    if (token && account) {
      fetchLimits()
    }
  }, [account, fastRefresh, bridge, contract, token])

  return limits
}

export default useBridge
