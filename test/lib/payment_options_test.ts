
import * as assert from 'assert';

import * as uuid from 'uuid';

import { models, accounts, addresses, invoices, initialize } from '../../lib';
import * as lib from '../../lib';

import * as Chance from 'chance';
const chance = new Chance();

import * as dash from '../../plugins/dash/index';

describe("Payment Option Library", () => {

  var account, addrs;

  before(async () => {

    await initialize();

    account = await accounts.registerAccount(chance.email(), chance.word());

    addrs = [{
      account_id: account.id,
      currency: "DASH",
      address: "XceursdYxMRNLJRkNYjyGoZgJEsCxaqeAv"
    },{
      account_id: account.id,
      currency: "BSV",
      address: "19hAwYhCjbK3mFL1hVdgF5zdKzHdZDxVVJ"
    }]

    await Promise.all(addrs.map(address => addresses.setAddress(address)));

  });

  describe("Creating An Invoice", () => {

    it.skip("should also create a payment option for each address", async () => {

      // generate an invoice

      let invoice = await invoices.generateInvoice(account.id, 15, 'BSV');

      // assert three payment options for that invoice

      let options = await models.PaymentOption.findAll({
        where: {
          invoice_uid: invoice.uid
        }
      });

      assert.strictEqual(options.length, 2);

    });

  });

  describe("Replacing an Invoice", () => {

    it.skip("should replace twice but keep the same address", async () => {
  
      //generate an invoice 

      let invoice = await invoices.generateInvoice(account.id, 15, 'BSV');
      //assert two payment options
            //
      console.log('original invoice', invoice.toJSON())
      let expectedBitcoinAddress = invoice.address

      let options = await models.PaymentOption.findAll({
        where: {
          invoice_uid: invoice.uid
        }
      });

      assert.strictEqual(options.length, 2);

      invoice =  await invoices.replaceInvoice(invoice.uid, 'DASH');

      console.log(invoice.toJSON())
      //assert invocie is dash with Dash address
      assert.strictEqual(invoice.currency, "DASH");

      assert(invoice.uri)
      assert(dash.validateAddress(invoice.address));

      //replace invoice with BSV 
      invoice =  await invoices.replaceInvoice(invoice.uid, 'BSV');
      console.log(invoice.toJSON())

      assert(invoice.uri)
      assert.strictEqual(invoice.currency, "BSV");

      //assert invoice address is the same as the original
      assert.strictEqual(invoice.address, expectedBitcoinAddress );

    });

  });

});

