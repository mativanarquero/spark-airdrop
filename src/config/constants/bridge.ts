import ethToBscAbi from 'config/abi/ethToBsc.json'
import bscToEthAbi from 'config/abi/bscToEth.json'
import { BridgeConfig } from './types'
import tokens from './tokens'

const bridgesConfig: BridgeConfig[] = [
  {
    name: 'Ethereum',
    chainId: 1,
    abi: ethToBscAbi,
    address: '0xF7D5060C181F9eD59F619b2c945a2f7C3Ee9cCe2',
    tokens: [
      tokens.srkb
    ],
    supportedChains: [
      56
    ]
  },
  {
    name: 'BSC',
    chainId: 56,
    address: '0xC3440c10c4F36f354eB591B19FafB4906d449B75',
    abi: bscToEthAbi,
    tokens: [
      tokens.srkb
    ],
    supportedChains: [
      1
    ]
  },
  {
    name: 'Ropsten',
    address: '0x8b2928170281beb4967883eC72Bd68484d506E08',
    chainId: 3,
    abi: ethToBscAbi,

    tokens: [
      tokens.srkb
    ],
    supportedChains: [
      97
    ]
  },
  {
    name: 'BSC Testnet',
    chainId: 97,
    abi: bscToEthAbi,
    address: '0xf144cf9669d5f04ED5606d2d3D682C78f9193a5B',
    tokens: [
      tokens.srkb
    ],
    supportedChains: [
      3
    ]
  },
]

export default bridgesConfig;
