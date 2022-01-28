import { useCallback } from 'react'
import { useWeb3React } from '@web3-react/core'
import { Contract } from 'web3-eth-contract'
import { bridgeToken, stake } from 'utils/callHelpers'
import { useBridgeContract, useMasterchef } from './useContract'
import { Bridge } from '../state/types'

const useBridge = (bridge: Bridge) => {
  const { account } = useWeb3React()
  const contract = useBridgeContract(bridge)

  const handleBridge = useCallback(async (amount: string, tokenAddress) => {
    const hash = await bridgeToken(contract, account, amount, tokenAddress, bridge)
    return hash
  }, [account, contract, bridge])

  return { onBridge: handleBridge }
}

export default useBridge
