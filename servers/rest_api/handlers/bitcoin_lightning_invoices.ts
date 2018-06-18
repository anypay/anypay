import {create} from "../../../lib/lightning/invoice";
const Boom = require('boom');
const log = require('winston');

module.exports.create = async function(request, reply) {

  if (!request.payload || !request.payload.amount) {
    return Boom.badRequest(new Error('amount required (dollars)'));
  }

  let dollarAmount = request.payload.amount;
  let accountId = request.auth.credentials.accessToken.account_id;

  log.info('btc.lightning:invoice:create',
    `amount:${dollarAmount},account_id:${accountId}`
  );

  try {
    let invoice = await create(dollarAmount * 1000, accountId)

    log.info('lightning:invoice:created', invoice.toJSON());

    return invoice;

  } catch(error) {

    log.error('error:lightning:invoice:generate', error.msg);

    return Boom.badRequest(error);
  }
}

