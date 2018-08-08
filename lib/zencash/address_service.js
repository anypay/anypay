const Account = require("../models/account");

module.exports.getNewAddress = async (accountId) => {
  // return zencash t_address for account
  console.log('zencash:getnewaddress', `accountId:${accountId}`);
  var isEncrypted = false;

  let address = await Address.findOne({ where: {
    currency: "ZEN",
    account_id: accountId
  }});

  if (!address) {
    throw new Error('no ZEN address');
  }
  if (isEncrypted) {
    throw new Error('zencash shielded addresses are not yet supported');
  }

  // FIXME: generate a new t-address for each transaction
  return address.value;
}
