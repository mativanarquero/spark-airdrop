// eslint-disable-next-line import/prefer-default-export
export const getChainName = (chainId) => {
  switch (chainId) {
    case 56:
      return 'Binance Smart Chain'
    case 97:
      return 'BSC Testnet'
    case 3:
      return 'Ropsten'
    default:
      return 'Ethereum'
  }
}
