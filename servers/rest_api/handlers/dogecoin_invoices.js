const DogecoinInvoice = require("../../../lib/dogecoin/invoice");

import * as Boom from 'boom';
import * as log from 'winston';

module.exports.create = async function(request, h) {
  let dollarAmount = request.payload.amount;
  let accountId = request.auth.credentials.accessToken.account_id;

  log.info('dogecoin:invoice:generate', {
    amount: dollarAmount,
    account_id: accountId
  });
  
  try {

    let invoice = await DogecoinInvoice.generate(dollarAmount, accountId);

    return invoice;

  } catch(error) {

    return Boom.badRequest(error);
  }

}

