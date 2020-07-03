import {generatePaymentRequest} from '../../../plugins/dash/lib/paymentRequest';
import {awaitChannel} from '../../../lib/amqp';
import * as Hapi from 'hapi';

import { rpc } from '../../../plugins/dash/lib/jsonrpc'

import * as PaymentProtocol from '../../../vendor/bitcore-payment-protocol';

const bitcoin = require('bsv'); 
const Message = require('bsv/message'); 

function isCorrectContentType(req: Hapi.Request) {
  return req.headers['x-content-type'] === 'application/dash-payment'
}

function isCorrectAccept(req: Hapi.Request) {
  return req.headers['x-accept'] === 'application/dash-paymentack'
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

    let data = PaymentProtocol.PaymentRequest.decode(req.payload);

    console.log('Payment', data);

    return {

      success: true

    }

  }

}

