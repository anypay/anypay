const BitcoinInvoice = require("../../../lib/bitcoin/invoice");
const Boom = require('boom');
const log = require('winston');

module.exports.create = async function(request, reply) {
  let dollarAmount = request.payload.amount;
  let accountId = request.auth.credentials.accessToken.account_id;

  log.info('generate bitcoin core invoice',
    `amount:${dollarAmount},account_id:${accountId}`
  );

  try {

    let invoice = await BitcoinInvoice.generate(dollarAmount, accountId)

    log.info('generated bitcoin core invoice', invoice.toJSON());

    return invoice;

  } catch(error) {

    log.error('error generating bitcoin invoice', error.message);

    return Boom.badRequest(error);

  };
}

