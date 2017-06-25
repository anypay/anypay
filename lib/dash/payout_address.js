const Account = require('../models/account');
const bitcore = require('bitcore-lib-dash');

module.exports.save = (account_id, address) => {

  if (bitcore.Address.isValid(address)) {

    return Account.update({ dash_payout_address: address }, {
      where: { id: account_id }
    });

  } else {
    console.log('invalid dash address', address);

    return Promise.reject(new Error('invalid dash address'));
  }
}

