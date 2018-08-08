import {generateInvoice} from '../../lib/invoice';

export async function createInvoice(accountId: number, amount: number) {

  let invoice = await generateInvoice(accountId, amount, 'ZEN');

  return invoice;

}

