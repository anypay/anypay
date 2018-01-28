const Invoice = require('../models/invoice');
const Account = require('../models/account');

const EtherPrice = require('./price');

module.exports.generate = function generate(dollarAmount, accountId) {
  return new Promise((resolve, reject) => {

    return Account.findOne({ where: { id: accountId }}).then(account => {

      if (!account || !account.ethereum_address) {
        reject(new Error('no ethereum payout address'));
        return
      }

        let etherAmount = EtherPrice.convertDollarsToEther(dollarAmount).toFixed(5);

        return Invoice.create({
          address: account.ethereum_address,
          amount: etherAmount,
          currency: 'ETH
          dollar_amount: dollarAmount,
          account_id: accountId,
          status: 'unpaid'
        })
        .then(resolve)
    });
  });
}
