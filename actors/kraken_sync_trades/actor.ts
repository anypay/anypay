
import { Actor } from 'rabbi';

import { log, kraken } from '../../lib';

import { publish } from '../../lib/amqp';

import * as cron from 'node-cron';

import * as http from 'superagent';

export async function start() {

  Actor.create({

    exchange: 'anypay.events',

    routingkey: 'kraken_sync_new_trades',

    queue: 'kraken_sync_new_trades'

  })
  .start(async (channel, msg) => { 

    log.info('kraken sync trades');

    await kraken.syncAllNewTrades();

    channel.ack(msg);

  });

  cron.schedule('0 * * * * *', async () => { // every minute

    await publish('kraken_sync_new_trades');

  });

  await publish('kraken_sync_new_trades');

}


if (require.main === module) {

  start();

}

