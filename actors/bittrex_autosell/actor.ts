/* implements rabbi actor protocol */

require('dotenv').config();

import { Actor, Joi, log } from 'rabbi';

import { models } from '../../lib';

import { logError } from '../../lib/logger'

import * as cron from 'node-cron';

import * as bittrex from '../../lib/bittrex'

export async function start() {

  cron.schedule('0 * * * * *', async () => { // every minute

    let bittrexAccounts = await models.BittrexAccount.findAll()

    for (let {account_id} of bittrexAccounts) {

      try {

        bittrex.sellAll(account_id)

      } catch(error) {

        logError('bittrex.sellall.error', error.message)

      }

    }

  });

}

if (require.main === module) {

  start();

}

