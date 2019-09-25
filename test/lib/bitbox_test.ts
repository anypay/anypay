
import * as assert from 'assert';

import { getLegacyAddressFromCashAddress } from '../../plugins/bch/lib/bitbox';

describe("Bitbox", () => {

  it("should convert cash address to legacy address", () => {

    let cashaddress = 'bitcoincash:qzq0ytnx62d4u3lf0wdghde8qq325pldty8tzw2h7m';
    let legacyaddress = '1CkocbyTYpHvrz3tMD2gyBQWzCy8aQRCZp';

    assert.strictEqual(
      getLegacyAddressFromCashAddress(cashaddress),
      legacyaddress
    );

  });

});

