import {checkAddressForPayments} from '../index';

require('dotenv').config();

describe("Checking address for payments", () => {

  it ("should return an array of payments", async () => {

    let address = 'qzlsfelte09gf5n6z93rt2zly6k7ehrdectwpvnakg';

    let payments = await checkAddressForPayments(address, 'BCH');

    console.log(payments);

  });

});
