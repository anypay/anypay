
import * as speakeasy from 'speakeasy';

import * as models from './models';

export async function getAccountSecret(email: string) {

  let account = await models.Account.findOne({ where: { email }});

  if (!account.authenticator_secret) {

    let secret = speakeasy.generateSecret();

    account.authenticator_secret = secret.base32;

    await account.save();

  }

  return account.authenticator_secret;

}

export async function verifyAccountToken(email: string, token: string) {

  let account = await models.Account.findOne({ where: { email }});

  var verified = speakeasy.totp.verify({
    secret: account.authenticator_secret,
    token,
    encoding: 'base32'
  });

  return verified;
}

export function buildAutheneticatorURL(email, secret) {

  return `otpauth://totp/${email}?secret=${secret}&issuer=AnyPay.Global`;

}

export async function deleteAccountSecret(email, token) {

  let account = await models.Account.findOne({ where: { email }});

  let verified = await verifyAccountToken(email, token);

  if (verified) {

    account.authenticator_secret = null;

    await account.save();

  }

  return verified;

}
