import {Server} from '../../servers/rest_api/server';
import * as assert from 'assert';

import { accounts, models, bankAccounts, database } from '../../lib';

import * as Chance from 'chance';
const chance = new Chance();

describe("ACH enable/disable REST API", async () => {

  var account, accessToken, server;
  
  before(async () => {

    await database.sync();
    server = await Server();

    account = await accounts.registerAccount(chance.email(), chance.word());

    accessToken = await accounts.createAccessToken(account.id);

    let bankAccount = await bankAccounts.create({
      beneficiary_name: "Brandon Bryant",
      beneficiary_address: "1 High Street",
      city: "Manchester",
      state: "NH",
      zip: "03103",
      routing_number: "211489494",
      beneficiary_account_number: "123456789",
      account_id: account.id
    })

  });

  it("POST /achs/enable should enable ach for account", async () => {

   let response = await server.inject({
      method: 'POST',
      url: `/achs/enable`,
      headers:{
        'Authorization': auth(accessToken.uid, "")
      }
    });

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


    await account.reload()

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
  it("POST /achs/disable should disable ach for account", async () => {

   let response = await server.inject({
      method: 'POST',
      url: `/achs/disable`,
      headers:{
        'Authorization': auth(accessToken.uid, "")
      }
    });

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


    await account.reload()

    assert.strictEqual( dash,  null );
    assert.strictEqual( bsv,  null );
    assert.strictEqual( bch,  null );
    assert.strictEqual( btc, null );
    assert.strictEqual( account.ach_enabled,  false );

  });

});

function auth(username, password) {
  return `Basic ${new Buffer(username + ':' + password).toString('base64')}`;
}
