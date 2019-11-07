import {Server} from '../../servers/rest_api/server';
import * as assert from 'assert';
import {hash} from '../../lib/password';

import { models, database, accounts } from '../../lib';

import * as Chance from 'chance';
const chance = new Chance();

describe("Getting Your Shareholder Information Via REST", async () => {
  var accessToken, server;
  
  before(async () => {
    await database.sync();
    server = await Server();

    try {

      var account = await accounts.registerAccount(chance.email(), chance.word());

      accessToken = await models.AccessToken.create({
        account_id: account.id
      })

    } catch(error) {
      console.error('ERROR', error.message);
    }
  });

  describe("When account is not a shareholder", () => {

    it("GET /shares should return null shareholder", async () => {

      try {

        let response = await server.inject({
          method: 'GET',
          url: '/shares',
          headers: {
            'Authorization': auth(accessToken.uid, "")
          }
        })

        assert.strictEqual(response.result.shareholder, null);

      } catch(error) {

        console.error('ERROR', error.message);
        throw error;
      }
    })


  });

  describe("When account is a shareholder", () => {

    var accessToken, account;

    before(async () => {

      account = await accounts.registerAccount(chance.email(), chance.word());

      accessToken = await models.AccessToken.create({
        account_id: account.id
      });

      await models.Shareholder.create({
        name: chance.name(),
        rvn_address: chance.word(),
        account_id: account.id
      });

    });

    it("GET /shares should return shareholder information", async () => {

      try {

        let response = await server.inject({
          method: 'GET',
          url: '/shares',
          headers: {
            'Authorization': auth(accessToken.uid, "")
          }
        })

        assert.strictEqual(response.result.shareholder.account_id, account.id);

      } catch(error) {

        console.error('ERROR', error.message);
        throw error;
      }
    })
  });

});

function auth(username, password) {
  return `Basic ${new Buffer(username + ':' + password).toString('base64')}`;
}

