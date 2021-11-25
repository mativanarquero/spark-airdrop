import { BridgeConfig } from './types'
import tokens from './tokens'

const bridge: BridgeConfig[] = [
  {
    name: 'Ethereum',
    chainID: 1,
    tokens: [
      tokens.srkb
    ],
    supportedChains: [
      56
    ]
  },
]
