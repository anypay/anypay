require('dotenv').config();

import * as assert from 'assert';

import {getSupportedCoins} from '../../lib/accounts';

import { registerAccount } from '../../lib/accounts';

import { setAddress } from '../../lib/core';

import * as Chance from 'chance';

const chance = Chance();

describe("Supported Coins For Account", () => {

  // Account supported coins override the default global

  it("should return a list for each account", async () => {

    let account = await registerAccount(chance.email(), chance.word());
    
    await setAddress({
      account_id: account.id,
      currency: "BTC",
      address: "12Y7DPDJzy4DBKXgDBRJBJnpUTPPcgYHtm"
    });

   await setAddress({
      account_id: account.id,
      currency: "DASH",
      address: "XqHt831rFj5tr4PVjqEcJmh6VKvHP62QiM"
    });

    let coins = await getSupportedCoins(account.id);

    console.log("coins", coins);

    assert(coins['BTC'].enabled);

  });

  describe("Setting Arbitrary Address", () => {

    it("should that address in the list", async () => {

      let account = await registerAccount(chance.email(), chance.word());
      
      await setAddress({
        account_id: account.id,
        currency: "ZEN",
        address: "znjqSXSH2SbkdLUwrkem7pGSAJUbjzzPWg6"
      });

      let coins = await getSupportedCoins(account.id);

      console.log("coins", coins);

      assert(coins['ZEN']);

    });

  });

});

