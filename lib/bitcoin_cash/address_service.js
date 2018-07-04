const Account = require("../models/account");

module.exports.getNewAddress = async (accountId) => {
  // return zcash t_address for account
  console.log('bitcoincash:getnewaddress', `accountId:${accountId}`);

  const account = await Account.findOne({ where: { id: accountId }});
  if (!account) {
    throw new Error('no matching account');
  }
  if (!account.bitcoin_cash_address) {
    throw new Error('no bitcoin cash address');
  }

  return account.bitcoin_cash_address;
}
