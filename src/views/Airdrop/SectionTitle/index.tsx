import React from 'react'
import styled from 'styled-components'
import { Flex, Text, Heading } from '@sparkpointio/sparkswap-uikit'

const HeadingContainer = styled(Flex)`
  padding: 30px;
  background: ${({ theme }) =>
    theme.isDark ? 'linear-gradient(90deg, rgba(27,96,163,1) 22%, rgba(57,190,236,1) 100%)' : 'white'};
  border-radius: 5px;
  width: 100%;
  margin-top: 60px;
  margin-bottom: 200px;
  @media (max-width: 500px) {
    margin-top: 5px;
    margin-bottom: 150px;
  }
`
// padding: 40px;
// background: ${({ theme }) =>
//   theme.isDark ? 'linear-gradient(90deg, rgba(27,96,163,1) 22%, rgba(57,190,236,1) 100%)' : 'white'};
// border-radius: 6px;
// width: 100%;
// margin-top: 60px;
// margin-bottom: 200px;
// `

const SectionTitle: React.FC<{ title: string; subTitle: string }> = ({ title, subTitle }) => {
  return (
    <HeadingContainer margin="auto" flexDirection="column">
      <Heading size="lg" as="h2">
        {title}
      </Heading>
      <Text>{subTitle}</Text>
    </HeadingContainer>
  )
}

export default SectionTitle
