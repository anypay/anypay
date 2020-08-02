import {awaitChannel} from '../../../lib/amqp';
import * as Hapi from 'hapi';

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

export async function create(req, h) {

  console.log('REQUEST');
  console.log(req);

  console.log('HEADERS');
  console.log(req.headers);

  console.log('PAYLOAD');
  console.log(req.payload);

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

