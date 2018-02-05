const DashInvoice = require("../../../lib/dash/invoice");
const log = require('winston');
const Boom = require('boom');

module.exports.create = async function(request, reply) {

  if (!request.payload || !request.payload.amount) {
    return Boom.badRequest(new Error('amount required (dollars)'));
  }

  let dollarAmount = request.payload.amount;
  let accountId = request.auth.credentials.accessToken.account_id;

  log.info('generate dash invoice',
    `amount:${dollarAmount},account_id:${accountId}`
  );

  try {

    var invoice = await DashInvoice.generate(dollarAmount, accountId);

    log.info('generated dash invoice', invoice.toJSON());

    return invoice;

  } catch(error) {

    log.error('error generating dash invoice', error.message);

    return Boom.badRequest(error);
  }

}

