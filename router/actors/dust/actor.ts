
import { sweepDust } from '../../lib';

var CronJob = require('cron').CronJob;

async function start() {

  new CronJob('0 * * * * *', async function() {

    console.log('Sweep Dust Every Minute');

    await sweepDust();

  }, null, true, 'America/New_York');
  
}

if (require.main === module) {

  start();

}

export {

  start

}
