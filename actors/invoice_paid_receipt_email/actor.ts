/* implements rabbi actor protocol */

require('dotenv').config();

import { Actor, Joi } from 'rabbi';

import {email, models} from '../../lib';

export async function start() {

  Actor.create({

    exchange: 'anypay.events',

    routingkey: 'invoice.payment',

    queue: 'invoice.email',

  })
  .start(async (channel, msg) => {

    let uid = msg.content.toString()

    let invoice = await models.Invoice.findOne({
 
      where: { uid: uid }

    })

    await email.invoicePaidEmail(invoice.toJSON())

    channel.ack(msg);

  });


}

if (require.main === module) {

  start();

}
