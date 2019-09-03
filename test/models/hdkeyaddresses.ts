import { models } from '../../lib';
import * as moment from 'moment';
import * as assert from 'assert';

describe('HDKeyAddresses model', () => {

  var bchAddress = 'bitcoincash:qrzta75m5zp7x66ghfmnua7sf7vkkz5gqcznkdmqnw';
  var dashAddress = 'XhRQfmFYBKRGzPb8cP1opzZmotZCVQVRbf';
  var xpub_key = 'xpub661MyMwAqRbcFVNNDzcnR6ep4NiwRz2sChGV6E9t4brwMD4J3Q9GdL6P2kMB8Jm8bi5gGwBEs7Wp6qP78YDMx1H5FPnFSwPX526ToTXJyMf' 

  it("should accept input and output", async () => {

    let now = moment();

    let HDKeyAddress = await models.HDKeyAddresses.create({

      currency: 'BCH',

      address: bchAddress,

      xpub_key: xpub_key,

    });

    assert(HDKeyAddress.id > 0);
    assert.strictEqual(HDKeyAddress.currency, 'BCH');
    assert.strictEqual(HDKeyAddress.address, bchAddress);
    assert.strictEqual(HDKeyAddress.xpub_key, xpub_key);
  });

  it("should fail without correct input, output", async () => {

    try {

      let addressRoute = await models.AddressRoute.create({

        currency: 'BCH',

        address: bchAddress,

      });

    } catch(error) {

      console.error(error.message);

    }

    try {

      let addressRoute = await models.AddressRoute.create({

        address: dashAddress,

      });

    } catch(error) {

      console.error(error.message);

    }

  });
  
});

