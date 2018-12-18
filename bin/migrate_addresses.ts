
import * as lib from "../lib";

(async function() {

	let accounts = await lib.models.Account.findAll();

	for (let i=0; i<accounts.length; i++) {

		let account = accounts[i];

		await migrateAccountAddresses(account);

	}

})();

async function migrateAccountAddresses(account) {

	lib.log.info(`migrate addresses for ${account.email}`);
	
	let addresses = [
		{currency: 'BTC', value: account.bitcoin_payout_address},
		{currency: 'DASH', value: account.dash_payout_address},
		{currency: 'BCH', value: account.bitcoin_cash_address},
		{currency: 'LTC', value: account.litecoin_address},
		{currency: 'XRP', value: account.ripple_address},
		{currency: 'DOGE', value: account.dogecoin_address},
		{currency: 'ZEC', value: account.zcash_address}
	]

	
	for (let i=0; i<addresses.length; i++) {

		let address = addresses[i];

		if (address.value) {

			let record = await lib.models.Address.findOne({ where: {
				currency: address.currency,
				account_id: account.id
			}});

			if (!record) {

				await lib.models.Address.findOrCreate({ where: {
					currency: address.currency,
					value: address.value,
					account_id: account.id
				}});
			}
		}
	}

}
