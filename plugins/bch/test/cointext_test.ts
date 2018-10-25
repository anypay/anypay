import {generateCoinTextInvoice} from '../index';

require('dotenv').config();

import * as assert from 'assert';

describe("Cointext invoices", () => {

  it ("should return an object with payment details", async () => {

    let address = 'bitcoincash:qr0q67nsn66cf3klfufttr0vuswh3w5nt5jqpp20t9';

    let invoice =  await generateCoinTextInvoice(address, 46000, 'BCH')

    //    assert(invoice.network, 'main')

    });

})
