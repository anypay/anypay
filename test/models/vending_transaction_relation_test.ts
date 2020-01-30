require("dotenv").config();

import { models } from '../../lib';

const assert = require('assert');
const Chance = require('chance');
const chance = new Chance();

const Account = models.Account;

describe('Vending Transaction to Vending Transaction Output Model Relation', () => {

  it('Return a model with Outputs included', async () => {

    //Create Vending Transaction 
    //Create Vending Transaction Output 
    //Get Vending Transaction with Transaction Output included
    await models.VendingMachine.create({
      serial_number: 'BT101620',
      current_location_name: 'AnypayHQ',
      current_location_address: '110 State St Portsmouth, NH',
      machine_type: 'BATM2',
      terminal_id: 1,
    })

    let tx = await models.VendingTransaction.create({
      terminal_id : '1',
      cash_amount: 1,
      crypto_currency: 'BTC',
      expected_profit_setting : 10,
      type : 'BUY',
      expected_profit_value : .10,
      localtid: chance.word(),
      remotetid: chance.word(),
      cash_currency: 'USD',
      crypto_amount: 0.00148679,
      crpyto_address: '1ErXKwhQCGV9zYAFcmfjqdEPJLp3qRELwM',
      status: 1,
      hash: '130ed2d4543cee8572034c4fd47d67098e7dc8d731b338a71cde4463fffb6421'
    })

    await models.VendingTransactionOutput.create({
      vending_transaction_id : tx.id,
      strategy_id: 1,
      account_id: 934,
      currency: 'BSV'
    });


    let vending_tx = await models.VendingTransaction.findOne({
      where: {
        id : tx.id
      },
      include:[{
        model: models.VendingTransactionOutput,
        as: 'outputs'
      }]
    })

    assert(vending_tx.outputs.length > 0 )

  });

});

