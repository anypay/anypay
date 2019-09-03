require('dotenv').config()
import * as requireAll from  'require-all';
import * as AWS from 'aws-sdk';
import {models} from '../models';
import {emitter} from '../events'
import * as database from '../database';
const log = require("winston");
const moment = require('moment');
AWS.config.update({ region: "us-east-1" });
require('./createtemplate')

const FROM_EMAIL = 'Derrick from Anypay <support@anypay.global>';

const templates = requireAll(`${__dirname}/templates`);


export async function sendEmail(recipient, subject, body) {
  var params = {
      Destination: { /* required */
            ToAddresses: [
                    recipient,
                    /* more items */
                  ]
          },
      Message: { /* required */
            Body: { /* required */
                    Html: {
                             Charset: "UTF-8",
                             Data: body
                            },
                    Text: {
                             Charset: "UTF-8",
                             Data: body
                            }
                   },
             Subject: {
                     Charset: 'UTF-8',
                     Data: subject
                    }
            },
      Source: FROM_EMAIL, /* required */
      ReplyToAddresses: [
              'support@anypay.global',
            /* more items */
          ],
  };  

  log.info('email.sent', recipient, subject) 

  return new AWS.SES({apiVersion: '2010-12-01'}).sendEmail(params).promise();
  
};

export async function newAccountCreatedEmail(account) {

  let template = templates['new_account_created'];

  return sendEmail(account.email, template.subject, template.body);

};

export async function firstInvoiceCreatedEmail(invoiceId) {

  let template = templates['first_invoice_created'];

  let invoice = await models.Invoice.findOne({where:{id:invoiceId}})
  let account = await models.Account.findOne({ where: {
    id: invoice.account_id
  }});

  return sendEmail(account.email, template.subject, template.body);

};

export async function unpaidInvoiceEmail(invoiceId) {

  let template = templates['unpaid_invoice'];

  let invoice = await models.Invoice.findOne({ where: {
    id: invoiceId
  }});

  let account = await models.Account.findOne({ where: {
    id: invoice.account_id
  }});

  return sendEmail(account.email, template.subject, template.body);

};

export async function addressChangedEmail(changeset) {
  
  let template = templates['address_changed']

  let subject = template.subject

  subject = subject.replace("CURRENCY", changeset.currency)
  subject = subject.replace("CURRENCY", changeset.currency)

  let body = template.body
  body = body.replace("ADDRESS", changeset.address)
  body = body.replace("CURRENCY", changeset.currency)

  let account = await models.Account.findOne({ where: {
    id: changeset.account_id
  }});

  return sendEmail(account.email, subject, body);

}


export async function invoicePaidEmail(invoice){  

  const account = await  models.Account.findOne({ where: {id:invoice.account_id}})

  const template = {
   
    uid: invoice.uid,
    currency: invoice.currency,
    amount_paid: invoice.invoice_amount_paid.toString(),
    denomination_amount_paid: invoice.denomination_amount_paid,
    denomination: invoice.denomination_currency,
    paidAt : moment(invoice.paidAt).toString()

  }

  const params = {
    Destination: { /* required */
        ToAddresses: [account.email]
    },
    Source: 'receipts@anypayapp.com', /* required */
    Template: 'Anypay_paid', /* required */
    TemplateData: JSON.stringify(template), /* required */
    Tags: [
      {
        Name: 'Anypay_Receipt', /* required */
        Value: 'receipt' /* required */
      }
    ],
    ReplyToAddresses: [
      'support@anypayapp.com',
    ],
  };

  log.info('email.sent', account.email, "receipt") 

  return new AWS.SES({apiVersion: '2010-12-01'}).sendTemplatedEmail(params).promise()

}

export async function firstInvoicePaidEmail(invoice){


  let template = templates["first_paid_invoice"]

  let account = await models.Account.findOne({ where: {
    id: invoice.account_id
  }});

  return sendEmail(account.email, template.subject, template.body);

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
      firstInvoicePaidEmail(invoice)
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

  addressChangedEmail(changeset) 

})

emitter.on('invoice.paid.first', (invoice)=>{

  firstInvoicePaidEmail(invoice)

})

emitter.on('invoice.paid', (invoice)=>{

  checkInvoicePaidCount(invoice)

})
