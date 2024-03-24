
import { config } from '../../../lib'
import EVM_Card from './_evm'

export default class MATIC extends EVM_Card {

  currency = 'MATIC'

  chain = 'MATIC'

  chainID = 137

  decimals = 18

  providerURL = config.get('INFURA_POLYGON_URL')

}

