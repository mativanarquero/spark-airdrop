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
  const { account, chainId } = useWeb3React()
  const { login, logout } = useAuth()
  const { isDark, toggleTheme } = useTheme()
  const { currentLanguage, setLanguage } = useTranslation()

  return (
    <UikitMenu
      network={chainId}
      account={account}
      login={login}
      logout={logout}
      isDark={isDark}
      toggleTheme={toggleTheme}
      currentLang={currentLanguage.code}
      langs={languageList}
      setLang={setLanguage}
      links={config}
      disableDarkOption
      {...props}
    />
  )
}

export default Menu
