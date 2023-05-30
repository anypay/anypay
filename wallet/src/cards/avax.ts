
import EVM_Card from './_evm'

export default class AVAX extends EVM_Card {

  currency = 'AVAX'

  chain = 'AVAX'

  decimals = 18

  chainID = 43114

  providerURL = process.env.infura_avalanche_url

}

