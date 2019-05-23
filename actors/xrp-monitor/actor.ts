import { log, models } from '../../lib';

import { awaitChannel } from '../../lib/amqp';

import { connect } from 'amqplib';

import { WebsocketSubscriptionManager } from '../../plugins/xrp/bin/xrp';

import { validateAddress } from '../../plugins/xrp';

require('dotenv').config();

async function start() {

  let channel = await awaitChannel();

  let subscriptionManager = new WebsocketSubscriptionManager();

  let addresses = await models.Address.findAll({ where: { currency: "XRP" }});

  addresses.forEach(address => {

    if (validateAddress(address.value)) {

      subscriptionManager.addAccount(address.value);

    }

  });

  subscriptionManager.onPayment = async (payment) => {

    await channel.publish('anypay.payments', 'payment', new Buffer(JSON.stringify(payment)));

  }

  subscriptionManager.start();

}

export {
	start
}

if (require.main === module) {

  start();

}
