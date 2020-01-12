#!/usr/bin/env ts-node

var rpc = require('../lib/dashd_rpc').rpc;

(async function() {

  try {

    let address = await rpc.getNewAddressAsync("");

    console.log('address', address);

  } catch(error) {

    console.error(error.message);
  }

})();

