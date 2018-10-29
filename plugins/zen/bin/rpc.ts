#!/usr/bin/env ts-node

require("dotenv").config();

var commander = require('commander');

var JSONRPC = require('../lib/jsonrpc');

var rpc = new JSONRPC();

commander
  .command('getnewaddress')
  .action(async () => {

    let resp = await rpc.call('getnewaddress'); 

    console.log(resp);

  });

commander
  .command('getbalance [confirmations]')
  .action(async (confirmations) => {

    let resp = await rpc.call('getbalance', ["", parseFloat(confirmations) || 1]); 

    console.log(resp);

  });

commander.parse(process.argv);

