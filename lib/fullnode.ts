
import * as bsvRpc from '../plugins/bsv/lib/jsonrpc';
import * as bchRpc from '../plugins/bch/lib/jsonrpc';
import * as dashRpc from '../plugins/dash/lib/jsonrpc';
import * as btcRpc from '../plugins/btc/lib/jsonrpc';

import { log } from './logger';

function getRpc(currency: string) {

  switch(currency) {
    case 'BCH':
      return bchRpc.rpc;
    case 'BSV':
      return bsvRpc.rpc;
    default:
      throw new Error(`rpc not supported for currency ${currency}`);
  }
}

export async function importAddress(currency: string, address: string) {
  log.info('fullnode.importaddress', { currency, address });

  let rpc = getRpc(currency);

  let resp = await rpc.call('importaddress', [address, "anypay.tipjar", false]);

  console.log(resp);
}

