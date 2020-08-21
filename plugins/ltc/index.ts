import {generateInvoice} from '../../lib/invoice';

const currency = 'LTC'

export async function createInvoice(accountId: number, amount: number) {

  return generateInvoice(accountId, amount, 'LTC');

}



export {

  currency

}

