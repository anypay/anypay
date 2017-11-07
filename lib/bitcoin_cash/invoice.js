const Invoice = require('../models/invoice');
const BitcoinCashAddressService = require('./address_service');

const BitcoinCashPrice = require('./price');

module.exports.generate = function generate(options) {
  console.log('bitcoin_cash:invoice:generate', options);

  return BitcoinCashAddressService.getNewAddress().then(address => {

  	console.log('bitcoin cash address generated', address);

    let bitcoinCashAmount = BitcoinCashPrice
      .convertDollarsToBitcoinCash(options.dollar_amount).toFixed(5);

  	return Invoice.create({
      address: address,
			amount: bitcoinCashAmount,
			currency: 'BCH',
			dollar_amount: options.dollar_amount,
			account_id: options.account_id,
			status: 'unpaid'
		});
  });
}
