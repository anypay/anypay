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

require('dotenv').config();

import { log } from '../../lib/log'

import { Actor } from 'rabbi'

import { getPaidWebhookForInvoice, createWebhookForInvoice } from '../../lib/webhooks';

import { ensureInvoice, Invoice } from '../../lib/invoices'

import { exchange } from '../../lib/amqp';

export async function start() {

  Actor.create({

    exchange,

    routingkey: 'invoice.paid',

    queue: 'webhooks.invoice.tosendpaid'

  })
  .start(async (channel, msg, json) => {

    try {

      let {uid} = json

      log.info('webhook.sendforinvoice', { uid });

      let invoice: Invoice = await ensureInvoice(uid)

      log.info('webhook.invoice', { invoice });

      let account: Account = await invoice.getAccount()

      log.info('webhook.account', { account });

      let webhook = await getPaidWebhookForInvoice(invoice)

      log.info('webhook', webhook)

      if (!webhook) {

        await createWebhookForInvoice(invoice)

      }

      let attempt = await webhook.attemptWebhook()

      log.info('webhook.attempt', attempt.record.toJSON());

    } catch(error) {

      log.error('webhook.failed', error);

    }

  });


}

if (require.main === module) {

  start();

}

