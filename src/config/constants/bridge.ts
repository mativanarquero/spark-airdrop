import { BridgeConfig } from './types'
import tokens from './tokens'

const bridgesConfig: BridgeConfig[] = [
  {
    name: 'Ethereum',
    chainId: 1,
    type: 'ethToBsc',
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
    home: '0x1DE4e26EE72710e0b49106D003748c2CD54a25D7',
    type: 'bscToEth',
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
    type: 'ethToBsc',

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
    type: 'bscToEth',
    address: '0xf144cf9669d5f04ED5606d2d3D682C78f9193a5B',
    home: '0xb8D5Ba1dca3A0FBfbd475a2C6f5901F20b5AD2Aa',
    tokens: [
      tokens.srkb
    ],
    supportedChains: [
      3
    ]
  },
]

export default bridgesConfig;
