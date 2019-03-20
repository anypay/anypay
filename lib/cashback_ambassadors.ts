
import { models, log } from './';
import { getAddress } from './accounts';

export async function getAmbassadorAddressForInvoice(invoiceUID: string) {
    
  let invoice = await models.Invoice.findOne({ where: {

    uid: invoiceUID

  }});

  if (!invoice) {

    throw new Error(`invoice ${invoiceUID} not found`);

  }

  let merchant = await models.CashbackMerchant.findOne({ where: {

    account_id: invoice.account_id

  }});

  if (merchant.ambassador_id) {

    let ambassador = await models.Ambassador.findOne({ where: {
    
      id: merchant.ambassador_id

    }});

    let ambassadorAccount = await models.Account.findOne({ where: {

      id: ambassador.id

    }});

    let address = await getAddress(ambassadorAccount.id, invoice.currency);

    return address;

  } else {

    log.error('no ambassador for merchant');

    return null;

  }


}
