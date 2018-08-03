#!/usr/bin/env ts-node

require('dotenv').config();

import {sendPayment} from '../lib/dashcore';

var AWS = require('aws-sdk');
AWS.config.update({region: 'us-east-1'});

import * as amqp from 'amqplib';

const queue = 'payroll.pending';

(async function() {

  let conn = await amqp.connect(process.env.AMQP_URL);
  let channel = await conn.createChannel();

  channel.consume(queue, async (message) => {

    try {

      let content = JSON.parse(message.content.toString());

      console.log("send payroll!", content);

      let pendingPayroll = payrollAccountToPendingPayroll(content);

      console.log('pendingPayroll', pendingPayroll);

      let hash = await sendPayment(pendingPayroll.address, pendingPayroll.amount); 

      console.log('payment hash', hash);

      await sendEmail({
        address: pendingPayroll.address,
        email: pendingPayroll.email,
        hash: hash,
        amount: pendingPayroll.amount,
        date: new Date()
      });

      channel.ack(message);

    } catch(error) {

      console.error(error.message);

      channel.nack(message);

    }

  });

})();

interface PayrollPayment {
  email: string;
  date: Date;
  hash: string;
  amount: number;
  address: string;
} 

async function sendEmail(payment: PayrollPayment) {

  let email = new AWS.SES().sendEmail({
    Destination: {
      ToAddresses: [payment.email, 'steven@anypay.global']
    },
    Message: {
      Body: {
        Text: {
          Charset: 'UTF-8',
          Data: `Payroll for ${payment.date} sent ${payment.amount} DASH to ${payment.address}\n\n https://live.blockcypher.com/dash/tx/${payment.hash}`
        }
      },
      Subject: {
        Charset: 'UTF-8',
        Data: `Anypay Payroll for ${payment.date}`
      }
    },
    Source: 'payroll@anypay.global',
    ReplyToAddresses: ['steven@anypay.global']
  });

  let sent = await email.promise();

  console.log('sent', sent);
}

async function sendPaymentAndEmail() {

}

interface PendingPayroll {
  address: string;
  amount: number;
  email: string;
}

function payrollAccountToPendingPayroll(payrollAccount): PendingPayroll {

  return {
    address: payrollAccount.dash_payout_address,
    amount: payrollAccount.base_daily_amount.toFixed(5),
    email: payrollAccount.email
  }
}

