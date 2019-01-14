import { plugins, log, models } from '../../lib';

import { emitter } from '../../lib/events';

import {Connection, Channel, Message, connect} from "amqplib"; 

import { checkInvoicesUntilExpiredOrPaid } from './';

const exchange = 'anypay.events';

const queue = "anypay.invoice.payments.check";

async function start() {

  let conn: Connection = await connect(process.env.AMQP_URL);

  let channel: Channel = await conn.createChannel()

  /*
    -------------------------------
    checkInvoicesUntilExpiredOrPaid
    -------------------------------

    Pulls invoice records from database based on a queue of invoice uids.

    Invoices will be automatically re-queued at the back after checking.

    Expired invoices are automatically removed from the queue.

    Paid invoices automatically removed from the queue

  */

  checkInvoicesUntilExpiredOrPaid(channel, async function(invoice) {

    log.info('check invoice for payment', invoice.uid);

    await plugins.checkAddressForPayments(invoice.address, invoice.currency);

  });

  // Automatically begin polling when invoice is created by binding queue

  await channel.bindQueue(queue, exchange, 'invoice.created');

  // Legacy: begin polling when in-memory event is emitted

	emitter.on('invoice.created', async (invoice) => {
	  
		log.info(`invoice.created ${invoice.uid}`);

		log.info(`invoice.startpolling ${invoice.uid}`);

		emitter.emit('invoice.poll', invoice);

    await channel.publish(exchange, queue, new Buffer(invoice.uid));
	  
	});

}

export {
	start
}

if (require.main === module) {

  start();

}

