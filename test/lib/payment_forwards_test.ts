
require('dotenv').config();

import * as assert from 'assert';

import { forwards } from '../../lib';

import { log } from '../../lib/logger';

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

  describe("PaymentForwardInputPayments", () => {

    it("#createPaymentForwardInputPayment should correspond to a payment forward", async () => {

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

      let inputPayment = await forwards.createPaymentForwardInputPayment(paymentForward.id, {

        txid: '6019d678fccb6248a770aa2c4e16af0b299c09265ac6425a53105438258759b8',

        amount: 0.15

      });

    });

    it('should enforce uniqueness of txid and payment forward id', async () => {

      let paymentForward = await forwards.createPaymentForward({

        input: {

          currency: 'BCH',

          address: 'bitcoincash:qrf5fpq8ww88t0xd08m0hkr755dyf9chrcuvd3z2ma'

        },

        output: {

          currency: 'BCH',

          address: 'bitcoincash:qrup980ejnvjk8v8vawt5w59nc8nk08d6gc0nvylht'

        }

      });

      await forwards.createPaymentForwardInputPayment(paymentForward.id, {
  
        txid: '20add632d522b8b6976f6ac41635dc7d849e715d8774a325a39e5ae3df9fd003',

        amount: 1

      });

      try {

        await forwards.createPaymentForwardInputPayment(paymentForward.id, {
    
          txid: '20add632d522b8b6976f6ac41635dc7d849e715d8774a325a39e5ae3df9fd003',

          amount: 1

        });

        assert(false, 'duplicate inputs for same txid must be prevented');

      } catch(error) {

        assert(error.message, 'duplicate inputs for same txid must be prevented');

      }

    });

  });
  
  describe("PaymentForwardOutputPayments", () => {

    it("#createPaymentForwardOutputPayment should correspond to an input payment", async () => {

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

      let inputPayment = await forwards.createPaymentForwardInputPayment(paymentForward.id, {

        txid: '6019d678fccb6248a770aa2c4e16af0b299c09265ac6425a53105438258759b8',

        amount: 0.15

      });

      let outputPayment = await forwards.createPaymentForwardOutputPayment(
        
        paymentForward.id,

        inputPayment.id,

        { 
          amount: 0.1499,

          txid: '174ea20ae20dcbc8b8bd0490be7a6473027526e4226c96d90c491947457f801c'

        }

      );

      assert(outputPayment.id, 'output payment record should be created with id');

    });

  });

});

