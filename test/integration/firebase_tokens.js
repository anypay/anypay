import {Server} from '../../servers/rest_api/server';
import * as assert from 'assert';
import {hash} from '../../lib/password';

import { generateAccount } from '../utils';

import { settings, database, models, accounts } from "../../lib";

import * as Chance from 'chance';
const chance = new Chance();

describe("Setting Firebase Token via REST", async () => {
  var accessToken, account, server;
  
  before(async () => {
    await database.sync();
    server = await Server();

    account = await generateAccount();

    accessToken = await accounts.createAccessToken(account.id);

  });

  it("PUT /settings/denomination should update to VEF", async () => {
    try {

      var token = uuid.v4();

      let response = await server.inject({
        method: 'PUT',
        url: '/firebase_token',
        payload: {
          firebase_token: token
        },
        headers: headers(accessToken.uid)
      });

      assert.strictEqual(response.result.firebase_token.token, token);

    } catch(error) {

      console.error('ERROR', error.message);

      throw error;
    }
  });

  it("GET /firebase_token should display the firebase token", async () => {
    try {

      var token = uuid.v4();

      let response = await server.inject({
        method: 'PUT',
        url: '/firebase_token',
        payload: {
          firebase_token: token
        },
        headers: headers(accessToken.uid)
      });

      response = await server.inject({
        method: 'GET',
        url: '/firebase_token',
        headers: headers(accessToken.uid)
      });

      assert.strictEqual(response.result.firebase_token.token, token);

    } catch(error) {

      console.error('ERROR', error.message);
      throw error;
    }
  });

})

function auth(username, password) {
  return `Basic ${new Buffer(username + ':' + password).toString('base64')}`;
}

function headers(token) {

  return {
    'Authorization': auth(token, "")
  }
}
