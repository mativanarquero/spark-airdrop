import { useCallback } from 'react'
import { useWeb3React } from '@web3-react/core'
import { Contract } from 'web3-eth-contract'
import { bridgeToken, stake } from 'utils/callHelpers'
import { useBridgeContract, useMasterchef } from './useContract'
import { Bridge } from '../state/types'
import { Address } from '../config/constants/types'

const useBridge = (bridge: Bridge) => {
  const { account } = useWeb3React()
  const contract = useBridgeContract(bridge)

  const handleBridge = useCallback(async (amount, tokenAddress: Address) => {
    const hash = await bridgeToken(contract, account, amount, tokenAddress)
    return hash
  }, [account, contract])

  return { onBridge: handleBridge }
}

const useStake = (pid: number) => {
  const { account } = useWeb3React()
  const masterChefContract = useMasterchef()

  const handleStake = useCallback(
    async (amount: string, contract: Contract) => {
      const txHash = await stake(contract ?? masterChefContract, pid, amount, account, !!contract)
      console.info(txHash)
    },
    [account, masterChefContract, pid],
  )

  return { onStake: handleStake }
}

export default useBridge
