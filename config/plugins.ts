

import { Plugin } from '../lib/plugin'

export interface Plugins {
  [name: string]: Plugin
}

import BTC from '../plugins/btc'
import BSV from '../plugins/bsv'
import BCH from '../plugins/bch'
import DASH from '../plugins/dash'
import LTC from '../plugins/ltc'
import DOGE from '../plugins/doge'
import AVAX from '../plugins/avax'
import ETH from '../plugins/eth'
import SOL from '../plugins/sol'
import XRP from '../plugins/xrp'
import XLM from '../plugins/xlm'
import XMR from '../plugins/xmr'
import MATIC from '../plugins/matic'
import USDC_AVAX from '../plugins/usdc.avax'
import USDC_MATIC from '../plugins/usdc.matic'
import USDC_ETH from '../plugins/usdc.eth'
import USDC_SOL from '../plugins/usdc.sol'
import USDT_AVAX from '../plugins/usdt.avax'
import USDT_MATIC from '../plugins/usdt.matic'
import USDT_ETH from '../plugins/usdt.eth'
import USDT_SOL from '../plugins/usdt.sol'

export const plugins: Plugins = {
  BTC: new BTC(),
  BSV: new BSV(),
  BCH: new BCH(),
  DASH: new DASH(),
  LTC: new LTC(),
  DOGE: new DOGE(),
  AVAX: new AVAX(),
  ETH: new ETH(),
  SOL: new SOL(),
  XRP: new XRP(),
  XLM: new XLM(),
  XMR: new XMR(),
  MATIC: new MATIC(),
  'USDC.AVAX': new USDC_AVAX(),
  'USDC.MATIC': new USDC_MATIC(),
  'USDC.ETH': new USDC_ETH(),
  'USDC.SOL': new USDC_SOL(),
  'USDT.AVAX': new USDT_AVAX(),
  'USDT.MATIC': new USDT_MATIC(),
  'USDT.ETH': new USDT_ETH(),
  'USDT.SOL': new USDT_SOL()  
}
