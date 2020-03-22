import {convert} from '../../lib/prices';
import {plugins} from '../../lib/plugins';
import {getNewInvoiceAddress} from '../../lib/invoice';

export async function createPaymentOption(invoice, route) {

  if (!plugins.findForCurrency(route.input_currency)) {
    return null;
  }

  let newAddress = await getNewInvoiceAddress(invoice.account_id, route.input_currency);

  let invoiceAmount = await convert({
    currency: invoice.denomination_currency,
    value: invoice.denomination_amount,
  }, route.input_currency);

}

