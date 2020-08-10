import {awaitChannel} from '../../../lib/amqp';
import * as Hapi from 'hapi';

import * as Boom from 'boom';

import { rpc } from '../../../plugins/btc/jsonrpc'
import { publishBTC } from '../../../lib/blockcypher'

import * as PaymentProtocol from '../../../vendor/bitcore-payment-protocol';

import { transformHexToPayments } from '../../../router/plugins/btc/lib';

const bitcoin = require('bsv'); 
const Message = require('bsv/message'); 

function isCorrectContentType(req: Hapi.Request) {
  return req.headers['content-type'] === 'application/bitcoin-payment'
}

function isCorrectAccept(req: Hapi.Request) {
  return req.headers['accept'] === 'application/bitcoin-paymentack'
}

export async function submitJsonV2(req, h) {

  try {

    let channel = await awaitChannel();

    for (const transaction of req.payload.transactions) {

      console.log('jsonv2.btc.publishtransaction', transaction);

      let resp = await publishBTC(transaction);

      console.log('btc.publishtransaction.response', resp);

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

  if (isCorrectContentType(req) || isCorrectAccept(req)) {

    let channel = await awaitChannel();

    await channel.publish('anypay', 'btc.bip70.payments', req.payload);

    console.log('content-type or accept is correct for posting BTC BIP70 Payments');

    let payment = PaymentProtocol.Payment.decode(req.payload);

    console.log('Payment', payment);

    for (const transaction of payment.transactions) {

      console.log(transaction.toString('hex'));

      //let resp = await rpc.call('sendrawtransaction', [transaction.toString('hex')]);
      let resp = await publishBTC(transaction.toString('hex'));

      console.log(resp);

      let payments = transformHexToPayments(transaction.toString('hex'))

      payments.forEach(payment => {

        console.log('payment', Object.assign(payment, {invoice_uid: req.params.uid })) 

        channel.publish('anypay.payments', 'payment', Buffer.from(

          JSON.stringify(Object.assign(payment, {invoice_uid: req.params.uid })) 

        ))

      });

    }

    let ack = new PaymentProtocol.PaymentACK();

    ack.set('payment', payment);

    let response = h.response(ack.toBuffer());

    response.type('application/bitcoin-paymentack');

    return response;

  } else {

    return { success: false }
  }

}

