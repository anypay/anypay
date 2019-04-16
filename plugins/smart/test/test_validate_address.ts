import {validateAddress} from '../index';
const assert = require("assert");

describe("Validating addresses", () => {

  it ("should return true for valid address", async () => {

    let address = 'SgjWpg5aCiSBrdSwUiUtyCTn7m5CPuecb5';

    let valid = await validateAddress(address);

    assert.strictEqual(valid, true);

  });

});
