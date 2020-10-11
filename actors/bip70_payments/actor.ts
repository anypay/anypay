/* implements rabbi actor protocol */

require('dotenv').config();

import { Actor, Joi, log } from 'rabbi';

import { models } from '../../lib'

export async function start() {

  Actor.create({

    exchange: 'anypay',

    routingkey: 'bip70.payments.dash',

    queue: 'dash_log_bip70_payments',

    schema: Joi.object() // optional, enforces validity of json schema

  })
  .start(async (channel, msg, json) => {


    let hex = msg.content.toString('hex')

    log.info(hex)

    log.info('bip70.payment.hex', hex);

    try {

      let [model, isNew] = await models.ProtobufPayment.findOrCreate({

        where: { hex },

        defaults: { hex }

      })

      if (!model) {

        await channel.sendToQueue('dash_log_bip70_payments', msg.content)

      }

      if (isNew) {

        log.info('bip70.payment.recorded', model.toJSON())

      }

    } catch(error) {

        await channel.sendToQueue('dash_log_bip70_payments', msg.content)

    }

    channel.ack(msg);

  });

}

if (require.main === module) {

  start();

}

