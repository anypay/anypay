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

import prisma from '../../lib/prisma';
import { server, assert, account, uuid, accessToken } from '../utils'

describe("Setting Firebase Token via REST", async () => {


  it("PUT /firebase_token should add multiple tokens", async () => {
    try {

      var token = uuid.v4();

      let response = await server.inject({
        method: 'PUT',
        url: '/firebase_token',
        payload: {
          firebase_token: token
        },
        headers: headers(String(accessToken.uid))
      });

      const result = response.result as any;

      assert.strictEqual(result.firebase_token.token, token);

      // A second token can also be added
      await server.inject({
        method: 'PUT',
        url: '/firebase_token',
        payload: {
          firebase_token: uuid.v4()
        },
        headers: headers(String(accessToken.uid))
      });

      const allTokens = await prisma.firebase_tokens.findMany({
        where: {
          account_id: account.id
        }
      })

      assert.strictEqual(allTokens.length, 2)

    } catch(error) {

      const { message } = error as Error;

      console.error('ERROR', message);

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
        headers: headers(String(accessToken.uid))
      });

      response = await server.inject({
        method: 'GET',
        url: '/firebase_token',
        headers: headers(String(accessToken.uid))
      });

      const { result } = response as any

      assert.strictEqual(result.firebase_token.token, token);

    } catch(error) {

      const { message } = error as Error;

      console.error('ERROR', message);

      throw error;
    }
  });

})

function auth(username: string, password: string) {
  return `Basic ${new Buffer(username + ':' + password).toString('base64')}`;
}

function headers(token: string) {

  return {
    'Authorization': auth(token, "")
  }
}
