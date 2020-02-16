
import { forwardUnspent } from '../../lib';

var CronJob = require('cron').CronJob;

async function start() {

  new CronJob('*/5 * * * * *', async function() {

    console.log('Forward All Unspent Outputs');

    await forwardUnspent();

  }, null, true, 'America/New_York');
  
}

if (require.main === module) {

  start();

}

export {

  start

}
