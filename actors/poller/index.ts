import {Channel, Message} from "amqplib"; 
import { log, models } from '../../lib';

const exchange = 'anypay.events';
const queue = "anypay.invoice.payments.check";

import * as moment from 'moment';

export async function checkInvoicesUntilExpiredOrPaid(channel: Channel, lambda) {

  await channel.assertQueue(queue);

  channel.consume(queue, async function(msg: Message) {

    try {

    /* lookup invoice by uid from message */

      let invoice = await models.Invoice.findOne({ where: {

        uid: msg.content.toString()

      }});

      if (!invoice) {

        log.info(`invoice ${msg.content.toString()} not found`);

        await channel.ack(msg);

        return;

      }

      log.info('invoice found', invoice.toJSON());

      if ( moment() > moment(invoice.expiry) ) {

        log.info(`invoice ${invoice.uid} expired`);

        await channel.ack(msg);

        return;

      }

      if ( invoice.status != 'unpaid' ) {

        log.info(`invoice ${invoice.uid} already paid`);

        await channel.ack(msg);

        return;

      }

      try {

        await lambda(invoice);

      } catch(error) {

        log.error(error.message);

      }

      /* republish message */

      await channel.publish(exchange, queue, msg.content);

      await channel.ack(msg);

    } catch(error) {

        log.error(error.message);

        await channel.nack(msg);

    }
  
  }, {

    noAck: false
    
  });

}

