#!/usr/bin/env ts-node

require('dotenv').config();

const JSONRPC = require('../lib/jsonrpc');

var rpc = new JSONRPC();

(async function() {

  try {

  let resp = await rpc.call('getrawtransaction', ['963be58fecd016694e2c8b6ed1b299ee1e003f0fa7349b69dd3e9b3c41176ac0']);

  console.log(resp);

  } catch(error) {

  console.error(error.message);

  }

})();

