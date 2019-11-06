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

export async function generateBatch( type?:string, desc?:string):Promise<any>{

  let invoices = await models.Invoice.findAll({ 
          where:{
            status:[ "paid", "underpaid", "overpaid"],
            bank_account_id: { [Op.gt]: 0 }
          }
  })

  const reducer = (accumulator, currentValue) => accumulator + currentValue.sum

  let batch = await models.AchBatch.create({
    amount : invoices.reduce(reducer,0),
    currency: "USD",
    type: "ACH",
    description: "test"
  })

  for( let i=0; i<invoices.length; i++){
    invoices[i].ach_batch_id = batch.id;
    await invoices[i].save();
  }


  return batch;

}

export async function getBatchOutputs( batchId: number): Promise<any[]>{

  // Get all invoices with the batch number 
  let invoices = await models.Invoice.findAll({ 
          where:{
            ach_batch_id : batchId 
          }
  })

  //Reduce the invoices to combine the invoices with the same account and SUM the amount due
  let outputs = invoices.reduce((acc, item)=>{
   if( !acc[item.bank_account_id] ){
     acc[item.bank_account_id] = {
       bank_account_id: item.bank_account_id,
       amount: item.denomination_amount_paid,
       currency: "USD"
     }

   }else{
     acc[item.bank_account_id] += item.denomination_amount_paid;
   }
    return acc
  },{});
  
  console.log("!!", outputs)

  return outputs

}
