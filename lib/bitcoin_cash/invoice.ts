const Invoice = require('../models/invoice');
const Account = require('../models/account');
const BitcoinCashAddressService = require('./forwarding_address_service');
const AddressService = require('./address_service');
const Features = require('../features');
const log = require('winston');

import {convert} from '../prices';
import {oracles} from '../';

const BitcoinCashPrice = require('./price');

module.exports.generate = async function generate(dollarAmount, accountId) {

  let account = await Account.findOne({ where: { id: accountId }})

  if (!account || !account.bitcoin_cash_address) {

    throw new Error('no bitcoin cash payout address');
  }

  let oracle = oracles.getOracle('bitcoincash:forwarder');

  //let address = await oracle.registerAddress(account.bitcoin_cash_address)
  let address = await AddressService.getNewAddress(account.id);

  /*let bitcoinCashAmount = BitcoinCashPrice
    .convertDollarsToBitcoinCash(dollarAmount)
    .toFixed(5);
    */

  let bitcoinCashAmount = await convert({ currency: 'USD', value: dollarAmount }, 'BCH');

  let invoice = await Invoice.create({
    address: address,
    amount: bitcoinCashAmount.value,
    currency: 'BCH',
    dollar_amount: dollarAmount,
    account_id: accountId,
    status: 'unpaid'
  });

  return invoice;
}
