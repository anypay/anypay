require('dotenv').config();

import { prices } from '../lib';

(async () => {

  await prices.setPrice('BTC', 1000, 'test', 'USD');
  await prices.setPrice('BCH', 10,'test', 'USD');
  await prices.setPrice('DASH', 20,'test', 'USD');
  await prices.setPrice('VEF', 20,'test', 'DASH');
  await prices.setPrice('VEF', 0.0000005,'test', 'USD');

  process.exit(0);

})();

