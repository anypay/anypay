const bcrypt = require("bcrypt");
const AccessToken = require("./models/access_token");
const log = require("winston");
import { models } from './models';

export async function bcryptCompare(password, hash) {
  return new Promise((resolve, reject) => {
    bcrypt.compare(password, hash, (error, res) => {
      if (res) {
        resolve();
      } else {
        reject(new Error("invalid email or password"));
      }
    })
  })
}

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

  log.info('found account with email', account.toJSON());


  try {

    await bcryptCompare(password, account.password_hash);

  } catch(error) {

    log.info(`password for email ${email} is incorrect`);

    return;
  }
  
  log.info(`password for email ${email} is correct`);

  var token = await models.AccessToken.create({ account_id: account.id })

  return token;
};
