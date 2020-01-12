
require('dotenv').config();

import * as cron from 'cron';

import {notifyDashBackBalance} from '../../lib/balance_notifier';

import * as telegram from '../../lib/telegram';

const CRON_PATTERN = '0 0 * * * *'; // every hour

import {publishSlackMessage} from '../../lib/slack_notifier';

export async function start() {

  console.log("starting balance notifier actor"); 

  let job = new cron.CronJob(CRON_PATTERN, async function() {
  
    await notifyDashBackBalance();

  })

  job.start();

  let daily = new cron.CronJob('0 0 0 7 * *', async function() { // 7 am
  
    await telegram.notifyDashBackBalance();

  });

  daily.start();

}

if (require.main === module) {

  start();
}

