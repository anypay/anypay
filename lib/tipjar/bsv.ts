
const BigNumber = require('bignumber.js');

import { rpc } from '../../plugins/bsv/lib/jsonrpc';

export async function getAddressBalance(address: string): Promise<number> {

  let resp = await rpc.call('listunspent', [0, 1000000, [address]]);

  console.log(resp);

  return resp.result.reduce((sum, utxo) => {

    let nAmount = BigNumber(utxo.amount);

    return sum.plus(nAmount);
  
  }, BigNumber(0)).toNumber();

}
