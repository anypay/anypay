const Invoice = require('../models/invoice');
const ZcashAddressService = require('./address_service');

import {convert} from '../prices';

module.exports.generate = async function generate(options) {
  console.log('zcash:invoice:generate', options);

  let address = await ZcashAddressService.getNewAddress(options.account_id, options.encrypted);

  console.log('zcash address generated', address);

  let denominationAmount = {
    currency: 'USD',
    value: options.dollar_amount
  };

  let invoiceAmount = await convert(denominationAmount, 'ZEC');

  let invoice = Invoice.create({
    address: address,
    amount: invoiceAmount.value,
    currency: invoiceAmount.currency,
    dollar_amount: denominationAmount.value,
    account_id: options.account_id,
    status: 'unpaid'
  });

  return invoice;
}

