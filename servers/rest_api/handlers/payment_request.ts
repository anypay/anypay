import * as bchPaymentRequest from '../../../plugins/bch/lib/paymentRequest';

import * as bsvPaymentRequest from '../../../plugins/bsv/lib/paymentRequest';

import * as bchrpc from '../../../plugins/bch/lib/jsonrpc'

import * as bsvrpc from '../../../plugins/bsv/lib/jsonrpc'

const bitcoin = require('bsv'); 

const Message = require('bsv/message'); 

export async function show(req, h) {

  const params = req.params

  let content = await bch.generatePaymentRequest(params.uid)

  let digest = bitcoin.crypto.Hash.sha256(Buffer.from(JSON.stringify(content))).toString('hex'); 

  var privateKey = bitcoin.PrivateKey.fromWIF(process.env.JSON_PROTOCOL_IDENTITY_WIF);

  var signature = Message(digest).sign(privateKey); 

  let response = h.response(content);

  response.type('application/payment-request');

  response.header('x-signature-type', 'ecc');
  response.header('x-identity',process.env.JSON_PROTOCOL_IDENTITY_ADDRESS );
  response.header('signature', Buffer.from(signature, 'base64').toString('hex'));
  response.header('digest', `SHA-256=${digest}`);

  return response

}

export async function showBit270(req, h) {

  const params = req.params

  let content = await bsv.generatePaymentRequest(params.uid)

  let digest = bitcoin.crypto.Hash.sha256(Buffer.from(JSON.stringify(content))).toString('hex'); 

  var privateKey = bitcoin.PrivateKey.fromWIF(process.env.BSV_JSON_PROTOCOL_IDENTITY_WIF);

  var signature = Message(digest).sign(privateKey); 

  let response = h.response(content);

  response.type('application/payment-request');

  response.header('x-signature-type', 'ecc');
  response.header('x-identity',process.env.BSV_JSON_PROTOCOL_IDENTITY_ADDRESS );
  response.header('signature', Buffer.from(signature, 'base64').toString('hex'));
  response.header('digest', `SHA-256=${digest}`);

  return response

}


export async function createBip270(req, h) {

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

        let resp = await bsvrpc.call('sendrawtransaction', [hex]);

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


export async function createBip70(req, h) {

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

  if (req.headers['x-content-type'] === 'application/payment') {

    req.payload.transactions.forEach(async (hex) => {

      console.log("BROADCAST", hex);

      try {

        let resp = await bchrpc.call('sendrawtransaction', [hex]);

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

