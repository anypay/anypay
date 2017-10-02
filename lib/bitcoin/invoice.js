const Invoice = require('../models/invoice');
const Account = require('../models/account');
const BitcoinAddressService = require('./address_service');

const BitcoinPrice = require('./price');

module.exports.generate = function generate(dollarAmount, accountId) {
  return new Promise((resolve, reject) => {

    console.log('bitcoin:invoice:generate', dollarAmount, merchantAddress);

    return Account.findOne({ where: { id: accountId }}).then(account => {

      if (!account || !account.bitcoin_payout_address) {
        reject(new Error('no bitcoin payout address'));
        return
      }

      return BitcoinAddressService
        .getNewAddress(dollarAmount, account.bitcoin_payout_address).then(address => {

        console.log('bitcoin address generated', address);

        let bitcoinAmount = BitcoinPrice.convertDollarsToBitcoin(dollarAmount).toFixed(5);

        return Invoice.create({
          address: address,
          amount: bitcoinAmount,
          currency: 'BTC',
          dollar_amount: dollarAmount,
          account_id: accountId,
          status: 'unpaid'
        });
      });
    });
  });
}
