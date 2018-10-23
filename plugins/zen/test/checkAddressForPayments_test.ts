import {checkAddressForPayments} from '../index';

require('dotenv').config();

describe("Checking address for payments", () => {

  it ("should return an array of payments", async () => {

    let address = 'nULcqNeDi97AgBHMHe2vtqrvVfHUGvQmuF';

    let payments = await checkAddressForPayments(address, 'ZEN');

    console.log(payments);

  });

});

