/* implements rabbi actor protocol */

require('dotenv').config();

import { Actor } from 'rabbi';
import { models } from '../../lib';

import { Webhook, sendWebhook } from '../../lib/webhooks';
import { create } from '../../lib/orm';
import { exchange } from '../../lib/amqp';

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

        const webhook = await create<Webhook>(Webhook, {
          url: account.webhook_url,
          account_id: account.id,
          invoice_uid: event.invoice_uid,
          type: event.type,
          payload: event.payload,
          namespace: 'events',
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

