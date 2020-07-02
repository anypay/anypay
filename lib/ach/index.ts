
import * as wire from '../wire';

import { BigNumber } from 'bignumber.js';
import * as Sequelize from 'sequelize';

import * as assert from 'assert';

import * as moment from 'moment';
import { email as rabbiEmail } from 'rabbi';

import { Op } from 'sequelize';

import { models } from '../models';

export async function createNextACH() {

  let unsent = await models.AchBatch.findOne({

    where : {
      batch_id: { [Op.is]: null }
    }, 

    order: [['id', 'desc']],

    limit: 1

  });

  if (unsent) {
    console.log('unsent ach found');

    let invoices = await models.Invoice.findAll({
      where: {ach_batch_id: unsent.id}
    })

    return {ach_batch: unsent, invoices}
  }
 
  console.log('no unsent ach found');

  let latest = await models.AchBatch.findOne({

    where : {
      batch_id: { [Op.not]: null }
    }, 

    order: [['id', 'desc']],

    limit: 1

  });

  console.log(latest);

  let lastInvoice = await models.Invoice.findOne({
    where: { uid: latest.last_invoice_uid }
  })

  let batch_date = moment(lastInvoice.paidAt).format('MM-DD-YYYY');

  console.log('last batch date', batch_date);

  let nextBatchDate = moment(lastInvoice.paidAt).add(1, 'day').format('MM-DD-YYYY');

  console.log('next batch date', nextBatchDate);

  let {ach_batch, invoices} = await  generateBatchForDate(nextBatchDate);

  return {ach_batch, invoices}

}

export async function getInvoiceRange(startUid:string, endUid:string, where:any={}) {

  let start = await models.Invoice.findOne({ where: { uid: startUid }});
  let end = await models.Invoice.findOne({ where: { uid: endUid }});

  where['id'] = {
    [Sequelize.Op.gte]: start.id,
    [Sequelize.Op.lte]: end.id
  }

  return models.Invoice.findAll({ where });

}

export async function importInvoiceRangeForAchBatch(accountAchId: number): Promise<any[]> {

  var newRecords = [];

  let accountAch = await models.AccountAch.findOne({ where: {

    id: accountAchId

  }});

  let invoices = await getInvoiceRange(
    accountAch.first_invoice_uid,
    accountAch.last_invoice_uid,
    {
      account_id: accountAch.account_id 
    }
  );

  for (let i = 0; i < invoices.length; i++) {

    let invoice = invoices[i];

    let [record, isNew] = await models.AccountAchInvoice.findOrCreate({

      where: {

        invoice_uid: invoice.uid,

        account_ach_id: accountAchId

      },

      defaults: {

        invoice_uid: invoice.uid,

        account_ach_id: accountAchId

      }

    });

    if (isNew) {

      newRecords.push(isNew);

    }

  }
 
  return newRecords;

}

export async function generateLatestBatch(endDate, note) {

  let latestBatch = await models.AchBatch.findOne({

    where: {

      effective_date: {

        [Op.ne]: null

      }

    },

    order: [['id', 'DESC']]

  })

  if (!latestBatch.batch_id) {

    throw new Error('An outstanding ACH Batch still needs to be sent and updated with Batch ID')
  }

  let invoices = await wire.getInvoices(latestBatch.last_invoice_uid);

  // filter invoices on or after the end date

  invoices = invoices.filter(invoice => {

    return invoice.completed_at < endDate;

  });

  if (invoices.length === 0) {

    console.log(`no invoices paid on ${moment(endDate).format('DD/MM/YYYY')}`);

    endDate = moment(endDate).add(1, 'days').toDate();

    return generateLatestBatch(endDate, note)

  }

  let sum = invoices.reduce((sum, invoice) => {

    let amount_paid = new BigNumber(invoice.denomination_amount_paid); 
    let cash_back = new BigNumber(invoice.cashback_denomination_amount); 

    return sum.plus(amount_paid).minus(cash_back);
  
  }, new BigNumber(0)).toNumber();

  console.log(`${invoices.length} payments for next batch totaling $${sum}`);

  let ach_batch = await models.AchBatch.create({

    first_invoice_uid: invoices[invoices.length - 1].uid,

    last_invoice_uid: invoices[0].uid,

    type: 'ACH',

    batch_description: note || 'ACH batch from sudo admin',

    originating_account: 'Mercury Bank ACH',

    currency: 'USD',

    amount: sum

  });

  await Promise.all(invoices.map(async (invoice) => {
    invoice.ach_batch_id = ach_batch.id
    await invoice.save();
  }));

  return { ach_batch, invoices };
}

export async function sendEgifterAchReceipt(ach_batch_id, email) {

  let invoices = await models.Invoice.findAll({

    where: {

      ach_batch_id

    },

    order: [["id", "desc"]]

  });

  let batch = await models.AchBatch.findOne({
    where: { id: ach_batch_id }
  });

  invoices = invoices.map(invoice => {

    let json = invoice.toJSON();

    json.egifter_receives = (json.denomination_amount_paid - json.cashback_denomination_amount).toFixed(2);

    json.denomination_amount_paid = json.denomination_amount_paid.toFixed(2);
    json.cashback_denomination_amount = json.cashback_denomination_amount.toFixed(2);

    return json;
  
  });

  console.log(`${invoices.length} invoices found`);

  let date = moment(invoices[0].completed_at).format('L');

  batch = batch.toJSON();

  batch.amount = batch.amount.toFixed(2);

  let resp = await rabbiEmail.send({
    templateName: 'egifter-ach-receipt',
    to: [email],
    from: 'receipts@anypayinc.com',
    cc: ['judy@egifter.com'],
    bcc: [
      'steven@anypayinc.com',
      'derrick@anypayinc.com'
    ],
    replyTo: [
      'steven@anypayinc.com',
      'derrick@anypayinc.com'
    ],
    subject: `ACH Sent From Anypay $${batch.amount} - for ${date}`,
    vars: {
      invoices,
      batch,
      date
    }
  })

  return resp;

}

export async function generateBatchForDate(MMDDYY) {

  let note = `ACH batch from command line using invoices for ${MMDDYY}` 

  let end_date = moment(MMDDYY).add(1, 'day').toDate();

  let {ach_batch, invoices}= await generateLatestBatch(end_date, note);

  invoices.forEach(invoice => {
    assert(invoice.ach_batch_id = ach_batch.id);
  });

  return {ach_batch, invoices};

}


