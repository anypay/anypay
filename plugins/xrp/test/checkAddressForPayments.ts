require('dotenv').config();

import {checkAddressForPayments} from '../index';

require('dotenv').config();

describe("Checking address for payments", () => {

  it ("should return an array of payments", async () => {

    let address = 'rHaans8PtgwbacHvXAL3u6TG28gTAtCwr8';

    let payments = await checkAddressForPayments(address, 'XRP');

    console.log(payments);

  });

});
  
