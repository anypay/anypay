import {Server} from '../../servers/rest_api/server';
import * as assert from 'assert';
import {hash} from '../../lib/password';
import * as Database from '../../lib/database';

import {
  settings,
  models,
  accounts
} from "../../lib";

import * as Chance from 'chance';
const chance = new Chance();

describe("Setting Denomination Via REST", async () => {
  var accessToken, account, server;
  
  before(async () => {
    await Database.sync();
    server = await Server();

    account = await accounts.registerAccount(chance.email(), chance.word());

    accessToken = await accounts.createAccessToken(account.id);

  });

  it("GET /coins should return list of coins", async () => {
    try {

      let response = await server.inject({
        method: 'GET',
        url: '/coins',
        headers: {
          'Authorization': auth(accessToken.uid, "")
        }
      });

      console.log('supported coins', response.result.coins);

      assert(response.result.coins);

    } catch(error) {

      console.error('ERROR', error.message);
      throw error;
    }
  });

})

function auth(username, password) {
  return `Basic ${new Buffer(username + ':' + password).toString('base64')}`;
}

