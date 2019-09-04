/* implements rabbi actor protocol */

require('dotenv').config();

import { Actor, log, Joi } from 'rabbi';

import { models, prices, events } from '../../lib';

export async function start() {

  Actor.create({

    exchange: 'anypay.payments',

    routingkey: 'payment',

    queue: 'static-address-payment-to-invoice'/*,

    schema: Joi.object().keys({

      address: Joi.string().required(),

      currency: Joi.string().required(),

      hash: Joi.string().required(),

      amount: Joi.number()

    })
    */

  })
  .start(async (channel, msg, json) => {
    try {

      console.log('json', {
        input_address: json.address,
        input_currency: json.currency
      });

      let addressRoute = await models.AddressRoute.findOne({ where: {

        is_static: true,

        input_address: json.address,

        input_currency: json.currency,

      }});

      if (!addressRoute) {

        return channel.ack(msg);

      }

      let account = await models.Account.findOne({ where: { id: addressRoute.account_id }});

      if (!addressRoute) {

        throw new Error(`account not found ${addressRoute.account_id}`)

      }

      log.info('static address found', addressRoute.toJSON());

      let invoice = await models.Invoice.findOne({ where: {

        hash: json.hash

      }});

      if (invoice) {

        log.info('invoice already recorded', invoice.toJSON());

        return channel.ack(msg);;

      }

      let conversion = await prices.convert({
        currency: json.currency,
        value: json.amount
      }, account.denomination);

      invoice = await models.Invoice.create({
        address: json.address,
        invoice_amount: json.amount,
        invoice_amount_paid: json.amount,
        invoice_currency: json.currency,
        denomination_currency: account.denomination,
        denomination_amount: conversion.value,
        denomination_amount_paid: conversion.value,
        complete: true,
        completed_at: new Date(),
        paidAt: new Date(),
        hash: json.hash,
        status: 'paid',
        account_id: account.id
      });

      events.emitter.emit('invoice.paid', invoice.toJSON()); 
      events.emitter.emit('invoice.payment', invoice.toJSON()); 

      await channel.ack(msg);
    } catch(error) {

      console.error(error.message);
      await channel.ack(msg);
    }

  });


}

if (require.main === module) {

  start();

}

