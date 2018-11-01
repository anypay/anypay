import {Server} from '../../servers/rest_api/server';
import * as assert from 'assert';
import {hash} from '../../lib/password';

const Database = require("../../lib/database");
const Account = require("../../lib/models/account");
const AccessToken = require("../../lib/models/access_token");

import {setAddress} from '../../lib/core';

import * as Chance from 'chance';
const chance = new Chance();

describe("Creating ZCash Invoices Via REST", async () => {
  var accessToken, server;

  before(async () => {
    await Database.sync();
    server = await Server();

    try {
      var account = await Account.create({
        email: chance.email(),
        password_hash: await hash(chance.word())
      })

      accessToken = await AccessToken.create({
        account_id: account.id
      })

      await setAddress({
        account_id: account.id,
        currency: 'ZEC',
        address: 't3f3T3nCWsEpzmD35VK62JgQfFig74dV8C9'
      });

    } catch(error) {
      console.error('ERROR', error.message);
    }
  });

  it("POST /invoices should create a zencash invoice", async () => {
    try {

      let response = await server.inject({
        method: 'POST',
        url: '/invoices',
        payload: {
          amount: 10,
          currency: 'ZEC'
        },
        headers: {
          'Authorization': auth(accessToken.uid, "")
        }
      })

      console.log('RESP', response);

      assert(response.result.address);
      assert(response.result.id > 0);
      assert(response.result.amount > 0);

    } catch(error) {

      console.error('ERROR', error.message);
    }
  })

})

function auth(username, password) {
  return `Basic ${new Buffer(username + ':' + password).toString('base64')}`;
}

