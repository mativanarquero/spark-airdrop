import React, { useEffect, useState } from 'react'
import { Menu as UikitMenu } from '@sparkpointio/sparkswap-uikit'
import { useWeb3React } from '@web3-react/core'
import { languageList } from 'config/localization/languages'
import { useTranslation } from 'contexts/Localization'
import useTheme from 'hooks/useTheme'
import { useBridges } from 'state/hooks'
import useAuth from 'hooks/useAuth'
import { BASE_URL, MAINNET_ETH_CHAIN_ID } from '../../config'
import config from './config'

const Menu = (props) => {
  const { account, chainId} = useWeb3React()
  const { login, logout } = useAuth()
  const { isDark, toggleTheme } = useTheme()
  const { currentLanguage, setLanguage } = useTranslation()
  const [ network, setNetwork ] = useState('')

  useEffect (() => {
    (() => chainId === 1 || chainId === 3 || chainId === 4 || chainId === 5 ? setNetwork('ETH') : chainId === 97 || chainId === 56 && setNetwork('BSC'))();
  }, [chainId, setNetwork])


  return (
    <UikitMenu
      network={network}
      account={account}
      login={login}
      logout={logout}
      isDark={isDark}
      toggleTheme={toggleTheme}
      currentLang={currentLanguage.code}
      langs={languageList}
      setLang={setLanguage}
      links={config}
      {...props}
    />
  )
}

export default Menu
