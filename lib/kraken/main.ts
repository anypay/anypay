
/* implements rabbi actor protocol */

require('dotenv').config();

import { Op } from 'sequelize'

import { config, log } from '../../lib';

import { listAll } from './lib/kraken_account'

import * as cron from 'node-cron'

async function marketSellAllAccounts() {

  let accounts = await listAll({
    where: {
      autosell: {
        [Op.ne]: null
      }
    }
  })

  for (let kraken of accounts) {

    let result = await kraken.sellAll()

    log.debug('kraken.sellall', result)

  }

}

export async function start() {
  
  log.info('cron.kraken.autosell.start')
  
  try {

    await marketSellAllAccounts()

  } catch(error) {

    console.error(error)

  }

  const interval = config.get('KRAKEN_AUTOSELL_INTERVAL') || '0 * * * * *' // default to every minute

  cron.schedule(interval, async () => {

    await marketSellAllAccounts()

  })

}

if (require.main === module) {

  start();

}

