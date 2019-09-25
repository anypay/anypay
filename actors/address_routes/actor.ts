
import { log, models } from '../../lib';
import { awaitChannel } from '../../lib/amqp';

import { connect } from 'amqplib';

import { createAddressRoute } from '../../lib/routes';

require('dotenv').config();

async function start() {

  let channel = await awaitChannel();

  log.info('amqp.channel.created');

  const queue = 'anypay.addressroutes.create'

  await channel.assertQueue(queue);

  await channel.bindQueue(
    queue,
    'anypay.events',
    'invoice.created'
  );

  log.info('amqp.channel.connected');

  channel.consume(queue, async (msg) => {

    let msgString = msg.content.toString();

    var invoice;

    try {

      invoice = JSON.parse(msgString);

    } catch(error) {

      log.error(queue, `message not json ${msgString}`);

    }

    if (!invoice) {

      invoice = (await models.Invoice.findOne({ where: { uid: msgString
      }})).toJSON();
    }

    if (!invoice) {

      log.info('invoice not found', msgString);

      return channel.ack(msg);
    }

    log.info(queue, invoice);

    try {

      let route = await createAddressRoute(invoice);

      log.info('addressroute.created', route.toJSON());

    } catch(error) {

      log.error('error creating address route', error.message);

    }

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

