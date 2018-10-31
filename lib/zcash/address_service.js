import { Address } from "../models";
import * as zen from "../../plugins/zen";
import { log } from '../logger';



module.exports.getNewAddress = async (accountId) => {
  // return zcash t_address for account
  log.info('zencash:getnewaddress', `accountId:${accountId}`);

  var isEncrypted = false;

  const account = await Account.findOne({ where: { id: accountId }});
  
  let address = await Address.findOne({ where: {
    currency: "ZEC",
    account_id: accountId
  }});

  log.info('forwarding address found', address.value);

  if (!address) {
    throw new Error('no ZEC address');
  }
  if (isEncrypted) {
    throw new Error('zcash shielded addresses are not yet supported');
  }

  let invoiceAddress = await zec.generateInvoiceAddress(address.value);

  // FIXME: generate a new t-address for each transaction
   return invoiceAddress;
}
