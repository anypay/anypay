/* implements rabbi actor protocol */

require('dotenv').config();

import { Actor, Joi, log } from 'rabbi';

import * as cron from 'node-cron'

import { updateCryptoUSDPrices } from '../../lib/prices'

export async function start() {
  
  try {

    await updateCryptoUSDPrices()

  } catch(error) {

    console.error(error)

  }

  const interval = process.env.PERSIST_PRICES_INTERVAL || '0 */5 * * * *' // default to every ten minutes

  cron.schedule(interval, async () => {

    await updateCryptoUSDPrices()

  })

}

if (require.main === module) {

  start();

}

