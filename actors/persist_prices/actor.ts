/* implements rabbi actor protocol */

require('dotenv').config();

import { Actor, Joi, log } from 'rabbi';

import * as cron from 'node-cron'

import { getCryptoPrices, updateCryptoUSDPrices } from '../../lib/prices'

export async function start() {

  await updateCryptoUSDPrices()

  const interval = process.env.PERSIST_PRICES_INTERVAL || '0 */10 * * * *' // default to every ten minutes

  cron.schedule(interval, async () => {

    await updateCryptoUSDPrices()
    
    await getCryptoPrices('USD')

  })

}

if (require.main === module) {

  start();

}

