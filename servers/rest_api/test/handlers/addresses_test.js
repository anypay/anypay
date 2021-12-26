const Database = require("../../../../lib/database");

const Account = require("../../../../lib/models/account");
const AccessToken = require("../../../../lib/models/access_token");
const Chance = require('chance'), chance = new Chance();

const { server, Server } = require('../../server');
const bcrypt = require('bcryptjs');

import * as assert from 'assert';

function auth(username, password) {
  return `Basic ${new Buffer(username + ':' + password).toString('base64')}`;
}

describe("AddressesController#update", () => {
  let accessToken;

  const email = chance.email();
  const password = `${chance.word()} ${chance.word()} ${chance.word()}`;

  before((done) => {
    Database.sync().then(() => (
      Server().then(() => {
        bcrypt.hash(password, 10, (err, password_hash) => {
          Account.create({ email, password_hash }).then(account => (
            AccessToken.create({ account_id: account.id })
          ))
          .then(token => {
            accessToken = token;
            done()
          });
        })
      })
    ));
  });

  it("supports getting the account addresses", async () => {
    const response = await server.inject({
      method: 'GET',
      url: '/addresses',
      headers: {
        'Authorization': auth(accessToken.uid, "")
      }
    })
    assert.strictEqual(response.statusCode, 200, 'status code is 200');
    assert.equal(response.payload.BTC, null);
    assert.equal(response.payload.DASH, null);
    assert.equal(response.payload.BCH, null);
    assert.equal(response.payload.ZEC, null);
  })

  it("supports adding a ZEC address", async () => {
    let response = await server.inject({
      method: 'PUT',
      url: '/addresses/ZEC',
      payload: {
        address: 'ZEC_ADDRESS'
      },
      headers: {
        'Authorization': auth(accessToken.uid, "")
      }
    })
    assert.strictEqual(response.statusCode, 200, 'status code is 200');
    response = await server.inject({
      method: 'GET',
      url: '/addresses',
      headers: {
        'Authorization': auth(accessToken.uid, "")
      }
    })
    assert.strictEqual(response.statusCode, 200, 'status code is 200');
    assert.deepEqual(JSON.parse(response.payload), {BTC:null,DASH:null,BCH:null,ZEC:'ZEC_ADDRESS'})
  })
});
