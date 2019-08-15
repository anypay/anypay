/* implements rabbi actor protocol */

require('dotenv').config();

import { Actor, Joi } from 'rabbi';

import { rpc } from '../../plugins/dash/lib/jsonrpc';

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

    if (json.account_email === 'steven@anypay.global') {

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

    await channel.ack(msg);

  });

  Actor.create({

    exchange: 'anypay.payments',

    routingkey: 'addresses.watch.accounts.stevenzeiler',

    queue: 'stevenzeiler.payments.notify'

  })
  .start(async (channel, msg, json) => {

    console.log('dashtext notify via http', json);

    await channel.ack(msg);

  });

}

if (require.main === module) {

  start();

}

