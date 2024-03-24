
import { config } from '../../lib'
import { ERC20 } from '../../lib/plugins/erc20'

export default class USDC_AVAX extends ERC20 {

  chain = 'AVAX'

  currency = 'USDC'

  decimals = 6

  token = '0xb97ef9ef8734c71904d8002f8b6bc66dd9c48a6e'

  chainID = 43114

  providerURL = config.get('INFURA_AVALANCHE_URL')

}

