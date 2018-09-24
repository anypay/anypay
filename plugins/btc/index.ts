import {generateInvoice} from '../../lib/invoice';
import {checkAddressForPayments} from '../../lib/chainSoAPI';
import {Invoice} from '../../types/interfaces';
export async function createInvoice(accountId: number, amount: number) {

  let invoice = await generateInvoice(accountId, amount, 'DASH');

  return invoice;

}

export async function getAddressPayments(invoice:Invoice){
  let payments = await checkAddressForPayments(invoice);

  return payments;
}
