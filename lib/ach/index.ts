const Op = require('Sequelize').Op;

import * as Sequelize from 'sequelize';

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

export async function generateBatchInputs( type?:string, desc?:string):Promise<any>{

  let invoices = await models.Invoice.findAll({ 
          where:{
            status:[ "paid", "underpaid", "overpaid"],
            bank_account_id: { [Op.gt]: 0 },
            ach_batch_id: { [Op.is]: null }
          }
  })

  let batch = await models.AchBatch.create({
    currency: "USD",
    type: "ACH",
    description: "test"
  })

  await Promise.all(invoices.map(async(invoice) =>{

    await invoice.update({  ach_batch_id: batch.id })
    await  models.AchBatchInput.create({
      batch_id: batch.id,
      amount: invoice.denomination_amount_paid,
      invoice_uid: invoice.uid,
      bank_account_id: invoice.bank_account_id
    })
  }));


  console.log('batch.id', batch.id)

  let inputs = await models.AchBatchInput.findAll({where: {batch_id: batch.id}});

  console.log('INPUTS!', inputs)

  return inputs;

}

export async function generateBatchOutputs( batchId: number): Promise<any>{

  // Get all invoices with the batch number 
  let inputs = await models.AchBatchInput.findAll({ 
          where:{
            batch_id : batchId 
          }
  })

  //Reduce the invoices to combine the invoices with the same account and SUM the amount due
  let outputs = inputs.reduce( async (acc, item)=>{

    let invoice = await models.Invoice.findOne({where:{uid : item.invoice_uid}})

    if( !acc[item.bank_account_id] ){

      acc[item.bank_account_id] = {

        bank_account_id: item.bank_account_id,

        amount: invoice.denomination_amount_paid,

        currency: "USD",

        invoices: [item.uid]

      }
   }else{

     acc[item.bank_account_id].amount += invoice.denomination_amount_paid;

     acc[item.bank_account_id].invoices.push(invoice.uid) 

   }

   return acc

  },{});


  let sum = 0; 

  await Promise.all(Object.keys(outputs).map(async(output:any)=>{

    console.log('!', output)
    await models.AchBatchOutput.create({
       batch_id: batchId,
       bank_account_id: output.bank_account_id,
       amount: output.amount,
       currency: output.currency
    })

    sum += output.amount;

  }))

  let batch = await models.AchBatch.findOne({where:{id: batchId}})

  await batch.update({
    amount : sum 
  })

  outputs = await models.AchBatchOutput.findAll({where: {batch_id: batchId}});

  return outputs; 

}

