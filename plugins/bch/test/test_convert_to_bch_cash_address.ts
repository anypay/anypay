require('dotenv').config();

import * as assert from 'assert';

import {validateAddress} from '../';

describe("Validating / Converting Cash Address", () => {

  var legacy = '1BdkVQDarayLkj4YDxFDA8kzp53fq1ix4f';
  var qStyle = 'qp62fzf22uj2e8v3fu026s5fdf4ag5f2gye82jrd0t';

  var target = 'bitcoincash:qp62fzf22uj2e8v3fu026s5fdf4ag5f2gye82jrd0t';

  it("#validateAddress should return the same if valid", async () => {

    let address = await validateAddress(target);
    
    assert.strictEqual(address, target);
  
  });

  it("#validateAddress should convert if legacy style", async () => {

    let address = await validateAddress(legacy);

    assert.strictEqual(address, target);

    address = await validateAddress(qStyle);

    assert.strictEqual(address, target);
  
  });

});

