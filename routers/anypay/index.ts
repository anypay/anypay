import {convert} from '../../lib/prices';
import {models} from '../../lib';
import {plugins} from '../../lib/plugins';
import {getNewInvoiceAddress} from '../../lib/invoice';
import { computeInvoiceURI } from '../../lib/uri';
import { writePaymentOption } from '../../lib/payment_options';

export async function createPaymentOption(invoice, route) {

  let account = await models.Account.findOne({
    where: {
      id: route.account_id
    }
  });

  if (!plugins.findForCurrency(route.input_currency)) {
    return null;
  }

  let address: any = await getNewInvoiceAddress(invoice.account_id, route.input_currency);

  let amount = await convert({
    currency: invoice.denomination_currency,
    value: invoice.denomination_amount,
  }, route.input_currency);

  let uri = computeInvoiceURI({
    currency: route.input_currency,
    amount: amount.value,
    address: address.value,
    business_name: account.business_name,
    image_url: account.image_url
  });

  let paymentOption = {
    
    invoice_uid: invoice.uid,

    address: address.value,

    amount: amount.value,

    currency: route.input_currency,

    uri
  }

  let record = await writePaymentOption(paymentOption);

  return record

}

