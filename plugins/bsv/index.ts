
import { rpc } from './lib/jsonrpc';

export async function getNewAddress(outputAddress: string) {

  let address = await rpc.call('getnewaddress', []);

  return address.result;

}

export {

  name: "Bitcoin SV",

  code: "BSV",

  icon: "https://upload.wikimedia.org/wikipedia/commons/c/c1/Bsv-icon-small.png"

}
