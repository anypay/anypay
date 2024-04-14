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

import { setAddress} from '../../lib/core';

import { coins, accounts } from "../../lib";

import { assert, server, chance } from '../utils'

import {
  access_tokens as AccessToken,
  accounts as Account
} from '@prisma/client'

describe("Account Coins over HTTP", async () => {
  var accessToken: AccessToken, account: Account;
  
  before(async () => {

    account = await accounts.registerAccount(chance.email(), chance.word());

    accessToken = await accounts.createAccessToken(account.id);

    await setAddress({
      account_id: account.id,
      currency: "DASH",
      chain: "DASH",
      address: "XoLSiyuXbqTQGUuEze7Z3BB6JkCsPMmVA9"
    });

    await setAddress({
      account_id: account.id,
      currency: "BTC",
      chain: "BTC",
      address: "1FdmEDQHL4p4nyE83Loyz8dJcm7edagn8C"
    });

  });

  it("GET /coins should return list of coins", async () => {
    try {

      let response = await server.inject({
        method: 'GET',
        url: '/coins',
        headers: {
          'Authorization': auth(String(accessToken?.uid), "")
        }
      });

      assert((response.result as any).coins);

    } catch(error) {

      throw error;
    }
  });

  describe("Making Coins Unavailable", () => {

    it("coins.deactivateCoin should reflect in the response", async () => {

      await coins.deactivateCoin('DASH');

      let response = await server.inject({
        method: 'GET',
        url: '/coins',
        headers: {
          'Authorization': auth(String(accessToken?.uid), "")
        }
      });

      let dash = (response.result as any).coins.find((c: any) => c.code === 'DASH');

      assert(dash.unavailable);

    });

    it("coins.activateCoin should reflect in the response", async () => {

      await coins.deactivateCoin('DASH');
      await coins.activateCoin('DASH');

      let response = await server.inject({
        method: 'GET',
        url: '/coins',
        headers: {
          'Authorization': auth(String(accessToken?.uid), "")
        }
      });

      let dash = (response.result as any).coins.find((c: any) => c.code === 'DASH');

      assert(!dash.unavailable);

    });

  });

})

function auth(username: string, password: string) {
  return `Basic ${new Buffer(username + ':' + password).toString('base64')}`;
}

