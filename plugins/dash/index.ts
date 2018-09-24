import {generateInvoice} from '../../lib/invoice';
import * as chainSoAPI from '../../lib/chainSoAPI';
import {Invoice} from '../../types/interfaces';
export async function createInvoice(accountId: number, amount: number) {

  let invoice = await generateInvoice(accountId, amount, 'DASH');

  return invoice;

}

export async function checkAddressForPayments(address:string, currency:string){
  let payments = await chainSoAPI.checkAddressForPayments(address,currency);

  return payments;
}
