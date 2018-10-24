import {generateInvoice} from '../../lib/invoice';

import {client} from '../../lib/statsd'

export async function createInvoice(accountId: number, amount: number) {
  
  let start = new Date().getTime()

  let invoice = await generateInvoice(accountId, amount, 'XRP');
  
  client.timing('XRP_createInvoice', new Date().getTime()-start)

  client.increment('XRP_createInvoice')

  return invoice;

}
