const Invoice = require('../models/invoice');
const Account = require('../models/account');
const DashAddressService = require('./forwarding_address_service');

const DashPrice = require('./price');

module.exports.generate = function generate(dollarAmount, accountId) {
  return new Promise((resolve, reject) => {

    return Account.findOne({ where: { id: accountId }}).then(account => {

      if (!account || !account.dash_payout_address) {
        reject(new Error('no dash payout address'));
        return
      }

      console.log('about to genereate dash address')

      return DashAddressService
        .getNewAddress(dollarAmount, account.dash_payout_address).then(address => {

        console.log('dash address generated', address);

        let dashAmount = DashPrice.convertDollarsToDash(dollarAmount).toFixed(5);

        return Invoice.create({
          address: address,
          amount: dashAmount,
          currency: 'DASH',
          dollar_amount: dollarAmount,
          account_id: accountId,
          status: 'unpaid'
        })
        .then(resolve)
      });
    });
  });
}
