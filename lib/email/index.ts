require('dotenv').config()
import * as requireAll from  'require-all';
import * as AWS from 'aws-sdk';
import {Account, Invoice} from '../models';
import {emitter} from '../events'
const log = require("winston");
AWS.config.update({ region: "us-east-1" });

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

  let invoice = await Invoice.findOne({where:{id:invoiceId}})
  let account = await Account.findOne({ where: {
    id: invoice.account_id
  }});

  return sendEmail(account.email, template.subject, template.body);

};

export async function unpaidInvoiceEmail(invoiceId) {

  let template = templates['unpaid_invoice'];

  let invoice = await Invoice.findOne({ where: {
    id: invoiceId
  }});

  let account = await Account.findOne({ where: {
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

  let account = await Account.findOne({ where: {
    id: changeset.account_id
  }});

  return sendEmail(account.email, subject, body);

}


export async function invoicePaidEmail(invoice){
  
  let template = templates['invoice_paid'];

  let account = await Account.findOne({ where: {
    id: invoice.account_id
  }});

  let body = template.body
  body = body.replace("UID", invoice.uid)
  body = body.replace("TIMEPAID", invoice.updatedAt)
  body = body.replace("CURRENCYAMOUNT", invoice.amount)
  body = body.replace("CURRENCY", invoice.currency)
  return sendEmail(account.email, template.subject, body);

}

export async function firstInvoicePaidEmail(invoice){


  let template = templates["first_paid_invoice"]

  let account = await Account.findOne({ where: {
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

  invoicePaidEmail(invoice) 

})
