const Account = require("../models/account");
const Address = require("../models/address");
import {generateInvoiceAddress} from '../../plugins/xrp';

export async function getNewAddress (accountId) { 

  let address = await generateInvoiceAddress(accountId)

  return address 

}
