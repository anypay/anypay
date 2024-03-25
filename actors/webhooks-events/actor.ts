/*
    This file is part of anypay: https://github.com/anypay/anypay
    Copyright (c) 2017 Anypay Inc, Steven Zeiler

    Permission to use, copy, modify, and/or distribute this software for any
    purpose  with  or without fee is hereby granted, provided that the above
    copyright notice and this permission notice appear in all copies.

    THE  SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES
    WITH  REGARD  TO  THIS  SOFTWARE  INCLUDING  ALL  IMPLIED  WARRANTIES  OF
    MERCHANTABILITY  AND  FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR
    ANY  SPECIAL ,  DIRECT, INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES
    WHATSOEVER  RESULTING  FROM  LOSS  OF USE, DATA OR PROFITS, WHETHER IN AN
    ACTION  OF  CONTRACT, NEGLIGENCE OR OTHER TORTIOUS ACTION, ARISING OUT OF
    OR IN CONNECTION WITH THE USE OR PERFORMANCE OF THIS SOFTWARE.
*/
//==============================================================================

/* implements rabbi actor protocol */

require('dotenv').config();

import { Actor } from 'rabbi';

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

    const event = await prisma.events.findFirstOrThrow({
      where: { id: json.id }
    })

    if (event.account_id) {

      if (event.type.match(/webhook/)) {

        return
      }

      const account = await prisma.accounts.findFirstOrThrow({
        where: { id: event.account_id }      
      })

      if (account.webhook_url) {

        console.log('account.webhook_url', account.webhook_url)

        const webhook = await prisma.webhooks.create({
          data: {
            url: account.webhook_url,
            account_id: account.id,
            invoice_uid: event.invoice_uid,
            type: event.type,
            payload: event.payload as any,
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

