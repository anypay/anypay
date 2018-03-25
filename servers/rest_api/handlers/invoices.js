const Invoice = require("../../../lib/models/invoice");
const log = require('winston');
const Boom = require('boom');
const uuid = require('uuid')

module.exports.index = async (request, reply) => {

  log.info(`controller:invoices,action:index`);

  var invoices = await Invoice.findAll({
    where: {
      account_id: request.auth.credentials.accessToken.account_id
    }
  });

  return { invoices };
};

module.exports.create = async (request, reply) => {

  log.info(`controller:invoices,action:create`);

	if (!request.payload.currency) {
		throw Boom.badRequest('no currency paramenter provided')
	}

	log.info('currency parameter provided')

	if (!(request.payload.amount > 0)) {
		throw Boom.badRequest('amount must be greater than zero')	
	}

	log.info('amount is greater than zero')

  if (request.payload.currency === 'XRP') {

		if (request.account.ripple_address) {

			try {

				let invoice = await Invoice.create({
					currency: 'XRP',
					account_id: request.account.id,
					address: request.account.ripple_address,
					dollar_amount: request.payload.amount,
					amount: 1
				})

				return {
					invoice: invoice
				}	

			} catch(error) {
				throw Boom.badRequest(error.message)
			}


		} else {
			throw Boom.badRequest('no ripple address set for account')
		}
	} else {
		throw Boom.badRequest('currency not supported')
	}
};

module.exports.show = async function(request, reply) {

  let invoiceId = request.params.invoice_id;

  log.info(`controller:invoices,action:show,invoice_id:${invoiceId}`);

  let invoice = await Invoice.findOne({
    where: {
      uid: invoiceId
    }
  });

  if (invoice) {

    log.info('invoice found', invoice.toJSON());

    return invoice;

  } else {

    log.error('no invoice found', invoiceId);

    throw new Error('invoice not found')
  }

}
