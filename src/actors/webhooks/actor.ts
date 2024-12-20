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

import { log } from '@/lib';

import { Actor } from 'rabbi'

import { sendWebhookForInvoice } from '@/lib/webhooks';

import { exchange } from '@/lib/amqp';

export async function start() {

  Actor.create({

    exchange,

    routingkey: 'invoice.paid',

    queue: 'webhooks.invoice.tosend'

  })
  .start(async (_channel, _msg, json) => {

    const { uid } = json

    try {

      await sendWebhookForInvoice(uid, 'actor_on_invoice_paid');
      
    } catch(error) {

      log.error('webhook.failed', error);

    }

  });


}

if (require.main === module) {

  start();

}

