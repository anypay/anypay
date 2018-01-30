const Chance = require('chance');
const bitcoreDash = require('bitcore-lib-dash');

const PaymentProcessor = require('../../lib/payment_processor');
const Invoice = require('../../lib/models/invoice');

describe("Handling Underpayment with PaymentProcessor", () => {

	const chance = new Chance();

	it("#handlePayment should update the invoice to be underpaid", async () => {
		const address = new DashAddress().toString();
		const amountPaid = 0.95;

		var invoice = await Invoice.create({
			dollar_amount: 1000,
			amount: 1,
			currency: 'DASH',
			address: address,
			account_id: chance.integer()
		});

		let payment = {
			amount: amountPaid,
			currency: 'DASH',
			address: address.toString()
		}

		invoice = await PaymentProcessor.handlePayment(invoice, payment);

		assert.strictEqual(invoice.amount_paid, amountPaid);
		assert.strictEqual(invoice.status, 'underpaid');
	});
});

class DashAddress {
	constructor() {
		var privateKey = new bitcoreDash.PrivateKey();

		return privateKey.toAddress();
	}
}

