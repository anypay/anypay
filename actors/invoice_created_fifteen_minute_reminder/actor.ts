/* implements rabbi actor protocol */

require('dotenv').config();

import { Actor, Joi, email } from 'rabbi';

import { models, log } from '../../lib'

export async function start() {

  Actor.create({

    exchange: 'anypay.events',

    routingkey: 'models.Invoice.afterCreate',

    queue: 'invoice_created_fifteen_minute_reminder',

  })
  .start(async (channel, msg, invoice) => {
    log.info('perhaps send reminder email in fifteen minutes')

    let invoices = await models.Invoice.findAll({
      where: {
        account_id: invoice.account_id,
        status: 'paid'
      }
    })

    if (invoices.length === 0) {
      log.info('send reminder email in fifteen minutes')

      await channel.publish('delayed', 'invoice_created_fifteen_minute_reminder', msg.content, {
        headers: {
          'x-delay': 1000 * 60 * 15
        }
      })

    }

    channel.ack(msg);

  });

  Actor.create({

    exchange: 'delayed',

    exchangeType: 'x-delayed-message',

    routingkey: 'invoice_created_fifteen_minute_reminder',

    queue: 'reminder_for_unpaid'


  })
  .start(async (channel, msg, invoice) => {

    log.info('fifteen minutes is up! send reminder email if still unpaid')

    let invoices = await models.Invoice.findAll({
      where: {
        account_id: invoice.account_id,
        status: 'paid'
      }
    })

    let account = await models.Account.findOne({ where: { id: invoice.account_id }})

    if (invoices.length === 0) {

      await email.sendEmail('reminder_unpaid_invoice', account.email, 'Anypay<support@anypayx.com>', invoice)

    }

    channel.ack(msg);

  });

}

if (require.main === module) {

  start();

}

