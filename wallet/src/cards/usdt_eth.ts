
import ERC20_Card from './_erc20'

import PaymentOption from '../payment_option'

import Transaction from '../transaction'

export default class USDT_ETH extends ERC20_Card {

  currency = 'USDT'

  chain = 'ETH'

  decimals = 6

  token = '0xdac17f958d2ee523a2206206994597c13d831ec7'

  chainID = 1

  providerURL = process.env.infura_ethereum_url

}

