import {Server} from '../../servers/rest_api/server';
import * as assert from 'assert';
import {hash} from '../../lib/password';

import { models, database } from '../../lib';

import * as Chance from 'chance';
const chance = new Chance();

describe("Setting Addresses Via REST", async () => {
  var accessToken, server;
  
  before(async () => {
    await database.sync();
    server = await Server();

    try {
      var account = await models.Account.create({
        email: chance.email(),
        password_hash: await hash(chance.word())
      })

      accessToken = await models.AccessToken.create({
        account_id: account.id
      })

    } catch(error) {
      console.error('ERROR', error.message);
    }
  });

  it("PUT /addresses/DASH should set the DASH address", async () => {
    try {

      var address = 'XojEkmAPNzZ6AxneyPxEieMkwLeHKXnte5';

      let response = await server.inject({
        method: 'PUT',
        url: '/addresses/DASH',
        payload: {
          address: address
        },
        headers: {
          'Authorization': auth(accessToken.uid, "")
        }
      })

      assert.strictEqual(response.result.value, address);

    } catch(error) {

      console.error('ERROR', error.message);
      throw error;
    }
  })

  it("PUT /addresses/BTC should set the BTC address", async () => {
    try {

      var address = '1KNk3EWYfue2Txs1MThR1HLzXjtpK45S3K';

      let response = await server.inject({
        method: 'PUT',
        url: '/addresses/BTC',
        payload: {
          address: address
        },
        headers: {
          'Authorization': auth(accessToken.uid, "")
        }
      })

      assert.strictEqual(response.result.value, address);

    } catch(error) {

      console.error('ERROR', error.message);
      throw error;
    }
  })

  it("PUT /addresses/xrp should set the XRP address", async () => {
    try {

      var address = 'raBmhBNmYFGe5hJ5Gez2MbpNspewctCAGv';

      let response = await server.inject({
        method: 'PUT',
        url: '/addresses/xrp',
        payload: {
          address: address
        },
        headers: {
          'Authorization': auth(accessToken.uid, "")
        }
      })

      assert.strictEqual(response.result.value, address);

    } catch(error) {

      console.error('ERROR', error.message);
      throw error;
    }
  });

  it("PUT /addresses/zen should set the ZEN address", async () => {

    try {

      var address = 'znjqSXSH2SbkdLUwrkem7pGSAJUbjzzPWg6';

      let response = await server.inject({
        method: 'PUT',
        url: '/addresses/zen',
        payload: {
          address: address
        },
        headers: {
          'Authorization': auth(accessToken.uid, "")
        }
      })

      assert.strictEqual(response.result.currency, 'ZEN');
      assert.strictEqual(response.result.value, address);

    } catch(error) {

      console.error('ERROR', error.message);
      throw error;
    }

  });

})

function auth(username, password) {
  return `Basic ${new Buffer(username + ':' + password).toString('base64')}`;
}

