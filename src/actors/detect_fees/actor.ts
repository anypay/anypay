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

import { ensureInvoice } from '@/lib/invoices'

import { getPayment } from '@/lib/payments'

import { getMiningFee } from '@/lib/fees'

import { exchange } from '@/lib/amqp';

import prisma from '@/lib/prisma';

export async function start(): Promise<Actor> {

  const actor = Actor.create({

    exchange,

    routingkey: 'invoice:paid',

    queue: 'cache_fees_after_payment'

  })

  actor.start(async (_, msg, json) => {

    let uid = msg.content.toString();

    let invoice = await ensureInvoice(uid)

    let payment = await getPayment(invoice)

    if (!payment) { return }

    log.info(invoice);

    let fee = await getMiningFee(payment.currency, String(payment.txhex))

    await prisma.payments.update({
      where: {
        id: payment.id
      },
      data: {
        total_input: fee.total_input,
        total_output: fee.total_output,
        network_fee: fee.network_fee
      }
    })

  });

  return actor

}

if (require.main === module) {

  start();

}

