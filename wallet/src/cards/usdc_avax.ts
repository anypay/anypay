import ERC20_Card from './_erc20'

import PaymentOption from '../payment_option'

import Transaction from '../transaction'
import { config } from '../../../lib'

export default class USDC_AVAX extends ERC20_Card {

  currency = 'USDC'

  chain = 'AVAX'

  decimals = 6

  token = '0xb97ef9ef8734c71904d8002f8b6bc66dd9c48a6e'

  chainID = 43114

  providerURL = config.get('INFURA_AVALANCHE_URL')

}

