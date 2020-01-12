require('dotenv').config();

import { Actor } from 'rabbi';

import { findByUid } from '../../lib/invoice';
import { getChangeAddressFromInvoice } from '../../lib/tx_parser';
import { findCashbackMerchantByAccountId } from '../../lib/cashback_merchant';
import { computeCustomerCashBackAmountForInvoice } from '../../lib/calculator';
import { recordCustomerCashback } from '../../lib/persistence';
import { sendToAddress } from '../../lib';
import { isCached, cacheInvoice } from './lib/debounce_cache';

import * as models from '../../models';

export async function start() {

  console.log("starting customers actor"); 

  let actor = Actor.create({

    exchange: 'anypay:invoices',

    routingkey: 'invoice:paid',

    queue: 'cryptozone:cashback:customers'

  });

  await actor.start(async function(channel, message) {

    let invoiceUid = message.content.toString()

    var invoice, account, cashbackMerchant, record;

    try {

      invoice = await findByUid(invoiceUid);

      if (!invoice){

        throw new Error(`invoice not found ${invoiceUid}`);

      }
      
      if (invoice.status === 'underpaid') {

        console.error('invoice underpaid, no cash back');

        return channel.ack(message);

      }

      console.log("found invoice", invoice);

      record = await models.CashbackCustomerPayment.findOne({ where: {

        invoice_id: invoice.id

      }});

      if (!record) {

        console.log('no cashback record found');

        return channel.ack(message);

      }

      cashbackMerchant = await findCashbackMerchantByAccountId(invoice.account_id);

      if (!cashbackMerchant){

        console.log('account.cashback_merchant.notfound', invoice.account_id);

        return channel.ack(message)
      }

      if (!cashbackMerchant.enabled) {

        return channel.ack(message);

      }

      record.currency = invoice.currency;

      await record.save();

      console.log('currency saved', record.currency);

      const amountToSend = await computeCustomerCashBackAmountForInvoice(

        invoice,

        cashbackMerchant

      );

      record.amount = amountToSend;

      await record.save();

      const cashbackAddress = await getChangeAddress(record, invoice);

      record.address = cashbackAddress;

      await record.save();

      record = await models.CashbackCustomerPayment.findOne({ where: {

        invoice_id: invoice.id

      }});

      if (isCached(invoice.uid)) {
        throw new Error(`cashback already sending for invoice ${invoice.uid}`);
      }

      cacheInvoice(invoice.uid); // prevents duplicates for one minute

      console.log('send:customer', `${cashbackAddress}:${amountToSend}`);

      var resp;

      if (!cashbackAddress) {

        console.error('no change address');

        return channel.ack(message);

      }

      try {

        resp = await sendToAddress({
          currency: invoice.currency,
          address: cashbackAddress,
          amount: amountToSend
        });

        console.log('RESP', resp);

      } catch(error) {

        console.log('ERROR', error.response.body);

        return channel.ack(message);

      }

      record.transaction_hash = resp;

      await record.save();

      channel.publish('anypay.cashback', 'cashback.sent', Buffer.from(
        JSON.stringify({
          cashback_merchant_id: cashbackMerchant.id,
          currency: invoice.currency,
          invoice_id: invoice.id,
          transaction_hash: resp,
          amount: amountToSend,
          address: cashbackAddress
        })
      ));

      channel.publish('anypay.cashback', 'cashback.recorded', Buffer.from(
        JSON.stringify(record)
      ));

    } catch(error) {

      console.error(error);
      console.error(error.message);

      if (record) {

        if (error.response && error.response.text) {

          record.error = error.response.text;

        } else {

          record.error = error.message;

        }

        await record.save();
      }

      await channel.publish('anypay.cashback', 'error', Buffer.from(error.message));
      await channel.publish('anypay.cashback', 'error', Buffer.from(error.toString()));

    }

    channel.ack(message);

  });

  await actor.channel.prefetch(1);

}

if (require.main === module) {

  start();
}

async function getChangeAddress(cashbackRecord, invoiceRecord) {

  if (cashbackRecord.address) {

    return cashbackRecord.address

  }

  let address = await getChangeAddressFromInvoice(invoiceRecord);

  return address;
}

