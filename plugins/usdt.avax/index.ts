
import { config } from '../../lib'
import { ERC20 } from '../../lib/plugins/erc20'

export default class USDT_AVAX extends ERC20 {

  chain = 'AVAX'

  currency = 'USDT'

  decimals = 6

  token = '0x9702230a8ea53601f5cd2dc00fdbc13d4df4a8c7'

  chainID = 43114

  providerURL = config.get('INFURA_AVALANCHE_URL')

}

