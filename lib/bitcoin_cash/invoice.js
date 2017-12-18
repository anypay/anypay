const Invoice = require('../models/invoice');
const Account = require('../models/account');
const BitcoinCashAddressService = require('./forwarding_address_service');
const Features = require('../features');
const log = require('winston');

const BitcoinCashPrice = require('./price');

module.exports.generate = function generate(dollarAmount, accountId) {

  return new Promise((resolve, reject) => {

    return Account.findOne({ where: { id: accountId }}).then(account => {

      if (!account || !account.bitcoin_cash_address) {
        reject(new Error('no bitcoin cash payout address'));
        return
      }

      return BitcoinCashAddressService
        .getNewAddress(account.bitcoin_cash_address).then(address => {

          let bitcoinCashAmount = BitcoinCashPrice.convertDollarsToBitcoinCash(dollarAmount).toFixed(5);

          return Invoice.create({
            address: address.input,
            amount: bitcoinCashAmount,
            currency: 'BCH',
            dollar_amount: dollarAmount,
            account_id: accountId,
            status: 'unpaid'
          })
          .then(resolve)
        })
        .catch(error => {
          log.error('bitcoincash:address_service:error', error.message); 
        reject(error); 
        })
    });
  });
}
