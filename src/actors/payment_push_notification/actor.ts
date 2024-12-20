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

import { Actor, log } from 'rabbi';

import { sendMessage } from '@/lib/push_notifications';
import { exchange } from '@/lib/amqp';
import prisma from '@/lib/prisma';

export async function start() {

  Actor.create({

    exchange,

    routingkey: 'invoice:paid',

    queue: 'payment_push_notification'

  })
  .start(async (_, msg, json) => {

    log.info(msg.content.toString());

    const { uid } = json

    const invoice = await prisma.invoices.findFirstOrThrow({
      where: { uid }
    });

    const account = await prisma.accounts.findFirstOrThrow({
      where: { id: Number(invoice.account_id) }
    });

    try {

      await sendMessage(String(account.email), `Payment Received ${invoice.denomination_amount_paid} ${invoice.denomination_currency}`, String(invoice.currency), {
        path: `/payments/${uid}`,
      });

      return

    } catch(error) {

      log.error('actors.payment_push_notification', error);

    }

  });

}

if (require.main === module) {

  start();

}
