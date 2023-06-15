/* implements rabbi actor protocol */

require('dotenv').config();

import { log } from 'rabbi';

import * as cron from 'node-cron'

import { listAll } from '../../lib/kraken_account'

import { syncDeposits } from '../..'

import { findAccount } from '../../../../lib/account'

export async function start() {

  // sync kraken trades

  cron.schedule('0 * * * * *', async () => { // every minute

    let krakenAccounts = await listAll()

    await Promise.all(krakenAccounts.map(async krakenAccount => {

      let account = await findAccount(krakenAccount.get('account_id'))

      log.info('kraken.deposits.sync', {account_id: account.get('id') })

      try {

        await syncDeposits(account)

        log.info('kraken.deposits.sync.complete', {account_id: account.get('id') })

      } catch(error) { 

        log.error('kraken.deposits.sync.error', error)

      }

    }))

  })

}

if (require.main === module) {

  start();

}

