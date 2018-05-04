import {Server, server} from '../../servers/rest_api/server';
import * as assert from 'assert';
import {hash} from '../../lib/password';

const Database = require("../../lib/database");
const Account = require("../../lib/models/account");
const AccessToken = require("../../lib/models/access_token");

import * as Chance from 'chance';
const chance = new Chance();

describe("Creating Bitcoin Cash Invoices Via REST", async () => {
  var accessToken;
  
  before(async () => {
    await Database.sync();
    await Server();

    var account = await Account.create({
      email: chance.email(),
      password_hash: await hash(chance.word()),
      bitcoin_cash_address: '13RS85NrE4TyHCVeuZu6d2N55nHGunNgCp'
    })

    accessToken = await AccessToken.create({
      account_id: account.id
    })
  });

  it("POST /bch/invoices should create a bitcoin cash invoice", async () => {

    let response = await server.inject({
      method: 'POST',
      url: '/bch/invoices',
      payload: {
        amount: 10,
        currency: 'BCH'
      },
      headers: {
        'Authorization': auth(accessToken.uid, "")
      }
    })

    assert(response.result.address);
    assert(response.result.id > 0);
    assert(response.result.amount > 0);
  })

})

function auth(username, password) {
  return `Basic ${new Buffer(username + ':' + password).toString('base64')}`;
}

