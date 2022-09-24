
import { AccessToken, ensureAccessToken } from './access_tokens'

import { Account } from './account'

import { findOne } from './orm'

import { log } from './log'

import { compare } from './bcrypt'

export async function withEmailPassword(email: string, password: string): Promise<AccessToken> {
  
  log.debug("accountLogin.withEmailPassword", {email});

  var account = await findOne<Account>(Account, {
    where: {
      email: email.toLowerCase()
    }
  });

  if (!account) {

    const error = new Error(`email: ${email}`)

    log.error('account.unknown', error);

    throw error;

  }

  try {

    const hash = account.get('password_hash')

    let valid = await compare(password,  hash);

    if (!valid) {

      throw new Error('invalid password')
      
    }

  } catch(error) {

    log.error(`accountLogin.withEmailPassword.incorrect`, error);

    throw error

  }
  
  log.debug(`accountLogin.withEmailPassword.correct`, { email });

  return ensureAccessToken(account)

};
