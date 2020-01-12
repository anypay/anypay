#!/usr/bin/env ts-node

var rpc = require('../lib/dashd_rpc').rpc;

(async function() {

  try {

    let balance = await rpc.getBalanceAsync("", "0");

    console.log('balance', balance);

  } catch(error) {

    console.error(error.message);
  }

})();

