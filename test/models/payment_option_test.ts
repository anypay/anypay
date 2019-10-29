
import * as assert from 'assert';

import * as uuid from 'uuid';

import { models } from '../../lib';

describe("Payment Option model", () => {

  it("should persist to the database", async () => {

    let record = await models.PaymentOption.create({
      invoice_uid: uuid.v4(),
      amount: 5,
      currency: 'BCH',
      address: 'bitcoincash:qre0g3fymuc29usz6e6hakqte8vn32acq5xjqnwv5s',
      uri: 'bitcoincash:qre0g3fymuc29usz6e6hakqte8vn32acq5xjqnwv5s?amount=5'
    });


    assert(record.id > 0);

  });

});

