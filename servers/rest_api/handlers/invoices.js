const Invoice = require('../../../lib/models/invoice');
const log = require('winston');
const Boom = require('boom');
const uuid = require('uuid')

import { Op } from 'sequelize';

import {replaceInvoice} from '../../../lib/invoice';

import {emitter} from '../../../lib/events';

import {plugins} from '../../../lib/plugins';

import { statsd } from '../../../lib/stats/statsd';

import * as moment from 'moment';

module.exports.index = async (request, reply) => {

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

    var invoices = await Invoice.findAll(query);

    return { invoices };

  } catch(error) {

    log.error(error.message);

    return { error: error.message };

  }
};

module.exports.sudoIndex = async (request, reply) => {

  log.info(`controller:invoices,action:index`, request.query);

  let where = {}

  if (request.query.currency) {
    where['currency'] = request.query.currency;
  }

  if (request.query.denomination) {
    where['denomination'] = request.query.denomination;
  }

  if (request.query.account_id) {
    where['account_id'] = request.query.account_id;
  }

  if (request.query.status) {
    where['status'] = request.query.status;
  }

  var invoices = await Invoice.findAll({

    where,

    order: [
      request.query.order || ['createdAt', 'DESC']
    ],

    offset: parseInt(request.query.offset) || 0,

    limit: parseInt(request.query.limit) || 100

  });

  return { invoices };
};

module.exports.replace = async (request, reply) => {

  let invoiceId = request.params.uid;

  log.info(`controller:invoices,action:replace,invoice_id:${invoiceId}`);

  let invoice = await Invoice.findOne({
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

module.exports.create = async (request, reply) => {

  /*
    Dynamicallly look up coin and corresponding plugin given the currency
    provided.
  */

  log.info(`controller:invoices,action:create`);

	if (!request.payload.currency) {
		throw Boom.badRequest('no currency paramenter provided')
	}

	log.info('currency parameter provided')

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

    if (request.payload.redirect_url) {

      invoice.redirect_url = request.payload.redirect_url;

    }

    if (request.payload.webhook_url) {

      invoice.webhook_url = request.payload.webhook_url;

    }

    if (request.payload.external_id) {

      invoice.external_id = request.payload.external_id;

    }

    if (request.payload.cashback_amount) {

      let price = invoice.denomination_amount / invoice.amount;

      invoice.cashback_amount = request.payload.cashback_amount / price;

      console.log('cashback amount', invoice.cashback_amount);

    }

    await invoice.save();

    return sanitizeInvoice(invoice);

  } catch(error) {

    log.error(error.message);

    throw Boom.badRequest(error.message);

  }

};

function sanitizeInvoice(invoice) {

  let resp = invoice.toJSON();

  delete resp.webhook_url;
  delete resp.id;
  delete resp.account_id;
  delete resp.dollar_amount;

  return resp;
}

module.exports.show = async function(request, reply) {

  let invoiceId = request.params.invoice_id;

  log.info(`controller:invoices,action:show,invoice_id:${invoiceId}`);


  try {

	  let invoice = await Invoice.findOne({
	    where: {
	      uid: invoiceId
	    }
	  });


	  if (invoice) {

	    log.info('invoice.requested', invoice.toJSON());

	    emitter.emit('invoice.requested', invoice.toJSON()); 

      return sanitizeInvoice(invoice);

	  } else {

	    log.error('no invoice found', invoiceId);

	    throw new Error('invoice not found')
	  }
  } catch(error) {
	  log.error(error.message);
  }


}

/*

emitter.on('invoice.requested', async (invoice) => {

  statsd.increment('invoice requested')

  log.info("checking.invoice:", invoice.uid, invoice.currency, invoice.amount, invoice.address)

  plugins.checkAddressForPayments(invoice.address, invoice.currency);

});
*/
