var JSONRPC = require('./lib/jsonrpc');

var rpc = new JSONRPC();

export async function generateInvoiceAddress(settlementAddress: string): Promise<string> {

  let response = await rpc.call('validateaddress', [settlementAddress]);

  if (response.result.isvalid) {

    return response.result.address;

  } else {

    throw new Error(`invalid address ${settlementAddress}`);

  }

}

