import {awaitChannel} from '../../../lib/amqp';
import * as Hapi from 'hapi';

import { rpc } from '../../../plugins/dash/lib/jsonrpc'

import * as Boom from 'boom';

import * as PaymentProtocol from '../../../vendor/bitcore-payment-protocol';

import { transformHexToPayments } from '../../../router/plugins/dash/lib';

const bitcoin = require('bsv'); 
const Message = require('bsv/message'); 

function isCorrectContentType(req: Hapi.Request) {
  return req.headers['x-content-type'] === 'application/dash-payment'
}

function isCorrectAccept(req: Hapi.Request) {
  return req.headers['x-accept'] === 'application/dash-paymentack'
}

export async function submitJsonV2(req, h) {

  try {

    let channel = await awaitChannel();

    for (const transaction of req.payload.transactions) {
      console.log('jsonv2.dash.publishtransaction', transaction);

      let resp = await rpc.call('sendrawtransaction', [transaction]);

      console.log('dash.publishtransaction.response', resp);

      let payments = transformHexToPayments(transaction)

      for (let payment of payments) {

        console.log('payment', Object.assign(payment, {invoice_uid: req.params.uid })) 

        channel.publish('anypay.payments', 'payment', Buffer.from(

          JSON.stringify(Object.assign(payment, {invoice_uid: req.params.uid })) 

        ))

      }

    }

    return {

      success: true,

      transactions: req.payload.transactions

    }

  } catch(error) {

    console.log(error);

    return Boom.badRequest(error);

  }

}

export async function create(req, h) {

  console.log('REQUEST');
  console.log(req);

  console.log('HEADERS');
  console.log(req.headers);

  console.log('PAYLOAD');
  console.log(req.payload);

  if (isCorrectContentType(req) || isCorrectAccept(req)) {

    let channel = await awaitChannel();

    await channel.publish('anypay', 'dash.bip70.payments', req.payload);

    console.log('content-type or accept is correct for posting DASH BIP70 Payments');

    let payment = PaymentProtocol.Payment.decode(req.payload);

    console.log('Payment', payment);

    for (const transaction of payment.transactions) {

      let hex = transaction.toString('hex')

      console.log('hex', hex);

      let resp = await rpc.call('sendrawtransaction', [hex]);

      console.log(resp);

      let payments = transformHexToPayments(hex);

      for (let payment of payments) {

        let anypayPayment = Object.assign(payment, {
          invoice_uid: req.params.uid
        })

        console.log('anypay.payment.publish', anypayPayment)

        await channel.publish('anypay.payments', 'payment', Buffer.from(
          JSON.stringify(anypayPayment)
        ))

      }

    }

    let ack = new PaymentProtocol.PaymentACK();

    ack.set('payment', payment);

    let response = h.response(ack.toBuffer());

    response.type('application/dash-paymentack');

    return response;

  } else {

    return { success: false }
  }

}

