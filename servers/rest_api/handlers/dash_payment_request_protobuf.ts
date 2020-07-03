import {generatePaymentRequest} from '../../../plugins/dash/lib/paymentRequest';
import * as Hapi from 'hapi';

import { rpc } from '../../../plugins/dash/lib/jsonrpc'

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

    console.log('content-type or accept is correct for posting DASH BIP70 Payments');

    return {

      success: true

    }

  }

}

