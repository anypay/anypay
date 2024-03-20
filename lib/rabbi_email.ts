require('dotenv').config()
const requireAll = require('require-all');
import * as AWS from 'aws-sdk';
AWS.config.update({ region: "us-east-1" });
import { join } from 'path';
import { existsSync as fileExists } from 'fs'

const emailsDirectory =  join(process.cwd(), 'emails')

const emails = fileExists(emailsDirectory) ? Object.entries(requireAll(emailsDirectory)).map(([key, value]) => {
    let e: any = value;
    return [key, e.index.default];
  })
  .reduce((acc: any, item: any) => {

    acc[item[0]] = item[1];

    return acc;

  }, {}) : {}


interface EmailSend {
  templateName: string;
  from: string;
  to: string[];
  replyTo?: string[];
  vars?: any;
  cc?: string[];
  bcc?: string[];
  subject?: string;
}

export async function send(params: EmailSend) {

  let email: any = emails[params.templateName];

  // Create sendEmail params
  var sesParams = {
    Destination: { /* required */
      ToAddresses: params.to,
      CcAddresses: params.cc,
      BccAddresses: params.bcc
    },
    Message: { /* required */
      Body: { /* required */
        Html: {
         Charset: "UTF-8",
         Data: email.template(params.vars)
        },
        Text: {
         Charset: "UTF-8",
         Data: email.template(params.vars)
        }
      },
      Subject: {
        Charset: 'UTF-8',
        Data: params.subject || email.title
      }
    },
    Source: params.from, /* required */
    ReplyToAddresses: params.replyTo
  };

  // Create the promise and SES service object
  var sendPromise = new AWS.SES({apiVersion: '2010-12-01'}).sendEmail(sesParams).promise();

  // Handle promise's fulfilled/rejected states
  return sendPromise

}

export async function sendEmail(templateName: string, emailAddress: string, fromEmail: string, vars:any={}) {

  let email: any = emails[templateName];

  if (!vars.emailAddress) {
    vars.emailAddress = emailAddress;
  }

  // Create sendEmail params
  var params = {
    Destination: { /* required */
      ToAddresses: [
        emailAddress
      ]
    },
    Message: { /* required */
      Body: { /* required */
        Html: {
         Charset: "UTF-8",
         Data: email.template(vars)
        },
        Text: {
         Charset: "UTF-8",
         Data: email.template(vars)
        }
       },
       Subject: {
        Charset: 'UTF-8',
        Data: email.title
       }
      },
    Source: fromEmail, /* required */
    ReplyToAddresses: [
       'steven@anypayinc.com',
      /* more items */
    ],
  };

  // Create the promise and SES service object
  var sendPromise = new AWS.SES({apiVersion: '2010-12-01'}).sendEmail(params).promise();

  // Handle promise's fulfilled/rejected states
  return sendPromise

}
