import {Server} from '../../servers/rest_api/server';
import * as assert from 'assert';

import * as Chance from 'chance';

const chance = new Chance();

import { database, accounts } from '../../lib';

function auth(username, password) {
  return `Basic ${new Buffer(username + ':' + password).toString('base64')}`;
}

describe("Getting ROI  via REST", async () => {

  var account, accessToken, server;
  
  before(async () => {
    await database.sync();
    server = await Server();

    try {

      account = await accounts.registerAccount(chance.email(), chance.word())

      accessToken = accounts.createAccessToken(account.id);

    } catch(error) {
      console.error('ERROR', error.message);
    }
  });

  it.skip("GET /accounts/roi ", async () => {

    let response = await server.inject({
      method: 'GET',
      url: `/accounts/roi`,
      headers: {
        'Authorization': auth(accessToken.uid, "")
      }
    })

    assert.strictEqual(response.result.currency, 'USD');

  })

})

