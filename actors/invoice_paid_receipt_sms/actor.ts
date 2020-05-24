/* implements rabbi actor protocol */

require('dotenv').config();

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;

console.log(accountSid, authToken);

const client = require('twilio')('AC5fe88dd6a6ba7ea7e0f280831ae8bdfc', 'ce0b4b545c27f657917e540ffc084d47');
//const client = require('twilio')(accountSid, authToken);

console.log(client);

import { Actor, Joi } from 'rabbi';

import {email, models} from '../../lib';

export async function start() {

  Actor.create({

    exchange: 'anypay:invoices',

    routingkey: 'invoice:paid',

    queue: 'send_invoice_paid_sms_receipt',

  })
  .start(async (channel, msg) => {

    console.log('send paid receipt');

    let uid = msg.content.toString();

    let invoice = await models.Invoice.findOne({
 
      where: { uid: uid }

    });

    if (!invoice) {
      return channel.ack(msg);
    }

    console.log(invoice.toJSON());

    let smsPhoneNumbers = await models.AccountPhoneSms.findAll({
 
      where: { account_id: invoice.account_id }

    });

    console.log('numbers', smsPhoneNumbers.map(n => n.toJSON()));

    smsPhoneNumbers.forEach(async (record) => {
      try {

        if (invoice.denomination_currency === 'USD') {

          await sendSMSReceipt(record.phone_number, `${invoice.currency} payment received for $${invoice.denomination_amount_paid.toFixed(2)} \n\nhttps://anypayapp.com/invoices/${invoice.uid}`);

        } else {

          await sendSMSReceipt(record.phone_number, `${invoice.currency} payment received for ${invoice.denomination_amount_paid.toFixed(2)} ${invoice.denomination_currency}\n\nhttps://anypayapp.com/invoices/${invoice.uid}`);

        }


      } catch(error) {

        console.log(error);

      }

    })

    channel.ack(msg);

  });


}

async function sendSMSReceipt(to, body) {

  let from = '+18026130753';

  console.log('send sms receipt', { to, body, from });

  let message = await client.messages.create({
    from,
    to,
    body,
  });

  return message;

}

if (require.main === module) {

  start();

}
