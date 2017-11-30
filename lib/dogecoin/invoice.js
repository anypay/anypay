const Invoice = require('../models/invoice');
const Account = require('../models/account');
const DogecoinAddressService = require('./address_service');

const DogecoinPrice = require('./price');

module.exports.generate = function generate(dollarAmount, accountId) {
  return new Promise((resolve, reject) => {

    return Account.findOne({ where: { id: accountId }}).then(account => {

      if (!account || !account.dogecoin_address) {
        reject(new Error('no dogecoin payout address'));
        return
      }

      return DogecoinAddressService
        .getNewAddress(dollarAmount, account.dogecoin_address).then(address => {

        console.log('dogecoin address generated', address);

        let dogecoinAmount = DogecoinPrice.convertDollarsToDogecoin(dollarAmount).toFixed(5);

        return Invoice.create({
          address: address,
          amount: dogecoinAmount,
          currency: 'DOGE',
          dollar_amount: dollarAmount,
          account_id: accountId,
          status: 'unpaid'
        })
        .then(resolve)
      });
    });
  });
}
