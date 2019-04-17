import {validateAddress} from '../index';
const assert = require("assert");

describe("Validating addresses", () => {

  it ("should return true for valid address", async () => {

    let address = 'DPwx5u2dS2Qd2b34Ua3WmDycC7xenaNGh3';

    let valid = validateAddress(address);

    assert(valid);

  });

});
