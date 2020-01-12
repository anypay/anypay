
import { RPCSimpleWallet } from './rpc-simple-wallet';

let bchWallet = new RPCSimpleWallet('BCH', process.env.BCH_SOURCE_ADDRESS);
let dashWallet = new RPCSimpleWallet('DASH', process.env.DASH_SOURCE_ADDRESS);

interface SendOptions {
  currency: string,
  address: string,
  amount: number
}

import * as dashrpc from './dash/jsonrpc';
import * as bchrpc from './bch/jsonrpc';

export async function sendToAddress(options: SendOptions): Promise<string> {

  var resp;

  switch(options.currency) {

    case 'DASH':

      resp = await dashrpc.rpc.call('sendtoaddress', [options.address, options.amount]);

      break;

    case 'BCH':

      resp = await bchrpc.rpc.call('sendtoaddress', [options.address, options.amount]);

      break;

    default:

      throw new Error(`sendToAddress unsupported currency ${options.address}`);
  }

  return resp;

}


