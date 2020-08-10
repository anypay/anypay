import {generatePaymentRequest} from '../../../plugins/bch/lib/paymentRequest';
import {awaitChannel} from '../../../lib/amqp';
import * as Hapi from 'hapi';

let BITBOX = require('bitbox-sdk').BITBOX;

import { transformHexToPayments } from '../../../router/plugins/bch/lib';

const bitbox = new BITBOX();

import { badRequest } from 'boom';

import { rpc } from '../../../plugins/bch/lib/jsonrpc'

import * as PaymentProtocol from '../../../vendor/bitcore-payment-protocol';

const bitcoin = require('bsv'); 
const Message = require('bsv/message'); 

function isCorrectContentType(req: Hapi.Request) {
  return req.headers['content-type'] === 'application/bitcoincash-payment'
}

function isCorrectAccept(req: Hapi.Request) {
  return req.headers['accept'] === 'application/bitcoincash-paymentack'
}

export async function createEdge(req, h) {
  console.log(req);

  try {

    let channel = await awaitChannel();

    for (let hex in req.payload.transactions) { 

      console.log('jsonv2.bch.submittransaction', hex)

      let resp = await bitbox.RawTransactions.sendRawTransaction(hex);

      console.log('jsonv2.bch.submittransaction.response', resp)

      let payments = transformHexToPayments(hex);

      console.log('jsonv2.bch.payments', payments);

      for (let payment of payments) {

        console.log('payment', Object.assign(payment, {invoice_uid: req.params.uid })) 

        channel.publish('anypay.payments', 'payment', Buffer.from(

          JSON.stringify(Object.assign(payment, {invoice_uid: req.params.uid })) 

        ))

        channel.publish('anypay.payments', 'payment', Buffer.from(

          JSON.stringify(Object.assign(payment, {
            invoice_uid: req.params.uid,
            address: payment.address.split(':')[1]
          })) 

        ))

      }

    }

  } catch(error) {

    console.log(error);

    return badRequest(error);

  }

  return {
    success: true,
    transactions: req.payload.transactions
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

    await channel.publish('anypay', 'bch.bip70.payments', req.payload);

    console.log('content-type or accept is correct for posting BCH BIP70 Payments');

    let payment = PaymentProtocol.Payment.decode(req.payload);

    console.log('Payment', payment);

    for (const transaction of payment.transactions) {

      console.log(transaction.toString('hex'));

      let hex = transaction.toString('hex');

      try {

        let resp = await bitbox.RawTransactions.sendRawTransaction(hex);

        console.log(resp);

        let payments = transformHexToPayments(hex);

        console.log('payments', payments);

        payments.forEach(payment => {

          console.log('payment', Object.assign(payment, {invoice_uid: req.params.uid })) 

          channel.publish('anypay.payments', 'payment', Buffer.from(

            JSON.stringify(Object.assign(payment, {invoice_uid: req.params.uid })) 

          ))

          channel.publish('anypay.payments', 'payment', Buffer.from(

            JSON.stringify(Object.assign(payment, {
              invoice_uid: req.params.uid,
              address: payment.address.split(':')[1]
            })) 

          ))

        });

      } catch(error) {

        console.log('bch.sendrawtransaction.error', error);

        return badRequest(error);

      }

    }

    let ack = new PaymentProtocol.PaymentACK();

    ack.set('payment', payment);

    let response = h.response(ack.toBuffer());

    response.type('application/bitcoincash-paymentack');

    return response;

  } else {

    return { success: false }
  }

}

