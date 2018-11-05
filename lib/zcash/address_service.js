import * as models from '../models';
import * as zec from "../../plugins/zec";
import { log } from '../logger';



module.exports.getNewAddress = async (accountId) => {
  // return zcash t_address for account
  log.info('zec:getnewaddress', `accountId:${accountId}`);

  var isEncrypted = false;

  var account = await models.Account.findOne({ where: { id: accountId }});

  log.info('forwarding address found', account.zcash_t_address);

  if (!account.zcash_t_address) {
    throw new Error('no ZEC address');
  }
  if (isEncrypted) {
    throw new Error('zcash shielded addresses are not yet supported');
  }

  let invoiceAddress = await zec.generateInvoiceAddress(account.zcash_t_address);

   return invoiceAddress;
}
