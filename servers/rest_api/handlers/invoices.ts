const Boom = require('boom');
const uuid = require('uuid')

import { Op } from 'sequelize';

import {replaceInvoice} from '../../../lib/invoice';

import {plugins} from '../../../lib/plugins';

import { statsd } from '../../../lib/stats/statsd';

import { log, prices, email, models, invoices, coins } from '../../../lib';

import { logInfo, logError } from '../../../lib/logger'

import * as moment from 'moment';

export async function cancel(req, h) {

  try {

    let where = {
      uid: req.params.uid,
      account_id: req.account.id
    }

    let invoice = await models.Invoice.findOne({
      where
    })

    if (!invoice) {

      logError('invoice.notfound', where)

      return Boom.notFound()

    }

    if (invoice && !invoice.cancelled) {

      invoice.cancelled = true;
      invoice.status = 'cancelled';

      await invoice.save()

      logInfo('invoice.cancelled', where)

      where['status'] = 'cancelled'

      return where

    } else {

      logError('invoice.cancel.error.alreadycancelled', where)

      throw new Error('invoice already cancelled')

    } 

  } catch(error) {

    return Boom.badRequest(error.message)

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

  try {

    var invoices = await models.Invoice.findAll(query);

    return { invoices };

  } catch(error) {

    log.error(error);
    log.error(error.message);

    return { error: error.message };

  }
};

export async function replace (request, reply) {

  let invoiceId = request.params.uid;

  log.info(`controller:invoices,action:replace,invoice_id:${invoiceId}`);

  let invoice = await models.Invoice.findOne({
    where: {
      uid: invoiceId
    }
  });

  if (invoice) {

    invoice = await replaceInvoice(invoice.uid, request.payload.currency);

    return invoice;

  } else {

    log.error('no invoice found', invoiceId);

    throw new Error('invoice not found')
  }

}

function selectCurrency(addresses) {

  let currency = addresses.reduce((c, address) => {
    console.log('C', c)

    if (c) {

      return c;

    } else {

      if (!coins.getCoin(address.currency).unavailable) {

        c = address.currency

      }

    }

    console.log('c', c);

    return c;

  }, null);

  if (!currency) {

    throw new Error('no address set for any active coins');

  }

  return currency;

}

export async function create (request, reply) {

  var currency_specified = false;

  /*
    Dynamicallly look up coin and corresponding plugin given the currency
    provided.
  */

  log.info(`controller:invoices,action:create`);

  logInfo('invoices.create', Object.assign({
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

  try {

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

    invoice.headers = request.headers

    invoice.email = request.payload.email;

    await invoice.save();

    let payment_options = await models.PaymentOption.findAll({where: {
      invoice_uid: invoice.uid
    }});

    if (invoice.email) {
      let note = await models.InvoiceNote.create({
        content: `Customer Email: ${invoice.email}`,
        invoice_uid: invoice.uid,
      });
    }

    invoice.payment_options = payment_options;

    let sanitized = sanitizeInvoice(invoice);

    return Object.assign({
      invoice: sanitized,
      payment_options
    }, sanitized);

  } catch(error) {
    console.log(error);

    log.error(error.message);

    return Boom.badRequest(error.message);

  }

};

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

  invoice.energycity_account_id = payload.energycity_account_id;

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

  let payment_options = await models.PaymentOption.findAll({where: {
    invoice_uid: invoice.uid
  }});

  invoice.payment_options = payment_options;

  let sanitized = sanitizeInvoice(invoice);

  return Object.assign({
    invoice: sanitized,
    payment_options
  }, sanitized);

}

export async function createPublic (request, reply) {

  try {

    let response = await createPublicInvoice(
      request.params.account_id, request.payload);

    return response;

  } catch(error) {

    console.log(error.message);

    return Boom.badRequest(error.message);

  }

  /*
    Dynamicallly look up coin and corresponding plugin given the currency
    provided.
  var currency;

	if (!(request.payload.amount > 0)) {
		throw Boom.badRequest('amount must be greater than zero')	
	}

  let addresses = await models.Address.findAll({ where: {

    account_id: request.account.id

  }})
  
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

  try {

    let plugin = await plugins.findForCurrency(currency);

    log.info('plugin.createInvoice');

    let invoice = await plugin.createInvoice(request.account.id, request.payload.amount);

    if(invoice){
   
      log.info('invoice.created', invoice.toJSON());

    }

    invoice.redirect_url = request.payload.redirect_url;

    invoice.webhook_url = request.payload.webhook_url;

    invoice.external_id = request.payload.external_id;

    invoice.is_public_request = true;

    await invoice.save();

    let payment_options = await models.PaymentOption.findAll({where: {
      invoice_uid: invoice.uid
    }});

    invoice.payment_options = payment_options;

    let sanitized = sanitizeInvoice(invoice);

    return Object.assign({
      invoice: sanitized,
      payment_options
    }, sanitized);

  } catch(error) {

    console.log(error);

    log.error(error.message);

    throw Boom.badRequest(error.message);

  }

  */

};

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

  try {

	  let invoice = await models.Invoice.findOne({
	    where: {
	      uid: invoiceId
	    }
	  });

    if (invoice.status === 'unpaid' && invoices.isExpired(invoice)) {

      invoice = await invoices.refreshInvoice(invoice.uid)

    } else {

      log.info('invoice not yet expired');
    }

	  if (invoice) {

	    log.info('invoice.requested', invoice.toJSON());

      let payment_options = await models.PaymentOption.findAll({where: {
        invoice_uid: invoice.uid
      }});

      invoice.payment_options = payment_options;

      let notes = await models.InvoiceNote.findAll({where: {
        invoice_uid: invoice.uid
      }});

      let sanitized = sanitizeInvoice(invoice);

      let resp = Object.assign({
        invoice: sanitized,
        payment_options,
        notes
      }, sanitized)

      return resp;

	  } else {

	    log.error('no invoice found', invoiceId);

	    throw new Error('invoice not found')
	  }
  } catch(error) {

    console.log(error);

    return Boom.badRequest(error.message);

  }


}

export async function shareEmail(req, h) {

  log.info(`controller:invoices,action:shareEmail,invoice_id:${req.params.uid}`);

  try {

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

  } catch(error) {

    console.log(error);

    return Boom.badRequest(error.message);

  }


}

