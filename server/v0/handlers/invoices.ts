
const _ = require('lodash')

import { Op } from 'sequelize';

import { log, models, invoices } from '../../../lib';

import { findAccount } from '../../../lib/account';

import { Invoice, createInvoice, cancelInvoice } from '../../../lib/invoices';

import * as moment from 'moment';

export async function cancel(req, h) {

  let where = {
    uid: req.params.uid,
    account_id: req.account.id
  }

  let invoice = await models.Invoice.findOne({
    where
  })

  if (!invoice) {

    log.error('invoice.notfound', new Error(JSON.stringify(where)))

    return h.notFound()

  }

  if (invoice && !invoice.cancelled) {

    await cancelInvoice(invoice)

    where['status'] = 'cancelled'

    return where

  } else {

    log.error('invoice.cancel.error.alreadycancelled', new Error(JSON.stringify(where)))

    throw new Error('invoice already cancelled')

  } 

}

export async function index (request, h) {

  let query = {

    where: {

      account_id: request.account.id

    },

    include: [{
      model: models.InvoiceNote,
      as: 'notes'
    }],

    order: [
      ['createdAt', 'DESC']
    ],

    offset: request.query.offset || 0,

    limit: request.query.limit

  };

  if (request.query.status) {

    query.where['status'] = request.query.status;

  }

  if (request.query.complete) {

    query.where['complete'] = request.query.complete;

  }

  if (request.query.start_date_completed) {

    query.where['completed_at'] = {
      [Op.gte]: moment(request.query.start_date_completed).toDate()
    }

  }

  if (request.query.end_date_completed) {

    if (!query.where['completed_at']) {

      query.where['completed_at'] = {};
    }

    query.where['completed_at'][Op.lt] = moment(request.query.end_date_completed).toDate();

  }

  if (request.query.start_date_created) {

    query.where['createdAt'] = {
      [Op.gte]: moment(request.query.start_date_created).toDate()
    }

  }

  if (request.query.end_date_created) {

    query.where['createdAt'] = {
      [Op.lt]: moment(request.query.end_date_created).toDate()
    }

  }

  var invoices = await models.Invoice.findAll(query);

  return h.response({ invoices });

};

export async function create(request, h) {

  const account = request.account

  try {

    let invoice: Invoice = await createInvoice({
      account,
      ...request.payload
    })

    if (request.is_public_request) {

      invoice.set('is_public_request', true);

    }

    invoice.set('headers', request.headers)

    const json = invoice.toJSON();

    const payment_options = await getPaymentOptions(invoice.uid)

    return h.response({
      success: true,
      invoice: {
        amount: json['amount'],
        currency: json['denomination'],
        status: json['status'],
        uid: json['uid'],
        uri: json['uri'],
        createdAt: json['createdAt'],
        expiresAt: json['expiry'],
        payment_options
      },
      uid: json['uid']
    })
    .code(200)

  } catch(error) {

    console.error('__ERROR', error)

    log.error('api.v0.invoices.create', error)

    return h.badRequest(error)

  }

}


async function getPaymentOptions(invoice_uid) { 

  let payment_options = await models.PaymentOption.findAll({where: {
    invoice_uid
  }});

  return payment_options.map(option => {

    option = _.pick(option,
      'uri',
      'currency',
      'amount'
    )

    option['chain'] = option['currency']

    return option

  })

}

export async function createPublic (request, h) {

  request.is_public_request = true

  request.account = await findAccount(request.params.account_id)

  return create(request, h)

}

function sanitizeInvoice(invoice) {

  let resp = invoice.toJSON();

  delete resp.webhook_url;
  delete resp.id;
  delete resp.dollar_amount;

  return resp;
}

export async function show(request, h) {

  let invoiceId = request.params.invoice_id;

  let invoice = await models.Invoice.findOne({
    where: {
      uid: invoiceId
    }
  });

  if (invoice.status === 'unpaid' && invoices.isExpired(invoice)) {

    invoice = await invoices.refreshInvoice(invoice.uid)

  }

  if (invoice) {

    log.debug('invoice.requested', invoice.toJSON());

    invoice.payment_options = await getPaymentOptions(invoice.uid)

    let notes = await models.InvoiceNote.findAll({where: {
      invoice_uid: invoice.uid
    }});

    let sanitized = sanitizeInvoice(invoice);

    let resp = Object.assign({
      invoice: sanitized,
      payment_options: invoice.payment_options,
      notes
    }, sanitized)

    return resp;

  } else {

    log.error('no invoice found', new Error(`invoice ${invoiceId} not found`));

    throw new Error('invoice not found')
  }

}
