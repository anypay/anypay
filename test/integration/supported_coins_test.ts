import {Server} from '../../servers/rest_api/server';
import * as assert from 'assert';
import {hash} from '../../lib/password';
import * as Database from '../../lib/database';

import { deactivateCoin, activateCoin } from '../../lib/coins';

import {
  settings,
  models,
  accounts
} from "../../lib";

import * as Chance from 'chance';
const chance = new Chance();

describe("Account Coins over HTTP", async () => {
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

      assert(response.result.coins);

    } catch(error) {

      console.error('ERROR', error.message);
      throw error;
    }
  });

  describe("Making Coins Unavailable", () => {

    it("coins.deactivateCoin should reflect in the response", async () => {

      await deactivateCoin('DASH');

      let response = await server.inject({
        method: 'GET',
        url: '/coins',
        headers: {
          'Authorization': auth(accessToken.uid, "")
        }
      });

      let dash = response.result.coins.find(c => c.code === 'DASH');

      assert(dash.unavailable);

    });

    it("coins.activateCoin should reflect in the response", async () => {

      await deactivateCoin('DASH');
      await activateCoin('DASH');

      let response = await server.inject({
        method: 'GET',
        url: '/coins',
        headers: {
          'Authorization': auth(accessToken.uid, "")
        }
      });

      let dash = response.result.coins.find(c => c.code === 'DASH');

      assert(!dash.unavailable);

    });

  });

})

function auth(username, password) {
  return `Basic ${new Buffer(username + ':' + password).toString('base64')}`;
}

