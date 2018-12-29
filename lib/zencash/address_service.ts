import { Address } from "../models";
import * as zen from "../../plugins/zen";
import { log } from '../logger';

export async function getNewAddress (accountId)  {

  // return zencash t_address for account
  log.info('zencash:getnewaddress', `accountId:${accountId}`);

  var isEncrypted = false;

  let address = await Address.findOne({ where: {
    currency: "ZEN",
    account_id: accountId
  }});

  log.info('forwarding address found', address.value);

  if (!address) {
    throw new Error('no ZEN address');
  }
  if (isEncrypted) {
    throw new Error('zencash shielded addresses are not yet supported');
  }

  let invoiceAddress = await zen.generateInvoiceAddress(address.value);

  // FIXME: generate a new t-address for each transaction
  return invoiceAddress;
}
