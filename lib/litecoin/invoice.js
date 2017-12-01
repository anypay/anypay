const Invoice = require('../models/invoice');
const Account = require('../models/account');
const LitecoinAddressService = require('./address_service');

const LitecoinPrice = require('./price');

module.exports.generate = function generate(dollarAmount, accountId) {
  return new Promise((resolve, reject) => {

    return Account.findOne({ where: { id: accountId }}).then(account => {

      if (!account || !account.litecoin_address) {
        reject(new Error('no litecoin payout address'));
        return
      }

      return LitecoinAddressService
        .getNewAddress(dollarAmount, account.litecoin_address).then(address => {

        console.log('litecoin address generated', address);

        let litecoinAmount = LitecoinPrice.convertDollarsToLitecoin(dollarAmount).toFixed(5);

        return Invoice.create({
          address: address,
          amount: litecoinAmount,
          currency: 'LTC',
          dollar_amount: dollarAmount,
          account_id: accountId,
          status: 'unpaid'
        })
        .then(resolve)
      });
    });
  });
}
