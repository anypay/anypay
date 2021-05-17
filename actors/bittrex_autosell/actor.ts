/* implements rabbi actor protocol */

require('dotenv').config();

import { Actor, Joi, log } from 'rabbi';

import * as cron from 'node-cron';

import { marketOrder } from '../../lib/bittrex'

export async function start() {

  cron.schedule('0 * * * * *', async () => { // every minute

    let order = await marketOrder(1) // sell 1 BSV if available

    console.log('bittrex.sell.market.bsv', order)

  });

}

if (require.main === module) {

  start();

}

