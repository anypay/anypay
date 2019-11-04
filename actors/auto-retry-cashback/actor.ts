/* implements rabbi actor protocol */

require('dotenv').config();

import * as cron from 'node-cron';

import { cashback, log, amqp } from '../../lib';

export async function start() {

  const channel = await amqp.awaitChannel();

  cron.schedule('* * * * *', async () => { //every minute

    log.info('cashback.failures.retryall');

    let failures = await cashback.listFailures();

    failures.forEach(failure => {

      log.info(failure);

      let message = Buffer.from(failure.uid);

      channel.sendToQueue('cryptozone:cashback:customers', message);

    });

  });

}

if (require.main === module) {

  start();

}
