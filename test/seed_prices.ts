require('dotenv').config();

import { prices } from '../lib';

(async () => {

  await prices.setPrice('BTC', 1000, 'USD');
  await prices.setPrice('BCH', 10, 'USD');
  await prices.setPrice('DASH', 20, 'USD');
  await prices.setPrice('VEF', 20, 'DASH');
  await prices.setPrice('VEF', 0.0000005, 'USD');

  process.exit(0);

})();

