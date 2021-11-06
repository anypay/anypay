require('dotenv').config();

if (process.env.NODE_ENV === 'test' && process.env.TEST_DATABASE_URL) {
  process.env.DATABASE_URL = process.env.TEST_DATABASE_URL
}

import { prices } from '../lib';

(async () => {

  await prices.setPrice('BTC', 1000, 'test', 'USD');
  await prices.setPrice('USD', 0.0001, 'test', 'BTC');
  await prices.setPrice('BCH', 10,'test', 'USD');
  await prices.setPrice('USD', 0.01,'test', 'BCH');
  await prices.setPrice('DASH', 20,'test', 'USD');
  await prices.setPrice('USD', 0.05,'test', 'DASH');
  await prices.setPrice('BSV', 20,'test', 'USD');
  await prices.setPrice('USD', 0.05, 'test', 'BSV');
  await prices.setPrice('LTC', 180,'test', 'USD');
  await prices.setPrice('USD', 0.02,'test', 'LTC');

  process.exit(0);

})();

