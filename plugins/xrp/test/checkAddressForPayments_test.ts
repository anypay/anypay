require('dotenv').config();

import {checkAddressForPayments} from '../index';

require('dotenv').config();

describe("Checking address for payments", () => {

  it ("should return an array of payments", async () => {

    let address = 'r3pzYrVu7oruSJh1jhACmb6wRDkTWVw1JJ';

    let payments = await checkAddressForPayments(address, 'XRP');

    console.log(payments);

  });
  it ("should return an array of payments", async () => {

    let address = 'rQay7bQ3XoZcT6E3c8uDopZdnWaMBxWea2';

    let payments = await checkAddressForPayments(address, 'XRP');

    console.log(payments);

  });

});
  


