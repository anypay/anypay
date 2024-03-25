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

import { Actor, log, getChannel } from 'rabbi';

import { exchange, publish } from '../../lib/amqp';
import prisma from '../../lib/prisma';

export async function start() {

  let channel = await getChannel();

  await channel.assertExchange('account_events', 'topic');

  Actor.create({

    exchange,

    routingkey: 'invoice.paid',

    queue: 'republish_invoice_paid_as_account_id_dev'

  })
  .start(async (channel, msg, json) => {

    const { uid } = json

    const invoice = await prisma.invoices.findFirstOrThrow({
      where: { uid }
    });
 
    let routingKey1 = `accounts.${invoice.account_id}.invoicepaid`;
    
    let routingKey2 = `accounts.${invoice.account_id}.invoice.paid`;

    await channel.publish(routingKey1, msg.content);

    publish(routingKey2, invoice)

  });

  Actor.create({

    exchange,

    routingkey: 'models.Invoice.afterCreate',

    queue: 'republish_invoice_created_as_account_id'

  })
  .start(async (channel, msg, json) => {

    let routingKey = `accounts.${json.account_id}.invoicecreated`;

    await channel.publish(exchange, routingKey, msg.content);

    log.info(routingKey, { invoice: json });

  });

  Actor.create({

    exchange,

    routingkey: 'models.Invoice.afterUpdate',

    queue: 'republish_invoice_updated_as_account_id'

  })
  .start(async (channel, msg, json) => {

    let routingKey = `accounts.${json.account_id}.invoiceupdated`;

    await channel.publish(exchange, routingKey, msg.content);

    log.info(routingKey, { invoice: json });

  });

}

if (require.main === module) {

  start();

}

