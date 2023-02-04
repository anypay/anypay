
import coins from './coins'
import prices from './prices'
import rabbi from './rabbi'
import postgres from './postgres'

export async function initialize() {
  await postgres()
  await coins()
  await prices()
  await rabbi()
}
