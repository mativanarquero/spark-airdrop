import { Bridge, Farm } from 'state/types'
import fetchPublicBridgeData from './fetchPublicBridgeData'

const fetchBridge = async (bridge: Bridge): Promise<Bridge> => {
  const bridgePublicData = await fetchPublicBridgeData(bridge)

  return { ...bridge, ...bridgePublicData }
}

export default fetchBridge
