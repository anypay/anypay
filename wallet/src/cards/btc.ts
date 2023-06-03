import BitcoreCard, { Bitcore, Utxo } from './_bitcore'

//@ts-ignore
import * as btc from 'bitcore-lib'

const bitcore: Bitcore = btc

export default class BTC_Card extends BitcoreCard {

  chain = 'BTC'

  currency = 'BTC'

  bitcore = bitcore

}

