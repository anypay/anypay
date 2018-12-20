const Account = require("../models/account");
const Address = require("../models/address");

import {generateInvoiceAddress} from '../../plugins/bch';

module.exports.getNewAddress = async (accountId) => {

  console.log('bitcoincash:getnewaddress', `accountId:${accountId}`);

  let address = await Address.findOne({ where: {
	  currency: 'BCH',
	  account_id: accountId
  }});

  if (!address) {

    throw new Error('no bitcoin cash address');

  }

  let settlementAddress = address.value;

  return settlementAddress;

}
