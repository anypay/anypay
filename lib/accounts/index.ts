const bcrypt = require('bcrypt');

import { models } from '../models';
import { awaitChannel } from '../amqp';
import { log } from '../logger';

import {getAddress, getSupportedCoins} from './supported_coins';

import {emitter} from '../events'
import {AccountAddress} from '../core/types';

import * as geocoder from '../googlemaps';

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

  if (updateAttrs.physical_address) {

    try {

      let geocodeResult = await geocoder.geocodeFull(updateAttrs.physical_address, account.id);

      let city = geocoder.parseCity(geocodeResult);
      let state = geocoder.parseState(geocodeResult);
      let country = geocoder.parseCountry(geocodeResult);

      let geolocation = geocodeResult.geometry.location

      updateAttrs.latitude = geolocation.lat;
      updateAttrs.longitude = geolocation.lng;
      updateAttrs.city = city.long_name;
      updateAttrs.state = state.short_name;
      updateAttrs.country = country.short_name;

    } catch (error) {

      log.error('error geocoding address', error.message);

    }

  }

  if (updateAttrs.ambassador_email) {
    let ambassadorAccount = await models.Account.findOne({
      where: {
        email: updateAttrs.ambassador_email
      }
    });

    if (!ambassadorAccount) {
      throw new Error('ambassador email does not exist');
    }

    let ambassador = await models.Ambassador.findOne({
      where: { account_id: ambassadorAccount.id }
    })

    if (ambassador) {
      log.info('ambassador.found', { ambassador })

      updateAttrs['ambassador_id'] = ambassador.id;

      let channel = await awaitChannel();

      await channel.publish('anypay', 'ambassador_set', Buffer.from(JSON.stringify({
        account_id: account.id,
        ambassador_id: ambassador.id,
        ambassador_email: updateAttrs.ambassador_email
      })));

    }

  }

  delete updateAttrs['ambassador_email'];

  if (updateAttrs.remove_ambassador) {
    updateAttrs['ambassador_id'] = null
    delete updateAttrs['remove_ambassador']
  }

  await models.Account.update(updateAttrs, {

    where: { id: account.id }

  });

  account = await models.Account.findOne({ where: {

    id: account.id

  }});

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

export async function setAddressScalar(account_id: number, currency: string, price_scalar: number) {

  log.info('address.scalar.set', { account_id, currency, price_scalar })

  let result = await models.Address.update({
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

function getIntersection(arrA, arrB) {
  return arrA.filter(x => arrB.includes(x));
}

