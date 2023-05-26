
import ERC20_Card from './_erc20'

import PaymentOption from '../payment_option'

import Transaction from '../transaction'

export default class USDC_AVAX extends ERC20_Card {

  currency = 'USDC'

  chain = 'AVAX'

  decimals = 6

  token = '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48'

  chainID = 1

  providerURL = process.env.infura_ethereum_url

}

