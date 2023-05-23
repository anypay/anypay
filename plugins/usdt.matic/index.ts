
import { ERC20 } from '../../lib/plugins/erc20'

export default class USDT_MATIC extends ERC20 {

  currency = 'USDT'

  chain = 'MATIC'

  token = '0xc2132d05d31c914a87c6611c10748aeb04b58e8f'

  decimals = 6

  chainID = 137

  providerURL = process.env.infura_polygon_url

}

