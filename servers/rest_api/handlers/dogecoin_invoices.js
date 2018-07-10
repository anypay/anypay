import {generateInvoice} from '../../../lib/invoice';

import * as Boom from 'boom';
import * as log from 'winston';

module.exports.create = async function(request, h) {
  let denominationAmount = request.payload.amount;
  let accountId = request.auth.credentials.accessToken.account_id;

  log.info('dogecoin:invoice:generate', {
    amount: denominationAmount,
    account_id: accountId
  });
  
  try {

    let invoice = await generateInvoice(accountId, denominationAmount, 'DOGE');

    return invoice;

  } catch(error) {

    return Boom.badRequest(error);
  }

}

