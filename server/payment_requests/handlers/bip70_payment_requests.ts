import {awaitChannel} from '../../../lib/amqp';
import * as Hapi from 'hapi';
import * as Boom from 'boom';

import { log, models, plugins } from '../../../lib'

import * as pay from '../../../lib/pay'

const bitcoin = require('bsv'); 
const Message = require('bsv/message'); 


export async function show(req, h) {

  let currency: pay.Currency = pay.getCurrency({
    protocol: 'BIP70',
    headers: req.headers
  })

  log.info(`bip70.currency.parsed`, currency)

  let paymentRequest: pay.PaymentRequest = await pay.buildPaymentRequestForInvoice({
    uid: req.params.uid,
    currency: currency.code,
    protocol: 'BIP70'
  })

  log.info(`bip70.${currency.code.toLowerCase()}.paymentrequest.content`)

  let hex = paymentRequest.content.serialize().toString('hex')

  models.Bip70PaymentRequest.findOrCreate({
    where: {
      invoice_uid: req.params.uid,
      currency: currency.code
    },
    defaults: {
      invoice_uid: req.params.uid,
      currency: currency.code,
      hex
    }
  })
  .then(([record, isNew]) => {

    if (isNew) {
      log.info('bip70.paymentrequest.recorded', record)
    }
  })
  .catch(error => {
    log.info('error recording paymentrequest', error.message)
  })

  let digest = bitcoin.crypto.Hash.sha256(Buffer.from(JSON.stringify(paymentRequest.content))).toString('hex');

  let response = h.response(paymentRequest.content.serialize());

  if (process.env.JSON_PROTOCOL_IDENTITY_WIF) {

    var privateKey = bitcoin.PrivateKey.fromWIF(process.env.JSON_PROTOCOL_IDENTITY_WIF);
    var signature = Message(digest).sign(privateKey);
    response.header('x-signature-type', 'ecc');
    response.header('x-identity',process.env.JSON_PROTOCOL_IDENTITY_ADDRESS );
    response.header('signature', Buffer.from(signature, 'base64').toString('hex'));
    response.header('digest', `SHA-256=${digest}`);

  }


  response.type(`application/${currency.name}-paymentrequest`);

  response.header('Content-Type', `application/${currency.name}-paymentrequest`);
  response.header('Accept', `application/${currency.name}-payment`);

  return response;

}

export async function create(req, h) {

  let channel = await awaitChannel();

  let currency: pay.Currency = pay.getCurrency({
    protocol: 'BIP70',
    headers: req.headers
  })

  log.info(`bip70.currency.parsed`, currency)

  let plugin = await plugins.findForCurrency(currency.code)

  await channel.publish('anypay', `bip70.payments.${currency.code.toLowerCase()}`, req.payload);

  let payment = pay.BIP70Protocol.Payment.decode(req.payload);

  log.info('bip70.payment.decoded', payment);

  let payment_option = await models.PaymentOption.findOne({

    where: {

      invoice_uid: req.params.uid,

      currency: currency.code

    }
  });

  let invoice = await models.Invoice.findOne({
    where: {
      uid: req.params.uid
    }
  })

  if (invoice.cancelled) {
    log.error('payment.error.invoicecancelled', { uid: req.params.uid, payment })
    return Boom.badRequest('invoice cancelled')
  }

  if (!payment_option) {
    throw new Error(`${currency.code} payment option for invoice ${req.params.uid} not found`)
  }

  for (let transaction of payment.transactions) {

    models.PaymentSubmission.create({
      invoice_uid: invoice.uid,
      txhex: transaction,
      headers: req.headers,
      wallet: null,
      protocol: 'bip70',
      currency: payment_option.currency
    })
  }



  for (const tx of payment.transactions) {

    let transaction = tx.toString('hex') 

    await pay.verifyPayment({
      payment_option,
      hex: transaction,
      protocol: 'BIP70'
    })

    log.info(`bip70.${payment_option.currency}.transaction`, { hex: transaction });

    let resp = await plugin.broadcastTx(transaction);

    log.info(`bip70.${payment_option.currency}.broadcast.result`, { result: resp })

    let paymentRecord = await pay.completePayment(payment_option, transaction)

    log.info(`bip70.${payment_option.currency}.payment.completed`, paymentRecord);

  }

  let ack = new pay.BIP70Protocol.PaymentACK();

  ack.set('payment', payment);

  let response = h.response(ack.toBuffer());

  response.type(`application/${currency.name}-paymentack`);

  return response;

}

