const Invoice = require("../../../lib/models/invoice");
const log = require('winston');
const Boom = require('boom');

module.exports.index = async (request, reply) => {

  log.info(`controller:invoices,action:index`);

  var invoices = await Invoice.findAll({
    where: {
      account_id: request.auth.credentials.accessToken.account_id
    }
  });

  return invoices;
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
