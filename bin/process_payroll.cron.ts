#!/usr/bin/env ts-node

require('dotenv').config();

import {sendPayment} from '../lib/dashcore';
import {convert} from '../lib/prices';

var AWS = require('aws-sdk');
AWS.config.update({region: 'us-east-1'});

import * as amqp from 'amqplib';

const queue = 'payroll.pending';

(async function() {

  let conn = await amqp.connect(process.env.AMQP_URL);
  let channel = await conn.createChannel();

  await channel.assertQueue('payroll.pending');
  await channel.bindQueue('payroll.pending', 'anypay.payroll', 'daily');

  channel.consume(queue, async (message) => {

    try {

      let content = JSON.parse(message.content.toString());

      console.log("send payroll!", content);

      let pendingPayroll = await payrollAccountToPendingPayroll(content);

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
      ToAddresses: [payment.email, 'steven@anypayinc.com']
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
    Source: 'payroll@anypayinc.com',
    ReplyToAddresses: ['steven@anypayinc.com']
  });

  let sent = await email.promise();

  console.log('sent', sent);
}

async function sendPaymentAndEmail() {

}

interface PendingPayroll {
  address: string;
  currency: string;
  amount: number;
  email: string;
}

async function payrollAccountToPendingPayroll(payrollAccount): Promise<PendingPayroll> {

  let conversion = await convert({
    currency: payrollAccount.base_currency,
    value: payrollAccount.base_daily_amount
  }, 'DASH');

  console.log('conversion', conversion);

  return {
    address: payrollAccount.dash_payout_address,
    currency: conversion.currency,
    amount: parseFloat(conversion.value.toFixed(5)),
    email: payrollAccount.email
  }
}

