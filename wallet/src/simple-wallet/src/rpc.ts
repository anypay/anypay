require('dotenv').config()

import { rpc as bsv } from './assets/bsv'
import { rpc as bch } from './assets/bch'
import { rpc as dash } from './assets/dash'
import { rpc as ltc } from './assets/ltc'
import { rpc as doge } from './assets/doge'
import { rpc as btc } from './assets/btc'
import { rpc as xmr } from './assets/xmr'

export function getRPC(currency) {

  switch(currency) {
    case 'BSV':
      return bsv
    case 'BCH':
      return bch
    case 'BTC':
      return btc
    case 'LTC':
      return ltc
    case 'DASH':
      return dash
    case 'DOGE':
      return doge
    case 'XMR':
      return xmr;
    default:
      throw new Error('rpc for currency not found')
  }

}

