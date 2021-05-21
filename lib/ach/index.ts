
import * as wire from '../wire';

import { BigNumber } from 'bignumber.js';
import * as Sequelize from 'sequelize';

import * as assert from 'assert';

import * as moment from 'moment';
import { email as rabbiEmail } from 'rabbi';

import { Op } from 'sequelize';

import { models } from '../models';
import { log } from '../logger';

import { debitACH } from '../anypayx'

export async function createNewBatches(account_id: number) {

  let now = moment()

  let lastBatch = await models.AchBatch.findOne({
    where: {
      payments_date: {
        [Op.ne]: null 
      },
      account_id
    },
    order: [['payments_date', 'DESC']]
  })

  try {

    // while the cursor is still one day or more greater than the latest batch
    while(moment(lastBatch.payments_date).toDate() < now.toDate()) {

      let nextDay = moment(lastBatch.payments_date).add(1, 'day')

      let { ach_batch } = await generateBatchForDate(account_id, nextDay.toDate())

      lastBatch = ach_batch

      log.info('ach.batch.create', lastBatch.toJSON())

    }

  } catch(error) {
 
    log.error(error.message)

  }

}

export async function createNextACH(account_id: number) {

  let unsent = await models.AchBatch.findOne({

    where : {
      batch_id: { [Op.is]: null },
      account_id
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
      batch_id: { [Op.not]: null },
      account_id
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

  let {ach_batch, invoices} = await  generateBatchForDate(account_id, nextBatchDate);

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

export async function generateLatestBatch(account_id: number, endDate: Date, note: string, paymentsDate: Date) {

  if (moment().toDate() <= endDate) {
    throw new Error('Date Has Not Yet Completed')
  }

  let account = await models.Account.findOne({ where: { id: account_id }})

  let invoices = await wire.getInvoicesByDates(account.id, paymentsDate, endDate);

  // filter invoices on or after the end date

  invoices = invoices.filter(invoice => {

    return invoice.completed_at < endDate;

  });

  let sum = invoices.reduce((sum, invoice) => {

    let amount_paid = new BigNumber(invoice.denomination_amount_paid); 
    let cash_back = new BigNumber(invoice.cashback_denomination_amount); 

    return sum.plus(amount_paid).minus(cash_back);
  
  }, new BigNumber(0)).toNumber();

  console.log(`${invoices.length} payments for next batch totaling $${sum}`);

  var first_invoice_uid, last_invoice_uid, status;

  if (invoices[invoices.length - 1]) {

    first_invoice_uid = invoices[invoices.length - 1].uid

  }

  if (invoices[0]) {

    last_invoice_uid = invoices[0].uid
    
  }

  if (sum > 0) {

    status = 'pending'

  } else {

    status = 'n/a'

  }

  let ach_batch = await models.AchBatch.create({

    account_id: account.id,

    first_invoice_uid,

    last_invoice_uid,

    type: 'ACH',

    batch_description: note || 'ACH batch from sudo admin',

    originating_account: 'Mercury Bank ACH',

    status,

    currency: 'USD',

    payments_date: paymentsDate,

    amount: sum

  });

  await Promise.all(invoices.map(async (invoice) => {
    invoice.ach_batch_id = ach_batch.id
    await invoice.save();
  }));

  return { ach_batch, invoices };
}

export async function sendAchReportEmail(ach_batch_id, email) {

  console.log('SEND ACH REPORT EMAIL', {ach_batch_id, email})

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

  let date = moment(invoices[0].completed_at).format('LL');

  batch = batch.toJSON();

  batch.amount = batch.amount.toFixed(2);

  let emailParams = {
    templateName: 'egifter-ach-receipt',
    to: [email],
    from: 'receipts@anypayx.com',
    bcc: [
      'steven@anypayx.com',
      'derrick@anypayx.com'
    ],
    replyTo: [
      'steven@anypayx.com',
      'derrick@anypayx.com'
    ],
    subject: `ACH Sent From Anypay $${batch.amount} - for ${date}`,
    vars: {
      invoices,
      batch,
      date
    }
  }

  if (email === 'dashsupport@egifter.com') {
    emailParams['cc'] = ['accounting@egifter.com']
  }

  console.log('email params', emailParams)

  let resp = await rabbiEmail.send(emailParams)

  return resp;

}

export async function generateBatchForDate(account_id: number, MMDDYY) {

  log.info(`generate batch for date ${MMDDYY}`)

  let note = `ACH batch from command line using invoices for ${MMDDYY}` 

  let paymentsDate = moment(MMDDYY)

  let end_date = moment(MMDDYY).add(1, 'day').toDate();

  let existingBatch = await models.AchBatch.findOne({ where: {
    payments_date: paymentsDate.toDate(),
    account_id
  }})

  if (existingBatch) {
    console.log('existing batch', existingBatch.toJSON())
    throw new Error(`Batch Already Exists For Payments On ${paymentsDate}`)
  }

  let {ach_batch, invoices}= await generateLatestBatch(account_id, end_date, note, paymentsDate.toDate());

  invoices.forEach(invoice => {
    assert(invoice.ach_batch_id = ach_batch.id);
  });

  return {ach_batch, invoices};

}

export async function handleCompletedACH(id: number, batch_id: string, effective_date: string) {

  log.info({ action: 'ach.update', batch_id, effective_date })

  let update = {

    batch_id: batch_id,

    effective_date: moment(effective_date).toDate(),

    status: 'sent'

  }

  let where = {

    id,

    status: 'pending'

  }

  log.info('ach.update', {
    update, where
  })

  let updatedRecord = await models.AchBatch.update(update, {

    where,

    returning: true

  });

  console.log('record', updatedRecord)

  let ach_batch = await models.AchBatch.findOne({ where: { id }})

  let account = await models.Account.findOne({
    where: {
      id: ach_batch.account_id
    }
  })

  await sendAchReportEmail(id, account.email);

  await debitACH(ach_batch.id)

  return { ach_batch };

}

