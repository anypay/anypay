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

  log.info('email.sent', recipient, subject ) 

  return new AWS.SES({apiVersion: '2010-12-01'}).sendEmail(params).promise();
  
};

export async function newAccountCreatedEmail(account) {

  let template = templates['new_account_created'];

  return sendEmail(account.email, template.subject, template.body);

};

export async function firstInvoiceCreatedEmail(invoiceId) {
  let template = templates['first_invoice_created'];

  let invoice = await Invoice.findOne({ where: {
    id: invoiceId
  }});

  let account = await Account.findOne({ where: {
    id: invoice.account_id
  }});

  return sendEmail(account.email, template.subject, template.body);

};

export async function firstInvoicePaidEmail(invoice) {
  let template = templates['first_paid_invoice'];

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
  
  let subject = "Anypay ${changeset.currency} address updated"

  let body = "Your Anypay ${changeset.currency} payout address has been updated to ${changeset.address}"

  let account = await Account.findOne({ where: {
    id: changeset.account_id
  }});

  return sendEmail(account.email, subject, body);

}

export async function invoicePaidEmail(invoice){
  
  let subject = "Anypay Invoice Paid!"
 
  let body =  "Invoice ${invoice.uid} was paid at ${invoice.paidAt}. ${invoice.currency} ${invoice.address} recieved ${invoice.amount} ${invoice.currency}!"

  let account = await Account.findOne({ where: {
    id: invoice.account_id
  }});
 
  return sendEmail(account.email, subject, body);

}

emitter.on('create.account', (account) => {
   
  newAccountCreatedEmail(account)
        
})   

emitter.on('invoice.created.first', (invoice)=>{

  firstInvoicePaidEmail(invoice)

})

emitter.on('address:set', (changeset)=>{

  addressChangedEmail(changeset) 

})

emitter.on('invoice.paid', (invoice)=>{

 invoicePaidEmail(invoice) 

})
