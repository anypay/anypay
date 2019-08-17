const bcrypt = require('bcrypt');

import { models } from '../models';

import {getAddress, getSupportedCoins} from './supported_coins';

import {emitter} from '../events'
import {AccountAddress} from '../core/types';

export async function registerAccount(email: string, password: string): Promise<any>{

  let passwordHash = await hash(password);

  let account = await models.Account.create({
    email: email,
    password_hash: passwordHash
  });

  if( account ){

    emitter.emit('account.created', account)

  }

  return account;
}

export async function create(email: string, password: string): Promise<any>{

  return registerAccount(email, password)

}

export async function createAccessToken(accountId: number): Promise<any> {

  let accessToken = models.AccessToken.create({
    account_id: accountId
  });

  return accessToken;

}

export async function setName(email: string, name: string): Promise<any> {

  let account = await models.Account.findOne({ where: { email }});

  if (!account) {

    throw new Error(`account ${email} not found`);

  }

  account.business_name = name; 

  await account.save();

  return account;

}

export async function setPhysicalAddress(email: string, address: string): Promise<any> {

  let account = await models.Account.findOne({ where: { email }});

  if (!account) {

    throw new Error(`account ${email} not found`);

  }

  account.physical_address = address; 

  await account.save();

  return account;

}

export async function getAccountAddress(accountId: number, currency: string): Promise<AccountAddress> {

  let coins = await getSupportedCoins(accountId);

  let coin = coins[currency];

  return coins[currency];

}

export function hash(password) {
  return new Promise((resolve, reject) => {

    bcrypt.hash(password, 10, (error, hash) => {
      if (error) { return reject(error) }
      resolve(hash);
    })
  });
}

export {
  getSupportedCoins,
  getAddress
}

