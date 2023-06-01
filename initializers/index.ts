
import coins from './coins'
import prices from './prices'
import rabbi from './rabbi'
import prometheus from './prometheus'
import plugins from './plugins'

import { Anypay } from '../lib/index'

export async function initialize(anypay: Anypay) {

  console.log('initialize coins')
  await coins()

  console.log('initialize prices')
  await prices()

  console.log('initialize rabbi')
  await rabbi()

  console.log('initialize prometheus')
  await prometheus(anypay)

  console.log('initialize plugins')
  await plugins()

  console.log('initialization complete')
}

