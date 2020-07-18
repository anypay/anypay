
import * as postgres from './postgres';

export async function findByUid(uid: string) {

  let invoices = (await postgres('invoices')
               .select('id', 'uid', 'address', 'hash', 'amount', 'account_id', 'currency', 'cashback_amount', 'status')
               .where('uid', uid)
               .limit(1));

  console.log('cashback.invoice', invoices);

  let invoice = invoices[0];

  invoice.cashback_amount = parseFloat(invoice.cashback_amount);

  if (!invoice) {
    throw new Error(`invoice ${uid} not found`);
  }

  return invoice;

}

export async function findById(id: string) {

  let invoice = (await postgres('invoices')
               .select('id', 'uid', 'address', 'hash', 'amount', 'account_id',
               'dollar_amount', 'currency', 'cashback_amount', 'status')
               .where('id', id)
               .limit(1))[0];

  invoice.cashback_amount = parseFloat(invoice.cashback_amount);

  if (!invoice) {
    throw new Error(`invoice ${id} not found`);
  }

  return invoice;

}
