const bcrypt = require('bcrypt');
const Account = require('./models/account');
const PasswordReset = require('./models/password_resets');
const uuid = require('uuid');
const aws = require('aws-sdk');
const log = require('winston');

var ses = new aws.SES({ region: 'us-east-1' });

function hash(password) {
  return new Promise((resolve, reject) => {

    bcrypt.hash(password, 10, (error, hash) => {
      if (error) { return reject(error) }
      resolve(hash);
    })
  });
}

async function resetPasswordByEmail(email, newPassword) {

  let account = await Account.findOne({
    where: { email: email }
  })

  if (account) {

    let result = await resetPassword(account.id, newPassword);

    return result;
    
  } else {
    throw new Error(`account not found with email: ${email}`);
  }
}

async function resetPassword(accountId, newPassword) {

  let passwordHash = await hash(newPassword);

  await Account.update({
    password_hash: passwordHash
  }, {
    where: {
      id: accountId
    }
  })

  return true;
}

interface Email {
  source: string,
  destination: string,
  subject: string,
  body: string
}

function sendEmail(email: Email): Promise<any> {

  ses.sendEmail({
    Destination: {
      BccAddresses: ['steven@anypay.global'],
      ToAddresses: [email.destination]
    },
    Message: {
      Body: {
        Text: {
          Charset: "UTF-8",
          Data: content
        }
      },
      Subject: {
        Charset: "UTF-8", 
        Data: email.subject
      }
    },
    Source: email.source
  }, (error, response) => {

    if (error) {

      log.error('error sending password reset email', error.message);

      return reject(error)

    }

    log.info(`successfully set password reset email to ${destination}`);

    resolve(response)

  });

}

function sendPasswordResetEmail(email) {
  return new Promise(async (resolve, reject) => {

    let passwordReset = await createPasswordReset(email);

    var ses = new aws.SES({ region: 'us-east-1' });

    ses.sendEmail({
      Destination: {
        BccAddresses: ['steven@anypay.global'],
        ToAddresses: [email]
      },
      Message: {
        Body: {
          Text: {
            Charset: "UTF-8",
            Data: `We got a request to reset your Anypay password.\n\nYou can reset your password by clicking the link below:\n\nhttps://admin.anypay.global/password-reset/${passwordReset.uid}.\n\nIf you ignore this message, your password will not be reset.`
          }
        },
        Subject: {
          Charset: "UTF-8", 
          Data: "Forgotted Password Reset"
        }
      },
      Source: 'password-reset@anypay.global'
    }, (error, response) => {
      if (error) {
        log.error('error sending password reset email', error.message);
        return reject(error)
      }
      log.info(`successfully set password reset email to ${email}`);
      resolve(response)
    })
  })
}

function createPasswordReset(email) {

  return PasswordReset.create({ email })
}

module.exports.resetPasswordById = resetPassword;
module.exports.resetPasswordByEmail = resetPasswordByEmail;
module.exports.sendPasswordResetEmail = sendPasswordResetEmail;
module.exports.createPasswordReset = createPasswordReset;
module.exports.hash = hash;

