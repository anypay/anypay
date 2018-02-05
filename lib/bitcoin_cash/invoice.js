const Invoice = require('../models/invoice');
const Account = require('../models/account');
const BitcoinCashAddressService = require('./forwarding_address_service');
const Features = require('../features');
const log = require('winston');

const BitcoinCashPrice = require('./price');

module.exports.generate = async function generate(dollarAmount, accountId) {


  let account = await Account.findOne({ where: { id: accountId }})

  if (!account || !account.bitcoin_cash_address) {

    throw new Error('no bitcoin cash payout address');
  }

  let address = await BitcoinCashAddressService
    .getNewAddress(account.bitcoin_cash_address);

  let bitcoinCashAmount = BitcoinCashPrice
    .convertDollarsToBitcoinCash(dollarAmount)
    .toFixed(5);

  let invoice = await Invoice.create({
    address: address.input,
    amount: bitcoinCashAmount,
    currency: 'BCH',
    dollar_amount: dollarAmount,
    account_id: accountId,
    status: 'unpaid'
  });

  return invoice;
}
