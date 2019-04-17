import {validateAddress} from '../index';
const assert = require("assert");

describe("Validating addresses", () => {

  it ("should return true for valid address", async () => {

    let address = '3QkqctrHKw3m97gLSuWjBZWnGes5HRyHo8';

    let valid = validateAddress(address);

    assert(valid);

  });

});
