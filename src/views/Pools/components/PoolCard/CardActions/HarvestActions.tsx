import React from 'react'
import { Button, Text, Flex, useModal} from '@sparkpointio/sparkswap-uikit';
import { ChevronDown } from 'react-feather';
import BigNumber from 'bignumber.js'
import { Token } from 'config/constants/types'
import { useTranslation } from 'contexts/Localization'
import { getFullDisplayBalance, getBalanceNumber, formatNumber } from 'utils/formatBalance'
import Balance from 'components/Balance'
import styled from 'styled-components'
import CollectModal from '../Modals/CollectModal'



interface HarvestActionsProps {
  earnings: BigNumber
  earningToken: Token
  sousId: number
  earningTokenPrice: number
  isBnbPool: boolean
  isLoading?: boolean
}

const HarvestActions: React.FC<HarvestActionsProps> = ({
  earnings,
  earningToken,
  sousId,
  isBnbPool,
  earningTokenPrice,
  isLoading = false,
}) => {
  const { t } = useTranslation()
  const earningTokenBalance = getBalanceNumber(earnings, earningToken.decimals)
  const formattedBalance = formatNumber(earningTokenBalance, 3, 3)

  const earningTokenDollarBalance = getBalanceNumber(earnings.multipliedBy(earningTokenPrice), earningToken.decimals)
  const earningsDollarValue = formatNumber(earningTokenDollarBalance)

  const fullBalance = getFullDisplayBalance(earnings, earningToken.decimals)
  const hasEarnings = earnings.toNumber() > 0
  const isCompoundPool = sousId === 0

  const [onPresentCollect] = useModal(
    <CollectModal
      formattedBalance={formattedBalance}
      fullBalance={fullBalance}
      earningToken={earningToken}
      earningsDollarValue={earningsDollarValue}
      sousId={sousId}
      isBnbPool={isBnbPool}
      isCompoundPool={isCompoundPool}
    />,
  )

  const InlineText = styled(Text)`
  display: inline;
`

  return (
    <Flex flexDirection="column" mb="16px" marginLeft="5px">
        {/* <Flex flexDirection="column">
          {isLoading ? (
            <Skeleton width="80px" height="48px" />
          ) : (
            <>
              {hasEarnings ? (
                <Balance bold fontSize="20px" decimals={5} value={earningTokenBalance} />
              ) : (
                // <Heading color="textDisabled">0</Heading>
                <Text>SRK Staked</Text>
              )}
              {earningTokenPrice !== 0 && (
                <Text fontSize="12px" color={hasEarnings ? 'textSubtle' : 'textDisabled'}>
                  ~
                  {hasEarnings ? (
                    <Balance
                      display="inline"
                      fontSize="12px"
                      color="textSubtle"
                      decimals={2}
                      value={earningTokenDollarBalance}
                      unit=" SRK"
                    />
                  ) : (
                    '0 SRK'
                  )}
                </Text>
              )}
            </>
          )}
        </Flex>
        <Flex marginRight="-12vh" flexDirection="column">
          {isLoading ? (
            <Skeleton width="80px" height="48px" />
          ) : (
            <>
              {hasEarnings ? (
                <Balance bold fontSize="20px" decimals={5} value={earningTokenBalance} />
              ) : (
                // <Heading color="textDisabled">0</Heading>
                <Text>SRK Earned</Text>
              )}
              {earningTokenPrice !== 0 && (
                <Text fontSize="12px" color={hasEarnings ? 'textSubtle' : 'textDisabled'}>
                  ~
                  {hasEarnings ? (
                    <Balance
                      display="inline"
                      fontSize="12px"
                      color="textSubtle"
                      decimals={2}
                      value={earningTokenDollarBalance}
                      // unit=" USD"
                    />
                  ) : (
                    '0.0000'
                  )}
                </Text>
              )}
            </>
          )}
        </Flex> */}
          <Button onClick={onPresentCollect} fullWidth variant="secondary">
            Withdraw <ChevronDown />
          </Button>
    </Flex>
  )
}

export default HarvestActions
