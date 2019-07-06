
import { log, models } from '../../lib';
import { awaitChannel } from '../../lib/amqp';

import { connect } from 'amqplib';

require('dotenv').config();

async function start() {

  /*

    Address Routes Actor

    When a customer pays payments must be routed to their ultimate destination,
    which can be either an address for the same coin as the initial payment, or
    it may be an address for a different coin.

    The business's preference for which coin(s) they would like to ultimately
    receive dictate how payments are routed through inter-coin. Preferences are
    expressed in two forms, account routes and basic addresses.

    Account Routes indicate the destination currency and address for all
    payments of a given coin.

  */


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

async function createAddressRoute(invoice) {

  var outputAddressValue, outputCurrency;

  let accountRoute = await models.AccountRoute.findOne({ where: {

    account_id: invoice.account_id,

    input_currency: invoice.currency

  }});

  if (accountRoute) {

    outputAddressValue = accountRoute.output_address;

    outputCurrency = accountRoute.output_currency;

  } else {

    let outputAddress = await models.Address.findOne({ where: {

      account_id: invoice.account_id,

      currency: invoice.currency

    }});

    if (outputAddress) {

      outputAddressValue = outputAddress.value;

      outputCurrency = outputAddress.currency;

    } else {

      throw new Error(`no address or route for invoice ${invoice.uid}`)
    }

  }

  let addressRoute = await models.AddressRoute.create({

    input_currency: invoice.currency, 

    input_address: invoice.address, 

    output_currency: outputCurrency,

    output_address: outputAddressValue

  });

  return addressRoute;

}

export {
	start
}

if (require.main === module) {

  start();

}

(async function() {

})();

