import {Server} from '../../servers/rest_api/server';
import * as assert from 'assert';
import {hash} from '../../lib/password';
import * as Database from '../../lib/database';

import {
  settings,
  models,
  accounts
} from "../../lib";

import {setAddress} from '../../lib/core';

import {generateInvoice} from '../../lib/invoice';

import * as Chance from 'chance';
const chance = new Chance();

describe("Looking Up Invoice Links via REST", async () => {
  var accessToken, account, server;
  
  before(async () => {
    await Database.sync();
    server = await Server();

    account = await accounts.registerAccount(chance.email(), chance.word());

    await setAddress({
      account_id: account.id,
      currency: "BCH",
      address: '1HidGxN4awwkdFHP5FfzigbFPY9Y7sMqyk'
    });

    accessToken = await accounts.createAccessToken(account.id);

  });

  it.skip("POST /links should return currency options", async () => {

    try {

      let invoice = await generateInvoice(account.id, 1, 'BCH');

      let response = await server.inject({
        method: 'POST',
        url: '/links',
        payload: {
          invoice_uri: `${invoice.address}?amount=${invoice.amount}&any=1`
        }
      });

      console.log('response', response.result);

      assert(response.result.links.length > 0);

    } catch(error) {

      console.error('ERROR', error.message);
      throw error;
    }
  });

});

function auth(username, password) {
  return `Basic ${new Buffer(username + ':' + password).toString('base64')}`;
}

