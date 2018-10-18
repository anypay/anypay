
var JSONRPC = require('./lib/jsonrpc');

import {generateInvoice} from '../../lib/invoice';

var rpc = new JSONRPC();

export async function generateInvoiceAddress(settlementAddress: string): Promise<string> {

  let response = await rpc.call('validateaddress', [settlementAddress]);

  if (response.result.isvalid) {

    return response.result.address;

  } else {

    throw new Error(`invalid address ${settlementAddress}`);

  }

}

async function createInvoice(accountId: number, amount: number) {

  let invoice = await generateInvoice(accountId, amount, 'BCH');

  return invoice;

}

async function validateAddress(address: string): Promise<string> {

  let resp = await rpc.call('validateaddress', [address]);

  if (!resp.result.isvalid) {

    throw new Error('Invalid BCH address');

  }

  return resp.result.address;

}

const currency = 'BCH';

export {

  currency,

  createInvoice,

  validateAddress

};

