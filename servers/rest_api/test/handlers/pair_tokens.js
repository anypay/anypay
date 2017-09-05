'use strict'; const assert = require("assert");
//process.env.DATABASE_URL = "postgres://stevenzeiler:@127.0.0.1/anypay_dash_test"
const Account = require("../../../../lib/models/account");
const AccessToken = require("../../../../lib/models/access_token");
const PairToken = require("../../../../lib/models/pair_token");
const Chance = require('chance');
const chance = new Chance();
const Database = require("../../../../lib/database");
const server = require('../../server');
const bcrypt = require('bcrypt');

function auth(username, password) {
  return `Basic ${new Buffer(username + ':' + password).toString('base64')}`;
}

describe("PairToken HTTP API", () => {
  var account, accessToken;

	var email = chance.email();
	var password = `${chance.word()} ${chance.word()} ${chance.word()}`;

  before(done => {
    Database.sync().then(() => {
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

  it("POST /pair_tokens should create a new token", done => {

    server.inject({
      method: 'POST',
      url: '/pair_tokens',
      headers: {
        'Authorization': auth(accessToken.uid, "")
      }
    }, response => {
      let pairToken = JSON.parse(response.payload);
      assert.strictEqual(pairToken.account_id, account.id);
      assert(pairToken.uid);
      assert(pairToken.id);
      done()
    });
  });

  it("GET /pair_tokens should create a new pair token", done => {

    server.inject({
      method: 'GET',
      url: '/pair_tokens',
      headers: {
        'Authorization': auth(accessToken.uid, "")
      }
    }, response => {
      let pairTokens = JSON.parse(response.payload).pair_tokens;
      assert.strictEqual(pairTokens[0].account_id, account.id);
      assert(pairTokens[0].uid);
      assert(pairTokens[0].id);
      done()
    });
  });

  it("POST /pair_tokens/:token should claim a pair token", done => {
    let deviceName = chance.name();

    PairToken.create({
      account_id: account.id
    })
    .then(pairToken => {

      server.inject({
        method: 'POST',
        url: `/pair_tokens/${pairToken.uid}`,
        payload: {
          device_name: deviceName
        }
      }, response => {
        console.log(response.payload);
        let accessToken = JSON.parse(response.payload).accessToken;
        let pairToken = JSON.parse(response.payload).pairToken;
        assert(accessToken.uid);
        assert.strictEqual(pairToken.device_name, deviceName);
        assert.strictEqual(pairToken.access_token_id, accessToken.id);
        done();
      });
    });
  });

  it("POST /pair_tokens/:token should reject a token already claimed", done => {
    let deviceName = chance.name();

    PairToken.create({
      account_id: account.id
    })
    .then(pairToken => {

      server.inject({
        method: 'POST',
        url: `/pair_tokens/${pairToken.uid}`,
        payload: {
          device_name: deviceName
        }
      }, response => {

        server.inject({
          method: 'POST',
          url: `/pair_tokens/${pairToken.uid}`,
          payload: {
            device_name: deviceName
          }
        }, response => {
          let resp = JSON.parse(response.payload);
          assert.strictEqual(resp.error, 'pair token already claimed');
          done();
        });
      });
    });
  });
});

