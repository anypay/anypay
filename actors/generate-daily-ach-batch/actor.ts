/* implements rabbi actor protocol */

require('dotenv').config();

import { log, getChannel } from 'rabbi';

const CronJob = require('node-cron').CronJob;

export async function start() {

  let channel = await getChannel();

  // monday through friday 8:30 am
  const job = new CronJob('00 30 8 * * 1-5', function() { 

    log.info('cron.generateachbatch')

    await channel.publish('anypay.ach', 'generateachbatch', Buffer.from(''));

  });

  job.start();

}

if (require.main === module) {

  start();

}

