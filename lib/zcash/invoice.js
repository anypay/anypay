const Invoice = require('../models/invoice');
const ZcashAddressService = require('./address_service');

const ZcashPrice = require('./price');

module.exports.generate = function generate(options) {
  console.log('zcash:invoice:generate', options);

  return ZcashAddressService.getNewAddress(options.encrypted).then(address => {

  	console.log('zcash address generated', address);

    let zcashAmount = ZcashPrice.convertDollarsToZcash(options.dollar_amount).toFixed(5);

  	return Invoice.create({
      address: address,
			amount: zcashAmount,
			currency: 'ZEC',
			dollar_amount: options.dollar_amount,
			account_id: options.account_id,
			status: 'unpaid'
		});
  });
}
