
import coins from './coins'
import prices from './prices'
import rabbi from './rabbi'

export async function initialize() {
  await coins()
  await prices()
  await rabbi()
}

