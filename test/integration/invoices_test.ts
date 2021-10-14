import { Server } from '../../servers/rest_api/server';
import * as assert from 'assert';
import {hash} from '../../lib/password';
import { setAddress, setDenomination } from '../../lib/core';

import { models, database, invoices } from '../../lib';

import * as Chance from 'chance';
const chance = new Chance();

describe("Creating Invoices via REST", async () => {
  var account, accessToken, server;
  
  before(async () => {
    await database.sync();
    server = await Server();

    try {
      account = await models.Account.create({
        email: chance.email(),
        password_hash: await hash(chance.word())
      })

      accessToken = await models.AccessToken.create({
        account_id: account.id
      })

    } catch(error) {
      console.error('ERROR', error.message);
    }
  });

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

      console.log('response.result', response.result);

      assert.strictEqual(response.result.redirect_url, redirectURL);

      let invoice = await models.Invoice.findOne({ where: {
        
        uid: response.result.uid

      }});

      assert.strictEqual(invoice.redirect_url, redirectURL);

    });

  });


});

function auth(username, password) {
  return `Basic ${new Buffer(username + ':' + password).toString('base64')}`;
}

