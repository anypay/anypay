/* implements rabbi actor protocol */

require('dotenv').config();

import { Actor, Joi, log } from 'rabbi';

import { models } from '../../lib';

import * as cron from 'node-cron';

import * as bittrex from '../../lib/bittrex'

export async function start() {

  cron.schedule('*/10 * * * * *', async () => { // every minute

    let bittrexAccounts = await models.BittrexAccount.findAll()

    for (let {account_id} of bittrexAccounts) {

      let balances = await bittrex.listBalances(account_id)

      for (let balance of balances) {

        console.log('bittrex.balance', Object.assign(balance, {account_id}))

        if (balance.available > 0) {

          let order = await bittrex.sellAllOfCurrency(account_id, balance.currencySymbol)

          if (order) {

            console.log(`bittrex.order`, order)

          }

        }

      }

    }

  });

}

if (require.main === module) {

  start();

}

