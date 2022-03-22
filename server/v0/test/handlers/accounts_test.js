'use strict';

const assert = require("assert");
process.env.DATABASE_URL =
  "postgres://stevenzeiler:@127.0.0.1/anypay_dash_test";
const Account = require("../../../../lib/models/account");
const AccessToken = require("../../../../lib/models/access_token");
const Chance = require('chance'), chance = new Chance();

const Database = require("../../../../lib/database");
const server = require('../../server');

function auth(username, password) {
  return `Basic ${new Buffer(username + ':' + password).toString('base64')}`;
}

describe("Accounts HTTP API", () => {
  var account, accessToken;

	let email = chance.email();
	let password = `${chance.word()} ${chance.word()} ${chance.word()}`;

  before(done => {
    Database.sync().then(() => {
			done()
    });
  });

  it("POST /accounts should create a new account", done => {

    server.inject({
      method: 'POST',
      url: '/accounts',
			payload: {
				email, password
			}
    }, response => {

      let account = JSON.parse(response.payload);

      assert.strictEqual(account.email, email);
      assert(account.password_hash);
      assert(account.id);

      done()
    });
  });

});

