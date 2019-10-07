
import * as assert from 'assert';

import { transformAddress } from '../';

describe("Transforming Phone Number to DASH Address with DashText API", () => {

  it("should transform Steven's number to an address", async () => {

    const phone = '14154072789';

    let address = await transformAddress(phone);

    assert.strictEqual(address, 'XvdKv8yF9KJy1VqVUZ4docMGN37kXBsKJV');

  });

  it("should transform a Venezuela number to an address", async () => {

    const phone = '584143274805';

    let address = await transformAddress(phone);

    console.log('address', address);

    assert(address);

  });

  it("should leave a normal dash address alone", async () => {

    let address = 'XtoGraizYXDfLeUnzrc98QniXVU41kXeYS';

    assert.strictEqual(await transformAddress(address), address);

  });

});

