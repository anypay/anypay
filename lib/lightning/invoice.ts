import * as http from 'superagent';
import {Invoice} from '../models';

export async function generateLightningInvoice(amount: number) {

  let response = await http.post(`${process.env.LIGHTNING_SERVICE}/invoices`).send({
    amount: amount
  });

  return JSON.parse(response.text);
}

export async function create(amount: number, accountId: number) {

  let lightningInvoice = await generateLightningInvoice(amount);

  console.log("LI", lightningInvoice);
  try {
    let invoiceChangeSet = {
      account_id: accountId,
      amount: amount,
      address: lightningInvoice.Pay_req,
      uid: lightningInvoice.R_hash,
      currency: 'BTC.lightning'
    }
    console.log('invoice changeset', invoiceChangeSet);

    let invoiceRecord = await Invoice.create(invoiceChangeSet);

    console.log('generated invoice record', invoiceRecord);

  return invoiceRecord;


  } catch(error) {
    console.log('error', error); 
  }

  // Generate Lightning Invoice From Service
}

