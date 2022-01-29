import { BridgeConfig, FarmConfig } from 'config/constants/types'
import fetchBridge from './fetchBridge'

const fetchBridges = async (bridgesToFetch: BridgeConfig[]) => {
  const data = await Promise.all(
    bridgesToFetch.map(async (bridgeConfig) => {
      const bridge = await fetchBridge(bridgeConfig)
      return bridge
    }),
  )
  return data
}

export default fetchBridges
