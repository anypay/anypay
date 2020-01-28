/* implements rabbi actor protocol */

require('dotenv').config();

import { log, getChannel } from 'rabbi';

const CronJob = require('cron').CronJob;

import { generateLatestBatch }  from '../../lib/ach';

export async function start() {

  let channel = await getChannel();

  // monday through friday 8:30 am
  const job = new CronJob('00 30 8 * * 1-5', async function() { 

    log.info('cron.generateachbatch')

    try {

      let batch = await generateLatestBatch(); 

      console.log('batch.generated', batch.toJSON());

    } catch(error) {

      console.log(error.message);

    }

  }, null, true, 'America/New_York');

  job.start();

}

if (require.main === module) {

  start();

}

