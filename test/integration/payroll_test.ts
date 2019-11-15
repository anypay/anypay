import {Server} from '../../servers/rest_api/server';
import * as assert from 'assert';
import {hash} from '../../lib/password';

import { models, database, accounts } from '../../lib';

import * as Chance from 'chance';
const chance = new Chance();

describe("Getting Your Payroll Information Via REST", async () => {
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

  describe("When account is not on payroll", () => {

    it("GET /payroll should return payroll", async () => {

      try {

        let response = await server.inject({
          method: 'GET',
          url: '/payroll',
          headers: {
            'Authorization': auth(accessToken.uid, "")
          }
        })

        assert.strictEqual(response.result.statusCode, 400);

        assert.strictEqual(response.result.error, 'Bad Request')
        assert.strictEqual(response.result.message, 'no payroll account found')

      } catch(error) {

        console.error('ERROR', error.message);
        throw error;
      }
    })


  });

  describe("When account is on payroll", () => {

    var accessToken, account;

    before(async () => {

      account = await accounts.registerAccount(chance.email(), chance.word());

      accessToken = await models.AccessToken.create({
        account_id: account.id
      });

      await models.PayrollAccount.create({
        account_id: account.id,
        active: true,
        base_monthly_amount: 50,
        base_currency: 'GOLD'
      });

    });

    it("GET /payroll should return payroll information", async () => {

      try {

        let response = await server.inject({
          method: 'GET',
          url: '/payroll',
          headers: {
            'Authorization': auth(accessToken.uid, "")
          }
        })

        assert(response.result.payroll_account.account_id, account.id);
        assert(response.result.payroll_payments.length >= 0);

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

