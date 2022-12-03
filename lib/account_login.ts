

import { models } from './models'

import { log } from './log'

import { compare } from './bcrypt'

export async function withEmailPassword (email, password) {
  log.info("lookup email for login", email);


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

    const result = await compare(password, account.password_hash);

    console.log('COMPARE RESULT', result)

  } catch(error) {

    log.info(`password for email ${email} is incorrect`);

    return;
  }
  
  log.info(`password for email ${email} is correct`);

  var token = await models.AccessToken.create({ account_id: account.id })

  return token;
};
