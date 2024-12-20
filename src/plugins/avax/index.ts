
import { config } from '@/lib'
import { EVM } from '@/lib/plugins/evm'

export default class AVAX extends EVM {

  chain = 'AVAX'

  currency = 'AVAX'

  decimals = 18

  chainID = 43114

  providerURL = config.get('INFURA_AVALANCHE_URL')

}
