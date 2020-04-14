/* implements rabbi actor protocol */

require('dotenv').config();

import { Actor, Joi, log } from 'rabbi';

import { models, receipts, amqp } from '../../lib';

export async function start() {

  Actor.create({

    exchange: 'anypay:invoices',

    routingkey: 'invoice:paid',

    queue: 'receipts_to_blockchain',

  })
  .start(async (channel, msg) => {

    log.info(msg.content.toString());

    let [receipt, isNew] = await models.BlockchainReceipt.findOrCreate({
      where: {
        invoice_uid: msg.content.toString()
      },

      defaults: {
        invoice_uid: msg.content.toString()
      }
    });

    if (receipt.txid) {
      throw new Error('receipt already published');
    }

    log.info('blockchain_receipt.created', receipt.toJSON());

    let publication: any = await receipts.publishReceipt(receipt.id);

    console.log('publication', publication);

    receipt.txid = publication.txid;
    receipt.hex = publication.hex;

    await receipt.save();

    await amqp.wait(3000);

    channel.ack(msg);

  });

}

if (require.main === module) {

  start();

}

