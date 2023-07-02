require('dotenv').config();

if (process.env.NODE_ENV === 'test' && process.env.TEST_DATABASE_URL) {
  process.env.DATABASE_URL = process.env.TEST_DATABASE_URL
}

import { prices, initialize } from '../lib';

(async () => {

  await initialize()

  console.log('setAllCryptoPrices')

  await prices.setAllCryptoPrices()

  console.log('setAllFiatPrices')

  await prices.setAllFiatPrices()

  process.exit(0);

})();

