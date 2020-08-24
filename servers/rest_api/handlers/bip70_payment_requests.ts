import {awaitChannel} from '../../../lib/amqp';
import * as Hapi from 'hapi';
import * as Boom from 'boom';

import { log, models, plugins } from '../../../lib'

import * as pay from '../../../lib/pay'

const bitcoin = require('bsv'); 
const Message = require('bsv/message'); 


export async function show(req, h) {

  try {

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

    let digest = bitcoin.crypto.Hash.sha256(Buffer.from(JSON.stringify(paymentRequest.content))).toString('hex');
    var privateKey = bitcoin.PrivateKey.fromWIF(process.env.JSON_PROTOCOL_IDENTITY_WIF);
    var signature = Message(digest).sign(privateKey);
    let response = h.response(paymentRequest.content.serialize());

    response.type(`application/${currency.name}-paymentrequest`);

    response.header('x-signature-type', 'ecc');
    response.header('x-identity',process.env.JSON_PROTOCOL_IDENTITY_ADDRESS );
    response.header('signature', Buffer.from(signature, 'base64').toString('hex'));
    response.header('digest', `SHA-256=${digest}`);
    response.header('Content-Type', `application/${currency.name}-paymentrequest`);
    response.header('Accept', `application/${currency.name}-payment`);

    return response;

  } catch(error) {

    log.error(error)

    return Boom.badRequest(error.message)

  }
}

export async function create(req, h) {

  try {

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

    if (!payment_option) {
      throw new Error(`${currency.code} payment option for invoice ${req.params.uid} not found`)
    }

    for (const transaction of payment.transactions) {

      log.info(`bip70.${payment_option.currency}.transaction`, transaction.toString('hex'));

      let resp = await plugin.broadcastTx(transaction.toString('hex'));

      log.info(`bip70.${payment_option.currency}.broadcast.result`, resp)

      await pay.verifyPayment({
        payment_option,
        hex: transaction.toString('hex'),
        protocol: 'BIP70'
      })

    }

    let ack = new pay.BIP70Protocol.PaymentACK();

    ack.set('payment', payment);

    let response = h.response(ack.toBuffer());

    response.type(`application/${currency.name}-paymentack`);

    return response;

  } catch(error) {

    log.info('bip70error', error)
    log.info('bip70error', error.message)

    let response = h.response({ success: false, error: error.message }).code(500);

    return response

  }

}


