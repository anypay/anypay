const Boom = require('boom');
const log = require('winston');
import {generateInvoice} from '../../../lib/invoice';

module.exports.create = async function(request, reply) {
  let denominationAmount = request.payload.amount;
  let accountId = request.auth.credentials.accessToken.account_id;

  log.info('generate bitcoin core invoice',
    `amount:${denominationAmount},account_id:${accountId}`
  );

  try {

    let invoice = await generateInvoice(accountId, denominationAmount, 'BTC');

    log.info('generated bitcoin core invoice', invoice.toJSON());

    return invoice;

  } catch(error) {

    log.error('error generating bitcoin invoice', error.message);

    return Boom.badRequest(error);

  };
}

