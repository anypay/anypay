'use strict'; const assert = require("assert"); process.env.DATABASE_URL = "postgres://stevenzeiler:@127.0.0.1/anypay_dash_test"; const Account = require("../../../../lib/models/account"); const AccessToken = require("../../../../lib/models/access_token"); const Chance = require('chance'), chance = new Chance(); const Database = require("../../../../lib/database");
const server = require('../../server');
const bcrypt = require('bcrypt');
const bitcore = require('bitcore-lib-dash');

function auth(username, password) {
  return `Basic ${new Buffer(username + ':' + password).toString('base64')}`;
}

describe("PairToken HTTP API", () => {
  var account, accessToken;

	var email = chance.email();
	var password = `${chance.word()} ${chance.word()} ${chance.word()}`;

  before(done => { Database.sync().then(() => {
      bcrypt.hash(password, 10, (err, password_hash) => {
        Account.create({ email, password_hash }).then(acct => {
          account = acct;

          return AccessToken.create({
            account_id: account.id
          });
        })
        .then(token => {
          accessToken = token;
          done();
        })
        .catch(done);
      });
    });
  });

  it("POST /payout_address should update payout address", done => {
    let address = (new bitcore.PrivateKey()).toAddress().toString();

    server.inject({
      method: 'POST',
      url: '/payout_address',
      payload: {
        address: address
      },
      headers: {
        'Authorization': auth(accessToken.uid, "")
      }
    }, response => {
      assert(JSON.parse(response.payload).success);
      done()
    });
  });

  it("POST /payout_address should fail with invalid address", done => {

    server.inject({
      method: 'POST',
      url: '/payout_address',
      payload: {
        address: 'invalid'
      },
      headers: {
        'Authorization': auth(accessToken.uid, "")
      }
    }, response => {
      let error = JSON.parse(response.payload).error;
      assert.strictEqual(error, 'invalid dash address');
      done()
    });
  });
});

