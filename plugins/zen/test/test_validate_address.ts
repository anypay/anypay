import {validateAddress} from '../index';
const assert = require("assert");

describe("Validating addresses", () => {

  it ("should return true for valid address", async () => {

    let address = 'znd8rcAKaRyRqXZK4XRDFmnop1KwdT61Jkt';

    let valid = validateAddress(address);

    assert(valid);

  });

});
