import {generatePaymentRequest as createBSVRequest} from '../../../plugins/bsv/lib/paymentRequest';

import {generatePaymentRequest as createDASHRequest} from '../../../plugins/dash/lib/paymentRequest';

import {generatePaymentRequest as createBCHRequest} from '../../../plugins/bch/lib/paymentRequest';

import {models} from '../../../lib';

import { rpc } from '../../../plugins/bsv/lib/jsonrpc'
import { rpc  as dashRPC } from '../../../plugins/dash/lib/jsonrpc'

import * as Boom from 'boom';

const bitcoin = require('bsv'); 
const Message = require('bsv/message'); 

async function handleBSV(req, h) {

  const params = req.params;

  let invoice = await models.Invoice.findOne({ where: { uid: req.params.uid }});

  let paymentOption = await models.PaymentOption.findOne({
  
    where: {

      invoice_uid: req.params.uid,

      currency: 'BSV'

    }

  });

  console.log('payment option', paymentOption.toJSON());

  let content = await createBSVRequest(invoice, paymentOption);

  let digest = bitcoin.crypto.Hash.sha256(Buffer.from(JSON.stringify(content))).toString('hex'); 

  var privateKey = bitcoin.PrivateKey.fromWIF(process.env.JSON_PROTOCOL_IDENTITY_WIF);

  var signature = Message(digest).sign(privateKey); 

  let response = h.response(content);

  response.type('application/json');

  response.header('x-signature-type', 'ecc');

  response.header('x-identity',process.env.JSON_PROTOCOL_IDENTITY_ADDRESS );

  response.header('signature', Buffer.from(signature, 'base64').toString('hex'));

  response.header('digest', `SHA-256=${digest}`);

  return response;

}


async function handleDASH(req, h) {

  const params = req.params;

  let invoice = await models.Invoice.findOne({ where: { uid: req.params.uid }});

  let paymentOption = await models.PaymentOption.findOne({
  
    where: {

      invoice_uid: req.params.uid,

      currency: 'DASH'

    }
  });

  console.log('payment option', paymentOption.toJSON());

  let content = await createDASHRequest(invoice, paymentOption);

  let digest = bitcoin.crypto.Hash.sha256(Buffer.from(JSON.stringify(content))).toString('hex'); 

  var privateKey = bitcoin.PrivateKey.fromWIF(process.env.JSON_PROTOCOL_IDENTITY_WIF);

  var signature = Message(digest).sign(privateKey); 

  let response = h.response(content);

  response.type('application/dash-paymentrequest');

  response.header('x-signature-type', 'ecc');
  response.header('x-identity',process.env.JSON_PROTOCOL_IDENTITY_ADDRESS );
  response.header('signature', Buffer.from(signature, 'base64').toString('hex'));
  response.header('digest', `SHA-256=${digest}`);

  return response;

}

export async function show(req, h) {

  console.log(req);
  var resp;

  try {

    switch (req.headers.accept) {

      case 'application/bitcoinsv-paymentrequest':

        resp = await handleBSV(req, h)

        return resp;

      case 'application/dash-paymentrequest':

        resp = await handleDASH(req, h)

        return resp;

      default:

        return Boom.badRequest('currency not supported');

    }

  } catch(error) {

    console.log(error);

    return Boom.badRequest(error.message);

  }

}

export async function create(req, h) {

  console.log('HEADERS');
  console.log(req.headers);

  console.log('PAYLOAD');
  console.log(req.payload);

  if (req.headers.accept === 'application/verify-payment') {

    return {

      payment: req.payload,

      memo: "This looks good for now, we will see what the miners say."

    }

  }

  if (req.headers['x-content-type'] === 'application/bitcoinsv-payment') {

    req.payload.transactions.forEach(async (hex) => {

      console.log("BROADCAST", hex);

      try {

        let resp = await rpc.call('sendrawtransaction', [hex]);

        console.log('resp', resp);

      } catch(error) {

        console.log('could not broadcast transaction', hex);

      }

    });

    return {

      payment: {

        transactions: req.payload.transactions 

      },

      memo: "Transaction received by Anypay. Invoice will be marked as paid if the transaction is confirmed."

    }

  }

  if (req.headers['x-content-type'] === 'application/dash-payment') {

    req.payload.transactions.forEach(async (hex) => {

      console.log("BROADCAST", hex);

      try {

        let resp = await dashRPC.call('sendrawtransaction', [hex]);

        console.log('resp', resp);

      } catch(error) {

        console.log('could not broadcast transaction', hex);

      }

    });

    return {

      payment: {

        transactions: req.payload.transactions 

      },

      memo: "Transaction received by Anypay. Invoice will be marked as paid if the transaction is confirmed."

    }

  }

}

