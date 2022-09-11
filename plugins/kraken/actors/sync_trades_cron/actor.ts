/* implements rabbi actor protocol */

require('dotenv').config();

import { log } from '../../../../lib/log';

import * as cron from 'node-cron'

import { listAll } from '../../lib/kraken_account'

import { syncTrades } from '../..'

import { findAccount } from '../../../../lib/account'

export async function start() {

  // sync kraken trades

  cron.schedule('30 * * * * *', async () => { // every minute

    let krakenAccounts = await listAll()

    await Promise.all(krakenAccounts.map(async krakenAccount => {

      let account = await findAccount(krakenAccount.get('account_id'))

      log.info('kraken.trades.sync', {account_id: account.get('id') })

      try {

        await syncTrades(account)

        log.info('kraken.trades.sync.complete', {account_id: account.get('id') })

      } catch(error) { 

        log.error('kraken.trades.sync.error', error)

      }

    }))

  })

}

if (require.main === module) {

  start();

}

