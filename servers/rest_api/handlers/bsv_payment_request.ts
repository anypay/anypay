import * as Hapi from 'hapi';

import { createBIP70Request } from '../../../lib/bip70';

import { verifyPayment, buildPaymentRequest } from '../../../lib/pay';

import { handleJsonV2 } from './payment_requests';

import { BigNumber } from 'bignumber.js';
import * as moment from 'moment';

import * as PaymentProtocol from '../../../vendor/bitcore-payment-protocol';

import { transformHexToPayments } from '../../../router/plugins/bsv/lib';

import { models, amqp, plugins, log } from '../../../lib';

import { rpc } from '../../../plugins/bsv/lib/jsonrpc'
import * as bsvPlugin from '../../../plugins/bsv'
import { rpc  as dashRPC } from '../../../plugins/dash/lib/jsonrpc'

import { submitPayment, SubmitPaymentRequest, SubmitPaymentResponse } from './payment_requests';

import * as Boom from 'boom';

const bitcoin = require('bsv'); 
const Message = require('bsv/message'); 

async function handleBIP70(currency, name, req, h) {

  const params = req.params;

  let invoice = await models.Invoice.findOne({ where: { uid: req.params.uid }});

  let account = await models.Account.findOne({ where: {

    id: invoice.account_id

  }});

  let paymentOption = await models.PaymentOption.findOne({

    where: {

      invoice_uid: req.params.uid,

      currency

    }
  });

  if (!paymentOption) {
    return Boom.notFound();
  }

  let content = await createBIP70Request({
    address: paymentOption.address,
    amount: paymentOption.amount,
    currency,
    denomination_amount: invoice.denomination_amount,
    denomination_currency: invoice.denomination_currency,
    uid: invoice.uid
  }, account, paymentOption);

  let digest = bitcoin.crypto.Hash.sha256(Buffer.from(JSON.stringify(content))).toString('hex');

  var privateKey = bitcoin.PrivateKey.fromWIF(process.env.JSON_PROTOCOL_IDENTITY_WIF);

  var signature = Message(digest).sign(privateKey);

  let response = h.response(content.serialize());

  response.type(`application/${name}-paymentrequest`);

  response.header('x-signature-type', 'ecc');
  response.header('x-identity',process.env.JSON_PROTOCOL_IDENTITY_ADDRESS );
  response.header('signature', Buffer.from(signature, 'base64').toString('hex'));
  response.header('digest', `SHA-256=${digest}`);
  response.header('Content-Type', `application/${name}-paymentrequest`);
  response.header('Accept', `application/${name}-payment`);

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

  let content = await buildPaymentRequest(Object.assign(paymentOption, { protocol: 'BIP270'}));

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

  var resp;

  try {

    switch (req.headers.accept) {

      case 'application/payment-request':

        resp = await handleJsonV2(req, h)

        return resp;

      case 'application/bitcoinsv-paymentrequest':

        resp = await handleBIP70('BSV', 'bitcoinsv', req, h)

        return resp;

      case 'application/bitcoin-paymentrequest':

        resp = await handleBIP70('BTC', 'bitcoin', req, h)

        return resp;

      case 'application/bitcoincash-paymentrequest':

        resp = await handleBIP70('BCH', 'bitcoincash', req, h)

        return resp;

      case 'application/simpleledger-paymentrequest':

        resp = await handleBIP70('BCH', 'bitcoincash', req, h)

        return resp;

      case 'application/dash-paymentrequest':

        resp = await handleBIP70('DASH', 'dash', req, h)

        return resp;

      default:

        // bip270
        resp = await handleBSV(req, h)

        return resp;

    }

  } catch(error) {

    log.error('paymentrequest.error', { error });

    return Boom.badRequest(error.message);

  }

}

export async function create(req, h) {

  log.info('bsv.bip270.broadcast', {
    headers: req.headers,
    payload: req.payload
  })

  try {

    let response: SubmitPaymentResponse = await submitPayment({
      transactions: [req.payload.transaction],
      currency: 'BSV',
      invoice_uid: req.params.uid
    })

    log.info('bsv.bip270.broadcast.success', {
      headers: req.headers,
      payload: req.payload,
      response
    })

    return {

      payment: req.payload,

      memo: "Payment Broadcast Successfully By Anypay®",

      error: 0

    }

  } catch(error) {

    log.error('bsv.bip270.broadcast.failed', error)

    return h.response({

      payment: req.payload,
      
      memo: error.message,

      error: 1

    }).code(500)

  }

}

