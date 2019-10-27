/* implements rabbi actor protocol */

require('dotenv').config();

import { Actor, Joi, log } from 'rabbi';

import * as datapay from 'datapay';

export async function start() {

  Actor.create({

    exchange: 'anypay.bsv',

    routingkey: 'writetodatapay',

    queue: 'writetodatapay',

    schema: Joi.array()

  })
  .start(async (channel, msg, array) => {

    log.info(msg.content.toString());

    log.info('opreturn', {op_return: array});

    try {

      let txid = await datapay.send({
        safe: true,
        data: array,
        pay: { key: process.env.DATAPAY_WIF }
      }, async (err, txid) => {

        if (err) {

          await channel.publish('anypay.bsv', 'datapay.error', Buffer.from(err.message));

          await channel.ack(msg);

        } else {

          await channel.publish('anypay.bsv', 'datapay.tx.sent', Buffer.from(txid));

        }

        await channel.ack(msg);

      });


    } catch(error) {

      log.error({ error: error.message });

      await channel.ack(msg);

    }

  });

  Actor.create({

    exchange: 'anypay.bsv',

    routingkey: 'datapay.tx.sent',

    queue: 'log_datapay_tx_sent'

  })
  .start(async (channel, msg) => {

    console.log(msg.content.toString());

    log.info('datapay.tx.sent', { txid: msg.content.toString() });

    await channel.ack(msg);

  });

  Actor.create({

    exchange: 'anypay.bsv',

    routingkey: 'datapay.error',

    queue: 'log_datapay_error',

    schema: Joi.array()

  })
  .start(async (channel, msg, array) => {

    log.info('datapay.error', msg.content.toString());

    await channel.ack(msg);

  });



}

if (require.main === module) {

  start();

}

