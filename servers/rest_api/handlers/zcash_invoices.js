import {generateInvoice} from '../../../lib/invoice';

module.exports.create = async function(request, h) {
  const denominationAmount = request.payload.amount;
  const accountId = request.auth.credentials.accessToken.account_id;

  let invoice = await generateInvoice(accountId, denominationAmount, 'ZEC');

  return invoice;
}
