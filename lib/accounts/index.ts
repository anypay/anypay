const bcrypt = require('bcrypt');
import * as Account from '../models/account';

export async function registerAccount(email: string, password: string): Promise<any>{

  let passwordHash = await hash(password);

  let account = await Account.create({
    email: email,
    password_hash: passwordHash
  });

  return account;
}

function hash(password) {
  return new Promise((resolve, reject) => {

    bcrypt.hash(password, 10, (error, hash) => {
      if (error) { return reject(error) }
      resolve(hash);
    })
  });
}

