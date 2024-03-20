/* implements rabbi actor protocol */

require('dotenv').config();

import { Actor } from 'rabbi';
import { models } from '../../lib';

import { sendWebhook } from '../../lib/webhooks';
import { exchange } from '../../lib/amqp';
import prisma from '../../lib/prisma';



export default async function start() {

  Actor.create({

    exchange,

    routingkey: 'event.created',

    queue: 'send_webhook_for_all_events'

  })
  .start(async (channel, msg, json) => {

    console.log(json)

    const event = await models.Event.findOne({
      where: { id: json.id }
    })

    if (event.account_id) {

      if (event.type.match(/webhook/)) {

        return
      }

      const account = await models.Account.findOne({ where: { id: event.account_id } })

      if (account.webhook_url) {

        console.log('account.webhook_url', account.webhook_url)

        const webhook = await prisma.webhooks.create({
          data: {
            url: account.webhook_url,
            account_id: account.id,
            invoice_uid: event.invoice_uid,
            type: event.type,
            payload: event.payload,
            createdAt: new Date(),
            updatedAt: new Date()
          }
        })

        const result = await sendWebhook(webhook)

        console.log('webhook.send.result', result)

      }

    }

  });

}

if (require.main === module) {

  start();

}

