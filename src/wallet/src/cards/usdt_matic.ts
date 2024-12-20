
import ERC20_Card from './_erc20'
import { config  } from '../../../lib'

export default class USDT_MATIC extends ERC20_Card {

  currency = 'USDT'

  chain = 'MATIC'

  token = '0xc2132d05d31c914a87c6611c10748aeb04b58e8f'

  decimals = 6

  chainID = 137

  providerURL = config.get('INFURA_POLYGON_URL')

}

