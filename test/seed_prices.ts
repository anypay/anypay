require('dotenv').config();

import { prices, initialize } from '../lib';

(async () => {

  await initialize()

  console.log('setAllCryptoPrices')

  await prices.setAllCryptoPrices()

  console.log('setAllFiatPrices')

  await prices.setAllFiatPrices()

  process.exit(0);

})();

