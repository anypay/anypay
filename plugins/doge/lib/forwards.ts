
import { log } from '../../../lib/logger';

import { models } from '../../../lib';

import { forwards } from '../../../lib';

var JSONRPC = require('./jsonrpc');

var rpc = new JSONRPC();

interface Payment {

  currency: string;

  amount: number;

  address: string;

  hash: string;

}

export async function setupPaymentForward(outputAddress: string) {

  let result = await rpc.call('getnewaddress');

  log.info('doge.getnewaddress.result', result);

  let record = await forwards.createPaymentForward({

    input: {

      currency: 'DOGE',

      address: result.result

    },

    output: {

      currency: "DOGE",

      address: outputAddress

    }

  });

  return record;
 
}
