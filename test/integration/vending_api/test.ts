import * as wallet from '../../../plugins/bch/wallet';
import {Server} from '../../../servers/vending_api/server';
import * as assert from 'assert';
import {models, prices, password, database, accounts} from '../../../lib';
import * as moment from 'moment';
import * as Chance from 'chance';
const chance = new Chance();

import { hash } from '../../../lib/password';

import { v4 } from 'uuid';



async function generatePassword() {

  let password = v4();

  let password_hash = await hash(password);

  return {

    password,

    password_hash

  }

}

function auth(username, password) {
  return `Basic ${new Buffer(username + ':' + password).toString('base64')}`;
}

describe("Vending API", async () => {

  var generated,account, accessToken, server, payout2Account, vendingMachine;
  
  before(async () => {

    await database.sync();

    server = await Server();

    account = await accounts.registerAccount(chance.email(), chance.word())

    var vendingAccount = await models.Account.create({
        email: chance.email(),
        password_hash: await password.hash(chance.word())
    })

    await models.Address.create({ 
      account_id: vendingAccount.id,
      currency: 'BCH',
      value: 'bitcoincash:qqnz8xt2ewm683sn2m9d3c2877g55wjw5c4ytu528l'
    })

    var payout1Account = await models.Account.create({
        email: chance.email(),
        password_hash: await password.hash(chance.word())
    })

    await models.Address.create({ 
      account_id: payout1Account.id,
      currency: 'BCH',
      value: 'bitcoincash:qzjjk2nkv7xwpzzdmz7jp5wzd0ww9y5cd5yf4wnu9g'
    })

    payout2Account = await models.Account.create({
        email: chance.email(),
        password_hash: await password.hash(chance.word())
    })

    await models.Address.create({ 
      account_id: payout2Account.id,
      currency: 'BCH',
      value: 'bitcoincash:qz7nw40mnuahf7sepwurv2pwjf788g4uqvr2qtdfgr'
    })

    accessToken = accounts.createAccessToken(vendingAccount.id);

    let strategy = await wallet.createStrategy('testStrategy', {
              outputs: [ 
                { 
                  account_id: payout1Account.id,
                  scaler: .8
                },
                {
                  account_id: payout2Account.id,
                  scaler: .1
                },
                {
                  scaler: .1,
                  useVendingAccountId: true
                }
              ]
    });

    vendingMachine = await models.VendingMachine.create({
      serial_number: 'BT101620',
      current_location_name: 'AnypayHQ',
      current_location_address: '110 State St Portsmouth, NH',
      machine_type: 'BATM2',
      account_id: payout1Account.id,
      terminal_id: 1,
      additional_output_strategy_id: strategy.id
    })


    let vending_tx = await models.VendingTransaction.create({
      account_id: vendingAccount.id,
      terminal_id : '1',
      cash_amount: 1,
      crypto_currency: 'BTC',
      expected_profit_setting : 10,
      type : 'BUY',
      expected_profit_value : .10,
      additional_output_strategy_id: strategy.id,
      servertime: moment().unix(),
      terminaltime: moment().unix(),
      localtid: chance.word(),
      remotetid: chance.word(),
      cash_currency: 'USD',
      crypto_amount: 0.00148679,
      crpyto_address: '1ErXKwhQCGV9zYAFcmfjqdEPJLp3qRELwM',
      status: 1,
      hash: '130ed2d4543cee8572034c4fd47d67098e7dc8d731b338a71cde4463fffb6421'
    })

    generated = await generatePassword();

    process.env.SUDO_PASSWORD_HASH = generated.password_hash.toString();
   
  });

  it("GET /api/vending/account/transactions", async () => {

    let response = await server.inject({
      method: 'GET',
      url: `/api/vending/transactions`,
      headers: {
        'Authorization': auth( generated.password , "")
      }
    })

    assert(response.result.vending_transactions.length > 0);

  })

  it("GET /api/vending/transactions/kpis/profit", async () => {

    let response = await server.inject({
      method: 'GET',
      url: `/api/vending/transactions/kpis/profit`,
      headers: {
        'Authorization': auth( generated.password , "")
      }
    })

    assert(response.result.profit);

  })

  it("GET /api/vending/transactions/kpis/revenue", async () => {

    let response = await server.inject({
      method: 'GET',
      url: `/api/vending/transactions/kpis/revenue`,
      headers: {
        'Authorization': auth( generated.password , "")
      }
    })

    assert(response.result.revenue);

  })
        
  it("GET /api/vending/vending_machines", async () => {

    let response = await server.inject({
      method: 'GET',
      url: `/api/vending/vending_machines`,
      headers: {
        'Authorization': auth( generated.password , "")
      }
    })

    assert(response.result.vending_machines);

  })

  it("PUT /api/vending/vending-machines/{id}", async () => {

    let response = await server.inject({
      method: 'PUT',
      url: `/api/vending/vending-machines/${vendingMachine.id}`,
      headers: {
        'Authorization': auth( generated.password , "")
      },
      payload: {
        email: payout2Account.email
      }
    })

    assert.strictEqual(response.result.vendingMachine.account_id, payout2Account.id);

  })

  it("PUT /api/vending/vending_machines/{id}/toggleStrategy", async () => {

    let response = await server.inject({
      method: 'PUT',
      url: `/api/vending/vending_machines/${vendingMachine.id}/toggleStrategy`,
      headers: {
        'Authorization': auth( generated.password , "")
      }
    })

    assert.strictEqual(response.result.vendingMachine.additional_output_strategy_id, 0);

  })


})

