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

import {email} from '../../lib';
import { exchange } from '../../lib/amqp';
import prisma from '../../lib/prisma';

export async function start() {

  Actor.create({

    exchange,

    routingkey: 'invoice.paid',

    queue: 'send_invoice_paid_email_receipt',

  })
  .start(async (channel, msg, json) => {

    const { uid } = json

    const invoice = await prisma.invoices.findFirstOrThrow({
      where: { uid }
    });

    await email.invoicePaidEmail(invoice);

  });

  Actor.create({

    exchange: 'anypay:invoices',

    routingkey: 'invoice:paid',

    queue: 'send_first_invoice_paid_email',

  })
  .start(async (channel, msg) => {

    let uid = msg.content.toString();

    const invoice = await prisma.invoices.findFirstOrThrow({
      where: { uid }
    });


    const invoices = await prisma.invoices.findMany({
      where: {
        account_id: invoice.account_id,
        status: 'paid'
      }
    });

    if (invoices.length === 1) {

      await email.firstInvoicePaidEmail(invoice);

    }

  });

}

if (require.main === module) {

  start();

}
