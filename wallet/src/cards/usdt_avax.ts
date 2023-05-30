import ERC20_Card from './_erc20'

import PaymentOption from '../payment_option'

import Transaction from '../transaction'

export default class USDT_AVAX extends ERC20_Card {

  currency = 'USDT'

  chain = 'AVAX'

  decimals = 6

  token = '0x9702230a8ea53601f5cd2dc00fdbc13d4df4a8c7'

  chainID = 43114

  providerURL = process.env.infura_avalanche_url

}

