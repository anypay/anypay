require('dotenv').config();
const Bluebird = require("bluebird");

var RpcClient = require('bitcoind-rpc-dash');

var config = {
  protocol: process.env.DASH_SSL ? 'https': 'http',
  user: process.env.DASH_RPC_USER,
  pass: process.env.DASH_RPC_PASSWORD,
  host: process.env.DASH_RPC_HOST,
  port: process.env.DASH_RPC_PORT
};

var rpc = Bluebird.promisifyAll(new RpcClient(config));

export {
  rpc
}


