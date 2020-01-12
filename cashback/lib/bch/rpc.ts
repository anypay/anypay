require('dotenv').config();
const Bluebird = require("bluebird");

var RpcClient = require('bitcoind-rpc-dash');

var config = {
  protocol: 'http',
  user: process.env.BCH_RPC_USER,
  pass: process.env.BCH_RPC_PASSWORD,
  host: process.env.BCH_RPC_HOST,
  port: process.env.BCH_RPC_PORT
};

var rpc = Bluebird.promisifyAll(new RpcClient(config));

export {
  rpc
}


