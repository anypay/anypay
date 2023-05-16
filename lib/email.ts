require('dotenv').config()
import {models} from './models';
import {events} from './events'
import * as database from './database';

import { config } from './config'

const sender = config.get("EMAIL_SENDER")

import { log } from './log'

const aws = require('aws-sdk');

export const ses = new aws.SES({ region: 'us-east-1' });

import { email as rabbiEmail } from 'rabbi';

export async function sendInvoiceToEmail(uid, email) {

  let invoice = await models.Invoice.findOne({ where: { uid }})

  let account = await models.Account.findOne({ where: { id: invoice.account_id }})

  return rabbiEmail.sendEmail('share-invoice', email, sender, {
    account_id: account.id,
    business_name: account.business_name,
    invoice,
    invoice_uid: invoice.uid,
    denomination_currency: invoice.denomination_currency,
    denomination_amount: invoice.denomination_amount
  });

}

export async function firstAddressSetEmail(account) {

  return rabbiEmail.sendEmail('first_address_set', account.email, sender, {
    account_id: account.id
  });

};


export async function newAccountCreatedEmail(account) {

  return rabbiEmail.sendEmail('welcome', account.email, sender, { email: account.email });

};

export async function firstInvoiceCreatedEmail(email) {

  let account = await models.Account.findOne({ where: { email }})

  let invoice = await models.Invoice.findOne({ where: { account_id: account.id }})

  return rabbiEmail.sendEmail('first_invoice_created', account.email, sender, {
    email: account.email,
    invoice_uid: invoice.uid
  });

};

export async function addressChangedEmail(address_id: number) {

  let address = await models.Address.findOne({ where: {
    id: address_id
  }});

  let account = await models.Account.findOne({ where: {
    id: address.account_id
  }});

  return rabbiEmail.sendEmail('address_updated', account.email, sender, {
    currency: address.currency,
    address: address.value,
    updated_at_time: address.updated_at,
    notePresent: !!address.note,
    note: address.note
  });

}

export async function invoicePaidEmail(invoice){  

  let account = await models.Account.findOne({ where: {
    id: invoice.account_id
  }});

  let variables = {
    invoice_paid_date_time: invoice.completed_at,
    currency: invoice.currency,
    invoiceUID: invoice.uid,
    denomination_currency: invoice.denomination_currency,
    amount_paid: invoice.invoice_amount_paid,
    denomination_amount_paid: invoice.denomination_amount_paid,
    businessName: account.business_name,
    businessStreetAddress: account.business_street_address,
    businessCity: account.business_city,
    businessState: account.business_state,
    businessZip: account.business_zip
  };

  let resp = await rabbiEmail.sendEmail(
    'invoice_paid_receipt',
    account.email,
    config.get('EMAIL_SENDER'),
    variables
  )

  return resp;
}

export async function firstInvoicePaidEmail(invoice){  

  let account = await models.Account.findOne({ where: {
    id: invoice.account_id
  }});

  let resp = await rabbiEmail.sendEmail(
    'first_invoice_paid',
    account.email,
    config.get('EMAIL_SENDER')
  )

  return resp;
}

async function checkInvoiceCount(invoice){

  const query = `SELECT COUNT(*) FROM invoices WHERE account_id=${invoice.account_id};`

  try{

    var result = await database.query(query);

    if(result[1].rows[0].count==1){

      firstInvoiceCreatedEmail(invoice.id)
      log.debug('email.invoice.created.first')

    }
  }catch(error){
    log.error('checkInvoiceCount.error', error)
  }

}

events.on('account.created', (account) => {
   
  newAccountCreatedEmail(account)
    
})   

events.on('invoice.created', (invoice)=>{
 
  checkInvoiceCount(invoice)
 
})

events.on('address.set', (changeset)=>{

  addressChangedEmail(changeset.address_id) 

})

