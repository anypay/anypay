require('dotenv').config();

import { publish } from '../../lib/amqp';

require('../prices_bch/actor').start();
require('../prices_bsv/actor').start();
require('../prices_dash/actor').start();
require('../prices_btc/actor').start();
require('../prices_usd/actor').start();
require('../prices_usd_crypto/actor').start();
require('../prices_ves/actor').start();

export async function start() {

  setInterval(async () => {

     await publish('update_usd_prices');
     await publish('update_ves_prices');

  }, 1000 * 60 * 60); // every hour

  setInterval(async () => {

     await publish('update_prices_usd_crypto');
     await publish('update_bch_prices');
     await publish('update_dash_prices');
     await publish('update_bsv_prices');
     await publish('update_btc_prices');

  }, 1000 * 1); // every two minute

   await publish('update_prices_usd');
   await publish('update_prices_usd_crypto');
   await publish('update_bch_prices');
   await publish('update_dash_prices');
   await publish('update_bsv_prices');
   await publish('update_btc_prices');
   await publish('update_ves_prices');

}

if (require.main === module) {

  start();

}

