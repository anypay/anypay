
import DASH from './cards/dash'

import BCH from './cards/bch'

import LTC from './cards/ltc'

import BSV from './cards/bsv'

import XMR from './cards/xmr'

import BTC from './cards/btc'

import DOGE from './cards/doge'

import ETH from './cards/eth'

import MATIC from './cards/matic'

import AVAX from './cards/avax'

import USDC_MATIC from './cards/usdc_matic'

import USDC_AVAX from './cards/usdc_avax'

import USDC_ETH from './cards/usdc_eth'

import USDT_MATIC from './cards/usdt_matic'

import USDT_AVAX from './cards/usdt_avax'

import USDT_ETH from './cards/usdt_eth'

import _EVM from './cards/_evm'

import _ERC20 from './cards/_erc20'

import _Base from './cards/_base'

interface CardsMap {
  [name: string]: any
}

const cards = {
  'DASH': DASH,
  'BCH': BCH,
  'LTC': LTC,
  'BSV': BSV,
  'XMR': XMR,
  'BTC': BTC,
  'DOGE': DOGE,
  'ETH': ETH,
  'MATIC': MATIC,
  'AVAX': AVAX,
  'USDC_MATIC': USDC_MATIC,
  'USDC_ETH': USDC_ETH,
  'USDC_AVAX': USDC_AVAX,
  'USDT_MATIC': USDT_MATIC,
  'USDT_ETH': USDT_ETH,
  'USDT_AVAX': USDT_AVAX,
}

export {

  USDC_MATIC,

  USDC_AVAX,

  USDC_ETH,

  USDT_MATIC,

  USDT_AVAX,

  USDT_ETH,

  MATIC,

  AVAX,

  ETH,

  DASH,

  LTC,

  DOGE,

  BSV,

  BTC,

  BCH,

  XMR,

  _Base,

  _EVM,

  _ERC20,

}

