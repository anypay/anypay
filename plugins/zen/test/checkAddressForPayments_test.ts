import {checkAddressForPayments} from '../index';

require('dotenv').config();

describe("Checking address for payments", () => {

  it ("should return an array of payments", async () => {

    let address = 'znTxg7ux8LSRLBCowM4bMLjVqX5Gaw4irwZ';

    let payments = await checkAddressForPayments(address, 'ZEN');

    console.log(payments);

  });

});

