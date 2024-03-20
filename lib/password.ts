const bcrypt = require('bcryptjs');

import shortid = require('shortid');
import { config } from './config'

import  { ses } from './email'

import { log } from './log'
import prisma from './prisma';

import { password_resets as PasswordReset } from '@prisma/client';

export function hash(password: string): Promise<string> {
  return new Promise((resolve, reject) => {

    bcrypt.hash(password, 10, (error: Error, hash: string) => {
      if (error) { return reject(error) }
      resolve(hash);
    })
  });
}

export async function resetPasswordByEmail(email: string, newPassword: string) {

  const account = await prisma.accounts.findFirstOrThrow({
    where: { email }
  })

  if (account) {

    let result = await resetPassword(account.id, newPassword);

    return result;
    
  } else {
    throw new Error(`account not found with email: ${email}`);
  }
}

async function resetPassword(accountId: number, newPassword: string): Promise<boolean> {

  let passwordHash = await hash(newPassword);

  await prisma.accounts.update({
    where: { id: accountId },
    data: {
      password_hash: passwordHash
    }
  })

  return true;
}

export async function sendPasswordResetEmail(email: string) {
  return new Promise(async (resolve, reject) => {

    let passwordReset = await createPasswordReset(email);

    const sender = 'no-reply@anypayx.com'

    ses.sendEmail({
      Destination: {
        ToAddresses: [email]
      },
      Message: {
        Body: {
          Text: {
            Charset: "UTF-8",
            Data: `We got a request to reset your Anypay password.\n\nYou can reset your password by clicking the link
            below:\n\nhttps://${config.get('DOMAIN')}/auth/reset-password/${passwordReset.uid}.\n\nIf you ignore this message, your password will not be reset.`
          }
        },
        Subject: {
          Charset: "UTF-8", 
          Data: "Forgotten Password Reset"
        }
      },
      Source: sender
    }, (error: Error, response: unknown) => {
      if (error) {
        log.error('error sending password reset email', error);
        return reject(error)
      }
      log.info(`successfully set password reset email to ${email}`);
      resolve(response)
    })
  })
}

function createPasswordReset(email: string): Promise<PasswordReset> {

  return prisma.password_resets.create({
    data: {
      email,
      uid: shortid.generate(),
      createdAt: new Date(),
      updatedAt: new Date()
    }
  })

}

module.exports.resetPasswordById = resetPassword;
module.exports.resetPasswordByEmail = resetPasswordByEmail;
module.exports.sendPasswordResetEmail = sendPasswordResetEmail;
module.exports.createPasswordReset = createPasswordReset;
module.exports.hash = hash;

