require('dotenv').config();

import { models } from '../../lib';
import * as assert from 'assert';
import * as Chance from 'chance';

const chance = new Chance();

describe('CashbackCustomerPayment Model', () => {

  it('should require a valid merchant id and transaction hash', async () => {

    let email = chance.email();

    let account = await models.Account.create({
      email: email
    });

    let cashBackMerchant = await models.CashbackMerchant.create({
      account_id: account.id
    });

    let invoice = await models.Invoice.create({
      currency: 'DASH',
      dollar_amount: 300,
      invoice_amount: 1,
      invoice_currency: 'DASH',
      denomination_currency: 'USD',
      denomination_amount: 300,
      amount: 1,
      address: 'XojEkmAPNzZ6AxneyPxEieMkwLeHKXnte5',
      account_id: account.id
    });

    try {

      let cashBackCustomerPayment = await models.CashbackCustomerPayment.create({
        amount: 0.1,
        address: 'XojEkmAPNzZ6AxneyPxEieMkwLeHKXnte5',
        currency: 'DASH',
        cashback_merchant_id: cashBackMerchant.id,
        transaction_hash: '352fdc50a99fbf9a6bff99b9474251a7fb94ad6b8f28fe4ca1de9003a412410a',
        invoice_id: invoice.id
      });

      console.log(cashBackCustomerPayment);

    } catch(error) {

      console.log("ERROR", error.message);

      throw error; 
    }


  });

});

