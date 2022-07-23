const Boom = require('boom');
const uuid = require('uuid')

const _ = require('lodash')

import { Op } from 'sequelize';

import {plugins} from '../../../lib/plugins';

import { log, prices, email, models, invoices, coins } from '../../../lib';

import { DEFAULT_WEBHOOK_URL } from '../../../lib/webhooks'

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

    log.error('invoice.notfound', where)

    return Boom.notFound()

  }

  if (invoice && !invoice.cancelled) {

    invoice.cancelled = true;
    invoice.status = 'cancelled';

    await invoice.save()

    log.debug('invoice.cancelled', where)

    where['status'] = 'cancelled'

    return where

  } else {

    log.error('invoice.cancel.error.alreadycancelled', where)

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

  log.info(`controller:invoices,action:index`);

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

function selectCurrency(addresses) {

  let currency = addresses.reduce((c, address) => {

    if (c) {

      return c;

    } else {

      if (!coins.getCoin(address.currency).unavailable) {

        c = address.currency

      }

    }

    return c;

  }, null);

  if (!currency) {

    throw new Error('no address set for any active coins');

  }

  return currency;

}

export async function create (request, h) {

  var currency_specified = false;

  /*
    Dynamicallly look up coin and corresponding plugin given the currency
    provided.
  */

  log.info(`controller:invoices,action:create`);

  log.info('invoices.create', Object.assign({

    account_id: request.account.id

  }, request.payload))

	if (request.payload.currency) {

    log.info('currency parameter provided')

    currency_specified = true;

  } else {

    log.info('no currency parameter provided')

    /*
      Find the first address that is from a coin that is currently active
      and set that as the invoice currency. This is a hack because the
      invoice currency actually does not matter any more since moving to
      payment options.
    */

    let addresses = await models.Address.findAll({
      where: { account_id: request.account.id }
    });


    request.payload.currency = selectCurrency(addresses);
	}


	if (!(request.payload.amount > 0)) {
		throw Boom.badRequest('amount must be greater than zero')	
	}

	log.info('amount is greater than zero')

  let plugin = await plugins.findForCurrency(request.payload.currency);

  log.info('plugin.createInvoice');

  let invoice = await plugin.createInvoice(request.account.id, request.payload.amount);

  if(invoice){
 
    log.info('invoice.created', invoice.toJSON());

  }

  invoice.currency_specified = currency_specified;

  if (request.payload.redirect_url) {

    invoice.redirect_url = request.payload.redirect_url;

  }

  if (request.payload.wordpress_site_url) {

    invoice.wordpress_site_url = request.payload.wordpress_site_url;

    invoice.tags = ['wordpress']

  }

  if (request.payload.webhook_url) {

    invoice.webhook_url = request.payload.webhook_url;

  }

  if (request.payload.external_id) {

    invoice.external_id = request.payload.external_id;

  }

  if (request.is_public_request) {

    invoice.is_public_request = true;

  }

  if (request.payload.memo) {

    invoice.memo = request.payload.memo
  }

  invoice.headers = request.headers

  invoice.email = request.payload.email;
  invoice.business_id = request.payload.business_id;
  invoice.location_id = request.payload.location_id;
  invoice.register_id = request.payload.register_id;

  await invoice.save();

  if (invoice.email) {
    let note = await models.InvoiceNote.create({
      content: `Customer Email: ${invoice.email}`,
      invoice_uid: invoice.uid,
    });
  }

  invoice.payment_options = await getPaymentOptions(invoice.uid)

  let sanitized = sanitizeInvoice(invoice);

  sanitized.webhook_url = invoice.webhook_url

  return h.response(

    Object.assign({
      success: true,
      invoice: sanitized,
      payment_options: invoice.payment_options
    }, sanitized)

  ).code(200)

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

  let plugin = await plugins.findForCurrency(currency);

  log.info('plugin.createInvoice');

  let invoice = await plugin.createInvoice(account_id, payload.amount);

  if(invoice){
 
    log.info('invoice.created', invoice.toJSON());

  }

  invoice.redirect_url = payload.redirect_url;

  invoice.webhook_url = payload.webhook_url;

  invoice.external_id = payload.external_id;

  invoice.is_public_request = true;

  invoice.email = payload.email;

  await invoice.save();

  if (invoice.email) {
    let note = await models.InvoiceNote.create({
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

  let payment_options = await models.PaymentOption.findAll({where: {
    invoice_uid
  }});

  return payment_options.map(option => _.pick(option,
    'uri',
    'currency',
    'currency_name',
    'currency_logo_url',
    'amount'
  ))

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

  return resp;
}

export async function show(request, reply) {

  let invoiceId = request.params.invoice_id;

  log.info(`controller:invoices,action:show,invoice_id:${invoiceId}`);

  let invoice = await models.Invoice.findOne({
    where: {
      uid: invoiceId
    }
  });

  if (invoice.status === 'unpaid' && invoices.isExpired(invoice)) {

    invoice = await invoices.refreshInvoice(invoice.uid)

  } else {

    log.debug('invoice not yet expired');
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

    log.error('no invoice found', invoiceId);

    throw new Error('invoice not found')
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

    log.error('no invoice found', req.params.uid);

    throw new Error('invoice not found')

  } else {

    await email.sendInvoiceToEmail(req.params.uid, req.payload.email)

    return { success: true }

  }

}

