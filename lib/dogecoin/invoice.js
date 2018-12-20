const Invoice = require('../models/invoice');
const Account = require('../models/account');
const Address = require('../models/address');
const DogecoinAddressService = require('./address_service');

import {convert} from '../prices';

module.exports.generate = async function generate(dollarAmount, accountId) {

  let account = await Account.findOne({ where: { id: accountId }});

  let address = (await Address.findOne({ where: {account_id:accountId, currency:'DOGE'}})).value

  if (!account || !account.dogecoin_address) {
    throw new Error('no dogecoin payout address');
  }

  let address = await DogecoinAddressService
    .getNewAddress(dollarAmount, account.dogecoin_address)

  console.log('dogecoin address generated', address);

  let denominationAmount = {
    currency: 'USD',
    value: dollarAmount
  };

  let invoiceAmount = await convert(denominationAmount, 'DOGE');

  let invoice = await Invoice.create({
    address: address,
    amount: invoiceAmount.value,
    currency: invoiceAmount.currency,
    dollar_amount: denominationAmount.value,
    account_id: accountId,
    status: 'unpaid'
  });

  return invoice;
}
