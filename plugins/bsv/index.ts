
import { rpc } from './lib/jsonrpc';

import {generateInvoice} from '../../lib/invoice';

import {statsd} from '../../lib/stats/statsd'

async function createInvoice(accountId: number, amount: number) {

  let start = new Date().getTime()

  let invoice = await generateInvoice(accountId, amount, 'BSV');

  statsd.timing('BSV_createInvoice', new Date().getTime()-start)

  statsd.increment('BSV_createInvoice')

  return invoice;

}

async function getNewAddress(outputAddress: string) {

  let address = await rpc.call('getnewaddress', []);

  return address.result;

}

const name = 'Bitcoin Satoshi Vision';

const currency = 'BSV';

const icon = "https://upload.wikimedia.org/wikipedia/commons/c/c1/Bsv-icon-small.png";

export {

  name,

  currency,

  icon,

  getNewAddress,

  createInvoice

}

