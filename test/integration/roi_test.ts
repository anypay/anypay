import {Server} from '../../servers/rest_api/server';
import * as assert from 'assert';

import * as Chance from 'chance';

const chance = new Chance();

import { models } from '../../lib';
const Database = require("../../lib/database");
const Account = require("../../lib/models/account");
const AccessToken = require("../../lib/models/access_token");

import { registerAccount, createAccessToken } from '../../lib/accounts';

function auth(username, password) {
  return `Basic ${new Buffer(username + ':' + password).toString('base64')}`;
}

describe("Getting ROI  via REST", async () => {

  var account, accessToken, server;
  
  before(async () => {
    await Database.sync();
    server = await Server();

    try {

      account = await registerAccount(chance.email(), chance.word())

      accessToken = createAccessToken(account.id);

    } catch(error) {
      console.error('ERROR', error.message);
    }
  });

  it("GET /accounts/roi ", async () => {

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

