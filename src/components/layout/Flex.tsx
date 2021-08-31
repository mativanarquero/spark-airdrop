import styled from 'styled-components'

const FlexLayout = styled.div`
  display: flex;
  justify-content: flex-start;
  flex-wrap: wrap;
  & > * {
    min-width: 280px;
    max-width: 31.5%;
    min-height: 500px;
    height: auto;
    width: 100%;
    margin: 0 8px;
    margin-bottom: 32px;
  }
`

export default FlexLayout
