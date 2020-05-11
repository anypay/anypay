
import * as wire from '../wire';

import { BigNumber } from 'bignumber.js';
import * as Sequelize from 'sequelize';


import { Op } from 'sequelize';

import { models } from '../models';

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
