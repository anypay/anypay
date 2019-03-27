
import { log } from '../../lib';

import { connect } from 'amqplib';

import { receivePayment } from '../../lib/payment_processor';

require('dotenv').config();

async function start() {

  let connection = await connect(process.env.AMQP_URL);

  let channel = await connection.createChannel();

  log.info('amqp.channel.created');

  await channel.assertExchange('anypay.forwarder', 'direct');

  await channel.assertQueue('anypay.processor.payment.forwarded');

  await channel.bindQueue(
    'anypay.processor.payment.forwarded',
    'anypay.forwarder',
    'payment.forwarded'
  );

  log.info('amqp.channel.connected');

  channel.consume('anypay.processor.payment.forwarded', async (msg) => {
    let message = JSON.parse(msg.content.toString());

    log.info('payment.forwarded.callback', message);

    let payment = await receivePayment({
      currency: "BCH",
      amount: message.value,
      address: message.input_address,
      hash: message.input_transaction_hash,
      output_hash: message.destination_transaction_hash
    });

    channel.ack(msg);

  });

}

export {
	start
}

if (require.main === module) {

  start();

}

(async function() {

})();

