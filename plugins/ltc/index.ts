import {generateInvoice} from '../../lib/invoice';

import * as blockchair from '../../lib/blockchair'

const currency = 'LTC'

export async function createInvoice(accountId: number, amount: number) {

  return generateInvoice(accountId, amount, 'LTC');

}

export async function getNewAddress(record) {
  return record.value;
}

export async function submitTransaction(rawTx: string) {

  return blockchair.publish('litecoin', rawTx)

}

export {

  currency

}

