
import EVM_Card from './_evm'

export default class ETH extends EVM_Card {

  currency = 'ETH'

  chain = 'ETH'

  decimals = 18

  chainID = 1

  providerURL = process.env.infura_ethereum_url

}

