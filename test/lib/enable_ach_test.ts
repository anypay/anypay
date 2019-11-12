import * as assert from 'assert';

import { models, accounts, addresses } from '../../lib';

import {setDenomination} from '../../lib/core';

import * as Chance from 'chance';
const chance = new Chance();

import * as dash from '../../plugins/dash/index';

describe("ACH enable Library", () => {

  var account1, account, addrs;

  before(async () => {

    account = await accounts.registerAccount(chance.email(), chance.word());
    account1 = await accounts.registerAccount(chance.email(), chance.word());

    addrs = [{
      account_id: account.id,
      currency: "DASH",
      address: "XceursdYxMRNLJRkNYjyGoZgJEsCxaqeAv"
    },{
      account_id: account.id,
      currency: "BSV",
      address: "19hAwYhCjbK3mFL1hVdgF5zdKzHdZDxVVJ"
    }]

    await setDenomination({
            currency: "GPB",
            account_id: account.id
    })

    await Promise.all(addrs.map(address => addresses.setAddress(address)));

  });

  describe("Enable account for ACH", () => {

    it("should set all addresses to exchange addresses and lock them", async () => {

      account = await accounts.enableACH(account.id);

      let dash = await models.Address.findOne({
              where:{
                      account_id: account.id,
                      currency: "DASH"
              }
      })

      let bsv = await models.Address.findOne({
              where:{
                      account_id: account.id,
                      currency: "BSV"
              }
      })

      let bch = await models.Address.findOne({
              where:{
                      account_id: account.id,
                      currency: "BCH"
              }
      })


      let btc = await models.Address.findOne({
              where:{
                      account_id: account.id,
                      currency: "BTC"
              }
      })
      
      assert.strictEqual( account.denomination, "USD");
      assert.strictEqual( dash.value,  process.env.ANYPAY_EXCHANGE_DASH_ADDRESS );
      assert.strictEqual( dash.locked,  true );
      assert.strictEqual( bsv.value,  process.env.ANYPAY_EXCHANGE_BSV_ADDRESS );
      assert.strictEqual( bsv.locked,  true );
      assert.strictEqual( bch.value,  process.env.ANYPAY_EXCHANGE_BCH_ADDRESS );
      assert.strictEqual( bch.locked,  true );
      assert.strictEqual( btc.value,  process.env.ANYPAY_EXCHANGE_BTC_ADDRESS );
      assert.strictEqual( btc.locked,  true );
      assert.strictEqual( account.ach_enabled,  true );

    });

    it("should disable ach for an account that is enabled", async () =>{
      
      account1 = await accounts.enableACH(account1.id);

      account1 = await accounts.disableACH(account1.id);

      await setDenomination({
              currency: "GPB",
              account_id: account1.id
      })

      await account1.reload()

      let dash = await models.Address.findOne({
              where:{
                      account_id: account1.id,
                      currency: "DASH"
              }
      })

      let bsv = await models.Address.findOne({
              where:{
                      account_id: account1.id,
                      currency: "BSV"
              }
      })

      let bch = await models.Address.findOne({
              where:{
                      account_id: account1.id,
                      currency: "BCH"
              }
      })


      let btc = await models.Address.findOne({
              where:{
                      account_id: account1.id,
                      currency: "BTC"
              }
      })


      assert.strictEqual( account1.denomination, "GPB");
      assert.strictEqual( dash,  null );
      assert.strictEqual( bsv,  null );
      assert.strictEqual( bch,  null );
      assert.strictEqual( btc, null );
      assert.strictEqual( account1.ach_enabled,  false );


    })

  });

});


function sleep(ms) {

  return new Promise((resolve, reject) => {

    setTimeout(resolve, ms);

  });
}
