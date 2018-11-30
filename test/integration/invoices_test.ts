import {Server} from '../../servers/rest_api/server';
import * as assert from 'assert';
import {hash} from '../../lib/password';
import { setAddress, setDenomination } from '../../lib/core';

import { models } from '../../lib';
import { generateInvoice } from '../../lib/invoice';

const Database = require("../../lib/database");
const Account = require("../../lib/models/account");
const AccessToken = require("../../lib/models/access_token");

import * as Chance from 'chance';
const chance = new Chance();

describe("Creating Invoices via REST", async () => {
  var account, accessToken, server;
  
  before(async () => {
    await Database.sync();
    server = await Server();

    try {
      account = await Account.create({
        email: chance.email(),
        password_hash: await hash(chance.word())
      })

      accessToken = await AccessToken.create({
        account_id: account.id
      })

    } catch(error) {
      console.error('ERROR', error.message);
    }
  });

  it("POST /invoices/:uid/replacesments should replace the invoice", async () => {

    await setAddress({
      account_id: account.id,
      currency: "DASH",
      address: "XoLSiyuXbqTQGUuEze7Z3BB6JkCsPMmVA9"
    });

    await setAddress({
      account_id: account.id,
      currency: "BTC",
      address: "1FdmEDQHL4p4nyE83Loyz8dJcm7edagn8C"
    });

    var amount = {
      currency: 'VEF',
      value: 15000000
    };

    await setDenomination({
      account_id: account.id,
      currency: amount.currency
    });

    let invoice = await generateInvoice(account.id, amount.value, 'DASH');

    let response = await server.inject({
      method: 'POST',
      url: `/invoices/${invoice.uid}/replacements`,
      payload: {
        currency: 'BTC'
      },
      headers: {
        'Authorization': auth(accessToken.uid, "")
      }
    })

    console.log('replacements response', response);

    assert.strictEqual(response.result.currency, 'BTC');

  })

  describe("Including Redirect URL", () => {

    it("should allow for a redirect_url POST parameter", async () => {

      let redirectURL = 'https://api.zeiler.io/checkouts/12490343-3434-342342-236ASDFAS/anypay'

      await setAddress({
        account_id: account.id,
        currency: "DASH",
        address: "XoLSiyuXbqTQGUuEze7Z3BB6JkCsPMmVA9"
      });

      let payload = {
        currency: 'DASH',
        amount: 5,
        redirect_url: redirectURL
      };

      let response = await server.inject({
        method: 'POST',
        url: `/invoices`,
        payload: payload,
        headers: {
          'Authorization': auth(accessToken.uid, "")
        }
      })

      assert.strictEqual(response.result.redirect_url, redirectURL);

      let invoice = await models.Invoice.findOne({ where: {
        
        uid: response.result.uid

      }});

      assert.strictEqual(invoice.redirect_url, redirectURL);

    });

  });

  it("POST /invoices should accept webhook_url as a parameter", async () => {

    await setAddress({
      account_id: account.id,
      currency: "DASH",
      address: "XoLSiyuXbqTQGUuEze7Z3BB6JkCsPMmVA9"
    });

    let webhook_url = 'https://webhooks.zeiler.io/123454';

    let response = await server.inject({
      method: 'POST',
      url: `/invoices`,
      payload: {
        currency: 'DASH',
        amount: '10',
        webhook_url
      },
      headers: {
        'Authorization': auth(accessToken.uid, "")
      }
    });

    assert.strictEqual(response.result.webhook_url, webhook_url);

  })

});

function auth(username, password) {
  return `Basic ${new Buffer(username + ':' + password).toString('base64')}`;
}

