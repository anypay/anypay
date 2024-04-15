const bcrypt = require('bcryptjs');

import { log } from '../log';

import {getAddress, getSupportedCoins} from './supported_coins';
import { accounts as Account } from '@prisma/client';
import { access_tokens as AccessToken } from '@prisma/client';
import prisma from '../prisma';

import { v4 as uuidv4 } from 'uuid';

interface AccountAddress {
  account_id: number;
  currency: string;
  address: string;
  nonce: number;
  enabled: boolean;
  name?: string;
  code?: string;
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

  const groups: number[][] = await Promise.all(tags.map(async (tag) => {

    const tags = await prisma.account_tags.findMany({
      where: { tag }
    })

    return tags.map((tag: { account_id: any; }) => tag.account_id);

  }));

  var intersection: any = groups.shift();

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
      denomination: 'USD',
      createdAt: new Date(),
      updatedAt: new Date(),
    }
  });

  await prisma.events.create({
    data: {
      account_id: account.id,
      type: 'account.created',
      payload: {
        email,
        id: account.id,
      },
      createdAt: new Date(),
      updatedAt: new Date()
    }
  })

  return account;
}

export async function create(email: string, password: string): Promise<any>{

  return registerAccount(email, password)

}

export async function createAccessToken(accountId: number): Promise<AccessToken> {

  return prisma.access_tokens.create({
    data: {
      account_id: accountId,
      uid: uuidv4(),
      createdAt: new Date(),
      updatedAt: new Date()
    }
  });

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

  const address = await prisma.addresses.findFirstOrThrow({
    where: {
      account_id,
      currency
    }
  });

  await prisma.addresses.update({
    where: {
      id: address.id  
    },
    data: {
      note,
      updatedAt: new Date()
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
