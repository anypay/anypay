const Account = require("../models/account");
const Address = require("../models/address");
import {generateInvoiceAddress} from '../../plugins/xrp';

module.exports.getNewAddress = async (accountId) => {

  let address = await Address.findOne({ where: {
	  currency: 'XRP',
	  account_id: accountId
  }});

  if (!address) {

    throw new Error('no XRP address');

  }

  let settlementAddress = address.value;

  return settlementAddress;

}
