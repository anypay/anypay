const Invoice = require('../../../lib/models/invoice');

const log = require('winston');

import { models, log } from '../../../lib';

export async function update(req, h) {

    console.log('update invoice uid', req.params.uid)

    let invoice = await models.Invoice.findOne({ where: {

      uid: req.params.uid

    }});

    if (!invoice) {

      console.log('invoice not found')

      return {

        success: false,

        error: 'invoice not found'

      }

    }

    let updateAttrs: any = Object.assign(req.payload, {});

    await models.Invoice.update(updateAttrs, {

      where: { uid: req.params.uid }

    });

    invoice = await models.Invoice.findOne({ where: {

      uid: req.params.uid

    }});

    console.log('invoice updated',invoice)

    return {

      success: true,

      invoice

    }

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

module.exports.sudoShow = async function(request, reply) {

  let invoiceId = request.params.invoice_id;

  log.info(`controller:invoices,action:show,invoice_id:${invoiceId}`);

  try {

	  let invoice = await Invoice.findOne({
	    where: {
	      uid: invoiceId
	    }
	  });


	  if (invoice) {

      return invoice.toJSON();

	  } else {

	    log.error('no invoice found', invoiceId);

	    throw new Error('invoice not found')
	  }
  } catch(error) {
	  log.error(error.message);
  }


}
