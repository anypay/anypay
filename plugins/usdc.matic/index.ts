
import { ERC20 } from '../../lib/plugins/erc20'

export default class USDC_MATIC extends ERC20 {

  currency = 'USDC'

  chain = 'MATIC'

  token = '0x2791bca1f2de4661ed88a30c99a7a9449aa84174'

  decimals = 6

  chainID = 137

  providerURL = process.env.INFURA_POLYGON_URL

}

