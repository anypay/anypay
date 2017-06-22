'use strict';

const assert = require("assert");
process.env.DATABASE_URL =
  "postgres://stevenzeiler:@127.0.0.1/anypay_dash_test";
const Account = require("../../../../lib/models/account");
const AccessToken = require("../../../../lib/models/access_token");

const Database = require("../../../../lib/database");
const server = require('../../server');

function auth(username, password) {
  return `Basic ${new Buffer(username + ':' + password).toString('base64')}`;
}

describe("Invoices HTTP API", () => {
  var accessToken;

  before(done => {
    Database.sync().then(() => {
      return Account.create().then(account => {
        console.log('created account', account.toJSON());
        return AccessToken.create({
          account_id: account.id
        })
      })
    })
    .then(token => {
      console.log('created access token', token.toJSON());
      accessToken = token;
      done();
    });
  });

  it("POST /invoices should create a new invoice", done => {

    server.inject({
      method: 'POST',
      url: '/invoices',
      payload: {
        amount: 0.01
      },
      headers: {
        'Authorization': auth(accessToken.uid, '')
      }
    }, response => {
      console.log('PAYLOAD', response.payload);
      let invoice = JSON.parse(response.payload);
      assert.strictEqual(invoice.status, 'unpaid');
      assert(invoice.address);
      assert(invoice.id);
      done()
    });
  });
});

