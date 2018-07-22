const Boom = require('boom');
const log = require('winston');
import {generateInvoice} from '../../../lib/invoice';

module.exports.create = async function(request, reply) {

  if (!request.payload || !request.payload.amount) {
    return Boom.badRequest(new Error('amount required (dollars)'));
  }

  let denominationAmount = request.payload.amount;
  let accountId = request.auth.credentials.accessToken.account_id;

  log.info('bitcoincash:invoice:create',
    `amount:${denominationAmount},account_id:${accountId}`
  );

  try {
    let invoice = await generateInvoice(accountId, denominationAmount, 'BCH');

    log.info('bitcoincash:invoice:created', invoice.toJSON());

    return invoice;

  } catch(error) {

    log.error('error:bitcoincash:invoice:generate', error.msg);

    return Boom.badRequest(error);
  }
}

