require('dotenv').config()
import * as requireAll from  'require-all';
import * as AWS from 'aws-sdk';
import {models} from '../models';
import {emitter} from '../events'
import * as database from '../database';
const log = require("winston");
const moment = require('moment');

import { getBlockExplorerTxidUrl } from '../block_explorer';

import { email as rabbiEmail } from 'rabbi';

export async function firstAddressSetEmail(account) {

  return rabbiEmail.sendEmail('first_address_set', account.email, 'Anypay<support@anypayinc.com>', {
    account_id: account.id
  });

};


export async function newAccountCreatedEmail(account) {

  return rabbiEmail.sendEmail('welcome', account.email, 'Anypay<support@anypayinc.com>', { email: account.email });

};

export async function firstInvoiceCreatedEmail(email) {

  let account = await models.Account.findOne({ where: { email }})

  let invoice = await models.Invoice.findOne({ where: { account_id: account.id }})

  return rabbiEmail.sendEmail('first_invoice_created', account.email, 'Anypay<support@anypayinc.com>', {
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

  return rabbiEmail.sendEmail('address_updated', account.email, 'Anypay<support@anypayinc.com>', {
    currency: address.currency,
    address: address.value,
    updated_at_time: address.updated_at,
    notePresent: !!address.note,
    note: address.note
  });

}

export async function ambassadorRewardEmail(invoice_uid){  

  let invoice = await models.Invoice.findOne({ where: {
    uid: invoice_uid
  }});

  let reward = await models.AmbassadorReward.findOne({ where: {
    invoice_uid: invoice.uid
  }});

  let ambassador = await models.Ambassador.findOne({ where: {
    id: reward.ambassador_id
  }});

  let account = await models.Account.findOne({ where: {
    id: ambassador.account_id
  }});

  let business = await models.Account.findOne({ where: {
    id: invoice.account_id
  }});

  // compute denomination amount
  // get the price of the currency at that time
  // x dollars per currency
  let price = invoice.denomination_amount_paid / invoice.invoice_amount_paid;

  let denomination_amount = (reward.amount * price).toFixed(4);

  let rewardExplorerUrl = getBlockExplorerTxidUrl(reward);

  let variables = {
    invoice_paid_date_time: invoice.completed_at,
    currency: reward.currency,
    rewardTxid: reward.txid,
    rewardAmount: reward.amount,
    rewardAddress: reward.address,
    rewardCurrency: reward.currency,
    rewardExplorerUrl,
    denomination_currency: invoice.denomination_currency,
    amount_paid: reward.invoice_amount_paid,
    denomination_amount_paid: denomination_amount,
    businessName: business.business_name,
    businessStreetAddress: business.business_street_address,
    businessCity: business.business_city,
    businessState: business.business_state,
    businessZip: business.business_zip
  };

  let resp = await rabbiEmail.sendEmail(
    'ambassador_reward',
    account.email,
    'support@anypayinc.com',
    variables
  )

  return resp;
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
    'support@anypayinc.com',
    variables
  )

  return resp;
}

async function checkInvoiceCount(invoice){

  const query = `SELECT COUNT(*) FROM invoices WHERE account_id=${invoice.account_id};`

  try{

    var result = await database.query(query);

    if(result[1].rows[0].count==1){

      firstInvoiceCreatedEmail(invoice.id)
      emitter.emit('invoice.created.first')

    }
  }catch(error){
    log.error(error)
  }


}

async function checkInvoicePaidCount(invoice){

  const query = `SELECT COUNT(*) FROM invoices WHERE account_id=${invoice.account_id} AND status='paid';`
  
  try{
  
    var result = await database.query(query);

    if(result[1].rows[0].count==1){
      emitter.emit('invoice.paid.first', invoice)
      //firstInvoicePaidEmail(invoice)
    }
    else{
      invoicePaidEmail(invoice)
    }

  }catch(err){
    log.error(err)
  }

}

emitter.on('account.created', (account) => {
   
  newAccountCreatedEmail(account)
    
})   

emitter.on('invoice.created', (invoice)=>{
 
  checkInvoiceCount(invoice)
 
})

emitter.on('address.set', (changeset)=>{

  addressChangedEmail(changeset.address_id) 

})

emitter.on('invoice.paid.first', (invoice)=>{
  // first invoice paid email
})

