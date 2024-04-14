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

import { generateAccount } from '../utils';

import { settings, database, models, accounts } from "../../lib";

import * as Chance from 'chance';
const chance = new Chance();

describe("Setting Firebase Token via REST", async () => {
  var accessToken, account, server;
  
  before(async () => {
    server = await Server();

    account = await generateAccount();

    accessToken = await accounts.createAccessToken(account.id);

  });

  it("PUT /firebase_token should add multiple tokens", async () => {
    try {

      var token = uuid.v4();

      let response = await server.inject({
        method: 'PUT',
        url: '/firebase_token',
        payload: {
          firebase_token: token
        },
        headers: headers(accessToken.uid)
      });

      assert.strictEqual(response.result.firebase_token.token, token);

      // A second token can also be added
      await server.inject({
        method: 'PUT',
        url: '/firebase_token',
        payload: {
          firebase_token: uuid.v4()
        },
        headers: headers(accessToken.uid)
      });

      assert.strictEqual(models.FirebaseToken.findAll({
        where: {
          account_id: account.id
        }
      }).length, 2)

    } catch(error) {

      console.error('ERROR', error.message);

      throw error;
    }
  });

  it("GET /firebase_token should display the firebase token", async () => {
    try {

      var token = uuid.v4();

      let response = await server.inject({
        method: 'PUT',
        url: '/firebase_token',
        payload: {
          firebase_token: token
        },
        headers: headers(accessToken.uid)
      });

      response = await server.inject({
        method: 'GET',
        url: '/firebase_token',
        headers: headers(accessToken.uid)
      });

      assert.strictEqual(response.result.firebase_token.token, token);

    } catch(error) {

      console.error('ERROR', error.message);
      throw error;
    }
  });

})

function auth(username, password) {
  return `Basic ${new Buffer(username + ':' + password).toString('base64')}`;
}

function headers(token) {

  return {
    'Authorization': auth(token, "")
  }
}
