const Boom = require('boom');

import { Op } from 'sequelize';

import {plugins} from '../../../lib/plugins';

import { log, email, models, invoices } from '../../../lib';

import { Account } from '../../../lib/account';

import { Invoice, getInvoice, createInvoice, cancelInvoice } from '../../../lib/invoices';

import { getPaymentRequest } from '../../../lib/pay/json_v2/protocol'

import { computeInvoiceURI } from '../../../lib/uri'

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

    return Boom.notFound()

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

export async function index (request, reply) {

  /*

    QUERY OPTIONS

      - offset
      - limit
      - status
      - complete
      - start_date_created
      - end_date_created
      - start_date_completed
      - end_date_completed

  */

  let query = {

    where: {

      account_id: request.auth.credentials.accessToken.account_id,

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

  return { invoices };

};

export async function createDeprecated(request, h) {

  const account = new Account(request.account)

  try {

    let invoice: Invoice = await createInvoice({
      account,
      ...request.payload
    })

    if (request.is_public_request) {

      invoice.set('is_public_request', true);

    }

    const json = invoice.toJSON();

    const payment_options = await getPaymentOptions(invoice.uid)

    const responseInvoice = {
      amount: json['amount'],
      currency: json['denomination'],
      status: json['status'],
      uid: json['uid'],
      uri: json['uri'],
      createdAt: json['createdAt'],
      expiresAt: json['expiry'],
      payment_options: payment_options.map(option => {

        const { chain, currency, instructions } = option

        const uri = computeInvoiceURI({ uid: json.uid, currency: chain })

        const amount = instructions[0].outputs.reduce((sum, output) => {

          return sum + output.amount

        }, 0)

        return {
          uri,
          chain,
          currency,
          amount 
        }

      })
    }

    return h.response({
      success: true,
      invoice: responseInvoice,
      uid: json['uid']
    })
    .code(200)

  } catch(error) {

    log.error('api.v0.invoices.create', error)

    return h.badRequest(error)

  }

}



export async function create(request, h) {

  const account = new Account(request.account)

  try {

    let invoice: Invoice = await createInvoice({
      account,
      ...request.payload
    })

    if (request.is_public_request) {

      invoice.set('is_public_request', true);

    }

    const json = invoice.toJSON();

    console.log('get-payment-options')

    const payment_options = await getPaymentOptions(invoice.uid)

    console.log('payment-options', payment_options)

    const responseInvoice = {
      amount: json['amount'],
      currency: json['denomination'],
      status: json['status'],
      uid: json['uid'],
      uri: json['uri'],
      createdAt: json['createdAt'],
      expiresAt: json['expiry'],
      payment_options
    }

    return h.response({
      success: true,
      invoice: responseInvoice,
      uid: json['uid']
    })
    .code(200)

  } catch(error) {

    log.error('api.v0.invoices.create', error)

    return h.badRequest(error)

  }

}

export async function createPublicInvoice(account_id, payload) {
  var currency;

  if (!(payload.amount > 0)) {
    throw new Error('amount must be greater than zero');
  }

  let addresses = await models.Address.findAll({ where: {

    account_id

  }});
 
  let addressesMap = addresses.reduce((set, record) => {

    set[record.currency] = record.value;
    return set;
  }, {});

  if (addressesMap['BCH']) {
    currency = 'BCH';
  } else if (addressesMap['DASH']) {
    currency = 'DASH';
  } else if (addressesMap['BSV']) {
    currency = 'BSV';
  } else {
    currency = addresses[0].currency;
  }

  let plugin = await plugins.findForChain(currency);

  let invoice = await plugin.createInvoice(account_id, payload.amount);

  invoice.redirect_url = payload.redirect_url;

  invoice.webhook_url = payload.webhook_url;

  invoice.external_id = payload.external_id;

  invoice.is_public_request = true;

  invoice.email = payload.email;

  await invoice.save();

  if (invoice.email) {
    await models.InvoiceNote.create({
      content: `Customer Email: ${invoice.email}`,
      invoice_uid: invoice.uid,
    });
  }

  invoice.payment_options = await getPaymentOptions(invoice.uid)

  let sanitized = sanitizeInvoice(invoice);

  return Object.assign({
    invoice: sanitized,
    payment_options: invoice.payment_options
  }, sanitized);

}

async function getPaymentOptions(invoice_uid) { 

  let invoice: Invoice = await getInvoice(invoice_uid)

  let payment_options = await models.PaymentOption.findAll({where: {
    invoice_uid
  }});

  return Promise.all(payment_options.map(async option => {

    const request = await getPaymentRequest(invoice, { chain: option.chain, currency: option.currency })

    request.currency = request.currency || option.currency
    request.chain = request.chain || option.chain

    return request

  }))

}

export async function createPublic (request, reply) {

  let response = await createPublicInvoice(
    request.params.account_id, request.payload);

  return response;

}

function sanitizeInvoice(invoice) {

  let resp = invoice.toJSON();

  delete resp.webhook_url;
  delete resp.id;
  delete resp.dollar_amount;
  delete resp.headers;

  return resp;
}


export async function showDeprecated(request, reply) {

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


export async function show(request, h) {

  try {

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

      const payment_options = await getPaymentOptions(invoice.uid)

      let notes = await models.InvoiceNote.findAll({where: {
        invoice_uid: invoice.uid
      }});

      const responseInvoice = {
        amount: invoice.amount,
        currency: invoice.denomination,
        status: invoice.status,
        uid: invoice.uid,
        uri: invoice.uri,
        createdAt: invoice.createdAt,
        expiresAt: invoice.expiry
      }

      if (invoice.hash) {
        responseInvoice['hash'] = invoice.hash
      }

      responseInvoice['payment_options'] = payment_options
      responseInvoice['notes'] = notes

      return h.response({
        success: true,
        invoice: responseInvoice
      })
      .code(200)

    } else {

      log.error('no invoice found', new Error(`invoice ${invoiceId} not found`));

      throw new Error('invoice not found')
    }

  } catch(error) {

    log.error('invoices.show.error', error)

    return h.badRequest(error)

  }

}

export async function shareEmail(req, h) {

  log.debug(`controller:invoices,action:shareEmail,invoice_id:${req.params.uid}`);

  let invoice = await models.Invoice.findOne({
    where: {
      uid: req.params.uid
    }
  });

  if (!invoice) {

    log.error('no invoice found', new Error(`invoice ${req.params.uid} not found`));

    throw new Error('invoice not found')

  } else {

    await email.sendInvoiceToEmail(req.params.uid, req.payload.email)

    return { success: true }

  }

}

