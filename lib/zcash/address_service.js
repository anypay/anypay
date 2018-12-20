const Address = require("../models/address");

module.exports.getNewAddress = async (accountId) => {
  // return zcash t_address for account
  

  // FIXME: generate a new t-address for each transaction
  return (await Address.findOne({where:{account_id:accountId, currency:'ZEC'}})).value
}
