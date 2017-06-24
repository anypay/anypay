'use strict';

const assert = require("assert");

process.env.DATABASE_URL = "postgres://stevenzeiler:@127.0.0.1/anypay_dash_test";

const Account = require("../../../../lib/models/account");
const AccessToken = require("../../../../lib/models/access_token");
const Invoice = require("../../../../lib/models/invoice");
const Chance = require('chance'), chance = new Chance();

const Database = require("../../../../lib/database");
const server = require('../../server');
const bcrypt = require('bcrypt');

function auth(username, password) {
  return `Basic ${new Buffer(username + ':' + password).toString('base64')}`;
}

describe("Invoices HTTP API", () => {
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

  it("GET /invoices should list invoices", done => {

    server.inject({
      method: 'GET',
      url: '/invoices',
      headers: {
        'Authorization': auth(accessToken.uid, "")
      }
    }, response => {
      let invoices = JSON.parse(response.payload).invoices;

      console.log(invoices);

      done()
    });
  });
});

