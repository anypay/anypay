
import BitcoreCard, { Bitcore } from './_bitcore'

//@ts-ignore
import * as bch from 'bitcore-lib-cash'

const bitcore: Bitcore = bch

export default class BCH_Card extends BitcoreCard {

  chain = 'BCH'

  currency = 'BCH'

  bitcore = bitcore

}

