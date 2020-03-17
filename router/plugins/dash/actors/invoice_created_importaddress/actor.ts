/* implements rabbi actor protocol */

require('dotenv').config();

import { Actor, Joi, log } from 'rabbi';

import { rpcCall } from '../../lib/jsonrpc';

export async function start() {

  Actor.create({

    exchange: 'anypay.events',

    routingkey: 'models.Invoice.afterCreate',

    queue: 'dash_invoice_created_importaddress',

    schema: Joi.object().keys({
      address: Joi.string(),
      uid: Joi.string(),
      currency: Joi.string()
    })

  })
  .start(async (channel, msg, json) => {
    console.log(json);

    if (json.currency !== 'DASH') {

      return channel.ack(msg);

    }

    log.info(msg.content.toString());
    log.info(json);

    let resp = await rpcCall('importaddress', [json.address, json.uid, false]); 

    console.log(resp);

    await channel.ack(msg);

  });

}

if (require.main === module) {

  start();

}

