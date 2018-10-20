
require('dotenv').config();

import * as assert from 'assert';

import { forwards } from '../../lib';

describe("Payment Forwards", () => {

  it('createPaymentForward should map one address to another', async () => {

    try {

    let paymentForward = await forwards.createPaymentForward({

      input: {

        currency: 'BCH',

        address: 'bitcoincash:qq3p66r7xkhtw2kcdspw9dl65x8nd0ntzcd0kczxyy'

      },

      output: {

        currency: 'BCH',

        address: 'bitcoincash:qrup980ejnvjk8v8vawt5w59nc8nk08d6gc0nvylht'

      }

    });

    } catch(error) {

      console.log("error", error.message);

    }

  });

  it('getPaymentForwardByInput should get a payment forward that was setup', async () => {

    await forwards.createPaymentForward({

      input: {

        currency: 'BCH',

        address: 'bitcoincash:qq3p66r7xkhtw2kcdspw9dl65x8nd0ntzcd0kczxyy'

      },

      output: {

        currency: 'BCH',

        address: 'bitcoincash:qrup980ejnvjk8v8vawt5w59nc8nk08d6gc0nvylht'

      }

    });

    let paymentForward = await forwards.getPaymentForwardByInput({

      currency: 'BCH',

      address: 'bitcoincash:qq3p66r7xkhtw2kcdspw9dl65x8nd0ntzcd0kczxyy'

    });

    assert.strictEqual(paymentForward.output_currency, 'BCH');

    assert.strictEqual(paymentForward.output_address, 'bitcoincash:qrup980ejnvjk8v8vawt5w59nc8nk08d6gc0nvylht');

  });

});

