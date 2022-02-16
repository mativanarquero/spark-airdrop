import { Flex, Heading, Text } from '@sparkpointio/sparkswap-uikit'
import React, { useContext } from 'react'
import styled, { ThemeContext } from 'styled-components'
import { Globe, Send, Twitter } from 'react-feather'
import { ReactComponent as MediumIcon } from './components/icons/MediumIcon.svg'
import SvgIcon from './SvgIcon'

const TokenLogo = styled.img<{ size?: string }>`
  border-radius: 50%;
  height: ${({ size }) => (!size ? '60px' : size)};
  width: ${({ size }) => (!size ? '60px' : size)};
  margin-right: 15px;
  z-index: 2;
  @media (max-width: 500px) {
    height: ${({ size }) => (!size ? '50px' : size)};
    width: ${({ size }) => (!size ? '50px' : size)};
  }
`

const TokenProperty = styled(Flex)`
  background-color: ${({ theme }) => theme.colors.primary};
  border-radius: 25px;
  min-width: 60px;
  margin: 0px 10px;
  justify-content: center;
  & > * {
    font-size: 12px;
    font-weight: bold;
    margin: 5px 10px;
  }
  `

const Logo: React.FC<{ tokenName: string; image: string; subtitle?: string; claimprop?: any; padding?: string }> = ({
  tokenName,
  image,
  // subtitle,
  claimprop,
  padding = '24px',
}) => {
  const theme = useContext(ThemeContext)
  const srcs = `${process.env.PUBLIC_URL}/images/icons/${image}`
  return (
    <Flex padding={padding}>
      <TokenLogo src={srcs} />
      <Flex flexDirection="column" justifyContent="center" alignItems="flex-start">
        <Heading size="l">{tokenName}</Heading>
        {claimprop}
      </Flex>
    </Flex>
  )
}

export default Logo
