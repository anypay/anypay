import {getLegacyAddressFromCashAddress} from '../lib/bitbox';

require('dotenv').config();

import * as assert from 'assert';

describe("Converting Bitcoin cash addresses", () => {

  it ("should return an legacy address from a cash address", () => {

    let address = 'bitcoincash:qr0q67nsn66cf3klfufttr0vuswh3w5nt5jqpp20t9';

    let legacy = getLegacyAddressFromCashAddress(address);

    assert(legacy, '1MF7A5H2nHYYJMieouip2SkZiFZMBKqSZe')
    
    });

  it ("should return legacy address from a legacy address", () => {

    let address = '1MF7A5H2nHYYJMieouip2SkZiFZMBKqSZe';

    let legacy = getLegacyAddressFromCashAddress(address);

    assert(legacy, address)

  });

});
