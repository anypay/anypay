

import { models } from './models'

import { log } from './log'

import { compare } from './bcrypt'

export async function withEmailPassword (email, password) {

  var account = await models.Account.findOne({
    where: {
      email: email.toLowerCase()
    }
  });

  if (!account) {
    log.info('no account found for email', email);
    throw new Error('account with email not found');
  }
  try {

    await compare(password, account.password_hash);

  } catch(error) {

    return;
  }
  
  log.info(`password for email ${email} is correct`);

  var token = await models.AccessToken.create({ account_id: account.id })

  return token;
};
