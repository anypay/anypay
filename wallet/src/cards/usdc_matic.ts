import ERC20_Card from './_erc20'

export default class USDC_MATIC extends ERC20_Card {

  currency = 'USDC'

  chain = 'MATIC'

  token = '0x2791bca1f2de4661ed88a30c99a7a9449aa84174'

  decimals = 6

  chainID = 137

  providerURL = process.env.infura_polygon_url //TODO: Get from Config or Browser

}

