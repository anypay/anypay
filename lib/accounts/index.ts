const bcrypt = require('bcrypt');
import * as Account from '../models/account';
import * as AccessToken from '../models/access_token';

export async function registerAccount(email: string, password: string): Promise<any>{

  let passwordHash = await hash(password);

  let account = await Account.create({
    email: email,
    password_hash: passwordHash
  });

  return account;
}

export async function createAccessToken(accountId: number): Promise<any> {

  let accessToken = AccessToken.create({
    account_id: accountId
  });

  return accessToken;

}

function hash(password) {
  return new Promise((resolve, reject) => {

    bcrypt.hash(password, 10, (error, hash) => {
      if (error) { return reject(error) }
      resolve(hash);
    })
  });
}

