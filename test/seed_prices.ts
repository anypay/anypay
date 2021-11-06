require('dotenv').config();

if (process.env.NODE_ENV === 'test' && process.env.TEST_DATABASE_URL) {
  process.env.DATABASE_URL = process.env.TEST_DATABASE_URL
}

import { prices } from '../lib';

(async () => {

  await prices.setPrice('BTC', 1000, 'test', 'USD');
  await prices.setPrice('BCH', 10,'test', 'USD');
  await prices.setPrice('DASH', 20,'test', 'USD');
  await prices.setPrice('BSV', 20,'test', 'USD');
  await prices.setPrice('BSV', 200, 'test', 'USD');
  await prices.setPrice('VEF', 0.0000005,'test', 'USD');
  await prices.setPrice('LTC', 180,'test', 'USD');

  process.exit(0);

})();

