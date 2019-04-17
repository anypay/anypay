import {validateAddress} from '../index';
const assert = require("assert");

describe("Validating addresses", () => {

  it ("should return true for valid address", async () => {

    let address = 'RFFABGPdXjRoqLxX36BxnPmTCSWTpZzq7C';

    let valid = await validateAddress(address);

    assert(valid);

  });

});
