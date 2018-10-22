
import { log } from '../../../lib/logger';

import { forwards } from '../../../lib';

var JSONRPC = require('./jsonrpc');

var rpc = new JSONRPC();

export async function setupPaymentForward(outputAddress: string) {

  let result = await rpc.call('getnewaddress');

  log.info('bch.getnewaddress.result', result);

  let record = await forwards.createPaymentForward({

    input: {

      currency: 'BCH',

      address: result.result

    },

    output: {

      currency: "BCH",

      address: outputAddress

    }

  });

  return record;
  
}

