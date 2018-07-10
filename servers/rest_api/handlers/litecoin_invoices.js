const log = require('winston');
const Boom = require('boom');
import {generateInvoice} from '../../../lib/invoice';

module.exports.create = async function(request, reply) {
  let dollarAmount = request.payload.amount;
  let accountId = request.auth.credentials.accessToken.account_id;

  log.info('litecoin:invoice:generate',
    `amount:${dollarAmount},account_id:${accountId}`
  );

  try {

    let invoice = await generateInvoice(accountId, denominationAmount, 'LTC');

    log.info('litecoin:invoice:generated', invoice.toJSON());

    return invoice;

  } catch(error){

    log.error('error:litecoin:invoice:generate', error.message);

    return Boom.badRequest(error);
  }
}

