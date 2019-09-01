
import * as assert from 'assert';

import { transformAddress } from '../';

describe("Transforming Phone Number to DASH Address with DashText API", () => {

  it("should transform Steven's number to an address", async () => {

    const phone = '14154072789';

    let address = await transformAddress(phone);

    assert.strictEqual(address, 'bitcoincash:qqfe5wl2ky9dm63nyw4zer6kr59qunns9yxsszte9j');

  });

  it("should leave a normal bitcoin cash address alone", async () => {

    let address = 'XtoGraizYXDfLeUnzrc98QniXVU41kXeYS';

    assert.strictEqual(await transformAddress(address), address);

  });

});

