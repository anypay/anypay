
import { models } from '../../lib';
import * as moment from 'moment';
import * as assert from 'assert';

describe('Address Routes model', () => {

  var bchAddress = 'bitcoincash:qrzta75m5zp7x66ghfmnua7sf7vkkz5gqcznkdmqnw';
  var dashAddress = 'XhRQfmFYBKRGzPb8cP1opzZmotZCVQVRbf';

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
  
});

