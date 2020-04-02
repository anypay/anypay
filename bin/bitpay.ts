#!/usr/bin/env ts-node

import * as program from 'commander';

import * as http from 'superagent';

import { channel, awaitChannel, wait } from '../lib/amqp';
import { models } from '../lib';

async function generateInvoice(amount, uid="12345") {

  let resp = await http
    .post('https://crypto-invoice-generator.egifter.com/v1/Bitpay')
    .set('Content-Type', 'application/json')
    .send({
      "amount": parseFloat(amount),
      "description": "anypay settlement",
      "orderId": uid,
      "email": "dashsupport@egifter.com"
    })

  return resp.body;

}

program
  .command('invoice <amount>')
  .action(async (amount) => {

    try {
      let resp = await generateInvoice(amount);

      console.log(resp);

    } catch(error) {

      console.log(error);

    }

    process.exit(0);

  });

program
  .command('createsettlement <invoiceUID>')
  .action(async (uid) => {

    try {

      let invoice = await models.Invoice.findOne({ where: { uid }});

      if (!invoice) {
        throw new Error('invoice not found');
      }

      let [settlement, isNew] = await models.Settlement.findOrCreate({
        where: {
          invoice_uid: invoice.uid
        },

        defaults: {
          invoice_uid: invoice.uid
        }
      })

      if (!isNew) {
        console.log('settlement already created for invoice');
      } else {
        invoice.settlement_id = settlement.id;
        await invoice.save();
      }

      if (settlement.txid) {
        throw new Error('invoice already settled');
      }

      let bitpayInvoice = await generateInvoice(
        invoice.denomination_amount_paid,
        `anypay:${invoice.uid}|egifter:${invoice.external_id}`
      );

      settlement.url = bitpayInvoice.url;

      await settlement.save();

      console.log(bitpayInvoice);
      console.log(settlement.toJSON());

    } catch(error) {

      console.log(error);

    }

    process.exit(0);

  });

program
  .command('recordsettlement <invoice_uid> <txid> [amount] [currency]')
  .action(async (uid, txid, amount, currency) => {

    try {

      let settlement = await models.Settlement.findOne({ where: {
        invoice_uid: uid
      }});

      settlement.txid = txid;
      settlement.amount = amount;
      settlement.currency = currency;

      await settlement.save();

      console.log(settlement.toJSON());

    } catch(error) {

      console.log(error);

    }

    process.exit(0);

  });


program.parse(process.argv);

