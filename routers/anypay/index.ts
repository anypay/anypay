import {convert} from '../../lib/prices';
import {models} from '../../lib';
import {plugins} from '../../lib/plugins';
import {getNewInvoiceAddress, applyScalar} from '../../lib/invoice';
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

  let accountAddress = await models.Address.findOne({
    where: {
      currency: route.output_currency,
      account_id: route.account_id
    }
  });

  let address: any = await getNewInvoiceAddress(invoice.account_id, route.input_currency);

  let amount = await convert({
    currency: invoice.denomination_currency,
    value: invoice.denomination_amount,
  }, route.input_currency);


  if (accountAddress.price_scalar) {
    amount = applyScalar(amount, accountAddress.price_scalar)
  }

  let uri = computeInvoiceURI({
    currency: route.input_currency,
    uid: invoice.uid
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

