/* implements rabbi actor protocol */

require('dotenv').config();

import { Actor, Joi } from 'rabbi';

import {models} from '../../lib';

export async function start() {

  Actor.create({

    exchange: 'anypay.router',

    routingkey: 'router.transaction.forwarded',

    queue: 'router.write.output',

    schema: Joi.object({

      input_address: Joi.string(),

      output_hash: Joi.string(),

      output_address: Joi.string(),

      output_currency: Joi.string(),

      output_amount: Joi.string(),
      
      output_currency: Joi.string()

      output_currency: Joi.string()

    })

  })
  .start(async (channel, msg, json) => {

    console.log(json)

    let invoice = await models.Invoice.findOne({
 
      where: { address: json.input_address }

    })

    invoice.output_hash = json.output_hash;

    invoice.output_currency = json.output_currency;

    invoice.output_address = json.output_address;

    invoice.output_amount = json.output_amount;

    await invoice.save()

    console.log(invoice)

    channel.ack(msg);

  });


}

if (require.main === module) {

  start();

}
