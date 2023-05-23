
import { ERC20 } from '../../lib/plugins/erc20'

export default class USDT_ETH extends ERC20 {

  chain = 'ETH'

  currency = 'USDT'

  token = '0xdac17f958d2ee523a2206206994597c13d831ec7'

  decimals = 6

  chainID = 1

  providerURL = process.env.infura_ethereum_url

}

