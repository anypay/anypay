const BitcoinCashInvoice = require("../../../lib/bitcoin_cash/invoice");
const Boom = require('boom');
const log = require('winston');

module.exports.create = async function(request, reply) {

  if (!request.payload || !request.payload.amount) {
    return Boom.badRequest(new Error('amount required (dollars)'));
  }

  let dollarAmount = request.payload.amount;
  let accountId = request.auth.credentials.accessToken.account_id;

  try {

    let invoice = await BitcoinCashInvoice.generate(dollarAmount, accountId)

    log.info('invoice generated', invoice.toJSON());

    return invoice;

  } catch(error) {

    log.error('error generating invoice', error.msg);

    return Boom.badRequest(error);
  }
}

