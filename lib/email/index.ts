import * as requireAll from  'require-all';
import * as AWS from 'aws-sdk';
import {Account, Invoice} from '../models';

AWS.config.update({ region: "us-east-1" });

const FROM_EMAIL = 'Derrick from Anypay <welcome@anypay.global>';

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
              'derrick@anypay.global',
            /* more items */
          ],
  };  

  return new AWS.SES({apiVersion: '2010-12-01'}).sendEmail(params).promise();
  
};

export async function newAccountCreatedEmail(accountId) {
  let template = templates['new_account_created'];

  let account = await Account.findOne({ where: {
    id: accountId
  }});

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

export async function firstInvoicePaidEmail(invoiceId) {
  let template = templates['first_paid_invoice'];

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

