import {
  Account,
  DashBackMerchant,
  DashBackMerchantPayment,
  Invoice
} from '../../lib/models';

import * as database from '../../lib/database';
import * as assert from 'assert';
import * as Chance from 'chance';

const chance = new Chance();

describe('DashBackMerchantPayment Model', () => {

  it('should require a valid merchant id and transaction hash', async () => {

    let email = chance.email();

    let account = await Account.create({
      email: email
    });

    let dashBackMerchant = await DashBackMerchant.create({
      account_id: account.id
    });

    let invoice = await Invoice.create({
      currency: 'DASH',
      dollar_amount: 300,
      invoice_currency: 'DASH',
      invoice_amount: 1,
      denomination_currency: 'USD',
      denomination_amount: 300,
      amount: 1,
      address: 'XojEkmAPNzZ6AxneyPxEieMkwLeHKXnte5',
      account_id: account.id
    });

    try {

      let dashBackMerchantPayment = await DashBackMerchantPayment.create({
        amount: 0.1,
        address: 'XojEkmAPNzZ6AxneyPxEieMkwLeHKXnte5',
        dash_back_merchant_id: dashBackMerchant.id,
        transaction_hash: '352fdc50a99fbf9a6bff99b9474251a7fb94ad6b8f28fe4ca1de9003a412410a',
        invoice_id: invoice.id
      });

      console.log(dashBackMerchantPayment);

    } catch(error) {

      console.log("ERROR", error.message);

      throw error; 
    }


  });

});

