module.exports.getNewAddress = async (accountId, isEncrypted) => {
  // return zcash t_address for account
  console.log('zcash:getnewaddress', `accountId:${accountId} encrypted:${isEncrypted}`);

  const account = await Account.findOne({ where: { id: accountId }});
  if (!account) {
    throw new Error('no matching account');
  }
  if (isEncrypted) {
    throw new Error('zcash shielded addresses are not yet supported');
  }
  if (!account.zcash_t_address) {
    throw new Error('no zcash payout address');
  }

  // FIXME: generate a new t-address for each transaction
  return account.zcash_t_address;
}

