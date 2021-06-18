import * as Hapi from 'hapi';

import { verifyPayment, buildPaymentRequestForInvoice } from '../../../lib/pay';

import { amqp, log, models } from '../../../lib';
import { logInfo } from '../../../lib/logger';

import { submitPayment, SubmitPaymentResponse } from './json_payment_requests';

import * as Boom from 'boom';

export async function show(req, h) {

  logInfo('servers.rest_api.bip270_pament_requests.show', req.params)

  let { content } = await buildPaymentRequestForInvoice({
    uid: req.params.uid,
    currency: 'BSV', 
    protocol: 'BIP270'
  })

  log.info(`pay.request.bsv.content`, content)

  let grabAndGoInvoice = await models.GrabAndGoInvoice.findOne({
    where: {
      invoice_uid: req.params.uid
    }
  })

  if (grabAndGoInvoice) {

    let grabAndGoItem = await models.Product.findOne({
      where: {
        id: grabAndGoInvoice.item_id
      }
    })

    let merchantData = JSON.parse(content.merchantData)

    merchantData['merchantName'] = grabAndGoItem.name

    if (grabAndGoItem.image_url) {

      merchantData['avatarUrl'] = grabAndGoItem.image_url

    }

    content['merchantData'] = JSON.stringify(merchantData)

  }

  let response = h.response(content);

  response.type('application/json');

  return response;

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

      memo: "Payment Approved By Anypay®",

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

