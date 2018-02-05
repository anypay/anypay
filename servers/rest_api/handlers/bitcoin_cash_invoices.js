const BitcoinCashInvoice = require("../../../lib/bitcoin_cash/invoice");
const Boom = require('boom');
const log = require('winston');

module.exports.create = async function(request, reply) {

  if (!request.payload || !request.payload.amount) {
    return Boom.badRequest(new Error('amount required (dollars)'));
  }

  let dollarAmount = request.payload.amount;
  let accountId = request.auth.credentials.accessToken.account_id;

  log.info('bitcoincash:invoice:create',
    `amount:${dollarAmount},account_id:${accountId}`
  );

  try {

    let invoice = await BitcoinCashInvoice.generate(dollarAmount, accountId)

    log.info('bitcoincash:invoice:created', invoice.toJSON());

    return invoice;

  } catch(error) {

    log.error('error:bitcoincash:invoice:generate', error.msg);

    return Boom.badRequest(error);
  }
}

