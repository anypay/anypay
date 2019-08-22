require('dotenv').config();

import { prices } from '../lib';

(async () => {

  await prices.setPrice('USD', 1000, 'BTC');
  await prices.setPrice('BCH', 10, 'BTC');
  await prices.setPrice('DASH', 20, 'BTC');
  await prices.setPrice('ZEN', 20, 'BTC');
  await prices.setPrice('ZEN', 20, 'USD');
  await prices.setPrice('VEF', 20, 'DASH');
  await prices.setPrice('VEF', 0.0000005, 'USD');

  process.exit(0);

})();

