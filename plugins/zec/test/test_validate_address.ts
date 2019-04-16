import {validateAddress} from '../index';
const assert = require("assert");

describe("Validating addresses", () => {

  it("should return true for valid address", async () => {

    let address = 't1PQAem4f1nK1gbXba8j4i1Cz4CuZpMySWx';

    let valid = await validateAddress(address);

    assert.strictEqual(valid, true);

  });

  it("should return true for valid z address", async () => {

    let address = 'zs1ls5rh33uxqhzq7lp0vtsdg0s64gffhrg8m0g3ya7562ld5d5zxyn8p8qv4w73exlpkf6cv4sk6p';

    let valid = await validateAddress(address);

    assert.strictEqual(valid,true);

  });
});
