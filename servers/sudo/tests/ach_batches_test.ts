
import { database, password } from '../../../lib';

import * as Chance from 'chance';
const chance = new Chance();


const sudoPassword = chance.word()

import {Server} from '../server';
import * as assert from 'assert';

describe("Ach Batches HTTP API", () => {
  var server;

  before(async () => {

    server = await Server();

  });

  describe("Recording an ACH Batch", () => {

    it("POST /api/ach_batches should record a batch", async () => {

      let batch_id = chance.integer({ min: 1000, max: 10000 });
      let effective_date = new Date();
      let amount = chance.floating();

      let response = await server.inject({
        method: 'POST',
        url: '/api/ach_batches',
        payload: {
          batch_id,
          effective_date,
          amount,
          type: 'ach',
          originating_account: '12345',
          currency: 'USD',
          batch_description: 'somedescription'
        },
        headers: {
          'Authorization': auth('sudopassword', "")
        }
      })

      console.log('result', response.result);

      assert(response.result.ach_batch.id > 0);
      assert.strictEqual(response.result.ach_batch.batch_id, batch_id);
      assert.strictEqual(response.result.ach_batch.amount, amount);

    });

  });

});

function auth(username, password) {
  return `Basic ${new Buffer(username + ':' + password).toString('base64')}`;
}

