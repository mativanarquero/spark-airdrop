import styled from 'styled-components'
import { CardHeader, Flex } from '@sparkpointio/sparkswap-uikit'

// eslint-disable-next-line import/prefer-default-export
export const AirdropContainer = styled(Flex)`
  // margin: 24px 0px;
  width: 100%;
  margin: 24px 0px 24px 0px;
  padding: 24px 0px 24px 0px;
  margin-top: auto;
`
export const Header = styled(CardHeader)<{ src?: string }>`
  display: flex;
  padding: 20px;
  align-items: flex-start;
  position: relative;
  height: 15vh;
  justify-content: flex-end;
  ${({ src }) =>
    src &&
    `
        &:before {
            content: ' ';
            display: block;
            position: absolute;
            left: 0;
            top: 0;
            opacity: 0.3;
            width: 100%;
            height: 100%;
            z-index: 1;
            background-image: url(${src});
            background-repeat: no-repeat;
            // background-attachment: fixed;
            background-position: center;
            background-size: cover;
        }
    `}
`
export const TimerBox = styled(Flex)`
  & > * {
    flex: 1;
    margin-right: 10px;
  }
`
export const TimerContainer = styled(Flex)`
  background-color: rgba(41, 178, 19, 1);
`

export const InfoBox = styled(Flex)`
    width; 100%;
    & > * {
      margin-top: 5px;
    }
`

export const InfoRow = styled(Flex)`
  width: 100%;
`
export const StatusColor = {
  ongoing: '#32a31b',
  upcoming: '#7a1ba3',
  completed: '#8e98a5',
}

export const StatusBox = styled(Flex)<{ status: string }>`
  background-color: ${({ status, theme }) => (status ? StatusColor[status] : theme.colors.primary)};
  border-radius: 3px;
`