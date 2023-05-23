
import { EVM } from '../../lib/plugins/evm'

export default class ETH extends EVM {

  chain = 'ETH'

  currency = 'ETH'

  decimals = 18

  chainID = 1

  providerURL = process.env.infura_ethereum_url

}

