/* implements rabbi actor protocol */

require('dotenv').config();

import * as cron from 'node-cron';

import { Actor, log } from 'rabbi';

import { prices } from '../../lib';
import { updateCryptoUSDPrices } from '../../lib/prices/crypto';

export async function start() {

  cron.schedule('0 */5 * * * *', async () => {

    await prices.updateDashPrices()

    await updateCryptoUSDPrices()

  })

}

if (require.main === module) {

  start();

}

