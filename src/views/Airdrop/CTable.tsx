                                                                                                                                                                                    import React, { useContext, useState } from 'react'
import { Text, Flex, Button } from '@sparkpointio/sparkswap-uikit'
import styled, { ThemeContext } from 'styled-components'
import { ChevronUp, ChevronDown } from 'react-feather'
import { Grid } from '@mui/material'
import { useTheme } from '@mui/material/styles'
import useMediaQuery from '@mui/material/useMediaQuery'
import useMedia from 'use-media'
import { Header } from './styled'
import TokenLogo from './Logo'

const RowHeader = styled(Header)`
  width: auto;
  display: flex;
  justify-content: space-between;
  align-items: center;
  // background-image: url('/images/icons/oreBG6.png');
  background: ${({theme}) => theme.isDark && "linear-gradient(180deg, rgba(6,10,15,1) 0%, rgba(5,25,51,1) 100%)" };
  background-position: 50% 78%;
  background-size: cover;
  background-repeat: no-repeat;
  border-style: none none solid none;
  border-width: 2px;
  border-color: ${({ theme }) => theme.colors.primary};
`
const CTableBody = styled(Flex)`
  width: 100%;
  padding: 20px 30px;                                                                                                                   
  background-color: ${({ theme }) => theme.card.background};
  flex-direction: column;
`
const RowContainer = styled.div`
  width: 100%;
  display: flex;
  // justify-content: center;
  // align-items: center;
  flex-direction: column;
`

const TokenProperty = styled(Flex)`
  background-color: ${({ theme }) => theme.colors.primary};
  border-radius: 25px;
  min-width: 60px;
  margin: 10px 10px;
  justify-content: center;
  & > * {
    font-size: 12px;
    font-weight: bold;
    margin: 5px 10px;
  }
  // @media (max-width: 500px) {
  //   width: auto;
  //   min-width: auto;
  // }
`

const Details = styled(Button)`
  border-radius: 10px;
  height: 40px;
  @media (max-width: 500px) {
    width: 40%;
  }
`

const NavOption = styled(Button)<{ activeIndex: boolean }>`
  background-color: transparent;
  color: ${({ theme, activeIndex }) => (activeIndex ? theme.colors.text : theme.colors.textSubtle)};
  border-bottom: ${({ theme, activeIndex }) => activeIndex && `3px solid ${theme.colors.primary}`};
`
const SaleContainer = styled(Flex)`
  margin: 10px 0px;
  & > * {
    width: 45%;
  }
`

const SaleRow = styled(Flex)`
  margin: 10px 0px;
`

const CTable: React.FC = () => {
  const muitheme = useTheme()
  const largeScreen = useMediaQuery(muitheme.breakpoints.up('md'))
  const [tokenType, setTokenType] = useState('SFUEL')
  const [claimButton, setClaimButton] = useState(true)
  
  const claimprop = (
    <TokenProperty>
      <Text>{tokenType}</Text>
    </TokenProperty>
  )

  return (
    <Grid container
      spacing={0}
      direction="column"
      alignItems="center"
      justifyContent="center" xs={12} sm={12} md={12} lg={8} margin="auto">
      <RowContainer>

        {/* Row 1 */}
        <RowHeader>
          <Flex
            alignItems="center"
            style={largeScreen ? { flexDirection: 'row' } : { flexDirection: 'column', rowGap: '1.5px' }}
          >
            <TokenLogo tokenName="Q4 2021 SFUEL Airdrop for SRK/SRKb Holders, Liquidity Providers and Stakers" image="SRKb.png" padding="0px" claimprop={claimprop} />

          </Flex>
          <Button
            disabled={!claimButton}
            style={{ borderRadius: '8px' }}>
            Claim
          </Button>
        </RowHeader>

        {/* Row 2 */}
        <RowHeader>
          <Flex
            alignItems="center"
            style={largeScreen ? { flexDirection: 'row' } : { flexDirection: 'column', rowGap: '1.5px' }}
          >
            <TokenLogo tokenName="Q3 2021 SFUEL Airdrop for SRK/SRKb Holders, Liquidity Providers and Stakers" image="SFUEL.png" padding="0px" claimprop={claimprop} />
          </Flex>
          <Button
            disabled={!claimButton}
            style={{ borderRadius: '8px' }}>
            Claim
          </Button>
        </RowHeader>

        {/* Row 3 */}
        <RowHeader>
          <Flex
            alignItems="center"
            style={largeScreen ? { flexDirection: 'row' } : { flexDirection: 'column', rowGap: '1.5px' }}
          >
            <TokenLogo tokenName="SparkSwap 1.0 Community Airdrop" image="own.png" padding="0px" claimprop={claimprop} />

          </Flex>
          <Button
            disabled={!claimButton}
            style={{ borderRadius: '8px' }}>
            Claim
          </Button>
        </RowHeader>

      </RowContainer>
    </Grid>
  )
}

export default CTable
