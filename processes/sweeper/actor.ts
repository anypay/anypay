import {sweepUnpaid} from '../../lib/core';

(async function() {

  var CronJob = require('cron').CronJob;

  let unpaidCron = new CronJob('0 * * * * *', async function() {

      console.log('sweep unpaid DASH invoices');

      await sweepUnpaid();

  }, null, true, 'America/New_York');

  unpaidCron.start();

  console.log('start cron to sweep unpaid invoices every minute');

})();

