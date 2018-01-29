const Invoice = require('../models/invoice');
const Account = require('../models/account');

const EtherPrice = require('./price');

module.exports.generate = async function generate(dollarAmount, accountId) {

  let account = await Account.findOne({ where: { id: accountId }})
  
  if (!account || !account.ethereum_address) {
    reject(new Error('no ethereum address set'));
    return
  }

  let etherAmount = await EtherPrice.convertDollarsToEther(dollarAmount);

  let invoice = await Invoice.create({
    address: account.ethereum_address,
    amount: etherAmount.toFixed(5),
    currency: 'ETH',
    dollar_amount: dollarAmount,
    account_id: accountId,
    status: 'unpaid'
  });

  return invoice;
}
