
import {rpc} from './jsonrpc';

import * as _ from 'lodash'

export async function sendFromAddress(source: string, destination: string, amount: number) { 

  let unspent = (await rpc.call('listunspent', [0])).result;

  let matchingUnspent = _.filter(unspent, u => {
    return u.address === source;
  });

  let toSpend = [];

  let sum = 0;

  //const fee = 0.00001;
  const fee = 0.00010;

  matchingUnspent.forEach(u => {

    if ((amount + fee) > sum) {

      sum += u.amount; 

      toSpend.push(u);

    }

  });

  let inputs = toSpend.map(u => {
    return {
      txid: u.txid,
      vout: u.vout
    }
  });

  let outputs = {};
  outputs[source] = sum - fee - amount; 
  outputs[destination] = amount;

  let rawtx = (await rpc.call('createrawtransaction', [inputs, outputs])).result;

  var signedtx = (await rpc.call('signrawtransaction', [rawtx])).result;

  let tx = await rpc.call('sendrawtransaction', [signedtx.hex]);

  return tx;

}
