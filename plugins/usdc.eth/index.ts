
import { config } from '../../lib'
import { ERC20 } from '../../lib/plugins/erc20'

export default class USDC_ETH extends ERC20 {

  currency = 'USDC'

  chain = 'ETH'

  token = '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48'

  decimals = 6

  chainID = 1

  providerURL = config.get('INFURA_ETHEREUM_URL')

}

