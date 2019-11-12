const Op = require('Sequelize').Op;

import * as Sequelize from 'sequelize';

import { models } from '../models';

import * as moment from 'moment';

interface AchBatch_I{
  id: number;
  bank_batch_id: number;
  type: string;
  effective_date: number;
  originating_account: number;
  batch_description: string;
  amount: number;
  currency: string;

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

export async function generateBatchInputs( type?:string, desc?:string):Promise<any>{

  let invoices = await models.Invoice.findAll({ 
          where:{
            status:[ "paid", "underpaid", "overpaid"],
            bank_account_id: { [Op.gt]: 0 },
            ach_batch_id: { [Op.is]: null }
          }
  })

  if( invoices.length > 0 ){

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

    return batch;

  }

  throw new Error(`No invoices to be paid out to ACH at this time (${moment().format()})`);

}

export async function generateBatchOutputs( batchId: number): Promise<any>{

  // Get all invoices with the batch number 
  let inputs = await models.AchBatchInput.findAll({ 
          where:{
            batch_id : batchId 
          }
  })

  let outputs = {}

  //To do - make this functional 
  for( let i=0; i<inputs.length; i++ ){

    let item = inputs[i]

    let invoice = await models.Invoice.findOne({where:{uid : item.invoice_uid}})

    if( !outputs[item.bank_account_id] ){

      console.log('output added', item.bank_account_id )

      outputs[item.bank_account_id] = {

        bank_account_id: item.bank_account_id,

        amount: invoice.denomination_amount_paid,

        currency: "USD",

        invoices: [item.invoice_uid]

      }
   }else{

     outputs[item.bank_account_id].amount += invoice.denomination_amount_paid;

     outputs[item.bank_account_id].invoices.push(invoice.uid) 

   }

  }

  let sum = 0; 

  await Promise.all(Object.keys(outputs).map(async(key:any)=>{
 
    let output = outputs[key];
    
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



export async function batchSent(obj: AchBatch_I){

  let batch = await models.AchBatch.findOne({where:{id:obj.id}})
 
  batch = await batch.update({
    bank_batch_id: obj.bank_batch_id,
    type: obj.type,
    effective_date: obj.effective_date,
    batch_description: obj.batch_description,
    originating_account: obj.originating_account,
    amount: obj.amount,
    currency: obj.currency
  })

  return batch;

}

export async function createAchBatchCSV(batchId: number){

 let batch = await models.AchBatch.findOne({where:{ id: batchId}});

 let outputs = await models.AchBatchOutput.findAll({where: {batch_id: batchId}});

 let obj = await Promise.all( 
         
   outputs.map( async (output:any)=>{

     let bankAccount = await models.BankAccount.findOne({where: {id: output.bank_account_id}})

     if( !bankAccount ){
       throw new Error(`no bank account found with output ${output.bank_account_id}`);
     }

     return {
          'Transaction Code': "ACH",
          'beneficiary_routing_number': bankAccount.routing_number,
          'beneficiary_account_number': bankAccount.beneficiary_account_number,
          'amount': output.amount,
          'anypay_id_number' : process.env.ANYPAY_BANK_ID_NUMBER,
          'anypay_individual_name' : process.env.ANYPAY_BANK_INDIVIDUAL_NAME,
     }
    
   })

 );

 const createCsvStringifier = require('csv-writer').createObjectCsvStringifier;

 const csvStringifier = createCsvStringifier({
   header: [
     {id: 'Transaction Code', title: 'Transaction Code'},
     {id: 'beneficiary_routing_number' , title: 'Receiver Account RTN'},
     {id: 'beneficiary_account_number' , title: 'Receiver Account Number'},
     {id: 'amount', title: 'Amount'},
     {id: 'anypay_id_number', title: 'Individual Identification Number'},
     {id: 'anypay_individual_name', title: 'Individual Name'},
   ]
  });

  //  let header = await csvStringifier.getHeaderString();
  let records = await csvStringifier.stringifyRecords(obj);

  return `${records}`;

}
