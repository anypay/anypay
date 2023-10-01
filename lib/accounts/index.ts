const bcrypt = require('bcryptjs');

import { log } from '../log';

import * as database from '../database';

import { accounts } from '@prisma/client'

import {getAddress, getSupportedCoins} from './supported_coins';
import { prisma } from '../prisma';

interface AccountAddress {
  account_id: number;
  currency: string;
  address: string;
  nonce: number;
  enabled: boolean;
  name?: string;
  code?: string;
}

export async function near(latitude, longitude, limit=100) {
let query = `SELECT *,
	ST_Distance(
    position,
    'SRID=4326;POINT(${parseFloat(longitude)} ${parseFloat(latitude)})'::geometry
    ) AS distance
    from accounts where position is not null and business_name is not null order by distance limit ${limit};`

  let result = await database.query(query)

  return result[0]
}

function pointFromLatLng(lat, lng) {

  let point = {
    type: 'Point',
    coordinates: [lat, lng],
    crs: { type: 'name', properties: { name: 'EPSG:4326'} }
  }

  return point

}

export async function setPositionFromLatLng(account: accounts): Promise<accounts> {

  let point = pointFromLatLng(account.latitude, account.longitude)

  account.position = point

  await account.save()

  return 

  return models.Account.findOne({ where: { id: account.id }})

}

export async function findByEmail(email) {

  return models.Account.findOne({ where: { email }});

}

export async function updateAccount(account, payload) {

  if (!account) {

    return {

      success: false,

      error: 'account not found'

    }

  }

  let updateAttrs: any = Object.assign(payload, {});

  log.info('account.update', updateAttrs)

  await account.update(updateAttrs)

  return account

}

export async function findAllWithTags(tags: string[]): Promise<any> {

  const groups = await Promise.all(tags.map(async (tag) => {

    let tags = await models.AccountTag.findAll({
      where: { tag }
    })

    return tags.map(tag => tag.account_id);

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

export async function registerAccount(email: string, password: string): Promise<accounts>{

  let passwordHash = await hash(password);

  const account = await prisma.accounts.create({
    data: {
        email,
        password_hash: passwordHash,
        createdAt: new Date(),
        updatedAt: new Date()
    }
  })

  if( account ){

    await log.info('account.created', {
      id: account.id,
      account_id: account.id,
      email: account.email
    })

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

export async function setAddressScalar(account_id: number, currency: string, price_scalar: number) {

  log.info('address.scalar.set', { account_id, currency, price_scalar })

  await models.Address.update({
    price_scalar 
  }, {
    where: {
      account_id,
      currency
    }
  })

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

  return coin;

}

export function hash(password: string): Promise<string> {
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

function getIntersection(arrA, arrB) {
  return arrA.filter(x => arrB.includes(x));
}

