const bcrypt = require('bcryptjs');

import { models } from '../models';

import { log } from '../log';

import * as database from '../database';

import {getAddress, getSupportedCoins} from './supported_coins';
import { accounts as Account } from '@prisma/client';
import prisma from '../prisma';

interface AccountAddress {
  account_id: number;
  currency: string;
  address: string;
  nonce: number;
  enabled: boolean;
  name?: string;
  code?: string;
}

export async function near(latitude: number, longitude: number, limit=100) {
let query = `SELECT *,
	ST_Distance(
    position,
    'SRID=4326;POINT(${longitude} ${latitude})'::geometry
    ) AS distance
    from accounts where position is not null and business_name is not null order by distance limit ${limit};`

  let result = await database.query(query)

  return result[0]
}

export async function findByEmail(email: string): Promise<Account | null> {

  return prisma.accounts.findFirst({ where: { email }});

}

export async function updateAccount(account: Account, payload: any): Promise<Account> {

  let updateAttrs: any = Object.assign(payload, {});
  
  await prisma.accounts.update({
    where: { id: account.id },
    data: updateAttrs
  
  })

  const updatedAccount = await prisma.accounts.findFirstOrThrow({ where: { id: account.id }});

  log.info('account.updated', updatedAccount)

  return updatedAccount

}

export async function findAllWithTags(tags: string[]): Promise<any> {

  const groups = await Promise.all(tags.map(async (tag) => {

    let tags = await models.AccountTag.findAll({
      where: { tag }
    })

    return tags.map((tag: { account_id: any; }) => tag.account_id);

  }));

  var intersection = groups.shift();

  groups.forEach(group => {

    intersection = getIntersection(intersection, group);

  });

  log.info('accounts.findallwithtags.result', {

    tags,

    account_ids: intersection

  });

  return intersection;

}

export async function registerAccount(email: string, password: string): Promise<Account>{

  let passwordHash = await hash(password);

  let account = await prisma.accounts.findFirst({
    where: {
      email
    }
  });

  if (account) {
      
      throw new Error(`account ${email} already exists`);
  }

  account = await prisma.accounts.create({
    data: {
      email,
      password_hash: passwordHash,
      createdAt: new Date(),
      updatedAt: new Date()
    }
  });

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

export async function setName(account: Account, name: string): Promise<any> {

  account = await prisma.accounts.update({
    where: { id: account.id },
    data: {
      business_name: name
    }
  });

  return account;

}

export async function setPhysicalAddress(account: Account, address: string): Promise<any> {

  account = await prisma.accounts.update({
    where: { id: account.id },
    data: {
      physical_address: address
    }
  });

  return account;

}

export async function setAddressNote(account_id: number, currency: string, note: string) {

  await models.Address.update({
    note 
  }, {
    where: {
      account_id,
      currency
    }
  })

}

export async function getAccountAddress(accountId: number, currency: string): Promise<AccountAddress> {

  let coins = await getSupportedCoins(accountId);

  let coin = coins[currency];

  const address = await prisma.addresses.findFirstOrThrow({
    where: {
      account_id: accountId,
      currency
    }
  });

  return {
    currency: coin.currency,
    enabled: coin.enabled,
    address: String(address.value),
    nonce: 0,
    account_id: accountId
  };

}

export function hash(password: string): Promise<string> {
  return new Promise((resolve, reject) => {

    bcrypt.hash(password, 10, (error: Error, hash: string) => {
      if (error) { return reject(error) }
      resolve(hash);
    })
  });
}

export {
  getSupportedCoins,
  getAddress
}

function getIntersection(arrA: any[], arrB: any[]): any[] {
  return arrA.filter(x => arrB.includes(x));
}
