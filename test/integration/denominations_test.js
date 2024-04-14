/*
    This file is part of anypay: https://github.com/anypay/anypay
    Copyright (c) 2017 Anypay Inc, Steven Zeiler

    Permission to use, copy, modify, and/or distribute this software for any
    purpose  with  or without fee is hereby granted, provided that the above
    copyright notice and this permission notice appear in all copies.

    THE  SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES
    WITH  REGARD  TO  THIS  SOFTWARE  INCLUDING  ALL  IMPLIED  WARRANTIES  OF
    MERCHANTABILITY  AND  FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR
    ANY  SPECIAL ,  DIRECT, INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES
    WHATSOEVER  RESULTING  FROM  LOSS  OF USE, DATA OR PROFITS, WHETHER IN AN
    ACTION  OF  CONTRACT, NEGLIGENCE OR OTHER TORTIOUS ACTION, ARISING OUT OF
    OR IN CONNECTION WITH THE USE OR PERFORMANCE OF THIS SOFTWARE.
*/
//==============================================================================

import {Server} from '../../servers/rest_api/server';
import * as assert from 'assert';
import {hash} from '../../lib/password';

import { settings, database, models, accounts } from "../../lib";

import * as Chance from 'chance';
const chance = new Chance();

describe("Setting Denomination Via REST", async () => {
  var accessToken, account, server;
  
  before(async () => {

    server = await Server();

    account = await accounts.registerAccount(chance.email(), chance.word());

    accessToken = await accounts.createAccessToken(account.id);

  });

  it("PUT /settings/denomination should update to VEF", async () => {
    try {

      var newDenomination = 'VEF';

      let response = await server.inject({
        method: 'PUT',
        url: '/settings/denomination',
        payload: {
          denomination: "VEF"
        },
        headers: {
          'Authorization': auth(accessToken.uid, "")
        }
      });

      assert.strictEqual(response.result.denomination, "VEF");

    } catch(error) {

      console.error('ERROR', error.message);
      throw error;
    }
  });

  it("GET /settings/denomination should display the default denomination", async () => {
    try {

      let response = await server.inject({
        method: 'PUT',
        url: '/settings/denomination',
        payload: {
          denomination: "GBP"
        },
        headers: {
          'Authorization': auth(accessToken.uid, "")
        }
      });

      response = await server.inject({
        method: 'GET',
        url: '/settings/denomination',
        headers: {
          'Authorization': auth(accessToken.uid, "")
        }
      });

      assert.strictEqual(response.result.denomination, "GBP");

    } catch(error) {

      console.error('ERROR', error.message);
      throw error;
    }
  });

})

function auth(username, password) {
  return `Basic ${new Buffer(username + ':' + password).toString('base64')}`;
}

