import ERC20_Card from './_erc20'

import PaymentOption from '../payment_option'

import Transaction from '../transaction'

export default class USDC_AVAX extends ERC20_Card {

  currency = 'USDC'

  chain = 'AVAX'

  decimals = 6

  token = '0xb97ef9ef8734c71904d8002f8b6bc66dd9c48a6e'

  chainID = 43114

  providerURL = process.env.infura_avalanche_url

}

