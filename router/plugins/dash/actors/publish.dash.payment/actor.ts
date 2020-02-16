/* implements rabbi actor protocol */

require('dotenv').config();

import {transformHexToPayments} from '../../lib'; 
import { Actor, Joi } from 'rabbi';

export async function start() {

  Actor.create({

    exchange: 'anypay.router',

    routingkey: 'transaction.dash',

    queue: 'publish.dash.payment',
    
    schema: Joi.object().keys({
      
      hex: Joi.string().required()

    })

  })
  .start(async (channel, msg, json) => {

    let payments = transformHexToPayments(json.hex)

    payments.forEach((payment)=>{

      console.log(payment)

      channel.publish('anypay.payments', 'payment', Buffer.from(JSON.stringify(payment)))
      channel.publish('anypay.payments', 'payment.dash', Buffer.from(JSON.stringify(payment)))
      channel.publish('anypay.payments', `payment.dash.${payment.address}`, Buffer.from(JSON.stringify(payment)))

    })

    channel.ack(msg);

  });

}

if (require.main === module) {

  start();

}

