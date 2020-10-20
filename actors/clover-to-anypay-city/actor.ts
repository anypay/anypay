/* implements rabbi actor protocol */

require('dotenv').config();

import { Actor, Joi, log } from 'rabbi';

import * as clover from '../../lib/clover'

import { models, invoices } from '../../lib'

export async function start() {

  Actor.create({

    exchange: 'anypay.events',

    routingkey: 'models.CloverWebhook.afterCreate',

    queue: 'publish_clover_order_to_anypay_city',

    schema: Joi.object() // optional, enforces validity of json schema

  })
  .start(async (channel, msg, json) => {
    console.log('clover.webhook', json)
    console.log(json.payload.merchants)

    let merchants = Object.entries(json.payload.merchants).map(pair => {
      return {
        id: pair[0],
        events: pair[1]
      }
    })

    for (let merchant of merchants) {

      let cloverAuth = await models.CloverAuth.findOne({
        where: { merchant_id: merchant.id },
        order: [['createdAt', 'desc']]
      })

      console.log('clover auth found', cloverAuth.toJSON())

      for (let event of merchant.events) {

        let orderid = event.objectId.split(':')[1] 
        let merchantid = merchant.id

        let e = Object.assign(event, {
          orderid  
        })

        console.log('event', e)

        var isNewOrder = false

        if (event.objectId.match(/^O:/)) {

          isNewOrder = true

          let account_id = cloverAuth.account_id

          console.log('clover.order.created', Object.assign(e, {
            account_id
          }))


          // create invoice

        }

        try {
          // 1) Lookup Clover Order From Clover Order ID

          let resp = await clover.getOrder({
            orderid,
            merchantid,
            accesstoken: cloverAuth.access_token
          })

          let [orderRecord, isNew] = await models.CloverOrder.findOrCreate({
            where: {
              order_id: orderid
            },
            defaults: {
              order_id: orderid,
              content: resp,
              account_id: cloverAuth.account_id
            }
          })

          if (isNew) {

            let invoice = await invoices.create({
              account_id: cloverAuth.account_id,
              amount: orderRecord.content.amount / 100.00,
              external_id: `clover:${event.objectId}`
            })

            console.log('clover.order.invoice.created', invoice.toJSON())

          }

          if (!isNew) {

            orderRecord.content = resp

            await orderRecord.save()

          }

          console.log('order', orderRecord.toJSON());

        } catch(error) {

          console.log('error', error)

        }

      }

    }

    /*

      2) Find Or Create Invoice With Clover Order ID as External ID

      3) Update Existing Invoice With New Clover Order Details

      4) Publish Invoice to Anypay City As Current Order

    */

    log.info(msg.content.toString());

    log.info(json);

    channel.ack(msg);

  });

}

if (require.main === module) {

  start();

}

