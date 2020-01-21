require('dotenv').config();

const BigNumber: any = require('bignumber.js');

import { sendtoaddress } from '../../lib/wallet';

const jayson = require('jayson');

export async function start() {

  const server = jayson.server({

    getbalance: async function(args, callback) {
      console.log('getbalance', args);

      callback(null, 1);

    },
    sendtoaddress: async function(args, callback) {
      console.log('sendtoaddress', args);

      try {

        let result = await sendtoaddress(args[0], args[1]);

        callback(null, result);

      } catch(error) {

        callback(error);

      }

    }
  });

  server.http().listen(process.env.VENDING_BSV_JSON_RPC_PORT);

}

if (require.main === module) {

  start();

}
