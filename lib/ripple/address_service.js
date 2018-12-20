const Account = require("../models/account");
const Address = require("../models/address");
import {generateInvoiceAddress} from '../../plugins/xrp';

module.exports.getNewAddress = async (accountId) => {

  let address = await generateInvoiceAddress(accountId)

  return address 

}
