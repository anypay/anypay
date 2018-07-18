const Account = require("../models/account");
import {generateInvoiceAddress} from '../../plugins/bch';

module.exports.getNewAddress = async (accountId) => {

  console.log('bitcoincash:getnewaddress', `accountId:${accountId}`);

  const account = await Account.findOne({ where: { id: accountId }});

  if (!account) {

    throw new Error('no matching account');

  }

  if (!account.bitcoin_cash_address) {

    throw new Error('no bitcoin cash address');

  }

  let settlementAddress = account.bitcoin_cash_address;

  let invoiceAddress = await generateInvoiceAddress(settlementAddress);

  return invoiceAddress;

}
