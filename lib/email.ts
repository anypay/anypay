require('dotenv').config()

import {events} from './events'
import * as database from './database';

import { config } from './config'

const sender = config.get("EMAIL_SENDER")

import { log } from './log'

const aws = require('aws-sdk');

export const ses = new aws.SES({ region: 'us-east-1' });

import * as rabbiEmail from './rabbi_email'

import {
  accounts as Account,
  invoices as Invoice
} from '@prisma/client'

import prisma from './prisma';

export async function sendInvoiceToEmail(uid: string, email: string) {

  const invoice = await prisma.invoices.findFirstOrThrow({
    where: {
      uid
    }
  
  })

  const account = await prisma.accounts.findFirstOrThrow({
    where: {
      id: Number(invoice.account_id)
    }
  })

  return rabbiEmail.sendEmail('share-invoice', email, sender, {
    account_id: account.id,
    business_name: account.business_name,
    invoice,
    invoice_uid: invoice.uid,
    denomination_currency: invoice.denomination_currency,
    denomination_amount: invoice.denomination_amount
  });

}

export async function firstAddressSetEmail(account: Account) {

  return rabbiEmail.sendEmail('first_address_set', String(account.email), sender, {
    account_id: account.id
  });

};


export async function newAccountCreatedEmail(account: Account) {

  return rabbiEmail.sendEmail('welcome', String(account.email), sender, { email: account.email });

};

export async function firstInvoiceCreatedEmail(email: string) {

  const account = await prisma.accounts.findFirstOrThrow({
    where: {
      email
    }
  })

  const invoice = await prisma.invoices.findFirstOrThrow({
    where: {
      account_id: account.id
    }
  })

  return rabbiEmail.sendEmail('first_invoice_created', String(account.email), sender, {
    email: account.email,
    invoice_uid: invoice.uid
  });

};

export async function addressChangedEmail(address_id: number) {

  const address = await prisma.addresses.findFirstOrThrow({
    where: {
      id: address_id
    }
  })

  const account = await prisma.accounts.findFirstOrThrow({
    where: {
      id: Number(address.account_id)
    }
  })



  return rabbiEmail.sendEmail('address_updated', String(account.email), sender, {
    currency: address.currency,
    address: address.value,
    updated_at_time: address.updatedAt,
    notePresent: !!address.note,
    note: address.note
  });

}

export async function invoicePaidEmail(invoice: Invoice) {  

  const account = await prisma.accounts.findFirstOrThrow({
    where: {
      id: Number(invoice.account_id)
    }
  })

  const variables = {
    invoice_paid_date_time: invoice.completed_at,
    currency: invoice.currency,
    invoiceUID: invoice.uid,
    denomination_currency: invoice.denomination_currency,
    amount_paid: invoice.invoice_amount_paid,
    denomination_amount_paid: invoice.denomination_amount_paid,
    businessName: account.business_name,
    //businessStreetAddress: account.business_street_address,
    //businessCity: account.business_city,
    //businessState: account.business_state,
    //businessZip: account.business_zip
  };

  let resp = await rabbiEmail.sendEmail(
    'invoice_paid_receipt',
    String(account.email),
    config.get('EMAIL_SENDER'),
    variables
  )

  return resp;
}

export async function firstInvoicePaidEmail(invoice: Invoice){  

  const account = await prisma.accounts.findFirstOrThrow({
    where: {
      id: Number(invoice.account_id)
    }
  })

  let resp = await rabbiEmail.sendEmail(
    'first_invoice_paid',
    String(account.email),
    config.get('EMAIL_SENDER')
  )

  return resp;
}

async function checkInvoiceCount(invoice: Invoice){

  const query = `SELECT COUNT(*) FROM invoices WHERE account_id=${invoice.account_id};`

  try{

    var result = await database.query(query);

    if(result[1].rows[0].count==1){

      const account = await prisma.accounts.findFirstOrThrow({
        where: {
          id: Number(invoice.account_id)
        }
      })

      firstInvoiceCreatedEmail(String(account.email))
      log.debug('email.invoice.created.first')

    }
  }catch(error: any){
    log.error('checkInvoiceCount.error', error)
  }

}

events.on('account.created', (account: Account) => {
   
  newAccountCreatedEmail(account)
    
})   

events.on('invoice.created', (invoice: Invoice)=>{
 
  checkInvoiceCount(invoice)
 
})

events.on('address.set', (changeset: {address_id: number})=>{

  addressChangedEmail(changeset.address_id) 

})

