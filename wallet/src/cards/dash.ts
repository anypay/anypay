
import BitcoreCard, { Bitcore } from './_bitcore'

//@ts-ignore
import * as dash from '@dashevo/dashcore-lib'

const bitcore: Bitcore = dash

export default class DashCard extends BitcoreCard {

  chain = 'DASH'

  currency = 'DASH'

  bitcore = dash

}

