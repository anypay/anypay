'use strict'; const assert = require("assert"); process.env.DATABASE_URL = "postgres://stevenzeiler:@127.0.0.1/anypay_dash_test"; const Account = require("../../../../lib/models/account"); const AccessToken = require("../../../../lib/models/access_token"); const Chance = require('chance'), chance = new Chance(); const Database = require("../../../../lib/database");
const server = require('../../server');
const bcrypt = require('bcrypt');

function auth(username, password) {
  return `Basic ${new Buffer(username + ':' + password).toString('base64')}`;
}

describe("AccessToken HTTP API", () => {
  var account;

	var email = chance.email();
	var password = `${chance.word()} ${chance.word()} ${chance.word()}`;

  before(done => {
    Database.sync().then(() => {
      bcrypt.hash(password, 10, (err, password_hash) => {
        Account.create({ email, password_hash }).then(acct => {
          account = acct;
          done()
        })
        .catch(done);
      });
    });
  });

  it("POST /access_tokens should create a new token with correct password", done => {

    server.inject({
      method: 'POST',
      url: '/access_tokens',
      headers: {
        'Authorization': auth(email, password)
      }
    }, response => {
      let accessToken = JSON.parse(response.payload);
      assert.strictEqual(accessToken.account_id, account.id);
      assert(accessToken.uid);
      assert(accessToken.id);
      done()
    });
  });

  it("POST /access_tokens should fail with incorrect password", done => {

    server.inject({
      method: 'POST',
      url: '/access_tokens',
      headers: {
        'Authorization': auth(email, 'incorrectP')
      }
    }, response => {
      let json = JSON.parse(response.payload);
      assert(json.error);
      assert.strictEqual(json.statusCode, 500);
      done()
    });
  });

});

