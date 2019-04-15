import {validateAddress} from '../index';
const assert = require("assert");

describe("Validating addresses", () => {

  it ("should return true for valid address", async () => {

    let address = 'Xyja8PS1aLgkCpatqZB6sYEuPUsSc5NYxF';

    let valid = validateAddress(address);

    assert(valid);

  });

});
