const Invoice = require('../models/invoice');
const Account = require('../models/account');
const BitcoinAddressService = require('./address_service');
const BITCOIN_FEE_SATOSHIS = require('../blockcypher').BITCOIN_FEE;
const log = require('winston');

const BitcoinPrice = require('./price');

const BITCOIN_PROCESSING_FEE = (() => {
  const feeInBitcoin = BITCOIN_FEE_SATOSHIS * 0.00000001 // convert to bitcoin

  return feeInBitcoin;
})();

module.exports.generate = function generate(dollarAmount, accountId) {
  return new Promise((resolve, reject) => {

    return Account.findOne({ where: { id: accountId }}).then(account => {

      if (!account || !account.bitcoin_payout_address) {
        reject(new Error('no bitcoin payout address'));
        return
      }

      return BitcoinAddressService
        .getNewAddress(dollarAmount, account.bitcoin_payout_address).then(address => {

        console.log('bitcoin address generated', address);

        let bitcoinAmount = BitcoinPrice.convertDollarsToBitcoin(dollarAmount);

        const fee = BITCOIN_PROCESSING_FEE
        const amountWithFee = bitcoinAmount + fee;
        
        log.info('bitcoin:amount', {
          withoutFee: bitcoinAmount,
          fee,
          amountWithFee
        });

        return Invoice.create({
          address: address,
          amount: amountWithFee.toFixed(6),
          currency: 'BTC',
          dollar_amount: dollarAmount,
          account_id: accountId,
          status: 'unpaid'
        })
        .then(resolve)
      });
    });
  });
}
