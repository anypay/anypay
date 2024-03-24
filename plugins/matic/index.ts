
import { config } from '../../lib'
import { EVM } from '../../lib/plugins/evm'

export default class MATIC extends EVM {

  chain = 'MATIC'

  currency = 'MATIC'

  decimals = 18

  chainID = 137

  providerURL = config.get('INFURA_POLYGON_URL')

}

