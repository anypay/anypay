const FeeConfig = require('../../lib/fee_config');
const fs = require("fs");
const assert = require('assert');

describe("FeeConfig", () => {

  it("should get fees from a config file", () => {

    var btcFee = FeeConfig.getForCurrency('BTC');

    const feesJson = JSON.parse(fs.readFileSync(__dirname+'/../../config/fees.json'));

    assert.strictEqual(btcFee, feesJson['fees']['BTC']);
  });

});
