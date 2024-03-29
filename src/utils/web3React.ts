import { InjectedConnector } from '@web3-react/injected-connector'
import { WalletConnectConnector } from '@web3-react/walletconnect-connector'
import { BscConnector } from '@binance-chain/bsc-connector'
import { ConnectorNames } from '@pancakeswap/uikit'
import Web3 from 'web3'
import getNodeUrl from './getRpcUrl'

const POLLING_INTERVAL = 12000
const rpcUrl = getNodeUrl()
const chainId = parseInt(process.env.REACT_APP_CHAIN_ID, 10)
const bscTestnet = parseInt('97', 10)
const ethMain = parseInt('1', 10)
const ropsten = parseInt('3', 10)

const injected = new InjectedConnector({ supportedChainIds: [chainId, ethMain, ropsten, bscTestnet] })

const walletconnect = new WalletConnectConnector({
  rpc: {
    [chainId]: rpcUrl,
    [ethMain]: rpcUrl,
    [ropsten]: rpcUrl,
  },
  bridge: 'https://bridge.walletconnect.org/',
  qrcode: true,
  pollingInterval: POLLING_INTERVAL,
})

const bscConnector = new BscConnector({ supportedChainIds: [chainId] })

export const connectorsByName: { [connectorName in ConnectorNames]: any } = {
  [ConnectorNames.Injected]: injected,
  [ConnectorNames.WalletConnect]: walletconnect,
  [ConnectorNames.BSC]: bscConnector,
}

export const getLibrary = (provider): Web3 => {
  return provider
}
