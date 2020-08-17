require('dotenv').config();

import * as AWS from 'aws-sdk';

AWS.config.update({ region: "us-east-1" });

const FROM_EMAIL = 'payroll@anypayinc.com'

import { models, log } from '../';

export async function sendPayrollReceipt(payrollPaymentId: number) {

  let payrollPayment = await models.PayrollPayment.findOne({ where: {

    id: payrollPaymentId

  }});

  if (!payrollPayment) {

    throw new Error(`payroll payment with id ${payrollPaymentId} not found`);

  }

  let payrollAccount = await models.PayrollAccount.findOne({ where: {

    id: payrollPayment.payroll_account_id

  }});

  let account = await models.Account.findOne({ where: {

    id: payrollAccount.account_id

  }})

  let subject = `Anypay Payroll Receipt for ${new Date()}`;

  let body = `Payroll for Fri Oct 26 2018 20:13:26 GMT+0000 (UTC)\n\n Sent
  ${payrollPayment.amount}  to ${payrollPayment.address}\n\n https://bitcoincash.blockexplorer.com/tx/${payrollPayment.hash}`;


  try {

    let emailResp = await sendEmail(account.email, subject, body);

  } catch(error) {

    log.error(error.message);

  }

}

function sendEmail(recipient, subject, body) {
  var params = {
      Destination: { /* required */
            ToAddresses: [
                    recipient,

                    /* more items */
                  ],

            BccAddresses: [
              'steven@anypayinc.com' 
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
              'steven@anypayinc.com',
            /* more items */
          ],
  };  

  return new AWS.SES({apiVersion: '2010-12-01'}).sendEmail(params).promise();
  
};
