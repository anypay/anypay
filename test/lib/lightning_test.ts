require('dotenv').config();
import * as assert from 'assert';
import {create, generateLightningInvoice} from '../../lib/lightning/invoice';
import * as Chance from 'chance';
import {Account} from '../../lib/models';

const chance = new Chance();

describe("Lightning Library", () => {

  describe('Generating Lightning Invoice Without Save', async () => {

    it("#generateLightningInvoice should generate a new invoice", async () => {
      if (process.env.LIGHTNING_SERVICE) {

        let lightningInvoice = await generateLightningInvoice(10);

        console.log(lightningInvoice);
      }

      return;

    });

  });

  describe('Generating Lightning Invoice With Save', async () => {

    it("#create should genreate and save an invoice", async () => {
      if (process.env.LIGHTNING_SERVICE) {
        let account = await Account.create({ email: chance.email() })
        console.log('account', account);
        let amount = 10;

        try {
        let invoiceRecord = await create(amount, account.id);

          console.log('invoice created', invoiceRecord);
        } catch(error) {
          console.log('invoice error');
          console.error(error.message);
          throw error;
        }
      }

      return;
    });


  });

});
