
import ERC20_Card from './_erc20'

import { config } from '../../../lib'

export default class USDC_ETH extends ERC20_Card {

  currency = 'USDC'

  chain = 'ETH'

  decimals = 6

  token = '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48'

  chainID = 1

  providerURL = config.get('INFURA_ETHEREUM_URL')

}

