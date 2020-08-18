/* implements rabbi actor protocol */

require('dotenv').config();

import { Actor, Joi } from 'rabbi';

import { rpc } from '../../plugins/dash/lib/jsonrpc';
import { models } from '../../lib';

import * as http from 'superagent';

export async function start() {

  Actor.create({

    exchange: 'anypay.payments',

    routingkey: 'addresses.watch',

    queue: 'dashtext.addresses.watch',

    schema: Joi.object({

      address: Joi.string().required(),

      account_email: Joi.string().email().required()

    })

  })
  .start(async (channel, msg, json) => {

    var queue;


    console.log(json);

    if (json.account_email === 'lorenzo@dashtext.io') {

      queue = 'dashtext.payments.notify';

    }

    if (json.account_email === 'steven@anypayinc.com') {

      queue = 'stevenzeiler.payments.notify';

    }

    try { 

      let resp = await rpc.call('importaddress', [
        json.address,
        json.account_email,
        false
      ]);

      console.log('dash.rpc.response', resp);

    } catch(error) {

      console.error('dash.rpc.response.error', error);

      channel.ack(msg);

      return;

    }

    if (queue){ 

      await channel.bindQueue(queue, 'anypay.payments', `payment.dash.${json.address}`);

    }

    await channel.ack(msg);

  });

  Actor.create({

    exchange: 'anypay.payments',

    routingkey: 'addresses.watch.accounts.dashtext',

    queue: 'dashtext.payments.notify'

  })
  .start(async (channel, msg, json) => {

    console.log('dashtext notify via http', json);

    let account = await models.Account.findOne({ where: {

      email: 'lorenzo@dashtext.io'

    }});


    if (!account || !account.watch_address_webhook_url) {
      return channel.ack(msg);
    }

    try {

      let resp = await http
        .post(account.watch_address_webhook_url)
        .send(json);

      console.log('webhook sent to dashtext');

      await channel.ack(msg);

    } catch(error) {

      await wait(2000);

      await channel.nack(msg);

    }

  });

  Actor.create({

    exchange: 'anypay.payments',

    routingkey: 'addresses.watch.accounts.stevenzeiler',

    queue: 'stevenzeiler.payments.notify'

  })
  .start(async (channel, msg, json) => {

    console.log('notify stevnezeiler via http', json);

    let account = await models.Account.findOne({ where: {

      email: 'steven@anypayinc.com'

    }});


    if (!account || !account.watch_address_webhook_url) {
      return channel.ack(msg);
    }

    try {

      let resp = await http
        .post(account.watch_address_webhook_url)
        .send(json);

      console.log('webhook sent to stevenzeiler');

      await channel.ack(msg);

    } catch(error) {

      console.error(error.message);

      await wait(2000);

      await channel.nack(msg);

    }

  });

}

if (require.main === module) {

  start();

}

async function wait(ms) {
  return new Promise(resolve => {

    setTimeout(resolve, ms);

  });
}
