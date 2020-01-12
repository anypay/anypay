#!/usr/bin/env ts-node

var rpc = require('../lib/dashd_rpc').rpc;

(async function() {

  let address = 'XnUfgT385jsAA1NyPWJSnN4pYEihGXfJB9';
  let amount = 0.001;

  try {

    let payment = await rpc.sendToAddressAsync(address, amount);

    console.log('payment', payment);

  } catch(error) {

    console.error(error.message);
  }

})();

