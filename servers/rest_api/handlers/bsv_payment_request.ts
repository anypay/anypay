import {generatePaymentRequest as createBSVRequest} from '../../../plugins/bsv/lib/paymentRequest';

import {generatePaymentRequest as createDASHRequest} from '../../../plugins/dash/lib/paymentRequest';

import {generatePaymentRequest as createBCHRequest} from '../../../lib/bip70';

import {models} from '../../../lib';

import { rpc } from '../../../plugins/bsv/lib/jsonrpc'
import { rpc  as dashRPC } from '../../../plugins/dash/lib/jsonrpc'

import * as Boom from 'boom';

const bitcoin = require('bsv'); 
const Message = require('bsv/message'); 

async function handleBCH(req, h) {

  const params = req.params;

  let invoice = await models.Invoice.findOne({ where: { uid: req.params.uid }});

  let account = await models.Account.findOne({ where: {

    id: invoice.account_id

  }});

  let paymentOption = await models.PaymentOption.findOne({

    where: {

      invoice_uid: req.params.uid,

      currency: 'BCH'

    }
  });

  if (!paymentOption) {
    return Boom.notFound();
  }

  console.log('payment option', paymentOption.toJSON());

  let content = await createBCHRequest({
    address: paymentOption.address,
    amount: paymentOption.amount,
    currency: 'BCH',
    denomination_amount: invoice.denomination_amount,
    denomination_currency: invoice.denomination_currency,
    uid: invoice.uid
  }, account);

  let digest = bitcoin.crypto.Hash.sha256(Buffer.from(JSON.stringify(content))).toString('hex');

  var privateKey = bitcoin.PrivateKey.fromWIF(process.env.JSON_PROTOCOL_IDENTITY_WIF);

  var signature = Message(digest).sign(privateKey);

  let response = h.response(content.serialize());

  response.type('application/bitcoincash-paymentrequest');

  response.header('x-signature-type', 'ecc');
  response.header('x-identity',process.env.JSON_PROTOCOL_IDENTITY_ADDRESS );
  response.header('signature', Buffer.from(signature, 'base64').toString('hex'));
  response.header('digest', `SHA-256=${digest}`);
  response.header('Content-Type', 'application/bitcoincash-paymentrequest');
  response.header('Accept', 'application/bitcoincash-payment');

  return response;

}

async function handleDASH(req, h) {

  const params = req.params;

  let invoice = await models.Invoice.findOne({ where: { uid: req.params.uid }});

  let account = await models.Account.findOne({ where: {

    id: invoice.account_id

  }});

  let paymentOption = await models.PaymentOption.findOne({

    where: {

      invoice_uid: req.params.uid,

      currency: 'DASH'

    }
  });

  if (!paymentOption) {
    return Boom.notFound();
  }

  console.log('payment option', paymentOption.toJSON());

  let content = await createBCHRequest({
    address: paymentOption.address,
    amount: paymentOption.amount,
    currency: 'DASH',
    denomination_amount: invoice.denomination_amount,
    denomination_currency: invoice.denomination_currency,
    uid: invoice.uid
  }, account);

  let digest = bitcoin.crypto.Hash.sha256(Buffer.from(JSON.stringify(content))).toString('hex');

  var privateKey = bitcoin.PrivateKey.fromWIF(process.env.JSON_PROTOCOL_IDENTITY_WIF);

  var signature = Message(digest).sign(privateKey);

  let response = h.response(content.serialize());

  response.type('application/dash-paymentrequest');

  response.header('x-signature-type', 'ecc');
  response.header('x-identity',process.env.JSON_PROTOCOL_IDENTITY_ADDRESS );
  response.header('signature', Buffer.from(signature, 'base64').toString('hex'));
  response.header('digest', `SHA-256=${digest}`);
  response.header('Content-Type', 'application/dash-paymentrequest');
  response.header('Accept', 'application/dash-payment');

  return response;

}


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


/*
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
*/

export async function show(req, h) {

  console.log(req);
  var resp;

  try {

    switch (req.headers.accept) {

      case 'application/bitcoinsv-paymentrequest':

        resp = await handleBSV(req, h)

        return resp;

      case 'application/bitcoincash-paymentrequest':

        resp = await handleBCH(req, h)

        return resp;

      case 'application/dash-paymentrequest':

        resp = await handleDASH(req, h)

        return resp;

      default:

        resp = await handleBSV(req, h)

        return resp;

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

  } else if (req.headers['x-content-type'] === 'application/bitcoinsv-payment') {

    let hex = req.payload.transaction;

    console.log("BROADCAST", hex);

    try {

      let resp = await rpc.call('sendrawtransaction', [hex]);

      console.log('resp', resp);

    } catch(error) {

      console.log('could not broadcast transaction', hex);

      var code;

      if (error.message === 'Internal Server Error') {
        code = 400;
      } else {
        code = 500;
      }

      return h.response({

        payment: {

          transaction: req.payload.transaction,

        },

        error: `transaction rejected with error: ${error.message}`

      }).code(code);

    }

    return {

      payment: {

        transaction: req.payload.transaction

      },

      memo: "Transaction received by Anypay. Invoice will be marked as paid if the transaction is confirmed."

    }

  } else if (req.headers['x-content-type'] === 'application/dash-payment') {

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

  } else {

    let hex = req.payload.transaction;

    console.log("BROADCAST", hex);

    try {

      let resp = await rpc.call('sendrawtransaction', [hex]);

      console.log('resp', resp);

    } catch(error) {

      console.log('could not broadcast transaction', hex);

      var code;

      if (error.message === 'Internal Server Error') {
        code = 400;
      } else {
        code = 500;
      }

      return h.response({

        payment: {

          transaction: req.payload.transaction,

        },

        error: `transaction rejected with error: ${error.message}`

      }).code(code);

    }

    return {

      payment: {

        transaction: req.payload.transaction

      },

      memo: "Transaction received by Anypay. Invoice will be marked as paid if the transaction is confirmed."

    }

  }

}

