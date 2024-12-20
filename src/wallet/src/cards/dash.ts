
import BitcoreCard from './_bitcore'

//@ts-ignore
import * as dash from '@dashevo/dashcore-lib'

export default class DashCard extends BitcoreCard {

  chain = 'DASH'

  currency = 'DASH'

  bitcore = dash

}

