
import { models } from '../../lib';
import * as moment from 'moment';
import * as assert from 'assert';

import * as bch from 'bitcore-lib-cash';
import * as dash from 'bitcore-lib-dash';

var keys = {
  BCH: new bch.PrivateKey(),
  DASH: new dash.PrivateKey()
}

describe('Address Routes model', () => {

  var bchAddress = keys['BCH'].toAddress().toString();
  var dashAddress = keys['DASH'].toAddress().toString();

  it("should accept input and output", async () => {

    let now = moment();

    let addressRoute = await models.AddressRoute.create({

      input_currency: 'DASH',

      input_address: dashAddress,

      output_currency: 'BCH',

      output_address: bchAddress,

    });

    assert(addressRoute.id > 0);
    assert.strictEqual(addressRoute.input_currency, 'DASH');
    assert.strictEqual(addressRoute.output_currency, 'BCH');
    assert.strictEqual(addressRoute.output_address, bchAddress);
    assert.strictEqual(addressRoute.input_address, dashAddress);

  });

  it("should optionally accept an expires date", async () => {

    let now = moment();
    let expires = now.add(30, 'days');

    let addressRoute = await models.AddressRoute.create({

      input_currency: 'DASH',

      input_address: dashAddress,

      output_currency: 'BCH',

      output_address: bchAddress,

      expires

    });

    assert(addressRoute.id > 0);
    assert(addressRoute.expires);
    assert.strictEqual(addressRoute.input_currency, 'DASH');
    assert.strictEqual(addressRoute.output_currency, 'BCH');
    assert.strictEqual(addressRoute.output_address, bchAddress);
    assert.strictEqual(addressRoute.input_address, dashAddress);

  });

  it("should fail without correct input, output", async () => {

    try {

      let addressRoute = await models.AddressRoute.create({

        input_currency: 'DASH',

        input_address: dashAddress,

        output_currency: 'BCH'

      });

    } catch(error) {

      console.error(error.message);

    }

    try {

      let addressRoute = await models.AddressRoute.create({

        input_currency: 'DASH',

        input_address: dashAddress,

        output_address: bchAddress

      });

    } catch(error) {

      console.error(error.message);

    }

    try {

      let addressRoute = await models.AddressRoute.create({

        input_currency: 'DASH',

        output_currency: 'BCH',

        output_address: bchAddress,

      });

    } catch(error) {

      console.error(error.message);

    }

    try {

      let addressRoute = await models.AddressRoute.create({

        input_address: dashAddress,

        output_currency: 'BCH',

        output_address: bchAddress,

      });

    } catch(error) {

      console.error(error.message);

    }

  });

  describe("Static Address Routes", () => {

    it("should allow static to be true, default to false", async() => {

      let dashAddr1 = new dash.PrivateKey().toAddress().toString();
      let dashAddr2 = new dash.PrivateKey().toAddress().toString();

      let addressRoute = await models.AddressRoute.create({

        input_currency: 'DASH',

        input_address: dashAddr1,

        output_currency: 'DASH',

        output_address: dashAddr2,

        is_static: true

      });

      assert(addressRoute.is_static);

    });

  });
  
});

