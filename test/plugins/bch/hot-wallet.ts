require('dotenv').config();

import * as wallet from '../../../plugins/bch/wallet';
import * as assert from 'assert';
import * as Chance from 'chance';
import {models, prices, password} from '../../../lib';

import * as bch from '../../../plugins/bch';

const chance = new Chance();

describe('BCH hot wallet test', () => {

  it.skip("Should send transaction", async () => {

    let txid = await wallet.sendtoaddress(["bitcoincash:qpppe9kujfssu7gaqc4w0yrcxvr0hm47sg72mdld2l", 0.00005217 ])

    assert(txid.length == 64);

  });

  it.skip("Should send multi ouput transaction", async () => {

    let txid = await wallet.sendtomany([["bitcoincash:qpppe9kujfssu7gaqc4w0yrcxvr0hm47sg72mdld2l",  0.00005217], ["bitcoincash:qqpk7s09ga6k9ey2ap84zgw2za3htnnqxsz2nl8apn",  0.00005217], ["bitcoincash:qzmfxckkvkewgmxkthupvml4jjmy92eflstwhrn06h", 0.00005217]])

    assert(txid.length == 64);

  });

 it.skip("Should get the hot wallet balance", async () => {

    let balance = await wallet.getbalance()

    assert(balance > 0);

  });

 it.skip("Should return hot wallet address", async () => {

    let address = await wallet.getaddress()

    assert(bch.validateAddress(address));

  });

 it.skip("Should return listunspent utxos", async () => {

    let utxos = await wallet.listunspent();

    assert(utxos.length > 0);

  });

 it("Should return a list of correct outputs with createOutputsWithStrategy", async ()=> {

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

    var payout2Account = await models.Account.create({
        email: chance.email(),
        password_hash: await password.hash(chance.word())
    })

    await models.Address.create({ 
      account_id: payout2Account.id,
      currency: 'BCH',
      value: 'bitcoincash:qz7nw40mnuahf7sepwurv2pwjf788g4uqvr2qtdfgr'
    })

    let strategy = await models.VendingOutputStrategy.create({
      name: "testStrategy",
      strategy: {
              outputs: [ 
                { 
                  account_id: payout1Account.id,
                  scaler: .9
                },
                {
                  account_id: payout2Account.id,
                  scaler: .1
                }
              ]
      }
    })

    let vending_tx = await models.VendingTransaction.create({
      account_id: vendingAccount.id,
      terminal_id : 'BT101619',
      cash_amount: 1,
      crypto_currency: 'BTC',
      expected_profit_setting : 10,
      expected_profit_value : .10,
      additional_output_strategy_id: strategy.id
    })

   let outputs = await wallet.getAdditionalOutputs( vending_tx.id ) 
   console.log('outputs', outputs)
   let txid = await wallet.sendAdditionalOutputs( outputs, vending_tx.id)

   let output = await models.VendingTransactionOutput.findOne({ where:{vending_transaction_id: vending_tx.id}})

   assert(txid)

   assert(output.hash)
   assert(output.amount > 0)

 }) 

});