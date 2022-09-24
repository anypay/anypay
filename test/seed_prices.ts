require('dotenv').config();

if (process.env.NODE_ENV === 'test' && process.env.TEST_DATABASE_URL) {
  process.env.DATABASE_URL = process.env.TEST_DATABASE_URL
}

import { prices } from '../lib';

(async () => {

  console.log('about to set all crypto prices')
  await prices.setAllCryptoPrices()
  console.log('just set all crypto prices')

  console.log('about to set all fiat prices')
  await prices.setAllFiatPrices()
  console.log('just set all fiat prices')

  process.exit(0);

})();

