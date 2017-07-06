const uuid = require('uuid');
const DashCore = require('./dashcore');
const Blockcypher = require('./blockcypher');
const Invoice = require('./models/invoice');

const DashPrice = require('./dash/price');

module.exports.generate = function generate(options) {

  return DashCore.getNewAddress().then(address => {
  	console.log('dash address generated', address);

    let dashAmount = DashPrice.convertDollarsToDash(options.dollar_amount).toFixed(5);

  	return Invoice.create({
      address: address,
			amount: dashAmount,
			account_id: options.account_id,
			status: 'unpaid'
		})
		.then(invoice => {

			return Blockcypher.createWebhook(address).then(() => {
				console.log('blockcypher webhook created', address);	

				return invoice;
			});
		});
  });
};
