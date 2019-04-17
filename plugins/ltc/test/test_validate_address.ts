import {validateAddress} from '../index';
const assert = require("assert");

describe("Validating addresses", () => {

  it ("should return true for valid address", async () => {

    let address = 'LgSJ24uV3VBDd3vLENnGT4gUhz5exk3178';

    let valid = validateAddress(address);

    assert(valid);

  });

});
