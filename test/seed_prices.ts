
import { prices, initialize } from '../lib'

(async () => {

  await initialize()

  console.log('about to set all crypto prices')
  await prices.setAllCryptoPrices()
  console.log('just set all crypto prices')

  console.log('about to set all fiat prices')
  await prices.setAllFiatPrices()
  console.log('just set all fiat prices')

  process.exit(0);

})();

