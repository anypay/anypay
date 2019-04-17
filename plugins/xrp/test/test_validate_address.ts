import {validateAddress} from '../index';
const assert = require("assert");

describe("Validating addresses", () => {

  it ("should return true for valid address", async () => {

    let address = 'r3kmLJN5D28dHuH8vZNUZpMC43pEHpaocV';

    let valid = validateAddress(address);

    assert(valid);

  });

});
