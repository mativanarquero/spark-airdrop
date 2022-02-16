import React, { useCallback, useContext, useEffect, useState } from 'react'
import styled, { ThemeContext } from 'styled-components'
import { Text, Flex, Footer } from '@sparkpointio/sparkswap-uikit'
import { SvgIcon } from '@material-ui/core'
import PageHeader from 'components/PageHeader'
import { Grid } from '@mui/material'
import useMediaQuery from '@mui/material/useMediaQuery'
import { useTheme } from '@mui/material/styles'
import useMedia from 'use-media'
import PageSection from './Layout'
import SectionTitle from './SectionTitle'
import { AirdropContainer } from './styled'
import Tab from './Tab'
import { ReactComponent as BridgeDarkLogo } from './components/assets/bridge-dark.svg'
import { ReactComponent as BridgeLightLogo } from './components/assets/bridge-light.svg'

const AirdropBox: React.FC = () => {
  return (
    <AirdropContainer>
      <Tab />
    </AirdropContainer>
  )
}

const Section: React.FC = () => {
  const theme = useContext(ThemeContext)
  const muitheme = useTheme()
  const largeScreen = useMediaQuery(muitheme.breakpoints.up('md'))
  return (
    // <Grid>
    <PageSection direction="column">
      {/* <SectionTitle title="Airdrop &amp; SparkRewards" subTitle="Lorem ipsum dolor sit amet adipscing" /> */}
      <PageHeader background={theme.card.background}>
        <Flex
          alignItems="center"
          justifyContent="space-between"
          flexDirection={['column', null, 'row']}
          style={largeScreen ? { minHeight: '20vh', marginLeft: '-12px' } : { flexDirection: 'column-reverse' }} 
          padding="0px"
        >
          <Flex flexDirection="column" mr={['8px', 0]}>
            <Text color="text" fontSize="60px" bold marginBottom="10px">
              <span style={{ borderBottom: `2px solid ${theme.colors.primary}` }}>SparkRewards</span>
            </Text>
            <Text color="text" style={largeScreen ? { fontSize: '27px' } : { fontSize: '17px' }}>
            Lorem ipsum dolor sit amet, consectetuer adipiscing elit
            </Text>
          </Flex>
          <Flex
            style={
              largeScreen ?
              { fontSize: '240px', marginRight: '-137px', position: 'relative' } :
              { fontSize: '150px', margin: 'auto', marginTop: '20px', marginBottom: '20px' }
            }
          >
            <SvgIcon
              component={theme.isDark ? BridgeDarkLogo : BridgeLightLogo}
              viewBox="0  0 384 512"
              style={largeScreen ? { width: '500px' } : { width: '200px' } }
              fontSize="inherit"
            />
          </Flex>
        </Flex>
      </PageHeader>
      <AirdropBox />
      <Footer
          helperLinks={[
            {
              label: 'Terms and Conditions',
              // href: 'https://sparkpointio.github.io/terms_and_conditions/sparkdefi-launchpad/',
              href: '#',
            },
            {
              label: 'Privacy',
              // href: 'https://sparkpointio.github.io/privacy_policies/sparkdefi-launchpad/',
              href: '#',
            },
            {
              label: 'Sitemap',
              href: 'https://srk.finance/#roadmap',
            },
          ]}
          socLinks={[
            {
              label: 'facebook',
              href: 'https://www.facebook.com/sparkpointio/',
            },
            {
              label: 'twitter',
              href: 'https://twitter.com/sparkpointio',
            },
            {
              label: 'telegram',
              href: 'https://t.me/SparkPointOfficial',
            },
            {
              label: 'email',
              href: 'mailto: support@sparkpoint.io',
            },
            {
              label: 'discord',
              href: 'https://discord.com/invite/Sgc6yDEAAe',
            },
          ]}
          title="SparkRewards 2022"
        />
    </PageSection>
    // </Grid>
  )
}

export default Section
