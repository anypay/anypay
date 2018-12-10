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

  let invoice = await Invoice.findOne({ where: {
    id: invoiceId
  }});

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
  
  let subject = `Anypay ${changeset.currency} address was set! Your business is now ready to accept ${changeset.currency}!` 

  let body = `Your Anypay ${changeset.currency} payout address has been updated to ${changeset.address}
  
  Wasn’t you? Hm… Maybe you should sign into your account at https://admin.anypay.global and double-check that your {coin} address is set to what you want it to be.
  
  
  Questions? Visit our Support Desk for help, or reply to this email.
  
  Best,  Derrick J Freeman` 

  let account = await Account.findOne({ where: {
    id: changeset.account_id
  }});

  return sendEmail(account.email, subject, body);

}

export async function invoicePaidEmail(invoice){
  
  let subject = "Anypay Invoice Paid!"
 
  let body = `Invoice ${invoice.uid} was paid at ${invoice.paidAt}. ${invoice.currency} ${invoice.address} recieved ${invoice.amount} ${invoice.currency}!` 

  let account = await Account.findOne({ where: {
    id: invoice.account_id
  }});
 
  return sendEmail(account.email, subject, body);

}

export async function firstInvoicePaidEmail(invoice){

  let subject = "Cha-ching! Your first paid invoice!"

  let body = "Was it you, just testing the system, or did you really get paid? Either way, you will see the payment from your invoice right away in your wallet. Go check now! See? Your money will go there every time. Each coin address you set will be the ones receiving payments in each respective coin. 
  
  Pretty cool, huh?
  
  Go make another one and show your staff how it is done so they know what to do when a customer comes in to spend crypto at your business.
  
  Questions? Visit our Support Desk for help, or reply to this email.

  Best, 
  Derrick J Freeman"
  

  let account = await Account.findOne({ where: {
    id: invoice.account_id
  }});

  return sendEmail(account.email, subject, body);

}

emitter.on('account.created', (account) => {
   
  newAccountCreatedEmail(account)
    
})   

emitter.on('invoice.created.first', (invoice)=>{

  firstInvoiceCreatedEmail(invoice.id)

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
