import * as models from '../models';

const DogecoinAddressService = require('./address_service');

import {convert} from '../prices';

module.exports.generate = async function generate(dollarAmount, accountId) {

  let account = await models.Account.findOne({ where: { id: accountId }});

  let address = (await models.Address.findOne({ where: {account_id:accountId, currency:'DOGE'}})).value

  if (!account || !account.dogecoin_address) {
    throw new Error('no dogecoin payout address');
  }

  address = await DogecoinAddressService
    .getNewAddress(dollarAmount, account.dogecoin_address)

  console.log('dogecoin address generated', address);

  let denominationAmount = {
    currency: 'USD',
    value: dollarAmount
  };

  let invoiceAmount = await convert(denominationAmount, 'DOGE');

  let invoice = await models.Invoice.create({
    address: address,
    amount: invoiceAmount.value,
    currency: invoiceAmount.currency,
    dollar_amount: denominationAmount.value,
    account_id: accountId,
    status: 'unpaid'
  });

  return invoice;
}
