const uuid = require('uuid');
const DashCore = require('./dashcore');
const Blockcypher = require('./blockcypher');
const Invoice = require('./models/invoice');

module.exports.generate = function generate(amount) {

  return DashCore.getNewAddress().then(address => {
  	console.log('dash address generated', address);

  	return Invoice.create({
			uid: uuid.v4(),
      address: address,
			amount: amount,
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
