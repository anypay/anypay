import * as Hapi from 'hapi';

import {generatePaymentRequest as createBSVRequest} from '../../../plugins/bsv/lib/paymentRequest';

import {generatePaymentRequest as createDASHRequest} from '../../../plugins/dash/lib/paymentRequest';

import {generatePaymentRequest as createBCHRequest} from '../../../lib/bip70';

import { BigNumber } from 'bignumber.js';
import * as moment from 'moment';

import * as PaymentProtocol from '../../../vendor/bitcore-payment-protocol';

import { transformHexToPayments } from '../../../router/plugins/bsv/lib';

import {models, amqp} from '../../../lib';

import { rpc } from '../../../plugins/bsv/lib/jsonrpc'
import { rpc  as dashRPC } from '../../../plugins/dash/lib/jsonrpc'

import * as Boom from 'boom';

const bitcoin = require('bsv'); 
const Message = require('bsv/message'); 

async function handleEdge(req: Hapi.Request, h: Hapi.ResponseToolkit) {

  let invoice = await models.Invoice.findOne({ where: { uid: req.params.uid }});

  let account = await models.Account.findOne({ where: {

    id: invoice.account_id
  }});

  let currency = req.headers['x-currency'];

  if (!currency) {
    //throw new Error('x-currency header must be provided with value such as BCH,DASH,BSV,BTC')
    currency = 'BCH'
  }

  let paymentOption = await models.PaymentOption.findOne({

    where: {

      invoice_uid: req.params.uid,

      currency

    }
  });

  if (!paymentOption) {
    return Boom.notFound();
  }

  let amount = new BigNumber(paymentOption.amount);
  var address = paymentOption.address;

  if (address.match(/\:/)) {
    address = address.split(':')[1];
  }

  const paymentRequest = {
    "network": "main",
    "currency": currency,
    "requiredFeeRate": 1,
    "outputs": [
        {
            "amount": amount.times(100000000).toNumber(),
            "address": address
        }
    ],
    "time": moment(invoice.createdAt).toDate(),
    "expires": moment(invoice.createdAt).add(15, 'minutes').toDate(),
    "memo": `Payment request for Anypay invoice ${invoice.uid}`,
    "paymentUrl": `https://anypayinc.com/payments/edge/${currency}/${invoice.uid}`,
    "paymentId": invoice.uid
  }

  let response = h.response(paymentRequest);

  response.type('application/payment-request');

  response.header('Content-Type', 'application/payment-request');

  response.header('Accept', 'application/payment');

  return response;



}

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

export async function show(req, h) {

  console.log(req);
  var resp;

  if (req.headers['x-requested-with'] === 'co.edgesecure.app') {

    return handleEdge(req, h);

  }

  try {

    switch (req.headers.accept) {

      case 'application/bitcoinsv-paymentrequest':

        resp = await handleBSV(req, h)

        return resp;

      case 'application/bitcoincash-paymentrequest':

        resp = await handleBCH(req, h)

        return resp;

      case 'application/simpleledger-paymentrequest':

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

  } else if (req.headers['x-accept'] === 'application/dash-paymentack') {

    var protocol = new PaymentProtocol('DASH');

    protocol.makePayment();

    console.log('string', req.payload.toString());
    console.log('hex', req.payload.toString('hex'));

    let payment = protocol.deserialize(req.payload, 'Payment');

    console.log("payment deserialized", payment);

    payment.message.transactions.forEach(async (hex) => {

      console.log("BROADCAST", hex);

      try {

        let resp = await dashRPC.call('sendrawtransaction', [hex]);

        console.log('resp', resp);

      } catch(error) {

        console.log('could not broadcast transaction', hex);

      }

    });

    let paymentAck = new PaymentProtocol('DASH');

    paymentAck.makePaymentACK();

    paymentAck.set('payment', payment.message);
    let memo = "Transaction received by Anypay. Invoice will be marked as paid if the transaction is confirmed."
    paymentAck.set('memo', memo);

    let response = h.response(paymentAck.serialize());

    response.type('application/dash-paymentack');

    response.header('Content-Type', 'application/dash-paymentack');
    response.header('Accept', 'application/dash-paymentack');

    return response;

  } else {

    let hex = req.payload.transaction;

    console.log("BROADCAST", hex);

    /* BSV transaction using p2p
       Need to parse the payments from the raw transaction
    */

    let payments = await transformHexToPayments(hex);

    console.log('PAYMENTS', payments);

    try {

      let resp = await rpc.call('sendrawtransaction', [hex]);

      console.log('resp', resp);

      let channel = await amqp.awaitChannel();

      payments.forEach(payment => {

        channel.publish('anypay.payments', 'payment', Buffer.from(
          JSON.stringify(payment)
        ));

      });

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

