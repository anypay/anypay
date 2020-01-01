/* implements rabbi actor protocol */

require('dotenv').config();

import { Actor, Joi, log } from 'rabbi';

import { grabAndGoCreateOrder } from '../../lib/square';

import { models, accounts } from '../../lib';

export async function start() {

  Actor.create({

    exchange: 'anypay.invoices',

    routingkey: 'invoice:paid',

    queue: 'grab_and_go_create_order'

  })
  .start(async (channel, msg) => {

    log.info(msg.content.toString());

    let invoiceUid = msg.content.toString();

    let grabAndGoInvoice = await models.GrabAndGoInvoice.findOne({

      where: {

        invoice_uid: invoiceUid

      }

    });

    if (grabAndGoInvoice) {

      let squareOrder = await grabAndGoCreateOrder(invoiceUid);

      log.info('square.order.created', squareOrder);

      await channel.publish('anypay.events', 'square.order.created', Buffer.from(JSON.stringify(squareOrder)));

    }

    channel.ack(msg);

  });

}

if (require.main === module) {

  start();

}

