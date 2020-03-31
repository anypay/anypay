const Op = require('sequelize').Op;

import * as Boom from 'boom';

import * as Sequelize from 'sequelize';

import { models } from '../../../lib';

import * as hapiSequelize from '../../../lib/hapi_sequelize';

import {republishTxid} from '../../../lib/invoice';

const log = require('winston');


module.exports.sudoRepublishTxid = async (req, h) => {
 
  let currency = req.payload.currency;

  let txid = req.payload.txid;

  log.info(`republishing txid ${currency} : ${txid}` );

  await republishTxid( currency, txid);

  return txid;

}

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

  var invoices = await models.Invoice.findAll({

    where,

    order: [
      request.query.order || ['createdAt', 'DESC']
    ],

    offset: parseInt(request.query.offset) || 0,

    limit: parseInt(request.query.limit) || 100

  });

  return { invoices };

};

module.exports.sudoShow = async function(request, reply) {

  let invoiceId = request.params.invoice_id;

  log.info(`controller:invoices,action:show,invoice_id:${invoiceId}`);

  try {

	  let invoice = await models.Invoice.findOne({
	    where: {
	      uid: invoiceId
	    }
	  });

	  if (invoice) {

      let data = invoice.toJSON();

      data.account = await models.Account.findOne({
        where: { id: invoice.account_id }
      });

      data.cashback = await models.CashbackCustomerPayment.findOne({
        where: { invoice_id: invoice.id }
      });

      return data;

	  } else {

	    log.error('no invoice found', invoiceId);

	    throw new Error('invoice not found')
	  }
  } catch(error) {
	  log.error(error.message);
  }


}

module.exports.sudoIndexUnrouted = async function(request, reply) {

  let { order, limit, offset } = hapiSequelize.parseRequest(request);

  try {

    let invoices = await models.Invoice.findAll({
      where: {
        output_hash: { [Op.is]: null },
        invoice_amount_paid: { [Op.gt]: 0 },
        createdAt: { [Op.gt]: new Date(1572566400*1000)} //November 1st, 2019
      },

      order,
      limit,
      offset
    });

    return { invoices }

  } catch(error) {
	  log.error(error);

      return Boom.badRequest(error)

  }

}
